# Backend Ekibine — Değişiklikler (2026-11-09)

Bu klasör sitenin kopyası **DEĞİLDİR**. Yalnızca bu turda eklenen 4 alanın kod
parçacıklarıdır. Her klasörde: `html-degisiklik.html` (nereye ne basılacak) +
`sem-custom.css` / `sem-custom.js` (dosyanın SONUNA eklenecek blok).

| # | Alan | Ne yapıldı | Backend'in tek işi |
|---|---|---|---|
| [01](01-egitim-karti-tarih-rozeti/) | Eğitim kartı | "Kayıtlar Açık" rozetinin yanına aynı ölçüde, mavi **tarih rozeti** eklendi (anasayfa vitrininde görselin sağ üstünde). | `<time datetime="YYYY-MM-DD">` içine en yakın grubun başlangıç tarihini basmak. |
| [02](02-egitim-takvimi/) | Eğitim detay → Eğitim Takvimi | Tablo kaldırıldı. Solda **aylık takvim**, sağda **grup detayları** var. | Her grup için bir `<li class="sem-takvim-grup">` basmak. **Takvim JS ile otomatik çizilir.** |
| [03](03-hizmet-ici-personel-girisi/) | Hizmet İçi Eğitimler | Sayfa açılınca **"Kapadokya Üniversitesi personeli misiniz?"** penceresi çıkıyor. | Personel girişi yapmış kullanıcıya modal bloğunu **basmamak**. |
| [04](04-liste-gorunumu-yatay-gorsel/) | Eğitim listesi → Liste görünümü | Görsel kart boyunca dikey uzuyordu; artık **yatay 3:2** (masaüstü 300px, tablet 240/180px, mobil 140px genişlik). | Yok — yalnızca CSS (`sem-custom.css` §11 ve tablet/mobil liste kuralları, diff dosyada). |

---

## 01 — Tarih rozeti
- Durum rozeti artık `<div class="sem-card-badges">` içinde, yanında `<span class="sem-date-badge">` var.
- Tarih yoksa `sem-date-badge` span'ını basmayın.

## 02 — Eğitim takvimi (sadece liste basın, takvim kendiliğinden gelir)
```html
<li class="sem-takvim-grup" data-baslangic="2026-12-07" data-saat="09:30" data-bitis="2026-12-18" data-son-kayit="2026-12-03">
  ... buton (tarih aralığı + başlangıç saati, durum rozeti) + <dl> detaylar (Başlangıç, Bitiş, Saat, Son Kayıt, Son İptal, Kontenjan) ...
</li>
```
- Takvimde işaretlenenler: `data-baslangic` → `data-bitis` aralığı (lacivert şerit, uçlar dolu daire), `data-son-kayit` (kırmızı nokta).
- Tarih formatı **YYYY-MM-DD**, saat formatı **HH:MM** olmalı. `data-saat` takvimin altında "Başlangıç 09:30" olarak gösterilir. Saat yoksa bu alan basılmaz.
- Grup adı ("1. Grup" vb.) kullanılmıyor, satırda yalnızca tarih aralığı var.
- Varsayılan olarak durumu `acik` veya `son` olan ilk grup seçilir. Böyle bir grup yoksa listedeki ilk grup seçilir.
- Yan menüdeki tarih/kontenjan alanları da aynı (seçili) grubun değerleri olmalı.
- Eğitimin hiç grubu yoksa `#details` bloğunun tamamını basmayın.
- JS olmadan da çalışır: takvim gizlenir ve tüm grupların detayları açık listelenir.
- JS: `02/sem-custom.js` bloğu `sem-custom.js` IIFE'sinin içine, `/* ── Global erişim */` satırının üstüne eklenir; açılışta `initRevizyon()` çağrılır.

---

## 03 — Personel girişi penceresi
- **En kolay yol:** Kullanıcı personel olarak giriş yaptıysa `#semPersonelModal` bloğunu basmayın. Başka bir şey gerekmez.
- Alternatif: Bloğu hep basın ve personel için `<script>window.__semPersonel = true;</script>` ekleyin (`window.__semAuth` ile aynı mantık).
- "Personel Girişi Yap" linkinin `href`'ini gerçek personel giriş adresinizle (SSO vb.) değiştirin. `returnUrl` ile bu sayfaya dönülür.
- "Personel değilim" linki `/egitimler`'e gider.
- JS: `03/sem-custom.js` bloğu da `02` ile aynı yere eklenir; `initRevizyon()` içinde `initPersonelModal()` çağrılır.
- ⚠️ Pencere yalnızca arayüzdür. **Asıl yetki kontrolü sunucuda yapılmalı.**

---

## Taslak (semtaslak.kapadokya.edu.tr) ile eşitleme
Statik depo bu turda canlı taslağa göre eşitlendi, yani **tasarım ekibinin elindeki hal artık sizin taslağınızla aynı**:
- Header, menüler, kategoriler, gerçek eğitim/duyuru içerikleri, SSS, KVKK, Hakkımızda ve iletişim formu taslaktan alındı.
- Taslaktaki `sem-custom.css` / `sem-kurumsal.css` düzeltmeleri bire bir alındı. `sem-custom.js` de alındı; yalnızca route'lar statik dosya adlarına çevrildi.
- **Taslakta henüz olmayan önceki teslimlerimiz korunuyor, lütfen uygulayın:**
  - Footer "Hızlı Erişim" + "Kurumsal" sütunları (2026-10-07 / 02). Blog linki ve Twitter ikonu bu turda kaldırıldı.
  - Eğitim detay yan menüsü (tarih/kontenjan alanları) ve kapak altı gezinme menüsünün kaldırılması (2026-11-04).
- Önbellek sürümü: `?v=202611094`. Sizde zaten hash ile otomatik üretiliyor, işlem gerekmez.
