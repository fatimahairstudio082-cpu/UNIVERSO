# Informe técnico · 9 de octubre de 2026
Estudio Universal Pro · rama `claude/admiring-hamilton-7f3nok` · PR #9 (borrador, **se fusiona todo de una vez**)

## 1. Qué se corrigió

| # | Corrección | Archivo(s) | Cómo se probó |
|---|---|---|---|
| 1 | **Curso en el móvil**: reproductor primero y fijo arriba; temario en cajón «☰ Temario» con módulos plegables y avance por módulo; sin «p. 16» en cada fila; «Módulo · Lección n de m» y «‹ Anterior · Siguiente ›». Botones «Grabar…» solo para la autora (`curso/index.html#grabar`). | `b6_curso_premium.js` | Navegador a 390×844 y 1280×800, sin errores ni desplazamiento lateral |
| 2 | **Curso tipo carrusel**: una tarjeta por escena con su **animación en miniatura** (mismo motor `CURSO_ANIM.pinta`); la escena que suena va resaltada, centrada y al paso de la voz. | `b6_curso_premium.js` | Escenas animadas pintadas con `EU_DIAGRAMA.pinta` |
| 3 | **Tests de Peluquería**: «¿Qué corte es? «descripción de la ficha»»; nuca y herramienta solo cuando cambian entre cortes; «Completa: « ___: …»» pasa a «¿A qué corresponde? «…»». | `b6_pelu_orden.js`, `b6_curso_premium.js` | Preguntas de las 8 familias de cortes generadas con `EU_CORTES` real |
| 4 | **Seguridad y errores comunes (reglas de Fátima)**: herramientas lavadas y desinfectadas tras cada cliente (pH, hongos, piojos); nada de keratina ni decoloración sobre cabello enchiclado o maltratado; cortar siempre con guía; divisiones del cabello como base del corte. En ideas, «Error frecuente» y repaso. | `b6_pelu_orden.js` | Unidades generadas con el código real |
| 5 | **Lección animada «Seguridad en los químicos · antes y después»** (`p_seg_quimica`, unidad `pe_u_fund`): prueba de mechón, guantes, embarazo, revisar cada 15 min, cantidades exactas → «echa humo, se quema y se pierde». | `b6_pelu_particiones.js` | Construida con el motor 3D real (5 escenas) |
| 6 | **Preparación como una receta**: las técnicas del Cerebro sin paso de preparación (balayage, mechas con papel…) abren con herramientas, productos y cantidades de su ficha. | `b6_pelu_particiones.js` | Balayage y mechas con papel con el motor real |
| 7 | **Libro interactivo en el móvil**: cada página se escala al ancho de la pantalla (no se corta ni se rehace la maqueta). Al imprimir, tamaño real. | `b6_editorial_motor.js` (`ED.documento`, script `cabe`) | Página de 216 mm en pantalla de 390 px |
| 8 | **El alumno ya no ve «a validar por Fátima»** (escena de colorimetría, rótulos de grados, «(a validar)» en ángulos, ficha del libro). Las notas siguen en los datos; Fátima las ve con el **modo revisión**: en la consola del navegador `localStorage.setItem('eu_revision','si')` (y `removeItem` para quitarlo). | `b6_color_cerebro_motor.js`, `b6_pelu_particiones.js`, `b6_pelu_diagrama.js`, `b6_pelu_libro_diagrama.js` | 0 rótulos visibles en sobreproyección, Long Layers y Pixie |
| 9 | **Galería de dibujos · «Animaciones»**: carrusel de las técnicas del motor de Guías 2D/3D por clases (Cortes y diagramas · Colorimetría · Mechas · Químicos y tratamientos · Cabello · Seguridad), con voz es-ES. Los motores se cargan **solo al pulsar** «Animaciones». La cuadrícula, «Usar en mi libro» y las descargas no cambian. | `Galería de dibujos.dc.html` | Navegador con el motor 3D real |

| 10 | **Certificado profesional**: PDF A4 apaisado (sin librerías, funciona sin internet), firma de Fátima Caldea, sello «Fátima Hair Studio», horas cronometradas con la narración y los tests (para cursos de 10 a 1000 págs.), nota del examen, fecha y n.º de certificado. Sustituye la descarga PNG. | `b6_curso_premium.js`, `firma-fatima.png` | PDF generado y abierto (A4, 1 página) |

`?v=` subido en `Estudio Universal Pro.dc.html` para cada archivo cambiado. **No se tocaron**: `b6_guias_3d.js`, `support.js`, Firebase, login, créditos, claves de localStorage existentes (solo una nueva: `eu_revision`), descargas, ZIP ni carpeta HOTMART.

## 2. Para que funcione todo hoy
1. Fusionar el PR #9 en `main` (una sola vez).
2. Abrir la app y recargar sin caché (Ctrl+Shift+R o borrar caché en el móvil).
3. Comprobar en el Editorial con un libro de Peluquería:
   - «👁 Vista previa · curso premium»: temario, carrusel animado, test de «Cortes · Melenas y bob».
   - «👁 Vista previa · libro interactivo» en el móvil: la página entera cabe.
   - Unidad «Higiene, seguridad y herramientas»: lección «Seguridad en los químicos · antes y después».
4. Galería de dibujos → «Animaciones».
5. Para grabar vídeos para Hotmart: abrir `curso/index.html#grabar` en Chrome de escritorio.

## 3. Pendiente / a revisar por Fátima
- Probar con un curso real que la nota del test se guarda al volver (pendiente desde el 3-10).
- La carpeta `_ds/modernist-73a75936…` (sistema de diseño de la Galería) no está en el repositorio: la Galería funciona, pero sin esos estilos.
- Diagramas de mechas nuevos (internacional, universal, vertical, bicolor): necesitan grosor de mecha, papel sí/no y dirección para no inventar.
- La imagen «formas y técnicas balayaje ejemplo s» lleva firma de otro autor (Andrés SanSan): usarla solo como referencia.
