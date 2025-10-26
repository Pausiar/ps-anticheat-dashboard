# 🛡️ PS Anticheat Dashboard - GitHub Pages Setup

## 📋 Descripción

Dashboard web profesional para gestionar el sistema PS Anticheat v2.0.0 de forma remota usando **GitHub Pages (100% GRATIS)**.

## 🚀 Configuración de GitHub Pages

### 1. Crear Repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Clic en **"New repository"**
3. Nombre del repositorio: `ps-anticheat-dashboard` (o el que prefieras)
4. Marca como **"Private"** si quieres que sea privado
5. Clic en **"Create repository"**

### 2. Subir el Dashboard a GitHub

```bash
# En PowerShell, navega a la carpeta web
cd "c:\Users\Pau\Desktop\PS_rp\txData\ESXLegacy_C0603C.base\resources\[enPrueba]\.[ps]\ps_anticheat_1.1.0\web"

# Inicializa Git (si no lo has hecho)
git init

# Añade los archivos
git add .

# Haz el commit
git commit -m "Initial dashboard setup"

# Conecta con tu repositorio (cambia TU_USUARIO por tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/ps-anticheat-dashboard.git

# Sube los archivos
git push -u origin main
```

### 3. Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Clic en **"Settings"**
3. En el menú lateral, clic en **"Pages"**
4. En **"Source"**, selecciona **"main"** branch
5. Selecciona la carpeta **"/ (root)"**
6. Clic en **"Save"**
7. **¡Listo!** En unos minutos tu dashboard estará disponible en:
   ```
   https://TU_USUARIO.github.io/ps-anticheat-dashboard/
   ```

## 🔧 Configuración del Servidor FiveM

### 1. Editar `web/js/config.js`

Abre el archivo `web/js/config.js` y modifica:

```javascript
const CONFIG = {
    // Cambia esto por la IP/dominio de tu servidor FiveM
    serverUrl: 'http://TU_IP_SERVIDOR:30120',
    
    // Genera una clave API segura (puedes usar: https://www.uuidgenerator.net/)
    apiKey: 'TU_CLAVE_API_SEGURA_AQUI',
    
    // Resto de configuración...
};
```

### 2. Configurar CORS en el servidor

Añade esto en tu `server.cfg`:

```cfg
# Permitir acceso desde GitHub Pages
set sv_hostname "^2New Gen RP^0"
set sv_endpoints "0.0.0.0:30120"

# CORS Headers (importante para dashboard web)
add_header 'Access-Control-Allow-Origin' 'https://TU_USUARIO.github.io'
add_header 'Access-Control-Allow-Methods' 'GET, POST, DELETE, OPTIONS'
add_header 'Access-Control-Allow-Headers' 'Content-Type, X-API-Key'
```

### 3. Añadir endpoints HTTP en `server/server.lua`

Añade al final de `server/server.lua`:

```lua
-- ===========================
-- HTTP API para Dashboard Web
-- ===========================

local VALID_API_KEY = "TU_CLAVE_API_SEGURA_AQUI" -- Debe coincidir con config.js

-- Middleware de autenticación
local function authenticateRequest(req, res)
    local apiKey = req.headers['x-api-key']
    if apiKey ~= VALID_API_KEY then
        res.send(json.encode({success = false, error = 'Invalid API Key'}))
        return false
    end
    return true
end

-- Endpoint: Obtener estadísticas
SetHttpHandler(function(req, res)
    if req.path == '/ps_anticheat/stats' and req.method == 'GET' then
        if not authenticateRequest(req, res) then return end
        
        res.writeHead(200, {['Content-Type'] = 'application/json'})
        res.send(json.encode({
            success = true,
            data = {
                totalDetections = GetDetectionsCount(),
                totalBans = GetBansCount(),
                totalPlayers = GetPlayersCount(),
                trustScore = GetAverageTrustScore(),
                detectionsToday = GetDetectionsToday(),
                topDetections = GetTopDetections()
            }
        }))
    end
    
    -- Endpoint: Obtener violaciones
    if req.path == '/ps_anticheat/violations' and req.method == 'GET' then
        if not authenticateRequest(req, res) then return end
        
        res.writeHead(200, {['Content-Type'] = 'application/json'})
        res.send(json.encode({
            success = true,
            data = GetViolations()
        }))
    end
    
    -- Endpoint: Obtener bans
    if req.path == '/ps_anticheat/bans' and req.method == 'GET' then
        if not authenticateRequest(req, res) then return end
        
        res.writeHead(200, {['Content-Type'] = 'application/json'})
        res.send(json.encode({
            success = true,
            data = GetBans()
        }))
    end
    
    -- Más endpoints...
end)
```

