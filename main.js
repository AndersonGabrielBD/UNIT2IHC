new window.VLibras.Widget('https://vlibras.gov.br/app');

const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  smooth: true,
});

function rafLoop(time) {
  lenis.raf(time);
  requestAnimationFrame(rafLoop);
}
requestAnimationFrame(rafLoop);

gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const canvas = document.getElementById('solar-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xf0c040, 2, 100);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const starCount = 1500;
const starGeo = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPositions[i] = (Math.random() - 0.5) * 200;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.7 });
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

const sunGeo = new THREE.SphereGeometry(0.8, 32, 32);
const sunMat = new THREE.MeshStandardMaterial({
  color: 0xf0c040,
  emissive: 0xf07020,
  emissiveIntensity: 1.2,
  roughness: 0.8,
});
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.position.set(-2.5, 0.5, -2);
scene.add(sun);

const sunGlowGeo = new THREE.SphereGeometry(1.1, 32, 32);
const sunGlowMat = new THREE.MeshBasicMaterial({ color: 0xf07020, transparent: true, opacity: 0.15 });
const sunGlow = new THREE.Mesh(sunGlowGeo, sunGlowMat);
sun.add(sunGlow);

const planets3D = [
  { size: 0.12, color: 0x888888, emissive: 0x222222, dist: 2.0, speed: 0.8, yOff: -0.3 },
  { size: 0.22, color: 0xe8c87a, emissive: 0x553300, dist: 2.8, speed: 0.5, yOff: 0.2 },
  { size: 0.24, color: 0x4a9eff, emissive: 0x003366, dist: 3.7, speed: 0.35, yOff: -0.1 },
  { size: 0.16, color: 0xc1440e, emissive: 0x440000, dist: 4.6, speed: 0.25, yOff: 0.3 },
];

const planetMeshes = planets3D.map((p) => {
  const geo = new THREE.SphereGeometry(p.size, 24, 24);
  const mat = new THREE.MeshStandardMaterial({ color: p.color, emissive: p.emissive, emissiveIntensity: 0.3, roughness: 0.7 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData = { dist: p.dist, speed: p.speed, angle: Math.random() * Math.PI * 2, yOff: p.yOff };
  scene.add(mesh);
  return mesh;
});

let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
});

let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();

  sun.rotation.y = elapsed * 0.1;
  sunGlow.material.opacity = 0.1 + Math.sin(elapsed * 2) * 0.05;

  planetMeshes.forEach((mesh) => {
    mesh.userData.angle += mesh.userData.speed * 0.005;
    const a = mesh.userData.angle;
    mesh.position.x = sun.position.x + Math.cos(a) * mesh.userData.dist * 0.6;
    mesh.position.z = sun.position.z + Math.sin(a) * mesh.userData.dist * 0.4;
    mesh.position.y = mesh.userData.yOff + Math.sin(elapsed * 0.3 + a) * 0.05;
    mesh.rotation.y += 0.01;
  });

  stars.rotation.y = elapsed * 0.005;

  camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.03;
  camera.position.y += (mouse.y * 0.15 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const cards = document.querySelectorAll('.planet-card');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
    }
  });
}, { threshold: 0.1 });

cards.forEach((card) => observer.observe(card));

