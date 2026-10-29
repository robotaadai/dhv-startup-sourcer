'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ExhibitionEvent,
  StartupExhibitor,
  FilterOptions,
  StartupReverseFilters,
  DHVStatus,
} from '@/types';
import { INITIAL_EVENTS, INITIAL_EXHIBITORS, ALL_STARTUPS } from '@/data/mockData';
import { mergeAndDeduplicateStartups } from '@/utils/startupMerger';
import { Header } from '@/components/Header';
import { StatsSummary } from '@/components/StatsSummary';
import { EventTimeline } from '@/components/EventTimeline';
import { FilterPanel } from '@/components/FilterPanel';
import { StartupCard } from '@/components/StartupCard';
import { StartupDetailModal } from '@/components/StartupDetailModal';
import { CrawlerStatusModal } from '@/components/CrawlerStatusModal';
import { PortfolioModal } from '@/components/PortfolioModal';
import { StartupFilterPanel } from '@/components/StartupFilterPanel';
import { StartupReverseCard } from '@/components/StartupReverseCard';
import { AddEventModal } from '@/components/AddEventModal';
import {
  loadCustomEventsFromStorage,
  saveCustomEventsToStorage,
  loadCustomStartupsFromStorage,
  saveCustomStartupsToStorage,
} from '@/utils/customEventHelper';
import {
  Filter,
  Grid,
  ListFilter,
  AlertCircle,
  ArrowUpDown,
  Crown,
  EyeOff,
  Calendar,
  Building2,
  Sparkles,
  Trophy,
} from 'lucide-react';

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
  excludeDHVPortfolio: true, // ★ デフォルトでDHV投資先は検索結果から除外
  portfolioFilter: 'uninvested_only', // デフォルトで未投資先のみ
  maxYearsSinceEst: null,
  fundingStages: [],
  dhvStatus: [],
  enabledSections: {
    regions: true,
    eventTypes: true,
    asufukaketsu: true,
    takaichi17: true,
    industries: true,
    maxYearsSinceEst: true,
    venues: true,
    dhvStatus: true,
  },
};

const INITIAL_REVERSE_FILTERS: StartupReverseFilters = {
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
  eventParticipation: 'ALL', // ★ デフォルトは出展予定なしも含む「全企業」
  excludeDHVPortfolio: true, // ★ デフォルトでDHV投資先は検索結果から除外
  enabledSections: {
    expectation: true,
    quantitative: true,
    asufukaketsu: true,
    meetingEvent: true,
  },
};

// デフォルト基準日（ビルド時の静的プレレンダリングでも安定）
const DEFAULT_BASE_DATE = '2026-10-23';

