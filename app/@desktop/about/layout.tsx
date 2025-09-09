import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkında | RadioHead - Çevrimiçi Radyo Uygulaması",
  description: "RadioHead uygulaması hakkında bilgiler, yasal uyarılar, telif hakkı bildirimi ve sorumluluk reddi beyanı",
  openGraph: {
    title: "Hakkında | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "RadioHead uygulaması hakkında bilgiler, yasal uyarılar, telif hakkı bildirimi ve sorumluluk reddi beyanı",
    url: "https://radiohead-one.vercel.app/about",
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
    title: "Hakkında | RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "RadioHead uygulaması hakkında bilgiler, yasal uyarılar, telif hakkı bildirimi ve sorumluluk reddi beyanı",
    images: ["/icons/icon-512x512.png"],
  },
};

export default function AboutLayout({
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
