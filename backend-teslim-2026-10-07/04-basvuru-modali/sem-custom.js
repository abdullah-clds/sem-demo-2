/*
  DOSYA: assets/js/sem-custom.js — IIFE içinde, "Global erişim" bloğunun hemen ÜSTÜNE YENİ eklendi.

  Ayrıca openApplyModal() içinde 2 satır değişti (kurumsal talepte önceki eğitim adı kalmasın):
    ÖNCESİ:  if (courseInput   && courseName) courseInput.value   = courseName;
             if (courseIdInput && courseId)   courseIdInput.value = courseId;
    SONRASI: if (courseInput)   courseInput.value   = courseName || '';
             if (courseIdInput) courseIdInput.value = courseId || '';
*/

  /* ── Başvuru modalı: doğrulama + teşekkür ekranı ─────── */
  /* Site statik: form verisi sunucuya gönderilmez. Backend bağlanınca
     'sem:apply-submit' olayını dinleyip e.detail'i API'ye post etmesi yeterli
     (detail: mode, course_id, egitim, kategori, ad_soyad, telefon, eposta, kun_ogrenci, mesaj, kvkk). */
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

    function handleSubmit(e) {
      if (e) e.preventDefault();
      if (!validate()) return;

      var data = { mode: modalEl.dataset.mode || 'basvuru' };
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      document.dispatchEvent(new CustomEvent('sem:apply-submit', { detail: data }));

      form.style.display = 'none';
      success.style.display = '';
      submit.style.display = 'none';
      var cancel = footer && footer.querySelector('[data-bs-dismiss="modal"]');
      if (cancel) cancel.textContent = 'Kapat';
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplyForm);
  } else {
    initApplyForm();
  }
