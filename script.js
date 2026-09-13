/**
 * ओम श्री पानी पूरी सेंटर (OM SHREE PANI PURI CENTRE)
 * Owner: Deepak Sahu
 * Scroll Animation Engine, Stat Counter, and Mobile Optimization
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initScrollProgress();
  initHeaderScroll();
  initBackToTop();
  initNavHighlighting();
  initDeveloperModal();
});

/* ==========================================================================
   1. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.reveal-on-scroll');

  // Fallback for browsers where IntersectionObserver is not available
  if (!('IntersectionObserver' in window)) {
    animatedElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px', // Triggers reliably on mobile screens
    threshold: 0.08
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;

        setTimeout(() => {
          el.classList.add('is-revealed');

          // Trigger counter animation when stat card becomes visible
          const counterEl = el.querySelector('.counter-value');
          if (counterEl && !counterEl.classList.contains('has-counted')) {
            startCounterAnimation(counterEl);
          }
        }, parseInt(delay, 10));

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => {
    // Check if element is already in viewport on load
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const delay = el.getAttribute('data-delay') || 0;
      setTimeout(() => {
        el.classList.add('is-revealed');
        const counterEl = el.querySelector('.counter-value');
        if (counterEl && !counterEl.classList.contains('has-counted')) {
          startCounterAnimation(counterEl);
        }
      }, parseInt(delay, 10));
    } else {
      revealObserver.observe(el);
    }
  });
}

/* ==========================================================================
   2. STAT NUMBER COUNTER ANIMATION (0 to 100%)
   ========================================================================== */
function startCounterAnimation(counterEl) {
  counterEl.classList.add('has-counted');
  const target = parseInt(counterEl.getAttribute('data-target') || '100', 10);
  const duration = 1400; // ms
  const frameRate = 30;
  const totalFrames = Math.round((duration / 1000) * frameRate);
  let frame = 0;

  const easeOutQuart = t => 1 - (--t) * t * t * t;

  const timer = setInterval(() => {
    frame++;
    const progress = easeOutQuart(frame / totalFrames);
    const current = Math.round(progress * target);
    counterEl.textContent = current;

    if (frame >= totalFrames) {
      counterEl.textContent = target;
      clearInterval(timer);
    }
  }, 1000 / frameRate);
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* ==========================================================================
   4. STICKY HEADER SCROLL SHADOW
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   5. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   6. ACTIVE NAV LINK HIGHLIGHTING
   ========================================================================== */
function initNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   7. DEVELOPER PORTFOLIO DETAILS
   ========================================================================== */
function initDeveloperModal() {
  const savedAuthor = localStorage.getItem('panipuri_dev_name') || 'Gulshan Kumar';
  const savedPortfolio = localStorage.getItem('panipuri_dev_portfolio') || 'https://gulxn2006.github.io/portfolio/';
  
  const devNameEl = document.getElementById('dev-author-name');
  const devLinkEl = document.getElementById('dev-portfolio-btn');
  const footerDevLink = document.querySelector('.footer-dev-anchor');

  if (devNameEl) {
    devNameEl.textContent = savedAuthor;
  }
  if (devLinkEl) devLinkEl.href = savedPortfolio;
  if (footerDevLink) footerDevLink.href = savedPortfolio;
}
