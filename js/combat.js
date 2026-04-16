// ===== COMBAT VFX =====

// Get the enemy HP bar element (works for both story and raid)
function getEnemyEl() {
  return document.getElementById('be-hp-bar') || document.getElementById('rbe-hp-bar');
}
function getPlayerEl() {
  return document.getElementById('bp-hp-bar') || document.getElementById('rbp-hp-bar');
}

// Core: spawn particles from a screen element
function vfxBurst(anchorEl, colors, count, spread, duration) {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i / count) + Math.random() * 0.8;
    const dist = spread * (0.5 + Math.random() * 0.8);
    const size = 4 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `position:fixed;z-index:9998;pointer-events:none;border-radius:50%;
      width:${size}px;height:${size}px;background:${color};
      left:${cx}px;top:${cy}px;
      --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
      animation:digBurst ${duration}ms ease-out forwards;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), duration + 100);
  }
}

// Screen flash overlay
function vfxFlash(color, duration) {
  const f = document.createElement('div');
  f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;
    background:${color};animation:digFlash ${duration}ms ease-out forwards;`;
  document.body.appendChild(f);
  setTimeout(() => f.remove(), duration + 100);
}

// Shake the battle scene
function vfxShake(intensity) {
  const scene = document.getElementById('battle-scene') || document.getElementById('raid-battle-scene');
  if (!scene) return;
  scene.style.animation = 'none';
  scene.style.transform = `translateX(${intensity}px)`;
  setTimeout(() => { scene.style.transform = 'translateX(0)'; }, 60);
  setTimeout(() => { scene.style.transform = `translateX(-${intensity}px)`; }, 120);
  setTimeout(() => { scene.style.transform = 'translateX(0)'; scene.style.animation = ''; }, 180);
}

