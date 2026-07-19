// ===== ALCHEMY SYSTEM =====

const ALCHEMY_INGREDIENTS = [
  // Common — from garden/dig/story
  { id: 'herb',          name: 'Healing Herb',      icon: '🌿', desc: 'A common medicinal plant.',          rarity: 'common'    },
  { id: 'mushroom',      name: 'Glowshroom',         icon: '🍄', desc: 'A bioluminescent fungus.',           rarity: 'common'    },
  { id: 'bone_dust',     name: 'Bone Dust',          icon: '🦴', desc: 'Ground from monster bones.',         rarity: 'common'    },
  { id: 'strawberry',    name: 'Starberry',          icon: '🍓', desc: 'A magical berry from the garden.',   rarity: 'common'    },
  { id: 'sunflower',     name: 'Sunpetal',           icon: '🌻', desc: 'Petals that glow in sunlight.',      rarity: 'common'    },
  { id: 'mint_leaf',     name: 'Frost Mint',         icon: '🌱', desc: 'A cooling herb with icy properties.',rarity: 'common'    },
  // Uncommon
  { id: 'fire_shard',    name: 'Fire Shard',         icon: '🔥', desc: 'A fragment of crystallized fire.',   rarity: 'uncommon'  },
  { id: 'shadow_oil',    name: 'Shadow Oil',         icon: '🫙', desc: 'Extracted from shadow creatures.',   rarity: 'uncommon'  },
  { id: 'moonwater',     name: 'Moonwater',          icon: '💧', desc: 'Water blessed under a full moon.',   rarity: 'uncommon'  },
  { id: 'crystal_dust',  name: 'Crystal Dust',       icon: '💠', desc: 'Ground from rare crystals.',         rarity: 'uncommon'  },
  { id: 'thunder_root',  name: 'Thunder Root',       icon: '⚡', desc: 'A root charged with lightning.',     rarity: 'uncommon'  },
  { id: 'frost_bloom',   name: 'Frost Bloom',        icon: '❄️', desc: 'A flower that blooms in ice.',       rarity: 'uncommon'  },
  // Rare
  { id: 'dragon_scale',  name: 'Dragon Scale',       icon: '🐉', desc: 'A scale from a slain dragon.',       rarity: 'rare'      },
  { id: 'void_essence',  name: 'Void Essence',       icon: '🌀', desc: 'Pure energy from the void.',         rarity: 'rare'      },
  { id: 'angel_tear',    name: "Angel's Tear",       icon: '💫', desc: 'A crystallized divine tear.',        rarity: 'rare'      },
  { id: 'phoenix_ash',   name: 'Phoenix Ash',        icon: '🦅', desc: 'Ash from a reborn phoenix.',         rarity: 'rare'      },
  { id: 'starlight',     name: 'Starlight Essence',  icon: '⭐', desc: 'Captured starlight in a vial.',      rarity: 'rare'      },
  // Legendary
  { id: 'chaos_dust',    name: 'Chaos Dust',         icon: '✨', desc: 'Unstable magical residue.',          rarity: 'legendary' },
  { id: 'origin_shard',  name: 'Origin Shard',       icon: '🔮', desc: 'A fragment of the Origin itself.',   rarity: 'legendary' },
];

