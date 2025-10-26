@echo off
chcp 65001 >nul
echo.
echo ========================================
echo 🚀 SETUP GITHUB PAGES - PS ANTICHEAT
echo ========================================
echo.

cd /d "c:\Users\Pau\Desktop\PS_rp\txData\ESXLegacy_C0603C.base\resources\[enPrueba]\.[ps]\ps_anticheat_1.1.0\web"

echo 📁 Ubicación: %CD%
echo.

echo 🔍 Verificando Git...
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Git no está instalado
    echo Descarga Git de: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✅ Git instalado
echo.

echo 📦 Inicializando repositorio Git...
if exist ".git" (
    echo ℹ️ Repositorio ya existe, limpiando...
    rmdir /s /q ".git" 2>nul
)
git init
git branch -M main
echo.

echo 📝 Añadiendo archivos...
git add .
echo.

echo 💾 Creando commit...
git commit -m "PS Anticheat Dashboard v2.0.0 - Configuración inicial"
echo.

echo 🔗 Configurando repositorio remoto...
git remote add origin https://github.com/Pausiar/ps-anticheat-dashboard.git
echo.

echo ========================================
echo ✅ CONFIGURACIÓN COMPLETADA
echo ========================================
echo.

echo 📋 PRÓXIMOS PASOS:
echo.
echo 1️⃣ Crear repositorio en GitHub:
echo    👉 Ve a: https://github.com/new
echo    👉 Nombre: ps-anticheat-dashboard
echo    👉 Privado: SÍ
echo    👉 Create repository
echo.
echo 2️⃣ ¿Ya creaste el repositorio? (Presiona cualquier tecla para continuar)
pause >nul

echo.
echo 🚀 Subiendo archivos a GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 🎉 ¡SUBIDO EXITOSAMENTE!
    echo ========================================
    echo.
    echo 3️⃣ Ahora activa GitHub Pages:
    echo    1. Ve a: https://github.com/Pausiar/ps-anticheat-dashboard/settings/pages
    echo    2. Source: Deploy from a branch
    echo    3. Branch: main
    echo    4. Folder: / ^(root^)
    echo    5. Save
    echo.
    echo 4️⃣ Tu dashboard estará en:
    echo    https://Pausiar.github.io/ps-anticheat-dashboard/
    echo.
    echo ⏱️ Espera 2-5 minutos para que se active
    echo.
    
    set /p openPages="¿Abrir configuración de Pages ahora? (s/n): "
    if /i "%openPages%"=="s" (
        start https://github.com/Pausiar/ps-anticheat-dashboard/settings/pages
    )
) else (
    echo.
    echo ❌ Error al subir archivos
    echo Verifica que el repositorio exista en GitHub
    echo.
)

echo.
echo ========================================
echo 📚 Lee SETUP_RAPIDO.md para más ayuda
echo ========================================
echo.
pause
