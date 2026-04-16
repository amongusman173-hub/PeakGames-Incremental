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
  // SECRET (~0.1%) — Gojo Clan
  { id: 'gojo_clan',    name: 'Gojo Clan',        icon: '🔵', rarity: 'secret',    weight: 0.1, desc: 'The honored one. Six Eyes. Infinity.',
    bonus: { atk: 100, def: 80, spd: 60, maxHp: 500 },
    techs: ['infinity', 'reversal_red', 'lapse_blue', 'hollow_purple', 'domain_infinite_void'],
    _gojo: true },
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
  { id: 'six_eyes_staff',name:'Six Eyes Staff',    icon: '🔵', rarity: 'secret',    weight: 0.1,desc: 'Amplifies the Six Eyes technique.', bonus: { atk: 80, spd: 50 },    techs: [], _gojo: true },
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
  { id: 'infinity_style',name:'Infinity Style',    icon: '♾️', rarity: 'secret',    weight: 0.1,desc: 'The pinnacle of jujutsu sorcery.',  bonus: { atk: 70, def: 60, spd: 40 }, techs: [], _gojo: true },
];

// ── GOJO TECHNIQUES ──
// Added to TECHNIQUES array on grant
const GOJO_TECHNIQUES = [
  { id: 'infinity',          name: 'Infinity',              icon: '♾️', rarity: 'legendary', desc: 'Limitless — immune to all damage for 2 turns.',    effect: 'shield',  shieldTurns: 2,  bonus: { def: 50 }, _gojo: true },
  { id: 'reversal_red',      name: 'Reversal Red',          icon: '🔴', rarity: 'legendary', desc: 'Repel — pushes enemy with explosive force.',        effect: 'damage',  multiplier: 3.5, bonus: { atk: 40 }, _gojo: true, _upgradable: true, _upgradeId: 'reversal_red_max' },
  { id: 'reversal_red_max',  name: 'Reversal Red MAX',      icon: '🔴', rarity: 'legendary', desc: 'Amplified Red — triple the repulsion force.',       effect: 'damage',  multiplier: 6.0, bonus: { atk: 60 }, _gojo: true },
  { id: 'lapse_blue',        name: 'Lapse Blue',            icon: '🔵', rarity: 'legendary', desc: 'Attraction — pulls enemy in and crushes them.',     effect: 'stun',    multiplier: 3.0, bonus: { atk: 35, spd: 20 }, _gojo: true, _upgradable: true, _upgradeId: 'lapse_blue_max' },
  { id: 'lapse_blue_max',    name: 'Lapse Blue MAX',        icon: '🔵', rarity: 'legendary', desc: 'Amplified Blue — gravitational collapse.',          effect: 'multi',   hits: 4, multiplier: 2.0, bonus: { atk: 50, spd: 30 }, _gojo: true },
  { id: 'hollow_purple',     name: 'Hollow Purple',         icon: '🟣', rarity: 'legendary', desc: 'Red + Blue = Purple. Erases everything in its path.',effect: 'damage', multiplier: 8.0, bonus: { atk: 80, critChance: 0.5 }, _gojo: true },
  { id: 'domain_infinite_void', name: 'Domain Expansion: Infinite Void', icon: '🌌', rarity: 'legendary',
    desc: 'Traps the enemy in infinite information. Stuns for 3 turns and deals massive damage.',
    effect: 'stun', multiplier: 5.0, bonus: { atk: 100, def: 50, spd: 50, critChance: 0.5 }, _gojo: true },
];

// Track upgrade counts for Red/Blue
const gojoUpgradeCounts = { reversal_red: 0, lapse_blue: 0 };

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
  if (_heritageRolling[category]) return; // already rolling
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

  // Skip animation if setting enabled
  if (G.player.heritageSkipAnim) {
    _doHeritageRoll(category);
    _heritageRolling[category] = false;
    return;
  }

  // ── Slot machine animation ──
  const cardEl = document.querySelector(`.heritage-card[data-cat="${category}"]`);
  const resultArea = cardEl ? cardEl.querySelector('.heritage-result, .heritage-empty') : null;
  const icons = ['⚙️','💨','🪨','🌑','🔥','⚡','🐉','🌀','✨','😈','🌟','🔵'];
  let spinCount = 0;
  const spinEl = document.createElement('div');
  spinEl.style.cssText = `font-size:40px;text-align:center;padding:12px;`;
  if (resultArea) resultArea.replaceWith(spinEl);

  const spinInterval = setInterval(() => {
    spinEl.textContent = icons[spinCount % icons.length];
    spinEl.style.transform = `scale(${1 + Math.sin(spinCount * 0.8) * 0.2})`;
    spinCount++;
    if (spinCount > 18) {
      clearInterval(spinInterval);
      _doHeritageRoll(category);
      _heritageRolling[category] = false;
    }
  }, 80);
}

