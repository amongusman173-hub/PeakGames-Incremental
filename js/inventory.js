// ===== TECHNIQUE INVENTORY =====

const TECHNIQUES = [
  // Common
  { id: 'slash', name: 'Slash', icon: '⚔️', rarity: 'common', desc: 'A quick sword slash.', effect: 'damage', multiplier: 1.3, bonus: { atk: 2 } },
  { id: 'block', name: 'Iron Block', icon: '🛡️', rarity: 'common', desc: 'Defensive stance. +DEF bonus.', effect: 'heal', healPct: 0.1, bonus: { def: 3 } },
  { id: 'quick_step', name: 'Quick Step', icon: '💨', rarity: 'common', desc: 'Dodge and counter. +SPD bonus.', effect: 'damage', multiplier: 1.1, bonus: { spd: 2, critChance: 0.05 } },

  // Uncommon
  { id: 'earth_crush', name: 'Earth Crush', icon: '🪨', rarity: 'uncommon', desc: 'Slam the ground for massive damage.', effect: 'damage', multiplier: 1.8, bonus: { atk: 5 } },
  { id: 'fang_strike', name: 'Fang Strike', icon: '🐺', rarity: 'uncommon', desc: 'Multi-hit feral attack.', effect: 'multi', hits: 3, multiplier: 0.6, bonus: { atk: 4, spd: 3 } },
  { id: 'war_cry', name: 'War Cry', icon: '📣', rarity: 'uncommon', desc: 'Boost morale. Heals and buffs.', effect: 'heal', healPct: 0.2, bonus: { atk: 6 } },

  // Rare
  { id: 'holy_slash', name: 'Holy Slash', icon: '✨', rarity: 'rare', desc: 'Blessed blade cuts through defenses.', effect: 'damage', multiplier: 2.2, bonus: { atk: 10, critChance: 0.1 } },
  { id: 'tidal_wave', name: 'Tidal Wave', icon: '🌊', rarity: 'rare', desc: 'Summon a crushing wave.', effect: 'stun', multiplier: 1.9, bonus: { atk: 8, def: 5 } },
  { id: 'shadow_clone', name: 'Shadow Clone', icon: '👤', rarity: 'rare', desc: 'Create clones for multi-hit.', effect: 'multi', hits: 5, multiplier: 0.7, bonus: { spd: 10, critChance: 0.08 } },

  // Legendary
  { id: 'hellfire', name: 'Hellfire', icon: '🔥', rarity: 'legendary', desc: 'Unleash demonic flames.', effect: 'damage', multiplier: 3.5, bonus: { atk: 20, critChance: 0.15 } },
  { id: 'void_rend', name: 'Void Rend', icon: '🌀', rarity: 'legendary', desc: 'Tear through reality itself.', effect: 'multi', hits: 7, multiplier: 0.9, bonus: { atk: 15, spd: 10, critChance: 0.2 } },
  { id: 'divine_heal', name: 'Divine Restoration', icon: '💫', rarity: 'legendary', desc: 'Restore a massive amount of HP.', effect: 'heal', healPct: 0.5, bonus: { def: 15, atk: 10 } },

  // Dig-only
  { id: 'ancient_strike', name: 'Ancient Strike', icon: '🏺', rarity: 'rare', desc: 'A technique from a lost civilization.', effect: 'damage', multiplier: 2.5, bonus: { atk: 12 } },
  { id: 'crystal_shard', name: 'Crystal Shard', icon: '💎', rarity: 'rare', desc: 'Launch razor-sharp crystals.', effect: 'multi', hits: 4, multiplier: 0.8, bonus: { atk: 8, critChance: 0.12 } },

  // ── SECRET — Sukuna's Cursed Techniques ──
  // Vessel Switch is the ONLY technique you get from the finger.
  // Using it in battle swaps your moveset to all 5 JJK techniques (bypasses 4-slot limit).
  { id: 'vessel_switch', name: 'Vessel Switch', icon: '🩸', rarity: 'legendary',
    desc: "Sukuna's soul takes over. Use in battle to swap your moveset to his 5 cursed techniques.",
    effect: 'vessel', multiplier: 1.0, bonus: { atk: 30, critChance: 0.2 },
    _jjk: true, _vesselSwitch: true },
  // These are only accessible AFTER using Vessel Switch in battle
  { id: 'dismantle', name: 'Dismantle', icon: '✂️', rarity: 'legendary',
    desc: "Ryomen Sukuna's slashing attack. Cuts through anything.",
    effect: 'damage', multiplier: 4.0, bonus: { atk: 35, critChance: 0.25 },
    _jjk: true, _vesselOnly: true },
  { id: 'cleave', name: 'Cleave', icon: '🔪', rarity: 'legendary',
    desc: "Adapts to the target's durability. Always deals massive damage.",
    effect: 'multi', hits: 3, multiplier: 1.8, bonus: { atk: 28, spd: 15 },
    _jjk: true, _vesselOnly: true },
  { id: 'fuga', name: 'Fuga', icon: '🏹', rarity: 'legendary',
    desc: "Giant Flame Arrow — a colossal fire arrow that obliterates everything in its path. Massive single hit.",
    effect: 'damage', multiplier: 7.0, bonus: { atk: 40, critChance: 0.15 },
    _jjk: true, _vesselOnly: true },
  { id: 'domain_expansion', name: 'Domain Expansion: Malevolent Shrine', icon: '🏯', rarity: 'legendary',
    desc: "Malevolent Shrine — continuous slashes for 4 turns. Each turn deals massive damage automatically.",
    effect: 'domain_slash', slashTurns: 4, slashMult: 2.5, bonus: { atk: 50, def: 20, spd: 20, critChance: 0.5 },
    _jjk: true, _vesselOnly: true },
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
  // Vessel Switch does NOT auto-grant the other JJK techniques.
  // They are only accessible when Vessel Switch is activated in battle.
}

