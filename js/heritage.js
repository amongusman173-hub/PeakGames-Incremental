// ===== HERITAGE SYSTEM =====
// Roll for Clan, Weapon, and Fighting Technique.
// Each gives stat bonuses and unlocks special techniques.

// ── CLANS ──
const CLANS = [
  // Common (60%)
  { id: 'iron_clan',    name: 'Iron Clan',       icon: '⚙️', rarity: 'common',    weight: 20, desc: 'Sturdy warriors of the forge.',    bonus: { def: 15, maxHp: 50 },   techs: [] },
  { id: 'swift_clan',   name: 'Swift Clan',       icon: '💨', rarity: 'common',    weight: 20, desc: 'Agile hunters of the plains.',     bonus: { spd: 12, atk: 8 },      techs: [] },
  { id: 'stone_clan',   name: 'Stone Clan',       icon: '🪨', rarity: 'common',    weight: 20, desc: 'Enduring mountain dwellers.',      bonus: { maxHp: 80, def: 10 },   techs: [] },
  // Uncommon (25%)
  { id: 'shadow_clan',  name: 'Shadow Clan',      icon: '🌑', rarity: 'uncommon',  weight: 10, desc: 'Assassins who strike from darkness.',bonus: { atk: 25, spd: 15 },    techs: ['quick_step'] },
  { id: 'flame_clan',   name: 'Flame Clan',       icon: '🔥', rarity: 'uncommon',  weight: 8,  desc: 'Fire wielders of the volcano.',    bonus: { atk: 30, def: 5 },      techs: ['flame_burst'] },
  { id: 'storm_clan',   name: 'Storm Clan',       icon: '⚡', rarity: 'uncommon',  weight: 7,  desc: 'Lightning-fast warriors.',         bonus: { spd: 25, atk: 20 },     techs: ['spark'] },
  // Rare (12%)
  { id: 'dragon_clan',  name: 'Dragon Clan',      icon: '🐉', rarity: 'rare',      weight: 4,  desc: 'Descendants of ancient dragons.',  bonus: { atk: 40, def: 20, maxHp: 100 }, techs: ['hellfire'] },
  { id: 'void_clan',    name: 'Void Clan',        icon: '🌀', rarity: 'rare',      weight: 3,  desc: 'Masters of dimensional magic.',    bonus: { atk: 35, spd: 20 },     techs: ['void_rend'] },
  { id: 'celestial_clan',name:'Celestial Clan',   icon: '✨', rarity: 'rare',      weight: 3,  desc: 'Blessed by the heavens.',          bonus: { def: 30, maxHp: 150 },  techs: ['divine_heal'] },
  // Legendary (2.5%)
  { id: 'demon_clan',   name: 'Demon Clan',       icon: '😈', rarity: 'legendary', weight: 1,  desc: 'Cursed bloodline of the underworld.',bonus: { atk: 60, spd: 30 },   techs: ['hellfire', 'void_rend'] },
  { id: 'god_clan',     name: 'God Clan',         icon: '🌟', rarity: 'legendary', weight: 0.5,desc: 'Divine blood flows through you.',  bonus: { atk: 50, def: 40, maxHp: 200 }, techs: ['holy_slash', 'divine_heal'] },
  // SECRET (~0.1%)
  { id: 'ethereal_clan', name: 'Ethereal Clan',   icon: '🪐', rarity: 'secret',    weight: 0.1, desc: 'Born between worlds. Reality bends to your will.',
    bonus: { atk: 100, def: 80, spd: 60, maxHp: 500 },
    techs: ['astral_slash', 'chrono_strike', 'void_nova', 'celestial_wrath', 'nexus_storm'] },
];

