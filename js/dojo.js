const DOJO_TECHNIQUES = [
  { id: 'iron_fist',     name: 'Iron Fist',       icon: '👊', desc: 'A hardened punch that ignores some DEF.',  levelReq: 1,  effect: 'damage', multiplier: 1.4, bonus: { atk: 4 },  rarity: 'common',    trainer: { name: 'Sensei Ryu',    icon: '🥋', quote: "Your fists are weak. Show me your resolve!" } },
  { id: 'leg_sweep',     name: 'Leg Sweep',        icon: '🦵', desc: 'Trips the enemy, stunning for 1 turn.',    levelReq: 3,  effect: 'stun',   multiplier: 0.8, bonus: { spd: 3 },  rarity: 'common',    trainer: { name: 'Master Hana',   icon: '🥷', quote: "Speed is everything. Can you keep up?" } },
  { id: 'power_strike',  name: 'Power Strike',     icon: '💢', desc: 'Channel strength into one massive blow.',  levelReq: 6,  effect: 'damage', multiplier: 2.0, bonus: { atk: 8 },  rarity: 'uncommon',  trainer: { name: 'Sensei Ryu',    icon: '🥋', quote: "Raw power means nothing without control!" } },
  { id: 'counter',       name: 'Counter Stance',   icon: '🔄', desc: 'Absorb a hit and strike back hard.',       levelReq: 10, effect: 'damage', multiplier: 1.8, bonus: { def: 6, atk: 5 }, rarity: 'uncommon', trainer: { name: 'Elder Kang',    icon: '👴', quote: "The greatest defense is a perfect counter." } },
  { id: 'berserker_rush',name: 'Berserker Rush',   icon: '😤', desc: '5-hit frenzy. Each hit deals ATK×0.5.',   levelReq: 15, effect: 'multi',  multiplier: 0.5, hits: 5, bonus: { atk: 10 }, rarity: 'uncommon', trainer: { name: 'Berserker Gorn', icon: '😤', quote: "RAAAH! Hit me with everything you've got!" } },
  { id: 'death_blow',    name: 'Death Blow',        icon: '💀', desc: 'A single devastating strike. 3× ATK.',    levelReq: 25, effect: 'damage', multiplier: 3.0, bonus: { atk: 15 }, rarity: 'rare',      trainer: { name: 'Shadow Master', icon: '🌑', quote: "One strike. One kill. That is the way." } },
  { id: 'thousand_fists',name: 'Thousand Fists',   icon: '🌪️', desc: '8-hit storm of punches.',                 levelReq: 35, effect: 'multi',  multiplier: 0.6, hits: 8, bonus: { atk: 18, spd: 8 }, rarity: 'rare', trainer: { name: 'Grand Master',  icon: '🏆', quote: "You dare challenge me? I have trained for 50 years!" } },
];

const DOJO_TRAINING = [
  { id: 'bag_work',      name: 'Bag Work',         icon: '🥊', desc: 'Hit the heavy bag. Builds ATK.',          staminaCost: 5,  xpGain: 10,  statGain: { atk: 0.5  }, levelReq: 1,  ticksNeeded: 10, maxProgress: 200 },
  { id: 'footwork',      name: 'Footwork Drills',  icon: '👟', desc: 'Agility drills. Builds SPD.',             staminaCost: 5,  xpGain: 10,  statGain: { spd: 0.5  }, levelReq: 1,  ticksNeeded: 10, maxProgress: 200 },
  { id: 'kata',          name: 'Kata Practice',    icon: '🥋', desc: 'Formal forms. Builds ATK and DEF.',       staminaCost: 8,  xpGain: 18,  statGain: { atk: 0.6, def: 0.4 }, levelReq: 4, ticksNeeded: 20, maxProgress: 150 },
  { id: 'sparring_pro',  name: 'Pro Sparring',     icon: '🏆', desc: 'Spar with a partner. All combat stats.',  staminaCost: 15, xpGain: 35,  statGain: { atk: 1.0, def: 0.6, spd: 0.4 }, levelReq: 10, ticksNeeded: 40, maxProgress: 120 },
  { id: 'iron_training', name: 'Iron Body Dojo',   icon: '🔩', desc: 'Condition your body to take hits.',       staminaCost: 18, xpGain: 45,  statGain: { def: 1.2, hp: 15 }, levelReq: 15, ticksNeeded: 56, maxProgress: 100 },
  { id: 'master_form',   name: 'Master Form',      icon: '🌟', desc: 'The ultimate martial arts form.',         staminaCost: 25, xpGain: 80,  statGain: { atk: 2.0, def: 1.0, spd: 0.8 }, levelReq: 30, ticksNeeded: 96, maxProgress: 60 },
];

