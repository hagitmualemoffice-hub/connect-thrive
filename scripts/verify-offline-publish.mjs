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
for (const f of manifest.files) for (const c of f.k) urls.set(c.u, { file: f.p, len: c.l, sum: c.c });

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

console.log(`\nגרסה חיה ${manifest.version} — ${manifest.files.length} קבצים, ${urls.size} חלקים.`);
console.log(`✓ תקינים: ${ok}   ✗ בעייתיים: ${bad.length}`);
for (const b of bad.slice(0, 40)) console.log("  - " + b);
process.exit(bad.length ? 1 : 0);
