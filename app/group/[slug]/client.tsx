'use client';

import { useState } from "react";
import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function GroupPageClient({ group, stations }: { group: any, stations: any[] }) {
  const { isPlaying, currentStation, togglePlay } = useAudio();

  return (
    <div className="flex-1 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        {/* Header with group name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{group.groupName}</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
        
        {/* Stations grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stations.map((station: any) => (
            <div 
              key={station.stationName} 
              className="group relative flex flex-col rounded-xl bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:cursor-pointer border border-white/10"
            >
              <div className="flex items-center">
                <StationIcon 
                  stationIconUrl={station.stationIconUrl}
                  stationName={station.stationName}
                  size="md"
                />
                <div className="ml-4 overflow-hidden flex-1">
                  <h2 className="truncate text-lg font-semibold text-white">{station.stationName}</h2>
                  <p className="truncate text-sm text-white/80">{station.stationCity}</p>
                  <div className="mt-1">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                      {station.stationCategories[0] || 'Music'}
                    </span>
                  </div>
                </div>
                <Button
                  className="h-8 w-8 rounded-full bg-hero-gradient hover:opacity-90 ml-2"
                  size="icon"
                  onClick={() => togglePlay(station)}
                >
                  {currentStation?.stationName === station.stationName && isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}