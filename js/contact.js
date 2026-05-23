/* ═══════════════════════════════════════════════════════════════
   AVOTUNE STUDIO — contact.js
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── SUBJECT CHIPS ────────────────────────────────────────── */
  document.querySelectorAll('.subject-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.subject-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const hiddenInput = document.getElementById('subject-input');
      if (hiddenInput) hiddenInput.value = chip.dataset.subject || chip.textContent.trim();
    });
  });

  /* ── CONTACT FORM ─────────────────────────────────────────── */
  const form        = document.getElementById('contact-form');
  const formInner   = document.getElementById('contact-form-inner');
  const successMsg  = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending…';

      setTimeout(() => {
        if (formInner)  formInner.style.display  = 'none';
        if (successMsg) successMsg.classList.add('show');
      }, 1400);
    });
  }

  /* Reset form */
  const resetBtn = document.getElementById('reset-form-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (formInner)  { formInner.style.display = ''; form && form.reset(); }
      if (successMsg) successMsg.classList.remove('show');
      const btn = form && form.querySelector('.submit-btn');
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message'; }
      document.querySelectorAll('.subject-chip').forEach(c => c.classList.remove('active'));
    });
  }

  /* ── FAQ MINI ─────────────────────────────────────────────── */
  // handled by shared main.js faq logic (.faq-trigger / .faq-box)

  /* ── OFFICE HOURS HIGHLIGHT ───────────────────────────────── */
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = days[new Date().getDay()];
  document.querySelectorAll('.hours-row').forEach(row => {
    if (row.dataset.day === today) {
      row.style.background = 'rgba(255,31,142,.04)';
      row.style.borderRadius = '6px';
      const cells = row.querySelectorAll('td');
      if (cells[0]) cells[0].style.color = 'var(--text)';
    }
  });

  /* ── FLOATING MAP PIN PULSE ───────────────────────────────── */
  const mapPin = document.querySelector('.map-pin');
  if (mapPin) {
    setInterval(() => {
      mapPin.style.transform = 'scale(1.15)';
      setTimeout(() => { mapPin.style.transform = 'scale(1)'; }, 300);
    }, 2000);
  }

  /* ── CHARACTER COUNT ──────────────────────────────────────── */
  const msgArea  = document.getElementById('msg-textarea');
  const charCount = document.getElementById('char-count');
  if (msgArea && charCount) {
    msgArea.addEventListener('input', () => {
      charCount.textContent = msgArea.value.length;
    });
  }

  /* ── COPY TO CLIPBOARD ────────────────────────────────────── */
  document.querySelectorAll('[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      navigator.clipboard.writeText(el.dataset.copy).then(() => {
        const orig = el.innerHTML;
        el.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => { el.innerHTML = orig; }, 1500);
      }).catch(() => {});
    });
  });

});
