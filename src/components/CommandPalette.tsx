import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import {
  categoryLabels,
  marketLabels,
  priorityLabels,
  type Language,
} from '../data/markets';
import type { Site } from '../data/sites';
import type { Workflow } from '../data/workflows';
import { workflowGroupLabels } from '../data/workflows';

type CommandPaletteProps = {
  sites: Site[];
  workflows: Workflow[];
  sitesById: Map<string, Site>;
  language: Language;
  onFilterWorkflow: (workflow: Workflow) => void;
};

type CommandItem =
  | {
      id: string;
      type: 'site';
      site: Site;
      searchText: string;
    }
  | {
      id: string;
      type: 'workflow';
      workflow: Workflow;
      searchText: string;
    };

const maxResults = 14;

const normalize = (value: string) => value.trim().toLowerCase();

const itemPriorityRank = (item: CommandItem) => {
  const priority = item.type === 'site' ? item.site.priority : item.workflow.priority;

  if (priority === 'core') {
    return 0;
  }

  if (priority === 'useful') {
    return 1;
  }

  return 2;
};

export function CommandPalette({
  sites,
  workflows,
  sitesById,
  language,
  onFilterWorkflow,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commandItems = useMemo<CommandItem[]>(
    () => [
      ...sites.map((site) => ({
        id: `site-${site.id}`,
        type: 'site' as const,
        site,
        searchText: [
          site.name,
          site.nameZh,
          site.url,
          site.market,
          site.category,
          categoryLabels[site.category].en,
          categoryLabels[site.category].zh,
          site.note,
          site.noteZh,
          ...site.tags,
          ...(site.aliases ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      })),
      ...workflows.map((workflow) => ({
        id: `workflow-${workflow.id}`,
        type: 'workflow' as const,
        workflow,
        searchText: [
          workflow.title,
          workflow.titleZh,
          workflow.description,
          workflow.descriptionZh,
          workflow.market,
          workflow.group,
          workflowGroupLabels[workflow.group].en,
          workflowGroupLabels[workflow.group].zh,
          ...workflow.tags,
          ...(workflow.aliases ?? []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase(),
      })),
    ],
    [sites, workflows],
  );

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);

    return commandItems
      .map((item) => {
        if (!normalizedQuery) {
          return {
            item,
            score: itemPriorityRank(item) + (item.type === 'workflow' ? 0.2 : 0.4),
          };
        }

        const label =
          item.type === 'site'
            ? `${item.site.name} ${item.site.nameZh ?? ''}`.toLowerCase()
            : `${item.workflow.title} ${item.workflow.titleZh}`.toLowerCase();
        const aliases =
          item.type === 'site' ? item.site.aliases ?? [] : item.workflow.aliases ?? [];
        const aliasMatches = aliases.some((alias) => alias.toLowerCase() === normalizedQuery);

        if (!item.searchText.includes(normalizedQuery)) {
          return null;
        }

        let score = itemPriorityRank(item) + (item.type === 'workflow' ? 0.2 : 0.4);

        if (aliasMatches) {
          score -= 0.8;
        }

        if (label.startsWith(normalizedQuery)) {
          score -= 0.5;
        }

        return { item, score };
      })
      .filter((result): result is { item: CommandItem; score: number } => Boolean(result))
      .sort((first, second) => {
        const scoreDifference = first.score - second.score;

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        const firstName =
          first.item.type === 'site'
            ? first.item.site.nameZh ?? first.item.site.name
            : first.item.workflow.titleZh;
        const secondName =
          second.item.type === 'site'
            ? second.item.site.nameZh ?? second.item.site.name
            : second.item.workflow.titleZh;

        return firstName.localeCompare(secondName, language);
      })
      .slice(0, maxResults)
      .map((result) => result.item);
  }, [commandItems, language, query]);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      const isOpenShortcut = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);

      if (isOpenShortcut) {
        event.preventDefault();
        setIsOpen(true);
        return;
      }

      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
      return;
    }

    const frameId = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frameId);
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (selectedIndex > results.length - 1) {
      setSelectedIndex(Math.max(results.length - 1, 0));
    }
  }, [results.length, selectedIndex]);

  const openSite = (site: Site) => {
    const openedWindow = window.open(site.url, '_blank', 'noopener,noreferrer');

    if (!openedWindow) {
      window.location.assign(site.url);
    }

    setIsOpen(false);
  };

  const filterWorkflow = (workflow: Workflow) => {
    onFilterWorkflow(workflow);
    setIsOpen(false);
  };

  const openWorkflowSites = (workflow: Workflow) => {
    workflow.siteIds.forEach((siteId) => {
      const site = sitesById.get(siteId);

      if (site) {
        window.open(site.url, '_blank', 'noopener,noreferrer');
      }
    });
    setIsOpen(false);
  };

  const executeItem = (item: CommandItem | undefined) => {
    if (!item) {
      return;
    }

    if (item.type === 'site') {
      openSite(item.site);
      return;
    }

    filterWorkflow(item.workflow);
  };

  const onInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedIndex((current) => (results.length === 0 ? 0 : (current + 1) % results.length));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedIndex((current) =>
        results.length === 0 ? 0 : (current - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      executeItem(results[selectedIndex]);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-terminal-950/75 px-4 py-20 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={language === 'zh' ? '快捷命令栏' : 'Command palette'}
      onMouseDown={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-3xl overflow-hidden rounded-2xl border border-terminal-accent/20 bg-terminal-950/95 shadow-glow"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-white/10 p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-accent">
                Command Palette
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {language === 'zh'
                  ? '搜索网站和工作流。Enter 打开网站；Enter 筛选工作流。'
                  : 'Search sites and workflows. Enter opens sites; Enter filters workflows.'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono">
                Cmd/Ctrl
              </kbd>
              <span>+</span>
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-2 py-1 font-mono">
                K
              </kbd>
            </div>
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={language === 'zh' ? '输入 dfcf、cninfo、tv、fred…' : 'Type dfcf, cninfo, tv, fred...'}
            className="w-full rounded-xl border border-white/10 bg-terminal-900/85 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-terminal-accent/55 focus:ring-2 focus:ring-terminal-accent/15"
          />
        </div>

        <div className="max-h-[28rem] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item, index) => {
                const isSelected = index === selectedIndex;
                const title =
                  item.type === 'site'
                    ? language === 'zh'
                      ? item.site.nameZh ?? item.site.name
                      : item.site.name
                    : language === 'zh'
                      ? item.workflow.titleZh
                      : item.workflow.title;
                const market = item.type === 'site' ? item.site.market : item.workflow.market;
                const detail =
                  item.type === 'site'
                    ? categoryLabels[item.site.category][language]
                    : workflowGroupLabels[item.workflow.group][language];
                const priority =
                  item.type === 'site' ? item.site.priority : item.workflow.priority;

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={-1}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => executeItem(item)}
                    className={[
                      'flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left transition',
                      isSelected
                        ? 'border-terminal-accent/50 bg-terminal-accent/10'
                        : 'border-transparent hover:border-white/10 hover:bg-white/[0.04]',
                    ].join(' ')}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={[
                          'shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold',
                          item.type === 'site'
                            ? 'border-terminal-accent/40 bg-terminal-accent/10 text-terminal-accent'
                            : 'border-terminal-gold/50 bg-terminal-gold/10 text-terminal-gold',
                        ].join(' ')}
                      >
                        {item.type === 'site' ? 'Site' : 'Workflow'}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{title}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {marketLabels[market][language]} · {detail}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {item.type === 'workflow' ? (
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openWorkflowSites(item.workflow);
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              event.stopPropagation();
                              openWorkflowSites(item.workflow);
                            }
                          }}
                          className="rounded-lg border border-terminal-accent/30 bg-terminal-accent/10 px-2.5 py-1.5 text-xs font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
                        >
                          {language === 'zh' ? '打开全部' : 'Open all'}
                        </button>
                      ) : null}
                      <span
                        className={[
                          'rounded-full border px-2 py-1 text-[11px] font-semibold',
                          priority === 'core'
                            ? 'border-terminal-gold/50 bg-terminal-gold/15 text-terminal-gold'
                            : 'border-white/10 bg-white/[0.04] text-slate-400',
                        ].join(' ')}
                      >
                        {priorityLabels[priority][language]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-accent">
                Empty Command
              </p>
              <p className="mt-3 text-sm text-slate-400">
                {language === 'zh'
                  ? '没有找到匹配命令'
                  : 'No matching commands found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
