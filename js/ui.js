// ===== UI SYSTEM =====

const TAB_ORDER = ['training','jobs','raids','dig','shop','dojo','library','inventory','story','alchemy','rebirth','garden','heritage','settings'];
let activeTab = 'training';

function initUI() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Global button click sound — skip during active minigames to avoid interference
  document.addEventListener('click', e => {
    if (typeof mgActive !== 'undefined' && mgActive) return;
    const btn = e.target.closest('button, .btn-primary, .btn-small, .btn-action, .tab-btn');
    if (btn && !btn.disabled) {
      playSound('buttonpress', 0.35);
    }
  });

  // Ripple effect on all btn-primary clicks
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-primary');
    if (!btn || btn.disabled) return;
    btn.classList.remove('ripple');
    void btn.offsetWidth;
    btn.classList.add('ripple');
    setTimeout(() => btn.classList.remove('ripple'), 400);
  });
}

function switchTab(tab) {
  if (tab === activeTab) return;

  const oldIdx = TAB_ORDER.indexOf(activeTab);
  const newIdx = TAB_ORDER.indexOf(tab);
  const goRight = newIdx > oldIdx;

  // Hide old panel
  const oldPanel = document.getElementById(`tab-${activeTab}`);
  if (oldPanel) oldPanel.classList.remove('active', 'slide-from-left', 'slide-from-right');

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));

  // Show new panel with direction animation
  const newPanel = document.getElementById(`tab-${tab}`);
  if (newPanel) {
    newPanel.classList.remove('slide-from-left', 'slide-from-right');
    newPanel.classList.add('active');
    // Apply direction class for animation
    if (goRight) {
      newPanel.classList.remove('slide-from-left');
    } else {
      newPanel.classList.add('slide-from-left');
    }
  }

  activeTab = tab;
  refreshTab(tab);
  // Scroll content to top on tab switch
  const content = document.getElementById('content');
  if (content) content.scrollTop = 0;
}

function refreshTab(tab) {
  if (tab === 'training') renderTraining();
  if (tab === 'jobs')     renderJobs();
  if (tab === 'raids')    renderRaids();
  if (tab === 'inventory') renderInventory();
  if (tab === 'story')    renderStoryChapters();
  if (tab === 'rebirth')  renderRebirthPanel();
  if (tab === 'dig')      renderDigUI();
  if (tab === 'shop')     renderSkillTree();
  if (tab === 'alchemy')  renderAlchemy();
  if (tab === 'dojo')     renderDojo();
  if (tab === 'library')  renderLibrary();
  if (tab === 'settings') renderSettings();
  if (tab === 'garden')   renderGarden();
  if (tab === 'heritage') renderHeritage();
}

function updateActiveTabUI() {
  // Jobs: only update the progress bar, NOT full re-render (prevents hover flicker)
  if (activeTab === 'jobs') {
    if (G.activeJob) {
      const job = JOBS.find(j => j.id === G.activeJob);
      if (job) {
        const progress = (G.player.jobProgress && G.player.jobProgress[G.activeJob]) || 0;
        const pct = Math.floor((progress / job.ticksNeeded) * 100);
        const bar = document.getElementById('job-progress-bar-' + G.activeJob);
        if (bar) bar.style.width = pct + '%';
      }
    }
  }
  if (activeTab === 'dig') {
    updateDigInfo();
    // Only re-render upgrades when gold changes (avoid per-tick DOM churn)
    const goldNow = Math.floor(G.player.gold);
    if (goldNow !== (updateActiveTabUI._lastGold || -1)) {
      updateActiveTabUI._lastGold = goldNow;
      renderDigUpgrades();
    }
  }
  if (activeTab === 'garden') updateGardenTimers();
  if (activeTab === 'library') updateLibraryProgress();

  // Training: update both the banner bar AND the in-card session bar live
  if (G.activeTraining) {
    const action = TRAINING_ACTIONS.find(a => a.id === G.activeTraining);
    const needed = action ? getTrainingTicksNeeded(action) : 16;
    const pct = Math.floor((G.trainingTick / needed) * 100);
    // Banner bar
    const bannerBar = document.getElementById('training-banner-bar');
    if (bannerBar) bannerBar.style.width = pct + '%';
    // In-card session bar (has a stable id)
    const sessionBar = document.getElementById('session-bar-' + G.activeTraining);
    if (sessionBar) sessionBar.style.width = pct + '%';
  }
}

