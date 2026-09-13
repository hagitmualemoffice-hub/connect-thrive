# OFFLINE / NETFREE ARCHITECTURE — "אחותי כלה" (PROTECTED)

Status: **working in production, approved, protected.**
Last verified known-good: **package version 49**, 72 files / 212 parts, 2026-09-09.

This document describes the implementation **as it actually exists**, not a proposal.

---

## DO NOT BREAK — OFFLINE / NETFREE ARCHITECTURE

Any future work (features, refactors, dependency bumps, auth changes, routing changes,
deployment changes) MUST preserve all of the following:

- `file://` compatibility of the local package
- the existing automatic updater (script-tag / JSONP channel, IndexedDB storage)
- Google authentication through the existing auth bridge
- the same Supabase account/session shared with the live website
- the same server-side authorization system (RLS / allowlist)
- access to online features from the local package
- graceful behavior with no internet
- compatibility with the live website `achotikala.com`
- existing NetFree-compatible behavior (no ZIP, no `fetch` for payloads, no `.bin`)

Do **not** replace this architecture with a conventional web-only solution because it looks
cleaner or more standard. It exists because of hard NetFree filtering constraints.

If a requested feature would require changing a protected component, **stop and report**:
what component, why, what could break, and whether the feature can be built without touching it.

---

## 1. What the user downloads

One file only:

```
https://hagitmualem.com/downloads/achoti-kalah.html      (~32 KB)
```

Backup aliases (same content): `/downloads/achoti-kala.html`, `/downloads/achotikala.html`,
plus `/downloads/index.html` as a landing page.

The user double-clicks it once and keeps using **that same file forever**.
No ZIP is ever downloaded (NetFree blocks ZIP), and no installer is required.

## 2. The bootstrap / shell (`public/downloads/achoti-kalah.html`)

Permanent, self-contained shell. Responsibilities:

- Renders the locally stored app version immediately (works fully offline).
- Sets `window.ACHOTIKALA_OFFLINE_HOST = true` and `window.ACHOTIKALA_OFFLINE = true`
  **before** app scripts run. The source app uses this to switch to `HashRouter`
  (`file://` cannot use history routing) and to enable offline-specific auth behavior.
- Stores every app file in **IndexedDB**, keyed by content hash.
- Runs a cache-busted remote manifest check on every launch and supports a manual check
  from diagnostics. The remote result is never inferred from locally resolved assets.
- Verifies, activates, and can roll back.
- Runtime media resolver: rewrites dynamically constructed `src`, `srcset`, `poster`,
  inline `style` assignments and DOM mutations to the locally stored blob/data URLs.
  Misses are recorded in `window.ACHOTIKALA_MEDIA_MISSES`; `?diag=1` shows diagnostics.
- Stale-install recovery: an install too old to update incrementally re-downloads the
  full package and reloads.
- `?origin=` allows pointing the shell at another update origin for testing.

## 3. The transport (the only channel proven to pass NetFree)

- Everything is fetched with **`<script src="...">` tags**. Never `fetch`, never XHR,
  never `.bin`, never ZIP. NetFree passes real `.js` files from `hagitmualem.com`.
- Each payload file calls back into the shell:
  `AK.part(hash, index, total, base64, masked)`.
- Files are split into **32 KB raw chunks** (~44 KB encoded), since Sep 2026. Larger chunks
  were truncated by the filter, and a live probe (`/updates/probe.html`) proved NetFree
  blocks *binary-looking* payloads above a threshold **between 50 KB and 90 KB raw**
  (90 KB image chunk → 70-byte stub; the same image at 50 KB, and 90 KB of code or plain
  text → passed). 32 KB is deliberately well below that edge. If the threshold ever needs
  revisiting, re-run the probe page; only `CHUNK_RAW` in the packager changes — the
  bootstrap derives chunk count and sizes entirely from the manifest.
- Chunks are published **unmasked** (`masked = 0`, since Sep 2026). XOR masking made the
  payload look like packed/obfuscated binary data, which NetFree began blocking outright.
  The bootstrap still honours the per-part `masked` flag, so parts written earlier with
  `masked = 1` (XOR key `[0x5a,0x3c,0xa7,0x11,0x6d,0xf2,0x89,0x24]`) keep decoding
  correctly — no bootstrap revision is needed to switch. Masking never touched the
  checksums: length and DJB2 are always computed on the raw bytes.
- Per chunk the manifest carries `u` (index), `l` (raw length), `c` (DJB2 checksum).
  A chunk is accepted only if length **and** checksum match; up to 4 retries with a
  cache-busting `?r=` parameter; verified chunks are kept across retries.
- After all chunks, the **whole file checksum** must match before it is stored.
- A new version is activated only after **every** required file verified. The active and
  previous manifests are then switched atomically in one IndexedDB transaction, including
  when all new-version hashes already exist locally and zero payloads need downloading.

## 4. Update flow

