// ===== FIRST-TIME TUTORIAL =====
// Uses 4-panel cutout backdrop so the highlighted element is fully visible
// through a hole in the overlay — no stacking context issues.

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Ascendant!',
    text: 'You are a fledgling warrior about to embark on an epic journey. This tutorial will guide you through the basics.',
    target: null,
    align: 'center',
  },
  {
    title: 'Your Hero',
    text: 'This is your hero info — level, HP, XP, and stamina. Keep an eye on these as you train and fight.',
    target: '#player-info',
    align: 'bottom',
  },
  {
    title: 'Resources',
    text: 'Gold is your currency. Attack, Defense, and Speed determine your combat power.',
    target: '#hdr-resources',
    align: 'bottom',
  },
  {
    title: 'Status Bars',
    text: '❤️ HP determines how much damage you can take. ✨ XP fills as you train — when full, you level up! ⚡ Stamina regenerates slowly and is used for training.',
    target: '#hdr-bars',
    align: 'bottom',
  },
  {
    title: 'Navigation',
    text: 'Use these tabs to switch between different areas. Some tabs are locked until you reach higher levels — they\'ll unlock as you progress!',
    target: '#tabs',
    align: 'bottom',
  },
  {
    title: 'Training',
    text: 'Start by training! Each training action costs stamina and grants XP and stat boosts. Higher-level actions are more efficient but cost more stamina.',
    target: '#tab-training',
    align: 'top',
  },
  {
    title: 'Your First Steps',
    text: '1. Click a training action to start gaining XP.\n2. When you reach Lv.3, Jobs unlock — earn gold passively.\n3. Story gives you narrative context and unlocks features.\n4. Explore and have fun!',
    target: null,
    align: 'center',
  },
];

let tutorialStep = 0;
let tutorialActive = false;

function shouldShowTutorial() {
  return G.player.level <= 1 && G.player.xp === 0 && !G.player._tutorialDone;
}

function startTutorial() {
  if (!shouldShowTutorial()) return;
  tutorialActive = true;
  tutorialStep = 0;
  showTutorialStep();
}

function _buildCutoutPanels(rect, pad) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const t = Math.max(0, rect.top - pad);
  const b = Math.max(0, vh - rect.bottom - pad);
  const l = Math.max(0, rect.left - pad);
  const r = Math.max(0, vw - rect.right - pad);
  const w = rect.width + pad * 2;
  const h = rect.height + pad * 2;
  const gap = 4; // gap between panels and highlight for glow visibility

  return `
    <div class="tut-panel" style="top:0;left:0;right:0;height:${t - gap}px"></div>
    <div class="tut-panel" style="bottom:0;left:0;right:0;height:${b - gap}px"></div>
    <div class="tut-panel" style="top:${t - gap}px;left:0;width:${l - gap}px;height:${h + gap * 2}px"></div>
    <div class="tut-panel" style="top:${t - gap}px;right:0;width:${r - gap}px;height:${h + gap * 2}px"></div>
    <div class="tut-highlight-ring" style="left:${rect.left - pad}px;top:${rect.top - pad}px;width:${w}px;height:${h}px;border-radius:${Math.min(12, pad)}px"></div>
  `;
}

function showTutorialStep() {
  if (tutorialStep >= TUTORIAL_STEPS.length) {
    endTutorial();
    return;
  }

  const step = TUTORIAL_STEPS[tutorialStep];
  const existing = document.getElementById('tutorial-overlay');
  if (existing) existing.remove();

  // Remove old reposition handler
  if (window._tutReposition) {
    window.removeEventListener('resize', window._tutReposition);
    window._tutReposition = null;
  }

  const overlay = document.createElement('div');
  overlay.id = 'tutorial-overlay';

  let panelsHTML = '';
  let cardAlign = step.align || 'center';

  if (step.target) {
    const el = document.querySelector(step.target);
    if (el) {
      const content = document.getElementById('content');
      if (content) content.scrollTop = 0;
      el.scrollIntoView({ behavior: 'instant', block: 'center' });
      // Build panels immediately, then reposition after a frame
      const rect = el.getBoundingClientRect();
      panelsHTML = _buildCutoutPanels(rect, 8);

      // Reposition on scroll/resize
      const reposition = () => {
        const r2 = el.getBoundingClientRect();
        const panels = overlay.querySelectorAll('.tut-panel');
        const ring = overlay.querySelector('.tut-highlight-ring');
        if (!ring) return;
        const newPanels = _buildCutoutPanels(r2, 8);
        // Replace panels + ring innerHTML
        const tmp = document.createElement('div');
        tmp.innerHTML = newPanels;
        // Remove old panels/ring
        overlay.querySelectorAll('.tut-panel,.tut-highlight-ring').forEach(e => e.remove());
        // Add new
        while (tmp.firstChild) overlay.appendChild(tmp.firstChild);
      };
      window._tutReposition = reposition;
      window.addEventListener('resize', reposition);
    }
  }

  overlay.innerHTML = `
    <div class="tut-skip-btn" onclick="event.stopPropagation();tutorialSkip()" title="Skip tutorial">✕ Skip</div>
    ${panelsHTML}
    <div class="tutorial-card tutorial-${cardAlign}">
      <div class="tutorial-step-counter">${tutorialStep + 1} / ${TUTORIAL_STEPS.length}</div>
      <h3 class="tutorial-title">${step.title}</h3>
      <p class="tutorial-text">${step.text.replace(/\n/g, '<br>')}</p>
      <div class="tutorial-actions">
        ${tutorialStep > 0 ? '<button class="btn-small" onclick="event.stopPropagation();tutorialPrev()">← Back</button>' : ''}
        <button class="btn-primary tut-next-btn" onclick="event.stopPropagation();tutorialNext()">${tutorialStep < TUTORIAL_STEPS.length - 1 ? 'Next →' : 'Start Playing!'}</button>
      </div>
    </div>
  `;

  overlay.addEventListener('click', (e) => { e.stopPropagation(); });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('tutorial-visible'));
}

function tutorialNext() {
  tutorialStep++;
  showTutorialStep();
}

function tutorialPrev() {
  if (tutorialStep > 0) tutorialStep--;
  showTutorialStep();
}

function tutorialSkip() {
  endTutorial();
}

function endTutorial() {
  tutorialActive = false;
  G.player._tutorialDone = true;
  document.body.style.overflow = '';
  if (window._tutReposition) {
    window.removeEventListener('resize', window._tutReposition);
    window._tutReposition = null;
  }
  const overlay = document.getElementById('tutorial-overlay');
  if (overlay) {
    overlay.classList.remove('tutorial-visible');
    setTimeout(() => overlay.remove(), 300);
  }
}

function resetTutorial() {
  G.player._tutorialDone = false;
  startTutorial();
}
