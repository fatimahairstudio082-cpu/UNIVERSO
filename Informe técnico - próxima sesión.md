# Informe técnico para la próxima sesión
Estudio Universal Pro · 3 de octubre de 2026

## 1. Qué es el proyecto
Es una aplicación web sin compilar, que se abre tal cual en el navegador. Para usarla en local hay que servirla con `python3 -m http.server 8000`.
- **Entrada:** `Estudio Universal Pro.dc.html`. Carga todos los módulos `b6_*.js` desde `<helmet>`.
- **Caché:** cada `src` lleva `?v=<número>`. Si cambias un módulo, sube su número en el Estudio. Es el fallo más habitual.
- **Mapa completo de módulos:** está en `CLAUDE.md` y hay que leerlo siempre primero.
- **Reglas de estilo:** estilos en línea, JavaScript clásico, interfaz y comentarios en español y cambios quirúrgicos.
- **Ojo con `run_script`:** no puede escribir archivos con tilde en el nombre (por ejemplo `Galería de dibujos.dc.html`). Para esos usa `dc_js_str_replace` o `str_replace_edit`. Además, leer o escribir `Estudio Universal Pro.dc.html` desde `run_script` a veces se pasa de los 30 s y hay que repetirlo.

## 2. Biblioteca de dibujos (estado actual)
- **Tamaño:** 2 252 modelos en 28 materias, 16 con 100 dibujos y 12 con 50.
- **Motor:** `b6_modelos.js`, que se usa como `window.EU_MODELOS`.
- **Formato de modelo:** `{ id, fam, n, d(K), intro, q:[[p,r]×3], porque }`, con viewBox 200×150.
- **Modos de dibujo:** `color`, `3d` y `linea`.
- **Validador:** `_valida_lib.js` → `VALIDA(materia)`. Busca dibujos rotos, textos fuera del lienzo y textos que se pisan.
- **Revisión visual:** en la Galería, `Galería de dibujos.dc.html` (lista `LIBS`, versión `V`).

### Arreglado en esta sesión
- **Química, Inglés y Física:** el validador da 0 avisos en las tres.
  - El aviso de `qu_precipitado` era falso: la fórmula «NaNO₃» contiene la palabra «NaN». Se corrigió la expresión regular del validador.
  - Se reescribió la `rejilla()` de los archivos de Inglés, Física y `b6_lib_quimica3.js`: las dos líneas de cada tarjeta ahora se centran con un hueco entre ellas.
  - Los pies de página largos se encogen para caber.
- **Tope del Editorial:** sube de 300 a 500 páginas (`b6_editorial.js`, `b6_editorial_motor.js`).
- **`b6_modelos_libro.js`:**
  - Nuevo nivel 4 de huecos: los dibujos pueden sustituir lecturas `lec_caso`, `lec_lectura` y `lec_proyecto` repetidas en la misma unidad.
  - Segunda pasada al terminar la carga (`tarde()`), para recuperar dibujos que hayan sustituido módulos cargados después.
  - Prioridad para los dibujos marcados en la Galería (localStorage `eu_mi_libro`).
- **`b6_redes_sociales.js`:** `insertar()` ya no pisa páginas `vis` que llevan un modelo.
- **Botón «Usar en mi libro» en la Galería:** está en cada tarjeta y en la vista ampliada, con una franja que cuenta los dibujos elegidos y un botón «Quitar todos». Guarda en `eu_mi_libro = { materia: [ids] }`.

### Cobertura medida en libros
| Materia | 300 págs. | 500 págs. |
| --- | --- | --- |
| Comercio electrónico | 49/50 (falta `ce_correo_falso` por falta de hueco) | 50/50 |
| Redes sociales | 50/50 | — |
| Peluquería | 100/100 (nivel 5 de huecos) | 100/100 |

Herramienta de medición: `_test_modelos.html` → `contar(materia, páginas)`.

## 3. Portadas premium (libros)
- **Archivos:** `b6_portadas_kit.js` (`window.EU_PORTADAS`) y `b6_portadas_1/2/3.js`, con 100 escenas.
- **Lienzo y estilo:** 600×800, 14 paletas (`PAL`, con los papeles f, d, a, b, c, l) y 6 marcos.
- **Texto:** capa editable con `svg(id, {titulo, sub, autor, sello, anio, pal, fuente, pos, alin, color, banda, zoom, dy})`.
- **Formato de escena:** `{ id, cat, n, t, s, m, z, pal, f, tx, d(K,p,D) }`. `D` reúne los dibujos comunes del kit: fondo, estrellas, ciudad, cohete, sol, escalones, bandera, grano y otros.
- **Editor:** `Portadas premium.dc.html`, que ahora tiene el botón «Usar en mi libro» (guarda en localStorage `eu_portada_libro`).
- **Nuevo módulo `b6_portadas_editorial.js`:** conecta las portadas con el Editorial.
  - Se activa con `cfg.acab.portada = 'premium'`.
  - `cfg.acab.portadaPrem` puede ser `''` (automática por materia), un id o `'enviada'`. `cfg.acab.portadaPal` fija la paleta.
  - Añade la sección «Portada premium» al panel del Editorial.
  - Página de prueba: `_test_portadas.html` → `prueba([['ecom','adu'],…])`.

