// ===== DIG / EXCAVATION =====

const DIG_COLS = 8;
const DIG_ROWS = 6;

// ── DIG SITE UPGRADES ──
const DIG_UPGRADES = [
  { id: 'dig_cap',      name: 'Extra Charges',    icon: '⛏️', desc: '+2 max dig charges.',              baseCost: 150,  costMult: 2.2, maxLevel: 5,  apply: () => {} },
  { id: 'dig_speed',    name: 'Faster Regen',      icon: '⏱️', desc: 'Charges regen 25% faster.',        baseCost: 200,  costMult: 2.5, maxLevel: 4,  apply: () => {} },
  { id: 'dig_luck',     name: 'Lucky Pickaxe',     icon: '🍀', desc: '+15% chance to upgrade rarity.',   baseCost: 300,  costMult: 2.0, maxLevel: 5,  apply: () => {} },
  { id: 'dig_gold',     name: 'Gold Detector',     icon: '💰', desc: '+25% gold value from all finds.',  baseCost: 250,  costMult: 1.8, maxLevel: 5,  apply: () => {} },
  { id: 'dig_reveal',   name: 'Sonar Pulse',       icon: '📡', desc: 'Reveals 3 random tiles on new site.',baseCost: 400, costMult: 2.0, maxLevel: 3,  apply: () => {} },
  { id: 'dig_xp',       name: 'Scholar\'s Pick',   icon: '📚', desc: '+50% XP from excavation.',         baseCost: 180,  costMult: 1.9, maxLevel: 4,  apply: () => {} },
  { id: 'dig_size',     name: 'Wider Excavation',  icon: '🗺️', desc: '+8 extra tiles per site.',         baseCost: 500,  costMult: 2.5, maxLevel: 3,  apply: () => {} },
];

function getDigUpgradeLevel(id) {
  return (G.player.shopPurchases && G.player.shopPurchases[id]) || 0;
}

function getDigUpgradeCost(upg) {
  const owned = getDigUpgradeLevel(upg.id);
  return Math.floor(upg.baseCost * Math.pow(upg.costMult, owned));
}

function buyDigUpgrade(id) {
  const upg = DIG_UPGRADES.find(u => u.id === id);
  if (!upg) return;
  const owned = getDigUpgradeLevel(id);
  if (owned >= upg.maxLevel) { toast('Already maxed!', 'warn'); return; }
  const cost = getDigUpgradeCost(upg);
  if (!spendGold(cost)) { toast('Not enough gold!', 'warn'); return; }
  if (!G.player.shopPurchases) G.player.shopPurchases = {};
  G.player.shopPurchases[id] = owned + 1;
  toast(`Upgraded: ${upg.name} (Lv.${owned + 1})`, 'success');
  spawnFloatingText(`-${cost}g`, 'float-dmg');
  renderDigUpgrades();
}

