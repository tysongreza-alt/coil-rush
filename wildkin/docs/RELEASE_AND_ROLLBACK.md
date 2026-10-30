# Release gate and rollback procedure

There is no 3.0 public release yet. Do not merge or deploy 3.0.0-dev.1 as final.

Before release: close every blocker in QA_REPORT.md; execute physical iPhone Safari and installed Home Screen acceptance and available Android checks; test updates from the existing public worker and legacy saves; verify backups and explicit fresh-start confirmation on-device; perform family pacing/enjoyment tests; rerun automated regression, progression and balance suites.

Before publication: capture main SHA and Pages configuration, tag/archive the known-good source, retain old save/schema readers, and verify the final asset/version manifest agrees with the service-worker cache name. This branch keeps `version:1` with `schema:3` to migrate existing save structures. Do not change storage origin or save key. Do not clear browser saves or unrelated origin caches.

During acceptance: export a verified JSON backup from an existing real save before installing the candidate. Test cancelling fresh start, successful reset, recovery after interruption, restore, offline cold start, and install update after battle. Test old worker to new worker and interrupted asset downloads. Optional gifting QR is lazy-loaded online; ordinary gameplay and gift codes do not require it.

Rollback: restore only the Wildkin application files from the recorded known-good source, use a new monotonically greater patch version/cache ID for the rollback build, and keep the schema-3 validator/migration capable of reading new saves. Do not blindly deploy an old worker/version over the new one: that can strand installed clients or discard new fields. Preserve and export player data; never reset progress as a rollback mechanism. Other games in this repository must remain untouched.

A fresh adventure after the eventual final release: Camp → Export backup; save the downloaded file; Camp → Start fresh; check the acknowledgement and confirm. The reset must finish both storage operations before presenting starter selection. Do not ask the owner to use this flow on an unfinished candidate.
