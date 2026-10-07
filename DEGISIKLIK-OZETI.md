# Backend Ekibine — Değişiklikler

Bu doküman, siteyi ilk teslim aldığınız versiyona göre **neyin nerede değiştiğini** basit bir dille özetler. En yeni tur en üstte. Teknik detay/şema için `README.md`'ye bakın — bu dosya sadece "nerede ne değişti" sorusuna hızlı cevap içindir. Kod parçacıkları (önce/sonra) için ilgili tarihli `backend-teslim-…/` klasörüne bakın.

## 2026-10-07

| Alan / Sayfa | Ne değişti | Backend için not |
|---|---|---|
| **Anasayfa — Öne Çıkan Eğitimler** | Yana kayan yapı kaldırıldı; kartlar **aynı boyutta alt alta** diziliyor (masaüstünde satırda 3, tablette 2, mobilde 1). | Kart sayısı arttıkça otomatik yeni satıra geçer; ekstra bir şey gerekmez. |
| **Footer** (tüm sayfalar) | "Sayfalar" sütunu **"Hızlı Erişim"** ve **"Kurumsal"** olarak ikiye ayrıldı. | — |
| **Anasayfa slider** | Yükseklik artık **ekran boyuna göre** ayarlanıyor. Windows ölçekleme / tarayıcı zoom'u olan ekranlarda slider tüm ekranı kaplamıyor. | Slider görselleri **en az 1920×900** olmalı — mevcut görseller 710×488 olduğu için bulanık görünüyor. |
| **Başvuru formu** (açılır pencere, 7 sayfa) | Okunmayan başlık ve karanlık modda kaybolan yazılar düzeltildi; butonlar eşitlendi. **Eksik/hatalı alan uyarısı** ve **"Başvurunuz alındı"** ekranı eklendi. | Form verisi henüz sunucuya gitmiyor. `sem:apply-submit` olayını dinleyip API'ye göndermeniz yeterli — örnek: `backend-teslim-2026-10-07/04-basvuru-modali/aciklama.md`. |
| **İletişim formu** | Karanlık modda kaybolan "Bize Yazın" başlığı düzeltildi; "Konu" kutusu diğer alanlarla aynı boy. | — |
| **CSS/JS önbellek** | `sem-custom.css` ve `sem-custom.js` bağlantılarına `?v=20261007` eklendi. | Bu iki dosya her değiştiğinde `?v=` tarihi güncellenmeli. |

---

## 2026-09-09

| Alan / Sayfa | Ne değişti | Backend için not |
|---|---|---|
| **Tüm eğitim kartı görselleri** (site geneli) | Görsel oranı dikeyden (4:5) **yataya (1500×1000)** çevrildi. | Yeni eğitim görseli eklerken **1500×1000** boyutunda, yatay olmalı. |
| **"Kurs" kelimesi** (site geneli — menü, buton, yazılar) | Her yerde **"Eğitim"** olarak değiştirildi. | Yeni metin eklerken "kurs" değil "eğitim" ifadesini kullanın. Sadece dosya adları (`kurs-detay.html` vb.) aynı kaldı, onlara dokunulmadı. |
| **Üst menü** (tüm sayfalar) | "SEM Hakkında" üst menüden kaldırıldı, **footer'a (sayfa altına)** taşındı. | Menü artık daha sade: Eğitimler / Hizmet İçi Eğitimler / Mikro Yeterlilik / Sınav Merkezleri / İletişim. |
| **Tüm Eğitimler sayfası** (`tum-kurslar.html`) | Arama kutusu, filtrelerin yanından ayrılıp sayfanın **en üstüne** alındı. | — |
| **Eğitim kartları** (Tüm Eğitimler, Hizmet İçi Eğitimler, Anasayfa) | "Yakında" / "Kayıtlar Kapandı" durumundaki kartlar artık **soluk/gri** görünüyor, aktif kartlardan ayrışıyor. | Yeni bir eğitim "yakında" veya "kapandı" olarak işaretlenirse otomatik bu görünümü alır, ekstra bir şey yapmanıza gerek yok. |
| **Yeni sayfa: Mikro Yeterlilik** (`mikro-yeterlilik.html`) | Eğitimler sayfasıyla aynı tasarımda yeni bir sayfa açıldı, menüye eklendi. | İçindeki 6 program **örnek/placeholder** — gerçek Mikro Yeterlilik program listesi geldiğinde değiştirilecek. |
| **Anasayfa hero (kayan görsel) alanı** | Mobil/masaüstü için ayrı **video** oynatma altyapısı eklendi (şu an video dosyası yok, sadece hazır). | Gerçek tanıtım videosu geldiğinde `assets/videos/` klasörüne 2 dosya (`sem-hero-mobile.mp4`, `sem-hero-desktop.mp4`) eklenmesi yeterli, kod değişikliği gerekmez. |
| **Google Analytics** | Tüm sayfalara GA4 kodu eklendi, ama **geçici (placeholder) bir ID** ile (`G-XXXXXXXXXX`). | Gerçek Ölçüm Kimliği (Measurement ID) verildiğinde her sayfada bu placeholder'ın gerçek ID ile değiştirilmesi gerekiyor (toplu bul-değiştir ile tek seferde yapılabilir). |
| **Çerez Politikası / Satış Sözleşmesi / KVKK** | **Değiştirilmedi** — hukuki metin ayrıca (Metin Bey / hukuk ekibi) sağlanacak. | Bu 3 sayfa şu anki (eski) içerikleriyle duruyor, güncel değil, yayına hazır sayılmamalı. |
| **Slider tasarım seçenekleri** | Anasayfa görseli için 4 farklı tasarım denemesi `slider-tasarimlari.html`'de hazırlandı (canlı sitede değil, sadece inceleme için). | Birini seçtiğimizde anasayfaya kalıcı olarak uygulanacak — henüz karar verilmedi. |
| **Pop-up anket** | Bu turda **yapılmadı** (ertelendi). | — |

---

### O tarihte bekleyen 5 şey
1. 1500×1000 gerçek eğitim görselleri
2. Gerçek GA4 Measurement ID
3. Çerez/Sözleşme/KVKK güncel metni
4. Hero için mobil+masaüstü video dosyası
5. Mikro Yeterlilik gerçek program listesi

Daha fazla teknik detay (görsel oranları, form şemaları, sayfa envanteri) için: **`README.md`**
