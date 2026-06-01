export const GUEST_FAVORITES_KEY = 'quant_navigator_guest_favorites';
export const PINNED_SITES_KEY = 'quant_navigator_pinned_sites';
export const WORKFLOW_FAVORITES_KEY = 'quant_navigator_workflow_favorites';
export const LEGACY_FAVORITES_KEY = 'quant-navigator:favorites';

export const LOCAL_STORAGE_KEYS = [
  GUEST_FAVORITES_KEY,
  PINNED_SITES_KEY,
  WORKFLOW_FAVORITES_KEY,
  LEGACY_FAVORITES_KEY,
] as const;

const getStoredStringArray = (key: string): string[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = window.localStorage.getItem(key);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

const saveStoredStringArray = (key: string, ids: Iterable<string>) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify([...ids]));
};

export const getFavoriteSiteIds = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  return window.localStorage.getItem(GUEST_FAVORITES_KEY)
    ? getStoredStringArray(GUEST_FAVORITES_KEY)
    : getStoredStringArray(LEGACY_FAVORITES_KEY);
};

export const saveFavoriteSiteIds = (ids: Iterable<string>) => {
  saveStoredStringArray(GUEST_FAVORITES_KEY, ids);
};

export const getPinnedSiteIds = (): string[] => {
  return getStoredStringArray(PINNED_SITES_KEY);
};

export const savePinnedSiteIds = (ids: Iterable<string>) => {
  saveStoredStringArray(PINNED_SITES_KEY, ids);
};

export const getWorkflowFavoriteIds = (): string[] => {
  return getStoredStringArray(WORKFLOW_FAVORITES_KEY);
};

export const saveWorkflowFavoriteIds = (ids: Iterable<string>) => {
  saveStoredStringArray(WORKFLOW_FAVORITES_KEY, ids);
};

export const clearAllLocalSettings = () => {
  if (typeof window === 'undefined') {
    return;
  }

  LOCAL_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
};
