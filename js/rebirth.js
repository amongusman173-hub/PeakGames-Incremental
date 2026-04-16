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

  // Keep vessel_switch technique (Sukuna's Finger) — it's a permanent unlock
  const keepTechs = (p.techniques || []).filter(id => id === 'vessel_switch');
  // Keep equipped slots that reference kept techniques
  const keepEquipped = (p.equipped || [null,null,null,null]).map(id =>
    keepTechs.includes(id) ? id : null
  );

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

  // Re-grant heritage techniques (clan/weapon/style bonuses)
  _reapplyHeritageTechs();

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
      left:50%;top:${cy + yOffset}px;transform:translateX(-50%);
      font-size:${fontSize || 32}px;font-weight:900;color:${color};
      text-shadow:0 0 20px ${color},0 0 40px ${color};white-space:nowrap;
      animation:floatUp 1.4s ease-out forwards;animation-delay:${delay}ms;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600 + delay);
  }

  const GOLD   = ['#f5c542','#ffdd66','#ff9900','#fff9c4','#fff','#ffe082'];
  const PURPLE = ['#b388ff','#7c4dff','#e040fb','#ea80fc','#fff','#ce93d8'];

  // Phase 1 — white flash
  flash('rgba(255,255,255,0.95)', 400, 0);

  // Phase 2 (300ms) — gold explosion
  setTimeout(() => {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i / 60) + Math.random() * 0.3;
      spawnParticle(GOLD[i % GOLD.length], angle, 80 + Math.random() * 220, 4 + Math.random() * 10, 900 + Math.random() * 400, 0);
    }
    flash('rgba(245,197,66,0.55)', 600, 0);
  }, 300);

  // Phase 3 (500ms) — purple wave
  setTimeout(() => {
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i / 40) + Math.random() * 0.5;
      spawnParticle(PURPLE[i % PURPLE.length], angle, 120 + Math.random() * 180, 3 + Math.random() * 8, 800 + Math.random() * 300, 0);
    }
    flash('rgba(124,77,255,0.3)', 500, 0);
  }, 500);

  // Phase 4 (700ms) — 12 star ring
  setTimeout(() => {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i / 12);
      const star = document.createElement('div');
      star.textContent = '✨';
      star.style.cssText = `position:fixed;z-index:10000;pointer-events:none;font-size:24px;
        left:${cx + Math.cos(angle) * 160 - 12}px;top:${cy + Math.sin(angle) * 160 - 12}px;
        animation:floatUp 1.2s ease-out forwards;animation-delay:${i * 40}ms;`;
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 1400 + i * 40);
    }
  }, 700);

  // Phase 5 (800ms) — screen shake
  setTimeout(() => {
    const scene = document.getElementById('content') || document.body;
    let t = 0;
    const iv = setInterval(() => {
      const x = (Math.random() - 0.5) * 14 * (1 - t / 8);
      const y = (Math.random() - 0.5) * 8  * (1 - t / 8);
      scene.style.transform = `translate(${x}px,${y}px)`;
      if (++t >= 8) { clearInterval(iv); scene.style.transform = ''; }
    }, 60);
  }, 800);

  // Phase 6 (900–1300ms) — floating text labels
  setTimeout(() => floatLabel('✨ ASCENDED ✨',                        '#f5c542', -80, 0, 36), 900);
  setTimeout(() => floatLabel(`Ascension ×${count}  (Lv.${level})`,   '#fff',    -30, 0, 20), 1100);
  setTimeout(() => floatLabel(`+${pctXP}% XP/Gold  ·  +${pctLuck}% Luck`, '#b388ff', 20, 0, 16), 1300);

  // Phase 7 (1200ms) — final white fade
  flash('rgba(255,255,255,0.6)', 800, 1200);

  // Phase 8 (1600ms) — trailing gold burst + toasts
  setTimeout(() => {
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i / 30) + Math.random() * 0.4;
      spawnParticle(GOLD[i % GOLD.length], angle, 60 + Math.random() * 140, 3 + Math.random() * 6, 600, 0);
    }
    toast(`✨ Ascension ${count}! (Lv.${level}) +${pctXP}% XP/Gold/Train, +${pctLuck}% Luck`, 'rare');
    spawnFloatingText('✨ ASCENDED!', 'float-xp');
  }, 1600);
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
    if (item._gojo && typeof GOJO_TECHNIQUES !== 'undefined') {
      GOJO_TECHNIQUES.forEach(t => {
        if (!TECHNIQUES.find(x => x.id === t.id)) TECHNIQUES.push(t);
      });
      ['infinity','reversal_red','lapse_blue','hollow_purple','domain_infinite_void'].forEach(id => grantTechnique(id));
    }
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
        return `<div style="font-size:11px;color:var(--dim);display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.04)">
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
    const isNext = p.level >= lvl && p.level < (lvl + 10 < 100 ? lvl + 10 : 999);
    return `<div style="display:flex;justify-content:space-between;font-size:11px;padding:3px 6px;border-radius:4px;${isNext ? 'background:rgba(108,159,255,0.12);color:var(--text)' : 'color:var(--dim)'}">
      <span>Lv.${lvl}${lvl < 100 ? '–' + (lvl+9) : '+'}</span>
      <span>+${xp}% XP/Gold/Train · +${luck}% Luck</span>
    </div>`;
  }).join('');

  const starsHtml = history.length > 0
    ? Array.from({length: Math.min(history.length, 10)}, () => '✨').join('')
    : '—';

  const ascHtml = `
    <div class="card" style="border-color:var(--gold);background:rgba(245,197,66,0.07);margin-bottom:16px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="font-size:36px">✨</div>
        <div>
          <div style="font-size:18px;font-weight:800;color:var(--gold)">Ascension ×${p.rebirthCount}</div>
          <div style="font-size:12px;color:var(--dim);margin-top:2px">${starsHtml}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--dim);margin-bottom:4px">📚 XP / 💰 Gold / 💪 Train</div>
          <div style="font-size:20px;font-weight:800;color:var(--ok)">${asc.xpMult.toFixed(2)}×</div>
        </div>
        <div style="background:rgba(0,0,0,0.2);border-radius:8px;padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--dim);margin-bottom:4px">🍀 Luck</div>
          <div style="font-size:20px;font-weight:800;color:var(--accent2)">${asc.luckMult.toFixed(2)}×</div>
        </div>
      </div>
      ${p.level >= 30 ? `
      <div style="background:rgba(108,159,255,0.1);border:1px solid rgba(108,159,255,0.25);border-radius:8px;padding:10px;margin-bottom:12px">
        <div style="font-size:11px;color:var(--dim);margin-bottom:4px">Next ascension at Lv.${p.level} gives:</div>
        <div style="font-size:14px;font-weight:700;color:var(--accent)">+${pctXP}% XP / Gold / Train &nbsp;·&nbsp; +${pctLuck}% Luck</div>
        <div style="font-size:10px;color:var(--dim);margin-top:4px">Heritage, vessel_switch, and equipped slots are preserved.</div>
      </div>` : ''}
    </div>

    <div class="card" style="background:rgba(0,0,0,0.15);margin-bottom:16px">
      <h3 style="color:var(--dim);font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">📈 Bonus Scaling Table</h3>
      <div style="display:flex;flex-direction:column;gap:2px">${tableHtml}</div>
    </div>

    <div class="card" style="background:rgba(0,0,0,0.15);margin-bottom:16px">
      <h3 style="color:var(--dim);font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">📜 Ascension History</h3>
      <div style="display:flex;flex-direction:column;gap:2px">${historyHtml}</div>
    </div>

    <div class="card" style="background:rgba(0,0,0,0.12);margin-bottom:16px">
      <h3 style="color:var(--dim);font-size:12px;margin-bottom:8px">ℹ️ What carries over</h3>
      <ul style="font-size:12px;color:var(--dim);line-height:1.9;padding-left:16px;margin:0">
        <li>✅ Heritage (Clan, Weapon, Style) and their techniques</li>
        <li>✅ Vessel Switch (Sukuna's Finger)</li>
        <li>✅ All ascension multipliers</li>
        <li>❌ Level, gold, stats, other techniques, story progress</li>
      </ul>
    </div>`;

  // Legacy RP — only if player has points
  const legacyHtml = p.rebirthPoints > 0 ? `
    <div style="margin-bottom:8px">
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
    const pctXP   = Math.round(getAscensionBonusForLevel(p.level).xp   * 100);
    const pctLuck = Math.round(getAscensionBonusForLevel(p.level).luck  * 100);
    if (confirm(
      `Ascend at level ${p.level}?\n\n` +
      `You will gain:\n` +
      `• +${pctXP}% XP, Gold, and Training gains\n` +
      `• +${pctLuck}% Luck\n\n` +
      `Heritage, vessel_switch, and equipped slots are preserved.\n` +
      `All other progress resets. Multipliers stack forever.`
    )) {
      performRebirth();
    }
  });
});
