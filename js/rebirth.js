// ===== ASCENDANT SYSTEM =====
// Bonuses scale with the level you ascend at.
// Higher level = bigger permanent multipliers per ascension.
//
// XP/Gold/Train bonus per ascension (based on level at time of ascend):
//   Lv 30-39 → +5%
//   Lv 40-49 → +10%
//   Lv 50-59 → +15%
//   Lv 60-69 → +20%
//   Lv 70-79 → +25%
//   Lv 80-89 → +30%
//   Lv 90-99 → +35%
//   Lv 100+  → +40%
//
// Luck bonus per ascension:
//   Lv 30-39 → +3%
//   Lv 40-49 → +5%
//   Lv 50-59 → +7%
//   Lv 60-69 → +9%
//   Lv 70-79 → +11%
//   Lv 80-89 → +13%
//   Lv 90-99 → +15%
//   Lv 100+  → +17%

function getAscensionBonusForLevel(level) {
  // Returns { xp, luck } as decimal fractions (e.g. 0.05 = +5%)
  if (level >= 100) return { xp: 0.40, luck: 0.17 };
  if (level >= 90)  return { xp: 0.35, luck: 0.15 };
  if (level >= 80)  return { xp: 0.30, luck: 0.13 };
  if (level >= 70)  return { xp: 0.25, luck: 0.11 };
  if (level >= 60)  return { xp: 0.20, luck: 0.09 };
  if (level >= 50)  return { xp: 0.15, luck: 0.07 };
  if (level >= 40)  return { xp: 0.10, luck: 0.05 };
  return                   { xp: 0.05, luck: 0.03 }; // Lv 30-39
}

// ascensionHistory: array of levels at which each ascension was performed
// e.g. [35, 52, 71] = 3 ascensions at those levels
function getAscensionBonus() {
  const history = G.player.ascensionHistory || [];
  let xpTotal = 0, luckTotal = 0;
  history.forEach(lvl => {
    const b = getAscensionBonusForLevel(lvl);
    xpTotal   += b.xp;
    luckTotal += b.luck;
  });
  return {
    xpMult:    1 + xpTotal,
    goldMult:  1 + xpTotal,   // gold scales same as XP
    trainMult: 1 + xpTotal,   // train scales same as XP
    luckMult:  1 + luckTotal,
  };
}

// Preview what the NEXT ascension would give at current level
function getNextAscensionPreview() {
  const lvl = G.player.level;
  const b = getAscensionBonusForLevel(lvl);
  return b;
}

