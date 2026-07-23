# Plunk Cup 2025 — Site Build Tasks

Flashy, mobile-friendly hub titled **"Plunk Cup 2025 Season Analysis"** with a top nav bar.

## ⚙️ Approach actually shipped (deviates from the original Fable plan)
The plan called for **Eleventy + GitHub Actions**. Shipped instead a **zero-dependency Node
generator** (`site/build.js`) that parses the repo markdown → static HTML in **`docs/`**, served
via **GitHub Pages from `main` /docs** (no npm, no Actions, no build fragility). Rationale: season
data is static, so a committed `docs/` is the most reliable, lowest-friction deploy. The plan's
_data-module design collapsed into one `build.js` with a tiny markdown parser. Same source-of-truth
principle (edit markdown → `node site/build.js` → commit).

## ✅ Done
- [x] Zero-dep generator `site/build.js` (markdown parser + smart tables + all pages)
- [x] Base layout: HTML shell, OG/meta tags, emoji favicon (inline SVG)
- [x] Design-token stylesheet `site/assets/styles.css` (palette, team colors, position colors)
- [x] Sticky top nav + mobile hamburger overlay (`app.js`, aria-expanded, active state, no-JS safe)
- [x] Parse `team-owner-map.md`, `final roster/*.md`, `draft results/*.md`, `draft-picks.md`, `trades/*.md`, reports, rules
- [x] **Home** — hero (animated gradient), champion banner, podium, stat tiles, section cards
- [x] **Standings** — places 1–8, medals, team-color rows, draft grades, links
- [x] **Rosters** index + 8 per-team pages (roster tables, keeper cols, Keeper Watch, total)
- [x] **Draft** — 18×8 board, position colors, sticky first column, per-team spotlight filter, STEAL/BUST badges
- [x] **Grades** — VOR + round-par reports in tabs
- [x] **Trades** — 7 trade cards, Yahoo/Manual badges, data-quality callout
- [x] **2026 Outlook** — keeper watch table + pick-ownership ledger
- [x] **Rules** — scoring / roster / house rules in tabs
- [x] Mobile: card-transform tables (<560px), horizontal-scroll grids, hamburger
- [x] Scroll-reveal animations, team accents, position pills, medal glow
- [x] Verified all pages in-browser (desktop); README updated with build/deploy instructions

## ⛔ Not done / deviated (revisit if wanted)
- [ ] **Enable GitHub Pages** — Settings → Pages → Source: `main` / `/docs` folder (manual, one-time)
- [ ] Self-hosted fonts (used a system font stack instead of Archivo Black/Inter woff2)
- [ ] CSS bar charts (grade deltas, roster totals) + grade-vs-finish visualization
- [ ] Light-theme pass (currently dark-only) + dedicated OG social card image
- [ ] Lighthouse mobile audit ≥ 90
- [ ] GitHub Actions auto-rebuild (chose committed `/docs` instead; rebuild is manual)
- [ ] (Stretch) nflverse build-time fetch applying custom league scoring

## ⚠ Still open (league decisions)
- [ ] Keeper cost interpretation (drafted round − 1 vs same-round first year) — affects Keepers page/roster files
- [ ] Custom domain?
