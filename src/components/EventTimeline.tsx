'use client';

import React from 'react';
import { ExhibitionEvent } from '@/types';
import { Calendar, MapPin, Building, ExternalLink, Users, Sparkles, Check, ChevronRight } from 'lucide-react';

interface EventTimelineProps {
  events: ExhibitionEvent[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string | null) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
}) => {
  const getStatusBadge = (status: ExhibitionEvent['status']) => {
    switch (status) {
      case 'ブース配置図公表':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 mr-0.5" /> レイアウト公表済
          </span>
        );
      case '出展社公表済':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            出展社リスト公表済
          </span>
        );
      case 'スケジュール確定':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            出展社発表待ち
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const [activeRegionTab, setActiveRegionTab] = React.useState<'ALL' | '関東' | '関西' | '中部' | '九州' | 'SUMMIT'>('ALL');

  const filteredEvents = events.filter((evt) => {
    if (activeRegionTab === 'ALL') return true;
    if (activeRegionTab === 'SUMMIT') {
      return evt.eventType === 'スタートアップ特化サミット' || evt.eventType === 'ピッチコンテスト・アクセラレーター';
    }
    return evt.region === activeRegionTab;
  });

  const getRegionBadgeColor = (region?: string) => {
    switch (region) {
      case '関西':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case '中部':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case '九州':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case '北海道':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                これから開催される展示会＆サミット タイムライン
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                次回開催・未来予定 {events.length} 件（終了済は除外）
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              終了イベントを除外し、次回開催予定のサミット（IVS・SusHi Tech・B Dash・ICC等）＆ 全国の大型産業展示会に限定中
            </p>
          </div>
        </div>

        {selectedEventId && (
          <button
            onClick={() => onSelectEvent(null)}
            className="text-xs text-red-600 hover:text-red-800 font-semibold px-2.5 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors self-start sm:self-auto"
          >
            展示会選択を解除（全件表示）
          </button>
        )}
      </div>

      {/* Region Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-4 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
        {[
          { id: 'ALL', label: '全国すべて', count: events.length },
          { id: 'SUMMIT', label: '🔥 スタートアップサミット・ピッチ', count: events.filter((e) => e.eventType !== '大型産業展示会').length },
          { id: '関東', label: '関東 (東京・横浜・幕張)', count: events.filter((e) => e.region === '関東').length },
          { id: '関西', label: '関西 (京都・大阪)', count: events.filter((e) => e.region === '関西').length },
          { id: '中部', label: '中部 (名古屋)', count: events.filter((e) => e.region === '中部').length },
          { id: '九州', label: '九州 (福岡)', count: events.filter((e) => e.region === '九州').length },
        ].map((tab) => {
          const isActive = activeRegionTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveRegionTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredEvents.map((evt) => {
          const isSelected = selectedEventId === evt.id;
          const isSummit = evt.eventType !== '大型産業展示会';

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(isSelected ? null : evt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'border-red-500 bg-red-50/40 shadow-sm ring-2 ring-red-500/20'
                  : isSummit
                  ? 'border-red-200/90 bg-gradient-to-b from-red-50/20 to-white hover:border-red-300'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
              }`}
            >
              {/* Top Venue, City, Status */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md ${getRegionBadgeColor(
                      evt.region
                    )}`}
                  >
                    <MapPin className="w-3 h-3 mr-0.5" />
                    {evt.region} / {evt.city}
                  </span>
                  {isSummit && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                      サミット
                    </span>
                  )}
                </div>
                {getStatusBadge(evt.status)}
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-1">
                {evt.title}
              </h3>

              {/* Venue & Hall */}
              <div className="text-[11px] text-slate-600 mb-1.5 flex items-center">
                <Building className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                <span className="truncate">{evt.venue} {evt.hall ? `(${evt.hall})` : ''}</span>
              </div>

              {/* Date */}
              <div className="flex items-center text-[11px] text-slate-500 space-x-2 mb-2">
                <span className="font-medium text-slate-700">
                  {evt.startDate} 〜 {evt.endDate}
                </span>
              </div>

              {/* Counts & Score */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">
                    出展: <strong className="text-slate-800">{evt.exhibitorCount}</strong>
                  </span>
                  <span className="text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded">
                    SU: {evt.startupCount}社
                  </span>
                </div>

                <div className="flex items-center text-amber-500 font-bold" title="スタートアップ注目度">
                  <Sparkles className="w-3 h-3 mr-0.5 fill-current" />
                  <span>★{evt.startupRelevanceScore}.0</span>
                </div>
              </div>

              {/* Official Link */}
              <a
                href={evt.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-3.5 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded text-slate-500"
                title="オフィシャルHPを開く"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

