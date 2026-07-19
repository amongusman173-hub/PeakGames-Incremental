const MAGIC_SPELLS = [
  { id: 'spark',          name: 'Spark',            icon: '⚡', desc: 'A basic lightning bolt.',                   cost: 100,  levelReq: 2,  effect: 'damage', multiplier: 1.2,  bonus: { atk: 3 },              rarity: 'common',    studyTime: 30  },
  { id: 'frost_bolt',     name: 'Frost Bolt',        icon: '❄️', desc: 'Slows the enemy with ice.',                cost: 150,  levelReq: 4,  effect: 'stun',   multiplier: 1.0,  bonus: { spd: 4 },              rarity: 'common',    studyTime: 40  },
  { id: 'wind_slash',     name: 'Wind Slash',        icon: '🌬️', desc: 'A razor-sharp gust. Fast and light.',      cost: 120,  levelReq: 3,  effect: 'damage', multiplier: 1.1,  bonus: { spd: 5 },              rarity: 'common',    studyTime: 35  },
  { id: 'stone_spike',    name: 'Stone Spike',       icon: '🪨', desc: 'Summon a spike from the earth.',           cost: 130,  levelReq: 5,  effect: 'damage', multiplier: 1.4,  bonus: { def: 4 },              rarity: 'common',    studyTime: 40  },
  { id: 'flame_burst',    name: 'Flame Burst',       icon: '🔥', desc: 'A burst of fire. Burns for 2 turns.',      cost: 200,  levelReq: 6,  effect: 'damage', multiplier: 1.6,  bonus: { atk: 6 },              rarity: 'uncommon',  studyTime: 60  },
  { id: 'arcane_bolt',    name: 'Arcane Bolt',       icon: '🔮', desc: 'Pure magical energy. Ignores DEF.',        cost: 300,  levelReq: 10, effect: 'damage', multiplier: 2.0,  bonus: { atk: 8 },              rarity: 'uncommon',  studyTime: 80  },
  { id: 'mana_shield',    name: 'Mana Shield',       icon: '🛡️', desc: 'Conjure a shield. Heals 25% HP.',          cost: 350,  levelReq: 12, effect: 'heal',   healPct: 0.25,    bonus: { def: 8 },              rarity: 'uncommon',  studyTime: 80  },
  { id: 'poison_cloud',   name: 'Poison Cloud',      icon: '☠️', desc: 'Toxic mist. Poisons for 3 turns.',         cost: 280,  levelReq: 8,  effect: 'stun',   multiplier: 0.8,  bonus: { atk: 5, spd: 3 },      rarity: 'uncommon',  studyTime: 70  },
  { id: 'ice_lance',      name: 'Ice Lance',         icon: '🧊', desc: 'A piercing lance of ice. 3-hit.',          cost: 320,  levelReq: 14, effect: 'multi',  multiplier: 0.7,  hits: 3, bonus: { atk: 7 },      rarity: 'uncommon',  studyTime: 90  },
  { id: 'thunder_clap',   name: 'Thunder Clap',      icon: '⚡', desc: 'Shockwave stuns and deals damage.',        cost: 400,  levelReq: 16, effect: 'stun',   multiplier: 1.4,  bonus: { atk: 8, spd: 4 },      rarity: 'uncommon',  studyTime: 100 },
  { id: 'chain_lightning',name: 'Chain Lightning',   icon: '🌩️', desc: 'Lightning that hits 4 times.',            cost: 500,  levelReq: 18, effect: 'multi',  multiplier: 0.65, hits: 4, bonus: { atk: 10, spd: 5 }, rarity: 'rare',    studyTime: 120 },
  { id: 'blizzard',       name: 'Blizzard',          icon: '🌨️', desc: 'Frozen storm. 5-hit ice barrage.',         cost: 600,  levelReq: 22, effect: 'multi',  multiplier: 0.6,  hits: 5, bonus: { def: 10, spd: 8 }, rarity: 'rare',    studyTime: 140 },
  { id: 'inferno',        name: 'Inferno',           icon: '🌋', desc: 'Volcanic eruption. Massive fire damage.',  cost: 700,  levelReq: 25, effect: 'damage', multiplier: 2.8,  bonus: { atk: 15 },             rarity: 'rare',      studyTime: 150 },
  { id: 'gravity_well',   name: 'Gravity Well',      icon: '🌀', desc: 'Crush the enemy with gravity. Stuns.',     cost: 750,  levelReq: 30, effect: 'stun',   multiplier: 2.0,  bonus: { atk: 12, def: 8 },     rarity: 'rare',      studyTime: 160 },
  { id: 'meteor',         name: 'Meteor Strike',     icon: '☄️', desc: 'Call down a meteor. Massive damage.',      cost: 800,  levelReq: 28, effect: 'damage', multiplier: 3.2,  bonus: { atk: 18 },             rarity: 'rare',      studyTime: 160 },
  { id: 'soul_drain',     name: 'Soul Drain',        icon: '💀', desc: 'Drain life force. Heals you for 30%.',     cost: 900,  levelReq: 32, effect: 'heal',   healPct: 0.3,     bonus: { atk: 14, def: 6 },     rarity: 'rare',      studyTime: 170 },
  { id: 'time_stop',      name: 'Time Stop',         icon: '⏰', desc: 'Freeze time. Stuns for 3 turns.',          cost: 1200, levelReq: 38, effect: 'stun',   multiplier: 1.5,  bonus: { spd: 12, atk: 12 },    rarity: 'legendary', studyTime: 200 },
  { id: 'void_blast',     name: 'Void Blast',        icon: '🌀', desc: 'Tear reality. 6× ATK damage.',             cost: 2000, levelReq: 45, effect: 'damage', multiplier: 6.0,  bonus: { atk: 25, critChance: 0.2 }, rarity: 'legendary', studyTime: 240 },
  { id: 'star_fall',      name: 'Star Fall',         icon: '🌟', desc: 'Rain of stars. 8-hit celestial barrage.',  cost: 2500, levelReq: 50, effect: 'multi',  multiplier: 0.8,  hits: 8, bonus: { atk: 20, spd: 15 }, rarity: 'legendary', studyTime: 280 },
  { id: 'divine_wrath',   name: 'Divine Wrath',      icon: '⚡', desc: 'Godly lightning. 10× ATK. Stuns.',         cost: 3500, levelReq: 60, effect: 'stun',   multiplier: 10.0, bonus: { atk: 40, critChance: 0.3 }, rarity: 'legendary', studyTime: 320 },
];

