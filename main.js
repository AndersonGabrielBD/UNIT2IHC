if (window.VLibras) new window.VLibras.Widget('https://vlibras.gov.br/app');

/* ── Smooth scroll ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = prefersReducedMotion
  ? null
  : new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });

if (lenis) {
  function rafLoop(time) { lenis.raf(time); requestAnimationFrame(rafLoop); }
  requestAnimationFrame(rafLoop);
}

gsap.registerPlugin(ScrollTrigger);
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

/* ── Scroll progress ── */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.width = `${pct * 100}%`;
}, { passive: true });

/* ── Custom cursor ── */
const cursor = document.getElementById('cursor');
let cursorVisible = false;
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
  if (!cursorVisible) { cursor.classList.add('visible'); cursorVisible = true; }
});
document.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
document.querySelectorAll('a, button, .planet-card, .orbit-planet, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

/* ── Three.js hero ── */
const canvas = document.getElementById('solar-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const sunLight = new THREE.PointLight(0xf0c040, 2, 100);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

const starCount = 2000;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 220;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true, opacity: 0.65 }));
scene.add(stars);

const sunGeo = new THREE.SphereGeometry(0.55, 32, 32);
const sunMat = new THREE.MeshStandardMaterial({ color: 0xf0c040, emissive: 0xf07020, emissiveIntensity: 1.2, roughness: 0.8 });
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.position.set(-3.2, 0.3, -3);
scene.add(sun);
const glowMesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({ color: 0xf07020, transparent: true, opacity: 0.13 }));
sun.add(glowMesh);

const planets3D = [
  { size: 0.08, color: 0x888888, emissive: 0x222222, dist: 1.3, speed: 0.8, yOff: -0.2 },
  { size: 0.14, color: 0xe8c87a, emissive: 0x553300, dist: 1.9, speed: 0.5, yOff: 0.15 },
  { size: 0.15, color: 0x4a9eff, emissive: 0x003366, dist: 2.5, speed: 0.35, yOff: -0.1 },
  { size: 0.10, color: 0xc1440e, emissive: 0x440000, dist: 3.2, speed: 0.25, yOff: 0.2 },
];
const planetMeshes = planets3D.map((p) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.size, 24, 24),
    new THREE.MeshStandardMaterial({ color: p.color, emissive: p.emissive, emissiveIntensity: 0.3, roughness: 0.7 })
  );
  mesh.userData = { dist: p.dist, speed: p.speed, angle: Math.random() * Math.PI * 2, yOff: p.yOff };
  scene.add(mesh);
  return mesh;
});

let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
});

const clock = new THREE.Clock();
(function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  sun.rotation.y = t * 0.1;
  glowMesh.material.opacity = 0.1 + Math.sin(t * 2) * 0.04;
  planetMeshes.forEach((m) => {
    m.userData.angle += m.userData.speed * 0.005;
    const a = m.userData.angle;
    m.position.x = sun.position.x + Math.cos(a) * m.userData.dist * 0.6;
    m.position.z = sun.position.z + Math.sin(a) * m.userData.dist * 0.4;
    m.position.y = m.userData.yOff + Math.sin(t * 0.3 + a) * 0.05;
    m.rotation.y += 0.01;
  });
  stars.rotation.y = t * 0.005;
  camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.03;
  camera.position.y += (mouse.y * 0.15 - camera.position.y) * 0.03;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
})();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ── Animated counters ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const isDecimal = el.hasAttribute('data-decimal');
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = target * eased;
    el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target.toLocaleString('pt-BR');
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
      entry.target.classList.add('counted');
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

/* ── Orrery ── */
const orreryPlanets = [
  { key: 'mercury', name: 'Mercúrio', size: 8,  color: '#aaa',    glow: 'rgba(170,170,170,0.6)', orbit: 80,  period: 5,   delay: -1   },
  { key: 'venus',   name: 'Vênus',    size: 14, color: '#e8c87a', glow: 'rgba(232,200,122,0.6)', orbit: 112, period: 12,  delay: -4   },
  { key: 'earth',   name: 'Terra',    size: 15, color: '#4a9eff', glow: 'rgba(74,158,255,0.6)',  orbit: 150, period: 20,  delay: -7   },
  { key: 'mars',    name: 'Marte',    size: 10, color: '#c1440e', glow: 'rgba(193,68,14,0.6)',   orbit: 190, period: 34,  delay: -11  },
  { key: 'jupiter', name: 'Júpiter',  size: 28, color: '#c88b3a', glow: 'rgba(200,139,58,0.6)',  orbit: 242, period: 70,  delay: -22  },
  { key: 'saturn',  name: 'Saturno',  size: 23, color: '#e4d191', glow: 'rgba(228,209,145,0.6)', orbit: 283, period: 130, delay: -45, ring: true },
  { key: 'uranus',  name: 'Urano',    size: 19, color: '#7de8e8', glow: 'rgba(125,232,232,0.6)', orbit: 318, period: 250, delay: -90  },
  { key: 'neptune', name: 'Netuno',   size: 18, color: '#3f54ba', glow: 'rgba(63,84,186,0.6)',   orbit: 348, period: 420, delay: -160 },
];

