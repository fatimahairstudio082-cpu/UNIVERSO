repo: fatimahairstudio082-cpu/aprendizajefatima.fatimahairstudio082.com
branch: main

## Last sync
date: 2026-09-02T00:00:00Z
rama: claude/system-design-k3rcxv (pendiente de fusionar en main)

### Subido al repositorio en esta sincronización
- Los **once módulos** que el repositorio no tenía: `b6_cerebro.js`, `b6_cortes.js`,
  `b6_divisiones.js`, `b6_guias_3d.js`, `b6_estudios.js`, `b6_voz.js`, `b6_bandeja.js`,
  `b6_examen.js`, `b6_volantes.js`, `b6_laminas_motor.js`, `b6_laminas_disenos.js`.
- Entran con nombre propio y **nadie los carga todavía**: no tocan nada de lo que ya funciona.

### Pendiente de decidir antes de seguir
- `b6_folleto_motor.js` y `b6_folleto_disenos.js` de aquí son más nuevos que los del
  repositorio (troqueles de celda y 30 estilos «Tendencia»). Se llaman **igual** que los
  del repositorio y `bloque6_herramientas.html` también los carga: sustituirlos toca el
  Bloque 6. Van los dos juntos o ninguno.
- El archivo de entrada (`Estudio Universal Pro.dc.html`) es React sobre `support.js` y
  **no se puede copiar** al repositorio, que es HTML plano: hay que reescribir el armazón.
- Aquí no se usa Firebase: todo va a `localStorage`. El repositorio sí tiene contrato con
  `usuarios/{uid}.plan`, `.marca` y `proyectos/{uid}/items/{id}`.
- `b6_folleto_cerebro.js` es byte a byte idéntico al del repositorio. No hay que tocarlo.

## Screen map
Doce pestañas montadas. La columna de la derecha es el archivo del repositorio que le
corresponde, cuando existe.

| Pestaña del proyecto | Archivos del repo |
| --- | --- |
| Estudio Universal Pro.dc.html · armazón, pestañas, estilos | estudio_universal.html |
| 🗂 Plantillas (P1) | eu_parrilla.js, b6_folleto_disenos.js |
| ✏️ Editor (P2) | eu_editor.js, b6_folleto_motor.js, b6_folleto_cerebro.js |
| 📐 Tríptico | — (construido aquí; falta la pantalla en el repositorio) |
| 🎠 Carrusel | — (construido aquí; falta la pantalla en el repositorio) |
| 🎬 Vídeo (P3) | eu_video3d.js · aquí lo mueve b6_voz.js |
| 🧠 Láminas | — (b6_laminas_motor.js, b6_laminas_disenos.js ya subidos) |
| ✅ Repaso | — (b6_examen.js ya subido) |
| 💇 Guías 3D | — (b6_guias_3d.js, b6_cerebro.js, b6_divisiones.js, b6_cortes.js ya subidos) |
| 💄 Estudios | — (b6_estudios.js ya subido) |
| 🔳 QR (P4) | eu_qr.js |
| 📁 Míos (P5) | eu_proyectos.js |
| 💜 Plan (P9) | eu_plan.js, LEEME_ESTUDIO_UNIVERSAL.md |

## Nota de mantenimiento
`b6_voz.js` aparece **dos veces** en el `<helmet>` del archivo de entrada. No rompe nada
—el módulo se protege con `window._B6_VOZ`— pero es una petición de red de más. Al tocar
el helmet la próxima vez, borrar la línea repetida.
