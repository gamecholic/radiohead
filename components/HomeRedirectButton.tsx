"use client";

import { Button } from "@/components/ui/button";

export function HomeRedirectButton() {
  const handleClick = () => {
    window.location.href = "/";
  };

  return (
    <Button
      onClick={handleClick}
      className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-medium transition-colors"
    >
      Ana Sayfaya Dön
    </Button>
  );
}