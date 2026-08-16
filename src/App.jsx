import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PalWheel from './components/PalWheel';
import PalSlotMachine from './components/PalSlotMachine';
import MasteredVault from './components/MasteredVault';
import ChallengeGenerator from './components/ChallengeGenerator';
import StreamOverlayHUD from './components/StreamOverlayHUD';
import PaldexExplorer from './components/PaldexExplorer';

import {
  getMasteredVault,
  saveMasteredVault,
  toggleVaultPal,
  clearMasteredVault,
  getEliminationMode,
  saveEliminationMode,
  getCustomPals,
  saveCustomPal,
  deleteCustomPal
} from './utils/storage';
import { PALS_DATA } from './data/palsData';

export default function App() {
  const [activeTab, setActiveTab] = useState('wheel');
  const [masteredVault, setMasteredVault] = useState(getMasteredVault());
  const [eliminationMode, setEliminationMode] = useState(getEliminationMode());
  const [customPals, setCustomPals] = useState(getCustomPals());
  const [muted, setMuted] = useState(false);

  // Combine standard dataset + user custom added Pals
  const allPals = [...PALS_DATA, ...customPals];
  const [activePal, setActivePal] = useState(allPals[0]);

  // Persist mastered vault changes
  const handleToggleVault = (palId) => {
    const updated = toggleVaultPal(palId);
    setMasteredVault(updated);
  };

  const handleClearVault = () => {
    const updated = clearMasteredVault();
    setMasteredVault(updated);
  };

  const handleSetVault = (newVault) => {
    saveMasteredVault(newVault);
    setMasteredVault(newVault);
  };

  const handleAddCustomPal = (newPal) => {
    const updated = saveCustomPal(newPal);
    setCustomPals(updated);
  };

  const handleDeleteCustomPal = (palId) => {
    const updated = deleteCustomPal(palId);
    setCustomPals(updated);
  };

  const handleEliminationModeChange = (val) => {
    setEliminationMode(val);
    saveEliminationMode(val);
  };

  const handleSelectPalForChallenge = (pal) => {
    setActivePal(pal);
    setActiveTab('generator');
  };

  const handleSetHudPal = (pal) => {
    setActivePal(pal);
    setActiveTab('hud');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        masteredCount={masteredVault.length}
        muted={muted}
        setMuted={setMuted}
        eliminationMode={eliminationMode}
        setEliminationMode={handleEliminationModeChange}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {activeTab === 'wheel' && (
          <PalWheel
            masteredVault={masteredVault}
            onToggleVault={handleToggleVault}
            onSelectPalForChallenge={handleSelectPalForChallenge}
            onSetHudPal={handleSetHudPal}
            allPals={allPals}
          />
        )}

        {activeTab === 'slot' && (
          <PalSlotMachine
            masteredVault={masteredVault}
            onToggleVault={handleToggleVault}
            onSelectPalForChallenge={handleSelectPalForChallenge}
            onSetHudPal={handleSetHudPal}
            allPals={allPals}
          />
        )}

        {activeTab === 'vault' && (
          <MasteredVault
            masteredVault={masteredVault}
            onToggleVault={handleToggleVault}
            onClearVault={handleClearVault}
            onSetVault={handleSetVault}
            onAddCustomPal={handleAddCustomPal}
            allPals={allPals}
          />
        )}

        {activeTab === 'generator' && (
          <ChallengeGenerator
            initialPal={activePal}
            onSetHudPal={handleSetHudPal}
            allPals={allPals}
          />
        )}

        {activeTab === 'hud' && (
          <StreamOverlayHUD
            activePal={activePal}
            masteredVault={masteredVault}
            onToggleVault={handleToggleVault}
          />
        )}

        {activeTab === 'paldex' && (
          <PaldexExplorer
            masteredVault={masteredVault}
            onToggleVault={handleToggleVault}
            onSelectPalForChallenge={handleSelectPalForChallenge}
            onSetHudPal={handleSetHudPal}
            customPals={customPals}
            onAddCustomPal={handleAddCustomPal}
            onDeleteCustomPal={handleDeleteCustomPal}
            allPals={allPals}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        borderTop: '1px solid var(--border-glass)',
        color: '#94a3b8',
        fontSize: '0.85rem'
      }}>
        PALWORLD CHALLENGE HUB &copy; {new Date().getFullYear()} &bull; Built for Content Creators & Streamers
      </footer>
    </div>
  );
}
