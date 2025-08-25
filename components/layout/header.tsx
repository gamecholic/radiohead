"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchStations } from "@/lib/api";
import { Station } from "@/lib/types";
import { useAudio } from "@/contexts/AudioContext";
import { StationIcon } from "@/components/station-icon";

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { togglePlay } = useAudio();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await searchStations(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleStationSelect = (station: Station) => {
    // Start playing the selected station immediately
    togglePlay(station, [station], "Arama sonucu");
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div ref={searchContainerRef} className="relative">
      {/* Top Bar for Mobile */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:hidden">
        <Button variant="ghost" size="icon" onClick={onMobileMenuOpen}>
          <Menu className="!h-6 !w-6" />
        </Button>
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8">
            <Image
              src="/icons/icon-192x192.png"
              alt="RadioHead Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-white">RadioHead</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="!h-6 !w-6" />
        </Button>
      </header>

      {/* Top Bar for Desktop */}
      <header className="hidden items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:flex">
        <div className="w-8"></div>
        <div className="flex w-1/3 relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="İstasyon, kategori ya da grup ara..."
              className="w-full rounded-full bg-white/10 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring/30 border-transparent focus:border-accent"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-amber-500"></div>
        </div>
      </header>

      {/* Search Overlay for Mobile */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsSearchOpen(false)}
          style={{
            top: "env(safe-area-inset-top)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 bg-black/90 border-b border-gray-800 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10"
                onClick={() => setIsSearchOpen(false)}
              >
                <Menu width="28" height="28" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="İstasyon, kategori ya da grup ara..."
                  className="w-full rounded-full bg-white/10 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:ring-offset-0 border-transparent focus:border-pink-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="mt-8 max-h-[70vh]">
                <ScrollArea className="h-[70vh] w-full rounded-md">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-400">
                      Aranıyor...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((station) => (
                        <div
                          key={station.stationName}
                          className="flex items-center gap-3 rounded-lg px-4 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={() => handleStationSelect(station)}
                        >
                          <StationIcon
                            stationIconUrl={station.stationIconUrl}
                            stationName={station.stationName}
                            size="xs"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {station.stationName}
                            </div>
                            <div className="flex items-center gap-2">
                              {station.stationCity && (
                                <div className="text-sm text-gray-400 truncate">
                                  {station.stationCity}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">
                      İstasyon bulunamadı
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Search Results Dropdown */}
      {isSearchOpen && searchQuery && (
        <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 w-1/3 z-50 mt-1">
          <div className="bg-black/90 border border-gray-800 rounded-lg shadow-lg max-h-96">
            <ScrollArea className="h-96 w-full">
              {isLoading ? (
                <div className="p-4 text-center text-gray-400">Aranıyor...</div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((station) => (
                    <div
                      key={station.stationName}
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => handleStationSelect(station)}
                    >
                      <StationIcon
                        stationIconUrl={station.stationIconUrl}
                        stationName={station.stationName}
                        size="xs"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {station.stationName}
                        </div>
                        <div className="flex items-center gap-2">
                          {station.stationCity && (
                            <div className="text-sm text-gray-400 truncate">
                              {station.stationCity}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  İstasyon bulunamadı
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
}
