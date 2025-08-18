import { getRadioGroupsWithSlugs, getStationsByGroup } from "@/lib/api";
import { notFound } from "next/navigation";
import { GroupPageClient } from "./client";
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
    return { title: "Grup Bulunamadı" };
  }

  return {
    title: `${group.groupName} Radyo İstasyonları - RadioHead`,
    description: `RadioHead'de tüm ${group.groupName} radyo istasyonlarını dinleyin`,
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
