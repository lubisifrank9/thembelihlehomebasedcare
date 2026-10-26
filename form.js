/* =====================================================
   THEMBELIHLE HOMEBASED CARE - FORM PAGE SCRIPTS
   ===================================================== */
(function () {
  'use strict';

  /* ---------- MOBILE MENU ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- FADE-IN ON SCROLL ---------- */
  var fades = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    fades.forEach(function (el) { io.observe(el); });
  } else {
    fades.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- SHOW MORE / SHOW LESS ---------- */
  document.querySelectorAll('[data-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = document.getElementById(btn.getAttribute('data-toggle'));
      var willShow = box.hasAttribute('hidden');
      if (willShow) { box.removeAttribute('hidden'); } else { box.setAttribute('hidden', ''); }
      btn.textContent = willShow ? 'Show less' : 'Show more';
      btn.setAttribute('aria-expanded', willShow);
    });
  });
  /* ---------- PLACEHOLDER LINKS (e.g. Facebook until the real link is added) ---------- */
  document.querySelectorAll('[data-placeholder]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---------- FOOTER YEAR ---------- */
  var yr = document.getElementById('year');
  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* ---------- REQUEST FORM (Netlify) ---------- */
  var form = document.getElementById('requestForm');
  if (form) {
    var steps = form.querySelectorAll('[data-for]');
    var typeInputs = form.querySelectorAll('input[name="request_type"]');
    var success = document.getElementById('formSuccess');
    var errBox = document.getElementById('formError');
    var submitBtn = document.getElementById('formSubmit');
    var section = document.getElementById('request-form');

    var showFor = function (key) {
      steps.forEach(function (fs) {
        var on = !!key && fs.getAttribute('data-for').split(' ').indexOf(key) > -1;
        fs.hidden = !on;
        fs.disabled = !on;
      });
      if (errBox) { errBox.hidden = true; }
    };
    var chooseType = function (key) {
      typeInputs.forEach(function (r) { r.checked = (r.getAttribute('data-key') === key); });
      showFor(key);
    };
    typeInputs.forEach(function (r) {
      r.addEventListener('change', function () { showFor(r.getAttribute('data-key')); });
    });

    /* links from other pages: how-to-help.html?type=donate#request-form */
    var wanted = new URLSearchParams(window.location.search).get('type');
    if (wanted) { chooseType(wanted); }
    /* work out age from date of birth */
    var dob = document.getElementById('child_dob');
    var age = document.getElementById('child_age');
    if (dob && age) {
      dob.max = new Date().toISOString().slice(0, 10);
      dob.addEventListener('change', function () {
        if (!dob.value) { return; }
        var b = new Date(dob.value), t = new Date();
        var a = t.getFullYear() - b.getFullYear();
        var m = t.getMonth() - b.getMonth();
        if (m < 0 || (m === 0 && t.getDate() < b.getDate())) { a--; }
        age.value = Math.max(0, a);
      });
    }

    /* send to Netlify without leaving the page */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var body = new URLSearchParams(new FormData(form)).toString();
      var label = submitBtn.textContent;
      submitBtn.disabled = true; submitBtn.textContent = 'Sending...';
      errBox.hidden = true;
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (res) {
          if (!res.ok) { throw new Error('Request failed'); }
          var chosen = form.querySelector('input[name="request_type"]:checked');
          document.getElementById('successText').textContent =
            'We have received your request (' + (chosen ? chosen.value : 'request') + ') and we will contact you soon.';
          form.reset(); showFor(null);
          form.hidden = true; success.hidden = false;
          success.focus(); success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () { errBox.hidden = false; })
        .then(function () { submitBtn.disabled = false; submitBtn.textContent = label; });
    });

    var another = document.getElementById('anotherBtn');
    if (another) {
      another.addEventListener('click', function () {
        success.hidden = true; form.hidden = false;
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

})();
