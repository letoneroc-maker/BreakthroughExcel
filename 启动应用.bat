@echo off

:: 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 请先安装Python 3
    pause
    exit /b 1
)

:: 检查是否在正确的目录
if not exist "dist\index.html" (
    echo 请在项目根目录运行此脚本
    pause
    exit /b 1
)

:: 启动本地服务器
echo 正在启动本地服务器...
echo 请在浏览器中打开 http://localhost:8000
echo 按 Ctrl+C 停止服务器
python -m http.server 8000
