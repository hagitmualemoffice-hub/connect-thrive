#!/usr/bin/env node
/**
 * בונה/מעדכן את ערוץ העדכונים של "אחותי כלה" באתר hagitmualem.com
 *
 * שימוש:
 *   node scripts/build-offline-update.mjs <תיקיית-האפליקציה> [--version N]
 *
 * מה הוא עושה:
 *  1. סורק את כל הקבצים בתיקייה ומחשב חתימה (sha256) לכל קובץ.
 *  2. קבצים שכבר הועלו בעבר (אותה חתימה) — לא מועלים שוב.
 *  3. קבצים חדשים/שהשתנו מועלים לאחסון של האתר (אותו דומיין).
 *  4. נכתב מניפסט חדש ב-public/updates/manifest.js (+ .json).
 *
 * הרישום של מה שכבר הועלה נשמר ב-scripts/offline-update-registry.json
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const root = process.cwd();
const args = process.argv.slice(2);
const srcDir = args[0];
if (!srcDir) {
  console.error("usage: node scripts/build-offline-update.mjs <app-folder> [--version N]");
  process.exit(1);
}
const versionArg = args.includes("--version") ? Number(args[args.indexOf("--version") + 1]) : null;

const REGISTRY = path.join(root, "scripts/offline-update-registry.json");
const OUT_DIR = path.join(root, "public/updates");
const MANIFEST_JS = path.join(OUT_DIR, "manifest.js");

const registry = fs.existsSync(REGISTRY) ? JSON.parse(fs.readFileSync(REGISTRY, "utf8")) : {};

/** checksum מהיר שהדפדפן יודע לחשב גם ב-file:// (אין crypto.subtle שם) */
function djb2(buf) {
  let h = 5381;
  for (let i = 0; i < buf.length; i++) h = ((h * 33) ^ buf[i]) >>> 0;
  return h.toString(16);
}

function walk(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile()) out.push(path.relative(base, full).split(path.sep).join("/"));
  }
  return out;
}

// קבצים שאינם חלק מהאתר עצמו (מפעילים/הסברים) או שמנוהלים ע"י המערכת החדשה
const SKIP = new Set([
  "bootstrap.js",
  "update-config.js",
  "START-achotikala.cmd",
  "desktop-shortcut.cmd",
]);
const SKIP_EXT = new Set([".cmd", ".bat", ".exe", ".lnk"]);

const files = walk(path.resolve(srcDir))
  .filter((p) => !SKIP.has(p))
  .filter((p) => !SKIP_EXT.has(path.extname(p).toLowerCase()))
  .filter((p) => !p.endsWith(".asset.json"))
  .sort();

console.log(`נמצאו ${files.length} קבצים`);

const previous = fs.existsSync(MANIFEST_JS)
  ? JSON.parse(fs.readFileSync(MANIFEST_JS, "utf8").replace(/^[^{]*/, "").replace(/\);?\s*$/, ""))
  : null;

const version = versionArg ?? (previous ? previous.version + 1 : 1);
const entries = [];
let uploaded = 0;
let reused = 0;

for (const rel of files) {
  const abs = path.join(path.resolve(srcDir), rel);
  const buf = fs.readFileSync(abs);
  const hash = createHash("sha256").update(buf).digest("hex").slice(0, 32);

  if (!registry[hash]) {
    const tmp = path.join(os.tmpdir(), `${hash}.bin`);
    fs.writeFileSync(tmp, buf);
    const out = execFileSync("lovable-assets", ["create", "--file", tmp], { encoding: "utf8" });
    const asset = JSON.parse(out);
    registry[hash] = asset.url;
    fs.rmSync(tmp, { force: true });
    fs.writeFileSync(REGISTRY, JSON.stringify(registry, null, 2));
    uploaded++;
    console.log(`↑ ${rel}`);
  } else {
    reused++;
  }

  entries.push({ p: rel, h: hash, s: buf.length, c: djb2(buf), u: registry[hash] });
}

const manifest = {
  version,
  generated: new Date().toISOString(),
  entry: "index.html",
  files: entries,
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  MANIFEST_JS,
  `/* נוצר אוטומטית ע"י scripts/build-offline-update.mjs */\n` +
    `window.AKUPD_MANIFEST && window.AKUPD_MANIFEST(${JSON.stringify(manifest)});\n`,
);
fs.writeFileSync(path.join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

console.log(`\nגרסה ${version} מוכנה. הועלו ${uploaded} קבצים, ${reused} נותרו ללא שינוי.`);
console.log(`כעת יש לפרסם את האתר כדי שהמניפסט יעלה לאוויר.`);
