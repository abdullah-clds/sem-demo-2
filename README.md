# Kapadokya Üniversitesi SEM — Backend Entegrasyon Rehberi

Bu depo, SEM (Sürekli Eğitim Merkezi) web sitesinin **statik HTML/CSS/JS** prototipidir. Tasarım süreci tamamlanmıştır. Bu doküman, siteyi dinamik/backend'li bir sisteme (CMS, veritabanı, form işleme vb.) bağlayacak ekip için hazırlanmıştır: hangi alanın nereden geleceği, görsel ölçüleri, form alanları ve mevcut istemci-taraflı (client-side) davranışları özetler.

---

## 1. Genel Mimari

- **Statik şablon**, HiStudy (vendor) teması üzerine kurulu. Vendor dosyalarına (`assets/css/styles.css`, `assets/js/main.js`, `assets/css/vendor/*`, `assets/js/vendor/*`) **dokunulmamıştır** — tüm özel stil `assets/css/sem-custom.css` + `assets/css/sem-kurumsal.css` içinde, tüm özel script `assets/js/sem-custom.js` içindedir. Backend entegrasyonunda da bu ayrım korunmalı: yeni JS/CSS bu iki dosyaya eklenmeli, vendor dosyaları değiştirilmemeli.
- **Şu an hiçbir sayfa `fetch`/AJAX kullanmıyor.** Kurs filtreleme, arama, modal açma gibi tüm etkileşimler DOM üzerinde göster/gizle mantığıyla (`assets/js/sem-custom.js`) çalışıyor. Backend'e bağlanınca bu client-side filtreleme muhtemelen server-side/API tabanlı listelemeye dönüşecek.
- **Tüm formlar `novalidate`/`onsubmit` ile front-end'de duruyor, hiçbiri gerçek bir endpoint'e POST etmiyor.** `action="#"` veya `event.preventDefault()` ile engellenmiş durumda — gerçek submit mantığı backend tarafından eklenecek.
- Sayfa dili `lang="tr"`, tüm metinler Türkçe.
- Yerel önizleme: `python3 -m http.server` ile proje kökünden çalıştırılabilir (dosya `file://` ile açılırsa bazı göreli path'ler ve fetch benzeri davranışlar sorun çıkarabilir).

---

## 2. Sayfa Envanteri

### 2.1 Statik içerik sayfaları (backend'de genelde "sayfa" / CMS-tekil-içerik olur)

| Dosya                          | İçerik                                                                                                                                                        | Not                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `anasayfa.html`                | Ana sayfa: hero slider, arama, öne çıkan eğitimler, hakkımızda, sayaçlar, kategoriler, sınav/akredite merkezleri, kurumsal CTA, son yazılar, SSS özetine link | En çok bölüm içeren sayfa                                                    |
| `sem-hakkinda.html`            | Hakkımızda / vizyon-misyon                                                                                                                                    | Statik metin                                                                 |
| `idare.html`                   | SEM Yönetim Kurulu (5 üye kartı)                                                                                                                              | Üye kartları → bkz. §5.4                                                     |
| `ekibimiz.html`                | Ekibimiz                                                                                                                                                      | **Gerçek ekip fotoğraf/isim/unvan bekleniyor** (şu an idare.html'in kopyası) |
| `faaliyet-raporlari.html`      | Yıllık faaliyet raporları (6 kart, 2019–2024)                                                                                                                 | Her kart bir **PDF indirme linki** bekliyor (`href="#"`)                     |
| `sozlesmeler.html`             | Sözleşme/yönetmelik listesi                                                                                                                                   | Placeholder belgeler                                                         |
| `kvkk.html`                    | KVKK aydınlatma metni                                                                                                                                         | Statik                                                                       |
| `sss.html`                     | SSS — 30 soru, 6 sekme (Genel/Kayıt/Süreç/Sertifika/Ödeme/Kurumsal)                                                                                           | Statik accordion                                                             |
| `iletisim.html`                | İletişim: adres (Nevşehir + İstanbul), harita gömme, form                                                                                                     | Form → bkz. §5.2                                                             |
| `egitim-kaynak-saglayici.html` | EKS (Eğitim Kaynak Sağlayıcı) içerik sayfası                                                                                                                  | Statik, CMS şablonu (`article.sem-icerik`)                                   |
| `pemer.html`                   | PEMER/MYK içerik sayfası                                                                                                                                      | Statik, aynı CMS şablonu                                                     |
| `hizmet-ici-egitimler.html`    | Hizmet içi eğitimler listesi (12 kart)                                                                                                                        | **Gerçek içerik listesi bekleniyor**, kart şeması kurs kartıyla aynı (§5.3)  |
| `mikro-yeterlilik.html`        | Mikro Yeterlilik programları listesi (6 kart)                                                                                                                | **Gerçek program listesi bekleniyor** (2026-09-09), `tum-kurslar.html` ile birebir aynı şablon/filtre yapısı |
| `slider.html`                  | Anasayfa hero'sunun eski tasarım denemesi                                                                                                                     | **Muhtemelen canlıya alınmayacak / silinebilir**, backend kapsamına almayın  |
| `slider-tasarimlari.html`      | Hero slider için 4 tasarım seçeneği (A/B/C/D) — inceleme sayfası                                                                                             | **Canlıya alınmayacak**, navigasyonda yok; kullanıcı seçim yapınca silinebilir |

### 2.2 Dinamik/listeleme sayfaları (backend'de koleksiyon/model olması gereken)

| Dosya                                  | Model                         | Not                                                                          |
| -------------------------------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| `tum-kurslar.html`                     | **Eğitim/Kurs** listesi       | Filtre + arama; şu an 12 statik kart. Veri şeması §5.3                       |
| `kurs-detay.html`                      | **Eğitim/Kurs** detay         | `?id=` gibi bir parametre ile tekil kayıt çekmeli. Alan listesi §5.5         |
| `blog.html` / `blog-detay.html`        | **Blog yazısı** listesi/detay | `blog-detay.html?id=N` deseniyle çalışıyor (query param, gerçek route değil) |
| `duyurular.html` / `duyuru-detay.html` | **Duyuru** listesi/detay      | Aynı `?id=N` deseni                                                          |

### 2.3 Kimlik / hesap sayfaları

| Dosya                  | Not                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `kayit-ol.html`        | Kayıt formu, alanlar §5.1                                                                                     |
| `giris.html`           | Giriş formu. Şu an submit'te doğrudan `egitmen-panel.html`'e yönlendiriyor (**gerçek auth yok**, demo amaçlı) |
| `egitmen-panel.html`   | Kullanıcı paneli (placeholder)                                                                                |
| `sem-kurs-ekleme.html` | Eğitmen kurs ekleme formu (placeholder)                                                                       |

**Not:** `hesabim.html` daha önce vendor bağımlılıkları eksik olduğu için kaldırıldı; tüm "Profilim/Ayarlar" linkleri `egitmen-panel.html`'e yönlendiriliyor.

---

## 3. Görsel Ölçüleri

Aşağıdaki tablo, her alanda **CSS'in zorladığı en-boy oranı** ve **önerilen kaynak (export) çözünürlüğü**dür. Tüm kart görselleri `object-fit:cover` ile kırpılıyor — oran tutmayan görsel otomatik kırpılır, bu yüzden kaynağın olabildiğince belirtilen orana yakın gelmesi önemlidir.

| Alan                                                                    | CSS oranı                                                                                   | Önerilen min. çözünürlük                                                               | Şu anki durum                                                                                                                        |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero slider** (anasayfa, `.sem-hero-slide`)                           | Sabit yükseklik (masaüstü 640px, mobil 420px), `background-size:cover` — **sabit oran yok** | **1920×900** (geniş, özneyi ortada tutun — kenarlar kırpılabilir)                      | Mevcut görseller yalnızca **710×488**, hedefin çok altında — yenilenmesi önerilir                                                    |
| **Eğitim kartı görseli** (`.sem-course-card .rbt-card-img`)        | **3:2 yatay**                                                                               | **1500×1000**                                                                          | 2026-09-09 revizyonunda 4:5 dikeyden 1500×1000 yataya çevrildi (kilitli kararın tersine, kullanıcı onayıyla). Mevcut görseller CSS ile kırpılıyor, gerçek 1500×1000 görseller bekleniyor |
| **Blog / Duyuru kartı görseli** (`.sem-duyuru-gorsel`)                  | **3:2 yatay**                                                                               | **1200×800**                                                                           | Mevcut `blog-card-01.jpg` 638×330 (oran uyuşmuyor, kırpılıyor)                                                                       |
| **Ekip / Yönetim Kurulu üye fotoğrafı** (`idare.html`, `ekibimiz.html`) | **4:5 dikey**                                                                               | **900×1125**                                                                           | Stüdyo tipi, tek kişi, baş+omuz kadraj önerilir                                                                                      |
| **Logo (header, koyu üstte)** `sem-logo.png`                            | Serbest, `max-height` ile ölçekleniyor                                                      | Mevcut 250×103 (retina için 2× = 500×206 önerilir)                                     | PNG, şeffaf zemin                                                                                                                    |
| **Logo (footer/beyaz varyant)** `sem-logo-byz.png`                      | Serbest                                                                                     | Mevcut 1956×804 — **gereğinden büyük, optimize/sıkıştırılmalı**                        | PNG, şeffaf zemin                                                                                                                    |
| **Favicon** `simge.png`                                                 | Kare olması beklenir                                                                        | Mevcut **150×164 kare değil** — 512×512 kare, şeffaf zemin olarak yenilenmesi önerilir | —                                                                                                                                    |
| **Faaliyet raporu kartı**                                               | Görsel yok, yalnızca yıl/etiket + PDF linki                                                 | —                                                                                      | Her karta gerçek PDF dosyası bağlanmalı                                                                                              |

> **Genel kural:** Bu projede `html { font-size: 10px }` tanımlıdır (`1rem = 10px`, standart 16px değil). Yeni CSS/tema çalışmasında `rem` yerine `px` kullanılmalı — aksi halde yazı tipi boyutları beklenmeyen şekilde küçülür.

---

## 4. Kategori Sözlüğü

Kurs/eğitim filtrelemesinde kullanılan `data-kategori` değerleri (bkz. §5.3) — backend'de kategori tablosu/enum olarak bu slug'larla eşleşmeli:

`havacilik`, `dil`, `kisisel-gelisim`, `saglik`, `gastronomi`, `turizm`, `bilisim`, `egitim`, `pemer-myk`

---

## 5. Formlar ve Veri Şemaları

### 5.1 Kayıt Formu (`kayit-ol.html`, `#` — form id yok, `<form>` doğrudan)

| Alan (name)             | Tip                                                                                                  | Zorunlu   |
| ----------------------- | ---------------------------------------------------------------------------------------------------- | --------- |
| `name`                  | text                                                                                                 | ✓         |
| `dogum_tarihi`          | date                                                                                                 | ✓         |
| `cinsiyet`              | select                                                                                               | ✓         |
| `vatandaslik`           | select (T.C. / Yabancı)                                                                              | ✓         |
| `kimlik_no`             | text (T.C. Kimlik No / Pasaport No — `vatandaslik` seçimine göre JS ile label/placeholder değişiyor) | ✓         |
| `email`                 | email                                                                                                | ✓         |
| `ogrenci_no`            | text                                                                                                 | opsiyonel |
| `password`              | password                                                                                             | ✓         |
| `password_confirmation` | password                                                                                             | ✓         |
| KVKK onay               | checkbox (name yok, `id="sem-auth-kvkk"`)                                                            | ✓         |

### 5.2 İletişim Formu (`iletisim.html`, `#sem-contact-form`)

| Alan (name) | Tip      |
| ----------- | -------- |
| `ad_soyad`  | text     |
| `telefon`   | tel      |
| `eposta`    | email    |
| `konu`      | select   |
| `mesaj`     | textarea |

### 5.3 Eğitime Başvuru / Talep Modalı (`#semApplyModal`, `#semApplyForm`) — 6 sayfada ortak

JS `openApplyModal(mode, courseId, courseName)` ile açılıyor (`assets/js/sem-custom.js`). `mode` üç değer alır ve modal başlığını değiştirir:

- `basvuru` → "Eğitime Başvur" (kurs kartlarındaki "Başvur" butonu)
- `talep` → "Eğitim Talebi Bırak"
- `kurumsal` → "Kurumsal Eğitim Talebi" (bu modda eğitim adı satırı gizleniyor)

Form alanları:

| Alan (name)   | Tip                                                              | Zorunlu   |
| ------------- | ---------------------------------------------------------------- | --------- |
| `course_id`   | hidden — `openApplyModal`'a geçilen `courseId`                   | —         |
| `egitim`      | text, readonly — `courseName` ile dolduruluyor                   | —         |
| `kategori`    | select (10 seçenek, §4'teki slug'lar)                            | ✓         |
| `ad_soyad`    | text                                                             | ✓         |
| `telefon`     | tel                                                              | ✓         |
| `eposta`      | email                                                            | ✓         |
| `kun_ogrenci` | radio (evet/hayır) — "Kapadokya Üniversitesi öğrencisi misiniz?" | ✓         |
| `mesaj`       | textarea                                                         | opsiyonel |
| `kvkk`        | checkbox                                                         | ✓         |

### 5.4 Kurs Kartı Veri Şeması (`tum-kurslar.html`, `hizmet-ici-egitimler.html`, anasayfa "Öne Çıkan Eğitimler")

Her kart `.sem-course-card` üzerinde şu `data-*` alanlarını taşıyor — backend modelinde karşılık gelen alanlar:

| data-attribute  | Anlamı                                | Örnek değerler                                                                                                            |
| --------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `data-ad`       | Eğitim adı                            | serbest metin                                                                                                             |
| `data-kategori` | Kategori slug'ı                       | §4'teki liste                                                                                                             |
| `data-format`   | Eğitim formatı                        | `yuz-yuze`, `online`, `hibrit`                                                                                            |
| `data-gun`      | Gün tipi                              | `haftaici`, `haftasonu`                                                                                                   |
| `data-ucret`    | Ücret durumu                          | `ucretli`, `ucretsiz` (tam liste için `tum-kurslar.html` filtre widget'ına bakın)                                         |
| `data-durum`    | Kayıt durumu (rozet rengini belirler) | `acik` (Kayıtlar Açık), `son` (Son Kontenjan), `yakinda` (Yakında), `kapandi` (Kayıtlar Kapandı), `talep` (Talep Üzerine) |

Kart içi görünür alanlar: görsel (§3), başlık, kısa açıklama (`.rbt-card-text`), meta listesi (format/kategori/gün ikon+etiket), "Başvur" butonu (`openApplyModal('basvuru', id, ad)`), "Detaylar" linki (`kurs-detay.html` — gerçek entegrasyonda `kurs-detay.html?id=...` olmalı).

### 5.5 Kurs Detay Sayfası Alanları (`kurs-detay.html`)

Statik olarak şu alanlar var, backend'de kurs modeline karşılık gelmeli:

- Başlık, kategori, kısa açıklama
- "Neler Öğreneceksiniz?" listesi (6 madde)
- Eğitim süresi, eğitim kodu, ders sayısı, seviye, dil, sınav sayısı, sertifika (Evet/Hayır), geçme yüzdesi
- Sertifika ve Belgelendirme bölümü (tür, e-Devlet doğrulama, KÜN mührü — 3 kart)
- Sidebar başvuru widget'ı (`openApplyModal` butonları) + sabit mobil alt "Başvur" çubuğu
- Not: Puan/yorum/eğitmen-fotoğrafı gibi alanlar bilinçli olarak kaldırıldı, **eklenmemeli**

---

## 6. Bilinen Teknik Borç / Backend Ekibinin Dikkat Etmesi Gerekenler

1. **`giris.html` gerçek auth içermiyor** — submit doğrudan `egitmen-panel.html`'e yönlendiriyor. Gerçek oturum/token mekanizması eklenmeli.
2. **Tüm listeleme/filtreleme client-side** (`assets/js/sem-custom.js` → `filterCards()`), sayfadaki tüm kartlar DOM'da hazır halde geliyor. API'ye bağlanınca ya (a) sunucu tarafında filtrelenmiş HTML render edilmeli, ya da (b) mevcut filtre UI'sı API çağrısı yapacak şekilde yeniden yazılmalı.
3. **Blog/Duyuru detay sayfaları `?id=` query param bekliyor** ama şu an bu parametreyi okuyup içerik değiştiren bir JS yok — sayfa içeriği hâlâ statik. Gerçek route/param okuma backend'de kurulmalı.
4. **`newsletter-form` (footer) ve arama formları (`sem-header-search-form`, `sem-hero-search-form`) gerçek bir endpoint'e bağlı değil** — arama formu yalnızca `tum-kurslar.html?q=...`'a yönlendiriyor (client-side arama da yok, sadece URL parametresi taşıyor).
5. **Faaliyet raporu PDF linkleri (`href="#"`)** gerçek dosyalarla değiştirilmeli.
6. **`slider.html`** üretim kapsamı dışında tutulmalı; anasayfanın eski/deneme kopyasıdır.
7. **`egitmen-panel.html`, `sem-kurs-ekleme.html`** tamamen placeholder; gerçek panel akışı backend ile birlikte yeniden tasarlanmalı.

---

## 7. Önerilen Entegrasyon Sırası (Yol Haritası)

1. **İçerik modelleri**: Kurs/Eğitim, Blog Yazısı, Duyuru, Faaliyet Raporu, Ekip Üyesi — şema önerileri §5'te.
2. **Kimlik doğrulama**: `kayit-ol.html` / `giris.html` alanlarını gerçek auth servisine bağlama.
3. **Kurs listeleme + filtre API'si**: `tum-kurslar.html` filtre widget'larını (`data-filter="kategori|format|gun|ucret"`) API sorgu parametrelerine eşleştirme.
4. **Kurs detay + başvuru formu**: `kurs-detay.html?id=` route'u, `#semApplyModal` submit'inin gerçek bir "başvuru" kaydına yazması.
5. **Blog/Duyuru CRUD + detay route'ları**.
6. **İletişim formu + bülten formu** gönderim entegrasyonu.
7. **Statik varlıkların (PDF, ekip fotoğrafları, hizmet içi eğitim içeriği) gerçek içerikle değiştirilmesi** (§2.1'deki "bekleniyor" notları).

---

---

## 8. Değişiklik Günlüğü

Her revizyon turu burada tarihli olarak listelenir: hangi dosyada ne değişti, backend'i nasıl etkiler. Yeni bir tur geldiğinde en üste eklenir.

### 2026-09-09 — Yedinci revizyon turu

**Genel / Teknik:**
- **Kurs kartı görselleri 4:5 dikeyden 1500×1000 (3:2 yatay) orana çevrildi** (`assets/css/sem-custom.css`, `.sem-course-card .rbt-card-img`). Önceki turda "kilitli karar" olarak işaretlenmiş dikey oran, kullanıcı onayıyla tersine çevrildi. **Backend etkisi:** Kurs/eğitim görseli CMS alanı artık **1500×1000 yatay** olarak export edilmeli (§5 tablosu güncellendi).
- **Google Analytics (GA4) placeholder snippet'i 23 sayfanın `<head>`'ine eklendi** (`gtag.js`, Measurement ID = `G-XXXXXXXXXX` placeholder). **Backend/IT etkisi:** Gerçek GA4 Measurement ID geldiğinde her sayfada `G-XXXXXXXXXX` metnini gerçek ID ile değiştirin (2 yerde: `<script src="...?id=...">` ve `gtag('config', '...')`) — tek tek dosya yerine toplu bul-değiştir yapılabilir.
- **Çerez politikası, satış sözleşmesi, KVKK metinleri GÜNCELLENMEDİ** — kullanıcı, gerçek hukuki metnin ayrıca (Metin Bey / hukuk ekibi tarafından) sağlanacağını belirtti. `kvkk.html` ve `sozlesmeler.html` şu anki (önceki turdan kalma) içerikleriyle duruyor. **Backend etkisi:** Bu iki sayfanın içeriği henüz nihai değil, gerçek metin gelmeden yayına alınmamalı.
- **Anasayfa pop-up anket eklenmedi** — kullanıcı bu maddeyi bu turda ertelettirdi ("şimdilik yapma"). Gelecek bir turda ele alınacak, henüz kapsam/soru içeriği belirlenmedi.

**Tasarımsal:**
- **"Kurs" ifadesinin tamamı "Eğitim" ile değiştirildi** — site genelinde ~140 görünür metin (menü, buton, placeholder, rozet, admin panel etiketleri) Türkçe dilbilgisi kurallarına uygun şekilde güncellendi (`Kurslar→Eğitimler`, `Kursu→Eğitimi` vb.). Yalnızca dosya adları (`kurs-detay.html`, `tum-kurslar.html`, `sem-kurs-ekleme.html`) ve CSS/JS içindeki `kurs-detay-page` gibi teknik sınıf isimleri değişmedi (kullanıcıya görünmüyor).
- **"SEM Hakkında" üst menüden kaldırıldı, footer'a taşındı** — 22 sayfanın tamamında (desktop dropdown + mobil menü) "SEM Hakkında" alt menüsü (Hakkımızda, İdare, Ekibimiz, Yönetmelik, Faaliyet Raporları) silindi; footer "Sayfalar" sütununa "SEM Hakkında" ve "Ekibimiz" linkleri eklendi (İdare ve Faaliyet Raporları zaten footer'da vardı).
- **Arama kutusu filtre sidebar'ından ayrılıp toolbar'a (üste) taşındı** — `tum-kurslar.html` + `hizmet-ici-egitimler.html`: `rbt-widget-search` sidebar widget'ı kaldırıldı, aynı `#sem-search-input` artık `rbt-course-top-wrapper` içinde, sonuç sayısı/sıralama satırının ÜSTÜNDE, tam genişlikte (`max-width:640px`, ortalanmış) bir satır olarak duruyor. Filtre mantığı (`sem-custom.js filterCards()`) değişmedi, aynı id kullanılıyor.
- **"Yakında" / "Kayıtlar Kapandı" durumundaki kurs kartları pasif görünüme alındı** (`data-durum="yakinda"` / `"kapandi"`) — kart görseli griye çekildi (`grayscale(70%)`, opaklık düşürüldü), başlık soluklaştı, buton rengi gri tona döndü. "Kayıtlar Açık" / "Son Kontenjanlar" kartları değişmedi. Bu kural `tum-kurslar.html`, `hizmet-ici-egitimler.html`, `anasayfa.html`'deki tüm kartları otomatik kapsıyor (CSS attribute selector, sayfa bazlı değil).
- **Yeni `mikro-yeterlilik.html` sayfası oluşturuldu** — `tum-kurslar.html` şablonunun birebir kopyası (aynı filtre/arama/kart tasarımı), 6 örnek mikro yeterlilik programı kartıyla (Dijital Pazarlama, Etkili İletişim, Temel Aşçılık, Turist Rehberliği, İlk Yardım, İngilizce Konuşma Pratiği — **isimler placeholder, gerçek program listesi bekleniyor**). Navigasyona ("Eğitimler" / "Hizmet İçi Eğitimler" yanına) 23 sayfanın tamamında eklendi.
- **Mobil/masaüstü uyumlu hero video scaffold'u eklendi** — anasayfa ilk hero slaydına (`anasayfa.html`, PEMER-MYK slaydı) `<video class="sem-hero-video">` katmanı eklendi; `poster` mevcut slayt görseli, iki `<source>` (mobil `max-width:767px` / masaüstü) `assets/videos/sem-hero-mobile.mp4` ve `assets/videos/sem-hero-desktop.mp4` yolunu bekliyor (**dosyalar henüz yok**, klasör `assets/videos/` oluşturuldu). Video yüklenemezse slaydın kendi arkaplan görseli zaten altında durduğu için sayfa bozulmuyor. **Backend/İçerik etkisi:** Gerçek video dosyaları bu iki yola eklenince otomatik devreye girer, HTML/CSS değişikliği gerekmez.
- **4 farklı hero slider tasarım seçeneği** `slider-tasarimlari.html` adında ayrı bir inceleme sayfasında hazırlandı (canlı siteye bağlı değil, navigasyonda yok) — Klasik (mevcut), Ortalanmış/Minimal, Split (sol panel/sağ görsel), Alt bilgi şeridi. Kullanıcı birini seçtiğinde seçilen tasarım anasayfaya kalıcı olarak uygulanacak. **Bu iş henüz TAMAMLANMADI** — sadece seçenekler sunuldu, nihai seçim bekleniyor.

**Bekleyen maddeler (kullanıcı/backend ekibinden bekleniyor):**
- Çerez politikası / satış sözleşmesi / KVKK güncel hukuki metni (Metin Bey).
- Gerçek GA4 Measurement ID.
- 1500×1000 gerçek eğitim kartı görselleri (mevcut görseller CSS ile kırpılıyor, kaynak değişmedi).
- `assets/videos/sem-hero-mobile.mp4` ve `assets/videos/sem-hero-desktop.mp4` video dosyaları.
- Hero slider tasarım seçimi (`slider-tasarimlari.html`'deki A/B/C/D seçeneklerinden biri).
- `mikro-yeterlilik.html`'deki 6 placeholder programın gerçek içerikle değiştirilmesi.
- Anasayfa pop-up anket (ertelendi, kapsam henüz belirlenmedi).

---

_Bu doküman tasarım/prototip aşaması tamamlandıktan sonra backend devir teslimi için hazırlanmıştır. Sorularınız için mevcut HTML/CSS yapısına (`assets/css/sem-custom.css`, `assets/js/sem-custom.js`) başvurabilirsiniz — tüm özel davranış bu iki dosyada toplanmıştır._
