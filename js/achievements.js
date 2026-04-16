// ===== ACHIEVEMENTS SYSTEM =====

const ACHIEVEMENTS = [
  // ── Leveling ──
  { id: 'lv5',      name: 'First Steps',        icon: '👣', desc: 'Reach level 5.',              cat: 'progress', check: p => p.level >= 5 },
  { id: 'lv10',     name: 'Getting Stronger',   icon: '💪', desc: 'Reach level 10.',             cat: 'progress', check: p => p.level >= 10 },
  { id: 'lv25',     name: 'Seasoned Fighter',   icon: '⚔️', desc: 'Reach level 25.',             cat: 'progress', check: p => p.level >= 25 },
  { id: 'lv50',     name: 'Veteran',            icon: '🏅', desc: 'Reach level 50.',             cat: 'progress', check: p => p.level >= 50 },
  { id: 'lv75',     name: 'Elite',              icon: '🌟', desc: 'Reach level 75.',             cat: 'progress', check: p => p.level >= 75 },
  { id: 'lv100',    name: 'Transcendent',       icon: '👑', desc: 'Reach level 100.',            cat: 'progress', check: p => p.level >= 100 },

  // ── Gold ──
  { id: 'gold1k',   name: 'Pocket Change',      icon: '💰', desc: 'Earn 1,000 gold.',            cat: 'wealth',   check: p => p.gold >= 1000 },
  { id: 'gold10k',  name: 'Merchant',           icon: '🏪', desc: 'Earn 10,000 gold.',           cat: 'wealth',   check: p => p.gold >= 10000 },
  { id: 'gold100k', name: 'Wealthy',            icon: '🏦', desc: 'Earn 100,000 gold.',          cat: 'wealth',   check: p => p.gold >= 100000 },
  { id: 'gold1m',   name: 'Millionaire',        icon: '💎', desc: 'Earn 1,000,000 gold.',        cat: 'wealth',   check: p => p.gold >= 1000000 },

  // ── Combat ──
  { id: 'first_kill',  name: 'First Blood',     icon: '🗡️', desc: 'Win your first battle.',      cat: 'combat',   check: p => (p.defeatedBosses && p.defeatedBosses.length >= 1) || (p.completedChapters && p.completedChapters.length >= 1) },
  { id: 'raid5',       name: 'Raider',          icon: '⚔️', desc: 'Defeat 5 raid bosses.',       cat: 'combat',   check: p => p.defeatedBosses && p.defeatedBosses.length >= 5 },
  { id: 'raid_all',    name: 'Raid Master',     icon: '🏆', desc: 'Defeat all raid bosses.',     cat: 'combat',   check: p => p.defeatedBosses && p.defeatedBosses.length >= 10 },
  { id: 'story3',      name: 'Adventurer',      icon: '📖', desc: 'Complete 3 story chapters.',  cat: 'combat',   check: p => p.completedChapters && p.completedChapters.length >= 3 },
  { id: 'story_all',   name: 'Legend',          icon: '🌌', desc: 'Complete all 10 chapters.',   cat: 'combat',   check: p => p.completedChapters && p.completedChapters.length >= 10 },

  // ── Stats ──
  { id: 'atk100',   name: 'Powerhouse',         icon: '💥', desc: 'Reach 100 ATK.',              cat: 'stats',    check: p => p.atk >= 100 },
  { id: 'atk500',   name: 'Destroyer',          icon: '🔥', desc: 'Reach 500 ATK.',              cat: 'stats',    check: p => p.atk >= 500 },
  { id: 'def100',   name: 'Iron Wall',          icon: '🛡️', desc: 'Reach 100 DEF.',              cat: 'stats',    check: p => p.def >= 100 },
  { id: 'spd100',   name: 'Lightning Fast',     icon: '⚡', desc: 'Reach 100 SPD.',              cat: 'stats',    check: p => p.spd >= 100 },
  { id: 'hp1000',   name: 'Tough',              icon: '❤️', desc: 'Reach 1,000 Max HP.',         cat: 'stats',    check: p => p.maxHp >= 1000 },
  { id: 'hp5000',   name: 'Unkillable',         icon: '💖', desc: 'Reach 5,000 Max HP.',         cat: 'stats',    check: p => p.maxHp >= 5000 },
  { id: 'stamina200',name:'Iron Lungs',          icon: '🫁', desc: 'Reach 200 Max Stamina.',      cat: 'stats',    check: p => p.maxStamina >= 200 },

  // ── Ascension ──
  { id: 'asc1',     name: 'Reborn',             icon: '✨', desc: 'Ascend for the first time.',  cat: 'ascend',   check: p => p.rebirthCount >= 1 },
  { id: 'asc3',     name: 'Cycle Breaker',      icon: '🔄', desc: 'Ascend 3 times.',             cat: 'ascend',   check: p => p.rebirthCount >= 3 },
  { id: 'asc5',     name: 'Eternal',            icon: '♾️', desc: 'Ascend 5 times.',             cat: 'ascend',   check: p => p.rebirthCount >= 5 },
  { id: 'asc_lv100',name:'Peak Ascension',      icon: '🌟', desc: 'Ascend at level 100.',        cat: 'ascend',   check: p => p.ascensionHistory && p.ascensionHistory.some(l => l >= 100) },

  // ── Techniques ──
  { id: 'tech5',    name: 'Collector',          icon: '🎒', desc: 'Own 5 techniques.',           cat: 'tech',     check: p => p.techniques && p.techniques.length >= 5 },
  { id: 'tech10',   name: 'Arsenal',            icon: '⚔️', desc: 'Own 10 techniques.',          cat: 'tech',     check: p => p.techniques && p.techniques.length >= 10 },
  { id: 'vessel',   name: 'The Vessel',         icon: '🩸', desc: 'Find Sukuna\'s Finger.',      cat: 'tech',     check: p => p.techniques && p.techniques.includes('vessel_switch') },
  { id: 'gojo',     name: 'The Honored One',    icon: '🔵', desc: 'Unlock the Gojo Clan.',       cat: 'tech',     check: p => p.heritage && p.heritage.clan === 'gojo_clan' },
  { id: 'domain',   name: 'Domain Expansion',   icon: '🏯', desc: 'Use Domain Expansion.',       cat: 'tech',     check: p => p.techniques && p.techniques.includes('domain_expansion') },

  // ── Alchemy ──
  { id: 'brew1',    name: 'Apprentice Brewer',  icon: '⚗️', desc: 'Discover your first recipe.', cat: 'alchemy',  check: p => p.alchemyRecipes && p.alchemyRecipes.length >= 1 },
  { id: 'brew10',   name: 'Alchemist',          icon: '🧪', desc: 'Discover 10 recipes.',        cat: 'alchemy',  check: p => p.alchemyRecipes && p.alchemyRecipes.length >= 10 },
  { id: 'brew_all', name: 'Master Alchemist',   icon: '🔮', desc: 'Discover all recipes.',       cat: 'alchemy',  check: p => p.alchemyRecipes && typeof ALCHEMY_RECIPES !== 'undefined' && p.alchemyRecipes.length >= ALCHEMY_RECIPES.length },

  // ── Dig ──
  { id: 'dig10',    name: 'Digger',             icon: '⛏️', desc: 'Dig 10 tiles.',               cat: 'explore',  check: p => (p._digCount || 0) >= 10 },
  { id: 'dig100',   name: 'Excavator',          icon: '🪨', desc: 'Dig 100 tiles.',              cat: 'explore',  check: p => (p._digCount || 0) >= 100 },
  { id: 'dig500',   name: 'Archaeologist',      icon: '🏺', desc: 'Dig 500 tiles.',              cat: 'explore',  check: p => (p._digCount || 0) >= 500 },

  // ── Garden ──
  { id: 'harvest1', name: 'Green Thumb',        icon: '🌱', desc: 'Harvest your first plant.',   cat: 'explore',  check: p => (p._harvestCount || 0) >= 1 },
  { id: 'harvest20',name: 'Farmer',             icon: '🌾', desc: 'Harvest 20 plants.',          cat: 'explore',  check: p => (p._harvestCount || 0) >= 20 },

  // ── Heritage ──
  { id: 'heritage1',name: 'Bloodline',          icon: '🏛️', desc: 'Roll your first heritage.',   cat: 'heritage', check: p => p.heritage && (p.heritage.clan || p.heritage.weapon || p.heritage.style) },
  { id: 'legendary_heritage', name: 'Legendary Blood', icon: '🌟', desc: 'Get a Legendary heritage.', cat: 'heritage', check: p => {
    if (!p.heritage) return false;
    const items = [p.heritage.clan, p.heritage.weapon, p.heritage.style].filter(Boolean);
    return items.some(id => {
      const all = [...(typeof CLANS!=='undefined'?CLANS:[]), ...(typeof WEAPONS!=='undefined'?WEAPONS:[]), ...(typeof FIGHTING_STYLES!=='undefined'?FIGHTING_STYLES:[])];
      const item = all.find(x => x.id === id);
      return item && (item.rarity === 'legendary' || item.rarity === 'secret');
    });
  }},

  // ── Misc ──
  { id: 'potion10', name: 'Potion Hoarder',     icon: '🍶', desc: 'Have 10 potions in stock.',   cat: 'misc',     check: p => {
    if (!p.potionInv) return false;
    return Object.values(p.potionInv).reduce((a,b) => a+b, 0) >= 10;
  }},
  { id: 'stamina0', name: 'Exhausted',          icon: '😮‍💨', desc: 'Run out of stamina.',        cat: 'misc',     check: p => (p._ranOutOfStamina || false) },
  { id: 'max_slots',name: 'Full Arsenal',       icon: '🎯', desc: 'Unlock all 10 gear slots.',   cat: 'misc',     check: p => typeof getMaxEquipSlots === 'function' && getMaxEquipSlots() >= 10 },

  // ── More Leveling ──
  { id: 'lv30',     name: 'Ascension Ready',    icon: '🔱', desc: 'Reach level 30.',             cat: 'progress', check: p => p.level >= 30 },

  // ── More Wealth ──
  { id: 'gold500k', name: 'Tycoon',             icon: '🤑', desc: 'Have 500,000 gold.',          cat: 'wealth',   check: p => p.gold >= 500000 },
  { id: 'spend10k', name: 'Big Spender',        icon: '💸', desc: 'Spend 10,000 gold on heritage.', cat: 'wealth', check: p => {
    if (!p.heritageRerolls) return false;
    const total = Object.values(p.heritageRerolls).reduce((a,b) => a+b, 0);
    return total >= 5;
  }},

  // ── More Combat ──
  { id: 'no_damage',  name: 'Untouchable',      icon: '🧊', desc: 'Win a battle without taking damage.', cat: 'combat', check: p => (p._perfectBattles || 0) >= 1 },
  { id: 'crit10',     name: 'Critical Eye',     icon: '💥', desc: 'Land 10 critical hits.',      cat: 'combat',   check: p => (p._critCount || 0) >= 10 },
  { id: 'crit100',    name: 'Precision',        icon: '🎯', desc: 'Land 100 critical hits.',     cat: 'combat',   check: p => (p._critCount || 0) >= 100 },
  { id: 'flee',       name: 'Coward',           icon: '🏃', desc: 'Successfully flee a battle.', cat: 'combat',   check: p => (p._fleeCount || 0) >= 1 },
  { id: 'story5',     name: 'Hero',             icon: '🦸', desc: 'Complete 5 story chapters.',  cat: 'combat',   check: p => p.completedChapters && p.completedChapters.length >= 5 },

  // ── More Stats ──
  { id: 'atk1000',  name: 'Godlike Power',      icon: '⚡', desc: 'Reach 1,000 ATK.',            cat: 'stats',    check: p => p.atk >= 1000 },
  { id: 'def500',   name: 'Fortress',           icon: '🏰', desc: 'Reach 500 DEF.',              cat: 'stats',    check: p => p.def >= 500 },
  { id: 'spd500',   name: 'Blur',               icon: '💨', desc: 'Reach 500 SPD.',              cat: 'stats',    check: p => p.spd >= 500 },
  { id: 'hp10000',  name: 'Immortal',           icon: '🫀', desc: 'Reach 10,000 Max HP.',        cat: 'stats',    check: p => p.maxHp >= 10000 },
  { id: 'stamina500',name:'Endless Energy',     icon: '⚡', desc: 'Reach 500 Max Stamina.',      cat: 'stats',    check: p => p.maxStamina >= 500 },

  // ── More Ascension ──
  { id: 'asc10',    name: 'Infinite Cycle',     icon: '🌀', desc: 'Ascend 10 times.',            cat: 'ascend',   check: p => p.rebirthCount >= 10 },
  { id: 'asc_lv50', name: 'Powered Ascension',  icon: '💪', desc: 'Ascend at level 50+.',        cat: 'ascend',   check: p => p.ascensionHistory && p.ascensionHistory.some(l => l >= 50) },
  { id: 'asc_lv75', name: 'Elite Ascension',    icon: '🌟', desc: 'Ascend at level 75+.',        cat: 'ascend',   check: p => p.ascensionHistory && p.ascensionHistory.some(l => l >= 75) },

  // ── More Techniques ──
  { id: 'tech15',   name: 'Master Collector',   icon: '🗃️', desc: 'Own 15 techniques.',          cat: 'tech',     check: p => p.techniques && p.techniques.length >= 15 },
  { id: 'hollow',   name: 'Hollow Purple',      icon: '🟣', desc: 'Unlock Hollow Purple.',       cat: 'tech',     check: p => p.techniques && p.techniques.includes('hollow_purple') },
  { id: 'infinite_void', name: 'Infinite Void', icon: '🌌', desc: 'Unlock Domain: Infinite Void.', cat: 'tech',  check: p => p.techniques && p.techniques.includes('domain_infinite_void') },
  { id: 'all_gojo', name: 'Six Eyes Mastery',   icon: '👁️', desc: 'Unlock all Gojo techniques.', cat: 'tech',    check: p => p.techniques && ['infinity','reversal_red','lapse_blue','hollow_purple','domain_infinite_void'].every(id => p.techniques.includes(id)) },
  { id: 'max_red',  name: 'Reversal Red MAX',   icon: '🔴', desc: 'Unlock Reversal Red MAX.',    cat: 'tech',     check: p => p.techniques && p.techniques.includes('reversal_red_max') },
  { id: 'max_blue', name: 'Lapse Blue MAX',     icon: '🔵', desc: 'Unlock Lapse Blue MAX.',      cat: 'tech',     check: p => p.techniques && p.techniques.includes('lapse_blue_max') },

  // ── More Alchemy ──
  { id: 'brew5',    name: 'Brewer',             icon: '🧫', desc: 'Discover 5 recipes.',         cat: 'alchemy',  check: p => p.alchemyRecipes && p.alchemyRecipes.length >= 5 },
  { id: 'brew_legendary', name: 'Grand Alchemist', icon: '✨', desc: 'Brew a Legendary potion.', cat: 'alchemy',  check: p => {
    if (!p.potionInv || typeof ALCHEMY_RECIPES === 'undefined') return false;
    return ALCHEMY_RECIPES.filter(r => r.rarity === 'legendary').some(r => (p.potionInv[r.id] || 0) > 0 || (p.alchemyRecipes || []).includes(r.id));
  }},
  { id: 'drink20',  name: 'Potion Addict',      icon: '🍶', desc: 'Drink 20 potions.',           cat: 'alchemy',  check: p => (p._potionsDrunk || 0) >= 20 },

  // ── More Explore ──
  { id: 'dig1000',  name: 'Master Digger',      icon: '⛏️', desc: 'Dig 1,000 tiles.',            cat: 'explore',  check: p => (p._digCount || 0) >= 1000 },
  { id: 'sonar',    name: 'Sonar Expert',       icon: '📡', desc: 'Use sonar 10 times.',         cat: 'explore',  check: p => (p._sonarCount || 0) >= 10 },
  { id: 'harvest50',name: 'Harvest Festival',   icon: '🌻', desc: 'Harvest 50 plants.',          cat: 'explore',  check: p => (p._harvestCount || 0) >= 50 },
  { id: 'full_garden', name: 'Full Garden',     icon: '🌿', desc: 'Fill all garden plots.',      cat: 'explore',  check: p => {
    if (!p.gardenPlots) return false;
    const filled = p.gardenPlots.filter(x => x !== null).length;
    return filled >= 9;
  }},

  // ── More Heritage ──
  { id: 'reroll10', name: 'Gambler',            icon: '🎲', desc: 'Reroll heritage 10 times.',   cat: 'heritage', check: p => {
    if (!p.heritageRerolls) return false;
    return Object.values(p.heritageRerolls).reduce((a,b) => a+b, 0) >= 10;
  }},
  { id: 'all_heritage', name: 'Complete Heritage', icon: '🏛️', desc: 'Have all 3 heritage slots filled.', cat: 'heritage', check: p => p.heritage && p.heritage.clan && p.heritage.weapon && p.heritage.style },
  { id: 'secret_heritage', name: 'Secret Blood', icon: '🔴', desc: 'Roll a Secret rarity heritage.', cat: 'heritage', check: p => {
    if (!p.heritage) return false;
    const all = [...(typeof CLANS!=='undefined'?CLANS:[]), ...(typeof WEAPONS!=='undefined'?WEAPONS:[]), ...(typeof FIGHTING_STYLES!=='undefined'?FIGHTING_STYLES:[])];
    return [p.heritage.clan, p.heritage.weapon, p.heritage.style].filter(Boolean).some(id => {
      const item = all.find(x => x.id === id);
      return item && item.rarity === 'secret';
    });
  }},

  // ── More Misc ──
  { id: 'jobs10',   name: 'Workaholic',         icon: '💼', desc: 'Complete 10 quick jobs.',     cat: 'misc',     check: p => (p._quickJobCount || 0) >= 10 },
  { id: 'jobs100',  name: 'Career',             icon: '🏢', desc: 'Complete 100 quick jobs.',    cat: 'misc',     check: p => (p._quickJobCount || 0) >= 100 },
  { id: 'train100', name: 'Dedicated',          icon: '🏋️', desc: 'Complete 100 training sessions.', cat: 'misc', check: p => (p._trainCount || 0) >= 100 },
  { id: 'train1000',name: 'Iron Will',          icon: '🔩', desc: 'Complete 1,000 training sessions.', cat: 'misc', check: p => (p._trainCount || 0) >= 1000 },
  { id: 'library_all', name: 'Scholar',         icon: '📚', desc: 'Learn all library spells.',   cat: 'misc',     check: p => {
    if (typeof MAGIC_SPELLS === 'undefined') return false;
    return MAGIC_SPELLS.every(s => p.techniques && p.techniques.includes(s.id));
  }},
];

