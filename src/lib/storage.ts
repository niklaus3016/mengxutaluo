// Local offline storage utility for Tarot & Astrology

export interface TarotHistoryEntry {
  id: string;
  type: '塔罗';
  title: string;
  date: string;
  question: string;
  spreadName: string;
  result: string; // concise representation
  cards: Array<{
    cardId: string;
    isReversed: boolean;
    positionName: string;
  }>;
  analysis: {
    opening: string;
    overall: string;
    interpretations: Array<{
      cardName: string;
      position: string;
      element: string;
      meaning: string;
    }>;
    advice: string;
    actionPlan: string[];
    closing: string;
  };
}

export interface AstrologyHistoryEntry {
  id: string;
  type: '星盘';
  title: string;
  date: string;
  name: string;
  birthdate: string;
  time: string;
  sunSign: { name: string; enName: string; symbol: string; element: string; desc: string };
  moonSign: { name: string; enName: string; symbol: string; element: string; desc: string };
  risingSign: { name: string; enName: string; symbol: string; element: string; desc: string };
}

export const getTarotHistory = (): TarotHistoryEntry[] => {
  try {
    const val = localStorage.getItem('mystic_tarot_history');
    return val ? JSON.parse(val) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const saveTarotHistory = (entry: TarotHistoryEntry) => {
  try {
    const history = getTarotHistory();
    const newHistory = [entry, ...history].slice(0, 50); // limit to 50 items
    localStorage.setItem('mystic_tarot_history', JSON.stringify(newHistory));
  } catch (e) {
    console.error(e);
  }
};

export const getAstrologyHistory = (): AstrologyHistoryEntry[] => {
  try {
    const val = localStorage.getItem('mystic_astrology_history');
    return val ? JSON.parse(val) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const saveAstrologyHistory = (entry: AstrologyHistoryEntry) => {
  try {
    const history = getAstrologyHistory();
    const newHistory = [entry, ...history].slice(0, 50);
    localStorage.setItem('mystic_astrology_history', JSON.stringify(newHistory));
  } catch (e) {
    console.error(e);
  }
};

export const getFavoriteCardIds = (): string[] => {
  try {
    const val = localStorage.getItem('mystic_card_favorites');
    return val ? JSON.parse(val) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const toggleFavoriteCard = (cardId: string): boolean => {
  try {
    const favorites = getFavoriteCardIds();
    const idx = favorites.indexOf(cardId);
    let isFav = false;
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(cardId);
      isFav = true;
    }
    localStorage.setItem('mystic_card_favorites', JSON.stringify(favorites));
    return isFav;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getResonanceDays = (): number => {
  try {
    const start = localStorage.getItem('mystic_first_resonance');
    if (!start) {
      const now = Date.now().toString();
      localStorage.setItem('mystic_first_resonance', now);
      return 1;
    }
    const diffMs = Date.now() - parseInt(start);
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return days > 0 ? days : 1;
  } catch (e) {
    return 1;
  }
};

export const clearLocalStorageData = () => {
  try {
    localStorage.removeItem('mystic_tarot_history');
    localStorage.removeItem('mystic_astrology_history');
    localStorage.removeItem('mystic_card_favorites');
    localStorage.removeItem('mystic_first_resonance');
    localStorage.setItem('mystic_first_resonance', Date.now().toString());
  } catch (e) {
    console.error(e);
  }
};
