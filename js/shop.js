// ===== SKILL TREE =====
// Each branch: ~14 nodes, 6 rows, up to 3 cols. Costs scale steeply.
// row/col define position in the SVG canvas.

const SKILL_TREE = [

  // ══════════════════════════════════════════
  // ⚔️  COMBAT  — 14 nodes
  // ══════════════════════════════════════════
  { id:'c1',  name:'Sharp Edge',      icon:'🗡️', branch:'combat', row:0,col:1, cost:50,   maxLevel:5, requires:[],           desc:'+8 ATK per level.',                         effect:(p)=>{ p.atk+=8; } },
  { id:'c2',  name:'Iron Guard',      icon:'🛡️', branch:'combat', row:1,col:0, cost:80,   maxLevel:5, requires:['c1'],       desc:'+6 DEF per level.',                         effect:(p)=>{ p.def+=6; } },
  { id:'c3',  name:'Berserker',       icon:'😤', branch:'combat', row:1,col:1, cost:80,   maxLevel:5, requires:['c1'],       desc:'+12 ATK, -2 DEF per level.',                effect:(p)=>{ p.atk+=12; p.def=Math.max(0,p.def-2); } },
  { id:'c4',  name:'Blade Dancer',    icon:'💃', branch:'combat', row:1,col:2, cost:80,   maxLevel:5, requires:['c1'],       desc:'+5 ATK, +3 SPD per level.',                 effect:(p)=>{ p.atk+=5; p.spd+=3; } },
  { id:'c5',  name:'Parry Master',    icon:'⚔️', branch:'combat', row:2,col:0, cost:150,  maxLevel:4, requires:['c2'],       desc:'+10 DEF, +5 ATK per level.',                effect:(p)=>{ p.def+=10; p.atk+=5; } },
  { id:'c6',  name:'Crit Mastery',    icon:'💥', branch:'combat', row:2,col:1, cost:150,  maxLevel:4, requires:['c3'],       desc:'+15 ATK per level.',                        effect:(p)=>{ p.atk+=15; } },
  { id:'c7',  name:'Phantom Step',    icon:'👻', branch:'combat', row:2,col:2, cost:150,  maxLevel:4, requires:['c4'],       desc:'+8 SPD, +8 ATK per level.',                 effect:(p)=>{ p.spd+=8; p.atk+=8; } },
  { id:'c8',  name:'Steel Fortress',  icon:'🏰', branch:'combat', row:3,col:0, cost:300,  maxLevel:3, requires:['c5'],       desc:'+20 DEF per level.',                        effect:(p)=>{ p.def+=20; } },
  { id:'c9',  name:'Warlord\'s Might',icon:'👑', branch:'combat', row:3,col:1, cost:300,  maxLevel:3, requires:['c5','c6'],  desc:'+25 ATK, +15 DEF per level.',               effect:(p)=>{ p.atk+=25; p.def+=15; } },
  { id:'c10', name:'Assassin\'s Edge',icon:'🗡️', branch:'combat', row:3,col:2, cost:300,  maxLevel:3, requires:['c6','c7'],  desc:'+30 ATK, +10 SPD per level.',               effect:(p)=>{ p.atk+=30; p.spd+=10; } },
  { id:'c11', name:'Titan\'s Fist',   icon:'🦾', branch:'combat', row:4,col:0, cost:600,  maxLevel:3, requires:['c8'],       desc:'+40 DEF, +20 ATK per level.',               effect:(p)=>{ p.def+=40; p.atk+=20; } },
  { id:'c12', name:'Warbringer',      icon:'⚡', branch:'combat', row:4,col:1, cost:600,  maxLevel:3, requires:['c9'],       desc:'+50 ATK per level.',                        effect:(p)=>{ p.atk+=50; } },
  { id:'c13', name:'Shadow Reaper',   icon:'💀', branch:'combat', row:4,col:2, cost:600,  maxLevel:3, requires:['c10'],      desc:'+40 ATK, +20 SPD per level.',               effect:(p)=>{ p.atk+=40; p.spd+=20; } },
  { id:'c14', name:'God of War',      icon:'🔱', branch:'combat', row:5,col:1, cost:2000, maxLevel:2, requires:['c11','c12','c13'], desc:'+100 ATK, +50 DEF, +30 SPD per level.', effect:(p)=>{ p.atk+=100; p.def+=50; p.spd+=30; } },

  // ══════════════════════════════════════════
  // 💰  WEALTH  — 14 nodes
  // ══════════════════════════════════════════
  { id:'w1',  name:'Coin Sense',      icon:'🪙', branch:'wealth', row:0,col:1, cost:60,   maxLevel:5, requires:[],           desc:'+15% gold from jobs per level.',            effect:()=>{} },
  { id:'w2',  name:'Merchant Eye',    icon:'👁️', branch:'wealth', row:1,col:0, cost:100,  maxLevel:5, requires:['w1'],       desc:'+20% gold from all sources per level.',     effect:()=>{} },
  { id:'w3',  name:'Fast Hands',      icon:'🤲', branch:'wealth', row:1,col:1, cost:100,  maxLevel:5, requires:['w1'],       desc:'Job cycles 10% faster per level.',          effect:()=>{} },
  { id:'w4',  name:'Haggler',         icon:'🤝', branch:'wealth', row:1,col:2, cost:100,  maxLevel:4, requires:['w1'],       desc:'+10% gold from all sources per level.',     effect:()=>{} },
  { id:'w5',  name:'Trade Empire',    icon:'🏦', branch:'wealth', row:2,col:0, cost:250,  maxLevel:4, requires:['w2'],       desc:'+30% gold from jobs per level.',            effect:()=>{} },
  { id:'w6',  name:'Efficiency',      icon:'⚙️', branch:'wealth', row:2,col:1, cost:250,  maxLevel:4, requires:['w3'],       desc:'Job cycles 15% faster per level.',          effect:()=>{} },
  { id:'w7',  name:'Black Market',    icon:'🕵️', branch:'wealth', row:2,col:2, cost:250,  maxLevel:3, requires:['w4'],       desc:'+25% gold from all sources per level.',     effect:()=>{} },
  { id:'w8',  name:'Monopoly',        icon:'🏛️', branch:'wealth', row:3,col:0, cost:500,  maxLevel:3, requires:['w5'],       desc:'+50% gold from jobs per level.',            effect:()=>{} },
  { id:'w9',  name:'Tycoon',          icon:'💎', branch:'wealth', row:3,col:1, cost:500,  maxLevel:3, requires:['w5','w6'],  desc:'+50% gold from all sources per level.',     effect:()=>{} },
  { id:'w10', name:'Speed Merchant',  icon:'🚀', branch:'wealth', row:3,col:2, cost:500,  maxLevel:3, requires:['w6','w7'],  desc:'Job cycles 20% faster per level.',          effect:()=>{} },
  { id:'w11', name:'Gold Rush',       icon:'⛏️', branch:'wealth', row:4,col:0, cost:1000, maxLevel:3, requires:['w8'],       desc:'+75% gold from jobs per level.',            effect:()=>{} },
  { id:'w12', name:'Infinite Wealth', icon:'♾️', branch:'wealth', row:4,col:1, cost:1000, maxLevel:2, requires:['w9'],       desc:'+100% gold from all sources per level.',    effect:()=>{} },
  { id:'w13', name:'Turbo Worker',    icon:'⚡', branch:'wealth', row:4,col:2, cost:1000, maxLevel:2, requires:['w10'],      desc:'Job cycles 30% faster per level.',          effect:()=>{} },
  { id:'w14', name:'Billionaire',     icon:'🤑', branch:'wealth', row:5,col:1, cost:3000, maxLevel:2, requires:['w11','w12','w13'], desc:'+200% gold from all sources, cycles 40% faster.', effect:()=>{} },

  // ══════════════════════════════════════════
  // ❤️  BODY  — 18 nodes (expanded with regen)
  // ══════════════════════════════════════════
  { id:'b1',  name:'Tough Skin',      icon:'🩹', branch:'body', row:0,col:1, cost:50,   maxLevel:5, requires:[],           desc:'+20 Max HP and +1% passive HP regen rate per level.',  effect:(p)=>{ p.maxHp+=20; p.hp=Math.min(p.hp+20,p.maxHp); p.regenBonus=(p.regenBonus||0)+0.01; } },
  { id:'b2',  name:'Iron Lungs',      icon:'💨', branch:'body', row:1,col:0, cost:80,   maxLevel:5, requires:['b1'],       desc:'+25 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=25; } },
  { id:'b3',  name:'Vitality',        icon:'❤️', branch:'body', row:1,col:1, cost:80,   maxLevel:5, requires:['b1'],       desc:'+60 Max HP per level.',                     effect:(p)=>{ p.maxHp+=60; p.hp=Math.min(p.hp+60,p.maxHp); } },
  { id:'b4',  name:'Thick Hide',      icon:'🦏', branch:'body', row:1,col:2, cost:80,   maxLevel:5, requires:['b1'],       desc:'+8 DEF per level.',                         effect:(p)=>{ p.def+=8; } },
  { id:'b5',  name:'Endurance',       icon:'🏃', branch:'body', row:2,col:0, cost:200,  maxLevel:4, requires:['b2'],       desc:'+40 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=40; } },
  { id:'b6',  name:'Giant\'s Blood',  icon:'🩸', branch:'body', row:2,col:1, cost:200,  maxLevel:4, requires:['b3'],       desc:'+100 Max HP per level.',                    effect:(p)=>{ p.maxHp+=100; p.hp=Math.min(p.hp+100,p.maxHp); } },
  { id:'b7',  name:'Stone Skin',      icon:'🪨', branch:'body', row:2,col:2, cost:200,  maxLevel:4, requires:['b4'],       desc:'+15 DEF per level.',                        effect:(p)=>{ p.def+=15; } },
  // Regen branch (col 3)
  { id:'b_r1',name:'Fast Healer',     icon:'💊', branch:'body', row:1,col:3, cost:100,  maxLevel:5, requires:['b1'],       desc:'+2% HP regen rate per level.',              effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.02; } },
  { id:'b_r2',name:'Regeneration',    icon:'🔄', branch:'body', row:2,col:3, cost:250,  maxLevel:4, requires:['b_r1'],     desc:'+3% HP regen rate per level.',              effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.03; } },
  { id:'b_r3',name:'Troll Blood',     icon:'🧬', branch:'body', row:3,col:3, cost:500,  maxLevel:3, requires:['b_r2'],     desc:'+5% HP regen rate per level.',              effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.05; } },
  { id:'b_r4',name:'Undying',         icon:'♻️', branch:'body', row:4,col:3, cost:1200, maxLevel:2, requires:['b_r3'],     desc:'+10% HP regen rate per level.',             effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.10; } },
  { id:'b8',  name:'Marathon Runner', icon:'🏅', branch:'body', row:3,col:0, cost:400,  maxLevel:3, requires:['b5'],       desc:'+80 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=80; } },
  { id:'b9',  name:'Immortal Body',   icon:'✨', branch:'body', row:3,col:1, cost:400,  maxLevel:3, requires:['b5','b6'],  desc:'+200 Max HP, +80 Stamina per level.',       effect:(p)=>{ p.maxHp+=200; p.maxStamina+=80; p.hp=Math.min(p.hp+200,p.maxHp); } },
  { id:'b10', name:'Diamond Skin',    icon:'💎', branch:'body', row:3,col:2, cost:400,  maxLevel:3, requires:['b6','b7'],  desc:'+25 DEF, +50 HP per level.',                effect:(p)=>{ p.def+=25; p.maxHp+=50; p.hp=Math.min(p.hp+50,p.maxHp); } },
  { id:'b11', name:'Infinite Stamina',icon:'⚡', branch:'body', row:4,col:0, cost:800,  maxLevel:3, requires:['b8'],       desc:'+150 Max Stamina per level.',               effect:(p)=>{ p.maxStamina+=150; } },
  { id:'b12', name:'Titan\'s Body',   icon:'🦾', branch:'body', row:4,col:1, cost:800,  maxLevel:3, requires:['b9'],       desc:'+400 Max HP per level.',                    effect:(p)=>{ p.maxHp+=400; p.hp=Math.min(p.hp+400,p.maxHp); } },
  { id:'b13', name:'Fortress',        icon:'🏰', branch:'body', row:4,col:2, cost:800,  maxLevel:3, requires:['b10'],      desc:'+50 DEF per level.',                        effect:(p)=>{ p.def+=50; } },
  { id:'b14', name:'Demigod\'s Form', icon:'🌟', branch:'body', row:5,col:1, cost:2500, maxLevel:2, requires:['b11','b12','b13'], desc:'+1000 Max HP, +300 Stamina, +80 DEF per level.', effect:(p)=>{ p.maxHp+=1000; p.maxStamina+=300; p.def+=80; p.hp=Math.min(p.hp+1000,p.maxHp); } },
  { id:'b15', name:'Phoenix Soul',    icon:'🔥', branch:'body', row:5,col:3, cost:3000, maxLevel:2, requires:['b_r4','b12'], desc:'+15% HP regen rate, +500 Max HP per level.', effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.15; p.maxHp+=500; p.hp=Math.min(p.hp+500,p.maxHp); } },

  // ══════════════════════════════════════════
  // 💨  SPEED  — 14 nodes
  // ══════════════════════════════════════════
  { id:'s1',  name:'Quick Feet',      icon:'👟', branch:'speed', row:0,col:1, cost:50,   maxLevel:5, requires:[],           desc:'+4 SPD per level.',                         effect:(p)=>{ p.spd+=4; } },
  { id:'s2',  name:'Agility',         icon:'🌪️', branch:'speed', row:1,col:0, cost:80,   maxLevel:5, requires:['s1'],       desc:'+6 SPD per level.',                         effect:(p)=>{ p.spd+=6; } },
  { id:'s3',  name:'Wind Step',       icon:'💨', branch:'speed', row:1,col:1, cost:80,   maxLevel:5, requires:['s1'],       desc:'+5 SPD, +10 ATK per level.',                effect:(p)=>{ p.spd+=5; p.atk+=10; } },
  { id:'s4',  name:'Reflex',          icon:'⚡', branch:'speed', row:1,col:2, cost:80,   maxLevel:4, requires:['s1'],       desc:'+8 SPD per level.',                         effect:(p)=>{ p.spd+=8; } },
  { id:'s5',  name:'Ghost Walk',      icon:'👻', branch:'speed', row:2,col:0, cost:200,  maxLevel:4, requires:['s2'],       desc:'+12 SPD per level.',                        effect:(p)=>{ p.spd+=12; } },
  { id:'s6',  name:'Blur',            icon:'🌀', branch:'speed', row:2,col:1, cost:200,  maxLevel:4, requires:['s2','s3'],  desc:'+10 SPD, +15 ATK per level.',               effect:(p)=>{ p.spd+=10; p.atk+=15; } },
  { id:'s7',  name:'Lightning Body',  icon:'🌩️', branch:'speed', row:2,col:2, cost:200,  maxLevel:4, requires:['s3','s4'],  desc:'+15 SPD per level.',                        effect:(p)=>{ p.spd+=15; } },
  { id:'s8',  name:'Teleport Step',   icon:'🔵', branch:'speed', row:3,col:0, cost:400,  maxLevel:3, requires:['s5'],       desc:'+25 SPD per level.',                        effect:(p)=>{ p.spd+=25; } },
  { id:'s9',  name:'Sonic Strike',    icon:'💫', branch:'speed', row:3,col:1, cost:400,  maxLevel:3, requires:['s5','s6'],  desc:'+20 SPD, +20 ATK per level.',               effect:(p)=>{ p.spd+=20; p.atk+=20; } },
  { id:'s10', name:'Time Slip',       icon:'⏱️', branch:'speed', row:3,col:2, cost:400,  maxLevel:3, requires:['s6','s7'],  desc:'+30 SPD per level.',                        effect:(p)=>{ p.spd+=30; } },
  { id:'s11', name:'Void Dash',       icon:'🌑', branch:'speed', row:4,col:0, cost:800,  maxLevel:3, requires:['s8'],       desc:'+50 SPD per level.',                        effect:(p)=>{ p.spd+=50; } },
  { id:'s12', name:'Blitz',           icon:'⚡', branch:'speed', row:4,col:1, cost:800,  maxLevel:3, requires:['s9'],       desc:'+40 SPD, +40 ATK per level.',               effect:(p)=>{ p.spd+=40; p.atk+=40; } },
  { id:'s13', name:'Phase Shift',     icon:'🔮', branch:'speed', row:4,col:2, cost:800,  maxLevel:3, requires:['s10'],      desc:'+60 SPD per level.',                        effect:(p)=>{ p.spd+=60; } },
  { id:'s14', name:'Speed of Light',  icon:'☀️', branch:'speed', row:5,col:1, cost:2500, maxLevel:2, requires:['s11','s12','s13'], desc:'+150 SPD, +80 ATK per level.',       effect:(p)=>{ p.spd+=150; p.atk+=80; } },

  // ══════════════════════════════════════════
  // 📚  MASTERY  — 14 nodes
  // ══════════════════════════════════════════
  { id:'m1',  name:'Student',         icon:'📖', branch:'mastery', row:0,col:1, cost:60,   maxLevel:5, requires:[],           desc:'+10% XP from training per level.',          effect:()=>{} },
  { id:'m2',  name:'Scholar',         icon:'📚', branch:'mastery', row:1,col:0, cost:100,  maxLevel:5, requires:['m1'],       desc:'+15% XP from all sources per level.',       effect:()=>{} },
  { id:'m3',  name:'Quick Learner',   icon:'⚡', branch:'mastery', row:1,col:1, cost:100,  maxLevel:5, requires:['m1'],       desc:'Training 10% faster per level.',            effect:()=>{} },
  { id:'m4',  name:'Focused Mind',    icon:'🧠', branch:'mastery', row:1,col:2, cost:100,  maxLevel:4, requires:['m1'],       desc:'+12% XP from all sources per level.',       effect:()=>{} },
  { id:'m5',  name:'Prodigy',         icon:'🌟', branch:'mastery', row:2,col:0, cost:250,  maxLevel:4, requires:['m2'],       desc:'+25% XP from all sources per level.',       effect:()=>{} },
  { id:'m6',  name:'Accelerated',     icon:'🚀', branch:'mastery', row:2,col:1, cost:250,  maxLevel:4, requires:['m2','m3'],  desc:'Training 20% faster per level.',            effect:()=>{} },
  { id:'m7',  name:'Genius',          icon:'💡', branch:'mastery', row:2,col:2, cost:250,  maxLevel:3, requires:['m3','m4'],  desc:'+20% XP, training 15% faster per level.',   effect:()=>{} },
  { id:'m8',  name:'Sage',            icon:'🧙', branch:'mastery', row:3,col:0, cost:500,  maxLevel:3, requires:['m5'],       desc:'+40% XP from all sources per level.',       effect:()=>{} },
  { id:'m9',  name:'Transcendent',    icon:'🔮', branch:'mastery', row:3,col:1, cost:500,  maxLevel:3, requires:['m5','m6'],  desc:'+50% XP, training 30% faster per level.',   effect:()=>{} },
  { id:'m10', name:'Hyperfocus',      icon:'🎯', branch:'mastery', row:3,col:2, cost:500,  maxLevel:3, requires:['m6','m7'],  desc:'Training 35% faster per level.',            effect:()=>{} },
  { id:'m11', name:'Enlightened',     icon:'☀️', branch:'mastery', row:4,col:0, cost:1000, maxLevel:3, requires:['m8'],       desc:'+75% XP from all sources per level.',       effect:()=>{} },
  { id:'m12', name:'Ascended',        icon:'🌌', branch:'mastery', row:4,col:1, cost:1000, maxLevel:2, requires:['m9'],       desc:'+100% XP from all sources per level.',      effect:()=>{} },
  { id:'m13', name:'Instant Master',  icon:'⚡', branch:'mastery', row:4,col:2, cost:1000, maxLevel:2, requires:['m10'],      desc:'Training 50% faster per level.',            effect:()=>{} },
  { id:'m14', name:'Omniscient',      icon:'👁️', branch:'mastery', row:5,col:1, cost:3000, maxLevel:2, requires:['m11','m12','m13'], desc:'+200% XP, training 60% faster per level.', effect:()=>{} },

  // ══════════════════════════════════════════
  // 🍀  LUCK  — 14 nodes
  // ══════════════════════════════════════════
  { id:'l1',  name:'Lucky Find',      icon:'🍀', branch:'luck', row:0,col:1, cost:80,   maxLevel:5, requires:[],           desc:'+10% dig loot quality per level.',          effect:()=>{} },
  { id:'l2',  name:'Treasure Sense',  icon:'🗺️', branch:'luck', row:1,col:0, cost:120,  maxLevel:5, requires:['l1'],       desc:'+15% gold from all sources per level.',     effect:()=>{} },
  { id:'l3',  name:'Fortune\'s Eye',  icon:'👁️', branch:'luck', row:1,col:1, cost:120,  maxLevel:5, requires:['l1'],       desc:'+15% rare drop chance per level.',          effect:()=>{} },
  { id:'l4',  name:'Rabbit\'s Foot',  icon:'🐇', branch:'luck', row:1,col:2, cost:120,  maxLevel:4, requires:['l1'],       desc:'+20% dig loot quality per level.',          effect:()=>{} },
  { id:'l5',  name:'Windfall',        icon:'💸', branch:'luck', row:2,col:0, cost:300,  maxLevel:4, requires:['l2'],       desc:'+25% gold from jobs per level.',            effect:()=>{} },
  { id:'l6',  name:'Gem Sight',       icon:'💎', branch:'luck', row:2,col:1, cost:300,  maxLevel:4, requires:['l2','l3'],  desc:'+30% dig loot quality per level.',          effect:()=>{} },
  { id:'l7',  name:'Clover Field',    icon:'🌿', branch:'luck', row:2,col:2, cost:300,  maxLevel:3, requires:['l3','l4'],  desc:'+25% rare drop chance per level.',          effect:()=>{} },
  { id:'l8',  name:'Gold Magnet',     icon:'🧲', branch:'luck', row:3,col:0, cost:600,  maxLevel:3, requires:['l5'],       desc:'+50% gold from all sources per level.',     effect:()=>{} },
  { id:'l9',  name:'Midas Touch',     icon:'✨', branch:'luck', row:3,col:1, cost:600,  maxLevel:3, requires:['l5','l6'],  desc:'+50% gold, +50% dig quality per level.',    effect:()=>{} },
  { id:'l10', name:'Legendary Luck',  icon:'🌈', branch:'luck', row:3,col:2, cost:600,  maxLevel:3, requires:['l6','l7'],  desc:'+40% rare drop chance per level.',          effect:()=>{} },
  { id:'l11', name:'Treasure Hunter', icon:'🏴‍☠️', branch:'luck', row:4,col:0, cost:1200, maxLevel:3, requires:['l8'],       desc:'+100% gold from all sources per level.',    effect:()=>{} },
  { id:'l12', name:'Fortune\'s Heir', icon:'👑', branch:'luck', row:4,col:1, cost:1200, maxLevel:2, requires:['l9'],       desc:'+100% gold, +100% dig quality per level.',  effect:()=>{} },
  { id:'l13', name:'Fate Weaver',     icon:'🕸️', branch:'luck', row:4,col:2, cost:1200, maxLevel:2, requires:['l10'],      desc:'+60% rare drop chance per level.',          effect:()=>{} },
  { id:'l14', name:'Child of Fortune',icon:'🌟', branch:'luck', row:5,col:1, cost:3500, maxLevel:2, requires:['l11','l12','l13'], desc:'+200% gold, +100% dig quality, +80% rare drops.', effect:()=>{} },

  // ══════════════════════════════════════════
  // ⚗️  CRAFT  — 14 nodes
  // ══════════════════════════════════════════
  { id:'cr1',  name:'Herbalist',       icon:'🌿', branch:'craft', row:0,col:1, cost:70,   maxLevel:5, requires:[],             desc:'Garden grows 10% faster per level.',        effect:()=>{} },
  { id:'cr2',  name:'Alchemist',       icon:'⚗️', branch:'craft', row:1,col:0, cost:110,  maxLevel:5, requires:['cr1'],        desc:'+1 extra ingredient yield per level.',       effect:()=>{} },
  { id:'cr3',  name:'Brewer',          icon:'🧪', branch:'craft', row:1,col:1, cost:110,  maxLevel:5, requires:['cr1'],        desc:'10% chance to save ingredients per level.',  effect:()=>{} },
  { id:'cr4',  name:'Green Thumb',     icon:'🌱', branch:'craft', row:1,col:2, cost:110,  maxLevel:4, requires:['cr1'],        desc:'Garden grows 15% faster per level.',         effect:()=>{} },
  { id:'cr5',  name:'Master Herbalist',icon:'🌺', branch:'craft', row:2,col:0, cost:280,  maxLevel:4, requires:['cr2'],        desc:'+2 extra ingredient yield per level.',        effect:()=>{} },
  { id:'cr6',  name:'Grand Brewer',    icon:'🔮', branch:'craft', row:2,col:1, cost:280,  maxLevel:4, requires:['cr2','cr3'],  desc:'20% chance to brew double potions per level.',effect:()=>{} },
  { id:'cr7',  name:'Garden Master',   icon:'🏡', branch:'craft', row:2,col:2, cost:280,  maxLevel:3, requires:['cr3','cr4'],  desc:'Garden grows 25% faster per level.',         effect:()=>{} },
  { id:'cr8',  name:'Potion Expert',   icon:'💊', branch:'craft', row:3,col:0, cost:550,  maxLevel:3, requires:['cr5'],        desc:'+3 extra ingredient yield per level.',        effect:()=>{} },
  { id:'cr9',  name:'Grandmaster',     icon:'🏆', branch:'craft', row:3,col:1, cost:550,  maxLevel:3, requires:['cr5','cr6'],  desc:'All craft bonuses doubled per level.',        effect:()=>{} },
  { id:'cr10', name:'Nature\'s Ally',  icon:'🌳', branch:'craft', row:3,col:2, cost:550,  maxLevel:3, requires:['cr6','cr7'],  desc:'Garden grows 40% faster per level.',         effect:()=>{} },
  { id:'cr11', name:'Legendary Brewer',icon:'🌟', branch:'craft', row:4,col:0, cost:1100, maxLevel:3, requires:['cr8'],        desc:'+5 extra ingredient yield per level.',        effect:()=>{} },
  { id:'cr12', name:'Philosopher',     icon:'🔬', branch:'craft', row:4,col:1, cost:1100, maxLevel:2, requires:['cr9'],        desc:'30% chance to brew triple potions per level.',effect:()=>{} },
  { id:'cr13', name:'World Tree',      icon:'🌲', branch:'craft', row:4,col:2, cost:1100, maxLevel:2, requires:['cr10'],       desc:'Garden grows 60% faster per level.',         effect:()=>{} },
  { id:'cr14', name:'Alchemical God',  icon:'⚡', branch:'craft', row:5,col:1, cost:3000, maxLevel:2, requires:['cr11','cr12','cr13'], desc:'All craft bonuses tripled. Garden instant-grows.', effect:()=>{} },

  // ══════════════════════════════════════════
  // 🛡️  RESILIENCE  — 14 nodes (survival/regen/defense)
  // ══════════════════════════════════════════
  { id:'re1',  name:'Second Wind',    icon:'🌬️', branch:'resilience', row:0,col:1, cost:80,   maxLevel:5, requires:[],              desc:'+2% HP regen rate per level.',              effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.02; } },
  { id:'re2',  name:'Bulwark',        icon:'🛡️', branch:'resilience', row:1,col:0, cost:120,  maxLevel:5, requires:['re1'],          desc:'+10 DEF per level.',                        effect:(p)=>{ p.def+=10; } },
  { id:'re3',  name:'Life Surge',     icon:'💉', branch:'resilience', row:1,col:1, cost:120,  maxLevel:5, requires:['re1'],          desc:'+3% HP regen rate per level.',              effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.03; } },
  { id:'re4',  name:'Iron Will',      icon:'🔩', branch:'resilience', row:1,col:2, cost:120,  maxLevel:4, requires:['re1'],          desc:'+80 Max HP per level.',                     effect:(p)=>{ p.maxHp+=80; p.hp=Math.min(p.hp+80,p.maxHp); } },
  { id:'re5',  name:'Stalwart',       icon:'⚓', branch:'resilience', row:2,col:0, cost:300,  maxLevel:4, requires:['re2'],          desc:'+20 DEF per level.',                        effect:(p)=>{ p.def+=20; } },
  { id:'re6',  name:'Rapid Recovery', icon:'⚕️', branch:'resilience', row:2,col:1, cost:300,  maxLevel:4, requires:['re2','re3'],    desc:'+5% HP regen rate per level.',              effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.05; } },
  { id:'re7',  name:'Fortified',      icon:'🏯', branch:'resilience', row:2,col:2, cost:300,  maxLevel:3, requires:['re3','re4'],    desc:'+150 Max HP per level.',                    effect:(p)=>{ p.maxHp+=150; p.hp=Math.min(p.hp+150,p.maxHp); } },
  { id:'re8',  name:'Unbreakable',    icon:'💪', branch:'resilience', row:3,col:0, cost:600,  maxLevel:3, requires:['re5'],          desc:'+35 DEF per level.',                        effect:(p)=>{ p.def+=35; } },
  { id:'re9',  name:'Bloodthirst',    icon:'🩸', branch:'resilience', row:3,col:1, cost:600,  maxLevel:3, requires:['re5','re6'],    desc:'+8% HP regen rate per level.',              effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.08; } },
  { id:'re10', name:'Colossus',       icon:'🗿', branch:'resilience', row:3,col:2, cost:600,  maxLevel:3, requires:['re6','re7'],    desc:'+300 Max HP per level.',                    effect:(p)=>{ p.maxHp+=300; p.hp=Math.min(p.hp+300,p.maxHp); } },
  { id:'re11', name:'Aegis',          icon:'🌀', branch:'resilience', row:4,col:0, cost:1200, maxLevel:3, requires:['re8'],          desc:'+60 DEF per level.',                        effect:(p)=>{ p.def+=60; } },
  { id:'re12', name:'Immortal Regen', icon:'♾️', branch:'resilience', row:4,col:1, cost:1200, maxLevel:2, requires:['re9'],          desc:'+15% HP regen rate per level.',             effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.15; } },
  { id:'re13', name:'Titan Shell',    icon:'🦕', branch:'resilience', row:4,col:2, cost:1200, maxLevel:2, requires:['re10'],         desc:'+500 Max HP per level.',                    effect:(p)=>{ p.maxHp+=500; p.hp=Math.min(p.hp+500,p.maxHp); } },
  { id:'re14', name:'Unkillable',     icon:'💀', branch:'resilience', row:5,col:1, cost:4000, maxLevel:2, requires:['re11','re12','re13'], desc:'+20% HP regen, +100 DEF, +1000 Max HP per level.', effect:(p)=>{ p.regenBonus=(p.regenBonus||0)+0.20; p.def+=100; p.maxHp+=1000; p.hp=Math.min(p.hp+1000,p.maxHp); } },

  // ══════════════════════════════════════════
  // 🔮  ARCANE  — 14 nodes (magic/spell power)
  // ══════════════════════════════════════════
  { id:'ar1',  name:'Mana Sense',     icon:'🔮', branch:'arcane', row:0,col:1, cost:80,   maxLevel:5, requires:[],              desc:'+8 ATK (spell power) per level.',           effect:(p)=>{ p.atk+=8; } },
  { id:'ar2',  name:'Arcane Flow',    icon:'🌊', branch:'arcane', row:1,col:0, cost:120,  maxLevel:5, requires:['ar1'],          desc:'+12 ATK per level.',                        effect:(p)=>{ p.atk+=12; } },
  { id:'ar3',  name:'Spell Weave',    icon:'🕸️', branch:'arcane', row:1,col:1, cost:120,  maxLevel:5, requires:['ar1'],          desc:'+10 ATK, +5 SPD per level.',                effect:(p)=>{ p.atk+=10; p.spd+=5; } },
  { id:'ar4',  name:'Mana Shield',    icon:'🛡️', branch:'arcane', row:1,col:2, cost:120,  maxLevel:4, requires:['ar1'],          desc:'+12 DEF per level.',                        effect:(p)=>{ p.def+=12; } },
  { id:'ar5',  name:'Ley Lines',      icon:'⚡', branch:'arcane', row:2,col:0, cost:300,  maxLevel:4, requires:['ar2'],          desc:'+20 ATK per level.',                        effect:(p)=>{ p.atk+=20; } },
  { id:'ar6',  name:'Arcane Surge',   icon:'💥', branch:'arcane', row:2,col:1, cost:300,  maxLevel:4, requires:['ar2','ar3'],    desc:'+25 ATK per level.',                        effect:(p)=>{ p.atk+=25; } },
  { id:'ar7',  name:'Runic Armor',    icon:'🔣', branch:'arcane', row:2,col:2, cost:300,  maxLevel:3, requires:['ar3','ar4'],    desc:'+20 DEF, +10 ATK per level.',               effect:(p)=>{ p.def+=20; p.atk+=10; } },
  { id:'ar8',  name:'Void Tap',       icon:'🌑', branch:'arcane', row:3,col:0, cost:600,  maxLevel:3, requires:['ar5'],          desc:'+40 ATK per level.',                        effect:(p)=>{ p.atk+=40; } },
  { id:'ar9',  name:'Spellstorm',     icon:'🌪️', branch:'arcane', row:3,col:1, cost:600,  maxLevel:3, requires:['ar5','ar6'],    desc:'+50 ATK per level.',                        effect:(p)=>{ p.atk+=50; } },
  { id:'ar10', name:'Arcane Fortress',icon:'🏰', branch:'arcane', row:3,col:2, cost:600,  maxLevel:3, requires:['ar6','ar7'],    desc:'+35 DEF, +20 ATK per level.',               effect:(p)=>{ p.def+=35; p.atk+=20; } },
  { id:'ar11', name:'Mana Overload',  icon:'☄️', branch:'arcane', row:4,col:0, cost:1200, maxLevel:3, requires:['ar8'],          desc:'+80 ATK per level.',                        effect:(p)=>{ p.atk+=80; } },
  { id:'ar12', name:'Arcane God',     icon:'🌟', branch:'arcane', row:4,col:1, cost:1200, maxLevel:2, requires:['ar9'],          desc:'+100 ATK per level.',                       effect:(p)=>{ p.atk+=100; } },
  { id:'ar13', name:'Runic Titan',    icon:'🗿', branch:'arcane', row:4,col:2, cost:1200, maxLevel:2, requires:['ar10'],         desc:'+60 DEF, +40 ATK per level.',               effect:(p)=>{ p.def+=60; p.atk+=40; } },
  { id:'ar14', name:'Omnimancer',     icon:'👁️', branch:'arcane', row:5,col:1, cost:4000, maxLevel:2, requires:['ar11','ar12','ar13'], desc:'+200 ATK, +100 DEF, +50 SPD per level.', effect:(p)=>{ p.atk+=200; p.def+=100; p.spd+=50; } },

  // ══════════════════════════════════════════
  // 🎒  SLOTS  — Expand equip slots up to 10
  // ══════════════════════════════════════════
  { id:'sl1', name:'Extra Pocket',    icon:'🎒', branch:'slots', row:0,col:1, cost:300,  maxLevel:1, requires:[],           desc:'Unlock slot 5. Equip one more technique.',  effect:()=>{} },
  { id:'sl2', name:'Technique Bag',   icon:'🗃️', branch:'slots', row:1,col:0, cost:600,  maxLevel:1, requires:['sl1'],      desc:'Unlock slot 6.',                            effect:()=>{} },
  { id:'sl3', name:'Arsenal',         icon:'⚔️', branch:'slots', row:1,col:2, cost:600,  maxLevel:1, requires:['sl1'],      desc:'Unlock slot 7.',                            effect:()=>{} },
  { id:'sl4', name:'War Chest',       icon:'📦', branch:'slots', row:2,col:0, cost:1200, maxLevel:1, requires:['sl2'],      desc:'Unlock slot 8.',                            effect:()=>{} },
  { id:'sl5', name:'Technique Vault', icon:'🏛️', branch:'slots', row:2,col:2, cost:1200, maxLevel:1, requires:['sl3'],      desc:'Unlock slot 9.',                            effect:()=>{} },
  { id:'sl6', name:'Infinite Arsenal',icon:'♾️', branch:'slots', row:3,col:1, cost:3000, maxLevel:1, requires:['sl4','sl5'],desc:'Unlock slot 10. Maximum capacity.',          effect:()=>{} },

];

