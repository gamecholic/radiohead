// localStorageHandler.ts - Centralized localStorage operations

// Keys used in the application
const STORAGE_KEYS = {
  VOLUME: 'radiohead-volume',
  CURRENT_STATION: 'radiohead-current-station',
  STATION_LIST: 'radiohead-station-list',
  STATION_LIST_SOURCE: 'radiohead-station-list-source',
  USER_FAVORITES: (userId: string) => `favorites_${userId ?? "temp-user"}`,
  USER_PLAYLISTS: (userId: string) => `playlists_${userId ?? "temp-user"}`
} as const;

// Generic functions for localStorage operations
const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage item for key ${key}:`, error);
    localStorage.removeItem(key);
    return defaultValue;
  }
};

const setToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage item for key ${key}:`, error);
  }
};

const removeFromLocalStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

// Volume operations
export const getSavedVolume = (): number => {
  return getFromLocalStorage<number>(STORAGE_KEYS.VOLUME, 80);
};

export const saveVolume = (volume: number): void => {
  setToLocalStorage<number>(STORAGE_KEYS.VOLUME, volume);
};

// Station operations
export const getSavedCurrentStation = <T>(): T | null => {
  return getFromLocalStorage<T | null>(STORAGE_KEYS.CURRENT_STATION, null);
};

export const saveCurrentStation = <T>(station: T | null): void => {
  if (station) {
    setToLocalStorage<T>(STORAGE_KEYS.CURRENT_STATION, station);
  } else {
    removeFromLocalStorage(STORAGE_KEYS.CURRENT_STATION);
  }
};

export const getSavedStationList = <T>(): T[] => {
  return getFromLocalStorage<T[]>(STORAGE_KEYS.STATION_LIST, []);
};

export const saveStationList = <T>(stationList: T[]): void => {
  if (stationList.length > 0) {
    setToLocalStorage<T[]>(STORAGE_KEYS.STATION_LIST, stationList);
  } else {
    removeFromLocalStorage(STORAGE_KEYS.STATION_LIST);
  }
};

export const getSavedStationListSource = (): string | null => {
  return getFromLocalStorage<string | null>(STORAGE_KEYS.STATION_LIST_SOURCE, null);
};

export const saveStationListSource = (source: string | null): void => {
  if (source) {
    setToLocalStorage<string>(STORAGE_KEYS.STATION_LIST_SOURCE, source);
  } else {
    removeFromLocalStorage(STORAGE_KEYS.STATION_LIST_SOURCE);
  }
};

// Favorites operations
export const getUserFavorites = <T>(userId: string): T[] => {
  return getFromLocalStorage<T[]>(STORAGE_KEYS.USER_FAVORITES(userId), []);
};

export const addUserFavorite = <T>(userId: string, station: T): void => {
  const favorites = getUserFavorites<T>(userId);
  
  // Check if station is already in favorites
  // We need to cast to unknown first to satisfy TypeScript
  const isAlreadyFavorite = favorites.some((fav) => 
    (fav as unknown as { stationName: string }).stationName === (station as unknown as { stationName: string }).stationName
  );
  
  // Only add if not already in favorites
  if (!isAlreadyFavorite) {
    const updatedFavorites = [...favorites, station];
    setToLocalStorage<T[]>(STORAGE_KEYS.USER_FAVORITES(userId), updatedFavorites);
  }
};

export const removeUserFavorite = <T>(userId: string, stationName: string): void => {
  const favorites = getUserFavorites<T>(userId);
  // We need to cast to unknown first to satisfy TypeScript
  const updatedFavorites = favorites.filter((station) => 
    (station as unknown as { stationName: string }).stationName !== stationName
  );
  setToLocalStorage<T[]>(STORAGE_KEYS.USER_FAVORITES(userId), updatedFavorites);
};

export const isStationFavorite = <T>(userId: string, stationName: string): boolean => {
  const favorites = getUserFavorites<T>(userId);
  // We need to cast to unknown first to satisfy TypeScript
  return favorites.some((station) => 
    (station as unknown as { stationName: string }).stationName === stationName
  );
};

// Playlist operations
export interface Playlist<T> {
  id: string;
  name: string;
  stations: T[];
  createdAt: number;
  updatedAt: number;
}

export const getUserPlaylists = <T>(userId: string): Playlist<T>[] => {
  return getFromLocalStorage<Playlist<T>[]>(STORAGE_KEYS.USER_PLAYLISTS(userId), []);
};

export const addUserPlaylist = <T>(userId: string, playlistName: string): Playlist<T> => {
  const playlists = getUserPlaylists<T>(userId);
  const newPlaylist: Playlist<T> = {
    id: Date.now().toString(),
    name: playlistName,
    stations: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  const updatedPlaylists = [...playlists, newPlaylist];
  setToLocalStorage<Playlist<T>[]>(STORAGE_KEYS.USER_PLAYLISTS(userId), updatedPlaylists);
  
  return newPlaylist;
};

export const removeUserPlaylist = <T>(userId: string, playlistId: string): void => {
  const playlists = getUserPlaylists<T>(userId);
  const updatedPlaylists = playlists.filter(playlist => playlist.id !== playlistId);
  setToLocalStorage<Playlist<T>[]>(STORAGE_KEYS.USER_PLAYLISTS(userId), updatedPlaylists);
};

export const addStationToPlaylist = <T>(userId: string, playlistId: string, station: T): Playlist<T> | null => {
  const playlists = getUserPlaylists<T>(userId);
  const playlistIndex = playlists.findIndex(playlist => playlist.id === playlistId);
  
  if (playlistIndex !== -1) {
    const updatedPlaylists = [...playlists];
    const playlist = updatedPlaylists[playlistIndex];
    
    // Check if station is already in playlist
    const isAlreadyInPlaylist = playlist.stations.some((s) => 
      (s as unknown as { stationName: string }).stationName === (station as unknown as { stationName: string }).stationName
    );
    
    // Only add if not already in playlist
    if (!isAlreadyInPlaylist) {
      playlist.stations = [...playlist.stations, station];
      playlist.updatedAt = Date.now();
      setToLocalStorage<Playlist<T>[]>(STORAGE_KEYS.USER_PLAYLISTS(userId), updatedPlaylists);
      return playlist;
    }
  }
  
  return null;
};

export const removeStationFromPlaylist = <T>(userId: string, playlistId: string, stationName: string): void => {
  const playlists = getUserPlaylists<T>(userId);
  const playlistIndex = playlists.findIndex(playlist => playlist.id === playlistId);
  
  if (playlistIndex !== -1) {
    const updatedPlaylists = [...playlists];
    const playlist = updatedPlaylists[playlistIndex];
    
    playlist.stations = playlist.stations.filter((station) => 
      (station as unknown as { stationName: string }).stationName !== stationName
    );
    
    playlist.updatedAt = Date.now();
    setToLocalStorage<Playlist<T>[]>(STORAGE_KEYS.USER_PLAYLISTS(userId), updatedPlaylists);
  }
};

export const isStationInPlaylist = <T>(userId: string, playlistId: string, stationName: string): boolean => {
  const playlists = getUserPlaylists<T>(userId);
  const playlist = playlists.find(p => p.id === playlistId);
  
  if (!playlist) return false;
  
  return playlist.stations.some((station) => 
    (station as unknown as { stationName: string }).stationName === stationName
  );
};