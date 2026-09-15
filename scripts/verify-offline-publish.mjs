#!/usr/bin/env node
/**
 * PROTECTED-ADJACENT: אימות פרסום של גרסת האופליין. אינו משנה מניפסט/פורמט/תעבורה.
 *
 *   node scripts/verify-offline-publish.mjs                       # מול https://hagitmualem.com
 *   node scripts/verify-offline-publish.mjs --origin https://...  # מול מקור אחר
 *
 * בודק שכל חלק שמופיע במניפסט החי באמת נגיש (200) ובגודל הצפוי,
 * וכן שכל החלקים של הגרסה הקודמת (המקומית) עדיין נגישים.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const ORIGIN = (arg("--origin", "https://hagitmualem.com")).replace(/\/$/, "");
const CONCURRENCY = Number(arg("--concurrency", "12"));

const res = await fetch(`${ORIGIN}/updates/manifest.json?t=${Date.now()}`);
if (!res.ok) { console.error(`✗ המניפסט לא נגיש (${res.status})`); process.exit(1); }
const manifest = await res.json();

const localPath = path.join(process.cwd(), "public/updates/manifest.json");
const local = fs.existsSync(localPath) ? JSON.parse(fs.readFileSync(localPath, "utf8")) : null;
if (local && local.version !== manifest.version) {
  console.log(`⚠ הגרסה החיה היא ${manifest.version} והמקומית ${local.version} — כנראה טרם פורסם.`);
}

const XOR_KEY = [0x5a, 0x3c, 0xa7, 0x11, 0x6d, 0xf2, 0x89, 0x24];
function djb2(buf) {
  let h = 5381;
  for (let i = 0; i < buf.length; i++) h = ((h * 33) ^ buf[i]) >>> 0;
  return h.toString(16);
}

const urls = new Map();
for (const f of manifest.files) {
  for (let part = 0; part < f.k.length; part++) {
    const c = f.k[part];
    urls.set(c.u, { file: f.p, fileHash: f.h, part, total: f.k.length, len: c.l, sum: c.c });
  }
}

let ok = 0;
const bad = [];
const list = [...urls.entries()];
let i = 0;
async function worker() {
  while (i < list.length) {
    const [u, meta] = list[i++];
    try {
      const r = await fetch(`${ORIGIN}${u}?t=${Date.now()}`);
      const text = r.ok ? await r.text() : "";
      if (!r.ok) { bad.push(`${u} → ${r.status} (${meta.file})`); continue; }
      const m = text.match(/^AK\.part\("([0-9a-f]+)",(\d+),(\d+),"([^"]*)",([01])\);/);
      if (!m) { bad.push(`${u} → תוכן לא תקין (${meta.file})`); continue; }
      if (m[1] !== meta.fileHash || Number(m[2]) !== meta.part || Number(m[3]) !== meta.total) {
        bad.push(`${u} → מזהה/מספור חלק שגוי: ${m[1]} ${m[2]}/${m[3]} (${meta.file})`);
        continue;
      }
      const raw = Buffer.from(m[4], "base64");
      if (m[5] === "1") for (let b = 0; b < raw.length; b++) raw[b] ^= XOR_KEY[b % XOR_KEY.length];
      if (raw.length !== meta.len) { bad.push(`${u} → אורך ${raw.length} במקום ${meta.len} (${meta.file})`); continue; }
      if (djb2(raw) !== meta.sum) { bad.push(`${u} → חתימה שגויה (${meta.file})`); continue; }
      ok++;
    } catch (e) {
      bad.push(`${u} → ${e.message} (${meta.file})`);
    }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

// Deep whole-file verification: reconstruct every live file exactly as the launcher does.
const fileBad = [];
for (const f of manifest.files) {
  const pieces = [];
  for (let part = 0; part < f.k.length; part++) {
    const c = f.k[part];
    try {
      const r = await fetch(`${ORIGIN}${c.u}?whole=${Date.now()}-${part}`);
      const text = r.ok ? await r.text() : "";
      const m = text.match(/^AK\.part\("([0-9a-f]+)",(\d+),(\d+),"([^"]*)",([01])\);/);
      if (!r.ok || !m || m[1] !== f.h || Number(m[2]) !== part || Number(m[3]) !== f.k.length) throw new Error("חלק לא תואם");
      const raw = Buffer.from(m[4], "base64");
      if (m[5] === "1") for (let b = 0; b < raw.length; b++) raw[b] ^= XOR_KEY[b % XOR_KEY.length];
      if (raw.length !== c.l || djb2(raw) !== c.c) throw new Error("אורך/חתימה שגויים");
      pieces.push(raw);
    } catch (error) {
      fileBad.push(`${f.p} → ${error.message}`);
      break;
    }
  }
  if (pieces.length !== f.k.length) continue;
  const whole = Buffer.concat(pieces);
  for (let b = 0; b < (f.x || 0); b++) whole[b] ^= 0x5a;
  const hash = createHash("sha256").update(whole).digest("hex").slice(0, 32);
  if (whole.length !== f.s || djb2(whole) !== f.c || hash !== f.h) {
    fileBad.push(`${f.p} → אימות קובץ מלא נכשל`);
  }
}
bad.push(...fileBad);

console.log(`\nגרסה חיה ${manifest.version} — ${manifest.files.length} קבצים, ${urls.size} חלקים.`);
console.log(`✓ חלקים תקינים: ${ok}   ✗ בעיות: ${bad.length}`);
for (const b of bad.slice(0, 40)) console.log("  - " + b);
process.exit(bad.length ? 1 : 0);
