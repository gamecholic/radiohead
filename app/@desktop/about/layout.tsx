import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkında | RadyoZen - Online Radyo Uygulaması",
  description: "RadyoZen uygulaması hakkında bilgiler, yasal uyarılar, telif hakkı bildirimi ve sorumluluk reddi beyanı. Canlı radyo dinle uygulaması.",
  keywords: ["radyo dinle", "canlı radyo dinle", "radyo uygulaması", "radyozen hakkında", "ücretsiz radyo"],
  openGraph: {
    title: "Hakkında | RadyoZen - Online Radyo Uygulaması",
    description: "RadyoZen uygulaması hakkında bilgiler, yasal uyarılar, telif hakkı bildirimi ve sorumluluk reddi beyanı. Canlı radyo dinle uygulaması.",
    url: "https://radyozen.com/about",
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
    title: "Hakkında | RadyoZen - Online Radyo Uygulaması",
    description: "RadyoZen uygulaması hakkında bilgiler, yasal uyarılar, telif hakkı bildirimi ve sorumluluk reddi beyanı. Canlı radyo dinle uygulaması.",
    images: ["/icons/icon-512x512.png"],
  },
  alternates: {
    canonical: "https://radyozen.com/about",
    languages: {
      "tr-TR": "https://radyozen.com/about",
    },
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
