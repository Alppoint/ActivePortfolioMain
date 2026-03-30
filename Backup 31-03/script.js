// Custom cursor 
const cursor = document.querySelector('.cursor');
window.addEventListener('pointermove', (e) => {
  if (!cursor) return;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  
  if (e.target.closest('a, button, .project-card')) {
    cursor.classList.add('hover');
  } else {
    cursor.classList.remove('hover');
  }
});

// Scroll-reveal
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 0.1, 0.4)}s`;
  observer.observe(el);
});

// Nav scroll effect
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// 🌙 Theme toggle
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const body = document.body;
  
  if (savedTheme === 'light') {
    body.classList.add('light');
    themeBtn.textContent = '☀️';
  } else {
    themeBtn.textContent = '🌙';
  }
  
  themeBtn.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// 🔥 NEW: MOBILE HAMBURGER MENU 
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Close menu when clicking links (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// 🔗 Smooth scroll (cubic easing)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    smoothScrollTo(target.getBoundingClientRect().top + window.pageYOffset - 80, 800);
  });
});

function smoothScrollTo(targetY, duration) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const ease = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startY + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

// Active nav highlight 
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// 🖥️ Performance: Disable cursor on mobile 
if (window.innerWidth > 768) {
  document.addEventListener('DOMContentLoaded', () => {<!-- FORCE FOOTER -->
<div style="position:relative;z-index:100;padding:4rem 10vw 2rem;margin-top:4rem;border-top:1px solid rgba(255,255,255,0.15);text-align:center;">
  <p style="color:#f5f5f5 !important;font-size:1.1rem;margin:0;font-weight:500;letter-spacing:0.03em;">
    Made with ❤️ in <span style="color:#00ffc3;">Gurugram, India</span> | 
    <a href="https://github.com/Alppoint/ActivePortfolioMain" target="_blank" style="color:#00ffc3 !important;text-decoration:none;font-weight:600;">
      View Source →
    </a>
  </p>
</div>

    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  });
}