function renderDigUpgrades() {
  const el = document.getElementById('dig-upgrades-list');
  if (!el) return;
  el.innerHTML = DIG_UPGRADES.map(upg => {
    const owned  = getDigUpgradeLevel(upg.id);
    const maxed  = owned >= upg.maxLevel;
    const cost   = getDigUpgradeCost(upg);
    const canBuy = !maxed && G.player.gold >= cost;
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
          : `<button class="btn-small dig-upg-btn" onclick="buyDigUpgrade('${upg.id}')" ${canBuy ? '' : 'disabled'}>💰${cost}</button>`
        }
      </div>
    </div>`;
  }).join('');
}

const DIG_LOOT_TABLE = [
  // Common
  { id: 'stone',         name: 'Stone',           icon: '🪨', rarity: 'common',    weight: 40, type: 'material', goldValue: 15 },
  { id: 'coal',          name: 'Coal',             icon: '⬛', rarity: 'common',    weight: 30, type: 'material', goldValue: 25 },
  { id: 'iron_ore',      name: 'Iron Ore',         icon: '🔩', rarity: 'common',    weight: 20, type: 'material', goldValue: 40 },
  { id: 'clay',          name: 'Clay',             icon: '🟫', rarity: 'common',    weight: 25, type: 'material', goldValue: 18 },
  { id: 'flint',         name: 'Flint',            icon: '🪓', rarity: 'common',    weight: 18, type: 'material', goldValue: 30 },
  { id: 'bone',          name: 'Old Bone',         icon: '🦴', rarity: 'common',    weight: 15, type: 'material', goldValue: 28,  alchemyGrant: 'bone_dust' },
  { id: 'herb_patch',    name: 'Herb Patch',       icon: '🌿', rarity: 'common',    weight: 14, type: 'material', goldValue: 22,  alchemyGrant: 'herb' },
  // Uncommon
  { id: 'silver_ore',    name: 'Silver Ore',       icon: '🥈', rarity: 'uncommon',  weight: 12, type: 'material', goldValue: 120 },
  { id: 'gold_ore',      name: 'Gold Ore',         icon: '🥇', rarity: 'uncommon',  weight: 8,  type: 'material', goldValue: 200 },
  { id: 'ancient_coin',  name: 'Ancient Coin',     icon: '🪙', rarity: 'uncommon',  weight: 6,  type: 'material', goldValue: 250 },
  { id: 'mushroom_vein', name: 'Glowshroom Vein',  icon: '🍄', rarity: 'uncommon',  weight: 7,  type: 'material', goldValue: 130, alchemyGrant: 'mushroom' },
  { id: 'fire_rock',     name: 'Fire Rock',        icon: '🔥', rarity: 'uncommon',  weight: 5,  type: 'material', goldValue: 220, alchemyGrant: 'fire_shard' },
  { id: 'shadow_pool',   name: 'Shadow Pool',      icon: '🫙', rarity: 'uncommon',  weight: 4,  type: 'material', goldValue: 280, alchemyGrant: 'shadow_oil' },
  { id: 'moonstone',     name: 'Moonstone',        icon: '🌙', rarity: 'uncommon',  weight: 5,  type: 'gem',      goldValue: 300 },
  { id: 'copper_vein',   name: 'Copper Vein',      icon: '🟤', rarity: 'uncommon',  weight: 10, type: 'material', goldValue: 150 },
  // Rare
  { id: 'ruby',          name: 'Ruby',             icon: '💎', rarity: 'rare',      weight: 3,  type: 'gem',      goldValue: 800 },
  { id: 'sapphire',      name: 'Sapphire',         icon: '🔷', rarity: 'rare',      weight: 3,  type: 'gem',      goldValue: 800 },
  { id: 'emerald',       name: 'Emerald',          icon: '💚', rarity: 'rare',      weight: 2,  type: 'gem',      goldValue: 900 },
  { id: 'ancient_relic', name: 'Ancient Relic',    icon: '🏺', rarity: 'rare',      weight: 2,  type: 'relic',    goldValue: 1200, techGrant: 'ancient_strike' },
  { id: 'crystal_frag',  name: 'Crystal Fragment', icon: '🔮', rarity: 'rare',      weight: 2,  type: 'gem',      goldValue: 1000, techGrant: 'crystal_shard' },
  { id: 'moon_water',    name: 'Moon Water Flask', icon: '💧', rarity: 'rare',      weight: 2,  type: 'material', goldValue: 900, alchemyGrant: 'moonwater' },
  { id: 'dragon_tooth',  name: 'Dragon Tooth',     icon: '🦷', rarity: 'rare',      weight: 1,  type: 'relic',    goldValue: 1500 },
  { id: 'spirit_orb',    name: 'Spirit Orb',       icon: '🔵', rarity: 'rare',      weight: 2,  type: 'gem',      goldValue: 850 },
  // Legendary
  { id: 'void_crystal',  name: 'Void Crystal',     icon: '🌀', rarity: 'legendary', weight: 0.5, type: 'gem',     goldValue: 5000, techGrant: 'void_rend' },
  { id: 'divine_shard',  name: 'Divine Shard',     icon: '💫', rarity: 'legendary', weight: 0.5, type: 'gem',     goldValue: 5000, techGrant: 'divine_heal' },
  { id: 'dragon_scale',  name: 'Dragon Scale',     icon: '🐉', rarity: 'legendary', weight: 0.3, type: 'relic',   goldValue: 7000, alchemyGrant: 'dragon_scale' },
  { id: 'void_essence',  name: 'Void Essence',     icon: '🌑', rarity: 'legendary', weight: 0.3, type: 'gem',     goldValue: 8000, alchemyGrant: 'void_essence' },
  { id: 'ancient_tome',  name: 'Ancient Tome',     icon: '📜', rarity: 'legendary', weight: 0.2, type: 'relic',   goldValue: 10000 },
  // ⚠️ SECRET — not listed anywhere. 1% chance per tile dug.
  { id: 'sukuna_finger', name: "Sukuna's Finger",  icon: '🩸', rarity: 'secret',    weight: 0,   type: 'relic',   goldValue: 0, techGrant: 'vessel_switch', _secret: true },
];

// Session stats
let digSession = { found: 0, gold: 0, rare: 0 };
let digGrid = [];

// ── VFX: particle burst on a tile ──
function digParticleBurst(tileEl, rarity) {
  if (!tileEl) return;
  const rect = tileEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const colors = {
    common:    ['#aaa', '#ccc', '#888'],
    uncommon:  ['#6c9fff', '#88aaff', '#4477dd'],
    rare:      ['#b06aff', '#cc88ff', '#8844cc'],
    legendary: ['#f5c542', '#ffdd66', '#ff9900', '#fff'],
  };
  const palette = colors[rarity] || colors.common;
  const count = rarity === 'legendary' ? 20 : rarity === 'rare' ? 14 : rarity === 'uncommon' ? 10 : 6;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'dig-particle';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist  = 20 + Math.random() * (rarity === 'legendary' ? 60 : rarity === 'rare' ? 45 : 30);
    const size  = 3 + Math.random() * (rarity === 'legendary' ? 6 : 3);
    const color = palette[Math.floor(Math.random() * palette.length)];
    p.style.cssText = `
      position:fixed;z-index:9998;pointer-events:none;border-radius:50%;
      width:${size}px;height:${size}px;background:${color};
      left:${cx}px;top:${cy}px;
      --dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;
      animation:digBurst 0.6s ease-out forwards;
      animation-delay:${Math.random() * 0.1}s;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }

  // Screen flash for legendary
  if (rarity === 'legendary') {
    const flash = document.createElement('div');
    flash.style.cssText = `
      position:fixed;inset:0;z-index:9997;pointer-events:none;
      background:radial-gradient(circle at ${cx}px ${cy}px, rgba(245,197,66,0.35) 0%, transparent 60%);
      animation:digFlash 0.5s ease-out forwards;
    `;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);
  }
}

