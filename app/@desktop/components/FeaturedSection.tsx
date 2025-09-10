"use client";

import { useState, useEffect } from "react";
import { FeaturedStation } from "@/components/layout";
import { FeaturedStationsGrid } from "@/components/featured-stations-grid";
import { getFeaturedStations } from "@/lib/api";
import { Station } from "@/lib/types";

export function FeaturedSection() {
  const [featuredStations, setFeaturedStations] = useState<Station[]>([]);
  const [featuredStation, setFeaturedStation] = useState<Station | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch featured stations separately
  useEffect(() => {
    const fetchFeaturedStations = async () => {
      try {
        setLoading(true);
        const featured = await getFeaturedStations("temp-user");
        // Pick a random featured station
        let randomStation: Station | null = null;
        if (featured.length > 0) {
          randomStation = featured[Math.floor(Math.random() * featured.length)];
          setFeaturedStation(randomStation);
        }

        // Remove the featured station from the rest of the list
        setFeaturedStations(
          randomStation
            ? featured.filter(
                (station) => station.stationName !== randomStation.stationName
              )
            : featured
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching featured stations:", error);
        setLoading(false);
      }
    };

    fetchFeaturedStations();
  }, []);

  // Skeleton loader for featured station
  const FeaturedStationSkeleton = () => (
    <section className="mb-8 overflow-hidden rounded-2xl bg-hero-gradient p-6 shadow-lg border border-white/5 animate-pulse">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
        {/* Station Icon with glow effect */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-10"></div>
          <div className="relative w-24 h-24 rounded-xl bg-gray-700"></div>
        </div>

        {/* Station Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="h-8 md:h-10 w-48 md:w-64 bg-gray-700 rounded mx-auto md:mx-0"></div>
            <div className="h-5 w-5 bg-gray-700 rounded-full"></div>
          </div>

          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
            <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
            <div className="h-5 w-20 bg-gray-700 rounded-full"></div>
          </div>

          <div className="mt-3 h-4 w-64 md:w-96 bg-gray-700 rounded mx-auto md:mx-0"></div>
        </div>

        {/* Action Buttons */}
        <div className="h-10 w-32 md:w-40 bg-gray-700 rounded"></div>
      </div>
    </section>
  );

  // Skeleton loader for featured stations grid
  const FeaturedStationsGridSkeleton = () => (
    <section className="mb-12 rounded-2xl bg-featured-grid-gradient p-6 border border-white/5 backdrop-blur-sm animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 w-48 bg-gray-700 rounded"></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="relative rounded-xl bg-white/2 p-4 backdrop-blur-sm border border-white/5"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-700 mx-auto mb-3"></div>
            <div className="text-center">
              <div className="h-4 w-20 bg-gray-700 rounded mx-auto mb-1"></div>
              <div className="h-3 w-16 bg-gray-700 rounded mx-auto"></div>
            </div>

            {/* Favorite indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full"></div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="transition-all duration-300 ease-in-out min-h-[520px] flex flex-col justify-center">
      {/* Hero Featured Station */}
      <div className="transition-all duration-300 ease-in-out">
        {loading ? (
          <FeaturedStationSkeleton />
        ) : (
          featuredStation && (
            <FeaturedStation
              station={featuredStation}
              stationList={featuredStations}
            />
          )
        )}
      </div>

      {/* Featured Stations Grid */}
      <div className="transition-all duration-300 ease-in-out">
        {loading ? (
          <FeaturedStationsGridSkeleton />
        ) : (
          featuredStations.length > 0 && (
            <FeaturedStationsGrid stations={featuredStations} />
          )
        )}
      </div>
    </div>
  );
}
