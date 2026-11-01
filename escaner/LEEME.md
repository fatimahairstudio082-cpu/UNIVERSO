# Escáner de la biblioteca de cortes (31-10-2026)

El sistema mira cada foto de resultado de corte de la Galería web y calcula la numeración de elevación con el motor de geometría
capilar (`b6_pelu_calculo.js`). Fátima no tiene que escribir los números.

## Reglas (aprobadas por Fátima)
- La forma (recta, redondeada, en U, en V), «con capas / sin capas» y el flequillo los dice su título o su carpeta.
- Sin capas → todo a 0°.
- Con capas → cálculo inverso: capa por capa, el ángulo que deja la punta donde termina en la foto. Las capas nunca bajan de una a la
  siguiente y cada ángulo va al valor suyo más cercano: 0, 25, 35, 45, 90, 120, 135, 180, 200, 220.
- Grupos de largo: corto hasta la barbilla (≈ 19 cm desde lo alto de la cabeza), medio, largo desde media espalda (≈ 45 cm, a validar).
- Solo se mide la vista de atrás. Si solo hay vista de frente: sin capas → 0° y el largo medido de frente (aproximado); con capas → revisión.
- Si la foto no se puede medir y es un corte del curso, se usa ese corte tal cual. Si no, queda para revisión (`revision.md`).

## Cómo se vuelve a escanear (cuando se añaden imágenes)
1. `node escaner/lista.js` — qué imágenes entran (carpetas 10, 35, 39/01 y 40 de la Galería).
2. `python3 -I escaner/medir.py` — mide (separa el cabello con `selfie_segmentation.tflite`, de MediaPipe, Apache 2.0).
3. `node escaner/calcular.js` — numeración, grupo y revisión → `datos.json`.
4. `python3 escaner/maniquies.py <three.min.js>` — maniquí de cada imagen en `referencias/galeria_web/maniqui/` y `b6_pelu_escaner_datos.js`.

Pendiente: pollina y flequillo (carpeta 36) y particiones (carpeta 26).
