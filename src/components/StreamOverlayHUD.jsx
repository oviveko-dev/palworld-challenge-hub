import React, { useState, useEffect } from 'react';
import { ELEMENTS, PALS_DATA } from '../data/palsData';
import { sound } from '../utils/audio';
import { Play, Pause, RotateCcw, Plus, Minus, CheckSquare, Square, ShieldAlert, Skull, Tv, Flame, Trophy, FlameKindling } from 'lucide-react';

// Official Palworld Tower Bosses Dataset (Excluding raid/world bosses as requested)
export const TOWER_BOSSES = [
  {
    id: 'zoe_grizzbolt',
    tower: 'Rayne Syndicate Tower',
    bossName: 'Zoe & Grizzbolt',
    element: 'Electric',
    icon: '⚡',
    normal: { level: 10, hp: '12,900' },
    hard: { level: 72, hp: '464,000' }
  },
  {
    id: 'lily_lyleen',
    tower: 'Free Pal Alliance Tower',
    bossName: 'Lily & Lyleen',
    element: 'Grass',
    icon: '🍃',
    normal: { level: 20, hp: '42,500' },
    hard: { level: 74, hp: '494,000' }
  },
  {
    id: 'axel_orserk',
    tower: 'Eternal Pyre Tower',
    bossName: 'Axel & Orserk',
    element: 'Dragon',
    icon: '🐉',
    normal: { level: 30, hp: '53,750' },
    hard: { level: 76, hp: '514,800' }
  },
  {
    id: 'marcus_faleris',
    tower: 'PIDF Tower',
    bossName: 'Marcus & Faleris',
    element: 'Fire',
    icon: '🔥',
    normal: { level: 40, hp: '72,900' },
    hard: { level: 78, hp: '526,900' }
  },
  {
    id: 'victor_shadowbeak',
    tower: 'PAL Genetic Research Unit',
    bossName: 'Victor & Shadowbeak',
    element: 'Dark',
    icon: '🌙',
    normal: { level: 50, hp: '105,000' },
    hard: { level: 80, hp: '570,000' }
  },
  {
    id: 'saya_selyne',
    tower: 'Moonflower Tower',
    bossName: 'Saya & Selyne',
    element: 'Dark',
    icon: '🌙',
    normal: { level: 55, hp: '234,900' },
    hard: { level: 80, hp: '567,300' }
  },
  {
    id: 'bjorn_bastigor',
    tower: 'Feybreak Tower',
    bossName: 'Bjorn & Bastigor',
    element: 'Ice',
    icon: '❄️',
    normal: { level: 60, hp: '310,000' },
    hard: { level: 80, hp: '487,500' }
  },
  {
    id: 'auri_shaolong',
    tower: 'Azure Covenant Tower',
    bossName: 'Auri & Shaolong',
    element: 'Dragon',
    icon: '🐉',
    normal: { level: 68, hp: '327,600' },
    hard: { level: 80, hp: '501,600' }
  },
  {
    id: 'zenara_astralym',
    tower: 'Blightstar Tower',
    bossName: 'Zenara & Astralym',
    element: 'Dragon',
    icon: '🌌',
    normal: { level: 80, hp: '420,000' },
    hard: { level: 100, hp: '6,237,000' }
  }
];

