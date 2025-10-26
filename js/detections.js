// ===========================
// Detections Page Logic
// ===========================

/**
 * Carga las detecciones disponibles
 */
async function loadDetections() {
    try {
        const response = await api.getConfig();
        
        if (response.success && response.data) {
            displayDetectionCards(response.data);
        }
    } catch (error) {
        console.error('Error cargando detecciones:', error);
        showNotification('Error al cargar configuración de detecciones', 'error');
    }
}

/**
 * Muestra las tarjetas de detección
 */
function displayDetectionCards(config) {
    const grid = document.querySelector('.detections-grid');
    if (!grid) return;
    
    const detections = [
        { id: 'aimbot', name: 'Aimbot Detection', icon: 'crosshairs', description: 'Detecta el uso de aimbot mediante análisis de rotación de cámara y precisión de disparos' },
        { id: 'noclip', name: 'Noclip Detection', icon: 'ghost', description: 'Detecta atravesamiento de paredes y objetos sólidos' },
        { id: 'esp', name: 'ESP/Wallhack', icon: 'eye', description: 'Detecta ESP y wallhacks mediante análisis de comportamiento visual' },
        { id: 'godmode', name: 'Godmode', icon: 'shield-alt', description: 'Detecta invulnerabilidad y modificaciones de vida' },
        { id: 'speedhack', name: 'Speed Hack', icon: 'tachometer-alt', description: 'Detecta modificaciones de velocidad de movimiento' },
        { id: 'teleport', name: 'Teleport', icon: 'location-arrow', description: 'Detecta teletransportación no autorizada' },
        { id: 'weapon_mod', name: 'Weapon Modifications', icon: 'gun', description: 'Detecta modificaciones de armas (daño, cadencia, munición)' },
        { id: 'spectate', name: 'Spectate Hack', icon: 'video', description: 'Detecta el uso de modo espectador no autorizado' },
        { id: 'injection', name: 'Resource Injection', icon: 'syringe', description: 'Bloquea la inyección de recursos maliciosos' },
        { id: 'vpn', name: 'VPN/Proxy Detection', icon: 'network-wired', description: 'Detecta y bloquea conexiones desde VPN/Proxy' },
        { id: 'rapidfire', name: 'Rapid Fire / Macros', icon: 'mouse', description: 'Detecta macros y disparos acelerados' },
        { id: 'gamestate', name: 'Game State Manipulation', icon: 'gamepad', description: 'Detecta manipulación del estado del juego (tiempo, clima, gravedad)' },
        { id: 'fingerprint', name: 'Hardware Fingerprinting', icon: 'fingerprint', description: 'Sistema de identificación por hardware para detectar ban evasion' },
        { id: 'ml_behavior', name: 'ML Behavior Analysis', icon: 'brain', description: 'Análisis de comportamiento mediante Machine Learning' },
        { id: 'screenshot', name: 'Screenshot System', icon: 'camera', description: 'Captura de pantalla automática ante detecciones' }
    ];
    
    grid.innerHTML = '';
    
    detections.forEach(detection => {
        const card = createDetectionCard(detection, config);
        grid.appendChild(card);
    });
}

/**
 * Crea una tarjeta de detección
 */
function createDetectionCard(detection, config) {
    const card = document.createElement('div');
    card.className = 'detection-card';
    
    // Simular estado de configuración
    const isEnabled = true; // TODO: Obtener del config real
    
    card.innerHTML = `
        <div class="detection-card-header">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas fa-${detection.icon}" style="font-size: 1.5rem; color: var(--primary-color);"></i>
                <h4>${detection.name}</h4>
            </div>
            <div class="detection-toggle">
                <input type="checkbox" id="toggle-${detection.id}" ${isEnabled ? 'checked' : ''} onchange="toggleDetection('${detection.id}', this.checked)">
                <label for="toggle-${detection.id}"></label>
            </div>
        </div>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.75rem;">
            ${detection.description}
        </p>
        <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <span class="badge ${isEnabled ? 'low' : 'critical'}" style="font-size: 0.75rem;">
                ${isEnabled ? 'ACTIVO' : 'DESACTIVADO'}
            </span>
            <button class="btn-text" onclick="configureDetection('${detection.id}')" style="font-size: 0.875rem;">
                <i class="fas fa-cog"></i> Configurar
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Activa/desactiva una detección
 */
async function toggleDetection(detectionId, enabled) {
    try {
        const response = await api.updateConfig({
            detection: detectionId,
            enabled: enabled
        });
        
        if (response.success) {
            showNotification(
                `Detección ${enabled ? 'activada' : 'desactivada'} correctamente`,
                'success'
            );
        } else {
            showNotification('Error al actualizar configuración', 'error');
        }
    } catch (error) {
        console.error('Error actualizando detección:', error);
        showNotification('Error al actualizar configuración', 'error');
    }
}

/**
 * Configurar detección específica
 */
function configureDetection(detectionId) {
    showNotification(`Configurando ${detectionId}...`, 'info');
    // TODO: Modal de configuración específica
}
