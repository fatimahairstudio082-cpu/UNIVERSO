/* b6_pelu_laboratorio.js — «🧪 Laboratorio de cortes» en la fila de Diagramación de Guías 3D (window.EU_LAB_CORTES).
   Genera miles de cortes dentro de los rangos que pone Fátima (número de capas, elevaciones mínima/máxima y paso,
   orden, guía móvil/fija, referencia del ángulo, coronilla oblicua, línea) y calcula cada uno con la calculadora
   capilar (EU_CALCULO_CAPILAR): largos en cm, forma resultante y cómo se trazan los ángulos con escuadra y cartabón.
   Se filtran por forma; cada uno se anima («▶ Ver», motor EU_DIAGRAMA) y se puede guardar en «mis cortes».
   Las cifras salen de los rangos que ella elige; los nombres de forma se calculan y van «a validar». */
(function () {
  'use strict';
  if (window.EU_LAB_CORTES) return;

  function azar(sem) { var a = sem >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var CORTA = { 'línea sólida · un solo largo': 'Un largo', 'capas uniformes': 'Uniforme', 'graduación · escalonado (peso abajo)': 'Escalonado', 'capas en aumento (más cortas arriba)': 'En aumento', 'forma combinada': 'Combinado' };

  /* op = { cantidad, capasMin, capasMax, gMin, gMax, paso, orden:'rampa'|'libre', guia:'movil'|'fija'|'mezcla', ref, coronilla:'no'|'si'|'mezcla', linea:''|'recta'|'redondeada'|'mezcla', semilla } */
  function generar(op) {
    var CC = window.EU_CALCULO_CAPILAR; if (!CC) return { cortes: [], formas: {} };
    op = Object.assign({ cantidad: 1000, capasMin: 3, capasMax: 10, gMin: 0, gMax: 225, paso: 5, orden: 'rampa', guia: 'movil', ref: 'craneo', coronilla: 'no', linea: '', semilla: 1 }, op || {});
    var r = azar(op.semilla * 2654435761 + op.cantidad), paso = Math.max(0.1, +op.paso || 5), gMin = Math.max(0, +op.gMin || 0), gMax = Math.min(225, Math.max(gMin, +op.gMax || 0));
    var nv = Math.floor((gMax - gMin) / paso) + 1, vistos = {}, cortes = [], formas = {}, intentos = 0, N = Math.min(20000, Math.max(1, +op.cantidad || 1000));
    var cMin = Math.max(1, Math.min(12, +op.capasMin || 3)), cMax = Math.max(cMin, Math.min(12, +op.capasMax || cMin));
    while (cortes.length < N && intentos < N * 20) {
      intentos++;
      var n = cMin + Math.floor(r() * (cMax - cMin + 1)), capas = [];
      for (var i = 0; i < n; i++) capas.push(Math.round((gMin + Math.floor(r() * nv) * paso) * 10) / 10);
      if (op.orden === 'rampa') capas.sort(function (a, b) { return a - b; });
      var guias = capas.map(function () { return op.guia === 'fija' ? 'f' : op.guia === 'mezcla' ? (r() < 0.3 ? 'f' : 'm') : 'm'; });
      var cor = op.coronilla === 'si' || (op.coronilla === 'mezcla' && r() < 0.5), lin = op.linea === 'mezcla' ? ['', 'recta', 'redondeada', 'v', 'a', 'diag_delante', 'diag_atras'][Math.floor(r() * 7)] : (op.linea || '');
      var clave = capas.join(',') + '|' + guias.join('') + '|' + (cor ? 1 : 0) + lin; if (vistos[clave]) continue; vistos[clave] = 1;
      var o = { capas: capas, guias: guias, ref: op.ref, part: 'vertical', linea: lin, acabado: 'recto', altura: 'nariz' };
      if (cor) o.coronilla = true;
      var c = CC.calcular(o); o.forma = c.forma; o.largos = c.largos;
      o.n = 'Lab · ' + (CORTA[c.forma] || c.forma) + ' · ' + capas.join('·') + '°' + (guias.indexOf('f') >= 0 ? ' · guía ' + guias.join('') : '') + (cor ? ' · coronilla △' : '') + (lin ? ' · ' + lin : '');
      formas[c.forma] = (formas[c.forma] || 0) + 1; cortes.push(o);
    }
    return { cortes: cortes, formas: formas };
  }

  var EST = { b: 'background:#7c3aed;color:#fff;border:0;border-radius:8px;padding:5px 10px;font:600 12px system-ui,sans-serif;cursor:pointer;white-space:nowrap',
    b2: 'background:#24244a;color:#e2e8f0;border:1px solid #3b3b5c;border-radius:8px;padding:5px 10px;font:600 12px system-ui,sans-serif;cursor:pointer;white-space:nowrap',
    in: 'background:#0f0f22;color:#e2e8f0;border:1px solid #3b3b5c;border-radius:8px;padding:5px 8px;font:12px system-ui,sans-serif;width:70px' };
  function h(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }

  function abrir(el) {
    var CC = window.EU_CALCULO_CAPILAR, GC = window.EU_GEOMETRIA_CAPILAR;
    var fondo = h('div', 'position:fixed;inset:0;z-index:99999;background:rgba(8,8,20,.82);display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box');
    var caja = h('div', 'background:#15152b;color:#e2e8f0;border:1px solid #3b3b5c;border-radius:14px;max-width:1000px;width:100%;max-height:100%;overflow:auto;padding:16px 20px;font:13px/1.45 system-ui,sans-serif');
    fondo.appendChild(caja); document.body.appendChild(fondo);
    function cerrar() { fondo.remove(); document.removeEventListener('keydown', tecla); }
    function tecla(e) { if (e.key === 'Escape') cerrar(); }
    document.addEventListener('keydown', tecla); fondo.addEventListener('click', function (e) { if (e.target === fondo) cerrar(); });
    var cab = h('div', 'display:flex;align-items:center;gap:10px;margin-bottom:8px'); cab.appendChild(h('b', 'font-size:17px;flex:1', '🧪 Laboratorio de cortes · geometría calculada'));
    var x = h('button', EST.b, '✕ Cerrar'); x.onclick = cerrar; cab.appendChild(x); caja.appendChild(cab);
    if (!CC) { caja.appendChild(h('div', '', 'La calculadora capilar no está cargada.')); return; }
    caja.appendChild(h('div', 'color:#a5a5c8;margin-bottom:8px', 'Pon los rangos: el laboratorio arma cortes con esas cifras, calcula los cm de cada capa con la curva de la cabeza (' + (CC.medidas().estandar ? 'maniquí estándar, a validar' : 'medidas de la clienta') + ') y dice qué forma sale. Los nombres de forma van a validar.'));
    var f = h('div', 'display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin-bottom:10px');
    function campo(et, nodo) { var l = h('label', 'display:inline-flex;gap:6px;align-items:center'); l.appendChild(h('span', 'color:#a5a5c8', et)); l.appendChild(nodo); f.appendChild(l); return nodo; }
    function num(v) { var i = h('input', EST.in); i.value = v; return i; }
    function sel(ops) { var s = h('select', EST.in + ';width:auto'); ops.forEach(function (o) { var q = h('option', '', o[1]); q.value = o[0]; s.appendChild(q); }); return s; }
    var cant = campo('Cortes', num(2000)), cmi = campo('Capas de', num(3)), cma = campo('a', num(10)), gmi = campo('Elevación de', num(0)), gma = campo('a', num(225)), pas = campo('cada', num(5));
    var ord = campo('Orden', sel([['rampa', 'Sube de abajo arriba'], ['libre', 'Cualquier orden']])), gui = campo('Guía', sel([['movil', 'Móvil'], ['fija', 'Fija'], ['mezcla', 'Mezcla']]));
    var ref = campo('Ángulo', sel([['craneo', 'Desde el cráneo'], ['suelo', 'Desde el suelo']])), cor = campo('Coronilla △', sel([['no', 'No'], ['si', 'Sí'], ['mezcla', 'Mezcla']]));
    var lin = campo('Línea', sel([['', 'Según la cabeza'], ['recta', 'Recta (cuadrada)'], ['redondeada', 'Redondeada (U)'], ['v', 'En V'], ['a', 'En A (V invertida)'], ['diag_delante', 'Diagonal hacia delante'], ['diag_atras', 'Diagonal hacia atrás'], ['mezcla', 'Mezcla']]));
    var go = h('button', EST.b, '🧪 Generar'); f.appendChild(go); caja.appendChild(f);
    var res = h('div'); caja.appendChild(res);
    var R = null, filtro = '';
    function lista() {
      res.innerHTML = '';
      if (!R) return;
      var tot = R.cortes.length, bar = h('div', 'display:grid;gap:4px;margin-bottom:10px');
      bar.appendChild(h('b', '', tot + ' cortes distintos · reparto por forma (toca una para filtrar)'));
      Object.keys(R.formas).sort(function (a, b) { return R.formas[b] - R.formas[a]; }).forEach(function (k) {
        var row = h('div', 'display:grid;grid-template-columns:260px 1fr 60px;gap:8px;align-items:center;cursor:pointer;padding:2px 4px;border-radius:6px;' + (filtro === k ? 'background:#2a2a52' : ''));
        row.appendChild(h('span', '', k)); var b = h('div', 'height:12px;border-radius:6px;background:#7c3aed;width:' + Math.max(1, Math.round(R.formas[k] / tot * 100)) + '%'); var w = h('div', 'background:#1e1e3c;border-radius:6px'); w.appendChild(b); row.appendChild(w); row.appendChild(h('span', 'text-align:right', String(R.formas[k])));
        row.onclick = function () { filtro = filtro === k ? '' : k; lista(); }; bar.appendChild(row);
      });
      res.appendChild(bar);
      var L = R.cortes.filter(function (o) { return !filtro || o.forma === filtro; }), g = h('div', 'display:grid;gap:4px');
      L.slice(0, 120).forEach(function (o) {
        var row = h('div', 'display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;align-items:center;background:#1e1e3c;border-radius:8px;padding:6px 10px');
        var a = h('div'); a.appendChild(h('b', 'font-size:12px', o.n)); a.appendChild(h('div', 'font-size:11px;color:#a5a5c8', 'Largos: ' + o.largos.map(function (v) { return CC.fmt(v); }).join(' · ') + ' cm')); row.appendChild(a);
        var bs = h('div', 'display:flex;gap:4px'), v = h('button', EST.b, '▶ Ver'), s = h('button', EST.b2, '💾 Guardar');
        v.onclick = function () { cerrar(); el._dg = { on: true, modo: 'angulos', t0: 0, libre: o }; if (el._dgCrear) el._dgCrear.sincro(); };
        s.onclick = function () { if (GC && GC.guardar(o)) { s.textContent = '✓ Guardado'; s.disabled = true; } };
        bs.appendChild(v); bs.appendChild(s); row.appendChild(bs); g.appendChild(row);
      });
      if (L.length > 120) g.appendChild(h('div', 'color:#a5a5c8', '… y ' + (L.length - 120) + ' más. Filtra por forma o cambia los rangos.'));
      res.appendChild(g);
    }
    go.onclick = function () {
      go.textContent = 'Calculando…';
      setTimeout(function () {
        R = generar({ cantidad: +cant.value, capasMin: +cmi.value, capasMax: +cma.value, gMin: +gmi.value, gMax: +gma.value, paso: +pas.value, orden: ord.value, guia: gui.value, ref: ref.value, coronilla: cor.value, linea: lin.value, semilla: Date.now() % 100000 });
        filtro = ''; go.textContent = '🧪 Generar'; lista();
      }, 20);
    };
  }

  window.EU_LAB_CORTES = { generar: generar, abrir: abrir };
})();
