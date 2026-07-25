// smooth scrolling using the Lenis library
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

// register GSAP scroll plugin
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// three.js hero: particles + wireframe primitives (stable motion, debounced resize)
(function initThreeJS() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06060a, 0.00165);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 200;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const wireShared = {
    wireframe: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  };

  function wireMesh(geom, hex, opacity, pos, rot) {
    const mat = new THREE.MeshBasicMaterial({ color: hex, opacity, ...wireShared });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(pos);
    if (rot) mesh.rotation.set(rot.x || 0, rot.y || 0, rot.z || 0);
    scene.add(mesh);
    return mesh;
  }

  const torus = wireMesh(new THREE.TorusGeometry(120, 4, 12, 64), 0x5eead4, 0.12, new THREE.Vector3(80, 40, -40));
  const ico = wireMesh(new THREE.IcosahedronGeometry(55, 1), 0x5eead4, 0.1, new THREE.Vector3(-100, -30, 20));
  const ring = wireMesh(
    new THREE.TorusGeometry(90, 2, 8, 48),
    0xa78bfa,
    0.09,
    new THREE.Vector3(40, 90, -80),
    { x: Math.PI / 2.2 }
  );
  const oct = wireMesh(new THREE.OctahedronGeometry(44, 0), 0xe8c547, 0.085, new THREE.Vector3(-52, 72, -28));
  const dodec = wireMesh(new THREE.DodecahedronGeometry(40, 0), 0xa78bfa, 0.075, new THREE.Vector3(128, -48, -24));
  const box = wireMesh(
    new THREE.BoxGeometry(62, 62, 62),
    0x5eead4,
    0.055,
    new THREE.Vector3(-128, 52, -58),
    { x: 0.35, y: 0.65, z: 0.2 }
  );
  const knot = wireMesh(new THREE.TorusKnotGeometry(38, 9, 96, 12), 0x7dd3c0, 0.06, new THREE.Vector3(95, -65, 10));

  const particlesCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const posArray = new Float32Array(particlesCount * 3);
  const baseY = new Float32Array(particlesCount);
  const colorArray = new Float32Array(particlesCount * 3);
  const colorCyan = new THREE.Color('#5eead4');
  const colorPurple = new THREE.Color('#a78bfa');

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    posArray[i3] = (Math.random() - 0.5) * 600;
    const y0 = (Math.random() - 0.5) * 600;
    posArray[i3 + 1] = y0;
    baseY[i] = y0;
    posArray[i3 + 2] = (Math.random() - 0.5) * 400;
    const mixedColor = colorCyan.clone().lerp(colorPurple, Math.random());
    colorArray[i3] = mixedColor.r;
    colorArray[i3 + 1] = mixedColor.g;
    colorArray[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  const material = new THREE.PointsMaterial({
    size: 1.65,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });

  const particlesMesh = new THREE.Points(geometry, material);
  scene.add(particlesMesh);

  let mouseX = 0;
  let mouseY = 0;
  document.addEventListener(
    'mousemove',
    (e) => {
      mouseX = e.clientX - window.innerWidth * 0.5;
      mouseY = e.clientY - window.innerHeight * 0.5;
    },
    { passive: true }
  );

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    const targetX = mouseX * 0.001;
    const targetY = mouseY * 0.001;

    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
    particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

    const positions = geometry.attributes.position.array;
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const z = positions[i3 + 2];
      positions[i3 + 1] = baseY[i] + Math.sin(elapsedTime * 0.45 + x * 0.01 + z * 0.01) * 3.2;
    }
    geometry.attributes.position.needsUpdate = true;

    torus.rotation.x += 0.0006;
    torus.rotation.y += 0.0011;
    ico.rotation.x += 0.0009;
    ico.rotation.y += 0.0007;
    ring.rotation.z += 0.0005;
    oct.rotation.y += 0.0012;
    oct.rotation.x += 0.00045;
    dodec.rotation.y -= 0.00085;
    box.rotation.x += 0.00038;
    box.rotation.y += 0.00052;
    knot.rotation.x += 0.00055;
    knot.rotation.y += 0.0009;

    renderer.render(scene, camera);
  }
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 120);
  });
})();