function _doHeritageRoll(category) {
  const p = G.player;
  let result;
  if (category === 'clan')    result = weightedRoll(CLANS);
  if (category === 'weapon')  result = weightedRoll(WEAPONS);
  if (category === 'style')   result = weightedRoll(FIGHTING_STYLES);
  if (!result) return;

  p.heritage[category] = result.id;
  // Track rerolls so cost scales up
  if (!p.heritageRerolls) p.heritageRerolls = {};
  p.heritageRerolls[category] = (p.heritageRerolls[category] || 0) + 1;
  invalidateStatCache();
  recalcStats();
  p.hp = Math.min(p.hp + (result.bonus?.maxHp || 0), p.maxHp);

  if (result.techs) result.techs.forEach(id => grantTechnique(id));

  if (result._gojo) {
    GOJO_TECHNIQUES.forEach(t => { if (!TECHNIQUES.find(x => x.id === t.id)) TECHNIQUES.push(t); });
    ['infinity', 'reversal_red', 'lapse_blue', 'hollow_purple', 'domain_infinite_void'].forEach(id => grantTechnique(id));
    setTimeout(() => {
      toast('👁️ Six Eyes awakened...', 'rare');
      setTimeout(() => toast('♾️ Infinity activated. You are the honored one.', 'rare'), 1500);
      setTimeout(() => toast('🌌 Domain Expansion: Infinite Void unlocked!', 'rare'), 3000);
    }, 500);
  }

  toast(`${result.icon} ${result.name} — ${result.rarity.toUpperCase()}!`, result.rarity === 'secret' || result.rarity === 'legendary' ? 'rare' : 'success');
  playSound('rollingspin sound');

  // VFX
  const colors = { common:['#aaa','#ccc','#fff'], uncommon:['#6c9fff','#88aaff','#fff'], rare:['#b06aff','#cc88ff','#fff'], legendary:['#f5c542','#ffdd66','#ff9900','#fff'], secret:['#ff1744','#b71c1c','#fff','#ff8a80'] }[result.rarity] || ['#fff'];
  const count = result.rarity === 'secret' ? 50 : result.rarity === 'legendary' ? 35 : result.rarity === 'rare' ? 22 : 12;
  const spread = result.rarity === 'secret' ? 130 : result.rarity === 'legendary' ? 100 : 70;
  const anchor = document.querySelector('.heritage-card') || document.getElementById('heritage-container');
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
  renderHeritage();
}

// ── AUTO-ROLL SYSTEM ──
let _autoRollInterval = null;
const RARITY_ORDER = ['common', 'uncommon', 'rare', 'legendary', 'secret'];

function startAutoRoll() {
  const rarityEl = document.getElementById('heritage-auto-rarity');
  const catEl = document.getElementById('heritage-auto-cat');
  if (!rarityEl || !catEl) return;
  const targetRarity = rarityEl.value;
  const category = catEl.value;
  if (!targetRarity) { toast('Select a target rarity first!', 'warn'); return; }

  stopAutoRoll();
  G.player.heritageSkipAnim = true; // force skip during auto-roll
  document.getElementById('btn-stop-autoroll').style.display = '';
  toast(`🎯 Auto-rolling ${category} until ${targetRarity}+…`, 'info');

  const targetIdx = RARITY_ORDER.indexOf(targetRarity);

  _autoRollInterval = setInterval(() => {
    const cost = getHeritageCost(category);
    if (G.player.gold < cost) {
      stopAutoRoll();
      toast('❌ Auto-roll stopped — not enough gold!', 'warn');
      return;
    }

    // Check current result
    const currentId = G.player.heritage[category];
    const current = currentId ? getHeritageItem(category, currentId) : null;
    const currentIdx = current ? RARITY_ORDER.indexOf(current.rarity) : -1;

    if (currentIdx >= targetIdx) {
      stopAutoRoll();
      toast(`✅ Auto-roll done! Got ${current.icon} ${current.name} (${current.rarity})`, 'success');
      return;
    }

    // Roll without confirm (auto-roll bypasses legendary confirm)
    if (!spendGold(cost)) { stopAutoRoll(); return; }
    _doHeritageRoll(category);
  }, 300);
}

