// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Register GSAP plugins
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== THREE.JS WEBGL BACKGROUND =====
(function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030305, 0.001); // Deep space fog

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 200;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle System Network
  const geometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);

  const colorCyan = new THREE.Color('#00ffc3');
  const colorPurple = new THREE.Color('#7a5cff');

  for(let i = 0; i < particlesCount * 3; i+=3) {
      posArray[i] = (Math.random() - 0.5) * 600;      // x
      posArray[i+1] = (Math.random() - 0.5) * 600;    // y
      posArray[i+2] = (Math.random() - 0.5) * 400;    // z

      // Blend cyan and purple dynamically
      const mixedColor = colorCyan.clone().lerp(colorPurple, Math.random());
      colorArray[i] = mixedColor.r;
      colorArray[i+1] = mixedColor.g;
      colorArray[i+2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const material = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      // Base rotation
      particlesMesh.rotation.y += 0.001; 
      particlesMesh.rotation.x += 0.0005;

      // Add mouse movement offset
      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

      // Add gentle wave emotion to points
      const positions = geometry.attributes.position.array;
      for(let i = 0; i < particlesCount; i++) {
          const i3 = i * 3;
          const x = positions[i3];
          const z = positions[i3 + 2];
          positions[i3 + 1] += Math.sin(elapsedTime + x + z) * 0.05; 
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
})();

// ===== GSAP ANIMATIONS =====
(function initGSAP() {
  if (typeof gsap === 'undefined') return;

  // Master Sequence including Preloader
  const masterTimeline = gsap.timeline();
  if (typeof lenis !== 'undefined') lenis.stop();

  const preloaderStr = document.getElementById('preloader-counter');
  const counterObj = { val: 0 };

  masterTimeline.to(counterObj, {
    val: 100,
    duration: 1.8,
    ease: 'power3.inOut',
    onUpdate: () => {
      if (preloaderStr) preloaderStr.textContent = Math.round(counterObj.val).toString().padStart(2, '0') + '%';
    }
  })
  .to('#preloader', {
    yPercent: -100,
    duration: 1.2,
    ease: 'power4.inOut',
    onComplete: () => {
      if (typeof lenis !== 'undefined') lenis.start();
      const pl = document.getElementById('preloader');
      if (pl) pl.style.display = 'none';
    }
  }, "+=0.2");

  // Hero Section Cinematic Sequence
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });

  heroTimeline
    .fromTo('.hero-eyebrow', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1 })
    .fromTo('.hero-title .title-line', 
      { yPercent: 120, rotation: 2 }, 
      { yPercent: 0, rotation: 0, stagger: 0.15 }, "-=0.8")
    .fromTo('.hero-subtitle', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1 }, "-=1.2")
    .fromTo('.hero-cta a', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 }, "-=1.0")
    .fromTo('.hero-scroll-hint, .hero-counter', 
      { opacity: 0 }, 
      { opacity: 1, duration: 1 }, "-=0.5");

  masterTimeline.add(heroTimeline, "-=0.6");

  // Scroll Animations for Project Timeline Items (Fade Up & Stagger)
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    // Hide old hardcoded reveal classes as GSAP takes over
    item.classList.remove('reveal-left', 'reveal-right'); 
    
    gsap.fromTo(item, 
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        }
      }
    );
  });

  // Staggering About Section
  gsap.fromTo('.about-text', 
    { opacity: 0, y: 40 }, 
    { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: '.about-grid', start: 'top 80%' } });

  gsap.fromTo('.skill-group', 
    { opacity: 0, x: -30 }, 
    { opacity: 1, x: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: '.about-grid', start: 'top 70%' } });

  // Contact Grid Reveal
  const contactCards = document.querySelectorAll('.contact-card');
  contactCards.forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, delay: i * 0.1,
          scrollTrigger: {
              trigger: '.contact-section',
              start: 'top 80%'
          }
      })
  });
})();

// ===== CUSTOM CURSOR MAGNETIC EFFECT =====
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let trailX = 0, trailY = 0;

