/* ═══════════════════════════════════════════════════════════════
   AVOTUNE STUDIO — blog.js
   Blog listing page interactions
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── CATEGORY FILTER ──────────────────────────────────────── */
  const catTabs = document.querySelectorAll('.cat-tab');
  const blogCards = document.querySelectorAll('.blog-card[data-cat]');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter || 'all';
      blogCards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.opacity    = '0';
        card.style.transform  = 'scale(.97)';
        card.style.transition = 'opacity .3s, transform .3s';
        setTimeout(() => {
          card.style.display  = show ? 'flex' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              card.style.opacity   = '1';
              card.style.transform = 'scale(1)';
            });
          }
        }, 160);
      });
    });
  });

  /* ── SEARCH ───────────────────────────────────────────────── */
  const searchInput = document.querySelector('.blog-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      blogCards.forEach(card => {
        const title   = card.querySelector('.bc-title')   ?.textContent.toLowerCase() || '';
        const excerpt = card.querySelector('.bc-excerpt') ?.textContent.toLowerCase() || '';
        const match   = !q || title.includes(q) || excerpt.includes(q);
        card.style.display = match ? 'flex' : 'none';
      });
    });
  }

  /* ── NEWSLETTER FORM ──────────────────────────────────────── */
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = nlForm.querySelector('button[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-1"></i>Subscribed!';
      btn.style.background = 'linear-gradient(135deg,#00c9b1,#0af0ff)';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false;
        nlForm.reset();
      }, 3500);
    });
  }

  /* ── PAGINATION ───────────────────────────────────────────── */
  document.querySelectorAll('.pg-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pg-btn[data-page]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // In a real site this would load page data; for demo scroll to grid
      const grid = document.querySelector('.blog-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── READING TIME ESTIMATE ────────────────────────────────── */
  document.querySelectorAll('.blog-card').forEach(card => {
    const excerpt = card.querySelector('.bc-excerpt')?.textContent || '';
    const words   = excerpt.trim().split(/\s+/).length;
    const mins    = Math.max(1, Math.round(words / 200));
    const rtEl    = card.querySelector('.bc-read-time-val');
    if (rtEl) rtEl.textContent = mins + ' min read';
  });

});
