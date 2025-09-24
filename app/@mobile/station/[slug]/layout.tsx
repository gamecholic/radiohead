import { Metadata } from "next";
import { getStationBySlug } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const station = await getStationBySlug(resolvedParams.slug);

  if (!station) {
    return {
      title: "İstasyon Bulunamadı | RadyoZen",
      description: "Aradığınız radyo istasyonu bulunamadı.",
    };
  }

  const title = `${station.stationName} Radyosunu Dinle - Canlı Yayın | RadyoZen`;
  const description = `${station.stationName} radyosunu RadyoZen'de dinle. Canlı yayın, frekans bilgileri ve daha fazlası.`;

  return {
    title,
    description,
    keywords: [
      station.stationName.toLowerCase(),
      "radyo dinle",
      "canlı radyo dinle",
      "canlı radyo",
      "türk radyo",
      ...station.stationCategories.map((cat) => cat.toLowerCase()),
    ],
    openGraph: {
      title,
      description,
      url: `https://radyozen.com/station/${resolvedParams.slug}`,
      siteName: "RadyoZen",
      images: [
        {
          url: station.stationIconUrl || "/icons/icon-512x512.png",
          width: 512,
          height: 512,
          alt: station.stationName,
        },
      ],
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [station.stationIconUrl || "/icons/icon-512x512.png"],
    },
    alternates: {
      canonical: `https://radyozen.com/station/${resolvedParams.slug}`,
    },
  };
}

export default function MobileStationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
