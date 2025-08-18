import categories from "@/lib/data/categories.json";
import radioGroups from "@/lib/data/radio-groups.json";
import radioStations from "@/lib/data/radio-stations.json";
import { RadioGroup, Category, Station } from "@/lib/types";
import {
  getUserFavorites as getFavorites,
  addUserFavorite,
  removeUserFavorite,
  isStationFavorite as checkStationFavorite,
} from "@/lib/localStorageHandler";

// Filter out stations without playback URLs
const validStations = radioStations.filter(
  (station: Station) =>
    station.stationPlaybackUrl && station.stationPlaybackUrl !== ""
);

export const getCategories = async (): Promise<Category[]> => {
  return categories.map((name: string) => ({ name }));
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
): Promise<Station[]> => {
  // Return the first 10 stations as featured
  return (await getUserFavorites(userId)).length
    ? (await getUserFavorites(userId)).slice(0, 10)
    : getStationsByCategory(categories[0]);
};

export const getStationsByCategory = async (
  category: string
): Promise<Station[]> => {
  return validStations.filter((station: Station) =>
    station.stationCategories.includes(category)
  );
};

export const getStationsByGroup = async (
  groupName: string
): Promise<Station[]> => {
  return validStations.filter((station: Station) =>
    station.radioGroups.some((group: string) => group === groupName)
  );
};

export const getUserFavorites = async (userId: string): Promise<Station[]> => {
  "use client";

  return getFavorites<Station>(userId);
};

export const addStationToFavorites = async (
  userId: string,
  station: Station
): Promise<void> => {
  "use client";

  addUserFavorite<Station>(userId, station);
};

export const removeStationFromFavorites = async (
  userId: string,
  stationName: string
): Promise<void> => {
  "use client";

  removeUserFavorite<Station>(userId, stationName);
};

export const isStationFavorite = async (
  userId: string,
  stationName: string
): Promise<boolean> => {
  "use client";

  return checkStationFavorite<Station>(userId, stationName);
};

export const searchStations = async (query: string): Promise<Station[]> => {
  if (!query.trim()) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  return validStations.filter(
    (station: Station) =>
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
