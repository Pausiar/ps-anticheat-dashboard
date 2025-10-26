# 🚀 GUÍA RÁPIDA - Dashboard con GitHub Pages

## ⚡ Pasos Rápidos (5 minutos)

### 1️⃣ Preparar GitHub

```bash
# Abre PowerShell y navega a la carpeta web
cd "c:\Users\Pau\Desktop\PS_rp\txData\ESXLegacy_C0603C.base\resources\[enPrueba]\.[ps]\ps_anticheat_1.1.0\web"

# Inicializa Git
git init
git add .
git commit -m "Dashboard inicial"
```

### 2️⃣ Crear Repositorio

1. Ve a https://github.com/new
2. Nombre: `ps-anticheat-dashboard`
3. **IMPORTANTE**: Marca como **Privado** (para seguridad)
4. Clic en "Create repository"

### 3️⃣ Subir Archivos

```bash
# Cambia TU_USUARIO por tu nombre de usuario de GitHub
git remote add origin https://github.com/TU_USUARIO/ps-anticheat-dashboard.git
git branch -M main
git push -u origin main
```

### 4️⃣ Activar GitHub Pages

1. En tu repo, ve a **Settings** > **Pages**
2. En **Source**, selecciona **"main"** branch
3. Carpeta: **"/ (root)"**
4. **Save**
5. Tu dashboard estará en: `https://TU_USUARIO.github.io/ps-anticheat-dashboard/`

---

## 🔧 Configurar Conexión con el Servidor

### Paso 1: Edita `web/js/config.js`

```javascript
const CONFIG = {
    // Cambia por la IP de tu servidor
    serverUrl: 'http://123.456.789.012:30120',
    
    // Genera una clave aquí: https://www.uuidgenerator.net/
    apiKey: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
};
```

### Paso 2: Añade al `fxmanifest.lua`

El archivo `server/http_endpoints.lua` ya está incluido en el fxmanifest ✅

### Paso 3: Cambia la API Key en `server/http_endpoints.lua`

```lua
local VALID_API_KEY = "a1b2c3d4-e5f6-7890-abcd-ef1234567890" -- La misma que en config.js
```

### Paso 4: Configura CORS en `server.cfg`

```cfg
# Permitir acceso desde GitHub Pages
add_header 'Access-Control-Allow-Origin' 'https://TU_USUARIO.github.io'
add_header 'Access-Control-Allow-Methods' 'GET, POST, DELETE, OPTIONS'
add_header 'Access-Control-Allow-Headers' 'Content-Type, X-API-Key'
```

### Paso 5: Reinicia el recurso

```
restart ps_anticheat
```

---

## ✅ Verificar que Funciona

1. Abre el dashboard: `https://TU_USUARIO.github.io/ps-anticheat-dashboard/`
2. Mira la esquina inferior izquierda:
   - 🟢 **Verde "Conectado"** = Funciona perfecto
   - 🟡 **Amarillo "Datos de ejemplo"** = Mostrando datos de prueba
   - 🔴 **Rojo "Sin conexión"** = Revisa configuración

---

## 📱 Usar desde el Móvil

1. Abre Chrome/Safari en tu móvil
2. Ve a: `https://TU_USUARIO.github.io/ps-anticheat-dashboard/`
3. Añade a pantalla de inicio:
   - **Android**: Menú (⋮) > "Añadir a pantalla de inicio"
   - **iOS**: Compartir > "Añadir a pantalla de inicio"

¡Ahora puedes gestionar el anticheat desde cualquier lugar! 🎉

---

## 🔒 Seguridad IMPORTANTE

### ⚠️ NUNCA compartas:
- ❌ Tu API Key
- ❌ La URL de tu dashboard (si es privado)
- ❌ Las credenciales de tu servidor

### ✅ Recomendaciones:
- ✅ Repositorio privado en GitHub
- ✅ API Key única y larga
- ✅ Cambiar la API Key cada mes
- ✅ Monitorear accesos sospechosos

---

## 🆘 Solución de Problemas

### Problema: "Sin conexión"
**Solución:**
1. Verifica que el servidor esté online
2. Comprueba que la API Key sea la misma en ambos archivos
3. Revisa los CORS headers en server.cfg
4. Mira la consola del navegador (F12)

### Problema: "Datos de ejemplo"
**Solución:**
1. La IP del servidor está mal en `config.js`
2. El puerto 30120 puede estar bloqueado por firewall
3. Los endpoints HTTP no están cargados

### Problema: GitHub Pages 404
**Solución:**
1. Espera 5-10 minutos después de activar Pages
2. Asegúrate de que `index.html` esté en la raíz
3. Limpia caché del navegador (Ctrl + Shift + R)

---

## 📊 Funciones del Dashboard

| Función | Descripción |
|---------|-------------|
| 📈 Dashboard | Estadísticas en tiempo real |
| ⚠️ Violaciones | Historial de detecciones |
| 🚫 Bans | Gestionar bans activos |
| 👥 Jugadores | Monitorear trust score |
| 🎯 Detecciones | Activar/desactivar sistemas |
| 📝 Logs | Ver actividad del servidor |
| 📥 Exportar | Descargar datos en CSV/JSON |

---

## 💡 Tips Extra

1. **Favorito en el navegador**: Guarda el dashboard para acceso rápido
2. **Notificaciones**: Configura Discord webhooks para alertas
3. **Actualizaciones**: Sube cambios con `git push`
4. **Backup**: El dashboard está en GitHub, siempre seguro

---

**¿Listo? ¡Empieza ahora! 🚀**
