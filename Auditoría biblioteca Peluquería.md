# Auditoría · biblioteca de Peluquería (`pelu`)

Total registrado: **145** = 100 (b6_lib_peluqueria 1–4) + 5 láminas de elevación + 40 fichas de corte (b6_pelu_fichas).
`b6_pelu_tecnica.js` existe pero NO se carga (duplicaba elevaciones y fichas; deja fuera las 27 láminas de divisiones).
Se suman figuras genéricas de EU_SVG: `tonos`, `pel_cabello`, `pel_ph`, `pel_color` (alias de Química), `pel_dilucion` (alias de Química).

## Fuera de peluquería (11) — propuesta: quitar de `pelu`
pe_manicura, pe_uña, pe_piel_tipos, pe_depilacion_cera, pe_cejas, pe_limpieza_facial, pe_maquillaje, pe_pinzas_depilar,
pe_esterilizador (vale), pe_barba (barbería: se queda), pe_masaje_capilar y pe_mascarilla (cuero cabelludo: se quedan).
→ Salen 8: manicura, uña, piel_tipos, depilación con cera, cejas, limpieza facial, maquillaje, pinzas de depilar.

## Duplicados (5)
- pe_elevacion (0/45/90) ⟷ pe_elev_0…180 (5 láminas): queda la serie de 5.
- pe_caspa ⟷ pe_cuero: queda pe_cuero.
- pe_degradado ⟷ pe_fade_niveles: queda pe_fade_niveles.
- pe_secciones ⟷ divisiones de EU_DIVISIONES (no conectadas): se conectan las 27 divisiones.
- pel_color / pel_dilucion: alias de Química, no son de pelo → fuera.

## Por qué se ve repetido
Las 40 fichas de corte usan el mismo dibujo (maniquí de perfil + mechas de colores); solo cambian los ángulos.
En un libro salen hasta 40 páginas casi iguales.

## Lo que falta y ya existe en el Estudio
- 27 láminas de divisiones (EU_DIVISIONES): perfil, planta y nuca.
- 4 pasos + resultado por corte (EU_CORTES.guiaDe → pasos, elevB, partición, herramienta).
- Cabeza 3D de Guías 3D para el resultado final.

## Hecho (b6_pelu_limpieza.js, cargado entre b6_pelu_fichas y b6_pelu_orden)
- Fuera 11: los 8 de estética + pe_elevacion, pe_caspa, pe_degradado (filtrados de EU_MODELOS y EU_SVG).
- pel_color / pel_dilucion ya no entran en el libro (b6_pelu_orden).
- Conectadas las 27 divisiones (familia `div`, `pe_div_<lámina>`), asignadas a la unidad «Secciones, elevación y mecha guía».
- Pendiente: sustituir las 40 fichas genéricas por los 4 pasos de Guías 3D.
  → Hecho en `b6_pelu_guias.js` (familia `g3d`, `pe_g3d_<corte>_<paso>`, render con `<guias-3d>.laminaURL` en un ejemplar oculto).
    `b6_pelu_orden` ya usa los pasos y deja la ficha solo si el corte no tiene guía. AÚN NO se carga en el Estudio: falta probarlo en `_prueba_pelu_guias.html`.

## Organización propuesta (bloques)
1. Herramientas y aparatos · 2. El cabello · 3. Divisiones y particiones · 4. Elevaciones · 5. Cortes (ficha = 4 pasos + resultado, una por corte, sin repetir dibujo base) · 6. Color y química · 7. Peinados · 8. Higiene, seguridad y salón.
