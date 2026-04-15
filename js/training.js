// ===== TRAINING SYSTEM =====
// ticksNeeded = ticks per session. At 250ms/tick:
//   8  = 2s  (easy, tiny gains)
//  20  = 5s
//  40  = 10s
//  80  = 20s
// 160  = 40s (hard, big gains)

const TRAINING_ACTIONS = [
  // Easy — fast cycle, small gains per session but adds up
  { id: 'pushups',       name: 'Push-Ups',        desc: 'Basic strength training.',               icon: '💪', staminaCost: 3,  xpGain: 4,   statGain: { atk: 1 },                       levelReq: 1,  ticksNeeded: 8,   maxProgress: 200 },
  { id: 'running',       name: 'Running',          desc: 'Improves speed and endurance.',          icon: '🏃', staminaCost: 3,  xpGain: 4,   statGain: { spd: 1 },                       levelReq: 1,  ticksNeeded: 8,   maxProgress: 200 },
  { id: 'stretching',    name: 'Stretching',       desc: 'Gentle flexibility work. Tiny HP gain.', icon: '🤸', staminaCost: 2,  xpGain: 3,   statGain: { hp: 3 },                        levelReq: 1,  ticksNeeded: 8,   maxProgress: 200 },
  // Medium
  { id: 'meditation',    name: 'Meditation',       desc: 'Increases max stamina.',                 icon: '🧘', staminaCost: 4,  xpGain: 8,   statGain: { stamina: 4 },                   levelReq: 3,  ticksNeeded: 20,  maxProgress: 150 },
  { id: 'sparring',      name: 'Sparring',         desc: 'Combat practice. Boosts ATK and DEF.',  icon: '🥊', staminaCost: 8,  xpGain: 18,  statGain: { atk: 2, def: 1 },               levelReq: 5,  ticksNeeded: 32,  maxProgress: 150 },
  { id: 'weightlifting', name: 'Weight Lifting',   desc: 'Heavy training. Solid ATK gains.',       icon: '🏋️', staminaCost: 12, xpGain: 28,  statGain: { atk: 4 },                       levelReq: 10, ticksNeeded: 48,  maxProgress: 120 },
  { id: 'ironbody',      name: 'Iron Body',        desc: 'Harden your body. DEF and HP.',          icon: '🛡️', staminaCost: 12, xpGain: 26,  statGain: { def: 3, hp: 8 },                levelReq: 10, ticksNeeded: 48,  maxProgress: 120 },
  // Hard
  { id: 'endurance_run', name: 'Endurance Run',    desc: 'Long-distance run. SPD and stamina.',    icon: '🏅', staminaCost: 15, xpGain: 40,  statGain: { spd: 4, stamina: 6 },           levelReq: 15, ticksNeeded: 72,  maxProgress: 100 },
  { id: 'shadowstep',    name: 'Shadow Step',      desc: 'Extreme agility training.',              icon: '👤', staminaCost: 18, xpGain: 55,  statGain: { spd: 6 },                       levelReq: 20, ticksNeeded: 96,  maxProgress: 100 },
  { id: 'battle_form',   name: 'Battle Form',      desc: 'Advanced combat stance. All stats.',     icon: '⚔️', staminaCost: 22, xpGain: 75,  statGain: { atk: 5, def: 3, spd: 2 },       levelReq: 28, ticksNeeded: 120, maxProgress: 80  },
  // Very Hard
  { id: 'deathspar',     name: 'Death Sparring',   desc: 'Near-death training. Massive gains.',    icon: '💀', staminaCost: 30, xpGain: 120, statGain: { atk: 8, def: 5, spd: 3 },       levelReq: 35, ticksNeeded: 160, maxProgress: 60  },
  { id: 'void_training', name: 'Void Training',    desc: 'Train in the void. Transcendent gains.', icon: '🌀', staminaCost: 40, xpGain: 200, statGain: { atk: 14, def: 8, hp: 20 },      levelReq: 45, ticksNeeded: 240, maxProgress: 40  },
];

// Called from game loop each time trainingTick reaches ticksNeeded
function tickTraining(actionId) {
  const action = TRAINING_ACTIONS.find(a => a.id === actionId);
  if (!action) { G.activeTraining = null; return; }
  const p = G.player;
  if (p.level < action.levelReq) { stopTraining(); return; }
  if (!spendStamina(action.staminaCost)) return; // wait for stamina

  if (!p.trainingProgress[actionId]) p.trainingProgress[actionId] = 0;
  p.trainingProgress[actionId] = Math.min(action.maxProgress, p.trainingProgress[actionId] + 1);

  const gainMult = getUpgradeValue('train_gain_mult');
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
  return Math.max(4, Math.floor(action.ticksNeeded * speedMult));
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
          : `<button class="btn-primary${active ? ' btn-stop' : ''}" onclick="startTraining('${action.id}')">${active ? '■ Stop' : '▶ Start'}</button>`
        }
      </div>
    `;
  }).join('');
}
