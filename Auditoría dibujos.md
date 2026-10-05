# Auditoría de dibujos — 30-09-2026

Banco de pruebas: `_auditoria_dibujos.html` (`#gen:0-127` prueba los generadores; `#lib:mate@120,lengua` ensambla libros y cuenta huecos).

## Biblioteca
| Fuente | Dibujos |
|---|---|
| Láminas registradas en `EU_SVG.visual` (todas las materias) | 127 |
| Tipos base de `EU_SVG` (curva, gráfica, datos, esquema, ordena, sopa, cuerpo, info) | 8 |
| `EU_BOTANICA` (frutas, plantas, vajilla, animales; 6 grupos) | 109 |
| `EU_GEO_VISUAL` (Geometría y Álgebra, Cálculo) | 40 |
| `EU_INFANTIL` (figuras de infantil) | 22 |
| `EU_TALLER` (láminas de cocina) | 12 |
| **Total** | **318** |

Dentro de las 127 hay 15 de `EU_DIBUJOS`, 17 de `EU_DIBUJOS2` y 29 de `EU_DIBUJOS3`.

**2D y 3D:** todos admiten los dos modos (`cfg.acab.dibujo`). Se probaron las 127 láminas en 2D y en 3D, en hasta 4 materias cada una y con 3 unidades por materia: 2096 dibujos correctos y 0 errores.
- `dic_test` es una tabla de texto y no lleva dibujo, como está previsto.
- `emp_equilibrio` solo aparece en el producto «Emprender».

## Causa de los huecos
1. La apertura de cada unidad llevaba el marco discontinuo «Ilustración de apertura» y solo se llenaba si había imágenes subidas. Solo Geometría y Álgebra y Cálculo lo cambiaban por un dibujo. En cualquier otra materia salía 1 hueco por unidad: 5 en un libro de 40 páginas y 12 en uno de 120.
2. En libros de hasta 60 páginas no aparecían páginas visuales (`vis`), porque `b6_cerebro_libro.js` convierte ese relleno en lecturas. Desde unas 120 páginas vuelve a salir aproximadamente una por unidad.

## Corrección
`b6_apertura_dibujo.js`, cargado después de `b6_geometria_visual.js`, cambia los huecos de «apertura» y «Cerca de ti» por un dibujo de la biblioteca de la materia, en 2D o 3D. Si la materia no tiene ninguno, usa la figura de la unidad y, si tampoco la hay, un bodegón de `EU_BOTANICA`. Cuando hay imágenes subidas, se usan esas.

Resultado en libros de 40 páginas de lengua, mate, natu, soci, inglés, idiomas, infantil, música, conta, empre y repostería: 0 huecos.
