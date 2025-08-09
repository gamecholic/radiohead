"use client";

import {
  Play,
  Pause,
  Volume2,
  SkipBack,
  SkipForward,
  ListMusic,
  Radio,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";
import { useState } from "react";

export function NowPlayingPanel() {
  const {
    currentStation,
    isPlaying,
    volume,
    stationList,
    togglePlay,
    setVolume,
    updateVolume,
    playNext,
    playPrevious,
  } = useAudio();

  const [isFavorite, setIsFavorite] = useState(false);

  if (!currentStation) return null;

  const handleStationSelect = (station: any) => {
    togglePlay(station, stationList);
  };

  const toggleFavorite = () => {
    // TODO: Implement actual favorites functionality
    setIsFavorite(!isFavorite);
    // This is a placeholder for the actual favorites implementation
    console.log(`Toggled favorite status for ${currentStation.stationName}`);
  };

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
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover"
              onClick={toggleFavorite}
            >
              <Star
                className={`h-5 w-5 ${
                  isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover"
              onClick={playPrevious}
            >
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
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover"
              onClick={playNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="button-hero-hover"
                >
                  <ListMusic className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="center"
                className="w-64 p-0 bg-black/90 backdrop-blur-md border-gray-800"
              >
                <DropdownMenuLabel className="px-3 py-2 text-white/80 font-semibold">
                  Playlist Queue
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-800" />
                <ScrollArea className="h-60 rounded-md">
                  {stationList.map((station) => (
                    <DropdownMenuItem
                      key={station.stationName}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                        station.stationName === currentStation.stationName
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => handleStationSelect(station)}
                    >
                      <div className="flex items-center space-x-2">
                        <StationIcon
                          stationIconUrl={station.stationIconUrl}
                          stationName={station.stationName}
                          size="xxs"
                        />
                        <span
                          className={`text-sm ${
                            station.stationName === currentStation.stationName
                              ? "font-semibold text-white"
                              : "text-white/80"
                          }`}
                        >
                          {station.stationName}
                        </span>
                      </div>
                      {station.stationName === currentStation.stationName && (
                        <Radio className="h-4 w-4 text-white animate-pulse" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
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