// Recipes: ingredients array (order doesn't matter), result potion
const ALCHEMY_RECIPES = [
  { id: 'minor_heal',     name: 'Minor Healing Potion', icon: '🧪', desc: 'Restores 30% HP.',                                    ingredients: ['herb', 'mushroom'],                                    effect: p => { p.hp = Math.min(p.maxHp, p.hp + Math.floor(p.maxHp * 0.3)); toast('Restored 30% HP!', 'success'); },                                                                                rarity: 'common'    },
  { id: 'major_heal',     name: 'Major Healing Potion', icon: '❤️', desc: 'Restores 70% HP.',                                    ingredients: ['herb', 'moonwater', 'mushroom'],                       effect: p => { p.hp = Math.min(p.maxHp, p.hp + Math.floor(p.maxHp * 0.7)); toast('Restored 70% HP!', 'success'); },                                                                                rarity: 'uncommon'  },
  { id: 'stamina_brew',   name: 'Stamina Brew',         icon: '⚡', desc: 'Restores full stamina.',                              ingredients: ['mushroom', 'bone_dust'],                               effect: p => { p.stamina = p.maxStamina; toast('Stamina fully restored!', 'success'); },                                                                                                           rarity: 'common'    },
  { id: 'strength_tonic', name: 'Strength Tonic',       icon: '💪', desc: 'Permanently +10 ATK.',                               ingredients: ['fire_shard', 'bone_dust', 'herb'],                     effect: p => { p.atk += 10; toast('+10 ATK permanently!', 'rare'); },                                                                                                                              rarity: 'uncommon'  },
  { id: 'iron_skin',      name: 'Iron Skin Elixir',     icon: '🛡️', desc: 'Permanently +8 DEF.',                                ingredients: ['bone_dust', 'moonwater', 'mushroom'],                  effect: p => { p.def += 8; toast('+8 DEF permanently!', 'rare'); },                                                                                                                                rarity: 'uncommon'  },
  { id: 'swift_potion',   name: 'Swift Potion',         icon: '💨', desc: 'Permanently +6 SPD.',                                ingredients: ['shadow_oil', 'moonwater'],                             effect: p => { p.spd += 6; toast('+6 SPD permanently!', 'rare'); },                                                                                                                                rarity: 'uncommon'  },
  { id: 'vitality_elixir',name: 'Vitality Elixir',      icon: '💖', desc: 'Permanently +80 Max HP.',                            ingredients: ['moonwater', 'herb', 'angel_tear'],                     effect: p => { p.maxHp += 80; p.hp = Math.min(p.hp + 80, p.maxHp); toast('+80 Max HP permanently!', 'rare'); },                                                                                    rarity: 'rare'      },
  { id: 'dragon_brew',    name: "Dragon's Brew",        icon: '🐉', desc: 'Permanently +25 ATK, +15 DEF.',                      ingredients: ['dragon_scale', 'fire_shard', 'bone_dust'],             effect: p => { p.atk += 25; p.def += 15; toast('+25 ATK, +15 DEF permanently!', 'rare'); },                                                                                                       rarity: 'rare'      },
  { id: 'void_draught',   name: 'Void Draught',         icon: '🌀', desc: 'Permanently +20 ATK, +10 SPD, +50 HP.',              ingredients: ['void_essence', 'shadow_oil', 'chaos_dust'],            effect: p => { p.atk += 20; p.spd += 10; p.maxHp += 50; p.hp = Math.min(p.hp+50, p.maxHp); toast('Void Draught consumed!', 'rare'); },                                                            rarity: 'legendary' },
  { id: 'elixir_of_gods', name: 'Elixir of the Gods',  icon: '✨', desc: 'Permanently +30 ATK, +20 DEF, +20 SPD, +100 HP.',    ingredients: ['angel_tear', 'void_essence', 'dragon_scale', 'chaos_dust'], effect: p => { p.atk += 30; p.def += 20; p.spd += 20; p.maxHp += 100; p.hp = Math.min(p.hp+100, p.maxHp); toast('Elixir of the Gods consumed!', 'rare'); },                                  rarity: 'legendary' },
  { id: 'xp_potion',      name: "Scholar's Draught",   icon: '📚', desc: 'Gain 2000 XP instantly.',                            ingredients: ['moonwater', 'mushroom', 'shadow_oil'],                 effect: p => { gainXP(2000); toast('+2000 XP!', 'info'); },                                                                                                                                        rarity: 'uncommon'  },
  { id: 'berry_tonic',    name: 'Berry Tonic',          icon: '🍓', desc: 'Restore 20% HP and 20% Stamina.',                    ingredients: ['strawberry', 'herb'],                                  effect: p => { p.hp = Math.min(p.maxHp, p.hp + Math.floor(p.maxHp*0.2)); p.stamina = Math.min(p.maxStamina, p.stamina + Math.floor(p.maxStamina*0.2)); toast('Berry Tonic: HP and Stamina restored!', 'success'); }, rarity: 'common' },
  { id: 'sun_brew',       name: 'Sunpetal Brew',        icon: '🌻', desc: 'Permanently +5 ATK and +5 DEF.',                    ingredients: ['sunflower', 'moonwater'],                              effect: p => { p.atk += 5; p.def += 5; toast('+5 ATK, +5 DEF!', 'success'); },                                                                                                                    rarity: 'common'    },
  { id: 'frost_elixir',   name: 'Frost Elixir',         icon: '❄️', desc: 'Permanently +8 SPD and +20 Max Stamina.',            ingredients: ['frost_bloom', 'mint_leaf', 'moonwater'],               effect: p => { p.spd += 8; p.maxStamina += 20; toast('+8 SPD, +20 Stamina!', 'success'); },                                                                                                       rarity: 'uncommon'  },
  { id: 'thunder_brew',   name: 'Thunder Brew',         icon: '⚡', desc: 'Permanently +15 ATK and +10 SPD.',                  ingredients: ['thunder_root', 'fire_shard', 'crystal_dust'],          effect: p => { p.atk += 15; p.spd += 10; toast('+15 ATK, +10 SPD!', 'rare'); },                                                                                                                   rarity: 'uncommon'  },
  { id: 'phoenix_potion', name: 'Phoenix Potion',       icon: '🦅', desc: 'Fully restore HP and Stamina.',                     ingredients: ['phoenix_ash', 'angel_tear'],                           effect: p => { p.hp = p.maxHp; p.stamina = p.maxStamina; toast('Fully restored!', 'success'); },                                                                                                    rarity: 'rare'      },
  { id: 'starlight_tonic',name: 'Starlight Tonic',      icon: '⭐', desc: 'Permanently +30 ATK, +20 DEF, +15 SPD.',            ingredients: ['starlight', 'crystal_dust', 'moonwater'],              effect: p => { p.atk += 30; p.def += 20; p.spd += 15; toast('+30 ATK, +20 DEF, +15 SPD!', 'rare'); },                                                                                            rarity: 'rare'      },
  { id: 'origin_brew',    name: 'Origin Brew',          icon: '🔮', desc: 'Permanently +50 ATK, +30 DEF, +30 SPD, +200 HP.',   ingredients: ['origin_shard', 'chaos_dust', 'void_essence', 'angel_tear'], effect: p => { p.atk += 50; p.def += 30; p.spd += 30; p.maxHp += 200; p.hp = Math.min(p.hp+200, p.maxHp); toast('Origin Brew consumed! Transcendent power!', 'rare'); },                    rarity: 'legendary' },

  // ── New recipes ──
  // Common
  { id: 'mint_tea',       name: 'Frost Mint Tea',       icon: '🍵', desc: 'Restore 30% Stamina.',                                ingredients: ['mint_leaf', 'mushroom'],                               effect: p => { p.stamina = Math.min(p.maxStamina, p.stamina + Math.floor(p.maxStamina*0.3)); toast('Restored 30% Stamina!', 'success'); },                                                         rarity: 'common'    },
  { id: 'bone_broth',     name: 'Bone Broth',           icon: '🍲', desc: 'Permanently +5 Max HP.',                             ingredients: ['bone_dust', 'herb'],                                   effect: p => { p.maxHp += 5; p.hp = Math.min(p.hp+5, p.maxHp); toast('+5 Max HP!', 'success'); },                                                                                                  rarity: 'common'    },
  { id: 'sun_tea',        name: 'Sunpetal Tea',         icon: '☀️', desc: 'Restore 50% HP.',                                    ingredients: ['sunflower', 'herb'],                                   effect: p => { p.hp = Math.min(p.maxHp, p.hp + Math.floor(p.maxHp*0.5)); toast('Restored 50% HP!', 'success'); },                                                                                  rarity: 'common'    },
  { id: 'berry_jam',      name: 'Starberry Jam',        icon: '🫙', desc: 'Gain 500 XP.',                                       ingredients: ['strawberry', 'sunflower'],                             effect: p => { gainXP(500); toast('+500 XP!', 'info'); },                                                                                                                                          rarity: 'common'    },

  // Uncommon
  { id: 'shadow_step',    name: 'Shadow Step Brew',     icon: '👤', desc: 'Permanently +12 SPD.',                               ingredients: ['shadow_oil', 'mint_leaf', 'moonwater'],                effect: p => { p.spd += 12; toast('+12 SPD permanently!', 'rare'); },                                                                                                                              rarity: 'uncommon'  },
  { id: 'iron_will',      name: 'Iron Will Tonic',      icon: '🧱', desc: 'Permanently +30 Max Stamina.',                       ingredients: ['bone_dust', 'thunder_root', 'mushroom'],               effect: p => { p.maxStamina += 30; toast('+30 Max Stamina permanently!', 'rare'); },                                                                                                               rarity: 'uncommon'  },
  { id: 'fire_blood',     name: 'Fire Blood',           icon: '🩸', desc: 'Permanently +18 ATK.',                               ingredients: ['fire_shard', 'shadow_oil', 'bone_dust'],               effect: p => { p.atk += 18; toast('+18 ATK permanently!', 'rare'); },                                                                                                                              rarity: 'uncommon'  },
  { id: 'crystal_mind',   name: 'Crystal Mind',         icon: '💠', desc: 'Gain 5000 XP.',                                      ingredients: ['crystal_dust', 'moonwater', 'mushroom'],               effect: p => { gainXP(5000); toast('+5000 XP!', 'info'); },                                                                                                                                        rarity: 'uncommon'  },
  { id: 'frost_armor',    name: 'Frost Armor',          icon: '🧊', desc: 'Permanently +15 DEF.',                               ingredients: ['frost_bloom', 'crystal_dust', 'bone_dust'],            effect: p => { p.def += 15; toast('+15 DEF permanently!', 'rare'); },                                                                                                                              rarity: 'uncommon'  },

  // Rare
  { id: 'dragon_blood',   name: 'Dragon Blood',         icon: '🩸', desc: 'Permanently +40 ATK, +10 SPD.',                     ingredients: ['dragon_scale', 'fire_shard', 'void_essence'],          effect: p => { p.atk += 40; p.spd += 10; toast('+40 ATK, +10 SPD permanently!', 'rare'); },                                                                                                       rarity: 'rare'      },
  { id: 'celestial_brew', name: 'Celestial Brew',       icon: '🌌', desc: 'Permanently +50 Max HP, +25 Max Stamina.',           ingredients: ['angel_tear', 'starlight', 'moonwater'],                effect: p => { p.maxHp += 50; p.maxStamina += 25; p.hp = Math.min(p.hp+50, p.maxHp); toast('+50 Max HP, +25 Max Stamina!', 'rare'); },                                                            rarity: 'rare'      },
  { id: 'void_sight',     name: 'Void Sight',           icon: '👁️', desc: 'Gain 15000 XP.',                                    ingredients: ['void_essence', 'shadow_oil', 'crystal_dust'],          effect: p => { gainXP(15000); toast('+15000 XP!', 'info'); },                                                                                                                                      rarity: 'rare'      },
  { id: 'phoenix_heart',  name: 'Phoenix Heart',        icon: '❤️‍🔥', desc: 'Permanently +100 Max HP, +20 DEF.',               ingredients: ['phoenix_ash', 'dragon_scale', 'angel_tear'],           effect: p => { p.maxHp += 100; p.def += 20; p.hp = Math.min(p.hp+100, p.maxHp); toast('+100 Max HP, +20 DEF permanently!', 'rare'); },                                                           rarity: 'rare'      },

  // Legendary
  { id: 'chaos_elixir',   name: 'Chaos Elixir',         icon: '🌪️', desc: 'Permanently +60 ATK, +40 DEF, +40 SPD.',            ingredients: ['chaos_dust', 'void_essence', 'dragon_scale'],          effect: p => { p.atk += 60; p.def += 40; p.spd += 40; toast('+60 ATK, +40 DEF, +40 SPD permanently!', 'rare'); },                                                                                rarity: 'legendary' },
  { id: 'transcendence',  name: 'Transcendence',        icon: '🌟', desc: 'Gain 50000 XP and fully restore HP & Stamina.',      ingredients: ['origin_shard', 'angel_tear', 'starlight', 'chaos_dust'],effect: p => { gainXP(50000); p.hp = p.maxHp; p.stamina = p.maxStamina; toast('Transcendence! +50000 XP, fully restored!', 'rare'); },                                                         rarity: 'legendary' },
];

