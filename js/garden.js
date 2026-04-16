// ===== GARDEN — Plant stages, watering, care =====

const GARDEN_COLS = 3;
const GARDEN_ROWS = 3;
const WATER_MAX = 5;
const WATER_REGEN_TICKS = 80;

// ── GARDEN UPGRADES ──
const GARDEN_UPGRADES = [
  { id: 'g_plots',    name: 'Extra Plots',      icon: '🟫', desc: '+3 extra garden plots.',           baseCost: 200,  costMult: 2.5, maxLevel: 3 },
  { id: 'g_water',    name: 'Bigger Bucket',    icon: '🪣', desc: '+2 max water charges.',            baseCost: 150,  costMult: 2.0, maxLevel: 4 },
  { id: 'g_speed',    name: 'Fertilizer',       icon: '🌱', desc: 'Plants grow 20% faster.',          baseCost: 250,  costMult: 2.2, maxLevel: 5 },
  { id: 'g_yield',    name: 'Rich Soil',        icon: '🌍', desc: '+1 extra yield per harvest.',      baseCost: 300,  costMult: 2.0, maxLevel: 4 },
  { id: 'g_wilt',     name: 'Drought Resist',   icon: '☀️', desc: 'Plants take 50% longer to wilt.', baseCost: 200,  costMult: 1.8, maxLevel: 3 },
  { id: 'g_water_regen', name: 'Rain Collector',icon: '🌧️', desc: 'Bucket refills 35% faster per level.',baseCost: 180,  costMult: 2.0, maxLevel: 5 },
];

function getGardenUpgradeLevel(id) {
  return (G.player.shopPurchases && G.player.shopPurchases[id]) || 0;
}
function getGardenUpgradeCost(upg) {
  return Math.floor(upg.baseCost * Math.pow(upg.costMult, getGardenUpgradeLevel(upg.id)));
}
function buyGardenUpgrade(id) {
  const upg = GARDEN_UPGRADES.find(u => u.id === id);
  if (!upg) return;
  const owned = getGardenUpgradeLevel(id);
  if (owned >= upg.maxLevel) { toast('Already maxed!', 'warn'); return; }
  const cost = getGardenUpgradeCost(upg);
  if (!spendGold(cost)) { toast('Not enough gold!', 'warn'); return; }
  if (!G.player.shopPurchases) G.player.shopPurchases = {};
  G.player.shopPurchases[id] = owned + 1;
  // Expand plots array if needed
  if (id === 'g_plots') {
    while (G.player.gardenPlots.length < getMaxGardenPlots()) G.player.gardenPlots.push(null);
  }
  toast(`Upgraded: ${upg.name}!`, 'success');
  spawnFloatingText(`-${cost}g`, 'float-dmg');
  renderGarden();
}

function getMaxGardenPlots() {
  return GARDEN_COLS * GARDEN_ROWS + getGardenUpgradeLevel('g_plots') * 3;
}
function getMaxWaterCharges() {
  return WATER_MAX + getGardenUpgradeLevel('g_water') * 2;
}
function getGardenSpeedMult() {
  return Math.max(0.2, 1 - getGardenUpgradeLevel('g_speed') * 0.2);
}
function getGardenYieldBonus() {
  return getGardenUpgradeLevel('g_yield');
}
function getGardenWiltMult() {
  return 1 + getGardenUpgradeLevel('g_wilt') * 0.5;
}
function getWaterRegenRate() {
  return Math.max(10, Math.floor(WATER_REGEN_TICKS * Math.pow(0.65, getGardenUpgradeLevel('g_water_regen'))));
}

