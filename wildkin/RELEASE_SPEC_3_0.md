# Wildkin 3.0: The Living Wilds - Release Specification
Status: DESIGN TARGET, NOT IMPLEMENTED OR RELEASED
Date: 2026-10-30

## Product
Original, free, family-friendly, single-player, offline-first creature-collecting RPG optimized for iPhone Home Screen PWA. No paid items, accounts, ads, energy timers, mandatory online events, or server dependency. Existing Wildkin saves remain compatible until the player explicitly elects a fresh start.

## Player journey
Opening: starter choice, introduction to original world, tutorial battle, first bond and Sanctuary.
Act I: Sunleaf Meadow, first Guardian, research journal and party roles.
Acts II-VI: Whisperwood, Coral Crossing, Emberfall Ridge, Stormglass Peaks and Starlit Sanctuary. Each region includes its own NPC arc, 3+ branching paths, environmental events, secrets, puzzle, optional quest, unique Guardian tactics, and region climax.
Finale: interconnected multi-stage challenge testing team strategy, element knowledge and expedition choices, followed by an epilogue.
Postgame: expeditions, ranked AI arena tiers, themed tournaments, Guardian rematches, mastery, rare hunts and habitat cosmetics.
Target: 8-12 hours main campaign, subject to testing; 3-10-minute repeatable sessions.

## Battle specification
3 active party members. All party members gain XP, even if fainted. After every concluded fight, all owned creatures return to full HP. Battle tonics usable during fights only.
6 elements, clear effectiveness. 30 family-specific signatures and passives. Telegraphed enemy intentions, turn-based choices, meaningful switching, shield/weakness/status effects with durations. Guardians use distinct tactical patterns. Enemy difficulty from behaviors and team composition, not only HP scaling.
Battle simulations test move viability, encounters at multiple level bands, progression, arena balance and starter parity.

## Collection
30 original families, 60 distinctive base/evolved forms, Aurora variants, research milestones for observation, victory, bonding and evolution. Original, individually differentiated silhouettes and art, consistent at phone size. Sanctuary filtering, favorites, party presets, search, pagination, storage limited by actual browser capacity, export/import. Research rewards without excessive repetition. Rare hunting with visible progress and fair catch-up.

## Exploration and narrative
Six distinct maps with branching routes, map fog/progress, short original dialogue, optional events, treasure, puzzles and secrets. No mandatory repetitive grinding. Story dialogue skippable and revisitable. Exploration routes affect encounters, rewards and narrative discoveries.

## Habitat
Customizable creature home with unlockable themes and earned cosmetics. Lead companion interaction and favorite display. No real-time chores or punitive timers.

## Expedition and arena
Repeatable 5-10-minute expeditions with meaningful risk/reward, encounter or tactical choices, modifiers, and replay variety. Arena consists of curated AI teams, themed brackets, badges and Guardian rematches. Optional rotating challenges never require login and never permanently lock content.

## UI and accessibility
One-handed portrait mobile interface. 44px minimum primary tap targets where practical. No horizontal page overflow. Compact navigation, clear combat feedback, adjustable animation speed, reduced motion, readable contrast, sound toggle and optional hints. Fast cold start and low battery use. Update-check and update-ready flows within installed PWA.

## Data and reliability
Versioned schema migration, IndexedDB primary with fallback, explicit backup and restore verification, user-confirmed fresh-start flow, offline shell, service-worker update lifecycle, error handling, no silent loss of saves. Preserve original saves across upgrades. Fresh-start must clear both primary and fallback storage before new game is created, and only after backup confirmation.

## Definition of done
1. Every promised gameplay and story system integrated, with no placeholder screens or unimplemented choices.
2. Entire campaign can be completed from a clean save without blocking bugs.
3. All gameplay loops and outcomes tested: win, loss, flee, bond, Guardian, evolution, sanctuary, arena, expedition, research, save, restore, fresh start, offline and update.
4. Automated regression and balancing suites pass.
5. Manual real-device iPhone Safari and installed Home Screen acceptance completed; Android PWA acceptance where possible.
6. Visual, copy, sound and performance QA complete; onboarding and endgame playtested with target-age players.
7. Release notes and rollback plan documented. Only then label build as finished Wildkin 3.0.

## Development rules
Do not call a partial expansion a finished release. Maintain a development branch and only publish to the main game URL after acceptance. Preserve existing player progress. No misleading claims about real-device tests or playtime. Do not use third-party copyrighted creature designs.
