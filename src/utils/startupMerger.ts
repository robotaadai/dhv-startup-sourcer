import { StartupExhibitor, UpcomingMeetingEvent } from '@/types';

/**
 * 企業名を正規化して一意キーを生成（「株式会社」「合同会社」「Inc.」等の法人格やスペースを除去）
 */
export function normalizeCompanyName(name: string): string {
  return name
    .replace(/(株式会社|合同会社|有限会社|一般社団法人|Corp\.|Inc\.|Co\.,\s*Ltd\.)/gi, '')
    .replace(/\s+/g, '')
    .toLowerCase()
    .trim();
}

/**
 * 基準日からの残り日数を計算
 */
function calculateDaysUntil(startDate?: string, baseDateStr: string = '2026-10-27'): number {
  if (!startDate) return 999;
  const target = new Date(startDate).getTime();
  const base = new Date(baseDateStr).getTime();
  const diffDays = Math.ceil((target - base) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays);
}

/**
 * 複数イベントに出展するスタートアップおよび重複レコードを統合する
 */
export function mergeAndDeduplicateStartups(
  startups: StartupExhibitor[],
  baseDateStr: string = '2026-10-27'
): StartupExhibitor[] {
  const groupMap = new Map<string, StartupExhibitor[]>();

  for (const st of startups) {
    const key = normalizeCompanyName(st.companyName) || st.companyName.trim();
    const existing = groupMap.get(key) || [];
    existing.push(st);
    groupMap.set(key, existing);
  }

  const mergedList: StartupExhibitor[] = [];

  for (const [, list] of groupMap.entries()) {
    if (list.length === 1) {
      const st = list[0];
      // 単一レコードでも upcomingMeetingEvents が未設定なら自身のイベントから作成
      const events: UpcomingMeetingEvent[] = (st.upcomingMeetingEvents && st.upcomingMeetingEvents.length > 0)
        ? [...st.upcomingMeetingEvents]
        : [];

      const isRealEvent = Boolean(
        st.eventName &&
        !st.eventName.includes('直近の出展予定なし') &&
        !st.eventName.includes('次回未定') &&
        st.eventStartDate
      );

      if (events.length === 0 && isRealEvent) {
        events.push({
          eventId: st.eventName + '_' + (st.eventStartDate || ''),
          eventName: st.eventName,
          eventUrl: st.eventUrl || '',
          venue: st.eventVenue || '',
          boothNumber: st.boothNumber || '—',
          startDate: st.eventStartDate || '',
          endDate: st.eventEndDate || '',
          region: st.region || '関東',
          eventType: st.eventType || '大型産業展示会',
          pitchSession: st.pitchInfo,
          daysUntil: calculateDaysUntil(st.eventStartDate, baseDateStr),
        });
      }

      mergedList.push({
        ...st,
        hasUpcomingEvent: isRealEvent,
        upcomingMeetingEvents: events,
      });
      continue;
    }

    // 複数レコードが存在する場合のマージ処理
    // 1. 実イベント情報を持つものを優先してベース候補にする
    const realEventRecords = list.filter(
      (item) =>
        item.eventName &&
        !item.eventName.includes('直近の出展予定なし') &&
        !item.eventName.includes('次回未定') &&
        item.eventStartDate
    );

    // 最も直近のイベント日を持つレコード、または高スコアのレコードをベースとする
    realEventRecords.sort((a, b) => {
      const dateA = a.eventStartDate || '9999-99-99';
      const dateB = b.eventStartDate || '9999-99-99';
      return dateA.localeCompare(dateB);
    });

    const baseRecord = realEventRecords[0] || list[0];

    // 2. すべての出展イベントを集約（重複イベント名は除去）
    const allEventsMap = new Map<string, UpcomingMeetingEvent>();

    for (const item of list) {
      // 既存の upcomingMeetingEvents があれば取り込む
      if (item.upcomingMeetingEvents) {
        for (const ev of item.upcomingMeetingEvents) {
          if (ev.eventName && !ev.eventName.includes('出展予定なし')) {
            allEventsMap.set(ev.eventName, {
              ...ev,
              daysUntil: calculateDaysUntil(ev.startDate, baseDateStr),
            });
          }
        }
      }

      // 自身のイベント情報があれば取り込む
      if (
        item.eventName &&
        !item.eventName.includes('直近の出展予定なし') &&
        !item.eventName.includes('次回未定') &&
        item.eventStartDate
      ) {
        if (!allEventsMap.has(item.eventName)) {
          allEventsMap.set(item.eventName, {
            eventId: item.eventName + '_' + (item.eventStartDate || ''),
            eventName: item.eventName,
            eventUrl: item.eventUrl || '',
            venue: item.eventVenue || '',
            boothNumber: item.boothNumber || '—',
            startDate: item.eventStartDate || '',
            endDate: item.eventEndDate || '',
            region: item.region || '関東',
            eventType: item.eventType || '大型産業展示会',
            pitchSession: item.pitchInfo,
            daysUntil: calculateDaysUntil(item.eventStartDate, baseDateStr),
          });
        }
      }
    }

    // 日付順にソート（直近が先頭になる）
    const mergedEvents = Array.from(allEventsMap.values()).sort((a, b) =>
      a.startDate.localeCompare(b.startDate)
    );

    const hasUpcomingEvent = mergedEvents.length > 0;
    const nextEvent = mergedEvents[0];

    // 3. アスフカケツノ・高市17・産業カテゴリのユニオン
    const asufukaketsuSet = new Set<string>();
    const takaichi17Set = new Set<string>();
    const industriesSet = new Set<string>();

    for (const item of list) {
      (item.asufukaketsu || []).forEach((k) => asufukaketsuSet.add(k));
      (item.takaichi17 || []).forEach((f) => takaichi17Set.add(f));
      (item.industries || []).forEach((i) => industriesSet.add(i));
    }

    // 4. 最もリッチな属性の選択
    const bestExpectation =
      list.find((item) => item.expectation && item.expectation.totalScore > 0)?.expectation ||
      baseRecord.expectation;

    const bestDescription =
      list.reduce((prev, curr) =>
        (curr.description?.length || 0) > (prev.description?.length || 0) ? curr : prev
      ).description || baseRecord.description;

    const bestAiSummary =
      list.reduce((prev, curr) =>
        (curr.aiSummary?.length || 0) > (prev.aiSummary?.length || 0) ? curr : prev
      ).aiSummary || baseRecord.aiSummary;

    // ステータスとメモの統合
    const nonDefaultStatusItem = list.find((item) => item.dhvStatus && item.dhvStatus !== '未対応');
    const mergedStatus = nonDefaultStatusItem ? nonDefaultStatusItem.dhvStatus : baseRecord.dhvStatus;

    const allMemos = list
      .map((item) => item.memo?.trim())
      .filter((m): m is string => Boolean(m && m.length > 0));
    const mergedMemo = Array.from(new Set(allMemos)).join('\n');

    // 5. 統合レコード構築
    const mergedStartup: StartupExhibitor = {
      ...baseRecord,
      eventName: nextEvent ? nextEvent.eventName : (baseRecord.eventName || '直近の出展予定なし'),
      eventVenue: nextEvent ? nextEvent.venue : (baseRecord.eventVenue || '次回未定'),
      boothNumber: nextEvent ? nextEvent.boothNumber : (baseRecord.boothNumber || '—'),
      eventStartDate: nextEvent ? nextEvent.startDate : (baseRecord.eventStartDate || ''),
      eventEndDate: nextEvent ? nextEvent.endDate : (baseRecord.eventEndDate || ''),
      eventUrl: nextEvent ? nextEvent.eventUrl : (baseRecord.eventUrl || ''),
      pitchInfo: nextEvent?.pitchSession || baseRecord.pitchInfo,
      region: nextEvent?.region || baseRecord.region,
      eventType: nextEvent?.eventType || baseRecord.eventType,
      hasUpcomingEvent,
      upcomingMeetingEvents: mergedEvents,
      asufukaketsu: Array.from(asufukaketsuSet) as any[],
      takaichi17: Array.from(takaichi17Set) as any[],
      industries: Array.from(industriesSet) as any[],
      description: bestDescription,
      aiSummary: bestAiSummary,
      expectation: bestExpectation,
      dhvStatus: mergedStatus,
      memo: mergedMemo,
      isDHVPortfolio: list.some((item) => item.isDHVPortfolio),
      isStartup: list.some((item) => item.isStartup),
    };

    mergedList.push(mergedStartup);
  }

  return mergedList;
}
