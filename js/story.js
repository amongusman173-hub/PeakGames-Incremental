// ===== STORY MODE — 10 stages per chapter =====
// Each chapter defines a base enemy. Stages 1-9 scale that enemy up.
// Stage 10 is the boss fight (stronger). Completing all 10 = chapter done.

const STORY_CHAPTERS = [
  {
    id: 'ch1', title: 'The Awakening', num: 'Chapter 1',
    desc: 'You wake in a burning village. Fight your way out.',
    levelReq: 1,
    // Each stage has a unique enemy variant
    stageEnemies: [
      { name: 'Bandit Scout',    icon: '🗡️', hp: 28,  atk: 6,  def: 1, spd: 5,  intro: null },
      { name: 'Torch Thug',      icon: '🔦', hp: 32,  atk: 7,  def: 1, spd: 4,  intro: null },
      { name: 'Scarred Brawler', icon: '🤜', hp: 38,  atk: 8,  def: 2, spd: 4,  intro: null },
      { name: 'Crossbowman',     icon: '🏹', hp: 30,  atk: 10, def: 1, spd: 6,  intro: null },
      { name: 'Arsonist',        icon: '🔥', hp: 42,  atk: 9,  def: 2, spd: 5,  intro: null },
      { name: 'Masked Rogue',    icon: '🎭', hp: 45,  atk: 11, def: 2, spd: 7,  intro: null },
      { name: 'Iron Brute',      icon: '🦾', hp: 55,  atk: 10, def: 4, spd: 3,  intro: null },
      { name: 'Bandit Veteran',  icon: '⚔️', hp: 60,  atk: 12, def: 3, spd: 5,  intro: null },
      { name: 'Bandit Champion', icon: '🛡️', hp: 70,  atk: 13, def: 4, spd: 5,  intro: 'You won\'t leave here alive!' },
      null, // stage 10 = boss
    ],
    bossEnemy: { name: 'Bandit Captain', icon: '👑', hp: 130, atk: 15, def: 5, spd: 6, intro: 'I am the law in this village. And you are dead!' },
    narrative: ['The village of Ashford burns.', 'Bandits swarm the streets.', 'Fight through 10 waves to escape!'],
    xpReward: 80, goldReward: 30, techReward: null,
    outro: 'You escaped the burning village. Your journey begins.',
    dialog: [
      { speaker: 'Village Elder', text: 'The darkness stirs beyond the walls. You must prepare yourself.', icon: '👴' },
      { speaker: 'You', text: 'I\'m ready. What must I do?', icon: '🗡️' },
      { speaker: 'Village Elder', text: 'Clear the bandits from the forest. Show them the strength of the Ascendant.', icon: '👴' },
    ],
    stageLines: [
      'A bandit scout blocks the road.',
      'A torch-wielding thug charges.',
      'A scarred brawler swings wildly.',
      'A crossbowman takes aim from the rooftop.',
      'An arsonist hurls a burning bottle.',
      'A masked rogue drops from the shadows.',
      'A massive iron brute blocks the gate.',
      'A battle-hardened bandit veteran steps up.',
      'The bandit champion draws twin blades.',
      'The Bandit Captain steps forward, furious.',
    ],
  },
  {
    id: 'ch2', title: 'The Dark Forest', num: 'Chapter 2',
    desc: 'Ancient evil stirs in the forest depths.',
    levelReq: 4,
    baseEnemy: { name: 'Forest Sprite', icon: '🌿', hp: 55, atk: 10, def: 2, spd: 7 },
    bossEnemy: { name: 'Forest Wraith', icon: '👻', hp: 280, atk: 22, def: 6, spd: 12, intro: 'You dare enter my forest?!' },
    narrative: ['The trees twist and groan.', 'Dark spirits haunt every shadow.', 'Survive 10 encounters to reach the heart.'],
    xpReward: 200, goldReward: 80, techReward: 'quick_step',
    outro: 'The wraith dissolves. You find a scroll teaching Quick Step.',
    dialog: [
      { speaker: 'Forest Guide', text: 'The forest was not always like this. A corruption has taken root.', icon: '🧝' },
      { speaker: 'You', text: 'I can feel it. The trees are crying out.', icon: '🗡️' },
    ],
    stageLines: [
      'A glowing sprite darts at you.',
      'Thorned vines lash out.',
      'A shadow hound snarls.',
      'A corrupted deer charges.',
      'A will-o-wisp blinds you.',
      'A bark golem rises.',
      'A swarm of dark moths attacks.',
      'A twisted dryad screams.',
      'A shadow wolf lunges.',
      'The Forest Wraith materializes.',
    ],
  },
  {
    id: 'ch3', title: 'The Ruined City', num: 'Chapter 3',
    desc: 'An ancient city holds dark secrets.',
    levelReq: 10,
    baseEnemy: { name: 'Stone Sentinel', icon: '🗿', hp: 140, atk: 22, def: 10, spd: 4 },
    bossEnemy: { name: 'City Guardian', icon: '🤖', hp: 600, atk: 40, def: 20, spd: 7, intro: 'INTRUDER DETECTED. INITIATING ELIMINATION.' },
    narrative: ['The ruins of Valdris stretch before you.', 'Automated constructs patrol the streets.', 'Destroy 10 sentinels to reach the core.'],
    xpReward: 500, goldReward: 200, techReward: 'war_cry',
    outro: 'The guardian crumbles. You find an ancient war manual.',
    dialog: [
      { speaker: 'Ghost of Valdris', text: 'This city once thrived. Now only machines remain to guard its bones.', icon: '👻' },
      { speaker: 'You', text: 'What happened here?', icon: '🗡️' },
      { speaker: 'Ghost of Valdris', text: 'The same darkness you fight now. It consumed us all. Do not let it consume you.', icon: '👻' },
    ],
    stageLines: [
      'A stone sentinel activates.',
      'Two patrol drones converge.',
      'A spiked automaton rolls forward.',
      'A laser turret locks on.',
      'A hulking iron golem stomps.',
      'A swarm of micro-drones attacks.',
      'A plasma cannon charges.',
      'An armored war-machine advances.',
      'The defense grid overloads.',
      'The City Guardian awakens.',
    ],
  },
  {
    id: 'ch4', title: 'The Betrayal', num: 'Chapter 4',
    desc: 'Your mentor reveals their true allegiance.',
    levelReq: 18,
    baseEnemy: { name: 'Kael\'s Disciple', icon: '🧙', hp: 260, atk: 42, def: 15, spd: 18 },
    bossEnemy: { name: 'Master Kael', icon: '🔮', hp: 900, atk: 65, def: 28, spd: 25, intro: 'I trained you only to harvest your power.' },
    narrative: ['Master Kael\'s disciples block your path.', 'Each one fights with your own techniques.', 'Defeat 10 to face your former master.'],
    xpReward: 1000, goldReward: 400, techReward: 'holy_slash',
    outro: 'Kael falls. "The demon lord awaits in the Abyss."',
    dialog: [
      { speaker: 'Kael', text: 'You were my greatest student. And my greatest mistake.', icon: '🔮' },
      { speaker: 'You', text: 'You taught me everything — so I could surpass you.', icon: '🗡️' },
      { speaker: 'Kael', text: 'Surpass me? You cannot even fathom the power I wield now.', icon: '🔮' },
    ],
    stageLines: [
      'A hooded disciple attacks.',
      'A shadow mage casts a curse.',
      'A blade dancer spins toward you.',
      'A poison assassin strikes.',
      'A fire adept hurls flames.',
      'A frost mage freezes the air.',
      'A lightning caller summons a storm.',
      'A void walker phases in.',
      'Kael\'s champion steps forward.',
      'Master Kael himself appears.',
    ],
  },
  {
    id: 'ch5', title: 'The Abyss Gate', num: 'Chapter 5',
    desc: 'The gate to the demon realm opens.',
    levelReq: 28,
    baseEnemy: { name: 'Abyss Soldier', icon: '👿', hp: 500, atk: 68, def: 28, spd: 22 },
    bossEnemy: { name: 'Abyss Herald', icon: '🔱', hp: 1800, atk: 100, def: 45, spd: 32, intro: 'None shall pass the gate of eternity.' },
    narrative: ['The sky tears open above the mountain.', 'Demon soldiers pour through the rift.', 'Fight through 10 waves to reach the Herald.'],
    xpReward: 2500, goldReward: 1000, techReward: 'shadow_clone',
    outro: 'The Herald shatters. The gate swings open.',
    dialog: [
      { speaker: 'Herald', text: 'Welcome, mortal. You stand before the gate of eternity.', icon: '🔱' },
      { speaker: 'You', text: 'I didn\'t come here to talk. Open the gate or I\'ll open it myself.', icon: '🗡️' },
    ],
    stageLines: [
      'A demon scout charges.',
      'A hellhound leaps.',
      'A lava golem erupts.',
      'A shadow fiend materializes.',
      'A bone archer fires.',
      'A chaos knight charges.',
      'A soul reaper swings its scythe.',
      'A demon warlord roars.',
      'The gate guardian awakens.',
      'The Abyss Herald descends.',
    ],
  },
  {
    id: 'ch6', title: 'The Final Confrontation', num: 'Chapter 6',
    desc: 'Face the Demon Lord Vael and end the darkness.',
    levelReq: 40,
    baseEnemy: { name: "Vael's Champion", icon: '😈', hp: 1200, atk: 110, def: 55, spd: 28 },
    bossEnemy: { name: 'Demon Lord Vael', icon: '👹', hp: 4000, atk: 160, def: 80, spd: 40, intro: "I have waited an eternity for a worthy soul to consume." },
    narrative: ['The demon realm burns around you.', "Vael's champions stand between you and him.", 'Defeat all 10 to face the Demon Lord himself.'],
    xpReward: 10000, goldReward: 5000, techReward: 'hellfire',
    outro: 'Vael dissolves into light. The world is saved. But a new darkness stirs...',
    dialog: [
      { speaker: 'Demon Sentry', text: 'The master has been expecting you, hero.', icon: '😈' },
      { speaker: 'You', text: 'Then he won\'t be disappointed.', icon: '🗡️' },
      { speaker: 'Demon Sentry', text: 'Oh, he won\'t. He will feast on your soul tonight.', icon: '😈' },
    ],
    stageLines: [
      'A demon champion attacks.',
      'A void knight charges.',
      'A hellfire mage unleashes flames.',
      'A shadow titan stomps forward.',
      'A soul devourer screams.',
      'A chaos dragon swoops.',
      'A blood knight charges.',
      'A dark seraph descends.',
      "Vael's right hand steps forward.",
      'Demon Lord Vael rises from his throne.',
    ],
  },
  {
    id: 'ch7', title: 'Ashes of the Realm', num: 'Chapter 7',
    desc: 'Vael is gone but his generals remain. The realm still burns.',
    levelReq: 45,
    baseEnemy: { name: 'Ash Soldier', icon: '🔥', hp: 1800, atk: 140, def: 70, spd: 35 },
    bossEnemy: { name: 'General Malachar', icon: '💀', hp: 6000, atk: 200, def: 100, spd: 45, intro: "Vael may be gone, but I will finish what he started!" },
    narrative: ['The demon realm smolders.', "Vael's generals refuse to surrender.", 'You must destroy them all.'],
    xpReward: 18000, goldReward: 8000, techReward: 'void_rend',
    outro: 'Malachar falls. Two generals remain.',
    dialog: [
      { speaker: 'Wounded Soldier', text: 'The generals are gathering their forces. We cannot hold them.', icon: '🩸' },
      { speaker: 'You', text: 'You won\'t have to. Leave them to me.', icon: '🗡️' },
    ],
    stageLines: [
      'An ash soldier rises from the embers.',
      'A lava beast erupts.',
      'A bone colossus charges.',
      'A shadow reaper materializes.',
      'A flame titan roars.',
      'A void stalker phases in.',
      'A death knight raises its sword.',
      'A chaos elemental swirls.',
      'A demon warlord charges.',
      'General Malachar descends.',
    ],
  },
  {
    id: 'ch8', title: 'The Void Between Worlds', num: 'Chapter 8',
    desc: 'A rift to the void opens. Something ancient stirs within.',
    levelReq: 52,
    baseEnemy: { name: 'Void Spawn', icon: '🌑', hp: 2500, atk: 180, def: 90, spd: 42 },
    bossEnemy: { name: 'The Void Sovereign', icon: '🌀', hp: 9000, atk: 260, def: 130, spd: 55, intro: "You are nothing. The void consumes all." },
    narrative: ['Reality fractures around you.', 'Void creatures pour through the rift.', 'The Void Sovereign watches from the darkness.'],
    xpReward: 30000, goldReward: 14000, techReward: 'divine_heal',
    outro: 'The Void Sovereign shatters. The rift begins to close.',
    dialog: [
      { speaker: 'Void Seer', text: 'You peer into the void... and the void peers back.', icon: '🌑' },
      { speaker: 'You', text: 'Then let it look. It will see only fire.', icon: '🗡️' },
      { speaker: 'Void Seer', text: 'The Void Sovereign does not fear fire. It fears nothing.', icon: '🌑' },
    ],
    stageLines: [
      'A void spawn tears through reality.',
      'A null beast phases in.',
      'A dark matter golem forms.',
      'A reality shredder attacks.',
      'A void leviathan surfaces.',
      'A chaos wraith screams.',
      'A null knight charges.',
      'A void titan stomps.',
      'The Sovereign\'s herald appears.',
      'The Void Sovereign manifests.',
    ],
  },
  {
    id: 'ch9', title: 'The Celestial War', num: 'Chapter 9',
    desc: 'Fallen angels wage war on the mortal realm. Heaven itself is corrupted.',
    levelReq: 60,
    baseEnemy: { name: 'Fallen Seraph', icon: '🪽', hp: 3500, atk: 230, def: 115, spd: 50 },
    bossEnemy: { name: 'Archangel Zephyros', icon: '⚡', hp: 14000, atk: 340, def: 170, spd: 65, intro: "Mortals were never meant to reach this height. I will cast you down!" },
    narrative: ['The sky tears open with divine light.', 'Fallen angels descend with righteous fury.', 'Even heaven has been corrupted.'],
    xpReward: 55000, goldReward: 25000, techReward: 'holy_slash',
    outro: 'Zephyros falls. The celestial war ends. One final threat remains.',
    dialog: [
      { speaker: 'Fallen Seraph', text: 'You dare challenge the heavens themselves?', icon: '🪽' },
      { speaker: 'You', text: 'Heaven or hell, I will cut through anything that threatens the world.', icon: '🗡️' },
    ],
    stageLines: [
      'A fallen seraph dives.',
      'A divine construct activates.',
      'A holy knight charges.',
      'A celestial golem rises.',
      'A thunder angel strikes.',
      'A light reaper descends.',
      'A divine titan manifests.',
      'A seraph commander attacks.',
      'Zephyros\'s champion steps forward.',
      'Archangel Zephyros descends.',
    ],
  },
  {
    id: 'ch10', title: 'The Origin', num: 'Chapter 10 — TRUE FINALE',
    desc: 'The source of all darkness. The being that created the Demon Lord. The Origin.',
    levelReq: 70,
    baseEnemy: { name: 'Origin Fragment', icon: '🔮', hp: 5000, atk: 300, def: 150, spd: 60 },
    bossEnemy: { name: 'The Origin', icon: '✨', hp: 25000, atk: 450, def: 220, spd: 80, intro: "I am the beginning and the end. Every hero, every villain — all part of my design. And now... you end." },
    narrative: ['Beyond the void, beyond heaven.', 'The Origin — the source of all evil — waits.', 'This is the true final battle.', 'Everything has led to this moment.'],
    xpReward: 150000, goldReward: 80000, techReward: 'elixir_of_gods',
    outro: 'The Origin dissolves into pure light. The darkness is gone forever. You are the greatest hero who ever lived. (Rebirth to transcend even further)',
    dialog: [
      { speaker: 'The Origin', text: 'Every battle you fought, I orchestrated. Every victory, mine to grant.', icon: '✨' },
      { speaker: 'You', text: 'Then I\'ll make this one count. The final victory is mine.', icon: '🗡️' },
      { speaker: 'The Origin', text: 'So bold. So naive. Let us see if heroism can survive infinity.', icon: '✨' },
    ],
    stageLines: [
      'An origin fragment tears reality.',
      'A primordial beast awakens.',
      'A creation golem rises.',
      'A fate weaver attacks.',
      'A destiny reaper swings.',
      'A cosmic titan manifests.',
      'A universe shard explodes.',
      'A reality anchor breaks.',
      'The Origin\'s avatar descends.',
      'The Origin itself awakens.',
    ],
  },
  {
    id: 'ch11', title: 'The Shattered Timeline', num: 'Chapter 11',
    desc: 'Time fractures around you. Past, present, and future collide.',
    levelReq: 75,
    baseEnemy: { name: 'Time Wraith', icon: '⏳', hp: 800, atk: 200, def: 60, spd: 50 },
    bossEnemy: { name: 'Chronarch', icon: '🕰️', hp: 2400, atk: 400, def: 90, spd: 60, intro: 'Your past, present, and future all end at my hands.' },
    narrative: ['The timeline shatters like glass.', 'Echoes of battles past and future swirl around you.', 'Defeat the Time Wraiths to mend the fractures.', 'The Chronarch waits at the end of time itself.'],
    xpReward: 200000, goldReward: 100000, techReward: 'chrono_strike',
    outro: 'The Chronarch falls and the timeline stabilizes. You master Chrono Strike.',
    stageLines: [
      'A time wraith flickers into view.',
      'A temporal echo charges.',
      'A past-self variant attacks.',
      'A future specter phases in.',
      'A chronoshard explodes.',
      'A loop guardian blocks the path.',
      'A paradox beast roars.',
      'A timeline fragment crumbles.',
      'The Chronarch\'s sentinel steps forward.',
      'The Chronarch emerges from the timestream.',
    ],
    dialog: [
      { speaker: 'Temporal Guide', text: 'The timeline is fracturing. Every moment is becoming a battlefield.', icon: '⏳' },
      { speaker: 'You', text: 'I can see it — versions of myself, fighting in wars that haven\'t happened yet.', icon: '🗡️' },
      { speaker: 'Temporal Guide', text: 'Only you can walk between them. Only you can stop the Chronarch.', icon: '⏳' },
    ],
  },
  {
    id: 'ch12', title: 'The Void\'s Heart', num: 'Chapter 12',
    desc: 'You descend into the deepest void, where darkness itself is alive.',
    levelReq: 80,
    baseEnemy: { name: 'Void Colossus', icon: '🕳️', hp: 1200, atk: 280, def: 90, spd: 40 },
    bossEnemy: { name: 'Void Mother', icon: '🌑', hp: 3600, atk: 560, def: 135, spd: 48, intro: 'I am the heart of all voids. You stand in my domain now, mortal.' },
    narrative: ['The void deepens beyond comprehension.', 'Colossal void beings guard the darkness.', 'Every step forward is a step into oblivion.', 'The Void Mother pulses at the center of everything.'],
    xpReward: 350000, goldReward: 180000, techReward: 'void_nova',
    outro: 'The Void Mother implodes, creating a burst of pure energy. You master Void Nova.',
    stageLines: [
      'A void colossus trembles awake.',
      'A dark matter wave crashes.',
      'A null titan rises.',
      'A shadow of nothing lunges.',
      'A void parasite latches on.',
      'A gravity well distorts the air.',
      'A void leviathan emerges.',
      'A darkness elemental swarms.',
      'The Void Mother\'s herald appears.',
      'The Void Mother manifests fully.',
    ],
    dialog: [
      { speaker: 'Void Walker', text: 'You\'ve gone deeper than any mortal has survived. Turn back.', icon: '🕳️' },
      { speaker: 'You', text: 'I\'ve come too far to turn back. The heart of the void must be destroyed.', icon: '🗡️' },
    ],
  },
  {
    id: 'ch13', title: 'Celestial Ascension', num: 'Chapter 13',
    desc: 'Ascend beyond mortality. The celestial realm opens its gates — and its guardians.',
    levelReq: 85,
    baseEnemy: { name: 'Celestial Guardian', icon: '🌟', hp: 1600, atk: 350, def: 120, spd: 55 },
    bossEnemy: { name: 'Solarius', icon: '☀️', hp: 4800, atk: 700, def: 180, spd: 66, intro: 'Mortal flesh cannot endure this light. You will be purified... or destroyed.' },
    narrative: ['The gates of the celestial realm swing open.', 'Guardians of pure light block your ascent.', 'Only the worthy may reach the summit.', 'Solarius judges all who dare approach.'],
    xpReward: 500000, goldReward: 300000, techReward: 'celestial_wrath',
    outro: 'Solarius bows before your strength. You master Celestial Wrath.',
    stageLines: [
      'A celestial guardian descends.',
      'A starfire knight attacks.',
      'A solar golem rises.',
      'A light conduit fires.',
      'A constellation beast roars.',
      'A nova striker charges.',
      'A divine wind blasts.',
      'A cosmos sentinel blocks.',
      'Solarius\'s chosen champion steps forth.',
      'Solarius awakens in blinding light.',
    ],
    dialog: [
      { speaker: 'Celestial Herald', text: 'Few mortals have reached these heights. Your power is... unexpected.', icon: '🌟' },
      { speaker: 'You', text: 'I\'m not here for glory. I\'m here because the void threatened everything.', icon: '🗡️' },
      { speaker: 'Celestial Herald', text: 'Then prove your resolve. Solarius will test every fiber of your being.', icon: '🌟' },
    ],
  },
  {
    id: 'ch14', title: 'The Nexus Point', num: 'Chapter 14',
    desc: 'All realities converge at the Nexus Point. The multiverse hangs in the balance.',
    levelReq: 90,
    baseEnemy: { name: 'Nexus Watcher', icon: '🔮', hp: 2000, atk: 420, def: 150, spd: 60 },
    bossEnemy: { name: 'Nexus Arbiter', icon: '💎', hp: 6000, atk: 840, def: 225, spd: 72, intro: 'I am the keeper of all realities. You will not unbalance the scales.' },
    narrative: ['The Nexus Point draws all realities together.', 'Watchers guard the convergence.', 'Each reality bleeds into the next.', 'The Arbiter maintains the balance of everything that exists.'],
    xpReward: 750000, goldReward: 500000, techReward: 'nexus_storm',
    outro: 'The Arbiter falls. The Nexus destabilizes. You master Nexus Storm.',
    stageLines: [
      'A nexus watcher phases in.',
      'A reality shard strikes.',
      'A multiverse echo charges.',
      'A dimensional rip tears open.',
      'A convergence golem forms.',
      'A plane walker attacks.',
      'A reality anchor shatters.',
      'A dimensional titan emerges.',
      'The Arbiter\'s sentinel stands firm.',
      'The Nexus Arbiter manifests across realities.',
    ],
    dialog: [
      { speaker: 'Nexus Arbiter', text: 'Every reality, every timeline — I have seen them all. You are but one thread.', icon: '💎' },
      { speaker: 'You', text: 'One thread is all I need to unravel your control.', icon: '🗡️' },
      { speaker: 'Nexus Arbiter', text: 'Bold words from a speck of dust. Let us see if you can survive infinity.', icon: '💎' },
    ],
  },
  {
    id: 'ch15', title: 'Beyond Infinity', num: 'Chapter 15 — THE END',
    desc: 'The final frontier. Beyond time, beyond void, beyond everything. This is the end of all things.',
    levelReq: 95,
    baseEnemy: { name: 'The Infinite', icon: '♾️', hp: 3000, atk: 600, def: 200, spd: 80 },
    bossEnemy: { name: 'Omega', icon: '🌀', hp: 9000, atk: 1200, def: 300, spd: 96, intro: 'I am Omega. I am the end. Every story ends with me. Even yours.' },
    narrative: ['Beyond infinity, there is only silence.', 'The Infinite stretches in every direction.', 'This is where all journeys end.', 'Face Omega — the end of all things.'],
    xpReward: 1000000, goldReward: 800000, techReward: null,
    outro: 'Omega dissolves into nothingness. You have gone beyond infinity itself. The ultimate Ascendant. Your legend is eternal.',
    stageLines: [
      'The Infinite manifests before you.',
      'An endless wave crashes.',
      'A boundless entity attacks.',
      'A formless void screams.',
      'An eternal guardian stands.',
      'A limitless titan rises.',
      'An absolute zero freezes.',
      'A total collapse begins.',
      'Omega\'s final herald appears.',
      'Omega awakens at the end of everything.',
    ],
    dialog: [
      { speaker: 'The Infinite', text: 'There is no beyond. I am everything. I am nothing. I am forever.', icon: '♾️' },
      { speaker: 'You', text: 'I\'ve fought through darkness, void, heaven, and time itself. I don\'t stop.', icon: '🗡️' },
      { speaker: 'The Infinite', text: 'Then come, Ascendant. Let us see if your story truly has no end.', icon: '♾️' },
    ],
  },
];

