"use client";

import { CurrentStation } from "@/components/mobile/CurrentStation";
import { BottomNav } from "@/components/mobile/BottomNav";
import { useAudio } from "@/contexts/AudioContext";
import { jsx } from "react/jsx-runtime";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const { currentStation } = useAudio();

  return (
    <div className="grid grid-rows-[1fr_auto] h-full bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main content area - shared grid cell */}
      <main className="row-start-1 row-end-2 col-start-1 col-end-2 overflow-y-auto relative mobile-paddings">
        {children}
      </main>

      {/* Current station panel - overlaps main content when visible */}
      {currentStation && (
        <div className="row-start-1 row-end-2 col-start-1 col-end-2 self-end z-10">
          <CurrentStation />
        </div>
      )}

      {/* Bottom navigation */}
      <div className="row-start-2 row-end-3 col-start-1 col-end-2">
        <BottomNav />
      </div>
    </div>
  );
}
