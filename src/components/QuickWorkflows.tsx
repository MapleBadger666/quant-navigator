import { useMemo, useState } from 'react';
import type { Language, MarketFilter } from '../data/markets';
import { marketLabels, priorityLabels } from '../data/markets';
import type { Site } from '../data/sites';
import type { Workflow } from '../data/workflows';
import { workflowGroupLabels, workflowGroups } from '../data/workflows';

type WorkflowView = 'common' | 'all' | 'favorites';

type QuickWorkflowsProps = {
  workflows: Workflow[];
  sitesById: Map<string, Site>;
  selectedMarket: MarketFilter;
  language: Language;
  activeWorkflowFilterId: string | null;
  onFilterSites: (workflow: Workflow) => void;
  favoriteWorkflowIds: Set<string>;
  onToggleWorkflowFavorite: (workflowId: string) => void;
};

const viewLabels: Record<WorkflowView, { en: string; zh: string }> = {
  common: { en: 'Common Workflows', zh: '常用工作流' },
  all: { en: 'All Workflows', zh: '全部工作流' },
  favorites: { en: 'Favorite Workflows', zh: '已收藏工作流' },
};

const getWorkflowGridClass = (workflowCount: number) => {
  if (workflowCount === 1) {
    return 'grid grid-cols-1 gap-3';
  }

  if (workflowCount === 2) {
    return 'grid grid-cols-1 gap-3 lg:grid-cols-2';
  }

  return 'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3';
};

