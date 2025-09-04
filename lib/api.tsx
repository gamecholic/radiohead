import categories from "@/lib/data/categories.json";
import radioGroups from "@/lib/data/radio-groups.json";
import radioStations from "@/lib/data/radio-stations.json";
import {
  RadioGroup,
  Category,
  Station,
  Playlist,
  HistoryItem,
} from "@/lib/types";
import {
  getUserFavorites as getFavorites,
  addUserFavorite,
  removeUserFavorite,
  isStationFavorite as checkStationFavorite,
  getUserPlaylists as getPlaylists,
  addUserPlaylist,
  updateUserPlaylist,
  removeUserPlaylist,
  getUserHistory as getHistory,
  addUserHistoryItem,
  clearUserHistory as clearHistory,
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
  const favorites = await getUserFavorites(userId);

  if (favorites.length >= 6) {
    return favorites.slice(0, 10);
  }
  // Get stations from the first category
  const firstCategoryStations = await getStationsByCategory(categories[0]);
  // Filter out stations already in favorites
  let additionalStations = firstCategoryStations.filter(
    (station: Station) =>
      !favorites.some((fav) => fav.stationName === station.stationName)
  );

  // Shuffle additionalStations
  additionalStations = additionalStations
    .map((station) => ({ station, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ station }) => station);

  // Combine favorites and additional stations to ensure at least 6
  const combined = [...favorites, ...additionalStations].slice(0, 6);

  return combined;
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

// Playlist functions
export const getUserPlaylists = async (userId: string): Promise<Playlist[]> => {
  "use client";

  return getPlaylists<Playlist>(userId);
};

export const createPlaylist = async (
  userId: string,
  name: string,
  stations: Station[] = []
): Promise<Playlist> => {
  "use client";

  const newPlaylist: Playlist = {
    id: Date.now().toString(), // Simple ID generation
    name,
    stations,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  addUserPlaylist<Playlist>(userId, newPlaylist);
  return newPlaylist;
};

export const updatePlaylist = async (
  userId: string,
  playlistId: string,
  name?: string,
  stations?: Station[]
): Promise<void> => {
  "use client";

  const playlists = await getUserPlaylists(userId);
  const playlist = playlists.find((p) => p.id === playlistId);

  if (playlist) {
    const updatedPlaylist: Playlist = {
      ...playlist,
      name: name ?? playlist.name,
      stations: stations ?? playlist.stations,
      updatedAt: Date.now(),
    };

    updateUserPlaylist<Playlist>(userId, playlistId, updatedPlaylist);
  }
};

export const deletePlaylist = async (
  userId: string,
  playlistId: string
): Promise<void> => {
  "use client";

  removeUserPlaylist<Playlist>(userId, playlistId);
};

export const addStationToPlaylist = async (
  userId: string,
  playlistId: string,
  station: Station
): Promise<void> => {
  "use client";

  const playlists = await getUserPlaylists(userId);
  const playlist = playlists.find((p) => p.id === playlistId);

  if (playlist) {
    // Check if station is already in playlist
    const isAlreadyInPlaylist = playlist.stations.some(
      (s) => s.stationName === station.stationName
    );

    if (!isAlreadyInPlaylist) {
      const updatedStations = [...playlist.stations, station];
      await updatePlaylist(userId, playlistId, undefined, updatedStations);
    }
  }
};

export const removeStationFromPlaylist = async (
  userId: string,
  playlistId: string,
  stationName: string
): Promise<void> => {
  "use client";

  const playlists = await getUserPlaylists(userId);
  const playlist = playlists.find((p) => p.id === playlistId);

  if (playlist) {
    const updatedStations = playlist.stations.filter(
      (s) => s.stationName !== stationName
    );
    await updatePlaylist(userId, playlistId, undefined, updatedStations);
  }
};

// History functions
export const getUserHistory = async (
  userId: string
): Promise<HistoryItem[]> => {
  "use client";

  return getHistory<HistoryItem>(userId);
};

export const getRecentStations = async (
  userId: string,
  limit: number = 15
): Promise<Station[]> => {
  "use client";

  const history = await getUserHistory(userId);
  // Sort by playedAt descending (newest first) and take only the specified limit
  const recentHistory = [...history]
    .sort((a, b) => b.playedAt - a.playedAt)
    .slice(0, limit);
  // Extract unique stations (by stationName) to avoid duplicates
  const uniqueStations: Station[] = [];
  const stationNames = new Set<string>();

  for (const item of recentHistory) {
    if (!stationNames.has(item.station.stationName)) {
      stationNames.add(item.station.stationName);
      uniqueStations.push(item.station);
    }
  }

  return uniqueStations;
};

export const addStationToHistory = async (
  userId: string,
  station: Station
): Promise<void> => {
  "use client";

  try {
    // Get existing history
    const existingHistory = await getUserHistory(userId);
    
    // Check if station already exists in history
    const existingIndex = existingHistory.findIndex(
      (item) => item.station.stationName === station.stationName
    );
    
    let updatedHistory: HistoryItem[];
    
    if (existingIndex !== -1) {
      // If station exists, remove it from its current position
      const historyWithoutStation = existingHistory.filter(
        (_, index) => index !== existingIndex
      );
      // Add it to the beginning (most recent)
      updatedHistory = [
        { station, playedAt: Date.now() },
        ...historyWithoutStation
      ];
    } else {
      // If station doesn't exist, add it to the beginning
      updatedHistory = [
        { station, playedAt: Date.now() },
        ...existingHistory
      ];
    }
    
    // Keep only the last 30 items
    updatedHistory = updatedHistory.slice(0, 30);
    
    // Save updated history
    const historyKey = `history_${userId}`;
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to add station to history:", error);
    throw error;
  }
};

export const clearUserHistory = async (userId: string): Promise<void> => {
  "use client";

  clearHistory(userId);
};
