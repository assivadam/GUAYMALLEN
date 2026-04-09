// ==================== DATOS DEL JUEGO ====================

const ALFAJORES_DATA = {
    negro: {
        id: 'negro',
        nombre: 'Guaymallén Negro',
        costo: 0,
        clickValue: 1,
        aps: 0.1,
        emoji: '🍫',
        images: {
            envuelto1: 'images/negro/A_negro_envuelto1.png',
            envuelto2: 'images/negro/A_negro_envuelto2.png',
            completo: 'images/negro/A_negro_completo.png',
            mordisco1: 'images/negro/A_negro_mordisco1.png',
            mordisco2: 'images/negro/A_negro_mordisco2.png',
            mordisco3: 'images/negro/A_negro_mordisco3.png',
            mordisco4: 'images/negro/A_negro_mordisco4.png',
            mordisco5: 'images/negro/A_negro_mordisco5.png'
        },
        unlocked: true
    },
    blanco: {
        id: 'blanco',
        nombre: 'Guaymallén Blanco',
        costo: 500,
        clickValue: 2,
        aps: 0.5,
        emoji: '⚪',
        images: {
            envuelto1: 'images/blanco/envuelto1.png',
            completo: 'images/blanco/completo.png',
            mordisco1: 'images/blanco/mordisco1.png',
            mordisco2: 'images/blanco/mordisco2.png',
            mordisco3: 'images/blanco/mordisco3.png',
            mordisco4: 'images/blanco/mordisco4.png',
            mordisco5: 'images/blanco/mordisco5.png'
        },
        unlocked: false
    },
    caviar: {
        id: 'caviar',
        nombre: 'Guaymallén Fruta',
        costo: 3000,
        clickValue: 5,
        aps: 1.5,
        emoji: '🍊',
        catchphrase: 'CAVIAAAAAR',
        images: {
            envuelto1: 'images/caviar/envuelto1.png',
            envuelto2: 'images/caviar/envuelto2.png',
            completo: 'images/caviar/completo.png',
            mordisco1: 'images/caviar/mordisco1.png',
            mordisco2: 'images/caviar/mordisco2.png',
            mordisco3: 'images/caviar/mordisco3.png',
            mordisco4: 'images/caviar/mordisco4.png'
        },
        unlocked: false
    }
};

const EDIFICIOS_DATA = {
    kiosquero: {
        id: 'kiosquero',
        nombre: 'Kiosquero del barrio',
        precioBase: 15,
        aps: 0.1,
        emoji: '🏪',
        owned: 0
    },
    panaderia: {
        id: 'panaderia',
        nombre: 'Panadería de Flores',
        precioBase: 100,
        aps: 0.5,
        emoji: '🥖',
        owned: 0
    },
    maquina: {
        id: 'maquina',
        nombre: 'Máquina de dulce de leche',
        precioBase: 500,
        aps: 2.0,
        emoji: '🏭',
        owned: 0
    },
    linea: {
        id: 'linea',
        nombre: 'Línea de chocolate',
        precioBase: 2000,
        aps: 8.0,
        emoji: '🍫',
        owned: 0
    },
    camion: {
        id: 'camion',
        nombre: 'Camioncito de reparto',
        precioBase: 8000,
        aps: 25.0,
        emoji: '🚚',
        owned: 0
    },
    fabrica: {
        id: 'fabrica',
        nombre: 'Fábrica de Mataderos',
        precioBase: 30000,
        aps: 80.0,
        emoji: '🏭',
        owned: 0
    }
};

// ==================== ESTADO DEL JUEGO ====================

let gameState = {
    alfajores: 0,
    totalAlfajores: 0,
    aps: 0,
    currentAlfajor: 'negro',
    alfajorState: 'envuelto1', // envuelto1, envuelto2, completo, mordisco1-5
    clicksOnWrapper: 0,
    clicksOnAlfajor: 0,
    alfajoresUnlocked: { negro: true, blanco: false, caviar: false },
    edificios: {},
    lastUpdate: Date.now()
};

// ==================== INICIALIZACIÓN ====================

window.addEventListener('load', () => {
    loadGame();
    renderShop();
    updateUI();
    startGameLoop();
    setupEventListeners();
});

