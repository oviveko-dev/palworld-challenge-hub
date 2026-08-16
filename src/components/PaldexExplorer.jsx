import React, { useState } from 'react';
import { PALS_DATA, ELEMENTS, DIFFICULTY_TIERS } from '../data/palsData';
import { sound } from '../utils/audio';
import { Search, ShieldAlert, ShieldCheck, Plus, Trash2, X } from 'lucide-react';

export default function PaldexExplorer({ masteredVault, onToggleVault, onSelectPalForChallenge, onSetHudPal, customPals, onAddCustomPal, onDeleteCustomPal, allPals }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [vaultFilter, setVaultFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id');

  // Modal State for adding custom Pal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPalName, setNewPalName] = useState('');
  const [newPalElement, setNewPalElement] = useState('Fire');
  const [newPalTier, setNewPalTier] = useState('Normal');
  const [newPalHp, setNewPalHp] = useState(80);
  const [newPalAtk, setNewPalAtk] = useState(80);
  const [newPalDef, setNewPalDef] = useState(80);
  const [newPalSkill, setNewPalSkill] = useState('');
  const [newPalDesc, setNewPalDesc] = useState('');

  const filteredPals = allPals.filter(pal => {
    const matchesSearch = pal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          pal.id.toString().includes(searchTerm);
    const matchesElem = selectedElement === 'All' || pal.elements.includes(selectedElement);

    let matchesDiff = true;
    if (selectedDifficulty === 'Weakest') {
      matchesDiff = pal.isMemeFilter || pal.difficulty === 'C' || pal.difficulty === 'Meme';
    } else if (selectedDifficulty === 'Mid') {
      matchesDiff = pal.difficulty === 'A' || pal.difficulty === 'B';
    } else if (selectedDifficulty === 'Trolling') {
      matchesDiff = pal.isTrollFilter || pal.difficulty === 'Trolling';
    } else if (selectedDifficulty === 'Collab') {
      matchesDiff = Boolean(pal.isCollab);
    } else if (selectedDifficulty !== 'All') {
      matchesDiff = pal.difficulty === selectedDifficulty || pal.pindropTier === selectedDifficulty;
    }
    
    let matchesVault = true;
    if (vaultFilter === 'Vaulted') matchesVault = masteredVault.includes(pal.id);
    if (vaultFilter === 'Available') matchesVault = !masteredVault.includes(pal.id);

    return matchesSearch && matchesElem && matchesDiff && matchesVault;
  });

  const sortedPals = [...filteredPals].sort((a, b) => {
    const totalA = (a.hp || 0) + (a.attack || 0) + (a.defense || 0);
    const totalB = (b.hp || 0) + (b.attack || 0) + (b.defense || 0);

    if (sortBy === 'weakest') return totalA - totalB;
    if (sortBy === 'strongest') return totalB - totalA;
    if (sortBy === 'atk_low') return (a.attack || 0) - (b.attack || 0);
    if (sortBy === 'hp_low') return (a.hp || 0) - (b.hp || 0);
    return 0;
  });

  const handleCreatePal = (e) => {
    e.preventDefault();
    if (!newPalName.trim()) return;

    const newPal = {
      id: Date.now(), // Unique custom ID
      name: newPalName.trim(),
      elements: [newPalElement],
      hp: Number(newPalHp),
      attack: Number(newPalAtk),
      defense: Number(newPalDef),
      difficulty: newPalTier,
      work: { Handiwork: 1 },
      partnerSkill: newPalSkill.trim() || 'Custom Skill',
      partnerDesc: newPalDesc.trim() || 'Custom Pal skill effect.',
      description: 'Custom added Pal for challenge runs.',
      isCustom: true
    };

    onAddCustomPal(newPal);
    sound.playVictory();
    setShowAddModal(false);

    // Reset form
    setNewPalName('');
    setNewPalSkill('');
    setNewPalDesc('');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>
              PALDEX <span className="gradient-text">EXPLORER</span>
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Includes latest Sakurajima update Pals! Search, compare, vault, or add custom Pals.
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddModal(true);
              sound.playClick();
            }}
            className="btn-cyber"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            <Plus size={18} /> Add Custom / Latest Pal
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '20px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search Pal Name or Paldex #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(13, 18, 29, 0.8)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                padding: '10px 14px 10px 42px',
                borderRadius: '12px',
                fontWeight: 600
              }}
            />
          </div>

          {/* Element Filter */}
          <select
            value={selectedElement}
            onChange={(e) => setSelectedElement(e.target.value)}
            style={{
              background: 'rgba(13, 18, 29, 0.8)',
              color: '#fff',
              border: '1px solid var(--border-glass)',
              padding: '10px 14px',
              borderRadius: '12px',
              fontWeight: 600
            }}
          >
            <option value="All">All Elements</option>
            {Object.keys(ELEMENTS).map(elem => (
              <option key={elem} value={elem}>{ELEMENTS[elem].icon} {elem}</option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              background: 'rgba(13, 18, 29, 0.8)',
              color: selectedDifficulty === 'Weakest' ? '#ff1744' : selectedDifficulty === 'Mid' ? '#00e676' : selectedDifficulty === 'Trolling' ? '#e040fb' : '#fff',
              border: selectedDifficulty === 'Weakest' ? '1px solid #ff1744' : selectedDifficulty === 'Mid' ? '1px solid #00e676' : selectedDifficulty === 'Trolling' ? '1px solid #e040fb' : '1px solid var(--border-glass)',
              padding: '10px 14px',
              borderRadius: '12px',
              fontWeight: 700
            }}
          >
            <option value="All">All Tiers</option>
            {Object.entries(DIFFICULTY_TIERS).map(([key, data]) => (
              <option key={key} value={key}>{data.label}</option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: 'rgba(13, 18, 29, 0.8)',
              color: '#00f0ff',
              border: '1px solid var(--border-glass)',
              padding: '10px 14px',
              borderRadius: '12px',
              fontWeight: 700
            }}
          >
            <option value="id">Sort: Paldex #</option>
            <option value="weakest">⚡ Sort: Weakest First (Lowest Stats)</option>
            <option value="strongest">🔥 Sort: Strongest First (Highest Stats)</option>
            <option value="atk_low">⚔️ Sort: Lowest ATK First</option>
            <option value="hp_low">❤️ Sort: Lowest HP First</option>
          </select>

          {/* Vault Status Filter */}
          <select
            value={vaultFilter}
            onChange={(e) => setVaultFilter(e.target.value)}
            style={{
              background: 'rgba(13, 18, 29, 0.8)',
              color: '#fff',
              border: '1px solid var(--border-glass)',
              padding: '10px 14px',
              borderRadius: '12px',
              fontWeight: 600
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available for Pick Pool</option>
            <option value="Vaulted">Vaulted / Strongest Only</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {sortedPals.map(pal => {
          const isVaulted = masteredVault.includes(pal.id);
          const primaryElement = pal.elements[0];
          const elemData = ELEMENTS[primaryElement] || ELEMENTS.Neutral;

          return (
            <div key={pal.id} className="glass-panel" style={{
              padding: '20px',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: isVaulted ? '1px solid rgba(255, 42, 109, 0.5)' : '1px solid var(--border-glass)',
              background: isVaulted ? 'rgba(255, 42, 109, 0.05)' : 'var(--bg-card)'
            }}>
              {isVaulted && (
                <span className="badge-vaulted" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  VAULTED
                </span>
              )}

              {pal.isCustom && (
                <button
                  onClick={() => onDeleteCustomPal(pal.id)}
                  title="Delete Custom Pal"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: 'rgba(255,0,0,0.2)',
                    border: '1px solid #ff0000',
                    color: '#ff0000',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', marginTop: pal.isCustom ? '16px' : '0' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '12px',
                    background: elemData.bg,
                    border: `1px solid ${elemData.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '4px'
                  }}>
                    {pal.image ? (
                      <img src={pal.image} alt={pal.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '1.6rem' }}>{elemData.icon}</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                      {pal.name} {pal.isCustom ? '✨' : ''}
                    </h3>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {pal.isCustom ? 'Custom Pal' : `Paldex #${pal.id}`}
                    </div>
                  </div>
                </div>

                {/* Element & Tier Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {pal.elements.map(e => (
                    <span key={e} className="badge-element" style={{
                      background: ELEMENTS[e]?.bg,
                      color: ELEMENTS[e]?.color,
                      borderColor: ELEMENTS[e]?.border
                    }}>
                      {ELEMENTS[e]?.icon} {e}
                    </span>
                  ))}
                  <span className="badge-element" style={{
                    background: DIFFICULTY_TIERS[pal.difficulty]?.color + '22',
                    color: DIFFICULTY_TIERS[pal.difficulty]?.color,
                    borderColor: DIFFICULTY_TIERS[pal.difficulty]?.color
                  }}>
                    {pal.difficulty}
                  </span>
                </div>

                {/* Base Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>HP</div>
                    <div style={{ fontWeight: 800, color: '#05ffa1', fontSize: '0.95rem' }}>{pal.hp}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>ATK</div>
                    <div style={{ fontWeight: 800, color: '#ff2a6d', fontSize: '0.95rem' }}>{pal.attack}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>DEF</div>
                    <div style={{ fontWeight: 800, color: '#00f0ff', fontSize: '0.95rem' }}>{pal.defense}</div>
                  </div>
                </div>

                {/* Partner Skill */}
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '16px' }}>
                  <span style={{ color: '#ffd166', fontWeight: 700 }}>⚡ {pal.partnerSkill}:</span> {pal.partnerDesc}
                </div>
              </div>

              {/* Action Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => {
                    onToggleVault(pal.id);
                    sound.playClick();
                  }}
                  style={{
                    width: '100%',
                    background: isVaulted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 42, 109, 0.15)',
                    border: `1px solid ${isVaulted ? 'rgba(255, 255, 255, 0.1)' : '#ff2a6d'}`,
                    color: isVaulted ? '#94a3b8' : '#ff2a6d',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  {isVaulted ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                  {isVaulted ? 'Restore to Pick Pool' : 'Mark as Strongest / Vault'}
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button
                    onClick={() => onSelectPalForChallenge(pal)}
                    style={{
                      background: 'rgba(0, 240, 255, 0.1)',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      color: '#00f0ff',
                      padding: '6px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Build Idea
                  </button>

                  <button
                    onClick={() => onSetHudPal(pal)}
                    style={{
                      background: 'rgba(255, 209, 102, 0.1)',
                      border: '1px solid rgba(255, 209, 102, 0.3)',
                      color: '#ffd166',
                      padding: '6px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Send to HUD
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Pal Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <form onSubmit={handleCreatePal} className="glass-panel" style={{
            maxWidth: '500px',
            width: '100%',
            padding: '28px',
            borderRadius: '20px',
            position: 'relative'
          }}>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '16px' }}>
              ➕ Add Latest / Custom Pal
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Pal Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Selyne, Knocklem, Custom Dragon..."
                  value={newPalName}
                  onChange={(e) => setNewPalName(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(13,18,29,0.9)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    marginTop: '4px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Element:</label>
                  <select
                    value={newPalElement}
                    onChange={(e) => setNewPalElement(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(13,18,29,0.9)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      marginTop: '4px'
                    }}
                  >
                    {Object.keys(ELEMENTS).map(e => (
                      <option key={e} value={e}>{ELEMENTS[e].icon} {e}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Difficulty Tier:</label>
                  <select
                    value={newPalTier}
                    onChange={(e) => setNewPalTier(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(13,18,29,0.9)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      marginTop: '4px'
                    }}
                  >
                    {Object.keys(DIFFICULTY_TIERS).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>HP:</label>
                  <input
                    type="number"
                    value={newPalHp}
                    onChange={(e) => setNewPalHp(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ATK:</label>
                  <input
                    type="number"
                    value={newPalAtk}
                    onChange={(e) => setNewPalAtk(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>DEF:</label>
                  <input
                    type="number"
                    value={newPalDef}
                    onChange={(e) => setNewPalDef(e.target.value)}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', color: '#fff', padding: '6px', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Partner Skill Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Lunar Blast"
                  value={newPalSkill}
                  onChange={(e) => setNewPalSkill(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(13,18,29,0.9)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}
                />
              </div>

              <button type="submit" className="btn-cyber" style={{ width: '100%', padding: '12px', marginTop: '12px' }}>
                Save Pal to Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