```
open shell -> render local version (instant, offline-capable)
           -> background: unique <script src="/updates/manifest.js?t=...&nonce=...">
           -> compare hashes with IndexedDB
           -> download only changed/new files, chunk by chunk
           -> verify lengths + checksums + file checksums
           -> activate on next open; previous verified version retained
```

- No internet, or any failed/unverified part → the existing local app keeps working
  unchanged; nothing is activated.
- Rollback: the previous verified version is kept. If a new version fails to open twice
  in a row, the shell returns to it automatically.
- Unchanged images, audio, fonts are never re-downloaded.
- Diagnostics must show local installed version and freshly fetched remote server version
  as two separate values, plus check time, network/error source, and result.

Hosted files on `hagitmualem.com`:

```
/downloads/achoti-kalah.html      permanent bootstrap
/updates/manifest.js  (+ .json)   version + file/chunk metadata
/updates/parts/<hash>.<i>.js      masked, chunked payload parts
/updates/netfree-test.js|json     connectivity POC files (keep)
```

## 5. Publishing a new offline version

Source of truth is the published live site `https://achotikala.com`.

```bash
node scripts/sync-offline-from-live.mjs --with-images --version <n>
# then publish this project (hagitmualem.com)
```

The script downloads the live site and everything it references (including CSS
backgrounds, SVGs, icons and dynamically referenced images), hashes every file, reuses
unchanged parts via `scripts/offline-parts-registry.json`, writes only new/changed
`.js` parts, deletes orphan parts, and regenerates the manifests. Heavy PDF/audio/video
are excluded by default.

`scripts/build-offline-update.mjs` (packs from a local build folder) is legacy/backup only.

## 6. Backend, auth and authorization

- The local package talks to the **same live Supabase backend** as the website, so the
  local app and `achotikala.com` share the exact same users and data.
- Google sign-in cannot happen inside `file://` (no valid origin). Instead the local app
  opens **`https://achotikala.com/auth-bridge`** in a popup:
  1. the local app generates a **nonce** and opens the bridge with it;
  2. the bridge (`AuthBridge.tsx`, source project) performs the normal Google/Supabase
     sign-in on the real https origin;
  3. on success it returns the Supabase session to the opener with **`postMessage`**;
  4. the opener validates the **nonce** and the **allowed origin** before accepting;
  5. the session is persisted locally, the popup closes and the user stays inside the
     local app.
- Email/OTP login (8-digit code) works directly from the local app; email-only offline
  login and offline access requests are supported.
- Authorization is always enforced **server-side** (Supabase RLS / allowlist). The local
  package never decides permissions by itself — ליבה and the apartment board rely on the
  server, exactly as the website does.
- Offline: locally stored content keeps working; online-only features (login, ליבה,
  apartment board, live data) fail gracefully with a message.

### CORS / origin notes
- `file://` sends `Origin: null`, so **no cross-origin fetch/XHR is used for payloads** —
  the script-tag channel avoids CORS entirely. Do not "modernize" this to `fetch`.
- The auth bridge must keep accepting the local opener and validating nonce + origin.

## 7. Critical files (do not casually refactor)

This project (`hagitmualem.com`):
- `public/downloads/achoti-kalah.html` — the permanent bootstrap/updater shell
- `public/downloads/achoti-kala.html`, `achotikala.html`, `index.html` — aliases/landing
- `scripts/sync-offline-from-live.mjs` — packager (chunking, unmasked parts, manifest)
- `scripts/offline-parts-registry.json`, `offline-update-registry.json` — incremental state
- `public/updates/manifest.js|json`, `public/updates/parts/**` — published payload
- `src/pages/Downloads.tsx` — download page

Source project (`achotikala.com`):
- `AuthBridge.tsx`, the googleOffline flow, and the `window.ACHOTIKALA_OFFLINE_HOST`
  `HashRouter` switch.

Invariants that must not change silently: the chunk size (90 KB raw), the per-part
`masked` flag semantics (XOR key kept for old parts), the
`AK.part(...)` signature, the DJB2 checksum, and the manifest field names `u`/`l`/`c`.

## 8. Regression checklist

Run before completing **any** change touching authentication, routing, Supabase, session
handling, CORS, domains, deployment, the updater, ליבה, the apartment board, authorization,
or their dependencies:

- [ ] A. An existing local package receives the latest version through the updater.
- [ ] B. The app opens correctly from `file://` (double-click, no server).
- [ ] C. Google login from the local package opens the auth bridge correctly.
- [ ] D. A successful login returns the session to the local application.
- [ ] E. The popup closes and the user stays inside the local application.
- [ ] F. An authorized user can access ליבה.
- [ ] G. An authorized user can access the apartment board.
- [ ] H. Live website and local version see the same account and data.
- [ ] I. Server-side authorization is still enforced (unauthorized user is blocked).
- [ ] J. With no internet, local content works and online-only features fail gracefully.
- [ ] K. No deployment requires users to download a new ZIP, or a new bootstrap, unless
      the change is inside the shell itself (then say so explicitly).
