#!/usr/bin/env node
/* Plunk Cup 2025 — static site generator (zero deps).
   Parses repo markdown -> flashy static HTML in /docs. Run: node site/build.js */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'docs');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ---------- team metadata ---------- */
const TEAMS = {
  griffin: { team: 'Shabo',            color: '#FBBF24', emoji: '👑' },
  lucas:   { team: 'The RESET',        color: '#93C5FD', emoji: '🔄' },
  paul:    { team: 'Ball Spetrini',    color: '#FB923C', emoji: '⚽' },
  devin:   { team: 'Rocket Lab',       color: '#F87171', emoji: '🚀' },
  kervin:  { team: 'Shy Or Not Shy',   color: '#C084FC', emoji: '😳' },
  jared:   { team: 'Egbuka Oblongata', color: '#2DD4BF', emoji: '🅰️' },
  zach:    { team: 'Drunk Drafting',   color: '#4ADE80', emoji: '🍺' },
  padula:  { team: 'Padula Oblongata', color: '#F472B6', emoji: '🧠' },
};
const POS_COLORS = { QB:'#F87171', RB:'#4ADE80', WR:'#60A5FA', TE:'#FB923C', K:'#94A3B8', DEF:'#C084FC' };

const STEALS = ['Christian McCaffrey','Jaxon Smith-Njigba','George Pickens','Trey McBride','Dak Prescott','James Cook III','Drake Maye','Jared Goff','Justin Herbert','Chris Olave'];
const BUSTS  = ['Travis Hunter','Garrett Wilson','Jayden Daniels','Tyreek Hill','Isiah Pacheco','Ricky Pearsall','T.J. Hockenson'];

/* ---------- tiny markdown parser ---------- */
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function inline(s){
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>')
    .replace(/(^|[^\w])_([^_]+)_(?=[^\w]|$)/g,'$1<em>$2</em>');
}
function posPill(p){ const c = POS_COLORS[p] || '#94A3B8'; return `<span class="pill" style="--pc:${c}">${esc(p)}</span>`; }
function smartCell(val, header){
  const h = header.toLowerCase();
  if (h==='pos' && POS_COLORS[val.trim()]) return { html: posPill(val.trim()), cls:'c-pos' };
  if (h.includes('fan pts') || h.includes('pts')) return { html: `<b>${inline(val)}</b>`, cls:'c-num' };
  if (h.includes('keeper cost') || h==='2026 keeper cost') return { html: val.trim()==='—'?'<span class="dim">—</span>':`<span class="badge cost">${inline(val)}</span>`, cls:'c-cost' };
  if (h.includes('elig')) { const yes=/yes/i.test(val); return { html:`<span class="badge ${yes?'ok':'no'}">${inline(val)}</span>`, cls:'c-elig' }; }
  if (h.includes('grade')) return { html:`<span class="grade">${inline(val)}</span>`, cls:'c-grade' };
  return { html: inline(val), cls:'' };
}
// Render markdown -> html. Tables get data-labels + smart cells (class "cardify").
function md(src){
  const lines = src.replace(/\r/g,'').split('\n');
  let out = [], i = 0;
  while (i < lines.length){
    let l = lines[i];
    if (/^\s*$/.test(l)) { i++; continue; }
    if (/^---+\s*$/.test(l)) { out.push('<hr>'); i++; continue; }
    let hm = l.match(/^(#{1,4})\s+(.*)$/);
    if (hm) { const n=hm[1].length; out.push(`<h${n}>${inline(hm[2])}</h${n}>`); i++; continue; }
    if (/^>\s?/.test(l)) { let b=[]; while(i<lines.length && /^>\s?/.test(lines[i])){ b.push(lines[i].replace(/^>\s?/,'')); i++; } out.push(`<blockquote>${md(b.join('\n'))}</blockquote>`); continue; }
    // table
    if (l.includes('|') && i+1<lines.length && /^[\s|:-]+$/.test(lines[i+1]) && lines[i+1].includes('-')){
      const cells = (r)=> r.replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      const head = cells(l); i+=2; const rows=[];
      while(i<lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i])){ rows.push(cells(lines[i])); i++; }
      let t = '<div class="table-wrap"><table class="cardify"><thead><tr>'+head.map(h=>`<th>${inline(h)}</th>`).join('')+'</tr></thead><tbody>';
      for(const r of rows){ t+='<tr>'+r.map((c,ci)=>{ const sc=smartCell(c,head[ci]||''); return `<td data-label="${esc(head[ci]||'')}" class="${sc.cls}">${sc.html}</td>`; }).join('')+'</tr>'; }
      out.push(t+'</tbody></table></div>'); continue;
    }
    // lists (join wrapped continuation lines into the current item)
    const collectList = (re)=>{ const items=[];
      while(i<lines.length){
        if(re.test(lines[i])){ items.push(lines[i].replace(re,'')); i++; }
        else if(items.length && /^\s+\S/.test(lines[i])){ items[items.length-1]+=' '+lines[i].trim(); i++; }
        else break;
      } return items; };
    if (/^\s*[-*]\s+/.test(l)) { const items=collectList(/^\s*[-*]\s+/); out.push('<ul>'+items.map(t=>'<li>'+inline(t)+'</li>').join('')+'</ul>'); continue; }
    if (/^\s*\d+\.\s+/.test(l)) { const items=collectList(/^\s*\d+\.\s+/); out.push('<ol>'+items.map(t=>'<li>'+inline(t)+'</li>').join('')+'</ol>'); continue; }
    // paragraph
    let p=[]; while(i<lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|>|---+\s*$|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i]) && !(lines[i].includes('|')&&i+1<lines.length&&/^[\s|:-]+$/.test(lines[i+1]))){ p.push(lines[i]); i++; }
    out.push('<p>'+inline(p.join(' '))+'</p>');
  }
  return out.join('\n');
}

