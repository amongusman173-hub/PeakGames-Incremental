// ===== CORE GAME STATE =====
const G = {
  // Player
  player: {
    name: 'Hero',
    level: 1,
    xp: 0,
    xpNeeded: 100,
    hp: 30,
    maxHp: 30,
    stamina: 40,
    maxStamina: 40,
    atk: 2,
    def: 1,
    spd: 2,
    gold: 0,
    rebirthCount: 0,
    rebirthPoints: 0,
    ascensionHistory: [],
    // Multipliers from rebirth
    xpMult: 1,
    goldMult: 1,
    statMult: 1,
    // Rebirth upgrades purchased
    rebirthUpgrades: {},
    // Training progress
    trainingProgress: {},
    // Job progress
    jobProgress: {},
    // Defeated bosses
    defeatedBosses: [],
    // Completed story chapters
    completedChapters: [],
    // Story stage progress per chapter: { ch1: 3, ch2: 0, ... }
    storyStageProgress: {},
    // Current story chapter index
    storyProgress: 0,
    // Dig charges
    digCharges: 3,
    // Dig charge regen timer (ticks since last charge)
    digRegenTick: 0,
    // Shop purchases: { upgradeId: level }
    shopPurchases: {},
    // Skill tree nodes purchased
    skillNodes: {},
    // Alchemy ingredients inventory: { ingredientId: count }
    alchemyInv: {},
    // Discovered recipes: [recipeId, ...]
    alchemyRecipes: [],
    // Library study progress: { spellId: ticksStudied }
    libraryStudy: {},
    // Garden plots: array of plot objects
    gardenPlots: [],
    waterCharges: 5,
    waterRegenTick: 0,
    sonarCharges: 3,
    // Techniques owned
    techniques: [],
    // Heritage: { clan, weapon, style }
    heritage: {},
    heritageRerolls: {},
    heritageSkipAnim: false,
    // Equipped technique ids (4 slots)
    equipped: [null, null, null, null],
    // Offline time tracking
    lastSave: Date.now(),
    achievements: [],
    _digCount: 0,
    _harvestCount: 0,
    _ranOutOfStamina: false,
    _critCount: 0,
    _fleeCount: 0,
    _sonarCount: 0,
    _quickJobCount: 0,
    _trainCount: 0,
    _potionsDrunk: 0,
  },

  // Active job (id or null)
  activeJob: null,
  jobTick: 0,

  // Active training (id or null)
  activeTraining: null,
  trainingTick: 0,

  // Active library study (id or null)
  activeStudy: null,
  studyTick: 0,

  // Game loop
  tickRate: 250, // ms
  tickCount: 0,
};

