'use client';

import { StationIcon } from '@/components/station-icon';

interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
}

interface StationCardProps {
  station: Station;
  onPlay: (station: Station) => void;
  isPlaying: boolean;
  isActive: boolean;
}

export function StationCard({ station, onPlay, isPlaying, isActive }: StationCardProps) {
  return (
    <div
      className={`group relative flex w-64 flex-row items-center rounded-xl bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:cursor-pointer md:w-72 ${
        isActive ? 'ring-hero-gradient bg-white/10' : ''
      }`}
      onClick={() => onPlay(station)}
    >
      {/* Station image container with fixed aspect ratio */}
      <div className="mr-4">
        <StationIcon 
          stationIconUrl={station.stationIconUrl}
          stationName={station.stationName}
          size="md"
        />
      </div>
      
      {/* Station info */}
      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-base font-semibold text-white">{station.stationName}</h3>
        <p className="truncate text-sm text-white/80">{station.radioGroups[0] || 'Radyo İstasyonu'}</p>
        
        {/* Genre tag */}
        <div className="mt-2">
          <span className="rounded bg-white/10 px-2 py-1 text-xs">
            {station.stationCategories[0] || 'Müzik'}
          </span>
        </div>
      </div>
    </div>
  );
}