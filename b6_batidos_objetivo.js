/* b6_batidos_objetivo.js — Recetarios de batidos por objetivo de salud (window.EU_BATIDOS_OBJ).
   Colecciones: bajar de peso · ganar masa muscular · hipertensión (patrón DASH) · diabetes · las cuatro.
   · Base de nutrientes por 100 g (kcal, proteína, hidratos, azúcares, grasa, fibra, sodio, potasio).
   · Recetas firmadas por colección y combinaciones que se generan solas y solo se aceptan si cumplen
     los límites de su objetivo (calorías, proteína, azúcares, sodio, potasio, fibra).
   · Página «Información nutricional» tras cada receta: etiqueta por vaso, barras frente al objetivo,
     semáforo, bodegón de ingredientes (EU_BOTANICA) y por qué ayuda.
   · Apertura de cada colección con sus principios y su tabla de metas; tabla comparativa al final.
   Se elige en la materia «Batidos naturales» → opción «Colección». Los colores siguen al diseño elegido,
   a la paleta del panel y a la rotación. Cargar después de b6_cerebro_cocina.js y b6_botanica.js. */
(function () {
  var ED = window.EU_EDITORIAL, CO = window.EU_COCINA, CU = window.EU_CURRICULO;
  if (!ED || !CO || window.EU_BATIDOS_OBJ) return;
  var H = ED.H, esc = H.esc, BO = function () { return window.EU_BOTANICA; }, loc = CO.loc;
  function fmt(n, d) { var k = Math.pow(10, d == null ? 1 : d); return String(Math.round(n * k) / k).replace('.', ','); }

  /* kcal, prot, hc, azúc, grasa, fibra, sodio mg, potasio mg — por 100 g o 100 mL (USDA / BEDCA, redondeado) */
  var NUT = {
    'espinaca baby': [23, 2.9, 3.6, .4, .4, 2.2, 79, 558], 'col rizada (kale)': [49, 4.3, 9, 2.3, .9, 3.6, 38, 491], 'pepino': [15, .7, 3.6, 1.7, .1, .5, 2, 147], 'apio': [16, .7, 3, 1.3, .2, 1.6, 80, 260],
    'manzana verde': [52, .3, 14, 10, .2, 2.4, 1, 107], 'pera': [57, .4, 15, 10, .1, 3.1, 1, 116], 'piña': [50, .5, 13, 10, .1, 1.4, 1, 109], 'mango': [60, .8, 15, 14, .4, 1.6, 1, 168],
    'papaya': [43, .5, 11, 8, .3, 1.7, 8, 182], 'fresas': [32, .7, 7.7, 4.9, .3, 2, 1, 153], 'arándanos': [57, .7, 14, 10, .3, 2.4, 1, 77], 'frambuesas': [52, 1.2, 12, 4.4, .7, 6.5, 1, 151],
    'moras': [43, 1.4, 10, 4.9, .5, 5.3, 1, 162], 'plátano': [89, 1.1, 23, 12, .3, 2.6, 1, 358], 'kiwi': [61, 1.1, 15, 9, .5, 3, 3, 312], 'naranja': [47, .9, 12, 9, .1, 2.4, 0, 181],
    'limón (el zumo)': [22, .4, 7, 2.5, .2, .3, 1, 103], 'sandía': [30, .6, 8, 6, .2, .4, 1, 112], 'melón': [34, .8, 8, 8, .2, .9, 16, 267], 'aguacate': [160, 2, 8.5, .7, 15, 6.7, 7, 485],
    'remolacha cocida': [44, 1.7, 10, 8, .2, 2, 77, 305], 'zanahoria': [41, .9, 10, 4.7, .2, 2.8, 69, 320], 'jengibre fresco': [80, 1.8, 18, 1.7, .8, 2, 13, 415], 'menta fresca': [70, 3.8, 15, 0, .9, 8, 31, 569],
    'copos de avena': [379, 13, 68, 1, 6.5, 10, 6, 362], 'semillas de chía': [486, 17, 42, 0, 31, 34, 16, 407], 'linaza molida': [534, 18, 29, 1.6, 42, 27, 30, 813], 'almendras': [579, 21, 22, 4.4, 50, 12.5, 1, 733],
    'crema de cacahuete natural': [588, 25, 20, 9, 50, 6, 17, 649], 'cacao puro en polvo': [228, 20, 58, 1.8, 14, 37, 21, 1524], 'canela': [247, 4, 81, 2, 1.2, 53, 10, 431], 'dátiles': [282, 2.5, 75, 63, .4, 8, 2, 656],
    'semillas de calabaza': [559, 30, 11, 1.4, 49, 6, 7, 809], 'leche desnatada': [34, 3.4, 5, 5, .1, 0, 42, 156], 'leche entera': [61, 3.2, 4.8, 5, 3.3, 0, 43, 132],
    'bebida de almendra sin azúcar': [15, .5, .6, 0, 1.2, .3, 60, 70], 'bebida de avena': [45, 1, 6.5, 3.5, 1.5, .8, 40, 90], 'bebida de soja sin azúcar': [33, 3.3, .6, .2, 1.8, .6, 35, 120],
    'yogur griego natural 0 %': [59, 10, 3.6, 3.2, .4, 0, 36, 141], 'yogur natural': [61, 3.5, 4.7, 4.7, 3.3, 0, 46, 155], 'kéfir natural': [41, 3.3, 4.5, 4.5, 1, 0, 40, 164],
    'proteína de suero en polvo': [400, 80, 8, 4, 6, 0, 200, 500], 'tofu sedoso': [55, 4.8, 2, 1, 2.7, .1, 5, 120], 'agua fría': [0, 0, 0, 0, 0, 0, 1, 0], 'té verde frío': [1, 0, 0, 0, 0, 0, 1, 8], 'hielo': [0, 0, 0, 0, 0, 0, 0, 0]
  };
  var CLAVES = ['kcal', 'prot', 'hc', 'azuc', 'grasa', 'fibra', 'na', 'k'];
  function nutri(rc) {
    var t = [0, 0, 0, 0, 0, 0, 0, 0], v = rc.p || 1;
    rc.ing.forEach(function (g) { var n = NUT[g[2]]; if (!n) return; var gr = g[1] === 'g' || g[1] === 'ml' ? g[0] : g[1] === 'cda' ? g[0] * 12 : g[1] === 'cdta' ? g[0] * 4 : 0; n.forEach(function (x, i) { t[i] += x * gr / 100; }); });
    var o = {}; CLAVES.forEach(function (k, i) { o[k] = t[i] / v; }); return o;
  }

  /* ─────────── colecciones ─────────── */
  var OBJ = {
    peso: { n: 'Batidos para bajar de peso', c: 'Bajar de peso', ico: '⚖️',
      intro: 'Pocas calorías, mucha fibra y algo de proteína para llegar saciado a la siguiente comida. Sin azúcar añadido y con verduras en casi todos.',
      reglas: ['Menos de 250 kcal por vaso: sustituye un tentempié, no una comida completa.', 'Al menos 5 g de fibra: las verduras, la chía y los frutos rojos llenan sin sumar calorías.', 'Proteína de yogur griego o bebida de soja: sacia más que el azúcar.', 'Base de agua, té verde o bebida vegetal sin azúcar; el zumo suma azúcar sin fibra.'],
      meta: { kcal: [0, 250], fibra: [5, 99], azuc: [0, 20] }, bases: ['agua fría', 'té verde frío', 'bebida de almendra sin azúcar', 'bebida de soja sin azúcar'], frutas: ['fresas', 'frambuesas', 'moras', 'manzana verde', 'kiwi', 'piña', 'papaya', 'pera', 'melón'], verde: ['espinaca baby', 'pepino', 'apio', 'col rizada (kale)'], extra: [[1, 'cda', 'semillas de chía'], [1, 'cda', 'linaza molida'], [1, 'ud', 'jengibre fresco'], [6, 'ud', 'menta fresca'], [1, 'pizca', 'canela']], prot: [[120, 'g', 'yogur griego natural 0 %']],
      porque: 'Un vaso con fibra y proteína tarda más en vaciarse del estómago y mantiene estable la glucosa: el hambre llega más tarde. Adelgazar depende del balance del día entero; el batido ayuda si reemplaza un tentempié más calórico.' },
    musculo: { n: 'Batidos para ganar masa muscular', c: 'Masa muscular', ico: '💪',
      intro: 'Proteína completa, hidratos para reponer el glucógeno y grasas buenas para sumar energía. Pensados para después de entrenar.',
      reglas: ['De 25 a 40 g de proteína por vaso: la dosis que mejor aprovecha el músculo después de entrenar.', 'Hidratos de avena, plátano o dátil para reponer energía.', 'Calorías de 400 a 700: ganar masa pide comer algo más de lo que se gasta.', 'Tómalo en las dos horas siguientes al entrenamiento de fuerza.'],
      meta: { prot: [25, 60], kcal: [380, 750] }, bases: ['leche desnatada', 'leche entera', 'bebida de soja sin azúcar', 'kéfir natural'], frutas: ['plátano', 'frambuesas', 'mango', 'fresas', 'arándanos', 'piña'], verde: [], extra: [[1, 'cda', 'crema de cacahuete natural'], [2, 'cda', 'copos de avena'], [2, 'ud', 'dátiles'], [1, 'cda', 'cacao puro en polvo'], [15, 'g', 'almendras'], [1, 'cda', 'semillas de calabaza']], prot: [[30, 'g', 'proteína de suero en polvo'], [170, 'g', 'yogur griego natural 0 %'], [150, 'g', 'tofu sedoso']],
      porque: 'El músculo crece cuando el entrenamiento de fuerza se une a suficiente proteína y energía. La leucina de los lácteos y la soja activa la síntesis muscular; los hidratos reponen el glucógeno gastado y evitan que la proteína se use como combustible.' },
    hipertension: { n: 'Batidos para la hipertensión', c: 'Hipertensión', ico: '❤️',
      intro: 'Inspirados en el patrón DASH: mucho potasio, poco sodio, lácteos desnatados y fibra de fruta y verdura. Sin sal ni caldos.',
      reglas: ['Menos de 120 mg de sodio por vaso.', 'Más de 600 mg de potasio: plátano, aguacate, espinaca, kiwi y remolacha.', 'Lácteos desnatados para el calcio, sin grasa saturada.', 'Si tomas diuréticos que retienen potasio o tienes problemas de riñón, consulta antes a tu médico.'],
      meta: { na: [0, 120], k: [600, 9999] }, bases: ['leche desnatada', 'agua fría', 'bebida de almendra sin azúcar', 'yogur natural'], frutas: ['plátano', 'kiwi', 'naranja', 'melón', 'sandía', 'mango', 'papaya'], verde: ['espinaca baby', 'remolacha cocida', 'aguacate'], extra: [[1, 'cda', 'linaza molida'], [2, 'cda', 'copos de avena'], [1, 'cda', 'cacao puro en polvo'], [1, 'pizca', 'canela']], prot: [],
      porque: 'El potasio ayuda al riñón a eliminar sodio y relaja la pared de los vasos sanguíneos. En los estudios DASH, una dieta rica en fruta, verdura y lácteos desnatados bajó la presión sistólica unos 8 a 11 mmHg en personas con hipertensión.' },
    diabetes: { n: 'Batidos para personas con diabetes', c: 'Diabetes', ico: '🩸',
      intro: 'Pocos azúcares, fruta de índice glucémico bajo y la fibra, la proteína y la grasa buena que frenan la subida de glucosa.',
      reglas: ['Menos de 15 g de azúcares y 30 g de hidratos por vaso.', 'Al menos 6 g de fibra: chía, linaza, frutos rojos y verduras.', 'Proteína y grasa buena (yogur griego, aguacate, almendras) para que la glucosa suba despacio.', 'Nada de miel, dátiles ni zumo. Mide tu glucosa y ajusta con tu equipo médico.'],
      meta: { azuc: [0, 15], hc: [0, 30], fibra: [6, 99] }, bases: ['bebida de almendra sin azúcar', 'bebida de soja sin azúcar', 'agua fría', 'kéfir natural'], frutas: ['frambuesas', 'moras', 'fresas', 'arándanos', 'manzana verde', 'kiwi'], verde: ['espinaca baby', 'pepino', 'aguacate', 'col rizada (kale)'], extra: [[1, 'cda', 'semillas de chía'], [1, 'cda', 'linaza molida'], [15, 'g', 'almendras'], [1, 'pizca', 'canela']], prot: [[120, 'g', 'yogur griego natural 0 %'], [120, 'g', 'tofu sedoso']],
      porque: 'La fibra soluble de la chía y la linaza forma un gel que retrasa la absorción del azúcar. Los frutos rojos tienen poco azúcar y mucha fibra. Sumar proteína o grasa buena aplana todavía más la curva de glucosa después de beber.' }
  };
  var ORD = ['peso', 'musculo', 'hipertension', 'diabetes'];
  var FIRMA = {
    peso: [['Verde saciante de pepino y manzana', [[120, 'g', 'pepino'], [40, 'g', 'espinaca baby'], [150, 'g', 'manzana verde'], [1, 'ud', 'limón (el zumo)'], [300, 'ml', 'agua fría'], [2, 'cda', 'semillas de chía'], [1, 'ud', 'jengibre fresco']]], ['Frutos rojos con yogur griego', [[150, 'g', 'fresas'], [100, 'g', 'frambuesas'], [200, 'g', 'yogur griego natural 0 %'], [250, 'ml', 'bebida de almendra sin azúcar'], [1, 'cda', 'linaza molida']]], ['Piña, apio y menta', [[200, 'g', 'piña'], [80, 'g', 'apio'], [6, 'ud', 'menta fresca'], [350, 'ml', 'té verde frío'], [2, 'cda', 'semillas de chía']]]],
    musculo: [['Plátano, avena y cacahuete', [[240, 'g', 'plátano'], [60, 'g', 'copos de avena'], [2, 'cda', 'crema de cacahuete natural'], [500, 'ml', 'leche desnatada'], [30, 'g', 'proteína de suero en polvo']]], ['Cacao y dátil de recuperación', [[4, 'ud', 'dátiles'], [2, 'cda', 'cacao puro en polvo'], [340, 'g', 'yogur griego natural 0 %'], [400, 'ml', 'leche entera'], [30, 'g', 'almendras'], [2, 'cda', 'crema de cacahuete natural']]], ['Mango y tofu con soja', [[250, 'g', 'mango'], [300, 'g', 'tofu sedoso'], [400, 'ml', 'bebida de soja sin azúcar'], [60, 'g', 'copos de avena'], [2, 'cda', 'semillas de calabaza'], [30, 'g', 'proteína de suero en polvo']]]],
    hipertension: [['Plátano, espinaca y kiwi', [[200, 'g', 'plátano'], [60, 'g', 'espinaca baby'], [150, 'g', 'kiwi'], [400, 'ml', 'leche desnatada']]], ['Remolacha, naranja y plátano', [[160, 'g', 'remolacha cocida'], [300, 'g', 'naranja'], [150, 'g', 'plátano'], [1, 'ud', 'jengibre fresco'], [200, 'ml', 'agua fría'], [2, 'cda', 'copos de avena']]], ['Aguacate y melón', [[100, 'g', 'aguacate'], [300, 'g', 'melón'], [250, 'g', 'yogur natural'], [150, 'ml', 'agua fría'], [1, 'cda', 'linaza molida']]]],
    diabetes: [['Frutos rojos, chía y almendra', [[120, 'g', 'frambuesas'], [100, 'g', 'moras'], [2, 'cda', 'semillas de chía'], [400, 'ml', 'bebida de almendra sin azúcar'], [1, 'pizca', 'canela']]], ['Verde cremoso de aguacate', [[80, 'g', 'aguacate'], [50, 'g', 'espinaca baby'], [150, 'g', 'pepino'], [100, 'g', 'manzana verde'], [300, 'ml', 'bebida de soja sin azúcar'], [1, 'cda', 'semillas de chía'], [1, 'ud', 'limón (el zumo)']]], ['Fresa, kéfir y linaza', [[200, 'g', 'fresas'], [300, 'ml', 'kéfir natural'], [2, 'cda', 'linaza molida'], [100, 'ml', 'agua fría'], [15, 'g', 'almendras']]]]
  };
  function cumple(o, n) { return Object.keys(OBJ[o].meta).every(function (k) { var m = OBJ[o].meta[k]; return n[k] >= m[0] && n[k] <= m[1]; }); }
  function pasos(o, ing) {
    var solidos = ing.filter(function (g) { return !/^(agua|té|leche|bebida|kéfir|yogur)/.test(g[2]); }).map(function (g) { return g[2]; }), liq = ing.filter(function (g) { return /^(agua|té|leche|bebida|kéfir)/.test(g[2]); }).map(function (g) { return g[2]; });
    var s = ['Prepara: lava la fruta y la verdura; pela y trocea ' + (solidos.slice(0, 2).join(' y ') || 'la fruta') + '.', 'Líquido: pon primero ' + (liq[0] || 'el yogur') + ' en el vaso de la batidora de vaso.', 'Tritura: añade el resto y tritura durante 60 segundos, hasta que quede liso.'];
    if (/chía|linaza/.test(ing.map(function (g) { return g[2]; }).join(' '))) s.push('Reposa: deja 5 minutos para que la chía o la linaza hidraten y espesen.');
    s.push('Sirve: al momento, frío' + (o === 'musculo' ? ', dentro de las dos horas siguientes al entrenamiento.' : '.'));
    return s;
  }
  var CONS = { peso: ['Bébelo despacio, en unos diez minutos: la sensación de saciedad tarda en llegar.', 'Congela la fruta en trozos y no necesitarás hielo.', 'Si lo tomas a media tarde, evita picar hasta la cena.'], musculo: ['Si te cuesta llegar a las calorías, añade una cucharada más de crema de cacahuete.', 'La proteína de suero sin sabor deja que la fruta mande.', 'Con fruta congelada queda espeso como un helado.'], hipertension: ['No añadas sal, caldos ni bebidas isotónicas: suman sodio.', 'La remolacha cocida al vapor conserva más nitratos que la hervida.', 'Tómalo como parte de las cinco raciones de fruta y verdura del día.'], diabetes: ['Mide tu glucosa dos horas después la primera vez para ver cómo te sienta.', 'Endulza con canela o vainilla, nunca con miel ni sirope.', 'Mejor como parte de una comida que solo y en ayunas.'] };
  var ERR = { peso: 'Añadir zumo o miel «para que sepa mejor»: duplica las calorías.', musculo: 'Tomarlo en lugar de una comida: suma, no sustituye.', hipertension: 'Usar agua de coco o bebidas deportivas: llevan bastante sodio.', diabetes: 'Llenar el vaso de plátano o mango maduros: disparan la glucosa.' };
  function receta(o, n, ing, id, gen) { var r0 = H.rng(H.hash(id)); return { cat: 'batidos', obj: o, id: id, n: n, p: 2, min: 5, h: 0, d: 1, gen: !!gen, ing: ing, s: pasos(o, ing), c: H.pick(r0, CONS[o]), e: ERR[o], v: 'Cambia la fruta por otra de la misma lista de la colección y mantén el resto.' }; }
  function generadas(o, sem) {
    var B = OBJ[o], r = H.rng(9001 + sem * 31 + H.hash(o)), out = [], vistos = {};
    for (var i = 0; i < 600 && out.length < 90; i++) {
      var f1 = H.pick(r, B.frutas), f2 = H.pick(r, B.frutas); if (f2 === f1) f2 = null;
      var v = B.verde.length && r() < .7 ? H.pick(r, B.verde) : null, b = H.pick(r, B.bases), x = H.pick(r, B.extra), pr = B.prot.length ? (o === 'musculo' ? H.pick(r, B.prot) : r() < .5 ? H.pick(r, B.prot) : null) : null;
      var ing = [[H.pick(r, [150, 200, 250]), 'g', f1]]; if (f2) ing.push([H.pick(r, [100, 150]), 'g', f2]); if (v) ing.push([/aguacate/.test(v) ? 80 : /remolacha/.test(v) ? 120 : H.pick(r, [40, 60, 100]), 'g', v]);
      ing.push([b === 'yogur natural' ? 250 : H.pick(r, [300, 400]), /yogur/.test(b) ? 'g' : 'ml', b]); if (pr) ing.push(pr.slice()); ing.push(x.slice());
      if (o === 'musculo' && !ing.some(function (g) { return /avena|dátil/.test(g[2]); })) ing.push([60, 'g', 'copos de avena']);
      var nom = 'Batido de ' + f1 + (f2 ? ' y ' + f2 : '') + (v ? ' con ' + v.replace(/ \(.*\)|baby| cocida/g, '').trim() : '') + (x[2] ? ' y ' + x[2].replace(/semillas de |fresco|fresca| en polvo| natural|puro /g, '').trim() : '');
      if (vistos[nom]) continue;
      var rc = receta(o, nom, ing, 'obj_' + o + '_' + i, false);
      if (cumple(o, nutri(rc))) { vistos[nom] = 1; out.push(rc); }
    }
    return out;
  }
  var CACHE = {};
  function coleccion(o, sem) {
    var k = o + sem; if (CACHE[k]) return CACHE[k];
    var f = FIRMA[o].map(function (x, i) { return receta(o, x[0], x[1], 'fir_' + o + '_' + i); });
    return (CACHE[k] = { firma: f, gen: generadas(o, sem) });
  }

  /* ─────────── páginas ─────────── */
  function semaforo(o, n) {
    return Object.keys(OBJ[o].meta).map(function (k) { var m = OBJ[o].meta[k], ok = n[k] >= m[0] && n[k] <= m[1]; return [k, ok]; });
  }
  var NOM = { kcal: ['Energía', 'kcal'], prot: ['Proteína', 'g'], hc: ['Hidratos de carbono', 'g'], azuc: ['de los cuales azúcares', 'g'], grasa: ['Grasa', 'g'], fibra: ['Fibra', 'g'], na: ['Sodio', 'mg'], k: ['Potasio', 'mg'] };
  function metaTxt(o, k) { var m = OBJ[o].meta[k]; return m[1] >= 999 ? 'más de ' + m[0] + ' ' + NOM[k][1] : m[0] <= 0 ? 'menos de ' + m[1] + ' ' + NOM[k][1] : m[0] + '–' + m[1] + ' ' + NOM[k][1]; }
  function etiqueta(C, n) {
    var T = C.T, fila = function (k, sub) { return '<tr><td style="padding:1.3mm 2mm;border-top:' + (sub ? '0' : '0.25mm solid ' + T.ink) + ';' + (sub ? 'padding-left:6mm;font-style:italic' : 'font-weight:700') + '">' + NOM[k][0] + '</td><td style="padding:1.3mm 2mm;text-align:right;border-top:' + (sub ? '0' : '0.25mm solid ' + T.ink) + ';font-variant-numeric:tabular-nums">' + fmt(n[k], k === 'na' || k === 'k' || k === 'kcal' ? 0 : 1) + ' ' + NOM[k][1] + '</td></tr>'; };
    return '<div style="border:0.6mm solid ' + T.ink + ';padding:2.5mm 3mm;font-size:.88em;background:' + T.bg + '"><div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:1.35em;line-height:1.1">Información nutricional</div><div style="border-bottom:1.6mm solid ' + T.ink + ';padding-bottom:1mm;margin-bottom:.5mm;opacity:.8">Por vaso (la receta da 2)</div><table style="width:100%;border-collapse:collapse">' +
      ['kcal', 'grasa', 'hc', 'azuc', 'fibra', 'prot', 'na', 'k'].map(function (k) { return fila(k, k === 'azuc'); }).join('') + '</table></div>';
  }
  function barrasMeta(C, o, n) {
    var T = C.T, ks = Object.keys(OBJ[o].meta).concat(['prot', 'fibra', 'kcal'].filter(function (k) { return !OBJ[o].meta[k]; })).slice(0, 4), W = 360, fil = 44, s = '';
    ks.forEach(function (k, i) {
      var m = OBJ[o].meta[k] || [0, 0], v = n[k], tope = Math.max(v, m[1] < 999 ? m[1] : m[0] * 1.6, 1) * 1.15, x0 = 110, bw = W - x0 - 20, y = 10 + i * fil, ok = !OBJ[o].meta[k] || (v >= m[0] && v <= m[1]);
      s += '<text x="0" y="' + (y + 15) + '" font-size="12" font-family="' + esc(T.cuerpo) + '" font-weight="700" fill="' + T.ink + '">' + esc(NOM[k][0].replace('de los cuales ', '')) + '</text>' + '<rect x="' + x0 + '" y="' + y + '" width="' + bw + '" height="20" rx="' + Math.min(T.r, 10) + '" fill="' + T.soft + '"/>';
      if (OBJ[o].meta[k]) { var a = x0 + bw * m[0] / tope, b = x0 + bw * Math.min(m[1], tope) / tope; s += '<rect x="' + a.toFixed(1) + '" y="' + (y - 3) + '" width="' + Math.max(2, b - a).toFixed(1) + '" height="26" fill="none" stroke="' + T.acc2 + '" stroke-width="2" stroke-dasharray="4 3"/>'; }
      s += '<rect x="' + x0 + '" y="' + (y + 4) + '" width="' + (bw * v / tope).toFixed(1) + '" height="12" rx="3" fill="' + (ok ? T.acc : '#C0392B') + '"><animate attributeName="width" from="0" to="' + (bw * v / tope).toFixed(1) + '" dur="1s" begin="' + i * .2 + 's" fill="freeze"/></rect>' +
        '<text x="' + (x0 + bw) + '" y="' + (y + 36) + '" text-anchor="end" font-size="11" font-family="' + esc(T.cuerpo) + '" fill="' + T.ink + '">' + fmt(v, k === 'na' || k === 'k' || k === 'kcal' ? 0 : 1) + ' ' + NOM[k][1] + (OBJ[o].meta[k] ? ' · meta: ' + metaTxt(o, k) : '') + '</text>';
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" data-plano="1" viewBox="0 0 ' + W + ' ' + (ks.length * fil + 14) + '" style="width:100%;height:auto;display:block">' + s + '</svg>';
  }
  var paginas = {
    bat_obj_intro: function (pg, C) {
      var T = C.T, B = OBJ[pg.o], bo = BO();
      return H.cabecera(C, pg) + '<div style="font-family:' + T.tit + ';font-size:' + (C.fs * 6) + 'px;color:' + T.acc + ';line-height:.9">' + pg.n + '</div>' + H.h1(C, esc(B.n)) + '<p style="font-size:1.12em;max-width:160mm;margin:0 0 4mm;text-wrap:pretty">' + esc(B.intro) + '</p>' +
        (bo ? '<div style="margin:0 0 4mm">' + bo.bodegon(B.frutas.slice(0, 3).concat(B.verde.slice(0, 2)).map(bo.deIngrediente).filter(Boolean), C, { alto: 230, nombres: false }) + '</div>' : '') +
        H.h2(C, 'Las reglas de esta colección') + B.reglas.map(function (s, i) { return '<div style="display:flex;gap:3mm;margin:0 0 2.4mm"><b style="flex:none;width:6mm;height:6mm;border-radius:50%;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:.8em">' + (i + 1) + '</b><div>' + esc(s) + '</div></div>'; }).join('') +
        '<div style="display:flex;gap:3mm;flex-wrap:wrap;margin-top:4mm">' + Object.keys(B.meta).map(function (k) { return '<div style="flex:1;min-width:30mm;border-top:0.6mm solid ' + T.acc + ';padding:2mm 0"><div style="font-size:.72em;letter-spacing:.1em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">' + NOM[k][0].replace('de los cuales ', '') + '</div><div style="font-weight:700">' + metaTxt(pg.o, k) + '</div></div>'; }).join('') + '</div>' + H.folio(C, pg);
    },
    bat_nutri: function (pg, C) {
      var T = C.T, rc = pg.rc, o = rc.obj, n = nutri(rc), B = OBJ[o], bo = BO(), sem = semaforo(o, n);
      var chips = '<div style="display:flex;gap:2mm;flex-wrap:wrap;margin:0 0 4mm">' + sem.map(function (s) { return '<span style="display:inline-flex;align-items:center;gap:1.5mm;padding:.8mm 3mm;border-radius:99px;border:0.3mm solid ' + (s[1] ? T.acc : '#C0392B') + ';font-size:.85em"><b style="color:' + (s[1] ? T.acc : '#C0392B') + '">' + (s[1] ? '✓' : '!') + '</b>' + NOM[s[0]][0].replace('de los cuales ', '') + ': ' + metaTxt(o, s[0]) + '</span>'; }).join('') + '</div>';
      return H.cabecera(C, pg) + '<div style="font-size:.8em;letter-spacing:.12em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">' + esc(B.c) + ' · por qué funciona</div>' + H.h1(C, esc(loc(rc.n, C)), 'margin-bottom:3mm') + chips +
        '<div style="display:grid;grid-template-columns:62mm 1fr;gap:7mm;align-items:start">' + etiqueta(C, n) + '<div>' + barrasMeta(C, o, n) + (bo ? '<div style="margin-top:3mm">' + bo.bodegon(bo.idsDe(rc), C, { alto: 190, nombres: true, max: 5 }) + '</div>' : '') + '</div></div>' +
        H.guia(C, B.porque, false) + '<p style="font-size:.78em;opacity:.75;margin:3mm 0 0;max-width:165mm">Valores aproximados calculados a partir de tablas de composición de alimentos. Este libro no sustituye el consejo de tu médico o nutricionista.</p>' + H.folio(C, pg);
    },
    bat_tabla: function (pg, C, modo, ctx) {
      var T = C.T, recs = [], vis = {};
      ctx.pages.forEach(function (p) { if (p.tipo === 'bat_nutri' && !vis[p.rc.id]) { vis[p.rc.id] = 1; recs.push(p); } });
      var parte = recs.slice(pg.desde || 0, (pg.desde || 0) + 26);
      var th = function (s) { return '<th style="padding:1.2mm 1.5mm;text-align:right;border-bottom:0.4mm solid ' + T.ink + ';font-size:.8em">' + s + '</th>'; };
      return H.cabecera(C, pg) + H.h1(C, pg.desde ? 'Tabla comparativa (continuación)' : 'Tabla comparativa', 'font-size:' + (C.fs * 1.6) + 'px') +
        '<table style="width:100%;border-collapse:collapse;font-size:.8em;font-variant-numeric:tabular-nums"><tr><th style="text-align:left;padding:1.2mm 1.5mm;border-bottom:0.4mm solid ' + T.ink + ';font-size:.8em">Receta</th>' + th('Pág.') + th('kcal') + th('Prot.') + th('Azúc.') + th('Fibra') + th('Sodio') + th('Potasio') + '</tr>' +
        parte.map(function (p) { var n = nutri(p.rc); return '<tr><td style="padding:1mm 1.5mm;border-bottom:1px solid ' + T.soft + '">' + esc(loc(p.rc.n, C)) + '</td>' + [p.num, Math.round(n.kcal), fmt(n.prot), fmt(n.azuc), fmt(n.fibra), Math.round(n.na), Math.round(n.k)].map(function (v) { return '<td style="padding:1mm 1.5mm;text-align:right;border-bottom:1px solid ' + T.soft + '">' + v + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>' + H.folio(C, pg);
    }
  };

  /* ─────────── armado ─────────── */
  function armar(C, pool, N, r) {
    var o0 = C.op.objetivo, objs = o0 === 'todos' ? ORD : [o0], core = [], filas = 0, cols = {}, pos = {};
    objs.forEach(function (o, ci) {
      var col = cols[o] = coleccion(o, C.semilla || 1); pos[o] = 0;
      core.push({ tipo: 'bat_obj_intro', o: o, n: ci + 1, indice: OBJ[o].c, indiceN: 'Colección ' + (ci + 1), cab: OBJ[o].c }); filas++;
      col.firma.forEach(function (rc) { core.push({ tipo: 'coc_receta_a', rc: rc, n: ci + 1, indice: rc.n, cab: OBJ[o].c }, { tipo: 'coc_receta_b', rc: rc, n: ci + 1, cab: OBJ[o].c }, { tipo: 'bat_nutri', rc: rc, n: ci + 1, cab: OBJ[o].c }); filas++; });
    });
    var nRec = objs.reduce(function (s, o) { return s + cols[o].firma.length + cols[o].gen.length; }, 0);
    var fin = N >= 24 ? [{ tipo: 'bat_tabla', indice: 'Tabla comparativa', desde: 0 }] : [];
    for (var z = 26; N >= 60 && z < Math.min(nRec, N / 3); z += 26) fin.push({ tipo: 'bat_tabla', desde: z });
    if (N >= 30) fin.push({ tipo: 'coc_equivalencias', indice: 'Equivalencias' });
    var k = 0;
    return H.envolver(C, core, N, function (i) {
      for (var q = 0; q < objs.length; q++) {
        var o = objs[(k + q) % objs.length], rc = cols[o].gen[pos[o]];
        if (!rc) continue;
        pos[o]++; k++;
        var ci = objs.indexOf(o), idx = -1; for (var zz = 0; zz < core.length; zz++) if (core[zz].rc && core[zz].rc.obj === o || core[zz].o === o) idx = zz;
        var add = [{ tipo: 'coc_receta_a', rc: rc, n: ci + 1, indice: rc.n, cab: OBJ[o].c, relleno: true }, { tipo: 'coc_receta_b', rc: rc, n: ci + 1, cab: OBJ[o].c, relleno: true }, { tipo: 'bat_nutri', rc: rc, n: ci + 1, cab: OBJ[o].c, relleno: true }];
        core.splice.apply(core, [idx + 1, 0].concat(add));
        return [];
      }
      return [{ tipo: 'coc_mireceta', n: 1, cab: 'Mis recetas', relleno: true }];
    }, { intro: { tipo: 'coc_intro', indice: 'Antes de empezar' }, fin: fin, indiceFilas: filas + 40 });
  }
  var PROD = ED.PRODUCTOS.filter(function (p) { return p.id === 'recetario'; })[0];
  if (PROD && !PROD._obj) {
    var armar0 = PROD.armar, tit0 = PROD.titulo;
    PROD.armar = function (C, pool, N, r) { if (C.mat === 'batidos' && C.op.objetivo && C.op.objetivo !== 'general') return armar(C, pool, N, r); return armar0.apply(this, arguments); };
    PROD.titulo = function (C) { var o = C.mat === 'batidos' && C.op && C.op.objetivo; if (o && o !== 'general') return o === 'todos' ? 'Batidos para tu salud' : OBJ[o].n; return tit0 ? tit0.apply(this, arguments) : ''; };
    PROD._obj = true;
  }
  var M = CU && CU.materia && CU.materia('batidos');
  if (M) { M.opciones = (M.opciones || []).filter(function (x) { return x.k !== 'objetivo'; }); M.opciones.unshift({ k: 'objetivo', n: 'Colección', tipo: 'chips', def: 'general', ops: [['general', 'General'], ['peso', 'Bajar de peso'], ['musculo', 'Masa muscular'], ['hipertension', 'Hipertensión'], ['diabetes', 'Diabetes'], ['todos', 'Las cuatro']] }); }
  /* Título automático: el motor lo calcula antes de conocer la colección. */
  ED.registrar({
    paginas: paginas,
    ajuste: function (C) { var o = C.mat === 'batidos' && C.op && C.op.objetivo; if (o && o !== 'general' && !(C.cfg.titulo || '').trim()) C.titulo = o === 'todos' ? 'Batidos para tu salud' : OBJ[o].n; },
    voz: { bat_nutri: function (pg, C) { var n = nutri(pg.rc); return loc(pg.rc.n, C) + '. Por vaso: ' + Math.round(n.kcal) + ' kilocalorías, ' + fmt(n.prot) + ' gramos de proteína, ' + fmt(n.fibra) + ' de fibra. ' + OBJ[pg.rc.obj].porque; }, bat_obj_intro: function (pg) { return OBJ[pg.o].n + '. ' + OBJ[pg.o].intro + ' ' + OBJ[pg.o].reglas.join(' '); } },
    escenas: { bat_obj_intro: function (pg) { return { k: 'titulo', n: pg.n, t: OBJ[pg.o].n, s: OBJ[pg.o].intro }; }, bat_nutri: function (pg, C) { var n = nutri(pg.rc); return { k: 'lista', t: loc(pg.rc.n, C), s: OBJ[pg.rc.obj].c, l: [Math.round(n.kcal) + ' kcal', fmt(n.prot) + ' g de proteína', fmt(n.fibra) + ' g de fibra', Math.round(n.na) + ' mg de sodio'] }; } }
  });

  window.EU_BATIDOS_OBJ = { OBJ: OBJ, NUT: NUT, nutri: nutri, coleccion: coleccion, cumple: cumple };
})();
