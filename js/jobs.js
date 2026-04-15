// ===== JOBS SYSTEM =====

// ticksNeeded = ticks per full cycle. At 250ms/tick:
//   8 ticks  = 2s   (easy)
//  20 ticks  = 5s
//  40 ticks  = 10s
//  80 ticks  = 20s
// 160 ticks  = 40s  (hard)
// goldPerCycle = what you earn each full cycle
const JOBS = [
  // Tier 1 — Beginner (Lv 1-9)
  { id: 'beggar',      name: 'Beggar',           desc: 'Ask for coins on the street.',        icon: '🪣',  levelReq: 1,  atkReq: 0,   goldPerCycle: 1,    xpPerCycle: 8,    ticksNeeded: 6   },
  { id: 'laborer',     name: 'Laborer',           desc: 'Haul goods at the docks.',            icon: '⚒️',  levelReq: 1,  atkReq: 0,   goldPerCycle: 3,    xpPerCycle: 15,   ticksNeeded: 8   },
  { id: 'farmhand',    name: 'Farmhand',           desc: 'Tend crops and livestock.',           icon: '🌾',  levelReq: 2,  atkReq: 0,   goldPerCycle: 6,    xpPerCycle: 25,   ticksNeeded: 12  },
  { id: 'fisherman',   name: 'Fisherman',          desc: 'Cast nets at the river.',             icon: '🎣',  levelReq: 3,  atkReq: 0,   goldPerCycle: 9,    xpPerCycle: 35,   ticksNeeded: 14  },
  { id: 'woodcutter',  name: 'Woodcutter',         desc: 'Chop timber in the forest.',          icon: '🪓',  levelReq: 4,  atkReq: 0,   goldPerCycle: 12,   xpPerCycle: 45,   ticksNeeded: 16  },
  // Tier 2 — Common (Lv 5-14)
  { id: 'guard',       name: 'Town Guard',         desc: 'Patrol the city streets.',            icon: '🛡️',  levelReq: 5,  atkReq: 12,  goldPerCycle: 18,   xpPerCycle: 60,   ticksNeeded: 20  },
  { id: 'courier',     name: 'Courier',            desc: 'Deliver parcels across the city.',    icon: '📦',  levelReq: 7,  atkReq: 0,   goldPerCycle: 22,   xpPerCycle: 75,   ticksNeeded: 24  },
  { id: 'miner',       name: 'Miner',              desc: 'Extract ore from the mines.',         icon: '⛏️',  levelReq: 8,  atkReq: 0,   goldPerCycle: 28,   xpPerCycle: 90,   ticksNeeded: 28  },
  { id: 'cook',        name: 'Cook',               desc: 'Prepare meals at the tavern.',        icon: '🍳',  levelReq: 9,  atkReq: 0,   goldPerCycle: 32,   xpPerCycle: 100,  ticksNeeded: 30  },
  // Tier 3 — Skilled (Lv 10-19)
  { id: 'hunter',      name: 'Monster Hunter',     desc: 'Hunt beasts in the wilds.',           icon: '🏹',  levelReq: 10, atkReq: 25,  goldPerCycle: 55,   xpPerCycle: 160,  ticksNeeded: 40  },
  { id: 'blacksmith',  name: 'Blacksmith',         desc: 'Forge weapons and armor.',            icon: '🔨',  levelReq: 14, atkReq: 0,   goldPerCycle: 70,   xpPerCycle: 200,  ticksNeeded: 48  },
  { id: 'herbalist',   name: 'Herbalist',          desc: 'Gather and sell rare herbs.',         icon: '🌿',  levelReq: 12, atkReq: 0,   goldPerCycle: 60,   xpPerCycle: 180,  ticksNeeded: 44  },
  { id: 'sailor',      name: 'Sailor',             desc: 'Navigate trade routes at sea.',       icon: '⚓',  levelReq: 13, atkReq: 0,   goldPerCycle: 65,   xpPerCycle: 190,  ticksNeeded: 46  },
  // Tier 4 — Expert (Lv 20-34)
  { id: 'mercenary',   name: 'Mercenary',          desc: 'Take dangerous contracts.',           icon: '⚔️',  levelReq: 20, atkReq: 50,  goldPerCycle: 140,  xpPerCycle: 360,  ticksNeeded: 60  },
  { id: 'alchemist',   name: 'Alchemist\'s Aid',   desc: 'Assist a master alchemist.',          icon: '⚗️',  levelReq: 25, atkReq: 0,   goldPerCycle: 180,  xpPerCycle: 440,  ticksNeeded: 72  },
  { id: 'arena_fighter',name:'Arena Fighter',      desc: 'Fight in the gladiator arena.',       icon: '🏟️',  levelReq: 22, atkReq: 60,  goldPerCycle: 160,  xpPerCycle: 400,  ticksNeeded: 66  },
  { id: 'scholar',     name: 'Scholar',            desc: 'Teach at the academy.',               icon: '📜',  levelReq: 28, atkReq: 0,   goldPerCycle: 200,  xpPerCycle: 520,  ticksNeeded: 80  },
  { id: 'enchanter',   name: 'Enchanter',          desc: 'Imbue items with magic.',             icon: '✨',  levelReq: 30, atkReq: 0,   goldPerCycle: 240,  xpPerCycle: 600,  ticksNeeded: 88  },
  // Tier 5 — Elite (Lv 35-49)
  { id: 'assassin',    name: 'Assassin',           desc: 'High-risk, high-reward shadow work.', icon: '🗡️',  levelReq: 30, atkReq: 80,  goldPerCycle: 320,  xpPerCycle: 720,  ticksNeeded: 100 },
  { id: 'spymaster',   name: 'Spymaster',          desc: 'Run an intelligence network.',        icon: '🕵️',  levelReq: 38, atkReq: 0,   goldPerCycle: 450,  xpPerCycle: 960,  ticksNeeded: 120 },
  { id: 'dungeon_lord', name:'Dungeon Lord',        desc: 'Command a dungeon of monsters.',      icon: '🏰',  levelReq: 40, atkReq: 100, goldPerCycle: 520,  xpPerCycle: 1120, ticksNeeded: 130 },
  { id: 'runesmith',   name: 'Runesmith',          desc: 'Carve ancient runes for power.',      icon: '🔮',  levelReq: 42, atkReq: 0,   goldPerCycle: 580,  xpPerCycle: 1200, ticksNeeded: 140 },
  // Tier 6 — Legendary (Lv 50+)
  { id: 'warlord',     name: 'Warlord',            desc: 'Lead armies into battle.',            icon: '👑',  levelReq: 45, atkReq: 150, goldPerCycle: 700,  xpPerCycle: 1400, ticksNeeded: 160 },
  { id: 'archmage',    name: 'Archmage',           desc: 'Advise kings and shape destiny.',     icon: '🔮',  levelReq: 50, atkReq: 0,   goldPerCycle: 1200, xpPerCycle: 2000, ticksNeeded: 200 },
  { id: 'god_slayer',  name: 'God Slayer',         desc: 'Hunt divine beings for sport.',       icon: '⚡',  levelReq: 55, atkReq: 200, goldPerCycle: 2000, xpPerCycle: 3200, ticksNeeded: 240 },
  { id: 'void_walker', name: 'Void Walker',        desc: 'Traverse dimensions for profit.',     icon: '🌀',  levelReq: 60, atkReq: 0,   goldPerCycle: 3000, xpPerCycle: 4800, ticksNeeded: 280 },
];

