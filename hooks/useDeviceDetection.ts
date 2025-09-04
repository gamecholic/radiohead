"use client";

import { useEffect, useState } from "react";

export function useDeviceDetection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check if window is defined (client-side)
      if (typeof window !== "undefined") {
        // Simple mobile detection based on screen width
        // This is a common approach but can be enhanced with more sophisticated detection
        setIsMobile(window.innerWidth < 768);
      }
    };

    // Check on mount
    checkDevice();

    // Add event listener for window resize
    window.addEventListener("resize", checkDevice);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  return { isMobile };
}