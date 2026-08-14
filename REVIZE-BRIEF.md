# SEM Web Sitesi — Revize Talimat Dosyası v2 (Claude Code için)

> **Amaç:** Bu dosya, Kapadokya Üniversitesi SEM statik HTML sitesine uygulanacak yeni revize turunu; hangi dosyada, hangi bölümde, ne yapılacağı ve kod örnekleriyle birlikte tarif eder. Claude Code bu dosyayı kaynak alarak değişiklikleri uygular.
>
> **Site tipi:** HiStudy şablonu üzerine kurulu statik HTML (build/framework yok). Her sayfa kendi içinde navbar/footer'ı barındırır (partial/include yok → menü değişiklikleri her dosyada tekrar edilir).
>
> **Genel kural:** Vendor dosyalarına (`assets/css/vendor/`, `assets/css/plugins/`, `assets/js/vendor/`) DOKUNMA. Yeni stiller `assets/css/sem-custom.css` (veya `sem-kurumsal.css`) içine yazılır. Kurumsal palet `--sem-*` / `--kun-*` değişkenleri üzerinden kullanılır; yeni ham HEX renk uydurma.

## Kurumsal palet referansı
`--sem-primary #002855` (lacivert-ana) · `--sem-navy-light #00428a` · `--kun-mavi #0072ce` · turkuaz `#00A1AA` · sarı `#F2A900` · mor `#93328E` · `--sem-accent #cb333b` · kum `#D6D2C4` · gri `#53565A` · `--sem-bg-2 #f8f9fc`. Font: DIN Pro.

---

## 1. Anasayfa — Bölüm sırası değişikliği
**Dosya:** `anasayfa.html`

**Mevcut sıra:** Slider → Hero arama → `#sem-duyurular` → `#sem-populer-egitimler` → Kategoriler → `#sem-sinav-merkezleri` → Kurumsal CTA → Blog → SSS.