// Track which achievements have been unlocked
function getUnlockedAchievements() {
  if (!G.player.achievements) G.player.achievements = [];
  return G.player.achievements;
}

// Called every few ticks to check for new unlocks
let _lastAchievementCheck = 0;
function checkAchievements() {
  const now = G.tickCount;
  if (now - _lastAchievementCheck < 20) return; // check every 5s
  _lastAchievementCheck = now;

  const unlocked = getUnlockedAchievements();
  const p = G.player;

  ACHIEVEMENTS.forEach(ach => {
    if (unlocked.includes(ach.id)) return;
    try {
      if (ach.check(p)) {
        unlocked.push(ach.id);
        _showAchievementUnlock(ach);
      }
    } catch(e) {}
  });
}

function _showAchievementUnlock(ach) {
  // Special toast with gold styling
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast rare achievement-toast';
  el.innerHTML = `<span style="font-size:18px">${ach.icon}</span> <span><strong>Achievement!</strong> ${ach.name}</span>`;
  el.style.cursor = 'pointer';
  el.title = ach.desc;
  const timer = setTimeout(() => el.remove(), 5000);
  el.addEventListener('click', () => { clearTimeout(timer); el.remove(); });
  container.appendChild(el);
  // Particle burst
  if (typeof vfxBurst === 'function') {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < 16; i++) {
      const p = document.createElement('div');
      const angle = (Math.PI * 2 * i / 16);
      const dist = 30 + Math.random() * 30;
      p.style.cssText = `position:fixed;z-index:9999;pointer-events:none;border-radius:50%;
        width:5px;height:5px;background:#f5c542;
        left:${cx}px;top:${cy}px;
        --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
        animation:digBurst 0.6s ease-out forwards;`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 700);
    }
  }
}

