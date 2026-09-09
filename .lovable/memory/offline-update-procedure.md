---
name: Offline update procedure (Achoti Kalah)
description: Fixed trigger phrase and exact steps to publish a new offline/NetFree version of Achoti Kalah on hagitmualem.com
type: preference
---
Trigger phrase from the user: "עדכן את גרסת האופליין של אחותי כלה" (any close variant).

When said, run the procedure in docs/OFFLINE-UPDATE-PROCEDURE.md exactly:
1. `node scripts/sync-offline-from-live.mjs --with-images`
2. verify new version in public/updates/manifest.json (baseline 72 files / 212 parts)
3. locally validate all parts (XOR unmask + length + DJB2) — must be 0 errors
4. NEVER modify public/downloads/achoti-kalah.html (bootstrap) — that forces every user to re-download
5. publish hagitmualem.com
6. verify production: /updates/manifest.js returns 200 with new version, and one sample part returns 200 with correct size
7. report version, file/part counts, and that users need to do nothing

**Why:** users must never re-download the bootstrap; updates must be incremental and verified before activation.
