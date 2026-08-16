import React, { useState } from 'react';
import { PALS_DATA, ELEMENTS, DIFFICULTY_TIERS } from '../data/palsData';
import { sound } from '../utils/audio';
import { Dices, RotateCcw, ShieldAlert, Sparkles, Tv, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PalSlotMachine({ masteredVault, onToggleVault, onSelectPalForChallenge, onSetHudPal, allPals }) {
  const [teamSize, setTeamSize] = useState(3);
  const [excludeVaulted, setExcludeVaulted] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [team, setTeam] = useState([null, null, null]);
  const [isSpinning, setIsSpinning] = useState(false);

  const palList = allPals || PALS_DATA;

  // Available Pals filter
  const getEligiblePals = () => {
    return palList.filter(pal => {
      if (excludeVaulted && masteredVault.includes(pal.id)) return false;
      if (selectedDifficulty === 'Weakest') {
        if (!pal.isMemeFilter && pal.difficulty !== 'C' && pal.difficulty !== 'Meme') return false;
      } else if (selectedDifficulty === 'Mid') {
        if (pal.difficulty !== 'A' && pal.difficulty !== 'B') return false;
      } else if (selectedDifficulty === 'Trolling') {
        if (!pal.isTrollFilter && pal.difficulty !== 'Trolling') return false;
      } else if (selectedDifficulty === 'Collab') {
        if (!pal.isCollab) return false;
      } else if (selectedDifficulty !== 'All' && pal.difficulty !== selectedDifficulty && pal.pindropTier !== selectedDifficulty) {
        return false;
      }
      return true;
    });
  };

  const spinTeam = () => {
    const pool = getEligiblePals();
    if (pool.length === 0) return;

    setIsSpinning(true);
    sound.playClick();

    // Reel spin animation effect
    let count = 0;
    const interval = setInterval(() => {
      count++;
      sound.playTick(600 + (count % 5) * 50, 0.05);

      // Random temporary draft
      const tempTeam = [];
      const shuffledPool = [...pool].sort(() => 0.5 - Math.random());
      for (let i = 0; i < teamSize; i++) {
        tempTeam.push(shuffledPool[i % shuffledPool.length]);
      }
      setTeam(tempTeam);

      if (count > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        sound.playVictory();

        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 100);
  };

  const rerollSlot = (slotIdx) => {
    const pool = getEligiblePals();
    if (pool.length === 0) return;

    sound.playClick();
    const currentPalIds = team.map(p => p?.id);
    const available = pool.filter(p => !currentPalIds.includes(p.id));
    const randomPick = available[Math.floor(Math.random() * available.length)] || pool[0];

    const updatedTeam = [...team];
    updatedTeam[slotIdx] = randomPick;
    setTeam(updatedTeam);
    sound.playReelStop();
  };

  const handleTeamSizeChange = (size) => {
    setTeamSize(size);
    setTeam(Array(size).fill(null));
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Banner */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>
          SLOT MACHINE <span className="gradient-text">TEAM DRAFT</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Draft a team of 1, 3, or 5 Pals for multi-Pal challenge runs! Reroll individual slots as needed.
        </p>

        {/* Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>Team Size:</span>
            {[1, 3, 5].map(size => (
              <button
                key={size}
                onClick={() => handleTeamSizeChange(size)}
                style={{
                  background: teamSize === size ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${teamSize === size ? '#00f0ff' : 'var(--border-glass)'}`,
                  color: teamSize === size ? '#00f0ff' : '#94a3b8',
                  padding: '6px 16px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {size} Pal{size > 1 ? 's' : ''}
              </button>
            ))}
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              background: 'rgba(13, 18, 29, 0.9)',
              color: selectedDifficulty === 'Weakest' ? '#ff1744' : selectedDifficulty === 'Mid' ? '#00e676' : selectedDifficulty === 'Trolling' ? '#e040fb' : '#fff',
              border: selectedDifficulty === 'Weakest' ? '1px solid #ff1744' : selectedDifficulty === 'Mid' ? '1px solid #00e676' : selectedDifficulty === 'Trolling' ? '1px solid #e040fb' : '1px solid var(--border-glass)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontWeight: 700
            }}
          >
            <option value="All">All Tiers</option>
            {Object.entries(DIFFICULTY_TIERS).map(([key, data]) => (
              <option key={key} value={key}>{data.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Slots Display Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${teamSize}, 1fr)`,
        gap: '20px',
        marginBottom: '32px'
      }}>
        {team.slice(0, teamSize).map((pal, idx) => {
          const elemData = pal ? (ELEMENTS[pal.elements[0]] || ELEMENTS.Neutral) : null;

          return (
            <div key={idx} className={`glass-panel ${pal ? 'glass-panel-glow' : ''}`} style={{
              padding: '24px',
              textAlign: 'center',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 800 }}>SLOT #{idx + 1}</div>

              {pal ? (
                <div>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '16px auto',
                    borderRadius: '20px',
                    background: elemData.bg,
                    border: `1px solid ${elemData.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '6px'
                  }}>
                    {pal.image ? (
                      <img src={pal.image} alt={pal.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '2rem' }}>{elemData.icon}</span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>{pal.name}</h3>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px' }}>
                    {pal.elements.map(e => (
                      <span key={e} className="badge-element" style={{
                        background: ELEMENTS[e]?.bg,
                        color: ELEMENTS[e]?.color,
                        borderColor: ELEMENTS[e]?.border
                      }}>
                        {ELEMENTS[e]?.icon} {e}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: DIFFICULTY_TIERS[pal.difficulty]?.color, fontWeight: 700 }}>
                    {DIFFICULTY_TIERS[pal.difficulty]?.label}
                  </div>
                </div>
              ) : (
                <div style={{ margin: 'auto', color: '#94a3b8' }}>
                  <Dices size={48} style={{ opacity: 0.3, marginBottom: '8px' }} />
                  <div style={{ fontWeight: 700 }}>Slot Empty</div>
                </div>
              )}

              {pal && (
                <button
                  onClick={() => rerollSlot(idx)}
                  disabled={isSpinning}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-glass)',
                    color: '#94a3b8',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    marginTop: '16px'
                  }}
                >
                  <RotateCcw size={14} /> Reroll Slot #{idx + 1}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Spin Action Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={spinTeam}
          disabled={isSpinning}
          className="btn-cyber"
          style={{ padding: '16px 48px', fontSize: '1.2rem' }}
        >
          <Dices size={24} />
          {isSpinning ? 'SPINNING REELS...' : 'DRAFT FULL TEAM!'}
        </button>
      </div>
    </div>
  );
}