let dojoSparActive = false;
let dojoSparTech = null;
let dojoSparLog = null;
let dojoPlayerHP = 0;
let dojoTrainerHP = 0;
let dojoTrainer = null;
let dojoLastPlayerDmg = 0;
let dojoSparCallback = null;

let dojoTrainActive = null;
let dojoTrainTick = 0;
let dojoTrainBuff = { atk:0, def:0, spd:0 };

let _dojoCSSInjected = false;
function injectDojoCSS() {
  if (_dojoCSSInjected) return;
  _dojoCSSInjected = true;
  const s = document.createElement('style');
  s.id = 'dojo-injected-css';
  s.textContent = `
    #dojo-container { padding: 0 4px; }
    .dojo-locked { text-align: center; padding: 60px 20px; }
    .dojo-locked .dl-icon { font-size: 48px; margin-bottom: 12px; }
    .dojo-locked h3 { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
    .dojo-locked p { color: var(--dim); font-size: 13px; line-height: 1.6; }
    .dojo-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 18px; background: linear-gradient(135deg, rgba(108,159,255,0.08), rgba(176,106,255,0.08)); border: 1px solid var(--border); border-radius: var(--r); margin-bottom: 20px; flex-wrap: wrap; }
    .dojo-header-stat { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text); font-weight: 600; }
    .dojo-header-stat .dhs-val { color: var(--accent); }
    .dojo-header-stat .dhs-dim { color: var(--dim); font-weight: 400; }
    .dojo-section-label { font-size: 16px; font-weight: 800; color: var(--text); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
    .dojo-section-label .dsl-sub { font-size: 11px; color: var(--dim); font-weight: 400; }
    .dojo-train-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; margin-bottom: 28px; }
    .dojo-trainer-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
    @media (max-width: 900px) { .dojo-trainer-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) { .dojo-trainer-grid { grid-template-columns: 1fr; } }
    .dt-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 18px; position: relative; transition: all 0.2s ease; overflow: hidden; }
    .dt-card:hover:not(.dt-locked) { border-color: var(--border-h); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(0,0,0,0.35); }
    .dt-card.dt-active { border-color: var(--ok); box-shadow: 0 0 16px rgba(39,174,96,0.15); }
    .dt-card.dt-active::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(39,174,96,0.06), transparent); pointer-events: none; }
    .dt-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .dt-card-name { font-size: 14px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 6px; }
    .dt-card-name .active-dot { color: var(--ok); font-size: 9px; animation: pulse 1.2s ease-in-out infinite; }
    .dt-cycle { font-size: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 4px; padding: 2px 8px; color: var(--dim); white-space: nowrap; }
    .dt-card-desc { font-size: 12px; color: var(--dim); margin-bottom: 8px; line-height: 1.4; }
    .dt-card-stats { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
    .dt-card-stats span { font-size: 11px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; color: var(--dim); }
    .dt-card-stats .dt-highlight { color: var(--gold); border-color: rgba(245,197,66,0.3); }
    .dt-card-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .dt-locked { opacity: 0.4; pointer-events: none; }
    .dt-locked-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(3px); border-radius: var(--r); z-index: 5; }
    .dt-locked-overlay .dt-lock-icon { font-size: 28px; margin-bottom: 6px; }
    .dt-locked-overlay .dt-lock-text { font-size: 12px; color: var(--dim); font-weight: 600; }
    .mtr-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; text-align: center; position: relative; overflow: hidden; transition: all 0.25s ease; }
    .mtr-card:hover:not(.mtr-locked) { border-color: var(--border-h); transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.4); }
    .mtr-card.mtr-mastered { border-color: var(--ok); }
    .mtr-card.mtr-mastered::after { content: '✓'; position: absolute; top: 10px; right: 12px; color: var(--ok); font-weight: 700; font-size: 16px; filter: drop-shadow(0 0 4px rgba(39,174,96,0.4)); }
    .mtr-icon { font-size: 48px; margin-bottom: 10px; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3)); }
    .mtr-trainer-name { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .mtr-tech-badge { display: inline-flex; align-items: center; gap: 5px; background: rgba(255,255,255,0.04); border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; margin-bottom: 6px; }
    .mtr-tech-icon { font-size: 14px; }
    .mtr-tech-name { font-size: 12px; font-weight: 600; color: var(--text); }
    .mtr-rarity-badge { display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px; margin-bottom: 8px; text-transform: uppercase; }
    .mtr-rarity-badge.common { color: var(--dim); background: rgba(90,106,138,0.15); }
    .mtr-rarity-badge.uncommon { color: var(--accent); background: rgba(108,159,255,0.12); }
    .mtr-rarity-badge.rare { color: var(--accent2); background: rgba(176,106,255,0.12); }
    .mtr-rarity-badge.legendary { color: var(--gold); background: rgba(245,197,66,0.12); }
    .mtr-effect { font-size: 11px; color: var(--dim); margin-bottom: 10px; }
    .mtr-level-req { font-size: 11px; color: var(--dim); margin-bottom: 12px; }
    .mtr-level-req strong { color: var(--text); }
    .mtr-mastered-label { font-size: 12px; color: var(--ok); font-weight: 600; }
    .mtr-locked { pointer-events: none; }
    .mtr-locked .mtr-icon { filter: blur(4px) grayscale(0.5); }
    .mtr-locked .mtr-trainer-name { filter: blur(3px); }
    .mtr-locked .mtr-tech-badge { filter: blur(3px); }
    .mtr-locked .mtr-effect, .mtr-locked .mtr-level-req { filter: blur(2px); }
    .mtr-lock-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.45); backdrop-filter: blur(2px); border-radius: var(--r); z-index: 5; cursor: pointer; }
    .mtr-lock-overlay .mtr-lock-icon { font-size: 32px; margin-bottom: 6px; }
    .mtr-lock-overlay .mtr-lock-text { font-size: 12px; color: var(--dim); font-weight: 600; }
    .spar-scene { background: rgba(0,0,0,0.25); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; margin-bottom: 12px; }
    .spar-header { text-align: center; margin-bottom: 16px; }
    .spar-header .spar-quote { font-size: 12px; color: var(--accent2); font-style: italic; margin-top: 4px; }
    .spar-header .spar-level-warn { font-size: 11px; color: var(--warn); margin-top: 6px; }
    .spar-hp-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .spar-hp-side { flex: 1; text-align: center; }
    .spar-hp-name { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
    .spar-hp-bar-wrap { display: flex; align-items: center; gap: 6px; }
    .spar-hp-bar-wrap .bar-track { flex: 1; height: 10px; }
    .spar-hp-bar-wrap .hp-label { font-size: 10px; color: var(--dim); min-width: 60px; }
    .spar-vs { font-size: 20px; color: var(--dim); font-weight: 900; text-shadow: 0 0 12px rgba(108,159,255,0.2); }
    .spar-result { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; text-align: center; margin-top: 12px; }
    .spar-result-text { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
  `;
  document.head.appendChild(s);
}

