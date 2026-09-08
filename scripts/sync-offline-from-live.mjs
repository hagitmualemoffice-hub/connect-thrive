#!/usr/bin/env node
/**
 * מסנכרן את גרסת האופליין ("אחותי כלה") ישירות מהאתר החי שפורסם.
 *
 *   node scripts/sync-offline-from-live.mjs                 # ליבה בלבד (HTML/CSS/JS/אייקונים)
 *   node scripts/sync-offline-from-live.mjs --with-media    # כולל תמונות/PDF/גופנים
 *   node scripts/sync-offline-from-live.mjs --source https://achotikala.com
 *
 * מה הוא עושה:
 *  1. מוריד את הדף החי ואת כל הקבצים שהוא מפנה אליהם.
 *  2. מחשב חתימה לכל קובץ; קבצים שלא השתנו — לא נארזים מחדש.
 *  3. קבצים חדשים/שהשתנו מומרים לחלקי .js (AK.part) תחת public/updates/parts/.
 *  4. נכתב מניפסט חדש (public/updates/manifest.js + manifest.json) עם מספר גרסה עולה.
 *
 * אחרי הרצה — לפרסם את האתר. המשתמשות יקבלו את העדכון אוטומטית בפתיחה הבאה.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);

const SOURCE = (arg("--source", "https://achotikala.com")).replace(/\/$/, "");
const WITH_IMAGES = args.includes("--with-images");
const WITH_MEDIA = args.includes("--with-media") || WITH_IMAGES;
const versionArg = args.includes("--version") ? Number(arg("--version")) : null;

const OUT_DIR = path.join(root, "public/updates");
const PARTS_DIR = path.join(OUT_DIR, "parts");
const MANIFEST_JSON = path.join(OUT_DIR, "manifest.json");
const MANIFEST_JS = path.join(OUT_DIR, "manifest.js");
const PARTS_REGISTRY = path.join(root, "scripts/offline-parts-registry.json");
const CHUNK_RAW = 600 * 1024;

const parts = fs.existsSync(PARTS_REGISTRY) ? JSON.parse(fs.readFileSync(PARTS_REGISTRY, "utf8")) : {};
const previous = fs.existsSync(MANIFEST_JSON) ? JSON.parse(fs.readFileSync(MANIFEST_JSON, "utf8")) : null;

function djb2(buf) {
  let h = 5381;
  for (let i = 0; i < buf.length; i++) h = ((h * 33) ^ buf[i]) >>> 0;
  return h.toString(16);
}

const cache = new Map();
async function get(rel) {
  if (cache.has(rel)) return cache.get(rel);
  const res = await fetch(SOURCE + "/" + rel);
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  cache.set(rel, buf);
  return buf;
}

const MEDIA_EXT = /\.(jpe?g|png|webp|gif|avif|svg|ico|pdf|mp3|m4a|wav|ogg|mp4|webm|woff2?|ttf|otf)$/i;

/* ---------- 1. איסוף הקבצים מהאתר החי ---------- */
const wanted = new Set(["index.html"]);
const indexBuf = await (async () => {
  const r = await fetch(SOURCE + "/");
  if (!r.ok) throw new Error(`לא ניתן להוריד את ${SOURCE} (${r.status})`);
  return Buffer.from(await r.arrayBuffer());
})();
cache.set("index.html", indexBuf);
const html = indexBuf.toString("utf8");

for (const m of html.matchAll(/(?:src|href)="\/([^"]+)"/g)) {
  const p = m[1].split("?")[0];
  if (p.startsWith("~")) continue; // סקריפטים של הפלטפורמה — לא חלק מהאפליקציה
  wanted.add(p);
}
wanted.add("favicon.ico");

