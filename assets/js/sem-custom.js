/* ============================================================
   SEM Custom Scripts — Kapadokya Üniversitesi SEM
   Sadece vanilla JS. fetch yok. file:// ile de çalışır.
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. URL parametre okuyucu ────────────────────────── */
  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  /* ── 2. filterCards() ────────────────────────────────── */
  function filterCards() {
    var cards = document.querySelectorAll('.sem-course-card');
    if (!cards.length) return;

    var q = (document.getElementById('sem-search-input') ?
              document.getElementById('sem-search-input').value : '').toLowerCase().trim();

    var groups = ['kategori', 'format', 'ucret', 'gun', 'durum'];
    var checked = {};
    groups.forEach(function (g) {
      checked[g] = [];
      document.querySelectorAll('input[data-filter="' + g + '"]:checked').forEach(function (cb) {
        checked[g].push(cb.value);
      });
    });

    var visible = 0;
    cards.forEach(function (card) {
      var show = true;

      if (q) {
        var ad = (card.dataset.ad || '').toLowerCase();
        if (ad.indexOf(q) === -1) show = false;
      }

      groups.forEach(function (g) {
        if (show && checked[g].length) {
          if (checked[g].indexOf(card.dataset[g] || '') === -1) show = false;
        }
      });

      card.classList.toggle('sem-hidden', !show);
      if (show) visible++;
    });

    var noResult = document.getElementById('sem-no-result');
    if (noResult) noResult.classList.toggle('sem-hidden', visible > 0);
  }

  /* ── 3. openApplyModal() ─────────────────────────────── */
  function openApplyModal(mode, courseId, courseName) {
    var modalEl = document.getElementById('semApplyModal');
    if (!modalEl) return;

    var titles = {
      basvuru:  'Eğitime Başvur',
      kurumsal: 'Kurumsal Eğitim Talebi',
      talep:    'Eğitim Talebi Bırak'
    };
    var titleEl = modalEl.querySelector('.sem-modal-title');
    if (titleEl) titleEl.textContent = titles[mode] || 'Başvuru';

    modalEl.dataset.mode = mode;

    var courseInput   = modalEl.querySelector('[name="egitim"]');
    var courseIdInput = modalEl.querySelector('[name="course_id"]');
    if (courseInput   && courseName) courseInput.value   = courseName;
    if (courseIdInput && courseId)   courseIdInput.value = courseId;

    var courseRow = modalEl.querySelector('.sem-modal-course-row');
    if (courseRow) courseRow.style.display = (mode === 'kurumsal') ? 'none' : '';

    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  /* ── 4. URL parametrelerine göre ilk filtre ─────────── */
  function applyUrlParams() {
    var q        = getParam('q');
    var kategori = getParam('kategori');

    var searchInput = document.getElementById('sem-search-input');
    if (searchInput && q) searchInput.value = q;

    if (kategori) {
      var cb = document.querySelector('input[data-filter="kategori"][value="' + kategori + '"]');
      if (cb) cb.checked = true;
    }

    if (q || kategori) filterCards();
  }

  /* ── 5. Event bağlama ────────────────────────────────── */
  /* Arama önizleme dizini — tum-kurslar / mikro-yeterlilik / hizmet-ici / anasayfa kartlarından
     üretildi (site statik, fetch yok). Backend bağlanınca bu dizi API sonucuyla değişecek.
     t: başlık, k: kategori, f: format, g: grup, d: durum, i: görsel, u: link */
  var SEM_SEARCH_INDEX = [
    {"t": "Dijital Pazarlama ve Sosyal Medya Yönetimi", "k": "Bilişim", "f": "Online", "g": "Eğitim", "d": "acik", "i": "./assets/images/course/course-10.jpg", "u": "kurs-detay.html"},
    {"t": "İHA-2 Uçuş Eğitimi", "k": "Havacılık", "f": "Yüz Yüze", "g": "Eğitim", "d": "son", "i": "./assets/images/course/course-3.jpg", "u": "kurs-detay.html"},
    {"t": "Gastronomi ve Mutfak Uygulamaları", "k": "Gastronomi", "f": "Yüz Yüze", "g": "Eğitim", "d": "son", "i": "./assets/images/course/course-8.jpg", "u": "tum-kurslar.html?kategori=gastronomi"},
    {"t": "Turist Rehberliği Eğitim Programı", "k": "Turizm", "f": "Yüz Yüze", "g": "Eğitim", "d": "son", "i": "./assets/images/course/course-9.jpg", "u": "tum-kurslar.html?kategori=turizm"},
    {"t": "Sanal Gerçeklik Terapisi Eğitimi", "k": "Sağlık", "f": "Hibrit", "g": "Eğitim", "d": "acik", "i": "./assets/images/course/egitim5.jpg", "u": "tum-kurslar.html?kategori=saglik"},
    {"t": "İşaret Dili Eğitimi", "k": "Kişisel Gelişim", "f": "Yüz Yüze", "g": "Eğitim", "d": "acik", "i": "./assets/images/course/course-11.jpg", "u": "tum-kurslar.html?kategori=kisisel-gelisim"},
    {"t": "Meteoroloji Temel Eğitimi", "k": "Havacılık", "f": "Yüz Yüze", "g": "Eğitim", "d": "acik", "i": "./assets/images/course/course-3.jpg", "u": "kurs-detay.html"},
    {"t": "Arama Kurtarma Temel Eğitimi", "k": "Havacılık", "f": "Yüz Yüze", "g": "Eğitim", "d": "son", "i": "./assets/images/course/arama-kurtarma.jpg", "u": "kurs-detay.html"},
    {"t": "Emniyet Yönetim Sistemi (SMS) Eğitimi", "k": "Havacılık", "f": "Yüz Yüze", "g": "Eğitim", "d": "yakinda", "i": "./assets/images/course/course-7.jpg", "u": "kurs-detay.html"},
    {"t": "Mesleki İngilizce Eğitimi", "k": "Dil", "f": "Online", "g": "Eğitim", "d": "acik", "i": "./assets/images/course/course-8.jpg", "u": "kurs-detay.html"},
    {"t": "Stres ve Zaman Yönetimi Eğitimi", "k": "Kişisel Gelişim", "f": "Online", "g": "Eğitim", "d": "acik", "i": "./assets/images/course/course-9.jpg", "u": "kurs-detay.html"},
    {"t": "Psikolojik Sağlamlık Temel Eğitimi", "k": "Sağlık", "f": "Yüz Yüze", "g": "Eğitim", "d": "kapandi", "i": "./assets/images/course/course-10.jpg", "u": "kurs-detay.html"},
    {"t": "Motivasyon Temel Eğitimi", "k": "Kişisel Gelişim", "f": "Online", "g": "Eğitim", "d": "acik", "i": "./assets/images/course/course-11.jpg", "u": "kurs-detay.html"},
    {"t": "Profesyonel Aşçılık Temel Eğitimi", "k": "Gastronomi", "f": "Yüz Yüze", "g": "Eğitim", "d": "acik", "i": "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=180&h=120&fit=crop&q=80", "u": "kurs-detay.html"},
    {"t": "Sürdürülebilir Turizm Eğitimi", "k": "Turizm", "f": "Online", "g": "Eğitim", "d": "acik", "i": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=180&h=120&fit=crop&q=80", "u": "kurs-detay.html"},
    {"t": "Siber Güvenlik Temel Eğitimi", "k": "Bilişim", "f": "Online", "g": "Eğitim", "d": "yakinda", "i": "https://images.unsplash.com/photo-1518818608552-195ed130cdf4?w=180&h=120&fit=crop&q=80", "u": "kurs-detay.html"},
    {"t": "Montessori Eğiticinin Eğitimi", "k": "Eğitim Bilimleri", "f": "Yüz Yüze", "g": "Eğitim", "d": "son", "i": "./assets/images/course/course-7.jpg", "u": "kurs-detay.html"},
    {"t": "PEMER-MYK Aşçı Seviye 4 Sınavı", "k": "PEMER / MYK", "f": "Yüz Yüze", "g": "Eğitim", "d": "son", "i": "./assets/images/course/sem-slider.jpg", "u": "kurs-detay.html"},
    {"t": "Dijital Pazarlama Mikro Yeterlilik Sertifikası", "k": "Bilişim", "f": "Online", "g": "Mikro Yeterlilik", "d": "acik", "i": "./assets/images/course/course-01.jpg", "u": "kurs-detay.html"},
    {"t": "Etkili İletişim Mikro Yeterlilik Sertifikası", "k": "Kişisel Gelişim", "f": "Hibrit", "g": "Mikro Yeterlilik", "d": "acik", "i": "./assets/images/course/course-02.jpg", "u": "kurs-detay.html"},
    {"t": "Temel Aşçılık Mikro Yeterlilik Sertifikası", "k": "Gastronomi", "f": "Yüz Yüze", "g": "Mikro Yeterlilik", "d": "son", "i": "./assets/images/course/course-03.jpg", "u": "kurs-detay.html"},
    {"t": "Turist Rehberliği Mikro Yeterlilik Sertifikası", "k": "Turizm", "f": "Yüz Yüze", "g": "Mikro Yeterlilik", "d": "acik", "i": "./assets/images/course/course-04.jpg", "u": "kurs-detay.html"},
    {"t": "İlk Yardım Mikro Yeterlilik Sertifikası", "k": "Sağlık", "f": "Yüz Yüze", "g": "Mikro Yeterlilik", "d": "yakinda", "i": "./assets/images/course/course-05.jpg", "u": "kurs-detay.html"},
    {"t": "İngilizce Konuşma Pratiği Mikro Yeterlilik Sertifikası", "k": "Dil", "f": "Online", "g": "Mikro Yeterlilik", "d": "acik", "i": "./assets/images/course/course-06.jpg", "u": "kurs-detay.html"},
    {"t": "Akademik Yazım ve Etik Eğitimi", "k": "", "f": "Yüz Yüze", "g": "Hizmet İçi Eğitim", "d": "acik", "i": "./assets/images/course/course-3.jpg", "u": "kurs-detay.html"},
    {"t": "Uzaktan Eğitim (LMS) Kullanım Eğitimi", "k": "", "f": "Yüz Yüze", "g": "Hizmet İçi Eğitim", "d": "son", "i": "./assets/images/course/arama-kurtarma.jpg", "u": "kurs-detay.html"},
    {"t": "İş Sağlığı ve Güvenliği Oryantasyon Eğitimi", "k": "", "f": "Yüz Yüze", "g": "Hizmet İçi Eğitim", "d": "yakinda", "i": "./assets/images/course/course-7.jpg", "u": "kurs-detay.html"},
    {"t": "Akademik İngilizce Gelişim Programı", "k": "", "f": "Online", "g": "Hizmet İçi Eğitim", "d": "acik", "i": "./assets/images/course/course-8.jpg", "u": "kurs-detay.html"},
    {"t": "Zaman Yönetimi ve Verimlilik Eğitimi", "k": "", "f": "Online", "g": "Hizmet İçi Eğitim", "d": "acik", "i": "./assets/images/course/course-9.jpg", "u": "kurs-detay.html"},
    {"t": "Stres Yönetimi ve Psikolojik Dayanıklılık Eğitimi", "k": "", "f": "Yüz Yüze", "g": "Hizmet İçi Eğitim", "d": "kapandi", "i": "./assets/images/course/course-10.jpg", "u": "kurs-detay.html"},
    {"t": "Kurum Kültürü ve Motivasyon Semineri", "k": "", "f": "Online", "g": "Hizmet İçi Eğitim", "d": "acik", "i": "./assets/images/course/course-11.jpg", "u": "kurs-detay.html"},
    {"t": "Ofis Yazılımları (MS Office) Eğitimi", "k": "", "f": "Yüz Yüze", "g": "Hizmet İçi Eğitim", "d": "acik", "i": "https://images.unsplash.com/photo-1563172218-cc4b58795905?w=180&h=120&fit=crop&q=80", "u": "kurs-detay.html"},
    {"t": "Etkili İletişim ve Sunum Teknikleri Eğitimi", "k": "", "f": "Online", "g": "Hizmet İçi Eğitim", "d": "acik", "i": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=180&h=120&fit=crop&q=80", "u": "kurs-detay.html"},
    {"t": "Siber Güvenlik Farkındalık Eğitimi", "k": "", "f": "Online", "g": "Hizmet İçi Eğitim", "d": "yakinda", "i": "https://images.unsplash.com/photo-1518818608552-195ed130cdf4?w=180&h=120&fit=crop&q=80", "u": "kurs-detay.html"},
    {"t": "Eğiticinin Eğitimi Sertifika Programı", "k": "", "f": "Yüz Yüze", "g": "Hizmet İçi Eğitim", "d": "son", "i": "./assets/images/course/course-7.jpg", "u": "kurs-detay.html"},
    {"t": "KVKK Farkındalık Eğitimi", "k": "", "f": "Yüz Yüze", "g": "Hizmet İçi Eğitim", "d": "son", "i": "./assets/images/course/sem-slider.jpg", "u": "kurs-detay.html"}
  ];

  /* ── Arama önizleme (yazdıkça liste) ─────────────────── */
  var SEM_DURUM = {
    acik: 'Kayıtlar Açık', son: 'Son Kontenjan', yakinda: 'Yakında',
    kapandi: 'Kapandı', talep: 'Talep Topla'
  };
  function semNorm(str) {
    return (str || '').toLocaleLowerCase('tr')
      .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
      .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[̀-ͯ]/g, '');
  }
  function semEsc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Başlıkta eşleşen kısmı <mark> ile vurgula (normalize edilmiş eşleşme, orijinal metin korunur)
  function semHighlight(text, tokens) {
    var n = semNorm(text), marks = [];
    tokens.forEach(function (t) {
      var i = n.indexOf(t);
      if (i > -1) marks.push([i, i + t.length]);
    });
    if (!marks.length) return semEsc(text);
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var out = '', pos = 0;
    marks.forEach(function (m) {
      if (m[0] < pos) return;
      out += semEsc(text.slice(pos, m[0])) + '<mark>' + semEsc(text.slice(m[0], m[1])) + '</mark>';
      pos = m[1];
    });
    return out + semEsc(text.slice(pos));
  }

  function initSearchPreview(layer) {
    var input = layer.querySelector('#sem-hdr-q');
    var box = layer.querySelector('#sem-sg-results');
    var cats = layer.querySelector('.sem-search-cats');
    var panel = layer.querySelector('.wrapper');
    if (!input || !box) return;
    var active = -1;

    // Spotlight gibi: satırlar + "tüm sonuçlar" satırı klavyeyle gezilir
    function rows() { return box.querySelectorAll('.sem-sg-row, .sem-sg-all'); }
    function setActive(i, scroll) {
      var items = rows();
      if (!items.length) { active = -1; return; }
      active = (i + items.length) % items.length;
      items.forEach(function (el, k) {
        el.classList.toggle('is-active', k === active);
        el.setAttribute('aria-selected', k === active ? 'true' : 'false');
      });
      if (scroll) items[active].scrollIntoView({ block: 'nearest' });
    }

    function rowHtml(c, tokens, i) {
      var meta = [c.k, c.f, c.g !== 'Eğitim' ? c.g : ''].filter(Boolean).join(' · ');
      return '<li><a class="sem-sg-row" role="option" aria-selected="false" id="sem-sg-opt-' + i + '" href="' + semEsc(c.u) + '">' +
        '<img src="' + semEsc(c.i) + '" alt="" loading="lazy">' +
        '<span class="sem-sg-row-text"><strong>' + semHighlight(c.t, tokens) + '</strong>' +
        '<small>' + semEsc(meta) + '</small></span>' +
        (SEM_DURUM[c.d] ? '<span class="sem-sg-pill sem-sg-pill--' + c.d + '">' + SEM_DURUM[c.d] + '</span>' : '') +
        '<i class="feather-corner-down-left sem-sg-row-go"></i></a></li>';
    }

    function render() {
      var q = input.value.trim();
      active = -1;
      if (panel) panel.classList.toggle('has-query', !!q);
      if (!q) {
        box.hidden = true; box.innerHTML = '';
        if (cats) cats.hidden = false;
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      var tokens = semNorm(q).split(/\s+/).filter(Boolean);
      var hits = SEM_SEARCH_INDEX.map(function (c) {
        var title = semNorm(c.t);
        var hay = title + ' ' + semNorm(c.k + ' ' + c.f + ' ' + c.g);
        if (!tokens.every(function (t) { return hay.indexOf(t) > -1; })) return null;
        // başlıkta / başlık başında eşleşenler üste
        var score = 0;
        tokens.forEach(function (t) {
          if (title.indexOf(t) === 0) score += 3;
          else if (title.indexOf(t) > -1) score += 2;
        });
        if (c.d === 'acik' || c.d === 'son') score += 0.5;
        return { c: c, s: score };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s; });

      var allUrl = 'tum-kurslar.html?q=' + encodeURIComponent(q);
      var html = '';
      if (hits.length) {
        var shown = hits.slice(0, 7);
        html += '<div class="sem-sg-results-head">En İyi Eşleşme</div><ul class="sem-sg-list">' +
          rowHtml(shown[0].c, tokens, 0) + '</ul>';
        if (shown.length > 1) {
          html += '<div class="sem-sg-results-head">Eğitimler · ' + hits.length + ' sonuç</div><ul class="sem-sg-list">';
          shown.slice(1).forEach(function (h, i) { html += rowHtml(h.c, tokens, i + 1); });
          html += '</ul>';
        }
        html += '<a class="sem-sg-all" role="option" aria-selected="false" href="' + allUrl + '">“' + semEsc(q) + '” için tüm sonuçlar<i class="feather-arrow-right"></i></a>';
      } else {
        html += '<div class="sem-sg-empty"><i class="feather-search"></i><strong>Sonuç yok</strong>' +
          '<span>“' + semEsc(q) + '” ile eşleşen eğitim bulunamadı. <a href="tum-kurslar.html">Tüm eğitimlere göz atın</a></span></div>';
      }
      box.innerHTML = html;
      box.hidden = false;
      if (cats) cats.hidden = true;
      input.setAttribute('aria-expanded', 'true');
      if (hits.length) setActive(0, false);   // Spotlight: en iyi eşleşme seçili gelir
    }

    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) {
      var items = rows();
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1, true); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1, true); }
      else if (e.key === 'Enter' && active > -1 && items[active]) {
        e.preventDefault(); window.location.href = items[active].getAttribute('href');
      }
    });
    // fareyle üzerine gelinen satır seçili olur (Spotlight davranışı)
    box.addEventListener('mousemove', function (e) {
      var el = e.target.closest('.sem-sg-row, .sem-sg-all');
      if (!el) return;
      var idx = Array.prototype.indexOf.call(rows(), el);
      if (idx > -1 && idx !== active) setActive(idx, false);
    });
    var clearBtn = layer.querySelector('.sem-sg-esc');
    // Popüler kısayollar: sayfaya gitmek yerine aramayı doldurup önizleme göster
    if (cats) {
      cats.addEventListener('click', function (e) {
        var a = e.target.closest('a');
        if (!a) return;
        e.preventDefault();
        input.value = a.textContent.trim();
        render();
        input.focus();
      });
    }
    return { reset: function () { input.value = ''; render(); }, clearBtn: clearBtn };
  }

  /* ── Sürdürülebilir Kalkınma Amaçları (SKA) — eğitim detay sağ bar ──
     Backend sadece <li class="sem-ska-item"> basar; düzeni öğe sayısına göre burası seçer:
     1–3 → liste (ikon + amaç adı), 4+ → ikon ızgarası (ad, üzerine gelince balon).
     Tasarım önizlemesi: kurs-detay.html?ska=1,4,13  (virgülle 1–17 arası numaralar) */
  var SEM_SKA = ['', 'Yoksulluğa Son', 'Açlığa Son', 'Sağlık ve Kaliteli Yaşam', 'Nitelikli Eğitim',
    'Toplumsal Cinsiyet Eşitliği', 'Temiz Su ve Sanitasyon', 'Erişilebilir ve Temiz Enerji',
    'İnsana Yakışır İş ve Ekonomik Büyüme', 'Sanayi, Yenilikçilik ve Altyapı', 'Eşitsizliklerin Azaltılması',
    'Sürdürülebilir Şehirler ve Topluluklar', 'Sorumlu Üretim ve Tüketim', 'İklim Eylemi', 'Sudaki Yaşam',
    'Karasal Yaşam', 'Barış, Adalet ve Güçlü Kurumlar', 'Amaçlar için Ortaklıklar'];

  function initSka() {
    var box = document.getElementById('sem-ska');
    if (!box) return;
    var list = box.querySelector('.sem-ska-list');
    if (!list) return;

    var demo = getParam('ska');
    if (demo) {
      var nums = demo.split(',').map(function (n) { return parseInt(n, 10); })
        .filter(function (n, i, a) { return n >= 1 && n <= 17 && a.indexOf(n) === i; });
      list.innerHTML = nums.map(function (n) {
        var name = SEM_SKA[n];
        return '<li class="sem-ska-item"><a href="surdurulebilir-kalkinma-amaclari.html#amac-' + n + '">' +
          '<img src="./assets/images/sdg/SDG-' + n + '.svg" alt="Amaç ' + n + ': ' + name + '" loading="lazy">' +
          '<span class="sem-ska-text"><small>Amaç ' + n + '</small><strong>' + name + '</strong></span></a></li>';
      }).join('');
    }

    var count = list.querySelectorAll('.sem-ska-item').length;
    if (!count) { box.hidden = true; return; }
    // ızgarada son satır dengeli kalsın: 6 → 3x2, 7–8 → 4 sütun, 9+ → 5 sütun
    var cols = count <= 3 ? 1 : count <= 5 ? count : count === 6 ? 3 : count <= 8 ? 4 : 5;
    box.setAttribute('data-layout', count <= 3 ? 'list' : 'grid');
    list.setAttribute('data-count', count);
    list.style.setProperty('--ska-cols', cols);
    // balon kenardan taşmasın: ilk / son sütundakileri işaretle
    list.querySelectorAll('.sem-ska-item').forEach(function (li, i) {
      li.classList.toggle('is-col-first', cols > 1 && i % cols === 0);
      li.classList.toggle('is-col-last', cols > 1 && i % cols === cols - 1);
    });
  }

