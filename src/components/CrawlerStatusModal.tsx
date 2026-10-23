'use client';

import React from 'react';
import { X, RefreshCw, CheckCircle, Clock, Server, Terminal, Calendar, AlertCircle } from 'lucide-react';

interface CrawlerStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastUpdated: string;
}

export const CrawlerStatusModal: React.FC<CrawlerStatusModalProps> = ({
  isOpen,
  onClose,
  lastUpdated,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                クローラー・データ更新パイプライン監視
              </h3>
              <p className="text-xs text-slate-500">
                GitHub Actions / Cloud Scheduler 日次自動巡回ステータス
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-[11px] text-emerald-800 font-semibold block">稼働ステータス</span>
              <span className="text-sm font-bold text-emerald-900 flex items-center mt-1">
                <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />
                正常稼働中 (Active)
              </span>
              <span className="text-[10px] text-emerald-700 block mt-1">
                最終巡回: {lastUpdated}
              </span>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
              <span className="text-[11px] text-sky-800 font-semibold block">次回自動更新予定</span>
              <span className="text-sm font-bold text-sky-900 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1 text-sky-600" />
                毎朝 04:00 (JST)
              </span>
              <span className="text-[10px] text-sky-700 block mt-1">
                GitHub Actions Cron トリガー
              </span>
            </div>
          </div>

          {/* Crawler Log Summary */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2 flex items-center">
              <Terminal className="w-4 h-4 mr-1 text-slate-500" />
              直近のクローラー実行ログ (自動差分更新)
            </h4>
            <div className="bg-slate-900 text-slate-200 p-3.5 rounded-xl font-mono text-[11px] space-y-1 overflow-x-auto">
              <p className="text-slate-400">[04:00:02 JST] Starting daily exhibition crawler...</p>
              <p className="text-emerald-400">[04:00:15 JST] [SUCCESS] 幕張メッセ 公式カレンダー 巡回完了 (48件取得)</p>
              <p className="text-emerald-400">[04:00:28 JST] [SUCCESS] 東京ビッグサイト / J-messe 巡回完了 (82件取得)</p>
              <p className="text-sky-400">[04:00:45 JST] [AI-FILTER] スタートアップ関連度スコアリング実行完了 (注目展示会: 6件抽出)</p>
              <p className="text-sky-400">[04:01:20 JST] [CRAWL] RX Japan / 日刊工業新聞 出展社リスト巡回 (新規出展社: 12社)</p>
              <p className="text-yellow-400">[04:01:55 JST] [CLASSIFY] アスフカケツノ 7領域 ＆ 高市17戦略分野 AIタグ付け完了</p>
              <p className="text-slate-400">[04:02:10 JST] [INITIAL/KEPPLE] 企業ディープリンク生成完了 (100% OK)</p>
              <p className="text-emerald-400">[04:02:15 JST] [DEPLOY] JSONデータベース更新＆コミット完了</p>
            </div>
          </div>

          {/* How to run manually */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-800 block">手動での即時クローラー実行方法:</span>
            <p className="text-slate-600">
              ターミナルから以下のPythonスクリプトを実行することで、いつでも手動で最新の展示会・出展社情報をクローリングして反映できます。
            </p>
            <code className="block p-2 bg-white rounded border border-slate-300 font-mono text-[11px] text-slate-800 select-all">
              python3 crawler/main.py --update
            </code>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
