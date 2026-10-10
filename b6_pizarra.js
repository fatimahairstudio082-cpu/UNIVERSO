/* b6_pizarra.js — pizarra del tutor (window.EU_PIZARRA), a partir de la pizarra de Fátima
   «ProfemAt GOD — Paso a Paso Columna por Columna v7.0» (FATIIMA-1791384648192.html, que no se toca).
   Dos pizarras, como en la suya:
   · 👨‍🏫 Pizarra del Profesor: resuelve un ejercicio paso a paso, con la cuenta de cada paso y voz es-ES
     (◀ Paso · ▶ Auto clase · Paso ▶).
   · ✍️ Pizarra del Alumno: OTRO ejercicio del mismo tipo; el alumno coloca el resultado de cada paso, se
     comprueba al momento y se escribe en la pizarra. Si falla dos veces, el tutor le da la respuesta y por qué.
     🎲 Otro reto · 💡 Pista · 📥 Hoja (hoja de práctica cuadriculada para imprimir) · 🔄 Reiniciar.
   El «cerebro» reconoce el ejercicio (`analiza`) y elige la pizarra:
   · columnas — su método columna por columna, ampliado (Fátima, 10-10-2026): cualquier número de cifras,
     resta prestando aunque haya ceros (802 − 456), multiplicación por varias cifras (productos parciales
     corridos un lugar y suma final) y división larga por divisores de varias cifras, con resto. Se reconoce la
     operación escrita (458 + 275) o la de un problema cuando solo una operación da su respuesta.
   · ecuacion — ax ± b = c: se pasa b al otro lado, se divide entre a y se comprueba.
   · cadena — fórmulas (Física, Química, Geometría, Cálculo, Contabilidad…): la resolución del sistema escrita
     línea a línea; el alumno resuelve otro ejercicio de la misma unidad.
   · texto — completar, verdadero/falso, ordenar, traducir: la pizarra escribe el ejemplo y el alumno contesta.
   Nada se inventa: los pasos salen del ejercicio y de su resolución en el libro; los retos nuevos tienen la misma
   forma (mismas cifras), así sirve igual en todos los niveles. El motor es autónomo: `fuente()` lo copia en el
   libro descargado (window.EU_PIZ). Sin Firebase, sin créditos, sin localStorage. */