// Cache header DOM elements once — cleared if DOM rebuilds
const _hdrEls = {};
function _hdrEl(id) {
  if (!_hdrEls[id] || !_hdrEls[id].isConnected) {
    _hdrEls[id] = document.getElementById(id);
  }
  return _hdrEls[id];
}

function updateHeader() {
  const p = G.player;
  const set = (id, val) => { const el = _hdrEl(id); if (el) el.textContent = val; };
  const setW = (id, pct) => { const el = _hdrEl(id); if (el) el.style.width = Math.max(0, Math.min(100, pct)) + '%'; };

  set('hdr-name', p.name);
  set('hdr-level', `Lv.${p.level}`);
  set('hdr-rebirth', `✦ R${p.rebirthCount}`);

  setW('bar-hp', (p.hp / p.maxHp) * 100);
  set('txt-hp', `${Math.floor(p.hp)}/${p.maxHp}`);
  setW('bar-xp', (p.xp / p.xpNeeded) * 100);
  set('txt-xp', `${Math.floor(p.xp)}/${p.xpNeeded}`);
  setW('bar-stamina', (p.stamina / p.maxStamina) * 100);
  const regenPerSec = ((1 + (p.spd / 10) * 0.1) / 8 * (1000 / G.tickRate)).toFixed(1);
  set('txt-stamina', `${Math.floor(p.stamina)}/${p.maxStamina} (+${regenPerSec}/s)`);

  set('res-gold', Math.floor(p.gold));
  set('res-atk', Math.floor(p.atk));
  set('res-def', Math.floor(p.def));
  set('res-spd', Math.floor(p.spd));
}

// ===== FLOATING TEXT VFX =====
function spawnFloatingText(text, cls, anchorId) {
  const anchorEl = document.getElementById(anchorId || 'res-gold');
  if (!anchorEl) return;
  const rect = anchorEl.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = `float-text ${cls}`;
  el.textContent = text;
  el.style.left = (rect.left + rect.width / 2 - 20 + (Math.random() * 30 - 15)) + 'px';
  el.style.top  = (rect.top + window.scrollY - 4) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}

// ===== SOUND SYSTEM =====
// Pre-load audio pool to avoid creating new Audio objects on every click
const _audioPool = {};

function _getAudioPool(url, poolSize = 4) {
  if (!_audioPool[url]) {
    _audioPool[url] = { pool: Array.from({length: poolSize}, () => new Audio(url)), idx: 0 };
  }
  return _audioPool[url];
}

