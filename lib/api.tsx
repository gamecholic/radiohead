import categories from "@/lib/data/categories.json";
import radioGroups from "@/lib/data/radio-groups.json";
import radioStations from "@/lib/data/radio-stations.json";
import { RadioGroup, RadioStation } from "@/lib/types";
import {
  getUserFavorites as getFavorites,
  addUserFavorite,
  removeUserFavorite,
  isStationFavorite as checkStationFavorite,
  getUserPlaylists as getPlaylists,
  addUserPlaylist as createPlaylist,
  removeUserPlaylist as deletePlaylist,
  addStationToPlaylist as addStationToUserPlaylist,
  removeStationFromPlaylist as removeStationFromUserPlaylist,
  isStationInPlaylist as checkStationInPlaylist,
  Playlist
} from '@/lib/localStorageHandler';
import { RadioStation } from "@/lib/types";

// Filter out stations without playback URLs
const validStations = radioStations.filter(
  (station: RadioStation) => station.stationPlaybackUrl && station.stationPlaybackUrl !== ""
);

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
  return validStations.filter((station: RadioStation) =>
    station.stationCategories.includes(category)
  );
};

export const getStationsByGroup = async (
  groupName: string
): Promise<RadioStation[]> => {
  return validStations.filter((station: RadioStation) =>
    station.radioGroups.some((group: string) => group === groupName)
  );
};

export const getUserFavorites = async (
  userId: string
): Promise<RadioStation[]> => {
  "use client";

  return getFavorites<RadioStation>(userId);
};

export const addStationToFavorites = async (
  userId: string,
  station: RadioStation
): Promise<void> => {
  "use client";

  addUserFavorite<RadioStation>(userId, station);
};

export const removeStationFromFavorites = async (
  userId: string,
  stationName: string
): Promise<void> => {
  "use client";

  removeUserFavorite<RadioStation>(userId, stationName);
};

export const isStationFavorite = async (
  userId: string,
  stationName: string
): Promise<boolean> => {
  "use client";

  return checkStationFavorite<RadioStation>(userId, stationName);
};

export const searchStations = async (
  query: string
): Promise<RadioStation[]> => {
  if (!query.trim()) {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return validStations.filter((station: RadioStation) => 
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

// Playlist functions
export const getUserPlaylists = async (
  userId: string
): Promise<Playlist<RadioStation>[]> => {
  "use client";

  return getPlaylists<RadioStation>(userId);
};

export const addUserPlaylist = async (
  userId: string,
  playlistName: string
): Promise<Playlist<RadioStation>> => {
  "use client";

  return createPlaylist<RadioStation>(userId, playlistName);
};

export const removeUserPlaylist = async (
  userId: string,
  playlistId: string
): Promise<void> => {
  "use client";

  deletePlaylist<RadioStation>(userId, playlistId);
};

export const addStationToPlaylist = async (
  userId: string,
  playlistId: string,
  station: RadioStation
): Promise<Playlist<RadioStation> | null> => {
  "use client";

  return addStationToUserPlaylist<RadioStation>(userId, playlistId, station);
};

export const removeStationFromPlaylist = async (
  userId: string,
  playlistId: string,
  stationName: string
): Promise<void> => {
  "use client";

  removeStationFromUserPlaylist<RadioStation>(userId, playlistId, stationName);
};

export const isStationInPlaylist = async (
  userId: string,
  playlistId: string,
  stationName: string
): Promise<boolean> => {
  "use client";

  return checkStationInPlaylist<RadioStation>(userId, playlistId, stationName);
};