function buildOrrery() {
  const container = document.getElementById('orreryContainer');
  const legend    = document.getElementById('orreryLegend');
  if (!container) return;

  container.innerHTML = `
    <div class="orrery-sun" aria-hidden="true">
      <div class="sun-pulse"></div>
      <div class="sun-core"></div>
    </div>`;
  if (legend) legend.innerHTML = '';

  orreryPlanets.forEach(p => {
    const ring = document.createElement('div');
    ring.className = 'orbit-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.style.cssText = `width:${p.orbit*2}px;height:${p.orbit*2}px;margin-left:${-p.orbit}px;margin-top:${-p.orbit}px`;
    container.appendChild(ring);

    const arm = document.createElement('div');
    arm.className = 'orbit-arm';
    arm.setAttribute('aria-hidden', 'true');
    arm.style.cssText = `height:${p.orbit}px;animation-duration:${p.period}s;animation-delay:${p.delay}s`;

    const dot = document.createElement('button');
    dot.className = 'orbit-planet';
    dot.dataset.planet = p.key;
    dot.setAttribute('aria-label', `${p.name} — clique para explorar`);
    dot.style.cssText = `width:${p.size}px;height:${p.size}px;background:${p.color};box-shadow:0 0 ${p.size*2}px ${p.glow}`;

    if (p.ring) {
      const sr = document.createElement('span');
      sr.className = 'saturn-orrery-ring';
      sr.setAttribute('aria-hidden', 'true');
      dot.appendChild(sr);
    }

    dot.addEventListener('click', () => openModal(p.key));
    dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(p.key); } });
    arm.appendChild(dot);
    container.appendChild(arm);

    if (legend) {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.innerHTML = `<span class="legend-dot" style="background:${p.color}"></span><span>${p.name}</span>`;
      legend.appendChild(item);
    }
  });
}
buildOrrery();

/* ── Card visibility (IntersectionObserver) ── */
const cards = document.querySelectorAll('.planet-card');
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) setTimeout(() => entry.target.classList.add('visible'), i * 70);
  });
}, { threshold: 0.08 });
cards.forEach(c => cardObserver.observe(c));

