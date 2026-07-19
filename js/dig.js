(function() {
  if (document.getElementById('dig-rework-css')) return;
  const s = document.createElement('style');
  s.id = 'dig-rework-css';
  s.textContent = `
.dig-rework{display:flex;flex-direction:column;gap:14px;padding-bottom:20px}
.dig-top-bar{display:flex;align-items:center;justify-content:center;gap:16px;padding:14px 20px;background:var(--card);border:1px solid var(--border);border-radius:var(--r);flex-wrap:wrap}
.dig-charges-section{display:flex;align-items:center;gap:8px}
.dig-charges-label{font-size:11px;color:var(--dim);font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.dig-top-bar .charge-pip{width:16px;height:16px;border-radius:50%;background:rgba(255,255,255,.06);border:2px solid var(--border);transition:all .25s}
.dig-top-bar .charge-pip.pip-full{background:var(--stamina);border-color:var(--stamina);box-shadow:0 0 8px rgba(41,128,185,.5)}
.dig-top-bar .dig-timer-txt{font-size:11px;color:var(--dim);min-width:55px}
.dig-top-actions{display:flex;gap:8px;align-items:center}
.dig-dig-btn{display:flex;align-items:center;gap:10px;padding:14px 40px;font-size:18px;font-weight:800;font-family:inherit;color:#1a1a2e;background:linear-gradient(135deg,#daa520,#f5c542);border:2px solid #f0b830;border-radius:12px;cursor:pointer;transition:all .15s;text-transform:uppercase;letter-spacing:1.5px;position:relative;overflow:hidden}
.dig-dig-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.25) 50%,transparent 60%);transform:translateX(-100%);transition:transform .5s}
.dig-dig-btn:hover::before{transform:translateX(100%)}
.dig-dig-btn:hover:not(:disabled){background:linear-gradient(135deg,#f0b830,#ffe066);border-color:#ffe066;transform:translateY(-2px);box-shadow:0 4px 24px rgba(245,197,66,.45)}
.dig-dig-btn:active:not(:disabled){transform:translateY(1px) scale(.97);box-shadow:0 2px 8px rgba(245,197,66,.3)}
.dig-dig-btn:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}
.dig-dig-btn:disabled::before{display:none}
.dig-dig-btn .dig-pickaxe-icon{font-size:26px;display:inline-block}
.dig-dig-btn.dig-swinging .dig-pickaxe-icon{animation:digSwing .35s ease}
@keyframes digSwing{0%{transform:rotate(0) translateY(0)}20%{transform:rotate(-42deg) translateY(-4px)}55%{transform:rotate(18deg) translateY(2px)}75%{transform:rotate(-8deg) translateY(-1px)}100%{transform:rotate(0) translateY(0)}}
.dig-stats-bar{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.dig-stat-item{display:flex;flex-direction:column;align-items:center;padding:6px 14px;background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:8px;min-width:72px}
.dig-stat-val{font-size:14px;font-weight:700;color:var(--text)}
.dig-stat-lbl{font-size:9px;color:var(--dim);margin-top:1px;text-transform:uppercase;letter-spacing:.3px}
.dig-stat-rare .dig-stat-val{color:var(--accent2)}
.dig-stat-best .dig-stat-val{color:var(--accent);font-size:12px}
.dig-main-content{display:grid;grid-template-columns:1fr 230px;gap:14px;align-items:start}
@media(max-width:700px){.dig-main-content{grid-template-columns:1fr}.dig-sidebar{display:grid;grid-template-columns:1fr 1fr;gap:10px}}
@media(max-width:500px){.dig-sidebar{grid-template-columns:1fr}}
.dig-grid-section{position:relative;display:flex;justify-content:center}
.dig-grid-section.shake{animation:digShake .3s ease}
@keyframes digShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-5px)}30%{transform:translateX(5px)}45%{transform:translateX(-4px)}60%{transform:translateX(4px)}75%{transform:translateX(-2px)}90%{transform:translateX(2px)}}
.dig-grid-new{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
@media(max-width:500px){.dig-grid-new{grid-template-columns:repeat(6,1fr)}}
.dig-tile{aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:22px;user-select:none;transition:all .12s;position:relative}
.dig-tile.undug{background:linear-gradient(135deg,#1a1e2a,#141826);border:1px solid var(--border);cursor:pointer}
.dig-tile.undug:hover{background:linear-gradient(135deg,#252b3b,#1e2330);border-color:var(--accent);transform:scale(1.08);box-shadow:0 0 8px rgba(108,159,255,.3)}
.dig-tile.undug:active{transform:scale(.95)}
.dig-question{font-size:14px;color:var(--dim);font-weight:700}
.dig-tile.dug{background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.04);cursor:default;opacity:.4;font-size:12px;color:var(--dim)}
.dig-tile.dug-find{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);cursor:default;opacity:1}
.dig-rarity-common{border-color:rgba(255,255,255,.15)!important}
.dig-rarity-uncommon{border-color:rgba(108,159,255,.5)!important;background:rgba(108,159,255,.06)!important}
.dig-rarity-rare{border-color:rgba(176,106,255,.6)!important;background:rgba(176,106,255,.08)!important}
.dig-rarity-legendary{border-color:rgba(245,197,66,.8)!important;background:rgba(245,197,66,.1)!important;animation:legendaryPulse 2s ease-in-out infinite}
.dig-rarity-secret{border-color:rgba(255,68,68,.8)!important;background:rgba(255,0,0,.08)!important;animation:secretPulse 1.5s ease-in-out infinite}
@keyframes legendaryPulse{0%,100%{box-shadow:0 0 8px rgba(245,197,66,.4)}50%{box-shadow:0 0 20px rgba(245,197,66,.8)}}
@keyframes secretPulse{0%,100%{box-shadow:0 0 10px rgba(255,0,0,.3)}50%{box-shadow:0 0 25px rgba(255,0,0,.7)}}
.dig-sidebar{display:flex;flex-direction:column;gap:10px}
.dig-sidebar-section{background:var(--card);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px}
.dig-sidebar-section h3{font-size:12px;font-weight:700;color:var(--text);margin-bottom:8px;text-transform:uppercase;letter-spacing:.5px}
.dig-recent-finds{display:flex;flex-direction:column;gap:5px;max-height:200px;overflow-y:auto}
.dig-recent-empty{font-size:11px;color:var(--dim);text-align:center;padding:10px 0;font-style:italic}
.dig-find-card{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:8px;background:rgba(255,255,255,.03);border:1px solid var(--border);animation:digSlideIn .3s ease both}
.dig-find-card.dig-find-common{border-left:3px solid rgba(255,255,255,.15)}
.dig-find-card.dig-find-uncommon{border-left:3px solid #6c9fff;box-shadow:inset 0 0 12px rgba(108,159,255,.06)}
.dig-find-card.dig-find-rare{border-left:3px solid #b06aff;box-shadow:inset 0 0 12px rgba(176,106,255,.08)}
.dig-find-card.dig-find-legendary{border-left:3px solid #f5c542;box-shadow:inset 0 0 15px rgba(245,197,66,.08)}
.dig-find-card.dig-find-secret{border-left:3px solid #ff4444;box-shadow:inset 0 0 15px rgba(255,0,0,.1)}
@keyframes digSlideIn{0%{opacity:0;transform:translateX(24px)}100%{opacity:1;transform:translateX(0)}}
.dig-find-icon{font-size:18px;flex-shrink:0}
.dig-find-info{flex:1;min-width:0}
.dig-find-name{font-size:11px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dig-find-gold{font-size:10px;color:var(--dim)}
.dig-log-panel{max-height:160px;overflow-y:auto;font-size:11px;color:var(--dim)}
.dig-log-panel div{padding:2px 0}
.dig-log-panel .rare{color:var(--accent2)}
.dig-log-panel .uncommon{color:var(--accent)}
.dig-log-panel .common{color:var(--dim)}
.dig-upgrades-section{margin-top:4px;display:flex;flex-direction:column;align-items:center}
.dig-upgrades-section h3{font-size:14px;font-weight:700;color:var(--text);margin-bottom:10px}
.dig-upgrades-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media(max-width:900px){.dig-upgrades-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:550px){.dig-upgrades-grid{grid-template-columns:1fr}}
.dig-upg-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;transition:border-color .15s,box-shadow .15s}
.dig-upg-card:hover{border-color:var(--accent)}
.dig-upg-card.dig-upg-maxed{border-color:rgba(39,174,96,.4);background:rgba(39,174,96,.04)}
.dig-upg-top{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px}
.dig-upg-icon{font-size:20px;flex-shrink:0}
.dig-upg-info{flex:1}
.dig-upg-name{font-size:12px;font-weight:700;color:var(--text)}
.dig-upg-desc{font-size:10px;color:var(--dim);line-height:1.3;margin-top:2px}
.dig-upg-bottom{display:flex;align-items:center;justify-content:space-between}
.dig-upg-pips{display:flex;gap:3px}
.dig-upg-pip{width:10px;height:10px;border-radius:3px;background:rgba(255,255,255,.06);border:1px solid var(--border);transition:all .2s}
.dig-upg-pip.pip-owned{background:var(--accent);border-color:var(--accent);box-shadow:0 0 4px rgba(108,159,255,.3)}
.dig-upg-maxed-txt{font-size:11px;color:var(--ok);font-weight:700}
.dig-upg-btn{font-size:11px;padding:4px 10px}
.dig-rarity-guide{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.dig-rarity-row{font-size:11px;padding:4px 10px;border-radius:6px;background:rgba(255,255,255,.03);border:1px solid var(--border)}
.dig-nothing-msg{position:absolute;bottom:-28px;left:50%;transform:translateX(-50%);font-size:12px;color:var(--dim);font-style:italic;white-space:nowrap;animation:digNothingFade 1.8s ease forwards;pointer-events:none}
@keyframes digNothingFade{0%{opacity:0;transform:translateX(-50%) translateY(4px)}12%{opacity:1;transform:translateX(-50%) translateY(0)}65%{opacity:1}100%{opacity:0}}
`;
  document.head.appendChild(s);
})();

