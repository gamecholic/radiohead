import { getRadioGroupsWithSlugs, getStationsByGroup } from "@/lib/api";
import { notFound } from "next/navigation";
import { GroupPageClient } from "./client";
import { RadioGroup, RadioStation } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const radioGroups = await getRadioGroupsWithSlugs();
  const group = radioGroups.find((g: RadioGroup) => g.slug === resolvedParams.slug);
  
  if (!group) {
    return { title: "Group Not Found" };
  }
  
  return {
    title: `${group.groupName} Radio Stations - RadioHead`,
    description: `Listen to all ${group.groupName} radio stations on RadioHead`,
  };
}

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const radioGroups = await getRadioGroupsWithSlugs();
  const group = radioGroups.find((g: RadioGroup) => g.slug === resolvedParams.slug);
  
  if (!group) {
    notFound();
  }
  
  // Use the group name for filtering stations
  const stations = await getStationsByGroup(group.groupName);
  
  return <GroupPageClient group={group} stations={stations} />;
}
