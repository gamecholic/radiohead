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

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock data for radio stations organized by categories
  const jazzStations = [
    { id: "1", name: "Jazz FM", frequency: "88.5 FM", genre: "Jazz" },
    { id: "7", name: "Smooth Jazz", frequency: "89.3 FM", genre: "Jazz" },
    { id: "8", name: "Classic Jazz", frequency: "90.1 FM", genre: "Jazz" },
    { id: "9", name: "Bebop Radio", frequency: "91.7 FM", genre: "Jazz" },
    { id: "10", name: "Latin Jazz", frequency: "93.5 FM", genre: "Jazz" },
    { id: "11", name: "Jazz Classics", frequency: "94.9 FM", genre: "Jazz" },
    {
      id: "12",
      name: "Contemporary Jazz",
      frequency: "96.3 FM",
      genre: "Jazz",
    },
    { id: "13", name: "Jazz Fusion", frequency: "97.7 FM", genre: "Jazz" },
  ];

  const rockStations = [
    { id: "2", name: "Rock Radio", frequency: "92.3 FM", genre: "Rock" },
    { id: "14", name: "Classic Rock", frequency: "93.1 FM", genre: "Rock" },
    { id: "15", name: "Alternative Rock", frequency: "94.5 FM", genre: "Rock" },
    { id: "16", name: "Hard Rock", frequency: "95.9 FM", genre: "Rock" },
    { id: "17", name: "Indie Rock", frequency: "97.3 FM", genre: "Rock" },
    { id: "18", name: "Punk Rock", frequency: "98.7 FM", genre: "Rock" },
    { id: "19", name: "Metallica Radio", frequency: "99.5 FM", genre: "Rock" },
    { id: "20", name: "Grunge Revival", frequency: "100.3 FM", genre: "Rock" },
  ];

  const electronicStations = [
    {
      id: "4",
      name: "Electronic Waves",
      frequency: "98.1 FM",
      genre: "Electronic",
    },
    {
      id: "21",
      name: "House Music",
      frequency: "99.9 FM",
      genre: "Electronic",
    },
    {
      id: "22",
      name: "Techno Beats",
      frequency: "100.7 FM",
      genre: "Electronic",
    },
    {
      id: "23",
      name: "Trance Vibes",
      frequency: "101.1 FM",
      genre: "Electronic",
    },
    {
      id: "24",
      name: "Dubstep Nation",
      frequency: "102.5 FM",
      genre: "Electronic",
    },
    {
      id: "25",
      name: "Ambient Sounds",
      frequency: "103.3 FM",
      genre: "Electronic",
    },
    {
      id: "26",
      name: "Drum & Bass",
      frequency: "104.7 FM",
      genre: "Electronic",
    },
    { id: "27", name: "Synthwave", frequency: "105.5 FM", genre: "Electronic" },
  ];

  const hipHopStations = [
    {
      id: "5",
      name: "Hip Hop Nation",
      frequency: "101.5 FM",
      genre: "Hip Hop",
    },
    {
      id: "28",
      name: "Old School Hip Hop",
      frequency: "102.9 FM",
      genre: "Hip Hop",
    },
    { id: "29", name: "Trap Music", frequency: "103.7 FM", genre: "Hip Hop" },
    { id: "30", name: "Rap Classics", frequency: "104.3 FM", genre: "Hip Hop" },
    {
      id: "31",
      name: "Underground Hip Hop",
      frequency: "105.1 FM",
      genre: "Hip Hop",
    },
    {
      id: "32",
      name: "Boom Bap Radio",
      frequency: "106.5 FM",
      genre: "Hip Hop",
    },
    {
      id: "33",
      name: "West Coast Hip Hop",
      frequency: "107.3 FM",
      genre: "Hip Hop",
    },
    {
      id: "34",
      name: "East Coast Hip Hop",
      frequency: "108.7 FM",
      genre: "Hip Hop",
    },
  ];

  const classicalStations = [
    {
      id: "3",
      name: "Classical Music",
      frequency: "95.7 FM",
      genre: "Classical",
    },
    { id: "35", name: "Opera House", frequency: "96.5 FM", genre: "Classical" },
    {
      id: "36",
      name: "Baroque Collection",
      frequency: "97.9 FM",
      genre: "Classical",
    },
    {
      id: "37",
      name: "Symphony Radio",
      frequency: "98.9 FM",
      genre: "Classical",
    },
    {
      id: "38",
      name: "Chamber Music",
      frequency: "99.3 FM",
      genre: "Classical",
    },
    {
      id: "39",
      name: "Classical Piano",
      frequency: "100.1 FM",
      genre: "Classical",
    },
    {
      id: "40",
      name: "Modern Classical",
      frequency: "101.9 FM",
      genre: "Classical",
    },
    {
      id: "41",
      name: "Classical Guitar",
      frequency: "102.7 FM",
      genre: "Classical",
    },
  ];

  const countryStations = [
    { id: "6", name: "Country Roads", frequency: "103.9 FM", genre: "Country" },
    {
      id: "42",
      name: "Bluegrass Junction",
      frequency: "104.5 FM",
      genre: "Country",
    },
    {
      id: "43",
      name: "Country Classics",
      frequency: "105.3 FM",
      genre: "Country",
    },
    {
      id: "44",
      name: "Modern Country",
      frequency: "106.1 FM",
      genre: "Country",
    },
    {
      id: "45",
      name: "Outlaw Country",
      frequency: "106.9 FM",
      genre: "Country",
    },
    { id: "46", name: "Country Rock", frequency: "107.7 FM", genre: "Country" },
    {
      id: "47",
      name: "Texas Country",
      frequency: "108.3 FM",
      genre: "Country",
    },
    {
      id: "48",
      name: "Nashville Sound",
      frequency: "109.1 FM",
      genre: "Country",
    },
  ];

  const featuredStation = jazzStations[0]; // Jazz FM as featured station

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
      togglePlay(featuredStation.id);
    }
  };

  const getStationById = (id: string) => {
    const allStations = [
      ...jazzStations,
      ...rockStations,
      ...electronicStations,
      ...hipHopStations,
      ...classicalStations,
      ...countryStations,
    ];
    return allStations.find((station) => station.id === id) || null;
  };

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
              <Carousel
                title="Jazz Stations"
                stations={jazzStations}
                onPlay={togglePlay}
                currentStation={currentStation}
                isPlaying={isPlaying}
              />

              <Carousel
                title="Rock Stations"
                stations={rockStations}
                onPlay={togglePlay}
                currentStation={currentStation}
                isPlaying={isPlaying}
              />

              <Carousel
                title="Electronic Music"
                stations={electronicStations}
                onPlay={togglePlay}
                currentStation={currentStation}
                isPlaying={isPlaying}
              />

              <Carousel
                title="Hip Hop Stations"
                stations={hipHopStations}
                onPlay={togglePlay}
                currentStation={currentStation}
                isPlaying={isPlaying}
              />

              <Carousel
                title="Classical Music"
                stations={classicalStations}
                onPlay={togglePlay}
                currentStation={currentStation}
                isPlaying={isPlaying}
              />

              <Carousel
                title="Country Roads"
                stations={countryStations}
                onPlay={togglePlay}
                currentStation={currentStation}
                isPlaying={isPlaying}
              />
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
