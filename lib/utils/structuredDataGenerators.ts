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
    name: "RadioHead",
    alternateName: "RadioHead Türkiye",
    applicationCategory: "MusicApplication",
    operatingSystem: "Web",
    description:
      "RadioHead ile favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile favori radyo istasyonlarınızı dinleyin. RadioHead, Türkiye'nin en popüler radyo istasyonlarını bir arada sunan online bir radyo uygulamasıdır.",
    url: baseUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    availableLanguage: "tr",
    countryOfOrigin: "TR",
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
    } Türkçe radyo istasyonu`,
    image: station.stationIconUrl
      ? `${baseUrl}${station.stationIconUrl}`
      : undefined,
    url: `${baseUrl}${getGroupUrl(station.radioGroups[0] || "radio")}`,
    genre: station.stationCategories[0] || "Müzik",
    availableLanguage: "tr",
    countryOfOrigin: "TR",
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