// Floating emoji that rises from the enemy
function vfxEmoji(emoji, anchorEl, color) {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const el = document.createElement('div');
  el.textContent = emoji;
  el.style.cssText = `position:fixed;z-index:9999;pointer-events:none;font-size:28px;
    left:${rect.left + rect.width/2 - 14}px;top:${rect.top - 10}px;
    color:${color || '#fff'};
    animation:floatUp 0.9s ease-out forwards;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// Slash lines across the enemy
function vfxSlash(anchorEl, color, count) {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  for (let i = 0; i < (count || 1); i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      const angle = -35 + Math.random() * 20;
      const w = 60 + Math.random() * 60;
      s.style.cssText = `position:fixed;z-index:9998;pointer-events:none;
        width:${w}px;height:3px;background:${color || '#fff'};border-radius:2px;
        left:${rect.left + Math.random() * rect.width - w/2}px;
        top:${rect.top + Math.random() * rect.height}px;
        transform:rotate(${angle}deg);opacity:0.9;
        animation:digFlash 300ms ease-out forwards;`;
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 400);
    }, i * 80);
  }
}

// Lightning bolt effect
function vfxLightning(anchorEl) {
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const el = document.createElement('canvas');
  el.width = 120; el.height = 160;
  el.style.cssText = `position:fixed;z-index:9998;pointer-events:none;
    left:${rect.left + rect.width/2 - 60}px;top:${rect.top - 80}px;
    animation:digFlash 400ms ease-out forwards;`;
  document.body.appendChild(el);
  const ctx = el.getContext('2d');
  ctx.strokeStyle = '#ffe066'; ctx.lineWidth = 3; ctx.shadowColor = '#ffe066'; ctx.shadowBlur = 12;
  ctx.beginPath();
  let x = 60, y = 0;
  ctx.moveTo(x, y);
  while (y < 160) {
    x += (Math.random() - 0.5) * 40;
    y += 20 + Math.random() * 20;
    ctx.lineTo(Math.max(10, Math.min(110, x)), y);
  }
  ctx.stroke();
  setTimeout(() => el.remove(), 500);
}

// The main VFX dispatcher — called with techId before damage is applied
function playAttackVFX(techId, crit) {
  const eEl = getEnemyEl();
  const pEl = getPlayerEl();

  switch (techId) {
    // ── Basic ──
    case 'basic':
      vfxBurst(eEl, ['#fff','#aaa','#ddd'], crit ? 14 : 8, crit ? 55 : 35, 400);
      if (crit) { vfxFlash('rgba(255,255,255,0.18)', 250); vfxShake(6); }
      else vfxShake(3);
      vfxEmoji(crit ? '💥' : '⚔️', eEl);
      break;

    // ── Common techniques ──
    case 'slash':
      vfxSlash(eEl, '#88ccff', 2);
      vfxBurst(eEl, ['#88ccff','#fff','#4499ff'], 10, 45, 350);
      vfxShake(4);
      break;
    case 'block':
      vfxBurst(pEl, ['#4fc3f7','#81d4fa','#fff'], 12, 40, 400);
      vfxEmoji('🛡️', pEl, '#4fc3f7');
      break;
    case 'quick_step':
      vfxBurst(eEl, ['#b2ff59','#69f0ae','#fff'], 10, 50, 300);
      vfxEmoji('💨', eEl, '#b2ff59');
      vfxShake(3);
      break;

    // ── Uncommon ──
    case 'earth_crush':
      vfxBurst(eEl, ['#8d6e63','#a1887f','#ffcc80','#fff'], 18, 65, 500);
      vfxFlash('rgba(141,110,99,0.25)', 300);
      vfxShake(8);
      vfxEmoji('🪨', eEl);
      break;
    case 'fang_strike':
      vfxSlash(eEl, '#ef9a9a', 3);
      vfxBurst(eEl, ['#ef9a9a','#fff','#e53935'], 14, 50, 400);
      vfxShake(5);
      break;
    case 'war_cry':
      vfxBurst(pEl, ['#ffe082','#ffca28','#fff'], 16, 60, 500);
      vfxFlash('rgba(255,202,40,0.15)', 300);
      vfxEmoji('📣', pEl, '#ffca28');
      break;

    // ── Rare ──
    case 'holy_slash':
      vfxSlash(eEl, '#fffde7', 3);
      vfxBurst(eEl, ['#fff9c4','#fffde7','#ffee58','#fff'], 20, 70, 500);
      vfxFlash('rgba(255,253,231,0.3)', 350);
      vfxShake(6);
      vfxEmoji('✨', eEl, '#ffee58');
      break;
    case 'tidal_wave':
      vfxBurst(eEl, ['#29b6f6','#0288d1','#b3e5fc','#fff'], 22, 75, 550);
      vfxFlash('rgba(41,182,246,0.2)', 400);
      vfxShake(7);
      vfxEmoji('🌊', eEl, '#29b6f6');
      break;
    case 'shadow_clone':
      for (let i = 0; i < 5; i++) setTimeout(() => {
        vfxBurst(eEl, ['#7e57c2','#b39ddb','#fff'], 6, 35, 300);
        vfxSlash(eEl, '#b39ddb', 1);
      }, i * 100);
      vfxShake(5);
      break;

    // ── Legendary ──
    case 'hellfire':
      vfxBurst(eEl, ['#ff6f00','#ff8f00','#ffca28','#fff','#e53935'], 28, 90, 600);
      vfxFlash('rgba(255,111,0,0.35)', 400);
      vfxShake(10);
      vfxEmoji('🔥', eEl, '#ff6f00');
      break;
    case 'void_rend':
      for (let i = 0; i < 7; i++) setTimeout(() => {
        vfxSlash(eEl, '#ce93d8', 1);
        vfxBurst(eEl, ['#7b1fa2','#ce93d8','#fff'], 5, 40, 350);
      }, i * 70);
      vfxFlash('rgba(123,31,162,0.3)', 500);
      vfxShake(9);
      break;
    case 'divine_heal':
      vfxBurst(pEl, ['#f8bbd0','#f48fb1','#fff','#fffde7'], 20, 65, 600);
      vfxFlash('rgba(248,187,208,0.25)', 400);
      vfxEmoji('💫', pEl, '#f48fb1');
      break;

    // ── Dojo techniques ──
    case 'iron_fist':
      vfxBurst(eEl, ['#90a4ae','#cfd8dc','#fff'], 12, 45, 350);
      vfxShake(5);
      vfxEmoji('👊', eEl);
      break;
    case 'leg_sweep':
      vfxBurst(eEl, ['#a5d6a7','#66bb6a','#fff'], 10, 40, 300);
      vfxShake(4);
      vfxEmoji('🦵', eEl);
      break;
    case 'power_strike':
      vfxBurst(eEl, ['#ff7043','#ff8a65','#fff'], 16, 60, 450);
      vfxFlash('rgba(255,112,67,0.2)', 300);
      vfxShake(7);
      vfxEmoji('💢', eEl, '#ff7043');
      break;
    case 'counter':
      vfxBurst(eEl, ['#26c6da','#80deea','#fff'], 14, 55, 400);
      vfxSlash(eEl, '#80deea', 2);
      vfxShake(5);
      break;
    case 'berserker_rush':
      for (let i = 0; i < 5; i++) setTimeout(() => {
        vfxBurst(eEl, ['#ef5350','#ff8a80','#fff'], 6, 35, 300);
        vfxShake(4);
      }, i * 90);
      vfxFlash('rgba(239,83,80,0.2)', 500);
      break;
    case 'death_blow':
      vfxBurst(eEl, ['#212121','#616161','#fff','#b71c1c'], 24, 80, 600);
      vfxFlash('rgba(0,0,0,0.5)', 400);
      vfxShake(12);
      vfxEmoji('💀', eEl, '#e53935');
      break;
    case 'thousand_fists':
      for (let i = 0; i < 8; i++) setTimeout(() => {
        vfxBurst(eEl, ['#ffa726','#ffcc02','#fff'], 5, 30, 250);
        vfxShake(3);
      }, i * 60);
      vfxFlash('rgba(255,167,38,0.2)', 600);
      break;

    // ── Magic spells ──
    case 'spark':
      vfxLightning(eEl);
      vfxBurst(eEl, ['#ffe066','#fff176','#fff'], 10, 45, 350);
      vfxShake(3);
      break;
    case 'frost_bolt':
      vfxBurst(eEl, ['#b3e5fc','#81d4fa','#e1f5fe','#fff'], 14, 55, 450);
      vfxFlash('rgba(179,229,252,0.2)', 300);
      vfxEmoji('❄️', eEl, '#81d4fa');
      break;
    case 'flame_burst':
      vfxBurst(eEl, ['#ff6f00','#ffa000','#ffca28','#fff'], 18, 65, 500);
      vfxFlash('rgba(255,111,0,0.25)', 350);
      vfxShake(6);
      vfxEmoji('🔥', eEl, '#ffa000');
      break;
    case 'arcane_bolt':
      vfxBurst(eEl, ['#7c4dff','#b388ff','#ea80fc','#fff'], 16, 60, 450);
      vfxFlash('rgba(124,77,255,0.2)', 300);
      vfxShake(5);
      vfxEmoji('🔮', eEl, '#b388ff');
      break;
    case 'mana_shield':
      vfxBurst(pEl, ['#7c4dff','#b388ff','#fff'], 14, 50, 450);
      vfxFlash('rgba(124,77,255,0.15)', 300);
      vfxEmoji('🛡️', pEl, '#b388ff');
      break;
    case 'chain_lightning':
      for (let i = 0; i < 4; i++) setTimeout(() => {
        vfxLightning(eEl);
        vfxBurst(eEl, ['#ffe066','#fff176','#fff'], 6, 35, 300);
      }, i * 120);
      vfxShake(6);
      break;
    case 'meteor':
      vfxBurst(eEl, ['#ff3d00','#ff6d00','#ffab40','#fff','#212121'], 30, 100, 700);
      vfxFlash('rgba(255,61,0,0.4)', 500);
      vfxShake(14);
      vfxEmoji('☄️', eEl, '#ff6d00');
      break;
    case 'time_stop':
      vfxFlash('rgba(255,255,255,0.6)', 200);
      setTimeout(() => vfxFlash('rgba(100,100,255,0.2)', 600), 200);
      vfxBurst(eEl, ['#e8eaf6','#9fa8da','#fff'], 18, 70, 600);
      vfxEmoji('⏰', eEl, '#9fa8da');
      break;
    case 'void_blast':
      vfxBurst(eEl, ['#1a237e','#283593','#7986cb','#fff'], 28, 90, 700);
      vfxFlash('rgba(26,35,126,0.5)', 500);
      vfxShake(12);
      for (let i = 0; i < 6; i++) setTimeout(() => vfxSlash(eEl, '#7986cb', 1), i * 80);
      vfxEmoji('🌀', eEl, '#7986cb');
      break;

    // ── Dig techniques ──
    case 'ancient_strike':
      vfxBurst(eEl, ['#d4a017','#f5c542','#fff8e1','#fff'], 16, 60, 500);
      vfxFlash('rgba(212,160,23,0.2)', 350);
      vfxShake(6);
      vfxEmoji('🏺', eEl, '#f5c542');
      break;
    case 'crystal_shard':
      for (let i = 0; i < 4; i++) setTimeout(() => {
        vfxBurst(eEl, ['#80deea','#b2ebf2','#e0f7fa','#fff'], 6, 40, 350);
        vfxSlash(eEl, '#80deea', 1);
      }, i * 80);
      vfxShake(5);
      break;

    // ══════════════════════════════════════════
    // 🩸 JJK EASTER EGG TECHNIQUES — special VFX
    // ══════════════════════════════════════════

    case 'vessel_switch':
      // Blood-red full screen takeover
      vfxFlash('rgba(180,0,0,0.55)', 700);
      setTimeout(() => vfxFlash('rgba(180,0,0,0.3)', 500), 300);
      vfxBurst(eEl, ['#b71c1c','#e53935','#ff1744','#fff'], 20, 70, 600);
      vfxEmoji('🩸', eEl, '#ff1744');
      vfxShake(8);
      break;

    case 'dismantle':
      // Fast diagonal slashes — Sukuna's signature
      for (let i = 0; i < 4; i++) setTimeout(() => {
        vfxSlash(eEl, '#ff1744', 2);
        vfxBurst(eEl, ['#b71c1c','#ff1744','#fff'], 8, 50, 350);
      }, i * 60);
      vfxFlash('rgba(183,28,28,0.35)', 400);
      vfxShake(10);
      vfxEmoji('✂️', eEl, '#ff1744');
      break;

    case 'cleave':
      // Three heavy slashes with shockwave
      for (let i = 0; i < 3; i++) setTimeout(() => {
        vfxSlash(eEl, '#ff6d00', 3);
        vfxBurst(eEl, ['#e65100','#ff6d00','#ffab40','#fff'], 10, 55, 400);
        vfxShake(7);
      }, i * 120);
      vfxFlash('rgba(230,81,0,0.3)', 500);
      vfxEmoji('🔪', eEl, '#ff6d00');
      break;

    case 'fuga':
      // Giant fire arrow — massive single impact
      vfxFlash('rgba(255,87,34,0.5)', 300);
      setTimeout(() => {
        vfxBurst(eEl, ['#bf360c','#e64a19','#ff7043','#ffab40','#fff9c4','#fff'], 40, 120, 800);
        vfxFlash('rgba(255,87,34,0.4)', 500);
        vfxShake(16);
        vfxEmoji('🏹', eEl, '#ff7043');
        // Secondary explosion
        setTimeout(() => {
          vfxBurst(eEl, ['#ff6f00','#ffa000','#ffca28','#fff'], 20, 80, 600);
          vfxShake(10);
        }, 200);
      }, 150);
      break;

    case 'domain_expansion':
      // Malevolent Shrine — dark red domain with continuous slash waves
      vfxFlash('rgba(0,0,0,0.7)', 400);
      setTimeout(() => vfxFlash('rgba(120,0,0,0.5)', 600), 200);
      setTimeout(() => {
        for (let i = 0; i < 6; i++) setTimeout(() => {
          vfxSlash(eEl, '#ff1744', 3);
          vfxBurst(eEl, ['#7f0000','#b71c1c','#ff1744','#fff'], 12, 65, 500);
          vfxShake(8);
        }, i * 150);
      }, 300);
      vfxEmoji('🏯', eEl, '#ff1744');
      break;

    // ── Gojo techniques ──
    case 'infinity':
      // Blue-white barrier shimmer on player
      vfxBurst(pEl, ['#e3f2fd','#90caf9','#42a5f5','#fff'], 24, 80, 700);
      vfxFlash('rgba(66,165,245,0.25)', 500);
      vfxEmoji('♾️', pEl, '#42a5f5');
      break;

    case 'reversal_red':
      // Explosive red repulsion
      vfxBurst(eEl, ['#b71c1c','#e53935','#ff5252','#fff'], 22, 85, 600);
      vfxFlash('rgba(229,57,53,0.4)', 400);
      vfxShake(10);
      vfxEmoji('🔴', eEl, '#ff5252');
      break;

    case 'reversal_red_max':
      // Amplified — bigger, redder, more shake
      vfxBurst(eEl, ['#7f0000','#b71c1c','#ff1744','#ff8a80','#fff'], 35, 110, 700);
      vfxFlash('rgba(183,28,28,0.55)', 500);
      vfxShake(16);
      vfxEmoji('🔴', eEl, '#ff1744');
      setTimeout(() => vfxBurst(eEl, ['#ff1744','#fff'], 15, 60, 400), 200);
      break;

    case 'lapse_blue':
      // Blue gravitational pull — imploding particles
      vfxBurst(eEl, ['#0d47a1','#1565c0','#42a5f5','#90caf9','#fff'], 22, 85, 600);
      vfxFlash('rgba(21,101,192,0.35)', 400);
      vfxShake(10);
      vfxEmoji('🔵', eEl, '#42a5f5');
      break;

    case 'lapse_blue_max':
      vfxBurst(eEl, ['#0a237e','#0d47a1','#1976d2','#64b5f6','#fff'], 35, 110, 700);
      vfxFlash('rgba(13,71,161,0.55)', 500);
      vfxShake(16);
      vfxEmoji('🔵', eEl, '#1976d2');
      setTimeout(() => vfxBurst(eEl, ['#42a5f5','#fff'], 15, 60, 400), 200);
      break;

    case 'hollow_purple':
      // Red + Blue merge = purple obliteration
      vfxFlash('rgba(255,0,0,0.3)', 150);
      setTimeout(() => vfxFlash('rgba(0,0,255,0.3)', 150), 150);
      setTimeout(() => {
        vfxFlash('rgba(128,0,128,0.6)', 600);
        vfxBurst(eEl, ['#4a148c','#7b1fa2','#ce93d8','#ff80ab','#82b1ff','#fff'], 45, 130, 900);
        vfxShake(18);
        vfxEmoji('🟣', eEl, '#ce93d8');
        for (let i = 0; i < 8; i++) setTimeout(() => vfxSlash(eEl, '#ce93d8', 2), i * 80);
      }, 300);
      break;

    case 'domain_infinite_void':
      // Infinite Void — white flash then total darkness then stars
      vfxFlash('rgba(255,255,255,0.9)', 200);
      setTimeout(() => vfxFlash('rgba(0,0,0,0.85)', 800), 200);
      setTimeout(() => {
        vfxBurst(eEl, ['#e8eaf6','#9fa8da','#5c6bc0','#fff'], 40, 120, 1000);
        vfxShake(14);
        vfxEmoji('🌌', eEl, '#9fa8da');
        for (let i = 0; i < 10; i++) setTimeout(() => {
          vfxBurst(eEl, ['#fff','#e8eaf6'], 4, 50, 400);
        }, i * 100);
      }, 400);
      break;

    default:
      // Generic fallback for any unlisted technique
      vfxBurst(eEl, ['#fff','#aaa'], 8, 40, 350);
      vfxShake(3);
      break;
  }
}

// Enemy attack VFX — hits the player side
function playEnemyAttackVFX(abilityId) {
  const pEl = getPlayerEl();
  switch (abilityId) {
    case 'heavy_blow':
      vfxBurst(pEl, ['#ef9a9a','#e53935','#fff'], 16, 60, 450);
      vfxFlash('rgba(229,57,53,0.2)', 300);
      vfxShake(8);
      break;
    case 'poison_bite':
      vfxBurst(pEl, ['#a5d6a7','#388e3c','#fff'], 12, 45, 400);
      vfxEmoji('🐍', pEl, '#66bb6a');
      break;
    case 'shield_bash':
      vfxBurst(pEl, ['#90a4ae','#cfd8dc','#fff'], 10, 40, 350);
      vfxShake(6);
      vfxEmoji('🛡️', pEl);
      break;
    case 'double_strike':
      setTimeout(() => { vfxBurst(pEl, ['#ef9a9a','#fff'], 8, 35, 300); vfxShake(4); }, 0);
      setTimeout(() => { vfxBurst(pEl, ['#ef9a9a','#fff'], 8, 35, 300); vfxShake(4); }, 200);
      break;
    case 'life_drain':
      vfxBurst(pEl, ['#880e4f','#e91e63','#f48fb1','#fff'], 14, 55, 500);
      vfxEmoji('🩸', pEl, '#e91e63');
      break;
    case 'enrage':
      vfxFlash('rgba(229,57,53,0.25)', 400);
      vfxEmoji('😡', pEl, '#e53935');
      break;
    default:
      vfxBurst(pEl, ['#ef9a9a','#fff'], 8, 35, 300);
      vfxShake(3);
      break;
  }
}

// ===== TURN-BASED COMBAT ENGINE =====

// ── SPD UTILITY — gives SPD real combat value ──
// Every 10 SPD = 1% dodge, capped at 40%
// Every 10 SPD = 0.5% crit chance bonus, capped at 25%
// Every 20 SPD = +100ms extra time on minigames, capped at +1500ms
function getSpdDodgeChance() {
  return Math.min(0.40, (G.player.spd / 10) * 0.01);
}
function getSpdCritBonus() {
  return Math.min(0.25, (G.player.spd / 10) * 0.005);
}
function getSpdMgTimeBonus() {
  return Math.min(1500, Math.floor(G.player.spd / 20) * 100);
}

let combatActive = false;
let combatContext = 'story'; // 'story' or 'raid'
let combatCallback = null;
let combatEnemy = null;
let combatLog = null;
let combatPlayerHP = 0;
let combatEnemyHP = 0;
let combatTurn = 0;
let combatStatusPlayer = [];
let combatStatusEnemy = [];

// ── ENEMY ABILITY POOL ──
const ENEMY_ABILITIES = [
  { id: 'heavy_blow',   name: 'Heavy Blow',    icon: '🔨', dmgMult: 2.2,  effect: null,                                    msg: e => `${e.name} winds up a HEAVY BLOW!` },
  { id: 'poison_bite',  name: 'Poison Bite',   icon: '🐍', dmgMult: 0.8,  effect: (s) => s.push({name:'Poison',icon:'🟢',turns:3,dot:2}), msg: e => `${e.name} bites and poisons you!` },
  { id: 'shield_bash',  name: 'Shield Bash',   icon: '🛡️', dmgMult: 0.6,  effect: (s) => s.push({name:'Stunned',icon:'⚡',turns:1,skipTurn:true}), msg: e => `${e.name} bashes you with a shield!` },
  { id: 'double_strike',name: 'Double Strike',  icon: '⚔️', dmgMult: 1.4,  hits: 2,                                         msg: e => `${e.name} strikes twice!` },
  { id: 'war_cry',      name: 'War Cry',        icon: '📣', dmgMult: 0,    effect: (s,e) => { e._atkBuff = (e._atkBuff||0)+0.3; }, msg: e => `${e.name} lets out a WAR CRY! (+30% ATK)` },
  { id: 'life_drain',   name: 'Life Drain',     icon: '🩸', dmgMult: 1.5,  drain: true,                                     msg: e => `${e.name} drains your life force!` },
  { id: 'enrage',       name: 'Enrage',         icon: '😡', dmgMult: 0,    effect: (s,e) => { e._atkBuff = (e._atkBuff||0)+0.5; }, msg: e => `${e.name} ENRAGES! (+50% ATK)` },
  { id: 'tail_sweep',   name: 'Tail Sweep',     icon: '🌀', dmgMult: 1.0,  effect: (s) => s.push({name:'Slowed',icon:'🐢',turns:2}), msg: e => `${e.name} sweeps with its tail!` },
];

function getEnemyAbilities(enemy) {
  const pool = ENEMY_ABILITIES;
  const count = enemy.abilityCount || Math.min(3, Math.floor(1 + (enemy.atk / 20)));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, pool.length));
}

function appendLog(logEl, msg, cls = '') {
  if (!logEl) return;
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = msg;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

// ── RAID COMBAT (turn-based, uses same UI as story) ──
function startRaidBattle(enemy, logEl, callback) {
  if (combatActive) { toast('Already in combat!', 'warn'); return; }
  combatActive = true;
  combatContext = 'raid';
  combatCallback = callback;
  combatEnemy = { ...enemy, abilities: getEnemyAbilities(enemy), _atkBuff: 0 };
  combatLog = logEl;
  combatPlayerHP = G.player.hp;
  combatEnemyHP = enemy.hp;
  combatTurn = 0;
  combatStatusPlayer = [];
  combatStatusEnemy = [];
  resetMgCounts();
  resetTechCooldowns();

  const raidBattle = document.getElementById('raid-battle');
  const raidList   = document.getElementById('raids-list');
  if (raidBattle) raidBattle.classList.remove('hidden');
  if (raidList)   raidList.classList.add('hidden');
  document.getElementById('raid-log')?.classList.remove('hidden');

  updateRaidBattleUI();
  renderRaidTechniqueActions();

  if (logEl) logEl.innerHTML = '';
  appendLog(logEl, `⚔️ ${enemy.name} appears!`, 'log-story');
  if (enemy.intro) appendLog(logEl, `"${enemy.intro}"`, 'log-story');
  if (combatEnemy.abilities?.length) {
    appendLog(logEl, `⚠️ Abilities: ${combatEnemy.abilities.map(a=>a.icon+a.name).join(', ')}`, 'log-info');
  }
  setBattleActionsEnabled(true, 'raid');
}

function updateRaidBattleUI() {
  const p = G.player;
  const pPct = Math.max(0, (combatPlayerHP / p.maxHp) * 100);
  const ePct = Math.max(0, (combatEnemyHP / combatEnemy.maxHp) * 100);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setW = (id, w) => { const el = document.getElementById(id); if (el) el.style.width = w + '%'; };

  set('rbp-name', p.name);
  setW('rbp-hp-bar', pPct);
  set('rbp-hp-txt', `${Math.max(0,Math.floor(combatPlayerHP))}/${p.maxHp}`);
  set('rbe-name', combatEnemy.name + ' ' + (combatEnemy.icon||''));
  setW('rbe-hp-bar', ePct);
  set('rbe-hp-txt', `${Math.max(0,Math.floor(combatEnemyHP))}/${combatEnemy.maxHp}`);

  const bpStatus = document.getElementById('rbp-status');
  const beStatus = document.getElementById('rbe-status');
  if (bpStatus) bpStatus.innerHTML = combatStatusPlayer.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
  if (beStatus) beStatus.innerHTML = combatStatusEnemy.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
}

function renderRaidTechniqueActions() {
  const container = document.getElementById('raid-technique-actions');
  if (!container) return;
  if (vesselSwitchActive) {
    renderVesselTechniqueActions();
    return;
  }
  const equipped = G.player.equipped.filter(id => id !== null);
  container.innerHTML = equipped.map(techId => {
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (!tech) return '';
    const cd = techCooldowns[techId] || 0;
    const onCd = cd > 0;
    return `<button class="btn-action${onCd ? ' btn-on-cd' : ''}" onclick="useRaidTechnique('${tech.id}')" ${onCd ? 'disabled' : ''}>
      ${tech.icon} ${tech.name}${onCd ? ` <span class="cd-badge">${cd}</span>` : ''}
    </button>`;
  }).join('');
}

function useRaidTechnique(techId) {
  const tech = TECHNIQUES.find(t => t.id === techId);
  if (!tech) return;
  setBattleActionsEnabled(false, 'raid');
  techniqueMinigame(tech, (mult) => {
    applyTechniqueEffect(tech, mult, () => {
      if (combatEnemyHP > 0) setTimeout(() => enemyTurnRaid(), 500);
    });
  });
}

function raidBasicAttack() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'raid');
  basicAttackMinigame((mult) => {
    const p = G.player;
    const techBonus = getEquippedTechBonus();
    const base = Math.floor((p.atk + techBonus.atk) * (0.85 + Math.random() * 0.3) * mult);
    const dmg = Math.max(1, base - combatEnemy.def);
    const crit = Math.random() < 0.1 + techBonus.critChance + getSpdCritBonus();
    const final = crit ? Math.floor(dmg * 1.8) : dmg;
    playAttackVFX('basic', crit);
    playSound('basicattack', 0.7);
    combatEnemyHP -= final;
    appendLog(combatLog, `${crit?'💥 CRIT! ':''}Basic Attack: ${final} dmg (${mult.toFixed(1)}x)`, crit?'log-crit':'log-player');
    updateRaidBattleUI();
    if (combatEnemyHP <= 0) { endRaidBattle(true); return; }
    setTimeout(() => enemyTurnRaid(), 500);
  });
}

function raidFlee() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'raid');
  fleeMinigame((success) => {
    if (success) {
      appendLog(combatLog, '🏃 You fled successfully! No gold lost.', 'log-info');
      endRaidBattle(null);
    } else {
      const penalty = Math.floor(G.player.gold * 0.1);
      G.player.gold = Math.max(0, G.player.gold - penalty);
      appendLog(combatLog, `❌ Failed to flee! Lost ${penalty} gold!`, 'log-enemy');
      setTimeout(() => enemyTurnRaid(), 400);
    }
  });
}

function enemyTurnRaid() {
  if (!combatActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();

  // Tick status effects on player
  let skipTurn = false;
  combatStatusPlayer = combatStatusPlayer.map(s => {
    if (s.dot) { combatPlayerHP -= s.dot; appendLog(combatLog, `☠️ Poison deals ${s.dot} damage!`, 'log-enemy'); }
    if (s.skipTurn && s.turns > 0) skipTurn = true;
    return { ...s, turns: s.turns - 1 };
  }).filter(s => s.turns > 0);

  updateRaidBattleUI();
  if (combatPlayerHP <= 0) { endRaidBattle(false); return; }

  // Pick enemy action — bosses with more abilities use them more often
  const abilityChance = Math.min(0.75, 0.35 + (combatEnemy.abilityCount || 0) * 0.06);
  const useAbility = combatEnemy.abilities?.length && Math.random() < abilityChance;
  const ability = useAbility ? combatEnemy.abilities[Math.floor(Math.random() * combatEnemy.abilities.length)] : null;

  const atkMult = 1 + (combatEnemy._atkBuff || 0);
  const baseAtk = Math.floor(combatEnemy.atk * atkMult * (0.85 + Math.random() * 0.3));

  // SPD dodge check — applied to the whole enemy turn
  if (Math.random() < getSpdDodgeChance()) {
    appendLog(combatLog, `💨 You dodged the attack! (SPD: ${Math.floor(G.player.spd)})`, 'log-heal');
    updateRaidBattleUI();
    setBattleActionsEnabled(true, 'raid');
    return;
  }

  if (ability) {
    appendLog(combatLog, ability.msg(combatEnemy), 'log-enemy');
    playEnemyAttackVFX(ability.id);
    if (ability.effect) ability.effect(combatStatusPlayer, combatEnemy);
    if (ability.dmgMult > 0) {
      const hits = ability.hits || 1;
      let total = 0;
      for (let h = 0; h < hits; h++) {
        const raw = Math.floor(baseAtk * ability.dmgMult);
        const d = Math.max(Math.floor(raw * 0.4), raw - (p.def + techBonus.def));
        total += d;
        combatPlayerHP -= d;
      }
      if (ability.drain) { combatEnemyHP = Math.min(combatEnemy.maxHp, combatEnemyHP + Math.floor(total * 0.5)); }
      appendLog(combatLog, `  → ${total} damage!`, 'log-enemy');
    }
  } else {
    playEnemyAttackVFX('default');
    const eDmg = Math.max(Math.floor(baseAtk * 0.4), baseAtk - (p.def + techBonus.def));
    combatPlayerHP -= eDmg;
    appendLog(combatLog, `${combatEnemy.name} attacks for ${eDmg} damage!`, 'log-enemy');
  }

  updateRaidBattleUI();
  if (combatPlayerHP <= 0) { endRaidBattle(false); return; }
  tickTechCooldowns();
  setBattleActionsEnabled(true, 'raid');
}

function endRaidBattle(won) {
  combatActive = false;
  G.player.hp = Math.max(1, Math.floor(combatPlayerHP));
  setBattleActionsEnabled(false, 'raid');

  // Fire callback immediately for rewards
  if (combatCallback) combatCallback(won);

  const raidBattle = document.getElementById('raid-battle');
  const raidList   = document.getElementById('raids-list');
  const resultEl   = document.getElementById('raid-result');
  const resultText = document.getElementById('raid-result-text');

  // Show result text briefly
  if (resultText) {
    if (won === true)  { resultText.textContent = '🏆 Victory!'; resultText.style.color = 'var(--ok)'; }
    else if (won === false) { resultText.textContent = '💀 Defeated...'; resultText.style.color = 'var(--danger)'; }
    else               { resultText.textContent = '🏃 Escaped!'; resultText.style.color = 'var(--warn)'; }
  }
  if (resultEl) resultEl.classList.remove('hidden');

  // Always return to raid list after a short delay
  setTimeout(() => {
    if (raidBattle) raidBattle.classList.add('hidden');
    if (raidList)   raidList.classList.remove('hidden');
    if (resultEl)   resultEl.classList.add('hidden');
    renderRaids();
  }, 1800);
}

// ── STORY BATTLE (interactive, with minigames) ──
function startStoryBattle(enemy, storyCallback) {
  if (combatActive) return;
  combatActive = true;
  combatContext = 'story';
  combatCallback = storyCallback;
  combatEnemy = { ...enemy, abilities: getEnemyAbilities(enemy), _atkBuff: 0 };
  combatLog = document.getElementById('battle-log');
  combatPlayerHP = G.player.hp;
  combatEnemyHP = enemy.hp;
  combatTurn = 0;
  combatStatusPlayer = [];
  combatStatusEnemy = [];
  resetMgCounts();
  resetTechCooldowns();
  // Only reset vessel switch on a fresh story session (not when chaining enemies)
  // vesselSwitchActive / vesselSwitchCharges are preserved across chained fights

  document.getElementById('story-chapters').classList.add('hidden');
  document.getElementById('story-battle').classList.remove('hidden');
  document.getElementById('battle-result').classList.add('hidden');

  updateBattleUI();
  renderTechniqueActions();

  if (combatLog) combatLog.innerHTML = '';
  appendLog(combatLog, `⚔️ ${enemy.name} appears!`, 'log-story');
  if (enemy.intro) appendLog(combatLog, `"${enemy.intro}"`, 'log-story');
  if (combatEnemy.abilities?.length) {
    appendLog(combatLog, `⚠️ Abilities: ${combatEnemy.abilities.map(a=>a.icon+a.name).join(', ')}`, 'log-info');
  }
  if (vesselSwitchActive) {
    appendLog(combatLog, `🩸 Sukuna mode carries over — ${vesselSwitchCharges} fight(s) remaining.`, 'log-crit');
  }
  setBattleActionsEnabled(true, 'story');
}

function updateBattleUI() {
  const p = G.player;
  const pPct = Math.max(0, (combatPlayerHP / p.maxHp) * 100);
  const ePct = Math.max(0, (combatEnemyHP / (combatEnemy?.maxHp || 1)) * 100);
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  const setW = (id, w) => { const el = document.getElementById(id); if (el) el.style.width = w + '%'; };

  set('bp-name', p.name);
  setW('bp-hp-bar', pPct);
  set('bp-hp-txt', `${Math.max(0,Math.floor(combatPlayerHP))}/${p.maxHp}`);
  set('be-name', combatEnemy?.name || '');
  setW('be-hp-bar', ePct);
  set('be-hp-txt', `${Math.max(0,Math.floor(combatEnemyHP))}/${combatEnemy?.maxHp || 0}`);

  const bpStatus = document.getElementById('bp-status');
  const beStatus = document.getElementById('be-status');
  if (bpStatus) bpStatus.innerHTML = combatStatusPlayer.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
  if (beStatus) beStatus.innerHTML = combatStatusEnemy.map(s=>`<span class="status-badge">${s.icon} ${s.name}(${s.turns})</span>`).join('');
}

// Track vessel switch charges — declared here so renderTechniqueActions can reference them
let vesselSwitchActive = false;
let vesselSwitchCharges = 0;
const VESSEL_SWITCH_CHARGES = 3;

// ── TECHNIQUE COOLDOWNS ──
// techId → turns remaining on cooldown (0 = ready)
const techCooldowns = {};

// Cooldown definitions: techId → turns before can use again (0 = no cooldown)
const TECH_COOLDOWN_MAP = {
  // No cooldown — spammable
  'slash': 0, 'iron_fist': 0, 'quick_step': 0, 'dismantle': 0, 'basic': 0,
  // 1-turn cooldown
  'block': 1, 'leg_sweep': 1, 'fang_strike': 1, 'earth_crush': 1, 'cleave': 1,
  'spark': 1, 'frost_bolt': 1, 'flame_burst': 1, 'war_cry': 1, 'counter': 1,
  // 2-turn cooldown
  'power_strike': 2, 'holy_slash': 2, 'tidal_wave': 2, 'shadow_clone': 2,
  'arcane_bolt': 2, 'mana_shield': 2, 'chain_lightning': 2, 'berserker_rush': 2,
  'ancient_strike': 2, 'crystal_shard': 2,
  // 3-turn cooldown
  'hellfire': 3, 'void_rend': 3, 'divine_heal': 3, 'death_blow': 3,
  'thousand_fists': 3, 'meteor': 3, 'fuga': 3,
  // 4-turn cooldown — very powerful
  'void_blast': 4, 'time_stop': 4, 'reversal_red': 4, 'lapse_blue': 4,
  'reversal_red_max': 4, 'lapse_blue_max': 4, 'hollow_purple': 4,
  // 5-turn cooldown — domain expansions
  'domain_expansion': 5, 'domain_infinite_void': 5,
  // Vessel switch: 3-turn cooldown after use
  'vessel_switch': 3,
  // Infinity: 4-turn cooldown
  'infinity': 4,
};

function getTechCooldown(techId) {
  return TECH_COOLDOWN_MAP[techId] || 0;
}

function tickTechCooldowns() {
  for (const id in techCooldowns) {
    if (techCooldowns[id] > 0) techCooldowns[id]--;
  }
}

function resetTechCooldowns() {
  for (const id in techCooldowns) delete techCooldowns[id];
}

function renderTechniqueActions() {
  const container = document.getElementById('technique-actions');
  if (!container) return;
  if (vesselSwitchActive) {
    renderVesselTechniqueActions();
    return;
  }
  const equipped = G.player.equipped.filter(id => id !== null);
  container.innerHTML = equipped.map(techId => {
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (!tech) return '';
    const cd = techCooldowns[techId] || 0;
    const onCd = cd > 0;
    return `<button class="btn-action${tech._jjk ? ' jjk-btn' : ''}${onCd ? ' btn-on-cd' : ''}"
      onclick="useTechnique('${tech.id}')" ${onCd ? 'disabled' : ''}>
      ${tech.icon} ${tech.name}${onCd ? ` <span class="cd-badge">${cd}</span>` : ''}
    </button>`;
  }).join('');
}

function renderVesselTechniqueActions() {
  const container = document.getElementById('technique-actions');
  if (!container) return;
  const jjkIds = ['dismantle', 'cleave', 'fuga', 'domain_expansion'];
  // Use the right handler depending on whether we're in story or raid
  const handler = combatContext === 'raid' ? 'useRaidTechnique' : 'useTechnique';
  const buttons = jjkIds.map(id => {
    const tech = TECHNIQUES.find(t => t.id === id);
    const cd = techCooldowns[id] || 0;
    const onCd = cd > 0;
    const label = tech ? `${tech.icon} ${tech.name}` : id;
    return `<button class="btn-action jjk-btn${onCd ? ' btn-on-cd' : ''}"
      onclick="${handler}('${id}')" ${onCd ? 'disabled' : ''}>
      ${label}${onCd ? ` <span class="cd-badge">${cd}</span>` : ''}
    </button>`;
  }).join('');
  container.innerHTML =
    `<div style="width:100%;font-size:10px;color:#ff3333;margin-bottom:4px">🩸 SUKUNA MODE — ${vesselSwitchCharges} fight(s) remaining</div>` +
    buttons;
}

function applyTechniqueEffect(tech, mult, afterCb) {
  const p = G.player;

  // ── Play technique sound ──
  const TECH_SOUNDS = {
    'dismantle': 'dismantle', 'cleave': 'sukuna cleave', 'fuga': 'sukuna fuga',
    'domain_expansion': 'sukuna domain', 'domain_infinite_void': 'gojo domain',
    'reversal_red': 'reversal red', 'reversal_red_max': 'reversal red MAX',
    'lapse_blue': 'lapse blue', 'lapse_blue_max': 'lapse blue MAX',
    'hollow_purple': 'hollow purple',
    'heal': 'healingmagic', 'divine_heal': 'healingmagic', 'mana_shield': 'healingmagic',
    'spark': 'basicspell', 'frost_bolt': 'basicspell', 'arcane_bolt': 'basicspell',
    'chain_lightning': 'basicspell', 'flame_burst': 'basicspell',
    'earth_crush': 'basiccrushattack', 'drag_crush': 'basiccrushattack',
    'slash': 'basicslashattack', 'holy_slash': 'basicslashattack',
    'fang_strike': 'basicslashattack', 'shadow_clone': 'basicslashattack',
  };
  const snd = TECH_SOUNDS[tech.id] || (tech.effect === 'heal' ? 'healingmagic' : tech.effect === 'damage' ? 'basicattack' : null);
  if (snd) playSound(snd, 0.8);

  // Set cooldown for this technique
  const cd = getTechCooldown(tech.id);
  if (cd > 0) techCooldowns[tech.id] = cd;

  // Track Gojo technique usage for Red/Blue MAX upgrades
  if (typeof useGojoTech === 'function' && (tech.id === 'reversal_red' || tech.id === 'lapse_blue')) {
    useGojoTech(tech.id);
  }

  // ── VESSEL SWITCH — swap moveset to JJK techniques for 3 enemy kills ──
  if (tech.effect === 'vessel' || tech._vesselSwitch) {
    vesselSwitchActive = true;
    vesselSwitchCharges = VESSEL_SWITCH_CHARGES;
    appendLog(combatLog, '🩸 VESSEL SWITCH — Sukuna takes over!', 'log-crit');
    appendLog(combatLog, `"This body... is mine now." — Active for ${VESSEL_SWITCH_CHARGES} enemies.`, 'log-story');
    // Flash red
    const flash = document.createElement('div');
    flash.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;
      background:rgba(180,0,0,0.4);animation:digFlash 0.6s ease-out forwards;`;
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 700);
    renderVesselTechniqueActions();
    updateBattleUI();
    // Enemy takes a turn, then re-enable the new vessel buttons
    setTimeout(() => {
      if (combatContext === 'raid') enemyTurnRaid(); else enemyTurn();
    }, 500);
    return;
  }

  // ── DOMAIN EXPANSION: MALEVOLENT SHRINE — continuous slashes for 4 turns ──
  if (tech.effect === 'domain_slash') {
    playAttackVFX('domain_expansion', false);
    appendLog(combatLog, '🏯 DOMAIN EXPANSION: MALEVOLENT SHRINE!', 'log-crit');
    appendLog(combatLog, '"Shrine of Carnage — everything within range will be slashed."', 'log-story');
    // Apply domain slash status to enemy — deals damage each turn for 4 turns
    const slashDmg = Math.floor(p.atk * tech.slashMult * mult);
    combatStatusEnemy.push({
      name: 'Malevolent Shrine',
      icon: '🏯',
      turns: tech.slashTurns,
      dot: slashDmg, // damage per turn applied to enemy
      isEnemyDot: true,
    });
    // Immediate hit too
    const immediateDmg = Math.max(1, slashDmg - combatEnemy.def);
    combatEnemyHP -= immediateDmg;
    appendLog(combatLog, `💥 Initial slash: ${immediateDmg} dmg! Continuous slashes for ${tech.slashTurns} turns!`, 'log-crit');
    updateBattleUI();
    if (combatEnemyHP <= 0) { endBattle(true); return; }
    afterCb();
    return;
  }

  // ── GOJO DOMAIN: INFINITE VOID — immobilize + spawn new enemy ──
  if (tech.id === 'domain_infinite_void') {
    playAttackVFX('domain_infinite_void', false);
    appendLog(combatLog, '🌌 DOMAIN EXPANSION: INFINITE VOID!', 'log-crit');
    appendLog(combatLog, '"Trapped in infinite information. You cannot move."', 'log-story');
    // Immobilize enemy for 4 turns
    combatStatusEnemy.push({ name: 'Immobilized', icon: '🌌', turns: 4, skipTurn: true });
    // Spawn a new enemy that attacks for 4 turns
    combatStatusPlayer.push({
      name: 'Void Spawn',
      icon: '👁️',
      turns: 4,
      dot: Math.floor(p.atk * 0.5), // void spawn deals damage each turn
      isVoidSpawn: true,
    });
    const dmg = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
    combatEnemyHP -= dmg;
    appendLog(combatLog, `💥 ${dmg} dmg! Enemy immobilized for 4 turns! A Void Spawn appears!`, 'log-crit');
    updateBattleUI();
    if (combatEnemyHP <= 0) { endBattle(true); return; }
    afterCb();
    return;
  }

  if (tech.effect === 'damage') {
    playAttackVFX(tech.id, mult >= 1.8);
    const dmg = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
    combatEnemyHP -= dmg;
    appendLog(combatLog, `${tech.icon} ${tech.name}: ${dmg} dmg (${mult.toFixed(1)}x)!`, mult >= 1.5 ? 'log-crit' : 'log-player');
  } else if (tech.effect === 'heal') {
    playAttackVFX(tech.id, false);
    const healAmt = Math.floor(p.maxHp * tech.healPct * mult);
    combatPlayerHP = Math.min(p.maxHp, combatPlayerHP + healAmt);
    appendLog(combatLog, `${tech.icon} ${tech.name}: Healed ${healAmt} HP!`, 'log-heal');
  } else if (tech.effect === 'stun') {
    playAttackVFX(tech.id, mult >= 1.5);
    const dmg = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
    combatEnemyHP -= dmg;
    if (mult >= 1.0) combatStatusEnemy.push({ name: 'Stunned', icon: '⚡', turns: 2 });
    appendLog(combatLog, `${tech.icon} ${tech.name}: ${dmg} dmg${mult>=1?' + Stunned!':''}`, 'log-crit');
  } else if (tech.effect === 'multi') {
    playAttackVFX(tech.id, false);
    let total = 0;
    for (let i = 0; i < tech.hits; i++) {
      const d = Math.max(1, Math.floor(p.atk * tech.multiplier * mult) - combatEnemy.def);
      total += d; combatEnemyHP -= d;
    }
    appendLog(combatLog, `${tech.icon} ${tech.name}: ${tech.hits}x hits = ${total} total!`, 'log-crit');
  } else if (tech.effect === 'shield') {
    playAttackVFX(tech.id, false);
    combatStatusPlayer.push({ name: 'Infinity', icon: '♾️', turns: tech.shieldTurns || 2, shield: true });
    appendLog(combatLog, `♾️ Infinity activated! Immune for ${tech.shieldTurns} turns!`, 'log-heal');
  }
  updateBattleUI();
  if (combatEnemyHP <= 0) { endBattle(true); return; }
  afterCb();
}