const planetData = {
  mercury: {
    name: 'Mercúrio',
    type: 'Planeta Rochoso',
    desc: 'O menor e mais rápido planeta do sistema solar. Sem atmosfera, as temperaturas variam drasticamente entre o dia e a noite.',
    color: 'radial-gradient(circle at 35% 35%, #d4d4d4, #888, #555)',
    shadow: 'rgba(100,100,100,0.4)',
    stats: [
      ['Distância do Sol', '57,9 milhões km'],
      ['Diâmetro', '4.879 km'],
      ['Temperatura', '-180°C a 430°C'],
      ['Período orbital', '88 dias'],
      ['Luas', '0'],
    ],
  },
  venus: {
    name: 'Vênus',
    type: 'Planeta Rochoso',
    desc: 'O planeta mais quente do sistema solar. Sua atmosfera densa de CO₂ cria um efeito estufa extremo, mantendo temperaturas acima de 460°C.',
    color: 'radial-gradient(circle at 35% 35%, #f5e6a3, #e8c87a, #c49a45)',
    shadow: 'rgba(232,200,122,0.4)',
    stats: [
      ['Distância do Sol', '108,2 milhões km'],
      ['Diâmetro', '12.104 km'],
      ['Temperatura', '462°C (média)'],
      ['Período orbital', '225 dias'],
      ['Luas', '0'],
    ],
  },
  earth: {
    name: 'Terra',
    type: 'Nosso Lar ✦',
    desc: 'O único planeta conhecido a abrigar vida. Com oceanos líquidos, atmosfera respirável e uma biodiversidade extraordinária, é verdadeiramente único.',
    color: 'radial-gradient(circle at 35% 35%, #6bb8f0, #4a9eff, #1a5fa0)',
    shadow: 'rgba(74,158,255,0.4)',
    stats: [
      ['Distância do Sol', '149,6 milhões km'],
      ['Diâmetro', '12.742 km'],
      ['Temperatura', '-88°C a 58°C'],
      ['Período orbital', '365,25 dias'],
      ['Luas', '1 (Lua)'],
    ],
  },
  mars: {
    name: 'Marte',
    type: 'Planeta Rochoso',
    desc: 'O planeta vermelho. Tem o maior vulcão do sistema solar (Olympus Mons, 22km de altura) e o maior cânyon (Valles Marineris).',
    color: 'radial-gradient(circle at 35% 35%, #e8836a, #c1440e, #8a2a00)',
    shadow: 'rgba(193,68,14,0.4)',
    stats: [
      ['Distância do Sol', '227,9 milhões km'],
      ['Diâmetro', '6.779 km'],
      ['Temperatura', '-125°C a 20°C'],
      ['Período orbital', '687 dias'],
      ['Luas', '2 (Fobos e Deimos)'],
    ],
  },
  jupiter: {
    name: 'Júpiter',
    type: 'Gigante Gasoso',
    desc: 'O maior planeta do sistema solar — tão grande que cabe 1.300 Terras dentro dele. A Grande Mancha Vermelha é uma tempestade ativa há mais de 350 anos.',
    color: 'radial-gradient(circle at 35% 35%, #e4c07a, #c88b3a, #9a6520)',
    shadow: 'rgba(200,139,58,0.4)',
    stats: [
      ['Distância do Sol', '778,5 milhões km'],
      ['Diâmetro', '139.820 km'],
      ['Temperatura', '-110°C (topo)'],
      ['Período orbital', '11,9 anos'],
      ['Luas', '95 conhecidas'],
    ],
  },
  saturn: {
    name: 'Saturno',
    type: 'Gigante Gasoso',
    desc: 'Famoso pelos seus magníficos anéis compostos de gelo e rocha. É tão leve que flutuaria na água, com densidade de apenas 0,69 g/cm³.',
    color: 'radial-gradient(circle at 35% 35%, #f0e6a8, #e4d191, #b8a050)',
    shadow: 'rgba(228,209,145,0.4)',
    stats: [
      ['Distância do Sol', '1,43 bilhão km'],
      ['Diâmetro', '116.460 km'],
      ['Temperatura', '-140°C'],
      ['Período orbital', '29,5 anos'],
      ['Luas', '146 conhecidas'],
    ],
  },
  uranus: {
    name: 'Urano',
    type: 'Gigante de Gelo',
    desc: 'O planeta que gira de lado — sua inclinação axial é de 98°. Seus ventos podem atingir 900 km/h e seus anéis são quase verticais.',
    color: 'radial-gradient(circle at 35% 35%, #a8f0f0, #7de8e8, #40b8c0)',
    shadow: 'rgba(125,232,232,0.4)',
    stats: [
      ['Distância do Sol', '2,87 bilhões km'],
      ['Diâmetro', '50.724 km'],
      ['Temperatura', '-195°C'],
      ['Período orbital', '84 anos'],
      ['Luas', '28 conhecidas'],
    ],
  },
  neptune: {
    name: 'Netuno',
    type: 'Gigante de Gelo',
    desc: 'O planeta mais distante e ventoso. Seus ventos chegam a 2.100 km/h. Leva 165 anos terrestres para completar uma órbita ao redor do Sol.',
    color: 'radial-gradient(circle at 35% 35%, #6070e8, #3f54ba, #1a2880)',
    shadow: 'rgba(63,84,186,0.4)',
    stats: [
      ['Distância do Sol', '4,50 bilhões km'],
      ['Diâmetro', '49.244 km'],
      ['Temperatura', '-200°C'],
      ['Período orbital', '165 anos'],
      ['Luas', '16 conhecidas'],
    ],
  },
};

const modal = document.getElementById('planet-modal');
const modalClose = document.getElementById('modalClose');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalName = document.getElementById('modal-planet-name');
const modalType = document.getElementById('modalType');
const modalDesc = document.getElementById('modalDesc');
const modalStats = document.getElementById('modalStats');
const modalVisual = document.getElementById('modalVisual');

let lastFocused = null;

function openModal(planetKey) {
  const data = planetData[planetKey];
  if (!data) return;

  lastFocused = document.activeElement;

  modalName.textContent = data.name;
  modalType.textContent = data.type;
  modalDesc.textContent = data.desc;
  modalVisual.style.background = data.color;
  modalVisual.style.boxShadow = `0 16px 40px ${data.shadow}`;

  modalStats.innerHTML = data.stats.map(([label, val]) =>
    `<li><span>${label}</span><strong>${val}</strong></li>`
  ).join('');

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  setTimeout(() => modalClose.focus(), 100);
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

cards.forEach((card) => {
  card.addEventListener('click', () => openModal(card.dataset.planet));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.planet);
    }
  });
});

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) {
    closeModal();
  }
});

modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab') return;
  const focusable = modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
    e.preventDefault();
    (e.shiftKey ? last : first).focus();
  }
});

const contrastToggle = document.getElementById('contrastToggle');
const savedContrast = localStorage.getItem('cosmoria-contrast');

if (savedContrast === 'high') {
  document.body.classList.add('high-contrast');
  contrastToggle.setAttribute('aria-pressed', 'true');
}

contrastToggle.addEventListener('click', () => {
  const isHigh = document.body.classList.toggle('high-contrast');
  contrastToggle.setAttribute('aria-pressed', String(isHigh));
  localStorage.setItem('cosmoria-contrast', isHigh ? 'high' : 'normal');
});

gsap.from('.hero-scroll-hint', {
  scrollTrigger: {
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
  opacity: 0,
  y: -20,
});

gsap.from('.section-header', {
  scrollTrigger: {
    trigger: '.planets-section',
    start: 'top 80%',
  },
  y: 40,
  opacity: 0,
  duration: 0.9,
  ease: 'power3.out',
});

gsap.from('.explore-inner h2', {
  scrollTrigger: {
    trigger: '.explore-section',
    start: 'top 80%',
  },
  y: 40,
  opacity: 0,
  duration: 0.9,
  ease: 'power3.out',
});

gsap.from('.scale-viz', {
  scrollTrigger: {
    trigger: '.scale-viz',
    start: 'top 85%',
  },
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
});

const ticker = document.getElementById('tickerTrack');
if (ticker) {
  const clone = ticker.cloneNode(true);
  ticker.parentElement.appendChild(clone);
}