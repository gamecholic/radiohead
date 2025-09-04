"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { History, PlayCircle, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function MobileLibrary() {
  const [activeTab, setActiveTab] = useState("history");

  const historyItems = [
    { id: 1, title: "Radyo Vanya", time: "2 saat önce" },
    { id: 2, title: "Kral Pop", time: "1 gün önce" },
    { id: 3, title: "Number One FM", time: "2 gün önce" },
    { id: 4, title: "Power FM", time: "3 gün önce" },
    { id: 5, title: "Metro FM", time: "1 hafta önce" },
  ];

  const playlistItems = [
    { id: 1, title: "Akustik Ruh", count: "12 istasyon" },
    { id: 2, title: "Yolculuk Mix", count: "8 istasyon" },
    { id: 3, title: "Çalışma Odası", count: "15 istasyon" },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <ScrollArea className="flex-1">
        <div className="px-4 pb-4">
          <div className="mt-4 mb-6">
            <h1 className="text-2xl font-bold">Kütüphane</h1>
            <p className="text-gray-400">Çalma geçmişinizi ve çalma listelerinizi görüntüleyin</p>
          </div>
          
          <div className="flex border-b border-gray-800">
            <Button
              variant="ghost"
              className={`flex-1 rounded-none py-4 ${
                activeTab === "history"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("history")}
            >
              <History className="h-4 w-4 mr-2" />
              Geçmiş
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none py-4 ${
                activeTab === "playlists"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("playlists")}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Çalma Listeleri
            </Button>
          </div>
          
          <div className="mt-4">
            {activeTab === "history" ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Çalma Geçmişi</h2>
                  <Button variant="ghost" size="sm" className="text-blue-400">
                    Temizle
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {historyItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="bg-gray-800 border-2 border-dashed rounded-xl w-12 h-12 mr-3" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.title}</h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{item.time}</span>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full">
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Çalma Listelerim</h2>
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                    Yeni
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {playlistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-12 h-12 mr-3" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.count}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="rounded-full">
                        <PlayCircle className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  ))}
                  
                  <div className="flex items-center justify-center p-8 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 border-dashed border-2">
                    <div className="text-center">
                      <Heart className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <h3 className="font-medium text-gray-400">Yeni Çalma Listesi</h3>
                      <p className="text-sm text-gray-500 mt-1">Favori istasyonlarınızı kaydedin</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
