# Informe técnico completo — qué se hizo, qué se cambió y qué se eliminó (30-09-2026)

## A. Archivos ELIMINADOS
| Archivo | ¿Existía antes de esta sesión? | Qué era | Motivo |
|---|---|---|---|
| `_dbg.js` | **Sí.** Ya estaba en el proyecto y cargado en el `<helmet>` de la app | Depurador: envolvía todas las funciones de 16 módulos (FOLLETO_MOTOR, EU_EDITORIAL, EU_SVG…) y escribía en `localStorage` (`__dbg`) cada 200 llamadas y cada segundo | Frenaba la app: era la causa de que no abriera |
| `_debug_sin_nuevos.dc.html` | No, lo creé yo | Copia de la app sin los módulos nuevos | Temporal de diagnóstico |
| `_debug_modulos.html` | No, lo creé yo | Página que medía el tiempo de carga de cada módulo | Temporal |
| `_debug_sin_dbg.dc.html` | No, lo creé yo | Copia de la app sin `_dbg.js` | Temporal |
| `_debug_sin_dbg_sin4.dc.html` | No, lo creé yo | Copia sin `_dbg.js` ni `plus4` | Temporal |
| `_debug_sonda.dc.html`, `_sonda.js` | No, los creé yo | Sonda de tareas largas y de estado de carga | Temporal |
| `_leer_dbg.html` | No, lo creé yo | Leía `localStorage.__dbg` | Temporal |

**Solo `_dbg.js` existía de antes.** Era una herramienta de depuración y no contenía nada de la app. Si lo necesitas, lo puedo volver a crear, pero no se debe cargar en la app.

No he eliminado ningún módulo `b6_*`, ningún informe ni ningún archivo de datos.

## B. Líneas QUITADAS de archivos existentes
- **`Estudio Universal Pro.dc.html`:** quité la línea `<script src="./_dbg.js?v=1"></script>` del `<helmet>`.
- **`b6_apertura_dibujo.js` en la cabecera:** faltaba al revisarla. No lo borré a propósito: la inserción se había hecho sobre una línea que después cambió. Ya está añadido otra vez, tras `b6_geometria_visual.js` (`?v=1793100000001`).

## C. Archivos SOBRESCRITOS (ya existían o pudieron existir)
El registro de esta sesión no me deja confirmar si estos archivos ya estaban creados antes. `CLAUDE.md` ya los mencionaba, así que es probable que existieran versiones anteriores, y fueron reemplazadas **sin copia de seguridad**:

| Archivo | Qué se escribió |
|---|---|
| `b6_apertura_dibujo.js` | Versión nueva completa: gancho `post`, dibujo por materia, figura de la unidad o bodegón, caché y máximo 4 intentos |
| `b6_dibujos_plus4.js` | Versión nueva completa con 20 dibujos (Tierra, Historia, Geometría) |
| `_auditoria_dibujos.html` | Banco de pruebas nuevo (`#gen:` y `#lib:`) |
| `Auditoría dibujos.md` | Informe nuevo del inventario y de los huecos |

Si tenías versiones anteriores de estos archivos con contenido distinto, se perdieron.

## D. Archivos MODIFICADOS (cambios puntuales)
- **`b6_dibujos_plus3.js`:**
  - `dic()` ya no guarda el diccionario si está vacío.
  - Se añadieron comprobaciones en `lenguas()` y en las escenas.
  - Cada generador tiene su propio `try/catch`.
  - Se corrigió el título con « · » colgando.
  - Versión: `?v=1792800000004`.
- **`Estudio Universal Pro.dc.html`:** solo la cabecera. Se añadieron `plus4` y `apertura`, se quitó `_dbg.js` y se subieron los números de versión.
- **`_test_redes.html`:**
  - Carga `apertura` y `plus4`.
  - `aud()` mide también huecos, páginas con SVG, unidades y tipos.
  - Nuevo modo `#aud:materia1,materia2`.
- **`CLAUDE.md`:** se añadieron las líneas de `b6_dibujos_plus4.js` y `b6_apertura_dibujo.js`, sin duplicados.

## E. Archivos NUEVOS
- `_prueba_dibujos4.html` — vista de los 20 dibujos nuevos (`?g=0-4#3d` o `#2d`).
- `Auditoría 300 páginas.md` — auditoría de las 32 materias.
- `Informe técnico 30-09-2026.md` — informe anterior.
- Este informe.

## F. Qué se hizo, en resumen
1. Se hizo más robusto `b6_dibujos_plus3.js`, que no tenía errores de sintaxis sino fallos al ejecutarse.
2. Diagnóstico de los huecos: las aperturas de unidad solo se llenaban con imágenes subidas. Se resolvió con `b6_apertura_dibujo.js`.
3. Inventario: 318 dibujos antes y 338 ahora, todos en 2D y 3D, con 0 errores en 2096 pruebas.
4. Se añadieron 20 dibujos nuevos para Tierra, Historia y Geometría (regla, calibre, compás…) con datos de cada país.
5. Auditoría de 300 páginas: 19 materias con carencias (unidades, repetición o dibujos). El detalle está en `Auditoría 300 páginas.md`.
6. La app no abría por `_dbg.js`. Se quitó y ahora carga en unos 0,5 s.

## G. Archivos de pruebas que siguen en el proyecto y no he tocado
`_carga.html`, `_leer.html`, `_test_emp.html`, `_test_materias.html`, `Auditoria por pestanas.dc.html`, `Informe tecnico.dc.html`, `Auditoría materias.md`.
