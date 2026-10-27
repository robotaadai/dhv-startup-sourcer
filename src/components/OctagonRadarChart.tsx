'use client';

import React from 'react';
import { ExpectationRadarScores, ExpectationRank } from '@/types';

interface OctagonRadarChartProps {
  scores: ExpectationRadarScores;
  rank?: ExpectationRank;
  totalScore?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  interactive?: boolean;
}

interface AxisConfig {
  key: keyof ExpectationRadarScores;
  label: string;
  icon: string;
  shortLabel: string;
  description: string;
}

export const RADAR_AXES: AxisConfig[] = [
  { key: 'awards', label: 'ピッチ受賞歴', icon: '🏆', shortLabel: '受賞', description: 'ICC/IVS/展示会ピッチ等の受賞・入賞歴' },
  { key: 'accelerator', label: 'アクセラ採択', icon: '🚀', shortLabel: '採択', description: 'Plug and Play/TIB/自治体実証等の公式採択' },
  { key: 'snsMomentum', label: 'SNS発信力', icon: '📣', shortLabel: 'SNS', description: 'X/note等の業界トレンド入り・熱量の高い発信' },
  { key: 'fundraising', label: '調達モメンタム', icon: '💰', shortLabel: '調達', description: '直近1年の大型調達・トップVC/CVCの出資参画' },
  { key: 'growthVelocity', label: '成長スピード', icon: '⚡', shortLabel: '速度', description: '創業2〜3年以内でのシリーズA/早期大手導入' },
  { key: 'enterpriseTraction', label: '大手現場導入', icon: '🏗️', shortLabel: '現場', description: 'ゼネコン/物流大手等とのPoC完了・有償商用導入' },
  { key: 'deepTechIP', label: '特許・大学発', icon: '🔬', shortLabel: '特許', description: '大学発認定・独自コア特許・高い技術防壁' },
  { key: 'teamStrength', label: '連続起業家', icon: '👑', shortLabel: '創業者', description: 'シリアルアントレプレナー・著名CXO陣営' },
];