const SEEDS = [
  { id: 'herb_seed',       name: 'Herb Seed',        icon: '🌿', yields: 'herb',         yieldCount: [2,4], growTicks: 120,  waterInterval: 60,  cost: 5,   levelReq: 1,  stages: ['🌱','🌿','🌿','🌿','🌿'] },
  { id: 'mushroom_seed',   name: 'Mushroom Spore',   icon: '🍄', yields: 'mushroom',     yieldCount: [2,3], growTicks: 160,  waterInterval: 80,  cost: 8,   levelReq: 1,  stages: ['🌱','🟤','🍄','🍄','🍄'] },
  { id: 'strawberry_seed', name: 'Starberry Seed',   icon: '🍓', yields: 'strawberry',   yieldCount: [2,4], growTicks: 140,  waterInterval: 50,  cost: 10,  levelReq: 2,  stages: ['🌱','🌱','🌸','🍓','🍓'] },
  { id: 'sunflower_seed',  name: 'Sunpetal Seed',    icon: '🌻', yields: 'sunflower',    yieldCount: [1,3], growTicks: 200,  waterInterval: 70,  cost: 15,  levelReq: 3,  stages: ['🌱','🌱','🌼','🌻','🌻'] },
  { id: 'mint_seed',       name: 'Frost Mint Seed',  icon: '🌱', yields: 'mint_leaf',    yieldCount: [2,4], growTicks: 180,  waterInterval: 60,  cost: 12,  levelReq: 3,  stages: ['🌱','🌱','🌿','🌿','❄️'] },
  { id: 'frost_seed',      name: 'Frost Bloom Seed', icon: '❄️', yields: 'frost_bloom',  yieldCount: [1,2], growTicks: 320,  waterInterval: 100, cost: 30,  levelReq: 8,  stages: ['🌱','🌱','🌸','❄️','❄️'] },
  { id: 'thunder_seed',    name: 'Thunder Root',     icon: '⚡', yields: 'thunder_root', yieldCount: [1,2], growTicks: 400,  waterInterval: 120, cost: 50,  levelReq: 12, stages: ['🌱','🌱','🌿','⚡','⚡'] },
  { id: 'crystal_seed',    name: 'Crystal Seed',     icon: '💠', yields: 'crystal_dust', yieldCount: [1,2], growTicks: 500,  waterInterval: 140, cost: 80,  levelReq: 18, stages: ['🌱','🌱','💎','💠','💠'] },
  { id: 'starlight_seed',  name: 'Starlight Seed',   icon: '⭐', yields: 'starlight',    yieldCount: [1,2], growTicks: 700,  waterInterval: 160, cost: 150, levelReq: 28, stages: ['🌱','🌱','✨','⭐','⭐'] },
  { id: 'phoenix_seed',    name: 'Phoenix Seed',     icon: '🦅', yields: 'phoenix_ash',  yieldCount: [1,1], growTicks: 1000, waterInterval: 200, cost: 300, levelReq: 40, stages: ['🌱','🌱','🔥','🦅','🦅'] },
];

// ── GARDEN VFX ──
function gardenVFX(type, plotIndex) {
  const cell = document.querySelector(`.garden-cell:nth-child(${plotIndex + 1})`);
  const rect = cell ? cell.getBoundingClientRect() : null;
  const cx = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const cy = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;

  const configs = {
    water:   { colors: ['#29b6f6','#81d4fa','#b3e5fc','#fff'], count: 12, spread: 40, emoji: '💧' },
    plant:   { colors: ['#66bb6a','#a5d6a7','#fff9c4','#fff'], count: 10, spread: 35, emoji: '🌱' },
    harvest: { colors: ['#ffca28','#ffd54f','#fff9c4','#a5d6a7','#fff'], count: 18, spread: 55, emoji: '🌾' },
    wilt:    { colors: ['#8d6e63','#a1887f','#fff'], count: 8, spread: 30, emoji: '🥀' },
    revive:  { colors: ['#66bb6a','#29b6f6','#fff'], count: 14, spread: 45, emoji: '💚' },
  };
  const cfg = configs[type] || configs.water;

  for (let i = 0; i < cfg.count; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i / cfg.count) + Math.random() * 0.8;
    const dist = cfg.spread * (0.4 + Math.random() * 0.8);
    const size = 3 + Math.random() * 5;
    const color = cfg.colors[Math.floor(Math.random() * cfg.colors.length)];
    p.style.cssText = `position:fixed;z-index:9998;pointer-events:none;border-radius:50%;
      width:${size}px;height:${size}px;background:${color};
      left:${cx}px;top:${cy}px;
      --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
      animation:digBurst 0.5s ease-out forwards;animation-delay:${Math.random()*0.08}s;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }

  // Floating emoji
  const el = document.createElement('div');
  el.textContent = cfg.emoji;
  el.style.cssText = `position:fixed;z-index:9999;pointer-events:none;font-size:22px;
    left:${cx - 11}px;top:${cy - 10}px;animation:floatUp 0.8s ease-out forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 900);
}


function getGardenPlots() {
  if (!G.player.gardenPlots) G.player.gardenPlots = [];
  const maxPlots = getMaxGardenPlots();
  while (G.player.gardenPlots.length < maxPlots) G.player.gardenPlots.push(null);
  return G.player.gardenPlots;
}

function getWaterCharges() {
  if (G.player.waterCharges === undefined) G.player.waterCharges = WATER_MAX;
  return G.player.waterCharges;
}

