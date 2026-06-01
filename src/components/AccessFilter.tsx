import {
  accessLabels,
  accessTags,
  allAccess,
  type AccessTag,
  type Language,
} from '../data/markets';

type AccessFilterValue = typeof allAccess | AccessTag;

type AccessFilterProps = {
  selectedAccess: AccessFilterValue;
  onSelectAccess: (access: AccessFilterValue) => void;
  language: Language;
};

export function AccessFilter({ selectedAccess, onSelectAccess, language }: AccessFilterProps) {
  const filterOptions: AccessFilterValue[] = [allAccess, ...accessTags];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filterOptions.map((access) => {
        const isActive = selectedAccess === access;
        const label =
          access === allAccess
            ? language === 'zh'
              ? '全部访问条件'
              : 'All Access'
            : accessLabels[access][language];

        return (
          <button
            key={access}
            type="button"
            onClick={() => onSelectAccess(access)}
            className={[
              'whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'border-terminal-gold/70 bg-terminal-gold text-terminal-950 shadow-terminal'
                : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-terminal-gold/45 hover:bg-white/[0.07] hover:text-white',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export type { AccessFilterValue };