document.addEventListener('DOMContentLoaded', function () {
  initSka();
    var searchInput = document.getElementById('sem-search-input');
    if (searchInput) searchInput.addEventListener('input', filterCards);

    document.querySelectorAll('input[data-filter]').forEach(function (cb) {
      cb.addEventListener('change', filterCards);
    });

    applyUrlParams();
    initNavAuth();

    /* Mobil: sayfa açılışında liste görünümü varsayılan */
    if (window.innerWidth < 768) {
      var col = document.querySelector('.rbt-course-grid-column');
      if (col) {
        col.classList.remove('active-grid-view');
        col.classList.add('active-list-view');
      }
      var gridBtn = document.querySelector('.rbt-grid-view');
      var listBtn = document.querySelector('.rbt-list-view');
      if (gridBtn) gridBtn.classList.remove('active');
      if (listBtn) listBtn.classList.add('active');
    }

    // Navbar arama — Apple glass katmanı
    // Katman <body>'ye taşınır: sticky header'daki transform, position:fixed'i
    // header'a hapsetmesin. Aç/kapa sınıfları vendor main.js ile aynı.
    var searchLayer = document.querySelector('.rbt-search-dropdown.sem-search-glass');
    if (searchLayer) {
      document.body.appendChild(searchLayer);
      var preview = initSearchPreview(searchLayer) || { reset: function () {} };
      var closeSearch = function () {
        searchLayer.classList.remove('active');
        document.documentElement.classList.remove('side-nav-opened');
        document.querySelectorAll('.search-trigger-active').forEach(function (t) {
          t.classList.remove('open');
        });
      };
      document.querySelectorAll('.search-trigger-active').forEach(function (t) {
        t.addEventListener('click', function () {
          setTimeout(function () {
            var q = document.getElementById('sem-hdr-q');
            if (searchLayer.classList.contains('active') && q) q.focus();
          }, 120);
        });
      });
      // bulanık zemine (panel dışına) tıklayınca kapat
      searchLayer.addEventListener('click', function (e) {
        if (e.target === searchLayer) closeSearch();
      });
      // × : sorgu varsa temizler (Spotlight), boşsa / mobilde paneli kapatır
      var escBtn = searchLayer.querySelector('.sem-sg-esc');
      if (escBtn) escBtn.addEventListener('click', function () {
        var q = document.getElementById('sem-hdr-q');
        if (q && q.value && window.innerWidth > 767) { preview.reset(); q.focus(); }
        else closeSearch();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && searchLayer.classList.contains('active')) closeSearch();
      });
    }

    var heroForm = document.getElementById('sem-hero-search-form');
    if (heroForm) {
      heroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = document.getElementById('sem-hero-search-input');
        if (inp && inp.value.trim()) {
          window.location.href = 'tum-kurslar.html?q=' + encodeURIComponent(inp.value.trim());
        }
      });
    }
  });

  /* ── 6. Navbar Auth Durumu ──────────────────────────── */
  function initNavAuth() {
    var guestBtns = document.getElementById('sem-guest-btns');
    var userNav   = document.getElementById('sem-user-nav');
    if (!guestBtns || !userNav) return;

    var loggedIn = sessionStorage.getItem('sem-logged-in') === '1';
    guestBtns.style.display = loggedIn ? 'none' : 'flex';
    userNav.style.display   = loggedIn ? 'flex' : 'none';

    /* Mobil menü auth durumu */
    var mobGuest = document.getElementById('sem-mob-guest-btns');
    var mobUser  = document.getElementById('sem-mob-user-btns');
    if (mobGuest) mobGuest.style.display = loggedIn ? 'none' : 'flex';
    if (mobUser)  mobUser.style.display  = loggedIn ? 'flex' : 'none';

    var toggle   = document.getElementById('sem-user-toggle');
    var dropdown = document.getElementById('sem-user-dropdown');
    if (toggle && dropdown) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
      });
      document.addEventListener('click', function () {
        dropdown.style.display = 'none';
      });
    }

    function doLogout(e) {
      e.preventDefault();
      sessionStorage.removeItem('sem-logged-in');
      window.location.href = 'giris.html';
    }
    var logoutBtn    = document.getElementById('sem-logout-btn');
    var mobLogoutBtn = document.getElementById('sem-mob-logout');
    if (logoutBtn)    logoutBtn.addEventListener('click', doLogout);
    if (mobLogoutBtn) mobLogoutBtn.addEventListener('click', doLogout);
  }

  /* ── Global erişim ───────────────────────────────────── */
  window.semFilterCards = filterCards;
  window.openApplyModal = openApplyModal;

}());
