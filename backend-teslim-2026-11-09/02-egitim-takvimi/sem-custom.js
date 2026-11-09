/* sem-custom.js IIFE içine eklenir; DOMContentLoaded'da initTakvim çağrılır (bkz. 03 dosyasındaki initRevizyon). */
  /* ── Eğitim Takvimi (kurs-detay) ──────────────────────────
     Backend yalnızca <li class="sem-takvim-grup" data-baslangic data-bitis data-son-kayit>
     listesini basar. Soldaki aylık takvim bu listeden burada çizilir. */
  var SEM_AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz',
    'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

  function semTarih(str) {           // 'YYYY-MM-DD' → yerel tarih (saat dilimi kaymasız)
    var p = (str || '').split('-');
    return p.length === 3 ? new Date(+p[0], +p[1] - 1, +p[2]) : null;
  }
  function ayniGun(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function initTakvim(root) {
    var cal = root.querySelector('.sem-takvim-cal');
    var gruplar = Array.prototype.slice.call(root.querySelectorAll('.sem-takvim-grup'));
    if (!cal || !gruplar.length) return;

    var secili, ay;

    function ciz() {
      var bas = semTarih(secili.dataset.baslangic);
      var bit = semTarih(secili.dataset.bitis) || bas;
      var kayit = semTarih(secili.dataset.sonKayit);
      var bugun = new Date();
      var ilk = new Date(ay.getFullYear(), ay.getMonth(), 1);
      var bosluk = (ilk.getDay() + 6) % 7;            // Pazartesi ile başlayan hafta
      var gunSayisi = new Date(ay.getFullYear(), ay.getMonth() + 1, 0).getDate();

      var h = '<div class="sem-cal-ust">' +
        '<button type="button" class="sem-cal-ok" data-yon="-1" aria-label="Önceki ay"><i class="feather-chevron-left"></i></button>' +
        '<span class="sem-cal-ay">' + SEM_AYLAR[ay.getMonth()] + ' <small>' + ay.getFullYear() + '</small></span>' +
        '<button type="button" class="sem-cal-ok" data-yon="1" aria-label="Sonraki ay"><i class="feather-chevron-right"></i></button>' +
        '</div><div class="sem-cal-izgara">';
      ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'].forEach(function (g) {
        h += '<span class="sem-cal-hg">' + g + '</span>';
      });
      for (var i = 0; i < bosluk; i++) h += '<span class="sem-cal-gun is-bos"></span>';
      for (var d = 1; d <= gunSayisi; d++) {
        var t = new Date(ay.getFullYear(), ay.getMonth(), d);
        var c = ['sem-cal-gun'];
        if (bas && t >= bas && t <= bit) {
          c.push('is-egitim');
          if (ayniGun(t, bas)) c.push('is-bas');
          if (ayniGun(t, bit)) c.push('is-bit');
          var hg = (t.getDay() + 6) % 7;
          if (hg === 0) c.push('is-hafta-bas');
          if (hg === 6) c.push('is-hafta-son');
        }
        if (ayniGun(t, kayit)) c.push('is-kayit');
        if (ayniGun(t, bugun)) c.push('is-bugun');
        h += '<span class="' + c.join(' ') + '"><span>' + d + '</span></span>';
      }
      h += '</div><div class="sem-cal-lejant">' +
        '<span><i class="sem-lej-egitim"></i>Eğitim günleri</span>' +
        '<span><i class="sem-lej-kayit"></i>Son kayıt</span></div>';
      cal.innerHTML = h;
    }

    function sec(li) {
      secili = li;
      gruplar.forEach(function (g) {
        var aktif = g === li;
        g.classList.toggle('is-aktif', aktif);
        var btn = g.querySelector('.sem-takvim-grup-btn');
        if (btn) btn.setAttribute('aria-expanded', aktif ? 'true' : 'false');
      });
      var b = semTarih(li.dataset.baslangic) || new Date();
      ay = new Date(b.getFullYear(), b.getMonth(), 1);
      ciz();
    }

    cal.addEventListener('click', function (e) {
      var ok = e.target.closest('.sem-cal-ok');
      if (!ok) return;
      ay = new Date(ay.getFullYear(), ay.getMonth() + (+ok.dataset.yon), 1);
      ciz();
    });
    gruplar.forEach(function (g) {
      var btn = g.querySelector('.sem-takvim-grup-btn');
      if (btn) btn.addEventListener('click', function () { sec(g); });
    });

    // varsayılan: kayıtları açık ilk grup, yoksa ilk grup
    var acik = gruplar.filter(function (g) { return g.querySelector('.sem-status-badge--acik, .sem-status-badge--son'); })[0];
    root.classList.add('is-hazir');
    sec(acik || gruplar[0]);
  }

