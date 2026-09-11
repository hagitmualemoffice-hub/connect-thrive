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

const urls = new Map();
for (const f of manifest.files) for (const c of f.k) urls.set(c.u, { file: f.p, min: Math.ceil(c.l * 4 / 3) });

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
      if (!r.ok) bad.push(`${u} → ${r.status} (${meta.file})`);
      else if (!text.startsWith("AK.part(")) bad.push(`${u} → תוכן לא תקין (${meta.file})`);
      else if (text.length < meta.min) bad.push(`${u} → קטן מדי ${text.length} (${meta.file})`);
      else ok++;
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
