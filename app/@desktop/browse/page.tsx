import { ScrollArea } from "@/components/ui/scroll-area";
import { BrowseSection } from "../components/BrowseSection";
import Script from "next/script";
import { generateAppStructuredData } from "@/lib/utils/structuredDataGenerators";

export default function BrowsePage() {
  // Structured data for the RadioHead application
  const structuredData = generateAppStructuredData();
  
  // For now, we'll use a temporary user ID
  // In the future, this should come from the actual user context
  const userId = "temp-user";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 h-full [&>div]:!block">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-24">
            {/* Personalized Recommendations */}
            <BrowseSection sectionType="recommended" userId={userId} />

            {/* Top Charts */}
            <BrowseSection sectionType="top" userId={userId} />

            {/* Mood/Activity Sections */}
            <BrowseSection sectionType="mood" mood="Focus" userId={userId} />
            <BrowseSection sectionType="mood" mood="Energy" userId={userId} />
            <BrowseSection sectionType="mood" mood="Relax" userId={userId} />
            <BrowseSection sectionType="mood" mood="Workout" userId={userId} />

            {/* New Discoveries */}
            <BrowseSection sectionType="random" userId={userId} />
          </div>
        </ScrollArea>
      </div>
      
      {/* Structured Data for SEO */}
      <Script
        id="radiohead-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </div>
  );
}
