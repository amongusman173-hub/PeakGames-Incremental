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

  // Particle types: stars, orbs, runes
  const PARTICLES = [];
  const COUNT = 80;

  function rand(a, b) { return a + Math.random() * (b - a); }

  // Colour palette
  const COLS = [
    'rgba(108,159,255,',   // accent blue
    'rgba(176,106,255,',   // accent purple
    'rgba(245,197,66,',    // gold
    'rgba(39,174,96,',     // green
    'rgba(255,255,255,',   // white
  ];

  for (let i = 0; i < COUNT; i++) {
    PARTICLES.push({
      x: rand(0, 1),
      y: rand(0, 1),
      r: rand(0.5, 2.5),
      speed: rand(0.00008, 0.0003),
      angle: rand(0, Math.PI * 2),
      drift: rand(-0.0005, 0.0005),
      col: COLS[Math.floor(Math.random() * COLS.length)],
      alpha: rand(0.15, 0.6),
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.04),
      type: Math.random() < 0.15 ? 'orb' : 'star',
    });
  }

  // Flowing energy lines
  const LINES = [];
  for (let i = 0; i < 6; i++) {
    LINES.push({
      points: Array.from({length: 8}, (_, j) => ({
        x: j / 7,
        y: rand(0.1, 0.9),
        vy: rand(-0.0002, 0.0002),
      })),
      col: COLS[Math.floor(Math.random() * COLS.length)],
      alpha: rand(0.03, 0.08),
      speed: rand(0.00005, 0.00015),
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

    // Nebula blobs
    const nebulaData = [
      { cx: 0.2, cy: 0.15, rx: 0.35, ry: 0.25, col: 'rgba(108,159,255,', a: 0.04 + 0.02 * Math.sin(t * 0.003) },
      { cx: 0.8, cy: 0.8,  rx: 0.3,  ry: 0.3,  col: 'rgba(176,106,255,', a: 0.035 + 0.015 * Math.sin(t * 0.004 + 1) },
      { cx: 0.5, cy: 0.5,  rx: 0.5,  ry: 0.4,  col: 'rgba(8,11,18,',     a: 0.5 },
    ];
    nebulaData.forEach(n => {
      const g = ctx.createRadialGradient(n.cx*W, n.cy*H, 0, n.cx*W, n.cy*H, n.rx*W);
      g.addColorStop(0, n.col + n.a + ')');
      g.addColorStop(1, n.col + '0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // Energy lines
    LINES.forEach(line => {
      line.points.forEach(p => {
        p.y += p.vy;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
      });
      ctx.beginPath();
      ctx.moveTo(line.points[0].x * W, line.points[0].y * H);
      for (let i = 1; i < line.points.length - 1; i++) {
        const mx = (line.points[i].x + line.points[i+1].x) / 2 * W;
        const my = (line.points[i].y + line.points[i+1].y) / 2 * H;
        ctx.quadraticCurveTo(line.points[i].x * W, line.points[i].y * H, mx, my);
      }
      ctx.strokeStyle = line.col + line.alpha + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Particles
    PARTICLES.forEach(p => {
      p.angle += p.drift;
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed * 0.5 - 0.00005; // slight upward drift
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05)  p.x = -0.05;
      if (p.y < -0.05) p.y = 1.05;
      if (p.y > 1.05)  p.y = -0.05;

      p.pulse += p.pulseSpeed;
      const alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      const r = p.r * (0.8 + 0.2 * Math.sin(p.pulse * 0.7));

      if (p.type === 'orb') {
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

    requestAnimationFrame(draw);
  }

  draw();
})();
