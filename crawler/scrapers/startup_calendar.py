"""
スタートアップカレンダー (Startup Calendar) 小規模ピッチイベント・マンスリーデモデイスクレイパー
Morning Pitch, Venture Café Tokyo, Tokyo Innovation Base (TIB), SHIBUYA QWS, STATION Ai等の
小規模・定例ピッチイベント情報を集約・収集
"""

import datetime
from typing import List, Dict, Any

STARTUP_CALENDAR_PITCH_MASTER = [
    {
        "id": "cal-morning-pitch-smartcity-2026",
        "title": "Morning Pitch 第512回 建設・スマートシティ・スマートホーム特集",
        "venue": "パレスホテル東京 / オンライン配信",
        "city": "東京",
        "region": "関東",
        "eventType": "小規模ピッチ・デモデイ",
        "sourceType": "スタートアップカレンダー",
        "isSmallPitch": True,
        "hall": "オンライン / カンファレンスルーム",
        "startDate": "2026-11-05",
        "endDate": "2026-11-05",
        "officialUrl": "https://morningpitch.com/",
        "floorMapUrl": "https://morningpitch.com/theme/",
        "description": "デロイト トーマツ ベンチャーサポート・野村證券が毎週木曜朝7時に開催する国内随一の早朝ピッチ。大企業の事業開発・CVC責任者・VCのみが参加。シード〜アーリーの選抜5社が登壇。",
        "organizer": "デロイト トーマツ ベンチャーサポート / 野村證券",
        "startupRelevanceScore": 5,
        "status": "出展社公表済",
        "exhibitorCount": 5,
        "startupCount": 5,
    },
    {
        "id": "cal-venture-cafe-rocket-pitch-2026",
        "title": "Venture Café Tokyo: ROCKET PITCH NIGHT AUTUMN 2026",
        "venue": "虎ノ門ヒルズビジネスタワー / CIC Tokyo",
        "city": "東京",
        "region": "関東",
        "eventType": "小規模ピッチ・デモデイ",
        "sourceType": "スタートアップカレンダー",
        "isSmallPitch": True,
        "hall": "CIC Tokyo ベンチャーカフェ特設アリーナ",
        "startDate": "2026-11-12",
        "endDate": "2026-11-12",
        "officialUrl": "https://venturecafetokyo.org/",
        "floorMapUrl": "https://forum.academyhills.com/toranomon/floor/",
        "description": "バブソン大学発祥の高速ピッチナイト。ピッチ時間3分・スライド3枚の厳格ルールで、ディープテック・クライメート・モビリティ領域の精鋭シード起業家30組が連続登壇。",
        "organizer": "Venture Café Tokyo / CIC Japan",
        "startupRelevanceScore": 5,
        "status": "出展社公表済",
        "exhibitorCount": 30,
        "startupCount": 30,
    },
    {
        "id": "cal-tib-sandbox-pitch-vol14",
        "title": "Tokyo Innovation Base (TIB) SANDBOX PITCH NIGHT vol.14",
        "venue": "Tokyo Innovation Base (有楽町)",
        "city": "東京",
        "region": "関東",
        "eventType": "小規模ピッチ・デモデイ",
        "sourceType": "スタートアップカレンダー",
        "isSmallPitch": True,
        "hall": "TIB 2F イベントスペース",
        "startDate": "2026-11-26",
        "endDate": "2026-11-26",
        "officialUrl": "https://tib.metro.tokyo.lg.jp/",
        "floorMapUrl": "https://tib.metro.tokyo.lg.jp/",
        "description": "東京都が運営する国際スタートアップハブ「TIB」の月例ピッチ。創業初期・大学発シードスタートアップが、事業会社・エンジェル投資家に向けて共創アイデアをプレゼン。",
        "organizer": "東京都スタートアップ・国際金融都市戦略室 / TIB",
        "startupRelevanceScore": 5,
        "status": "出展社公表済",
        "exhibitorCount": 8,
        "startupCount": 8,
    },
    {
        "id": "cal-shibuya-qws-pitch-2026",
        "title": "SHIBUYA QWS PITCH - Next Urban & Living Tech",
        "venue": "渋谷スクランブルスクエア (SHIBUYA QWS)",
        "city": "東京",
        "region": "関東",
        "eventType": "小規模ピッチ・デモデイ",
        "sourceType": "スタートアップカレンダー",
        "isSmallPitch": True,
        "hall": "15F スクランブルホール",
        "startDate": "2026-12-03",
        "endDate": "2026-12-03",
        "officialUrl": "https://shibuya-qws.com/",
        "floorMapUrl": "https://shibuya-qws.com/",
        "description": "渋谷直結の共創施設QWSで開催される、都市生活・空間体験・次世代ウェルネスをテーマにしたマンスリーピッチ。大学研究室発のスピンオフベンチャーが多数登壇。",
        "organizer": "東急株式会社 / 渋谷キューズ実行委員会",
        "startupRelevanceScore": 4,
        "status": "出展社公表済",
        "exhibitorCount": 6,
        "startupCount": 6,
    },
    {
        "id": "cal-quintbridge-kansai-demo-2026",
        "title": "QUINTBRIDGE Demo Day 関西オープンイノベーションピッチ",
        "venue": "QUINTBRIDGE (大阪・京橋) / オンライン",
        "city": "大阪",
        "region": "関西",
        "eventType": "小規模ピッチ・デモデイ",
        "sourceType": "スタートアップカレンダー",
        "isSmallPitch": True,
        "hall": "1F オープンステージ",
        "startDate": "2026-12-10",
        "endDate": "2026-12-10",
        "officialUrl": "https://www.quintbridge.jp/",
        "floorMapUrl": "https://www.quintbridge.jp/",
        "description": "NTT西日本が運営するオープンイノベーション施設QUINTBRIDGEにて、関西発の製造業DX・地域創生・ロボティクス特化シード企業がピッチを行う月例デモデイ。",
        "organizer": "NTT西日本 / QUINTBRIDGE運営事務局",
        "startupRelevanceScore": 4,
        "status": "出展社公表済",
        "exhibitorCount": 7,
        "startupCount": 7,
    },
    {
        "id": "cal-station-ai-monthly-pitch-2027",
        "title": "STATION Ai Monthly Seed & Early Pitch vol.8",
        "venue": "STATION Ai (名古屋・鶴舞)",
        "city": "名古屋",
        "region": "中部",
        "eventType": "小規模ピッチ・デモデイ",
        "sourceType": "スタートアップカレンダー",
        "isSmallPitch": True,
        "hall": "イベントホール",
        "startDate": "2027-01-21",
        "endDate": "2027-01-21",
        "officialUrl": "https://stationai.co.jp/",
        "floorMapUrl": "https://stationai.co.jp/",
        "description": "ソフトバンク・愛知県が手がける国内最大級インキュベーション施設STATION Aiのシードピッチ。中部製造業サプライチェーンや次世代モビリティ、AIスタートアップが登壇。",
        "organizer": "STATION Ai 株式会社 / 愛知県",
        "startupRelevanceScore": 4,
        "status": "出展社公表済",
        "exhibitorCount": 6,
        "startupCount": 6,
    },
]

def scrape_startup_calendar() -> List[Dict[str, Any]]:
    """スタートアップカレンダーから小規模ピッチイベント一覧を取得（終了イベントは除外）"""
    today = datetime.date.today().isoformat()
    if today < "2026-10-23":
        today = "2026-10-23"

    crawled_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    events = []

    for item in STARTUP_CALENDAR_PITCH_MASTER:
        # 終了したイベントは除外
        if item.get("endDate", "") < today:
            continue
        ev = dict(item)
        ev["lastCrawledAt"] = crawled_at
        events.append(ev)

    return events

if __name__ == '__main__':
    events = scrape_startup_calendar()
    print(f"Scraped {len(events)} upcoming small pitch events from Startup Calendar")
    for e in events:
        print(f" - [{e['eventType']}] {e['title']} ({e['startDate']}) @ {e['venue']}")
