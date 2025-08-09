'use client';

import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Station {
  id: string;
  name: string;
  frequency: string;
  genre: string;
}

interface NowPlayingPanelProps {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  onTogglePlay: (stationId: string) => void;
  onVolumeChange: (volume: number) => void;
}

export function NowPlayingPanel({ 
  currentStation, 
  isPlaying, 
  volume, 
  onTogglePlay, 
  onVolumeChange 
}: NowPlayingPanelProps) {
  if (!currentStation) return null;

  return (
    <div className="border-t border-gray-800 bg-black/20 backdrop-blur-md absolute bottom-0 left-0 right-0 z-50">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <div className="text-lg font-bold">
                {currentStation.name.charAt(0)}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">{currentStation.name}</h3>
              <p className="text-sm text-white/70">{currentStation.frequency}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="button-hero-hover">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              className="h-10 w-10 rounded-full bg-hero-gradient hover:opacity-90"
              size="icon"
              onClick={() => onTogglePlay(currentStation.id)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="button-hero-hover">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="hidden items-center space-x-2 md:flex">
            <Volume2 className="h-5 w-5" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}