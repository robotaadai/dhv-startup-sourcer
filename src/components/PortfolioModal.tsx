'use client';

import React, { useState } from 'react';
import { DHV_PORTFOLIO_MASTER, DHV_LEGACY_BS_INVESTMENTS } from '@/data/dhvPortfolioMaster';
import { DHVPortfolioCompany, AsufukaketsuKey, ASUFUKAKETSU_CONFIG } from '@/types';
import {
  X,
  Crown,
  Search,
  ExternalLink,
  Building2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Download,
  Check,
  Copy,
  Layers,
} from 'lucide-react';

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFund, setSelectedFund] = useState<'ALL' | 'FUTURE FUND' | 'SYNERGY FUND' | 'GROWTH FUND'>('ALL');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const filteredCompanies = DHV_PORTFOLIO_MASTER.filter((company) => {
    if (selectedFund !== 'ALL' && company.fundName !== selectedFund) {
      return false;
    }
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      company.companyName.toLowerCase().includes(q) ||
      (company.companyNameEn && company.companyNameEn.toLowerCase().includes(q)) ||
      company.businessSummary.toLowerCase().includes(q) ||
      company.collaborationSummary.toLowerCase().includes(q) ||
      company.categoryName.toLowerCase().includes(q) ||
      company.location.toLowerCase().includes(q)
    );
  });

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const handleExportCsv = () => {
    const headers = [
      'No',
      '企業名',
      '英語名',
      '担当ファンド',
      '投資完了日',
      '領域カテゴリ',
      '主な事業概要',
      '狙い・協業検討概要',
      '所在地',
      '代表者',
      '資本金',
      '設立年月',
      'IPO/上場',
      '公式URL',
    ];

    const rows = filteredCompanies.map((c) => [
      c.no,
      `"${c.companyName}"`,
      `"${c.companyNameEn || ''}"`,
      `"${c.fundName}"`,
      `"${c.investmentDate}"`,
      `"${c.categoryName}"`,
      `"${c.businessSummary.replace(/"/g, '""')}"`,
      `"${c.collaborationSummary.replace(/"/g, '""')}"`,
      `"${c.location}"`,
      `"${c.representative}"`,
      `"${c.capital}"`,
      `"${c.established}"`,
      c.isIpo ? 'IPO済' : '未上場',
      `"${c.officialUrl || ''}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DHV_Portfolio_32_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-amber-500/10 via-white to-red-500/10 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white shadow-md">
              <Crown className="w-6 h-6 text-amber-200 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-slate-900">
                  大和ハウスグループ CVC公式ポートフォリオ
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold border border-amber-300">
                  全32社 (2026年9月公表)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                大和ハウスベンチャーズ「将来の夢」ファンド（FUTURE / SYNERGY / GROWTH）出資先企業一覧
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors"
              title="ポートフォリオをCSV出力"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV保存</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Fund tabs */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            {(['ALL', 'FUTURE FUND', 'SYNERGY FUND', 'GROWTH FUND'] as const).map((fund) => {
              const isActive = selectedFund === fund;
              const count =
                fund === 'ALL'
                  ? DHV_PORTFOLIO_MASTER.length
                  : DHV_PORTFOLIO_MASTER.filter((c) => c.fundName === fund).length;

              return (
                <button
                  key={fund}
                  onClick={() => setSelectedFund(fund)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {fund === 'ALL' ? 'すべて' : fund.replace(' FUND', '')} ({count})
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="企業名・事業・協業内容を検索..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Portfolio List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCompanies.map((c) => {
              const asufu = c.asufukaketsuKey !== 'その他' ? ASUFUKAKETSU_CONFIG[c.asufukaketsuKey as AsufukaketsuKey] : null;

              return (
                <div
                  key={c.no}
                  className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: No, Fund, Date */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black flex items-center justify-center">
                          {c.no}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded ${
                            c.fundName === 'SYNERGY FUND'
                              ? 'bg-blue-100 text-blue-900'
                              : c.fundName === 'GROWTH FUND'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {c.fundName}
                        </span>
                        {c.isIpo && (
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                            IPO
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {c.investmentDate} 完了
                      </span>
                    </div>

                    {/* Company Name */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-slate-900 text-base">
                            {c.companyName}
                          </h4>
                          <button
                            onClick={() => handleCopy(c.companyName)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100"
                            title="社名をコピー"
                          >
                            {copiedName === c.companyName ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {c.companyNameEn && (
                          <p className="text-[11px] text-slate-400">{c.companyNameEn}</p>
                        )}
                      </div>

                      {c.officialUrl && (
                        <a
                          href={c.officialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-amber-600"
                          title="公式HPを開く"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* Category Tag */}
                    <div className="mb-2.5">
                      {asufu ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${asufu.bgColor} ${asufu.color} border ${asufu.borderColor}`}
                        >
                          {asufu.key}: {asufu.name} ({c.categoryName})
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {c.categoryName}
                        </span>
                      )}
                    </div>

                    {/* Business Summary */}
                    <p className="text-xs text-slate-700 leading-relaxed mb-3">
                      {c.businessSummary}
                    </p>

                    {/* Collaboration note (From PDF) */}
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-xs">
                      <span className="font-bold text-amber-900 block mb-0.5 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
                        大和ハウスグループとの狙い・協業検討概要:
                      </span>
                      <p className="text-amber-950 font-medium leading-relaxed">
                        {c.collaborationSummary}
                      </p>
                    </div>
                  </div>

                  {/* Footer Corporate Specs */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {c.location} / 代表: {c.representative}
                    </span>
                    <span>
                      資本金: {c.capital} / {c.established}設立
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legacy BS Investments Section */}
          <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <Building2 className="w-4 h-4 text-slate-600" />
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                過去の本体BS投資実績（一部）
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DHV_LEGACY_BS_INVESTMENTS.map((leg, i) => (
                <div key={i} className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 truncate">{leg.name}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {leg.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5 truncate">{leg.field}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
