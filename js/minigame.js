// ===== COMBAT MINIGAMES =====

let mgActive = false;
let mgResolve = null;
// Track how many times each technique has been used this battle (for alternating)
const mgUseCounts = {};

const MG_CONTAINER = () => document.getElementById('mg-overlay');

function showMinigame(type, difficulty, label, callback, forcedPhrase) {
  // Safety: if mgActive is stuck but overlay is hidden, reset it
  const overlay = MG_CONTAINER();
  if (mgActive && overlay && overlay.classList.contains('hidden')) {
    mgActive = false;
    mgResolve = null;
  }

  if (mgActive) { callback(1); return; }
  mgActive = true;
  mgResolve = callback;

  if (!overlay) { mgActive = false; callback(1); return; }
  overlay.classList.remove('hidden');
  overlay.innerHTML = '';

  switch (type) {
    case 'timing':    buildTimingGame(overlay, difficulty, label); break;
    case 'dual_zone': buildDualZoneGame(overlay, difficulty, label); break;
    case 'sequence':  buildSequenceGame(overlay, difficulty, label); break;
    case 'mash':      buildMashGame(overlay, difficulty, label); break;
    case 'hold':      buildHoldGame(overlay, difficulty, label); break;
    case 'reaction':  buildReactionGame(overlay, difficulty, label); break;
    case 'draw_line': buildDrawLineGame(overlay, difficulty, label); break;
    case 'drag_crush':buildDragCrushGame(overlay, difficulty, label); break;
    case 'quick_tap': buildQuickTapGame(overlay, difficulty, label); break;
    case 'typing':    buildTypingGame(overlay, difficulty, label, forcedPhrase); break;
    case 'x_slash':   buildXSlashGame(overlay, difficulty, label); break;
    case 'triple_slash':   buildTripleSlashGame(overlay, difficulty, label); break;
    case 'arrow_charge':   buildArrowChargeGame(overlay, difficulty, label); break;
    case 'push_mash':      buildPushMashGame(overlay, difficulty, label); break;
    case 'double_push':    buildDoublePushGame(overlay, difficulty, label); break;
    case 'pull_hold':      buildPullHoldGame(overlay, difficulty, label); break;
    case 'gravity_crush':  buildGravityCrushGame(overlay, difficulty, label); break;
    case 'color_merge':    buildColorMergeGame(overlay, difficulty, label); break;
    case 'dodge_tap':      buildDodgeTapGame(overlay, difficulty, label); break;
    case 'rhythm':         buildRhythmGame(overlay, difficulty, label); break;
    case 'balance':        buildBalanceGame(overlay, difficulty, label); break;
    case 'countdown':      buildCountdownGame(overlay, difficulty, label); break;
    case 'multi_mash':     buildMultiMashGame(overlay, difficulty, label); break;
    default:          resolveMinigame(1);
  }
}

function resolveMinigame(mult) {
  mgActive = false;
  const overlay = MG_CONTAINER();
  if (overlay) overlay.classList.add('hidden');
  if (mgResolve) { const cb = mgResolve; mgResolve = null; cb(mult); }
}

// Escape key = abandon minigame with 0.5x mult (safety valve)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && mgActive) {
    e.preventDefault();
    resolveMinigame(0.5);
  }
});

// ── TIMING GAME — single moving bar ──
function buildTimingGame(el, difficulty, label) {
  const zoneW = [50, 28, 14][Math.min(2, difficulty - 1)]; // diff 1 = very wide zone
  const zoneStart = 10 + Math.random() * (80 - zoneW);
  const speed = 0.9 + difficulty * 0.5;
  let pos = 0, dir = 1, raf;
  const timeLimit = 4000 + getSpdMgTimeBonus();

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Click or press <kbd>Space</kbd> when in the <span style="color:var(--ok)">green zone</span>!</div>
    <div class="mg-timing-track" id="mg-track">
      <div class="mg-zone" style="left:${zoneStart}%;width:${zoneW}%"></div>
      <div class="mg-indicator" id="mg-ind"></div>
    </div>
    <button class="btn-primary mg-btn" id="mg-click-btn">⚡ Strike! [Space]</button>
  </div>`;

  const ind = el.querySelector('#mg-ind');
  function animate() {
    pos += speed * dir;
    if (pos >= 100) { pos = 100; dir = -1; }
    if (pos <= 0)   { pos = 0;   dir = 1; }
    ind.style.left = pos + '%';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  const timeout = setTimeout(() => {
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
    showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3));
  }, timeLimit);

  function fire() {
    cancelAnimationFrame(raf);
    clearTimeout(timeout);
    document.removeEventListener('keydown', onKey);
    const inZone = pos >= zoneStart && pos <= zoneStart + zoneW;
    const center = Math.abs(pos - (zoneStart + zoneW / 2)) / (zoneW / 2);
    let mult, msg;
    if (inZone) { mult = center < 0.3 ? 2.0 : 1.5; msg = center < 0.3 ? '💥 PERFECT!' : '✅ Good hit!'; }
    else        { mult = 0.4; msg = '❌ Missed!'; }
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); fire(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-click-btn').addEventListener('click', fire);
}

// ── DUAL ZONE GAME — two zones, hit both in sequence ──
function buildDualZoneGame(el, difficulty, label) {
  const zoneW = [30, 20, 12][Math.min(2, difficulty - 1)];
  const zone1Start = 5 + Math.random() * 35;
  const zone2Start = 55 + Math.random() * 35;
  const speed = 1.0 + difficulty * 0.5;
  let pos = 0, dir = 1, raf;
  let phase = 1; // 1 = hit zone1, 2 = hit zone2

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Hit <span style="color:var(--ok)">BOTH zones</span> in order! [Space]</div>
    <div class="mg-timing-track" id="mg-track">
      <div class="mg-zone" id="mg-z1" style="left:${zone1Start}%;width:${zoneW}%;opacity:1"></div>
      <div class="mg-zone" id="mg-z2" style="left:${zone2Start}%;width:${zoneW}%;background:rgba(245,197,66,0.35);border-color:var(--gold);opacity:0.4"></div>
      <div class="mg-indicator" id="mg-ind"></div>
    </div>
    <div style="font-size:12px;color:var(--dim);margin:4px 0">Phase: <span id="mg-phase">1 / 2</span></div>
    <button class="btn-primary mg-btn" id="mg-click-btn">⚡ Strike! [Space]</button>
  </div>`;

  const ind = el.querySelector('#mg-ind');
  let hit1 = false;

  function animate() {
    pos += speed * dir;
    if (pos >= 100) { pos = 100; dir = -1; }
    if (pos <= 0)   { pos = 0;   dir = 1; }
    ind.style.left = pos + '%';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  const timeout = setTimeout(() => {
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
    showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3));
  }, 5000);

  function fire() {
    if (phase === 1) {
      const inZ1 = pos >= zone1Start && pos <= zone1Start + zoneW;
      if (inZ1) {
        hit1 = true;
        phase = 2;
        el.querySelector('#mg-phase').textContent = '2 / 2';
        el.querySelector('#mg-z1').style.opacity = '0.3';
        el.querySelector('#mg-z2').style.opacity = '1';
      } else {
        cancelAnimationFrame(raf);
        clearTimeout(timeout);
        document.removeEventListener('keydown', onKey);
        showMgResult(el, 0.4, '❌ Missed zone 1!', () => resolveMinigame(0.4));
      }
    } else {
      cancelAnimationFrame(raf);
      clearTimeout(timeout);
      document.removeEventListener('keydown', onKey);
      const inZ2 = pos >= zone2Start && pos <= zone2Start + zoneW;
      const mult = inZ2 ? 2.2 : 0.8;
      const msg  = inZ2 ? '💥 DOUBLE HIT!' : '⚠️ Missed zone 2!';
      showMgResult(el, mult, msg, () => resolveMinigame(mult));
    }
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); fire(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-click-btn').addEventListener('click', fire);
}

