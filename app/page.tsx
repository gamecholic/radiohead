"use client";

import { useState, useRef, useEffect } from "react";
import {
  Header,
  Sidebar,
  NowPlayingPanel,
  MobileMenu,
  FeaturedStation,
} from "@/components/layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel } from "@/components/carousel";
import {
  getCategories,
  getStationsByCategory,
  getFeaturedStations,
} from "@/lib/api";

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [stationsByCategory, setStationsByCategory] = useState<
    Record<string, any[]>
  >({});
  const [featuredStations, setFeaturedStations] = useState<any[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Fetch featured stations
        const featured = await getFeaturedStations();
        setFeaturedStations(featured);

        // Fetch stations for each category
        const stations: Record<string, any[]> = {};
        for (const category of categoriesData) {
          const categoryStations = await getStationsByCategory(category);
          stations[category] = categoryStations;
        }
        setStationsByCategory(stations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const featuredStation = featuredStations[0] || null;

  const togglePlay = (stationId: string) => {
    if (currentStation === stationId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentStation(stationId);
      setIsPlaying(true);
    }
  };

  const handleListenNow = () => {
    if (featuredStation) {
      togglePlay(featuredStation.stationName);
    }
  };

  const getStationById = (id: string) => {
    // Flatten all stations from all categories
    const allStations = Object.values(stationsByCategory).flat();
    return allStations.find((station) => station.stationName === id) || null;
  };

  // Render loading state while data is being fetched
  if (categories.length === 0 || Object.keys(stationsByCategory).length === 0) {
    return (
      <div className="flex flex-col h-screen">
        <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <audio ref={audioRef} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

      {/* Main Content Area - This should take remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 h-full">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
            {/* Hero Featured Station */}
            <FeaturedStation
              station={featuredStation}
              onListenNow={handleListenNow}
            />

            {/* Netflix-style Carousels */}
            <section className="w-full">
              {categories
                .filter((c) => stationsByCategory[c]?.length)
                .map((category) => (
                  <Carousel
                    key={category}
                    title={category}
                    stations={stationsByCategory[category] || []}
                    onPlay={togglePlay}
                    currentStation={currentStation}
                    isPlaying={isPlaying}
                  />
                ))}
            </section>
          </div>
        </ScrollArea>

        {/* Now Playing Dock */}
        <NowPlayingPanel
          currentStation={getStationById(currentStation || "")}
          isPlaying={isPlaying}
          volume={volume}
          onTogglePlay={togglePlay}
          onVolumeChange={setVolume}
        />
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Audio element (hidden) */}
      <audio ref={audioRef} />
    </div>
  );
}