export default function StreamOverlayHUD({ activePal, masteredVault, onToggleVault }) {
  const [deaths, setDeaths] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isHardMode, setIsHardMode] = useState(false);

  // Tower boss completion state map
  const [defeatedTowers, setDefeatedTowers] = useState({});

  const pal = activePal || PALS_DATA[0];
  const elemData = ELEMENTS[pal.elements[0]] || ELEMENTS.Neutral;

  // Timer interval effect
  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs > 0 ? String(hrs).padStart(2, '0') + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const toggleTowerBoss = (bossId) => {
    sound.playClick();
    const modeKey = isHardMode ? `${bossId}_hard` : `${bossId}_normal`;
    setDefeatedTowers(prev => ({
      ...prev,
      [modeKey]: !prev[modeKey]
    }));
  };

  // Calculate completion percentage
  const totalBosses = TOWER_BOSSES.length;
  const currentDefeatedCount = TOWER_BOSSES.filter(b => {
    const key = isHardMode ? `${b.id}_hard` : `${b.id}_normal`;
    return defeatedTowers[key];
  }).length;
  const completionPercent = Math.round((currentDefeatedCount / totalBosses) * 100);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tv color="#00f0ff" /> STREAMER & CREATOR <span className="gradient-text">HUD</span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Interactive overlay dashboard with official Palworld Tower Bosses & Hard Mode tracking for OBS capture.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playVictory();
            onToggleVault(pal.id);
          }}
          className="btn-danger"
          style={{ padding: '10px 18px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ShieldAlert size={16} />
          {masteredVault.includes(pal.id) ? 'Pal Vaulted (Excluded)' : 'Mark Pal as Mastered / Strongest'}
        </button>
      </div>

      {/* Main HUD Display Panel */}
      <div className="glass-panel glass-panel-glow" style={{
        padding: '32px',
        borderRadius: '24px',
        border: '2px solid #00f0ff',
        background: 'linear-gradient(135deg, rgba(13, 18, 29, 0.95) 0%, rgba(7, 9, 14, 0.95) 100%)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          
          {/* Active Pal Card */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid var(--border-glass)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ACTIVE CHALLENGE PAL
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
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
                  <span style={{ fontSize: '1.8rem' }}>{elemData.icon}</span>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>{pal.name}</h3>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
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
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px' }}>
              <strong>Partner Skill:</strong> {pal.partnerSkill}
            </div>
          </div>

          {/* Counters & Timer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
            {/* Live Death Counter */}
            <div style={{
              background: 'rgba(255, 42, 109, 0.1)',
              border: '1px solid rgba(255, 42, 109, 0.4)',
              padding: '16px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#ff2a6d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Skull size={16} /> DEATH / FAINT COUNTER
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
                  {deaths}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setDeaths(d => Math.max(0, d - 1));
                    sound.playClick();
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Minus size={18} />
                </button>

                <button
                  onClick={() => {
                    setDeaths(d => d + 1);
                    sound.playClick();
                  }}
                  style={{
                    background: '#ff2a6d',
                    border: 'none',
                    color: '#fff',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Live Challenge Timer */}
            <div style={{
              background: 'rgba(0, 240, 255, 0.1)',
              border: '1px solid rgba(0, 240, 255, 0.4)',
              padding: '16px 24px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 800 }}>CHALLENGE TIMER</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'Outfit', color: '#fff' }}>
                  {formatTime(seconds)}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setTimerRunning(!timerRunning);
                    sound.playClick();
                  }}
                  style={{
                    background: timerRunning ? '#ffb74d' : '#05ffa1',
                    border: 'none',
                    color: '#000',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {timerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {timerRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setSeconds(0);
                    sound.playClick();
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-glass)',
                    color: '#94a3b8',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tower Bosses Progress Tracker & Mode Toggle */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', color: '#ffd166', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trophy size={18} /> OFFICIAL TOWER BOSSES PROGRESS ({currentDefeatedCount}/{totalBosses} - {completionPercent}%)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                Mode: {isHardMode ? '🔥 HARD MODE (High HP & Level)' : '⚡ NORMAL MODE'}
              </div>
            </div>

            {/* Hard Mode Toggle */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setIsHardMode(false);
                  sound.playClick();
                }}
                style={{
                  background: !isHardMode ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${!isHardMode ? '#00f0ff' : 'var(--border-glass)'}`,
                  color: !isHardMode ? '#00f0ff' : '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                ⚡ Normal Mode
              </button>

              <button
                onClick={() => {
                  setIsHardMode(true);
                  sound.playClick();
                }}
                style={{
                  background: isHardMode ? 'rgba(255, 42, 109, 0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isHardMode ? '#ff2a6d' : 'var(--border-glass)'}`,
                  color: isHardMode ? '#ff2a6d' : '#94a3b8',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Flame size={14} /> HARD MODE
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
            <div style={{
              width: `${completionPercent}%`,
              height: '100%',
              background: isHardMode ? 'linear-gradient(90deg, #ff2a6d, #ff9100)' : 'linear-gradient(90deg, #00f0ff, #05ffa1)',
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* Bosses Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '12px'
          }}>
            {TOWER_BOSSES.map(boss => {
              const modeKey = isHardMode ? `${boss.id}_hard` : `${boss.id}_normal`;
              const isChecked = Boolean(defeatedTowers[modeKey]);
              const stats = isHardMode ? boss.hard : boss.normal;

              return (
                <div
                  key={boss.id}
                  onClick={() => toggleTowerBoss(boss.id)}
                  style={{
                    background: isChecked
                      ? (isHardMode ? 'rgba(255, 42, 109, 0.15)' : 'rgba(5, 255, 161, 0.15)')
                      : 'rgba(0,0,0,0.35)',
                    border: `1px solid ${isChecked ? (isHardMode ? '#ff2a6d' : '#05ffa1') : 'var(--border-glass)'}`,
                    color: isChecked ? (isHardMode ? '#ff2a6d' : '#05ffa1') : '#cbd5e1',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        {boss.icon} {boss.bossName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {boss.tower}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: isHardMode ? '#ff2a6d' : '#00f0ff'
                    }}>
                      Lvl {stats.level}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {stats.hp} HP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