function useTechnique(techId) {
  const tech = TECHNIQUES.find(t => t.id === techId);
  if (!tech) {
    // Safety: if tech not found but vessel is active, re-enable buttons
    if (vesselSwitchActive) setBattleActionsEnabled(true, 'story');
    return;
  }
  setBattleActionsEnabled(false, 'story');
  techniqueMinigame(tech, (mult) => {
    applyTechniqueEffect(tech, mult, () => setTimeout(enemyTurn, 500));
  });
}

function basicAttack() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'story');
  basicAttackMinigame((mult) => {
    const p = G.player;
    const techBonus = getEquippedTechBonus();
    const base = Math.floor((p.atk + techBonus.atk) * (0.85 + Math.random() * 0.3) * mult);
    const dmg = Math.max(1, base - combatEnemy.def);
    const crit = Math.random() < 0.1 + techBonus.critChance + getSpdCritBonus();
    const final = crit ? Math.floor(dmg * 1.8) : dmg;
    playAttackVFX('basic', crit);
    playSound('basicattack', 0.7);
    combatEnemyHP -= final;
    appendLog(combatLog, `${crit?'💥 CRIT! ':''}Basic Attack: ${final} dmg (${mult.toFixed(1)}x)`, crit?'log-crit':'log-player');
    updateBattleUI();
    if (combatEnemyHP <= 0) { endBattle(true); return; }
    setTimeout(enemyTurn, 500);
  });
}

