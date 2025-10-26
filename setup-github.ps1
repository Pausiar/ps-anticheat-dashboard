#!/bin/bash
# Script automatizado para subir el dashboard a GitHub
# Ejecuta esto en PowerShell desde la carpeta web

# IMPORTANTE: Cambia estos valores primero
$GITHUB_USERNAME = "TU_USUARIO_GITHUB"  # Cambia esto por tu usuario de GitHub
$REPO_NAME = "ps-anticheat-dashboard"

# ===========================
# No cambies nada debajo de esta línea
# ===========================

Write-Host "🚀 Configurando dashboard para GitHub Pages..." -ForegroundColor Cyan

# 1. Navegar a la carpeta web
$webPath = "c:\Users\Pau\Desktop\PS_rp\txData\ESXLegacy_C0603C.base\resources\[enPrueba]\.[ps]\ps_anticheat_1.1.0\web"
Set-Location $webPath

# 2. Verificar si Git está instalado
try {
    git --version | Out-Null
    Write-Host "✅ Git instalado" -ForegroundColor Green
} catch {
    Write-Host "❌ Git no está instalado. Descárgalo de: https://git-scm.com/download/win" -ForegroundColor Red
    exit
}

# 3. Inicializar repositorio Git
if (-not (Test-Path ".git")) {
    Write-Host "📁 Inicializando repositorio Git..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositorio inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositorio Git ya existe" -ForegroundColor Green
}

# 4. Añadir archivos
Write-Host "📦 Añadiendo archivos..." -ForegroundColor Yellow
git add .

# 5. Hacer commit
Write-Host "💾 Creando commit..." -ForegroundColor Yellow
git commit -m "Dashboard PS Anticheat v2.0.0 - Configuración inicial"

# 6. Configurar remote (si no existe)
$remoteUrl = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
try {
    git remote get-url origin | Out-Null
    Write-Host "✅ Remote ya configurado" -ForegroundColor Green
} catch {
    Write-Host "🔗 Configurando remote..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
    Write-Host "✅ Remote configurado: $remoteUrl" -ForegroundColor Green
}

# 7. Cambiar a rama main
Write-Host "🌿 Cambiando a rama main..." -ForegroundColor Yellow
git branch -M main

# 8. Información final
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ TODO LISTO PARA SUBIR A GITHUB" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 PASOS FINALES:`n" -ForegroundColor Yellow

Write-Host "1️⃣  Crea el repositorio en GitHub:" -ForegroundColor White
Write-Host "   👉 Ve a: https://github.com/new" -ForegroundColor Cyan
Write-Host "   👉 Nombre: $REPO_NAME" -ForegroundColor Cyan
Write-Host "   👉 Marca como PRIVADO (para seguridad)" -ForegroundColor Red
Write-Host "   👉 NO marques 'Add README' ni nada más" -ForegroundColor Red
Write-Host "   👉 Clic en 'Create repository'`n" -ForegroundColor Cyan

Write-Host "2️⃣  Ejecuta este comando para subir:" -ForegroundColor White
Write-Host "   git push -u origin main`n" -ForegroundColor Green

Write-Host "3️⃣  Activa GitHub Pages:" -ForegroundColor White
Write-Host "   👉 En tu repo, ve a Settings > Pages" -ForegroundColor Cyan
Write-Host "   👉 Source: main branch" -ForegroundColor Cyan
Write-Host "   👉 Folder: / (root)" -ForegroundColor Cyan
Write-Host "   👉 Save`n" -ForegroundColor Cyan

Write-Host "4️⃣  Tu dashboard estará en:" -ForegroundColor White
Write-Host "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/`n" -ForegroundColor Green

Write-Host "========================================`n" -ForegroundColor Cyan

# Preguntar si quiere hacer push ahora
$response = Read-Host "¿Ya creaste el repositorio en GitHub? (s/n)"
if ($response -eq "s" -or $response -eq "S") {
    Write-Host "`n🚀 Subiendo a GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    Write-Host "`n✅ ¡SUBIDO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "Ahora ve a activar GitHub Pages en Settings > Pages" -ForegroundColor Yellow
} else {
    Write-Host "`n⏸️  No hay problema. Cuando crees el repo, ejecuta:" -ForegroundColor Yellow
    Write-Host "   git push -u origin main`n" -ForegroundColor Green
}

Write-Host "📚 Lee SETUP_RAPIDO.md para más instrucciones" -ForegroundColor Cyan
