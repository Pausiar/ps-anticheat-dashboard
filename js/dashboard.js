// ===========================
// Dashboard Page Logic
// ===========================

let detectionsChart = null;
let topDetectionsChart = null;

/**
 * Inicializa el dashboard
 */
async function initDashboard() {
    await loadDashboardStats();
    await loadRecentActivity();
    initCharts();
    
    // Auto-refresh cada X segundos
    setInterval(async () => {
        await loadDashboardStats();
        await loadRecentActivity();
        updateCharts();
    }, CONFIG.refreshInterval);
}

/**
 * Carga las estadísticas del dashboard
 */
async function loadDashboardStats() {
    try {
        const response = await api.getStats();
        
        if (response.success) {
            const stats = response.data;
            
            // Actualizar tarjetas de estadísticas
            updateElement('totalDetections', stats.totalDetections || 0);
            updateElement('totalBans', stats.totalBans || 0);
            updateElement('totalPlayers', stats.totalPlayers || 0);
            updateElement('trustScore', `${stats.trustScore || 0}%`);
        }
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        showNotification('Error al cargar estadísticas', 'error');
    }
}

/**
 * Carga la actividad reciente
 */
async function loadRecentActivity() {
    try {
        const response = await api.getViolations({ limit: 10 });
        
        if (response.success && response.data.length > 0) {
            const tbody = document.querySelector('#recentActivityTable tbody');
            tbody.innerHTML = '';
            
            response.data.forEach(violation => {
                const row = createActivityRow(violation);
                tbody.appendChild(row);
            });
        } else {
            showEmptyState('#recentActivityTable tbody', 'No hay actividad reciente');
        }
    } catch (error) {
        console.error('Error cargando actividad:', error);
    }
}

/**
 * Crea una fila de actividad
 */
function createActivityRow(violation) {
    const row = document.createElement('tr');
    
    const time = new Date(violation.timestamp).toLocaleTimeString('es-ES');
    const severityClass = violation.severity || 'low';
    
    row.innerHTML = `
        <td>${time}</td>
        <td>${violation.player || 'Desconocido'}</td>
        <td><code>${violation.identifier || 'N/A'}</code></td>
        <td><span class="badge">${formatDetectionType(violation.type)}</span></td>
        <td><span class="badge ${severityClass}">${violation.severity?.toUpperCase() || 'LOW'}</span></td>
        <td><strong>${violation.action || 'N/A'}</strong></td>
    `;
    
    return row;
}

/**
 * Inicializa los gráficos con Chart.js
 */
function initCharts() {
    // Gráfico de detecciones por hora
    const ctx1 = document.getElementById('detectionsChart');
    if (ctx1) {
        detectionsChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Detecciones',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    // Gráfico de top detecciones
    const ctx2 = document.getElementById('topDetectionsChart');
    if (ctx2) {
        topDetectionsChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f59e0b',
                        '#ef4444',
                        '#10b981'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    updateCharts();
}

/**
 * Actualiza los datos de los gráficos
 */
async function updateCharts() {
    try {
        const response = await api.getStats();
        
        if (response.success) {
            const stats = response.data;
            
            // Actualizar gráfico de detecciones por hora
            if (detectionsChart && stats.detectionsToday) {
                detectionsChart.data.labels = stats.detectionsToday.map(d => d.hour);
                detectionsChart.data.datasets[0].data = stats.detectionsToday.map(d => d.count);
                detectionsChart.update();
            }
            
            // Actualizar gráfico de top detecciones
            if (topDetectionsChart && stats.topDetections) {
                topDetectionsChart.data.labels = stats.topDetections.map(d => d.type);
                topDetectionsChart.data.datasets[0].data = stats.topDetections.map(d => d.count);
                topDetectionsChart.update();
            }
        }
    } catch (error) {
        console.error('Error actualizando gráficos:', error);
    }
}

/**
 * Formatea el tipo de detección
 */
function formatDetectionType(type) {
    const types = {
        'aimbot': 'Aimbot',
        'noclip': 'Noclip',
        'godmode': 'Godmode',
        'speedhack': 'Speedhack',
        'teleport': 'Teleport',
        'weapon_mod': 'Weapon Mod',
        'esp': 'ESP/Wallhack',
        'injection': 'Injection'
    };
    return types[type] || type;
}

// Inicializar cuando se muestra la página
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('page-dashboard')) {
        initDashboard();
    }
});
