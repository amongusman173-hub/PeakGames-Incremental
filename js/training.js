// ===== TRAINING SYSTEM =====
// ticksNeeded = ticks per session. At 250ms/tick:
//   8  = 2s  (easy, tiny gains)
//  20  = 5s
//  40  = 10s
//  80  = 20s
// 160  = 40s (hard, big gains)

const TRAINING_ACTIONS = [
  { id: 'pushups',       name: 'Push-Ups',        desc: 'Basic strength training.',               icon: '💪', staminaCost: 8,   xpGain: 15,   statGain: { atk: 1 },                       levelReq: 1,  ticksNeeded: 8,   maxProgress: 200 },
  { id: 'running',       name: 'Running',          desc: 'Improves speed and endurance.',          icon: '🏃', staminaCost: 8,   xpGain: 15,   statGain: { spd: 1 },                       levelReq: 1,  ticksNeeded: 8,   maxProgress: 200 },
  { id: 'stretching',    name: 'Stretching',       desc: 'Gentle flexibility work. Tiny HP gain.', icon: '🤸', staminaCost: 5,   xpGain: 10,   statGain: { hp: 3 },                        levelReq: 1,  ticksNeeded: 8,   maxProgress: 200 },
  { id: 'meditation',    name: 'Meditation',       desc: 'Increases max stamina.',                 icon: '🧘', staminaCost: 10,  xpGain: 25,   statGain: { stamina: 4 },                   levelReq: 3,  ticksNeeded: 20,  maxProgress: 150 },
  { id: 'sparring',      name: 'Sparring',         desc: 'Combat practice. Boosts ATK and DEF.',  icon: '🥊', staminaCost: 20,  xpGain: 55,   statGain: { atk: 2, def: 1 },               levelReq: 5,  ticksNeeded: 32,  maxProgress: 150 },
  { id: 'weightlifting', name: 'Weight Lifting',   desc: 'Heavy training. Solid ATK gains.',       icon: '🏋️', staminaCost: 30,  xpGain: 85,   statGain: { atk: 4 },                       levelReq: 10, ticksNeeded: 48,  maxProgress: 120 },
  { id: 'ironbody',      name: 'Iron Body',        desc: 'Harden your body. DEF and HP.',          icon: '🛡️', staminaCost: 30,  xpGain: 80,   statGain: { def: 3, hp: 8 },                levelReq: 10, ticksNeeded: 48,  maxProgress: 120 },
  { id: 'endurance_run', name: 'Endurance Run',    desc: 'Long-distance run. SPD and stamina.',    icon: '🏅', staminaCost: 40,  xpGain: 120,  statGain: { spd: 4, stamina: 6 },           levelReq: 15, ticksNeeded: 72,  maxProgress: 100 },
  { id: 'shadowstep',    name: 'Shadow Step',      desc: 'Extreme agility training.',              icon: '👤', staminaCost: 50,  xpGain: 165,  statGain: { spd: 6 },                       levelReq: 20, ticksNeeded: 96,  maxProgress: 100 },
  { id: 'battle_form',   name: 'Battle Form',      desc: 'Advanced combat stance. All stats.',     icon: '⚔️', staminaCost: 60,  xpGain: 225,  statGain: { atk: 5, def: 3, spd: 2 },       levelReq: 28, ticksNeeded: 120, maxProgress: 80  },
  { id: 'deathspar',     name: 'Death Sparring',   desc: 'Near-death training. Massive gains.',    icon: '💀', staminaCost: 80,  xpGain: 360,  statGain: { atk: 8, def: 5, spd: 3 },       levelReq: 35, ticksNeeded: 160, maxProgress: 60  },
  { id: 'void_training', name: 'Void Training',    desc: 'Train in the void. Transcendent gains.', icon: '🌀', staminaCost: 100, xpGain: 600,  statGain: { atk: 14, def: 8, hp: 20 },      levelReq: 45, ticksNeeded: 240, maxProgress: 40  },
];