function tickGarden() {
  const plots = getGardenPlots();
  const p = G.player;

  // Water regen — uses upgrade-modified rate
  if (p.waterCharges === undefined) p.waterCharges = getMaxWaterCharges();
  const maxWater = getMaxWaterCharges();
  if (!p.waterRegenTick) p.waterRegenTick = 0;
  if (p.waterCharges < maxWater) {
    p.waterRegenTick++;
    if (p.waterRegenTick >= getWaterRegenRate()) {
      p.waterRegenTick = 0;
      p.waterCharges = Math.min(maxWater, p.waterCharges + 1);
    }
  }

  let anyReady = false;
  plots.forEach((plot, i) => {
    if (!plot || plot.ready) return;
    const seed = SEEDS.find(s => s.id === plot.seedId);
    if (!seed) return;

    const elapsed = G.tickCount - plot.plantedTick;
    const stageThreshold = seed.growTicks / 4; // 4 growth stages

    // Check wilting: if not watered in time (wilt resistance upgrade)
    const ticksSinceWater = G.tickCount - (plot.lastWateredTick || plot.plantedTick);
    if (ticksSinceWater > seed.waterInterval * getGardenWiltMult() && plot.stage > 0 && !plot.wilted) {
      plot.wilted = true;
    }

    // Grow if not wilted — speed upgrade makes it faster
    if (!plot.wilted) {
      const effectiveGrowTicks = Math.floor(seed.growTicks * getGardenSpeedMult());
      const stageThreshold = effectiveGrowTicks / 4;
      const newStage = Math.min(4, Math.floor(elapsed / stageThreshold));
      if (newStage > plot.stage) {
        plot.stage = newStage;
        if (newStage === 4) {
          plot.ready = true;
          anyReady = true;
        }
      }
    }
  });

  if (anyReady) toast('🌾 A plant is ready to harvest!', 'success');
}

function waterPlot(plotIndex) {
  const p = G.player;
  if (p.waterCharges === undefined) p.waterCharges = WATER_MAX;
  if (p.waterCharges <= 0) { toast('No water charges! Wait for regen.', 'warn'); return; }
  const plots = getGardenPlots();
  const plot = plots[plotIndex];
  if (!plot) { toast('Nothing to water here!', 'warn'); return; }
  if (plot.ready) { toast('Already fully grown!', 'info'); return; }

  // Watering minigame — timing game, hit the zone to water well
  showMinigame('timing', 1, '💧 Water the plant — hit the zone!', (mult) => {
    p.waterCharges--;
    plot.lastWateredTick = G.tickCount;
    playSound('waterplant', 0.8);
    if (plot.wilted) {
      plot.wilted = false;
      gardenVFX('revive', plotIndex);
      toast('💧 Plant revived!', 'success');
    } else if (mult >= 1.8) {
      plot.plantedTick = Math.max(0, plot.plantedTick - 20);
      gardenVFX('water', plotIndex);
      toast('💧 Perfect watering! Growth boosted!', 'success');
    } else {
      gardenVFX('water', plotIndex);
      toast('💧 Watered!', 'info');
    }
    renderGarden();
  });
}

function harvestPlot(plotIndex) {
  const plots = getGardenPlots();
  const plot = plots[plotIndex];
  if (!plot || !plot.ready) return;
  const seed = SEEDS.find(s => s.id === plot.seedId);
  if (!seed) return;
  const count = seed.yieldCount[0] + Math.floor(Math.random() * (seed.yieldCount[1] - seed.yieldCount[0] + 1)) + getGardenYieldBonus();
  addIngredient(seed.yields, count);
  const ing = ALCHEMY_INGREDIENTS.find(i => i.id === seed.yields);
  gainXP(count * 20);
  gardenVFX('harvest', plotIndex);
  toast(`🌾 Harvested ${count}x ${ing ? ing.name : seed.yields}!`, 'success');
  spawnFloatingText(`+${count} ${ing?.icon || '🌿'}`, 'float-xp');
  const p = G.player;
  if (typeof p._harvestCount === 'number') p._harvestCount++; else p._harvestCount = 1;
  plots[plotIndex] = null;
  renderGarden();
}

