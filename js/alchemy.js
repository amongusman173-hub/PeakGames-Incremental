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
];

// ── HINT UPGRADES — buy to reveal recipe hints ──
const ALCHEMY_HINT_UPGRADES = [
  { id: 'hint_common',    name: 'Common Hints',    icon: '📗', desc: 'Reveals hints for all Common recipes.',    cost: 300,  rarity: 'common'    },
  { id: 'hint_uncommon',  name: 'Uncommon Hints',  icon: '📘', desc: 'Reveals hints for all Uncommon recipes.',  cost: 800,  rarity: 'uncommon'  },
  { id: 'hint_rare',      name: 'Rare Hints',      icon: '📙', desc: 'Reveals hints for all Rare recipes.',      cost: 2000, rarity: 'rare'      },
  { id: 'hint_legendary', name: 'Legendary Hints', icon: '📕', desc: 'Reveals hints for all Legendary recipes.', cost: 6000, rarity: 'legendary' },
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

// ── BREWING MINIGAME — rarity determines difficulty and type ──
// common: 1 easy hold
// uncommon: 1 medium hold + timing
// rare: 2 rounds (hold + mash)
// legendary: 3 rounds (hold + mash + sequence)
function brewMinigame(rarity, callback) {
  const configs = {
    common:    { rounds: [['hold', 1]], label: '⚗️ Brewing — stir gently!' },
    uncommon:  { rounds: [['hold', 2], ['timing', 2]], label: '⚗️ Brewing — careful concentration!' },
    rare:      { rounds: [['hold', 2], ['mash', 2], ['timing', 3]], label: '⚗️ Rare Brew — intense focus required!' },
    legendary: { rounds: [['hold', 3], ['mash', 3], ['sequence', 3], ['timing', 3]], label: '⚗️ LEGENDARY BREW — master the cauldron!' },
  };
  const cfg = configs[rarity] || configs.common;
  let roundIdx = 0;
  let totalMult = 1;

  function runRound() {
    if (roundIdx >= cfg.rounds.length) {
      callback(Math.min(2.2, totalMult / cfg.rounds.length));
      return;
    }
    const [type, diff] = cfg.rounds[roundIdx];
    const roundLabel = cfg.rounds.length > 1
      ? `${cfg.label} (${roundIdx + 1}/${cfg.rounds.length})`
      : cfg.label;
    showMinigame(type, diff, roundLabel, (mult) => {
      totalMult += mult;
      roundIdx++;
      // Small delay between rounds so player can see result
      setTimeout(runRound, 900);
    });
  }

  runRound();
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
      playSound('make potion');
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
    playSound('make potion');
    toast(`${recipe.icon} Brewed ${count}x ${recipe.name}!`, 'success');
    spawnFloatingText(`+${count} ${recipe.icon}`, 'float-xp');
    renderAlchemy();
  });
}

