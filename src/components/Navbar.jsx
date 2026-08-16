import React from 'react';
import { Disc, Dices, ShieldCheck, Flame, Tv, BookOpen, Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Navbar({ activeTab, setActiveTab, masteredCount, muted, setMuted, eliminationMode, setEliminationMode }) {
  const handleMuteToggle = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
  };

  return (
    <header style={{
      background: 'rgba(13, 18, 29, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('wheel')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #7000ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
          }}>
            <Flame size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, textTransform: 'uppercase', margin: 0, lineHeight: 1.1 }}>
              PALWORLD <span className="gradient-text">HUB</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, margin: 0 }}>
              ULTIMATE CHALLENGE & PAL PICKER
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('wheel')}
            className={`btn-nav ${activeTab === 'wheel' ? 'active' : ''}`}
            style={navBtnStyle(activeTab === 'wheel')}
          >
            <Disc size={18} />
            Pal Wheel
          </button>

          <button
            onClick={() => setActiveTab('slot')}
            className={`btn-nav ${activeTab === 'slot' ? 'active' : ''}`}
            style={navBtnStyle(activeTab === 'slot')}
          >
            <Dices size={18} />
            Slot Draft
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`btn-nav ${activeTab === 'vault' ? 'active' : ''}`}
            style={navBtnStyle(activeTab === 'vault')}
          >
            <ShieldCheck size={18} color={masteredCount > 0 ? '#ff2a6d' : 'currentColor'} />
            Strongest Vault
            {masteredCount > 0 && (
              <span style={{
                background: '#ff2a6d',
                color: '#fff',
                borderRadius: '12px',
                padding: '2px 7px',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {masteredCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`btn-nav ${activeTab === 'generator' ? 'active' : ''}`}
            style={navBtnStyle(activeTab === 'generator')}
          >
            <Flame size={18} />
            Idea Builder
          </button>

          <button
            onClick={() => setActiveTab('hud')}
            className={`btn-nav ${activeTab === 'hud' ? 'active' : ''}`}
            style={navBtnStyle(activeTab === 'hud')}
          >
            <Tv size={18} />
            Streamer HUD
          </button>

          <button
            onClick={() => setActiveTab('paldex')}
            className={`btn-nav ${activeTab === 'paldex' ? 'active' : ''}`}
            style={navBtnStyle(activeTab === 'paldex')}
          >
            <BookOpen size={18} />
            Paldex
          </button>
        </nav>

        {/* Quick Settings Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Elimination Mode Toggle */}
          <button
            onClick={() => setEliminationMode(!eliminationMode)}
            title="Auto-Vault picked Pals so they don't get chosen again!"
            style={{
              background: eliminationMode ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${eliminationMode ? '#ff2a6d' : 'rgba(255, 255, 255, 0.1)'}`,
              color: eliminationMode ? '#ff2a6d' : '#94a3b8',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 700,
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldAlert size={16} />
            Elimination Mode: {eliminationMode ? 'ON' : 'OFF'}
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleMuteToggle}
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: muted ? '#94a3b8' : '#00f0ff',
              padding: '8px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}

const navBtnStyle = (isActive) => ({
  background: isActive ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(112, 0, 255, 0.2) 100%)' : 'transparent',
  border: isActive ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid transparent',
  color: isActive ? '#00f0ff' : '#94a3b8',
  padding: '8px 14px',
  borderRadius: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: isActive ? 700 : 500,
  fontSize: '0.85rem',
  transition: 'all 0.2s ease'
});