function plantSeed(plotIndex, seedId) {
  const seed = SEEDS.find(s => s.id === seedId);
  if (!seed) return;
  const p = G.player;
  if (p.level < seed.levelReq) { toast(`Requires level ${seed.levelReq}`, 'warn'); return; }
  if (!spendGold(seed.cost)) { toast('Not enough gold!', 'warn'); return; }
  const plots = getGardenPlots();
  if (plots[plotIndex] !== null) { toast('Plot already occupied!', 'warn'); return; }
  plots[plotIndex] = {
    seedId,
    plantedTick: G.tickCount,
    lastWateredTick: G.tickCount,
    stage: 0,
    wilted: false,
    ready: false,
  };
  toast(`Planted ${seed.icon} ${seed.name}!`, 'success');
  gardenVFX('plant', plotIndex);
  selectedSeed = null;
  renderGarden();
}

function removePlot(plotIndex) {
  const plots = getGardenPlots();
  plots[plotIndex] = null;
  renderGarden();
}

function updateGardenTimers() {
  const plots = getGardenPlots();
  const p = G.player;
  plots.forEach((plot, i) => {
    if (!plot) return;
    const seed = SEEDS.find(s => s.id === plot.seedId);
    if (!seed) return;
    const timerEl = document.getElementById(`plot-timer-${i}`);
    const fillEl  = document.getElementById(`plot-fill-${i}`);
    const stageEl = document.getElementById(`plot-stage-${i}`);
    if (plot.ready) {
      if (timerEl) timerEl.textContent = '✅ Ready!';
      if (fillEl)  fillEl.style.width = '100%';
      return;
    }
    if (plot.wilted) {
      if (timerEl) timerEl.textContent = '🥀 Wilted!';
      return;
    }
    const elapsed = G.tickCount - plot.plantedTick;
    const pct = Math.min(100, Math.floor((elapsed / seed.growTicks) * 100));
    const ticksLeft = seed.growTicks - elapsed;
    const secsLeft = Math.ceil(ticksLeft * G.tickRate / 1000);
    if (timerEl) timerEl.textContent = secsLeft > 60 ? `${Math.ceil(secsLeft/60)}m` : `${secsLeft}s`;
    if (fillEl)  fillEl.style.width = pct + '%';
    if (stageEl) stageEl.textContent = seed.stages[plot.stage] || '🌱';
  });

  // Water charges timer
  const waterTimerEl = document.getElementById('water-timer');
  const maxWater = getMaxWaterCharges();
  if (waterTimerEl && p.waterCharges < maxWater) {
    const secsLeft = Math.ceil((getWaterRegenRate() - (p.waterRegenTick||0)) * G.tickRate / 1000);
    waterTimerEl.textContent = `Next in ${secsLeft}s`;
  } else if (waterTimerEl) {
    waterTimerEl.textContent = 'Full';
  }
}

let selectedSeed = null;

function selectSeed(seedId) {
  selectedSeed = selectedSeed === seedId ? null : seedId;
  renderGarden();
}

function clickPlot(plotIndex) {
  const plots = getGardenPlots();
  const plot = plots[plotIndex];
  if (plot && plot.ready) { harvestPlot(plotIndex); return; }
  if (plot && plot.wilted) { toast('💧 Water this plant to revive it!', 'warn'); return; }
  if (plot) { toast('Still growing... water it to help!', 'info'); return; }
  if (!selectedSeed) { toast('Select a seed first!', 'warn'); return; }
  plantSeed(plotIndex, selectedSeed);
}

