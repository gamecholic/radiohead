"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup } from "@/lib/types";

interface SidebarClientProps {
  radioGroups: RadioGroup[];
}

export function SidebarClient({ radioGroups }: SidebarClientProps) {
  const pathname = usePathname();

  const mainNavItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Keşfet", href: "/browse" },
    { name: "Kütüphane", href: "/library" },
    { name: "Favoriler", href: "/favorites" },
    { name: "Hakkında", href: "/about" },
  ];

  return (
    <aside className="hidden w-64 max-h-full flex-col border-r border-gray-800 bg-black/30 backdrop-blur-md md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">RadioHead</h1>
      </div>
      <nav className="px-4 py-2">
        {mainNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`block rounded-lg px-4 py-2 transition-colors ${
              pathname === item.href
                ? "bg-white/20 text-white"
                : "text-white hover:bg-white/10"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="min-h-0 flex-1 px-4 py-6 border-t border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          Radyo Grupları
        </h2>
        <ScrollArea className="h-full w-full rounded-md">
          <div className="space-y-1 pr-2">
            {radioGroups.map((group) => (
              <Link
                key={group.slug}
                href={`/group/${group.slug}`}
                className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                  pathname === `/group/${group.slug}`
                    ? "bg-white/20 text-white"
                    : "text-gray-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                {group.groupName}
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}