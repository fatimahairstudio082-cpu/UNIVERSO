# Auditoría técnica — libros de 300 páginas (España, semilla 1, 30-09-2026)

Banco: `_test_redes.html#aud:materia1,materia2…` (ensambla 300 págs. y mide cada página).

## Criterios de «profesional»
| Criterio | Umbral |
|---|---|
| Llenado de cada página | ≥ 85 % |
| Desbordes / NaN / páginas vacías / huecos sin dibujo | 0 |
| Frases repetidas | ≤ 30 % |
| Unidades | ≥ 10 (≤ 30 págs. por unidad) |
| Páginas con dibujo | ≥ 40 % (120 de 300) |
| Tiempo de ensamblado | ≤ 8 s |

## Resultado global
Las 32 materias cumplen: 300 págs., llenado mínimo 85–88 %, 0 NaN, 0 vacías, 0 huecos. **Ninguna cumple el tiempo** (5–18 s).

## Materias que no cumplen

| Materia | Repetición | Unidades | Págs./unidad | Dibujos | Tiempo | Fallos |
|---|---|---|---|---|---|---|
| fisica | **45 %** | 14 | 21 | 147 | 12 s | repetición |
| conta | **40 %** | **9** | 33 | 150 | 13 s | repetición, unidades |
| soci | **34 %** | 10 | 30 | 131 | 10 s | repetición |
| batidos | **34 %** | 20 | 15 | 148 | 11 s | repetición |
| ia | **34 %** | 19 | 16 | 123 | 6 s | repetición |
| pasteleria | **32 %** | 20 | 15 | 150 | 12 s | repetición |
| quimica | 25 % | **5** | **60** | 163 | 11 s | unidades |
| anat | 28 % | **6** | **50** | **114** | 12 s | unidades, dibujos |
| geografia | 29 % | **6** | **50** | **105** | 10 s | unidades, dibujos |
| bio | 23 % | **7** | **43** | 136 | 13 s | unidades |
| tecno | 27 % | **8** | 38 | 166 | 12 s | unidades |
| arte | 29 % | **9** | 33 | 165 | 11 s | unidades |
| lengua | 16 % | 12 | 25 | **108** | 12 s | dibujos |
| pelu | 11 % | 27 | 11 | **111** | **18 s** | dibujos, tiempo |
| musica | 21 % | 10 | 30 | **111** | 10 s | dibujos |
| religion | 19 % | 13 | 23 | **117** | 10 s | dibujos |
| redes | 29 % | 23 | 13 | **97** | 6 s | dibujos |
| idiomas | 16 % | 35 | 9 | 184 | 11 s | 1 desborde (p. 287 glosario, 106 %) |
| calculo | 30 % | 16 | 19 | 156 | 15 s | en el límite de repetición |

Cumplen todo salvo el tiempo: mate, natu, ingles, infantil, valores, efisica, cocina, reposteria, panaderia, geoalg, empre, mkt, ecom.

## Causas
- **Pocas unidades** (química 5, anatomía y geografía 6, biología 7): una unidad se estira a 40–60 págs., y eso produce páginas de lectura y relleno parecidas. Es la causa principal de que no se lean como libros profesionales.
- **Repetición alta** (física, conta, soci, recetarios, IA): los enunciados de los generadores repiten plantilla y solo cambian los números.
- **Pocos dibujos** (lengua, música, religión, geografía, anatomía, pelu, redes): hay pocos tipos registrados para esas materias en `EU_SVG.visual` y el relleno usa texto.
- **Tiempo**: el ensamblado de 300 págs. bloquea la página 10–18 s mientras se genera. Mientras tanto la app parece colgada.

## Prioridad propuesta
1. Unidades: química +5, anatomía +4, geografía +4, biología +3, tecnología +2, arte +1, conta +1.
2. Repetición: variantes de enunciado en física, conta, soci, IA y recetarios.
3. Dibujos: +3–5 tipos para lengua, música, religión, geografía, anatomía, pelu y redes.
4. Tiempo: ensamblar por tramos, con aviso de progreso, para que la página no se bloquee.
5. Glosario de idiomas: dividir la p. 287.

## Primera ampliación (b6_dibujos_plus4.js, 20 dibujos)
Páginas con dibujo en 300 págs. (antes → ahora): geografía 105 → 132, soci 131 → 160, mate 162 → 180, geoalg 181 → 196, natu 155 → 174, tecno 166 → 170. En soci la repetición baja del 34 al 30 %. Siguen 0 huecos, 0 desbordes y llenado ≥ 85 %.
