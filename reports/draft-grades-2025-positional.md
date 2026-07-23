# Plunk Cup — 2025 Draft Report Card (Positional / VOR Method)

*A more defensible companion to `draft-grades-2025.md`. Same data, better yardstick:
we grade each pick against a **position-specific replacement level**, not a positionally
mixed "round par." This is the standard **Value Over Replacement (VOR)** approach.*

---

## Why VOR beats round-par

The original report card graded each pick on **round par** — the average Fan Pts of everyone
taken in that round. That has one well-known flaw: RBs and WRs dominate raw scoring, so round
par is really an *RB/WR par*. A perfectly good early QB or the one elite TE reads as "below par"
purely because it's being compared to running backs. That penalizes exactly the scarce,
roster-defining positions a 2-QB league should reward.

**VOR fixes this by asking a better question:** not "did this player outscore his draft-mates?"
but **"how many points did he provide above the *worst startable player at his own position*?"**
A 200-point TE and a 200-point WR are not equal — in this league the 200-pt TE is a top-3
positional asset while the 200-pt WR is a WR3/flex. VOR captures that; round-par can't.

Two more properties we keep:
- **Credit follows the pick, not the trade.** A drafted player's season points count for whoever
  **drafted** him, even if later dealt. Master Player→Fan Pts map is built from **all 8 final
  rosters**, then joined back to the draft board.
- **A draft-cost anchor.** To avoid simply re-ranking by talent, the *team grade* compares each
  pick's VOR to the **average VOR of all players taken in the same round** (delta = pickVOR −
  roundAvgVOR). A stud in Round 1 is *expected*; a stud in Round 10 is a steal.

---

## Method in four steps

1. **Replacement baseline per position** from the league's starting demand across 8 teams.
2. **VOR** = playerPts − positionBaseline (position-adjusted value).
3. **Round-anchored delta** = pickVOR − average VOR of that round's known picks.
4. **Team grade** = mean delta across a team's known picks → ranked → lettered.

### Replacement baselines

Starting demand (8 teams): dedicated **QB 16, RB 16, WR 24, TE 8**, plus **24 W/R/T flex** slots
and 1 K / 1 DEF each.

**Flex split (the one judgment call):** the drafted/rostered pool skews RB/WR, so I distribute
the 24 flex slots **RB 10 / WR 11 / TE 3** — WR-lead (deepest pool, most flex-eligible bodies),
RB close behind, a small TE share (only the top handful of TEs ever start at flex). The
replacement rank is then `dedicated + flex share`, and the baseline is the Fan Pts of the player
at that rank within the full scored pool.

| Pos | Dedicated | Flex share | Replacement rank | Baseline (Fan Pts) | Replacement player | Scored pool |
|-----|:---------:|:----------:|:----------------:|:------------------:|--------------------|:-----------:|
| QB  | 16 | 0  | **16** | **192.9** | Lamar Jackson | 21 |
| RB  | 16 | 10 | **26** | **169.8** | Quinshon Judkins | 41 |
| WR  | 24 | 11 | **35** | **169.1** | Romeo Doubs | 55 |
| TE  | 8  | 3  | **11** | **129.8** | Colby Parkinson | 15 |
| K   | 8  | —  | **8**  | 151.5 | Chris Boswell | 8 |
| DEF | 8  | —  | **8**  | 185.4 | Chiefs | 8 |

Note how tight RB (169.8) and WR (169.1) baselines are, while **TE replacement is 40+ pts lower**
— that's the scarcity VOR rewards. **QB baseline is the highest (192.9)** because a 2-QB league
needs 16 starting QBs, pushing replacement deep into startable-but-mediocre territory. K/DEF are
graded but near-random; treat them as noise.

---

## 🏆 Draft Grade Leaderboard (VOR-delta)

