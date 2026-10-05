# Informe técnico — sesión del 30-09-2026

## 1. Módulos cargados en la app
`Estudio Universal Pro.dc.html` carga 57 módulos `b6_*` en su `<helmet>`. De esta sesión:

| Módulo | Estado | Posición |
|---|---|---|
| `b6_dibujos_plus3.js` | corregido (`?v=1792800000004`) | tras `b6_dibujos_plus2.js` |
| `b6_dibujos_plus4.js` | nuevo (`?v=1793000000006`) | tras `b6_dibujos_plus3.js` |
| `b6_apertura_dibujo.js` | nuevo, **vuelto a añadir** (`?v=1793100000001`) | tras `b6_geometria_visual.js` |

Por qué se había perdido `b6_apertura_dibujo.js`: al insertarlo se usó como referencia la línea de `b6_geometria_visual.js`, pero después la cabecera se reescribió al quitar `_dbg.js` y la línea no quedó. Ya está otra vez en su sitio.

## 2. Correcciones en `b6_dibujos_plus3.js`
No tenía errores de sintaxis. Sí podía fallar al ejecutarse en las escenas con rótulos (casa, ciudad, cuerpo, ropa, formas, familia):
- `dic()`: si `EU_IDIOMAS` aún no estaba cargado, el diccionario se guardaba vacío y no se volvía a intentar. Ahora no se guarda si está vacío, y se saltan las palabras que vienen sin `es`.
- `lenguas()`: ya no falla si falta `I.LENG` o el nombre de la lengua.
- La escena devuelve `null` si faltan `C.T` o `S.pts`, y ya no falla cuando todas las palabras quedan como huecos para rellenar.
- Título: se quitó el « · » que sobraba cuando no hay traducción.
- Cada uno de los 29 generadores tiene su propio `try/catch`. Si uno falla, escribe un aviso en la consola y devuelve `null`; los demás siguen funcionando.

## 3. Huecos en blanco en lugar de dibujos
**Causa:** la página de apertura de cada unidad («Ilustración de apertura») y la de «Cerca de ti» («Foto o dibujo de un ejemplo real») dejaban un marco discontinuo. Solo se llenaba si había imágenes subidas, o en Geometría y Álgebra y Cálculo. En el resto de materias quedaba 1 hueco por unidad.

**Solución: `b6_apertura_dibujo.js`.** Es un gancho `post` del motor que cambia ese marco por un dibujo. El orden de búsqueda es:
1. Un tipo de `EU_SVG.tiposDe(u, C)` de la materia, en 2D o 3D según `cfg.acab.dibujo`. No usa los que tienen huecos para contestar.
2. La figura de la unidad (`u.f`).
3. Un bodegón de `EU_BOTANICA`.

Guarda cada dibujo por unidad, página y modo para no repetir el trabajo al medir el llenado. Prueba como máximo 4 tipos por hueco.

Resultado: 0 huecos en libros de 40 págs. de 11 materias.

## 4. Inventario de la biblioteca de dibujos (antes de `plus4`)
| Fuente | Dibujos |
|---|---|
| Láminas en `EU_SVG.visual` | 127 |
| Tipos base de `EU_SVG` | 8 |
| `EU_BOTANICA` | 109 |
| `EU_GEO_VISUAL` | 40 |
| `EU_INFANTIL` | 22 |
| `EU_TALLER` | 12 |
| **Total** | **318** |

Todos admiten 2D y 3D. En la prueba salieron 2096 dibujos correctos y 0 errores. Con `plus4`, las láminas pasan a ser 147 y el total a 338.

## 5. Nuevo `b6_dibujos_plus4.js`: 20 dibujos
Cada uno sale en 2D y en 3D, con preguntas, respuesta y proceso resuelto, y con datos del país:

- **Tierra:** `tie_capas`, `tie_placas`, `tie_estaciones` (según el hemisferio), `tie_zonas` (con la capital), `tie_volcan`, `tie_rio`, `tie_costa`, `tie_rocas`.
- **Historia:** `his_edades` (con el hito del país), `his_siglos`, `his_feudal`.
- **Geometría y medida:** `gm_regla`, `gm_calibre`, `gm_escuadra`, `gm_compas`, `gm_triangulos`, `gm_circunferencia`, `gm_cuadrilateros`, `gm_desarrollo`, `gm_paralelas`.

Están conectados a las materias con `SV.visual(id, gen, { materias, max })`. Afectan a geografía, soci, natu, física, química, bio, mate, geoalg, cálculo, tecno, arte, religión, valores, lengua, música e infantil.

Ajustes hechos tras la revisión visual: solapes en volcán, río, costa, rocas, siglos y sociedad feudal; la tangente de la circunferencia; la pieza del calibre; la caja del prisma; los artículos en «empieza la primavera»; y los rótulos de las zonas polares.

## 6. Auditoría de 300 páginas
Informe completo en `Auditoría 300 páginas.md`. De las 32 materias, 19 no cumplen algún criterio:
- **Pocas unidades:** química 5, anatomía y geografía 6, biología 7, tecnología 8, arte y contabilidad 9.
- **Repetición > 30 %:** física, contabilidad, soci, batidos, IA, pastelería.
- **< 120 páginas con dibujo:** redes, geografía, lengua, música, peluquería, anatomía, religión.
- **Desborde:** 1 página del glosario de idiomas.

Mejora con `plus4` (páginas con dibujo): geografía 105 → 132, soci 131 → 160, mate 162 → 180, geoalg 181 → 196, natu 155 → 174.

## 7. La app no abría
**Causa:** en el `<helmet>` estaba cargado `_dbg.js`, un script de depuración que envolvía todas las funciones de 16 módulos y escribía en `localStorage` cada 200 llamadas y cada segundo. Esa carga extra hacía que la app no respondiera.

**Solución:** se quitó `_dbg.js` de la cabecera y se borró el archivo.

**Comprobación:** con una sonda temporal, ya borrada, los 57 módulos cargan en unos 0,5 s y la página llega a `readyState = complete` sin recursos pendientes, con la pantalla de Plantillas pintada.

## 8. Archivos
- **Nuevos:** `b6_apertura_dibujo.js`, `b6_dibujos_plus4.js`, `_auditoria_dibujos.html`, `_prueba_dibujos4.html`, `Auditoría dibujos.md`, `Auditoría 300 páginas.md` y este informe.
- **Modificados:** `b6_dibujos_plus3.js`, `Estudio Universal Pro.dc.html` (cabecera), `_test_redes.html` (modo `#aud:` y métricas de dibujo) y `CLAUDE.md`.
- **Borrados:** `_dbg.js` y las páginas temporales de diagnóstico.

## 9. Pendiente
1. Añadir unidades a química, anatomía, geografía, biología, tecnología, arte y contabilidad.
2. Más variantes de enunciado en física, contabilidad, soci, IA y recetarios.
3. Más dibujos para lengua, música, religión, anatomía, peluquería y redes.
4. Montar los libros largos por tramos, para que la app no se bloquee entre 10 y 18 s con 300 páginas.
