'use client';

import React, { useState } from 'react';
import { StartupExhibitor, ASUFUKAKETSU_CONFIG, DHVStatus } from '@/types';
import {
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Building2,
  FileText,
  Search,
  Globe,
  Tag,
  ShieldCheck,
  Flag,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface StartupCardProps {
  exhibitor: StartupExhibitor;
  onOpenDetail: (exhibitor: StartupExhibitor) => void;
  onChangeStatus: (id: string, status: DHVStatus) => void;
}

export const StartupCard: React.FC<StartupCardProps> = ({
  exhibitor,
  onOpenDetail,
  onChangeStatus,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const getStatusColor = (status: DHVStatus) => {
    switch (status) {
      case '注目・Watch':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case '面談設定':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case '投資検討中':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'アプローチ済':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case '見送り':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleCopyName = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(exhibitor.companyName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-5 flex flex-col justify-between group relative">
      {/* Top Header: Company Name & Stage */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center space-x-2">
              <h3
                onClick={() => onOpenDetail(exhibitor)}
                className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors cursor-pointer"
              >
                {exhibitor.companyName}
              </h3>
              <button
                onClick={handleCopyName}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                title="社名をコピー"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {exhibitor.isStartup && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 border border-red-200">
                  SU候補
                </span>
              )}
            </div>
            {exhibitor.companyNameEn && (
              <span className="text-[11px] text-slate-400 block">{exhibitor.companyNameEn}</span>
            )}
          </div>

          {/* Funding Stage & Est Year */}
          <div className="flex flex-col items-end gap-1">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              {exhibitor.fundingStage}
            </span>
            {exhibitor.establishedYear && (
              <span className="text-[11px] text-slate-500">
                {exhibitor.establishedYear}年設立 ({exhibitor.yearsSinceEst}年目)
              </span>
            )}
          </div>
        </div>

        {/* Booth & Event Info */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-xs text-slate-500 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <span className="font-semibold text-slate-800 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
            {exhibitor.boothNumber}
          </span>
          <span className="text-slate-300">|</span>
          <span className="truncate max-w-[220px]" title={exhibitor.eventName}>
            {exhibitor.eventName}
          </span>
          <span className="text-slate-300">|</span>
          <span>{exhibitor.eventVenue}</span>
        </div>

        {/* AI Summary / Synergies */}
        <div className="mb-4 bg-gradient-to-r from-red-50/50 to-orange-50/30 p-3 rounded-xl border border-red-100/70 text-xs">
          <div className="flex items-center text-red-800 font-bold text-[11px] mb-1">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-red-600" />
            DHV 注目・共創ポイント
          </div>
          <p className="text-slate-700 leading-relaxed line-clamp-2">
            {exhibitor.aiSummary}
          </p>
        </div>

        {/* Badges Section: アスフカケツノ ＆ 高市17分野 */}
        <div className="space-y-2 mb-4">
          {/* アスフカケツノ バッジ */}
          {exhibitor.asufukaketsu.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center">
                <ShieldCheck className="w-3 h-3 mr-0.5 text-amber-500" /> アスフカケツノ:
              </span>
              {exhibitor.asufukaketsu.map((key) => {
                const conf = ASUFUKAKETSU_CONFIG[key];
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${conf.bgColor} ${conf.color} border ${conf.borderColor}`}
                    title={`${key}: ${conf.name} - ${conf.description}`}
                  >
                    {key}: {conf.name}
                  </span>
                );
              })}
            </div>
          )}

          {/* 高市17分野 バッジ */}
          {exhibitor.takaichi17.length > 0 && (
            <div className="flex items-center flex-wrap gap-1">
              <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center">
                <Flag className="w-3 h-3 mr-0.5 text-purple-500" /> 高市17:
              </span>
              {exhibitor.takaichi17.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* 産業カテゴリ */}
          <div className="flex items-center flex-wrap gap-1">
            <span className="text-[10px] font-bold text-slate-400 mr-1">産業:</span>
            {exhibitor.industries.map((ind) => (
              <span
                key={ind}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: INITIAL / Kepple Deep Links & Status */}
      <div className="pt-3 border-t border-slate-100 mt-2">
        {/* Deep Links Header */}
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>スタートアップ詳細情報リンク</span>
          <span className="text-emerald-700 font-bold normal-case">
            {copied ? '✓ 社名をコピーしました' : '※ クリックで社名自動コピー＆直行'}
          </span>
        </div>

        {/* Action Link Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
          {/* INITIAL Link */}
          <a
            href={exhibitor.links.initialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              navigator.clipboard.writeText(exhibitor.companyName);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors shadow-2xs group/link"
            title="INITIAL掲載ページへ直行（社名も自動コピーされます）"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-0.5"></span>
            <span>INITIAL</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100" />
          </a>

          {/* Kepple Link */}
          <a
            href={exhibitor.links.keppleUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              navigator.clipboard.writeText(exhibitor.companyName);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 transition-colors shadow-2xs group/link"
            title="Kepple掲載ページへ直行（社名も自動コピーされます）"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-0.5"></span>
            <span>Kepple</span>
            <ExternalLink className="w-3 h-3 opacity-60 group-hover/link:opacity-100" />
          </a>

          {/* Official HP */}
          {exhibitor.officialUrl && (
            <a
              href={exhibitor.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="公式HPを開く"
            >
              <Globe className="w-3 h-3" />
              <span>HP</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-60" />
            </a>
          )}

          {/* Google Search / News */}
          <a
            href={exhibitor.links.googleSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Google資金調達検索を開く"
          >
            <Search className="w-3 h-3" />
            <span>Google</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>

        {/* DHV Status Selector & Detail Modal Trigger */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] text-slate-400 font-medium">ステータス:</span>
            <select
              value={exhibitor.dhvStatus}
              onChange={(e) => onChangeStatus(exhibitor.id, e.target.value as DHVStatus)}
              className={`text-xs font-bold px-2 py-1 rounded-md border outline-none cursor-pointer ${getStatusColor(
                exhibitor.dhvStatus
              )}`}
            >
              <option value="未対応">未対応</option>
              <option value="注目・Watch">注目・Watch</option>
              <option value="アプローチ済">アプローチ済</option>
              <option value="面談設定">面談設定</option>
              <option value="投資検討中">投資検討中</option>
              <option value="見送り">見送り</option>
            </select>
          </div>

          <button
            onClick={() => onOpenDetail(exhibitor)}
            className="text-xs text-red-600 hover:text-red-700 font-bold px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors"
          >
            詳細を見る →
          </button>
        </div>
      </div>
    </div>
  );
};