const DIG_COLS = 8;
const DIG_ROWS = 6;

const DIG_UPGRADES = [
  { id: 'dig_cap',      name: 'Extra Charges',    icon: '⛏️', desc: '+2 max dig charges.',              baseCost: 100,  costMult: 2.2, maxLevel: 5,  apply: () => {} },
  { id: 'dig_speed',    name: 'Faster Regen',      icon: '⏱️', desc: 'Charges regen 25% faster.',        baseCost: 200,  costMult: 2.5, maxLevel: 4,  apply: () => {} },
  { id: 'dig_luck',     name: 'Lucky Pickaxe',     icon: '🍀', desc: '+15% chance to upgrade rarity.',   baseCost: 300,  costMult: 2.0, maxLevel: 5,  apply: () => {} },
  { id: 'dig_gold',     name: 'Gold Detector',     icon: '💰', desc: '+25% gold value from all finds.',  baseCost: 250,  costMult: 1.8, maxLevel: 5,  apply: () => {} },
  { id: 'dig_reveal',   name: 'Sonar Pulse',       icon: '📡', desc: 'Reveals 3 random tiles on new site.',baseCost: 400, costMult: 2.0, maxLevel: 3,  apply: () => {} },
  { id: 'dig_xp',       name: 'Scholar\'s Pick',   icon: '📚', desc: '+50% XP from excavation.',         baseCost: 180,  costMult: 1.9, maxLevel: 4,  apply: () => {} },
  { id: 'dig_size',     name: 'Wider Excavation',  icon: '🗺️', desc: '+8 extra tiles per site.',         baseCost: 350,  costMult: 2.5, maxLevel: 3,  apply: () => {} },
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
  { id: 'stone',         name: 'Stone',           icon: '🪨', rarity: 'common',    weight: 40, type: 'material', goldValue: 15 },
  { id: 'coal',          name: 'Coal',             icon: '⬛', rarity: 'common',    weight: 30, type: 'material', goldValue: 25 },
  { id: 'iron_ore',      name: 'Iron Ore',         icon: '🔩', rarity: 'common',    weight: 20, type: 'material', goldValue: 40 },
  { id: 'clay',          name: 'Clay',             icon: '🟫', rarity: 'common',    weight: 25, type: 'material', goldValue: 18 },
  { id: 'flint',         name: 'Flint',            icon: '🪓', rarity: 'common',    weight: 18, type: 'material', goldValue: 30 },
  { id: 'bone',          name: 'Old Bone',         icon: '🦴', rarity: 'common',    weight: 15, type: 'material', goldValue: 28,  alchemyGrant: 'bone_dust' },
  { id: 'herb_patch',    name: 'Herb Patch',       icon: '🌿', rarity: 'common',    weight: 14, type: 'material', goldValue: 22,  alchemyGrant: 'herb' },
  { id: 'mystic_dust',   name: 'Mystic Dust',      icon: '✨', rarity: 'common',    weight: 12, type: 'material', goldValue: 25,  alchemyGrant: 'crystal_dust' },
  { id: 'iron_nugget',   name: 'Iron Nugget',      icon: '🪨', rarity: 'common',    weight: 16, type: 'material', goldValue: 20 },
  { id: 'silver_ore',    name: 'Silver Ore',       icon: '🥈', rarity: 'uncommon',  weight: 12, type: 'material', goldValue: 120 },
  { id: 'gold_ore',      name: 'Gold Ore',         icon: '🥇', rarity: 'uncommon',  weight: 8,  type: 'material', goldValue: 200 },
  { id: 'ancient_coin',  name: 'Ancient Coin',     icon: '🪙', rarity: 'uncommon',  weight: 6,  type: 'material', goldValue: 250 },
  { id: 'mushroom_vein', name: 'Glowshroom Vein',  icon: '🍄', rarity: 'uncommon',  weight: 7,  type: 'material', goldValue: 130, alchemyGrant: 'mushroom' },
  { id: 'fire_rock',     name: 'Fire Rock',        icon: '🔥', rarity: 'uncommon',  weight: 5,  type: 'material', goldValue: 220, alchemyGrant: 'fire_shard' },
  { id: 'shadow_pool',   name: 'Shadow Pool',      icon: '🫙', rarity: 'uncommon',  weight: 4,  type: 'material', goldValue: 280, alchemyGrant: 'shadow_oil' },
  { id: 'moonstone',     name: 'Moonstone',        icon: '🌙', rarity: 'uncommon',  weight: 5,  type: 'gem',      goldValue: 300 },
  { id: 'copper_vein',   name: 'Copper Vein',      icon: '🟤', rarity: 'uncommon',  weight: 10, type: 'material', goldValue: 150 },
  { id: 'ruby',          name: 'Ruby',             icon: '💎', rarity: 'rare',      weight: 3,  type: 'gem',      goldValue: 800 },
  { id: 'sapphire',      name: 'Sapphire',         icon: '🔷', rarity: 'rare',      weight: 3,  type: 'gem',      goldValue: 800 },
  { id: 'emerald',       name: 'Emerald',          icon: '💚', rarity: 'rare',      weight: 2,  type: 'gem',      goldValue: 900 },
  { id: 'ancient_relic', name: 'Ancient Relic',    icon: '🏺', rarity: 'rare',      weight: 2,  type: 'relic',    goldValue: 1200, techGrant: 'ancient_strike' },
  { id: 'crystal_frag',  name: 'Crystal Fragment', icon: '🔮', rarity: 'rare',      weight: 2,  type: 'gem',      goldValue: 1000, techGrant: 'crystal_shard' },
  { id: 'moon_water',    name: 'Moon Water Flask', icon: '💧', rarity: 'rare',      weight: 2,  type: 'material', goldValue: 900, alchemyGrant: 'moonwater' },
  { id: 'dragon_tooth',  name: 'Dragon Tooth',     icon: '🦷', rarity: 'rare',      weight: 1,  type: 'relic',    goldValue: 1500 },
  { id: 'spirit_orb',    name: 'Spirit Orb',       icon: '🔵', rarity: 'rare',      weight: 2,  type: 'gem',      goldValue: 850 },
  { id: 'starlight_shard', name: 'Starlight Shard', icon: '⭐', rarity: 'rare',      weight: 1,  type: 'gem',      goldValue: 1200, alchemyGrant: 'starlight' },
  { id: 'void_crystal',  name: 'Void Crystal',     icon: '🌀', rarity: 'legendary', weight: 0.5, type: 'gem',     goldValue: 5000, techGrant: 'void_rend' },
  { id: 'divine_shard',  name: 'Divine Shard',     icon: '💫', rarity: 'legendary', weight: 0.5, type: 'gem',     goldValue: 5000, techGrant: 'divine_heal' },
  { id: 'dragon_scale',  name: 'Dragon Scale',     icon: '🐉', rarity: 'legendary', weight: 0.3, type: 'relic',   goldValue: 7000, alchemyGrant: 'dragon_scale' },
  { id: 'void_essence',  name: 'Void Essence',     icon: '🌑', rarity: 'legendary', weight: 0.3, type: 'gem',     goldValue: 8000, alchemyGrant: 'void_essence' },
  { id: 'ancient_tome',  name: 'Ancient Tome',     icon: '📜', rarity: 'legendary', weight: 0.2, type: 'relic',   goldValue: 10000 },
  { id: 'cosmic_shard', name: 'Cosmic Shard',     icon: '🪐', rarity: 'secret',    weight: 0,   type: 'relic',   goldValue: 0, techGrant: 'celestial_wrath', _secret: true },
];