if (cursor && window.innerWidth > 768) {
  window.addEventListener('pointermove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    const target = e.target;
    // Expanded hover targets for magnetic effect
    const isHoverable = target.closest('a, button, .project-card, .contact-card, .pill');
    
    if (isHoverable) {
        cursor.classList.add('hover');
    } else {
        cursor.classList.remove('hover');
    }
  });

  if (trail) {
    function animateTrail() {
      const cursorX = parseFloat(cursor.style.left || 0);
      const cursorY = parseFloat(cursor.style.top || 0);
      
      trailX += (cursorX - trailX) * 0.15;
      trailY += (cursorY - trailY) * 0.15;
      
      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();
  }
}

// ===== NAV BLUR SCROLL EFFECT =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ===== MOBILE HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') {
    document.body.classList.add('light');
    themeBtn.textContent = '☀️';
  }
  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ===== LENIS SCROLL ANCHORS =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (typeof lenis !== 'undefined') {
        lenis.scrollTo(target, { offset: -64 }); // Offset for navbar
    }
  });
});

// ===== SIDE COUNTER SYNC =====
(function syncCounter() {
  const counterNum = document.querySelector('.counter-num');
  if (!counterNum) return;
  const items = document.querySelectorAll('.timeline-item');
  window.addEventListener('scroll', () => {
    let visible = 1;
    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.6) visible = i + 1;
    });
    counterNum.textContent = String(visible).padStart(2, '0');
  });
})();

// ===== ACTIVE THEORY ULTRA POLISH =====

// 1. RGB Glitch on Mouse Move
const heroTitleLines = document.querySelectorAll('.title-line');
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  heroTitleLines.forEach(line => {
      line.style.setProperty('--rx', x * 10);
      line.style.setProperty('--ry', y * -8);
      line.style.setProperty('--cx', x * -10);
      line.style.setProperty('--cy', y * 8);
  });
});

// 2. Skew on Scroll Context
const projectCards = document.querySelectorAll('.project-card');
if (typeof lenis !== 'undefined') {
  lenis.on('scroll', (e) => {
    // Lenis provides e.velocity
    const velocity = e.velocity || 0;
    // Cap skew max degrees
    const skew = Math.min(Math.max(velocity, -5), 5);
    
    // Apply skew safely to project cards. 
    // We update inline transform, allowing CSS transition to handle smooth snapping when stopped.
    projectCards.forEach(card => {
        // We only skew the inner image wrap to preserve hover states on the card itself
        const imgWrap = card.querySelector('.card-img-wrap');
        if (imgWrap) {
           imgWrap.style.transform = `skewY(${skew * 0.8}deg) scale(1.02)`;
        }
    });

    // Also skew the timeline spine slightly
    const spine = document.querySelector('.timeline-spine');
    if (spine) {
       spine.style.transform = `translateX(-50%) skewY(${-skew * 1.5}deg)`;
    }
  });
}

// ===== GOD-TIER FEATURES  =====

// 3. Cyber-Scrambler Text Decoder
class TextScrambler {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
    this.originalText = el.innerText || el.textContent;
    this.update = this.update.bind(this);
  }
  scramble() {
    this.frameRequest = requestAnimationFrame(this.update);
    this.frame = 0;
    this.queue = [];
    for (let i = 0; i < this.originalText.length; i++) {
        const char = this.originalText[i];
        if(char === ' ' || char === '\\n') {
           this.queue.push({ char, start: 0, end: 0 });
           continue; 
        }
        const start = Math.floor(Math.random() * 20);
        const end = start + Math.floor(Math.random() * 40);
        this.queue.push({ char, start, end });
    }
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { char, start, end } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += char;
      } else if (this.frame >= start) {
        output += `<span class="scramble-char" style="color:var(--cyan);opacity:0.8">${this.randomChar()}</span>`;
      } else {
        output += `<span style="opacity:0">.</span>`;
      }
    }
    this.el.innerHTML = output;
    if (complete !== this.queue.length) {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const scrambleTargets = document.querySelectorAll('.about-text p, .hero-subtitle');
scrambleTargets.forEach((el) => {
    const fx = new TextScrambler(el);
    gsap.to(el, {
        scrollTrigger: {
            trigger: el,
            start: "top 85%",
            onEnter: () => fx.scramble()
        }
    });
});

// 4. True Magnetic Button Physics
const magneticBtns = document.querySelectorAll('.roll-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Pull strength
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.6, ease: 'power3.out' });
        const text = btn.querySelector('.roll-text');
        if(text) gsap.to(text, { x: x * 0.15, y: y * 0.15, duration: 0.6, ease: 'power3.out' });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
        const text = btn.querySelector('.roll-text');
        if(text) gsap.to(text, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
    });
});