// ── REACTION GAME — flash appears, click FAST ──
function buildReactionGame(el, difficulty, label) {
  const baseWindow = [600, 400, 250][Math.min(2, difficulty - 1)];
  const windowMs = baseWindow + getSpdMgTimeBonus();
  let active = false, done = false, startTime = 0;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Click or press <kbd>Space</kbd> the INSTANT it flashes!</div>
    <div id="mg-react-zone" class="mg-react-zone">Wait…</div>
    <button class="btn-primary mg-btn" id="mg-react-btn" disabled>⚡ NOW! [Space]</button>
  </div>`;

  const zone = el.querySelector('#mg-react-zone');
  const btn  = el.querySelector('#mg-react-btn');

  // Random delay 1-3s before flash
  const delay = 1000 + Math.random() * 2000;
  const preTimeout = setTimeout(() => {
    active = true;
    startTime = Date.now();
    zone.textContent = '⚡ NOW!';
    zone.classList.add('mg-react-active');
    btn.disabled = false;

    // Auto-fail if not clicked in time
    setTimeout(() => {
      if (!done) {
        done = true;
        document.removeEventListener('keydown', onKey);
        zone.textContent = 'Too slow!';
        zone.classList.remove('mg-react-active');
        showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3));
      }
    }, windowMs);
  }, delay);

  function fire() {
    if (!active || done) return;
    done = true;
    clearTimeout(preTimeout);
    document.removeEventListener('keydown', onKey);
    const rt = Date.now() - startTime;
    zone.classList.remove('mg-react-active');
    let mult, msg;
    if (rt < windowMs * 0.3)      { mult = 2.2; msg = `💥 LIGHTNING FAST! (${rt}ms)`; }
    else if (rt < windowMs * 0.65) { mult = 1.6; msg = `✅ Quick! (${rt}ms)`; }
    else                           { mult = 1.0; msg = `👍 In time! (${rt}ms)`; }
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  function onKey(e) {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!active) {
        // Clicked too early
        done = true;
        clearTimeout(preTimeout);
        document.removeEventListener('keydown', onKey);
        zone.textContent = 'Too early!';
        showMgResult(el, 0.2, '❌ Too early!', () => resolveMinigame(0.2));
      } else {
        fire();
      }
    }
  }
  document.addEventListener('keydown', onKey);
  btn.addEventListener('click', () => {
    if (!active) {
      done = true;
      clearTimeout(preTimeout);
      document.removeEventListener('keydown', onKey);
      zone.textContent = 'Too early!';
      showMgResult(el, 0.2, '❌ Too early!', () => resolveMinigame(0.2));
    } else {
      fire();
    }
  });
}

// ── SEQUENCE GAME ──
function buildSequenceGame(el, difficulty, label) {
  const len = 2 + difficulty;
  const dirs = ['←','↑','→','↓'];
  const keys = ['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'];
  const seq = Array.from({length: len}, () => Math.floor(Math.random() * 4));
  let idx = 0, errors = 0;

  const timeout = setTimeout(() => {
    cleanup();
    showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3));
  }, 3000 + difficulty * 600);

  function cleanup() { document.removeEventListener('keydown', onKey); clearTimeout(timeout); }

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Press the arrows in order! (keyboard or buttons)</div>
    <div class="mg-seq">${seq.map((d,i) => `<span class="mg-arrow" id="mg-a${i}">${dirs[d]}</span>`).join('')}</div>
    <div class="mg-seq-btns">${dirs.map((d,i) => `<button class="mg-dir-btn" data-k="${i}">${d}</button>`).join('')}</div>
  </div>`;

  function highlight() {
    el.querySelectorAll('.mg-arrow').forEach((a,i) => {
      a.classList.toggle('mg-arrow-active', i === idx);
      a.classList.toggle('mg-arrow-done', i < idx);
    });
  }
  highlight();

  function attempt(k) {
    if (k === seq[idx]) {
      idx++;
      highlight();
      if (idx >= seq.length) {
        cleanup();
        const mult = errors === 0 ? 2.0 : errors <= 1 ? 1.4 : 1.0;
        showMgResult(el, mult, errors === 0 ? '💥 FLAWLESS!' : '✅ Complete!', () => resolveMinigame(mult));
      }
    } else {
      errors++;
      el.querySelector(`#mg-a${idx}`)?.classList.add('mg-arrow-wrong');
      setTimeout(() => el.querySelector(`#mg-a${idx}`)?.classList.remove('mg-arrow-wrong'), 300);
    }
  }

  function onKey(e) {
    const ki = keys.indexOf(e.key);
    if (ki >= 0) { e.preventDefault(); attempt(ki); }
    if (e.code === 'Space') { e.preventDefault(); attempt(seq[idx]); } // spacebar = correct key cheat? No — just ignore
  }
  document.addEventListener('keydown', onKey);
  el.querySelectorAll('.mg-dir-btn').forEach(btn => {
    btn.addEventListener('click', () => attempt(parseInt(btn.dataset.k)));
  });
}

// ── MASH GAME ──
function buildMashGame(el, difficulty, label) {
  const target = 6 + difficulty * 3;
  const timeMs = 2200;
  let count = 0, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Mash <strong>${target}</strong> times! [Space or click]</div>
    <div class="mg-mash-count" id="mg-count">0 / ${target}</div>
    <div class="mg-timer-bar"><div class="mg-timer-fill" id="mg-tfill"></div></div>
    <button class="btn-primary mg-btn mg-mash-btn" id="mg-mash">💢 MASH!</button>
  </div>`;

  const fill = el.querySelector('#mg-tfill');
  const countEl = el.querySelector('#mg-count');
  const start = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    fill.style.width = Math.max(0, 100 - (elapsed / timeMs) * 100) + '%';
    if (elapsed >= timeMs && !done) {
      done = true;
      clearInterval(interval);
      document.removeEventListener('keydown', onKey);
      const ratio = count / target;
      const mult = ratio >= 1 ? 1.8 : ratio >= 0.6 ? 1.2 : 0.5;
      showMgResult(el, mult, ratio >= 1 ? '💥 Max power!' : ratio >= 0.6 ? '✅ Decent!' : '❌ Too slow!', () => resolveMinigame(mult));
    }
  }, 50);

  function hit() {
    if (done) return;
    count++;
    countEl.textContent = `${count} / ${target}`;
    if (count >= target && !done) {
      done = true;
      clearInterval(interval);
      document.removeEventListener('keydown', onKey);
      showMgResult(el, 1.8, '💥 Max power!', () => resolveMinigame(1.8));
    }
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); hit(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-mash').addEventListener('click', hit);
}

// ── HOLD GAME ──
function buildHoldGame(el, difficulty, label) {
  const zoneStart = 55 + difficulty * 5;
  const zoneEnd   = Math.min(90, zoneStart + 20 - difficulty * 3);
  let holding = false, fill = 0, raf, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Hold [Space/button], release in the <span style="color:var(--ok)">green zone</span>!</div>
    <div class="mg-hold-track">
      <div class="mg-zone" style="left:${zoneStart}%;width:${zoneEnd - zoneStart}%"></div>
      <div class="mg-hold-fill" id="mg-hfill"></div>
    </div>
    <button class="btn-primary mg-btn" id="mg-hold-btn">Hold… [Space]</button>
  </div>`;

  const fillEl = el.querySelector('#mg-hfill');
  const btn    = el.querySelector('#mg-hold-btn');

  function animate() {
    if (holding && fill < 100) fill += 1.2 + difficulty * 0.3;
    if (fill >= 100 && !done) {
      done = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('keyup', onKeyUp);
      showMgResult(el, 0.4, '❌ Overcharged!', () => resolveMinigame(0.4));
      return;
    }
    fillEl.style.width = Math.min(100, fill) + '%';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  function startHold() { holding = true; btn.textContent = '⚡ Charging…'; }
  function endHold() {
    if (done) return;
    holding = false;
    done = true;
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('keyup', onKeyUp);
    const inZone = fill >= zoneStart && fill <= zoneEnd;
    const center = Math.abs(fill - (zoneStart + (zoneEnd - zoneStart) / 2)) / ((zoneEnd - zoneStart) / 2);
    let mult, msg;
    if (inZone) { mult = center < 0.3 ? 2.0 : 1.5; msg = center < 0.3 ? '💥 PERFECT!' : '✅ Good!'; }
    else        { mult = fill < zoneStart ? 0.6 : 0.4; msg = fill < zoneStart ? '⚠️ Too early!' : '❌ Overcharged!'; }
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  function onKey(e)    { if (e.code === 'Space') { e.preventDefault(); startHold(); } }
  function onKeyUp(e)  { if (e.code === 'Space') { e.preventDefault(); endHold(); } }
  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKeyUp);
  btn.addEventListener('mousedown', startHold);
  btn.addEventListener('touchstart', e => { e.preventDefault(); startHold(); });
  btn.addEventListener('mouseup', endHold);
  btn.addEventListener('touchend', endHold);
}

// ── DRAW LINE GAME — drag mouse diagonally as straight as possible ──
function buildDrawLineGame(el, difficulty, label) {
  const timeLimit = [2500, 2000, 1500][Math.min(2, difficulty - 1)];
  let drawing = false, points = [], done = false, raf;
  let startTime = 0;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Draw a straight diagonal line ↘ in ${timeLimit/1000}s!</div>
    <canvas id="mg-canvas" class="mg-canvas" width="280" height="160"></canvas>
    <div id="mg-draw-status" style="font-size:12px;color:var(--dim);margin-top:6px">Click and drag diagonally →</div>
  </div>`;

  const canvas = el.querySelector('#mg-canvas');
  const ctx = canvas.getContext('2d');
  const status = el.querySelector('#mg-draw-status');

  ctx.strokeStyle = 'rgba(108,159,255,0.3)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8,8]);
  // Draw target diagonal guide
  ctx.beginPath(); ctx.moveTo(20, 20); ctx.lineTo(260, 140); ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(39,174,96,0.8)';
  ctx.lineWidth = 3;

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function startDraw(e) {
    if (done) return;
    e.preventDefault();
    drawing = true;
    points = [getPos(e)];
    startTime = Date.now();
    ctx.clearRect(0,0,280,160);
    // Redraw guide
    ctx.strokeStyle = 'rgba(108,159,255,0.3)'; ctx.lineWidth=2; ctx.setLineDash([8,8]);
    ctx.beginPath(); ctx.moveTo(20,20); ctx.lineTo(260,140); ctx.stroke();
    ctx.setLineDash([]); ctx.strokeStyle='rgba(39,174,96,0.8)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y);

    const timeout = setTimeout(() => {
      if (!done) { drawing = false; done = true; finishDraw(); }
    }, timeLimit);
    canvas._timeout = timeout;
  }

  function moveDraw(e) {
    if (!drawing || done) return;
    e.preventDefault();
    const p = getPos(e);
    points.push(p);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    status.textContent = `Drawing… ${Math.ceil((timeLimit - (Date.now()-startTime))/1000)}s`;
  }

  function endDraw(e) {
    if (!drawing || done) return;
    drawing = false;
    done = true;
    clearTimeout(canvas._timeout);
    finishDraw();
  }

  function finishDraw() {
    if (points.length < 5) {
      showMgResult(el, 0.3, '❌ Too short!', () => resolveMinigame(0.3));
      return;
    }
    // Score: how straight is the line? Compare to ideal diagonal
    const start = points[0];
    const end   = points[points.length - 1];
    const dx = end.x - start.x, dy = end.y - start.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    // Measure deviation from the line
    let totalDev = 0;
    points.forEach(p => {
      // Distance from point to line start→end
      const dev = Math.abs(dy*p.x - dx*p.y + end.x*start.y - end.y*start.x) / (len || 1);
      totalDev += dev;
    });
    const avgDev = totalDev / points.length;
    // Direction score: should go down-right
    const dirScore = (dx > 0 && dy > 0) ? 1 : 0.3;
    const straightness = Math.max(0, 1 - avgDev / 30);
    const mult = Math.min(2.2, straightness * dirScore * 2.2);
    const msg = mult >= 1.8 ? '💥 PERFECT LINE!' : mult >= 1.2 ? '✅ Good slash!' : mult >= 0.6 ? '⚠️ Wobbly…' : '❌ Too crooked!';
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('touchstart', startDraw, {passive:false});
  canvas.addEventListener('touchmove', moveDraw, {passive:false});
  canvas.addEventListener('touchend', endDraw);
}

// ── DRAG CRUSH GAME — drag a stone down to the target zone ──
function buildDragCrushGame(el, difficulty, label) {
  const targetY = [120, 130, 140][Math.min(2, difficulty - 1)];
  const tolerance = [25, 18, 12][Math.min(2, difficulty - 1)];
  let dragging = false, stoneY = 30, done = false, raf;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Drag the stone ⬇ and release on the <span style="color:var(--ok)">target zone</span>!</div>
    <div id="mg-crush-area" class="mg-crush-area">
      <div id="mg-target-zone" class="mg-target-zone" style="top:${targetY - tolerance}px;height:${tolerance*2}px"></div>
      <div id="mg-stone" class="mg-stone" style="top:${stoneY}px">🪨</div>
    </div>
    <div id="mg-crush-hint" style="font-size:11px;color:var(--dim);margin-top:6px">Click and drag the stone down</div>
  </div>`;

  const area  = el.querySelector('#mg-crush-area');
  const stone = el.querySelector('#mg-stone');

  function getY(e) {
    const r = area.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return src.clientY - r.top - 20;
  }

  stone.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  stone.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, {passive:false});

  area.addEventListener('mousemove', e => {
    if (!dragging || done) return;
    stoneY = Math.max(10, Math.min(160, getY(e)));
    stone.style.top = stoneY + 'px';
  });
  area.addEventListener('touchmove', e => {
    if (!dragging || done) return;
    e.preventDefault();
    stoneY = Math.max(10, Math.min(160, getY(e)));
    stone.style.top = stoneY + 'px';
  }, {passive:false});

  function release() {
    if (!dragging || done) return;
    dragging = false;
    done = true;
    const dist = Math.abs(stoneY - targetY);
    let mult, msg;
    if (dist <= tolerance * 0.3)      { mult = 2.2; msg = '💥 PERFECT CRUSH!'; stone.textContent = '💥'; }
    else if (dist <= tolerance)        { mult = 1.6; msg = '✅ Good crush!';     stone.textContent = '💢'; }
    else if (dist <= tolerance * 2)    { mult = 1.0; msg = '⚠️ Close enough!';  stone.textContent = '😬'; }
    else                               { mult = 0.4; msg = '❌ Missed!';         stone.textContent = '😅'; }
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  area.addEventListener('mouseup', release);
  area.addEventListener('touchend', release);
  // Auto-fail after 5s
  setTimeout(() => { if (!done) { done = true; showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3)); } }, 5000);
}

