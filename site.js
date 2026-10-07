(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const S = window.SITE, PROJECTS = window.PROJECTS || [];
  const page = document.body.dataset.page || '';
  const current = document.body.dataset.project || '';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────── Shared markup ───────── */
  const copyIcon = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3v5.5A1.5 1.5 0 0 0 3.5 10H4"/></svg>';
  const emailBtn = `<button type="button" class="pill pill--light copy-email" data-email="${S.email}" aria-label="Copy email address"><span>${S.email}</span>${copyIcon}<em class="copy-toast" role="status">Email copied!</em></button>`;

  const nav = `
  <header class="site-nav" id="nav">
    <div class="site-nav__inner container">
      <a href="index.html" class="site-nav__name">${S.name}</a>
      <nav class="site-nav__links" aria-label="Primary">
        <a href="index.html#about" data-nav="about">About</a>
        <a href="work.html" data-nav="work">Work</a>
      </nav>
      <div class="site-nav__right">
        <span>Let's connect</span>
        ${emailBtn}
      </div>
      <button type="button" class="site-nav__burger" id="burger" aria-label="Open menu" aria-expanded="false"><i></i><i></i></button>
    </div>
    <div class="menu" id="menu" aria-hidden="true">
      <a href="index.html#about">About</a>
      <a href="work.html">Work</a>
      <a href="#contact">Let's connect</a>
    </div>
  </header>`;

  const footer = `
  <footer class="footer" id="contact">
    <div class="container footer__grid">
      <div class="footer__about">
        <b>${S.name}</b>
        <p>${S.tagline}</p>
      </div>
      <div class="footer__cta">
        <h2>Think I'd be a good fit for your team or project? Let's connect.</h2>
        ${emailBtn}
      </div>
      <div class="footer__cols">
        <div>
          <h4>Selected projects</h4>
          <ul>${PROJECTS.map((p) => `<li><a href="${p.href}">${p.footerLabel || p.title}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>Socials</h4>
          <ul>${S.socials.map((s) => `<li><a href="${s.href}" target="_blank" rel="noopener">${s.label}</a></li>`).join('')}</ul>
        </div>
      </div>
    </div>
    <div class="footer__bar">
      <div class="container">
        <span>Designed &amp; built by ${S.name}</span>
        <span>Portfolio - ${new Date().getFullYear()}©</span>
      </div>
    </div>
  </footer>`;

  const workCard = (p, i = 0) => `
    <a href="${p.href}" class="work-card reveal" style="--d:${i * 0.08}s">
      <img src="${p.cover}" alt="" loading="lazy" decoding="async">
      <span class="work-card__tint"></span>
      <span class="work-card__text">
        <h3>${p.title}</h3>
        <span>${p.subtitle || ''}</span>
      </span>
    </a>`;

  const moreWork = () => {
    const others = PROJECTS.filter((p) => p.slug !== current);
    return `
    <section class="more-work container${others.length ? '' : ' more-work--solo'}">
      ${others.length ? `<h2 class="more-work__title reveal">More work this way</h2>
      <div class="work-list">${others.map(workCard).join('')}</div>` : ''}
      <div class="more-work__cta reveal"><a href="work.html" class="pill pill--light">All work</a></div>
    </section>`;
  };

  const mounts = { nav: () => nav, footer: () => footer, 'work-list': () => `<div class="work-list">${PROJECTS.map(workCard).join('')}</div>`, 'more-work': moreWork,
    'contact-note': () => `<p class="contact-note reveal">For more projects please <a href="mailto:${S.email}">contact me</a>.</p>` };
  $$('[data-site]').forEach((el) => {
    const make = mounts[el.dataset.site];
    if (make) el.outerHTML = make();
  });

  const years = $('[data-site-years]');
  if (years && PROJECTS.length) {
    const all = PROJECTS.flatMap((p) => p.years);
    years.textContent = `(${Math.min(...all)} – ${Math.max(...all)})`;
  }

  /* ───────── Motion helpers ───────── */
  $$('[data-load] .line, .page-title .line').forEach((l, i) => l.firstElementChild.style.setProperty('--i', i % 3));
  requestAnimationFrame(() => document.body.classList.add('is-loaded'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, [data-lines]').forEach((el) => io.observe(el));

  /* ───────── Copy email ───────── */
  $$('.copy-email').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      try { await navigator.clipboard.writeText(email); }
      catch {
        const t = Object.assign(document.createElement('textarea'), { value: email });
        document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove();
      }
      btn.classList.add('is-copied');
      clearTimeout(btn._t);
      btn._t = setTimeout(() => btn.classList.remove('is-copied'), 1600);
    });
  });

  /* ───────── Mobile menu ───────── */
  const navEl = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => {
    navEl.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!navEl.classList.contains('is-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ───────── Active nav link ───────── */
  const links = Object.fromEntries($$('[data-nav]').map((a) => [a.dataset.nav, a]));
  const setActive = (key) => Object.entries(links).forEach(([k, a]) => a.classList.toggle('is-active', k === key));
  setActive(page === 'home' ? 'about' : page);

  /* ───────── Parallax (home) ───────── */
  const items = $$('[data-speed]');
  if (items.length && !reduceMotion) {
    let ticking = false;
    const update = () => {
      const vh = innerHeight;
      items.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.speed)).toFixed(1)}px`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  /* ───────── Screenshot gallery (case studies; needs Bootstrap JS) ─────────
     Any element with data-lightbox="image.png" opens the preview.
     Title/caption come from data-title / data-caption, or from the h4 / p of its .screen.
     Items inside the same [data-gallery] container can be browsed with ← → (buttons, keys, swipe). */
  const triggers = $$('[data-lightbox]');
  if (triggers.length && window.bootstrap) {
    document.body.insertAdjacentHTML('beforeend', `
    <div class="modal fade lightbox" id="lightbox" tabindex="-1" aria-label="Screenshot preview" aria-hidden="true">
      <button type="button" class="lightbox__close" data-bs-dismiss="modal" aria-label="Close preview">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="lightbox__stage">
            <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous screenshot">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>
            </button>
            <img class="lightbox__img" src="" alt="">
            <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next screenshot">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          <div class="lightbox__meta">
            <h4 class="lightbox__title"></h4>
            <p class="lightbox__caption"></p>
            <span class="lightbox__count"></span>
          </div>
        </div>
      </div>
    </div>`);

    const lb = $('#lightbox');
    const modal = new bootstrap.Modal(lb);
    const img = $('.lightbox__img', lb), title = $('.lightbox__title', lb), cap = $('.lightbox__caption', lb), count = $('.lightbox__count', lb);
    const prev = $('.lightbox__nav--prev', lb), next = $('.lightbox__nav--next', lb);
    let set = [], idx = 0;

    const textOf = (el, key, sel) => el.dataset[key] ?? el.closest('.screen')?.querySelector(sel)?.textContent.trim() ?? '';
    const show = (i) => {
      idx = (i + set.length) % set.length;
      const el = set[idx];
      img.src = el.dataset.lightbox;
      title.textContent = textOf(el, 'title', 'h4');
      cap.textContent = textOf(el, 'caption', 'p');
      img.alt = title.textContent;
      count.textContent = set.length > 1 ? `${idx + 1} / ${set.length}` : '';
      prev.hidden = next.hidden = set.length < 2;
      if (set.length > 1) new Image().src = set[(idx + 1) % set.length].dataset.lightbox;  // preload next
    };

    triggers.forEach((el) => el.addEventListener('click', () => {
      const group = el.closest('[data-gallery]');
      set = group ? $$('[data-lightbox]', group) : [el];
      show(set.indexOf(el));
      modal.show();
    }));
    prev.addEventListener('click', () => show(idx - 1));
    next.addEventListener('click', () => show(idx + 1));
    lb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    let x0 = null;
    lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (x0 === null || set.length < 2) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    lb.addEventListener('hidden.bs.modal', () => { img.src = ''; });
  }

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
