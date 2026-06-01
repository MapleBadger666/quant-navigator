import type { ReactNode } from 'react';
import type { Language } from '../data/markets';

type NavbarProps = {
  totalSites: number;
  favoriteCount: number;
  language: Language;
  onLanguageChange: (language: Language) => void;
  onOpenSettings: () => void;
  authContent: ReactNode;
  runtime: 'web' | 'desktop';
};

export function Navbar({
  totalSites,
  favoriteCount,
  language,
  onLanguageChange,
  onOpenSettings,
  authContent,
  runtime,
}: NavbarProps) {
  const runtimeLabel =
    runtime === 'desktop'
      ? language === 'zh'
        ? '桌面版'
        : 'Desktop'
      : language === 'zh'
        ? '网页版'
        : 'Web';

  return (
    <header className="sticky top-0 z-20 border-b border-terminal-accent/15 bg-terminal-950/86 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-terminal-accent/80">
              Quant Workspace
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              {language === 'zh' ? '量化导航 Quant Navigator' : 'Quant Navigator'}
            </h1>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start">
            {authContent}
            <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
              {(['zh', 'en'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onLanguageChange(option)}
                  className={[
                    'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    language === option
                      ? 'bg-terminal-accent text-terminal-950'
                      : 'text-slate-400 hover:text-white',
                  ].join(' ')}
                >
                  {option === 'zh' ? '中文' : 'English'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenSettings}
              className="shrink-0 rounded-full border border-terminal-accent/25 bg-terminal-accent/10 px-4 py-2 text-xs font-semibold text-terminal-accent transition hover:border-terminal-accent/60 hover:bg-terminal-accent hover:text-terminal-950"
            >
              {language === 'zh' ? '设置 / 帮助' : 'Settings / Help'}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
            <span className="font-mono text-terminal-accent">{totalSites}</span>{' '}
            {language === 'zh' ? '网站' : 'sites'}
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
            <span className="font-mono text-terminal-gold">{favoriteCount}</span>{' '}
            {language === 'zh' ? '收藏' : 'favorites'}
          </div>
          <div className="rounded-full border border-terminal-accent/20 bg-terminal-accent/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-terminal-accent">
            {language === 'zh' ? '本地纯前端运行' : 'Local front-end only'}
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300">
            {runtimeLabel}
          </div>
        </div>
      </nav>
    </header>
  );
}
