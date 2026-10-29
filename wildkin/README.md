# Wildkin: The Living Wilds

An original, free, family-friendly creature-collecting adventure for phone browsers. Single-player, installable as a home-screen web app, with no login or paid infrastructure.

## Live game

https://tysongreza-alt.github.io/coil-rush/wildkin/

## Player loop

1. Choose Mosslet (Grove), Flintail (Ember), or Brookit (Tide).
2. Search the current region to find a wild Wildkin or a supply cache.
3. Battle using Strike, Element Burst, Guard, team switching, and recovery tonics.
4. Weaken a creature and try a timing-based bond with a Bond orb or stronger Prism orb.
5. Capture, level, evolve at level 12, organize up to 3 battle teammates, and log discoveries in the KinDex.
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

- Battles grant experience and coins; creature captures also grant coins and XP.
- Coin sinks: Bond orbs, Prism orbs, recovery tonics.
- Three daily quests give coins and bonus orbs.
- Player's rank increases with total battle wins and catches.
- Progress auto-saves locally using `localStorage` on each device/browser.
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