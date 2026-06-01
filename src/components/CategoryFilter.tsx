import { categories, categoryLabels, type Category, type Language } from '../data/markets';

type CategoryFilterProps = {
  selectedCategory: 'All' | Category;
  onSelectCategory: (category: 'All' | Category) => void;
  language: Language;
};

const allCategory = 'All';

export function CategoryFilter({ selectedCategory, onSelectCategory, language }: CategoryFilterProps) {
  const filterOptions: Array<'All' | Category> = [allCategory, ...categories];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filterOptions.map((category) => {
        const isActive = selectedCategory === category;
        const label =
          category === allCategory
            ? language === 'zh'
              ? '全部功能'
              : 'All Categories'
            : categoryLabels[category][language];

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category)}
            className={[
              'whitespace-nowrap rounded-lg border px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'border-terminal-accent/70 bg-terminal-accent text-terminal-950 shadow-glow'
                : 'border-white/10 bg-white/[0.04] text-slate-300 hover:border-terminal-accent/45 hover:bg-white/[0.07] hover:text-white',
            ].join(' ')}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