// 5. 3D Mouse Parallax on Images (Tilt)
projectCards.forEach(card => {
    const imgWrap = card.querySelector('.card-img-wrap');
    if(!imgWrap) return;
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const posX = (e.clientX - centerX) / (rect.width / 2);
        const posY = (e.clientY - centerY) / (rect.height / 2);
        
        const tiltX = posY * -15; // tilt around X axis
        const tiltY = posX * 15; // tilt around Y axis

        // Scale and lift card
        gsap.to(card, {
             y: -8,
             boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,195,0.15)',
             borderColor: 'rgba(0,255,195,0.4)',
             duration: 0.4
        });
        
        // Tilt Image
        gsap.to(imgWrap, {
             rotationX: tiltX,
             rotationY: tiltY,
             scale: 1.05,
             duration: 0.6,
             ease: 'power2.out',
             transformPerspective: 1500
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
             y: 0,
             boxShadow: 'none',
             borderColor: 'var(--glass-border)',
             duration: 0.6
        });
        gsap.to(imgWrap, {
             rotationX: 0,
             rotationY: 0,
             scale: 1,
             duration: 0.8,
             ease: 'power3.out'
        });
    });
});

// ===== ULTIMATE PREMIUM FEATURES =====

// 1. X-Ray Spotlight Veil
const xray = document.getElementById('xraySpotlight');
if (xray) {
    gsap.set(xray, { xPercent: -50, yPercent: -50 });
    const xrayToX = gsap.quickTo(xray, "x", { duration: 0.4, ease: "power3" });
    const xrayToY = gsap.quickTo(xray, "y", { duration: 0.4, ease: "power3" });
    
    document.addEventListener('mousemove', (e) => {
        xrayToX(e.clientX);
        xrayToY(e.clientY);
    });

    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        aboutSection.addEventListener('mouseenter', () => {
             gsap.to(xray, { width: 350, height: 350, duration: 0.5, ease: "power2.out" });
        });
        aboutSection.addEventListener('mouseleave', () => {
             gsap.to(xray, { width: 0, height: 0, duration: 0.5, ease: "power2.out" });
        });
    }
}

// 2. Neon Click Shockwave
document.addEventListener('click', (e) => {
    const wave = document.createElement('div');
    wave.className = 'click-shockwave';
    document.body.appendChild(wave);
    
    wave.style.left = `${e.clientX}px`;
    wave.style.top = `${e.clientY}px`;
    
    gsap.to(wave, {
        width: 140,
        height: 140,
        opacity: 0,
        borderWidth: 0,
        duration: 0.9,
        ease: "power2.out",
        onComplete: () => wave.remove()
    });
});

// 3. Ambient Digital Dust
const dustCanvas = document.getElementById('dustCanvas');
if (dustCanvas) {
    const dctx = dustCanvas.getContext('2d');
    let dw = dustCanvas.width = window.innerWidth;
    let dh = dustCanvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        dw = dustCanvas.width = window.innerWidth;
        dh = dustCanvas.height = window.innerHeight;
    });

    const particles = [];
    for(let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * dw,
            y: Math.random() * dh,
            r: Math.random() * 1.5,
            s: Math.random() * 0.4 + 0.1,
            a: Math.random() * 0.4 + 0.1
        });
    }

    function drawDust() {
        if (window.scrollY > window.innerHeight * 0.3) {
            dctx.clearRect(0, 0, dw, dh);
            particles.forEach(p => {
                p.y -= p.s;
                if(p.y < 0) p.y = dh;
                dctx.beginPath();
                dctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
                dctx.fillStyle = `rgba(0, 255, 195, ${p.a})`;
                dctx.fill();
            });
        }
        requestAnimationFrame(drawDust);
    }
    drawDust();
}

// 4. Precision HUD Scroll Tracker
const trackerBar = document.getElementById('scrollTrackerBar');
if (typeof lenis !== 'undefined' && trackerBar) {
    lenis.on('scroll', (e) => {
        let max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
        let progress = (window.scrollY / max) * 100;
        if(progress >= 0 && progress <= 100) {
            trackerBar.style.height = `${progress}%`;
        }
    });
}
