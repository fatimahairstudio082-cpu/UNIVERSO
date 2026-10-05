# Informe técnico — Biblioteca de dibujos
Estudio Universal Pro · 2 de octubre de 2026 · sustituye al informe del 01-10-2026

## 1. Estado actual
- **76 archivos `b6_lib_*.js`** cargados en `Estudio Universal Pro.dc.html` (tras `b6_modelos.js`) y en `Galería de dibujos.dc.html` (lista `LIBS`).
- **2 202 modelos** en 28 materias. Cada modelo: tres modos (color, 3D, línea), rótulos, introducción, tres preguntas con respuesta y «por qué».
- `MO.agregar()` registra cada modelo en `EU_SVG.visual` (tope 1 por libro, sin repetir).

| Estado | Materias |
| --- | --- |
| 100 (completas) | Panadería, Pastelería, Cocina, Batidos, Peluquería, Matemáticas, Ciencias naturales, Sociales (101), Anatomía, Lengua, Inglés, Física, Química, Biología, Artística (101), Contabilidad |
| 50 (primera entrega) | Música, Tecnología, Educación física, Valores, Religión, Cálculo, Emprendimiento, Marketing digital, Comercio electrónico, Redes sociales, IA desde cero, Idiomas |
| Sin biblioteca | Infantil |

## 2. Hecho en esta sesión
- **Emprendimiento** (`em_`): archivos 2 y 3 nuevos (32 modelos); total 50.
- **Idiomas** (`id_`): `b6_lib_idiomas2.js` nuevo (26 modelos: gramática comparada, uso del diccionario, aprender idiomas, comunicación y cultura); total 50.
- **Marketing, Comercio electrónico, Redes e IA**: ya tenían 50 desde la sesión anterior, pero no estaban enlazados. Ahora cargan en el Estudio y en la Galería.
- Validación (`_valida_lib.js`) de estas seis materias: sin NaN, sin textos fuera del lienzo, sin solapes, sin ids repetidos.
- Peluquería: el recuento real es **100** (no 99). Cerrado.
- Cachés: `?v=1794100000001` (Emprendimiento), `?v=1794100000002` (resto y Galería).
- CLAUDE.md y `Pendientes biblioteca.md` actualizados (Cálculo ya estaba anotado).

## 3. Hallazgo: avisos en bibliotecas antiguas
Al pasar el validador a todas las materias aparecen avisos en las 16 de 100 y en Música y Tecnología. Las de esta sesión salen limpias.

| Materia | Fuera del lienzo | Textos que se pisan | Fallos de dibujo |
| --- | --- | --- | --- |
| Inglés | 2 | 43 | 0 |
| Física | 1 | 22 | 0 |
| Batidos | 3 | 17 | 0 |
| Biología | 8 | 13 | 0 |
| Contabilidad | 6 | 12 | 0 |
| Química | 2 | 5 | **3** |
| Música | 4 | 6 | 0 |
| Peluquería | 4 | 5 | 0 |
| Resto (10) | 1–7 c/u | 0–3 c/u | 0 |

El validador mide el texto de forma aproximada; parte de los solapes pueden ser tablas o rótulos encima de una figura. Hay que revisarlos uno a uno en la Galería. Los 3 fallos de Química son prioritarios (el dibujo no se genera bien en algún modo).

## 4. Pendiente
1. **Infantil**: primera entrega de 50 modelos (no repetir esc_*, inf_contar, val_emociones, tie_*, gm_regla, geo_simetria).
2. **Corregir los avisos** del punto 3, empezando por Química, Inglés y Física.
3. **Ampliar a 100**: las 12 materias que tienen 50.
4. **Comprobar en libros reales**: los modelos ya se registran en el Editorial; falta ensamblar libros (`_test_redes.html` → `AUD()`) y medir que entran, no se repiten y no desbordan. Revisar si el tope de 1 por libro es suficiente en libros de 300 páginas.
5. **Portadas premium → Editorial**: botón «Usar en mi libro».
6. **Auditoría de 300 páginas** por materia.
7. **Carpeta `entrega/` y archivos autocontenidos**: desactualizados. Hay que decidir si se regeneran o se archivan; no se borra nada sin permiso.
