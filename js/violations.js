// ===========================
// Violations Page Logic
// ===========================

let currentViolationsFilters = {};

/**
 * Carga las violaciones
 */
async function loadViolations(filters = {}) {
    try {
        currentViolationsFilters = { ...currentViolationsFilters, ...filters };
        const response = await api.getViolations(currentViolationsFilters);
        
        if (response.success && response.data.length > 0) {
            displayViolations(response.data);
        } else {
            showEmptyState('#violationsTable tbody', 'No se encontraron violaciones');
        }
    } catch (error) {
        console.error('Error cargando violaciones:', error);
        showNotification('Error al cargar violaciones', 'error');
    }
}

/**
 * Muestra las violaciones en la tabla
 */
function displayViolations(violations) {
    const tbody = document.querySelector('#violationsTable tbody');
    tbody.innerHTML = '';
    
    violations.forEach(violation => {
        const row = createViolationRow(violation);
        tbody.appendChild(row);
    });
}

/**
 * Crea una fila de violación
 */
function createViolationRow(violation) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>#${violation.id}</td>
        <td>${formatDate(violation.timestamp)}</td>
        <td>
            <strong>${violation.player || 'Desconocido'}</strong><br>
            <code style="font-size: 0.75rem; color: var(--text-secondary);">${violation.identifier || 'N/A'}</code>
        </td>
        <td><span class="badge">${formatDetectionType(violation.type)}</span></td>
        <td style="max-width: 300px;">${violation.details || 'N/A'}</td>
        <td><span class="badge ${violation.severity}">${violation.severity?.toUpperCase() || 'N/A'}</span></td>
        <td><strong>${violation.action || 'N/A'}</strong></td>
        <td>
            <button class="btn-icon" onclick="viewViolationDetails(${violation.id})" title="Ver detalles">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    
    return row;
}

/**
 * Ver detalles de una violación
 */
function viewViolationDetails(id) {
    showNotification(`Viendo detalles de violación #${id}`, 'info');
    // TODO: Mostrar modal con detalles completos
}

/**
 * Exporta violaciones
 */
async function exportViolations(format = 'json') {
    try {
        const data = await api.exportData('violations', format);
        const filename = `violations_${new Date().toISOString().split('T')[0]}.${format}`;
        downloadFile(data, filename, format === 'json' ? 'application/json' : 'text/csv');
        showNotification('Violaciones exportadas correctamente', 'success');
    } catch (error) {
        console.error('Error exportando:', error);
        showNotification('Error al exportar violaciones', 'error');
    }
}

// Inicializar filtros
document.addEventListener('DOMContentLoaded', () => {
    const typeFilter = document.getElementById('violationTypeFilter');
    const severityFilter = document.getElementById('violationSeverityFilter');
    const dateFilter = document.getElementById('violationDateFilter');
    const exportBtn = document.getElementById('exportViolationsBtn');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', () => {
            loadViolations({ type: typeFilter.value });
        });
    }
    
    if (severityFilter) {
        severityFilter.addEventListener('change', () => {
            loadViolations({ severity: severityFilter.value });
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            loadViolations({ date: dateFilter.value });
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', () => exportViolations('csv'));
    }
});