function equipTechnique(techId, slot) {
  const p = G.player;
  const tech = TECHNIQUES.find(t => t.id === techId);
  // Vessel-only techniques are never equippable — they appear only via Vessel Switch in battle
  if (tech && tech._vesselOnly) { toast('This technique only activates via Vessel Switch in battle.', 'warn'); return; }
  // Expand equipped array if slots have been unlocked
  const maxSlots = getMaxEquipSlots();
  while (p.equipped.length < maxSlots) p.equipped.push(null);
  // Remove from other slots
  p.equipped = p.equipped.map(e => e === techId ? null : e);
  p.equipped[slot] = techId;
  renderInventory();
}

function unequipSlot(slot) {
  G.player.equipped[slot] = null;
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

function renderInventory() {
  renderEquipSlots();
  renderTechniqueList();
}

function renderEquipSlots() {
  const grid = document.getElementById('equip-grid');
  if (!grid) return;
  const p = G.player;
  const maxSlots = getMaxEquipSlots();

  while (p.equipped.length < maxSlots) p.equipped.push(null);

  // Purge vessel-only techs AND techs that don't exist in TECHNIQUES array
  p.equipped = p.equipped.map(id => {
    if (!id) return null;
    const t = TECHNIQUES.find(t => t.id === id);
    if (!t) return null; // technique not found — remove from slot
    if (t._vesselOnly) return null;
    return id;
  });

  grid.innerHTML = p.equipped.slice(0, maxSlots).map((techId, i) => {
    if (!techId) {
      return `<div class="equip-slot"><span>Slot ${i+1}</span></div>`;
    }
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (!tech) return `<div class="equip-slot"><span>Slot ${i+1}</span></div>`;
    return `
      <div class="equip-slot filled">
        <button class="btn-small btn-unequip" onclick="unequipSlot(${i})">✕</button>
        <div class="slot-name">${tech.icon} ${tech.name}</div>
        <div class="slot-type tech-rarity ${tech.rarity}">${tech.rarity}</div>
        <div style="font-size:11px;color:var(--text-dim);margin-top:4px">${tech.desc}</div>
      </div>
    `;
  }).join('') + (maxSlots < 10 ? `<div class="equip-slot locked-slot" title="Unlock more slots in Skill Tree → Slots">🔒 +${10 - maxSlots} more in Skill Tree</div>` : '');
}

function renderTechniqueList() {
  const list = document.getElementById('technique-list');
  if (!list) return;
  const p = G.player;

  // Filter out vessel-only techniques AND techniques not found in TECHNIQUES array
  const visible = p.techniques.filter(id => {
    const t = TECHNIQUES.find(t => t.id === id);
    return t && !t._vesselOnly;
  });

  if (visible.length === 0) {
    list.innerHTML = '<div style="color:var(--text-dim);font-size:13px">No techniques yet. Defeat bosses or dig to find them!</div>';
    return;
  }

  list.innerHTML = visible.map(techId => {
    const tech = TECHNIQUES.find(t => t.id === techId);
    if (!tech) return '';
    const isEquipped = p.equipped.includes(techId);
    const bonusStr = tech.bonus ? Object.entries(tech.bonus).map(([k,v]) => `+${v} ${k}`).join(', ') : '';
    const maxSlots = getMaxEquipSlots();
    const emptySlot = p.equipped.slice(0, maxSlots).findIndex(e => e === null);
    // vessel_switch can be equipped but shows a special note
    const isVessel = tech._vesselSwitch;

    return `
      <div class="card technique-card${tech._jjk ? ' jjk-technique' : ''}">
        <div class="tech-rarity ${tech.rarity}">${tech._jjk ? '🩸 CURSED' : tech.rarity.toUpperCase()}</div>
        <h3>${tech.icon} ${tech.name}</h3>
        <div class="card-desc">${tech.desc}</div>
        ${isVessel ? `<div style="font-size:11px;color:#ff4444;margin:4px 0">⚠️ Equip this — using it in battle unlocks Sukuna's full moveset</div>` : ''}
        <div class="card-stats">
          <span>${
            tech.effect === 'damage' ? `⚔️ ${Math.floor((tech.multiplier||1) * 100)}% ATK` :
            tech.effect === 'heal'   ? `💚 Heal ${Math.floor((tech.healPct||0)*100)}% HP` :
            tech.effect === 'vessel' ? '🩸 Swaps moveset in battle' :
            tech.effect === 'stun'   ? `⚡ Stun + ${Math.floor((tech.multiplier||1)*100)}% ATK` :
            tech.effect === 'multi'  ? `🔁 ${tech.hits||2}x hits` :
            tech.effect === 'shield' ? `🛡️ Immune ${tech.shieldTurns||2} turns` :
            tech.effect === 'domain_slash' ? `🏯 ${tech.slashTurns} turn slashes` :
            `⚔️ ${Math.floor((tech.multiplier||1)*100)}% ATK`
          }</span>
          ${bonusStr ? `<span class="highlight">${bonusStr}</span>` : ''}
        </div>
        ${isEquipped
          ? `<span style="color:var(--success);font-size:12px">✓ Equipped</span>`
          : emptySlot >= 0
            ? `<button class="btn-small" onclick="equipTechnique('${techId}', ${emptySlot})">Equip</button>`
            : `<span style="color:var(--warn);font-size:12px">Slots full</span>`
        }
      </div>
    `;
  }).join('');
}
