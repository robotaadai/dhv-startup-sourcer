'use client';

import React, { useState } from 'react';
import { StartupExhibitor, ASUFUKAKETSU_CONFIG, DHVStatus } from '@/types';
import {
  X,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Building2,
  Globe,
  Search,
  FileText,
  ShieldCheck,
  Flag,
  Save,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface StartupDetailModalProps {
  exhibitor: StartupExhibitor | null;
  onClose: () => void;
  onSaveMemo: (id: string, memo: string, status: DHVStatus) => void;
}

export const StartupDetailModal: React.FC<StartupDetailModalProps> = ({
  exhibitor,
  onClose,
  onSaveMemo,
}) => {
  if (!exhibitor) return null;

  const [memo, setMemo] = useState<string>(exhibitor.memo || '');
  const [status, setStatus] = useState<DHVStatus>(exhibitor.dhvStatus);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSave = () => {
    onSaveMemo(exhibitor.id, memo, status);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyName = () => {
    navigator.clipboard.writeText(exhibitor.companyName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-red-50/30 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                {exhibitor.fundingStage}
              </span>
              {exhibitor.establishedYear && (
                <span className="text-xs text-slate-500 font-medium">
                  {exhibitor.establishedYear}年設立（設立{exhibitor.yearsSinceEst}年目）
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {exhibitor.companyName}
              </h2>
              <button
                onClick={handleCopyName}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center text-xs font-medium"
                title="社名をコピー"
              >
                {copied ? (
                  <span className="text-emerald-600 font-bold flex items-center">
                    <Check className="w-3.5 h-3.5 mr-1" /> コピー済
                  </span>
                ) : (
                  <span className="flex items-center text-slate-500">
                    <Copy className="w-3.5 h-3.5 mr-1" /> 社名コピー
                  </span>
                )}
              </button>
            </div>
            {exhibitor.companyNameEn && (
              <p className="text-xs text-slate-500">{exhibitor.companyNameEn}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">出展イベント</span>
              <span className="text-xs font-bold text-slate-800 line-clamp-1" title={exhibitor.eventName}>
                {exhibitor.eventName}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">会場・ブース</span>
              <span className="text-xs font-bold text-slate-800">
                {exhibitor.eventVenue} / {exhibitor.boothNumber}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">開催日程</span>
              <span className="text-xs font-bold text-slate-800">
                {exhibitor.eventStartDate} 〜 {exhibitor.eventEndDate}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">推定評価額 / 調達累計</span>
              <span className="text-xs font-bold text-red-600">
                {exhibitor.estimatedValuation || '—'} / {exhibitor.totalFunding || '—'}
              </span>
            </div>
          </div>

          {/* AI Synergy & Summary */}
          <div className="bg-gradient-to-br from-red-50/70 via-orange-50/40 to-white p-4 sm:p-5 rounded-2xl border border-red-200">
            <div className="flex items-center text-red-900 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4 mr-1.5 text-red-600" />
              大和ハウスベンチャーズ (DHV) 注目・共創シナジー分析
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {exhibitor.aiSummary}
            </p>
          </div>

          {/* 出展製品・技術概要 */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-slate-500" />
              出展技術・ソリューション概要
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
              {exhibitor.description}
            </div>
          </div>

          {/* 分類タグ */}
          <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
            {/* アスフカケツノ */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-600" />
                大和ハウス「アスフカケツノ」該当領域:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exhibitor.asufukaketsu.map((k) => {
                  const conf = ASUFUKAKETSU_CONFIG[k];
                  return (
                    <span
                      key={k}
                      className={`px-2 py-1 rounded-md text-xs font-bold ${conf.bgColor} ${conf.color} border ${conf.borderColor}`}
                    >
                      【{k}】{conf.name} - {conf.description}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* 高市17戦略分野 */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center">
                <Flag className="w-3.5 h-3.5 mr-1 text-purple-600" />
                高市政権 17戦略分野（経済安保・危機管理投資）:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exhibitor.takaichi17.map((f) => (
                  <span
                    key={f}
                    className="px-2.5 py-0.8 rounded-md text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* 産業カテゴリ */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                産業カテゴリ:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {exhibitor.industries.map((ind) => (
                  <span
                    key={ind}
                    className="px-2 py-0.5 rounded text-xs bg-slate-200 text-slate-800 font-medium"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* INITIAL / Kepple / 外部リンクジャンプ */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-400">
                  DEEP LINK INTEGRATION
                </span>
                <h4 className="text-sm font-bold text-white">
                  スタートアップ情報データベース直行
                </h4>
              </div>
              <span className="text-[11px] text-emerald-400 font-bold bg-slate-800 px-2.5 py-1 rounded">
                {copied ? '✓ 社名をクリップボードにコピーしました' : '※ クリック時に社名も自動コピー'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              契約中のINITIALまたはKeppleの企業詳細に直行します。社名が自動コピーされるため、ログイン後の検索窓で <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-white font-mono text-[10px]">Cmd+V</kbd> を押せば即座に資本政策・株主一覧・直近評価額を確認できます。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={exhibitor.links.initialUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCopyName}
                className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  <span>INITIAL で企業詳細・調達履歴を見る</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={exhibitor.links.keppleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleCopyName}
                className="flex items-center justify-between p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                  <span>Kepple で株主・登記情報を確認する</span>
                </div>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="flex items-center justify-center space-x-4 mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
              {exhibitor.officialUrl && (
                <a
                  href={exhibitor.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center space-x-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>企業公式サイト</span>
                </a>
              )}
              <a
                href={exhibitor.links.googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center space-x-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Google 資金調達ニュース検索</span>
              </a>
              <a
                href={exhibitor.links.corporateNumberUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center space-x-1"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>国税庁 法人番号公表</span>
              </a>
            </div>
          </div>

          {/* 投資部内メモ ＆ ステータス更新 */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900">
                DHV 投資部内ステータス & ソーシングメモ
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500">ステータス:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DHVStatus)}
                  className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-300 rounded-lg outline-none"
                >
                  <option value="未対応">未対応</option>
                  <option value="注目・Watch">注目・Watch</option>
                  <option value="アプローチ済">アプローチ済</option>
                  <option value="面談設定">面談設定</option>
                  <option value="投資検討中">投資検討中</option>
                  <option value="見送り">見送り</option>
                </select>
              </div>
            </div>

            <textarea
              rows={3}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="展示会ブースでの面談メモ、担当事業部との親和性、フォローアップ予定など..."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />

            <div className="flex items-center justify-between mt-3">
              {savedSuccess ? (
                <span className="text-xs text-emerald-600 font-bold flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-1" /> 保存しました
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  ※ ブラウザに自動保存され、CSV出力時にも反映されます
                </span>
              )}

              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>メモとステータスを保存</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
