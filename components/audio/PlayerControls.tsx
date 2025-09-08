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
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StationIcon } from "@/components/station-icon";
import { Station } from "@/lib/types";
import { useState, useEffect, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { AddToPlaylist } from "@/components/add-to-playlist";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
      <AddToPlaylist 
        station={currentStation} 
        trigger={
          <Button variant="ghost" size="icon" className="button-hero-hover">
            <PlusCircle className="h-5 w-5" />
          </Button>
        }
      />
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
      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="button-hero-hover">
            <ListMusic className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-black/30 backdrop-blur-md border-gray-800 h-screen flex flex-col">
          <DrawerHeader className="border-b border-gray-800">
            <DrawerTitle>Oynatma Listesi</DrawerTitle>
            {stationListSource ? (
              <div className="text-xs text-white/60 font-normal flex items-center mt-1">
                Kaynak: {stationListSource}
              </div>
            ) : (
              <div className="text-xs text-white/60 font-normal flex items-center mt-1">
                Kaynak: {currentStation?.radioGroups[0] || "Radyo İstasyonu"}
              </div>
            )}
          </DrawerHeader>
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full p-4">
              <div className="space-y-2 pb-4">
                {stationList.map((station, index) => (
                  <div
                    key={`${station.stationName}-${index}`}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-white/10 ${
                      station.stationName === currentStation.stationName ? 'bg-white/10' : ''
                    }`}
                    onClick={() => onStationSelect(station)}
                  >
                    <StationIcon
                      stationIconUrl={station.stationIconUrl}
                      stationName={station.stationName}
                      size="xs"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className={`font-medium truncate text-sm ${
                        station.stationName === currentStation.stationName
                          ? "text-white font-semibold"
                          : "text-white/80"
                      }`}>
                        {station.stationName}
                      </h4>
                      <p className="text-xs text-white/70 truncate">
                        {station.radioGroups[0] || "Radyo İstasyonu"}
                      </p>
                    </div>
                    {station.stationName === currentStation.stationName && (
                      <Radio className="h-4 w-4 text-white animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
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

      // For wheel control, update both immediately for responsive UX

      onSetVolume(newVolume);
    };

    const volumeArea = volumeAreaRef.current;
    if (volumeArea) {
      volumeArea.addEventListener("wheel", handleWheel, { passive: false });
      return () => volumeArea.removeEventListener("wheel", handleWheel);
    }
  }, [isVolumeHovered, volume, isIOSSafari, onSetVolume]);

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
