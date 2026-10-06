/* b6_pelu_geometria.js — geometría capilar: técnicas de corte como PREAJUSTES de datos (window.EU_GEOMETRIA_CAPILAR).
   «La elevación es la figura geométrica del corte»: cada técnica es una lista de capas, de la nuca hacia arriba, con
   la elevación de cada una (0–225°), la partición, la línea de corte (recta = cuadrado, hacia delante = redondeado),
   la altura de la guía del frente y el acabado. EU_DIAGRAMA.libre(preajuste) arma el corte completo y lo anima.
   Las técnicas con cifras de Fátima van tal cual; las que no tienen cifras suyas llevan `validar: true` y así se
   muestran en pantalla («a validar por Fátima»): se pueden cambiar capa a capa en «Crear mi corte» de Guías 3D.
   Los cortes propios se guardan en localStorage `eu_cortes_mios` (clave nueva, no toca las existentes). */
(function () {
  'use strict';
  if (window.EU_GEOMETRIA_CAPILAR) return;

  function v(n, g) { var a = []; for (var i = 0; i < n; i++) a.push(g); return a; }
  var TECNICAS = [
    { id: 'pulir_puntas', n: 'Pulir las puntas', capas: v(5, 0), part: 'vertical', linea: 'recta', acabado: 'recto', altura: 'rostro',
      texto: 'Todo a 0°: se empareja el largo y se pulen las puntas sin quitar forma.' },
    { id: 'desgrafilado_puntas', n: 'Desgrafilado solo en puntas', capas: v(5, 30), part: 'vertical', acabado: 'desgrafilado', altura: 'rostro',
      texto: 'Todas las capas a 30°: las puntas se abren y ganan movimiento sin acortar.' },
    { id: 'cuadrado', n: 'Corte cuadrado', capas: v(5, 0), part: 'vertical', linea: 'recta', acabado: 'recto', altura: 'barbilla',
      texto: 'Solo la parte de atrás: guía en el centro a 0° y corte recto de lado a lado; el corte queda cuadrado.' },
    { id: 'redondeado', n: 'Corte redondeado', capas: v(5, 0), part: 'vertical', linea: 'redondeada', acabado: 'recto', altura: 'barbilla',
      texto: 'La misma guía en el centro a 0°, pero la línea de corte se lleva hacia delante: el corte queda redondeado.' },
    { id: 'corte_25', n: 'Corte a 25°', capas: v(5, 25), part: 'vertical', acabado: 'recto', altura: 'labio',
      texto: 'Todas las capas a 25°, en el lateral y en las verticales: peso abajo con una graduación suave.' },
    { id: 'capas_90', n: 'Capas uniformes a 90°', capas: v(6, 90), part: 'vertical', acabado: 'recto', altura: 'nariz',
      texto: 'Cada capa a 90° del cráneo y a la misma medida: forma redonda y peso igualado.' },
    { id: 'capas_rampa', n: 'Capas en rampa', capas: [0, 45, 90, 120, 135, 180, 220], part: 'vertical', acabado: 'recto', altura: 'nariz',
      texto: 'Se empieza en la nuca a 0° y cada capa sube su elevación: 45, 90, 120, 135, 180 y 220° en la coronilla.' },
    { id: 'capas_definidas', n: 'Capas definidas (10 capas)', capas: [0, 25, 35, 45, 90, 120, 135, 180, 200, 220], part: 'vertical', acabado: 'recto', altura: 'nariz',
      texto: 'Diez capas: 0, 25, 35, 45, 90, 120, 135, 180, 200 y 220°. Cada elevación deja la capa de arriba más corta.' },
    { id: 'desgrafilado_delante', n: 'Desgrafilado delante en capas', capas: v(5, 0), frente: [0, 30, 45, 60, 90], part: 'vertical', acabado: 'desgrafilado', altura: 'barbilla', validar: true,
      texto: 'Atrás se respeta el largo; delante, capas desgrafiladas con la guía desde la barbilla (o el cuello, según el largo).' },
    { id: 'shanghai', n: 'Shanghái', capas: [0, 45, 90, 135, 180, 220, 225], part: 'vertical', acabado: 'recto', altura: 'nariz', validar: true,
      texto: 'Coronilla sobredirigida a 220–225°; las capas de abajo suben poco a poco hasta llegar ahí.' },
    { id: 'box', n: 'Box (partición oblicua)', capas: [0, 45, 90, 135, 180, 200, 220], part: 'oblicua', acabado: 'recto', altura: 'nariz', validar: true,
      texto: 'Partición oblicua del box universal: nuca en abanico, lados en diagonal y triángulo arriba.' },
    { id: 'mariposa', n: 'Mariposa', capas: [0, 45, 90, 135, 180], frente: [0, 45, 90, 90, 90], part: 'vertical', acabado: 'desgrafilado', altura: 'labio', validar: true,
      texto: 'Capas largas por fuera y capas cortas arriba que enmarcan el rostro como alas.' },
    { id: 'desgrafilado_corto', n: 'Desgrafilado corto', capas: [30, 45, 60, 90], part: 'vertical', acabado: 'desgrafilado', altura: 'ojo', validar: true,
      texto: 'Capas cortas con las puntas abiertas: mucho movimiento y poco peso.' },
    { id: 'desgrafilado_largo', n: 'Desgrafilado largo', capas: [0, 15, 30, 45], part: 'vertical', acabado: 'desgrafilado', altura: 'cuello', validar: true,
      texto: 'Se conserva el largo y solo se abren las puntas con poca elevación.' }
  ];
  var ELEVACIONES = [0, 25, 30, 35, 45, 60, 90, 120, 135, 180, 200, 220, 225];

  var CLAVE = 'eu_cortes_mios';
  function mios() { try { var a = JSON.parse(localStorage.getItem(CLAVE) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function guardar(o) {
    if (!o || !o.n) return false;
    var a = mios().filter(function (x) { return x.n !== o.n; }); a.push(o);
    try { localStorage.setItem(CLAVE, JSON.stringify(a)); return true; } catch (e) { return false; }
  }
  function quitar(n) { try { localStorage.setItem(CLAVE, JSON.stringify(mios().filter(function (x) { return x.n !== n; }))); } catch (e) { } }
  function tecnica(id) { return TECNICAS.filter(function (t) { return t.id === id; })[0] || null; }
  /* receta animable de una técnica o de un corte propio */
  function receta(o) { var DG = window.EU_DIAGRAMA; if (!DG || !o) return null; var R = DG.libre(o); if (o.texto) R.capas.texto = o.texto; return R; }

  /* Variantes: atrás se corta con una técnica y delante con otra (el lateral se divide de oreja a oreja), la guía del
     frente a una de sus alturas y el cabello normal (vertical) o liso extremo (horizontal). Solo técnicas con cifras de
     Fátima (las «a validar» no entran). Todas las elevaciones salen de sus técnicas: aquí solo se combinan.
     Orden fijo: por rondas; en cada ronda salen las 56 parejas atrás/delante una vez (salteadas), cada una con otra
     altura y cabello, así un libro no repite pareja hasta haberlas usado todas. */
  var ALT_N = { cejas: 'bajo las cejas', ojo: 'bajo el ojo', nariz: 'bajo la nariz', labio: 'bajo el labio', barbilla: 'en la barbilla', rostro: 'donde termina el rostro', cuello: 'en el cuello' };
  var VAR = null;
  function variantes() {
    if (VAR) return VAR;
    var base = TECNICAS.filter(function (t) { return !t.validar; }), alts = Object.keys(ALT_N), pares = [];
    base.forEach(function (A) { base.forEach(function (F) { if (A !== F) pares.push([A, F]); }); });
    var P = pares.length, K = alts.length * 2, paso = 25; while (P % paso === 0 || mcd(P, paso) !== 1) paso++;
    VAR = [];
    for (var r = 0; r < K; r++) for (var q = 0; q < P; q++) {
      var p = (q * paso) % P, A = pares[p][0], F = pares[p][1], c = (r + p * 3) % K, al = alts[c % alts.length], liso = c >= alts.length;
      VAR.push({ id: 'var_' + A.id + '__' + F.id + '__' + al + (liso ? '__liso' : ''), base: [A.id, F.id], variante: true,
        n: 'Atrás ' + A.n.toLowerCase() + ' · delante ' + F.n.toLowerCase() + ' · guía ' + ALT_N[al] + (liso ? ' · liso extremo' : ''),
        capas: A.capas.slice(), frente: (F.frente || F.capas).slice(), part: liso ? 'horizontal' : 'vertical', altura: al,
        linea: A.linea || '', acabado: F.acabado, texto: 'Atrás, como en «' + A.n + '»: ' + A.texto + ' Delante, como en «' + F.n + '»: ' + F.texto });
    }
    return VAR;
  }
  function mcd(a, b) { return b ? mcd(b, a % b) : a; }
  function variante(id) { return variantes().filter(function (v) { return v.id === id; })[0] || null; }

  window.EU_GEOMETRIA_CAPILAR = { TECNICAS: TECNICAS, ELEVACIONES: ELEVACIONES, tecnica: tecnica, receta: receta, mios: mios, guardar: guardar, quitar: quitar, variantes: variantes, variante: variante, ALT_N: ALT_N };
})();