// Called from game loop each time trainingTick reaches ticksNeeded
function tickTraining(actionId) {
  const action = TRAINING_ACTIONS.find(a => a.id === actionId);
  if (!action) { G.activeTraining = null; return; }
  const p = G.player;
  if (p.level < action.levelReq) { stopTraining(); return; }
  if (!spendStamina(action.staminaCost)) {
    // Out of stamina
    const cancel = getSettings().staminaCancelOnEmpty !== false;
    if (cancel) {
      stopTraining();
      toast(`⚡ Out of stamina! ${action.name} cancelled. (Disable in Settings to pause instead)`, 'warn');
    }
    // else: just pause silently — banner already shows "waiting…"
    return;
  }

  if (!p.trainingProgress[actionId]) p.trainingProgress[actionId] = 0;
  p.trainingProgress[actionId] = Math.min(action.maxProgress, p.trainingProgress[actionId] + 1);

  const ascBonus = typeof getAscensionBonus === 'function' ? getAscensionBonus().trainMult : 1;
  const gainMult = getUpgradeValue('train_gain_mult') * ascBonus;
  const sm = p.statMult;
  const gains = [];

  for (const [stat, val] of Object.entries(action.statGain)) {
    const add = Math.max(1, Math.round(val * sm * gainMult));
    if (stat === 'hp') {
      p.maxHp += add;
      p.hp = Math.min(p.hp + add, p.maxHp);
      gains.push(`+${add} HP`);
    } else if (stat === 'stamina') {
      p.maxStamina += add;
      gains.push(`+${add} STA`);
    } else if (stat === 'atk') {
      p.atk += add;
      gains.push(`+${add} ATK`);
    } else if (stat === 'def') {
      p.def += add;
      gains.push(`+${add} DEF`);
    } else if (stat === 'spd') {
      p.spd += add;
      gains.push(`+${add} SPD`);
    }
  }

  const xpMult = getUpgradeValue('train_xp_mult');
  const xpGained = Math.floor(action.xpGain * xpMult);
  gainXP(xpGained);

  // Show floating text for stat gains
  if (gains.length > 0) {
    spawnFloatingText(gains[0], 'float-xp', 'bar-stamina');
  }
  spawnFloatingText(`+${xpGained} XP`, 'float-xp');
}

function getTrainingTicksNeeded(action) {
  const speedMult = getUpgradeValue('train_speed_mult'); // <1 = faster
  // Stamina bonus: every 100 max stamina above base 40 = 2% faster training
  const staminaBonus = Math.max(0, (G.player.maxStamina - 40) / 100) * 0.02;
  // SPD bonus: every 50 SPD = 1% faster training
  const spdBonus = Math.floor(G.player.spd / 50) * 0.01;
  const totalMult = Math.max(0.2, speedMult * (1 - staminaBonus - spdBonus));
  return Math.max(4, Math.floor(action.ticksNeeded * totalMult));
}

function startTraining(actionId) {
  const action = TRAINING_ACTIONS.find(a => a.id === actionId);
  if (!action) return;
  if (G.player.level < action.levelReq) { toast(`Requires level ${action.levelReq}`, 'warn'); return; }
  if (G.activeTraining === actionId) { stopTraining(); return; }
  // Cancel active job
  if (G.activeJob) {
    G.activeJob = null;
    G.jobTick = 0;
    toast('Job stopped — can\'t work while training.', 'warn');
    renderJobs();
  }
  G.activeTraining = actionId;
  G.trainingTick = 0;
  toast(`Training: ${action.name}`, 'info');
  renderTraining();
}

function stopTraining() {
  G.activeTraining = null;
  G.trainingTick = 0;
  renderTraining();
}

// ── QUICK TRAIN — instant one-shot training with a minigame ──
const QUICK_TRAIN_GAMES = [
  (a, cb) => showMinigame('timing',    2, `⚡ ${a.icon} Quick Train — hit the zone!`,    cb),
  (a, cb) => showMinigame('mash',      2, `⚡ ${a.icon} Quick Train — mash it!`,         cb),
  (a, cb) => showMinigame('hold',      2, `⚡ ${a.icon} Quick Train — hold and release!`, cb),
  (a, cb) => showMinigame('sequence',  2, `⚡ ${a.icon} Quick Train — follow the pattern!`, cb),
  (a, cb) => showMinigame('draw_line', 2, `⚡ ${a.icon} Quick Train — slash straight!`,  cb),
  (a, cb) => showMinigame('dual_zone', 2, `⚡ ${a.icon} Quick Train — hit both zones!`,  cb),
];
let quickTrainIndex = 0;

function quickTrain(actionId) {
  const action = TRAINING_ACTIONS.find(a => a.id === actionId);
  if (!action) return;
  const p = G.player;
  if (p.level < action.levelReq) { toast(`Requires level ${action.levelReq}`, 'warn'); return; }
  if (!spendStamina(action.staminaCost)) {
    toast(`⚡ Not enough stamina! Need ${action.staminaCost}, have ${Math.floor(p.stamina)}.`, 'warn');
    return;
  }

  const game = QUICK_TRAIN_GAMES[quickTrainIndex % QUICK_TRAIN_GAMES.length];
  quickTrainIndex++;

  game(action, (mult) => {
    const ascBonus = typeof getAscensionBonus === 'function' ? getAscensionBonus().trainMult : 1;
    const gainMult = getUpgradeValue('train_gain_mult') * mult * ascBonus;
    const sm = p.statMult;
    const gains = [];
    for (const [stat, val] of Object.entries(action.statGain)) {
      const add = Math.max(1, Math.round(val * sm * gainMult));
      if (stat === 'hp')      { p.maxHp += add; p.hp = Math.min(p.hp + add, p.maxHp); gains.push(`+${add} HP`); }
      else if (stat === 'stamina') { p.maxStamina += add; gains.push(`+${add} STA`); }
      else if (stat === 'atk') { p.atk += add; gains.push(`+${add} ATK`); }
      else if (stat === 'def') { p.def += add; gains.push(`+${add} DEF`); }
      else if (stat === 'spd') { p.spd += add; gains.push(`+${add} SPD`); }
    }
    const xpMult = getUpgradeValue('train_xp_mult');
    const xp = Math.floor(action.xpGain * xpMult * mult);
    gainXP(xp);
    spawnFloatingText(gains[0] || '+stat', 'float-xp', 'bar-stamina');
    toast(`Quick Train: ${gains.join(', ')} +${xp}XP (${mult.toFixed(1)}x)`, 'success');
  });
}

