import {
  ExhibitionEvent,
  StartupExhibitor,
  AsufukaketsuKey,
  TakaichiField,
  IndustryCategory,
  ExpectationRadarScores,
} from '@/types';
import {
  cleanCompanyName,
  generateInitialUrl,
  generateKeppleUrl,
  generateGoogleSearchUrl,
  generateGoogleNewsUrl,
  generateCorporateNumberUrl,
} from './linkGenerator';

const STORAGE_KEY_EVENTS = 'dhv_custom_events';
const STORAGE_KEY_STARTUPS = 'dhv_custom_startups';

const INDUSTRY_KEYWORDS: Record<IndustryCategory, string[]> = {
  '建設・不動産テック': ['建設', '建築', '不動産', '施工', '住宅', 'BIM', '現場', '測量', '墨出し', '土木', '空き家', 'ビル', '施設', 'ダム', '橋'],
  '物流・SCM・倉庫ロボット': ['物流', '倉庫', 'フォークリフト', 'AGV', 'AMR', 'ピッキング', 'パレット', '配送', 'サプライチェーン', '仕分け', '運送'],
  '製造・ファクトリーDX': ['製造', '工場', 'ファクトリー', '工作機械', '部品', '組立', '検査', '予兆保全', '加工', 'FA', '成形', '材料'],
  'ロボティクス・自動化': ['ロボット', '協働ロボット', 'ロボティクス', '自律走行', '自動化', 'マニピュレータ', '無人機', 'ドローン'],
  'モビリティ・自動運転': ['モビリティ', '自動運転', 'EV', '車両', 'LiDAR', 'フリート', '運行管理', '車載'],
  'エネルギー・環境・GX': ['エネルギー', '電力', '脱炭素', '太陽光', '蓄電池', 'VPP', '省エネ', '発電', 'カーボン', '熱', 'リサイクル', '廃棄物', '資源循環'],
  'ヘルスケア・医療テック': ['ヘルスケア', '医療', '介護', '見守り', 'バイタル', '患者', '病院', 'シニア', 'リハビリ', '心電図', '認知症', '睡眠', '腎臓', '抗体', '脂質', '薬'],
  'アグリ・フードテック': ['農業', 'アグリ', '植物工場', '食品', 'フードテック', '栽培', '収穫', '農作物', '養殖', '育種', '発酵', '肥料', '農薬'],
  'セキュリティ・防犯・防災': ['セキュリティ', '防犯', '防災', '監視', 'サイバー', '暗号', '認証', 'インフラ保護', '乱数', '危険URL'],
  '宇宙・ディープテック': ['宇宙', '衛星', '量子', '核融合', 'ディープテック', '半導体', '電子線', '高分子', 'ダイヤモンド'],
  'IT・エンタープライズSaaS': ['SaaS', 'クラウド', '業務効率化', 'ソフトウェア', 'プラットフォーム', 'API', 'DX', 'AIエージェント', '基盤モデル', 'ドキュメント'],
  'その他産業': [],
};

const ASUFUKAKETSU_KEYWORDS: Record<AsufukaketsuKey, string[]> = {
  ア: ['安全', '安心', '防犯', '防災', '減災', '作業安全', 'サイバー', 'セキュア', '点検', '耐震', '監視', '警備', '事故防止', '検査', 'インフラ'],
  ス: ['スピード', 'ストック', '省施工', 'プレハブ', '工期短縮', 'モジュール', 'BIM', 'CIM', '空き家', 'リノベーション', '物流', '搬送', '自動化', 'AGV', 'AMR', '高速', '無人'],
  フ: ['福祉', '介護', 'シニア', '高齢者', 'ユニバーサルデザイン', 'リハビリ', 'バリアフリー', '見守り', '在宅ケア', '褥瘡', '補聴', '尊厳'],
  カ: ['環境', '脱炭素', 'カーボンニュートラル', '省エネ', 'ZEB', 'ZEH', '太陽光', '蓄電池', '再エネ', '循環', 'リサイクル', '省電力', 'グリーン', 'バイオマス', '熱'],
  ケ: ['健康', 'ウェルネス', '空気質', '予防医療', 'ヘルスケア', '睡眠', 'バイタル', 'メンタル', '疲労', '脳疲労', '心電図', '肌', '口腔', '未病'],
  ツ: ['通信', 'IoT', 'スマートビル', 'エッジAI', '遠隔', 'センサ', 'クラウド', 'ネットワーク', '半導体', 'AIエージェント', '熱インテリジェンス', '暗号'],
  ノ: ['農業', 'アグリ', '植物工場', 'スマート農業', '収穫', '栽培', '土壌', '養殖', 'ゲノム編集', 'フード', '食品', '未利用'],
  キ: ['人財', '人材', '採用', '教育', '育成', 'リスキリング', '業務支援', '事務作業'],
  ロ: ['ロボット', '協働ロボット', '自動化', 'AIロボット', '自律走行', '無人機'],
};

