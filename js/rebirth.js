// ===== ASCENDANT SYSTEM (formerly Rebirth) =====
// Each Ascension gives flat permanent bonuses — no upgrade tree needed.
// +25% XP, +25% Gold, +25% Training gains, +10% Luck per ascension.

function getAscensionBonus() {
  const count = G.player.rebirthCount || 0;
  return {
    xpMult:    1 + count * 0.25,
    goldMult:  1 + count * 0.25,
    trainMult: 1 + count * 0.25,
    luckMult:  1 + count * 0.10,
  };
}

// Legacy upgrade system kept for saves that have points — still spendable
const REBIRTH_UPGRADES = [
  { id: 'xp_boost_1',   name: 'Scholar\'s Mind I',    desc: '+50% XP per level.',              icon: '📚', cost: 1, maxLevel: 5, effect: (l) => ({ xpMult:   1 + l * 0.50 }) },
  { id: 'gold_boost_1', name: 'Merchant\'s Eye I',    desc: '+50% gold per level.',             icon: '💰', cost: 1, maxLevel: 5, effect: (l) => ({ goldMult: 1 + l * 0.50 }) },
  { id: 'stat_boost_1', name: 'Warrior\'s Legacy I',  desc: '+30% all stats per level.',        icon: '⚔️', cost: 2, maxLevel: 5, effect: (l) => ({ statMult: 1 + l * 0.30 }) },
  { id: 'dig_charges',  name: 'Excavator\'s Instinct',desc: '+1 starting dig charge per level.',icon: '⛏️', cost: 1, maxLevel: 5, effect: () => ({}) },
  { id: 'xp_boost_2',   name: 'Scholar\'s Mind II',   desc: '+100% XP per level.',             icon: '🎓', cost: 3, maxLevel: 4, effect: (l) => ({ xpMult:   1 + l * 1.0  }), requires: 'xp_boost_1',   requiresLevel: 3 },
  { id: 'gold_boost_2', name: 'Merchant\'s Eye II',   desc: '+100% gold per level.',            icon: '🏦', cost: 3, maxLevel: 4, effect: (l) => ({ goldMult: 1 + l * 1.0  }), requires: 'gold_boost_1', requiresLevel: 3 },
  { id: 'stat_boost_2', name: 'Warrior\'s Legacy II', desc: '+75% all stats per level.',        icon: '🗡️', cost: 4, maxLevel: 4, effect: (l) => ({ statMult: 1 + l * 0.75 }), requires: 'stat_boost_1', requiresLevel: 3 },
  { id: 'stamina_boost',name: 'Iron Lungs',           desc: '+50% max stamina per level.',      icon: '⚡', cost: 2, maxLevel: 4, effect: () => ({}), requires: 'stat_boost_1', requiresLevel: 2 },
  { id: 'xp_boost_3',   name: 'Omniscient Mind',      desc: '+200% XP per level.',             icon: '🌟', cost: 6, maxLevel: 3, effect: (l) => ({ xpMult:   1 + l * 2.0  }), requires: 'xp_boost_2',   requiresLevel: 3 },
  { id: 'gold_boost_3', name: 'Golden Touch',         desc: '+200% gold per level.',            icon: '👑', cost: 6, maxLevel: 3, effect: (l) => ({ goldMult: 1 + l * 2.0  }), requires: 'gold_boost_2', requiresLevel: 3 },
  { id: 'stat_boost_3', name: 'Transcendent Power',   desc: '+150% all stats per level.',       icon: '🔱', cost: 8, maxLevel: 3, effect: (l) => ({ statMult: 1 + l * 1.5  }), requires: 'stat_boost_2', requiresLevel: 3 },
];

function canAffordUpgrade(upgrade) {
  const p = G.player;
  const owned = p.rebirthUpgrades[upgrade.id] || 0;
  if (owned >= upgrade.maxLevel) return false;
  if (p.rebirthPoints < upgrade.cost) return false;
  if (upgrade.requires) {
    const reqOwned = p.rebirthUpgrades[upgrade.requires] || 0;
    if (reqOwned < (upgrade.requiresLevel || 1)) return false;
  }
  return true;
}

function buyRebirthUpgrade(upgradeId) {
  const upgrade = REBIRTH_UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade || !canAffordUpgrade(upgrade)) return;
  const p = G.player;
  p.rebirthPoints -= upgrade.cost;
  p.rebirthUpgrades[upgradeId] = (p.rebirthUpgrades[upgradeId] || 0) + 1;
  recalcRebirthMultipliers();
  applyRebirthMultipliers();
  renderRebirthPanel();
  toast(`Purchased: ${upgrade.name}`, 'success');
}

function recalcRebirthMultipliers() {
  const p = G.player;
  const asc = getAscensionBonus();
  let xpMult = asc.xpMult;
  let goldMult = asc.goldMult;
  let statMult = 1;

  REBIRTH_UPGRADES.forEach(upgrade => {
    const owned = p.rebirthUpgrades[upgrade.id] || 0;
    if (owned > 0) {
      const eff = upgrade.effect(owned);
      if (eff.xpMult)   xpMult   = Math.max(xpMult,   eff.xpMult);
      if (eff.goldMult) goldMult = Math.max(goldMult, eff.goldMult);
      if (eff.statMult) statMult = Math.max(statMult, eff.statMult);
    }
  });

  p.xpMult   = xpMult;
  p.goldMult = goldMult;
  p.statMult = statMult;
}

