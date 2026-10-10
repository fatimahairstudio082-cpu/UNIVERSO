/* b6_cerebro_infantil.js — cerebro infantil del Editorial.
   Tres productos que cualquier materia puede usar y una colección propia:
   · «Libro para colorear»: 22 dibujos de línea, mandalas generados, colorea por
     números y une los puntos, con el nombre de cada dibujo en pauta para repasar.
   · «Cuaderno de caligrafía»: letra escolar ligada de cada país (familia
     Playwrite) o de imprenta, pautas Montessori, doble línea, cuadrícula o una
     línea; vocales, abecedario, sílabas, palabras, frases y números.
   · «Pasatiempos»: sopas de letras (con las palabras clave de la unidad en
     cualquier materia), laberintos, une los puntos y simetrías, con solucionario.
   Cada libro abre con una página «Cómo se hace» con un ejemplo resuelto y, si
   el motor de láminas está cargado, una lámina explicativa pintada por él.
   Expone EU_SOPA (la usa el diccionario de idiomas). */
(function () {
  'use strict';
  if (window.EU_INFANTIL || !window.EU_EDITORIAL) return;
  var ED = window.EU_EDITORIAL, H = ED.H, esc = H.esc;

  /* ─────────── voz del país ─────────── */
  var VOS = [['Colorea', 'Coloreá'], ['colorea', 'coloreá'], ['Encuentra', 'Encontrá'], ['Busca', 'Buscá'], ['busca', 'buscá'], ['Ayuda', 'Ayudá'], ['Completa', 'Completá'], ['Repasa', 'Repasá'], ['repasa', 'repasá'],
    ['Une', 'Uní'], ['Empieza', 'Empezá'], ['empieza', 'empezá'], ['pinta', 'pintá'], ['Pinta', 'Pintá'], ['Escribe', 'Escribí'], ['escribe', 'escribí'], ['Cuenta', 'Contá'], ['Sigue', 'Seguí'], ['sigue', 'seguí'],
    ['Copia', 'Copiá'], ['Dibuja', 'Dibujá'], ['Elige', 'Elegí'], ['Siéntate', 'Sentate'], ['Sujeta', 'Sujetá'], ['Marca', 'Marcá'], ['Tacha', 'Tachá'], ['Mira', 'Mirá'], ['tú solo', 'vos solo'], ['te sales', 'te salís'], ['Lee', 'Leé'], ['Haz', 'Hacé'], ['vuelve', 'volvé'], ['Vuelve', 'Volvé']];
  var R_VOS = VOS.map(function (p) { return [new RegExp('(^|[^A-Za-zÁÉÍÓÚáéíóúñ])' + p[0] + '(?![A-Za-zÁÉÍÓÚáéíóúñ])', 'g'), '$1' + p[1]]; });
  function cocheDe(C) { return { es: 'coche', ar: 'auto', cl: 'auto' }[C.pk] || 'carro'; }
  function V(C, s) {
    s = H.sub(String(s || ''), C).replace(/\bcoche\b/g, cocheDe(C));
    if (C.P.vos) R_VOS.forEach(function (r) { s = s.replace(r[0], r[1]); });
    return s;
  }
  function nivel(C) { var k = { inf: 0, pri1: 1, pri2: 2, pri3: 3 }[C.bnd]; return k == null ? 4 : k; }
  function porNivel(C, a) { return a[Math.min(a.length - 1, nivel(C))]; }
  function ancho(C) { return C.papel.w - 34; }

  /* ─────────── dibujos de línea (200 × 200) ───────────
     {a}…{d} son las zonas: en blanco para colorear, con color en el ejemplo. */
  function rayos(cx, cy, r0, r1, n) { var s = ''; for (var i = 0; i < n; i++) { var a = i * Math.PI * 2 / n; s += '<path d="M' + (cx + Math.cos(a) * r0).toFixed(1) + ' ' + (cy + Math.sin(a) * r0).toFixed(1) + ' L' + (cx + Math.cos(a) * r1).toFixed(1) + ' ' + (cy + Math.sin(a) * r1).toFixed(1) + '"/>'; } return s; }
  function estrellaPts(cx, cy, R, r, n) { var p = []; for (var i = 0; i < n * 2; i++) { var a = -Math.PI / 2 + i * Math.PI / n, q = i % 2 ? r : R; p.push([+(cx + Math.cos(a) * q).toFixed(1), +(cy + Math.sin(a) * q).toFixed(1)]); } return p; }
  function poli(p) { return 'M' + p.map(function (x) { return x[0] + ' ' + x[1]; }).join(' L') + ' Z'; }
  var PET = ''; for (var pi = 0; pi < 6; pi++) PET += '<ellipse cx="100" cy="50" rx="15" ry="24" fill="{a}" transform="rotate(' + pi * 60 + ' 100 75)"/>';
  var UVA = [[100, 150], [90, 128], [110, 128], [80, 104], [100, 104], [120, 104], [70, 80], [90, 80], [110, 80], [130, 80], [80, 56], [100, 56], [120, 56]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="13" fill="{a}"/>'; }).join('');
  var FIG = {
    sol: ['el', 'sol', 'naturaleza', rayos(100, 100, 54, 80, 12) + '<circle cx="100" cy="100" r="42" fill="{b}"/><circle cx="86" cy="92" r="4" fill="#222"/><circle cx="114" cy="92" r="4" fill="#222"/><path d="M82 112 Q100 128 118 112"/>'],
    flor: ['la', 'flor', 'naturaleza', '<path d="M100 95 L100 188"/><path d="M100 150 Q72 128 60 146 Q78 166 100 150 Z" fill="{c}"/><path d="M100 165 Q128 143 140 161 Q122 181 100 165 Z" fill="{c}"/>' + PET + '<circle cx="100" cy="75" r="15" fill="{b}"/>'],
    arbol: ['el', 'árbol', 'naturaleza', '<path d="M40 186 L160 186"/><path d="M88 185 L92 120 L108 120 L112 185 Z" fill="{b}"/><path d="M52 128 A30 30 0 0 1 58 78 A36 36 0 0 1 100 40 A36 36 0 0 1 142 78 A30 30 0 0 1 148 128 Z" fill="{c}"/><circle cx="80" cy="92" r="7" fill="{a}"/><circle cx="118" cy="80" r="7" fill="{a}"/><circle cx="108" cy="112" r="7" fill="{a}"/>'],
    nube: ['la', 'nube', 'naturaleza', '<path d="M50 140 A24 24 0 0 1 56 94 A32 32 0 0 1 114 80 A28 28 0 0 1 156 108 A18 18 0 0 1 150 140 Z" fill="{d}"/><path d="M70 158 l-5 13 M100 158 l-5 13 M130 158 l-5 13"/>'],
    luna: ['la', 'luna', 'naturaleza', '<path d="M125 35 A68 68 0 1 0 125 165 A65 65 0 1 1 125 35 Z" fill="{b}"/>' + '<path d="' + poli(estrellaPts(160, 60, 16, 7, 5)) + '" fill="{b}"/>'],
    estrella: ['la', 'estrella', 'naturaleza', '<path d="' + poli(estrellaPts(100, 108, 84, 36, 5)) + '" fill="{b}"/><circle cx="88" cy="104" r="4" fill="#222"/><circle cx="112" cy="104" r="4" fill="#222"/><path d="M90 120 Q100 128 110 120"/>'],
    manzana: ['la', 'manzana', 'casa', '<path d="M100 60 Q102 40 110 28"/><path d="M104 44 Q125 30 136 42 Q120 56 104 44 Z" fill="{c}"/><path d="M100 60 C60 40 38 80 50 120 C60 160 90 176 100 166 C110 176 140 160 150 120 C162 80 140 40 100 60 Z" fill="{a}"/>'],
    uva: ['la', 'uva', 'casa', '<path d="M100 42 Q104 24 116 18"/><path d="M104 36 Q128 22 140 36 Q122 50 104 36 Z" fill="{c}"/>' + UVA],
    casa: ['la', 'casa', 'casa', '<path d="M30 183 H170"/><rect x="124" y="50" width="16" height="34" fill="{d}"/><rect x="50" y="95" width="100" height="88" fill="{b}"/><path d="M38 98 L100 44 L162 98 Z" fill="{a}"/><path d="M88 183 L88 145 Q100 133 112 145 L112 183" fill="{c}"/><rect x="60" y="110" width="22" height="22" fill="{d}"/><path d="M71 110 V132 M60 121 H82"/><rect x="118" y="110" width="22" height="22" fill="{d}"/><path d="M129 110 V132 M118 121 H140"/>'],
    globo: ['el', 'globo', 'casa', '<path d="M100 138 Q88 160 104 188"/><ellipse cx="100" cy="82" rx="42" ry="52" fill="{a}"/><path d="M94 133 L106 133 L100 141 Z" fill="{a}"/><path d="M76 62 Q82 48 94 43"/>'],
    helado: ['el', 'helado', 'casa', '<circle cx="100" cy="30" r="8" fill="{a}"/><path d="M100 22 Q104 12 112 10"/><circle cx="100" cy="58" r="26" fill="{b}"/><circle cx="80" cy="84" r="24" fill="{d}"/><circle cx="120" cy="84" r="24" fill="{c}"/><path d="M66 100 L134 100 L100 188 Z" fill="{b}"/><path d="M76 116 L124 116 M83 134 L117 134 M90 152 L110 152"/>'],
    iglu: ['el', 'iglú', 'casa', '<path d="M16 160 H184"/><path d="M30 160 A70 70 0 0 1 170 160 Z" fill="{d}"/><path d="M36 136 H164 M50 112 H150 M72 96 H128 M70 136 L70 112 M130 136 L130 112 M100 112 L100 96 M56 160 L56 136 M144 160 L144 136"/><path d="M82 160 L82 140 A18 18 0 0 1 118 140 L118 160" fill="{b}"/>'],
    pez: ['el', 'pez', 'animales', '<path d="M140 100 L182 68 L178 132 Z" fill="{b}"/><path d="M78 68 Q96 42 118 70" fill="{b}"/><ellipse cx="92" cy="100" rx="58" ry="36" fill="{a}"/><circle cx="60" cy="92" r="7" fill="#fff"/><circle cx="60" cy="92" r="3" fill="#222"/><path d="M76 80 Q86 100 76 120 M100 90 q8 10 0 20 M116 88 q8 12 0 24"/><circle cx="28" cy="70" r="5"/><circle cx="20" cy="52" r="3.5"/>'],
    gato: ['el', 'gato', 'animales', '<path d="M60 88 L64 38 L96 68 Z" fill="{a}"/><path d="M140 88 L136 38 L104 68 Z" fill="{a}"/><circle cx="100" cy="112" r="52" fill="{a}"/><ellipse cx="80" cy="102" rx="7" ry="10" fill="{c}"/><ellipse cx="120" cy="102" rx="7" ry="10" fill="{c}"/><path d="M94 122 L106 122 L100 130 Z" fill="{b}"/><path d="M100 130 Q92 142 84 136 M100 130 Q108 142 116 136 M70 124 L36 118 M70 132 L38 138 M130 124 L164 118 M130 132 L162 138"/>'],
    mariposa: ['la', 'mariposa', 'animales', '<path d="M96 62 Q84 34 72 30 M104 62 Q116 34 128 30"/><path d="M100 96 C70 40 20 44 30 88 C36 110 70 108 100 100 Z" fill="{a}"/><path d="M100 96 C130 40 180 44 170 88 C164 110 130 108 100 100 Z" fill="{a}"/><path d="M100 104 C72 110 44 130 58 156 C72 176 96 146 100 110 Z" fill="{b}"/><path d="M100 104 C128 110 156 130 142 156 C128 176 104 146 100 110 Z" fill="{b}"/><circle cx="58" cy="78" r="9" fill="{c}"/><circle cx="142" cy="78" r="9" fill="{c}"/><ellipse cx="100" cy="106" rx="7" ry="44" fill="{d}"/>'],
    tortuga: ['la', 'tortuga', 'animales', '<ellipse cx="62" cy="136" rx="13" ry="11" fill="{c}"/><ellipse cx="138" cy="136" rx="13" ry="11" fill="{c}"/><path d="M40 124 L24 130 L40 132"/><circle cx="164" cy="112" r="17" fill="{c}"/><circle cx="170" cy="108" r="3" fill="#222"/><path d="M38 128 A62 58 0 0 1 162 128 Z" fill="{b}"/><path d="M70 128 L78 100 L100 90 L122 100 L130 128 M78 100 L58 92 M122 100 L142 92 M100 90 L100 72"/>'],
    pajaro: ['el', 'pájaro', 'animales', '<path d="M88 142 L84 172 M104 142 L108 172 M76 172 H92 M100 172 H116"/><path d="M54 104 L20 86 L28 120 Z" fill="{b}"/><ellipse cx="92" cy="112" rx="44" ry="34" fill="{a}"/><circle cx="136" cy="80" r="24" fill="{a}"/><path d="M156 74 L182 82 L156 90 Z" fill="{c}"/><circle cx="142" cy="74" r="4" fill="#222"/><path d="M70 104 Q92 88 116 108 Q96 132 70 104 Z" fill="{b}"/>'],
    caracol: ['el', 'caracol', 'animales', '<path d="M26 156 Q26 140 48 140 L166 140 Q182 140 182 156 Z" fill="{c}"/><path d="M40 140 L30 104 M54 140 L60 102"/><circle cx="30" cy="100" r="5" fill="#222"/><circle cx="60" cy="98" r="5" fill="#222"/><circle cx="118" cy="98" r="46" fill="{a}"/><path d="M118 98 m0 -8 a8 8 0 1 1 -8 8 a16 16 0 1 1 16 16 a24 24 0 1 1 -24 -24 a32 32 0 1 1 32 32"/>'],
    oso: ['el', 'oso', 'animales', '<circle cx="60" cy="62" r="20" fill="{b}"/><circle cx="140" cy="62" r="20" fill="{b}"/><circle cx="60" cy="62" r="9" fill="{c}"/><circle cx="140" cy="62" r="9" fill="{c}"/><circle cx="100" cy="110" r="56" fill="{b}"/><ellipse cx="100" cy="130" rx="24" ry="18" fill="{c}"/><ellipse cx="100" cy="121" rx="8" ry="6" fill="#222"/><path d="M100 127 L100 135 Q92 143 86 137 M100 135 Q108 143 114 137"/><circle cx="80" cy="98" r="5" fill="#222"/><circle cx="120" cy="98" r="5" fill="#222"/>'],
    coche: ['el', 'coche', 'transporte', '<path d="M16 168 H186"/><path d="M26 146 L26 118 L58 112 L80 80 L136 80 L158 112 L176 118 L176 146 Z" fill="{a}"/><path d="M86 88 L104 88 L104 110 L68 110 Z" fill="{d}"/><path d="M112 88 L132 88 L148 110 L112 110 Z" fill="{d}"/><circle cx="64" cy="148" r="18" fill="{b}"/><circle cx="64" cy="148" r="7" fill="#fff"/><circle cx="142" cy="148" r="18" fill="{b}"/><circle cx="142" cy="148" r="7" fill="#fff"/><rect x="164" y="122" width="12" height="8" fill="{b}"/>'],
    barco: ['el', 'barco', 'transporte', '<path d="M100 132 L100 36"/><path d="M104 42 L104 124 L154 124 Z" fill="{c}"/><path d="M96 54 L96 124 L58 124 Z" fill="{d}"/><path d="M100 36 L118 42 L100 48 Z" fill="{a}"/><path d="M32 130 L168 130 L148 162 L52 162 Z" fill="{a}"/><circle cx="80" cy="146" r="6"/><circle cx="100" cy="146" r="6"/><circle cx="120" cy="146" r="6"/><path d="M16 178 q12 -10 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0"/>'],
    cohete: ['el', 'cohete', 'transporte', '<path d="M86 150 Q100 196 114 150 Z" fill="{b}"/><path d="M76 118 L52 162 L80 150 Z" fill="{a}"/><path d="M124 118 L148 162 L120 150 Z" fill="{a}"/><path d="M100 22 C128 48 132 96 124 152 L76 152 C68 96 72 48 100 22 Z" fill="{d}"/><path d="M82 58 Q100 50 118 58"/><circle cx="100" cy="92" r="15" fill="{c}"/><path d="M36 50 l0 12 M30 56 l12 0 M160 80 l0 10 M155 85 l10 0"/>']
  };
  var COLF = { a: '#F28B82', b: '#FBC76B', c: '#8ED1A5', d: '#8AB8F0' };
  var TEMAS = { animales: 'Los animales', naturaleza: 'La naturaleza', casa: 'La casa y la merienda', transporte: 'Los transportes' };
  function palabraFig(C, id) { return id === 'coche' ? cocheDe(C) : FIG[id][1]; }
  function nombreFig(C, id) { return FIG[id][0] + ' ' + palabraFig(C, id); }
  function figSVG(id, color, extra) {
    var f = FIG[id]; if (!f) return '';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width:100%;height:auto;display:block;' + (extra || '') + '"><g fill="none" stroke="#222" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">' +
      f[3].replace(/\{([a-d])\}/g, function (m, k) { return color ? COLF[k] : '#fff'; }) + '</g></svg>';
  }
  function figDePalabra(C, w) {
    var n = String(w || '').toLowerCase().replace(/^(el|la|los|las)\s+/, '');
    for (var k in FIG) if (palabraFig(C, k) === n) return k;
    return null;
  }

  /* ─────────── mandalas ─────────── */
  var PALN = ['#E74C3C', '#F7C948', '#3B82F6', '#22A06B', '#F08A24', '#8E5CC8'], PALNn = ['rojo', 'amarillo', 'azul', 'verde', 'naranja', 'morado'];
  function mandalaSVG(seed, L, modo, K) {
    var r = H.rng(seed), R = 94, out = '', nums = '', rad = [], f = function (n) { return n.toFixed(2); };
    K = K || 5;
    for (var i = 0; i < L; i++) rad.push(R * (i + 1) / L);
    for (i = L - 1; i >= 0; i--) {
      var r1 = rad[i], r0 = i ? rad[i - 1] : 0, m = (r0 + r1) / 2, n = i ? H.pick(r, [8, 10, 12, 16]) : H.pick(r, [5, 6, 8]);
      var tipo = H.pick(r, ['petalo', 'gota', 'hoja', 'circulo', 'punta']), esp = Math.PI * 2 * m / n, w = Math.min(esp * 0.9, (r1 - r0) * 0.9);
      out += '<circle cx="100" cy="100" r="' + f(r1) + '" fill="#fff"/>';
      for (var j = 0; j < n; j++) {
        var ang = j * 360 / n + (i % 2 ? 180 / n : 0), d, cen = m, num = ((i + (j % 2)) % K) + 1;
        if (tipo === 'petalo') d = 'M0 ' + f(-r0) + ' Q' + f(w) + ' ' + f(-m) + ' 0 ' + f(-r1) + ' Q' + f(-w) + ' ' + f(-m) + ' 0 ' + f(-r0) + ' Z';
        else if (tipo === 'gota') d = 'M0 ' + f(-r1) + ' C' + f(w * 0.6) + ' ' + f(-m) + ' ' + f(w * 0.5) + ' ' + f(-r0) + ' 0 ' + f(-r0) + ' C' + f(-w * 0.5) + ' ' + f(-r0) + ' ' + f(-w * 0.6) + ' ' + f(-m) + ' 0 ' + f(-r1) + ' Z';
        else if (tipo === 'hoja') { var q = r0 + (r1 - r0) * 0.35; d = 'M0 ' + f(-r0) + ' C' + f(w * 0.75) + ' ' + f(-q) + ' ' + f(w * 0.2) + ' ' + f(-r1) + ' 0 ' + f(-r1) + ' C' + f(-w * 0.2) + ' ' + f(-r1) + ' ' + f(-w * 0.75) + ' ' + f(-q) + ' 0 ' + f(-r0) + ' Z'; cen = r0 + (r1 - r0) * 0.45; }
        else if (tipo === 'circulo') { var rc = Math.min(esp * 0.42, (r1 - r0) * 0.42); d = 'M0 ' + f(-m - rc) + ' a' + f(rc) + ' ' + f(rc) + ' 0 1 0 0.01 0 Z'; }
        else { var wb = r0 ? Math.PI * r0 / n * 0.95 : 0; d = 'M' + f(-wb) + ' ' + f(-r0) + ' L0 ' + f(-r1) + ' L' + f(wb) + ' ' + f(-r0) + ' Z'; cen = r0 + (r1 - r0) * 0.3; if (!r0) { d = 'M' + f(-esp * 0.3) + ' ' + f(-r1 * 0.2) + ' L0 ' + f(-r1) + ' L' + f(esp * 0.3) + ' ' + f(-r1 * 0.2) + ' Z'; cen = r1 * 0.45; } }
        out += '<path d="' + d + '" transform="translate(100 100) rotate(' + f(ang) + ')" fill="' + (modo === 'color' ? PALN[num - 1] : '#fff') + '"/>';
        if (modo === 'numeros') {
          var a = ang * Math.PI / 180, fs = Math.max(3.4, Math.min(7.5, Math.min(esp, r1 - r0) * 0.42));
          nums += '<text x="' + f(100 + Math.sin(a) * cen) + '" y="' + f(100 - Math.cos(a) * cen) + '" text-anchor="middle" dominant-baseline="central" font-size="' + f(fs) + '" font-family="Andika, sans-serif" font-weight="700" fill="#444" stroke="none">' + num + '</text>';
        }
      }
    }
    out += '<circle cx="100" cy="100" r="' + f(rad[0] * 0.28) + '" fill="' + (modo === 'color' ? PALN[0] : '#fff') + '"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width:100%;height:auto;display:block"><g fill="none" stroke="#222" stroke-width="1.1" stroke-linejoin="round">' + out + '</g>' + nums + '</svg>';
  }

  /* ─────────── une los puntos ─────────── */
  var PUNTOS = {
    diamante: ['el diamante', [[60, 60], [140, 60], [175, 95], [100, 180], [25, 95]]],
    casa: ['la casa', [[40, 100], [100, 40], [160, 100], [145, 100], [145, 180], [55, 180], [55, 100]]],
    estrella: ['la estrella', estrellaPts(100, 108, 84, 36, 5)],
    pez: ['el pez', [[30, 100], [50, 75], [80, 62], [110, 65], [135, 80], [150, 95], [180, 70], [172, 100], [180, 130], [150, 105], [135, 120], [110, 135], [80, 138], [50, 125]]],
    cohete: ['el cohete', [[100, 20], [120, 45], [128, 90], [126, 130], [150, 165], [122, 150], [78, 150], [50, 165], [74, 130], [72, 90], [80, 45]]],
    pino: ['el pino', [[100, 20], [130, 60], [115, 60], [145, 100], [125, 100], [160, 145], [110, 145], [110, 180], [90, 180], [90, 145], [40, 145], [75, 100], [55, 100], [85, 60], [70, 60]]],
    corazon: ['el corazón', (function () { var p = []; for (var i = 0; i < 16; i++) { var t = i * Math.PI * 2 / 16; p.push([+(100 + 5.2 * 16 * Math.pow(Math.sin(t), 3)).toFixed(1), +(90 - 5.2 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))).toFixed(1)]); } return p; })()]
  };
  function densificar(p, n) {
    p = p.slice();
    while (p.length < n) {
      var mi = 0, ml = 0;
      for (var i = 0; i < p.length; i++) { var a = p[i], b = p[(i + 1) % p.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (l > ml) { ml = l; mi = i; } }
      var A = p[mi], B = p[(mi + 1) % p.length];
      p.splice(mi + 1, 0, [+((A[0] + B[0]) / 2).toFixed(1), +((A[1] + B[1]) / 2).toFixed(1)]);
    }
    return p;
  }
  function puntosSVG(pts, C, sol) {
    var cx = 0, cy = 0; pts.forEach(function (p) { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length;
    var fs = pts.length > 20 ? 6.5 : 8.5, s = '';
    if (sol) s += '<path d="' + poli(pts) + '" fill="' + C.T.soft + '" stroke="' + C.T.acc + '" stroke-width="2.4" stroke-linejoin="round"/>';
    pts.forEach(function (p, i) {
      var dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1;
      s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i ? 2.2 : 3) + '" fill="' + (i ? '#222' : C.T.acc) + '"/>' +
        '<text x="' + (p[0] + dx / l * 9).toFixed(1) + '" y="' + (p[1] + dy / l * 9).toFixed(1) + '" text-anchor="middle" dominant-baseline="central" font-size="' + fs + '" font-family="Andika, sans-serif" font-weight="' + (i ? 400 : 700) + '" fill="' + (i ? '#333' : C.T.acc) + '">' + (i + 1) + '</text>';
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-8 -8 216 216" style="width:100%;height:auto;display:block">' + s + '</svg>';
  }

  /* ─────────── simetría en cuadrícula ─────────── */
  var PIX = {
    corazon: ['el corazón', ['..........', '.##....##.', '####..####', '##########', '##########', '.########.', '..######..', '...####...', '....##....', '..........']],
    casa: ['la casa', ['....##....', '...####...', '..######..', '.########.', '##########', '.#......#.', '.#.#..#.#.', '.#......#.', '.#..##..#.', '.########.']],
    arbol: ['el árbol', ['....##....', '...####...', '..######..', '.########.', '..######..', '.########.', '##########', '....##....', '....##....', '...####...']],
    mariposa: ['la mariposa', ['##......##', '###....###', '####..####', '####..####', '.###..###.', '..#.##.#..', '.###..###.', '####..####', '.##....##.', '..........']],
    cohete: ['el cohete', ['....##....', '...####...', '...####...', '...#..#...', '...####...', '...####...', '..######..', '.##.##.##.', '##..##..##', '....##....']],
    gato: ['el gato', ['#........#', '##......##', '##########', '##########', '#.##..##.#', '##########', '####..####', '##########', '.########.', '..######..']]
  };
  function simSVG(id, C, sol) {
    var P = PIX[id][1], c = 16, s = '';
    P.forEach(function (row, y) { row.split('').forEach(function (ch, x) { if (ch === '#' && (x < 5 || sol)) s += '<rect x="' + x * c + '" y="' + y * c + '" width="' + c + '" height="' + c + '" fill="' + C.T.acc + '"/>'; }); });
    for (var i = 0; i <= 10; i++) s += '<path d="M' + i * c + ' 0 V160 M0 ' + i * c + ' H160" stroke="#9a9a9a" stroke-width="0.6"/>';
    s += '<path d="M80 -6 V166" stroke="#C0392B" stroke-width="1.6" stroke-dasharray="4 3"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -8 168 176" style="width:100%;height:auto;display:block">' + s + '</svg>';
  }

  /* ─────────── laberintos ─────────── */
  function laberinto(c, f, r) {
    var W = [], vis = [], pila = [0], i;
    for (i = 0; i < c * f; i++) { W.push([1, 1, 1, 1]); vis.push(0); }
    vis[0] = 1;
    while (pila.length) {
      var a = pila[pila.length - 1], x = a % c, y = Math.floor(a / c), v = [];
      if (y > 0 && !vis[a - c]) v.push([a - c, 0, 2]);
      if (x < c - 1 && !vis[a + 1]) v.push([a + 1, 1, 3]);
      if (y < f - 1 && !vis[a + c]) v.push([a + c, 2, 0]);
      if (x > 0 && !vis[a - 1]) v.push([a - 1, 3, 1]);
      if (!v.length) { pila.pop(); continue; }
      var e = H.pick(r, v); W[a][e[1]] = 0; W[e[0]][e[2]] = 0; vis[e[0]] = 1; pila.push(e[0]);
    }
    W[0][0] = 0; W[c * f - 1][2] = 0;
    var prev = {}, cola = [0], fin = c * f - 1; prev[0] = -1;
    while (cola.length) {
      var q = cola.shift(); if (q === fin) break;
      var qx = q % c, qy = Math.floor(q / c);
      [[0, q - c, qy > 0], [1, q + 1, qx < c - 1], [2, q + c, qy < f - 1], [3, q - 1, qx > 0]].forEach(function (d) { if (d[2] && !W[q][d[0]] && prev[d[1]] == null) { prev[d[1]] = q; cola.push(d[1]); } });
    }
    var cam = [], k = fin; while (k >= 0) { cam.unshift(k); k = prev[k]; }
    return { c: c, f: f, W: W, cam: cam };
  }
  function laberintoSVG(M, C, sol, a, b) {
    var s = 10, c = M.c, f = M.f, sw = Math.max(0.7, Math.min(1.5, 1.7 - c * 0.045)), d = '';
    for (var i = 0; i < c * f; i++) {
      var x = (i % c) * s, y = Math.floor(i / c) * s, w = M.W[i];
      if (w[0]) d += 'M' + x + ' ' + y + ' h' + s;
      if (w[3]) d += 'M' + x + ' ' + y + ' v' + s;
      if (i % c === c - 1 && w[1]) d += 'M' + (x + s) + ' ' + y + ' v' + s;
      if (Math.floor(i / c) === f - 1 && w[2]) d += 'M' + x + ' ' + (y + s) + ' h' + s;
    }
    var ic = Math.max(14, Math.min(24, c * 2.2)), out = '';
    if (sol) out += '<polyline points="' + [[s / 2, -ic * 0.2]].concat(M.cam.map(function (k) { return [(k % c) * s + s / 2, Math.floor(k / c) * s + s / 2]; })).concat([[(c - 0.5) * s, f * s + ic * 0.2]]).map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '" fill="none" stroke="' + C.T.acc + '" stroke-width="' + s * 0.28 + '" stroke-linecap="round" stroke-linejoin="round"/>';
    out += '<path d="' + d + '" fill="none" stroke="' + C.T.ink + '" stroke-width="' + sw + '" stroke-linecap="square"/>';
    var fig = function (id, x, y) { var F = FIG[id]; return F ? '<g transform="translate(' + x + ' ' + y + ') scale(' + ic / 200 + ')" fill="none" stroke="#222" stroke-width="' + (3.6 * 200 / ic * 0.05 + 3) + '" stroke-linecap="round" stroke-linejoin="round">' + F[3].replace(/\{[a-d]\}/g, '#fff') + '</g>' : ''; };
    out += fig(a, s / 2 - ic / 2, -ic - 2) + fig(b, (c - 0.5) * s - ic / 2, f * s + 2);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + (-ic / 2) + ' ' + (-ic - 4) + ' ' + (c * s + ic) + ' ' + (f * s + ic * 2 + 8) + '" style="width:100%;height:auto;display:block">' + out + '</svg>';
  }

  /* ─────────── sopas de letras ─────────── */
  function limpiaSopa(w) { return String(w || '').toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0001/g, 'Ñ').replace(/ß/g, 'SS').replace(/[^A-ZÑ]/g, ''); }
  var DIRS = [[[1, 0]], [[1, 0], [0, 1]], [[1, 0], [0, 1], [1, 1]], [[1, 0], [0, 1], [1, 1], [-1, 0], [0, -1]], [[1, 0], [0, 1], [1, 1], [-1, 0], [0, -1], [1, -1], [-1, -1], [-1, 1]]];
  var RELLENO = 'AAAAEEEEIIIOOOUUBCCDDFGHJLLMMNNÑPPRRRSSSTTVZ';
  function sopa(palabras, n, dirs, r) {
    var g = [], i, lista = [];
    for (i = 0; i < n * n; i++) g.push('');
    var vistos = {};
    palabras.forEach(function (p) { var w = limpiaSopa(p); if (w.length >= 2 && w.length <= n && !vistos[w]) { vistos[w] = 1; lista.push({ w: w, o: p }); } });
    lista.sort(function (a, b) { return b.w.length - a.w.length; });
    var puestas = [];
    lista.forEach(function (it) {
      for (var t = 0; t < 250; t++) {
        var d = H.pick(r, dirs), L = it.w.length, x0 = H.ent(r, 0, n - 1), y0 = H.ent(r, 0, n - 1), x1 = x0 + d[0] * (L - 1), y1 = y0 + d[1] * (L - 1);
        if (x1 < 0 || x1 >= n || y1 < 0 || y1 >= n) continue;
        var ok = true, cs = [];
        for (var k = 0; k < L; k++) { var x = x0 + d[0] * k, y = y0 + d[1] * k, c = g[y * n + x]; if (c && c !== it.w[k]) { ok = false; break; } cs.push(y * n + x); }
        if (!ok) continue;
        cs.forEach(function (q, k) { g[q] = it.w[k]; });
        puestas.push({ w: it.w, o: it.o, cs: cs }); return;
      }
    });
    for (i = 0; i < n * n; i++) if (!g[i]) g[i] = RELLENO.charAt(Math.floor(r() * RELLENO.length));
    return { n: n, g: g, p: puestas };
  }
  var TINTES = ['#FDE68A', '#BFDBFE', '#BBF7D0', '#FBCFE8', '#DDD6FE', '#FED7AA', '#A5F3FC', '#FECACA', '#D9F99D', '#E9D5FF'];
  function sopaTabla(S, C, sol, mm) {
    var T = C.T, marca = {};
    if (sol) S.p.forEach(function (p, i) { p.cs.forEach(function (q) { marca[q] = TINTES[i % TINTES.length]; }); });
    var h = '<table style="border-collapse:collapse;margin:0 auto;font-family:' + T.tit + ';font-weight:700">';
    for (var y = 0; y < S.n; y++) {
      h += '<tr>';
      for (var x = 0; x < S.n; x++) { var q = y * S.n + x; h += '<td style="width:' + mm + 'mm;height:' + mm + 'mm;padding:0;text-align:center;vertical-align:middle;font-size:' + (mm * 0.58) + 'mm;line-height:1;border:0.2mm solid ' + T.soft + ';color:' + T.ink + (marca[q] ? ';background:' + marca[q] : '') + '">' + S.g[q] + '</td>'; }
      h += '</tr>';
    }
    return h + '</table>';
  }
  function sopaLista(S, C) {
    var T = C.T;
    return '<div style="display:flex;flex-wrap:wrap;gap:3mm 6mm;margin-top:6mm">' + S.p.map(function (p) {
      var f = C.peque && figDePalabra(C, p.o);
      return '<div style="display:flex;align-items:center;gap:2mm"><span style="flex:none;width:4.5mm;height:4.5mm;border:0.4mm solid ' + T.ink + ';border-radius:' + Math.min(T.r, 3) + 'px"></span>' +
        (f ? '<span style="width:11mm;flex:none">' + figSVG(f) + '</span>' : '') + '<span style="font-size:1.05em;letter-spacing:.04em">' + esc(p.w) + '</span></div>';
    }).join('') + '</div>';
  }
  function medidasSopa(C) { var k = nivel(C); return { n: [6, 8, 10, 12, 14][k], cuantas: [3, 5, 6, 8, 10][k], dirs: DIRS[k] }; }
  window.EU_SOPA = {
    crear: sopa, tabla: sopaTabla, lista: sopaLista,
    pagina: function (ws, C, seed, sol) {
      var M = medidasSopa(C), S = sopa(ws.slice(0, M.cuantas), M.n, M.dirs, H.rng(seed)), mm = Math.min(12, (ancho(C) - 20) / M.n);
      return sopaTabla(S, C, sol, mm) + sopaLista(S, C);
    }
  };

  /* ─────────── caligrafía ─────────── */
  var PLAY = { es: 'Playwrite ES', mx: 'Playwrite MX', co: 'Playwrite CO', ar: 'Playwrite AR', cl: 'Playwrite CL', ve: 'Playwrite CO', do: 'Playwrite MX', us: 'Playwrite US Trad' };
  var FUENTE_URL = {}; Object.keys(PLAY).forEach(function (k) { var f = PLAY[k]; FUENTE_URL[f] = 'https://fonts.googleapis.com/css2?family=' + f.replace(/ /g, '+') + ':wght@100..400&display=swap'; });
  Object.keys(FUENTE_URL).forEach(function (f) {
    var u = FUENTE_URL[f];
    if (!document.querySelector('link[href="' + u + '"]')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; document.head.appendChild(l); }
    if (ED.EXTRA_FUENTES.indexOf(u) < 0) ED.EXTRA_FUENTES.push(u);
  });
  function letraCal(C) {
    var t = C.op.letra || 'pais';
    if (t === 'imprenta') return { f: "'Andika', sans-serif", xh: 0.5, peso: 400, n: 'imprenta escolar (Andika)', ligada: false };
    return { f: "'" + PLAY[C.pk] + "', 'Andika', cursive", xh: 0.4, peso: 300, n: 'ligada escolar de ' + (C.pk === 'us' ? 'EE. UU.' : C.P.n) + ' (' + PLAY[C.pk] + ')', ligada: true };
  }
  function renglon(C, txt, modo, alto, pauta) {
    var W = ancho(C), F = letraCal(C), T = C.T, s = '', b, xh;
    pauta = pauta || C.op.pauta || 'montessori';
    if (pauta === 'doble') { xh = alto * 0.35; b = alto * 0.72; s += '<path d="M0 ' + (b - xh) + ' H' + W + '" stroke="' + T.acc2 + '" stroke-width="0.25" stroke-dasharray="1.2 1"/><path d="M0 ' + b + ' H' + W + '" stroke="' + T.ink + '" stroke-width="0.35"/>'; }
    else if (pauta === 'linea') { xh = alto * 0.35; b = alto * 0.76; s += '<path d="M0 ' + b + ' H' + W + '" stroke="' + T.ink + '" stroke-width="0.35"/>'; }
    else {
      xh = alto / 3; b = alto * 2 / 3;
      if (pauta === 'cuadricula') { for (var gx = 0; gx <= W; gx += xh) s += '<path d="M' + gx.toFixed(2) + ' 0 V' + alto + '" stroke="' + T.soft + '" stroke-width="0.2"/>'; }
      else s += '<rect x="0" y="' + xh + '" width="' + W + '" height="' + xh + '" fill="' + T.soft2 + '"/>';
      [0, xh, b, alto].forEach(function (y, i) { s += '<path d="M0 ' + y + ' H' + W + '" stroke="' + (i === 2 ? T.ink : T.acc2) + '" stroke-width="' + (i === 2 ? 0.35 : 0.2) + '"/>'; });
    }
    var fs = xh / F.xh, uw = (Array.from(txt).length * (F.ligada ? 0.62 : 0.56) + 1.4) * fs, n = Math.max(1, Math.floor((W - 2) / uw));
    if (modo === 'medio') n = 1; if (modo === 'libre') n = 0; if (modo === 'ejemplo') n = 1;
    for (var i = 0; i < n; i++) {
      var tinta = (modo === 'modelo' || modo === 'ejemplo') && i === 0;
      s += '<text x="' + (2 + i * uw).toFixed(2) + '" y="' + b.toFixed(2) + '" font-family="' + esc(F.f) + '" font-weight="' + F.peso + '" font-size="' + fs.toFixed(2) + '" fill="' + (tinta ? T.ink : '#C2C2C2') + '"' + (tinta ? '' : ' stroke="#9A9A9A" stroke-width="0.12" stroke-dasharray="0.5 0.45"') + '>' + esc(txt) + '</text>';
      if (!tinta) s += '<circle cx="' + (2 + i * uw).toFixed(2) + '" cy="' + (b - xh * 0.5).toFixed(2) + '" r="0.7" fill="' + T.acc + '"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + alto + '" style="width:100%;height:auto;display:block;overflow:hidden">' + s + '</svg>';
  }
  function altoRenglon(C) { return porNivel(C, [22, 15, 11.5, 9.5, 8.5]); }
  function renglones(C, filas, reserva) {
    var al = altoRenglon(C), cab = C.papel.h - 36 - 14 - (reserva || 30), max = Math.max(2, Math.floor(cab / (al + 3.5)));
    return filas.slice(0, max).map(function (f) { return '<div style="margin:0 0 3.5mm">' + renglon(C, f[0], f[1], al) + '</div>'; }).join('');
  }
  var ABC = [['a', 'árbol'], ['b', 'barco'], ['c', 'casa'], ['d', 'dedo'], ['e', 'estrella'], ['f', 'flor'], ['g', 'gato'], ['h', 'helado'], ['i', 'iglú'], ['j', 'jirafa'], ['k', 'kiwi'], ['l', 'luna'], ['m', 'manzana'], ['n', 'nube'], ['ñ', 'ñandú'],
    ['o', 'oso'], ['p', 'pez'], ['q', 'queso'], ['r', 'ratón'], ['s', 'sol'], ['t', 'tortuga'], ['u', 'uva'], ['v', 'vaca'], ['w', 'wafle'], ['x', 'xilófono'], ['y', 'yoyó'], ['z', 'zapato']];
  var SILABAS = ['m', 'p', 's', 'l', 't', 'n', 'd', 'f', 'b', 'c', 'r', 'v', 'g', 'j', 'ch', 'll', 'ñ', 'z'];
  function silabasDe(c) { return ['a', 'e', 'i', 'o', 'u'].map(function (v) { if (c === 'c') return { e: 'ce', i: 'ci' }[v] || 'c' + v; if (c === 'g') return { e: 'gue', i: 'gui' }[v] || 'g' + v; if (c === 'z') return { e: 'ce', i: 'ci' }[v] || 'z' + v; return c + v; }); }
  var FRASES = [['Mi mamá me mima.', 'El sol brilla.', 'La luna sale de noche.', 'Me gusta leer.', 'El oso duerme.', 'Tengo una flor.', 'El barco va por el mar.', 'Lavo mis manos.', 'Mi casa es bonita.', 'Hoy es un buen día.'],
    ['La tortuga camina despacio.', 'Comparto mis juguetes con mis amigos.', 'El pájaro canta en el árbol.', 'Me gusta la uva y la manzana.', 'El cohete viaja a la luna.', 'Mi gato duerme al sol.', 'Leer me lleva a otros lugares.', 'Cuido las plantas del patio.', 'Cada día aprendo algo nuevo.', 'La mariposa vuela entre las flores.']];
  var NUMEROS = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  function estrellitas(n, C) {
    var s = ''; for (var i = 0; i < Math.max(n, 1); i++) s += '<path d="' + poli(estrellaPts(18 + i * 34, 18, 15, 6.5, 5)) + '" transform="translate(0 0)" fill="#fff" stroke="#222" stroke-width="1.6" stroke-linejoin="round"' + (n ? '' : ' opacity="0"') + '/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + (Math.max(n, 1) * 34 + 2) + ' 36" style="height:14mm;width:auto;display:block">' + s + '</svg>';
  }

  /* ─────────── fuentes de palabras ─────────── */
  function figsDe(C, pool) {
    var temas = (C.op.temas && C.op.temas.length) ? C.op.temas : null;
    return Object.keys(FIG).filter(function (k) { return !temas || temas.indexOf(FIG[k][2]) >= 0; });
  }
  function palabrasUnidad(C, u, max) {
    if (!u) return [];
    if (u.figs) return u.figs.map(function (k) { return palabraFig(C, k); });
    if (u.tema && u.tema.pal) { var lg = (C.op.base || 'es'); return u.tema.pal.map(function (p) { return String(p[lg] || p.es).replace(/^(el|la|los|las|le|l’|der|die|das|de|d|s|the)\s+/i, '').replace(/^l’/, ''); }).filter(function (w) { return !/\s/.test(w); }); }
    var out = [], vistos = {};
    (u.k || []).concat([u.t]).forEach(function (k) {
      H.sub(String(k || ''), C).split(/[\s,;:·/()«»"-]+/).forEach(function (w) {
        var l = limpiaSopa(w); if (l.length >= 3 && l.length <= max && !vistos[l] && !/^(LAS|LOS|DEL|CON|POR|PARA|UNA|UNOS|UNAS|QUE|SUS|ENTRE|SOBRE)$/.test(l)) { vistos[l] = 1; out.push(w); }
      });
    });
    return out;
  }

  /* ─────────── lámina explicativa con el motor de láminas ─────────── */
  var LAMC = {};
  function lamina(clave, titulo, sub, texto) {
    if (LAMC[clave]) return LAMC[clave];
    var LM = window.LAMINAS_MOTOR; if (!LM) return '';
    try {
      var cv = document.createElement('canvas'); cv.width = 1600; cv.height = 1130;
      var pal = (LM.paletas() || []).filter(function (p) { return p.claro; })[0];
      LM.pintar(cv.getContext('2d'), 1600, 1130, { titulo: titulo, subtitulo: sub, estructura: 'cadena', paleta: pal && pal.id, nodos: LM.nodosDeTexto(texto) }, { prog: 1 });
      var u = cv.toDataURL('image/jpeg', 0.9);
      if (!document.fonts || document.fonts.status === 'loaded') LAMC[clave] = u;
      return u;
    } catch (e) { return ''; }
  }
  var LAM_TXT = {
    colorear: ['Cómo colorear', 'Colorear\nElige tres o cuatro colores\nEmpieza por las partes grandes\nColorea sin prisa, en una sola dirección\nTermina con los detalles\nRepasa el nombre del dibujo'],
    caligrafia: ['Cómo escribir en la pauta', 'Escribir\nSiéntate con la espalda recta\nSujeta el lápiz con tres dedos\nEmpieza en el punto de color\nRepasa la letra gris\nEscribe tú solo en el renglón libre'],
    pasatiempos: ['Cómo resolver los pasatiempos', 'Pasatiempos\nLee la consigna despacio\nMira el ejemplo resuelto\nPrueba sin miedo a equivocarte\nComprueba en el solucionario\nVuelve a intentarlo otro día']
  };

  /* ─────────── páginas ─────────── */
  function consigna(C, t) { return '<p style="font-size:1.08em;margin:0 0 5mm;max-width:160mm">' + esc(V(C, t)) + '</p>'; }
  function titulo(C, t, extra) { return H.h1(C, esc(V(C, t)), extra); }
  function libre(C) { return C.papel.h - 36 - 14; }
  var paginas = {
    col_como: function (pg, C) {
      var T = C.T, f = pg.f;
      var pasos = ['Elige tres o cuatro colores antes de empezar.', 'Colorea primero las partes grandes y después los detalles.', 'Si te sales un poco de la línea, no pasa nada: sigue.', 'Repasa el nombre del dibujo en la pauta de abajo.'];
      return H.cabecera(C, pg) + titulo(C, 'Cómo usar este libro') +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8mm;margin:2mm 0 6mm">' +
        '<div><div style="border:0.3mm solid ' + T.soft + ';border-radius:' + T.r + 'px;padding:4mm">' + figSVG(f) + '</div><div style="text-align:center;margin-top:2mm;font-size:.9em">Así lo recibes</div></div>' +
        '<div><div style="border:0.3mm solid ' + T.soft + ';border-radius:' + T.r + 'px;padding:4mm">' + figSVG(f, true) + '</div><div style="text-align:center;margin-top:2mm;font-size:.9em">Así puede quedar</div></div></div>' +
        pasos.map(function (p, i) { return '<div style="display:flex;gap:4mm;align-items:baseline;margin:0 0 3mm"><b style="flex:none;width:8mm;height:8mm;border-radius:50%;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center">' + (i + 1) + '</b><span>' + esc(V(C, p)) + '</span></div>'; }).join('') +
        H.guia(C, V(C, 'No hay colores equivocados: un gato puede ser azul si tú quieres.'), true) + H.folio(C, pg);
    },
    col_figura: function (pg, C) {
      var w = Math.min(ancho(C), libre(C) - 70);
      return H.cabecera(C, pg) + titulo(C, 'Colorea ' + nombreFig(C, pg.f)) +
        '<div style="width:' + w + 'mm;margin:0 auto 6mm">' + figSVG(pg.f) + '</div>' +
        '<div style="font-size:.85em;margin:0 0 1.5mm;opacity:.8">' + esc(V(C, 'Repasa la palabra:')) + '</div>' + renglon(C, palabraFig(C, pg.f), 'modelo', altoRenglon(C)) + H.folio(C, pg);
    },
    col_mandala: function (pg, C) {
      var w = Math.min(ancho(C), libre(C) - 30);
      return H.cabecera(C, pg) + titulo(C, 'Colorea el mandala') + consigna(C, 'Empieza por el centro y sigue hacia fuera, anillo a anillo.') +
        '<div style="width:' + w + 'mm;margin:0 auto">' + mandalaSVG(pg.seed, pg.L, 'blanco') + '</div>' + H.folio(C, pg);
    },
    col_numeros: function (pg, C) {
      var T = C.T, K = pg.K, w = Math.min(ancho(C), libre(C) - 48);
      return H.cabecera(C, pg) + titulo(C, 'Colorea por números') + consigna(C, 'Pinta cada parte con el color de su número.') +
        '<div style="display:flex;flex-wrap:wrap;gap:3mm 6mm;margin:0 0 5mm">' + PALN.slice(0, K).map(function (c, i) { return '<div style="display:flex;align-items:center;gap:2mm"><span style="width:8mm;height:8mm;border-radius:50%;background:' + c + ';border:0.3mm solid #222;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;text-shadow:0 0 1mm #000">' + (i + 1) + '</span><span>' + PALNn[i] + '</span></div>'; }).join('') + '</div>' +
        '<div style="width:' + w + 'mm;margin:0 auto">' + mandalaSVG(pg.seed, pg.L, 'numeros', K) + '</div>' + H.folio(C, pg);
    },
    col_puntos: function (pg, C) {
      var P = PUNTOS[pg.forma], w = Math.min(ancho(C), libre(C) - 40);
      return H.cabecera(C, pg) + titulo(C, 'Une los puntos') + consigna(C, 'Une los puntos del 1 al ' + pg.pts.length + ' sin levantar el lápiz. Después colorea el dibujo.') +
        '<div style="width:' + w + 'mm;margin:0 auto">' + puntosSVG(pg.pts, C, false) + '</div>' + H.folio(C, pg);
    },
    inf_libre: function (pg, C) {
      var T = C.T;
      return H.cabecera(C, pg) + titulo(C, pg.t || 'Dibuja lo que quieras') + '<div style="height:' + (libre(C) - 34) + 'mm;border:0.5mm solid ' + T.ink + ';border-radius:' + T.r + 'px;opacity:.6"></div>' + H.folio(C, pg);
    },
    inf_lamina: function (pg, C) {
      var L = LAM_TXT[pg.prod], img = L ? lamina(pg.prod + C.T.id, L[0], C.titulo, L[1]) : '';
      return H.cabecera(C, pg) + titulo(C, L ? L[0] : 'Lámina') + (img ? '<img src="' + img + '" alt="" style="width:100%;display:block;border-radius:' + C.T.r + 'px"/>' : H.marcoImagen(C, 'Lámina explicativa (necesita el motor de láminas)', 120)) +
        '<p style="margin-top:5mm;font-size:.95em;opacity:.85">' + esc(V(C, 'Mira la lámina antes de empezar y vuelve a ella cuando dudes.')) + '</p>' + H.folio(C, pg);
    },
    /* caligrafía */
    cal_como: function (pg, C) {
      var T = C.T, F = letraCal(C), al = Math.max(18, altoRenglon(C) * 1.3);
      var zonas = (C.op.pauta || 'montessori') === 'montessori' || C.op.pauta === 'cuadricula' ?
        '<div style="display:grid;grid-template-columns:minmax(0,1fr) 46mm;gap:4mm;align-items:stretch;margin:0 0 6mm"><div>' + renglon(C, F.ligada ? 'la bola' : 'la bola', 'ejemplo', al) + '</div>' +
        '<div style="display:grid;grid-template-rows:1fr 1fr 1fr;font-size:.78em;line-height:1.2"><div style="display:flex;align-items:center">Zona alta: l, b, d, t</div><div style="display:flex;align-items:center;color:' + T.acc2 + ';font-weight:700">Zona media: a, o, e…</div><div style="display:flex;align-items:center">Zona baja: g, p, y</div></div></div>' : '<div style="margin:0 0 6mm">' + renglon(C, 'la bola', 'ejemplo', al) + '</div>';
      var pasos = ['Siéntate con la espalda recta y los dos pies en el suelo.', 'Sujeta el lápiz con tres dedos, sin apretar.', 'Empieza cada letra en el punto de color.', 'Repasa la letra gris despacio' + (F.ligada ? ', sin levantar el lápiz dentro de la palabra.' : '.'), 'Después escribe tú solo en el renglón libre.'];
      return H.cabecera(C, pg) + titulo(C, 'Cómo usar la pauta') + consigna(C, 'La letra de este cuaderno es ' + F.n + '.') + zonas +
        pasos.map(function (p, i) { return '<div style="display:flex;gap:4mm;align-items:baseline;margin:0 0 3mm"><b style="flex:none;width:8mm;height:8mm;border-radius:50%;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center">' + (i + 1) + '</b><span>' + esc(V(C, p)) + '</span></div>'; }).join('') +
        H.guia(C, V(C, 'Diez minutos al día valen más que una hora el domingo.'), true) + H.folio(C, pg);
    },
    cal_letra: function (pg, C) {
      var T = C.T, F = letraCal(C), l = pg.l, L = l.toUpperCase(), w = pg.w, f = figDePalabra(C, w);
      var filas = [[l, 'modelo'], [l, 'repaso'], [L, 'modelo'], [w, 'modelo'], [l, 'medio'], [L, 'medio'], [w, 'medio'], [l, 'libre'], [w, 'libre'], [l, 'libre']];
      if (pg.caso === 'may') filas = [[L, 'modelo'], [L, 'repaso'], [w.toUpperCase(), 'modelo'], [L, 'medio'], [w.toUpperCase(), 'medio'], [L, 'libre'], [L, 'libre']];
      return H.cabecera(C, pg) + '<div style="display:flex;justify-content:space-between;align-items:center;gap:6mm;margin:0 0 4mm"><div>' +
        '<div style="font-family:' + F.f + ';font-weight:' + F.peso + ';font-size:' + (C.fs * 4.2) + 'px;line-height:1.1;color:' + T.acc + '">' + esc(L + ' ' + l) + '</div>' +
        '<div style="font-size:1.05em">' + esc(V(C, 'Repasa y después escribe tú solo.')) + '</div></div>' +
        (f ? '<div style="width:30mm;flex:none">' + figSVG(f) + '<div style="text-align:center;font-size:.8em">' + esc(w) + '</div></div>' : '<div style="font-size:1.4em;font-family:' + F.f + '">' + esc(w) + '</div>') + '</div>' +
        renglones(C, filas, 40) + H.folio(C, pg);
    },
    cal_silabas: function (pg, C) {
      var s = silabasDe(pg.c), filas = [];
      s.forEach(function (x) { filas.push([x + ' ' + x, 'modelo']); });
      s.forEach(function (x) { filas.push([x, 'medio']); });
      return H.cabecera(C, pg) + titulo(C, pg.c + ' con las vocales') + consigna(C, 'Lee cada sílaba en voz alta mientras la repasas.') + renglones(C, filas, 26) + H.folio(C, pg);
    },
    cal_palabras: function (pg, C) {
      var filas = [];
      pg.ws.forEach(function (w) { filas.push([w, 'modelo'], [w, 'medio']); });
      return H.cabecera(C, pg) + titulo(C, pg.t || 'Palabras') + consigna(C, 'Repasa cada palabra y escríbela otra vez.') + renglones(C, filas, 26) + H.folio(C, pg);
    },
    cal_frase: function (pg, C) {
      var filas = [];
      pg.fs.forEach(function (x) { filas.push([x, 'ejemplo'], [x, 'medio'], ['', 'libre']); });
      return H.cabecera(C, pg) + titulo(C, pg.t || 'Frases') + consigna(C, 'Copia la frase debajo. Deja un espacio entre palabra y palabra.') + renglones(C, filas, 26) + H.folio(C, pg);
    },
    cal_numero: function (pg, C) {
      var T = C.T, F = letraCal(C), n = pg.n, d = String(n), w = NUMEROS[n];
      var filas = [[d, 'modelo'], [d, 'repaso'], [w, 'modelo'], [d, 'medio'], [w, 'medio'], [d, 'libre']];
      return H.cabecera(C, pg) + '<div style="display:flex;align-items:center;gap:8mm;margin:0 0 4mm"><div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 5) + 'px;line-height:1;color:' + T.acc + '">' + d + '</div><div style="font-family:' + F.f + ';font-size:' + (C.fs * 2) + 'px">' + w + '</div></div>' +
        renglones(C, filas, 62) + '<div style="margin-top:3mm"><div style="margin:0 0 2mm">' + esc(V(C, n ? 'Colorea ' + w + (n === 1 ? ' estrella.' : ' estrellas.') : 'Cero estrellas: ¡no hay nada que colorear!')) + '</div>' + estrellitas(n, C) + '</div>' + H.folio(C, pg);
    },
    /* pasatiempos */
    pas_como: function (pg, C) {
      var T = C.T, r = H.rng(H.hash('ejemplo') + C.semilla), S = sopa(['sol', 'pez', 'oso'], 6, [[1, 0], [0, 1]], r), M = laberinto(5, 5, r);
      var paso = function (i, t) { return '<div style="display:flex;gap:3mm;align-items:baseline;margin:0 0 2.5mm;font-size:.95em"><b style="flex:none;width:7mm;height:7mm;border-radius:50%;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:.85em">' + i + '</b><span>' + esc(V(C, t)) + '</span></div>'; };
      return H.cabecera(C, pg) + titulo(C, 'Cómo se resuelven') +
        H.h2(C, 'Sopa de letras') + '<div style="display:grid;grid-template-columns:52mm minmax(0,1fr);gap:6mm;align-items:start">' + sopaTabla(S, C, true, 8) + '<div>' +
        paso(1, 'Lee la lista de palabras.') + paso(2, 'Busca la primera letra de una palabra.') + paso(3, 'Mira si las letras siguientes están al lado, en fila, en columna o en diagonal.') + paso(4, 'Rodea la palabra y táchala de la lista.') + '</div></div>' +
        H.h2(C, 'Laberinto') + '<div style="display:grid;grid-template-columns:52mm minmax(0,1fr);gap:6mm;align-items:start"><div>' + laberintoSVG(M, C, true, 'gato', 'casa') + '</div><div>' +
        paso(1, 'Pon el dedo en la entrada, junto al dibujo de arriba.') + paso(2, 'Avanza sin cruzar ninguna pared.') + paso(3, 'Si llegas a un callejón, vuelve atrás y prueba otro camino.') + paso(4, 'Cuando lo encuentres, marca el camino con el lápiz.') + '</div></div>' +
        H.folio(C, pg);
    },
    pas_sopa: function (pg, C) {
      var M = medidasSopa(C), mm = Math.min(12.5, (ancho(C) - 10) / pg.S.n), txt = nivel(C) >= 3 ? 'Busca las ' + pg.S.p.length + ' palabras. Pueden estar en horizontal, vertical o diagonal, y también al revés.' : nivel(C) === 2 ? 'Busca las ' + pg.S.p.length + ' palabras en horizontal, vertical o diagonal.' : 'Encuentra estas palabras en la sopa de letras.';
      return H.cabecera(C, pg) + numero(C, pg) + titulo(C, pg.t) + consigna(C, txt) + sopaTabla(pg.S, C, false, mm) + sopaLista(pg.S, C) + H.folio(C, pg);
    },
    pas_laberinto: function (pg, C) {
      var w = Math.min(ancho(C), (libre(C) - 40) * pg.M.c / (pg.M.f + 5));
      return H.cabecera(C, pg) + numero(C, pg) + titulo(C, 'Laberinto') + consigna(C, 'Ayuda a ' + nombreFig(C, pg.a) + ' a llegar hasta ' + nombreFig(C, pg.b) + '.') + '<div style="width:' + w + 'mm;margin:0 auto">' + laberintoSVG(pg.M, C, false, pg.a, pg.b) + '</div>' + H.folio(C, pg);
    },
    pas_puntos: function (pg, C) { return paginas.col_puntos(pg, C).replace(H.cabecera(C, pg), H.cabecera(C, pg) + numero(C, pg)); },
    pas_simetria: function (pg, C) {
      var w = Math.min(ancho(C) * 0.85, libre(C) - 50);
      return H.cabecera(C, pg) + numero(C, pg) + titulo(C, 'Completa la simetría') + consigna(C, 'Pinta los cuadros que faltan a la derecha para que las dos mitades sean iguales, como en un espejo. ¿Qué dibujo sale?') + '<div style="width:' + w + 'mm;margin:0 auto">' + simSVG(pg.p, C, false) + '</div>' + H.folio(C, pg);
    },
    pas_sol: function (pg, C, modo, ctx) {
      var T = C.T, todos = (ctx && ctx.pages || []).filter(function (p) { return p.sol === true; }), sols = (ctx && ctx.pages || []).filter(function (p) { return p.tipo === 'pas_sol'; });
      var cuantas = Math.ceil(todos.length / Math.max(1, sols.length)), trozo = todos.slice(pg.parte * cuantas, (pg.parte + 1) * cuantas), cols = cuantas > 6 ? 3 : 2;
      /* (10-10-2026) en el PDF el solucionario se salía 30 mm por abajo: cada solución cabe en su hueco (alto de la hoja ÷ filas) */
      var cajaH = Math.max(28, (C.papel.h - 36 - 30 - 8) / Math.max(1, Math.ceil(trozo.length / cols)) - 6 - 7), topeSvg = function (s) { return s.replace('style="width:100%;height:auto;', 'style="width:100%;height:auto;max-height:' + cajaH.toFixed(1) + 'mm;'); };
      return H.cabecera(C, pg) + titulo(C, pg.parte ? 'Solucionario (sigue)' : 'Solucionario', 'font-size:' + (C.fs * 1.6) + 'px') +
        '<div style="display:grid;grid-template-columns:repeat(' + cols + ',minmax(0,1fr));gap:6mm">' + trozo.map(function (p) {
          var h = p.tipo === 'pas_sopa' ? sopaTabla(p.S, C, true, Math.min(5.5, (ancho(C) / cols - 6) / p.S.n, cajaH / p.S.n)) : topeSvg(p.tipo === 'pas_laberinto' ? laberintoSVG(p.M, C, true, p.a, p.b) : p.tipo === 'pas_simetria' ? simSVG(p.p, C, true) : puntosSVG(p.pts, C, true));
          var n = p.tipo === 'pas_simetria' ? PIX[p.p][0] : p.tipo === 'pas_puntos' ? PUNTOS[p.forma][0] : '';
          return '<div style="break-inside:avoid"><div style="font-size:.8em;font-weight:700;color:' + T.acc + ';margin-bottom:1.5mm">' + p.pz + ' · ' + esc(p.tipo === 'pas_sopa' ? p.t : p.tipo === 'pas_laberinto' ? 'Laberinto' : n ? 'Sale ' + n : '') + ' <span style="opacity:.6;font-weight:400">(pág. ' + p.num + ')</span></div><div style="max-width:' + (ancho(C) / cols - 4) + 'mm">' + h + '</div></div>';
        }).join('') + '</div>' + H.folio(C, pg);
    }
  };
  function numero(C, pg) { return pg.pz ? '<div style="font-size:.8em;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:' + C.T.acc + ';margin:0 0 1mm">Pasatiempo ' + pg.pz + '</div>' : ''; }

  /* ─────────── armado ─────────── */
  function base(C, prod, N, core) {
    var c = core.slice();
    if (N >= 20 && window.LAMINAS_MOTOR) c.push({ tipo: 'inf_lamina', prod: prod, indice: LAM_TXT[prod][0] });
    return c;
  }
  function armarColorear(C, pool, N, r) {
    var figs = figsDe(C, pool), k0 = nivel(C), tipos = (C.op.dibujos && C.op.dibujos.length) ? C.op.dibujos : k0 === 0 ? ['figura', 'figura', 'mandala', 'puntos'] : ['figura', 'mandala', 'figura', 'numeros', 'puntos'];
    var formas = k0 === 0 ? ['diamante', 'casa', 'estrella'] : Object.keys(PUNTOS), npts = [8, 12, 16, 22, 30][k0], L = [3, 4, 5, 6, 7][k0], orden = H.mezcla(r, figs), vistos = {};
    var core = base(C, 'colorear', N, [{ tipo: 'col_como', f: orden[0] || 'sol', indice: 'Cómo usar este libro' }]), cf = 0, cm = 0, cp = 0;
    var ind = { figura: 'Dibujos para colorear', mandala: 'Mandalas', numeros: 'Colorea por números', puntos: 'Une los puntos' };
    return H.envolver(C, core, N, function (k) {
      var t = tipos[k % tipos.length], pg;
      if (t === 'figura') pg = { tipo: 'col_figura', f: orden[cf++ % orden.length] };
      else if (t === 'mandala') pg = { tipo: 'col_mandala', seed: H.hash('m' + cm++) + C.semilla, L: L };
      else if (t === 'numeros') pg = { tipo: 'col_numeros', seed: H.hash('n' + cm++) + C.semilla, L: L, K: k0 <= 1 ? 3 : 5 };
      else { var fo = formas[cp++ % formas.length]; pg = { tipo: 'col_puntos', forma: fo, pts: densificar(PUNTOS[fo][1], npts) }; }
      pg.relleno = true; pg.cab = ind[t];
      if (!vistos[t]) { vistos[t] = 1; pg.indice = ind[t]; }
      return pg;
    }, { indiceFilas: 6, biblio: false });
  }
  function armarCaligrafia(C, pool, N, r) {
    var k0 = nivel(C), cont = (C.op.cal && C.op.cal.length) ? C.op.cal : [['vocales', 'numeros'], ['vocales', 'abecedario', 'silabas', 'palabras'], ['abecedario', 'silabas', 'palabras', 'frases'], ['palabras', 'frases']][Math.min(3, k0)];
    var caso = C.op.caso || (k0 === 0 ? 'may' : 'ambas'), items = [], ind = {};
    var otra = !C.op.cal && C.mat !== 'infantil';
    if (otra) cont = ['palabras', 'frases'];
    var poner = function (p, n) { p.cab = n; if (!ind[n]) { ind[n] = 1; p.indice = n; } items.push(p); };
    cont.forEach(function (c) {
      if (c === 'vocales') ABC.filter(function (x) { return 'aeiou'.indexOf(x[0]) >= 0; }).forEach(function (x) { poner({ tipo: 'cal_letra', l: x[0], w: x[0] === 'a' ? 'árbol' : x[1], caso: caso }, 'Las vocales'); });
      if (c === 'abecedario') ABC.forEach(function (x) { poner({ tipo: 'cal_letra', l: x[0], w: x[1], caso: caso }, 'El abecedario'); });
      if (c === 'silabas') SILABAS.forEach(function (s) { poner({ tipo: 'cal_silabas', c: s }, 'Las sílabas'); });
      if (c === 'numeros') for (var n = 0; n <= 10; n++) poner({ tipo: 'cal_numero', n: n }, 'Los números');
      if (c === 'palabras') {
        var fuente = C.mat === 'infantil' ? [{ t: 'Palabras', ws: figsDe(C, pool).map(function (k) { return palabraFig(C, k); }) }] : pool.map(function (u) { return { t: H.sub(u.t, C), ws: palabrasUnidad(C, u, 14) }; });
        fuente.forEach(function (fz) { for (var i = 0; i < fz.ws.length; i += 3) poner({ tipo: 'cal_palabras', ws: fz.ws.slice(i, i + 3), t: fz.t }, 'Palabras'); });
      }
      if (c === 'frases') {
        var fr = C.mat === 'infantil' || !pool.length ? FRASES[k0 >= 3 ? 1 : 0] : [].concat.apply([], pool.map(function (u) { return (u.i || []).map(function (x) { return H.sub(x, C); }).filter(function (x) { return x.length <= 60; }); }));
        if (!fr.length) fr = FRASES[1];
        for (var j = 0; j < fr.length; j += 2) poner({ tipo: 'cal_frase', fs: fr.slice(j, j + 2) }, 'Frases');
      }
    });
    if (!items.length) items.push({ tipo: 'cal_letra', l: 'a', w: 'árbol', caso: caso, cab: 'Letras' });
    var core = base(C, 'caligrafia', N, [{ tipo: 'cal_como', indice: 'Cómo usar la pauta' }]).concat(items.map(function (x, i) { return Object.assign({}, x, { relleno: i > 0 }); }));
    return H.envolver(C, core, N, function (k) { var x = Object.assign({}, items[k % items.length], { relleno: true }); delete x.indice; return x; }, { indiceFilas: 8, biblio: false });
  }
  function armarPasatiempos(C, pool, N, r) {
    var k0 = nivel(C), juegos = (C.op.juegos && C.op.juegos.length) ? C.op.juegos : k0 === 0 ? ['sopa', 'laberinto', 'puntos'] : ['sopa', 'laberinto', 'puntos', 'simetria'];
    var M = medidasSopa(C), lab = [[5, 6], [8, 9], [11, 13], [14, 17], [18, 22]][k0], figs = H.mezcla(r, Object.keys(FIG)), formas = k0 === 0 ? ['diamante', 'casa', 'estrella'] : Object.keys(PUNTOS), pix = Object.keys(PIX);
    var npts = [8, 12, 16, 22, 30][k0], cont = { sopa: 0, laberinto: 0, puntos: 0, simetria: 0 }, units = pool.length ? pool : [null], ind = {};
    var nom = { sopa: 'Sopas de letras', laberinto: 'Laberintos', puntos: 'Une los puntos', simetria: 'Simetrías' };
    var hacer = function (t, k) {
      var i = cont[t]++, pg, rr = H.rng(H.hash(t + i) + C.semilla * 131);
      if (t === 'sopa') {
        var u = units[i % units.length], ws = palabrasUnidad(C, u, M.n);
        if (ws.length < 3) ws = ws.concat(figs.map(function (f) { return palabraFig(C, f); }));
        pg = { tipo: 'pas_sopa', S: sopa(H.mezcla(rr, ws).slice(0, M.cuantas + 2).slice(0, M.cuantas), M.n, M.dirs, rr), t: 'Sopa de letras' + (u && u.t ? ': ' + H.sub(u.t, C).toLowerCase() : ''), u: u || undefined };
      } else if (t === 'laberinto') pg = { tipo: 'pas_laberinto', M: laberinto(lab[0], lab[1], rr), a: figs[(i * 2) % figs.length], b: figs[(i * 2 + 1) % figs.length] };
      else if (t === 'puntos') { var fo = formas[i % formas.length]; pg = { tipo: 'pas_puntos', forma: fo, pts: densificar(PUNTOS[fo][1], npts) }; }
      else pg = { tipo: 'pas_simetria', p: pix[i % pix.length] };
      pg.sol = true; pg.relleno = true; pg.cab = nom[t];
      if (!ind[t]) { ind[t] = 1; pg.indice = nom[t]; }
      return pg;
    };
    var core = base(C, 'pasatiempos', N, [{ tipo: 'pas_como', indice: 'Cómo se resuelven' }]);
    var pages = H.envolver(C, core, N, function (k) { return hacer(juegos[k % juegos.length], k); }, { indiceFilas: 6, biblio: false });
    var idx = []; pages.forEach(function (p, i) { if (p.sol === true) idx.push(i); });
    if (C.solucion && idx.length > 1) {
      var s = 0; while (Math.ceil((idx.length - s) / 8) > s) s++;
      var quita = idx.slice(idx.length - s);
      for (var q = quita.length - 1; q >= 0; q--) pages.splice(quita[q], 1);
      var fin = pages.length - 1; for (var z = 0; z < s; z++) pages.splice(fin + z, 0, { tipo: 'pas_sol', parte: z, indice: z ? null : 'Solucionario', cab: 'Solucionario' });
    }
    var n = 0; pages.forEach(function (p) { if (p.sol === true) p.pz = ++n; });
    return pages;
  }

  /* ─────────── colección «Infantil» ─────────── */
  var IDEAS = {
    animales: [['Los animales pueden vivir en casa, en el campo o en el agua.', 'Cada animal se mueve a su manera: nada, vuela, corre o se arrastra.', 'Cuidar a los animales es tarea de todos.'], ['¿Cuál es tu animal favorito? Dibújalo.', '¿Qué animal vive en el agua?']],
    naturaleza: [['El sol nos da luz y calor durante el día.', 'De noche vemos la luna y las estrellas.', 'Las plantas necesitan agua, luz y tierra para crecer.'], ['¿Qué vemos en el cielo de noche?', '¿Qué necesita una flor para crecer?']],
    casa: [['En casa comemos juntos y ayudamos a poner la mesa.', 'La fruta, como la manzana o la uva, nos ayuda a crecer.', 'Hay casas de muchas formas: un iglú es una casa de hielo.'], ['¿Qué fruta te gusta más?', '¿Cómo es tu casa?']],
    transporte: [['Para ir lejos usamos el coche, el barco o el cohete.', 'El barco va por el mar y el cohete viaja al espacio.', 'En la calle cruzamos siempre por el paso de peatones.'], ['¿Qué transporte usas para ir a la escuela?', '¿Por dónde va el barco?']]
  };
  var UNIDADES = Object.keys(TEMAS).map(function (t) {
    var figs = Object.keys(FIG).filter(function (k) { return FIG[k][2] === t; });
    return { m: 'infantil', id: 'inf_' + t, b: ['inf', 'pri1', 'pri2', 'pri3', 'sec', 'bach', 'fp', 'adu'], t: TEMAS[t], figs: figs, i: IDEAS[t][0], k: figs.map(function (k) { return FIG[k][1]; }), q: IDEAS[t][1], g: 'inf_letras', f: { t: 'mapa', c: TEMAS[t], r: figs.slice(0, 5).map(function (k) { return FIG[k][1]; }) } };
  });
  var generadores = {
    inf_letras: function (u, C, r) {
      var w = palabraFig(C, H.pick(r, u.figs || ['sol']));
      return r() < 0.5 ? H.it('corta', '¿Con qué letra empieza «' + w + '»?', w.charAt(0), { ac: [w.charAt(0), w.charAt(0).toUpperCase()] }) : H.it('corta', '¿Cuántas letras tiene «' + w + '»?', String(Array.from(w).length));
    }
  };
  function quiz(u, C, r, n) {
    var out = [], abc = 'abcdefghijlmnoprstuvz';
    for (var i = 0; i < n; i++) {
      var w = palabraFig(C, H.pick(r, u.figs || Object.keys(FIG))), l = w.normalize('NFD').charAt(0), ops = [l];
      while (ops.length < 3) { var x = abc.charAt(Math.floor(r() * abc.length)); if (ops.indexOf(x) < 0) ops.push(x); }
      ops = H.mezcla(r, ops);
      out.push(H.it('mc', '¿Con qué letra empieza «' + w + '»?', l, { o: ops, c: ops.indexOf(l) }));
    }
    return out;
  }

  var VOZ = {
    col_figura: function (pg, C) { return V(C, 'Colorea ' + nombreFig(C, pg.f) + '. Después repasa la palabra ' + palabraFig(C, pg.f) + '.'); },
    col_mandala: function (pg, C) { return V(C, 'Colorea el mandala. Empieza por el centro.'); },
    col_numeros: function (pg, C) { return V(C, 'Pinta cada parte con el color de su número.'); },
    col_puntos: function (pg, C) { return V(C, 'Une los puntos del uno al ' + pg.pts.length + '.'); },
    cal_letra: function (pg, C) { return 'La letra ' + pg.l + ', de ' + pg.w + '.'; },
    cal_silabas: function (pg) { return silabasDe(pg.c).join(', ') + '.'; },
    cal_palabras: function (pg) { return pg.ws.join(', ') + '.'; },
    cal_frase: function (pg) { return pg.fs.join(' '); },
    cal_numero: function (pg) { return 'El número ' + NUMEROS[pg.n] + '.'; },
    pas_sopa: function (pg, C) { return V(C, 'Busca estas palabras: ') + pg.S.p.map(function (p) { return p.o; }).join(', ') + '.'; },
    pas_laberinto: function (pg, C) { return V(C, 'Ayuda a ' + nombreFig(C, pg.a) + ' a llegar hasta ' + nombreFig(C, pg.b) + '.'); },
    pas_simetria: function (pg, C) { return V(C, 'Completa el dibujo para que las dos mitades sean iguales.'); }
  };
  VOZ.pas_puntos = VOZ.col_puntos;
  var ESC = {};
  Object.keys(VOZ).forEach(function (k) { ESC[k] = function (pg, C) { return { k: 'idea', t: VOZ[k](pg, C), s: pg.cab || '' }; }; });
  ESC.pas_sopa = function (pg, C) { return { k: 'lista', t: pg.t, l: pg.S.p.map(function (p) { return p.w; }) }; };

  ED.registrar({
    materias: [{
      id: 'infantil', n: 'Infantil · colorear, caligrafía y pasatiempos', ico: '🖍', grupo: 'Infantil', edad: true, prodDef: 'colorear',
      plantilla: function (b) { return b === 'inf' || b === 'pri1' ? 'cuento' : 'cuaderno'; },
      opciones: [
        { k: 'temas', n: 'Temas de los dibujos (vacío = todos)', tipo: 'multi', def: [], ops: Object.keys(TEMAS).map(function (t) { return [t, TEMAS[t]]; }) },
        { k: 'dibujos', n: 'Para colorear (vacío = según la edad)', tipo: 'multi', def: [], ops: [['figura', 'Dibujos'], ['mandala', 'Mandalas'], ['numeros', 'Por números'], ['puntos', 'Une los puntos']] },
        { k: 'cal', n: 'Caligrafía (vacío = según la edad)', tipo: 'multi', def: [], ops: [['vocales', 'Vocales'], ['abecedario', 'Abecedario'], ['silabas', 'Sílabas'], ['palabras', 'Palabras'], ['frases', 'Frases'], ['numeros', 'Números']] },
        { k: 'letra', n: 'Letra', tipo: 'chips', def: 'pais', ops: [['pais', 'Ligada escolar del país'], ['imprenta', 'Imprenta']] },
        { k: 'pauta', n: 'Pauta', tipo: 'chips', def: 'montessori', ops: [['montessori', 'Montessori'], ['doble', 'Doble línea'], ['cuadricula', 'Cuadrícula'], ['linea', 'Una línea']] },
        { k: 'caso', n: 'Letras', tipo: 'chips', def: '', ops: [['', 'Según la edad'], ['may', 'Mayúsculas'], ['ambas', 'Minúsculas y mayúsculas']] },
        { k: 'juegos', n: 'Pasatiempos (vacío = todos)', tipo: 'multi', def: [], ops: [['sopa', 'Sopas de letras'], ['laberinto', 'Laberintos'], ['puntos', 'Une los puntos'], ['simetria', 'Simetrías']] }
      ]
    }],
    unidades: UNIDADES,
    productos: [
      { id: 'colorear', n: 'Libro para colorear', ico: '🖍', d: 'Dibujos de línea con su nombre para repasar, mandalas, colorea por números y une los puntos. Abre con un ejemplo coloreado y los pasos.', sol: false, armar: armarColorear, titulo: function (C) { return C.mat === 'infantil' ? 'Mi libro para colorear' : 'Colorea ' + C.matN.replace(/^.*·\s*/, '').toLowerCase(); } },
      { id: 'caligrafia', n: 'Cuaderno de caligrafía', ico: '✍️', d: 'Letra escolar ligada del país o de imprenta, en pauta Montessori, doble línea, cuadrícula o una línea. Modelo, repaso en gris y renglón libre.', sol: false, armar: armarCaligrafia, titulo: function (C) { return C.mat === 'infantil' ? 'Mi cuaderno de caligrafía' : 'Caligrafía: ' + C.matN.replace(/^.*·\s*/, '').toLowerCase(); } },
      { id: 'pasatiempos', n: 'Pasatiempos', ico: '🧩', d: 'Sopas de letras con las palabras de cada unidad, laberintos, une los puntos y simetrías, con ejemplo resuelto al principio y solucionario al final.', sol: true, armar: armarPasatiempos, titulo: function (C) { return C.mat === 'infantil' ? 'Mis pasatiempos' : 'Pasatiempos de ' + C.matN.replace(/^.*·\s*/, '').toLowerCase(); } }
    ],
    paginas: paginas,
    generadores: generadores,
    quiz: { infantil: quiz },
    voz: VOZ,
    escenas: ESC
  });

  window.EU_INFANTIL = { FIG: FIG, PUNTOS: PUNTOS, PIX: PIX, figSVG: figSVG, mandalaSVG: mandalaSVG, laberinto: laberinto, sopa: sopa, renglon: renglon };
})();
