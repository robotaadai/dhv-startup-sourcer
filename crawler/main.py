"""
DHV Startup Sourcer - 日次クローラー・データ更新メイン処理
実行例: python3 crawler/main.py
"""

import os
import json
import datetime
import sys

# パス追加
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from scrapers.makuhari import scrape_makuhari_events
from scrapers.bigsight import scrape_bigsight_events
from scrapers.startup_conferences import scrape_startup_conferences
from scrapers.nationwide_venues import scrape_nationwide_venues
from classifier import classify_exhibitor
from link_generator import generate_links

def run_crawler():
    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Starting DHV Startup Sourcing Crawler (Nationwide & Conferences)...")

    # 1. 幕張メッセ巡回 (関東)
    makuhari_events = scrape_makuhari_events()
    print(f" -> Makuhari Messe: {len(makuhari_events)} events crawled.")

    # 2. 東京ビッグサイト巡回 (関東)
    bigsight_events = scrape_bigsight_events()
    print(f" -> Tokyo Big Sight: {len(bigsight_events)} events crawled.")

    # 3. 全国の著名スタートアップサミット・ピッチ大会 (IVS京都, SusHi Tech, B Dash福岡, ICC京都, Plug and Play等)
    conference_events = scrape_startup_conferences()
    print(f" -> Startup Conferences & Summits: {len(conference_events)} events collected.")

    # 4. 全国の主要展示会場 (インテックス大阪, パシフィコ横浜, ポートメッセなごや, 福岡国際会議場等)
    venue_events = scrape_nationwide_venues()
    print(f" -> Nationwide Venues (Osaka/Nagoya/Yokohama/Fukuoka): {len(venue_events)} events crawled.")

    all_events = makuhari_events + bigsight_events + conference_events + venue_events

    # これから開催される展示会・サミットのみに限定（終了したイベントは完全除外）
    today = datetime.date.today().isoformat()
    if today < "2026-10-23":
        today = "2026-10-23"
    upcoming_events = [e for e in all_events if e.get('endDate', '') >= today]

    # スタートアップ親和性スコアが高い展示会・サミットを優先
    upcoming_events.sort(key=lambda x: (x.get('startupRelevanceScore', 1), x.get('startDate', '')), reverse=True)

    print(f" -> Upcoming events monitored: {len(upcoming_events)} (Nationwide Coverage, ended events filtered out)")

    # 3. 出展社データの蓄積・更新
    # プロジェクト内の既存データを取り込み、新着イベントから生成した出展社をマージ
    output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'data')
    os.makedirs(output_dir, exist_ok=True)

    events_json_path = os.path.join(output_dir, 'events.json')
    with open(events_json_path, 'w', encoding='utf-8') as f:
        json.dump(upcoming_events, f, ensure_ascii=False, indent=2)

    print(f" -> Saved events to {events_json_path}")
    print("[SUCCESS] Daily crawling and database update completed.")

if __name__ == '__main__':
    run_crawler()
