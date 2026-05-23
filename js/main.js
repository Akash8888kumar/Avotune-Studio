/* ═══════════════════════════════════════════════════════════════
   AVOTUNE STUDIO — main.js
   Shared across all pages: cursor, particles, navbar, scroll reveal
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CUSTOM CURSOR ─────────────────────────────────────────── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function trackRing() {
      rx += (mx - rx) * .14;
      ry += (my - ry) * .14;
      dot.style.left  = mx + 'px'; dot.style.top  = my + 'px';
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(trackRing);
    })();
    document.querySelectorAll('a,button,[role=button]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.7)');
      el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  /* ── PARTICLES ─────────────────────────────────────────────── */
  const pCanvas = document.getElementById('av-particles');
  if (pCanvas) {
    const pc = pCanvas.getContext('2d');
    let W, H, pts = [];

    const resize = () => {
      W = pCanvas.width  = window.innerWidth;
      H = pCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Pt {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.r  = Math.random() * 1.4 + .4;
        this.vx = (Math.random() - .5) * .35;
        this.vy = (Math.random() - .5) * .35;
        this.a  = Math.random() * .25 + .04;
        this.c  = Math.random() > .5 ? '#ff1f8e' : '#0af0ff';
      }
      step() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        pc.beginPath();
        pc.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        pc.fillStyle = this.c;
        pc.globalAlpha = this.a;
        pc.fill();
      }
    }
    for (let i = 0; i < 90; i++) pts.push(new Pt());

    (function loop() {
      pc.clearRect(0, 0, W, H);
      pts.forEach(p => { p.step(); p.draw(); });
      pc.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  }

  /* ── NAVBAR ────────────────────────────────────────────────── */
  const nav = document.getElementById('av-nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('solid', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav toggle */
  const hamburger = document.querySelector('.nav-hamburger');
  const linksWrap  = document.querySelector('.nav-links-wrap');
  const overlay    = document.querySelector('.nav-overlay');
  if (hamburger && linksWrap) {
    const open = () => { linksWrap.classList.add('open'); overlay && overlay.classList.add('show'); document.body.style.overflow = 'hidden'; };
    const close = () => { linksWrap.classList.remove('open'); overlay && overlay.classList.remove('show'); document.body.style.overflow = ''; };
    hamburger.addEventListener('click', open);
    overlay && overlay.addEventListener('click', close);
    linksWrap.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* ── SCROLL REVEAL ─────────────────────────────────────────── */
  const srEls = document.querySelectorAll('.sr');
  if (srEls.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: .12 });
    srEls.forEach(el => obs.observe(el));
  }

  /* ── SKILL BARS ────────────────────────────────────────────── */
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-fill[data-w]').forEach(f => {
          f.style.width = f.dataset.w + '%';
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: .2 });
  document.querySelectorAll('.skill-section').forEach(s => skillObs.observe(s));

  /* ── FAQ ACCORDION ─────────────────────────────────────────── */
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const box  = trigger.closest('.faq-box');
      const isOpen = box.classList.contains('active');
      document.querySelectorAll('.faq-box.active').forEach(b => b.classList.remove('active'));
      if (!isOpen) box.classList.add('active');
    });
  });

  /* ── ACTIVE NAV LINK ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAs    = document.querySelectorAll('.nav-links a[href^="#"]');
  if (sections.length && navAs.length) {
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navAs.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: .4 });
    sections.forEach(s => sectionObs.observe(s));
  }

  /* ── SMOOTH SCROLL FOR ANCHORS ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
