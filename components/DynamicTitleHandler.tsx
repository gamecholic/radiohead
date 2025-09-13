"use client";

import { useAudio } from "@/contexts/AudioContext";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getAbsoluteImageUrl } from "@/lib/utils/imageUtils";

export function DynamicTitleHandler() {
  const { currentStation } = useAudio();
  const pathname = usePathname();

  useEffect(() => {
    // Update title when station changes or when pathname changes
    if (currentStation) {
      document.title = `${currentStation.stationName} | RadyoZen`;

      // Update meta description for better SEO when playing a station
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          `Şu anda ${currentStation.stationName} radyo istasyonunu dinliyorsunuz. Harika müzik keyfi için doğru yerdesiniz!`
        );
      }

      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      const ogImage = document.querySelector('meta[property="og:image"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector(
        'meta[name="twitter:description"]'
      );
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      if (ogTitle)
        ogTitle.setAttribute(
          "content",
          `${currentStation.stationName} | RadyoZen`
        );
      if (ogDescription)
        ogDescription.setAttribute(
          "content",
          `Şu anda ${currentStation.stationName} radyo istasyonunu dinliyorsunuz. Harika müzik keyfi için doğru yerdesiniz!`
        );
      if (ogImage && currentStation.stationIconUrl)
        ogImage.setAttribute(
          "content",
          getAbsoluteImageUrl(currentStation.stationIconUrl)
        );
      if (twitterTitle)
        twitterTitle.setAttribute(
          "content",
          `${currentStation.stationName} | RadyoZen`
        );
      if (twitterDescription)
        twitterDescription.setAttribute(
          "content",
          `Şu anda ${currentStation.stationName} radyo istasyonunu dinliyorsunuz. Harika müzik keyfi için doğru yerdesiniz!`
        );
      if (twitterImage && currentStation.stationIconUrl)
        twitterImage.setAttribute(
          "content",
          getAbsoluteImageUrl(currentStation.stationIconUrl)
        );
    } else {
      // Reset to default when no station is playing
      document.title = "RadyoZen - Online Radyo Uygulaması";

      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          "RadyoZen ile favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile favori radyo istasyonlarınızı dinleyin."
        );
      }

      // Reset Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector(
        'meta[property="og:description"]'
      );
      const ogImage = document.querySelector('meta[property="og:image"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector(
        'meta[name="twitter:description"]'
      );
      const twitterImage = document.querySelector('meta[name="twitter:image"]');

      if (ogTitle)
        ogTitle.setAttribute("content", "RadyoZen - Online Radyo Uygulaması");
      if (ogDescription)
        ogDescription.setAttribute(
          "content",
          "RadyoZen ile favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile favori radyo istasyonlarınızı dinleyin."
        );
      if (ogImage)
        ogImage.setAttribute(
          "content",
          "https://radyozen.com/icons/icon-512x512.png"
        );
      if (twitterTitle)
        twitterTitle.setAttribute(
          "content",
          "RadyoZen - Online Radyo Uygulaması"
        );
      if (twitterDescription)
        twitterDescription.setAttribute(
          "content",
          "RadyoZen ile favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile favori radyo istasyonlarınızı dinleyin."
        );
      if (twitterImage)
        twitterImage.setAttribute(
          "content",
          "https://radyozen.com/icons/icon-512x512.png"
        );
    }
  }, [currentStation, pathname]);

  return null; // This component doesn't render anything
}
