# Informe técnico · Peluquería en el Estudio Universal Pro
Rama `pelu-formas-de-corte`. PR #30, en borrador y sin fusionar. Fecha: 16-10-2026.

Reglas que se siguieron en todo el trabajo:
- **No se borró nada** y no se cambió ningún ID.
- **No se tocaron** Firebase, el login, los créditos, las claves de localStorage existentes, los temporizadores ni `b6_guias_3d.js`.
- Todo son **parches pequeños sobre los motores que ya existían**.
- Las reglas de peluquería son las de Fátima. Lo que no dio ella va marcado «a validar».

---

## 1. Lo que se hizo (por entrega)

| # | Entrega | Archivos | Resultado |
|---|---|---|---|
| 1 | Formas de corte conectadas | `b6_guias_3d_diagrama.js`, `b6_pelu_diagrama.js` | En «Crear mi corte», las técnicas aparecen agrupadas: «Técnica 1 · V invertida», «2 · Curvo (U)», «3 · En punta», «4 · Horizontal en capas», «5 · Vertical con graduación» y WAP. Cada corte toma su forma de atrás (cuadrado, U, V, A, diagonal) del texto que ya tenía su ficha. |
| 2 | «Cómo queda» con el largo de cada mechón | `b6_pelu_diagrama.js` | Las elevaciones se ven en el resultado: una línea de color por cada mechón elevado, rotulada «Mechón n · grados». |
| 3 | Cuadrado visto de atrás | `b6_pelu_diagrama.js` | La línea recta se ve recta y con esquinas, no en arco. |
| 4 | Z0–Z6 → «Mechón n · grados» | `b6_pelu_diagrama.js`, `b6_pelu_libro_diagrama.js`, `b6_pelu_orden.js`, `b6_pelu_libro3d.js`, `b6_pelu_tecnica.js` | El alumno lee y oye «primer mechón, corte recto a 0 grados; el mechón 2, lo elevamos a 90 grados…». Quedan 0 «Z» en el libro, en la voz y en los tests (antes había 253). |
| 5 | Bloques por oficio, «Solo este bloque» y niveles | `b6_pelu_premium.js` | Ver apartados 2 y 6. |
| 6 | Examen y carpeta Hotmart | `b6_curso_premium.js`, `b6_vista_previa.js` | Ver apartados 4 y 5. |
| 7 | V larga en punta | `b6_pelu_diagrama.js` | Vista de atrás: un triángulo con los lados rectos y una punta, como en el dibujo de Fátima. |
| 8 | Miles de cortes por forma y elevación | `b6_pelu_laboratorio.js`, `b6_pelu_geometria.js`, `b6_pelu_libro_diagrama.js`, `b6_pelu_diagrama.js` | El Laboratorio tiene Cabello, Emparejar y Nivel. Hay 54 combinaciones nuevas de forma × elevación para el libro y el curso. Escena «Error común · cabello mixto u ondulado». El maniquí lleva más cabello de frente. |
| 9 | Nivel 3 Avanzado y bloques sin mezcla (esta entrega) | `b6_pelu_libro_diagrama.js`, `b6_pelu_laboratorio.js` | Ver apartados 3 y 6. |

---

## 2. Cómo se organiza ahora el LIBRO interactivo de Peluquería

### Opciones del Editorial (materia Peluquería)

| Opción | Qué hace |
|---|---|
| **Tema del libro** | Todo · Cortes · Colorimetría · Queratina y alisado (con derriz) · Hidratación · Secado y planchado · Permanente. «Química» se mantiene por compatibilidad. |
| **Solo este bloque** | **Sí:** el libro lleva Fundamentos (`pe_u_fund`) + Cabello (`pe_u_cab`) + las unidades del bloque, y nada más. **No:** el bloque va primero y las demás unidades detrás. |
| **Nivel de las clases** | Todos · 1 Principiante · 2 Intermedio · 3 Avanzado (apartado 6). |
| **Clases por tema** | Todas · 5 · 10 · 20 clases del cerebro de colorimetría por unidad, en su orden. |
| **Anexo con clases de otros temas** | Apagado por defecto. |

### Unidades de cada bloque (medido con «Solo este bloque = Sí», libro de 100 hojas)

| Bloque | Unidades que entran |
|---|---|
| Cortes | Fundamentos, Cabello, Melenas, Capas, Cortos, Media melena, Flequillos, Niños, Rizado, Moda |
| Colorimetría | Fundamentos, Cabello, Raíz, Color global, Balayage, Babylights, Sombré, Mechas con aluminio, Mechas con gorro, Decoloración |
| Queratina y alisado | Fundamentos, Cabello, Alisado con queratina, Botox capilar, Derriz |
| Hidratación | Fundamentos, Cabello, Hidratación profunda, Nutrición |
| Secado y planchado | Fundamentos, Cabello, Secado, Planchado |
| Permanente | Fundamentos, Cabello, Permanente |