// ── HINT UPGRADES — buy to reveal recipe hints ──
const ALCHEMY_HINT_UPGRADES = [
  { id: 'hint_common',    name: 'Common Hints',    icon: '📗', desc: 'Reveals hints for all Common recipes.',    cost: 5000,   rarity: 'common'    },
  { id: 'hint_uncommon',  name: 'Uncommon Hints',  icon: '📘', desc: 'Reveals hints for all Uncommon recipes.',  cost: 20000,  rarity: 'uncommon'  },
  { id: 'hint_rare',      name: 'Rare Hints',      icon: '📙', desc: 'Reveals hints for all Rare recipes.',      cost: 75000,  rarity: 'rare'      },
  { id: 'hint_legendary', name: 'Legendary Hints', icon: '📕', desc: 'Reveals hints for all Legendary recipes.', cost: 250000, rarity: 'legendary' },
];

function hasHintFor(rarity) {
  return !!(G.player.shopPurchases && G.player.shopPurchases['hint_' + rarity]);
}

function buyAlchemyHint(id) {
  const upg = ALCHEMY_HINT_UPGRADES.find(u => u.id === id);
  if (!upg) return;
  if (G.player.shopPurchases && G.player.shopPurchases[id]) { toast('Already purchased!', 'warn'); return; }
  if (!spendGold(upg.cost)) { toast('Not enough gold!', 'warn'); return; }
  if (!G.player.shopPurchases) G.player.shopPurchases = {};
  G.player.shopPurchases[id] = 1;
  toast(`${upg.icon} ${upg.name} unlocked!`, 'success');
  renderAlchemy();
}

// Potion inventory: { recipeId: count }
function getPotionCount(recipeId) {
  return (G.player.potionInv && G.player.potionInv[recipeId]) || 0;
}
function addPotion(recipeId, count = 1) {
  if (!G.player.potionInv) G.player.potionInv = {};
  G.player.potionInv[recipeId] = (G.player.potionInv[recipeId] || 0) + count;
}
function drinkPotion(recipeId) {
  const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  if (getPotionCount(recipeId) <= 0) { toast('No potions left!', 'warn'); return; }
  G.player.potionInv[recipeId]--;
  recipe.effect(G.player);
  playSound('drink potion');
  spawnFloatingText(recipe.icon, 'float-xp');
  if (typeof G.player._potionsDrunk === 'number') G.player._potionsDrunk++; else G.player._potionsDrunk = 1;
  renderAlchemy();
}