function canDoJob(job) {
  const p = G.player;
  return p.level >= job.levelReq && p.atk >= job.atkReq;
}

function startJob(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job || !canDoJob(job)) return;
  if (G.activeJob === jobId) {
    G.activeJob = null;
    G.jobTick = 0;
    toast(`Stopped working as ${job.name}`, 'info');
  } else {
    // Cancel active training
    if (G.activeTraining) {
      G.activeTraining = null;
      G.trainingTick = 0;
      toast('Training stopped — can\'t train while working.', 'warn');
      renderTraining();
    }
    G.activeJob = jobId;
    G.jobTick = 0;
    if (!G.player.jobProgress) G.player.jobProgress = {};
    G.player.jobProgress[jobId] = 0;
    toast(`Started working as ${job.name}`, 'success');
  }
  renderJobs();
}

function quickJob(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job || !canDoJob(job)) return;
  quickJobMinigame(job, (mult) => {
    const goldMult = getUpgradeValue('job_gold_mult');
    const xpMult   = getUpgradeValue('job_xp_mult');
    const earned = gainGold(Math.floor(job.goldPerCycle * goldMult * mult));
    gainXP(Math.floor(job.xpPerCycle * xpMult));
    spawnFloatingText(`+${earned}g`, 'float-gold');
    toast(`Quick job: +${earned}g!`, 'success');
  });
}

function stopActiveJob() {
  if (!G.activeJob) return;
  const job = JOBS.find(j => j.id === G.activeJob);
  G.activeJob = null;
  G.jobTick = 0;
  if (job) toast(`Stopped working as ${job.name}`, 'info');
  renderJobs();
}

