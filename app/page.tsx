"use client";

import { useState, useEffect } from "react";
import { Header, MobileMenu, FeaturedStation } from "@/components/layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel } from "@/components/carousel";
import {
  getCategories,
  getStationsByCategory,
  getFeaturedStations,
} from "@/lib/api";
import { useAudio } from "@/contexts/AudioContext";
import { RadioStation } from "@/lib/types";

export default function Home() {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [stationsByCategory, setStationsByCategory] = useState<
    Record<string, RadioStation[]>
  >({});
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);

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
        const stations: Record<string, RadioStation[]> = {};
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
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

      {/* Main Content Area - This should take remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 h-full">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6 absolute inset-0">
            {/* Hero Featured Station */}
            <FeaturedStation station={featuredStation} />

            {/* Netflix-style Carousels */}
            <section className="w-full">
              {categories
                .filter((c) => stationsByCategory[c]?.length)
                .map((category) => (
                  <Carousel
                    key={category}
                    title={category}
                    stations={stationsByCategory[category] || []}
                  />
                ))}
            </section>
          </div>
        </ScrollArea>
      </div>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
