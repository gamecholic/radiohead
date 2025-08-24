"use client";

import { useAudio } from "@/contexts/AudioContext";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function DynamicTitleHandler() {
  const { currentStation } = useAudio();
  const pathname = usePathname();

  useEffect(() => {
    // Update title when station changes or when pathname changes
    if (currentStation) {
      document.title = `${currentStation.stationName} | RadioHead`;
      
      // Update meta description for better SEO when playing a station
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Şu anda ${currentStation.stationName} radyo istasyonunu dinliyorsunuz. Harika müzik keyfi için doğru yerdesiniz!`);
      }
      
      // Update Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      
      if (ogTitle) ogTitle.setAttribute('content', `${currentStation.stationName} | RadioHead`);
      if (ogDescription) ogDescription.setAttribute('content', `Şu anda ${currentStation.stationName} radyo istasyonunu dinliyorsunuz. Harika müzik keyfi için doğru yerdesiniz!`);
      if (twitterTitle) twitterTitle.setAttribute('content', `${currentStation.stationName} | RadioHead`);
      if (twitterDescription) twitterDescription.setAttribute('content', `Şu anda ${currentStation.stationName} radyo istasyonunu dinliyorsunuz. Harika müzik keyfi için doğru yerdesiniz!`);
    } else {
      // Reset to default when no station is playing
      document.title = "RadioHead - Çevrimiçi Radyo Uygulaması";
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', "Favori radyo istasyonlarınızı modern arayüzle dinleyin");
      }
      
      // Reset Open Graph tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      
      if (ogTitle) ogTitle.setAttribute('content', "RadioHead - Çevrimiçi Radyo Uygulaması");
      if (ogDescription) ogDescription.setAttribute('content', "Favori radyo istasyonlarınızı modern arayüzle dinleyin");
      if (twitterTitle) twitterTitle.setAttribute('content', "RadioHead - Çevrimiçi Radyo Uygulaması");
      if (twitterDescription) twitterDescription.setAttribute('content', "Favori radyo istasyonlarınızı modern arayüzle dinleyin");
    }
  }, [currentStation, pathname]);

  return null; // This component doesn't render anything
}