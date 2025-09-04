"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Station } from "@/lib/types";
import { getUserHistory, addStationToHistory, clearUserHistory } from "@/lib/api";

interface HistoryContextType {
  history: Station[];
  addToHistory: (station: Station) => Promise<void>;
  clearHistory: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  getRecentStations: (limit?: number) => Promise<Station[]>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const USER_ID = "temp-user"; // In a real app, this would come from auth

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<Station[]>([]);

  const refreshHistory = async () => {
    try {
      const userHistory = await getUserHistory(USER_ID);
      // Sort history by playedAt timestamp in descending order (newest first)
      const sortedHistory = [...userHistory]
        .sort((a, b) => b.playedAt - a.playedAt)
        .map((item) => item.station);
      setHistory(sortedHistory);
    } catch (error) {
      console.error("Failed to refresh history:", error);
    }
  };

  const addToHistory = async (station: Station) => {
    try {
      await addStationToHistory(USER_ID, station);
      await refreshHistory();
    } catch (error) {
      console.error("Failed to add station to history:", error);
      throw error;
    }
  };

  const clearHistory = async () => {
    try {
      await clearUserHistory(USER_ID);
      await refreshHistory();
    } catch (error) {
      console.error("Failed to clear history:", error);
      throw error;
    }
  };

  const getRecentStations = async (limit: number = 15): Promise<Station[]> => {
    try {
      const userHistory = await getUserHistory(USER_ID);
      // Sort by playedAt descending (newest first) and take only the specified limit
      const recentHistory = [...userHistory]
        .sort((a, b) => b.playedAt - a.playedAt)
        .slice(0, limit);
      // Extract unique stations (by stationName) to avoid duplicates
      const uniqueStations: Station[] = [];
      const stationNames = new Set<string>();
      
      for (const item of recentHistory) {
        if (!stationNames.has(item.station.stationName)) {
          stationNames.add(item.station.stationName);
          uniqueStations.push(item.station);
        }
      }
      
      return uniqueStations;
    } catch (error) {
      console.error("Failed to get recent stations:", error);
      throw error;
    }
  };

  // Load history on mount
  useEffect(() => {
    refreshHistory();
  }, []);

  return (
    <HistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        refreshHistory,
        getRecentStations,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
}