function playSound(name, volume = 0.6) {
  try {
    const s = typeof getSettings === 'function' ? getSettings() : { sfxVolume: 0.7 };
    const vol = (s.sfxVolume ?? 0.7) * volume;
    if (vol <= 0) return;
    const url = `sound/${encodeURIComponent(name + '.mp3')}`;
    const entry = _getAudioPool(url);
    const a = entry.pool[entry.idx % entry.pool.length];
    entry.idx++;
    a.volume = Math.min(1, vol);
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch(e) {}
}

let _bgMusic = null;
let _musicStarted = false;

function playBgMusic() {
  try {
    if (!_bgMusic) {
      _bgMusic = new Audio('sound/backroundmusic.mp3');
      _bgMusic.loop = true;
      _bgMusic.preload = 'auto';
    }
    const s = typeof getSettings === 'function' ? getSettings() : { musicVolume: 0.5 };
    _bgMusic.volume = Math.min(1, Math.max(0, s.musicVolume ?? 0.5));

    if (_bgMusic.volume > 0) {
      const tryPlay = () => {
        _bgMusic.play().then(() => {
          _musicStarted = true;
        }).catch(() => {
          // Autoplay blocked — wait for first user interaction
          if (!_musicStarted) {
            const onInteract = () => {
              _bgMusic.play().catch(() => {});
              _musicStarted = true;
              document.removeEventListener('click', onInteract);
              document.removeEventListener('keydown', onInteract);
              document.removeEventListener('touchstart', onInteract);
            };
            document.addEventListener('click', onInteract, { once: true });
            document.addEventListener('keydown', onInteract, { once: true });
            document.addEventListener('touchstart', onInteract, { once: true });
          }
        });
      };
      tryPlay();
    }
  } catch(e) {}
}

function updateMusicVolume() {
  if (!_bgMusic) return;
  try {
    const s = typeof getSettings === 'function' ? getSettings() : { musicVolume: 0.5 };
    const vol = Math.min(1, Math.max(0, s.musicVolume ?? 0.5));
    _bgMusic.volume = vol;
    if (vol > 0) {
      _bgMusic.play().catch(() => {});
    } else {
      _bgMusic.pause();
    }
  } catch(e) {}
}

// ===== TOAST =====
function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  el.style.cursor = 'pointer';
  el.title = 'Click to dismiss';
  const timer = setTimeout(() => el.remove(), 3000);
  el.addEventListener('click', () => { clearTimeout(timer); el.remove(); });
  container.appendChild(el);
}

