import { marketLabels, markets, type Language, type MarketFilter } from '../data/markets';

type MarketTabsProps = {
  selectedMarket: MarketFilter;
  onSelectMarket: (market: MarketFilter) => void;
  language: Language;
};

export function MarketTabs({ selectedMarket, onSelectMarket, language }: MarketTabsProps) {
  return (
    <div className="grid gap-2 rounded-2xl border border-white/10 bg-terminal-950/60 p-2 sm:grid-cols-3 lg:grid-cols-6">
      {markets.map((market) => {
        const isActive = selectedMarket === market;

        return (
          <button
            key={market}
            type="button"
            onClick={() => onSelectMarket(market)}
            className={[
              'rounded-xl border px-4 py-3 text-left transition',
              isActive
                ? 'border-terminal-accent/70 bg-terminal-accent/15 text-white shadow-glow'
                : 'border-transparent bg-white/[0.03] text-slate-400 hover:border-white/10 hover:text-white',
            ].join(' ')}
          >
            <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-terminal-accent/75">
              Market
            </span>
            <span className="mt-1 block text-sm font-semibold">{marketLabels[market][language]}</span>
          </button>
        );
      })}
    </div>
  );
}