function performRebirth() {
  const p = G.player;
  if (p.level < 30) { toast('Requires level 30 to Ascend!', 'warn'); return; }

  const count = p.rebirthCount + 1;
  const digUpgrade = p.rebirthUpgrades['dig_charges'] || 0;

  resetGame();

  G.player.rebirthCount = count;
  G.player.digCharges = 3 + digUpgrade;

  recalcRebirthMultipliers();
  applyRebirthMultipliers();

  const b = getAscensionBonus();
  toast(`✨ Ascension ${count}! +25% XP/Gold/Train, +10% Luck`, 'rare');
  spawnFloatingText('✨ ASCENDED!', 'float-xp');
  renderRebirthPanel();
  renderTraining();
  renderJobs();
  renderRaids();
  renderStoryChapters();
  renderInventory();
}

function renderRebirthPanel() {
  const p = G.player;
  const asc = getAscensionBonus();
  const nextAsc = { xpMult: 1 + (p.rebirthCount + 1) * 0.25, goldMult: 1 + (p.rebirthCount + 1) * 0.25, luckMult: 1 + (p.rebirthCount + 1) * 0.10 };

  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('rb-count', p.rebirthCount);
  setTxt('rb-points', p.rebirthPoints);
  setTxt('rb-xp-mult', p.xpMult.toFixed(2) + 'x');
  setTxt('rb-gold-mult', p.goldMult.toFixed(2) + 'x');
  setTxt('rb-stat-mult', p.statMult.toFixed(2) + 'x');

  const btn = document.getElementById('btn-rebirth');
  if (btn) {
    btn.disabled = p.level < 30;
    btn.textContent = p.level < 30
      ? `✨ Ascend (Requires Lv.30)`
      : `✨ Ascend (Lv.${p.level}) → +25% XP/Gold/Train, +10% Luck`;
  }

  const container = document.getElementById('rebirth-upgrades');
  if (!container) return;

  // Show ascension bonuses prominently
  const ascHtml = `
    <div class="card" style="border-color:var(--gold);background:rgba(245,197,66,0.06);margin-bottom:16px">
      <h3 style="color:var(--gold)">✨ Ascension Bonuses (×${p.rebirthCount})</h3>
      <div class="card-desc">Each Ascension permanently grants flat multipliers — no upgrade tree needed.</div>
      <div class="card-stats" style="margin-top:10px">
        <span>📚 XP: <strong style="color:var(--ok)">${asc.xpMult.toFixed(2)}×</strong></span>
        <span>💰 Gold: <strong style="color:var(--ok)">${asc.goldMult.toFixed(2)}×</strong></span>
        <span>💪 Train: <strong style="color:var(--ok)">${asc.trainMult.toFixed(2)}×</strong></span>
        <span>🍀 Luck: <strong style="color:var(--ok)">${asc.luckMult.toFixed(2)}×</strong></span>
      </div>
      ${p.rebirthCount > 0 ? `<div style="font-size:11px;color:var(--dim);margin-top:8px">Next ascension → XP ${nextAsc.xpMult.toFixed(2)}× · Gold ${nextAsc.goldMult.toFixed(2)}× · Luck ${nextAsc.luckMult.toFixed(2)}×</div>` : ''}
    </div>`;

  // Legacy upgrade points (if any)
  const legacyHtml = p.rebirthPoints > 0 ? `
    <h3 style="margin-bottom:10px">🏛️ Legacy Upgrades (${p.rebirthPoints} RP remaining)</h3>
    <div class="card-grid">
      ${REBIRTH_UPGRADES.map(upgrade => {
        const owned = p.rebirthUpgrades[upgrade.id] || 0;
        const canBuy = canAffordUpgrade(upgrade);
        const maxed = owned >= upgrade.maxLevel;
        return `<div class="card rebirth-upgrade-card">
          <h3>${upgrade.icon} ${upgrade.name}</h3>
          <div class="card-desc">${upgrade.desc}</div>
          <div class="owned" style="font-size:11px;color:var(--dim);margin:4px 0">${owned}/${upgrade.maxLevel}</div>
          ${maxed ? `<span style="color:var(--ok);font-size:12px">✓ Maxed</span>`
            : `<button class="btn-small" onclick="buyRebirthUpgrade('${upgrade.id}')" ${canBuy ? '' : 'disabled'}>${upgrade.cost} RP</button>`}
        </div>`;
      }).join('')}
    </div>` : '';

  container.innerHTML = ascHtml + legacyHtml;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-rebirth')?.addEventListener('click', () => {
    const p = G.player;
    if (confirm(`Ascend at level ${p.level}?\n\n+25% XP, +25% Gold, +25% Training gains, +10% Luck — permanently.\n\nAll progress resets. Ascension bonuses stack forever.`)) {
      performRebirth();
    }
  });
});


