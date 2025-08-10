"use client";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { useState } from "react";

export default function LibraryPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white">Kütüphane</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Kütüphane</h1>
          <p className="text-gray-300 mb-6">
            Bu özellik yakın gelecekte eklenecek. Kullanıcı hesap sistemi
            tamamlandığında çalma geçmişinizi ve özel çalma listelerinizi burada
            görebileceksiniz.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Yakında Geliyor</h2>
            <p className="text-gray-400">
              - Çalma geçmişi
              <br />- Özel çalma listeleri
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}
