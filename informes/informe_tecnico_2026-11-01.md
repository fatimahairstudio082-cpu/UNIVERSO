# Informe técnico — Estudio Universal Pro (UNIVERSO)
**Fecha:** 1-11-2026 · **Rama:** `correccion-cortes-capas-31-10` (PR #49) · **Estado:** NO fusionado (fusión única al final, cuando todo esté ✅)

Autoridad final: Fátima. Reglas respetadas: cambios aditivos y mínimos, nada reconstruido, cero invento (todo sale de sus datos/reglas reales o de lo que ella definió), punto de retorno en cada commit, verificado sobre el motor real.

---

## 1. Cómo se verifica (arnés montado esta sesión)
Se carga la app real headless (Chromium + Playwright), con `support.js`, React/ReactDOM/Babel servidos localmente y `EU_CARGA_EDITORIAL()` para traer el motor. Luego se arma el libro con `EU_EDITORIAL.ensamblar(cfg)` y se mide el documento imprimible hoja por hoja (desbordes, páginas vacías, fugas de «a validar»/NaN/undefined) y las preguntas. Scripts en el entorno de trabajo; no forman parte del repo.

## 2. Realizado esta sesión (6 commits, todos verificados)

| Commit | Qué | Verificación |
|---|---|---|
| `afa4299` | **Maniquí**: escalonado dejaba de salir muñón (fotograma final, no a mitad de animación); pixie sin los números «Mechón·75°» sobre el cabello (usa la escena limpia `queda_corto`); `escQueda` no pinta chapas de elevación en cortos (`!CT`). | 153 maniquíes regenerados, 0 errores JS |
| `e5ab3e4` | **Preguntas**: fuera las metapreguntas repetidas de la galería («¿de qué grupo…?», «¿qué enseña la imagen…?», ×17 cada una); las 3 preguntas por paso de Guías 3D («¿partición?», «¿elevación?», «¿vigilar?») ahora nombran su paso (no salían ×18 idénticas). | 0 preguntas repetidas 5+ veces (antes ×18); 684 únicas (antes 612); 0 errores |
| `76469a3` | **«Ordena los pasos»**: una vez por fase en Peluquería (antes 5-6 veces por técnica); quitada la subpregunta abierta «Explica con tus palabras». Guard `C.mat==='pelu'`: las otras 31 materias no cambian. | 5-6 → 2 por técnica (práctica + test, aprobado por Fátima); «explica con tus palabras» 0 en pelu |
| `621d468` | **Índice en dislexia**: se reparte en más páginas (letra más ancha y alta); arregla el desborde de +29 px. Fácil y normal no cambian. El «undefined» del curso era código JS válido (`MediaRecorder(..., undefined)`), no texto del alumno: no se toca. | Libro 300 págs dislexia: 0 desbordes |
| `ebb2a60` | **Colorimetría — preguntas dinámicas**: cada clase genera preguntas de neutralización (estrella) y corrección (tabla de 10 errores) con respuesta y explicación de SU calculadora. | `construir('cc_fat_i03')` → «efecto morado → 0.3 Dorado». 0 errores |
| `1f8b58e` | **Colorimetría — sacar las cuentas**: generadores con sus reglas reales — sumar y dividir (base+tinte÷cantidad), supermezcla (7+10=8,5), base→tono deseado (inversa), neutralizar fríos (verde→0.6 Rojo, frío→0.3 Dorado/0.4 Cobre) y cálidos (estrella). Número distinto por clase. | `cc_fat_i03`→«base 4+tinte 5=4,5»; `cc_mez_i01`→«base 7 quiere 8→tinte 9». 0 errores |

### Estado de calidad del libro (verificado, 300 páginas)
- **Normal**: 0 errores JS · 0 desbordes · 0 páginas vacías · 0 fugas de «a validar».
- **Fácil**: ídem (0 en todo).
- **Dislexia**: 0 errores · 0 desbordes (tras `621d468`) · 0 vacías · 0 fugas.
- **Curso**: 0 errores JS · guion de voz limpio (0 fugas) · 32 módulos.

## 3. Pendiente para la próxima sesión (en orden)

1. **Colorimetría — que las cuentas se VEAN en la lección.** El generador de cuentas funciona y se verifica por clase (`construir(id)`), y la lección del curso las recibe (`b6_pelu_particiones.js:1154`). Falta confirmar visualmente, en la app en vivo o montando el curso completo, que aparecen en el libro y el curso; y, si hace falta, que más clases de color entren como lección (inserción de lecciones — tema de fondo).

2. **Colorimetría — maniquí con cabello y resultados en cada lección (NUEVO, pedido de Fátima 1-11-2026).** En cada lección de colorimetría el maniquí debe verse **con cabello** y mostrar **el resultado** (cómo queda el color), con sus escenas, como ya lo hace pero **más desarrollado y dinámico** para que la persona aprenda más. Con **ejemplos tipo escenario** («si la clienta tiene este color…») y **palabras gancho, naturales**, no técnicas.

3. **Conectar la biblioteca de referencias al motor de Guías 3D.** Registrar las imágenes de referencia **largas y cortas** que aún no estén registradas, para que la biblioteca esté completa en el motor.

4. **Tarea 2 — una imagen de referencia por hoja.** Que cada hoja del escáner traiga **una sola** imagen de referencia de **frente**, de un corte específico (no la ficha de tres vistas).

5. **Fusión única de PR #49.** Cuando 1-4 estén ✅ y Fátima lo apruebe, una sola fusión con todo sincronizado.

## 4. Pendientes anteriores que siguen abiertos (de CLAUDE.md / memoria)
- Decidir si el escalonado y los largos deben fluir más abajo por el busto (cambio profundo en la caída del maniquí; quedó parado por decisión de Fátima: por ahora llegan al hombro).
- Las 50 láminas de colorimetría de la biblioteca de IA salieron mal recortadas (pendientes de lámina nueva).

## 5. Punto de retorno
Cada paso está en su commit en la rama `correccion-cortes-capas-31-10`. Para deshacer uno: `git revert <commit>`. Nada fusionado a la rama principal.
