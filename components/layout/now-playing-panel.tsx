"use client";

import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useState, useEffect } from "react";
import {
  PlayerControls,
  VolumeControl,
} from "@/components/audio/PlayerControls";
import { MobilePlayerControls } from "@/components/audio/MobilePlayerControls";
import { Station } from "@/lib/types";

export function NowPlayingPanel() {
  const {
    currentStation,
    volume,
    setVolume,
    updateVolume,
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
    <div className="border-t border-gray-800 bg-black/20 backdrop-blur-md absolute bottom-0 left-0 right-0 z-50">
      <div className="w-full max-w-6xl mx-auto">
        {/* Desktop view */}
        <div className="hidden md:flex items-center justify-between p-4">
          <div className="flex items-center space-x-4 w-1/3">
            <StationIcon
              stationIconUrl={currentStation.stationIconUrl}
              stationName={currentStation.stationName}
              size="sm"
            />
            <div className="min-w-0">
              <h3 className="font-semibold truncate">
                {currentStation.stationName}
              </h3>
              <p className="text-sm text-white/70 truncate">
                {currentStation.radioGroups[0] || "Radyo İstasyonu"}
              </p>
            </div>
          </div>

          <PlayerControls
            onStationSelect={handleStationSelect}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />

          <VolumeControl
            onToggleMute={toggleMute}
            onUpdateVolume={updateVolume}
            onSetVolume={setVolume}
          />
        </div>

        {/* Mobile view */}
        <div className="flex md:hidden items-center justify-between p-3">
          <div className="flex items-center space-x-3 w-1/2">
            <StationIcon
              stationIconUrl={currentStation.stationIconUrl}
              stationName={currentStation.stationName}
              size="xxs"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {currentStation.stationName}
              </h3>
              <p className="text-xs text-white/70 truncate">
                {currentStation.radioGroups[0] || "Radyo İstasyonu"}
              </p>
            </div>
          </div>

          <MobilePlayerControls
            onStationSelect={handleStationSelect}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onToggleMute={toggleMute}
            onUpdateVolume={updateVolume}
            onSetVolume={setVolume}
          />
        </div>
      </div>
    </div>
  );
}
