/* b6_mates_plus.js — Geometría y Álgebra y Cálculo en cuatro niveles, y Física ampliada.
   · Materias nuevas «geoalg» (Geometría y Álgebra) y «calculo» (Cálculo), cada una con
     4 niveles: 1 Básico · 2 Intermedio · 3 Avanzado · 4 Superior. Opción «Nivel» en el panel
     (por defecto «Los cuatro niveles»: el libro recorre del 1 al 4 en orden).
   · Física: ocho unidades nuevas y generadores con proceso resuelto para todas sus unidades.
   · Cada generador devuelve el ejercicio con su respuesta y los pasos del proceso (x), que usan
     la página «Así se resuelve», el solucionario, los exámenes y el test interactivo.
   · Unidades sin generador en cualquier materia reciben «proc_orden»: ordenar el proceso de la
     figura, verdadero/falso justificado o completar la idea, siempre con respuesta.
   Cargar después de b6_laminas_plus.js y antes de b6_portada_edicion.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, CU = window.EU_CURRICULO;
  if (!ED || !CU || window.EU_MATES_PLUS) return;
  var H = ED.H, it = H.it, ent = H.ent, pick = H.pick;
  function r2(n) { return Math.round(n * 100) / 100; }
  function r4(n) { return Math.round(n * 10000) / 10000; }
  function nm(n, C) { return H.num(r2(n), C); }
  function ac() { var o = []; Array.prototype.forEach.call(arguments, function (v) { o.push(v, String(v).replace(/\s+/g, ''), String(v).replace(/\./g, ',')); }); return o.filter(function (v, i, a) { return a.indexOf(v) === i; }); }
  var SUP = ['', '', '²', '³', '⁴', '⁵', '⁶'];
  function mon(a, d, v) { v = v || 'x'; var c = Math.abs(a); return (c === 1 && d > 0 ? '' : String(c)) + (d > 0 ? v + SUP[d] : ''); }
  /* polinomio: cs de mayor a menor grado */
  function poli(cs, v) {
    var s = '', g = cs.length - 1;
    cs.forEach(function (a, i) { if (!a) return; var d = g - i; s += (s ? (a < 0 ? ' − ' : ' + ') : (a < 0 ? '−' : '')) + mon(a, d, v); });
    return s || '0';
  }
  function ec2(a, b, c) { return (a < 0 ? '−' : '') + mon(a, 1, 'x') + (b < 0 ? ' − ' : ' + ') + mon(b, 1, 'y') + ' = ' + c; }
  function par(n) { return n < 0 ? '(' + n + ')' : String(n); }
  function mn(n) { return n < 0 ? '− ' + (-n) : '+ ' + n; }
  function xc(h) { return h === 0 ? 'x' : '(x ' + (h > 0 ? '− ' + h : '+ ' + (-h)) + ')'; }
  function yc(k) { return k === 0 ? 'y' : '(y ' + (k > 0 ? '− ' + k : '+ ' + (-k)) + ')'; }
  function nz(r, a, b) { var v = 0; while (!v) v = ent(r, a, b); return v; }
  function ciudad(C, r) { return pick(r, C.P.ciudades); }
  function nombre(C, r) { return pick(r, C.P.nombres); }
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function frac(p, q) { if (q < 0) { p = -p; q = -q; } var g = mcd(p, q); p /= g; q /= g; return q === 1 ? String(p) : p + '/' + q; }
  function matriz(M) { var c = M[0].length; return '<span style="display:inline-grid;grid-template-columns:repeat(' + c + ',auto);gap:0 3mm;border-left:0.4mm solid currentColor;border-right:0.4mm solid currentColor;padding:0 2mm;vertical-align:middle;text-align:right;font-variant-numeric:tabular-nums">' + M.map(function (f) { return f.map(function (v) { return '<span>' + (v < 0 ? '−' + (-v) : v) + '</span>'; }).join(''); }).join('') + '</span>'; }
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [12, 16, 20]];

  /* ─────────── generadores: Geometría y Álgebra ─────────── */
  var GEN = {
    ga_angulos: function (u, C, r) {
      var a = ent(r, 15, 75), b = ent(r, 20, 80), v = ent(r, 0, 2);
      if (v === 0) return it('corta', 'Un ángulo mide ' + a + '°. ¿Cuánto mide su complementario?', (90 - a) + '°', { ac: ac(90 - a, (90 - a) + '°'), x: 'Dos ángulos complementarios suman 90°: 90° − ' + a + '° = ' + (90 - a) + '°.' });
      if (v === 1) return it('corta', 'Un ángulo mide ' + a + '°. ¿Cuánto mide su suplementario?', (180 - a) + '°', { ac: ac(180 - a, (180 - a) + '°'), x: 'Dos ángulos suplementarios suman 180°: 180° − ' + a + '° = ' + (180 - a) + '°.' });
      var c = 180 - a - b;
      return it('corta', 'Dos ángulos de un triángulo miden ' + a + '° y ' + b + '°. ¿Cuánto mide el tercero? ¿Qué tipo de triángulo es según sus ángulos?', c + '°, ' + (c > 90 || a > 90 || b > 90 ? 'obtusángulo' : c === 90 ? 'rectángulo' : 'acutángulo'), { ac: ac(c, c + '°'), x: 'Los ángulos de un triángulo suman 180°: 180° − ' + a + '° − ' + b + '° = ' + c + '°.' });
    },
    ga_perimetro: function (u, C, r) {
      var v = ent(r, 0, 2), l = ent(r, 4, 25), w = ent(r, 2, 15);
      if (v === 0) return it('corta', 'Un huerto rectangular de ' + ciudad(C, r) + ' mide ' + l + ' m de largo y ' + w + ' m de ancho. ¿Cuántos metros de valla hacen falta para rodearlo?', (2 * (l + w)) + ' m', { ac: ac(2 * (l + w)), x: 'Perímetro = 2 · (largo + ancho) = 2 · (' + l + ' + ' + w + ') = ' + (2 * (l + w)) + ' m.' });
      var n = ent(r, 3, 8), NOM = ['', '', '', 'triángulo equilátero', 'cuadrado', 'pentágono regular', 'hexágono regular', 'heptágono regular', 'octógono regular'][n];
      if (v === 1) return it('corta', '¿Cuál es el perímetro de un ' + NOM + ' de ' + w + ' cm de lado?', (n * w) + ' cm', { ac: ac(n * w), x: 'Tiene ' + n + ' lados iguales: ' + n + ' × ' + w + ' = ' + (n * w) + ' cm.' });
      return it('corta', 'El perímetro de un cuadrado es ' + (4 * l) + ' cm. ¿Cuánto mide cada lado? ¿Y su área?', l + ' cm; ' + (l * l) + ' cm²', { ac: ac(l, l + ' cm'), x: 'Lado = ' + (4 * l) + ' ÷ 4 = ' + l + ' cm. Área = ' + l + ' × ' + l + ' = ' + (l * l) + ' cm².' });
    },
    ga_area: function (u, C, r) {
      var v = ent(r, 0, 3), b = 2 * ent(r, 2, 12), h = ent(r, 3, 14), R = ent(r, 2, 10);
      if (v === 0) return it('corta', 'Calcula el área de un triángulo de base ' + b + ' cm y altura ' + h + ' cm.', (b * h / 2) + ' cm²', { ac: ac(b * h / 2), x: 'Área = base × altura ÷ 2 = ' + b + ' × ' + h + ' ÷ 2 = ' + (b * h / 2) + ' cm².' });
      if (v === 1) return it('corta', 'Calcula el área de un círculo de radio ' + R + ' cm (usa π ≈ 3,14).', nm(3.14 * R * R, C) + ' cm²', { ac: ac(r2(3.14 * R * R), nm(3.14 * R * R, C), r2(Math.PI * R * R), nm(Math.PI * R * R, C)), x: 'Área = π · r² = 3,14 · ' + R + '² = 3,14 · ' + (R * R) + ' ≈ ' + nm(3.14 * R * R, C) + ' cm².' });
      if (v === 2) { var B = b + ent(r, 2, 8); return it('corta', 'Un trapecio tiene bases de ' + B + ' cm y ' + b + ' cm, y una altura de ' + h + ' cm. ¿Cuál es su área?', ((B + b) * h / 2) + ' cm²', { ac: ac((B + b) * h / 2), x: 'Área = (B + b) · h ÷ 2 = (' + B + ' + ' + b + ') · ' + h + ' ÷ 2 = ' + ((B + b) * h / 2) + ' cm².' }); }
      var l = ent(r, 3, 9) * 100, w = ent(r, 2, 6) * 100, bal = ent(r, 20, 40);
      return it('corta', 'Un salón de ' + (l / 100) + ' m × ' + (w / 100) + ' m se cubre con baldosas cuadradas de ' + bal + ' cm de lado. ¿Cuántas baldosas hacen falta como mínimo?', String(Math.ceil(l / bal) * Math.ceil(w / bal)), { ac: ac(Math.ceil(l / bal) * Math.ceil(w / bal)), x: 'A lo largo caben ' + Math.ceil(l / bal) + ' y a lo ancho ' + Math.ceil(w / bal) + ' (se redondea hacia arriba porque las piezas se cortan): ' + Math.ceil(l / bal) + ' × ' + Math.ceil(w / bal) + '.' });
    },
    al_patron: function (u, C, r) {
      var a = ent(r, 1, 12), d = nz(r, -3, 7), s = [a, a + d, a + 2 * d, a + 3 * d];
      if (r() < 0.5) return it('corta', '¿Qué número sigue? ' + s.join(', ') + ', …', String(a + 4 * d), { ac: ac(a + 4 * d), x: 'Cada término se obtiene sumando ' + d + ' al anterior: ' + s[3] + ' ' + mn(d) + ' = ' + (a + 4 * d) + '.' });
      return it('corta', 'En la secuencia ' + s.join(', ') + ', … ¿cuál es el término número 10? Escribe la regla.', String(a + 9 * d), { ac: ac(a + 9 * d), x: 'aₙ = a₁ + (n − 1) · d = ' + a + ' + 9 · ' + par(d) + ' = ' + (a + 9 * d) + '.' });
    },
    al_valor: function (u, C, r) {
      var T = [['el doble de un número', '2x'], ['el triple de un número menos cuatro', '3x − 4'], ['la mitad de un número', 'x/2'], ['un número al cuadrado más uno', 'x² + 1'], ['la suma de dos números consecutivos', 'x + (x + 1)'], ['el cuadrado de un número menos su doble', 'x² − 2x'], ['un número más su quinta parte', 'x + x/5'], ['el perímetro de un cuadrado de lado x', '4x']];
      if (r() < 0.45) { var t = pick(r, T); return it('corta', 'Escribe en lenguaje algebraico: «' + t[0] + '».', t[1], { ac: ac(t[1], t[1].replace(/²/g, '^2')), x: 'Llamamos x al número desconocido y traducimos cada palabra a una operación.' }); }
      var a = nz(r, -5, 6), b = ent(r, -9, 9), x = ent(r, -4, 6);
      return it('corta', 'Calcula el valor numérico de ' + poli([a, b]) + ' para x = ' + x + '.', String(a * x + b), { ac: ac(a * x + b), x: 'Sustituimos x por ' + x + ': ' + a + ' · ' + par(x) + ' ' + mn(b) + ' = ' + (a * x) + ' ' + mn(b) + ' = ' + (a * x + b) + '.' });
    },
    al_ecua1: function (u, C, r) {
      var x = ent(r, 1, 12), a = ent(r, 2, 6), b = ent(r, 1, 20), c = a * x + b;
      if (r() < 0.4) { var nom = nombre(C, r); return it('corta', 'En una balanza, ' + a + ' cajas iguales y una pesa de ' + b + ' kg equilibran ' + c + ' kg. ¿Cuánto pesa cada caja? (' + nom + ' lo plantea como ecuación.)', x + ' kg', { ac: ac(x, x + ' kg'), x: a + 'x + ' + b + ' = ' + c + ' → ' + a + 'x = ' + (c - b) + ' → x = ' + (c - b) + ' ÷ ' + a + ' = ' + x + '.' }); }
      return it('corta', 'Resuelve: ' + a + 'x + ' + b + ' = ' + c, 'x = ' + x, { ac: ac(x, 'x = ' + x), x: 'Restamos ' + b + ' en los dos miembros: ' + a + 'x = ' + (c - b) + '. Dividimos entre ' + a + ': x = ' + x + '. Comprobación: ' + a + ' · ' + x + ' + ' + b + ' = ' + c + '.' });
    },
    ga_pitagoras: function (u, C, r) {
      var t = pick(r, TRIPLES), k = ent(r, 1, 3), a = t[0] * k, b = t[1] * k, c = t[2] * k, v = ent(r, 0, 2);
      if (v === 0) return it('corta', 'Los catetos de un triángulo rectángulo miden ' + a + ' cm y ' + b + ' cm. ¿Cuánto mide la hipotenusa?', c + ' cm', { ac: ac(c), x: 'h² = ' + a + '² + ' + b + '² = ' + (a * a) + ' + ' + (b * b) + ' = ' + (c * c) + ' → h = √' + (c * c) + ' = ' + c + ' cm.' });
      if (v === 1) return it('corta', 'La hipotenusa de un triángulo rectángulo mide ' + c + ' m y un cateto ' + a + ' m. Calcula el otro cateto.', b + ' m', { ac: ac(b), x: 'b² = ' + c + '² − ' + a + '² = ' + (c * c) + ' − ' + (a * a) + ' = ' + (b * b) + ' → b = ' + b + ' m.' });
      return it('corta', 'Una escalera de ' + c + ' m se apoya en una pared de ' + ciudad(C, r) + ' con el pie a ' + a + ' m de la pared. ¿A qué altura llega?', b + ' m', { ac: ac(b), x: 'Pared, suelo y escalera forman un triángulo rectángulo: altura = √(' + c + '² − ' + a + '²) = √' + (b * b) + ' = ' + b + ' m.' });
    },
    ga_tales: function (u, C, r) {
      var h1 = ent(r, 1, 3), s1 = ent(r, 2, 5), k = ent(r, 3, 12);
      if (r() < 0.6) return it('corta', 'Un palo de ' + h1 + ' m da una sombra de ' + s1 + ' m. A la misma hora, un edificio de ' + ciudad(C, r) + ' da una sombra de ' + (s1 * k) + ' m. ¿Cuánto mide el edificio?', (h1 * k) + ' m', { ac: ac(h1 * k), x: 'Los triángulos palo–sombra y edificio–sombra son semejantes: h ÷ ' + (s1 * k) + ' = ' + h1 + ' ÷ ' + s1 + ' → h = ' + (h1 * k) + ' m.' });
      var t = pick(r, TRIPLES.slice(0, 4)), q = ent(r, 2, 4);
      return it('corta', 'Un triángulo de lados ' + t.join(', ') + ' cm se amplía con razón de semejanza ' + q + '. ¿Cuánto miden los lados nuevos? ¿Por cuánto se multiplica el área?', t.map(function (x) { return x * q; }).join(', ') + ' cm; el área × ' + (q * q), { ac: ac(t.map(function (x) { return x * q; }).join(', ')), x: 'Las longitudes se multiplican por la razón (' + q + ') y las áreas por su cuadrado (' + q + '² = ' + (q * q) + ').' });
    },
    ga_volumen: function (u, C, r) {
      var v = ent(r, 0, 3), a = ent(r, 2, 9), R = ent(r, 1, 6), h = ent(r, 3, 12);
      if (v === 0) { var l = 10 * ent(r, 3, 8), w = 10 * ent(r, 2, 5), hh = 10 * ent(r, 2, 5), L = l * w * hh / 1000; return it('corta', 'Un acuario mide ' + l + ' × ' + w + ' × ' + hh + ' cm. ¿Cuántos litros de agua caben?', nm(L, C) + ' L', { ac: ac(r2(L), nm(L, C)), x: 'V = ' + l + ' · ' + w + ' · ' + hh + ' = ' + (l * w * hh) + ' cm³. Como 1 L = 1000 cm³, caben ' + nm(L, C) + ' L.' }); }
      if (v === 1) return it('corta', '¿Cuál es el volumen de un cubo de ' + a + ' cm de arista? ¿Y su área total?', (a * a * a) + ' cm³; ' + (6 * a * a) + ' cm²', { ac: ac(a * a * a), x: 'V = a³ = ' + a + '³ = ' + (a * a * a) + ' cm³. Área = 6 · a² = 6 · ' + (a * a) + ' = ' + (6 * a * a) + ' cm².' });
      if (v === 2) return it('corta', 'Calcula el volumen de un cilindro de radio ' + R + ' cm y altura ' + h + ' cm (π ≈ 3,14).', nm(3.14 * R * R * h, C) + ' cm³', { ac: ac(r2(3.14 * R * R * h), nm(3.14 * R * R * h, C), r2(Math.PI * R * R * h)), x: 'V = π · r² · h = 3,14 · ' + (R * R) + ' · ' + h + ' ≈ ' + nm(3.14 * R * R * h, C) + ' cm³.' });
      return it('corta', 'Calcula el volumen de una esfera de radio ' + R + ' cm (π ≈ 3,14).', nm(4 / 3 * 3.14 * R * R * R, C) + ' cm³', { ac: ac(r2(4 / 3 * 3.14 * R * R * R), nm(4 / 3 * 3.14 * R * R * R, C), r2(4 / 3 * Math.PI * R * R * R)), x: 'V = 4/3 · π · r³ = 4/3 · 3,14 · ' + (R * R * R) + ' ≈ ' + nm(4 / 3 * 3.14 * R * R * R, C) + ' cm³.' });
    },
    al_poli: function (u, C, r) {
      var p = [nz(r, -4, 5), ent(r, -6, 6), ent(r, -9, 9)], q = [ent(r, -4, 4), nz(r, -6, 6), ent(r, -9, 9)], v = ent(r, 0, 2);
      if (v === 0) { var s = [p[0] + q[0], p[1] + q[1], p[2] + q[2]]; return it('corta', 'Suma los polinomios P(x) = ' + poli(p) + ' y Q(x) = ' + poli(q) + '.', poli(s), { ac: ac(poli(s)), x: 'Se suman los términos semejantes: x² con x², x con x y números con números.' }); }
      if (v === 1) { var x = ent(r, -3, 3); return it('corta', 'Calcula P(' + x + ') si P(x) = ' + poli(p) + '.', String(p[0] * x * x + p[1] * x + p[2]), { ac: ac(p[0] * x * x + p[1] * x + p[2]), x: 'P(' + x + ') = ' + p[0] + ' · ' + par(x) + '² ' + mn(p[1]) + ' · ' + par(x) + ' ' + mn(p[2]) + ' = ' + (p[0] * x * x + p[1] * x + p[2]) + '.' }); }
      var a = nz(r, -3, 4), b = nz(r, -5, 5);
      var mo = (a < 0 ? '−' : '') + mon(a, 1);
      return it('corta', 'Multiplica: ' + mo + ' · (' + poli([1, b]) + ')', poli([a, a * b, 0]), { ac: ac(poli([a, a * b, 0])), x: 'Propiedad distributiva: se multiplica ' + mo + ' por cada término del paréntesis → ' + poli([a, a * b, 0]) + '.' });
    },
    al_sistema: function (u, C, r) {
      if (r() < 0.4) {
        var g = ent(r, 5, 30), c = ent(r, 3, 25);
        return it('corta', 'En una granja de ' + ciudad(C, r) + ' hay gallinas y conejos: ' + (g + c) + ' cabezas y ' + (2 * g + 4 * c) + ' patas. ¿Cuántos hay de cada uno?', g + ' gallinas y ' + c + ' conejos', { ac: ac(g + ' y ' + c), x: 'x + y = ' + (g + c) + '; 2x + 4y = ' + (2 * g + 4 * c) + '. Restando el doble de la primera: 2y = ' + (2 * c) + ' → y = ' + c + ', x = ' + g + '.' });
      }
      var x = ent(r, -5, 8), y = ent(r, -5, 8), a1 = nz(r, -4, 5), b1 = nz(r, -4, 5), a2 = nz(r, -4, 5), b2 = nz(r, -4, 5);
      while (a1 * b2 - a2 * b1 === 0) b2 = nz(r, -4, 5);
      return it('corta', 'Resuelve el sistema: ' + ec2(a1, b1, a1 * x + b1 * y) + ' ; ' + ec2(a2, b2, a2 * x + b2 * y), 'x = ' + x + ', y = ' + y, { ac: ac('x = ' + x + ', y = ' + y, x + ', ' + y, '(' + x + ', ' + y + ')'), x: 'Por reducción o sustitución se obtiene x = ' + x + ' e y = ' + y + '. Comprueba sustituyendo en las dos ecuaciones.' });
    },
    al_pendiente: function (u, C, r) {
      var m = nz(r, -4, 4), b = ent(r, -5, 5), x1 = ent(r, -3, 2), x2 = x1 + ent(r, 1, 4), y1 = m * x1 + b, y2 = m * x2 + b;
      if (r() < 0.5) return it('corta', 'Calcula la pendiente de la recta que pasa por A(' + x1 + ', ' + y1 + ') y B(' + x2 + ', ' + y2 + ').', 'm = ' + m, { ac: ac(m, 'm = ' + m), x: 'm = (y₂ − y₁) ÷ (x₂ − x₁) = (' + y2 + ' − ' + par(y1) + ') ÷ (' + x2 + ' − ' + par(x1) + ') = ' + (y2 - y1) + ' ÷ ' + (x2 - x1) + ' = ' + m + '.' });
      var e = 'y = ' + poli([m, b]);
      return it('corta', 'Escribe la ecuación de la recta que pasa por A(' + x1 + ', ' + y1 + ') y B(' + x2 + ', ' + y2 + ').', e, { ac: ac(e, poli([m, b])), x: 'Pendiente m = ' + m + '. Ordenada en el origen: b = y₁ − m · x₁ = ' + y1 + ' − ' + par(m * x1) + ' = ' + b + '. Por tanto ' + e + '.' });
    },
    ga_trigo: function (u, C, r) {
      var ang = pick(r, [30, 45, 60]), tg = { 30: 0.5774, 45: 1, 60: 1.7321 }[ang], d = ent(r, 10, 60), v = ent(r, 0, 2);
      if (v === 0) return it('corta', 'Desde ' + d + ' m de la base de una torre de ' + ciudad(C, r) + ' se ve la punta con un ángulo de elevación de ' + ang + '°. ¿Qué altura tiene la torre?', nm(d * tg, C) + ' m', { ac: ac(r2(d * tg), nm(d * tg, C), Math.round(d * tg * 10) / 10), x: 'tg ' + ang + '° = altura ÷ ' + d + ' → altura = ' + d + ' · tg ' + ang + '° ≈ ' + d + ' · ' + H.num(tg, C) + ' ≈ ' + nm(d * tg, C) + ' m.' });
      if (v === 1) { var h = 2 * ent(r, 3, 20); return it('corta', 'La hipotenusa de un triángulo rectángulo mide ' + h + ' cm y uno de sus ángulos agudos 30°. ¿Cuánto mide el cateto opuesto a ese ángulo?', (h / 2) + ' cm', { ac: ac(h / 2), x: 'sen 30° = cateto opuesto ÷ hipotenusa = 1/2 → cateto = ' + h + ' · 1/2 = ' + (h / 2) + ' cm.' }); }
      var t = pick(r, TRIPLES.slice(0, 4));
      return it('corta', 'En un triángulo rectángulo de catetos ' + t[0] + ' y ' + t[1] + ' e hipotenusa ' + t[2] + ', calcula sen α, cos α y tg α del ángulo opuesto al cateto ' + t[0] + '.', 'sen α = ' + frac(t[0], t[2]) + ', cos α = ' + frac(t[1], t[2]) + ', tg α = ' + frac(t[0], t[1]), { ac: ac(frac(t[0], t[2])), x: 'sen = opuesto ÷ hipotenusa; cos = contiguo ÷ hipotenusa; tg = opuesto ÷ contiguo. Comprobación: sen² + cos² = 1.' });
    },
    al_cuad: function (u, C, r) {
      var p = ent(r, -6, 6), q = ent(r, -6, 6), a = pick(r, [1, 1, 1, 2]), b = -a * (p + q), c = a * p * q, D = b * b - 4 * a * c;
      var lo = Math.min(p, q), hi = Math.max(p, q), s = p === q ? 'x = ' + p + ' (doble)' : 'x₁ = ' + lo + ', x₂ = ' + hi;
      return it('corta', 'Resuelve: ' + poli([a, b, c]) + ' = 0', s, { ac: ac(s, lo + ', ' + hi, lo + ' y ' + hi, hi + ', ' + lo, 'x = ' + p), x: 'Δ = b² − 4ac = ' + par(b) + '² − 4 · ' + a + ' · ' + par(c) + ' = ' + D + '. x = (' + (-b) + ' ± √' + D + ') ÷ ' + (2 * a) + ' → ' + (p === q ? p : lo + ' y ' + hi) + '.' });
    },
    al_notables: function (u, C, r) {
      var a = ent(r, 1, 9), v = ent(r, 0, 3);
      if (v === 0) return it('corta', 'Desarrolla: (x + ' + a + ')²', poli([1, 2 * a, a * a]), { ac: ac(poli([1, 2 * a, a * a]), poli([1, 2 * a, a * a]).replace(/²/g, '^2')), x: '(a + b)² = a² + 2ab + b² → x² + 2 · ' + a + ' · x + ' + a + '².' });
      if (v === 1) return it('corta', 'Desarrolla: (x − ' + a + ')²', poli([1, -2 * a, a * a]), { ac: ac(poli([1, -2 * a, a * a]), poli([1, -2 * a, a * a]).replace(/²/g, '^2')), x: '(a − b)² = a² − 2ab + b².' });
      if (v === 2) return it('corta', 'Factoriza: x² − ' + (a * a), '(x + ' + a + ')(x − ' + a + ')', { ac: ac('(x + ' + a + ')(x − ' + a + ')', '(x - ' + a + ')(x + ' + a + ')', '(x − ' + a + ')(x + ' + a + ')'), x: 'Diferencia de cuadrados: a² − b² = (a + b)(a − b), con b = ' + a + '.' });
      var p = ent(r, 1, 6), q = ent(r, 1, 6);
      return it('corta', 'Factoriza: ' + poli([1, p + q, p * q]), '(x + ' + p + ')(x + ' + q + ')', { ac: ac('(x + ' + p + ')(x + ' + q + ')', '(x + ' + q + ')(x + ' + p + ')'), x: 'Buscamos dos números que sumen ' + (p + q) + ' y multipliquen ' + (p * q) + ': ' + p + ' y ' + q + '.' });
    },
    ga_analitica: function (u, C, r) {
      var t = pick(r, TRIPLES.slice(0, 5)), x1 = ent(r, -5, 5), y1 = ent(r, -5, 5), sx = r() < 0.5 ? -1 : 1, sy = r() < 0.5 ? -1 : 1, x2 = x1 + sx * t[0], y2 = y1 + sy * t[1];
      if (r() < 0.55) return it('corta', 'Calcula la distancia entre A(' + x1 + ', ' + y1 + ') y B(' + x2 + ', ' + y2 + ').', String(t[2]), { ac: ac(t[2]), x: 'd = √((x₂ − x₁)² + (y₂ − y₁)²) = √(' + (x2 - x1) + '² + ' + (y2 - y1) + '²) = √' + (t[2] * t[2]) + ' = ' + t[2] + '.' });
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2, s = '(' + H.num(mx, C) + ', ' + H.num(my, C) + ')';
      return it('corta', 'Halla el punto medio del segmento de extremos A(' + x1 + ', ' + y1 + ') y B(' + x2 + ', ' + y2 + ').', s, { ac: ac(s, '(' + mx + ', ' + my + ')'), x: 'M = ((x₁ + x₂) ÷ 2, (y₁ + y₂) ÷ 2) = (' + (x1 + x2) + ' ÷ 2, ' + (y1 + y2) + ' ÷ 2).' });
    },
    ga_vector: function (u, C, r) {
      var t = pick(r, TRIPLES.slice(0, 4)), a = t[0] * (r() < 0.5 ? -1 : 1), b = t[1], c = ent(r, -5, 5), d = ent(r, -5, 5), v = ent(r, 0, 2);
      if (v === 0) return it('corta', 'Calcula el módulo del vector u = (' + a + ', ' + b + ').', String(t[2]), { ac: ac(t[2]), x: '|u| = √(' + par(a) + '² + ' + b + '²) = √' + (t[2] * t[2]) + ' = ' + t[2] + '.' });
      if (v === 1) return it('corta', 'Si u = (' + a + ', ' + b + ') y v = (' + c + ', ' + d + '), calcula u + v y 2u − v.', '(' + (a + c) + ', ' + (b + d) + '); (' + (2 * a - c) + ', ' + (2 * b - d) + ')', { ac: ac('(' + (a + c) + ', ' + (b + d) + ')'), x: 'Se opera componente a componente.' });
      var pe = a * c + b * d;
      return it('corta', 'Calcula el producto escalar de u = (' + a + ', ' + b + ') y v = (' + c + ', ' + d + '). ¿Son perpendiculares?', pe + (pe === 0 ? '; sí' : '; no'), { ac: ac(pe), x: 'u · v = ' + a + ' · ' + par(c) + ' + ' + b + ' · ' + par(d) + ' = ' + pe + '. Son perpendiculares solo si el producto es 0.' });
    },
    al_inecua: function (u, C, r) {
      var a = nz(r, -5, 5), x0 = ent(r, -6, 8), b = ent(r, -10, 10), c = a * x0 + b, sim = pick(r, ['<', '>', '≤', '≥']);
      var inv = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' }, fin = a < 0 ? inv[sim] : sim;
      return it('corta', 'Resuelve la inecuación: ' + poli([a, b]) + ' ' + sim + ' ' + c, 'x ' + fin + ' ' + x0, { ac: ac('x ' + fin + ' ' + x0), x: 'Pasamos ' + b + ' al otro miembro: ' + a + 'x ' + sim + ' ' + (c - b) + '. Dividimos entre ' + a + (a < 0 ? ' (negativo: la desigualdad cambia de sentido)' : '') + ': x ' + fin + ' ' + x0 + '.' });
    },
    al_det: function (u, C, r) {
      if (r() < 0.5 || u.niv < 4) {
        var M = [[ent(r, -5, 6), ent(r, -5, 6)], [ent(r, -5, 6), ent(r, -5, 6)]], d = M[0][0] * M[1][1] - M[0][1] * M[1][0];
        return it('corta', 'Calcula el determinante: ' + matriz(M), String(d), { ac: ac(d), x: 'det = a·d − b·c = ' + M[0][0] + ' · ' + par(M[1][1]) + ' − ' + par(M[0][1]) + ' · ' + par(M[1][0]) + ' = ' + d + '.' });
      }
      var A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]].map(function (f) { return f.map(function () { return ent(r, -3, 4); }); });
      var D = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
      return it('corta', 'Calcula el determinante por la regla de Sarrus: ' + matriz(A), String(D), { ac: ac(D), x: 'Suma de los productos de las tres diagonales principales menos los de las tres secundarias = ' + D + '.' });
    },
    al_cramer: function (u, C, r) {
      var x = ent(r, -3, 4), y = ent(r, -3, 4), z = ent(r, -3, 4), A, D;
      do { A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]].map(function (f) { return f.map(function () { return ent(r, -3, 4); }); }); D = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]); } while (!D);
      var ec = A.map(function (f) { var s = '', vs = ['x', 'y', 'z']; f.forEach(function (c, i) { if (!c) return; s += (s ? (c < 0 ? ' − ' : ' + ') : (c < 0 ? '−' : '')) + mon(c, 1, vs[i]); }); return (s || '0') + ' = ' + (f[0] * x + f[1] * y + f[2] * z); });
      return it('corta', 'Resuelve por Gauss o por Cramer: ' + ec.join(' ; '), 'x = ' + x + ', y = ' + y + ', z = ' + z, { ac: ac('x = ' + x + ', y = ' + y + ', z = ' + z, '(' + x + ', ' + y + ', ' + z + ')', x + ', ' + y + ', ' + z), x: 'El determinante del sistema vale ' + D + ' ≠ 0: el sistema es compatible determinado. x = Δx/Δ, y = Δy/Δ, z = Δz/Δ.' });
    },
    ga_circ: function (u, C, r) {
      var h = ent(r, -5, 5), k = ent(r, -5, 5), R = ent(r, 1, 8);
      if (r() < 0.5) { var e = xc(h) + '² + ' + yc(k) + '² = ' + (R * R); return it('corta', 'Escribe la ecuación de la circunferencia de centro (' + h + ', ' + k + ') y radio ' + R + '.', e, { ac: ac(e), x: '(x − a)² + (y − b)² = r², con a = ' + h + ', b = ' + k + ', r² = ' + (R * R) + '.' }); }
      var D = -2 * h, E = -2 * k, F = h * h + k * k - R * R, s = 'x² + y²' + (D ? (D < 0 ? ' − ' : ' + ') + mon(D, 1) : '') + (E ? (E < 0 ? ' − ' : ' + ') + mon(E, 1, 'y') : '') + (F ? (F < 0 ? ' − ' : ' + ') + Math.abs(F) : '') + ' = 0';
      return it('corta', 'Halla el centro y el radio de la circunferencia ' + s + '.', 'centro (' + h + ', ' + k + '), radio ' + R, { ac: ac('(' + h + ', ' + k + '), ' + R, '(' + h + ', ' + k + ') y ' + R), x: 'Centro = (−D/2, −E/2) = (' + h + ', ' + k + '). r = √(a² + b² − F) = √' + (R * R) + ' = ' + R + '.' });
    },
    al_complejo: function (u, C, r) {
      function cx(a, b) { return (a ? a : '') + (b ? (a ? (b < 0 ? ' − ' : ' + ') : (b < 0 ? '−' : '')) + (Math.abs(b) === 1 ? '' : Math.abs(b)) + 'i' : (a ? '' : '0')); }
      var a = ent(r, -6, 6), b = nz(r, -6, 6), c = ent(r, -6, 6), d = nz(r, -6, 6), v = ent(r, 0, 2);
      if (v === 0) return it('corta', 'Suma: (' + cx(a, b) + ') + (' + cx(c, d) + ')', cx(a + c, b + d), { ac: ac(cx(a + c, b + d)), x: 'Se suman las partes reales (' + a + ' + ' + par(c) + ') y las imaginarias (' + b + ' + ' + par(d) + ').' });
      if (v === 1) return it('corta', 'Multiplica: (' + cx(a, b) + ') · (' + cx(c, d) + ')', cx(a * c - b * d, a * d + b * c), { ac: ac(cx(a * c - b * d, a * d + b * c)), x: '(a + bi)(c + di) = (ac − bd) + (ad + bc)i, porque i² = −1.' });
      var t = pick(r, TRIPLES.slice(0, 4));
      return it('corta', 'Calcula el módulo de z = ' + cx(t[0], -t[1]) + '.', String(t[2]), { ac: ac(t[2]), x: '|z| = √(' + t[0] + '² + ' + t[1] + '²) = √' + (t[2] * t[2]) + ' = ' + t[2] + '.' });
    },
    ga_prodvec: function (u, C, r) {
      var a = ent(r, -3, 4), b = ent(r, -3, 4), c = ent(r, -3, 4), d = ent(r, -3, 4), e = ent(r, -3, 4), f = ent(r, -3, 4);
      if (r() < 0.5) { var s = '(' + (b * f - c * e) + ', ' + (c * d - a * f) + ', ' + (a * e - b * d) + ')'; return it('corta', 'Calcula el producto vectorial u × v con u = (' + a + ', ' + b + ', ' + c + ') y v = (' + d + ', ' + e + ', ' + f + ').', s, { ac: ac(s), x: 'u × v = (u₂v₃ − u₃v₂, u₃v₁ − u₁v₃, u₁v₂ − u₂v₁). El resultado es perpendicular a u y a v.' }); }
      var pe = a * d + b * e + c * f;
      return it('corta', 'Calcula u · v con u = (' + a + ', ' + b + ', ' + c + ') y v = (' + d + ', ' + e + ', ' + f + ').', String(pe), { ac: ac(pe), x: 'u · v = ' + a + '·' + par(d) + ' + ' + b + '·' + par(e) + ' + ' + c + '·' + par(f) + ' = ' + pe + '.' });
    },
    al_progresion: function (u, C, r) {
      if (r() < 0.5) {
        var a1 = ent(r, 10, 30), d = ent(r, 1, 4), n = ent(r, 10, 25), an = a1 + (n - 1) * d, S = n * (a1 + an) / 2;
        return it('corta', 'Un teatro de ' + ciudad(C, r) + ' tiene ' + a1 + ' butacas en la primera fila y cada fila tiene ' + d + ' más que la anterior. Si hay ' + n + ' filas, ¿cuántas butacas tiene la última? ¿Y el teatro?', an + '; ' + S, { ac: ac(an + '; ' + S, an + ', ' + S), x: 'Progresión aritmética: aₙ = ' + a1 + ' + (' + n + ' − 1) · ' + d + ' = ' + an + '. Sₙ = n · (a₁ + aₙ) ÷ 2 = ' + n + ' · ' + (a1 + an) + ' ÷ 2 = ' + S + '.' });
      }
      var g1 = ent(r, 1, 5), q = pick(r, [2, 3]), m = ent(r, 4, 7), gm = g1 * Math.pow(q, m - 1);
      return it('corta', 'En la progresión geométrica ' + [0, 1, 2, 3].map(function (i) { return g1 * Math.pow(q, i); }).join(', ') + ', … ¿cuál es el término ' + m + '?', String(gm), { ac: ac(gm), x: 'aₙ = a₁ · rⁿ⁻¹ = ' + g1 + ' · ' + q + SUP[Math.min(6, m - 1)] + ' = ' + gm + '.' });
    },

    /* ─────────── Cálculo ─────────── */
    ca_eval: function (u, C, r) {
      var v = ent(r, 0, 2), a = ent(r, -6, 6);
      if (v === 0) { var p = [nz(r, -3, 3), ent(r, -5, 5), ent(r, -6, 6)], x = ent(r, -3, 3), y = p[0] * x * x + p[1] * x + p[2]; return it('corta', 'Si f(x) = ' + poli(p) + ', calcula f(' + x + ').', String(y), { ac: ac(y), x: 'Sustituimos x = ' + x + ': ' + p[0] + '·' + par(x) + '² ' + mn(p[1]) + '·' + par(x) + ' ' + mn(p[2]) + ' = ' + y + '.' }); }
      if (v === 1) return it('corta', '¿Cuál es el dominio de f(x) = 1 / ' + xc(a) + '?', 'ℝ − {' + a + '}', { ac: ac('ℝ − {' + a + '}', 'R-{' + a + '}', 'x ≠ ' + a), x: 'No se puede dividir entre cero: el denominador se anula en x = ' + a + '.' });
      return it('corta', '¿Cuál es el dominio de f(x) = √' + xc(a) + '?', 'x ≥ ' + a, { ac: ac('x ≥ ' + a, 'x>=' + a, '[' + a + ', +∞)'), x: 'El radicando debe ser mayor o igual que cero: x − ' + par(a) + ' ≥ 0.' });
    },
    ca_tvm: function (u, C, r) {
      var b = ent(r, -5, 5), p = ent(r, -2, 3), q = p + ent(r, 1, 4), f = function (x) { return x * x + b * x; }, t = (f(q) - f(p)) / (q - p);
      return it('corta', 'Calcula la tasa de variación media de f(x) = ' + poli([1, b, 0]) + ' en el intervalo [' + p + ', ' + q + '].', String(t), { ac: ac(t), x: 'TVM = (f(' + q + ') − f(' + p + ')) ÷ (' + q + ' − ' + par(p) + ') = (' + f(q) + ' − ' + par(f(p)) + ') ÷ ' + (q - p) + ' = ' + t + '.' });
    },
    ca_vertice: function (u, C, r) {
      var a = pick(r, [-2, -1, 1, 2]), h = ent(r, -4, 4), k = ent(r, -6, 6), p = [a, -2 * a * h, a * h * h + k];
      return it('corta', 'Halla el vértice de la parábola f(x) = ' + poli(p) + '. ¿Es un máximo o un mínimo?', '(' + h + ', ' + k + '), ' + (a > 0 ? 'mínimo' : 'máximo'), { ac: ac('(' + h + ', ' + k + ')'), x: 'x_v = −b ÷ 2a = ' + (-p[1]) + ' ÷ ' + (2 * a) + ' = ' + h + '; f(' + h + ') = ' + k + '. Como a ' + (a > 0 ? '> 0, abre hacia arriba: mínimo.' : '< 0, abre hacia abajo: máximo.') });
    },
    ca_limite: function (u, C, r) {
      var v = ent(r, 0, 2), a = nz(r, -5, 6);
      if (v === 0) return it('corta', 'Calcula: lím (x→' + a + ') (x² − ' + (a * a) + ') ÷ ' + xc(a), String(2 * a), { ac: ac(2 * a), x: 'Sale 0/0: factorizamos x² − ' + (a * a) + ' = (x − ' + par(a) + ')(x + ' + par(a) + '), simplificamos y queda x + ' + par(a) + ' → ' + (2 * a) + '.' });
      if (v === 1) { var p = nz(r, 1, 6), q = nz(r, 1, 6); return it('corta', 'Calcula: lím (x→∞) (' + poli([p, ent(r, -5, 5), ent(r, -5, 5)]) + ') ÷ (' + poli([q, ent(r, -5, 5), 1]) + ')', frac(p, q), { ac: ac(frac(p, q), r2(p / q)), x: 'Mismo grado en numerador y denominador: el límite es el cociente de los coeficientes principales, ' + p + '/' + q + '.' }); }
      var cs = [nz(r, -3, 3), ent(r, -4, 4), ent(r, -5, 5)], x = ent(r, -3, 3);
      return it('corta', 'Calcula: lím (x→' + x + ') (' + poli(cs) + ')', String(cs[0] * x * x + cs[1] * x + cs[2]), { ac: ac(cs[0] * x * x + cs[1] * x + cs[2]), x: 'Un polinomio es continuo: basta sustituir x = ' + x + '.' });
    },
    ca_deriv: function (u, C, r) {
      var g = u.niv >= 3 ? 4 : 3, cs = [], i; for (i = 0; i <= g; i++) cs.push(i === 0 ? nz(r, -4, 5) : ent(r, -6, 6));
      var d = cs.slice(0, g).map(function (c, j) { return c * (g - j); });
      return it('corta', 'Deriva: f(x) = ' + poli(cs), "f'(x) = " + poli(d), { ac: ac("f'(x) = " + poli(d), poli(d)), x: 'Regla de la potencia término a término: (a·xⁿ)\' = n·a·xⁿ⁻¹; la derivada de una constante es 0.' });
    },
    ca_cadena: function (u, C, r) {
      var a = nz(r, 2, 5), b = nz(r, -6, 6), n = ent(r, 2, 5), k = nz(r, 2, 6), v = ent(r, 0, 3);
      var base = '(' + poli([a, b]) + ')';
      if (v === 0) return it('corta', "Deriva: f(x) = " + base + SUP[n], "f'(x) = " + (n * a) + base + (n - 1 > 1 ? SUP[n - 1] : ''), { ac: ac("f'(x) = " + (n * a) + base + (n - 1 > 1 ? SUP[n - 1] : '')), x: 'Regla de la cadena: n · (interior)ⁿ⁻¹ · (interior)\' = ' + n + ' · ' + base + (n - 1 > 1 ? SUP[n - 1] : '') + ' · ' + a + '.' });
      if (v === 1) return it('corta', 'Deriva: f(x) = e^(' + k + 'x)', "f'(x) = " + k + 'e^(' + k + 'x)', { ac: ac(k + 'e^(' + k + 'x)', k + 'e^' + k + 'x'), x: '(eᵘ)\' = u\' · eᵘ, con u = ' + k + 'x y u\' = ' + k + '.' });
      if (v === 2) return it('corta', 'Deriva: f(x) = sen(' + k + 'x)', "f'(x) = " + k + ' cos(' + k + 'x)', { ac: ac(k + 'cos(' + k + 'x)', k + ' cos(' + k + 'x)'), x: '(sen u)\' = u\' · cos u.' });
      return it('corta', 'Deriva: f(x) = x · e^x', "f'(x) = e^x (1 + x)", { ac: ac('e^x(1+x)', 'e^x + x e^x', '(1+x)e^x'), x: 'Regla del producto: (u·v)\' = u\'·v + u·v\' = 1·eˣ + x·eˣ.' });
    },
    ca_tangente: function (u, C, r) {
      var b = ent(r, -5, 5), c = ent(r, -6, 6), x0 = ent(r, -3, 3), m = 2 * x0 + b, y0 = x0 * x0 + b * x0 + c, n = y0 - m * x0, e = 'y = ' + poli([m, n]);
      return it('corta', 'Halla la recta tangente a f(x) = ' + poli([1, b, c]) + ' en x = ' + x0 + '.', e, { ac: ac(e, poli([m, n])), x: "f'(x) = " + poli([2, b]) + " → m = f'(" + x0 + ') = ' + m + '. Punto (' + x0 + ', ' + y0 + '). y − ' + par(y0) + ' = ' + m + '(x − ' + par(x0) + ') → ' + e + '.' });
    },
    ca_optim: function (u, C, r) {
      if (r() < 0.6) { var L = 4 * ent(r, 5, 40); return it('corta', 'Con ' + L + ' m de valla se quiere cercar un huerto rectangular en ' + ciudad(C, r) + ' con la mayor área posible. ¿Qué medidas debe tener? ¿Qué área tendrá?', (L / 4) + ' m × ' + (L / 4) + ' m; ' + (L * L / 16) + ' m²', { ac: ac(L / 4, (L / 4) + ' × ' + (L / 4)), x: 'Si un lado mide x, el otro mide ' + (L / 2) + ' − x. A(x) = x(' + (L / 2) + ' − x). A\'(x) = ' + (L / 2) + ' − 2x = 0 → x = ' + (L / 4) + ' m: un cuadrado.' }); }
      var S = 2 * ent(r, 5, 50);
      return it('corta', 'Dos números positivos suman ' + S + '. ¿Cuáles son si su producto es el mayor posible? ¿Cuál es ese producto?', (S / 2) + ' y ' + (S / 2) + '; ' + (S * S / 4), { ac: ac((S / 2) + ' y ' + (S / 2), S * S / 4), x: 'P(x) = x(' + S + ' − x); P\'(x) = ' + S + ' − 2x = 0 → x = ' + (S / 2) + '. P\'\'(x) = −2 < 0: es un máximo.' });
    },
    ca_primitiva: function (u, C, r) {
      var n1 = ent(r, 1, 4), n2 = ent(r, 0, n1 - 1), a1 = (n1 + 1) * nz(r, -3, 4), a2 = (n2 + 1) * nz(r, -3, 4);
      var cs = []; for (var d = n1; d >= 0; d--) cs.push(d === n1 ? a1 : d === n2 ? a2 : 0);
      var F = []; for (var e = n1 + 1; e >= 0; e--) F.push(e === n1 + 1 ? a1 / (n1 + 1) : e === n2 + 1 ? a2 / (n2 + 1) : 0);
      return it('corta', 'Calcula: ∫ (' + poli(cs) + ') dx', poli(F) + ' + C', { ac: ac(poli(F) + ' + C', poli(F)), x: '∫ a·xⁿ dx = a·xⁿ⁺¹ ÷ (n + 1) + C, término a término. Comprueba derivando el resultado.' });
    },
    ca_definida: function (u, C, r) {
      if (r() < 0.5) { var k = ent(r, 1, 5); return it('corta', 'Calcula: ∫₀^' + k + ' 3x² dx', String(k * k * k), { ac: ac(k * k * k), x: 'Una primitiva es x³. Regla de Barrow: ' + k + '³ − 0³ = ' + (k * k * k) + '.' }); }
      var b = ent(r, -4, 5), p = ent(r, -2, 2), q = p + ent(r, 1, 4), v = (q * q - p * p) + b * (q - p);
      return it('corta', 'Calcula: ∫ de ' + p + ' a ' + q + ' de (' + poli([2, b]) + ') dx', String(v), { ac: ac(v), x: 'F(x) = ' + poli([1, b, 0]) + '. F(' + q + ') − F(' + p + ') = ' + (q * q + b * q) + ' − ' + par(p * p + b * p) + ' = ' + v + '.' });
    },
    ca_area: function (u, C, r) {
      if (r() < 0.5) { var k = ent(r, 1, 4), A = 4 * k * k * k / 3; return it('corta', 'Calcula el área encerrada entre la parábola y = ' + (k * k) + ' − x² y el eje X.', frac(4 * k * k * k, 3) + ' ≈ ' + nm(A, C) + ' u²', { ac: ac(frac(4 * k * k * k, 3), r2(A), nm(A, C)), x: 'Cortes con el eje: x = ±' + k + '. Área = ∫ de −' + k + ' a ' + k + ' de (' + (k * k) + ' − x²) dx = [' + (k * k) + 'x − x³/3] = ' + frac(4 * k * k * k, 3) + '.' }); }
      var a = ent(r, 1, 6), A2 = a * a * a / 6;
      return it('corta', 'Calcula el área entre y = x² e y = ' + mon(a, 1) + '.', frac(a * a * a, 6) + ' ≈ ' + nm(A2, C) + ' u²', { ac: ac(frac(a * a * a, 6), r2(A2), nm(A2, C)), x: 'Se cortan en x = 0 y x = ' + a + '. Área = ∫₀^' + a + ' (' + mon(a, 1) + ' − x²) dx = ' + a + '³/6.' });
    },
    ca_asintota: function (u, C, r) {
      var a = nz(r, -4, 5), b = ent(r, -6, 6), c = ent(r, -5, 5);
      if (a * c + b === 0) b += 1;
      return it('corta', 'Halla las asíntotas de f(x) = (' + poli([a, b]) + ') ÷ ' + xc(c) + '.', 'vertical x = ' + c + '; horizontal y = ' + a, { ac: ac('x = ' + c + '; y = ' + a, 'x=' + c + ', y=' + a), x: 'El denominador se anula en x = ' + c + ' (y el numerador no): asíntota vertical. Mismo grado arriba y abajo: y = ' + a + ' ÷ 1.' });
    },
    ca_expo: function (u, C, r) {
      var v = ent(r, 0, 2);
      if (v === 0) { var P0 = 1000 * ent(r, 2, 50), k = pick(r, [2, 3, 5]), t = ent(r, 2, 6), P = P0 * Math.pow(1 + k / 100, t); return it('corta', 'La población de un barrio de ' + ciudad(C, r) + ' es de ' + H.num(P0, C) + ' habitantes y crece un ' + k + ' % al año. ¿Cuántos habrá dentro de ' + t + ' años?', H.num(Math.round(P), C), { ac: ac(Math.round(P), H.num(Math.round(P), C)), x: 'P(t) = P₀ · (1 + ' + H.num(k / 100, C) + ')ᵗ = ' + H.num(P0, C) + ' · ' + H.num(1 + k / 100, C) + SUP[Math.min(6, t)] + ' ≈ ' + H.num(Math.round(P), C) + '.' }); }
      if (v === 1) { var m = 10 * ent(r, 2, 20), T = ent(r, 5, 30), n = ent(r, 2, 4); return it('corta', 'Un isótopo pierde la mitad de su masa cada ' + T + ' años. Si hay ' + m + ' g, ¿cuánto quedará dentro de ' + (n * T) + ' años?', nm(m / Math.pow(2, n), C) + ' g', { ac: ac(r2(m / Math.pow(2, n)), nm(m / Math.pow(2, n), C)), x: 'Pasan ' + n + ' semividas: ' + m + ' · (1/2)' + SUP[n] + ' = ' + nm(m / Math.pow(2, n), C) + ' g.' }); }
      var k2 = nz(r, -3, 3), y0 = ent(r, 1, 9);
      return it('corta', 'Resuelve la ecuación diferencial y\' = ' + k2 + 'y con y(0) = ' + y0 + '.', 'y = ' + y0 + 'e^(' + k2 + 't)', { ac: ac('y = ' + y0 + 'e^(' + k2 + 't)', y0 + 'e^(' + k2 + 't)', y0 + 'e^' + k2 + 't'), x: 'Separando variables: dy/y = ' + k2 + ' dt → ln y = ' + k2 + 't + C → y = C·e^(' + k2 + 't). Con y(0) = ' + y0 + ' queda C = ' + y0 + '.' });
    },
    ca_serie: function (u, C, r) {
      var q = pick(r, [2, 3, 4, 5]), a = q * ent(r, 1, 9), S = a * q / (q - 1);
      if (r() < 0.6) return it('corta', 'Suma la serie geométrica ' + a + ' + ' + frac(a, q) + ' + ' + frac(a, q * q) + ' + … (razón 1/' + q + ').', frac(a * q, q - 1), { ac: ac(frac(a * q, q - 1), r2(S), nm(S, C)), x: 'Como |r| < 1, S = a₁ ÷ (1 − r) = ' + a + ' ÷ (1 − 1/' + q + ') = ' + frac(a * q, q - 1) + '.' });
      var n = ent(r, 5, 20);
      return it('corta', 'Calcula la suma 1 + 2 + 3 + … + ' + (n * 10) + '.', String(n * 10 * (n * 10 + 1) / 2), { ac: ac(n * 10 * (n * 10 + 1) / 2), x: 'Fórmula de Gauss: n(n + 1) ÷ 2 = ' + (n * 10) + ' · ' + (n * 10 + 1) + ' ÷ 2.' });
    },
    ca_taylor: function (u, C, r) {
      var x = pick(r, [0.1, 0.2, 0.3, 0.5]), v = ent(r, 0, 1);
      if (v === 0) { var e = 1 + x + x * x / 2 + x * x * x / 6; return it('corta', 'Aproxima e^' + H.num(x, C) + ' con el polinomio de Taylor de grado 3 en x = 0.', H.num(r4(e), C), { ac: ac(r4(e), H.num(r4(e), C), Math.round(e * 1000) / 1000), x: 'eˣ ≈ 1 + x + x²/2 + x³/6 = 1 + ' + H.num(x, C) + ' + ' + H.num(r4(x * x / 2), C) + ' + ' + H.num(r4(x * x * x / 6), C) + ' ≈ ' + H.num(r4(e), C) + ' (valor real ' + H.num(r4(Math.exp(x)), C) + ').' }); }
      var s = x - x * x * x / 6;
      return it('corta', 'Aproxima sen(' + H.num(x, C) + ') con el polinomio x − x³/6.', H.num(r4(s), C), { ac: ac(r4(s), H.num(r4(s), C)), x: 'sen x ≈ x − x³/6 = ' + H.num(x, C) + ' − ' + H.num(r4(x * x * x / 6), C) + ' ≈ ' + H.num(r4(s), C) + ' (valor real ' + H.num(r4(Math.sin(x)), C) + ').' });
    },
    ca_parcial: function (u, C, r) {
      var a = nz(r, -4, 5), b = nz(r, -4, 5), fx = (2 * a) + 'xy', fy = mon(a, 2).replace(/^/, a < 0 ? '−' : '') + (3 * b < 0 ? ' − ' : ' + ') + Math.abs(3 * b) + 'y²';
      return it('corta', 'Calcula las derivadas parciales de f(x, y) = ' + (a < 0 ? '−' : '') + mon(a, 2) + 'y ' + (b < 0 ? '− ' : '+ ') + mon(b, 3, 'y') + '.', '∂f/∂x = ' + fx + '; ∂f/∂y = ' + fy, { ac: ac('∂f/∂x = ' + fx + '; ∂f/∂y = ' + fy, fx + '; ' + fy), x: 'Para ∂f/∂x se deriva tratando y como constante; para ∂f/∂y, tratando x como constante.' });
    },

    /* ─────────── Física ─────────── */
    fis_mru: function (u, C, r) {
      if (r() < 0.4) { var k = ent(r, 2, 30) * 18; return it('corta', 'Expresa ' + k + ' km/h en m/s.', (k / 3.6) + ' m/s', { ac: ac(k / 3.6), x: '1 km/h = 1000 m ÷ 3600 s: se divide entre 3,6 → ' + k + ' ÷ 3,6 = ' + (k / 3.6) + ' m/s.' }); }
      var v = ent(r, 40, 110), t = ent(r, 2, 6), c1 = C.P.ciudades[0], c2 = C.P.ciudades[1] || c1;
      return it('corta', 'Un autobús va de ' + c1 + ' hacia ' + c2 + ' a ' + v + ' km/h constantes durante ' + t + ' h. ¿Qué distancia recorre?', (v * t) + ' km', { ac: ac(v * t), x: 'Movimiento uniforme: d = v · t = ' + v + ' · ' + t + ' = ' + (v * t) + ' km.' });
    },
    fis_mrua: function (u, C, r) {
      var v = ent(r, 0, 2);
      if (v === 0) { var t = ent(r, 1, 5), h = r2(4.9 * t * t); return it('corta', 'Se deja caer una piedra desde un puente de ' + H.num(h, C) + ' m. ¿Cuánto tarda en llegar al agua? (g = 9,8 m/s²)', t + ' s', { ac: ac(t), x: 'h = ½ · g · t² → t = √(2h ÷ g) = √(' + H.num(r2(2 * h), C) + ' ÷ 9,8) = ' + t + ' s.' }); }
      var v0 = ent(r, 0, 20), a = ent(r, 1, 5), t2 = ent(r, 2, 10);
      if (v === 1) return it('corta', 'Un coche que va a ' + v0 + ' m/s acelera a ' + a + ' m/s² durante ' + t2 + ' s. ¿Qué velocidad alcanza?', (v0 + a * t2) + ' m/s', { ac: ac(v0 + a * t2), x: 'v = v₀ + a · t = ' + v0 + ' + ' + a + ' · ' + t2 + ' = ' + (v0 + a * t2) + ' m/s.' });
      var d = v0 * t2 + a * t2 * t2 / 2;
      return it('corta', 'Un ciclista sale a ' + v0 + ' m/s y acelera a ' + a + ' m/s² durante ' + t2 + ' s. ¿Qué distancia recorre?', H.num(d, C) + ' m', { ac: ac(d, H.num(d, C)), x: 'd = v₀ · t + ½ · a · t² = ' + (v0 * t2) + ' + ½ · ' + a + ' · ' + (t2 * t2) + ' = ' + H.num(d, C) + ' m.' });
    },
    fis_newton: function (u, C, r) {
      var m = ent(r, 2, 80), a = ent(r, 1, 6), v = ent(r, 0, 2);
      if (v === 0) return it('corta', '¿Qué fuerza hace falta para acelerar ' + m + ' kg a ' + a + ' m/s²?', (m * a) + ' N', { ac: ac(m * a), x: 'Segunda ley de Newton: F = m · a = ' + m + ' · ' + a + ' = ' + (m * a) + ' N.' });
      if (v === 1) return it('corta', '¿Cuánto pesa en la Tierra una persona de ' + m + ' kg? ¿Y en la Luna (g = 1,62 m/s²)?', nm(m * 9.8, C) + ' N; ' + nm(m * 1.62, C) + ' N', { ac: ac(r2(m * 9.8), nm(m * 9.8, C)), x: 'Peso = m · g: ' + m + ' · 9,8 = ' + nm(m * 9.8, C) + ' N en la Tierra y ' + m + ' · 1,62 = ' + nm(m * 1.62, C) + ' N en la Luna. La masa no cambia.' });
      var F = m * a;
      return it('corta', 'Sobre un carro de ' + m + ' kg actúa una fuerza neta de ' + F + ' N. ¿Qué aceleración adquiere?', a + ' m/s²', { ac: ac(a), x: 'a = F ÷ m = ' + F + ' ÷ ' + m + ' = ' + a + ' m/s².' });
    },
    fis_energ: function (u, C, r) {
      var m = ent(r, 1, 60), v = ent(r, 2, 20), h = ent(r, 2, 30), k = ent(r, 0, 2);
      if (k === 0) return it('corta', 'Calcula la energía cinética de un cuerpo de ' + m + ' kg que va a ' + v + ' m/s.', H.num(m * v * v / 2, C) + ' J', { ac: ac(m * v * v / 2, H.num(m * v * v / 2, C)), x: 'Ec = ½ · m · v² = ½ · ' + m + ' · ' + (v * v) + ' = ' + H.num(m * v * v / 2, C) + ' J.' });
      if (k === 1) return it('corta', '¿Qué energía potencial tiene una maceta de ' + m + ' kg en un balcón a ' + h + ' m de altura? (g = 9,8 m/s²)', nm(m * 9.8 * h, C) + ' J', { ac: ac(r2(m * 9.8 * h), nm(m * 9.8 * h, C), m * 10 * h), x: 'Ep = m · g · h = ' + m + ' · 9,8 · ' + h + ' = ' + nm(m * 9.8 * h, C) + ' J.' });
      var vf = Math.sqrt(2 * 9.8 * h);
      return it('corta', 'Un objeto cae libremente desde ' + h + ' m. ¿Con qué velocidad llega al suelo? (sin rozamiento)', nm(vf, C) + ' m/s', { ac: ac(r2(vf), nm(vf, C), Math.round(vf * 10) / 10), x: 'Conservación de la energía: m·g·h = ½·m·v² → v = √(2·g·h) = √(2 · 9,8 · ' + h + ') ≈ ' + nm(vf, C) + ' m/s.' });
    },
    fis_trabajo: function (u, C, r) {
      var F = ent(r, 10, 200), d = ent(r, 2, 40), t = ent(r, 2, 20), W = F * d;
      if (r() < 0.5) return it('corta', 'Se empuja una caja con una fuerza de ' + F + ' N a lo largo de ' + d + ' m. ¿Qué trabajo se realiza?', W + ' J', { ac: ac(W), x: 'W = F · d = ' + F + ' · ' + d + ' = ' + W + ' J (fuerza y desplazamiento en la misma dirección).' });
      return it('corta', 'Un motor realiza un trabajo de ' + W + ' J en ' + t + ' s. ¿Qué potencia desarrolla?', nm(W / t, C) + ' W', { ac: ac(r2(W / t), nm(W / t, C)), x: 'P = W ÷ t = ' + W + ' ÷ ' + t + ' = ' + nm(W / t, C) + ' W.' });
    },
    fis_ohm: function (u, C, r) {
      var R = ent(r, 2, 60), I = pick(r, [0.5, 1, 1.5, 2, 3]), V = R * I, v = ent(r, 0, 2);
      if (v === 0) return it('corta', 'Por una resistencia de ' + R + ' Ω circula una corriente de ' + H.num(I, C) + ' A. ¿Qué tensión hay entre sus extremos?', H.num(V, C) + ' V', { ac: ac(V, H.num(V, C)), x: 'Ley de Ohm: V = I · R = ' + H.num(I, C) + ' · ' + R + ' = ' + H.num(V, C) + ' V.' });
      if (v === 1) return it('corta', 'Una bombilla conectada a ' + H.num(V, C) + ' V consume ' + H.num(I, C) + ' A. ¿Qué potencia tiene?', H.num(V * I, C) + ' W', { ac: ac(V * I, H.num(V * I, C)), x: 'P = V · I = ' + H.num(V, C) + ' · ' + H.num(I, C) + ' = ' + H.num(V * I, C) + ' W.' });
      var R1 = pick(r, [2, 3, 4, 6, 12]), R2 = pick(r, [3, 4, 6, 12]), Rp = R1 * R2 / (R1 + R2);
      return it('corta', 'Dos resistencias de ' + R1 + ' Ω y ' + R2 + ' Ω se conectan en serie y después en paralelo. Calcula la resistencia equivalente en cada caso.', 'serie ' + (R1 + R2) + ' Ω; paralelo ' + nm(Rp, C) + ' Ω', { ac: ac(R1 + R2), x: 'Serie: R = R₁ + R₂ = ' + (R1 + R2) + ' Ω. Paralelo: R = R₁·R₂ ÷ (R₁ + R₂) = ' + (R1 * R2) + ' ÷ ' + (R1 + R2) + ' ≈ ' + nm(Rp, C) + ' Ω.' });
    },
    fis_presion: function (u, C, r) {
      if (r() < 0.5) { var h = ent(r, 2, 30); return it('corta', '¿Qué presión soporta un buceador a ' + h + ' m de profundidad en agua dulce (sin contar la atmósfera)? (ρ = 1000 kg/m³, g = 9,8 m/s²)', H.num(9800 * h, C) + ' Pa', { ac: ac(9800 * h, H.num(9800 * h, C), 10000 * h), x: 'p = ρ · g · h = 1000 · 9,8 · ' + h + ' = ' + H.num(9800 * h, C) + ' Pa.' }); }
      var F = 10 * ent(r, 20, 90), S = pick(r, [0.01, 0.02, 0.05, 0.1]);
      return it('corta', 'Una persona que pesa ' + F + ' N apoya su peso sobre ' + H.num(S, C) + ' m². ¿Qué presión ejerce sobre el suelo?', H.num(Math.round(F / S), C) + ' Pa', { ac: ac(Math.round(F / S), H.num(Math.round(F / S), C)), x: 'p = F ÷ S = ' + F + ' ÷ ' + H.num(S, C) + ' = ' + H.num(Math.round(F / S), C) + ' Pa. Con raquetas de nieve la superficie crece y la presión baja.' });
    },
    fis_ondas: function (u, C, r) {
      if (r() < 0.5) { var t = ent(r, 2, 9); return it('corta', 'Ves un rayo y oyes el trueno ' + t + ' s después. ¿A qué distancia cayó? (sonido: 340 m/s)', H.num(340 * t, C) + ' m', { ac: ac(340 * t, H.num(340 * t, C)), x: 'La luz llega casi al instante; el sonido tarda: d = v · t = 340 · ' + t + ' = ' + H.num(340 * t, C) + ' m.' }); }
      var f = pick(r, [170, 340, 680, 850, 1700]);
      return it('corta', 'Una onda sonora de ' + f + ' Hz viaja por el aire a 340 m/s. ¿Cuál es su longitud de onda?', nm(340 / f, C) + ' m', { ac: ac(r2(340 / f), nm(340 / f, C)), x: 'v = λ · f → λ = v ÷ f = 340 ÷ ' + f + ' = ' + nm(340 / f, C) + ' m.' });
    },
    fis_calor: function (u, C, r) {
      var v = ent(r, 0, 2), m = 50 * ent(r, 2, 20), T1 = ent(r, 10, 25), T2 = ent(r, 40, 90);
      if (v === 0) return it('corta', '¿Cuántas calorías hacen falta para calentar ' + m + ' g de agua de ' + T1 + ' °C a ' + T2 + ' °C? (c = 1 cal/g·°C)', H.num(m * (T2 - T1), C) + ' cal', { ac: ac(m * (T2 - T1), H.num(m * (T2 - T1), C)), x: 'Q = m · c · ΔT = ' + m + ' · 1 · (' + T2 + ' − ' + T1 + ') = ' + H.num(m * (T2 - T1), C) + ' cal (≈ ' + H.num(Math.round(m * (T2 - T1) * 4.18), C) + ' J).' });
      if (v === 1) return it('corta', 'Expresa ' + T2 + ' °C en kelvin y en grados Fahrenheit.', (T2 + 273) + ' K; ' + H.num(T2 * 1.8 + 32, C) + ' °F', { ac: ac(T2 + 273), x: 'K = °C + 273 = ' + (T2 + 273) + '. °F = °C · 1,8 + 32 = ' + H.num(T2 * 1.8 + 32, C) + '.' });
      var ma = 100 * ent(r, 1, 5), mb = 100 * ent(r, 1, 5), Te = (ma * T1 + mb * T2) / (ma + mb);
      return it('corta', 'Se mezclan ' + ma + ' g de agua a ' + T1 + ' °C con ' + mb + ' g a ' + T2 + ' °C. ¿Qué temperatura final alcanza la mezcla?', nm(Te, C) + ' °C', { ac: ac(r2(Te), nm(Te, C), Math.round(Te * 10) / 10), x: 'El calor que cede el agua caliente lo gana la fría: T = (' + ma + '·' + T1 + ' + ' + mb + '·' + T2 + ') ÷ ' + (ma + mb) + ' ≈ ' + nm(Te, C) + ' °C.' });
    },
    fis_grav: function (u, C, r) {
      var m = ent(r, 20, 90), P = pick(r, [['la Luna', 1.62], ['Marte', 3.71], ['Júpiter', 24.79], ['Venus', 8.87]]);
      return it('corta', 'Un astronauta tiene una masa de ' + m + ' kg. ¿Cuánto pesaría en ' + P[0] + ' (g = ' + H.num(P[1], C) + ' m/s²)?', nm(m * P[1], C) + ' N', { ac: ac(r2(m * P[1]), nm(m * P[1], C)), x: 'P = m · g = ' + m + ' · ' + H.num(P[1], C) + ' = ' + nm(m * P[1], C) + ' N. Su masa sigue siendo ' + m + ' kg.' });
    },
    fis_dens: function (u, C, r) {
      var M = [['corcho', 0.24], ['madera de pino', 0.5], ['hielo', 0.92], ['aluminio', 2.7], ['hierro', 7.87], ['aceite de oliva', 0.91]], p = pick(r, M), V = 10 * ent(r, 2, 30), m = r2(p[1] * V);
      return it('corta', 'Un trozo de ' + p[0] + ' tiene una masa de ' + H.num(m, C) + ' g y un volumen de ' + V + ' cm³. Calcula su densidad. ¿Flota en agua?', H.num(p[1], C) + ' g/cm³; ' + (p[1] < 1 ? 'sí flota' : 'no flota'), { ac: ac(p[1], H.num(p[1], C)), x: 'd = m ÷ V = ' + H.num(m, C) + ' ÷ ' + V + ' = ' + H.num(p[1], C) + ' g/cm³. El agua tiene 1 g/cm³: ' + (p[1] < 1 ? 'es menos densa y flota.' : 'es más densa y se hunde.') });
    },
    fis_palanca: function (u, C, r) {
      var R = 10 * ent(r, 5, 40), bR = pick(r, [0.2, 0.25, 0.4, 0.5]), bF = pick(r, [1, 1.5, 2]), F = r2(R * bR / bF);
      return it('corta', 'Con una barra se quiere levantar una piedra de ' + R + ' N situada a ' + H.num(bR, C) + ' m del punto de apoyo. Si empujas a ' + H.num(bF, C) + ' m del apoyo, ¿qué fuerza necesitas?', H.num(F, C) + ' N', { ac: ac(F, H.num(F, C)), x: 'Ley de la palanca: F · ' + H.num(bF, C) + ' = ' + R + ' · ' + H.num(bR, C) + ' → F = ' + H.num(F, C) + ' N.' });
    },

    /* ─────────── proceso genérico (unidades sin generador propio) ─────────── */
    proc_orden: function (u, C, r) {
      var f = u.f, pasos = f && (f.t === 'flujo' || f.t === 'ciclo') && f.p ? f.p.filter(Boolean) : null, v = r();
      if (pasos && pasos.length >= 3 && v < 0.45) {
        var ps = pasos.slice(0, 6).map(function (p) { return H.sub(p, C); }), LT = 'ABCDEF', mez = H.mezcla(r, ps.map(function (p, i) { return i; }));
        var enun = 'Ordena los pasos de «' + H.sub(u.t, C) + '»:<div style="display:flex;flex-wrap:wrap;gap:1mm 5mm;margin-top:1mm">' + mez.map(function (i, j) { return '<span><b>' + LT.charAt(j) + '</b>) ' + H.esc(ps[i]) + '</span>'; }).join('') + '</div>';
        var sol = ps.map(function (p, i) { return LT.charAt(mez.indexOf(i)); }).join(' → ');
        return it('corta', enun, sol, { ac: ac(sol, sol.replace(/ → /g, ''), sol.replace(/ → /g, ', ')), x: (f.t === 'ciclo' ? 'Es un ciclo: después del último paso vuelve a empezar. ' : '') + 'Orden: ' + ps.join(' → ') + '.' });
      }
      var vf = u.vf || [];
      if (vf.length && v < 0.8) { var q = pick(r, vf); return it('vf', H.sub(q[0], C) + ' <i>Justifica tu respuesta.</i>', q[1] ? 'V' : 'F', { x: q[1] ? 'Es verdadera: ' + H.sub(pick(r, u.i || ['así lo explica la unidad.']), C) : 'Es falsa. Corrígela con lo que has aprendido en «' + H.sub(u.t, C) + '».' }); }
      var ideas = (u.i || []).map(function (s) { return H.sub(s, C); }), ks = (u.k || []).map(function (k) { return H.sub(k, C); });
      for (var t = 0; t < 6; t++) {
        var s = pick(r, ideas || ['']), k = ks.filter(function (w) { return w.length > 3 && s && s.toLowerCase().indexOf(w.toLowerCase()) >= 0; })[0];
        if (k) { var i0 = s.toLowerCase().indexOf(k.toLowerCase()); return it('corta', 'Completa: ' + H.esc(s.slice(0, i0)) + '<span style="display:inline-block;min-width:26mm;border-bottom:1px solid currentColor">&#160;</span>' + H.esc(s.slice(i0 + k.length)), s.substr(i0, k.length), { ac: ac(s.substr(i0, k.length)), x: s }); }
      }
      return it('abierta', 'Explica con tus palabras y un ejemplo: «' + H.sub(u.t, C) + '».', ideas.slice(0, 2).join(' '), { lin: 3 });
    }
  };

  /* ─────────── unidades ─────────── */
  var L = [];
  function fig(a) {
    if (!a) return undefined;
    var t = a[0], r = a.slice(1);
    if (t === 'mapa') return { t: 'mapa', c: r[0], r: r.slice(1) };
    if (t === 'linea') return { t: 'linea', h: r.map(function (x) { var p = x.split(':'); return [p[0], p.slice(1).join(':')]; }) };
    return { t: t, p: r };
  }
  var NIV = ['', 'Nivel 1 · Básico', 'Nivel 2 · Intermedio', 'Nivel 3 · Avanzado', 'Nivel 4 · Superior'];
  function u(m, id, niv, b, t, g, i, k, vf, q, f, h) {
    L.push({ m: m, id: id, niv: niv, nivN: NIV[niv] || '', b: b.split(' '), t: niv ? 'Nivel ' + niv + ' · ' + t : t, g: g, i: i, k: k, vf: (vf || '').split('|').filter(Boolean).map(function (s) { return [s.slice(2), s.charAt(0) === 'V']; }), q: q || [], f: fig(f), h: h, plus: true });
  }

  /* Geometría y Álgebra — Nivel 1 · Básico */
  u('geoalg', 'ga1_angulos', 1, 'pri3', 'Punto, recta y ángulo', 'ga_angulos', ['Un punto marca una posición; una recta es una línea que no tiene principio ni fin.', 'Un ángulo es la abertura entre dos semirrectas que salen del mismo punto, el vértice.', 'Los ángulos se miden en grados con el transportador: el recto mide 90° y el llano 180°.', 'Dos ángulos son complementarios si suman 90° y suplementarios si suman 180°.'], ['vértice', 'ángulo recto', 'transportador', 'complementarios', 'suplementarios'], 'V:Un ángulo recto mide 90°.|F:Un ángulo obtuso mide menos de 90°.|V:Los ángulos de un triángulo suman 180°.', ['Busca en tu aula tres ángulos rectos y uno agudo.', '¿Qué ángulo forman las agujas del reloj a las 3:00?'], ['mapa', 'Ángulos', 'agudo', 'recto', 'obtuso', 'llano'], 'Coloca el centro del transportador justo en el vértice.');
  u('geoalg', 'ga1_poligonos', 1, 'pri3', 'Polígonos y perímetro', 'ga_perimetro', ['Un polígono es una figura plana cerrada formada por segmentos.', 'Según sus lados puede ser triángulo, cuadrilátero, pentágono, hexágono…', 'El perímetro es la longitud del contorno: la suma de todos los lados.', 'En un polígono regular basta multiplicar el lado por el número de lados.'], ['polígono', 'lado', 'perímetro', 'polígono regular', 'diagonal'], 'V:El hexágono tiene seis lados.|F:El perímetro se mide en m².|V:Un cuadrado es un polígono regular.', ['Mide el perímetro de tu cuaderno.', '¿Cuántas diagonales tiene un pentágono?'], ['mapa', 'Polígonos', 'triángulo', 'cuadrilátero', 'pentágono', 'hexágono']);
  u('geoalg', 'ga1_area', 1, 'pri3', 'Área de las figuras planas', 'ga_area', ['El área mide la superficie que ocupa una figura y se expresa en unidades cuadradas.', 'El área del rectángulo es base por altura; la del triángulo, la mitad.', 'El área del círculo es π por el radio al cuadrado; π vale aproximadamente 3,14.', 'Para figuras compuestas se descompone en figuras conocidas y se suman sus áreas.'], ['área', 'base', 'altura', 'radio', 'π'], 'V:El área del triángulo es base × altura ÷ 2.|F:π vale exactamente 3.|V:1 m² son 10 000 cm².', ['Calcula el área de tu habitación en m².', 'Dibuja una figura compuesta y calcula su área.'], ['flujo', 'observar la figura', 'descomponer', 'medir', 'aplicar la fórmula', 'sumar'], 'Anota siempre la unidad al cuadrado.');
  u('geoalg', 'ga1_patrones', 1, 'pri3', 'Patrones y secuencias', 'al_patron', ['Un patrón es una regla que se repite y permite predecir lo que viene después.', 'En una secuencia aritmética se suma siempre la misma cantidad, la diferencia.', 'Con la regla podemos calcular cualquier término sin escribirlos todos.', 'El álgebra nace de describir patrones con letras.'], ['patrón', 'secuencia', 'término', 'diferencia', 'regla'], 'V:En 3, 6, 9, 12 la diferencia es 3.|F:Una secuencia no puede decrecer.|V:Con la regla se calcula cualquier término.', ['Inventa una secuencia y pide a un compañero que descubra la regla.', 'Busca un patrón en las baldosas de tu casa.'], ['flujo', 'observar', 'buscar la diferencia', 'escribir la regla', 'comprobar']);
  u('geoalg', 'ga1_expr', 1, 'pri3', 'El lenguaje algebraico', 'al_valor', ['En álgebra una letra representa un número desconocido o que puede variar.', '«El doble de un número» se escribe 2x; «un número más cinco», x + 5.', 'El valor numérico se obtiene al sustituir la letra por un número.', 'Los términos semejantes tienen la misma parte literal y se pueden sumar.'], ['variable', 'expresión algebraica', 'valor numérico', 'coeficiente', 'términos semejantes'], 'V:2x + 3x = 5x.|F:x + x = x².|V:Si x = 4, 3x = 12.', ['Escribe en lenguaje algebraico tu edad dentro de 5 años.', '¿Por qué no se pueden sumar 2x y 3y?'], ['mapa', 'Expresión algebraica', 'coeficiente', 'parte literal', 'grado', 'valor numérico']);
  u('geoalg', 'ga1_ecua', 1, 'pri3', 'Ecuaciones: la balanza', 'al_ecua1', ['Una ecuación es una igualdad con una incógnita.', 'Resolverla es encontrar el valor que hace cierta la igualdad.', 'Como en una balanza, lo que se hace en un lado se hace en el otro.', 'Siempre se comprueba sustituyendo la solución.'], ['ecuación', 'incógnita', 'miembro', 'solución', 'comprobación'], 'V:En x + 3 = 7, x = 4.|F:Se puede sumar solo en un miembro.|V:La solución se comprueba sustituyendo.', ['Plantea una ecuación con la edad de alguien de tu familia.', '¿Por qué la balanza es un buen modelo de ecuación?'], ['flujo', 'leer el problema', 'plantear', 'despejar', 'resolver', 'comprobar'], 'Lo que haces en un platillo, hazlo en el otro.');
  /* Nivel 2 · Intermedio */
  u('geoalg', 'ga2_pitagoras', 2, 'sec', 'El teorema de Pitágoras', 'ga_pitagoras', ['En todo triángulo rectángulo, la hipotenusa al cuadrado es la suma de los cuadrados de los catetos.', 'La hipotenusa es el lado opuesto al ángulo recto y siempre es el mayor.', 'Las ternas pitagóricas, como 3-4-5, dan triángulos rectángulos con lados enteros.', 'Sirve para calcular distancias que no se pueden medir directamente.'], ['hipotenusa', 'catetos', 'terna pitagórica', 'ángulo recto', 'raíz cuadrada'], 'V:3² + 4² = 5².|F:El teorema vale en cualquier triángulo.|V:La hipotenusa es el lado mayor.', ['Comprueba si la esquina de tu mesa es recta con la terna 3-4-5.', 'Calcula la diagonal de una pantalla de 16 × 9.'], ['flujo', 'identificar el ángulo recto', 'nombrar catetos e hipotenusa', 'plantear', 'despejar', 'raíz cuadrada']);
  u('geoalg', 'ga2_tales', 2, 'sec', 'Semejanza y teorema de Tales', 'ga_tales', ['Dos figuras son semejantes si tienen la misma forma y distinto tamaño.', 'En figuras semejantes los ángulos son iguales y los lados, proporcionales.', 'Tales midió la altura de las pirámides comparando su sombra con la de un bastón.', 'Si la razón de semejanza es k, las áreas se multiplican por k² y los volúmenes por k³.'], ['semejanza', 'razón de semejanza', 'proporcional', 'teorema de Tales', 'escala'], 'V:Las fotos ampliadas son semejantes.|F:En figuras semejantes los ángulos cambian.|V:Con razón 2 el área se multiplica por 4.', ['Mide la altura de un árbol con su sombra.', 'Busca un plano de tu ciudad y calcula su escala.'], ['mapa', 'Semejanza', 'ángulos iguales', 'lados proporcionales', 'razón k', 'escala']);
  u('geoalg', 'ga2_volumen', 2, 'sec', 'Áreas y volúmenes de cuerpos', 'ga_volumen', ['Los poliedros tienen caras planas; los cuerpos redondos tienen superficies curvas.', 'El volumen de un prisma o un cilindro es el área de la base por la altura.', 'El volumen de la pirámide y del cono es un tercio del prisma o cilindro de igual base y altura.', 'Un litro equivale a un decímetro cúbico.'], ['poliedro', 'prisma', 'cilindro', 'volumen', 'litro'], 'V:1 dm³ = 1 L.|F:El cono tiene el mismo volumen que el cilindro de igual base.|V:El cubo es un prisma.', ['Calcula cuántos litros caben en la nevera de tu casa.', '¿Qué envase aprovecha mejor el material: una lata o una caja?'], ['mapa', 'Cuerpos geométricos', 'prisma', 'pirámide', 'cilindro', 'cono', 'esfera']);
  u('geoalg', 'ga2_polinomios', 2, 'sec', 'Monomios y polinomios', 'al_poli', ['Un monomio es un producto de un número por letras con exponentes naturales.', 'Un polinomio es una suma de monomios; su grado es el mayor exponente.', 'Para sumar polinomios se suman los términos semejantes.', 'Para multiplicar se aplica la propiedad distributiva término a término.'], ['monomio', 'polinomio', 'grado', 'término independiente', 'propiedad distributiva'], 'V:x² + 3x − 1 es de grado 2.|F:3x y 3x² son semejantes.|V:El término independiente no lleva letra.', ['Escribe el área de un rectángulo de lados x y x + 3 como polinomio.', '¿Qué grado tiene el volumen de un cubo de arista x?'], ['flujo', 'ordenar', 'agrupar semejantes', 'operar', 'simplificar']);
  u('geoalg', 'ga2_sistemas', 2, 'sec', 'Sistemas de dos ecuaciones', 'al_sistema', ['Un sistema son dos ecuaciones con dos incógnitas que deben cumplirse a la vez.', 'Se resuelve por sustitución, igualación o reducción.', 'Gráficamente, la solución es el punto donde se cortan las dos rectas.', 'Un sistema puede tener una solución, infinitas o ninguna.'], ['sistema', 'sustitución', 'igualación', 'reducción', 'solución'], 'V:La solución es el punto de corte de las rectas.|F:Todos los sistemas tienen solución.|V:La reducción elimina una incógnita.', ['Plantea un sistema con precios de dos productos de tu mercado.', '¿Qué significa que dos rectas sean paralelas?'], ['flujo', 'plantear', 'elegir método', 'eliminar una incógnita', 'resolver', 'comprobar']);
  u('geoalg', 'ga2_lineal', 2, 'sec', 'Función lineal y pendiente', 'al_pendiente', ['Una función lineal se escribe y = mx + b y su gráfica es una recta.', 'La pendiente m indica cuánto sube y por cada unidad que avanza x.', 'La ordenada en el origen b es el punto donde la recta corta el eje Y.', 'Si m es negativa, la recta baja de izquierda a derecha.'], ['función lineal', 'pendiente', 'ordenada en el origen', 'gráfica', 'proporcionalidad'], 'V:En y = 2x + 1 la pendiente es 2.|F:Una recta con pendiente negativa sube.|V:b es el corte con el eje Y.', ['Representa el precio de un taxi según los kilómetros.', '¿Qué pendiente tiene una rampa que sube 1 m cada 12 m?'], ['flujo', 'tabla de valores', 'representar puntos', 'trazar la recta', 'leer la pendiente']);
  /* Nivel 3 · Avanzado */
  u('geoalg', 'ga3_trigo', 3, 'bach', 'Trigonometría', 'ga_trigo', ['Seno, coseno y tangente relacionan los ángulos de un triángulo rectángulo con sus lados.', 'sen α = opuesto ÷ hipotenusa; cos α = contiguo ÷ hipotenusa; tg α = opuesto ÷ contiguo.', 'Se cumple siempre que sen² α + cos² α = 1.', 'Con la tangente del ángulo de elevación se calculan alturas inaccesibles.'], ['seno', 'coseno', 'tangente', 'ángulo de elevación', 'identidad fundamental'], 'V:sen 30° = 0,5.|F:El coseno puede valer 2.|V:tg 45° = 1.', ['Calcula la altura de tu escuela con un transportador y una cinta métrica.', '¿Por qué el seno nunca es mayor que 1?'], ['mapa', 'Razones trigonométricas', 'seno', 'coseno', 'tangente', 'radianes']);
  u('geoalg', 'ga3_cuadratica', 3, 'bach', 'Ecuaciones de segundo grado', 'al_cuad', ['Una ecuación de segundo grado tiene la forma ax² + bx + c = 0.', 'Se resuelve con la fórmula x = (−b ± √(b² − 4ac)) ÷ 2a.', 'El discriminante Δ = b² − 4ac indica cuántas soluciones reales hay.', 'Si Δ > 0 hay dos soluciones, si Δ = 0 una doble y si Δ < 0 ninguna real.'], ['discriminante', 'fórmula general', 'raíces', 'solución doble', 'coeficientes'], 'V:Si Δ < 0 no hay soluciones reales.|F:Toda ecuación de segundo grado tiene dos soluciones reales.|V:x² − 9 = 0 tiene soluciones 3 y −3.', ['Plantea el área de un terreno cuadrado ampliado como ecuación de segundo grado.', '¿Qué significa geométricamente que Δ = 0?'], ['flujo', 'ordenar la ecuación', 'identificar a, b y c', 'calcular Δ', 'aplicar la fórmula', 'comprobar']);
  u('geoalg', 'ga3_factor', 3, 'bach', 'Productos notables y factorización', 'al_notables', ['Los productos notables son multiplicaciones que se resuelven con una regla fija.', '(a + b)² = a² + 2ab + b² y (a − b)² = a² − 2ab + b².', 'Suma por diferencia: (a + b)(a − b) = a² − b².', 'Factorizar es escribir un polinomio como producto de factores más simples.'], ['producto notable', 'cuadrado de un binomio', 'diferencia de cuadrados', 'factorizar', 'factor común'], 'V:(x + 3)² = x² + 6x + 9.|F:(x + 3)² = x² + 9.|V:x² − 16 = (x + 4)(x − 4).', ['Demuestra (a + b)² dibujando un cuadrado dividido en cuatro partes.', 'Factoriza el área x² + 5x de un rectángulo.'], ['flujo', 'sacar factor común', 'buscar identidad notable', 'probar raíces', 'escribir el producto']);
  u('geoalg', 'ga3_analitica', 3, 'bach', 'Geometría analítica en el plano', 'ga_analitica', ['En el plano cartesiano cada punto se describe con dos coordenadas (x, y).', 'La distancia entre dos puntos se calcula con el teorema de Pitágoras.', 'El punto medio es la media de las coordenadas de los extremos.', 'Dos rectas son paralelas si tienen la misma pendiente y perpendiculares si el producto de pendientes es −1.'], ['coordenadas', 'distancia', 'punto medio', 'rectas paralelas', 'rectas perpendiculares'], 'V:El punto medio de (0, 0) y (4, 2) es (2, 1).|F:Rectas paralelas tienen pendientes opuestas.|V:La distancia usa Pitágoras.', ['Sitúa tu casa y tu escuela en una cuadrícula y calcula la distancia.', '¿Cómo sabes si tres puntos están alineados?'], ['mapa', 'Plano cartesiano', 'ejes', 'cuadrantes', 'distancia', 'punto medio']);
  u('geoalg', 'ga3_vectores', 3, 'bach', 'Vectores en el plano', 'ga_vector', ['Un vector tiene módulo, dirección y sentido.', 'Se suman componente a componente o con la regla del paralelogramo.', 'El producto escalar u · v = u₁v₁ + u₂v₂ es un número.', 'Si el producto escalar es cero, los vectores son perpendiculares.'], ['vector', 'módulo', 'componentes', 'producto escalar', 'perpendicular'], 'V:El módulo de (3, 4) es 5.|F:El producto escalar es un vector.|V:(1, 0) y (0, 1) son perpendiculares.', ['Dibuja con vectores el camino de tu casa a la escuela.', '¿Para qué sirven los vectores en un videojuego?'], ['mapa', 'Vector', 'módulo', 'dirección', 'sentido', 'origen']);
  u('geoalg', 'ga3_inecua', 3, 'bach', 'Inecuaciones', 'al_inecua', ['Una inecuación es una desigualdad con una incógnita.', 'Su solución suele ser un intervalo, no un solo número.', 'Al multiplicar o dividir por un número negativo, la desigualdad cambia de sentido.', 'Las soluciones se representan en la recta numérica.'], ['inecuación', 'desigualdad', 'intervalo', 'recta numérica', 'sentido'], 'V:−2x < 6 equivale a x > −3.|F:Una inecuación tiene siempre una única solución.|V:Los intervalos se dibujan en la recta.', ['Escribe como inecuación: «gastar menos de lo que ganas».', '¿Por qué cambia el sentido al dividir entre un negativo?'], ['flujo', 'agrupar', 'despejar', 'revisar el signo', 'representar el intervalo']);
  /* Nivel 4 · Superior */
  u('geoalg', 'ga4_matrices', 4, 'adu', 'Matrices y determinantes', 'al_det', ['Una matriz es una tabla de números ordenada en filas y columnas.', 'Las matrices se suman elemento a elemento y se multiplican filas por columnas.', 'El determinante es un número asociado a una matriz cuadrada.', 'Una matriz tiene inversa solo si su determinante es distinto de cero.'], ['matriz', 'determinante', 'matriz inversa', 'Sarrus', 'matriz cuadrada'], 'V:Una matriz con determinante 0 no tiene inversa.|F:El producto de matrices es siempre conmutativo.|V:La regla de Sarrus sirve para 3 × 3.', ['Organiza en una matriz las ventas de tres productos en tres meses.', '¿Qué significa geométricamente un determinante 2 × 2?'], ['mapa', 'Matrices', 'suma', 'producto', 'determinante', 'inversa']);
  u('geoalg', 'ga4_gauss', 4, 'adu', 'Sistemas lineales: Gauss y Cramer', 'al_cramer', ['Un sistema lineal puede escribirse en forma matricial A · X = B.', 'El método de Gauss transforma el sistema en uno escalonado equivalente.', 'La regla de Cramer resuelve sistemas con determinante distinto de cero.', 'El teorema de Rouché-Frobenius clasifica los sistemas según los rangos.'], ['Gauss', 'Cramer', 'sistema escalonado', 'rango', 'compatible determinado'], 'V:Si det(A) ≠ 0 el sistema tiene solución única.|F:Gauss solo sirve para dos ecuaciones.|V:Un sistema escalonado se resuelve de abajo arriba.', ['Plantea un sistema 3 × 3 con los precios de tres alimentos.', '¿Qué método elegirías para un sistema de 10 ecuaciones? ¿Por qué?'], ['flujo', 'escribir la matriz ampliada', 'escalonar', 'estudiar rangos', 'despejar', 'comprobar']);
  u('geoalg', 'ga4_conicas', 4, 'adu', 'Las cónicas', 'ga_circ', ['Las cónicas se obtienen al cortar un cono con un plano: circunferencia, elipse, parábola e hipérbola.', 'La circunferencia es el conjunto de puntos a igual distancia (radio) de un centro.', 'Su ecuación es (x − a)² + (y − b)² = r².', 'Las órbitas de los planetas son elipses y las antenas parabólicas usan la parábola.'], ['cónica', 'circunferencia', 'elipse', 'parábola', 'hipérbola'], 'V:Las órbitas planetarias son elipses.|F:La parábola es una curva cerrada.|V:La circunferencia es una elipse especial.', ['Dibuja una elipse con dos chinchetas y un cordel.', 'Busca una parábola en un objeto de tu ciudad.'], ['mapa', 'Cónicas', 'circunferencia', 'elipse', 'parábola', 'hipérbola']);
  u('geoalg', 'ga4_complejos', 4, 'adu', 'Números complejos', 'al_complejo', ['Los números complejos amplían los reales con la unidad imaginaria i, que cumple i² = −1.', 'Un complejo se escribe a + bi: a es la parte real y b la imaginaria.', 'Se representan como puntos o vectores en el plano complejo.', 'El módulo de a + bi es √(a² + b²).'], ['unidad imaginaria', 'parte real', 'parte imaginaria', 'módulo', 'plano complejo'], 'V:i² = −1.|F:Los complejos no se pueden representar.|V:El módulo de 3 + 4i es 5.', ['Resuelve x² + 1 = 0 con números complejos.', '¿En qué ramas de la ingeniería se usan los complejos?'], ['mapa', 'Números complejos', 'binómica', 'polar', 'módulo', 'argumento']);
  u('geoalg', 'ga4_espacio', 4, 'adu', 'Geometría en el espacio', 'ga_prodvec', ['En el espacio cada punto tiene tres coordenadas (x, y, z).', 'El producto escalar mide ángulos; el producto vectorial da un vector perpendicular a los dos.', 'El módulo del producto vectorial es el área del paralelogramo que forman los vectores.', 'Un plano se describe con un punto y un vector normal: Ax + By + Cz + D = 0.'], ['espacio tridimensional', 'producto vectorial', 'vector normal', 'plano', 'recta en el espacio'], 'V:u × v es perpendicular a u y a v.|F:El producto vectorial es un número.|V:Un plano tiene un vector normal.', ['Describe con coordenadas la posición de una lámpara en tu habitación.', '¿Para qué usa el producto vectorial un programa de 3D?'], ['mapa', 'Espacio', 'puntos', 'vectores', 'rectas', 'planos']);
  u('geoalg', 'ga4_sucesiones', 4, 'adu', 'Sucesiones y progresiones', 'al_progresion', ['Una sucesión es una lista ordenada de números que siguen una ley.', 'En una progresión aritmética se suma la diferencia d; en una geométrica se multiplica por la razón r.', 'La suma de n términos aritméticos es n · (a₁ + aₙ) ÷ 2.', 'El interés compuesto y el crecimiento de poblaciones son progresiones geométricas.'], ['sucesión', 'progresión aritmética', 'progresión geométrica', 'diferencia', 'razón'], 'V:2, 6, 18, 54 es geométrica de razón 3.|F:1, 4, 9, 16 es aritmética.|V:Gauss sumó de 1 a 100 con la fórmula aritmética.', ['Calcula cuánto ahorras en un año si cada mes guardas un poco más que el anterior.', '¿Qué crece más rápido: una progresión aritmética o una geométrica?'], ['flujo', 'identificar el tipo', 'hallar d o r', 'término general', 'suma']);

  /* Cálculo — Nivel 1 · Básico */
  u('calculo', 'ca1_funciones', 1, 'sec', 'Funciones: dominio e imagen', 'ca_eval', ['Una función asigna a cada valor de x un único valor de y.', 'El dominio son los valores de x para los que la función existe.', 'La imagen o recorrido son los valores que toma y.', 'No se puede dividir entre cero ni hacer raíces cuadradas de números negativos.'], ['función', 'dominio', 'imagen', 'variable independiente', 'gráfica'], 'V:1/x no existe en x = 0.|F:Una función puede dar dos valores de y para un mismo x.|V:√x solo existe para x ≥ 0.', ['Escribe una función que relacione las horas de trabajo con el salario.', '¿Qué dominio tiene la función «edad de una persona»?'], ['flujo', 'variable x', 'regla f', 'valor y', 'gráfica']);
  u('calculo', 'ca1_tvm', 1, 'sec', 'Tasa de variación media', 'ca_tvm', ['La tasa de variación media mide cuánto cambia una función en un intervalo.', 'Se calcula como (f(b) − f(a)) ÷ (b − a).', 'Es la pendiente de la recta que une dos puntos de la gráfica.', 'La velocidad media de un viaje es una tasa de variación media.'], ['tasa de variación', 'intervalo', 'pendiente', 'velocidad media', 'secante'], 'V:La velocidad media es una TVM.|F:La TVM no puede ser negativa.|V:La TVM es la pendiente de la secante.', ['Calcula la velocidad media de un viaje que hayas hecho.', 'Busca un dato de tu ciudad que haya crecido en los últimos años y calcula su TVM.'], ['flujo', 'elegir el intervalo', 'calcular f(a) y f(b)', 'restar', 'dividir']);
  u('calculo', 'ca1_graficas', 1, 'sec', 'Crecimiento, máximos y mínimos', 'ca_vertice', ['Una función crece si al aumentar x aumenta y.', 'Los máximos y mínimos son los puntos más altos o más bajos de un tramo.', 'La parábola tiene un vértice que es su máximo o su mínimo.', 'Si el coeficiente de x² es positivo la parábola abre hacia arriba.'], ['creciente', 'decreciente', 'máximo', 'mínimo', 'vértice'], 'V:y = x² tiene un mínimo en (0, 0).|F:y = −x² abre hacia arriba.|V:El vértice es un extremo de la parábola.', ['Dibuja la temperatura de un día y marca el máximo y el mínimo.', '¿Dónde alcanza su altura máxima un balón lanzado?'], ['mapa', 'Gráfica', 'crecimiento', 'máximo', 'mínimo', 'cortes con los ejes']);
  u('calculo', 'ca1_limites', 1, 'sec', 'Idea de límite', 'ca_limite', ['El límite describe a qué valor se acerca una función cuando x se acerca a un número.', 'Si la función es continua, el límite coincide con el valor de la función.', 'La indeterminación 0/0 se resuelve simplificando.', 'Cuando x tiende a infinito, en un cociente de polinomios mandan los términos de mayor grado.'], ['límite', 'tender a', 'indeterminación', 'infinito', 'continuidad'], 'V:El límite de x² cuando x → 3 es 9.|F:0/0 siempre vale 0.|V:El límite puede existir aunque la función no esté definida en ese punto.', ['Calcula con una calculadora 1/x para x = 10, 100, 1000… ¿A qué se acerca?', '¿Qué quiere decir «acercarse sin llegar»?'], ['flujo', 'sustituir', 'detectar indeterminación', 'simplificar', 'calcular el límite']);
  /* Nivel 2 · Intermedio */
  u('calculo', 'ca2_derivada', 2, 'bach', 'La derivada', 'ca_deriv', ['La derivada mide la variación instantánea de una función.', 'Es el límite de la tasa de variación media cuando el intervalo se hace cero.', 'Geométricamente es la pendiente de la recta tangente.', 'La derivada de xⁿ es n · xⁿ⁻¹.'], ['derivada', 'tasa instantánea', 'recta tangente', 'regla de la potencia', 'límite'], "V:La derivada de x³ es 3x².|F:La derivada de una constante es 1.|V:La derivada es la pendiente de la tangente.", ['¿Qué mide el velocímetro de un coche: la velocidad media o la instantánea?', 'Deriva la función que da el área de un cuadrado de lado x.'], ['flujo', 'tasa media', 'límite h → 0', 'derivada', 'pendiente de la tangente']);
  u('calculo', 'ca2_reglas', 2, 'bach', 'Reglas de derivación', 'ca_cadena', ['La derivada de una suma es la suma de las derivadas.', 'Regla del producto: (u · v)\' = u\' · v + u · v\'.', 'Regla de la cadena: la derivada de f(g(x)) es f\'(g(x)) · g\'(x).', 'La derivada de eˣ es eˣ y la de sen x es cos x.'], ['regla del producto', 'regla de la cadena', 'función compuesta', 'exponencial', 'trigonométrica'], "V:(eˣ)' = eˣ.|F:(u·v)' = u'·v'.|V:(sen x)' = cos x.", ['Explica la regla de la cadena con dos engranajes.', 'Deriva la función que describe un muelle que oscila.'], ['flujo', 'identificar la función exterior', 'derivarla', 'derivar la interior', 'multiplicar']);
  u('calculo', 'ca2_tangente', 2, 'bach', 'Recta tangente', 'ca_tangente', ['La recta tangente toca la curva en un punto y tiene su misma inclinación.', 'Su pendiente es el valor de la derivada en ese punto.', 'La ecuación es y − f(a) = f\'(a) · (x − a).', 'Cerca del punto, la tangente aproxima muy bien a la función.'], ['recta tangente', 'pendiente', 'punto de tangencia', 'aproximación lineal', 'ecuación punto-pendiente'], "V:La pendiente de la tangente es f'(a).|F:La tangente corta siempre a la curva en dos puntos.|V:La tangente aproxima la función cerca del punto.", ['Dibuja una curva y traza a mano su tangente en tres puntos.', '¿Por qué un GPS puede tratar un tramo corto de carretera curva como recto?'], ['flujo', 'calcular f(a)', "derivar y calcular f'(a)", 'punto-pendiente', 'simplificar']);
  u('calculo', 'ca2_optim', 2, 'bach', 'Optimización', 'ca_optim', ['Optimizar es encontrar el máximo o el mínimo de una magnitud.', 'En los extremos de una función derivable la derivada vale cero.', 'La segunda derivada dice si el punto es máximo (negativa) o mínimo (positiva).', 'Se usa para ahorrar material, tiempo o dinero.'], ['optimización', 'punto crítico', 'máximo', 'mínimo', 'segunda derivada'], "V:En un máximo f'(x) = 0.|F:Si f''(x) > 0 hay un máximo.|V:Optimizar sirve para ahorrar material.", ['¿Qué forma debe tener una lata para gastar el mínimo de metal?', 'Busca un problema de tu barrio que se pueda optimizar.'], ['flujo', 'definir la variable', 'escribir la función', 'derivar e igualar a 0', 'comprobar máximo o mínimo', 'interpretar']);
  /* Nivel 3 · Avanzado */
  u('calculo', 'ca3_primitivas', 3, 'bach', 'Integral indefinida', 'ca_primitiva', ['Integrar es el proceso inverso de derivar.', 'Una primitiva de f es una función F cuya derivada es f.', '∫ xⁿ dx = xⁿ⁺¹ ÷ (n + 1) + C, para n ≠ −1.', 'La constante C aparece porque la derivada de una constante es cero.'], ['primitiva', 'integral indefinida', 'constante de integración', 'integración inmediata', 'antiderivada'], 'V:∫ 2x dx = x² + C.|F:La integral no necesita la constante C.|V:Integrar y derivar son procesos inversos.', ['Comprueba derivando que tu resultado es correcto.', '¿Por qué hay infinitas primitivas de una misma función?'], ['flujo', 'separar términos', 'aplicar la regla', 'añadir C', 'comprobar derivando']);
  u('calculo', 'ca3_definida', 3, 'bach', 'Integral definida y regla de Barrow', 'ca_definida', ['La integral definida entre a y b suma infinitos rectángulos muy finos bajo la curva.', 'La regla de Barrow dice: ∫ de a a b f(x) dx = F(b) − F(a).', 'Si la función es negativa, la integral sale negativa.', 'Newton y Leibniz descubrieron la relación entre derivadas e integrales.'], ['integral definida', 'regla de Barrow', 'límites de integración', 'suma de Riemann', 'teorema fundamental'], 'V:∫₀¹ 2x dx = 1.|F:La integral definida siempre es positiva.|V:Barrow usa una primitiva.', ['Estima el área de una hoja dibujándola sobre papel cuadriculado.', '¿Qué representa la integral de la velocidad?'], ['flujo', 'hallar una primitiva', 'evaluar en b', 'evaluar en a', 'restar']);
  u('calculo', 'ca3_area', 3, 'bach', 'Áreas con integrales', 'ca_area', ['El área entre una curva y el eje X se calcula con la integral definida.', 'Primero se buscan los puntos de corte para fijar los límites.', 'El área entre dos curvas es la integral de la de arriba menos la de abajo.', 'Las áreas se toman siempre positivas.'], ['área', 'puntos de corte', 'curva superior', 'curva inferior', 'valor absoluto'], 'V:El área entre curvas es ∫ (arriba − abajo).|F:El área puede ser negativa.|V:Primero se calculan los puntos de corte.', ['Calcula el área de la fachada de un arco parabólico.', '¿Cómo calcularías el área de un lago con un mapa?'], ['flujo', 'dibujar', 'puntos de corte', 'plantear la integral', 'Barrow', 'área positiva']);
  u('calculo', 'ca3_asintotas', 3, 'bach', 'Continuidad y asíntotas', 'ca_asintota', ['Una función es continua si su gráfica se puede dibujar sin levantar el lápiz.', 'Una asíntota vertical aparece donde la función se va a infinito.', 'Una asíntota horizontal es el valor al que se acerca la función cuando x → ∞.', 'Las funciones racionales suelen tener asíntotas.'], ['continuidad', 'discontinuidad', 'asíntota vertical', 'asíntota horizontal', 'función racional'], 'V:1/x tiene asíntota vertical en x = 0.|F:Las funciones polinómicas tienen asíntotas verticales.|V:Un polinomio es continuo.', ['Dibuja la gráfica de 1/x con una tabla de valores.', 'Busca un fenómeno que se acerque a un valor sin alcanzarlo nunca.'], ['flujo', 'dominio', 'límites laterales', 'asíntota vertical', 'límite en el infinito', 'asíntota horizontal']);
  /* Nivel 4 · Superior */
  u('calculo', 'ca4_edo', 4, 'adu', 'Ecuaciones diferenciales y crecimiento', 'ca_expo', ['Una ecuación diferencial relaciona una función con sus derivadas.', 'y\' = k · y describe el crecimiento (k > 0) o el decrecimiento (k < 0) exponencial.', 'Su solución es y = y₀ · eᵏᵗ.', 'Modela poblaciones, intereses, enfriamiento y desintegración radiactiva.'], ['ecuación diferencial', 'crecimiento exponencial', 'semivida', 'condición inicial', 'separación de variables'], "V:y' = ky tiene solución exponencial.|F:La semivida depende de la masa inicial.|V:El interés compuesto crece exponencialmente.", ['Busca la población de tu ciudad en dos años distintos y estima su tasa de crecimiento.', '¿Por qué el café se enfría rápido al principio y luego más despacio?'], ['flujo', 'plantear el modelo', 'separar variables', 'integrar', 'condición inicial', 'interpretar']);
  u('calculo', 'ca4_series', 4, 'adu', 'Series numéricas', 'ca_serie', ['Una serie es la suma de infinitos términos de una sucesión.', 'Una serie converge si sus sumas parciales se acercan a un número.', 'La serie geométrica de razón |r| < 1 suma a₁ ÷ (1 − r).', 'La paradoja de Aquiles y la tortuga se resuelve con una serie convergente.'], ['serie', 'convergencia', 'suma parcial', 'serie geométrica', 'divergencia'], 'V:1 + 1/2 + 1/4 + … = 2.|F:Toda suma infinita es infinita.|V:La serie armónica diverge.', ['Dobla una hoja por la mitad una y otra vez: ¿qué serie representa?', 'Explica la paradoja de Aquiles con tus palabras.'], ['flujo', 'identificar la serie', 'estudiar la razón', 'criterio de convergencia', 'calcular la suma']);
  u('calculo', 'ca4_taylor', 4, 'adu', 'Polinomios de Taylor', 'ca_taylor', ['El polinomio de Taylor aproxima una función con un polinomio cerca de un punto.', 'Cuantos más términos, mejor es la aproximación.', 'eˣ ≈ 1 + x + x²/2 + x³/6 cerca de 0.', 'Las calculadoras usan aproximaciones de este tipo para el seno o la exponencial.'], ['polinomio de Taylor', 'aproximación', 'orden', 'error', 'serie de potencias'], 'V:sen x ≈ x para x pequeño.|F:Taylor es exacto en cualquier punto.|V:Más términos dan mejor aproximación.', ['Compara con una calculadora eˣ y su aproximación para x = 0,5.', '¿Por qué los ingenieros usan sen x ≈ x en péndulos?'], ['flujo', 'elegir el punto', 'calcular derivadas', 'construir el polinomio', 'estimar el error']);
  u('calculo', 'ca4_varias', 4, 'adu', 'Funciones de varias variables', 'ca_parcial', ['Muchas magnitudes dependen de varias variables, como la temperatura en un mapa.', 'La derivada parcial mide el cambio respecto a una variable dejando fijas las demás.', 'El gradiente señala la dirección de máximo crecimiento.', 'Las curvas de nivel de un mapa topográfico son cortes de una función de dos variables.'], ['derivada parcial', 'gradiente', 'curvas de nivel', 'función de dos variables', 'superficie'], 'V:Las curvas de nivel unen puntos de igual valor.|F:Una derivada parcial deriva todas las variables a la vez.|V:El gradiente indica la máxima subida.', ['Mira un mapa topográfico y señala por dónde subirías más rápido.', '¿De qué variables depende el precio de una vivienda?'], ['mapa', 'Varias variables', 'derivadas parciales', 'gradiente', 'curvas de nivel', 'extremos']);

  /* Física — unidades nuevas */
  u('fisica', 'fis_mrua', 0, 'sec bach', 'Movimiento acelerado y caída libre', 'fis_mrua', ['En el movimiento uniformemente acelerado la velocidad cambia lo mismo cada segundo.', 'v = v₀ + a·t y d = v₀·t + ½·a·t².', 'En caída libre todos los cuerpos aceleran igual: g ≈ 9,8 m/s².', 'Galileo mostró que, sin aire, una pluma y un martillo caen a la vez.'], ['aceleración', 'caída libre', 'gravedad', 'velocidad inicial', 'MRUA'], 'V:En el vacío todos los cuerpos caen igual.|F:Un cuerpo más pesado cae siempre antes.|V:g vale unos 9,8 m/s².', ['Deja caer una hoja plana y otra arrugada. ¿Qué observas?', 'Mide cuánto tarda en caer una pelota desde tu mesa.'], ['flujo', 'datos', 'elegir la ecuación', 'sustituir', 'calcular', 'unidades']);
  u('fisica', 'fis_newton', 0, 'sec bach', 'Las leyes de Newton', 'fis_newton', ['Primera ley: un cuerpo sigue en reposo o en movimiento uniforme si no actúa ninguna fuerza neta.', 'Segunda ley: F = m · a.', 'Tercera ley: a toda acción corresponde una reacción igual y opuesta.', 'El peso es la fuerza con que la Tierra atrae a un cuerpo: P = m · g.'], ['inercia', 'fuerza neta', 'acción y reacción', 'peso', 'masa'], 'V:F = m · a.|F:Masa y peso son lo mismo.|V:Al remar, el agua empuja la barca.', ['Explica con la tercera ley cómo avanza un cohete.', '¿Por qué hay que ponerse el cinturón de seguridad?'], ['mapa', 'Leyes de Newton', 'inercia', 'F = m·a', 'acción y reacción', 'peso']);
  u('fisica', 'fis_trabajo', 0, 'sec bach', 'Trabajo y potencia', 'fis_trabajo', ['Se realiza trabajo cuando una fuerza desplaza un cuerpo: W = F · d.', 'El trabajo se mide en julios (J).', 'La potencia es el trabajo por unidad de tiempo: P = W ÷ t, en vatios (W).', 'El kilovatio hora (kWh) es la unidad de energía de la factura de la luz.'], ['trabajo', 'julio', 'potencia', 'vatio', 'kilovatio hora'], 'V:1 W = 1 J/s.|F:Sostener un peso quieto es hacer trabajo físico.|V:El kWh es una unidad de energía.', ['Busca la potencia de tres aparatos de tu casa en su etiqueta.', 'Calcula la energía que gasta una bombilla de 10 W encendida 5 h.'], ['flujo', 'fuerza', 'desplazamiento', 'trabajo', 'tiempo', 'potencia']);
  u('fisica', 'fis_electr', 0, 'sec bach fp', 'Electricidad y ley de Ohm', 'fis_ohm', ['La corriente eléctrica es el movimiento de cargas por un conductor.', 'La ley de Ohm dice V = I · R.', 'En serie las resistencias se suman; en paralelo la resistencia total disminuye.', 'La potencia eléctrica es P = V · I.'], ['tensión', 'intensidad', 'resistencia', 'serie', 'paralelo'], 'V:V = I · R.|F:En paralelo la resistencia total aumenta.|V:El amperio mide la intensidad.', ['Dibuja el circuito de una linterna.', '¿Por qué las casas tienen los enchufes en paralelo?'], ['flujo', 'pila', 'interruptor', 'conductor', 'resistencia', 'retorno']);
  u('fisica', 'fis_presion', 0, 'sec bach', 'Presión y fluidos', 'fis_presion', ['La presión es la fuerza repartida sobre una superficie: p = F ÷ S.', 'Se mide en pascales (Pa).', 'En un líquido la presión aumenta con la profundidad: p = ρ · g · h.', 'El principio de Arquímedes explica por qué flotan los barcos.'], ['presión', 'pascal', 'presión hidrostática', 'Arquímedes', 'empuje'], 'V:A más profundidad, más presión.|F:La presión no depende de la superficie.|V:El empuje explica la flotación.', ['¿Por qué un cuchillo afilado corta mejor?', 'Explica por qué se te taponan los oídos al bucear.'], ['mapa', 'Presión', 'sólidos', 'líquidos', 'gases', 'atmósfera']);
  u('fisica', 'fis_ondas', 0, 'sec bach', 'Ondas y sonido', 'fis_ondas', ['Una onda transporta energía sin transportar materia.', 'Frecuencia, longitud de onda y velocidad se relacionan: v = λ · f.', 'El sonido viaja por el aire a unos 340 m/s y no se propaga en el vacío.', 'El tono depende de la frecuencia y la intensidad, de la amplitud.'], ['onda', 'frecuencia', 'longitud de onda', 'amplitud', 'hercio'], 'V:El sonido no viaja en el vacío.|F:La luz y el sonido viajan a la misma velocidad.|V:v = λ · f.', ['Calcula a qué distancia cae un rayo contando segundos.', '¿Por qué suena más agudo un vaso con poca agua?'], ['flujo', 'fuente', 'vibración', 'medio', 'receptor']);
  u('fisica', 'fis_calor', 0, 'pri3 sec bach', 'Calor y temperatura', 'fis_calor', ['La temperatura mide la agitación de las partículas; el calor es energía que pasa de un cuerpo caliente a uno frío.', 'Para calentar un cuerpo hace falta Q = m · c · ΔT.', 'El agua tiene un calor específico muy alto: tarda en calentarse y en enfriarse.', 'El calor se transmite por conducción, convección y radiación.'], ['temperatura', 'calor', 'calor específico', 'conducción', 'convección'], 'V:El calor pasa del cuerpo caliente al frío.|F:Calor y temperatura son lo mismo.|V:El agua tiene un calor específico alto.', ['¿Por qué las ciudades costeras tienen temperaturas más suaves?', 'Explica por qué la cuchara de metal se calienta en la sopa.'], ['mapa', 'Transmisión del calor', 'conducción', 'convección', 'radiación']);
  u('fisica', 'fis_gravit', 0, 'sec bach adu', 'Gravitación y sistema solar', 'fis_grav', ['Newton explicó que todos los cuerpos se atraen con una fuerza que depende de sus masas y distancia.', 'La gravedad mantiene a los planetas en órbita alrededor del Sol.', 'El peso cambia de un planeta a otro, pero la masa no.', 'En la Luna la gravedad es unas seis veces menor que en la Tierra.'], ['gravitación', 'órbita', 'masa', 'peso', 'gravedad'], 'V:En la Luna pesamos menos.|F:En la Luna nuestra masa es menor.|V:La gravedad mantiene las órbitas.', ['Calcula tu peso en Marte.', '¿Por qué los astronautas flotan en la estación espacial?'], ['ciclo', 'Sol', 'Tierra', 'Luna', 'órbita']);

  /* Generadores para las unidades de Física ya existentes */
  var FIS_G = { fis_fuerzas: 'fis_newton', fis_mov: 'fis_mru', fis_densidad: 'fis_dens', fis_energia: 'fis_energ', fis_optica: 'fis_ondas', fis_palanca: 'fis_palanca' };

  ED.registrar({
    materias: [
      { id: 'geoalg', n: 'Geometría y Álgebra', ico: '📐', al: { es: 'Matemáticas · Geometría y Álgebra', mx: 'Matemáticas · Geometría y Álgebra', ar: 'Matemática · Geometría y Álgebra', cl: 'Matemática · Geometría y Álgebra' }, opciones: [{ k: 'nivel', n: 'Nivel', tipo: 'chips', def: 'todos', ops: [['todos', 'Los cuatro niveles'], ['1', '1 · Básico'], ['2', '2 · Intermedio'], ['3', '3 · Avanzado'], ['4', '4 · Superior']] }] },
      { id: 'calculo', n: 'Cálculo', ico: '∫', al: { es: 'Matemáticas II · Análisis', cl: 'Matemática · Cálculo', ar: 'Matemática · Análisis' }, opciones: [{ k: 'nivel', n: 'Nivel', tipo: 'chips', def: 'todos', ops: [['todos', 'Los cuatro niveles'], ['1', '1 · Básico'], ['2', '2 · Intermedio'], ['3', '3 · Avanzado'], ['4', '4 · Superior']] }] }
    ],
    unidades: L,
    generadores: GEN
  });

  /* Asignar generadores: Física y cualquier unidad sin generador propio (proceso con respuesta). */
  function asignar() { CU.UNIDADES.forEach(function (x) { if (FIS_G[x.id] && !x.g) x.g = FIS_G[x.id]; if (!x.g && x.m !== 'idiomas' && x.m !== 'infantil') { x.g = 'proc_orden'; x._proc = true; } }); }
  asignar();

  /* Niveles: el libro de 4 niveles recorre las unidades en orden; con un nivel elegido, solo ese. */
  var NIVEL = null, uni0 = CU.unidades;
  CU.unidades = function (materia, bnd) {
    if (!/^(geoalg|calculo)$/.test(materia)) { var o = uni0.apply(this, arguments); o.forEach(function (x) { if (!x.g && x.m !== 'idiomas' && x.m !== 'infantil') { x.g = 'proc_orden'; x._proc = true; } }); return o; }
    return CU.UNIDADES.filter(function (x) { return x.m === materia && (!NIVEL || NIVEL === 'todos' || String(x.niv) === String(NIVEL)); })
      .sort(function (a, b) { return a.niv - b.niv; }).map(function (x) { x._ajuste = 0; return x; });
  };
  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    NIVEL = cfg && cfg.op && cfg.op.nivel || null;
    try { var res = ens.apply(this, arguments); } finally { NIVEL = null; }
    try {
      if (/^(geoalg|calculo)$/.test(res.C.mat)) {
        var visto = {};
        res.pages.forEach(function (p) { if (p.tipo === 'apertura' && p.u && p.u.niv && !visto[p.u.niv]) { visto[p.u.niv] = 1; p.indice = p.indice || NIV[p.u.niv]; p.nivel = NIV[p.u.niv]; } });
      }
    } catch (e) { console.warn('EU_MATES_PLUS', e); }
    return res;
  };

  /* Saberes reales para «Para saber más» (EU_LIBRO) */
  var LB = window.EU_LIBRO;
  if (LB && LB.SABER) {
    LB.SABER.geoalg = [
      ['Los Elementos de Euclides', 'Hacia el año 300 a. C. Euclides reunió en Alejandría la geometría de su tiempo en los Elementos, trece libros que se usaron como texto escolar durante más de dos mil años.'],
      ['Al-Juarismi y el álgebra', 'La palabra «álgebra» viene del libro de al-Juarismi, escrito en Bagdad hacia el año 820; de su nombre procede también la palabra «algoritmo».'],
      ['Descartes une álgebra y geometría', 'En 1637 René Descartes publicó La Géométrie, donde describió las curvas con ecuaciones usando coordenadas: nacía la geometría analítica.'],
      ['Eratóstenes mide la Tierra', 'Hacia el 240 a. C. Eratóstenes comparó las sombras de Siena y Alejandría y calculó la circunferencia terrestre con un error de pocos cientos de kilómetros.'],
      ['El número π', 'Arquímedes acotó π entre 3 10/71 y 3 1/7 inscribiendo y circunscribiendo polígonos de 96 lados en una circunferencia.'],
      ['La tablilla Plimpton 322', 'Una tablilla babilónica de hacia 1800 a. C. contiene una lista de ternas pitagóricas, más de mil años antes de Pitágoras.'],
      ['Emmy Noether', 'Emmy Noether (1882–1935) transformó el álgebra abstracta y demostró un teorema que une las simetrías de la naturaleza con las leyes de conservación de la física.'],
      ['Las matrices en las pantallas', 'Cada vez que una imagen gira o se amplía en una pantalla, el ordenador multiplica las coordenadas de sus puntos por una matriz.'],
      ['Hipatia de Alejandría', 'Hipatia (hacia 360–415) enseñó matemáticas y astronomía en Alejandría y comentó la obra de Apolonio sobre las cónicas.'],
      ['El GPS y la geometría', 'Un receptor GPS calcula su posición a partir de la distancia a al menos cuatro satélites: resuelve un sistema de ecuaciones en el espacio.']
    ];
    LB.SABER.calculo = [
      ['Newton y Leibniz', 'Isaac Newton y Gottfried Leibniz desarrollaron el cálculo de forma independiente en el siglo XVII; la notación dy/dx y el signo ∫ se deben a Leibniz.'],
      ['El signo de la integral', 'Leibniz eligió el símbolo ∫ como una «S» alargada, inicial de summa, porque la integral es una suma de infinitas partes muy pequeñas.'],
      ['Arquímedes y el área de la parábola', 'Más de 1800 años antes de Newton, Arquímedes calculó el área de un segmento de parábola sumando triángulos cada vez más pequeños.'],
      ['El número e', 'El número e ≈ 2,71828 aparece al calcular el interés compuesto continuo; Jacob Bernoulli lo estudió en 1683.'],
      ['Maria Gaetana Agnesi', 'En 1748 Maria Gaetana Agnesi publicó en Milán uno de los primeros manuales completos de cálculo diferencial e integral.'],
      ['Cauchy y el rigor', 'Augustin-Louis Cauchy definió con precisión el límite y la continuidad en el siglo XIX, dando al cálculo una base rigurosa.'],
      ['El datado por carbono 14', 'El carbono 14 tiene una semivida de unos 5730 años; con una ecuación de decrecimiento exponencial se estima la edad de restos orgánicos.'],
      ['El cálculo en la medicina', 'La dosis de un medicamento en la sangre disminuye de forma exponencial; las pautas de cada cuántas horas tomarlo se calculan con ese modelo.'],
      ['Taylor en las calculadoras', 'Las calculadoras obtienen senos, cosenos y exponenciales sumando unos pocos términos de desarrollos en serie como los de Taylor.'],
      ['Katherine Johnson', 'Katherine Johnson calculó en la NASA las trayectorias de los primeros vuelos tripulados de Estados Unidos, incluida la misión del Apolo 11.']
    ];
    var F0 = LB.SABER.fisica || [];
    LB.SABER.fisica = F0.concat([
      ['Galileo y la caída', 'En 1971 el astronauta David Scott dejó caer en la Luna un martillo y una pluma: llegaron a la vez, como había predicho Galileo.'],
      ['La velocidad del sonido', 'El sonido recorre unos 340 m por segundo en el aire, unos 1500 m/s en el agua y más de 5000 m/s en el acero.'],
      ['El julio', 'La unidad de energía lleva el nombre de James Prescott Joule, que midió en 1845 cuánto trabajo mecánico hace falta para calentar el agua.'],
      ['Ohm', 'Georg Simon Ohm publicó en 1827 la relación entre tensión, intensidad y resistencia que hoy lleva su nombre.']
    ]);
  }

  window.EU_MATES_PLUS = { GEN: GEN, UNIDADES: L, NIV: NIV };
})();
