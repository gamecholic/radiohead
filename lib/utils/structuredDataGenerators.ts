import { Station, RadioGroup } from "@/lib/types";
import { getBaseUrl, getGroupUrl } from "@/lib/utils/structuredDataHelpers";

/**
 * Generates structured data for the RadioHead application
 * @returns Structured data object for WebApplication
 */
export function generateAppStructuredData() {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "RadioHead",
    "applicationCategory": "MusicApplication",
    "operatingSystem": "Web",
    "description": "A modern online radio application with a Spotify/Youtube Music-inspired interface",
    "url": baseUrl,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
}

/**
 * Generates structured data for a single radio station
 * @param station The radio station
 * @returns Structured data object for RadioStation
 */
export function generateStationStructuredData(station: Station) {
  const baseUrl = getBaseUrl();
  
  return {
    "@context": "https://schema.org",
    "@type": "RadioStation",
    "name": station.stationName,
    "description": `${station.stationName} - ${station.stationCategories[0] || "Music"} radio station`,
    "image": station.stationIconUrl ? `${baseUrl}${station.stationIconUrl}` : undefined,
    "url": `${baseUrl}${getGroupUrl(station.radioGroups[0] || "radio")}`,
    "genre": station.stationCategories[0] || "Music"
  };
}

/**
 * Generates structured data for multiple radio stations
 * @param stations Array of radio stations
 * @returns Array of structured data objects for RadioStation
 */
export function generateStationsStructuredData(stations: Station[]) {
  return stations.map(generateStationStructuredData).filter(Boolean);
}