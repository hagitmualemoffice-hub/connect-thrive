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
- 90 KB raw chunks, DJB2 checksums, manifest fields u/l/c. Parts are published UNMASKED
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
