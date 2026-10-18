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
    { id: 'cuadrado', n: 'Corte cuadrado', capas: v(5, 0), part: 'vertical', linea: 'recta', acabado: 'recto', altura: 'barbilla', foto: 'bob_recto.jpg',
      texto: 'Solo la parte de atrás: guía en el centro a 0° y corte recto de lado a lado; el corte queda cuadrado.' },
    { id: 'redondeado', n: 'Corte redondeado', capas: v(5, 0), part: 'vertical', linea: 'redondeada', acabado: 'recto', altura: 'barbilla', foto: 'basicos_0grados.jpg',
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
    { id: 'shanghai', n: 'Shanghái', capas: [0, 45, 90, 135, 180, 220, 225], part: 'vertical', acabado: 'recto', altura: 'nariz', validar: true, coronilla: true,
      texto: 'Coronilla sobredirigida a 220–225°; las capas de abajo suben poco a poco hasta llegar ahí.' },
    { id: 'box', n: 'Box (partición oblicua)', capas: [0, 45, 90, 135, 180, 200, 220], part: 'oblicua', acabado: 'recto', altura: 'nariz', validar: true, coronilla: true,
      texto: 'Partición oblicua del box universal: nuca en abanico, lados en diagonal y triángulo arriba.' },
    { id: 'mariposa', n: 'Mariposa', capas: [0, 45, 90, 135, 180], frente: [0, 45, 90, 90, 90], part: 'vertical', acabado: 'desgrafilado', altura: 'labio', validar: true, foto: 'mariposa.jpg',
      texto: 'Capas largas por fuera y capas cortas arriba que enmarcan el rostro como alas.' },
    { id: 'desgrafilado_corto', n: 'Desgrafilado corto', capas: [30, 45, 60, 90], part: 'vertical', acabado: 'desgrafilado', altura: 'ojo', validar: true,
      texto: 'Capas cortas con las puntas abiertas: mucho movimiento y poco peso.' },
    { id: 'desgrafilado_largo', n: 'Desgrafilado largo', capas: [0, 15, 30, 45], part: 'vertical', acabado: 'desgrafilado', altura: 'cuello', validar: true,
      texto: 'Se conserva el largo y solo se abren las puntas con poca elevación.' },
    /* Nivel 1 · para quien nunca ha cortado (Fátima, 12-10-2026, sus guías visuales en referencias/): todo cae hacia abajo,
       a 0°; cambia cómo se secciona y la línea que queda atrás. `foto` = su imagen de referencia. No entran en las variantes. */
    { id: 'p1_v_invertida', nivel: 1, n: 'Seccionado en V invertida', capas: v(5, 0), part: 'vertical', linea: 'v', acabado: 'recto', altura: 'barbilla', foto: 'v_invertida.jpg',
      texto: 'Secciones en V invertida desde la raya central. Todo el cabello cae hacia abajo, a 0°, y atrás la línea queda en V.' },
    { id: 'p1_wap', nivel: 1, n: 'Técnica reducida WAP (V invertida)', capas: v(5, 0), part: 'vertical', linea: 'v', acabado: 'recto', altura: 'rostro', foto: 'wap.jpg',
      texto: 'Secciones en V invertida más juntas, de la nuca a la coronilla. Todo cae hacia abajo, a 0°, y atrás la línea queda en V.' },
    { id: 'p1_punta', nivel: 1, n: 'Seccionado en punta', capas: v(5, 0), part: 'vertical', linea: 'v', acabado: 'recto', altura: 'cuello', foto: 'punta.jpg',
      texto: 'Secciones diagonales que bajan hacia el centro. Todo cae hacia abajo, a 0°, y atrás el corte termina en punta.' },
    { id: 'p1_curvo', nivel: 1, n: 'Seccionado curvo (en U)', capas: v(5, 0), part: 'vertical', linea: 'redondeada', acabado: 'recto', altura: 'cuello', foto: 'seccionados.jpg',
      texto: 'Secciones curvas que siguen la forma de la cabeza. Todo cae hacia abajo, a 0°, y atrás la línea queda en U.' },
    { id: 'p1_horizontal', nivel: 1, n: 'Seccionado horizontal en capas (cuadrado)', capas: v(5, 0), part: 'vertical', linea: 'recta', lineaFrente: 'recta', acabado: 'recto', altura: 'cuello', foto: 'horizontal_capas.jpg',
      texto: 'Secciones horizontales de la nuca a la coronilla. Todo cae hacia abajo, a 0°, y la línea queda recta: cuadrado.' },
    { id: 'p1_vertical_corto', nivel: 1, n: 'Seccionado vertical con graduación (bob)', capas: v(5, 0), part: 'vertical', linea: 'redondeada', acabado: 'recto', altura: 'barbilla', foto: 'vertical_graduado_corto.jpg',
      texto: 'Secciones verticales desde la raya central hacia los lados. Todo cae hacia abajo, a 0°, y la línea queda suave alrededor del cuello.' },
    /* Pollina, flequillo y acabados de puntas (Fátima, 12-10-2026, explicados por ella): `aparte` = no entran en las variantes */
    { id: 'pollina_recta', aparte: 1, n: 'Pollina recta', capas: v(3, 0), frente: [0], part: 'vertical', lineaFrente: 'recta', acabado: 'recto', altura: 'cejas',
      texto: 'En cabello ondulado la pollina se saca por alrededor, más abajo de las cejas. Con la persona de frente se corta recto, a 0°, y la pollina queda recta.' },
    { id: 'flequillo_v', aparte: 1, n: 'Flequillo en V desgrafilado', capas: v(3, 0), frente: [0], part: 'vertical', acabado: 'desgrafilado', altura: 'ojo',
      texto: 'Se agarra la primera mecha y se mide más o menos donde terminan los ojos; se corta recto a 0°. Luego se jala el mechón triangular completo, se dobla y se corta: queda en V, bien desgrafiladito.' },
    { id: 'navaja_puntas', aparte: 1, n: 'Desgrafilado con navaja en las puntas', capas: v(5, 0), part: 'vertical', acabado: 'desgrafilado', altura: 'barbilla',
      texto: 'Con navaja, en las puntas: se pasa la navaja con cuidado a un centímetro del cabello, apenas un centímetro, no un dedo. El corte queda más desgrafilado.' },
    { id: 'zigzag_puntas', aparte: 1, n: 'Zigzag en las puntas', capas: v(5, 0), part: 'vertical', acabado: 'desgrafilado', altura: 'rostro',
      texto: 'Se corta el cabello y luego se va agarrando mechón por mechón, con la misma división del corte. En las puras puntas, con la punta de la tijera y en horizontal, se cortan triangulitos en V pequeñitos, punta sobre punta, a un centímetro del cabello. Se puede hacer a cualquier elevación.' }
  ];
  /* fotos de referencia (referencias/*.jpg) como data URL, para que viajen dentro del libro y del curso */
  TECNICAS.forEach(function (t) {
    if (!t.foto || !window.fetch) return;
    fetch('./referencias/' + t.foto).then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
      if (!b) return; var fr = new FileReader(); fr.onload = function () { t.fotoURL = fr.result; }; fr.readAsDataURL(b);
    }).catch(function () { });
  });
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
    var base = TECNICAS.filter(function (t) { return !t.validar && !t.nivel && !t.aparte; }), alts = Object.keys(ALT_N), pares = [];
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
  /* Fátima, 15-10-2026: la forma de atrás (cuadrado, U, V larga) es el resultado; la técnica es la elevación de cada mechón,
     vertical en cabello normal u ondulado y horizontal en liso extremo, guía desde la nariz y emparejado en la oreja.
     Forma × elevaciones de sus técnicas con cifras (y todo a 0°) × cabello × emparejar (en liso extremo el motor no empareja). Nivel 1 = todo a 0°; 2 = con elevación. */
  var VF = null, FORMA_N = { recta: 'cuadrado', redondeada: 'en U (redondo)', v: 'V larga' };
  function variantesForma() {
    if (VF) return VF;
    var pilas = [{ id: 'cero', n: 'todo a 0°', capas: v(5, 0) }], vistas = { '0,0,0,0,0': 1 };
    TECNICAS.forEach(function (t) { var k = t.capas.join(); if (!t.validar && !t.nivel && !t.aparte && !vistas[k]) { vistas[k] = 1; pilas.push({ id: t.id, n: t.n, capas: t.capas }); } });
    var n1 = [], n2 = [];
    pilas.forEach(function (pl) { ['recta', 'redondeada', 'v'].forEach(function (lin) { [false, true].forEach(function (liso) { (liso ? ['no'] : ['atras', 'delante']).forEach(function (emp) {
      var niv = pl.capas.some(function (g) { return g > 0; }) ? 2 : 1;
      (niv === 1 ? n1 : n2).push({ id: 'vf_' + lin + '__' + pl.id + (liso ? '__liso' : '__' + emp), variante: true, forma: true, nivel: niv,
        n: 'Forma ' + FORMA_N[lin] + ' · ' + (niv === 1 ? 'sin elevación' : 'mechones ' + pl.capas.join('·') + '°') + (liso ? ' · liso extremo' : '') + (emp === 'atras' ? ' · emparejado hacia atrás' : emp === 'delante' ? ' · emparejado hacia delante' : ''),
        capas: pl.capas.slice(), part: liso ? 'horizontal' : 'vertical', altura: 'nariz', linea: lin, acabado: 'recto', emparejar: emp,
        texto: 'Atrás queda ' + FORMA_N[lin] + '. ' + (niv === 1 ? 'Todos los mechones a 0°, cayendo hacia el suelo.' : 'Mechones de abajo arriba a ' + pl.capas.join(', ') + ' grados.') +
          (liso ? ' Cabello liso extremo: todas las secciones en horizontal.' : ' Cabello normal u ondulado: secciones en vertical.') + ' Guía del frente desde la nariz. ' +
          (emp === 'atras' ? 'Al final se empareja el de delante hacia atrás: queda redondo.' : emp === 'delante' ? 'Al final se empareja el de atrás hacia delante.' : '') });
    }); }); }); });
    VF = n1.concat(n2);
    return VF;
  }
  /* Fátima, 18-10-2026: cortes básicos sin elevación primero (cuadrado, redondo, V, U, V invertida…), luego los avanzados */
  var BASICOS = ['cuadrado', 'redondeado', 'p1_punta', 'p1_curvo', 'p1_v_invertida', 'p1_wap', 'p1_horizontal', 'p1_vertical_corto'];
  function basicos() { return BASICOS.map(tecnica).filter(Boolean); }
  function variante(id) { return (/^vf_/.test(id) ? variantesForma() : variantes()).filter(function (v) { return v.id === id; })[0] || null; }

  window.EU_GEOMETRIA_CAPILAR = { TECNICAS: TECNICAS, BASICOS: BASICOS, basicos: basicos, ELEVACIONES: ELEVACIONES, tecnica: tecnica, receta: receta, mios: mios, guardar: guardar, quitar: quitar, variantes: variantes, variantesForma: variantesForma, variante: variante, ALT_N: ALT_N };
})();
