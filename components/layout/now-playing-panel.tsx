"use client";

import { Play, Pause, Volume2, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";

export function NowPlayingPanel() {
  const {
    currentStation,
    isPlaying,
    volume,
    togglePlay,
    setVolume,
    updateVolume,
  } = useAudio();

  if (!currentStation) return null;

  return (
    <div className="border-t border-gray-800 bg-black/20 backdrop-blur-md absolute bottom-0 left-0 right-0 z-50">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <StationIcon
              stationIconUrl={currentStation.stationIconUrl}
              stationName={currentStation.stationName}
              size="sm"
            />
            <div>
              <h3 className="font-semibold">{currentStation.stationName}</h3>
              <p className="text-sm text-white/70">
                {currentStation.radioGroups[0] || "Radio Station"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="button-hero-hover">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              className="h-10 w-10 rounded-full bg-hero-gradient hover:opacity-90"
              size="icon"
              onClick={() => togglePlay(currentStation)}
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
            <Slider
              value={[volume]}
              onValueChange={([newVolume]) => updateVolume(newVolume)}
              onValueCommit={([newVolume]) => setVolume(newVolume)}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