/* helpers to pull tables/sections as data */
function parseTables(src){
  const lines = src.replace(/\r/g,'').split('\n'); const tables=[]; let i=0;
  const cells=(r)=>r.replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
  while(i<lines.length){
    if(lines[i].includes('|') && i+1<lines.length && /^[\s|:-]+$/.test(lines[i+1]) && lines[i+1].includes('-')){
      const head=cells(lines[i]); i+=2; const rows=[];
      while(i<lines.length && lines[i].includes('|') && !/^\s*$/.test(lines[i])){ rows.push(cells(lines[i])); i++; }
      tables.push({head,rows});
    } else i++;
  }
  return tables;
}

/* ---------- layout ---------- */
const NAV = [
  ['index.html','Home'],['standings.html','Standings'],['rosters.html','2025 Rosters'],
  ['draft.html','2025 Draft'],['grades.html','Grades'],['trades.html','Trades'],
  ['outlook.html','2026'],['rules.html','Rules'],
];
function layout({title, active, body, hero=''}){
  const nav = NAV.map(([h,t])=>`<a href="${h}" class="${h===active?'on':''}">${t}</a>`).join('');
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta property="og:title" content="Plunk Cup '25 and Beyond">
<meta property="og:description" content="The Plunk Cup league hub — 2025 season graded (standings, rosters, draft, trades) plus keepers, pick ownership, and rules heading into 2026 and beyond.">
<meta name="theme-color" content="#0B1120">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏈</text></svg>">
<link rel="stylesheet" href="assets/styles.css"></head>
<body>
<header class="topbar">
  <a class="brand" href="index.html"><span>🏈</span> Plunk Cup <em>’25</em> <span class="brand-sub">and Beyond</span></a>
  <button class="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
  <nav class="mainnav">${nav}</nav>
</header>
<div class="navscrim"></div>
${hero}
<main class="wrap">${body}</main>
<footer class="foot">
  <p>Plunk Cup 2025 Season Analysis · generated from league records · <a href="https://github.com/zmailloux/plunk-cup">source</a></p>
</footer>
<script src="assets/app.js"></script>
</body></html>`;
}

/* ---------- data load ---------- */
const teamMap = parseTables(read('team-owner-map.md'))[0]; // Team | Owner | Final Place
const standings = teamMap.rows.map(r=>{
  const owner = r[1].trim().toLowerCase();
  const placeNum = parseInt(r[2],10);
  return { owner, team:r[0].trim(), place:r[2].trim(), placeNum, ...TEAMS[owner] };
}).sort((a,b)=>a.placeNum-b.placeNum);
const bySlug = Object.fromEntries(standings.map(s=>[s.owner,s]));

const OWNERS = Object.keys(TEAMS);
const drafts = {}; // owner -> [{rd,overall,player,pos,nfl}]
for(const o of OWNERS){
  const t = parseTables(read(`draft results/${o}.md`))[0];
  drafts[o] = t.rows.map(r=>({ rd:+r[0], overall:+r[1], player:r[2].trim(), pos:r[3].trim(), nfl:r[4].trim() }));
}

/* ---------- pages ---------- */
function medal(n){ return n===1?'🥇':n===2?'🥈':n===3?'🥉':''; }
function teamChip(s){ return `<span class="chip" style="--tc:${s.color}">${s.emoji} ${esc(s.team)}</span>`; }

// HOME
function pageHome(){
  const champ = standings[0];
  const hero = `<section class="hero">
    <div class="hero-in">
      <p class="eyebrow">The League Hub · '25 and Beyond</p>
      <h1 class="title">PLUNK<span>CUP</span></h1>
      <p class="sub">Home base for the league — the 2025 season in the books and graded, keepers &amp; pick ownership set, and the road to 2026 underway.</p>
      <div class="champ" style="--tc:${champ.color}">🏆 Champion — <b>${esc(cap(champ.owner))}</b></div>
    </div></section>`;
  const tiles = [
    ['🏆','Champion',`${cap(champ.owner)}`,'1st place'],
    ['🎯','Best Draft','Devin','A+ · +23 VOR'],
    ['💎','Biggest Steal','C. McCaffrey','R2 · +206 (Griffin)'],
    ['💀','Biggest Bust','Travis Hunter','R8 · −115 (Paul)'],
    ['🔁','Busiest Trader','Paul','most deals'],
    ['📈','Highest Roster','Griffin','4189.8 Fan Pts'],
  ].map(([e,k,v,s])=>`<div class="tile reveal"><div class="tile-e">${e}</div><div class="tile-k">${k}</div><div class="tile-v">${esc(v)}</div><div class="tile-s">${esc(s)}</div></div>`).join('');
  const podium = standings.slice(0,3).map(s=>`<a class="pod p${s.placeNum}" href="roster-${s.owner}.html" style="--tc:${s.color}">
     <div class="pod-m">${medal(s.placeNum)}</div><div class="pod-t">${s.emoji} ${esc(cap(s.owner))}</div><div class="pod-o">${esc(s.place)}</div></a>`).join('');
  const body = `
   <section class="stat-grid">${tiles}</section>
   <h2 class="sec">The Podium</h2>
   <div class="podium">${podium}</div>
   <h2 class="sec">Explore</h2>
   <div class="cards">
     ${[['standings.html','📊','Standings','Final places & grade-vs-finish'],
        ['rosters.html','📋','Rosters','Season-end squads + keepers'],
        ['draft.html','🎬','Draft Board','All 18 rounds, color-coded'],
        ['grades.html','🎓','Draft Grades','Round-par + VOR report cards'],
        ['trades.html','🔁','Trades','Six deals, reconciled'],
        ['outlook.html','🔮','2026 Outlook','Keepers & pick ownership'],
        ['rules.html','📖','Rules','Scoring, roster, house rules']
       ].map(([h,e,t,d])=>`<a class="card reveal" href="${h}"><div class="card-e">${e}</div><div class="card-t">${t}</div><div class="card-d">${d}</div></a>`).join('')}
   </div>`;
  return layout({title:'Plunk Cup 2025 Season Analysis', active:'index.html', hero, body});
}

// STANDINGS
function pageStandings(){
  const grades = { devin:'A+', griffin:'A−', jared:'B', lucas:'B−', padula:'C+', kervin:'C', paul:'C−', zach:'D' };
  const rows = standings.map(s=>`<a class="stand-row" href="roster-${s.owner}.html" style="--tc:${s.color}">
    <span class="rk">${s.placeNum}</span><span class="md">${medal(s.placeNum)}</span>
    <span class="tm">${s.emoji} <b>${esc(cap(s.owner))}</b></span>
    <span class="gr">${grades[s.owner]||''}<small>draft</small></span>
    <span class="go">›</span></a>`).join('');
  const body = `<h1 class="ph">Final Standings</h1>
    <p class="lede">Where everyone finished — and how their draft graded. Notably, the best draft board (Devin, A+) finished 4th, while below-par drafters (Paul, Lucas) rode trades to the podium. Draft ≠ trophy.</p>
    <div class="stand">${rows}</div>`;
  return layout({title:'Standings · Plunk Cup 2025', active:'standings.html', body});
}

// ROSTERS index + per-team
function pageRosters(){
  const cards = standings.map(s=>{
    const total = (read(`final roster/${s.owner}.md`).match(/Roster total Fan Pts[^:]*:\s*([\d.]+)/)||[])[1] || '';
    return `<a class="tcard reveal" href="roster-${s.owner}.html" style="--tc:${s.color}">
      <div class="tcard-top">${s.emoji}<span class="tcard-place">${medal(s.placeNum)} ${s.place}</span></div>
      <div class="tcard-name">${esc(cap(s.owner))}</div>
      <div class="tcard-pts">${total?`${total} <small>Fan Pts</small>`:''}</div></a>`;
  }).join('');
  return layout({title:'Rosters · Plunk Cup 2025', active:'rosters.html',
    body:`<h1 class="ph">2025 Rosters</h1><p class="lede">Season-end squads with Fan Pts, keeper eligibility and 2026 keeper cost. Tap an owner.</p><div class="tgrid">${cards}</div>`});
}
function pageTeam(s){
  const raw = read(`final roster/${s.owner}.md`);
  const body = `<a class="back" href="rosters.html">‹ All rosters</a>
    <div class="team-head" style="--tc:${s.color}"><span class="th-e">${s.emoji}</span>
      <div><h1>${esc(cap(s.owner))}</h1><p>${medal(s.placeNum)} ${esc(s.place)} in league</p></div></div>
    <div class="prose team-body">${md(raw.replace(/^#\s+.*\n/,''))}</div>
    <div class="team-links"><a class="btn" href="draft.html">Draft board ›</a><a class="btn" href="trades.html">Trades ›</a></div>`;
  return layout({title:`${cap(s.owner)} · Plunk Cup 2025`, active:'rosters.html', body});
}

// DRAFT board — columns in DRAFT ORDER (slot 1..8) so the snake is visible
function pageDraft(){
  // draft order = who held each slot in round 1 (by overall pick)
  const cols = OWNERS.map(o=>({ o, first: drafts[o].find(p=>p.rd===1).overall }))
    .sort((a,b)=>a.first-b.first).map(x=>bySlug[x.o]);
  const ov = (owner,rd)=> drafts[owner].find(p=>p.rd===rd).overall;
  // direction derived from the actual picks: forward if slot-1 picks before slot-8 this round
  const dirOf = (rd)=> ov(cols[0].owner,rd) < ov(cols[cols.length-1].owner,rd) ? 'fwd' : 'rev';

  // snake legend illustration (draft-slot order dots)
  const dots = cols.map((s,idx)=>`<span class="snake-dot" style="--tc:${s.color}" title="${esc(cap(s.owner))}">${idx+1}</span>`).join('<span class="snake-arm"></span>');
  const snake = `<div class="snake">
    <div class="snake-row"><span class="snake-lbl">Draft slot</span>${dots}</div>
    <p class="snake-cap"><b>Rounds 1–4</b> ran in <b>fixed order</b> (▶ slot 1→8). From <b>round 5</b> the draft <b>snakes</b> — direction flips each round (per the league's reset format). The ▶/◀ on every round below marks its true pick direction.</p>
  </div>`;

  let grid = '<div class="board-wrap"><table class="board"><thead><tr><th class="rndh">Rd</th>'+
    cols.map((s,i)=>`<th style="--tc:${s.color}" data-team="${s.owner}"><span class="th-slot">${i+1}</span>${s.emoji}<span>${esc(cap(s.owner))}</span></th>`).join('')+'</tr></thead><tbody>';
  for(let rd=1; rd<=18; rd++){
    const fwd = dirOf(rd)==='fwd';
    grid += `<tr class="${fwd?'fwd':'rev'}"><td class="rndh"><b>${rd}</b><span class="dir">${fwd?'▶':'◀'}</span></td>`;
    for(const s of cols){
      const pk = drafts[s.owner].find(p=>p.rd===rd);
      if(!pk){ grid+='<td></td>'; continue; }
      const badge = STEALS.includes(pk.player)?'<span class="tag steal">STEAL</span>':BUSTS.includes(pk.player)?'<span class="tag bust">BUST</span>':'';
      grid += `<td data-team="${s.owner}"><div class="cell" style="--pc:${POS_COLORS[pk.pos]||'#94A3B8'}">
        <span class="cnum">#${pk.overall}</span>
        <span class="cp">${esc(pk.player)}</span>
        <span class="cm">${posPill(pk.pos)}${badge}</span></div></td>`;
    }
    grid += '</tr>';
  }
  grid += '</tbody></table></div>';
  const filters = '<button class="fbtn on" data-f="all">Everyone</button>'+cols.map(s=>`<button class="fbtn" data-f="${s.owner}" style="--tc:${s.color}">${s.emoji} ${esc(cap(s.owner))}</button>`).join('');
  const body = `<h1 class="ph">2025 Draft Board</h1>
    <p class="lede">18-round snake draft. Cell color = position; <span class="tag steal">STEAL</span> / <span class="tag bust">BUST</span> flag the biggest value hits &amp; misses. Scroll sideways on mobile; tap a team to spotlight.</p>
    ${snake}
    <div class="filters">${filters}</div>${grid}`;
  return layout({title:'Draft Board · Plunk Cup 2025', active:'draft.html', body});
}

// GRADES
function pageGrades(){
  const a = md(read('reports/draft-grades-2025.md').replace(/^#\s+.*\n/,''));
  const b = md(read('reports/draft-grades-2025-positional.md').replace(/^#\s+.*\n/,''));
  const body = `<h1 class="ph">Draft Report Cards</h1>
    <p class="lede">Two lenses. <b>Round-par</b> compares each pick to its round average. <b>VOR</b> (value-over-replacement) adjusts for the league's real slot demand — 2 QB, 3 flex, TE scarcity — and is the more defensible number.</p>
    <div class="tabs"><button class="tab on" data-tab="vor">VOR (position-adjusted)</button><button class="tab" data-tab="par">Round-par</button></div>
    <section class="tabpane on" id="tab-vor"><div class="prose">${b}</div></section>
    <section class="tabpane" id="tab-par"><div class="prose">${a}</div></section>`;
  return layout({title:'Draft Grades · Plunk Cup 2025', active:'grades.html', body});
}

// TRADES — structured gives/gets cards (data hand-encoded from trades/2025-season-trades.md)
const P = (name,pos)=>({name,pos});           // player asset
const K = (round)=>({pick:round});             // 2026 pick asset
const TRADES = [
  { n:1, type:'yahoo', date:'≈ Nov 2025',
    a:{o:'paul', gets:[P('Josh Downs','WR'), K('2026 R5')]},
    b:{o:'devin', gets:[P('Jalen Hurts','QB'), K('2026 R18')]},
    note:'Confirmed via final rosters — each manager drafted the player he gave up. Pick bundling assumed.' },
  { n:2, type:'yahoo', date:'≈ Oct 2025',
    a:{o:'paul', gets:[P('Travis Hunter','WR'), K('2026 R12')]},
    b:{o:'lucas', gets:[P('Courtland Sutton','WR'), K('2026 R7')]},
    note:'Confirmed via final rosters. Pick bundling assumed.' },
  { n:3, type:'yahoo', date:'≈ Oct 2025',
    a:{o:'kervin', gets:[P("De'Von Achane",'RB'), P('Jordan Love','QB'), K('2026 R7'), K('2026 R15')]},
    b:{o:'zach', gets:[P('Nick Chubb','RB'), P('Caleb Williams','QB'), K('2026 R4'), K('2026 R9')]},
    note:'Zach drafted both Achane (#24) and Love (#104), so he gave them up. Kervin ended with Achane; Zach with Caleb Williams.' },
  { n:4, type:'yahoo', date:'≈ Sep 2025',
    a:{o:'paul', gets:[P('J.K. Dobbins','RB'), K('2026 R16')]},
    b:{o:'padula', gets:[P('Tetairoa McMillan','WR'), K('2026 R10')]},
    note:'Padula drafted Dobbins (#114), Paul drafted McMillan (#52); Padula ended with McMillan. Pick bundling assumed.' },
  { n:5, type:'manual', date:'≈ Sep–Oct 2025',
    a:{o:'zach', gets:[P('Elic Ayomanor','WR'), K("Jared's 2026 R4")]},
    b:{o:'jared', gets:[P('Drake London','WR'), K("Zach's 2026 R17")]},
    note:'One deal: the London ⇄ Ayomanor player swap and the R4 ⇄ R17 pick swap were a single trade, per Zach. Confirmed via final rosters.' },
  { n:6, type:'manual', date:'≈ Sep 2025',
    a:{o:'lucas', gets:[P('Courtland Sutton','WR'), P('Terry McLaurin','WR'), P('Travis Etienne Jr.','RB'), P('Matthew Golden','WR')]},
    b:{o:'jared', gets:[P('Davante Adams','WR'), P('Marvin Harrison Jr.','WR'), P('Jaylen Warren','RB'), P('Elic Ayomanor','WR')]},
    note:'4-for-4 retool executed as add/drops. Confirmed via draft origin — each gave up players he drafted/held. Helped Lucas reach 2nd.' },
];
function assetChip(x){
  if(x.pick) return `<span class="asset pick">🗂️ ${esc(x.pick)}</span>`;
  return `<span class="asset">${posPill(x.pos)} ${esc(x.name)}</span>`;
}
function tradeSide(side){
  const s = bySlug[side.o];
  return `<div class="tside" style="--tc:${s.color}">
    <div class="tside-team"><span class="chip" style="--tc:${s.color}">${s.emoji} ${esc(cap(s.owner))}</span></div>
    <div class="tside-gets"><span class="gets-lbl">gets</span>${side.gets.map(assetChip).join('')}</div>
  </div>`;
}
function pageTrades(){
  const raw = read('trades/2025-season-trades.md');
  const header = raw.split(/\n## /)[0].replace(/^#\s+.*\n/,'');
  const cards = TRADES.map(t=>`<div class="trade-card reveal ${t.type}">
    <div class="trade-top">
      <span class="trade-badge">${t.type==='manual'?'MANUAL':'YAHOO'}</span>
      <span class="trade-n">Trade ${t.n}</span>
      <span class="trade-date">${esc(t.date)}</span>
    </div>
    <div class="trade-swap">
      ${tradeSide(t.a)}
      <div class="swap-mark">⇄</div>
      ${tradeSide(t.b)}
    </div>
    <p class="trade-note">${inline(t.note)}</p>
  </div>`).join('');
  const body = `<h1 class="ph">Trades</h1>
    <p class="lede">Six deals across the 2025 season. Each card shows what each side <b>received</b>. Full reconciliation notes live in the <a href="https://github.com/zmailloux/plunk-cup/blob/main/trades/2025-season-trades.md">records</a>.</p>
    <details class="callout"><summary>⚠ Data-quality note</summary>${md(header)}</details>
    <div class="timeline">${cards}</div>`;
  return layout({title:'Trades · Plunk Cup 2025', active:'trades.html', body});
}

// compact 2026 pick-ownership grid (rounds × owners), built from the ledger
function pickGrid(){
  const led = parseTables(read('draft-picks.md')).find(t=>/original owner/i.test(t.head.join(' ')));
  const holder = {}; standings.forEach(s=>{ holder[s.owner]=Array(19).fill(s.owner); });
  if(led) led.rows.forEach(r=>{
    const rd=parseInt(r[0],10);
    const from=(r[1].match(/[A-Za-z]+/)||[''])[0].toLowerCase();
    const to=(r[2].match(/[A-Za-z]+/)||[''])[0].toLowerCase();
    if(rd && holder[from] && bySlug[to]) holder[from][rd]=to;
  });
  const cols = standings;
  let h='<div class="board-wrap"><table class="pickgrid"><thead><tr><th class="rndh">Rd</th>'+
    cols.map(s=>`<th style="--tc:${s.color}" title="${esc(cap(s.owner))}">${s.emoji}<span>${esc(cap(s.owner))}</span></th>`).join('')+'</tr></thead><tbody>';
  for(let rd=1; rd<=18; rd++){
    h+=`<tr><td class="rndh">${rd}</td>`;
    for(const s of cols){
      const ho=holder[s.owner][rd], traded=ho!==s.owner, hs=bySlug[ho];
      h+=`<td class="${traded?'traded':'own'}" style="--tc:${hs.color}" title="R${rd} — ${cap(s.owner)}'s pick ${traded?'→ '+cap(hs.owner):'(kept)'}">${traded?hs.emoji:'·'}</td>`;
    }
    h+='</tr>';
  }
  return h+'</tbody></table></div>';
}

// 2026 OUTLOOK — keeper table derived from rosters, QBs excluded
function pageOutlook(){
  const krows = standings.map(s=>{
    const players = [].concat(...parseTables(read(`final roster/${s.owner}.md`)).map(t=>t.rows))
      .map(r=>({ name:r[0], pos:(r[1]||'').trim(), pts:parseFloat(r[3])||0, elig:/^\s*yes/i.test(r[4]||''), eligText:(r[4]||''), cost:(r[5]||'').trim() }));
    const skill = players.filter(p=>p.elig && ['RB','WR','TE'].includes(p.pos)).sort((a,b)=>b.pts-a.pts)[0];
    const locked = players.filter(p=>/^\s*no/i.test(p.eligText)).sort((a,b)=>b.pts-a.pts)[0];
    const lk = locked ? `${esc(locked.name)} <span class="dim">(${esc((locked.eligText.match(/R\d+/)||['R?'])[0])})</span>` : '<span class="dim">—</span>';
    return `<tr>
      <td data-label="Owner" class="c-pos"><span class="chip" style="--tc:${s.color}">${s.emoji} ${esc(cap(s.owner))}</span></td>
      <td data-label="Best keeper (non-QB)">${skill?`<b>${esc(skill.name)}</b> ${posPill(skill.pos)}`:'<span class="dim">—</span>'}</td>
      <td data-label="2026 Cost">${skill?`<span class="badge cost">${esc(skill.cost)}</span>`:''}</td>
      <td data-label="Pts" class="c-num">${skill?`<b>${skill.pts.toFixed(1)}</b>`:''}</td>
      <td data-label="Locked out (R1–4)">${lk}</td></tr>`;
  }).join('');
  const picks = md(read('draft-picks.md').replace(/^#\s+.*\n/,''));
  const body = `<h1 class="ph">2026 Outlook</h1>
    <h2 class="sec">🔒 Keeper Watch</h2>
    <p class="lede">Keepers must have been drafted <b>round 5+</b> (or be undrafted = R7 cost). <b>QBs excluded</b> here — in a 2-QB league everyone hoards a cheap QB, so the interesting question is the best <b>skill-position</b> (RB/WR/TE) keeper. Cost = drafted round − 1 for 2026 (pending commish confirmation).</p>
    <div class="table-wrap"><table class="cardify"><thead><tr><th>Owner</th><th>Best keeper (non-QB)</th><th>2026 Cost</th><th>Pts</th><th>Locked out (R1–4)</th></tr></thead><tbody>${krows}</tbody></table></div>
    <h2 class="sec">🗂️ 2026 Draft Pick Ownership</h2>
    <p class="lede">Each column is an owner's original pick each round. <b>·</b> = they kept it; a tinted emoji means that round's pick was <b>traded</b> — the emoji shows who holds it now.</p>
    ${pickGrid()}
    <details class="callout"><summary>Full ledger &amp; per-team holdings</summary><div class="prose">${picks}</div></details>`;
  return layout({title:'2026 Outlook · Plunk Cup 2025', active:'outlook.html', body});
}

// RULES
function pageRules(){
  const scoring = md(read('scoring rules/scoring.md').replace(/^#\s+.*\n/,''));
  const setup   = md(read('roster setup/setup.md').replace(/^#\s+.*\n/,''));
  const house   = md(read('rules/league-rules-2026.md').replace(/^#\s+.*\n/,''));
  const ideas   = md(read('rules/proposed-changes-2026.md').replace(/^#\s+.*\n/,''));
  const body = `<h1 class="ph">Rules</h1>
    <div class="tabs"><button class="tab on" data-tab="house">2026 House Rules</button><button class="tab" data-tab="scoring">Scoring</button><button class="tab" data-tab="setup">Roster & Settings</button><button class="tab" data-tab="ideas">💡 AI Suggestions</button></div>
    <section class="tabpane on" id="tab-house"><div class="prose">${house}</div></section>
    <section class="tabpane" id="tab-scoring"><div class="prose">${scoring}</div></section>
    <section class="tabpane" id="tab-setup"><div class="prose">${setup}</div></section>
    <section class="tabpane" id="tab-ideas"><div class="prose">${ideas}</div></section>`;
  return layout({title:'Rules · Plunk Cup 2025', active:'rules.html', body});
}

/* util */
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function shortTeam(t){ return t.length>12 ? t.split(' ')[0] : t; }

/* ---------- write ---------- */
function write(name, html){ fs.writeFileSync(path.join(OUT,name), html); }
fs.mkdirSync(OUT, { recursive:true });
fs.mkdirSync(path.join(OUT,'assets'), { recursive:true });
fs.copyFileSync(path.join(__dirname,'assets','styles.css'), path.join(OUT,'assets','styles.css'));
fs.copyFileSync(path.join(__dirname,'assets','app.js'), path.join(OUT,'assets','app.js'));
fs.writeFileSync(path.join(OUT,'.nojekyll'),''); // serve _-prefixed etc. verbatim

write('index.html', pageHome());
write('standings.html', pageStandings());
write('rosters.html', pageRosters());
for(const s of standings) write(`roster-${s.owner}.html`, pageTeam(s));
write('draft.html', pageDraft());
write('grades.html', pageGrades());
write('trades.html', pageTrades());
write('outlook.html', pageOutlook());
write('rules.html', pageRules());

console.log('Built '+ (7 + standings.length) +' pages into /docs');
