"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RadioStation } from "@/lib/types";
import {
  getUserFavorites,
  addStationToFavorites,
  removeStationFromFavorites,
  isStationFavorite,
} from "@/lib/api";

interface FavoritesContextType {
  favorites: RadioStation[];
  isFavorite: (stationName: string) => Promise<boolean>;
  addFavorite: (station: RadioStation) => Promise<void>;
  removeFavorite: (stationName: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

const USER_ID = "temp-user"; // In a real app, this would come from auth

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<RadioStation[]>([]);

  const refreshFavorites = async () => {
    try {
      const userFavorites = await getUserFavorites(USER_ID);
      setFavorites(userFavorites);
    } catch (error) {
      console.error("Failed to refresh favorites:", error);
    }
  };

  const isFavorite = async (stationName: string): Promise<boolean> => {
    return isStationFavorite(USER_ID, stationName);
  };

  const addFavorite = async (station: RadioStation) => {
    try {
      await addStationToFavorites(USER_ID, station);
      await refreshFavorites();
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const removeFavorite = async (stationName: string) => {
    try {
      await removeStationFromFavorites(USER_ID, stationName);
      await refreshFavorites();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  // Load favorites on mount
  useEffect(() => {
    refreshFavorites();
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        addFavorite,
        removeFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
