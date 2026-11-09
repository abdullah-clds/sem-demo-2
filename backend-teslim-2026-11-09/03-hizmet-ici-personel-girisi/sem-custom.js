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

