export type AsufukaketsuKey = 'ア' | 'ス' | 'フ' | 'カ' | 'ケ' | 'ツ' | 'ノ';

export interface AsufukaketsuCategory {
  key: AsufukaketsuKey;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const ASUFUKAKETSU_CONFIG: Record<AsufukaketsuKey, AsufukaketsuCategory> = {
  ア: {
    key: 'ア',
    name: '安全・安心',
    description: '防犯、防災、作業安全、サイバー防護、構造健全性',
    color: 'text-amber-800 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-950/60',
    borderColor: 'border-amber-400 dark:border-amber-700',
  },
  ス: {
    key: 'ス',
    name: 'スピード・ストック',
    description: '省施工、プレハブ、空き家再生、リノベーション、物流高速化',
    color: 'text-blue-800 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-950/60',
    borderColor: 'border-blue-400 dark:border-blue-700',
  },
  フ: {
    key: 'フ',
    name: '福祉',
    description: '介護テック、シニアライフ、ユニバーサルデザイン、リハビリ支援',
    color: 'text-rose-800 dark:text-rose-300',
    bgColor: 'bg-rose-100 dark:bg-rose-950/60',
    borderColor: 'border-rose-400 dark:border-rose-700',
  },
  カ: {
    key: 'カ',
    name: '環境',
    description: '脱炭素、省エネ、ZEB/ZEH、再エネ、循環型社会(サーキュラー)',
    color: 'text-emerald-800 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-950/60',
    borderColor: 'border-emerald-400 dark:border-emerald-700',
  },
  ケ: {
    key: 'ケ',
    name: '健康',
    description: 'ウェルネス、室内空気質、予防医療、スマートヘルス',
    color: 'text-teal-800 dark:text-teal-300',
    bgColor: 'bg-teal-100 dark:bg-teal-950/60',
    borderColor: 'border-teal-400 dark:border-teal-700',
  },
  ツ: {
    key: 'ツ',
    name: '通信',
    description: 'IoT、スマートビル、遠隔監視・制御、5G/LPWA、エッジAI',
    color: 'text-indigo-800 dark:text-indigo-300',
    bgColor: 'bg-indigo-100 dark:bg-indigo-950/60',
    borderColor: 'border-indigo-400 dark:border-indigo-700',
  },
  ノ: {
    key: 'ノ',
    name: '農業',
    description: 'アグリテック、植物工場、スマート農業、地域活性化',
    color: 'text-lime-800 dark:text-lime-300',
    bgColor: 'bg-lime-100 dark:bg-lime-950/60',
    borderColor: 'border-lime-400 dark:border-lime-700',
  },
};

export const TAKAICHI_17_FIELDS = [
  'AI・半導体',
  'デジタル・サイバーセキュリティ',
  '情報通信',
  '量子',
  '防衛産業',
  '航空・宇宙',
  '海洋',
  '造船',
  'マテリアル（重要鉱物・部素材）',
  '合成生物学・バイオ',
  '創薬・先端医療',
  'フュージョンエネルギー（核融合）',
  '資源・エネルギー安全保障・GX',
  'フードテック',
  '防災・国土強靭化',
  '港湾ロジスティクス',
  'コンテンツ',
] as const;

export type TakaichiField = typeof TAKAICHI_17_FIELDS[number];

export const INDUSTRY_CATEGORIES = [
  '建設・不動産テック',
  '製造・ファクトリーDX',
  '物流・SCM・倉庫ロボット',
  'ロボティクス・自動化',
  'モビリティ・自動運転',
  'エネルギー・環境・GX',
  'ヘルスケア・医療テック',
  'アグリ・フードテック',
  'セキュリティ・防犯・防災',
  'IT・エンタープライズSaaS',
  '宇宙・ディープテック',
  'その他産業',
] as const;

export type IndustryCategory = typeof INDUSTRY_CATEGORIES[number];

export type FundingStage =
  | 'プレシード'
  | 'シード'
  | 'シリーズA'
  | 'シリーズB'
  | 'シリーズC以降'
  | 'プレIPO'
  | '自己資本・ブートストラップ'
  | '未特定';

export type DHVStatus =
  | '未対応'
  | 'DHV投資済'
  | '注目・Watch'
  | 'アプローチ済'
  | '面談設定'
  | '投資検討中'
  | '見送り';

export interface StartupExhibitor {
  id: string;
  companyName: string;
  companyNameEn?: string;
  boothNumber: string;
  eventName: string;
  eventVenue: '東京ビッグサイト' | '幕張メッセ' | string;
  eventStartDate: string;
  eventEndDate: string;
  eventUrl: string;
  description: string;
  aiSummary: string;
  industries: IndustryCategory[];
  asufukaketsu: AsufukaketsuKey[];
  takaichi17: TakaichiField[];
  isStartup: boolean;
  startupScore: number; // 0-100
  isDHVPortfolio: boolean; // ★ DHV既存投資先フラグ
  dhvInvestmentRound?: string; // 例: "Series A 出資済"
  dhvInvestmentNote?: string; // 例: "大和ハウスグループ「将来の夢」ファンド"
  establishedYear: number | null;
  yearsSinceEst?: number | null;
  fundingStage: FundingStage;
  estimatedValuation?: string | null;
  totalFunding?: string | null;
  officialUrl?: string | null;
  contactEmail?: string | null;
  links: {
    initialUrl: string;
    keppleUrl: string;
    googleSearchUrl: string;
    googleNewsUrl: string;
    corporateNumberUrl: string;
  };
  dhvStatus: DHVStatus;
  memo?: string;
  updatedAt: string;
}

export type EventStatus =
  | 'スケジュール確定'
  | '出展社公表済'
  | 'ブース配置図公表'
  | '開催中'
  | '終了';

export interface ExhibitionEvent {
  id: string;
  title: string;
  venue: '東京ビッグサイト' | '幕張メッセ' | string;
  hall?: string;
  startDate: string;
  endDate: string;
  officialUrl: string;
  description: string;
  organizer: string;
  startupRelevanceScore: number; // 1-5
  status: EventStatus;
  exhibitorCount: number;
  startupCount: number;
  lastCrawledAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  venues: string[];
  selectedEvents: string[];
  asufukaketsu: AsufukaketsuKey[];
  takaichi17: TakaichiField[];
  industries: IndustryCategory[];
  startupOnly: boolean;
  excludeDHVPortfolio: boolean; // ★ 「DHV投資先は非表示」ボタン用フラグ
  portfolioFilter: 'all' | 'portfolio_only' | 'uninvested_only';
  maxYearsSinceEst: number | null;
  fundingStages: FundingStage[];
  dhvStatus: DHVStatus[];
}
