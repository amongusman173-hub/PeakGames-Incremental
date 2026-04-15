// ===== REBIRTH SYSTEM =====

const REBIRTH_UPGRADES = [
  {
    id: 'xp_boost_1',
    name: 'Scholar\'s Mind I',
    desc: 'Gain 25% more XP permanently.',
    icon: '📚',
    cost: 1,
    maxLevel: 5,
    effect: (level) => ({ xpMult: 1 + level * 0.25 }),
  },
  {
    id: 'gold_boost_1',
    name: 'Merchant\'s Eye I',
    desc: 'Earn 25% more gold permanently.',
    icon: '💰',
    cost: 1,
    maxLevel: 5,
    effect: (level) => ({ goldMult: 1 + level * 0.25 }),
  },
  {
    id: 'stat_boost_1',
    name: 'Warrior\'s Legacy I',
    desc: 'All stats 20% stronger permanently.',
    icon: '⚔️',
    cost: 2,
    maxLevel: 5,
    effect: (level) => ({ statMult: 1 + level * 0.2 }),
  },
  {
    id: 'dig_charges',
    name: 'Excavator\'s Instinct',
    desc: 'Start with +1 dig charge per rebirth level.',
    icon: '⛏️',
    cost: 1,
    maxLevel: 3,
    effect: () => ({}),
  },
  {
    id: 'xp_boost_2',
    name: 'Scholar\'s Mind II',
    desc: 'Gain 50% more XP permanently.',
    icon: '🎓',
    cost: 3,
    maxLevel: 3,
    effect: (level) => ({ xpMult: 1 + level * 0.5 }),
    requires: 'xp_boost_1',
    requiresLevel: 3,
  },
  {
    id: 'gold_boost_2',
    name: 'Merchant\'s Eye II',
    desc: 'Earn 50% more gold permanently.',
    icon: '🏦',
    cost: 3,
    maxLevel: 3,
    effect: (level) => ({ goldMult: 1 + level * 0.5 }),
    requires: 'gold_boost_1',
    requiresLevel: 3,
  },
  {
    id: 'stat_boost_2',
    name: 'Warrior\'s Legacy II',
    desc: 'All stats 50% stronger permanently.',
    icon: '🗡️',
    cost: 4,
    maxLevel: 3,
    effect: (level) => ({ statMult: 1 + level * 0.5 }),
    requires: 'stat_boost_1',
    requiresLevel: 3,
  },
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
  if (p.level < 50) {
    toast('Requires level 50 to rebirth!', 'warn');
    return;
  }

  const pointsEarned = Math.floor(1 + p.rebirthCount * 0.5);
  p.rebirthCount++;
  p.rebirthPoints += pointsEarned;

  // Bonus dig charges from upgrade
  const digUpgrade = p.rebirthUpgrades['dig_charges'] || 0;

  resetGame();

  // Restore rebirth state (resetGame preserves it, but re-apply)
  G.player.digCharges = 3 + digUpgrade;

  recalcRebirthMultipliers();
  applyRebirthMultipliers();

  toast(`Rebirth ${G.player.rebirthCount}! +${pointsEarned} rebirth points`, 'rare');
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
  if (btn) btn.disabled = p.level < 50;

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
    if (confirm('Rebirth? You will lose all progress except rebirth upgrades and multipliers.')) {
      performRebirth();
    }
  });
});