| Rank | Manager | Team | Avg VOR-Δ / pick | Grade | Known / UNK | Final Place |
|-----:|---------|------|-----------------:|:-----:|:-----------:|:-----------:|
| 1 | **Devin** | Rocket Lab | **+23.0** | **A+** | 15 / 3 | 4th |
| 2 | Griffin | Shabo | +8.8 | A− | 15 / 3 | 1st 🥇 |
| 3 | Jared | Egbuka Oblongata | +3.0 | B | 12 / 6 | 6th |
| 4 | Lucas | The RESET | −1.3 | B− | 15 / 3 | 2nd 🥈 |
| 5 | Padula | Padula Oblongata | −4.7 | C+ | 12 / 6 | 8th |
| 6 | Kervin | Shy Or Not Shy | −7.6 | C | 10 / 8 | 5th |
| 7 | Paul | Ball Spetrini | −11.4 | C− | 13 / 5 | 3rd 🥉 |
| 8 | Zach | Drunk Drafting | −16.4 | D | 13 / 5 | 7th |

**What changed vs. round-par:** the order is nearly identical at the top (Devin, Griffin, Jared)
but **Lucas jumps from C (6th of 8) to B− (4th)**. That's the method working — round-par punished
his elite Bijan (an "RB in an RB-heavy round") and undervalued his late-QB haul (Prescott R11,
Herbert R12). VOR pays those correctly. The bottom three (Kervin, Paul, Zach) hold.

**Draft ≠ finish, again.** Devin owns the best board by a mile and finished **4th**. Paul and
Lucas both drafted below-to-middling and reached the podium on in-season management. The
correlation between this draft grade and final place is weak — points get won and lost on the
waiver wire and trade table, not just draft night.

---

## 🔥 Top 10 VOR Steals (round-anchored delta)

| # | Player | Pos finish | Drafted | By | Fan Pts | VOR | Δ vs round | Keeper? |
|--:|--------|:----------:|--------:|----|--------:|----:|-----------:|:-------:|
| 1 | Christian McCaffrey | RB1 | R2 (11) | Griffin | 414.6 | +244.8 | **+211** | ❌ R1–4 |
| 2 | Trey McBride | **TE1** | R5 (37) | Paul | 315.9 | +186.1 | **+154** | ✅ R5+ |
| 3 | Jaxon Smith-Njigba | WR2 | R4 (31) | Kervin | 357.9 | +188.8 | **+153** | ❌ R1–4 |
| 4 | George Pickens | WR5 | R6 (44) | Devin | 287.9 | +118.8 | **+132** | ✅ R5+ |
| 5 | Dak Prescott | QB6 | R11 (81) | Lucas | 294.3 | +101.4 | **+98** | ✅ R5+ |
| 6 | James Cook III | RB6 | R5 (39) | Padula | 299.2 | +129.4 | **+97** | ✅ R5+ |
| 7 | Bijan Robinson | RB2 | R1 (1) | Lucas | 369.8 | +200.0 | **+83** | ❌ R1–4 |
| 8 | Drake Maye | QB3 | R9 (70) | Jared | 323.5 | +130.6 | **+81** | ✅ R5+ |
| 9 | Jahmyr Gibbs | RB3 | R1 (5) | Devin | 365.9 | +196.1 | **+79** | ❌ R1–4 |
| 10 | Puka Nacua | WR1 | R3 (18) | Padula | 375.0 | +205.9 | **+72** | ❌ R1–4 |

**Keeper lens (R5+ eligible):** the standout keeper-eligible steals are **McBride (R5), Pickens
(R6), Cook (R5), Maye (R9), and Prescott (R11)** — cheap contracts on elite production. The two
biggest raw steals, **McCaffrey (R2)** and **JSN (R4)**, are *not* keeper-eligible (R1–4 can't be
kept), so their value is single-season only. McBride is arguably the best keeper asset in the
league: the **#1 TE at a Round-5 price**, in a format where TE replacement is 40 pts below RB/WR.

*Position-adjusted footnote:* by **raw VOR** (no round anchor), the single most valuable pick was
still McCaffrey (+245), followed by Nacua (+206), Bijan (+200), Gibbs (+196), and Jonathan Taylor
(+192) — an all-RB top of the board, with McBride (TE1, +186) and JSN (WR2, +189) as the top
non-RB values.

## 💀 Top 10 VOR Busts (round-anchored delta)

