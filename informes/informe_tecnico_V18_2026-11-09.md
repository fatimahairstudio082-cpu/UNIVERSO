# Informe técnico · Maniquí V18 en Universo (9-11-2026)

Pestaña «🧑‍🎨 Maniquí V18» (`esV18`) en `Estudio Universal Pro.dc.html`, con el V18 (`Fátima Studio V18 · Labios que hablan..html`) como iframe autónomo y el puente `b6_v18_puente.js`. No se tocó ningún otro `b6_*` ni Guías 3D, Firebase, localStorage, créditos, login ni temporizadores.

## Lo hecho
1. **Maniquí sentado y lienzo**: se sienta al instante, la cámara sigue a la cabeza (graduada por el largo del cabello), botón «Ampliar lienzo».
2. **Puente con los motores de Guías 3D** (solo datos, sin `<guias-3d>`): `EU_CORTES`, `EU_DIAGRAMA.receta`, `EU_CALCULO_CAPILAR`, `EU_CEREBRO`, `EU_DIVISIONES`.
3. **Corte capa por capa, mechón por mechón**: 7 capas (nivel `h`), 6 mechones verticales por capa (en horizontal, 1), atrás y luego delante, línea azul de oreja a oreja, reloj de elevación junto al maniquí, tijera que recorre el mechón, pinzas para el cabello aún sin cortar, elevación real de cada mechón, el cabello cortado se queda.
4. **Medidas reales**: largo en pulgadas y cm (tabla de 8″ a 28″), guía móvil con los dedos (1 dedo = 2 cm editable) y escalera Z0–Z6 con el escáner.
5. **Cámara**: rueda sola de atrás a los lados y delante y da una vuelta al terminar.
6. **Colorimetría (13 técnicas)**: divisiones de las 22 láminas proyectadas sobre la cabeza, 7 mechones por sección, formas de aplicar por técnica (raíz, global, balayage con arranque 10/25/50/75 %, sombré, babylights, papel, gorro, decoloración), permanente con rulos, hidrataciones, queratina, canas y corrección de color (5 escenas), ropa nueva (4 prendas).
7. **Plancha y secador (9-11)**: plancha con vapor (queratina, botox, planchado), secado con cepillo redondo y secador con aire (cabello mojado que se seca por capas).
8. **Capas finas horizontales** en hidratación, queratina, planchado y secado: 6 capas de la nuca arriba × 7 mechones finos, 5 anillos de partición, plancha ancha.
9. **Manos** (`Maniqui.mano`, `agarrar`, `herr`): una mano con el secador (reducido 72 %), otra con el cepillo redondo, otra con la plancha; en el corte la izquierda sujeta el mechón con el peine y la derecha lleva la tijera con anillos. Con elevación (mixto) dedos y tijera en vertical; a 0° o liso extremo, en horizontal. Brazos reducidos a un puño corto.

## Medido
Chromium (swiftshader): 0 errores de consola en corte, color, hidratación, queratina, planchado, secado y manos; PC y móvil.

## Pendiente de corregir (para la memoria)
- Agarres de manos aproximados: mano de la tijera algo abierta fuera de los anillos; la izquierda pasa junto al mechón sin rodearlo; plancha rara vista desde arriba.
- Caso horizontal (0° y liso extremo) probado solo a medias con las manos; verificar con «Básico cuadrado» a ojo.
- Sin hombro ni torso de peluquera: las manos salen de un puño flotante.
- Pasos 7 (tiempo) y 8 (aclarado) quedan sin acción visible en secado y planchado.
- Anillos de partición horizontales con altura aproximada (0,02–0,25 en la cabeza).
- Neutralización, producto en amarillo y mechón triangular (`cb_mech_*`) de Guías 3D: no traídos.
- Alineación de las láminas proyectadas, aproximada.
- Cómo se sujeta el mechón con la mano en colorimetría.
- Probar la pestaña dentro de Universo en vivo (aquí el CDN de React está bloqueado).
- `CLAUDE.md` tiene 284 líneas (objetivo ≤ 100): recortar.
- Estimaciones propuestas, «a validar por Fátima»: arranque del balayage y ángulos por defecto.
