# Development QA, October 30, 2026

Build: **3.0.0-dev.1**. Release decision: **DO NOT PUBLISH AS FINISHED 3.0**.

## Executed verification

- 33 Node regression tests pass. Tests run the actual retained game code with a deterministic DOM/storage adapter, plus pure rule and modeled service-worker tests.
- Full campaign traversal test completes all 54 nodes, all six Guardians, Guardian recruitment and the ending. All three clean starter-only simulation runs also complete, filling the party through ordinary Prism bonding with controlled success rolls.
- Four tournament tiers, each with three matches and three opponents per match, complete in the regression suite. Research/achievement claims are idempotent, all 30 families evolve, and backups retain a 2,003-creature collection.
- Capture success/failure, Aurora catch-up, victory, defeat, escape, tonic-compatible combat, switching restrictions, cooldowns, full collection healing, party XP, equipment, presets, habitat and expeditions are exercised.
- Storage tests cover both stores, independent store failures, queued reset writes, confirmation, failed reset rollback, interrupted reset recovery, malformed backups, actual restore input dispatch, corrupted-save preservation, and stale-window/reset resurrection protection.
- Cache tests cover complete offline shell construction, offline navigation, explicit activation, partial-install rejection, uncached version checks and preservation of unrelated game caches. These are API models, not real Safari service-worker tests.
- Cloud Chrome browser: starter onboarding, dialogue rewards, choice unlocks, battle intention and sequential enemy response verified through the interface. All eight screens checked for horizontal control/page overflow at the narrowest fixture width. Map checked at nominal 320/375/390/430 widths. Desktop scrollbars reduced their content viewports to 305/360/375/415 px; no overflow found. Primary battle controls were subsequently compacted to avoid excessive vertical scrolling.
- Art review fixture contains all 60 forms, split into six small regional sheets. Original code-native artwork; no external creature assets added. Final visual acceptance remains incomplete.

## Balance evidence

`balance-results.json` records 2,592 seeded encounters with three starter-element party members, four fixed policies, six Guardians, three starters, and level offsets -3/0/+3. After correcting trivially short Guardian fights:

| Policy | Wins / trials | Mean actions |
| --- | --- | --- |
| Strike only | 357 / 648 | 11.3 |
| Burst and Strike | 590 / 648 | 8.6 |
| Signatures when ready | 549 / 648 | 9.3 |
| Guard charged hits, otherwise Burst/Strike | 584 / 648 | 10.8 |

At equal levels the three starters' burst-policy wins were 66/72, 62/72, 66/72. Mixed tactical policy: 64/72, 64/72, 60/72. This is evidence of several viable policies, not proof that every family/team or move is balanced. Switching, enemy status combinations and all-family compositions need wider simulation.

## Main campaign pacing is a release blocker

`campaign-results.json` records three clean-save runs with no injected levels, HP, XP or coins. The agent retained its initial party after two controlled-success captures and completed every optional route. It took 39, 39 and 45 concluded battles, and 184, 166 and 185 actions. One run had one defeat followed by five training encounters. Final party levels were 41–42.

These counts support traversal and basic starter viability. They plainly do **not** support the requested 8–12-hour adventure. Human playtime has not been measured. The present content would be a substantially shorter game. Expand authored exploration, decisions, regional side objectives and encounter depth; do not claim the target or pad it with mandatory repetitive fights.

## Remaining release blockers

1. Main-campaign scale and depth do not yet meet the release brief. The story is connected and completable, but short; route outcomes mostly change rewards rather than future routes. Optional quest chains and richer environmental interaction need expansion.
2. Base forms still share several underlying shapes. Thirty separate evolved silhouettes are implemented, but the full 60-form art direction and visual quality pass are unfinished. All six map landmark sets need further illustration/interaction polish.
3. Arena/expedition systems function, but varied strategic compositions and sustained replay value need more content and playtesting. No observed 5–10-minute expedition duration is claimed.
4. Final audio, accessibility, performance/battery, animation and copy acceptance is incomplete. The optional procedural melody is basic.
5. No physical iPhone Safari, installed Home Screen, iOS update transition from public v2, iOS backup-download/restore, or Android device acceptance occurred. The local preview uses HTTP and cannot validate the deployed HTTPS PWA path.
6. No target-age family enjoyment or onboarding playtest occurred. No unattended testing or development process remains running.

## Data limitations

Save conflict protection checks the local mirror and a reset generation marker. Exhaustive concurrent multi-tab tests when localStorage is wholly unavailable remain outstanding. IndexedDB quota tests are deterministic failure models, not real browser quota saturation. Backups are schema-validated, not cryptographically authenticated, appropriate to a local single-player game.

## Publication protection

Only the development branch may receive this work. Main was observed at `b715f7d3105f273afcb4eab17a8e7abe5857fc6c`; existing public game assets predate this development checkpoint. No player browser data is accessed or migrated by committing source code. Keep the current public URL unchanged until the release criteria are met.
