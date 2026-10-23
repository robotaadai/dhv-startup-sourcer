'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ExhibitionEvent, StartupExhibitor, FilterOptions, DHVStatus } from '@/types';
import { INITIAL_EVENTS, INITIAL_EXHIBITORS } from '@/data/mockData';
import { Header } from '@/components/Header';
import { StatsSummary } from '@/components/StatsSummary';
import { EventTimeline } from '@/components/EventTimeline';
import { FilterPanel } from '@/components/FilterPanel';
import { StartupCard } from '@/components/StartupCard';
import { StartupDetailModal } from '@/components/StartupDetailModal';
import { CrawlerStatusModal } from '@/components/CrawlerStatusModal';
import { PortfolioModal } from '@/components/PortfolioModal';
import { Filter, Grid, ListFilter, AlertCircle, ArrowUpDown, Crown, EyeOff } from 'lucide-react';

const INITIAL_FILTERS: FilterOptions = {
  searchQuery: '',
  venues: [],
  regions: [],
  eventTypes: [],
  selectedEvents: [],
  asufukaketsu: [],
  takaichi17: [],
  industries: [],
  startupOnly: true, // デフォルトでスタートアップのみ表示
  excludeDHVPortfolio: false, // ★ DHV投資先は非表示フラグ
  portfolioFilter: 'all', // 'all' | 'portfolio_only' | 'uninvested_only'
  maxYearsSinceEst: null,
  fundingStages: [],
  dhvStatus: [],
};