### Páginas propias de Peluquería dentro de cada unidad
- **`pe_guia3d`:** un corte de Guías 3D con su esquema de elevación «Mechón n · grados», 4 pasos, «Cómo queda» (atrás, lateral, frente) y un test.
- **`pe_diagrama`:** la diagramación del corte o de la técnica (lateral, frente y capas) con su ficha. En la web lleva «▶ Ver diagramación» con voz.
- **`pe_animada`:** la técnica animada (color, mechas, queratina…) con las mismas escenas, textos y preguntas que su lección del curso.
- **`pe_tecnica`:** las técnicas del Cerebro con sus fotogramas.
- **Repaso con tu tutor, Ejemplo resuelto, Desarrollo, Conclusión:** son las páginas comunes a todas las materias.

Las técnicas, las variantes y los cortes del Laboratorio **solo ocupan huecos de relleno**: no añaden hojas.

**Corrección de esta entrega:** con «Solo este bloque» de un bloque que no es de cortes, antes se colaban técnicas de corte en Fundamentos y Cabello. Ahora no entra ninguna. Medido: 0 páginas de corte y 0 lecciones de corte en Color, Queratina, Hidratación, Secado y Permanente.

---

## 3. Cómo se organiza ahora el CURSO premium

- **Un módulo por cada unidad del libro**, en el mismo orden, y **las mismas clases** que el libro. Libro y curso leen el mismo catálogo (`EU_PARTICIONES.catalogo(cfg)`), así que «Tema», «Solo este bloque», «Nivel» y «Clases por tema» afectan a los dos a la vez.
- **Lecciones de cada módulo:**
  - Ideas clave (mapa animado).
  - Diagramación o Clase de cada técnica (escenas animadas con voz).
  - Técnica del corte, paso a paso (cortes de Guías 3D, técnicas y variantes que lleva el libro).
  - Pizarra, cuando hay operaciones.
  - Ejemplo resuelto, Practica con tu tutor y Conclusión.
  - Test del módulo.
- **Cada corte lleva su error común como escena:**
  - Liso extremo → en vertical queda trasquilado; se corta en horizontal.
  - Mixto u ondulado → en horizontal queda trasquilado; se corta en vertical.
- La primera lección es la **Bienvenida** con las palabras de Fátima.

### Medido (curso de 100 hojas, «Solo este bloque = Sí»)

| Bloque | Módulos | Lecciones | Lecciones de corte | Examen | Módulos que pregunta el examen |
|---|---|---|---|---|---|
| Cortes | 10 | 78 | 30 | 20 | 10 de 10 |
| Colorimetría | 10 | 163 | 0 | 20 | 10 de 10 |
| Queratina y alisado | 5 | 74 | 0 | 20 | 5 de 5 |
| Hidratación | 4 | 55 | 0 | 20 | 4 de 4 |
| Secado y planchado | 4 | 53 | 0 | 20 | 4 de 4 |
| Permanente | 3 | 48 | 0 | 20 | 3 de 3 |

**Las clases no se mezclan:** cada curso trae solo los módulos de su bloque, más Fundamentos y Cabello.

---

## 4. TESTS, EXAMEN y CERTIFICADO

- **Test de cada módulo:** sus preguntas salen de las escenas y textos de ese módulo, que son lo que el alumno acaba de ver.
- **Examen final:** 20 preguntas repartidas **una por módulo, en ronda**, hasta llegar a 20. Antes cortaba en los 7 primeros módulos; ahora pregunta por todos.
- **Certificado:** pide todas las lecciones vistas hasta el final y el examen aprobado con un 70 % o más. Al pulsar sale la celebración con voz. Lleva firma y sello de Fátima, horas cronometradas y número FC-año-xxxxxx.

---

## 5. VISTA PREVIA y carpeta HOTMART

- **«👁 Vista previa · todo»** abre pestañas para el mismo libro: Libro/Ebook interactivo, PDF imprimible, EPUB, Curso premium, Carpeta HOTMART y 💰 Asesor de precio.
- **Carpeta HOTMART (ZIP)** con:
  - `curso/index.html`, que lleva los datos y la animación dentro.
  - `libro/`, `laminas/` y `guion-voz.txt`.
  - `hotmart/`, con módulos, lecciones, vídeos a grabar y tests.
  - `LICENCIA.txt`.
- **Optimización:**

| Libro | ZIP antes | ZIP ahora |
|---|---|---|
| 100 hojas | 83 MB | 33 MB |
| 300 hojas | 197 MB | 83 MB |

  Cómo se consiguió:
  - **Compresión del ZIP.** El ZIP va comprimido (DEFLATE).
  - **Datos sin repetir.** `datos.js` ya no se repite, porque `index.html` lo lleva dentro.
  - **Dibujos más ligeros.** Los dibujos del curso van a tamaño de pantalla (≤ 960 px, calidad 0,72). En `laminas/` siguen los originales.
- **Hotmart no reproduce una página HTML interactiva** dentro de una lección: acepta vídeos y archivos. Por eso, apartado 7.

---

