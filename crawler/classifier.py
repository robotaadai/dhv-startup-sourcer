"""
DHV Startup Sourcer - 分類・判定エンジン
1. 大和ハウス「アスフカケツノ」7領域の判定
2. 高市政権 17戦略分野（経済安全保障・危機管理投資）の判定
3. 産業別カテゴリの判定
4. スタートアップ判定（大企業除外・設立年・スコアリング）
"""

import re
from typing import List, Dict, Any, Tuple

ASUFUKAKETSU_KEYWORDS = {
    'ア': ['安全', '安心', '防犯', '防災', '減災', '作業安全', 'サイバー', 'セキュア', '点検', '耐震', '監視', '警備', '事故防止', '足場安全', 'ヘルメット'],
    'ス': ['スピード', 'ストック', '省施工', 'プレハブ', '工期短縮', 'モジュール', 'BIM', 'CIM', '空き家', 'リノベーション', '既存建築', '物流', '搬送', '自動化', 'AGV', 'AMR', '高速', '無人'],
    'フ': ['福祉', '介護', 'シニア', '高齢者', 'ユニバーサルデザイン', 'リハビリ', 'バリアフリー', '見守り', '在宅ケア', '車椅子', '排泄予知', '認知症'],
    'カ': ['環境', '脱炭素', 'カーボンニュートラル', '省エネ', 'ZEB', 'ZEH', '太陽光', 'ペロブスカイト', '蓄電池', '再エネ', 'EV', '循環', 'リサイクル', 'サーキュラー', '省電力', 'グリーン'],
    'ケ': ['健康', 'ウェルネス', '空気質', '換気', '予防医療', 'ヘルスケア', '睡眠', 'バイタル', 'メンタル', '疲労', 'バイオマーカー', '室内環境'],
    'ツ': ['通信', 'IoT', 'スマートビル', 'BEMS', '5G', 'ローカル5G', 'LPWA', 'エッジAI', '遠隔', 'センサ', 'クラウド', 'ネットワーク', 'Wi-Fi', '無線', 'テレマティクス'],
    'ノ': ['農業', 'アグリ', '植物工場', 'スマート農業', '収穫', '栽培', '営農', 'LED', '水耕栽培', '土壌', 'ドローン散布', '温室', '農家'],
}

TAKAICHI_17_KEYWORDS = {
    'AI・半導体': ['AI', '人工知能', 'フィジカルAI', '半導体', 'LLM', '機械学習', '画像認識', 'チップ', 'GPU', '推論', '自律制御'],
    'デジタル・サイバーセキュリティ': ['サイバー', 'セキュリティ', '暗号', '脆弱性', 'ゼロトラスト', 'EDR', '耐タンパ', '情報漏洩', 'マルウェア'],
    '情報通信': ['Beyond 5G', '6G', '光電融合', 'IOWN', '光通信', '大容量通信', '通信インフラ'],
    '量子': ['量子', '量子コンピュータ', '量子アニーリング', '耐量子', 'PQC', '量子暗号', '量子センサ'],
    '防衛産業': ['防衛', 'デュアルユース', '自衛隊', '防衛テック', '電波妨害', '警戒監視', '抗堪性'],
    '航空・宇宙': ['宇宙', '衛星', 'SAR', 'ロケット', 'ドローン', '空飛ぶクルマ', 'eVTOL', '月面', '軌道上'],
    '海洋': ['海洋', '海底', '洋上風力', 'AUV', '海中ロボット', '海洋資源', '深海'],
    '造船': ['造船', '船舶', '自律運航船', 'アンモニア船', '水素船', '海運'],
    'マテリアル（重要鉱物・部素材）': ['マテリアル', '重要鉱物', 'レアアース', '炭素繊維', '複合材料', 'ペロブスカイト', '新素材', 'ナノ材料'],
    '合成生物学・バイオ': ['合成生物学', 'バイオ', 'ゲノム', 'バイオものづくり', '微生物', '発酵', '生分解'],
    '創薬・先端医療': ['創薬', '先端医療', '再生医療', '核酸医薬', '細胞治療', '医療機器', 'ミリ波レーダー見守り'],
    'フュージョンエネルギー（核融合）': ['核融合', 'フュージョン', 'プラズマ', '超伝導', 'トカマク', 'ヘリカル'],
    '資源・エネルギー安全保障・GX': ['GX', '水素', 'アンモニア', '定置型蓄電池', '系統用蓄電池', 'VPP', 'CCUS', '脱炭素', '地熱'],
    'フードテック': ['フードテック', '代替肉', '植物肉', '細胞農業', '精密発酵', '食品ロス', '鮮度保持'],
    '防災・国土強靭化': ['防災', '国土強靭化', '水害', 'インフラ点検', '地盤沈下', '地震', '堤防', '老朽化', '早期警報'],
    '港湾ロジスティクス': ['港湾', 'ロジスティクス', 'サイバーポート', 'コンテナ', '自動荷役', 'クレーン自動化', '海運DX'],
    'コンテンツ': ['コンテンツ', 'メタバース', '3D CG', 'バーチャル', 'XR', 'デジタルツイン', 'IP'],
}