const STAGES_PER_CHAPTER = 10;

let currentChapterId = null;
let currentStage = 0; // 0-indexed, 0-8 = normal, 9 = boss

function getStageEnemy(chapter, stage) {
  const isLast = stage === STAGES_PER_CHAPTER - 1;
  const p = G.player;

  // Name variants to avoid repetition
  const ENEMY_PREFIXES = ['', 'Elite ', 'Veteran ', 'Ancient ', 'Cursed ', 'Shadow ', 'Infernal ', 'Void ', 'Corrupted ', 'Savage '];
  const stagePrefix = ENEMY_PREFIXES[Math.min(stage, ENEMY_PREFIXES.length - 1)];

  // Scale factor: enemies scale hard with player level — always threatening
  // Base multiplier 3.5 + level * 0.18 makes even early enemies dangerous
  const levelScale = 3.5 + (p.level * 0.18);

  if (isLast) {
    const b = chapter.bossEnemy;
    return {
      ...b,
      hp:   Math.floor(b.hp  * levelScale),
      maxHp:Math.floor(b.hp  * levelScale),
      atk:  Math.floor(b.atk * levelScale),
      def:  Math.floor(b.def * levelScale),
      spd:  Math.floor(b.spd * levelScale),
    };
  }

  // Use per-stage enemy variants if defined
  if (chapter.stageEnemies && chapter.stageEnemies[stage]) {
    const e = chapter.stageEnemies[stage];
    // Stage scaling: each stage within chapter gets significantly harder
    const stageScale = levelScale * (1 + stage * 0.18);
    return {
      ...e,
      hp:   Math.floor(e.hp  * stageScale),
      maxHp:Math.floor(e.hp  * stageScale),
      atk:  Math.floor(e.atk * stageScale),
      def:  Math.floor(e.def * stageScale),
      spd:  Math.floor(e.spd * stageScale),
    };
  }

  // Fallback: scale base enemy
  const scale = levelScale * (1 + stage * 0.1);
  const b = chapter.baseEnemy;
  return {
    name: stagePrefix + b.name,
    icon: b.icon,
    hp:   Math.floor(b.hp  * scale),
    maxHp:Math.floor(b.hp  * scale),
    atk:  Math.floor(b.atk * scale),
    def:  Math.floor(b.def * scale),
    spd:  Math.floor(b.spd * scale),
    intro: null,
  };
}

