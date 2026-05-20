/* =====================================================
   DEERIFY – PHOTO HUNTER  |  script.js
   ===================================================== */

(function () {
  'use strict';

  /* ── Hero Ken-Burns ── */
  document.body.classList.add('loaded');

  /* ── Scrolled header ── */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Smooth scroll for all anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── Hamburger / Mobile Nav ── */
  const hamburger  = document.getElementById('hamburger');
  const mainNav    = document.getElementById('main-nav');
  const navOverlay = document.getElementById('nav-overlay');

  function openNav() {
    hamburger.classList.add('open');
    mainNav.classList.add('open');
    navOverlay.classList.add('visible');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('open');
    mainNav.classList.remove('open');
    navOverlay.classList.remove('visible');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    if (hamburger.classList.contains('open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  navOverlay.addEventListener('click', closeNav);

  /* Close menu when a nav link is clicked */
  mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) closeNav();
  });

  /* ── Tracking Log Slider ── */
  const cards     = document.getElementById('tracking-cards');
  const btnPrev   = document.getElementById('slider-prev');
  const btnNext   = document.getElementById('slider-next');

  if (cards && btnPrev && btnNext) {
    const getScrollAmount = () => {
      const card = cards.querySelector('.log-card');
      if (!card) return 280;
      const style = window.getComputedStyle(cards);
      const gap   = parseFloat(style.gap) || 20;
      return card.offsetWidth + gap;
    };

    btnNext.addEventListener('click', () => {
      cards.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    btnPrev.addEventListener('click', () => {
      cards.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    /* Show / hide buttons based on scroll position */
    const updateBtns = () => {
      const { scrollLeft, scrollWidth, clientWidth } = cards;
      btnPrev.style.opacity = scrollLeft <= 4 ? '0.3' : '1';
      btnPrev.style.pointerEvents = scrollLeft <= 4 ? 'none' : 'auto';
      btnNext.style.opacity = scrollLeft + clientWidth >= scrollWidth - 4 ? '0.3' : '1';
      btnNext.style.pointerEvents = scrollLeft + clientWidth >= scrollWidth - 4 ? 'none' : 'auto';
    };

    cards.addEventListener('scroll', updateBtns, { passive: true });
    updateBtns();
  }

  /* ── Intersection Observer: fade-in sections ── */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  /* Add fade-in base style programmatically to avoid FOUC */
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity .7s ease, transform .7s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .fade-in-delay-1 { transition-delay: .1s; }
    .fade-in-delay-2 { transition-delay: .22s; }
    .fade-in-delay-3 { transition-delay: .34s; }
  `;
  document.head.appendChild(style);

  /* Apply fade-in to elements */
  const fadeTargets = [
    '.eyebrow',
    '.section-title',
    '.section-title-sm',
    '.body-text',
    '.btn',
    '.log-card',
    '.about-stat',
    '.insta-thumb',
  ];

  document.querySelectorAll(fadeTargets.join(',')).forEach((el, i) => {
    el.classList.add('fade-in');
    const delay = i % 3;
    if (delay === 1) el.classList.add('fade-in-delay-1');
    if (delay === 2) el.classList.add('fade-in-delay-2');
    io.observe(el);
  });

})();
