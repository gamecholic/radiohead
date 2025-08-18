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
import { Station, Category } from "@/lib/types";

export default function Home() {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stationsByCategory, setStationsByCategory] = useState<
    Record<string, Station[]>
  >({});
  const [featuredStations, setFeaturedStations] = useState<Station[]>([]);
  const [featuredStation, setFeaturedStation] = useState<Station | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Fetch categories and stations for carousels
  useEffect(() => {
    const fetchCategoriesAndStations = async () => {
      try {
        // Fetch categories
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Fetch stations for each category
        const stations: Record<string, Station[]> = {};
        for (const category of categoriesData) {
          const categoryStations = await getStationsByCategory(category.name);
          stations[category.name] = categoryStations;
        }
        setStationsByCategory(stations);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories and stations:", error);
        setLoadingCategories(false);
      }
    };

    fetchCategoriesAndStations();
  }, []);

  // Fetch featured stations separately
  useEffect(() => {
    const fetchFeaturedStations = async () => {
      try {
        const featured = await getFeaturedStations("temp-user");
        setFeaturedStations(featured);

        // Set a random featured station once
        if (featured.length > 0 && !featuredStation) {
          const randomStation =
            featured[Math.floor(Math.random() * featured.length)];
          setFeaturedStation(randomStation);
        }
      } catch (error) {
        console.error("Error fetching featured stations:", error);
      }
    };

    fetchFeaturedStations();
  }, []);

  // Render loading state only for categories (not blocking carousels)
  if (loadingCategories) {
    return (
      <div className="flex flex-col h-[100dvh]">
        <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />
        <div className="flex-1 flex items-center justify-center">
          <p>Yükleniyor...</p>
        </div>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh]">
      <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

      {/* Main Content Area - This should take remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 h-full [&>div]:!block">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-24">
            {/* Hero Featured Station */}
            {featuredStation && (
              <FeaturedStation
                station={featuredStation}
                stationList={featuredStations}
              />
            )}

            {/* Netflix-style Carousels */}
            <section className="w-full">
              {categories
                .filter((c) => stationsByCategory[c.name]?.length)
                .map((category) => (
                  <Carousel
                    key={category.name}
                    title={category.name}
                    stations={stationsByCategory[category.name] || []}
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
