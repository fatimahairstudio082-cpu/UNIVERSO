# Estudio Universal Pro

Aplicación web sin build: se sirve tal cual por HTTP.

## Abrir
- Windows: doble clic en `abrir_estudio.bat`.
- Cualquier sistema: `python3 -m http.server 8000` y abrir `http://localhost:8000/`.
- Sin servidor: `Estudio Universal Pro AUTOCONTENIDO.html` (todo en un archivo).

## Publicar
Subir el contenido de esta carpeta a la raíz del repositorio (rama `main`).
En GitHub Pages o cualquier hosting estático, `index.html` lleva a la app.

## Contenido
- `Estudio Universal Pro.dc.html` — entrada de la aplicación.
- `support.js` — runtime (no editar).
- `b6_*.js` — 163 módulos (ver `CLAUDE.md`).
- `Galería de dibujos.dc.html`, `Portadas premium.dc.html`, `Arquitectura Editorial.dc.html`.
- `_ds/modernist-…/` — estilos de la Galería.
- `docs/` — informes técnicos y auditorías.

## Primer paso en el repositorio
Mover `docs/CLAUDE (renombrar y mover a la raíz).md` a la raíz como `CLAUDE.md`.

## Pendiente conocido
- Descarga en navegadores dentro de apps en Android (Chrome funciona).
- Verificar lecciones del curso premium fuera de Peluquería.
- Borrar guías desde la Galería y límite de espacio de la biblioteca.
