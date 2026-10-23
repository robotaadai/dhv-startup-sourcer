'use client';

import React from 'react';
import { Download, RefreshCw, Sparkles, Building2, ExternalLink, Crown } from 'lucide-react';
import { StartupExhibitor } from '@/types';

interface HeaderProps {
  onExportCsv: () => void;
  onOpenCrawlerModal: () => void;
  onOpenPortfolioModal: () => void;
  filteredCount: number;
  totalCount: number;
  lastUpdated: string;
}

export const Header: React.FC<HeaderProps> = ({
  onExportCsv,
  onOpenCrawlerModal,
  onOpenPortfolioModal,
  filteredCount,
  totalCount,
  lastUpdated,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-indigo-900 flex items-center justify-center text-white shadow-md shadow-red-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">DHV</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold border border-red-200">
                  Startup Sourcer
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">| 大和ハウスベンチャーズ</span>
              </div>
              <p className="text-[11px] text-slate-600 hidden md:block">
                幕張メッセ・東京ビッグサイト展示会クローリング ＆ アスフカケツノ・高市17分野AI分類
              </p>
            </div>
          </div>

          {/* Action Buttons & Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* DHV Official Portfolio Modal Button */}
            <button
              onClick={onOpenPortfolioModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-black text-amber-900 bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 rounded-lg border border-amber-300 shadow-xs transition-all active:scale-95"
              title="大和ハウスベンチャーズ公式出資先32社の一覧を表示"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-current" />
              <span>DHV出資先 (32社)</span>
            </button>

            {/* Crawler Status Pill */}
            <button
              onClick={onOpenCrawlerModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              title="クローラー巡回状況の確認"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden sm:inline">日次巡回完了</span>
              <span className="text-slate-500 text-[11px] hidden lg:inline">({lastUpdated})</span>
              <RefreshCw className="w-3 h-3 text-slate-500 ml-1" />
            </button>

            {/* CSV Export Button */}
            <button
              onClick={onExportCsv}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV出力 ({filteredCount}件)</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
