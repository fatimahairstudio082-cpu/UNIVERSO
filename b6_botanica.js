/* b6_botanica.js — Librería botánica y de despensa (window.EU_BOTANICA).
   Cerca de cincuenta dibujos vectoriales —frutas, verduras, hierbas, semillas y básicos de despensa— que
   se pueden recolorear:
   · 'color'  colores naturales;  · 'tema'  la paleta del diseño del libro (cambia con el diseño y la rotación);
   · 'suave'  pasteles;  · 'linea'  solo contorno, para colorear.
   En 3D llevan brillo y sombra.
   API: dibujo(id, o) · bodegon(ids, C, o) · orla(ids, C, o) · deIngrediente(texto) · idsDe(receta) · lista().
   Además:
   · En el recetario, cuando no hay foto, el hueco de «Foto del plato» y el de cada capítulo se llenan
     con un bodegón de los ingredientes de la receta.
   · Opción cfg.acab.ilus ('auto' | 'color' | 'tema' | 'suave' | 'linea') y sección en el panel.
   Cargar después de b6_cerebro_cocina.js y b6_conectores.js. */
(function () {
  var ED = window.EU_EDITORIAL;
  if (!ED || window.EU_BOTANICA) return;
  var H = ED.H, esc = H.esc, NS = 'xmlns="http://www.w3.org/2000/svg"', uid = 0;
  function rgb(c) { c = String(c || '#000').replace('#', ''); if (c.length === 3) c = c.replace(/./g, '$&$&'); return [0, 2, 4].map(function (i) { return parseInt(c.slice(i, i + 2), 16) || 0; }); }
  function hex(a) { return '#' + a.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  function osc(c, k) { return hex(rgb(c).map(function (v) { return v * (1 - k); })); }
  function clr(c, k) { return hex(rgb(c).map(function (v) { return v + (255 - v) * k; })); }
  function r1(n) { return Math.round(n * 10) / 10; }

  /* ─────────── primitivas (lienzo 100 × 100) ─────────── */
  var P = {
    c: function (x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>'; },
    e: function (x, y, rx, ry, f, rot, o) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + (o || '') + '/>'; },
    p: function (d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>'; },
    l: function (d, s, w) { return '<path d="' + d + '" fill="none" stroke="' + s + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round" data-l="1"/>'; },
    r: function (x, y, w, h, rx, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + f + '"' + (o || '') + '/>'; }
  };
  function hoja(x, y, L, W, rot, f) { return '<path d="M0,0 Q' + (L * .5) + ',' + (-W) + ' ' + L + ',0 Q' + (L * .5) + ',' + W + ' 0,0 Z" fill="' + f + '" transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"/>'; }
  function nervio(x, y, L, rot, s) { return '<path d="M0,0 L' + L * .9 + ',0" fill="none" stroke="' + s + '" stroke-width="1" data-l="1" transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"/>'; }
  function puntos(cx, cy, rx, ry, n, rr, f, sem) { var s = '', a = sem || 1; for (var i = 0; i < n; i++) { a = (a * 9301 + 49297) % 233280; var t = a / 233280, u = ((a * 7) % 233280) / 233280, ang = t * Math.PI * 2, d = Math.sqrt(u); s += P.e(r1(cx + Math.cos(ang) * rx * d), r1(cy + Math.sin(ang) * ry * d), rr, rr * 1.5, f, r1(ang * 57)); } return s; }

  /* Cada dibujo recibe k = { a, b, h, s } (principal, secundario, hoja/tallo, detalle) y t (tinta). */
  var D = {
    manzana: [/manzana/i, 'Manzana', ['#D9412E', '#F0A33A', '#4E8A3A', '#6B4A2B'], function (k) { return P.p('M50,30 C38,20 16,24 16,50 C16,74 34,90 50,84 C66,90 84,74 84,50 C84,24 62,20 50,30 Z', k.a) + P.l('M50,31 C50,22 52,16 56,12', k.s, 3) + hoja(54, 20, 22, 7, -30, k.h); }],
    manzana_v: [/manzana verde/i, 'Manzana verde', ['#8CC43F', '#D5E36A', '#4E8A3A', '#6B4A2B'], function (k) { return D.manzana[3](k); }],
    pera: [/\bperas?\b/i, 'Pera', ['#C9C83A', '#E6D66A', '#4E8A3A', '#6B4A2B'], function (k) { return P.p('M50,16 C42,16 40,30 38,38 C30,50 20,58 22,72 C24,86 38,92 50,92 C62,92 76,86 78,72 C80,58 70,50 62,38 C60,30 58,16 50,16 Z', k.a) + P.l('M50,17 L52,6', k.s, 3) + hoja(52, 10, 18, 6, -20, k.h); }],
    naranja: [/naranja|mandarina/i, 'Naranja', ['#F08A24', '#F7B253', '#4E8A3A', '#C7651A'], function (k) { return P.c(50, 54, 34, k.a) + puntos(50, 54, 26, 26, 14, 1, k.s, 3) + hoja(52, 22, 22, 7, -25, k.h) + P.c(50, 21, 3, k.s); }],
    limon: [/lim[oó]n|lima\b/i, 'Limón', ['#F4D23A', '#FBE87A', '#4E8A3A', '#C9A91A'], function (k) { return P.p('M12,54 C14,46 20,44 24,40 C34,26 66,26 76,40 C80,44 86,46 88,54 C86,62 80,64 76,68 C66,82 34,82 24,68 C20,64 14,62 12,54 Z', k.a) + puntos(50, 54, 28, 16, 10, .9, k.s, 5) + hoja(58, 34, 20, 6, -40, k.h); }],
    platano: [/pl[aá]tano|banan|cambur|guineo/i, 'Plátano', ['#F2CF3B', '#E0B32A', '#6B7A2B', '#6B4A2B'], function (k) { return P.p('M14,30 C18,62 46,84 84,74 C88,73 90,70 86,68 C58,70 34,56 26,26 C25,22 14,24 14,30 Z', k.a) + P.p('M26,30 C34,56 56,66 84,68 C60,64 40,52 30,30 Z', k.b) + P.p('M13,24 L18,31 L26,27 L22,20 Z', k.s) + P.p('M84,68 L91,70 L87,75 Z', k.s); }],
    fresa: [/fresa|frutilla/i, 'Fresa', ['#E23B3B', '#F26B5B', '#3E8E3A', '#F7E27A'], function (k) { var s = ''; [[40, 44], [56, 42], [48, 54], [36, 58], [62, 56], [44, 68], [56, 68], [50, 80]].forEach(function (q) { s += P.e(q[0], q[1], 1.4, 2.4, k.s); }); return P.p('M50,90 C30,78 18,58 20,42 C22,30 36,28 50,32 C64,28 78,30 80,42 C82,58 70,78 50,90 Z', k.a) + s + P.p('M30,32 L40,22 L46,30 L50,18 L54,30 L60,22 L70,32 L58,36 L50,32 L42,36 Z', k.h); }],
    uva: [/\buvas?\b/i, 'Uvas', ['#7B3E8C', '#9C5AAE', '#4E8A3A', '#6B4A2B'], function (k) { var s = ''; [[40, 34], [54, 32], [68, 36], [34, 48], [48, 46], [62, 48], [42, 60], [56, 60], [50, 74]].forEach(function (q, i) { s += P.c(q[0], q[1], 9, i % 2 ? k.b : k.a); }); return P.l('M52,26 L54,10', k.s, 3) + hoja(56, 16, 22, 9, -10, k.h) + s; }],
    pina: [/pi[nñ]a|anan[aá]/i, 'Piña', ['#E6A92A', '#C8861C', '#3E8E3A', '#8A5A1A'], function (k) { var s = ''; for (var i = -3; i <= 3; i++) s += P.l('M' + (50 + i * 10 - 22) + ',44 L' + (50 + i * 10 + 22) + ',92', k.s, 1.2) + P.l('M' + (50 + i * 10 + 22) + ',44 L' + (50 + i * 10 - 22) + ',92', k.s, 1.2); return '<clipPath id="bpi' + (++uid) + '"><ellipse cx="50" cy="68" rx="24" ry="26"/></clipPath>' + P.e(50, 68, 24, 26, k.a) + '<g clip-path="url(#bpi' + uid + ')">' + s + '</g>' + hoja(50, 44, 34, 5, -90, k.h) + hoja(48, 44, 30, 5, -120, k.h) + hoja(52, 44, 30, 5, -60, k.h) + hoja(46, 44, 24, 5, -145, k.h) + hoja(54, 44, 24, 5, -35, k.h); }],
    mango: [/mango/i, 'Mango', ['#F4A32A', '#E8503A', '#4E8A3A', '#6B4A2B'], function (k) { return '<defs><linearGradient id="bmg' + (++uid) + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="' + k.b + '"/><stop offset=".7" stop-color="' + k.a + '"/></linearGradient></defs>' + P.p('M30,26 C52,12 84,30 82,58 C80,82 58,94 40,84 C20,74 14,40 30,26 Z', 'url(#bmg' + uid + ')') + P.l('M32,26 L28,16', k.s, 3) + hoja(30, 18, 20, 6, -150, k.h); }],
    sandia: [/sand[ií]a|patilla/i, 'Sandía', ['#E8434A', '#3E8E3A', '#9BCB6A', '#222222'], function (k) { var s = ''; [[36, 54], [50, 50], [64, 54], [44, 64], [58, 64]].forEach(function (q) { s += P.e(q[0], q[1], 1.6, 2.8, k.s); }); return P.p('M10,40 A40,40 0 0 0 90,40 Z', k.b) + P.p('M15,40 A35,35 0 0 0 85,40 Z', k.h) + P.p('M19,40 A31,31 0 0 0 81,40 Z', k.a) + s; }],
    kiwi: [/kiwi/i, 'Kiwi', ['#8DB63C', '#F2F0C8', '#7A5A2E', '#2A2A1A'], function (k) { var s = ''; for (var i = 0; i < 18; i++) { var a = i / 18 * Math.PI * 2; s += P.e(r1(50 + Math.cos(a) * 16), r1(52 + Math.sin(a) * 16), 1.2, 2.2, k.s, r1(a * 57 + 90)); } return P.c(50, 52, 36, k.h) + P.c(50, 52, 32, k.a) + P.c(50, 52, 10, k.b) + s; }],
    cereza: [/cereza|guinda/i, 'Cerezas', ['#B81F3A', '#D8455A', '#4E8A3A', '#5B3A1E'], function (k) { return P.l('M36,66 C40,40 50,24 60,14 M66,64 C64,40 62,24 60,14', k.s, 2.5) + hoja(60, 14, 22, 7, -10, k.h) + P.c(34, 70, 16, k.a) + P.c(66, 68, 16, k.b); }],
    arandano: [/ar[aá]ndano|blueberr/i, 'Arándanos', ['#3D4F9E', '#5C6FB8', '#4E8A3A', '#222A55'], function (k) { var s = ''; [[36, 56, 18], [64, 52, 17], [50, 74, 16]].forEach(function (q, i) { s += P.c(q[0], q[1], q[2], i % 2 ? k.b : k.a) + P.p('M' + (q[0] - 4) + ',' + (q[1] - q[2] + 5) + ' l4,-4 l4,4 l-4,3 Z', k.s); }); return hoja(52, 30, 22, 7, -60, k.h) + s; }],
    frambuesa: [/frambuesa/i, 'Frambuesa', ['#D8335E', '#EE6A8A', '#4E8A3A', '#A2203E'], function (k) { var s = ''; for (var y = 0; y < 5; y++) for (var x = 0; x < 5 - Math.abs(y - 2) * .5; x++) s += P.c(r1(50 - (4 - Math.abs(y - 2) * .5) * 5.5 + x * 11), 36 + y * 11, 6.4, (x + y) % 2 ? k.a : k.b); return s + P.p('M36,30 L44,22 L50,28 L56,22 L64,30 L50,34 Z', k.h); }],
    mora: [/\bmoras?\b|zarzamora/i, 'Mora', ['#3A2350', '#5A3A74', '#4E8A3A', '#221133'], function (k) { return D.frambuesa[3](k); }],
    papaya: [/papaya|lechosa/i, 'Papaya', ['#F28B3A', '#F6C25A', '#6E9A3A', '#2A2A2A'], function (k) { var s = ''; for (var i = 0; i < 12; i++) s += P.c(r1(42 + (i % 3) * 8), 42 + Math.floor(i / 3) * 9, 3, k.s); return P.p('M50,10 C74,10 86,44 82,70 C78,90 22,90 18,70 C14,44 26,10 50,10 Z', k.h) + P.p('M50,16 C70,16 80,44 76,68 C72,84 28,84 24,68 C20,44 30,16 50,16 Z', k.a) + P.e(50, 56, 12, 24, k.b) + s; }],
    aguacate: [/aguacate|palta/i, 'Aguacate', ['#E4E6A0', '#3E6B2A', '#6E9A3A', '#8A5A2E'], function (k) { return P.p('M50,8 C66,8 70,30 76,46 C88,70 74,94 50,94 C26,94 12,70 24,46 C30,30 34,8 50,8 Z', k.b) + P.p('M50,14 C62,14 66,32 70,48 C80,70 68,88 50,88 C32,88 20,70 30,48 C34,32 38,14 50,14 Z', k.a) + P.c(50, 62, 14, k.s); }],
    coco: [/\bcoco\b|agua de coco/i, 'Coco', ['#7A4E2A', '#F7F3E8', '#5A8A3A', '#4A2E18'], function (k) { return P.c(50, 52, 36, k.a) + P.p('M18,52 A32,32 0 0 0 82,52 Z', k.b) + P.p('M14,52 L86,52', k.s) + P.l('M14,52 L86,52', k.s, 2) + puntos(50, 34, 20, 10, 8, 1, k.s, 7); }],
    maracuya: [/maracuy[aá]|parchita|chinola|pasi[oó]n/i, 'Maracuyá', ['#6B2E6A', '#F2C23A', '#4E8A3A', '#2A1A0A'], function (k) { return P.c(50, 52, 36, k.a) + P.c(50, 52, 28, k.b) + puntos(50, 52, 20, 20, 16, 1.6, k.s, 9); }],
    durazno: [/durazno|melocot[oó]n/i, 'Melocotón', ['#F39A6A', '#E8604A', '#4E8A3A', '#6B4A2B'], function (k) { return P.c(50, 56, 34, k.a) + P.p('M50,22 C40,40 40,72 50,90 C44,70 44,40 50,22 Z', k.b) + hoja(52, 22, 22, 7, -35, k.h); }],
    guayaba: [/guayaba/i, 'Guayaba', ['#A8C84A', '#F28A8A', '#4E8A3A', '#F7E2B0'], function (k) { return P.c(50, 52, 34, k.a) + P.p('M16,52 A34,34 0 0 0 84,52 Z', k.b) + puntos(50, 64, 18, 10, 10, 1.3, k.s, 11); }],
    melon: [/mel[oó]n/i, 'Melón', ['#C9D46A', '#F4B26A', '#5A8A3A', '#8A9A4A'], function (k) { var s = ''; for (var i = -2; i <= 2; i++) s += P.l('M' + (50 + i * 12) + ',22 Q' + (50 + i * 16) + ',52 ' + (50 + i * 12) + ',84', k.s, 1.2); return P.e(50, 53, 38, 32, k.a) + s; }],
    zanahoria: [/zanahoria/i, 'Zanahoria', ['#F07A24', '#E0601A', '#3E8E3A', '#B8501A'], function (k) { return hoja(48, 22, 22, 5, -110, k.h) + hoja(50, 22, 24, 5, -80, k.h) + hoja(52, 22, 20, 5, -50, k.h) + P.p('M36,24 C44,20 56,20 64,24 C62,50 56,76 50,94 C44,76 38,50 36,24 Z', k.a) + P.l('M40,40 L46,42 M56,52 L60,50 M44,62 L49,64', k.s, 1.4); }],
    espinaca: [/espinaca|kale|col rizada|acelga|lechuga|verde/i, 'Espinaca', ['#3E8E3A', '#5AAE4A', '#2E6A2A', '#CFE8B0'], function (k) { return hoja(50, 92, 70, 22, -100, k.a) + hoja(46, 92, 56, 16, -135, k.b) + hoja(54, 92, 56, 16, -55, k.b) + nervio(50, 92, 68, -100, k.s) + nervio(46, 92, 54, -135, k.s) + nervio(54, 92, 54, -55, k.s); }],
    menta: [/menta|hierbabuena|albahaca/i, 'Menta', ['#4EA84A', '#6CC06A', '#3E6A2A', '#CFE8B0'], function (k) { return P.l('M50,94 L50,14', k.h, 2.4) + [[20, -150], [34, -30], [48, -150], [62, -30], [74, -150]].map(function (q, i) { return hoja(50, 90 - q[0], 22 - i * 2, 9 - i, q[1], i % 2 ? k.a : k.b) + nervio(50, 90 - q[0], 20 - i * 2, q[1], k.s); }).join(''); }],
    apio: [/apio/i, 'Apio', ['#9CCB5A', '#C8E28A', '#4E8A3A', '#7AAA3A'], function (k) { return [[-10, -94], [0, -90], [10, -86]].map(function (q, i) { return '<path d="M' + (44 + i * 6) + ',94 L' + (46 + q[0] * .3 + i * 6) + ',30" stroke="' + (i % 2 ? k.b : k.a) + '" stroke-width="11" stroke-linecap="round" fill="none"/>'; }).join('') + hoja(40, 30, 18, 7, -130, k.h) + hoja(52, 26, 18, 7, -80, k.h) + hoja(60, 30, 18, 7, -40, k.h); }],
    pepino: [/pepino/i, 'Pepino', ['#3E7A3A', '#8CC46A', '#2E5A2A', '#CFE8B0'], function (k) { return P.r(14, 38, 72, 26, 13, k.a) + P.c(78, 51, 11, k.b) + P.c(78, 51, 8, k.s) + puntos(44, 51, 24, 8, 10, .9, k.s, 13); }],
    tomate: [/tomate/i, 'Tomate', ['#E23B2E', '#F26B5B', '#3E8E3A', '#FFFFFF'], function (k) { return P.e(50, 56, 36, 32, k.a) + P.e(38, 46, 7, 4, k.s, -30, ' opacity=".5"') + P.p('M36,28 L46,32 L50,22 L54,32 L64,28 L58,36 L50,34 L42,36 Z', k.h); }],
    remolacha: [/remolacha|betarraga|betabel/i, 'Remolacha', ['#8A1E4A', '#B83A6A', '#3E8E3A', '#B83A6A'], function (k) { return hoja(46, 36, 26, 8, -115, k.h) + hoja(54, 36, 26, 8, -65, k.h) + P.c(50, 62, 26, k.a) + P.l('M50,88 L52,96', k.b, 2.5); }],
    jengibre: [/jengibre|c[uú]rcuma/i, 'Jengibre', ['#D8B06A', '#E8C88A', '#8A6A3A', '#8A6A3A'], function (k) { return P.p('M14,60 C14,48 28,46 34,50 C36,38 48,34 54,42 C60,34 74,36 74,48 C86,48 90,62 80,68 C70,76 30,78 20,72 C16,70 14,66 14,60 Z', k.a) + P.l('M30,58 L34,62 M52,52 L54,58 M68,56 L72,60', k.s, 1.4); }],
    avena: [/avena|copos/i, 'Avena', ['#E6C98A', '#D2B06A', '#B89A5A', '#8A6A3A'], function (k) { var s = P.l('M50,94 L50,12', k.h, 2); for (var i = 0; i < 6; i++) s += P.e(i % 2 ? 60 : 40, 22 + i * 11, 6, 10, i % 2 ? k.a : k.b, i % 2 ? 30 : -30); return s; }],
    trigo: [/harina|trigo/i, 'Trigo', ['#E6B84A', '#D2A03A', '#B8903A', '#8A6A2A'], function (k) { var s = P.l('M50,94 L50,10', k.h, 2); for (var i = 0; i < 7; i++) s += P.e(44, 18 + i * 8, 4, 7, k.a, -25) + P.e(56, 18 + i * 8, 4, 7, k.b, 25); return s + P.l('M50,12 L50,2', k.s, 1); }],
    chia: [/ch[ií]a|linaza|semilla/i, 'Semillas', ['#5A5048', '#8A8078', '#B8AFA2', '#3A322A'], function (k) { return P.e(50, 78, 38, 10, k.c) + puntos(50, 66, 30, 16, 60, 1.6, k.a, 17) + puntos(50, 64, 26, 12, 30, 1.6, k.b, 19); }],
    almendra: [/almendra/i, 'Almendras', ['#B87A4A', '#D8A06A', '#8A5A2E', '#8A5A2E'], function (k) { return [[34, 50, -20], [60, 44, 20], [50, 70, 80]].map(function (q) { return P.p('M0,-20 C12,-10 12,12 0,20 C-12,12 -12,-10 0,-20 Z', k.a, ' transform="translate(' + q[0] + ' ' + q[1] + ') rotate(' + q[2] + ')"') + P.l('M' + q[0] + ',' + (q[1] - 12) + ' L' + q[0] + ',' + (q[1] + 12), k.s, 1); }).join(''); }],
    nuez: [/nuez|nueces|cacahuete|man[ií]|cacahuate/i, 'Nueces', ['#A8763E', '#C8965A', '#7A5020', '#7A5020'], function (k) { return P.c(50, 52, 32, k.a) + P.l('M50,20 L50,84', k.s, 2) + P.l('M30,36 Q40,44 30,52 Q40,60 30,70 M70,36 Q60,44 70,52 Q60,60 70,70', k.s, 1.6); }],
    cacao: [/cacao|chocolate/i, 'Cacao', ['#7A3E1E', '#A85A2E', '#4E8A3A', '#4A2410'], function (k) { var s = ''; for (var i = -2; i <= 2; i++) s += P.l('M' + (50 + i * 7) + ',18 Q' + (50 + i * 10) + ',52 ' + (50 + i * 7) + ',86', k.s, 1.2); return P.e(50, 52, 24, 36, k.a) + s + P.l('M50,16 L50,8', k.h, 3); }],
    canela: [/canela/i, 'Canela', ['#A8602E', '#C8804A', '#7A4018', '#7A4018'], function (k) { return [0, 12].map(function (d) { return P.r(18 + d, 30 + d * 1.6, 64, 14, 7, d ? k.b : k.a, ' transform="rotate(-18 50 50)"') + P.l('M' + (22 + d) + ',' + (37 + d * 1.6) + ' L' + (78 + d) + ',' + (37 + d * 1.6), k.s, 1); }).join(''); }],
    huevo: [/huevo|clara/i, 'Huevo', ['#F4E8D2', '#FFFFFF', '#E8D2B0', '#C8B090'], function (k) { return P.p('M50,10 C70,10 82,44 82,62 C82,82 68,92 50,92 C32,92 18,82 18,62 C18,44 30,10 50,10 Z', k.a) + P.e(40, 40, 6, 10, k.b, -20, ' opacity=".8"'); }],
    leche: [/leche|bebida de|kéfir|kefir/i, 'Leche', ['#F7F7F2', '#6AA0D8', '#DDE8F2', '#4A7AB0'], function (k) { return P.p('M38,10 L62,10 L62,22 L72,34 L72,90 L28,90 L28,34 L38,22 Z', k.a) + P.r(28, 50, 44, 22, 0, k.b) + P.r(36, 6, 28, 8, 2, k.s); }],
    yogur: [/yogur|queso|reques[oó]n|nata|crema/i, 'Yogur', ['#F7F2EA', '#E8A0B0', '#D8D2C8', '#B87A8A'], function (k) { return P.p('M22,34 L78,34 L72,88 L28,88 Z', k.a) + P.r(18, 26, 64, 10, 3, k.b) + P.p('M30,54 L70,54 L68,68 L32,68 Z', k.c); }],
    miel: [/miel|sirope|agave/i, 'Miel', ['#E8A42A', '#F7D27A', '#8A5A1A', '#FFFFFF'], function (k) { return P.r(24, 32, 52, 58, 10, k.a) + P.r(20, 22, 60, 12, 3, k.s) + P.p('M34,56 L42,50 L50,56 L50,66 L42,72 L34,66 Z', k.b) + P.p('M50,56 L58,50 L66,56 L66,66 L58,72 L50,66 Z', k.b, ' opacity=".7"'); }],
    mantequilla: [/mantequilla|manteca|margarina/i, 'Mantequilla', ['#F7E08A', '#FBEFC0', '#D8C06A', '#B89A3A'], function (k) { return P.p('M16,50 L60,36 L86,48 L42,62 Z', k.b) + P.p('M16,50 L42,62 L42,80 L16,68 Z', k.a) + P.p('M42,62 L86,48 L86,66 L42,80 Z', k.c); }],
    azucar: [/az[uú]car|panela|stevia|endulzante/i, 'Azúcar', ['#FFFFFF', '#EEE8DC', '#D8D0C0', '#B8B0A0'], function (k) { return [[24, 52], [52, 52], [38, 28]].map(function (q) { return P.p('M' + q[0] + ',' + (q[1] + 8) + ' l12,-8 l14,6 l0,16 l-12,8 l-14,-6 Z', k.a) + P.p('M' + q[0] + ',' + (q[1] + 8) + ' l14,6 l0,16 l-14,-6 Z', k.b) + P.p('M' + (q[0] + 14) + ',' + (q[1] + 14) + ' l12,-8 l0,16 l-12,8 Z', k.c); }).join(''); }],
    sal: [/\bsal\b/i, 'Sal', ['#FFFFFF', '#DDE3EA', '#8A96A8', '#8A96A8'], function (k) { return P.p('M34,30 L66,30 L70,90 L30,90 Z', k.a) + P.p('M34,30 C34,14 66,14 66,30 Z', k.c) + puntos(50, 22, 8, 3, 5, .8, k.s, 23); }],
    agua: [/\bagua\b|hielo|t[eé] verde|infusi/i, 'Agua', ['#BFE3F2', '#E6F4FA', '#6AB0D8', '#FFFFFF'], function (k) { return P.p('M50,10 C60,30 78,48 78,64 C78,80 66,92 50,92 C34,92 22,80 22,64 C22,48 40,30 50,10 Z', k.a) + P.e(40, 60, 6, 12, k.s, -20, ' opacity=".8"'); }],
    tofu: [/tofu|prote[ií]na|suero|whey/i, 'Proteína', ['#F2EAD8', '#D8CBB0', '#B8AA8A', '#8A7A5A'], function (k) { return P.r(28, 26, 44, 64, 8, k.a) + P.r(24, 18, 52, 12, 4, k.c) + P.r(34, 46, 32, 20, 3, k.b); }],
    hoja: [/hoja|hierba|planta/i, 'Hoja', ['#4E9A3A', '#7ABE5A', '#3E6A2A', '#CFE8B0'], function (k) { return hoja(18, 82, 80, 26, -45, k.a) + nervio(18, 82, 78, -45, k.s) + P.l('M8,92 L18,82', k.h, 3); }],
    flor: [/flor|jamaica|manzanilla/i, 'Flor', ['#E86A9A', '#F7C23A', '#4E8A3A', '#F7E2EA'], function (k) { var s = P.l('M50,94 L50,52', k.h, 3) + hoja(50, 76, 20, 7, -30, k.h); for (var i = 0; i < 6; i++) s += P.e(r1(50 + Math.cos(i * Math.PI / 3) * 16), r1(38 + Math.sin(i * Math.PI / 3) * 16), 11, 7, k.a, i * 60); return s + P.c(50, 38, 9, k.b); }]
  };
  var ORDEN = ['manzana_v', 'manzana', 'pera', 'naranja', 'limon', 'platano', 'fresa', 'uva', 'pina', 'mango', 'sandia', 'kiwi', 'cereza', 'arandano', 'frambuesa', 'mora', 'papaya', 'aguacate', 'maracuya', 'durazno', 'guayaba', 'melon', 'zanahoria', 'apio', 'pepino', 'tomate', 'remolacha', 'jengibre', 'menta', 'avena', 'chia', 'almendra', 'nuez', 'cacao', 'canela', 'huevo', 'yogur', 'mantequilla', 'miel', 'azucar', 'sal', 'tofu', 'trigo', 'leche', 'coco', 'agua', 'espinaca', 'hoja', 'flor'];
  function deIngrediente(t) { t = String(t || ''); for (var i = 0; i < ORDEN.length; i++) if (D[ORDEN[i]][0].test(t)) return ORDEN[i]; return null; }
  function idsDe(rc) { var v = []; (rc.ing || []).forEach(function (g) { var id = deIngrediente(g[2]); if (id && v.indexOf(id) < 0) v.push(id); }); return v; }

  /* ─────────── color ─────────── */
  function paleta(id, modo, T) {
    var n = D[id][2], k = { a: n[0], b: n[1], h: n[2], s: n[3] }, t = '#2a2a2a';
    if (modo === 'linea') return { a: '#fff', b: '#fff', h: '#fff', s: '#fff', c: '#fff', t: (T && T.ink) || '#222', linea: true };
    if (modo === 'tema' && T) { var i = ORDEN.indexOf(id) % 3; k = { a: [T.acc, T.acc2, osc(T.acc, .25)][i], b: [clr(T.acc, .35), clr(T.acc2, .35), T.acc][i], h: osc(T.acc2, .15), s: osc(T.acc, .45) }; }
    if (modo === 'suave') { k = { a: clr(k.a, .45), b: clr(k.b, .45), h: clr(k.h, .4), s: clr(k.s, .3) }; }
    if (modo === 'mono' && T) { k = { a: clr(T.ink, .55), b: clr(T.ink, .75), h: clr(T.ink, .4), s: clr(T.ink, .2) }; }
    k.c = osc(k.a, .12); k.t = osc(k.a, .5);
    return k;
  }
  /* Dibujo suelto: devuelve un <svg>. o = { modo, T, d3, w (px), g (solo el grupo, sin <svg>) } */
  function dibujo(id, o) {
    o = o || {}; if (!D[id]) id = 'hoja';
    var k = paleta(id, o.modo || 'color', o.T), cuerpo = D[id][3](k), sw = k.linea ? 1.3 : 1.2;
    var g = '<g stroke="' + k.t + '" stroke-width="' + sw + '" stroke-linejoin="round">' + cuerpo + '</g>';
    if (k.linea) g = g.replace(/stroke="#fff"([^>]*?) data-l="1"/g, 'stroke="' + k.t + '"$1');
    if (o.d3 && !k.linea) g = '<g transform="translate(2.5 3.5)" opacity=".18">' + cuerpo.replace(/fill="[^"]+"/g, 'fill="#000"').replace(/stroke="[^"]+"/g, 'stroke="#000"') + '</g>' + g + '<ellipse cx="38" cy="36" rx="10" ry="6" fill="#fff" opacity=".28" transform="rotate(-30 38 36)"/>';
    if (o.g) return g;
    return '<svg ' + NS + ' data-plano="1" viewBox="-4 -4 108 108" style="width:' + (o.w ? o.w + 'px' : '100%') + ';height:auto;display:block;overflow:visible">' + g + '</svg>';
  }
  function modoDe(C) { var m = ((C.cfg && C.cfg.acab) || {}).ilus || 'auto'; return m === 'auto' ? 'color' : m; }
  function d3De(C) { return C.prem ? C.prem.dibujo === '3d' : (((C.cfg && C.cfg.acab) || {}).dibujo || '3d') === '3d'; }
  /* Bodegón: varios dibujos en abanico sobre una forma suave del diseño. */
  function bodegon(ids, C, o) {
    o = o || {}; ids = (ids || []).filter(function (x) { return D[x]; }).slice(0, o.max || 6); if (!ids.length) ids = ['hoja', 'flor'];
    var T = C.T, modo = o.modo || modoDe(C), d3 = o.d3 != null ? o.d3 : d3De(C), n = ids.length, W = 600, Hh = o.alto || 300, s = '';
    var fondo = o.fondo === false ? '' : modo === 'linea' ? '' : '<ellipse cx="' + W / 2 + '" cy="' + (Hh * .56) + '" rx="' + (W * .46) + '" ry="' + (Hh * .44) + '" fill="' + T.soft + '"/>' + '<ellipse cx="' + (W * .72) + '" cy="' + (Hh * .3) + '" rx="' + (W * .16) + '" ry="' + (Hh * .2) + '" fill="' + T.soft2 + '" opacity=".9"/>';
    var tam = Math.min(Hh * .7, (W - 40) / Math.max(1, n * .78)), fila = n > 4 ? 2 : 1, porFila = Math.ceil(n / fila);
    ids.forEach(function (id, i) {
      var f = Math.floor(i / porFila), j = i % porFila, m = f ? n - porFila : porFila, sz = tam * (fila > 1 ? .78 : 1) * (1 - (j % 2) * .1);
      var x = W / 2 + (j - (m - 1) / 2) * sz * .82 - sz / 2, y = (fila > 1 ? (f ? Hh * .42 : Hh * .06) : Hh * .5 - sz / 2) + (j % 2) * sz * .08;
      s += '<g transform="translate(' + r1(x) + ' ' + r1(y) + ') scale(' + r1(sz / 100 * 100) / 100 + ')">' + dibujo(id, { modo: modo, T: T, d3: d3, g: true }) + '</g>';
    });
    var et = o.nombres ? '<div style="display:flex;flex-wrap:wrap;gap:1mm 4mm;justify-content:center;font-size:.8em;margin-top:1.5mm;opacity:.85">' + ids.map(function (x) { return '<span>' + esc(D[x][1]) + '</span>'; }).join('<span style="opacity:.4">·</span>') + '</div>' : '';
    return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + W + ' ' + Hh + '" style="width:100%;max-width:' + (o.maxw || W) + 'px;height:auto;display:block;margin:0 auto">' + fondo + s + '</svg>' + et;
  }
  function orla(ids, C, o) { o = o || {}; var n = o.n || 8, s = ''; for (var i = 0; i < n; i++) s += '<div style="width:' + (o.mm || 12) + 'mm;flex:none;opacity:' + (o.op || .9) + '">' + dibujo(ids[i % ids.length], { modo: o.modo || modoDe(C), T: C.T, d3: false }) + '</div>'; return '<div style="display:flex;justify-content:space-between;gap:2mm">' + s + '</div>'; }
  function lista() { return ORDEN.map(function (id) { return { id: id, n: D[id][1] }; }); }

  /* ─────────── recetario: bodegón en lugar del hueco de foto ─────────── */
  var HUECO = /<div style="height:(\d+(?:\.\d+)?)mm;border:0\.5mm dashed[^"]*">([^<]*)<\/div>/;
  var CATS_IDS = { reposteria: ['huevo', 'trigo', 'azucar', 'mantequilla', 'limon', 'leche'], panaderia: ['trigo', 'agua', 'sal', 'avena', 'chia'], pasteleria: ['cacao', 'fresa', 'huevo', 'azucar', 'mantequilla', 'frambuesa'], batidos: ['mango', 'fresa', 'platano', 'pina', 'kiwi', 'espinaca'] };
  function post(h, pg, C) {
    if (!/^coc_(receta_a|capitulo)$|^bat_/.test(pg.tipo || '')) return h;
    var m = HUECO.exec(h); if (!m) return h;
    var ids = pg.rc ? idsDe(pg.rc) : (CATS_IDS[pg.cat] || pg.ids || []);
    if (pg.rc && ids.length < 3) ids = ids.concat((CATS_IDS[pg.rc.cat] || []).filter(function (x) { return ids.indexOf(x) < 0; })).slice(0, 4);
    var alto = +m[1], T = C.T;
    return h.replace(HUECO, '<div style="height:' + alto + 'mm;display:flex;flex-direction:column;justify-content:center;border-radius:' + T.r + 'px;overflow:hidden">' + bodegon(ids, C, { nombres: true, alto: Math.round(alto * 3.6), max: 6 }) + '</div>');
  }
  ED.registrar({ post: post });

  /* ─────────── panel ─────────── */
  var CN = window.EU_CONECTORES;
  if (CN && CN.panel && !CN.panel._botanica) {
    var orig = CN.panel;
    var nuevo = function (ed, seccion, U) {
      var el = U.el, ST = U.ST, chip = U.chip, A = (ed.cfg.acab || {}), v = A.ilus || 'auto';
      var s = seccion('Ilustraciones');
      s.appendChild(el('div', ST.lbl, 'Color de los dibujos (frutas, verduras, despensa)'));
      var f = el('div', ST.fila);
      [['auto', 'Natural'], ['tema', 'Del diseño'], ['suave', 'Pastel'], ['mono', 'Una tinta'], ['linea', 'Para colorear']].forEach(function (o) { var b = el('button', chip(v === o[0]), o[1]); b.onclick = function () { var a = Object.assign({}, ed.cfg.acab || {}); a.ilus = o[0]; ed.set('acab', a); }; f.appendChild(b); });
      s.appendChild(f);
      var mu = el('div', 'display:flex;gap:4px;flex-wrap:wrap;margin-top:6px');
      ['fresa', 'mango', 'aguacate', 'zanahoria', 'kiwi', 'cacao'].forEach(function (id) { var d = el('div', 'width:34px'); d.innerHTML = dibujo(id, { modo: v === 'auto' ? 'color' : v, T: { acc: '#B5542D', acc2: '#5B7B3A', ink: '#222' } }); mu.appendChild(d); });
      s.appendChild(mu);
      s.appendChild(el('div', ST.nota, 'Cuando una receta no tiene foto, su hueco se llena con un bodegón de sus ingredientes. «Del diseño» toma los colores de la plantilla y cambia con la rotación.'));
      return orig.apply(this, arguments);
    };
    for (var q in orig) if (/^_/.test(q)) nuevo[q] = orig[q];
    nuevo._botanica = true; CN.panel = nuevo;
  }

  window.EU_BOTANICA = { D: D, ORDEN: ORDEN, dibujo: dibujo, bodegon: bodegon, orla: orla, deIngrediente: deIngrediente, idsDe: idsDe, lista: lista, paleta: paleta, modoDe: modoDe };
})();
