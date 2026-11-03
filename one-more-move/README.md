# One More Move: family browser playtest v1.2.0

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