- [ ] L. Every part URL returns real JS of the expected size (spot-check on NetFree).
- [ ] M. Images resolve offline; `window.ACHOTIKALA_MEDIA_MISSES` is empty.

Shell-change rule: logic that lives **inside** `achoti-kalah.html` cannot be delivered by
the updater. Changing it forces every user to download the bootstrap once again — avoid
unless necessary, and tell the owner when it happens.

## 9. Known-good baseline

| Item | Value |
| --- | --- |
| Offline package version | **62** (`public/updates/manifest.json`, stage `full`) |
| Files / parts | 73 files, 535 unmasked JS chunks |
| Bootstrap | `public/downloads/achoti-kalah.html`, rev 7 (~31.9 KB) |
| Chunk size / mask | 32 KB raw / no mask (`masked=0`); XOR `5a 3c a7 11 6d f2 89 24` still decoded for legacy parts |
| Date verified on real NetFree | 2026-09-13 |
| Verified behaviors | first install, offline reopen, incremental update, rollback, images offline, login |

If a future change breaks the offline app, compare against this baseline first:
the bootstrap, the packager, and the manifest field/chunk conventions above.

## 10. Known-fixed issues (do not re-discover)

- **(bootstrap rev ~5)** Remote manifest was cached → version checks returned stale data.
  Fixed with a cache-busted `<script>` load of the manifest straight from network.
- **(bootstrap rev ~6)** Premature health-check marked a new version healthy ~4s after open →
  spurious rollback. Health is now marked only after the site actually renders.
- **(bootstrap rev 7)** Silent IndexedDB hangs: `tx()` ignored `onabort` → an aborted
  transaction (e.g. `QuotaExceededError`) hung the update forever. Added `onabort`/`onblocked`,
  a persistent update log, pre-download `gc()`, and explicit quota handling.
- **(v60→61)** Publishing deleted the previous version's parts → users mid-upgrade got 404s.
  The packager now retains previous-version parts, validates every part before writing the
  manifest, and `scripts/verify-offline-publish.mjs` checks the live manifest after publish.
- **(v61, Sep 2026)** NetFree blocked the part files because they were XOR-masked (fixed public
  key, no real security) and therefore looked like packed binary. Parts are now published
  unmasked (`masked=0`); no bootstrap change was needed.
- **(v62, Sep 2026)** NetFree returned a ~70-byte stub for **image** chunks of 90 KB raw while
  code and plain-text chunks of the same size passed. Probe page (`public/updates/probe.html`)
  isolated a size threshold for binary-looking payloads **between 50 KB and 90 KB raw**.
  Fixed by lowering `CHUNK_RAW` in `scripts/sync-offline-from-live.mjs` from 90 KB to **32 KB**
  for all file types (safety margin), which raised the package to 535 parts. The bootstrap
  derives chunk count/size entirely from the manifest, so no bootstrap change was needed;
  the registry reuse guard now also keys on chunk size (`z`) so old 90 KB parts are repacked.
  If binary payloads are blocked again, the next suspect is the random 32-char hash filenames
  (`/updates/parts/<hash>.N.js`) — discuss readable paths with the owner before changing them.
- **(v64 / BOOT_REV 8, Sep 2026)** 32 KB chunks were **not** enough: a first-time install still
  stalled on image **chunk 0** (expected 32768, got 70). Probe test 5 (same chunk, first 24 bytes
  XORed) passed while the untouched chunk failed → the filter does **magic-byte matching at the
  start of the response** (`FFD8FFE0…`), not deep content scanning. Size and masking were never
  the real variable for chunk 0. Fix: the packager XORs only the **first 24 bytes** (`HDR_LEN`,
  `HDR_XOR = 0x5a`) of **binary** files (`BINARY_EXT`: images/fonts/pdf/audio/video) before
  chunking, and records `x: 24` on the manifest file entry; `h`/`s`/`c` stay over the *original*
  bytes. The bootstrap (`downloadFile`) restores those bytes **once, on the reassembled file**,
  before the whole-file length/checksum check. Code/text files are untouched, so nothing looks
  "encrypted" — this is deliberately not the v61 full-XOR mistake.
  Part filenames now carry an `h` suffix when header-masked (`<hash>h.N.js`): part content changed
  while the content hash stayed the same, and the CDN kept serving the old body from the identical
  URL (observed live on v63). **Rule: if a part's bytes change, its URL must change.** The
  registry meta gained `v: 2` to force a repack.
  This is the first change that required a launcher redownload since rev 7: a rev-7 launcher on a
  header-masked package fails safely with a checksum error (verified) — no corruption, but a fresh
  install cannot complete. Existing installs keep working (blobs are keyed by content hash) but
  need the new launcher to fetch changed binary files.