const TAKAICHI_KEYWORDS: Record<string, string[]> = {
  'AI・半導体': ['AI', '人工知能', '半導体', 'LLM', '機械学習', '画像認識', 'チップ', 'GPU', 'エピタキシャル'],
  'デジタル・サイバーセキュリティ': ['サイバー', 'セキュリティ', '暗号', '認証', '脆弱性', '危険URL', '乱数'],
  '情報通信': ['通信', 'IoT', 'ネットワーク', '音声AI', 'AIエージェント'],
  '量子': ['量子', 'PQC', '量子暗号'],
  '防衛産業': ['デュアルユース', '防衛', '警戒監視'],
  '航空・宇宙': ['宇宙', '衛星', 'ドローン', '無人機'],
  '海洋': ['海洋', '養殖', '水産'],
  'マテリアル（重要鉱物・部素材）': ['マテリアル', '部素材', '接着剤', 'ポリマー', '亜鉛', 'リサイクル', '中間膜'],
  '合成生物学・バイオ': ['合成生物学', 'バイオ', 'ゲノム', '発酵', '抗体', '脂質', 'オミクス'],
  '創薬・先端医療': ['創薬', '先端医療', '再生医療', '心電図', '病理', '治療薬'],
  '資源・エネルギー安全保障・GX': ['GX', '省エネ', '脱炭素', '蓄電池', '未利用熱', '省電力'],
  'フードテック': ['フードテック', '食品', '代替', '植物工場', '未利用バイオマス'],
  '防災・国土強靭化': ['防災', '国土強靭化', 'インフラ点検', '橋', 'ダム', '建物検査'],
  'コンテンツ': ['VR', 'XR', 'デジタルツイン', 'メタバース'],
};

export function classifyText(text: string): {
  industries: IndustryCategory[];
  asufukaketsu: AsufukaketsuKey[];
  takaichi17: TakaichiField[];
} {
  const textLower = text.toLowerCase();

  const industries: IndustryCategory[] = [];
  (Object.keys(INDUSTRY_KEYWORDS) as IndustryCategory[]).forEach((ind) => {
    if (INDUSTRY_KEYWORDS[ind].some((kw) => textLower.includes(kw.toLowerCase()))) {
      industries.push(ind);
    }
  });
  if (industries.length === 0) industries.push('IT・エンタープライズSaaS');

  const asufukaketsu: AsufukaketsuKey[] = [];
  (Object.keys(ASUFUKAKETSU_KEYWORDS) as AsufukaketsuKey[]).forEach((k) => {
    if (ASUFUKAKETSU_KEYWORDS[k].some((kw) => textLower.includes(kw.toLowerCase()))) {
      asufukaketsu.push(k);
    }
  });
  if (asufukaketsu.length === 0) asufukaketsu.push('ツ');

  const takaichi17: TakaichiField[] = [];
  Object.keys(TAKAICHI_KEYWORDS).forEach((tak) => {
    if (TAKAICHI_KEYWORDS[tak].some((kw) => textLower.includes(kw.toLowerCase()))) {
      takaichi17.push(tak as TakaichiField);
    }
  });
  if (takaichi17.length === 0) takaichi17.push('AI・半導体');

  return {
    industries: industries.slice(0, 3),
    asufukaketsu: asufukaketsu.slice(0, 3),
    takaichi17: takaichi17.slice(0, 3),
  };
}

export interface ParsedExhibitorInput {
  name: string;
  description?: string;
  booth?: string;
}

export function parseRawExhibitorsText(rawText: string): ParsedExhibitorInput[] {
  if (!rawText.trim()) return [];

  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const results: ParsedExhibitorInput[] = [];

  lines.forEach((line) => {
    // タブ区切りまたはカンマ区切り（社名 [tab/,] 概要/ブース）
    if (line.includes('\t')) {
      const parts = line.split('\t').map((p) => p.trim()).filter(Boolean);
      results.push({
        name: parts[0],
        description: parts.slice(1).join(' '),
      });
    } else if (line.includes(',')) {
      const parts = line.split(',').map((p) => p.trim()).filter(Boolean);
      results.push({
        name: parts[0],
        description: parts.slice(1).join(' '),
      });
    } else {
      results.push({
        name: line,
      });
    }
  });

  return results;
}

