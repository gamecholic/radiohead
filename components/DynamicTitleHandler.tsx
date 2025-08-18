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
    } else {
      document.title = "RadioHead - Çevrimiçi Radyo Uygulaması";
    }
  }, [currentStation, pathname]);

  return null; // This component doesn't render anything
}