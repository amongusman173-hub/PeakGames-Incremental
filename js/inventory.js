const TECHNIQUES = [
  { id: 'slash', name: 'Slash', icon: '⚔️', rarity: 'common', desc: 'A quick sword slash.', effect: 'damage', multiplier: 1.3, bonus: { atk: 2 } },
  { id: 'block', name: 'Iron Block', icon: '🛡️', rarity: 'common', desc: 'Defensive stance. +DEF bonus.', effect: 'heal', healPct: 0.1, bonus: { def: 3 } },
  { id: 'quick_step', name: 'Quick Step', icon: '💨', rarity: 'common', desc: 'Dodge and counter. +SPD bonus.', effect: 'damage', multiplier: 1.1, bonus: { spd: 2, critChance: 0.05 } },
  { id: 'earth_crush', name: 'Earth Crush', icon: '🪨', rarity: 'uncommon', desc: 'Slam the ground for massive damage.', effect: 'damage', multiplier: 1.8, bonus: { atk: 5 } },
  { id: 'fang_strike', name: 'Fang Strike', icon: '🐺', rarity: 'uncommon', desc: 'Multi-hit feral attack.', effect: 'multi', hits: 3, multiplier: 0.6, bonus: { atk: 4, spd: 3 } },
  { id: 'war_cry', name: 'War Cry', icon: '📣', rarity: 'uncommon', desc: 'Boost morale. Heals and buffs.', effect: 'heal', healPct: 0.2, bonus: { atk: 6 } },
  { id: 'holy_slash', name: 'Holy Slash', icon: '✨', rarity: 'rare', desc: 'Blessed blade cuts through defenses.', effect: 'damage', multiplier: 2.2, bonus: { atk: 10, critChance: 0.1 } },
  { id: 'tidal_wave', name: 'Tidal Wave', icon: '🌊', rarity: 'rare', desc: 'Summon a crushing wave.', effect: 'stun', multiplier: 1.9, bonus: { atk: 8, def: 5 } },
  { id: 'shadow_clone', name: 'Shadow Clone', icon: '👤', rarity: 'rare', desc: 'Create clones for multi-hit.', effect: 'multi', hits: 5, multiplier: 0.7, bonus: { spd: 10, critChance: 0.08 } },
  { id: 'hellfire', name: 'Hellfire', icon: '🔥', rarity: 'legendary', desc: 'Unleash demonic flames.', effect: 'damage', multiplier: 3.5, bonus: { atk: 20, critChance: 0.15 } },
  { id: 'void_rend', name: 'Void Rend', icon: '🌀', rarity: 'legendary', desc: 'Tear through reality itself.', effect: 'multi', hits: 7, multiplier: 0.9, bonus: { atk: 15, spd: 10, critChance: 0.2 } },
  { id: 'divine_heal', name: 'Divine Restoration', icon: '💫', rarity: 'legendary', desc: 'Restore a massive amount of HP.', effect: 'heal', healPct: 0.5, bonus: { def: 15, atk: 10 } },
  { id: 'ancient_strike', name: 'Ancient Strike', icon: '🏺', rarity: 'rare', desc: 'A technique from a lost civilization.', effect: 'damage', multiplier: 2.5, bonus: { atk: 12 } },
  { id: 'crystal_shard', name: 'Crystal Shard', icon: '💎', rarity: 'rare', desc: 'Launch razor-sharp crystals.', effect: 'multi', hits: 4, multiplier: 0.8, bonus: { atk: 8, critChance: 0.12 } },
  { id: 'astral_slash',      name: 'Astral Slash',      icon: '✨', rarity: 'legendary', desc: 'Rend spacetime itself.', effect: 'shield', shieldTurns: 2, bonus: { def: 50 } },
  { id: 'chrono_strike',     name: 'Chrono Strike',     icon: '⏳', rarity: 'legendary', desc: 'Slow enemy time for massive damage.', effect: 'damage', multiplier: 3.5, bonus: { atk: 40 } },
  { id: 'chrono_strike_max', name: 'Chrono Strike MAX', icon: '⏳', rarity: 'legendary', desc: 'Time dilation amplified.', effect: 'damage', multiplier: 6.0, bonus: { atk: 60 } },
  { id: 'void_nova',         name: 'Void Nova',         icon: '🌑', rarity: 'legendary', desc: 'Collapse matter into a singularity.', effect: 'stun', multiplier: 3.0, bonus: { atk: 35, spd: 20 } },
  { id: 'void_nova_max',     name: 'Void Nova MAX',     icon: '🌑', rarity: 'legendary', desc: 'Singularity collapses inward.', effect: 'multi', hits: 4, multiplier: 2.0, bonus: { atk: 50, spd: 30 } },
  { id: 'celestial_wrath',   name: 'Celestial Wrath',   icon: '⚡', rarity: 'legendary', desc: 'Channel the fury of dying stars.', effect: 'damage', multiplier: 8.0, bonus: { atk: 80, critChance: 0.5 } },
  { id: 'nexus_storm',       name: 'Nexus Storm',       icon: '🌀', rarity: 'legendary', desc: 'Unleash a cosmic tempest.', effect: 'stun', multiplier: 5.0, bonus: { atk: 100, def: 50, spd: 50, critChance: 0.5 } },
];

