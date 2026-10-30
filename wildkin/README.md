# Wildkin: The Living Wilds

An original, free, family-friendly creature-collecting adventure for phone browsers. Single-player, installable as a home-screen web app, with no login or paid infrastructure.

## Live game

https://tysongreza-alt.github.io/coil-rush/wildkin/

## Player loop

1. Choose Mosslet (Grove), Flintail (Ember), or Brookit (Tide).
2. Pick from three trails in each region. Explore different locations to influence creature rarity, find caches, and earn first-discovery coins.
3. Battle with Strike, Element Burst, Guard, 30 family-specific signature moves, teammate switches, and recovery tonics.
4. Weaken a creature and try a timing-based bond with a Bond orb or stronger Prism orb.
5. Capture and level creatures, evolve at level 12, and manage a three-member battle party plus a searchable, paged Sanctuary for all other creatures.
6. Win enough battles to challenge one of six Guardians. Earn region seals to open the next region.
7. Pursue all 30 creature families and 60 form entries, elusive Aurora color variants, daily quests, leveling up to 60, and repeatable scaling Guardian trials.

## Creature system

- Six elements: Grove, Ember, Tide, Storm, Stone, Lunar.
- Each element has one offensive advantage, yielding more damage against its target.
- Six regions, 5 unique families per region (3 common, 1 uncommon, 1 rare), with evolved forms.
- Wild encounters have varied levels, rarities, and approximately 2.5% Aurora chance.
- Catch probability improves as opponent HP drops and with high-quality orbs and timing.
- No stamina or artificial session caps. Camp healing is free.

## Progress and economy

- Every completed fight gives each battle-party companion the full XP award, including fainted teammates. Captures earn XP, as do losses at reduced XP. Escapes do not earn XP. A newly captured creature joins after that battle's XP allocation. Result screens display every companion's individual award and level changes.
- Coin sinks: Bond orbs, Prism orbs, recovery tonics. Guardians can be befriended free after victories.
- Three daily quests give coins and bonus orbs.
- Player's rank increases with total battle wins and catches.
- Progress auto-saves in IndexedDB on the current device/browser, with a localStorage mirror when space allows and automatic migration of earlier saves. There is no artificial 350-creature cap, but browser/device quotas still apply.
- Camp → Export backup saves JSON that can be restored later.

## Family sharing

Camp → Family gifting produces a creature gift link. With the optional QR generator loaded, it also displays a QR code compatible with phone cameras. The receiving phone opens the link and accepts a copy of the creature. The original creature remains with its owner. This is not server-verified trading or ownership transfer: links can be reused or fabricated. Online QR display uses the public `qrcodejs` CDN; copy/paste gift links work without that optional library.

## Architecture

- `index.html`: mobile viewport, app shell, PWA metadata.
- `game.js`: self-contained data, SVG creature renderer, battle engine, save system, daily goals, gift encoding and UI. No backend.
- `styles.css`: responsive mobile-first interface, creature art presentation, battles, collection and dialogs.
- `icon.svg`: app icon.
- `manifest.webmanifest`: optional Add to Home Screen.
- `sw.js`: static asset caching for offline use after first successful load on HTTPS.

## QA to do with real devices

Automated JavaScript tests exercised starter choice, navigation, saving, searching, dozens of battle turns, gift code validation, and a Guardian encounter without throwing. A full mobile browser acceptance test (especially iPhone Safari, safe-area layout, QR loading and iOS Add to Home Screen) has not yet been completed. Test on the actual family phones before relying on long-term saves. Export a backup periodically.

## Future update candidates

- A dedicated regional storyline and NPC dialogue.
- Distinct move sets and status conditions by species.
- More biomes, creature families, collection rewards and achievements.
- Cloud account sync (would require a persistent backend).
- Genuine one-time ownership transfer or live trading (would require identity and server-side transactions).

No Pokémon names, characters or assets are used. Wildkin creatures, names and setting are original.

## Version 1.1: Battles with clarity

- Creature moves happen in distinct phases with visible announcements, short pauses, and damage feedback.
- Every attack explains elemental effectiveness: 1.4x strong, 0.74x resisted, and 1.0x neutral.
- Once you land an attack on a species, its matchup is saved and displayed in subsequent fights.
- Move Details explains Strike, Element Burst, Guard, and Bond, including energy, healing, protection, and critical chance.
- Battle action history is available under Previous Actions.
- All creatures received extra hand-drawn SVG detailing and battle background effects.
- Version 1 saves and backups remain compatible. The PWA refreshes the updated version on return.

## Version 1.3.1: Sanctuary, party XP and signature adventure

- Sanctuary storage has three views (Stored, Party, All), search, type filtering, sorting, favorites and 24-creature pages. When the party is full, a single tap opens a swap chooser. No fixed in-game creature capacity.
- All active teammates gain full XP after a win or successful capture, including fainted members. A reduced award is granted after defeat. Individual XP and level gains are shown after every resolved battle; fleeing earns none.
- Thirty original creature signature attacks add six tactical mechanics: healing, heavy damage, energy charging, damage reduction, enemy weakening and possible staggering. Creatures have visible role labels and additional evolved SVG decorations.
- Six regions each offer three explorable destinations, 18 total. Trail selection affects encounter rarity; first explorations provide coins and records of places visited.
- Larger collections persist in an on-device IndexedDB vault where available. Older version-1 save data is still recognized and migrated. Export backups periodically, especially on iPhone.
- Automated gameplay smoke tests cover parties with 600+ creatures, swaps, XP for fainted members, regular and Guardian victories, captures, defeat XP, and browsing the 18 trails. Actual iOS and Android device acceptance tests remain to be done.
