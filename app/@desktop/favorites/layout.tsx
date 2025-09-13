import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoriler | RadyoZen - Online Radyo Uygulaması",
  description: "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin",
  openGraph: {
    title: "Favoriler | RadyoZen - Online Radyo Uygulaması",
    description: "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin",
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
    title: "Favoriler | RadyoZen - Online Radyo Uygulaması",
    description: "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin",
    images: ["/icons/icon-512x512.png"],
  },
};

export default function FavoritesLayout({
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