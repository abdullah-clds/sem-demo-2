# Başvuru Modalı (`#semApplyModal`) — Revizyon

## Renk / okunabilirlik sorunları (düzeltildi)
| Sorun | Sebep | Çözüm |
|---|---|---|
| Başlık ("Eğitime Başvur") okunmuyordu | Tema `h5`'e koyu lacivert (#192335) veriyor, başlık zemini de lacivert | Başlık `#fff !important` |
| Karanlık modda placeholder'lar ve "Vazgeç" görünmüyordu | Tema karanlık modda metinleri beyaza çekiyor, modal zemini beyaz kalıyor | Modalın tüm renkleri açıkça sabitlendi — açık/karanlık modda aynı |
| "Vazgeç" butonu çok küçüktü | Bootstrap `rem` × temanın `html{font-size:10px}` → 10px yazı | 48px yükseklik, 15px yazı, "Gönder" ile aynı boy |
| Alan yükseklikleri farklıydı (select 60px vb.) | Tema input/select yükseklikleri | Hepsi 48px |
| Küçük ekranda modal taşıyordu | — | `modal-dialog-scrollable` |

## İşlev (yeni)
Daha önce **"Gönder" butonu hiçbir şey yapmıyordu**. Artık:

1. **İstemci tarafı doğrulama** — hatalı alan kırmızı çerçeve + altında mesaj; düzeltilince kalkar, ilk hatalı alana odaklanır.

   | Alan | Kural |
   |---|---|
   | `kategori` | seçilmiş olmalı |
   | `ad_soyad` | en az 3 karakter |
   | `telefon` | rakam sayısı 10, 11 veya 12 (boşluk/tire serbest) |
   | `eposta` | `x@y.zz` biçimi |
   | `kun_ogrenci` | Evet/Hayır işaretli olmalı |
   | `kvkk` | işaretli olmalı |
   | `mesaj` | opsiyonel |

2. **Teşekkür ekranı** — geçerli gönderimde form gizlenir, "Başvurunuz alındı" gösterilir, "Vazgeç" → "Kapat" olur.
3. **Sıfırlama** — modal kapanınca form temizlenir, hata ve teşekkür ekranı kalkar.

## ⚠️ Backend için: veriyi nereden alacaksınız?
Site statik olduğu için veri **sunucuya gönderilmiyor**. Doğrulama geçince şu olay yayınlanıyor:

```js
document.addEventListener('sem:apply-submit', function (e) {
  // e.detail örneği:
  // { mode: "basvuru",            // basvuru | talep | kurumsal
  //   course_id: "isaret-dili", egitim: "İşaret Dili Eğitimi",
  //   kategori: "kisisel-gelisim", ad_soyad: "...", telefon: "0532 123 45 67",
  //   eposta: "...", kun_ogrenci: "evet", mesaj: "", kvkk: "on" }
  fetch('/api/basvuru', { method: 'POST', headers: {'Content-Type': 'application/json'},
                          body: JSON.stringify(e.detail) });
});
```

- Teşekkür ekranı şu an olay yayınlanır yayınlanmaz gösteriliyor. API bağlandığında, yanıt beklenip hata durumunda kullanıcıya mesaj gösterilecek şekilde `handleSubmit` uyarlanmalı.
- `mode === "kurumsal"` iken `course_id` ve `egitim` boş gelir (bu modda eğitim satırı gizli).
- Sunucu tarafında da aynı doğrulamalar mutlaka yapılmalı — istemci doğrulaması atlatılabilir.
