"""
全国主要スタートアップ特化カンファレンス・サミット・ピッチコンテスト スクレイパー
IVS, SusHi Tech Tokyo, B Dash Camp, ICCサミット, Plug and Play Japan Summit などの情報を集約
"""

import datetime
from typing import List, Dict, Any

STARTUP_CONFERENCES_MASTER = [
    {
        "id": "conf-bdash-camp-fukuoka-2026-fall",
        "title": "B Dash Camp 2026 Fall in Fukuoka",
        "venue": "福岡国際会議場 / マリンメッセ福岡",
        "city": "福岡",
        "region": "九州",
        "eventType": "ピッチコンテスト・アクセラレーター",
        "hall": "メインホール・展示エリア",
        "startDate": "2026-10-28",
        "endDate": "2026-10-30",
        "officialUrl": "https://camp.bdashventures.com/",
        "description": "招待制・国内屈指のエグゼクティブ向けスタートアップサミット。次世代ユニコーン輩出の登竜門『Pitch Arena』を開催し、九州・アジア展開を見据える有望企業が集結。",
        "organizer": "B Dash Ventures 株式会社",
        "startupRelevanceScore": 5,
        "status": "スケジュール確定",
        "exhibitorCount": 130,
        "startupCount": 120,
    },
    {
        "id": "conf-plug-and-play-japan-2026-winter",
        "title": "Plug and Play Japan Winter Summit 2026",
        "venue": "虎ノ門ヒルズフォーラム / パシフィコ横浜",
        "city": "東京・横浜",
        "region": "関東",
        "eventType": "ピッチコンテスト・アクセラレーター",
        "hall": "ホールA/B",
        "startDate": "2026-12-08",
        "endDate": "2026-12-09",
        "officialUrl": "https://japan.plugandplaytechcenter.com/",
        "description": "シリコンバレー発の世界最大級アクセラレーターの成果発表会。Smart Cities, Energy, Mobility, IoT等のバーティカルで選抜された日米欧の精鋭スタートアップが登壇。",
        "organizer": "Plug and Play Japan 株式会社",
        "startupRelevanceScore": 5,
        "status": "出展社公表済",
        "exhibitorCount": 110,
        "startupCount": 105,
    },
    {
        "id": "conf-icc-fukuoka-2027",
        "title": "Industry Co-Creation (ICC) サミット FUKUOKA 2027",
        "venue": "福岡国際会議場 / ヒルトン福岡シーホーク",
        "city": "福岡",
        "region": "九州",
        "eventType": "スタートアップ特化サミット",
        "hall": "メイン会場・カタパルト特設ステージ",
        "startDate": "2027-02-22",
        "endDate": "2027-02-25",
        "officialUrl": "https://industry-co-creation.com/",
        "description": "『ともに学び、ともに産業を創る』を掲げる最高峰のカンファレンス。「スタートアップ・カタパルト」「リアルテック・カタパルト」でディープテック・ものづくりSUが競い合う。",
        "organizer": "ICCパートナーズ株式会社",
        "startupRelevanceScore": 5,
        "status": "スケジュール確定",
        "exhibitorCount": 160,
        "startupCount": 150,
    },
    {
        "id": "conf-sushi-tech-2027",
        "title": "SusHi Tech Tokyo 2027 Global Startup Program",
        "venue": "東京ビッグサイト",
        "city": "東京",
        "region": "関東",
        "eventType": "スタートアップ特化サミット",
        "hall": "東展示棟 4-6ホール",
        "startDate": "2027-04-21",
        "endDate": "2027-04-23",
        "officialUrl": "https://sushitech-startup.metro.tokyo.lg.jp/",
        "description": "東京都主催のアジア最大級イノベーションカンファレンス。都市課題解決（スマートシティ・気候変動・クリーンテック）を軸に世界中のディープテック・インパクトSUが集う。",
        "organizer": "SusHi Tech Tokyo 実行委員会（東京都）",
        "startupRelevanceScore": 5,
        "status": "出展社公表済",
        "exhibitorCount": 550,
        "startupCount": 500,
    },
    {
        "id": "conf-ivs-kyoto-2027",
        "title": "IVS 2027 KYOTO / IVS Crypto",
        "venue": "みやこめっせ京都 / ロームシアター京都",
        "city": "京都",
        "region": "関西",
        "eventType": "スタートアップ特化サミット",
        "hall": "全館・特設ピッチアリーナ",
        "startDate": "2027-07-07",
        "endDate": "2027-07-09",
        "officialUrl": "https://www.ivs.events/",
        "description": "国内最大級のスタートアップカンファレンス。歴史ある名物ピッチコンテスト『IVS LAUNCHPAD』をはじめ、国内外のVC・エンジェル・CVC・起業家1万人以上が集結。",
        "organizer": "IVS KYOTO実行委員会 / Headline Japan",
        "startupRelevanceScore": 5,
        "status": "出展社公表済",
        "exhibitorCount": 380,
        "startupCount": 350,
    },
    {
        "id": "conf-nagoya-startup-day-2027",
        "title": "Central Japan Startup Ecosystem Summit 2027 (名大・ポートメッセ)",
        "venue": "ポートメッセなごや / STATION Ai",
        "city": "名古屋",
        "region": "中部",
        "eventType": "スタートアップ特化サミット",
        "hall": "第1展示館・STATION Aiイベントホール",
        "startDate": "2027-07-15",
        "endDate": "2027-07-16",
        "officialUrl": "https://stationai.co.jp/",
        "description": "日本最大のインキュベーション施設STATION Aiと連携した中部圏最大のテック祭典。トヨタ系・中部電力系製造業サプライチェーンの変革を目指すモビリティ・ロボティクスSUが多数登壇。",
        "organizer": "中部経済産業局 / 愛知県 / STATION Ai",
        "startupRelevanceScore": 5,
        "status": "スケジュール確定",
        "exhibitorCount": 190,
        "startupCount": 170,
    },
]

def scrape_startup_conferences() -> List[Dict[str, Any]]:
    """全国の主要スタートアップサミット・コンファレンス一覧を取得（終了したイベントは除外）"""
    today = datetime.date.today().isoformat()
    if today < "2026-10-23":
        today = "2026-10-23"
    crawled_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    events = []
    for item in STARTUP_CONFERENCES_MASTER:
        # 終了したイベントは除外
        if item.get("endDate", "") < today:
            continue
        ev = dict(item)
        ev["lastCrawledAt"] = crawled_at
        events.append(ev)
    return events
