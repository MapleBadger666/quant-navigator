import { forwardRef } from 'react';
import { accessLabels, categoryLabels, priorityLabels, type Language } from '../data/markets';
import type { Site } from '../data/sites';

type FavoritesSectionProps = {
  favoriteSites: Site[];
  isFavoritesOnly: boolean;
  isHighlighted: boolean;
  language: Language;
  onToggleFavoritesOnly: () => void;
  onToggleFavorite: (siteId: string) => void | Promise<void>;
};

const maxVisibleFavorites = 8;

export const FavoritesSection = forwardRef<HTMLElement, FavoritesSectionProps>(
  (
    {
      favoriteSites,
      isFavoritesOnly,
      isHighlighted,
      language,
      onToggleFavoritesOnly,
      onToggleFavorite,
    },
    ref,
  ) => {
    const visibleFavorites = favoriteSites.slice(0, maxVisibleFavorites);
    const hiddenFavoriteCount = Math.max(favoriteSites.length - maxVisibleFavorites, 0);
    const hasFavorites = favoriteSites.length > 0;

    return (
      <section
        ref={ref}
        className={[
          'scroll-mt-32 rounded-2xl border bg-terminal-gold/5 p-3 transition duration-500',
          isHighlighted
            ? 'border-terminal-gold/75 ring-2 ring-terminal-gold/45 shadow-[0_0_36px_rgba(245,158,11,0.18)]'
            : 'border-terminal-gold/20',
        ].join(' ')}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-terminal-gold">
              {language === 'zh' ? '收藏网站' : 'Favorite Sites'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {language === 'zh'
                ? '长期关注资源库，与 Pin Board 的高频启动入口分开管理'
                : 'Long-term tracked resources, separate from Pin Board quick launches'}
            </p>
          </div>
          <button
            type="button"
            disabled={!hasFavorites && !isFavoritesOnly}
            onClick={onToggleFavoritesOnly}
            className={[
              'w-fit rounded-lg border px-3 py-2 text-xs font-semibold transition',
              isFavoritesOnly
                ? 'border-terminal-gold/60 bg-terminal-gold/15 text-terminal-gold'
                : hasFavorites
                  ? 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-terminal-gold/40 hover:text-terminal-gold'
                  : 'cursor-not-allowed border-white/5 bg-white/[0.02] text-slate-600',
            ].join(' ')}
          >
            {isFavoritesOnly
              ? language === 'zh'
                ? '显示全部'
                : 'Show all'
              : language === 'zh'
                ? '只看收藏'
                : 'Favorites only'}
          </button>
        </div>

        {hasFavorites ? (
          <>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {visibleFavorites.map((site) => {
                const title = language === 'zh' ? site.nameZh ?? site.name : site.name;
                const category = categoryLabels[site.category][language];
                const priority = priorityLabels[site.priority][language];

                return (
                  <article
                    key={site.id}
                    className="relative rounded-xl border border-white/10 bg-terminal-900/70 p-3 transition hover:border-terminal-gold/45 hover:bg-terminal-800/80"
                    title={language === 'zh' ? `打开 ${title}` : `Open ${title}`}
                  >
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={language === 'zh' ? `打开 ${title}` : `Open ${title}`}
                      className="absolute inset-0 rounded-xl"
                    />
                    <div className="pointer-events-none relative z-0 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-white">{title}</h3>
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

                    <div className="pointer-events-none relative z-0 mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-terminal-accent/20 bg-terminal-accent/10 px-2 py-1 text-[11px] text-terminal-accent">
                        {site.market}
                      </span>
                      {site.access?.slice(0, 2).map((access) => (
                        <span
                          key={access}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-400"
                        >
                          {accessLabels[access][language]}
                        </span>
                      ))}
                    </div>

                    <div className="relative z-10 mt-3 grid grid-cols-2 gap-2">
                      <a
                        href={site.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-terminal-accent/35 bg-terminal-accent/10 px-3 py-2 text-center text-xs font-semibold text-terminal-accent transition hover:bg-terminal-accent hover:text-terminal-950"
                      >
                        {language === 'zh' ? '打开' : 'Open'}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          void onToggleFavorite(site.id);
                        }}
                        className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-terminal-gold/40 hover:text-terminal-gold"
                      >
                        {language === 'zh' ? '取消收藏' : 'Unfavorite'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            {hiddenFavoriteCount > 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                {language === 'zh'
                  ? `还有 ${hiddenFavoriteCount} 个收藏，点击“只看收藏”查看全部。`
                  : `${hiddenFavoriteCount} more favorites. Use “Favorites only” to view all.`}
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-white/10 bg-terminal-900/50 px-3 py-3 text-sm text-slate-500">
            {language === 'zh'
              ? '还没有收藏网站，点击网站卡片上的星标即可收藏。'
              : 'No favorite sites yet. Click the star on any site card to add one.'}
          </p>
        )}
      </section>
    );
  },
);

FavoritesSection.displayName = 'FavoritesSection';