## 4. Paquete completo (ZIP)
- **Vídeos:** `b6_conectores.js` → `paquete()` ahora graba también `10-video-2d` y `10-video-3d`. Salen en MP4 si el navegador lo admite y, si no, en WebM. Se activa con `opc.video`, que el botón «📦 Paquete completo» ya pasa.
- **Tiempo:** cada vídeo se graba en tiempo real, unos 2,5 minutos, así que el paquete tarda unos 5 minutos. La pestaña tiene que estar visible mientras graba.
- **Curso (`08-curso/`):** los tests están dentro del `index.html` del curso, así que al volver ya no sale una página en blanco.
- **Probado en vivo (sesión siguiente):** ZIP de 30 págs. con los 22 archivos, EPUB, 10 PNG del carrusel y `10-video-2d.mp4` / `10-video-3d.mp4` a 1280×720 que se abren bien.
- **Corregido:** si la pestaña se ocultaba, el vídeo salía cortado (el 3D duraba 0,96 s en vez de 7,2 s). Ahora `video()` pausa la grabación con `visibilitychange` y compensa los saltos de temporizador de más de 250 ms, así que no se salta escenas.
- **Sin probar:** que la nota del curso se guarde al volver del test.

## 5. Anuncios premium — HECHO
Ya existen `b6_anuncios_kit.js`, `b6_anuncios_1/2/3.js` (100 anuncios en 10 categorías y 4 formatos) y `b6_anuncios_ui.js` (pestaña 📣 Anuncios del Estudio). Prueba visual: `_prueba_anuncios.html#9:16,0,20`. Lo que sigue es el plan original, como referencia.

**Nivel 5 de huecos en `b6_modelos_libro.js`:** en oficios y adultos (pelu, panadería, pastelería, cocina, batidos, repostería, empre, mkt, ia, redes, ecom), la `lec_lectura` de una unidad que ya tiene `lec_caso` cede su sitio a un dibujo que falte. Solo se usa si los niveles 0–4 no bastan. Comercio electrónico sigue en 49/50 en 300 págs. porque sus unidades no tienen `lec_caso`.

### Plan original
La usuaria quiere unos 100 diseños de anuncios con la misma calidad que las portadas de libro. Plan propuesto:
- **Reutilizar el kit:** `EU_PORTADAS` ya trae dibujos comunes, paletas, marcos, capa de texto y descargas, así que no hay que copiarlo.
- **Módulo nuevo `b6_anuncios_kit.js` (`window.EU_ANUNCIOS`):**
  - Formatos: 1:1 (1080×1080, publicación), 4:5 (1080×1350), 9:16 (1080×1920, historias) y 16:9 (1920×1080, banner).
  - Escenas definidas en un lienzo base y recolocadas en cada formato mediante zonas: visual, titular, oferta y botón.
  - Capa de texto: titular, subtítulo, oferta o precio (sello circular o cinta), llamada a la acción (botón), marca o logo y datos de contacto.
- **Escenas:** `b6_anuncios_1/2/3.js`, unos 34 por archivo. Categorías posibles:
  - comida y repostería
  - belleza y peluquería
  - cursos y formación
  - tienda y ofertas
  - servicios profesionales
  - eventos
  - salud y deporte
  - tecnología
  - inmobiliaria
  - infantil
- **Galería-editor:** `Anuncios premium.dc.html`, siguiendo el patrón de `Portadas premium.dc.html`: categorías, editor de textos, paletas, formato y descargas PNG/PDF/SVG, más «Guardar».
- **Validación:** que ningún texto se salga del lienzo en ninguno de los 4 formatos, sin NaN, y una revisión en pantalla por categoría.
- **Integración posterior (opcional):** usarlos como portada del producto «Carrusel 1:1» y de los volantes (`b6_volantes.js`).

## 6. Otros pendientes
1. Probar la nota del curso al volver del test.
2. ~~Peluquería al 100 % en 300 páginas~~ (hecho).
3. Ampliar de 50 a 100 las 13 materias de primera entrega: Música, Tecnología, E. física, Valores, Religión, Cálculo, Emprendimiento, Marketing, Comercio electrónico, Redes, IA, Idiomas e Infantil.
4. Auditoría final de 300 páginas por materia (`_auditoria_final.html`).
5. Decidir qué hacer con `entrega/` (copia antigua de módulos) y los archivos autocontenidos viejos.