export function QuickWorkflows({
  workflows,
  sitesById,
  selectedMarket,
  language,
  activeWorkflowFilterId,
  onFilterSites,
  favoriteWorkflowIds,
  onToggleWorkflowFavorite,
}: QuickWorkflowsProps) {
  const [selectedView, setSelectedView] = useState<WorkflowView>('common');
  const [expandedWorkflowIds, setExpandedWorkflowIds] = useState<Set<string>>(() => new Set());
  const [lastOpenedWorkflowId, setLastOpenedWorkflowId] = useState<string | null>(null);
  const visibleWorkflows = useMemo(() => {
    return workflows
      .filter((workflow) => selectedMarket === '全部' || workflow.market === selectedMarket)
      .filter((workflow) => {
        if (selectedView === 'common') {
          return workflow.isCommon;
        }

        if (selectedView === 'favorites') {
          return favoriteWorkflowIds.has(workflow.id);
        }

        return true;
      });
  }, [favoriteWorkflowIds, selectedMarket, selectedView, workflows]);

  const groupedWorkflows = useMemo(
    () =>
      workflowGroups
        .map((group) => ({
          group,
          workflows: visibleWorkflows.filter((workflow) => workflow.group === group),
        }))
        .filter((item) => item.workflows.length > 0),
    [visibleWorkflows],
  );

  const openWorkflow = (workflow: Workflow) => {
    let openedCount = 0;

    workflow.siteIds.forEach((siteId) => {
      const site = sitesById.get(siteId);

      if (site) {
        window.open(site.url, '_blank', 'noopener,noreferrer');
        openedCount += 1;
      }
    });

    if (openedCount > 0) {
      setLastOpenedWorkflowId(workflow.id);
    }
  };

  const toggleExpanded = (workflowId: string) => {
    setExpandedWorkflowIds((current) => {
      const next = new Set(current);

      if (next.has(workflowId)) {
        next.delete(workflowId);
      } else {
        next.add(workflowId);
      }

      return next;
    });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-terminal-950/45 p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-terminal-accent">
            Quick Workflows
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {language === 'zh' ? '一键打开投研路径' : 'One-click research paths'}
          </h2>
        </div>
        <div className="flex flex-col gap-2 lg:items-end">
          <div className="flex flex-wrap gap-2">
            {(['common', 'all', 'favorites'] satisfies WorkflowView[]).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setSelectedView(view)}
                className={[
                  'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                  selectedView === view
                    ? 'border-terminal-accent/60 bg-terminal-accent/15 text-terminal-accent'
                    : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-terminal-accent/40 hover:text-terminal-accent',
                ].join(' ')}
              >
                {viewLabels[view][language]}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            {language === 'zh'
              ? `按当前市场过滤 · ${favoriteWorkflowIds.size} 个工作流收藏`
              : `Filtered by selected market · ${favoriteWorkflowIds.size} workflow favorites`}
          </p>
        </div>
      </div>

      {groupedWorkflows.length > 0 ? (
        <div className="space-y-5">
          {groupedWorkflows.map(({ group, workflows: groupWorkflows }) => (
            <div key={group}>
              <div className="mb-3 flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {workflowGroupLabels[group][language]}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {language === 'zh'
                      ? `${groupWorkflows.length} 个工作流`
                      : `${groupWorkflows.length} workflows`}
                  </p>
                </div>
              </div>
              <div className={getWorkflowGridClass(groupWorkflows.length)}>
                {groupWorkflows.map((workflow) => {
                  const workflowSites = workflow.siteIds
                    .map((siteId) => sitesById.get(siteId))
                    .filter((site): site is Site => Boolean(site));
                  const isExpanded = expandedWorkflowIds.has(workflow.id);
                  const isFavorite = favoriteWorkflowIds.has(workflow.id);
                  const isFiltering = activeWorkflowFilterId === workflow.id;

                  return (
                    <article
                      key={workflow.id}
                      className={[
                        'rounded-xl border bg-white/[0.04] p-4 transition hover:border-terminal-accent/45 hover:bg-white/[0.07]',
                        isFiltering ? 'border-terminal-accent/60 shadow-glow' : 'border-white/10',
                      ].join(' ')}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-medium text-terminal-accent">
                            {marketLabels[workflow.market][language]}
                          </p>
                          <h4 className="mt-1 font-semibold text-white">{workflow.titleZh}</h4>
                          <p className="mt-1 text-xs text-slate-500">{workflow.title}</p>
                        </div>
                        <button
                          type="button"
                          aria-pressed={isFavorite}
                          onClick={() => onToggleWorkflowFavorite(workflow.id)}
                          className={[
                            'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                            isFavorite
                              ? 'border-terminal-gold/60 bg-terminal-gold/15 text-terminal-gold'
                              : 'border-white/10 bg-white/[0.04] text-slate-400 hover:border-terminal-gold/40 hover:text-terminal-gold',
                          ].join(' ')}
                        >
                          {isFavorite
                            ? language === 'zh'
                              ? '已收藏'
                              : 'Saved'
                            : language === 'zh'
                              ? '收藏'
                              : 'Save'}
                        </button>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-400">
                        {language === 'zh' ? workflow.descriptionZh : workflow.description}
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                        <div className="rounded-lg border border-white/10 bg-terminal-900/60 px-2 py-2">
                          <p className="text-slate-500">market</p>
                          <p className="mt-1 font-medium text-slate-200">
                            {marketLabels[workflow.market][language]}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-terminal-900/60 px-2 py-2">
                          <p className="text-slate-500">
                            {language === 'zh' ? '网站数量' : 'sites'}
                          </p>
                          <p className="mt-1 font-mono font-medium text-slate-200">
                            {workflowSites.length}
                          </p>
                        </div>
                        <div className="rounded-lg border border-white/10 bg-terminal-900/60 px-2 py-2">
                          <p className="text-slate-500">priority</p>
                          <p className="mt-1 font-medium text-slate-200">
                            {priorityLabels[workflow.priority][language]}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {workflow.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-terminal-900/80 px-2 py-1 text-[11px] text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(workflow.id)}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-terminal-accent/40 hover:text-terminal-accent"
                        >
                          {isExpanded
                            ? language === 'zh'
                              ? '收起网站'
                              : 'Hide Sites'
                            : language === 'zh'
                              ? '查看网站'
                              : 'View Sites'}
                        </button>
                        <button
                          type="button"
                          data-testid={`workflow-open-${workflow.id}`}
                          onClick={() => openWorkflow(workflow)}
                          className="rounded-lg border border-terminal-accent/40 bg-terminal-accent/10 px-3 py-2 text-xs font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
                        >
                          {language === 'zh' ? '打开全部' : 'Open All'}
                        </button>
                        <button
                          type="button"
                          onClick={() => onFilterSites(workflow)}
                          className={[
                            'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                            isFiltering
                              ? 'border-terminal-gold/60 bg-terminal-gold/15 text-terminal-gold'
                              : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-terminal-gold/40 hover:text-terminal-gold',
                          ].join(' ')}
                        >
                          {language === 'zh' ? '筛选这些' : 'Filter Sites'}
                        </button>
                      </div>

                      {lastOpenedWorkflowId === workflow.id ? (
                        <p className="mt-3 rounded-lg border border-terminal-accent/20 bg-terminal-accent/10 px-3 py-2 text-xs text-terminal-accent">
                          {language === 'zh'
                            ? `已请求打开 ${workflowSites.length} 个网站`
                            : `Requested ${workflowSites.length} websites`}
                        </p>
                      ) : null}

                      {isExpanded ? (
                        <div className="mt-3 space-y-2 rounded-lg border border-white/10 bg-terminal-900/60 p-3">
                          {workflowSites.map((site) => (
                            <div
                              key={site.id}
                              className="flex items-start justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-200">
                                  {language === 'zh' ? site.nameZh ?? site.name : site.name}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">{site.url}</p>
                              </div>
                              <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[11px] text-slate-500">
                                {priorityLabels[site.priority][language]}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.04] px-5 py-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-terminal-accent">
            Empty Workflows
          </p>
          <p className="mt-3 text-sm text-slate-400">
            {language === 'zh'
              ? '当前市场或工作流视图下没有匹配项。'
              : 'No workflows match the current market or workflow view.'}
          </p>
        </div>
      )}
    </section>
  );
}
