export const GUEST_FAVORITES_KEY = 'quant_navigator_guest_favorites';
export const PINNED_SITES_KEY = 'quant_navigator_pinned_sites';
const LEGACY_FAVORITES_KEY = 'quant-navigator:favorites';

export const getFavoriteSiteIds = (): string[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

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
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify([...ids]));
};

export const getPinnedSiteIds = (): string[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = window.localStorage.getItem(PINNED_SITES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

export const savePinnedSiteIds = (ids: Iterable<string>) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(PINNED_SITES_KEY, JSON.stringify([...ids]));
};
