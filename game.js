// ==================== DATOS DEL JUEGO ====================
const ALFAJORES_DATA = {
  negro: {
    id: 'negro', nombre: 'Guaymallén Negro', costo: 0, clickValue: 1, aps: 0.1, emoji: '🍫',
    images: {
      envuelto1: 'images/negro/A_negro_envuelto1.png', envuelto2: 'images/negro/A_negro_envuelto2.png',
      completo: 'images/negro/A_negro_completo.png', mordisco1: 'images/negro/A_negro_mordisco1.png',
      mordisco2: 'images/negro/A_negro_mordisco2.png', mordisco3: 'images/negro/A_negro_mordisco3.png',
      mordisco4: 'images/negro/A_negro_mordisco4.png', mordisco5: 'images/negro/A_negro_mordisco5.png'
    }, unlocked: true
  },
  blanco: {
    id: 'blanco', nombre: 'Guaymallén Blanco', costo: 500, clickValue: 2, aps: 0.5, emoji: '⚪',
    images: {
      envuelto1: 'images/blanco/envuelto1.png', completo: 'images/blanco/completo.png',
      mordisco1: 'images/blanco/mordisco1.png', mordisco2: 'images/blanco/mordisco2.png',
      mordisco3: 'images/blanco/mordisco3.png', mordisco4: 'images/blanco/mordisco4.png',
      mordisco5: 'images/blanco/mordisco5.png'
    }, unlocked: false
  },
  caviar: {
    id: 'caviar', nombre: 'Guaymallén Fruta', costo: 3000, clickValue: 5, aps: 1.5, emoji: '🍊',
    catchphrase: 'CAVIAAAAAR',
    images: {
      envuelto1: 'images/caviar/envuelto1.png', envuelto2: 'images/caviar/envuelto2.png',
      completo: 'images/caviar/completo.png', mordisco1: 'images/caviar/mordisco1.png',
      mordisco2: 'images/caviar/mordisco2.png', mordisco3: 'images/caviar/mordisco3.png',
      mordisco4: 'images/caviar/mordisco4.png'
    }, unlocked: false
  }
};

const EDIFICIOS_DATA = {
  kiosquero: { id: 'kiosquero', nombre: 'Kiosquero del barrio', precioBase: 15, aps: 0.1, emoji: '🏪', owned: 0 },
  panaderia: { id: 'panaderia', nombre: 'Panadería de Flores', precioBase: 100, aps: 0.5, emoji: '🥖', owned: 0 },
  maquina: { id: 'maquina', nombre: 'Máquina de dulce de leche', precioBase: 500, aps: 2.0, emoji: '🏭', owned: 0 },
  linea: { id: 'linea', nombre: 'Línea de chocolate', precioBase: 2000, aps: 8.0, emoji: '🍫', owned: 0 },
  camion: { id: 'camion', nombre: 'Camioncito de reparto', precioBase: 8000, aps: 25.0, emoji: '🚚', owned: 0 },
  fabrica: { id: 'fabrica', nombre: 'Fábrica de Mataderos', precioBase: 30000, aps: 80.0, emoji: '🏭', owned: 0 }
};

let gameState = {
  alfajores: 0, totalAlfajores: 0, aps: 0,
  currentAlfajor: 'negro', alfajorState: 'envuelto1',
  clicksOnWrapper: 0, clicksOnAlfajor: 0,
  alfajoresUnlocked: { negro: true, blanco: false, caviar: false },
  edificios: {}, lastUpdate: Date.now()
};

window.addEventListener('load', () => {
  loadGame(); renderShop(); updateUI(); startGameLoop(); setupEventListeners();
});

