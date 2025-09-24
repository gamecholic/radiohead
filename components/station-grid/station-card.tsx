"use client";

import { useState } from "react";
import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";
import { Station } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import Link from "next/link";

interface StationCardProps {
  station: Station;
  stationList?: Station[];
  source?: string;
}

export function StationCard({
  station,
  stationList = [],
  source = "İstasyonlar",
}: StationCardProps) {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = currentStation?.stationName === station.stationName;

  const handlePlay = () => {
    togglePlay(station, stationList, source);
  };

  return (
    <div
      className={`group relative flex flex-col rounded-xl p-3 backdrop-blur-md transition-all hover:cursor-pointer ${
        isActive
          ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20 ring-hero-gradient"
          : "bg-white/5 hover:bg-white/10"
      }`}
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ width: "100%", maxWidth: "160px" }}
    >
      {/* Dark overlay on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/30 rounded-lg z-10"></div>
      )}

      {/* Station image container with fixed aspect ratio */}
      <div className="relative mb-3 aspect-square w-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <StationIcon
            stationIconUrl={station.stationIconUrl}
            stationName={station.stationName}
            size="lg"
          />
        </div>

        {/* Play/Pause button overlay */}
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-white/70 hover:bg-white/90 hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              {isActive && isPlaying ? (
                <Pause className="h-5 w-5 text-black" />
              ) : (
                <Play className="h-5 w-5 text-black" />
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Station info */}
      <div className="flex-1 overflow-hidden text-center relative z-10">
        <h3 className="truncate text-sm font-semibold text-white">
          {station.slug ? (
            <Link
              href={`/station/${station.slug}`}
              className="hover:text-blue-400 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {station.stationName}
            </Link>
          ) : (
            station.stationName
          )}
        </h3>
        <p className="truncate text-xs text-white/80">
          {station.radioGroups[0] || "Radyo İstasyonu"}
        </p>

        {/* Genre tag */}
        <div className="mt-2 flex justify-center">
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
            {station.stationCategories[0] || "Müzik"}
          </span>
        </div>
      </div>
    </div>
  );
}
