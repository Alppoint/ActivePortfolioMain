/**
 * ==========================================
 * 3D BACKGROUND (Three.js)
 * ==========================================
 * This file handles the "God-Tier" cinematic background.
 * It uses the Three.js library to render 3D shapes and particles on an HTML canvas.
 */

(function initThreeJS() {
    // 1. Get the canvas element from index.html
    const canvas = document.getElementById('heroCanvas');
    
    // If there is no canvas or the Three.js library didn't load, stop right here to prevent errors.
    if (!canvas || typeof THREE === 'undefined') return;
  
    // 2. Create the Scene (The "world" where all 3D objects live)
    const scene = new THREE.Scene();
    
    // Add Fog to the scene. This makes objects further away fade out, giving a sense of depth.
    scene.fog = new THREE.FogExp2(0x06060a, 0.00165);
  
    // 3. Create the Camera (The "eyes" that look at the 3D world)
    // 75 is the Field of View (FOV). 0.1 and 1000 are the near and far clipping planes (what's visible).
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200; // Move the camera back so we can see the objects
  
    // 4. Create the Renderer (The engine that draws the 3D scene onto the 2D canvas)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true, // Allows the CSS background of the webpage to show through
      antialias: true, // Smooths out jagged edges
      powerPreference: 'high-performance', // Tells the browser to use the dedicated GPU if available
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Keeps things sharp on Retina screens
  
    // 5. Setup Materials (How objects look)
    // We create a shared settings object for our glowing wireframe shapes
    const wireShared = {
      wireframe: true,       // Only draw the edges, not the solid faces
      transparent: true,     // Allow them to be see-through
      blending: THREE.AdditiveBlending, // Makes overlapping shapes glow brighter (like neon lights)
      depthWrite: false,     // Fixes weird clipping issues with transparency
    };
  
    // Helper function to quickly create 3D shapes
    function wireMesh(geom, hex, opacity, pos, rot) {
      // MeshBasicMaterial doesn't need light to be seen
      const mat = new THREE.MeshBasicMaterial({ color: hex, opacity: opacity, ...wireShared });
      const mesh = new THREE.Mesh(geom, mat); // Combine shape (geometry) and look (material)
      mesh.position.copy(pos); // Move it to its starting position
      if (rot) mesh.rotation.set(rot.x || 0, rot.y || 0, rot.z || 0);
      scene.add(mesh); // Add it to our world
      return mesh;
    }
  
    // 6. Create the 3D Floating Shapes (Primitives)
    const torus = wireMesh(new THREE.TorusGeometry(120, 4, 12, 64), 0x5eead4, 0.12, new THREE.Vector3(80, 40, -40));
    const ico = wireMesh(new THREE.IcosahedronGeometry(55, 1), 0x5eead4, 0.1, new THREE.Vector3(-100, -30, 20));
    const ring = wireMesh(
      new THREE.TorusGeometry(90, 2, 8, 48),
      0xa78bfa, 0.09,
      new THREE.Vector3(40, 90, -80),
      { x: Math.PI / 2.2 } // Rotate it slightly
    );
    const oct = wireMesh(new THREE.OctahedronGeometry(44, 0), 0xe8c547, 0.085, new THREE.Vector3(-52, 72, -28));
    const dodec = wireMesh(new THREE.DodecahedronGeometry(40, 0), 0xa78bfa, 0.075, new THREE.Vector3(128, -48, -24));
    const box = wireMesh(
      new THREE.BoxGeometry(62, 62, 62),
      0x5eead4, 0.055,
      new THREE.Vector3(-128, 52, -58),
      { x: 0.35, y: 0.65, z: 0.2 }
    );
    const knot = wireMesh(new THREE.TorusKnotGeometry(38, 9, 96, 12), 0x7dd3c0, 0.06, new THREE.Vector3(95, -65, 10));
  
    // 7. Create the Particle Cloud (Stars)
    const particlesCount = 2000;
    const geometry = new THREE.BufferGeometry(); // High performance way to handle lots of points
    
    // Arrays to store X, Y, Z coordinates and RGB colors for every single particle
    const posArray = new Float32Array(particlesCount * 3);
    const baseY = new Float32Array(particlesCount); // Store original Y so we can make them "bob" up and down
    const colorArray = new Float32Array(particlesCount * 3);
    
    // Our theme colors
    const colorCyan = new THREE.Color('#5eead4');
    const colorPurple = new THREE.Color('#a78bfa');
  
    // Randomly place each particle in a 3D box
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3; // Every particle takes up 3 slots in the array (X, Y, Z)
      posArray[i3] = (Math.random() - 0.5) * 600;     // X
      const y0 = (Math.random() - 0.5) * 600;         // Y
      posArray[i3 + 1] = y0;
      baseY[i] = y0;                                  // Remember original Y
      posArray[i3 + 2] = (Math.random() - 0.5) * 400; // Z
      
      // Give each particle a color randomly blended between cyan and purple
      const mixedColor = colorCyan.clone().lerp(colorPurple, Math.random());
      colorArray[i3] = mixedColor.r;
      colorArray[i3 + 1] = mixedColor.g;
      colorArray[i3 + 2] = mixedColor.b;
    }
  
    // Attach our math arrays to the 3D geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  
    // Create the material for the points
    const material = new THREE.PointsMaterial({
      size: 1.65, // Size of each star
      vertexColors: true, // Use the colors we generated above
      blending: THREE.AdditiveBlending, // Make them glow
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });
  
    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
  
    // 8. Track Mouse Movement for Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        // Calculate mouse offset from the exact center of the screen
        mouseX = e.clientX - window.innerWidth * 0.5;
        mouseY = e.clientY - window.innerHeight * 0.5;
    }, { passive: true }); // passive makes scrolling smoother on some browsers
  
    // 9. The Animation Loop (Runs 60 times a second)
    const clock = new THREE.Clock(); // Keeps track of time passing
  
    function animate() {
      requestAnimationFrame(animate); // Tell the browser "call animate() again next frame"
      const elapsedTime = clock.getElapsedTime();
      
      // Calculate target rotation based on mouse position
      const targetX = mouseX * 0.001;
      const targetY = mouseY * 0.001;
  
      // Slowly rotate the entire particle cloud automatically
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      
      // Also gently pull the cloud towards where the mouse is (Lerp / Easing)
      particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
      particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);
  
      // Make particles "breathe" (bob up and down using a sine wave)
      const positions = geometry.attributes.position.array;
      for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const z = positions[i3 + 2];
        // Math.sin creates a smooth up-and-down wave based on time and position
        positions[i3 + 1] = baseY[i] + Math.sin(elapsedTime * 0.45 + x * 0.01 + z * 0.01) * 3.2;
      }
      geometry.attributes.position.needsUpdate = true; // Tell Three.js we changed the array
  
      // Slowly spin all the 3D shapes independently
      torus.rotation.x += 0.0006;   torus.rotation.y += 0.0011;
      ico.rotation.x += 0.0009;     ico.rotation.y += 0.0007;
      ring.rotation.z += 0.0005;
      oct.rotation.y += 0.0012;     oct.rotation.x += 0.00045;
      dodec.rotation.y -= 0.00085;
      box.rotation.x += 0.00038;    box.rotation.y += 0.00052;
      knot.rotation.x += 0.00055;   knot.rotation.y += 0.0009;
  
      // Actually draw the frame to the screen
      renderer.render(scene, camera);
    }
    
    // Start the loop!
    animate();
  
    // 10. Handle Window Resizing so the canvas never gets squished
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer); // Debounce: only run the code AFTER they stop resizing
      resizeTimer = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix(); // Fix the camera lens
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }, 120);
    });
})();
