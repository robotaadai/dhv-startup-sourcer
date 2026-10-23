import { ExhibitionEvent } from '@/types';

/**
 * 展示会場およびサミットごとの公式フロアマップ・会場案内URLを解決する
 */
export function getEventFloorMapUrl(event: ExhibitionEvent): string {
  // イベント個別のマップURLが設定されている場合は最優先
  if (event.floorMapUrl) {
    return event.floorMapUrl;
  }

  const venue = event.venue || '';
  const title = event.title || '';

  // イベント固有の出展社・フロアマップ専用ページ
  if (title.includes('JAPAN BUILD')) {
    return 'https://www.japan-build.jp/tokyo/ja-jp/visit/floorguide.html';
  }
  if (title.includes('スマートファクトリー')) {
    return 'https://biz.nikkan.co.jp/eve/smart-factory/';
  }
  if (title.includes('Robot Week') || title.includes('ロボット')) {
    return 'https://biz.nikkan.co.jp/eve/s-robot/';
  }
  if (title.includes('脱炭素経営') || title.includes('スマートエネルギー')) {
    return 'https://www.decarbonization-expo.jp/';
  }
  if (title.includes('ものづくり') && title.includes('大阪')) {
    return 'https://www.japan-mfg-kansai.jp/';
  }
  if (title.includes('オートモーティブ') && title.includes('名古屋')) {
    return 'https://www.automotiveworld.jp/nagoya/ja-jp.html';
  }
  if (title.includes('B Dash Camp')) {
    return 'https://camp.bdashventures.com/';
  }
  if (title.includes('SusHi Tech')) {
    return 'https://sushitech-startup.metro.tokyo.lg.jp/';
  }
  if (title.includes('IVS')) {
    return 'https://www.ivs.events/';
  }
  if (title.includes('ICC')) {
    return 'https://industry-co-creation.com/';
  }
  if (title.includes('Plug and Play')) {
    return 'https://japan.plugandplaytechcenter.com/';
  }
  if (title.includes('Morning Pitch')) {
    return 'https://morningpitch.com/';
  }
  if (title.includes('Rocket Pitch') || title.includes('Venture Café')) {
    return 'https://venturecafetokyo.org/';
  }

  // 会場公式のフロアマップ・施設案内ガイド
  if (venue.includes('Tokyo Innovation Base') || venue.includes('TIB')) {
    return 'https://tib.metro.tokyo.lg.jp/';
  }
  if (venue.includes('SHIBUYA QWS') || venue.includes('渋谷キューズ')) {
    return 'https://shibuya-qws.com/about/floor';
  }
  if (venue.includes('QUINTBRIDGE')) {
    return 'https://www.quintbridge.jp/about/';
  }
  if (venue.includes('STATION Ai')) {
    return 'https://stationai.co.jp/';
  }
  if (venue.includes('パレスホテル')) {
    return 'https://www.palacehoteltokyo.com/banquet/floor-map/';
  }
  if (venue.includes('ビッグサイト')) {
    return 'https://www.bigsight.jp/visitor/floormap/';
  }
  if (venue.includes('幕張メッセ')) {
    return 'https://www.m-messe.co.jp/facility/';
  }
  if (venue.includes('パシフィコ横浜')) {
    return 'https://www.pacifico.co.jp/visitor/floorguide';
  }
  if (venue.includes('インテックス大阪')) {
    return 'https://www.intex-osaka.com/jp/facilities/';
  }
  if (venue.includes('ポートメッセ')) {
    return 'https://portmesse.com/facility';
  }
  if (venue.includes('福岡国際会議場') || venue.includes('マリンメッセ')) {
    return 'https://www.marinemesse.org/congress/facilities/';
  }
  if (venue.includes('みやこめっせ')) {
    return 'https://www.miyakomesse.jp/floor/';
  }
  if (venue.includes('虎ノ門ヒルズ')) {
    return 'https://forum.academyhills.com/toranomon/floor/';
  }

  // フォールバック: 展示会公式HP
  return event.officialUrl || 'https://www.bigsight.jp/visitor/floormap/';
}