function startChapter(chapterId) {
  const chapter = STORY_CHAPTERS.find(c => c.id === chapterId);
  if (!chapter) return;
  const p = G.player;
  if (p.level < chapter.levelReq) { toast(`Requires level ${chapter.levelReq}`, 'warn'); return; }

  currentChapterId = chapterId;
  // Resume from saved stage progress
  currentStage = (p.storyStageProgress && p.storyStageProgress[chapterId]) || 0;

  const log = document.getElementById('battle-log');
  document.getElementById('story-chapters').classList.add('hidden');
  document.getElementById('story-battle').classList.remove('hidden');
  document.getElementById('battle-result').classList.add('hidden');

  if (log) {
    log.innerHTML = '';
    // Styled narrative intro
    const introHtml = chapter.narrative.map(line => `<div class="story-narrative-line">${line}</div>`).join('');
    log.innerHTML = `<div class="story-intro-block">${introHtml}</div>`;
  }

  if (chapter.dialog && chapter.dialog.length > 0) {
    showDialogSequence(chapter.dialog, 0, chapter);
  } else {
    updateStageUI(chapter);
    startStageEnemy(chapter);
  }
}

function showDialogSequence(dialog, index, chapter) {
  const log = document.getElementById('battle-log');
  if (!log || index >= dialog.length) {
    updateStageUI(chapter);
    startStageEnemy(chapter);
    return;
  }

  const entry = dialog[index];
  const remaining = dialog.length - index;
  const box = document.createElement('div');
  box.className = 'story-dialog-box';
  box.innerHTML = `
    <div class="story-dialog-speaker"><span>${entry.icon}</span> ${entry.speaker}</div>
    <div class="story-dialog-text">${entry.text}</div>
    <button class="btn-primary story-dialog-continue" id="dialog-continue-btn">Continue${remaining > 1 ? ` (${remaining - 1} left)` : ''}</button>
  `;
  log.appendChild(box);
  log.scrollTop = log.scrollHeight;

  document.getElementById('dialog-continue-btn').addEventListener('click', () => {
    box.remove();
    showDialogSequence(dialog, index + 1, chapter);
  });
}

