import { categoryLabels, priorityLabels, type Language } from '../data/markets';
import type { Site } from '../data/sites';

type SiteCardProps = {
  site: Site;
  isFavorite: boolean;
  isPinned: boolean;
  onToggleFavorite: (siteId: string) => void;
  onTogglePinned: (siteId: string) => void;
  language: Language;
};

export function SiteCard({
  site,
  isFavorite,
  isPinned,
  onToggleFavorite,
  onTogglePinned,
  language,
}: SiteCardProps) {
  const title = language === 'zh' ? site.nameZh ?? site.name : site.name;
  const subtitle = language === 'zh' && site.nameZh ? site.name : site.nameZh;
  const description = language === 'zh' ? site.descriptionZh ?? site.description : site.description;
  const note = language === 'zh' ? site.noteZh ?? site.note : site.note ?? site.noteZh;
  const category = categoryLabels[site.category][language];
  const priority = priorityLabels[site.priority][language];

  return (
    <article
      className={[
        'group flex min-h-[19rem] flex-col rounded-2xl border bg-white/[0.055] p-5 shadow-terminal backdrop-blur-sm transition duration-200 hover:-translate-y-1 hover:bg-white/[0.08] hover:shadow-glow',
        site.priority === 'core'
          ? 'border-terminal-accent/35'
          : 'border-white/10 hover:border-terminal-accent/45',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-2">
            <p className="inline-flex rounded-full border border-terminal-accent/20 bg-terminal-accent/10 px-3 py-1 text-xs font-medium text-terminal-accent">
              {site.market}
            </p>
            <p className="inline-flex rounded-full border border-white/10 bg-terminal-900/80 px-3 py-1 text-xs font-medium text-slate-300">
              {category}
            </p>
            <p
              className={[
                'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
                site.priority === 'core'
                  ? 'border-terminal-gold/55 bg-terminal-gold/15 text-terminal-gold'
                  : 'border-white/10 bg-white/[0.04] text-slate-400',
              ].join(' ')}
            >
              {priority}
            </p>
          </div>
          <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => onTogglePinned(site.id)}
            aria-pressed={isPinned}
            aria-label={
              isPinned
                ? language === 'zh'
                  ? `取消置顶 ${title}`
                  : `Unpin ${title}`
                : language === 'zh'
                  ? `置顶 ${title}`
                  : `Pin ${title}`
            }
            title={isPinned ? (language === 'zh' ? '取消置顶' : 'Unpin') : language === 'zh' ? '置顶' : 'Pin'}
            className={[
              'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
              isPinned
                ? 'border-terminal-accent/60 bg-terminal-accent/15 text-terminal-accent'
                : 'border-white/10 bg-white/[0.04] text-slate-500 hover:border-terminal-accent/50 hover:text-terminal-accent',
            ].join(' ')}
          >
            {isPinned
              ? language === 'zh'
                ? '已置顶'
                : 'Pinned'
              : language === 'zh'
                ? '置顶'
                : 'Pin'}
          </button>
          <button
            type="button"
            onClick={() => onToggleFavorite(site.id)}
            aria-label={
              isFavorite
                ? language === 'zh'
                  ? `取消收藏 ${title}`
                  : `Remove ${title} from favorites`
                : language === 'zh'
                  ? `收藏 ${title}`
                  : `Add ${title} to favorites`
            }
            title={isFavorite ? (language === 'zh' ? '取消收藏' : 'Remove favorite') : language === 'zh' ? '收藏' : 'Add favorite'}
            className={[
              'grid h-10 w-10 place-items-center rounded-full border text-xl transition',
              isFavorite
                ? 'border-terminal-gold/60 bg-terminal-gold/15 text-terminal-gold'
                : 'border-white/10 bg-white/[0.04] text-slate-500 hover:border-terminal-gold/50 hover:text-terminal-gold',
            ].join(' ')}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>

      {note ? (
        <p className="mt-3 rounded-xl border border-terminal-accent/15 bg-terminal-accent/10 px-3 py-2 text-sm leading-6 text-slate-300">
          {note}
        </p>
      ) : null}

      <div className="mt-5 flex flex-1 flex-wrap content-start gap-2">
        {site.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-terminal-900/80 px-2.5 py-1 text-xs text-slate-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={site.url}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center justify-center rounded-xl border border-terminal-accent/35 bg-terminal-accent/10 px-4 py-3 text-sm font-semibold text-terminal-accent transition hover:border-terminal-accent hover:bg-terminal-accent hover:text-terminal-950"
      >
        {language === 'zh' ? '打开' : 'Open'}
      </a>
    </article>
  );
}
