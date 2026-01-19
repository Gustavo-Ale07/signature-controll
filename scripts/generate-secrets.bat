@echo off
REM Script para gerar chaves de criptografia e secrets no Windows

echo ===================================
echo SmiloVault - Gerador de Secrets
echo ===================================
echo.

echo 1. Chave de Criptografia (ENCRYPTION_KEY):
echo    Use este valor no arquivo .env
echo.
node -e "console.log('   ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('base64'))"
echo.

echo 2. Session Secret (SESSION_SECRET):
echo    Use este valor no arquivo .env
echo.
node -e "console.log('   SESSION_SECRET=' + require('crypto').randomBytes(48).toString('base64'))"
echo.

echo ===================================
echo Copie os valores acima para seu arquivo .env
echo ===================================
pause
