"use client";

import { useState, useEffect } from "react";
import { StationIcon } from "@/components/station-icon";
import { Play, Pause, Heart, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import {
  getFeaturedStations,
  getCategories,
  getStationsByCategory,
  searchStations,
} from "@/lib/api";
import { Station, Category } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MobileHome() {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [featuredStations, setFeaturedStations] = useState<Station[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stationsByCategory, setStationsByCategory] = useState<
    Record<string, Station[]>
  >({});
  const [recentlyPlayed, setRecentlyPlayed] = useState<Station[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // State for "Tümünü Gör" modal
  const [isShowAllOpen, setIsShowAllOpen] = useState(false);
  const [showAllData, setShowAllData] = useState<Station[]>([]);
  const [showAllTitle, setShowAllTitle] = useState("");
  const [showAllCategories, setShowAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured stations
        const featured = await getFeaturedStations("temp-user");
        setFeaturedStations(featured);

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

        // Simulate recently played stations
        setRecentlyPlayed(featured.slice(0, 5));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStations(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching stations:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleFavoriteToggle = async (station: Station) => {
    if (favorites.some((fav) => fav.stationName === station.stationName)) {
      await removeFavorite(station.stationName);
    } else {
      await addFavorite(station);
    }
  };

  const handleShowAll = (data: Station[], title: string) => {
    setShowAllData(data);
    setShowAllTitle(title);
    setShowAllCategories([]);
    setIsShowAllOpen(true);
  };

  const handleShowAllCategories = (data: Category[]) => {
    setShowAllCategories(data);
    setShowAllTitle("Kategoriler");
    setShowAllData([]);
    setIsShowAllOpen(true);
  };

  const handleCategoryClick = async (categoryName: string) => {
    try {
      // Fetch stations for the selected category
      const categoryStations = await getStationsByCategory(categoryName);
      handleShowAll(categoryStations, categoryName);
    } catch (error) {
      console.error(
        `Error fetching stations for category ${categoryName}:`,
        error
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black text-white relative">
      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm mobile-paddings">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Radyo istasyonu ara..."
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pb-24">
                {isSearching ? (
                  <div className="flex justify-center py-10">
                    <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold">Arama Sonuçları</h2>
                    {searchResults.map((station) => (
                      <motion.div
                        key={station.stationName}
                        className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          togglePlay(station, searchResults, "Arama Sonuçları");
                          setIsSearchOpen(false);
                        }}
                      >
                        <div className="relative mr-4">
                          <StationIcon
                            stationIconUrl={station.stationIconUrl}
                            stationName={station.stationName}
                            size="sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {station.stationName}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {station.stationCity}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(station);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.some(
                                (fav) => fav.stationName === station.stationName
                              )
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery.trim() !== "" ? (
                  <div className="text-center py-10">
                    <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Sonuç bulunamadı</p>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Search className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Aramak için bir şeyler yazın
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Show All Modal */}
      {isShowAllOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm mobile-paddings">
          <div className="flex flex-col h-full">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-800 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setIsShowAllOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <h2 className="text-lg font-bold">{showAllTitle}</h2>
            </div>

            {/* Show All Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 pb-24">
                {showAllCategories.length > 0 ? (
                  // Display categories
                  <div className="grid grid-cols-2 gap-4">
                    {showAllCategories.map((category, index) => (
                      <motion.div
                        key={category.name}
                        className="relative rounded-xl overflow-hidden h-24 cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          handleCategoryClick(category.name);
                          setIsShowAllOpen(false);
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80"></div>
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative h-full flex items-center justify-center">
                          <h3 className="text-lg font-bold text-white">
                            {category.name}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  // Display stations
                  <div className="space-y-3">
                    {showAllData.map((station) => (
                      <motion.div
                        key={station.stationName}
                        className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          togglePlay(station, showAllData, showAllTitle);
                          setIsShowAllOpen(false);
                        }}
                      >
                        <div className="relative mr-4">
                          <StationIcon
                            stationIconUrl={station.stationIconUrl}
                            stationName={station.stationName}
                            size="sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {station.stationName}
                          </h3>
                          <p className="text-sm text-gray-400 truncate">
                            {station.stationCity}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFavoriteToggle(station);
                          }}
                        >
                          <Heart
                            className={`h-4 w-4 ${
                              favorites.some(
                                (fav) => fav.stationName === station.stationName
                              )
                                ? "fill-red-500 text-red-500"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          {/* Greeting Section */}
          <div className="mt-4 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Merhaba 👋</h1>
              <p className="text-gray-400">Radyo keyfini çıkar</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Recently Played */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Son Çalınanlar</h2>
              <Link href="/library">
                <Button variant="ghost" className="text-sm text-blue-400">
                  Tümünü Gör
                </Button>
              </Link>
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-2">
              {recentlyPlayed.map((station) => (
                <motion.div
                  key={station.stationName}
                  className="flex-shrink-0 w-24 flex flex-col items-center"
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className="relative mb-2"
                    onClick={() =>
                      togglePlay(station, recentlyPlayed, "Son Çalınanlar")
                    }
                  >
                    <StationIcon
                      stationIconUrl={station.stationIconUrl}
                      stationName={station.stationName}
                      size="md"
                    />
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white text-black shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(station, recentlyPlayed, "Son Çalınanlar");
                      }}
                    >
                      {currentStation?.stationName === station.stationName &&
                      isPlaying ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <h3 className="text-xs font-medium text-center truncate w-full">
                    {station.stationName}
                  </h3>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Featured Stations */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Öne Çıkanlar</h2>
              <Button
                variant="ghost"
                className="text-sm text-blue-400"
                onClick={() => handleShowAll(featuredStations, "Öne Çıkanlar")}
              >
                Tümünü Gör
              </Button>
            </div>
            <div className="space-y-4">
              {featuredStations.slice(0, 3).map((station) => (
                <motion.div
                  key={station.stationName}
                  className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    togglePlay(station, featuredStations, "Öne Çıkanlar")
                  }
                >
                  <div className="relative mr-4">
                    <StationIcon
                      stationIconUrl={station.stationIconUrl}
                      stationName={station.stationName}
                      size="md"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {station.stationName}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {station.stationCity}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteToggle(station);
                    }}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favorites.some(
                          (fav) => fav.stationName === station.stationName
                        )
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                  <Button
                    size="icon"
                    className="ml-2 rounded-full bg-white text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay(station, featuredStations, "Öne Çıkanlar");
                    }}
                  >
                    {currentStation?.stationName === station.stationName &&
                    isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Kategoriler</h2>
              <Button
                variant="ghost"
                className="text-sm text-blue-400"
                onClick={() => handleShowAllCategories(categories)}
              >
                Tümünü Gör
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {categories.slice(0, 4).map((category, index) => (
                <motion.div
                  key={category.name}
                  className="relative rounded-xl overflow-hidden h-24 cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-80"></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <h3 className="text-lg font-bold text-white">
                      {category.name}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Stations by Category */}
          {Object.entries(stationsByCategory)
            .filter(([, stations]) => stations.length > 0)
            .map(([categoryName, stations]) => (
              <section key={categoryName} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">{categoryName}</h2>
                  <Button
                    variant="ghost"
                    className="text-sm text-blue-400"
                    onClick={() => handleShowAll(stations, categoryName)}
                  >
                    Tümünü Gör
                  </Button>
                </div>

                <div className="space-y-3">
                  {stations.slice(0, 3).map((station) => (
                    <motion.div
                      key={station.stationName}
                      className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        togglePlay(station, stations, categoryName)
                      }
                    >
                      <div className="relative mr-4">
                        <StationIcon
                          stationIconUrl={station.stationIconUrl}
                          stationName={station.stationName}
                          size="sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {station.stationName}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {station.stationCity}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(station);
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.some(
                              (fav) => fav.stationName === station.stationName
                            )
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}
