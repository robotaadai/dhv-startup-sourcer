'use client';

import React from 'react';
import { ExhibitionEvent, StartupExhibitor } from '@/types';
import { Calendar, Building, Sparkles, ShieldCheck, Flag, CheckCircle2, Crown } from 'lucide-react';

interface StatsSummaryProps {
  events: ExhibitionEvent[];
  exhibitors: StartupExhibitor[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ events, exhibitors }) => {
  const totalEvents = events.length;
  const totalExhibitors = exhibitors.length;
  const startupCount = exhibitors.filter((e) => e.isStartup).length;
  const portfolioCount = exhibitors.filter((e) => e.isDHVPortfolio).length;
  const asufukaketsuCount = exhibitors.filter((e) => e.isStartup && e.asufukaketsu.length > 0).length;
  const takaichi17Count = exhibitors.filter((e) => e.isStartup && e.takaichi17.length > 0).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* 監視中展示会 & サミット */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">監視中イベント</span>
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-2xl font-bold text-slate-900">{totalEvents}</span>
          <span className="ml-1 text-xs text-slate-500">件</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500 truncate" title="関東・関西・中部・九州・北海道の主要サミット＆展示場">
          全国5大地域 / サミット＆展示会
        </div>
      </div>

      {/* 抽出スタートアップ */}
      <div className="bg-white rounded-xl p-3.5 border border-red-100 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-red-900">スタートアップ候補</span>
          <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-2xl font-bold text-red-600">{startupCount}</span>
          <span className="ml-1 text-xs text-slate-500">/ {totalExhibitors}社</span>
        </div>
        <div className="mt-1 text-[11px] text-red-700 font-medium">
          抽出率 {Math.round((startupCount / totalExhibitors) * 100)}%
        </div>
      </div>

      {/* ★ DHV投資先出展 */}
      <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 rounded-xl p-3.5 border border-amber-300 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-amber-900">DHV 投資先出展</span>
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-2xs">
            <Crown className="w-4 h-4 fill-current" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-2xl font-black text-amber-700">{portfolioCount}</span>
          <span className="ml-1 text-xs font-bold text-amber-900">社</span>
        </div>
        <div className="mt-1 text-[11px] text-amber-800 font-bold">
          ポートフォリオ出展支援
        </div>
      </div>

      {/* アスフカケツノ該当 */}
      <div className="bg-white rounded-xl p-3.5 border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-900">アスフカケツノ該当</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-2xl font-bold text-amber-700">{asufukaketsuCount}</span>
          <span className="ml-1 text-xs text-slate-500">社</span>
        </div>
        <div className="mt-1 text-[11px] text-amber-800">
          大和ハウス重点7領域
        </div>
      </div>

      {/* 高市政権17戦略分野 */}
      <div className="bg-white rounded-xl p-3.5 border border-purple-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-purple-900">高市17戦略分野</span>
          <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
            <Flag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-2xl font-bold text-purple-700">{takaichi17Count}</span>
          <span className="ml-1 text-xs text-slate-500">社</span>
        </div>
        <div className="mt-1 text-[11px] text-purple-800">
          国家危機管理・成長投資
        </div>
      </div>

      {/* 更新スケジュール */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">次回自動巡回</span>
          <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
            <Building className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline">
          <span className="text-lg font-bold text-slate-800">明日 04:00</span>
        </div>
        <div className="mt-1 text-[11px] text-emerald-800 font-medium">
          ● GitHub Actions 稼働
        </div>
      </div>
    </div>
  );
};
