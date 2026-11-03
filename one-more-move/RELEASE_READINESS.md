# One More Move: Paid iOS Release Readiness

**Working product:** One More Move, family browser playtest  
**Browser playtest:** v1.3.0 (November 3, 2026)  
**Commercial status:** Not ready for App Store submission. No paid iOS build has been created or tested.  
**Current web URL:** https://tysongreza-alt.github.io/coil-rush/one-more-move/

## Shipped browser quality improvements

- 80 distinct puzzles in five worlds with platform-neutral `levels.json`; the browser's shortest-path solver verified each known puzzle's `par` value.
- Responsive full-screen board and all controls tested in Chromium emulation at 320×480, 360×640, 375×667, 390×844, 393×852, 430×932, 768×1024, 667×375 and 844×390. This is not a substitute for real Safari or native device tests.
- Persist each unfinished attempt and undo history in each of three local player profiles. Existing `omm-saves-v1` records and stars are retained.
- World-specific board colors/materials for five chapter identities without changing symbols or hit targets.
- Better blocked-move messages: stone vs frozen rail vs one-way rail.
- Feedback if a player touches the doorway before finding every glow.
- Optional reduced-motion setting and operating-system reduced-motion support.
- In-game How to Play menu and an existing illustrated wraparound tutorial.
- Safe browser update checks with `version.json` and offline-cache versioning; active puzzles never trigger forced automatic refresh.
- No external JavaScript libraries, third-party analytics SDK, ad SDK, account creation or gameplay-data upload in browser source.

## App Store commercial decisions

1. **Name**: Working title is not cleared. App Store already has similarly named puzzle games. Select a distinguishable store name and check Apple Store search, USPTO and other markets before committing art, icon and bundle ID. Do not claim trademark clearance from a web search.
2. **Price**: Propose $0.99 USD, upfront paid download, no subscriptions, no ads, no in-app purchases. Localize prices as appropriate in App Store Connect.
3. **Audience**: General Puzzle audience, with age rating determined by Apple's questionnaire. Do not claim Kids Category or use “for kids” in metadata until we commit to Apple Kids Category requirements.
4. **Commercial experience**: Do not ship a hosted GitHub Pages web wrapper. Build a self-contained, **fully offline** iOS game using a native engine/UI (SwiftUI/SpriteKit or Flutter) and the proven levels and gameplay rules. Apple guideline 4.2 requires more than a repackaged website. Preserve browser playtest as a separate test channel.
5. **Progress migration**: Browser `localStorage` will not automatically transfer to an independently installed native game. For v1 launch, fresh native profiles are acceptable if disclosed; do not promise sync. Develop migration only if justified and privacy-safe.
6. **Update behavior**: Native iOS version updates use the App Store, not browser `version.json` or remote executable code. “Check for Updates” UI must not falsely claim to install native app updates. Remove the browser version checker from native release or have it open the official App Store updates page after launch.
7. **Store assets**: Final icon at Apple's required format, actual screenshots from native build, brief app preview if useful, metadata and keywords, release notes, accessibility and age-rating declarations. Do not substitute generated concept artwork for screenshots.
8. **Privacy**: Local profiles and progress only. No game analytics, third-party tracking, advertising, accounts or external game API. Verify final native package and transitive dependencies before selecting App Store privacy answers. Publish a valid privacy-policy URL and provide accessible in-app access to it; GitHub Pages browser telemetry may differ from an offline-native bundle.
9. **Support**: Publish a support page and a working support contact chosen by the owner. Do not include a fictitious email address.
10. **Publisher**: Set up Apple's Paid Apps Agreement and banking/tax details in App Store Connect after Developer enrollment when ready, then create app record and bundle ID.

## Native engineering gates (must actually execute before charging customers)

- [ ] Final commercial title checked for naming conflicts and owner approval.
- [ ] Native iOS source project created with permanent bundled level data and reproducible builds.
- [ ] Level mechanics, shortcuts, hints, blocked rules, portals, and star grading ported faithfully with unit tests.
- [ ] Full 80-level optimal-solution regression in native test target.
- [ ] iPhone and iPad layouts built for physical safe areas and gesture navigation.
- [ ] Touch, offline launch, audio switch, interruption/restart, haptic behavior, app-background persistence, accessible controls and dynamic UI tested.
- [ ] Real iOS hardware test across representative compact and current devices; Check small screen for clipping.
- [ ] First-time tutorial test with adults and younger family players without explanation; verify wraparound understood by Puzzle 3.
- [ ] Verify meaningful difficulty progression and 20- to 30-minute replay enjoyment with human playtests; solver results only prove solvability, not fun.
- [ ] Manual QA run including all worlds, undo, failed attempts, reset-confirmation, and corrupted local-save handling.
- [ ] Source, binary, build artifacts and dependencies audited for networking, tracking, unwanted permissions and licensing.
- [ ] App Store privacy policy, support page, age rating, accessibility, required screenshots, review notes and legal metadata prepared.
- [ ] TestFlight external playtest, then App Review and live store purchase verified.
- [ ] Switch the publicly free full browser version to a limited demo or promotional landing page **after** paid release, without breaking existing testers before launch. Do not misrepresent which platform versions are free.

## Family playtest questions

- Could each player explain edge hops and perfect routes without outside help?
- Are all five worlds visually distinct and each obstacle's behavior understandable?
- Does the game feel satisfying in silence and with sound?
- Which puzzles were frustrating, trivial, or confusing?
- Did the controls work in Safari with browser UI visible and on smaller iPhones?
- Would you replay an already-solved puzzle to improve stars?

## Source/reference

Apple official App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/  
App Store submission: https://developer.apple.com/app-store/submitting/  
App privacy details: https://developer.apple.com/app-store/app-privacy-details/

**Important:** This document tracks preparation, not proof of native completion or an Apple approval.
