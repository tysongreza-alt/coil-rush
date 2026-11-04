# One More Move: family browser playtest v1.7.0

Open the web game at: https://tysongreza-alt.github.io/coil-rush/one-more-move/

80 individual, solver-verified puzzles across five worlds. Swiping the game board, using the directional buttons, or pressing keyboard arrows moves the traveler one square on its current row or column, with wraparound edges. Collect all glows (in order when numbered), then reach the portal-shaped exit before the move budget expires.

**Features:** separate local progress for three players, undo, restart, dynamic shortest-route hints, one- to three-star mastery, seeded local daily challenge, optional sounds and vibration, no ads or accounts, lightweight offline caching after initial load.

**Development status:** mobile browser playtest release. This is not an App Store build or a monetized product. Puzzle maps were generated and selected with a deterministic seeded builder, then each level was shortest-path verified. Android and iOS browser/device user testing are still important before commercial publication.

**Privacy:** localStorage saves game progress on the user's own device. There are no trackers, external dependencies, logins, network APIs, or game-state uploads. The service worker caches static resources only.

**Implementation:** self-contained HTML/CSS/JavaScript with locally generated SVG/CSS-style art. Developed separately under the existing GitHub Pages repository, and does not modify Coil Rush or Wildkin app files.

**QA:** a representative 11-level Playwright interaction suite passed, plus a complete 80-level browser-engine solved-path verification. Device testing and family playtest feedback are the next gates.

## Version 1.2.0: responsive phones and automatic updates

- The game screen sizes its board to the remaining visible viewport height, not merely screen width. All gameplay controls stay on screen without page scrolling, including compact phone viewports and a dedicated landscape layout.
- Current version is visible at the top of the game and in Settings.
- Settings includes **Check for updates**. When online, the app checks GitHub Pages' `version.json` and can automatically refresh to a newer release when it is safe to do so.
- An unfinished puzzle is protected from unexpected reloads. If the player is playing or opened Settings from an active puzzle, an update waits until the player leaves the puzzle.
- New app versions refresh on initial launch, return to the page, or while the app remains active. Offline checks fail gracefully. A browser app cannot install updates while fully closed; it checks when opened and connected again.
- The version-aware service worker retains locally cached game assets for offline use but prefers network-fresh files whenever available.
- QA: Chromium mobile emulation across eight viewport dimensions, 320×480 to 430×932 plus 667×375 landscape; first and third puzzle gameplay; version checks; and active-puzzle safety. Final on-device Safari verification remains useful.

## Version 1.3.0: commercial polish and quality hardening

- Local save state now preserves an unfinished puzzle plus its undo history, separately for each of three profiles; completed stars and previous progress remain intact.
- Five worlds have distinct board materials and ambient colors while retaining their original puzzle geometry.
- Blocked-move explanations now differentiate stones, frozen lines and one-way rails; unfinished exits explain the remaining glow goal.
- Added How to Play in Settings, an optional reduced-motion toggle and OS-level prefers-reduced-motion support.
- Improved layout fitting after dynamic phone viewport changes (including Safari bars and orientation changes).
- Exported platform-neutral `levels.json` for the eventual native iOS build.
- Local automated browser validation passed all 80 shortest routes, multi-profile resume/undo, and nine viewport configurations including compact phones and landscape.
- Commercial launch checklist: `RELEASE_READINESS.md`; provisional App Store metadata: `STORE_COPY_DRAFT.md`.
- The browser game is still a **free family playtest**. It is not yet an App Store app or a paid native release.


## Version 1.5.0: hint accessibility and dismissible guides

- Hint and gameplay feedback are now shown in a compact in-layout message row above the board, instead of a bottom toast that could cover directional controls.
- The first play in each of the five worlds displays its world-specific guide with a one-tap **Got it** button. Dismissal persists separately for each player profile, leaving additional room for the puzzle board.
- A permanent **?** button next to Exit reopens the current world's guide without resetting the puzzle. The embedded edge-hop illustration remains available.
- The board recalculates its size as guides or status messages appear and disappear, maintaining the one-screen layout.
- Updating a running game with an unfinished puzzle is deferred until the player exits that puzzle. Older tabs can still show an earlier version until a safe update takes place.

## Version 1.7.0: character collection, progression, and iPhone icon

- **Glowbud** is the default playable character, illustrated in pure vector graphics and visible in the puzzle and home screen. Six additional cosmetic companions: **Bloop**, **Pebble**, **Nova**, **Glint**, **Starbean**, and **Pip**.
- World entry is gated by clearing prior levels **and** cumulative star thresholds. World 2: 24 stars; World 3: 52 stars; World 4: 84 stars; World 5: 120 stars. All prior levels must be cleared for each gate. World 1 is always accessible.
- Within a world, the next unsolved puzzle unlocks only after completing the previous puzzle. Completed puzzles remain replayable to improve the star count.
- Opening Worlds 2–5 unlocks Bloop, Pebble, Nova, and Glint, respectively. Completing all 80 levels unlocks Starbean. Collecting 180 of the maximum 240 stars unlocks Pip.
- The character locker is accessible from the home screen and Settings; characters do not change the difficulty. Unlocks and current character are saved separately for each player.
- Existing playtest saves are **grandfathered** into any levels/worlds they reached prior to this release, avoiding loss of access. Resetting a player starts the new progression from Puzzle 1.
- Hint and gameplay feedback live in a **fixed-height dock below the arrows**, using remaining screen space and never moving the board when messages appear.
- A real **180x180 PNG home-screen icon** and improved SVG icon now feature Glowbud. A previously installed home-screen shortcut may need to be removed and re-added to refresh the icon; doing so should not require clearing Safari site data.
- Test: `node one-more-move/tests/verify-progression.mjs`. Solver and browser device tests still required for the final production build.


## Version 1.7.1: fixed shrinking puzzle board

The hint dock intentionally uses a flex auto margin to stay at the bottom of the phone. Chromium/Safari can resolve that auto margin to a changing pixel value. The responsive layout estimator previously counted it as fixed content, producing a feedback loop: each tap recalculated a smaller board, which enlarged the auto margin, which made the next board smaller. The estimator now **excludes the reserved hint dock's flexible margin** while continuing to count the dock's actual fixed height. Repeated recalculations therefore converge immediately to a stable board size.

Reproduction/regression exercise: simulated an auto-margin feedback dock and compared 8 sequential layout recalculations, which previously shrank the board from ~300 to ~146 pixels at 390×844. With the fix, it remained 366 pixels. An additional automated interactive test across 320×568, 375×667, 390×844, 430×932, and 667×375 reported zero board-size drift after 16 repeated hints, moves, retries, and layout recalculations at each size. Physical iPhone/Safari confirmation is still required.