function buildTrainer(tech) {
  const p = G.player;
  const trainerLevel = p.level + 2;
  const sm = p.statMult;
  return {
    name: tech.trainer.name,
    icon: tech.trainer.icon,
    level: trainerLevel,
    hp: Math.floor((30 + trainerLevel * 8) * sm),
    maxHp: Math.floor((30 + trainerLevel * 8) * sm),
    atk: Math.floor((2 + trainerLevel * 1.2) * sm),
    def: Math.floor((1 + trainerLevel * 0.6) * sm),
    spd: Math.floor((2 + trainerLevel * 0.5) * sm),
    blocking: false,
    enraged: false,
  };
}

function startDojoSpar(techId) {
  const tech = DOJO_TECHNIQUES.find(t => t.id === techId);
  if (!tech) return;
  const p = G.player;
  if (p.level < tech.levelReq) { toast(`Requires level ${tech.levelReq}`, 'warn'); return; }
  if (p.techniques.includes(techId)) { toast('Already learned!', 'warn'); return; }

  dojoSparActive = true;
  dojoSparTech = tech;
  dojoTrainer = buildTrainer(tech);
  dojoPlayerHP = p.hp;
  dojoTrainerHP = dojoTrainer.hp;
  dojoLastPlayerDmg = 0;

  const sparUI = document.getElementById('dojo-spar-ui');
  const mainView = document.getElementById('dojo-tech-list');
  if (sparUI) sparUI.classList.remove('hidden');
  if (mainView) mainView.classList.add('hidden');

  dojoSparLog = document.getElementById('dojo-spar-log');
  if (dojoSparLog) dojoSparLog.innerHTML = '';

  updateDojoSparUI();
  appendLog(dojoSparLog, `🥋 ${dojoTrainer.icon} ${dojoTrainer.name} (Lv.${dojoTrainer.level}) steps forward!`, 'log-story');
  appendLog(dojoSparLog, `"${tech.trainer.quote}"`, 'log-story');
  appendLog(dojoSparLog, `⚠️ The trainer is ${dojoTrainer.level - p.level} levels above you. This will be hard.`, 'log-info');

  document.getElementById('dojo-spar-actions')?.classList.remove('hidden');
  document.getElementById('dojo-spar-result')?.classList.add('hidden');
}

