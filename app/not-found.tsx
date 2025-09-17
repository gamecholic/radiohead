import Image from "next/image";
import { HomeRedirectButton } from "@/components/HomeRedirectButton";

export default function NotFound() {
  return (
    <div className="z-60 fixed inset-0 flex h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4 text-center">
      <div className="mb-6">
        <div className="relative mx-auto h-16 w-16">
          <Image
            src="/icons/icon-192x192.png"
            alt="RadyoZen Logo"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">RadyoZen</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-6xl font-bold text-white mb-4">404</h2>
        <p className="text-lg text-gray-300 mb-2">Sayfa bulunamadı</p>
        <p className="text-gray-400 max-w-md">
          Üzgünüz, aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
      </div>

      <HomeRedirectButton />
    </div>
  );
}
