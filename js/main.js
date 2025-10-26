// ===========================
// Main Application Logic
// ===========================

// Estado global de la aplicación
const AppState = {
    currentPage: 'dashboard',
    isLoading: false,
    notifications: []
};

/**
 * Cerrar sesión
 */
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('ps_session');
        window.location.href = 'login.html';
    }
}

/**
 * Toggle menú de usuario
 */
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    const userProfile = document.querySelector('.user-profile');
    const userMenu = document.getElementById('userMenu');
    
    if (userMenu && !userProfile?.contains(e.target)) {
        userMenu.style.display = 'none';
    }
});

/**
 * Inicializa la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación PRIMERO
    const sessionData = localStorage.getItem('ps_session');
    
    if (!sessionData) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const session = JSON.parse(sessionData);
        const timeSinceLogin = Date.now() - session.timestamp;
        
        // Verificar si la sesión ha expirado (24 horas)
        if (!session.authenticated || timeSinceLogin >= 86400000) {
            localStorage.removeItem('ps_session');
            window.location.href = 'login.html';
            return;
        }
    } catch (e) {
        localStorage.removeItem('ps_session');
        window.location.href = 'login.html';
        return;
    }
    
    // Si llegamos aquí, la sesión es válida
    console.log('🚀 PS Anticheat Dashboard v2.0.0');
    
    initNavigation();
    initGlobalControls();
    checkServerConnection();
    
    // Mostrar página inicial
    showPage('dashboard');
});

/**
 * Inicializa la navegación
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const page = item.dataset.page;
            if (page) {
                // Actualizar navegación activa
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Mostrar página
                showPage(page);
            }
        });
    });
}

/**
 * Muestra una página específica
 */
function showPage(pageName) {
    // Ocultar todas las páginas
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostrar página seleccionada
    const targetPage = document.getElementById(`page-${pageName}`);
    if (targetPage) {
        targetPage.classList.add('active');
        AppState.currentPage = pageName;
        
        // Actualizar título y breadcrumb
        updatePageHeader(pageName);
        
        // Cargar datos de la página
        loadPageData(pageName);
    }
}

/**
 * Actualiza el header de la página
 */
function updatePageHeader(pageName) {
    const titles = {
        'dashboard': 'Dashboard',
        'violations': 'Violaciones',
        'bans': 'Bans',
        'players': 'Jugadores',
        'detections': 'Detecciones',
        'config': 'Configuración',
        'logs': 'Logs del Sistema'
    };
    
    const breadcrumbs = {
        'dashboard': 'Inicio / Dashboard',
        'violations': 'Gestión / Violaciones',
        'bans': 'Gestión / Bans',
        'players': 'Gestión / Jugadores',
        'detections': 'Sistema / Detecciones',
        'config': 'Sistema / Configuración',
        'logs': 'Sistema / Logs'
    };
    
    updateElement('pageTitle', titles[pageName] || pageName);
    updateElement('breadcrumb', breadcrumbs[pageName] || pageName);
}

/**
 * Carga datos de la página actual
 */
async function loadPageData(pageName) {
    switch(pageName) {
        case 'dashboard':
            if (typeof initDashboard === 'function') await initDashboard();
            break;
        case 'violations':
            if (typeof loadViolations === 'function') await loadViolations();
            break;
        case 'bans':
            if (typeof loadBans === 'function') await loadBans();
            break;
        case 'players':
            if (typeof loadPlayers === 'function') await loadPlayers();
            break;
        case 'detections':
            if (typeof loadDetections === 'function') await loadDetections();
            break;
        case 'logs':
            if (typeof loadLogs === 'function') await loadLogs();
            break;
    }
}

/**
 * Inicializa controles globales
 */
function initGlobalControls() {
    // Botón de refrescar
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.querySelector('i').classList.add('fa-spin');
            loadPageData(AppState.currentPage).finally(() => {
                setTimeout(() => {
                    refreshBtn.querySelector('i').classList.remove('fa-spin');
                }, 500);
            });
        });
    }
    
    // Búsqueda global
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('keyup', debounce((e) => {
            const query = e.target.value.trim();
            if (query.length >= 3) {
                performGlobalSearch(query);
            }
        }, 300));
    }
    
    // Botón de notificaciones
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', () => {
            showNotificationsPanel();
        });
    }
}

/**
 * Verifica la conexión con el servidor
 */
async function checkServerConnection() {
    const statusElement = document.getElementById('serverStatus');
    
    try {
        const response = await api.getStats();
        
        if (response.success) {
            statusElement.textContent = 'Conectado';
            statusElement.previousElementSibling.style.color = '#10b981';
        } else {
            statusElement.textContent = 'Datos de ejemplo';
            statusElement.previousElementSibling.style.color = '#f59e0b';
        }
    } catch (error) {
        statusElement.textContent = 'Sin conexión';
        statusElement.previousElementSibling.style.color = '#ef4444';
    }
    
    // Verificar cada 30 segundos
    setTimeout(checkServerConnection, 30000);
}

/**
 * Búsqueda global
 */
async function performGlobalSearch(query) {
    console.log('🔍 Buscando:', query);
    // TODO: Implementar búsqueda global
    showNotification(`Buscando: ${query}`, 'info');
}

/**
 * Muestra el panel de notificaciones
 */
function showNotificationsPanel() {
    showNotification('Panel de notificaciones en desarrollo', 'info');
}

// ===========================
// Utilidades
// ===========================

/**
 * Actualiza el contenido de un elemento
 */
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

/**
 * Muestra un estado vacío en una tabla
 */
function showEmptyState(selector, message = 'No hay datos disponibles') {
    const container = document.querySelector(selector);
    if (container) {
        container.innerHTML = `
            <tr>
                <td colspan="20" class="no-data">
                    <i class="fas fa-inbox"></i>
                    <p>${message}</p>
                </td>
            </tr>
        `;
    }
}

/**
 * Muestra una notificación
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--dark-card);
        border: 1px solid var(--border-color);
        border-left: 4px solid ${getNotificationColor(type)};
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Formatea una fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Descarga un archivo
 */
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Añadir animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