function getTechniqueName(id) {
  const t = TECHNIQUES.find(t => t.id === id);
  return t ? `${t.icon} ${t.name}` : id;
}

function grantTechnique(techId) {
  const p = G.player;
  if (!p.techniques.includes(techId)) {
    p.techniques.push(techId);
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (tech) toast(`New technique: ${tech.icon} ${tech.name}!`, 'rare');
    renderInventory();
  }
}

function equipTechnique(techId, slot) {
  const p = G.player;
  const maxSlots = typeof getMaxEquipSlots === 'function' ? getMaxEquipSlots() : 4;
  while (p.equipped.length < maxSlots) p.equipped.push(null);
  p.equipped = p.equipped.map(e => e === techId ? null : e);
  p.equipped[slot] = techId;
  renderInventory();
}

function unequipSlot(slot) {
  G.player.equipped[slot] = null;
  renderInventory();
}

function destroyTechnique(techId) {
  const p = G.player;
  if (p.equipped.includes(techId)) return;
  const tech = TECHNIQUES.find(t => t.id === techId);
  if (!confirm(`Forget ${tech ? tech.icon + ' ' + tech.name : techId}? This cannot be undone.`)) return;
  p.techniques = p.techniques.filter(id => id !== techId);
  if (tech) toast(`Forgotten: ${tech.icon} ${tech.name}`, 'info');
  renderInventory();
}

function forgetAllCommon() {
  const p = G.player;
  const commonIds = TECHNIQUES.filter(t => t.rarity === 'common').map(t => t.id);
  const count = p.techniques.filter(id => commonIds.includes(id)).length;
  if (count === 0) { toast('No common techniques to forget.', 'info'); return; }
  if (!confirm(`Forget all ${count} common technique${count > 1 ? 's' : ''}? This cannot be undone.`)) return;
  p.techniques = p.techniques.filter(id => !commonIds.includes(id));
  p.equipped = p.equipped.map(e => commonIds.includes(e) ? null : e);
  toast(`Forgotten ${count} common technique${count > 1 ? 's' : ''}`, 'info');
  renderInventory();
}

function getEquippedTechBonus() {
  const p = G.player;
  const bonus = { atk: 0, def: 0, spd: 0, critChance: 0 };
  p.equipped.forEach(id => {
    if (!id) return;
    const tech = TECHNIQUES.find(t => t.id === id);
    if (!tech || !tech.bonus) return;
    for (const [k, v] of Object.entries(tech.bonus)) {
      if (bonus[k] !== undefined) bonus[k] += v;
    }
  });
  return bonus;
}

let techniqueFilter = 'all';
let techniqueSort = 'rarity';
const TECH_RARITY_ORDER = { legendary: 0, rare: 1, uncommon: 2, common: 3 };

function setTechniqueFilter(f) {
  techniqueFilter = f;
  renderInventory();
}

function setTechniqueSort(s) {
  techniqueSort = s;
  renderInventory();
}

function renderEquipSlots() {}
function renderTechniqueList() {}

let _invCssInjected = false;

