"use client";

import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import { Sidebar } from "@/components/layout/sidebar";
import { NowPlayingPanel } from "@/components/layout/now-playing-panel";
import { DynamicTitleHandler } from "@/components/DynamicTitleHandler";
import { MobileLayout } from "@/components/mobile/MobileLayout";
import { RadioGroup } from "@/lib/types";

export function LayoutManager({
  children,
  radioGroups,
  desktop,
  mobile,
}: {
  children: React.ReactNode;
  radioGroups: RadioGroup[];
  desktop: React.ReactNode;
  mobile: React.ReactNode;
}) {
  const { isMobile } = useDeviceDetection();

  if (isMobile) {
    return <MobileLayout>{mobile || children}</MobileLayout>;
  }

  // Desktop layout (existing layout with sidebar)
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar radioGroups={radioGroups} />
        <main className="flex-1 flex flex-col overflow-hidden relative">
          <DynamicTitleHandler />
          {desktop || children}
          <NowPlayingPanel />
        </main>
      </div>
    </div>
  );
}