let digSession = { found: 0, gold: 0, rare: 0, best: null };
let digGrid = [];
let digRecentFinds = [];

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
  if (typeof G.player._sonarCount === 'number') G.player._sonarCount++; else G.player._sonarCount = 1;
  const revealCount = sonarLevel * 3;
  const undug = digGrid.map((t,i) => i).filter(i => !digGrid[i].dug);
  if (undug.length === 0) { toast('All tiles already dug!', 'info'); return; }
  const toReveal = undug.sort(() => Math.random() - 0.5).slice(0, revealCount);
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
  toReveal.forEach((idx, i) => {
    setTimeout(() => {
      const tile = digGrid[idx];
      tile.dug = true;
      if (tile.loot) {
        const item = tile.loot;
        const gold = gainGold(Math.floor(item.goldValue * getDigGoldMult()));
        gainXP(Math.floor(item.goldValue / 5 * getDigXpMult()));
        digSession.found++;
        digSession.gold += gold;
        if (item.rarity === 'rare' || item.rarity === 'legendary') digSession.rare++;
        if (!digSession.best || gold > digSession.best.gold) {
          digSession.best = { icon: item.icon, name: item.name, gold: gold, rarity: item.rarity };
        }
        digRecentFinds.unshift({ icon: item.icon, name: item.name, gold: gold, rarity: item.rarity });
        if (digRecentFinds.length > 5) digRecentFinds.length = 5;
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
        setTimeout(() => {
          const tileEl = document.querySelector(`[data-dig-idx="${idx}"]`);
          digParticleBurst(tileEl, item.rarity);
        }, 50);
      }
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
  playSound('sonar');
  updateSonarButton();
  updateRecentFinds();
  updateDigButton();
}

function updateSonarButton() {
  const btn = document.getElementById('btn-sonar');
  if (!btn) return;
  const sonarLevel = (G.player.shopPurchases && G.player.shopPurchases['dig_reveal']) || 0;
  const charges = G.player.sonarCharges || 0;
  const maxSonar = sonarLevel;
  if (sonarLevel === 0) { btn.classList.add('hidden'); return; }
  btn.classList.remove('hidden');
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
  digSession = { found: 0, gold: 0, rare: 0, best: null };
  digRecentFinds = [];
  const extraTiles = ((G.player.shopPurchases && G.player.shopPurchases['dig_size']) || 0) * 8;
  const totalTiles = DIG_COLS * DIG_ROWS + extraTiles;
  const lootCount  = Math.floor(totalTiles * (0.3 + Math.random() * 0.2));
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
  updateRecentFinds();
  updateDigButton();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function digRandomTile() {
  const p = G.player;
  if (p.digCharges <= 0) {
    toast('No dig charges! Wait for regen.', 'warn');
    return;
  }
  const undug = digGrid.map((t, i) => i).filter(i => !digGrid[i].dug);
  if (undug.length === 0) {
    toast('Nothing left to dig! Get a new site.', 'warn');
    return;
  }
  const btn = document.getElementById('btn-dig-action');
  if (btn) {
    btn.classList.remove('dig-swinging');
    void btn.offsetWidth;
    btn.classList.add('dig-swinging');
    setTimeout(() => btn.classList.remove('dig-swinging'), 400);
  }
  const idx = undug[Math.floor(Math.random() * undug.length)];
  digTile(idx);
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
  if (typeof p._digCount === 'number') p._digCount++; else p._digCount = 1;
  const tileEl = document.querySelector(`[data-dig-idx="${index}"]`);
  digDirtSpray(tileEl);
  playSound('dig', 0.5);

  if (Math.random() < 0.005 && !G.player.techniques.includes('celestial_wrath')) {
    const shard = DIG_LOOT_TABLE.find(i => i.id === 'cosmic_shard');
    tile.loot = shard;
    setTimeout(() => {
      const el = document.querySelector(`[data-dig-idx="${index}"]`);
      digParticleBurst(el, 'secret');
      const flash = document.createElement('div');
      flash.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;
        background:radial-gradient(circle at 50% 50%, rgba(124,77,255,0.5) 0%, transparent 70%);
        animation:digFlash 1s ease-out forwards;`;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1100);
    }, 30);
    addDigLog(`🪐 ...something cosmic stirs beneath the earth...`, 'rare', 'secret');
    setTimeout(() => {
      toast('🪐 You found something... extraordinary.', 'rare');
      setTimeout(() => toast("Cosmic Shard — a fragment of a dying star!", 'rare'), 1500);
    }, 600);
    grantTechnique('celestial_wrath');
    renderDigGrid();
    updateDigInfo();
    updateDigStats();
    updateDigButton();
    return;
  }

  if (tile.loot) {
    const item = tile.loot;
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
    digSession.found++;
    digSession.gold += gold;
    if (finalItem.rarity === 'rare' || finalItem.rarity === 'legendary') digSession.rare++;
    if (!digSession.best || gold > digSession.best.gold) {
      digSession.best = { icon: finalItem.icon, name: finalItem.name, gold: gold, rarity: finalItem.rarity };
    }
    digRecentFinds.unshift({ icon: finalItem.icon, name: finalItem.name, gold: gold, rarity: finalItem.rarity });
    if (digRecentFinds.length > 5) digRecentFinds.length = 5;
    setTimeout(() => {
      const updatedTile = document.querySelector(`[data-dig-idx="${index}"]`);
      digParticleBurst(updatedTile, finalItem.rarity);
    }, 30);
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
    const gridSection = document.querySelector('.dig-grid-section');
    if (gridSection) {
      gridSection.classList.remove('shake');
      void gridSection.offsetWidth;
      gridSection.classList.add('shake');
      setTimeout(() => gridSection.classList.remove('shake'), 350);
      const msg = document.createElement('div');
      msg.className = 'dig-nothing-msg';
      msg.textContent = 'Nothing found…';
      gridSection.appendChild(msg);
      setTimeout(() => msg.remove(), 1900);
    }
  }
  renderDigGrid();
  updateDigInfo();
  updateDigStats();
  updateRecentFinds();
  updateDigButton();
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
  const p = G.player;
  const total = digGrid.length;
  const dug   = digGrid.filter(t => t.dug).length;
  el.innerHTML = `
    <div class="dig-stat-item"><span class="dig-stat-val">${p._digCount || 0}</span><span class="dig-stat-lbl">Total Digs</span></div>
    <div class="dig-stat-item"><span class="dig-stat-val">${digSession.found}</span><span class="dig-stat-lbl">Items Found</span></div>
    <div class="dig-stat-item"><span class="dig-stat-val">+${digSession.gold}g</span><span class="dig-stat-lbl">Gold Earned</span></div>
    ${digSession.rare > 0 ? `<div class="dig-stat-item dig-stat-rare"><span class="dig-stat-val">💎 ${digSession.rare}</span><span class="dig-stat-lbl">Rare Finds</span></div>` : ''}
    ${digSession.best ? `<div class="dig-stat-item dig-stat-best"><span class="dig-stat-val">${digSession.best.icon} ${digSession.best.name}</span><span class="dig-stat-lbl">Best Find</span></div>` : ''}
    <div class="dig-stat-item"><span class="dig-stat-val">${dug}/${total}</span><span class="dig-stat-lbl">Tiles Dug</span></div>
  `;
}

function updateDigInfo() {
  const p = G.player;
  const maxCharges = getMaxDigCharges();
  const pipsEl = document.getElementById('dig-charge-pips');
  if (pipsEl) {
    pipsEl.innerHTML = Array.from({ length: maxCharges }, (_, i) =>
      `<div class="charge-pip${i < p.digCharges ? ' pip-full' : ''}"></div>`
    ).join('');
  }
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
  updateSonarButton();
  updateDigButton();
}

function updateRecentFinds() {
  const el = document.getElementById('dig-recent-finds');
  if (!el) return;
  if (digRecentFinds.length === 0) {
    el.innerHTML = '<div class="dig-recent-empty">No finds yet… start digging!</div>';
    return;
  }
  el.innerHTML = digRecentFinds.map((f, i) => {
    return `<div class="dig-find-card dig-find-${f.rarity}" style="animation-delay:${i * 0.05}s">
      <span class="dig-find-icon">${f.icon}</span>
      <div class="dig-find-info">
        <div class="dig-find-name">${f.name}</div>
        <div class="dig-find-gold">+${f.gold}g</div>
      </div>
    </div>`;
  }).join('');
}

function updateDigButton() {
  const btn = document.getElementById('btn-dig-action');
  if (!btn) return;
  const p = G.player;
  const undug = digGrid.filter(t => !t.dug).length;
  const noCharges = (p.digCharges || 0) <= 0;
  const noTiles = undug === 0;
  btn.disabled = noCharges || noTiles;
  const textEl = btn.querySelector('.dig-btn-text');
  if (textEl) {
    if (noTiles) textEl.textContent = 'All Dug!';
    else if (noCharges) textEl.textContent = 'No Charges';
    else textEl.textContent = 'Dig!';
  }
}

function handleNewDigSite() {
  generateDigSite();
  digRecentFinds = [];
  updateRecentFinds();
  const logEl = document.getElementById('dig-log');
  if (logEl) logEl.innerHTML = '';
  toast('New dig site opened!', 'info');
}

function renderDigUI() {
  const p = G.player;
  const wrap = document.getElementById('dig-main-wrap');
  if (!wrap) return;
  if (p.level < 8) {
    wrap.innerHTML = `<div class="locked-section"><div class="locked-icon">⛏️</div><h3>Excavation Locked</h3><p>Reach <strong>Level 8</strong> to unlock Excavation.</p></div>`;
    return;
  }
  if (!wrap.querySelector('.dig-rework')) {
    wrap.innerHTML = `<div class="dig-rework">
      <div class="dig-top-bar">
        <div class="dig-charges-section">
          <span class="dig-charges-label">Charges</span>
          <div id="dig-charge-pips" class="dig-charge-pips"></div>
          <span id="dig-timer" class="dig-timer-txt"></span>
        </div>
        <button class="dig-dig-btn" id="btn-dig-action" onclick="digRandomTile()">
          <span class="dig-pickaxe-icon">⛏️</span>
          <span class="dig-btn-text">Dig!</span>
        </button>
        <div class="dig-top-actions">
          <button id="btn-new-dig" class="btn-primary" onclick="handleNewDigSite()">🗺️ New Site</button>
          <button id="btn-sonar" class="btn-small hidden" onclick="activateSonarPulse()">📡 Sonar</button>
        </div>
      </div>
      <div id="dig-session-stats" class="dig-stats-bar"></div>
      <div class="dig-main-content">
        <div class="dig-grid-section">
          <div id="dig-grid" class="dig-grid-new"></div>
        </div>
        <div class="dig-sidebar">
          <div class="dig-sidebar-section">
            <h3>Recent Finds</h3>
            <div id="dig-recent-finds" class="dig-recent-finds"></div>
          </div>
          <div class="dig-sidebar-section">
            <h3>Find Log</h3>
            <div id="dig-log" class="loot-log dig-log-panel"></div>
          </div>
        </div>
      </div>
      <div class="dig-upgrades-section">
        <h3>⬆️ Site Upgrades</h3>
        <div id="dig-upgrades-list" class="dig-upgrades-grid"></div>
      </div>
      <div class="dig-rarity-guide">
        <div class="dig-rarity-row common-row">🪨 Common — materials, low gold</div>
        <div class="dig-rarity-row uncommon-row">🥈 Uncommon — ores, alchemy ingredients</div>
        <div class="dig-rarity-row rare-row">💎 Rare — gems, relics, techniques</div>
        <div class="dig-rarity-row legendary-row">✨ Legendary — powerful items & spells</div>
      </div>
    </div>`;
  }
  updateDigInfo();
  renderDigUpgrades();
  updateSonarButton();
  updateRecentFinds();
  if (digGrid.length === 0) generateDigSite();
  else { renderDigGrid(); updateDigStats(); }
  updateDigButton();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-new-dig')?.addEventListener('click', () => {
    handleNewDigSite();
  });
  document.getElementById('btn-dig-action')?.addEventListener('click', digRandomTile);
});
