// ==================== DATOS DEL JUEGO ====================
const ALFAJORES_DATA = {
  negro: {
    id: 'negro', nombre: 'Guaymallen Negro', costo: 0, clickValue: 1, aps: 0.1, emoji: '🍫',
    catchphrase: 'Relleno de dulce de leche y baño de chocolate',
    mordiscos: 5,
    images: {
      envuelto1: 'images/negro/A_negro_envuelto2.png',
      envuelto2: 'images/negro/A_negro_envuelto1.png',
      completo:  'images/negro/A_negro_completo.png',
      mordisco1: 'images/negro/A_negro_mordisco1.png',
      mordisco2: 'images/negro/A_negro_mordisco2.png',
      mordisco3: 'images/negro/A_negro_mordisco3.png',
      mordisco4: 'images/negro/A_negro_mordisco4.png',
      mordisco5: 'images/negro/A_negro_mordisco5.png'
    },
    unlocked: true
  },
  blanco: {
    id: 'blanco', nombre: 'Guaymallen Blanco', costo: 500, clickValue: 2, aps: 0.5, emoji: 'O',
    catchphrase: 'Relleno de dulce de leche y baño de repostería blanco',
    mordiscos: 4,
    images: {
      envuelto1: 'images/blanco/envuelto1.png',
      envuelto2: 'images/blanco/envuelto2.png',
      completo:  'images/blanco/completo.png',
      mordisco1: 'images/blanco/mordisco1.png',
      mordisco2: 'images/blanco/mordisco2.png',
      mordisco3: 'images/blanco/mordisco3.png',
      mordisco4: 'images/blanco/mordisco4.png'
    },
    unlocked: false
  },
  caviar: {
    id: 'caviar', nombre: 'Guaymallen de Membrillo', costo: 3000, clickValue: 5, aps: 1.5, emoji: '🍊',
    mordiscos: 4,
    catchphrase: '¡¡¡¡CAVIAAAAAAR!!!!',
    images: {
      envuelto1: 'images/caviar/envuelto1.png',
      envuelto2: 'images/caviar/envuelto2.png',
      completo:  'images/caviar/completo.png',
      mordisco1: 'images/caviar/mordisco1.png',
      mordisco2: 'images/caviar/mordisco2.png',
      mordisco3: 'images/caviar/mordisco3.png',
      mordisco4: 'images/caviar/mordisco4.png'
    },
    unlocked: false
  }
};

const EDIFICIOS_DATA = {
  kiosquero:  { id: 'kiosquero',  nombre: 'Cafetería',            desc: 'Un alfajor y un café, la mejor merienda/desayuno', precioBase: 15,     aps: 0.1,   emoji: '🏪' },
  panaderia:  { id: 'panaderia',  nombre: 'Panaderia',           desc: 'Pan y alfajores, combo ideal',                     precioBase: 100,    aps: 0.5,   emoji: '🥖' },
  maquina:    { id: 'maquina',    nombre: 'Maquina DDL',         desc: '¡Dulce de leche sin parar!',                       precioBase: 500,    aps: 2.0,   emoji: 'O' },
  linea:      { id: 'linea',      nombre: 'Linea de chocolate',  desc: 'El bañado perfecto',                               precioBase: 2000,   aps: 8.0,   emoji: '🍫' },
  camion:     { id: 'camion',     nombre: 'Camioncito',          desc: 'Reparte por todo el pais',                  precioBase: 8000,   aps: 25.0,  emoji: '🚚' },
  fabrica:    { id: 'fabrica',    nombre: 'Fabrica',             desc: 'La fabrica de Mataderos',                   precioBase: 30000,  aps: 80.0,  emoji: '🏭' },
  exportadora:{ id: 'exportadora',nombre: 'Exportadora',         desc: 'Alfajores al mundo',                        precioBase: 150000, aps: 300.0, emoji: 'A' },
  fabrica2:   { id: 'fabrica2',   nombre: 'Planta Nacional',     desc: 'Segunda planta maxima produccion',          precioBase: 500000, aps: 800.0, emoji: '🏗️' }
};