## 6. NIVELES (regla de Fátima)

| Nivel | Quién | Qué ve |
|---|---|---|
| **1 · Principiante** | Nunca ha agarrado una tijera | Cortes **sin elevación**, todo a 0°: cuadrado, redondo/U, V. Son las 6 técnicas de su infografía y las combinaciones a 0°. Clases de colorimetría `_p`. |
| **2 · Intermedio** | Domina la tijera | Cortes **con elevación** (45°, 90°, 120°, 135°, 180°… hasta 225°) en todas las formas: mariposa, V, cuadrado, redondo, rectangular. Clases `_i`. |
| **3 · Avanzado** | Domina tijera **y navaja** | Lo del intermedio **más** los cortes con acabado de navaja o tijera de desgrafilar: box asimétrico, desgrafilados, mariposa desgrafilada, zigzag y navaja en puntas. Clases `_a`. |

Medido en un libro de Cortes de 700 hojas:
- **Nivel 1:** 41 diagramas, todos a 0°.
- **Nivel 2:** 41 diagramas, todos con elevación y ninguno desgrafilado.
- **Nivel 3:** 46 diagramas, de los que 10 son desgrafilados.

En el **🧪 Laboratorio** hay ahora:
- Un campo «Acabado»: recto / navaja o tijera de desgrafilar / mezcla.
- El filtro «3 · Avanzado».

Con 3 000 cortes en «Mezcla» salieron 1 489 de intermedio y 1 511 de avanzado.

**A validar por Fátima:**
- **Navaja a medio centímetro:** la técnica «después de elevar a 90°, pasar la navaja a medio centímetro» se usa como regla de nivel. Todavía no tiene una escena animada propia; se hace si ella la pide.
- **Cortes a 0° desgrafilados:** cinco cortes del nivel 3 están todos a 0° pero llevan acabado desgrafilado, como la pollina. Cuentan como avanzados por el uso de la navaja o la tijera de desgrafilar.

---

## 7. PROPUESTA para vender (no programada; para que Fátima decida)

**Idea de Fátima:**
- Una landing.
- El curso y el libro publicados en Netlify.
- Acceso con contraseña para quien compra en Hotmart, Instagram, Facebook o Telegram.
- Poder quitar el acceso o dejarlo de por vida.

**Cómo encaja con lo que ya existe:**
1. **Publicar.**
   - El curso (`curso/index.html`) y el libro web ya son páginas autónomas.
   - Se suben tal cual a Netlify, uno por carpeta: `/curso-cortes/`, `/curso-color/`…
2. **Biblioteca en UNIVERSO.**
   - Una página «Mi biblioteca» lista los cursos que la alumna tiene.
   - Fátima sube el curso desde el Estudio.
3. **Acceso con contraseña.** Dos caminos:
   - **Firebase Auth** (recomendado).
     - El proyecto ya lo usa en `b6_acceso.js` para Fátima.
     - Cada alumna tendría usuario y contraseña, y una lista de cursos con fecha de fin o «de por vida».
     - Quitar el acceso = cambiar esa lista.
     - Necesita una pequeña base de datos (Firestore) y reglas de seguridad. **Toca Firebase, así que requiere tu autorización expresa.**
   - **Contraseña de Netlify por sitio.**
     - Es más simple: una sola contraseña para todos los que compran ese curso.
     - Necesita el plan de pago de Netlify.
     - No permite quitar el acceso a una persona sola.
4. **Hotmart, Instagram, Facebook y Telegram.**
   - Venta por Hotmart: en la entrega del producto se pone el enlace a la biblioteca y las instrucciones para crear la cuenta.
   - Venta por Instagram, Facebook o Telegram (pago directo): Fátima da de alta a la alumna a mano en la biblioteca.
5. **Riesgos.**
   - El repositorio de GitHub es **público**: cualquiera puede ver el código. Los cursos publicados deberían ir en un sitio aparte, no en el repositorio.
   - Un enlace sin contraseña se puede compartir.

**Siguiente paso, si Fátima lo aprueba:** un plan por fases.
1. Landing.
2. Biblioteca con login.
3. Panel para dar y quitar acceso.

Cada fase con su aprobación, sin tocar lo que ya funciona.

---

## 8. PENDIENTE y A VALIDAR

- Escena propia de **navaja a medio centímetro**: solo si Fátima la pide.
- **Técnica 1 y Técnica 3:** comparten la misma V larga por detrás. ¿La «en punta» debe ser más larga?
- **Libros cortos (100 y 300 hojas) del bloque Cortes:** los huecos ya los llenan las técnicas de Fátima, así que las 54 combinaciones nuevas aparecen sobre todo en libros largos. Se puede cambiar el orden si ella quiere.
- **Hojas vacías:** no se reprodujeron. Hace falta un caso concreto: materia, número de hojas, producto y página.
- **Elevaciones de ejemplo** de Shanghái, box, mariposa y desgrafilados: siguen «a validar por Fátima».
- **Venta (apartado 7):** pendiente de su decisión.
