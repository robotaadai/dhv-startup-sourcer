'use client';

import React, { useState } from 'react';
import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  companyName: string;
  officialUrl?: string | null;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// 会社名から安定したグラデーション色を生成
const GRADIENT_COLORS = [
  'from-blue-600 to-indigo-600',
  'from-red-600 to-orange-600',
  'from-emerald-600 to-teal-600',
  'from-purple-600 to-pink-600',
  'from-cyan-600 to-blue-600',
  'from-amber-600 to-orange-600',
  'from-violet-600 to-purple-600',
  'from-rose-600 to-red-600',
];

function getGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[index];
}

// URLからホスト名（ドメイン）を抽出
function extractDomain(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  companyName,
  officialUrl,
  logoUrl,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const domain = extractDomain(officialUrl);
  const faviconUrl = logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null);

  const sizeStyles = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-9 h-9 text-sm rounded-xl',
    lg: 'w-12 h-12 text-base rounded-2xl',
  };

  const initialText = companyName.slice(0, 2);

  return (
    <div
      className={`shrink-0 overflow-hidden flex items-center justify-center border border-slate-200/80 bg-white shadow-2xs ${sizeStyles[size]} ${className}`}
      title={companyName}
    >
      {faviconUrl && !imgError ? (
        <img
          src={faviconUrl}
          alt={`${companyName} ロゴ`}
          className="w-full h-full object-contain p-1"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-black text-white bg-gradient-to-br ${getGradient(
            companyName
          )} select-none`}
        >
          {initialText || <Building2 className="w-4 h-4 text-white" />}
        </div>
      )}
    </div>
  );
};
