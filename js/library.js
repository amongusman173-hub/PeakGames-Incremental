// ===== LIBRARY — Magic Learning =====

const MAGIC_SPELLS = [
  // Common
  { id: 'spark',          name: 'Spark',            icon: '⚡', desc: 'A basic lightning bolt.',                   cost: 100,  levelReq: 2,  effect: 'damage', multiplier: 1.2,  bonus: { atk: 3 },              rarity: 'common',    studyTime: 30  },
  { id: 'frost_bolt',     name: 'Frost Bolt',        icon: '❄️', desc: 'Slows the enemy with ice.',                cost: 150,  levelReq: 4,  effect: 'stun',   multiplier: 1.0,  bonus: { spd: 4 },              rarity: 'common',    studyTime: 40  },
  { id: 'wind_slash',     name: 'Wind Slash',        icon: '🌬️', desc: 'A razor-sharp gust. Fast and light.',      cost: 120,  levelReq: 3,  effect: 'damage', multiplier: 1.1,  bonus: { spd: 5 },              rarity: 'common',    studyTime: 35  },
  { id: 'stone_spike',    name: 'Stone Spike',       icon: '🪨', desc: 'Summon a spike from the earth.',           cost: 130,  levelReq: 5,  effect: 'damage', multiplier: 1.4,  bonus: { def: 4 },              rarity: 'common',    studyTime: 40  },
  // Uncommon
  { id: 'flame_burst',    name: 'Flame Burst',       icon: '🔥', desc: 'A burst of fire. Burns for 2 turns.',      cost: 200,  levelReq: 6,  effect: 'damage', multiplier: 1.6,  bonus: { atk: 6 },              rarity: 'uncommon',  studyTime: 60  },
  { id: 'arcane_bolt',    name: 'Arcane Bolt',       icon: '🔮', desc: 'Pure magical energy. Ignores DEF.',        cost: 300,  levelReq: 10, effect: 'damage', multiplier: 2.0,  bonus: { atk: 8 },              rarity: 'uncommon',  studyTime: 80  },
  { id: 'mana_shield',    name: 'Mana Shield',       icon: '🛡️', desc: 'Conjure a shield. Heals 25% HP.',          cost: 350,  levelReq: 12, effect: 'heal',   healPct: 0.25,    bonus: { def: 8 },              rarity: 'uncommon',  studyTime: 80  },
  { id: 'poison_cloud',   name: 'Poison Cloud',      icon: '☠️', desc: 'Toxic mist. Poisons for 3 turns.',         cost: 280,  levelReq: 8,  effect: 'stun',   multiplier: 0.8,  bonus: { atk: 5, spd: 3 },      rarity: 'uncommon',  studyTime: 70  },
  { id: 'ice_lance',      name: 'Ice Lance',         icon: '🧊', desc: 'A piercing lance of ice. 3-hit.',          cost: 320,  levelReq: 14, effect: 'multi',  multiplier: 0.7,  hits: 3, bonus: { atk: 7 },      rarity: 'uncommon',  studyTime: 90  },
  { id: 'thunder_clap',   name: 'Thunder Clap',      icon: '⚡', desc: 'Shockwave stuns and deals damage.',        cost: 400,  levelReq: 16, effect: 'stun',   multiplier: 1.4,  bonus: { atk: 8, spd: 4 },      rarity: 'uncommon',  studyTime: 100 },
  // Rare
  { id: 'chain_lightning',name: 'Chain Lightning',   icon: '🌩️', desc: 'Lightning that hits 4 times.',            cost: 500,  levelReq: 18, effect: 'multi',  multiplier: 0.65, hits: 4, bonus: { atk: 10, spd: 5 }, rarity: 'rare',    studyTime: 120 },
  { id: 'blizzard',       name: 'Blizzard',          icon: '🌨️', desc: 'Frozen storm. 5-hit ice barrage.',         cost: 600,  levelReq: 22, effect: 'multi',  multiplier: 0.6,  hits: 5, bonus: { def: 10, spd: 8 }, rarity: 'rare',    studyTime: 140 },
  { id: 'inferno',        name: 'Inferno',           icon: '🌋', desc: 'Volcanic eruption. Massive fire damage.',  cost: 700,  levelReq: 25, effect: 'damage', multiplier: 2.8,  bonus: { atk: 15 },             rarity: 'rare',      studyTime: 150 },
  { id: 'gravity_well',   name: 'Gravity Well',      icon: '🌀', desc: 'Crush the enemy with gravity. Stuns.',     cost: 750,  levelReq: 30, effect: 'stun',   multiplier: 2.0,  bonus: { atk: 12, def: 8 },     rarity: 'rare',      studyTime: 160 },
  { id: 'meteor',         name: 'Meteor Strike',     icon: '☄️', desc: 'Call down a meteor. Massive damage.',      cost: 800,  levelReq: 28, effect: 'damage', multiplier: 3.2,  bonus: { atk: 18 },             rarity: 'rare',      studyTime: 160 },
  { id: 'soul_drain',     name: 'Soul Drain',        icon: '💀', desc: 'Drain life force. Heals you for 30%.',     cost: 900,  levelReq: 32, effect: 'heal',   healPct: 0.3,     bonus: { atk: 14, def: 6 },     rarity: 'rare',      studyTime: 170 },
  // Legendary
  { id: 'time_stop',      name: 'Time Stop',         icon: '⏰', desc: 'Freeze time. Stuns for 3 turns.',          cost: 1200, levelReq: 38, effect: 'stun',   multiplier: 1.5,  bonus: { spd: 12, atk: 12 },    rarity: 'legendary', studyTime: 200 },
  { id: 'void_blast',     name: 'Void Blast',        icon: '🌀', desc: 'Tear reality. 6× ATK damage.',             cost: 2000, levelReq: 45, effect: 'damage', multiplier: 6.0,  bonus: { atk: 25, critChance: 0.2 }, rarity: 'legendary', studyTime: 240 },
  { id: 'star_fall',      name: 'Star Fall',         icon: '🌟', desc: 'Rain of stars. 8-hit celestial barrage.',  cost: 2500, levelReq: 50, effect: 'multi',  multiplier: 0.8,  hits: 8, bonus: { atk: 20, spd: 15 }, rarity: 'legendary', studyTime: 280 },
  { id: 'divine_wrath',   name: 'Divine Wrath',      icon: '⚡', desc: 'Godly lightning. 10× ATK. Stuns.',         cost: 3500, levelReq: 60, effect: 'stun',   multiplier: 10.0, bonus: { atk: 40, critChance: 0.3 }, rarity: 'legendary', studyTime: 320 },
];