/* ── Card 3D tilt ── */
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    card.style.transform = `perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0)';
    setTimeout(() => { card.style.transform = ''; }, 420);
  });
});

/* ── Planet filter ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.type === filter;
      if (match) {
        card.style.display = '';
        requestAnimationFrame(() => card.classList.add('visible'));
      } else {
        card.classList.remove('visible');
        card.style.transform = '';
        setTimeout(() => { card.style.display = 'none'; }, 420);
      }
    });
  });
});

/* ── Planet data ── */
const planetData = {
  mercury: {
    name: 'Mercúrio', type: 'Planeta Rochoso',
    desc: 'O menor e mais rápido planeta do sistema solar. Sem atmosfera, as temperaturas variam drasticamente entre o dia e a noite.',
    color: 'radial-gradient(circle at 35% 35%, #d4d4d4, #888, #555)',
    shadow: 'rgba(100,100,100,0.4)',
    stats: [['Distância do Sol','57,9 milhões km'],['Diâmetro','4.879 km'],['Temperatura','-180°C a 430°C'],['Período orbital','88 dias'],['Luas','0']],
    funFacts: ['Mercúrio é menor que Ganimedes (lua de Júpiter) e Titã (lua de Saturno).','Um dia em Mercúrio dura 59 dias terrestres, mas um ano dura apenas 88 dias.','Possui crateras com gelo permanente nos polos, onde a luz solar nunca chega.'],
  },
  venus: {
    name: 'Vênus', type: 'Planeta Rochoso',
    desc: 'O planeta mais quente do sistema solar. Sua atmosfera densa de CO₂ cria um efeito estufa extremo, mantendo temperaturas acima de 460°C.',
    color: 'radial-gradient(circle at 35% 35%, #f5e6a3, #e8c87a, #c49a45)',
    shadow: 'rgba(232,200,122,0.4)',
    stats: [['Distância do Sol','108,2 milhões km'],['Diâmetro','12.104 km'],['Temperatura','462°C (média)'],['Período orbital','225 dias'],['Luas','0']],
    funFacts: ['Um dia em Vênus (243 dias terrestres) é mais longo que um ano em Vênus (225 dias).','Vênus gira no sentido contrário à maioria dos planetas — o Sol nasce a oeste.','A pressão atmosférica na superfície é 92 vezes maior que a da Terra.'],
  },
  earth: {
    name: 'Terra', type: 'Nosso Lar ✦',
    desc: 'O único planeta conhecido a abrigar vida. Com oceanos líquidos, atmosfera respirável e uma biodiversidade extraordinária, é verdadeiramente único.',
    color: 'radial-gradient(circle at 35% 35%, #6bb8f0, #4a9eff, #1a5fa0)',
    shadow: 'rgba(74,158,255,0.4)',
    stats: [['Distância do Sol','149,6 milhões km'],['Diâmetro','12.742 km'],['Temperatura','-88°C a 58°C'],['Período orbital','365,25 dias'],['Luas','1 (Lua)']],
    funFacts: ['A Lua é o único corpo celeste além da Terra onde humanos já pisaram.','A Terra tem o maior vulcão do sistema solar... espera, esse é Marte. Mas tem os únicos oceanos líquidos!','O campo magnético da Terra nos protege da radiação solar, tornando a vida possível.'],
  },
  mars: {
    name: 'Marte', type: 'Planeta Rochoso',
    desc: 'O planeta vermelho. Tem o maior vulcão do sistema solar (Olympus Mons, 22 km de altura) e o maior cânyon (Valles Marineris).',
    color: 'radial-gradient(circle at 35% 35%, #e8836a, #c1440e, #8a2a00)',
    shadow: 'rgba(193,68,14,0.4)',
    stats: [['Distância do Sol','227,9 milhões km'],['Diâmetro','6.779 km'],['Temperatura','-125°C a 20°C'],['Período orbital','687 dias'],['Luas','2 (Fobos e Deimos)']],
    funFacts: ['Olympus Mons tem quase 3x a altura do Everest e é o maior vulcão do sistema solar.','Valles Marineris se estende por 4.000 km — quase a largura dos EUA.','Um dia em Marte dura 24h e 37min, muito similar ao da Terra.'],
  },
  jupiter: {
    name: 'Júpiter', type: 'Gigante Gasoso',
    desc: 'O maior planeta do sistema solar — tão grande que cabe 1.300 Terras dentro dele. A Grande Mancha Vermelha é uma tempestade ativa há mais de 350 anos.',
    color: 'radial-gradient(circle at 35% 35%, #e4c07a, #c88b3a, #9a6520)',
    shadow: 'rgba(200,139,58,0.4)',
    stats: [['Distância do Sol','778,5 milhões km'],['Diâmetro','139.820 km'],['Temperatura','-110°C (topo)'],['Período orbital','11,9 anos'],['Luas','95 conhecidas']],
    funFacts: ['Júpiter tem uma massa 2,5 vezes maior que todos os outros planetas combinados.','A Grande Mancha Vermelha é uma tempestade que dura há mais de 350 anos.','Júpiter protege a Terra de asteroides, atraindo-os com sua enorme gravidade.'],
  },
  saturn: {
    name: 'Saturno', type: 'Gigante Gasoso',
    desc: 'Famoso pelos seus magníficos anéis compostos de gelo e rocha. É tão leve que flutuaria na água, com densidade de apenas 0,69 g/cm³.',
    color: 'radial-gradient(circle at 35% 35%, #f0e6a8, #e4d191, #b8a050)',
    shadow: 'rgba(228,209,145,0.4)',
    stats: [['Distância do Sol','1,43 bilhão km'],['Diâmetro','116.460 km'],['Temperatura','-140°C'],['Período orbital','29,5 anos'],['Luas','146 conhecidas']],
    funFacts: ['Os anéis de Saturno têm 270.000 km de extensão mas apenas 1 km de espessura.','Saturno tem a maior coleção de luas do sistema solar: 146 confirmadas.','A densidade de Saturno é tão baixa que flutuaria em água.'],
  },
  uranus: {
    name: 'Urano', type: 'Gigante de Gelo',
    desc: 'O planeta que gira de lado — sua inclinação axial é de 98°. Seus ventos podem atingir 900 km/h e seus anéis são quase verticais.',
    color: 'radial-gradient(circle at 35% 35%, #a8f0f0, #7de8e8, #40b8c0)',
    shadow: 'rgba(125,232,232,0.4)',
    stats: [['Distância do Sol','2,87 bilhões km'],['Diâmetro','50.724 km'],['Temperatura','-195°C'],['Período orbital','84 anos'],['Luas','28 conhecidas']],
    funFacts: ['Urano "rola" em torno do Sol devido à sua inclinação axial de 98°.','Um polo de Urano fica sem luz solar por 42 anos de uma vez.','Urano foi o primeiro planeta descoberto com telescópio, em 1781.'],
  },
  neptune: {
    name: 'Netuno', type: 'Gigante de Gelo',
    desc: 'O planeta mais distante e ventoso. Seus ventos chegam a 2.100 km/h. Leva 165 anos terrestres para completar uma órbita ao redor do Sol.',
    color: 'radial-gradient(circle at 35% 35%, #6070e8, #3f54ba, #1a2880)',
    shadow: 'rgba(63,84,186,0.4)',
    stats: [['Distância do Sol','4,50 bilhões km'],['Diâmetro','49.244 km'],['Temperatura','-200°C'],['Período orbital','165 anos'],['Luas','16 conhecidas']],
    funFacts: ['Os ventos de Netuno são os mais rápidos do sistema solar: até 2.100 km/h.','Netuno só completou uma órbita completa desde sua descoberta em 1846.','Netuno foi descoberto matematicamente antes de ser observado, previsto por cálculos de Newton.'],
  },
};

/* ── Modal ── */
const modal        = document.getElementById('planet-modal');
const modalClose   = document.getElementById('modalClose');
const modalBackdrop= document.getElementById('modalBackdrop');
const modalName    = document.getElementById('modal-planet-name');
const modalType    = document.getElementById('modalType');
const modalDesc    = document.getElementById('modalDesc');
const modalStats   = document.getElementById('modalStats');
const modalVisual  = document.getElementById('modalVisual');
const modalFun     = document.getElementById('modalFun');
const tabBtns      = document.querySelectorAll('.tab-btn');
let lastFocused    = null;

function openModal(key) {
  const data = planetData[key];
  if (!data) return;
  lastFocused = document.activeElement;

  modalName.textContent = data.name;
  modalType.textContent = data.type;
  modalDesc.textContent = data.desc;
  modalVisual.style.background  = data.color;
  modalVisual.style.boxShadow   = `0 16px 40px ${data.shadow}`;

  modalStats.innerHTML = data.stats.map(([l, v]) => `<li><span>${l}</span><strong>${v}</strong></li>`).join('');
  modalFun.innerHTML   = data.funFacts.map(f =>
    `<div class="fun-fact-item"><span class="fun-fact-icon" aria-hidden="true">✦</span><p>${f}</p></div>`
  ).join('');

  tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  tabBtns[0].classList.add('active'); tabBtns[0].setAttribute('aria-selected', 'true');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
  document.getElementById('tab-stats').classList.remove('hidden');

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

cards.forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.planet));
  card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.planet); } });
});
modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

modal.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const focusable = modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
    e.preventDefault(); (e.shiftKey ? last : first).focus();
  }
});

/* ── Modal tabs ── */
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById(`tab-${btn.dataset.tab}`).classList.remove('hidden');
  });
});

/* ── High contrast ── */
const contrastToggle = document.getElementById('contrastToggle');
if (localStorage.getItem('cosmoria-contrast') === 'high') {
  document.body.classList.add('high-contrast');
  contrastToggle.setAttribute('aria-pressed', 'true');
}
contrastToggle.addEventListener('click', () => {
  const on = document.body.classList.toggle('high-contrast');
  contrastToggle.setAttribute('aria-pressed', String(on));
  localStorage.setItem('cosmoria-contrast', on ? 'high' : 'normal');
});

/* ── GSAP scroll animations ── */
gsap.from('.stat-item', { scrollTrigger: { trigger: '.stats-section', start: 'top 85%' }, y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
gsap.from('.orrery-container', { scrollTrigger: { trigger: '.orrery-section', start: 'top 80%' }, scale: 0.85, opacity: 0, duration: 1.1, ease: 'power3.out' });
gsap.from('.section-header', { scrollTrigger: { trigger: '.planets-section', start: 'top 80%' }, y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
gsap.from('.mission-card', { scrollTrigger: { trigger: '.missions-section', start: 'top 80%' }, y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
gsap.from('.explore-inner h2', { scrollTrigger: { trigger: '.explore-section', start: 'top 80%' }, y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
gsap.from('.scale-viz', { scrollTrigger: { trigger: '.scale-viz', start: 'top 85%' }, y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' });
gsap.from('.hero-scroll-hint', { scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }, opacity: 0, y: -20 });

/* ── Ticker duplicate ── */
const ticker = document.getElementById('tickerTrack');
if (ticker) ticker.parentElement.appendChild(ticker.cloneNode(true));
