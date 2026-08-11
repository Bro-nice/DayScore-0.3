import React, { useState, useEffect } from 'react';
import { getFallbackAvatarSvg } from '../data/avatars';
import { AvatarFrame } from '../types';

export type { AvatarFrame };

interface SafeAvatarProps {
  src?: string | null;
  name?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  frame?: AvatarFrame;
  status?: 'online' | 'offline' | 'busy' | 'none';
  onClick?: (e: React.MouseEvent) => void;
}

export const SafeAvatar: React.FC<SafeAvatarProps> = ({
  src,
  name = 'User',
  alt = 'avatar',
  size = 'md',
  className = '',
  frame = 'none',
  status = 'none',
  onClick
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    return src && src.trim() ? src.trim() : getFallbackAvatarSvg(name);
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (src && src.trim()) {
      setImgSrc(src.trim());
      setHasError(false);
    } else {
      setImgSrc(getFallbackAvatarSvg(name));
      setHasError(false);
    }
  }, [src, name]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getFallbackAvatarSvg(name));
    }
  };

  // Dimension styling map
  let sizeClass = 'w-10 h-10';
  let sizeNum = 40;
  if (typeof size === 'number') {
    sizeNum = size;
    sizeClass = `w-[${size}px] h-[${size}px]`;
  } else {
    switch (size) {
      case 'xs': sizeClass = 'w-6 h-6'; sizeNum = 24; break;
      case 'sm': sizeClass = 'w-8 h-8'; sizeNum = 32; break;
      case 'md': sizeClass = 'w-10 h-10'; sizeNum = 40; break;
      case 'lg': sizeClass = 'w-14 h-14'; sizeNum = 56; break;
      case 'xl': sizeClass = 'w-20 h-20'; sizeNum = 80; break;
      case '2xl': sizeClass = 'w-28 h-28'; sizeNum = 112; break;
    }
  }

  // Frame aura class mapping
  let frameWrapperClass = '';
  let frameRingClass = '';

  switch (frame) {
    case 'gold':
      frameWrapperClass = 'relative p-1 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]';
      frameRingClass = 'ring-2 ring-amber-300/80';
      break;
    case 'neon':
      frameWrapperClass = 'relative p-1 rounded-full bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-indigo-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse';
      frameRingClass = 'ring-2 ring-cyan-300/80';
      break;
    case 'cosmic':
      frameWrapperClass = 'relative p-1 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-indigo-600 shadow-[0_0_18px_rgba(168,85,247,0.6)]';
      frameRingClass = 'ring-2 ring-purple-300/80';
      break;
    case 'emerald':
      frameWrapperClass = 'relative p-1 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
      frameRingClass = 'ring-2 ring-emerald-300/80';
      break;
    case 'diamond':
      frameWrapperClass = 'relative p-1 rounded-full bg-gradient-to-tr from-sky-300 via-indigo-200 to-slate-100 shadow-[0_0_18px_rgba(186,230,253,0.7)]';
      frameRingClass = 'ring-2 ring-sky-200/90';
      break;
    case 'flame':
      frameWrapperClass = 'relative p-1 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-amber-400 shadow-[0_0_20px_rgba(249,115,22,0.7)]';
      frameRingClass = 'ring-2 ring-orange-400/80';
      break;
    default:
      frameWrapperClass = 'relative inline-block';
      frameRingClass = '';
      break;
  }

  return (
    <div className={`${frameWrapperClass} inline-flex items-center justify-center shrink-0 select-none`}>
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        referrerPolicy="no-referrer"
        onClick={onClick}
        style={typeof size === 'number' ? { width: `${sizeNum}px`, height: `${sizeNum}px` } : undefined}
        className={`${sizeClass} rounded-full object-cover bg-slate-900/10 dark:bg-slate-800/80 ${frameRingClass} ${className} ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''}`}
      />
      {status === 'online' && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
      )}
      {status === 'busy' && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
      )}
      {status === 'offline' && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-slate-400 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
      )}
    </div>
  );
};

export default SafeAvatar;
