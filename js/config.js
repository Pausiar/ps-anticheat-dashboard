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
        totalDetections: 247,
        totalBans: 12,
        totalPlayers: 1453,
        trustScore: 98.5,
        detectionsToday: [
            { hour: '00:00', count: 5 },
            { hour: '03:00', count: 2 },
            { hour: '06:00', count: 8 },
            { hour: '09:00', count: 15 },
            { hour: '12:00', count: 23 },
            { hour: '15:00', count: 31 },
            { hour: '18:00', count: 42 },
            { hour: '21:00', count: 28 }
        ],
        topDetections: [
            { type: 'Aimbot', count: 45 },
            { type: 'Noclip', count: 38 },
            { type: 'Speedhack', count: 32 },
            { type: 'Teleport', count: 28 },
            { type: 'Godmode', count: 24 }
        ]
    },
    
    violations: [
        {
            id: 1,
            timestamp: '2025-10-26 14:32:15',
            player: 'PlayerName123',
            identifier: 'steam:11000010a1b2c3d',
            type: 'aimbot',
            details: 'Detección de aimbot confirmada - 15 headshots consecutivos',
            severity: 'critical',
            action: 'BAN',
            evidence: { headshots: 15, accuracy: 98.5 }
        },
        {
            id: 2,
            timestamp: '2025-10-26 14:28:43',
            player: 'SuspiciousUser',
            identifier: 'discord:123456789012345678',
            type: 'noclip',
            details: 'Atravesando paredes - distancia: 25.3m',
            severity: 'high',
            action: 'KICK',
            evidence: { distance: 25.3, collisions: 0 }
        }
    ],
    
    bans: [
        {
            id: 1,
            player: 'Cheater123',
            identifiers: ['steam:11000010a1b2c3d', 'license:abc123', 'discord:123456789012345678'],
            reason: 'Aimbot - Ban automático',
            banDate: '2025-10-26 14:32:15',
            expires: 'Permanente',
            admin: 'Sistema',
            hwid: 'HWID-ABC123XYZ'
        }
    ],
    
    players: [
        {
            name: 'PlayerName123',
            identifiers: ['steam:11000010a1b2c3d', 'license:abc123'],
            trustScore: 45,
            violations: 5,
            playtime: '24h 15m',
            lastSeen: '2025-10-26 14:32:15'
        },
        {
            name: 'GoodPlayer',
            identifiers: ['steam:22000020b2c3d4e', 'license:def456'],
            trustScore: 95,
            violations: 0,
            playtime: '156h 42m',
            lastSeen: '2025-10-26 15:00:00'
        }
    ],
    
    logs: [
        {
            timestamp: '2025-10-26 15:30:22',
            level: 'info',
            message: 'Sistema de anticheat iniciado correctamente'
        },
        {
            timestamp: '2025-10-26 15:30:25',
            level: 'info',
            message: 'Cargadas 15 detecciones avanzadas'
        },
        {
            timestamp: '2025-10-26 15:35:12',
            level: 'warning',
            message: 'Jugador PlayerName123 sospechoso - Trust Score: 45'
        },
        {
            timestamp: '2025-10-26 15:40:08',
            level: 'error',
            message: 'Detección crítica: Aimbot confirmado en PlayerName123'
        }
    ]
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, MOCK_DATA };
}