function injectInventoryStyles() {
  if (_invCssInjected) return;
  _invCssInjected = true;
  const s = document.createElement('style');
  s.textContent = `
.inv-wrap{display:flex;flex-direction:column;gap:16px;padding-bottom:40px}
.inv-panel{background:var(--card);border:1px solid var(--border);border-radius:var(--r);padding:16px}
.inv-panel-hdr{display:flex;align-items:center;gap:8px;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border)}
.inv-panel-icon{font-size:16px}
.inv-panel-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--accent)}
.inv-slot-count{margin-left:auto;font-size:11px;color:var(--dim);background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:10px;font-weight:600}
.inv-doll{display:grid;grid-template-columns:1fr 1.2fr 1fr;grid-template-rows:auto auto;gap:8px;max-width:460px;margin:0 auto}
.inv-doll-hero{grid-column:2;grid-row:1/3;display:flex;align-items:center;justify-content:center}
.inv-doll-hero-icon{font-size:52px;opacity:0.15;filter:drop-shadow(0 0 24px rgba(108,159,255,0.25));animation:dollPulse 4s ease-in-out infinite alternate}
@keyframes dollPulse{0%{opacity:0.12;transform:scale(1)}100%{opacity:0.2;transform:scale(1.05)}}
.inv-doll-slot{background:rgba(255,255,255,0.025);border:2px dashed var(--border);border-radius:var(--r-sm);padding:10px 6px;display:flex;flex-direction:column;align-items:center;gap:3px;text-align:center;transition:all 0.2s ease;min-height:76px;justify-content:center;position:relative}
.inv-doll-filled{border-style:solid;cursor:pointer}
.inv-doll-filled:hover{transform:translateY(-2px);box-shadow:0 4px 14px rgba(0,0,0,0.35);filter:brightness(1.15)}
.inv-doll-slot.inv-rarity-common{border-color:#5a6a8a}
.inv-doll-slot.inv-rarity-uncommon{border-color:#6c9fff;background:rgba(108,159,255,0.04)}
.inv-doll-slot.inv-rarity-rare{border-color:#b06aff;background:rgba(176,106,255,0.04)}
.inv-doll-slot.inv-rarity-legendary{border-color:#f5c542;background:rgba(245,197,66,0.04);box-shadow:0 0 12px rgba(245,197,66,0.12)}
.inv-doll-icon{font-size:22px;line-height:1}
.inv-doll-name{font-size:9px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;line-height:1.2}
.inv-doll-rarity{font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px}
.inv-rarity-text-common{color:#5a6a8a}.inv-rarity-text-uncommon{color:#6c9fff}.inv-rarity-text-rare{color:#b06aff}.inv-rarity-text-legendary{color:#f5c542}
.inv-doll-empty .inv-doll-icon{font-size:14px;color:var(--dim);opacity:0.4}
.inv-doll-empty .inv-doll-name{font-size:9px;color:var(--dim);opacity:0.5}
.inv-extra-slots{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;justify-content:center}
.inv-extra-slots .inv-doll-slot{flex:0 0 calc(20% - 7px);min-width:72px}
.inv-lock-hint{text-align:center;font-size:11px;color:var(--dim);margin-top:12px;opacity:0.5}
.inv-stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.inv-stat{display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,0.025);border:1px solid var(--border);border-radius:var(--r-sm);transition:border-color 0.2s}
.inv-stat:hover{border-color:var(--border-h)}
.inv-stat-icon{font-size:18px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.04);border-radius:8px;flex-shrink:0}
.inv-stat-info{display:flex;flex-direction:column;min-width:0}
.inv-stat-label{font-size:9px;font-weight:700;color:var(--dim);text-transform:uppercase;letter-spacing:0.6px;line-height:1.2}
.inv-stat-value{font-size:16px;font-weight:800;color:var(--text);line-height:1.3;white-space:nowrap}
.inv-stat-bonus{font-size:11px;font-weight:600;color:var(--ok);margin-left:3px}
.inv-toolbar{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px}
.inv-pills{display:flex;flex-wrap:wrap;gap:4px}
.inv-pill{background:rgba(255,255,255,0.035);border:1px solid var(--border);color:var(--dim);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.18s;user-select:none;line-height:1.4}
.inv-pill:hover{color:var(--text);border-color:var(--border-h);background:rgba(255,255,255,0.07)}
.inv-pill.active{color:#fff;background:var(--accent);border-color:var(--accent);box-shadow:0 0 8px rgba(108,159,255,0.25)}
.inv-toolbar-right{display:flex;align-items:center;gap:8px}
.inv-sort-sel{background:rgba(255,255,255,0.05);border:1px solid var(--border);color:var(--text);border-radius:var(--r-sm);padding:4px 8px;font-size:11px;cursor:pointer;outline:none;font-family:inherit}
.inv-sort-sel option{background:var(--bg2);color:var(--text)}
.inv-btn-forget{background:rgba(231,76,60,0.08);border:1px solid rgba(231,76,60,0.25);color:var(--danger);border-radius:var(--r-sm);padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:inherit}
.inv-btn-forget:hover{background:rgba(231,76,60,0.18);border-color:var(--danger)}
.inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px}
.inv-card{background:rgba(255,255,255,0.025);border-top:1px solid var(--border);border-right:1px solid var(--border);border-bottom:1px solid var(--border);border-left:4px solid var(--border);border-radius:var(--r-sm);padding:12px;transition:all 0.2s;display:flex;flex-direction:column;gap:6px}
.inv-card:hover{background:var(--card-h);border-top-color:var(--border-h);border-right-color:var(--border-h);border-bottom-color:var(--border-h);transform:translateY(-1px);box-shadow:0 4px 16px rgba(0,0,0,0.3)}
.inv-card.inv-rarity-common{border-left-color:#5a6a8a}
.inv-card.inv-rarity-uncommon{border-left-color:#6c9fff}
.inv-card.inv-rarity-rare{border-left-color:#b06aff}
.inv-card.inv-rarity-legendary{border-left-color:#f5c542}
.inv-card-hdr{display:flex;align-items:center;gap:8px}
.inv-card-icon{font-size:18px;line-height:1}
.inv-card-name{font-size:13px;font-weight:700;color:var(--text);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.inv-card-badge{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;padding:2px 6px;border-radius:4px;flex-shrink:0;line-height:1.3}
.inv-badge-common{color:#5a6a8a;background:rgba(90,106,138,0.12)}
.inv-badge-uncommon{color:#6c9fff;background:rgba(108,159,255,0.12)}
.inv-badge-rare{color:#b06aff;background:rgba(176,106,255,0.12)}
.inv-badge-legendary{color:#f5c542;background:rgba(245,197,66,0.12)}
.inv-card-desc{font-size:11px;color:var(--dim);line-height:1.4}
.inv-card-effect{font-size:11px;color:var(--gold);padding:3px 8px;background:rgba(245,197,66,0.06);border:1px solid rgba(245,197,66,0.12);border-radius:4px;display:inline-block;align-self:flex-start;font-weight:600}
.inv-card-bonuses{display:flex;flex-wrap:wrap;gap:4px}
.inv-bonus{font-size:10px;padding:2px 6px;border-radius:4px;font-weight:600;line-height:1.3}
.inv-bonus-pos{color:#27ae60;background:rgba(39,174,96,0.1)}
.inv-card-actions{display:flex;align-items:center;gap:6px;margin-top:2px}
.inv-btn-equip{background:rgba(39,174,96,0.12);border:1px solid rgba(39,174,96,0.3);color:var(--ok);border-radius:4px;padding:3px 10px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.18s;font-family:inherit}
.inv-btn-equip:hover{background:rgba(39,174,96,0.25);border-color:var(--ok)}
.inv-btn-destroy{background:rgba(231,76,60,0.08);border:1px solid rgba(231,76,60,0.2);color:var(--danger);border-radius:4px;padding:3px 7px;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.18s;line-height:1;font-family:inherit}
.inv-btn-destroy:hover{background:rgba(231,76,60,0.22);border-color:var(--danger)}
.inv-equipped-badge{font-size:11px;color:var(--ok);font-weight:600;display:flex;align-items:center;gap:3px}
.inv-slots-full{font-size:11px;color:var(--warn);font-weight:600}
.inv-empty-msg{text-align:center;color:var(--dim);font-size:13px;padding:32px 20px;line-height:1.6}
.inv-empty-msg span{font-size:24px;display:block;margin-bottom:8px}
@media(max-width:768px){.inv-stats-grid{grid-template-columns:repeat(3,1fr)}.inv-extra-slots .inv-doll-slot{flex:0 0 calc(33.33% - 6px)}}
@media(max-width:600px){.inv-doll{grid-template-columns:repeat(2,1fr);grid-template-rows:auto auto}.inv-doll-hero{grid-column:1/-1;grid-row:auto;padding:4px 0}.inv-doll-hero-icon{font-size:36px}.inv-stats-grid{grid-template-columns:repeat(2,1fr)}.inv-grid{grid-template-columns:1fr}.inv-toolbar{flex-direction:column;align-items:stretch}.inv-toolbar-right{justify-content:flex-start}.inv-extra-slots .inv-doll-slot{flex:0 0 calc(50% - 4px)}}
  `;
  document.head.appendChild(s);
}

