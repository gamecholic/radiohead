import { Metadata } from "next";
import { getRadioGroupsWithSlugs } from "@/lib/api";
import { RadioGroup } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const radioGroups = await getRadioGroupsWithSlugs();
  const group = radioGroups.find(
    (g: RadioGroup) => g.slug === resolvedParams.slug
  );

  if (!group) {
    return {
      title: "Grup Bulunamadı | RadyoZen",
      description: "Aradığınız radyo grubu bulunamadı.",
      openGraph: {
        title: "Grup Bulunamadı | RadyoZen",
        description: "Aradığınız radyo grubu bulunamadı.",
        url: `https://www.radyozen.com/group/${resolvedParams.slug}`,
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
        title: "Grup Bulunamadı | RadyoZen",
        description: "Aradığınız radyo grubu bulunamadı.",
        images: ["/icons/icon-512x512.png"],
      },
      icons: {
        icon: "/favicon.ico",
        apple: "/icons/icon-192x192.png",
      },
      alternates: {
        canonical: `https://www.radyozen.com/group/${resolvedParams.slug}`,
        languages: {
          "tr-TR": `https://www.radyozen.com/group/${resolvedParams.slug}`,
        },
      },
    };
  }

  const title = `${group.groupName} Radyo İstasyonları - Canlı Radyo Dinle`;
  const description = `RadyoZen'de tüm ${group.groupName} radyo istasyonlarını canlı radyo dinle. ${group.groupName} ve daha fazlası için radyo dinleme deneyimini hemen yaşayın.`;

  return {
    title,
    description,
    keywords: [`radyo dinle`, `canlı radyo dinle`, `canlı radyo`, `${group.groupName.toLowerCase()} radyo`],
    openGraph: {
      title,
      description,
      url: `https://www.radyozen.com/group/${resolvedParams.slug}`,
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
      title,
      description,
      images: ["/icons/icon-512x512.png"],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/icons/icon-192x192.png",
    },
    alternates: {
      canonical: `https://www.radyozen.com/group/${resolvedParams.slug}`,
      languages: {
        "tr-TR": `https://www.radyozen.com/group/${resolvedParams.slug}`,
      },
    },
  };
}

export default function GroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden text-white">
      {children}
    </div>
  );
}