// gsap animations - handles the preloader and scroll reveals
(function initGSAP() {
  if (typeof gsap === 'undefined') return;

  const strokes = document.querySelectorAll('.kanji-stroke');
  const strokeLengths = Array.from(strokes).map(stroke => {
    const length = stroke.getTotalLength();
    stroke.style.strokeDasharray = length;
    stroke.style.strokeDashoffset = length;
    return length;
  });

  // preloader counts from 0 to 100% then slides away
  const masterTimeline = gsap.timeline();
  if (typeof lenis !== 'undefined') lenis.stop();

  const preloaderStr = document.getElementById('preloader-counter');
  const counterObj = { val: 0 };

  masterTimeline.to(counterObj, {
    val: 100,
    duration: 2.2,
    ease: 'power1.inOut',
    onUpdate: () => {
      const val = Math.round(counterObj.val);
      if (preloaderStr) preloaderStr.textContent = val.toString().padStart(2, '0') + '%';
      
      const numStrokes = strokes.length;
      const step = 100 / numStrokes;
      
      strokes.forEach((stroke, i) => {
        const length = strokeLengths[i];
        const startPct = i * step;
        const endPct = (i + 1) * step;
        
        if (counterObj.val <= startPct) {
          stroke.style.strokeDashoffset = length;
        } else if (counterObj.val >= endPct) {
          stroke.style.strokeDashoffset = 0;
        } else {
          const pct = (counterObj.val - startPct) / step;
          stroke.style.strokeDashoffset = length * (1 - pct);
        }
      });
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

  // hero section - each element fades in one by one
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

  // fade in each project card as the user scrolls to it
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

  // fade in the about section text
  gsap.fromTo('.about-text', 
    { opacity: 0, y: 40 }, 
    { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: '.about-grid', start: 'top 80%' } });

  gsap.fromTo('.skill-group h4', 
    { opacity: 0, x: -20 }, 
    { opacity: 1, x: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: '.about-grid', start: 'top 70%' } });

  // fade in the contact cards
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

// custom cursor that follows the mouse
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let trailX = 0, trailY = 0;

if (cursor && window.innerWidth > 768) {
  window.addEventListener('pointermove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    const target = e.target;
    // make the cursor bigger when hovering over clickable things
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

// add a blur effect to the nav bar when the user scrolls down
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
});

// hamburger menu for mobile screens
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

// dark/light theme toggle button
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

// smooth scroll when clicking links like #work or #about
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

// update the 01/06 counter in the bottom left of the hero
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

// extra visual effects below

// 1. title tilts slightly based on where the mouse is
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

// 2. images tilt slightly when scrolling fast
const projectCards = document.querySelectorAll('.project-card');
if (typeof lenis !== 'undefined') {
  lenis.on('scroll', (e) => {
    const velocity = e.velocity || 0;
    // keep skew between -5 and 5 degrees
    const skew = Math.min(Math.max(velocity, -5), 5);
    
    // only skew the image, not the whole card
    projectCards.forEach(card => {
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

// 3. text scramble effect - letters shuffle before revealing
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

// 4. buttons get pulled slightly towards the mouse (magnetic effect)
const magneticBtns = document.querySelectorAll('.roll-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // how strong the pull is
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

// 5. hovering a project card makes the image tilt in 3d and repels the card
projectCards.forEach(card => {
    const imgWrap = card.querySelector('.card-img-wrap');
    if(!imgWrap) return;
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Anti-Gravity Repulsion calculations
        const dx = centerX - e.clientX;
        const dy = centerY - e.clientY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const maxRepel = 15;
        const repelForce = (1 - Math.min(dist / 300, 1)) * maxRepel;
        const repelX = (dx / dist) * repelForce;
        const repelY = (dy / dist) * repelForce - 8;

        const posX = (e.clientX - centerX) / (rect.width / 2);
        const posY = (e.clientY - centerY) / (rect.height / 2);
        
        const tiltX = posY * -15; // tilt up/down
        const tiltY = posX * 15;  // tilt left/right

        // move/lift the card and add a glow
        gsap.to(card, {
             x: repelX,
             y: repelY,
             boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,195,0.15)',
             borderColor: 'rgba(0,255,195,0.4)',
             duration: 0.4,
             ease: 'power2.out'
        });
        
        // also tilt the image inside
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
             x: 0,
             y: 0,
             boxShadow: 'none',
             borderColor: 'var(--glass-border)',
             duration: 0.8,
             ease: 'elastic.out(1, 0.4)'
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

// more visual effects below

// 1. spotlight that follows the mouse in the about section
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

// 2. ripple effect when you click anywhere on the page
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

// 3. tiny floating particles drifting upwards when scrolled past hero
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

// 4. the thin vertical line on the side that shows scroll progress
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

// 5. Dynamic Now Playing / Status Ticker
(function initNowPlaying() {
  const textEl = document.getElementById('statusText');
  if (!textEl) return;
  fetch('now-playing.json')
    .then(res => {
      if (!res.ok) throw new Error('Not ok');
      return res.json();
    })
    .then(data => {
      if (data && data.status) {
        textEl.textContent = data.status;
      }
    })
    .catch(err => {
      console.warn("Could not load now-playing.json, using fallback status", err);
      textEl.textContent = "Currently learning: Advanced DSA in C++ · PyTorch basics · GLSL shader maps";
    });
})();

// 6. Stats Counter & Live GitHub API Fetch
(function initStats() {
  const projectsEl = document.getElementById('stat-projects');
  const commitsEl = document.getElementById('stat-commits');
  const hoursEl = document.getElementById('stat-hours');
  if (!projectsEl || !commitsEl || !hoursEl) return;

  let projectsCount = 14;
  let commitsCount = 312;

  const startDate = new Date('2025-07-01');
  const now = new Date();
  const diffDays = (now - startDate) / (1000 * 60 * 60 * 24);
  const hoursCount = Math.max(100, Math.floor(diffDays * 4.2));

  gsap.fromTo([projectsEl, commitsEl, hoursEl], 
    { textContent: 0 },
    {
      textContent: (i, target) => {
        if (target.id === 'stat-projects') return projectsCount;
        if (target.id === 'stat-commits') return commitsCount;
        return hoursCount;
      },
      duration: 2.2,
      ease: 'power2.out',
      snap: { textContent: 1 },
      scrollTrigger: {
        trigger: '.stats-row',
        start: 'top 85%',
        once: true
      }
    }
  );

  fetch('https://api.github.com/users/Alppoint')
    .then(res => res.json())
    .then(data => {
      if (data && data.public_repos) {
        projectsCount = Math.max(projectsCount, data.public_repos);
        projectsEl.textContent = projectsCount;
      }
    })
    .catch(err => console.warn("Failed to fetch public repos count", err));

  fetch('https://api.github.com/users/Alppoint/events')
    .then(res => res.json())
    .then(events => {
      let pushCommits = 0;
      if (Array.isArray(events)) {
        events.forEach(ev => {
          if (ev.type === 'PushEvent' && ev.payload && ev.payload.commits) {
            pushCommits += ev.payload.commits.length;
          }
        });
      }
      commitsCount = 280 + pushCommits;
      commitsEl.textContent = commitsCount;
    })
    .catch(err => console.warn("Failed to fetch commit events", err));
})();

// 7. GitHub Heatmap Grid Generator
(function initGithubHeatmap() {
  const grid = document.getElementById('github-heatmap-grid');
  if (!grid) return;

  const totalDays = 168; // 24 weeks * 7 days
  const now = new Date();
  
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - totalDays + 1);

  const activityData = {};

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dateStr = formatDate(d);
    
    let hash = 0;
    for (let c = 0; c < dateStr.length; c++) {
      hash = dateStr.charCodeAt(c) + ((hash << 5) - hash);
    }
    const rand = Math.abs(hash) % 10;
    let level = 0;
    if (rand === 4 || rand === 5) level = 1;
    else if (rand === 6 || rand === 7) level = 2;
    else if (rand === 8) level = 3;
    else if (rand === 9) level = 4;
    
    activityData[dateStr] = {
      count: level > 0 ? level * 2 : 0,
      level: level,
      date: d
    };
  }

  fetch('https://api.github.com/users/Alppoint/events')
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(events => {
      if (Array.isArray(events) && events.length > 0) {
        const eventsDays = 90;
        const resetStart = new Date(now);
        resetStart.setDate(now.getDate() - eventsDays);
        for (let i = 0; i < totalDays; i++) {
          const d = new Date(startDate);
          d.setDate(startDate.getDate() + i);
          if (d >= resetStart) {
            const dateStr = formatDate(d);
            activityData[dateStr] = { count: 0, level: 0, date: d };
          }
        }

        events.forEach(event => {
          if (!event.created_at) return;
          const dateStr = event.created_at.substring(0, 10);
          if (activityData[dateStr]) {
            let contributionCount = 1;
            if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
              contributionCount = event.payload.commits.length;
            }
            activityData[dateStr].count += contributionCount;
          }
        });

        for (const dateStr in activityData) {
          const count = activityData[dateStr].count;
          let level = 0;
          if (count > 0 && count <= 2) level = 1;
          else if (count > 2 && count <= 4) level = 2;
          else if (count > 4 && count <= 6) level = 3;
          else if (count > 6) level = 4;
          
          const d = activityData[dateStr].date;
          if (d >= resetStart) {
            activityData[dateStr].level = level;
          }
        }
      }
      renderHeatmap();
    })
    .catch(err => {
      console.warn("Could not load live GitHub events for heatmap, using fallback pattern.", err);
      renderHeatmap();
    });

  function renderHeatmap() {
    grid.innerHTML = '';
    
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const dateStr = formatDate(d);
      
      const dayData = activityData[dateStr];
      const cell = document.createElement('div');
      cell.className = `heatmap-cell level-${dayData.level}`;
      
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      const formattedDate = dayData.date.toLocaleDateString('en-US', options);
      const tooltipText = `${dayData.count} contribution${dayData.count === 1 ? '' : 's'} on ${formattedDate}`;
      cell.setAttribute('data-tooltip', tooltipText);
      
      grid.appendChild(cell);
    }
  }
})();

// 8. BCA Semester Timeline Details Loader
(function initSemesterTimeline() {
  const detailsBox = document.getElementById('sem-details-box');
  const tabs = document.querySelectorAll('.sem-tab');
  if (!detailsBox || tabs.length === 0) return;

  const semesterData = {
    1: {
      title: "Semester 1 – Computer Foundations",
      status: "Completed · GPA: 9.2/10",
      desc: "Mastered base computer architectures, structural logic flow in procedural C programming, and calculus methods for logic representations. Turned theory into terminal console apps.",
      skills: ["C Programming", "Computer Fundamentals", "Mathematical Calculus", "Technical Communication"],
      highlight: "Completed C quiz console app and full laboratory assignments repository."
    },
    2: {
      title: "Semester 2 – Data Structures & Web Architectures",
      status: "In Progress (Current Focus)",
      desc: "Deep diving into complex memory addressing, recursion, data structures (stacks, queues, linked lists, trees) in C++, modern front-end styling structures, and statistical distributions.",
      skills: ["DSA in C++", "Web Technologies", "Probability & Statistics", "Digital Electronics"],
      highlight: "Building modular responsive web tools (Gym Vault WebGL, Expense Tracker, Notes app)."
    },
    3: {
      title: "Semester 3 – Relational Databases & Automation",
      status: "Upcoming",
      desc: "Preparing for structural SQL schemas, transaction flows, computational mathematical modeling, and Python scripting pipelines for AI development.",
      skills: ["Relational DBMS & SQL", "Python Programming", "Computer Architecture", "Discrete Mathematics"],
      highlight: "Pre-learning database engines connections and scripting automated scripts."
    },
    4: {
      title: "Semester 4 – Operating Systems & System Logic",
      status: "Planned",
      desc: "Focusing on process schedulers, kernel interfaces, virtual memory allocation, numerical logic approximations, and structural object programming frameworks.",
      skills: ["Operating Systems", "Java Programming", "Software Engineering", "Numerical Methods"],
      highlight: "Multi-threaded process simulation models in Java."
    },
    5: {
      title: "Semester 5 – Machine Learning & Cloud Architectures",
      status: "Planned",
      desc: "Specializing in vector statistics, neuron layers, classifier training, and building scalable cloud-native microservice gateways.",
      skills: ["Machine Learning Basics", "Computer Networks", "Mobile Apps (Android/iOS)", "Cloud Infrastructure"],
      highlight: "Developing custom neural classifier pipelines with PyTorch and deploying API services."
    },
    6: {
      title: "Semester 6 – AI Systems & BCA Capstone Project",
      status: "Planned",
      desc: "Compiling full system modules, API connections, and intelligent neural interfaces to release a production-grade BCA capstone web product.",
      skills: ["Artificial Intelligence", "Information Security", "Capstone Project", "Software Testing"],
      highlight: "Full-scale agentic AI assistant integrated into creative web apps."
    }
  };

  const showSemester = (semNum) => {
    const data = semesterData[semNum];
    if (!data) return;

    gsap.to(detailsBox, {
      opacity: 0,
      y: 10,
      duration: 0.25,
      onComplete: () => {
        let skillsHtml = '';
        data.skills.forEach(skill => {
          skillsHtml += `<span class="pill">${skill}</span>`;
        });

        detailsBox.innerHTML = `
          <div class="sem-detail-header">
            <div class="sem-detail-title">${data.title}</div>
            <div class="sem-detail-status">${data.status}</div>
          </div>
          <p class="sem-detail-desc">${data.desc}</p>
          <div class="sem-detail-skills">${skillsHtml}</div>
          <div class="sem-detail-highlight"><strong>Key Focus:</strong> ${data.highlight}</div>
        `;

        gsap.to(detailsBox, {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: 'power2.out'
        });
      }
    });
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const sem = tab.getAttribute('data-sem');
      
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      showSemester(sem);
    });
  });

  showSemester(2);
})();

// 9. Project Case Study Overlay Modal
(function initCaseStudies() {
  const overlay = document.getElementById('caseStudyOverlay');
  const content = document.getElementById('caseStudyContent');
  const closeBtn = document.getElementById('caseStudyClose');
  const cards = document.querySelectorAll('.project-card');

  if (!overlay || !content || !closeBtn || cards.length === 0) return;

  const caseStudyData = {
    "01": {
      title: "Study Tracker",
      eyebrow: "Productivity Tool",
      timeline: "July 2025 · 2 Weeks",
      role: "Solo Developer",
      tech: "HTML5 · CSS3 · Vanilla JavaScript · LocalStorage",
      demo: "https://alppoint.github.io/study-tracker/",
      source: "https://github.com/Alppoint/study-tracker",
      image: "study-tracker.png",
      problem: "Entering BCA, I realized my study hours were highly inconsistent. I had no structured logs, no daily progress updates, and no feedback on how time was allocated across various programming and mathematics courses.",
      process: "I designed and implemented an offline-first dashboard using vanilla Javascript. I focused on building structured inputs to record individual study sessions, calculating and updating daily target completions in real-time, and persisting records securely in the user's browser localStorage. I also added a simple consecutive daily streak tracker to gamify study consistency and keep motivation high.",
      result: "A highly responsive, clean client-side utility that operates completely without server dependencies or databases. It successfully resolved my time-tracking needs, resulting in a persistent study history with zero loading latency."
    },
    "02": {
      title: "JS & Web Lab",
      eyebrow: "Coursework Sandbox",
      timeline: "August 2025 · 3 Weeks",
      role: "Student Developer",
      tech: "HTML5 · Bootstrap 5 · JavaScript · Git",
      demo: "https://alppoint.github.io/js-web-lab/",
      source: "https://github.com/Alppoint/js-web-lab",
      image: "js-web-lab2.png",
      problem: "College-assigned web exercises are typically compiled as basic files with outdated, uninspired styles. I wanted to organize my BCA laboratory projects into a single, cohesive, modern workspace that looked clean and felt responsive.",
      process: "I took basic lab assignments—such as form validation logic, arrays manipulation, string processing, and simple event binding—and created a structural Bootstrap-based testing lab. I structured it as a unified portal, documenting individual code requirements and adding live playground elements to execute the scripts directly in the browser.",
      result: "High marks on class assignments and a reusable documentation setup. It showcases my ability to turn basic tasks into professional, well-documented user interfaces."
    },
    "03": {
      title: "C Lab Programs",
      eyebrow: "System Programming Foundations",
      timeline: "October 2025 · 4 Weeks",
      role: "Solo Developer",
      tech: "C Language · GCC Compiler · GNU Make · GitHub",
      demo: null,
      source: "https://github.com/Alppoint/-c-lab-programs",
      image: "c-lab-programs.png",
      problem: "First-year C programming lab exercises are usually written and compiled in isolation. I wanted to develop a centralized repo with structured build scripts and thorough input validation logs to master low-level programming constraints.",
      process: "I systematically solved coursework problems covering pointer arithmetic, file I/O operations, complex structure allocations, and multi-dimensional matrices. I set up GCC compiler commands and organized the folders under strict directory conventions. I also focused heavily on writing custom helper modules in C to clean up user terminal input buffering and handle stack bounds safely.",
      result: "Mastery of primary C programming principles (memory layout, file streams, pointers). The repository acts as a reliable baseline reference for structured logic."
    },
    "04": {
      title: "C Quiz Console App",
      eyebrow: "Interactive Terminal Game",
      timeline: "November 2025 · 1 Week",
      role: "Solo Developer",
      tech: "C Language · Console I/O · Modular Functions",
      demo: null,
      source: null,
      image: null,
      problem: "Traditional terminal-based quizzes compiled during coursework lack player engagement, clear feedback loops, or structured state control.",
      process: "I built a quiz engine completely in standard C. I mapped categories of questions into array structures, coded state tracking routines to record points and progress, and modularized the logic into separate utility files. Special attention was paid to cleansing input streams to prevent infinite recursion bugs when users typed letters instead of numbers.",
      result: "A lightweight terminal application that compiles instantly on any standard GCC platform, running efficiently without external graphic dependencies."
    },
    "05": {
      title: "Portfolio v1",
      eyebrow: "Creative Development Showcase",
      timeline: "December 2025 · 4 Weeks",
      role: "Creative Developer",
      tech: "HTML5 · CSS3 · GSAP · Lenis · Three.js",
      demo: null,
      source: "https://github.com/Alppoint/ActivePortfolioMain",
      image: null,
      problem: "Standard web portfolios are static, rigid, and fail to reflect the dynamic nature of interactive theories or high-performance motion design.",
      process: "I conceptualized a cinematic dark portfolio matching premium active-theory styles. I integrated a Three.js wireframe particle canvas for the hero background, GSAP scroll-triggered animations, and a Lenis smooth scroll container. I also added multiple subtle details: a mouse spotlight mask, a dust canvas drift, and magnetic magnetic button spring states.",
      result: "An immersive creative portfolio that is fluid, responsive, and performs at a stable 60fps, providing a perfect experimental sandbox that evolves as I learn."
    },
    "06": {
      title: "Expense Tracker",
      eyebrow: "Financial Management Dashboard",
      timeline: "January 2026 · 3 Weeks",
      role: "Solo Developer",
      tech: "HTML5 · CSS3 · Canvas 2D · JavaScript · LocalStorage",
      demo: "expense-tracker/index.html",
      source: "https://github.com/Alppoint/ActivePortfolioMain/tree/main/expense-tracker",
      image: "expense-tracker.png.png",
      problem: "Commercial budgeting trackers are overloaded with features, require cloud accounts, and often sell user metadata, creating privacy concerns.",
      process: "I built a zero-dependency web interface. I implemented a custom HTML5 Canvas 2D rendering loop to draw clean category donut charts, mapped sorting routines to filter categories on the fly, and structured local CRUD utilities. The dashboard keeps details securely saved locally in the browser.",
      result: "A private, zero-latency financial tracking workspace that runs completely local, loading instantly while giving clear visual spending metrics."
    },
    "07": {
      title: "Notes App",
      eyebrow: "Themes Productivity Tool",
      timeline: "February 2026 · 2 Weeks",
      role: "Solo Developer",
      tech: "HTML5 · CSS3 · JavaScript · LocalStorage",
      demo: "notes-app/index.html",
      source: "https://github.com/Alppoint/ActivePortfolioMain/tree/main/notes-app",
      image: "notes-app.png.png",
      problem: "Text editors are often bogged down by menus or locked into a single aesthetic, disrupting quick writing states.",
      process: "I created an offline-first notes sandbox. I coded 5 dynamic visual layouts (Classic Dark, Retro Matrix, Synthwave Neon, Light Paper, Sepia), bound real-time auto-saving routines, and calculated continuous word counts. The application relies on state handlers to keep pinned notes structured at the top of the collection.",
      result: "A clean, responsive text manager that caches drafts instantly on keystrokes and provides visual styles matching various creative preferences."
    },
    "08": {
      title: "Vault — Gym & Macro Lab",
      eyebrow: "Interactive WebGL Workspace",
      timeline: "March 2026 · 4 Weeks",
      role: "Full Stack Developer",
      tech: "Three.js (WebGL) · LocalStorage · CSS Grid · Macro Database",
      demo: "gym-app/index.html",
      source: "https://github.com/Alppoint/ActivePortfolioMain/tree/main/gym-app",
      image: "gym-app.png",
      problem: "Workout and nutrition applications fail to connect anatomical exercises to macro intake databases in a single offline-friendly interface.",
      process: "I combined WebGL graphics with fitness datasets. I loaded an anatomical human mesh using Three.js and bound mesh raycasting so users can click specific muscles to filter corresponding training workouts. I also designed a custom Indian/International food macro query database and a weekly plan scheduler saved locally.",
      result: "A premium, cinematic physical fitness command dashboard that serves as a highly functional client-side app, loading in seconds."
    }
  };

  const openCaseStudy = (index) => {
    const data = caseStudyData[index];
    if (!data) return;

    let imageHtml = '';
    if (data.image) {
      imageHtml = `
        <div class="cs-img-wrap">
          <img src="${data.image}" alt="${data.title}" />
        </div>
      `;
    }

    let linksHtml = '';
    if (data.demo) {
      linksHtml += `<a href="${data.demo}" target="_blank" class="card-link">Live Demo →</a>`;
    }
    if (data.source) {
      linksHtml += `<a href="${data.source}" target="_blank" class="card-link ghost">Source Code ↗</a>`;
    }

    content.innerHTML = `
      <header class="cs-header">
        <span class="cs-eyebrow">${data.eyebrow}</span>
        <h2 class="cs-title">${data.title}</h2>
        <div class="cs-meta-grid">
          <div class="cs-meta-item">
            <h5>Timeline</h5>
            <p>${data.timeline}</p>
          </div>
          <div class="cs-meta-item">
            <h5>Role</h5>
            <p>${data.role}</p>
          </div>
          <div class="cs-meta-item">
            <h5>Tech Stack</h5>
            <p>${data.tech}</p>
          </div>
          <div class="cs-meta-item">
            <h5>Links</h5>
            <p>${linksHtml || 'Project files offline'}</p>
          </div>
        </div>
      </header>

      ${imageHtml}

      <div class="cs-sections-grid">
        <section class="cs-section">
          <div class="cs-sec-left">
            <h4>Problem</h4>
          </div>
          <div class="cs-sec-right">
            <p>${data.problem}</p>
          </div>
        </section>

        <section class="cs-section">
          <div class="cs-sec-left">
            <h4>Process</h4>
          </div>
          <div class="cs-sec-right">
            <p>${data.process}</p>
          </div>
        </section>

        <section class="cs-section">
          <div class="cs-sec-left">
            <h4>Result</h4>
          </div>
          <div class="cs-sec-right">
            <p>${data.result}</p>
          </div>
        </section>
      </div>
    `;

    overlay.classList.add('open');
    if (typeof lenis !== 'undefined') lenis.stop();
    document.body.classList.add('lenis-stopped');
    
    gsap.fromTo(content, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
  };

  const closeCaseStudy = () => {
    overlay.classList.remove('open');
    if (typeof lenis !== 'undefined') lenis.start();
    document.body.classList.remove('lenis-stopped');
  };

  cards.forEach(card => {
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      const index = card.getAttribute('data-index');
      if (index) {
        openCaseStudy(index);
      }
    });
  });

  closeBtn.addEventListener('click', closeCaseStudy);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeCaseStudy();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeCaseStudy();
    }
  });

  window.openCaseStudyIndex = openCaseStudy;
  window.closeCaseStudy = closeCaseStudy;
  window.isCaseStudyOpen = () => overlay.classList.contains('open');
})();

