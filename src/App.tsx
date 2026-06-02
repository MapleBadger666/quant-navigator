import { useMemo, useState } from 'react';
import { AccessFilter, type AccessFilterValue } from './components/AccessFilter';
import { AuthBar } from './components/AuthBar';
import { CategoryFilter } from './components/CategoryFilter';
import { CommandPalette } from './components/CommandPalette';
import { MarketTabs } from './components/MarketTabs';
import { Navbar } from './components/Navbar';
import { PinBoard } from './components/PinBoard';
import { QuickWorkflows } from './components/QuickWorkflows';
import { SearchBar } from './components/SearchBar';
import { SettingsHelpModal } from './components/SettingsHelpModal';
import { ShortcutEditorModal } from './components/ShortcutEditorModal';
import { SiteCard } from './components/SiteCard';
import {
  allMarket,
  allAccess,
  accessLabels,
  categoryLabels,
  type AccessTag,
  type Category,
  type Language,
  type MarketFilter,
  type Priority,
} from './data/markets';
import { sites as builtInSites, type CustomShortcut, type Site } from './data/sites';
import { workflows, type Workflow } from './data/workflows';
import { useAuth } from './hooks/useAuth';
import { useCustomShortcuts, type ShortcutDraft } from './hooks/useCustomShortcuts';
import { useFavorites } from './hooks/useFavorites';
import { usePinnedSites } from './hooks/usePinnedSites';
import { useWorkflowFavorites } from './hooks/useWorkflowFavorites';
import { clearAllLocalSettings } from './utils/storage';

const allCategory = 'All';

type WorkflowSiteFilter = {
  workflowId: string;
  title: string;
  titleZh: string;
  siteIds: Set<string>;
};

const priorityRank: Record<Priority, number> = {
  core: 0,
  useful: 1,
  optional: 2,
};

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return 'zh';
  }

  return window.navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'zh';
};

