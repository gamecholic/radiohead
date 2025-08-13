"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-[100dvh]">
      <Header onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Hakkında</h1>

          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-gray-800">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                RadioHead Uygulaması
              </h2>
              <p className="text-gray-300 mb-4">
                RadioHead, eğitim amaçlı olarak geliştirilmiş bir çevrimiçi
                radyo uygulamasıdır. Bu uygulama ticari bir ürün değildir ve
                hiçbir kazanç amacı gütmemektedir.
              </p>
              <p className="text-gray-300 mb-4">
                Uygulama, Next.js 15, ShadCN UI ve modern web teknolojileri
                kullanılarak geliştirilmiştir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Yasal Uyarı
              </h2>
              <p className="text-gray-300 mb-4">
                Bu uygulama eğitim amaçlı geliştirilmiştir ve ticari bir amaç
                gütmemektedir. Uygulama Google'da indekslenmemiştir ve genel
                kitleye açık şekilde paylaşılmamıştır.
              </p>
              <p className="text-gray-300 mb-4">
                Uygulamada kullanılan radyo istasyonlarının yayın akışları,
                ilgili istasyonların resmi kaynaklarından alınmaktadır. Eğer bir
                yayıncı ya da hak sahibi bu uygulamanın herhangi bir içeriğinin
                telif hakkı ile korunan materyallerini kullanıyor olduğunu
                düşünüyorsa, lütfen aşağıdaki e-posta adresinden iletişime
                geçin:
              </p>
              <p className="text-center text-lg font-semibold text-white my-6">
                <a
                  href="mailto:gamecholic@hotmail.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  gamecholic@hotmail.com
                </a>
              </p>
              <p className="text-gray-300 mb-4">
                İlgili telif hakkı sahipleri tarafından talep edilmesi
                durumunda, ilgili içerik en kısa sürede kaldırılacaktır.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Sorumluluk Reddi
              </h2>
              <p className="text-gray-300 mb-4">
                Bu uygulama yalnızca eğitim amaçlıdır. Uygulamada yer alan
                içeriklerin kullanımından doğabilecek her türlü sorumluluk
                kullanıcıya aittir. Uygulama geliştiricisi olarak herhangi bir
                yasal sorumluluk kabul etmemekteyim.
              </p>
            </section>
          </div>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline">
              <Link href="/">Ana Sayfaya Dön</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
