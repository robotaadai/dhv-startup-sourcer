'use client';

import React from 'react';
import { StartupExhibitor, UpcomingMeetingEvent } from '@/types';
import { OctagonRadarChart } from './OctagonRadarChart';
import { CompanyLogo } from './CompanyLogo';
import {
  Calendar,
  MapPin,
  ExternalLink,
  Globe,
  Sparkles,
  Trophy,
  Crown,
  ChevronRight,
  Clock,
  Building,
  Newspaper,
} from 'lucide-react';

interface StartupReverseCardProps {
  startup: StartupExhibitor;
  onSelect: (startup: StartupExhibitor) => void;
}

export const StartupReverseCard: React.FC<StartupReverseCardProps> = ({
  startup,
  onSelect,
}) => {
  // 出展予定の有無
  const hasEvent =
    startup.hasUpcomingEvent !== false &&
    Boolean(startup.upcomingMeetingEvents && startup.upcomingMeetingEvents.length > 0 && startup.upcomingMeetingEvents[0]?.startDate);

  // 会えるイベントの算出 (配列にあれば優先、なければ現在の出展イベント情報から生成)
  const meetingEvent: UpcomingMeetingEvent = (startup.upcomingMeetingEvents && startup.upcomingMeetingEvents[0]) || {
    eventId: 'current',
    eventName: startup.eventName || '直近の出展予定なし',
    eventUrl: startup.eventUrl || '',
    venue: startup.eventVenue || '次回未定',
    boothNumber: startup.boothNumber || '—',
    floorMapUrl: startup.eventUrl || '',
    startDate: startup.eventStartDate || '',
    endDate: startup.eventEndDate || '',
    region: startup.region || '関東',
    eventType: startup.eventType || '大型産業展示会',
    pitchSession: startup.pitchInfo,
    daysUntil: startup.eventStartDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(startup.eventStartDate).getTime() - new Date('2026-10-27').getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 999,
  };

  const expectation = startup.expectation || {
    scores: {
      awards: startup.pitchInfo ? 3 : 2,
      accelerator: startup.pitchInfo?.includes('Plug and Play') ? 3 : 2,
      snsMomentum: 2,
      fundraising: startup.fundingStage === 'シリーズB' ? 3 : startup.fundingStage === 'シリーズA' ? 3 : 2,
      growthVelocity: (startup.yearsSinceEst || 5) <= 3 ? 3 : 2,
      enterpriseTraction: 2,
      deepTechIP: startup.industries.some((i) => i.includes('半導体') || i.includes('ロボット')) ? 3 : 2,
      teamStrength: 3,
    },
    totalScore: 20,
    rank: 'B' as const,
    highlights: ['成長ポテンシャル'],
  };

  return (
    <div
      onClick={() => onSelect(startup)}
      className="bg-white rounded-xl border border-slate-200/90 hover:border-red-400 p-3 sm:p-4 transition-all shadow-xs hover:shadow-md cursor-pointer relative overflow-hidden group"
    >
      {/* Top Header: Logo, Name, HP button, Stage, Est Year */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-2 mb-2 border-b border-slate-100 gap-2">
        <div className="flex items-start space-x-2.5">
          <CompanyLogo
            companyName={startup.companyName}
            logoUrl={startup.logoUrl}
            size="md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                {startup.companyName}
              </h3>

              {/* 公式HPボタン */}
              {startup.officialUrl && (
                <a
                  href={startup.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center space-x-1 px-1.5 py-0.5 text-xs font-bold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-300 hover:border-blue-300 rounded transition-colors shadow-2xs"
                  title={`${startup.companyName} 公式HPを開く`}
                >
                  <Globe className="w-3 h-3 text-slate-500" />
                  <span>HP</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              )}

              {startup.isDHVPortfolio && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600 fill-current" />
                  DHV投資先
                </span>
              )}

              {startup.eventType === '小規模ピッチ・デモデイ' && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  🎤 カレンダーピッチ
                </span>
              )}
            </div>

            {startup.companyNameEn && (
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {startup.companyNameEn}
              </span>
            )}

            {/* アスフカケツノ 1文字バッジ */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] font-bold text-slate-400 mr-0.5">大和ハウス領域:</span>
              {startup.asufukaketsu.map((k) => (
                <span
                  key={k}
                  className="w-4.5 h-4.5 rounded text-[10px] font-black flex items-center justify-center bg-red-100 text-red-800 border border-red-300 shadow-2xs"
                  title={`アスフカケツノ: ${k}`}
                >
                  {k}
                </span>
              ))}
              <span className="text-[10px] text-slate-300 mx-0.5">|</span>
              {startup.takaichi17.slice(0, 2).map((f) => (
                <span
                  key={f}
                  className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 定量スペック */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 pt-0.5">
          <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white shadow-2xs">
            {startup.fundingStage}
          </span>
          <div className="text-[11px] text-slate-500 font-medium text-right">
            <span>{startup.establishedYear}年設立 ({startup.yearsSinceEst}年目)</span>
            {startup.totalFunding && (
              <span className="block font-semibold text-slate-700">累計調達: {startup.totalFunding}</span>
            )}
          </div>
        </div>
      </div>

      {/* ★ 事業内容 (Business Description) */}
      <div className="mb-2 p-2 sm:p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/90 text-xs shadow-2xs">
        <div className="flex items-center space-x-1.5 font-bold text-slate-800 text-[11px] mb-0.5">
          <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>事業内容</span>
        </div>
        <p className="text-slate-700 leading-snug text-xs font-medium">
          {startup.description}
        </p>
      </div>

      {/* Main Body: 2 Columns (Left: 会える展示会, Right: 八角形レーダーチャート) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3 mb-2">
        {/* Left Column: 直近で会える展示会 (lg: 7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
          {/* 会えるイベントハイライトボックス / 出展予定なしボックス */}
          {hasEvent ? (
            <div className="p-2.5 sm:p-3 rounded-lg border border-red-200/90 bg-gradient-to-br from-red-50/40 via-orange-50/20 to-white relative overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white shadow-2xs">
                    <Calendar className="w-3 h-3" />
                    <span>直近で会えるイベント</span>
                  </span>
                  {startup.upcomingMeetingEvents && startup.upcomingMeetingEvents.length > 1 && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                      全{startup.upcomingMeetingEvents.length}件出展
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center text-[10px] font-bold text-red-700 bg-red-100/90 px-1.5 py-0.2 rounded-full border border-red-200 shrink-0">
                  <Clock className="w-3 h-3 mr-0.5" />
                  あと {meetingEvent.daysUntil} 日後
                </span>
              </div>

              {/* イベント名 */}
              <div className="mb-1.5">
                <a
                  href={meetingEvent.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs sm:text-sm font-bold text-slate-900 hover:text-red-600 hover:underline inline-flex items-center gap-1 group/evt"
                >
                  <span>{meetingEvent.eventName}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover/evt:text-red-500 shrink-0" />
                </a>
              </div>

              {/* 日程・場所・ブース */}
              <div className="space-y-0.5 text-xs text-slate-700 mb-2 bg-white/80 p-2 rounded-md border border-slate-200/70">
                <div className="flex items-center">
                  <span className="w-14 text-slate-400 text-[11px] font-semibold">会期:</span>
                  <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                    {meetingEvent.startDate} 〜 {meetingEvent.endDate}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-14 text-slate-400 text-[11px] font-semibold">会場:</span>
                  <span className="font-medium text-slate-800 truncate text-[11px] sm:text-xs">
                    {meetingEvent.venue} {meetingEvent.hall ? `(${meetingEvent.hall})` : ''}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-14 text-slate-400 text-[11px] font-semibold">ブース枠:</span>
                  <span className="font-bold text-red-700 flex items-center text-[11px] sm:text-xs">
                    <MapPin className="w-3.5 h-3.5 mr-0.5 text-red-500" />
                    {meetingEvent.boothNumber}
                  </span>
                </div>
                {meetingEvent.pitchSession && (
                  <div className="flex items-center pt-0.5 border-t border-slate-100">
                    <span className="w-14 text-slate-400 text-[11px] font-semibold">ピッチ登壇:</span>
                    <span className="font-bold text-amber-900 bg-amber-100/70 px-1 py-0.2 rounded text-[10px]">
                      🏆 {meetingEvent.pitchSession}
                    </span>
                  </div>
                )}
              </div>

              {/* アクションボタン: イベントHP (小型化) */}
              <div className="flex items-center justify-end">
                <a
                  href={meetingEvent.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-bold transition-all shadow-2xs group/btn"
                  title={`${meetingEvent.eventName} 公式HPを開く`}
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span>イベントHP ↗</span>
                </a>
              </div>

              {/* ★ 複数イベントに出展する場合: その他の会えるイベント一覧 */}
              {startup.upcomingMeetingEvents && startup.upcomingMeetingEvents.length > 1 && (
                <div className="mt-2 pt-1.5 border-t border-red-200/60">
                  <div className="text-[10px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                    <span className="text-blue-600">📅</span>
                    <span>他 {startup.upcomingMeetingEvents.length - 1} 件の出展・登壇予定:</span>
                  </div>
                  <div className="space-y-1">
                    {startup.upcomingMeetingEvents.slice(1).map((ev, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] bg-white/70 px-2 py-0.5 rounded border border-slate-200/60"
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-slate-800 truncate">{ev.eventName}</span>
                          <span className="text-[10px] text-slate-500 shrink-0">({ev.startDate}〜)</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-1">
                          <span className="text-[10px] text-slate-600 font-medium">{ev.venue}</span>
                          {ev.eventUrl && (
                            <a
                              href={ev.eventUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] font-bold text-blue-600 hover:underline inline-flex items-center"
                            >
                              HP ↗
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 via-slate-100/40 to-white relative overflow-hidden shadow-2xs">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>直近のイベント出展予定なし</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  オフライン未出展
                </span>
              </div>

              <div className="p-2 bg-white rounded-md border border-slate-200/80 mb-2 space-y-0.5">
                <p className="text-xs text-slate-700 font-medium">
                  現在、直近の展示会やピッチイベントへの出展・登壇予定は公表されていません。
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span>💡</span>
                  <span>協業検討・面談打診は公式HP（上部ボタン）等からのコンタクトを推奨します。</span>
                </p>
              </div>

              {startup.links?.initialUrl && (
                <div className="flex items-center justify-end">
                  <a
                    href={startup.links.initialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center justify-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold transition-all border border-slate-300 shadow-2xs"
                  >
                    <span>INITIALで調べる ↗</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* 大和ハウスグループ協業シナジー */}
          {startup.aiSummary && (
            <div className="p-2 sm:p-2.5 bg-gradient-to-r from-red-50/60 via-orange-50/30 to-white rounded-lg border border-red-200/70 text-xs shadow-2xs">
              <div className="flex items-center font-bold text-red-900 text-[11px] mb-0.5">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-red-600 shrink-0" />
                <span>大和ハウスグループ協業シナジー・仮説:</span>
              </div>
              <p className="text-red-950 font-medium text-[11px] leading-snug">
                🎯 {startup.aiSummary}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: 八角形レーダーチャート (lg: 5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between p-2.5 sm:p-3 rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50/50 to-white shadow-2xs">
          <div className="w-full flex items-center justify-between mb-1 pb-1 border-b border-slate-200/70">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>8軸「期待ポイント」評価</span>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">各5点満点</span>
          </div>

          {/* 八角形チャート本体 */}
          <div className="my-0.5 scale-90 sm:scale-95">
            <OctagonRadarChart
              scores={expectation.scores}
              rank={expectation.rank}
              totalScore={expectation.totalScore}
              size="sm"
            />
          </div>

          {/* 注目ハイライトバッジ */}
          <div className="w-full pt-1.5 border-t border-slate-200/70">
            <div className="text-[10px] font-bold text-slate-500 mb-0.5">代表的な強み:</div>
            <div className="flex flex-wrap gap-1">
              {expectation.highlights.map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer: 最新ニュースリリース */}
      {startup.latestNews && (
        <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1.5 truncate pr-2">
            <Newspaper className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-700 shrink-0">最新ニュース:</span>
            <span className="truncate text-slate-600">{startup.latestNews.title}</span>
            <span className="text-[10px] text-slate-400 shrink-0">({startup.latestNews.date})</span>
          </div>
          <span className="text-red-600 font-bold group-hover:translate-x-1 transition-transform flex items-center text-xs shrink-0">
            詳細を見る <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </span>
        </div>
      )}
    </div>
  );
};
