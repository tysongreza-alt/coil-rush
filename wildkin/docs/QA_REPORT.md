# Current development QA: 3.0.0-dev.5

61 regression checks pass. Added actual guided-practice actions, duplicate/invalid technique protection, technique backup migration, skip/replay, chapter routing through bonds/field objectives/Guardians and all-seals postgame. The chapter guide derives its state from earned objectives, with no artificial timers or additional grind gates. Main campaign traversal rerun. These changes do not establish 8–12-hour pacing or replace final quality/device acceptance.

---

# Current development QA: 3.0.0-dev.4

59 regression tests pass, including three new tests for owned-companion release cleanup, recovery of older orphaned habitat records, and all six regional homecomings with both request resolutions. Ending and journal replay retain choices without paying duplicate rewards. Full campaign traversal rerun on this build.

No physical iPhone, family playtest, audible review or human duration claim. All release blockers described below still apply, especially shortest-route pacing and final device/quality acceptance. Main/public remains unchanged.

---

# Current development QA, October 30, 2026

Build: **3.0.0-dev.3**, schema 5. Not a final release. Main/public deployment remains unchanged.

## Implemented and verified in this pass

- 36 authored expedition events across six regional circuits. Three difficulty tiers, fixed entry-level snapshot, visible regional terrain, preparation shields/energy, supply and pack decisions, two/three-opponent checkpoints, extraction and 18 persistent challenge records. Higher tiers unlock after the ending, with first-completion bonuses and Aurora signs. No timers or entry fees.
- 12 distinct arena trainer rosters across four brackets. Each has its own telegraphed intention cycle, available in the scouting panel before entry.
- Six original 32-step regional scores with gentle bass harmony and a faster battle variation. Synthesized locally, optional and muted through existing controls. Stops scheduling when hidden; iOS-style suspended audio contexts resume on a gesture. Automated audio graph/timer checks pass. Audible musical quality has not been reviewed through these tools.
- Dedicated local PNG icons for iPhone Home Screen and Android manifests; all cached with the atomic shell. Removed remote web-font import and adopted rounded system fonts. Sound nodes disconnect after playback.
- Background controls become inert while battle, bonding or modal screens are open. Dialog semantics and keyboard containment apply to battles/bonding. Fresh-start onboarding explicitly restores interactivity. Reduced motion is retained. This is not a physical VoiceOver acceptance claim.
- IndexedDB compare-and-write protection rejects a foreign revision in the same read/write transaction. Paused copies remain exportable, the mirror is repaired only when it belongs to this session, and loading latest resumes saving. The real Chrome fixture uses two separate game windows with actual IndexedDB and localStorage unavailable. Five stale queued writes could not replace committed coins (1111); the stale in-memory copy (2222) remained exportable; reload and subsequent write (3333) succeeded.
- Cloud Chrome UI at 305 px content width: expedition selection, choice costs, cache challenge, arena scouting and battle verified without horizontal page/control overflow. Accessibility tree confirmed background navigation disappears during battles. Screenshot review found HP card obscuring creature faces, corrected by reserving portrait space. No physical device testing occurred.

## Automated and simulation evidence

**56 regression tests pass.** New coverage includes all 18 expedition challenges, supplies/preparations, interrupted encounters, locked tiers, invalid choices/records, migrations, all arena rosters/cycles, regional scores, mute/background audio lifecycle, offline icons, and IndexedDB-only stale writes. Existing capture/healing/XP/evolution/reset/backup/large-collection/offline/update/campaign tests pass.

`campaign-results.json` was regenerated on dev.3: all three starters complete through either main approach, and the completionist agent covers all 216 field locations, all 54 optional story nodes and six requests. These results do not validate human pacing.

`strategy-results.json`: 2,700 real-engine equal-level battles across every family leading mixed teams, six Guardian rematches and four final arena matches. Three seeds and three policies, no tonics. Burst policy wins 851/900; signatures 842/900; adaptive policy with guards/switches 833/900, including 559 switches. The lowest family-led team wins 78/90 across policies. This shows several viable synthetic strategies and broader family coverage. It does not establish optimal balance, family-specific causality, or human fun. The report discloses fixed supports and the absence of finale echoes in the rematch fixtures.

## Remaining release blockers

1. Main story is complete and traversable, but its shortest routes remain too short to substantiate the requested 8–12-hour experience. Observed human pacing and target-age onboarding/enjoyment tests have not happened. Add meaningful main-story depth where observation justifies it, not repeated mandatory encounters or delays.
2. Final visual, audio, animation, accessibility and device performance/battery acceptance remains open. New art is original and integrated; final cohesion and audible scores still need acceptance. Endgame synthetic coverage is stronger but sustained human replay enjoyment is unmeasured.
3. Physical iPhone Safari and installed Home Screen acceptance, updates from the public v2 worker, iOS backup download/restore, offline cold launch and Android acceptance remain unavailable. The HTTP cloud preview cannot substitute for the required HTTPS/device checks.
4. Actual browser quota saturation and interruption testing remain incomplete. Two-window real-browser IndexedDB conflict protection is now exercised, improving the previous modeled-only evidence.

No final publication or finished label until RELEASE_SPEC_3_0.md acceptance. Previous dev.2 GitHub CI completed successfully. This pass must also pass CI after commit. No unattended development is configured.

---

# Earlier dev.2 checkpoint

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