function App() {
  const [query, setQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<MarketFilter>(allMarket);
  const [selectedCategory, setSelectedCategory] = useState<'All' | Category>(allCategory);
  const [selectedAccess, setSelectedAccess] = useState<AccessFilterValue>(allAccess);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [workflowSiteFilter, setWorkflowSiteFilter] = useState<WorkflowSiteFilter | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => getInitialLanguage());
  const [isShortcutEditorOpen, setIsShortcutEditorOpen] = useState(false);
  const [editingShortcut, setEditingShortcut] = useState<CustomShortcut | null>(null);
  const [customShortcutMessage, setCustomShortcutMessage] = useState<string | null>(null);
  const [customShortcutError, setCustomShortcutError] = useState<string | null>(null);
  const runtime = window.electronAPI?.isElectron ? 'desktop' : 'web';
  const auth = useAuth();
  const favorites = useFavorites(auth.user);
  const pinned = usePinnedSites();
  const workflowFavorites = useWorkflowFavorites();
  const customShortcuts = useCustomShortcuts(builtInSites, language);

  const allSites = useMemo(
    () => [...builtInSites, ...customShortcuts.shortcuts],
    [customShortcuts.shortcuts],
  );
  const sitesById = useMemo(() => new Map(allSites.map((site) => [site.id, site])), [allSites]);
  const pinnedSites = useMemo(
    () =>
      [...pinned.pinnedIds]
        .map((siteId) => sitesById.get(siteId))
        .filter((site): site is Site => Boolean(site)),
    [pinned.pinnedIds, sitesById],
  );

  const filteredSites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allSites
      .filter((site) => !workflowSiteFilter || workflowSiteFilter.siteIds.has(site.id))
      .filter((site) => selectedMarket === allMarket || site.market === selectedMarket)
      .filter((site) => selectedCategory === allCategory || site.category === selectedCategory)
      .filter((site) => selectedAccess === allAccess || site.access?.includes(selectedAccess as AccessTag))
      .filter((site) => !showFavoritesOnly || favorites.favoriteIds.has(site.id))
      .filter((site) => {
        if (!normalizedQuery) {
          return true;
        }

        const searchableText = [
          site.name,
          site.nameZh,
          site.description,
          site.descriptionZh,
          site.category,
          categoryLabels[site.category].en,
          categoryLabels[site.category].zh,
          site.market,
          site.note,
          site.noteZh,
          ...site.tags,
          ...(site.aliases ?? []),
          ...(site.access ?? []),
          ...(site.access ?? []).flatMap((access) => [
            accessLabels[access].en,
            accessLabels[access].zh,
          ]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
      .sort((first, second) => {
        const firstFavorite = favorites.favoriteIds.has(first.id);
        const secondFavorite = favorites.favoriteIds.has(second.id);

        if (firstFavorite === secondFavorite) {
          const firstCurrentMarket = selectedMarket !== allMarket && first.market === selectedMarket;
          const secondCurrentMarket = selectedMarket !== allMarket && second.market === selectedMarket;

          if (firstCurrentMarket !== secondCurrentMarket) {
            return firstCurrentMarket ? -1 : 1;
          }

          const priorityDifference = priorityRank[first.priority] - priorityRank[second.priority];

          if (priorityDifference !== 0) {
            return priorityDifference;
          }

          const categoryDifference = categoryLabels[first.category].en.localeCompare(
            categoryLabels[second.category].en,
          );

          if (categoryDifference !== 0) {
            return categoryDifference;
          }

          return (first.nameZh ?? first.name).localeCompare(second.nameZh ?? second.name, language);
        }

        return firstFavorite ? -1 : 1;
      });
  }, [
    allSites,
    favorites.favoriteIds,
    language,
    query,
    selectedCategory,
    selectedAccess,
    selectedMarket,
    showFavoritesOnly,
    workflowSiteFilter,
  ]);

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedCategory !== allCategory ||
    selectedAccess !== allAccess ||
    selectedMarket !== allMarket ||
    showFavoritesOnly ||
    Boolean(workflowSiteFilter);

  const filterWorkflowSites = (workflow: Workflow) => {
    setWorkflowSiteFilter({
      workflowId: workflow.id,
      title: workflow.title,
      titleZh: workflow.titleZh,
      siteIds: new Set(workflow.siteIds),
    });
    setQuery('');
    setSelectedMarket(allMarket);
    setSelectedCategory(allCategory);
    setSelectedAccess(allAccess);
    setShowFavoritesOnly(false);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedMarket(allMarket);
    setSelectedCategory(allCategory);
    setSelectedAccess(allAccess);
    setShowFavoritesOnly(false);
    setWorkflowSiteFilter(null);
  };

  const resetLocalSettings = () => {
    clearAllLocalSettings();
    favorites.clearLocalFavorites();
    pinned.clearPinned();
    workflowFavorites.clearWorkflowFavorites();
    customShortcuts.clearShortcuts();
    setWorkflowSiteFilter(null);
    setCustomShortcutMessage(null);
    setCustomShortcutError(null);
  };

  const openNewShortcutEditor = () => {
    setEditingShortcut(null);
    setIsShortcutEditorOpen(true);
  };

  const closeShortcutEditor = () => {
    setIsShortcutEditorOpen(false);
    setEditingShortcut(null);
  };

  const saveShortcut = (shortcutId: string | null, draft: ShortcutDraft) => {
    customShortcuts.saveShortcut(shortcutId, draft);
    setCustomShortcutMessage(language === 'zh' ? '已保存自定义快捷入口。' : 'Custom shortcut saved.');
    setCustomShortcutError(null);
  };

  const editCustomSite = (site: Site) => {
    const shortcut = customShortcuts.shortcuts.find((item) => item.id === site.id);

    if (!shortcut) {
      return;
    }

    setEditingShortcut(shortcut);
    setIsShortcutEditorOpen(true);
  };

  const deleteCustomSite = async (site: Site) => {
    const confirmed = window.confirm(
      language === 'zh'
        ? `确定删除自定义快捷入口“${site.nameZh ?? site.name}”吗？`
        : `Delete custom shortcut "${site.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    customShortcuts.deleteShortcut(site.id);
    pinned.removePinned(site.id);
    await favorites.removeFavorite(site.id);

    if (workflowSiteFilter?.siteIds.has(site.id)) {
      setWorkflowSiteFilter(null);
    }

    setCustomShortcutMessage(language === 'zh' ? '已删除自定义快捷入口。' : 'Custom shortcut deleted.');
    setCustomShortcutError(null);
  };

  const exportCustomShortcuts = () => {
    customShortcuts.exportShortcuts();
    setCustomShortcutMessage(language === 'zh' ? '已导出自定义快捷入口 JSON。' : 'Custom shortcuts exported.');
    setCustomShortcutError(null);
  };

  const importCustomShortcuts = async (file: File) => {
    const result = await customShortcuts.importShortcuts(file);

    if (!result.success) {
      setCustomShortcutError(result.error ?? (language === 'zh' ? '导入失败。' : 'Import failed.'));
      setCustomShortcutMessage(null);
      return;
    }

    setCustomShortcutError(null);
    setCustomShortcutMessage(
      language === 'zh'
        ? `导入 ${result.importedCount} 个快捷入口，跳过 ${result.skippedDuplicateUrlCount} 个重复 URL。`
        : `Imported ${result.importedCount} shortcuts and skipped ${result.skippedDuplicateUrlCount} duplicate URLs.`,
    );
  };

  return (
    <div className="min-h-screen text-slate-100">
      <Navbar
        totalSites={allSites.length}
        favoriteCount={favorites.favoriteCount}
        language={language}
        onLanguageChange={setLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        runtime={runtime}
        authContent={
          <AuthBar
            language={language}
            userEmail={auth.user?.email}
            authLoading={auth.loading}
            favoritesLoading={favorites.loading}
            authError={auth.error}
            favoritesError={favorites.error}
            favoritesMessage={favorites.message}
            isSupabaseConfigured={auth.isConfigured}
            isRemoteFavorites={favorites.isRemote}
            onSendMagicLink={auth.sendMagicLink}
            onSignOut={auth.signOut}
            onImportGuestFavorites={favorites.importGuestFavorites}
          />
        }
      />

      <SettingsHelpModal
        isOpen={isSettingsOpen}
        language={language}
        isRemoteFavorites={favorites.isRemote}
        onClose={() => setIsSettingsOpen(false)}
        onClearFavorites={favorites.clearLocalFavorites}
        onClearPinned={pinned.clearPinned}
        onClearWorkflowFavorites={workflowFavorites.clearWorkflowFavorites}
        onResetLocalSettings={resetLocalSettings}
        onExportCustomShortcuts={exportCustomShortcuts}
        onImportCustomShortcuts={importCustomShortcuts}
        customShortcutMessage={customShortcutMessage}
        customShortcutError={customShortcutError}
      />

      <ShortcutEditorModal
        isOpen={isShortcutEditorOpen}
        language={language}
        shortcut={editingShortcut}
        onClose={closeShortcutEditor}
        onSave={saveShortcut}
      />

      <CommandPalette
        sites={allSites}
        workflows={workflows}
        sitesById={sitesById}
        language={language}
        onFilterWorkflow={filterWorkflowSites}
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-9">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-terminal-accent/20 bg-terminal-accent/10 px-3 py-1 font-mono text-xs uppercase tracking-[0.22em] text-terminal-accent">
                {language === 'zh' ? '中文私募投研终端' : 'Local quant command center'}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                {language === 'zh' ? '量化导航 Quant Navigator' : 'Quant Navigator'}
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
                {language === 'zh'
                  ? 'A股、美股、港股、加密与量化研究工作台'
                  : 'Research, Data, Backtesting, Trading, and Market Intelligence Hub'}
              </p>
            </div>
            <button
              type="button"
              onClick={openNewShortcutEditor}
              className="w-fit rounded-xl border border-terminal-accent/35 bg-terminal-accent/10 px-4 py-3 text-sm font-semibold text-terminal-accent transition hover:border-terminal-accent hover:bg-terminal-accent hover:text-terminal-950"
            >
              {language === 'zh' ? '添加快捷入口' : 'Add Shortcut'}
            </button>
          </div>

          <div className="mt-8 space-y-5">
            <SearchBar value={query} onChange={setQuery} language={language} />
            <PinBoard
              pinnedSites={pinnedSites}
              pinnedCount={pinned.pinnedCount}
              language={language}
              onTogglePinned={pinned.togglePinned}
              onClearPinned={pinned.clearPinned}
            />
            <MarketTabs
              selectedMarket={selectedMarket}
              onSelectMarket={setSelectedMarket}
              language={language}
            />
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              language={language}
            />
            <AccessFilter
              selectedAccess={selectedAccess}
              onSelectAccess={setSelectedAccess}
              language={language}
            />
          </div>
        </section>

        <div className="mb-8">
          <QuickWorkflows
            workflows={workflows}
            sitesById={sitesById}
            selectedMarket={selectedMarket}
            language={language}
            activeWorkflowFilterId={workflowSiteFilter?.workflowId ?? null}
            onFilterSites={filterWorkflowSites}
            favoriteWorkflowIds={workflowFavorites.workflowFavoriteIds}
            onToggleWorkflowFavorite={workflowFavorites.toggleWorkflowFavorite}
          />
        </div>

        <section className="mb-5 flex flex-col gap-3 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">
              {language === 'zh' ? '当前显示' : 'Showing'}{' '}
              <span className="font-mono text-terminal-accent">{filteredSites.length}</span>{' '}
              {language === 'zh' ? '个 / 共' : 'of'}{' '}
              <span className="font-mono text-white">{allSites.length}</span>{' '}
              {language === 'zh' ? '个资源' : 'resources'}
            </p>
            {!favorites.isRemote ? (
              <p className="mt-1 text-xs text-terminal-gold">
                {auth.isConfigured
                  ? language === 'zh'
                    ? '当前使用本地收藏，登录后可同步收藏'
                    : 'Using local favorites. Sign in to sync favorites.'
                  : language === 'zh'
                    ? 'Supabase 未配置，当前使用本地收藏模式'
                    : 'Supabase is not configured. Using local favorites.'}
              </p>
            ) : null}
            {workflowSiteFilter ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-terminal-accent/30 bg-terminal-accent/10 px-3 py-1 text-xs text-terminal-accent">
                  {language === 'zh'
                    ? `工作流筛选：${workflowSiteFilter.titleZh}`
                    : `Workflow filter: ${workflowSiteFilter.title}`}
                </span>
                <button
                  type="button"
                  onClick={() => setWorkflowSiteFilter(null)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400 transition hover:border-terminal-accent/40 hover:text-terminal-accent"
                >
                  {language === 'zh' ? '清除工作流筛选' : 'Clear workflow filter'}
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 text-left sm:items-end sm:text-right">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              {language === 'zh' ? '收藏优先 · core 优先 · 分类排序' : 'Favorites first · core first · category sorted'}
            </p>
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((current) => !current)}
              className={[
                'w-fit rounded-lg border px-3 py-2 text-xs font-semibold transition',
                showFavoritesOnly
                  ? 'border-terminal-gold/60 bg-terminal-gold/15 text-terminal-gold'
                  : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-terminal-gold/40 hover:text-terminal-gold',
              ].join(' ')}
            >
              {language === 'zh' ? '只看收藏' : 'Favorites only'}
            </button>
            {favorites.loading ? (
              <p className="mt-1 text-xs text-slate-500">
                {language === 'zh' ? '正在加载收藏…' : 'Loading favorites...'}
              </p>
            ) : null}
          </div>
        </section>

        {filteredSites.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredSites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                isFavorite={favorites.favoriteIds.has(site.id)}
                isPinned={pinned.pinnedIds.has(site.id)}
                onToggleFavorite={favorites.toggleFavorite}
                onTogglePinned={pinned.togglePinned}
                onEditCustomSite={editCustomSite}
                onDeleteCustomSite={deleteCustomSite}
                language={language}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] px-6 py-16 text-center">
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-terminal-accent">
              Empty State
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              {language === 'zh' ? '没有找到匹配的网站' : 'No matching resources found'}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              {language === 'zh'
                ? '可以尝试更宽泛的关键词，或切回全部市场和全部功能。'
                : 'Try a broader keyword, clear the search field, or switch back to all markets and categories.'}
            </p>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl border border-terminal-accent/40 bg-terminal-accent/10 px-5 py-3 text-sm font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
              >
                {language === 'zh' ? '清空筛选' : 'Clear filters'}
              </button>
            ) : null}
          </section>
        )}
      </main>

      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-500">
        {language === 'zh'
          ? 'Built for quantitative research workflow. 为量化投研工作流构建。'
          : 'Built for quantitative research workflow.'}
      </footer>
    </div>
  );
}

export default App;
