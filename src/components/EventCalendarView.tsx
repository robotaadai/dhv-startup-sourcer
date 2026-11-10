'use client';

import React, { useState, useMemo } from 'react';
import { ExhibitionEvent } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  ExternalLink,
  Sparkles,
  Users,
  Building,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { getEventFloorMapUrl } from '@/utils/floorMap';

interface EventCalendarViewProps {
  events: ExhibitionEvent[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
  onDeleteCustomEvent?: (eventId: string) => void;
  todayStr?: string;
}

export const EventCalendarView: React.FC<EventCalendarViewProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
  onDeleteCustomEvent,
  todayStr = '2026-11-10',
}) => {
  // 初期表示年月: 2026年11月（今日の日付に基づく）
  const [currentYear, setCurrentYear] = useState<number>(() => {
    return parseInt(todayStr.slice(0, 4), 10) || 2026;
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    return parseInt(todayStr.slice(5, 7), 10) || 11;
  });

  // 前月・次月移動
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpTo = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  // カレンダーの日付グリッド計算
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);

    const startWeekday = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = lastDayOfMonth.getDate();

    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      events: ExhibitionEvent[];
    }[] = [];

    // 前月の余白日
    const prevMonthLastDay = new Date(currentYear, currentMonth - 1, 0).getDate();
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevM = currentMonth === 1 ? 12 : currentMonth - 1;
      const prevY = currentMonth === 1 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: [],
      });
    }

    // 当月の日付
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      // この日に開催されているイベント
      const dayEvents = events.filter((evt) => {
        if (!evt.startDate) return false;
        const end = evt.endDate || evt.startDate;
        return evt.startDate <= dateStr && dateStr <= end;
      });

      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        events: dayEvents,
      });
    }

    // 翌月の余白日（7の倍数になるよう埋める）
    const remainingDays = (7 - (days.length % 7)) % 7;
    const nextM = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextY = currentMonth === 12 ? currentYear + 1 : currentYear;
    for (let d = 1; d <= remainingDays; d++) {
      const dateStr = `${nextY}-${String(nextM).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        events: [],
      });
    }

    return days;
  }, [currentYear, currentMonth, events, todayStr]);

  // 当月に開催されるイベント一覧（重複なし、開始日順）
  const monthlyEvents = useMemo(() => {
    const ymPrefix = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    return events
      .filter((evt) => {
        const startYM = evt.startDate.slice(0, 7);
        const endYM = (evt.endDate || evt.startDate).slice(0, 7);
        return startYM <= ymPrefix && ymPrefix <= endYM;
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [events, currentYear, currentMonth]);

  // イベント種別バッジ色
  const getEventBadgeStyle = (evt: ExhibitionEvent, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-red-600 text-white font-bold ring-2 ring-red-400 shadow-xs';
    }
    if (evt.isCustomUserAdded) {
      return 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300';
    }
    if (evt.eventType === '小規模ピッチ・デモデイ' || evt.isSmallPitch || evt.sourceType === 'スタートアップカレンダー') {
      return 'bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border border-indigo-200';
    }
    if (evt.eventType === 'スタートアップ特化サミット' || evt.eventType === 'ピッチコンテスト・アクセラレーター') {
      return 'bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-200';
    }
    return 'bg-sky-100 hover:bg-sky-200 text-sky-900 border border-sky-200';
  };

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || null;
  }, [events, selectedEventId]);

  // クイック移動可能な主要月
  const availableMonths = [
    { year: 2026, month: 10, label: '2026年10月' },
    { year: 2026, month: 11, label: '2026年11月' },
    { year: 2026, month: 12, label: '2026年12月' },
    { year: 2027, month: 1, label: '2027年1月' },
    { year: 2027, month: 2, label: '2027年2月' },
    { year: 2027, month: 3, label: '2027年3月' },
    { year: 2027, month: 4, label: '2027年4月' },
    { year: 2027, month: 5, label: '2027年5月' },
    { year: 2027, month: 7, label: '2027年7月' },
  ];

  return (
    <div className="space-y-4">
      {/* Month Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              title="前月へ"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              title="翌月へ"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {currentYear}年 {currentMonth}月
            </span>
            <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              当月開催 {monthlyEvents.length} 件
            </span>
          </h3>
        </div>

        {/* Quick Month Jump Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {availableMonths.map((m) => {
            const isCur = m.year === currentYear && m.month === currentMonth;
            return (
              <button
                key={`${m.year}-${m.month}`}
                onClick={() => handleJumpTo(m.year, m.month)}
                className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all ${
                  isCur
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-200/80 text-slate-600 border border-slate-200'
                }`}
              >
                {m.year === 2026 ? `${m.month}月` : `'27/${m.month}月`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend / 凡例 */}
      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-600 px-1 gap-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="font-semibold text-slate-500">色分け:</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            スタートアップ特化サミット (ILS・IVS・ICC等)
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            定期ピッチ・デモデイ (Morning Pitch等)
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            大型産業展示会 (建設・ロボット・AI・GX展)
          </span>
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            手動追加イベント
          </span>
        </div>

        {selectedEventId && (
          <button
            onClick={() => onSelectEvent(null)}
            className="text-xs text-red-600 font-bold hover:underline"
          >
            選択解除（全件表示）✕
          </button>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-600">
          <div className="py-2 text-rose-600">日</div>
          <div className="py-2">月</div>
          <div className="py-2">火</div>
          <div className="py-2">水</div>
          <div className="py-2">木</div>
          <div className="py-2">金</div>
          <div className="py-2 text-blue-600">土</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
          {calendarDays.map((day, idx) => {
            const isWeekendSun = idx % 7 === 0;
            const isWeekendSat = idx % 7 === 6;

            return (
              <div
                key={day.dateStr + idx}
                className={`min-h-[105px] sm:min-h-[120px] p-1.5 flex flex-col transition-colors ${
                  !day.isCurrentMonth
                    ? 'bg-slate-50/40 text-slate-300'
                    : isWeekendSun
                    ? 'bg-rose-50/20'
                    : isWeekendSat
                    ? 'bg-blue-50/20'
                    : 'bg-white'
                } ${day.isToday ? 'ring-2 ring-inset ring-indigo-500 bg-indigo-50/20' : ''}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                      day.isToday
                        ? 'bg-indigo-600 text-white'
                        : !day.isCurrentMonth
                        ? 'text-slate-300'
                        : isWeekendSun
                        ? 'text-rose-600'
                        : isWeekendSat
                        ? 'text-blue-600'
                        : 'text-slate-700'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {day.isToday && (
                    <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1 rounded">
                      本日
                    </span>
                  )}
                </div>

                {/* Day Events Badges */}
                <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] scrollbar-none">
                  {day.events.map((evt) => {
                    const isSelected = selectedEventId === evt.id;
                    const isStart = evt.startDate === day.dateStr;

                    return (
                      <div
                        key={evt.id}
                        onClick={() => onSelectEvent(isSelected ? null : evt.id)}
                        className={`text-[10px] p-1 rounded-md leading-tight cursor-pointer truncate transition-all ${getEventBadgeStyle(
                          evt,
                          isSelected
                        )}`}
                        title={`${evt.title} (${evt.startDate} 〜 ${evt.endDate}) @ ${evt.venue}`}
                      >
                        <span className="font-semibold truncate block">
                          {isStart ? '▶ ' : ''}
                          {evt.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Detail Banner (if any selected) */}
      {selectedEvent && (
        <div className="bg-gradient-to-r from-red-50 via-rose-50 to-indigo-50 border border-red-200 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600 text-white">
                  カレンダー選択中
                </span>
                <span className="text-xs font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  {selectedEvent.region} / {selectedEvent.city}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  📅 {selectedEvent.startDate} 〜 {selectedEvent.endDate}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>{selectedEvent.title}</span>
                {selectedEvent.officialUrl && (
                  <a
                    href={selectedEvent.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-red-600 inline-flex items-center"
                    title="イベント公式HPを開く"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400 shrink-0" />
                <span>
                  {selectedEvent.venue} {selectedEvent.hall ? `(${selectedEvent.hall})` : ''}
                </span>
                <span className="text-slate-400 mx-1">|</span>
                <span>
                  出展: <strong>{selectedEvent.exhibitorCount}</strong>社 (SU:{' '}
                  <strong className="text-red-600">{selectedEvent.startupCount}</strong>社)
                </span>
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {selectedEvent.officialUrl && (
                <a
                  href={selectedEvent.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-2xs transition-colors flex items-center gap-1"
                >
                  <span>公式HP ↗</span>
                </a>
              )}
              <button
                onClick={() => onSelectEvent(null)}
                className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 transition-colors"
              >
                選択解除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Event List Summary / 当月のイベント一覧サマリー */}
      <div className="pt-2">
        <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
          <CalendarIcon className="w-3.5 h-3.5 text-red-600" />
          <span>{currentYear}年{currentMonth}月 開催予定イベント一覧 ({monthlyEvents.length}件)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {monthlyEvents.map((evt) => {
            const isSelected = selectedEventId === evt.id;
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(isSelected ? null : evt.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-red-500 bg-red-50/50 shadow-sm ring-2 ring-red-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-slate-500">
                    {evt.startDate} 〜 {evt.endDate}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {evt.city}
                  </span>
                </div>
                <div className="font-bold text-slate-900 line-clamp-1 mb-1 hover:text-red-600">
                  {evt.title}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span className="truncate">{evt.venue}</span>
                  <span className="text-red-600 font-bold shrink-0 ml-1">
                    SU: {evt.startupCount}社
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
