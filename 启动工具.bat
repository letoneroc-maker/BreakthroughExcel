@echo off
chcp 65001 >nul
echo ==========================================
echo      Excel数据分析工具
echo ==========================================
echo.
echo 正在启动工具...
echo.
start "Excel数据分析工具" "%~dp0dist\index.html"
echo.
echo 工具已在浏览器中打开！
echo.
echo 如果没有自动打开，请手动双击 dist/index.html 文件
echo.
pause