function getEffectText(tech) {
  if (tech.effect === 'damage') return `⚔️ ${Math.floor((tech.multiplier||1) * 100)}% ATK`;
  if (tech.effect === 'heal')   return `💚 Heal ${Math.floor((tech.healPct||0)*100)}% HP`;
  if (tech.effect === 'stun')   return `⚡ Stun + ${Math.floor((tech.multiplier||1) * 100)}% ATK`;
  if (tech.effect === 'multi')  return `🔁 ${tech.hits||2}x hits`;
  if (tech.effect === 'shield') return `🛡️ Immune ${tech.shieldTurns||2} turns`;
  return `⚔️ ${Math.floor((tech.multiplier||1) * 100)}% ATK`;
}

function getSortedFilteredTechniques() {
  const p = G.player;
  const visible = p.techniques.filter(id => {
    const t = TECHNIQUES.find(t => t.id === id);
    if (!t) return false;
    if (techniqueFilter !== 'all' && t.rarity !== techniqueFilter) return false;
    return true;
  });
  visible.sort((a, b) => {
    const ta = TECHNIQUES.find(t => t.id === a);
    const tb = TECHNIQUES.find(t => t.id === b);
    if (techniqueSort === 'rarity') {
      const ra = TECH_RARITY_ORDER[ta.rarity] ?? 99;
      const rb = TECH_RARITY_ORDER[tb.rarity] ?? 99;
      if (ra !== rb) return ra - rb;
      return ta.name.localeCompare(tb.name);
    }
    if (techniqueSort === 'name') return ta.name.localeCompare(tb.name);
    return 0;
  });
  return visible;
}

