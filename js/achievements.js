const ACHIEVEMENTS = [
  { id: 'lv5',      name: 'First Steps',        icon: '👣', desc: 'Reach level 5.',              cat: 'progress', check: p => p.level >= 5 },
  { id: 'lv10',     name: 'Getting Stronger',   icon: '💪', desc: 'Reach level 10.',             cat: 'progress', check: p => p.level >= 10 },
  { id: 'lv25',     name: 'Seasoned Fighter',   icon: '⚔️', desc: 'Reach level 25.',             cat: 'progress', check: p => p.level >= 25 },
  { id: 'lv50',     name: 'Veteran',            icon: '🏅', desc: 'Reach level 50.',             cat: 'progress', check: p => p.level >= 50 },
  { id: 'lv75',     name: 'Elite',              icon: '🌟', desc: 'Reach level 75.',             cat: 'progress', check: p => p.level >= 75 },
  { id: 'lv100',    name: 'Transcendent',       icon: '👑', desc: 'Reach level 100.',            cat: 'progress', check: p => p.level >= 100 },
  { id: 'lv30',     name: 'Ascension Ready',    icon: '🔱', desc: 'Reach level 30.',             cat: 'progress', check: p => p.level >= 30 },
  { id: 'gold1k',   name: 'Pocket Change',      icon: '💰', desc: 'Earn 1,000 gold.',            cat: 'wealth',   check: p => p.gold >= 1000 },
  { id: 'gold10k',  name: 'Merchant',           icon: '🏪', desc: 'Earn 10,000 gold.',           cat: 'wealth',   check: p => p.gold >= 10000 },
  { id: 'gold100k', name: 'Wealthy',            icon: '🏦', desc: 'Earn 100,000 gold.',          cat: 'wealth',   check: p => p.gold >= 100000 },
  { id: 'gold1m',   name: 'Millionaire',        icon: '💎', desc: 'Earn 1,000,000 gold.',        cat: 'wealth',   check: p => p.gold >= 1000000 },
  { id: 'gold500k', name: 'Tycoon',             icon: '🤑', desc: 'Have 500,000 gold.',          cat: 'wealth',   check: p => p.gold >= 500000 },
  { id: 'spend10k', name: 'Big Spender',        icon: '💸', desc: 'Spend 10,000 gold on heritage.', cat: 'wealth', check: p => {
    if (!p.heritageRerolls) return false;
    const total = Object.values(p.heritageRerolls).reduce((a,b) => a+b, 0);
    return total >= 5;
  }},
  { id: 'first_kill',  name: 'First Blood',     icon: '🗡️', desc: 'Win your first battle.',      cat: 'combat',   check: p => (p.defeatedBosses && p.defeatedBosses.length >= 1) || (p.completedChapters && p.completedChapters.length >= 1) },
  { id: 'raid5',       name: 'Raider',          icon: '⚔️', desc: 'Defeat 5 raid bosses.',       cat: 'combat',   check: p => p.defeatedBosses && p.defeatedBosses.length >= 5 },
  { id: 'raid_all',    name: 'Raid Master',     icon: '🏆', desc: 'Defeat all raid bosses.',     cat: 'combat',   check: p => p.defeatedBosses && p.defeatedBosses.length >= 10 },
  { id: 'story3',      name: 'Adventurer',      icon: '📖', desc: 'Complete 3 story chapters.',  cat: 'combat',   check: p => p.completedChapters && p.completedChapters.length >= 3 },
  { id: 'story_all',   name: 'Legend',          icon: '🌌', desc: 'Complete all 10 chapters.',   cat: 'combat',   check: p => p.completedChapters && p.completedChapters.length >= 10 },
  { id: 'no_damage',  name: 'Untouchable',      icon: '🧊', desc: 'Win a battle without taking damage.', cat: 'combat', check: p => (p._perfectBattles || 0) >= 1 },
  { id: 'crit10',     name: 'Critical Eye',     icon: '💥', desc: 'Land 10 critical hits.',      cat: 'combat',   check: p => (p._critCount || 0) >= 10 },
  { id: 'crit100',    name: 'Precision',        icon: '🎯', desc: 'Land 100 critical hits.',     cat: 'combat',   check: p => (p._critCount || 0) >= 100 },
  { id: 'flee',       name: 'Coward',           icon: '🏃', desc: 'Successfully flee a battle.', cat: 'combat',   check: p => (p._fleeCount || 0) >= 1 },
  { id: 'story5',     name: 'Hero',             icon: '🦸', desc: 'Complete 5 story chapters.',  cat: 'combat',   check: p => p.completedChapters && p.completedChapters.length >= 5 },
  { id: 'atk100',   name: 'Powerhouse',         icon: '💥', desc: 'Reach 100 ATK.',              cat: 'stats',    check: p => p.atk >= 100 },
  { id: 'atk500',   name: 'Destroyer',          icon: '🔥', desc: 'Reach 500 ATK.',              cat: 'stats',    check: p => p.atk >= 500 },
  { id: 'atk1000',  name: 'Godlike Power',      icon: '⚡', desc: 'Reach 1,000 ATK.',            cat: 'stats',    check: p => p.atk >= 1000 },
  { id: 'def100',   name: 'Iron Wall',          icon: '🛡️', desc: 'Reach 100 DEF.',              cat: 'stats',    check: p => p.def >= 100 },
  { id: 'def500',   name: 'Fortress',           icon: '🏰', desc: 'Reach 500 DEF.',              cat: 'stats',    check: p => p.def >= 500 },
  { id: 'spd100',   name: 'Lightning Fast',     icon: '⚡', desc: 'Reach 100 SPD.',              cat: 'stats',    check: p => p.spd >= 100 },
  { id: 'spd500',   name: 'Blur',               icon: '💨', desc: 'Reach 500 SPD.',              cat: 'stats',    check: p => p.spd >= 500 },
  { id: 'hp1000',   name: 'Tough',              icon: '❤️', desc: 'Reach 1,000 Max HP.',         cat: 'stats',    check: p => p.maxHp >= 1000 },
  { id: 'hp5000',   name: 'Unkillable',         icon: '💖', desc: 'Reach 5,000 Max HP.',         cat: 'stats',    check: p => p.maxHp >= 5000 },
  { id: 'hp10000',  name: 'Immortal',           icon: '🫀', desc: 'Reach 10,000 Max HP.',        cat: 'stats',    check: p => p.maxHp >= 10000 },
  { id: 'stamina200',name:'Iron Lungs',          icon: '🫁', desc: 'Reach 200 Max Stamina.',      cat: 'stats',    check: p => p.maxStamina >= 200 },
  { id: 'stamina500',name:'Endless Energy',     icon: '⚡', desc: 'Reach 500 Max Stamina.',      cat: 'stats',    check: p => p.maxStamina >= 500 },
  { id: 'asc1',     name: 'Reborn',             icon: '✨', desc: 'Ascend for the first time.',  cat: 'ascend',   check: p => p.rebirthCount >= 1 },
  { id: 'asc3',     name: 'Cycle Breaker',      icon: '🔄', desc: 'Ascend 3 times.',             cat: 'ascend',   check: p => p.rebirthCount >= 3 },
  { id: 'asc5',     name: 'Eternal',            icon: '♾️', desc: 'Ascend 5 times.',             cat: 'ascend',   check: p => p.rebirthCount >= 5 },
  { id: 'asc10',    name: 'Infinite Cycle',     icon: '🌀', desc: 'Ascend 10 times.',            cat: 'ascend',   check: p => p.rebirthCount >= 10 },
  { id: 'asc_lv100',name:'Peak Ascension',      icon: '🌟', desc: 'Ascend at level 100.',        cat: 'ascend',   check: p => p.ascensionHistory && p.ascensionHistory.some(l => l >= 100) },
  { id: 'asc_lv50', name: 'Powered Ascension',  icon: '💪', desc: 'Ascend at level 50+.',        cat: 'ascend',   check: p => p.ascensionHistory && p.ascensionHistory.some(l => l >= 50) },
  { id: 'asc_lv75', name: 'Elite Ascension',    icon: '🌟', desc: 'Ascend at level 75+.',        cat: 'ascend',   check: p => p.ascensionHistory && p.ascensionHistory.some(l => l >= 75) },
  { id: 'tech5',    name: 'Collector',          icon: '🎒', desc: 'Own 5 techniques.',           cat: 'tech',     check: p => p.techniques && p.techniques.length >= 5 },
  { id: 'tech10',   name: 'Arsenal',            icon: '⚔️', desc: 'Own 10 techniques.',          cat: 'tech',     check: p => p.techniques && p.techniques.length >= 10 },
  { id: 'tech15',   name: 'Master Collector',   icon: '🗃️', desc: 'Own 15 techniques.',          cat: 'tech',     check: p => p.techniques && p.techniques.length >= 15 },
  { id: 'cosmic',   name: 'Cosmic Wanderer',    icon: '🪐', desc: 'Find a Cosmic Shard.',        cat: 'tech',     check: p => p.techniques && p.techniques.includes('celestial_wrath') },
  { id: 'ethereal', name: 'Between Worlds',     icon: '✨', desc: 'Unlock the Ethereal Clan.',   cat: 'tech',     check: p => p.heritage && p.heritage.clan === 'ethereal_clan' },
  { id: 'celestial_wrath_ach', name: 'Celestial Wrath', icon: '⚡', desc: 'Unlock Celestial Wrath.', cat: 'tech',     check: p => p.techniques && p.techniques.includes('celestial_wrath') },
  { id: 'nexus_storm_ach', name: 'Nexus Storm',  icon: '🌀', desc: 'Unlock Nexus Storm.',         cat: 'tech',     check: p => p.techniques && p.techniques.includes('nexus_storm') },
  { id: 'all_celestial', name: 'Cosmic Mastery', icon: '🪐', desc: 'Unlock all Celestial techniques.', cat: 'tech', check: p => p.techniques && ['astral_slash','chrono_strike','void_nova','celestial_wrath','nexus_storm'].every(id => p.techniques.includes(id)) },
  { id: 'max_chrono', name: 'Chrono Strike MAX', icon: '⏳', desc: 'Unlock Chrono Strike MAX.',   cat: 'tech',     check: p => p.techniques && p.techniques.includes('chrono_strike_max') },
  { id: 'max_void',   name: 'Void Nova MAX',     icon: '🌑', desc: 'Unlock Void Nova MAX.',       cat: 'tech',     check: p => p.techniques && p.techniques.includes('void_nova_max') },
  { id: 'brew1',    name: 'Apprentice Brewer',  icon: '⚗️', desc: 'Discover your first recipe.', cat: 'alchemy',  check: p => p.alchemyRecipes && p.alchemyRecipes.length >= 1 },
  { id: 'brew5',    name: 'Brewer',             icon: '🧫', desc: 'Discover 5 recipes.',         cat: 'alchemy',  check: p => p.alchemyRecipes && p.alchemyRecipes.length >= 5 },
  { id: 'brew10',   name: 'Alchemist',          icon: '🧪', desc: 'Discover 10 recipes.',        cat: 'alchemy',  check: p => p.alchemyRecipes && p.alchemyRecipes.length >= 10 },
  { id: 'brew_all', name: 'Master Alchemist',   icon: '🔮', desc: 'Discover all recipes.',       cat: 'alchemy',  check: p => p.alchemyRecipes && typeof ALCHEMY_RECIPES !== 'undefined' && p.alchemyRecipes.length >= ALCHEMY_RECIPES.length },
  { id: 'brew_legendary', name: 'Grand Alchemist', icon: '✨', desc: 'Brew a Legendary potion.', cat: 'alchemy',  check: p => {
    if (!p.potionInv || typeof ALCHEMY_RECIPES === 'undefined') return false;
    return ALCHEMY_RECIPES.filter(r => r.rarity === 'legendary').some(r => (p.potionInv[r.id] || 0) > 0 || (p.alchemyRecipes || []).includes(r.id));
  }},
  { id: 'drink20',  name: 'Potion Addict',      icon: '🍶', desc: 'Drink 20 potions.',           cat: 'alchemy',  check: p => (p._potionsDrunk || 0) >= 20 },
  { id: 'dig10',    name: 'Digger',             icon: '⛏️', desc: 'Dig 10 tiles.',               cat: 'explore',  check: p => (p._digCount || 0) >= 10 },
  { id: 'dig100',   name: 'Excavator',          icon: '🪨', desc: 'Dig 100 tiles.',              cat: 'explore',  check: p => (p._digCount || 0) >= 100 },
  { id: 'dig500',   name: 'Archaeologist',      icon: '🏺', desc: 'Dig 500 tiles.',              cat: 'explore',  check: p => (p._digCount || 0) >= 500 },
  { id: 'dig1000',  name: 'Master Digger',      icon: '⛏️', desc: 'Dig 1,000 tiles.',            cat: 'explore',  check: p => (p._digCount || 0) >= 1000 },
  { id: 'sonar',    name: 'Sonar Expert',       icon: '📡', desc: 'Use sonar 10 times.',         cat: 'explore',  check: p => (p._sonarCount || 0) >= 10 },
  { id: 'harvest1', name: 'Green Thumb',        icon: '🌱', desc: 'Harvest your first plant.',   cat: 'explore',  check: p => (p._harvestCount || 0) >= 1 },
  { id: 'harvest20',name: 'Farmer',             icon: '🌾', desc: 'Harvest 20 plants.',          cat: 'explore',  check: p => (p._harvestCount || 0) >= 20 },
  { id: 'harvest50',name: 'Harvest Festival',   icon: '🌻', desc: 'Harvest 50 plants.',          cat: 'explore',  check: p => (p._harvestCount || 0) >= 50 },
  { id: 'full_garden', name: 'Full Garden',     icon: '🌿', desc: 'Fill all garden plots.',      cat: 'explore',  check: p => {
    if (!p.gardenPlots) return false;
    const filled = p.gardenPlots.filter(x => x !== null).length;
    return filled >= 9;
  }},
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
  { id: 'potion10', name: 'Potion Hoarder',     icon: '🍶', desc: 'Have 10 potions in stock.',   cat: 'misc',     check: p => {
    if (!p.potionInv) return false;
    return Object.values(p.potionInv).reduce((a,b) => a+b, 0) >= 10;
  }},
  { id: 'stamina0', name: 'Exhausted',          icon: '😮‍💨', desc: 'Run out of stamina.',        cat: 'misc',     check: p => (p._ranOutOfStamina || false) },
  { id: 'max_slots',name: 'Full Arsenal',       icon: '🎯', desc: 'Unlock all 10 gear slots.',   cat: 'misc',     check: p => typeof getMaxEquipSlots === 'function' && getMaxEquipSlots() >= 10 },
  { id: 'jobs10',   name: 'Workaholic',         icon: '💼', desc: 'Complete 10 quick jobs.',     cat: 'misc',     check: p => (p._quickJobCount || 0) >= 10 },
  { id: 'jobs100',  name: 'Career',             icon: '🏢', desc: 'Complete 100 quick jobs.',    cat: 'misc',     check: p => (p._quickJobCount || 0) >= 100 },
  { id: 'train100', name: 'Dedicated',          icon: '🏋️', desc: 'Complete 100 training sessions.', cat: 'misc', check: p => (p._trainCount || 0) >= 100 },
  { id: 'train1000',name: 'Iron Will',          icon: '🔩', desc: 'Complete 1,000 training sessions.', cat: 'misc', check: p => (p._trainCount || 0) >= 1000 },
  { id: 'library_all', name: 'Scholar',         icon: '📚', desc: 'Learn all library spells.',   cat: 'misc',     check: p => {
    if (typeof MAGIC_SPELLS === 'undefined') return false;
    return MAGIC_SPELLS.every(s => p.techniques && p.techniques.includes(s.id));
  }},
];

