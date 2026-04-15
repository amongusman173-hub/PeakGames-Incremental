// ===== RAIDS / BOSS SYSTEM — Turn-Based =====

const BOSSES = [
  // Tier 1 — Early game (still punishing)
  {
    id:'goblin_king', name:'Goblin King', icon:'👺', levelReq:3,
    hp:180, atk:22, def:6, spd:10, abilityCount:2,
    xpReward:80, goldReward:30, techReward:'slash',
    lore:'The Goblin King has terrorized the village for years.',
    intro:'Grrr! You dare challenge the King?! I\'ll crush your bones!'
  },
  {
    id:'stone_golem', name:'Stone Golem', icon:'🗿', levelReq:8,
    hp:420, atk:42, def:28, spd:4, abilityCount:2,
    xpReward:200, goldReward:80, techReward:'earth_crush',
    lore:'Awakened by dark magic, it guards the ancient ruins.',
    intro:'...*the ground shakes*...'
  },
  // Tier 2 — Mid game
  {
    id:'shadow_wolf', name:'Shadow Wolf Alpha', icon:'🐺', levelReq:15,
    hp:800, atk:85, def:20, spd:55, abilityCount:3,
    xpReward:500, goldReward:200, techReward:'fang_strike',
    lore:'It hunts at night, leaving no trace. The pack follows its howl.',
    intro:'*a deafening howl echoes through the dark*'
  },
  {
    id:'iron_knight', name:'Iron Knight Valdris', icon:'⚔️', levelReq:22,
    hp:1400, atk:130, def:80, spd:30, abilityCount:3,
    xpReward:1000, goldReward:400, techReward:'holy_slash',
    lore:'Once a hero, now a servant of darkness. His armor is unbreakable.',
    intro:'You cannot stop what I have become. Kneel, or be broken.'
  },
  // Tier 3 — Hard
  {
    id:'sea_serpent', name:'Leviathan', icon:'🐉', levelReq:30,
    hp:2800, atk:200, def:110, spd:45, abilityCount:4,
    xpReward:2000, goldReward:800, techReward:'tidal_wave',
    lore:'Ancient sailors called it the World Ender. It has sunk a thousand ships.',
    intro:'*the sea boils* The ocean claims all who dare enter my domain...'
  },
  {
    id:'demon_lord', name:'Demon Lord Vael', icon:'😈', levelReq:40,
    hp:5500, atk:340, def:160, spd:80, abilityCount:5,
    xpReward:5000, goldReward:2500, techReward:'hellfire',
    lore:'He who breaks the seal shall face oblivion. Vael has consumed entire kingdoms.',
    intro:'I have waited an eternity for a worthy soul to consume. You will do nicely.'
  },
  // Tier 4 — Endgame
  {
    id:'void_titan', name:'Void Titan', icon:'🌑', levelReq:55,
    hp:12000, atk:550, def:250, spd:100, abilityCount:6,
    xpReward:12000, goldReward:6000, techReward:'void_rend',
    lore:'A being of pure nothingness. It does not kill — it erases.',
    intro:'*reality fractures around it* You should not exist. Let me fix that.'
  },
  {
    id:'god_of_war', name:'God of War — Kael\'thas', icon:'⚡', levelReq:70,
    hp:25000, atk:900, def:400, spd:160, abilityCount:6,
    xpReward:30000, goldReward:15000, techReward:'divine_heal',
    lore:'The war god himself descends. No mortal has ever survived this encounter.',
    intro:'A mortal challenges a god? *laughs* This will be over in an instant.'
  },
];


let currentRaidBossId = null;

function startRaid(bossId) {
  const boss = BOSSES.find(b => b.id === bossId);
  if (!boss) return;
  const p = G.player;
  if (p.level < boss.levelReq) { toast(`Requires level ${boss.levelReq}`, 'warn'); return; }

  currentRaidBossId = bossId;
  const log = document.getElementById('raid-log');
  if (log) { log.classList.remove('hidden'); log.innerHTML = ''; }

  const enemy = { ...boss, maxHp: boss.hp };

  startRaidBattle(enemy, log, (won) => {
    if (won === true) {
      gainXP(boss.xpReward);
      const gold = gainGold(boss.goldReward);
      if (!p.defeatedBosses.includes(bossId)) {
        p.defeatedBosses.push(bossId);
        if (boss.techReward) grantTechnique(boss.techReward);
        appendLog(log, `🏆 First clear! Technique: ${getTechniqueName(boss.techReward)}`, 'log-story');
      }
      appendLog(log, `💰 +${gold} gold | ✨ +${boss.xpReward} XP`, 'log-heal');
      toast(`Defeated ${boss.name}!`, 'success');
    } else if (won === false) {
      appendLog(log, `💀 Defeated by ${boss.name}...`, 'log-enemy');
      toast(`Defeated by ${boss.name}`, 'warn');
    }
    renderRaids();
    renderInventory();
  });
}

function closeRaidBattle() {
  combatActive = false;
  const raidBattle = document.getElementById('raid-battle');
  const raidList   = document.getElementById('raids-list');
  if (raidBattle) raidBattle.classList.add('hidden');
  if (raidList)   raidList.classList.remove('hidden');
  document.getElementById('raid-result')?.classList.add('hidden');
  renderRaids();
}

function renderRaids() {
  const container = document.getElementById('raids-list');
  if (!container) return;
  const p = G.player;

  if (p.level < 8) {
    container.innerHTML = `<div class="locked-section"><div class="locked-icon">⚔️</div><h3>Raids Locked</h3><p>Reach <strong>Level 8</strong> to unlock Raids.</p></div>`;
    return;
  }

  container.innerHTML = BOSSES.map((boss, i) => {
    const locked   = p.level < boss.levelReq;
    const defeated = p.defeatedBosses.includes(boss.id);
    return `
      <div class="card${defeated ? '' : ''}" style="${defeated ? 'border-color:var(--ok)' : ''}">
        <h3>${boss.icon} ${boss.name} ${defeated ? '<span style="color:var(--ok);font-size:11px">✓ Cleared</span>' : ''}</h3>
        <div class="card-desc">${boss.desc}</div>
        <div style="font-size:11px;color:var(--dim);font-style:italic;margin-bottom:8px">"${boss.lore}"</div>
        <div class="card-stats">
          <span>❤️ ${boss.hp} HP</span>
          <span>⚔️ ${boss.atk} ATK</span>
          <span>🛡️ ${boss.def} DEF</span>
          <span>⚡ ${boss.abilityCount} abilities</span>
          <span class="highlight">✨ ${boss.xpReward} XP</span>
          <span class="highlight">💰 ${boss.goldReward} G</span>
        </div>
        ${locked
          ? `<div class="card-locked">🔒 Level ${boss.levelReq}</div>`
          : `<button class="btn-primary" onclick="startRaid('${boss.id}')">${defeated ? '⚔️ Re-raid' : '⚔️ Raid'}</button>`
        }
      </div>`;
  }).join('');
}