function stopAutoRoll() {
  if (_autoRollInterval) { clearInterval(_autoRollInterval); _autoRollInterval = null; }
  const btn = document.getElementById('btn-stop-autoroll');
  if (btn) btn.style.display = 'none';
}

function getHeritageCost(category) {
  const p = G.player;
  const rerolls = (p.heritageRerolls && p.heritageRerolls[category]) || 0;
  const base = { clan: 1500, weapon: 1000, style: 1000 };
  return Math.floor((base[category] || 1500) * Math.pow(2.5, rerolls));
}

function getHeritageItem(category, id) {
  if (category === 'clan')   return CLANS.find(x => x.id === id);
  if (category === 'weapon') return WEAPONS.find(x => x.id === id);
  if (category === 'style')  return FIGHTING_STYLES.find(x => x.id === id);
  return null;
}

// Called from combat when using Red/Blue — track upgrade count
function useGojoTech(techId) {
  if (techId === 'reversal_red' || techId === 'lapse_blue') {
    gojoUpgradeCounts[techId] = (gojoUpgradeCounts[techId] || 0) + 1;
    if (gojoUpgradeCounts[techId] >= 3) {
      const maxId = techId + '_max';
      if (!G.player.techniques.includes(maxId)) {
        grantTechnique(maxId);
        toast(`🔴 ${techId === 'reversal_red' ? 'Reversal Red MAX' : 'Lapse Blue MAX'} unlocked!`, 'rare');
      }
    }
  }
}

