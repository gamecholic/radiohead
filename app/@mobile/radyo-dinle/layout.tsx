import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canlı Radyo Dinle | Radyo Dinle | RadyoZen",
  description:
    "RadyoZen ile canlı radyo dinle, radyo dinle ve favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat.",
  keywords: [
    "radyo dinle",
    "canlı radyo dinle",
    "canlı radyo",
    "çevrimiçi radyo",
    "türk radyo",
    "müzik radyo",
  ],
  openGraph: {
    title: "Canlı Radyo Dinle | Radyo Dinle | RadyoZen",
    description:
      "RadyoZen ile canlı radyo dinle, radyo dinle ve favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat.",
    url: "https://radyozen.com/radyo-dinle",
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
    title: "Canlı Radyo Dinle | Radyo Dinle | RadyoZen",
    description:
      "RadyoZen ile canlı radyo dinle, radyo dinle ve favori radyolarını kendi listeni oluşturarak dinleyebilirsin. İstediğin anda bir radyodan diğerine geç, durdur, tekrar başlat.",
    images: ["/icons/icon-512x512.png"],
  },
  alternates: {
    canonical: "https://radyozen.com/radyo-dinle",
    languages: {
      "tr-TR": "https://radyozen.com/radyo-dinle",
    },
  },
};

export default function MobileRadyoDinleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}