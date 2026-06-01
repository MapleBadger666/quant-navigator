import { useState } from 'react';
import type { Language, MarketFilter } from '../data/markets';
import { marketLabels } from '../data/markets';
import type { Site } from '../data/sites';
import type { Workflow } from '../data/workflows';

type QuickWorkflowsProps = {
  workflows: Workflow[];
  sitesById: Map<string, Site>;
  selectedMarket: MarketFilter;
  language: Language;
};

export function QuickWorkflows({
  workflows,
  sitesById,
  selectedMarket,
  language,
}: QuickWorkflowsProps) {
  const [lastOpenedWorkflowId, setLastOpenedWorkflowId] = useState<string | null>(null);
  const visibleWorkflows =
    selectedMarket === '全部'
      ? workflows
      : workflows.filter((workflow) => workflow.market === selectedMarket);

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

  return (
    <section className="rounded-2xl border border-white/10 bg-terminal-950/45 p-4">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-terminal-accent">
            Quick Workflows
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            {language === 'zh' ? '一键打开投研路径' : 'One-click research paths'}
          </h2>
        </div>
        <p className="text-xs text-slate-500">
          {language === 'zh' ? '按当前市场过滤' : 'Filtered by selected market'}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleWorkflows.map((workflow) => (
          <article
            key={workflow.id}
            className="rounded-xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-terminal-accent/45 hover:bg-white/[0.07]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-terminal-accent">
                  {marketLabels[workflow.market][language]}
                </p>
                <h3 className="mt-1 font-semibold text-white">
                  {language === 'zh' ? workflow.titleZh : workflow.title}
                </h3>
              </div>
              <button
                type="button"
                data-testid={`workflow-open-${workflow.id}`}
                onClick={() => openWorkflow(workflow)}
                className="rounded-lg border border-terminal-accent/40 bg-terminal-accent/10 px-3 py-2 text-xs font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
              >
                {language === 'zh' ? '打开' : 'Open'}
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              {language === 'zh' ? workflow.descriptionZh : workflow.description}
            </p>
            {lastOpenedWorkflowId === workflow.id ? (
              <p className="mt-3 rounded-lg border border-terminal-accent/20 bg-terminal-accent/10 px-3 py-2 text-xs text-terminal-accent">
                {language === 'zh'
                  ? `已请求打开 ${workflow.siteIds.length} 个网站`
                  : `Requested ${workflow.siteIds.length} websites`}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {workflow.siteIds.map((siteId) => {
                const site = sitesById.get(siteId);
                return site ? (
                  <span
                    key={siteId}
                    className="rounded-full border border-white/10 bg-terminal-900/80 px-2 py-1 text-[11px] text-slate-400"
                  >
                    {language === 'zh' ? site.nameZh ?? site.name : site.name}
                  </span>
                ) : null;
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
