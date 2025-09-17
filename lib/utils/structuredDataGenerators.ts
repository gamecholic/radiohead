import { Station, RadioGroup } from "@/lib/types";
import { getBaseUrl, getGroupUrl } from "@/lib/utils/structuredDataHelpers";

/**
 * Generates structured data for the RadyoZen application
 * @returns Structured data object for WebApplication
 */
export function generateAppStructuredData() {
  const baseUrl = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "RadyoZen",
    alternateName: "RadyoZen Türkiye",
    applicationCategory: "MusicApplication",
    operatingSystem: "Web",
    description:
      "RadyoZen ile canlı radyo dinle. Favori radyoların ile kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile radyo dinleyin.",
    url: baseUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    availableLanguage: "tr",
    countryOfOrigin: "TR",
    keywords:
      "radyo dinle, canlı radyo dinle, canlı radyo, çevrimiçi radyo, türk radyo, müzik radyo",
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
    name: station.stationName,
    description: `${station.stationName} - ${
      station.stationCategories[0] || "Müzik"
    } Türkçe radyo istasyonu. Canlı radyo dinle ve favori radyolarınızı keşfedin.`,
    image: station.stationIconUrl
      ? `${baseUrl}${station.stationIconUrl}`
      : undefined,
    url: `${baseUrl}${getGroupUrl(station.radioGroups[0] || "radio")}`,
    genre: station.stationCategories[0] || "Müzik",
    availableLanguage: "tr",
    countryOfOrigin: "TR",
    keywords: `radyo dinle, canlı radyo dinle, ${station.stationName.toLowerCase()}, ${
      station.stationCity ? station.stationCity.toLowerCase() + " radyo," : ""
    } ${station.stationCategories[0]?.toLowerCase() || "müzik"} radyo`,
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