// ── QUICK TAP GAME — tap a target that appears at random positions ──
function buildQuickTapGame(el, difficulty, label) {
  const taps = 3 + difficulty;
  const baseWindow = [800, 600, 400][Math.min(2, difficulty - 1)];
  const windowMs = baseWindow + getSpdMgTimeBonus();
  let count = 0, done = false, currentTimeout = null;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Tap the target <strong>${taps}</strong> times before it moves!</div>
    <div id="mg-tap-area" class="mg-tap-area">
      <div id="mg-tap-target" class="mg-tap-target">⚡</div>
    </div>
    <div id="mg-tap-count" style="font-size:18px;font-weight:700;color:var(--accent);text-align:center;margin-top:8px">0 / ${taps}</div>
  </div>`;

  const area   = el.querySelector('#mg-tap-area');
  const target = el.querySelector('#mg-tap-target');
  const countEl = el.querySelector('#mg-tap-count');
  let misses = 0;

  function placeTarget() {
    const x = 10 + Math.random() * 70;
    const y = 10 + Math.random() * 70;
    target.style.left = x + '%';
    target.style.top  = y + '%';
    target.style.opacity = '1';
    clearTimeout(currentTimeout);
    currentTimeout = setTimeout(() => {
      if (!done) { misses++; target.style.opacity = '0.3'; placeTarget(); }
    }, windowMs);
  }

  placeTarget();

  target.addEventListener('click', () => {
    if (done) return;
    count++;
    countEl.textContent = `${count} / ${taps}`;
    target.style.transform = 'scale(1.4)';
    setTimeout(() => { target.style.transform = 'scale(1)'; }, 100);
    if (count >= taps) {
      done = true;
      clearTimeout(currentTimeout);
      const mult = misses === 0 ? 2.0 : misses <= 2 ? 1.5 : 1.0;
      showMgResult(el, mult, misses === 0 ? '💥 FLAWLESS!' : '✅ Done!', () => resolveMinigame(mult));
    } else {
      placeTarget();
    }
  });

  // Auto-fail after 8s
  setTimeout(() => {
    if (!done) { done = true; clearTimeout(currentTimeout); showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3)); }
  }, 8000);
}

// ── QUICK JOB MINIGAME — 12 unique medium-difficulty games, rotates ──
const QUICK_JOB_GAMES = [
  (job, cb) => showMinigame('timing',    2, `⚡ ${job.icon} Quick Work — hit the zone!`,       cb),
  (job, cb) => showMinigame('mash',      2, `⚡ ${job.icon} Quick Work — mash it!`,            cb),
  (job, cb) => showMinigame('reaction',  2, `⚡ ${job.icon} Quick Work — react fast!`,         cb),
  (job, cb) => showMinigame('sequence',  2, `⚡ ${job.icon} Quick Work — follow the pattern!`, cb),
  (job, cb) => showMinigame('hold',      2, `⚡ ${job.icon} Quick Work — hold and release!`,   cb),
  (job, cb) => showMinigame('draw_line', 2, `⚡ ${job.icon} Quick Work — slash straight!`,     cb),
  (job, cb) => showMinigame('dual_zone', 2, `⚡ ${job.icon} Quick Work — hit both zones!`,     cb),
  (job, cb) => showMinigame('dodge_tap', 2, `⚡ ${job.icon} Quick Work — dodge and strike!`,   cb),
  (job, cb) => showMinigame('rhythm',    2, `⚡ ${job.icon} Quick Work — keep the rhythm!`,    cb),
  (job, cb) => showMinigame('balance',   2, `⚡ ${job.icon} Quick Work — keep balance!`,       cb),
  (job, cb) => showMinigame('countdown', 2, `⚡ ${job.icon} Quick Work — hit on zero!`,        cb),
  (job, cb) => showMinigame('multi_mash',2, `⚡ ${job.icon} Quick Work — multi-mash!`,         cb),
];
let quickJobIndex = 0;

function quickJobMinigame(job, callback) {
  const game = QUICK_JOB_GAMES[quickJobIndex % QUICK_JOB_GAMES.length];
  quickJobIndex++;
  game(job, callback);
}
// ── TYPING GAME — type a phrase as fast as possible ──
function buildTypingGame(el, difficulty, label, forcedPhrase) {
  const phrases = {
    1: ['attack', 'strike', 'slash'],
    2: ['domain expansion', 'malevolent shrine', 'cursed technique'],
    3: ['domain expansion', 'infinite void', 'hollow purple'],
  };
  const pool = phrases[Math.min(3, difficulty)] || phrases[2];
  const phrase = forcedPhrase || pool[Math.floor(Math.random() * pool.length)];
  const timeLimit = Math.max(3000, phrase.length * 300 + 1000);
  let done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Type the phrase exactly! Press Enter when done.</div>
    <div class="mg-typing-phrase" id="mg-phrase">${phrase}</div>
    <input id="mg-type-input" class="mg-type-input" type="text" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Type here…" maxlength="${phrase.length + 5}">
    <div class="mg-timer-bar"><div class="mg-timer-fill" id="mg-tfill" style="width:100%"></div></div>
    <div id="mg-type-status" style="font-size:12px;color:var(--dim);margin-top:4px">Start typing…</div>
  </div>`;

  const input = el.querySelector('#mg-type-input');
  const fill = el.querySelector('#mg-tfill');
  const status = el.querySelector('#mg-type-status');
  const start = Date.now();

  // Auto-focus
  setTimeout(() => input.focus(), 50);

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.max(0, 100 - (elapsed / timeLimit) * 100);
    fill.style.width = pct + '%';
    if (elapsed >= timeLimit && !done) {
      done = true;
      clearInterval(interval);
      input.removeEventListener('keydown', onKey);
      showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3));
    }
  }, 50);

  function finish() {
    if (done) return;
    done = true;
    clearInterval(interval);
    input.removeEventListener('keydown', onKey);
    const typed = input.value.trim().toLowerCase();
    const elapsed = Date.now() - start;
    const timePct = elapsed / timeLimit;
    if (typed === phrase) {
      const mult = timePct < 0.4 ? 2.2 : timePct < 0.7 ? 1.8 : 1.4;
      const msg = timePct < 0.4 ? '💥 BLAZING FAST!' : timePct < 0.7 ? '✅ Perfect!' : '👍 Done!';
      showMgResult(el, mult, msg, () => resolveMinigame(mult));
    } else {
      // Partial credit based on how close
      let correct = 0;
      for (let i = 0; i < Math.min(typed.length, phrase.length); i++) {
        if (typed[i] === phrase[i]) correct++;
      }
      const ratio = correct / phrase.length;
      const mult = ratio > 0.8 ? 1.0 : ratio > 0.5 ? 0.6 : 0.3;
      showMgResult(el, mult, ratio > 0.8 ? '⚠️ Almost!' : '❌ Wrong!', () => resolveMinigame(mult));
    }
  }

  function onKey(e) {
    if (e.key === 'Enter') { e.preventDefault(); finish(); return; }
    // Live feedback
    setTimeout(() => {
      const typed = input.value.toLowerCase();
      const correct = phrase.startsWith(typed);
      input.style.borderColor = typed.length === 0 ? '' : correct ? 'var(--ok)' : 'var(--danger)';
      status.textContent = correct ? `${typed.length}/${phrase.length} chars` : '❌ Wrong character!';
      if (typed === phrase) finish();
    }, 0);
  }
  input.addEventListener('keydown', onKey);
  input.addEventListener('input', () => {
    const typed = input.value.toLowerCase();
    if (typed === phrase) finish();
  });
}

