import type { Market, Priority } from './markets';

export type WorkflowGroup =
  | 'A股每日'
  | 'A股公告'
  | 'A股量化'
  | '美股市场'
  | '宏观研究'
  | '因子研究'
  | '回测工具'
  | '学术论文'
  | '基金私募'
  | '加密市场';

export type Workflow = {
  id: string;
  title: string;
  titleZh: string;
  group: WorkflowGroup;
  market: Market;
  priority: Priority;
  tags: string[];
  isCommon?: boolean;
  description: string;
  descriptionZh: string;
  siteIds: string[];
};

export const workflowGroups: WorkflowGroup[] = [
  'A股每日',
  'A股公告',
  'A股量化',
  '美股市场',
  '宏观研究',
  '因子研究',
  '回测工具',
  '学术论文',
  '基金私募',
  '加密市场',
];

export const workflowGroupLabels: Record<WorkflowGroup, { en: string; zh: string }> = {
  A股每日: { en: 'A-Share Daily', zh: 'A股每日' },
  A股公告: { en: 'A-Share Filings', zh: 'A股公告' },
  A股量化: { en: 'A-Share Quant', zh: 'A股量化' },
  美股市场: { en: 'US Market', zh: '美股市场' },
  宏观研究: { en: 'Macro Research', zh: '宏观研究' },
  因子研究: { en: 'Factor Research', zh: '因子研究' },
  回测工具: { en: 'Backtesting Tools', zh: '回测工具' },
  学术论文: { en: 'Academic Papers', zh: '学术论文' },
  基金私募: { en: 'Funds & Private Funds', zh: '基金私募' },
  加密市场: { en: 'Crypto Market', zh: '加密市场' },
};