// ── WEAPONS ──
const WEAPONS = [
  { id: 'fists',        name: 'Bare Fists',       icon: '👊', rarity: 'common',    weight: 20, desc: 'Raw power, no weapon needed.',     bonus: { atk: 5 },               techs: ['iron_fist'] },
  { id: 'sword',        name: 'Iron Sword',        icon: '⚔️', rarity: 'common',    weight: 18, desc: 'A reliable blade.',                bonus: { atk: 12 },              techs: ['slash'] },
  { id: 'bow',          name: 'Longbow',           icon: '🏹', rarity: 'common',    weight: 15, desc: 'Strike from a distance.',          bonus: { atk: 10, spd: 8 },      techs: [] },
  { id: 'staff',        name: 'Magic Staff',       icon: '🪄', rarity: 'uncommon',  weight: 10, desc: 'Channel magical energy.',          bonus: { atk: 15 },              techs: ['arcane_bolt'] },
  { id: 'dual_blades',  name: 'Dual Blades',       icon: '🗡️', rarity: 'uncommon',  weight: 8,  desc: 'Two blades, twice the cuts.',      bonus: { atk: 18, spd: 10 },     techs: ['fang_strike'] },
  { id: 'greatsword',   name: 'Greatsword',        icon: '🔱', rarity: 'rare',      weight: 5,  desc: 'Massive blade, massive damage.',   bonus: { atk: 35, def: -5 },     techs: ['power_strike'] },
  { id: 'void_blade',   name: 'Void Blade',        icon: '🌑', rarity: 'legendary', weight: 1,  desc: 'A blade forged from void energy.', bonus: { atk: 60, spd: 20 },     techs: ['void_rend', 'shadow_clone'] },
  { id: 'starfire_staff',name:'Starfire Staff',    icon: '🌟', rarity: 'secret',    weight: 0.1,desc: 'Forged from a dying star.',       bonus: { atk: 80, spd: 50 },    techs: ['celestial_wrath', 'nexus_storm'] },
];

// ── FIGHTING TECHNIQUES ──
const FIGHTING_STYLES = [
  { id: 'brawler',      name: 'Brawler',           icon: '🥊', rarity: 'common',    weight: 20, desc: 'Raw, unrefined fighting.',         bonus: { atk: 8 },               techs: ['iron_fist'] },
  { id: 'swordsman',    name: 'Swordsman',         icon: '⚔️', rarity: 'common',    weight: 18, desc: 'Classical blade techniques.',      bonus: { atk: 10, def: 5 },      techs: ['slash'] },
  { id: 'assassin_style',name:'Assassin Style',    icon: '🗡️', rarity: 'uncommon',  weight: 10, desc: 'Strike fast, strike true.',        bonus: { atk: 15, spd: 12 },     techs: ['leg_sweep', 'quick_step'] },
  { id: 'berserker_style',name:'Berserker Style',  icon: '😤', rarity: 'uncommon',  weight: 8,  desc: 'Abandon defense, maximize offense.',bonus: { atk: 25, def: -8 },    techs: ['berserker_rush'] },
  { id: 'guardian_style',name:'Guardian Style',    icon: '🛡️', rarity: 'uncommon',  weight: 8,  desc: 'Defense is the best offense.',     bonus: { def: 20, maxHp: 80 },   techs: ['counter'] },
  { id: 'shadow_style', name: 'Shadow Style',      icon: '👤', rarity: 'rare',      weight: 5,  desc: 'Move like a ghost.',               bonus: { spd: 20, atk: 15 },     techs: ['shadow_clone', 'death_blow'] },
  { id: 'void_style',   name: 'Void Style',        icon: '🌀', rarity: 'legendary', weight: 1,  desc: 'Harness the power of nothingness.', bonus: { atk: 40, spd: 25 },    techs: ['void_rend', 'thousand_fists'] },
  { id: 'astral_style', name: 'Astral Style',      icon: '✨', rarity: 'secret',    weight: 0.1,desc: 'Commands the fabric of spacetime.', bonus: { atk: 70, def: 60, spd: 40 }, techs: ['astral_slash', 'chrono_strike'] },
];

