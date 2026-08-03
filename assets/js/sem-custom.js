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
document.addEventListener('DOMContentLoaded', function () {
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
