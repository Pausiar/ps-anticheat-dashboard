// ===========================
// API Service
// ===========================

class APIService {
    constructor() {
        this.baseUrl = CONFIG.serverUrl;
        this.apiKey = CONFIG.apiKey;
        this.useMockData = !this.baseUrl || this.baseUrl.includes('TU_IP_SERVIDOR');
    }

    /**
     * Realiza una petición HTTP a la API
     */
    async request(endpoint, options = {}) {
        // Si no hay servidor configurado, usar datos mock
        if (this.useMockData) {
            console.warn('⚠️ Usando datos de ejemplo - Configura CONFIG.serverUrl en config.js');
            return this.getMockData(endpoint);
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey,
            ...options.headers
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`❌ Error en petición a ${endpoint}:`, error);
            // Fallback a datos mock si falla la conexión
            return this.getMockData(endpoint);
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Obtiene datos mock para desarrollo
     */
    getMockData(endpoint) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (endpoint.includes('violations')) {
                    resolve({ success: true, data: MOCK_DATA.violations });
                } else if (endpoint.includes('bans')) {
                    resolve({ success: true, data: MOCK_DATA.bans });
                } else if (endpoint.includes('players')) {
                    resolve({ success: true, data: MOCK_DATA.players });
                } else if (endpoint.includes('stats')) {
                    resolve({ success: true, data: MOCK_DATA.stats });
                } else if (endpoint.includes('logs')) {
                    resolve({ success: true, data: MOCK_DATA.logs });
                } else {
                    resolve({ success: true, data: [] });
                }
            }, 300); // Simular latencia de red
        });
    }

    // ===========================
    // Métodos específicos del Anticheat
    // ===========================

    /**
     * Obtiene estadísticas generales
     */
    async getStats() {
        return this.get(CONFIG.endpoints.stats);
    }

    /**
     * Obtiene lista de violaciones
     */
    async getViolations(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.get(`${CONFIG.endpoints.violations}?${queryString}`);
    }

    /**
     * Obtiene lista de bans
     */
    async getBans(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.get(`${CONFIG.endpoints.bans}?${queryString}`);
    }

    /**
     * Obtiene lista de jugadores
     */
    async getPlayers(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.get(`${CONFIG.endpoints.players}?${queryString}`);
    }

    /**
     * Obtiene logs del sistema
     */
    async getLogs(filters = {}) {
        const queryString = new URLSearchParams(filters).toString();
        return this.get(`${CONFIG.endpoints.logs}?${queryString}`);
    }

    /**
     * Obtiene configuración actual
     */
    async getConfig() {
        return this.get(CONFIG.endpoints.config);
    }

    /**
     * Actualiza configuración
     */
    async updateConfig(config) {
        return this.post(CONFIG.endpoints.updateConfig, config);
    }

    /**
     * Banea a un jugador manualmente
     */
    async banPlayer(data) {
        return this.post(CONFIG.endpoints.ban, data);
    }

    /**
     * Desbanea a un jugador
     */
    async unbanPlayer(identifier) {
        return this.delete(`${CONFIG.endpoints.unban}/${identifier}`);
    }

    /**
     * Exporta datos en formato específico
     */
    async exportData(type, format = 'json') {
        const endpoint = CONFIG.endpoints[type];
        const data = await this.get(endpoint);
        
        if (format === 'csv') {
            return this.convertToCSV(data.data);
        } else if (format === 'json') {
            return JSON.stringify(data.data, null, 2);
        }
        
        return data;
    }

    /**
     * Convierte datos a formato CSV
     */
    convertToCSV(data) {
        if (!data || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    // Escapar valores con comas o comillas
                    if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                        return `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ].join('\n');
        
        return csv;
    }
}

// Crear instancia global
const api = new APIService();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
