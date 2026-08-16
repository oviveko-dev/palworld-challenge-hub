// LocalStorage Manager for Vault, HUD State, Custom Pals, and Settings

const STORAGE_KEYS = {
  MASTERED_VAULT: 'pal_challenge_mastered_vault',
  SAVED_CHALLENGES: 'pal_challenge_saved_challenges',
  HUD_STATE: 'pal_challenge_hud_state',
  ELIMINATION_MODE: 'pal_challenge_elimination_mode',
  CUSTOM_PALS: 'pal_challenge_custom_pals'
};

export const getMasteredVault = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MASTERED_VAULT);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveMasteredVault = (vaultIds) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MASTERED_VAULT, JSON.stringify(vaultIds));
  } catch (e) {
    console.error('Failed to save vault to storage', e);
  }
};

export const toggleVaultPal = (palId) => {
  const current = getMasteredVault();
  let updated;
  if (current.includes(palId)) {
    updated = current.filter(id => id !== palId);
  } else {
    updated = [...current, palId];
  }
  saveMasteredVault(updated);
  return updated;
};

export const clearMasteredVault = () => {
  saveMasteredVault([]);
  return [];
};

export const getEliminationMode = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ELIMINATION_MODE);
    return data ? JSON.parse(data) : false;
  } catch (e) {
    return false;
  }
};

export const saveEliminationMode = (val) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ELIMINATION_MODE, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to save elimination mode', e);
  }
};

export const getCustomPals = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_PALS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomPal = (newPal) => {
  try {
    const current = getCustomPals();
    const updated = [...current, newPal];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PALS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save custom Pal', e);
    return [];
  }
};

export const deleteCustomPal = (palId) => {
  try {
    const current = getCustomPals();
    const updated = current.filter(p => p.id !== palId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_PALS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete custom Pal', e);
    return [];
  }
};

export const getHUDState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HUD_STATE);
    return data ? JSON.parse(data) : {
      deaths: 0,
      towers: { rayne: false, alliance: false, pidf: false, pyre: false, genetic: false },
      seconds: 0,
      activePalId: null,
      challengeTitle: 'Palworld 100 Days Challenge'
    };
  } catch (e) {
    return {
      deaths: 0,
      towers: { rayne: false, alliance: false, pidf: false, pyre: false, genetic: false },
      seconds: 0,
      activePalId: null,
      challengeTitle: 'Palworld 100 Days Challenge'
    };
  }
};

export const saveHUDState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEYS.HUD_STATE, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save HUD state', e);
  }
};
