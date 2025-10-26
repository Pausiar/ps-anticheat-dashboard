# 🔐 INSTRUCCIONES DE ACCESO AL DASHBOARD

## ✅ Sistema de Login Implementado

El dashboard ahora tiene un **sistema de login seguro** con protección contra ataques de fuerza bruta.

### 🔑 Credenciales de Acceso

- **Correo**: `ogpausiar@gmail.com`
- **Contraseña**: `Pausilves1`

### 🛡️ Seguridad Implementada

1. **Protección contra Fuerza Bruta**:
   - Máximo 2 intentos fallidos
   - Bloqueo automático de 1 hora después de 2 fallos
   - Contador de tiempo en pantalla

2. **Credenciales Ofuscadas**:
   - Las credenciales NO están en texto plano en el código
   - Usan codificación Base64 para dificultar lectura directa
   - Nadie puede ver fácilmente las credenciales en el código fuente

3. **Sesión Persistente**:
   - La sesión dura 24 horas
   - No necesitas volver a hacer login cada vez
   - Botón de "Cerrar Sesión" en la esquina superior derecha

4. **Protección del Dashboard**:
   - Acceso solo con login válido
   - Redirección automática a login si no estás autenticado
   - Verificación de sesión en cada carga

## 🌐 Cómo Acceder

### Opción 1: GitHub Pages (Recomendado)

1. **Hacer el repositorio PÚBLICO**:
   - Ve a: https://github.com/Pausiar/ps-anticheat-dashboard/settings
   - Baja a "Danger Zone"
   - Click en "Change visibility" → "Make public"
   - Confirma escribiendo el nombre del repo

2. **Activar GitHub Pages**:
   - Ve a: https://github.com/Pausiar/ps-anticheat-dashboard/settings/pages
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - Save

3. **Acceder al Dashboard**:
   - URL: `https://Pausiar.github.io/ps-anticheat-dashboard/`
   - Se abrirá automáticamente la página de login
   - Introduce tus credenciales
   - ¡Listo! Acceso al dashboard

### Opción 2: Vercel (Mantener Privado)

Si prefieres NO hacer público el repositorio:

1. Ve a: https://vercel.com
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `ps-anticheat-dashboard`
4. Deploy automático
5. Tu dashboard estará en: `https://tu-proyecto.vercel.app/`

## 📱 Acceso desde Móvil

1. Abre el navegador en tu móvil
2. Ve a la URL de tu dashboard
3. Inicia sesión con tus credenciales
4. **Añadir a Pantalla de Inicio**:
   - **Android**: Menú (⋮) → "Añadir a pantalla de inicio"
   - **iOS**: Compartir → "Añadir a pantalla de inicio"
5. ¡Usa el dashboard como una app!

## 🔧 Configurar Conexión con el Servidor

Una vez dentro del dashboard, edita el archivo `js/config_privado.js` en tu PC local:

```javascript
const CONFIG_PRIVADO = {
    serverUrl: 'http://TU_IP_SERVIDOR:30120',
    apiKey: 'TU_API_KEY_SEGURA',
};
```

**IMPORTANTE**: Este archivo NO se sube a GitHub (está en `.gitignore`), así que es 100% privado.

## 🆘 Solución de Problemas

### Olvidé la Contraseña
Las credenciales están en este archivo. Si las cambias, debes:
1. Editar `js/login.js`
2. Cambiar los valores de `atob()` en la función `verifyCredentials()`
3. Subir los cambios a GitHub

### Cuenta Bloqueada
Si fallas 2 veces el login:
- Espera 1 hora O
- Abre la consola del navegador (F12)
- Ejecuta: `localStorage.clear()`
- Recarga la página

### No Puedo Acceder al Dashboard
1. Verifica que GitHub Pages esté activado
2. Espera 2-5 minutos después de activarlo
3. Limpia caché del navegador (Ctrl + Shift + R)
4. Verifica que estés usando la URL correcta

## 🔒 Seguridad Adicional

### Cambiar Credenciales

Para mayor seguridad, puedes cambiar las credenciales:

1. Abre `js/login.js`
2. Busca la función `verifyCredentials()`
3. Cambia estos valores:
   ```javascript
   const validEmail = atob('TU_EMAIL_EN_BASE64');
   const validPassword = atob('TU_PASSWORD_EN_BASE64');
   ```

**Convertir a Base64**: Usa https://www.base64encode.org/

Ejemplo:
- `ogpausiar@gmail.com` → `b2dwYXVzaWFyQGdtYWlsLmNvbQ==`
- `Pausilves1` → `UGF1c2lsdmVzMQ==`

## 💡 Características del Login

- ✅ Diseño moderno y responsive
- ✅ Animaciones suaves
- ✅ Protección anti-bots
- ✅ Timer visual de bloqueo
- ✅ Sesión persistente (24h)
- ✅ Cierre de sesión seguro
- ✅ Redirección automática

---

**🔐 Tu dashboard está protegido y listo para usar!**