function updateStageUI(chapter) {
  const label = document.getElementById('stage-label');
  if (label) label.textContent = `Stage ${currentStage + 1} / ${STAGES_PER_CHAPTER}`;

  const pips = document.getElementById('stage-pips');
  if (pips) {
    pips.innerHTML = Array.from({ length: STAGES_PER_CHAPTER }, (_, i) => {
      const done = i < currentStage;
      const current = i === currentStage;
      const isBoss = i === STAGES_PER_CHAPTER - 1;
      return `<div class="stage-pip${done ? ' pip-done' : ''}${current ? ' pip-current' : ''}${isBoss ? ' pip-boss' : ''}" title="Stage ${i+1}"></div>`;
    }).join('');
  }
}

function startStageEnemy(chapter) {
  const enemy = getStageEnemy(chapter, currentStage);
  const log = document.getElementById('battle-log');
  const stageLine = chapter.stageLines && chapter.stageLines[currentStage];
  if (stageLine && log) appendLog(log, `📍 Stage ${currentStage + 1}: ${stageLine}`, 'log-story');

  startStoryBattle(enemy, (won) => {
    if (won === true) {
      // Save stage progress
      if (!G.player.storyStageProgress) G.player.storyStageProgress = {};
      currentStage++;
      G.player.storyStageProgress[currentChapterId] = currentStage;

      if (currentStage >= STAGES_PER_CHAPTER) {
        onChapterComplete(chapter);
      } else {
        updateStageUI(chapter);
        setTimeout(() => startStageEnemy(chapter), 800);
      }
    }
    // lost or fled: stay on result screen
  });
}