function renderGarden() {
  const container = document.getElementById('garden-container');
  if (!container) return;
  const p = G.player;

  if (p.level < 10) {
    container.innerHTML = `<div class="locked-section"><div class="locked-icon">🌱</div><h3>Garden Locked</h3><p>Reach <strong>Level 10</strong> to unlock the Garden.</p></div>`;
    return;
  }

  const plots = getGardenPlots();
  const waterCharges = p.waterCharges !== undefined ? p.waterCharges : WATER_MAX;

  // Build plot grid
  const plotsHtml = plots.map((plot, i) => {
    if (!plot) {
      const hint = selectedSeed ? 'Click to plant' : '+ Empty';
      return `<div class="garden-cell empty${selectedSeed ? ' plantable' : ''}" onclick="clickPlot(${i})">
        <div class="garden-cell-icon">🟫</div>
        <div class="garden-cell-hint">${hint}</div>
      </div>`;
    }
    const seed = SEEDS.find(s => s.id === plot.seedId);
    const elapsed = G.tickCount - plot.plantedTick;
    const pct = Math.min(100, Math.floor((elapsed / (seed?.growTicks || 1)) * 100));
    const stageIcon = seed?.stages[plot.stage] || '🌱';
    const secsLeft = seed ? Math.ceil((seed.growTicks - elapsed) * G.tickRate / 1000) : 0;
    const timeStr = plot.ready ? '✅ Ready!' : plot.wilted ? '🥀 Wilted!' : secsLeft > 60 ? `${Math.ceil(secsLeft/60)}m` : `${secsLeft}s`;
    const cellClass = plot.ready ? 'ready' : plot.wilted ? 'wilted' : 'growing';

    return `<div class="garden-cell ${cellClass}" onclick="clickPlot(${i})">
      <div class="garden-cell-icon" id="plot-stage-${i}">${stageIcon}</div>
      <div class="garden-cell-name">${seed?.name || '?'}</div>
      <div class="garden-cell-timer" id="plot-timer-${i}">${timeStr}</div>
      <div class="garden-cell-bar"><div class="garden-cell-fill" id="plot-fill-${i}" style="width:${pct}%"></div></div>
      <div class="garden-cell-actions">
        <button class="garden-btn water-btn" onclick="event.stopPropagation();waterPlot(${i})" title="Water">💧</button>
        <button class="garden-btn remove-btn" onclick="event.stopPropagation();removePlot(${i})" title="Remove">✕</button>
      </div>
    </div>`;
  }).join('');

  // Seed selector
  const seedsHtml = SEEDS.map(seed => {
    const locked  = p.level < seed.levelReq;
    const active  = selectedSeed === seed.id;
    return `<div class="seed-item${active ? ' seed-selected' : ''}${locked ? ' seed-locked' : ''}"
      onclick="${locked ? '' : `selectSeed('${seed.id}')`}">
      <span class="seed-item-icon">${seed.icon}</span>
      <div class="seed-item-info">
        <div class="seed-item-name">${seed.name}</div>
        <div class="seed-item-meta">💰${seed.cost}g · Lv.${seed.levelReq}</div>
      </div>
    </div>`;
  }).join('');

  const maxWater = getMaxWaterCharges();
  const upgradesHtml = GARDEN_UPGRADES.map(upg => {
    const owned = getGardenUpgradeLevel(upg.id);
    const maxed = owned >= upg.maxLevel;
    const cost = getGardenUpgradeCost(upg);
    const canBuy = !maxed && p.gold >= cost;
    return `<div class="dig-upg-card${maxed ? ' dig-upg-maxed' : ''}">
      <div class="dig-upg-top">
        <span class="dig-upg-icon">${upg.icon}</span>
        <div class="dig-upg-info">
          <div class="dig-upg-name">${upg.name}</div>
          <div class="dig-upg-desc">${upg.desc}</div>
        </div>
      </div>
      <div class="dig-upg-bottom">
        <div class="dig-upg-pips">${Array.from({length: upg.maxLevel}, (_,i) =>
          `<div class="dig-upg-pip${i < owned ? ' pip-owned' : ''}"></div>`).join('')}</div>
        ${maxed
          ? `<span class="dig-upg-maxed-txt">✓ Max</span>`
          : `<button class="btn-small dig-upg-btn" onclick="buyGardenUpgrade('${upg.id}')" ${canBuy ? '' : 'disabled'}>💰${cost}</button>`
        }
      </div>
    </div>`;
  }).join('');

  container.innerHTML = `
    <div class="garden-layout">
      <div class="garden-main">
        <div class="garden-toolbar">
          <div class="water-display">
            💧 <strong>${waterCharges}/${maxWater}</strong>
            <span class="water-timer" id="water-timer"></span>
          </div>
          ${selectedSeed ? `<div class="selected-seed-badge">🌱 ${SEEDS.find(s=>s.id===selectedSeed)?.name} selected — click a plot</div>` : ''}
        </div>
        <div class="garden-grid-wrap">
          <div class="garden-grid">${plotsHtml}</div>
        </div>
        <div class="garden-legend">
          <span>🟫 Empty</span><span>🌱 Seed</span><span>🌿 Growing</span><span>✅ Ready</span><span>🥀 Wilted (needs water)</span>
        </div>
      </div>
      <div class="garden-sidebar">
        <h3>🌰 Seeds</h3>
        <p style="font-size:11px;color:var(--dim);margin-bottom:8px">Select a seed, then click a plot to plant.</p>
        <div class="seed-list">${seedsHtml}</div>
        <h3 style="margin-top:16px">⬆️ Garden Upgrades</h3>
        <div class="garden-upgrades-list">${upgradesHtml}</div>
      </div>
    </div>`;
}
