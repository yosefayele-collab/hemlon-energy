/* ============================================================
   HEMLON ENERGY — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---- sticky nav state ---- */
  var nav = document.querySelector('.nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 30) nav.classList.add('is-solid');
    else nav.classList.remove('is-solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile drawer ---- */
  var burger = document.querySelector('.nav__burger');
  var drawer = document.querySelector('.nav__drawer');
  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  /* ---- animated counters ---- */
  function animate(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = (el.getAttribute('data-dec') === '1');
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = dec ? val.toFixed(1) : Math.round(val).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = dec ? target.toFixed(1) : target.toLocaleString();
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- product filter ---- */
  var filters = document.querySelectorAll('.filter');
  var prods = document.querySelectorAll('.prod');
  if (filters.length) {
    filters.forEach(function (f) {
      f.addEventListener('click', function () {
        filters.forEach(function (x) { x.classList.remove('is-active'); });
        f.classList.add('is-active');
        var cat = f.getAttribute('data-filter');
        prods.forEach(function (p) {
          var show = cat === 'all' || p.getAttribute('data-cat') === cat;
          p.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq__q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq__item');
      var a = item.querySelector('.faq__a');
      var open = item.classList.toggle('is-open');
      a.style.maxHeight = open ? a.scrollHeight + 'px' : 0;
    });
  });

  /* ---- contact form -> builds a detailed email (no backend needed) ---- */
  var form = document.querySelector('#leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var get = function (k) { return (d.get(k) || '').toString().trim(); };
      var lines = [
        'NEW ENQUIRY — Hemlon Energy website', '',
        'Name: ' + get('name'),
        'Organisation: ' + get('org'),
        'Phone: ' + get('phone'),
        'Email: ' + get('email'),
        'Sector: ' + get('sector'),
        'Interested in: ' + get('interest'),
        'Site location: ' + get('location'),
        'Estimated budget: ' + get('budget'), '',
        'What they need:',
        get('message')
      ];
      var subject = 'Proposal request — ' + (get('org') || get('name') || 'New lead');
      var body = encodeURIComponent(lines.join('\n'));
      var mail = 'mailto:hemlonenergy@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + body;
      // reveal success state
      var ok = document.querySelector('.form-ok');
      var inner = document.querySelector('#formInner');
      if (ok && inner) { inner.style.display = 'none'; ok.classList.add('show'); }
      window.location.href = mail;
    });
  }

  /* ---- year ---- */
  var y = document.querySelector('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
