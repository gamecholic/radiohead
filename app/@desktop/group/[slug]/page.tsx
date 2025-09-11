import { getRadioGroupsWithSlugs, getStationsByGroup } from "@/lib/api";
import { notFound } from "next/navigation";
import { GroupPageClient } from "./client";
import { RadioGroup } from "@/lib/types";

export async function generateStaticParams() {
  const radioGroups = await getRadioGroupsWithSlugs();
  return radioGroups.map((group: RadioGroup) => ({
    slug: group.slug,
  }));
}

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
    return { title: "Grup Bulunamadı" };
  }

  return {
    title: `${group.groupName} Radyo İstasyonları - Canlı Radyo Dinle`,
    description: `RadioHead'de tüm ${group.groupName} radyo istasyonlarını canlı radyo dinle. ${group.groupName} ve daha fazlası için radyo dinleme deneyimini hemen yaşayın.`,
    keywords: [`radyo dinle`, `canlı radyo dinle`, `canlı radyo`, `${group.groupName.toLowerCase()} radyo`],
  };
}

export default async function GroupPage({
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
    notFound();
  }

  // Use the group name for filtering stations
  const stations = await getStationsByGroup(group.groupName);

  return <GroupPageClient group={group} stations={stations} />;
}