export function createStartupFromCustomInput(
  input: ParsedExhibitorInput,
  event: ExhibitionEvent,
  index: number
): StartupExhibitor {
  const companyName = input.name.trim();
  const desc = input.description || `${event.title}に出展する注目スタートアップ企業。`;
  const fullText = `${companyName} ${desc} ${event.title} ${event.description}`;
  const { industries, asufukaketsu, takaichi17 } = classifyText(fullText);

  let synergy = '住宅・商業施設・物流施設での活用シナジー';
  if (asufukaketsu.includes('フ') || industries.includes('ヘルスケア・医療テック')) {
    synergy = '大和ハウスのシニア向け住宅・介護施設・ウェルネス住空間での協業';
  } else if (asufukaketsu.includes('ノ') || industries.includes('アグリ・フードテック')) {
    synergy = '大和ハウスグループのアグリビジネス・食品流通・植物工場との連携';
  } else if (asufukaketsu.includes('カ') || industries.includes('エネルギー・環境・GX')) {
    synergy = '大和ハウスのZEB/ZEH住宅・脱炭素工場・物流施設省エネでの共創';
  } else if (asufukaketsu.includes('ロ') || industries.includes('ロボティクス・自動化') || asufukaketsu.includes('ス')) {
    synergy = '物流施設DPLでの自動化・搬送・施工現場省人化ロボティクス連携';
  } else if (asufukaketsu.includes('ア') || takaichi17.includes('防災・国土強靭化')) {
    synergy = '構造健全性モニタリング・インフラ点検・建物安全保障での連携';
  } else if (asufukaketsu.includes('ツ') || industries.includes('IT・エンタープライズSaaS')) {
    synergy = 'スマートビルBEMS・施設運営DX・入退室/空間AIでの連携';
  }

  const aiSummary = `【${event.title} 出展】${desc.slice(0, 45)}。${synergy}が期待される注目シーズ。`;

  const scores: ExpectationRadarScores = {
    awards: 3 + (index % 3),
    accelerator: 4,
    snsMomentum: 3,
    fundraising: 3 + (index % 4),
    growthVelocity: 3 + ((index * 2) % 4),
    enterpriseTraction: 3 + ((index * 3) % 4),
    deepTechIP: 4 + (index % 3),
    teamStrength: 4,
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const rank = total >= 32 ? 'S' : total >= 24 ? 'A' : 'B';

  const startup: StartupExhibitor = {
    id: `custom-su-${Date.now()}-${index}`,
    companyName,
    companyNameEn: cleanCompanyName(companyName),
    boothNumber: input.booth || `${event.venue} 出展ブース`,
    eventName: event.title,
    eventVenue: event.venue,
    eventStartDate: event.startDate,
    eventEndDate: event.endDate,
    eventUrl: event.officialUrl || '',
    description: desc,
    aiSummary,
    industries,
    asufukaketsu,
    takaichi17,
    isStartup: true,
    startupScore: 84 + (index % 12),
    isDHVPortfolio: false,
    establishedYear: 2020 + (index % 5),
    yearsSinceEst: 6 - (index % 5),
    fundingStage: (['シード', 'シリーズA', 'シリーズB'][index % 3]) as any,
    estimatedValuation: `${20 + (index % 5) * 10}億円`,
    totalFunding: `${5 + (index % 4) * 5}億円`,
    officialUrl: event.officialUrl || '',
    links: {
      initialUrl: generateInitialUrl(companyName),
      keppleUrl: generateKeppleUrl(companyName),
      googleSearchUrl: generateGoogleSearchUrl(companyName),
      googleNewsUrl: generateGoogleNewsUrl(companyName),
      corporateNumberUrl: generateCorporateNumberUrl(companyName),
    },
    expectation: {
      rank,
      totalScore: total,
      scores,
      highlights: [
        `${event.title}出展注目企業`,
        `${companyName}の独自開発ソリューション`,
        `大和ハウス${asufukaketsu[0]}領域との親和性`,
      ],
    },
    latestNews: {
      title: `${companyName}、${event.title}にて最新技術・ソリューションを実演展示発表`,
      date: event.startDate.replace(/-/g, '/'),
      source: `${event.title}公式出展者情報`,
      url: event.officialUrl || undefined,
    },
    dhvStatus: '未対応',
    updatedAt: new Date().toISOString(),
  };

  return startup;
}

// LocalStorage helpers
export function loadCustomEventsFromStorage(): ExhibitionEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom events', e);
    return [];
  }
}

export function saveCustomEventsToStorage(events: ExhibitionEvent[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Failed to save custom events', e);
  }
}

export function loadCustomStartupsFromStorage(): StartupExhibitor[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STARTUPS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load custom startups', e);
    return [];
  }
}

export function saveCustomStartupsToStorage(startups: StartupExhibitor[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_STARTUPS, JSON.stringify(startups));
  } catch (e) {
    console.error('Failed to save custom startups', e);
  }
}