// Legacy upgrade data — only used if player has leftover RP from old saves
const REBIRTH_UPGRADES = [
  { id: 'xp_boost_1',   name: "Scholar's Mind I",    desc: '+50% XP per level.',          icon: '📚', cost: 1, maxLevel: 5, effect: (l) => ({ xpMult:   1 + l * 0.50 }) },
  { id: 'gold_boost_1', name: "Merchant's Eye I",    desc: '+50% gold per level.',         icon: '💰', cost: 1, maxLevel: 5, effect: (l) => ({ goldMult: 1 + l * 0.50 }) },
  { id: 'stat_boost_1', name: "Warrior's Legacy I",  desc: '+30% all stats per level.',    icon: '⚔️', cost: 2, maxLevel: 5, effect: (l) => ({ statMult: 1 + l * 0.30 }) },
  { id: 'dig_charges',  name: "Excavator's Instinct",desc: '+1 starting dig charge.',      icon: '⛏️', cost: 1, maxLevel: 5, effect: () => ({}) },
  { id: 'xp_boost_2',   name: "Scholar's Mind II",   desc: '+100% XP per level.',         icon: '🎓', cost: 3, maxLevel: 4, effect: (l) => ({ xpMult:   1 + l * 1.0  }), requires: 'xp_boost_1',   requiresLevel: 3 },
  { id: 'gold_boost_2', name: "Merchant's Eye II",   desc: '+100% gold per level.',        icon: '🏦', cost: 3, maxLevel: 4, effect: (l) => ({ goldMult: 1 + l * 1.0  }), requires: 'gold_boost_1', requiresLevel: 3 },
  { id: 'stat_boost_2', name: "Warrior's Legacy II", desc: '+75% all stats per level.',    icon: '🗡️', cost: 4, maxLevel: 4, effect: (l) => ({ statMult: 1 + l * 0.75 }), requires: 'stat_boost_1', requiresLevel: 3 },
  { id: 'stamina_boost',name: 'Iron Lungs',           desc: '+50% max stamina per level.', icon: '⚡', cost: 2, maxLevel: 4, effect: () => ({}), requires: 'stat_boost_1', requiresLevel: 2 },
  { id: 'xp_boost_3',   name: 'Omniscient Mind',     desc: '+200% XP per level.',         icon: '🌟', cost: 6, maxLevel: 3, effect: (l) => ({ xpMult:   1 + l * 2.0  }), requires: 'xp_boost_2',   requiresLevel: 3 },
  { id: 'gold_boost_3', name: 'Golden Touch',         desc: '+200% gold per level.',       icon: '👑', cost: 6, maxLevel: 3, effect: (l) => ({ goldMult: 1 + l * 2.0  }), requires: 'gold_boost_2', requiresLevel: 3 },
  { id: 'stat_boost_3', name: 'Transcendent Power',  desc: '+150% all stats per level.',   icon: '🔱', cost: 8, maxLevel: 3, effect: (l) => ({ statMult: 1 + l * 1.5  }), requires: 'stat_boost_2', requiresLevel: 3 },
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

  // Save things that survive ascension
  const ascendLevel    = p.level;
  const count          = p.rebirthCount + 1;
  const history        = [...(p.ascensionHistory || []), ascendLevel];
  const digUpgrade     = p.rebirthUpgrades['dig_charges'] || 0;
  const heritage       = { ...(p.heritage || {}) };
  const heritageRerolls= { ...(p.heritageRerolls || {}) };
  const heritageSkip   = p.heritageSkipAnim || false;
  const achievements   = [...(p.achievements || [])];

  // Keep heritage techniques (they're re-granted below)
  const keepTechs = [];
  const keepEquipped = [null, null, null, null];

  resetGame();

  // Restore preserved data
  G.player.rebirthCount    = count;
  G.player.ascensionHistory= history;
  G.player.digCharges      = 3 + digUpgrade;
  G.player.heritage        = heritage;
  G.player.heritageRerolls = heritageRerolls;
  G.player.heritageSkipAnim= heritageSkip;
  G.player.techniques      = keepTechs;
  G.player.equipped        = keepEquipped;
  G.player.achievements    = achievements;

  // Re-grant heritage techniques (clan/weapon/style bonuses)
  _reapplyHeritageTechs();

  // After re-granting heritage techs, fill empty equipped slots with them
  // so player doesn't start post-ascension with all empty slots
  const maxSlots = typeof getMaxEquipSlots === 'function' ? getMaxEquipSlots() : 4;
  while (G.player.equipped.length < maxSlots) G.player.equipped.push(null);
  G.player.techniques.forEach(id => {
    if (G.player.equipped.includes(id)) return; // already slotted
    const t = typeof TECHNIQUES !== 'undefined' ? TECHNIQUES.find(x => x.id === id) : null;
    if (!t) return;
    const slot = G.player.equipped.indexOf(null);
    if (slot >= 0) G.player.equipped[slot] = id;
  });

  recalcRebirthMultipliers();
  applyRebirthMultipliers();

  const preview = getAscensionBonusForLevel(ascendLevel);
  const pctXP   = Math.round(preview.xp   * 100);
  const pctLuck = Math.round(preview.luck  * 100);

  _ascensionVFX(count, ascendLevel, pctXP, pctLuck);

  renderRebirthPanel();
  renderTraining();
  renderJobs();
  renderRaids();
  renderStoryChapters();
  renderInventory();
  renderHeritage();
  if (typeof updateTabLockStates === 'function') updateTabLockStates();
}

