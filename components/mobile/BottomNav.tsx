"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Heart, Compass, Library, User } from "lucide-react";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Ana Sayfa", href: "/", icon: Home },
    { name: "Keşfet", href: "/browse", icon: Compass },
    { name: "Kütüphane", href: "/library", icon: Library },
    { name: "Favoriler", href: "/favorites", icon: Heart },
    { name: "Hesap", href: "/about", icon: User },
  ];

  return (
    <nav className="bg-black/80 backdrop-blur-xl border-t border-gray-800 md:hidden">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-1 relative ${
                isActive ? "text-white" : "text-gray-400"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute top-0 w-1 h-1 bg-white rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
