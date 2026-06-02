import {
  accessTags,
  categories,
  markets,
  type AccessTag,
  type Category,
  type Language,
  type Market,
  type Priority,
} from '../data/markets';
import type { CustomShortcut } from '../data/sites';

export const GUEST_FAVORITES_KEY = 'quant_navigator_guest_favorites';
export const PINNED_SITES_KEY = 'quant_navigator_pinned_sites';
export const WORKFLOW_FAVORITES_KEY = 'quant_navigator_workflow_favorites';
export const CUSTOM_SHORTCUTS_KEY = 'quant_navigator_custom_shortcuts';
export const LANGUAGE_PREFERENCE_KEY = 'quant_navigator_language';
export const LEGACY_FAVORITES_KEY = 'quant-navigator:favorites';
export const SETTINGS_BACKUP_APP = 'Quant Navigator';
export const SETTINGS_BACKUP_VERSION = '0.1.0';

export const LOCAL_STORAGE_KEYS = [
  GUEST_FAVORITES_KEY,
  PINNED_SITES_KEY,
  WORKFLOW_FAVORITES_KEY,
  CUSTOM_SHORTCUTS_KEY,
  LANGUAGE_PREFERENCE_KEY,
  LEGACY_FAVORITES_KEY,
] as const;

export type UserPreferences = {
  language?: Language;
};

export type LocalSettingsBackup = {
  app: typeof SETTINGS_BACKUP_APP;
  version: string;
  exportedAt: string;
  favorites: string[];
  pinnedSites: string[];
  favoriteWorkflows: string[];
  customShortcuts: CustomShortcut[];
  preferences: UserPreferences;
};

export type LocalSettingsInput = {
  favorites: Iterable<string>;
  pinnedSites: Iterable<string>;
  favoriteWorkflows: Iterable<string>;
  customShortcuts: CustomShortcut[];
  preferences?: UserPreferences;
};

const priorities: Priority[] = ['core', 'useful', 'optional'];
const validMarkets = markets.filter((market): market is Market => market !== '全部');
const languages: Language[] = ['en', 'zh'];

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

const toUniqueStringList = (value: unknown) => [...new Set(toStringList(value))];

const normalizePreferences = (value: unknown): UserPreferences => {
  if (!isRecord(value)) {
    return {};
  }

  return languages.includes(value.language as Language)
    ? { language: value.language as Language }
    : {};
};

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

export const getLanguagePreference = (): Language | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
  return languages.includes(stored as Language) ? (stored as Language) : null;
};

export const saveLanguagePreference = (language: Language) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(LANGUAGE_PREFERENCE_KEY, language);
};

export const createLocalSettingsBackup = ({
  favorites,
  pinnedSites,
  favoriteWorkflows,
  customShortcuts,
  preferences = {},
}: LocalSettingsInput): LocalSettingsBackup => ({
  app: SETTINGS_BACKUP_APP,
  version: SETTINGS_BACKUP_VERSION,
  exportedAt: new Date().toISOString(),
  favorites: [...new Set([...favorites].filter(Boolean))],
  pinnedSites: [...new Set([...pinnedSites].filter(Boolean))],
  favoriteWorkflows: [...new Set([...favoriteWorkflows].filter(Boolean))],
  customShortcuts,
  preferences,
});

export const parseLocalSettingsBackup = (value: unknown): LocalSettingsBackup | null => {
  if (!isRecord(value)) {
    return null;
  }

  if (value.app !== SETTINGS_BACKUP_APP) {
    return null;
  }

  const rawCustomShortcuts = value.customShortcuts;

  if (
    !Array.isArray(value.favorites) ||
    !Array.isArray(value.pinnedSites) ||
    !Array.isArray(value.favoriteWorkflows) ||
    !Array.isArray(rawCustomShortcuts)
  ) {
    return null;
  }

  const customShortcuts = parseCustomShortcuts(rawCustomShortcuts);

  if (customShortcuts.length !== rawCustomShortcuts.length) {
    return null;
  }

  return {
    app: SETTINGS_BACKUP_APP,
    version: toOptionalString(value.version) ?? SETTINGS_BACKUP_VERSION,
    exportedAt: toOptionalString(value.exportedAt) ?? new Date().toISOString(),
    favorites: toUniqueStringList(value.favorites),
    pinnedSites: toUniqueStringList(value.pinnedSites),
    favoriteWorkflows: toUniqueStringList(value.favoriteWorkflows),
    customShortcuts,
    preferences: normalizePreferences(value.preferences),
  };
};

export const clearAllLocalSettings = () => {
  if (typeof window === 'undefined') {
    return;
  }

  LOCAL_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key));
};
