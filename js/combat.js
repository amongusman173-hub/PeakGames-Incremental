// ===== TURN-BASED COMBAT ENGINE =====

// ── SPD UTILITY — gives SPD real combat value ──
// Every 10 SPD = 1% dodge, capped at 40%
// Every 10 SPD = 0.5% crit chance bonus, capped at 25%
// Every 20 SPD = +100ms extra time on minigames, capped at +1500ms
function getSpdDodgeChance() {
  return Math.min(0.40, (G.player.spd / 10) * 0.01);
}
function getSpdCritBonus() {
  return Math.min(0.25, (G.player.spd / 10) * 0.005);
}
function getSpdMgTimeBonus() {
  return Math.min(1500, Math.floor(G.player.spd / 20) * 100);
}

let combatActive = false;
let combatCallback = null;
let combatEnemy = null;
let combatLog = null;
let combatPlayerHP = 0;
let combatEnemyHP = 0;
let combatTurn = 0;
let combatStatusPlayer = [];
let combatStatusEnemy = [];

// ── ENEMY ABILITY POOL ──
const ENEMY_ABILITIES = [
  { id: 'heavy_blow',   name: 'Heavy Blow',    icon: '🔨', dmgMult: 2.2,  effect: null,                                    msg: e => `${e.name} winds up a HEAVY BLOW!` },
  { id: 'poison_bite',  name: 'Poison Bite',   icon: '🐍', dmgMult: 0.8,  effect: (s) => s.push({name:'Poison',icon:'🟢',turns:3,dot:2}), msg: e => `${e.name} bites and poisons you!` },
  { id: 'shield_bash',  name: 'Shield Bash',   icon: '🛡️', dmgMult: 0.6,  effect: (s) => s.push({name:'Stunned',icon:'⚡',turns:1,skipTurn:true}), msg: e => `${e.name} bashes you with a shield!` },
  { id: 'double_strike',name: 'Double Strike',  icon: '⚔️', dmgMult: 1.4,  hits: 2,                                         msg: e => `${e.name} strikes twice!` },
  { id: 'war_cry',      name: 'War Cry',        icon: '📣', dmgMult: 0,    effect: (s,e) => { e._atkBuff = (e._atkBuff||0)+0.3; }, msg: e => `${e.name} lets out a WAR CRY! (+30% ATK)` },
  { id: 'life_drain',   name: 'Life Drain',     icon: '🩸', dmgMult: 1.5,  drain: true,                                     msg: e => `${e.name} drains your life force!` },
  { id: 'enrage',       name: 'Enrage',         icon: '😡', dmgMult: 0,    effect: (s,e) => { e._atkBuff = (e._atkBuff||0)+0.5; }, msg: e => `${e.name} ENRAGES! (+50% ATK)` },
  { id: 'tail_sweep',   name: 'Tail Sweep',     icon: '🌀', dmgMult: 1.0,  effect: (s) => s.push({name:'Slowed',icon:'🐢',turns:2}), msg: e => `${e.name} sweeps with its tail!` },
];