const ACH_CATS = [
  { id: 'all',       label: 'All' },
  { id: 'combat',    label: 'Combat' },
  { id: 'stats',     label: 'Stats' },
  { id: 'progress',  label: 'Progress' },
  { id: 'wealth',    label: 'Wealth' },
  { id: 'ascend',    label: 'Ascension' },
  { id: 'tech',      label: 'Techniques' },
  { id: 'alchemy',   label: 'Alchemy' },
  { id: 'explore',   label: 'Explore' },
  { id: 'heritage',  label: 'Heritage' },
  { id: 'misc',      label: 'Misc' },
];

let _achActiveCat = 'all';

(function injectAchievementCSS() {
  if (document.getElementById('achievements-rework-css')) return;
  const s = document.createElement('style');
  s.id = 'achievements-rework-css';
  s.textContent = `
.ach-header{margin-bottom:20px}
.ach-progress-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.ach-progress-top .ach-stat{font-size:14px;font-weight:700;color:var(--gold)}
.ach-progress-top .ach-pct{font-size:12px;color:var(--dim)}
.ach-bar-outer{height:8px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden}
.ach-bar-inner{height:100%;background:linear-gradient(90deg,var(--accent),var(--gold));border-radius:99px;transition:width .4s ease}
.ach-cats{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px}
.ach-pill{padding:5px 12px;font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,0.1);border-radius:20px;background:rgba(255,255,255,0.03);color:var(--dim);cursor:pointer;transition:all .2s;white-space:nowrap}
.ach-pill:hover{background:rgba(255,255,255,0.07);color:var(--text)}
.ach-pill.active{background:rgba(245,197,66,0.15);border-color:var(--gold);color:var(--gold)}
.ach-cat-section{margin-bottom:20px}
.ach-cat-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.ach-cat-header h3{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--dim);margin:0}
.ach-cat-header .ach-cat-count{font-size:11px;color:var(--dim)}
.ach-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
@media(max-width:900px){.ach-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.ach-grid{grid-template-columns:1fr}}
.ach-card{position:relative;padding:16px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.06);background:rgba(255,255,255,0.03);text-align:center;transition:border-color .2s,background .2s,transform .15s}
.ach-card:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-1px)}
.ach-card.unlocked{border-color:rgba(245,197,66,0.35);background:rgba(245,197,66,0.05)}
.ach-card.unlocked:hover{border-color:rgba(245,197,66,0.55)}
.ach-card.locked{opacity:0.55}
.ach-icon{font-size:32px;margin-bottom:8px;display:block;line-height:1}
.ach-card.locked .ach-icon{filter:grayscale(1) brightness(0.7)}
.ach-card.unlocked .ach-icon{filter:none}
.ach-name{font-size:12px;font-weight:700;margin-bottom:4px}
.ach-card.unlocked .ach-name{color:var(--gold)}
.ach-card.locked .ach-name{color:var(--dim)}
.ach-desc{font-size:10px;color:var(--dim);line-height:1.4}
.ach-badge{position:absolute;top:8px;right:8px;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px}
.ach-badge.done{background:rgba(76,175,80,0.2);color:#66bb6a}
.ach-badge.lock{background:rgba(255,255,255,0.06);color:var(--dim);font-size:9px}
`;
  document.head.appendChild(s);
})();