function renderInventory() {
  injectInventoryStyles();
  const section = document.getElementById('tab-inventory');
  if (!section) return;
  const p = G.player;
  const maxSlots = typeof getMaxEquipSlots === 'function' ? getMaxEquipSlots() : 4;
  while (p.equipped.length < maxSlots) p.equipped.push(null);
  p.equipped = p.equipped.map(id => {
    if (!id) return null;
    return TECHNIQUES.find(t => t.id === id) ? id : null;
  });
  p.equipped = p.equipped.slice(0, maxSlots);
  while (p.equipped.length < maxSlots) p.equipped.push(null);
  const eq = getEquippedTechBonus();
  const equippedCount = p.equipped.filter(e => e).length;
  const dollHtml = buildDollHtml(maxSlots);
  const extraHtml = buildExtraSlotsHtml(maxSlots);
  const lockedHtml = maxSlots < 10 ? `<div class="inv-lock-hint">🔒 +${10 - maxSlots} more slot${(10 - maxSlots) > 1 ? 's' : ''} — unlock in Skill Tree</div>` : '';
  const cards = getSortedFilteredTechniques();
  const cardsHtml = cards.length > 0 ? cards.map(techId => buildCardHtml(techId)).join('') : `<div class="inv-empty-msg"><span>📭</span>No techniques${techniqueFilter !== 'all' ? ' of this rarity' : ''}.<br>Defeat bosses or dig to find them!</div>`;
  const pillAll = techniqueFilter === 'all' ? ' active' : '';
  const pillCommon = techniqueFilter === 'common' ? ' active' : '';
  const pillUncommon = techniqueFilter === 'uncommon' ? ' active' : '';
  const pillRare = techniqueFilter === 'rare' ? ' active' : '';
  const pillLegendary = techniqueFilter === 'legendary' ? ' active' : '';
  const sortRarity = techniqueSort === 'rarity' ? ' selected' : '';
  const sortName = techniqueSort === 'name' ? ' selected' : '';
  const atkTotal = p.atk + eq.atk;
  const defTotal = p.def + eq.def;
  const spdTotal = p.spd + eq.spd;
  const critPct = Math.floor((eq.critChance || 0) * 100);
  const critBonus = critPct;
  section.innerHTML = `
    <div class="inv-wrap">
      <div class="inv-panel">
        <div class="inv-panel-hdr">
          <span class="inv-panel-icon">⚔️</span>
          <span class="inv-panel-title">Equipped Techniques</span>
          <span class="inv-slot-count">${equippedCount} / ${maxSlots}</span>
        </div>
        ${dollHtml}
        ${extraHtml}
        ${lockedHtml}
      </div>
      <div class="inv-panel">
        <div class="inv-panel-hdr">
          <span class="inv-panel-icon">📊</span>
          <span class="inv-panel-title">Stats</span>
        </div>
        <div class="inv-stats-grid">
          <div class="inv-stat">
            <div class="inv-stat-icon">⚔️</div>
            <div class="inv-stat-info">
              <div class="inv-stat-label">ATK</div>
              <div class="inv-stat-value">${atkTotal}${eq.atk > 0 ? `<span class="inv-stat-bonus">(+${eq.atk})</span>` : ''}</div>
            </div>
          </div>
          <div class="inv-stat">
            <div class="inv-stat-icon">🛡️</div>
            <div class="inv-stat-info">
              <div class="inv-stat-label">DEF</div>
              <div class="inv-stat-value">${defTotal}${eq.def > 0 ? `<span class="inv-stat-bonus">(+${eq.def})</span>` : ''}</div>
            </div>
          </div>
          <div class="inv-stat">
            <div class="inv-stat-icon">💨</div>
            <div class="inv-stat-info">
              <div class="inv-stat-label">SPD</div>
              <div class="inv-stat-value">${spdTotal}${eq.spd > 0 ? `<span class="inv-stat-bonus">(+${eq.spd})</span>` : ''}</div>
            </div>
          </div>
          <div class="inv-stat">
            <div class="inv-stat-icon">❤️</div>
            <div class="inv-stat-info">
              <div class="inv-stat-label">Max HP</div>
              <div class="inv-stat-value">${p.maxHp}</div>
            </div>
          </div>
          <div class="inv-stat">
            <div class="inv-stat-icon">🎯</div>
            <div class="inv-stat-info">
              <div class="inv-stat-label">Crit</div>
              <div class="inv-stat-value">${critPct}%${critBonus > 0 ? `<span class="inv-stat-bonus">(+${critBonus}%)</span>` : ''}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="inv-panel">
        <div class="inv-panel-hdr">
          <span class="inv-panel-icon">📖</span>
          <span class="inv-panel-title">Collection</span>
          <span class="inv-slot-count">${p.techniques.length} owned</span>
        </div>
        <div class="inv-toolbar">
          <div class="inv-pills">
            <button class="inv-pill${pillAll}" onclick="setTechniqueFilter('all')">All</button>
            <button class="inv-pill${pillCommon}" onclick="setTechniqueFilter('common')">Common</button>
            <button class="inv-pill${pillUncommon}" onclick="setTechniqueFilter('uncommon')">Uncommon</button>
            <button class="inv-pill${pillRare}" onclick="setTechniqueFilter('rare')">Rare</button>
            <button class="inv-pill${pillLegendary}" onclick="setTechniqueFilter('legendary')">Legendary</button>
          </div>
          <div class="inv-toolbar-right">
            <select class="inv-sort-sel" onchange="setTechniqueSort(this.value)">
              <option value="rarity"${sortRarity}>Rarity</option>
              <option value="name"${sortName}>Name</option>
            </select>
            <button class="inv-btn-forget" onclick="forgetAllCommon()">Forget All Common</button>
          </div>
        </div>
        <div class="inv-grid">${cardsHtml}</div>
      </div>
    </div>
  `;
}

