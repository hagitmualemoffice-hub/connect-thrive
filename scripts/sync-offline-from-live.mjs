#!/usr/bin/env node
/**
 * PROTECTED: packager for the file:// + NetFree offline app. See docs/OFFLINE-ARCHITECTURE.md.
 * Chunk size, XOR mask, manifest fields (u/l/c) and DJB2 must stay in sync with the bootstrap.
 *
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
// 32KB גולמי (~44KB אחרי base64). נמצא בבדיקה חיה (probe.html, ספט' 2026) שסינון NetFree
// חוסם מטענים "בינאריים" מעל סף שבין 50KB ל-90KB; 32KB נותן מרווח ביטחון נוח.
const CHUNK_RAW = 32 * 1024;
const XOR_KEY = [0x5a, 0x3c, 0xa7, 0x11, 0x6d, 0xf2, 0x89, 0x24];
// שיבוש חתימת הפתיחה (magic bytes) של קבצים בינאריים בלבד: NetFree חוסם תגובה שמתחילה
// בחתימת JPEG וכו'. רק 24 הבתים הראשונים מעורבלים (XOR 0x5a); קובץ ההפעלה (rev 8+)
// משחזר אותם פעם אחת אחרי הרכבת הקובץ, לפני אימות האורך/החתימה.
const HDR_LEN = 24;
const HDR_XOR = 0x5a;
const BINARY_EXT = /\.(jpe?g|png|webp|gif|avif|bmp|ico|pdf|mp3|m4a|wav|ogg|mp4|webm|woff2?|ttf|otf)$/i;

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
  // x = מספר בתים בתחילת הקובץ ששובשו (רק בקבצים בינאריים). h/s/c תמיד על התוכן המקורי.
  const x = BINARY_EXT.test(rel) && buf.length > HDR_LEN ? HDR_LEN : 0;
  const packBuf = Buffer.from(buf);
  for (let i = 0; i < x; i++) packBuf[i] ^= HDR_XOR;
  const e = {
    p: rel,
    h: createHash("sha256").update(buf).digest("hex").slice(0, 32),
    s: buf.length,
    c: djb2(buf),
    buf: packBuf,
  };
  if (x) e.x = x;
  entries.push(e);
}

/* ---------- 3. אריזה של מה שהשתנה בלבד ---------- */
fs.mkdirSync(PARTS_DIR, { recursive: true });
let packed = 0, reused = 0;
// m:0 = חלקים ללא ערבול XOR, z = גודל החלק הגולמי שבו נארזו.
// רשומות ישנות (ממוסכות או בגודל חלק אחר) נארזות מחדש כדי לעבור סינון NetFree.
const asMeta = (v) =>
  Array.isArray(v) ? null : v && Array.isArray(v.k) && v.m === 0 && v.z === CHUNK_RAW ? v : null;
for (const f of entries) {
  const prev = asMeta(parts[f.h]);
  if (prev && prev.k.every((c) => fs.existsSync(path.join(root, "public", c.u)))) {
    f.k = prev.k;
    f.j = prev.k.map((c) => c.u);
    reused++;
  } else {
    const n = Math.max(1, Math.ceil(f.buf.length / CHUNK_RAW));
    const k = [];
    for (let i = 0; i < n; i++) {
      const slice = f.buf.subarray(i * CHUNK_RAW, (i + 1) * CHUNK_RAW);
      const name = `${f.h}.${i}.js`;
      // ללא ערבול XOR: תוכן "רגיל" עובר טוב יותר במסנני תוכן (NetFree).
      // הדגל האחרון (0) אומר לקובץ הפתיחה לא לבצע פענוח XOR.
      fs.writeFileSync(path.join(PARTS_DIR, name), `AK.part("${f.h}",${i},${n},"${Buffer.from(slice).toString("base64")}",0);\n`);
      // u=כתובת, l=אורך בבתים, c=חתימה של החלק
      k.push({ u: "/updates/parts/" + name, l: slice.length, c: djb2(slice) });
    }
    parts[f.h] = { k, m: 0, z: CHUNK_RAW };
    f.k = k;
    f.j = k.map((c) => c.u);
    packed++;
    console.log(`↑ ${f.p} (${n} חלקים)`);
  }
  delete f.buf;
}
fs.writeFileSync(PARTS_REGISTRY, JSON.stringify(parts, null, 2));

/* ---------- 4. אימות: כל חלק שמופיע במניפסט חייב להיות קיים ותקין על הדיסק ---------- */
const problems = [];
for (const f of entries) {
  let sum = 0;
  for (const c of f.k) {
    const abs = path.join(root, "public", c.u);
    if (!fs.existsSync(abs)) { problems.push(`${f.p}: חסר ${c.u}`); continue; }
    const txt = fs.readFileSync(abs, "utf8");
    const m = txt.match(/^AK\.part\("([0-9a-f]+)",(\d+),(\d+),"([^"]*)",([01])\);/);
    if (!m || m[1] !== f.h) { problems.push(`${f.p}: ${c.u} פגום`); continue; }
    const raw = Buffer.from(m[4], "base64");
    if (m[5] === "1") for (let b = 0; b < raw.length; b++) raw[b] ^= XOR_KEY[b % XOR_KEY.length];
    if (raw.length !== c.l) { problems.push(`${f.p}: ${c.u} אורך ${raw.length} במקום ${c.l}`); continue; }
    if (djb2(raw) !== c.c) { problems.push(`${f.p}: ${c.u} חתימה שגויה`); continue; }
    sum += raw.length;
  }
  if (sum !== f.s) problems.push(`${f.p}: סכום החלקים ${sum} במקום ${f.s}`);
}
if (problems.length) {
  console.error(`\n✗ העדכון בוטל — ${problems.length} בעיות בחלקים. המניפסט לא נכתב:`);
  for (const p of problems.slice(0, 30)) console.error("  - " + p);
  process.exit(1);
}
console.log(`✓ אומתו ${entries.reduce((n, f) => n + f.k.length, 0)} חלקים (אורך + חתימה) לפני כתיבת המניפסט.`);

/* ---------- 5. מניפסט ---------- */
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

/* ---------- 6. ניקוי חלקים שאינם בשימוש (משאירים גם את הגרסה הקודמת) ---------- */
const keep = new Set(entries.flatMap((f) => f.j.map((u) => path.basename(u))));
const keptHashes = new Set(entries.map((f) => f.h));
// חלקים של הגרסה הקודמת נשמרים כדי שמשתמשות שנמצאות באמצע עדכון לא יקבלו 404
if (previous) {
  for (const f of previous.files || []) {
    keptHashes.add(f.h);
    for (const c of f.k || []) keep.add(path.basename(c.u));
  }
}
let removed = 0;
for (const name of fs.readdirSync(PARTS_DIR)) {
  if (!keep.has(name)) { fs.rmSync(path.join(PARTS_DIR, name)); removed++; }
}
for (const h of Object.keys(parts)) {
  if (!keptHashes.has(h)) delete parts[h];
}
fs.writeFileSync(PARTS_REGISTRY, JSON.stringify(parts, null, 2));

if (missing.length) console.log(`\n⚠ לא נמצאו באתר: ${missing.join(", ")}`);
console.log(
  `\nגרסה ${version} (${manifest.stage}) — ${entries.length} קבצים, ` +
    `${packed} נארזו מחדש, ${reused} ללא שינוי, ${removed} חלקים ישנים נמחקו.` +
    (sameAsPrev ? "\nלא זוהה שינוי מול הגרסה הקודמת." : "\nכעת יש לפרסם את האתר."),
);