// ── X SLASH GAME — draw two crossing diagonal lines ──
function buildXSlashGame(el, difficulty, label) {
  const timeLimit = [5000, 4000, 3000][Math.min(2, difficulty - 1)]; // more time than before
  let phase = 1, points1 = [], points2 = [], drawing = false, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Draw an <strong>X</strong> — two crossing diagonal lines! Phase <span id="mg-xphase">1/2</span></div>
    <canvas id="mg-canvas" class="mg-canvas" width="280" height="160"></canvas>
    <div id="mg-x-status" style="font-size:12px;color:var(--dim);margin-top:6px">Draw first slash ↘</div>
  </div>`;

  const canvas = el.querySelector('#mg-canvas');
  const ctx = canvas.getContext('2d');
  const status = el.querySelector('#mg-x-status');

  // Draw guide X
  ctx.strokeStyle = 'rgba(108,159,255,0.25)'; ctx.lineWidth = 2; ctx.setLineDash([6,6]);
  ctx.beginPath(); ctx.moveTo(20,20); ctx.lineTo(260,140); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(260,20); ctx.lineTo(20,140); ctx.stroke();
  ctx.setLineDash([]);

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function scoreSlash(pts, expectedDir) {
    if (pts.length < 4) return 0;
    const s = pts[0], e = pts[pts.length-1];
    const dx = e.x - s.x, dy = e.y - s.y;
    const len = Math.sqrt(dx*dx+dy*dy);
    if (len < 40) return 0;
    let totalDev = 0;
    pts.forEach(p => {
      const dev = Math.abs(dy*p.x - dx*p.y + e.x*s.y - e.y*s.x) / (len||1);
      totalDev += dev;
    });
    const straight = Math.max(0, 1 - (totalDev/pts.length)/25);
    // expectedDir: 1 = down-right (↘), -1 = down-left (↙)
    const dirOk = expectedDir === 1 ? (dx > 0 && dy > 0) : (dx < 0 && dy > 0);
    return straight * (dirOk ? 1 : 0.3);
  }

  function startDraw(e) {
    if (done) return;
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    if (phase === 1) { points1 = [pos]; ctx.strokeStyle='rgba(39,174,96,0.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(pos.x,pos.y); }
    else             { points2 = [pos]; ctx.strokeStyle='rgba(245,197,66,0.9)'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(pos.x,pos.y); }
  }
  function moveDraw(e) {
    if (!drawing||done) return;
    e.preventDefault();
    const pos = getPos(e);
    if (phase===1) points1.push(pos); else points2.push(pos);
    ctx.lineTo(pos.x,pos.y); ctx.stroke();
  }
  function endDraw(e) {
    if (!drawing||done) return;
    drawing = false;
    if (phase === 1) {
      const s1 = scoreSlash(points1, 1);
      if (s1 < 0.3) {
        done = true;
        showMgResult(el, 0.3, '❌ First slash too crooked!', () => resolveMinigame(0.3));
        return;
      }
      phase = 2;
      el.querySelector('#mg-xphase').textContent = '2/2';
      status.textContent = 'Now draw second slash ↙';
    } else {
      done = true;
      const s1 = scoreSlash(points1, 1);
      const s2 = scoreSlash(points2, -1);
      const combined = (s1 + s2) / 2;
      const mult = Math.min(2.2, combined * 2.2);
      const msg = mult >= 1.8 ? '💥 PERFECT X!' : mult >= 1.2 ? '✅ Good X!' : mult >= 0.6 ? '⚠️ Wobbly X' : '❌ Too crooked!';
      showMgResult(el, mult, msg, () => resolveMinigame(mult));
    }
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', moveDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('touchstart', startDraw, {passive:false});
  canvas.addEventListener('touchmove', moveDraw, {passive:false});
  canvas.addEventListener('touchend', endDraw);
  setTimeout(() => { if (!done) { done=true; showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3)); } }, timeLimit);
}

// ── TRIPLE SLASH — draw 3 diagonal lines in sequence (Cleave) ──
function buildTripleSlashGame(el, difficulty, label) {
  const timeLimit = 5000;
  let phase = 0, points = [], drawing = false, done = false;
  const colors = ['rgba(255,109,0,0.9)', 'rgba(255,87,34,0.9)', 'rgba(255,61,0,0.9)'];

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Draw <strong>3 diagonal slashes</strong> ↘ in sequence!</div>
    <canvas id="mg-canvas" class="mg-canvas" width="280" height="160"></canvas>
    <div id="mg-slash-status" style="font-size:13px;font-weight:700;color:var(--gold);text-align:center;margin-top:6px">Slash 1 / 3</div>
  </div>`;

  const canvas = el.querySelector('#mg-canvas');
  const ctx = canvas.getContext('2d');
  const status = el.querySelector('#mg-slash-status');
  let scores = [];

  function drawGuides() {
    ctx.clearRect(0,0,280,160);
    for (let i = 0; i < 3; i++) {
      const x = 20 + i * 85;
      ctx.strokeStyle = i < phase ? 'rgba(255,109,0,0.5)' : i === phase ? 'rgba(108,159,255,0.4)' : 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 2; ctx.setLineDash([6,4]);
      ctx.beginPath(); ctx.moveTo(x, 10); ctx.lineTo(x + 60, 150); ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  drawGuides();

  function getPos(e) {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  }

  function scoreSlash(pts) {
    if (pts.length < 4) return 0;
    const s = pts[0], e = pts[pts.length-1];
    const dx = e.x - s.x, dy = e.y - s.y;
    const len = Math.sqrt(dx*dx+dy*dy);
    if (len < 30) return 0;
    let dev = 0;
    pts.forEach(p => { dev += Math.abs(dy*p.x - dx*p.y + e.x*s.y - e.y*s.x) / (len||1); });
    const straight = Math.max(0, 1 - (dev/pts.length)/25);
    return straight * ((dx > 0 && dy > 0) ? 1 : 0.4);
  }

  function startDraw(e) { if (done) return; e.preventDefault(); drawing = true; points = [getPos(e)]; ctx.strokeStyle = colors[phase]; ctx.lineWidth = 3; ctx.setLineDash([]); ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); }
  function moveDraw(e) { if (!drawing||done) return; e.preventDefault(); const p = getPos(e); points.push(p); ctx.lineTo(p.x,p.y); ctx.stroke(); }
  function endDraw(e) {
    if (!drawing||done) return; drawing = false;
    const s = scoreSlash(points);
    scores.push(s);
    phase++;
    if (phase >= 3) {
      done = true;
      const avg = scores.reduce((a,b)=>a+b,0)/3;
      const mult = Math.min(2.2, avg * 2.2);
      const msg = mult >= 1.8 ? '💥 TRIPLE CLEAVE!' : mult >= 1.2 ? '✅ Good cleave!' : '⚠️ Sloppy...';
      showMgResult(el, mult, msg, () => resolveMinigame(mult));
    } else {
      status.textContent = `Slash ${phase+1} / 3`;
      drawGuides();
    }
  }

  canvas.addEventListener('mousedown', startDraw); canvas.addEventListener('mousemove', moveDraw); canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('touchstart', startDraw, {passive:false}); canvas.addEventListener('touchmove', moveDraw, {passive:false}); canvas.addEventListener('touchend', endDraw);
  setTimeout(() => { if (!done) { done=true; const avg = scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0; const mult = Math.max(0.3, avg); showMgResult(el, mult, '⏰ Too slow!', () => resolveMinigame(mult)); } }, timeLimit);
}

// ── ARROW CHARGE — hold to charge a giant arrow, release at max (Fuga) ──
function buildArrowChargeGame(el, difficulty, label) {
  let holding = false, charge = 0, raf, done = false;
  const TARGET = 85; // % to release in

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Hold to charge the arrow — release in the <span style="color:#ff7043">🔥 FIRE ZONE</span>!</div>
    <div style="position:relative;height:60px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin:12px 0">
      <div style="position:absolute;left:${TARGET-10}%;width:15%;height:100%;background:rgba(255,112,67,0.35);border-left:2px solid #ff7043;border-right:2px solid #ff7043"></div>
      <div id="mg-arrow-fill" style="height:100%;width:0%;background:linear-gradient(90deg,#ff6f00,#ff7043,#ffab40);transition:none;border-radius:8px"></div>
      <div id="mg-arrow-emoji" style="position:absolute;top:50%;transform:translateY(-50%);left:0%;font-size:28px;transition:none">🏹</div>
    </div>
    <div id="mg-arrow-pct" style="text-align:center;font-size:14px;font-weight:700;color:var(--gold)">0%</div>
    <button class="btn-primary mg-btn" id="mg-arrow-btn">Hold to charge… [Space]</button>
  </div>`;

  const fill = el.querySelector('#mg-arrow-fill');
  const emoji = el.querySelector('#mg-arrow-emoji');
  const pct = el.querySelector('#mg-arrow-pct');
  const btn = el.querySelector('#mg-arrow-btn');

  function animate() {
    if (holding && charge < 100) charge += 1.5;
    if (charge >= 100 && !done) { done = true; cancelAnimationFrame(raf); cleanup(); showMgResult(el, 0.3, '💨 Overcharged! Arrow missed!', () => resolveMinigame(0.3)); return; }
    fill.style.width = charge + '%';
    emoji.style.left = Math.min(90, charge) + '%';
    pct.textContent = Math.floor(charge) + '%';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  function cleanup() { document.removeEventListener('keydown', onKey); document.removeEventListener('keyup', onKeyUp); }
  function startHold() { holding = true; btn.textContent = '🔥 Charging…'; }
  function release() {
    if (done) return; done = true; holding = false; cancelAnimationFrame(raf); cleanup();
    const inZone = charge >= TARGET - 10 && charge <= TARGET + 5;
    const center = Math.abs(charge - TARGET) / 10;
    let mult, msg;
    if (inZone) { mult = center < 0.3 ? 2.2 : 1.7; msg = center < 0.3 ? '💥 PERFECT SHOT!' : '✅ Good shot!'; }
    else if (charge < TARGET - 10) { mult = 0.5; msg = '⚠️ Undercharged!'; }
    else { mult = 0.3; msg = '❌ Overcharged!'; }
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); startHold(); } }
  function onKeyUp(e) { if (e.code === 'Space') { e.preventDefault(); release(); } }
  document.addEventListener('keydown', onKey); document.addEventListener('keyup', onKeyUp);
  btn.addEventListener('mousedown', startHold); btn.addEventListener('touchstart', e => { e.preventDefault(); startHold(); }, {passive:false});
  btn.addEventListener('mouseup', release); btn.addEventListener('touchend', release);
}

// ── PUSH MASH — mash to push the enemy (Reversal Red) ──
function buildPushMashGame(el, difficulty, label) {
  const target = 12;
  const timeMs = 2000;
  let count = 0, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">MASH to push the enemy away! <strong>${target} pushes</strong> in 2s!</div>
    <div style="position:relative;height:70px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin:10px 0">
      <div id="mg-push-enemy" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:32px;transition:right 0.1s">😈</div>
      <div id="mg-push-arrow" style="position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:24px;color:#ff5252">→</div>
    </div>
    <div class="mg-mash-count" id="mg-count" style="color:#ff5252">0 / ${target}</div>
    <div class="mg-timer-bar"><div class="mg-timer-fill" id="mg-tfill" style="background:#ff5252"></div></div>
    <button class="btn-primary mg-btn" id="mg-push-btn" style="background:rgba(229,57,53,0.3);border-color:#e53935">🔴 PUSH! [Space]</button>
  </div>`;

  const countEl = el.querySelector('#mg-count');
  const fill = el.querySelector('#mg-tfill');
  const enemy = el.querySelector('#mg-push-enemy');
  const start = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    fill.style.width = Math.max(0, 100 - (elapsed/timeMs)*100) + '%';
    if (elapsed >= timeMs && !done) {
      done = true; clearInterval(interval); document.removeEventListener('keydown', onKey);
      const ratio = count / target;
      const mult = ratio >= 1 ? 2.0 : ratio >= 0.6 ? 1.3 : 0.5;
      showMgResult(el, mult, ratio >= 1 ? '💥 MAXIMUM REPULSION!' : ratio >= 0.6 ? '✅ Pushed!' : '❌ Too weak!', () => resolveMinigame(mult));
    }
  }, 50);

  function push() {
    if (done) return;
    count++;
    countEl.textContent = `${count} / ${target}`;
    const pct = Math.min(90, (count/target)*80);
    enemy.style.right = (10 + pct) + 'px';
    if (count >= target && !done) {
      done = true; clearInterval(interval); document.removeEventListener('keydown', onKey);
      showMgResult(el, 2.0, '💥 MAXIMUM REPULSION!', () => resolveMinigame(2.0));
    }
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); push(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-push-btn').addEventListener('click', push);
}

