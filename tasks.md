# Plunk Cup 2025 — Site Build Tasks

Build a flashy, mobile-friendly GitHub Pages hub titled **"Plunk Cup 2025 Season Analysis"**
with a top nav bar. Plan by Fable 5 (see summary below). Check off as we go.

## Stack decision (from plan)
- **Eleventy (11ty)** + Nunjucks templates + vanilla CSS/JS, deployed via **GitHub Actions**.
- **Repo markdown stays the single source of truth** — 11ty `_data/*.js` scripts parse the existing
  `.md` tables at build time. Owner keeps editing markdown; `git push` rebuilds the site.
- Site lives in **`site/`** subdir; data dirs stay at repo root (names have spaces — do NOT rename).
- Nav pages: **Home · Standings · Rosters · Draft · Grades · Trades · 2026 Outlook · Rules**.
- Design: dark-first "stadium at night," per-team accent colors, position pills, mobile card/scroll tables.

## ⚠ Decisions needed before Phase 0
- [ ] **Repo visibility:** GH Pages on a free-plan **private** repo is unavailable. Make this repo public,
      OR host from a separate public `plunk-cup-site` repo. (Public = league data is public — fine?)
- [ ] Confirm **keeper cost interpretation** (drafted round − 1 vs same-round first year) — affects the Keepers page.
- [ ] Custom domain? If yes, `pathPrefix` drops to `/` (keep it env-configurable regardless).

---

## Phase 0 — Scaffold + deploy pipeline
- [ ] 1. Resolve repo-visibility decision; confirm GH Pages available
- [ ] 2. Scaffold `site/` with Eleventy: `package.json`, `.eleventy.js` (configurable `pathPrefix`), `.gitignore` (`_site/`, `node_modules`)
- [ ] 3. Base layout (HTML shell, meta/OG tags, favicon) + design-token stylesheet (CSS custom props: palette, team colors, position colors, spacing, fonts)
- [ ] 4. Self-host fonts (Archivo Black / Anton + Inter) via woff2 + `@font-face`
- [ ] 5. Sticky top nav with mobile hamburger overlay (CSS + minimal JS, `aria-expanded`, current-page highlight)
- [ ] 6. GitHub Actions deploy workflow (`.github/workflows/deploy-pages.yml`); enable Pages (Source: Actions); verify hello page live at prefixed URL

## Phase 1 — Data pipeline + MVP content
- [ ] 7. `lib/mdTables.js` pipe-table parser utility (+ smoke checks)
- [ ] 8. `_data/teams.js` — parse `team-owner-map.md` + team color/slug/emoji config; validate exactly 8 teams
- [ ] 9. `_data/rosters.js` — parse 8 `final roster/*.md` (Offense/Kicker/DEF tables + total + Keeper Watch prose + keeper cols); validate
- [ ] 10. `_data/draft.js` — parse 8 `draft results/*.md` into flat 144-pick list; validate (18/team)
- [ ] 11. `_data/picks2026.js` — parse `draft-picks.md` ledger + derive 18×8 ownership grid, Manual-trade flags
- [ ] 12. `_data/trades.js` — parse 7 trade sections in `trades/2025-season-trades.md` into cards + prose
- [ ] 13. `_data/grades.js` — parse leaderboards/steals/busts/keeper tables from both `reports/draft-grades-2025*.md`; team cards as prose
- [ ] 14. **Home** page: hero, champion banner (Shabo/Griffin 🏆), podium, headline stat tiles, section links
- [ ] 15. **Standings** page: places 1–8, medals, links to team pages, draft-grade-vs-finish note
- [ ] 16. **Rosters** index + per-team pages: roster tables, total, Keeper Watch, that team's draft picks + trades
- [ ] 17. **Draft** page: 18×8 board, position color-coding, sticky-column horizontal scroll, per-team filter
- [ ] 18. **Grades** page: dual leaderboards (round-par + VOR), steals/busts, team cards, methodology/limits, tanking analysis
- [ ] 19. **Trades** page: timeline cards for all 7 trades, Yahoo/Manual badges, data-quality callout
- [ ] 20. **2026 Outlook** page: keeper watch per team + locked-out studs + cost caveat; pick-ownership grid + ledger
- [ ] 21. **Rules** page: scoring (Yahoo-diff highlights), roster setup, waivers/playoffs, 2026 house rules
- [ ] 22. Global mobile table patterns: row→card under 640px; scroll-grid w/ sticky first column + edge hint
- [ ] 23. Full mobile QA pass on all pages (real phone widths, nav, tap targets)

## Phase 2 — Flashy polish
- [ ] 24. Hero animation + count-up stat tiles (IntersectionObserver, respect `prefers-reduced-motion`)
- [ ] 25. Team accent colors everywhere, position pills, STEAL/BUST badges on draft board, medal/glow styling
- [ ] 26. Scroll-reveal transitions, OG social card image, light-theme pass, Lighthouse mobile ≥ 90

## Phase 3 — Charts + stretch (optional)
- [ ] 27. CSS bar charts (grade deltas, roster point totals) with table fallbacks
- [ ] 28. Draft value-by-round + grade-vs-finish visualizations (vendor Chart.js locally only if needed)
- [ ] 29. (Stretch) build-time nflverse fetch prototype applying **custom** league scoring; scheduled Action for 2026. ⚠ External PPR ≠ league scoring — label clearly if shown.
- [ ] 30. Update `README.md`: site URL, local dev (`npm start` in `site/`), "edit markdown → push → rebuilds" note

---

## Data the site presents (all already in repo)
`team-owner-map.md` · `final roster/*.md` (w/ keeper cols) · `draft results/*.md` · `draft-picks.md` ·
`trades/2025-season-trades.md` (7 trades) · `scoring rules/scoring.md` · `roster setup/setup.md` ·
`rules/league-rules-2026.md` · `reports/draft-grades-2025.md` · `reports/draft-grades-2025-positional.md`