function setupEventListeners() {
  const clickEl = document.getElementById('alfajorClick');
  clickEl.addEventListener('click', handleAlfajorClick);
  clickEl.addEventListener('touchend', (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    handleAlfajorClick({ clientX: touch.clientX, clientY: touch.clientY, currentTarget: clickEl });
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function handleAlfajorClick(e) {
  const currentAlf = ALFAJORES_DATA[gameState.currentAlfajor];
  const clickX = e.clientX;
  const clickY = e.clientY;

  if (gameState.alfajorState === 'envuelto1') {
    gameState.alfajorState = 'envuelto2';
    updateAlfajorImage(); return;
  }
  if (gameState.alfajorState === 'envuelto2') {
    gameState.alfajorState = 'completo';
    gameState.clicksOnAlfajor = 0;
    updateAlfajorImage(); return;
  }
  if (gameState.alfajorState === 'completo' || gameState.alfajorState.startsWith('mordisco')) {
    gameState.alfajores += currentAlf.clickValue;
    gameState.totalAlfajores += currentAlf.clickValue;
    showClickEffect(currentAlf.clickValue, clickX, clickY);
    spawnMigajas(clickX, clickY);
    gameState.clicksOnAlfajor++;
    if (gameState.clicksOnAlfajor >= 5) {
      gameState.alfajorState = 'envuelto1';
      gameState.clicksOnAlfajor = 0;
    } else {
      gameState.alfajorState = 'mordisco' + gameState.clicksOnAlfajor;
    }
    updateAlfajorImage(); updateUI(); saveGame();
  }
}

function updateAlfajorImage() {
  const img = document.getElementById('alfajorImg');
  const currentAlf = ALFAJORES_DATA[gameState.currentAlfajor];
  img.src = currentAlf.images[gameState.alfajorState] || currentAlf.images.completo;
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
  for (let i = 0; i < count; i++) {
    const migaja = document.createElement('img');
    migaja.src = 'images/a_negro_migajas.png';
    migaja.className = 'migaja';
    const spreadX = (Math.random() - 0.5) * 30;
    const spreadY = (Math.random() - 0.5) * 20;
    const velX = (Math.random() - 0.5) * 140;
    migaja.style.left = (clickX + spreadX) + 'px';
    migaja.style.top = (clickY + spreadY) + 'px';
    migaja.style.setProperty('--velX', velX + 'px');
    document.getElementById('migajasContainer').appendChild(migaja);
    setTimeout(() => migaja.remove(), 1200);
  }
}

function renderShop() { renderAlfajoresShop(); renderEdificiosShop(); }

function renderAlfajoresShop() {
  const container = document.getElementById('alfajoresShop');
  container.innerHTML = '';
  Object.values(ALFAJORES_DATA).forEach(alf => {
    const item = document.createElement('div');
    item.className = 'shop-item';
    const unlocked = gameState.alfajoresUnlocked[alf.id];
    const canBuy = gameState.alfajores >= alf.costo;
    if (!unlocked && !canBuy) item.classList.add('locked');
    item.innerHTML = '<div class="item-icon">' + alf.emoji + '</div><div class="item-info"><div class="item-name">' + alf.nombre + '</div><div class="item-description">' + (alf.catchphrase || 'Alfajor clásico argentino') + '</div><div class="item-stats"><span>👆 +' + alf.clickValue + ' por clic</span><span>⏱️ +' + alf.aps + ' APS</span></div></div><div><div class="item-price">' + (unlocked ? 'EQUIPADO' : (alf.costo === 0 ? 'GRATIS' : formatNumber(alf.costo))) + '</div>' + (!unlocked && alf.costo > 0 ? '<div class="item-owned">🔒 Bloqueado</div>' : '') + '</div>';
    if (!unlocked && canBuy) item.addEventListener('click', () => buyAlfajor(alf.id));
    else if (unlocked && alf.id !== gameState.currentAlfajor) item.addEventListener('click', () => equipAlfajor(alf.id));
    container.appendChild(item);
  });
}

function renderEdificiosShop() {
  const container = document.getElementById('edificiosShop');
  container.innerHTML = '';
  Object.values(EDIFICIOS_DATA).forEach(edif => {
    const owned = gameState.edificios[edif.id] || 0;
    const precio = calculateEdificioPrecio(edif.precioBase, owned);
    const canBuy = gameState.alfajores >= precio;
    const item = document.createElement('div');
    item.className = 'shop-item';
    if (!canBuy) item.classList.add('locked');
    item.innerHTML = '<div class="item-icon">' + edif.emoji + '</div><div class="item-info"><div class="item-name">' + edif.nombre + '</div><div class="item-description">Produce alfajores automáticamente</div><div class="item-stats"><span>⏱️ ' + edif.aps + ' APS por unidad</span></div></div><div><div class="item-price">' + formatNumber(precio) + '</div><div class="item-owned">Tenés: ' + owned + '</div></div>';
    if (canBuy) item.addEventListener('click', () => buyEdificio(edif.id));
    container.appendChild(item);
  });
}

function buyAlfajor(id) {
  const alf = ALFAJORES_DATA[id];
  if (gameState.alfajores >= alf.costo && !gameState.alfajoresUnlocked[id]) {
    gameState.alfajores -= alf.costo;
    gameState.alfajoresUnlocked[id] = true;
    equipAlfajor(id); renderShop(); updateUI(); saveGame();
  }
}

function equipAlfajor(id) {
  gameState.currentAlfajor = id;
  gameState.alfajorState = 'envuelto1';
  gameState.clicksOnAlfajor = 0;
  updateAlfajorImage(); calculateAPS(); renderShop(); updateUI(); saveGame();
}

function buyEdificio(id) {
  const edif = EDIFICIOS_DATA[id];
  const owned = gameState.edificios[id] || 0;
  const precio = calculateEdificioPrecio(edif.precioBase, owned);
  if (gameState.alfajores >= precio) {
    gameState.alfajores -= precio;
    gameState.edificios[id] = owned + 1;
    calculateAPS(); renderShop(); updateUI(); saveGame();
  }
}

function calculateEdificioPrecio(precioBase, owned) {
  return Math.floor(precioBase * Math.pow(1.15, owned));
}

function calculateAPS() {
  let totalAps = 0;
  if (gameState.alfajoresUnlocked[gameState.currentAlfajor]) {
    totalAps += ALFAJORES_DATA[gameState.currentAlfajor].aps;
  }
  Object.entries(gameState.edificios).forEach(([id, count]) => {
    totalAps += EDIFICIOS_DATA[id].aps * count;
  });
  gameState.aps = totalAps;
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
  document.getElementById('tab-alfajores').classList.toggle('hidden', tabName !== 'alfajores');
  document.getElementById('tab-edificios').classList.toggle('hidden', tabName !== 'edificios');
}

function startGameLoop() {
  setInterval(() => {
    const now = Date.now();
    const deltaTime = (now - gameState.lastUpdate) / 1000;
    gameState.lastUpdate = now;
    const earned = gameState.aps * deltaTime;
    if (earned > 0) { gameState.alfajores += earned; gameState.totalAlfajores += earned; updateUI(); }
  }, 100);
  setInterval(() => saveGame(), 10000);
}

function updateUI() {
  document.getElementById('alfajorCount').textContent = formatNumber(gameState.alfajores);
  document.getElementById('apsCount').textContent = formatNumber(gameState.aps, 1);
}

function formatNumber(num, decimals = 0) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toFixed(decimals);
}

function saveGame() {
  localStorage.setItem('guaymallenClicker', JSON.stringify({
    alfajores: gameState.alfajores, totalAlfajores: gameState.totalAlfajores,
    currentAlfajor: gameState.currentAlfajor, alfajoresUnlocked: gameState.alfajoresUnlocked,
    edificios: gameState.edificios, lastSave: Date.now()
  }));
}

function loadGame() {
  const saved = localStorage.getItem('guaymallenClicker');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      gameState.alfajores = data.alfajores || 0;
      gameState.totalAlfajores = data.totalAlfajores || 0;
      gameState.currentAlfajor = data.currentAlfajor || 'negro';
      gameState.alfajoresUnlocked = data.alfajoresUnlocked || { negro: true, blanco: false, caviar: false };
      gameState.edificios = data.edificios || {};
      if (data.lastSave) {
        const offlineTime = (Date.now() - data.lastSave) / 1000;
        calculateAPS();
        const offlineEarnings = gameState.aps * offlineTime;
        if (offlineEarnings > 0) {
          gameState.alfajores += offlineEarnings;
          gameState.totalAlfajores += offlineEarnings;
          console.log('¡Ganaste ' + formatNumber(offlineEarnings) + ' alfajores mientras estabas ausente!');
        }
      }
    } catch(e) { console.error('Error al cargar el juego:', e); }
  }
  calculateAPS(); updateAlfajorImage();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('Service Worker registrado'))
      .catch(err => console.log('Error al registrar SW:', err));
  });
}