| Player | Pos finish | Drafted | By | Fan Pts | VOR | Δ vs round |
|--------|:----------:|--------:|----|--------:|----:|-----------:|
| Jayden Daniels | QB20 | R2 (12) | Paul | 104.3 | −88.6 | **−122** |
| Travis Hunter | WR53 | R8 (61) | Paul | 62.8 | −106.3 | **−117** |
| Garrett Wilson | WR47 | R4 (32) | Zach | 98.5 | −70.6 | **−107** |
| Joe Burrow | QB19 | R4 (26) | Padula | 126.0 | −66.9 | **−103** |
| Darnell Mooney | WR52 | R15 (113) | Lucas | 80.3 | −88.8 | **−103** |
| Tyreek Hill | WR54 | R6 (46) | Griffin | 54.5 | −114.6 | **−102** |
| Isiah Pacheco | RB38 | R8 (63) | Padula | 87.3 | −82.5 | **−93** |
| Terry McLaurin | WR45 | R5 (35) | Jared | 114.2 | −54.9 | **−87** |
| Ricky Pearsall | WR50 | R12 (94) | Griffin | 88.6 | −80.5 | **−87** |
| Xavier Worthy | WR46 | R7 (49) | Lucas | 109.9 | −59.2 | **−87** |

The two worst were **early-QB reaches that VOR punishes hardest**: Daniels (R2) and Burrow (R4)
both finished outside the QB16 startable tier in a 2-QB league — a double failure of cost and
scarcity. Note CeeDee Lamb (WR24, −85) and Justin Jefferson (WR23, −85) grade as R1
disappointments here, but both cleared replacement (positive VOR); they're "expensive floor,"
not true busts.

---

## 🧠 The 2-QB question: was late-QB hoarding the winning move?

The QB baseline (192.9) is the highest of any position — a direct artifact of needing **16
starting QBs**. That makes the QB market brutally bimodal: nail one late and you've banked a
+50-to-+100 VOR edge every week; reach early and miss, and you've torched a premium pick.

The scoreboard is stark. **Every QB taken in Round 9 or later posted a positive round-delta:**

| QB | Drafted | By | Δ vs round | Final place |
|----|--------:|----|-----------:|:-----------:|
| Drake Maye (QB3) | R9 | Jared | +81 | 6th |
| Bo Nix (QB7) | R9 | Devin | +49 | 4th |
| Jared Goff (QB9) | R10 | Padula | +50 | 8th |
| Dak Prescott (QB6) | R11 | Lucas | +98 | 2nd |
| Justin Herbert (QB10) | R12 | Lucas | +56 | 2nd |

…while the two **early** QB gambles (Daniels R2 −122, Burrow R4 −103) were the draft's two worst
picks outright.

**Verdict: late-QB value was a genuine, repeatable edge — but not a guaranteed *winning*
strategy.** The clearest beneficiary was **Lucas**, who paired **Prescott (R11) + Herbert (R12)**
into a two-headed QB engine and rode it to **2nd** — the strongest evidence for the thesis. But
**Padula got Goff (R10, +50) and still finished dead last**, and **Jared's Maye (R9, +81) — the
best late-QB pick in the draft — only reached 6th.** Meanwhile the actual **champion, Griffin,
did *not* hoard late QBs**: his R5 QB (Mahomes) was dropped entirely and he started **Baker
Mayfield (R8) + a waiver Stafford**. He won on **McCaffrey**, not quarterback arbitrage.

So: waiting on QB in this 2-QB format was clearly *correct* — it never cost anyone and often won
weeks — but it was a floor-raiser, not a trophy-winner. The title still ran through an elite RB.

---

## Team notes

**🥇 Devin — Rocket Lab — A+ (+23.0).** The most complete board in the league and it isn't close.
Every pick R1–R10 cleared replacement: Gibbs (RB3), Josh Allen (QB1, +148 VOR), Pickens (WR5,
+132 delta steal), Zay Flowers, D'Andre Swift, Bo Nix all positive. Finished **4th** — an A+ draft
stranded by roster construction and schedule. The cautionary tale of the report.

**🥇 Griffin — Shabo — A− (+8.8).** **McCaffrey at R2 (+211) is the single best pick in the draft**
and it won the championship. Chase (WR4), Olave (R10 +65), Mayfield (R8 +42), Javonte (R15 +59)
round it out. Dragged down by Tyreek Hill (WR54, −102) and Pearsall (−87), plus 3 UNK (Mahomes,
Kyler, Njoku all churned). Turned a good-not-great board into the banner.

