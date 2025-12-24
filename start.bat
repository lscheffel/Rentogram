@echo off
REM Script para iniciar o projeto Rentogram
REM Valida se Node.js está instalado, instala dependências se necessário,
REM inicia o backend e frontend, e abre o navegador em localhost:5173

REM Verificar se Node.js está instalado
echo Verificando se Node.js está instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js não está instalado. Instale o Node.js e tente novamente.
    pause
    exit /b 1
)
echo Node.js encontrado.

REM Instalar dependências npm do backend se necessário
if not exist node_modules (
    echo Instalando dependências npm do backend...
    npm install
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependências npm do backend.
        pause
        exit /b 1
    )
    echo Dependências do backend instaladas com sucesso.
) else (
    echo Dependências do backend já instaladas.
)

REM Instalar dependências npm do frontend se necessário
if not exist src\frontend\node_modules (
    echo Instalando dependências npm do frontend...
    cmd /c "cd src\frontend && npm install"
    if %errorlevel% neq 0 (
        echo ERRO: Falha ao instalar dependências npm do frontend.
        pause
        exit /b 1
    )
    echo Dependências do frontend instaladas com sucesso.
) else (
    echo Dependências do frontend já instaladas.
)

REM Iniciar o backend em segundo plano
echo Iniciando o backend...
start "" npm run dev

REM Iniciar o frontend em segundo plano
echo Iniciando o frontend...
start "" cmd /c "cd src\frontend && npm run dev"

REM Aguardar alguns segundos para os servidores iniciarem
timeout /t 10 /nobreak >nul

REM Abrir o navegador em localhost:5173
echo Abrindo navegador em http://localhost:5173...
start http://localhost:5173

echo Script concluído. O backend e frontend devem estar rodando e o navegador aberto.
pause