const BRANCH_META = {
  combat:     { label: '⚔️ Combat',     color: '#e74c3c' },
  wealth:     { label: '💰 Wealth',     color: '#f5c542' },
  body:       { label: '❤️ Body',       color: '#2ecc71' },
  speed:      { label: '💨 Speed',      color: '#3498db' },
  mastery:    { label: '📚 Mastery',    color: '#a855f7' },
  luck:       { label: '🍀 Luck',       color: '#27ae60' },
  craft:      { label: '⚗️ Craft',      color: '#e67e22' },
  resilience: { label: '🛡️ Resilience', color: '#1abc9c' },
  arcane:     { label: '🔮 Arcane',     color: '#9b59b6' },
  slots:      { label: '🎒 Slots',      color: '#f39c12' },
};

// ── Computed upgrade values ──
function getUpgradeValue(key) {
  const n = G.player.skillNodes || {};
  switch (key) {
    case 'job_gold_mult': {
      const v = (n.w1||0)*0.15 + (n.w2||0)*0.20 + (n.w4||0)*0.15 + (n.w5||0)*0.30
              + (n.w7||0)*0.25 + (n.w8||0)*0.50 + (n.w9||0)*0.50 + (n.w11||0)*0.75
              + (n.w12||0)*1.0 + (n.w14||0)*2.0
              + (n.l2||0)*0.15 + (n.l5||0)*0.25 + (n.l8||0)*0.50 + (n.l9||0)*0.50
              + (n.l11||0)*1.0 + (n.l12||0)*1.0 + (n.l14||0)*2.0;
      return 1 + v;
    }
    case 'job_xp_mult': {
      const v = (n.m2||0)*0.15 + (n.m4||0)*0.12 + (n.m5||0)*0.25 + (n.m7||0)*0.20
              + (n.m8||0)*0.40 + (n.m9||0)*0.50 + (n.m11||0)*0.75 + (n.m12||0)*1.0
              + (n.m14||0)*2.0;
      return 1 + v;
    }
    case 'job_speed_mult': {
      const v = (n.w3||0)*0.10 + (n.w6||0)*0.15 + (n.w10||0)*0.20 + (n.w13||0)*0.30 + (n.w14||0)*0.40;
      return Math.max(0.1, 1 - v);
    }
    case 'train_gain_mult': {
      const v = (n.m1||0)*0.10 + (n.m4||0)*0.12;
      return 1 + v;
    }
    case 'train_xp_mult': {
      const v = (n.m1||0)*0.10 + (n.m2||0)*0.15 + (n.m4||0)*0.12 + (n.m5||0)*0.25
              + (n.m7||0)*0.20 + (n.m8||0)*0.40 + (n.m9||0)*0.50 + (n.m11||0)*0.75
              + (n.m12||0)*1.0 + (n.m14||0)*2.0;
      return 1 + v;
    }
    case 'train_speed_mult': {
      const v = (n.m3||0)*0.10 + (n.m6||0)*0.20 + (n.m7||0)*0.15 + (n.m9||0)*0.30
              + (n.m10||0)*0.35 + (n.m13||0)*0.50 + (n.m14||0)*0.60;
      return Math.max(0.1, 1 - v);
    }
    default: return 1;
  }
}