function getEnemyAbilities(enemy) {
  const pool = ENEMY_ABILITIES;
  const count = enemy.abilityCount || Math.min(3, Math.floor(1 + (enemy.atk / 20)));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

function appendLog(logEl, msg, cls = '') {
  if (!logEl) return;
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = msg;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

// ── RAID COMBAT (turn-based, uses same UI as story) ──
function startRaidBattle(enemy, logEl, callback) {
  if (combatActive) { toast('Already in combat!', 'warn'); return; }
  combatActive = true;
  combatCallback = callback;
  combatEnemy = { ...enemy, abilities: getEnemyAbilities(enemy), _atkBuff: 0 };
  combatLog = logEl;
  combatPlayerHP = G.player.hp;
  combatEnemyHP = enemy.hp;
  combatTurn = 0;
  combatStatusPlayer = [];
  combatStatusEnemy = [];
  resetMgCounts();

  // Show raid battle UI
  const raidBattle = document.getElementById('raid-battle');
  const raidList   = document.getElementById('raids-list');
  if (raidBattle) raidBattle.classList.remove('hidden');
  if (raidList)   raidList.classList.add('hidden');
  document.getElementById('raid-log')?.classList.remove('hidden');

  updateRaidBattleUI();
  renderRaidTechniqueActions();

  if (logEl) logEl.innerHTML = '';
  appendLog(logEl, `⚔️ ${enemy.name} appears!`, 'log-story');
  if (enemy.intro) appendLog(logEl, `"${enemy.intro}"`, 'log-story');
  if (combatEnemy.abilities?.length) {
    appendLog(logEl, `⚠️ Abilities: ${combatEnemy.abilities.map(a=>a.icon+a.name).join(', ')}`, 'log-info');
  }
  setBattleActionsEnabled(true, 'raid');
}

function updateRaidBattleUI() {
  const p = G.player;
  const pPct = Math.max(0, (combatPlayerHP / p.maxHp) * 100);
  const ePct = Math.max(0, (combatEnemyHP / combatEnemy.maxHp) * 100);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setW = (id, w) => { const el = document.getElementById(id); if (el) el.style.width = w + '%'; };

  set('rbp-name', p.name);
  setW('rbp-hp-bar', pPct);
  set('rbp-hp-txt', `${Math.max(0,Math.floor(combatPlayerHP))}/${p.maxHp}`);
  set('rbe-name', combatEnemy.name + ' ' + (combatEnemy.icon||''));
  setW('rbe-hp-bar', ePct);
  set('rbe-hp-txt', `${Math.max(0,Math.floor(combatEnemyHP))}/${combatEnemy.maxHp}`);

  const bpStatus = document.getElementById('rbp-status');
  const beStatus = document.getElementById('rbe-status');
  if (bpStatus) bpStatus.innerHTML = combatStatusPlayer.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
  if (beStatus) beStatus.innerHTML = combatStatusEnemy.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
}

function renderRaidTechniqueActions() {
  const container = document.getElementById('raid-technique-actions');
  if (!container) return;
  const equipped = G.player.equipped.filter(id => id !== null);
  container.innerHTML = equipped.map(techId => {
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (!tech) return '';
    return `<button class="btn-action" onclick="useRaidTechnique('${tech.id}')">${tech.icon} ${tech.name}</button>`;
  }).join('');
}

function useRaidTechnique(techId) {
  const tech = TECHNIQUES.find(t => t.id === techId);
  if (!tech) return;
  setBattleActionsEnabled(false, 'raid');
  techniqueMinigame(tech, (mult) => {
    applyTechniqueEffect(tech, mult, () => {
      if (combatEnemyHP > 0) setTimeout(() => enemyTurnRaid(), 500);
    });
  });
}

function raidBasicAttack() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'raid');
  basicAttackMinigame((mult) => {
    const p = G.player;
    const techBonus = getEquippedTechBonus();
    const base = Math.floor((p.atk + techBonus.atk) * (0.85 + Math.random() * 0.3) * mult);
    const dmg = Math.max(1, base - combatEnemy.def);
    const crit = Math.random() < 0.1 + techBonus.critChance + getSpdCritBonus();
    const final = crit ? Math.floor(dmg * 1.8) : dmg;
    combatEnemyHP -= final;
    appendLog(combatLog, `${crit?'💥 CRIT! ':''}Basic Attack: ${final} dmg (${mult.toFixed(1)}x)`, crit?'log-crit':'log-player');
    updateRaidBattleUI();
    if (combatEnemyHP <= 0) { endRaidBattle(true); return; }
    setTimeout(() => enemyTurnRaid(), 500);
  });
}

function raidFlee() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'raid');
  fleeMinigame((success) => {
    if (success) {
      appendLog(combatLog, '🏃 You fled successfully! No gold lost.', 'log-info');
      endRaidBattle(null);
    } else {
      const penalty = Math.floor(G.player.gold * 0.1);
      G.player.gold = Math.max(0, G.player.gold - penalty);
      appendLog(combatLog, `❌ Failed to flee! Lost ${penalty} gold!`, 'log-enemy');
      setTimeout(() => enemyTurnRaid(), 400);
    }
  });
}

