# Adventure development pass

Keep main unchanged. Build 3.0.0-dev.2 extends the current story rather than replacing it.

1. Add 18 authored field adventures, three in every region. Each has a connected 12-room map with visible position, adjacent travel, fog, two approaches to its central gate, optional nest/cache/secret, a captain team and a relay objective. Every room has region/trail-specific narrative. No random encounter grinding is required to unlock a Guardian.
2. Add six distinct untimed interactive puzzle rules: irrigation, echoes, tide vessels, furnace panels, wind navigation, star tiles. Each supports deterministic hints, reset and persisted intermediate state. Alternate combat approach prevents a puzzle from hard-blocking the main story.
3. Add six regional optional requests with two persistent resolutions, affecting Guardian preparation and regional restoration text. Route approach affects encounter mechanics. Rewards are one-time and independent of replayed dialogue.
4. Integrate encounter teams, completion hooks, party XP and full post-battle collection recovery. Rebalance XP around the authored route rather than the old short campaign. Preserve older badges and story nodes.
5. Validate graph reachability, all puzzle solutions, malformed-save rejection, interrupted encounters, choices/rewards, full clean campaigns across starters, optional objectives and browser navigation/layout. Record counts honestly; do not infer 8–12 human hours from added content.

Acceptance for this pass: all 18 relays completable through both approaches; every side request claimable exactly once; every puzzle solvable from every generated start and hints valid; backward saves retain old progress; full campaigns require no injected levels or currencies; regression and CI pass. These milestones do not alone satisfy the final release criteria.
