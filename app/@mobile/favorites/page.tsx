"use client";

import { useState, useEffect } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Station } from "@/lib/types";
import { Play, Pause, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MobileFavorites() {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const { favorites, removeFavorite } = useFavorites();
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    setStations(favorites);
  }, [favorites]);

  const handleRemoveFavorite = async (stationName: string) => {
    await removeFavorite(stationName);
  };

  const isCurrentlyPlaying = (stationName: string) => {
    return currentStation?.stationName === stationName;
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <ScrollArea className="flex-1">
        <div className="px-4 pb-16">
          <div className="mt-4 mb-6">
            <h1 className="text-2xl font-bold">Favoriler</h1>
            <p className="text-gray-400">{stations.length} favori istasyon</p>
          </div>

          {stations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h2 className="text-xl font-bold text-white mb-2">
                Henüz Favoriniz Yok
              </h2>
              <p className="text-gray-400 max-w-md mb-6">
                Kalp simgesine tıklayarak favori radyo istasyonlarınızı
                kaydedin.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Link href="/">İstasyonları Keşfet</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {stations.map((station) => (
                <div
                  key={station.stationName}
                  className={`group relative rounded-xl bg-white/2 p-4 backdrop-blur-sm hover:bg-white/5 transition-all cursor-pointer border ${
                    isCurrentlyPlaying(station.stationName)
                      ? "ring-2 ring-hero-gradient border-white/20"
                      : "border-white/5"
                  }`}
                >
                  {/* Play/Pause overlay - covers entire card */}
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    onClick={() => togglePlay(station, stations, "Favoriler")}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      {isCurrentlyPlaying(station.stationName) && isPlaying ? (
                        <Pause className="h-4 w-4 text-black" />
                      ) : (
                        <Play className="h-4 w-4 text-black" />
                      )}
                    </div>
                  </div>

                  {/* Remove button - positioned at top-right corner */}
                  <Button
                    className="absolute top-2 right-2 w-7 h-7 hover:opacity-90 flex items-center justify-center z-20 shadow-lg"
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(station.stationName);
                    }}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>

                  <div
                    className="relative z-0"
                    onClick={() => togglePlay(station, stations, "Favoriler")}
                  >
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

                    <div className="text-center">
                      <h3 className="text-sm font-medium text-white truncate group-hover:text-white transition-colors">
                        {station.stationName}
                      </h3>
                      <p className="text-xs text-white/70 truncate">
                        {station.stationCategories[0] || "Müzik"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
