import {
  accessTags,
  categories,
  markets,
  type AccessTag,
  type Category,
  type Market,
  type Priority,
} from '../data/markets';
import type { CustomShortcut } from '../data/sites';

export const GUEST_FAVORITES_KEY = 'quant_navigator_guest_favorites';
export const PINNED_SITES_KEY = 'quant_navigator_pinned_sites';
export const WORKFLOW_FAVORITES_KEY = 'quant_navigator_workflow_favorites';
export const CUSTOM_SHORTCUTS_KEY = 'quant_navigator_custom_shortcuts';
export const LEGACY_FAVORITES_KEY = 'quant-navigator:favorites';

export const LOCAL_STORAGE_KEYS = [
  GUEST_FAVORITES_KEY,
  PINNED_SITES_KEY,
  WORKFLOW_FAVORITES_KEY,
  CUSTOM_SHORTCUTS_KEY,
  LEGACY_FAVORITES_KEY,
] as const;

const priorities: Priority[] = ['core', 'useful', 'optional'];
const validMarkets = markets.filter((market): market is Market => market !== '全部');

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isHttpUrl = (value: string) => /^https?:\/\//i.test(value.trim());

const toOptionalString = (value: unknown) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const toStringList = (value: unknown) =>
  isStringArray(value)
    ? [...new Set(value.map((item) => item.trim()).filter(Boolean))]
    : [];

const toAccessList = (value: unknown) =>
  toStringList(value).filter((item): item is AccessTag =>
    accessTags.includes(item as AccessTag),
  );

export const normalizeCustomShortcut = (value: unknown): CustomShortcut | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = toOptionalString(value.id);
  const name = toOptionalString(value.name);
  const nameZh = toOptionalString(value.nameZh);
  const url = toOptionalString(value.url);
  const market = value.market;
  const category = value.category;
  const priority = value.priority;

  if (!id || (!name && !nameZh) || !url || !isHttpUrl(url)) {
    return null;
  }

  if (!validMarkets.includes(market as Market)) {
    return null;
  }

  if (!categories.includes(category as Category)) {
    return null;
  }

  if (!priorities.includes(priority as Priority)) {
    return null;
  }

  const createdAt = toOptionalString(value.createdAt) ?? new Date().toISOString();
  const updatedAt = toOptionalString(value.updatedAt) ?? createdAt;

  return {
    id,
    name: name ?? nameZh ?? '',
    ...(nameZh ? { nameZh } : {}),
    url,
    ...(toOptionalString(value.description) ? { description: toOptionalString(value.description) } : {}),
    ...(toOptionalString(value.descriptionZh) ? { descriptionZh: toOptionalString(value.descriptionZh) } : {}),
    market: market as Market,
    category: category as Category,
    tags: toStringList(value.tags),
    ...(toStringList(value.aliases).length > 0 ? { aliases: toStringList(value.aliases) } : {}),
    priority: priority as Priority,
    ...(toAccessList(value.access).length > 0 ? { access: toAccessList(value.access) } : {}),
    ...(toOptionalString(value.note) ? { note: toOptionalString(value.note) } : {}),
    ...(toOptionalString(value.noteZh) ? { noteZh: toOptionalString(value.noteZh) } : {}),
    isCustom: true,
    createdAt,
    updatedAt,
  };
};

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

const getShortcutArrayFromValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (isRecord(value) && Array.isArray(value.shortcuts)) {
    return value.shortcuts;
  }

  return [];
};

export const parseCustomShortcuts = (value: unknown): CustomShortcut[] => {
  return getShortcutArrayFromValue(value)
    .map((item) => normalizeCustomShortcut(item))
    .filter((item): item is CustomShortcut => Boolean(item));
};

export const getCustomShortcuts = (): CustomShortcut[] => {
  try {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = window.localStorage.getItem(CUSTOM_SHORTCUTS_KEY);
    return stored ? parseCustomShortcuts(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
};

export const saveCustomShortcuts = (shortcuts: CustomShortcut[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(CUSTOM_SHORTCUTS_KEY, JSON.stringify(shortcuts));
};

export const clearAllLocalSettings = () => {
  if (typeof window === 'undefined') {
    return;
  }

  LOCAL_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
};
