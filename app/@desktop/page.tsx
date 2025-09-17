import { Header } from "@/components/layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FeaturedSection } from "../../components/desktop/sections";
import { CategorySection } from "../../components/desktop/sections";
import Script from "next/script";
import { generateAppStructuredData } from "@/lib/utils/structuredDataGenerators";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "RadyoZen - Canlı Radyo Dinle | Radyo Dinle",
  description: "RadyoZen ile canlı radyo dinle. Favori radyoların ile kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile radyo dinleyin.",
  keywords: ["radyo dinle", "canlı radyo dinle", "canlı radyo", "çevrimiçi radyo", "türk radyo", "müzik radyo"],
  openGraph: {
    title: "RadyoZen - Canlı Radyo Dinle | Radyo Dinle",
    description: "RadyoZen ile canlı radyo dinle. Favori radyoların ile kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile radyo dinleyin.",
    url: "https://radyozen.com",
    siteName: "RadyoZen",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "RadyoZen Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RadyoZen - Canlı Radyo Dinle | Radyo Dinle",
    description: "RadyoZen ile canlı radyo dinle. Favori radyoların ile kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat. Radyon, senin frekansında. Modern ve kullanımı kolay arayüzü ile radyo dinleyin.",
    images: ["/icons/icon-512x512.png"],
  },
  alternates: {
    canonical: "https://radyozen.com",
    languages: {
      "tr-TR": "https://radyozen.com",
    },
  },
};

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