function getNodeLevel(id) { return (G.player.skillNodes && G.player.skillNodes[id]) || 0; }

function getNodeCost(node) {
  return Math.floor(node.cost * Math.pow(1.5, getNodeLevel(node.id)));
}

function canUnlockNode(node) {
  if (getNodeLevel(node.id) >= node.maxLevel) return false;
  if (G.player.gold < getNodeCost(node)) return false;
  for (const req of node.requires) {
    if (getNodeLevel(req) < 1) return false;
  }
  return true;
}

function buySkillNode(nodeId) {
  const node = SKILL_TREE.find(n => n.id === nodeId);
  if (!node) return;
  if (!canUnlockNode(node)) { toast('Cannot unlock — check requirements or gold.', 'warn'); return; }
  const cost = getNodeCost(node);
  if (!spendGold(cost)) { toast('Not enough gold!', 'warn'); return; }
  if (!G.player.skillNodes) G.player.skillNodes = {};
  G.player.skillNodes[nodeId] = (G.player.skillNodes[nodeId] || 0) + 1;
  // Recalculate all stats from scratch so bonuses stack correctly and persist through level-ups
  recalcStats();
  G.player.hp = Math.min(G.player.hp, G.player.maxHp);
  G.player.stamina = Math.min(G.player.stamina, G.player.maxStamina);
  toast(`Upgraded: ${node.name} (Lv.${G.player.skillNodes[nodeId]})`, 'success');
  spawnFloatingText(`-${cost}g`, 'float-dmg');
  renderSkillTree();
  renderJobs();
}