function onChapterComplete(chapter) {
  const p = G.player;
  if (!p.completedChapters.includes(chapter.id)) {
    p.completedChapters.push(chapter.id);
  }
  // Reset stage progress for replay
  if (p.storyStageProgress) p.storyStageProgress[chapter.id] = 0;

  gainXP(chapter.xpReward);
  const gold = gainGold(chapter.goldReward);
  if (chapter.techReward) grantTechnique(chapter.techReward);

  // Drop alchemy ingredients
  const drops = STORY_INGREDIENT_DROPS[chapter.id];
  if (drops) {
    drops.forEach(id => {
      const count = Math.floor(1 + Math.random() * 2);
      addIngredient(id, count);
      const ing = ALCHEMY_INGREDIENTS.find(i => i.id === id);
      if (ing) toast(`🧴 Found ${count}x ${ing.name}!`, 'info');
    });
  }

  const log = document.getElementById('battle-log');
  appendLog(log, `📖 ${chapter.outro}`, 'log-story');

  const resultEl = document.getElementById('battle-result');
  const resultText = document.getElementById('result-text');
  resultEl.classList.remove('hidden');
  resultText.textContent = `🏆 Chapter Complete! +${chapter.xpReward} XP, +${gold} Gold`;
  resultText.style.color = 'var(--success)';

  renderStoryChapters();
  renderInventory();
}

