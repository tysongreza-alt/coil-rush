# One More Move: family browser playtest

Open the web game at: https://tysongreza-alt.github.io/coil-rush/one-more-move/

80 individual, solver-verified puzzles across five worlds. Swiping the game board, using the directional buttons, or pressing keyboard arrows moves the traveler one square on its current row or column, with wraparound edges. Collect all glows (in order when numbered), then reach the portal-shaped exit before the move budget expires.

**Features:** separate local progress for three players, undo, restart, dynamic shortest-route hints, one- to three-star mastery, seeded local daily challenge, optional sounds and vibration, no ads or accounts, lightweight offline caching after initial load.

**Development status:** mobile browser playtest release. This is not an App Store build or a monetized product. Puzzle maps were generated and selected with a deterministic seeded builder, then each level was shortest-path verified. Android and iOS browser/device user testing are still important before commercial publication.

**Privacy:** localStorage saves game progress on the user's own device. There are no trackers, external dependencies, logins, network APIs, or game-state uploads. The service worker caches static resources only.

**Implementation:** self-contained HTML/CSS/JavaScript with locally generated SVG/CSS-style art. Developed separately under the existing GitHub Pages repository, and does not modify Coil Rush or Wildkin app files.

**QA:** a representative 11-level Playwright interaction suite passed, plus a complete 80-level browser-engine solved-path verification. Device testing and family playtest feedback are the next gates.
