"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Station } from "@/lib/types";
import { Play, Pause, Star } from "lucide-react";
import { motion } from "framer-motion";

interface FeaturedStationProps {
  station: Station;
  stationList?: Station[];
}

export function FeaturedStation({
  station,
  stationList = [],
}: FeaturedStationProps) {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isHovered, setIsHovered] = useState(false);

  const isActive = currentStation?.stationName === station.stationName;
  const isFavorite = favorites.some(
    (fav: Station) => fav.stationName === station.stationName
  );

  if (!station) return null;

  const handlePlay = () => {
    togglePlay(station, [station, ...stationList], "Öne Çıkanlar");
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(station.stationName);
    } else {
      addFavorite(station);
    }
  };

  return (
    <motion.section
      className="mb-8 overflow-hidden rounded-2xl bg-hero-gradient p-6 shadow-lg border border-white/5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
        {/* Station Icon with glow effect */}
        <div
          className="relative cursor-pointer"
          onClick={handlePlay}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-10 animate-pulse"></div>
          <div className="relative">
            <StationIcon
              stationIconUrl={station.stationIconUrl}
              stationName={station.stationName}
              size="lg"
            />
          </div>

          {/* Play/Pause overlay */}
          <motion.div
            className={`absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
            >
              {isActive && isPlaying ? (
                <Pause className="h-6 w-6 text-black" />
              ) : (
                <Play className="h-6 w-6 text-black" />
              )}
            </Button>
          </motion.div>
        </div>

        {/* Station Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {station.stationName}
            </h2>

            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-auto hover:bg-white/10"
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
              ) : (
                <Star className="h-5 w-5 text-white/70 hover:text-yellow-400" />
              )}
            </Button>
          </div>

          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
              {station.radioGroups[0] || "Radyo İstasyonu"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
              {station.stationCategories[0] || "Müzik"}
            </span>
            {station.stationCity && (
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-medium">
                {station.stationCity}
              </span>
            )}
          </div>

          <p className="mt-3 text-white/80 text-sm max-w-2xl">
            {station.stationCategories[0]
              ? `Popüler ${station.stationCategories[0].toLowerCase()} istasyonu - ${
                  station.radioGroups[0] || "Radyo İstasyonu"
                } grubundan`
              : "Popüler radyo istasyonu"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="bg-primary-gradient text-white hover:opacity-90 px-6 py-2 h-auto"
            onClick={handlePlay}
          >
            {isActive && isPlaying ? (
              <>
                <Pause className="mr-2 h-4 w-4" />
                Durdur
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Şimdi Dinle
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.section>
  );
}
