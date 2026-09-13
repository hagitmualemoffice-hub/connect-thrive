---
name: Offline / NetFree architecture is protected
description: The file:// + NetFree offline "אחותי כלה" bootstrap, updater and auth bridge are approved, protected infrastructure
type: constraint
---
The offline/NetFree architecture is APPROVED and PROTECTED. Never redesign it toward a
"cleaner" web-only solution.

Must always be preserved:
- one permanent bootstrap `public/downloads/achoti-kalah.html` opened from `file://`
- script-tag (`AK.part`) transport only — never fetch/XHR/.bin/ZIP for payloads
- 32 KB raw chunks (since Sep 2026; NetFree blocks binary-looking payloads above a
  threshold between 50 KB and 90 KB — proved with /updates/probe.html), DJB2 checksums,
  manifest fields u/l/c. Parts are published UNMASKED
  (`masked=0`) since Sep 2026 — XOR masking triggered NetFree blocking. The bootstrap still
  unmasks legacy parts via the per-part flag (key `5a 3c a7 11 6d f2 89 24`); never re-enable masking.
- IndexedDB storage, incremental updates, verification before activation, rollback
- Google login via the `achotikala.com/auth-bridge` popup (nonce + origin validation, postMessage)
- same Supabase backend/users/data as the live site; server-side authorization only
- graceful behavior with no internet

**Why:** NetFree filtering blocks ZIP and truncates/stubs other transports; this is the only
channel proven to work on real NetFree machines.

**How to apply:** Before finishing any change touching auth, routing, Supabase, sessions,
CORS, domains, deployment, the updater, ליבה, apartment board or authorization — run the
regression checklist in `docs/OFFLINE-ARCHITECTURE.md`. If a feature requires changing a
protected component, STOP and report what would change, why, and what could break.

## Header-signature masking (v64 / BOOT_REV 8, Sep 2026)
- NetFree does magic-byte matching at the START of the response (JPEG `FFD8FFE0…`), not deep
  scanning: image chunk 0 was blocked at 90 KB and at 32 KB; the same chunk with its first 24
  bytes XORed passed (probe test 5). Code/text chunks always passed.
- Fix: packager XORs only the first 24 bytes (`HDR_LEN`/`HDR_XOR=0x5a`) of binary files
  (images/fonts/pdf/audio/video) before chunking and sets `x: 24` on the manifest entry;
  `h`/`s`/`c` stay over original bytes. Bootstrap restores them once on the reassembled file,
  before whole-file verification. Never re-introduce full-content XOR (that was the v61 bug).
- Part URLs get an `h` suffix when header-masked. Rule: if a part's bytes change, its URL must
  change — the CDN served stale bodies from identical URLs (seen on v63).
- Requires a one-time launcher redownload. Rev-7 launchers fail safely (checksum error), no
  corruption. Live baseline: v64, 73 files, 535 parts, 69 header-masked files.
