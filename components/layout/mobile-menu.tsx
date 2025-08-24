"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRadioGroupsWithSlugs } from "@/lib/api";
import { useEffect, useState, useRef } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [radioGroups, setRadioGroups] = useState<
    { slug: string; groupName: string }[]
  >([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      getRadioGroupsWithSlugs().then(setRadioGroups);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-52 bg-black/20 glassmorphism md:hidden"
      style={{
        top: "env(safe-area-inset-top)",
      }}
    >
      <div
        ref={menuRef}
        className="absolute left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-md border-r border-gray-700 flex flex-col"
      >
        <div className="p-6">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">RadioHead</h1>
            <Button variant="ghost" size="icon" onClick={onClose}>
              ✕
            </Button>
          </div>
          <nav className="px-4 py-2 space-y-1">
            {[
              { name: "Ana Sayfa", href: "/" },
              { name: "Keşfet", href: "/browse" },
              { name: "Kütüphane", href: "/library" },
              { name: "Favoriler", href: "/favorites" },
              { name: "Hakkında", href: "/about" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-lg px-4 py-2 text-white hover:bg-white/10 transition-colors"
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="min-h-0 flex-1 px-4 py-6 border-t border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-4">
            Radyo Grupları
          </h2>
          <ScrollArea className="h-full w-full rounded-md flex-1 min-h-0">
            <div className="space-y-1 pr-2">
              {radioGroups.map((group) => (
                <Link
                  key={group.slug}
                  href={`/group/${group.slug}`}
                  className="block rounded-lg px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={onClose}
                >
                  {group.groupName}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