**Jared — Egbuka Oblongata — B (+3.0).** Strong spine: ARSB (WR3), Maye (R9 +81), Etienne (R13
+55), Sutton, Egbuka all positive. Undone by McLaurin (R5, −87) and Bucky Irving (R2, −65), plus a
**thin tail — 6 UNK** (Conner, Golden, McCarthy, Kraft, Stroud, Loveland). Good top, hollow bottom.

**🥈 Lucas — The RESET — B− (−1.3).** The method's biggest riser. Bijan (RB2, +83), the
Prescott+Herbert QB stack (+98/+56), Adams (R6 +67), Tyler Warren (TE4 +47) are all real VOR wins.
But he offset them with Worthy (R7, −87), Mooney (R15, −103) and MHJ (R5, −73). A middling board
that VOR treats far more kindly than round-par did — and he managed it to **2nd**.

**Padula — Padula Oblongata — C+ (−4.7).** Boom-or-bust incarnate. Elite hits — Nacua (WR1, +72),
Cook (R5, +97), Goff (R10, +50) — wrecked by Burrow (R4, −103), Pacheco (R8, −93) and BTJ (R2,
−64), plus **6 UNK**. The volatility showed up as an **8th-place** finish.

**Kervin — Shy Or Not Shy — C (−7.6).** **JSN at R4 (+153) is the 3rd-best pick in the draft**, and
Chase Brown (RB7) was a hit — but the board is a home run wrapped in noise. **Heaviest churn: 8
UNK** picks dropped (LaPorta, Montgomery, Kaleb Johnson, Fields, Andrews, Mixon, B.Robinson,
K.Allen). Mike Evans (R6, −71) and Aaron Jones (R10, −86) hurt. High variance, replaceable tail.

**🥉 Paul — Ball Spetrini — C− (−11.4).** Owns the draft's best steal (**McBride, TE1, R5, +154**)
*and* its two worst picks (Daniels R2 −122, Hunter R8 −117). Jonathan Taylor (RB4, +58), Hurts (R4,
+50), Breece Hall (+51) were strong; the R1–R2 and R8 craters sink the average. Drafted 7th by this
measure, **finished 3rd** on the league's busiest trade docket. Manager > draft.

**Zach — Drunk Drafting — D (−16.4).** The name checks out. Achane (RB5, R3, +19) and a decent RB
middle (Henderson +36, Harvey, Jameson Williams +24) are buried under Garrett Wilson (R4, −107),
Hampton (R5, −66) and Kamara (R6, −56), plus Malik Nabers (R1) churned to UNK. Then he **sold the
good picks** (Achane, London) for future assets — his D board understates a deliberate rebuild, but
the board itself was the worst in the league.

---

## Methodology limits — read before arguing

1. **Custom scoring.** All Fan Pts are league-specific (fractional, negative points enabled), not
   standard PPR. Baselines are internal to this league only.
2. **UNK gaps (39 picks).** Drafted players dropped before season's end have **no tracked points**
   and are excluded from team averages — so teams with heavy churn (Kervin 8, Padula/Jared 6) have
   noisier grades built on fewer data points. UNK counts are shown in the leaderboard; a high count
   is itself a signal that a team drafted risky/replaceable bodies.
3. **Flex-split assumption.** The RB 10 / WR 11 / TE 3 division of the 24 flex slots is a reasoned
   estimate of how flex actually gets filled, not a measured fact. Shifting it a slot or two would
   nudge the RB/WR baselines by a few points but wouldn't reorder the leaderboard (RB and WR
   baselines already sit within 1 pt of each other).
4. **K/DEF are near-random** and included only for completeness; don't read anything into a
   kicker's VOR.
5. **Round-anchored deltas** deliberately keep a draft-cost frame, so this grades *draft-day
   decision quality*, not raw roster talent. Kervin's Round-4 JSN is a bigger "win" than Griffin's
   Round-1 Chase even though Chase-the-player was picked earlier — because JSN vastly beat his
   round-mates and Chase merely met R1 expectations.

---

*Generated from `draft results/`, `final roster/`, and `team-owner-map.md`. Companion to the
round-par report in `draft-grades-2025.md`; VOR credit follows the pick, not the trade. Baselines
and deltas rounded for display; underlying figures computed to two decimals.*
