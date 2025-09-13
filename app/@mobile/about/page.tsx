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
            <h1 className="text-2xl font-bold">RadyoZen</h1>
            <p className="text-gray-400">Online Radyo Uygulaması</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10 mb-6">
            <div className="flex items-center mb-4">
              <div className="relative w-16 h-16 mr-4">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="RadyoZen Logo"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold">RadyoZen</h2>
                <p className="text-gray-400 text-sm">Modern Radyo Deneyimi</p>
              </div>
            </div>

            <p className="text-gray-300 mb-4">
              RadyoZen, bireysel, kar amacı gütmeyen bir projedir ve yalnızca
              radyo yayınlarına bağlantılar sağlar. Bu uygulama eğitim amaçlı
              olarak geliştirilmiştir ve hiçbir ticari kazanç amacı
              güdülmemektedir.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="font-bold mb-2">
                Genel Bildirim - Kullanım Koşulları
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Bu site, kar amacı gütmeyen bir bireysel geliştirici tarafından
                oluşturulmuştur. RadyoZen radyo yayını üretmez; yalnızca mevcut
                Türk radyo kanallarına erişim sağlayan bağlantılar sunar.
              </p>
              <p className="text-gray-400 text-sm">
                Site kullanımı tamamen kullanıcı sorumluluğundadır.
                Bağlantıların çalışmaması, yayınların kesilmesi ya da erişim
                sorunları nedeniyle oluşabilecek herhangi bir zarar veya kesinti
                için site geliştiricisi hiçbir şekilde sorumlu tutulamaz.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="font-bold mb-2">Yayın ve Telif Hakları</h3>
              <p className="text-gray-400 text-sm mb-4">
                Uygulamadaki içeriklerin telif hakları ilgili radyo yayıncısına
                aittir. Bu site tüm yayın akışlarını sağlamaz; yalnızca mevcut,
                resmi kaynaklara bağlantı sunar.
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Uygulamada kullanılan radyo istasyonlarının yayın akışları,
                ilgili istasyonların resmi kaynaklarından alınmaktadır. Herhangi
                bir içeriğin mülkiyeti veya hukuki yükümlülüğü bakımından
                geliştirici sorumluluk üstlenmemektedir.
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Eğer bir yayıncı ya da hak sahibi bu uygulamanın herhangi bir
                içeriğinin telif hakkı ile korunan materyallerini kullanıyor
                olduğunu düşünüyorsa, lütfen aşağıdaki e-posta adresinden
                iletişime geçin:
              </p>
              <p className="text-center text-white my-4">
                radyozen.destek@gmail.com
              </p>
              <p className="text-gray-400 text-sm">
                İlgili telif hakkı sahipleri tarafından talep edilmesi
                durumunda, ilgili içerik en kısa sürede kaldırılacaktır.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="font-bold mb-2">
                İçerik ve Doğruluğun Garantisi Yoktur
              </h3>
              <p className="text-gray-400 text-sm">
                Site üzerinde yer alan bağlantıların doğruluğu veya güncelliği
                garanti edilmez. Radyo kanalları değişebilir, kaldırılabilir
                veya erişim sürekliliği bozulabilir. Kullanıcı bu tür riskleri
                kabul ederek siteyi kullanır.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="font-bold mb-2">Çerezler ve Veri Kullanımı</h3>
              <p className="text-gray-400 text-sm mb-4">
                Bu sitede çerez (cookie) kullanılmamaktadır. Kullanıcıların
                favori radyo istasyonlarını kaydetmesine olanak sağlayan
                localStorage kullanımı dışında veri toplanmaz.
              </p>
              <p className="text-gray-400 text-sm">
                localStorage, web tarayıcılarında kullanılan bir veri depolama
                mekanizmasıdır. Kullanıcıların favori istasyonlarını kaydetmek
                için kullanılan bu sistem, verileri doğrudan kullanıcının kendi
                cihazında ve tarayıcısında saklar. Bu veriler sunucuya
                gönderilmez ve yalnızca kullanıcı tarafından erişilebilir.
                Kullanıcı tarayıcı ayarlarından bu verileri istediğiniz zaman
                silebilir.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <h3 className="font-bold mb-2">Sorumluluk Reddi</h3>
              <p className="text-gray-400 text-sm mb-4">
                RadyoZen, bireysel, kar amacı gütmeyen bir projedir ve yalnızca
                radyo yayınlarına bağlantılar sağlar. Yayın kesintileri,
                linklerin çalışmaması veya teknik sorunlardan doğabilecek
                herhangi bir doğrudan ya da dolaylı zarar, kullanıcıya aittir.
                Geliştirici, bu tür aksaklıklardan sorumlu tutulamaz.
              </p>
              <p className="text-gray-400 text-sm">
                Yayın durumu, erişim engelleri veya teknik sorunlarla ilgili
                yükümlülük geliştiriciye ait değildir. Siteyi kullanarak bu
                şartları ve yasal bildirimleri kabul etmiş sayılırsınız.
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