function updateDojoSparUI() {
  const p = G.player;
  const pPct = Math.max(0, (dojoPlayerHP / p.maxHp) * 100);
  const tPct = Math.max(0, (dojoTrainerHP / dojoTrainer.maxHp) * 100);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setW = (id, w) => { const el = document.getElementById(id); if (el) el.style.width = w + '%'; };
  set('dojo-p-name', p.name);
  setW('dojo-p-hp-bar', pPct);
  set('dojo-p-hp-txt', `${Math.max(0,Math.floor(dojoPlayerHP))}/${p.maxHp}`);
  const trainerLabel = `${dojoTrainer.icon} ${dojoTrainer.name}`;
  set('dojo-t-name', trainerLabel);
  set('dojo-t-name-label', trainerLabel);
  setW('dojo-t-hp-bar', tPct);
  set('dojo-t-hp-txt', `${Math.max(0,Math.floor(dojoTrainerHP))}/${dojoTrainer.maxHp}`);
}

function dojoAttack(isHeavy) {
  if (!dojoSparActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();

  const mult = isHeavy ? 1.8 : 1.0;
  const base = Math.floor((p.atk + techBonus.atk) * (0.85 + Math.random() * 0.3) * mult);
  const trainerBlocks = Math.random() < 0.3;
  const dmg = trainerBlocks
    ? Math.max(1, Math.floor(base * 0.4) - dojoTrainer.def)
    : Math.max(1, base - dojoTrainer.def);
  dojoLastPlayerDmg = dmg;
  dojoTrainerHP -= dmg;
  appendLog(dojoSparLog, `${trainerBlocks ? '🛡️ Trainer blocks! ' : ''}You deal ${dmg} damage.`, trainerBlocks ? 'log-info' : 'log-player');
  updateDojoSparUI();

  if (dojoTrainerHP <= 0) { endDojoSpar(true); return; }

  document.querySelectorAll('#dojo-spar-actions button').forEach(b => b.disabled = true);
  setTimeout(dojoTrainerTurn, 600);
}

function dojoTrainerTurn() {
  if (!dojoSparActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();
  const hpRatio = dojoPlayerHP / p.maxHp;

  let dmgMult = 1.0;
  let msg = '';

  if (hpRatio < 0.3) {
    dojoTrainer.enraged = true;
    dmgMult = 1.4;
    msg = `${dojoTrainer.name} senses weakness and pushes harder!`;
  } else if (dojoLastPlayerDmg < dojoTrainer.atk * 0.3) {
    dmgMult = 1.6;
    msg = `${dojoTrainer.name} sees the opening and counters!`;
  } else if (Math.random() < 0.25) {
    dmgMult = 1.3;
    msg = `${dojoTrainer.name} winds up a heavy blow!`;
  } else {
    msg = `${dojoTrainer.name} strikes!`;
  }

  if (msg) appendLog(dojoSparLog, msg, 'log-enemy');

  const base = Math.floor(dojoTrainer.atk * (0.85 + Math.random() * 0.3) * dmgMult);
  const dmg = Math.max(1, base - (p.def + techBonus.def));
  dojoPlayerHP -= dmg;
  appendLog(dojoSparLog, `  → ${dmg} damage to you!`, 'log-enemy');
  updateDojoSparUI();

  if (dojoPlayerHP <= 0) { endDojoSpar(false); return; }

  document.querySelectorAll('#dojo-spar-actions button').forEach(b => b.disabled = false);
}

function dojoFlee() {
  if (!dojoSparActive) return;
  appendLog(dojoSparLog, '🏃 You fled the spar. No penalty.', 'log-info');
  endDojoSpar(null);
}

function endDojoSpar(won) {
  dojoSparActive = false;
  G.player.hp = Math.max(1, Math.floor(dojoPlayerHP));

  const resultEl = document.getElementById('dojo-spar-result');
  const resultText = document.getElementById('dojo-spar-result-text');
  document.getElementById('dojo-spar-actions')?.classList.add('hidden');
  if (resultEl) resultEl.classList.remove('hidden');

  if (won === true) {
    if (resultText) { resultText.textContent = `🏆 You won! Learned: ${dojoSparTech.icon} ${dojoSparTech.name}!`; resultText.style.color = 'var(--ok)'; }
    if (!TECHNIQUES.find(t => t.id === dojoSparTech.id)) TECHNIQUES.push(dojoSparTech);
    grantTechnique(dojoSparTech.id);
    toast(`🥋 Mastered: ${dojoSparTech.icon} ${dojoSparTech.name}!`, 'rare');
  } else if (won === false) {
    if (resultText) { resultText.textContent = `💀 Defeated! Train more and try again.`; resultText.style.color = 'var(--danger)'; }
    toast(`Defeated by ${dojoTrainer.name}. Keep training!`, 'warn');
  } else {
    if (resultText) { resultText.textContent = `🏃 You fled the spar.`; resultText.style.color = 'var(--warn)'; }
  }
}

function closeDojoSpar() {
  dojoSparActive = false;
  const sparUI = document.getElementById('dojo-spar-ui');
  const mainView = document.getElementById('dojo-tech-list');
  if (sparUI) sparUI.classList.add('hidden');
  if (mainView) mainView.classList.remove('hidden');
  renderDojo();
}

function dojoTickTraining() {
  if (!dojoTrainActive) return;
  const action = DOJO_TRAINING.find(a => a.id === dojoTrainActive);
  if (!action) { dojoTrainActive = null; return; }
  const p = G.player;
  if (p.stamina < action.staminaCost) return;
  dojoTrainTick++;
  const needed = action.ticks || 16;
  if (dojoTrainTick >= needed) {
    dojoTrainTick = 0;
    spendStamina(action.staminaCost);
    for (const [stat, val] of Object.entries(action.statGain)) {
      const add = Math.max(1, Math.round(val * 0.5));
      if (stat === 'atk') { dojoTrainBuff.atk += add; p.atk += add; }
      else if (stat === 'def') { dojoTrainBuff.def += add; p.def += add; }
      else if (stat === 'spd') { dojoTrainBuff.spd += add; p.spd += add; }
      else if (stat === 'hp') { p.maxHp += add; p.hp = Math.min(p.hp + add, p.maxHp); }
    }
    gainXP(Math.floor(action.xpGain * 0.5));
    renderDojo();
  }
}

function doDojoTrain(actionId) {
  const action = DOJO_TRAINING.find(a => a.id === actionId);
  if (!action) return;
  const p = G.player;
  if (p.level < action.levelReq) { toast(`Requires level ${action.levelReq}`, 'warn'); return; }
  if (dojoTrainActive === actionId) {
    dojoTrainActive = null;
    dojoTrainTick = 0;
    toast(`Stopped dojo training: ${action.name}`, 'info');
    renderDojo();
    return;
  }
  if (G.activeTraining) {
    stopTraining();
  }
  dojoTrainActive = actionId;
  dojoTrainTick = 0;
  toast(`Dojo training: ${action.name} (permanent bonuses!)`, 'success');
  renderDojo();
}

function stopDojoTraining() {
  if (!dojoTrainActive) return;
  const action = DOJO_TRAINING.find(a => a.id === dojoTrainActive);
  dojoTrainActive = null;
  dojoTrainTick = 0;
  if (action) toast(`Stopped dojo training: ${action.name}`, 'info');
  renderDojo();
}

function renderDojo() {
  const container = document.getElementById('dojo-container');
  if (!container) return;
  const p = G.player;
  injectDojoCSS();

  if (p.level < 15) {
    container.innerHTML = `<div class="dojo-locked"><div class="dl-icon">🥋</div><h3>Dojo Locked</h3><p>Reach <strong>Level 15</strong> to unlock the Dojo.</p><p style="color:var(--dim);font-size:12px">Current level: ${p.level}</p></div>`;
    return;
  }

  const totalTechs = DOJO_TECHNIQUES.length;
  const learnedTechs = DOJO_TECHNIQUES.filter(t => p.techniques.includes(t.id)).length;
  const trainerLevel = p.level + 2;

  const dojoActive = dojoTrainActive;
  const trainHtml = DOJO_TRAINING.map(action => {
    const locked = p.level < action.levelReq;
    const active = dojoActive === action.id;
    const needed = action.ticks || 16;
    const tickPct = active ? Math.floor((dojoTrainTick / needed) * 100) : 0;
    const cycleTime = (needed * G.tickRate / 1000).toFixed(1);
    const statStr = Object.entries(action.statGain).map(([k,v]) => `+${v} ${k.toUpperCase()}`).join(', ');
    return `
      <div class="dt-card${active ? ' dt-active' : ''}${locked ? ' dt-locked' : ''}">
        ${locked ? `<div class="dt-locked-overlay"><div class="dt-lock-icon">🔒</div><div class="dt-lock-text">Level ${action.levelReq}</div></div>` : ''}
        <div class="dt-card-top">
          <div class="dt-card-name">${action.icon} ${action.name}${active ? ' <span class="active-dot">●</span>' : ''}</div>
          <div class="dt-cycle">⏱ ${cycleTime}s</div>
        </div>
        <div class="dt-card-desc">${action.desc}</div>
        <div class="dt-card-stats">
          <span>⚡ ${action.staminaCost} STA</span>
          <span>✨ ${action.xpGain} XP</span>
          <span class="dt-highlight">${statStr}</span>
        </div>
        ${active ? `<div class="session-bar"><div class="bar stamina-bar" style="width:${tickPct}%"></div></div>` : ''}
        ${locked ? '' : `
          <div class="dt-card-actions">
            <button class="btn-primary${active ? ' btn-stop' : ''}" onclick="doDojoTrain('${action.id}')">${active ? '■ Stop' : '▶ Train'}</button>
          </div>`}
      </div>`;
  }).join('');

  const trainerHtml = DOJO_TECHNIQUES.map(tech => {
    const owned = p.techniques.includes(tech.id);
    const locked = p.level < tech.levelReq;
    const effectText = tech.effect === 'multi' ? `${tech.hits}x hits` : `${Math.floor(tech.multiplier * 100)}% ATK`;
    return `
      <div class="mtr-card${owned ? ' mtr-mastered' : ''}${locked ? ' mtr-locked' : ''}">
        ${locked ? `<div class="mtr-lock-overlay" onclick="toast('🔒 Requires Level ${tech.levelReq}','warn')"><div class="mtr-lock-icon">🔒</div><div class="mtr-lock-text">Level ${tech.levelReq}</div></div>` : ''}
        <span class="mtr-icon">${tech.trainer.icon}</span>
        <div class="mtr-trainer-name">${tech.trainer.name}</div>
        <div class="mtr-tech-badge">
          <span class="mtr-tech-icon">${tech.icon}</span>
          <span class="mtr-tech-name">${tech.name}</span>
        </div>
        <div><span class="mtr-rarity-badge ${tech.rarity}">${tech.rarity}</span></div>
        <div class="mtr-effect">${tech.desc}</div>
        <div class="mtr-level-req">Lv.<strong>${locked ? '???' : tech.levelReq}</strong> required · ${effectText} · Trainer Lv.${locked ? '???' : trainerLevel}</div>
        ${owned
          ? `<div class="mtr-mastered-label">✓ Mastered</div>`
          : locked
            ? ''
            : `<button class="btn-primary" onclick="startDojoSpar('${tech.id}')">⚔️ Challenge</button>`
        }
      </div>`;
  }).join('');

  const bannerEl = document.getElementById('dojo-training-banner');
  const bannerText = document.getElementById('dojo-training-banner-text');
  const bannerBar = document.getElementById('dojo-training-banner-bar');
  if (bannerEl) {
    if (dojoTrainActive) {
      const action = DOJO_TRAINING.find(a => a.id === dojoTrainActive);
      if (action) {
        bannerEl.classList.remove('hidden');
        if (bannerText) bannerText.textContent = `${action.icon} ${action.name}`;
        if (bannerBar) {
          const needed = action.ticks || 16;
          bannerBar.style.width = Math.floor((dojoTrainTick / needed) * 100) + '%';
        }
      }
    } else {
      bannerEl.classList.add('hidden');
    }
  }

  container.innerHTML = `
    <div id="dojo-tech-list">
      <div class="dojo-header">
        <div class="dojo-header-stat"><span>🥋</span><span class="dhs-val">${learnedTechs}</span><span class="dhs-dim">/ ${totalTechs} Techniques Mastered</span></div>
        <div class="dojo-header-stat"><span>⚔️</span><span class="dhs-dim">Trainer Lv.</span><span class="dhs-val">${trainerLevel}</span></div>
      </div>
      <div class="dojo-section-label">🏋️ Dojo Training <span class="dsl-sub">— Build stats to prepare for trainer challenges</span></div>
      <div class="dojo-train-grid">${trainHtml}</div>
      <div class="dojo-section-label">⚔️ Master Trainers <span class="dsl-sub">— Spar to earn their techniques</span></div>
      <div class="dojo-trainer-grid">${trainerHtml}</div>
    </div>
    <div id="dojo-spar-ui" class="hidden">
      <div class="spar-scene">
        <div class="spar-header">
          <div style="font-size:18px;font-weight:800;color:var(--text)" id="dojo-t-name">Trainer</div>
          <div class="spar-quote" id="dojo-spar-quote"></div>
          <div class="spar-level-warn" id="dojo-spar-level-warn"></div>
        </div>
        <div class="spar-hp-row">
          <div class="spar-hp-side">
            <div class="spar-hp-name" id="dojo-p-name">Hero</div>
            <div class="spar-hp-bar-wrap">
              <div class="bar-track"><div id="dojo-p-hp-bar" class="bar hp-bar" style="width:100%"></div></div>
              <span class="hp-label" id="dojo-p-hp-txt">30/30</span>
            </div>
          </div>
          <div class="spar-vs">VS</div>
          <div class="spar-hp-side">
            <div class="spar-hp-name" style="color:var(--danger)" id="dojo-t-name-label">Trainer</div>
            <div class="spar-hp-bar-wrap">
              <div class="bar-track"><div id="dojo-t-hp-bar" class="bar enemy-bar" style="width:100%"></div></div>
              <span class="hp-label" id="dojo-t-hp-txt">100/100</span>
            </div>
          </div>
        </div>
      </div>
      <div id="dojo-spar-log" class="combat-log"></div>
      <div id="dojo-spar-actions" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        <button class="btn-action" onclick="dojoAttack(false)">👊 Quick Strike</button>
        <button class="btn-action" onclick="dojoAttack(true)">💢 Heavy Strike</button>
        <button class="btn-action btn-flee" onclick="dojoFlee()">🏃 Flee</button>
      </div>
      <div id="dojo-spar-result" class="spar-result hidden">
        <div id="dojo-spar-result-text" class="spar-result-text"></div>
        <button class="btn-primary" onclick="closeDojoSpar()">← Back to Dojo</button>
      </div>
    </div>`;
}

function updateDojoBanner() {
  const bannerEl = document.getElementById('dojo-training-banner');
  const bannerText = document.getElementById('dojo-training-banner-text');
  const bannerBar = document.getElementById('dojo-training-banner-bar');
  if (!bannerEl) return;
  if (dojoTrainActive) {
    const action = DOJO_TRAINING.find(a => a.id === dojoTrainActive);
    if (action) {
      bannerEl.classList.remove('hidden');
      if (bannerText) bannerText.textContent = `${action.icon} ${action.name}`;
      if (bannerBar) {
        const needed = action.ticks || 16;
        bannerBar.style.width = Math.floor((dojoTrainTick / needed) * 100) + '%';
      }
    }
  } else {
    bannerEl.classList.add('hidden');
  }
}
