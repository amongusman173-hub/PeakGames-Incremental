// ===== PLAYER LEVELING & STATS =====

function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.15, level - 1));
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
  const sm = p.statMult;
  p.maxHp = Math.floor((30 + p.level * 8) * sm);
  p.hp = p.maxHp;
  p.maxStamina = Math.floor((40 + p.level * 3) * sm);
  p.atk = Math.floor((2 + p.level * 1.2) * sm);
  p.def = Math.floor((1 + p.level * 0.6) * sm);
  p.spd = Math.floor((2 + p.level * 0.5) * sm);
  toast(`⬆️ Level Up! Now level ${p.level}`, 'success');
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
  const sm = p.statMult;
  p.maxHp = Math.floor((30 + p.level * 8) * sm);
  p.hp = Math.min(p.hp, p.maxHp);
  p.maxStamina = Math.floor((40 + p.level * 3) * sm);
  p.stamina = Math.min(p.stamina, p.maxStamina);
  p.atk = Math.floor((2 + p.level * 1.2) * sm);
  p.def = Math.floor((1 + p.level * 0.6) * sm);
  p.spd = Math.floor((2 + p.level * 0.5) * sm);
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
