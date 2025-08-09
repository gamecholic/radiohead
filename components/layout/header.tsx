'use client';

import { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export function Header({ onMobileMenuOpen }: HeaderProps) {
  return (
    <>
      {/* Top Bar for Mobile */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:hidden">
        <Button variant="ghost" size="icon" onClick={onMobileMenuOpen}>
          <Menu className="h-6 w-6" />
        </Button>
        <Button variant="ghost" size="icon">
          <Search className="h-6 w-6" />
        </Button>
      </header>

      {/* Top Bar for Desktop */}
      <header className="hidden items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:flex">
        <div></div>
        <div className="flex w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search stations..."
              className="w-full rounded-full bg-white/10 py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-amber-500"></div>
        </div>
      </header>
    </>
  );
}