function buildDollHtml(maxSlots) {
  const p = G.player;
  const positions = [
    { col: '1', row: '1' },
    { col: '3', row: '1' },
    { col: '1', row: '2' },
    { col: '3', row: '2' },
  ];
  let html = '<div class="inv-doll">';
  html += '<div class="inv-doll-hero"><span class="inv-doll-hero-icon">⚔️</span></div>';
  const mainSlots = Math.min(maxSlots, 4);
  for (let i = 0; i < mainSlots; i++) {
    const techId = p.equipped[i];
    const tech = techId ? TECHNIQUES.find(t => t.id === techId) : null;
    const pos = positions[i];
    if (tech) {
      html += `<div class="inv-doll-slot inv-doll-filled inv-rarity-${tech.rarity}" style="grid-column:${pos.col};grid-row:${pos.row}" onclick="unequipSlot(${i})" title="${tech.name} — click to unequip"><div class="inv-doll-icon">${tech.icon}</div><div class="inv-doll-name">${tech.name}</div><div class="inv-doll-rarity inv-rarity-text-${tech.rarity}">${tech.rarity}</div></div>`;
    } else {
      html += `<div class="inv-doll-slot inv-doll-empty" style="grid-column:${pos.col};grid-row:${pos.row}"><div class="inv-doll-icon">+</div><div class="inv-doll-name">Empty</div></div>`;
    }
  }
  html += '</div>';
  return html;
}

