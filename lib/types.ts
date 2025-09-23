export interface RadioGroup {
  groupName: string;
  slug: string;
}

export interface Category {
  name: string;
}

export interface Station {
  slug?: string;
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
  stationCity?: string;
}

export interface StationDetails {
  "station-slug": string;
  description?: string;
  frequencies?: string[];
  contact?: {
    address?: string;
    phone?: string;
    fax?: string;
    website?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  location?: {
    city?: string;
    region?: string;
  };
  additionalInfo?: {
    foundedDate?: string;
    owner?: string;
    slogan?: string;
  };
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
