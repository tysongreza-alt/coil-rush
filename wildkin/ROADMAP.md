# Wildkin: Long-Term Expansion Plan (October 2026)

The game is a private, free, mobile-browser creature collector. Keep the original creatures, low-friction one-handed controls, fair rewards, no mandatory login, and backward-compatible local saves.

## v1.2 complete
- Guaranteed Flee during wild and Guardian encounters, with no enemy attack or penalty.
- Battle energy meter: 2/4 starting energy; Strike +1; Guard +2; Element Burst -2; maximum 4; no automatic regeneration.
- Six named Guardian bosses. Defeating them earns a seal and an optional free post-victory capture of a crowned companion. Rematches are available.

## v1.3.1 released (code complete, device QA pending)
- Added a Sanctuary with paged/searchable creature storage, quick active-party swaps, favorites, and on-device IndexedDB support for large collections.
- All party members receive equal full XP on victories and captures, including fainted companions, plus reduced XP for losses. Every battle-result screen itemizes XP and level-ups.
- All 30 families now have distinct named signature moves, six types of tactical effect, and combat role labels. Evolved models received role-based accessories.
- 18 explorable trails (three per region) now influence rarity odds, track visits, and provide discovery rewards.
- Retained old saves, Guardian capture, flee, familiar elemental matchups, and the single-player no-account model.

### Remaining polish toward a fuller v1.3
- Hand-authored, fully distinctive evolved character artwork per family rather than procedural variants.
- Deeper enemy AI and telegraphed intentions, battle-speed settings, passives and more status effects.
- Real illustrated branching area maps, characters and quests beyond the current three trail choices per region.
- Full family phone/device QA, storage stress and save/restore acceptance tests.

## v1.4: Player attachment and collection mastery
1. Species research goals and reward tiers for observing, catching, evolving and battling.
2. A customizable habitat where the player can interact with a favorite companion, decorate, and collect cosmetics.
3. Weekly featured encounters and challenges with no forced streaks or missed-content penalties.
4. Better evolved creature art that visibly changes shapes and personalities, not just size.
5. Accessible help, tap targets and backup/restore UX.

## v1.5+: Endgame, originality and family-friendly sharing
1. A short, procedurally remixed expedition mode with choices, loot and optional Guardian rematches.
2. Challenge arenas against predefined AI teams with varied strategies, not only increased HP.
3. Seasonal/weather variations with catch-up paths for every creature.
4. Visible rare-hunt progress to prevent frustrating pure RNG.
5. Share an AI-controlled team challenge by QR or link, playable locally and without an account.
6. True one-time cross-device trades only if a validated server and durable identity are added. Existing gifts are copies.

## Games studied and design insights
- Pokémon Legends Arceus: habitats, conditions and repeatable research, https://legends.arceus.pokemon.com/en-us/gameplay/
- Monster Sanctuary: distinct skill trees, team synergies and traversal powers, https://www.team17.com/games/monster-sanctuary
- Cassette Beasts: customizable abilities and fusion, https://wiki.cassettebeasts.com/wiki/Moves
- Coromon: readable type/stamina mechanics and accessible difficulty, https://coromon.com/games/coromon/
- Ooblets: cozy habitat, companion personality, customization and low-stress activities, https://ooblets.com/about/
- Siralim Ultimate: mastery, challenges and long-term collection, https://store.steampowered.com/app/1289810/
- PokéRogue: compact replayable runs, varied builds and daily scenarios, https://wiki.pokerogue.net/guides%3Anew_player_guide
- Nexomon Extinction: progression narrative and characters, https://store.steampowered.com/app/1196630/Nexomon_Extinction/
- Temtem: repeatable leader fights and competitive-style battles, https://temtem.wiki.gg/wiki/Repeatable_activities

## Avoid
Do not add monetization, high-friction grinding, punitive streaks, mandatory wait timers, invasive accounts, or hundreds of reskinned creatures.

## Quality gates
Check iPhone and Android layouts, existing-save restoration, offline cache updates, no horizontal overflow, battle energy clarity, Guardian capture paths, family-friendly difficulty, and first-session fun.


## Comprehensive expansion plan approved for planning (October 30, 2026)

**North star:** Deliver an original, polished, accessible, replayable, offline-first iPhone Home Screen creature RPG. Improve decisions, variety and character attachment before expanding creature quantity. Maintain save compatibility and zero mandatory accounts, fees, advertisements or timers.

