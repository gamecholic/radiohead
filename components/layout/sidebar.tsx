import { RadioGroup } from "@/lib/types";
import { SidebarClient } from "./sidebar-client";

interface SidebarProps {
  radioGroups: RadioGroup[];
}

export function Sidebar({ radioGroups }: SidebarProps) {
  return <SidebarClient radioGroups={radioGroups} />;
}