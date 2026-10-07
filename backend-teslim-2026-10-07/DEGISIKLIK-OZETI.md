# Backend Ekibine — Değişiklikler (2026-10-07)

Bu klasör, sitenin tamamının kopyası **DEĞİLDİR**. Sadece bu turda değişen
alanların (kod parçacığı + önce/sonra) derlemesidir — her klasör bir "alan"a
karşılık gelir, ilgili alanı kendi projenizde bulup aynı şekilde güncelleyin.
Tam hali GitHub `main` dalında (commit `697cd8b` ve `b0f6240`).

| # | Alan | Ne değişti | Nerede |
|---|---|---|---|
| [01](01-one-cikan-egitimler-izgara/) | Anasayfa — Öne Çıkan Eğitimler | Yana kayan carousel kaldırıldı; kartlar **aynı boyutta alt alta** (masaüstü 3, tablet 2, mobil 1 sütun). Oklar + ilerleme çubuğu silindi. | `anasayfa.html`, `sem-custom.css`, `sem-custom.js` |
| [02](02-footer-hizli-erisim-kurumsal/) | Footer | "Sayfalar" sütunu **"Hızlı Erişim" + "Kurumsal"** olarak ikiye bölündü. | Footer, 25 sayfa |
| [03](03-anasayfa-slider-yukseklik/) | Anasayfa slider | Sabit 640px yükseklik → **ekran yüksekliğine göre** (440–640px, mobil 380–460px). Ölçekli/zoom'lu ekranlarda slider artık tüm ekranı kaplamıyor. | `sem-custom.css` |
| [04](04-basvuru-modali/) | Başvuru modalı | Okunmayan başlık + karanlık modda kaybolan yazılar düzeltildi; **doğrulama + teşekkür ekranı** eklendi; veri `sem:apply-submit` olayıyla yayınlanıyor. | 7 sayfa, `sem-custom.css`, `sem-custom.js` |
| [05](05-iletisim-formu/) | İletişim formu | Karanlık modda kaybolan "Bize Yazın" başlığı + "Konu" select yüksekliği düzeltildi. | `iletisim.html` (CSS) |
| [06](06-css-js-onbellek-surumu/) | Önbellek | `sem-custom.css/js` bağlantılarına `?v=20261007` eklendi — tarayıcı eski dosyayı göstermesin. | 26 sayfa |

---

## Backend'e düşen işler
1. **Başvuru formunu API'ye bağlamak** — `sem:apply-submit` olayını dinleyin (örnek kod: [04/aciklama.md](04-basvuru-modali/aciklama.md)). Sunucu tarafı doğrulama da şart.
2. **`?v=` sürümünü** her CSS/JS değişikliğinde güncellemek (tercihen otomatik hash).

## Hâlâ bekleyen içerikler
1. Slider için **en az 1920×900** yatay görseller (mevcut 710×488 — bulanık görünüyor)
2. Hero videoları: `assets/videos/sem-hero-mobile.mp4`, `sem-hero-desktop.mp4` (klasör henüz yok)
3. 1500×1000 gerçek eğitim kartı görselleri
4. Gerçek GA4 Measurement ID
5. Çerez/Sözleşme/KVKK güncel metni
6. Mikro Yeterlilik gerçek program listesi

Daha fazla teknik detay için ana projedeki `README.md` (§3, §5.3, §8).
