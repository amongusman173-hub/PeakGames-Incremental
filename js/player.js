// ===== PLAYER LEVELING & STATS =====

function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

// Compute the total stat bonuses from all purchased skill tree nodes
// Cached — call invalidateStatCache() after buying a node
function getSkillTreeBonuses() {
  if (_cachedSkillBonuses) return _cachedSkillBonuses;
  const bonus = { atk: 0, def: 0, spd: 0, maxHp: 0, maxStamina: 0, regenBonus: 0 };
  if (!G.player.skillNodes) { _cachedSkillBonuses = bonus; return bonus; }
  SKILL_TREE.forEach(node => {
    const lvl = G.player.skillNodes[node.id] || 0;
    if (lvl <= 0) return;
    const tmp = { atk:0, def:0, spd:0, maxHp:0, maxStamina:0, regenBonus:0 };
    for (let i = 0; i < lvl; i++) node.effect(tmp, i + 1);
    for (const k in bonus) bonus[k] += (tmp[k] || 0);
  });
  _cachedSkillBonuses = bonus;
  return bonus;
}

// Compute stat bonuses from heritage (clan/weapon/style)
// Cached — call invalidateStatCache() after rolling heritage
function getHeritageBonuses() {
  if (_cachedHeritageBonuses) return _cachedHeritageBonuses;
  const bonus = { atk: 0, def: 0, spd: 0, maxHp: 0 };
  const p = G.player;
  if (!p.heritage) { _cachedHeritageBonuses = bonus; return bonus; }
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
  _cachedHeritageBonuses = bonus;
  return bonus;
}

function recalcStats() {
  const p = G.player;
  const sm = p.statMult || 1;
  const b  = getSkillTreeBonuses();
  const hb = getHeritageBonuses();
  // Compute current formula values (level + skill tree + heritage)
  const fAtk   = Math.floor((2 + p.level * 1.2) * sm) + b.atk + hb.atk;
  const fDef   = Math.floor((1 + p.level * 0.6) * sm) + b.def + hb.def;
  const fSpd   = Math.floor((2 + p.level * 0.5) * sm) + b.spd + hb.spd;
  const fHp    = Math.floor((30 + p.level * 8) * sm) + b.maxHp + hb.maxHp;
  const fStam  = Math.floor((40 + p.level * 3) * sm) + b.maxStamina;
  const fRegen = b.regenBonus;
  // Initialize snapshot on first call — before computing delta
  if (!p._prevFormula) {
    p._prevFormula = { atk: fAtk, def: fDef, spd: fSpd, maxHp: fHp, maxStamina: fStam, regenBonus: fRegen };
  }
  // Compute total accumulated external bonuses (potions, training, dojo)
  // Delta = current stat − previous formula output = external gains since last recalc
  const extAtk   = Math.max(0, (p.atk || 0)       - (p._prevFormula.atk || 0));
  const extDef   = Math.max(0, (p.def || 0)       - (p._prevFormula.def || 0));
  const extSpd   = Math.max(0, (p.spd || 0)       - (p._prevFormula.spd || 0));
  const extHp    = Math.max(0, (p.maxHp || 0)     - (p._prevFormula.maxHp || 0));
  const extStam  = Math.max(0, (p.maxStamina || 0) - (p._prevFormula.maxStamina || 0));
  const extRegen = Math.max(0, (p.regenBonus || 0) - (p._prevFormula.regenBonus || 0));
  // Apply formula + external bonuses
  p.atk        = fAtk   + extAtk;
  p.def        = fDef   + extDef;
  p.spd        = fSpd   + extSpd;
  p.maxHp      = fHp    + extHp;
  p.maxStamina = fStam  + extStam;
  p.regenBonus = Math.min(fRegen + extRegen, 0.40);
  // Snapshot formula output for next recalc
  p._prevFormula = { atk: fAtk, def: fDef, spd: fSpd, maxHp: fHp, maxStamina: fStam, regenBonus: fRegen };
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
  const hdr = document.getElementById('header');
  if (hdr) { hdr.classList.add('level-up-flash'); setTimeout(() => hdr.classList.remove('level-up-flash'), 700); }
  if (typeof updateTabLockStates === 'function') updateTabLockStates();

  const hdrEl = document.getElementById('hdr-level');
  if (hdrEl) {
    const rect = hdrEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Particle burst — 30 particles
    const colors = ['#f5c542','#ffdd66','#ff9900','#fff','#b388ff','#42a5f5','#66ffaa'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      const angle = (Math.PI * 2 * i / 30) + Math.random() * 0.4;
      const dist = 50 + Math.random() * 80;
      const size = 3 + Math.random() * 6;
      const color = colors[Math.floor(Math.random() * colors.length)];
      el.style.cssText = `position:fixed;z-index:9999;pointer-events:none;border-radius:50%;width:${size}px;height:${size}px;background:${color};left:${cx}px;top:${cy}px;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;animation:digBurst 0.8s ease-out forwards;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }

    // Level number scale-up text
    const lvlText = document.createElement('div');
    lvlText.textContent = `LV ${p.level}`;
    lvlText.style.cssText = `position:fixed;z-index:10000;pointer-events:none;left:${cx}px;top:${cy}px;transform:translate(-50%,-50%) scale(0.3);font-size:48px;font-weight:900;color:#f5c542;text-shadow:0 0 20px rgba(245,197,66,0.8),0 0 40px rgba(245,197,66,0.4);animation:lvLevelNum 1.2s ease-out forwards;font-family:var(--font-body);`;
    document.body.appendChild(lvlText);
    setTimeout(() => lvlText.remove(), 1400);

    // Screen-wide golden flash
    const f = document.createElement('div');
    f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;background:radial-gradient(circle at ${cx}px ${cy}px,rgba(245,197,66,0.3),rgba(245,197,66,0.05));animation:lvScreenFlash 0.8s ease-out forwards;`;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 900);
  }

  // Level gates — re-render any tab whose unlock threshold was just crossed
  // so the locked section disappears immediately without needing a refresh
  const lvl = p.level;
  const GATES = {
    training: 1, jobs: 1, raids: 8, dig: 5,
    shop: 1, dojo: 15, library: 20, alchemy: 18,
    garden: 10, heritage: 1, story: 1,
  };

  if (typeof activeTab !== 'undefined') {
    // Always re-render the active tab
    if (activeTab === 'training') renderTraining();
    else if (activeTab === 'jobs')     renderJobs();
    else if (activeTab === 'raids')    renderRaids();
    else if (activeTab === 'story')    renderStoryChapters();
    else if (activeTab === 'dig')      renderDigUI();
    else if (activeTab === 'dojo')     renderDojo();
    else if (activeTab === 'library')  renderLibrary();
    else if (activeTab === 'alchemy')  renderAlchemy();
    else if (activeTab === 'garden')   renderGarden();
    else if (activeTab === 'shop')     renderSkillTree();
  }

  // If we just hit a gate level, show a toast so the player knows something unlocked
  const justUnlocked = [];
  if (lvl === 5)  justUnlocked.push('⛏️ Excavation');
  if (lvl === 8)  justUnlocked.push('⚔️ Raids');
  if (lvl === 10) justUnlocked.push('🌱 Garden');
  if (lvl === 15) justUnlocked.push('🥋 Dojo');
  if (lvl === 18) justUnlocked.push('⚗️ Alchemy');
  if (lvl === 20) justUnlocked.push('📚 Library');
  if (justUnlocked.length > 0) {
    setTimeout(() => toast(`🔓 Unlocked: ${justUnlocked.join(', ')}!`, 'rare'), 800);
  }
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
