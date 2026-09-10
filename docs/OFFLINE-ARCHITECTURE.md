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
- Files are split into **90 KB raw chunks** (~123 KB encoded). Larger chunks were
  truncated by the filter.
- Each chunk is **XOR-masked** before base64 encoding, key
  `[0x5a,0x3c,0xa7,0x11,0x6d,0xf2,0x89,0x24]`, so media payloads are not recognized and
  stubbed by the filter (NetFree previously returned a 70-byte stub for image chunks).
  The mask is applied *before* base64 and removed *before* validation — checksum
  protection is unchanged and not weakened.
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
- `scripts/sync-offline-from-live.mjs` — packager (chunking, XOR mask, manifest)
- `scripts/offline-parts-registry.json`, `offline-update-registry.json` — incremental state
- `public/updates/manifest.js|json`, `public/updates/parts/**` — published payload
- `src/pages/Downloads.tsx` — download page

Source project (`achotikala.com`):
- `AuthBridge.tsx`, the googleOffline flow, and the `window.ACHOTIKALA_OFFLINE_HOST`
  `HashRouter` switch.

Invariants that must not change silently: the chunk size (90 KB raw), the XOR key, the
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
| Offline package version | **49** (`public/updates/manifest.json`, stage `full`) |
| Files / parts | 72 files, 212 masked JS chunks |
| Bootstrap | `public/downloads/achoti-kalah.html`, ~31.9 KB |
| Chunk size / mask | 90 KB raw / XOR `5a 3c a7 11 6d f2 89 24` |
| Date verified on real NetFree | 2026-09-09 |
| Verified behaviors | first install, offline reopen, incremental update, rollback, images offline, login |

If a future change breaks the offline app, compare against this baseline first:
the bootstrap, the packager, and the manifest field/chunk conventions above.
