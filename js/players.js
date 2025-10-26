// ===========================
// Players Page Logic
// ===========================

/**
 * Carga la lista de jugadores
 */
async function loadPlayers(filters = {}) {
    try {
        const response = await api.getPlayers(filters);
        
        if (response.success && response.data.length > 0) {
            displayPlayers(response.data);
        } else {
            showEmptyState('#playersTable tbody', 'No hay jugadores registrados');
        }
    } catch (error) {
        console.error('Error cargando jugadores:', error);
        showNotification('Error al cargar jugadores', 'error');
    }
}

/**
 * Muestra jugadores en la tabla
 */
function displayPlayers(players) {
    const tbody = document.querySelector('#playersTable tbody');
    tbody.innerHTML = '';
    
    players.forEach(player => {
        const row = createPlayerRow(player);
        tbody.appendChild(row);
    });
}

/**
 * Crea una fila de jugador
 */
function createPlayerRow(player) {
    const row = document.createElement('tr');
    
    const trustScoreClass = getTrustScoreClass(player.trustScore);
    const identifiers = Array.isArray(player.identifiers)
        ? player.identifiers.slice(0, 2).map(id => `<code>${id}</code>`).join('<br>')
        : '<code>N/A</code>';
    
    row.innerHTML = `
        <td><strong>${player.name || 'Desconocido'}</strong></td>
        <td style="font-size: 0.75rem;">${identifiers}</td>
        <td>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="flex: 1; background: var(--dark-bg); border-radius: 9999px; height: 8px; overflow: hidden;">
                    <div style="width: ${player.trustScore}%; height: 100%; background: ${trustScoreClass.color}; transition: width 0.3s;"></div>
                </div>
                <span class="badge ${trustScoreClass.class}">${player.trustScore || 0}%</span>
            </div>
        </td>
        <td>${player.violations || 0}</td>
        <td>${player.playtime || '0h 0m'}</td>
        <td>${formatDate(player.lastSeen)}</td>
        <td>
            <button class="btn-icon" onclick="viewPlayerDetails('${player.identifiers[0]}')" title="Ver detalles">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" onclick="banPlayerFromList('${player.identifiers[0]}')" title="Banear">
                <i class="fas fa-ban"></i>
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Obtiene la clase del trust score
 */
function getTrustScoreClass(score) {
    if (score >= 80) {
        return { class: 'low', color: '#10b981' };
    } else if (score >= 50) {
        return { class: 'medium', color: '#f59e0b' };
    } else {
        return { class: 'critical', color: '#ef4444' };
    }
}

/**
 * Ver detalles de jugador
 */
function viewPlayerDetails(identifier) {
    showNotification(`Viendo detalles de jugador`, 'info');
    // TODO: Modal con historial completo
}

/**
 * Banear jugador desde la lista
 */
function banPlayerFromList(identifier) {
    // Pre-llenar modal de ban
    document.getElementById('banPlayerIdentifier').value = identifier;
    showManualBanModal();
}

// Inicializar filtros
document.addEventListener('DOMContentLoaded', () => {
    const playerTrustFilter = document.getElementById('playerTrustFilter');
    const playerSearchInput = document.getElementById('playerSearchInput');
    
    if (playerTrustFilter) {
        playerTrustFilter.addEventListener('change', () => {
            const value = playerTrustFilter.value;
            let filter = {};
            
            if (value === 'high') filter.minTrust = 80;
            else if (value === 'medium') { filter.minTrust = 50; filter.maxTrust = 80; }
            else if (value === 'low') filter.maxTrust = 50;
            
            loadPlayers(filter);
        });
    }
    
    if (playerSearchInput) {
        playerSearchInput.addEventListener('keyup', debounce((e) => {
            loadPlayers({ search: e.target.value });
        }, 300));
    }
});