// ── DOUBLE PUSH — two-phase push mash (Reversal Red MAX) ──
function buildDoublePushGame(el, difficulty, label) {
  let phase = 1, count = 0, done = false;
  const target = 8;
  const timeMs = 3000;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">TWO waves of repulsion! Mash <strong>${target}</strong> each wave!</div>
    <div style="position:relative;height:70px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin:10px 0">
      <div id="mg-dpush-enemy" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:32px">😈</div>
    </div>
    <div style="font-size:12px;color:var(--dim);text-align:center">Wave <span id="mg-wave">1</span>/2 — <span id="mg-dcount" style="color:#ff5252;font-weight:700">0/${target}</span></div>
    <div class="mg-timer-bar"><div class="mg-timer-fill" id="mg-dtfill" style="background:#ff1744"></div></div>
    <button class="btn-primary mg-btn" id="mg-dpush-btn" style="background:rgba(183,28,28,0.3);border-color:#b71c1c">🔴🔴 PUSH! [Space]</button>
  </div>`;

  const countEl = el.querySelector('#mg-dcount');
  const waveEl = el.querySelector('#mg-wave');
  const fill = el.querySelector('#mg-dtfill');
  const enemy = el.querySelector('#mg-dpush-enemy');
  const start = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    fill.style.width = Math.max(0, 100 - (elapsed/timeMs)*100) + '%';
    if (elapsed >= timeMs && !done) {
      done = true; clearInterval(interval); document.removeEventListener('keydown', onKey);
      const mult = phase === 2 && count >= target ? 2.2 : 0.6;
      showMgResult(el, mult, mult >= 2 ? '💥 DOUBLE REPULSION!' : '⚠️ Incomplete!', () => resolveMinigame(mult));
    }
  }, 50);

  function push() {
    if (done) return;
    count++;
    countEl.textContent = `${count}/${target}`;
    const pct = Math.min(80, (count/target)*40 + (phase-1)*40);
    enemy.style.right = (10 + pct) + 'px';
    if (count >= target) {
      if (phase === 1) {
        phase = 2; count = 0;
        waveEl.textContent = '2';
        countEl.textContent = `0/${target}`;
        enemy.style.right = '10px';
        enemy.style.fontSize = '28px';
        enemy.textContent = '😡';
      } else {
        done = true; clearInterval(interval); document.removeEventListener('keydown', onKey);
        showMgResult(el, 2.2, '💥 DOUBLE REPULSION! OBLITERATED!', () => resolveMinigame(2.2));
      }
    }
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); push(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-dpush-btn').addEventListener('click', push);
}

// ── PULL HOLD — hold to pull enemy in, release at perfect moment (Lapse Blue) ──
function buildPullHoldGame(el, difficulty, label) {
  let holding = false, pull = 0, raf, done = false;
  const TARGET = 75;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Hold to pull the enemy — release in the <span style="color:#42a5f5">💙 PULL ZONE</span>!</div>
    <div style="position:relative;height:70px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin:10px 0">
      <div id="mg-pull-enemy" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);font-size:32px">😈</div>
      <div style="position:absolute;left:${TARGET-8}%;width:16%;height:100%;background:rgba(66,165,245,0.25);border-left:2px solid #42a5f5;border-right:2px solid #42a5f5"></div>
      <div id="mg-pull-bar" style="position:absolute;right:0;height:100%;width:0%;background:linear-gradient(270deg,#0d47a1,#42a5f5);border-radius:8px 0 0 8px"></div>
    </div>
    <div id="mg-pull-pct" style="text-align:center;font-size:14px;font-weight:700;color:#42a5f5">0% pull</div>
    <button class="btn-primary mg-btn" id="mg-pull-btn" style="background:rgba(13,71,161,0.3);border-color:#1565c0">Hold to pull… [Space]</button>
  </div>`;

  const bar = el.querySelector('#mg-pull-bar');
  const enemy = el.querySelector('#mg-pull-enemy');
  const pctEl = el.querySelector('#mg-pull-pct');
  const btn = el.querySelector('#mg-pull-btn');

  function animate() {
    if (holding && pull < 100) pull += 1.3;
    if (pull >= 100 && !done) { done = true; cancelAnimationFrame(raf); cleanup(); showMgResult(el, 0.3, '💨 Pulled too hard! Enemy escaped!', () => resolveMinigame(0.3)); return; }
    bar.style.width = pull + '%';
    enemy.style.right = Math.max(5, Math.min(85, 90 - pull * 0.75)) + 'px';
    pctEl.textContent = Math.floor(pull) + '% pull';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  function cleanup() { document.removeEventListener('keydown', onKey); document.removeEventListener('keyup', onKeyUp); }
  function startHold() { holding = true; btn.textContent = '💙 Pulling…'; }
  function release() {
    if (done) return; done = true; holding = false; cancelAnimationFrame(raf); cleanup();
    const inZone = pull >= TARGET - 8 && pull <= TARGET + 8;
    const center = Math.abs(pull - TARGET) / 8;
    let mult, msg;
    if (inZone) { mult = center < 0.3 ? 2.2 : 1.7; msg = center < 0.3 ? '💥 PERFECT PULL!' : '✅ Good pull!'; }
    else if (pull < TARGET - 8) { mult = 0.6; msg = '⚠️ Not enough pull!'; }
    else { mult = 0.3; msg = '❌ Pulled too hard!'; }
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); startHold(); } }
  function onKeyUp(e) { if (e.code === 'Space') { e.preventDefault(); release(); } }
  document.addEventListener('keydown', onKey); document.addEventListener('keyup', onKeyUp);
  btn.addEventListener('mousedown', startHold); btn.addEventListener('touchstart', e => { e.preventDefault(); startHold(); }, {passive:false});
  btn.addEventListener('mouseup', release); btn.addEventListener('touchend', release);
}