function fleeBattle() {
  if (!combatActive) return;
  setBattleActionsEnabled(false, 'story');
  fleeMinigame((success) => {
    if (success) {
      appendLog(combatLog, '🏃 You fled! No gold lost.', 'log-info');
      endBattle(null);
    } else {
      const penalty = Math.floor(G.player.gold * 0.1);
      G.player.gold = Math.max(0, G.player.gold - penalty);
      appendLog(combatLog, `❌ Failed to flee! Lost ${penalty} gold!`, 'log-enemy');
      setTimeout(enemyTurn, 400);
    }
  });
}

function enemyTurn() {
  if (!combatActive) return;
  const p = G.player;
  const techBonus = getEquippedTechBonus();

  // Tick status effects
  let skipTurn = false;
  combatStatusPlayer = combatStatusPlayer.map(s => {
    if (s.dot && !s.isEnemyDot) {
      // Poison/void spawn damage to player
      combatPlayerHP -= s.dot;
      if (s.isVoidSpawn) appendLog(combatLog, `👁️ Void Spawn attacks for ${s.dot} dmg!`, 'log-enemy');
      else appendLog(combatLog, `☠️ Poison: ${s.dot} dmg!`, 'log-enemy');
    }
    if (s.skipTurn) skipTurn = true;
    return { ...s, turns: s.turns - 1 };
  }).filter(s => s.turns > 0);

  // Tick enemy status effects (domain slash deals damage to enemy each turn)
  // Also check if enemy is immobilized/stunned
  let enemySkipTurn = false;
  combatStatusEnemy = combatStatusEnemy.map(s => {
    if (s.dot && s.isEnemyDot) {
      const dmg = Math.max(1, s.dot - combatEnemy.def);
      combatEnemyHP -= dmg;
      appendLog(combatLog, `🏯 Malevolent Shrine slashes for ${dmg} dmg!`, 'log-crit');
    }
    if (s.skipTurn) enemySkipTurn = true;
    return { ...s, turns: s.turns - 1 };
  }).filter(s => s.turns > 0);

  updateBattleUI();
  if (combatPlayerHP <= 0) { endBattle(false); return; }
  if (combatEnemyHP <= 0) { endBattle(true); return; }
  if (skipTurn) { appendLog(combatLog, `${combatEnemy.name} is stunned/immobilized!`, 'log-info'); tickTechCooldowns(); setBattleActionsEnabled(true, 'story'); return; }
  if (enemySkipTurn) { appendLog(combatLog, `${combatEnemy.name} is immobilized — cannot act!`, 'log-info'); tickTechCooldowns(); setBattleActionsEnabled(true, 'story'); return; }

  // Check Infinity shield
  const hasShield = combatStatusPlayer.some(s => s.shield);
  if (hasShield) {
    appendLog(combatLog, `♾️ Infinity blocks the attack!`, 'log-heal');
    tickTechCooldowns();
    setBattleActionsEnabled(true, 'story');
    return;
  }

  const useAbility = combatEnemy.abilities?.length && Math.random() < 0.35;
  const ability = useAbility ? combatEnemy.abilities[Math.floor(Math.random() * combatEnemy.abilities.length)] : null;
  const atkMult = 1 + (combatEnemy._atkBuff || 0);
  const baseAtk = Math.floor(combatEnemy.atk * atkMult * (0.85 + Math.random() * 0.3));

  // SPD dodge check
  if (Math.random() < getSpdDodgeChance()) {
    appendLog(combatLog, `💨 You dodged the attack! (SPD: ${Math.floor(G.player.spd)})`, 'log-heal');
    updateBattleUI();
    setBattleActionsEnabled(true, 'story');
    return;
  }

  if (ability) {
    appendLog(combatLog, ability.msg(combatEnemy), 'log-enemy');
    playEnemyAttackVFX(ability.id);
    if (ability.effect) ability.effect(combatStatusPlayer, combatEnemy);
    if (ability.dmgMult > 0) {
      const hits = ability.hits || 1;
      let total = 0;
      for (let h = 0; h < hits; h++) {
        const raw = Math.floor(baseAtk * ability.dmgMult);
        const d = Math.max(Math.floor(raw * 0.4), raw - (p.def + techBonus.def));
        total += d; combatPlayerHP -= d;
      }
      if (ability.drain) combatEnemyHP = Math.min(combatEnemy.maxHp, combatEnemyHP + Math.floor(total * 0.5));
      appendLog(combatLog, `  → ${total} damage!`, 'log-enemy');
    }
  } else {
    playEnemyAttackVFX('default');
    const eDmg = Math.max(Math.floor(baseAtk * 0.4), baseAtk - (p.def + techBonus.def));
    combatPlayerHP -= eDmg;
    appendLog(combatLog, `${combatEnemy.name} attacks for ${eDmg} damage!`, 'log-enemy');
  }

  updateBattleUI();
  if (combatPlayerHP <= 0) { endBattle(false); return; }
  tickTechCooldowns();
  setBattleActionsEnabled(true, 'story');
}

