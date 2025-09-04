import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kütüphane | RadioHead - Çevrimiçi Radyo Uygulaması",
  description: "Radyo istasyonları çalma geçmişinizi ve özel çalma listelerinizi görüntüleyin",
  openGraph: {
    title: "Kütüphane | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Radyo istasyonları çalma geçmişinizi ve özel çalma listelerinizi görüntüleyin",
    url: "https://radiohead-one.vercel.app/library",
    siteName: "RadioHead",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "RadioHead Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kütüphane | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Radyo istasyonları çalma geçmişinizi ve özel çalma listelerinizi görüntüleyin",
    images: ["/icons/icon-512x512.png"],
  },
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}