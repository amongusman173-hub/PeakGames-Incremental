// ===== COMBAT MINIGAMES =====

let mgActive = false;
let mgResolve = null;
// Track how many times each technique has been used this battle (for alternating)
const mgUseCounts = {};

const MG_CONTAINER = () => document.getElementById('mg-overlay');

function showMinigame(type, difficulty, label, callback, forcedPhrase) {
  if (mgActive) { callback(1); return; }
  mgActive = true;
  mgResolve = callback;

  const overlay = MG_CONTAINER();
  if (!overlay) { callback(1); return; }
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
    default:          resolveMinigame(1);
  }
}

function resolveMinigame(mult) {
  mgActive = false;
  const overlay = MG_CONTAINER();
  if (overlay) overlay.classList.add('hidden');
  if (mgResolve) { mgResolve(mult); mgResolve = null; }
}

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

// ── QUICK JOB MINIGAME — 7 unique medium-difficulty games, rotates ──
const QUICK_JOB_GAMES = [
  // 1. Timing — hit the zone
  (job, cb) => showMinigame('timing', 2, `⚡ ${job.icon} Quick Work — hit the zone!`, cb),
  // 2. Mash — rapid clicks
  (job, cb) => showMinigame('mash', 2, `⚡ ${job.icon} Quick Work — mash it!`, cb),
  // 3. Reaction — instant click
  (job, cb) => showMinigame('reaction', 2, `⚡ ${job.icon} Quick Work — react fast!`, cb),
  // 4. Sequence — arrow pattern
  (job, cb) => showMinigame('sequence', 2, `⚡ ${job.icon} Quick Work — follow the pattern!`, cb),
  // 5. Hold — charge and release
  (job, cb) => showMinigame('hold', 2, `⚡ ${job.icon} Quick Work — hold and release!`, cb),
  // 6. Draw line — slash straight
  (job, cb) => showMinigame('draw_line', 2, `⚡ ${job.icon} Quick Work — slash straight!`, cb),
  // 7. Dual zone — hit both zones
  (job, cb) => showMinigame('dual_zone', 2, `⚡ ${job.icon} Quick Work — hit both zones!`, cb),
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
  const timeLimit = [3000, 2500, 2000][Math.min(2, difficulty - 1)];
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

// ── BASIC ATTACK — harder timing (difficulty 2) ──
let basicAttackUseCount = 0;
function basicAttackMinigame(callback) {
  basicAttackUseCount++;
  // Alternates between hard timing and mash
  const type = basicAttackUseCount % 2 === 1 ? 'timing' : 'mash';
  const label = type === 'timing' ? '⚔️ Basic Attack — hit the zone!' : '⚔️ Basic Attack — mash it!';
  showMinigame(type, 2, label, callback);
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
  // JJK secret techniques
  'vessel_switch':   ['reaction',  'dual_zone', 3, '🩸 Vessel Switch — react!', '🩸 Vessel Switch — double!'],
  'dismantle':       ['timing',    'dual_zone', 3, '✂️ Dismantle — precise cut!', '✂️ Dismantle — double slash!'],
  'cleave':          ['mash',      'sequence',  3, '🔪 Cleave — mash it!',     '🔪 Cleave — pattern!'],
  'fuga':            ['hold',      'dual_zone', 3, '🔥 Fuga — charge the flame!', '🔥 Fuga — double fire!'],
  'domain_expansion':['typing',    'reaction',  3, '🏯 Domain Expansion — type it!', '🏯 Malevolent Shrine — react!'],
};

// Forced phrases for specific techniques — always type exactly this
const TECHNIQUE_FORCED_PHRASES = {
  'domain_expansion': 'domain expansion',
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
}
