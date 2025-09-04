"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function MobileAbout() {
  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
      <ScrollArea className="flex-1">
        <div className="px-4 pb-16">
          <div className="mt-4 mb-6">
            <h1 className="text-2xl font-bold">RadioHead</h1>
            <p className="text-gray-400">Çevrimiçi Radyo Uygulaması</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-6">
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="RadioHead Logo"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold">RadioHead</h2>
                <p className="text-gray-400 text-sm">Modern Radyo Deneyimi</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              RadioHead, favori radyo istasyonlarınızı dinlemenin en kolay yolu.
              Binlerce radyo istasyonuna anında erişim sağlayın.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="font-bold mb-2">Yasal Uyarı</h3>
              <p className="text-gray-400 text-sm mb-4">
                Bu uygulama eğitim amaçlı geliştirilmiştir ve ticari bir amaç
                gütmemektedir. Uygulama Google&apos;da indekslenmemiştir ve
                genel kitleye açık şekilde paylaşılmamıştır.
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Uygulamada kullanılan radyo istasyonlarının yayın akışları,
                ilgili istasyonların resmi kaynaklarından alınmaktadır. Eğer bir
                yayıncı ya da hak sahibi bu uygulamanın herhangi bir içeriğinin
                telif hakkı ile korunan materyallerini kullanıyor olduğunu
                düşünüyorsa, lütfen aşağıdaki e-posta adresinden iletişime
                geçin:
              </p>
              <p className="text-center text-white my-4">
                gamecholic@hotmail.com
              </p>
              <p className="text-gray-400 text-sm">
                İlgili telif hakkı sahipleri tarafından talep edilmesi
                durumunda, ilgili içerik en kısa sürede kaldırılacaktır.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="font-bold mb-2">Sorumluluk Reddi</h3>
              <p className="text-gray-400 text-sm">
                Bu uygulama yalnızca eğitim amaçlıdır. Uygulamada yer alan
                içeriklerin kullanımından doğabilecek her türlü sorumluluk
                kullanıcıya aittir. Uygulama geliştiricisi olarak herhangi bir
                yasal sorumluluk kabul etmemekteyim.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
