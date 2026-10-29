export function cleanCompanyName(name: string): string {
  return name.replace(/(株式会社|合同会社|有限会社|Inc\.|Co\.,\s*Ltd\.|LLC)/g, '').trim();
}

export function generateInitialUrl(companyName: string): string {
  const clean = cleanCompanyName(companyName);
  return `https://www.google.com/search?q=${encodeURIComponent(`site:initial.inc "${clean}"`)}`;
}

export function generateKeppleUrl(companyName: string): string {
  const clean = cleanCompanyName(companyName);
  return `https://www.google.com/search?q=${encodeURIComponent(`site:kepple.co.jp OR site:kepple-db.com "${clean}"`)}`;
}

export function generateGoogleSearchUrl(companyName: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`"${companyName}" スタートアップ 資金調達`)}`;
}

export function generateGoogleNewsUrl(companyName: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(companyName)}&tbm=nws`;
}

export function generateCorporateNumberUrl(companyName: string): string {
  const clean = cleanCompanyName(companyName);
  return `https://www.houjin-bangou.nta.go.jp/kensaku-kekka.html?nm=${encodeURIComponent(clean)}`;
}