// 10. Keyboard Navigation (J/K to scroll between cards, Enter to open)
(function initKeyboardNav() {
  const cards = document.querySelectorAll('.project-card');
  if (cards.length === 0) return;

  let activeIndex = -1;

  const setActiveCard = (index) => {
    cards.forEach(card => card.classList.remove('keyboard-focused'));
    
    if (index >= 0 && index < cards.length) {
      activeIndex = index;
      const targetCard = cards[activeIndex];
      targetCard.classList.add('keyboard-focused');
      
      if (typeof lenis !== 'undefined') {
        lenis.scrollTo(targetCard, { offset: -window.innerHeight / 2 + targetCard.offsetHeight / 2 });
      } else {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
      return;
    }

    if (window.isTerminalOpen && window.isTerminalOpen()) {
      return;
    }

    const isModalOpen = window.isCaseStudyOpen && window.isCaseStudyOpen();
    if (isModalOpen) {
      return;
    }

    const key = e.key.toLowerCase();
    
    if (key === 'j' || e.key === 'ArrowDown') {
      e.preventDefault();
      let nextIndex = activeIndex + 1;
      if (nextIndex >= cards.length) nextIndex = 0;
      setActiveCard(nextIndex);
    } else if (key === 'k' || e.key === 'ArrowUp') {
      e.preventDefault();
      let prevIndex = activeIndex - 1;
      if (prevIndex < 0) prevIndex = cards.length - 1;
      setActiveCard(prevIndex);
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < cards.length) {
        e.preventDefault();
        const indexStr = cards[activeIndex].getAttribute('data-index');
        if (indexStr && window.openCaseStudyIndex) {
          window.openCaseStudyIndex(indexStr);
        }
      }
    }
  });

  cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('keyboard-focused'));
      activeIndex = index;
    });
  });
})();
