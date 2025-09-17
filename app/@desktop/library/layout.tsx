import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kütüphane | RadyoZen - Canlı Radyo Dinle",
  description: "RadyoZen kütüphanenizde favori radyo istasyonlarınızı ve çalma geçmişinizi görüntüleyin. Canlı radyo dinle ve çalma listelerinizi yönetin.",
  keywords: ["radyo dinle", "canlı radyo dinle", "çalma listesi", "favori radyolar", "radyo geçmişi"],
  openGraph: {
    title: "Kütüphane | RadyoZen - Canlı Radyo Dinle",
    description: "RadyoZen kütüphanenizde favori radyo istasyonlarınızı ve çalma geçmişinizi görüntüleyin. Canlı radyo dinle ve çalma listelerinizi yönetin.",
    url: "https://radyozen.com/library",
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
    title: "Kütüphane | RadyoZen - Canlı Radyo Dinle",
    description: "RadyoZen kütüphanenizde favori radyo istasyonlarınızı ve çalma geçmişinizi görüntüleyin. Canlı radyo dinle ve çalma listelerinizi yönetin.",
    images: ["/icons/icon-512x512.png"],
  },
  alternates: {
    canonical: "https://radyozen.com/library",
    languages: {
      "tr-TR": "https://radyozen.com/library",
    },
  },
};

export default function LibraryLayout({
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