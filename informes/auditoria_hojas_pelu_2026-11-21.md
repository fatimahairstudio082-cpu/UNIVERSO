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
