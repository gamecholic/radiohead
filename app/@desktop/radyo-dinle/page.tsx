import { Header } from "@/components/layout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getRadioGroupsWithSlugs } from "@/lib/api";
import { RadioGroup } from "@/lib/types";
import Script from "next/script";
import { generateAppStructuredData } from "@/lib/utils/structuredDataGenerators";

export default async function RadyoDinlePage() {
  const radioGroups = await getRadioGroupsWithSlugs();

  // Structured data for the RadioHead application
  const structuredData = generateAppStructuredData();

  return (
    <div className="flex flex-col h-[100dvh]">
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 h-full [&>div]:!block">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6 pb-24 md:pb-24">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Canlı Radyo Dinle - Radyo Dinle
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                RadioHead ile canlı radyo dinle. Favori radyoların ile kendi
                listeni oluşturarak dinleyebilirsin. Radyon, senin frekansında.
                Modern ve kullanımı kolay arayüzü ile radyo dinleyin. İstediğin
                anda bir radyodan diğerine geç, durdur, tekrar başlat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Canlı Radyo Dinle
                </h2>
                <p className="text-gray-300 mb-4">
                  Türkiye&apos;nin en popüler radyo istasyonlarını canlı olarak
                  dinleyin. Favori radyolarınızı seçin ve anında çalmaya
                  başlasın.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Radyo Dinle
                </h2>
                <p className="text-gray-300 mb-4">
                  Farklı kategorilerdeki radyo istasyonlarını keşfedin. Pop,
                  slow, rap, rock ve daha fazlası için radyo dinle deneyimini
                  yaşayın.
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-gray-800">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Canlı Radyo
                </h2>
                <p className="text-gray-300 mb-4">
                  Canlı radyo yayınlarını kesintisiz dinleyin. Yüksek kaliteli
                  ses ile müzik keyfini çıkarın.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Popüler Radyo Grupları
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {radioGroups.slice(0, 8).map((group: RadioGroup) => (
                  <Link
                    key={group.slug}
                    href={`/group/${group.slug}`}
                    className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-gray-800 hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center"
                  >
                    <span className="text-lg font-semibold text-white text-center">
                      {group.groupName}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Button asChild variant="outline">
                  <Link href="/browse">Tüm Radyo Gruplarını Gör</Link>
                </Button>
              </div>
            </div>

            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-gray-800">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Neden RadioHead?
              </h2>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Canlı radyo dinleme deneyimi</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Favori radyo listeleri oluşturma</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Çevrimiçi ve mobil uyumlu platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Türk radyo istasyonlarına anında erişim</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ücretsiz ve reklamsız deneyim</span>
                </li>
              </ul>
            </div>
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

export async function generateMetadata() {
  return {
    title: "Canlı Radyo Dinle | Radyo Dinle | RadioHead",
    description:
      "RadioHead ile canlı radyo dinle, radyo dinle ve favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat.",
    keywords: [
      "radyo dinle",
      "canlı radyo dinle",
      "canlı radyo",
      "çevrimiçi radyo",
      "türk radyo",
      "müzik radyo",
    ],
  };
}