// Ingredients dropped by story stages
const STORY_INGREDIENT_DROPS = {
  ch1: ['herb', 'bone_dust'],
  ch2: ['mushroom', 'shadow_oil'],
  ch3: ['bone_dust', 'fire_shard'],
  ch4: ['moonwater', 'shadow_oil'],
  ch5: ['void_essence', 'dragon_scale'],
  ch6: ['angel_tear', 'chaos_dust'],
  ch7: ['chaos_dust', 'void_essence'],
  ch8: ['void_essence', 'angel_tear'],
  ch9: ['angel_tear', 'chaos_dust'],
  ch10: ['chaos_dust', 'dragon_scale'],
};

function addIngredient(id, count = 1) {
  if (!G.player.alchemyInv) G.player.alchemyInv = {};
  G.player.alchemyInv[id] = (G.player.alchemyInv[id] || 0) + count;
}

function getIngredientCount(id) {
  return (G.player.alchemyInv && G.player.alchemyInv[id]) || 0;
}

let brewSlots = [null, null, null, null];

function toggleBrewSlot(ingredientId) {
  const idx = brewSlots.indexOf(ingredientId);
  if (idx >= 0) { brewSlots[idx] = null; }
  else {
    const empty = brewSlots.indexOf(null);
    if (empty < 0) { toast('Brew slots full!', 'warn'); return; }
    brewSlots[empty] = ingredientId;
  }
  renderAlchemy();
}

function clearBrewSlots() { brewSlots = [null, null, null, null]; renderAlchemy(); }

// ── ALCHEMY VFX ──
function alchemyBrewVFX(rarity) {
  const cauldron = document.querySelector('.brew-slots') || document.getElementById('alchemy-container');
  if (!cauldron) return;
  const rect = cauldron.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const palettes = {
    common:    ['#a5d6a7','#66bb6a','#fff9c4','#fff'],
    uncommon:  ['#6c9fff','#b388ff','#fff9c4','#fff'],
    rare:      ['#b06aff','#cc88ff','#f48fb1','#fff'],
    legendary: ['#f5c542','#ffdd66','#ff9900','#fff','#ff80ab'],
  };
  const colors = palettes[rarity] || palettes.common;
  const count = rarity === 'legendary' ? 30 : rarity === 'rare' ? 22 : rarity === 'uncommon' ? 16 : 10;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i / count) + Math.random() * 0.8;
    const dist = (rarity === 'legendary' ? 80 : rarity === 'rare' ? 60 : 40) * (0.5 + Math.random() * 0.8);
    const size = 4 + Math.random() * 7;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `position:fixed;z-index:9998;pointer-events:none;border-radius:50%;
      width:${size}px;height:${size}px;background:${color};
      left:${cx}px;top:${cy}px;
      --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
      animation:digBurst 0.7s ease-out forwards;animation-delay:${Math.random()*0.1}s;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }

  if (rarity === 'legendary') {
    const f = document.createElement('div');
    f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;background:rgba(245,197,66,0.25);animation:digFlash 0.6s ease-out forwards;`;
    document.body.appendChild(f); setTimeout(() => f.remove(), 700);
  } else if (rarity === 'rare') {
    const f = document.createElement('div');
    f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;background:rgba(176,106,255,0.15);animation:digFlash 0.5s ease-out forwards;`;
    document.body.appendChild(f); setTimeout(() => f.remove(), 600);
  }
}

// ── BREWING MINIGAME — stir the cauldron, then wait for brew to finish ──
// Brew times: common 8s, uncommon 30s, rare 60s, legendary 120s
const BREW_TIMES = { common: 8000, uncommon: 30000, rare: 60000, legendary: 120000 };
// Stir difficulty: common=1, uncommon=2, rare=3, legendary=4
const BREW_STIR_DIFF = { common: 1, uncommon: 2, rare: 3, legendary: 4 };

function brewMinigame(rarity, callback) {
  const diff   = BREW_STIR_DIFF[rarity] || 1;
  const brewMs = BREW_TIMES[rarity] || 8000;
  const label = {
    common:    '⚗️ Stir the cauldron!',
    uncommon:  '⚗️ Careful stirring required!',
    rare:      '⚗️ Rare brew — stir with precision!',
    legendary: '⚗️ LEGENDARY BREW — master the cauldron!',
  }[rarity] || '⚗️ Stir the cauldron!';

  // Step 1: stir minigame
  showMinigame('stir', diff, label, (mult) => {
    // Play sound immediately after minigame
    playSound('make potion', 0.8);
    // Step 2: show brew timer in the alchemy panel (not the mg-overlay)
    _showBrewTimer(rarity, brewMs, mult, callback);
  });
}

function _showBrewTimer(rarity, brewMs, stirMult, callback) {
  const rarityColors = { common:'#66bb6a', uncommon:'#6c9fff', rare:'#b06aff', legendary:'#f5c542' };
  const color = rarityColors[rarity] || '#66bb6a';
  const icons = { common:'🧪', uncommon:'⚗️', rare:'🔮', legendary:'✨' };
  const icon  = icons[rarity] || '🧪';
  const secs  = (brewMs / 1000).toFixed(0);

  // Each brew gets a unique ID so multiple can run simultaneously
  const brewId = 'brew-' + Date.now() + '-' + Math.floor(Math.random() * 9999);

  const statusEl = document.getElementById('brew-status');
  if (statusEl) {
    statusEl.classList.remove('hidden');
    const card = document.createElement('div');
    card.id = brewId;
    card.style.cssText = `background:rgba(0,0,0,0.25);border:1px solid ${color};border-radius:10px;padding:12px;margin-top:8px`;
    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:22px">${icon}</span>
        <div style="flex:1">
          <div style="font-weight:700;font-size:12px;color:${color}">${rarity.toUpperCase()} brewing…</div>
          <div style="font-size:10px;color:var(--dim)">Stir quality: ${stirMult.toFixed(1)}× · ${secs}s total</div>
        </div>
        <div id="${brewId}-txt" style="font-size:12px;color:var(--dim);font-weight:700;min-width:36px;text-align:right">${secs}s</div>
      </div>
      <div style="height:8px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden">
        <div id="${brewId}-fill" style="height:100%;width:0%;background:${color};border-radius:99px;transition:none"></div>
      </div>`;
    statusEl.appendChild(card);
  }

  const start = Date.now();
  const iv = setInterval(() => {
    const elapsed   = Date.now() - start;
    const pct       = Math.min(100, (elapsed / brewMs) * 100);
    const remaining = Math.max(0, Math.ceil((brewMs - elapsed) / 1000));
    const fill = document.getElementById(brewId + '-fill');
    const txt  = document.getElementById(brewId + '-txt');
    if (fill) fill.style.width = pct + '%';
    if (txt)  txt.textContent  = remaining > 0 ? `${remaining}s` : 'Done!';
    if (elapsed >= brewMs) {
      clearInterval(iv);
      // Remove this brew's card
      const card = document.getElementById(brewId);
      if (card) card.remove();
      // Hide container if no more brews
      const statusEl = document.getElementById('brew-status');
      if (statusEl && statusEl.children.length === 0) statusEl.classList.add('hidden');
      callback(stirMult);
    }
  }, 200);
}

