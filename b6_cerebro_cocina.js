/* b6_cerebro_cocina.js — cerebro de cocina del Editorial.
   Repostería, panadería, pastelería y batidos naturales. Cada receta sabe
   escalarse a las porciones pedidas, hablar con el léxico del país (frutilla,
   manteca, arequipe, cambur…), dar tazas y °F en EE. UU. y calcular su costo
   en la moneda local. Los batidos se combinan solos para llenar libros largos.
   Registra materias, técnicas (unidades), el producto «recetario» y sus páginas. */
(function () {
  'use strict';
  if (window.EU_COCINA || !window.EU_EDITORIAL) return;
  var ED = window.EU_EDITORIAL, H = ED.H;

  /* ─────────── léxico del país ─────────── */
  var LEX = [
    ['fresas', { ar: 'frutillas', cl: 'frutillas' }], ['fresa', { ar: 'frutilla', cl: 'frutilla' }],
    ['plátanos', { ar: 'bananas', co: 'bananos', do: 'guineos', ve: 'cambures', us: 'bananas' }], ['plátano', { ar: 'banana', co: 'banano', do: 'guineo', ve: 'cambur', us: 'banana' }],
    ['durazno', { es: 'melocotón' }], ['mantequilla', { ar: 'manteca' }], ['crema de leche', { es: 'nata para montar' }],
    ['azúcar glas', { ar: 'azúcar impalpable', cl: 'azúcar flor', mx: 'azúcar glass', co: 'azúcar pulverizada', us: 'azúcar glass' }],
    ['maracuyá', { es: 'fruta de la pasión', ve: 'parchita', do: 'chinola' }], ['papaya', { ve: 'lechosa', do: 'lechosa' }], ['piña', { ar: 'ananá' }],
    ['zumo', { mx: 'jugo', co: 'jugo', ar: 'jugo', cl: 'jugo', ve: 'jugo', do: 'jugo', us: 'jugo' }],
    ['polvo de hornear', { es: 'levadura química', ar: 'polvo de hornear' }], ['harina de fuerza', { ar: 'harina 000', mx: 'harina para pan', co: 'harina para pan', cl: 'harina sin polvos de hornear', us: 'harina para pan' }],
    ['dulce de leche', { mx: 'cajeta', co: 'arequipe', cl: 'manjar' }], ['batido', { mx: 'licuado', ar: 'licuado' }], ['Batido', { mx: 'Licuado', ar: 'Licuado' }],
    ['batidora de vaso', { mx: 'licuadora', co: 'licuadora', ar: 'licuadora', cl: 'juguera', ve: 'licuadora', do: 'licuadora', us: 'licuadora' }],
    ['maicena', { es: 'harina de maíz refinada (maicena)' }], ['bizcocho', { ar: 'bizcochuelo', cl: 'queque', co: 'ponqué', mx: 'pastel' }], ['Bizcocho', { ar: 'Bizcochuelo', cl: 'Queque', co: 'Ponqué', mx: 'Pastel' }]
  ];
  var LEXR = LEX.map(function (p) { return [new RegExp('(^|[^A-Za-zÁÉÍÓÚáéíóúñÑ])' + p[0] + '(?![A-Za-zÁÉÍÓÚáéíóúñÑ])', 'g'), p[1]]; });
  function loc(t, C) {
    t = String(t == null ? '' : t);
    LEXR.forEach(function (p) { var r = p[1][C.pk]; if (r) t = t.replace(p[0], '$1' + r); });
    return H.sub(t, C);
  }

  /* ─────────── medidas ─────────── */
  var TAZA = { harina: 125, 'harina de fuerza': 130, 'harina integral': 120, azúcar: 200, 'azúcar moreno': 200, 'azúcar glas': 120, mantequilla: 227, cacao: 85, arroz: 200, avena: 90, 'copos de avena': 90, maicena: 130, 'queso crema': 230, yogur: 245, nueces: 110, coco: 80 };
  function tazas(g, nombre) {
    var k = Object.keys(TAZA).filter(function (x) { return nombre.toLowerCase().indexOf(x) === 0; }).sort(function (a, b) { return b.length - a.length; })[0];
    if (!k) return '';
    return fr(g / TAZA[k]) + ' taza' + (g / TAZA[k] > 1.1 ? 's' : '');
  }
  function fr(x) {
    var e = Math.floor(x), d = x - e, f = [[0, ''], [0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.66, '⅔'], [0.75, '¾'], [1, '']].reduce(function (a, b) { return Math.abs(b[0] - d) < Math.abs(a[0] - d) ? b : a; });
    if (f[0] === 1) { e++; f = [0, '']; }
    return (e ? e : '') + (e && f[1] ? ' ' : '') + (f[1] || (e ? '' : '¼'));
  }
  function cant(ing, factor, C) {
    var q = ing[0] * factor, u = ing[1], n = ing[2], us = C.pk === 'us';
    var red = function (v) { return v >= 100 ? Math.round(v / 5) * 5 : v >= 10 ? Math.round(v) : Math.round(v * 10) / 10; };
    if (u === 'g') return H.num(red(q), C) + ' g' + (us && tazas(q, n) ? ' (' + tazas(q, n) + ')' : '');
    if (u === 'ml') return (q >= 1000 ? H.num(Math.round(q / 100) / 10, C) + ' l' : H.num(red(q), C) + ' ml') + (us ? ' (' + fr(q / 240) + ' taza' + (q / 240 > 1.1 ? 's' : '') + ')' : '');
    if (u === 'ud') { var v = Math.max(1, Math.round(q)); return String(v); }
    if (u === 'cda' || u === 'cdta') { var z = Math.max(0.5, Math.round(q * 2) / 2); return fr(z).trim() + ' ' + (u === 'cda' ? 'cucharada' : 'cucharadita') + (z > 1 ? 's' : ''); }
    return u;
  }
  function temp(c, C) { return c ? (C.pk === 'us' ? Math.round(c * 9 / 5 + 32 / 5) * 5 + ' °F (' + c + ' °C)' : c + ' °C') : 'Sin horno'; }

  /* costo orientativo por kg o litro (en euros) → moneda local por escala del país */
  var COSTO = { harina: 0.9, 'harina de fuerza': 1.2, 'harina integral': 1.6, azúcar: 1.1, 'azúcar glas': 2, 'azúcar moreno': 1.8, mantequilla: 9, huevo: 0.28, leche: 1, 'crema de leche': 4.5, yogur: 2.4, aceite: 2.5, chocolate: 11, cacao: 9, levadura: 12, sal: 0.5, 'queso crema': 8, arroz: 1.4, 'dulce de leche': 6, maicena: 2.4, fruta: 2.6, avena: 1.8, agua: 0, miel: 9, semillas: 7, coco: 5 };
  function precioKg(n) {
    n = n.toLowerCase();
    var k = Object.keys(COSTO).filter(function (x) { return n.indexOf(x) >= 0; }).sort(function (a, b) { return b.length - a.length; })[0];
    return k != null ? COSTO[k] : COSTO.fruta;
  }
  function escala(C) { return C.P.precios[2][1] / 2.5; }
  function costoIng(ing, factor, C) {
    var q = ing[0] * factor, u = ing[1], pk = precioKg(ing[2]) * escala(C);
    if (u === 'g' || u === 'ml') return q / 1000 * pk;
    if (u === 'ud') return (ing[2].indexOf('huevo') >= 0 ? precioKg('huevo') * escala(C) : pk * 0.15) * Math.max(1, Math.round(q));
    return pk * 0.01;
  }

  /* ─────────── recetas ───────────
     p: porciones · min: minutos · h: horno °C · d: dificultad 1–3 · ing: [cantidad, unidad, ingrediente]
     s: pasos «Título: texto» · c: consejo · e: error frecuente · v: variante · al: nombre por país */
  var REC = [];
  function r(cat, id, n, o) { o.cat = cat; o.id = id; o.n = n; REC.push(o); }

  r('reposteria', 'bizcocho_yogur', 'Bizcocho de yogur', { al: { mx: 'Pastel de yogur', ar: 'Bizcochuelo de yogur', cl: 'Queque de yogur', co: 'Ponqué de yogur' }, p: 8, min: 50, h: 180, d: 1,
    ing: [[3, 'ud', 'huevos'], [125, 'g', 'yogur natural'], [200, 'g', 'azúcar'], [100, 'ml', 'aceite de girasol'], [250, 'g', 'harina de trigo'], [16, 'g', 'polvo de hornear'], [1, 'pizca', 'sal'], [1, 'ud', 'limón (la ralladura)']],
    s: ['Prepara: enciende el horno a 180 °C y engrasa un molde de 22 cm.', 'Bate: los huevos con el azúcar durante 5 minutos, hasta que blanqueen y doblen su volumen.', 'Suma: el yogur, el aceite y la ralladura sin dejar de batir.', 'Tamiza: la harina con el polvo de hornear y la sal, e intégralos con espátula en movimientos envolventes.', 'Hornea: de 35 a 40 minutos, sin abrir la puerta durante los primeros 25.', 'Comprueba: un palillo en el centro debe salir limpio. Deja templar 10 minutos y desmolda.'],
    c: 'Con los huevos a temperatura ambiente el batido sube el doble.', e: 'Abrir el horno antes de tiempo: el centro se hunde.', v: 'Cambia el limón por naranja y añade 50 g de chips de chocolate.' });
  r('reposteria', 'galletas_mantequilla', 'Galletas de mantequilla', { p: 24, min: 35, h: 180, d: 1,
    ing: [[200, 'g', 'mantequilla (blanda)'], [100, 'g', 'azúcar glas'], [1, 'ud', 'huevo'], [300, 'g', 'harina de trigo'], [1, 'cdta', 'esencia de vainilla'], [1, 'pizca', 'sal']],
    s: ['Crema: bate la mantequilla blanda con el azúcar glas hasta que quede pálida.', 'Liga: añade el huevo y la vainilla, y bate un minuto más.', 'Harina: incorpora la harina y la sal sin amasar de más, solo hasta que se una.', 'Frío: envuelve la masa y déjala 30 minutos en la nevera.', 'Forma: estira a 5 mm, corta y coloca en bandeja con papel.', 'Hornea: de 10 a 12 minutos, hasta que los bordes se doren apenas.'],
    c: 'Saca las galletas cuando el centro aún parezca blando: terminan de hacerse fuera.', e: 'Amasar mucho: la galleta sale dura.', v: 'Mitad de la masa con 20 g de cacao: haz galletas bicolor en espiral.' });
  r('reposteria', 'magdalenas', 'Magdalenas de limón', { al: { mx: 'Panquecitos de limón', ar: 'Muffins de limón', cl: 'Muffins de limón', co: 'Muffins de limón', us: 'Muffins de limón', ve: 'Ponquecitos de limón', do: 'Bizcochitos de limón' }, p: 12, min: 40, h: 200, d: 1,
    ing: [[2, 'ud', 'huevos'], [150, 'g', 'azúcar'], [120, 'ml', 'leche'], [120, 'ml', 'aceite de girasol'], [220, 'g', 'harina de trigo'], [10, 'g', 'polvo de hornear'], [1, 'ud', 'limón (la ralladura)']],
    s: ['Bate: huevos y azúcar hasta que espumen.', 'Líquidos: añade leche, aceite y ralladura.', 'Secos: tamiza la harina con el polvo de hornear y mezcla lo justo.', 'Reposo: deja la masa 30 minutos en la nevera; así sale el copete.', 'Llena: los moldes hasta tres cuartos y espolvorea azúcar por encima.', 'Hornea: a 200 °C durante 15 a 18 minutos.'],
    c: 'El contraste entre masa fría y horno caliente es lo que las hace subir en pico.', e: 'Llenar el molde hasta arriba: se desbordan.', v: 'Añade arándanos enharinados justo antes de llenar los moldes.' });
  r('reposteria', 'brownie', 'Brownie de chocolate', { p: 12, min: 45, h: 180, d: 1,
    ing: [[200, 'g', 'chocolate negro'], [150, 'g', 'mantequilla'], [3, 'ud', 'huevos'], [200, 'g', 'azúcar moreno'], [80, 'g', 'harina de trigo'], [20, 'g', 'cacao en polvo'], [80, 'g', 'nueces'], [1, 'pizca', 'sal']],
    s: ['Funde: el chocolate con la mantequilla a fuego muy bajo o a baño maría.', 'Bate: los huevos con el azúcar solo hasta integrar.', 'Une: el chocolate templado con los huevos.', 'Secos: añade harina, cacao y sal tamizados, y después las nueces.', 'Hornea: 22 a 25 minutos en molde cuadrado de 20 cm.', 'Enfría: al menos una hora antes de cortar.'],
    c: 'El brownie se saca con el centro todavía húmedo: al enfriar se asienta.', e: 'Hornear de más: queda como un bizcocho seco.', v: 'Sustituye las nueces por dulce de leche en espiral por encima.' });
  r('reposteria', 'flan', 'Flan casero', { p: 6, min: 70, h: 170, d: 2,
    ing: [[100, 'g', 'azúcar (para el caramelo)'], [4, 'ud', 'huevos'], [500, 'ml', 'leche'], [100, 'g', 'azúcar'], [1, 'cdta', 'esencia de vainilla']],
    s: ['Caramelo: funde el azúcar sin remover hasta que tome color ámbar y cubre el fondo del molde.', 'Mezcla: bate huevos y azúcar sin hacer espuma, y añade la leche tibia y la vainilla.', 'Cuela: pasa la mezcla por un colador sobre el caramelo.', 'Baño maría: hornea a 170 °C unos 50 minutos con agua caliente en la bandeja.', 'Prueba: debe temblar un poco en el centro.', 'Reposa: 4 horas en la nevera antes de desmoldar.'],
    c: 'Que el agua del baño maría no hierva: si hierve, el flan sale con agujeros.', e: 'Batir con varillas a fondo: el aire forma burbujas.', v: 'Flan de coco: cambia 200 ml de leche por leche de coco.' });
  r('reposteria', 'arroz_leche', 'Arroz con leche', { p: 6, min: 45, h: 0, d: 1,
    ing: [[150, 'g', 'arroz redondo'], [1000, 'ml', 'leche'], [150, 'g', 'azúcar'], [1, 'ud', 'rama de canela'], [1, 'ud', 'limón (la cáscara)'], [1, 'pizca', 'sal']],
    s: ['Infusiona: calienta la leche con la canela y la cáscara de limón.', 'Arroz: añádelo cuando rompa a hervir y baja el fuego.', 'Remueve: cada pocos minutos durante 35 a 40 minutos, para que suelte almidón.', 'Endulza: el azúcar va al final; si va antes, el grano no se ablanda.', 'Sirve: con canela molida, templado o frío.'],
    c: 'Paciencia y fuego bajo: la cremosidad sale del almidón, no de la nata.', e: 'Añadir el azúcar al principio: el arroz queda duro.', v: 'Termina con una cucharada de dulce de leche y coco rallado.' });

  r('panaderia', 'pan_molde', 'Pan de molde', { al: { mx: 'Pan de caja', ar: 'Pan lactal', co: 'Pan tajado' }, p: 1, min: 180, h: 190, d: 2,
    ing: [[500, 'g', 'harina de fuerza'], [180, 'ml', 'agua tibia'], [120, 'ml', 'leche'], [7, 'g', 'levadura seca'], [20, 'g', 'azúcar'], [10, 'g', 'sal'], [40, 'g', 'mantequilla (blanda)']],
    s: ['Mezcla: harina, azúcar y levadura; después los líquidos tibios.', 'Amasa: 10 minutos; añade la sal y luego la mantequilla, y amasa hasta que la masa sea lisa.', 'Primer levado: 1 hora tapada, hasta que doble su volumen.', 'Forma: desgasifica, enrolla bien apretado y colócalo en el molde.', 'Segundo levado: 45 minutos, hasta que asome por el borde.', 'Hornea: 30 a 35 minutos a 190 °C y deja enfriar sobre rejilla antes de cortar.'],
    c: 'Prueba de la ventana: estira un trozo de masa; si se ve la luz sin romperse, el gluten está listo.', e: 'Cortar el pan caliente: la miga se apelmaza.', v: 'Cambia 150 g de harina por harina integral y añade semillas.' });
  r('panaderia', 'pan_campesino', 'Pan campesino de fermentación lenta', { p: 1, min: 900, h: 230, d: 3,
    ing: [[500, 'g', 'harina de fuerza'], [360, 'ml', 'agua'], [3, 'g', 'levadura seca'], [10, 'g', 'sal']],
    s: ['Autólisis: mezcla harina y agua, y deja reposar 30 minutos.', 'Levadura y sal: incorpóralas con las manos húmedas.', 'Pliegues: cuatro series de pliegues cada 30 minutos.', 'Frío: deja la masa en la nevera de 10 a 12 horas.', 'Forma: haz una bola tensa y déjala en un cesto enharinado 1 hora.', 'Hornea: en olla de hierro precalentada a 230 °C, 20 minutos tapado y 20 destapado.'],
    c: 'La fermentación lenta da sabor: el tiempo trabaja por ti.', e: 'Harina de sobra al formar: la corteza queda blanca y seca.', v: 'Añade 100 g de aceitunas o nueces en el último pliegue.' });
  r('panaderia', 'panecillos', 'Panecillos blancos', { al: { mx: 'Bolillos', ar: 'Pan francés', co: 'Pan francés', ve: 'Pan canilla', do: 'Pan de agua' }, p: 10, min: 150, h: 220, d: 2,
    ing: [[500, 'g', 'harina de fuerza'], [310, 'ml', 'agua'], [7, 'g', 'levadura seca'], [10, 'g', 'sal'], [10, 'g', 'azúcar']],
    s: ['Amasa: todo junto 12 minutos, hasta una masa elástica.', 'Levado: 1 hora tapada.', 'Divide: en 10 piezas de unos 80 g y bolea.', 'Forma: alarga cada pieza con las puntas finas.', 'Levado final: 40 minutos; haz un corte a lo largo.', 'Hornea: con vapor a 220 °C durante 18 a 20 minutos.'],
    c: 'Un recipiente con agua en el horno da la corteza crujiente.', e: 'Cortar sin decisión: el corte se cierra y no abre.', v: 'Pinta con huevo y espolvorea ajonjolí antes de hornear.' });
  r('panaderia', 'pan_leche', 'Pan de leche', { p: 12, min: 160, h: 180, d: 2,
    ing: [[500, 'g', 'harina de fuerza'], [250, 'ml', 'leche tibia'], [1, 'ud', 'huevo'], [60, 'g', 'azúcar'], [7, 'g', 'levadura seca'], [8, 'g', 'sal'], [60, 'g', 'mantequilla (blanda)']],
    s: ['Mezcla: harina, azúcar, levadura, leche y huevo.', 'Amasa: añade la sal y después la mantequilla poco a poco.', 'Levado: 1 hora y media, hasta doblar.', 'Forma: 12 bollos iguales en bandeja.', 'Pinta: con huevo batido tras el segundo levado.', 'Hornea: 15 a 18 minutos a 180 °C.'],
    c: 'Pesa cada bollo: si son iguales, se hornean igual.', e: 'Leche demasiado caliente: mata la levadura.', v: 'Rellénalos de crema pastelera o de guayaba.' });
  r('panaderia', 'focaccia', 'Focaccia de romero', { p: 8, min: 200, h: 220, d: 1,
    ing: [[500, 'g', 'harina de fuerza'], [400, 'ml', 'agua'], [5, 'g', 'levadura seca'], [10, 'g', 'sal'], [60, 'ml', 'aceite de oliva'], [2, 'ud', 'ramas de romero'], [1, 'cdta', 'sal en escamas']],
    s: ['Mezcla: harina, agua y levadura; la masa es muy húmeda.', 'Pliegues: tres series cada 30 minutos con las manos aceitadas.', 'Bandeja: extiéndela en bandeja con la mitad del aceite.', 'Levado: 1 hora, hasta que se llene de burbujas.', 'Hoyuelos: hunde los dedos, riega con aceite y añade romero y sal.', 'Hornea: 22 a 25 minutos a 220 °C.'],
    c: 'Los hoyuelos guardan el aceite: sin miedo a llegar al fondo.', e: 'Poca agua: la miga no sale abierta.', v: 'Tomates cherry y aceitunas en lugar de romero.' });
  r('panaderia', 'pan_integral', 'Pan integral con semillas', { p: 1, min: 200, h: 210, d: 2,
    ing: [[300, 'g', 'harina integral'], [200, 'g', 'harina de fuerza'], [340, 'ml', 'agua'], [7, 'g', 'levadura seca'], [10, 'g', 'sal'], [60, 'g', 'semillas (girasol, lino, sésamo)'], [15, 'g', 'miel']],
    s: ['Remoja: las semillas en 60 ml del agua durante 20 minutos.', 'Mezcla: harinas, levadura, miel y el resto del agua.', 'Amasa: 10 minutos, añade la sal y las semillas.', 'Levado: 1 hora y cuarto.', 'Forma: en molde o como hogaza, y deja levar 45 minutos.', 'Hornea: 35 a 40 minutos a 210 °C.'],
    c: 'La harina integral absorbe más agua: la masa debe quedar algo pegajosa.', e: 'Añadir más harina porque se pega: el pan sale denso.', v: 'Añade 80 g de pasas y una cucharadita de canela.' });

  r('pasteleria', 'crema_pastelera', 'Crema pastelera', { p: 6, min: 20, h: 0, d: 2,
    ing: [[500, 'ml', 'leche'], [4, 'ud', 'yemas de huevo'], [120, 'g', 'azúcar'], [40, 'g', 'maicena'], [1, 'ud', 'vaina de vainilla'], [20, 'g', 'mantequilla']],
    s: ['Infusiona: calienta la leche con la vainilla abierta.', 'Blanquea: bate yemas, azúcar y maicena.', 'Tempera: vierte un tercio de la leche caliente sobre las yemas batiendo.', 'Cuece: devuelve todo al fuego y remueve sin parar hasta que hierva un minuto.', 'Termina: fuera del fuego añade la mantequilla.', 'Enfría: tapada con film a piel, para que no forme costra.'],
    c: 'Que llegue a hervir: si no, la maicena no cuaja y la crema se afloja.', e: 'Dejar de remover: se pega al fondo y hace grumos.', v: 'Crema de chocolate: añade 80 g de chocolate negro al final.' });
  r('pasteleria', 'tarta_manzana', 'Tarta de manzana', { p: 8, min: 90, h: 180, d: 2,
    ing: [[250, 'g', 'harina de trigo'], [125, 'g', 'mantequilla (fría)'], [1, 'ud', 'huevo'], [50, 'g', 'azúcar'], [4, 'ud', 'manzanas'], [300, 'ml', 'crema pastelera'], [2, 'cda', 'mermelada de albaricoque']],
    s: ['Arenado: frota la harina con la mantequilla fría hasta que parezca arena.', 'Une: con el huevo y el azúcar, sin amasar.', 'Frío: 30 minutos en la nevera.', 'Forra: el molde y pincha el fondo.', 'Monta: crema pastelera y manzana en láminas finas en abanico.', 'Hornea: 40 minutos a 180 °C y pinta con la mermelada tibia.'],
    c: 'Mantequilla fría y manos frías: la masa quebrada odia el calor.', e: 'Láminas gruesas: la manzana queda cruda.', v: 'Peras con canela en lugar de manzanas.' });
  r('pasteleria', 'merengue_suizo', 'Merengue suizo', { p: 8, min: 20, h: 0, d: 2,
    ing: [[4, 'ud', 'claras de huevo'], [240, 'g', 'azúcar'], [1, 'pizca', 'sal'], [1, 'cdta', 'zumo de limón']],
    s: ['Baño maría: claras y azúcar en un bol sobre agua caliente.', 'Calienta: sin dejar de batir hasta 60 °C, cuando el azúcar ya no se note entre los dedos.', 'Monta: fuera del fuego a velocidad alta hasta que se enfríe.', 'Punto: picos firmes y brillantes.', 'Usa: para decorar o para crema de mantequilla.'],
    c: 'El bol sin rastro de grasa: una gota de yema impide que monte.', e: 'Agua hirviendo en el baño maría: cuece las claras.', v: 'Añade 30 g de cacao tamizado al final para merengue de chocolate.' });
  r('pasteleria', 'profiteroles', 'Profiteroles', { p: 30, min: 60, h: 200, d: 3,
    ing: [[125, 'ml', 'agua'], [125, 'ml', 'leche'], [100, 'g', 'mantequilla'], [150, 'g', 'harina de trigo'], [4, 'ud', 'huevos'], [1, 'pizca', 'sal'], [500, 'ml', 'crema pastelera']],
    s: ['Hierve: agua, leche, mantequilla y sal.', 'Escalda: añade la harina de golpe y remueve hasta que la masa se despegue.', 'Seca: un minuto más al fuego.', 'Huevos: uno a uno, fuera del fuego, hasta masa brillante que cae en pico.', 'Manga: bolitas de 3 cm en bandeja.', 'Hornea: 25 minutos a 200 °C sin abrir, y rellena ya fríos.'],
    c: 'La masa está lista cuando cae de la espátula formando una V.', e: 'Abrir el horno: los choux se desinflan y no vuelven a subir.', v: 'Rellenos de crema de leche montada y cubiertos de chocolate.' });
  r('pasteleria', 'tres_leches', 'Pastel tres leches', { al: { es: 'Tarta tres leches', ar: 'Torta tres leches', co: 'Torta tres leches', cl: 'Torta tres leches', ve: 'Torta tres leches', do: 'Bizcocho tres leches' }, p: 12, min: 60, h: 180, d: 2,
    ing: [[5, 'ud', 'huevos'], [150, 'g', 'azúcar'], [150, 'g', 'harina de trigo'], [8, 'g', 'polvo de hornear'], [400, 'ml', 'leche condensada'], [350, 'ml', 'leche evaporada'], [250, 'ml', 'crema de leche'], [1, 'cdta', 'esencia de vainilla']],
    s: ['Bizcocho: bate huevos y azúcar hasta triplicar, e incorpora la harina con el polvo de hornear.', 'Hornea: 25 a 30 minutos a 180 °C en molde rectangular.', 'Tres leches: mezcla condensada, evaporada, crema y vainilla.', 'Pincha: el bizcocho templado por toda la superficie.', 'Empapa: vierte las leches poco a poco.', 'Reposa: toda la noche en la nevera y cubre con merengue.'],
    c: 'Bizcocho templado y leches frías: así absorbe sin deshacerse.', e: 'Verter todo de golpe: se encharca por abajo.', v: 'Cuatro leches: añade dulce de leche a la mezcla.' });
  r('pasteleria', 'alfajores', 'Alfajores de maicena', { p: 20, min: 50, h: 170, d: 2,
    ing: [[200, 'g', 'maicena'], [100, 'g', 'harina de trigo'], [150, 'g', 'mantequilla (blanda)'], [100, 'g', 'azúcar'], [3, 'ud', 'yemas de huevo'], [5, 'g', 'polvo de hornear'], [400, 'g', 'dulce de leche'], [50, 'g', 'coco rallado']],
    s: ['Crema: mantequilla y azúcar.', 'Yemas: una a una.', 'Secos: maicena, harina y polvo de hornear tamizados; une sin amasar.', 'Estira: a 5 mm y corta círculos de 5 cm.', 'Hornea: 8 a 10 minutos a 170 °C; deben quedar blancos.', 'Arma: une de dos en dos con dulce de leche y pasa el borde por coco.'],
    c: 'Blancos por arriba y apenas dorados por abajo: si se doran, se pasan.', e: 'Amasar: se vuelven duros en lugar de deshacerse en la boca.', v: 'Báñalos en chocolate negro en lugar de coco.' });

  r('batidos', 'verde', 'Batido verde de piña y espinaca', { p: 2, min: 5, h: 0, d: 1,
    ing: [[200, 'g', 'piña en trozos'], [1, 'ud', 'manzana verde'], [30, 'g', 'espinaca baby'], [250, 'ml', 'agua de coco'], [1, 'ud', 'limón (el zumo)'], [1, 'ud', 'trocito de jengibre']],
    s: ['Lava: la espinaca y la manzana; no hace falta pelarla.', 'Trocea: la fruta en trozos medianos.', 'Tritura: primero la espinaca con el agua de coco, para que no queden hebras.', 'Suma: la fruta y el jengibre, y tritura un minuto.', 'Sirve: al momento, con hielo si quieres.'],
    c: 'Hojas primero con el líquido: el batido queda liso.', e: 'Mucho jengibre: domina todo. Empieza con poco.', v: 'Cambia la piña por mango y la espinaca por kale.' });
  r('batidos', 'fresa_platano', 'Batido de fresa y plátano', { p: 2, min: 5, h: 0, d: 1,
    ing: [[200, 'g', 'fresas'], [1, 'ud', 'plátano maduro'], [250, 'ml', 'leche'], [1, 'cdta', 'miel']],
    s: ['Lava: las fresas y quítales el rabito.', 'Pela: el plátano; si está congelado, el batido sale más cremoso.', 'Tritura: todo junto en la batidora de vaso.', 'Prueba: y ajusta con miel solo si hace falta.'],
    c: 'Plátano bien maduro endulza sin azúcar añadido.', e: 'Fruta sin lavar: las fresas guardan tierra.', v: 'Leche vegetal de avena para una versión sin lactosa.' });
  r('batidos', 'tropical', 'Batido tropical de mango y maracuyá', { p: 2, min: 5, h: 0, d: 1,
    ing: [[250, 'g', 'mango'], [2, 'ud', 'maracuyá (la pulpa)'], [200, 'ml', 'zumo de naranja'], [100, 'g', 'yogur natural']],
    s: ['Pela: el mango y córtalo junto al hueso.', 'Pulpa: saca la del maracuyá y cuélala si no quieres semillas.', 'Tritura: todo hasta que quede cremoso.', 'Sirve: frío.'],
    c: 'Mango congelado en cubos: batido helado sin aguar.', e: 'Triturar las semillas del maracuyá: amargan.', v: 'Añade papaya y una pizca de lima.' });
  r('batidos', 'avena', 'Batido de avena, canela y plátano', { p: 2, min: 5, h: 0, d: 1,
    ing: [[40, 'g', 'copos de avena'], [1, 'ud', 'plátano'], [300, 'ml', 'leche'], [1, 'pizca', 'canela'], [1, 'cdta', 'miel']],
    s: ['Remoja: la avena en la leche 5 minutos.', 'Tritura: con el plátano y la canela.', 'Ajusta: la textura con un poco más de leche.', 'Sirve: con canela por encima.'],
    c: 'Remojar la avena evita grumos.', e: 'Mucha avena: queda espeso como papilla.', v: 'Una cucharada de cacao puro.' });
  r('batidos', 'papaya', 'Batido de papaya y naranja', { p: 2, min: 5, h: 0, d: 1,
    ing: [[300, 'g', 'papaya'], [250, 'ml', 'zumo de naranja'], [1, 'ud', 'limón (el zumo)']],
    s: ['Pela: la papaya y quita las semillas.', 'Exprime: las naranjas.', 'Tritura: todo con hielo.', 'Sirve: al momento.'],
    c: 'El limón realza la papaya y evita que se oxide.', e: 'Guardarlo horas: pierde color y sabor.', v: 'Añade una rodaja de piña.' });
  r('batidos', 'rojos', 'Batido de frutos rojos y yogur', { p: 2, min: 5, h: 0, d: 1,
    ing: [[200, 'g', 'frutos rojos'], [150, 'g', 'yogur natural'], [150, 'ml', 'leche'], [1, 'cda', 'semillas de chía']],
    s: ['Tritura: frutos rojos, yogur y leche.', 'Chía: añádela al final y deja reposar 5 minutos.', 'Remueve: y sirve.'],
    c: 'Frutos rojos congelados funcionan igual de bien que frescos.', e: 'Chía triturada con todo: el batido se vuelve gelatinoso.', v: 'Cambia el yogur por bebida de almendra.' });

  /* Batidos combinados: fruta × base × extra. Llenan libros largos con recetas reales. */
  var FRUTAS = [['mango', 200], ['piña', 200], ['papaya', 250], ['fresas', 200], ['plátano', 150], ['manzana verde', 150], ['pera', 150], ['naranja', 200], ['maracuyá', 60], ['guayaba', 200], ['melón', 250], ['sandía', 300], ['kiwi', 150], ['arándanos', 150], ['durazno', 200], ['mora', 150], ['frambuesas', 150], ['cereza', 150]];
  var BASES = [['agua de coco', 250, 'ml'], ['bebida de avena', 250, 'ml'], ['leche', 250, 'ml'], ['yogur natural', 150, 'g'], ['agua fría', 200, 'ml'], ['zumo de naranja', 200, 'ml'], ['bebida de almendra', 250, 'ml']];
  var EXTRAS = [['jengibre', 'con jengibre', [1, 'ud', 'trocito de jengibre']], ['menta', 'con menta', [6, 'ud', 'hojas de menta']], ['chia', 'con chía', [1, 'cda', 'semillas de chía']], ['avena', 'con avena', [2, 'cda', 'copos de avena']], ['canela', 'con canela', [1, 'pizca', 'canela']], ['espinaca', 'verde', [30, 'g', 'espinaca baby']], ['limon', 'con limón', [1, 'ud', 'limón (el zumo)']], ['cacao', 'con cacao', [1, 'cda', 'cacao puro']]];
  function combinado(i, semilla) {
    var rr = H.rng(9173 + i * 31 + semilla * 7), f1 = FRUTAS[i % FRUTAS.length], f2 = FRUTAS[(i * 7 + 3) % FRUTAS.length];
    if (f2 === f1) f2 = FRUTAS[(i + 5) % FRUTAS.length];
    var b = BASES[Math.floor(i / FRUTAS.length + i) % BASES.length], x = EXTRAS[(i * 3 + Math.floor(i / 5)) % EXTRAS.length];
    var n = 'Batido de ' + f1[0] + ' y ' + f2[0] + ' ' + x[1];
    return {
      cat: 'batidos', id: 'comb_' + i, n: n, p: 2, min: 5, h: 0, d: 1, gen: true,
      ing: [[f1[1], 'g', f1[0]], [Math.round(f2[1] * 0.7), 'g', f2[0]], [b[1], b[2], b[0]], x[2]],
      s: ['Prepara: lava y trocea la fruta; ' + (f1[0] === 'mango' || f1[0] === 'papaya' || f1[0] === 'piña' ? 'pélala y quita el hueso o las semillas.' : 'pela solo si la piel es dura.'), 'Líquido: pon primero ' + b[0] + ' en el vaso.', 'Tritura: la fruta con ' + x[2][2] + ' durante un minuto.', 'Sirve: al momento' + (H.pick(rr, [', con hielo.', ', bien frío.', ' en vaso ancho.']))],
      c: H.pick(rr, ['Fruta congelada da textura de helado sin añadir hielo.', 'Si la fruta está madura, no hace falta endulzar.', 'Tritura a velocidad baja al principio y sube después.']),
      e: H.pick(rr, ['Demasiado líquido: queda aguado. Mejor añadir poco a poco.', 'Prepararlo con horas de antelación: pierde color y vitaminas.']),
      v: 'Cambia ' + b[0] + ' por ' + BASES[(BASES.indexOf(b) + 2) % BASES.length][0] + '.'
    };
  }

  var CATS = {
    reposteria: { n: 'Repostería casera', ico: '🧁', intro: 'Bizcochos, galletas y postres de siempre: recetas que salen bien a la primera y se repiten en familia.' },
    panaderia: { n: 'Panadería', ico: '🥖', intro: 'Harina, agua, levadura, sal y tiempo. Del pan de molde al pan de fermentación lenta.' },
    pasteleria: { n: 'Pastelería', ico: '🍰', intro: 'Las bases de obrador: cremas, masas, merengues y montajes con precisión de pastelero.' },
    batidos: { n: 'Batidos naturales', ico: '🥤', intro: 'Fruta, verdura y un buen líquido. Rápidos, sin azúcar añadido y con combinaciones para todo el año.' }
  };

  function nombreR(rc, C) { return loc((rc.al && rc.al[C.pk]) || rc.n, C); }
  function dif(d) { return ['', 'Fácil', 'Media', 'Avanzada'][d] || ''; }
  function tiempo(m) { return m >= 120 ? (Math.round(m / 30) / 2) + ' h' : m + ' min'; }
  function factor(rc, C) { var p = +C.op.porciones || 0; return rc.p > 2 && p ? p / rc.p : 1; }
  function porc(rc, C) { var f = factor(rc, C); return rc.p === 1 ? '1 pieza' : Math.round(rc.p * f) + (rc.cat === 'batidos' ? ' vasos' : rc.p >= 10 ? ' unidades' : ' porciones'); }
  function paso(s) { var i = s.indexOf(':'); return i > 0 && i < 24 ? [s.slice(0, i), s.slice(i + 1).trim()] : ['', s]; }

  function badge(C, t, v) { var T = C.T; return '<div style="flex:1;min-width:0;padding:2.4mm 3mm;border-top:0.6mm solid ' + T.acc + '"><div style="font-size:.7em;letter-spacing:.1em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">' + t + '</div><div style="font-weight:700;font-size:1.05em">' + H.esc(v) + '</div></div>'; }

  var paginas = {
    coc_intro: function (pg, C) {
      return H.cabecera(C, pg) + H.h1(C, 'Antes de encender el horno') +
        '<p>' + H.esc(loc('Las recetas están probadas a escala casera y pesadas en gramos: una balanza de cocina es la mejor inversión de este libro. ' + (C.pk === 'us' ? 'Junto a los gramos tienes la equivalencia en tazas y la temperatura en °F.' : 'Las temperaturas son de horno convencional; con ventilador, resta 20 °C.'), C)) + '</p>' +
        H.h2(C, 'Cómo leer una receta') + ['<b>Primera página</b>: porciones, tiempo, horno y la lista de ingredientes ya ajustada.', '<b>Segunda página</b>: los pasos, el consejo, el error que más se comete y una variante.', '<b>Costo</b>: en algunas recetas, cuánto cuesta hacerla y a qué precio venderla.'].map(function (s) { return '<div style="margin:0 0 2mm">· ' + s + '</div>'; }).join('') +
        H.h2(C, 'Higiene y seguridad') + '<p>' + H.esc(loc('Manos limpias, pelo recogido y superficies desinfectadas. No se da miel a menores de un año. Avisa siempre de los alérgenos: gluten, huevo, leche y frutos secos.', C)) + '</p>' +
        H.guia(C, loc('Lee la receta entera antes de empezar y pesa todo antes de mezclar. Así la cocina no te sorprende.', C), true) + H.folio(C, pg);
    },
    coc_capitulo: function (pg, C) {
      var T = C.T, ct = CATS[pg.cat];
      return H.cabecera(C, pg) + '<div style="font-family:' + T.tit + ';font-size:' + (C.fs * 6) + 'px;color:' + T.acc + ';line-height:.9">' + pg.n + '</div>' +
        H.h1(C, H.esc(loc(ct.n, C))) + '<p style="font-size:1.15em;max-width:150mm">' + H.esc(loc(ct.intro, C)) + '</p>' +
        H.marcoImagen(C, 'Fotografía del capítulo: ' + loc(ct.n, C).toLowerCase(), 110, (C.cfg.imagenes || [])[(pg.n - 1) % Math.max(1, (C.cfg.imagenes || []).length)]) +
        H.h2(C, 'En este capítulo') + '<div style="columns:2;column-gap:8mm">' + pg.lista.map(function (rc) { return '<div style="break-inside:avoid;margin:0 0 1.5mm">· ' + H.esc(nombreR(rc, C)) + '</div>'; }).join('') + '</div>' + H.folio(C, pg);
    },
    coc_tecnica: function (pg, C) {
      var T = C.T, u = pg.u;
      return H.cabecera(C, pg) + '<div style="font-size:.8em;letter-spacing:.12em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">Técnica</div>' + H.h1(C, H.esc(loc(u.t, C))) +
        (u.i || []).map(function (s) { return '<div style="margin:0 0 3mm;padding-left:4mm;border-left:1mm solid ' + T.soft + '">' + H.esc(loc(s, C)) + '</div>'; }).join('') +
        (u.f ? '<div style="margin:5mm 0;display:flex;justify-content:center">' + H.figura(u.f, C) + '</div>' : '') + H.chipsClave(C, u) + H.folio(C, pg);
    },
    coc_receta_a: function (pg, C) {
      var T = C.T, rc = pg.rc, f = factor(rc, C);
      var filas = rc.ing.map(function (g) { return '<tr><td style="padding:1.8mm 2mm 1.8mm 0;border-bottom:1px solid ' + T.soft + ';font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:700;width:34%">' + H.esc(cant(g, f, C)) + '</td><td style="padding:1.8mm 0;border-bottom:1px solid ' + T.soft + '">' + H.esc(loc(g[2], C)) + '</td></tr>'; }).join('');
      var intro = loc(H.pick(H.rng(H.hash(rc.id) + C.semilla), ['Una receta para ' + (rc.cat === 'batidos' ? 'empezar el día' : 'una tarde sin prisa') + '.', 'La que más se pide en casa de ' + C.P.nombres[1] + '.', 'Sencilla, honesta y sin trucos raros.', 'De las que huelen a ' + (rc.h ? 'horno encendido' : 'fruta recién cortada') + ' desde la calle.']), C);
      return H.cabecera(C, pg) + H.h1(C, H.esc(nombreR(rc, C)), 'margin-bottom:2mm') + '<p style="margin:0 0 4mm;font-style:italic;opacity:.85">' + H.esc(intro) + '</p>' +
        H.marcoImagen(C, 'Foto del plato terminado', C.op.foto === 'grande' ? 95 : 70, (C.cfg.imagenes || [])[H.hash(rc.id) % Math.max(1, (C.cfg.imagenes || []).length)]) +
        '<div style="display:flex;gap:3mm;margin:5mm 0">' + badge(C, 'Rinde', porc(rc, C)) + badge(C, 'Tiempo', tiempo(rc.min)) + badge(C, 'Horno', temp(rc.h, C)) + badge(C, 'Dificultad', dif(rc.d)) + '</div>' +
        H.h2(C, 'Ingredientes') + '<table style="width:100%;border-collapse:collapse">' + filas + '</table>' + H.folio(C, pg);
    },
    coc_receta_b: function (pg, C) {
      var T = C.T, rc = pg.rc;
      var ps = rc.s.map(function (s, i) { var p = paso(loc(s, C)); return '<div style="display:flex;gap:4mm;margin:0 0 3.5mm;break-inside:avoid"><div style="flex:none;width:9mm;height:9mm;border-radius:50%;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700">' + (i + 1) + '</div><div>' + (p[0] ? '<b>' + H.esc(p[0]) + '.</b> ' : '') + H.esc(p[1]) + '</div></div>'; }).join('');
      var caja = function (t, s, col) { return '<div style="flex:1;min-width:0;padding:3mm 4mm;background:' + col + ';border-radius:' + T.r + 'px"><div style="font-size:.72em;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:1mm">' + t + '</div>' + H.esc(loc(s, C)) + '</div>'; };
      return H.cabecera(C, pg) + H.h2(C, H.esc(nombreR(rc, C)) + ' · paso a paso', T.ink) + ps +
        '<div style="display:flex;justify-content:center;margin:2mm 0 4mm">' + H.figura({ t: 'flujo', p: rc.s.slice(0, 6).map(function (s) { return paso(loc(s, C))[0] || '·'; }) }, C) + '</div>' +
        '<div style="display:flex;gap:4mm;margin-bottom:4mm">' + caja('Consejo', rc.c, T.soft2) + caja('Error frecuente', rc.e, T.soft) + '</div>' +
        '<div style="padding:0 0 2mm"><b style="color:' + T.acc + '">Variante.</b> ' + H.esc(loc(rc.v, C)) + '</div>' +
        '<div style="font-size:.8em;letter-spacing:.1em;text-transform:uppercase;color:' + T.acc + ';font-weight:700;margin-top:3mm">Mis notas</div>' + H.lineas(3, C) + H.folio(C, pg);
    },
    coc_costo: function (pg, C) {
      var T = C.T, rc = pg.rc, f = factor(rc, C), tot = 0;
      var filas = rc.ing.map(function (g) { var c = costoIng(g, f, C); tot += c; return [loc(g[2], C), cant(g, f, C), H.din(Math.round(c * 100) / 100, C)]; });
      var nP = rc.p === 1 ? 1 : Math.round(rc.p * f), porU = tot / nP, venta = porU * 3;
      var td = 'padding:2mm;border-bottom:1px solid ' + T.soft;
      return H.cabecera(C, pg) + H.h1(C, 'Costo de ' + H.esc(H.minus(nombreR(rc, C))), 'font-size:' + (C.fs * 1.6) + 'px') +
        '<p style="margin:0 0 4mm;font-size:.9em">Precios orientativos en ' + H.esc(C.P.mon) + '. Escribe al lado lo que pagas tú: así sabes cuánto te cuesta de verdad.</p>' +
        '<table style="width:100%;border-collapse:collapse;font-size:.92em"><tr>' + ['Ingrediente', 'Cantidad', 'Costo aprox.', 'Mi precio'].map(function (h) { return '<th style="' + td + ';text-align:left;color:' + T.acc + '">' + h + '</th>'; }).join('') + '</tr>' +
        filas.map(function (x) { return '<tr><td style="' + td + '">' + H.esc(x[0]) + '</td><td style="' + td + ';font-variant-numeric:tabular-nums">' + H.esc(x[1]) + '</td><td style="' + td + ';font-variant-numeric:tabular-nums">' + x[2] + '</td><td style="' + td + ';width:28mm"></td></tr>'; }).join('') + '</table>' +
        '<div style="display:flex;gap:3mm;margin:6mm 0">' + badge(C, 'Costo total', H.din(Math.round(tot * 100) / 100, C)) + badge(C, 'Por ' + (rc.p === 1 ? 'pieza' : 'unidad'), H.din(Math.round(porU * 100) / 100, C)) + badge(C, 'Venta sugerida (×3)', H.din(Math.round(venta * 100) / 100, C)) + '</div>' +
        '<p style="font-size:.88em">' + H.esc(loc('El ×3 cubre ingredientes, energía, envase y tu tiempo. Si vendes con factura, suma el ' + C.P.imp.n + ' (' + C.P.imp.p + ' %) al precio final.', C)) + '</p>' + H.folio(C, pg);
    },
    coc_mireceta: function (pg, C) {
      var T = C.T, l = function (t, n) { return '<div style="font-size:.75em;letter-spacing:.1em;text-transform:uppercase;color:' + T.acc + ';font-weight:700;margin-top:4mm">' + t + '</div>' + H.lineas(n, C); };
      return H.cabecera(C, pg) + H.h1(C, 'Mi receta', 'font-size:' + (C.fs * 1.7) + 'px') +
        '<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:4mm;font-size:.85em">' + ['Nombre', 'Porciones', 'Horno'].map(function (x) { return '<div style="border-bottom:1px solid ' + T.ink + ';padding-bottom:1mm">' + x + ':</div>'; }).join('') + '</div>' +
        l('Ingredientes', 7) + l('Pasos', 9) + l('Me la enseñó', 1) + H.folio(C, pg);
    },
    coc_equivalencias: function (pg, C) {
      var T = C.T, td = 'padding:2mm;border-bottom:1px solid ' + T.soft;
      var tb = function (h, f) { return '<table style="width:100%;border-collapse:collapse;font-size:.9em;margin-bottom:5mm"><tr>' + h.map(function (x) { return '<th style="' + td + ';text-align:left;color:' + T.acc + '">' + x + '</th>'; }).join('') + '</tr>' + f.map(function (r0) { return '<tr>' + r0.map(function (x) { return '<td style="' + td + '">' + H.esc(loc(x, C)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>'; };
      return H.cabecera(C, pg) + H.h1(C, 'Equivalencias') +
        tb(['1 taza de…', 'Pesa'], Object.keys(TAZA).slice(0, 10).map(function (k) { return [k, TAZA[k] + ' g']; })) +
        tb(['Medida', 'Equivale'], [['1 cucharada', '15 ml'], ['1 cucharadita', '5 ml'], ['1 taza de líquido', '240 ml'], ['1 huevo mediano', '50 g sin cáscara']]) +
        tb(['Horno', '°C', '°F'], [['Suave', '150–160', '300–325'], ['Medio', '170–180', '340–350'], ['Fuerte', '200–220', '400–425'], ['Muy fuerte', '230–250', '450–480']]) + H.folio(C, pg);
    }
  };

  function titulo(C) { var ct = CATS[C.mat]; return ct ? loc(ct.n, C) : 'Recetario'; }

  function armar(C, pool, N, r) {
    var cats = C.mat === 'cocina' ? Object.keys(CATS) : [C.mat];
    var core = [], usadas = {}, nCap = 0, filas = 0;
    cats.forEach(function (ct, ci) {
      var lista = REC.filter(function (x) { return x.cat === ct; });
      nCap++;
      core.push({ tipo: 'coc_capitulo', cat: ct, n: ci + 1, lista: lista, indice: loc(CATS[ct].n, C), indiceN: 'Capítulo ' + (ci + 1), cab: loc(CATS[ct].n, C) });
      filas++;
      pool.filter(function (u) { return u.cat === ct; }).slice(0, 2).forEach(function (u) { core.push({ tipo: 'coc_tecnica', u: u, n: ci + 1, cab: loc(CATS[ct].n, C) }); });
      lista.forEach(function (rc) {
        core.push({ tipo: 'coc_receta_a', rc: rc, n: ci + 1, indice: nombreR(rc, C), cab: loc(CATS[ct].n, C) });
        core.push({ tipo: 'coc_receta_b', rc: rc, n: ci + 1, cab: loc(CATS[ct].n, C) });
        filas++;
      });
    });
    var fin = N >= 30 ? [{ tipo: 'coc_equivalencias', indice: 'Equivalencias' }] : [];
    var gen = 0, k = 0, nombres = {}, costoHecho = {};
    REC.forEach(function (x) { nombres[x.n] = 1; });
    var pagesTot = N;
    return H.envolver(C, core, N, function (i) {
      /* Relleno con sentido: batidos nuevos, hojas de costo y páginas para recetas propias. */
      var ct = cats[i % cats.length], lista = REC.filter(function (x) { return x.cat === ct; });
      var idx = -1; for (var z = 0; z < core.length; z++) if (core[z].rc && core[z].rc.cat === ct || core[z].cat === ct) idx = z;
      var add;
      if (ct === 'batidos' && k % 3 !== 2) { var rc = combinado(gen++, C.semilla), g0 = 0; while (nombres[rc.n] && g0++ < 400) rc = combinado(gen++, C.semilla); nombres[rc.n] = 1; add = [{ tipo: 'coc_receta_a', rc: rc, n: cats.indexOf(ct) + 1, indice: nombreR(rc, C), cab: loc(CATS[ct].n, C), relleno: true }, { tipo: 'coc_receta_b', rc: rc, n: cats.indexOf(ct) + 1, cab: loc(CATS[ct].n, C), relleno: true }]; }
      else if (lista.some(function (x) { return !costoHecho[x.id]; })) { var rc2 = lista.filter(function (x) { return !costoHecho[x.id]; })[0]; costoHecho[rc2.id] = 1; add = [{ tipo: 'coc_costo', rc: rc2, n: cats.indexOf(ct) + 1, cab: 'Costos', relleno: true }]; }
      else add = [{ tipo: 'coc_mireceta', n: cats.indexOf(ct) + 1, cab: 'Mis recetas', relleno: true }];
      k++;
      var hueco = pagesTot - core.length;
      add = add.slice(0, Math.max(0, hueco));
      core.splice.apply(core, [idx + 1, 0].concat(add));
      return [];
    }, { intro: { tipo: 'coc_intro', indice: 'Antes de encender el horno' }, fin: fin, indiceFilas: filas + 40 });
  }

  var UNIDADES = [
    { cat: 'reposteria', id: 'coc_cremado', t: 'El cremado', i: ['Cremar es batir mantequilla blanda con azúcar hasta que blanquee.', 'Los cristales de azúcar abren burbujas de aire dentro de la grasa.', 'Ese aire, con el calor del horno, hace crecer el bizcocho.', 'La mantequilla debe estar a unos 18 °C: blanda pero no derretida.'], k: ['cremar', 'mantequilla', 'aire', 'emulsión'], f: { t: 'flujo', p: ['Mantequilla blanda', 'Azúcar', 'Batir', 'Blanquea', 'Huevos uno a uno'] } },
    { cat: 'reposteria', id: 'coc_horno', t: 'Leer el horno', i: ['Cada horno calienta distinto: un termómetro de horno sale barato y evita sorpresas.', 'Los primeros minutos no se abre la puerta: la estructura aún no está firme.', 'El palillo limpio en el centro indica que la miga está cocida.'], k: ['precalentar', 'temperatura', 'palillo', 'reposo'] },
    { cat: 'panaderia', id: 'coc_gluten', t: 'Amasado y gluten', i: ['Al amasar, dos proteínas de la harina forman una red elástica: el gluten.', 'Esa red atrapa el gas de la levadura y hace que el pan suba.', 'La prueba de la ventana dice cuándo el gluten está listo.', 'La sal fortalece la red; se añade después de unos minutos de amasado.'], k: ['gluten', 'amasado', 'prueba de la ventana', 'hidratación'], f: { t: 'flujo', p: ['Mezclar', 'Amasar', 'Levar', 'Formar', 'Levar', 'Hornear'] } },
    { cat: 'panaderia', id: 'coc_fermento', t: 'La fermentación', i: ['La levadura come azúcares y produce gas y aromas.', 'Con calor fermenta rápido; con frío, despacio y con más sabor.', 'La masa está lista cuando al presionarla con un dedo la marca vuelve despacio.'], k: ['levadura', 'fermentación', 'levado', 'temperatura'], f: { t: 'ciclo', p: ['Levadura', 'Azúcares', 'Gas', 'Masa que sube'] } },
    { cat: 'pasteleria', id: 'coc_masas', t: 'Las masas base', i: ['Masa quebrada: harina frotada con grasa fría, para tartas.', 'Masa choux: se cuece en el cazo antes de hornear y se hincha con vapor.', 'Masa batida: huevos montados que sostienen la harina, como el bizcocho.', 'Cada masa pide su temperatura y su manera de mezclar.'], k: ['quebrada', 'choux', 'batida', 'hojaldre'], f: { t: 'mapa', c: 'Masas', r: ['quebrada', 'choux', 'batida', 'hojaldre'] } },
    { cat: 'pasteleria', id: 'coc_cremas', t: 'Cremas y merengues', i: ['La crema pastelera espesa con yema y almidón, y debe hervir un minuto.', 'El merengue francés se monta en frío; el suizo, a baño maría; el italiano, con almíbar.', 'Cuanto más cocido el merengue, más estable.'], k: ['crema pastelera', 'merengue', 'almíbar', 'punto de nieve'] },
    { cat: 'batidos', id: 'coc_equilibrio', t: 'El equilibrio del batido', i: ['Un batido rico tiene fruta dulce, algo ácido y un líquido que no tape el sabor.', 'La fruta congelada da cremosidad sin aguar.', 'Las hojas verdes se trituran primero con el líquido.', 'Mejor tomarlo al momento: la fruta cortada se oxida.'], k: ['fruta dulce', 'ácido', 'líquido', 'textura'], f: { t: 'mapa', c: 'Batido', r: ['fruta dulce', 'toque ácido', 'líquido', 'extra'] } },
    { cat: 'batidos', id: 'coc_temporada', t: 'Fruta de temporada', i: ['La fruta de temporada es más sabrosa y más barata.', 'En ' + '{pais}' + ' cada estación tiene sus frutas: pregúntalas en el mercado.', 'Congelar la fruta madura evita tirarla.'], k: ['temporada', 'mercado', 'congelar', 'madurez'] }
  ].map(function (u) { u.m = u.cat; u.b = ['inf', 'pri1', 'pri2', 'pri3', 'sec', 'bach', 'fp', 'adu']; u.g = 'coc_escala'; return u; });
  UNIDADES = UNIDADES.concat(UNIDADES.map(function (u) { return Object.assign({}, u, { m: 'cocina', id: u.id + '_t' }); }));

  var generadores = {
    coc_escala: function (u, C, r) {
      var lista = REC.filter(function (x) { return x.cat === u.cat && x.p > 2; }), rc = H.pick(r, lista.length ? lista : REC.filter(function (x) { return x.p > 2; }));
      var g = H.pick(r, rc.ing.filter(function (x) { return x[1] === 'g' || x[1] === 'ml'; })), m = H.pick(r, [2, 0.5, 1.5]), res = Math.round(g[0] * m);
      return H.it('corta', 'La receta de ' + H.minus(nombreR(rc, C)) + ' lleva ' + g[0] + ' ' + g[1] + ' de ' + loc(g[2], C) + ' para ' + rc.p + '. ¿Cuánto necesitas para ' + Math.round(rc.p * m) + '?', res + ' ' + g[1], { ac: [res, res + g[1], res + ' ' + g[1]], x: g[0] + ' × ' + m + ' = ' + res });
    }
  };

  var mats = Object.keys(CATS).map(function (k) { return { id: k, n: CATS[k].n, ico: CATS[k].ico, grupo: 'Cocina', libre: true, banda: 'adu', plantilla: 'cocina', prodDef: 'recetario' }; });
  mats.push({ id: 'cocina', n: 'Cocina completa (los cuatro)', ico: '🍳', grupo: 'Cocina', libre: true, banda: 'adu', plantilla: 'cocina', prodDef: 'recetario' });
  mats.forEach(function (m) { m.opciones = [{ k: 'porciones', n: 'Porciones (0 = las de cada receta)', tipo: 'chips', def: 0, ops: [[0, 'Original'], [2, '2'], [4, '4'], [6, '6'], [8, '8'], [12, '12'], [24, '24']] }, { k: 'foto', n: 'Foto de cada receta', tipo: 'chips', def: 'media', ops: [['media', 'Mediana'], ['grande', 'Grande']] }]; });

  ED.registrar({
    materias: mats,
    unidades: UNIDADES,
    productos: [{ id: 'recetario', n: 'Recetario profesional', ico: '🍰', d: 'Capítulos, técnicas, recetas a dos páginas con cantidades ajustadas, costos en moneda local y páginas para tus recetas.', solo: Object.keys(CATS).concat(['cocina']), armar: armar, titulo: titulo }],
    plantillas: { cocina: { n: 'Cocina', d: 'Libro de recetas: serifa cálida, tonos de horno y aceite, mucho aire para las fotos.', tit: "'Young Serif', Georgia, serif", cuerpo: "'Karla', sans-serif", bg: '#FBF6EE', ink: '#2B1D14', acc: '#B5542D', acc2: '#5B7B3A', soft: '#F1E1CF', soft2: '#E5EDDA', r: 6, peso: 400 } },
    paginas: paginas,
    generadores: generadores,
    fuentes: 'https://fonts.googleapis.com/css2?family=Young+Serif&family=Karla:ital,wght@0,400;0,700;1,400&display=swap',
    voz: {
      coc_receta_a: function (pg, C) { var f = factor(pg.rc, C); return nombreR(pg.rc, C) + '. Ingredientes: ' + pg.rc.ing.map(function (g) { return g[1] === 'ud' ? cant(g, f, C) + ' ' + loc(g[2], C) : g[1] === 'pizca' ? 'una pizca de ' + loc(g[2], C) : cant(g, f, C) + ' de ' + loc(g[2], C); }).join(', ') + '.'; },
      coc_receta_b: function (pg, C) { return pg.rc.s.map(function (s, i) { return 'Paso ' + (i + 1) + '. ' + paso(loc(s, C))[1]; }).join(' ') + ' Consejo: ' + loc(pg.rc.c, C); }
    },
    escenas: {
      coc_capitulo: function (pg, C) { return { k: 'titulo', n: pg.n, t: loc(CATS[pg.cat].n, C), s: loc(CATS[pg.cat].intro, C) }; },
      coc_receta_a: function (pg, C) { var f = factor(pg.rc, C); return { k: 'lista', t: nombreR(pg.rc, C), s: porc(pg.rc, C) + ' · ' + tiempo(pg.rc.min), l: pg.rc.ing.map(function (g) { return cant(g, f, C) + ' ' + loc(g[2], C); }) }; },
      coc_receta_b: function (pg, C) { return pg.rc.s.slice(0, 6).map(function (s, i) { var p = paso(loc(s, C)); return { k: 'paso', n: i + 1, t: p[1], s: nombreR(pg.rc, C) + (p[0] ? ' · ' + p[0] : '') }; }); }
    }
  });

  window.EU_COCINA = { RECETAS: REC, CATS: CATS, combinado: combinado, loc: loc };
})();