export const workflows: Workflow[] = [
  {
    id: 'a-share-daily-monitor',
    title: 'A-Share Daily Monitor',
    titleZh: 'A股每日看盘',
    group: 'A股每日',
    market: 'A股',
    priority: 'core',
    tags: ['daily', 'quotes', 'sector', 'news', 'sentiment'],
    isCommon: true,
    description: 'Open the core quote, sector, index, news, and sentiment portals.',
    descriptionZh: '打开核心行情、板块、指数、快讯和情绪观察入口。',
    siteIds: ['eastmoney', '10jqka', 'cls', 'csindex', 'xueqiu'],
  },
  {
    id: 'a-share-filings-research',
    title: 'A-Share Filings Research',
    titleZh: 'A股公告研究',
    group: 'A股公告',
    market: 'A股',
    priority: 'core',
    tags: ['filings', 'exchange', 'regulation', 'ir', 'disclosure'],
    isCommon: true,
    description: 'Jump into filings, exchange announcements, regulator notices, and investor Q&A.',
    descriptionZh: '快速进入公告披露、交易所公告、监管通知和投资者互动问答。',
    siteIds: ['cninfo', 'sse', 'szse', 'bse', 'csrc', 'irm-cninfo'],
  },
  {
    id: 'a-share-quant-research',
    title: 'A-Share Quant Research',
    titleZh: 'A股量化研究',
    group: 'A股量化',
    market: 'A股',
    priority: 'core',
    tags: ['quant', 'factor', 'backtest', 'platform', 'research'],
    isCommon: true,
    description: 'Launch common China quant research, factor mining, and backtesting platforms.',
    descriptionZh: '打开国内常用量化研究、因子挖掘和回测平台。',
    siteIds: ['joinquant', 'ricequant', 'bigquant', 'uqer', 'myquant', 'swsresearch'],
  },
  {
    id: 'us-market-intelligence',
    title: 'US Market Intelligence',
    titleZh: '美股市场情报',
    group: '美股市场',
    market: '美股',
    priority: 'core',
    tags: ['us stocks', 'quotes', 'macro', 'news', 'charts'],
    isCommon: true,
    description: 'Open quotes, charts, macro data, and market news for US/global markets.',
    descriptionZh: '打开美股和全球市场行情、图表、宏观数据与新闻入口。',
    siteIds: [
      'yahoo-finance',
      'tradingview',
      'fred',
      'bloomberg',
      'reuters-markets',
      'cnbc-markets',
      'marketwatch',
    ],
  },
  {
    id: 'macro-research-desk',
    title: 'Macro Research Desk',
    titleZh: '宏观研究桌面',
    group: '宏观研究',
    market: '美股',
    priority: 'useful',
    tags: ['macro', 'rates', 'economics', 'calendar', 'news'],
    description: 'Track macro time series, policy context, economic papers, and global market news.',
    descriptionZh: '跟踪宏观时间序列、政策背景、经济论文和全球市场新闻。',
    siteIds: [
      'fred',
      'nber',
      'bloomberg',
      'reuters-markets',
      'financial-times-markets',
      'wsj-markets',
      'investing-com',
    ],
  },
  {
    id: 'factor-research-library',
    title: 'Factor Research Library',
    titleZh: '因子研究资料库',
    group: '因子研究',
    market: '美股',
    priority: 'core',
    tags: ['factor', 'asset pricing', 'datasets', 'whitepapers', 'library'],
    description: 'Open factor datasets, asset-pricing references, and quant research libraries.',
    descriptionZh: '打开因子数据集、资产定价资料和量化研究资料库。',
    siteIds: [
      'ken-french-data-library',
      'aqr-data-sets',
      'aqr-research',
      'robeco-quant-research',
      'msci-factor-indexes',
      'alpha-architect',
      'quantpedia',
      'portfolio123',
    ],
  },
  {
    id: 'global-backtesting-stack',
    title: 'Global Backtesting Stack',
    titleZh: '全球回测工具链',
    group: '回测工具',
    market: '通用工具',
    priority: 'core',
    tags: ['backtesting', 'portfolio', 'python', 'optimization', 'toolkit'],
    isCommon: true,
    description: 'Open popular backtesting and portfolio construction tools.',
    descriptionZh: '打开常用回测、组合构建和策略实验工具。',
    siteIds: ['quantconnect', 'backtrader', 'zipline', 'vectorbt', 'portfolio-visualizer', 'pyportfolioopt'],
  },
  {
    id: 'academic-paper-scan',
    title: 'Academic Paper Scan',
    titleZh: '学术论文速览',
    group: '学术论文',
    market: '通用工具',
    priority: 'useful',
    tags: ['papers', 'preprints', 'citations', 'finance', 'research'],
    description: 'Search finance papers, preprints, citations, and code-linked research.',
    descriptionZh: '检索金融论文、预印本、引用和带代码的研究资料。',
    siteIds: [
      'arxiv-quant-finance',
      'ssrn',
      'google-scholar',
      'nber',
      'journal-of-finance',
      'papers-with-code',
    ],
  },
  {
    id: 'fund-private-fund-research',
    title: 'Fund & Private Fund Research',
    titleZh: '基金与私募研究',
    group: '基金私募',
    market: 'A股',
    priority: 'useful',
    tags: ['funds', 'private fund', 'regulation', 'products', 'manager'],
    description: 'Review mutual funds, private funds, regulatory data, and China fund research tools.',
    descriptionZh: '查看公募基金、私募基金、自律监管与基金数据工具。',
    siteIds: ['eastmoney-fund', 'simuwang', 'amac', 'eastmoney', 'choice', 'wind', 'ifind'],
  },
  {
    id: 'crypto-market-intelligence',
    title: 'Crypto Market Intelligence',
    titleZh: '加密市场情报',
    group: '加密市场',
    market: '加密',
    priority: 'core',
    tags: ['crypto', 'defi', 'on-chain', 'fundamentals', 'exchange'],
    isCommon: true,
    description: 'Open crypto market, DeFi, on-chain, and fundamentals dashboards.',
    descriptionZh: '打开加密行情、DeFi、链上数据和协议基本面看板。',
    siteIds: [
      'coinmarketcap',
      'coingecko',
      'defillama',
      'glassnode',
      'cryptoquant',
      'token-terminal',
      'binance',
      'coinbase-advanced',
    ],
  },
];
