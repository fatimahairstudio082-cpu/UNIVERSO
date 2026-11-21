# Auditoría · hojas a mitad y elementos infantiles · Peluquería y Colorimetría

21-11-2026 · solo materia `pelu` · código de PRODUCCIÓN (`main`, commit 3434ab0, PR #62). No se ha cambiado nada del sistema.

## Cómo se midió
- Se sirvió la app en local y se armó el libro con el mismo camino que usa el Editorial: armado por tandas, ajuste de páginas terminado y documento imprimible.
- Se esperó a que el maniquí de Guías 3D estuviera listo antes de armar, como pasa en tu navegador. El entorno de prueba no podía descargar la librería 3D, así que se le dio una copia local solo para la prueba; el proyecto no se tocó.
- Cada hoja: % de alto ocupado por el contenido y si el contenido se sale de la hoja. Se buscaron los textos «Dibuja», «Dibújate», «Este libro es de», «mapa mental», «Repasa la palabra» y «Colorea».
- Casos: Libro Principiante 100 hojas, Libro Intermedio 300, Libro Profesional 300 y Libro profesional Profesional 100.

## Resultados

| Caso | Páginas | Hojas < 60 % llenas | Hojas que se salen |
|---|---|---|---|
| Libro · Principiante 100 | 139 | 14 (13 `pe_clase`) | 2 |
| Libro · Intermedio 300 | 413 | 58 (57 `pe_clase`) | 37 (33 `pe_diagrama`) |
| Libro · Profesional 300 | 500 | 84 (70 `pe_clase`, 12 `pe_salon`, 1 solucionario) | 9 |
| Libro profesional · Profesional 100 | 223 | 24 (23 `pe_clase`) | 7 |

La contraportada se cuenta aparte; está vacía a propósito.

### 1. Hojas a mitad: la causa principal es la hoja de la clase (`pe_clase`, `b6_pelu_receta.js`)
- «La receta, paso a paso» se corta cada **12 pasos** (`b6_pelu_receta.js:620-621`, `LIM = 12`).
- Una receta de 13 pasos deja una 2.ª hoja con **un solo paso**, la práctica y «A continuación». Esa hoja queda al 36-41 %. Captura: `screenshots/auditoria_pelu_21-11-2026_receta_2de2.jpg`.
- La 1.ª hoja, con 12 pasos de una línea, también se queda en el 55-58 %. Captura: `…_receta_1de2.jpg`.
- Esas hojas llevan la marca «ya va llena», así que el relleno no las toca.

### 2. «En el salón» del Regalo (`pe_salon`, `b6_pelu_laminas_libro.js`)
- En las unidades «Regalo · Cejas / Pestañas» (Diseño y mapeo…) la hoja sale con 5 líneas, una pregunta y nada más: un 34 %.
- No hay técnica animada de esas unidades, así que no se pone escena del maniquí. Captura: `…_en_el_salon.jpg`.

### 3. Hojas que se salen
- `pe_diagrama` en el Intermedio 300 (33 hojas) y algunas `pe_animada`/`pe_clase`.
- Ya estaba anotado en CLAUDE.md que «En U con capas largas» se salía en producción.

### 4. Elementos infantiles
- **«Este libro es de ___» + «Dibújate aquí»**: hoja 2 del **Libro profesional** (`b6_editorial_motor.js:872-874`, `creditos`). **Confirmado.** Captura: `…_dibujate_aqui.jpg`.
- **«Mapa mental»** en «Un paso más»:
  - Hoja con un esquema de ramas y «Añade una rama nueva… y explica por qué».
  - Sale en todos los niveles, y 17 veces en el Profesional 300.
  - No pide dibujar, pero es un ejercicio escolar. Captura: `…_mapa_mental.jpg`.
- **«se dibuja el zigzag»**: es tu texto de la técnica de mechas. Está bien.
- **«colorear»**: es «cortar, colorear, peinar o secar». Está bien.
- **No aparecen** en el libro de Peluquería: «Dibuja aquí lo que quieras», «Repasa la palabra», frutas, plantas ni bodegones. La biblioteca genérica sigue desconectada.

## Lo que no se ha comprobado
- El libro web/ebook y el EPUB: solo se midió el imprimible.
- El libro dentro del ZIP del curso premium. Usa el mismo armado, así que debería salir igual, pero no se ha medido.
- A4 frente a carta: solo se midió el papel automático.

---

## Después de las correcciones (mismo día, aprobadas por Fátima)

### Cambios hechos (solo `pelu`)
1. **Hoja 2:** en el Libro profesional ya sale «Lo que vas a aprender» con las unidades y su primera idea, en vez de «Este libro es de / Dibújate aquí». Cambio en `b6_editorial_motor.js`: con Peluquería, `pro_capitulo` cuenta como unidad.
2. **Sin «Mapa mental» ni «Mapa conceptual»** en ninguna unidad:
   - `b6_cerebro_svg.js`, filtro `pelu`;
   - `b6_cerebro_libro.js`, la síntesis ya no los pide para Peluquería.
3. **Receta unida:** una receta de 13 pasos va en una sola hoja si cabe; antes quedaba una hoja con un solo paso. Se renumeran las páginas y el solucionario.
4. **`b6_pelu_llenar.js` (nuevo):** las hojas de clase, receta, «En el salón», técnica, diagrama y escena con hueco se completan solo con lo suyo, de esa misma clase o unidad y sin repetir:
   - imágenes de su Galería web que son esa técnica o ese corte, con su título y su descripción;
   - escenas del maniquí de esa clase que la hoja no enseñaba;
   - errores comunes, recomendaciones, ficha y paso a paso de la técnica en el Cerebro, y errores comunes de la unidad.
   Si sobra sitio, las imágenes se agrandan. Esas hojas ya no reciben el «Observa» genérico del relleno general.
5. **Diagrama:** las imágenes llevan su proporción, así el medidor cuenta su alto (`b6_pelu_libro_diagrama.js`). Se ven igual.
6. **Curso premium sincronizado:** las imágenes de la galería que el libro pone con una clase entran en la lección de esa clase, antes de «A continuación».

### Medido después (mismo arnés)
| Caso | Páginas | < 60 % antes → después | Se salen antes → después |
|---|---|---|---|
| Libro · Principiante 100 | 139 → 138 | 13 → 0 | 2 → 1 |
| Libro · Intermedio 300 | 413 → 402 | 57 → 1 (solucionario) | 37 → 17 |
| Libro · Profesional 300 | 500 → 485 | 83 → 11 | 9 → 5 |
| Libro profesional · Profesional 100 | 223 → 217 | 23 → 0 | 7 → 3 |

En las cifras de < 60 % no se cuenta la contraportada.

- **«Dibújate», «Este libro es de», «mapa mental»:** 0 en los cuatro libros. «se dibuja el zigzag» y «colorear» son textos de la autora y se quedan.
- **Curso (Principiante 100):** las 20 imágenes de la galería que entraron en el libro están en sus lecciones; ninguna imagen ni escena se repite en el libro.
- **Matemáticas:** el documento sale idéntico al de antes, byte a byte.
- **Capturas:** `screenshots/auditoria_pelu_21-11-2026_despues_*.jpg`.

### Lo que queda (no se ha tocado)
- **Regalo · cejas y pestañas:** las tres hojas «En el salón» de cada unidad repiten las mismas cinco ideas (ya pasaba). Con su ficha y sus pasos suben del 34 % a 45–59 %. No hay imágenes ni maniquí de esas técnicas.
- **Diagrama del Intermedio:** 13 hojas siguen pasándose 1–15 mm con su propio contenido (tres vistas, ficha y «Compruébalo»); antes eran 33.
- **Técnica animada:** una por libro se sale; el medidor no ve el alto de sus imágenes. Ya pasaba.
- **Imágenes ligadas a «Tinte en cabello virgen»:** algunas son retratos de su carpeta de teoría del color («Negro liso perfil»). Así las liga la galería; Fátima puede indicar si las quiere en otra clase.
- **No verificado:** el EPUB, el ZIP del curso descargado y el papel carta.
