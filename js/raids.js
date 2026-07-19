const BOSSES = [
  { id:'goblin_king', name:'Goblin King', icon:'👺', levelReq:3, hp:800, atk:65, def:20, spd:18, abilityCount:2, xpReward:80, goldReward:30, techReward:'slash', lore:'The Goblin King has terrorized the village for years.', intro:'Grrr! You dare challenge the King?! I\'ll crush your bones!' },
  { id:'stone_golem', name:'Stone Golem', icon:'🗿', levelReq:8, hp:2200, atk:130, def:80, spd:8, abilityCount:2, xpReward:200, goldReward:80, techReward:'earth_crush', lore:'Awakened by dark magic, it guards the ancient ruins.', intro:'...*the ground shakes*...' },
  { id:'shadow_wolf', name:'Shadow Wolf Alpha', icon:'🐺', levelReq:15, hp:5000, atk:240, def:60, spd:120, abilityCount:3, xpReward:500, goldReward:200, techReward:'fang_strike', lore:'It hunts at night, leaving no trace. The pack follows its howl.', intro:'*a deafening howl echoes through the dark*' },
  { id:'iron_knight', name:'Iron Knight Valdris', icon:'⚔️', levelReq:22, hp:10000, atk:380, def:220, spd:70, abilityCount:3, xpReward:1000, goldReward:400, techReward:'holy_slash', lore:'Once a hero, now a servant of darkness. His armor is unbreakable.', intro:'You cannot stop what I have become. Kneel, or be broken.' },
  { id:'sea_serpent', name:'Leviathan', icon:'🐉', levelReq:30, hp:22000, atk:580, def:300, spd:100, abilityCount:4, xpReward:2000, goldReward:800, techReward:'tidal_wave', lore:'Ancient sailors called it the World Ender. It has sunk a thousand ships.', intro:'*the sea boils* The ocean claims all who dare enter my domain...' },
  { id:'demon_lord', name:'Demon Lord Vael', icon:'😈', levelReq:40, hp:45000, atk:950, def:440, spd:180, abilityCount:5, xpReward:5000, goldReward:2500, techReward:'hellfire', lore:'He who breaks the seal shall face oblivion. Vael has consumed entire kingdoms.', intro:'I have waited an eternity for a worthy soul to consume. You will do nicely.' },
  { id:'void_titan', name:'Void Titan', icon:'🌑', levelReq:55, hp:100000, atk:1600, def:700, spd:240, abilityCount:6, xpReward:12000, goldReward:6000, techReward:'void_rend', lore:'A being of pure nothingness. It does not kill — it erases.', intro:'*reality fractures around it* You should not exist. Let me fix that.' },
  { id:'god_of_war', name:'God of War — Kael\'thas', icon:'⚡', levelReq:70, hp:220000, atk:2600, def:1100, spd:360, abilityCount:6, xpReward:30000, goldReward:15000, techReward:'divine_heal', lore:'The war god himself descends. No mortal has ever survived this encounter.', intro:'A mortal challenges a god? *laughs* This will be over in an instant.' },
  { id:'celestial_dragon', name:'Celestial Dragon Auros', icon:'🐲', levelReq:80, hp:500000, atk:4000, def:1800, spd:500, abilityCount:7, xpReward:80000, goldReward:40000, techReward:'ancient_strike', lore:'A dragon born from starlight. Its scales deflect divine magic itself.', intro:'*the sky splits open* You have earned the right to die by my claws.' },
  { id:'primordial_chaos', name:'Primordial Chaos', icon:'🌀', levelReq:90, hp:1000000, atk:6500, def:2800, spd:700, abilityCount:8, xpReward:200000, goldReward:100000, techReward:'void_blast', lore:'Before creation there was chaos. It has returned to reclaim what was taken.', intro:'*existence itself trembles* I am what was before. I am what will be after. You are nothing.' },
];

let currentRaidBossId = null;
let _raidsCSSInjected = false;

