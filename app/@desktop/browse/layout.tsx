import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keşfet | RadyoZen - Canlı Radyo Dinle",
  description: "RadyoZen'de yüzlerce radyo istasyonunu keşfedin ve favorilerinizi bulun. Canlı radyo dinle, müzik radyoları, haber radyoları ve daha fazlası.",
  keywords: ["radyo dinle", "canlı radyo dinle", "radyo istasyonları", "müzik radyo", "türk radyo", "çevrimiçi radyo"],
  openGraph: {
    title: "Keşfet | RadyoZen - Canlı Radyo Dinle",
    description: "RadyoZen'de yüzlerce radyo istasyonunu keşfedin ve favorilerinizi bulun. Canlı radyo dinle, müzik radyoları, haber radyoları ve daha fazlası.",
    url: "https://radyozen.com/browse",
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
    title: "Keşfet | RadyoZen - Canlı Radyo Dinle",
    description: "RadyoZen'de yüzlerce radyo istasyonunu keşfedin ve favorilerinizi bulun. Canlı radyo dinle, müzik radyoları, haber radyoları ve daha fazlası.",
    images: ["/icons/icon-512x512.png"],
  },
  alternates: {
    canonical: "https://radyozen.com/browse",
    languages: {
      "tr-TR": "https://radyozen.com/browse",
    },
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full text-white">
      {children}
    </div>
  );
}