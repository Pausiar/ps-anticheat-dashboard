// ===========================
// Bans Page Logic
// ===========================

/**
 * Carga la lista de bans
 */
async function loadBans(filters = {}) {
    try {
        const response = await api.getBans(filters);
        
        if (response.success && response.data.length > 0) {
            displayBans(response.data);
        } else {
            showEmptyState('#bansTable tbody', 'No hay bans registrados');
        }
    } catch (error) {
        console.error('Error cargando bans:', error);
        showNotification('Error al cargar bans', 'error');
    }
}

/**
 * Muestra los bans en la tabla
 */
function displayBans(bans) {
    const tbody = document.querySelector('#bansTable tbody');
    tbody.innerHTML = '';
    
    bans.forEach(ban => {
        const row = createBanRow(ban);
        tbody.appendChild(row);
    });
}

/**
 * Crea una fila de ban
 */
function createBanRow(ban) {
    const row = document.createElement('tr');
    
    const identifiers = Array.isArray(ban.identifiers) 
        ? ban.identifiers.slice(0, 2).map(id => `<code>${id}</code>`).join('<br>')
        : '<code>N/A</code>';
    
    row.innerHTML = `
        <td>#${ban.id}</td>
        <td><strong>${ban.player || 'Desconocido'}</strong></td>
        <td style="font-size: 0.75rem;">${identifiers}</td>
        <td style="max-width: 250px;">${ban.reason || 'N/A'}</td>
        <td>${formatDate(ban.banDate)}</td>
        <td>${ban.expires === 'Permanente' ? '<strong>Permanente</strong>' : formatDate(ban.expires)}</td>
        <td>${ban.admin || 'Sistema'}</td>
        <td>
            <button class="btn-icon" onclick="viewBanDetails(${ban.id})" title="Ver detalles">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon" onclick="unbanPlayer('${ban.identifiers[0]}')" title="Desbanear">
                <i class="fas fa-unlock"></i>
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Ver detalles de un ban
 */
function viewBanDetails(id) {
    showNotification(`Viendo detalles de ban #${id}`, 'info');
    // TODO: Modal con detalles
}

/**
 * Desbanear jugador
 */
async function unbanPlayer(identifier) {
    if (!confirm('¿Estás seguro de que quieres desbanear a este jugador?')) {
        return;
    }
    
    try {
        const response = await api.unbanPlayer(identifier);
        
        if (response.success) {
            showNotification('Jugador desbaneado correctamente', 'success');
            loadBans();
        } else {
            showNotification('Error al desbanear jugador', 'error');
        }
    } catch (error) {
        console.error('Error desbaneando:', error);
        showNotification('Error al desbanear jugador', 'error');
    }
}

/**
 * Mostrar modal de ban manual
 */
function showManualBanModal() {
    const modal = document.getElementById('manualBanModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Ocultar modal
 */
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Ban manual
 */
async function performManualBan() {
    const identifier = document.getElementById('banPlayerIdentifier').value;
    const reason = document.getElementById('banReason').value;
    const duration = parseInt(document.getElementById('banDuration').value);
    
    if (!identifier || !reason) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }
    
    try {
        const response = await api.banPlayer({
            identifier,
            reason,
            duration,
            admin: 'Web Dashboard'
        });
        
        if (response.success) {
            showNotification('Jugador baneado correctamente', 'success');
            hideModal('manualBanModal');
            loadBans();
            
            // Limpiar formulario
            document.getElementById('banPlayerIdentifier').value = '';
            document.getElementById('banReason').value = '';
            document.getElementById('banDuration').value = '3600';
        } else {
            showNotification('Error al banear jugador', 'error');
        }
    } catch (error) {
        console.error('Error baneando:', error);
        showNotification('Error al banear jugador', 'error');
    }
}

// Inicializar controles
document.addEventListener('DOMContentLoaded', () => {
    const manualBanBtn = document.getElementById('manualBanBtn');
    const confirmBanBtn = document.getElementById('confirmBanBtn');
    const modalCloses = document.querySelectorAll('.modal-close');
    const banStatusFilter = document.getElementById('banStatusFilter');
    const banSearchInput = document.getElementById('banSearchInput');
    
    if (manualBanBtn) {
        manualBanBtn.addEventListener('click', showManualBanModal);
    }
    
    if (confirmBanBtn) {
        confirmBanBtn.addEventListener('click', performManualBan);
    }
    
    modalCloses.forEach(btn => {
        btn.addEventListener('click', () => hideModal('manualBanModal'));
    });
    
    if (banStatusFilter) {
        banStatusFilter.addEventListener('change', () => {
            loadBans({ status: banStatusFilter.value });
        });
    }
    
    if (banSearchInput) {
        banSearchInput.addEventListener('keyup', debounce((e) => {
            loadBans({ search: e.target.value });
        }, 300));
    }
});