const MEJORAS_BASE = [
  { id: 'click_x2',  nombre: 'Clic hambriento',   desc: 'Cada clic vale el doble',      costo: 200,    tipo: 'click', multiplicador: 2,  comprado: false, requiere: { totalAlfajores: 50     } },
  { id: 'click_x4',  nombre: 'Furia alfajorera',   desc: 'Cada clic vale 4 veces mas',   costo: 5000,   tipo: 'click', multiplicador: 4,  comprado: false, requiere: { totalAlfajores: 2000   } },
  { id: 'click_x8',  nombre: 'Clic bestia',        desc: 'Cada clic vale 8 veces mas',   costo: 50000,  tipo: 'click', multiplicador: 8,  comprado: false, requiere: { totalAlfajores: 20000  } },
  { id: 'click_x16', nombre: 'Modo dios alfajor',  desc: 'Cada clic vale 16 veces mas',  costo: 500000, tipo: 'click', multiplicador: 16, comprado: false, requiere: { totalAlfajores: 200000 } }
];

function generarMejorasEdificios() {
  const mejoras = [];
  Object.values(EDIFICIOS_DATA).forEach(edif => {
    [
      { suffix: '_x2', mult: 2, cantReq: 1,  costMult: 10  },
      { suffix: '_x4', mult: 4, cantReq: 5,  costMult: 50  },
      { suffix: '_x8', mult: 8, cantReq: 25, costMult: 250 }
    ].forEach(tier => {
      mejoras.push({
        id: edif.id + tier.suffix,
        nombre: edif.nombre + ' +' + (tier.mult * 100 - 100) + '%',
        desc: edif.nombre + ' produce ' + tier.mult + 'x mas',
        costo: Math.floor(edif.precioBase * tier.costMult),
        tipo: 'edificio', target: edif.id, multiplicador: tier.mult,
        comprado: false,
        requiere: { edificio: edif.id, cantidad: tier.cantReq }
      });
    });
  });
  return mejoras;
}

let MEJORAS_DATA = [...MEJORAS_BASE, ...generarMejorasEdificios()];

let gameState = {
  alfajores: 0, totalAlfajores: 0, aps: 0,
  clickMultiplier: 1,
  currentAlfajor: 'negro',
  alfajorState: 'envuelto1',
  clicksOnWrapper: 0,
  clicksOnAlfajor: 0,
  alfajoresUnlocked: { negro: true, blanco: false, caviar: false },
  edificios: {}, mejoras: {},
  lastUpdate: Date.now(),
  goldenCount: 0
};

let buyAmount = 1;
let shopNeedsUpdate = false;
let isProcessingClick = false;
let goldenTimeout = null;
let goldenActive = false;
const imageCache = {};

// ==================== AUDIO ====================
let bgMusic = null;
let caviarSound = null;
let isMuted = false;
let caviarClickCount = 0;
const CAVIAR_CLICK_INTERVAL = 30;
let caviarIsPlaying = false;

