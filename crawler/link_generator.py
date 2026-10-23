"""
DHV Startup Sourcer - スマートディープリンク生成
INITIAL, Kepple, Google, 法人番号公表サイトへの検索URL生成
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
    encoded_search = urllib.parse.quote(f"{company_name} スタートアップ 資金調達")

    return {
        'initialUrl': f"https://initial.inc/search?q={encoded_clean}",
        'keppleUrl': f"https://kepple.co.jp/search?q={encoded_clean}",
        'googleSearchUrl': f"https://www.google.com/search?q={encoded_search}",
        'googleNewsUrl': f"https://www.google.com/search?q={encoded_full}&tbm=nws",
        'corporateNumberUrl': f"https://www.houjin-bangou.nta.go.jp/kensaku-kekka.html?nm={encoded_clean}",
    }

if __name__ == '__main__':
    print("Links:", generate_links("フィジカルマインド株式会社"))
