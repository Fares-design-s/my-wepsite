/* =============================================
   PORTFOLIO SCRIPT - Three.js Enhanced
   ============================================= */

// ===== 1. THREE.JS BACKGROUND PARTICLES =====
(function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // Create particles
  const COUNT = 1800;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

    // Color mix: purple to cyan
    const t = Math.random();
    colors[i * 3]     = 0.48 + t * (0.02 - 0.48); // R
    colors[i * 3 + 1] = 0.23 + t * (0.71 - 0.23); // G
    colors[i * 3 + 2] = 0.93 + t * (0.83 - 0.93); // B

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // Mouse interaction
  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation
  function animate() {
    requestAnimationFrame(animate);
    points.rotation.y += 0.0003;
    points.rotation.x += 0.0001;

    // Subtle mouse parallax
    camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();


// ===== 2. THREE.JS PROFILE RING =====
(function initProfileRing() {
  const canvas = document.getElementById('ring-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(220, 220);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 3.5;

  // Torus ring
  const geo = new THREE.TorusGeometry(1.1, 0.04, 16, 120);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xa78bfa,
    transparent: true,
    opacity: 0.9
  });
  const ring = new THREE.Mesh(geo, mat);
  scene.add(ring);

  // Outer glow ring
  const geo2 = new THREE.TorusGeometry(1.15, 0.015, 8, 100);
  const mat2 = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.4
  });
  const ring2 = new THREE.Mesh(geo2, mat2);
  scene.add(ring2);

  // Orbit dots
  const dotGeo = new THREE.SphereGeometry(0.06, 8, 8);
  const dots = [];
  const dotCount = 6;
  for (let i = 0; i < dotCount; i++) {
    const dotMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0xa78bfa : 0x06b6d4,
      transparent: true,
      opacity: 0.9
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dots.push({ mesh: dot, angle: (i / dotCount) * Math.PI * 2 });
    scene.add(dot);
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;
    ring.rotation.z = t * 0.4;
    ring.rotation.x = Math.sin(t * 0.3) * 0.3;
    ring2.rotation.z = -t * 0.3;
    ring2.rotation.y = Math.cos(t * 0.2) * 0.2;

    dots.forEach((d, i) => {
      d.angle += 0.012;
      d.mesh.position.x = Math.cos(d.angle) * 1.1;
      d.mesh.position.y = Math.sin(d.angle) * 1.1;
      d.mesh.position.z = Math.sin(d.angle * 2) * 0.2;
    });

    renderer.render(scene, camera);
  }
  animate();
})();


// ===== 3. NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  links.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active-link');
  });
});


// ===== 4. TYPING EFFECT =====
(function initTyping() {
  const el = document.getElementById('hero-tagline');
  const texts = [
    'أحول أفكارك لفيديوهات تأسر المشاهدين',
    'Editing That Tells Your Story',
    'Motion | Color | Emotion'
  ];
  let t = 0, c = 0, deleting = false;

  function type() {
    const current = texts[t];
    if (!deleting) {
      el.textContent = current.slice(0, c + 1);
      c++;
      if (c === current.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      el.textContent = current.slice(0, c - 1);
      c--;
      if (c === 0) { deleting = false; t = (t + 1) % texts.length; }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  type();
})();


// ===== 5. COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}


// ===== 6. INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Skill bars
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.classList.add('animated');
      });

      // Counters (only on hero entering view)
      if (entry.target.id === 'hero') animateCounters();
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section-fade, #hero').forEach(el => observer.observe(el));
// Trigger hero counters on load
setTimeout(animateCounters, 800);


// ===== 7. 3D TILT EFFECT ON CARDS =====
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -10;
      const rotY = ((x - cx) / cx) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
})();


// ===== 8. VIDEO MODAL =====
function openVideo(id) {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('modal-iframe');
  iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  modal.classList.add('active');
}

function closeVideo() {
  document.getElementById('video-modal').classList.remove('active');
  document.getElementById('modal-iframe').src = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeVideo();
});