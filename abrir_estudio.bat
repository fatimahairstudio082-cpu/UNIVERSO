@echo off
rem Abre Estudio Universal Pro servido por HTTP (con doble clic en file:// el Editorial sale vacio).
cd /d "%~dp0"
set PUERTO=8000
where py >nul 2>nul && (start "" "http://localhost:%PUERTO%/Estudio%%20Universal%%20Pro.dc.html" & py -m http.server %PUERTO% & goto :fin)
where python >nul 2>nul && (start "" "http://localhost:%PUERTO%/Estudio%%20Universal%%20Pro.dc.html" & python -m http.server %PUERTO% & goto :fin)
where npx >nul 2>nul && (start "" "http://localhost:%PUERTO%/Estudio%%20Universal%%20Pro.dc.html" & npx --yes http-server -p %PUERTO% -c-1 & goto :fin)
echo No encuentro Python ni Node. Instala Python desde https://www.python.org/downloads/ (marca "Add to PATH") y vuelve a abrir este archivo.
pause
:fin
