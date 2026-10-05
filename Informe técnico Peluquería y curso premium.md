# Informe técnico · Peluquería en la biblioteca y curso premium

## 1. Lo que está conectado hoy

| Pieza | Archivo | Qué hace |
|---|---|---|
| Limpieza | `b6_pelu_limpieza.js` | Quita 11 dibujos (8 de estética, 3 duplicados) y conecta las 27 divisiones de `EU_DIVISIONES` (familia `div`). |
| Guías 3D → biblioteca | `b6_pelu_guias.js` | 40 cortes × 4 pasos = **160 dibujos** (`pe_g3d_<corte>_<k>`, familia `g3d`). Cada imagen la dibuja la cabeza 3D real (`<guias-3d>.laminaURL`). Unos 47 ms por paso. |
| Orden del libro | `b6_pelu_orden.js` | Cada unidad de corte lleva los pasos 3D de sus cortes. La ficha genérica solo sale si un corte no tiene guía. |
| Curso premium | `b6_curso_premium.js` | Botón «🎓 Curso premium» en Salidas del Editorial: curso, libro, láminas, guion y carpeta para Hotmart, todo en un ZIP. |

Biblioteca `pelu` en uso: 89 dibujos propios + 27 divisiones + 160 pasos 3D = **276**. Las 45 fichas antiguas siguen registradas pero solo como reserva.

Prueba con un libro de 120 páginas: 13 módulos, 53 lecciones, 40 vídeos paso a paso, 296 escenas, 178 imágenes en unos 3 s y un ZIP de unos 16 MB.

## 2. Efectos del curso: qué hacen y cómo

- **Voz**: busca la «Google español» (es-ES) de Chrome. Si no la hay, usa otra voz en español; si no hay ninguna, el curso funciona solo con subtítulos.
- **Subtítulo resaltado**: las palabras ya dichas cambian de color. Usa los avisos de palabra de la voz y, si no llegan, calcula unos 14,5 caracteres por segundo.
- **El dibujo cambia con cada paso**: cada escena tiene su lámina.
- **Rótulos al nombrarlos** (partición, elevación): cada uno aparece cuando la narración llega a esa palabra.
- **Repaso**: pregunta con 3 opciones. A los 3,5 s se muestra la correcta y la voz la dice.
- **Barra de progreso** de la lección, **capítulos** clicables y enlace a la **página del libro**.

## 3. Ampliar Peluquería con más dibujos de Guías 3D

Se puede, porque el mismo motor dibuja cualquier paso desde cualquier ángulo. Propuestas, ordenadas de más valor a menos y sin volver a caer en la repetición:

1. **Resultado final por corte** (40): vista 3/4 del último paso, sin rótulos. Sirve de portada de cada lección y de cierre en el libro.
2. **Mismo corte en dos tipos de cabello** (unos 20 pares seleccionados): `EU_CORTES.guiaDe(corte, cabello)` cambia la partición según el cabello. Una lámina comparada «liso / rizado» enseña la regla del cabello.
3. **Vista doble por paso** solo donde aporta, por ejemplo nuca + perfil en degradados y graduados (unos 30). Hay que usar un tope por libro para no repetir.
4. **Elevación por zonas** (Z0 nuca … Z6 coronilla) dibujada sobre la cabeza 3D para las unidades de elevación, en sustitución de las 5 láminas planas.
5. **Divisiones por técnica de color y mechas**: `EU_DIVISIONES.laminasDe(técnica)` ya da qué divisiones lleva cada técnica. Se pueden conectar a las unidades de color igual que se hizo con los cortes.
6. **Maniquí de Estudios** (`b6_estudios.js`, el resto de disciplinas): no lo he revisado. Si expone una función de imagen como `laminaURL`, se conecta de la misma forma.

Coste aproximado de las cuatro primeras: unos 130 dibujos más y 6–8 MB más en el ZIP.

## 4. Pendiente en los vídeos

**Probado**
- Reproductor, subtítulos, rótulos, repaso, tests y menú: probados con voz desactivada.
- La voz «Google español» se detecta.

**Sin probar**
- Grabación real a MP4/WebM. Necesita que la usuaria comparta la pestaña, y eso no se puede hacer en mi entorno.
- Descarga del ZIP desde el botón del Editorial en el Estudio completo.
- Certificado PNG.

**Problemas conocidos de Chrome con las voces de Google**
- Las voces «Google» suelen **no enviar avisos de palabra**. En ese caso el resaltado va por cálculo: queda cerca, pero no exacto. Si se quiere exacto: Google Cloud TTS (de pago, devuelve los tiempos de cada palabra).
- Chrome **corta frases de más de ~15 s** con voces Google. Pendiente: partir la narración de cada escena en frases.

**Limitaciones de la grabación**
- Se graba en tiempo real: «Grabar todos» con 40 vídeos de ~1 min son ~40 min con la pestaña abierta y delante.
- El navegador no produce **MP3**. El audio sale en M4A o WebM. Para MP3 haría falta un conversor en el navegador (ffmpeg.wasm, ~25 MB) o hacerlo fuera.

**Mejoras de efecto**
- **Transiciones**: hoy las escenas cambian en corte seco. Pendiente un fundido y un zoom suave sobre la zona del rótulo.
- **3D en movimiento**: hoy cada paso es una imagen fija de la cabeza 3D. Se puede grabar el lienzo vivo de `<guias-3d>` girando la cámara entre pasos. Es el mayor salto visual, pero exige montar el motor 3D dentro del curso exportado (+170 KB, sin internet).
- **Vídeos 2D/3D del Editorial** (`EU_CONECTORES.video`): siguen saliendo **sin voz**. Pendiente unificarlos con el reproductor del curso.

**Peso**
- Cada imagen va dos veces en el ZIP (en `datos.js` y en `laminas/`). Si `datos.js` apunta a `laminas/`, el ZIP baja a ~8 MB.

## 5. Orden recomendado
1. Partir la narración en frases (corte de Chrome) y probar una grabación real.
2. Bajar el peso del ZIP (imágenes una sola vez).
3. Resultado final por corte + comparativa liso/rizado (puntos 3.1 y 3.2).
4. Transiciones y 3D en movimiento.
5. Divisiones de color y maniquí de Estudios.

## 6. Hecho después del informe
- `b6_pelu_libro3d.js`: guía 3D de cada corte dentro del libro (240 págs. → 30 guías). En el HTML se ve y se escucha: el esquema cambia de grados con cada paso y hay test. En el impreso salen los grados finales y las soluciones.
- Curso premium: narración frase a frase (arregla el corte de Chrome a los ~15 s).

## 7. Siguiente: animación con voz en todas las materias
El reproductor ya anima cualquier dibujo de `EU_MODELOS` (rótulos al nombrarlos). Falta: trazo del SVG que se pinta por capas al ritmo de la voz, «▶ Ver y escuchar» en cada lámina `vis` del libro HTML y transiciones entre escenas.