function endBattle(won) {
  combatActive = false;
  G.player.hp = Math.max(1, Math.floor(combatPlayerHP));
  setBattleActionsEnabled(false, 'story');

  // Decrement vessel switch charges on any fight end (win, lose, or flee)
  if (vesselSwitchActive) {
    vesselSwitchCharges--;
    if (vesselSwitchCharges <= 0) {
      vesselSwitchActive = false;
      vesselSwitchCharges = 0;
      appendLog(combatLog, '🩸 Sukuna recedes... Vessel Switch expired.', 'log-info');
      // Swap buttons back to normal moveset immediately
      if (combatContext === 'raid') renderRaidTechniqueActions();
      else renderTechniqueActions();
    }
  }

  const resultEl = document.getElementById('battle-result');
  const resultText = document.getElementById('result-text');
  if (resultEl) resultEl.classList.remove('hidden');
  if (resultText) {
    if (won === true)  { resultText.textContent = '🏆 Victory!'; resultText.style.color = 'var(--ok)'; }
    else if (won === false) {
      resultText.textContent = '💀 Defeated...'; resultText.style.color = 'var(--danger)';
      const penalty = Math.floor(G.player.gold * 0.15);
      G.player.gold = Math.max(0, G.player.gold - penalty);
      if (penalty > 0) appendLog(combatLog, `💸 Lost ${penalty} gold from defeat!`, 'log-enemy');
    } else { resultText.textContent = '🏃 Escaped!'; resultText.style.color = 'var(--warn)'; }
  }
  if (combatCallback) combatCallback(won);
}

function setBattleActionsEnabled(enabled, context) {
  const prefix = context === 'raid' ? 'r' : '';
  [`${prefix}btn-basic-atk`, `${prefix}btn-flee`].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = !enabled;
  });
  // If enabling story buttons while vessel switch is active, re-render vessel buttons first
  // so the fresh DOM elements exist before we try to enable them
  if (enabled && vesselSwitchActive && (context === 'story' || context === 'raid')) {
    renderVesselTechniqueActions();
  }
  const techContainer = context === 'raid' ? '#raid-technique-actions' : '#technique-actions';
  document.querySelectorAll(`${techContainer} .btn-action`).forEach(btn => { btn.disabled = !enabled; });
}

// Wire up story battle buttons
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-basic-atk')?.addEventListener('click', basicAttack);
  document.getElementById('btn-flee')?.addEventListener('click', fleeBattle);
  document.getElementById('rbtn-basic-atk')?.addEventListener('click', raidBasicAttack);
  document.getElementById('rbtn-flee')?.addEventListener('click', raidFlee);
});
