// ===== SETTINGS =====

const SETTINGS_DEFAULTS = {
  musicVolume: 0.5,
  sfxVolume: 0.7,
  showFloatingText: true,
  reducedAnimations: false,
};

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
  // Reduced animations
  document.body.classList.toggle('reduced-animations', !!s.reducedAnimations);
}

function hardResetGame() {
  try {
    localStorage.removeItem('ascendant_save');
    localStorage.removeItem('ascendant_settings');
  } catch(e) {}
  // Reset in-memory state before reload to prevent any race conditions
  location.reload();
}

function renderSettings() {
  const container = document.getElementById('settings-container');
  if (!container) return;
  const s = getSettings();

  container.innerHTML = `
    <div class="settings-layout">

      <div class="settings-section">
        <div class="settings-section-header">🔊 Audio</div>
        <div class="setting-row">
          <label class="setting-label">🎵 Music</label>
          <div class="setting-control">
            <input type="range" min="0" max="1" step="0.05" value="${s.musicVolume}"
              oninput="updateSetting('musicVolume', parseFloat(this.value)); document.getElementById('music-vol-val').textContent = Math.round(this.value*100)+'%'"
              class="setting-slider">
            <span class="setting-val" id="music-vol-val">${Math.round(s.musicVolume*100)}%</span>
          </div>
        </div>
        <div class="setting-row">
          <label class="setting-label">🔔 SFX</label>
          <div class="setting-control">
            <input type="range" min="0" max="1" step="0.05" value="${s.sfxVolume}"
              oninput="updateSetting('sfxVolume', parseFloat(this.value)); document.getElementById('sfx-vol-val').textContent = Math.round(this.value*100)+'%'"
              class="setting-slider">
            <span class="setting-val" id="sfx-vol-val">${Math.round(s.sfxVolume*100)}%</span>
          </div>
        </div>
        <div class="setting-btn-row">
          <button class="btn-small" onclick="playSound('buttonpress',1.0)">▶ Test SFX</button>
          <button class="btn-small" onclick="updateSetting('musicVolume',0.5);updateSetting('sfxVolume',0.7);renderSettings()">↺ Reset</button>
          <button class="btn-small" onclick="updateSetting('musicVolume',0);updateSetting('sfxVolume',0);renderSettings()">🔇 Mute All</button>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-header">🎮 Gameplay</div>
        <div class="setting-row">
          <label class="setting-label">✨ Floating Text</label>
          <label class="toggle-switch">
            <input type="checkbox" ${s.showFloatingText ? 'checked' : ''}
              onchange="updateSetting('showFloatingText', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-row">
          <label class="setting-label">⚡ Reduced Animations</label>
          <label class="toggle-switch">
            <input type="checkbox" ${s.reducedAnimations ? 'checked' : ''}
              onchange="updateSetting('reducedAnimations', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="settings-section">
        <div class="settings-section-header">📊 Game Info</div>
        <div class="settings-info-grid">
          <div class="settings-info-item"><span class="settings-info-label">Level</span><span class="settings-info-val">${G.player.level}</span></div>
          <div class="settings-info-item"><span class="settings-info-label">Rebirth</span><span class="settings-info-val">${G.player.rebirthCount}</span></div>
          <div class="settings-info-item"><span class="settings-info-label">Gold</span><span class="settings-info-val">${Math.floor(G.player.gold).toLocaleString()}</span></div>
          <div class="settings-info-item"><span class="settings-info-label">Techniques</span><span class="settings-info-val">${G.player.techniques.length}</span></div>
          <div class="settings-info-item"><span class="settings-info-label">Bosses Cleared</span><span class="settings-info-val">${G.player.defeatedBosses.length}</span></div>
          <div class="settings-info-item"><span class="settings-info-label">Chapters Done</span><span class="settings-info-val">${G.player.completedChapters.length}</span></div>
        </div>
      </div>

      <div class="settings-section settings-danger-zone">
        <div class="settings-section-header">⚠️ Danger Zone</div>
        <p class="tab-desc" style="margin-bottom:12px">Permanently deletes all progress. Cannot be undone.</p>
        <button class="btn-danger" onclick="confirmReset()">🗑️ Reset All Data</button>
      </div>

      <div class="settings-section">
        <div class="settings-section-header">📜 Privacy Policy</div>
        <div class="privacy-box">
          <p><strong>Ascendant — Privacy Policy</strong></p>
          <p>This game runs entirely in your browser. No data is collected, transmitted, or stored on any server.</p>
          <p>All game progress is saved locally in your browser's <code>localStorage</code>. Clearing your browser data will erase your save.</p>
          <p>No cookies, no tracking, no analytics, no third-party services.</p>
          <p style="color:var(--dim);font-size:11px;margin-top:8px">Last updated: 2025</p>
        </div>
      </div>

    </div>`;
}

function confirmReset() {
  const modal = document.getElementById('reset-modal');
  if (modal) modal.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved settings immediately on load
  applySettings(getSettings());

  document.getElementById('confirm-reset-btn')?.addEventListener('click', () => {
    hardResetGame();
  });
  document.getElementById('cancel-reset-btn')?.addEventListener('click', () => {
    document.getElementById('reset-modal')?.classList.add('hidden');
  });
});
