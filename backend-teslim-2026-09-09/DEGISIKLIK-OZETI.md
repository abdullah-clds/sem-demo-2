# Backend Ekibine — Bugünkü Değişiklikler (2026-09-09)

Bu klasör, sitenin tamamının kopyası **DEĞİLDİR**. Sadece bugün değişen
alanların (kod parçacığı + önce/sonra) derlemesidir — her klasör bir "alan"a
karşılık gelir, ilgili alanı kendi projenizde bulup aynı şekilde güncelleyin.

| # | Alan | Ne değişti | Nerede |
|---|---|---|---|
| [01](01-google-analytics/) | Google Analytics | Tüm sayfalara GA4 kodu eklendi, **geçici (placeholder) ID** ile (`G-XXXXXXXXXX`). Gerçek Ölçüm Kimliği geldiğinde toplu bul-değiştir yeterli. | Her sayfanın `<head>` sonu |
| [02](02-ust-menu-sem-hakkinda-kaldirildi/) | Üst menü | "SEM Hakkında" dropdown'ı (5 alt link) üst menüden tamamen kaldırıldı, "Mikro Yeterlilik" linki eklendi. | Masaüstü + mobil menü, tüm sayfalar |
| [03](03-footer-guncellemeleri/) | Footer | Menüden kaldırılan "SEM Hakkında" ve "Ekibimiz" linkleri footer'ın "Sayfalar" sütununa eklendi (erişim kaybolmasın diye). | Footer, tüm sayfalar |
| [04](04-egitim-karti-gorseli-orani/) | Eğitim kartı görseli | Görsel oranı dikeyden (4:5) **yataya (1500×1000, 3:2)** çevrildi. | `sem-custom.css`, tek kural — site geneli |
| [05](05-egitim-karti-pasif-gorunum/) | Eğitim kartı — pasif durum | "Yakında" / "Kayıtlar Kapandı" kartları artık soluk/gri görünüyor. `data-durum` attribute'una göre otomatik. | `sem-custom.css` |
| [06](06-arama-kutusu-tasindi/) | Arama kutusu | Filtre sidebar'ından çıkarılıp sayfanın en üstüne taşındı. | `tum-kurslar.html`, `hizmet-ici-egitimler.html` |
| [07](07-anasayfa-hero-video/) | Anasayfa hero video | Mobil/masaüstü için ayrı video oynatma altyapısı eklendi. **Video dosyası henüz yok**, sadece hazır — poster (mevcut görsel) fallback. | `anasayfa.html` hero, 1. slayt |
| [08](08-kurs-to-egitim-metin/) | "Kurs" → "Eğitim" | Kullanıcıya görünen tüm "kurs" metinleri "eğitim" ile değiştirildi (dosya adları aynı kaldı). | Site geneli — örnekler dosyada |
| [09](09-sinav-merkezi-menu-guncellemesi/) | Sınav Merkezleri menüsü | "Modül Sınav Merkezi" → "SHGM Sınav Merkezi", yeni "PEMER" linki eklendi. | Masaüstü/mobil menü + footer widget'ı, tüm sayfalar |
| [10](10-yeni-sayfalar-referans/) | Yeni sayfalar | `mikro-yeterlilik.html`, `pemer.html` canlıda; `slider-tasarimlari.html` sadece inceleme amaçlı demo. | Tamamen yeni dosyalar, "önce/sonra" yok |

---

## Özetle bekleyen 5 şey
1. 1500×1000 gerçek eğitim görselleri (bkz. madde 04)
2. Gerçek GA4 Measurement ID (bkz. madde 01)
3. Çerez/Sözleşme/KVKK güncel metni — bu turda değiştirilmedi, ayrıca hukuk ekibinden gelecek
4. Hero için mobil+masaüstü video dosyası (bkz. madde 07)
5. Mikro Yeterlilik gerçek program listesi (bkz. madde 10)

Daha fazla teknik detay için ana projedeki `README.md`'ye bakabilirsiniz.