## 🔒 Seguridad

### Protección con Contraseña (Opcional)

Si quieres añadir una contraseña al dashboard, crea un archivo `web/login.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Login - PS Anticheat</title>
    <style>
        /* Estilos del login */
    </style>
</head>
<body>
    <script>
        const password = prompt("Introduce la contraseña:");
        if (password === "TU_CONTRASEÑA_SEGURA") {
            window.location.href = "index.html";
        } else {
            alert("Contraseña incorrecta");
            window.location.href = "login.html";
        }
    </script>
</body>
</html>
```

## 📱 Acceso desde el Móvil

1. Abre el navegador en tu móvil
2. Ve a: `https://TU_USUARIO.github.io/ps-anticheat-dashboard/`
3. Guarda en marcadores para acceso rápido
4. **Opcional**: Añade a la pantalla de inicio para que funcione como app

## 🎨 Personalización

### Cambiar Colores

Edita `web/css/style.css` en las variables CSS:

```css
:root {
    --primary-color: #667eea;  /* Color principal */
    --secondary-color: #764ba2; /* Color secundario */
    --dark-bg: #0f172a;         /* Fondo oscuro */
    /* ... */
}
```

### Cambiar Logo

Reemplaza el icono en `web/index.html`:

```html
<i class="fas fa-shield-alt"></i> <!-- Cambia por tu icono -->
```

## 🔄 Actualizar el Dashboard

Cuando hagas cambios:

```bash
cd "c:\Users\Pau\Desktop\PS_rp\txData\ESXLegacy_C0603C.base\resources\[enPrueba]\.[ps]\ps_anticheat_1.1.0\web"
git add .
git commit -m "Actualización del dashboard"
git push
```

Los cambios se verán reflejados en 1-2 minutos en GitHub Pages.

## 📊 Características del Dashboard

- ✅ **Dashboard en Tiempo Real** - Estadísticas actualizadas cada 30 segundos
- ✅ **Gestión de Violaciones** - Ver todas las detecciones
- ✅ **Sistema de Bans** - Banear/Desbanear jugadores
- ✅ **Monitoreo de Jugadores** - Trust Score y estadísticas
- ✅ **Control de Detecciones** - Activar/Desactivar sistemas
- ✅ **Logs en Vivo** - Ver actividad del anticheat
- ✅ **Exportación de Datos** - CSV/JSON
- ✅ **Gráficos Interactivos** - Chart.js
- ✅ **Responsive** - Funciona en móvil y PC
- ✅ **Modo Oscuro** - Diseño profesional

## 🆘 Problemas Comunes

### El dashboard no carga datos

1. Verifica que `CONFIG.serverUrl` sea correcto en `config.js`
2. Verifica que `CONFIG.apiKey` coincida en servidor y dashboard
3. Comprueba los CORS headers en `server.cfg`
4. Revisa la consola del navegador (F12) para errores

### GitHub Pages no se actualiza

1. Ve a Settings > Pages en GitHub
2. Cambia a otra branch y vuelve a "main"
3. Espera 5-10 minutos
4. Limpia la caché del navegador (Ctrl + F5)

### Error 404 en GitHub Pages

1. Asegúrate de que `index.html` esté en la raíz del repositorio
2. Verifica que GitHub Pages esté activado correctamente
3. El repositorio debe ser público O tener GitHub Pro para privado

## 💰 Costes

- **GitHub Pages**: ✅ GRATIS (Unlimited sitios estáticos)
- **Servidor FiveM**: Ya lo tienes
- **Dominio Personalizado**: Opcional (~10€/año)

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor FiveM
3. Verifica que todos los archivos se hayan subido correctamente

---

**Desarrollado con ❤️ para New Gen RP**
