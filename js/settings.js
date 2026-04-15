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
        <h3>🔊 Audio</h3>
        <p class="tab-desc">Music and sound effects will be added in a future update.</p>
        <div class="setting-row">
          <label>🎵 Music Volume</label>
          <input type="range" min="0" max="1" step="0.05" value="${s.musicVolume}"
            oninput="updateSetting('musicVolume', parseFloat(this.value)); document.getElementById('music-vol-val').textContent = Math.round(this.value*100)+'%'"
            class="setting-slider">
          <span id="music-vol-val">${Math.round(s.musicVolume*100)}%</span>
        </div>
        <div class="setting-row">
          <label>🔔 SFX Volume</label>
          <input type="range" min="0" max="1" step="0.05" value="${s.sfxVolume}"
            oninput="updateSetting('sfxVolume', parseFloat(this.value)); document.getElementById('sfx-vol-val').textContent = Math.round(this.value*100)+'%'"
            class="setting-slider">
          <span id="sfx-vol-val">${Math.round(s.sfxVolume*100)}%</span>
        </div>
      </div>

      <div class="settings-section">
        <h3>🎮 Gameplay</h3>
        <div class="setting-row">
          <label>✨ Floating Text</label>
          <label class="toggle-switch">
            <input type="checkbox" ${s.showFloatingText ? 'checked' : ''}
              onchange="updateSetting('showFloatingText', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-row">
          <label>⚡ Reduced Animations</label>
          <label class="toggle-switch">
            <input type="checkbox" ${s.reducedAnimations ? 'checked' : ''}
              onchange="updateSetting('reducedAnimations', this.checked)">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div class="settings-section">
        <h3>⚠️ Data</h3>
        <p class="tab-desc">This will permanently delete all your progress. There is no undo.</p>
        <button class="btn-danger" onclick="confirmReset()">🗑️ Reset All Data</button>
      </div>

      <div class="settings-section">
        <h3>📜 Privacy Policy</h3>
        <div class="privacy-box">
          <p><strong>Ascendant — Privacy Policy</strong></p>
          <p>This game runs entirely in your browser. No data is collected, transmitted, or stored on any server.</p>
          <p>All game progress is saved locally in your browser's <code>localStorage</code>. Clearing your browser data will erase your save.</p>
          <p>No cookies, no tracking, no analytics, no third-party services.</p>
          <p>This game does not collect any personally identifiable information.</p>
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
