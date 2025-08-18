"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StationCard } from "@/components/station-grid/station-card";
import { Station } from "@/lib/types";

interface CarouselProps {
  title: string;
  stations: Station[];
}

export function Carousel({ title, stations }: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Check scroll position and update button states
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
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
        behavior: "smooth",
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
        behavior: "smooth",
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

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [stations]);

  // Don't render if no stations
  if (stations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 carousel-ring rounded-lg p-4">
      <h2 className="px-4 text-xl font-semibold md:px-0">{title}</h2>
      <div
        className="relative"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Left scroll button - hidden on mobile */}
        <Button
          variant="default"
          size="icon"
          className={`absolute left-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 -translate-x-1/2 rounded-full bg-hero-gradient backdrop-blur-md hover:opacity-90 md:flex shadow-lg border border-white/20 transition-opacity duration-300 ${
            isHovering && canScrollLeft ? "opacity-100" : "opacity-0 invisible"
          }`}
          onClick={scrollLeft}
          disabled={!canScrollLeft}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </Button>

        {/* Stations container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto px-4 pb-4 pt-4 scrollbar-hide"
          onScroll={handleScroll}
        >
          {stations.map((station) => (
            <div
              key={station.stationName}
              className="flex-shrink-0"
              style={{ width: "160px" }}
            >
              <StationCard
                station={station}
                stationList={stations}
                layout="vertical"
                source={title}
              />
            </div>
          ))}
        </div>

        {/* Right scroll button - hidden on mobile */}
        <Button
          variant="default"
          size="icon"
          className={`absolute right-0 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 translate-x-1/2 rounded-full bg-hero-gradient backdrop-blur-md hover:opacity-90 md:flex shadow-lg border border-white/20 transition-opacity duration-300 ${
            isHovering && canScrollRight ? "opacity-100" : "opacity-0 invisible"
          }`}
          onClick={scrollRight}
          disabled={!canScrollRight}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
