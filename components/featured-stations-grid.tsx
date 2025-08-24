"use client";

import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Station } from "@/lib/types";
import { motion } from "framer-motion";
import { Play, Pause, Star } from "lucide-react";

interface FeaturedStationsGridProps {
  stations: Station[];
}

export function FeaturedStationsGrid({ stations }: FeaturedStationsGridProps) {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const { favorites } = useFavorites();

  return (
    <motion.section
      className="mb-12 rounded-2xl bg-featured-grid-gradient p-6 border border-white/5 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Öne Çıkan İstasyonlar
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {stations.slice(0, 5).map((station, index) => {
          const isCurrentlyPlaying = currentStation?.stationName === station.stationName;
          
          return (
            <motion.div
              key={station.stationName}
              className={`group relative rounded-xl bg-white/2 p-4 backdrop-blur-sm hover:bg-white/5 transition-all cursor-pointer border ${
                isCurrentlyPlaying 
                  ? "ring-2 ring-hero-gradient border-white/20" 
                  : "border-white/5"
              }`}
              onClick={() =>
                togglePlay(station, stations, "Öne Çıkanlar")
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.15 }}
            >
              {/* Play/Pause overlay - covers entire card */}
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                  {isCurrentlyPlaying && isPlaying ? (
                    <Pause className="h-4 w-4 text-black" />
                  ) : (
                    <Play className="h-4 w-4 text-black" />
                  )}
                </div>
              </div>

              <div className="relative z-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden mx-auto bg-hero-gradient flex items-center justify-center mb-3">
                  {station.stationIconUrl ? (
                    <img
                      src={station.stationIconUrl}
                      alt={station.stationName}
                      className="w-full h-full object-contain p-2 filter brightness-110 contrast-125"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.parentElement!.innerHTML = `<div class="text-xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">${station.stationName.charAt(
                          0
                        )}</div>`;
                      }}
                    />
                  ) : (
                    <div className="text-xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      {station.stationName.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Favorite indicator */}
                {favorites.some(
                  (fav: Station) =>
                    fav.stationName === station.stationName
                ) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-hero-gradient rounded-full flex items-center justify-center border border-white/20 z-20">
                    <Star className="h-2.5 w-2.5 text-white fill-current" />
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-sm font-medium text-white truncate group-hover:text-white transition-colors">
                    {station.stationName}
                  </h3>
                  <p className="text-xs text-white/70 truncate">
                    {station.stationCategories[0] || "Müzik"}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}