// ===== SKILL TREE =====

const SKILL_TREE = [
  { id:'c1',  name:'Sharp Edge',      icon:'🗡️', branch:'combat', row:0,col:1, cost:125,  maxLevel:5, requires:[],           desc:'+10 ATK per level.',                         effect:(p)=>{ p.atk+=10; } },
  { id:'c2',  name:'Iron Guard',      icon:'🛡️', branch:'combat', row:1,col:0, cost:200,  maxLevel:5, requires:['c1'],       desc:'+6 DEF per level.',                         effect:(p)=>{ p.def+=6; } },
  { id:'c3',  name:'Berserker',       icon:'😤', branch:'combat', row:1,col:1, cost:200,  maxLevel:5, requires:['c1'],       desc:'+8 ATK, -2 DEF per level.',                 effect:(p)=>{ p.atk+=8; p.def=Math.max(0,p.def-2); } },
  { id:'c4',  name:'Blade Dancer',    icon:'💃', branch:'combat', row:1,col:2, cost:200,  maxLevel:5, requires:['c1'],       desc:'+5 ATK, +3 SPD per level.',                 effect:(p)=>{ p.atk+=5; p.spd+=3; } },
  { id:'c5',  name:'Parry Master',    icon:'⚔️', branch:'combat', row:2,col:0, cost:375,  maxLevel:4, requires:['c2'],       desc:'+10 DEF, +5 ATK per level.',                effect:(p)=>{ p.def+=10; p.atk+=5; } },
  { id:'c6',  name:'Crit Mastery',    icon:'💥', branch:'combat', row:2,col:1, cost:375,  maxLevel:4, requires:['c3'],       desc:'+15 ATK per level.',                        effect:(p)=>{ p.atk+=15; } },
  { id:'c7',  name:'Phantom Step',    icon:'👻', branch:'combat', row:2,col:2, cost:375,  maxLevel:4, requires:['c4'],       desc:'+8 SPD, +8 ATK per level.',                 effect:(p)=>{ p.spd+=8; p.atk+=8; } },
  { id:'c8',  name:'Steel Fortress',  icon:'🏰', branch:'combat', row:3,col:0, cost:750,  maxLevel:3, requires:['c5'],       desc:'+20 DEF per level.',                        effect:(p)=>{ p.def+=20; } },
  { id:'c9',  name:'Warlord\'s Might',icon:'👑', branch:'combat', row:3,col:1, cost:750,  maxLevel:3, requires:['c5','c6'],  desc:'+25 ATK, +15 DEF per level.',               effect:(p)=>{ p.atk+=25; p.def+=15; } },
  { id:'c10', name:'Assassin\'s Edge',icon:'🗡️', branch:'combat', row:3,col:2, cost:750,  maxLevel:3, requires:['c6','c7'],  desc:'+30 ATK, +10 SPD per level.',               effect:(p)=>{ p.atk+=30; p.spd+=10; } },
  { id:'c11', name:'Titan\'s Fist',   icon:'🦾', branch:'combat', row:4,col:0, cost:1500, maxLevel:3, requires:['c8'],       desc:'+20 DEF, +10 ATK per level.',               effect:(p)=>{ p.def+=20; p.atk+=10; } },
  { id:'c12', name:'Warbringer',      icon:'⚡', branch:'combat', row:4,col:1, cost:1500, maxLevel:3, requires:['c9'],       desc:'+25 ATK per level.',                        effect:(p)=>{ p.atk+=25; } },
  { id:'c13', name:'Shadow Reaper',   icon:'💀', branch:'combat', row:4,col:2, cost:1500, maxLevel:3, requires:['c10'],      desc:'+20 ATK, +10 SPD per level.',               effect:(p)=>{ p.atk+=20; p.spd+=10; } },
  { id:'c14', name:'God of War',      icon:'🔱', branch:'combat', row:5,col:1, cost:5000, maxLevel:2, requires:['c11','c12','c13'], desc:'+10 ATK, +8 DEF, +5 SPD per level.', effect:(p)=>{ p.atk+=10; p.def+=8; p.spd+=5; } },

  { id:'w1',  name:'Coin Sense',      icon:'🪙', branch:'wealth', row:0,col:1, cost:150,  maxLevel:5, requires:[],           desc:'+15% gold from jobs, +2 gold/cycle per level.',            effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w2',  name:'Merchant Eye',    icon:'👁️', branch:'wealth', row:1,col:0, cost:250,  maxLevel:5, requires:['w1'],       desc:'+20% gold from all sources, +2 gold/cycle per level.',     effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w3',  name:'Fast Hands',      icon:'🤲', branch:'wealth', row:1,col:1, cost:250,  maxLevel:5, requires:['w1'],       desc:'Job cycles 10% faster, +2 gold/cycle per level.',          effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w4',  name:'Haggler',         icon:'🤝', branch:'wealth', row:1,col:2, cost:250,  maxLevel:4, requires:['w1'],       desc:'+10% gold from all sources, +2 gold/cycle per level.',     effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w5',  name:'Trade Empire',    icon:'🏦', branch:'wealth', row:2,col:0, cost:625,  maxLevel:4, requires:['w2'],       desc:'+30% gold from jobs, +2 gold/cycle per level.',            effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w6',  name:'Efficiency',      icon:'⚙️', branch:'wealth', row:2,col:1, cost:625,  maxLevel:4, requires:['w3'],       desc:'Job cycles 15% faster, +2 gold/cycle per level.',          effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w7',  name:'Black Market',    icon:'🕵️', branch:'wealth', row:2,col:2, cost:625,  maxLevel:3, requires:['w4'],       desc:'+25% gold from all sources, +2 gold/cycle per level.',     effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w8',  name:'Monopoly',        icon:'🏛️', branch:'wealth', row:3,col:0, cost:1250, maxLevel:3, requires:['w5'],       desc:'+50% gold from jobs, +2 gold/cycle per level.',            effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w9',  name:'Tycoon',          icon:'💎', branch:'wealth', row:3,col:1, cost:1250, maxLevel:3, requires:['w5','w6'],  desc:'+50% gold from all sources, +2 gold/cycle per level.',     effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w10', name:'Speed Merchant',  icon:'🚀', branch:'wealth', row:3,col:2, cost:1250, maxLevel:3, requires:['w6','w7'],  desc:'Job cycles 20% faster, +2 gold/cycle per level.',          effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w11', name:'Gold Rush',       icon:'⛏️', branch:'wealth', row:4,col:0, cost:2500, maxLevel:3, requires:['w8'],       desc:'+75% gold from jobs, +2 gold/cycle per level.',            effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w12', name:'Infinite Wealth', icon:'♾️', branch:'wealth', row:4,col:1, cost:2500, maxLevel:2, requires:['w9'],       desc:'+100% gold from all sources, +2 gold/cycle per level.',    effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w13', name:'Turbo Worker',    icon:'⚡', branch:'wealth', row:4,col:2, cost:2500, maxLevel:2, requires:['w10'],      desc:'Job cycles 30% faster, +2 gold/cycle per level.',          effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },
  { id:'w14', name:'Billionaire',     icon:'🤑', branch:'wealth', row:5,col:1, cost:7500, maxLevel:2, requires:['w11','w12','w13'], desc:'+200% gold, cycles 40% faster, +2 gold/cycle per level.', effect:(p)=>{ p.goldPerCycle=(p.goldPerCycle||0)+2; } },

  { id:'b1',  name:'Tough Skin',      icon:'🩹', branch:'body', row:0,col:1, cost:125,  maxLevel:5, requires:[],           desc:'+20 Max HP, +7 DEF, +1% passive HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.maxHp+=20; p.hp=Math.min(p.hp+20,p.maxHp); p.def+=7; p.regenBonus=Math.min((p.regenBonus||0)+0.01,0.40); } },
  { id:'b2',  name:'Iron Lungs',      icon:'💨', branch:'body', row:1,col:0, cost:200,  maxLevel:5, requires:['b1'],       desc:'+25 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=25; } },
  { id:'b3',  name:'Vitality',        icon:'❤️', branch:'body', row:1,col:1, cost:200,  maxLevel:5, requires:['b1'],       desc:'+60 Max HP per level.',                     effect:(p)=>{ p.maxHp+=60; p.hp=Math.min(p.hp+60,p.maxHp); } },
  { id:'b4',  name:'Thick Hide',      icon:'🦏', branch:'body', row:1,col:2, cost:200,  maxLevel:5, requires:['b1'],       desc:'+8 DEF per level.',                         effect:(p)=>{ p.def+=8; } },
  { id:'b5',  name:'Endurance',       icon:'🏃', branch:'body', row:2,col:0, cost:500,  maxLevel:4, requires:['b2'],       desc:'+40 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=40; } },
  { id:'b6',  name:'Giant\'s Blood',  icon:'🩸', branch:'body', row:2,col:1, cost:500,  maxLevel:4, requires:['b3'],       desc:'+100 Max HP per level.',                    effect:(p)=>{ p.maxHp+=100; p.hp=Math.min(p.hp+100,p.maxHp); } },
  { id:'b7',  name:'Stone Skin',      icon:'🪨', branch:'body', row:2,col:2, cost:500,  maxLevel:4, requires:['b4'],       desc:'+15 DEF per level.',                        effect:(p)=>{ p.def+=15; } },
  { id:'b_r1',name:'Fast Healer',     icon:'💊', branch:'body', row:1,col:3, cost:250,  maxLevel:5, requires:['b1'],       desc:'+2% HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.02,0.40); } },
  { id:'b_r2',name:'Regeneration',    icon:'🔄', branch:'body', row:2,col:3, cost:625,  maxLevel:4, requires:['b_r1'],     desc:'+3% HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.03,0.40); } },
  { id:'b_r3',name:'Troll Blood',     icon:'🧬', branch:'body', row:3,col:3, cost:1250, maxLevel:3, requires:['b_r2'],     desc:'+5% HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.05,0.40); } },
  { id:'b_r4',name:'Undying',         icon:'♻️', branch:'body', row:4,col:3, cost:3000, maxLevel:2, requires:['b_r3'],     desc:'+10% HP regen rate per level (regen capped at 40%).', effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.10,0.40); } },
  { id:'b8',  name:'Marathon Runner', icon:'🏅', branch:'body', row:3,col:0, cost:1000, maxLevel:3, requires:['b5'],       desc:'+80 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=80; } },
  { id:'b9',  name:'Immortal Body',   icon:'✨', branch:'body', row:3,col:1, cost:1000, maxLevel:3, requires:['b5','b6'],  desc:'+200 Max HP, +80 Stamina per level.',       effect:(p)=>{ p.maxHp+=200; p.maxStamina+=80; p.hp=Math.min(p.hp+200,p.maxHp); } },
  { id:'b10', name:'Diamond Skin',    icon:'💎', branch:'body', row:3,col:2, cost:1000, maxLevel:3, requires:['b6','b7'],  desc:'+25 DEF, +50 HP per level.',                effect:(p)=>{ p.def+=25; p.maxHp+=50; p.hp=Math.min(p.hp+50,p.maxHp); } },
  { id:'b11', name:'Infinite Stamina',icon:'⚡', branch:'body', row:4,col:0, cost:2000, maxLevel:3, requires:['b8'],       desc:'+150 Max Stamina per level.',               effect:(p)=>{ p.maxStamina+=150; } },
  { id:'b12', name:'Titan\'s Body',   icon:'🦾', branch:'body', row:4,col:1, cost:2000, maxLevel:3, requires:['b9'],       desc:'+400 Max HP per level.',                    effect:(p)=>{ p.maxHp+=400; p.hp=Math.min(p.hp+400,p.maxHp); } },
  { id:'b13', name:'Fortress',        icon:'🏰', branch:'body', row:4,col:2, cost:2000, maxLevel:3, requires:['b10'],      desc:'+50 DEF per level.',                        effect:(p)=>{ p.def+=50; } },
  { id:'b14', name:'Demigod\'s Form', icon:'🌟', branch:'body', row:5,col:1, cost:6250, maxLevel:2, requires:['b11','b12','b13'], desc:'+500 Max HP, +150 Stamina, +40 DEF per level.', effect:(p)=>{ p.maxHp+=500; p.maxStamina+=150; p.def+=40; p.hp=Math.min(p.hp+500,p.maxHp); } },
  { id:'b15', name:'Phoenix Soul',    icon:'🔥', branch:'body', row:5,col:3, cost:7500, maxLevel:2, requires:['b_r4','b12'], desc:'+8% HP regen rate, +250 Max HP per level (regen capped at 40%).', effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.08,0.40); p.maxHp+=250; p.hp=Math.min(p.hp+250,p.maxHp); } },

  { id:'s1',  name:'Quick Feet',      icon:'👟', branch:'speed', row:0,col:1, cost:125,  maxLevel:5, requires:[],           desc:'+4 SPD per level.',                         effect:(p)=>{ p.spd+=4; } },
  { id:'s2',  name:'Agility',         icon:'🌪️', branch:'speed', row:1,col:0, cost:200,  maxLevel:5, requires:['s1'],       desc:'+6 SPD per level.',                         effect:(p)=>{ p.spd+=6; } },
  { id:'s3',  name:'Wind Step',       icon:'💨', branch:'speed', row:1,col:1, cost:200,  maxLevel:5, requires:['s1'],       desc:'+3 SPD, +6 ATK per level.',                 effect:(p)=>{ p.spd+=3; p.atk+=6; } },
  { id:'s4',  name:'Reflex',          icon:'⚡', branch:'speed', row:1,col:2, cost:200,  maxLevel:4, requires:['s1'],       desc:'+8 SPD per level.',                         effect:(p)=>{ p.spd+=8; } },
  { id:'s5',  name:'Ghost Walk',      icon:'👻', branch:'speed', row:2,col:0, cost:500,  maxLevel:4, requires:['s2'],       desc:'+12 SPD per level.',                        effect:(p)=>{ p.spd+=12; } },
  { id:'s6',  name:'Blur',            icon:'🌀', branch:'speed', row:2,col:1, cost:500,  maxLevel:4, requires:['s2','s3'],  desc:'+6 SPD, +10 ATK per level.',                effect:(p)=>{ p.spd+=6; p.atk+=10; } },
  { id:'s7',  name:'Lightning Body',  icon:'🌩️', branch:'speed', row:2,col:2, cost:500,  maxLevel:4, requires:['s3','s4'],  desc:'+15 SPD per level.',                        effect:(p)=>{ p.spd+=15; } },
  { id:'s8',  name:'Teleport Step',   icon:'🔵', branch:'speed', row:3,col:0, cost:1000, maxLevel:3, requires:['s5'],       desc:'+25 SPD per level.',                        effect:(p)=>{ p.spd+=25; } },
  { id:'s9',  name:'Sonic Strike',    icon:'💫', branch:'speed', row:3,col:1, cost:1000, maxLevel:3, requires:['s5','s6'],  desc:'+20 SPD, +20 ATK per level.',               effect:(p)=>{ p.spd+=20; p.atk+=20; } },
  { id:'s10', name:'Time Slip',       icon:'⏱️', branch:'speed', row:3,col:2, cost:1000, maxLevel:3, requires:['s6','s7'],  desc:'+30 SPD per level.',                        effect:(p)=>{ p.spd+=30; } },
  { id:'s11', name:'Void Dash',       icon:'🌑', branch:'speed', row:4,col:0, cost:2000, maxLevel:3, requires:['s8'],       desc:'+25 SPD per level.',                        effect:(p)=>{ p.spd+=25; } },
  { id:'s12', name:'Blitz',           icon:'⚡', branch:'speed', row:4,col:1, cost:2000, maxLevel:3, requires:['s9'],       desc:'+20 SPD, +20 ATK per level.',               effect:(p)=>{ p.spd+=20; p.atk+=20; } },
  { id:'s13', name:'Phase Shift',     icon:'🔮', branch:'speed', row:4,col:2, cost:2000, maxLevel:3, requires:['s10'],      desc:'+30 SPD per level.',                        effect:(p)=>{ p.spd+=30; } },
  { id:'s14', name:'Speed of Light',  icon:'☀️', branch:'speed', row:5,col:1, cost:6250, maxLevel:2, requires:['s11','s12','s13'], desc:'+75 SPD, +40 ATK per level.',        effect:(p)=>{ p.spd+=75; p.atk+=40; } },

  { id:'m1',  name:'Student',         icon:'📖', branch:'mastery', row:0,col:1, cost:150,  maxLevel:5, requires:[],           desc:'+10% XP from training, +5% flat XP per level.',          effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m2',  name:'Scholar',         icon:'📚', branch:'mastery', row:1,col:0, cost:250,  maxLevel:5, requires:['m1'],       desc:'+15% XP from all sources, +5% flat XP per level.',       effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m3',  name:'Quick Learner',   icon:'⚡', branch:'mastery', row:1,col:1, cost:250,  maxLevel:5, requires:['m1'],       desc:'Training 10% faster, +5% flat XP per level.',            effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m4',  name:'Focused Mind',    icon:'🧠', branch:'mastery', row:1,col:2, cost:250,  maxLevel:4, requires:['m1'],       desc:'+12% XP from all sources, +5% flat XP per level.',       effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m5',  name:'Prodigy',         icon:'🌟', branch:'mastery', row:2,col:0, cost:625,  maxLevel:4, requires:['m2'],       desc:'+25% XP from all sources, +5% flat XP per level.',       effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m6',  name:'Accelerated',     icon:'🚀', branch:'mastery', row:2,col:1, cost:625,  maxLevel:4, requires:['m2','m3'],  desc:'Training 20% faster, +5% flat XP per level.',            effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m7',  name:'Genius',          icon:'💡', branch:'mastery', row:2,col:2, cost:625,  maxLevel:3, requires:['m3','m4'],  desc:'+20% XP, training 15% faster, +5% flat XP per level.',   effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m8',  name:'Sage',            icon:'🧙', branch:'mastery', row:3,col:0, cost:1250, maxLevel:3, requires:['m5'],       desc:'+40% XP from all sources, +5% flat XP per level.',       effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m9',  name:'Transcendent',    icon:'🔮', branch:'mastery', row:3,col:1, cost:1250, maxLevel:3, requires:['m5','m6'],  desc:'+50% XP, training 30% faster, +5% flat XP per level.',   effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m10', name:'Hyperfocus',      icon:'🎯', branch:'mastery', row:3,col:2, cost:1250, maxLevel:3, requires:['m6','m7'],  desc:'Training 35% faster, +5% flat XP per level.',            effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m11', name:'Enlightened',     icon:'☀️', branch:'mastery', row:4,col:0, cost:2500, maxLevel:3, requires:['m8'],       desc:'+75% XP from all sources, +5% flat XP per level.',       effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m12', name:'Ascended',        icon:'🌌', branch:'mastery', row:4,col:1, cost:2500, maxLevel:2, requires:['m9'],       desc:'+100% XP from all sources, +5% flat XP per level.',      effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m13', name:'Instant Master',  icon:'⚡', branch:'mastery', row:4,col:2, cost:2500, maxLevel:2, requires:['m10'],      desc:'Training 50% faster, +5% flat XP per level.',            effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },
  { id:'m14', name:'Omniscient',      icon:'👁️', branch:'mastery', row:5,col:1, cost:7500, maxLevel:2, requires:['m11','m12','m13'], desc:'+200% XP, training 60% faster, +5% flat XP per level.', effect:(p)=>{ p.xpBonus=(p.xpBonus||0)+0.05; } },

  { id:'l1',  name:'Lucky Find',      icon:'🍀', branch:'luck', row:0,col:1, cost:200,  maxLevel:5, requires:[],           desc:'+10% dig loot quality, +2% flat luck per level.',          effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l2',  name:'Treasure Sense',  icon:'🗺️', branch:'luck', row:1,col:0, cost:300,  maxLevel:5, requires:['l1'],       desc:'+15% gold from all sources, +2% flat luck per level.',     effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l3',  name:'Fortune\'s Eye',  icon:'👁️', branch:'luck', row:1,col:1, cost:300,  maxLevel:5, requires:['l1'],       desc:'+15% rare drop chance, +2% flat luck per level.',          effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l4',  name:'Rabbit\'s Foot',  icon:'🐇', branch:'luck', row:1,col:2, cost:300,  maxLevel:4, requires:['l1'],       desc:'+20% dig loot quality, +2% flat luck per level.',          effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l5',  name:'Windfall',        icon:'💸', branch:'luck', row:2,col:0, cost:750,  maxLevel:4, requires:['l2'],       desc:'+25% gold from jobs, +2% flat luck per level.',            effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l6',  name:'Gem Sight',       icon:'💎', branch:'luck', row:2,col:1, cost:750,  maxLevel:4, requires:['l2','l3'],  desc:'+30% dig loot quality, +2% flat luck per level.',          effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l7',  name:'Clover Field',    icon:'🌿', branch:'luck', row:2,col:2, cost:750,  maxLevel:3, requires:['l3','l4'],  desc:'+25% rare drop chance, +2% flat luck per level.',          effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l8',  name:'Gold Magnet',     icon:'🧲', branch:'luck', row:3,col:0, cost:1500, maxLevel:3, requires:['l5'],       desc:'+50% gold from all sources, +2% flat luck per level.',     effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l9',  name:'Midas Touch',     icon:'✨', branch:'luck', row:3,col:1, cost:1500, maxLevel:3, requires:['l5','l6'],  desc:'+50% gold, +50% dig quality, +2% flat luck per level.',    effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l10', name:'Legendary Luck',  icon:'🌈', branch:'luck', row:3,col:2, cost:1500, maxLevel:3, requires:['l6','l7'],  desc:'+40% rare drop chance, +2% flat luck per level.',          effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l11', name:'Treasure Hunter', icon:'🏴‍☠️', branch:'luck', row:4,col:0, cost:3000, maxLevel:3, requires:['l8'],       desc:'+100% gold from all sources, +2% flat luck per level.',    effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l12', name:'Fortune\'s Heir', icon:'👑', branch:'luck', row:4,col:1, cost:3000, maxLevel:2, requires:['l9'],       desc:'+100% gold, +100% dig quality, +2% flat luck per level.',  effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l13', name:'Fate Weaver',     icon:'🕸️', branch:'luck', row:4,col:2, cost:3000, maxLevel:2, requires:['l10'],      desc:'+60% rare drop chance, +2% flat luck per level.',          effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },
  { id:'l14', name:'Child of Fortune',icon:'🌟', branch:'luck', row:5,col:1, cost:8750, maxLevel:2, requires:['l11','l12','l13'], desc:'+200% gold, +100% dig quality, +2% flat luck per level.', effect:(p)=>{ p.luckBonus=(p.luckBonus||0)+0.02; } },

  { id:'cr1',  name:'Herbalist',       icon:'🌿', branch:'craft', row:0,col:1, cost:175,  maxLevel:5, requires:[],             desc:'Garden grows 10% faster per level.',        effect:(p)=>{ p.craftGrowthSpeed=(p.craftGrowthSpeed||0)+0.10; } },
  { id:'cr2',  name:'Alchemist',       icon:'⚗️', branch:'craft', row:1,col:0, cost:275,  maxLevel:5, requires:['cr1'],        desc:'+1 extra ingredient yield per level.',       effect:(p)=>{ p.craftIngredientYield=(p.craftIngredientYield||0)+1; } },
  { id:'cr3',  name:'Brewer',          icon:'🧪', branch:'craft', row:1,col:1, cost:275,  maxLevel:5, requires:['cr1'],        desc:'10% chance to save ingredients per level.',  effect:(p)=>{ p.craftBrewSaveChance=(p.craftBrewSaveChance||0)+0.10; } },
  { id:'cr4',  name:'Green Thumb',     icon:'🌱', branch:'craft', row:1,col:2, cost:275,  maxLevel:4, requires:['cr1'],        desc:'Garden grows 15% faster per level.',         effect:(p)=>{ p.craftGrowthSpeed=(p.craftGrowthSpeed||0)+0.15; } },
  { id:'cr5',  name:'Master Herbalist',icon:'🌺', branch:'craft', row:2,col:0, cost:700,  maxLevel:4, requires:['cr2'],        desc:'+2 extra ingredient yield per level.',        effect:(p)=>{ p.craftIngredientYield=(p.craftIngredientYield||0)+2; } },
  { id:'cr6',  name:'Grand Brewer',    icon:'🔮', branch:'craft', row:2,col:1, cost:700,  maxLevel:4, requires:['cr2','cr3'],  desc:'20% chance to brew double potions per level.',effect:(p)=>{ p.craftDoubleBrewChance=(p.craftDoubleBrewChance||0)+0.20; } },
  { id:'cr7',  name:'Garden Master',   icon:'🏡', branch:'craft', row:2,col:2, cost:700,  maxLevel:3, requires:['cr3','cr4'],  desc:'Garden grows 25% faster per level.',         effect:(p)=>{ p.craftGrowthSpeed=(p.craftGrowthSpeed||0)+0.25; } },
  { id:'cr8',  name:'Potion Expert',   icon:'💊', branch:'craft', row:3,col:0, cost:1375, maxLevel:3, requires:['cr5'],        desc:'+3 extra ingredient yield per level.',        effect:(p)=>{ p.craftIngredientYield=(p.craftIngredientYield||0)+3; } },
  { id:'cr9',  name:'Grandmaster',     icon:'🏆', branch:'craft', row:3,col:1, cost:1375, maxLevel:3, requires:['cr5','cr6'],  desc:'All craft bonuses doubled per level.',        effect:(p)=>{ p.craftAllBonus=(p.craftAllBonus||0)+0.50; } },
  { id:'cr10', name:'Nature\'s Ally',  icon:'🌳', branch:'craft', row:3,col:2, cost:1375, maxLevel:3, requires:['cr6','cr7'],  desc:'Garden grows 40% faster per level.',         effect:(p)=>{ p.craftGrowthSpeed=(p.craftGrowthSpeed||0)+0.40; } },
  { id:'cr11', name:'Legendary Brewer',icon:'🌟', branch:'craft', row:4,col:0, cost:2750, maxLevel:3, requires:['cr8'],        desc:'+5 extra ingredient yield per level.',        effect:(p)=>{ p.craftIngredientYield=(p.craftIngredientYield||0)+5; } },
  { id:'cr12', name:'Philosopher',     icon:'🔬', branch:'craft', row:4,col:1, cost:2750, maxLevel:2, requires:['cr9'],        desc:'30% chance to brew triple potions per level.',effect:(p)=>{ p.craftTripleBrewChance=(p.craftTripleBrewChance||0)+0.30; } },
  { id:'cr13', name:'World Tree',      icon:'🌲', branch:'craft', row:4,col:2, cost:2750, maxLevel:2, requires:['cr10'],       desc:'Garden grows 60% faster per level.',         effect:(p)=>{ p.craftGrowthSpeed=(p.craftGrowthSpeed||0)+0.60; } },
  { id:'cr14', name:'Alchemical God',  icon:'⚡', branch:'craft', row:5,col:1, cost:7500, maxLevel:2, requires:['cr11','cr12','cr13'], desc:'All craft bonuses tripled. Garden instant-grows.', effect:(p)=>{ p.craftTripleBonus=true; } },

  { id:'re1',  name:'Second Wind',    icon:'🌬️', branch:'resilience', row:0,col:1, cost:200,  maxLevel:5, requires:[],              desc:'+2% HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.02,0.40); } },
  { id:'re2',  name:'Bulwark',        icon:'🛡️', branch:'resilience', row:1,col:0, cost:300,  maxLevel:5, requires:['re1'],          desc:'+10 DEF per level.',                        effect:(p)=>{ p.def+=10; } },
  { id:'re3',  name:'Life Surge',     icon:'💉', branch:'resilience', row:1,col:1, cost:300,  maxLevel:5, requires:['re1'],          desc:'+3% HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.03,0.40); } },
  { id:'re4',  name:'Iron Will',      icon:'🔩', branch:'resilience', row:1,col:2, cost:300,  maxLevel:4, requires:['re1'],          desc:'+80 Max HP per level.',                     effect:(p)=>{ p.maxHp+=80; p.hp=Math.min(p.hp+80,p.maxHp); } },
  { id:'re5',  name:'Stalwart',       icon:'⚓', branch:'resilience', row:2,col:0, cost:750,  maxLevel:4, requires:['re2'],          desc:'+20 DEF per level.',                        effect:(p)=>{ p.def+=20; } },
  { id:'re6',  name:'Rapid Recovery', icon:'⚕️', branch:'resilience', row:2,col:1, cost:750,  maxLevel:4, requires:['re2','re3'],    desc:'+5% HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.05,0.40); } },
  { id:'re7',  name:'Fortified',      icon:'🏯', branch:'resilience', row:2,col:2, cost:750,  maxLevel:3, requires:['re3','re4'],    desc:'+150 Max HP per level.',                    effect:(p)=>{ p.maxHp+=150; p.hp=Math.min(p.hp+150,p.maxHp); } },
  { id:'re8',  name:'Unbreakable',    icon:'💪', branch:'resilience', row:3,col:0, cost:1500, maxLevel:3, requires:['re5'],          desc:'+35 DEF per level.',                        effect:(p)=>{ p.def+=35; } },
  { id:'re9',  name:'Bloodthirst',    icon:'🩸', branch:'resilience', row:3,col:1, cost:1500, maxLevel:3, requires:['re5','re6'],    desc:'+8% HP regen rate per level (regen capped at 40%).',  effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.08,0.40); } },
  { id:'re10', name:'Colossus',       icon:'🗿', branch:'resilience', row:3,col:2, cost:1500, maxLevel:3, requires:['re6','re7'],    desc:'+300 Max HP per level.',                    effect:(p)=>{ p.maxHp+=300; p.hp=Math.min(p.hp+300,p.maxHp); } },
  { id:'re11', name:'Aegis',          icon:'🌀', branch:'resilience', row:4,col:0, cost:3000, maxLevel:3, requires:['re8'],          desc:'+60 DEF per level.',                        effect:(p)=>{ p.def+=60; } },
  { id:'re12', name:'Immortal Regen', icon:'♾️', branch:'resilience', row:4,col:1, cost:3000, maxLevel:2, requires:['re9'],          desc:'+15% HP regen rate per level (regen capped at 40%).', effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.15,0.40); } },
  { id:'re13', name:'Titan Shell',    icon:'🦕', branch:'resilience', row:4,col:2, cost:3000, maxLevel:2, requires:['re10'],         desc:'+500 Max HP per level.',                    effect:(p)=>{ p.maxHp+=500; p.hp=Math.min(p.hp+500,p.maxHp); } },
  { id:'re14', name:'Unkillable',     icon:'💀', branch:'resilience', row:5,col:1, cost:10000,maxLevel:2, requires:['re11','re12','re13'], desc:'+10% HP regen, +50 DEF, +500 Max HP per level (regen capped at 40%).', effect:(p)=>{ p.regenBonus=Math.min((p.regenBonus||0)+0.10,0.40); p.def+=50; p.maxHp+=500; p.hp=Math.min(p.hp+500,p.maxHp); } },

  { id:'ar1',  name:'Mana Sense',     icon:'🔮', branch:'arcane', row:0,col:1, cost:200,  maxLevel:5, requires:[],              desc:'+8 ATK (spell power) per level.',           effect:(p)=>{ p.atk+=8; } },
  { id:'ar2',  name:'Arcane Flow',    icon:'🌊', branch:'arcane', row:1,col:0, cost:300,  maxLevel:5, requires:['ar1'],          desc:'+12 ATK per level.',                        effect:(p)=>{ p.atk+=12; } },
  { id:'ar3',  name:'Spell Weave',    icon:'🕸️', branch:'arcane', row:1,col:1, cost:300,  maxLevel:5, requires:['ar1'],          desc:'+10 ATK, +5 SPD per level.',                effect:(p)=>{ p.atk+=10; p.spd+=5; } },
  { id:'ar4',  name:'Mana Shield',    icon:'🛡️', branch:'arcane', row:1,col:2, cost:300,  maxLevel:4, requires:['ar1'],          desc:'+12 DEF per level.',                        effect:(p)=>{ p.def+=12; } },
  { id:'ar5',  name:'Ley Lines',      icon:'⚡', branch:'arcane', row:2,col:0, cost:750,  maxLevel:4, requires:['ar2'],          desc:'+20 ATK per level.',                        effect:(p)=>{ p.atk+=20; } },
  { id:'ar6',  name:'Arcane Surge',   icon:'💥', branch:'arcane', row:2,col:1, cost:750,  maxLevel:4, requires:['ar2','ar3'],    desc:'+25 ATK per level.',                        effect:(p)=>{ p.atk+=25; } },
  { id:'ar7',  name:'Runic Armor',    icon:'🔣', branch:'arcane', row:2,col:2, cost:750,  maxLevel:3, requires:['ar3','ar4'],    desc:'+20 DEF, +10 ATK per level.',               effect:(p)=>{ p.def+=20; p.atk+=10; } },
  { id:'ar8',  name:'Void Tap',       icon:'🌑', branch:'arcane', row:3,col:0, cost:1500, maxLevel:3, requires:['ar5'],          desc:'+20 ATK per level.',                        effect:(p)=>{ p.atk+=20; } },
  { id:'ar9',  name:'Spellstorm',     icon:'🌪️', branch:'arcane', row:3,col:1, cost:1500, maxLevel:3, requires:['ar5','ar6'],    desc:'+25 ATK per level.',                        effect:(p)=>{ p.atk+=25; } },
  { id:'ar10', name:'Arcane Fortress',icon:'🏰', branch:'arcane', row:3,col:2, cost:1500, maxLevel:3, requires:['ar6','ar7'],    desc:'+18 DEF, +10 ATK per level.',               effect:(p)=>{ p.def+=18; p.atk+=10; } },
  { id:'ar11', name:'Mana Overload',  icon:'☄️', branch:'arcane', row:4,col:0, cost:3000, maxLevel:3, requires:['ar8'],          desc:'+40 ATK per level.',                        effect:(p)=>{ p.atk+=40; } },
  { id:'ar12', name:'Arcane God',     icon:'🌟', branch:'arcane', row:4,col:1, cost:3000, maxLevel:2, requires:['ar9'],          desc:'+50 ATK per level.',                        effect:(p)=>{ p.atk+=50; } },
  { id:'ar13', name:'Runic Titan',    icon:'🗿', branch:'arcane', row:4,col:2, cost:3000, maxLevel:2, requires:['ar10'],         desc:'+30 DEF, +20 ATK per level.',               effect:(p)=>{ p.def+=30; p.atk+=20; } },
  { id:'ar14', name:'Omnimancer',     icon:'👁️', branch:'arcane', row:5,col:1, cost:10000,maxLevel:2, requires:['ar11','ar12','ar13'], desc:'+12 ATK, +15 DEF, +8 SPD per level.', effect:(p)=>{ p.atk+=12; p.def+=15; p.spd+=8; } },

  { id:'sl1', name:'Extra Pocket',    icon:'🎒', branch:'slots', row:0,col:1, cost:250,  maxLevel:1, requires:[],           desc:'Unlock slot 5. Equip one more technique.',  effect:()=>{} },
  { id:'sl2', name:'Technique Bag',   icon:'🗃️', branch:'slots', row:1,col:0, cost:500,  maxLevel:1, requires:['sl1'],      desc:'Unlock slot 6.',                            effect:()=>{} },
  { id:'sl3', name:'Arsenal',         icon:'⚔️', branch:'slots', row:1,col:2, cost:1000, maxLevel:1, requires:['sl1'],      desc:'Unlock slot 7.',                            effect:()=>{} },
  { id:'sl4', name:'War Chest',       icon:'📦', branch:'slots', row:2,col:0, cost:2000, maxLevel:1, requires:['sl2'],      desc:'Unlock slot 8.',                            effect:()=>{} },
  { id:'sl5', name:'Technique Vault', icon:'🏛️', branch:'slots', row:2,col:2, cost:3750, maxLevel:1, requires:['sl3'],      desc:'Unlock slot 9.',                            effect:()=>{} },
  { id:'sl6', name:'Infinite Arsenal',icon:'♾️', branch:'slots', row:3,col:1, cost:6250, maxLevel:1, requires:['sl4','sl5'],desc:'Unlock slot 10. Maximum capacity.',          effect:()=>{} },
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

const TIER_DEFS = [
  { key:'early',     label:'Early',     icon:'🌱', rows:[0,1] },
  { key:'mid',       label:'Mid',       icon:'⚔️', rows:[2] },
  { key:'late',      label:'Late',      icon:'🔥', rows:[3] },
  { key:'endgame',   label:'Endgame',   icon:'👑', rows:[4,5] },
];

function getCostRarity(cost) {
  if (cost > 1500) return { color:'#f5c542', label:'Legendary' };
  if (cost > 600)  return { color:'#a855f7', label:'Epic' };
  if (cost > 250)  return { color:'#3498db', label:'Rare' };
  if (cost > 80)   return { color:'#27ae60', label:'Uncommon' };
  return { color:'#8b95a5', label:'Common' };
}

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
      const staminaBonus = Math.max(0, (G.player.maxStamina - 40) / 100) * 0.01;
      const spdBonus = Math.floor(G.player.spd / 100) * 0.01;
      return Math.max(0.3, 1 - v - staminaBonus - spdBonus);
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

function getCraftBonus(key) {
  const n = G.player.skillNodes || {};
  let mult = 1 + (n.cr9||0)*0.50;
  if (G.player.craftTripleBonus) mult *= 3;
  switch(key) {
    case 'growth_speed': return ((n.cr1||0)*0.10 + (n.cr4||0)*0.15 + (n.cr7||0)*0.25 + (n.cr10||0)*0.40 + (n.cr13||0)*0.60) * mult;
    case 'ingredient_yield': return ((n.cr2||0)*1 + (n.cr5||0)*2 + (n.cr8||0)*3 + (n.cr11||0)*5) * mult;
    case 'brew_save': return ((n.cr3||0)*0.10) * mult;
    case 'brew_double': return ((n.cr6||0)*0.20) * mult;
    case 'brew_triple': return ((n.cr12||0)*0.30) * mult;
    default: return 0;
  }
}

function getNodeLevel(id) { return (G.player.skillNodes && G.player.skillNodes[id]) || 0; }

function getNodeCost(node) {
  return Math.floor(node.cost * (1 + getNodeLevel(node.id)));
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
  invalidateStatCache();
  recalcStats();
  G.player.hp = Math.min(G.player.hp, G.player.maxHp);
  G.player.stamina = Math.min(G.player.stamina, G.player.maxStamina);
  playSound('skill tree upgrade');
  toast(`Upgraded: ${node.name} (Lv.${G.player.skillNodes[nodeId]})`, 'success');
  spawnFloatingText(`-${cost}g`, 'float-dmg');
  renderSkillTree();
  renderJobs();
}

function getMaxDigCharges() {
  return 5 + ((G.player.shopPurchases && G.player.shopPurchases['dig_cap']) || 0) * 2;
}

function getMaxEquipSlots() {
  const n = G.player.skillNodes || {};
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

let activeSkillBranch = 'combat';
let _shopCssInjected = false;

function injectShopStyles() {
  if (_shopCssInjected) return;
  _shopCssInjected = true;
  const s = document.createElement('style');
  s.textContent = `
  .st-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;flex-wrap:wrap}
  .st-gold-display{display:flex;align-items:center;gap:8px;background:rgba(245,197,66,0.08);border:1px solid rgba(245,197,66,0.25);border-radius:8px;padding:8px 16px}
  .st-gold-icon{font-size:28px}
  .st-gold-val{font-size:26px;font-weight:800;color:#f5c542}
  .st-gold-label{font-size:11px;color:var(--dim);display:block}
  .st-header-right{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .st-node-count{font-size:12px;color:var(--dim);background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:6px;padding:6px 12px}
  .st-node-count strong{color:var(--text)}
  .st-reset-btn{background:none;border:1px solid rgba(231,76,60,0.5);color:#e74c3c;border-radius:6px;padding:7px 14px;cursor:pointer;font-size:12px;font-weight:600;transition:all 0.18s ease}
  .st-reset-btn:hover{background:rgba(231,76,60,0.15);border-color:#e74c3c}
  .st-stats-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;background:rgba(255,255,255,0.02);border:1px solid var(--border);border-radius:8px}
  .st-stat-pill{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--dim);background:rgba(255,255,255,0.04);border:1px solid var(--border);border-radius:4px;padding:3px 8px}
  .st-stat-pill .st-stat-val{color:var(--text);font-weight:700}
  .st-branch-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px}
  .st-branch-tab{background:rgba(255,255,255,0.04);border:1px solid var(--border);color:var(--dim);border-radius:20px;padding:6px 16px;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.18s ease;user-select:none}
  .st-branch-tab:hover{color:var(--text);border-color:var(--border-h)}
  .st-branch-tab.active{background:var(--branch-color,#6c9fff);border-color:var(--branch-color,#6c9fff);color:#fff;box-shadow:0 0 12px rgba(108,159,255,0.3)}
  .st-tree-scroll{overflow-y:auto;max-height:600px;padding-bottom:10px}
  .st-tree-scroll::-webkit-scrollbar{width:5px}
  .st-tree-scroll::-webkit-scrollbar-track{background:transparent}
  .st-tree-scroll::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}
  .st-tier{margin-bottom:4px}
  .st-tier-header{display:flex;align-items:center;gap:8px;padding:8px 14px;border-radius:8px 8px 0 0;font-size:14px;font-weight:700;color:var(--text);background:rgba(255,255,255,0.03);border:1px solid var(--border);border-bottom:none;margin-top:12px}
  .st-tier-header:first-child{margin-top:0}
  .st-tier-icon{font-size:18px}
  .st-tier-name{letter-spacing:0.5px}
  .st-tier-count{font-size:11px;color:var(--dim);font-weight:400;margin-left:auto}
  .st-tier-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px;background:rgba(255,255,255,0.01);border:1px solid var(--border);border-radius:0 0 8px 8px}
  @media(max-width:900px){.st-tier-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:560px){.st-tier-grid{grid-template-columns:1fr}}
  .st-tier-connector{display:flex;align-items:center;justify-content:center;gap:0;padding:2px 0}
  .st-connector-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--border),transparent)}
  .st-connector-arrow{color:var(--border);font-size:10px;padding:0 6px}
  .st-node{background:rgba(24,30,46,0.9);border:1px solid var(--border);border-radius:var(--r);padding:12px 10px;cursor:pointer;transition:all 0.2s;user-select:none;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;border-top:4px solid var(--border)}
  .st-node:hover{border-color:var(--border-h);background:var(--card-h);transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,0.4)}
  .st-node-icon{font-size:28px;line-height:1}
  .st-node-name{font-size:12px;font-weight:700;color:var(--text);line-height:1.2;min-height:18px}
  .st-node-level{font-size:10px;color:var(--dim)}
  .st-node-cost{font-size:12px;font-weight:700;margin-top:2px}
  .st-node-desc{font-size:10px;color:var(--dim);line-height:1.3;margin-top:2px}
  .st-node-requires{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px;justify-content:center}
  .st-req-pill{font-size:9px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:10px;padding:1px 6px;color:var(--dim)}
  .st-node.node-available{border-top-color:var(--branch-color,#6c9fff);box-shadow:0 0 12px rgba(108,159,255,0.2)}
  .st-node.node-available .st-node-cost{color:var(--branch-color,#6c9fff)}
  .st-node.node-available:hover{box-shadow:0 0 18px rgba(108,159,255,0.35)}
  @keyframes stPulse{0%,100%{box-shadow:0 0 8px rgba(108,159,255,0.15)}50%{box-shadow:0 0 16px rgba(108,159,255,0.3)}}
  .st-node.node-available{animation:stPulse 2.5s ease-in-out infinite}
  .st-node.node-maxed{border-top-color:#27ae60;background:rgba(39,174,96,0.08);box-shadow:0 0 10px rgba(39,174,96,0.15);opacity:0.85}
  .st-node.node-maxed:hover{opacity:1}
  .st-node.node-maxed .st-node-cost{color:#27ae60}
  .st-node.node-locked{filter:blur(2px) brightness(0.6);opacity:0.5;cursor:not-allowed}
  .st-node.node-locked:hover{transform:none;box-shadow:none;border-color:var(--border)}
  .st-lock-overlay{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(0,0,0,0.25);z-index:2;pointer-events:none;border-radius:var(--r)}
  .st-owned-badge{position:absolute;top:6px;right:6px;background:#27ae60;color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;z-index:3;letter-spacing:0.5px}
  .st-maxed-badge{position:absolute;top:6px;right:6px;background:linear-gradient(135deg,#1e8449,#27ae60);color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;z-index:3;letter-spacing:0.5px}
  .st-confirm-overlay{position:fixed;inset:0;z-index:3000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px)}
  .st-confirm-box{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:24px;max-width:380px;width:90%;text-align:center;box-shadow:0 8px 40px rgba(0,0,0,0.6)}
  .st-confirm-box h3{font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px}
  .st-confirm-box p{font-size:13px;color:var(--dim);margin-bottom:18px;line-height:1.5}
  .st-confirm-actions{display:flex;gap:10px;justify-content:center}
  .st-confirm-actions button{padding:8px 18px;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all 0.18s ease}
  .st-btn-danger{background:rgba(231,76,60,0.15);color:#e74c3c;border-color:rgba(231,76,60,0.5)}
  .st-btn-danger:hover{background:rgba(231,76,60,0.3);border-color:#e74c3c}
  .st-btn-cancel{background:rgba(255,255,255,0.04);color:var(--dim)}
  .st-btn-cancel:hover{color:var(--text);border-color:var(--border-h)}
  .st-node::after{
    content:attr(data-tooltip);position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);
    background:rgba(8,11,18,0.97);border:1px solid var(--border);color:var(--text);font-size:11px;
    padding:8px 10px;border-radius:6px;pointer-events:none;opacity:0;transition:opacity 0.15s;
    z-index:500;width:200px;white-space:normal;text-align:center;box-shadow:0 4px 16px rgba(0,0,0,0.6);line-height:1.5;
  }
  .st-node:hover::after{opacity:1}
  .st-node.node-locked::after{display:none}
  @media(max-width:560px){
    .st-header{flex-direction:column;align-items:stretch}
    .st-gold-display{justify-content:center}
    .st-header-right{justify-content:center}
    .st-stats-bar{justify-content:center}
  }
  `;
  document.head.appendChild(s);
}

function countOwnedNodes() {
  const n = G.player.skillNodes || {};
  let total = 0;
  for (const k in n) { if (n[k] > 0) total += n[k]; }
  return total;
}

function countMaxedNodes() {
  const n = G.player.skillNodes || {};
  let count = 0;
  SKILL_TREE.forEach(node => {
    if ((n[node.id] || 0) >= node.maxLevel) count++;
  });
  return count;
}

function buildStatsSummary() {
  const b = getSkillTreeBonuses();
  const parts = [];
  if (b.atk) parts.push(`<span class="st-stat-pill">⚔️ ATK <span class="st-stat-val">+${Math.floor(b.atk)}</span></span>`);
  if (b.def) parts.push(`<span class="st-stat-pill">🛡️ DEF <span class="st-stat-val">+${Math.floor(b.def)}</span></span>`);
  if (b.spd) parts.push(`<span class="st-stat-pill">💨 SPD <span class="st-stat-val">+${Math.floor(b.spd)}</span></span>`);
  if (b.maxHp) parts.push(`<span class="st-stat-pill">❤️ HP <span class="st-stat-val">+${Math.floor(b.maxHp)}</span></span>`);
  if (b.maxStamina) parts.push(`<span class="st-stat-pill">⚡ STA <span class="st-stat-val">+${Math.floor(b.maxStamina)}</span></span>`);
  if (b.regenBonus) parts.push(`<span class="st-stat-pill">♻️ Regen <span class="st-stat-val">+${Math.floor(b.regenBonus*100)}%</span></span>`);
  return parts.length ? parts.join('') : '<span class="st-stat-pill">No bonuses yet</span>';
}

function showResetTreeModal() {
  const existing = document.getElementById('st-reset-modal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'st-reset-modal';
  overlay.className = 'st-confirm-overlay';
  overlay.innerHTML = `
    <div class="st-confirm-box">
      <h3>⚠️ Reset Skill Tree?</h3>
      <p>This will refund all invested gold and remove all node levels. You can re-purchase nodes afterward.</p>
      <div class="st-confirm-actions">
        <button class="st-btn-danger" onclick="confirmResetTree()">Yes, Reset</button>
        <button class="st-btn-cancel" onclick="cancelResetTree()">Cancel</button>
      </div>
    </div>`;
  overlay.addEventListener('click', function(e) { if (e.target === overlay) cancelResetTree(); });
  document.body.appendChild(overlay);
}

function cancelResetTree() {
  const el = document.getElementById('st-reset-modal');
  if (el) el.remove();
}

function confirmResetTree() {
  cancelResetTree();
  const nodes = G.player.skillNodes || {};
  let totalSpent = 0;
  SKILL_TREE.forEach(node => {
    const lvl = nodes[node.id] || 0;
    if (lvl > 0) {
      let cost = node.cost;
      for (let i = 0; i < lvl; i++) {
        totalSpent += cost;
        cost = Math.floor(cost * 1.5);
      }
    }
  });
  G.player.skillNodes = {};
  G.player.gold += totalSpent;
  invalidateStatCache();
  recalcStats();
  G.player.hp = Math.min(G.player.hp, G.player.maxHp);
  G.player.stamina = Math.min(G.player.stamina, G.player.maxStamina);
  playSound('skill tree upgrade');
  toast(`Skill tree reset! Refunded ${formatNum(totalSpent)}g`, 'success');
  renderSkillTree();
  renderJobs();
}

function renderSkillTree() {
  injectShopStyles();
  const container = document.getElementById('skill-tree-container');
  if (!container) return;

  const tabsEl = document.getElementById('skill-branch-tabs');
  const meta = BRANCH_META[activeSkillBranch];
  const color = meta.color;

  if (tabsEl) {
    tabsEl.className = 'st-branch-tabs';
    tabsEl.innerHTML = Object.entries(BRANCH_META).map(([key, m]) => `
      <button class="st-branch-tab${activeSkillBranch === key ? ' active' : ''}"
        style="--branch-color:${m.color}"
        onclick="setSkillBranch('${key}')">${m.label}</button>
    `).join('');
  }

  const branchNodes = SKILL_TREE.filter(n => n.branch === activeSkillBranch);
  const nodesByTier = {};
  TIER_DEFS.forEach(t => { nodesByTier[t.key] = []; });
  branchNodes.forEach(node => {
    for (const tier of TIER_DEFS) {
      if (tier.rows.includes(node.row)) {
        nodesByTier[tier.key].push(node);
        break;
      }
    }
  });

  const gold = G.player.gold || 0;
  const totalNodes = countOwnedNodes();
  const maxedNodes = countMaxedNodes();

  let tiersHtml = '';
  TIER_DEFS.forEach((tier, ti) => {
    const nodes = nodesByTier[tier.key];
    if (nodes.length === 0) return;

    if (ti > 0) {
      tiersHtml += `<div class="st-tier-connector"><div class="st-connector-line"></div><div class="st-connector-arrow">▼</div><div class="st-connector-line"></div></div>`;
    }

    const ownedInTier = nodes.filter(n => getNodeLevel(n.id) > 0).length;
    const cardsHtml = nodes.map(node => {
      const lvl = getNodeLevel(node.id);
      const maxed = lvl >= node.maxLevel;
      const canBuy = canUnlockNode(node);
      const cost = getNodeCost(node);
      const locked = node.requires.some(req => getNodeLevel(req) < 1);
      const rarity = getCostRarity(node.cost);

      let cls = 'st-node';
      if (maxed) cls += ' node-maxed';
      else if (canBuy) cls += ' node-available';
      if (locked && !maxed) cls += ' node-locked';

      const reqPills = node.requires.map(reqId => {
        const reqNode = SKILL_TREE.find(n => n.id === reqId);
        if (!reqNode) return '';
        const reqLvl = getNodeLevel(reqId);
        const met = reqLvl >= 1;
        return `<span class="st-req-pill" style="${met ? 'color:#27ae60;border-color:rgba(39,174,96,0.3)' : ''}">${met ? '✓' : '🔒'} ${reqNode.name}</span>`;
      }).join('');

      let overlay = '';
      if (locked && !maxed) overlay = '<div class="st-lock-overlay">🔒</div>';
      let badge = '';
      if (maxed) badge = '<div class="st-maxed-badge">MAXED</div>';
      else if (lvl > 0) badge = `<div class="st-owned-badge">Lv.${lvl}/${node.maxLevel}</div>`;

      return `<div class="${cls}" style="--branch-color:${color};border-top-color:${maxed ? '#27ae60' : rarity.color}"
        onclick="buySkillNode('${node.id}')"
        data-tooltip="${node.name} (${lvl}/${node.maxLevel}) — ${node.desc} — Cost: ${maxed ? 'Maxed' : cost + 'g'}">
        ${overlay}
        ${badge}
        <div class="st-node-icon">${node.icon}</div>
        <div class="st-node-name">${node.name}</div>
        <div class="st-node-level">${maxed ? '<span style="color:#27ae60">✓ Complete</span>' : `Lv. ${lvl} / ${node.maxLevel}`}</div>
        <div class="st-node-cost" style="color:${maxed ? '#27ae60' : rarity.color}">${maxed ? '✅ Owned' : '💰 ' + formatNum(cost)}</div>
        <div class="st-node-desc">${node.desc}</div>
        ${reqPills ? `<div class="st-node-requires">${reqPills}</div>` : ''}
      </div>`;
    }).join('');

    tiersHtml += `<div class="st-tier">
      <div class="st-tier-header">
        <span class="st-tier-icon">${tier.icon}</span>
        <span class="st-tier-name">${tier.label}</span>
        <span class="st-tier-count">${ownedInTier}/${nodes.length} unlocked</span>
      </div>
      <div class="st-tier-grid">${cardsHtml}</div>
    </div>`;
  });

  container.innerHTML = `
    <div class="st-header">
      <div class="st-gold-display">
        <span class="st-gold-icon">💰</span>
        <div>
          <span class="st-gold-val">${formatNum(gold)}</span>
          <span class="st-gold-label">Gold Available</span>
        </div>
      </div>
      <div class="st-header-right">
        <div class="st-node-count">Nodes: <strong>${totalNodes}</strong> · Maxed: <strong>${maxedNodes}</strong></div>
        <button class="st-reset-btn" onclick="showResetTreeModal()">🔄 Reset Tree</button>
      </div>
    </div>
    <div class="st-stats-bar">${buildStatsSummary()}</div>
    <div class="st-tree-scroll">${tiersHtml}</div>
  `;
}

function setSkillBranch(branch) {
  activeSkillBranch = branch;
  renderSkillTree();
}

function renderShop() { renderSkillTree(); }