function canAffordUpgrade(upgrade) {
  const p = G.player;
  const owned = p.rebirthUpgrades[upgrade.id] || 0;
  if (owned >= upgrade.maxLevel) return false;
  if (p.rebirthPoints < upgrade.cost) return false;
  if (upgrade.requires) {
    const reqOwned = p.rebirthUpgrades[upgrade.requires] || 0;
    if (reqOwned < (upgrade.requiresLevel || 1)) return false;
  }
  return true;
}

function buyRebirthUpgrade(upgradeId) {
  const upgrade = REBIRTH_UPGRADES.find(u => u.id === upgradeId);
  if (!upgrade || !canAffordUpgrade(upgrade)) return;

  const p = G.player;
  p.rebirthPoints -= upgrade.cost;
  p.rebirthUpgrades[upgradeId] = (p.rebirthUpgrades[upgradeId] || 0) + 1;

  recalcRebirthMultipliers();
  applyRebirthMultipliers();
  renderRebirthPanel();
  toast(`Purchased: ${upgrade.name}`, 'success');
}

function recalcRebirthMultipliers() {
  const p = G.player;
  let xpMult = 1;
  let goldMult = 1;
  let statMult = 1;

  REBIRTH_UPGRADES.forEach(upgrade => {
    const owned = p.rebirthUpgrades[upgrade.id] || 0;
    if (owned > 0) {
      const eff = upgrade.effect(owned);
      if (eff.xpMult) xpMult = Math.max(xpMult, eff.xpMult);
      if (eff.goldMult) goldMult = Math.max(goldMult, eff.goldMult);
      if (eff.statMult) statMult = Math.max(statMult, eff.statMult);
    }
  });

  p.xpMult = xpMult;
  p.goldMult = goldMult;
  p.statMult = statMult;
}

function performRebirth() {
  const p = G.player;
  if (p.level < 30) {
    toast('Requires level 30 to rebirth!', 'warn');
    return;
  }

  // Points scale with level — higher level = more points
  const levelBonus = Math.floor(p.level / 10);
  const pointsEarned = 3 + p.rebirthCount + levelBonus;
  p.rebirthCount++;
  p.rebirthPoints += pointsEarned;

  const digUpgrade = p.rebirthUpgrades['dig_charges'] || 0;

  resetGame();

  G.player.digCharges = 3 + digUpgrade;

  recalcRebirthMultipliers();
  applyRebirthMultipliers();

  toast(`✨ Rebirth ${G.player.rebirthCount}! +${pointsEarned} rebirth points`, 'rare');
  spawnFloatingText(`+${pointsEarned} RP`, 'float-xp');
  renderRebirthPanel();
  renderTraining();
  renderJobs();
  renderRaids();
  renderStoryChapters();
  renderInventory();
}

function renderRebirthPanel() {
  const p = G.player;

  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setTxt('rb-count', p.rebirthCount);
  setTxt('rb-points', p.rebirthPoints);
  setTxt('rb-xp-mult', p.xpMult.toFixed(2) + 'x');
  setTxt('rb-gold-mult', p.goldMult.toFixed(2) + 'x');
  setTxt('rb-stat-mult', p.statMult.toFixed(2) + 'x');

  const btn = document.getElementById('btn-rebirth');
  if (btn) {
    btn.disabled = p.level < 30;
    btn.textContent = p.level < 30 ? `🔄 Rebirth (Requires Lv.30)` : `🔄 Perform Rebirth (Lv.${p.level} → +${3 + p.rebirthCount + Math.floor(p.level/10)} RP)`;
  }

  const container = document.getElementById('rebirth-upgrades');
  if (!container) return;

  container.innerHTML = REBIRTH_UPGRADES.map(upgrade => {
    const owned = p.rebirthUpgrades[upgrade.id] || 0;
    const canBuy = canAffordUpgrade(upgrade);
    const maxed = owned >= upgrade.maxLevel;

    return `
      <div class="card rebirth-upgrade-card">
        <h3>${upgrade.icon} ${upgrade.name}</h3>
        <div class="card-desc">${upgrade.desc}</div>
        <div class="card-stats">
          <span>Max: ${upgrade.maxLevel}</span>
          ${upgrade.requires ? `<span>Req: ${upgrade.requires} Lv.${upgrade.requiresLevel}</span>` : ''}
        </div>
        <div class="owned">Owned: ${owned}/${upgrade.maxLevel}</div>
        ${maxed
          ? `<div style="color:var(--success);font-size:12px">✓ Maxed</div>`
          : `<div class="cost">Cost: ${upgrade.cost} RP</div>
             <button class="btn-small" onclick="buyRebirthUpgrade('${upgrade.id}')" ${canBuy ? '' : 'disabled'}>Buy</button>`
        }
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-rebirth')?.addEventListener('click', () => {
    const p = G.player;
    const pts = 3 + p.rebirthCount + Math.floor(p.level / 10);
    if (confirm(`Rebirth at level ${p.level}?\n\nYou will earn +${pts} Rebirth Points.\nAll progress resets except rebirth upgrades and multipliers.\n\nThis is worth it — multipliers stack!`)) {
      performRebirth();
    }
  });
});
