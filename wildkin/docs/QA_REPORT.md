# Current development QA, October 30, 2026

Build: **3.0.0-dev.2**. Not a final release. Main/public deployment remains unchanged.

## Implemented and verified in this pass

- 18 mapped field adventures, with 216 authored locations, alternate direct/puzzle approaches, fog/progress, two- and three-companion patrols, optional nests and hidden reports. Guardians now unlock through two restored relays, not repeated wild wins. The existing 54 regional story nodes remain optional and replayable.
- Six untimed puzzle engines: channels, echo phrases, vessel measures, cooling panels, wind navigation and sliding star tiles. All 18 starts are unsolved and solvable. Deterministic hints solve all 512 furnace layouts, every valid vessel state and every safe wind position. Invalid tile parity and inconsistent saved objectives are rejected.
- Six optional regional requests, each with two persistent resolutions and Guardian preparation rewards. Completion/rewards are idempotent. All 18 adventures and all six requests complete in tests.
- Sixty separate base/evolution model definitions in the retained original SVG style. All portraits parsed as XML. Six regional art sheets reviewed in cloud Chrome; five evolution silhouettes revised after review. Final art-direction acceptance remains open.
- Cloud Chrome UI: migrated earlier save retained coins/story progress; map travel, route choice, helper interaction and puzzle persistence checked. All six puzzle types solved through visible controls at nominal 320 px (305 px content viewport with desktop scrollbar), with no horizontal control/page overflow. Isolated QA scenes use a separate save key and vault.
- Additional regression covers battle tonics, explicit update installation after combat, controller-change reload protection, waiting-worker activation, and version/cache manifest consistency. Full suite: 47 tests after correcting a test that omitted evolved HP.

## Progression evidence

`campaign-results.json` records six clean main campaigns, every starter through each approach, plus one completionist run. No levels, HP, XP or coins were injected. The puzzle agent uses hints and the battle agent uses a simple tactical policy.

Direct approach: 30/36/36 battles with 0/1/1 defeats. Puzzle approach: 18/24/18 battles with 0/1/0 defeats. A defeat triggers five training encounters in this test policy, so these counts do not establish required grinding. Completionist: 71 battles, zero defeats, all 216 field locations, all 54 regional story nodes, and all six requests.

These are traversal/progression checks, not observed human playtime or enjoyment. The added exploration and puzzles materially expand the adventure, but the 8–12-hour target is still not validated and the shortest routes remain a concern. Do not inflate length through repeated mandatory fights.

## Remaining release blockers

1. Validate and, where needed, deepen main-story pacing and encounter decisions. Real target-age playtesting has not occurred.
2. Final visual, animation, audio, accessibility and device performance/battery acceptance remains incomplete. The melody is basic. Endgame variety and strategy coverage need further validation.
3. Physical iPhone Safari and installed Home Screen testing, updates from the public v2 worker, iOS backup download/restore and Android acceptance have not occurred. HTTP preview cannot validate the deployed HTTPS PWA path.
4. Save failures/quota and service workers have modeled automated coverage; exhaustive real-browser quota/concurrent-window testing remains outstanding.

No final publication is authorized by passing these checks alone. Follow RELEASE_SPEC_3_0.md and RELEASE_AND_ROLLBACK.md. No unattended development is configured.

---

## Earlier checkpoint evidence (historical)

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