function enemyTurnRaid() {
  if (!combatActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();

  // Tick status effects on player
  let skipTurn = false;
  combatStatusPlayer = combatStatusPlayer.map(s => {
    if (s.dot) { combatPlayerHP -= s.dot; appendLog(combatLog, `☠️ Poison deals ${s.dot} damage!`, 'log-enemy'); }
    if (s.skipTurn && s.turns > 0) skipTurn = true;
    return { ...s, turns: s.turns - 1 };
  }).filter(s => s.turns > 0);

  updateRaidBattleUI();
  if (combatPlayerHP <= 0) { endRaidBattle(false); return; }

  // Pick enemy action — bosses with more abilities use them more often
  const abilityChance = Math.min(0.75, 0.35 + (combatEnemy.abilityCount || 0) * 0.06);
  const useAbility = combatEnemy.abilities?.length && Math.random() < abilityChance;
  const ability = useAbility ? combatEnemy.abilities[Math.floor(Math.random() * combatEnemy.abilities.length)] : null;

  const atkMult = 1 + (combatEnemy._atkBuff || 0);
  const baseAtk = Math.floor(combatEnemy.atk * atkMult * (0.85 + Math.random() * 0.3));

  // SPD dodge check — applied to the whole enemy turn
  if (Math.random() < getSpdDodgeChance()) {
    appendLog(combatLog, `💨 You dodged the attack! (SPD: ${Math.floor(G.player.spd)})`, 'log-heal');
    updateRaidBattleUI();
    setBattleActionsEnabled(true, 'raid');
    return;
  }

  if (ability) {
    appendLog(combatLog, ability.msg(combatEnemy), 'log-enemy');
    if (ability.effect) ability.effect(combatStatusPlayer, combatEnemy);
    if (ability.dmgMult > 0) {
      const hits = ability.hits || 1;
      let total = 0;
      for (let h = 0; h < hits; h++) {
        const raw = Math.floor(baseAtk * ability.dmgMult);
        const d = Math.max(Math.floor(raw * 0.4), raw - (p.def + techBonus.def));
        total += d;
        combatPlayerHP -= d;
      }
      if (ability.drain) { combatEnemyHP = Math.min(combatEnemy.maxHp, combatEnemyHP + Math.floor(total * 0.5)); }
      appendLog(combatLog, `  → ${total} damage!`, 'log-enemy');
    }
  } else {
    const eDmg = Math.max(Math.floor(baseAtk * 0.4), baseAtk - (p.def + techBonus.def));
    combatPlayerHP -= eDmg;
    appendLog(combatLog, `${combatEnemy.name} attacks for ${eDmg} damage!`, 'log-enemy');
  }

  updateRaidBattleUI();
  if (combatPlayerHP <= 0) { endRaidBattle(false); return; }
  setBattleActionsEnabled(true, 'raid');
}

function endRaidBattle(won) {
  combatActive = false;
  G.player.hp = Math.max(1, Math.floor(combatPlayerHP));
  setBattleActionsEnabled(false, 'raid');

  const resultEl = document.getElementById('raid-result');
  const resultText = document.getElementById('raid-result-text');
  if (resultEl) resultEl.classList.remove('hidden');
  if (resultText) {
    if (won === true)  { resultText.textContent = '🏆 Victory!'; resultText.style.color = 'var(--ok)'; }
    else if (won === false) { resultText.textContent = '💀 Defeated...'; resultText.style.color = 'var(--danger)'; }
    else               { resultText.textContent = '🏃 Escaped!'; resultText.style.color = 'var(--warn)'; }
  }
  if (combatCallback) combatCallback(won);
}

// ── STORY BATTLE (interactive, with minigames) ──
function startStoryBattle(enemy, storyCallback) {
  if (combatActive) return;
  combatActive = true;
  combatCallback = storyCallback;
  combatEnemy = { ...enemy, abilities: getEnemyAbilities(enemy), _atkBuff: 0 };
  combatLog = document.getElementById('battle-log');
  combatPlayerHP = G.player.hp;
  combatEnemyHP = enemy.hp;
  combatTurn = 0;
  combatStatusPlayer = [];
  combatStatusEnemy = [];
  resetMgCounts();
  // Only reset vessel switch on a fresh story session (not when chaining enemies)
  // vesselSwitchActive / vesselSwitchCharges are preserved across chained fights

  document.getElementById('story-chapters').classList.add('hidden');
  document.getElementById('story-battle').classList.remove('hidden');
  document.getElementById('battle-result').classList.add('hidden');

  updateBattleUI();
  renderTechniqueActions();

  if (combatLog) combatLog.innerHTML = '';
  appendLog(combatLog, `⚔️ ${enemy.name} appears!`, 'log-story');
  if (enemy.intro) appendLog(combatLog, `"${enemy.intro}"`, 'log-story');
  if (combatEnemy.abilities?.length) {
    appendLog(combatLog, `⚠️ Abilities: ${combatEnemy.abilities.map(a=>a.icon+a.name).join(', ')}`, 'log-info');
  }
  if (vesselSwitchActive) {
    appendLog(combatLog, `🩸 Sukuna mode carries over — ${vesselSwitchCharges} fight(s) remaining.`, 'log-crit');
  }
  setBattleActionsEnabled(true, 'story');
}

function updateBattleUI() {
  const p = G.player;
  const pPct = Math.max(0, (combatPlayerHP / p.maxHp) * 100);
  const ePct = Math.max(0, (combatEnemyHP / combatEnemy.maxHp) * 100);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setW = (id, w) => { const el = document.getElementById(id); if (el) el.style.width = w + '%'; };

  set('bp-name', p.name);
  setW('bp-hp-bar', pPct);
  set('bp-hp-txt', `${Math.max(0,Math.floor(combatPlayerHP))}/${p.maxHp}`);
  set('be-name', combatEnemy.name);
  setW('be-hp-bar', ePct);
  set('be-hp-txt', `${Math.max(0,Math.floor(combatEnemyHP))}/${combatEnemy.maxHp}`);

  document.getElementById('bp-status').innerHTML = combatStatusPlayer.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
  document.getElementById('be-status').innerHTML = combatStatusEnemy.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
}

// Track vessel switch charges — declared here so renderTechniqueActions can reference them
let vesselSwitchActive = false;
let vesselSwitchCharges = 0;
const VESSEL_SWITCH_CHARGES = 3;

function renderTechniqueActions() {
  const container = document.getElementById('technique-actions');
  if (!container) return;
  if (vesselSwitchActive) {
    renderVesselTechniqueActions();
    return;
  }
  const equipped = G.player.equipped.filter(id => id !== null);
  container.innerHTML = equipped.map(techId => {
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (!tech) return '';
    return `<button class="btn-action${tech._jjk ? ' jjk-btn' : ''}" onclick="useTechnique('${tech.id}')">${tech.icon} ${tech.name}</button>`;
  }).join('');
}

function renderVesselTechniqueActions() {
  const container = document.getElementById('technique-actions');
  if (!container) return;
  const jjkIds = ['dismantle', 'cleave', 'fuga', 'domain_expansion'];
  const buttons = jjkIds.map(id => {
    const tech = TECHNIQUES.find(t => t.id === id);
    if (!tech) return `<button class="btn-action jjk-btn" onclick="useTechnique('${id}')">${id}</button>`;
    return `<button class="btn-action jjk-btn" onclick="useTechnique('${id}')">${tech.icon} ${tech.name}</button>`;
  }).join('');
  container.innerHTML =
    `<div style="width:100%;font-size:10px;color:#ff3333;margin-bottom:4px">🩸 SUKUNA MODE — ${vesselSwitchCharges} fight(s) remaining</div>` +
    buttons;
}

function applyTechniqueEffect(tech, mult, afterCb) {
  const p = G.player;

  // ── VESSEL SWITCH — swap moveset to JJK techniques for 3 enemy kills ──
  if (tech.effect === 'vessel' || tech._vesselSwitch) {
    vesselSwitchActive = true;
    vesselSwitchCharges = VESSEL_SWITCH_CHARGES;
    appendLog(combatLog, '🩸 VESSEL SWITCH — Sukuna takes over!', 'log-crit');
    appendLog(combatLog, `"This body... is mine now." — Active for ${VESSEL_SWITCH_CHARGES} enemies.`, 'log-story');
    // Flash red
    const flash = document.createElement('div');
    flash.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;
      background:rgba(180,0,0,0.4);animation:digFlash 0.6s ease-out forwards;`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
    renderVesselTechniqueActions();
    updateBattleUI();
    setTimeout(enemyTurn, 500);
    return;
  }

  // ── DOMAIN EXPANSION: MALEVOLENT SHRINE — continuous slashes for 4 turns ──
  if (tech.effect === 'domain_slash') {
    appendLog(combatLog, '🏯 DOMAIN EXPANSION: MALEVOLENT SHRINE!', 'log-crit');
    appendLog(combatLog, '"Shrine of Carnage — everything within range will be slashed."', 'log-story');
    // Apply domain slash status to enemy — deals damage each turn for 4 turns
    const slashDmg = Math.floor(p.atk * tech.slashMult * mult);
    combatStatusEnemy.push({
      name: 'Malevolent Shrine',
      icon: '🏯',
      turns: tech.slashTurns,
      dot: slashDmg, // damage per turn applied to enemy
      isEnemyDot: true,
    });
    // Immediate hit too
    const immediateDmg = Math.max(1, slashDmg - combatEnemy.def);
    combatEnemyHP -= immediateDmg;
    appendLog(combatLog, `💥 Initial slash: ${immediateDmg} dmg! Continuous slashes for ${tech.slashTurns} turns!`, 'log-crit');
    updateBattleUI();
    if (combatEnemyHP <= 0) { endBattle(true); return; }
    afterCb();
    return;
  }

  // ── GOJO DOMAIN: INFINITE VOID — immobilize + spawn new enemy ──
  if (tech.id === 'domain_infinite_void') {
    appendLog(combatLog, '🌌 DOMAIN EXPANSION: INFINITE VOID!', 'log-crit');
    appendLog(combatLog, '"Trapped in infinite information. You cannot move."', 'log-story');
    // Immobilize enemy for 4 turns
    combatStatusEnemy.push({ name: 'Immobilized', icon: '🌌', turns: 4, skipTurn: true });
    // Spawn a new enemy that attacks for 4 turns
    combatStatusPlayer.push({
      name: 'Void Spawn',
      icon: '👁️',
      turns: 4,
      dot: Math.floor(p.atk * 0.5), // void spawn deals damage each turn
      isVoidSpawn: true,
    });
    const dmg = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
    combatEnemyHP -= dmg;
    appendLog(combatLog, `💥 ${dmg} dmg! Enemy immobilized for 4 turns! A Void Spawn appears!`, 'log-crit');
    updateBattleUI();
    if (combatEnemyHP <= 0) { endBattle(true); return; }
    afterCb();
    return;
  }

  if (tech.effect === 'damage') {
    const dmg = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
    combatEnemyHP -= dmg;
    appendLog(combatLog, `${tech.icon} ${tech.name}: ${dmg} dmg (${mult.toFixed(1)}x)!`, mult >= 1.5 ? 'log-crit' : 'log-player');
  } else if (tech.effect === 'heal') {
    const healAmt = Math.floor(p.maxHp * tech.healPct * mult);
    combatPlayerHP = Math.min(p.maxHp, combatPlayerHP + healAmt);
    appendLog(combatLog, `${tech.icon} ${tech.name}: Healed ${healAmt} HP!`, 'log-heal');
  } else if (tech.effect === 'stun') {
    const dmg = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
    combatEnemyHP -= dmg;
    if (mult >= 1.0) combatStatusEnemy.push({ name: 'Stunned', icon: '⚡', turns: 2 });
    appendLog(combatLog, `${tech.icon} ${tech.name}: ${dmg} dmg${mult>=1?' + Stunned!':''}`, 'log-crit');
  } else if (tech.effect === 'multi') {
    let total = 0;
    for (let i = 0; i < tech.hits; i++) {
      const d = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
      total += d; combatEnemyHP -= d;
    }
    appendLog(combatLog, `${tech.icon} ${tech.name}: ${tech.hits}x hits = ${total} total!`, 'log-crit');
  } else if (tech.effect === 'shield') {
    // Infinity — immune for N turns
    combatStatusPlayer.push({ name: 'Infinity', icon: '♾️', turns: tech.shieldTurns || 2, shield: true });
    appendLog(combatLog, `♾️ Infinity activated! Immune for ${tech.shieldTurns} turns!`, 'log-heal');
  }
  updateBattleUI();
  if (combatEnemyHP <= 0) { endBattle(true); return; }
  afterCb();
}

function useTechnique(techId) {
  const tech = TECHNIQUES.find(t => t.id === techId);
  if (!tech) return;
  setBattleActionsEnabled(false, 'story');
  techniqueMinigame(tech, (mult) => {
    applyTechniqueEffect(tech, mult, () => setTimeout(enemyTurn, 500));
  });
}

function basicAttack() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'story');
  basicAttackMinigame((mult) => {
    const p = G.player;
    const techBonus = getEquippedTechBonus();
    const base = Math.floor((p.atk + techBonus.atk) * (0.85 + Math.random() * 0.3) * mult);
    const dmg = Math.max(1, base - combatEnemy.def);
    const crit = Math.random() < 0.1 + techBonus.critChance + getSpdCritBonus();
    const final = crit ? Math.floor(dmg * 1.8) : dmg;
    combatEnemyHP -= final;
    appendLog(combatLog, `${crit?'💥 CRIT! ':''}Basic Attack: ${final} dmg (${mult.toFixed(1)}x)`, crit?'log-crit':'log-player');
    updateBattleUI();
    if (combatEnemyHP <= 0) { endBattle(true); return; }
    setTimeout(enemyTurn, 500);
  });
}

function fleeBattle() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'story');
  fleeMinigame((success) => {
    if (success) {
      appendLog(combatLog, '🏃 You fled! No gold lost.', 'log-info');
      endBattle(null);
    } else {
      const penalty = Math.floor(G.player.gold * 0.1);
      G.player.gold = Math.max(0, G.player.gold - penalty);
      appendLog(combatLog, `❌ Failed to flee! Lost ${penalty} gold!`, 'log-enemy');
      setTimeout(enemyTurn, 400);
    }
  });
}

function enemyTurn() {
  if (!combatActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();

  // Tick status effects
  let skipTurn = false;
  combatStatusPlayer = combatStatusPlayer.map(s => {
    if (s.dot && !s.isEnemyDot) {
      // Poison/void spawn damage to player
      combatPlayerHP -= s.dot;
      if (s.isVoidSpawn) appendLog(combatLog, `👁️ Void Spawn attacks for ${s.dot} dmg!`, 'log-enemy');
      else appendLog(combatLog, `☠️ Poison: ${s.dot} dmg!`, 'log-enemy');
    }
    if (s.skipTurn) skipTurn = true;
    return { ...s, turns: s.turns - 1 };
  }).filter(s => s.turns > 0);

  // Tick enemy status effects (domain slash deals damage to enemy each turn)
  combatStatusEnemy = combatStatusEnemy.map(s => {
    if (s.dot && s.isEnemyDot) {
      const dmg = Math.max(1, s.dot - combatEnemy.def);
      combatEnemyHP -= dmg;
      appendLog(combatLog, `🏯 Malevolent Shrine slashes for ${dmg} dmg!`, 'log-crit');
    }
    return { ...s, turns: s.turns - 1 };
  }).filter(s => s.turns > 0);

  updateBattleUI();
  if (combatPlayerHP <= 0) { endBattle(false); return; }
  if (combatEnemyHP <= 0) { endBattle(true); return; }
  if (skipTurn) { appendLog(combatLog, `${combatEnemy.name} is stunned/immobilized!`, 'log-info'); setBattleActionsEnabled(true, 'story'); return; }

  // Check Infinity shield
  const hasShield = combatStatusPlayer.some(s => s.shield);
  if (hasShield) {
    appendLog(combatLog, `♾️ Infinity blocks the attack!`, 'log-heal');
    setBattleActionsEnabled(true, 'story');
    return;
  }

  const useAbility = combatEnemy.abilities?.length && Math.random() < 0.35;
  const ability = useAbility ? combatEnemy.abilities[Math.floor(Math.random() * combatEnemy.abilities.length)] : null;
  const atkMult = 1 + (combatEnemy._atkBuff || 0);
  const baseAtk = Math.floor(combatEnemy.atk * atkMult * (0.85 + Math.random() * 0.3));

  // SPD dodge check
  if (Math.random() < getSpdDodgeChance()) {
    appendLog(combatLog, `💨 You dodged the attack! (SPD: ${Math.floor(G.player.spd)})`, 'log-heal');
    updateBattleUI();
    setBattleActionsEnabled(true, 'story');
    return;
  }

  if (ability) {
    appendLog(combatLog, ability.msg(combatEnemy), 'log-enemy');
    if (ability.effect) ability.effect(combatStatusPlayer, combatEnemy);
    if (ability.dmgMult > 0) {
      const hits = ability.hits || 1;
      let total = 0;
      for (let h = 0; h < hits; h++) {
        const raw = Math.floor(baseAtk * ability.dmgMult);
        const d = Math.max(Math.floor(raw * 0.4), raw - (p.def + techBonus.def));
        total += d; combatPlayerHP -= d;
      }
      if (ability.drain) combatEnemyHP = Math.min(combatEnemy.maxHp, combatEnemyHP + Math.floor(total * 0.5));
      appendLog(combatLog, `  → ${total} damage!`, 'log-enemy');
    }
  } else {
    const eDmg = Math.max(Math.floor(baseAtk * 0.4), baseAtk - (p.def + techBonus.def));
    combatPlayerHP -= eDmg;
    appendLog(combatLog, `${combatEnemy.name} attacks for ${eDmg} damage!`, 'log-enemy');
  }

  updateBattleUI();
  if (combatPlayerHP <= 0) { endBattle(false); return; }
  setBattleActionsEnabled(true, 'story');
}

function endBattle(won) {
  combatActive = false;
  G.player.hp = Math.max(1, Math.floor(combatPlayerHP));
  setBattleActionsEnabled(false, 'story');

  // Decrement vessel switch charges on any fight end (win, lose, or flee)
  if (vesselSwitchActive) {
    vesselSwitchCharges--;
    if (vesselSwitchCharges <= 0) {
      vesselSwitchActive = false;
      vesselSwitchCharges = 0;
      appendLog(combatLog, '🩸 Sukuna recedes... Vessel Switch expired.', 'log-info');
    }
  }

  const resultEl = document.getElementById('battle-result');
  const resultText = document.getElementById('result-text');
  if (resultEl) resultEl.classList.remove('hidden');
  if (resultText) {
    if (won === true)  { resultText.textContent = '🏆 Victory!'; resultText.style.color = 'var(--ok)'; }
    else if (won === false) {
      resultText.textContent = '💀 Defeated...'; resultText.style.color = 'var(--danger)';
      const penalty = Math.floor(G.player.gold * 0.15);
      G.player.gold = Math.max(0, G.player.gold - penalty);
      if (penalty > 0) appendLog(combatLog, `💸 Lost ${penalty} gold from defeat!`, 'log-enemy');
    } else { resultText.textContent = '🏃 Escaped!'; resultText.style.color = 'var(--warn)'; }
  }
  if (combatCallback) combatCallback(won);
}

function setBattleActionsEnabled(enabled, context) {
  const prefix = context === 'raid' ? 'r' : '';
  [`${prefix}btn-basic-atk`, `${prefix}btn-flee`].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !enabled;
  });
  const techContainer = context === 'raid' ? '#raid-technique-actions' : '#technique-actions';
  document.querySelectorAll(`${techContainer} .btn-action`).forEach(btn => { btn.disabled = !enabled; });
}

// Wire up story battle buttons
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-basic-atk')?.addEventListener('click', basicAttack);
  document.getElementById('btn-flee')?.addEventListener('click', fleeBattle);
  document.getElementById('rbtn-basic-atk')?.addEventListener('click', raidBasicAttack);
  document.getElementById('rbtn-flee')?.addEventListener('click', raidFlee);
});
