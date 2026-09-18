/* ==========================================================================
   Rattle — site scripts
   Mobile nav, sticky header, FAQ accordion, counters, scroll reveal, forms
   ========================================================================== */
(function () {
  'use strict';

  /* The inline <head> script hides .reveal content and removes that class again after
     4s if we never load. Signal immediately so it knows we did. */
  window.__rattleReady = true;

  /* ---- Mobile navigation ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    /* Locking body scroll matters on phones: without it the page slides around
       behind the open menu and the menu appears to jump. */
    var setMenu = function (open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };

    toggle.addEventListener('click', function () {
      setMenu(!links.classList.contains('is-open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    /* Rotating a phone can cross the breakpoint while the menu is open,
       which would otherwise leave the body permanently unscrollable. */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && links.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var panel = item.querySelector('.faq-a');
      var open = item.classList.contains('is-open');

      item.closest('.faq').querySelectorAll('.faq-item.is-open').forEach(function (other) {
        other.classList.remove('is-open');
        other.querySelector('.faq-a').style.maxHeight = null;
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!open) {
        item.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* maxHeight is a fixed pixel value, so text that reflows taller (rotating a phone,
     resizing a window, a late-loading font) would be clipped. Recalculate it. */
  var faqResizeTimer;
  var resizeOpenFaqs = function () {
    document.querySelectorAll('.faq-item.is-open .faq-a').forEach(function (panel) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  };
  var queueFaqResize = function () {
    /* Debounced with setTimeout, NOT requestAnimationFrame: rAF is paused while a tab
       is in the background, so a resize that happens there would never be applied and
       the panel would stay clipped when the user came back. */
    clearTimeout(faqResizeTimer);
    faqResizeTimer = setTimeout(resizeOpenFaqs, 120);
  };
  window.addEventListener('resize', queueFaqResize);
  window.addEventListener('orientationchange', queueFaqResize);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(resizeOpenFaqs);
  }

  /* ---- Scroll reveal + animated counters ----
     Uses a scroll check rather than IntersectionObserver: IO never fires for an
     element that jumps from below the viewport to above it in a single frame
     (fast scroll, anchor jump, restored scroll position), which would leave that
     section invisible for good. This reveals anything at or above the fold. */
  var animateCount = function (el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    var decimals = (el.dataset.count.split('.')[1] || '').length;
    var start = performance.now();
    var dur = 1400;
    var settle = function () { el.textContent = target.toFixed(decimals) + suffix; };
    /* If the tween never gets to run, the markup's placeholder stays on screen,
       and that placeholder is "0" -- so the page would claim zero accounts stay
       in your name. Land the real number regardless of whether rAF ticks. */
    var guard = setTimeout(settle, dur + 300);
    var tick = function (now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) { requestAnimationFrame(tick); } else { clearTimeout(guard); }
    };
    requestAnimationFrame(tick);
  };

  var pending = Array.prototype.slice.call(document.querySelectorAll('.reveal, [data-count]'));
  var queued = false;

  var reveal = function (el) {
    el.classList.add('is-in');
    if (el.hasAttribute('data-count')) animateCount(el);
  };

  var checkReveal = function () {
    queued = false;
    var limit = window.innerHeight - 40;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { reveal(el); return false; }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', queueReveal);
      window.removeEventListener('resize', queueReveal);
    }
  };

  var queueReveal = function () {
    if (queued) return;
    queued = true;
    /* setTimeout rather than requestAnimationFrame: rAF is paused outright
       while a page is hidden -- a background tab, some low-power modes -- and
       every .reveal starts at opacity 0. If the check never runs, the content
       never appears. setTimeout is throttled in that state but still fires. */
    setTimeout(checkReveal, 16);
  };

  window.addEventListener('scroll', queueReveal, { passive: true });
  window.addEventListener('resize', queueReveal);
  window.addEventListener('load', queueReveal);
  /* Re-check when the page becomes visible: nothing scrolls while it is hidden,
     so returning to a background tab is the moment to catch up. */
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) queueReveal();
  });
  checkReveal();

  /* ---- Current year in footer ---- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Contact / lead form: validate, then actually send ----
     Delivery goes through FormSubmit (formsubmit.co) — no account needed, the
     address in the form's action receives the mail. See README for how to swap
     in Web3Forms, Formspree or Netlify Forms instead.

     Two rules this code follows, because a lead lost in silence is worse than
     no form at all:
       1. Never claim success unless the server confirmed it.
       2. On failure, keep what the user typed and show them another way through. */
  var CONTACT_PHONE = '+91 80102 18846';
  var CONTACT_TEL = '+918010218846';

  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('button[type="submit"]');

    var say = function (msg, ok) {
      if (!status) return;
      status.innerHTML = msg;
      status.classList.add('is-visible');
      status.classList.toggle('is-error', !ok);
    };

    var validate = function () {
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (input) {
        var field = input.closest('.field');
        var value = (input.value || '').trim();
        var valid = value !== '';
        if (valid && input.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
        if (valid && input.type === 'tel') valid = value.replace(/\D/g, '').length >= 10;
        if (field) field.classList.toggle('is-invalid', !valid);
        if (!valid && ok) { input.focus(); ok = false; }
      });
      return ok;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;

      // Record which page produced the lead
      var src = form.querySelector('[name="source_page"]');
      if (src) src.value = location.pathname.replace(/^\//, '') || 'index.html';

      var action = form.getAttribute('action');
      if (!action) {
        say('This form isn\'t connected yet. Please call <a href="tel:' + CONTACT_TEL + '" style="text-decoration:underline">' + CONTACT_PHONE + '</a> instead.', false);
        return;
      }

      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = 'Sending…'; }
      if (status) status.classList.remove('is-visible');

      // FormSubmit's AJAX endpoint returns JSON instead of redirecting
      var url = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');

      fetch(url, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { return { ok: res.ok, data: d }; }); })
        .then(function (r) {
          if (!r.ok || String(r.data.success) === 'false') {
            throw new Error(r.data.message || 'Submission rejected');
          }
          say('Thanks — your enquiry has reached us. We\'ll get back to you within one working day.', true);
          form.reset();
        })
        .catch(function (err) {
          // Keep the user's input; give them a route that always works
          say('Sorry — we couldn\'t send that just now. Please call or WhatsApp us on <a href="tel:' + CONTACT_TEL + '" style="text-decoration:underline">' + CONTACT_PHONE + '</a> and we\'ll pick it up straight away.', false);
          if (window.console) console.error('[Rattle] form submit failed:', err);
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
        });
    });

    form.querySelectorAll('[required]').forEach(function (input) {
      input.addEventListener('input', function () {
        var f = input.closest('.field');
        if (f) f.classList.remove('is-invalid');
      });
    });
  });

})();
