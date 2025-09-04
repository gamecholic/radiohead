"use client";

import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { StationIcon } from "@/components/station-icon";
import { Play, Pause, Heart, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function CurrentStation() {
  const { currentStation, isPlaying, togglePlay, playNext, playPrevious } =
    useAudio();

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the current station is a favorite
  useEffect(() => {
    if (currentStation) {
      const favoriteStatus = favorites.some(
        (fav) => fav.stationName === currentStation.stationName
      );
      setIsFavorite(favoriteStatus);
    }
  }, [currentStation, favorites]);

  const handleFavoriteToggle = async () => {
    if (!currentStation) return;

    if (isFavorite) {
      await removeFavorite(currentStation.stationName);
    } else {
      await addFavorite(currentStation);
    }
  };

  if (!currentStation) {
    return null;
  }

  return (
    <div className="border-t border-gray-800 bg-black/40 backdrop-blur-md px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <StationIcon
            stationIconUrl={currentStation.stationIconUrl}
            stationName={currentStation.stationName}
            size="xs"
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">
              {currentStation.stationName}
            </h3>
            <p className="text-xs text-white/70 truncate">
              {currentStation.radioGroups[0] || "Radyo İstasyonu"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={playPrevious}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            className="h-8 w-8 rounded-full bg-white text-black hover:bg-gray-200"
            onClick={() => togglePlay(currentStation)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={playNext}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full"
            onClick={handleFavoriteToggle}
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
