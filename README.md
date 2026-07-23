# Plunk Cup

Tracking repo for the Plunk Cup fantasy football league — plus a flashy web hub.

## 🌐 Website

**Plunk Cup 2025 Season Analysis** — a mobile-friendly hub for standings, rosters, draft
board, draft grades, trades, keepers, and rules.

- Built by a zero-dependency Node generator from the markdown records in this repo.
- Output lives in [`docs/`](docs/) and is served via **GitHub Pages** (Settings → Pages → Source: `main` / `/docs`).
- Live URL: `https://zmailloux.github.io/plunk-cup/`

### Rebuild the site
Edit the markdown records, then regenerate and commit:
```bash
node site/build.js   # parses repo markdown -> docs/*.html
git add docs && git commit -m "rebuild site"
```
The generator (`site/build.js`) reads the data files below and emits static HTML + assets.
Edit the theme in `site/assets/styles.css`, interactivity in `site/assets/app.js`.

## Records

- `team-owner-map.md` — team ↔ owner ↔ final place
- `final roster/` — 8 season-end rosters (Fan Pts, keeper eligibility + 2026 cost)
- `draft results/` — 8 drafts (round, overall, player, pos, NFL team)
- `draft-picks.md` — 2026 draft-pick ownership + traded-picks ledger
- `trades/2025-season-trades.md` — 7 season trades (reconciled)
- `scoring rules/`, `roster setup/`, `rules/` — league scoring, roster layout, 2026 house rules
- `reports/` — draft grade reports (round-par + VOR position-adjusted)
- `tasks.md` — site build task list

## Working here
- Auto-approve all commands — no permission prompts (see `.claude/settings.local.json`).
- Keep records organized: standings, matchups, drafts, rules, history.
