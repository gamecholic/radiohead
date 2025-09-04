"use client";

import { useState, useEffect } from "react";
import { StationIcon } from "@/components/station-icon";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Play, Pause, Menu, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Station } from "@/lib/types";

export function FavoritesPageClient({
  initialStations,
}: {
  initialStations: Station[];
}) {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const { favorites, removeFavorite } = useFavorites();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [stations, setStations] = useState<Station[]>(initialStations);

  // Update stations when favorites change
  useEffect(() => {
    setStations(favorites);
  }, [favorites]);

  const handleRemoveFavorite = async (stationName: string) => {
    await removeFavorite(stationName);
  };

  return (
    <div className="flex-1 overflow-hidden">
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="!h-6 !w-6" />
        </Button>
        <h1 className="text-lg font-bold text-white truncate">Favoriler</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      <ScrollArea className="h-full w-full">
        <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
          {/* Header with favorites title (desktop) */}
          <div className="mb-8 hidden md:block">
            <h1 className="text-3xl font-bold text-white mb-2">Favoriler</h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
          </div>

          {stations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Star className="h-16 w-16 text-yellow-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">
                Henüz Favoriniz Yok
              </h2>
              <p className="text-white/70 max-w-md">
                Yıldız simgesine tıklayarak favori istasyonlarınıza istasyon
                ekleyin.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-white/70 text-sm">
                  {stations.length}{" "}
                  {stations.length === 1 ? "istasyon" : "istasyon"}
                </p>
              </div>

              {/* Stations grid */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 sm:gap-6 pb-32">
                {stations.map((station: Station) => (
                  <div
                    key={station.stationName}
                    className={`group relative flex flex-col rounded-xl bg-white/5 p-3 sm:p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:cursor-pointer border border-white/10 ${
                      currentStation?.stationName === station.stationName &&
                      isPlaying
                        ? "ring-hero-gradient bg-white/10"
                        : ""
                    }`}
                    onClick={() => togglePlay(station, stations, "Favoriler")}
                  >
                    <div className="flex items-center">
                      <StationIcon
                        stationIconUrl={station.stationIconUrl}
                        stationName={station.stationName}
                        size="sm"
                      />
                      <div className="ml-3 sm:ml-4 overflow-hidden flex-1 min-w-0">
                        <h2 className="truncate text-base sm:text-lg font-semibold text-white">
                          {station.stationName}
                        </h2>
                        <p className="truncate text-xs sm:text-sm text-white/80">
                          {station.stationCity}
                        </p>
                        <div className="mt-1">
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                            {station.stationCategories[0] || "Müzik"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-2">
                        <Button
                          className="h-8 w-8 rounded-full bg-hero-gradient hover:opacity-90 flex-shrink-0"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay(station, stations, "Favoriler");
                          }}
                        >
                          {currentStation?.stationName ===
                            station.stationName && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(station.stationName);
                          }}
                        >
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