### Release A: v1.4 Foundation, reliability and first-session polish
- Audit installed iOS PWA update path end to end: check button, version manifest, service worker lifecycle, caching and offline fallback. Prevent update loops and ensure a failed update cannot lose progress.
- Harden save/load and IndexedDB/localStorage fallback; provide clear backup prompts and export verification. Preserve legacy saves.
- Rebalance tutorial, first ten encounters, coin/tonic economy, rarity, XP, type matchups, capture timing, and Guardian difficulty based on instrumentation and playtests.
- Add optional fast battle animation, reduced motion, readable tap targets, accessibility labels, and compact iPhone layout.
- Remove obsolete camp-heal friction now that every owned creature automatically heals after a completed encounter.
- Quality gate: no lost saves, reliable update after a Home Screen launch, usable offline, no layout clipping, and clear battle feedback.

### Release B: v1.5 Battle depth and strategic teams
- Give every family a coherent tactical identity: signature, passive, strength, vulnerability, and team synergy, with short comprehensible descriptions.
- Introduce telegraphed enemy intentions and differentiated Guardian behavior rather than simply more HP.
- Add a small, carefully tuned set of temporary effects with explicit duration indicators, counters and accessibility-friendly visuals.
- Add party presets and meaningful switching decisions. Keep all-party XP and free post-battle full recovery.
- Build deterministic seeded battle simulations and balance test scenarios for common/rare/Guardian enemies.
- Quality gate: at least three viable team strategies and no dominant single-move loop across representative level bands.

### Release C: v1.6 Exploration and story
- Convert 18 trail choices into branching illustrated location maps with discoveries, short events, hidden paths and clear exploration progress.
- Create six linked regional story arcs with distinct characters and satisfying Guardian resolutions.
- Introduce expedition choices (risk/reward, encounter, rest, cache, discovery) that work in 3–10-minute sessions.
- Keep story skippable and re-readable; do not gate collection behind time-limited events.
- Quality gate: each region has a distinct identity and at least two meaningful routes to pursue.

### Release D: v1.7 Creature attachment, art and mastery
- Create individually recognizable evolved silhouettes and improved original art for all 30 families.
- Species research pages with observable milestones, rewards and non-grindy completion tracks.
- Customizable habitat, favorite-creature interactions and cosmetic unlocks earned through play.
- Transparent rare-hunt progress with fair pity/catch-up mechanics; no purchase-based boosts.
- Quality gate: visual differentiation at phone size and tangible rewards for collection milestones.

### Release E: v1.8 Endgame and replayability
- Repeatable 5–10-minute expedition runs with route choices, modifiers and rewards.
- AI team tournaments, themed arenas, strategic Guardian rematches and challenge medals.
- Rotating optional challenges without punitive streaks, missable exclusive creatures or forced online checks.
- Optional locally generated team-challenge QR links, clearly labeled as asynchronous simulations rather than multiplayer.
- Quality gate: varied runs, achievable long-term goals, and fair difficulty across starter choices.

### Release F: v2.0 Ship-quality refinement
- Consistent UI and sound design, clear onboarding, accessible controls, battery-conscious performance, performance profiling on older iPhones.
- Comprehensive automated regression suite for captures, evolution, XP, Guardian rewards, sanctuary, healing, offline play, updates, imports and exports.
- Manual acceptance on actual iPhone Safari and installed Home Screen, plus Android browser/PWA where available.
- Document migration and rollback strategy for every release; verify no game-state regression.
- Balance using observed test sessions and honest metrics, not unvalidated engagement claims.

### Prioritization and scope controls
1. Reliability, save safety and update delivery first.
2. Core battle tactics and difficulty second.
3. Exploration, character attachment and differentiated creature art third.
4. Repeatable endgame and cosmetics after the first three prove fun.
5. Avoid premature cloud sync, real-time multiplayer, live events, expensive infrastructure, pay-to-win and large low-quality creature catalogs.

### Test metrics to track (locally, opt-in for shared results)
- Time to first meaningful choice, first capture and first Guardian.
- Encounter duration, win/loss rate by region, number of viable moves used, switch frequency and tonic usage.
- Party diversity, XP pacing, duplicate capture rate, rare-hunt frustration and expedition completion.
- Save restore success, update success, offline startup, mobile overflow, crash/exception count.
- Family playtest feedback on enjoyment, clarity and willingness to play again.
