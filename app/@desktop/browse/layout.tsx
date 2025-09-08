import { Metadata } from "next";
import { Header } from "@/components/layout";

export const metadata: Metadata = {
  title: "Keşfet | RadioHead - Çevrimiçi Radyo Uygulaması",
  description: "Radyo istasyonlarını keşfedin ve favorilerinizi bulun",
  openGraph: {
    title: "Keşfet | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Radyo istasyonlarını keşfedin ve favorilerinizi bulun",
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
    description: "Radyo istasyonlarını keşfedin ve favorilerinizi bulun",
    images: ["/icons/icon-512x512.png"],
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Header />
      {children}
    </div>
  );
}