function getUnlockedAchievements() {
  if (!G.player.achievements) G.player.achievements = [];
  return G.player.achievements;
}

let _lastAchievementCheck = 0;
function checkAchievements() {
  const now = G.tickCount;
  if (now - _lastAchievementCheck < 20) return;
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
  const done = unlocked.length;
  const pct = Math.floor((done / total) * 100);

  const visibleCats = ACH_CATS.filter(c => c.id !== 'all' && ACHIEVEMENTS.some(a => a.cat === c.id));
  const filteredAchs = _achActiveCat === 'all' ? ACHIEVEMENTS : ACHIEVEMENTS.filter(a => a.cat === _achActiveCat);

  const grouped = {};
  filteredAchs.forEach(a => {
    if (!grouped[a.cat]) grouped[a.cat] = [];
    grouped[a.cat].push(a);
  });

  const catLabels = {};
  ACH_CATS.forEach(c => catLabels[c.id] = c.label);

  container.innerHTML = `
    <div class="ach-header">
      <div class="ach-progress-top">
        <span class="ach-stat">${done} / ${total} Unlocked</span>
        <span class="ach-pct">${pct}% Complete</span>
      </div>
      <div class="ach-bar-outer">
        <div class="ach-bar-inner" style="width:${pct}%"></div>
      </div>
    </div>
    <div class="ach-cats">
      ${ACH_CATS.map(c => {
        if (c.id !== 'all' && !ACHIEVEMENTS.some(a => a.cat === c.id)) return '';
        return `<button class="ach-pill${_achActiveCat === c.id ? ' active' : ''}" onclick="_achSetCat('${c.id}')">${c.label}</button>`;
      }).join('')}
    </div>
    ${Object.keys(grouped).map(catId => {
      const catAchs = grouped[catId];
      const catDone = catAchs.filter(a => unlocked.includes(a.id)).length;
      return `
        <div class="ach-cat-section">
          <div class="ach-cat-header">
            <h3>${catLabels[catId] || catId}</h3>
            <span class="ach-cat-count">${catDone} / ${catAchs.length}</span>
          </div>
          <div class="ach-grid">
            ${catAchs.map(ach => {
              const isUnlocked = unlocked.includes(ach.id);
              return `<div class="ach-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="ach-badge ${isUnlocked ? 'done' : 'lock'}">${isUnlocked ? '✓' : '🔒'}</div>
                <span class="ach-icon">${isUnlocked ? ach.icon : '🔒'}</span>
                <div class="ach-name">${ach.name}</div>
                <div class="ach-desc">${ach.desc}</div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
    }).join('')}`;
}

function _achSetCat(catId) {
  _achActiveCat = catId;
  renderAchievements();
}