function initAudio() {
  bgMusic = new Audio('Inklock Tango.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0.5;

  caviarSound = new Audio('CAVIAR_CAVIARPREMIUM.m4a');
  caviarSound.volume = 1.0;

  // Cuando termina el caviar, restauramos el volumen de la música
  caviarSound.addEventListener('ended', () => {
    caviarIsPlaying = false;
    if (bgMusic && !isMuted) {
      fadeMusicVolume(bgMusic, 0.15, 0.5, 800);
    }
  });
}

function fadeMusicVolume(audio, from, to, duration) {
  const steps = 20;
  const interval = duration / steps;
  const delta = (to - from) / steps;
  let current = from;
  audio.volume = from;
  const timer = setInterval(() => {
    current += delta;
    if ((delta > 0 && current >= to) || (delta < 0 && current <= to)) {
      audio.volume = to;
      clearInterval(timer);
    } else {
      audio.volume = Math.max(0, Math.min(1, current));
    }
  }, interval);
}

function startBgMusic() {
  if (!bgMusic) return;
  bgMusic.play().catch(() => {
    // Autoplay bloqueado: esperamos primer interaction
    document.addEventListener('pointerdown', function resumeMusic() {
      if (!isMuted) bgMusic.play().catch(() => {});
      document.removeEventListener('pointerdown', resumeMusic);
    }, { once: true });
  });
}

function playCaviarSound() {
  if (!caviarSound || isMuted) return;
  // Solo suena cada CAVIAR_CLICK_INTERVAL clicks y si no está ya sonando
  caviarClickCount++;
  if (caviarClickCount < CAVIAR_CLICK_INTERVAL || caviarIsPlaying) return;
  caviarClickCount = 0;
  caviarIsPlaying = true;
  // Baja el volumen de la música suavemente
  if (bgMusic) fadeMusicVolume(bgMusic, bgMusic.volume, 0.08, 500);
  caviarSound.play().catch(() => { caviarIsPlaying = false; });
}

function toggleMute() {
  isMuted = !isMuted;
  if (bgMusic) bgMusic.muted = isMuted;
  if (caviarSound) caviarSound.muted = isMuted;
  const btn = document.getElementById('muteBtn');
  if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
}

function preloadImages() {
  const allImages = [];
  Object.values(ALFAJORES_DATA).forEach(alf => {
    Object.values(alf.images).forEach(src => allImages.push(src));
  });
  allImages.push('images/a_negro_migajas.png');
  allImages.forEach(src => {
    const img = new Image();
    img.src = src;
    imageCache[src] = img;
  });
}

window.addEventListener('load', () => {
  preloadImages();
  initAudio();
  loadGame();
  renderShop();
  updateUI();
  startGameLoop();
  setupEventListeners();
  setupBuyButtons();
  scheduleGoldenAlfajor();

  // Pantalla de inicio
  const splashBtn = document.getElementById('splashBtn');
  const splashScreen = document.getElementById('splashScreen');
  if (splashBtn && splashScreen) {
    splashBtn.addEventListener('click', () => {
      splashScreen.classList.add('hidden');
      startBgMusic();
    });
  } else {
    startBgMusic();
  }
});

function setupBuyButtons() {
  document.querySelectorAll('.buy-amount-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      buyAmount = parseInt(btn.dataset.amount);
      document.querySelectorAll('.buy-amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEdificiosShop();
    });
  });
}