function injectRaidsCSS() {
  if (_raidsCSSInjected) return;
  _raidsCSSInjected = true;
  const s = document.createElement('style');
  s.id = 'raids-injected-css';
  s.textContent = `
    .raid-locked { text-align: center; padding: 60px 20px; }
    .raid-locked .rl-icon { font-size: 48px; margin-bottom: 12px; }
    .raid-locked h3 { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
    .raid-locked p { color: var(--dim); font-size: 13px; }
    .raid-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; background: linear-gradient(135deg, rgba(231,76,60,0.08), rgba(245,197,66,0.08)); border: 1px solid var(--border); border-radius: var(--r); margin-bottom: 20px; flex-wrap: wrap; }
    .raid-header-stat { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text); font-weight: 600; }
    .raid-header-stat .rhs-val { color: var(--danger); }
    .raid-header-stat .rhs-dim { color: var(--dim); font-weight: 400; }
    .raid-select-grid { display: flex; gap: 14px; margin-bottom: 28px; overflow-x: auto; overflow-y: hidden; scroll-behavior: smooth; padding-bottom: 8px; -webkit-overflow-scrolling: touch; width: 100%; }
    .raid-select-grid::-webkit-scrollbar { height: 6px; }
    .raid-select-grid::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
    .raid-select-grid::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
    .raid-select-grid::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
    .raid-select-grid .rb-card { min-width: 260px; flex: 1 1 0; }
    .rb-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 0; position: relative; overflow: hidden; transition: all 0.25s ease; }
    .rb-card:hover:not(.rb-locked):not(.rb-defeated) { border-color: var(--border-h); transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.4); }
    .rb-card.rb-defeated { border-color: rgba(39,174,96,0.35); }
    .rb-card-top { display: flex; align-items: center; gap: 14px; padding: 16px 16px 0 16px; }
    .rb-card-icon { font-size: 40px; flex-shrink: 0; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)); }
    .rb-card-info { flex: 1; min-width: 0; }
    .rb-card-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 4px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .rb-card-name .rb-cleared { font-size: 10px; color: var(--ok); font-weight: 600; background: rgba(39,174,96,0.12); padding: 2px 6px; border-radius: 4px; }
    .rb-card-level { font-size: 11px; color: var(--dim); }
    .rb-card-level strong { color: var(--text); }
    .rb-stars { display: flex; gap: 2px; margin: 4px 0; }
    .rb-stars .star { font-size: 13px; color: var(--gold); opacity: 0.25; }
    .rb-stars .star.star-filled { opacity: 1; text-shadow: 0 0 6px rgba(245,197,66,0.4); }
    .rb-card-body { padding: 12px 16px; }
    .rb-card-lore { font-size: 11px; color: var(--dim); font-style: italic; margin-bottom: 10px; line-height: 1.5; }
    .rb-card-stats { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
    .rb-card-stats span { font-size: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 2px 7px; border-radius: 4px; color: var(--dim); }
    .rb-card-stats .rb-reward { color: var(--gold); border-color: rgba(245,197,66,0.3); }
    .rb-card-footer { padding: 0 16px 14px 16px; display: flex; align-items: center; justify-content: space-between; }
    .rb-card-locked { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.55); backdrop-filter: blur(3px); border-radius: var(--r); z-index: 5; }
    .rb-card-locked .rb-lock-icon { font-size: 28px; margin-bottom: 6px; }
    .rb-card-locked .rb-lock-text { font-size: 12px; color: var(--dim); font-weight: 600; }
    .raid-history-section { margin-top: 4px; }
    .raid-history-label { font-size: 14px; font-weight: 700; color: var(--dim); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
    .raid-history-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .rh-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(39,174,96,0.08); border: 1px solid rgba(39,174,96,0.2); border-radius: 20px; padding: 6px 14px; font-size: 12px; color: var(--ok); font-weight: 600; }
    .rh-pill .rh-icon { font-size: 16px; }
  `;
  document.head.appendChild(s);
}

function getRaidStars(levelReq) {
  if (levelReq >= 80) return 5;
  if (levelReq >= 55) return 4;
  if (levelReq >= 25) return 3;
  if (levelReq >= 10) return 2;
  return 1;
}

function startRaid(bossId) {
  const boss = BOSSES.find(b => b.id === bossId);
  if (!boss) return;
  const p = G.player;
  if (p.level < boss.levelReq) { toast(`Requires level ${boss.levelReq}`, 'warn'); return; }

  currentRaidBossId = bossId;
  const log = document.getElementById('raid-log');
  if (log) { log.classList.remove('hidden'); log.innerHTML = ''; }

  const enemy = { ...boss, maxHp: boss.hp };

  startRaidBattle(enemy, log, (won) => {
    if (won === true) {
      gainXP(boss.xpReward);
      const gold = gainGold(boss.goldReward);
      if (!p.defeatedBosses.includes(bossId)) {
        p.defeatedBosses.push(bossId);
        if (boss.techReward) grantTechnique(boss.techReward);
        appendLog(log, `🏆 First clear! Technique: ${getTechniqueName(boss.techReward)}`, 'log-story');
      }
      appendLog(log, `💰 +${gold} gold | ✨ +${boss.xpReward} XP`, 'log-heal');
      toast(`Defeated ${boss.name}!`, 'success');
    } else if (won === false) {
      appendLog(log, `💀 Defeated by ${boss.name}...`, 'log-enemy');
      toast(`Defeated by ${boss.name}`, 'warn');
    }
    renderRaids();
    renderInventory();
  });
}

