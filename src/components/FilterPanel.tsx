'use client';

import React, { useState } from 'react';
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Toggle helpers
  const toggleAsufukaketsu = (key: AsufukaketsuKey) => {
    const next = filters.asufukaketsu.includes(key)
      ? filters.asufukaketsu.filter((k) => k !== key)
      : [...filters.asufukaketsu, key];
    onChangeFilters({ ...filters, asufukaketsu: next });
  };

  const toggleTakaichi = (field: TakaichiField) => {
    const next = filters.takaichi17.includes(field)
      ? filters.takaichi17.filter((f) => f !== field)
      : [...filters.takaichi17, field];
    onChangeFilters({ ...filters, takaichi17: next });
  };

  const toggleIndustry = (ind: IndustryCategory) => {
    const next = filters.industries.includes(ind)
      ? filters.industries.filter((i) => i !== ind)
      : [...filters.industries, ind];
    onChangeFilters({ ...filters, industries: next });
  };

  const toggleVenue = (venue: string) => {
    const next = filters.venues.includes(venue)
      ? filters.venues.filter((v) => v !== venue)
      : [...filters.venues, venue];
    onChangeFilters({ ...filters, venues: next });
  };

  const toggleRegion = (region: EventRegion) => {
    const next = filters.regions.includes(region)
      ? filters.regions.filter((r) => r !== region)
      : [...filters.regions, region];
    onChangeFilters({ ...filters, regions: next });
  };

  const toggleEventType = (evtType: EventType) => {
    const next = filters.eventTypes.includes(evtType)
      ? filters.eventTypes.filter((t) => t !== evtType)
      : [...filters.eventTypes, evtType];
    onChangeFilters({ ...filters, eventTypes: next });
  };

  const toggleStatus = (st: DHVStatus) => {
    const next = filters.dhvStatus.includes(st)
      ? filters.dhvStatus.filter((s) => s !== st)
      : [...filters.dhvStatus, st];
    onChangeFilters({ ...filters, dhvStatus: next });
  };

  const activeFilterCount =
    (filters.searchQuery ? 1 : 0) +
    filters.venues.length +
    filters.regions.length +
    filters.eventTypes.length +
    filters.asufukaketsu.length +
    filters.takaichi17.length +
    filters.industries.length +
    (filters.excludeDHVPortfolio ? 1 : 0) +
    (filters.portfolioFilter !== 'all' ? 1 : 0) +
    (filters.startupOnly ? 1 : 0) +
    (filters.maxYearsSinceEst ? 1 : 0) +
    filters.dhvStatus.length;

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
              value={filters.searchQuery}
              onChange={(e) => onChangeFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-10 pr-10 py-2.5 bg-white rounded-xl border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onChangeFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center flex-wrap gap-2">
            {/* ★ 「DHV投資先は非表示」専用ボタン */}
            <button
              type="button"
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  excludeDHVPortfolio: !filters.excludeDHVPortfolio,
                  // もし投資先のみを選んでいた場合は解除
                  portfolioFilter: !filters.excludeDHVPortfolio ? 'uninvested_only' : 'all',
                })
              }
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border select-none ${
                filters.excludeDHVPortfolio
                  ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600 ring-2 ring-amber-500/30'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>{filters.excludeDHVPortfolio ? 'DHV投資先は非表示中' : 'DHV投資先は非表示'}</span>
            </button>

            {/* Startup Only Toggle */}
            <label className="flex items-center space-x-2 px-3 py-2 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={filters.startupOnly}
                onChange={(e) => onChangeFilters({ ...filters, startupOnly: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <span className="text-xs font-bold text-red-900 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-red-600" />
                SUのみ
              </span>
            </label>

            {/* Expand / Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>絞り込み</span>
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
                onClick={onResetFilters}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                title="条件をクリア"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
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
                      全国エリア（関東・関西・中部・九州・北海道）
                    </span>
                  </div>
                  {filters.regions.length > 0 && (
                    <button
                      onClick={() => onChangeFilters({ ...filters, regions: [] })}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      すべて選択解除
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EVENT_REGIONS.map((region) => {
                    const isActive = filters.regions.includes(region);
                    return (
                      <button
                        key={region}
                        type="button"
                        onClick={() => toggleRegion(region)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        📍 {region}
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
                      イベント種別（サミット・ピッチ・展示会）
                    </span>
                  </div>
                  {filters.eventTypes.length > 0 && (
                    <button
                      onClick={() => onChangeFilters({ ...filters, eventTypes: [] })}
                      className="text-[11px] text-orange-600 hover:text-orange-800 font-semibold"
                    >
                      すべて選択解除
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {EVENT_TYPES.map((type) => {
                    const isActive = filters.eventTypes.includes(type);
                    const isSummit = type.includes('サミット') || type.includes('ピッチ');
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleEventType(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          isActive
                            ? isSummit
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-xs'
                              : 'bg-slate-800 text-white border-slate-800 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type === 'スタートアップ特化サミット'
                          ? '🔥 サミット (IVS/ICC/SusHi等)'
                          : type === 'ピッチコンテスト・アクセラレーター'
                          ? '🏆 ピッチ登壇企業'
                          : '🏢 大型産業展示会'}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: アスフカケツノ 7領域 ＋ キ・ロ (大和ハウスグループ重点) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  大和ハウス重点投資テーマ（アスフカケツノ ＋ キ・ロ）
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  (CVCファンド公式ポートフォリオ分類)
                </span>
              </div>
              {filters.asufukaketsu.length > 0 && (
                <button
                  onClick={() => onChangeFilters({ ...filters, asufukaketsu: [] })}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  選択解除
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
              {(Object.keys(ASUFUKAKETSU_CONFIG) as AsufukaketsuKey[]).map((key) => {
                const conf = ASUFUKAKETSU_CONFIG[key];
                const isActive = filters.asufukaketsu.includes(key);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleAsufukaketsu(key)}
                    className={`flex flex-col items-start p-2 rounded-xl border text-left transition-all ${
                      isActive
                        ? `${conf.bgColor} ${conf.borderColor} ring-2 ring-amber-500/30 shadow-xs`
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded ${conf.bgColor} ${conf.color}`}>
                        {key}
                      </span>
                      {isActive && <span className="text-[9px] font-bold text-amber-600">選択中</span>}
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{conf.name}</span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{conf.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: 高市政権 17戦略分野 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-1.5">
                <Flag className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  ③ 高市政権 17戦略分野（国家危機管理投資・経済安保）
                </span>
              </div>
              {filters.takaichi17.length > 0 && (
                <button
                  onClick={() => onChangeFilters({ ...filters, takaichi17: [] })}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  選択解除
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TAKAICHI_17_FIELDS.map((field) => {
                const isActive = filters.takaichi17.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleTakaichi(field)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      isActive
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {field}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: 産業分類 ＆ ステージ ＆ 会場 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-3 border-t border-slate-100">
            {/* ① 産業別 */}
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-2">
                ① 産業カテゴリ
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {INDUSTRY_CATEGORIES.map((cat) => {
                  const isActive = filters.industries.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleIndustry(cat)}
                      className={`px-2 py-0.8 rounded-md text-[11px] font-medium border transition-all ${
                        isActive
                          ? 'bg-slate-800 text-white border-slate-800'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ステージ・設立年数 */}
            <div>
              <span className="text-xs font-bold text-slate-900 block mb-2">
                ④ 設立からの経過年数
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: '指定なし', value: null },
                  { label: '3年以内 (シード帯)', value: 3 },
                  { label: '5年以内 (アーリー帯)', value: 5 },
                  { label: '10年以内', value: 10 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onChangeFilters({ ...filters, maxYearsSinceEst: item.value })}
                    className={`px-2 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      filters.maxYearsSinceEst === item.value
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
                {filters.venues.length > 0 && (
                  <button
                    onClick={() => onChangeFilters({ ...filters, venues: [] })}
                    className="text-[11px] text-sky-600 hover:text-sky-800"
                  >
                    解除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '東京ビッグサイト',
                  '幕張メッセ',
                  'パシフィコ横浜',
                  'インテックス大阪',
                  'みやこめっせ京都',
                  'ポートメッセなごや',
                  '福岡国際会議場',
                ].map((venue) => {
                  const isActive = filters.venues.includes(venue);
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
              <span className="text-xs font-bold text-slate-900 block mb-2">
                社内検討ステータス (DHV)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(['未対応', 'DHV投資済', '注目・Watch', 'アプローチ済', '面談設定', '投資検討中', '見送り'] as DHVStatus[]).map((st) => {
                  const isActive = filters.dhvStatus.includes(st);
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
          </div>
        </div>
      )}
    </div>
  );
};
