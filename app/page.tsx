'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Carousel } from '@/components/carousel';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock data for radio stations organized by categories
  const jazzStations = [
    { id: '1', name: 'Jazz FM', frequency: '88.5 FM', genre: 'Jazz' },
    { id: '7', name: 'Smooth Jazz', frequency: '89.3 FM', genre: 'Jazz' },
    { id: '8', name: 'Classic Jazz', frequency: '90.1 FM', genre: 'Jazz' },
    { id: '9', name: 'Bebop Radio', frequency: '91.7 FM', genre: 'Jazz' },
    { id: '10', name: 'Latin Jazz', frequency: '93.5 FM', genre: 'Jazz' },
    { id: '11', name: 'Jazz Classics', frequency: '94.9 FM', genre: 'Jazz' },
    { id: '12', name: 'Contemporary Jazz', frequency: '96.3 FM', genre: 'Jazz' },
    { id: '13', name: 'Jazz Fusion', frequency: '97.7 FM', genre: 'Jazz' },
  ];

  const rockStations = [
    { id: '2', name: 'Rock Radio', frequency: '92.3 FM', genre: 'Rock' },
    { id: '14', name: 'Classic Rock', frequency: '93.1 FM', genre: 'Rock' },
    { id: '15', name: 'Alternative Rock', frequency: '94.5 FM', genre: 'Rock' },
    { id: '16', name: 'Hard Rock', frequency: '95.9 FM', genre: 'Rock' },
    { id: '17', name: 'Indie Rock', frequency: '97.3 FM', genre: 'Rock' },
    { id: '18', name: 'Punk Rock', frequency: '98.7 FM', genre: 'Rock' },
    { id: '19', name: 'Metallica Radio', frequency: '99.5 FM', genre: 'Rock' },
    { id: '20', name: 'Grunge Revival', frequency: '100.3 FM', genre: 'Rock' },
  ];

  const electronicStations = [
    { id: '4', name: 'Electronic Waves', frequency: '98.1 FM', genre: 'Electronic' },
    { id: '21', name: 'House Music', frequency: '99.9 FM', genre: 'Electronic' },
    { id: '22', name: 'Techno Beats', frequency: '100.7 FM', genre: 'Electronic' },
    { id: '23', name: 'Trance Vibes', frequency: '101.1 FM', genre: 'Electronic' },
    { id: '24', name: 'Dubstep Nation', frequency: '102.5 FM', genre: 'Electronic' },
    { id: '25', name: 'Ambient Sounds', frequency: '103.3 FM', genre: 'Electronic' },
    { id: '26', name: 'Drum & Bass', frequency: '104.7 FM', genre: 'Electronic' },
    { id: '27', name: 'Synthwave', frequency: '105.5 FM', genre: 'Electronic' },
  ];

  const hipHopStations = [
    { id: '5', name: 'Hip Hop Nation', frequency: '101.5 FM', genre: 'Hip Hop' },
    { id: '28', name: 'Old School Hip Hop', frequency: '102.9 FM', genre: 'Hip Hop' },
    { id: '29', name: 'Trap Music', frequency: '103.7 FM', genre: 'Hip Hop' },
    { id: '30', name: 'Rap Classics', frequency: '104.3 FM', genre: 'Hip Hop' },
    { id: '31', name: 'Underground Hip Hop', frequency: '105.1 FM', genre: 'Hip Hop' },
    { id: '32', name: 'Boom Bap Radio', frequency: '106.5 FM', genre: 'Hip Hop' },
    { id: '33', name: 'West Coast Hip Hop', frequency: '107.3 FM', genre: 'Hip Hop' },
    { id: '34', name: 'East Coast Hip Hop', frequency: '108.7 FM', genre: 'Hip Hop' },
  ];

  const classicalStations = [
    { id: '3', name: 'Classical Music', frequency: '95.7 FM', genre: 'Classical' },
    { id: '35', name: 'Opera House', frequency: '96.5 FM', genre: 'Classical' },
    { id: '36', name: 'Baroque Collection', frequency: '97.9 FM', genre: 'Classical' },
    { id: '37', name: 'Symphony Radio', frequency: '98.9 FM', genre: 'Classical' },
    { id: '38', name: 'Chamber Music', frequency: '99.3 FM', genre: 'Classical' },
    { id: '39', name: 'Classical Piano', frequency: '100.1 FM', genre: 'Classical' },
    { id: '40', name: 'Modern Classical', frequency: '101.9 FM', genre: 'Classical' },
    { id: '41', name: 'Classical Guitar', frequency: '102.7 FM', genre: 'Classical' },
  ];

  const countryStations = [
    { id: '6', name: 'Country Roads', frequency: '103.9 FM', genre: 'Country' },
    { id: '42', name: 'Bluegrass Junction', frequency: '104.5 FM', genre: 'Country' },
    { id: '43', name: 'Country Classics', frequency: '105.3 FM', genre: 'Country' },
    { id: '44', name: 'Modern Country', frequency: '106.1 FM', genre: 'Country' },
    { id: '45', name: 'Outlaw Country', frequency: '106.9 FM', genre: 'Country' },
    { id: '46', name: 'Country Rock', frequency: '107.7 FM', genre: 'Country' },
    { id: '47', name: 'Texas Country', frequency: '108.3 FM', genre: 'Country' },
    { id: '48', name: 'Nashville Sound', frequency: '109.1 FM', genre: 'Country' },
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

  return (
    <div className="flex flex-col h-screen">
      {/* Top Bar for Mobile */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon">
          <Search className="h-6 w-6" />
        </Button>
      </header>

      {/* Top Bar for Desktop */}
      <header className="hidden items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:flex">
        <div></div>
        <div className="flex w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations..."
              className="w-full rounded-full bg-white/10 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-amber-500"></div>
        </div>
      </header>

      {/* Main Content Area - This should take remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 h-full">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
            {/* Hero Featured Station */}
            <section className="mb-8 h-40 overflow-hidden rounded-xl bg-hero-gradient p-6 shadow-lg md:h-40">
              <div className="flex h-full items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 md:h-24 md:w-24">
                  <div className="text-2xl font-bold">{featuredStation.name.charAt(0)}</div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold md:text-2xl">{featuredStation.name}</h2>
                  <p className="text-sm text-white/70 md:text-base">{featuredStation.frequency} • {featuredStation.genre}</p>
                  <Button className="mt-2 bg-primary-gradient text-white hover:opacity-90" size="sm">
                    Listen Now
                  </Button>
                </div>
              </div>
            </section>

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
      {currentStation && (
        <div 
          className="border-t border-gray-800 bg-black/20 backdrop-blur-md absolute bottom-0 left-0 right-0 z-20"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <div className="w-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <div className="text-lg font-bold">
                    {[
                      ...jazzStations,
                      ...rockStations,
                      ...electronicStations,
                      ...hipHopStations,
                      ...classicalStations,
                      ...countryStations
                    ].find((s) => s.id === currentStation)?.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {[
                      ...jazzStations,
                      ...rockStations,
                      ...electronicStations,
                      ...hipHopStations,
                      ...classicalStations,
                      ...countryStations
                    ].find((s) => s.id === currentStation)?.name}
                  </h3>
                  <p className="text-sm text-white/70">
                    {[
                      ...jazzStations,
                      ...rockStations,
                      ...electronicStations,
                      ...hipHopStations,
                      ...classicalStations,
                      ...countryStations
                    ].find((s) => s.id === currentStation)?.frequency}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="button-hero-hover">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  className="h-10 w-10 rounded-full bg-hero-gradient hover:opacity-90"
                  size="icon"
                  onClick={() => togglePlay(currentStation)}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="button-hero-hover">
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              <div className="hidden items-center space-x-2 md:flex">
                <Volume2 className="h-5 w-5" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden">
          <div className="absolute left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-md border-r border-gray-700 p-6">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl font-bold">RadioHead</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </Button>
            </div>
            <nav className="space-y-1">
              {[
                { name: "Home", href: "#" },
                { name: "Browse", href: "#" },
                { name: "Library", href: "#" },
                { name: "Favorites", href: "#" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block rounded-lg px-4 py-2 text-white hover:bg-white/10 transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h2 className="px-4 text-sm font-semibold text-gray-300 mb-2">
                Your Stations
              </h2>
              <ScrollArea className="h-48 w-full rounded-md">
                <div className="space-y-1 pr-2">
                  {[
                    "Jazz FM",
                    "Rock Radio",
                    "Classical Music",
                    "Electronic Waves",
                    "Hip Hop Nation",
                    "Country Roads",
                    "Jazz Classics",
                    "Rock Legends",
                  ].map((station) => (
                    <a
                      key={station}
                      href="#"
                      className="block rounded-lg px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      {station}
                    </a>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      )}

      {/* Audio element (hidden) */}
      <audio ref={audioRef} />
    </div>
  );
}