function _ascensionVFX(count, level, pctXP, pctLuck) {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;

  function spawnParticle(color, angle, dist, size, duration, delay) {
    const p = document.createElement('div');
    p.style.cssText = `position:fixed;z-index:10000;pointer-events:none;border-radius:50%;
      width:${size}px;height:${size}px;background:${color};
      left:${cx}px;top:${cy}px;
      --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
      animation:digBurst ${duration}ms ease-out forwards;animation-delay:${delay}ms;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), duration + delay + 100);
  }

  function flash(color, duration, delay) {
    const f = document.createElement('div');
    f.style.cssText = `position:fixed;inset:0;z-index:9999;pointer-events:none;
      background:${color};animation:digFlash ${duration}ms ease-out forwards;animation-delay:${delay}ms;`;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), duration + delay + 100);
  }

  function floatLabel(text, color, yOffset, delay, fontSize) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `position:fixed;z-index:10001;pointer-events:none;
      left:50%;top:${cy + yOffset}px;transform:translateX(-50%) scale(0.5);
      font-size:${fontSize || 32}px;font-weight:900;color:${color};
      text-shadow:0 0 20px ${color},0 0 40px ${color};white-space:nowrap;
      animation:ascLabelIn 1.4s cubic-bezier(0.34,1.56,0.64,1) forwards;animation-delay:${delay}ms;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600 + delay);
  }

  const GOLD   = ['#f5c542','#ffdd66','#ff9900','#fff9c4','#fff','#ffe082'];
  const PURPLE = ['#b388ff','#7c4dff','#e040fb','#ea80fc','#fff','#ce93d8'];
  const WHITE  = ['#ffffff','#f5f5f5','#e0e0e0','#ffffff'];

  // Phase 0 (0ms) — expanding ring
  const ring = document.createElement('div');
  ring.style.cssText = `position:fixed;z-index:9999;pointer-events:none;border:3px solid rgba(245,197,66,0.6);
    left:${cx}px;top:${cy}px;width:0;height:0;border-radius:50%;transform:translate(-50%,-50%);
    animation:ascRing 1.2s ease-out forwards;`;
  document.body.appendChild(ring);
  setTimeout(() => ring.remove(), 1300);

  // Phase 1 (100ms) — white flash
  flash('rgba(255,255,255,0.95)', 400, 100);

  // Phase 2 (400ms) — gold explosion (80 particles!)
  setTimeout(() => {
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i / 80) + Math.random() * 0.2;
      spawnParticle(GOLD[i % GOLD.length], angle, 100 + Math.random() * 280, 3 + Math.random() * 12, 1000 + Math.random() * 500, 0);
    }
    flash('rgba(245,197,66,0.6)', 700, 0);
  }, 400);

  // Phase 3 (600ms) — purple wave (50 particles)
  setTimeout(() => {
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 2 * i / 50) + Math.random() * 0.4;
      spawnParticle(PURPLE[i % PURPLE.length], angle, 140 + Math.random() * 200, 3 + Math.random() * 9, 900 + Math.random() * 350, 0);
    }
    flash('rgba(124,77,255,0.35)', 500, 0);
  }, 600);

  // Phase 4 (800ms) — white particle burst
  setTimeout(() => {
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i / 30) + Math.random() * 0.6;
      spawnParticle(WHITE[i % WHITE.length], angle, 60 + Math.random() * 160, 2 + Math.random() * 5, 600 + Math.random() * 200, 0);
    }
  }, 800);

  // Phase 5 (900ms) — 16 star ring (rotating)
  setTimeout(() => {
    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i / 16);
      const star = document.createElement('div');
      star.textContent = '✨';
      star.style.cssText = `position:fixed;z-index:10000;pointer-events:none;font-size:24px;
        left:${cx + Math.cos(angle) * 180 - 12}px;top:${cy + Math.sin(angle) * 180 - 12}px;
        animation:ascStarBurst 1.4s ease-out forwards;animation-delay:${i * 35}ms;`;
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 1600 + i * 35);
    }
  }, 900);

  // Phase 6 (1000ms) — screen shake (intense)
  setTimeout(() => {
    const scene = document.getElementById('content') || document.body;
    let t = 0;
    const iv = setInterval(() => {
      const decay = 1 - t / 10;
      const x = (Math.random() - 0.5) * 18 * decay;
      const y = (Math.random() - 0.5) * 12 * decay;
      scene.style.transform = `translate(${x}px,${y}px)`;
      if (++t >= 10) { clearInterval(iv); scene.style.transform = ''; }
    }, 50);
  }, 1000);

  // Phase 7 (1100–1500ms) — floating text labels
  setTimeout(() => floatLabel('✨ ASCENDED ✨',                        '#f5c542', -90, 0, 40), 1100);
  setTimeout(() => floatLabel(`Ascension ×${count}  (Lv.${level})`,   '#fff',    -35, 0, 22), 1300);
  setTimeout(() => floatLabel(`+${pctXP}% XP/Gold  ·  +${pctLuck}% Luck`, '#b388ff', 15, 0, 16), 1500);

  // Phase 8 (1500ms) — final gold flash
  flash('rgba(255,255,255,0.5)', 600, 1500);

  // Phase 9 (1800ms) — trailing sparkle burst + toasts
  setTimeout(() => {
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i / 40) + Math.random() * 0.3;
      spawnParticle(GOLD[i % GOLD.length], angle, 50 + Math.random() * 150, 2 + Math.random() * 7, 700, 0);
    }
    toast(`✨ Ascension ${count}! (Lv.${level}) +${pctXP}% XP/Gold/Train, +${pctLuck}% Luck`, 'rare');
    spawnFloatingText('✨ ASCENDED!', 'float-xp');
  }, 1800);
}