function buildExtraSlotsHtml(maxSlots) {
  if (maxSlots <= 4) return '';
  const p = G.player;
  let html = '<div class="inv-extra-slots">';
  for (let i = 4; i < maxSlots; i++) {
    const techId = p.equipped[i];
    const tech = techId ? TECHNIQUES.find(t => t.id === techId) : null;
    if (tech) {
      html += `<div class="inv-doll-slot inv-doll-filled inv-rarity-${tech.rarity}" onclick="unequipSlot(${i})" title="${tech.name} — click to unequip"><div class="inv-doll-icon">${tech.icon}</div><div class="inv-doll-name">${tech.name}</div><div class="inv-doll-rarity inv-rarity-text-${tech.rarity}">${tech.rarity}</div></div>`;
    } else {
      html += `<div class="inv-doll-slot inv-doll-empty"><div class="inv-doll-icon">+</div><div class="inv-doll-name">Empty</div></div>`;
    }
  }
  html += '</div>';
  return html;
}

function buildCardHtml(techId) {
  const p = G.player;
  const tech = TECHNIQUES.find(t => t.id === techId);
  if (!tech) return '';
  const isEquipped = p.equipped.includes(techId);
  const maxSlots = typeof getMaxEquipSlots === 'function' ? getMaxEquipSlots() : 4;
  const emptySlot = p.equipped.slice(0, maxSlots).findIndex(e => e === null);
  const effectText = getEffectText(tech);
  let bonusesHtml = '';
  if (tech.bonus) {
    const parts = Object.entries(tech.bonus).map(([k, v]) => {
      if (k === 'critChance') return `<span class="inv-bonus inv-bonus-pos">+${Math.floor(v * 100)}% Crit</span>`;
      const label = k.toUpperCase();
      return `<span class="inv-bonus inv-bonus-pos">+${v} ${label}</span>`;
    });
    if (parts.length > 0) bonusesHtml = `<div class="inv-card-bonuses">${parts.join('')}</div>`;
  }
  let actionsHtml = '';
  if (isEquipped) {
    actionsHtml = '<span class="inv-equipped-badge">✓ Equipped</span>';
  } else {
    const equipBtn = emptySlot >= 0 ? `<button class="inv-btn-equip" onclick="equipTechnique('${techId}', ${emptySlot})">Equip</button>` : '';
    const slotsFull = emptySlot < 0 ? '<span class="inv-slots-full">Slots full</span>' : '';
    const destroyBtn = `<button class="inv-btn-destroy" onclick="destroyTechnique('${techId}')" title="Forget technique">✕</button>`;
    actionsHtml = `<div class="inv-card-actions">${equipBtn}${slotsFull}${destroyBtn}</div>`;
  }
  return `<div class="inv-card inv-rarity-${tech.rarity}"><div class="inv-card-hdr"><span class="inv-card-icon">${tech.icon}</span><span class="inv-card-name">${tech.name}</span><span class="inv-card-badge inv-badge-${tech.rarity}">${tech.rarity}</span></div><div class="inv-card-desc">${tech.desc}</div><div class="inv-card-effect">${effectText}</div>${bonusesHtml}${actionsHtml}</div>`;
}