function attemptBrew() {
  const selected = brewSlots.filter(s => s !== null);
  if (selected.length < 2) { toast('Add at least 2 ingredients!', 'warn'); return; }
  for (const id of selected) {
    if (getIngredientCount(id) < 1) { toast(`Missing: ${id}`, 'warn'); return; }
  }

  // Run brewing minigame — difficulty based on matched recipe rarity (or uncommon for unknown)
  const sorted = [...selected].sort();
  const matchPreview = ALCHEMY_RECIPES.find(r => {
    const rs = [...r.ingredients].sort();
    return rs.length === sorted.length && rs.every((v, i) => v === sorted[i]);
  });
  const brewRarity = matchPreview ? matchPreview.rarity : 'common';

  brewMinigame(brewRarity, (mult) => {
    const sorted = [...selected].sort();
    const match = ALCHEMY_RECIPES.find(r => {
      const rs = [...r.ingredients].sort();
      return rs.length === sorted.length && rs.every((v, i) => v === sorted[i]);
    });

    // Consume ingredients
    for (const id of selected) {
      G.player.alchemyInv[id] = Math.max(0, (G.player.alchemyInv[id] || 0) - 1);
    }

    if (match) {
      if (!G.player.alchemyRecipes.includes(match.id)) {
        G.player.alchemyRecipes.push(match.id);
        toast(`🧪 Recipe discovered: ${match.name}!`, 'rare');
        spawnFloatingText('Recipe!', 'float-xp');
        gainXP(500);
        // Discovery flash
        const f = document.createElement('div');
        f.style.cssText = `position:fixed;inset:0;z-index:9997;pointer-events:none;background:rgba(245,197,66,0.2);animation:digFlash 0.6s ease-out forwards;`;
        document.body.appendChild(f); setTimeout(() => f.remove(), 700);
      }
      const count = mult >= 1.8 ? 3 : mult >= 1.4 ? 2 : 1;
      addPotion(match.id, count);
      gainXP(50 * count);
      alchemyBrewVFX(match.rarity);
      toast(`${match.icon} Brewed ${count}x ${match.name}!`, 'success');
      spawnFloatingText(`+${count} ${match.icon}`, 'float-xp');
    } else {
      toast('💨 The brew fizzled... try different ingredients.', 'warn');
      spawnFloatingText('Fizzle!', 'float-dmg');
    }

    clearBrewSlots();
    renderAlchemy();
  });
}

function useKnownRecipe(recipeId) {
  const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  const needed = {};
  for (const id of recipe.ingredients) needed[id] = (needed[id] || 0) + 1;
  for (const [id, count] of Object.entries(needed)) {
    if (getIngredientCount(id) < count) {
      const ing = ALCHEMY_INGREDIENTS.find(i => i.id === id);
      toast(`Missing: ${ing ? ing.name : id}`, 'warn');
      return;
    }
  }

  brewMinigame(recipe.rarity, (mult) => {
    for (const [id, count] of Object.entries(needed)) {
      G.player.alchemyInv[id] = (G.player.alchemyInv[id] || 0) - count;
    }
    const count = mult >= 1.8 ? 3 : mult >= 1.4 ? 2 : 1;
    addPotion(recipe.id, count);
    alchemyBrewVFX(recipe.rarity);
    toast(`${recipe.icon} Brewed ${count}x ${recipe.name}!`, 'success');
    spawnFloatingText(`+${count} ${recipe.icon}`, 'float-xp');
    renderAlchemy();
  });
}

function brewHintedRecipe(recipeId) {
  const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
  if (!recipe) return;
  // Check ingredients
  const needed = {};
  for (const id of recipe.ingredients) needed[id] = (needed[id] || 0) + 1;
  for (const [id, cnt] of Object.entries(needed)) {
    if (getIngredientCount(id) < cnt) {
      const ing = ALCHEMY_INGREDIENTS.find(i => i.id === id);
      toast(`Missing: ${ing ? ing.name : id}`, 'warn');
      return;
    }
  }
  // Auto-discover the recipe first so it shows up in known recipes after brewing
  if (!G.player.alchemyRecipes.includes(recipe.id)) {
    G.player.alchemyRecipes.push(recipe.id);
  }
  // Brew it using the normal flow
  useKnownRecipe(recipeId);
}

const RARITY_COLORS = { common: '#66bb6a', uncommon: '#6c9fff', rare: '#b06aff', legendary: '#f5c542' };
const RARITY_BG = { common: 'rgba(102,187,106,0.08)', uncommon: 'rgba(108,159,255,0.08)', rare: 'rgba(176,106,255,0.08)', legendary: 'rgba(245,197,66,0.08)' };
const ALCH_RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, legendary: 3 };

