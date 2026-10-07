# CSS/JS Önbellek Sürümü

## Ne değişti
26 HTML sayfasında özel stil ve script bağlantılarına sürüm parametresi eklendi:

```html
<!-- ÖNCESİ -->
<link rel="stylesheet" href="./assets/css/sem-custom.css" />
<script src="./assets/js/sem-custom.js"></script>

<!-- SONRASI -->
<link rel="stylesheet" href="./assets/css/sem-custom.css?v=20261007" />
<script src="./assets/js/sem-custom.js?v=20261007"></script>
```
(`sem-custom.js` 21 sayfada yüklü; kalan 5 sayfa bu dosyayı kullanmıyor.)

## Neden
Tarayıcılar CSS/JS dosyalarını önbellekte tutuyor. Dosya güncellense bile kullanıcı
eski sürümü görmeye devam edebiliyordu (ör. düzeltilen modal başlığı yayında hâlâ
okunmuyor görünüyordu). URL değişince tarayıcı dosyayı yeniden indirir.

## Backend için
- `sem-custom.css` / `sem-custom.js` her değiştiğinde `?v=` değeri güncellenmeli
  (tarih `YYYYMMDD` biçiminde).
- Backend şablon motoruna geçince bunu elle yapmak yerine dosya hash'i veya build
  numarası ile otomatik üretmeniz önerilir (ör. `sem-custom.css?v={{ asset_hash }}`).