// Re-grant technique unlocks from current heritage after ascension
function _reapplyHeritageTechs() {
  const p = G.player;
  if (!p.heritage) return;

  const sources = [
    p.heritage.clan   ? (typeof CLANS          !== 'undefined' ? CLANS.find(x=>x.id===p.heritage.clan)           : null) : null,
    p.heritage.weapon ? (typeof WEAPONS        !== 'undefined' ? WEAPONS.find(x=>x.id===p.heritage.weapon)       : null) : null,
    p.heritage.style  ? (typeof FIGHTING_STYLES!== 'undefined' ? FIGHTING_STYLES.find(x=>x.id===p.heritage.style): null) : null,
  ];

  sources.forEach(item => {
    if (!item) return;
    if (item.techs) item.techs.forEach(id => grantTechnique(id));
  });
}

function renderRebirthPanel() {
  const p = G.player;
  const asc  = getAscensionBonus();
  const prev = getNextAscensionPreview();
  const pctXP   = Math.round(prev.xp   * 100);
  const pctLuck = Math.round(prev.luck  * 100);

  const btn = document.getElementById('btn-rebirth');
  if (btn) {
    btn.disabled = p.level < 30;
    btn.textContent = p.level < 30
      ? `✨ Ascend (Requires Lv.30 — you are Lv.${p.level})`
      : `✨ Ascend Now (Lv.${p.level}) → +${pctXP}% XP/Gold/Train, +${pctLuck}% Luck`;
  }

  const container = document.getElementById('rebirth-upgrades');
  if (!container) return;

  // Build ascension history display
  const history = p.ascensionHistory || [];
  const historyHtml = history.length > 0
    ? history.map((lvl, i) => {
        const b = getAscensionBonusForLevel(lvl);
        return `<div class="asc-history-row" style="animation-delay:${i * 0.05}s">
          <span>✨ Ascension ${i+1} <span style="color:var(--text)">(Lv.${lvl})</span></span>
          <span style="color:var(--ok)">+${Math.round(b.xp*100)}% XP/Gold · +${Math.round(b.luck*100)}% Luck</span>
        </div>`;
      }).join('')
    : `<div style="font-size:11px;color:var(--dim);font-style:italic">No ascensions yet.</div>`;

  // Scaling table
  const TABLE = [
    [30, 5, 3], [40, 10, 5], [50, 15, 7],
    [60, 20, 9], [70, 25, 11], [80, 30, 13],
    [90, 35, 15], [100, 40, 17],
  ];
  const tableHtml = TABLE.map(([lvl, xp, luck]) => {
    const isCurrent = p.level >= lvl && p.level < (lvl + 10 < 100 ? lvl + 10 : 999);
    const isPast = p.level >= (lvl + 10);
    return `<div class="asc-table-row ${isCurrent ? 'asc-table-current' : ''} ${isPast ? 'asc-table-past' : ''}">
      <span class="asc-table-level">Lv.${lvl}${lvl < 100 ? '–' + (lvl+9) : '+'}</span>
      <span class="asc-table-bonus">+${xp}% XP/Gold/Train · +${luck}% Luck</span>
    </div>`;
  }).join('');

  const starsHtml = history.length > 0
    ? Array.from({length: Math.min(history.length, 10)}, (_, i) => `<span class="asc-star" style="animation-delay:${i * 0.1}s">✨</span>`).join('')
    : '—';

  // Progress to next level bracket
  const currentBracketStart = TABLE.find(([lvl]) => p.level >= lvl && p.level < (lvl + 10 < 100 ? lvl + 10 : 999));
  const nextBracket = TABLE.find(([lvl]) => lvl > p.level);
  const progressToNext = nextBracket ? Math.min(100, Math.floor(((p.level - (currentBracketStart?.[0] || 30)) / (nextBracket[0] - (currentBracketStart?.[0] || 30))) * 100)) : 100;

  const ascHtml = `
    <div class="card asc-main-card" style="border-color:var(--gold);margin-bottom:16px">
      <div class="asc-header">
        <div class="asc-icon-wrap">
          <span class="asc-icon">✨</span>
          <div class="asc-icon-ring"></div>
        </div>
        <div>
          <div class="asc-title">Ascension ×${p.rebirthCount}</div>
          <div class="asc-stars">${starsHtml}</div>
        </div>
      </div>
      <div class="asc-multipliers">
        <div class="asc-mult-card asc-mult-xp">
          <div class="asc-mult-label">📚 XP / 💰 Gold / 💪 Train</div>
          <div class="asc-mult-value" style="color:var(--ok)">${asc.xpMult.toFixed(2)}×</div>
        </div>
        <div class="asc-mult-card asc-mult-luck">
          <div class="asc-mult-label">🍀 Luck</div>
          <div class="asc-mult-value" style="color:var(--accent2)">${asc.luckMult.toFixed(2)}×</div>
        </div>
      </div>
      ${p.level >= 30 ? `
      <div class="asc-next-preview">
        <div class="asc-next-header">
          <span>Next ascension at Lv.${p.level}</span>
          <span class="asc-next-bonus">+${pctXP}% XP/Gold/Train · +${pctLuck}% Luck</span>
        </div>
        <div class="asc-progress-bar">
          <div class="asc-progress-fill" style="width:${progressToNext}%"></div>
        </div>
        <div style="font-size:10px;color:var(--dim);margin-top:4px">Heritage and its techniques are preserved.</div>
      </div>` : `
      <div class="asc-locked-msg">
        Reach Lv.30 to unlock Ascension
      </div>`}
    </div>

    <div class="card asc-section-card">
      <h3 class="asc-section-title">📈 Bonus Scaling Table</h3>
      <div class="asc-table">${tableHtml}</div>
    </div>

    <div class="card asc-section-card">
      <h3 class="asc-section-title">📜 Ascension History</h3>
      <div class="asc-history">${historyHtml}</div>
    </div>

    <div class="card asc-section-card">
      <h3 class="asc-section-title">ℹ️ What carries over</h3>
      <ul class="asc-carryover-list">
        <li class="asc-carryover-yes">✅ Heritage (Clan, Weapon, Style) and their techniques</li>
        <li class="asc-carryover-yes">✅ All ascension multipliers</li>
        <li class="asc-carryover-no">❌ Level, gold, stats, techniques, story progress</li>
      </ul>
    </div>`;

  // Legacy RP — only if player has points
  const legacyHtml = p.rebirthPoints > 0 ? `
    <div class="asc-legacy-header">
      <h3 style="color:var(--gold)">🏛️ Legacy Points — ${p.rebirthPoints} RP</h3>
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
          <div class="asc-upgrade-progress">${owned}/${upgrade.maxLevel}</div>
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
    const pctXP   = Math.round(getAscensionBonusForLevel(p.level).xp   * 100);
    const pctLuck = Math.round(getAscensionBonusForLevel(p.level).luck  * 100);
    showAscensionConfirm(p.level, pctXP, pctLuck);
  });
});

function showAscensionConfirm(level, pctXP, pctLuck) {
  const existing = document.getElementById('asc-confirm-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'asc-confirm-modal';
  modal.style.cssText = `position:fixed;inset:0;z-index:4000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0);backdrop-filter:blur(0px);transition:background 0.3s,backdrop-filter 0.3s`;
  modal.innerHTML = `
    <div class="asc-confirm-card" style="background:var(--bg2);border:1px solid var(--gold);border-radius:14px;padding:28px 32px;min-width:300px;max-width:360px;box-shadow:0 8px 40px rgba(0,0,0,0.6),0 0 40px rgba(245,197,66,0.1);transform:scale(0.85) translateY(20px);opacity:0;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.25s ease;text-align:center">
      <div style="font-size:40px;margin-bottom:8px;filter:drop-shadow(0 0 12px rgba(245,197,66,0.5))">✨</div>
      <div style="font-size:20px;font-weight:800;color:var(--gold);margin-bottom:12px">Ascend at Lv.${level}?</div>
      <div style="background:rgba(0,0,0,0.2);border-radius:10px;padding:14px;margin-bottom:16px;text-align:left">
        <div style="font-size:13px;color:var(--dim);margin-bottom:8px">You will gain:</div>
        <div style="font-size:14px;color:var(--ok);font-weight:700;margin-bottom:4px">+${pctXP}% XP, Gold, and Training gains</div>
        <div style="font-size:14px;color:var(--accent2);font-weight:700;margin-bottom:8px">+${pctLuck}% Luck</div>
        <div style="font-size:11px;color:var(--dim);border-top:1px solid rgba(255,255,255,0.06);padding-top:8px;margin-top:4px">
          ✅ Heritage preserved<br>❌ All other progress resets
        </div>
      </div>
      <div style="display:flex;gap:10px">
        <button id="asc-confirm-yes" class="btn-primary" style="flex:1;background:linear-gradient(135deg,var(--gold),#ff9900);border:none;color:#111;font-weight:700">✨ Ascend</button>
        <button id="asc-confirm-no" class="btn-small" style="flex:1">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => {
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.backdropFilter = 'blur(4px)';
    const card = modal.querySelector('.asc-confirm-card');
    if (card) {
      card.style.transform = 'scale(1) translateY(0)';
      card.style.opacity = '1';
    }
  });

  function close() {
    const card = modal.querySelector('.asc-confirm-card');
    if (card) {
      card.style.transform = 'scale(0.9)';
      card.style.opacity = '0';
      card.style.transition = 'transform 0.2s ease, opacity 0.15s ease';
    }
    modal.style.background = 'rgba(0,0,0,0)';
    modal.style.backdropFilter = 'blur(0px)';
    setTimeout(() => modal.remove(), 250);
  }

  modal.querySelector('#asc-confirm-yes').addEventListener('click', () => { close(); setTimeout(performRebirth, 280); });
  modal.querySelector('#asc-confirm-no').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
}