export const OctagonRadarChart: React.FC<OctagonRadarChartProps> = ({
  scores,
  rank = 'A',
  totalScore,
  size = 'md',
  showLabels = true,
}) => {
  // サイズごとの設定
  const dimensions = {
    sm: { width: 190, height: 190, radius: 55, labelOffset: 22, fontSize: 9, scoreFontSize: 8 },
    md: { width: 260, height: 260, radius: 78, labelOffset: 26, fontSize: 10.5, scoreFontSize: 9.5 },
    lg: { width: 340, height: 340, radius: 105, labelOffset: 34, fontSize: 12, scoreFontSize: 11 },
  }[size];

  const cx = dimensions.width / 2;
  const cy = dimensions.height / 2;
  const R = dimensions.radius;
  const levels = 5; // 1〜5点

  // 各軸の角度 (-PI/2 から時計回りに45度刻み)
  const getCoordinates = (index: number, value: number, maxVal = 5) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 8;
    const r = (value / maxVal) * R;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      angle,
    };
  };

  // 背景の八角形グリッド線 (レベル1〜5)
  const gridPolygons = Array.from({ length: levels }, (_, lvlIdx) => {
    const levelVal = lvlIdx + 1;
    const points = RADAR_AXES.map((_, i) => {
      const coord = getCoordinates(i, levelVal, 5);
      return `${coord.x.toFixed(1)},${coord.y.toFixed(1)}`;
    }).join(' ');
    return { levelVal, points };
  });

  // データポリゴンの頂点
  const dataPoints = RADAR_AXES.map((axis, i) => {
    const val = scores[axis.key] || 1;
    return getCoordinates(i, val, 5);
  });

  const polygonPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  // ランクに応じたテーマカラー
  const rankColors = {
    S: {
      gradientFrom: '#f59e0b', // amber-500
      gradientTo: '#dc2626',   // red-600
      stroke: '#b91c1c',       // red-700
      fill: 'rgba(239, 68, 68, 0.35)',
      pointFill: '#b91c1c',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-red-600 text-white',
    },
    A: {
      gradientFrom: '#3b82f6', // blue-500
      gradientTo: '#dc2626',   // red-600
      stroke: '#dc2626',       // red-600
      fill: 'rgba(220, 38, 38, 0.3)',
      pointFill: '#dc2626',
      badgeBg: 'bg-blue-600 text-white',
    },
    B: {
      gradientFrom: '#10b981', // emerald-500
      gradientTo: '#3b82f6',   // blue-500
      stroke: '#2563eb',       // blue-600
      fill: 'rgba(37, 99, 235, 0.25)',
      pointFill: '#2563eb',
      badgeBg: 'bg-emerald-600 text-white',
    },
  }[rank];

  // 合計点の算出 (propsになければ計算)
  const calcTotal =
    totalScore ??
    RADAR_AXES.reduce((acc, axis) => acc + (scores[axis.key] || 1), 0);

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`radar-grad-${size}-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={rankColors.gradientFrom} stopOpacity="0.45" />
              <stop offset="100%" stopColor={rankColors.gradientTo} stopOpacity="0.65" />
            </linearGradient>
            <filter id={`radar-glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#dc2626" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* 1. 背景の同心八角形グリッド */}
          {gridPolygons.map(({ levelVal, points }) => (
            <polygon
              key={`grid-${levelVal}`}
              points={points}
              fill={levelVal % 2 === 0 ? 'rgba(241, 245, 249, 0.6)' : 'transparent'}
              stroke="#e2e8f0"
              strokeWidth={levelVal === 5 ? '1.5' : '1'}
              strokeDasharray={levelVal === 5 ? undefined : '2,2'}
            />
          ))}

          {/* 2. 8方向の軸線 */}
          {RADAR_AXES.map((_, i) => {
            const outerCoord = getCoordinates(i, 5, 5);
            return (
              <line
                key={`axis-${i}`}
                x1={cx}
                y1={cy}
                x2={outerCoord.x}
                y2={outerCoord.y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}

          {/* 3. データポリゴン（八角形領域） */}
          <polygon
            points={polygonPath}
            fill={`url(#radar-grad-${size}-${rank})`}
            stroke={rankColors.stroke}
            strokeWidth={size === 'sm' ? '1.8' : '2.2'}
            strokeLinejoin="round"
            filter={`url(#radar-glow-${size})`}
            className="transition-all duration-300"
          />

          {/* 4. データ頂点の丸ポチ */}
          {dataPoints.map((p, i) => (
            <circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r={size === 'sm' ? 2.5 : 3.5}
              fill="#ffffff"
              stroke={rankColors.pointFill}
              strokeWidth={size === 'sm' ? 1.5 : 2}
              className="drop-shadow-xs"
            />
          ))}

          {/* 5. 8頂点のラベル表示 */}
          {showLabels &&
            RADAR_AXES.map((axis, i) => {
              const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 8;
              const labelDist = R + dimensions.labelOffset;
              const lx = cx + labelDist * Math.cos(angle);
              const ly = cy + labelDist * Math.sin(angle);
              const scoreVal = scores[axis.key] || 1;

              // テキストの配置位置 (左右・上下のアンカー調整)
              let textAnchor: 'middle' | 'start' | 'end' = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              if (Math.cos(angle) < -0.3) textAnchor = 'end';

              let dy = '0.35em';
              if (Math.sin(angle) < -0.7) dy = '-0.2em';
              if (Math.sin(angle) > 0.7) dy = '0.9em';

              return (
                <g key={`label-${axis.key}`} className="cursor-default group/label">
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={textAnchor}
                    dy={dy}
                    fontSize={dimensions.fontSize}
                    className="font-bold fill-slate-700"
                  >
                    <span>{axis.icon}</span>
                    <tspan className="hidden sm:inline"> {axis.shortLabel}</tspan>
                    <tspan
                      fontSize={dimensions.scoreFontSize}
                      className={scoreVal >= 4 ? 'font-black fill-red-600' : 'fill-slate-500'}
                    >
                      {' '}{scoreVal}
                    </tspan>
                  </text>
                </g>
              );
            })}
        </svg>

        {/* チャート中央の総合スコア（小型以外で表示） */}
        {size !== 'sm' && (
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs rounded-full w-12 h-12 shadow-2xs border border-slate-200"
          >
            <span className="text-[10px] font-bold text-slate-500">総合</span>
            <span className="text-xs font-black text-red-600 leading-none">
              {calcTotal}<span className="text-[9px] text-slate-400 font-normal">/40</span>
            </span>
          </div>
        )}
      </div>

      {/* 下部ランク・総合スコアバッジ */}
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide ${rankColors.badgeBg} shadow-2xs`}
        >
          {rank === 'S' ? '★★★ Sランク (厳選トップ)' : rank === 'A' ? '★★ Aランク (有力候補)' : '★ Bランク (観察・発展途上)'}
        </span>
        <span className="text-[11px] font-bold text-slate-700">
          期待スコア: <strong className="text-red-600 font-black">{calcTotal}</strong> / 40点
        </span>
      </div>
    </div>
  );
};
