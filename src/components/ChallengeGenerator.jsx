import React, { useState, useEffect } from 'react';
import { PALS_DATA } from '../data/palsData';
import { COMBAT_PRESETS_DATA, CHALLENGE_PRESETS } from '../data/challengesData';
import { sound } from '../utils/audio';
import { Flame, Copy, Check, Tv, Sparkles, Video, RefreshCw } from 'lucide-react';

export default function ChallengeGenerator({ initialPal, onSetHudPal, allPals }) {
  const palList = allPals || PALS_DATA;
  const [selectedPal, setSelectedPal] = useState(initialPal || palList[0]);
  const [selectedPreset, setSelectedPreset] = useState(CHALLENGE_PRESETS[0]);
  const [activeRules, setActiveRules] = useState([]);
  const [activeTitles, setActiveTitles] = useState([]);
  const [copiedTitleIndex, setCopiedTitleIndex] = useState(null);

  useEffect(() => {
    if (initialPal) {
      setSelectedPal(initialPal);
    }
  }, [initialPal]);

  // Helper to format placeholders like {PAL_NAME}, {ELEMENT}, {PARTNER_SKILL}
  const formatText = (text, pal) => {
    if (!text) return '';
    const elemName = pal.elements ? pal.elements[0] : 'Neutral';
    const partnerSkillName = pal.partnerSkill ? pal.partnerSkill.split(':')[0] : 'Special Ability';

    return text
      .replace(/{PAL_NAME}/g, pal.name)
      .replace(/{ELEMENT}/g, elemName)
      .replace(/{PARTNER_SKILL}/g, partnerSkillName);
  };

  // Helper to randomly select 'count' items from an array
  const getRandomItems = (arr, count) => {
    if (!arr || arr.length === 0) return [];
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Re-generate random rules and titles whenever preset or selectedPal changes
  useEffect(() => {
    if (!selectedPreset || !selectedPal) return;

    const presetData = COMBAT_PRESETS_DATA[selectedPreset.id] || selectedPreset;

    const rawRules = presetData.challenge_ruleset_brief || selectedPreset.rules || [];
    const rawTitles = presetData.viral_youtube_title_ideas || [];

    const chosenRules = getRandomItems(rawRules, 5).map(rule => formatText(rule, selectedPal));
    const chosenTitles = getRandomItems(rawTitles, 5).map(title => formatText(title, selectedPal));

    setActiveRules(chosenRules);
    setActiveTitles(chosenTitles);
  }, [selectedPal, selectedPreset]);

  // Shuffle button handler
  const handleShuffle = () => {
    sound.playClick();
    const presetData = COMBAT_PRESETS_DATA[selectedPreset.id] || selectedPreset;

    const rawRules = presetData.challenge_ruleset_brief || selectedPreset.rules || [];
    const rawTitles = presetData.viral_youtube_title_ideas || [];

    const chosenRules = getRandomItems(rawRules, 5).map(rule => formatText(rule, selectedPal));
    const chosenTitles = getRandomItems(rawTitles, 5).map(title => formatText(title, selectedPal));

    setActiveRules(chosenRules);
    setActiveTitles(chosenTitles);
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedTitleIndex(idx);
    sound.playClick();
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px' }}>
          VIRAL CHALLENGE & <span className="gradient-text">YOUTUBE GENERATOR</span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Craft complete video challenge briefs, YouTube title ideas, and thumbnail concepts tailored for your picked Pal.
        </p>

        {/* Pal Selector Bar */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          marginTop: '20px',
          flexWrap: 'wrap',
          background: 'rgba(0,0,0,0.3)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)'
        }}>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>Active Challenge Pal:</span>
          <select
            value={selectedPal.id}
            onChange={(e) => {
              const pal = palList.find(p => p.id === Number(e.target.value));
              if (pal) setSelectedPal(pal);
            }}
            style={{
              background: 'rgba(13, 18, 29, 0.9)',
              color: '#fff',
              border: '1px solid #00f0ff',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1rem'
            }}
          >
            {palList.map(pal => (
              <option key={pal.id} value={pal.id}>
                #{pal.id} {pal.name} ({pal.elements.join('/')}) - Tier: {pal.pindropTier || 'S'}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              const randomPal = palList[Math.floor(Math.random() * palList.length)];
              setSelectedPal(randomPal);
              sound.playClick();
            }}
            className="btn-gold"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            🎲 Randomize Pal
          </button>

          <button
            onClick={handleShuffle}
            className="btn-cyber"
            style={{ padding: '8px 16px', fontSize: '0.85rem', background: 'rgba(224, 64, 251, 0.2)', borderColor: '#e040fb', color: '#e040fb' }}
          >
            <RefreshCw size={14} /> Shuffle Rules & Titles
          </button>
        </div>
      </div>

      {/* Preset Selector Grid */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px' }}>1. Select Challenge Mode Preset</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {CHALLENGE_PRESETS.map(preset => {
          const isSelected = selectedPreset.id === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => {
                setSelectedPreset(preset);
                sound.playClick();
              }}
              className={`glass-panel ${isSelected ? 'glass-panel-glow' : ''}`}
              style={{
                padding: '20px',
                cursor: 'pointer',
                border: `1px solid ${isSelected ? '#00f0ff' : 'var(--border-glass)'}`,
                background: isSelected ? 'rgba(0, 240, 255, 0.1)' : 'var(--bg-card)'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{preset.icon}</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: isSelected ? '#00f0ff' : '#fff' }}>
                {preset.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                {preset.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Challenge Brief & Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Rules Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame color="#ff2a6d" /> Combat Challenge Ruleset Brief
            </h3>
            <button
              onClick={handleShuffle}
              style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> Re-roll
            </button>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#00f0ff', fontWeight: 800, textTransform: 'uppercase' }}>
              MAIN COMBAT OBJECTIVE
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
              {selectedPreset.title} using ONLY {selectedPal.name}!
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeRules.map((rule, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '0.9rem',
                color: '#cbd5e1',
                background: 'rgba(255,255,255,0.03)',
                padding: '10px',
                borderRadius: '8px',
                lineHeight: 1.4
              }}>
                <span style={{ color: '#ff2a6d', fontWeight: 900 }}>#{idx + 1}</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSetHudPal(selectedPal)}
            className="btn-cyber"
            style={{ width: '100%', marginTop: '20px', padding: '12px' }}
          >
            <Tv size={18} /> Send Rules & Pal to Streamer HUD
          </button>
        </div>

        {/* YouTube Titles Generator Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Video color="#ff0000" /> Viral YouTube Title Ideas
            </h3>
            <button
              onClick={handleShuffle}
              style={{ background: 'transparent', border: 'none', color: '#00f0ff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RefreshCw size={12} /> Re-roll
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeTitles.map((title, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-glass)',
                padding: '12px 16px',
                borderRadius: '10px'
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9' }}>
                  {title}
                </span>

                <button
                  onClick={() => copyToClipboard(title, idx)}
                  style={{
                    background: copiedTitleIndex === idx ? 'rgba(5, 255, 161, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${copiedTitleIndex === idx ? '#05ffa1' : 'var(--border-glass)'}`,
                    color: copiedTitleIndex === idx ? '#05ffa1' : '#94a3b8',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}
                >
                  {copiedTitleIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                  {copiedTitleIndex === idx ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail Concept Mockup Box */}
      <div className="glass-panel" style={{ padding: '28px', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>
          🎬 YouTube Thumbnail Concept Design
        </h3>

        <div style={{
          maxWidth: '600px',
          aspectRatio: '16/9',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #07090e 0%, #1a0b2e 100%)',
          borderRadius: '16px',
          border: '2px solid #00f0ff',
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '24px'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${selectedPal.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            filter: 'blur(4px)'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <span style={{
              background: '#ff2a6d',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 900,
              letterSpacing: '0.1em',
              display: 'inline-block',
              marginBottom: '12px'
            }}>
              {selectedPreset.title.toUpperCase()}
            </span>

            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', color: '#fff', textShadow: '0 0 20px #00f0ff', margin: 0 }}>
              ONLY {selectedPal.name.toUpperCase()}!
            </h2>

            <p style={{ color: '#ffd166', fontSize: '1.1rem', fontWeight: 800, marginTop: '8px' }}>
              CAN IT BEAT ALL 9 TOWER BOSSES?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
