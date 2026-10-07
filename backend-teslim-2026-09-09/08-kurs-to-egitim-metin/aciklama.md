# "Kurs" → "Eğitim" metin değişikliği

Bu bir tek "bölüm" değil, **site genelinde metinlerde yapılan toplu bul-değiştir**
işlemidir. Kullanıcıya görünen tüm "Kurs" ifadeleri "Eğitim" ile değiştirildi
(menü, buton, başlık, form etiketi, kart metni vb.).

**Dosya adları DEĞİŞMEDİ** (`kurs-detay.html`, `tum-kurslar.html` vb. aynı kaldı) —
sadece ekranda görünen yazılar değişti.

## Örnek değişiklikler

| Önce | Sonra | Nerede |
|---|---|---|
| Öne Çıkan Kurslar | Öne Çıkan Eğitimler | Tüm sayfalarda tekrar eden bölüm başlığı |
| Tüm Kursları Gör | Tüm Eğitimleri Gör | Tüm sayfalarda tekrar eden buton |
| Kayıtlı Olduğum Kurslar | Kayıtlı Olduğum Eğitimler | Hesap menüsü dropdown'ı |
| Tüm Kurslar | Tüm Eğitimler | tum-kurslar.html başlık + breadcrumb |
| Kurs Ara... | Eğitim Ara... | Arama kutusu placeholder'ı |
| 25 Kurs / 30 Kurs / 15 Kurs | 25 Eğitim / 30 Eğitim / 15 Eğitim | Anasayfa + slider.html kategori kartları |
| Kurs Başlığı, Kurs Slug, Kurs Hakkında, Kurs Ayarları, Kurs Fiyatı, Kurs Oluştur, vb. | Eğitim Başlığı, Eğitim Slug, Eğitim Hakkında, Eğitim Ayarları, Eğitim Fiyatı, Eğitim Oluştur, vb. | sem-kurs-ekleme.html (eğitim ekleme formu) — form etiketlerinin tamamı |
| Kurslarım / Toplam Kurslar / Kurs Adı | Eğitimlerim / Toplam Eğitimler / Eğitim Adı | egitmen-panel.html (eğitmen paneli) |
| Modül Sınav Kursları | Modül Sınav Eğitimleri | Anasayfa + slider.html kategori kartı |

## Backend notu

Yeni bir metin eklerken "kurs" değil "eğitim" ifadesini kullanın. Bu değişiklik
saf metin (içerik) değişikliği olduğu için ayrı bir kod/CSS/JS etkisi yoktur.
