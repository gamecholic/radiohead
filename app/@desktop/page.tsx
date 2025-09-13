import { Header } from "@/components/layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeaturedSection } from "./components";
import { CategorySection } from "./components";
import Script from "next/script";
import { generateAppStructuredData } from "@/lib/utils/structuredDataGenerators";

export default function Home() {
  // Structured data for the RadyoZen application
  const structuredData = generateAppStructuredData();

  return (
    <div className="flex flex-col h-[100dvh]">
      <Header />

      {/* Main Content Area - This should take remaining space */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 h-full [&>div]:!block">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-24">
            {/* Featured Section - Client Component */}
            <FeaturedSection />
            
            {/* Netflix-style Carousels - Client Component */}
            <CategorySection />
          </div>
        </ScrollArea>
      </div>

      {/* Structured Data for SEO */}
      <Script
        id="radyozen-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </div>
  );
}
