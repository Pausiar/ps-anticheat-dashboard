# ========================================
# 🚀 SETUP AUTOMÁTICO GITHUB PAGES
# ========================================
# 
# ANTES DE EJECUTAR:
# 1. Cambia TU_USUARIO_GITHUB por tu usuario real de GitHub
# 2. Ve a https://github.com/new y crea un repositorio llamado: ps-anticheat-dashboard
# 3. Márcalo como PRIVADO
# 4. NO marques "Add README" ni nada
# 5. Clic en "Create repository"
# 6. LUEGO ejecuta este script
#

# ========================================
# ⚙️ CONFIGURACIÓN - CÁMBIALO AQUÍ
# ========================================
$GITHUB_USERNAME = "Pausiar"  # 👈 CAMBIA ESTO
$REPO_NAME = "ps-anticheat-dashboard"

# ========================================
# 📦 SCRIPT AUTOMÁTICO
# ========================================

Write-Host "`n🚀 Configurando GitHub Pages para PS Anticheat Dashboard" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verificar que cambió el usuario
if ($GITHUB_USERNAME -eq "TU_USUARIO_GITHUB") {
    Write-Host "❌ ERROR: Debes cambiar TU_USUARIO_GITHUB en la línea 13 del script`n" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit
}

# Verificar Git
Write-Host "🔍 Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git instalado: $gitVersion`n" -ForegroundColor Green
} catch {
    Write-Host "❌ Git no está instalado" -ForegroundColor Red
    Write-Host "Descarga Git de: https://git-scm.com/download/win`n" -ForegroundColor Yellow
    Read-Host "Presiona Enter para abrir la página de descarga"
    Start-Process "https://git-scm.com/download/win"
    exit
}

# Navegar a la carpeta correcta
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "📁 Ubicación: $scriptPath`n" -ForegroundColor Green

# Inicializar Git
if (Test-Path ".git") {
    Write-Host "ℹ️  Repositorio Git ya existe, limpiando..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
}

Write-Host "📦 Inicializando repositorio Git..." -ForegroundColor Yellow
git init
git branch -M main

# Añadir archivos
Write-Host "📝 Añadiendo archivos al repositorio..." -ForegroundColor Yellow
git add .

# Commit
Write-Host "💾 Creando commit inicial..." -ForegroundColor Yellow
git commit -m "PS Anticheat Dashboard v2.0.0 - Configuración inicial"

# Configurar remote
$remoteUrl = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
Write-Host "🔗 Configurando repositorio remoto..." -ForegroundColor Yellow
git remote add origin $remoteUrl

# Mostrar resumen
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "📋 PRÓXIMOS PASOS:`n" -ForegroundColor Cyan

Write-Host "1️⃣  ¿Ya creaste el repositorio en GitHub?" -ForegroundColor Yellow
Write-Host "    👉 Si NO, ve a: https://github.com/new" -ForegroundColor White
Write-Host "    👉 Nombre: $REPO_NAME" -ForegroundColor White
Write-Host "    👉 Privado: SÍ ✅" -ForegroundColor White
Write-Host "    👉 Create repository`n" -ForegroundColor White

$response = Read-Host "¿Ya está creado el repositorio en GitHub? (s/n)"

if ($response -eq "s" -or $response -eq "S") {
    Write-Host "`n🚀 Subiendo archivos a GitHub..." -ForegroundColor Cyan
    Write-Host "Esto puede tardar unos segundos...`n" -ForegroundColor Yellow
    
    try {
        git push -u origin main 2>&1
        
        Write-Host "`n========================================" -ForegroundColor Green
        Write-Host "🎉 ¡SUBIDO EXITOSAMENTE!" -ForegroundColor Green
        Write-Host "========================================`n" -ForegroundColor Green
        
        Write-Host "2️⃣  Ahora activa GitHub Pages:" -ForegroundColor Yellow
        Write-Host "    1. Ve a: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages" -ForegroundColor White
        Write-Host "    2. Source: Deploy from a branch" -ForegroundColor White
        Write-Host "    3. Branch: main" -ForegroundColor White
        Write-Host "    4. Folder: / (root)" -ForegroundColor White
        Write-Host "    5. Save`n" -ForegroundColor White
        
        Write-Host "3️⃣  Tu dashboard estará disponible en:" -ForegroundColor Yellow
        Write-Host "    https://$GITHUB_USERNAME.github.io/$REPO_NAME/`n" -ForegroundColor Green
        
        Write-Host "⏱️  Espera 2-5 minutos para que GitHub Pages se active`n" -ForegroundColor Cyan
        
        $openPages = Read-Host "¿Abrir la página de configuración de Pages ahora? (s/n)"
        if ($openPages -eq "s" -or $openPages -eq "S") {
            Start-Process "https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
        }
        
    } catch {
        Write-Host "`n❌ Error al subir archivos" -ForegroundColor Red
        Write-Host "Verifica que el repositorio exista en GitHub`n" -ForegroundColor Yellow
        Write-Host "Error: $_`n" -ForegroundColor Red
    }
    
} else {
    Write-Host "`n⏸️  No hay problema. Después de crear el repositorio, ejecuta:" -ForegroundColor Yellow
    Write-Host "    git push -u origin main`n" -ForegroundColor Green
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📚 Lee SETUP_RAPIDO.md para más ayuda" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

Read-Host "Presiona Enter para salir"
