"use client";

import { useState } from "react";
import { StationIcon } from '@/components/station-icon';
import { useAudio } from "@/contexts/AudioContext";
import { RadioStation } from "@/lib/types";

interface StationCardProps {
  station: RadioStation;
  stationList?: RadioStation[];
  layout?: "vertical" | "horizontal";
}

export function StationCard({ station, stationList = [], layout = "vertical" }: StationCardProps) {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  
  const isActive = currentStation?.stationName === station.stationName;

  const handlePlay = () => {
    togglePlay(station, stationList);
  };

  if (layout === "horizontal") {
    return (
      <div
        className={`group relative flex flex-row items-center rounded-xl bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:cursor-pointer w-64 md:w-72 ${
          isActive ? 'ring-hero-gradient bg-white/10' : ''
        }`}
        onClick={handlePlay}
      >
        {/* Station image container */}
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

  return (
    <div 
      className={`group relative flex flex-col rounded-xl p-3 backdrop-blur-md transition-all hover:cursor-pointer ${
        isActive 
          ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 ring-hero-gradient' 
          : 'bg-white/5 hover:bg-white/10'
      }`}
      onClick={handlePlay}
      style={{ width: '100%', maxWidth: '160px' }}
    >
      {/* Station image container with fixed aspect ratio */}
      <div className="relative mb-3 aspect-square w-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <StationIcon 
            stationIconUrl={station.stationIconUrl}
            stationName={station.stationName}
            size="lg"
          />
        </div>
      </div>
      
      {/* Station info */}
      <div className="flex-1 overflow-hidden text-center">
        <h3 className="truncate text-sm font-semibold text-white">{station.stationName}</h3>
        <p className="truncate text-xs text-white/80">{station.radioGroups[0] || 'Radyo İstasyonu'}</p>
        
        {/* Genre tag */}
        <div className="mt-2 flex justify-center">
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
            {station.stationCategories[0] || 'Müzik'}
          </span>
        </div>
      </div>
    </div>
  );
}