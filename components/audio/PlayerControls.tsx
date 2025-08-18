import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  ListMusic,
  Radio,
  Star,
  AlertTriangle,
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
import { Station } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface PlayerControlsProps {
  onStationSelect: (station: Station) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function PlayerControls({
  onStationSelect,
  isFavorite,
  onToggleFavorite,
}: PlayerControlsProps) {
  const {
    isPlaying,
    currentStation,
    stationList,
    stationListSource,
    togglePlay,
    playNext,
    playPrevious,
  } = useAudio();

  if (!currentStation) return null;

  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        className="button-hero-hover"
        onClick={onToggleFavorite}
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
          <Button variant="ghost" size="icon" className="button-hero-hover">
            <ListMusic className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="center"
          className="w-64 p-0 bg-black/90 backdrop-blur-md border-gray-800"
        >
          <DropdownMenuLabel className="px-3 py-2 text-white/80 font-semibold">
            Oynatma Listesi
          </DropdownMenuLabel>
          {stationListSource ? (
            <DropdownMenuLabel className="px-3 py-1 text-xs text-white/60 font-normal flex items-center">
              Kaynak: {stationListSource}
            </DropdownMenuLabel>
          ) : (
            <DropdownMenuLabel className="px-3 py-1 text-xs text-white/60 font-normal flex items-center">
              Kaynak: {currentStation?.radioGroups[0] || "Radyo İstasyonu"}
            </DropdownMenuLabel>
          )}
          <DropdownMenuSeparator className="bg-gray-800" />
          <ScrollArea className="h-60 rounded-md">
            {stationList.map((station) => (
              <DropdownMenuItem
                key={station.stationName}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer focus:bg-white/10 ${
                  station.stationName === currentStation.stationName
                    ? "bg-white/10"
                    : "hover:bg-white/10"
                }`}
                onClick={() => onStationSelect(station)}
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
  );
}

interface VolumeControlProps {
  onToggleMute: () => void;
  onSetVolume: (volume: number) => void;
  onUpdateVolume: (volume: number) => void;
}

export function VolumeControl({
  onToggleMute,
  onSetVolume,
  onUpdateVolume,
}: VolumeControlProps) {
  const { volume, isIOSSafari } = useAudio();
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const volumeAreaRef = useRef<HTMLDivElement>(null);

  // Handle mouse wheel volume control
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isVolumeHovered || isIOSSafari) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      const newVolume = Math.min(100, Math.max(0, volume + delta));
      onUpdateVolume(newVolume);
      onSetVolume(newVolume);
    };

    const volumeArea = volumeAreaRef.current;
    if (volumeArea) {
      volumeArea.addEventListener("wheel", handleWheel, { passive: false });
      return () => volumeArea.removeEventListener("wheel", handleWheel);
    }
  }, [isVolumeHovered, volume, isIOSSafari, onUpdateVolume, onSetVolume]);

  return (
    <div
      className="flex items-center space-x-2 w-1/3 justify-end"
      ref={volumeAreaRef}
      onMouseEnter={() => setIsVolumeHovered(true)}
      onMouseLeave={() => setIsVolumeHovered(false)}
    >
      {isIOSSafari && (
        <div
          className="flex items-center text-yellow-500 mr-2"
          title="iOS Safari'de ses kontrolü kullanılamaz"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span className="text-xs">Ses kontrolü yok</span>
        </div>
      )}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="button-hero-hover"
          onClick={onToggleMute}
          disabled={isIOSSafari} // Disable mute button on iOS
        >
          {volume > 0 ? (
            <Volume2 className="h-5 w-5" />
          ) : (
            <VolumeX className="h-5 w-5" />
          )}
        </Button>
        {isIOSSafari && (
          <span
            className="absolute -top-1 -right-1 text-yellow-500"
            title="Not available on iOS Safari"
          >
            <AlertTriangle className="h-3 w-3" />
          </span>
        )}
      </div>
      <Slider
        value={[volume]}
        onValueChange={([newVolume]) => onUpdateVolume(newVolume)}
        onValueCommit={([newVolume]) => onSetVolume(newVolume)}
        max={100}
        step={1}
        className="w-24"
        disabled={isIOSSafari} // Disable slider on iOS
      />
    </div>
  );
}
