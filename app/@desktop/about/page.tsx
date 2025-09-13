"use client";

import { Header } from "@/components/layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Script from "next/script";
import { generateAppStructuredData } from "@/lib/utils/structuredDataGenerators";

export default function AboutPage() {
  // Structured data for the RadyoZen application
  const structuredData = generateAppStructuredData();
  
  return (
    <div className="flex flex-col h-[100dvh]">
      <Header />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Hakkında</h1>

          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-gray-800">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-2">RadyoZen Nedir?</h2>
              <p className="mb-4">
                RadyoZen, bireysel, kar amacı gütmeyen bir projedir ve yalnızca
                radyo yayınlarına bağlantılar sağlar. Bu uygulama eğitim amaçlı
                olarak geliştirilmiştir ve hiçbir ticari kazanç amacı
                güdülmemektedir.
              </p>
              <p className="text-gray-300 mb-4">
                Uygulama, Next.js 15, ShadCN UI ve modern web teknolojileri
                kullanılarak geliştirilmiştir. Canlı radyo dinleme deneyimi sunar ve
                kullanıcıların favori radyolarını kaydetmelerine olanak tanır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Genel Bildirim - Kullanım Koşulları
              </h2>
              <p className="text-gray-300 mb-4">
                Bu site, kar amacı gütmeyen bir bireysel geliştirici tarafından
                oluşturulmuştur. RadyoZen radyo yayını üretmez; yalnızca mevcut
                Türk radyo kanallarına erişim sağlayan bağlantılar sunar.
              </p>
              <p className="text-gray-300 mb-4">
                Site kullanımı tamamen kullanıcı sorumluluğundadır.
                Bağlantıların çalışmaması, yayınların kesilmesi ya da erişim
                sorunları nedeniyle oluşabilecek herhangi bir zarar veya kesinti
                için site geliştiricisi hiçbir şekilde sorumlu tutulamaz.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Yayın ve Telif Hakları
              </h2>
              <p className="text-gray-300 mb-4">
                Uygulamadaki içeriklerin telif hakları ilgili radyo yayıncısına
                aittir. Bu site tüm yayın akışlarını sağlamaz; yalnızca mevcut,
                resmi kaynaklara bağlantı sunar.
              </p>
              <p className="text-gray-300 mb-4">
                Uygulamada kullanılan radyo istasyonlarının yayın akışları,
                ilgili istasyonların resmi kaynaklarından alınmaktadır. Herhangi
                bir içeriğin mülkiyeti veya hukuki yükümlülüğü bakımından
                geliştirici sorumluluk üstlenmemektedir.
              </p>
              <p className="text-gray-300 mb-4">
                Eğer bir yayıncı ya da hak sahibi bu uygulamanın herhangi bir
                içeriğinin telif hakkı ile korunan materyallerini kullanıyor
                olduğunu düşünüyorsa, lütfen aşağıdaki e-posta adresinden
                iletişime geçin:
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

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                İçerik ve Doğruluğun Garantisi Yoktur
              </h2>
              <p className="text-gray-300 mb-4">
                Site üzerinde yer alan bağlantıların doğruluğu veya güncelliği
                garanti edilmez. Radyo kanalları değişebilir, kaldırılabilir
                veya erişim sürekliliği bozulabilir. Kullanıcı bu tür riskleri
                kabul ederek siteyi kullanır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Çerezler ve Veri Kullanımı
              </h2>
              <p className="text-gray-300 mb-4">
                Bu sitede çerez (cookie) kullanılmamaktadır. Kullanıcıların
                favori radyo istasyonlarını kaydetmesine olanak sağlayan
                localStorage kullanımı dışında veri toplanmaz.
              </p>
              <p className="text-gray-300 mb-4">
                localStorage, web tarayıcılarında kullanılan bir veri depolama
                mekanizmasıdır. Kullanıcıların favori istasyonlarını kaydetmek
                için kullanılan bu sistem, verileri doğrudan kullanıcının kendi
                cihazında ve tarayıcısında saklar. Bu veriler sunucuya
                gönderilmez ve yalnızca kullanıcı tarafından erişilebilir.
                Kullanıcı tarayıcı ayarlarından bu verileri istediğiniz zaman
                silebilir.
              </p>
              <p className="text-gray-300 mb-4">
                Vercel Analytics kullanımı tamamen anonimdir; kişisel bilgi veya
                IP adresi toplanmaz. KVKK kapsamında anonim veriler kişisel veri
                sayılmasa da, bu bilgilendirme aydınlatma yükümlülüğü kapsamında
                sunulmuştur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Sorumluluk Reddi
              </h2>
              <p className="text-gray-300 mb-4">
                RadyoZen, bireysel, kar amacı gütmeyen bir projedir ve yalnızca
                radyo yayınlarına bağlantılar sağlar. Yayın kesintileri,
                linklerin çalışmaması veya teknik sorunlardan doğabilecek
                herhangi bir doğrudan ya da dolaylı zarar, kullanıcıya aittir.
                Geliştirici, bu tür aksaklıklardan sorumlu tutulamaz.
              </p>
              <p className="text-gray-300 mb-4">
                Yayın durumu, erişim engelleri veya teknik sorunlarla ilgili
                yükümlülük geliştiriciye ait değildir.
              </p>
              <p className="text-gray-300 mb-4">
                Siteyi kullanarak bu şartları ve yasal bildirimleri kabul etmiş
                sayılırsınız.
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
      
      {/* Structured Data for SEO */}
      <Script
        id="radyozen-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </div>
  );
}
