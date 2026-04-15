// ===== UPGRADES SKILL TREE =====
// 7 branches, ~14 nodes each = ~98 total nodes
// row/col layout: each branch uses rows 0-5, cols 0-2

const SKILL_TREE = [

  // ════════════════════════════════════════
  // ⚔️  COMBAT  (14 nodes, 6 rows, 3 cols)
  // ════════════════════════════════════════
  { id:'c1',  name:'Sharp Edge',       icon:'🗡️', branch:'combat', row:0,col:0, cost:50,   maxLevel:5, requires:[],           desc:'+8 ATK per level.',                         effect:(p)=>{ p.atk+=8; } },
  { id:'c2',  name:'Iron Guard',       icon:'🛡️', branch:'combat', row:1,col:0, cost:80,   maxLevel:5, requires:['c1'],       desc:'+6 DEF per level.',                         effect:(p)=>{ p.def+=6; } },
  { id:'c3',  name:'Berserker',        icon:'😤', branch:'combat', row:1,col:1, cost:80,   maxLevel:5, requires:['c1'],       desc:'+12 ATK, -3 DEF per level.',                effect:(p)=>{ p.atk+=12; p.def-=3; } },
  { id:'c4',  name:'Weapon Mastery',   icon:'🔪', branch:'combat', row:1,col:2, cost:80,   maxLevel:5, requires:['c1'],       desc:'+10 ATK per level.',                        effect:(p)=>{ p.atk+=10; } },
  { id:'c5',  name:'Parry Master',     icon:'⚔️', branch:'combat', row:2,col:0, cost:150,  maxLevel:4, requires:['c2'],       desc:'+10 DEF, +5 ATK per level.',                effect:(p)=>{ p.def+=10; p.atk+=5; } },
  { id:'c6',  name:'Crit Mastery',     icon:'💥', branch:'combat', row:2,col:1, cost:150,  maxLevel:4, requires:['c3'],       desc:'+15 ATK per level.',                        effect:(p)=>{ p.atk+=15; } },
  { id:'c7',  name:'Blade Dance',      icon:'🌀', branch:'combat', row:2,col:2, cost:150,  maxLevel:4, requires:['c4'],       desc:'+8 ATK, +5 SPD per level.',                 effect:(p)=>{ p.atk+=8; p.spd+=5; } },
  { id:'c8',  name:'Fortress',         icon:'🏰', branch:'combat', row:3,col:0, cost:300,  maxLevel:3, requires:['c5'],       desc:'+20 DEF per level.',                        effect:(p)=>{ p.def+=20; } },
  { id:'c9',  name:'Bloodlust',        icon:'🩸', branch:'combat', row:3,col:1, cost:300,  maxLevel:3, requires:['c6'],       desc:'+25 ATK per level.',                        effect:(p)=>{ p.atk+=25; } },
  { id:'c10', name:'Phantom Strike',   icon:'👻', branch:'combat', row:3,col:2, cost:300,  maxLevel:3, requires:['c7'],       desc:'+12 ATK, +10 SPD per level.',               effect:(p)=>{ p.atk+=12; p.spd+=10; } },
  { id:'c11', name:'Titan Guard',      icon:'🗿', branch:'combat', row:4,col:0, cost:600,  maxLevel:3, requires:['c8'],       desc:'+30 DEF, +10 ATK per level.',               effect:(p)=>{ p.def+=30; p.atk+=10; } },
  { id:'c12', name:'Warlord\'s Might', icon:'👑', branch:'combat', row:4,col:1, cost:600,  maxLevel:3, requires:['c9','c10'], desc:'+35 ATK, +15 DEF per level.',               effect:(p)=>{ p.atk+=35; p.def+=15; } },
  { id:'c13', name:'Death\'s Edge',    icon:'💀', branch:'combat', row:5,col:0, cost:1200, maxLevel:2, requires:['c11','c12'],desc:'+50 ATK, +25 DEF per level.',               effect:(p)=>{ p.atk+=50; p.def+=25; } },
  { id:'c14', name:'God of War',       icon:'⚡', branch:'combat', row:5,col:1, cost:2500, maxLevel:1, requires:['c13'],      desc:'+100 ATK, +50 DEF, +30 SPD. One-time.',     effect:(p)=>{ p.atk+=100; p.def+=50; p.spd+=30; } },

  // ════════════════════════════════════════
  // 💰  WEALTH  (14 nodes)
  // ════════════════════════════════════════
  { id:'w1',  name:'Coin Sense',       icon:'🪙', branch:'wealth', row:0,col:0, cost:60,   maxLevel:5, requires:[],           desc:'+15% gold from jobs per level.',            effect:()=>{} },
  { id:'w2',  name:'Merchant Eye',     icon:'👁️', branch:'wealth', row:1,col:0, cost:100,  maxLevel:5, requires:['w1'],       desc:'+20% gold from all sources per level.',     effect:()=>{} },
  { id:'w3',  name:'Fast Hands',       icon:'🤲', branch:'wealth', row:1,col:1, cost:100,  maxLevel:4, requires:['w1'],       desc:'Job cycles 10% faster per level.',          effect:()=>{} },
  { id:'w4',  name:'Haggler',          icon:'🤝', branch:'wealth', row:1,col:2, cost:100,  maxLevel:4, requires:['w1'],       desc:'+10% gold from all sources per level.',     effect:()=>{} },
  { id:'w5',  name:'Trade Empire',     icon:'��', branch:'wealth', row:2,col:0, cost:250,  maxLevel:4, requires:['w2'],       desc:'+30% gold from jobs per level.',            effect:()=>{} },
  { id:'w6',  name:'Efficiency',       icon:'⚙️', branch:'wealth', row:2,col:1, cost:250,  maxLevel:3, requires:['w3'],       desc:'Job cycles 15% faster per level.',          effect:()=>{} },
  { id:'w7',  name:'Black Market',     icon:'🕵️', branch:'wealth', row:2,col:2, cost:250,  maxLevel:3, requires:['w4'],       desc:'+25% gold from all sources per level.',     effect:()=>{} },
  { id:'w8',  name:'Monopoly',         icon:'🏛️', branch:'wealth', row:3,col:0, cost:500,  maxLevel:3, requires:['w5'],       desc:'+40% gold from jobs per level.',            effect:()=>{} },
  { id:'w9',  name:'Turbo Worker',     icon:'🚀', branch:'wealth', row:3,col:1, cost:500,  maxLevel:3, requires:['w6'],       desc:'Job cycles 20% faster per level.',          effect:()=>{} },
  { id:'w10', name:'Smuggler',         icon:'📦', branch:'wealth', row:3,col:2, cost:500,  maxLevel:3, requires:['w7'],       desc:'+35% gold from all sources per level.',     effect:()=>{} },
  { id:'w11', name:'Tycoon',           icon:'💎', branch:'wealth', row:4,col:0, cost:1000, maxLevel:2, requires:['w8','w9'],  desc:'+50% gold from all sources per level.',     effect:()=>{} },
  { id:'w12', name:'Speed Demon',      icon:'⚡', branch:'wealth', row:4,col:1, cost:1000, maxLevel:2, requires:['w9','w10'], desc:'Job cycles 30% faster per level.',          effect:()=>{} },
  { id:'w13', name:'Kingpin',          icon:'👑', branch:'wealth', row:5,col:0, cost:2000, maxLevel:2, requires:['w11','w12'],desc:'+75% gold from all sources per level.',     effect:()=>{} },
  { id:'w14', name:'Infinite Wealth',  icon:'♾️', branch:'wealth', row:5,col:1, cost:5000, maxLevel:1, requires:['w13'],      desc:'+150% gold from all sources. One-time.',    effect:()=>{} },

  // ════════════════════════════════════════
  // ❤️  BODY  (14 nodes)
  // ════════════════════════════════════════
  { id:'b1',  name:'Tough Skin',       icon:'��', branch:'body',   row:0,col:0, cost:50,   maxLevel:5, requires:[],           desc:'+30 Max HP per level.',                     effect:(p)=>{ p.maxHp+=30; p.hp=Math.min(p.hp+30,p.maxHp); } },
  { id:'b2',  name:'Iron Lungs',       icon:'💨', branch:'body',   row:1,col:0, cost:80,   maxLevel:5, requires:['b1'],       desc:'+25 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=25; } },
  { id:'b3',  name:'Vitality',         icon:'❤️', branch:'body',   row:1,col:1, cost:80,   maxLevel:5, requires:['b1'],       desc:'+60 Max HP per level.',                     effect:(p)=>{ p.maxHp+=60; p.hp=Math.min(p.hp+60,p.maxHp); } },
  { id:'b4',  name:'Thick Hide',       icon:'🦏', branch:'body',   row:1,col:2, cost:80,   maxLevel:5, requires:['b1'],       desc:'+4 DEF per level.',                         effect:(p)=>{ p.def+=4; } },
  { id:'b5',  name:'Endurance',        icon:'🏃', branch:'body',   row:2,col:0, cost:200,  maxLevel:4, requires:['b2'],       desc:'+40 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=40; } },
  { id:'b6',  name:'Giant\'s Blood',   icon:'🩸', branch:'body',   row:2,col:1, cost:200,  maxLevel:4, requires:['b3'],       desc:'+100 Max HP per level.',                    effect:(p)=>{ p.maxHp+=100; p.hp=Math.min(p.hp+100,p.maxHp); } },
  { id:'b7',  name:'Stone Skin',       icon:'🪨', branch:'body',   row:2,col:2, cost:200,  maxLevel:4, requires:['b4'],       desc:'+8 DEF per level.',                         effect:(p)=>{ p.def+=8; } },
  { id:'b8',  name:'Marathon Runner',  icon:'🏅', branch:'body',   row:3,col:0, cost:400,  maxLevel:3, requires:['b5'],       desc:'+60 Max Stamina per level.',                effect:(p)=>{ p.maxStamina+=60; } },
  { id:'b9',  name:'Colossus',         icon:'🗿', branch:'body',   row:3,col:1, cost:400,  maxLevel:3, requires:['b6'],       desc:'+150 Max HP per level.',                    effect:(p)=>{ p.maxHp+=150; p.hp=Math.min(p.hp+150,p.maxHp); } },
  { id:'b10', name:'Diamond Skin',     icon:'💎', branch:'body',   row:3,col:2, cost:400,  maxLevel:3, requires:['b7'],       desc:'+15 DEF per level.',                        effect:(p)=>{ p.def+=15; } },
  { id:'b11', name:'Immortal Body',    icon:'✨', branch:'body',   row:4,col:0, cost:800,  maxLevel:3, requires:['b8','b9'],  desc:'+200 Max HP, +80 Stamina per level.',       effect:(p)=>{ p.maxHp+=200; p.maxStamina+=80; p.hp=Math.min(p.hp+200,p.maxHp); } },
  { id:'b12', name:'Fortress Body',    icon:'🏰', branch:'body',   row:4,col:1, cost:800,  maxLevel:2, requires:['b9','b10'], desc:'+25 DEF, +100 Max HP per level.',           effect:(p)=>{ p.def+=25; p.maxHp+=100; p.hp=Math.min(p.hp+100,p.maxHp); } },
  { id:'b13', name:'Titan\'s Form',    icon:'⚡', branch:'body',   row:5,col:0, cost:1500, maxLevel:2, requires:['b11','b12'],desc:'+300 Max HP, +30 DEF per level.',           effect:(p)=>{ p.maxHp+=300; p.def+=30; p.hp=Math.min(p.hp+300,p.maxHp); } },
  { id:'b14', name:'Undying',          icon:'♾️', branch:'body',   row:5,col:1, cost:4000, maxLevel:1, requires:['b13'],      desc:'+500 Max HP, +200 Stamina, +50 DEF. Once.', effect:(p)=>{ p.maxHp+=500; p.maxStamina+=200; p.def+=50; p.hp=Math.min(p.hp+500,p.maxHp); } },