function tickJob(jobId) {
  const job = JOBS.find(j => j.id === jobId);
  if (!job) return;
  if (!G.player.jobProgress) G.player.jobProgress = {};
  if (!G.player.jobProgress[jobId]) G.player.jobProgress[jobId] = 0;

  G.player.jobProgress[jobId]++;
  if (G.player.jobProgress[jobId] >= job.ticksNeeded) {
    G.player.jobProgress[jobId] = 0;
    // Apply upgrade multipliers
    const goldMult = getUpgradeValue('job_gold_mult');
    const xpMult   = getUpgradeValue('job_xp_mult');
    const earned = gainGold(Math.floor(job.goldPerCycle * goldMult));
    gainXP(Math.floor(job.xpPerCycle * xpMult));
    spawnFloatingText(`+${earned}g`, 'float-gold');
  }
}

function updateJobBanner() {
  const banner = document.getElementById('job-banner');
  if (!banner) return;
  if (!G.activeJob) { banner.classList.add('hidden'); return; }
  const job = JOBS.find(j => j.id === G.activeJob);
  if (!job) return;
  banner.classList.remove('hidden');
  const progress = (G.player.jobProgress && G.player.jobProgress[G.activeJob]) || 0;
  const pct = Math.floor((progress / job.ticksNeeded) * 100);
  const cycleTime = (job.ticksNeeded * G.tickRate / 1000).toFixed(1);
  const goldMult = getUpgradeValue('job_gold_mult');
  const nameEl = document.getElementById('job-banner-name');
  const barEl  = document.getElementById('job-banner-bar');
  const earnEl = document.getElementById('job-banner-earn');
  if (nameEl) nameEl.textContent = `${job.icon} ${job.name}`;
  if (barEl)  barEl.style.width = pct + '%';
  if (earnEl) earnEl.textContent = `💰 ${Math.floor(job.goldPerCycle * goldMult)}/${cycleTime}s`;
}

function renderJobs() {
  const container = document.getElementById('jobs-list');
  if (!container) return;
  const p = G.player;
  const goldMult = getUpgradeValue('job_gold_mult');
  const speedMult = getUpgradeValue('job_speed_mult');

  // Show active multipliers if any upgrades bought
  const multBanner = document.getElementById('jobs-mult-banner');
  if (multBanner) {
    if (goldMult > 1 || speedMult < 1) {
      multBanner.textContent = `💰 Gold ×${goldMult.toFixed(2)} | ⚡ Speed ×${(1/speedMult).toFixed(2)}`;
      multBanner.classList.remove('hidden');
    } else {
      multBanner.classList.add('hidden');
    }
  }

  container.innerHTML = JOBS.map(job => {
    const unlocked = canDoJob(job);
    const active = G.activeJob === job.id;
    const progress = (p.jobProgress && p.jobProgress[job.id]) || 0;
    const pct = Math.floor((progress / job.ticksNeeded) * 100);
    const cycleTime = (job.ticksNeeded * G.tickRate / 1000).toFixed(1);
    const goldMult = getUpgradeValue('job_gold_mult');
    const goldDisplay = Math.floor(job.goldPerCycle * goldMult);

    return `
      <div class="card${active ? ' card-active' : ''}${!unlocked ? ' card-locked-dim' : ''}">
        <div class="card-top-row">
          <h3>${job.icon} ${job.name}${active ? ' <span class="active-dot">●</span>' : ''}</h3>
          ${active ? `<span class="job-cycle-badge">${cycleTime}s cycle</span>` : ''}
        </div>
        <div class="card-desc">${job.desc}</div>
        <div class="card-stats">
          <span class="highlight">💰 ${goldDisplay} / cycle</span>
          <span>⏱ ${cycleTime}s</span>
          ${job.atkReq > 0 ? `<span>⚔️ ${job.atkReq} ATK</span>` : ''}
        </div>
        ${active ? `<div class="progress-bar-wrap"><div class="bar-track"><div id="job-progress-bar-${job.id}" class="bar gold-bar" style="width:${pct}%"></div></div></div>` : ''}
        ${unlocked
          ? `<div style="display:flex;gap:6px;flex-wrap:wrap">
               <button class="btn-primary${active ? ' btn-stop' : ''}" onclick="startJob('${job.id}')">${active ? '■ Stop' : '▶ Work'}</button>
               ${!active ? `<button class="btn-small" onclick="quickJob('${job.id}')" title="Do one cycle instantly with a minigame">⚡ Quick</button>` : ''}
             </div>`
          : `<div class="card-locked">🔒 Lv.${job.levelReq}${job.atkReq > 0 ? ` / ${job.atkReq} ATK` : ''}</div>`
        }
      </div>
    `;
  }).join('');
}
