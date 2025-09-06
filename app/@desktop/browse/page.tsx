"use client";

import { useState } from "react";

export default function BrowsePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <h1 className="text-3xl font-bold mb-4">Keşfet</h1>
          <p className="text-gray-300 mb-6">
            Bu özellik yakın gelecekte eklenecek. Kullanıcı hesap sistemi tamamlandığında radyo istasyonlarını kategorilere göre keşfedebileceksiniz.
          </p>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Yakında Geliyor</h2>
            <p className="text-gray-400">
              - Kategorilere göre radyo istasyonları
              <br />
              - Kişiselleştirilmiş öneriler
              <br />
              - Detaylı istasyon bilgileri
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}