// ── VFX: dirt spray (always plays) ──
function digDirtSpray(tileEl) {
  if (!tileEl) return;
  const rect = tileEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'dig-particle';
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
    const dist  = 8 + Math.random() * 18;
    const size  = 2 + Math.random() * 3;
    p.style.cssText = `
      position:fixed;z-index:9998;pointer-events:none;border-radius:50%;
      width:${size}px;height:${size}px;background:#7a5c3a;
      left:${cx}px;top:${cy}px;
      --dx:${Math.cos(angle) * dist}px;--dy:${Math.sin(angle) * dist}px;
      animation:digBurst 0.35s ease-out forwards;
    `;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 400);
  }
}

function activateSonarPulse() {
  const sonarLevel = (G.player.shopPurchases && G.player.shopPurchases['dig_reveal']) || 0;
  if (sonarLevel === 0) { toast('Buy Sonar Pulse upgrade first!', 'warn'); return; }
  if (!G.player.sonarCharges || G.player.sonarCharges <= 0) { toast('No sonar charges! Wait for regen.', 'warn'); return; }

  G.player.sonarCharges--;
  const revealCount = sonarLevel * 3;
  const undug = digGrid.map((t,i) => i).filter(i => !digGrid[i].dug);
  if (undug.length === 0) { toast('All tiles already dug!', 'info'); return; }

  const toReveal = undug.sort(() => Math.random() - 0.5).slice(0, revealCount);

  // VFX: sonar wave ripple from center of grid
  const gridEl = document.getElementById('dig-grid');
  if (gridEl) {
    const rect = gridEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let ring = 0; ring < 3; ring++) {
      setTimeout(() => {
        const wave = document.createElement('div');
        wave.style.cssText = `
          position:fixed;z-index:9997;pointer-events:none;border-radius:50%;
          border:2px solid rgba(41,128,185,0.7);
          left:${cx}px;top:${cy}px;transform:translate(-50%,-50%);
          width:20px;height:20px;
          animation:sonarRing 0.8s ease-out forwards;
        `;
        document.body.appendChild(wave);
        setTimeout(() => wave.remove(), 900);
      }, ring * 200);
    }
  }

  // Reveal tiles with staggered animation — process loot for each revealed tile
  toReveal.forEach((idx, i) => {
    setTimeout(() => {
      const tile = digGrid[idx];
      tile.dug = true;

      // Process loot if tile has it
      if (tile.loot) {
        const item = tile.loot;
        const gold = gainGold(Math.floor(item.goldValue * getDigGoldMult()));
        gainXP(Math.floor(item.goldValue / 5 * getDigXpMult()));
        digSession.found++;
        digSession.gold += gold;
        if (item.rarity === 'rare' || item.rarity === 'legendary') digSession.rare++;

        const cls = item.rarity === 'legendary' ? 'rare' : item.rarity === 'rare' ? 'uncommon' : 'common';
        addDigLog(`📡 ${item.icon} ${item.name} — +${gold}g`, cls, item.rarity);

        if (item.techGrant) grantTechnique(item.techGrant);
        if (item.alchemyGrant) {
          addIngredient(item.alchemyGrant, 1);
          const ing = ALCHEMY_INGREDIENTS.find(x => x.id === item.alchemyGrant);
          if (ing) addDigLog(`  🧴 ${ing.name}`, 'uncommon');
        }
        if (item.rarity === 'legendary') toast(`✨ SONAR LEGENDARY: ${item.name}!`, 'rare');
        else if (item.rarity === 'rare')  toast(`💎 Sonar rare: ${item.name}!`, 'info');

        // VFX on revealed tile
        setTimeout(() => {
          const tileEl = document.querySelector(`[data-dig-idx="${idx}"]`);
          digParticleBurst(tileEl, item.rarity);
        }, 50);
      }

      // Flash the revealed tile
      const tileEl = document.querySelector(`[data-dig-idx="${idx}"]`);
      if (tileEl) {
        tileEl.style.animation = 'sonarReveal 0.4s ease';
        setTimeout(() => { tileEl.style.animation = ''; }, 400);
      }
      renderDigGrid();
      updateDigStats();
    }, i * 100);
  });

  toast(`📡 Sonar Pulse! Revealed ${toReveal.length} tiles.`, 'info');
  updateSonarButton();
}