// ── CELESTIAL TECHNIQUES ──
// Added to TECHNIQUES array on grant
const CELESTIAL_TECHNIQUES = [
  { id: 'astral_slash',       name: 'Astral Slash',        icon: '✨', rarity: 'legendary', desc: 'Rend spacetime itself. Immune to damage for 2 turns.', effect: 'shield', shieldTurns: 2, bonus: { def: 50 } },
  { id: 'chrono_strike',      name: 'Chrono Strike',       icon: '⏳', rarity: 'legendary', desc: 'Slow enemy time — massive damage.', effect: 'damage', multiplier: 3.5, bonus: { atk: 40 }, _upgradable: true, _upgradeId: 'chrono_strike_max' },
  { id: 'chrono_strike_max',  name: 'Chrono Strike MAX',   icon: '⏳', rarity: 'legendary', desc: 'Time dilation amplified — triple the force.', effect: 'damage', multiplier: 6.0, bonus: { atk: 60 } },
  { id: 'void_nova',          name: 'Void Nova',           icon: '🌑', rarity: 'legendary', desc: 'Collapse matter into a singularity.', effect: 'stun', multiplier: 3.0, bonus: { atk: 35, spd: 20 }, _upgradable: true, _upgradeId: 'void_nova_max' },
  { id: 'void_nova_max',      name: 'Void Nova MAX',       icon: '🌑', rarity: 'legendary', desc: 'Singularity collapses inward — devastating.', effect: 'multi', hits: 4, multiplier: 2.0, bonus: { atk: 50, spd: 30 } },
  { id: 'celestial_wrath',    name: 'Celestial Wrath',     icon: '⚡', rarity: 'legendary', desc: 'Channel the fury of dying stars.', effect: 'damage', multiplier: 8.0, bonus: { atk: 80, critChance: 0.5 } },
  { id: 'nexus_storm',        name: 'Nexus Storm',         icon: '🌀', rarity: 'legendary', desc: 'Unleash a cosmic tempest. Stuns 3 turns + massive damage.', effect: 'stun', multiplier: 5.0, bonus: { atk: 100, def: 50, spd: 50, critChance: 0.5 } },
];

// Track upgrade counts for Chrono Strike / Void Nova
const celestialUpgradeCounts = { chrono_strike: 0, void_nova: 0 };

// ── ROLL SYSTEM ──
function weightedRoll(pool) {
  const total = pool.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const item of pool) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return pool[pool.length - 1];
}

// Lock to prevent double-rolling when clicking multiple buttons quickly
const _heritageRolling = { clan: false, weapon: false, style: false };

function rollHeritage(category) {
  if (_heritageRolling[category]) return;
  _heritageRolling[category] = true;

  const p = G.player;
  if (!p.heritage) p.heritage = {};
  const cost = getHeritageCost(category);
  if (!spendGold(cost)) { toast('Not enough gold!', 'warn'); _heritageRolling[category] = false; return; }

  // ── Confirm before rolling over legendary/secret ──
  const currentId = p.heritage[category];
  if (currentId) {
    const current = getHeritageItem(category, currentId);
    if (current && (current.rarity === 'legendary' || current.rarity === 'secret')) {
      const rarityLabel = current.rarity === 'secret' ? '🔴 SECRET' : '🌟 LEGENDARY';
      const confirmed = window.confirm(
        `⚠️ You currently have ${rarityLabel}: ${current.icon} ${current.name}\n\nRe-rolling will permanently replace it. Are you sure?`
      );
      if (!confirmed) {
        p.gold += cost;
        _heritageRolling[category] = false;
        return;
      }
    }
  }

  // Always play the reel animation
  _runReelAnimation(category);
}

function _getPoolForCategory(category) {
  if (category === 'clan') return CLANS;
  if (category === 'weapon') return WEAPONS;
  if (category === 'style') return FIGHTING_STYLES;
  return [];
}