export default function HomePage() {
  const [events, setEvents] = useState<ExhibitionEvent[]>(INITIAL_EVENTS);
  const [exhibitors, setExhibitors] = useState<StartupExhibitor[]>(INITIAL_EXHIBITORS);
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedExhibitor, setSelectedExhibitor] = useState<StartupExhibitor | null>(null);
  const [isCrawlerModalOpen, setIsCrawlerModalOpen] = useState<boolean>(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('本日 04:30');
  const [sortBy, setSortBy] = useState<'score' | 'established' | 'name'>('score');

  // Load persisted statuses & memos from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('dhv_startup_sourcer_status');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setExhibitors((prev) =>
          prev.map((item) => {
            if (parsed[item.id]) {
              return {
                ...item,
                dhvStatus: parsed[item.id].status || item.dhvStatus,
                memo: parsed[item.id].memo ?? item.memo,
              };
            }
            return item;
          })
        );
      }
    } catch (e) {
      console.error('Failed to load local storage status', e);
    }
  }, []);

  // Persist status change
  const handleChangeStatus = (id: string, status: DHVStatus) => {
    setExhibitors((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, dhvStatus: status } : item
      );
      saveToLocalStorage(updated);
      return updated;
    });

    if (selectedExhibitor && selectedExhibitor.id === id) {
      setSelectedExhibitor((prev) => (prev ? { ...prev, dhvStatus: status } : null));
    }
  };

  // Persist memo & status change
  const handleSaveMemo = (id: string, memo: string, status: DHVStatus) => {
    setExhibitors((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, memo, dhvStatus: status } : item
      );
      saveToLocalStorage(updated);
      return updated;
    });

    if (selectedExhibitor && selectedExhibitor.id === id) {
      setSelectedExhibitor((prev) =>
        prev ? { ...prev, memo, dhvStatus: status } : null
      );
    }
  };

  const saveToLocalStorage = (items: StartupExhibitor[]) => {
    try {
      const map: Record<string, { status: DHVStatus; memo?: string }> = {};
      items.forEach((item) => {
        map[item.id] = { status: item.dhvStatus, memo: item.memo };
      });
      localStorage.setItem('dhv_startup_sourcer_status', JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  };

  // Filter Logic
  const filteredExhibitors = useMemo(() => {
    return exhibitors.filter((item) => {
      // Event filter
      if (selectedEventId) {
        const ev = events.find((e) => e.id === selectedEventId);
        if (ev && item.eventName !== ev.title) return false;
      }

      // Startup Only
      if (filters.startupOnly && !item.isStartup) return false;

      // ★ DHV投資先は非表示トグルがONの場合
      if (filters.excludeDHVPortfolio && item.isDHVPortfolio) {
        return false;
      }

      // DHV Portfolio Filter
      if (filters.portfolioFilter === 'portfolio_only' && !item.isDHVPortfolio) {
        return false;
      }
      if (filters.portfolioFilter === 'uninvested_only' && item.isDHVPortfolio) {
        return false;
      }

      // Free text search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchName = item.companyName.toLowerCase().includes(q);
        const matchNameEn = item.companyNameEn?.toLowerCase().includes(q) || false;
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchAi = item.aiSummary.toLowerCase().includes(q);
        const matchBooth = item.boothNumber.toLowerCase().includes(q);
        if (!matchName && !matchNameEn && !matchDesc && !matchAi && !matchBooth) {
          return false;
        }
      }

      // Venue
      if (filters.venues.length > 0 && !filters.venues.includes(item.eventVenue)) {
        return false;
      }

      // Region
      if (filters.regions.length > 0) {
        const itemRegion = item.region || events.find((e) => e.title === item.eventName)?.region;
        if (!itemRegion || !filters.regions.includes(itemRegion)) {
          return false;
        }
      }

      // Event Type
      if (filters.eventTypes.length > 0) {
        const itemEventType = item.eventType || events.find((e) => e.title === item.eventName)?.eventType;
        if (!itemEventType || !filters.eventTypes.includes(itemEventType)) {
          return false;
        }
      }

      // Asufukaketsu
      if (filters.asufukaketsu.length > 0) {
        const hasAnyAsufukaketsu = filters.asufukaketsu.some((k) =>
          item.asufukaketsu.includes(k)
        );
        if (!hasAnyAsufukaketsu) return false;
      }

      // Takaichi 17
      if (filters.takaichi17.length > 0) {
        const hasAnyTakaichi = filters.takaichi17.some((f) =>
          item.takaichi17.includes(f)
        );
        if (!hasAnyTakaichi) return false;
      }

      // Industries
      if (filters.industries.length > 0) {
        const hasAnyIndustry = filters.industries.some((ind) =>
          item.industries.includes(ind)
        );
        if (!hasAnyIndustry) return false;
      }

      // Max years since est
      if (filters.maxYearsSinceEst !== null) {
        if (!item.yearsSinceEst || item.yearsSinceEst > filters.maxYearsSinceEst) {
          return false;
        }
      }

      // DHV Status
      if (filters.dhvStatus.length > 0 && !filters.dhvStatus.includes(item.dhvStatus)) {
        return false;
      }

      return true;
    });
  }, [exhibitors, filters, selectedEventId, events]);

  // Sorted exhibitors
  const sortedExhibitors = useMemo(() => {
    return [...filteredExhibitors].sort((a, b) => {
      // 投資先優先ソート（非表示フラグがOFFのとき）
      if (!filters.excludeDHVPortfolio) {
        if (a.isDHVPortfolio && !b.isDHVPortfolio) return -1;
        if (!a.isDHVPortfolio && b.isDHVPortfolio) return 1;
      }

      if (sortBy === 'score') {
        return b.startupScore - a.startupScore;
      }
      if (sortBy === 'established') {
        return (b.establishedYear || 0) - (a.establishedYear || 0);
      }
      if (sortBy === 'name') {
        return a.companyName.localeCompare(b.companyName, 'ja');
      }
      return 0;
    });
  }, [filteredExhibitors, sortBy, filters.excludeDHVPortfolio]);

  // CSV Export Handler
  const handleExportCsv = () => {
    const headers = [
      '企業名',
      '英語表記',
      'DHV投資先',
      '担当ファンド',
      '投資完了日',
      '大和ハウス協業検討概要',
      '出展イベント名',
      '開催地域',
      'イベント種別',
      '会場',
      'ブース番号/登壇枠',
      'ピッチ・登壇実績',
      '開催期間',
      'スタートアップ判定',
      'スコア',
      '設立年',
      '経過年数',
      '調達フェーズ',
      '推定評価額',
      '調達累計',
      'アスフカケツノ該当',
      '高市17戦略分野',
      '産業カテゴリ',
      'DHV注目・共創ポイント(AI要約)',
      '出展品目・技術概要',
      '企業HP',
      'DHV検討ステータス',
      '社内メモ',
    ];

    const rows = sortedExhibitors.map((e) => [
      `"${e.companyName.replace(/"/g, '""')}"`,
      `"${(e.companyNameEn || '').replace(/"/g, '""')}"`,
      e.isDHVPortfolio ? 'DHV投資済 (Portfolio)' : '未投資',
      `"${e.dhvFundName || ''}"`,
      `"${e.dhvInvestmentDate || ''}"`,
      `"${(e.dhvCollaborationNote || '').replace(/"/g, '""')}"`,
      `"${e.eventName.replace(/"/g, '""')}"`,
      `"${e.region || ''}"`,
      `"${e.eventType || ''}"`,
      `"${e.eventVenue.replace(/"/g, '""')}"`,
      `"${e.boothNumber.replace(/"/g, '""')}"`,
      `"${(e.pitchInfo || '').replace(/"/g, '""')}"`,
      `"${e.eventStartDate}〜${e.eventEndDate}"`,
      e.isStartup ? 'スタートアップ' : '大企業・その他',
      e.startupScore,
      e.establishedYear || '',
      e.yearsSinceEst || '',
      `"${e.fundingStage}"`,
      `"${e.estimatedValuation || ''}"`,
      `"${e.totalFunding || ''}"`,
      `"${e.asufukaketsu.join(',')}"`,
      `"${e.takaichi17.join(',')}"`,
      `"${e.industries.join(',')}"`,
      `"${e.aiSummary.replace(/"/g, '""')}"`,
      `"${e.description.replace(/"/g, '""')}"`,
      `"${e.officialUrl || ''}"`,
      `"${e.dhvStatus}"`,
      `"${(e.memo || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DHV_Startup_Sourcing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-16">
      {/* Navigation Header */}
      <Header
        onExportCsv={handleExportCsv}
        onOpenCrawlerModal={() => setIsCrawlerModalOpen(true)}
        onOpenPortfolioModal={() => setIsPortfolioModalOpen(true)}
        filteredCount={sortedExhibitors.length}
        totalCount={exhibitors.length}
        lastUpdated={lastUpdated}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Metric Cards */}
        <StatsSummary events={events} exhibitors={exhibitors} />

        {/* Big Sight & Makuhari Messe Event Timeline */}
        <EventTimeline
          events={events}
          selectedEventId={selectedEventId}
          onSelectEvent={setSelectedEventId}
        />

        {/* Multi-axis Search & Filter Panel */}
        <FilterPanel
          filters={filters}
          onChangeFilters={setFilters}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          totalFiltered={sortedExhibitors.length}
        />

        {/* Results Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div className="flex items-center flex-wrap gap-2">
            <h2 className="text-sm font-bold text-slate-800">
              抽出スタートアップ一覧
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-white font-bold">
              {sortedExhibitors.length}件
            </span>

            {/* DHV投資先非表示中バッジ */}
            {filters.excludeDHVPortfolio && (
              <button
                type="button"
                onClick={() => setFilters({ ...filters, excludeDHVPortfolio: false })}
                className="text-xs text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-2 py-0.5 rounded-md font-bold flex items-center transition-colors shadow-2xs"
                title="クリックで解除して全件表示"
              >
                <EyeOff className="w-3 h-3 mr-1" />
                <span>DHV投資先は非表示中 (解除✕)</span>
              </button>
            )}

            {selectedEventId && (
              <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md font-medium">
                展示会絞り込み中
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 mr-1" /> 並び順:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium outline-none cursor-pointer"
            >
              <option value="score">スタートアップ注目度順</option>
              <option value="established">設立年の新しい順</option>
              <option value="name">社名五十音順</option>
            </select>
          </div>
        </div>

        {/* Exhibitor Cards Grid */}
        {sortedExhibitors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedExhibitors.map((ex) => (
              <StartupCard
                key={ex.id}
                exhibitor={ex}
                onOpenDetail={setSelectedExhibitor}
                onChangeStatus={handleChangeStatus}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              該当するスタートアップが見つかりませんでした
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              検索キーワードを変更するか、フィルター条件を緩和してください。
            </p>
            <button
              onClick={() => {
                setFilters(INITIAL_FILTERS);
                setSelectedEventId(null);
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              すべてのフィルターをクリア
            </button>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <StartupDetailModal
        exhibitor={selectedExhibitor}
        onClose={() => setSelectedExhibitor(null)}
        onSaveMemo={handleSaveMemo}
      />

      {/* Crawler Status Modal */}
      <CrawlerStatusModal
        isOpen={isCrawlerModalOpen}
        onClose={() => setIsCrawlerModalOpen(false)}
        lastUpdated={lastUpdated}
      />

      {/* Official Portfolio (32 Companies) Modal */}
      <PortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
      />
    </div>
  );
}