function brewAllRecipes() {
  const p = G.player;
  if (p.alchemyRecipes.length === 0) { toast('No recipes discovered!', 'warn'); return; }
  let totalBrewed = 0;
  for (const rid of p.alchemyRecipes) {
    const recipe = ALCHEMY_RECIPES.find(r => r.id === rid);
    if (!recipe) continue;
    const needed = {};
    for (const id of recipe.ingredients) needed[id] = (needed[id] || 0) + 1;
    let batches = Infinity;
    for (const [id, cnt] of Object.entries(needed)) {
      batches = Math.min(batches, Math.floor(getIngredientCount(id) / cnt));
    }
    if (batches <= 0) continue;
    for (const [id, cnt] of Object.entries(needed)) {
      G.player.alchemyInv[id] = (G.player.alchemyInv[id] || 0) - cnt * batches;
    }
    addPotion(recipe.id, batches);
    gainXP(50 * batches);
    totalBrewed += batches;
  }
  if (totalBrewed > 0) {
    toast(`\u2397\uFE0F Brewed ${totalBrewed} potions across all recipes!`, 'success');
    spawnFloatingText(`+${totalBrewed} \u{1F9EA}`, 'float-xp');
  } else {
    toast('Not enough ingredients to brew anything!', 'warn');
  }
  renderAlchemy();
}

function _injectAlchemyCSS() {
  if (document.getElementById('alchemy-rework-css')) return;
  const s = document.createElement('style');
  s.id = 'alchemy-rework-css';
  s.textContent = `
.alch-wrap{display:flex;flex-direction:column;gap:20px}
.alch-sec{display:flex;flex-direction:column;gap:8px}
.alch-sec-title{font-size:15px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:8px}
.alch-sec-title span{font-size:12px;color:var(--dim);font-weight:400}
#brew-status{display:flex;flex-direction:column;gap:8px}
#brew-status.hidden{display:none}
.alch-brew-card{background:rgba(0,0,0,0.3);border:1px solid var(--border);border-radius:10px;padding:12px}
.alch-brew-top{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.alch-brew-icon{font-size:24px}
.alch-brew-info{flex:1}
.alch-brew-rarity{font-size:12px;font-weight:700}
.alch-brew-meta{font-size:10px;color:var(--dim)}
.alch-brew-timer{font-size:12px;color:var(--dim);font-weight:700;min-width:36px;text-align:right}
.alch-brew-bar{height:8px;background:rgba(255,255,255,0.06);border-radius:99px;overflow:hidden}
.alch-brew-fill{height:100%;width:0%;border-radius:99px;transition:none}
.alch-ing-row{display:flex;gap:8px;overflow-x:auto;padding:4px 0 8px;scrollbar-width:thin;scrollbar-color:var(--border) transparent}
.alch-ing-row::-webkit-scrollbar{height:4px}
.alch-ing-row::-webkit-scrollbar-track{background:transparent}
.alch-ing-row::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.alch-ing-chip{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:64px;padding:8px 6px;background:var(--card);border:1px solid var(--border);border-radius:8px;cursor:pointer;transition:all 0.15s;flex-shrink:0}
.alch-ing-chip:hover{border-color:var(--border-h);background:var(--card-h)}
.alch-ing-chip.empty{opacity:0.3}
.alch-ing-chip.selected{border-color:var(--accent);background:rgba(108,159,255,0.1);box-shadow:0 0 8px rgba(108,159,255,0.2)}
.alch-ing-icon{font-size:22px;line-height:1}
.alch-ing-name{font-size:9px;color:var(--dim);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:58px}
.alch-ing-count{font-size:11px;font-weight:700;color:var(--text)}
.alch-ing-count.zero{color:var(--dim)}
.alch-brew-row{display:flex;gap:8px;align-items:center;justify-content:center;padding:12px 0;flex-wrap:wrap}
.alch-slot{width:52px;height:52px;border:2px dashed var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:10px;color:var(--dim);cursor:pointer;transition:all 0.15s;position:relative;background:rgba(0,0,0,0.2)}
.alch-slot:hover{border-color:var(--border-h)}
.alch-slot.filled{border-style:solid;border-color:var(--accent);background:rgba(108,159,255,0.08)}
.alch-slot.filled .alch-slot-icon{font-size:22px}
.alch-slot.filled .alch-slot-name{position:absolute;bottom:-14px;font-size:8px;color:var(--dim);white-space:nowrap}
.alch-slot-plus{font-size:16px;color:var(--dim);opacity:0.3}
.alch-actions{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.alch-recipe-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
@media(max-width:900px){.alch-recipe-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.alch-recipe-grid{grid-template-columns:1fr}}
.alch-recipe-card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:6px;transition:border-color 0.15s,background 0.15s,transform 0.15s;position:relative;overflow:hidden}
.alch-recipe-card::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(108,159,255,0.3),transparent);opacity:0;transition:opacity 0.2s}
.alch-recipe-card:hover{background:var(--card-h);border-color:var(--border-h);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.3)}
.alch-recipe-card:hover::before{opacity:1}
.alch-r-header{display:flex;align-items:center;gap:8px}
.alch-r-icon{font-size:24px}
.alch-r-name{font-size:13px;font-weight:700;color:var(--text);flex:1}
.alch-r-badge{font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px}
.alch-r-desc{font-size:11px;color:var(--dim);line-height:1.4}
.alch-r-ings{display:flex;flex-wrap:wrap;gap:4px;margin:4px 0}
.alch-r-ing{font-size:10px;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.04);border:1px solid var(--border);white-space:nowrap}
.alch-r-ing.has{color:var(--ok);border-color:rgba(39,174,96,0.3)}
.alch-r-ing.missing{color:var(--danger);border-color:rgba(231,76,60,0.3)}
.alch-r-actions{display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap}
.alch-potion-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px}
.alch-potion-card{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--card);border:1px solid var(--border);border-radius:8px;transition:border-color 0.15s}
.alch-potion-card:hover{border-color:var(--border-h)}
.alch-p-icon{font-size:22px}
.alch-p-info{flex:1;min-width:0}
.alch-p-name{font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.alch-p-count{font-size:11px;color:var(--dim)}
.alch-hint-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px}
.alch-hint-card{padding:12px;background:var(--card);border:1px solid var(--border);border-radius:8px;display:flex;flex-direction:column;gap:6px}
.alch-hint-card.owned{border-color:var(--ok)}
.alch-hint-top{display:flex;align-items:center;gap:8px}
.alch-hint-icon{font-size:20px}
.alch-hint-name{font-size:12px;font-weight:700;color:var(--text)}
.alch-hint-desc{font-size:10px;color:var(--dim)}
.alch-undiscovered{margin-top:16px}
.alch-unknown-card{text-align:center;padding:12px;opacity:0.5}
.alch-unknown-card .alch-unk-icon{font-size:24px}
.alch-unknown-card .alch-unk-txt{font-size:11px;color:var(--dim);margin-top:4px}
.alch-recipe-count{font-size:12px;color:var(--dim);font-weight:400}
`;
  document.head.appendChild(s);
}