function _runReelAnimation(category) {
  const pool = _getPoolForCategory(category);
  if (!pool.length) return;

  const cardEl = document.querySelector(`.heritage-card[data-cat="${category}"]`);
  if (!cardEl) { _doHeritageRoll(category); _heritageRolling[category] = false; return; }

  const reelWrap = cardEl.querySelector('.heritage-reel-wrap');
  if (!reelWrap) { _doHeritageRoll(category); _heritageRolling[category] = false; return; }

  const result = weightedRoll(pool);
  const stripItems = [];
  for (let i = 0; i < 50; i++) stripItems.push(pool[Math.floor(Math.random() * pool.length)]);
  stripItems.push(result);

  const itemH = 72;
  const totalItems = stripItems.length;

  const reelStrip = document.createElement('div');
  reelStrip.className = 'heritage-reel-strip';
  reelStrip.innerHTML = stripItems.map((item, i) => `
    <div class="heritage-reel-item ${i === totalItems - 1 ? 'heritage-reel-final' : ''}" data-rarity="${item.rarity}">
      <span class="heritage-reel-icon">${item.icon}</span>
      <span class="heritage-reel-name">${item.name}</span>
    </div>
  `).join('');

  reelWrap.innerHTML = '';
  reelWrap.appendChild(reelStrip);

  const targetY = -(totalItems - 1) * itemH;

  // Phase 1: Fast spin (0 - 2s)
  reelStrip.style.transition = 'none';
  reelStrip.style.transform = 'translateY(0px)';

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const fastTarget = targetY + itemH * 5;
      reelStrip.style.transition = 'transform 2s cubic-bezier(0.1, 0.7, 0.3, 1)';
      reelStrip.style.transform = `translateY(${fastTarget}px)`;

      // Phase 2: Slow crawl to final (at 2s)
      setTimeout(() => {
        reelStrip.style.transition = 'transform 1.8s cubic-bezier(0.05, 0.9, 0.3, 1)';
        reelStrip.style.transform = `translateY(${targetY}px)`;
      }, 2000);
    });
  });

  // Dim passed items periodically
  const dimTimer = setInterval(() => {
    const items = reelStrip.querySelectorAll('.heritage-reel-item:not(.heritage-reel-final)');
    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      const wrapRect = reelWrap.getBoundingClientRect();
      const center = wrapRect.top + wrapRect.height / 2;
      if (Math.abs(rect.top + rect.height / 2 - center) > itemH * 1.2) {
        el.classList.add('heritage-reel-item-passed');
      }
    });
  }, 80);

  // When animation ends, apply the roll and bounce
  setTimeout(() => {
    clearInterval(dimTimer);
    _doHeritageRoll(category);
    _heritageRolling[category] = false;
    renderHeritage();
    const finalEl = reelWrap.querySelector('.heritage-reel-final');
    if (finalEl) {
      finalEl.classList.add('heritage-reel-stopped');
      setTimeout(() => finalEl.classList.remove('heritage-reel-stopped'), 500);
    }
  }, 3900);
}

