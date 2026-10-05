# Auditoría final — libros de 300 páginas (3 oct 2026)

Herramienta: `_auditoria_final.html` → `AUD(materias, países)` y luego `RES()`. Carga los mismos módulos que el Estudio.
Mide en cada libro: páginas < 85 % de llenado, desbordes (> 102 %), NaN/undefined, páginas vacías, % de frases repetidas,
dibujos de la biblioteca usados y dibujos repetidos (más de 2 veces).

Libros auditados: 96 (32 materias en España, 32 en México, 32 repartidas entre CO, AR, CL, VE, DO y US).

## Resultado

En los 96 libros: 0 páginas bajo el 85 %, 0 desbordes, 0 NaN/undefined, 0 páginas vacías, 0 dibujos repetidos.

Único fallo encontrado y corregido: Comercio electrónico (México), p. 28, lectura al 65 %. Al arreglar un desborde se
quitaban de golpe la figura y las cajas «dato», «error» e «investiga» y la página quedaba corta.
Ahora `b6_relleno_total.js` devuelve lo que vuelva a caber y, en materias de adultos, vuelve a rellenar con `EU_ECOM.llenar`
las páginas recortadas.

## España, por materia

| Materia | llenado mín. | frases repetidas | dibujos de la biblioteca |
|---|---|---|---|
| lengua | 85 % | 11 % | 98 / 100 |
| mate | 86 % | 18 % | 100 / 100 |
| conta | 85 % | 27 % | 100 / 100 |
| natu | 86 % | 14 % | 99 / 100 |
| soci | 85 % | 19 % | 101 / 101 |
| ingles | 85 % | 12 % | 100 / 100 |
| arte | 86 % | 17 % | 101 / 101 |
| musica | 86 % | 16 % | 50 / 50 |
| efisica | 86 % | 16 % | 50 / 50 |
| tecno | 86 % | 22 % | 50 / 50 |
| valores | 86 % | 20 % | 50 / 50 |
| religion | 85 % | 15 % | 50 / 50 |
| pelu | 86 % | 11 % | 74 / 100 |
| idiomas | 85 % | 13 % | 50 / 50 |
| reposteria | 85 % | 20 % | 100 (de cocina) |
| panaderia | 85 % | 13 % | 100 / 100 |
| pasteleria | 85 % | 23 % | 100 / 100 |
| batidos | 85 % | 24 % | 100 / 100 |
| cocina | 85 % | 15 % | 170 (cocina + batidos) |
| infantil | 85 % | 30 % | 50 / 50 |
| bio | 85 % | 8 % | 187 (bio + anatomía) |
| anat | 85 % | 15 % | 100 / 100 |
| fisica | 85 % | 31 % | 100 / 100 |
| quimica | 85 % | 15 % | 100 / 100 |
| geografia | 86 % | 15 % | 101 (de sociales) |
| geoalg | 86 % | 21 % | 86 (de mate) |
| calculo | 85 % | 27 % | 49 / 50 |
| empre | 85 % | 18 % | 50 / 50 |
| mkt | 85 % | 25 % | 50 / 50 |
| ia | 85 % | 29 % | 49 / 50 |
| redes | 85 % | 27 % | 49 / 50 |
| ecom | 85 % | 25 % | 43 / 50 |

Frases repetidas: antes 21–87 % (auditoría de septiembre), ahora 8–31 %.

## Lo que queda

- Peluquería saca 74 de 100 dibujos: sus 27 unidades no dejan más huecos sin quitar contenido propio.
- Frases repetidas más altas: Física 31 %, Infantil 30 %, IA 29 % (sobre todo enunciados de rutina y cabeceras).
- Comercio electrónico 43/50 dibujos.