function setupEventListeners() {
    // Click en alfajor
    document.getElementById('alfajorClick').addEventListener('click', handleAlfajorClick);
    
    // Tabs de la tienda
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

// ==================== CLICK EN ALFAJOR ====================

function handleAlfajorClick(e) {
    const currentAlf = ALFAJORES_DATA[gameState.currentAlfajor];
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Estado de envoltura (2 clicks para desenvolver)
    if (gameState.alfajorState === 'envuelto1') {
        gameState.alfajorState = 'envuelto2';
        updateAlfajorImage();
        return;
    }
    
    if (gameState.alfajorState === 'envuelto2') {
        gameState.alfajorState = 'completo';
        gameState.clicksOnAlfajor = 0;
        updateAlfajorImage();
        return;
    }
    
    // Estado de mordida (5 clicks)
    if (gameState.alfajorState === 'completo' || gameState.alfajorState.startsWith('mordisco')) {
        gameState.alfajores += currentAlf.clickValue;
        gameState.totalAlfajores += currentAlf.clickValue;
        
        // Efecto visual del click
        showClickEffect(currentAlf.clickValue);
        
        // Migajas
        spawnMigajas(rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        // Cambiar estado del mordisco
        gameState.clicksOnAlfajor++;
        
        if (gameState.clicksOnAlfajor >= 5) {
            // Alfajor comido, reiniciar
            gameState.alfajorState = 'envuelto1';
            gameState.clicksOnAlfajor = 0;
        } else {
            gameState.alfajorState = `mordisco${gameState.clicksOnAlfajor}`;
        }
        
        updateAlfajorImage();
        updateUI();
        saveGame();
    }
}

function updateAlfajorImage() {
    const img = document.getElementById('alfajorImg');
    const currentAlf = ALFAJORES_DATA[gameState.currentAlfajor];
    
    if (currentAlf.images[gameState.alfajorState]) {
        img.src = currentAlf.images[gameState.alfajorState];
    } else {
        // Si no hay imagen para ese estado, usar completo
        img.src = currentAlf.images.completo;
    }
}

function showClickEffect(value) {
    const effect = document.getElementById('clickEffect');
    effect.textContent = `+${formatNumber(value)}`;
    effect.classList.remove('active');
    void effect.offsetWidth; // Force reflow
    effect.classList.add('active');
}

function spawnMigajas(x, y) {
    const count = Math.floor(Math.random() * 3) + 2; // 2-4 migajas
    
    for (let i = 0; i < count; i++) {
        const migaja = document.createElement('img');
        migaja.src = 'images/a_negro_migajas.png';
        migaja.className = 'migaja';
        
        // Posición inicial aleatoria alrededor del click
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        
        migaja.style.left = (x + offsetX) + 'px';
        migaja.style.top = (y + offsetY) + 'px';
        
        document.getElementById('migajasContainer').appendChild(migaja);
        
        // Remover después de la animación
        setTimeout(() => migaja.remove(), 1500);
    }
}

// ==================== TIENDA ====================

function renderShop() {
    renderAlfajoresShop();
    renderEdificiosShop();
}

function renderAlfajoresShop() {
    const container = document.getElementById('alfajoresShop');
    container.innerHTML = '';
    
    Object.values(ALFAJORES_DATA).forEach(alf => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        
        const unlocked = gameState.alfajoresUnlocked[alf.id];
        const canBuy = gameState.alfajores >= alf.costo;
        
        if (!unlocked && !canBuy) {
            item.classList.add('locked');
        }
        
        item.innerHTML = `
            <div class="item-icon">${alf.emoji}</div>
            <div class="item-info">
                <div class="item-name">${alf.nombre}</div>
                <div class="item-description">${alf.catchphrase || 'Alfajor clásico argentino'}</div>
                <div class="item-stats">
                    <span>👆 +${alf.clickValue} por clic</span>
                    <span>⏱️ +${alf.aps} APS</span>
                </div>
            </div>
            <div>
                <div class="item-price">${unlocked ? 'EQUIPADO' : (alf.costo === 0 ? 'GRATIS' : formatNumber(alf.costo))}</div>
                ${!unlocked && alf.costo > 0 ? '<div class="item-owned">🔒 Bloqueado</div>' : ''}
            </div>
        `;
        
        if (!unlocked && canBuy) {
            item.addEventListener('click', () => buyAlfajor(alf.id));
        } else if (unlocked && alf.id !== gameState.currentAlfajor) {
            item.addEventListener('click', () => equipAlfajor(alf.id));
        }
        
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
        
        item.innerHTML = `
            <div class="item-icon">${edif.emoji}</div>
            <div class="item-info">
                <div class="item-name">${edif.nombre}</div>
                <div class="item-description">Produce alfajores automáticamente</div>
                <div class="item-stats">
                    <span>⏱️ ${edif.aps} APS por unidad</span>
                </div>
            </div>
            <div>
                <div class="item-price">${formatNumber(precio)}</div>
                <div class="item-owned">Tenés: ${owned}</div>
            </div>
        `;
        
        if (canBuy) {
            item.addEventListener('click', () => buyEdificio(edif.id));
        }
        
        container.appendChild(item);
    });
}

function buyAlfajor(id) {
    const alf = ALFAJORES_DATA[id];
    
    if (gameState.alfajores >= alf.costo && !gameState.alfajoresUnlocked[id]) {
        gameState.alfajores -= alf.costo;
        gameState.alfajoresUnlocked[id] = true;
        equipAlfajor(id);
        renderShop();
        updateUI();
        saveGame();
    }
}

function equipAlfajor(id) {
    gameState.currentAlfajor = id;
    gameState.alfajorState = 'envuelto1';
    gameState.clicksOnAlfajor = 0;
    updateAlfajorImage();
    calculateAPS();
    renderShop();
    updateUI();
    saveGame();
}

function buyEdificio(id) {
    const edif = EDIFICIOS_DATA[id];
    const owned = gameState.edificios[id] || 0;
    const precio = calculateEdificioPrecio(edif.precioBase, owned);
    
    if (gameState.alfajores >= precio) {
        gameState.alfajores -= precio;
        gameState.edificios[id] = owned + 1;
        calculateAPS();
        renderShop();
        updateUI();
        saveGame();
    }
}

function calculateEdificioPrecio(precioBase, owned) {
    return Math.floor(precioBase * Math.pow(1.15, owned));
}

function calculateAPS() {
    let totalAps = 0;
    
    // APS del alfajor equipado
    const currentAlf = ALFAJORES_DATA[gameState.currentAlfajor];
    if (gameState.alfajoresUnlocked[gameState.currentAlfajor]) {
        totalAps += currentAlf.aps;
    }
    
    // APS de edificios
    Object.entries(gameState.edificios).forEach(([id, count]) => {
        const edif = EDIFICIOS_DATA[id];
        totalAps += edif.aps * count;
    });
    
    gameState.aps = totalAps;
}

// ==================== TABS ====================

function switchTab(tabName) {
    // Cambiar botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Cambiar contenido
    document.getElementById('tab-alfajores').classList.toggle('hidden', tabName !== 'alfajores');
    document.getElementById('tab-edificios').classList.toggle('hidden', tabName !== 'edificios');
}

// ==================== GAME LOOP ====================

function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        const deltaTime = (now - gameState.lastUpdate) / 1000; // segundos
        gameState.lastUpdate = now;
        
        // Producción pasiva
        const earned = gameState.aps * deltaTime;
        if (earned > 0) {
            gameState.alfajores += earned;
            gameState.totalAlfajores += earned;
            updateUI();
        }
    }, 100); // Update cada 100ms
    
    // Auto-save cada 10 segundos
    setInterval(() => {
        saveGame();
    }, 10000);
}

