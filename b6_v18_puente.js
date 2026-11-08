/* b6_v18_puente.js — puente entre el maniquí V18 y los motores de Guías 3D (window.EU_V18_PUENTE).
   Se carga solo en «Fátima Studio V18 · Labios que hablan..html». Va dentro de «CONECTAR UN CEREBRO».
   Reutiliza los motores que ya existen, sin copiarlos y sin traer el maniquí de Guías 3D:
     EU_CORTES (catálogo de cortes) · EU_DIAGRAMA.receta (pila de elevaciones Z0–Z6, línea, partición, cabello).
   Dibuja sobre el cabello real del V18 con su propio motor de corte (CorteMotor) y pone el reloj de elevación AL LADO
   del maniquí, nunca encima. No inventa grados: todos salen de la receta del corte. */
(function () {
  'use strict';
  var MOTORES = ['b6_cerebro.js', 'b6_divisiones.js', 'b6_cortes.js', 'b6_pelu_geometria.js', 'b6_pelu_calculo.js', 'b6_pelu_diagrama.js'];
  var LINEA = { recta: 'recto', redondeada: 'redondo', u: 'u', v: 'v' };           /* línea de atrás del motor → contorno del V18 */
  var LARGO = { hombro: 0.26 };                                                      /* solo lo que el corte dice y el V18 ya nombra («Hombros») */
  var SECC = ['Nuca central', 'Posterior izquierdo', 'Posterior derecho', 'Lateral izquierdo', 'Lateral derecho'];
  var R = null, activo = false;

  function cargar() {
    if (window.EU_DIAGRAMA && window.EU_CORTES) return Promise.resolve();
    return MOTORES.reduce(function (p, f) {
      return p.then(function () {
        return new Promise(function (ok) {
          var s = document.createElement('script'); s.src = './' + f; s.onload = ok; s.onerror = ok; document.head.appendChild(s);
        });
      });
    }, Promise.resolve()).then(function () { if (!(window.EU_DIAGRAMA && window.EU_CORTES)) throw new Error('motores no disponibles'); });
  }
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function media(a) { var n = a.filter(function (v) { return v != null; }); return n.length ? n.reduce(function (s, v) { return s + v; }, 0) / n.length : 0; }

  /* elevación real de cada sección del V18: atrás (nuca y posteriores) = pila de atrás; laterales = pila del frente */
  function elevaciones(r) {
    var a = media(r.capas.pila), f = media(r.frente && r.frente.pila ? r.frente.pila : r.capas.pila);
    return [a, a, a, f, f];
  }
  function vertical(r) {
    var cero = r.capas.pila.every(function (v) { return !v; }) && (!r.frente || r.frente.pila.every(function (v) { return !v; }));
    return !r.liso && r.capas.part !== 'oblicua' && !(cero && r.linea === 'recta');
  }

  function ficha(r) {
    var pa = r.capas.pila, pf = r.frente && r.frente.pila ? r.frente.pila : pa;
    return '<b>' + esc(r.n) + '</b><br>' +
      'Cabello: ' + esc(r.liso ? 'liso extremo' : r.cab) + ' · corte ' + (vertical(r) ? '<b>en vertical</b>' : '<b>en horizontal</b>') + '<br>' +
      'Línea de atrás: ' + esc(r.linea) + ' · partición: ' + esc(r.capas.part) + '<br>' +
      'Atrás Z0→Z6: <b>' + pa.map(function (v) { return v + '°'; }).join(' · ') + '</b><br>' +
      'Frente Z0→Z6: <b>' + pf.map(function (v) { return v + '°'; }).join(' · ') + '</b>';
  }

  function aplicar() {
    var id = $('eg3dCorte').value; R = window.EU_DIAGRAMA.receta(id); if (CAPA && !CAPA.playing && CAPA.id !== id) limpiar();
    $('eg3dFicha').innerHTML = ficha(R); if ($('eg3dLargoInfo')) refrescarLargo();
    var perfil = $('cutProfile'); perfil.value = LINEA[R.linea] || 'recto'; perfil.dispatchEvent(new Event('change'));
    if (LARGO[R.largo] != null) { var t = $('cutTarget'); t.value = LARGO[R.largo]; t.dispatchEvent(new Event('input')); }
    var e = elevaciones(R);
    window.CorteMotor.setElev(e.map(function (g) { return Math.min(2, g / 90); }));      /* 1 = elevación de 90° en el V18 */
    window.EU_V18_PUENTE.elev = e;
    $('eg3dNota').textContent = 'Aplicado: contorno «' + $('cutProfile').selectedOptions[0].text + '» y elevaciones reales por sección. ' +
      'El largo de la guía va en pulgadas (botones o largo exacto); «Cortar capa por capa» usa los grados reales de cada capa.';
    activo = true; reloj(); refrescarLargo();
  }

  /* reloj de elevación: junto al maniquí, no encima */
  function relojHTML() {
    var d = $('eg3dReloj'); if (d) return d;
    d = document.createElement('div'); d.id = 'eg3dReloj'; d.setAttribute('aria-live', 'polite');
    d.style.cssText = 'position:absolute;right:16px;top:16px;z-index:3;width:150px;padding:10px 10px 8px;background:rgba(15,11,9,.82);border:1px solid #3a2e24;border-radius:3px;text-align:center;display:none;pointer-events:none';
    d.innerHTML = '<svg viewBox="0 0 100 80" width="130" height="104" aria-hidden="true"><path d="M17 66 A38 38 0 1 1 83 66" fill="none" stroke="#3a2e24" stroke-width="6" stroke-linecap="round"/>' +
      '<path id="eg3dArco" d="M17 66 A38 38 0 1 1 83 66" fill="none" stroke="#c9a36a" stroke-width="6" stroke-linecap="round" pathLength="225" stroke-dasharray="0 225"/>' +
      '<line id="eg3dAguja" x1="50" y1="46" x2="50" y2="14" stroke="#f3ebe1" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="46" r="3" fill="#f3ebe1"/>' +
      '<text x="50" y="76" text-anchor="middle" fill="#b9ab9b" font-size="6">0°  ·  225°</text></svg>' +
      '<div id="eg3dGrados" style="font:500 26px/1 \'Cormorant Garamond\',Georgia,serif;color:#c9a36a">0°</div>' +
      '<div id="eg3dSec" style="font-size:11px;color:#b9ab9b;margin-top:2px;letter-spacing:.04em"></div>' +
      '<div id="eg3dLargo" style="font-size:12px;color:#e9d9c4;margin-top:4px"></div>';
    $('stage').appendChild(d); return d;
  }
  function reloj() {
    var d = relojHTML();
    (function tic() {
      if (!activo) { d.style.display = 'none'; return; }
      var s = window.CorteMotor.state(), g = 0, en = s.active >= 0, nom = SECC[s.active] || '';
      if (CAPA && CAPA.playing || (CAPA && CAPA.T >= 1 && CAPA.T < totalPasos())) { var cur = Math.floor(CAPA.T); en = cur >= 1 && cur < totalPasos(); g = window.EU_V18_PUENTE.g || 0; nom = 'Capa ' + (Math.floor((cur - 1) / CAPA.J) + 1) + ' · mechón ' + ((cur - 1) % CAPA.J + 1); }
      else if (en && window.EU_V18_PUENTE.elev) g = Math.round(window.EU_V18_PUENTE.elev[s.active] * (s.lift > 0 ? 1 : 0));
      d.style.display = en ? 'block' : 'none';
      if (en) {
        $('eg3dGrados').textContent = g + '°'; $('eg3dSec').textContent = nom; var lgx = $('eg3dLargo'); if (lgx) lgx.textContent = CAPA && window.EU_V18_PUENTE.largo != null ? fm(window.EU_V18_PUENTE.largo) + '″ · ' + fm(window.EU_V18_PUENTE.largo * CM_PULG) + ' cm' : '';
        $('eg3dArco').setAttribute('stroke-dasharray', Math.min(225, g) + ' 225');
        $('eg3dAguja').setAttribute('transform', 'rotate(' + (-135 + Math.min(225, g) * 1.2) + ' 50 46)');
      }
      requestAnimationFrame(tic);
    })();
  }


  /* ───────────── corte capa por capa (Z0→Z6), mechón por mechón ─────────────
     · capa k = nivel `h` de cada mechón del V18 (el mismo que ya usa su «rise» de capas): k = 0 la guía (nuca) … 6 arriba.
     · largo de cada capa = la guía + (largo de la capa − largo de la guía) que da el ESCÁNER (EU_CALCULO_CAPILAR.calcular
       con los grados de la receta). No se inventa ninguna medida.
     · atrás se corta con la pila de atrás y los laterales con la del frente; cada capa se divide en J mechones verticales
       (en horizontal, J = 1); primero los de atrás y después los de delante, separados por la línea azul de oreja a oreja. */
  var CAPA = null, T3 = null;
  var N_CAPAS = 7, J_MECH = 6;
  function posA(r) { return r.kind === 'back' ? 0.25 + 0.5 * r.q : (r.side < 0 ? 0.25 * (1 - r.q) : 0.75 + 0.25 * r.q); }  /* 0 = delante izq … 1 = delante der */
  function modelo() {
    var H = window.CorteMotor.hair(), n = R.capas.pila.every(function (v) { return !v; }) && (!R.frente || R.frente.pila.every(function (v) { return !v; })) ? 1 : N_CAPAS;
    var J = vertical(R) ? J_MECH : 1, pB = R.capas.pila, pF = R.frente && R.frente.pila ? R.frente.pila : pB;
    function deltas(p) { var c = window.EU_CALCULO_CAPILAR.calcular({ capas: p, guias: ['m'], ref: 'craneo' }), o = []; for (var k = 0; k < n; k++) o.push((c.largos[Math.min(k, c.largos.length - 1)] - c.largos[0]) / 100); return { d: o, cm: c.largos, forma: c.forma }; }
    var dB = deltas(pB), dF = deltas(pF);
    var recs = H.records.filter(function (r) { return r.kind === 'back' || r.kind === 'side'; });
    recs.forEach(function (r) { r.pk = Math.min(n - 1, Math.floor(r.h * n)); r.pm = Math.min(J - 1, Math.floor(posA(r) * J)); });
    /* orden de los mechones: primero los de atrás (entre las dos orejas), luego los de delante */
    var ms = []; for (var m = 0; m < J; m++) ms.push(m);
    var centro = function (m) { return (m + 0.5) / J; }, atras = function (m) { return centro(m) >= 0.25 && centro(m) < 0.75; };
    ms.sort(function (a, b) { return (atras(b) ? 1 : 0) - (atras(a) ? 1 : 0) || a - b; });
    var pos = {}; ms.forEach(function (m, i) { pos[m] = i; });
    return { id: R.id, H: H, n: n, J: J, pB: pB, pF: pF, dB: dB, dF: dF, recs: recs, ms: ms, pos: pos, atras: atras, T: 0, ver: 1, playing: false, last: 0, camAnt: '', hl: null };
  }
  function pasoDe(k, m) { return 1 + k * CAPA.J + CAPA.pos[m]; }       /* 0 = dividir la cabeza; 1… = cada mechón */
  function totalPasos() { return 1 + CAPA.n * CAPA.J; }
  function info(r) {
    var C = CAPA, cur = Math.floor(C.T), p = C.T - cur, st = pasoDe(r.pk, r.pm), pila = r.kind === 'back' ? C.pB : C.pF;
    var d = (r.kind === 'back' ? C.dB : C.dF).d[r.pk] || 0, g = pila[Math.min(pila.length - 1, r.pk)] || 0, kmax = Math.min(2, g / 90);
    /* pinzas: el cabello de las capas que aún no se trabajan queda recogido arriba; cada capa se suelta cuando le toca */
    var K = cur < 1 ? -1 : Math.floor((cur - 1) / C.J), primero = cur >= 1 && (cur - 1) % C.J === 0, e = Math.min(1, p / 0.25); e = e * e * (3 - 2 * e);
    var clip = cur < 1 ? 0 : r.pk > K ? (K === 0 && primero ? e : 1) : r.pk === K ? (K > 0 && primero ? 1 - e : 0) : 0;
    if (st < cur) return { amount: 1, lift: 0, hl: false, delta: d, clip: clip };
    if (st > cur) return { amount: 0, lift: 0, hl: false, delta: d, clip: clip };
    var lift = (p < 0.25 ? p / 0.25 : p < 0.75 ? 1 : (1 - p) / 0.25) * kmax, amount = Math.max(0, Math.min(1, (p - 0.25) / 0.5));
    return { amount: amount, lift: lift, hl: true, delta: d, clip: clip };
  }
  function pintarCorte() {
    var C = CAPA, S = window.CorteMotor.state();
    C.H.update([0, 0, 0, 0, 0], -1, 0, S.target, S.profile, false, { ver: C.ver, info: info });
    divisiones(); tijera(); estadoUI(); camaraPaso();
  }
  /* líneas de división (verticales entre mechones) y línea azul de oreja a oreja */
  function divisiones() {
    var C = CAPA; if (!T3) return;
    var vis = C.T < 1 ? C.T : 1;                                   /* aparecen durante el paso 0 y se quedan */
    if (!C.lineas) {
      C.lineas = new T3.Group(); C.lineas.name = 'Divisiones del motor'; C.H.group.add(C.lineas);
      var mat = new T3.LineBasicMaterial({ color: 0x6fffe1, transparent: true, opacity: 0.9, depthTest: false }), azul = new T3.LineBasicMaterial({ color: 0x4db8ff, transparent: true, opacity: 0.95, depthTest: false });
      for (var b = 1; b < C.J; b++) {
        var rb = C.recs.filter(function (r) { return r.pk === 0; }).reduce(function (best, r) { return !best || Math.abs(posA(r) - b / C.J) < Math.abs(posA(best) - b / C.J) ? r : best; }, null), pts = [];
        for (var j = 0; j <= 24; j++) pts.push(new T3.Vector3());
        var l = new T3.Line(new T3.BufferGeometry().setFromPoints(pts), mat); l.renderOrder = 9; l.frustumCulled = false; l.userData.rec = rb; C.lineas.add(l);
      }
      var oj = []; for (var i = 0; i <= 30; i++) { var f = -Math.PI / 2 + Math.PI * i / 30; oj.push(new T3.Vector3(0.108 * Math.sin(f), 0.12 + 0.136 * Math.cos(f), -0.012)); }
      var la = new T3.Line(new T3.BufferGeometry().setFromPoints(oj), azul); la.renderOrder = 9; la.frustumCulled = false; C.lineas.add(la);
    }
    C.lineas.visible = true;
    C.lineas.children.forEach(function (l) {
      l.material.opacity = 0.9 * vis; var rb = l.userData.rec; if (!rb) return;
      var fin = Math.max(0.3, rb.stop == null ? 1 : rb.stop), pa = l.geometry.attributes.position;       /* hasta donde llega el cabello */
      for (var j = 0; j <= 24; j++) { var q = C.H.path(rb, 0.02 + (fin - 0.02) * j / 24); pa.setXYZ(j, q.x, q.y, q.z); }
      pa.needsUpdate = true;
    });
    regla();
  }
  /* la tijera junto al mechón que se corta */
  function tijera() {
    var C = CAPA; if (!T3) return;
    if (!C.tij) {
      var met = new T3.MeshStandardMaterial({ color: 0xcfd3da, metalness: 0.9, roughness: 0.25 }), g = new T3.Group();
      [-1, 1].forEach(function (sg) { var b = new T3.Mesh(new T3.BoxGeometry(0.004, 0.07, 0.002), met); b.position.y = 0.035; b.userData.s = sg; g.add(b); });
      C.tij = g; C.H.group.add(g);
    }
    var cur = Math.floor(C.T), p = C.T - cur, k = Math.floor((cur - 1) / C.J), m = C.ms[(cur - 1) % C.J];
    var rec = cur >= 1 && k < C.n ? C.recs.filter(function (r) { return r.pk === k && r.pm === m; }) : [];
    if (!rec.length || p < 0.25 || p > 0.78) { C.tij.visible = false; return; }
    var r = rec[Math.floor(rec.length / 2)], t = Math.max(0.3, r.stop == null ? 1 : r.stop), q = C.H.path(r, t);
    q.y += 0.12 * (r.lastLift || 0); q.z -= 0.16 * (r.lastLift || 0);
    C.tij.position.copy(q); C.tij.visible = true; C.tij.rotation.set(0, 0, Math.PI / 2);
    var ab = 0.06 + 0.22 * Math.abs(Math.sin(C.T * 40)); C.tij.children.forEach(function (b) { b.rotation.z = b.userData.s * ab; });
    /* cámara: atrás cutBack; lados cutLeft / cutRight */
  }
  function camaraPaso() {
    var C = CAPA, cur = Math.floor(C.T), cam = 'cutBack';
    if (cur >= 1 && cur < totalPasos()) { var m = C.ms[(cur - 1) % C.J]; cam = C.atras(m) ? 'cutBack' : (m < C.J / 2 ? 'cutLeft' : 'cutRight'); }
    if (cam !== C.camAnt) { C.camAnt = cam; window.Maniqui.camera(cam); }
  }
  function estadoUI() {
    var C = CAPA, cur = Math.floor(C.T), el = $('eg3dPaso'); if (!el) return;
    if (cur < 1) { el.textContent = 'Paso 0 · se divide la cabeza (líneas verticales y línea azul de oreja a oreja)'; return; }
    if (cur >= totalPasos()) { el.textContent = 'Corte terminado · capas ' + C.n + ' · mechones ' + C.J + ' por capa'; return; }
    var k = Math.floor((cur - 1) / C.J), m = C.ms[(cur - 1) % C.J], atr = C.atras(m);
    var g = (atr ? C.pB : C.pF)[Math.min((atr ? C.pB : C.pF).length - 1, k)] || 0, cm = (atr ? C.dB : C.dF).cm[Math.min(((atr ? C.dB : C.dF).cm.length) - 1, k)];
    var dd = atr ? C.dB : C.dF, lg = guiaPulg(window.CorteMotor.state().target), lk = lg + (dd.cm[Math.min(dd.cm.length - 1, k)] - dd.cm[0]) / CM_PULG;
    el.textContent = 'Capa ' + (k + 1) + ' de ' + C.n + ' · mechón ' + ((cur - 1) % C.J + 1) + ' de ' + C.J + ' (' + (atr ? 'atrás' : 'delante') + ') · ' + g + '° · queda a ' + fm(lk) + '″ (' + fm(lk * CM_PULG) + ' cm)' + (k > 0 ? ' · ' + (lk >= lg ? '+' : '−') + fd(Math.abs(lk - lg) * CM_PULG) + ' dedos sobre la guía' : '');
    window.EU_V18_PUENTE.g = g; window.EU_V18_PUENTE.largo = lk;
  }

  /* ───────────── largo real del cabello (1 unidad del V18 = 1 m: la oreja queda a 6,0″ de la raíz, como en la tabla de Fátima) ───────────── */
  var DEDO = 2 /* cm por dedo: editable (1,5–2 según la mano) */, PULG = 39.37, CM_PULG = 2.54, CHIPS = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28], rcC = null;
  function fd(cm) { return fm(Math.round(cm / DEDO * 10) / 10); }
  function fm(n) { return window.EU_CALCULO_CAPILAR ? window.EU_CALCULO_CAPILAR.fmt(n) : String(Math.round(n * 10) / 10).replace('.', ','); }
  function rcentro() {                                          /* mechón central de atrás: la medida del cabello se toma en él */
    var H = window.CorteMotor.hair(); if (rcC && rcC.mesh) return rcC;
    rcC = H.records.filter(function (r) { return r.kind === 'back'; }).sort(function (a, b) { return Math.abs(a.q - 0.5) - Math.abs(b.q - 0.5); })[0]; return rcC;
  }
  function tDeY(r, y) { var H = window.CorteMotor.hair(), lo = 0.3, hi = 1; for (var i = 0; i < 18; i++) { var m = (lo + hi) / 2; if (H.path(r, m).y > y) lo = m; else hi = m; } return (lo + hi) / 2; }
  function guiaPulg(target) { var H = window.CorteMotor.hair(), r = rcentro(); return H.lenAt(r, tDeY(r, H.tail(target))) * PULG; }
  function inicialPulg() { return window.CorteMotor.hair().lenAt(rcentro(), 1) * PULG; }
  function targetDePulg(pulg) { var lo = 0.0, hi = 0.70; for (var i = 0; i < 20; i++) { var m = (lo + hi) / 2; if (guiaPulg(m) < pulg) lo = m; else hi = m; } return (lo + hi) / 2; }
  function ponerLargo(pulg) { if (window.CorteMotor.hair().getLength() < 0.5) $('cutPrepare').click(); var v = targetDePulg(pulg); window.CorteMotor.setTarget(v); if (CAPA) { CAPA.ver++; if (!CAPA.playing) pintarCorte(); } refrescarLargo(); }
  function refrescarLargo() {
    var el = $('eg3dLargoInfo'); if (!el || !window.CorteMotor.hair) return;
    var g = guiaPulg(window.CorteMotor.state().target), ini = inicialPulg(), corta = Math.max(0, ini - g);
    el.innerHTML = 'Guía: <b>' + fm(g) + '″ · ' + fm(g * CM_PULG) + ' cm</b><br>Cabello inicial: ' + fm(ini) + '″ · ' + fm(ini * CM_PULG) + ' cm<br>Se cortan: <b>' + fm(corta) + '″ · ' + fm(corta * CM_PULG) + ' cm · ≈ ' + fd(corta * CM_PULG) + ' dedos</b>';
    escalera(g);
    var inp = $('eg3dPulg'); if (inp && document.activeElement !== inp) inp.value = Math.round(g * 2) / 2;
    document.querySelectorAll('#eg3dChips button').forEach(function (b) { b.classList.toggle('on', Math.abs(+b.dataset.p - g) < 0.6); });
  }
  /* escalera de largos de la guía móvil: cada capa, sus grados y cuántos dedos queda sobre la guía */
  function escalera(g) {
    var el = $('eg3dEsc'); if (!el || !R || !window.EU_CALCULO_CAPILAR) return;
    var c = window.EU_CALCULO_CAPILAR.calcular({ capas: R.capas.pila, guias: ['m'], ref: 'craneo' }), lg = g == null ? guiaPulg(window.CorteMotor.state().target) : g;
    el.innerHTML = '<b>Guía móvil · largo de cada capa</b><br>' + c.capas.map(function (k, i) {
      var dcm = k.largo - c.capas[0].largo, tot = lg + dcm / CM_PULG;
      return 'Z' + i + ' · ' + fm(k.ang) + '° · ' + (i === 0 ? 'guía' : (dcm >= 0 ? '+' : '−') + fd(Math.abs(dcm)) + ' dedos') + ' · ' + fm(tot) + '″';
    }).join('<br>') + '<br><span style="opacity:.8">1 dedo = ' + fm(DEDO) + ' cm · ' + esc(c.forma) + '</span>';
  }
  /* regla de pulgadas junto al cabello (atrás, centro) */
  function regla() {
    var C = CAPA; if (!T3 || C.regla) return;
    var H = C.H, r = rcentro(), g = new T3.Group(), mat = new T3.LineBasicMaterial({ color: 0xc9a36a, transparent: true, opacity: 0.85, depthTest: false });
    g.name = 'Regla de largo';
    for (var n = 2; n <= 40; n += 2) {
      var t = H.tAtLen(r, n / PULG); if (t >= 0.999 && H.lenAt(r, 1) * PULG < n - 0.01) break;
      var q = H.path(r, t), len = n % 4 === 0 ? 0.045 : 0.025;
      var l = new T3.Line(new T3.BufferGeometry().setFromPoints([new T3.Vector3(0.1, q.y, -0.2), new T3.Vector3(0.1 + len, q.y, -0.2)]), mat); l.renderOrder = 10; l.frustumCulled = false; g.add(l);
      if (n % 4 === 0) {
        var cv = document.createElement('canvas'); cv.width = 96; cv.height = 48; var cx = cv.getContext('2d'); cx.fillStyle = '#e9d9c4'; cx.font = 'bold 34px sans-serif'; cx.textBaseline = 'middle'; cx.fillText(n + '″', 4, 26);
        var sp = new T3.Sprite(new T3.SpriteMaterial({ map: new T3.CanvasTexture(cv), transparent: true, depthTest: false })); sp.scale.set(0.09, 0.045, 1); sp.position.set(0.1 + len + 0.05, q.y, -0.2); sp.renderOrder = 11; g.add(sp);
      }
    }
    var eje = new T3.Line(new T3.BufferGeometry().setFromPoints([new T3.Vector3(0.1, H.path(r, 0.38).y, -0.2), new T3.Vector3(0.1, H.path(r, 1).y, -0.2)]), mat); eje.renderOrder = 10; eje.frustumCulled = false; g.add(eje);
    C.regla = g; H.group.add(g);
  }

  function bucle(ts) {
    if (!CAPA || !CAPA.playing) return;
    var dt = Math.min(0.1, (ts - CAPA.last) / 1000 || 0); CAPA.last = ts;
    if (CAPA.espera > 0) { CAPA.espera -= dt; if (CAPA.espera <= 0) CAPA.camAnt = ''; requestAnimationFrame(bucle); return; }
    var vel = parseFloat(($('cutSpeed') || {}).value) || 1;
    CAPA.T = Math.min(totalPasos(), CAPA.T + dt * vel / 3.2);
    pintarCorte(); if (CAPA.T >= totalPasos()) CAPA.playing = false; else requestAnimationFrame(bucle);
  }
  function arrancar(desde) {
    if (!window.EU_CALCULO_CAPILAR) return;
    T3 = window.THREE;
    aplicar();
    if (window.CorteMotor.hair().getLength() < 0.5) $('cutPrepare').click();        /* cabello largo inicial */
    window.CorteMotor.pause(); window.Maniqui.sentarse();
    if (!CAPA || desde === 'nuevo') { limpiar(); CAPA = modelo(); }
    if (CAPA.T >= totalPasos()) CAPA.T = 0;
    CAPA.espera = 1.6; CAPA.camAnt = ''; CAPA.playing = true; CAPA.last = performance.now(); activo = true; reloj(); requestAnimationFrame(bucle);
  }
  function limpiar() {
    if (!CAPA) return;
    ['lineas', 'tij', 'regla'].forEach(function (k) { if (CAPA[k]) { CAPA.H.group.remove(CAPA[k]); CAPA[k] = null; } });
    var S = window.CorteMotor.state(); CAPA.H.update([0, 0, 0, 0, 0], -1, 0, S.target, S.profile, false, null); CAPA = null;
  }

  function montar() {
    var cab = document.querySelector('details > summary'); if (!cab) return;
    var det = cab.parentNode, caja = document.createElement('div'); caja.id = 'eg3d'; caja.style.cssText = 'margin:10px 0 4px';
    caja.innerHTML = '<div style="font-size:11px;letter-spacing:.3em;color:#c9a36a;margin-bottom:8px">MOTORES DE GUÍAS 3D · CORTES</div>' +
      '<p class="note" style="margin:0 0 8px">Usa los motores de Guías 3D (elevaciones, líneas, particiones) sobre este maniquí. Cargando…</p>';
    cab.insertAdjacentElement('afterend', caja); det.open = true;
    cargar().then(function () {
      var L = window.EU_CORTES.lista(), fam = {}, ord = [];
      L.forEach(function (c) { if (!fam[c.fam]) { fam[c.fam] = []; ord.push(c.fam); } fam[c.fam].push(c); });
      var nom = {}; try { (window.EU_CORTES.familias() || []).forEach(function (f) { nom[f.id || f[0]] = f.n || f.nombre || f[1]; }); } catch (e) { }
      caja.innerHTML = '<div style="font-size:11px;letter-spacing:.3em;color:#c9a36a;margin-bottom:8px">MOTORES DE GUÍAS 3D · CORTES</div>' +
        '<label for="eg3dCorte">Corte del motor (' + L.length + ')</label><select id="eg3dCorte">' +
        ord.map(function (f) { return '<optgroup label="' + esc(nom[f] || f) + '">' + fam[f].map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.n) + '</option>'; }).join('') + '</optgroup>'; }).join('') + '</select>' +
        '<div id="eg3dFicha" class="note" style="margin:10px 0;line-height:1.55"></div>' +
        '<div style="font-size:11px;letter-spacing:.2em;color:#a3abbd;margin:12px 0 6px">LARGO DE LA GUÍA · PULGADAS</div>' +
        '<div id="eg3dChips" style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px">' + CHIPS.map(function (n) { return '<button data-p="' + n + '" style="text-align:center;padding:6px 2px;min-height:36px;font-size:13px">' + n + '″</button>'; }).join('') + '</div>' +
        '<div class="row" style="margin-top:8px;align-items:center"><label for="eg3dPulg" style="flex:none">Largo exacto (″)</label><input type="text" id="eg3dPulg" inputmode="decimal" style="max-width:90px"></div>' +
        '<div class="row" style="margin-top:8px;align-items:center"><label for="eg3dDedo" style="flex:none">Un dedo mide (cm)</label><input type="text" id="eg3dDedo" inputmode="decimal" value="2" style="max-width:90px"></div>' +
        '<div id="eg3dLargoInfo" class="note" style="margin:8px 0;line-height:1.55"></div>' +
        '<div id="eg3dEsc" class="note" style="margin:0 0 8px;line-height:1.55"></div>' +
        '<div class="grid"><button id="eg3dAplicar" class="primary wide">Aplicar el corte al maniquí</button>' +
        '<button id="eg3dCapas" class="primary wide">▶ Cortar capa por capa · mechón por mechón</button>' +
        '<button id="eg3dPausa">⏸ Pausar</button><button id="eg3dReinicia">↺ Reiniciar</button>' +
        '<button id="eg3dPlay" class="wide">Cortar por secciones (básico)</button></div>' +
        '<p id="eg3dPaso" class="note" role="status" style="margin-top:8px"></p>' +
        '<p id="eg3dNota" class="note" role="status" style="margin-top:8px"></p>';
      $('eg3dCorte').addEventListener('change', aplicar);
      $('eg3dAplicar').addEventListener('click', aplicar);
      $('eg3dPlay').addEventListener('click', function () { limpiar(); aplicar(); window.CorteMotor.reset(); window.CorteMotor.play(); });
      $('eg3dCapas').addEventListener('click', function () { arrancar(CAPA && CAPA.playing === false && CAPA.T < totalPasos() ? '' : 'nuevo'); });
      $('eg3dPausa').addEventListener('click', function () { if (CAPA) CAPA.playing = false; });
      $('eg3dReinicia').addEventListener('click', function () { limpiar(); $('eg3dPaso').textContent = ''; window.CorteMotor.reset(); });
      document.querySelectorAll('#eg3dChips button').forEach(function (b) { b.addEventListener('click', function () { ponerLargo(+b.dataset.p); }); });
      $('eg3dDedo').addEventListener('change', function () { var v = parseFloat(String(this.value).replace(',', '.')); if (v > 0.5 && v < 4) { DEDO = v; refrescarLargo(); if (CAPA) estadoUI(); } else this.value = DEDO; });
      $('eg3dPulg').addEventListener('change', function () { var v = parseFloat(String(this.value).replace(',', '.')); if (v > 0) ponerLargo(Math.max(4, Math.min(34, v))); });
      document.addEventListener('input', function (e) { if (e.target && e.target.id === 'cutTarget') setTimeout(refrescarLargo, 0); });
      aplicar(); window.CorteMotor.reset(); refrescarLargo();
    }).catch(function () { caja.querySelector('p').textContent = 'No se pudieron cargar los motores de Guías 3D.'; });
  }
  function ir(t) { if (!CAPA) return; CAPA.T = Math.max(0, Math.min(totalPasos(), +t || 0)); pintarCorte(); }
  window.EU_V18_PUENTE = { montar: montar, aplicar: aplicar, elev: null, ir: ir, modelo: function () { return CAPA; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