// ── Dig helpers ──
function getMaxDigCharges() {
  return 5 + ((G.player.shopPurchases && G.player.shopPurchases['dig_cap']) || 0) * 2;
}

// ── Equip slot helpers ──
function getMaxEquipSlots() {
  const n = G.player.skillNodes || {};
  // Base 4 slots + 1 per slot upgrade purchased
  return 4
    + (n.sl1 ? 1 : 0)
    + (n.sl2 ? 1 : 0)
    + (n.sl3 ? 1 : 0)
    + (n.sl4 ? 1 : 0)
    + (n.sl5 ? 1 : 0)
    + (n.sl6 ? 1 : 0);
}
function getDigRegenRate() {
  const base = 60;
  const speedLevel = (G.player.shopPurchases && G.player.shopPurchases['dig_speed']) || 0;
  return Math.floor(base * Math.pow(0.75, speedLevel));
}
function getDigLuckBonus() {
  return ((G.player.shopPurchases && G.player.shopPurchases['dig_luck']) || 0) * 0.15;
}

// ── Render ──
let activeSkillBranch = 'combat';

function renderSkillTree() {
  const container = document.getElementById('skill-tree-container');
  if (!container) return;

  const tabsEl = document.getElementById('skill-branch-tabs');
  if (tabsEl) {
    tabsEl.innerHTML = Object.entries(BRANCH_META).map(([key, meta]) => `
      <button class="skill-branch-tab${activeSkillBranch === key ? ' active' : ''}"
        style="--branch-color:${meta.color}"
        onclick="setSkillBranch('${key}')">${meta.label}</button>
    `).join('');
  }

  const branchNodes = SKILL_TREE.filter(n => n.branch === activeSkillBranch);
  const meta  = BRANCH_META[activeSkillBranch];
  const color = meta.color;

  const NODE_R  = 36;
  const COL_GAP = 140;
  const ROW_GAP = 110;
  const PAD     = 30;

  const maxRow = Math.max(...branchNodes.map(n => n.row));
  const maxCol = Math.max(...branchNodes.map(n => n.col));
  const W = (maxCol + 1) * COL_GAP + PAD * 2;
  const H = (maxRow + 1) * ROW_GAP + PAD * 2;

  const pos = {};
  branchNodes.forEach(n => {
    pos[n.id] = {
      x: PAD + n.col * COL_GAP + COL_GAP / 2,
      y: PAD + n.row * ROW_GAP + ROW_GAP / 2,
    };
  });

  let svgLines = '';
  branchNodes.forEach(node => {
    node.requires.forEach(reqId => {
      const from = pos[reqId];
      const to   = pos[node.id];
      if (!from || !to) return;
      const active = getNodeLevel(reqId) >= 1;
      svgLines += `<line class="skill-svg-line${active ? ' line-active' : ''}"
        x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}"
        style="${active ? `stroke:${color};opacity:0.7` : ''}"/>`;
    });
  });

  let nodesHtml = '';
  branchNodes.forEach(node => {
    const p      = pos[node.id];
    const owned  = getNodeLevel(node.id);
    const maxed  = owned >= node.maxLevel;
    const canBuy = canUnlockNode(node);
    const cost   = getNodeCost(node);
    const locked = node.requires.some(req => getNodeLevel(req) < 1);
    const cls = ['skill-node', maxed ? 'node-maxed' : '', canBuy ? 'node-available' : '', locked ? 'node-locked' : ''].filter(Boolean).join(' ');
    const tip = `${node.name} (${owned}/${node.maxLevel}) — ${node.desc} — Cost: ${maxed ? 'Maxed' : cost + 'g'}`;
    nodesHtml += `<div class="${cls}"
      style="position:absolute;left:${p.x-NODE_R}px;top:${p.y-NODE_R}px;width:${NODE_R*2}px;height:${NODE_R*2}px;
             ${maxed ? `border-color:${color};box-shadow:0 0 12px ${color}55` : canBuy ? `border-color:${color}` : ''}"
      onclick="buySkillNode('${node.id}')" data-tooltip="${tip.replace(/"/g,'&quot;')}">
      <div class="node-icon">${node.icon}</div>
      <div class="node-name">${node.name}</div>
      <div class="node-level">${maxed ? '✓' : `${owned}/${node.maxLevel}`}</div>
      <div class="node-cost" style="color:${maxed ? '#27ae60' : color}">${maxed ? '' : `💰${cost}`}</div>
    </div>`;
  });

  container.innerHTML = `
    <div style="overflow-x:auto;overflow-y:auto;max-height:600px;padding-bottom:10px">
      <div style="position:relative;width:${W}px;height:${H}px;min-width:${W}px">
        <svg width="${W}" height="${H}" style="position:absolute;top:0;left:0;pointer-events:none">
          ${svgLines}
        </svg>
        ${nodesHtml}
      </div>
    </div>`;
}

function setSkillBranch(branch) {
  activeSkillBranch = branch;
  renderSkillTree();
}

function renderShop() { renderSkillTree(); }