// ==================== UI ====================

function updateUI() {
    document.getElementById('alfajorCount').textContent = formatNumber(gameState.alfajores);
    document.getElementById('apsCount').textContent = formatNumber(gameState.aps, 1);
}

function formatNumber(num, decimals = 0) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return num.toFixed(decimals);
    }
}

// ==================== GUARDADO ====================

function saveGame() {
    const saveData = {
        alfajores: gameState.alfajores,
        totalAlfajores: gameState.totalAlfajores,
        currentAlfajor: gameState.currentAlfajor,
        alfajoresUnlocked: gameState.alfajoresUnlocked,
        edificios: gameState.edificios,
        lastSave: Date.now()
    };
    
    localStorage.setItem('guaymallenClicker', JSON.stringify(saveData));
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
            
            // Calcular producción offline
            if (data.lastSave) {
                const offlineTime = (Date.now() - data.lastSave) / 1000; // segundos
                calculateAPS();
                const offlineEarnings = gameState.aps * offlineTime;
                if (offlineEarnings > 0) {
                    gameState.alfajores += offlineEarnings;
                    gameState.totalAlfajores += offlineEarnings;
                    console.log(`¡Ganaste ${formatNumber(offlineEarnings)} alfajores mientras estabas ausente!`);
                }
            }
        } catch (e) {
            console.error('Error al cargar el juego:', e);
        }
    }
    
    calculateAPS();
    updateAlfajorImage();
}

// ==================== PWA ====================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Error al registrar SW:', err));
    });
}
