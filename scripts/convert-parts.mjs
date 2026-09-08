#!/usr/bin/env node
/**
 * ממיר את קבצי המניפסט הקיימים לערוץ ההעברה המוכח מול NetFree:
 * כל קובץ נשלח כקבצי .js אמיתיים שנטענים בתג <script> וקוראים ל-AK.part(...).
 *
 *   node scripts/convert-parts.mjs                 # ממיר את כל הקבצים במניפסט
 *   node scripts/convert-parts.mjs --only app.js   # ממיר קובץ אחד (בדיקה)
 *
 * מקור התוכן: אם הקובץ כבר קיים ברישום (registry) עם כתובת — מורידים משם.
 */
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const root = process.cwd();
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;

const CDN_ORIGIN = "https://hagitmualem.com";
const CHUNK_RAW = 600 * 1024; // ~800KB בסיס64 לכל חלק
const OUT_DIR = path.join(root, "public/updates");
const MANIFEST_JSON = path.join(OUT_DIR, "manifest.json");
const MANIFEST_JS = path.join(OUT_DIR, "manifest.js");
const PARTS_REGISTRY = path.join(root, "scripts/offline-parts-registry.json");

const manifest = JSON.parse(fs.readFileSync(MANIFEST_JSON, "utf8"));
const parts = fs.existsSync(PARTS_REGISTRY) ? JSON.parse(fs.readFileSync(PARTS_REGISTRY, "utf8")) : {};

async function fetchBuf(url) {
  const r = await fetch(url.startsWith("http") ? url : CDN_ORIGIN + url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

const PARTS_DIR = path.join(OUT_DIR, "parts");
function writeJs(name, text) {
  fs.mkdirSync(PARTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(PARTS_DIR, name), text);
  return "/updates/parts/" + name;
}

const targets = manifest.files.filter((f) => (only ? f.p === only : true));
if (!targets.length) {
  console.error("לא נמצאו קבצים להמרה");
  process.exit(1);
}

let converted = 0, reused = 0;
for (const f of targets) {
  if (parts[f.h]) { f.j = parts[f.h]; reused++; continue; }
  const buf = await fetchBuf(f.u);
  const got = createHash("sha256").update(buf).digest("hex").slice(0, 32);
  if (got !== f.h) throw new Error(`hash mismatch for ${f.p}`);

  const n = Math.max(1, Math.ceil(buf.length / CHUNK_RAW));
  const urls = [];
  for (let i = 0; i < n; i++) {
    const slice = buf.subarray(i * CHUNK_RAW, (i + 1) * CHUNK_RAW);
    const js = `AK.part("${f.h}",${i},${n},"${slice.toString("base64")}");\n`;
    urls.push(writeJs(`${f.h}.${i}.js`, js));
  }
  parts[f.h] = urls;
  f.j = urls;
  fs.writeFileSync(PARTS_REGISTRY, JSON.stringify(parts, null, 2));
  converted++;
  console.log(`↑ ${f.p} → ${n} חלקי JS`);
}

// שומרים את המניפסט עם כתובות ה-JS
for (const f of manifest.files) if (parts[f.h]) f.j = parts[f.h];
fs.writeFileSync(MANIFEST_JSON, JSON.stringify(manifest, null, 2));
fs.writeFileSync(
  MANIFEST_JS,
  `/* נוצר אוטומטית */\nwindow.AKUPD_MANIFEST && window.AKUPD_MANIFEST(${JSON.stringify(manifest)});\n`,
);
console.log(`\nהומרו ${converted} קבצים, ${reused} כבר היו מוכנים.`);
