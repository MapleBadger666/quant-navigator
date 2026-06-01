import type { Market } from './markets';

export type Workflow = {
  id: string;
  title: string;
  titleZh: string;
  market: Market;
  description: string;
  descriptionZh: string;
  siteIds: string[];
};

export const workflows: Workflow[] = [
  {
    id: 'a-share-daily-monitor',
    title: 'A-Share Daily Monitor',
    titleZh: 'A股每日看盘',
    market: 'A股',
    description: 'Open the core quote, sector, index, news, and sentiment portals.',
    descriptionZh: '打开核心行情、板块、指数、快讯和情绪观察入口。',
    siteIds: ['eastmoney', '10jqka', 'cls', 'csindex', 'xueqiu'],
  },
  {
    id: 'a-share-filings-research',
    title: 'A-Share Filings Research',
    titleZh: 'A股公告研究',
    market: 'A股',
    description: 'Jump into filings, exchange announcements, and investor Q&A.',
    descriptionZh: '快速进入公告披露、交易所公告和投资者互动问答。',
    siteIds: ['cninfo', 'sse', 'szse', 'bse', 'irm-cninfo'],
  },
  {
    id: 'a-share-quant-research',
    title: 'A-Share Quant Research',
    titleZh: 'A股量化研究',
    market: 'A股',
    description: 'Launch common China quant research, factor, and backtesting platforms.',
    descriptionZh: '打开国内常用量化研究、因子挖掘和回测平台。',
    siteIds: ['joinquant', 'ricequant', 'bigquant', 'uqer', 'myquant'],
  },
  {
    id: 'a-share-institutional-data',
    title: 'A-Share Institutional Data',
    titleZh: 'A股机构数据',
    market: 'A股',
    description: 'Open major vendor terminals and index data portals.',
    descriptionZh: '打开机构数据终端与中证、国证指数资料入口。',
    siteIds: ['wind', 'choice', 'ifind', 'csindex', 'cnindex'],
  },
  {
    id: 'fund-private-fund-research',
    title: 'Fund & Private Fund Research',
    titleZh: '基金与私募研究',
    market: 'A股',
    description: 'Review mutual funds, private funds, regulatory data, and China fund research tools.',
    descriptionZh: '查看公募基金、私募基金、自律监管与基金数据工具。',
    siteIds: ['eastmoney-fund', 'simuwang', 'amac', 'eastmoney', 'choice'],
  },
  {
    id: 'us-market-intelligence',
    title: 'US Market Intelligence',
    titleZh: '美股市场情报',
    market: '美股',
    description: 'Open quotes, charts, macro data, and market news for US/global markets.',
    descriptionZh: '打开美股和全球市场行情、图表、宏观数据与新闻入口。',
    siteIds: ['yahoo-finance', 'tradingview', 'fred', 'bloomberg', 'reuters-markets'],
  },
  {
    id: 'us-filings-factor-research',
    title: 'US Filings & Factor Research',
    titleZh: '美股披露与因子研究',
    market: '美股',
    description: 'Open SEC filings, factor datasets, and quant research references.',
    descriptionZh: '打开 SEC 披露、因子数据集和量化研究资料。',
    siteIds: ['sec-edgar', 'bamsec', 'ken-french-data-library', 'aqr-data-sets', 'quantpedia'],
  },
  {
    id: 'global-backtesting-stack',
    title: 'Global Backtesting Stack',
    titleZh: '全球回测工具链',
    market: '通用工具',
    description: 'Open popular backtesting and portfolio construction tools.',
    descriptionZh: '打开常用回测、组合构建和策略实验工具。',
    siteIds: ['quantconnect', 'backtrader', 'vectorbt', 'portfolio-visualizer', 'pyportfolioopt'],
  },
  {
    id: 'crypto-market-intelligence',
    title: 'Crypto Market Intelligence',
    titleZh: '加密市场情报',
    market: '加密',
    description: 'Open crypto market, DeFi, on-chain, and fundamentals dashboards.',
    descriptionZh: '打开加密行情、DeFi、链上数据和协议基本面看板。',
    siteIds: ['coinmarketcap', 'coingecko', 'defillama', 'glassnode', 'token-terminal'],
  },
];