// ===== KONAMI CODE — Admin Panel =====
// ↑ ↑ ↓ ↓ ← → ← → B A Enter
const KONAMI_SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a','Enter'];
const KONAMI_ARROWS = new Set(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight']);
let konamiPos = 0;

document.addEventListener('keydown', function(e) {
  // Skip if typing in a field
  const tag = (document.activeElement || {}).tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

  // Skip if admin panel already open
  const panel = document.getElementById('admin-panel');
  if (panel && !panel.classList.contains('hidden')) return;

  const key = e.key;
  const expected = KONAMI_SEQ[konamiPos];

  if (key === expected) {
    if (KONAMI_ARROWS.has(key)) e.preventDefault();
    konamiPos++;
    if (konamiPos === KONAMI_SEQ.length) {
      konamiPos = 0;
      openAdminPanel();
    }
  } else {
    // Reset, but check if this key starts the sequence
    konamiPos = (key === KONAMI_SEQ[0]) ? 1 : 0;
  }
});

function openAdminPanel() {
  // Show custom password modal instead of prompt()
  const existing = document.getElementById('admin-pw-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'admin-pw-modal';
  modal.style.cssText = `position:fixed;inset:0;z-index:4000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px)`;
  modal.innerHTML = `
    <div style="background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:28px 32px;min-width:280px;box-shadow:0 8px 40px rgba(0,0,0,0.6)">
      <div style="font-size:22px;font-weight:800;color:var(--gold);margin-bottom:6px">🔧 Admin Panel</div>
      <div style="font-size:12px;color:var(--dim);margin-bottom:18px">Enter password to continue</div>
      <div style="position:relative;margin-bottom:16px">
        <input id="admin-pw-input" type="password"
          style="width:100%;box-sizing:border-box;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:10px 40px 10px 12px;color:var(--text);font-size:15px;outline:none;letter-spacing:3px"
          placeholder="••••••" autocomplete="off" maxlength="32">
        <button id="admin-pw-eye" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;font-size:16px;color:var(--dim);padding:0">👁</button>
      </div>
      <div id="admin-pw-err" style="font-size:12px;color:var(--danger);margin-bottom:12px;min-height:16px"></div>
      <div style="display:flex;gap:8px">
        <button id="admin-pw-submit" class="btn-primary" style="flex:1">Unlock</button>
        <button id="admin-pw-cancel" class="btn-small" style="flex:1">Cancel</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const input  = modal.querySelector('#admin-pw-input');
  const errEl  = modal.querySelector('#admin-pw-err');
  const eyeBtn = modal.querySelector('#admin-pw-eye');

  setTimeout(() => input.focus(), 50);

  // Toggle show/hide password
  eyeBtn.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    eyeBtn.textContent = input.type === 'password' ? '👁' : '🙈';
  });

  function submit() {
    if (input.value === 'rah') {
      modal.remove();
      renderAdminPanel();
      document.getElementById('admin-panel')?.classList.remove('hidden');
      toast('🔧 Admin panel opened', 'warn');
    } else {
      errEl.textContent = '❌ Wrong password.';
      input.value = '';
      input.focus();
      input.style.borderColor = 'var(--danger)';
      setTimeout(() => { input.style.borderColor = 'var(--border)'; }, 800);
    }
  }

  modal.querySelector('#admin-pw-submit').addEventListener('click', submit);
  modal.querySelector('#admin-pw-cancel').addEventListener('click', () => modal.remove());
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') modal.remove();
  });
}

function renderAdminPanel() {
  const container = document.getElementById('admin-panel-body');
  if (!container) return;
  const p = G.player;

  // Build clan options
  const clanOpts = (typeof CLANS !== 'undefined' ? CLANS : [])
    .map(c => `<option value="${c.id}" ${(p.heritage?.clan === c.id) ? 'selected' : ''}>${c.icon} ${c.name} (${c.rarity})</option>`)
    .join('');
  const weaponOpts = (typeof WEAPONS !== 'undefined' ? WEAPONS : [])
    .map(w => `<option value="${w.id}" ${(p.heritage?.weapon === w.id) ? 'selected' : ''}>${w.icon} ${w.name} (${w.rarity})</option>`)
    .join('');
  const styleOpts = (typeof FIGHTING_STYLES !== 'undefined' ? FIGHTING_STYLES : [])
    .map(s => `<option value="${s.id}" ${(p.heritage?.style === s.id) ? 'selected' : ''}>${s.icon} ${s.name} (${s.rarity})</option>`)
    .join('');

  // Build technique options
  const techOpts = (typeof TECHNIQUES !== 'undefined' ? TECHNIQUES : [])
    .map(t => `<option value="${t.id}">${t.icon} ${t.name}</option>`)
    .join('');

  container.innerHTML = `
    <div class="admin-grid">
      <div class="admin-section">
        <div class="admin-section-title">💰 Resources</div>
        <div class="admin-row">
          <label>Gold</label>
          <input id="admin-gold-input" type="number" value="10000" min="0">
          <button class="btn-small" onclick="adminAddGold()">Add</button>
        </div>
        <div class="admin-row">
          <label>XP</label>
          <input id="admin-xp-input" type="number" value="5000" min="0">
          <button class="btn-small" onclick="adminAddXP()">Add</button>
        </div>
        <div class="admin-row">
          <label>Level</label>
          <input id="admin-level-input" type="number" value="${p.level}" min="1" max="100">
          <button class="btn-small" onclick="adminSetLevel()">Set</button>
        </div>
      </div>

      <div class="admin-section">
        <div class="admin-section-title">⚔️ Stats</div>
        <div class="admin-row">
          <label>ATK</label>
          <input id="admin-atk" type="number" value="${Math.floor(p.atk)}" min="0">
          <button class="btn-small" onclick="adminSetStat('atk','admin-atk')">Set</button>
        </div>
        <div class="admin-row">
          <label>DEF</label>
          <input id="admin-def" type="number" value="${Math.floor(p.def)}" min="0">
          <button class="btn-small" onclick="adminSetStat('def','admin-def')">Set</button>
        </div>
        <div class="admin-row">
          <label>SPD</label>
          <input id="admin-spd" type="number" value="${Math.floor(p.spd)}" min="0">
          <button class="btn-small" onclick="adminSetStat('spd','admin-spd')">Set</button>
        </div>
        <div class="admin-row">
          <label>Max HP</label>
          <input id="admin-hp" type="number" value="${p.maxHp}" min="1">
          <button class="btn-small" onclick="adminSetStat('maxHp','admin-hp')">Set</button>
        </div>
        <button class="btn-small" style="margin-top:6px;width:100%" onclick="adminMaxStats()">⚡ Max All Stats</button>
      </div>

      <div class="admin-section">
        <div class="admin-section-title">🏛️ Heritage</div>
        <div class="admin-row">
          <label>Clan</label>
          <select id="admin-clan" style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:3px;color:var(--text);font-size:11px">${clanOpts}</select>
          <button class="btn-small" onclick="adminSetClan()">Set</button>
        </div>
        <div class="admin-row">
          <label>Weapon</label>
          <select id="admin-weapon" style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:3px;color:var(--text);font-size:11px">${weaponOpts}</select>
          <button class="btn-small" onclick="adminSetWeapon()">Set</button>
        </div>
        <div class="admin-row">
          <label>Style</label>
          <select id="admin-style" style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:3px;color:var(--text);font-size:11px">${styleOpts}</select>
          <button class="btn-small" onclick="adminSetStyle()">Set</button>
        </div>
      </div>

      <div class="admin-section">
        <div class="admin-section-title">🎒 Techniques</div>
        <div class="admin-row">
          <select id="admin-tech-select" style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:4px;padding:3px;color:var(--text);font-size:11px">${techOpts}</select>
          <button class="btn-small" onclick="adminGrantTech()">Grant</button>
        </div>
        <div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">
          <button class="btn-small" onclick="adminAllTechs()">All Techniques</button>
          <button class="btn-small" onclick="adminGrantSukuna()">🩸 Sukuna Set</button>
          <button class="btn-small" onclick="adminGrantGojo()">🔵 Gojo Set</button>
          <button class="btn-small" onclick="adminClearTechs()">Clear All</button>
        </div>
      </div>

      <div class="admin-section">
        <div class="admin-section-title">⛏️ Dig</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn-small" onclick="adminFillCharges()">Fill Charges</button>
          <button class="btn-small" onclick="adminSonarAll()">Reveal All</button>
          <button class="btn-small" onclick="adminGrantFinger()">🩸 Sukuna Finger</button>
        </div>
      </div>
    </div>
  `;
}

function adminAddGold() {
  const v = parseInt(document.getElementById('admin-gold-input')?.value) || 0;
  G.player.gold += v;
  toast(`+${v} gold added`, 'success');
}
function adminSetLevel() {
  const v = parseInt(document.getElementById('admin-level-input')?.value) || 1;
  G.player.level = Math.max(1, Math.min(100, v));
  onLevelUp();
  toast(`Level set to ${G.player.level}`, 'success');
}
function adminAddXP() {
  const v = parseInt(document.getElementById('admin-xp-input')?.value) || 0;
  gainXP(v);
  toast(`+${v} XP added`, 'success');
}
function adminMaxStats() {
  G.player.atk = 999; G.player.def = 999; G.player.spd = 999;
  G.player.maxHp = 9999; G.player.hp = 9999;
  G.player.maxStamina = 999; G.player.stamina = 999;
  toast('Stats maxed!', 'success');
}
function adminAllTechs() {
  const { TECHNIQUES } = window;
  if (!TECHNIQUES) return;
  TECHNIQUES.forEach(t => { if (!G.player.techniques.includes(t.id)) G.player.techniques.push(t.id); });
  renderInventory();
  toast('All techniques granted!', 'success');
}
function adminFillCharges() {
  G.player.digCharges = getMaxDigCharges();
  G.player.sonarCharges = 10;
  updateDigInfo();
  updateSonarButton();
  toast('Dig charges filled!', 'success');
}
function adminSonarAll() {
  digGrid.forEach(t => { t.dug = true; });
  renderDigGrid();
  updateDigStats();
  toast('All tiles revealed!', 'success');
}

function adminSetStat(stat, inputId) {
  const v = parseInt(document.getElementById(inputId)?.value) || 0;
  G.player[stat] = v;
  if (stat === 'maxHp') G.player.hp = Math.min(G.player.hp, v);
  toast(`${stat} set to ${v}`, 'success');
}
function adminSetClan() {
  const id = document.getElementById('admin-clan')?.value;
  if (!id || typeof CLANS === 'undefined') return;
  const clan = CLANS.find(c => c.id === id);
  if (!clan) return;
  if (!G.player.heritage) G.player.heritage = {};
  G.player.heritage.clan = id;
  if (clan.bonus) {
    if (clan.bonus.atk)   G.player.atk   += clan.bonus.atk;
    if (clan.bonus.def)   G.player.def   += clan.bonus.def;
    if (clan.bonus.spd)   G.player.spd   += clan.bonus.spd;
    if (clan.bonus.maxHp) { G.player.maxHp += clan.bonus.maxHp; G.player.hp = Math.min(G.player.hp + clan.bonus.maxHp, G.player.maxHp); }
  }
  if (clan.techs) clan.techs.forEach(t => grantTechnique(t));
  if (clan._gojo && typeof GOJO_TECHNIQUES !== 'undefined') {
    GOJO_TECHNIQUES.forEach(t => { if (!TECHNIQUES.find(x => x.id === t.id)) TECHNIQUES.push(t); });
    ['infinity','reversal_red','lapse_blue','hollow_purple','domain_infinite_void'].forEach(id => grantTechnique(id));
  }
  renderHeritage();
  toast(`Clan set to ${clan.name}!`, 'success');
}
function adminSetWeapon() {
  const id = document.getElementById('admin-weapon')?.value;
  if (!id || typeof WEAPONS === 'undefined') return;
  const w = WEAPONS.find(x => x.id === id);
  if (!w) return;
  if (!G.player.heritage) G.player.heritage = {};
  G.player.heritage.weapon = id;
  if (w.bonus?.atk) G.player.atk += w.bonus.atk;
  if (w.bonus?.spd) G.player.spd += w.bonus.spd;
  if (w.techs) w.techs.forEach(t => grantTechnique(t));
  renderHeritage();
  toast(`Weapon set to ${w.name}!`, 'success');
}
function adminSetStyle() {
  const id = document.getElementById('admin-style')?.value;
  if (!id || typeof FIGHTING_STYLES === 'undefined') return;
  const s = FIGHTING_STYLES.find(x => x.id === id);
  if (!s) return;
  if (!G.player.heritage) G.player.heritage = {};
  G.player.heritage.style = id;
  if (s.bonus?.atk) G.player.atk += s.bonus.atk;
  if (s.bonus?.def) G.player.def += s.bonus.def;
  if (s.bonus?.spd) G.player.spd += s.bonus.spd;
  if (s.techs) s.techs.forEach(t => grantTechnique(t));
  renderHeritage();
  toast(`Style set to ${s.name}!`, 'success');
}
function adminGrantTech() {
  const id = document.getElementById('admin-tech-select')?.value;
  if (id) { grantTechnique(id); toast(`Granted: ${id}`, 'success'); }
}
function adminGrantSukuna() {
  ['vessel_switch','dismantle','cleave','fuga','domain_expansion'].forEach(id => grantTechnique(id));
  renderInventory();
  toast('🩸 Sukuna techniques granted!', 'success');
}
function adminGrantGojo() {
  if (typeof GOJO_TECHNIQUES !== 'undefined') {
    GOJO_TECHNIQUES.forEach(t => { if (!TECHNIQUES.find(x => x.id === t.id)) TECHNIQUES.push(t); });
  }
  ['infinity','reversal_red','lapse_blue','hollow_purple','domain_infinite_void'].forEach(id => grantTechnique(id));
  renderInventory();
  toast('🔵 Gojo techniques granted!', 'success');
}
function adminClearTechs() {
  G.player.techniques = [];
  G.player.equipped = [null,null,null,null];
  renderInventory();
  toast('All techniques cleared!', 'warn');
}
function adminGrantFinger() {
  grantTechnique('vessel_switch');
  toast('🩸 Sukuna\'s Finger found!', 'rare');
}
