import { useEffect, useMemo, useState } from 'react';
import type { AccessTag, Category, Language, Market, Priority } from '../data/markets';
import type { CustomShortcut, Site } from '../data/sites';
import {
  getCustomShortcuts,
  parseCustomShortcuts,
  saveCustomShortcuts,
} from '../utils/storage';

export type ShortcutDraft = {
  name: string;
  nameZh?: string;
  url: string;
  description?: string;
  descriptionZh?: string;
  market: Market;
  category: Category;
  tags: string[];
  aliases?: string[];
  priority: Priority;
  access?: AccessTag[];
  note?: string;
  noteZh?: string;
};

export type ImportCustomShortcutsResult = {
  success: boolean;
  importedCount: number;
  skippedDuplicateUrlCount: number;
  regeneratedIdCount: number;
  error?: string;
};

const normalizeUrlKey = (url: string) => url.trim().toLowerCase();

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

const createShortcutId = (shortcut: ShortcutDraft | CustomShortcut, usedIds: Set<string>) => {
  const base = toSlug(shortcut.name || shortcut.nameZh || 'custom-shortcut') || 'custom-shortcut';
  let nextId = `custom-${base}`;
  let suffix = 2;

  while (usedIds.has(nextId)) {
    nextId = `custom-${base}-${suffix}`;
    suffix += 1;
  }

  usedIds.add(nextId);
  return nextId;
};

const cleanOptionalText = (value: string | undefined) => {
  const trimmed = value?.trim() ?? '';
  return trimmed.length > 0 ? trimmed : undefined;
};

const buildShortcut = (
  draft: ShortcutDraft,
  id: string,
  createdAt: string,
): CustomShortcut => {
  const now = new Date().toISOString();
  const name = cleanOptionalText(draft.name) ?? cleanOptionalText(draft.nameZh) ?? '';
  const nameZh = cleanOptionalText(draft.nameZh);
  const description = cleanOptionalText(draft.description);
  const descriptionZh = cleanOptionalText(draft.descriptionZh);
  const aliases = draft.aliases?.map((item) => item.trim()).filter(Boolean) ?? [];
  const access = draft.access?.filter(Boolean) ?? [];
  const note = cleanOptionalText(draft.note);
  const noteZh = cleanOptionalText(draft.noteZh);

  return {
    id,
    name,
    ...(nameZh ? { nameZh } : {}),
    url: draft.url.trim(),
    ...(description ? { description } : {}),
    ...(descriptionZh ? { descriptionZh } : {}),
    market: draft.market,
    category: draft.category,
    tags: [...new Set(draft.tags.map((item) => item.trim()).filter(Boolean))],
    ...(aliases.length > 0 ? { aliases: [...new Set(aliases)] } : {}),
    priority: draft.priority,
    ...(access.length > 0 ? { access: [...new Set(access)] } : {}),
    ...(note ? { note } : {}),
    ...(noteZh ? { noteZh } : {}),
    isCustom: true,
    createdAt,
    updatedAt: now,
  };
};

const getImportError = (language: Language) =>
  language === 'zh'
    ? '导入失败：JSON 必须是自定义快捷入口数组，或包含 shortcuts 数组的对象，并且每项需要有效名称、http(s) URL、market、category 和 priority。'
    : 'Import failed: JSON must be an array of custom shortcuts, or an object with a shortcuts array. Each item needs a valid name, http(s) URL, market, category, and priority.';

