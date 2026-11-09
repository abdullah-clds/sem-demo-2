/* ============================================================
   SEM Custom Scripts — Kapadokya Üniversitesi SEM
   Sadece vanilla JS.
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

      /* .sem-course-card, grid/liste hücresini saran .course-grid-3 icinde yer alir;
         gizlemeyi sadece karta uygulamak bos hucreyi (33% genislik) akista birakip
         diger kartlarin duzensiz bosluklarla kaymasina yol aciyordu (bkz. destek talebi) */
      var target = card.closest('.course-grid-3') || card;
      target.classList.toggle('sem-hidden', !show);
      if (show) visible++;
    });

    var noResult = document.getElementById('sem-no-result');
    if (noResult) noResult.classList.toggle('sem-hidden', visible > 0);

    document.querySelectorAll('.sem-sonuc-sayisi').forEach(function (el) {
      el.textContent = visible;
    });
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
    if (courseInput)   courseInput.value   = courseName || '';
    if (courseIdInput) courseIdInput.value = courseId || '';

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
  /* Arama önizleme dizini — /api/arama-dizini'nden (aktif eğitimler) ilk açılışta bir kez yüklenir.
     t: başlık, k: kategori, g: grup, d: durum, i: görsel, u: link */
  var SEM_SEARCH_INDEX = [];
  var semIndexState = 'idle'; // idle | loading | ready
  var semIndexWaiting = [];
  function loadSearchIndex(done) {
    if (semIndexState === 'ready') { done(); return; }
    if (semIndexWaiting.indexOf(done) === -1) semIndexWaiting.push(done);
    if (semIndexState === 'loading') return;
    semIndexState = 'loading';
    fetch('/api/arama-dizini', { headers: { 'Accept': 'application/json' } })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (data) { SEM_SEARCH_INDEX = Array.isArray(data) ? data : []; })
      .catch(function () { SEM_SEARCH_INDEX = []; })
      .then(function () {
        // API yoksa (statik prototip) sayfadaki kartlardan dizin kurulur
        if (!SEM_SEARCH_INDEX.length) SEM_SEARCH_INDEX = indexFromCards();
        semIndexState = 'ready';
        var waiting = semIndexWaiting; semIndexWaiting = [];
        waiting.forEach(function (fn) { fn(); });
      });
  }

  function indexFromCards() {
    return Array.prototype.map.call(document.querySelectorAll('.sem-course-card'), function (c) {
      var a = c.querySelector('.rbt-card-title a');
      var img = c.querySelector('.rbt-card-img img');
      var tag = c.querySelector('.rbt-meta .feather-tag');
      return {
        t: a ? a.textContent.trim() : (c.dataset.ad || ''),
        k: tag ? tag.parentNode.textContent.trim() : '',
        g: 'Eğitim', d: c.dataset.durum || '',
        i: img ? img.getAttribute('src') : '',
        u: a ? a.getAttribute('href') : 'kurs-detay.html'
      };
    });
  }

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
      if (semIndexState !== 'ready') return;   // dizin yüklenince render yeniden çağrılır
      var tokens = semNorm(q).split(/\s+/).filter(Boolean);
      var hits = SEM_SEARCH_INDEX.map(function (c) {
        var title = semNorm(c.t);
        var hay = title + ' ' + semNorm([c.k, c.f, c.g].join(' '));
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

    input.addEventListener('input', function () { loadSearchIndex(render); });
    input.addEventListener('focus', function () { loadSearchIndex(render); });
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
        loadSearchIndex(render);
        input.focus();
      });
    }
    return { reset: function () { input.value = ''; render(); }, clearBtn: clearBtn };
  }

  /* ── Sürdürülebilir Kalkınma Amaçları (SKA) — eğitim detay sağ bar ──
     Sunucu sadece <li class="sem-ska-item"> basar; düzeni öğe sayısına göre burası seçer:
     1–3 → liste (ikon + amaç adı), 4+ → ikon ızgarası (ad, üzerine gelince balon). */
  function initSka() {
    var box = document.getElementById('sem-ska');
    if (!box) return;
    var list = box.querySelector('.sem-ska-list');
    if (!list) return;

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

    /* Kategori seçili açılan sayfada sadece o kategorinin kartları gelir;
       başka kategoriye geçmek ya da seçimi kaldırmak listeyi yeniden yükler */
    var sunucuFiltreli = document.querySelector('.categories-list-check[data-sunucu-filtreli="1"]');
    if (sunucuFiltreli) {
      sunucuFiltreli.addEventListener('change', function (e) {
        var cb = e.target;
        window.location.href = cb.checked
          ? 'tum-kurslar.html?kategori=' + encodeURIComponent(cb.value)
          : 'tum-kurslar.html';
      });
    }

    applyUrlParams();
    initNavAuth();

    /* Mobil: filtre paneli kapanınca sayfa kartların başına gelsin (üstte sabit header payı) */
    var filtrePanel = document.getElementById('semFilterCollapse');
    if (filtrePanel) {
      filtrePanel.addEventListener('hidden.bs.collapse', function () {
        var sonuclar = document.querySelector('.sem-course-grid-col');
        if (sonuclar) window.scrollTo(0, sonuclar.getBoundingClientRect().top + window.scrollY - 100);
      });
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

  /* ── Başvuru modalı: doğrulama + teşekkür ekranı ─────── */
  /* Doğrulama burada; gönderim sem-site.js'teki window.semApplySend ile /api/on-basvuru'ya
     yapılır (Promise döner, hata olursa kendisi uyarı gösterip reddeder). Yine de
     'sem:apply-submit' olayı yayınlanır (detail: mode, course_id, egitim, kategori,
     ad_soyad, telefon, eposta, kun_ogrenci, mesaj, kvkk). */
  function initApplyForm() {
    var modalEl = document.getElementById('semApplyModal');
    var form    = document.getElementById('semApplyForm');
    var submit  = document.getElementById('semApplySubmit');
    if (!modalEl || !form || !submit) return;

    var body   = form.parentNode;
    var footer = modalEl.querySelector('.modal-footer');

    var success = document.createElement('div');
    success.className = 'sem-modal-success';
    success.style.display = 'none';
    success.setAttribute('role', 'status');
    success.innerHTML =
      '<i class="feather-check"></i>' +
      '<h4>Başvurunuz alındı</h4>' +
      '<p>En kısa sürede sizinle iletişime geçeceğiz. Teşekkür ederiz.</p>';
    body.appendChild(success);

    var rules = [
      { name: 'kategori',    msg: 'Lütfen bir kategori seçin.',
        ok: function (v) { return !!v; } },
      { name: 'ad_soyad',    msg: 'Lütfen adınızı ve soyadınızı yazın.',
        ok: function (v) { return v.trim().length >= 3; } },
      { name: 'telefon',     msg: 'Geçerli bir telefon numarası girin.',
        ok: function (v) { var d = v.replace(/\D/g, ''); return d.length === 10 || d.length === 11 || d.length === 12; } },
      { name: 'eposta',      msg: 'Geçerli bir e-posta adresi girin.',
        ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      { name: 'kun_ogrenci', msg: 'Lütfen bir seçenek işaretleyin.',
        ok: function () { return !!form.querySelector('[name="kun_ogrenci"]:checked'); } },
      { name: 'kvkk',        msg: 'Devam etmek için KVKK metnini onaylamanız gerekiyor.',
        ok: function () { return form.querySelector('[name="kvkk"]').checked; } }
    ];

    function wrapOf(name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? el.closest('.sem-modal-field, .sem-modal-check') : null;
    }
    function setError(name, msg) {
      var wrap = wrapOf(name);
      if (!wrap) return;
      var err = wrap.querySelector(':scope > .sem-modal-error');
      if (!err) {
        err = document.createElement('div');
        err.className = 'sem-modal-error';
        wrap.appendChild(err);
      }
      err.textContent = msg;
      wrap.classList.add('is-invalid');
    }
    function clearError(name) {
      var wrap = wrapOf(name);
      if (wrap) wrap.classList.remove('is-invalid');
    }

    function validate() {
      var first = null;
      rules.forEach(function (r) {
        var el = form.querySelector('[name="' + r.name + '"]');
        if (!el) return;
        if (r.ok(el.value || '')) {
          clearError(r.name);
        } else {
          setError(r.name, r.msg);
          if (!first) first = el;
        }
      });
      if (first) first.focus();
      return !first;
    }

    function showSuccess() {
      form.style.display = 'none';
      success.style.display = '';
      submit.style.display = 'none';
      var cancel = footer && footer.querySelector('[data-bs-dismiss="modal"]');
      if (cancel) cancel.textContent = 'Kapat';
    }

    function handleSubmit(e) {
      if (e) e.preventDefault();
      if (submit.disabled || !validate()) return;

      var data = { mode: modalEl.dataset.mode || 'basvuru' };
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      document.dispatchEvent(new CustomEvent('sem:apply-submit', { detail: data }));

      if (typeof window.semApplySend !== 'function') { showSuccess(); return; }
      submit.disabled = true;
      Promise.resolve(window.semApplySend(form, data))
        .then(showSuccess, function () { /* hata mesajı semApplySend'de gösterildi */ })
        .then(function () { submit.disabled = false; });
    }

    submit.addEventListener('click', handleSubmit);
    form.addEventListener('submit', handleSubmit);

    // alan düzeltildikçe hatası kalksın
    ['input', 'change'].forEach(function (type) {
      form.addEventListener(type, function (e) {
        if (e.target.name && wrapOf(e.target.name) &&
            wrapOf(e.target.name).classList.contains('is-invalid')) {
          var rule = rules.filter(function (r) { return r.name === e.target.name; })[0];
          if (rule && rule.ok(e.target.value || '')) clearError(e.target.name);
        }
      });
    });

    // kapanınca formu sıfırla — sonraki açılışta temiz başlasın
    modalEl.addEventListener('hidden.bs.modal', function () {
      var courseInput = form.querySelector('[name="egitim"]');
      var courseId    = form.querySelector('[name="course_id"]');
      var keepCourse  = courseInput ? courseInput.value : '';
      var keepId      = courseId ? courseId.value : '';
      form.reset();
      if (courseInput) courseInput.value = keepCourse;
      if (courseId) courseId.value = keepId;
      rules.forEach(function (r) { clearError(r.name); });
      form.style.display = '';
      success.style.display = 'none';
      submit.style.display = '';
      var cancel = footer && footer.querySelector('[data-bs-dismiss="modal"]');
      if (cancel) cancel.textContent = 'Vazgeç';
    });
  }

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
        '<span><i class="sem-lej-kayit"></i>Son kayıt</span>' +
        (secili.dataset.saat ? '<span class="sem-cal-saat"><i class="feather-clock"></i>Başlangıç ' + secili.dataset.saat + '</span>' : '') +
        '</div>';
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

  /* ── Hizmet içi eğitimler: personel girişi penceresi ──────
     #semPersonelModal sayfada varsa ve window.__semPersonel true değilse açılır.
     Backend personel girişli kullanıcıya modal bloğunu basmazsa hiçbir şey olmaz. */
  function initPersonelModal() {
    var el = document.getElementById('semPersonelModal');
    if (!el || window.__semPersonel === true) return;
    if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
      document.body.classList.add('sem-personel-kilit');
      bootstrap.Modal.getOrCreateInstance(el).show();
    }
  }

  function initRevizyon() {
    document.querySelectorAll('[data-sem-takvim]').forEach(initTakvim);
    initPersonelModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplyForm);
    document.addEventListener('DOMContentLoaded', initRevizyon);
  } else {
    initApplyForm();
    initRevizyon();
  }

  /* ── Global erişim ───────────────────────────────────── */
  window.semFilterCards = filterCards;
  window.openApplyModal = openApplyModal;
  /* Statik prototip yedeği — canlıda sem-site.js (sonra yüklenir) gerçek sepeteEkle ile ezer */
  if (typeof window.sepeteEkle !== 'function') {
    window.sepeteEkle = function () { window.location.href = 'giris.html'; };
  }

}());
