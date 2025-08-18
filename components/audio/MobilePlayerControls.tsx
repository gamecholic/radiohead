import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  MoreVertical,
  AlertTriangle,
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
import { Station } from "@/lib/types";
import { useAudio } from "@/contexts/AudioContext";

interface MobilePlayerControlsProps {
  onStationSelect: (station: Station) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onToggleMute: () => void;
  onUpdateVolume: (volume: number) => void;
  onSetVolume: (volume: number) => void;
}

export function MobilePlayerControls({
  onStationSelect,
  isFavorite,
  onToggleFavorite,
  onToggleMute,
  onUpdateVolume,
  onSetVolume,
}: MobilePlayerControlsProps) {
  const {
    isPlaying,
    currentStation,
    stationList,
    stationListSource,
    volume,
    isIOSSafari,
    togglePlay,
    playNext,
    playPrevious,
  } = useAudio();

  if (!currentStation) return null;

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="button-hero-hover h-8 w-8"
        onClick={playPrevious}
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      <Button
        className="h-8 w-8 rounded-full bg-hero-gradient hover:opacity-90"
        size="icon"
        onClick={() => togglePlay(currentStation)}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="button-hero-hover h-8 w-8"
        onClick={playNext}
      >
        <SkipForward className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="button-hero-hover h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          align="end"
          className="w-56 p-0 bg-black/90 backdrop-blur-md border-gray-800"
        >
          <DropdownMenuItem
            className="flex items-center space-x-2 px-3 py-2 cursor-pointer focus:bg-white/10"
            onClick={onToggleFavorite}
          >
            <Star
              className={`h-4 w-4 ${
                isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
              }`}
            />
            <span>
              {isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuItem
            className="flex items-center space-x-2 px-3 py-2 cursor-pointer focus:bg-white/10"
            onClick={onToggleMute}
            disabled={isIOSSafari} // Disable mute button on iOS
          >
            {volume > 0 ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
            <span>{volume > 0 ? "Sessize Al" : "Sesi Aç"}</span>
            {isIOSSafari && (
              <span
                className="text-yellow-500"
                title="Not available on iOS Safari"
              >
                <AlertTriangle className="h-3 w-3" />
              </span>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-800" />
          <DropdownMenuLabel className="px-3 py-2 text-white/80 font-semibold flex items-center">
            Ses
            {isIOSSafari && (
              <span
                className="flex items-center text-yellow-500 ml-2"
                title="iOS Safari'de ses kontrolü kullanılamaz"
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                <span className="text-xs">Kullanılamaz</span>
              </span>
            )}
          </DropdownMenuLabel>
          <div className="px-3 py-2">
            <Slider
              value={[volume]}
              onValueChange={([newVolume]) => onUpdateVolume(newVolume)}
              onValueCommit={([newVolume]) => onSetVolume(newVolume)}
              max={100}
              step={1}
              className="w-full"
              disabled={isIOSSafari} // Disable slider on iOS
            />
            {isIOSSafari && (
              <p className="text-xs text-yellow-500 mt-1">
                Ses seviyesini kontrol etmek için cihazınızın ses düğmelerini
                kullanın
              </p>
            )}
          </div>
          <DropdownMenuSeparator className="bg-gray-800" />
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
          <ScrollArea className="h-40 rounded-md">
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
                  <Radio className="h-3 w-3 text-white animate-pulse" />
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
