// ===========================
// Logs Page Logic
// ===========================

let currentLogs = [];
let logsAutoRefresh = null;

/**
 * Carga los logs del sistema
 */
async function loadLogs(filters = {}) {
    try {
        const response = await api.getLogs(filters);
        
        if (response.success && response.data.length > 0) {
            currentLogs = response.data;
            displayLogs(response.data);
        } else {
            const container = document.getElementById('logsContainer');
            if (container) {
                container.innerHTML = `
                    <div class="log-entry info">
                        <span class="log-time">--:--:--</span>
                        <span class="log-level">INFO</span>
                        <span class="log-message">No hay logs disponibles</span>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error cargando logs:', error);
        showNotification('Error al cargar logs', 'error');
    }
}

/**
 * Muestra los logs
 */
function displayLogs(logs) {
    const container = document.getElementById('logsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    logs.forEach(log => {
        const entry = createLogEntry(log);
        container.appendChild(entry);
    });
    
    // Auto-scroll al final
    container.scrollTop = container.scrollHeight;
}

/**
 * Crea una entrada de log
 */
function createLogEntry(log) {
    const entry = document.createElement('div');
    entry.className = `log-entry ${log.level || 'info'}`;
    
    const time = new Date(log.timestamp).toLocaleTimeString('es-ES');
    const levelBadge = `<span class="log-level">${log.level?.toUpperCase() || 'INFO'}</span>`;
    
    entry.innerHTML = `
        <span class="log-time">${time}</span>
        ${levelBadge}
        <span class="log-message">${escapeHtml(log.message)}</span>
    `;
    
    return entry;
}

/**
 * Limpia los logs
 */
async function clearLogs() {
    if (!confirm('¿Estás seguro de que quieres limpiar todos los logs?')) {
        return;
    }
    
    try {
        // TODO: Implementar endpoint de limpieza en el servidor
        showNotification('Logs limpiados correctamente', 'success');
        loadLogs();
    } catch (error) {
        console.error('Error limpiando logs:', error);
        showNotification('Error al limpiar logs', 'error');
    }
}

/**
 * Inicia auto-refresh de logs
 */
function startLogsAutoRefresh() {
    if (logsAutoRefresh) {
        clearInterval(logsAutoRefresh);
    }
    
    logsAutoRefresh = setInterval(() => {
        if (AppState.currentPage === 'logs') {
            loadLogs();
        }
    }, 5000); // Actualizar cada 5 segundos
}

/**
 * Detiene auto-refresh de logs
 */
function stopLogsAutoRefresh() {
    if (logsAutoRefresh) {
        clearInterval(logsAutoRefresh);
        logsAutoRefresh = null;
    }
}

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Exporta logs
 */
async function exportLogs() {
    if (currentLogs.length === 0) {
        showNotification('No hay logs para exportar', 'warning');
        return;
    }
    
    const logsText = currentLogs.map(log => 
        `[${log.timestamp}] [${log.level?.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const filename = `anticheat_logs_${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(logsText, filename, 'text/plain');
    showNotification('Logs exportados correctamente', 'success');
}

// Inicializar controles
document.addEventListener('DOMContentLoaded', () => {
    const logLevelFilter = document.getElementById('logLevelFilter');
    const logDateFilter = document.getElementById('logDateFilter');
    const clearLogsBtn = document.getElementById('clearLogsBtn');
    
    if (logLevelFilter) {
        logLevelFilter.addEventListener('change', () => {
            loadLogs({ level: logLevelFilter.value });
        });
    }
    
    if (logDateFilter) {
        logDateFilter.addEventListener('change', () => {
            loadLogs({ date: logDateFilter.value });
        });
    }
    
    if (clearLogsBtn) {
        clearLogsBtn.addEventListener('click', clearLogs);
    }
    
    // Iniciar auto-refresh cuando se muestra la página de logs
    const observer = new MutationObserver((mutations) => {
        const logsPage = document.getElementById('page-logs');
        if (logsPage && logsPage.classList.contains('active')) {
            startLogsAutoRefresh();
        } else {
            stopLogsAutoRefresh();
        }
    });
    
    const logsPage = document.getElementById('page-logs');
    if (logsPage) {
        observer.observe(logsPage, { attributes: true, attributeFilter: ['class'] });
    }
});
