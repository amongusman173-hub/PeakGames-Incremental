// ===== CASINO SYSTEM =====
// Spend gold to play games and win big!

const CASINO = {
  slots: {
    name: 'Slot Machine',
    icon: '🎰',
    cost: 50,
    desc: 'Match symbols to win! 3 matching = jackpot.',
  },
  blackjack: {
    name: 'Blackjack',
    icon: '🃏',
    cost: 100,
    desc: 'Beat the dealer to 21 without going over.',
  },
  dice: {
    name: 'Dice Roll',
    icon: '🎲',
    cost: 25,
    desc: 'Roll higher than the house to win 2×.',
  },
  wheel: {
    name: 'Wheel of Fortune',
    icon: '🎡',
    cost: 75,
    desc: 'Spin the wheel for a random multiplier!',
  },
};

let casinoGold = 0;

function renderCasino() {
  const container = document.getElementById('casino-container');
  if (!container) return;
  const p = G.player;
  casinoGold = Math.floor(p.gold);

  const stats = p.casinoStats || { played: 0, won: 0, lost: 0, biggestWin: 0 };

  container.innerHTML = `
    <div class="casino-balance">
      <span class="casino-balance-label">Your Gold</span>
      <span class="casino-balance-amount">💰 ${casinoGold.toLocaleString()}</span>
    </div>
    <div class="casino-stats-row">
      <span>Played: ${stats.played}</span>
      <span>Won: ${stats.won}</span>
      <span>Lost: ${stats.lost}</span>
      <span>Best Win: 💰 ${stats.biggestWin.toLocaleString()}</span>
    </div>
    <div class="casino-games">
      ${renderSlots()}
      ${renderBlackjack()}
      ${renderDice()}
      ${renderWheel()}
    </div>
  `;
}

// ===== SLOTS =====
function renderSlots() {
  const g = CASINO.slots;
  return `<div class="casino-card">
    <div class="casino-card-header">${g.icon} ${g.name}</div>
    <div class="casino-card-desc">${g.desc}</div>
    <div class="casino-card-cost">Cost: 💰 ${g.cost} gold</div>
    <div class="casino-slots-display" id="slots-display">
      <span class="slot-reel">❓</span>
      <span class="slot-reel">❓</span>
      <span class="slot-reel">❓</span>
    </div>
    <button class="btn-primary casino-spin-btn" id="btn-slots-spin" onclick="playSlots()">🎰 Spin!</button>
  </div>`;
}

const SLOT_SYMBOLS = ['💎', '👑', '⭐', '🔔', '🍒', '🍀', '7️⃣'];
const SLOT_WEIGHTS = [5, 8, 12, 15, 20, 25, 15];

function rollSlot() {
  const totalWeight = SLOT_WEIGHTS.reduce((a, b) => a + b, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < SLOT_SYMBOLS.length; i++) {
    r -= SLOT_WEIGHTS[i];
    if (r <= 0) return SLOT_SYMBOLS[i];
  }
  return SLOT_SYMBOLS[0];
}

function playSlots() {
  const p = G.player;
  const cost = CASINO.slots.cost;
  if (p.gold < cost) { toast('Not enough gold!', 'warn'); return; }

  p.gold -= cost;
  p.casinoStats = p.casinoStats || { played: 0, won: 0, lost: 0, biggestWin: 0 };
  p.casinoStats.played++;

  const s1 = rollSlot(), s2 = rollSlot(), s3 = rollSlot();
  const reels = document.querySelectorAll('#slots-display .slot-reel');
  const btn = document.getElementById('btn-slots-spin');
  btn.disabled = true;

  // Animate reels
  let count = 0;
  const interval = setInterval(() => {
    reels.forEach(r => r.textContent = SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
    count++;
    if (count >= 15) {
      clearInterval(interval);
      reels[0].textContent = s1;
      reels[1].textContent = s2;
      reels[2].textContent = s3;

      let mult = 0;
      let msg = '';
      if (s1 === s2 && s2 === s3) {
        // Triple match
        if (s1 === '💎') { mult = 20; msg = '💎💎💎 JACKPOT!'; }
        else if (s1 === '👑') { mult = 15; msg = '👑👑👑 ROYAL WIN!'; }
        else if (s1 === '7️⃣') { mult = 10; msg = '7️⃣7️⃣7️⃣ LUCKY 7s!'; }
        else { mult = 5; msg = `${s1}${s1}${s1} TRIPLE!`; }
      } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        mult = 2; msg = 'Two matching! 2×';
      } else {
        mult = 0; msg = 'No match. Try again!';
      }

      const winnings = Math.floor(cost * mult);
      if (winnings > 0) {
        p.gold += winnings;
        p.casinoStats.won++;
        if (winnings > p.casinoStats.biggestWin) p.casinoStats.biggestWin = winnings;
        toast(`${msg} +💰${winnings}`, 'success');
        spawnFloatingText(`+${winnings}💰`, 'float-gold');
      } else {
        p.casinoStats.lost++;
      }

      casinoGold = Math.floor(p.gold);
      updateCasinoBalance();
      btn.disabled = false;
    }
  }, 80);
}

