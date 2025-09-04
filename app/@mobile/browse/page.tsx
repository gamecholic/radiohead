"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { getRadioGroupsWithSlugs } from "@/lib/api";
import { RadioGroup } from "@/lib/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function MobileBrowse() {
  const [radioGroups, setRadioGroups] = useState<RadioGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRadioGroups = async () => {
      try {
        const radioGroupsData = await getRadioGroupsWithSlugs();
        setRadioGroups(radioGroupsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching radio groups:", error);
        setLoading(false);
      }
    };

    fetchRadioGroups();
  }, []);

  // Function to generate gradient based on group name
  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-pink-500 to-orange-500",
      "from-green-500 to-teal-500",
      "from-amber-500 to-yellow-500",
      "from-red-500 to-pink-500",
      "from-indigo-500 to-blue-500",
      "from-purple-500 to-indigo-500",
      "from-teal-500 to-cyan-500",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <ScrollArea className="flex-1">
        <div className="px-4 pb-24">
          <div className="mt-4 mb-6">
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Keşfet
            </motion.h1>
            <motion.p 
              className="text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Farklı kategorilerdeki radyoları keşfedin
            </motion.p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {radioGroups.map((group, index) => (
                <motion.div
                  key={group.slug}
                  className="relative rounded-2xl overflow-hidden h-36 shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${getGradient(index)} opacity-80`}
                  ></div>
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                  <Link 
                    href={`/group/${group.slug}`} 
                    className="relative h-full flex flex-col justify-between p-4"
                  >
                    <div>
                      <motion.h3 
                        className="text-lg font-bold text-white drop-shadow-md"
                        whileHover={{ x: 5 }}
                      >
                        {group.groupName}
                      </motion.h3>
                      <p className="text-xs text-white/80 mt-1">Radyo grubu</p>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/20"
                      >
                        <span className="mr-1">Keşfet</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}