export function useCustomShortcuts(baseSites: Site[], language: Language) {
  const [shortcuts, setShortcuts] = useState<CustomShortcut[]>(() => getCustomShortcuts());

  useEffect(() => {
    saveCustomShortcuts(shortcuts);
  }, [shortcuts]);

  const baseSiteIds = useMemo(() => new Set(baseSites.map((site) => site.id)), [baseSites]);
  const baseSiteUrls = useMemo(
    () => new Set(baseSites.map((site) => normalizeUrlKey(site.url))),
    [baseSites],
  );

  const saveShortcut = (shortcutId: string | null, draft: ShortcutDraft) => {
    setShortcuts((currentShortcuts) => {
      const current = currentShortcuts.find((shortcut) => shortcut.id === shortcutId);
      const usedIds = new Set([
        ...baseSiteIds,
        ...currentShortcuts
          .filter((shortcut) => shortcut.id !== shortcutId)
          .map((shortcut) => shortcut.id),
      ]);
      const id = shortcutId ?? createShortcutId(draft, usedIds);
      const createdAt = current?.createdAt ?? new Date().toISOString();
      const nextShortcut = buildShortcut(draft, id, createdAt);

      if (shortcutId) {
        return currentShortcuts.map((shortcut) =>
          shortcut.id === shortcutId ? nextShortcut : shortcut,
        );
      }

      return [nextShortcut, ...currentShortcuts];
    });
  };

  const deleteShortcut = (shortcutId: string) => {
    setShortcuts((currentShortcuts) =>
      currentShortcuts.filter((shortcut) => shortcut.id !== shortcutId),
    );
  };

  const clearShortcuts = () => {
    setShortcuts([]);
  };

  const exportShortcuts = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const exportedAt = new Date().toISOString();
    const blob = new Blob(
      [
        JSON.stringify(
          {
            version: 1,
            exportedAt,
            shortcuts,
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quant-navigator-custom-shortcuts-${exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const importShortcuts = async (file: File): Promise<ImportCustomShortcutsResult> => {
    try {
      const rawText = await file.text();
      const parsed = JSON.parse(rawText);
      const importedShortcuts = parseCustomShortcuts(parsed);

      if (importedShortcuts.length === 0) {
        return {
          success: false,
          importedCount: 0,
          skippedDuplicateUrlCount: 0,
          regeneratedIdCount: 0,
          error: getImportError(language),
        };
      }

      let importedCount = 0;
      let skippedDuplicateUrlCount = 0;
      let regeneratedIdCount = 0;

      const usedIds = new Set([...baseSiteIds, ...shortcuts.map((shortcut) => shortcut.id)]);
      const usedUrls = new Set([
        ...baseSiteUrls,
        ...shortcuts.map((shortcut) => normalizeUrlKey(shortcut.url)),
      ]);
      const duplicateUrlCount = importedShortcuts.filter((shortcut) =>
        usedUrls.has(normalizeUrlKey(shortcut.url)),
      ).length;
      const keepDuplicateUrls =
        duplicateUrlCount > 0
          ? window.confirm(
              language === 'zh'
                ? `发现 ${duplicateUrlCount} 个重复 URL。点击“确定”保留重复项，点击“取消”跳过重复 URL。`
                : `${duplicateUrlCount} duplicate URLs found. Choose OK to keep duplicates, or Cancel to skip duplicate URLs.`,
            )
          : false;

      const nextShortcuts = [...shortcuts];

      importedShortcuts.forEach((shortcut) => {
        const urlKey = normalizeUrlKey(shortcut.url);

        if (!keepDuplicateUrls && usedUrls.has(urlKey)) {
          skippedDuplicateUrlCount += 1;
          return;
        }

        let id = shortcut.id;

        if (usedIds.has(id)) {
          id = createShortcutId(shortcut, usedIds);
          regeneratedIdCount += 1;
        } else {
          usedIds.add(id);
        }

        usedUrls.add(urlKey);
        nextShortcuts.unshift({
          ...shortcut,
          id,
          isCustom: true,
          updatedAt: new Date().toISOString(),
        });
        importedCount += 1;
      });

      setShortcuts(nextShortcuts);

      return {
        success: true,
        importedCount,
        skippedDuplicateUrlCount,
        regeneratedIdCount,
      };
    } catch {
      return {
        success: false,
        importedCount: 0,
        skippedDuplicateUrlCount: 0,
        regeneratedIdCount: 0,
        error:
          language === 'zh'
            ? '导入失败：无法解析 JSON 文件，请确认文件内容有效。'
            : 'Import failed: the JSON file could not be parsed.',
      };
    }
  };

  return {
    shortcuts,
    saveShortcut,
    deleteShortcut,
    clearShortcuts,
    exportShortcuts,
    importShortcuts,
  };
}
