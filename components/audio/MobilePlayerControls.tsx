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
  Heart,
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
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="button-hero-hover h-10 w-10 mx-1"
        onClick={playPrevious}
      >
        <SkipBack className="h-5 w-5" />
      </Button>
      <Button
        className="h-10 w-10 rounded-full bg-hero-gradient hover:opacity-90 mx-1"
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
        className="button-hero-hover h-10 w-10 mx-1"
        onClick={playNext}
      >
        <SkipForward className="h-5 w-5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="button-hero-hover h-10 w-10 mx-1"
          >
            <MoreVertical className="h-5 w-5" />
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
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-white"
              }`}
            />
            <span>
              {isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
            </span>
          </DropdownMenuItem>
          {isIOSSafari ? (
            // On iOS, skip the volume controls entirely and just show a separator
            <DropdownMenuSeparator className="bg-gray-800" />
          ) : (
            // On non-iOS devices, show the full volume controls
            <>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuItem
                className="flex items-center space-x-2 px-3 py-2 cursor-pointer focus:bg-white/10"
                onClick={onToggleMute}
              >
                {volume > 0 ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                <span>{volume > 0 ? "Sessize Al" : "Sesi Aç"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800" />
              <DropdownMenuLabel className="px-3 py-2 text-white/80 font-semibold">
                Ses
              </DropdownMenuLabel>
              <div className="px-3 py-2">
                <Slider
                  value={[volume]}
                  onValueChange={([newVolume]) => onUpdateVolume(newVolume)}
                  onValueCommit={([newVolume]) => onSetVolume(newVolume)}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <DropdownMenuSeparator className="bg-gray-800" />
            </>
          )}
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
