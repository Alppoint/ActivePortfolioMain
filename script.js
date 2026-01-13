// custom cursor
const cursor = document.querySelector('.cursor');

window.addEventListener('pointermove', (e) => {
  if (!cursor) return;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// scroll-reveal
const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // optional: stop observing once revealed
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach((el, index) => {
  // small stagger effect
  el.style.transitionDelay = `${index * 0.08}s`;
  observer.observe(el);
});
// nav background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  if (window.scrollY > 40){
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
// smooth scroll for nav links with easing
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const startY = window.pageYOffset;
    const targetY = target.getBoundingClientRect().top + window.pageYOffset - 70; // offset for nav
    const duration = 700;
    let startTime = null;

    function easeOutCubic(t){
      return 1 - Math.pow(1 - t, 3);
    }

    function animateScroll(timestamp){
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutCubic(progress);
      const newY = startY + (targetY - startY) * ease;

      window.scrollTo(0, newY);

      if (elapsed < duration){
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  });
});