function setupEventListeners() {
  const clickEl = document.getElementById('alfajorClick');
  clickEl.addEventListener('pointerdown', handleAlfajorClick, { passive: false });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

// ==================== CLICK HANDLER ====================
function handleAlfajorClick(e) {
  e.preventDefault();
  if (isProcessingClick) return;
  isProcessingClick = true;
  requestAnimationFrame(() => { isProcessingClick = false; });

  const currentAlf = ALFAJORES_DATA[gameState.currentAlfajor];
  const maxMordiscos = currentAlf.mordiscos || 5;
  const clickX = e.clientX;
  const clickY = e.clientY;

  // Sonido caviar al cliquear el alfajor de fruta
  if (gameState.currentAlfajor === 'caviar') {
    playCaviarSound();
  }

  // Envuelto1: da puntos Y avanza estado (visual: como si quitaras un lado del wrapper)
  if (gameState.alfajorState === 'envuelto1') {
    const earned = currentAlf.clickValue * gameState.clickMultiplier;
    gameState.alfajores += earned;
    gameState.totalAlfajores += earned;
    showClickEffect(earned, clickX, clickY);
    gameState.alfajorState = 'envuelto2';
    updateAlfajorImage();
    updateUI();
    saveGame();
    shopNeedsUpdate = true;
    checkMejoras();
    return;
  }

  // Envuelto2: da puntos Y avanza a completo
  if (gameState.alfajorState === 'envuelto2') {
    const earned = currentAlf.clickValue * gameState.clickMultiplier;
    gameState.alfajores += earned;
    gameState.totalAlfajores += earned;
    showClickEffect(earned, clickX, clickY);
    gameState.alfajorState = 'completo';
    gameState.clicksOnAlfajor = 0;
    updateAlfajorImage();
    updateUI();
    saveGame();
    shopNeedsUpdate = true;
    checkMejoras();
    return;
  }

  // Completo o mordisco: da puntos y avanza mordiscos
  if (gameState.alfajorState === 'completo' || gameState.alfajorState.startsWith('mordisco')) {
    const earned = currentAlf.clickValue * gameState.clickMultiplier;
    gameState.alfajores += earned;
    gameState.totalAlfajores += earned;
    showClickEffect(earned, clickX, clickY);
    spawnMigajas(clickX, clickY);
    gameState.clicksOnAlfajor++;
    if (gameState.clicksOnAlfajor >= maxMordiscos) {
      gameState.alfajorState = 'envuelto1';
      gameState.clicksOnAlfajor = 0;
    } else {
      gameState.alfajorState = 'mordisco' + gameState.clicksOnAlfajor;
    }
    updateAlfajorImage();
    updateUI();
    saveGame();
    shopNeedsUpdate = true;
    checkMejoras();
  }
}

function updateAlfajorImage() {
  const img = document.getElementById('alfajorImg');
  const currentAlf = ALFAJORES_DATA[gameState.currentAlfajor];
  const src = currentAlf.images[gameState.alfajorState] || currentAlf.images.completo;
  if (img.getAttribute('src') !== src) {
    img.src = src;
  }
}

function showClickEffect(value, x, y) {
  const effect = document.getElementById('clickEffect');
  effect.textContent = '+' + formatNumber(value);
  effect.style.left = (x - 20) + 'px';
  effect.style.top = (y - 30) + 'px';
  effect.style.position = 'fixed';
  effect.classList.remove('active');
  void effect.offsetWidth;
  effect.classList.add('active');
}

function spawnMigajas(clickX, clickY) {
  const count = Math.floor(Math.random() * 4) + 3;
  const container = document.getElementById('migajasContainer');
  for (let i = 0; i < count; i++) {
    const migaja = document.createElement('img');
    migaja.src = 'images/a_negro_migajas.png';
    migaja.className = 'migaja';
    const spreadX = (Math.random() - 0.5) * 30;
    const spreadY = (Math.random() - 0.5) * 20;
    const velX = (Math.random() - 0.5) * 140;
    migaja.style.left = (clickX + spreadX) + 'px';
    migaja.style.top  = (clickY + spreadY) + 'px';
    migaja.style.setProperty('--velX', velX + 'px');
    container.appendChild(migaja);
    setTimeout(() => migaja.remove(), 1200);
  }
}

// ==================== ALFAJOR DORADO ====================
function scheduleGoldenAlfajor() {
  const delay = (Math.random() * 60 + 30) * 1000;
  goldenTimeout = setTimeout(showGoldenAlfajor, delay);
}

function showGoldenAlfajor() {
  if (goldenActive) return;
  goldenActive = true;

  // Aparece en el area de click del alfajor (no en la tienda)
  const clickArea = document.getElementById('alfajorClick');
  if (!clickArea) {
    goldenActive = false;
    scheduleGoldenAlfajor();
    return;
  }
  const rect = clickArea.getBoundingClientRect();

  const golden = document.createElement('div');
  golden.id = 'goldenAlfajor';
  golden.className = 'golden-alfajor';
  golden.innerHTML = 'DDL<br><span>ALFAJOR DORADO</span>';

  // Posicion aleatoria dentro del area de click
  const offsetX = Math.random() * (rect.width - 80);
  const offsetY = Math.random() * (rect.height - 80);
  golden.style.left = (rect.left + offsetX + window.scrollX) + 'px';
  golden.style.top  = (rect.top  + offsetY + window.scrollY) + 'px';
  golden.style.position = 'fixed';

  golden.addEventListener('pointerdown', claimGoldenAlfajor);
  document.getElementById('goldenContainer').appendChild(golden);

  setTimeout(() => {
    if (golden.parentNode) {
      golden.remove();
      goldenActive = false;
      scheduleGoldenAlfajor();
    }
  }, 8000);
}

function claimGoldenAlfajor() {
  const golden = document.getElementById('goldenAlfajor');
  if (!golden) return;
  golden.remove();
  goldenActive = false;
  const bonus = Math.max(Math.floor(gameState.aps * 60), 100);
  gameState.alfajores += bonus;
  gameState.totalAlfajores += bonus;
  gameState.goldenCount = (gameState.goldenCount || 0) + 1;
  updateUI();
  saveGame();
  showNotificacion('Alfajor Dorado!', '+' + formatNumber(bonus) + ' alfajores de DDL!');
  scheduleGoldenAlfajor();
}

// ==================== TIENDA ====================
function renderShop() {
  renderAlfajoresShop();
  renderEdificiosShop();
  renderMejorasShop();
}

function renderAlfajoresShop() {
  const container = document.getElementById('alfajoresShop');
  container.innerHTML = '';
  Object.values(ALFAJORES_DATA).forEach(alf => {
    const item = document.createElement('div');
    item.className = 'shop-item';
    const unlocked  = gameState.alfajoresUnlocked[alf.id];
    const canBuy    = gameState.alfajores >= alf.costo;
    const isEquipped = alf.id === gameState.currentAlfajor && unlocked;
    if (!unlocked && !canBuy) item.classList.add('locked');
    if (isEquipped) item.classList.add('equipped');
    let btnLabel = unlocked
      ? (isEquipped ? 'EQUIPADO' : 'EQUIPAR')
      : (alf.costo === 0 ? 'GRATIS' : formatNumber(alf.costo));
    item.innerHTML =
      '<div class="item-icon">' + alf.emoji + '</div>' +
      '<div class="item-info">' +
        '<div class="item-name">' + alf.nombre + '</div>' +
        '<div class="item-description">' + (alf.catchphrase || 'Alfajor clasico argentino') + '</div>' +
        '<div class="item-stats">' +
          '<span>+' + alf.clickValue + ' por clic</span>' +
          '<span>+' + alf.aps + ' APS</span>' +
        '</div>' +
      '</div>' +
      '<div class="item-right">' +
        '<div class="item-price ' + (canBuy || unlocked ? '' : 'price-locked') + '">' + btnLabel + '</div>' +
      '</div>';
    if (!unlocked && canBuy) item.addEventListener('click', () => buyAlfajor(alf.id));
    else if (unlocked && !isEquipped) item.addEventListener('click', () => equipAlfajor(alf.id));
    container.appendChild(item);
  });
}

function renderEdificiosShop() {
  const container = document.getElementById('edificiosShop');
  container.innerHTML = '';
  const sorted = Object.values(EDIFICIOS_DATA).sort((a, b) => {
    const ownedA = gameState.edificios[a.id] || 0, ownedB = gameState.edificios[b.id] || 0;
    const pA = calculateEdificioPrecioN(a.precioBase, ownedA, buyAmount);
    const pB = calculateEdificioPrecioN(b.precioBase, ownedB, buyAmount);
    const cA = gameState.alfajores >= pA, cB = gameState.alfajores >= pB;
    if (cA && !cB) return -1; if (!cA && cB) return 1;
    return pA - pB;
  });
  sorted.forEach(edif => {
    const owned  = gameState.edificios[edif.id] || 0;
    const precio = calculateEdificioPrecioN(edif.precioBase, owned, buyAmount);
    const canBuy = gameState.alfajores >= precio;
    const item   = document.createElement('div');
    item.className = 'shop-item edificio-item' + (canBuy ? '' : ' locked');
    const edifAps    = edif.aps * getEdificioMultiplier(edif.id);
    const totalContrib = edifAps * owned;
    item.innerHTML =
      '<div class="item-icon">' + edif.emoji + '</div>' +
      '<div class="item-info">' +
        '<div class="item-name">' + edif.nombre + (owned > 0 ? ' <span class="owned-badge">x' + owned + '</span>' : '') + '</div>' +
        '<div class="item-description">' + edif.desc + '</div>' +
        '<div class="item-stats">' +
          '<span>' + edifAps + ' APS/u</span>' +
          (owned > 0 ? '<span>' + formatNumber(totalContrib, 1) + ' APS total</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="item-right">' +
        '<div class="item-price ' + (canBuy ? '' : 'price-locked') + '">' + formatNumber(precio) + '</div>' +
        '<div class="buy-label">x' + buyAmount + '</div>' +
      '</div>';
    if (canBuy) item.addEventListener('click', () => buyEdificio(edif.id));
    container.appendChild(item);
  });
}

function renderMejorasShop() {
  const container = document.getElementById('mejorasShop');
  if (!container) return;
  container.innerHTML = '';
  const disponibles = MEJORAS_DATA.filter(m => !gameState.mejoras[m.id] && isMejoraVisible(m));
  const compradas   = MEJORAS_DATA.filter(m => gameState.mejoras[m.id]);
  if (disponibles.length === 0 && compradas.length === 0) {
    container.innerHTML = '<div class="no-mejoras">Compra productores para desbloquear mejoras</div>';
    return;
  }
  disponibles.forEach(m => {
    const canBuy = gameState.alfajores >= m.costo;
    const item   = document.createElement('div');
    item.className = 'mejora-item' + (canBuy ? ' can-buy' : '');
    item.innerHTML =
      '<div class="mejora-icon">UP</div>' +
      '<div class="mejora-info"><div class="mejora-name">' + m.nombre + '</div><div class="mejora-desc">' + m.desc + '</div></div>' +
      '<div class="mejora-price ' + (canBuy ? '' : 'price-locked') + '">' + formatNumber(m.costo) + '</div>';
    if (canBuy) item.addEventListener('click', () => buyMejora(m.id));
    container.appendChild(item);
  });
  if (compradas.length > 0) {
    const sep = document.createElement('div');
    sep.className = 'mejoras-sep';
    sep.textContent = 'Mejoras compradas';
    container.appendChild(sep);
    compradas.forEach(m => {
      const item = document.createElement('div');
      item.className = 'mejora-item comprada';
      item.innerHTML =
        '<div class="mejora-icon">OK</div>' +
        '<div class="mejora-info"><div class="mejora-name">' + m.nombre + '</div><div class="mejora-desc">' + m.desc + '</div></div>';
      container.appendChild(item);
    });
  }
}

function isMejoraVisible(m) {
  if (m.requiere) {
    if (m.requiere.edificio && (gameState.edificios[m.requiere.edificio] || 0) < m.requiere.cantidad) return false;
    if (m.requiere.totalAlfajores && gameState.totalAlfajores < m.requiere.totalAlfajores) return false;
  }
  return true;
}

function buyMejora(id) {
  const mejora = MEJORAS_DATA.find(m => m.id === id);
  if (!mejora || gameState.mejoras[id] || gameState.alfajores < mejora.costo) return;
  gameState.alfajores -= mejora.costo;
  gameState.mejoras[id] = true;
  if (mejora.tipo === 'click') gameState.clickMultiplier *= mejora.multiplicador;
  calculateAPS();
  renderShop();
  updateUI();
  saveGame();
  showNotificacion(mejora.nombre + ' comprada!', mejora.desc);
}

function getEdificioMultiplier(id) {
  let mult = 1;
  MEJORAS_DATA.forEach(m => {
    if (gameState.mejoras[m.id] && m.tipo === 'edificio' && m.target === id && m.multiplicador > mult)
      mult = m.multiplicador;
  });
  return mult;
}

function calculateEdificioPrecioN(precioBase, owned, n) {
  if (n === 1) return Math.floor(precioBase * Math.pow(1.15, owned));
  const r = 1.15;
  return Math.floor(precioBase * Math.pow(r, owned) * (Math.pow(r, n) - 1) / (r - 1));
}

function buyAlfajor(id) {
  const alf = ALFAJORES_DATA[id];
  if (gameState.alfajores >= alf.costo && !gameState.alfajoresUnlocked[id]) {
    gameState.alfajores -= alf.costo;
    gameState.alfajoresUnlocked[id] = true;
    equipAlfajor(id);
    renderShop(); updateUI(); saveGame();
    showNotificacion(alf.nombre + ' desbloqueado!', alf.catchphrase || 'Nuevo alfajor disponible');
  }
}

function equipAlfajor(id) {
  gameState.currentAlfajor = id;
  gameState.alfajorState = 'envuelto1';
  gameState.clicksOnAlfajor = 0;
  preloadAlfajorImages(id);
  updateAlfajorImage();
  calculateAPS();
  renderShop(); updateUI(); saveGame();
}

function preloadAlfajorImages(id) {
  const alf = ALFAJORES_DATA[id];
  if (!alf) return;
  Object.values(alf.images).forEach(src => {
    if (!imageCache[src]) {
      const img = new Image();
      img.src = src;
      imageCache[src] = img;
    }
  });
}

function buyEdificio(id) {
  const edif  = EDIFICIOS_DATA[id];
  const owned = gameState.edificios[id] || 0;
  const precio = calculateEdificioPrecioN(edif.precioBase, owned, buyAmount);
  if (gameState.alfajores >= precio) {
    gameState.alfajores -= precio;
    gameState.edificios[id] = owned + buyAmount;
    calculateAPS();
    renderShop(); updateUI(); saveGame();
    shopNeedsUpdate = false;
  }
}

function calculateAPS() {
  let totalAps = 0;
  if (gameState.alfajoresUnlocked[gameState.currentAlfajor])
    totalAps += ALFAJORES_DATA[gameState.currentAlfajor].aps;
  Object.entries(gameState.edificios).forEach(([id, count]) => {
    if (count > 0 && EDIFICIOS_DATA[id])
      totalAps += EDIFICIOS_DATA[id].aps * count * getEdificioMultiplier(id);
  });
  gameState.aps = totalAps;
}

function checkMejoras() {
  const nuevas = MEJORAS_DATA.filter(m => !gameState.mejoras[m.id] && isMejoraVisible(m) && gameState.alfajores >= m.costo);
  const badge  = document.getElementById('mejorasBadge');
  if (badge) {
    badge.textContent = nuevas.length;
    badge.style.display = nuevas.length > 0 ? 'inline-block' : 'none';
  }
}

function showNotificacion(titulo, desc) {
  const container = document.getElementById('notificacionesContainer');
  if (!container) return;
  const notif = document.createElement('div');
  notif.className = 'notificacion';
  notif.innerHTML = '<div class="notif-title">' + titulo + '</div><div class="notif-desc">' + desc + '</div>';
  container.appendChild(notif);
  setTimeout(() => notif.classList.add('notif-show'), 10);
  setTimeout(() => { notif.classList.remove('notif-show'); setTimeout(() => notif.remove(), 400); }, 3500);
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
  document.getElementById('tab-alfajores').classList.toggle('hidden', tabName !== 'alfajores');
  document.getElementById('tab-edificios').classList.toggle('hidden', tabName !== 'edificios');
  document.getElementById('tab-mejoras').classList.toggle('hidden',   tabName !== 'mejoras');
  const buyBar = document.getElementById('buyBar');
  if (buyBar) buyBar.classList.toggle('hidden', tabName !== 'edificios');
  if (tabName === 'mejoras') {
    const badge = document.getElementById('mejorasBadge');
    if (badge) badge.style.display = 'none';
    renderMejorasShop();
  }
}

function startGameLoop() {
  setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - gameState.lastUpdate) / 1000;
    gameState.lastUpdate = now;
    const earned = gameState.aps * deltaTime;
    if (earned > 0) {
      gameState.alfajores += earned;
      gameState.totalAlfajores += earned;
      updateUI();
      shopNeedsUpdate = true;
    }
  }, 100);
  setInterval(() => {
    if (shopNeedsUpdate) {
      shopNeedsUpdate = false;
      renderEdificiosShop();
      renderAlfajoresShop();
      checkMejoras();
      // Actualizar mejoras en tiempo real si el tab está activo
      const tabMejoras = document.getElementById('tab-mejoras');
      if (tabMejoras && !tabMejoras.classList.contains('hidden')) {
        renderMejorasShop();
      }
    }
  }, 500);
  setInterval(() => saveGame(), 10000);
}

