// ===========================
// Configuration
// ===========================

const CONFIG = {
    // URL de tu servidor FiveM (cámbialo por la IP/dominio de tu servidor)
    serverUrl: 'http://TU_IP_SERVIDOR:30120',
    
    // API Key para autenticación (genera una clave segura)
    apiKey: 'TU_CLAVE_API_SEGURA_AQUI',
    
    // Intervalo de actualización automática (en milisegundos)
    refreshInterval: 30000, // 30 segundos
    
    // Configuración de GitHub Pages
    // Si usas un dominio personalizado, cámbialo aquí
    isDevelopment: window.location.hostname === 'localhost',
    
    // Endpoints de la API
    endpoints: {
        violations: '/ps_anticheat/violations',
        bans: '/ps_anticheat/bans',
        players: '/ps_anticheat/players',
        stats: '/ps_anticheat/stats',
        config: '/ps_anticheat/config',
        logs: '/ps_anticheat/logs',
        ban: '/ps_anticheat/ban',
        unban: '/ps_anticheat/unban',
        updateConfig: '/ps_anticheat/updateconfig'
    }
};

// ===========================
// Datos de ejemplo para desarrollo
// (Se usarán si no hay conexión al servidor)
// ===========================

const MOCK_DATA = {
    stats: {
        totalDetections: 0,
        totalBans: 0,
        totalPlayers: 0,
        trustScore: 0,
        detectionsToday: [],
        topDetections: []
    },
    violations: [],
    bans: [],
    players: [],
    logs: []
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, MOCK_DATA };
}
