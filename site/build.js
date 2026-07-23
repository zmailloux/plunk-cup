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
    // lists
    if (/^\s*[-*]\s+/.test(l)) { let b=[]; while(i<lines.length && /^\s*[-*]\s+/.test(lines[i])){ b.push('<li>'+inline(lines[i].replace(/^\s*[-*]\s+/,''))+'</li>'); i++; } out.push('<ul>'+b.join('')+'</ul>'); continue; }
    if (/^\s*\d+\.\s+/.test(l)) { let b=[]; while(i<lines.length && /^\s*\d+\.\s+/.test(lines[i])){ b.push('<li>'+inline(lines[i].replace(/^\s*\d+\.\s+/,''))+'</li>'); i++; } out.push('<ol>'+b.join('')+'</ol>'); continue; }
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
  ['index.html','Home'],['standings.html','Standings'],['rosters.html','Rosters'],
  ['draft.html','Draft'],['grades.html','Grades'],['trades.html','Trades'],
  ['outlook.html','2026'],['rules.html','Rules'],
];
function layout({title, active, body, hero=''}){
  const nav = NAV.map(([h,t])=>`<a href="${h}" class="${h===active?'on':''}">${t}</a>`).join('');
  return `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta property="og:title" content="Plunk Cup 2025 Season Analysis">
<meta property="og:description" content="Standings, rosters, draft grades, trades & keepers for the Plunk Cup fantasy league.">
<meta name="theme-color" content="#0B1120">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏈</text></svg>">
<link rel="stylesheet" href="assets/styles.css"></head>
<body>
<header class="topbar">
  <a class="brand" href="index.html"><span>🏈</span> Plunk Cup <em>’25</em></a>
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
      <p class="eyebrow">2025 Season Analysis</p>
      <h1 class="title">PLUNK<span>CUP</span></h1>
      <p class="sub">Eight managers. One trophy. A full season, graded.</p>
      <div class="champ" style="--tc:${champ.color}">🏆 Champion — <b>${esc(champ.team)}</b> <span>(${esc(cap(champ.owner))})</span></div>
    </div></section>`;
  const tiles = [
    ['🏆','Champion',`${champ.team}`,`${cap(champ.owner)}`],
    ['🎯','Best Draft','Rocket Lab','Devin · A+ (+23 VOR)'],
    ['💎','Biggest Steal','C. McCaffrey','R2 · +206 vs par'],
    ['💀','Biggest Bust','Travis Hunter','R8 · −115 vs par'],
    ['🔁','Busiest Trader','Ball Spetrini','Paul · most deals'],
    ['📈','Highest Roster','Shabo','4189.8 Fan Pts'],
  ].map(([e,k,v,s])=>`<div class="tile reveal"><div class="tile-e">${e}</div><div class="tile-k">${k}</div><div class="tile-v">${esc(v)}</div><div class="tile-s">${esc(s)}</div></div>`).join('');
  const podium = standings.slice(0,3).map(s=>`<a class="pod p${s.placeNum}" href="roster-${s.owner}.html" style="--tc:${s.color}">
     <div class="pod-m">${medal(s.placeNum)}</div><div class="pod-t">${s.emoji} ${esc(s.team)}</div><div class="pod-o">${esc(cap(s.owner))}</div></a>`).join('');
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
        ['trades.html','🔁','Trades','Seven deals, reconciled'],
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
    <span class="tm">${s.emoji} <b>${esc(s.team)}</b><em>${esc(cap(s.owner))}</em></span>
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
      <div class="tcard-name">${esc(s.team)}</div><div class="tcard-owner">${esc(cap(s.owner))}</div>
      <div class="tcard-pts">${total?`${total} <small>Fan Pts</small>`:''}</div></a>`;
  }).join('');
  return layout({title:'Rosters · Plunk Cup 2025', active:'rosters.html',
    body:`<h1 class="ph">Rosters</h1><p class="lede">Season-end squads with Fan Pts, keeper eligibility and 2026 keeper cost. Tap a team.</p><div class="tgrid">${cards}</div>`});
}
function pageTeam(s){
  const raw = read(`final roster/${s.owner}.md`);
  const body = `<a class="back" href="rosters.html">‹ All rosters</a>
    <div class="team-head" style="--tc:${s.color}"><span class="th-e">${s.emoji}</span>
      <div><h1>${esc(s.team)}</h1><p>${esc(cap(s.owner))} · ${medal(s.placeNum)} ${esc(s.place)}</p></div></div>
    <div class="prose team-body">${md(raw.replace(/^#\s+.*\n/,''))}</div>
    <div class="team-links"><a class="btn" href="draft.html">Draft board ›</a><a class="btn" href="trades.html">Trades ›</a></div>`;
  return layout({title:`${s.team} · Plunk Cup 2025`, active:'rosters.html', body});
}

// DRAFT board
function pageDraft(){
  const cols = standings; // order by finish
  let grid = '<div class="board-wrap"><table class="board"><thead><tr><th class="rndh">Rd</th>'+
    cols.map(s=>`<th style="--tc:${s.color}" data-team="${s.owner}">${s.emoji}<span>${esc(shortTeam(s.team))}</span></th>`).join('')+'</tr></thead><tbody>';
  for(let rd=1; rd<=18; rd++){
    grid += `<tr><td class="rndh">${rd}</td>`;
    for(const s of cols){
      const pk = drafts[s.owner].find(p=>p.rd===rd);
      if(!pk){ grid+='<td></td>'; continue; }
      const badge = STEALS.includes(pk.player)?'<span class="tag steal">STEAL</span>':BUSTS.includes(pk.player)?'<span class="tag bust">BUST</span>':'';
      grid += `<td data-team="${s.owner}"><div class="cell" style="--pc:${POS_COLORS[pk.pos]||'#94A3B8'}">
        <span class="cp">${esc(pk.player)}</span><span class="cm">${posPill(pk.pos)} <i>#${pk.overall}</i></span>${badge}</div></td>`;
    }
    grid += '</tr>';
  }
  grid += '</tbody></table></div>';
  const filters = '<button class="fbtn on" data-f="all">All teams</button>'+cols.map(s=>`<button class="fbtn" data-f="${s.owner}" style="--tc:${s.color}">${s.emoji} ${esc(shortTeam(s.team))}</button>`).join('');
  const body = `<h1 class="ph">2025 Draft Board</h1>
    <p class="lede">18 rounds, snake order. Color = position. <span class="tag steal">STEAL</span> / <span class="tag bust">BUST</span> flag the biggest value hits & misses. Scroll sideways on mobile; tap a team to spotlight.</p>
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

// TRADES
function pageTrades(){
  const raw = read('trades/2025-season-trades.md');
  const parts = raw.split(/\n## /).slice(1); // first chunk is header
  const header = raw.split(/\n## /)[0].replace(/^#\s+.*\n/,'');
  const cards = parts.map(chunk=>{
    const titleLine = chunk.split('\n')[0];
    const rest = chunk.split('\n').slice(1).join('\n');
    const manual = /MANUAL/i.test(titleLine);
    return `<div class="trade-card reveal ${manual?'manual':'yahoo'}">
      <div class="trade-h"><span class="trade-badge">${manual?'MANUAL':'YAHOO'}</span><h3>${inline(titleLine.replace(/\s*\(MANUAL[^)]*\)/i,''))}</h3></div>
      <div class="prose">${md(rest)}</div></div>`;
  }).join('');
  const body = `<h1 class="ph">Trades</h1>
    <div class="callout">${md(header)}</div>
    <div class="timeline">${cards}</div>`;
  return layout({title:'Trades · Plunk Cup 2025', active:'trades.html', body});
}

// 2026 OUTLOOK
function pageOutlook(){
  const keepers = [
    ['griffin','Matthew Stafford','QB','R7 (UDFA)','334.9','McCaffrey (R2)'],
    ['lucas','Trevor Lawrence','QB','R7 (UDFA)','315.7','Bijan (R1)'],
    ['paul','Trey McBride','TE','R4','315.9','J. Taylor (R3)'],
    ['zach','Caleb Williams','QB','R7 (UDFA)','298.7','— sold his R1–R4'],
    ['padula','James Cook III','RB','R4','299.2','— top scorer, keepable'],
    ['devin','Bo Nix','QB','R8','291.8','Gibbs (R1)'],
    ['jared','Drake Maye','QB','R8','323.5','ARSB (R1)'],
    ['kervin','Jordan Love','QB','R12','219.6','JSN (R4)'],
  ];
  const krows = keepers.map(([o,pl,pos,cost,pts,lock])=>{ const s=bySlug[o];
    return `<tr><td data-label="Team" class="c-pos"><span class="chip" style="--tc:${s.color}">${s.emoji} ${esc(s.team)}</span></td>
      <td data-label="Best Keeper"><b>${esc(pl)}</b> ${posPill(pos)}</td>
      <td data-label="2026 Cost"><span class="badge cost">${esc(cost)}</span></td>
      <td data-label="Pts" class="c-num"><b>${pts}</b></td>
      <td data-label="Locked out"><span class="dim">${esc(lock)}</span></td></tr>`;
  }).join('');
  const picks = md(read('draft-picks.md').replace(/^#\s+.*\n/,''));
  const body = `<h1 class="ph">2026 Outlook</h1>
    <h2 class="sec">🔒 Keeper Watch</h2>
    <p class="lede">Keepers must have been drafted <b>round 5+</b> (or be undrafted = R7 cost). Almost every team's best player is locked out at R1–R4. Cost interpretation: drafted round − 1 for 2026 (pending commish confirmation).</p>
    <div class="table-wrap"><table class="cardify"><thead><tr><th>Team</th><th>Best Keeper</th><th>2026 Cost</th><th>Pts</th><th>Locked out (can't keep)</th></tr></thead><tbody>${krows}</tbody></table></div>
    <h2 class="sec">🗂️ 2026 Draft Pick Ownership</h2>
    <div class="prose">${picks}</div>`;
  return layout({title:'2026 Outlook · Plunk Cup 2025', active:'outlook.html', body});
}

// RULES
function pageRules(){
  const scoring = md(read('scoring rules/scoring.md').replace(/^#\s+.*\n/,''));
  const setup   = md(read('roster setup/setup.md').replace(/^#\s+.*\n/,''));
  const house   = md(read('rules/league-rules-2026.md').replace(/^#\s+.*\n/,''));
  const body = `<h1 class="ph">Rules</h1>
    <div class="tabs"><button class="tab on" data-tab="scoring">Scoring</button><button class="tab" data-tab="setup">Roster & Settings</button><button class="tab" data-tab="house">2026 House Rules</button></div>
    <section class="tabpane on" id="tab-scoring"><div class="prose">${scoring}</div></section>
    <section class="tabpane" id="tab-setup"><div class="prose">${setup}</div></section>
    <section class="tabpane" id="tab-house"><div class="prose">${house}</div></section>`;
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
