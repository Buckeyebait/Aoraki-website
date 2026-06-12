/* =====================================================================
   AORAKI CREATIONS — main.js
   Nav, mobile menu, scroll reveals, hero canvas, contact form.
   No dependencies. No build step.
   ===================================================================== */
(function () {
  'use strict';

  /* ---- where the contact form goes ----------------------------------
     By default the form opens the visitor's email app, addressed to you,
     with everything filled in. Nothing else to set up.

     To get submissions straight to your inbox (no mail app popup):
       1. Make a free form at https://formspree.io
       2. Paste the URL they give you between the quotes below.
       3. Re-publish.
  ------------------------------------------------------------------- */
  var CONTACT_EMAIL = 'aoraki@aorakicreations.com';
  var FORM_ENDPOINT = ''; // e.g. 'https://formspree.io/f/abcdwxyz'

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- nav: scrolled state ---------------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile menu ---------------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  function closeMenu() {
    links.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------------- reveal on scroll ---------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------------- footer year ---------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- hero canvas: drifting particles ---------------- */
  var canvas = document.getElementById('peaks');
  if (canvas && !prefersReduced) {
    var ctx = canvas.getContext('2d');
    var dots = [];
    var w, h, dpr;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(90, Math.round(w * h / 16000));
      dots = [];
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.4,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(Math.random() * 0.22 + 0.05),
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy;
        if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
        if (d.x < -4) d.x = w + 4;
        if (d.x > w + 4) d.x = -4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(150,180,255,' + d.a + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    var raf;
    size();
    frame();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(size, 200);
    });
  }

  /* ---------------- contact form ---------------- */
  var form = document.getElementById('projectForm');
  var status = document.getElementById('formStatus');

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = 'form__status' + (kind ? ' is-' + kind : '');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var email = (data.get('email') || '').toString().trim();
      var message = (data.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        setStatus('Please fill in your name, email, and what you need.', 'err');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('That email address looks off — mind checking it?', 'err');
        return;
      }

      // Option A: a real endpoint is set → send in the background.
      if (FORM_ENDPOINT) {
        setStatus('Sending…', null);
        fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        }).then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus('Got it — I\'ll get back to you within one business day.', 'ok');
          } else {
            setStatus('Something went wrong. Email me directly at ' + CONTACT_EMAIL + '.', 'err');
          }
        }).catch(function () {
          setStatus('Something went wrong. Email me directly at ' + CONTACT_EMAIL + '.', 'err');
        });
        return;
      }

      // Option B (default): open the visitor's email app, pre-filled.
      var business = (data.get('business') || '').toString().trim();
      var budget = (data.get('budget') || '').toString().trim();
      var subject = 'New project inquiry — ' + name + (business ? ' (' + business + ')' : '');
      var body =
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Business: ' + (business || '—') + '\n' +
        'Budget: ' + (budget || '—') + '\n\n' +
        'What they need:\n' + message + '\n';
      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      setStatus('Opening your email app… if nothing happens, write me at ' + CONTACT_EMAIL + '.', 'ok');
    });
  }
})();