// ===== SAVE / LOAD =====
function saveGame() {
  try {
    localStorage.setItem('ascendant_save', JSON.stringify(G.player));
  } catch(e) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem('ascendant_save');
    if (!raw) return; // fresh start, use defaults
    const saved = JSON.parse(raw);
    if (!saved || typeof saved !== 'object') return; // corrupted
    // Merge saved into player (preserve new keys from defaults)
    Object.assign(G.player, saved);
    // Ensure all arrays/objects exist (guard against old saves missing new fields)
    if (!Array.isArray(G.player.techniques)) G.player.techniques = [];
    if (!Array.isArray(G.player.equipped)) G.player.equipped = [null,null,null,null];
    if (!Array.isArray(G.player.defeatedBosses)) G.player.defeatedBosses = [];
    if (!Array.isArray(G.player.completedChapters)) G.player.completedChapters = [];
    if (!G.player.trainingProgress || typeof G.player.trainingProgress !== 'object') G.player.trainingProgress = {};
    if (!G.player.jobProgress || typeof G.player.jobProgress !== 'object') G.player.jobProgress = {};
    if (!G.player.rebirthUpgrades || typeof G.player.rebirthUpgrades !== 'object') G.player.rebirthUpgrades = {};
    if (!G.player.storyStageProgress || typeof G.player.storyStageProgress !== 'object') G.player.storyStageProgress = {};
    if (!G.player.shopPurchases || typeof G.player.shopPurchases !== 'object') G.player.shopPurchases = {};
    if (!G.player.skillNodes || typeof G.player.skillNodes !== 'object') G.player.skillNodes = {};
    if (!G.player.alchemyInv || typeof G.player.alchemyInv !== 'object') G.player.alchemyInv = {};
    if (!Array.isArray(G.player.alchemyRecipes)) G.player.alchemyRecipes = [];
    if (!G.player.potionInv || typeof G.player.potionInv !== 'object') G.player.potionInv = {};
    if (!G.player.libraryStudy || typeof G.player.libraryStudy !== 'object') G.player.libraryStudy = {};
    if (!Array.isArray(G.player.gardenPlots)) G.player.gardenPlots = [];
    if (typeof G.player.waterCharges !== 'number') G.player.waterCharges = 5;
    if (typeof G.player.waterRegenTick !== 'number') G.player.waterRegenTick = 0;
    if (typeof G.player.sonarCharges !== 'number') G.player.sonarCharges = 3;
    if (typeof G.player.sonarRegenTick !== 'number') G.player.sonarRegenTick = 0;
    if (typeof G.player.regenBonus !== 'number') G.player.regenBonus = 0;
    if (!G.player.heritage || typeof G.player.heritage !== 'object') G.player.heritage = {};
    if (!G.player.heritageRerolls || typeof G.player.heritageRerolls !== 'object') G.player.heritageRerolls = {};
    if (typeof G.player.digRegenTick !== 'number') G.player.digRegenTick = 0;
    if (!Array.isArray(G.player.ascensionHistory)) G.player.ascensionHistory = [];
    if (!Array.isArray(G.player.achievements)) G.player.achievements = [];
    if (typeof G.player._digCount !== 'number') G.player._digCount = 0;
    if (typeof G.player._harvestCount !== 'number') G.player._harvestCount = 0;
    if (typeof G.player._ranOutOfStamina !== 'boolean') G.player._ranOutOfStamina = false;
    if (typeof G.player._digCount !== 'number') G.player._digCount = 0;
    if (typeof G.player._harvestCount !== 'number') G.player._harvestCount = 0;
    if (typeof G.player._critCount !== 'number') G.player._critCount = 0;
    if (typeof G.player._fleeCount !== 'number') G.player._fleeCount = 0;
    if (typeof G.player._sonarCount !== 'number') G.player._sonarCount = 0;
    if (typeof G.player._quickJobCount !== 'number') G.player._quickJobCount = 0;
    if (typeof G.player._trainCount !== 'number') G.player._trainCount = 0;
    if (typeof G.player._potionsDrunk !== 'number') G.player._potionsDrunk = 0;
    // Clamp numeric values to prevent NaN/Infinity
    ['hp','maxHp','stamina','maxStamina','atk','def','spd','gold','xp','level'].forEach(k => {
      if (typeof G.player[k] !== 'number' || isNaN(G.player[k])) {
        const defaults = {hp:30,maxHp:30,stamina:40,maxStamina:40,atk:2,def:1,spd:2,gold:0,xp:0,level:1};
        G.player[k] = defaults[k] ?? 0;
      }
    });
  } catch(e) {
    console.warn('Save load failed, starting fresh:', e);
    // Don't crash — just use defaults
  }
}

function resetGame() {
  const rb = G.player.rebirthCount;
  const rp = G.player.rebirthPoints;
  const ru = G.player.rebirthUpgrades;
  const xm = G.player.xpMult;
  const gm = G.player.goldMult;
  const sm = G.player.statMult;

  G.player = {
    name: 'Hero',
    level: 1,
    xp: 0,
    xpNeeded: 100,
    hp: 30,
    maxHp: 30,
    stamina: 40,
    maxStamina: 40,
    atk: 2,
    def: 1,
    spd: 2,
    gold: 0,
    rebirthCount: rb,
    rebirthPoints: rp,
    xpMult: xm,
    goldMult: gm,
    statMult: sm,
    rebirthUpgrades: ru,
    trainingProgress: {},
    jobProgress: {},
    defeatedBosses: [],
    completedChapters: [],
    storyStageProgress: {},
    storyProgress: 0,
    digCharges: 3,
    digRegenTick: 0,
    shopPurchases: {},
    skillNodes: {},
    alchemyInv: {},
    alchemyRecipes: [],
    potionInv: {},
    libraryStudy: {},
    gardenPlots: [],
    waterCharges: 5,
    waterRegenTick: 0,
    techniques: [],
    equipped: [null, null, null, null],
    lastSave: Date.now(),
  };
  G.activeJob = null;
  G.jobTick = 0;
  G.activeTraining = null;
  G.trainingTick = 0;
}

// ===== GAME LOOP =====
// Cache skill tree bonuses — only recalculate when nodes change
let _cachedSkillBonuses = null;
let _cachedHeritageBonuses = null;

function invalidateStatCache() {
  _cachedSkillBonuses = null;
  _cachedHeritageBonuses = null;
}

