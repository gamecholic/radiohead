"use client";

import { useState, useEffect } from "react";
import { Carousel } from "@/components/carousel";
import { 
  getRecommendedStations, 
  getStationsByMood, 
  getTopStations, 
  getRandomStations 
} from "@/lib/api";
import { Station } from "@/lib/types";

interface BrowseSectionProps {
  sectionType: "recommended" | "mood" | "top" | "random";
  mood?: string;
  userId: string;
}

export function BrowseSection({ sectionType, mood, userId }: BrowseSectionProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let fetchedStations: Station[] = [];
        
        switch (sectionType) {
          case "recommended":
            fetchedStations = await getRecommendedStations(userId);
            break;
          case "mood":
            if (mood) {
              fetchedStations = await getStationsByMood(mood);
            }
            break;
          case "top":
            fetchedStations = await getTopStations();
            break;
          case "random":
            fetchedStations = await getRandomStations(15);
            break;
          default:
            fetchedStations = [];
        }
        
        setStations(fetchedStations);
      } catch (err) {
        console.error(`Error fetching ${sectionType} stations:`, err);
        setError("Stations could not be loaded");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [sectionType, mood, userId]);

  // Don't render if no stations and not loading
  if (!loading && stations.length === 0 && !error) {
    return null;
  }

  // Determine section title
  let title = "";
  switch (sectionType) {
    case "recommended":
      title = "Sizin İçin Önerilenler";
      break;
    case "mood":
      title = mood || "Mood";
      break;
    case "top":
      title = "En Popüler";
      break;
    case "random":
      title = "Yeni Keşfet";
      break;
    default:
      title = "Stations";
  }

  // Skeleton loader
  if (loading) {
    return (
      <div className="mb-8 carousel-ring rounded-lg p-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-700 rounded mb-4"></div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 pt-4 scrollbar-hide">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0" style={{ width: "160px" }}>
              <div className="relative flex flex-col rounded-xl p-3 backdrop-blur-md bg-white/5">
                <div className="relative mb-3 aspect-square w-full flex items-center justify-center rounded-lg bg-gray-700">
                  <div className="h-24 w-24 rounded-xl bg-gray-600" />
                </div>
                <div className="flex-1 overflow-hidden text-center">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mb-8 carousel-ring rounded-lg p-4">
        <h2 className="px-4 text-xl font-semibold md:px-0">{title}</h2>
        <div className="text-red-400 p-4 text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <Carousel 
      title={title} 
      stations={stations} 
    />
  );
}