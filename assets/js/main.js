/**
 * Portfolio interactions:
 * - Theme toggle (persisted)
 * - Mobile nav
 * - Active section indicator (scroll spy)
 * - Scroll-to-top
 * - Subtle reveal-on-scroll
 */

(function () {
  'use strict';

  const docEl = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const toTop = document.getElementById('to-top');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  const sections = document.querySelectorAll('main section[id]');

  /* ---------- Theme ---------- */
  function getTheme() {
    return docEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme) {
    docEl.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (e) {
      /* ignore */
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Mobile menu ---------- */
  function closeMobileMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  function openMobileMenu() {
    if (!mobileMenu || !navToggle) return;
    mobileMenu.hidden = false;
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
  }

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', function () {
      if (mobileMenu.hidden) {
        openMobileMenu();
      } else {
        closeMobileMenu();
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  /* ---------- Active nav (scroll spy) ---------- */
  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href') || '';
      const match = href === '#' + id;
      link.classList.toggle('is-active', match);
    });
  }

  function onScrollSpy() {
    const offset = 120;
    let current = 'home';

    sections.forEach(function (section) {
      const top = section.offsetTop - offset;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    setActiveLink(current);
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  /* ---------- Scroll to top ---------- */
  function updateToTop() {
    if (!toTop) return;
    toTop.hidden = window.scrollY < 400;
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', updateToTop, { passive: true });
    updateToTop();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
