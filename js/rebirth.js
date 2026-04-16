// ===== ASCENDANT SYSTEM =====
// Each Ascension: +25% XP, +25% Gold, +25% Training, +10% Luck — stacks forever.

function getAscensionBonus() {
  const count = G.player.rebirthCount || 0;
  return {
    xpMult:    1 + count * 0.25,
    goldMult:  1 + count * 0.25,
    trainMult: 1 + count * 0.25,
    luckMult:  1 + count * 0.10,
  };
}

// Legacy upgrade data — only used if player has leftover RP from old saves
const REBIRTH_UPGRADES = [
  { id: 'xp_boost_1',   name: "Scholar's Mind I",   desc: '+50% XP per level.',         icon: '📚', cost: 1, maxLevel: 5, effect: (l) => ({ xpMult:   1 + l * 0.50 }) },
  { id: 'gold_boost_1', name: "Merchant's Eye I",   desc: '+50% gold per level.',        icon: '💰', cost: 1, maxLevel: 5, effect: (l) => ({ goldMult: 1 + l * 0.50 }) },
  { id: 'stat_boost_1', name: "Warrior's Legacy I", desc: '+30% all stats per level.',   icon: '⚔️', cost: 2, maxLevel: 5, effect: (l) => ({ statMult: 1 + l * 0.30 }) },
  { id: 'dig_charges',  name: 'Excavator\'s Instinct', desc: '+1 starting dig charge.', icon: '⛏️', cost: 1, maxLevel: 5, effect: () => ({}) },
  { id: 'xp_boost_2',   name: "Scholar's Mind II",  desc: '+100% XP per level.',        icon: '🎓', cost: 3, maxLevel: 4, effect: (l) => ({ xpMult:   1 + l * 1.0  }), requires: 'xp_boost_1',   requiresLevel: 3 },
  { id: 'gold_boost_2', name: "Merchant's Eye II",  desc: '+100% gold per level.',       icon: '🏦', cost: 3, maxLevel: 4, effect: (l) => ({ goldMult: 1 + l * 1.0  }), requires: 'gold_boost_1', requiresLevel: 3 },
  { id: 'stat_boost_2', name: "Warrior's Legacy II",desc: '+75% all stats per level.',   icon: '🗡️', cost: 4, maxLevel: 4, effect: (l) => ({ statMult: 1 + l * 0.75 }), requires: 'stat_boost_1', requiresLevel: 3 },
  { id: 'stamina_boost',name: 'Iron Lungs',          desc: '+50% max stamina per level.',icon: '⚡', cost: 2, maxLevel: 4, effect: () => ({}), requires: 'stat_boost_1', requiresLevel: 2 },
  { id: 'xp_boost_3',   name: 'Omniscient Mind',    desc: '+200% XP per level.',        icon: '🌟', cost: 6, maxLevel: 3, effect: (l) => ({ xpMult:   1 + l * 2.0  }), requires: 'xp_boost_2',   requiresLevel: 3 },
  { id: 'gold_boost_3', name: 'Golden Touch',        desc: '+200% gold per level.',      icon: '👑', cost: 6, maxLevel: 3, effect: (l) => ({ goldMult: 1 + l * 2.0  }), requires: 'gold_boost_2', requiresLevel: 3 },
  { id: 'stat_boost_3', name: 'Transcendent Power', desc: '+150% all stats per level.',  icon: '🔱', cost: 8, maxLevel: 3, effect: (l) => ({ statMult: 1 + l * 1.5  }), requires: 'stat_boost_2', requiresLevel: 3 },
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
      if (eff.goldMult) goldMult = Math.max(goldMult,  eff.goldMult);
      if (eff.statMult) statMult = Math.max(statMult,  eff.statMult);
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

  toast(`✨ Ascension ${count}! +25% XP/Gold/Train, +10% Luck`, 'rare');
  spawnFloatingText('✨ ASCENDED!', 'float-xp');

  // Big flash VFX
  const f = document.createElement('div');
  f.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;background:rgba(245,197,66,0.4);animation:digFlash 1s ease-out forwards;`;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 1100);

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
  const next = {
    xpMult:   1 + (p.rebirthCount + 1) * 0.25,
    goldMult: 1 + (p.rebirthCount + 1) * 0.25,
    trainMult:1 + (p.rebirthCount + 1) * 0.25,
    luckMult: 1 + (p.rebirthCount + 1) * 0.10,
  };

  const btn = document.getElementById('btn-rebirth');
  if (btn) {
    btn.disabled = p.level < 30;
    btn.textContent = p.level < 30
      ? `✨ Ascend (Requires Lv.30 — you are Lv.${p.level})`
      : `✨ Ascend Now (Lv.${p.level}) → +25% XP/Gold/Train, +10% Luck`;
  }

  const container = document.getElementById('rebirth-upgrades');
  if (!container) return;

  // ── Ascension bonuses card ──
  const starsHtml = p.rebirthCount > 0
    ? Array.from({length: Math.min(p.rebirthCount, 10)}, () => '✨').join('')
    : '—';

  const ascHtml = `
    <div class="card" style="border-color:var(--gold);background:rgba(245,197,66,0.07);margin-bottom:20px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="font-size:40px">✨</div>
        <div>
          <div style="font-size:18px;font-weight:800;color:var(--gold)">Ascension ${p.rebirthCount > 0 ? `×${p.rebirthCount}` : '— Not yet ascended'}</div>
          <div style="font-size:12px;color:var(--dim);margin-top:2px">${starsHtml}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:11px;color:var(--dim);margin-bottom:4px">📚 XP Gain</div>
          <div style="font-size:22px;font-weight:800;color:var(--ok)">${asc.xpMult.toFixed(2)}×</div>
        </div>
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:11px;color:var(--dim);margin-bottom:4px">💰 Gold Gain</div>
          <div style="font-size:22px;font-weight:800;color:var(--gold)">${asc.goldMult.toFixed(2)}×</div>
        </div>
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:11px;color:var(--dim);margin-bottom:4px">💪 Training</div>
          <div style="font-size:22px;font-weight:800;color:var(--accent)">${asc.trainMult.toFixed(2)}×</div>
        </div>
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:11px;color:var(--dim);margin-bottom:4px">🍀 Luck</div>
          <div style="font-size:22px;font-weight:800;color:var(--accent2)">${asc.luckMult.toFixed(2)}×</div>
        </div>
      </div>
      <div style="font-size:11px;color:var(--dim);border-top:1px solid rgba(255,255,255,0.06);padding-top:10px">
        Next ascension → 📚 ${next.xpMult.toFixed(2)}× · 💰 ${next.goldMult.toFixed(2)}× · 💪 ${next.trainMult.toFixed(2)}× · 🍀 ${next.luckMult.toFixed(2)}×
      </div>
    </div>

    <div class="card" style="background:rgba(0,0,0,0.15);margin-bottom:20px">
      <h3 style="color:var(--dim);font-size:13px;margin-bottom:8px">ℹ️ How Ascension Works</h3>
      <ul style="font-size:12px;color:var(--dim);line-height:1.8;padding-left:16px;margin:0">
        <li>Requires <strong style="color:var(--text)">Level 30</strong> to ascend</li>
        <li>All progress resets (level, gold, stats, techniques)</li>
        <li>Multipliers are <strong style="color:var(--ok)">permanent and stack forever</strong></li>
        <li>Each ascension adds +25% XP, +25% Gold, +25% Training, +10% Luck</li>
        <li>Ascension 10 = 3.5× XP, 3.5× Gold, 2× Luck</li>
      </ul>
    </div>`;

  // Legacy RP section — only shown if player has points to spend
  const legacyHtml = p.rebirthPoints > 0 ? `
    <div style="margin-bottom:8px">
      <h3 style="color:var(--gold)">🏛️ Legacy Points — ${p.rebirthPoints} RP remaining</h3>
      <p style="font-size:11px;color:var(--dim);margin-bottom:12px">From old saves. Spend them here.</p>
    </div>
    <div class="card-grid">
      ${REBIRTH_UPGRADES.map(upgrade => {
        const owned = p.rebirthUpgrades[upgrade.id] || 0;
        const canBuy = canAffordUpgrade(upgrade);
        const maxed = owned >= upgrade.maxLevel;
        return `<div class="card rebirth-upgrade-card">
          <h3>${upgrade.icon} ${upgrade.name}</h3>
          <div class="card-desc">${upgrade.desc}</div>
          <div style="font-size:11px;color:var(--dim);margin:4px 0">${owned}/${upgrade.maxLevel}</div>
          ${maxed
            ? `<span style="color:var(--ok);font-size:12px">✓ Maxed</span>`
            : `<button class="btn-small" onclick="buyRebirthUpgrade('${upgrade.id}')" ${canBuy ? '' : 'disabled'}>${upgrade.cost} RP</button>`}
        </div>`;
      }).join('')}
    </div>` : '';

  container.innerHTML = ascHtml + legacyHtml;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-rebirth')?.addEventListener('click', () => {
    const p = G.player;
    if (p.level < 30) { toast('Requires level 30!', 'warn'); return; }
    if (confirm(`Ascend at level ${p.level}?\n\nYou will gain:\n• +25% XP gain\n• +25% Gold gain\n• +25% Training gains\n• +10% Luck\n\nAll progress resets. Multipliers stack forever.`)) {
      performRebirth();
    }
  });
});
