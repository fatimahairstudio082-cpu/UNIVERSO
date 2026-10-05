/* b6_cerebro_idiomas.js — cerebro de idiomas del Editorial.
   Diccionario temático en español, inglés, francés, alemán y suizo alemán
   (grafía zuriquesa aproximada: cambia de un cantón a otro).
   Registra: materia «idiomas», unidades por tema (para que cualquier producto
   general funcione), el producto «diccionario», sus páginas, su voz
   multilingüe, escenas de vídeo y preguntas del panel. */
(function () {
  'use strict';
  if (window.EU_IDIOMAS || !window.EU_EDITORIAL) return;
  var ED = window.EU_EDITORIAL, H = ED.H;

  var LENG = {
    es: { n: 'Español', c: 'ES', lang: 'es-ES', col: '#B8322A' },
    en: { n: 'Inglés', c: 'EN', lang: 'en-GB', col: '#1F4E8C' },
    fr: { n: 'Francés', c: 'FR', lang: 'fr-FR', col: '#2F8F83' },
    de: { n: 'Alemán', c: 'DE', lang: 'de-DE', col: '#9A6B00' },
    gsw: { n: 'Suizo alemán', c: 'CH', lang: 'de-CH', col: '#7A3E9D' }
  };
  var ORDEN = ['es', 'en', 'fr', 'de', 'gsw'];

  /* es | en | fr | de | gsw — sustantivos con artículo (en inglés sin él). */
  var TEMAS = [
    { id: 'saludos', t: ['Saludos', 'Greetings', 'Les salutations', 'Begrüssungen', 'Grüess'], pat: 'frase', w: [
      'hola|hello|bonjour|hallo|grüezi', 'adiós|goodbye|au revoir|auf Wiedersehen|uf Widerluege', 'por favor|please|s’il vous plaît|bitte|bitte',
      'gracias|thank you|merci|danke|merci vilmal', 'buenos días|good morning|bonjour|guten Morgen|guete Morge', 'buenas noches|good night|bonne nuit|gute Nacht|guet Nacht',
      '¿cómo estás?|how are you?|comment ça va ?|wie geht’s?|wie gohts?', 'me llamo…|my name is…|je m’appelle…|ich heisse…|ich heisse…',
      'perdón|sorry|pardon|Entschuldigung|Äxgüsi', 'sí|yes|oui|ja|jo', 'no|no|non|nein|nei'] },
    { id: 'numeros', t: ['Los números', 'Numbers', 'Les nombres', 'Die Zahlen', 'D Zahle'], pat: 'num', w: [
      'uno|one|un|eins|eis', 'dos|two|deux|zwei|zwei', 'tres|three|trois|drei|drü', 'cuatro|four|quatre|vier|vier', 'cinco|five|cinq|fünf|föif',
      'seis|six|six|sechs|sächs', 'siete|seven|sept|sieben|sibe', 'ocho|eight|huit|acht|acht', 'nueve|nine|neuf|neun|nüün', 'diez|ten|dix|zehn|zää'] },
    { id: 'colores', t: ['Los colores', 'Colours', 'Les couleurs', 'Die Farben', 'D Farbe'], pat: 'color', w: [
      'rojo|red|rouge|Rot|Rot', 'azul|blue|bleu|Blau|Blau', 'amarillo|yellow|jaune|Gelb|Gäl', 'verde|green|vert|Grün|Grüen', 'blanco|white|blanc|Weiss|Wiiss',
      'negro|black|noir|Schwarz|Schwarz', 'naranja|orange|orange|Orange|Orange', 'morado|purple|violet|Violett|Violett', 'rosa|pink|rose|Rosa|Rosa', 'gris|grey|gris|Grau|Grau'] },
    { id: 'familia', t: ['La familia', 'The family', 'La famille', 'Die Familie', 'D Familie'], pat: 'nombre', w: [
      'la madre|mother|la mère|die Mutter|d Muetter', 'el padre|father|le père|der Vater|de Vatter', 'el hermano|brother|le frère|der Bruder|de Brüeder',
      'la hermana|sister|la sœur|die Schwester|d Schwöschter', 'la abuela|grandmother|la grand-mère|die Grossmutter|s Grosi', 'el abuelo|grandfather|le grand-père|der Grossvater|de Grossvatter',
      'el bebé|baby|le bébé|das Baby|s Bébé', 'el tío|uncle|l’oncle|der Onkel|de Unggle', 'la tía|aunt|la tante|die Tante|d Tante', 'el niño|child|l’enfant|das Kind|s Chind'] },
    { id: 'comida', t: ['La comida', 'Food', 'La nourriture', 'Das Essen', 'S Ässe'], pat: 'nombre', w: [
      'el pan|bread|le pain|das Brot|s Brot', 'la leche|milk|le lait|die Milch|d Milch', 'el agua|water|l’eau|das Wasser|s Wasser', 'la manzana|apple|la pomme|der Apfel|de Öpfel',
      'el queso|cheese|le fromage|der Käse|de Chäs', 'la mantequilla|butter|le beurre|die Butter|de Anke', 'la zanahoria|carrot|la carotte|die Karotte|s Rüebli',
      'el huevo|egg|l’œuf|das Ei|s Ei', 'el chocolate|chocolate|le chocolat|die Schokolade|d Schoggi', 'la galleta|biscuit|le biscuit|der Keks|s Guetzli', 'el helado|ice cream|la glace|das Eis|d Glace'] },
    { id: 'casa', t: ['La casa', 'The house', 'La maison', 'Das Haus', 'S Huus'], pat: 'nombre', w: [
      'la casa|house|la maison|das Haus|s Huus', 'la cocina|kitchen|la cuisine|die Küche|d Chuchi', 'la mesa|table|la table|der Tisch|de Tisch', 'la silla|chair|la chaise|der Stuhl|de Stuel',
      'la cama|bed|le lit|das Bett|s Bett', 'la puerta|door|la porte|die Tür|d Tüür', 'la ventana|window|la fenêtre|das Fenster|s Fänschter',
      'el armario de cocina|kitchen cupboard|le placard de cuisine|der Küchenschrank|s Chuchichäschtli', 'el baño|bathroom|la salle de bain|das Badezimmer|s Badzimmer', 'el jardín|garden|le jardin|der Garten|de Garte'] },
    { id: 'escuela', t: ['La escuela', 'School', 'L’école', 'Die Schule', 'D Schuel'], pat: 'nombre', w: [
      'la escuela|school|l’école|die Schule|d Schuel', 'el libro|book|le livre|das Buch|s Buech', 'el lápiz|pencil|le crayon|der Bleistift|de Bleistift', 'el cuaderno|notebook|le cahier|das Heft|s Heft',
      'la maestra|teacher|la maîtresse|die Lehrerin|d Lehrerin', 'la mochila|school bag|le cartable|der Schulranzen|de Thek', 'la goma|rubber|la gomme|der Radiergummi|de Radiergummi',
      'la regla|ruler|la règle|das Lineal|s Lineal', 'el recreo|break|la récréation|die Pause|d Pause', 'la pizarra|board|le tableau|die Tafel|d Wandtafele'] },
    { id: 'animales', t: ['Los animales', 'Animals', 'Les animaux', 'Die Tiere', 'D Tier'], pat: 'nombre', w: [
      'el perro|dog|le chien|der Hund|de Hund', 'el gato|cat|le chat|die Katze|d Chatz', 'la vaca|cow|la vache|die Kuh|d Chue', 'el caballo|horse|le cheval|das Pferd|s Ross',
      'el pájaro|bird|l’oiseau|der Vogel|de Vogel', 'el pez|fish|le poisson|der Fisch|de Fisch', 'el ratón|mouse|la souris|die Maus|d Muus', 'la oveja|sheep|le mouton|das Schaf|s Schaaf',
      'el conejo|rabbit|le lapin|das Kaninchen|s Chüngeli', 'el cerdo|pig|le cochon|das Schwein|s Säuli'] },
    { id: 'cuerpo', t: ['El cuerpo', 'The body', 'Le corps', 'Der Körper', 'De Körper'], pat: 'nombre', w: [
      'la cabeza|head|la tête|der Kopf|de Chopf', 'la mano|hand|la main|die Hand|d Hand', 'el pie|foot|le pied|der Fuss|de Fuess', 'el ojo|eye|l’œil|das Auge|s Aug',
      'la nariz|nose|le nez|die Nase|d Nase', 'la boca|mouth|la bouche|der Mund|de Mund', 'la oreja|ear|l’oreille|das Ohr|s Ohr', 'el brazo|arm|le bras|der Arm|de Arm', 'el diente|tooth|la dent|der Zahn|de Zahn'] },
    { id: 'ciudad', t: ['La ciudad', 'The town', 'La ville', 'Die Stadt', 'D Stadt'], pat: 'nombre', w: [
      'la calle|street|la rue|die Strasse|d Strass', 'la bicicleta|bicycle|le vélo|das Fahrrad|s Velo', 'el autobús|bus|le bus|der Bus|de Bus', 'el tren|train|le train|der Zug|de Zug',
      'la tienda|shop|le magasin|das Geschäft|de Lade', 'la panadería|bakery|la boulangerie|die Bäckerei|d Beckerei', 'el parque|park|le parc|der Park|de Park',
      'el hospital|hospital|l’hôpital|das Spital|s Spital', 'la acera|pavement|le trottoir|der Gehweg|s Trottoir', 'el celular|mobile phone|le portable|das Handy|s Natel'] },
    { id: 'cocina', t: ['En la cocina', 'In the kitchen', 'Dans la cuisine', 'In der Küche', 'I de Chuchi'], pat: 'nombre', w: [
      'la harina|flour|la farine|das Mehl|s Mehl', 'el azúcar|sugar|le sucre|der Zucker|de Zucker', 'el horno|oven|le four|der Ofen|de Ofe', 'la cuchara|spoon|la cuillère|der Löffel|de Löffel',
      'el tenedor|fork|la fourchette|die Gabel|d Gable', 'el cuchillo|knife|le couteau|das Messer|s Mässer', 'el plato|plate|l’assiette|der Teller|de Teller', 'el vaso|glass|le verre|das Glas|s Glas',
      'el desayuno|breakfast|le petit-déjeuner|das Frühstück|de Zmorge', 'la cena|dinner|le dîner|das Abendessen|de Znacht'] }
  ];
  if (window.EU_IDIOMAS_PLUS) TEMAS = TEMAS.concat(window.EU_IDIOMAS_PLUS);
  /* Frases de ejemplo propias de cada tema clásico (así no se repite «Aquí está…»). */
  var EJ = {
    familia: ['{W} vive con nosotros.', 'The {w} lives with us.', '{W} habite avec nous.', '{W} wohnt bei uns.', '{W} wohnt bi üs.'],
    comida: ['{W} está en la mesa.', 'The {w} is on the table.', '{W} est sur la table.', '{W} ist auf dem Tisch.', '{W} isch uf em Tisch.'],
    casa: ['{W} está en la planta baja.', 'The {w} is on the ground floor.', '{W} est au rez-de-chaussée.', '{W} ist im Erdgeschoss.', '{W} isch im Parterre.'],
    escuela: ['{W} está en el aula.', 'The {w} is in the classroom.', '{W} est dans la classe.', '{W} ist im Klassenzimmer.', '{W} isch im Schuelzimmer.'],
    animales: ['{W} duerme en el jardín.', 'The {w} sleeps in the garden.', '{W} dort dans le jardin.', '{W} schläft im Garten.', '{W} schlaft im Garte.'],
    cuerpo: ['Me duele {w}.', 'My {w} hurts.', 'J’ai mal à {w}.', '{W} tut mir weh.', '{W} tuet mer weh.'],
    ciudad: ['{W} está cerca del centro.', 'The {w} is near the centre.', '{W} est près du centre.', '{W} ist nahe beim Zentrum.', '{W} isch nöch bim Zentrum.'],
    cocina: ['Necesito {w} para la receta.', 'I need the {w} for the recipe.', 'J’ai besoin de {w} pour la recette.', 'Für das Rezept brauche ich {w}.', 'Für s Rezäpt bruuch ich {w}.']
  };
  TEMAS.forEach(function (t) { if (!t.ej && EJ[t.id]) t.ej = EJ[t.id]; });
  TEMAS.forEach(function (t) { t.pal = t.w.map(function (x, i) { var p = x.split('|'); return { id: t.id + i, tema: t.id, es: p[0], en: p[1], fr: p[2], de: p[3], gsw: p[4] }; }); });

  function langs(C) {
    var l = (C.op.idiomas && C.op.idiomas.length ? C.op.idiomas : ORDEN).slice();
    var base = C.op.base || 'es';
    if (l.indexOf(base) < 0) l.unshift(base);
    return { base: base, otros: l.filter(function (x) { return x !== base; }), todos: [base].concat(l.filter(function (x) { return x !== base; })) };
  }
  function palabra(p, lg, C) { var w = p[lg]; return lg === 'es' ? H.sub(w, C) : w; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function ejemplo(t, p, lg, C) {
    var w = palabra(p, lg, C), nom = { es: C.P.nombres[0], en: 'Tom', fr: 'Léa', de: 'Lena', gsw: 'd Anna' }[lg];
    var fr0 = t.ej && (t.ej2 && (t.pal.indexOf(p) % 2) ? t.ej2 : t.ej)[ORDEN.indexOf(lg)];
    if (fr0) { var r0 = fr0.replace('{W}', cap(w)).replace('{w}', w); if (lg === 'fr') r0 = r0.replace(/\bà le /g, 'au ').replace(/\bà les /g, 'aux ').replace(/\bde le /g, 'du ').replace(/\bde les /g, 'des ').replace(/\bde ([aeiouhéè])/gi, 'd’$1'); if (lg === 'de' || lg === 'gsw') r0 = r0.charAt(0).toUpperCase() + r0.slice(1); return r0; }
    if (t.pat === 'frase') return { es: '—' + cap(w) + ' —dice ' + nom + '.', en: '“' + cap(w) + '”, says ' + nom + '.', fr: '« ' + cap(w) + ' », dit ' + nom + '.', de: '„' + cap(w) + '“, sagt ' + nom + '.', gsw: '«' + cap(w) + '», seit ' + nom + '.' }[lg];
    if (t.pat === 'num') return { es: 'Cuento hasta ' + w + '.', en: 'I count to ' + w + '.', fr: 'Je compte jusqu’à ' + w + '.', de: 'Ich zähle bis ' + w + '.', gsw: 'Ich zell bis ' + w + '.' }[lg];
    if (t.pat === 'color') return { es: 'Me gusta el ' + w + '.', en: 'I like ' + w + '.', fr: 'J’aime ' + (/^[aeiouh]/i.test(w) ? 'l’' : 'le ') + w + '.', de: 'Ich mag ' + w + '.', gsw: 'Ich ha ' + w + ' gärn.' }[lg];
    return { es: 'Aquí está ' + w + '.', en: 'Here is the ' + w + '.', fr: 'Voici ' + w + '.', de: 'Hier ist ' + w + '.', gsw: 'Da isch ' + w + '.' }[lg];
  }
  function chipL(lg, mm) { var L = LENG[lg]; return '<span style="flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:' + (mm || 9) + 'mm;height:5.2mm;border-radius:3px;background:' + L.col + ';color:#fff;font-size:.68em;font-weight:700;letter-spacing:.05em">' + L.c + '</span>'; }
  function temaT(t, lg) { return t.t[ORDEN.indexOf(lg)]; }

  /* ─────────── páginas ─────────── */
  var paginas = {
    dic_intro: function (pg, C) {
      var L = langs(C);
      return H.cabecera(C, pg) + H.h1(C, 'Cómo usar este diccionario') +
        '<p>' + H.esc(H.sub('Cada palabra aparece en ' + LENG[L.base].n.toLowerCase() + ' y en ' + L.otros.map(function (x) { return LENG[x].n.toLowerCase(); }).join(', ').replace(/, ([^,]*)$/, ' y $1') + ', con una frase de ejemplo en cada idioma. Los sustantivos llevan su artículo: así aprendes el género a la vez que la palabra.', C)) + '</p>' +
        H.h2(C, 'Los idiomas') + L.todos.map(function (lg) { return '<div style="display:flex;gap:3mm;align-items:center;margin:0 0 2mm">' + chipL(lg) + '<b>' + LENG[lg].n + '</b></div>'; }).join('') +
        (L.todos.indexOf('gsw') >= 0 ? H.h2(C, 'Sobre el suizo alemán') + '<p>No tiene una ortografía oficial y cambia de un cantón a otro. Aquí se escribe como se habla en Zúrich. En la escuela suiza se escribe en alemán estándar.</p>' : '') +
        H.h2(C, 'Tu forma de estudiar') + '<p>' + H.esc(H.sub('Lee la palabra en voz alta, tapa la traducción y di la palabra en el otro idioma. Después escribe tu propia frase. Cinco palabras al día bastan.', C)) + '</p>' + H.guia(C, H.sub('Equivocarse de artículo es normal. Hasta las personas que hablan el idioma dudan a veces.', C), true) + H.folio(C, pg);
    },
    dic_tema: function (pg, C) {
      var T = C.T, t = pg.tema, L = langs(C);
      return H.cabecera(C, pg) + '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 5) + 'px;color:' + T.acc + ';line-height:.9">' + pg.n + '</div>' +
        H.h1(C, H.esc(temaT(t, L.base))) +
        '<div style="display:flex;flex-direction:column;gap:1.5mm;margin:0 0 5mm">' + L.otros.map(function (lg) { return '<div style="display:flex;gap:3mm;align-items:center">' + chipL(lg) + '<span style="font-size:1.25em">' + H.esc(temaT(t, lg)) + '</span></div>'; }).join('') + '</div>' +
        H.marcoImagen(C, 'Ilustración: ' + temaT(t, 'es').toLowerCase(), 75, (C.cfg.imagenes || [])[(pg.n - 1) % Math.max(1, (C.cfg.imagenes || []).length)]) +
        '<div style="display:flex;flex-wrap:wrap;gap:2mm;margin-top:5mm">' + t.pal.map(function (p) { return '<span style="border:1px solid ' + T.acc + ';color:' + T.acc + ';border-radius:' + (T.r ? 99 : 0) + 'px;padding:.6mm 3mm;font-size:.9em">' + H.esc(palabra(p, L.base, C)) + '</span>'; }).join('') + '</div>' + H.folio(C, pg);
    },
    dic_palabras: function (pg, C) {
      var T = C.T, L = langs(C);
      var ent = pg.pal.map(function (p) {
        return '<div style="padding:3mm 0 3.5mm;border-bottom:1px solid ' + T.soft + ';break-inside:avoid">' +
          '<div style="display:flex;align-items:baseline;gap:3mm;margin-bottom:1.5mm"><b style="font-family:' + T.tit + ';font-size:1.45em;color:' + T.ink + '">' + H.esc(palabra(p, L.base, C)) + '</b><span style="font-size:.8em;font-style:italic;opacity:.8">' + H.esc(ejemplo(pg.tema, p, L.base, C)) + '</span></div>' +
          L.otros.map(function (lg) { return '<div style="display:grid;grid-template-columns:10mm minmax(0,.9fr) minmax(0,1.3fr);gap:3mm;align-items:center;margin:0 0 1mm">' + chipL(lg) + '<b style="font-size:1.05em">' + H.esc(p[lg]) + '</b><i style="font-size:.85em;opacity:.8">' + H.esc(ejemplo(pg.tema, p, lg, C)) + '</i></div>'; }).join('') + '</div>';
      }).join('');
      return H.cabecera(C, pg) + ent + H.folio(C, pg);
    },
    dic_practica: function (pg, C) {
      var T = C.T, t = pg.tema, L = langs(C), r = H.rng(H.hash(t.id + pg.k) + C.semilla), lg = L.otros[pg.k % Math.max(1, L.otros.length)] || L.base;
      var pal = H.mezcla(r, t.pal).slice(0, C.peque ? 6 : 8), v = Math.floor(pg.k / Math.max(1, L.otros.length)) % 5, cuerpo = '', tit = '';
      var raya = '<span style="display:inline-block;min-width:34mm;border-bottom:1.3px solid ' + T.ink + '">&#160;</span>';
      if (v === 0) {
        tit = 'Traduce al ' + LENG[lg].n.toLowerCase();
        cuerpo = pal.map(function (p, i) { return '<div style="display:flex;gap:4mm;align-items:center;margin:0 0 4.5mm"><b style="color:' + T.acc + ';width:6mm">' + (i + 1) + '.</b><span style="flex:1">' + H.esc(palabra(p, L.base, C)) + '</span>' + chipL(lg) + raya + '</div>'; }).join('');
      } else if (v === 1) {
        tit = 'Une cada palabra con su traducción';
        var der = H.mezcla(r, pal);
        cuerpo = '<div style="display:grid;grid-template-columns:1fr 30mm 1fr;row-gap:5mm;align-items:center">' + pal.map(function (p, i) { return '<div style="text-align:right">' + H.esc(palabra(p, L.base, C)) + ' ●</div><div></div><div>● ' + H.esc(der[i][lg]) + '</div>'; }).join('') + '</div>';
      } else if (v === 2) {
        tit = 'Completa la frase';
        cuerpo = pal.slice(0, 6).map(function (p, i) { var e = ejemplo(t, p, lg, C), w = p[lg]; return '<div style="margin:0 0 5mm"><b style="color:' + T.acc + '">' + (i + 1) + '.</b> ' + H.esc(e).replace(H.esc(w), raya) + ' <span style="opacity:.7;font-size:.85em">(' + H.esc(palabra(p, L.base, C)) + ')</span></div>'; }).join('');
      } else if (v === 3 && window.EU_SOPA) {
        tit = 'Sopa de letras en ' + LENG[lg].n.toLowerCase();
        var ws = pal.map(function (p) { return p[lg].replace(/^(der|die|das|le|la|les|l’|d|s|de|the)\s+/i, '').replace(/^l’/, ''); }).filter(function (w) { return /^[\p{L}]+$/u.test(w) && w.length <= 10; }).slice(0, 8);
        cuerpo = EU_SOPA.pagina(ws, C, H.hash(t.id + lg + pg.k) + C.semilla, false);
      } else {
        tit = 'Escribe y dibuja';
        cuerpo = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm">' + pal.slice(0, 4).map(function (p) { return '<div><div style="height:38mm;border:1px solid ' + T.ink + ';border-radius:' + T.r + 'px;opacity:.55"></div><div style="margin-top:2mm">' + H.esc(palabra(p, L.base, C)) + ' · ' + chipL(lg) + ' ' + raya + '</div></div>'; }).join('') + '</div>';
      }
      return H.cabecera(C, pg) + H.h1(C, H.esc(H.sub(tit, C)), 'font-size:' + (C.fs * 1.7) + 'px') + cuerpo + H.guia(C, H.sub(H.pick(r, ['Dilo en voz alta mientras lo escribes: el oído también aprende.', 'Si dudas, vuelve a la página del tema. Está para eso.', 'Fíjate en el artículo: le, la, der, die, das…']), C), true) + H.folio(C, pg);
    },
    dic_tarjetas: function (pg, C) {
      var T = C.T, t = pg.tema, L = langs(C), lg = L.otros[pg.k % Math.max(1, L.otros.length)] || L.base, pal = t.pal.slice(0, 8);
      return '<div style="font-size:.8em;color:' + T.acc + ';font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:3mm">Tarjetas para recortar · ' + H.esc(temaT(t, L.base)) + ' · ' + LENG[lg].n + '</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:60mm;border-top:1px dashed ' + T.ink + ';border-left:1px dashed ' + T.ink + '">' + pal.map(function (p) {
          return '<div style="border-right:1px dashed ' + T.ink + ';border-bottom:1px dashed ' + T.ink + ';display:flex;flex-direction:column"><div style="flex:1;display:flex;align-items:center;justify-content:center;font-family:' + T.tit + ';font-size:1.5em;font-weight:' + T.peso + '">' + H.esc(palabra(p, L.base, C)) + '</div><div style="flex:1;display:flex;align-items:center;justify-content:center;gap:2mm;border-top:1px dotted ' + T.soft + ';background:' + T.soft2 + ';font-size:1.3em">' + chipL(lg) + H.esc(p[lg]) + '</div></div>';
        }).join('') + '</div>' + H.folio(C, pg);
    },
    dic_indice: function (pg, C, modo, ctx) {
      var T = C.T, L = langs(C), en = {};
      ctx.pages.forEach(function (p) { if (p.tipo === 'dic_palabras') p.pal.forEach(function (w) { en[w.id] = p.num; }); });
      var todas = [];
      TEMAS.forEach(function (t) { t.pal.forEach(function (p) { if (en[p.id]) L.todos.forEach(function (lg) { todas.push([p[lg].replace(/^(el|la|los|las|le|la|l’|der|die|das|de|d|s)\s+/i, '').replace(/^l’/, ''), lg, en[p.id]]); }); }); });
      todas.sort(function (a, b) { return a[0].localeCompare(b[0], 'es', { sensitivity: 'base' }); });
      var por = C.peque ? 60 : 84, trozo = todas.slice(pg.parte * por, (pg.parte + 1) * por);
      return H.cabecera(C, pg) + H.h1(C, pg.parte ? 'Índice alfabético (sigue)' : 'Índice alfabético', 'font-size:' + (C.fs * 1.7) + 'px') +
        '<div style="columns:3;column-gap:6mm;font-size:.82em;line-height:1.55">' + trozo.map(function (x) { return '<div style="display:flex;gap:1.5mm;align-items:center;break-inside:avoid"><span style="color:' + LENG[x[1]].col + ';font-weight:700;font-size:.8em;width:6mm">' + LENG[x[1]].c + '</span><span style="flex:1">' + H.esc(x[0]) + '</span><span style="font-variant-numeric:tabular-nums">' + x[2] + '</span></div>'; }).join('') + '</div>' + H.folio(C, pg);
    }
  };

  function armar(C, pool, N, r) {
    var L = langs(C), por = L.todos.length >= 5 ? 3 : L.todos.length >= 4 ? 4 : 5;
    if (C.peque) por = Math.max(2, por - 1);
    var elegidos = C.op.temas && C.op.temas.length ? TEMAS.filter(function (t) { return C.op.temas.indexOf(t.id) >= 0; }) : TEMAS;
    var core = [];
    elegidos.forEach(function (t, i) {
      core.push({ tipo: 'dic_tema', tema: t, n: i + 1, indice: temaT(t, L.base), indiceN: 'Tema ' + (i + 1), cab: temaT(t, L.base) });
      for (var j = 0; j < t.pal.length; j += por) core.push({ tipo: 'dic_palabras', tema: t, pal: t.pal.slice(j, j + por), n: i + 1, cab: temaT(t, L.base) });
      core.push({ tipo: 'dic_practica', tema: t, k: 0, n: i + 1, relleno: true, cab: temaT(t, L.base) });
    });
    var totalPal = elegidos.reduce(function (s, t) { return s + t.pal.length; }, 0) * L.todos.length;
    var nIdx = N >= 30 ? Math.ceil(totalPal / (C.peque ? 60 : 84)) : 0, fin = [];
    for (var q = 0; q < nIdx; q++) fin.push({ tipo: 'dic_indice', parte: q, indice: q ? null : 'Índice alfabético' });
    var k = 1;
    var filasIdx = elegidos.length + 1 + (nIdx ? 1 : 0);
    return H.envolver(C, core, N, function (i) {
      var t = elegidos[i % elegidos.length], kk = k + Math.floor(i / elegidos.length), idx = -1;
      var pz = (kk % 4 === 3) ? { tipo: 'dic_tarjetas', tema: t, k: kk, relleno: true, cab: temaT(t, L.base) } : { tipo: 'dic_practica', tema: t, k: kk, relleno: true, cab: temaT(t, L.base) };
      for (var z = 0; z < core.length; z++) if (core[z].tema === t) idx = z;
      core.splice(idx + 1, 0, pz);
      return [];
    }, { intro: { tipo: 'dic_intro', indice: 'Cómo usar este diccionario' }, fin: fin, indiceFilas: filasIdx });
  }


  /* Unidades por tema: cualquier producto general (libro, fichas, examen, láminas…) las usa. */
  var UNIDADES = TEMAS.map(function (t) {
    return {
      m: 'idiomas', id: 'idi_' + t.id, b: ['inf', 'pri1', 'pri2', 'pri3', 'sec', 'bach', 'fp', 'adu'], t: 'Vocabulario: ' + t.t[0].toLowerCase(), tema: t,
      i: t.pal.slice(0, 4).map(function (p) { return '«' + p.es + '» se dice «' + p.en + '» en inglés, «' + p.fr + '» en francés, «' + p.de + '» en alemán y «' + p.gsw + '» en suizo alemán.'; }),
      k: t.pal.slice(0, 6).map(function (p) { return p.es; }), g: 'idi_trad',
      q: ['Escribe una frase en inglés con dos palabras de este tema.', 'Elige tres palabras y di en qué idioma te resultan más fáciles de recordar. ¿Por qué?'],
      f: { t: 'mapa', c: t.t[0], r: t.pal.slice(0, 5).map(function (p) { return p.es; }) }
    };
  });

  var generadores = {
    idi_trad: function (u, C, r) {
      var L = langs(C), p = H.pick(r, u.tema.pal), lg = H.pick(r, L.otros.length ? L.otros : ['en']);
      return r() < 0.5 ? H.it('corta', '¿Cómo se dice «' + palabra(p, L.base, C) + '» en ' + LENG[lg].n.toLowerCase() + '?', p[lg])
        : H.it('corta', '¿Qué significa «' + p[lg] + '» (' + LENG[lg].n.toLowerCase() + ')?', palabra(p, L.base, C));
    }
  };

  function quiz(u, C, r, n) {
    var L = langs(C), t = u.tema || TEMAS[0], out = [];
    for (var i = 0; i < n; i++) {
      var p = H.pick(r, t.pal), lg = H.pick(r, L.otros.length ? L.otros : ['en']);
      var otras = H.mezcla(r, t.pal.filter(function (x) { return x !== p; })).slice(0, 2);
      var ops = H.mezcla(r, [p].concat(otras)), c = ops.indexOf(p);
      out.push(H.it('mc', '¿Cómo se dice «' + palabra(p, L.base, C) + '» en ' + LENG[lg].n.toLowerCase() + '?', ops[c][lg], { o: ops.map(function (x) { return x[lg]; }), c: c, lang: LENG[lg].lang }));
    }
    return out;
  }

  ED.registrar({
    materias: [{
      id: 'idiomas', n: 'Idiomas (ES · EN · FR · DE · CH)', ico: '🌍', grupo: 'Idiomas', edad: true, plantilla: function (b) { return b === 'inf' || b === 'pri1' ? 'juego' : 'lexico'; }, prodDef: 'diccionario',
      opciones: [
        { k: 'base', n: 'Idioma de partida', tipo: 'chips', def: 'es', ops: ORDEN.map(function (l) { return [l, LENG[l].n]; }) },
        { k: 'idiomas', n: 'Idiomas del diccionario', tipo: 'multi', def: ORDEN.slice(), ops: ORDEN.map(function (l) { return [l, LENG[l].n]; }) },
        { k: 'temas', n: 'Temas (vacío = todos)', tipo: 'multi', def: [], ops: TEMAS.map(function (t) { return [t.id, t.t[0]]; }) }
      ]
    }],
    unidades: UNIDADES,
    productos: [{ id: 'diccionario', n: 'Diccionario ilustrado', ico: '🔤', d: 'Temas con palabra, artículo y ejemplo en cada idioma, prácticas, tarjetas y índice alfabético.', solo: ['idiomas'], armar: armar, titulo: function (C) { var L = langs(C); return 'Mi diccionario ' + L.todos.map(function (l) { return LENG[l].c; }).join(' · '); } }],
    plantillas: { lexico: { n: 'Léxico', d: 'Diccionario de consulta: entradas limpias, idiomas por color, índice en tres columnas.', tit: "'Bricolage Grotesque', sans-serif", cuerpo: "'Literata', Georgia, serif", bg: '#FCFBF8', ink: '#1B1B1F', acc: '#1F4E8C', acc2: '#B8322A', soft: '#E6ECF4', soft2: '#F6E9E7', r: 3, peso: 700 } },
    paginas: paginas,
    generadores: generadores,
    quiz: { idiomas: quiz },
    fuentes: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700&display=swap',
    voz: {
      dic_palabras: function (pg, C) { var L = langs(C), seg = []; pg.pal.forEach(function (p) { L.todos.forEach(function (lg) { seg.push({ t: palabra(p, lg, C), lang: LENG[lg].lang }); }); }); return seg; },
      dic_tema: function (pg, C) { var L = langs(C); return L.todos.map(function (lg) { return { t: temaT(pg.tema, lg), lang: LENG[lg].lang }; }); }
    },
    escenas: {
      dic_tema: function (pg, C) { var L = langs(C); return { k: 'titulo', n: pg.n, t: temaT(pg.tema, L.base), s: L.otros.map(function (lg) { return temaT(pg.tema, lg); }).join(' · ') }; },
      dic_palabras: function (pg, C) { var L = langs(C); return pg.pal.map(function (p) { return { k: 'palabra', t: palabra(p, L.base, C), l: L.otros.map(function (lg) { return { c: LENG[lg].c, col: LENG[lg].col, t: p[lg], e: ejemplo(pg.tema, p, lg, C) }; }) }; }); }
    }
  });

  window.EU_IDIOMAS = { LENG: LENG, TEMAS: TEMAS, ejemplo: ejemplo };
})();