// אייקונים מתוך ה-webmanifest
const wm = await get("manifest.webmanifest");
if (wm) {
  try {
    for (const i of JSON.parse(wm.toString("utf8")).icons || []) {
      if (i.src) wanted.add(i.src.replace(/^\//, "").split("?")[0]);
    }
  } catch {}
}

// מדיה שמוזכרת בתוך ה-JS/CSS/HTML (תמונות, אייקונים, גופנים, רקעים ב-CSS)
const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|svg|ico|woff2?|ttf|otf)$/i;
if (WITH_MEDIA) {
  const wantExt = WITH_IMAGES && !args.includes("--with-media") ? IMAGE_EXT : MEDIA_EXT;
  const scan = (text) => {
    for (const m of text.matchAll(/["'(]\s*\/?((?:assets|images|img|media|files|fonts|lovable-uploads)\/[A-Za-z0-9._%\-\u0590-\u05FF ]+)\s*["')]/g)) {
      const p = m[1].split("?")[0];
      if (wantExt.test(p)) wanted.add(p);
    }
  };
  scan(html);
  for (const rel of [...wanted]) {
    if (!/\.(js|css)$/i.test(rel)) continue;
    const buf = await get(rel);
    if (buf) scan(buf.toString("utf8"));
  }
  // סבב שני: CSS שהתגלה בתוך ה-JS
  for (const rel of [...wanted]) {
    if (!/\.css$/i.test(rel)) continue;
    const buf = await get(rel);
    if (buf) scan(buf.toString("utf8"));
  }
}

/* ---------- 2. הורדה + חתימה ---------- */
const entries = [];
const missing = [];
for (const rel of [...wanted].sort()) {
  const buf = await get(rel);
  if (!buf) { missing.push(rel); continue; }
  entries.push({
    p: rel,
    h: createHash("sha256").update(buf).digest("hex").slice(0, 32),
    s: buf.length,
    c: djb2(buf),
    buf,
  });
}

/* ---------- 3. אריזה של מה שהשתנה בלבד ---------- */
fs.mkdirSync(PARTS_DIR, { recursive: true });
let packed = 0, reused = 0;
for (const f of entries) {
  if (parts[f.h] && parts[f.h].every((u) => fs.existsSync(path.join(root, "public", u)))) {
    f.j = parts[f.h];
    reused++;
  } else {
    const n = Math.max(1, Math.ceil(f.buf.length / CHUNK_RAW));
    const urls = [];
    for (let i = 0; i < n; i++) {
      const slice = f.buf.subarray(i * CHUNK_RAW, (i + 1) * CHUNK_RAW);
      const name = `${f.h}.${i}.js`;
      fs.writeFileSync(path.join(PARTS_DIR, name), `AK.part("${f.h}",${i},${n},"${slice.toString("base64")}");\n`);
      urls.push("/updates/parts/" + name);
    }
    parts[f.h] = urls;
    f.j = urls;
    packed++;
    console.log(`↑ ${f.p} (${n} חלקים)`);
  }
  delete f.buf;
}
fs.writeFileSync(PARTS_REGISTRY, JSON.stringify(parts, null, 2));

/* ---------- 4. מניפסט ---------- */
const sameAsPrev =
  previous &&
  previous.files.length === entries.length &&
  previous.files.every((f, i) => f.p === entries[i].p && f.h === entries[i].h);

const version = versionArg ?? (sameAsPrev ? previous.version : (previous ? previous.version + 1 : 1));
const manifest = {
  version,
  generated: new Date().toISOString(),
  entry: "index.html",
  source: SOURCE,
  stage: WITH_MEDIA ? "full" : "core",
  files: entries,
};
fs.writeFileSync(MANIFEST_JSON, JSON.stringify(manifest, null, 2));
fs.writeFileSync(
  MANIFEST_JS,
  `/* נוצר אוטומטית ע"י scripts/sync-offline-from-live.mjs */\n` +
    `window.AKUPD_MANIFEST && window.AKUPD_MANIFEST(${JSON.stringify(manifest)});\n`,
);

/* ---------- 5. ניקוי חלקים שאינם בשימוש ---------- */
const keep = new Set(entries.flatMap((f) => f.j.map((u) => path.basename(u))));
let removed = 0;
for (const name of fs.readdirSync(PARTS_DIR)) {
  if (!keep.has(name)) { fs.rmSync(path.join(PARTS_DIR, name)); removed++; }
}
for (const h of Object.keys(parts)) {
  if (!entries.some((f) => f.h === h)) delete parts[h];
}
fs.writeFileSync(PARTS_REGISTRY, JSON.stringify(parts, null, 2));

if (missing.length) console.log(`\n⚠ לא נמצאו באתר: ${missing.join(", ")}`);
console.log(
  `\nגרסה ${version} (${manifest.stage}) — ${entries.length} קבצים, ` +
    `${packed} נארזו מחדש, ${reused} ללא שינוי, ${removed} חלקים ישנים נמחקו.` +
    (sameAsPrev ? "\nלא זוהה שינוי מול הגרסה הקודמת." : "\nכעת יש לפרסם את האתר."),
);
