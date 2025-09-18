import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoriler | RadyoZen - Canlı Radyo Dinle",
  description:
    "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin. Canlı radyo dinle ve favori radyolarınızı hızlıca başlatın.",
  keywords: [
    "radyo dinle",
    "canlı radyo dinle",
    "favori radyolar",
    "hızlı erişim",
    "radyo koleksiyonu",
  ],
  openGraph: {
    title: "Favoriler | RadyoZen - Canlı Radyo Dinle",
    description:
      "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin. Canlı radyo dinle ve favori radyolarınızı hızlıca başlatın.",
    url: "https://radyozen.com/favorites",
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
    title: "Favoriler | RadyoZen - Canlı Radyo Dinle",
    description:
      "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin. Canlı radyo dinle ve favori radyolarınızı hızlıca başlatın.",
    images: ["/icons/icon-512x512.png"],
  },
  alternates: {
    canonical: "https://radyozen.com/favorites",
    languages: {
      "tr-TR": "https://radyozen.com/favorites",
    },
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col h-full text-white">{children}</div>;
}
