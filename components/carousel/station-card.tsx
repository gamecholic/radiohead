'use client';

import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Station {
  id: string;
  name: string;
  frequency: string;
  genre: string;
  imageUrl?: string;
}

interface StationCardProps {
  station: Station;
  onPlay: (stationId: string) => void;
  isPlaying: boolean;
  isActive: boolean;
}

export function StationCard({ station, onPlay, isPlaying, isActive }: StationCardProps) {
  return (
    <div
      className={`group relative flex w-48 flex-row items-center rounded-xl bg-white/5 p-3 backdrop-blur-md transition-all hover:bg-white/10 md:w-56 ${
        isActive ? 'ring-hero-gradient bg-white/10' : ''
      }`}
    >
      {/* Station image container with fixed aspect ratio */}
      <div className="relative mr-3 aspect-square h-16 overflow-hidden rounded-xl bg-white/10">
        {station.imageUrl ? (
          <img
            src={station.imageUrl}
            alt={station.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-xl font-bold">{station.name.charAt(0)}</div>
          </div>
        )}
        {/* Live tag for featured stations */}
        {station.genre === 'Featured' && (
          <div className="absolute left-1 top-1 rounded bg-red-500 px-1 py-0.5 text-[0.6rem] font-semibold">
            LIVE
          </div>
        )}
      </div>
      
      {/* Station info */}
      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-sm font-semibold text-white">{station.name}</h3>
        <p className="truncate text-xs text-white/80">{station.frequency}</p>
        
        {/* Genre tag */}
        <div className="mt-1">
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
            {station.genre}
          </span>
        </div>
      </div>
      
      {/* Play button - shown on hover or when active */}
      <Button
        className={`absolute right-2 h-8 w-8 rounded-full bg-hero-gradient transition-opacity hover:opacity-90 ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        size="icon"
        onClick={() => onPlay(station.id)}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}