function renderHeritage() {
  const container = document.getElementById('heritage-container');
  if (!container) return;
  const p = G.player;
  if (!p.heritage) p.heritage = {};
  if (!p.heritageRerolls) p.heritageRerolls = {};

  const categories = [
    { key: 'clan',   label: '🏰 Clan',             pool: CLANS,          desc: 'Your bloodline. Grants stat bonuses and techniques.' },
    { key: 'weapon', label: '⚔️ Weapon Style',      pool: WEAPONS,        desc: 'Your weapon mastery. Grants ATK bonuses and techniques.' },
    { key: 'style',  label: '🥋 Fighting Technique',pool: FIGHTING_STYLES,desc: 'Your combat style. Grants unique fighting techniques.' },
  ];

  const html = categories.map(cat => {
    const currentId = p.heritage[cat.key];
    const current   = currentId ? getHeritageItem(cat.key, currentId) : null;
    const cost      = getHeritageCost(cat.key);
    const rerolls   = p.heritageRerolls[cat.key] || 0;
    const rarityColors = { common:'var(--dim)', uncommon:'var(--accent)', rare:'var(--accent2)', legendary:'var(--gold)', secret:'#ff3333' };

    return `<div class="heritage-card" data-cat="${cat.key}">
      <div class="heritage-header">
        <h3>${cat.label}</h3>
        <p class="tab-desc" style="margin:0">${cat.desc}</p>
      </div>
      ${current ? `
        <div class="heritage-result" style="border-color:${rarityColors[current.rarity] || 'var(--border)'}">
          <div class="heritage-icon">${current.icon}</div>
          <div class="heritage-info">
            <div class="heritage-name" style="color:${rarityColors[current.rarity]}">${current.name}</div>
            <div class="heritage-rarity">${current.rarity.toUpperCase()}</div>
            <div class="heritage-desc">${current.desc}</div>
            ${current.bonus ? `<div class="heritage-bonus">${Object.entries(current.bonus).map(([k,v])=>`${v>0?'+':''}${v} ${k.toUpperCase()}`).join(' · ')}</div>` : ''}
            ${current.techs?.length ? `<div class="heritage-techs">🎁 ${current.techs.map(id=>{ const t=TECHNIQUES.find(x=>x.id===id); return t?`${t.icon}${t.name}`:id; }).join(', ')}</div>` : ''}
          </div>
        </div>
        <button class="btn-small heritage-reroll-btn" onclick="rollHeritage('${cat.key}')">
          🎲 Re-roll (💰${cost}${rerolls > 0 ? ` · ${rerolls} rerolls` : ''})
        </button>
      ` : `
        <div class="heritage-empty">Not yet rolled</div>
        <button class="btn-primary" onclick="rollHeritage('${cat.key}')" ${p.gold >= cost ? '' : 'disabled'}>
          🎲 Roll (💰${cost})
        </button>
      `}
    </div>`;
  }).join('');

  // Show Gojo techniques if unlocked
  const hasGojo = p.techniques.includes('infinity');
  const gojoSection = hasGojo ? `
    <div class="heritage-gojo-section">
      <h3>👁️ Six Eyes Techniques</h3>
      <p class="tab-desc">Satoru Gojo's limitless cursed techniques. Red upgrades to MAX after 3 uses. Blue upgrades to MAX after 3 uses.</p>
      <div class="card-grid">
        ${GOJO_TECHNIQUES.map(t => {
          const owned = p.techniques.includes(t.id);
          return `<div class="card jjk-technique${owned ? '' : ' card-locked-dim'}">
            <div class="tech-rarity" style="color:#ff3333">CURSED · ${t.rarity.toUpperCase()}</div>
            <h3>${t.icon} ${t.name}</h3>
            <div class="card-desc">${t.desc}</div>
            ${owned ? '<span style="color:var(--ok);font-size:12px">✓ Unlocked</span>' : '<span style="color:var(--dim);font-size:12px">🔒 Locked</span>'}
          </div>`;
        }).join('')}
      </div>
    </div>` : '';

  const autoRunning = _autoRollInterval !== null;
  container.innerHTML = `
    <div class="heritage-control-panel">
      <div class="heritage-control-row">
        <div class="heritage-control-group">
          <span class="heritage-control-label">⚡ Animation</span>
          <label class="toggle-switch" title="Skip the spin animation for instant rolls">
            <input type="checkbox" ${p.heritageSkipAnim ? 'checked' : ''} onchange="G.player.heritageSkipAnim=this.checked">
            <span class="toggle-slider"></span>
          </label>
          <span style="font-size:11px;color:var(--dim)">Skip spin</span>
        </div>
        <div class="heritage-control-group" style="flex:1">
          <span class="heritage-control-label">🎯 Auto-Roll</span>
          <select id="heritage-auto-cat" class="heritage-select">
            <option value="clan">🏰 Clan</option>
            <option value="weapon">⚔️ Weapon</option>
            <option value="style">🥋 Style</option>
          </select>
          <span style="font-size:11px;color:var(--dim)">until</span>
          <select id="heritage-auto-rarity" class="heritage-select">
            <option value="">— select —</option>
            <option value="uncommon">Uncommon+</option>
            <option value="rare">Rare+</option>
            <option value="legendary">Legendary+</option>
            <option value="secret">Secret only</option>
          </select>
          ${autoRunning
            ? `<button class="btn-small btn-stop" onclick="stopAutoRoll()" style="background:rgba(229,57,53,0.2);border-color:var(--danger)">■ Stop</button>
               <span style="font-size:11px;color:var(--ok);animation:pulse 1s infinite">● Rolling…</span>`
            : `<button class="btn-small" onclick="startAutoRoll()" style="background:rgba(39,174,96,0.15);border-color:var(--ok)">▶ Start</button>`
          }
        </div>
      </div>
      ${autoRunning ? `<div style="font-size:11px;color:var(--dim);margin-top:6px;padding:6px;background:rgba(245,197,66,0.08);border-radius:4px">⚠️ Auto-rolling — gold is being spent automatically. Click Stop to cancel.</div>` : ''}
    </div>
    <div class="heritage-grid">${html}</div>
    ${gojoSection}
    <div class="heritage-odds">
      <h3>📊 Roll Odds</h3>
      <div class="odds-grid">
        <span class="odds-common">Common — ~60%</span>
        <span class="odds-uncommon">Uncommon — ~25%</span>
        <span class="odds-rare">Rare — ~12%</span>
        <span class="odds-legendary">Legendary — ~2.5%</span>
        <span class="odds-secret">Secret — ~0.1%</span>
      </div>
    </div>`;
}