function closeRaidBattle() {
  combatActive = false;
  const raidBattle = document.getElementById('raid-battle');
  const raidList   = document.getElementById('raids-list');
  if (raidBattle) raidBattle.classList.add('hidden');
  if (raidList)   raidList.classList.remove('hidden');
  document.getElementById('raid-result')?.classList.add('hidden');
  renderRaids();
}

function renderRaids() {
  const container = document.getElementById('raids-list');
  if (!container) return;
  const p = G.player;
  injectRaidsCSS();

  if (p.level < 8) {
    container.innerHTML = `<div class="raid-locked"><div class="rl-icon">⚔️</div><h3>Raids Locked</h3><p>Reach <strong>Level 8</strong> to unlock Raids.</p><p style="color:var(--dim);font-size:12px">Current level: ${p.level}</p></div>`;
    return;
  }

  const defeated = p.defeatedBosses || [];
  const clearCount = BOSSES.filter(b => defeated.includes(b.id)).length;

  const cardsHtml = BOSSES.map(boss => {
    const locked = p.level < boss.levelReq;
    const isCleared = defeated.includes(boss.id);
    const stars = getRaidStars(boss.levelReq);
    const starHtml = Array.from({length: 5}, (_, i) =>
      `<span class="star${i < stars ? ' star-filled' : ''}">★</span>`
    ).join('');
    const rewardStr = `✨ ${boss.xpReward} XP · 💰 ${boss.goldReward} G`;
    return `
      <div class="rb-card${isCleared ? ' rb-defeated' : ''}${locked ? ' rb-locked-wrap' : ''}">
        ${locked ? `<div class="rb-card-locked" onclick="toast('🔒 Requires Level ${boss.levelReq}','warn')"><div class="rb-lock-icon">🔒</div><div class="rb-lock-text">Level ${boss.levelReq}</div></div>` : ''}
        <div class="rb-card-top">
          <div class="rb-card-icon">${boss.icon}</div>
          <div class="rb-card-info">
            <div class="rb-card-name">${boss.name}${isCleared ? '<span class="rb-cleared">✓ Cleared</span>' : ''}</div>
            <div class="rb-card-level">Requires <strong>Lv.${boss.levelReq}</strong></div>
            <div class="rb-stars">${starHtml}</div>
          </div>
        </div>
        <div class="rb-card-body">
          <div class="rb-card-lore">"${boss.lore}"</div>
          <div class="rb-card-stats">
            <span>❤️ ${boss.hp.toLocaleString()}</span>
            <span>⚔️ ${boss.atk}</span>
            <span>🛡️ ${boss.def}</span>
            <span>⚡ ${boss.abilityCount}</span>
            <span class="rb-reward">${rewardStr}</span>
          </div>
        </div>
        <div class="rb-card-footer">
          ${boss.techReward && !isCleared ? `<span style="font-size:11px;color:var(--accent2)">🎁 ${getTechniqueName(boss.techReward)}</span>` : ''}
          ${locked ? '' : `<button class="btn-primary" onclick="startRaid('${boss.id}')">${isCleared ? '⚔️ Re-raid' : '⚔️ Raid'}</button>`}
        </div>
      </div>`;
  }).join('');

  let historyHtml = '';
  if (defeated.length > 0) {
    const defeatedPills = BOSSES.filter(b => defeated.includes(b.id)).map(b =>
      `<span class="rh-pill"><span class="rh-icon">${b.icon}</span>${b.name}</span>`
    ).join('');
    historyHtml = `
      <div class="raid-history-section">
        <div class="raid-history-label">📋 Raid History <span style="font-size:11px;font-weight:400">(${clearCount}/${BOSSES.length})</span></div>
        <div class="raid-history-grid">${defeatedPills}</div>
      </div>`;
  }

  container.innerHTML = `
    <div class="raid-header">
      <div class="raid-header-stat"><span>⚔️</span><span class="rhs-val">${clearCount}</span><span class="rhs-dim">/ ${BOSSES.length} Bosses Defeated</span></div>
    </div>
    <div class="raid-select-grid">${cardsHtml}</div>
    ${historyHtml}`;
}
