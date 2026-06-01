export const GUEST_FAVORITES_KEY = 'quant_navigator_guest_favorites';
const LEGACY_FAVORITES_KEY = 'quant-navigator:favorites';

export const getFavoriteSiteIds = (): string[] => {
  try {
    const stored =
      window.localStorage.getItem(GUEST_FAVORITES_KEY) ??
      window.localStorage.getItem(LEGACY_FAVORITES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

export const saveFavoriteSiteIds = (ids: Iterable<string>) => {
  window.localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify([...ids]));
};
