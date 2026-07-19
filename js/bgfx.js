// ===== ANIMATED BACKGROUND =====
(function() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle types: stars, orbs, comets
  const PARTICLES = [];
  const COUNT = 120;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function hsl(h, s, l, a) { return `hsla(${h},${s}%,${l}%,${a})`; }

  // Colour palette
  const COLS = [
    'rgba(108,159,255,',   // accent blue
    'rgba(176,106,255,',   // accent purple
    'rgba(245,197,66,',    // gold
    'rgba(39,174,96,',     // green
    'rgba(255,255,255,',   // white
  ];

  for (let i = 0; i < COUNT; i++) {
    const typeRoll = Math.random();
    const type = typeRoll < 0.05 ? 'comet' : typeRoll < 0.20 ? 'orb' : 'star';
    const depthLayer = Math.random();
    const depth = depthLayer < 0.3 ? 0.4 : depthLayer < 0.8 ? 0.7 : 1.0;
    const speedMult = depth;
    PARTICLES.push({
      x: rand(0, 1),
      y: rand(0, 1),
      r: type === 'comet' ? rand(1, 2) : rand(0.5, 2.5),
      speed: (type === 'comet' ? rand(0.0004, 0.001) : rand(0.00008, 0.0003)) * speedMult,
      angle: rand(0, Math.PI * 2),
      drift: rand(-0.0005, 0.0005),
      col: COLS[Math.floor(Math.random() * COLS.length)],
      alpha: type === 'comet' ? rand(0.5, 0.9) : rand(0.15, 0.6),
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.04),
      type: type,
      depth: depth,
      trail: type === 'comet' ? [] : undefined,
    });
  }

  let t = 0;

  function draw() {
    const W = canvas.width;
    const H = canvas.height;
    t++;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Deep space gradient
    const grad = ctx.createRadialGradient(W*0.5, H*0.4, 0, W*0.5, H*0.4, Math.max(W, H) * 0.8);
    grad.addColorStop(0, 'rgba(14,18,32,0.0)');
    grad.addColorStop(0.5, 'rgba(8,11,18,0.6)');
    grad.addColorStop(1, 'rgba(4,6,12,0.9)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Nebula blobs (colour cycling via HSL)
    const hueOffset = (t * (360 / (60 * 60))) % 360;
    const nebulaData = [
      { cx: 0.2, cy: 0.15, rx: 0.35, ry: 0.25, hue: hueOffset, a: 0.04 + 0.02 * Math.sin(t * 0.003) },
      { cx: 0.8, cy: 0.8,  rx: 0.3,  ry: 0.3,  hue: (hueOffset + 120) % 360, a: 0.035 + 0.015 * Math.sin(t * 0.004 + 1) },
      { cx: 0.5, cy: 0.5,  rx: 0.5,  ry: 0.4,  hue: (hueOffset + 240) % 360, a: 0.5 },
    ];
    nebulaData.forEach(n => {
      const g = ctx.createRadialGradient(n.cx*W, n.cy*H, 0, n.cx*W, n.cy*H, n.rx*W);
      g.addColorStop(0, hsl(n.hue, 70, 20, n.a));
      g.addColorStop(1, hsl(n.hue, 70, 20, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // Particles
    PARTICLES.forEach(p => {
      p.angle += p.drift;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed * 0.5 - 0.00005 * p.depth;
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05)  p.x = -0.05;
      if (p.y < -0.05) p.y = 1.05;
      if (p.y > 1.05)  p.y = -0.05;

      p.pulse += p.pulseSpeed;
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      const r = p.r * (0.8 + 0.2 * Math.sin(p.pulse * 0.7));

      if (p.type === 'comet') {
        if (p.trail) {
          p.trail.push({ x: p.x, y: p.y, a: 1 });
          if (p.trail.length > 20) p.trail.shift();
        }
        const tailLen = p.trail.length;
        if (tailLen > 1) {
          for (let i = 0; i < tailLen - 1; i++) {
            const tp = p.trail[i];
            const fade = (i / tailLen) * 0.5;
            ctx.beginPath();
            ctx.moveTo(tp.x * W, tp.y * H);
            ctx.lineTo(p.trail[i + 1].x * W, p.trail[i + 1].y * H);
            ctx.strokeStyle = p.col + fade + ')';
            ctx.lineWidth = r * (i / tailLen);
            ctx.stroke();
          }
        }
        const g = ctx.createRadialGradient(p.x*W, p.y*H, 0, p.x*W, p.y*H, r * 3);
        g.addColorStop(0, p.col + alpha + ')');
        g.addColorStop(1, p.col + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x*W, p.y*H, r * 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'orb') {
        const g = ctx.createRadialGradient(p.x*W, p.y*H, 0, p.x*W, p.y*H, r * 4);
        g.addColorStop(0, p.col + alpha + ')');
        g.addColorStop(1, p.col + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x*W, p.y*H, r * 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.col + alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x*W, p.y*H, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Subtle vignette pulse
    const vignetteAlpha = 0.55 + 0.02 * Math.sin(t * (2 * Math.PI) / (10 * 60));
    const vg = ctx.createRadialGradient(W*0.5, H*0.5, W*0.2, W*0.5, H*0.5, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`);
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(draw);
  }

  draw();
})();
