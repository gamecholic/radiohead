'use client';

import { useState, useEffect } from "react";
import { FavoritesPageClient } from "./client";
import { getUserFavorites } from "@/lib/api";
import { RadioStation } from '@/lib/types';

export default function FavoritesPage() {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getUserFavorites("temp-user");
        setStations(favorites);
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">Favoriler yükleniyor...</div>
      </div>
    );
  }

  return <FavoritesPageClient initialStations={stations} />;
}