function updateTrainingBanner() {
  // In-tab banner (only visible on training tab)
  const banner = document.getElementById('training-banner');
  if (banner) {
    if (!G.activeTraining) { banner.classList.add('hidden'); }
    else {
      const action = TRAINING_ACTIONS.find(a => a.id === G.activeTraining);
      if (action) {
        banner.classList.remove('hidden');
        const needed = getTrainingTicksNeeded(action);
        const noStamina = G.player.stamina < action.staminaCost;
        const pct = Math.floor((G.trainingTick / needed) * 100);
        const el  = document.getElementById('training-banner-text');
        const bar = document.getElementById('training-banner-bar');
        if (el)  el.textContent = `${action.icon} ${action.name}${noStamina ? ' ⏸ waiting…' : ''}`;
        if (bar) bar.style.width = pct + '%';
      }
    }
  }

  // Global banner (visible on ALL tabs, like job banner)
  const gb = document.getElementById('training-global-banner');
  if (!gb) return;
  if (!G.activeTraining) { gb.classList.add('hidden'); return; }
  const action = TRAINING_ACTIONS.find(a => a.id === G.activeTraining);
  if (!action) { gb.classList.add('hidden'); return; }
  gb.classList.remove('hidden');
  const needed = getTrainingTicksNeeded(action);
  const noStamina = G.player.stamina < action.staminaCost;
  const pct = Math.floor((G.trainingTick / needed) * 100);
  const iconEl   = document.getElementById('tgb-icon');
  const nameEl   = document.getElementById('tgb-name');
  const barEl    = document.getElementById('tgb-bar');
  const statusEl = document.getElementById('tgb-status');
  if (iconEl)   iconEl.textContent   = action.icon;
  if (nameEl)   nameEl.textContent   = action.name;
  if (barEl)    barEl.style.width    = pct + '%';
  if (statusEl) statusEl.textContent = noStamina ? '⏸ waiting…' : '';
}

function renderTraining() {
  const container = document.getElementById('training-list');
  if (!container) return;
  const p = G.player;

  container.innerHTML = TRAINING_ACTIONS.map(action => {
    const locked   = p.level < action.levelReq;
    const active   = G.activeTraining === action.id;
    const progress = p.trainingProgress[action.id] || 0;
    const pct      = Math.floor((progress / action.maxProgress) * 100);
    const needed   = getTrainingTicksNeeded(action);
    const tickPct  = active ? Math.floor((G.trainingTick / needed) * 100) : 0;
    const cycleTime = (needed * G.tickRate / 1000).toFixed(1);
    const gainMult = getUpgradeValue('train_gain_mult');
    const sm = p.statMult;
    // Show actual integer gains per session
    const statStr = Object.entries(action.statGain)
      .map(([k, v]) => `+${Math.max(1, Math.round(v * sm * gainMult))} ${k.toUpperCase()}`)
      .join(', ');

    return `
      <div class="card${active ? ' card-active' : ''}${locked ? ' card-locked-dim' : ''}">
        <div class="card-top-row">
          <h3>${action.icon} ${action.name}${active ? ' <span class="active-dot">●</span>' : ''}</h3>
          <span class="cycle-badge">${cycleTime}s</span>
        </div>
        <div class="card-desc">${action.desc}</div>
        <div class="card-stats">
          <span>⚡ ${action.staminaCost} stamina</span>
          <span>⏱ ${cycleTime}s / session</span>
          <span class="highlight">${statStr}${gainMult > 1 ? ` <em style="color:var(--ok)">×${gainMult.toFixed(1)}</em>` : ''}</span>
        </div>
        <div class="mastery-row">
          <div class="bar-track mastery-bar"><div class="bar xp-bar" style="width:${pct}%"></div></div>
          <span class="mastery-label">${progress}/${action.maxProgress}</span>
        </div>
        ${active ? `<div class="bar-track session-bar"><div id="session-bar-${action.id}" class="bar stamina-bar" style="width:${tickPct}%"></div></div>` : ''}
        ${locked
          ? `<div class="card-locked">🔒 Level ${action.levelReq}</div>`
          : `<div style="display:flex;gap:6px;flex-wrap:wrap">
               <button class="btn-primary${active ? ' btn-stop' : ''}" onclick="startTraining('${action.id}')">${active ? '■ Stop' : '▶ Start'}</button>
               ${!active ? `<button class="btn-small" onclick="quickTrain('${action.id}')" title="Instant training with a minigame">⚡ Quick</button>` : ''}
             </div>`
        }
      </div>
    `;
  }).join('');
}
