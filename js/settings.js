const SETTINGS_DEFAULTS = {
  musicVolume: 0.15,
  sfxVolume: 1.0,
  showFloatingText: true,
  reducedAnimations: false,
  staminaCancelOnEmpty: true,
  compactNumbers: false,
  showDamageNumbers: true,
  autoSaveInterval: 30,
  showFPS: false,
  toastDuration: 2500,
};

(function injectSettingsCSS() {
  if (document.getElementById('settings-rework-css')) return;
  const s = document.createElement('style');
  s.id = 'settings-rework-css';
  s.textContent = `
.settings-layout{display:grid;grid-template-columns:1fr 1fr;gap:16px;max-width:820px;margin:0 auto}
@media(max-width:700px){.settings-layout{grid-template-columns:1fr}}
.settings-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;transition:border-color .2s}
.settings-card:hover{border-color:rgba(255,255,255,0.12)}
.settings-card-header{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--dim);margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06)}
.settings-row{display:flex;align-items:center;justify-content:space-between;padding:8px 0}
.settings-row+.settings-row{border-top:1px solid rgba(255,255,255,0.04)}
.settings-label{font-size:13px;font-weight:600;color:var(--text);flex:1;margin-right:12px}
.settings-label small{display:block;font-size:11px;font-weight:400;color:var(--dim);margin-top:2px}
.settings-slider-wrap{display:flex;align-items:center;gap:10px;min-width:180px}
.settings-slider-wrap input[type=range]{flex:1;-webkit-appearance:none;appearance:none;height:6px;border-radius:3px;background:rgba(255,255,255,0.1);outline:none;cursor:pointer}
.settings-slider-wrap input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:var(--accent);border:2px solid rgba(0,0,0,0.3);cursor:pointer;transition:transform .15s}
.settings-slider-wrap input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.2)}
.settings-slider-wrap input[type=range]::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--accent);border:2px solid rgba(0,0,0,0.3);cursor:pointer}
.settings-val{font-size:12px;font-weight:700;color:var(--accent);min-width:36px;text-align:right}
.settings-toggle{position:relative;width:40px;height:22px;flex-shrink:0}
.settings-toggle input{opacity:0;width:0;height:0}
.settings-toggle-track{position:absolute;inset:0;background:rgba(255,255,255,0.1);border-radius:11px;cursor:pointer;transition:background .25s}
.settings-toggle-track::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .25s,background .25s}
.settings-toggle input:checked+.settings-toggle-track{background:var(--accent)}
.settings-toggle input:checked+.settings-toggle-track::after{transform:translateX(18px);background:#fff}
.settings-audio-btns{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.settings-audio-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;font-size:11px;font-weight:600;border:1px solid rgba(255,255,255,0.1);border-radius:6px;background:rgba(255,255,255,0.04);color:var(--text);cursor:pointer;transition:background .15s,border-color .15s}
.settings-audio-btn:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.18)}
.settings-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.settings-info-cell{display:flex;justify-content:space-between;padding:6px 8px;background:rgba(255,255,255,0.03);border-radius:6px;font-size:12px}
.settings-info-cell span:first-child{color:var(--dim)}
.settings-info-cell span:last-child{font-weight:700;color:var(--text)}
.settings-danger-zone{border-color:rgba(255,60,60,0.2)!important}
.settings-danger-zone .settings-card-header{color:#ff6b6b;border-bottom-color:rgba(255,60,60,0.15)}
.settings-danger-btns{display:flex;gap:8px;flex-wrap:wrap}
.settings-danger-btn{padding:8px 16px;font-size:12px;font-weight:700;border:1px solid rgba(255,60,60,0.3);border-radius:8px;background:rgba(255,60,60,0.08);color:#ff6b6b;cursor:pointer;transition:background .15s}
.settings-danger-btn:hover{background:rgba(255,60,60,0.18)}
.settings-danger-btn.primary{background:rgba(255,60,60,0.2);border-color:rgba(255,60,60,0.5)}
.settings-privacy-box{font-size:11px;line-height:1.6;color:var(--dim);padding:10px;background:rgba(255,255,255,0.02);border-radius:8px}
.settings-privacy-box strong{color:var(--text)}
.settings-privacy-box code{background:rgba(255,255,255,0.06);padding:1px 4px;border-radius:3px;font-size:10px}
.btn-flash{animation:btnFlash .4s}
@keyframes btnFlash{0%,100%{filter:brightness(1)}50%{filter:brightness(1.6)}}
`;
  document.head.appendChild(s);
})();

function getSettings() {
  try {
    const raw = localStorage.getItem('ascendant_settings');
    return raw ? { ...SETTINGS_DEFAULTS, ...JSON.parse(raw) } : { ...SETTINGS_DEFAULTS };
  } catch { return { ...SETTINGS_DEFAULTS }; }
}

function saveSettings(settings) {
  try { localStorage.setItem('ascendant_settings', JSON.stringify(settings)); } catch {}
}

