# Backend Ekibine — Değişiklikler (2026-11-09)

Bu klasör sitenin kopyası **DEĞİLDİR**. Yalnızca bu turda eklenen 3 alanın kod
parçacıklarıdır. Her klasörde: `html-degisiklik.html` (nereye ne basılacak) +
`sem-custom.css` / `sem-custom.js` (dosyanın SONUNA eklenecek blok).

| # | Alan | Ne yapıldı | Backend'in tek işi |
|---|---|---|---|
| [01](01-egitim-karti-tarih-rozeti/) | Eğitim kartı | "Kayıtlar Açık" rozetinin yanına **tarih rozeti** eklendi. | `<time datetime="YYYY-MM-DD">` içine en yakın grubun başlangıç tarihini basmak. |
| [02](02-egitim-takvimi/) | Eğitim detay → Eğitim Takvimi | Tablo kaldırıldı. Solda **aylık takvim**, sağda **grup detayları** var. | Her grup için bir `<li class="sem-takvim-grup">` basmak. **Takvim JS ile otomatik çizilir.** |
| [03](03-hizmet-ici-personel-girisi/) | Hizmet İçi Eğitimler | Sayfa açılınca **"Kapadokya Üniversitesi personeli misiniz?"** penceresi çıkıyor. | Personel girişi yapmış kullanıcıya modal bloğunu **basmamak**. |

---

## 01 — Tarih rozeti
- Durum rozeti artık `<div class="sem-card-badges">` içinde, yanında `<span class="sem-date-badge">` var.
- Tarih yoksa `sem-date-badge` span'ını basmayın.

## 02 — Eğitim takvimi (sadece liste basın, takvim kendiliğinden gelir)
```html
<li class="sem-takvim-grup" data-baslangic="2026-12-07" data-bitis="2026-12-18" data-son-kayit="2026-12-03">
  ... buton (grup adı, tarih aralığı, durum rozeti) + <dl> detaylar ...
</li>
```
- Takvimde işaretlenenler: `data-baslangic` → `data-bitis` aralığı (lacivert şerit, uçlar dolu daire), `data-son-kayit` (kırmızı nokta).
- Tarih formatı **YYYY-MM-DD** olmalı. Başka bir ayar yok.
- Varsayılan olarak durumu `acik` veya `son` olan ilk grup seçilir. Böyle bir grup yoksa listedeki ilk grup seçilir.
- Yan menüdeki tarih/kontenjan alanları da aynı (seçili) grubun değerleri olmalı.
- Eğitimin hiç grubu yoksa `#details` bloğunun tamamını basmayın.
- JS olmadan da çalışır: takvim gizlenir ve tüm grupların detayları açık listelenir.

## 03 — Personel girişi penceresi
- **En kolay yol:** Kullanıcı personel olarak giriş yaptıysa `#semPersonelModal` bloğunu basmayın. Başka bir şey gerekmez.
- Alternatif: Bloğu hep basın ve personel için `<script>window.__semPersonel = true;</script>` ekleyin (`window.__semAuth` ile aynı mantık).
- "Personel Girişi Yap" linkinin `href`'ini gerçek personel giriş adresinizle (SSO vb.) değiştirin. `returnUrl` ile bu sayfaya dönülür.
- "Personel değilim" linki `/egitimler`'e gider.
- ⚠️ Pencere yalnızca arayüzdür. **Asıl yetki kontrolü sunucuda yapılmalı.**

### JS bağlantısı
`02/sem-custom.js` ve `03/sem-custom.js` blokları `sem-custom.js` IIFE'sinin içine, `/* ── Global erişim */` satırının üstüne eklenir. Açılışta `initRevizyon()` çağrılır:
```js
document.addEventListener('DOMContentLoaded', initRevizyon);
```

---

## Taslak (semtaslak.kapadokya.edu.tr) ile eşitleme
Statik depo bu turda canlı taslağa göre eşitlendi, yani **tasarım ekibinin elindeki hal artık sizin taslağınızla aynı**:
- Header, menüler, kategoriler, gerçek eğitim/duyuru içerikleri, SSS, KVKK, Hakkımızda ve iletişim formu taslaktan alındı.
- Taslaktaki `sem-custom.css` / `sem-kurumsal.css` düzeltmeleri bire bir alındı. `sem-custom.js` de alındı; yalnızca route'lar statik dosya adlarına çevrildi.
- **Taslakta henüz olmayan önceki teslimlerimiz korunuyor, lütfen uygulayın:**
  - Footer "Hızlı Erişim" + "Kurumsal" sütunları (2026-10-07 / 02). Blog linki ve Twitter ikonu bu turda kaldırıldı.
  - Eğitim detay yan menüsü (tarih/kontenjan alanları) ve kapak altı gezinme menüsünün kaldırılması (2026-11-04).
- Önbellek sürümü: `?v=20261109`. Sizde zaten hash ile otomatik üretiliyor, işlem gerekmez.