function _doHeritageRoll(category) {
  const p = G.player;
  let result;
  if (category === 'clan')    result = weightedRoll(CLANS);
  if (category === 'weapon')  result = weightedRoll(WEAPONS);
  if (category === 'style')   result = weightedRoll(FIGHTING_STYLES);
  if (!result) return;

  // ── Remove techniques from the OLD heritage item being replaced ──
  const oldId = p.heritage[category];
  if (oldId) {
    const oldItem = getHeritageItem(category, oldId);
    if (oldItem && oldItem.techs && oldItem.techs.length > 0) {
      const otherCats = ['clan','weapon','style'].filter(c => c !== category);
      const stillGranted = new Set();
      otherCats.forEach(cat => {
        const otherId = p.heritage[cat];
        if (!otherId) return;
        const other = getHeritageItem(cat, otherId);
        if (other && other.techs) other.techs.forEach(id => stillGranted.add(id));
      });
      stillGranted.add('astral_slash');
      const toRemove = oldItem.techs.filter(id => !stillGranted.has(id));
      if (toRemove.length > 0) {
        p.techniques = p.techniques.filter(id => !toRemove.includes(id));
        p.equipped   = p.equipped.map(id => toRemove.includes(id) ? null : id);
        invalidateStatCache();
      }
    }
  }

  // ── Apply new heritage ──
  p.heritage[category] = result.id;
  if (!p.heritageRerolls) p.heritageRerolls = {};
  p.heritageRerolls[category] = (p.heritageRerolls[category] || 0) + 1;
  invalidateStatCache();
  recalcStats();
  p.hp = Math.min(p.hp + (result.bonus?.maxHp || 0), p.maxHp);

  if (result.techs) result.techs.forEach(id => grantTechnique(id));

  toast(`${result.icon} ${result.name} — ${result.rarity.toUpperCase()}!`, result.rarity === 'secret' || result.rarity === 'legendary' ? 'rare' : 'success');
  playSound('rollingspin sound');

  // VFX
  const colors = { common:['#aaa','#ccc','#fff'], uncommon:['#6c9fff','#88aaff','#fff'], rare:['#b06aff','#cc88ff','#fff'], legendary:['#f5c542','#ffdd66','#ff9900','#fff'], secret:['#ff1744','#b71c1c','#fff','#ff8a80'] }[result.rarity] || ['#fff'];
  const count = result.rarity === 'secret' ? 50 : result.rarity === 'legendary' ? 35 : result.rarity === 'rare' ? 22 : 12;
  const spread = result.rarity === 'secret' ? 130 : result.rarity === 'legendary' ? 100 : 70;
  const anchor = document.querySelector(`.heritage-card[data-cat="${category}"]`) || document.querySelector('.heritage-card') || document.getElementById('heritage-container');
  if (anchor && !G.player.heritageSkipAnim) {
    const rect = anchor.getBoundingClientRect();
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const angle = (Math.PI * 2 * i / count) + Math.random() * 0.8;
      const dist = spread * (0.5 + Math.random() * 0.8);
      const size = 4 + Math.random() * 8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `position:fixed;z-index:9998;pointer-events:none;border-radius:50%;width:${size}px;height:${size}px;background:${color};left:${cx}px;top:${cy}px;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;animation:digBurst 0.7s ease-out forwards;animation-delay:${Math.random()*0.1}s;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }
  }
  if (result.rarity === 'secret') { const f = document.createElement('div'); f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;background:rgba(180,0,0,0.45);animation:digFlash 0.8s ease-out forwards;`; document.body.appendChild(f); setTimeout(() => f.remove(), 900); }
  else if (result.rarity === 'legendary') { const f = document.createElement('div'); f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;background:rgba(245,197,66,0.25);animation:digFlash 0.6s ease-out forwards;`; document.body.appendChild(f); setTimeout(() => f.remove(), 700); }
  else if (result.rarity === 'rare') { const f = document.createElement('div'); f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;background:rgba(176,106,255,0.2);animation:digFlash 0.5s ease-out forwards;`; document.body.appendChild(f); setTimeout(() => f.remove(), 600); }

  spawnFloatingText(result.icon, 'float-xp');
}

// ── Heritage Cost ──
const HERITAGE_RARITY_ORDER = ['common', 'uncommon', 'rare', 'legendary', 'secret'];

function getHeritageCost(category) {
  const p = G.player;
  const rerolls = (p.heritageRerolls && p.heritageRerolls[category]) || 0;
  const base = { clan: 1500, weapon: 1000, style: 1000 };
  return Math.floor((base[category] || 1500) * Math.pow(1.3, rerolls));
}

function getHeritageItem(category, id) {
  if (category === 'clan')   return CLANS.find(x => x.id === id);
  if (category === 'weapon') return WEAPONS.find(x => x.id === id);
  if (category === 'style')  return FIGHTING_STYLES.find(x => x.id === id);
  return null;
}

// Called from combat when using Chrono Strike/Void Nova — track upgrade count
function useCelestialTech(techId) {
  if (techId === 'chrono_strike' || techId === 'void_nova') {
    celestialUpgradeCounts[techId] = (celestialUpgradeCounts[techId] || 0) + 1;
    if (celestialUpgradeCounts[techId] >= 3) {
      const maxId = techId + '_max';
      if (!G.player.techniques.includes(maxId)) {
        grantTechnique(maxId);
        toast(`✨ ${techId === 'chrono_strike' ? 'Chrono Strike MAX' : 'Void Nova MAX'} unlocked!`, 'rare');
      }
    }
  }
}

// ── RARITY HELPERS ──
const RARITY_META = {
  common:    { color: '#5a6a8a', label: 'COMMON',    borderGlow: 'none',                                       bg: 'rgba(90,106,138,0.08)' },
  uncommon:  { color: '#6c9fff', label: 'UNCOMMON',  borderGlow: '0 0 8px rgba(108,159,255,0.4)',              bg: 'rgba(108,159,255,0.08)' },
  rare:      { color: '#b06aff', label: 'RARE',       borderGlow: '0 0 12px rgba(176,106,255,0.5)',            bg: 'rgba(176,106,255,0.08)' },
  legendary: { color: '#f5c542', label: 'LEGENDARY',  borderGlow: '0 0 16px rgba(245,197,66,0.6), 0 0 32px rgba(245,197,66,0.2)', bg: 'rgba(245,197,66,0.08)' },
  secret:    { color: '#ff1744', label: 'SECRET',     borderGlow: '0 0 16px rgba(255,23,68,0.6), 0 0 32px rgba(255,23,68,0.3)', bg: 'rgba(255,23,68,0.08)' },
};

