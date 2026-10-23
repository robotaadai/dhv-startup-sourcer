"""
DHV Startup Sourcer - スマートディープリンク生成
INITIAL, Kepple, Google, 法人番号公表サイトへの確実な検索URL生成
"""

import urllib.parse
import re

def clean_company_name(name: str) -> str:
    cleaned = re.sub(r'^(株式会社|合同会社|有限会社|一般社団法人|特定非営利活動法人)', '', name)
    cleaned = re.sub(r'(株式会社|合同会社|有限会社|Inc\.|Co\.,\s*Ltd\.|LLC)$', '', cleaned)
    return cleaned.strip()

def generate_links(company_name: str) -> dict:
    cleaned = clean_company_name(company_name)
    encoded_clean = urllib.parse.quote(cleaned)
    encoded_full = urllib.parse.quote(company_name)

    # INITIAL: Google経由で site:initial.inc/companies/ を直接ヒットさせる (404回避 & 個別ページ直行)
    initial_google_query = urllib.parse.quote(f'site:initial.inc "{cleaned}"')
    initial_url = f"https://www.google.com/search?q={initial_google_query}"

    # Kepple: Kepple DB / コーポレートサイト直行クエリ
    kepple_google_query = urllib.parse.quote(f'site:kepple.co.jp OR site:kepple-db.com "{cleaned}"')
    kepple_url = f"https://www.google.com/search?q={kepple_google_query}"

    # Google 資金調達検索
    encoded_search = urllib.parse.quote(f'"{company_name}" スタートアップ 資金調達')
    google_search_url = f"https://www.google.com/search?q={encoded_search}"

    # Google ニュース
    google_news_url = f"https://www.google.com/search?q={encoded_full}&tbm=nws"

    # 国税庁 法人番号検索
    corporate_number_url = f"https://www.houjin-bangou.nta.go.jp/kensaku-kekka.html?nm={encoded_clean}"

    return {
        'initialUrl': initial_url,
        'keppleUrl': kepple_url,
        'googleSearchUrl': google_search_url,
        'googleNewsUrl': google_news_url,
        'corporateNumberUrl': corporate_number_url,
    }

if __name__ == '__main__':
    print("Links for ugo:", generate_links("ugo株式会社"))