const LIB_RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, legendary: 3 };
const LIB_RARITY_COLORS = { common: '#9e9e9e', uncommon: '#4caf50', rare: '#2196f3', legendary: '#ff9800' };
const LIB_STAT_LABELS = { atk: 'ATK', def: 'DEF', spd: 'SPD', critChance: 'CRT' };

let _libFilter = 'all';
let _libSort = 'rarity';

function _libStyleInjected() { return document.getElementById('lib-rework-style') !== null; }

function _injectLibStyle() {
  if (_libStyleInjected()) return;
  const s = document.createElement('style');
  s.id = 'lib-rework-style';
  s.textContent = `
#library-container .lib-header{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:16px 20px;margin-bottom:16px;display:flex;flex-direction:column;gap:10px}
#library-container .lib-header.empty{opacity:.5}
#library-container .lib-header .study-title{font-size:14px;font-weight:600}
#library-container .lib-header .study-title .s-icon{font-size:18px;margin-right:6px}
#library-container .lib-header .study-bar-wrap{display:flex;align-items:center;gap:10px}
#library-container .lib-header .study-bar-track{flex:1;height:14px;background:rgba(255,255,255,.08);border-radius:7px;overflow:hidden}
#library-container .lib-header .study-bar-fill{height:100%;background:linear-gradient(90deg,#ff9800,#ffc107);border-radius:7px;transition:width .3s ease}
#library-container .lib-header .study-pct{font-size:12px;color:var(--dim);min-width:40px;text-align:right}
#library-container .lib-header .study-meta{font-size:12px;color:var(--dim);display:flex;justify-content:space-between;align-items:center}
#library-container .lib-header .stop-btn{background:#c62828;color:#fff;border:none;border-radius:6px;padding:5px 14px;font-size:12px;cursor:pointer;font-weight:600}
#library-container .lib-header .stop-btn:hover{background:#e53935}
#library-container .lib-controls{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;align-items:center}
#library-container .lib-pills{display:flex;gap:4px;flex-wrap:wrap}
#library-container .lib-pill{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:5px 14px;font-size:12px;color:var(--dim);cursor:pointer;transition:all .15s}
#library-container .lib-pill:hover{background:rgba(255,255,255,.1);color:#fff}
#library-container .lib-pill.active{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);color:#fff}
#library-container .lib-sort{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dim)}
#library-container .lib-sort select{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:6px;padding:5px 8px;color:#fff;font-size:12px;cursor:pointer}
#library-container .lib-sort select option{background:#1e1e2e;color:#fff}
#library-container .lib-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
#library-container .lib-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:20px 16px 16px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:8px;position:relative;transition:transform .15s,border-color .15s,border-left-color .3s;border-left:4px solid transparent}
#library-container .lib-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.15)}
#library-container .lib-card.r-common{border-left-color:#9e9e9e}
#library-container .lib-card.r-uncommon{border-left-color:#4caf50}
#library-container .lib-card.r-rare{border-left-color:#2196f3}
#library-container .lib-card.r-legendary{border-left-color:#ff9800}
#library-container .lib-card.is-owned{border-left-color:#4caf50;background:rgba(76,175,80,.06)}
#library-container .lib-card.is-studying{border-color:rgba(255,152,0,.4);box-shadow:0 0 16px rgba(255,152,0,.08)}
#library-container .lib-card.is-locked{opacity:.45}
#library-container .lib-card .card-icon{font-size:36px;line-height:1}
#library-container .lib-card .card-name{font-size:15px;font-weight:700}
#library-container .lib-card .card-rarity{font-size:10px;text-transform:uppercase;letter-spacing:1px;font-weight:600}
#library-container .lib-card .r-common{color:#9e9e9e}
#library-container .lib-card .r-uncommon{color:#4caf50}
#library-container .lib-card .r-rare{color:#2196f3}
#library-container .lib-card .r-legendary{color:#ff9800}
#library-container .lib-card .card-desc{font-size:12px;color:var(--dim);line-height:1.4;min-height:32px}
#library-container .lib-card .card-meta{display:flex;gap:12px;font-size:11px;color:var(--dim);flex-wrap:wrap;justify-content:center}
#library-container .lib-card .card-meta span{white-space:nowrap}
#library-container .lib-card .card-bonus{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;font-size:11px}
#library-container .lib-card .card-bonus .bonus-tag{background:rgba(255,255,255,.07);border-radius:4px;padding:2px 7px;color:#b0bec5;font-weight:600}
#library-container .lib-card .card-progress{width:100%;display:flex;flex-direction:column;gap:4px}
#library-container .lib-card .card-progress .cp-bar-track{width:100%;height:8px;background:rgba(255,255,255,.08);border-radius:4px;overflow:hidden}
#library-container .lib-card .card-progress .cp-bar-fill{height:100%;background:linear-gradient(90deg,#ff9800,#ffc107);border-radius:4px;transition:width .3s ease}
#library-container .lib-card .card-progress .cp-label{font-size:11px;color:var(--dim);text-align:center}
#library-container .lib-card .card-owned-badge{position:absolute;top:10px;right:10px;background:#2e7d32;color:#fff;border-radius:10px;padding:2px 8px;font-size:10px;font-weight:700;display:flex;align-items:center;gap:3px}
#library-container .lib-card .card-study-badge{position:absolute;top:10px;right:10px;background:#e65100;color:#fff;border-radius:10px;padding:2px 8px;font-size:10px;font-weight:700;display:flex;align-items:center;gap:3px}
#library-container .lib-card .btn-study{background:linear-gradient(135deg,#ff9800,#e65100);color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:12px;font-weight:700;cursor:pointer;margin-top:auto;width:100%;transition:opacity .15s}
#library-container .lib-card .btn-study:hover{opacity:.85}
#library-container .lib-card .btn-study:disabled{opacity:.35;cursor:not-allowed}
#library-container .lib-card .btn-stop{background:#c62828}
#library-container .lib-card .btn-stop:hover{background:#e53935}
#library-container .lib-card .card-locked-label{font-size:12px;color:var(--dim);margin-top:auto}
@media(max-width:900px){#library-container .lib-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){#library-container .lib-grid{grid-template-columns:1fr}}
`;
  document.head.appendChild(s);
}