**Yeni sıra (slider'dan sonra):**
1. Slider (Banner Area) — yerinde
2. Hero arama (`#sem-hero-search`) — yerinde, slider'ın hemen altı
3. **Öne Çıkan Eğitimler** (`#sem-populer-egitimler`)
4. **Kurumuna Özel Teklifler** (Kurumsal CTA — `<!-- Start Kurumsal CTA -->` … `<!-- End Kurumsal CTA -->`)
5. **Duyurular** (`#sem-duyurular`)
6. Öne Çıkan Kategoriler
7. Sınav Merkezleri (`#sem-sinav-merkezleri`)
8. Blog → SSS → Footer (yerinde)

**Yapılacak:** Üç blok DOM'da taşınacak — (a) `#sem-populer-egitimler` bloğunu Hero aramanın hemen altına al, (b) Kurumsal CTA bloğunu onun altına al, (c) `#sem-duyurular` bloğunu Kurumsal CTA'nın altına al. Blokların iç içeriği, id'leri ve yorum etiketleri (`<!-- Start ... -->`) korunur; sadece sıraları değişir. Taşırken açılış/kapanış `<div>` dengesine dikkat.

---

## 1b. Anasayfa "Öne Çıkan Eğitimler" — düzen + kurumsal kart/rozet (canlı, KİLİTLENDİ)
**Dosya:** `anasayfa.html` (`#sem-populer-egitimler`) + `sem-custom.css`.

**Durum:** Kullanıcı bölümü **3 sütun × 2 satır (6 kart)** yaptı; bu düzen korunur. Ancak kullanıcının eklediği kum rengi (badge bandı, kart kenarlığı/gölgesi) beğenilmedi → kurumsal renklere çekilecek. Aşağıdaki düzeltmeler canlı test edildi.

**Düzeltmeler:**
- **Kart genişlik kısıtı kaldırıldı:** eski `max-width:302px; margin:auto` yan boşluk yaratıyordu → kaldırıldı; kart kolonu doldurur.
- **Görsel oranı: DİKEY `4/5`** (kullanıcının 1080×1350 varlıklarıyla uyumlu — kesin istek; landscape YAPMA).
- **Kartları biraz küçült:** bölüm konteynerini daralt → `#sem-populer-egitimler .container{ max-width:980px; }`. 3 sütun + dar boşluk korunur, yan boşluk oluşmadan ızgara orantılı küçülür (kart ~314×619px). Canlı onaylandı.
- **Satır/sütun arası boşluk:** dar + eşit → **`#sem-populer-egitimler .row.g-4 { --bs-gutter-x:12px; --bs-gutter-y:12px; }`** (canlı onaylandı).
- **(NOT: bu madde `assets/css/sem-custom.css`'e canlı olarak uygulanmıştır — Claude Code yeniden uygularken mevcut kuralları çoğaltmasın, doğrulasın.)**
- **Kum KALDIR — kart yüzeyi kurumsal:** kum kenarlık/gölge yerine ince lacivert hairline + yumuşak nötr gölge.
- **Kum rozet bandı KALDIR — kurumsal solid pill, BAŞLIĞIN ÜSTÜNDE (kart gövdesinde):** durum etiketi görsel üstünde belirsiz kaldığı için gövdeye, başlığın üstüne alındı; duruma göre kurumsal renkli solid pill.
```css
#sem-populer-egitimler .sem-course-card{ max-width:none; margin:0; }
#sem-populer-egitimler .sem-course-card .rbt-card-img{ aspect-ratio:4/5; }  /* DİKEY */
#sem-populer-egitimler .row.g-4{ --bs-gutter-x:12px; --bs-gutter-y:12px; }
#sem-populer-egitimler .container{ max-width:980px; }  /* kartları orantılı küçült */
#sem-populer-egitimler .sem-course-card{
  position:relative; background:#fff;
  border:1px solid rgba(0,40,85,.10);
  box-shadow:0 2px 14px rgba(0,40,85,.07);
  transition:transform .2s, box-shadow .2s, border-color .2s;
}
#sem-populer-egitimler .sem-course-card:hover{
  transform:translateY(-4px);
  box-shadow:0 10px 26px rgba(0,40,85,.13);
  border-color:rgba(0,40,85,.20);
}
/* Rozet: kart gövdesinde, BAŞLIĞIN ÜSTÜNDE, kurumsal solid pill (overlay değil) */
.sem-status-badge{
  position:static; display:inline-block; width:auto; margin:0 0 10px;
  padding:5px 12px; font-size:12px; font-weight:600; border:none; border-radius:0;
  color:#fff; background:var(--sem-primary,#002855);
}
.sem-status-badge::before{ display:none; }
#sem-populer-egitimler .sem-status-badge--acik   { background:var(--sem-success,#1a7a4a); }
#sem-populer-egitimler .sem-status-badge--son    { background:var(--kun-sari,#F2A900); color:var(--sem-primary,#002855); }
#sem-populer-egitimler .sem-status-badge--yakinda{ background:var(--kun-gri,#53565a); }
#sem-populer-egitimler .sem-status-badge--kapandi{ background:var(--sem-accent,#cb333b); }
#sem-populer-egitimler .sem-status-badge--talep  { background:var(--kun-mavi,#0072ce); }
```
> Görsel **4:5 dikey kalır** (1080×1350 bozulmaz). Aynı kurumsal rozet + kart yüzeyi listeleme sayfalarında da geçerli olabilir (bkz. `eğitimler.md` — kum tamamen elendi). Önceki "4 sütun" önerisi geçersiz; kullanıcı 3×6'yı seçti.

---

## 2. Sınav Merkezleri bölümü + menü
**Dosyalar:** `anasayfa.html` (bölüm) + menü değişikliği **21 HTML dosyasının tamamında** (aşağıdaki liste).

### 2a. Anasayfa bölümü (`#sem-sinav-merkezleri`)
- **"Personel Belgelendirme Merkezi" kartını tamamen KALDIR** (altın çerçeveli kart, `belgelendirme.kapadokya.edu.tr` linkli).
- **"Modül Sınav Merkezi" kartı EKLE.** Sonuç: 2 kart → **İlk Yardım Eğitim Merkezi** + **Modül Sınav Merkezi**. Mevcut `row row-cols-1 row-cols-md-2` yapısı 2 kartla simetrik kalır.
- Modül kartı linki şimdilik **pasif**: `href="#"` (veya `aria-disabled`), üstüne küçük "Yakında" ifadesi eklenebilir. URL sonra verilecek.
- **Renk temizliği:** Kartlardaki karışık `border-top` renklerini (yeşil `--sem-success` / altın `--sem-gold`) tek kurumsal aksana çek → ikisi de `border-top: 4px solid var(--sem-primary)`. İkon rengi de `var(--sem-primary)`. Neon/parlak his kalksın.
- **Başlık kontrolü:** Bölüm başlığı "Sınav ve Belgelendirme Merkezlerimiz". Belgelendirme kartı kalktığı için başlığı **"Sınav ve Akredite Merkezlerimiz"** yap (subtitle "AKREDİTE MERKEZLERİMİZ" kalabilir).

Modül kartı örnek iskeleti (İlk Yardım kartıyla birebir aynı yapı):
```html
<div class="col">
  <div class="rbt-card variation-01 rbt-hover text-center p-4 h-100"
       style="border-top:4px solid var(--sem-primary); border-radius:0;">
    <div class="mb-3" style="font-size:2.5rem; color:var(--sem-primary)">
      <i class="feather-grid"></i>
    </div>
    <h5 class="rbt-card-title mb-2">Modül Sınav Merkezi</h5>
    <p class="description" style="font-size:.85rem">
      Akredite modül sınavlarının planlandığı ve yürütüldüğü merkez.
    </p>
    <a href="#" class="rbt-btn-link mt--10 d-inline-block" aria-disabled="true">
      Yakında <i class="feather-arrow-right"></i>
    </a>
  </div>
</div>
```

### 2b. Üst menü — "Sınav Merkezleri" alt menüsü (21 dosya)
Alt menü şu an: Akredite Merkezlerimiz · İlk Yardım Eğitim Merkezi · Personel Belgelendirme Merkezi.
- **"Personel Belgelendirme Merkezi" `<li>`'sini KALDIR** (hem masaüstü hem mobil menüde — her ikisi de her dosyada gömülü).
- **"Modül Sınav Merkezi" `<li>` EKLE**, link `href="#"` (pasif).

Yeni alt menü:
```html
<li><a href="anasayfa.html#sem-sinav-merkezleri">Akredite Merkezlerimiz</a></li>
<li><a href="https://ilkyardim.kapadokya.edu.tr/" target="_blank" rel="noopener">İlk Yardım Eğitim Merkezi</a></li>
<li><a href="#">Modül Sınav Merkezi</a></li>
```

> **Etkilenen 21 dosya:** anasayfa, blog, blog-detay, duyurular, duyuru-detay, egitmen-panel, ekibimiz, faaliyet-raporlari, giris, hizmet-ici-egitimler, idare, iletisim, kayit-ol, kurs-detay, kvkk, sem-hakkinda, sem-kurs-ekleme, slider, sozlesmeler, sss, tum-kurslar. Her dosyada `belgelendirme.kapadokya.edu.tr` geçen menü `<li>`'leri temizlenecek (footer'daki linkler ayrı değerlendirilir — footer'da da varsa aynı mantıkla kaldır).

---

## 2b. Butonlar — kurumsal turkuaz + sarı hover (SİTE GENELİ)
**Dosya:** `assets/css/sem-custom.css` (tüm sayfalarda geçerli).

**Karar (canlı test edildi):** Tüm ana butonlar **kurumsal turkuaz (#00A1AA)** zemin + beyaz metin; **hover'da sarı (#F2A900)** + lacivert metin (sarı üzerinde beyaz okunmaz).
```css
.rbt-btn, .sem-apply-btn, .sem-btn-primary,
a.rbt-btn, button.rbt-btn, .rbt-btn.btn-gradient{
  background: var(--kun-turkuaz, #00A1AA) !important;
  background-image:none !important;   /* tema gradyanını iptal */
  border-color: var(--kun-turkuaz, #00A1AA) !important;
  color:#fff !important;
  transition:background .2s, color .2s, border-color .2s !important;
}
.rbt-btn:hover, .sem-apply-btn:hover, .sem-btn-primary:hover,
a.rbt-btn:hover, button.rbt-btn:hover, .rbt-btn.btn-gradient:hover{
  background: var(--kun-sari, #F2A900) !important;
  border-color: var(--kun-sari, #F2A900) !important;
  color: var(--sem-primary, #002855) !important;
}
```
> Değişkenler `sem-kurumsal.css`'de mevcut: `--kun-turkuaz #00a1aa`, `--kun-sari #f2a900`. Filtre "Izgara/Liste" toggle'ı gibi ikincil kontroller buton sayılmaz; sadece gerçek CTA/aksiyon butonları. Kilitli karar.
>
> **Üst menü "Kayıt Ol" butonu:** `btn-border-gradient` + marquee (`rbt-marquee-btn`) olduğu için genel kuralı tam almıyordu; ayrı override eklendi (solid turkuaz, hover sarı, `::before/::after` gradyanı ve `-webkit-text-fill-color` dahil). `.rbt-btn-wrapper .rbt-btn` hedeflendi.

---

## 2c. Site geneli zemin rengi — #f8f9fa
**Dosya:** `assets/css/sem-custom.css` (tüm sayfalar).

**Karar:** Tüm sitede `body` arka planı **#f8f9fa** (hakkımızdaki hero grisiyle aynı). Saf beyaz zemin kalkıyor; beyaz kartlar/section'lar bu açık gri üzerinde ayrışır.
```css
body{ background:#f8f9fa !important; }
```
> Beyaz görünmesi gereken section'lar (`bg-color-white`) kendi beyaz zeminini korur; değişiklik yalnız genel body zeminidir. Bu, eğitim listeleme sayfalarındaki "beyaz-üstüne-beyaz" sorununu da site geneline tutarlı çözer.

---

## 3. Eğitim listeleme sayfaları → ayrı dosyada
**Dosyalar:** `tum-kurslar.html`, `hizmet-ici-egitimler.html`.

Bu iki sayfanın kart/ızgara tasarımı, görsel oranı, gölge/neon temizliği, banner yenilemesi ve hizmet içi hedef kitle metni **`eğitimler.md`** dosyasında toplanmıştır (çakışmayı önlemek için burada tekrarlanmaz).

Özetle `eğitimler.md`: 3 sütun ızgara + daraltılmış filtre (kartlar büyür), 4:5 dikey görsel, solid/neonsuz kart, kurumsal banner, "sadece personel" metni — ve **kart tasarımı A/B denemesi** (Eğitimler = özet metinli / Hizmet İçi = özetsiz sade; kazanan sonra ikisine uygulanır).

---

## 4. Doğrulama (uygulama sonrası)
- Anasayfa yeni bölüm sırası göz kontrolü + kırık `<div>` yok.
- 21 dosyada "Personel Belgelendirme Merkezi" menü linki kalmadı (`grep -rn "belgelendirme.kapadokya" *.html` → sadece kasıtlı kalanlar).
- Anasayfa Sınav Merkezleri: 2 kart (İlk Yardım + Modül Sınav Merkezi), tek kurumsal renk, başlık "Sınav ve Akredite Merkezlerimiz".
- Eğitim listeleme sayfaları için doğrulama → `eğitimler.md` sonundaki kontrol listesi.

---
*Kararlar (ana brief): anasayfa sırası (öne çıkan eğitimler → özel teklifler → duyurular) · Belgelendirme hem menü hem kart kaldırılır · Modül Sınav Merkezi eklenir, linki pasif (#). Eğitim sayfaları → `eğitimler.md`.*