// ===== BLACKJACK =====
let bjState = null;

function renderBlackjack() {
  const g = CASINO.blackjack;
  return `<div class="casino-card">
    <div class="casino-card-header">${g.icon} ${g.name}</div>
    <div class="casino-card-desc">${g.desc}</div>
    <div class="casino-card-cost">Cost: 💰 ${g.cost} gold</div>
    <div class="casino-bj-table" id="bj-table">
      <div class="bj-hand" id="bj-dealer">
        <div class="bj-hand-label">Dealer</div>
        <div class="bj-cards"></div>
        <div class="bj-hand-total"></div>
      </div>
      <div class="bj-hand" id="bj-player">
        <div class="bj-hand-label">You</div>
        <div class="bj-cards"></div>
        <div class="bj-hand-total"></div>
      </div>
    </div>
    <div id="bj-result" class="casino-bj-result"></div>
    <div class="casino-bj-actions">
      <button class="btn-primary" id="bj-deal" onclick="bjDeal()">🃏 Deal</button>
      <button class="btn-small" id="bj-hit" onclick="bjHit()" disabled>Hit</button>
      <button class="btn-small" id="bj-stand" onclick="bjStand()" disabled>Stand</button>
    </div>
  </div>`;
}

function bjCard() {
  const vals = [2,3,4,5,6,7,8,9,10,10,10,10,11];
  const suits = ['♠','♥','♦','♣'];
  const v = vals[Math.floor(Math.random() * vals.length)];
  const s = suits[Math.floor(Math.random() * suits.length)];
  return { v, display: s + (v >= 10 && v !== 11 ? (v === 10 ? '10' : '10') : (v === 11 ? 'A' : v)) };
}