function renderStoryChapters() {
  const container = document.getElementById('story-chapters');
  if (!container) return;
  const p = G.player;

  container.innerHTML = STORY_CHAPTERS.map((ch, i) => {
    const locked = p.level < ch.levelReq;
    const completed = p.completedChapters.includes(ch.id);
    const prevCompleted = i === 0 || p.completedChapters.includes(STORY_CHAPTERS[i - 1].id);
    const available = !locked && prevCompleted;
    const savedStage = (p.storyStageProgress && p.storyStageProgress[ch.id]) || 0;
    const stagePct = Math.floor((savedStage / STAGES_PER_CHAPTER) * 100);

    return `
      <div class="card chapter-card ${completed ? 'completed' : ''} ${!available ? 'locked' : ''}" ${!available ? `onclick="toast('🔒 ${locked ? 'Requires Level ' + ch.levelReq : 'Complete previous chapter first'}','warn')"` : ''}>
        <div class="chapter-num">${ch.num}</div>
        <h3>${ch.title}</h3>
        <div class="card-desc">${ch.desc}</div>
        <div class="card-stats">
          <span>✨ ${ch.xpReward} XP</span>
          <span>💰 ${ch.goldReward} G</span>
          ${ch.techReward ? `<span class="highlight">🎁 Technique</span>` : ''}
        </div>
        ${available && !completed ? `
          <div class="progress-bar-wrap" title="${savedStage}/${STAGES_PER_CHAPTER} stages">
            <div class="bar-track"><div class="bar xp-bar" style="width:${stagePct}%"></div></div>
          </div>
          <div style="font-size:11px;color:var(--text-dim);margin-bottom:8px">Stage ${savedStage}/${STAGES_PER_CHAPTER}</div>
        ` : ''}
        ${!available
          ? `<div class="card-locked">🔒 ${locked ? `Requires Lv.${ch.levelReq}` : 'Complete previous chapter'}</div>`
          : `<button class="btn-primary" onclick="startChapter('${ch.id}')">${completed ? '📖 Replay' : savedStage > 0 ? `▶ Resume (${savedStage}/${STAGES_PER_CHAPTER})` : '▶ Begin'}</button>`
        }
      </div>
    `;
  }).join('');
}

// Continue / back button
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-continue-story')?.addEventListener('click', () => {
    document.getElementById('story-battle').classList.add('hidden');
    document.getElementById('story-chapters').classList.remove('hidden');
    document.getElementById('battle-result').classList.add('hidden');
    combatActive = false;
    renderStoryChapters();
  });
});
