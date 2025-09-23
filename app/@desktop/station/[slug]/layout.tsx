import { Metadata } from "next";
import { getStationBySlug, getStationDetailsBySlug } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const station = await getStationBySlug(resolvedParams.slug);
  const stationDetails = await getStationDetailsBySlug(resolvedParams.slug);

  if (!station) {
    return {
      title: "İstasyon Bulunamadı | RadyoZen",
      description: "Aradığınız radyo istasyonu bulunamadı.",
      openGraph: {
        title: "İstasyon Bulunamadı | RadyoZen",
        description: "Aradığınız radyo istasyonu bulunamadı.",
        url: `https://radyozen.com/station/${resolvedParams.slug}`,
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
        title: "İstasyon Bulunamadı | RadyoZen",
        description: "Aradığınız radyo istasyonu bulunamadı.",
        images: ["/icons/icon-512x512.png"],
      },
      icons: {
        icon: "/favicon.ico",
        apple: "/icons/icon-192x192.png",
      },
      alternates: {
        canonical: `https://radyozen.com/station/${resolvedParams.slug}`,
        languages: {
          "tr-TR": `https://radyozen.com/station/${resolvedParams.slug}`,
        },
      },
    };
  }

  const stationName = station.stationName;
  const title = `${stationName} - Canlı Radyo Dinle`;
  const description =
    stationDetails?.description ||
    `${stationName} - Canlı radyo dinle. Favori radyoların ile kendi listeni oluşturarak dinleyebilirsin.`;

  return {
    title,
    description,
    keywords: [
      `radyo dinle`,
      `canlı radyo dinle`,
      `canlı radyo`,
      `${stationName.toLowerCase()} radyo`,
      ...station.stationCategories.map((cat) => `${cat.toLowerCase()} radyo`),
    ],
    openGraph: {
      title,
      description,
      url: `https://radyozen.com/station/${resolvedParams.slug}`,
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
      title,
      description,
      images: ["/icons/icon-512x512.png"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/icons/icon-192x192.png",
    },
    alternates: {
      canonical: `https://radyozen.com/station/${resolvedParams.slug}`,
      languages: {
        "tr-TR": `https://radyozen.com/station/${resolvedParams.slug}`,
      },
    },
  };
}

export default function StationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}