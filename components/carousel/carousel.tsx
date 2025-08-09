'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StationCard } from './station-card';
import { useAudio } from '@/contexts/AudioContext';

interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
}

interface CarouselProps {
  title: string;
  stations: Station[];
}

export function Carousel({ title, stations }: CarouselProps) {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Check scroll position and update button states
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };
  
  // Handle scroll events
  const handleScroll = () => {
    checkScrollButtons();
  };
  
  // Scroll left
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollTo({
        left: Math.max(0, container.scrollLeft - scrollAmount),
        behavior: 'smooth'
      });
    }
  };
  
  // Scroll right
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // Check scroll buttons on mount and resize
  useEffect(() => {
    // Initial check after render
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);
    
    const handleResize = () => {
      checkScrollButtons();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [stations]);

  // Create a wrapper function that passes the stations list
  const handlePlay = (station: Station) => {
    togglePlay(station, stations);
  };

  return (
    <div className="mb-8 carousel-ring rounded-lg p-4">
      <h2 className="mb-4 px-4 text-xl font-semibold md:px-0">{title}</h2>
      <div className="relative">
        {/* Left scroll button - hidden on mobile */}
        <Button
          variant="default"
          size="icon"
          className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-hero-gradient backdrop-blur-md hover:opacity-90 md:flex shadow-lg border border-white/20"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>
        
        {/* Stations container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto px-12 pb-4 pt-4 scrollbar-hide"
          onScroll={handleScroll}
        >
          {stations.map((station) => (
            <div key={station.stationName} className="flex-shrink-0">
              <StationCard
                station={station}
                onPlay={handlePlay}
                isPlaying={currentStation?.stationName === station.stationName && isPlaying}
                isActive={currentStation?.stationName === station.stationName}
              />
            </div>
          ))}
        </div>
        
        {/* Right scroll button - hidden on mobile */}
        <Button
          variant="default"
          size="icon"
          className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 rounded-full bg-hero-gradient backdrop-blur-md hover:opacity-90 md:flex shadow-lg border border-white/20"
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}