INDUSTRY_KEYWORDS = {
    '建設・不動産テック': ['建設', '建築', '不動産', '施工', '住宅', 'BIM', '現場', '測量', '墨出し', '土木', '空き家', 'ビル'],
    '製造・ファクトリーDX': ['製造', '工場', 'ファクトリー', '工作機械', '部品', '組立', '検査', '予兆保全', '加工', 'FA'],
    '物流・SCM・倉庫ロボット': ['物流', '倉庫', 'フォークリフト', 'AGV', 'AMR', 'ピッキング', 'パレット', '配送', 'サプライチェーン', '仕分け'],
    'ロボティクス・自動化': ['ロボット', '協働ロボット', 'ロボティクス', '自律走行', '自動化', 'マニピュレータ', 'アクチュエータ'],
    'モビリティ・自動運転': ['モビリティ', '自動運転', 'EV', '車両', 'LiDAR', 'フリート', '運行管理'],
    'エネルギー・環境・GX': ['エネルギー', '電力', '脱炭素', '太陽光', '蓄電池', 'VPP', '省エネ', '発電', 'カーボン'],
    'ヘルスケア・医療テック': ['ヘルスケア', '医療', '介護', '見守り', 'バイタル', '患者', '病院', 'シニア', 'リハビリ'],
    'アグリ・フードテック': ['農業', 'アグリ', '植物工場', '食品', 'フードテック', '栽培', '収穫', '農作物'],
    'セキュリティ・防犯・防災': ['セキュリティ', '防犯', '防災', '監視', 'サイバー', '暗号', '認証', 'インフラ保護'],
    'IT・エンタープライズSaaS': ['SaaS', 'クラウド', '業務効率化', 'ソフトウェア', 'プラットフォーム', 'API', 'DX'],
    '宇宙・ディープテック': ['宇宙', '衛星', '量子', '核融合', 'ディープテック', '先端物理'],
}

BIG_CORP_KEYWORDS = ['重工業', 'ホールディングス', 'グループ', '電力', 'ガス', '製鉄', '銀行', '証券', '生命保険', '損害保険']

def extract_year(text: str) -> int | None:
    patterns = [
        r'(?:設立|創業|設立年月)[\s:：]*([12][90]\d\d)年?',
        r'([12][90]\d\d)年[\s:：]*(?:設立|創業)',
    ]
    for p in patterns:
        m = re.search(p, text)
        if m:
            try:
                return int(m.group(1))
            except ValueError:
                pass
    return None

def classify_exhibitor(company_name: str, description: str, raw_text: str = '') -> Dict[str, Any]:
    full_text = f"{company_name} {description} {raw_text}"
    full_text_lower = full_text.lower()

    # 1. アスフカケツノ
    asufukaketsu = []
    for key, kw_list in ASUFUKAKETSU_KEYWORDS.items():
        score = sum(1 for kw in kw_list if kw.lower() in full_text_lower)
        if score >= 1:
            asufukaketsu.append(key)

    # 2. 高市17分野
    takaichi17 = []
    for field, kw_list in TAKAICHI_17_KEYWORDS.items():
        score = sum(1 for kw in kw_list if kw.lower() in full_text_lower)
        if score >= 1:
            takaichi17.append(field)

    # 3. 産業分類
    industries = []
    for ind, kw_list in INDUSTRY_KEYWORDS.items():
        score = sum(1 for kw in kw_list if kw.lower() in full_text_lower)
        if score >= 1:
            industries.append(ind)
    if not industries:
        industries.append('その他産業')

    # 4. 設立年判定
    est_year = extract_year(full_text)
    current_year = 2026
    years_since = (current_year - est_year) if est_year else None

    # 5. スタートアップ判定 & スコアリング
    startup_score = 50
    is_big_corp = any(bk in company_name for bk in BIG_CORP_KEYWORDS)

    if is_big_corp:
        startup_score = 15
        is_startup = False
    else:
        # 新興企業加点
        if est_year:
            if years_since is not None and years_since <= 5:
                startup_score += 35
            elif years_since is not None and years_since <= 10:
                startup_score += 25
            else:
                startup_score -= 20
        else:
            # 設立年不明でも特定キーワードがあればスタートアップ可能性高い
            startup_score += 15

        # キーワード加点
        tech_keywords = ['ai', 'ロボット', '自律', 'saas', 'クラウド', 'センサ', 'アルゴリズム', 'プラットフォーム', '次世代', '東大発', '大学発', 'ベンチャー', 'スタートアップ']
        for tk in tech_keywords:
            if tk in full_text_lower:
                startup_score += 5

        # 大企業名（株式会社〇〇製作所、〇〇工業などで設立年が古い場合を抑える）
        if re.search(r'(製作所|工業|電設|建機|商事)$', company_name) and (not est_year or (years_since and years_since > 15)):
            startup_score -= 20

        startup_score = max(5, min(98, startup_score))
        is_startup = startup_score >= 60

    # 6. 調達フェーズ推定
    funding_stage = '未特定'
    if 'シリーズc' in full_text_lower or 'シリーズ c' in full_text_lower:
        funding_stage = 'シリーズC以降'
    elif 'シリーズb' in full_text_lower or 'シリーズ b' in full_text_lower:
        funding_stage = 'シリーズB'
    elif 'シリーズa' in full_text_lower or 'シリーズ a' in full_text_lower:
        funding_stage = 'シリーズA'
    elif 'シード' in full_text_lower or 'プレシード' in full_text_lower:
        funding_stage = 'シード'
    elif is_startup:
        funding_stage = 'シード' if (years_since and years_since <= 3) else 'シリーズA'

    return {
        'asufukaketsu': asufukaketsu,
        'takaichi17': takaichi17,
        'industries': industries[:3],
        'establishedYear': est_year,
        'yearsSinceEst': years_since,
        'isStartup': is_startup,
        'startupScore': startup_score,
        'fundingStage': funding_stage,
    }

if __name__ == '__main__':
    sample = classify_exhibitor(
        'ロボテックス株式会社',
        '建設現場向けに自動墨出しロボットとBIM連携ソフトウェアを開発。2023年設立。AI画像認識により省施工を実現する。'
    )
    print("Classify Result:", sample)
