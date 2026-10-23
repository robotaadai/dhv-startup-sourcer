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

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              直近〜今後の監視展示会タイムライン
            </h2>
            <p className="text-[11px] text-slate-500">
              スケジュール確定 → 出展社一覧公表 → ブースレイアウト公表の流れを毎日クローリング監視
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {events.map((evt) => {
          const isSelected = selectedEventId === evt.id;
          const isBigSight = evt.venue.includes('ビッグサイト');

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent(isSelected ? null : evt.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'border-red-500 bg-red-50/40 shadow-sm ring-2 ring-red-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 bg-white'
              }`}
            >
              {/* Top Venue & Status */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <span
                  className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isBigSight
                      ? 'bg-sky-100 text-sky-800 border border-sky-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {evt.venue}
                </span>
                {getStatusBadge(evt.status)}
              </div>

              {/* Title */}
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1 mb-1.5">
                {evt.title}
              </h3>

              {/* Date & Hall */}
              <div className="flex items-center text-[11px] text-slate-500 space-x-2 mb-2">
                <span className="font-medium text-slate-700">
                  {evt.startDate} 〜 {evt.endDate}
                </span>
                {evt.hall && <span>| {evt.hall}</span>}
              </div>

              {/* Counts & Score */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-600">
                    出展社: <strong className="text-slate-800">{evt.exhibitorCount}</strong>
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
