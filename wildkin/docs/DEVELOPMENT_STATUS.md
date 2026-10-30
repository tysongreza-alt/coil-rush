# Wildkin 3.0 development checkpoint

Status: IN DEVELOPMENT. Not a finished release. Public deployment must remain unchanged.
Baseline: development branch at 01be072 (fresh-start fix); public baseline 013d989.

## Audit
The retained 94 KB game contains collection, SVG renderer, sequential battles, localStorage/IndexedDB saves and six region data rows. Existing expansion screens are rudimentary. No committed automated tests exist. Update version validation incorrectly matches literal backslashes. Service worker deletes unrelated origin caches and activates immediately. Restore validates only a few creature fields. Reset may delete IndexedDB before localStorage fails. Wild opponents scale to highest party level, preventing clear growth. Signature charging can be repeated without energy cost. Guardians have HP changes but no distinct behavior. No campaign narrative, ending, equipment, tournament teams, true expedition encounters or rare-hunt catch-up.

## Implementation order and acceptance
1. Pure domain module and deterministic regression harness. Validate complete save shape, migrations, backups, counters, presets; prevent corrupt data replacement. Test persistence and reset failure paths.
2. Retain sequential battle presentation. Integrate telegraphed intentions, six Guardian patterns, passives, signature cooldowns, encounter teams and fixed regional level bands. Test every outcome and full party XP/healing.
3. Six authored regional arcs with three branching routes, replayable dialogue, environmental choices, puzzles, secrets, optional quests and finale. Test traversal from clean save and gate logic.
4. Expeditions with supplies, route events, battles, extraction; arena with curated teams and tournaments. Research evolution, achievements, rare hunts, equipment and habitat interactions. Test rewards cannot duplicate.
5. Cohesive mobile UI, art, sound, accessibility and offline/update delivery. Test safe-area layouts and cache lifecycle.
6. Seeded simulation, browser QA, acceptance matrix, rollback notes. Do not publish unless all release blockers are closed.

## Unfulfilled acceptance gates
- 60 individually differentiated finished creature illustrations, six illustrated maps and cohesive visual/audio QA.
- Observed 8–12-hour main-story pacing and family enjoyment tests. Simulated action counts are not observed playtime.
- Physical iPhone Safari and installed Home Screen acceptance; Android where available.
- All features must be integrated and tested before finished label or main deployment.

## Resume
Read this file, RELEASE_SPEC_3_0.md, docs/QA_REPORT.md and git log. Run `node --test wildkin/tests/*.test.cjs`. Work only on wildkin-3-development. Do not merge/publish partial work. Files outside wildkin are unrelated games.

## Checkpoint outcome, October 30

Implemented the integrated systems listed at the top of README.md. Added 30 evolution silhouettes and six regional landmark sets. 33 regression tests pass, 2,592 balance scenarios run, three starter-only campaign agents reach the ending, and cloud Chrome phone-width/UI checks executed. CI runs regression and traversal without deployment.

The acceptance criteria are not met. In particular, the campaign currently takes only 39–45 battles in the recorded agent runs and cannot honestly be described as an 8–12-hour main story. Final creature/map polish, deeper route/quest consequences, endgame variety, audio/performance/accessibility QA, physical iPhone/Home Screen update testing and target-age enjoyment validation remain. See QA_REPORT.md for precise evidence and limitations. No ongoing unattended execution is configured.


## Latest checkpoint: 3.0.0-dev.2

18 mapped adventures / 216 authored locations, six puzzle engines with hints and alternate approaches, six regional requests, objective-based Guardian access, guaranteed diverse first bonds, and 60 individual form silhouettes are implemented. Schema 4 migrates earlier progress. Tests and browser evidence are in the current QA_REPORT.md; progression evidence is in campaign-results.json. Main remains unchanged. Work next on remaining pacing/depth and final product acceptance, not another count-based expansion. Real iPhone/target-age acceptance and final publication remain undone.


## Latest checkpoint: 3.0.0-dev.3

Six regional expedition circuits (36 events, three tiers, fixed level snapshot, preparation/terrain and checkpoint teams), 12 unique arena trainers with scouting, six synthesized scores, local mobile icons/system fonts, battle/bond accessibility isolation, and atomic IndexedDB foreign-write protection are integrated. 56 regressions pass. 2,700 all-family strategy fixtures and actual Chrome two-window IndexedDB testing pass. Main/public unchanged. See current QA_REPORT.md and strategy-results.json.

The shortest campaign routes still do not substantiate 8–12 hours. Target-age enjoyment, final audible/visual/performance acceptance, physical iPhone Safari/Home Screen/update/offline/backup acceptance and browser quota saturation remain incomplete. These are release blockers, not completed tests. No unattended development continues after the turn.


## Latest checkpoint: 3.0.0-dev.4

Fixed a release-blocking persistence bug: releasing a companion with habitat memories left an orphaned affection record that prevented validation on reload/export. Release now clears its memory and migration safely removes valid orphaned records from older affected saves. Invalid memory values still reject. New regressions exercise release, export, reload and migration. Added six authored regional homecomings and integrated saved regional request choices into the ending, replayable journal and companion interactions. This improves narrative consequences; it does not establish the 8–12-hour pacing target. Physical-device/family and final quality acceptance remain open. Public/main unchanged.
