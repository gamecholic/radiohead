import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keşfet | RadioHead - Çevrimiçi Radyo Uygulaması",
  description: "Radyo istasyonlarını kategorilere göre keşfedin",
  openGraph: {
    title: "Keşfet | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Radyo istasyonlarını kategorilere göre keşfedin",
    url: "https://radiohead-one.vercel.app/browse",
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
    title: "Keşfet | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Radyo istasyonlarını kategorilere göre keşfedin",
    images: ["/icons/icon-512x512.png"],
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}