function _rarityStyle(rarity) {
  const c = RARITY_COLORS[rarity] || RARITY_COLORS.common;
  const bg = RARITY_BG[rarity] || RARITY_BG.common;
  return 'color:' + c + ';background:' + bg;
}

function _getNeededIngredients(recipe) {
  const needed = {};
  for (const id of recipe.ingredients) needed[id] = (needed[id] || 0) + 1;
  return needed;
}

function _canBrewRecipe(recipe) {
  const needed = _getNeededIngredients(recipe);
  return Object.entries(needed).every(([id, cnt]) => getIngredientCount(id) >= cnt);
}

function _renderIngredientRow() {
  return ALCHEMY_INGREDIENTS.map(ing => {
    const count = getIngredientCount(ing.id);
    const selected = brewSlots.includes(ing.id);
    const cls = 'alch-ing-chip' + (count === 0 ? ' empty' : '') + (selected ? ' selected' : '');
    return '<div class="' + cls + '" onclick="toggleBrewSlot(\'' + ing.id + '\')" title="' + ing.desc + '">' +
      '<span class="alch-ing-icon">' + ing.icon + '</span>' +
      '<span class="alch-ing-name">' + ing.name + '</span>' +
      '<span class="alch-ing-count' + (count === 0 ? ' zero' : '') + '">' + count + '</span>' +
    '</div>';
  }).join('');
}

function _renderBrewSlots() {
  return brewSlots.map((id, i) => {
    if (!id) return '<div class="alch-slot"><span class="alch-slot-plus">+</span></div>';
    const ing = ALCHEMY_INGREDIENTS.find(x => x.id === id);
    return '<div class="alch-slot filled" onclick="toggleBrewSlot(\'' + id + '\')">' +
      '<span class="alch-slot-icon">' + (ing ? ing.icon : '?') + '</span>' +
      '<span class="alch-slot-name">' + (ing ? ing.name : id) + '</span>' +
    '</div>';
  }).join('');
}

function _renderRecipeCard(recipe) {
  const needed = _getNeededIngredients(recipe);
  const canBrew = _canBrewRecipe(recipe);
  const potionCount = getPotionCount(recipe.id);
  const ingList = recipe.ingredients.map(id => {
    const ing = ALCHEMY_INGREDIENTS.find(x => x.id === id);
    const have = getIngredientCount(id);
    const cls = have >= (needed[id] || 1) ? 'has' : 'missing';
    return '<span class="alch-r-ing ' + cls + '">' + (ing ? ing.icon + ' ' + ing.name + ' (' + have + ')' : id) + '</span>';
  }).join('');
  const brewLabel = recipe.rarity === 'legendary' ? '(4 rounds)' : recipe.rarity === 'rare' ? '(3 rounds)' : recipe.rarity === 'uncommon' ? '(2 rounds)' : '(1 round)';
  let html = '<div class="alch-recipe-card">';
  html += '<div class="alch-r-header">';
  html += '<span class="alch-r-icon">' + recipe.icon + '</span>';
  html += '<span class="alch-r-name">' + recipe.name + '</span>';
  html += '<span class="alch-r-badge" style="' + _rarityStyle(recipe.rarity) + '">' + recipe.rarity + '</span>';
  html += '</div>';
  html += '<div class="alch-r-desc">' + recipe.desc + '</div>';
  html += '<div class="alch-r-ings">' + ingList + '</div>';
  html += '<div class="alch-r-actions">';
  html += '<button class="btn-primary" onclick="useKnownRecipe(\'' + recipe.id + '\')" ' + (canBrew ? '' : 'disabled') + '>';
  html += canBrew ? '\u{1F9EA} Brew ' + brewLabel : '\u274C Missing';
  html += '</button>';
  if (potionCount > 0) {
    html += '<button class="btn-small" onclick="drinkPotion(\'' + recipe.id + '\')" style="background:rgba(39,174,96,0.15);border-color:var(--ok)">\u{1F376} Drink (' + potionCount + ')</button>';
  } else {
    html += '<span style="font-size:11px;color:var(--dim)">\u{1F376} 0 potions</span>';
  }
  html += '</div></div>';
  return html;
}

function _renderPotionInventory() {
  const p = G.player;
  const ownedRecipes = p.alchemyRecipes.filter(rid => getPotionCount(rid) > 0);
  if (ownedRecipes.length === 0) return '';
  const cards = ownedRecipes.map(rid => {
    const r = ALCHEMY_RECIPES.find(x => x.id === rid);
    if (!r) return '';
    const cnt = getPotionCount(rid);
    return '<div class="alch-potion-card">' +
      '<span class="alch-p-icon">' + r.icon + '</span>' +
      '<div class="alch-p-info"><div class="alch-p-name">' + r.name + '</div>' +
      '<div class="alch-p-count">' + cnt + 'x \u{1F376} owned</div></div>' +
      '<button class="btn-small" onclick="drinkPotion(\'' + r.id + '\')" style="background:rgba(39,174,96,0.15);border-color:var(--ok)">Drink</button>' +
    '</div>';
  }).join('');
  return '<div class="alch-sec">' +
    '<div class="alch-sec-title">\u{1F376} Potion Inventory</div>' +
    '<div class="alch-potion-grid">' + cards + '</div>' +
  '</div>';
}

function _renderHintUpgrades() {
  const p = G.player;
  const cards = ALCHEMY_HINT_UPGRADES.map(upg => {
    const owned = !!(p.shopPurchases && p.shopPurchases[upg.id]);
    const canBuy = !owned && p.gold >= upg.cost;
    let html = '<div class="alch-hint-card' + (owned ? ' owned' : '') + '">';
    html += '<div class="alch-hint-top"><span class="alch-hint-icon">' + upg.icon + '</span>';
    html += '<div class="alch-hint-name">' + upg.name + '</div></div>';
    html += '<div class="alch-hint-desc">' + upg.desc + '</div>';
    if (owned) {
      html += '<span style="color:var(--ok);font-size:11px">\u2713 Unlocked</span>';
    } else {
      html += '<button class="btn-small" onclick="buyAlchemyHint(\'' + upg.id + '\')" ' + (canBuy ? '' : 'disabled') + '>\u{1F4B0}' + upg.cost + '</button>';
    }
    html += '</div>';
    return html;
  }).join('');
  return '<div class="alch-sec">' +
    '<div class="alch-sec-title">\u{1F4A1} Recipe Hints <span>Buy hints to reveal undiscovered recipes</span></div>' +
    '<div class="alch-hint-grid">' + cards + '</div>' +
  '</div>';
}

