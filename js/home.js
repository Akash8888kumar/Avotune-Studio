/* ═══════════════════════════════════════════════════════════════
   AVOTUNE STUDIO — home.js
   Home-page-specific interactions
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── HERO WAVEFORM CANVAS ─────────────────────────────────── */
  const wc = document.getElementById('hero-wave');
  if (wc) {
    const ctx = wc.getContext('2d');
    let offset = 0;

    const resize = () => { wc.width = wc.offsetWidth || window.innerWidth; wc.height = 110; };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, wc.width, wc.height);
      const waves = [
        { amp: 22, freq: 5,  speed: .018, alpha: .55, lw: 2,   colors: ['#ff1f8e','#0af0ff'] },
        { amp: 14, freq: 8,  speed: .027, alpha: .35, lw: 1.5, colors: ['#7b2fff','#ff1f8e'] },
        { amp: 8,  freq: 12, speed: .04,  alpha: .2,  lw: 1,   colors: ['#0af0ff','#00c9b1'] },
      ];
      waves.forEach((w, i) => {
        const grad = ctx.createLinearGradient(0, 0, wc.width, 0);
        grad.addColorStop(0,   'transparent');
        grad.addColorStop(.25, w.colors[0]);
        grad.addColorStop(.75, w.colors[1]);
        grad.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth   = w.lw;
        ctx.globalAlpha = w.alpha;
        for (let x = 0; x <= wc.width; x += 2) {
          const prog = x / wc.width;
          const y    = 55
            + Math.sin(prog * Math.PI * w.freq + offset * w.speed * 60 + i) * w.amp
            + Math.sin(prog * Math.PI * (w.freq * 1.7) + offset * .03 + i * 1.3) * (w.amp * .4);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      offset++;
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ── COUNTDOWN TIMER ─────────────────────────────────────── */
  const cdEls = {
    days:  document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins:  document.getElementById('cd-mins'),
    secs:  document.getElementById('cd-secs'),
  };
  if (cdEls.secs) {
    const target = new Date(Date.now() + (2 * 86400 + 14 * 3600 + 37 * 60) * 1000);
    const pad = n => String(n).padStart(2, '0');
    setInterval(() => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      cdEls.days.textContent  = pad(Math.floor(diff / 86400000));
      cdEls.hours.textContent = pad(Math.floor((diff % 86400000) / 3600000));
      cdEls.mins.textContent  = pad(Math.floor((diff % 3600000) / 60000));
      cdEls.secs.textContent  = pad(Math.floor((diff % 60000) / 1000));
    }, 1000);
  }

  /* ── FLOATING MUSIC PLAYER ───────────────────────────────── */
  const player = document.getElementById('float-player');
  const playBtn = document.getElementById('fp-play');
  const playIcon = document.getElementById('fp-icon');
  const fpBar = document.getElementById('fp-bar');
  const fpTime = document.getElementById('fp-time');

  if (player && playBtn) {
    let isPlaying = false;
    let audioCtx = null, gainNode = null;
    let totalSecs = 180, currentSecs = 0, timerInterval = null;

    const songs = [
      { title: 'Studio Vibe Mix', artist: 'Avotune Beats' },
      { title: 'Lo-Fi Focus',     artist: 'Avotune Beats' },
      { title: 'Bass Drop',       artist: 'Avotune Beats' },
    ];
    let songIdx = 0;

    const pad = n => String(Math.floor(n)).padStart(2, '0');
    const formatTime = s => `${pad(s/60)}:${pad(s%60)}`;
    const updateSongMeta = () => {
      const s = songs[songIdx];
      const titleEl  = document.getElementById('fp-title');
      const artistEl = document.getElementById('fp-artist');
      if (titleEl)  titleEl.textContent  = s.title;
      if (artistEl) artistEl.textContent = s.artist;
    };

    const stopAudio = () => {
      isPlaying = false;
      player.classList.remove('playing');
      playIcon.className = 'fas fa-play';
      clearInterval(timerInterval);
      if (gainNode) {
        try { gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + .4); }
        catch(e) {}
        setTimeout(() => { try { audioCtx.close(); } catch(e) {} audioCtx = null; gainNode = null; }, 500);
      }
    };

    const startAudio = () => {
      isPlaying = true;
      player.classList.add('playing');
      playIcon.className = 'fas fa-pause';

      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(.07, audioCtx.currentTime + .6);
      gainNode.connect(audioCtx.destination);

      // Generative ambient music: a simple pentatonic sequence
      const pentatonic = [220, 261.63, 293.66, 349.23, 392, 440, 523.25, 587.33];
      let noteIdx = 0;
      const playNote = () => {
        if (!isPlaying || !audioCtx) return;
        const osc  = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator(); // sub-bass
        const g    = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pentatonic[noteIdx % pentatonic.length], audioCtx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(pentatonic[noteIdx % pentatonic.length] / 2, audioCtx.currentTime);
        g.gain.setValueAtTime(.05, audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(.001, audioCtx.currentTime + .55);
        osc.connect(g); osc2.connect(g); g.connect(gainNode);
        osc.start(); osc.stop(audioCtx.currentTime + .6);
        osc2.start(); osc2.stop(audioCtx.currentTime + .6);
        noteIdx++;
        setTimeout(playNote, 480 + Math.random() * 200);
      };
      playNote();

      timerInterval = setInterval(() => {
        currentSecs++;
        const pct = (currentSecs / totalSecs) * 100;
        if (fpBar)  fpBar.style.width = pct + '%';
        if (fpTime) fpTime.textContent = formatTime(currentSecs) + ' / ' + formatTime(totalSecs);
        if (currentSecs >= totalSecs) { currentSecs = 0; songIdx = (songIdx + 1) % songs.length; updateSongMeta(); }
      }, 1000);
    };

    playBtn.addEventListener('click', () => isPlaying ? stopAudio() : startAudio());

    const prevBtn = document.getElementById('fp-prev');
    const nextBtn = document.getElementById('fp-next');
    if (prevBtn) prevBtn.addEventListener('click', () => { songIdx = (songIdx - 1 + songs.length) % songs.length; updateSongMeta(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { songIdx = (songIdx + 1) % songs.length; updateSongMeta(); });

    updateSongMeta();
  }

  /* ── FORM SUBMIT ──────────────────────────────────────────── */
  const enrollForm = document.getElementById('enroll-form');
  if (enrollForm) {
    const submitBtn = enrollForm.querySelector('.submit-btn');
    enrollForm.addEventListener('submit', e => {
      e.preventDefault();
      const orig = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Submitted! We\'ll be in touch soon.';
      submitBtn.style.background = 'linear-gradient(135deg,#00c9b1,#0af0ff)';
      submitBtn.disabled = true;
      setTimeout(() => {
        submitBtn.innerHTML = orig;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        enrollForm.reset();
      }, 4000);
    });
  }

  /* ── HERO NUMBER COUNTER ANIMATION ───────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el   = e.target;
        const end  = parseInt(el.dataset.count);
        const dur  = 1800;
        const step = end / (dur / 16);
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + step, end);
          el.textContent = Math.floor(cur) + (el.dataset.suffix || '');
          if (cur >= end) clearInterval(t);
        }, 16);
        cObs.unobserve(el);
      });
    }, { threshold: .3 });
    counters.forEach(c => cObs.observe(c));
  }

  /* ── GALLERY MOUSE PARALLAX ───────────────────────────────── */
  document.querySelectorAll('.g-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const r = item.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 8;
      const y = ((e.clientY - r.top)  / r.height - .5) * 8;
      item.style.transform = `perspective(600px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => { item.style.transform = ''; });
  });

  /* ── EQ BAR MUSIC PULSE ───────────────────────────────────── */
  // Randomise eq bar heights so they look alive even without audio
  document.querySelectorAll('.eq-bar').forEach(bar => {
    const rnd = () => 6 + Math.random() * 34;
    bar.style.setProperty('--h1', rnd() + 'px');
    bar.style.setProperty('--h2', rnd() + 'px');
    bar.style.setProperty('--d',  (.4 + Math.random() * .7).toFixed(2) + 's');
  });

});