function updateSetting(key, value) {
  const s = getSettings();
  s[key] = value;
  saveSettings(s);
  applySettings(s);
  if (key === 'musicVolume') updateMusicVolume();
}

function applySettings(s) {
  if (!s) s = getSettings();
  document.body.classList.toggle('reduced-animations', !!s.reducedAnimations);
}

function hardResetGame() {
  try {
    localStorage.removeItem('ascendant_save_v2');
    localStorage.removeItem('ascendant_settings');
  } catch(e) {}
  location.reload();
}

function renderSettings() {
  const container = document.getElementById('settings-container');
  if (!container) return;
  const s = getSettings();
  const isMuted = s.musicVolume === 0 && s.sfxVolume === 0;

  container.innerHTML = `
    <div class="settings-layout">
      <div class="settings-card">
        <div class="settings-card-header">Audio</div>
        <div class="settings-row">
          <label class="settings-label">Music Volume</label>
          <div class="settings-slider-wrap">
            <input type="range" min="0" max="1" step="0.05" value="${s.musicVolume}"
              oninput="updateSetting('musicVolume', parseFloat(this.value)); document.getElementById('s-mv').textContent = Math.round(this.value*100)+'%'; this.style.setProperty('--val', this.value)"
              style="--val:${s.musicVolume}">
            <span class="settings-val" id="s-mv">${Math.round(s.musicVolume*100)}%</span>
          </div>
        </div>
        <div class="settings-row">
          <label class="settings-label">SFX Volume</label>
          <div class="settings-slider-wrap">
            <input type="range" min="0" max="1" step="0.05" value="${s.sfxVolume}"
              oninput="updateSetting('sfxVolume', parseFloat(this.value)); document.getElementById('s-sv').textContent = Math.round(this.value*100)+'%'; this.style.setProperty('--val', this.value)"
              style="--val:${s.sfxVolume}">
            <span class="settings-val" id="s-sv">${Math.round(s.sfxVolume*100)}%</span>
          </div>
        </div>
        <div class="settings-audio-btns">
          <button class="settings-audio-btn" onclick="settingsTestSFX(this)" title="Play a test sound">
            <span>▶</span><span>Test SFX</span>
          </button>
          <button class="settings-audio-btn" onclick="settingsTestVFX(this)" title="Play a test VFX burst">
            <span>✨</span><span>Test VFX</span>
          </button>
          <button class="settings-audio-btn" onclick="settingsResetAudio()" title="Reset to defaults">
            <span>↺</span><span>Reset</span>
          </button>
          <button class="settings-audio-btn" id="settings-mute-btn" onclick="settingsToggleMute()" title="Mute / Unmute all audio">
            <span>${isMuted ? '🔇' : '🔊'}</span>
            <span>${isMuted ? 'Unmute' : 'Mute All'}</span>
          </button>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-card-header">Display</div>
        <div class="settings-row">
          <label class="settings-label">FPS Counter</label>
          <label class="settings-toggle">
            <input type="checkbox" ${s.showFPS ? 'checked' : ''} onchange="updateSetting('showFPS', this.checked)">
            <span class="settings-toggle-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <label class="settings-label">Toast Duration</label>
          <div class="settings-slider-wrap">
            <input type="range" min="1000" max="5000" step="500" value="${s.toastDuration || 2500}"
              oninput="updateSetting('toastDuration', parseInt(this.value)); document.getElementById('s-td').textContent = (this.value/1000).toFixed(1)+'s'">
            <span class="settings-val" id="s-td">${((s.toastDuration || 2500)/1000).toFixed(1)}s</span>
          </div>
        </div>
        <div class="settings-row">
          <label class="settings-label">Auto-Save Interval</label>
          <div class="settings-slider-wrap">
            <input type="range" min="10" max="120" step="10" value="${s.autoSaveInterval || 30}"
              oninput="updateSetting('autoSaveInterval', parseInt(this.value)); document.getElementById('s-as').textContent = this.value+'s'">
            <span class="settings-val" id="s-as">${s.autoSaveInterval || 30}s</span>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-card-header">Gameplay</div>
        <div class="settings-row">
          <label class="settings-label">Floating Text</label>
          <label class="settings-toggle">
            <input type="checkbox" ${s.showFloatingText ? 'checked' : ''} onchange="updateSetting('showFloatingText', this.checked)">
            <span class="settings-toggle-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <label class="settings-label">Damage Numbers</label>
          <label class="settings-toggle">
            <input type="checkbox" ${s.showDamageNumbers !== false ? 'checked' : ''} onchange="updateSetting('showDamageNumbers', this.checked)">
            <span class="settings-toggle-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <label class="settings-label">Reduced Animations</label>
          <label class="settings-toggle">
            <input type="checkbox" ${s.reducedAnimations ? 'checked' : ''} onchange="updateSetting('reducedAnimations', this.checked)">
            <span class="settings-toggle-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <label class="settings-label">Compact Numbers</label>
          <label class="settings-toggle">
            <input type="checkbox" ${s.compactNumbers ? 'checked' : ''} onchange="updateSetting('compactNumbers', this.checked)">
            <span class="settings-toggle-track"></span>
          </label>
        </div>
        <div class="settings-row">
          <label class="settings-label">Cancel Job/Train on Empty Stamina<small>When off, pauses and waits for stamina regen.</small></label>
          <label class="settings-toggle">
            <input type="checkbox" ${s.staminaCancelOnEmpty !== false ? 'checked' : ''} onchange="updateSetting('staminaCancelOnEmpty', this.checked)">
            <span class="settings-toggle-track"></span>
          </label>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-card-header">Advanced</div>
        <div class="settings-info-grid">
          <div class="settings-info-cell"><span>Level</span><span>${G.player.level}</span></div>
          <div class="settings-info-cell"><span>Rebirth</span><span>${G.player.rebirthCount}</span></div>
          <div class="settings-info-cell"><span>Gold</span><span>${Math.floor(G.player.gold).toLocaleString()}</span></div>
          <div class="settings-info-cell"><span>Techniques</span><span>${G.player.techniques.length}</span></div>
          <div class="settings-info-cell"><span>Bosses</span><span>${G.player.defeatedBosses.length}</span></div>
          <div class="settings-info-cell"><span>Chapters</span><span>${G.player.completedChapters.length}</span></div>
        </div>
      </div>

      <div class="settings-card settings-danger-zone">
        <div class="settings-card-header">Danger Zone</div>
        <p style="font-size:12px;color:var(--dim);margin:0 0 12px">Permanently deletes all progress. Cannot be undone.</p>
        <div class="settings-danger-btns">
          <button class="settings-audio-btn" onclick="resetTutorial()">🔄 Replay Tutorial</button>
          <button class="settings-danger-btn primary" onclick="confirmReset()">🗑️ Reset All Data</button>
        </div>
      </div>

      <div class="settings-card">
        <div class="settings-card-header">Privacy Policy</div>
        <div class="settings-privacy-box">
          <strong>Ascendant — Privacy Policy</strong><br>
          This game runs entirely in your browser. No data is collected, transmitted, or stored on any server.
          All game progress is saved locally in your browser's <code>localStorage</code>. Clearing your browser data will erase your save.
          Achievement data and game progress are preserved across browser sessions via <code>localStorage</code>.
          No cookies, no tracking, no analytics, no third-party services.
          <div style="margin-top:6px;opacity:0.5">Last updated: 2026</div>
        </div>
      </div>
    </div>`;
}

