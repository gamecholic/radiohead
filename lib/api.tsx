import categories from "@/lib/data/categories.json";
import radioGroups from "@/lib/data/radio-groups.json";
import radioStations from "@/lib/data/radio-stations.json";
import { RadioGroup, RadioStation } from "@/lib/types";

export const getCategories = async (): Promise<string[]> => {
  return categories;
};

export const getRadioGroups = async (): Promise<string[]> => {
  // Return just the group names for backward compatibility
  return radioGroups.map((group: RadioGroup) => group.groupName);
};

export const getRadioGroupsWithSlugs = async (): Promise<RadioGroup[]> => {
  return radioGroups;
};

export const getFeaturedStations = async (
  userId: string
): Promise<RadioStation[]> => {
  // Return the first 10 stations as featured
  return (await getUserFavorites(userId)).length
    ? (await getUserFavorites(userId)).slice(0, 10)
    : getStationsByCategory(categories[0]);
};

export const getStationsByCategory = async (
  category: string
): Promise<RadioStation[]> => {
  return radioStations.filter((station: RadioStation) =>
    station.stationCategories.includes(category)
  );
};

export const getStationsByGroup = async (
  groupName: string
): Promise<RadioStation[]> => {
  return radioStations.filter((station: RadioStation) =>
    station.radioGroups.some((group: string) => group === groupName)
  );
};

export const getUserFavorites = async (
  userId: string
): Promise<RadioStation[]> => {
  "use client";

  // currently, use the local storage
  if (typeof window !== "undefined") {
    const favorites = localStorage.getItem(
      `favorites_${userId ?? "temp-user"}`
    );
    return favorites ? JSON.parse(favorites) : [];
  }
  return [];
};

export const addStationToFavorites = async (
  userId: string,
  station: RadioStation
): Promise<void> => {
  "use client";

  if (typeof window !== "undefined") {
    const favorites = localStorage.getItem(
      `favorites_${userId ?? "temp-user"}`
    );
    const updatedFavorites = favorites ? JSON.parse(favorites) : [];
    
    // Check if station is already in favorites
    const isAlreadyFavorite = updatedFavorites.some(
      (fav: RadioStation) => fav.stationName === station.stationName
    );
    
    // Only add if not already in favorites
    if (!isAlreadyFavorite) {
      updatedFavorites.push(station);
      localStorage.setItem(
        `favorites_${userId ?? "temp-user"}`,
        JSON.stringify(updatedFavorites)
      );
    }
  }
};

export const removeStationFromFavorites = async (
  userId: string,
  stationName: string
): Promise<void> => {
  "use client";

  if (typeof window !== "undefined") {
    const favorites = localStorage.getItem(
      `favorites_${userId ?? "temp-user"}`
    );
    if (favorites) {
      const updatedFavorites = JSON.parse(favorites).filter(
        (station: RadioStation) => station.stationName !== stationName
      );
      localStorage.setItem(
        `favorites_${userId ?? "temp-user"}`,
        JSON.stringify(updatedFavorites)
      );
    }
  }
};

export const isStationFavorite = async (
  userId: string,
  stationName: string
): Promise<boolean> => {
  "use client";

  if (typeof window !== "undefined") {
    const favorites = localStorage.getItem(
      `favorites_${userId ?? "temp-user"}`
    );
    if (favorites) {
      return JSON.parse(favorites).some(
        (station: RadioStation) => station.stationName === stationName
      );
    }
  }
  return false;
};

export const searchStations = async (
  query: string
): Promise<RadioStation[]> => {
  if (!query.trim()) {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return radioStations.filter((station: RadioStation) => 
    station.stationName.toLowerCase().includes(normalizedQuery) ||
    station.stationCity?.toLowerCase().includes(normalizedQuery) ||
    station.radioGroups.some((group: string) => 
      group.toLowerCase().includes(normalizedQuery)
    ) ||
    station.stationCategories.some((category: string) => 
      category.toLowerCase().includes(normalizedQuery)
    )
  );
};