function getStudyProgress(spellId) {
  return (G.player.libraryStudy && G.player.libraryStudy[spellId]) || 0;
}

function startStudying(spellId) {
  const spell = MAGIC_SPELLS.find(s => s.id === spellId);
  if (!spell) return;
  const p = G.player;
  if (p.level < spell.levelReq) { toast(`Requires level ${spell.levelReq}`, 'warn'); return; }
  if (p.techniques.includes(spellId)) { toast('Already learned!', 'warn'); return; }
  if (!spendGold(spell.cost)) { toast('Not enough gold!', 'warn'); return; }

  if (!p.libraryStudy) p.libraryStudy = {};
  p.libraryStudy[spellId] = (p.libraryStudy[spellId] || 0);
  G.activeStudy = spellId;
  G.studyTick = 0;
  toast(`Studying: ${spell.icon} ${spell.name}…`, 'info');
  renderLibrary();
}

function tickStudy() {
  if (!G.activeStudy) return;
  const spell = MAGIC_SPELLS.find(s => s.id === G.activeStudy);
  if (!spell) { G.activeStudy = null; return; }
  const p = G.player;
  if (!p.libraryStudy) p.libraryStudy = {};
  p.libraryStudy[G.activeStudy] = (p.libraryStudy[G.activeStudy] || 0) + 1;

  if (p.libraryStudy[G.activeStudy] >= spell.studyTime) {
    G.activeStudy = null;
    G.studyTick = 0;
    if (!TECHNIQUES.find(t => t.id === spell.id)) TECHNIQUES.push(spell);
    grantTechnique(spell.id);
    toast(`✨ Mastered: ${spell.icon} ${spell.name}!`, 'rare');
    renderLibrary();
  }
}