// Study progress: { spellId: ticksStudied }
// A spell is learned when ticksStudied >= studyTime

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
    // Register spell as technique
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

// Live progress update — called every tick when library tab is open
function updateLibraryProgress() {
  if (!G.activeStudy) return;
  const spell = MAGIC_SPELLS.find(s => s.id === G.activeStudy);
  if (!spell) return;
  const progress = getStudyProgress(G.activeStudy);
  const pct = Math.floor((progress / spell.studyTime) * 100);

  // Update banner bar
  const bannerBar = document.querySelector('#library-container .xp-bar');
  if (bannerBar) bannerBar.style.width = pct + '%';

  // Update banner text
  const bannerTexts = document.querySelectorAll('#library-container .active-banner span');
  bannerTexts.forEach(el => {
    if (el.style.color === 'var(--dim)' || el.textContent.includes('/')) {
      el.textContent = `${progress}/${spell.studyTime}`;
    }
  });

  // Update the in-card progress bar for the active spell
  const cardBars = document.querySelectorAll('#library-container .mastery-bar .xp-bar');
  cardBars.forEach(bar => {
    // Find the parent card and check if it's the active spell
    const card = bar.closest('.card');
    if (card && card.classList.contains('card-active')) {
      bar.style.width = pct + '%';
      const label = card.querySelector('.mastery-label');
      if (label) label.textContent = `${progress}/${spell.studyTime}`;
    }
  });
}

function renderLibrary() {
  const container = document.getElementById('library-container');
  if (!container) return;
  const p = G.player;

  if (p.level < 20) {
    container.innerHTML = `<div class="locked-section"><div class="locked-icon">📚</div><h3>Library Locked</h3><p>Reach <strong>Level 20</strong> to unlock the Library.</p><p style="color:var(--dim);font-size:12px">Current level: ${p.level}</p></div>`;
    return;
  }

  const html = MAGIC_SPELLS.map(spell => {
    const owned    = p.techniques.includes(spell.id);
    const locked   = p.level < spell.levelReq;
    const studying = G.activeStudy === spell.id;
    const progress = getStudyProgress(spell.id);
    const pct      = Math.floor((progress / spell.studyTime) * 100);
    const studyPct = studying ? Math.floor((G.studyTick / 4) * 100) : 0; // 4 ticks per study tick

    return `
      <div class="card${owned ? '' : ''}${locked ? ' card-locked-dim' : ''}${studying ? ' card-active' : ''}">
        <div class="tech-rarity ${spell.rarity}">${spell.rarity.toUpperCase()}</div>
        <h3>${spell.icon} ${spell.name}${studying ? ' <span class="active-dot">●</span>' : ''}</h3>
        <div class="card-desc">${spell.desc}</div>
        <div class="card-stats">
          <span class="highlight">💰 ${spell.cost}g</span>
          <span>Lv.${spell.levelReq}+</span>
          <span>📖 ${spell.studyTime} ticks to learn</span>
        </div>
        ${!owned && !locked ? `
          <div class="mastery-row">
            <div class="bar-track mastery-bar"><div class="bar xp-bar" style="width:${pct}%"></div></div>
            <span class="mastery-label">${progress}/${spell.studyTime}</span>
          </div>` : ''}
        ${owned
          ? `<span style="color:var(--ok);font-size:12px">✓ Mastered</span>`
          : locked
            ? `<div class="card-locked">🔒 Level ${spell.levelReq}</div>`
            : studying
              ? `<button class="btn-primary btn-stop" onclick="stopStudying()">■ Stop Studying</button>`
              : `<button class="btn-primary" onclick="startStudying('${spell.id}')" ${p.gold >= spell.cost ? '' : 'disabled'}>📖 Study (${spell.cost}g)</button>`
        }
      </div>`;
  }).join('');

  const studyBanner = G.activeStudy ? (() => {
    const s = MAGIC_SPELLS.find(x => x.id === G.activeStudy);
    const prog = getStudyProgress(G.activeStudy);
    const pct = Math.floor((prog / (s?.studyTime || 1)) * 100);
    return `<div class="active-banner" style="margin-bottom:14px">
      <span>${s?.icon} Studying: ${s?.name}</span>
      <div class="banner-bar-wrap"><div class="bar-track banner-bar-bg"><div class="bar xp-bar" style="width:${pct}%"></div></div></div>
      <span style="color:var(--dim);font-size:11px">${prog}/${s?.studyTime}</span>
      <button class="banner-stop-btn" onclick="stopStudying()">■ Stop</button>
    </div>`;
  })() : '';

  container.innerHTML = studyBanner + `<div class="card-grid">${html}</div>`;
}