function updateSonarButton() {
  const btn = document.getElementById('btn-sonar');
  if (!btn) return;
  const sonarLevel = (G.player.shopPurchases && G.player.shopPurchases['dig_reveal']) || 0;
  const charges = G.player.sonarCharges || 0;
  const maxSonar = sonarLevel;
  if (sonarLevel === 0) { btn.classList.add('hidden'); return; }
  btn.classList.remove('hidden');
  // Show charges and regen timer
  let timerStr = '';
  if (charges < maxSonar) {
    const regenRate = getDigRegenRate() * 3;
    const ticksLeft = regenRate - (G.player.sonarRegenTick || 0);
    const secsLeft = Math.ceil(ticksLeft * G.tickRate / 1000);
    timerStr = ` (+1 in ${secsLeft}s)`;
  }
  btn.textContent = `📡 Sonar ${charges}/${maxSonar}${timerStr}`;
  btn.disabled = charges <= 0;
}
function getDigGoldMult() {
  return 1 + ((G.player.shopPurchases && G.player.shopPurchases['dig_gold']) || 0) * 0.25;
}
function getDigXpMult() {
  return 1 + ((G.player.shopPurchases && G.player.shopPurchases['dig_xp']) || 0) * 0.5;
}

function generateDigSite() {
  digGrid = [];
  digSession = { found: 0, gold: 0, rare: 0 };
  const extraTiles = ((G.player.shopPurchases && G.player.shopPurchases['dig_size']) || 0) * 8;
  const totalTiles = DIG_COLS * DIG_ROWS + extraTiles;
  const lootCount  = Math.floor(totalTiles * (0.2 + Math.random() * 0.15));

  const pool = [];
  DIG_LOOT_TABLE.forEach(item => {
    for (let i = 0; i < item.weight * 10; i++) pool.push(item);
  });

  for (let i = 0; i < totalTiles; i++) digGrid.push({ dug: false, loot: null });

  const positions = shuffle([...Array(totalTiles).keys()]);
  for (let i = 0; i < lootCount; i++) {
    const item = pool[Math.floor(Math.random() * pool.length)];
    digGrid[positions[i]].loot = item;
  }

  renderDigGrid();
  updateDigStats();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function digTile(index) {
  const tile = digGrid[index];
  if (!tile || tile.dug) return;

  const p = G.player;
  if (p.digCharges <= 0) {
    toast('No dig charges! Wait for regen.', 'warn');
    return;
  }

  p.digCharges--;
  tile.dug = true;

  // Get the tile element for VFX
  const tileEl = document.querySelector(`[data-dig-idx="${index}"]`);
  digDirtSpray(tileEl);

  // ── SECRET: 0.9% chance to find Sukuna's Finger on any tile ──
  if (Math.random() < 0.009 && !G.player.techniques.includes('vessel_switch')) {
    const finger = DIG_LOOT_TABLE.find(i => i.id === 'sukuna_finger');
    tile.loot = finger;
    // Dramatic VFX
    setTimeout(() => {
      const el = document.querySelector(`[data-dig-idx="${index}"]`);
      digParticleBurst(el, 'secret');
      // Blood-red screen flash
      const flash = document.createElement('div');
      flash.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;
        background:radial-gradient(circle at 50% 50%, rgba(180,0,0,0.5) 0%, transparent 70%);
        animation:digFlash 1s ease-out forwards;`;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1100);
    }, 30);
    addDigLog(`🩸 ...something cursed stirs beneath the earth...`, 'rare', 'secret');
    setTimeout(() => {
      toast('🩸 You found something... wrong.', 'rare');
      setTimeout(() => toast("Sukuna's Finger — a cursed relic of immense power!", 'rare'), 1500);
    }, 600);
    grantTechnique('vessel_switch');
    renderDigGrid();
    updateDigInfo();
    updateDigStats();
    return;
  }

  if (tile.loot) {
    const item = tile.loot;
    // Luck bonus
    const luck = typeof getDigLuckBonus === 'function' ? getDigLuckBonus() : 0;
    let finalItem = item;
    if (luck > 0 && Math.random() < luck) {
      const rarityUp = { common: 'uncommon', uncommon: 'rare', rare: 'legendary' };
      const nextRarity = rarityUp[item.rarity];
      if (nextRarity) {
        const upgrades = DIG_LOOT_TABLE.filter(i => i.rarity === nextRarity);
        if (upgrades.length) finalItem = upgrades[Math.floor(Math.random() * upgrades.length)];
      }
    }

    const gold = gainGold(Math.floor(finalItem.goldValue * getDigGoldMult()));
    gainXP(Math.floor(finalItem.goldValue / 5 * getDigXpMult()));

    // Session tracking
    digSession.found++;
    digSession.gold += gold;
    if (finalItem.rarity === 'rare' || finalItem.rarity === 'legendary') digSession.rare++;

    // VFX burst after a tiny delay so tile renders first
    setTimeout(() => {
      const updatedTile = document.querySelector(`[data-dig-idx="${index}"]`);
      digParticleBurst(updatedTile, finalItem.rarity);
    }, 30);

    // Floating gold text near the tile
    if (tileEl) {
      const rect = tileEl.getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'float-text float-gold';
      el.textContent = `+${gold}g`;
      el.style.left = (rect.left + rect.width / 2 - 15) + 'px';
      el.style.top  = (rect.top + window.scrollY - 8) + 'px';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1400);
    }

    const cls = finalItem.rarity === 'legendary' ? 'rare' : finalItem.rarity === 'rare' ? 'uncommon' : 'common';
    addDigLog(`${finalItem.icon} ${finalItem.name} — +${gold}g`, cls, finalItem.rarity);

    if (finalItem.techGrant) grantTechnique(finalItem.techGrant);
    if (finalItem.alchemyGrant) {
      addIngredient(finalItem.alchemyGrant, 1);
      const ing = ALCHEMY_INGREDIENTS.find(i => i.id === finalItem.alchemyGrant);
      if (ing) addDigLog(`  🧴 ${ing.name}`, 'uncommon');
    }

    if (finalItem.rarity === 'legendary') toast(`✨ LEGENDARY: ${finalItem.name}!`, 'rare');
    else if (finalItem.rarity === 'rare')  toast(`💎 Rare: ${finalItem.name}!`, 'info');

  } else {
    addDigLog('Nothing here…', 'common');
  }

  renderDigGrid();
  updateDigInfo();
  updateDigStats();
}

function addDigLog(msg, cls, rarity) {
  const logEl = document.getElementById('dig-log');
  if (!logEl) return;
  const div = document.createElement('div');
  div.className = cls;
  if (rarity === 'legendary') div.style.cssText = 'font-weight:700;text-shadow:0 0 6px #f5c542';
  else if (rarity === 'rare') div.style.cssText = 'font-weight:600';
  div.textContent = msg;
  logEl.prepend(div);
  while (logEl.children.length > 25) logEl.removeChild(logEl.lastChild);
}

function renderDigGrid() {
  const grid = document.getElementById('dig-grid');
  if (!grid) return;

  const rarityGlow = {
    uncommon:  '0 0 8px rgba(108,159,255,0.6)',
    rare:      '0 0 12px rgba(176,106,255,0.7)',
    legendary: '0 0 18px rgba(245,197,66,0.9)',
    secret:    '0 0 20px rgba(200,0,0,0.9)',
  };

  grid.innerHTML = digGrid.map((tile, i) => {
    if (tile.dug) {
      if (!tile.loot) {
        return `<div class="dig-tile dug" data-dig-idx="${i}">·</div>`;
      }
      const glow = rarityGlow[tile.loot.rarity] || '';
      return `<div class="dig-tile dug-find dig-rarity-${tile.loot.rarity}" data-dig-idx="${i}"
        style="${glow ? `box-shadow:${glow}` : ''}">${tile.loot.icon}</div>`;
    }
    return `<div class="dig-tile undug" data-dig-idx="${i}" onclick="digTile(${i})">
      <span class="dig-question">?</span>
    </div>`;
  }).join('');
}

function updateDigStats() {
  const el = document.getElementById('dig-session-stats');
  if (!el) return;
  const total = digGrid.length;
  const dug   = digGrid.filter(t => t.dug).length;
  const left  = total - dug;
  el.innerHTML = `
    <span>⛏️ ${dug}/${total} dug</span>
    <span>📦 ${digSession.found} found</span>
    <span class="highlight">💰 +${digSession.gold}g</span>
    ${digSession.rare > 0 ? `<span style="color:var(--accent2)">💎 ${digSession.rare} rare</span>` : ''}
  `;
}

function updateDigInfo() {
  const p = G.player;
  const maxCharges = getMaxDigCharges();

  // Charge pips
  const pipsEl = document.getElementById('dig-charge-pips');
  if (pipsEl) {
    pipsEl.innerHTML = Array.from({ length: maxCharges }, (_, i) =>
      `<div class="charge-pip${i < p.digCharges ? ' pip-full' : ''}"></div>`
    ).join('');
  }

  // Timer
  const timerEl = document.getElementById('dig-timer');
  if (timerEl) {
    if (p.digCharges >= maxCharges) {
      timerEl.textContent = 'Full';
    } else {
      const regenRate = getDigRegenRate();
      const ticksLeft = regenRate - (p.digRegenTick || 0);
      const secsLeft  = Math.ceil(ticksLeft * G.tickRate / 1000);
      timerEl.textContent = `+1 in ${secsLeft}s`;
    }
  }

  // Also update sonar button timer
  updateSonarButton();
}

function renderDigUI() {
  const p = G.player;
  if (p.level < 5) {
    const wrap = document.getElementById('dig-main-wrap');
    if (wrap) wrap.innerHTML = `<div class="locked-section"><div class="locked-icon">⛏️</div><h3>Excavation Locked</h3><p>Reach <strong>Level 5</strong> to unlock Excavation.</p></div>`;
    return;
  }
  updateDigInfo();
  renderDigUpgrades();
  updateSonarButton();
  if (digGrid.length === 0) generateDigSite();
  else { renderDigGrid(); updateDigStats(); }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-new-dig')?.addEventListener('click', () => {
    generateDigSite();
    const logEl = document.getElementById('dig-log');
    if (logEl) logEl.innerHTML = '';
    toast('New dig site opened!', 'info');
  });
});