function _renderUndiscoveredRecipes() {
  const p = G.player;
  const discoveredSet = new Set(p.alchemyRecipes);
  const undiscovered = ALCHEMY_RECIPES.filter(r => !discoveredSet.has(r.id));
  if (undiscovered.length === 0) return '';
  const sorted = undiscovered.sort((a, b) => (ALCH_RARITY_ORDER[a.rarity] || 0) - (ALCH_RARITY_ORDER[b.rarity] || 0));
  const cards = sorted.map(r => {
    const showHint = hasHintFor(r.rarity);
    if (!showHint) {
      return '<div class="alch-recipe-card alch-unknown-card">' +
        '<div class="alch-unk-icon">\u2753</div>' +
        '<div class="alch-unk-txt">' + r.rarity + ' recipe \u2014 buy hint to reveal</div></div>';
    }
    const needed = _getNeededIngredients(r);
    const canBrew = _canBrewRecipe(r);
    const allIngs = r.ingredients.map(id => {
      const ing = ALCHEMY_INGREDIENTS.find(x => x.id === id);
      const have = getIngredientCount(id);
      const cls = have >= (needed[id] || 1) ? 'has' : 'missing';
      return '<span class="alch-r-ing ' + cls + '">' + (ing ? ing.icon + ' ' + ing.name + ' (' + have + ')' : '?') + '</span>';
    }).join('');
    let html = '<div class="alch-recipe-card"' + (canBrew ? ' style="border-color:var(--ok);background:rgba(39,174,96,0.07)"' : '') + '>';
    html += '<div class="alch-r-header">';
    html += '<span class="alch-r-icon">' + r.icon + '</span>';
    html += '<span class="alch-r-name">' + r.name + '</span>';
    html += '<span class="alch-r-badge" style="' + _rarityStyle(r.rarity) + '">' + r.rarity + '</span>';
    html += '</div>';
    html += '<div class="alch-r-ings">' + allIngs + '</div>';
    if (canBrew) {
      html += '<button class="btn-primary" style="width:100%;background:rgba(39,174,96,0.2);border-color:var(--ok)" onclick="brewHintedRecipe(\'' + r.id + '\')">\u{1F525} Brew it!</button>';
    } else {
      html += '<div style="font-size:11px;color:var(--dim)">Gather ingredients to brew</div>';
    }
    html += '</div>';
    return html;
  }).join('');
  return '<div class="alch-undiscovered">' +
    '<div class="alch-sec-title">\u{1F50D} Undiscovered Recipes</div>' +
    '<div class="alch-recipe-grid" style="margin-top:8px">' + cards + '</div>' +
  '</div>';
}

function renderAlchemy() {
  const container = document.getElementById('alchemy-container');
  if (!container) return;
  const p = G.player;

  if (p.level < 18) {
    container.innerHTML = '<div class="locked-section"><div class="locked-icon">\u2697\uFE0F</div><h3>Alchemy Locked</h3><p>Reach <strong>Level 18</strong> to unlock Alchemy.</p></div>';
    return;
  }

  _injectAlchemyCSS();

  const existingBrewStatus = document.getElementById('brew-status');
  const savedBrewHtml = existingBrewStatus ? existingBrewStatus.innerHTML : '';
  const brewStatusHidden = existingBrewStatus ? existingBrewStatus.classList.contains('hidden') : true;

  const ingredientRow = _renderIngredientRow();
  const brewSlotsHtml = _renderBrewSlots();
  const recipeCards = p.alchemyRecipes.length === 0
    ? '<div style="text-align:center;padding:16px;color:var(--dim);font-size:13px">No recipes discovered yet. Experiment by combining ingredients!</div>'
    : p.alchemyRecipes.map(rid => {
        const r = ALCHEMY_RECIPES.find(x => x.id === rid);
        return r ? _renderRecipeCard(r) : '';
      }).join('');
  const potionHtml = _renderPotionInventory();
  const hintsHtml = _renderHintUpgrades();
  const undiscoveredHtml = _renderUndiscoveredRecipes();

  let html = '<div class="alch-wrap">';
  html += '<div id="brew-status" class="hidden"></div>';

  html += '<div class="alch-sec">';
  html += '<div class="alch-sec-title">\u{1F9EA} Ingredients <span>Click to add to brew slots</span></div>';
  html += '<div class="alch-ing-row">' + ingredientRow + '</div>';
  html += '</div>';

  html += '<div class="alch-sec" style="align-items:center">';
  html += '<div class="alch-sec-title" style="justify-content:center">\u2697\uFE0F Brewing Cauldron</div>';
  html += '<div class="alch-brew-row">' + brewSlotsHtml + '</div>';
  html += '<div class="alch-actions">';
  html += '<button class="btn-primary" onclick="attemptBrew()">\u{1F525} Brew!</button>';
  html += '<button class="btn-small" onclick="brewAllRecipes()">\u{1F9EA} Brew All</button>';
  html += '<button class="btn-small" onclick="clearBrewSlots()">Clear</button>';
  html += '</div></div>';

  html += '<div class="alch-sec">';
  html += '<div class="alch-sec-title">\u{1F4DC} Known Recipes <span class="alch-recipe-count">' + p.alchemyRecipes.length + '/' + ALCHEMY_RECIPES.length + '</span></div>';
  html += '<div class="alch-recipe-grid">' + recipeCards + '</div>';
  html += '</div>';

  html += potionHtml;
  html += hintsHtml;
  html += undiscoveredHtml;
  html += '</div>';

  container.innerHTML = html;

  const newBrewStatus = document.getElementById('brew-status');
  if (newBrewStatus && savedBrewHtml) {
    newBrewStatus.innerHTML = savedBrewHtml;
    if (!brewStatusHidden) newBrewStatus.classList.remove('hidden');
  }
}
