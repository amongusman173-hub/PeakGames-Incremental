// ===== PLAYER LEVELING & STATS =====

function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

// Compute the total stat bonuses from all purchased skill tree nodes
function getSkillTreeBonuses() {
  const bonus = { atk: 0, def: 0, spd: 0, maxHp: 0, maxStamina: 0, regenBonus: 0 };
  if (!G.player.skillNodes) return bonus;
  SKILL_TREE.forEach(node => {
    const lvl = G.player.skillNodes[node.id] || 0;
    if (lvl <= 0) return;
    const tmp = { atk:0, def:0, spd:0, maxHp:0, maxStamina:0, regenBonus:0 };
    for (let i = 0; i < lvl; i++) node.effect(tmp, i + 1);
    for (const k in bonus) bonus[k] += (tmp[k] || 0);
  });
  return bonus;
}

// Compute stat bonuses from heritage (clan/weapon/style)
function getHeritageBonuses() {
  const bonus = { atk: 0, def: 0, spd: 0, maxHp: 0 };
  const p = G.player;
  if (!p.heritage) return bonus;
  const items = [
    p.heritage.clan   ? (typeof CLANS !== 'undefined'          ? CLANS.find(x=>x.id===p.heritage.clan)           : null) : null,
    p.heritage.weapon ? (typeof WEAPONS !== 'undefined'        ? WEAPONS.find(x=>x.id===p.heritage.weapon)       : null) : null,
    p.heritage.style  ? (typeof FIGHTING_STYLES !== 'undefined'? FIGHTING_STYLES.find(x=>x.id===p.heritage.style): null) : null,
  ];
  items.forEach(item => {
    if (!item || !item.bonus) return;
    if (item.bonus.atk)   bonus.atk   += item.bonus.atk;
    if (item.bonus.def)   bonus.def   += item.bonus.def;
    if (item.bonus.spd)   bonus.spd   += item.bonus.spd;
    if (item.bonus.maxHp) bonus.maxHp += item.bonus.maxHp;
  });
  return bonus;
}

function recalcStats() {
  const p = G.player;
  const sm = p.statMult || 1;
  const b  = getSkillTreeBonuses();
  const hb = getHeritageBonuses();
  const oldMaxHp = p.maxHp;
  p.maxHp      = Math.floor((30 + p.level * 8) * sm) + b.maxHp + hb.maxHp;
  p.maxStamina = Math.floor((40 + p.level * 3) * sm) + b.maxStamina;
  p.atk        = Math.floor((2 + p.level * 1.2) * sm) + b.atk + hb.atk;
  p.def        = Math.floor((1 + p.level * 0.6) * sm) + b.def + hb.def;
  p.spd        = Math.floor((2 + p.level * 0.5) * sm) + b.spd + hb.spd;
  p.regenBonus = b.regenBonus;
  // Always clamp HP to new maxHp — never let it exceed or go below 1
  p.hp = Math.max(1, Math.min(p.hp, p.maxHp));
}

function gainXP(amount) {
  const p = G.player;
  const actual = Math.floor(amount * p.xpMult);
  p.xp += actual;
  while (p.xp >= p.xpNeeded) {
    p.xp -= p.xpNeeded;
    p.level++;
    p.xpNeeded = xpForLevel(p.level);
    onLevelUp();
  }
}

function onLevelUp() {
  const p = G.player;
  recalcStats();
  p.hp = p.maxHp;
  toast(`⬆️ Level Up! Now level ${p.level}`, 'success');
  playSound('levelup', 0.8);
  spawnFloatingText(`Lv.${p.level}!`, 'float-xp');
  // Flash the header
  const hdr = document.getElementById('header');
  if (hdr) { hdr.classList.add('level-up-flash'); setTimeout(() => hdr.classList.remove('level-up-flash'), 700); }
  renderTraining();
  renderJobs();
  renderRaids();
  renderStoryChapters();
}

function applyRebirthMultipliers() {
  const p = G.player;
  recalcStats();
  p.hp = Math.min(p.hp, p.maxHp);
  p.stamina = Math.min(p.stamina, p.maxStamina);
}

function gainGold(amount) {
  const actual = Math.floor(amount * G.player.goldMult);
  G.player.gold += actual;
  return actual;
}

function spendGold(amount) {
  if (G.player.gold < amount) return false;
  G.player.gold -= amount;
  return true;
}

function spendStamina(amount) {
  if (G.player.stamina < amount) return false;
  G.player.stamina -= amount;
  return true;
}
