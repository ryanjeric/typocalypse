# Typocalypse — Typing Survival

A fast-paced typing survival game. Type words to destroy enemies, survive waves, and unlock upgrades.

## How to Play

1. **Choose your weapon** — Bolt, Arc Beam, Shrapnel Cannon, Venom Spitter, Pulse Nova, or Ricochet Disc
2. **Select difficulty** — Easy, Normal, or Hard
3. **Type words** — Enemies spawn with words above them. Type the word to fire your weapon and deal damage
4. **Survive waves** — Clear each wave to choose an upgrade and face stronger enemies
5. **Build mastery** — Earn weapon-specific bonuses at 25 and 50 kills per weapon

## Features

- **6 unique weapons** — Each with distinct attack patterns and weapon-specific upgrades
- **5 visual themes** — Dark, Light, Neon, Retro, Minimal (cycle via THEME button)
- **Particle density settings** — Low, Medium, or High (Settings or Pause menu)
- **Upgrades** — Damage, speed, health, chain strikes, regen, crits, drones, and more
- **Curse upgrades** — High-risk, high-reward options with downsides
- **Weapon mastery** — Track kills per weapon and unlock bonuses at 25/50 kills
- **High scores & stats** — Persisted in localStorage

## Quick Start

Open `index.html` in a modern browser. No build step required.

```bash
# Or serve locally
npx serve .
# or
python -m http.server 8000
```

## Controls

- **Type** — Target enemies by typing the first letter, then complete the word to fire
- **Escape** — Clear target or pause
- **1, 2, 3** — Select upgrade when wave clears

## Tech Stack

- Vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- CSS variables for theming
- localStorage for persistence

## License

MIT