function stopStudying() {
  G.activeStudy = null;
  G.studyTick = 0;
  renderLibrary();
}

function _formatTime(ticks) {
  const secs = ticks * 0.25;
  if (secs < 60) return Math.round(secs) + 's';
  const m = Math.floor(secs / 60);
  const s = Math.round(secs % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function _bonusHtml(spell) {
  if (!spell.bonus) return '';
  const keys = Object.keys(spell.bonus);
  return keys.map(k => {
    const v = spell.bonus[k];
    const label = LIB_STAT_LABELS[k] || k;
    const display = k === 'critChance' ? `+${Math.round(v * 100)}%` : `+${v}`;
    return `<span class="bonus-tag">${label} ${display}</span>`;
  }).join('');
}

function _cardHtml(spell, p) {
  const owned = p.techniques.includes(spell.id);
  const locked = p.level < spell.levelReq;
  const studying = G.activeStudy === spell.id;
  const progress = getStudyProgress(spell.id);
  const pct = Math.floor((progress / spell.studyTime) * 100);

  let cls = `lib-card r-${spell.rarity}`;
  if (owned) cls += ' is-owned';
  if (studying) cls += ' is-studying';
  if (locked) cls += ' is-locked';

  const clickHandler = locked ? `toast('🔒 Requires Level ${spell.levelReq}','warn')` : '';

  let badge = '';
  if (owned) badge = '<div class="card-owned-badge">✓ Studied</div>';
  else if (studying) badge = '<div class="card-study-badge">● Studying</div>';

  let progressBlock = '';
  if (!owned && !locked) {
    progressBlock = `<div class="card-progress">
      <div class="cp-bar-track"><div class="cp-bar-fill" style="width:${pct}%"></div></div>
      <div class="cp-label">${progress}/${spell.studyTime} ticks</div>
    </div>`;
  }

  let actionBlock = '';
  if (owned) {
    actionBlock = '';
  } else if (locked) {
    actionBlock = `<div class="card-locked-label">🔒 Level ${spell.levelReq}</div>`;
  } else if (studying) {
    actionBlock = `<button class="btn-study btn-stop" onclick="event.stopPropagation();stopStudying()">■ Stop</button>`;
  } else {
    actionBlock = `<button class="btn-study" onclick="event.stopPropagation();startStudying('${spell.id}')" ${p.gold >= spell.cost ? '' : 'disabled'}>📖 Study — ${spell.cost}g</button>`;
  }

  const clickAttr = clickHandler ? ` onclick="${clickHandler}"` : '';

  return `<div class="${cls}"${clickAttr}>
    ${badge}
    <div class="card-icon">${spell.icon}</div>
    <div class="card-name">${spell.name}</div>
    <div class="card-rarity r-${spell.rarity}">${spell.rarity}</div>
    <div class="card-desc">${spell.desc}</div>
    <div class="card-meta">
      <span>💰 ${spell.cost}g</span>
      <span>⏱ ${_formatTime(spell.studyTime)}</span>
      <span>Lv.${spell.levelReq}+</span>
    </div>
    <div class="card-bonus">${_bonusHtml(spell)}</div>
    ${progressBlock}
    ${actionBlock}
  </div>`;
}

function _headerHtml(p) {
  if (!G.activeStudy) {
    return `<div class="lib-header empty">
      <div class="study-title" style="color:var(--dim)">No spell being studied</div>
      <div style="font-size:12px;color:var(--dim)">Select a spell below to begin studying</div>
    </div>`;
  }
  const spell = MAGIC_SPELLS.find(s => s.id === G.activeStudy);
  if (!spell) return '';
  const progress = getStudyProgress(G.activeStudy);
  const pct = Math.floor((progress / spell.studyTime) * 100);
  const remaining = spell.studyTime - progress;
  return `<div class="lib-header">
    <div class="study-title"><span class="s-icon">${spell.icon}</span> Studying: ${spell.name}</div>
    <div class="study-bar-wrap">
      <div class="study-bar-track"><div class="study-bar-fill" style="width:${pct}%"></div></div>
      <div class="study-pct">${pct}%</div>
    </div>
    <div class="study-meta">
      <span>${progress}/${spell.studyTime} ticks · ${_formatTime(remaining)} remaining</span>
      <button class="stop-btn" onclick="stopStudying()">■ Stop</button>
    </div>
  </div>`;
}

function _controlsHtml() {
  const filters = ['all', 'common', 'uncommon', 'rare', 'legendary'];
  const pills = filters.map(f => {
    const label = f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1);
    return `<span class="lib-pill${_libFilter === f ? ' active' : ''}" onclick="_libSetFilter('${f}')">${label}</span>`;
  }).join('');

  const sortOpts = [
    ['rarity', 'Rarity'],
    ['name', 'Name'],
    ['cost', 'Cost'],
    ['studyTime', 'Study Time'],
  ];
  const options = sortOpts.map(([v, l]) => `<option value="${v}"${_libSort === v ? ' selected' : ''}>${l}</option>`).join('');

  return `<div class="lib-controls">
    <div class="lib-pills">${pills}</div>
    <div class="lib-sort">
      <span>Sort:</span>
      <select onchange="_libSetSort(this.value)">${options}</select>
    </div>
  </div>`;
}

function _libSetFilter(f) {
  _libFilter = f;
  renderLibrary();
}

function _libSetSort(s) {
  _libSort = s;
  renderLibrary();
}

function _sortedSpells(p) {
  let spells = [...MAGIC_SPELLS];
  if (_libFilter !== 'all') {
    spells = spells.filter(s => s.rarity === _libFilter);
  }
  spells.sort((a, b) => {
    const aOwned = p.techniques.includes(a.id) ? 1 : 0;
    const bOwned = p.techniques.includes(b.id) ? 1 : 0;
    if (aOwned !== bOwned) return aOwned - bOwned;
    switch (_libSort) {
      case 'name': return a.name.localeCompare(b.name);
      case 'cost': return a.cost - b.cost;
      case 'studyTime': return a.studyTime - b.studyTime;
      case 'rarity':
      default: return LIB_RARITY_ORDER[b.rarity] - LIB_RARITY_ORDER[a.rarity];
    }
  });
  return spells;
}

function updateLibraryProgress() {
  if (!G.activeStudy) return;
  const spell = MAGIC_SPELLS.find(s => s.id === G.activeStudy);
  if (!spell) return;
  const progress = getStudyProgress(G.activeStudy);
  const pct = Math.floor((progress / spell.studyTime) * 100);
  const remaining = spell.studyTime - progress;

  const container = document.getElementById('library-container');
  if (!container) return;

  const headerFill = container.querySelector('.study-bar-fill');
  if (headerFill) headerFill.style.width = pct + '%';
  const headerPct = container.querySelector('.study-pct');
  if (headerPct) headerPct.textContent = pct + '%';
  const metaSpans = container.querySelectorAll('.study-meta span');
  metaSpans.forEach(el => {
    if (el.textContent.includes('/')) {
      el.textContent = `${progress}/${spell.studyTime} ticks · ${_formatTime(remaining)} remaining`;
    }
  });

  const cardFills = container.querySelectorAll('.lib-card.is-studying .cp-bar-fill');
  cardFills.forEach(fill => fill.style.width = pct + '%');
  const cardLabels = container.querySelectorAll('.lib-card.is-studying .cp-label');
  cardLabels.forEach(lbl => lbl.textContent = `${progress}/${spell.studyTime} ticks`);
}

function renderLibrary() {
  const container = document.getElementById('library-container');
  if (!container) return;
  const p = G.player;
  _injectLibStyle();

  if (p.level < 20) {
    container.innerHTML = `<div class="locked-section"><div class="locked-icon">📚</div><h3>Library Locked</h3><p>Reach <strong>Level 20</strong> to unlock the Library.</p><p style="color:var(--dim);font-size:12px">Current level: ${p.level}</p></div>`;
    return;
  }

  const spells = _sortedSpells(p);
  const cards = spells.map(s => _cardHtml(s, p)).join('');

  container.innerHTML = _headerHtml(p) + _controlsHtml() + `<div class="lib-grid">${cards}</div>`;
}