function gameTick() {
  G.tickCount++;
  const p = G.player;

  // Stamina regen: base 1 per 8 ticks (0.5/sec)
  // SPD bonus: every 10 SPD = +0.25 regen per 8-tick cycle
  // e.g. 10 SPD = +0.25, 20 SPD = +0.5, 50 SPD = +1.25, 100 SPD = +2.5 extra
  if (G.tickCount % 8 === 0) {
    if (p.stamina < p.maxStamina) {
      const spdBonus = (p.spd / 10) * 0.25;
      p.stamina = Math.min(p.maxStamina, p.stamina + 1 + spdBonus);
    }
  }

  // HP regen out of combat — every 4 ticks
  if (G.tickCount % 4 === 0 && !combatActive) {
    if (Math.floor(p.hp) < p.maxHp) {
      const regenRate = 0.01 + (p.regenBonus || 0);
      const regenAmt = Math.max(2, Math.floor(p.maxHp * regenRate));
      p.hp = Math.min(p.maxHp, Math.floor(p.hp) + regenAmt);
    }
  }

  // Dig charge regen
  const digRegenRate = getDigRegenRate();
  const maxDig = getMaxDigCharges();
  if (p.digCharges < maxDig) {
    p.digRegenTick = (p.digRegenTick || 0) + 1;
    if (p.digRegenTick >= digRegenRate) {
      p.digRegenTick = 0;
      p.digCharges = Math.min(maxDig, p.digCharges + 1);
    }
  } else {
    p.digRegenTick = 0;
  }

  // Training tick
  if (G.activeTraining) {
    G.trainingTick++;
    const action = TRAINING_ACTIONS.find(a => a.id === G.activeTraining);
    const needed = action ? getTrainingTicksNeeded(action) : 16;
    if (G.trainingTick >= needed) {
      G.trainingTick = 0;
      tickTraining(G.activeTraining);
    }
  }

  // Library study tick (every 4 ticks)
  if (G.activeStudy) {
    G.studyTick++;
    if (G.studyTick >= 4) {
      G.studyTick = 0;
      tickStudy();
    }
  }

  // Job tick
  if (G.activeJob) {
    G.jobTick++;
    tickJob(G.activeJob);
  }

  // Garden tick — every 8 ticks (2s) instead of every 4
  if (G.tickCount % 8 === 0) {
    tickGarden();
  }

  // Sonar charge regen
  const sonarLevel = (p.shopPurchases && p.shopPurchases['dig_reveal']) || 0;
  if (sonarLevel > 0) {
    const maxSonar = sonarLevel;
    if ((p.sonarCharges || 0) < maxSonar) {
      p.sonarRegenTick = (p.sonarRegenTick || 0) + 1;
      if (p.sonarRegenTick >= getDigRegenRate() * 3) {
        p.sonarRegenTick = 0;
        p.sonarCharges = Math.min(maxSonar, (p.sonarCharges || 0) + 1);
        if (activeTab === 'dig') updateSonarButton();
      }
    } else {
      p.sonarRegenTick = 0;
    }
  }

  // Save every 10 seconds (40 ticks)
  if (G.tickCount % 40 === 0) {
    saveGame();
    if (typeof checkAchievements === 'function') checkAchievements();
  }

  // Safety: reset stuck minigame every 30s (120 ticks)
  if (G.tickCount % 120 === 0 && typeof mgActive !== 'undefined' && mgActive) {
    const overlay = document.getElementById('mg-overlay');
    if (overlay && overlay.classList.contains('hidden')) {
      mgActive = false;
      mgResolve = null;
    }
  }

  // UI updates — header every tick, active tab every 2 ticks, banners every 4
  updateHeader();
  if (G.tickCount % 2 === 0) updateActiveTabUI();
  if (G.tickCount % 4 === 0) {
    updateJobBanner();
    updateTrainingBanner();
  }
}

// ===== INIT =====
function initGame() {
  loadGame();
  // Re-register Gojo techniques into TECHNIQUES array if player has them
  if (typeof GOJO_TECHNIQUES !== 'undefined') {
    GOJO_TECHNIQUES.forEach(t => {
      if (!TECHNIQUES.find(x => x.id === t.id)) TECHNIQUES.push(t);
    });
  }
  // Re-register all library spells into TECHNIQUES (they're added at runtime and lost on refresh)
  if (typeof MAGIC_SPELLS !== 'undefined') {
    MAGIC_SPELLS.forEach(s => {
      if (!TECHNIQUES.find(x => x.id === s.id)) TECHNIQUES.push(s);
    });
  }
  applyRebirthMultipliers(); // calls recalcStats() internally
  setInterval(gameTick, G.tickRate);
  initUI();
  updateHeader();
  renderTraining();
  renderJobs();
  renderRaids();
  renderInventory();
  renderStoryChapters();
  renderRebirthPanel();
  renderDigUI();
  renderShop();
  renderSkillTree();
  renderAlchemy();
  renderDojo();
  renderLibrary();
  renderSettings();
  renderGarden();
  renderHeritage();
  toast('Welcome back, Hero!', 'info');
  playBgMusic();
}

window.addEventListener('DOMContentLoaded', initGame);
