export type Language = 'en' | 'zh';

export type Market = 'A股' | '美股' | '港股' | '加密' | '通用工具';

export type MarketFilter = '全部' | Market;

export type Priority = 'core' | 'useful' | 'optional';

export type Category =
  | 'Market Data / 行情数据'
  | 'Research Papers / 学术研究'
  | 'Backtesting / 回测平台'
  | 'Broker / Trading / 券商交易'
  | 'News & Macro / 新闻宏观'
  | 'Filings / 公告披露'
  | 'Factor Research / 因子研究'
  | 'AI / ML for Finance / 金融AI'
  | 'Tools / Visualization / 工具可视化'
  | 'Community / 社区论坛'
  | 'Data Vendor / 数据供应商'
  | 'Regulatory / 监管交易所';

export const allMarket: MarketFilter = '全部';

export const markets: MarketFilter[] = ['全部', 'A股', '美股', '港股', '加密', '通用工具'];

export const categories: Category[] = [
  'Market Data / 行情数据',
  'Research Papers / 学术研究',
  'Backtesting / 回测平台',
  'Broker / Trading / 券商交易',
  'News & Macro / 新闻宏观',
  'Filings / 公告披露',
  'Factor Research / 因子研究',
  'AI / ML for Finance / 金融AI',
  'Tools / Visualization / 工具可视化',
  'Community / 社区论坛',
  'Data Vendor / 数据供应商',
  'Regulatory / 监管交易所',
];

export const categoryLabels: Record<Category, { en: string; zh: string }> = {
  'Market Data / 行情数据': { en: 'Market Data', zh: '行情数据' },
  'Research Papers / 学术研究': { en: 'Research Papers', zh: '学术研究' },
  'Backtesting / 回测平台': { en: 'Backtesting', zh: '回测平台' },
  'Broker / Trading / 券商交易': { en: 'Broker / Trading', zh: '券商交易' },
  'News & Macro / 新闻宏观': { en: 'News & Macro', zh: '新闻宏观' },
  'Filings / 公告披露': { en: 'Filings', zh: '公告披露' },
  'Factor Research / 因子研究': { en: 'Factor Research', zh: '因子研究' },
  'AI / ML for Finance / 金融AI': { en: 'AI / ML for Finance', zh: '金融AI' },
  'Tools / Visualization / 工具可视化': { en: 'Tools / Visualization', zh: '工具可视化' },
  'Community / 社区论坛': { en: 'Community', zh: '社区论坛' },
  'Data Vendor / 数据供应商': { en: 'Data Vendor', zh: '数据供应商' },
  'Regulatory / 监管交易所': { en: 'Regulatory', zh: '监管交易所' },
};

export const marketLabels: Record<MarketFilter, { en: string; zh: string }> = {
  全部: { en: 'All', zh: '全部' },
  A股: { en: 'A-Shares', zh: 'A股' },
  美股: { en: 'US Stocks', zh: '美股' },
  港股: { en: 'Hong Kong', zh: '港股' },
  加密: { en: 'Crypto', zh: '加密' },
  通用工具: { en: 'Tools', zh: '通用工具' },
};

export const priorityLabels: Record<Priority, { en: string; zh: string }> = {
  core: { en: 'Core', zh: '核心' },
  useful: { en: 'Useful', zh: '常用' },
  optional: { en: 'Optional', zh: '备选' },
};
