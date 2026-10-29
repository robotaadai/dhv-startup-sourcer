'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Building,
  MapPin,
  Globe,
  Sparkles,
  Users,
  PlusCircle,
  HelpCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { ExhibitionEvent, StartupExhibitor } from '@/types';
import {
  parseRawExhibitorsText,
  createStartupFromCustomInput,
} from '@/utils/customEventHelper';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: ExhibitionEvent, newStartups: StartupExhibitor[]) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [venue, setVenue] = useState('');
  const [hall, setHall] = useState('');
  const [city, setCity] = useState('東京');
  const [region, setRegion] = useState<'関東' | '関西' | '中部' | '九州' | '全国' | 'その他'>('関東');
  const [eventType, setEventType] = useState<string>('スタートアップ特化サミット');
  const [officialUrl, setOfficialUrl] = useState('');
  const [description, setDescription] = useState('');
  const [rawExhibitors, setRawExhibitors] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const parsedExhibitors = parseRawExhibitorsText(rawExhibitors);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('イベント名を入力してください。');
      return;
    }
    if (!startDate) {
      setErrorMsg('開始日を入力してください。');
      return;
    }
    if (!venue.trim()) {
      setErrorMsg('開催会場を入力してください。');
      return;
    }

    const eventId = `custom-evt-${Date.now()}`;
    const finalEndDate = endDate || startDate;

    const newEvent: ExhibitionEvent = {
      id: eventId,
      title: title.trim(),
      venue: venue.trim(),
      hall: hall.trim() || 'メイン会場',
      city: city.trim() || '東京',
      region: (region === '全国' || region === 'その他') ? '関東' : region,
      eventType: eventType as any,
      startDate,
      endDate: finalEndDate,
      officialUrl: officialUrl.trim() || '#',
      floorMapUrl: officialUrl.trim() || undefined,
      description: description.trim() || `${title.trim()}（ユーザー登録イベント）`,
      organizer: 'ユーザー追加イベント',
      startupRelevanceScore: 5,
      status: parsedExhibitors.length > 0 ? '出展社公表済' : 'スケジュール確定',
      exhibitorCount: parsedExhibitors.length > 0 ? parsedExhibitors.length : 30,
      startupCount: parsedExhibitors.length > 0 ? parsedExhibitors.length : 20,
      lastCrawledAt: new Date().toISOString(),
      isCustomUserAdded: true,
    };

    const newStartups: StartupExhibitor[] = parsedExhibitors.map((item, idx) =>
      createStartupFromCustomInput(item, newEvent, idx)
    );

    onAddEvent(newEvent, newStartups);

    // リセットして閉じる
    setTitle('');
    setStartDate('');
    setEndDate('');
    setVenue('');
    setHall('');
    setOfficialUrl('');
    setDescription('');
    setRawExhibitors('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 rounded-t-2xl">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                新規イベント・展示会を追加
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                  即時組み込み
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                新しく発見した展示会やサミットをサイトに即座に追加できます。
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* イベント名 */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              イベント名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="例: Japan IT Week 2027 / ディープテック・サミット"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* 会期 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                開始日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                終了日 <span className="text-slate-400 font-normal">（1日開催なら空欄でOK）</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* 会場・都市・地域 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">
                開催会場 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="例: 東京ビッグサイト / 虎ノ門ヒルズ森タワー"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">地域</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="関東">関東（東京・横浜・千葉）</option>
                <option value="関西">関西（大阪・京都・神戸）</option>
                <option value="中部">中部（名古屋・愛知）</option>
                <option value="九州">九州（福岡）</option>
                <option value="全国">全国・オンライン</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          {/* ホール・イベント種別 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                ホール・フロア <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              <input
                type="text"
                placeholder="例: 東1-3ホール / フォーラムA"
                value={hall}
                onChange={(e) => setHall(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">イベント種別</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="スタートアップ特化サミット">スタートアップ特化サミット</option>
                <option value="大型産業展示会">大型産業展示会</option>
                <option value="ピッチコンテスト・アクセラレーター">ピッチコンテスト・アクセラレーター</option>
                <option value="小規模ピッチ・デモデイ">小規模ピッチ・デモデイ</option>
                <option value="その他">その他</option>
              </select>
            </div>
          </div>

          {/* 公式URL */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              公式URL / プログラム案内リンク <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <input
              type="url"
              placeholder="https://example.com/summit/"
              value={officialUrl}
              onChange={(e) => setOfficialUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              イベント概要・注目ポイント <span className="text-slate-400 font-normal">（任意）</span>
            </label>
            <textarea
              rows={2}
              placeholder="例: 国内外のディープテック・気候変動・AIスタートアップが登壇する大型オープンイノベーションサミット。"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* 出展社一括貼り付け */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-slate-800 font-bold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>出展・登壇スタートアップの一括登録</span>
                <span className="text-slate-400 font-normal">（任意）</span>
              </label>
              {parsedExhibitors.length > 0 && (
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  {parsedExhibitors.length}社を自動登録
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              出展社名（または「社名 [タブ/カンマ] 製品・概要」）を改行区切りで貼り付けると、大和ハウス領域自動判定・八角形評価付きで逆引き検索にも即時追加されます。
            </p>
            <textarea
              rows={4}
              placeholder={`例:\n株式会社スマートロボティクス\n次世代エネルギー株式会社\tペロブスカイト太陽電池モジュールの開発\nデジタル建設株式会社,施工現場BIM管理SaaS`}
              value={rawExhibitors}
              onChange={(e) => setRawExhibitors(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>イベントを登録する {parsedExhibitors.length > 0 && `(＋SU ${parsedExhibitors.length}社)`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