function renderAchievements() {
  const container = document.getElementById('achievements-container');
  if (!container) return;
  const unlocked = getUnlockedAchievements();
  const total = ACHIEVEMENTS.length;
  const done  = unlocked.length;

  const cats = [
    { id: 'progress', label: '📈 Progress' },
    { id: 'wealth',   label: '💰 Wealth' },
    { id: 'combat',   label: '⚔️ Combat' },
    { id: 'stats',    label: '💪 Stats' },
    { id: 'ascend',   label: '✨ Ascension' },
    { id: 'tech',     label: '🎒 Techniques' },
    { id: 'alchemy',  label: '⚗️ Alchemy' },
    { id: 'explore',  label: '🗺️ Explore' },
    { id: 'heritage', label: '🏛️ Heritage' },
    { id: 'misc',     label: '🎯 Misc' },
  ];

  const pct = Math.floor((done / total) * 100);

  container.innerHTML = `
    <div style="margin-bottom:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:14px;font-weight:700;color:var(--gold)">${done} / ${total} Achievements</div>
        <div style="font-size:12px;color:var(--dim)">${pct}% complete</div>
      </div>
      <div style="height:8px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:99px;transition:width 0.3s"></div>
      </div>
    </div>
    ${cats.map(cat => {
      const catAchs = ACHIEVEMENTS.filter(a => a.cat === cat.id);
      if (catAchs.length === 0) return '';
      const catDone = catAchs.filter(a => unlocked.includes(a.id)).length;
      return `
        <div style="margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="font-size:13px;color:var(--dim);text-transform:uppercase;letter-spacing:0.5px">${cat.label}</h3>
            <span style="font-size:11px;color:var(--dim)">${catDone}/${catAchs.length}</span>
          </div>
          <div class="card-grid">
            ${catAchs.map(ach => {
              const isUnlocked = unlocked.includes(ach.id);
              return `<div class="card" style="padding:12px;${isUnlocked ? 'border-color:var(--gold);background:rgba(245,197,66,0.06)' : 'opacity:0.5'}">
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:28px;${isUnlocked ? '' : 'filter:grayscale(1)'}">${isUnlocked ? ach.icon : '🔒'}</span>
                  <div>
                    <div style="font-weight:700;font-size:13px;color:${isUnlocked ? 'var(--gold)' : 'var(--dim)'}">${ach.name}</div>
                    <div style="font-size:11px;color:var(--dim);margin-top:2px">${ach.desc}</div>
                  </div>
                </div>
                ${isUnlocked ? `<div style="font-size:10px;color:var(--ok);margin-top:6px">✓ Unlocked</div>` : ''}
              </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('')}`;
}
