'use client';

import { OptimizedImage } from './optimized-image';

interface StationIconProps {
  stationIconUrl?: string;
  stationName: string;
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
}

export function StationIcon({ 
  stationIconUrl, 
  stationName, 
  size = 'md' 
}: StationIconProps) {
  // Define sizes
  const sizeClasses = {
    xxs: 'h-6 w-6',
    xs: 'h-8 w-8',
    sm: 'h-14 w-14',
    md: 'h-20 w-20',
    lg: 'h-24 w-24'
  };
  
  const paddingClasses = {
    xxs: 'p-1',
    xs: 'p-1.5',
    sm: 'p-2',
    md: 'p-2',
    lg: 'p-3'
  };

  const textSizes = {
    xxs: 'text-xs',
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm overflow-hidden ${sizeClasses[size]}`}>
      {stationIconUrl ? (
        <div className="relative h-full w-full flex items-center justify-center">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_10px_rgba(255,255,255,0.1)]"></div>
          <OptimizedImage
            src={stationIconUrl}
            alt={stationName}
            width={size === 'xxs' ? 24 : size === 'xs' ? 32 : size === 'sm' ? 56 : size === 'md' ? 80 : 96}
            height={size === 'xxs' ? 24 : size === 'xs' ? 32 : size === 'sm' ? 56 : size === 'md' ? 80 : 96}
            className={`h-full w-full object-contain ${paddingClasses[size]} filter brightness-110 contrast-125`}
          />
        </div>
      ) : (
        <div className={`${textSizes[size]} font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent`}>
          {stationName.charAt(0)}
        </div>
      )}
    </div>
  );
}