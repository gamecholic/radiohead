export interface RadioGroup {
  groupName: string;
  slug: string;
}

export interface Category {
  name: string;
}

export interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
  stationCity?: string;
}

export interface Playlist {
  id: string;
  name: string;
  stations: Station[];
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface HistoryItem {
  station: Station;
  playedAt: number; // timestamp
}