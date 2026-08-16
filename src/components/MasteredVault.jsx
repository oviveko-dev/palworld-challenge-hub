import React, { useState } from 'react';
import { ELEMENTS, DIFFICULTY_TIERS, PALS_DATA } from '../data/palsData';
import { ShieldCheck, ShieldAlert, RotateCcw, Download, Upload, Trash2, Search, Sparkles, Plus, X, Check, Flame } from 'lucide-react';
import { sound } from '../utils/audio';

export default function MasteredVault({ masteredVault, onToggleVault, onClearVault, onSetVault, onAddCustomPal, allPals }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElement, setSelectedElement] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('existing'); // 'existing' | 'custom'
  const [addSearchQuery, setAddSearchQuery] = useState('');

  // Custom Pal Form State
  const [customName, setCustomName] = useState('');
  const [customElement, setCustomElement] = useState('Neutral');
  const [customDifficulty, setCustomDifficulty] = useState('S');
  const [customSkill, setCustomSkill] = useState('');
  const [customImage, setCustomImage] = useState('');

  const palList = allPals || PALS_DATA;
  const vaultedPals = palList.filter(pal => masteredVault.includes(pal.id));
  const availablePals = palList.filter(pal => !masteredVault.includes(pal.id));

  const filteredVault = vaultedPals.filter(pal => {
    const matchesSearch = pal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesElem = selectedElement === 'All' || pal.elements.includes(selectedElement);
    return matchesSearch && matchesElem;
  });

  const completionRate = Math.round((vaultedPals.length / palList.length) * 100);

  const handleExport = () => {
    sound.playClick();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(masteredVault));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `palworld_mastered_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      try {
        const importedVault = JSON.parse(e.target.result);
        if (Array.isArray(importedVault)) {
          onSetVault(importedVault);
          sound.playVictory();
        }
      } catch (err) {
        alert("Invalid JSON vault file!");
      }
    };
  };

  const handleCreateCustomPal = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newPal = {
      id: Date.now(),
      name: customName.trim(),
      elements: [customElement],
      difficulty: customDifficulty,
      pindropTier: customDifficulty,
      partnerSkill: customSkill.trim() || 'Custom Skill: Powerful custom ability.',
      description: 'Custom added Pal for challenges.',
      image: customImage.trim() || 'https://cdn.paldb.cc/image/Pal/Texture/PalIcon/Normal/T_SheepBall_icon_normal.webp',
      isCustom: true
    };

    if (onAddCustomPal) onAddCustomPal(newPal);
    onToggleVault(newPal.id);
    sound.playVictory();

    // Reset form
    setCustomName('');
    setCustomSkill('');
    setCustomImage('');
    setIsAddModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 42, 109, 0.2)',
                border: '1px solid #ff2a6d',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex'
              }}>
                <ShieldAlert size={28} color="#ff2a6d" />
              </div>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>
                  STRONGEST & MASTERED <span className="gradient-text">VAULT</span>
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
                  Pals in this vault are excluded from all future wheel spins and team drafts.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Vault Action Controls */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                sound.playClick();
                setIsAddModalOpen(true);
              }}
              className="btn-gold"
              style={{ padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <Plus size={16} /> Add Pal to Vault
            </button>

            <button
              onClick={handleExport}
              disabled={masteredVault.length === 0}
              className="btn-cyber"
              style={{ padding: '10px 16px', fontSize: '0.85rem' }}
            >
              <Download size={16} /> Export JSON
            </button>

            <label className="btn-cyber" style={{ padding: '10px 16px', fontSize: '0.85rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}>
              <Upload size={16} /> Import JSON
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>

            {masteredVault.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm("Clear all vaulted Pals and restore them to random picking?")) {
                    onClearVault();
                  }
                }}
                className="btn-danger"
                style={{ padding: '10px 16px', fontSize: '0.85rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={16} /> Reset Vault
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginTop: '24px',
          padding: '20px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>VAULTED / MASTERED</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ff2a6d' }}>
              {vaultedPals.length} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Pals</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>REMAINING IN PICK POOL</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#00f0ff' }}>
              {availablePals.length} <span style={{ fontSize: '1rem', color: '#94a3b8' }}>Pals</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>PALDEX COMPLETION</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffd166' }}>
              {completionRate}%
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${completionRate}%`, height: '100%', background: 'linear-gradient(90deg, #ffd166, #ff2a6d)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{
          flex: 1,
          minWidth: '240px',
          position: 'relative'
        }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search Vaulted Pals..."
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

        <select
          value={selectedElement}
          onChange={(e) => setSelectedElement(e.target.value)}
          style={{
            background: 'rgba(13, 18, 29, 0.8)',
            color: '#fff',
            border: '1px solid var(--border-glass)',
            padding: '10px 16px',
            borderRadius: '12px',
            fontWeight: 600
          }}
        >
          <option value="All">All Elements</option>
          {Object.keys(ELEMENTS).map(elem => (
            <option key={elem} value={elem}>{ELEMENTS[elem].icon} {elem}</option>
          ))}
        </select>
      </div>

      {/* Vault Cards Grid */}
      {filteredVault.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredVault.map(pal => {
            const primaryElement = pal.elements[0];
            const elemData = ELEMENTS[primaryElement] || ELEMENTS.Neutral;

            return (
              <div key={pal.id} className="glass-panel" style={{
                padding: '20px',
                border: '1px solid rgba(255, 42, 109, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="badge-vaulted" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  VAULTED
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
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
                      <span style={{ fontSize: '1.5rem' }}>{elemData.icon}</span>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{pal.name}</h3>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Paldex #{pal.id}</div>
                  </div>
                </div>

                {/* Element & Tier Badges */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  {pal.elements.map(elem => (
                    <span key={elem} className="badge-element" style={{
                      background: ELEMENTS[elem]?.bg,
                      color: ELEMENTS[elem]?.color,
                      borderColor: ELEMENTS[elem]?.border
                    }}>
                      {ELEMENTS[elem]?.icon} {elem}
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

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px', fontStyle: 'italic' }}>
                  "{pal.description}"
                </p>

                {/* Unvault Button */}
                <button
                  onClick={() => {
                    onToggleVault(pal.id);
                    sound.playClick();
                  }}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#00f0ff',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <RotateCcw size={16} /> Restore to Pick Pool
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
          <ShieldCheck size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
            {masteredVault.length === 0 ? "No Pals in Mastered Vault Yet" : "No Vaulted Pals Match Your Search"}
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: '500px', margin: '0 auto 20px' }}>
            {masteredVault.length === 0
              ? "When you finish a challenge or max out a Pal, mark it as 'Strongest & Mastered' on the Wheel or Paldex. It will be moved here and won't show up in future random draws!"
              : "Try adjusting your search terms or element filter."}
          </p>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-gold"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            <Plus size={18} /> Add Pal to Vault
          </button>
        </div>
      )}

      {/* ADD PAL TO VAULT MODAL */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '750px',
            maxHeight: '85vh',
            borderRadius: '20px',
            border: '1px solid #ffd166',
            boxShadow: '0 0 40px rgba(255, 209, 102, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(13, 18, 29, 0.9)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Plus size={24} color="#ffd166" />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                    ADD PAL TO MASTERED VAULT
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                    Select existing Pals or create a new custom Pal to vault
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
              <button
                onClick={() => setActiveModalTab('existing')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: activeModalTab === 'existing' ? 'rgba(255, 209, 102, 0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: activeModalTab === 'existing' ? '2px solid #ffd166' : 'none',
                  color: activeModalTab === 'existing' ? '#ffd166' : '#cbd5e1',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                📥 Select Existing Pal ({availablePals.length})
              </button>

              <button
                onClick={() => setActiveModalTab('custom')}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: activeModalTab === 'custom' ? 'rgba(224, 64, 251, 0.15)' : 'transparent',
                  border: 'none',
                  borderBottom: activeModalTab === 'custom' ? '2px solid #e040fb' : 'none',
                  color: activeModalTab === 'custom' ? '#e040fb' : '#cbd5e1',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                ✨ Create Custom Pal
              </button>
            </div>

            {/* Tab 1: Existing Pal Search & Add */}
            {activeModalTab === 'existing' && (
              <>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <input
                    type="text"
                    placeholder="Search Pal name or ID to add to vault..."
                    value={addSearchQuery}
                    onChange={(e) => setAddSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                  {availablePals
                    .filter(p => p.name.toLowerCase().includes(addSearchQuery.toLowerCase()))
                    .map(pal => (
                      <div
                        key={pal.id}
                        onClick={() => {
                          onToggleVault(pal.id);
                          sound.playVictory();
                        }}
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '12px',
                          padding: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img
                          src={pal.image}
                          alt={pal.name}
                          style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                        />
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', textAlign: 'center', wordBreak: 'break-word' }}>
                          {pal.name}
                        </div>
                        <button
                          style={{
                            background: 'rgba(255, 42, 109, 0.2)',
                            border: '1px solid #ff2a6d',
                            color: '#ff2a6d',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            marginTop: '2px'
                          }}
                        >
                          + Vault Pal
                        </button>
                      </div>
                    ))}
                </div>
              </>
            )}

            {/* Tab 2: Custom Pal Form */}
            {activeModalTab === 'custom' && (
              <form onSubmit={handleCreateCustomPal} style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Pal Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ultra Anubis, Shadow Lamball"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Element
                    </label>
                    <select
                      value={customElement}
                      onChange={(e) => setCustomElement(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(13, 18, 29, 0.9)',
                        color: '#fff',
                        border: '1px solid var(--border-glass)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {Object.keys(ELEMENTS).map(elem => (
                        <option key={elem} value={elem}>{elem}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Combat Tier
                    </label>
                    <select
                      value={customDifficulty}
                      onChange={(e) => setCustomDifficulty(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(13, 18, 29, 0.9)',
                        color: '#fff',
                        border: '1px solid var(--border-glass)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <option value="S+">S+ Tier (Meta)</option>
                      <option value="S">S Tier (High Combat)</option>
                      <option value="A">A Tier (Solid)</option>
                      <option value="B">B Tier (Average)</option>
                      <option value="C">C Tier (Meme/Weak)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Partner Skill Name & Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shadow Stance: Increases Dark damage by 50%"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://cdn.paldb.cc/..."
                    value={customImage}
                    onChange={(e) => setCustomImage(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-glass)',
                      color: '#fff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold"
                  style={{ width: '100%', marginTop: '8px', padding: '10px' }}
                >
                  <Sparkles size={16} /> Create Pal & Add to Vault
                </button>
              </form>
            )}

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(13, 18, 29, 0.9)' }}>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="btn-cyber"
                style={{ padding: '8px 24px' }}
              >
                DONE ({vaultedPals.length} Pals Vaulted)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
