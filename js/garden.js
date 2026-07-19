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
  showMinigame('water_drop', 1, '💧 Water the plant — time your splash!', (mult) => {
    p.waterCharges--;
    plot.lastWateredTick = G.tickCount;
    playSound('waterplant', 0.3);
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
      if (timerEl) timerEl.textContent = 'Ready!';
      if (fillEl)  fillEl.style.width = '100%';
      return;
    }
    if (plot.wilted) {
      if (timerEl) timerEl.textContent = 'Wilted!';
      return;
    }
    const elapsed = G.tickCount - plot.plantedTick;
    const effectiveGrowTicks = Math.floor(seed.growTicks * getGardenSpeedMult());
    const pct = Math.min(100, Math.floor((elapsed / effectiveGrowTicks) * 100));
    const ticksLeft = effectiveGrowTicks - elapsed;
    const secsLeft = Math.max(0, Math.ceil(ticksLeft * G.tickRate / 1000));
    if (timerEl) timerEl.textContent = secsLeft > 3600 ? `${Math.ceil(secsLeft/3600)}h` : secsLeft > 60 ? `${Math.ceil(secsLeft/60)}m` : `${secsLeft}s`;
    if (fillEl)  fillEl.style.width = pct + '%';
    if (stageEl) stageEl.textContent = seed.stages[plot.stage] || '\u{1F331}';
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

const RARITY_ORDER_G = { common: 0, uncommon: 1, rare: 2, legendary: 3 };

function _injectGardenCSS() {
  if (document.getElementById('garden-rework-css')) return;
  const s = document.createElement('style');
  s.id = 'garden-rework-css';
  s.textContent = `
.garden-wrap{display:flex;flex-direction:column;gap:20px}
.garden-sec{display:flex;flex-direction:column;gap:8px}
.garden-sec-title{font-size:15px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px}
.garden-sec-title span{font-size:12px;color:var(--dim);font-weight:400}
.garden-water-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--card);border:1px solid var(--border);border-radius:10px}
.garden-water-icon{font-size:20px}
.garden-water-text{font-size:13px;font-weight:700;color:var(--text)}
.garden-water-pips{display:flex;gap:4px;flex:1}
.garden-water-pip{width:20px;height:8px;border-radius:4px;background:rgba(255,255,255,0.06);border:1px solid var(--border);transition:all 0.2s}
.garden-water-pip.filled{background:linear-gradient(135deg,#29b6f6,#81d4fa);border-color:#29b6f6}
.garden-water-timer{font-size:11px;color:var(--dim);white-space:nowrap}
.garden-seed-badge{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(39,174,96,0.1);border:1px solid rgba(39,174,96,0.3);border-radius:6px;font-size:12px;color:var(--ok);font-weight:600}
.garden-plot-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
@media(max-width:900px){.garden-plot-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:560px){.garden-plot-grid{grid-template-columns:repeat(2,1fr)}}
.garden-plot{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;transition:all 0.15s;position:relative;min-height:120px}
.garden-plot:hover{background:var(--card-h);border-color:var(--border-h);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.3)}
.garden-plot.ready{border-color:var(--ok);background:rgba(39,174,96,0.06)}
.garden-plot.ready:hover{border-color:var(--ok)}
.garden-plot.wilted{border-color:var(--warn);background:rgba(230,126,34,0.06);opacity:0.7}
.garden-plot-icon{font-size:32px;line-height:1}
.garden-plot-name{font-size:11px;font-weight:600;color:var(--text);text-align:center}
.garden-plot-status{font-size:10px;color:var(--dim)}
.garden-plot-bar{width:100%;height:6px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden}
.garden-plot-fill{height:100%;border-radius:99px;transition:width 0.4s ease;background:linear-gradient(90deg,#66bb6a,#a5d6a7)}
.garden-plot-fill.wilted{background:linear-gradient(90deg,#8d6e63,#a1887f)}
.garden-plot-fill.ready{background:linear-gradient(90deg,#66bb6a,#27ae60);width:100%!important}
.garden-plot-actions{display:flex;gap:4px;margin-top:auto}
.garden-plot-btn{background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:6px;padding:4px 8px;cursor:pointer;font-size:11px;transition:all 0.15s}
.garden-plot-btn:hover{border-color:var(--accent);background:rgba(255,255,255,0.08)}
.garden-plot-btn.water-btn:hover{border-color:#29b6f6;background:rgba(41,182,246,0.1)}
.garden-plot-btn.remove-btn:hover{border-color:var(--danger);background:rgba(231,76,60,0.1);color:var(--danger)}
.garden-plot-empty{border-style:dashed;opacity:0.5;justify-content:center}
.garden-plot-empty.has-seed{opacity:0.8;border-color:rgba(39,174,96,0.3)}
.garden-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:11px;color:var(--dim);padding:8px 0}
.garden-legend span{display:flex;align-items:center;gap:4px}
.garden-seed-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
.garden-seed-card{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--card);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:all 0.15s}
.garden-seed-card:hover{border-color:var(--border-h);background:var(--card-h)}
.garden-seed-card.active{border-color:var(--accent);background:rgba(108,159,255,0.08);box-shadow:0 0 8px rgba(108,159,255,0.15)}
.garden-seed-card.locked{opacity:0.35;cursor:not-allowed;pointer-events:none}
.garden-seed-icon{font-size:22px}
.garden-seed-info{flex:1;min-width:0}
.garden-seed-name{font-size:12px;font-weight:700;color:var(--text)}
.garden-seed-meta{font-size:10px;color:var(--dim)}
.garden-upg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.garden-upg-card{padding:12px;background:var(--card);border:1px solid var(--border);border-radius:8px;display:flex;flex-direction:column;gap:6px;transition:border-color 0.15s}
.garden-upg-card.maxed{border-color:var(--ok)}
.garden-upg-top{display:flex;align-items:center;gap:8px}
.garden-upg-icon{font-size:20px}
.garden-upg-name{font-size:12px;font-weight:700;color:var(--text)}
.garden-upg-desc{font-size:10px;color:var(--dim)}
.garden-upg-pips{display:flex;gap:3px}
.garden-upg-pip{width:10px;height:4px;border-radius:2px;background:rgba(255,255,255,0.06);border:1px solid var(--border)}
.garden-upg-pip.owned{background:var(--accent);border-color:var(--accent)}
.garden-upg-bottom{display:flex;align-items:center;justify-content:space-between}
.garden-upg-maxed{font-size:11px;color:var(--ok)}
`;
  document.head.appendChild(s);
}

function _plotGrowthPct(plot) {
  if (!plot) return 0;
  const seed = SEEDS.find(s => s.id === plot.seedId);
  if (!seed) return 0;
  if (plot.ready) return 100;
  const elapsed = G.tickCount - plot.plantedTick;
  const effectiveGrowTicks = Math.floor(seed.growTicks * getGardenSpeedMult());
  return Math.min(100, Math.floor((elapsed / effectiveGrowTicks) * 100));
}

function _plotTimeLeft(plot) {
  if (!plot) return '';
  const seed = SEEDS.find(s => s.id === plot.seedId);
  if (!seed) return '';
  if (plot.ready) return 'Ready!';
  if (plot.wilted) return 'Wilted!';
  const elapsed = G.tickCount - plot.plantedTick;
  const effectiveGrowTicks = Math.floor(seed.growTicks * getGardenSpeedMult());
  const ticksLeft = effectiveGrowTicks - elapsed;
  const secsLeft = Math.max(0, Math.ceil(ticksLeft * G.tickRate / 1000));
  if (secsLeft > 3600) return Math.ceil(secsLeft / 3600) + 'h';
  if (secsLeft > 60) return Math.ceil(secsLeft / 60) + 'm';
  return secsLeft + 's';
}

function _renderPlotCell(plot, i) {
  if (!plot) {
    const hasSeed = !!selectedSeed;
    return '<div class="garden-plot garden-plot-empty' + (hasSeed ? ' has-seed' : '') + '" onclick="clickPlot(' + i + ')">' +
      '<span class="garden-plot-icon">\u{1FAB4}</span>' +
      '<span class="garden-plot-status">' + (hasSeed ? 'Click to plant' : 'Empty') + '</span>' +
    '</div>';
  }

  const seed = SEEDS.find(s => s.id === plot.seedId);
  const stageIcon = seed ? seed.stages[plot.stage] || '\u{1F331}' : '\u{1F331}';
  const pct = _plotGrowthPct(plot);
  const timeStr = _plotTimeLeft(plot);
  const cls = plot.ready ? ' ready' : plot.wilted ? ' wilted' : '';

  let html = '<div class="garden-plot' + cls + '" onclick="clickPlot(' + i + ')">';
  html += '<span class="garden-plot-icon" id="plot-stage-' + i + '">' + stageIcon + '</span>';
  html += '<span class="garden-plot-name">' + (seed ? seed.name : '?') + '</span>';
  html += '<span class="garden-plot-status" id="plot-timer-' + i + '">' +
    (plot.ready ? 'Ready!' : plot.wilted ? 'Wilted!' : timeStr) + '</span>';
  html += '<div class="garden-plot-bar"><div class="garden-plot-fill' + (plot.wilted ? ' wilted' : plot.ready ? ' ready' : '') +
    '" id="plot-fill-' + i + '" style="width:' + (plot.ready ? '100' : pct) + '%"></div></div>';
  html += '<div class="garden-plot-actions">';
  html += '<button class="garden-plot-btn water-btn" onclick="event.stopPropagation();waterPlot(' + i + ')" title="Water">\u{1F4A7}</button>';
  html += '<button class="garden-plot-btn remove-btn" onclick="event.stopPropagation();removePlot(' + i + ')" title="Remove">\u2715</button>';
  html += '</div></div>';
  return html;
}

function _renderSeedGrid() {
  const p = G.player;
  return '<div class="garden-seed-grid">' + SEEDS.map(seed => {
    const locked = p.level < seed.levelReq;
    const active = selectedSeed === seed.id;
    let cls = 'garden-seed-card';
    if (active) cls += ' active';
    if (locked) cls += ' locked';
    return '<div class="' + cls + '" onclick="' + (locked ? '' : "selectSeed('" + seed.id + "')") + '">' +
      '<span class="garden-seed-icon">' + seed.icon + '</span>' +
      '<div class="garden-seed-info">' +
        '<div class="garden-seed-name">' + seed.name + '</div>' +
        '<div class="garden-seed-meta">\u{1F4B0}' + seed.cost + 'g \u00B7 Lv.' + seed.levelReq + '</div>' +
      '</div>' +
    '</div>';
  }).join('') + '</div>';
}

function _renderUpgradeGrid() {
  const p = G.player;
  return '<div class="garden-upg-grid">' + GARDEN_UPGRADES.map(upg => {
    const owned = getGardenUpgradeLevel(upg.id);
    const maxed = owned >= upg.maxLevel;
    const cost = getGardenUpgradeCost(upg);
    const canBuy = !maxed && p.gold >= cost;
    let html = '<div class="garden-upg-card' + (maxed ? ' maxed' : '') + '">';
    html += '<div class="garden-upg-top">';
    html += '<span class="garden-upg-icon">' + upg.icon + '</span>';
    html += '<div><div class="garden-upg-name">' + upg.name + '</div>';
    html += '<div class="garden-upg-desc">' + upg.desc + '</div></div>';
    html += '</div>';
    html += '<div class="garden-upg-bottom">';
    html += '<div class="garden-upg-pips">';
    for (let j = 0; j < upg.maxLevel; j++) {
      html += '<div class="garden-upg-pip' + (j < owned ? ' owned' : '') + '"></div>';
    }
    html += '</div>';
    if (maxed) {
      html += '<span class="garden-upg-maxed">\u2713 Max</span>';
    } else {
      html += '<button class="btn-small" onclick="buyGardenUpgrade(\'' + upg.id + '\')" ' + (canBuy ? '' : 'disabled') + '>\u{1F4B0}' + cost + '</button>';
    }
    html += '</div></div>';
    return html;
  }).join('') + '</div>';
}

function renderGarden() {
  const container = document.getElementById('garden-container');
  if (!container) return;
  const p = G.player;

  if (p.level < 12) {
    container.innerHTML = '<div class="locked-section"><div class="locked-icon">\u{1F331}</div><h3>Garden Locked</h3><p>Reach <strong>Level 12</strong> to unlock the Garden.</p></div>';
    return;
  }

  _injectGardenCSS();

  const plots = getGardenPlots();
  const waterCharges = p.waterCharges !== undefined ? p.waterCharges : WATER_MAX;
  const maxWater = getMaxWaterCharges();

  const waterPips = [];
  for (let i = 0; i < maxWater; i++) {
    waterPips.push('<div class="garden-water-pip' + (i < waterCharges ? ' filled' : '') + '"></div>');
  }

  let waterTimerHtml = '';
  if (waterCharges < maxWater) {
    const secsLeft = Math.ceil((getWaterRegenRate() - (p.waterRegenTick || 0)) * G.tickRate / 1000);
    waterTimerHtml = '<span class="garden-water-timer" id="water-timer">Next in ' + secsLeft + 's</span>';
  } else {
    waterTimerHtml = '<span class="garden-water-timer" id="water-timer">Full</span>';
  }

  const plotsHtml = plots.map((plot, i) => _renderPlotCell(plot, i)).join('');
  const seedsHtml = _renderSeedGrid();
  const upgradesHtml = _renderUpgradeGrid();

  let selectedBadge = '';
  if (selectedSeed) {
    const sd = SEEDS.find(s => s.id === selectedSeed);
    selectedBadge = '<div class="garden-seed-badge">\u{1F331} ' + (sd ? sd.name : '') + ' selected \u2014 click a plot</div>';
  }

  let html = '<div class="garden-wrap">';

  html += '<div class="garden-sec">';
  html += '<div class="garden-water-bar">';
  html += '<span class="garden-water-icon">\u{1F4A7}</span>';
  html += '<span class="garden-water-text">' + waterCharges + '/' + maxWater + '</span>';
  html += '<div class="garden-water-pips">' + waterPips.join('') + '</div>';
  html += waterTimerHtml;
  html += '</div>';
  if (selectedBadge) html += selectedBadge;
  html += '</div>';

  html += '<div class="garden-sec">';
  html += '<div class="garden-sec-title">Plots</div>';
  html += '<div class="garden-plot-grid">' + plotsHtml + '</div>';
  html += '<div class="garden-legend">';
  html += '<span>\u{1FAB4} Empty</span><span>\u{1F331} Seed</span><span>\u{1F33F} Growing</span><span>Ready</span><span>Wilted (needs water)</span>';
  html += '</div></div>';

  html += '<div class="garden-sec">';
  html += '<div class="garden-sec-title">\u{1F330} Seeds <span>Select a seed, then click a plot</span></div>';
  html += seedsHtml;
  html += '</div>';

  html += '<div class="garden-sec">';
  html += '<div class="garden-sec-title">\u2B06\uFE0F Garden Upgrades</div>';
  html += upgradesHtml;
  html += '</div>';

  html += '</div>';

  container.innerHTML = html;
}
