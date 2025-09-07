"use client";

import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState, useEffect } from "react";
import { MobilePlayerControls } from "@/components/audio/MobilePlayerControls";
import { Station } from "@/lib/types";

export function CurrentStation() {
  const {
    currentStation,
    volume,
    setVolume,
    setVolumeAndUpdateAudio,
    togglePlay,
    stationList,
    stationListSource,
  } = useAudio();

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);

  // Check if the current station is a favorite when it changes or when favorites update
  useEffect(() => {
    if (currentStation) {
      const favoriteStatus = favorites.some(
        (fav) => fav.stationName === currentStation.stationName
      );
      setIsFavorite(favoriteStatus);
    }
  }, [currentStation, favorites]);

  if (!currentStation) return null;

  const handleStationSelect = (station: Station) => {
    togglePlay(station, stationList, stationListSource ?? undefined);
  };

  const toggleFavorite = async () => {
    if (!currentStation) return;

    if (isFavorite) {
      await removeFavorite(currentStation.stationName);
    } else {
      await addFavorite(currentStation);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
    }
  };

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

        <div className="ml-3">
          <MobilePlayerControls
            onStationSelect={handleStationSelect}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onToggleMute={toggleMute}
            onUpdateVolume={setVolumeAndUpdateAudio}
            onSetVolume={setVolume}
          />
        </div>
      </div>
    </div>
  );
}
