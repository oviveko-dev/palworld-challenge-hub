import React, { useState, useEffect, useRef } from 'react';
import { ELEMENTS, DIFFICULTY_TIERS, PALS_DATA } from '../data/palsData';
import { sound } from '../utils/audio';
import { ShieldCheck, RotateCw, Sparkles, Filter, ShieldAlert, Award, Tv, Flame, X, Plus, Trash2, Info, Trophy, Zap, Crosshair } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PalWheel({ masteredVault, onToggleVault, onSelectPalForChallenge, onSetHudPal, allPals }) {
  const [selectedElement, setSelectedElement] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSpecialFilters, setSelectedSpecialFilters] = useState(['All']);
  const [activeTagFilters, setActiveTagFilters] = useState([]);
  const [excludeVaulted, setExcludeVaulted] = useState(true);
  const [excludeMasteredOnly, setExcludeMasteredOnly] = useState(false);
  const [customExcludedPals, setCustomExcludedPals] = useState([]);
  const [isExcludeModalOpen, setIsExcludeModalOpen] = useState(false);
  const [excludeSearchQuery, setExcludeSearchQuery] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerPal, setWinnerPal] = useState(null);
  const [recentSpins, setRecentSpins] = useState([]);
  const [challengeCount, setChallengeCount] = useState(0);

  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const spinReqRef = useRef(null);

  const palList = allPals || PALS_DATA;

  // Set default winner pal to Lamball on initial app start
  useEffect(() => {
    const lamball = palList.find(p => p.name === 'Lamball') || palList[0];
    setWinnerPal(lamball);
    setRecentSpins([
      palList.find(p => p.name === 'Cattiva') || palList[1],
      palList.find(p => p.name === 'Chillet') || palList[2],
      palList.find(p => p.name === 'Tanzee') || palList[3],
      lamball
    ]);
  }, [palList]);

  // Helper to check if a pal matches a set of special filter keys
  const checkPalMatchesSpecialFilters = (pal, filters) => {
    if (!filters || filters.length === 0 || filters.includes('All')) return true;

    const selectedTiers = filters.filter(f => ['S+', 'S', 'A', 'B', 'C'].includes(f));
    const selectedCategories = filters.filter(f => !['S+', 'S', 'A', 'B', 'C', 'All'].includes(f));

    if (selectedTiers.length > 0) {
      if (!selectedTiers.includes(pal.pindropTier)) return false;
    }

    for (const cat of selectedCategories) {
      if (cat === 'Weakest' && !(pal.isMemeFilter || pal.difficulty === 'C')) return false;
      if (cat === 'Trolling' && !pal.isTrollFilter) return false;
      if (cat === 'GunUsers' && !pal.isGunUser) return false;
      if (cat === 'Explosive' && !pal.isExplosive) return false;
      if (cat === 'FunnySkills' && !pal.isFunnySkill) return false;
      if (cat === 'Collab' && !pal.isCollab) return false;
    }

    return true;
  };

  // Filter pals based on criteria & mastered vault & custom exclusions
  const eligiblePals = palList.filter(pal => {
    if (excludeVaulted && masteredVault.includes(pal.id)) return false;
    if (customExcludedPals.includes(pal.id)) return false;
    if (selectedElement !== 'All' && !pal.elements.includes(selectedElement)) return false;
    if (!checkPalMatchesSpecialFilters(pal, selectedSpecialFilters)) return false;

    // Check active tag filters
    if (activeTagFilters.includes('Gun Users') && !pal.isGunUser) return false;
    if (activeTagFilters.includes('Explosive') && !pal.isExplosive) return false;

    return true;
  });

  // Calculate pool breakdown counts
  const totalCount = eligiblePals.length;
  const gunUsersCount = eligiblePals.filter(p => p.isGunUser).length;
  const explosiveCount = eligiblePals.filter(p => p.isExplosive).length;
  const funnySkillsCount = eligiblePals.filter(p => p.isFunnySkill).length;

  // Draw the Wheel on canvas whenever eligiblePals or canvas size updates
  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [eligiblePals, selectedElement, selectedSpecialFilters, activeTagFilters, excludeVaulted]);

  const drawWheel = (angleOffset = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 12;

    ctx.clearRect(0, 0, width, height);

    if (eligiblePals.length === 0) {
      ctx.fillStyle = 'rgba(255, 42, 109, 0.15)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff2a6d';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#ff2a6d';
      ctx.font = 'bold 18px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No Pals Available!', centerX, centerY - 10);
      ctx.font = '13px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('All matching Pals are vaulted or filtered out.', centerX, centerY + 15);
      return;
    }

    const arc = (Math.PI * 2) / eligiblePals.length;

    eligiblePals.forEach((pal, idx) => {
      const startAngle = angleOffset + idx * arc;
      const endAngle = startAngle + arc;
      const primaryElement = pal.elements[0];
      const elemData = ELEMENTS[primaryElement] || ELEMENTS.Neutral;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      const grad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, radius);
      grad.addColorStop(0, elemData.bg);
      grad.addColorStop(1, elemData.color + 'cc');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(13, 18, 29, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = eligiblePals.length > 25 ? 'bold 10px Inter' : 'bold 12px Outfit';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText(`${elemData.icon} ${pal.name}`, radius - 16, 4);
      ctx.restore();
    });

    // Outer wheel glowing neon ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 20;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center cap button
    ctx.beginPath();
    ctx.arc(centerX, centerY, 52, 0, Math.PI * 2);
    ctx.fillStyle = '#07090e';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 18px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY - 7);

    ctx.fillStyle = '#00f0ff';
    ctx.font = '800 9px Inter';
    ctx.fillText('THE WHEEL', centerX, centerY + 11);
  };

  const spinWheel = () => {
    if (isSpinning || eligiblePals.length === 0) return;

    setIsSpinning(true);
    sound.playClick();

    const totalRotation = Math.PI * 2 * (6 + Math.random() * 6);
    const duration = 4500;
    const startTime = performance.now();
    const startAngle = currentAngleRef.current;

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + totalRotation * easeOut;
      currentAngleRef.current = currentAngle;

      drawWheel(currentAngle);

      // Procedural Web Audio Tick
      const arc = (Math.PI * 2) / eligiblePals.length;
      const prevSegment = Math.floor((startAngle) / arc);
      const currentSegment = Math.floor((currentAngle) / arc);
      if (currentSegment > prevSegment) {
        sound.playTick();
      }

      if (progress < 1) {
        spinReqRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const finalAngleNormalized = (currentAngleRef.current % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const pointerAngle = (Math.PI * 1.5 - finalAngleNormalized + Math.PI * 2) % (Math.PI * 2);
        const winningIndex = Math.floor(pointerAngle / arc) % eligiblePals.length;
        const winner = eligiblePals[winningIndex];

        setWinnerPal(winner);
        setRecentSpins(prev => [winner, ...prev.slice(0, 3)]);
        sound.playVictory();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };

    spinReqRef.current = requestAnimationFrame(animate);
  };

  const toggleSidebarFilter = (key) => {
    sound.playClick();
    if (key === 'All') {
      setSelectedSpecialFilters(['All']);
      return;
    }

    setSelectedSpecialFilters(prev => {
      let updated = prev.filter(f => f !== 'All');
      if (updated.includes(key)) {
        updated = updated.filter(f => f !== key);
      } else {
        updated = [...updated, key];
      }
      if (updated.length === 0) return ['All'];
      return updated;
    });
  };

  const removeSpecialFilterTag = (key) => {
    sound.playClick();
    setSelectedSpecialFilters(prev => {
      const updated = prev.filter(f => f !== key);
      if (updated.length === 0) return ['All'];
      return updated;
    });
  };

  const clearAllFilters = () => {
    setSelectedElement('All');
    setSelectedDifficulty('All');
    setSelectedSpecialFilters(['All']);
    setActiveTagFilters([]);
    setCustomExcludedPals([]);
    sound.playClick();
  };

  const getPalCountForFilter = (filterKey) => {
    return palList.filter(pal => {
      if (excludeVaulted && masteredVault.includes(pal.id)) return false;
      if (customExcludedPals.includes(pal.id)) return false;
      if (selectedElement !== 'All' && !pal.elements.includes(selectedElement)) return false;
      return checkPalMatchesSpecialFilters(pal, [filterKey]);
    }).length;
  };

  const winnerElemData = winnerPal ? (ELEMENTS[winnerPal.elements[0]] || ELEMENTS.Neutral) : ELEMENTS.Neutral;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '16px 20px' }}>
      
      {/* Centered Page Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '0.05em',
          margin: 0,
          textShadow: '0 0 25px rgba(0, 240, 255, 0.5)'
        }}>
          WHEEL OF <span className="gradient-text">PALS</span>
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
          Spin to pick your challenge Pal! Filter by Element, Tier, or Special Filter.
        </p>
      </div>

      {/* Top Filter Controls Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        marginBottom: '20px',
        border: '1px solid var(--border-glass)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          {/* Left Checkboxes & Exclude Button */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: '#ff2a6d' }}>
              <input
                type="checkbox"
                checked={excludeVaulted}
                onChange={(e) => setExcludeVaulted(e.target.checked)}
                style={{ accentColor: '#ff2a6d', width: '16px', height: '16px' }}
              />
              Exclude Strongest / Mastered
            </label>

            <button
              onClick={() => {
                sound.playClick();
                setIsExcludeModalOpen(true);
              }}
              style={{
                background: customExcludedPals.length > 0 ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${customExcludedPals.length > 0 ? '#ff2a6d' : 'var(--border-glass)'}`,
                color: customExcludedPals.length > 0 ? '#ff2a6d' : '#cbd5e1',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldAlert size={14} color={customExcludedPals.length > 0 ? '#ff2a6d' : '#cbd5e1'} />
              <span>🚫 Exclude Pals {customExcludedPals.length > 0 && `(${customExcludedPals.length})`}</span>
            </button>
          </div>

          {/* Center Quick Dropdowns & Icon Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            
            {/* Element Dropdown & Quick Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>ELEMENT</span>
              <select
                value={selectedElement}
                onChange={(e) => setSelectedElement(e.target.value)}
                style={{
                  background: 'rgba(13, 18, 29, 0.9)',
                  color: '#fff',
                  border: '1px solid var(--border-glass)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <option value="All">All Elements</option>
                {Object.keys(ELEMENTS).map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>

              {/* Element Icon Badges */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {Object.keys(ELEMENTS).map(elem => (
                  <button
                    key={elem}
                    onClick={() => setSelectedElement(selectedElement === elem ? 'All' : elem)}
                    style={{
                      background: selectedElement === elem ? ELEMENTS[elem].bg : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedElement === elem ? ELEMENTS[elem].border : 'rgba(255,255,255,0.1)'}`,
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}
                    title={elem}
                  >
                    {ELEMENTS[elem].icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Filter Dropdown & Quick Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>TIER</span>
              <select
                value={selectedSpecialFilters.find(f => ['S+', 'S', 'A', 'B', 'C'].includes(f)) || 'All'}
                onChange={(e) => toggleSidebarFilter(e.target.value)}
                style={{
                  background: 'rgba(13, 18, 29, 0.9)',
                  color: '#fff',
                  border: '1px solid var(--border-glass)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
              >
                <option value="All">All Tiers</option>
                <option value="S+">S+ Tier (Meta / Endgame)</option>
                <option value="S">S Tier (High Combat)</option>
                <option value="A">A Tier (Solid)</option>
                <option value="B">B Tier (Below Average)</option>
                <option value="C">C Tier (Bottom 10%)</option>
              </select>

              {/* Quick Tier Pills */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {['S+', 'S', 'A', 'B', 'C'].map(t => {
                  const isSelected = selectedSpecialFilters.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleSidebarFilter(t)}
                      style={{
                        background: isSelected ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? '#00f0ff' : 'rgba(255,255,255,0.1)'}`,
                        color: isSelected ? '#00f0ff' : '#cbd5e1',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Available Pals Count Badge */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: 800
          }}>
            {eligiblePals.length} Pals Available
          </div>
        </div>

        {/* Active Filters Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em' }}>ACTIVE FILTERS</span>
            
            {selectedElement !== 'All' && (
              <span style={{
                background: 'rgba(0, 240, 255, 0.2)',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                🔥 {selectedElement}
                <X size={14} style={{ cursor: 'pointer' }} onClick={() => setSelectedElement('All')} />
              </span>
            )}

            {!selectedSpecialFilters.includes('All') && selectedSpecialFilters.map(filterKey => {
              const labelMap = {
                'S+': 'S+ Tier',
                'S': 'S Tier',
                'A': 'A Tier',
                'B': 'B Tier',
                'C': 'C Tier',
                'Weakest': 'Weakest Pals Only',
                'Trolling': 'Trolling / Chaotic',
                'GunUsers': 'Gun Users',
                'Explosive': 'Explosive / Rocket',
                'FunnySkills': 'Funny Partner Skills',
                'Collab': 'Collaboration Pals'
              };
              return (
                <span key={filterKey} style={{
                  background: 'rgba(224, 64, 251, 0.2)',
                  border: '1px solid #e040fb',
                  color: '#e040fb',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ✨ {labelMap[filterKey] || filterKey}
                  <X size={14} style={{ cursor: 'pointer' }} onClick={() => removeSpecialFilterTag(filterKey)} />
                </span>
              );
            })}

            {selectedElement === 'All' && selectedSpecialFilters.includes('All') && (
              <span style={{ color: '#64748b', fontSize: '0.8rem', fontStyle: 'italic' }}>
                Showing All Pals (Select multiple filters in sidebar)
              </span>
            )}
          </div>

          <button
            onClick={clearAllFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ff2a6d',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Dashboard Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr 340px',
        gap: '20px',
        alignItems: 'start',
        marginBottom: '20px'
      }}>
        
        {/* LEFT COLUMN: SPECIAL FILTERS SIDEBAR */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#00f0ff', letterSpacing: '0.05em' }}>
              SPECIAL FILTERS
            </span>
            <span style={{ fontSize: '0.7rem', color: '#e040fb', fontWeight: 800 }}>
              (MULTI-SELECT)
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'All', label: 'All Pals', icon: '🌐' },
              { id: 'S+', label: 'S+ Tier', icon: '🏆' },
              { id: 'S', label: 'S Tier', icon: '⚔️' },
              { id: 'A', label: 'A Tier', icon: '🟢' },
              { id: 'B', label: 'B Tier', icon: '🔵' },
              { id: 'C', label: 'C Tier', icon: '🟡' },
              { id: 'Weakest', label: 'Weakest Pals Only', icon: '💀' },
              { id: 'Trolling', label: 'Trolling / Chaotic', icon: '🤡', highlight: true },
              { id: 'GunUsers', label: 'Gun Users', icon: '🔫' },
              { id: 'Explosive', label: 'Explosive / Rocket', icon: '💥' },
              { id: 'FunnySkills', label: 'Funny Partner Skills', icon: '😂' },
              { id: 'Collab', label: 'Collaboration Pals', icon: '🤝' }
            ].map(item => {
              const isSelected = selectedSpecialFilters.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleSidebarFilter(item.id)}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(90deg, rgba(224, 64, 251, 0.3) 0%, rgba(224, 64, 251, 0.08) 100%)'
                      : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? '#e040fb' : 'rgba(255,255,255,0.05)'}`,
                    boxShadow: isSelected ? '0 0 12px rgba(224, 64, 251, 0.25)' : 'none',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#fff' : '#cbd5e1' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{ accentColor: '#e040fb', cursor: 'pointer', width: '14px', height: '14px' }}
                    />
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span style={{
                    background: isSelected ? '#e040fb' : 'rgba(255,255,255,0.08)',
                    color: isSelected ? '#fff' : '#94a3b8',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontSize: '0.75rem',
                    fontWeight: 800
                  }}>
                    {getPalCountForFilter(item.id)}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} /> Pals can appear in multiple special filters.
          </div>
        </div>

        {/* MIDDLE COLUMN: WHEEL CANVAS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Wheel Pointer Triangle */}
          <div style={{
            position: 'absolute',
            top: '-12px',
            zIndex: 10,
            width: 0,
            height: 0,
            borderLeft: '16px solid transparent',
            borderRight: '16px solid transparent',
            borderTop: '28px solid #ff2a6d',
            filter: 'drop-shadow(0 0 10px #ff2a6d)'
          }} />

          {/* HTML5 Wheel Canvas */}
          <canvas
            ref={canvasRef}
            width={480}
            height={480}
            onClick={spinWheel}
            style={{
              cursor: isSpinning ? 'wait' : 'pointer',
              borderRadius: '50%',
              boxShadow: '0 0 35px rgba(0, 240, 255, 0.35)',
              transition: 'transform 0.1s ease'
            }}
          />
        </div>

        {/* RIGHT COLUMN: YOUR CHALLENGE PAL CARD */}
        <div className="glass-panel glass-panel-glow" style={{
          padding: '20px',
          borderRadius: '20px',
          border: `2px solid ${winnerElemData.border || '#00f0ff'}`,
          background: 'linear-gradient(135deg, rgba(13, 18, 29, 0.95) 0%, rgba(7, 9, 14, 0.95) 100%)',
          boxShadow: `0 0 30px ${winnerElemData.glow || 'rgba(0, 240, 255, 0.3)'}`
        }}>
          {/* Card Header */}
          <div style={{ textAlign: 'center', color: '#ffd166', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.08em', marginBottom: '14px' }}>
            ★ YOUR CHALLENGE PAL ★
          </div>

          {winnerPal ? (
            <div>
              {/* Pal Hero Artwork Image Box */}
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: '16px',
                background: winnerElemData.bg || 'rgba(0,240,255,0.1)',
                border: `2px solid ${winnerElemData.border || '#00f0ff'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '14px',
                boxShadow: `0 0 25px ${winnerElemData.glow || 'rgba(0,240,255,0.3)'}`
              }}>
                <img
                  src={winnerPal.image}
                  alt={winnerPal.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.4))' }}
                />
              </div>

              {/* Pal Name */}
              <h2 style={{ fontSize: '2rem', fontWeight: 900, textAlign: 'center', margin: '0 0 10px' }}>
                {winnerPal.name}
              </h2>

              {/* Element & Tier Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="badge-element" style={{ background: winnerElemData.bg, color: winnerElemData.color, borderColor: winnerElemData.border }}>
                  {winnerElemData.icon} {winnerPal.elements[0].toUpperCase()}
                </span>
                <span className="badge-difficulty" style={{ background: 'rgba(255, 42, 109, 0.2)', color: '#ff2a6d', borderColor: '#ff2a6d' }}>
                  {winnerPal.pindropTier ? `${winnerPal.pindropTier} TIER` : 'S TIER'}
                </span>
              </div>

              {/* Special Tag Badges */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
                {winnerPal.isGunUser && (
                  <span style={{ background: 'rgba(255, 42, 109, 0.15)', border: '1px solid #ff2a6d', color: '#ff2a6d', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    🔫 GUN USER
                  </span>
                )}
                {winnerPal.isTrollFilter && (
                  <span style={{ background: 'rgba(224, 64, 251, 0.15)', border: '1px solid #e040fb', color: '#e040fb', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                    😈 CHAOTIC
                  </span>
                )}
              </div>

              {/* Partner Skill Box */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', padding: '12px', borderRadius: '12px', marginBottom: '12px' }}>
                <div style={{ color: '#ffd166', fontWeight: 800, fontSize: '0.8rem', marginBottom: '4px' }}>
                  Partner Skill: {winnerPal.partnerSkill ? winnerPal.partnerSkill.split(':')[0] : 'Special Power'}
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  {winnerPal.partnerSkill || winnerPal.description}
                </div>
              </div>

              {/* Challenge Idea Box */}
              <div style={{ background: 'rgba(0, 240, 255, 0.08)', border: '1px solid rgba(0, 240, 255, 0.3)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ color: '#00f0ff', fontWeight: 800, fontSize: '0.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} /> CHALLENGE IDEA
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.8rem', lineHeight: 1.4 }}>
                  Defeat a Tower Boss using only this Pal as your main combat Pal.
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className="btn-cyber"
                  style={{ padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
                >
                  <RotateCw size={16} /> SPIN AGAIN
                </button>

                <button
                  onClick={() => {
                    sound.playClick();
                    onSelectPalForChallenge(winnerPal);
                  }}
                  className="btn-cyber"
                  style={{ padding: '10px', fontSize: '0.85rem', justifyContent: 'center', background: 'rgba(224, 64, 251, 0.2)', borderColor: '#e040fb', color: '#e040fb' }}
                >
                  🎲 CHALLENGE
                </button>
              </div>

              {/* Quick Exclude Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  if (!customExcludedPals.includes(winnerPal.id)) {
                    setCustomExcludedPals(prev => [...prev, winnerPal.id]);
                  }
                }}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  background: customExcludedPals.includes(winnerPal.id) ? 'rgba(255, 42, 109, 0.25)' : 'rgba(255, 42, 109, 0.08)',
                  border: '1px solid #ff2a6d',
                  color: '#ff2a6d',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ShieldAlert size={14} />
                <span>{customExcludedPals.includes(winnerPal.id) ? 'Excluded from Spins' : `Exclude ${winnerPal.name} from Spins`}</span>
              </button>
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>
              Click SPIN to pick a Pal!
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM ROW: STATS & POOL BREAKDOWN */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {/* Box 1: CURRENT POOL */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#00f0ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🐾 CURRENT POOL
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>
            {eligiblePals.length} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>PALS</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Filtered from 299 total
          </div>
        </div>

        {/* Box 2: POOL BREAKDOWN */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
            POOL BREAKDOWN
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <div>
              <span style={{ color: '#ff2a6d', fontWeight: 800 }}>🔫 {gunUsersCount}</span>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>GUN USERS</div>
            </div>

            <div>
              <span style={{ color: '#ffb74d', fontWeight: 800 }}>💥 {explosiveCount}</span>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>EXPLOSIVE</div>
            </div>

            <div>
              <span style={{ color: '#e040fb', fontWeight: 800 }}>😂 {funnySkillsCount}</span>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FUNNY SKILLS</div>
            </div>

            <div>
              <span style={{ color: '#00f0ff', fontWeight: 800 }}>💀 {totalCount}</span>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TOTAL</div>
            </div>
          </div>
        </div>

        {/* Box 3: RECENT SPINS */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>
            RECENT SPINS
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {recentSpins.map((rPal, idx) => (
              <div key={idx} style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(0, 240, 255, 0.15)',
                border: '1.5px solid #00f0ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '2px'
              }} title={rPal.name}>
                <img src={rPal.image} alt={rPal.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Box 4: QUICK STATS */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#00f0ff' }}>299</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>TOTAL PALS</div>
            </div>

            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#05ffa1' }}>{masteredVault.length}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>MASTERED</div>
            </div>

            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffb74d' }}>{299 - masteredVault.length}</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>REMAINING</div>
            </div>

            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffd166', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
                🏆 {challengeCount}
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>COMPLETED</div>
            </div>
          </div>
        </div>

      </div>

      {/* PAL EXCLUDER MODAL */}
      {isExcludeModalOpen && (
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
            border: '1px solid #ff2a6d',
            boxShadow: '0 0 40px rgba(255, 42, 109, 0.3)',
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
                <ShieldAlert color="#ff2a6d" size={24} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>
                    EXCLUDE SPECIFIC PALS FROM WHEEL
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                    Checkmark Pals you do NOT want to appear in wheel spins
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExcludeModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Bar & Counter */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search Pal by name to exclude..."
                value={excludeSearchQuery}
                onChange={(e) => setExcludeSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.9rem'
                }}
              />

              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ff2a6d', whiteSpace: 'nowrap' }}>
                {customExcludedPals.length} Excluded
              </span>

              {customExcludedPals.length > 0 && (
                <button
                  onClick={() => setCustomExcludedPals([])}
                  style={{
                    background: 'rgba(255, 42, 109, 0.15)',
                    border: '1px solid #ff2a6d',
                    color: '#ff2a6d',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Grid of Pals */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
              {palList
                .filter(p => p.name.toLowerCase().includes(excludeSearchQuery.toLowerCase()))
                .map(pal => {
                  const isExcluded = customExcludedPals.includes(pal.id);
                  return (
                    <div
                      key={pal.id}
                      onClick={() => {
                        sound.playClick();
                        setCustomExcludedPals(prev =>
                          isExcluded ? prev.filter(id => id !== pal.id) : [...prev, pal.id]
                        );
                      }}
                      style={{
                        background: isExcluded ? 'rgba(255, 42, 109, 0.2)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isExcluded ? '#ff2a6d' : 'rgba(255,255,255,0.08)'}`,
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
                        style={{ width: '48px', height: '48px', objectFit: 'contain', opacity: isExcluded ? 0.4 : 1 }}
                      />
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: isExcluded ? '#ff2a6d' : '#fff', textAlign: 'center', wordBreak: 'break-word' }}>
                        {pal.name}
                      </div>
                      <span style={{
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: isExcluded ? '#ff2a6d' : 'rgba(255,255,255,0.1)',
                        color: '#fff'
                      }}>
                        {isExcluded ? 'EXCLUDED' : 'ACTIVE'}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'flex-end', background: 'rgba(13, 18, 29, 0.9)' }}>
              <button
                onClick={() => setIsExcludeModalOpen(false)}
                className="btn-cyber"
                style={{ padding: '8px 24px' }}
              >
                DONE ({eligiblePals.length} Pals in Wheel)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
