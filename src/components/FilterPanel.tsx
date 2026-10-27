'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AsufukaketsuKey,
  ASUFUKAKETSU_CONFIG,
  TAKAICHI_17_FIELDS,
  TakaichiField,
  INDUSTRY_CATEGORIES,
  IndustryCategory,
  DHVStatus,
  FilterOptions,
  EVENT_REGIONS,
  EventRegion,
  EVENT_TYPES,
  EventType,
} from '@/types';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ShieldCheck,
  Flag,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Crown,
  EyeOff,
  MapPin,
  Flame,
  Check,
} from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  onChangeFilters: (newFilters: FilterOptions) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  totalFiltered,
}) => {
  // 編集中のドラフトフィルター（「検索」ボタンを押すまで親の検索結果には反映されない）
  const [draftFilters, setDraftFilters] = useState<FilterOptions>(filters);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // 外部からのリセットや更新時に同期
  useEffect(() => {
    setDraftFilters(filters);
  }, [filters]);

  // 未適用の変更があるか判定
  const isDirty = useMemo(() => {
    return JSON.stringify(draftFilters) !== JSON.stringify(filters);
  }, [draftFilters, filters]);

  // 「検索」ボタン押下ハンドラー（親の検索結果を更新）
  const handleApplySearch = () => {
    onChangeFilters(draftFilters);
  };

  // Enterキー押下で検索実行
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleApplySearch();
    }
  };

  // 全条件クリア
  const handleReset = () => {
    onResetFilters();
  };

  // Toggle helpers (すべてドラフト状態を更新)
  const toggleAsufukaketsu = (key: AsufukaketsuKey) => {
    const next = draftFilters.asufukaketsu.includes(key)
      ? draftFilters.asufukaketsu.filter((k) => k !== key)
      : [...draftFilters.asufukaketsu, key];
    setDraftFilters({ ...draftFilters, asufukaketsu: next });
  };

  const toggleTakaichi = (field: TakaichiField) => {
    const next = draftFilters.takaichi17.includes(field)
      ? draftFilters.takaichi17.filter((f) => f !== field)
      : [...draftFilters.takaichi17, field];
    setDraftFilters({ ...draftFilters, takaichi17: next });
  };

  const toggleIndustry = (ind: IndustryCategory) => {
    const next = draftFilters.industries.includes(ind)
      ? draftFilters.industries.filter((i) => i !== ind)
      : [...draftFilters.industries, ind];
    setDraftFilters({ ...draftFilters, industries: next });
  };

  const toggleVenue = (venue: string) => {
    const next = draftFilters.venues.includes(venue)
      ? draftFilters.venues.filter((v) => v !== venue)
      : [...draftFilters.venues, venue];
    setDraftFilters({ ...draftFilters, venues: next });
  };

  const toggleRegion = (region: EventRegion) => {
    const next = draftFilters.regions.includes(region)
      ? draftFilters.regions.filter((r) => r !== region)
      : [...draftFilters.regions, region];
    setDraftFilters({ ...draftFilters, regions: next });
  };

  const toggleEventType = (evtType: EventType) => {
    const next = draftFilters.eventTypes.includes(evtType)
      ? draftFilters.eventTypes.filter((t) => t !== evtType)
      : [...draftFilters.eventTypes, evtType];
    setDraftFilters({ ...draftFilters, eventTypes: next });
  };

  const toggleStatus = (st: DHVStatus) => {
    const next = draftFilters.dhvStatus.includes(st)
      ? draftFilters.dhvStatus.filter((s) => s !== st)
      : [...draftFilters.dhvStatus, st];
    setDraftFilters({ ...draftFilters, dhvStatus: next });
  };

  const toggleSectionEnabled = (section: keyof typeof draftFilters.enabledSections) => {
    setDraftFilters({
      ...draftFilters,
      enabledSections: {
        ...draftFilters.enabledSections,
        [section]: !draftFilters.enabledSections[section],
      },
    });
  };

  const activeFilterCount =
    (draftFilters.searchQuery ? 1 : 0) +
    (draftFilters.enabledSections?.venues ? draftFilters.venues.length : 0) +
    (draftFilters.enabledSections?.regions ? draftFilters.regions.length : 0) +
    (draftFilters.enabledSections?.eventTypes ? draftFilters.eventTypes.length : 0) +
    (draftFilters.enabledSections?.asufukaketsu ? draftFilters.asufukaketsu.length : 0) +
    (draftFilters.enabledSections?.takaichi17 ? draftFilters.takaichi17.length : 0) +
    (draftFilters.enabledSections?.industries ? draftFilters.industries.length : 0) +
    (draftFilters.excludeDHVPortfolio ? 1 : 0) +
    (draftFilters.portfolioFilter !== 'all' ? 1 : 0) +
    (draftFilters.startupOnly ? 1 : 0) +
    (draftFilters.enabledSections?.maxYearsSinceEst && draftFilters.maxYearsSinceEst ? 1 : 0) +
    (draftFilters.enabledSections?.dhvStatus ? draftFilters.dhvStatus.length : 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
      {/* Search Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Free-word Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="社名、出展品目、先端技術（例: 核融合、SAR衛星、自律トラック、インフラ保全...）"
              value={draftFilters.searchQuery}
              onChange={(e) => setDraftFilters({ ...draftFilters, searchQuery: e.target.value })}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            {draftFilters.searchQuery && (
              <button
                type="button"
                onClick={() => setDraftFilters({ ...draftFilters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center flex-wrap gap-2">
            {/* ★ 「DHV投資先は除外」チェックボックス */}
            <label className={`flex items-center space-x-2 px-3 py-2 rounded-xl border cursor-pointer select-none transition-all shadow-xs ${
              draftFilters.excludeDHVPortfolio
                ? 'bg-amber-100 hover:bg-amber-200 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-500/20'
                : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
            }`}>
              <input
                type="checkbox"
                checked={draftFilters.excludeDHVPortfolio}
                onChange={(e) =>
                  setDraftFilters({
                    ...draftFilters,
                    excludeDHVPortfolio: e.target.checked,
                    portfolioFilter: e.target.checked ? 'uninvested_only' : 'all',
                  })
                }
                className="w-4 h-4 text-amber-600 rounded border-amber-400 focus:ring-amber-500"
              />
              <span className="text-xs font-bold flex items-center">
                <EyeOff className="w-3.5 h-3.5 mr-1 text-amber-700" />
                DHV投資先を除外
              </span>
            </label>

            {/* Startup Only Toggle */}
            <label className="flex items-center space-x-2 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={draftFilters.startupOnly}
                onChange={(e) => setDraftFilters({ ...draftFilters, startupOnly: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-red-900 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-red-600" />
                SUのみ
              </span>
            </label>

            {/* Expand / Collapse Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>絞り込み詳細</span>
              {activeFilterCount > 0 && (
                <span className="px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
            </button>

            {/* Reset Button */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                title="全条件をクリア"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 検索フィールド右下の「検索」ボタンエリア */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-200/80">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            {isDirty ? (
              <span className="inline-flex items-center text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                検索条件が変更されました。「検索」ボタンを押して結果を更新してください
              </span>
            ) : (
              <span className="text-slate-500">
                現在の検索条件が適用されています（Enterキーまたは「検索」ボタンで即時更新）
              </span>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2.5">
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-300 transition-colors"
              >
                条件クリア
              </button>
            )}

            {/* ★ 検索フィールド右下に配置された「検索」ボタン */}
            <button
              type="button"
              onClick={handleApplySearch}
              className={`inline-flex items-center space-x-2 px-6 py-2 rounded-xl text-xs font-black transition-all shadow-md cursor-pointer select-none ${
                isDirty
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white ring-2 ring-red-400 shadow-red-200 scale-102'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>検索</span>
              {isDirty ? (
                <span className="text-[10px] bg-white text-red-600 font-extrabold px-1.5 py-0.2 rounded-full">
                  更新
                </span>
              ) : (
                <span className="text-[10px] bg-slate-800 text-slate-300 font-normal px-1.5 py-0.2 rounded">
                  {totalFiltered}件
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Filter Sections */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-5 bg-white">
          {/* Section 0: 全国開催地域 ＆ イベント種別 (サミット・ピッチ・展示会) */}
          <div className="p-3.5 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50/70 rounded-xl border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ① 開催地域エリア */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-900">
                      全国エリア
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* チェックボックス */}
                    <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      <input
                        type="checkbox"
                        checked={draftFilters.enabledSections?.regions ?? true}
                        onChange={() => toggleSectionEnabled('regions')}
                        className="w-3 h-3 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className={draftFilters.enabledSections?.regions ? 'text-blue-900' : 'text-slate-400'}>
                        {draftFilters.enabledSections?.regions ? '検索に適用' : '除外中'}
                      </span>
                    </label>
                    {draftFilters.regions.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setDraftFilters({ ...draftFilters, regions: [] })}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        クリア
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={`flex flex-wrap gap-1.5 transition-opacity ${
                    draftFilters.enabledSections?.regions ? 'opacity-100' : 'opacity-40 pointer-events-none'
                  }`}
                >
                  {EVENT_REGIONS.map((region) => {
                    const isActive = draftFilters.regions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ② イベント種別 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Flame className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-slate-900">
                      イベント種別
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* チェックボックス */}
                    <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      <input
                        type="checkbox"
                        checked={draftFilters.enabledSections?.eventTypes ?? true}
                        onChange={() => toggleSectionEnabled('eventTypes')}
                        className="w-3 h-3 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                      />
                      <span className={draftFilters.enabledSections?.eventTypes ? 'text-orange-900' : 'text-slate-400'}>
                        {draftFilters.enabledSections?.eventTypes ? '検索に適用' : '除外中'}
                      </span>
                    </label>
                    {draftFilters.eventTypes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setDraftFilters({ ...draftFilters, eventTypes: [] })}
                        className="text-[11px] text-orange-600 hover:text-orange-800 font-semibold"
                      >
                        クリア
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={`flex flex-wrap gap-1.5 transition-opacity ${
                    draftFilters.enabledSections?.eventTypes ? 'opacity-100' : 'opacity-40 pointer-events-none'
                  }`}
                >
                  {EVENT_TYPES.map((evtType) => {
                    const isActive = draftFilters.eventTypes.includes(evtType);
                    return (
                      <button
                        key={evtType}
                        type="button"
                        onClick={() => toggleEventType(evtType)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                          isActive
                            ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {evtType}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: 大和ハウス「アスフカケツノ」 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-red-600" />
                <span className="text-xs font-bold text-slate-900">
                  大和ハウスグループ「アスフカケツノ」重要戦略領域
                </span>
                <span className="text-[11px] text-slate-400">
                  (安全・スピード・福祉・環境・健康・通信・農業・絆・ロボット)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* チェックボックス */}
                <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  <input
                    type="checkbox"
                    checked={draftFilters.enabledSections?.asufukaketsu ?? true}
                    onChange={() => toggleSectionEnabled('asufukaketsu')}
                    className="w-3 h-3 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                  />
                  <span className={draftFilters.enabledSections?.asufukaketsu ? 'text-red-900' : 'text-slate-400'}>
                    {draftFilters.enabledSections?.asufukaketsu ? '検索に適用' : '除外中'}
                  </span>
                </label>
                {draftFilters.asufukaketsu.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDraftFilters({ ...draftFilters, asufukaketsu: [] })}
                    className="text-[11px] text-red-600 hover:text-red-800 font-semibold"
                  >
                    選択解除
                  </button>
                )}
              </div>
            </div>

            <div
              className={`grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5 transition-opacity ${
                draftFilters.enabledSections?.asufukaketsu ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              {(Object.keys(ASUFUKAKETSU_CONFIG) as AsufukaketsuKey[]).map((key) => {
                const conf = ASUFUKAKETSU_CONFIG[key];
                const isActive = draftFilters.asufukaketsu.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleAsufukaketsu(key)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                      isActive
                        ? `${conf.bgColor} ${conf.borderColor} ${conf.color} ring-2 ring-red-500 shadow-xs font-bold`
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-base font-black leading-none mb-0.5">{key}</span>
                    <span className="text-[10px] tracking-tighter truncate max-w-full font-bold">
                      {conf.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: 高市政権 17戦略分野 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Flag className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-900">
                  高市政権 17戦略分野（経済安保・国家強靭化投資）
                </span>
                <span className="text-[11px] text-slate-400">
                  (核融合・防衛テック・量子・宇宙・先端半導体・サイバー等)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* チェックボックス */}
                <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  <input
                    type="checkbox"
                    checked={draftFilters.enabledSections?.takaichi17 ?? true}
                    onChange={() => toggleSectionEnabled('takaichi17')}
                    className="w-3 h-3 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
                  />
                  <span className={draftFilters.enabledSections?.takaichi17 ? 'text-purple-900' : 'text-slate-400'}>
                    {draftFilters.enabledSections?.takaichi17 ? '検索に適用' : '除外中'}
                  </span>
                </label>
                {draftFilters.takaichi17.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDraftFilters({ ...draftFilters, takaichi17: [] })}
                    className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    選択解除
                  </button>
                )}
              </div>
            </div>

            <div
              className={`flex flex-wrap gap-1.5 transition-opacity ${
                draftFilters.enabledSections?.takaichi17 ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              {TAKAICHI_17_FIELDS.map((field) => {
                const isActive = draftFilters.takaichi17.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleTakaichi(field)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {field}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: 産業カテゴリ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 block">
                産業・バーティカルカテゴリ
              </span>
              <div className="flex items-center space-x-2">
                {/* チェックボックス */}
                <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  <input
                    type="checkbox"
                    checked={draftFilters.enabledSections?.industries ?? true}
                    onChange={() => toggleSectionEnabled('industries')}
                    className="w-3 h-3 text-slate-700 rounded border-slate-300 focus:ring-slate-500 cursor-pointer"
                  />
                  <span className={draftFilters.enabledSections?.industries ? 'text-slate-900 font-bold' : 'text-slate-400'}>
                    {draftFilters.enabledSections?.industries ? '検索に適用' : '除外中'}
                  </span>
                </label>
                {draftFilters.industries.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setDraftFilters({ ...draftFilters, industries: [] })}
                    className="text-[11px] text-slate-500 hover:text-slate-800"
                  >
                    選択解除
                  </button>
                )}
              </div>
            </div>
            <div
              className={`flex flex-wrap gap-1.5 transition-opacity ${
                draftFilters.enabledSections?.industries ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              {INDUSTRY_CATEGORIES.map((ind) => {
                const isActive = draftFilters.industries.includes(ind);
                return (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => toggleIndustry(ind)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                      isActive
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {ind}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: 経過年数・会場・ステータス */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            {/* 設立後年数 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 block">
                  設立後年数（スタートアップ基準）
                </span>
                <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  <input
                    type="checkbox"
                    checked={draftFilters.enabledSections?.maxYearsSinceEst ?? true}
                    onChange={() => toggleSectionEnabled('maxYearsSinceEst')}
                    className="w-3 h-3 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                  />
                  <span className={draftFilters.enabledSections?.maxYearsSinceEst ? 'text-red-900 font-bold' : 'text-slate-400'}>
                    {draftFilters.enabledSections?.maxYearsSinceEst ? '検索に適用' : '除外中'}
                  </span>
                </label>
              </div>
              <div
                className={`flex flex-wrap gap-1.5 transition-opacity ${
                  draftFilters.enabledSections?.maxYearsSinceEst ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}
              >
                {[
                  { label: '指定なし', value: null },
                  { label: '5年以内', value: 5 },
                  { label: '10年以内', value: 10 },
                  { label: '15年以内', value: 15 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setDraftFilters({ ...draftFilters, maxYearsSinceEst: item.value })}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                      draftFilters.maxYearsSinceEst === item.value
                        ? 'bg-red-600 text-white border-red-600 font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* 会場フィルター */}
              <div className="flex items-center justify-between mt-3 mb-1.5">
                <span className="text-xs font-bold text-slate-900 block">
                  主要会場
                </span>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    <input
                      type="checkbox"
                      checked={draftFilters.enabledSections?.venues ?? true}
                      onChange={() => toggleSectionEnabled('venues')}
                      className="w-3 h-3 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                    />
                    <span className={draftFilters.enabledSections?.venues ? 'text-sky-900 font-bold' : 'text-slate-400'}>
                      {draftFilters.enabledSections?.venues ? '検索に適用' : '除外中'}
                    </span>
                  </label>
                  {draftFilters.venues.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setDraftFilters({ ...draftFilters, venues: [] })}
                      className="text-[11px] text-sky-600 hover:text-sky-800"
                    >
                      解除
                    </button>
                  )}
                </div>
              </div>
              <div
                className={`flex flex-wrap gap-1.5 transition-opacity ${
                  draftFilters.enabledSections?.venues ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}
              >
                {[
                  '東京ビッグサイト',
                  '幕張メッセ',
                  'パシフィコ横浜',
                  'インテックス大阪',
                  'みやこめっせ京都',
                  'ポートメッセなごや',
                  '福岡国際会議場',
                  '虎ノ門ヒルズフォーラム',
                ].map((venue) => {
                  const isActive = draftFilters.venues.includes(venue);
                  return (
                    <button
                      key={venue}
                      type="button"
                      onClick={() => toggleVenue(venue)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                        isActive
                          ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {venue}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 社内検討ステータス */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 block">
                  社内検討ステータス (DHV)
                </span>
                <label className="flex items-center space-x-1 cursor-pointer select-none text-[10px] font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  <input
                    type="checkbox"
                    checked={draftFilters.enabledSections?.dhvStatus ?? true}
                    onChange={() => toggleSectionEnabled('dhvStatus')}
                    className="w-3 h-3 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span className={draftFilters.enabledSections?.dhvStatus ? 'text-emerald-900 font-bold' : 'text-slate-400'}>
                    {draftFilters.enabledSections?.dhvStatus ? '検索に適用' : '除外中'}
                  </span>
                </label>
              </div>
              <div
                className={`flex flex-wrap gap-1.5 transition-opacity ${
                  draftFilters.enabledSections?.dhvStatus ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}
              >
                {(['未対応', 'DHV投資済', '注目・Watch', 'アプローチ済', '面談設定', '投資検討中', '見送り'] as DHVStatus[]).map((st) => {
                  const isActive = draftFilters.dhvStatus.includes(st);
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => toggleStatus(st)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                        isActive
                          ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st === 'DHV投資済' ? '👑 DHV投資済' : st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 検索実行アクション（パネル右下） */}
            <div className="flex flex-col justify-end bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-2 font-medium">
                {isDirty ? '変更した条件で検索結果を更新します' : '現在の条件で検索中'}
              </span>
              <button
                type="button"
                onClick={handleApplySearch}
                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isDirty
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white ring-2 ring-red-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>検索して結果を更新</span>
                {isDirty && (
                  <span className="text-[10px] bg-white text-red-600 font-extrabold px-1.5 py-0.2 rounded-full ml-1">
                    未反映あり
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
