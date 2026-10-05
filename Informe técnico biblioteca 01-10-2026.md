# Informe técnico — Biblioteca de dibujos y Editorial
Estudio Universal Pro · 1 de octubre de 2026

## 1. Qué hay

### 1.1 Biblioteca de modelos vectoriales (`b6_modelos.js` + 34 archivos `b6_lib_*.js`)
Un modelo se define una vez y se pinta en tres modos con el kit `K`: `color` (2D), `3d` (degradado, canto, sombra) y `linea` (para colorear). Cada modelo trae título, rótulos, introducción, tres preguntas con respuesta y «por qué». ViewBox 200×150. Exporta SVG, PNG a 300 ppp y PDF carta (jsPDF).

| Materia (id) | Archivos | Modelos | Visible también en | Prefijo |
| --- | --- | --- | --- | --- |
| Panadería (`panaderia`) | panaderia 1–3 | 100 | — | `pn_` |
| Pastelería (`pasteleria`) | pasteleria 1–3 | 100 | — | `ps_` |
| Cocina (`cocina`) | cocina 1–3 | 100 | `reposteria` | `co_` |
| Batidos (`batidos`) | batidos 1–3 | 100 | `cocina` | `bt_` |
| Peluquería (`pelu`) | peluqueria 1–4 | 100 | — | `pe_` |
| Matemáticas (`mate`) | matematicas 1–3 | 100 | `geoalg` | `ma_` |
| Ciencias naturales (`natu`) | ciencias 1–3 | 100 | — | `cn_` |
| Ciencias sociales (`soci`) | sociales 1–3 | 101 | `geografia` | `cs_` |
| Anatomía (`anat`) | anatomia 1–3 | 100 | `bio` | `an_` |
| Lengua (`lengua`) | lengua 1–3 | 100 | — | `le_` |
| Inglés (`ingles`) | ingles 1–3 | 100 | — | `in_` |
| **Total** | **34** | **1 101** | | |

### 1.2 Conexión con el Editorial (ya hecha)
- `MO.agregar()` registra cada modelo en `EU_SVG.visual(id, gen, { materias, max: 1, libro: 1, unico: 1 })`. El Editorial (`b6_editorial.js` → `<editorial-escolar>`, motor `b6_editorial_motor.js`) los usa en láminas, aperturas, «Cerca de ti» y rellenos de su materia, con un máximo de uno por libro y sin repetir.
- Libro para colorear: página `col_modelo` (línea + miniatura en color) y una opción `mod_<materia>` por cada materia de la biblioteca.
- Orden de carga en `Estudio Universal Pro.dc.html`: `b6_cerebro_svg.js` → … → `b6_apertura_dibujo.js` → `b6_modelos.js` → `b6_lib_*.js` → materias de adultos → `b6_relleno_total.js` → `b6_portada_edicion.js`. **No cambiar**: `b6_modelos.js` necesita `EU_SVG` y `EU_EDITORIAL` ya cargados.
- `Galería de dibujos.dc.html`: revisión de todas las materias, modos y exportación. Lista `LIBS` en su lógica.

### 1.3 Arreglos de esta entrega
- Inglés: 100 modelos nuevos (los anteriores no existían). Texto ajustado a la tarjeta y al lienzo (las rejillas y las fórmulas reducen la letra solas).
- Ciencias sociales: la expresión de materias decía `geo`, pero el id real es `geografia`. Corregido: ahora también salen en Geografía.
- Cachés subidas: `?v=1793500000004` (inglés), `?v=1793500000005` (sociales y Galería).

## 2. Qué falta

### 2.1 Materias sin biblioteca propia (100 modelos cada una)
Por orden propuesto:
1. Física (`fisica`)
2. Química (`quimica`)
3. Música (`musica`)
4. Educación física (`efisica`)
5. Tecnología e informática (`tecno`)
6. Valores y ética (`valores`)
7. Religión y cultura religiosa (`religion`)
8. Contabilidad (`conta`)
9. Artística y dibujo técnico (`arte`)
10. Biología propia (`bio`; hoy solo ve Anatomía)
11. Geografía propia (`geografia`; hoy ve Sociales)
12. Cálculo (`calculo`)
13. Adultos: Emprendimiento (`empre`), Marketing (`mkt`), IA (`ia`), Redes (`redes`), Comercio electrónico (`ecom`)
14. Infantil (`infantil`) e Idiomas (`idiomas`, diccionario)

Son unos 2 000 modelos más. Estas materias ya tienen dibujos de las bibliotecas anteriores (`b6_dibujos_*`, `b6_laminas_plus.js`, `b6_geometria.js`…), pero no tienen modelos de tres modos con preguntas.

### 2.2 Pendiente técnico
- **Auditoría en libro real**: ensamblar 300 páginas por materia con modelos (`_test_redes.html` → `AUD(materias, pais)`) y medir cuántos modelos entran, si se repiten y si desbordan. No se ha hecho para Lengua ni Inglés.
- **Inglés en libros en español**: las tarjetas mezclan inglés y español a propósito. Comprobar que el «por qué» y la voz (`b6_voz.js`) leen bien las dos lenguas.
- **Tope por libro**: `max: 1` permite un modelo por libro. Con 100 modelos y libros de 300 páginas, revisar si conviene subir el tope en láminas.
- **Repositorio**: el armazón `.dc.html` funciona sobre `support.js` (React). El repositorio es HTML plano (véase `github.md`). Hay que decidir si se sube el armazón con `support.js` tal cual (opción recomendada: funciona servido por HTTP) o se reescribe.
- `Estudio Universal Pro AUTOCONTENIDO.html` y `-un solo archivo-.dc.html` están **desactualizados**: no llevan la biblioteca. Hay que regenerarlos o borrarlos.

## 3. Cómo probar
```
python3 -m http.server 8000
http://localhost:8000/Estudio%20Universal%20Pro.dc.html     → pestaña 📚 Editorial
http://localhost:8000/Galer%C3%ADa%20de%20dibujos.dc.html    → revisión de modelos
http://localhost:8000/_test_redes.html                       → auditoría AUD()
```
En consola: `EU_MODELOS.materias()` debe devolver 11 materias, y `EU_MODELOS.lista('ingles').length` debe dar 100.

## 4. Cómo añadir una materia (receta para Claude Code)
1. Crear `b6_lib_<materia>.js`, `…2.js` y `…3.js` (unos 33 modelos cada uno) con el formato `{ id, fam, n, d(K), rot, intro, q:[[p,r]×3], porque }`. El patrón más compacto está en `b6_lib_ingles.js`, con los helpers `G` y `rejilla`, que ajustan el texto solos.
2. Cerrar cada archivo con `MO.agregar('<id>', L, { nombre, familias: FAM, materias: /^(<id>)$/ })`.
3. Añadir los `<script>` en el `<helmet>` del Estudio, detrás de `b6_lib_ingles3.js`, con `?v=` nuevo.
4. Añadir los archivos a `LIBS` en `Galería de dibujos.dc.html` y subir su `V`.
5. Documentarlo en `CLAUDE.md`.
6. Medir que ningún texto se salga de su tarjeta ni del viewBox (getBBox en modo `color`).
