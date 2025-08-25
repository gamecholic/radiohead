"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRadioGroupsWithSlugs } from "@/lib/api";
import { X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();
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

  const mainNavItems = [
    { name: "Ana Sayfa", href: "/" },
    { name: "Keşfet", href: "/browse" },
    { name: "Kütüphane", href: "/library" },
    { name: "Favoriler", href: "/favorites" },
    { name: "Hakkında", href: "/about" },
  ];

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
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={onClose}
            >
              <div className="relative h-8 w-8">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="RadioHead Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white">RadioHead</h1>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="!translate-x-3"
            >
              <X className="!h-6 !w-6" />
            </Button>
          </div>
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block rounded-lg px-4 py-2 transition-colors ${
                  pathname === item.href
                    ? "bg-white/20 text-white"
                    : "text-white hover:bg-white/10"
                }`}
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="min-h-0 flex-1 border-t border-gray-700 flex flex-col">
          <h2 className="text-lg font-semibold text-white px-6 py-4">
            Radyo Grupları
          </h2>
          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-1 px-6 pb-4">
              {radioGroups.map((group) => (
                <Link
                  key={group.slug}
                  href={`/group/${group.slug}`}
                  className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                    pathname === `/group/${group.slug}`
                      ? "bg-white/20 text-white"
                      : "text-gray-200 hover:bg-white/10 hover:text-white"
                  }`}
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
