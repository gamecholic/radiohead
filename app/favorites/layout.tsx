import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favoriler | RadioHead - Çevrimiçi Radyo Uygulaması",
  description: "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin",
  openGraph: {
    title: "Favoriler | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin",
    url: "https://radiohead-one.vercel.app/favorites",
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
    title: "Favoriler | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Favori radyo istasyonlarınızı kaydedin ve kolayca erişin",
    images: ["/icons/icon-512x512.png"],
  },
};

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}