function _rarityPulseClass(rarity) {
  if (rarity === 'legendary') return 'heritage-card--legendary';
  if (rarity === 'secret')    return 'heritage-card--secret';
  return '';
}

// ── STAT BONUS FORMATTING ──
const HERITAGE_STAT_LABELS = { atk: '⚔️ ATK', def: '🛡️ DEF', spd: '💨 SPD', maxHp: '❤️ HP', critChance: '🎯 CRT' };
function _formatBonusPills(bonus) {
  if (!bonus) return '';
  return Object.entries(bonus).map(([k, v]) => {
    const label = HERITAGE_STAT_LABELS[k] || k.toUpperCase();
    const sign = v > 0 ? '+' : '';
    const cls = v < 0 ? 'bonus-negative' : '';
    return `<span class="heritage-pill ${cls}">${sign}${v} ${label}</span>`;
  }).join('');
}

// ── RENDER ──
function renderHeritage() {
  const container = document.getElementById('heritage-container');
  if (!container) return;
  const p = G.player;
  if (!p.heritage) p.heritage = {};
  if (!p.heritageRerolls) p.heritageRerolls = {};

  const categories = [
    { key: 'clan',   label: '🏰 Clan',              pool: CLANS,          desc: 'Bloodline. Grants stat bonuses and techniques.' },
    { key: 'weapon', label: '⚔️ Weapon',             pool: WEAPONS,        desc: 'Weapon mastery. Grants ATK bonuses and techniques.' },
    { key: 'style',  label: '🥋 Fighting Style',    pool: FIGHTING_STYLES, desc: 'Combat style. Grants unique techniques.' },
  ];

  // ── Category columns ──
  const catHtml = categories.map(cat => {
    const currentId = p.heritage[cat.key];
    const current   = currentId ? getHeritageItem(cat.key, currentId) : null;
    const cost      = getHeritageCost(cat.key);
    const rerolls   = p.heritageRerolls[cat.key] || 0;
    const meta      = current ? RARITY_META[current.rarity] : null;
    const pulseClass = current ? _rarityPulseClass(current.rarity) : '';

    const hasTech = current && current.techs && current.techs.length > 0;

    return `<div class="heritage-card ${pulseClass}" data-cat="${cat.key}">
      <div class="heritage-card-header">
        <span class="heritage-card-label">${cat.label}</span>
        <span class="heritage-card-sub">${cat.desc}</span>
      </div>

      ${current ? `
        <div class="heritage-item-card" style="border-color:${meta.color};box-shadow:${meta.borderGlow};background:${meta.bg}">
          <div class="heritage-item-top">
            <span class="heritage-item-icon">${current.icon}</span>
            <div class="heritage-item-text">
              <span class="heritage-item-name" style="color:${meta.color}">${current.name}</span>
              <span class="heritage-item-rarity" style="color:${meta.color}">${meta.label}</span>
            </div>
          </div>
          <div class="heritage-item-desc">${current.desc}</div>
          <div class="heritage-item-bonuses">${_formatBonusPills(current.bonus)}</div>
          ${hasTech ? `<div class="heritage-item-techs">${current.techs.map(id => {
            const t = typeof TECHNIQUES !== 'undefined' ? TECHNIQUES.find(x => x.id === id) : null;
            return t ? `<span class="heritage-tech-tag" title="${t.name}">${t.icon}</span>` : '';
          }).join('')}</div>` : ''}
        </div>
      ` : `
        <div class="heritage-item-card heritage-item-empty">
          <div class="heritage-empty-icon">🎲</div>
          <div class="heritage-empty-text">Not yet rolled</div>
        </div>
      `}

      <div class="heritage-reel-wrap">
        <!-- Reel animation injected here during roll -->
      </div>

      <div class="heritage-card-footer">
        <div class="heritage-cost-display">
          <span class="heritage-cost-label">Cost</span>
          <span class="heritage-cost-value">💰 ${_fmtGold(cost)}</span>
          ${rerolls > 0 ? `<span class="heritage-reroll-count">${rerolls}×</span>` : ''}
        </div>
        <button class="btn-primary heritage-roll-btn" onclick="rollHeritage('${cat.key}')" ${p.gold >= cost ? '' : 'disabled'}>
          ${current ? '🎲 Re-roll' : '🎲 Roll'}
        </button>
      </div>
    </div>`;
  }).join('');

  // ── Total stat bonus summary ──
  const totalBonus = { atk: 0, def: 0, spd: 0, maxHp: 0 };
  for (const cat of categories) {
    const id = p.heritage[cat.key];
    if (!id) continue;
    const item = getHeritageItem(cat.key, id);
    if (item && item.bonus) {
      for (const [k, v] of Object.entries(item.bonus)) {
        if (totalBonus[k] !== undefined) totalBonus[k] += v;
      }
    }
  }
  const hasAnyHeritage = categories.some(cat => p.heritage[cat.key]);
  const bonusSummary = hasAnyHeritage ? `
    <div class="heritage-bonus-summary">
      <h3>📊 Total Heritage Bonuses</h3>
      <div class="heritage-bonus-pills">${_formatBonusPills(totalBonus)}</div>
    </div>` : '';

  // ── Odds footer ──
  const oddsHtml = `
    <div class="heritage-odds-footer">
      <span class="odds-common">Common ~60%</span>
      <span class="odds-uncommon">Uncommon ~25%</span>
      <span class="odds-rare">Rare ~12%</span>
      <span class="odds-legendary">Legendary ~2.5%</span>
      <span class="odds-secret">Secret ~0.1%</span>
    </div>`;

  // ── Celestial techniques (collapsible) ──
  const hasCelestial = p.techniques && p.techniques.includes('astral_slash');
  const celestialHtml = hasCelestial ? `
    <details class="heritage-celestial-panel">
      <summary class="heritage-celestial-toggle">✨ Celestial Techniques <span class="celestial-toggle-hint">— cosmic powers from beyond the stars</span></summary>
      <div class="heritage-celestial-body">
        <p class="tab-desc">Chrono Strike upgrades to MAX after 3 uses. Void Nova upgrades to MAX after 3 uses.</p>
        <div class="card-grid">
          ${CELESTIAL_TECHNIQUES.map(t => {
            const owned = p.techniques.includes(t.id);
            return `<div class="card celestial-technique${owned ? '' : ' card-locked-dim'}" ${!owned ? 'onclick="toast(\'🔒 Complete Chapter 10 to unlock Celestial Techniques\',\'warn\')"' : ''}>
              <div class="tech-rarity" style="color:#b388ff">COSMIC · ${t.rarity.toUpperCase()}</div>
              <h3>${t.icon} ${t.name}</h3>
              <div class="card-desc">${t.desc}</div>
              ${owned ? '<span style="color:var(--ok);font-size:12px">✓ Unlocked</span>' : '<span style="color:var(--dim);font-size:12px">🔒 Locked</span>'}
            </div>`;
          }).join('')}
        </div>
      </div>
    </details>` : '';

  container.innerHTML = `
    <div class="heritage-columns">${catHtml}</div>
    ${bonusSummary}
    ${celestialHtml}
    ${oddsHtml}`;
}

function _fmtGold(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

// ── Heritage CSS Injection ──
(function _injectHeritageCSS() {
  if (document.getElementById('heritage-dice-css')) return;
  const style = document.createElement('style');
  style.id = 'heritage-dice-css';
  style.textContent = `
.heritage-reel-item-passed{filter:brightness(0.3);transition:filter 0.2s}
.heritage-reel-stopped{animation:reelBounce 0.4s ease}
@keyframes reelBounce{0%{transform:scale(1)}40%{transform:scale(1.15)}100%{transform:scale(1)}}
`;
  document.head.appendChild(style);
})();