export default function HomePage() {
  // 探索モード切替: 'events' (展示会から探す) | 'startups' (スタートアップ逆引き: 八角形評価×会える展示会)
  const [searchMode, setSearchMode] = useState<'startups' | 'events'>('startups');
  const [todayStr, setTodayStr] = useState<string>(DEFAULT_BASE_DATE);
  const [events, setEvents] = useState<ExhibitionEvent[]>(INITIAL_EVENTS);
  const [exhibitors, setExhibitors] = useState<StartupExhibitor[]>(INITIAL_EXHIBITORS);
  const [allStartups, setAllStartups] = useState<StartupExhibitor[]>(ALL_STARTUPS); // ★ イベントに出ない企業も含む全スタートアップ
  const [filters, setFilters] = useState<FilterOptions>(INITIAL_FILTERS);
  const [reverseFilters, setReverseFilters] = useState<StartupReverseFilters>(INITIAL_REVERSE_FILTERS);
  const [reverseSortBy, setReverseSortBy] = useState<'totalScore' | 'daysUntil' | 'established' | 'name'>('totalScore');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedExhibitor, setSelectedExhibitor] = useState<StartupExhibitor | null>(null);
  const [isCrawlerModalOpen, setIsCrawlerModalOpen] = useState<boolean>(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState<boolean>(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('本日 04:30');
  const [sortBy, setSortBy] = useState<'score' | 'established' | 'name'>('score');

  // Load custom user added events and startups from localStorage
  useEffect(() => {
    try {
      const customEvents = loadCustomEventsFromStorage();
      if (customEvents.length > 0) {
        setEvents((prev) => {
          const existingIds = new Set(prev.map((e) => e.id));
          const newEvents = customEvents.filter((ce) => !existingIds.has(ce.id));
          return [...newEvents, ...prev];
        });
      }

      const customStartups = loadCustomStartupsFromStorage();
      if (customStartups.length > 0) {
        setExhibitors((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newStartups = customStartups.filter((cs) => !existingIds.has(cs.id));
          return [...newStartups, ...prev];
        });
        setAllStartups((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const newStartups = customStartups.filter((cs) => !existingIds.has(cs.id));
          return [...newStartups, ...prev];
        });
      }
    } catch (e) {
      console.error('Failed to load custom events/startups from storage', e);
    }
  }, []);

  const handleAddCustomEvent = (event: ExhibitionEvent, newStartups: StartupExhibitor[]) => {
    setEvents((prev) => [event, ...prev]);
    const storedEvents = loadCustomEventsFromStorage();
    saveCustomEventsToStorage([event, ...storedEvents]);

    if (newStartups.length > 0) {
      setExhibitors((prev) => [...newStartups, ...prev]);
      setAllStartups((prev) => [...newStartups, ...prev]);
      const storedStartups = loadCustomStartupsFromStorage();
      saveCustomStartupsToStorage([...newStartups, ...storedStartups]);
    }
  };

  const handleDeleteCustomEvent = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    const storedEvents = loadCustomEventsFromStorage();
    saveCustomEventsToStorage(storedEvents.filter((e) => e.id !== eventId));

    if (selectedEventId === eventId) {
      setSelectedEventId(null);
    }
  };

  // クライアントマウント後に最新日付へ安全に同期
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const current = `${yyyy}-${mm}-${dd}`;
    if (current > DEFAULT_BASE_DATE) {
      setTodayStr(current);
    }
  }, []);

  // ★ これから開催される展示会・サミットのみに限定（終了したイベントは完全除外）
  const upcomingEvents = useMemo(() => {
    return events.filter((e) => !e.endDate || e.endDate >= todayStr);
  }, [events, todayStr]);

  // ★ これから開催される展示会に出展する企業のみに限定（終了した展示会の出展社は完全除外）
  const upcomingExhibitors = useMemo(() => {
    return exhibitors.filter((e) => !e.eventEndDate || e.eventEndDate >= todayStr);
  }, [exhibitors, todayStr]);

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
        setAllStartups((prev) =>
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

    setAllStartups((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dhvStatus: status } : item))
    );

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

    setAllStartups((prev) =>
      prev.map((item) => (item.id === id ? { ...item, memo, dhvStatus: status } : item))
    );

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
    return upcomingExhibitors.filter((item) => {
      // 終了したイベントの出展企業は確実に除外（安全チェック）
      if (item.eventEndDate && item.eventEndDate < todayStr) {
        return false;
      }

      // Event filter
      if (selectedEventId) {
        const ev = upcomingEvents.find((e) => e.id === selectedEventId);
        if (!ev || item.eventName !== ev.title) return false;
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
      if (
        (filters.enabledSections?.venues ?? true) &&
        filters.venues.length > 0 &&
        !filters.venues.includes(item.eventVenue)
      ) {
        return false;
      }

      // Region
      if ((filters.enabledSections?.regions ?? true) && filters.regions.length > 0) {
        const itemRegion = item.region || events.find((e) => e.title === item.eventName)?.region;
        if (!itemRegion || !filters.regions.includes(itemRegion)) {
          return false;
        }
      }

      // Event Type
      if ((filters.enabledSections?.eventTypes ?? true) && filters.eventTypes.length > 0) {
        const itemEventType = item.eventType || events.find((e) => e.title === item.eventName)?.eventType;
        if (!itemEventType || !filters.eventTypes.includes(itemEventType)) {
          return false;
        }
      }

      // Asufukaketsu
      if ((filters.enabledSections?.asufukaketsu ?? true) && filters.asufukaketsu.length > 0) {
        const hasAnyAsufukaketsu = filters.asufukaketsu.some((k) =>
          item.asufukaketsu.includes(k)
        );
        if (!hasAnyAsufukaketsu) return false;
      }

      // Takaichi 17
      if ((filters.enabledSections?.takaichi17 ?? true) && filters.takaichi17.length > 0) {
        const hasAnyTakaichi = filters.takaichi17.some((f) =>
          item.takaichi17.includes(f)
        );
        if (!hasAnyTakaichi) return false;
      }

      // Industries
      if ((filters.enabledSections?.industries ?? true) && filters.industries.length > 0) {
        const hasAnyIndustry = filters.industries.some((ind) =>
          item.industries.includes(ind)
        );
        if (!hasAnyIndustry) return false;
      }

      // Max years since est
      if ((filters.enabledSections?.maxYearsSinceEst ?? true) && filters.maxYearsSinceEst !== null) {
        if (!item.yearsSinceEst || item.yearsSinceEst > filters.maxYearsSinceEst) {
          return false;
        }
      }

      // DHV Status
      if (
        (filters.enabledSections?.dhvStatus ?? true) &&
        filters.dhvStatus.length > 0 &&
        !filters.dhvStatus.includes(item.dhvStatus)
      ) {
        return false;
      }

      return true;
    });
  }, [upcomingExhibitors, filters, selectedEventId, upcomingEvents, todayStr]);

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

  // ★ 逆引きモード用母集団: 未終了イベントまたは出展なしの全スタートアップ（複数イベント出展は1社に集約・統合）
  const upcomingAllStartups = useMemo(() => {
    const raw = allStartups.filter((e) => e.hasUpcomingEvent === false || !e.eventEndDate || e.eventEndDate >= todayStr);
    return mergeAndDeduplicateStartups(raw, todayStr);
  }, [allStartups, todayStr]);

  // ★ 逆引きモード用: スタートアップの多角絞り込み
  const filteredReverseStartups = useMemo(() => {
    return upcomingAllStartups.filter((item) => {
      // 0. DHV投資先の除外 (デフォルトON)
      if (reverseFilters.excludeDHVPortfolio && item.isDHVPortfolio) {
        return false;
      }

      // 1. Search Query
      if (reverseFilters.searchQuery.trim()) {
        const q = reverseFilters.searchQuery.toLowerCase();
        const matchName = item.companyName.toLowerCase().includes(q);
        const matchEn = (item.companyNameEn || '').toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchAi = item.aiSummary.toLowerCase().includes(q);
        const matchNews = (item.latestNews?.title || '').toLowerCase().includes(q);
        if (!matchName && !matchEn && !matchDesc && !matchAi && !matchNews) {
          return false;
        }
      }

      // 2. Expectation Section (八角形 期待ポイント)
      if (reverseFilters.enabledSections.expectation) {
        if (
          reverseFilters.expectationRanks.length > 0 &&
          item.expectation &&
          !reverseFilters.expectationRanks.includes(item.expectation.rank)
        ) {
          return false;
        }

        if (reverseFilters.expectationTraits.length > 0 && item.expectation) {
          const hasAllTraits = reverseFilters.expectationTraits.every((trait) => {
            const score = item.expectation!.scores[trait] || 1;
            return score >= 4;
          });
          if (!hasAllTraits) return false;
        }
      }

      // 3. Quantitative Section
      if (reverseFilters.enabledSections.quantitative) {
        if (
          reverseFilters.fundingStages.length > 0 &&
          !reverseFilters.fundingStages.includes(item.fundingStage)
        ) {
          return false;
        }

        if (
          reverseFilters.maxYearsSinceEst !== null &&
          (!item.yearsSinceEst || item.yearsSinceEst > reverseFilters.maxYearsSinceEst)
        ) {
          return false;
        }

        if (reverseFilters.totalFundingRange !== 'ALL') {
          const tf = item.totalFunding || '';
          if (reverseFilters.totalFundingRange === 'UNDER_100M') {
            if (tf.includes('億円') && !tf.includes('0.')) return false;
          } else if (reverseFilters.totalFundingRange === 'OVER_1500M') {
            if (!tf.includes('15億円') && !tf.includes('20億円') && !tf.includes('200億円') && !tf.includes('100億円')) return false;
          }
        }
      }

      // 4. Asufukaketsu Section
      if (reverseFilters.enabledSections.asufukaketsu) {
        if (reverseFilters.asufukaketsu.length > 0) {
          const hasAnyAsu = reverseFilters.asufukaketsu.some((k) =>
            item.asufukaketsu.includes(k)
          );
          if (!hasAnyAsu) return false;
        }

        if (reverseFilters.takaichi17.length > 0) {
          const hasAnyTaka = reverseFilters.takaichi17.some((f) =>
            item.takaichi17.includes(f)
          );
          if (!hasAnyTaka) return false;
        }
      }

      // 5. Meeting Event Section (いつ・どこで会えるか)
      if (reverseFilters.enabledSections.meetingEvent) {
        // 出展状況フィルター (ALL / WITH_EVENTS / WITHOUT_EVENTS)
        if (reverseFilters.eventParticipation === 'WITH_EVENTS' && !item.hasUpcomingEvent) {
          return false;
        }
        if (reverseFilters.eventParticipation === 'WITHOUT_EVENTS' && item.hasUpcomingEvent) {
          return false;
        }

        // 直近出展がある企業に対する時期・地域・出展形式の判定
        if (item.hasUpcomingEvent) {
          const nextEvt = item.upcomingMeetingEvents?.[0];
          const days = nextEvt ? nextEvt.daysUntil : 999;

          if (reverseFilters.meetingTimeframe === 'WITHIN_1_MONTH' && days > 30) return false;
          if (reverseFilters.meetingTimeframe === 'WITHIN_3_MONTHS' && days > 90) return false;
          if (reverseFilters.meetingTimeframe === 'WITHIN_2026' && (nextEvt?.startDate || '') > '2026-12-31') return false;

          if (
            reverseFilters.meetingRegions.length > 0 &&
            item.region &&
            !reverseFilters.meetingRegions.includes(item.region)
          ) {
            return false;
          }

          if (reverseFilters.meetingType === 'PITCH_ONLY') {
            if (!item.pitchInfo && item.eventType !== '小規模ピッチ・デモデイ') return false;
          } else if (reverseFilters.meetingType === 'BOOTH_ONLY') {
            if (item.eventType === '小規模ピッチ・デモデイ' && !item.boothNumber.includes('ブース')) return false;
          }
        } else {
          // 出展予定がない企業の場合:
          // 会期指定やブース/ピッチ指定がある場合は除外
          if (reverseFilters.meetingTimeframe !== 'ALL') return false;
          if (reverseFilters.meetingType !== 'ALL') return false;

          // 地域指定がある場合は所在地で判定
          if (
            reverseFilters.meetingRegions.length > 0 &&
            item.region &&
            !reverseFilters.meetingRegions.includes(item.region)
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [upcomingAllStartups, reverseFilters]);

  // ★ 逆引きモード用: ソート処理
  const sortedReverseStartups = useMemo(() => {
    return [...filteredReverseStartups].sort((a, b) => {
      if (reverseSortBy === 'totalScore') {
        const scoreA = a.expectation?.totalScore || 0;
        const scoreB = b.expectation?.totalScore || 0;
        return scoreB - scoreA;
      }
      if (reverseSortBy === 'daysUntil') {
        const daysA = a.upcomingMeetingEvents?.[0]?.daysUntil ?? 999;
        const daysB = b.upcomingMeetingEvents?.[0]?.daysUntil ?? 999;
        return daysA - daysB;
      }
      if (reverseSortBy === 'established') {
        return (b.establishedYear || 0) - (a.establishedYear || 0);
      }
      if (reverseSortBy === 'name') {
        return a.companyName.localeCompare(b.companyName, 'ja');
      }
      return 0;
    });
  }, [filteredReverseStartups, reverseSortBy]);

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
        onOpenAddEventModal={() => setIsAddEventModalOpen(true)}
        filteredCount={searchMode === 'startups' ? sortedReverseStartups.length : sortedExhibitors.length}
        totalCount={searchMode === 'startups' ? upcomingAllStartups.length : upcomingExhibitors.length}
        lastUpdated={lastUpdated}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Metric Cards */}
        <StatsSummary events={upcomingEvents} exhibitors={upcomingExhibitors} />

        {/* ★ 探索モード切替タブ (大和ハウスソーシング デュアルモード) */}
        <div className="mb-6 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchMode('startups')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              searchMode === 'startups'
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>🏢 スタートアップから探す（逆引き：八角形評価 × 会える展示会）</span>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                searchMode === 'startups'
                  ? 'bg-white/20 text-white'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              新機能
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSearchMode('events')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              searchMode === 'events'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4 text-slate-300" />
            <span>🎪 展示会・イベントから探す（タイムライン＆出展社）</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* モード1: スタートアップから探す（逆引き：八角形レーダー評価 × 会える展示会） */}
        {/* ========================================================================= */}
        {searchMode === 'startups' && (
          <div>
            {/* スタートアップ逆引き リッチフィルターパネル */}
            <StartupFilterPanel
              filters={reverseFilters}
              onApplyFilters={setReverseFilters}
              totalStartupsCount={upcomingAllStartups.length}
              matchedCount={sortedReverseStartups.length}
            />

            {/* 結果バー */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2.5 sm:mb-3 gap-2">
              <div className="flex items-center flex-wrap gap-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <span>逆引き検索結果 (スタートアップ一覧)</span>
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold shadow-2xs">
                  {sortedReverseStartups.length}社
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  八角形の8大期待ポイント評価と、次回会える展示会・ブース番号・マップ直行リンク
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-medium flex items-center">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-1" /> 並び順:
                </span>
                <select
                  value={reverseSortBy}
                  onChange={(e) => setReverseSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium outline-none cursor-pointer"
                >
                  <option value="totalScore">八角形 総合期待スコア順</option>
                  <option value="daysUntil">直近で会える順（残り日数）</option>
                  <option value="established">設立年の新しい順</option>
                  <option value="name">社名五十音順</option>
                </select>
              </div>
            </div>

            {/* スタートアップ逆引きカード一覧 */}
            {sortedReverseStartups.length > 0 ? (
              <div className="space-y-2.5 sm:space-y-3">
                {sortedReverseStartups.map((st) => (
                  <StartupReverseCard
                    key={st.id}
                    startup={st}
                    onSelect={setSelectedExhibitor}
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
                  期待ポイントやステージ、会える時期のフィルター条件を緩和してください。
                </p>
                <button
                  onClick={() => setReverseFilters(INITIAL_REVERSE_FILTERS)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-all"
                >
                  条件をリセット
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* モード2: 展示会・イベントから探す（従来のタイムライン＆ブース出展社ビュー） */}
        {/* ========================================================================= */}
        {searchMode === 'events' && (
          <div>
            {/* Upcoming Event Timeline */}
            <EventTimeline
              events={upcomingEvents}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              onOpenAddEventModal={() => setIsAddEventModalOpen(true)}
              onDeleteCustomEvent={handleDeleteCustomEvent}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
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

      {/* Add Custom Event & Startups Modal */}
      <AddEventModal
        isOpen={isAddEventModalOpen}
        onClose={() => setIsAddEventModalOpen(false)}
        onAddEvent={handleAddCustomEvent}
      />
    </div>
  );
}
