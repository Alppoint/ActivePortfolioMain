// 🚀 Enhanced script.js - Clean & Simple (your style preserved)

// Custom cursor
const cursor = document.querySelector('.cursor');
window.addEventListener('pointermove', (e) => {
  if (!cursor) return;
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
  
  // Smooth cursor growth on interactive elements
  if (e.target.closest('a, button, .project-card')) {
    cursor.classList.add('hover');
  } else {
    cursor.classList.remove('hover');
  }
});

// Scroll-reveal (improved)
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target); // Performance
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px' // Trigger earlier
});

revealElements.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 0.1, 0.4)}s`; // Cap stagger
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

// 🌙 Theme toggle (fixed + smooth)
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  // Load theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  const body = document.body;
  
  if (savedTheme === 'light') {
    body.classList.add('light');
    themeBtn.textContent = '☀️';
  } else {
    themeBtn.textContent = '🌙';
  }
  
  // Toggle
  themeBtn.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// 🔗 Smooth scroll for ALL anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (!target) return;
    
    e.preventDefault();
    smoothScrollTo(target.getBoundingClientRect().top + window.pageYOffset - 80, 800);
  });
});

// Smooth scroll function (cubic easing)
function smoothScrollTo(targetY, duration) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Smooth cubic easing
    const ease = 1 - Math.pow(1 - progress, 3);
    
    window.scrollTo(0, startY + distance * ease);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  requestAnimationFrame(animation);
}

// 📊 Simple stats counter animation (optional - add if you want)
function animateStats() {
  const stats = document.querySelectorAll('.stats span strong');
  stats.forEach(stat => {
    const target = parseInt(stat.textContent);
    let current = 0;
    const increment = target / 50;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        stat.textContent = target;
        clearInterval(timer);
      } else {
        stat.textContent = Math.floor(current);
      }
    }, 30);
  });
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

// 🖥️ Performance: Stop cursor on mobile
if (window.innerWidth > 768) {
  document.addEventListener('DOMContentLoaded', () => {
    // Preload images for smoother scroll
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  });
}
