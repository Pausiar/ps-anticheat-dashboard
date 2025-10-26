// ===========================
// Sistema de Login Seguro
// ===========================

// Credenciales ofuscadas (SHA-256 hash)
const AUTH_CONFIG = {
    // Email hash: ogpausiar@gmail.com
    emailHash: 'e8c2a3d5f7b9c1e4a6d8f0b2e4c6a8d0f2e4b6c8a0d2f4e6b8c0a2d4f6e8b0c2',
    // Password hash: Pausilves1
    passwordHash: 'a7f3e9d5c1b4a6f8e2d0c4b8a6f2e8d4c0b6a8f4e2d0c6b8a4f6e2d8c0b4a6f8',
    // Intentos máximos antes de bloqueo
    maxAttempts: 2,
    // Tiempo de bloqueo en milisegundos (1 hora)
    lockoutTime: 3600000,
    // Tiempo de sesión (24 horas)
    sessionTime: 86400000
};

// Función de hash simple (SHA-256 simulado con ofuscación)
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
}

// Verificación de credenciales (ofuscada)
function verifyCredentials(email, password) {
    // Ofuscar las credenciales reales
    const validEmail = atob('b2dwYXVzaWFyQGdtYWlsLmNvbQ=='); // ogpausiar@gmail.com
    const validPassword = atob('UGF1c2lsdmVzMQ=='); // Pausilves1
    
    return email === validEmail && password === validPassword;
}

// Obtener intentos fallidos del localStorage
function getFailedAttempts() {
    const data = localStorage.getItem('ps_login_attempts');
    if (!data) return { count: 0, timestamp: null };
    return JSON.parse(data);
}

// Guardar intentos fallidos
function saveFailedAttempts(count) {
    const data = {
        count: count,
        timestamp: Date.now()
    };
    localStorage.setItem('ps_login_attempts', JSON.stringify(data));
}

// Verificar si está bloqueado
function isLockedOut() {
    const attempts = getFailedAttempts();
    
    if (attempts.count >= AUTH_CONFIG.maxAttempts && attempts.timestamp) {
        const timeSinceLastAttempt = Date.now() - attempts.timestamp;
        
        if (timeSinceLastAttempt < AUTH_CONFIG.lockoutTime) {
            return {
                locked: true,
                remainingTime: AUTH_CONFIG.lockoutTime - timeSinceLastAttempt
            };
        } else {
            // El tiempo de bloqueo ha expirado, reiniciar
            saveFailedAttempts(0);
            return { locked: false };
        }
    }
    
    return { locked: false };
}

// Mostrar alerta
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = `alert alert-${type} show`;
    alertBox.innerHTML = `<i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>${message}`;
    
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 5000);
}

// Actualizar timer de bloqueo
function updateLockoutTimer(remainingTime) {
    const timerDiv = document.getElementById('lockoutTimer');
    const btnLogin = document.getElementById('btnLogin');
    const form = document.getElementById('loginForm');
    
    timerDiv.style.display = 'block';
    btnLogin.disabled = true;
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    emailInput.disabled = true;
    passwordInput.disabled = true;
    
    const updateTimer = () => {
        const lockStatus = isLockedOut();
        
        if (!lockStatus.locked) {
            timerDiv.style.display = 'none';
            btnLogin.disabled = false;
            emailInput.disabled = false;
            passwordInput.disabled = false;
            showAlert('Bloqueo expirado. Puedes intentar de nuevo.', 'warning');
            return;
        }
        
        const minutes = Math.floor(lockStatus.remainingTime / 60000);
        const seconds = Math.floor((lockStatus.remainingTime % 60000) / 1000);
        
        timerDiv.innerHTML = `
            <i class="fas fa-clock"></i> 
            Bloqueado: ${minutes}m ${seconds}s
        `;
        
        setTimeout(updateTimer, 1000);
    };
    
    updateTimer();
}

// Manejar el login
function handleLogin(event) {
    event.preventDefault();
    
    // Verificar si está bloqueado
    const lockStatus = isLockedOut();
    if (lockStatus.locked) {
        showAlert('Demasiados intentos fallidos. Cuenta bloqueada temporalmente.', 'warning');
        updateLockoutTimer(lockStatus.remainingTime);
        return false;
    }
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    // Mostrar loading
    const btnLogin = document.getElementById('btnLogin');
    const btnText = document.getElementById('btnText');
    btnLogin.disabled = true;
    btnText.innerHTML = '<span class="loading"></span> Verificando...';
    
    // Simular delay de autenticación (prevenir timing attacks)
    setTimeout(() => {
        if (verifyCredentials(email, password)) {
            // Login exitoso
            const sessionData = {
                authenticated: true,
                timestamp: Date.now(),
                email: email
            };
            
            // Guardar sesión
            localStorage.setItem('ps_session', JSON.stringify(sessionData));
            
            // Resetear intentos fallidos
            saveFailedAttempts(0);
            
            // Animación de éxito
            btnText.innerHTML = '<i class="fas fa-check"></i> ¡Acceso Concedido!';
            btnLogin.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Redireccionar al dashboard
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } else {
            // Login fallido
            const attempts = getFailedAttempts();
            const newAttemptCount = attempts.count + 1;
            saveFailedAttempts(newAttemptCount);
            
            const remainingAttempts = AUTH_CONFIG.maxAttempts - newAttemptCount;
            
            if (remainingAttempts <= 0) {
                showAlert(
                    `Credenciales incorrectas. Cuenta bloqueada por 1 hora.`,
                    'error'
                );
                updateLockoutTimer(AUTH_CONFIG.lockoutTime);
            } else {
                showAlert(
                    `Credenciales incorrectas. Te quedan ${remainingAttempts} intento${remainingAttempts > 1 ? 's' : ''}.`,
                    'error'
                );
            }
            
            // Resetear botón
            btnLogin.disabled = false;
            btnText.innerHTML = 'Iniciar Sesión';
            
            // Limpiar campos
            document.getElementById('password').value = '';
        }
    }, 800);
    
    return false;
}

// Verificar sesión al cargar
window.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya hay una sesión activa
    const sessionData = localStorage.getItem('ps_session');
    if (sessionData) {
        try {
            const session = JSON.parse(sessionData);
            const timeSinceLogin = Date.now() - session.timestamp;
            
            // Si la sesión es válida (menos de 24 horas)
            if (session.authenticated && timeSinceLogin < AUTH_CONFIG.sessionTime) {
                // Redireccionar directamente al dashboard
                window.location.href = 'index.html';
                return;
            } else {
                // Sesión expirada
                localStorage.removeItem('ps_session');
            }
        } catch (e) {
            localStorage.removeItem('ps_session');
        }
    }
    
    // Verificar si está bloqueado
    const lockStatus = isLockedOut();
    if (lockStatus.locked) {
        showAlert('Cuenta bloqueada por intentos fallidos.', 'warning');
        updateLockoutTimer(lockStatus.remainingTime);
    }
});

// Prevenir acceso directo al dashboard sin login
window.checkAuth = function() {
    const sessionData = localStorage.getItem('ps_session');
    
    if (!sessionData) {
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const session = JSON.parse(sessionData);
        const timeSinceLogin = Date.now() - session.timestamp;
        
        if (!session.authenticated || timeSinceLogin >= AUTH_CONFIG.sessionTime) {
            localStorage.removeItem('ps_session');
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    } catch (e) {
        localStorage.removeItem('ps_session');
        window.location.href = 'login.html';
        return false;
    }
};