function updateUI() {
  document.getElementById('alfajorCount').textContent = formatNumber(gameState.alfajores);
  document.getElementById('apsCount').textContent     = formatNumber(gameState.aps, 1);
}

function formatNumber(num, decimals) {
  if (decimals === undefined) decimals = 0;
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
  if (num >= 1e9)  return (num / 1e9).toFixed(1)  + 'B';
  if (num >= 1e6)  return (num / 1e6).toFixed(1)  + 'M';
  if (num >= 1e3)  return (num / 1e3).toFixed(1)  + 'K';
  return num.toFixed(decimals);
}

function saveGame() {
  localStorage.setItem('guaymallenClicker', JSON.stringify({
    alfajores:        gameState.alfajores,
    totalAlfajores:   gameState.totalAlfajores,
    clickMultiplier:  gameState.clickMultiplier,
    currentAlfajor:   gameState.currentAlfajor,
    alfajoresUnlocked:gameState.alfajoresUnlocked,
    edificios:        gameState.edificios,
    mejoras:          gameState.mejoras,
    goldenCount:      gameState.goldenCount,
    lastSave:         Date.now()
  }));
}

function loadGame() {
  const saved = localStorage.getItem('guaymallenClicker');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      gameState.alfajores         = data.alfajores         || 0;
      gameState.totalAlfajores    = data.totalAlfajores    || 0;
      gameState.clickMultiplier   = data.clickMultiplier   || 1;
      gameState.currentAlfajor    = data.currentAlfajor    || 'negro';
      gameState.alfajoresUnlocked = data.alfajoresUnlocked || { negro: true, blanco: false, caviar: false };
      gameState.edificios         = data.edificios         || {};
      gameState.mejoras           = data.mejoras           || {};
      gameState.goldenCount       = data.goldenCount       || 0;
      if (data.lastSave) {
        const offlineTime = (Date.now() - data.lastSave) / 1000;
        calculateAPS();
        const offlineEarnings = gameState.aps * offlineTime;
        if (offlineEarnings > 1) {
          gameState.alfajores      += offlineEarnings;
          gameState.totalAlfajores += offlineEarnings;
          setTimeout(() => showNotificacion('Produccion offline', 'Ganaste ' + formatNumber(offlineEarnings) + ' alfajores!'), 500);
        }
      }
    } catch(e) { console.error('Error al cargar:', e); }
  }
  if (Object.keys(gameState.mejoras).length > 0) {
    gameState.clickMultiplier = 1;
    MEJORAS_DATA.forEach(m => {
      if (gameState.mejoras[m.id] && m.tipo === 'click')
        gameState.clickMultiplier *= m.multiplicador;
    });
  }
  calculateAPS();
  updateAlfajorImage();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW OK'))
      .catch(err => console.log('SW error:', err));
  });
               }
