/* ═══════════════════════════════════════════════════════════════
   AVOTUNE STUDIO — blog-detail.js
   Blog detail / article page interactions
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── READING PROGRESS BAR ─────────────────────────────────── */
  const progressBar = document.getElementById('read-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docH   = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progressBar.style.width = Math.min(scrolled, 100) + '%';
    }, { passive: true });
  }

  /* ── TABLE OF CONTENTS – ACTIVE HIGHLIGHT ─────────────────── */
  const headings = document.querySelectorAll('.article-body h2[id], .article-body h3[id]');
  const tocItems = document.querySelectorAll('.toc-item');

  if (headings.length && tocItems.length) {
    const tocObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          tocItems.forEach(item => {
            const link = item.querySelector('a');
            item.classList.toggle('active', link && link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-10% 0% -70% 0%' });
    headings.forEach(h => tocObs.observe(h));
  }

  /* ── SHARE BUTTONS ────────────────────────────────────────── */
  const pageUrl   = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const shareMap = {
    'share-twitter':   `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`,
    'share-facebook':  `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
    'share-linkedin':  `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`,
    'share-whatsapp':  `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`,
  };

  Object.entries(shareMap).forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => window.open(url, '_blank', 'width=600,height=400'));
  });

  /* Copy link */
  const copyLinkBtn = document.getElementById('share-copy');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const orig = copyLinkBtn.innerHTML;
        copyLinkBtn.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => { copyLinkBtn.innerHTML = orig; }, 1600);
      }).catch(() => {});
    });
  }

  /* ── COMMENT FORM ─────────────────────────────────────────── */
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = commentForm.querySelector('.submit-btn');
      const name = commentForm.querySelector('[name=name]')?.value.trim() || 'Anonymous';
      const text = commentForm.querySelector('[name=comment]')?.value.trim();
      if (!text) return;

      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Posting…';

      setTimeout(() => {
        const list = document.getElementById('comments-list');
        if (list) {
          const colors = ['var(--grad-alt)','var(--grad-main)','var(--grad-cool)'];
          const color  = colors[Math.floor(Math.random() * colors.length)];
          const html = `
            <div class="comment-card" style="animation:fadeInUp .5s ease both">
              <div class="comment-avatar" style="background:${color};">${name.charAt(0).toUpperCase()}</div>
              <div>
                <div class="comment-name">${name}</div>
                <div class="comment-date">Just now</div>
                <div class="comment-text">${text}</div>
                <button class="comment-reply">↩ Reply</button>
              </div>
            </div>`;
          list.insertAdjacentHTML('afterbegin', html);
          const countEl = document.getElementById('comment-count');
          if (countEl) countEl.textContent = parseInt(countEl.textContent || 0) + 1;
        }
        commentForm.reset();
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Post Comment';
      }, 1200);
    });
  }

  /* ── LIKE BUTTON ──────────────────────────────────────────── */
  const likeBtn   = document.getElementById('like-btn');
  const likeCount = document.getElementById('like-count');
  if (likeBtn && likeCount) {
    let liked = false;
    let count = parseInt(likeCount.textContent || '0');
    likeBtn.addEventListener('click', () => {
      liked = !liked;
      count += liked ? 1 : -1;
      likeCount.textContent = count;
      likeBtn.classList.toggle('liked', liked);
      likeBtn.style.color = liked ? 'var(--pink)' : '';
      likeBtn.style.borderColor = liked ? 'var(--pink)' : '';
      likeBtn.querySelector('i').className = liked ? 'fas fa-heart' : 'far fa-heart';
    });
  }

  /* ── NEWSLETTER ───────────────────────────────────────────── */
  const nlForm = document.querySelector('.sidebar-nl-form');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = nlForm.querySelector('button');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check me-1"></i>Subscribed!';
      btn.style.background = 'linear-gradient(135deg,#00c9b1,#0af0ff)';
      btn.disabled = true;
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; nlForm.reset(); }, 3500);
    });
  }

  /* ── HIGHLIGHT CODE BLOCKS ────────────────────────────────── */
  document.querySelectorAll('.article-body pre').forEach(pre => {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative;';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    const copyBtn = document.createElement('button');
    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
    copyBtn.style.cssText = `
      position:absolute; top:14px; right:14px;
      background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
      border-radius:6px; padding:6px 10px; cursor:pointer;
      color:var(--muted); font-size:12px; transition:all .2s;`;
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(pre.textContent).then(() => {
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.color = 'var(--teal)';
        setTimeout(() => { copyBtn.innerHTML = '<i class="fas fa-copy"></i>'; copyBtn.style.color = ''; }, 1500);
      });
    });
    wrap.appendChild(copyBtn);
  });

  /* ── ESTIMATED READ TIME (hero) ───────────────────────────── */
  const articleBody = document.querySelector('.article-body');
  const readTimeEl  = document.getElementById('post-read-time');
  if (articleBody && readTimeEl) {
    const words = articleBody.textContent.trim().split(/\s+/).length;
    const mins  = Math.max(1, Math.round(words / 220));
    readTimeEl.textContent = mins + ' min read';
  }

});
