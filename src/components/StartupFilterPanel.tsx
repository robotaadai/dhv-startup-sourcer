'use client';

import React, { useState } from 'react';
import {
  StartupReverseFilters,
  ExpectationRank,
  ExpectationRadarScores,
  FundingStage,
  FUNDING_STAGES,
  AsufukaketsuKey,
  ASUFUKAKETSU_CONFIG,
  TakaichiField,
  TAKAICHI_17_FIELDS,
  EventRegion,
  EVENT_REGIONS,
} from '@/types';
import { RADAR_AXES } from './OctagonRadarChart';
import {
  Search,
  RotateCcw,
  Sparkles,
  Trophy,
  BarChart3,
  Calendar,
  ShieldCheck,
  Building,
  CheckSquare,
  Square,
  HelpCircle,
} from 'lucide-react';

interface StartupFilterPanelProps {
  filters: StartupReverseFilters;
  onApplyFilters: (filters: StartupReverseFilters) => void;
  totalStartupsCount: number;
  matchedCount: number;
}

export const StartupFilterPanel: React.FC<StartupFilterPanelProps> = ({
  filters,
  onApplyFilters,
  totalStartupsCount,
  matchedCount,
}) => {
  // 手動更新用のドラフト状態
  const [draft, setDraft] = useState<StartupReverseFilters>(filters);

  // セクションの有効/無効トグル
  const toggleSection = (sectionKey: keyof typeof draft.enabledSections) => {
    setDraft((prev) => ({
      ...prev,
      enabledSections: {
        ...prev.enabledSections,
        [sectionKey]: !prev.enabledSections[sectionKey],
      },
    }));
  };

  // 期待度ランク
  const toggleRank = (rank: ExpectationRank) => {
    setDraft((prev) => {
      const exists = prev.expectationRanks.includes(rank);
      return {
        ...prev,
        expectationRanks: exists
          ? prev.expectationRanks.filter((r) => r !== rank)
          : [...prev.expectationRanks, rank],
      };
    });
  };

  // 8軸の特定強み
  const toggleTrait = (traitKey: keyof ExpectationRadarScores) => {
    setDraft((prev) => {
      const exists = prev.expectationTraits.includes(traitKey);
      return {
        ...prev,
        expectationTraits: exists
          ? prev.expectationTraits.filter((t) => t !== traitKey)
          : [...prev.expectationTraits, traitKey],
      };
    });
  };

  // ステージ
  const toggleStage = (stage: FundingStage) => {
    setDraft((prev) => {
      const exists = prev.fundingStages.includes(stage);
      return {
        ...prev,
        fundingStages: exists
          ? prev.fundingStages.filter((s) => s !== stage)
          : [...prev.fundingStages, stage],
      };
    });
  };

  // アスフカケツノ
  const toggleAsu = (key: AsufukaketsuKey) => {
    setDraft((prev) => {
      const exists = prev.asufukaketsu.includes(key);
      return {
        ...prev,
        asufukaketsu: exists
          ? prev.asufukaketsu.filter((k) => k !== key)
          : [...prev.asufukaketsu, key],
      };
    });
  };

  // 高市17
  const toggleTakaichi = (field: TakaichiField) => {
    setDraft((prev) => {
      const exists = prev.takaichi17.includes(field);
      return {
        ...prev,
        takaichi17: exists
          ? prev.takaichi17.filter((f) => f !== field)
          : [...prev.takaichi17, field],
      };
    });
  };

  // 会える地域
  const toggleRegion = (reg: EventRegion) => {
    setDraft((prev) => {
      const exists = prev.meetingRegions.includes(reg);
      return {
        ...prev,
        meetingRegions: exists
          ? prev.meetingRegions.filter((r) => r !== reg)
          : [...prev.meetingRegions, reg],
      };
    });
  };

  // リセット
  const handleReset = () => {
    const defaultFilters: StartupReverseFilters = {
      searchQuery: '',
      expectationRanks: [],
      expectationTraits: [],
      fundingStages: [],
      maxYearsSinceEst: null,
      totalFundingRange: 'ALL',
      asufukaketsu: [],
      takaichi17: [],
      meetingTimeframe: 'ALL',
      meetingRegions: [],
      meetingType: 'ALL',
      eventParticipation: 'ALL',
      excludeDHVPortfolio: true, // ★ デフォルトでDHV投資先は除外
      enabledSections: {
        expectation: true,
        quantitative: true,
        asufukaketsu: true,
        meetingEvent: true,
      },
    };
    setDraft(defaultFilters);
    onApplyFilters(defaultFilters);
  };

  // 検索実行
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onApplyFilters(draft);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs mb-6">
      <form onSubmit={handleSearchSubmit} className="space-y-5">
        {/* Header & Main Search Bar */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-red-50 text-red-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>スタートアップ逆引き リッチ検索パネル</span>
                  <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
                    八角形レーダー評価 × 会える展示会
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  8つの期待ポイントやステージ、大和ハウスシナジーから絞り込み、直近で直接会える展示会・ピッチを逆引き
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-red-600 flex items-center space-x-1 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3 h-3" />
              <span>条件を初期化</span>
            </button>
          </div>

          {/* キーワード検索窓 */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={draft.searchQuery}
              onChange={(e) => setDraft({ ...draft, searchQuery: e.target.value })}
              placeholder="社名、事業概要、キーワード（例: Arch, 衛星, ロボット, 物流, 建機シェアリング）で検索..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs"
            >
              検索
            </button>
          </div>

          {/* ★ デフォルトでDHV投資先は検索結果から除外（チェックボックス） */}
          <div className="mt-2.5 flex items-center justify-between px-3 py-2 bg-amber-50/70 border border-amber-200/80 rounded-xl">
            <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-bold text-amber-950 select-none">
              <input
                type="checkbox"
                checked={draft.excludeDHVPortfolio}
                onChange={(e) => setDraft({ ...draft, excludeDHVPortfolio: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-amber-300"
              />
              <span className="flex items-center gap-1.5">
                <span>🏢 大和ハウス（DHV）出資先ポートフォリオ企業は除外する</span>
                <span className="text-[10px] text-amber-800 font-normal">（チェックONで除外 / 未投資の新規ソーシング対象に集中）</span>
              </span>
            </label>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                draft.excludeDHVPortfolio
                  ? 'bg-amber-200 text-amber-900'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {draft.excludeDHVPortfolio ? '除外中 (デフォルト)' : '投資先も含める'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 1: 8つの独自「期待ポイント」＆八角形評価 */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/60">
            <button
              type="button"
              onClick={() => toggleSection('expectation')}
              className="flex items-center space-x-2 text-left group"
            >
              {draft.enabledSections.expectation ? (
                <CheckSquare className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
              )}
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-900">
                  【八角形グラフ評価】独自の8大「期待ポイント」モメンタム
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    draft.enabledSections.expectation
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {draft.enabledSections.expectation ? '検索条件に適用中' : '条件から除外中'}
                </span>
              </div>
            </button>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              チェックを外すとこのセクション全体を無効化
            </span>
          </div>

          <div
            className={`space-y-3 transition-opacity ${
              draft.enabledSections.expectation ? 'opacity-100' : 'opacity-35 pointer-events-none'
            }`}
          >
            {/* 総合期待度ランク */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <span>総合期待度ランク (八角形総合スコア):</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { rank: 'S' as ExpectationRank, label: '★★★ Sランク (厳選トップ層・32点以上)', color: 'border-amber-400 bg-amber-50 text-amber-900' },
                  { rank: 'A' as ExpectationRank, label: '★★ Aランク (有力候補・24〜31点)', color: 'border-blue-300 bg-blue-50 text-blue-900' },
                  { rank: 'B' as ExpectationRank, label: '★ Bランク (観察・発展途上・23点以下)', color: 'border-emerald-300 bg-emerald-50 text-emerald-900' },
                ].map(({ rank, label, color }) => {
                  const isChecked = draft.expectationRanks.includes(rank);
                  return (
                    <button
                      key={rank}
                      type="button"
                      onClick={() => toggleRank(rank)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                        isChecked
                          ? 'ring-2 ring-red-500 shadow-xs ' + color
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8軸の特定強みチェック */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                8軸の特定強みで絞り込み (高評価4点以上のスタートアップ):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {RADAR_AXES.map((axis) => {
                  const isChecked = draft.expectationTraits.includes(axis.key);
                  return (
                    <button
                      key={axis.key}
                      type="button"
                      onClick={() => toggleTrait(axis.key)}
                      className={`p-2 rounded-lg text-left border transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'border-red-500 bg-red-50/60 shadow-2xs ring-1 ring-red-500'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <span>{axis.icon}</span>
                          <span>{axis.label}</span>
                        </span>
                        <span
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] font-bold ${
                            isChecked ? 'bg-red-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked ? '✓' : ''}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 line-clamp-1">
                        {axis.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 2: 定量比較基準（ステージ・創業年・調達額） */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/60">
            <button
              type="button"
              onClick={() => toggleSection('quantitative')}
              className="flex items-center space-x-2 text-left group"
            >
              {draft.enabledSections.quantitative ? (
                <CheckSquare className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
              )}
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900">
                  定量比較（投資ステージ・創業年数・累計調達額）
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    draft.enabledSections.quantitative
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {draft.enabledSections.quantitative ? '検索条件に適用中' : '条件から除外中'}
                </span>
              </div>
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity ${
              draft.enabledSections.quantitative ? 'opacity-100' : 'opacity-35 pointer-events-none'
            }`}
          >
            {/* ステージ */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                投資ステージ:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {FUNDING_STAGES.map((stg) => {
                  const isChecked = draft.fundingStages.includes(stg);
                  return (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => toggleStage(stg)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {stg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 創業経過年数 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                創業経過年数:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '指定なし', val: null },
                  { label: '2年以内 (創業初期)', val: 2 },
                  { label: '3年以内', val: 3 },
                  { label: '5年以内', val: 5 },
                  { label: '7年以内', val: 7 },
                ].map(({ label, val }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setDraft({ ...draft, maxYearsSinceEst: val })}
                    className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                      draft.maxYearsSinceEst === val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* 累計調達額レンジ */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                累計調達規模:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: '指定なし' },
                  { id: 'UNDER_100M', label: '〜1億円 (シード)' },
                  { id: '100M_500M', label: '1〜5億円' },
                  { id: '500M_1500M', label: '5〜15億円' },
                  { id: 'OVER_1500M', label: '15億円以上' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, totalFundingRange: item.id as any })}
                    className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                      draft.totalFundingRange === item.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 3: 大和ハウス重要戦略（アスフカケツノ・高市17） */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/60">
            <button
              type="button"
              onClick={() => toggleSection('asufukaketsu')}
              className="flex items-center space-x-2 text-left group"
            >
              {draft.enabledSections.asufukaketsu ? (
                <CheckSquare className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
              )}
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-slate-900">
                  大和ハウスグループ「アスフカケツノ」＆ 高市17重要技術分野
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    draft.enabledSections.asufukaketsu
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {draft.enabledSections.asufukaketsu ? '検索条件に適用中' : '条件から除外中'}
                </span>
              </div>
            </button>
          </div>

          <div
            className={`space-y-3 transition-opacity ${
              draft.enabledSections.asufukaketsu ? 'opacity-100' : 'opacity-35 pointer-events-none'
            }`}
          >
            {/* アスフカケツノ 1文字バッジ */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                アスフカケツノ (大和ハウス重要テーマ・1文字指定):
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['ア', 'ス', 'フ', 'カ', 'ケ', 'ツ', 'ノ', 'キ', 'ロ'] as AsufukaketsuKey[]).map((k) => {
                  const cfg = ASUFUKAKETSU_CONFIG[k];
                  const isChecked = draft.asufukaketsu.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleAsu(k)}
                      title={`${cfg.name}: ${cfg.description}`}
                      className={`w-8 h-8 rounded-lg text-sm font-black border transition-all ${
                        isChecked
                          ? 'bg-red-600 text-white border-red-700 ring-2 ring-red-400 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {k}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 高市17 */}
            <div>
              <div className="text-[11px] font-bold text-slate-700 mb-1.5">
                高市17重要技術分野:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {TAKAICHI_17_FIELDS.map((fld) => {
                  const isChecked = draft.takaichi17.includes(fld);
                  return (
                    <button
                      key={fld}
                      type="button"
                      onClick={() => toggleTakaichi(fld)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all ${
                        isChecked
                          ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {fld}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Section 4: いつ・どこで会えるか（展示会・ピッチ予定） */}
        {/* ========================================================================= */}
        <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50">
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-200/60">
            <button
              type="button"
              onClick={() => toggleSection('meetingEvent')}
              className="flex items-center space-x-2 text-left group"
            >
              {draft.enabledSections.meetingEvent ? (
                <CheckSquare className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">
                  いつ・どこで会えるか（次回イベント時期・地域・出展形式）
                </span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    draft.enabledSections.meetingEvent
                      ? 'bg-red-100 text-red-700'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {draft.enabledSections.meetingEvent ? '検索条件に適用中' : '条件から除外中'}
                </span>
              </div>
            </button>
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity ${
              draft.enabledSections.meetingEvent ? 'opacity-100' : 'opacity-35 pointer-events-none'
            }`}
          >
            {/* 会える時期 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                会える時期 (残り日数):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: '全期間' },
                  { id: 'WITHIN_1_MONTH', label: '📅 直近1ヶ月以内' },
                  { id: 'WITHIN_3_MONTHS', label: '📅 3ヶ月以内' },
                  { id: 'WITHIN_2026', label: '2026年内' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, meetingTimeframe: item.id as any })}
                    className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                      draft.meetingTimeframe === item.id
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 会場地域 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                会場エリア:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_REGIONS.map((reg) => {
                  const isChecked = draft.meetingRegions.includes(reg);
                  return (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => toggleRegion(reg)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                        isChecked
                          ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {reg}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 出展形式 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                出展・参加形式:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: 'すべて' },
                  { id: 'BOOTH_ONLY', label: '🎪 ブース出展あり' },
                  { id: 'PITCH_ONLY', label: '🎤 ピッチ登壇企業' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, meetingType: item.id as any })}
                    className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                      draft.meetingType === item.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* イベント出展状況 (出展あり / 出展予定なし) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                展示会・イベント出展状況:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ALL', label: '全企業 (出展なし含む)' },
                  { id: 'WITH_EVENTS', label: '🎪 直近出展あり' },
                  { id: 'WITHOUT_EVENTS', label: '⚪ 直近出展なしのみ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, eventParticipation: item.id as any })}
                    className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
                      draft.eventParticipation === item.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* フッター: 件数表示 & 検索ボタン */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-200 gap-3">
          <div className="text-xs text-slate-600">
            全 <strong className="text-slate-900">{totalStartupsCount}</strong> 社中、現在条件に合致:{' '}
            <strong className="text-red-600 font-bold text-sm">{matchedCount}</strong> 社
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-xl transition-all"
            >
              リセット
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow-md transition-all flex items-center space-x-1.5 active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>この条件で検索を更新</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