function renderAlchemy() {
  const container = document.getElementById('alchemy-container');
  if (!container) return;
  const p = G.player;

  if (p.level < 18) {
    container.innerHTML = `<div class="locked-section"><div class="locked-icon">⚗️</div><h3>Alchemy Locked</h3><p>Reach <strong>Level 18</strong> to unlock Alchemy.</p></div>`;
    return;
  }

  // Ingredient inventory
  const invHtml = ALCHEMY_INGREDIENTS.map(ing => {
    const count = getIngredientCount(ing.id);
    const selected = brewSlots.includes(ing.id);
    return `<div class="ing-card${selected ? ' ing-selected' : ''}${count === 0 ? ' ing-empty' : ''}"
         onclick="toggleBrewSlot('${ing.id}')" title="${ing.desc}">
      <span class="ing-icon">${ing.icon}</span>
      <span class="ing-name">${ing.name}</span>
      <span class="ing-count${count === 0 ? ' zero' : ''}">${count}</span>
    </div>`;
  }).join('');

  // Brew slots
  const slotsHtml = brewSlots.map((id, i) => {
    if (!id) return `<div class="brew-slot empty">+</div>`;
    const ing = ALCHEMY_INGREDIENTS.find(x => x.id === id);
    return `<div class="brew-slot filled" onclick="toggleBrewSlot('${id}')">${ing ? ing.icon : '?'}<span>${ing ? ing.name : id}</span></div>`;
  }).join('');

  // Hint upgrades panel
  const hintsHtml = ALCHEMY_HINT_UPGRADES.map(upg => {
    const owned = !!(p.shopPurchases && p.shopPurchases[upg.id]);
    const canBuy = !owned && p.gold >= upg.cost;
    return `<div class="card" style="padding:10px;${owned ? 'border-color:var(--ok)' : ''}">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:20px">${upg.icon}</span>
        <div>
          <div style="font-weight:700;font-size:13px">${upg.name}</div>
          <div style="font-size:11px;color:var(--dim)">${upg.desc}</div>
        </div>
      </div>
      ${owned
        ? `<span style="color:var(--ok);font-size:11px;margin-top:6px;display:block">✓ Unlocked</span>`
        : `<button class="btn-small" style="margin-top:6px" onclick="buyAlchemyHint('${upg.id}')" ${canBuy ? '' : 'disabled'}>💰${upg.cost}</button>`
      }
    </div>`;
  }).join('');

  // Known recipes with hint system + drink button
  const knownHtml = p.alchemyRecipes.length === 0
    ? `<div class="alchemy-hint">No recipes discovered yet. Experiment by combining ingredients!</div>`
    : p.alchemyRecipes.map(rid => {
        const r = ALCHEMY_RECIPES.find(x => x.id === rid);
        if (!r) return '';
        const needed = {};
        for (const id of r.ingredients) needed[id] = (needed[id] || 0) + 1;
        const canBrew = Object.entries(needed).every(([id, cnt]) => getIngredientCount(id) >= cnt);
        const potionCount = getPotionCount(r.id);
        const ingList = r.ingredients.map(id => {
          const ing = ALCHEMY_INGREDIENTS.find(x => x.id === id);
          const have = getIngredientCount(id);
          const color = have >= (needed[id] || 1) ? 'var(--ok)' : 'var(--danger)';
          return ing ? `<span style="color:${color}">${ing.icon}${ing.name}(${have})</span>` : id;
        }).join(' + ');
        return `<div class="card recipe-card">
          <h3>${r.icon} ${r.name} <span class="tech-rarity ${r.rarity}">${r.rarity}</span></h3>
          <div class="card-desc">${r.desc}</div>
          <div class="recipe-ingredients" style="font-size:11px;margin:6px 0">${ingList}</div>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            <button class="btn-primary" onclick="useKnownRecipe('${r.id}')" ${canBrew ? '' : 'disabled'}>
              ${canBrew ? `🧪 Brew ${r.rarity === 'legendary' ? '(4 rounds)' : r.rarity === 'rare' ? '(3 rounds)' : r.rarity === 'uncommon' ? '(2 rounds)' : '(1 round)'}` : '❌ Missing'}
            </button>
            ${potionCount > 0
              ? `<button class="btn-small" onclick="drinkPotion('${r.id}')" style="background:rgba(39,174,96,0.15);border-color:var(--ok)">🍶 Drink (${potionCount})</button>`
              : `<span style="font-size:11px;color:var(--dim)">🍶 0 potions</span>`
            }
          </div>
        </div>`;
      }).join('');

  // Undiscovered recipes with hints
  const undiscovered = ALCHEMY_RECIPES.filter(r => !p.alchemyRecipes.includes(r.id));
  const hintedHtml = undiscovered.length === 0 ? '' : `
    <h3 style="margin-top:20px">🔍 Undiscovered Recipes</h3>
    <div class="card-grid" style="margin-top:8px">
      ${undiscovered.map(r => {
        const showHint = hasHintFor(r.rarity);
        if (!showHint) return `<div class="card" style="opacity:0.5;text-align:center;padding:12px">
          <div style="font-size:24px">❓</div>
          <div style="font-size:11px;color:var(--dim);margin-top:4px">${r.rarity} recipe — buy hint to reveal</div>
        </div>`;
        // Show partial hint: first 2 ingredients and total count
        const hintIngs = r.ingredients.slice(0, 2).map(id => {
          const ing = ALCHEMY_INGREDIENTS.find(x => x.id === id);
          return ing ? `${ing.icon} ${ing.name}` : '?';
        });
        const more = r.ingredients.length > 2 ? ` + ${r.ingredients.length - 2} more` : '';
        return `<div class="card" style="padding:10px">
          <div style="font-size:11px;color:var(--dim)">🔍 ${r.rarity} · ${r.ingredients.length} ingredients</div>
          <div style="font-size:12px;margin-top:4px;color:var(--text)">${hintIngs.join(' + ')}${more}</div>
          <div style="font-size:11px;color:var(--dim);margin-top:2px">Discover the full recipe by experimenting!</div>
        </div>`;
      }).join('')}
    </div>`;

  container.innerHTML = `
    <div class="alchemy-layout">
      <div class="alchemy-left">
        <h3>🧴 Ingredients</h3>
        <p class="tab-desc">Click to add to brew slots.</p>
        <div class="ing-grid">${invHtml}</div>
        <h3 style="margin-top:16px">💡 Recipe Hints</h3>
        <p class="tab-desc" style="font-size:11px">Buy hints to reveal undiscovered recipes.</p>
        <div class="card-grid" style="margin-top:8px">${hintsHtml}</div>
      </div>
      <div class="alchemy-right">
        <h3>⚗️ Brewing Cauldron</h3>
        <p class="tab-desc">Select 2–4 ingredients, then brew. A minigame determines quality!</p>
        <div class="brew-slots">${slotsHtml}</div>
        <div class="brew-actions">
          <button class="btn-primary" onclick="attemptBrew()">🔥 Brew!</button>
          <button class="btn-small" onclick="clearBrewSlots()">Clear</button>
        </div>
        <h3 style="margin-top:20px">📜 Known Recipes (${p.alchemyRecipes.length}/${ALCHEMY_RECIPES.length})</h3>
        <div class="card-grid" style="margin-top:10px">${knownHtml}</div>
        ${hintedHtml}
      </div>
    </div>`;
}

