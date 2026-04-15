// ===== DOJO — Spar with Trainers to Earn Techniques =====
// Trainers are always 5 levels ahead of you and use smart AI.
// Win the spar to earn the technique. No gold cost.

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

// ── TRAINER AI COMBAT ──
// The trainer is always player.level + 5, uses smart AI:
// - If player used a weak attack last turn → trainer uses heavy blow
// - If player is attacking → trainer blocks (reduces damage by 60%)
// - If player HP is low → trainer goes aggressive
// - Trainer has 3 abilities always active

let dojoSparActive = false;
let dojoSparTech = null;
let dojoSparLog = null;
let dojoPlayerHP = 0;
let dojoTrainerHP = 0;
let dojoTrainer = null;
let dojoLastPlayerDmg = 0;
let dojoSparCallback = null;

function buildTrainer(tech) {
  const p = G.player;
  const trainerLevel = p.level + 2; // was +5, now only 2 levels ahead
  const sm = p.statMult;
  return {
    name: tech.trainer.name,
    icon: tech.trainer.icon,
    level: trainerLevel,
    hp: Math.floor((30 + trainerLevel * 8) * sm),   // reduced from *10 *1.5
    maxHp: Math.floor((30 + trainerLevel * 8) * sm),
    atk: Math.floor((2 + trainerLevel * 1.2) * sm),  // reduced from *1.8
    def: Math.floor((1 + trainerLevel * 0.6) * sm),  // reduced from *0.9
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

  // Show spar UI
  const container = document.getElementById('dojo-spar-ui');
  const list = document.getElementById('dojo-tech-list');
  if (container) container.classList.remove('hidden');
  if (list) list.classList.add('hidden');

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
  set('dojo-t-name', `${dojoTrainer.icon} ${dojoTrainer.name}`);
  setW('dojo-t-hp-bar', tPct);
  set('dojo-t-hp-txt', `${Math.max(0,Math.floor(dojoTrainerHP))}/${dojoTrainer.maxHp}`);
}

function dojoAttack(isHeavy) {
  if (!dojoSparActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();

  // Player attacks
  const mult = isHeavy ? 1.8 : 1.0;
  const base = Math.floor((p.atk + techBonus.atk) * (0.85 + Math.random() * 0.3) * mult);
  // Trainer blocks if player is attacking (smart AI — 30% chance to block, was 50%)
  const trainerBlocks = Math.random() < 0.3;
  const dmg = trainerBlocks
    ? Math.max(1, Math.floor(base * 0.4) - dojoTrainer.def)
    : Math.max(1, base - dojoTrainer.def);
  dojoLastPlayerDmg = dmg;
  dojoTrainerHP -= dmg;
  appendLog(dojoSparLog, `${trainerBlocks ? '🛡️ Trainer blocks! ' : ''}You deal ${dmg} damage.`, trainerBlocks ? 'log-info' : 'log-player');
  updateDojoSparUI();

  if (dojoTrainerHP <= 0) { endDojoSpar(true); return; }

  // Trainer AI turn
  setTimeout(dojoTrainerTurn, 600);
}

function dojoTrainerTurn() {
  if (!dojoSparActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();
  const hpRatio = dojoPlayerHP / p.maxHp;

  // Smart AI decisions:
  let dmgMult = 1.0;
  let msg = '';

  if (hpRatio < 0.3) {
    // Player is low HP → slight pressure (was 1.8x, now 1.4x)
    dojoTrainer.enraged = true;
    dmgMult = 1.4;
    msg = `${dojoTrainer.name} senses weakness and pushes harder!`;
  } else if (dojoLastPlayerDmg < dojoTrainer.atk * 0.3) {
    // Player used weak attack → trainer counters (was 2.2x, now 1.6x)
    dmgMult = 1.6;
    msg = `${dojoTrainer.name} sees the opening and counters!`;
  } else if (Math.random() < 0.25) {
    // Random heavy attack (was 0.3 chance, now 0.25)
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

  // Re-enable buttons
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
    // Register and grant technique
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
  const container = document.getElementById('dojo-spar-ui');
  const list = document.getElementById('dojo-tech-list');
  if (container) container.classList.add('hidden');
  if (list) list.classList.remove('hidden');
  renderDojo();
}

function doDojoTrain(actionId) {
  const action = DOJO_TRAINING.find(a => a.id === actionId);
  if (!action) return;
  const p = G.player;
  if (p.level < action.levelReq) { toast(`Requires level ${action.levelReq}`, 'warn'); return; }
  if (G.activeTraining === actionId) { stopTraining(); return; }
  // Cancel active job
  if (G.activeJob) {
    G.activeJob = null;
    G.jobTick = 0;
    toast('Job stopped — can\'t work while training.', 'warn');
    renderJobs();
  }
  if (!TRAINING_ACTIONS.find(a => a.id === actionId)) TRAINING_ACTIONS.push({ ...action });
  if (!p.trainingProgress[actionId]) p.trainingProgress[actionId] = 0;
  G.activeTraining = actionId;
  G.trainingTick = 0;
  toast(`Dojo training: ${action.name}`, 'info');
  renderDojo();
  renderTraining();
}

function renderDojo() {
  const container = document.getElementById('dojo-container');
  if (!container) return;
  const p = G.player;

  // Level gate
  if (p.level < 15) {
    container.innerHTML = `<div class="locked-section"><div class="locked-icon">🥋</div><h3>Dojo Locked</h3><p>Reach <strong>Level 15</strong> to unlock the Dojo.</p><p style="color:var(--dim);font-size:12px">Current level: ${p.level}</p></div>`;
    return;
  }

  const techHtml = DOJO_TECHNIQUES.map(tech => {
    const owned  = p.techniques.includes(tech.id);
    const locked = p.level < tech.levelReq;
    const trainerLevel = p.level + 5;
    return `
      <div class="card${owned ? '' : ''}${locked ? ' card-locked-dim' : ''}">
        <div class="tech-rarity ${tech.rarity}">${tech.rarity.toUpperCase()}</div>
        <h3>${tech.icon} ${tech.name}</h3>
        <div class="card-desc">${tech.desc}</div>
        <div class="card-stats">
          <span>Lv.${tech.levelReq}+</span>
          <span>${tech.effect === 'multi' ? `${tech.hits}x hits` : `${Math.floor(tech.multiplier*100)}% ATK`}</span>
        </div>
        <div class="trainer-info" style="margin:8px 0;padding:8px;background:rgba(0,0,0,0.2);border-radius:6px;display:flex;align-items:center;gap:8px">
          <span style="font-size:20px">${tech.trainer.icon}</span>
          <div>
            <div style="font-size:12px;font-weight:700;color:var(--text)">${tech.trainer.name}</div>
            <div style="font-size:10px;color:var(--danger)">Lv.${locked ? '???' : trainerLevel} Trainer</div>
          </div>
        </div>
        ${owned
          ? `<span style="color:var(--ok);font-size:12px">✓ Mastered</span>`
          : locked
            ? `<div class="card-locked">🔒 Level ${tech.levelReq}</div>`
            : `<button class="btn-primary" onclick="startDojoSpar('${tech.id}')">⚔️ Challenge Trainer</button>`
        }
      </div>`;
  }).join('');

  const trainHtml = DOJO_TRAINING.map(action => {
    const locked   = p.level < action.levelReq;
    const active   = G.activeTraining === action.id;
    const needed   = getTrainingTicksNeeded(action);
    const tickPct  = active ? Math.floor((G.trainingTick / needed) * 100) : 0;
    const cycleTime = (needed * G.tickRate / 1000).toFixed(1);
    const statStr  = Object.entries(action.statGain).map(([k,v])=>`+${v} ${k.toUpperCase()}`).join(', ');
    return `
      <div class="card${active ? ' card-active' : ''}${locked ? ' card-locked-dim' : ''}">
        <div class="card-top-row">
          <h3>${action.icon} ${action.name}${active ? ' <span class="active-dot">●</span>' : ''}</h3>
          <span class="cycle-badge">${cycleTime}s</span>
        </div>
        <div class="card-desc">${action.desc}</div>
        <div class="card-stats"><span>⚡ ${action.staminaCost}</span><span class="highlight">${statStr}</span></div>
        ${active ? `<div class="session-bar"><div class="bar stamina-bar" style="width:${tickPct}%"></div></div>` : ''}
        ${locked
          ? `<div class="card-locked">🔒 Level ${action.levelReq}</div>`
          : `<div style="display:flex;gap:6px;flex-wrap:wrap">
               <button class="btn-primary${active?' btn-stop':''}" onclick="doDojoTrain('${action.id}')">${active?'■ Stop':'▶ Train'}</button>
               ${!active ? `<button class="btn-small" onclick="quickTrain('${action.id}')" title="Instant training with a minigame">⚡ Quick</button>` : ''}
             </div>`
        }
      </div>`;
  }).join('');

  container.innerHTML = `
    <!-- Technique list -->
    <div id="dojo-tech-list">
      <div class="dojo-section">
        <h3>🥋 Fighting Techniques <span style="color:var(--dim);font-size:12px">— Spar with trainers to earn them. Trainers are 2 levels above you!</span></h3>
        <div class="trainer-warning">⚠️ Trainers are stronger than you. Train before challenging them!</div>
        <div class="card-grid" style="margin-top:10px">${techHtml}</div>
      </div>
      <div class="dojo-section" style="margin-top:24px">
        <h3>🏋️ Dojo Training</h3>
        <div class="card-grid" style="margin-top:10px">${trainHtml}</div>
      </div>
    </div>

    <!-- Spar UI (hidden by default) -->
    <div id="dojo-spar-ui" class="hidden trainer-battle">
      <div class="trainer-info">
        <span class="trainer-avatar" id="dojo-t-name">Trainer</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;background:rgba(0,0,0,0.25);border:1px solid var(--border);border-radius:var(--r);padding:16px;margin-bottom:10px;gap:12px">
        <div style="flex:1;text-align:center">
          <div style="font-size:15px;font-weight:700;margin-bottom:6px" id="dojo-p-name">Hero</div>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="bar-track" style="flex:1;height:10px"><div id="dojo-p-hp-bar" class="bar hp-bar" style="width:100%"></div></div>
            <span id="dojo-p-hp-txt" style="font-size:10px;color:var(--dim);min-width:60px">30/30</span>
          </div>
        </div>
        <div style="font-size:20px;color:var(--dim)">VS</div>
        <div style="flex:1;text-align:center">
          <div style="font-size:15px;font-weight:700;margin-bottom:6px;color:var(--danger)" id="dojo-t-name">Trainer</div>
          <div style="display:flex;align-items:center;gap:6px">
            <div class="bar-track" style="flex:1;height:10px"><div id="dojo-t-hp-bar" class="bar enemy-bar" style="width:100%"></div></div>
            <span id="dojo-t-hp-txt" style="font-size:10px;color:var(--dim);min-width:60px">100/100</span>
          </div>
        </div>
      </div>
      <div id="dojo-spar-log" class="combat-log"></div>
      <div id="dojo-spar-actions" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        <button class="btn-action" onclick="dojoAttack(false)">👊 Quick Strike</button>
        <button class="btn-action" onclick="dojoAttack(true)">💢 Heavy Strike</button>
        <button class="btn-action btn-flee" onclick="dojoFlee()">🏃 Flee</button>
      </div>
      <div id="dojo-spar-result" class="hidden" style="background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:var(--r);padding:16px;text-align:center;margin-top:10px">
        <div id="dojo-spar-result-text" style="font-size:16px;font-weight:700;margin-bottom:10px"></div>
        <button class="btn-primary" onclick="closeDojoSpar()">← Back to Dojo</button>
      </div>
    </div>`;
}