function confirmReset() {
  const modal = document.getElementById('reset-modal');
  if (modal) modal.classList.remove('hidden');
}

let _prevVolumes = null;

function settingsTestSFX(btn) {
  playSound('buttonpress', 1.0);
  btn.classList.add('btn-flash');
  setTimeout(() => btn.classList.remove('btn-flash'), 400);
}

function settingsTestVFX(btn) {
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#f5c542','#ff9900','#b388ff','#42a5f5','#66bb6a','#ff5252','#fff'];
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    const angle = (Math.PI * 2 * i / 20) + Math.random() * 0.5;
    const dist = 40 + Math.random() * 40;
    const size = 4 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `position:fixed;z-index:9999;pointer-events:none;border-radius:50%;
      width:${size}px;height:${size}px;background:${color};
      left:${cx}px;top:${cy}px;
      --dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;
      animation:digBurst 0.6s ease-out forwards;`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
  btn.classList.add('btn-flash');
  setTimeout(() => btn.classList.remove('btn-flash'), 400);
}

function settingsResetAudio() {
  updateSetting('musicVolume', 0.15);
  updateSetting('sfxVolume', 1.0);
  renderSettings();
  playSound('buttonpress', 1.0);
}

function settingsToggleMute() {
  const s = getSettings();
  const isMuted = s.musicVolume === 0 && s.sfxVolume === 0;
  if (isMuted) {
    const prev = _prevVolumes || { musicVolume: 0.15, sfxVolume: 1.0 };
    updateSetting('musicVolume', prev.musicVolume);
    updateSetting('sfxVolume', prev.sfxVolume);
    _prevVolumes = null;
  } else {
    _prevVolumes = { musicVolume: s.musicVolume, sfxVolume: s.sfxVolume };
    updateSetting('musicVolume', 0);
    updateSetting('sfxVolume', 0);
  }
  renderSettings();
}

document.addEventListener('DOMContentLoaded', () => {
  applySettings(getSettings());
  document.getElementById('confirm-reset-btn')?.addEventListener('click', () => {
    hardResetGame();
  });
  document.getElementById('cancel-reset-btn')?.addEventListener('click', () => {
    document.getElementById('reset-modal')?.classList.add('hidden');
  });
});
