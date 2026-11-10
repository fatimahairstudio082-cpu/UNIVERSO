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
    d.style.cssText = 'position:absolute;right:16px;top:16px;z-index:3;width:186px;padding:10px 10px 8px;background:rgba(15,11,9,.82);border:1px solid #3a2e24;border-radius:3px;text-align:center;display:none;pointer-events:none';
    d.innerHTML = '<svg viewBox="0 0 100 80" width="166" height="133" aria-hidden="true"><path d="M17 66 A38 38 0 1 1 83 66" fill="none" stroke="#3a2e24" stroke-width="6" stroke-linecap="round"/>' +
      '<path id="eg3dArco" d="M17 66 A38 38 0 1 1 83 66" fill="none" stroke="#c9a36a" stroke-width="6" stroke-linecap="round" pathLength="225" stroke-dasharray="0 225"/>' +
      '<line id="eg3dAguja" x1="50" y1="46" x2="50" y2="14" stroke="#f3ebe1" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="46" r="3" fill="#f3ebe1"/>' +
      '<text x="50" y="76" text-anchor="middle" fill="#b9ab9b" font-size="6">0°  ·  225°</text></svg>' +
      '<div id="eg3dGrados" style="font:500 26px/1 \'Cormorant Garamond\',Georgia,serif;color:#c9a36a">0°</div>' +
      '<div id="eg3dSec" style="font-size:11px;color:#b9ab9b;margin-top:2px;letter-spacing:.04em"></div>' +
      '<div id="eg3dLargo" style="font-size:12px;color:#e9d9c4;margin-top:4px"></div>';
    $('stage').appendChild(d); return d;
  }
  /* el transportador va al lado de la cabeza (no en la esquina): se coloca con la posición de la cabeza en el lienzo */
  function junto(d) {
    try {
      var cam = window.Maniqui.controls && window.Maniqui.controls.object; if (!CAPA || !cam || !window.THREE) return;   /* Maniqui.camera es la función de vistas; la cámara está en controls.object */
      var st = $('stage'), W = st.clientWidth, Hh = st.clientHeight, v = new window.THREE.Vector3(); window.Maniqui.joints.head.getWorldPosition(v); v.project(cam);
      var hx = (v.x + 1) / 2 * W, hy = (1 - v.y) / 2 * Hh, bw = d.offsetWidth || 186, bh = d.offsetHeight || 220, sep = Math.max(120, Hh * 0.2);
      var x = hx + sep; if (x + bw > W - 8) x = hx - sep - bw;
      d.style.right = 'auto'; d.style.left = Math.max(8, Math.min(W - bw - 8, x)) + 'px'; d.style.top = Math.max(8, Math.min(Hh - bh - 8, hy - bh * 0.45)) + 'px';
    } catch (e) { }
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
        $('eg3dGrados').textContent = (CAPA && window.EU_V18_PUENTE.gAhora != null ? window.EU_V18_PUENTE.gAhora : g) + '°'; $('eg3dSec').textContent = nom; var lgx = $('eg3dLargo'); if (lgx) lgx.textContent = CAPA && window.EU_V18_PUENTE.largo != null ? fm(window.EU_V18_PUENTE.largo) + '″ · ' + fm(window.EU_V18_PUENTE.largo * CM_PULG) + ' cm' : '';
        /* 10-11-2026 (Fátima: «el reloj es el transportador»): la aguja sube a la vez que el mechón y marca los grados de la capa cuando llega */
        var ga = CAPA && window.EU_V18_PUENTE.gAhora != null && en ? window.EU_V18_PUENTE.gAhora : g;
        $('eg3dArco').setAttribute('stroke-dasharray', Math.min(225, ga) + ' 225');
        $('eg3dAguja').setAttribute('transform', 'rotate(' + (-135 + Math.min(225, ga) * 1.2) + ' 50 46)');
        junto(d);
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
    var grp = {};
    recs.forEach(function (r) { var k = r.pk + '_' + r.pm; (grp[k] = grp[k] || []).push(r); });
    Object.keys(grp).forEach(function (k) { var g = grp[k].sort(function (a, b) { return posA(a) - posA(b); }); g.forEach(function (r, i) { r.rk = g.length > 1 ? i / (g.length - 1) : 0.5; }); });
    /* orden de los mechones: primero los de atrás (entre las dos orejas), luego los de delante */
    var ms = []; for (var m = 0; m < J; m++) ms.push(m);
    var centro = function (m) { return (m + 0.5) / J; }, atras = function (m) { return centro(m) >= 0.25 && centro(m) < 0.75; };
    ms.sort(function (a, b) { return (atras(b) ? 1 : 0) - (atras(a) ? 1 : 0) || a - b; });
    var pos = {}; ms.forEach(function (m, i) { pos[m] = i; });
    return { grp: grp, id: R.id, H: H, n: n, J: J, pB: pB, pF: pF, dB: dB, dF: dF, recs: recs, ms: ms, pos: pos, atras: atras, T: 0, ver: 1, playing: false, last: 0, camAnt: '', hl: null };
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
    var fase = p < 0.25 ? p / 0.25 : p < 0.75 ? 1 : (1 - p) / 0.25, fe = fase * fase * (3 - 2 * fase), lift = fase * kmax, u = Math.max(0, Math.min(1, (p - 0.25) / 0.5)), amount = Math.max(0, Math.min(1, (u * 1.15 - (r.rk == null ? 0.5 : r.rk)) / 0.15));
    return { amount: amount, lift: lift, ang: fe * g, hl: true, delta: d, clip: clip };
  }
  function pintarCorte() {
    var C = CAPA, S = window.CorteMotor.state();
    C.H.update([0, 0, 0, 0, 0], -1, 0, S.target, S.profile, false, { ver: C.ver, info: info });
    divisiones(); tijera(); estadoUI();
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
      var fin = reglaOn() ? Math.max(0.3, rb.stop == null ? 1 : rb.stop) : 0.42, pa = l.geometry.attributes.position;       /* 10-11-2026: solo sobre la cabeza (no tapan el corte); con la regla encendida, hasta donde llega el cabello */
      for (var j = 0; j <= 24; j++) { var q = C.H.path(rb, 0.02 + (fin - 0.02) * j / 24); pa.setXYZ(j, q.x, q.y, q.z); }
      pa.needsUpdate = true;
    });
    regla();
  }
  /* manos de la peluquera: la izquierda sujeta el mechón entre los dedos con el peine, la derecha corta con la tijera */
  function manosOn() { var c = $('eg3dManos'); return !!c && c.checked; }
  function reglaOn() { var c = $('eg3dRegla'); return !!c && c.checked; }
  function manosCorte(o) {
    var C = CAPA; if (!T3 || !window.Maniqui || !window.Maniqui.mano) return;
    if (!C.manos) {
      var M = window.Maniqui, g = new T3.Group(); g.name = 'Manos de la peluquera';
      var mi = M.mano(1), md = M.mano(-1), ti = M.herr.tijera(), pe = M.herr.peine();
      [mi, md].forEach(function (h) { var a = h.children[h.children.length - 1]; if (a) a.visible = false; });   /* 10-11-2026 (Fátima: «las manos tapan el corte»): solo la mano, sin antebrazo ni manga */
      ti.add(md); ti.userData.mano = md;                         /* la mano derecha va en los anillos de la tijera */
      M.agarrar(md, new T3.Vector3(0, -0.062, 0), new T3.Vector3(1, 0, 0), new T3.Vector3(0, -1, 0), T3.Vector3); md.userData.curl(0.6, 0.5);
      pe.scale.setScalar(0.8); g.add(mi, ti, pe); C.H.group.add(g); C.manos = { g: g, mi: mi, ti: ti, pe: pe };
    }
    var m = C.manos, on = !!o && manosOn(); m.g.visible = on; if (C.tij) C.tij.children.forEach(function (b) { b.visible = !on; });
    if (!on) return;
    var H = C.H, r = o.gr[Math.floor(o.gr.length / 2)], uu = Math.max(0, Math.min(1, (o.p - 0.25) / 0.5));
    var tg = function (rr, tt) { return H.tipAt(rr, Math.min(1, tt + 0.02), rr.lastAng || 0).sub(H.tipAt(rr, Math.max(0, tt - 0.02), rr.lastAng || 0)).normalize(); };
    /* mano izquierda: sujeta el mechón 4,5 cm por encima del corte */
    var th = H.tAtLen(r, Math.max(0.02, H.lenAt(r, o.t) - 0.045)), ph = H.tipAt(r, th, r.lastAng || 0), tgh = tg(r, th);
    var out = new T3.Vector3(ph.x, ph.y > 0.12 ? (ph.y - 0.12) * 0.6 : 0, ph.z); if (out.lengthSq() < 1e-6) out.set(0, 0, -1); out.normalize();
    /* con elevación (cabello mixto) el mechón va en vertical: dedos y tijera en vertical; a 0° o liso extremo, en horizontal */
    var vert = C.J > 1, arm = vert ? new T3.Vector3(-0.35, 1, 0).normalize() : new T3.Vector3(1, 0.5, 0).normalize();
    window.Maniqui.agarrar(m.mi, ph, tgh, arm, T3.Vector3); m.mi.userData.curl(0.45, 0.4);
    /* peine: junto a los dedos, por el lado de la raíz, con los dientes hacia las puntas */
    var side = new T3.Vector3().crossVectors(tgh, out).normalize();
    window.Maniqui.agarrar(m.pe, ph.clone().addScaledVector(tgh, -0.03).addScaledVector(out, 0.012), side, tgh.clone().negate(), T3.Vector3);
    m.pe.position.copy(ph).addScaledVector(tgh, -0.03).addScaledVector(out, 0.012);
    /* tijera: misma posición y giro que las hojas, con anillos y mano */
    m.ti.position.copy(C.tij.position);
    if (vert) m.ti.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), new T3.Vector3(-0.33, -0.94, 0).normalize()); else m.ti.rotation.copy(C.tij.rotation); m.ti.userData.A.rotation.z = o.ab; m.ti.userData.B.rotation.z = -o.ab;
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
    if (!rec.length || p < 0.25 || p > 0.78) { C.tij.visible = false; manosCorte(null); return; }
    var gr = C.grp[k + '_' + m] || rec, uu = Math.max(0, Math.min(1, (p - 0.25) / 0.5)), r = gr[Math.min(gr.length - 1, Math.round(uu * (gr.length - 1)))];
    var t = Math.max(0.3, r.stop == null ? 1 : r.stop), q = C.H.tipAt(r, t, r.lastAng || 0);
    C.tij.position.copy(q); C.tij.visible = true; C.tij.rotation.set(0, 0, Math.PI / 2);    /* hojas abiertas en vertical, avanza a lo ancho del mechón */
    var ab = 0.06 + 0.22 * Math.abs(Math.sin(C.T * 40)); C.tij.children.forEach(function (b) { b.rotation.z = b.userData.s * ab; });
    manosCorte({ r: r, t: t, p: p, ab: ab, gr: gr }); if (p <= 0.75) caer(q);
    /* cámara: atrás cutBack; lados cutLeft / cutRight */
  }
  /* cámara automática: gira despacio alrededor de la cabeza siguiendo el mechón que se corta (atrás → lados → delante);
     al terminar el corte da una vuelta completa enseñando cómo queda */
  function psiDe(a) { return Math.PI + (0.5 - a) * 2 * Math.PI; }            /* 0 = delante, π = atrás, 3π/2 = lado izquierdo */
  function psiObjetivo() {
    var C = CAPA, cur = Math.floor(C.T); if (cur < 1) return Math.PI; if (cur >= totalPasos()) return null;
    return psiDe((C.ms[(cur - 1) % C.J] + 0.5) / C.J);
  }
  function camAuto() { var c = $('eg3dCamAuto'); return !c || c.checked; }
  function orbita(psi) {
    /* 10-11-2026 (Fátima: «el maniquí queda a mitad»): encuadre de la cabeza entera hasta donde llega el corte; antes la cámara
       se alejaba para que cupiera todo el cabello sin cortar y la cabeza quedaba pequeña */
    var M = window.Maniqui; T3 = T3 || window.THREE; var hd = new T3.Vector3(); M.joints.head.getWorldPosition(hd);
    var H = window.CorteMotor.hair(), S = window.CorteMotor.state(), lt = Math.min(H.getLength(), S.target == null ? H.getLength() : S.target);
    var top = H.group.localToWorld(new T3.Vector3(0, 0.34, 0)).y, bot = H.group.localToWorld(new T3.Vector3(0, H.tail(lt) - 0.17, 0)).y;
    if (!(top > bot)) { top = hd.y + 0.3; bot = hd.y - 0.4; }
    var st = $('stage'), asp = st && st.clientHeight ? st.clientWidth / st.clientHeight : 1.5, alto = Math.max(0.62, top - bot), mid = (top + bot) / 2;
    var R = Math.max(alto / 2, 0.42 / Math.max(0.5, asp)) / Math.tan(18 * Math.PI / 180) * 1.08, yaw = M.state().yaw, c = Math.cos(yaw), s = Math.sin(yaw), x = R * Math.sin(psi), z = R * Math.cos(psi);
    M.setCamera([hd.x + x * c + z * s, mid + 0.06 * R, hd.z - x * s + z * c], [hd.x, mid, hd.z]);
  }
  function seguirCamara(dt) {
    var C = CAPA; if (!camAuto()) return; var t = psiObjetivo();
    if (C.psi == null) C.psi = Math.PI;
    if (t == null) C.psi += dt * Math.PI * 2 / 24;                           /* resultado: una vuelta cada 24 s */
    else { var d = Math.atan2(Math.sin(t - C.psi), Math.cos(t - C.psi)); C.psi += d * Math.min(1, dt * 1.6); }
    orbita(C.psi);
  }
  function estadoUI() {
    var C = CAPA, cur = Math.floor(C.T), el = $('eg3dPaso'); if (!el) return;
    if (cur < 1) { el.textContent = 'Paso 0 · se divide la cabeza (líneas verticales y línea azul de oreja a oreja)'; return; }
    if (cur >= totalPasos()) {
      var lg0 = guiaPulg(window.CorteMotor.state().target), dd0 = C.dB, ult = lg0 + (dd0.cm[Math.min(dd0.cm.length - 1, C.n - 1)] - dd0.cm[0]) / CM_PULG;
      el.textContent = 'Resultado · ' + (R ? R.n : 'corte') + ' · ' + C.n + ' capas, ' + C.J + ' mechones por capa · largo de ' + fm(lg0) + '″ (' + fm(lg0 * CM_PULG) + ' cm) en la nuca a ' + fm(ult) + '″ (' + fm(ult * CM_PULG) + ' cm) arriba · la cámara da la vuelta para verlo';
      return;
    }
    var k = Math.floor((cur - 1) / C.J), m = C.ms[(cur - 1) % C.J], atr = C.atras(m);
    var g = (atr ? C.pB : C.pF)[Math.min((atr ? C.pB : C.pF).length - 1, k)] || 0, cm = (atr ? C.dB : C.dF).cm[Math.min(((atr ? C.dB : C.dF).cm.length) - 1, k)];
    var dd = atr ? C.dB : C.dF, lg = guiaPulg(window.CorteMotor.state().target), lk = lg + (dd.cm[Math.min(dd.cm.length - 1, k)] - dd.cm[0]) / CM_PULG;
    el.textContent = 'Capa ' + (k + 1) + ' de ' + C.n + ' · mechón ' + ((cur - 1) % C.J + 1) + ' de ' + C.J + ' (' + (atr ? 'atrás' : 'delante') + ') · ' + g + '° · queda a ' + fm(lk) + '″ (' + fm(lk * CM_PULG) + ' cm)' + (k > 0 ? ' · ' + (lk >= lg ? '+' : '−') + fd(Math.abs(lk - lg) * CM_PULG) + ' dedos sobre la guía' : '');
    var pp = C.T - cur, fa = pp < 0.25 ? pp / 0.25 : pp < 0.75 ? 1 : (1 - pp) / 0.25;                 /* la misma fase que eleva el mechón en info() */
    window.EU_V18_PUENTE.g = g; window.EU_V18_PUENTE.largo = lk; window.EU_V18_PUENTE.gAhora = Math.round(fa * fa * (3 - 2 * fa) * g);
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
  var RX = 0.27;                                                /* la regla va fuera del cabello, a su derecha (antes 0.1: quedaba encima) */
  /* 10-11-2026 (Fátima: «que cuando corte, caiga el cabello»): las puntas que corta la tijera caen desde el punto de corte y
     se desvanecen; el mechón baja después y se queda a su largo nuevo (eso ya lo hacía info()) */
  function caer(q) {
    var C = CAPA; if (!T3 || C.T - (C.caeT || 0) < 0.012) return; C.caeT = C.T;
    if (!C.caeG) { C.caeG = new T3.Group(); C.caeG.name = 'Puntas cortadas'; C.H.group.add(C.caeG); C.caeL = []; var m0 = C.H.allMats && C.H.allMats[0]; C.caeC = m0 && m0.color ? m0.color.getHex() : 0x2a1a12; }
    for (var i = 0; i < 3 && C.caeL.length < 90; i++) {
      var a = new T3.Vector3(q.x + (Math.random() - 0.5) * 0.014, q.y, q.z + (Math.random() - 0.5) * 0.014), b = a.clone(); b.y -= 0.04 + Math.random() * 0.05; b.x += (Math.random() - 0.5) * 0.01;
      var l = new T3.Line(new T3.BufferGeometry().setFromPoints([a, b]), new T3.LineBasicMaterial({ color: C.caeC, transparent: true, opacity: 1 })); l.frustumCulled = false; C.caeG.add(l); C.caeL.push({ l: l, v: 0, t: 0 });
    }
  }
  function caida(dt) {
    var C = CAPA; if (!C || !C.caeL) return;
    C.caeL = C.caeL.filter(function (o) {
      o.t += dt; o.v += 1.4 * dt; o.l.position.y -= o.v * dt; o.l.material.opacity = Math.max(0, 1 - o.t / 1.7);
      if (o.t < 1.7) return true; C.caeG.remove(o.l); o.l.geometry.dispose(); o.l.material.dispose(); return false;
    });
  }
  function regla() {
    var C = CAPA; if (!T3) return; if (C.regla) { C.regla.visible = reglaOn(); return; } if (!reglaOn()) return;
    var H = C.H, r = rcentro(), g = new T3.Group(), mat = new T3.LineBasicMaterial({ color: 0xc9a36a, transparent: true, opacity: 0.85, depthTest: false });
    g.name = 'Regla de largo';
    for (var n = 2; n <= 40; n += 2) {
      var t = H.tAtLen(r, n / PULG); if (t >= 0.999 && H.lenAt(r, 1) * PULG < n - 0.01) break;
      var q = H.path(r, t), len = n % 4 === 0 ? 0.045 : 0.025;
      var l = new T3.Line(new T3.BufferGeometry().setFromPoints([new T3.Vector3(RX, q.y, -0.2), new T3.Vector3(RX + len, q.y, -0.2)]), mat); l.renderOrder = 10; l.frustumCulled = false; g.add(l);
      if (n % 4 === 0) {
        var cv = document.createElement('canvas'); cv.width = 96; cv.height = 48; var cx = cv.getContext('2d'); cx.fillStyle = '#e9d9c4'; cx.font = 'bold 34px sans-serif'; cx.textBaseline = 'middle'; cx.fillText(n + '″', 4, 26);
        var sp = new T3.Sprite(new T3.SpriteMaterial({ map: new T3.CanvasTexture(cv), transparent: true, depthTest: false })); sp.scale.set(0.09, 0.045, 1); sp.position.set(RX + len + 0.05, q.y, -0.2); sp.renderOrder = 11; g.add(sp);
      }
    }
    var eje = new T3.Line(new T3.BufferGeometry().setFromPoints([new T3.Vector3(RX, H.path(r, 0.38).y, -0.2), new T3.Vector3(RX, H.path(r, 1).y, -0.2)]), mat); eje.renderOrder = 10; eje.frustumCulled = false; g.add(eje);
    C.regla = g; H.group.add(g);
  }

  function bucle(ts) {
    if (!CAPA || !CAPA.playing) return;
    var dt = Math.min(0.1, (ts - CAPA.last) / 1000 || 0); CAPA.last = ts;
    if (CAPA.espera > 0) { CAPA.espera -= dt; if (CAPA.espera <= 0) CAPA.camAnt = ''; requestAnimationFrame(bucle); return; }
    var vel = parseFloat(($('cutSpeed') || {}).value) || 1;
    CAPA.T = Math.min(totalPasos(), CAPA.T + dt * vel / 3.2);
    if (!CAPA.fin) { pintarCorte(); if (CAPA.T >= totalPasos()) CAPA.fin = true; }
    caida(dt); seguirCamara(dt); requestAnimationFrame(bucle);
  }
  function arrancar(desde) {
    if (!window.EU_CALCULO_CAPILAR) return;
    T3 = window.THREE;
    aplicar();
    if (window.CorteMotor.hair().getLength() < 0.5) $('cutPrepare').click();        /* cabello largo inicial */
    window.CorteMotor.pause(); window.Maniqui.sentarse();
    if (!CAPA || desde === 'nuevo') { limpiar(); CAPA = modelo(); }
    if (CAPA.T >= totalPasos()) { CAPA.T = 0; CAPA.fin = false; }
    CAPA.espera = 1.6; CAPA.camAnt = ''; CAPA.playing = true; CAPA.last = performance.now(); activo = true; reloj(); requestAnimationFrame(bucle);
  }
  function limpiar() {
    if (!CAPA) return;
    ['lineas', 'tij', 'manos', 'regla', 'caeG'].forEach(function (k) { if (CAPA[k]) { CAPA.H.group.remove(CAPA[k]); CAPA[k] = null; } });
    var S = window.CorteMotor.state(); CAPA.H.update([0, 0, 0, 0, 0], -1, 0, S.target, S.profile, false, null); CAPA = null;
  }


  /* ───────────── colorimetría: el cerebro de Guías 3D (EU_CEREBRO) sobre la animación de color del V18 ─────────────
     El V18 ya anima la mezcla en el bol, las 6 secciones con paleta y papel de aluminio, el tiempo y el aclarado.
     Aquí el cerebro pone la técnica (qué es, su fórmula y sus pasos reales), la cobertura y el tono, dibuja las 6 divisiones
     numeradas y, al terminar, la cámara da la vuelta enseñando el resultado. */
  var MAPA_K = { color_raiz: 'tinte', color_global: 'tinte', color_balayage: 'balayage', color_sombre: 'balayage', color_babylights: 'mechas', mechas_aluminio: 'mechas', mechas_gorro: 'mechas', quim_decoloracion: 'tinte' };
  /* cómo se aplica cada técnica (Guías 3D · `MODO` de EU_PARTICIONES): raíz, global, barrido, finas, papel, gorro, decoloración */
  var MAPA_T = { color_raiz: { tech: 'tinte', modo: 'raiz', hasta: 0.3 }, color_global: { tech: 'tinte', modo: 'global' }, color_balayage: { tech: 'balayage', modo: 'barrido' }, color_sombre: { tech: 'balayage', modo: 'ombre' },
    color_babylights: { tech: 'mechas', modo: 'finas' }, quim_permanente: { tech: 'tinte', modo: 'bigudi' }, hidra_profunda: { tech: 'tinte', modo: 'producto' }, hidra_nutricion: { tech: 'tinte', modo: 'producto' }, quera_alisado: { tech: 'tinte', modo: 'queratina' }, quera_botox: { tech: 'tinte', modo: 'queratina' }, cab_secado: { tech: 'tinte', modo: 'secado', sinBrocha: true, sinPasta: true }, cab_planchado: { tech: 'tinte', modo: 'plancha', sinBrocha: true, sinPasta: true }, mechas_aluminio: { tech: 'mechas', modo: 'papel' }, mechas_gorro: { tech: 'mechas', modo: 'gorro', sinPapel: true }, quim_decoloracion: { tech: 'tinte', modo: 'decolor' } };
  var colEscena = null, resAplicado = false, hairOrig = null, rollos = null;
  var colorAct = false, colDiv = null, colPsi = Math.PI, colTec = null, colUlt = 0;
  function tecnicasColor() {
    var CB = window.EU_CEREBRO, o = [];
    ['color', 'mechas', 'quimicos', 'hidratacion', 'queratina', 'cabello'].forEach(function (f) { CB.listar(f).forEach(function (t) { if (MAPA_T[t.id]) o.push(t); }); });
    return o;
  }
  function fasesDe(step) { return step === 0 ? ['preparacion', 'formula', 'divisiones'] : step <= 6 ? ['aplicacion'] : step === 7 ? ['tiempo'] : ['cierre']; }
  function pasosHTML(t, step) {
    var act = fasesDe(step);
    return t.pasos.map(function (s) {
      var on = act.indexOf(s.fase) >= 0;
      return '<div style="padding:5px 6px;margin:3px 0;border-left:3px solid ' + (on ? '#c9a36a' : '#3a2e24') + ';background:' + (on ? 'rgba(201,163,106,.12)' : 'transparent') + '"><b>' + esc(s.t) + '</b> <span style="opacity:.6">· ' + esc(s.fase) + '</span><br>' + esc(s.n) + (s.e ? '<br><span style="opacity:.75">Error común: ' + esc(s.e) + '</span>' : '') + '</div>';
    }).join('');
  }
  function fichaColor(t) {
    var f = t.ficha || {};
    return '<b>' + esc(t.n) + '</b><br>' + esc(t.resumen || '') + '<br>' + (f.formula ? 'Fórmula: <b>' + esc(f.formula) + '</b><br>' : '') + (f.proporciones ? 'Proporción: ' + esc(f.proporciones) + (f.cantidades ? ' · ' + esc(f.cantidades) : '') + '<br>' : '') + (f.tiempos ? 'Tiempos: ' + esc(f.tiempos) + '<br>' : '') + (f.herramientas ? 'Herramientas: ' + esc(f.herramientas.join(', ')) : '');
  }
  function aplicarColor() {
    var id = $('eg3dTec').value, t = window.EU_CEREBRO.obtener(id); colTec = t;
    var mt = MAPA_T[id], tech = mt.tech, pd = t.pintado && t.pintado.desde, amt = pd != null ? Math.max(20, Math.min(90, Math.round((1 - pd) * 100))) : 50, o = { tech: tech, amt: amt, modo: mt.modo, hasta: mt.hasta == null ? null : mt.hasta, sinPapel: !!mt.sinPapel, sinBrocha: !!mt.sinBrocha, sinPasta: !!mt.sinPasta, mech: 7 };
    if (id === 'quim_decoloracion') o.tone = '#efd9a3';
    if (mt.modo === 'producto' || mt.modo === 'bigudi' || mt.modo === 'queratina') o.tone = '#efe6d6';
    if (colEscena) o.tone = colEscena.tone;
    o.cubre = !!(colEscena && colEscena.cubre);
    o.capas = ['producto', 'queratina', 'secado', 'plancha'].indexOf(mt.modo) >= 0;     /* capas finas horizontales, de abajo arriba */
    o.desde = (mt.modo === 'barrido' && pd != null) ? pd : null; decDesde = o.desde;
    window.ColorMotor.reset(); window.ColorMotor.set(o);
    var kt = $('kTech'), ka = $('kAmt'); if (kt) kt.value = tech; if (ka) ka.value = amt;
    $('eg3dTecFicha').innerHTML = fichaColor(t); $('eg3dTecPasos').innerHTML = pasosHTML(t, 0);
    var sel = $('eg3dLam'); if (sel && window.EU_DIVISIONES) {
      var lt = window.EU_DIVISIONES.laminasDe(id), tdo = window.EU_DIVISIONES.catalogo();
      sel.innerHTML = '<option value="tec">Todas las de esta técnica (' + lt.length + ')</option><optgroup label="Esta técnica">' + lt.map(function (l) { return '<option value="' + l.id + '">' + esc(l.n) + '</option>'; }).join('') + '</optgroup><optgroup label="Todas las láminas del motor (' + tdo.length + ')">' + tdo.map(function (l) { return '<option value="' + l.id + '">' + esc(l.n) + '</option>'; }).join('') + '</optgroup>';
      sel.value = 'tec'; lamSel = 'tec'; decP = 1; var dd = $('eg3dDesdeFila'); if (dd) dd.style.display = tech === 'balayage' ? 'flex' : 'none';
      var ds = $('eg3dDesde'); if (ds) ds.value = decDesde == null ? '' : String(Math.round(decDesde * 100));
      if ($('eg3dLamVer') && $('eg3dLamVer').checked) verDivisiones();
    }
    return t;
  }
  /* las 6 divisiones del motor: raya central, oreja a oreja y línea de la nuca, con sus números 1–6 */
  function divisionesColor() {
    var H = window.CorteMotor.hair(); T3 = T3 || window.THREE; if (colDiv) return colDiv;
    var g = new T3.Group(); g.name = 'Divisiones de color';
    var mat = new T3.LineBasicMaterial({ color: 0x6fffe1, depthTest: false }), azul = new T3.LineBasicMaterial({ color: 0x4db8ff, depthTest: false });
    function linea(pts, m) { var l = new T3.Line(new T3.BufferGeometry().setFromPoints(pts), m); l.renderOrder = 9; l.frustumCulled = false; g.add(l); }
    var raya = [], oreja = [], nuca = [], i;
    for (i = 0; i <= 30; i++) { var f = -1.2 + 2.2 * i / 30; raya.push(new T3.Vector3(0, 0.125 + 0.135 * Math.cos(f) + 0.004, 0.115 * Math.sin(f) * 1.02)); }
    for (i = 0; i <= 30; i++) { var a = -Math.PI / 2 + Math.PI * i / 30; oreja.push(new T3.Vector3(0.108 * Math.sin(a), 0.12 + 0.136 * Math.cos(a), -0.012)); }
    for (i = 0; i <= 16; i++) { var x = -0.095 + 0.19 * i / 16; nuca.push(new T3.Vector3(x, 0.105, -0.112 * Math.sqrt(Math.max(0.05, 1 - Math.pow(x / 0.104, 2))) - 0.004)); }
    linea(raya, mat); linea(oreja, azul); linea(nuca, mat);
    [[1, 0.05, 0.215, 0.07], [2, -0.05, 0.215, 0.07], [3, -0.05, 0.2, -0.085], [4, 0.05, 0.2, -0.085], [5, -0.045, 0.085, -0.115], [6, 0.045, 0.085, -0.115]].forEach(function (n) {
      var cv = document.createElement('canvas'); cv.width = 64; cv.height = 64; var cx = cv.getContext('2d');
      cx.fillStyle = 'rgba(15,11,9,.85)'; cx.beginPath(); cx.arc(32, 32, 28, 0, 7); cx.fill(); cx.fillStyle = '#e9d9c4'; cx.font = 'bold 36px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText(n[0], 32, 34);
      var sp = new T3.Sprite(new T3.SpriteMaterial({ map: new T3.CanvasTexture(cv), transparent: true, depthTest: false })); sp.scale.set(0.034, 0.034, 1); sp.position.set(n[1], n[2], n[3]); sp.renderOrder = 11; g.add(sp);
    });
    H.group.add(g); colDiv = g; return g;
  }

  /* ───────────── divisiones de colorimetría: las láminas de EU_DIVISIONES proyectadas sobre el cabello del V18 ─────────────
     Cada lámina (planta, perfil, nuca, zigzag, herradura, media luna, ladrillo, gorro…) se dibuja en un lienzo sin el contorno
     de la cabeza ni el relleno, y ese dibujo se pega sobre la cabeza con la proyección de su vista: planta desde arriba, perfil
     a los lados y nuca por detrás. Se dibujan a medida que avanza la aplicación (p = 0…1), como en el motor de Guías 3D. */
  var CN = 512, DEC = null, decLam = { planta: null, perfil: null, nuca: null }, decP = 1, decDesde = null, lamSel = 'tec';
  var CEN = { x: 0, y: 0.125, z: -0.012 }, RADIO = { a: 0.118, b: 0.143, c: 0.124 }, RLAM = { planta: 215, perfil: 195, nuca: 215 };
  function vistaDe(id) { return /^perfil/.test(id) ? 'perfil' : /^nuca|^gorro$/.test(id) ? 'nuca' : 'planta'; }
  function filtrar(x) {                                                  /* sin contorno de cabeza, sin relleno de piel/pelo y sin textos */
    var f0 = CanvasRenderingContext2D.prototype.fill, s0 = CanvasRenderingContext2D.prototype.stroke;
    x.fill = function () { var fs = this.fillStyle; if (typeof fs !== 'string' || fs === '#ffffff' || fs === '#f6f1ec') return; return f0.apply(this, arguments); };
    x.stroke = function () { var ss = this.strokeStyle; if (typeof ss === 'string' && (ss === '#2b2b3d' || /^rgba\(43, ?43, ?61/.test(ss))) return; return s0.apply(this, arguments); };
    x.fillText = function () { }; x.strokeText = function () { };
  }
  function geoDecal(v) {
    var sg = new T3.SphereGeometry(1, 56, 36), pos = sg.attributes.position, idx = sg.index.array, P = [], U = [], R = RLAM[v];
    function n3(i) { return [pos.getX(i), pos.getY(i), pos.getZ(i)]; }
    for (var t = 0; t < idx.length; t += 3) {
      var a = n3(idx[t]), b = n3(idx[t + 1]), c = n3(idx[t + 2]), mx = (a[0] + b[0] + c[0]) / 3, my = (a[1] + b[1] + c[1]) / 3, mz = (a[2] + b[2] + c[2]) / 3;
      if (!(v === 'planta' ? my > 0.05 : v === 'nuca' ? mz < -0.12 : Math.abs(mx) > 0.22)) continue;
      [a, b, c].forEach(function (n) {
        P.push(CEN.x + n[0] * RADIO.a, CEN.y + n[1] * RADIO.b, CEN.z + n[2] * RADIO.c);
        var px, py;
        if (v === 'planta') { px = CN / 2 - n[0] * 0.92 * R; py = CN / 2 - n[2] * R; }       /* nariz arriba; su derecha = −x */
        else if (v === 'perfil') { px = CN / 2 + n[2] * R; py = CN / 2 - n[1] * 1.02 * R; }  /* mira a la derecha */
        else { px = CN / 2 - n[0] * 0.84 * R; py = CN / 2 - n[1] * R; }                       /* desde atrás */
        U.push(px / CN, 1 - py / CN);
      });
    }
    var g = new T3.BufferGeometry(); g.setAttribute('position', new T3.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new T3.Float32BufferAttribute(U, 2)); return g;
  }
  function crearDecales() {
    if (DEC) return DEC; T3 = T3 || window.THREE; DEC = {};
    ['planta', 'perfil', 'nuca'].forEach(function (v) {
      var cv = document.createElement('canvas'); cv.width = cv.height = CN; filtrar(cv.getContext('2d'));
      var tex = new T3.CanvasTexture(cv); tex.encoding = T3.sRGBEncoding;
      var mesh = new T3.Mesh(geoDecal(v), new T3.MeshBasicMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, side: T3.DoubleSide }));
      mesh.renderOrder = 8; mesh.frustumCulled = false; mesh.name = 'Divisiones · ' + v; mesh.visible = false; window.CorteMotor.hair().group.add(mesh);
      DEC[v] = { cv: cv, tex: tex, mesh: mesh };
    });
    return DEC;
  }
  function pintarDecal(v) {
    var d = DEC[v], x = d.cv.getContext('2d'), id = decLam[v]; x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, CN, CN); x.restore();
    d.mesh.visible = !!id; if (!id) return;
    window.EU_DIVISIONES.dibujarUna(x, id, CN / 2, CN / 2, RLAM[v], decP, { desde: decDesde == null ? 0.45 : decDesde }); d.tex.needsUpdate = true;
  }
  function lamsActuales() {
    var id = colTec && colTec.id; if (!id || !window.EU_DIVISIONES) return [];
    return lamSel === 'tec' ? window.EU_DIVISIONES.laminasDe(id).map(function (l) { return l.id; }) : [lamSel];
  }
  function verDivisiones() {
    crearDecales(); var ids = lamsActuales(); decLam = { planta: null, perfil: null, nuca: null };
    ids.forEach(function (id) { var v = vistaDe(id); if (!decLam[v]) decLam[v] = id; });
    ['planta', 'perfil', 'nuca'].forEach(pintarDecal); tarjetaLamina();
  }
  function ocultarDivisiones() { if (!DEC) return; Object.keys(DEC).forEach(function (v) { DEC[v].mesh.visible = false; }); }
  /* la lámina completa, tal cual la dibuja el motor de Guías 3D (con sus números y escalas), junto al maniquí */
  function tarjetaLamina() {
    var cv = $('eg3dLamCard'); if (!cv) return; var x = cv.getContext('2d'), ids = lamsActuales(), id = ids[0], el = $('eg3dLamNom');
    x.clearRect(0, 0, cv.width, cv.height); x.fillStyle = '#f6efe1'; x.fillRect(0, 0, cv.width, cv.height);
    if (!id) { if (el) el.textContent = ''; return; }
    window.EU_DIVISIONES.dibujarUna(x, id, cv.width / 2, 98, 80, decP, { desde: decDesde == null ? 0.45 : decDesde });
    var L = window.EU_DIVISIONES.catalogo().filter(function (l) { return l.id === id; })[0]; if (el) el.innerHTML = '<b>' + esc(L ? L.n : id) + '</b><br>' + esc(L ? L.d : '');
  }

  /* gorro perforado de la técnica «mechas con gorro»: casquete con sus agujeros hasta que se retira */
  var gorro = null;
  function gorroMalla() {
    if (gorro) return gorro; T3 = T3 || window.THREE; var g = new T3.Group(), pts = []; g.name = 'Gorro perforado';
    var cap = new T3.Mesh(new T3.SphereGeometry(1, 40, 24, 0, Math.PI * 2, 0, 1.78), new T3.MeshBasicMaterial({ color: 0x9fd4ff, transparent: true, opacity: 0.32, depthWrite: false, side: T3.DoubleSide }));
    cap.scale.set(RADIO.a * 1.04, RADIO.b * 1.04, RADIO.c * 1.04); cap.position.set(CEN.x, CEN.y, CEN.z); cap.renderOrder = 6; g.add(cap);
    for (var fila = 0; fila < 9; fila++) { var lat = 0.12 + fila * 0.17, n = Math.max(6, Math.round(22 * Math.sin(lat) - fila * 0.6)); for (var k = 0; k < n; k++) { var az = (k + (fila % 2) * 0.5) / n * Math.PI * 2; pts.push(CEN.x + RADIO.a * 1.05 * Math.sin(lat) * Math.sin(az), CEN.y + RADIO.b * 1.05 * Math.cos(lat), CEN.z + RADIO.c * 1.05 * Math.sin(lat) * Math.cos(az)); } }
    var pg = new T3.BufferGeometry(); pg.setAttribute('position', new T3.Float32BufferAttribute(pts, 3));
    var pn = new T3.Points(pg, new T3.PointsMaterial({ color: 0x16304d, size: 0.007, depthTest: false })); pn.renderOrder = 7; g.add(pn);
    window.CorteMotor.hair().group.add(g); gorro = g; return g;
  }

  /* rulos de la permanente: un rulo por mechón (6 secciones × 7), que se monta con cada pincelada y se retira al neutralizar */
  var efecto = null;
  function montarRollos() {
    if (rollos) return rollos; var H = window.CorteMotor.hair(); T3 = T3 || window.THREE;
    if (!H.records.some(function (r) { return r.mi != null; })) return null;                 /* aún no se ordenaron los mechones */
    var g = new T3.Group(), grupos = {}, mat = new T3.MeshStandardMaterial({ color: 0xe58fb0, roughness: 0.6 }), pin = new T3.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.5 }); g.name = 'Rulos de permanente'; rollos = [];
    H.records.forEach(function (r) { if (r.mi == null || r.kind === 'crown' || r.kind === 'fringe') return; var k = r.section + '_' + r.mi; if (!grupos[k]) grupos[k] = { si: r.section, mi: r.mi, r: r }; });
    Object.keys(grupos).forEach(function (k) {
      var o = grupos[k], q = H.path(o.r, 0.42), q2 = H.path(o.r, 0.5), tan = q2.clone().sub(q).normalize(), nor = q.clone().sub(new T3.Vector3(CEN.x, CEN.y, CEN.z)).normalize(), eje = new T3.Vector3().crossVectors(tan, nor).normalize();
      var m = new T3.Mesh(new T3.CylinderGeometry(0.013, 0.013, 0.05, 14), mat); m.add(new T3.Mesh(new T3.CylinderGeometry(0.0045, 0.0045, 0.058, 8), pin));
      m.position.copy(q).addScaledVector(nor, 0.018); m.quaternion.setFromUnitVectors(new T3.Vector3(0, 1, 0), eje); m.userData = o; m.visible = false; g.add(m); rollos.push(m);
    });
    H.group.add(g); rollos.grupo = g; return rollos;
  }
  function actualizarRollos(s, step) {
    var R = montarRollos(); if (!R) return; R.grupo.visible = step <= 8;
    R.forEach(function (m) { var o = m.userData; m.visible = step <= 8 && ((s.prog && s.prog[o.si]) || 0) * 7 > o.mi + 0.2; });
  }
  /* lo que queda al terminar: la permanente deja ondas; hidratación, nutrición y queratina dejan brillo */
  function efectoFinal(modo) {
    if (modo === 'bigudi') { var b = document.querySelector('[data-hs-style="ondas"]'); if (b) { b.click(); efecto = 'onda'; } }
    else if (modo === 'producto' || modo === 'queratina' || modo === 'plancha' || modo === 'secado') { var sh = $('hsShn'); if (sh) { sh.value = modo === 'secado' ? 84 : 96; sh.dispatchEvent(new Event('input')); efecto = 'brillo'; } }
  }
  function restaurarEfectos() {
    if (efecto === 'onda') { var b = document.querySelector('[data-hs-style="bob"]'); if (b) b.click(); }
    if (efecto) { var sh = $('hsShn'); if (sh) { sh.value = 62; sh.dispatchEvent(new Event('input')); } }
    efecto = null; resAplicado = false; if (rollos) rollos.grupo.visible = false;
  }
  /* escenas: canas y corrección de color (el V18 ya cambia el color del cabello y tiene canas) */
  var ESCENAS = [
    { n: 'Cubrir canas · raíz', tec: 'color_raiz', gray: 50, tone: '#4a2c1c', cubre: true },
    { n: 'Cubrir canas · todo el cabello', tec: 'color_global', gray: 50, tone: '#3a2418', cubre: true },
    { n: 'Corrección · naranja → rubio ceniza', tec: 'color_global', base: '#c8661e', tone: '#cfc3a8' },
    { n: 'Corrección · verde → castaño cobrizo', tec: 'color_global', base: '#4d7f3d', tone: '#7a4528' },
    { n: 'Cambio de color · rubio → castaño oscuro', tec: 'color_global', base: '#e0c080', tone: '#4a3020' }
  ];
  function restaurarEscena() {
    if (!colEscena) return; var gb = document.querySelector('[data-hs-graypct="0"]'); if (gb) gb.click();
    window.Maniqui.setHair(hairOrig || '#2a1a12'); window.CorteMotor.hair().recolor(); colEscena = null;
  }
  function lanzarEscena(i) {
    var e = ESCENAS[i]; restaurarEfectos(); colorAct = false; window.ColorMotor.reset();
    if (hairOrig == null) hairOrig = ($('hairColor') || {}).value || '#2a1a12';
    window.Maniqui.setHair(e.base || hairOrig); var gb = document.querySelector('[data-hs-graypct="' + (e.gray || 0) + '"]'); if (gb) gb.click();
    window.CorteMotor.hair().recolor(); $('eg3dTec').value = e.tec; colEscena = e; animarColor();
  }

  function bucleColor(ts) {
    if (!colorAct) return;
    var dt = Math.min(0.1, (ts - colUlt) / 1000 || 0); colUlt = ts;
    var s = window.ColorMotor.state(), step = s.step == null ? 0 : s.step;
    if (colTec) { var el = $('eg3dTecPasos'); if (el && el.dataset.s !== String(step)) { el.dataset.s = String(step); el.innerHTML = pasosHTML(colTec, step); } }
    divisionesColor().visible = step <= 6;                                      /* las divisiones se ven mientras se aplica */
    gorroMalla().visible = !!(colTec && colTec.id === 'mechas_gorro' && step <= 7);
    var mo = colTec && MAPA_T[colTec.id] && MAPA_T[colTec.id].modo;
    if (mo === 'bigudi') actualizarRollos(s, step); else if (rollos) rollos.grupo.visible = false;
    if (step >= 9 && !resAplicado) { resAplicado = true; efectoFinal(mo); } else if (step < 9) resAplicado = false;
    if (DEC && $('eg3dLamVer') && $('eg3dLamVer').checked) {
      var pp = step <= 6 ? Math.round(Math.max(0, Math.min(1, ((s.t || 0) - 1) / 6)) * 42) / 42 : 1;
      if (Math.abs(pp - decP) > 0.012) { decP = pp; ['planta', 'perfil', 'nuca'].forEach(pintarDecal); tarjetaLamina(); }
    }
    if (step >= 9 && camAuto()) { colPsi += dt * Math.PI * 2 / 24; orbita(colPsi); }  /* resultado: vuelta lenta */
    else colPsi = Math.PI;
    requestAnimationFrame(bucleColor);
  }
  function animarColor() {
    if (!window.EU_CEREBRO || !window.ColorMotor) return;
    restaurarEfectos(); aplicarColor(); if (CAPA) { CAPA.playing = false; } window.CorteMotor.pause();
    colorAct = true; colUlt = performance.now(); colPsi = Math.PI; window.ColorMotor.play(); requestAnimationFrame(bucleColor);
  }
  function montarColor(caja) {
    var c2 = document.createElement('div'); c2.id = 'eg3dColor'; c2.style.cssText = 'margin:18px 0 4px;padding-top:12px;border-top:1px solid #3a2e24';
    var L = tecnicasColor();
    c2.innerHTML = '<div style="font-size:11px;letter-spacing:.3em;color:#c9a36a;margin-bottom:8px">COLORIMETRÍA · CEREBRO DE GUÍAS 3D</div>' +
      '<label for="eg3dTec">Técnica (' + L.length + ')</label><select id="eg3dTec">' + L.map(function (t) { return '<option value="' + esc(t.id) + '">' + esc(t.n) + '</option>'; }).join('') + '</select>' +
      '<div id="eg3dTecFicha" class="note" style="margin:10px 0;line-height:1.55"></div>' +
      '<label for="eg3dLam">Divisiones que dibuja el motor</label><select id="eg3dLam"></select>' +
      '<label style="display:flex;gap:8px;align-items:center;font-size:13px;margin:8px 0;cursor:pointer"><input type="checkbox" id="eg3dLamVer" checked style="width:18px;height:18px;accent-color:#c9a36a"> Dibujarlas sobre el maniquí (se trazan al aplicar)</label>' +
      '<div id="eg3dDesdeFila" class="row" style="align-items:center;display:none"><label for="eg3dDesde" style="flex:none">Arranque del balayage</label><select id="eg3dDesde" style="max-width:150px"><option value="">Según la técnica</option><option value="10">10 %</option><option value="25">25 %</option><option value="50">50 %</option><option value="75">75 %</option></select></div>' +
      '<canvas id="eg3dLamCard" width="300" height="300" style="width:100%;max-width:300px;border-radius:6px;margin-top:8px;display:block"></canvas><div id="eg3dLamNom" class="note" style="margin:6px 0 10px;line-height:1.5"></div>' +
      '<div class="grid"><button id="eg3dTecPlay" class="primary wide">▶ Animar con el cerebro · divisiones, paleta y papel de aluminio</button>' +
      '<button id="eg3dTecPausa">⏸ Pausar</button><button id="eg3dTecReinicia">↺ Reiniciar</button></div>' +
      '<div id="eg3dTecPasos" class="note" style="margin-top:10px;line-height:1.5;font-size:12px"></div>';
    caja.insertAdjacentElement('afterend', c2);
    hairOrig = ($('hairColor') || {}).value || '#2a1a12';
    var c3 = document.createElement('div'); c3.id = 'eg3dEscenas'; c3.style.cssText = 'margin:14px 0 4px;padding-top:12px;border-top:1px solid #3a2e24';
    c3.innerHTML = '<div style="font-size:11px;letter-spacing:.3em;color:#c9a36a;margin-bottom:8px">ESCENAS · CANAS Y CORRECCIÓN DE COLOR</div><div class="grid">' + ESCENAS.map(function (e, i) { return '<button data-esc="' + i + '" class="wide">' + esc(e.n) + '</button>'; }).join('') + '</div>' +
      '<p class="note" style="margin-top:6px">Prepara el cabello (color de partida y canas) y aplica la técnica con sus divisiones, mechón a mechón. «Reiniciar» devuelve el cabello como estaba.</p>';
    c2.insertAdjacentElement('afterend', c3);
    c3.querySelectorAll('button[data-esc]').forEach(function (b) { b.addEventListener('click', function () { lanzarEscena(+b.dataset.esc); }); });
    $('eg3dTec').addEventListener('change', function () { restaurarEscena(); if (!colorAct) aplicarColor(); else animarColor(); });
    $('eg3dLam').addEventListener('change', function () {
      lamSel = this.value; decP = 1; if (!$('eg3dLamVer').checked) { tarjetaLamina(); return; } verDivisiones();
      var id = lamsActuales()[0]; if (id && !colorAct) window.Maniqui.camera({ planta: 'cenital', perfil: 'cutRight', nuca: 'cutBack' }[vistaDe(id)]);
    });
    $('eg3dLamVer').addEventListener('change', function () { if (this.checked) verDivisiones(); else ocultarDivisiones(); });
    $('eg3dDesde').addEventListener('change', function () { var v = this.value === '' ? null : +this.value / 100; decDesde = v; window.ColorMotor.set({ desde: v }); if (v == null && colTec && colTec.pintado) { decDesde = colTec.pintado.desde; window.ColorMotor.set({ desde: decDesde }); } if ($('eg3dLamVer').checked) verDivisiones(); else tarjetaLamina(); });
    $('eg3dTecPlay').addEventListener('click', animarColor);
    $('eg3dTecPausa').addEventListener('click', function () { window.ColorMotor.pause(); });
    $('eg3dTecReinicia').addEventListener('click', function () { colorAct = false; window.ColorMotor.reset(); if (colDiv) colDiv.visible = false; if (gorro) gorro.visible = false; restaurarEfectos(); restaurarEscena(); decP = 1; aplicarColor(); });
    aplicarColor();
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
        '<label style="display:flex;gap:8px;align-items:center;font-size:13px;margin-top:8px;cursor:pointer"><input type="checkbox" id="eg3dCamAuto" checked style="width:18px;height:18px;accent-color:#c9a36a"> Cámara automática: rueda sola de atrás a delante</label>' +
        '<label style="display:flex;gap:8px;align-items:center;font-size:13px;margin-top:6px;cursor:pointer"><input type="checkbox" id="eg3dManos" style="width:18px;height:18px;accent-color:#c9a36a"> Manos: sujetan el mechón con peine y cortan con la tijera</label>' +
        '<label style="display:flex;gap:8px;align-items:center;font-size:13px;margin-top:6px;cursor:pointer"><input type="checkbox" id="eg3dRegla" style="width:18px;height:18px;accent-color:#c9a36a"> Regla de pulgadas al lado del cabello</label>' +
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
      aplicar(); window.CorteMotor.reset(); refrescarLargo(); if (window.EU_CEREBRO && window.ColorMotor) montarColor(caja);
    }).catch(function () { caja.querySelector('p').textContent = 'No se pudieron cargar los motores de Guías 3D.'; });
  }
  function ir(t) { if (!CAPA) return; CAPA.T = Math.max(0, Math.min(totalPasos(), +t || 0)); CAPA.fin = false; pintarCorte(); var o = psiObjetivo(); if (o != null) CAPA.psi = o; if (camAuto()) orbita(CAPA.psi == null ? Math.PI : CAPA.psi); }
  window.EU_V18_PUENTE = { montar: montar, aplicar: aplicar, elev: null, ir: ir, modelo: function () { return CAPA; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
