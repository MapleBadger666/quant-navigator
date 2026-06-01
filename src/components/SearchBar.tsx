import type { Language } from '../data/markets';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  language: Language;
};

export function SearchBar({ value, onChange, language }: SearchBarProps) {
  return (
    <label className="block">
      <span className="sr-only">Search sites</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m1.1-5.4a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z"
            />
          </svg>
        </span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            language === 'zh'
              ? '搜索网站、分类、关键词、用途……'
              : 'Search by site, category, keyword, or use case...'
          }
          className="w-full rounded-xl border border-white/10 bg-terminal-900/80 py-4 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-terminal-accent/70 focus:bg-terminal-800/90 focus:ring-4 focus:ring-terminal-accent/10"
        />
      </div>
    </label>
  );
}
