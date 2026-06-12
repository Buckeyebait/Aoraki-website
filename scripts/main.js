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
  var CONTACT_EMAIL = 'aorakicreations@gmail.com';
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

  /* ---------------- hero stars: subtle twinkle ---------------- */
  var canvas = document.getElementById('stars');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var stars = [];
    var w, h, dpr, raf;
    var twinkle = !prefersReduced;

    function buildStars() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // fewer stars on small screens; weighted toward the upper sky
      var count = Math.min(170, Math.round(w * h / 8500));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.pow(Math.random(), 1.5) * h * 0.82,
          r: Math.random() * 1.3 + 0.35,
          base: Math.random() * 0.5 + 0.3,
          amp: Math.random() * 0.4 + 0.15,
          speed: Math.random() * 1.6 + 0.4,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function drawStars(t) {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = s.base + (twinkle ? Math.sin(t * 0.001 * s.speed + s.phase) * s.amp : 0);
        if (a < 0.04) a = 0.04;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(214,228,255,' + a + ')';
        ctx.fill();
      }
    }

    function loop(t) { drawStars(t); raf = requestAnimationFrame(loop); }

    buildStars();
    if (twinkle) raf = requestAnimationFrame(loop);
    else drawStars(0);

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { buildStars(); if (!twinkle) drawStars(0); }, 200);
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
            setStatus('Got it — we\'ll get back to you within one business day.', 'ok');
          } else {
            setStatus('Something went wrong. Email us directly at ' + CONTACT_EMAIL + '.', 'err');
          }
        }).catch(function () {
          setStatus('Something went wrong. Email us directly at ' + CONTACT_EMAIL + '.', 'err');
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
      setStatus('Opening your email app… if nothing happens, write us at ' + CONTACT_EMAIL + '.', 'ok');
    });
  }
})();