(function () {
  'use strict';
  if (window.EU_PIZARRA) return;

  function MOTOR(W) {
    var D = W.document;
    var COL = { bg: '#0b1a2e', borde: '#23395a', tiza: '#ffffff', oro: '#ffd43b', cian: '#39d9ff', verde: '#6ee8bb', rosa: '#ff91a6', gris: '#64748b' };
    var NOMCOL = ['U', 'D', 'C', 'UM', 'DM', 'CM', 'UMi', 'DMi'], LARGO = ['unidades', 'decenas', 'centenas', 'unidades de mil', 'decenas de mil', 'centenas de mil', 'unidades de millón', 'decenas de millón'];
    var SIM = { '+': '+', '-': '−', '*': '×', '/': '÷' };

    /* ─── texto ─── */
    function limpio(s) {
      return String(s == null ? '' : s).replace(/<span[^>]*border-bottom[^>]*>[\s\S]*?<\/span>/gi, '____').replace(/<br\s*\/?>/gi, ' ').replace(/<\/(div|p|li)>/gi, ' ')
        .replace(/<[^>]+>/g, '').replace(/&#160;|&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
    }
    function num(s) { return parseFloat(String(s).replace(/[−–]/g, '-').replace(',', '.')); }
    function nums(s) { return (String(s).replace(/[−–]/g, '-').replace(/(\d)\s(?=\d{3}\b)/g, '$1').match(/-?\d+(?:[.,]\d+)?/g) || []).map(num); }
    function fmt(n) { var r = Math.round(n * 1000) / 1000; return String(r).replace('.', ','); }
    function norm(s) { return limpio(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[«»"'.,;:¡!¿?()\[\]]/g, ' ').replace(/\s+/g, ' ').trim(); }
    function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
    function conCifras(n) { return n <= 1 ? rnd(1, 9) : rnd(Math.pow(10, n - 1), Math.pow(10, n) - 1); }
    function cifras(n) { return String(n).split('').reverse().map(Number); }

    /* ─── el cerebro: qué ejercicio es ─── */
    var OPS = { '+': function (a, b) { return a + b; }, '-': function (a, b) { return a - b; }, '*': function (a, b) { return a * b; }, '/': function (a, b) { return b ? a / b : NaN; } };
    function opDe(c) { return c === '+' ? '+' : /[-−–]/.test(c) ? '-' : /[×x*·]/i.test(c) ? '*' : /[÷:\/]/.test(c) ? '/' : null; }
    function columnas(A, op, B) {
      if (!(A >= 0 && B >= 0) || A > 99999999 || B > 99999999) return null;
      if (op === '-' && A < B) return null;
      if (op === '/' && (B < 1 || A < B)) return null;
      if (op === '*' && (B < 1 || String(B).length > 3)) return null;
      return { tipo: 'columnas', A: A, B: B, op: op };
    }
    function analiza(t, pref) {
      t = t || {}; var e = limpio(t.e), s = limpio(t.s), x = limpio(t.x);
      var base = { e: e, s: s, x: x, p: (t.p || []).map(limpio).filter(Boolean), o: t.o, c: t.c, tq: t.tipo, pista: limpio(t.pista) };
      /* 1 · operación escrita: «458 + 275», «Calcula: 684 ÷ 5 =» */
      var m = /^(?:calcula|resuelve|opera)?\s*:?\s*(\d{1,8})\s*([+\-−–×x*·÷:\/])\s*(\d{1,8})\s*=?\s*(?:\?|_+)?\s*\.?$/i.exec(e);
      if (m) { var c = columnas(+m[1], opDe(m[2]), +m[3]); if (c) return mezcla(base, c); }
      /* 2 · ecuación de primer grado: ax ± b = c, ax = c */
      var q = /(-?\d*)\s*x\s*(?:([+\-−–])\s*(\d+))?\s*=\s*(-?\d+)\s*$/.exec(e.replace(/^.*?:\s*/, ''));
      if (q && /resuelve|ecuaci|x\s*[+\-−–=]/i.test(e)) {
        var a = q[1] === '' ? 1 : q[1] === '-' ? -1 : +q[1], b = q[3] ? (/[-−–]/.test(q[2]) ? -q[3] : +q[3]) : 0, cc = +q[4];
        if (a && (cc - b) % a === 0) return mezcla(base, { tipo: 'ecuacion', a: a, b: b, c: cc });
      }
      /* 3 · problema con dos números enteros: solo si UNA operación da su respuesta (comprobado, no se adivina) */
      var ns = (e.match(/\d+(?:[.,]\d+)?/g) || []), sv = nums(s);
      if (ns.length === 2 && ns.every(function (k) { return /^\d+$/.test(k); }) && sv.length === 1 && /^\D*-?\d+\D*$/.test(s)) {
        var A = +ns[0], B = +ns[1], hits = ['+', '-', '*', '/'].filter(function (o) { return Math.abs(OPS[o](A, B) - sv[0]) < 1e-9; });
        if (hits.length === 1 && pref !== 'cadena') { var cp = columnas(A, hits[0], B); if (cp) { cp.plantea = 1; return mezcla(base, cp); } }
      }
      /* 4 · fórmula con números: la resolución (o los pasos) se escribe línea a línea */
      if (nums(s).length && (base.p.length || /=/.test(x))) return mezcla(base, { tipo: 'cadena' });
      if (nums(s).length && /\d/.test(e)) return mezcla(base, { tipo: 'cadena' });
      return mezcla(base, { tipo: 'texto' });
    }
    function mezcla(a, b) { for (var k in b) a[k] = b[k]; return a; }

    /* el mismo tipo de ejercicio con otros números (mismas cifras: sirve en todos los niveles) */
    function similar(an) {
      if (!an) return null;
      if (an.tipo === 'columnas') {
        var la = String(an.A).length, lb = String(an.B).length, A, B, n = 0;
        do {
          A = conCifras(la); B = conCifras(lb); n++;
          if (an.op === '-' && A < B) { var t = A; A = B; B = t; }
          if (an.op === '/' && B < 2 && lb === 1) B = rnd(2, 9);
        } while (n < 50 && (A === an.A || (an.op === '/' && A < B) || (an.op === '-' && A === B)));
        var r = columnas(A, an.op, B); if (!r) return null;
        r.e = A + ' ' + SIM[an.op] + ' ' + B + ' ='; r.s = an.op === '/' ? fmt(Math.floor(A / B)) + (A % B ? ' (resto ' + (A % B) + ')' : '') : fmt(OPS[an.op](A, B)); r.p = []; return r;
      }
      if (an.tipo === 'ecuacion') {
        var a, x, b, c, k = 0;
        do { a = Math.abs(an.a) === 1 ? an.a : (an.a < 0 ? -1 : 1) * rnd(2, Math.max(3, Math.abs(an.a) + 3)); x = rnd(-6, 12); b = an.b ? (an.b < 0 ? -1 : 1) * rnd(1, 12) : 0; c = a * x + b; k++; } while (k < 30 && a === an.a && b === an.b && c === an.c);
        return { tipo: 'ecuacion', a: a, b: b, c: c, e: 'Resuelve: ' + ecuTxt(a, b, c), s: 'x = ' + x, x: '', p: [] };
      }
      return null;
    }
    function aTxt(a) { return a === 1 ? 'x' : a === -1 ? '−x' : String(a).replace('-', '−') + 'x'; }
    function ecuTxt(a, b, c) { return aTxt(a) + (b ? (b < 0 ? ' − ' + (-b) : ' + ' + b) : '') + ' = ' + String(c).replace('-', '−'); }

    /* ─── pasos (lo que el profesor explica y el alumno coloca) ─── */
    function pasos(an) {
      if (!an) return [];
      if (an.tipo === 'columnas') return an.op === '+' ? pSuma(an) : an.op === '-' ? pResta(an) : an.op === '*' ? pMult(an) : pDiv(an);
      if (an.tipo === 'ecuacion') return pEcu(an);
      return pLineas(an);
    }
    function inicio(an) {
      var L = an.plantea ? [an.e, 'Primero, ¿qué operación hay que hacer? ' + an.A + ' ' + SIM[an.op] + ' ' + an.B + '.'] : [];
      return { t: 'Colocamos los números', d: L.concat([an.op === '/' ? 'Escribimos el dividendo ' + an.A + ' y, en la casita, el divisor ' + an.B + '.' : 'Colocamos los números en columnas: unidades debajo de unidades, decenas debajo de decenas.']).join(' '), ecu: an.A + ' ' + SIM[an.op] + ' ' + an.B, esp: null, ap: function () { } };
    }
    function pSuma(an) {
      var a = cifras(an.A), b = cifras(an.B), n = Math.max(a.length, b.length), lle = 0, P = [inicio(an)];
      for (var i = 0; i < n; i++) (function (i, li) {
        var s = (a[i] || 0) + (b[i] || 0) + li, ult = i === n - 1, dig = ult ? String(s) : String(s % 10), sal = ult ? 0 : Math.floor(s / 10);
        var tx = (a[i] || 0) + ' + ' + (b[i] || 0) + (li ? ' + ' + li + ' (llevada)' : '');
        P.push({ t: 'Paso ' + (i + 1) + ': sumar las ' + LARGO[i].toUpperCase(), d: 'Sumamos la columna de las ' + LARGO[i] + ': ' + tx + '.', ecu: tx + ' = ' + s + (sal ? ' → escribes ' + (s % 10) + ' y llevas ' + sal : ''), esp: s,
          ok: s > 9 && !ult ? '¡Muy bien! Da ' + s + '. Ponemos el ' + (s % 10) + ' abajo y llevamos ' + sal + ' a las ' + LARGO[i + 1] + '.' : '¡Muy bien! Escribimos ' + dig + '.', err: 'Suma despacio: ' + tx + '.',
          ap: function (st) { st.act = i; st.res[i] = dig; if (sal) st.lle[i + 1] = '+' + sal; } });
        lle = sal;
      })(i, lle);
      P.push(fin(an, an.A + an.B));
      return P;
    }
    function pResta(an) {
      var a = cifras(an.A), b = cifras(an.B), n = a.length, w = a.slice(), P = [inicio(an)];
      for (var i = 0; i < n; i++) (function (i) {
        var bi = b[i] || 0, pres = [], tx;
        if (w[i] < bi) {
          var j = i + 1; while (j < n && w[j] === 0) j++;
          /* préstamo: la primera columna que tiene algo presta 1; las que tienen 0 pasan a 10 y prestan, quedan en 9 */
          w[j] -= 1; pres.push([j, w[j]]);
          for (var k = j - 1; k > i; k--) { w[k] = 9; pres.push([k, 9]); }
          w[i] += 10; pres.push([i, w[i]]);
          tx = j > i + 1 ? 'Como ' + (w[i] - 10) + ' es menor que ' + bi + ', pedimos prestado. Las ' + LARGO[i + 1] + ' tienen 0 y no pueden prestar: le pedimos 1 a las ' + LARGO[j] + ' (quedan ' + w[j] + '); las columnas con 0 pasan a 10, prestan 1 y se quedan en 9. Las ' + LARGO[i] + ' pasan a ' + w[i] + '.'
            : 'Como ' + (w[i] - 10) + ' es menor que ' + bi + ', le pedimos 1 prestado a las ' + LARGO[j] + ' (quedan ' + w[j] + '). Las ' + LARGO[i] + ' pasan a ' + w[i] + '.';
        } else tx = 'Restamos las ' + LARGO[i] + ': ' + w[i] + ' − ' + bi + '.';
        var d = w[i] - bi, wi = w[i], pr = pres.slice();
        if (i === n - 1 && i > 0 && d === 0 && !pr.length) return;   /* un cero a la izquierda no se escribe */
        P.push({ t: 'Paso ' + (i + 1) + ': restar las ' + LARGO[i].toUpperCase(), d: tx, ecu: (pr.length ? 'préstamo → ' : '') + wi + ' − ' + bi + ' = ' + d, esp: d,
          ok: '¡Excelente! Escribimos ' + d + ' en las ' + LARGO[i] + '.', err: 'Calcula la resta de las ' + LARGO[i] + ': ' + wi + ' − ' + bi + '.',
          ap: function (st) { st.act = i; pr.forEach(function (p) { st.pre[p[0]] = String(p[1]); }); st.res[i] = String(d); } });
      })(i);
      P.push(fin(an, an.A - an.B));
      return P;
    }
    function pMult(an) {
      var a = cifras(an.A), b = cifras(an.B), P = [inicio(an)], filas = [];
      b.forEach(function (bj, j) {
        var lle = 0, fila = {};
        if (b.length > 1) P.push({ t: 'Multiplicamos por la cifra ' + bj + (j ? ' (' + LARGO[j] + ')' : ' (unidades)'), d: j ? 'Ahora multiplicamos por ' + bj + '. Como es la cifra de las ' + LARGO[j] + ', el resultado empieza ' + j + (j > 1 ? ' lugares' : ' lugar') + ' más a la izquierda (dejamos el hueco).' : 'Empezamos multiplicando ' + an.A + ' por la cifra de las unidades, ' + bj + '.', ecu: an.A + ' × ' + bj, esp: null, ap: function (st) { st.fila = j; } });
        a.forEach(function (ai, i) {
          (function (i, li) {
            var p = ai * bj + li, ult = i === a.length - 1, dig = ult ? String(p) : String(p % 10), sal = ult ? 0 : Math.floor(p / 10), tx = (li ? '(' + ai + ' × ' + bj + ') + ' + li : ai + ' × ' + bj);
            P.push({ t: 'Multiplicar ' + LARGO[i] + ' × ' + bj, d: 'Multiplicamos ' + tx + (li ? ' (la llevada)' : '') + '.', ecu: tx + ' = ' + p + (sal ? ' → escribes ' + (p % 10) + ' y llevas ' + sal : ''), esp: p,
              ok: sal ? '¡Muy bien! Escribimos ' + (p % 10) + ' y llevamos ' + sal + '.' : '¡Muy bien! Escribimos ' + dig + '.', err: 'Calcula: ' + tx + '.',
              ap: function (st) { st.fila = j; st.act = i + j; st.filas[j] = st.filas[j] || {}; st.filas[j][i + j] = dig; delete st.lle[i + j]; if (sal) st.lle[i + j + 1] = '+' + sal; } });
            lle = sal;
          })(i, lle);
          fila[i + j] = 1;
        });
        P.push({ t: 'Fila terminada', d: 'Fila lista: ' + an.A + ' × ' + bj + ' = ' + an.A * bj + '.', ecu: an.A + ' × ' + bj + ' = ' + an.A * bj, esp: null, ap: function (st) { st.lle = {}; } });
        filas.push(an.A * bj * Math.pow(10, j));
      });
      if (b.length > 1) {
        var tot = an.A * an.B, n = String(tot).length, lle = 0;
        for (var k = 0; k < n; k++) (function (k, li) {
          var s = li, ds = [];
          filas.forEach(function (f, j) { var dg = cifras(f / Math.pow(10, j))[k - j]; if (k >= j && dg != null && f / Math.pow(10, j) >= Math.pow(10, k - j)) { s += dg; ds.push(dg); } });
          var ult = k === n - 1, dig = ult ? String(s) : String(s % 10), sal = ult ? 0 : Math.floor(s / 10), tx = (ds.length ? ds.join(' + ') : '0') + (li ? ' + ' + li : '');
          if (ult && s === 0) return;
          P.push({ t: 'Sumamos las filas: ' + LARGO[k], d: 'Ahora sumamos los productos, columna por columna: ' + tx + '.', ecu: tx + ' = ' + s, esp: s, ok: '¡Bien! Escribimos ' + dig + (sal ? ' y llevamos ' + sal : '') + '.', err: 'Suma la columna: ' + tx + '.',
            ap: function (st) { st.suma = 1; st.act = k; st.res[k] = dig; delete st.lle[k]; if (sal) st.lle[k + 1] = '+' + sal; } });
          lle = sal;
        })(k, lle);
      }
      P.push(fin(an, an.A * an.B));
      return P;
    }
    function pDiv(an) {
      var sA = String(an.A), B = an.B, P = [inicio(an)], k = 1;
      while (k < sA.length && +sA.slice(0, k) < B) k++;
      var cur = +sA.slice(0, k), idx = k - 1, coc = '';
      P.push({ t: 'Tomar cifras con el arquito', d: 'Para dividir entre ' + B + ' tomamos las primeras cifras que alcancen: ' + cur + (k > 1 ? ' (con ' + sA.slice(0, k - 1) + ' no alcanza).' : '.'), ecu: cur + ' ≥ ' + B, esp: cur, ok: '¡Muy bien! Le ponemos el arquito al ' + cur + '.', err: 'Escribe el número que formamos con las primeras cifras: ' + cur + '.',
        ap: function (st) { st.arco = [0, k - 1]; st.grupo = cur; } });
      while (idx < sA.length) (function (cv, ix) {
        var q = Math.floor(cv / B), pr = q * B, rm = cv - pr;
        coc += q; var cq = coc;
        P.push({ t: '¿Cuántas veces cabe ' + B + ' en ' + cv + '?', d: 'Buscamos en la tabla del ' + B + ' el número que más se acerca a ' + cv + ' sin pasarse: ' + B + ' × ' + q + ' = ' + pr + '. Restamos: ' + cv + ' − ' + pr + ' = ' + rm + '.', ecu: B + ' × ' + q + ' = ' + pr + ' → ' + cv + ' − ' + pr + ' = ' + rm, esp: q,
          ok: '¡Excelente! ' + B + ' × ' + q + ' = ' + pr + '. Queda ' + rm + '.', err: 'Revisa la tabla del ' + B + ': ¿qué número por ' + B + ' se acerca más a ' + cv + ' sin pasarse?',
          ap: function (st) { st.coc = cq; st.filas.push({ t: '−' + pr, col: ix, rojo: 1 }, { t: String(rm), col: ix }); st.tabla = q; } });
        idx = ix + 1;
        if (idx < sA.length) {
          var nd = sA[idx], nv = rm * 10 + +nd, ixb = idx;
          P.push({ t: 'Bajamos la siguiente cifra', d: 'Bajamos el ' + nd + ' al lado del ' + rm + ' y formamos ' + nv + '.', ecu: '(' + rm + ' × 10) + ' + nd + ' = ' + nv, esp: nv, ok: '¡Bien! Ahora tenemos ' + nv + '.', err: 'Pon el ' + nd + ' detrás del ' + rm + ': queda ' + nv + '.',
            ap: function (st) { st.filas[st.filas.length - 1] = { t: String(nv), col: ixb }; st.baja = ixb; } });
          cur = nv;
        } else cur = rm;
      })(cur, idx);
      var r = an.A % B, c = Math.floor(an.A / B);
      P.push({ t: 'Resultado', d: 'Cociente ' + c + (r ? ' y resto ' + r : ', resto 0 (división exacta)') + '. Prueba: ' + B + ' × ' + c + (r ? ' + ' + r : '') + ' = ' + an.A + '.', ecu: B + ' × ' + c + (r ? ' + ' + r : '') + ' = ' + an.A + ' ✓', esp: null, fin: 1, ap: function (st) { st.act = null; st.fin = 1; } });
      return P;
    }
    function fin(an, r) {
      return { t: 'Resultado', d: '¡Terminado! ' + an.A + ' ' + SIM[an.op] + ' ' + an.B + ' = ' + r + '.' + (an.op === '-' ? ' Prueba: ' + r + ' + ' + an.B + ' = ' + an.A + '.' : ''), ecu: an.A + ' ' + SIM[an.op] + ' ' + an.B + ' = ' + r, esp: null, fin: 1, ap: function (st) { st.act = null; st.fin = 1; } };
    }
    function pEcu(an) {
      var a = an.a, b = an.b, c = an.c, R = c - b, x = R / a, L0 = ecuTxt(a, b, c), P = [];
      P.push({ t: 'La ecuación', d: 'Escribimos la ecuación. Queremos dejar la x sola.', ecu: L0, esp: null, ap: function (st) { st.lin = [L0]; st.act = 0; } });
      if (b) P.push({ t: 'Paso 1: pasar el ' + Math.abs(b) + ' al otro lado', d: 'El ' + (b > 0 ? '+' : '−') + Math.abs(b) + ' pasa al otro lado haciendo la operación contraria: ' + (b > 0 ? 'restamos ' : 'sumamos ') + Math.abs(b) + '.', ecu: aTxt(a) + ' = ' + fmt(c) + (b > 0 ? ' − ' : ' + ') + Math.abs(b) + ' = ' + fmt(R), esp: R,
        ok: '¡Muy bien! ' + aTxt(a) + ' = ' + fmt(R) + '.', err: 'Calcula ' + fmt(c) + (b > 0 ? ' − ' : ' + ') + Math.abs(b) + '.', ap: function (st) { st.lin.push(aTxt(a) + ' = ' + fmt(c) + (b > 0 ? ' − ' : ' + ') + Math.abs(b) + ' = ' + fmt(R)); st.act = st.lin.length - 1; } });
      if (a !== 1) P.push({ t: 'Paso ' + (b ? 2 : 1) + ': dividir entre ' + a, d: 'La x está multiplicada por ' + a + ': pasa al otro lado dividiendo.', ecu: 'x = ' + fmt(R) + ' ÷ ' + fmt(a) + ' = ' + fmt(x), esp: x,
        ok: '¡Excelente! x = ' + fmt(x) + '.', err: 'Divide ' + fmt(R) + ' entre ' + fmt(a) + '.', ap: function (st) { st.lin.push('x = ' + fmt(R) + ' ÷ ' + fmt(a) + ' = ' + fmt(x)); st.act = st.lin.length - 1; } });
      P.push({ t: 'Comprobamos', d: 'Sustituimos x = ' + fmt(x) + ' en la ecuación: ' + fmt(a) + ' · ' + fmt(x) + (b ? (b > 0 ? ' + ' : ' − ') + Math.abs(b) : '') + ' = ' + fmt(c) + '. ¡Se cumple!', ecu: fmt(a) + ' · ' + fmt(x) + (b ? (b > 0 ? ' + ' : ' − ') + Math.abs(b) : '') + ' = ' + fmt(c) + ' ✓', esp: null, fin: 1,
        ap: function (st) { st.lin.push('Prueba: ' + fmt(a) + ' · ' + fmt(x) + (b ? (b > 0 ? ' + ' : ' − ') + Math.abs(b) : '') + ' = ' + fmt(c) + ' ✓'); st.act = null; st.fin = 1; } });
      return P;
    }
    /* fórmula o texto: la resolución del libro, línea a línea (cada «=» de la cuenta es una línea) */
    function lineasDe(an) {
      var L = [], src = an.p.length ? an.p : (an.x ? an.x.replace(/([.;])\s+(?=[A-ZÁÉÍÓÚÑ¿¡(])/g, '$1\u0001').split('\u0001') : []);
      src.forEach(function (s) {
        var ps = s.split(/\s+(?==\s)/);
        if (ps.length > 2 && /\d/.test(s)) { L.push(ps[0] + ' ' + ps[1]); ps.slice(2).forEach(function (q) { L.push('  ' + q); }); } else L.push(s);
      });
      return L.filter(Boolean).slice(0, 9);
    }
    function pLineas(an) {
      var L = lineasDe(an), P = [{ t: 'El ejercicio', d: an.e, ecu: '', esp: null, ap: function (st) { st.lin = [an.e]; st.enun = 1; st.act = 0; } }];
      L.forEach(function (l, i) { P.push({ t: 'Paso ' + (i + 1), d: l.trim(), ecu: l.trim(), esp: null, ap: function (st) { st.lin.push(l); st.act = st.lin.length - 1; } }); });
      P.push({ t: 'Respuesta', d: 'La respuesta es: ' + an.s + '.', ecu: an.s, esp: null, fin: 1, ap: function (st) { st.lin.push('→ ' + an.s); st.act = st.lin.length - 1; st.fin = 1; } });
      return P;
    }
    function estado(an, P, k) {
      var st = { res: {}, lle: {}, pre: {}, filas: [], act: null, lin: [], coc: '' };
      for (var i = 0; i < Math.min(k, P.length); i++) P[i].ap(st);
      return st;
    }

    /* ─── comprobar la respuesta del alumno ─── */
    function comprueba(resp, sol, an) {
      var r = norm(resp), s = norm(sol); if (!r) return false; if (r === s) return true;
      if (an && (an.tq === 'vf' || /^(verdadero|falso)$/.test(s))) return (s[0] === r[0]) && /^(v|f|verdadero|falso)$/.test(r);
      if (/^[A-Z](\s*→\s*[A-Z])+$/.test(limpio(sol))) return limpio(sol).replace(/[^A-Z]/g, '') === String(resp).toUpperCase().replace(/[^A-Z]/g, '');
      var ns = nums(sol);
      if (ns.length) {
        var nr = nums(resp); if (nr.length < ns.length) return false;
        var okN = ns.every(function (v, i) { var w = nr[i]; return Math.abs(w - v) <= Math.max(0.011, Math.abs(v) * 0.005); });
        var pol = ['si', 'no', 'verdadero', 'falso', 'maximo', 'minimo'].filter(function (p) { return new RegExp('\\b' + p + '\\b').test(s); });
        return okN && pol.every(function (p) { return new RegExp('\\b' + p + '\\b').test(r); });
      }
      return s.length >= 2 && r.indexOf(s) >= 0 && r.length <= s.length + 14;
    }

    /* ─── pintar la pizarra ─── */
    function pinta(cx, w, h, an, st, acento) {
      cx.setTransform(1, 0, 0, 1, 0, 0); cx.fillStyle = COL.bg; cx.fillRect(0, 0, w, h);
      cx.strokeStyle = 'rgba(255,255,255,.05)'; cx.lineWidth = 1;
      for (var gx = 0; gx < w; gx += 28) { cx.beginPath(); cx.moveTo(gx, 0); cx.lineTo(gx, h); cx.stroke(); }
      for (var gy = 0; gy < h; gy += 28) { cx.beginPath(); cx.moveTo(0, gy); cx.lineTo(w, gy); cx.stroke(); }
      if (!an) return;
      if (an.tipo === 'columnas') { if (an.op === '/') pDivision(cx, w, h, an, st, acento); else pCols(cx, w, h, an, st, acento); }
      else pLin(cx, w, h, an, st, acento);
    }
    function pCols(cx, w, h, an, st, ac) {
      var sr = String(an.op === '+' ? an.A + an.B : an.op === '-' ? an.A - an.B : an.A * an.B), mult = an.op === '*' && String(an.B).length > 1;
      var n = Math.max(String(an.A).length, String(an.B).length, sr.length) + 1, cw = Math.min(46, Math.floor((w - 60) / (n + 1))), fs = Math.round(cw * 0.9);
      var xr = Math.round(w / 2 + (n * cw) / 2), X = function (c) { return xr - (c + 1) * cw; }, y0 = Math.round(h * 0.17), dy = Math.round(fs * 1.35);
      cx.textAlign = 'center'; cx.textBaseline = 'alphabetic';
      cx.font = 'bold ' + Math.round(fs * 0.42) + 'px monospace'; cx.fillStyle = COL.gris;
      for (var c = 0; c < n - 1; c++) cx.fillText(NOMCOL[c] || '', X(c) + cw / 2, y0);
      if (st.act != null) { cx.fillStyle = 'rgba(57,217,255,.13)'; cx.fillRect(X(st.act) + 1, y0 + 6, cw - 2, h - y0 - 14); }
      var yA = y0 + dy * 1.75, yB = yA + dy, yL = yB + fs * 0.35;
      cx.font = 'bold ' + Math.round(fs * 0.5) + 'px monospace';
      Object.keys(st.lle).forEach(function (k) { cx.fillStyle = COL.cian; cx.fillText(st.lle[k], X(+k) + cw / 2, yA - fs * 1.05); });
      cx.font = 'bold ' + fs + 'px monospace';
      cifras(an.A).forEach(function (d, i) {
        cx.fillStyle = COL.tiza; cx.fillText(String(d), X(i) + cw / 2, yA);
        if (st.pre[i] != null) {
          cx.strokeStyle = COL.rosa; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(X(i) + cw * 0.22, yA + 2); cx.lineTo(X(i) + cw * 0.78, yA - fs * 0.75); cx.stroke();
          cx.fillStyle = COL.rosa; cx.font = 'bold ' + Math.round(fs * 0.5) + 'px monospace'; cx.fillText(st.pre[i], X(i) + cw / 2, yA - fs * 1.2); cx.font = 'bold ' + fs + 'px monospace';
        }
      });
      cx.fillStyle = COL.tiza; cifras(an.B).forEach(function (d, i) { cx.fillText(String(d), X(i) + cw / 2, yB); });
      cx.fillText(SIM[an.op], X(n - 1) + cw / 2, yB);
      cx.strokeStyle = ac || COL.oro; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(X(n - 1), yL); cx.lineTo(xr + 4, yL); cx.stroke();
      var y = yL + dy;
      if (mult) {
        st.filas.forEach(function (f, j) { if (!f) return; cx.fillStyle = j % 2 ? COL.verde : COL.oro; Object.keys(f).forEach(function (k) { pintaDig(cx, f[k], X, +k, cw, y); }); y += dy; });
        if (st.suma || st.fin) { cx.fillStyle = COL.tiza; cx.fillText('+', X(n - 1) + cw / 2, y - dy); cx.strokeStyle = ac || COL.oro; cx.beginPath(); cx.moveTo(X(n - 1), y - dy + fs * 0.35); cx.lineTo(xr + 4, y - dy + fs * 0.35); cx.stroke(); }
      }
      cx.fillStyle = COL.oro;
      var src = an.op === '*' && !mult ? (st.filas[0] || {}) : st.res;
      Object.keys(src).forEach(function (k) { pintaDig(cx, src[k], X, +k, cw, y); });
    }
    function pintaDig(cx, t, X, c, cw, y) { t = String(t); for (var q = 0; q < t.length; q++) cx.fillText(t[t.length - 1 - q], X(c + q) + cw / 2, y); }
    function pDivision(cx, w, h, an, st, ac) {
      var sA = String(an.A), sB = String(an.B), rows = st.filas.length, cw = Math.min(44, Math.floor((w - 80) / (sA.length + sB.length + 4))), fs = Math.round(cw * 0.92), dy = Math.round(fs * 1.25);
      var x0 = Math.round(w * 0.12), y0 = Math.round(h * 0.2), X = function (i) { return x0 + i * cw; };
      if (y0 + (rows + 1) * dy > h - 10) { dy = Math.floor((h - 10 - y0) / (rows + 1)); }
      cx.textAlign = 'center'; cx.font = 'bold ' + fs + 'px monospace';
      for (var i = 0; i < sA.length; i++) { cx.fillStyle = st.baja != null && i <= st.baja && i > (st.arco || [0, 0])[1] ? COL.verde : COL.tiza; cx.fillText(sA[i], X(i) + cw / 2, y0); }
      if (st.arco) { cx.strokeStyle = ac || COL.oro; cx.lineWidth = 3; var a1 = X(st.arco[0]) + 2, a2 = X(st.arco[1] + 1) - 2; cx.beginPath(); cx.arc((a1 + a2) / 2, y0 - fs * 0.85, (a2 - a1) / 2, Math.PI, 0); cx.stroke(); }
      var hx = X(sA.length) + 12; cx.strokeStyle = ac || COL.oro; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(hx, y0 - fs); cx.lineTo(hx, y0 + 10); cx.lineTo(hx + Math.max(sB.length, 4) * cw + 20, y0 + 10); cx.stroke();
      cx.textAlign = 'left'; cx.fillStyle = COL.cian; cx.fillText(sB, hx + 12, y0 - 4);
      cx.fillStyle = COL.oro; cx.fillText(st.coc || '', hx + 12, y0 + fs + 12);
      cx.textAlign = 'right'; var y = y0 + dy;
      st.filas.forEach(function (f, k) {
        cx.fillStyle = f.rojo ? COL.rosa : COL.verde; cx.fillText(f.t, X(f.col + 1), y);
        if (f.rojo) { cx.strokeStyle = COL.tiza; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(X(f.col + 1) - f.t.length * cw * 0.62 - 4, y + 7); cx.lineTo(X(f.col + 1) + 4, y + 7); cx.stroke(); }
        y += dy;
      });
      cx.textAlign = 'center';
    }
    function trocea(cx, t, mw) {
      var out = [], pal = String(t).split(' '), l = '';
      pal.forEach(function (p) { var q = l ? l + ' ' + p : p; if (cx.measureText(q).width > mw && l) { out.push(l); l = p; } else l = q; });
      if (l) out.push(l); return out;
    }
    function pLin(cx, w, h, an, st, ac) {
      var L = st.lin || [], fs = Math.round(an.tipo === 'ecuacion' ? Math.min(34, w / 19) : Math.min(26, w / 26)), lh = Math.round(fs * 1.35), y = Math.round(fs * 1.6), x = 24, tod = [];
      cx.textAlign = 'left'; cx.textBaseline = 'alphabetic';
      L.forEach(function (l, i) {
        cx.font = (i === 0 && st.enun ? '600 ' : 'bold ') + fs + 'px ' + (an.tipo === 'texto' && i === 0 ? 'system-ui,sans-serif' : 'ui-monospace,Menlo,monospace');
        trocea(cx, l, w - 2 * x).forEach(function (q, j) { tod.push({ q: q, i: i, f: cx.font, sub: j }); });
      });
      var max = Math.floor((h - y) / lh) + 1; if (tod.length > max) tod = tod.slice(0, 2).concat(tod.slice(tod.length - max + 2));
      tod.forEach(function (o) {
        cx.font = o.f; var fin = st.fin && o.i === L.length - 1;
        if (o.i === st.act && o.sub === 0) { cx.fillStyle = 'rgba(57,217,255,.12)'; cx.fillRect(x - 10, y - fs - 4, w - 2 * x + 20, lh + 2); }
        cx.fillStyle = fin ? COL.oro : o.i === 0 && st.enun ? COL.tiza : o.i === st.act ? (ac || COL.oro) : COL.verde;
        cx.fillText(o.q, x, y); y += lh;
      });
    }
    function foto(an, k, w, h, acento) {
      var cv = D.createElement('canvas'); cv.width = w || 960; cv.height = h || 560;
      var P = pasos(an); pinta(cv.getContext('2d'), cv.width, cv.height, an, estado(an, P, k == null ? P.length : k), acento);
      return cv.toDataURL('image/jpeg', 0.82);
    }

    /* ─── voz ─── */
    var S = W.speechSynthesis;
    function voz() { if (!S) return null; var v = S.getVoices().filter(function (x) { return /^es/i.test(x.lang); }); return v.filter(function (x) { return /google/i.test(x.name) && /es[-_]ES/i.test(x.lang); })[0] || v.filter(function (x) { return /es[-_]ES/i.test(x.lang); })[0] || v[0] || null; }
    function di(t, cb) { var hecho = 0, f = function () { if (!hecho) { hecho = 1; cb && cb(); } }; if (!S || !t || !UI.voz) { setTimeout(f, Math.max(1800, String(t || '').length * 60)); return; } try { S.cancel(); } catch (e) { } if (W.EU_BIL && W.EU_BIL.activo) W.EU_BIL.parar(); /* (10-10-2026) Inglés: lo escrito en inglés con voz inglesa (b6_voz_bilingue.js) */ if (W.EU_BIL && W.EU_BIL.activo && W.EU_BIL.hay(String(t))) { W.EU_BIL.decir(String(t).replace(/<[^>]+>/g, ''), { rate: 0.95, es: voz() }, f); setTimeout(f, Math.max(3000, String(t).length * 110)); return; } var u = new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g, '')); u.lang = 'es-ES'; var v = voz(); if (v) u.voice = v; u.rate = 0.95; u.onend = f; u.onerror = f; setTimeout(f, Math.max(3000, t.length * 95)); S.speak(u); }
    function calla() { if (W.EU_BIL && W.EU_BIL.activo) W.EU_BIL.parar(); try { S && S.cancel(); } catch (e) { } }

    /* ─── ventana con las dos pizarras ─── */
    var UI = { voz: true };
    function el(t, css, txt) { var e = D.createElement(t); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }
    function bt(t, fondo, fn) { var b = el('button', 'font:600 12px system-ui,sans-serif;padding:6px 11px;border-radius:8px;border:0;background:' + fondo + ';color:#fff;cursor:pointer', t); b.onclick = fn; return b; }
    var PANEL = 'flex:1 1 320px;min-width:0;background:#0d1b2e;border:1px solid ' + COL.borde + ';border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:7px';
    function abrir(dat) {
      dat = dat || {}; calla();
      var prof = dat.prof ? analiza(dat.prof) : null, pt = prof && prof.tipo;
      var otros = (dat.otros || []).map(function (o) { return analiza(o, pt); }).filter(function (o) { return !prof || o.e !== prof.e; });
      /* el alumno hace OTRO ejercicio: el que se pulsó o, si no, uno igual con otros números o el siguiente de la página */
      var reto = dat.reto ? analiza(dat.reto, pt) : (similar(prof) || otros.shift() || prof);
      /* el profesor resuelve uno del mismo tipo que el reto; si el ejemplo del libro es de otro tipo, uno igual con otros números */
      if (!prof || prof.tipo !== reto.tipo || (reto.tipo === 'columnas' && prof.op !== reto.op) || (prof.e === reto.e && similar(reto))) prof = similar(reto) || prof || reto;
      otros = otros.filter(function (o) { return o.e !== reto.e && o.e !== prof.e; });
      var fondo = el('div', 'position:fixed;inset:0;z-index:2147483000;background:rgba(3,8,18,.82);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:12px;box-sizing:border-box;font-family:system-ui,Segoe UI,sans-serif');
      var caja = el('div', 'width:min(1180px,100%);background:#07111f;border:1px solid ' + COL.borde + ';border-radius:14px;padding:12px;color:#e8eef8;box-sizing:border-box');
      var cab = el('div', 'display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px');
      cab.appendChild(el('b', 'font-size:16px', '✍️ Pizarra · ' + (dat.titulo || 'Practica con tu tutor')));
      var der = el('div', 'display:flex;gap:6px'), bv = bt(UI.voz ? '🔊 Voz' : '🔇 Sin voz', '#1e3a5f', function () { UI.voz = !UI.voz; bv.textContent = UI.voz ? '🔊 Voz' : '🔇 Sin voz'; if (!UI.voz) calla(); });
      der.appendChild(bv); der.appendChild(bt('✕ Cerrar', '#7c3aed', cerrar)); cab.appendChild(der); caja.appendChild(cab);
      var fila = el('div', 'display:flex;gap:12px;flex-wrap:wrap'); caja.appendChild(fila);
      fondo.appendChild(caja); D.body.appendChild(fondo);
      function cerrar() { calla(); clearTimeout(PR.t); PR.auto = 0; fondo.remove(); D.removeEventListener('keydown', tecla); }
      function tecla(e) { if (e.key === 'Escape') cerrar(); }
      D.addEventListener('keydown', tecla);

      /* Pizarra del Profesor */
      var PR = { an: prof, P: pasos(prof), k: 1, auto: 0, t: 0 };
      var p1 = el('section', PANEL), h1 = el('div', 'display:flex;justify-content:space-between;font-size:13px');
      h1.appendChild(el('b', '', '👨‍🏫 Pizarra del Profesor')); var pill = el('span', 'color:' + COL.oro); h1.appendChild(pill); p1.appendChild(h1);
      var c1 = el('canvas', 'width:100%;height:auto;border-radius:8px;display:block'); c1.width = 640; c1.height = 400; p1.appendChild(c1);
      var ec1 = el('div', 'background:#111f36;border-radius:8px;padding:7px 10px;font:600 13px ui-monospace,Menlo,monospace;color:' + COL.oro + ';min-height:18px');
      var tx1 = el('div', 'font-size:13.5px;line-height:1.5;color:#cfe0f5;min-height:40px'); p1.appendChild(ec1); p1.appendChild(tx1);
      var ctr1 = el('div', 'display:flex;gap:6px;flex-wrap:wrap'), bAuto;
      ctr1.appendChild(bt('◀ Paso', '#13a36b', function () { para(); PR.k = Math.max(1, PR.k - 1); dibP(true); }));
      ctr1.appendChild(bAuto = bt('▶️ Auto clase', '#b88d10', function () { if (PR.auto) para(); else { PR.auto = 1; bAuto.textContent = '⏸️ Pausar'; if (PR.k >= PR.P.length) PR.k = 1; dibP(true, sigue); } }));
      ctr1.appendChild(bt('Paso ▶', '#13a36b', function () { para(); PR.k = Math.min(PR.P.length, PR.k + 1); dibP(true); }));
      p1.appendChild(ctr1); fila.appendChild(p1);
      function para() { PR.auto = 0; clearTimeout(PR.t); bAuto.textContent = '▶️ Auto clase'; calla(); }
      function sigue() { if (!PR.auto) return; if (PR.k >= PR.P.length) { para(); return; } PR.t = setTimeout(function () { if (!PR.auto) return; PR.k++; dibP(true, sigue); }, 500); }
      function dibP(habla, cb) {
        var p = PR.P[PR.k - 1]; pinta(c1.getContext('2d'), c1.width, c1.height, PR.an, estado(PR.an, PR.P, PR.k), COL.oro);
        pill.textContent = 'Paso ' + PR.k + ' de ' + PR.P.length; ec1.textContent = p && p.ecu ? '📐 ' + p.ecu : '📐 ' + (PR.an.e || '');
        tx1.textContent = p ? p.d : ''; if (habla) di(p ? p.d : '', cb);
      }

      /* Pizarra del Alumno */
      var AL = { an: reto, P: pasos(reto), k: 0, fallos: 0 }, colEsp = function () { return AL.P.filter(function (p) { return p.esp != null; }).length; };
      var p2 = el('section', PANEL.replace('#0d1b2e', '#0a1d33')), h2 = el('div', 'display:flex;justify-content:space-between;font-size:13px;gap:6px');
      h2.appendChild(el('b', '', '✍️ Pizarra del Alumno')); var pill2 = el('span', 'color:' + COL.cian + ';text-align:right'); h2.appendChild(pill2); p2.appendChild(h2);
      var c2 = el('canvas', 'width:100%;height:auto;border-radius:8px;display:block'); c2.width = 640; c2.height = 400; p2.appendChild(c2);
      var tit2 = el('div', 'font-weight:700;font-size:13.5px;color:' + COL.oro), tx2 = el('div', 'font-size:13.5px;line-height:1.5;color:#cfe0f5'), ec2 = el('div', 'background:#111f36;border-radius:8px;padding:7px 10px;font:600 13px ui-monospace,Menlo,monospace;color:' + COL.cian + ';min-height:18px');
      p2.appendChild(tit2); p2.appendChild(tx2); p2.appendChild(ec2);
      var fil = el('div', 'display:flex;gap:6px;flex-wrap:wrap'), inp = el('input', 'flex:1 1 140px;min-width:0;font:15px system-ui;padding:8px 10px;border-radius:8px;border:1px solid #2a4870;background:#fff;color:#0b1a2e');
      inp.placeholder = 'Resultado aquí…'; inp.onkeydown = function (e) { if (e.key === 'Enter') colocar(); };
      var bCol = bt('Colocar ➔', '#13a36b', function () { colocar(); }), ops = el('div', 'display:flex;gap:6px;flex-wrap:wrap');
      fil.appendChild(inp); fil.appendChild(bCol); p2.appendChild(fil); p2.appendChild(ops);
      var fb = el('div', 'font-size:13.5px;font-weight:600;color:' + COL.cian + ';min-height:20px'); p2.appendChild(fb);
      var apoyo = el('div', 'background:#0f2742;border:1px dashed #2a4870;border-radius:8px;padding:7px 10px;font-size:12.5px;color:#bcd3ee'); p2.appendChild(apoyo);
      var ctr2 = el('div', 'display:flex;gap:6px;flex-wrap:wrap');
      ctr2.appendChild(bt('🎲 Otro reto', '#b88d10', function () { var n = similar(AL.an) || otros.shift(); if (n) { if (!similar(AL.an)) otros.push(AL.an); nuevo(n); } else { fb.style.color = COL.cian; fb.textContent = 'No hay más ejercicios de este tipo en esta página.'; } }));
      ctr2.appendChild(bt('💡 Pista', '#1d4ed8', function () { var p = actual(); var t = AL.an.tipo === 'columnas' || AL.an.tipo === 'ecuacion' ? (p ? p.d : '') : pista(); fb.style.color = COL.oro; fb.textContent = '💡 ' + (t || 'Mira cómo lo resolvió el profesor, paso a paso.'); di(t); }));
      ctr2.appendChild(bt('📥 Hoja', '#334155', function () { hoja(AL.an, dat.titulo); }));
      ctr2.appendChild(bt('🔄 Reiniciar', '#334155', function () { nuevo(AL.an); }));
      p2.appendChild(ctr2); fila.appendChild(p2);
      function pista() { if (AL.an.pista) return AL.an.pista; var L = PR.an !== AL.an ? lineasDe(PR.an).map(function (l) { return l.trim(); }) : []; return L.length ? 'Fíjate en cómo lo resolvió el profesor: ' + L.join(' ') : 'Fíjate en cómo lo resolvió el profesor en su pizarra.'; }
      function actual() { while (AL.k < AL.P.length && AL.P[AL.k].esp == null && !AL.P[AL.k].fin) AL.k++; return AL.P[AL.k]; }
      function nuevo(an) { AL.an = an; AL.P = pasos(an); AL.k = 0; AL.fallos = 0; AL.hecho = 0; fb.textContent = ''; fb.style.color = COL.cian; ui(); }
      function apoyoTxt() {
        var a = AL.an;
        if (a.tipo === 'columnas' && a.op === '/') { var t = ''; for (var i = 1; i <= 9; i++) t += '<span style="display:inline-block;min-width:92px">' + a.B + ' × ' + i + ' = <b>' + a.B * i + '</b></span>'; return '<b>Tabla del ' + a.B + '</b><br>' + t; }
        if (a.tipo === 'columnas') return '<b>Columnas posicionales</b> · U = unidades (10⁰) · D = decenas (10¹) · C = centenas (10²) · UM = unidades de mil (10³)';
        if (a.tipo === 'ecuacion') return '<b>Regla</b> · lo que suma pasa restando, lo que resta pasa sumando; lo que multiplica pasa dividiendo. Al final, se comprueba.';
        return '<b>Ejercicio</b> · ' + esc(a.e);
      }
      function ui() {
        var a = AL.an, enLin = a.tipo === 'texto' || a.tipo === 'cadena', p = enLin ? null : actual();
        apoyo.innerHTML = apoyoTxt(); ops.innerHTML = '';
        pill2.textContent = a.tipo === 'columnas' ? 'Reto: ' + a.A + ' ' + SIM[a.op] + ' ' + a.B : a.tipo === 'ecuacion' ? 'Reto: ' + ecuTxt(a.a, a.b, a.c) : 'Reto';
        if (enLin) {
          var st = { lin: [a.e], enun: 1, act: 0 }; if (AL.hecho) { st.lin.push('→ ' + a.s); st.act = 1; st.fin = 1; }
          pinta(c2.getContext('2d'), c2.width, c2.height, a, st, COL.cian);
          tit2.textContent = AL.hecho ? '🎉 ¡Reto completado!' : '📌 Resuelve este ejercicio'; tx2.textContent = AL.hecho ? '' : 'Hazlo como el profesor y escribe tu respuesta.'; ec2.textContent = '';
          var o = a.tq === 'vf' ? ['Verdadero', 'Falso'] : a.tq === 'mc' ? (a.o || []).map(limpio) : null;
          fil.style.display = o || AL.hecho ? 'none' : 'flex';
          if (o && !AL.hecho) o.forEach(function (t, i) { ops.appendChild(bt(t, '#1e3a5f', function () { responder(a.tq === 'mc' ? (i === a.c ? a.s : '\u0000') : t); })); });
          if (!AL.hecho) setTimeout(function () { try { inp.focus(); } catch (e) { } }, 30);
          return;
        }
        pinta(c2.getContext('2d'), c2.width, c2.height, a, estado(a, AL.P, p && !p.fin ? AL.k : AL.P.length), COL.cian);
        fil.style.display = p && p.esp != null ? 'flex' : 'none';
        var hechos = AL.P.slice(0, AL.k).filter(function (q) { return q.esp != null; }).length;
        if (p && !p.fin) { tit2.textContent = '📌 ' + p.t; tx2.textContent = p.d; ec2.textContent = '📐 ' + p.ecu.replace(/=\s*-?[\d,]+(\s*→.*)?$/, '= ?'); inp.value = ''; inp.placeholder = 'Paso ' + (hechos + 1) + ' de ' + colEsp() + ' · resultado aquí…'; setTimeout(function () { try { inp.focus(); } catch (e) { } }, 30); }
        else { var f = AL.P[AL.P.length - 1]; tit2.textContent = '🎉 ¡Felicitaciones! Operación completada'; tx2.textContent = f ? f.d : ''; ec2.textContent = f ? '📐 ' + f.ecu : ''; }
      }
      function responder(v) {
        if (comprueba(v, AL.an.s, AL.an) || (AL.an.tq === 'mc' && v === AL.an.s)) { AL.hecho = 1; fb.style.color = COL.verde; fb.textContent = '✅ ¡Correcto! ' + (AL.an.x ? 'Por qué: ' + AL.an.x : ''); di('¡Correcto! ' + (AL.an.x || '')); ui(); return; }
        AL.fallos++;
        if (AL.fallos >= 2) { AL.hecho = 1; fb.style.color = COL.oro; fb.textContent = '👨‍🏫 La respuesta es: ' + AL.an.s + '. ' + (AL.an.x ? 'Por qué: ' + AL.an.x : 'Repasa los pasos del profesor y prueba con otro reto.'); di('La respuesta es ' + AL.an.s + '. ' + (AL.an.x || '')); ui(); return; }
        fb.style.color = COL.rosa; fb.textContent = '❌ Todavía no. ' + pista(); di('Todavía no. Vuelve a intentarlo.');
      }
      function colocar() {
        var a = AL.an, v = inp.value.trim(); if (!v) return;
        if (a.tipo === 'texto' || a.tipo === 'cadena') { if (!AL.hecho) responder(v); return; }
        var p = actual(); if (!p || p.esp == null) return;
        var ok = Math.abs(num(v.replace(/\s/g, '')) - p.esp) < 1e-9;
        if (ok) { fb.style.color = COL.verde; fb.textContent = '✅ ' + p.ok; di(p.ok); AL.k++; AL.fallos = 0; ui(); return; }
        AL.fallos++;
        if (AL.fallos >= 2) { fb.style.color = COL.oro; fb.textContent = '👨‍🏫 Era ' + fmt(p.esp) + '. ' + p.ecu + '. Lo escribimos y seguimos.'; di('Era ' + fmt(p.esp) + '. ' + p.d); AL.k++; AL.fallos = 0; ui(); return; }
        fb.style.color = COL.rosa; fb.textContent = '❌ ' + p.err; di(p.err);
      }
      dibP(false); ui(); di('Mira primero cómo lo resuelve el profesor. Pulsa Auto clase, o ve paso a paso. Después, haz tú el reto.');
      return { cerrar: cerrar };
    }
    function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

    /* ─── hoja de práctica para imprimir (como la de Fátima, con cuadrícula) ─── */
    function hoja(an, titulo) {
      var L = [an], n = 0, s; while (L.length < 6 && n++ < 20) { s = similar(an); if (!s) break; if (!L.some(function (o) { return o.e === s.e; })) L.push(s); }
      var w = W.open('', '_blank'); if (!w) return;
      var cuad = 'height:150px;border:1px solid #ccc;background-image:linear-gradient(#e5e5e5 1px,transparent 1px),linear-gradient(90deg,#e5e5e5 1px,transparent 1px);background-size:20px 20px;margin-top:8px';
      w.document.write('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Hoja de práctica</title></head><body style="font-family:Arial,sans-serif;padding:24px;color:#000">' +
        '<h1 style="text-align:center;border-bottom:2px solid #000;padding-bottom:8px;font-size:22px">✍️ Hoja de práctica · ' + esc(titulo || 'Practica con tu tutor') + '</h1>' +
        '<div style="display:flex;justify-content:space-between;font-weight:bold;margin:14px 0"><span>Alumno: ________________________</span><span>Fecha: ____________</span></div>' +
        '<p><b>Instrucciones:</b> ' + (an.tipo === 'columnas' ? 'resuelve cada ejercicio columna por columna en la cuadrícula. Escribe las llevadas o los préstamos.' : 'resuelve cada ejercicio paso a paso, como en la pizarra del profesor.') + '</p>' +
        L.map(function (o, i) { return '<div style="border:2px dashed #000;border-radius:10px;padding:12px 16px;margin:12px 0;break-inside:avoid"><div style="font-size:' + (o.tipo === 'columnas' || o.tipo === 'ecuacion' ? '30px;font-family:monospace;font-weight:bold;letter-spacing:3px' : '16px') + '">' + (i + 1) + ') ' + esc(o.e) + '</div><div style="' + cuad + '"></div></div>'; }).join('') +
        '<script>window.onload=function(){window.print()}<\/script></body></html>');
      w.document.close();
    }

    var API = { analiza: analiza, similar: similar, pasos: pasos, estado: estado, pinta: pinta, foto: foto, comprueba: comprueba, abrir: abrir, hoja: hoja, limpio: limpio, lineasDe: lineasDe };
    W.EU_PIZ = API;
    return API;
  }

  var API = MOTOR(window);
  API.fuente = function () { return '(' + MOTOR.toString() + ')(window);'; };
  window.EU_PIZARRA = API;
})();
