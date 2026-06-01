import { categoryLabels, priorityLabels, type Language } from '../data/markets';
import type { Site } from '../data/sites';

type PinBoardProps = {
  pinnedSites: Site[];
  pinnedCount: number;
  language: Language;
  onTogglePinned: (siteId: string) => void;
  onClearPinned: () => void;
};

export function PinBoard({
  pinnedSites,
  pinnedCount,
  language,
  onTogglePinned,
  onClearPinned,
}: PinBoardProps) {
  const openSite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-accent">
            Pin Board
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {language === 'zh'
              ? `首页快速启动入口 · ${pinnedCount} 个置顶网站`
              : `Home quick launch · ${pinnedCount} pinned sites`}
          </p>
        </div>
        {pinnedCount > 0 ? (
          <button
            type="button"
            onClick={onClearPinned}
            className="w-fit rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-terminal-gold/40 hover:text-terminal-gold"
          >
            {language === 'zh' ? '清空全部置顶' : 'Clear all pins'}
          </button>
        ) : null}
      </div>

      {pinnedSites.length > 0 ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pinnedSites.map((site) => {
            const title = language === 'zh' ? site.nameZh ?? site.name : site.name;
            const category = categoryLabels[site.category][language];
            const priority = priorityLabels[site.priority][language];

            return (
              <article
                key={site.id}
                role="button"
                tabIndex={0}
                onClick={() => openSite(site.url)}
                onKeyDown={(event) => {
                  if (event.currentTarget !== event.target) {
                    return;
                  }

                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openSite(site.url);
                  }
                }}
                className="group rounded-xl border border-white/10 bg-terminal-900/70 p-3 text-left transition hover:border-terminal-accent/45 hover:bg-terminal-800/80"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{title}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{category}</p>
                  </div>
                  <span
                    className={[
                      'shrink-0 rounded-full border px-2 py-1 text-[11px] font-semibold',
                      site.priority === 'core'
                        ? 'border-terminal-gold/50 bg-terminal-gold/15 text-terminal-gold'
                        : 'border-white/10 bg-white/[0.04] text-slate-400',
                    ].join(' ')}
                  >
                    {priority}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="rounded-full border border-terminal-accent/20 bg-terminal-accent/10 px-2 py-1 text-[11px] text-terminal-accent">
                    {site.market}
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onTogglePinned(site.id);
                    }}
                    className="rounded-full border border-white/10 px-2 py-1 text-[11px] font-semibold text-slate-500 transition group-hover:border-terminal-gold/40 group-hover:text-terminal-gold"
                  >
                    {language === 'zh' ? '取消置顶' : 'Unpin'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="mt-3 rounded-xl border border-dashed border-white/10 bg-terminal-900/50 px-3 py-3 text-sm text-slate-500">
          {language === 'zh'
            ? '还没有置顶网站。可在网站卡片点击“置顶”，把高频入口放到这里。'
            : 'No pinned sites yet. Click Pin on a site card to place fast-launch entries here.'}
        </p>
      )}
    </section>
  );
}