function bjHandTotal(hand) {
  let total = hand.reduce((s, c) => s + c.v, 0);
  let aces = hand.filter(c => c.v === 11).length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function bjRenderHands() {
  const dealer = bjState.dealer;
  const player = bjState.player;
  const dealerEl = document.getElementById('bj-dealer');
  const playerEl = document.getElementById('bj-player');
  if (!dealerEl || !playerEl) return;

  // Dealer: hide second card if not revealed
  const dealerDisplay = bjState.revealed ? dealer : [dealer[0], { v: 0, display: '❓' }];
  dealerEl.querySelector('.bj-cards').innerHTML = dealerDisplay.map(c =>
    `<span class="bj-card">${c.display}</span>`
  ).join('');
  dealerEl.querySelector('.bj-hand-total').textContent = bjState.revealed ? bjHandTotal(dealer) : '?';

  playerEl.querySelector('.bj-cards').innerHTML = player.map(c =>
    `<span class="bj-card">${c.display}</span>`
  ).join('');
  playerEl.querySelector('.bj-hand-total').textContent = bjHandTotal(player);
}

function bjDeal() {
  const p = G.player;
  const cost = CASINO.blackjack.cost;
  if (p.gold < cost) { toast('Not enough gold!', 'warn'); return; }

  p.gold -= cost;
  p.casinoStats = p.casinoStats || { played: 0, won: 0, lost: 0, biggestWin: 0 };
  p.casinoStats.played++;

  bjState = {
    dealer: [bjCard(), bjCard()],
    player: [bjCard(), bjCard()],
    revealed: false,
  };

  bjRenderHands();
  document.getElementById('bj-result').textContent = '';
  document.getElementById('bj-deal').disabled = true;
  document.getElementById('bj-hit').disabled = false;
  document.getElementById('bj-stand').disabled = false;

  // Check for blackjack
  if (bjHandTotal(bjState.player) === 21) {
    bjState.revealed = true;
    bjRenderHands();
    bjEnd('natural');
  }
}

function bjHit() {
  if (!bjState) return;
  bjState.player.push(bjCard());
  bjRenderHands();
  if (bjHandTotal(bjState.player) > 21) {
    bjState.revealed = true;
    bjRenderHands();
    bjEnd('bust');
  }
}

function bjStand() {
  if (!bjState) return;
  bjState.revealed = true;

  // Dealer draws to 17+
  while (bjHandTotal(bjState.dealer) < 17) {
    bjState.dealer.push(bjCard());
  }
  bjRenderHands();
  bjEnd('stand');
}

function bjEnd(reason) {
  const p = G.player;
  const pt = bjHandTotal(bjState.player);
  const dt = bjHandTotal(bjState.dealer);
  const cost = CASINO.blackjack.cost;
  let mult = 0;
  let msg = '';

  if (reason === 'bust') {
    msg = `Bust! ${pt} > 21. You lose.`;
  } else if (reason === 'natural') {
    mult = 2.5; msg = `Blackjack! ${pt}! 2.5× payout!`;
  } else if (dt > 21) {
    mult = 2; msg = `Dealer busts! ${dt} > 21. You win 2×!`;
  } else if (pt > dt) {
    mult = 2; msg = `${pt} vs ${dt}. You win 2×!`;
  } else if (pt === dt) {
    mult = 1; msg = `Push! ${pt} = ${pt}. Bet returned.`;
  } else {
    msg = `${pt} vs ${dt}. Dealer wins.`;
  }

  const winnings = Math.floor(cost * mult);
  if (winnings > 0) {
    p.gold += winnings;
    p.casinoStats.won++;
    if (winnings > p.casinoStats.biggestWin) p.casinoStats.biggestWin = winnings;
    toast(msg + ` +💰${winnings}`, 'success');
  } else {
    p.casinoStats.lost++;
    toast(msg, 'warn');
  }

  document.getElementById('bj-result').textContent = msg;
  document.getElementById('bj-deal').disabled = false;
  document.getElementById('bj-hit').disabled = true;
  document.getElementById('bj-stand').disabled = true;
  casinoGold = Math.floor(p.gold);
  updateCasinoBalance();
}

// ===== DICE =====
function renderDice() {
  const g = CASINO.dice;
  return `<div class="casino-card">
    <div class="casino-card-header">${g.icon} ${g.name}</div>
    <div class="casino-card-desc">${g.desc}</div>
    <div class="casino-card-cost">Cost: 💰 ${g.cost} gold</div>
    <div class="casino-dice-display" id="dice-display">
      <span class="dice-result">🎲 🎲</span>
    </div>
    <button class="btn-primary" onclick="playDice()">🎲 Roll!</button>
  </div>`;
}

function playDice() {
  const p = G.player;
  const cost = CASINO.dice.cost;
  if (p.gold < cost) { toast('Not enough gold!', 'warn'); return; }

  p.gold -= cost;
  p.casinoStats = p.casinoStats || { played: 0, won: 0, lost: 0, biggestWin: 0 };
  p.casinoStats.played++;

  const playerRoll = Math.floor(Math.random() * 6) + 1;
  const houseRoll = Math.floor(Math.random() * 6) + 1;

  document.getElementById('dice-display').innerHTML =
    `<span class="dice-result">You: ${playerRoll} vs House: ${houseRoll}</span>`;

  if (playerRoll > houseRoll) {
    const winnings = cost * 2;
    p.gold += winnings;
    p.casinoStats.won++;
    if (winnings > p.casinoStats.biggestWin) p.casinoStats.biggestWin = winnings;
    toast(`${playerRoll} > ${houseRoll}! You win 2×! +💰${winnings}`, 'success');
    spawnFloatingText(`+${winnings}💰`, 'float-gold');
  } else if (playerRoll === houseRoll) {
    p.gold += cost;
    toast(`${playerRoll} = ${houseRoll}. Push! Bet returned.`);
  } else {
    p.casinoStats.lost++;
    toast(`${playerRoll} < ${houseRoll}. House wins.`, 'warn');
  }

  casinoGold = Math.floor(p.gold);
  updateCasinoBalance();
}

// ===== WHEEL OF FORTUNE =====
const WHEEL_SEGMENTS = [
  { label: '0.5×', mult: 0.5, color: '#e74c3c', weight: 25 },
  { label: '1×', mult: 1, color: '#95a5a6', weight: 30 },
  { label: '1.5×', mult: 1.5, color: '#3498db', weight: 20 },
  { label: '2×', mult: 2, color: '#2ecc71', weight: 12 },
  { label: '3×', mult: 3, color: '#f39c12', weight: 8 },
  { label: '5×', mult: 5, color: '#9b59b6', weight: 4 },
  { label: '10×', mult: 10, color: '#f5c542', weight: 1 },
];

function renderWheel() {
  const g = CASINO.wheel;
  return `<div class="casino-card">
    <div class="casino-card-header">${g.icon} ${g.name}</div>
    <div class="casino-card-desc">${g.desc}</div>
    <div class="casino-card-cost">Cost: 💰 ${g.cost} gold</div>
    <div class="casino-wheel-display" id="wheel-display">
      <div class="wheel-pointer">▼</div>
      <div class="wheel-segments" id="wheel-segments">
        ${WHEEL_SEGMENTS.map(s => `<div class="wheel-seg" style="background:${s.color}">${s.label}</div>`).join('')}
      </div>
    </div>
    <button class="btn-primary" id="btn-wheel-spin" onclick="playWheel()">🎡 Spin!</button>
  </div>`;
}

function playWheel() {
  const p = G.player;
  const cost = CASINO.wheel.cost;
  if (p.gold < cost) { toast('Not enough gold!', 'warn'); return; }

  p.gold -= cost;
  p.casinoStats = p.casinoStats || { played: 0, won: 0, lost: 0, biggestWin: 0 };
  p.casinoStats.played++;

  const btn = document.getElementById('btn-wheel-spin');
  btn.disabled = true;

  // Pick winner based on weights
  const totalWeight = WHEEL_SEGMENTS.reduce((a, s) => a + s.weight, 0);
  let r = Math.random() * totalWeight;
  let winner = WHEEL_SEGMENTS[0];
  for (const s of WHEEL_SEGMENTS) {
    r -= s.weight;
    if (r <= 0) { winner = s; break; }
  }

  const segIndex = WHEEL_SEGMENTS.indexOf(winner);
  const wheelEl = document.getElementById('wheel-segments');
  const segCount = WHEEL_SEGMENTS.length;
  const rotateTo = 360 * 3 + (segIndex / segCount) * 360 + (180 / segCount);

  wheelEl.style.transition = 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheelEl.style.transform = `rotate(-${rotateTo}deg)`;

  setTimeout(() => {
    const winnings = Math.floor(cost * winner.mult);
    p.gold += winnings;
    if (winner.mult >= 1) {
      p.casinoStats.won++;
      if (winnings > p.casinoStats.biggestWin) p.casinoStats.biggestWin = winnings;
    } else {
      p.casinoStats.lost++;
    }

    toast(`Landed on ${winner.label}! ${winner.mult >= 1 ? '+' : ''}💰${winnings - cost}`, winner.mult >= 1 ? 'success' : 'warn');
    if (winner.mult >= 2) spawnFloatingText(`+${winnings}💰`, 'float-gold');

    casinoGold = Math.floor(p.gold);
    updateCasinoBalance();
    btn.disabled = false;

    // Reset wheel for next spin
    setTimeout(() => {
      wheelEl.style.transition = 'none';
      wheelEl.style.transform = 'rotate(0deg)';
    }, 500);
  }, 3200);
}

function updateCasinoBalance() {
  const el = document.querySelector('.casino-balance-amount');
  if (el) el.textContent = `💰 ${casinoGold.toLocaleString()}`;
  const stats = G.player.casinoStats || { played: 0, won: 0, lost: 0, biggestWin: 0 };
  const statsRow = document.querySelector('.casino-stats-row');
  if (statsRow) {
    statsRow.innerHTML = `
      <span>Played: ${stats.played}</span>
      <span>Won: ${stats.won}</span>
      <span>Lost: ${stats.lost}</span>
      <span>Best Win: 💰 ${stats.biggestWin.toLocaleString()}</span>
    `;
  }
}