// ── GRAVITY CRUSH — drag enemy down into the crush zone (Lapse Blue MAX) ──
function buildGravityCrushGame(el, difficulty, label) {
  const targetY = 140;
  const tolerance = 15;
  let dragging = false, enemyY = 20, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Drag the enemy ⬇ into the <span style="color:#42a5f5">💙 CRUSH ZONE</span>!</div>
    <div id="mg-grav-area" class="mg-crush-area" style="border-color:#1565c0">
      <div id="mg-grav-zone" class="mg-target-zone" style="top:${targetY-tolerance}px;height:${tolerance*2}px;background:rgba(66,165,245,0.2);border-color:#42a5f5"></div>
      <div id="mg-grav-enemy" style="position:absolute;top:${enemyY}px;left:50%;transform:translateX(-50%);font-size:32px;cursor:grab;user-select:none">😈</div>
    </div>
    <div style="font-size:11px;color:var(--dim);text-align:center;margin-top:6px">Drag the enemy into the blue zone</div>
  </div>`;

  const area = el.querySelector('#mg-grav-area');
  const enemy = el.querySelector('#mg-grav-enemy');

  function getY(e) { const r = area.getBoundingClientRect(); const src = e.touches ? e.touches[0] : e; return src.clientY - r.top - 16; }

  enemy.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
  enemy.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, {passive:false});
  area.addEventListener('mousemove', e => { if (!dragging||done) return; enemyY = Math.max(5, Math.min(165, getY(e))); enemy.style.top = enemyY + 'px'; });
  area.addEventListener('touchmove', e => { if (!dragging||done) return; e.preventDefault(); enemyY = Math.max(5, Math.min(165, getY(e))); enemy.style.top = enemyY + 'px'; }, {passive:false});

  function release() {
    if (!dragging||done) return; dragging = false; done = true;
    const dist = Math.abs(enemyY - targetY);
    let mult, msg;
    if (dist <= tolerance * 0.3) { mult = 2.2; msg = '💥 GRAVITATIONAL COLLAPSE!'; enemy.textContent = '💥'; }
    else if (dist <= tolerance)   { mult = 1.7; msg = '✅ Crushed!'; enemy.textContent = '💢'; }
    else if (dist <= tolerance*2) { mult = 1.0; msg = '⚠️ Close!'; enemy.textContent = '😬'; }
    else                          { mult = 0.4; msg = '❌ Missed!'; enemy.textContent = '😅'; }
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  area.addEventListener('mouseup', release); area.addEventListener('touchend', release);
  setTimeout(() => { if (!done) { done = true; showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3)); } }, 5000);
}

// ── COLOR MERGE — hit red zone then blue zone to create purple (Hollow Purple) ──
function buildColorMergeGame(el, difficulty, label) {
  const zoneW = 18;
  const redStart = 10 + Math.random() * 25;
  const blueStart = 60 + Math.random() * 20;
  const speed = 1.8;
  let pos = 0, dir = 1, raf, phase = 1, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Hit <span style="color:#ff5252">🔴 RED</span> then <span style="color:#42a5f5">🔵 BLUE</span> to create <span style="color:#ce93d8">🟣 PURPLE</span>!</div>
    <div class="mg-timing-track" id="mg-track">
      <div id="mg-red-zone" style="position:absolute;left:${redStart}%;width:${zoneW}%;height:100%;background:rgba(229,57,53,0.35);border:1px solid #e53935;border-radius:3px"></div>
      <div id="mg-blue-zone" style="position:absolute;left:${blueStart}%;width:${zoneW}%;height:100%;background:rgba(66,165,245,0.35);border:1px solid #42a5f5;border-radius:3px;opacity:0.4"></div>
      <div class="mg-indicator" id="mg-ind"></div>
    </div>
    <div style="font-size:12px;color:var(--dim);text-align:center;margin:4px 0">Phase: <span id="mg-cphase" style="font-weight:700;color:#ff5252">🔴 Hit RED</span></div>
    <button class="btn-primary mg-btn" id="mg-merge-btn" style="background:rgba(128,0,128,0.2);border-color:#9c27b0">⚡ Strike! [Space]</button>
  </div>`;

  const ind = el.querySelector('#mg-ind');
  const phaseEl = el.querySelector('#mg-cphase');

  function animate() {
    pos += speed * dir;
    if (pos >= 100) { pos = 100; dir = -1; }
    if (pos <= 0)   { pos = 0;   dir = 1; }
    ind.style.left = pos + '%';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  const timeout = setTimeout(() => {
    cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey);
    showMgResult(el, 0.3, '⏰ Too slow!', () => resolveMinigame(0.3));
  }, 6000);

  function fire() {
    if (phase === 1) {
      const inRed = pos >= redStart && pos <= redStart + zoneW;
      if (inRed) {
        phase = 2;
        phaseEl.textContent = '🔵 Hit BLUE'; phaseEl.style.color = '#42a5f5';
        el.querySelector('#mg-red-zone').style.opacity = '0.3';
        el.querySelector('#mg-blue-zone').style.opacity = '1';
      } else {
        cancelAnimationFrame(raf); clearTimeout(timeout); document.removeEventListener('keydown', onKey);
        showMgResult(el, 0.4, '❌ Missed RED!', () => resolveMinigame(0.4));
      }
    } else {
      cancelAnimationFrame(raf); clearTimeout(timeout); document.removeEventListener('keydown', onKey);
      const inBlue = pos >= blueStart && pos <= blueStart + zoneW;
      if (inBlue) {
        // Purple explosion!
        phaseEl.textContent = '🟣 HOLLOW PURPLE!'; phaseEl.style.color = '#ce93d8';
        showMgResult(el, 2.2, '🟣 HOLLOW PURPLE!', () => resolveMinigame(2.2));
      } else {
        showMgResult(el, 0.6, '⚠️ Missed BLUE — incomplete!', () => resolveMinigame(0.6));
      }
    }
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); fire(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-merge-btn').addEventListener('click', fire);
}

// ── DODGE TAP — enemy attacks appear, click to dodge then counter ──
function buildDodgeTapGame(el, difficulty, label) {
  const rounds = 3 + difficulty;
  const windowMs = [700, 500, 350][Math.min(2, difficulty - 1)];
  let round = 0, hits = 0, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Click <span style="color:var(--ok)">⚔️ COUNTER</span> when it appears — dodge the ❌!</div>
    <div id="mg-dodge-area" style="height:80px;display:flex;align-items:center;justify-content:center;font-size:48px;background:rgba(0,0,0,0.2);border-radius:8px;margin:10px 0;cursor:pointer;user-select:none" id="mg-dodge-btn">⏳</div>
    <div id="mg-dodge-score" style="text-align:center;font-size:13px;color:var(--dim)">Round 1 / ${rounds}</div>
  </div>`;

  const area = el.querySelector('#mg-dodge-area');
  const score = el.querySelector('#mg-dodge-score');

  function nextRound() {
    if (done) return;
    round++;
    if (round > rounds) {
      done = true;
      const ratio = hits / rounds;
      const mult = ratio >= 1 ? 2.0 : ratio >= 0.6 ? 1.4 : 0.6;
      showMgResult(el, mult, ratio >= 1 ? '💥 PERFECT COUNTER!' : ratio >= 0.6 ? '✅ Good!' : '❌ Too slow!', () => resolveMinigame(mult));
      return;
    }
    score.textContent = `Round ${round} / ${rounds}`;
    // Random delay then show attack or counter
    const isCounter = Math.random() > 0.3; // 70% counter, 30% feint
    const delay = 400 + Math.random() * 600;
    area.textContent = '⏳';
    area.style.background = 'rgba(0,0,0,0.2)';
    let clicked = false;

    const t = setTimeout(() => {
      if (done) return;
      area.textContent = isCounter ? '⚔️' : '❌';
      area.style.background = isCounter ? 'rgba(39,174,96,0.2)' : 'rgba(229,57,53,0.2)';
      const autoFail = setTimeout(() => {
        if (!clicked && !done) {
          if (isCounter) { /* missed counter — no hit */ }
          nextRound();
        }
      }, windowMs);
      area._autoFail = autoFail;
    }, delay);

    area._pending = t;
    area._isCounter = isCounter;
    area._clicked = () => { clicked = true; };
  }

  area.addEventListener('click', () => {
    if (done) return;
    const isCounter = area._isCounter;
    clearTimeout(area._autoFail);
    if (area.textContent === '⚔️' && isCounter) {
      hits++;
      area.textContent = '💥';
      area.style.background = 'rgba(245,197,66,0.2)';
    } else if (area.textContent === '❌') {
      area.textContent = '😵';
      area.style.background = 'rgba(229,57,53,0.3)';
    }
    setTimeout(nextRound, 200);
  });

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); area.click(); } }
  document.addEventListener('keydown', onKey);
  // Clean up listener when done
  const origResolve = mgResolve;
  mgResolve = (m) => { document.removeEventListener('keydown', onKey); if (origResolve) origResolve(m); };

  nextRound();
}

// ── RHYTHM GAME — hit the beat as bars cross the line ──
function buildRhythmGame(el, difficulty, label) {
  const beats = 5 + difficulty;
  const interval = [700, 550, 420][Math.min(2, difficulty - 1)];
  const hitWindow = [200, 150, 100][Math.min(2, difficulty - 1)];
  let beatCount = 0, hits = 0, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Press <kbd>Space</kbd> or click when the bar hits the <span style="color:var(--gold)">⚡ line</span>!</div>
    <div style="position:relative;height:50px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin:10px 0">
      <div style="position:absolute;left:50%;top:0;width:3px;height:100%;background:var(--gold);z-index:2"></div>
      <div id="mg-rhythm-bar" style="position:absolute;left:-8%;top:10%;width:8%;height:80%;background:linear-gradient(90deg,transparent,var(--accent),transparent);border-radius:4px;transition:none"></div>
    </div>
    <div id="mg-rhythm-score" style="text-align:center;font-size:13px;color:var(--dim)">0 / ${beats} hits</div>
    <button class="btn-primary mg-btn" id="mg-rhythm-btn">🥁 Hit! [Space]</button>
  </div>`;

  const bar = el.querySelector('#mg-rhythm-bar');
  const scoreEl = el.querySelector('#mg-rhythm-score');
  let barPos = -8, barDir = 1, raf;
  const speed = 100 / (interval * 0.6); // crosses in ~60% of interval

  function animate() {
    barPos += speed * barDir;
    if (barPos >= 100) { barPos = -8; beatCount++; if (beatCount > beats && !done) { done = true; cancelAnimationFrame(raf); finish(); return; } }
    bar.style.left = barPos + '%';
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  function hit() {
    if (done) return;
    // Check if bar is near center (50%)
    const dist = Math.abs(barPos + 4 - 50); // center of bar vs center line
    if (dist < hitWindow / 10) {
      hits++;
      scoreEl.textContent = `${hits} / ${beats} hits`;
      scoreEl.style.color = 'var(--ok)';
      setTimeout(() => { scoreEl.style.color = 'var(--dim)'; }, 200);
    } else {
      scoreEl.style.color = 'var(--danger)';
      setTimeout(() => { scoreEl.style.color = 'var(--dim)'; }, 200);
    }
  }

  function finish() {
    document.removeEventListener('keydown', onKey);
    const ratio = hits / beats;
    const mult = ratio >= 0.8 ? 2.0 : ratio >= 0.5 ? 1.4 : 0.6;
    showMgResult(el, mult, ratio >= 0.8 ? '💥 PERFECT RHYTHM!' : ratio >= 0.5 ? '✅ Good beat!' : '❌ Off beat!', () => resolveMinigame(mult));
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); hit(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-rhythm-btn').addEventListener('click', hit);
  setTimeout(() => { if (!done) { done = true; cancelAnimationFrame(raf); document.removeEventListener('keydown', onKey); finish(); } }, beats * interval + 2000);
}

// ── BALANCE GAME — keep a bar centered by clicking left/right ──
function buildBalanceGame(el, difficulty, label) {
  const timeMs = [3000, 2500, 2000][Math.min(2, difficulty - 1)];
  let pos = 50, drift = 0, done = false, raf;
  const driftSpeed = 0.3 + difficulty * 0.15;
  let totalFrames = 0, inZoneFrames = 0;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Keep the ⚡ centered! Click <strong>← Left</strong> or <strong>→ Right</strong> to balance!</div>
    <div style="position:relative;height:50px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;margin:10px 0">
      <div style="position:absolute;left:40%;width:20%;height:100%;background:rgba(39,174,96,0.2);border-left:1px solid var(--ok);border-right:1px solid var(--ok)"></div>
      <div id="mg-bal-ind" style="position:absolute;top:50%;transform:translate(-50%,-50%);font-size:22px;transition:none">⚡</div>
    </div>
    <div class="mg-timer-bar"><div class="mg-timer-fill" id="mg-bal-fill"></div></div>
    <div style="display:flex;gap:8px;justify-content:center;margin-top:8px">
      <button class="btn-primary mg-btn" id="mg-bal-left" style="flex:1">← Left [A/←]</button>
      <button class="btn-primary mg-btn" id="mg-bal-right" style="flex:1">Right → [D/→]</button>
    </div>
  </div>`;

  const ind = el.querySelector('#mg-bal-ind');
  const fill = el.querySelector('#mg-bal-fill');
  const start = Date.now();

  function animate() {
    const elapsed = Date.now() - start;
    fill.style.width = Math.max(0, 100 - (elapsed/timeMs)*100) + '%';
    // Random drift changes
    if (Math.random() < 0.02) drift = (Math.random() - 0.5) * driftSpeed * 2;
    pos = Math.max(5, Math.min(95, pos + drift));
    ind.style.left = pos + '%';
    totalFrames++;
    if (pos >= 40 && pos <= 60) inZoneFrames++;
    if (elapsed >= timeMs && !done) { done = true; cancelAnimationFrame(raf); finish(); return; }
    raf = requestAnimationFrame(animate);
  }
  raf = requestAnimationFrame(animate);

  function nudge(dir) { if (!done) { drift = dir * driftSpeed; pos = Math.max(5, Math.min(95, pos + dir * 3)); } }
  function finish() {
    document.removeEventListener('keydown', onKey);
    const ratio = inZoneFrames / Math.max(1, totalFrames);
    const mult = ratio >= 0.7 ? 2.0 : ratio >= 0.4 ? 1.4 : 0.6;
    showMgResult(el, mult, ratio >= 0.7 ? '💥 PERFECT BALANCE!' : ratio >= 0.4 ? '✅ Balanced!' : '❌ Too wobbly!', () => resolveMinigame(mult));
  }

  function onKey(e) {
    if (e.code === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); nudge(-1); }
    if (e.code === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); nudge(1); }
  }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-bal-left').addEventListener('click', () => nudge(-1));
  el.querySelector('#mg-bal-right').addEventListener('click', () => nudge(1));
}

// ── COUNTDOWN GAME — hit exactly when counter reaches 0 ──
function buildCountdownGame(el, difficulty, label) {
  const start = 5 + difficulty;
  const speed = [800, 650, 500][Math.min(2, difficulty - 1)]; // ms per count
  let count = start, done = false;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Press <kbd>Space</kbd> or click exactly when it hits <span style="color:var(--gold)">0</span>!</div>
    <div id="mg-count-num" style="font-size:72px;font-weight:900;text-align:center;color:var(--gold);line-height:1;margin:10px 0;text-shadow:0 0 20px var(--gold)">${start}</div>
    <div id="mg-count-hint" style="text-align:center;font-size:12px;color:var(--dim)">Counting down…</div>
    <button class="btn-primary mg-btn" id="mg-count-btn">⚡ NOW! [Space]</button>
  </div>`;

  const numEl = el.querySelector('#mg-count-num');
  const hint = el.querySelector('#mg-count-hint');

  const interval = setInterval(() => {
    if (done) return;
    count--;
    numEl.textContent = count;
    numEl.style.color = count <= 2 ? 'var(--danger)' : count <= 3 ? 'var(--warn)' : 'var(--gold)';
    numEl.style.textShadow = count <= 2 ? '0 0 20px var(--danger)' : '0 0 20px var(--gold)';
    if (count <= 0) {
      clearInterval(interval);
      if (!done) {
        done = true;
        document.removeEventListener('keydown', onKey);
        numEl.textContent = '💥';
        showMgResult(el, 0.3, '⏰ Too late!', () => resolveMinigame(0.3));
      }
    }
  }, speed);

  function fire() {
    if (done) return;
    done = true;
    clearInterval(interval);
    document.removeEventListener('keydown', onKey);
    const diff = Math.abs(count);
    let mult, msg;
    if (count === 0)      { mult = 2.2; msg = '💥 PERFECT ZERO!'; }
    else if (count === 1) { mult = 1.8; msg = '✅ Almost perfect!'; }
    else if (count === 2) { mult = 1.3; msg = '👍 Close enough!'; }
    else                  { mult = 0.5; msg = `⚠️ Too early! (${count} left)`; }
    numEl.textContent = count === 0 ? '💥' : count;
    showMgResult(el, mult, msg, () => resolveMinigame(mult));
  }

  function onKey(e) { if (e.code === 'Space') { e.preventDefault(); fire(); } }
  document.addEventListener('keydown', onKey);
  el.querySelector('#mg-count-btn').addEventListener('click', fire);
}

// ── MULTI MASH — mash multiple buttons in sequence ──
function buildMultiMashGame(el, difficulty, label) {
  const buttons = ['🔴', '🔵', '🟡', '🟢'];
  const seq = Array.from({length: 4 + difficulty}, () => Math.floor(Math.random() * 4));
  let idx = 0, errors = 0, done = false;
  const timeMs = 4000 + difficulty * 500;

  el.innerHTML = `<div class="mg-box">
    <div class="mg-label">${label}</div>
    <div class="mg-hint">Hit the colored buttons in order — fast!</div>
    <div class="mg-seq" style="font-size:28px">${seq.map((b,i) => `<span class="mg-arrow" id="mg-mb${i}" style="font-size:24px">${buttons[b]}</span>`).join('')}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
      ${buttons.map((b,i) => `<button class="btn-primary mg-btn" data-k="${i}" style="font-size:20px;padding:10px">${b}</button>`).join('')}
    </div>
    <div class="mg-timer-bar" style="margin-top:8px"><div class="mg-timer-fill" id="mg-mm-fill"></div></div>
  </div>`;

  const fill = el.querySelector('#mg-mm-fill');
  const start = Date.now();

  function highlight() {
    el.querySelectorAll('.mg-arrow').forEach((a,i) => {
      a.classList.toggle('mg-arrow-active', i === idx);
      a.classList.toggle('mg-arrow-done', i < idx);
    });
  }
  highlight();

  const timer = setInterval(() => {
    const elapsed = Date.now() - start;
    fill.style.width = Math.max(0, 100 - (elapsed/timeMs)*100) + '%';
    if (elapsed >= timeMs && !done) {
      done = true; clearInterval(timer); document.removeEventListener('keydown', onKey);
      const mult = idx / seq.length >= 0.6 ? 1.0 : 0.4;
      showMgResult(el, mult, '⏰ Too slow!', () => resolveMinigame(mult));
    }
  }, 50);

  function attempt(k) {
    if (done) return;
    if (k === seq[idx]) {
      idx++; highlight();
      if (idx >= seq.length) {
        done = true; clearInterval(timer); document.removeEventListener('keydown', onKey);
        const mult = errors === 0 ? 2.0 : errors <= 2 ? 1.5 : 1.0;
        showMgResult(el, mult, errors === 0 ? '💥 FLAWLESS!' : '✅ Complete!', () => resolveMinigame(mult));
      }
    } else {
      errors++;
      el.querySelector(`#mg-mb${idx}`)?.classList.add('mg-arrow-wrong');
      setTimeout(() => el.querySelector(`#mg-mb${idx}`)?.classList.remove('mg-arrow-wrong'), 250);
    }
  }

  function onKey(e) {
    const map = {'1':0,'2':1,'3':2,'4':3,'q':0,'w':1,'e':2,'r':3};
    const k = map[e.key?.toLowerCase()];
    if (k !== undefined) { e.preventDefault(); attempt(k); }
  }
  document.addEventListener('keydown', onKey);
  el.querySelectorAll('[data-k]').forEach(btn => btn.addEventListener('click', () => attempt(parseInt(btn.dataset.k))));
}

function showMgResult(el, mult, msg, cb) {
  const color = mult >= 1.8 ? 'var(--gold)' : mult >= 1.4 ? 'var(--ok)' : mult >= 0.9 ? 'var(--accent)' : 'var(--danger)';
  const resultDiv = document.createElement('div');
  resultDiv.className = 'mg-result';
  resultDiv.innerHTML = `<span style="color:${color};font-size:22px;font-weight:800">${msg}</span><br>
    <span style="color:var(--dim);font-size:13px">${mult >= 1 ? mult.toFixed(1) + '× damage' : Math.floor(mult * 100) + '% damage'}</span>`;
  el.querySelector('.mg-box')?.appendChild(resultDiv);
  setTimeout(cb, 800);
}

// ── FLEE MINIGAME — reaction game, harder at low HP ──
function fleeMinigame(callback) {
  const p = G.player;
  const hpRatio = p.hp / p.maxHp;
  const difficulty = hpRatio > 0.6 ? 1 : hpRatio > 0.3 ? 2 : 3;
  // Flee uses reaction game — you have to click the instant it flashes
  showMinigame('reaction', difficulty, '🏃 Flee! React instantly to escape!', (mult) => {
    callback(mult >= 0.9);
  });
}

// ── BASIC ATTACK — cycles through 5 different minigames ──
let basicAttackUseCount = 0;
const BASIC_ATK_TYPES  = ['timing', 'mash', 'dodge_tap', 'rhythm', 'countdown'];
const BASIC_ATK_LABELS = [
  '⚔️ Basic Attack — hit the zone!',
  '⚔️ Basic Attack — mash it!',
  '⚔️ Basic Attack — dodge and strike!',
  '⚔️ Basic Attack — keep the rhythm!',
  '⚔️ Basic Attack — hit on zero!',
];
function basicAttackMinigame(callback) {
  const idx = basicAttackUseCount % BASIC_ATK_TYPES.length;
  basicAttackUseCount++;
  showMinigame(BASIC_ATK_TYPES[idx], 2, BASIC_ATK_LABELS[idx], callback);
}

// ── TECHNIQUE MINIGAMES — each has 2 alternating types ──
const TECHNIQUE_MINIGAMES = {
  // [type_odd, type_even, difficulty, label_odd, label_even]
  'slash':           ['draw_line', 'dual_zone',  1, '⚔️ Slash — draw the cut!',    '⚔️ Slash — double strike!'],
  'block':           ['hold',      'reaction',   1, '🛡️ Iron Block!',              '🛡️ Block — react fast!'],
  'quick_step':      ['timing',    'mash',      1, '💨 Quick Step — dodge!',      '💨 Quick Step — frenzy!'],
  'earth_crush':     ['drag_crush','hold',       2, '🪨 Earth Crush — drag down!', '🪨 Earth Crush — charge!'],
  'fang_strike':     ['draw_line', 'mash',       2, '🐺 Fang Strike — slash!',     '🐺 Fang Strike — frenzy!'],
  'war_cry':         ['hold',      'sequence',  2, '📣 War Cry!',             '📣 War Cry — sequence!'],
  'holy_slash':      ['x_slash',   'dual_zone', 2, '✨ Holy Slash — draw the X!',  '✨ Holy Slash — divine!'],
  'tidal_wave':      ['mash',      'reaction',  3, '🌊 Tidal Wave!',          '🌊 Tidal Wave — react!'],
  'shadow_clone':    ['timing',    'sequence',  3, '👤 Shadow Clone!',        '👤 Shadow Clone — pattern!'],
  'hellfire':        ['hold',      'dual_zone', 3, '🔥 Hellfire!',            '🔥 Hellfire — double!'],
  'void_rend':       ['sequence',  'mash',      3, '🌀 Void Rend!',           '🌀 Void Rend — obliterate!'],
  'divine_heal':     ['hold',      'reaction',  2, '💫 Divine Heal!',         '💫 Divine Heal — react!'],
  'ancient_strike':  ['timing',    'dual_zone', 2, '🏺 Ancient Strike!',      '🏺 Ancient Strike — double!'],
  'crystal_shard':   ['mash',      'sequence',  2, '💎 Crystal Shard!',       '💎 Crystal Shard — pattern!'],
  'iron_fist':       ['mash',      'timing',    1, '👊 Iron Fist!',           '👊 Iron Fist — precise!'],
  'leg_sweep':       ['timing',    'reaction',  1, '🦵 Leg Sweep!',           '🦵 Leg Sweep — react!'],
  'power_strike':    ['hold',      'dual_zone', 2, '💢 Power Strike!',        '💢 Power Strike — double!'],
  'counter':         ['sequence',  'reaction',  2, '🔄 Counter!',             '🔄 Counter — react!'],
  'berserker_rush':  ['mash',      'hold',      2, '😤 Berserker Rush!',      '😤 Berserker Rush — charge!'],
  'death_blow':      ['timing',    'reaction',  3, '💀 Death Blow!',          '💀 Death Blow — react!'],
  'thousand_fists':  ['mash',      'dual_zone', 3, '🌪️ Thousand Fists!',     '🌪️ Thousand Fists — double!'],
  'spark':           ['timing',    'reaction',  1, '⚡ Spark!',               '⚡ Spark — react!'],
  'frost_bolt':      ['hold',      'timing',    1, '❄️ Frost Bolt!',          '❄️ Frost Bolt — precise!'],
  'flame_burst':     ['mash',      'dual_zone', 2, '🔥 Flame Burst!',         '🔥 Flame Burst — double!'],
  'arcane_bolt':     ['timing',    'sequence',  2, '🔮 Arcane Bolt!',         '🔮 Arcane Bolt — pattern!'],
  'mana_shield':     ['hold',      'reaction',  2, '🛡️ Mana Shield!',        '🛡️ Mana Shield — react!'],
  'chain_lightning': ['timing',    'mash',      1, '🌩️ Chain Lightning — strike!', '🌩️ Chain Lightning — mash!'],
  'meteor':          ['hold',      'dual_zone', 3, '☄️ Meteor!',              '☄️ Meteor — double!'],
  'time_stop':       ['sequence',  'reaction',  3, '⏰ Time Stop!',           '⏰ Time Stop — react!'],
  'void_blast':      ['mash',      'dual_zone', 3, '🌀 Void Blast!',          '🌀 Void Blast — double!'],
  // New library spells
  'wind_slash':      ['draw_line', 'timing',    1, '🌬️ Wind Slash — cut!',    '🌬️ Wind Slash — precise!'],
  'stone_spike':     ['hold',      'timing',    1, '🪨 Stone Spike!',         '🪨 Stone Spike — precise!'],
  'poison_cloud':    ['mash',      'hold',      2, '☠️ Poison Cloud!',        '☠️ Poison Cloud — charge!'],
  'ice_lance':       ['draw_line', 'mash',      2, '🧊 Ice Lance — pierce!',  '🧊 Ice Lance — frenzy!'],
  'thunder_clap':    ['mash',      'dual_zone', 2, '⚡ Thunder Clap!',        '⚡ Thunder Clap — double!'],
  'blizzard':        ['mash',      'sequence',  3, '🌨️ Blizzard!',            '🌨️ Blizzard — pattern!'],
  'inferno':         ['hold',      'dual_zone', 3, '🌋 Inferno!',             '🌋 Inferno — double!'],
  'gravity_well':    ['sequence',  'hold',      3, '🌀 Gravity Well!',        '🌀 Gravity Well — charge!'],
  'soul_drain':      ['hold',      'reaction',  3, '💀 Soul Drain!',          '💀 Soul Drain — react!'],
  'star_fall':       ['mash',      'dual_zone', 3, '🌟 Star Fall!',           '🌟 Star Fall — double!'],
  'divine_wrath':    ['sequence',  'mash',      3, '⚡ Divine Wrath!',        '⚡ Divine Wrath — obliterate!'],
  // JJK secret techniques — each has a unique custom minigame
  'vessel_switch':        ['reaction',      'dual_zone',    3, '🩸 Vessel Switch — react instantly!',        '🩸 Vessel Switch — double strike!'],
  'dismantle':            ['x_slash',       'x_slash',      3, '✂️ Dismantle — draw the X!',                 '✂️ Dismantle — draw the X!'],
  'cleave':               ['triple_slash',  'triple_slash', 3, '🔪 Cleave — draw 3 slashes!',                '🔪 Cleave — draw 3 slashes!'],
  'fuga':                 ['arrow_charge',  'arrow_charge', 3, '🏹 Fuga — charge the Giant Flame Arrow!',    '🏹 Fuga — charge the Giant Flame Arrow!'],
  'domain_expansion':     ['typing',        'typing',       3, '🏯 Domain Expansion — type it!',             '🏯 Domain Expansion — type it!'],
  'reversal_red':         ['push_mash',     'push_mash',    3, '🔴 Reversal Red — PUSH!',                    '🔴 Reversal Red — PUSH!'],
  'reversal_red_max':     ['double_push',   'double_push',  3, '🔴 Reversal Red MAX — DOUBLE PUSH!',         '🔴 Reversal Red MAX — DOUBLE PUSH!'],
  'lapse_blue':           ['pull_hold',     'pull_hold',    3, '🔵 Lapse Blue — PULL!',                      '🔵 Lapse Blue — PULL!'],
  'lapse_blue_max':       ['gravity_crush', 'gravity_crush',3, '🔵 Lapse Blue MAX — Gravitational Collapse!','🔵 Lapse Blue MAX — Gravitational Collapse!'],
  'hollow_purple':        ['color_merge',   'color_merge',  3, '🟣 Hollow Purple — merge Red and Blue!',     '🟣 Hollow Purple — merge Red and Blue!'],
  'domain_infinite_void': ['typing',        'typing',       3, '🌌 Domain Expansion: Infinite Void!',        '🌌 Domain Expansion: Infinite Void!'],
};

// Forced phrases for specific techniques — always type exactly this
const TECHNIQUE_FORCED_PHRASES = {
  'domain_expansion': 'malevolent shrine',
  'domain_infinite_void': 'infinite void',
};

function techniqueMinigame(tech, callback) {
  const mg = TECHNIQUE_MINIGAMES[tech.id];
  const forcedPhrase = TECHNIQUE_FORCED_PHRASES[tech.id] || null;
  if (mg) {
    const [typeOdd, typeEven, diff, labelOdd, labelEven] = mg;
    const count = (mgUseCounts[tech.id] = (mgUseCounts[tech.id] || 0) + 1);
    const type  = count % 2 === 1 ? typeOdd : typeEven;
    const label = count % 2 === 1 ? labelOdd : labelEven;
    showMinigame(type, diff, label, callback, forcedPhrase);
  } else {
    const typeMap = { damage:'timing', multi:'mash', stun:'sequence', heal:'hold' };
    const type = typeMap[tech.effect] || 'timing';
    const diff = tech.rarity === 'legendary' ? 3 : tech.rarity === 'rare' ? 2 : 1;
    showMinigame(type, diff, `${tech.icon} ${tech.name}`, callback, forcedPhrase);
  }
}

// Reset use counts at start of each battle
function resetMgCounts() {
  Object.keys(mgUseCounts).forEach(k => delete mgUseCounts[k]);
  basicAttackUseCount = 0;
  // Safety: always reset mgActive when a new battle starts
  mgActive = false;
  mgResolve = null;
  const overlay = MG_CONTAINER();
  if (overlay) overlay.classList.add('hidden');
}
