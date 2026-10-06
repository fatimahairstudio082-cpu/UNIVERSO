/* b6_pelu_diagrama.js — motor de diagramación de cortes sobre el maniquí de Guías 3D (window.EU_DIAGRAMA).
   Reutiliza la cabeza 3D de <guias-3d> (escena, cámara y forma del cráneo) en un ejemplar oculto que se quita del
   DOM al terminar, como b6_pelu_guias.js. b6_guias_3d.js no se edita.
   Reglas de diagramación (de Fátima):
   · El lateral SIEMPRE se divide de oreja a oreja: la parte de atrás se corta de una forma y la de delante de otra.
   · Secciones y corte siempre en vertical, salvo cabello liso extremo (indio): entonces horizontal.
   · Las capas se cortan de abajo arriba (Z0 nuca a 0° → coronilla), cada corte con su escala de elevación (0–225°).
   · De frente, la guía se saca a una altura: bajo las cejas, bajo el ojo, bajo la nariz o donde termina el rostro.
   · Los datos de cada corte salen de EU_CORTES.guiaDe (partición, pila de elevaciones, tipo de corte, textos).
   Salida: escenas de animación vectorial (trazos en coordenadas del fondo 1280×720 + tiempos 0–1) que pinta
   EU_DIAGRAMA.pinta(ctx, A, img, x, y, w, h, prog). Esa función no usa Three.js ni nada de fuera: se serializa
   tal cual al curso (anim.js). Cargar después de b6_cortes.js. */
(function () {
  'use strict';
  if (window.EU_DIAGRAMA) return;

  var CARA = Math.PI / 2, NUCA = -Math.PI / 2, IZQ = 0, DER = Math.PI;
  var COL = ['#B01E45', '#C96A1E', '#D9920E', '#18906A', '#2C6FD1', '#7A4BD1', '#8A1C6B'];
  var TINTA = '#1F1B18', ROJO = '#C0392B', VERDE = '#7CB342', CORTE = '#8A1C6B', FONDO = '#F3EDE4';

  /* Alturas de la guía del frente, medidas sobre el maniquí (ojos y = -0.06, cejas 0.13, boca -0.56). */
  var ALTURAS = {
    cejas: { n: 'bajo las cejas', y: 0.04 },
    ojo: { n: 'bajo el ojo', y: -0.17 },
    nariz: { n: 'bajo la nariz', y: -0.36 },
    labio: { n: 'bajo el labio', y: -0.66 },
    barbilla: { n: 'en la barbilla', y: -1.16 },
    rostro: { n: 'donde termina el rostro', y: -1.28 },
    cuello: { n: 'en el cuello', y: -1.62 }
  };
  /* reparto de N capas de la nuca (abajo) a la coronilla (arriba) */
  function thCapa(z, n) { return 1.92 - z * Math.min(0.24, 1.5 / Math.max(1, n - 1)); }
  /* Recetas fijadas por Fátima por corte: { altura: 'cejas'|'ojo'|'nariz'|'rostro', punto: [x,y,z] }.
     Lo que no esté aquí se deduce del texto del corte o queda como ejemplo (y se dice en la narración). */
  var RECETAS = {};

  /* Cámaras: [azimut, elevación, distancia]; la cabeza es la misma en todos los cortes. */
  var VISTAS = { tres: [2.3, 0.45, 5.6], nuca: [Math.PI, 0.12, 5.4], lateral: [Math.PI / 2, 0.08, 5.6], frente: [0, 0.10, 5.6], arriba: [Math.PI, 1.0, 5.6] };
  var MIRA = -0.45, RECORTE = [190, 0, 900, 720];

  /* ───────────── el maniquí: ejemplar oculto de <guias-3d> ───────────── */
  /* el motor 3D se pide solo cuando hace falta (no al arrancar el Estudio) */
  function pedirMotor() {
    if (!window.customElements.get('guias-3d') && !document.querySelector('script[data-eu-g3d]')) {
      var sc = document.createElement('script'); sc.src = './b6_guias_3d.js'; sc.setAttribute('data-eu-g3d', '1'); document.head.appendChild(sc);
    }
  }
  var G = null, T = null, CAM = {}, FONDOS = null, PROM = null;
  function listo() {
    if (PROM) return PROM;
    pedirMotor();
    PROM = new Promise(function (ok, mal) {
      var n = 0;
      (function espera() {
        if (window.customElements.get('guias-3d') && !G) crearG();
        if (G && G.T && G.render3D && G.gl) { T = G.T; return ok(); }
        if (n++ > 150) { if (G) { try { G.remove(); } catch (e) { } } G = null; PROM = null; return mal(new Error('Guías 3D no está disponible (Three.js no cargó).')); }
        setTimeout(espera, 200);
      })();
    });
    return PROM;
  }
  /* Fondos JPEG de las cuatro vistas y sus cámaras (se hacen una vez). */
  function crearG() {
    G = document.createElement('guias-3d'); G.setAttribute('aria-hidden', 'true');
    G.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;pointer-events:none;opacity:0';
    document.body.appendChild(G);
  }
  function fondos() {
    if (FONDOS) return Promise.resolve(FONDOS);
    return listo().then(hacerFondos);
  }
  /* Versión síncrona para el libro (que se arma sin esperas): solo si el motor 3D ya está cargado. */
  function fondosYa() {
    if (FONDOS) return FONDOS;
    if (!window.customElements.get('guias-3d')) { pedirMotor(); return null; }
    if (!G) crearG();
    if (!(G.T && G.render3D && G.gl)) return null;
    T = G.T; return hacerFondos();
  }
  var LIENZO = {};
  function hacerFondos() {
    if (FONDOS) return FONDOS;
    {
      var out = {}, cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; var x = cv.getContext('2d');
      var cam0 = G.cam, mira0 = G.mira;
      Object.keys(VISTAS).forEach(function (k) {
        var v = VISTAS[k];
        G.cam = { a: v[0], e: v[1], r: v[2] }; G.mira = MIRA; G.destino = null; G.render3D();
        CAM[k] = { cam: G.camara.clone(), pos: G.camara.position.clone() };
        x.fillStyle = FONDO; x.fillRect(0, 0, 1280, 720); x.drawImage(G.gl, 0, 0, 1280, 720);
        out[k] = cv.toDataURL('image/jpeg', 0.86);
        var cl = document.createElement('canvas'); cl.width = 1280; cl.height = 720; cl.getContext('2d').drawImage(cv, 0, 0);
        cl.complete = true; cl.naturalWidth = 1280; LIENZO[k] = cl;
      });
      G.cam = cam0; G.mira = mira0;
      try { G.remove(); } catch (e) { }
      FONDOS = out; return out;
    }
  }

  /* ───────────── geometría sobre el cráneo del motor ───────────── */
  function P(ph, th, r) { return G.punto(ph, th, r || 1.03); }
  function N(ph, th) { return G.normal(ph, th); }
  function V3(a, b, c) { return new T.Vector3(a, b, c); }
  function sph(v) { var u = V3(v.x, v.y / G.ESC.y, v.z / G.ESC.z).normalize(); return [Math.atan2(u.z, -u.x), Math.acos(Math.max(-1, Math.min(1, u.y)))]; }
  function recta(p0, p1) { var a = P(p0[0], p0[1]), b = P(p1[0], p1[1]); return function (u) { return sph(a.clone().lerp(b, u)); }; }
  /* elevación como en la regla 0–225°: 0 cae, 90 horizontal hacia fuera, 180 arriba, 225 pasado al otro lado */
  function dirElev(ph, th, g) {
    var n = N(ph, th), f = V3(n.x, 0, n.z); if (f.lengthSq() < 1e-6) f.set(0, 0, -1); f.normalize();
    var a = g * Math.PI / 180; return V3(0, -1, 0).multiplyScalar(Math.cos(a)).add(f.multiplyScalar(Math.sin(a))).normalize();
  }
  function r1(n) { return Math.round(n * 10) / 10; }
  function pr(vk, v) { var q = v.clone().project(CAM[vk].cam); return [r1((q.x + 1) / 2 * 1280), r1((1 - q.y) / 2 * 720)]; }
  function seVe(vk, ph, th) { return N(ph, th).dot(CAM[vk].pos.clone().sub(P(ph, th))) > 0.05; }
  /* curva sobre el cráneo → trozos visibles (cada trozo, un trazo) */
  function tramos(vk, f, n) {
    var out = [], cur = [];
    for (var i = 0; i <= n; i++) { var c = f(i / n); if (seVe(vk, c[0], c[1])) { var q = pr(vk, P(c[0], c[1])); cur.push(q[0], q[1]); } else { if (cur.length > 2) out.push(cur); cur = []; } }
    if (cur.length > 2) out.push(cur); return out;
  }
  function plano(lst) { var o = []; lst.forEach(function (q) { o.push(q[0], q[1]); }); return o; }
  function bezier(vk, a, c, b, n) { var o = []; for (var i = 0; i <= n; i++) { var u = i / n; o.push(pr(vk, a.clone().multiplyScalar((1 - u) * (1 - u)).add(c.clone().multiplyScalar(2 * u * (1 - u))).add(b.clone().multiplyScalar(u * u)))); } return plano(o); }

  /* constructores de trazos (formato que entiende pinta) */
  function linea(p, t, c, w, extra) { return Object.assign({ k: 'l', p: p, t: t, c: c, w: w || 3 }, extra || {}); }
  function lineas(lst, t, c, w, extra) { return lst.map(function (p) { return linea(p, t, c, w, extra); }); }
  function mechon(f, t, c, w, extra) { return Object.assign({ k: 'm', f: f, t: t, c: c, w: w || 2.4 }, extra || {}); }
  function tijera(p, t, c, desg, extra) { return Object.assign({ k: 's', p: p, t: t, c: c || CORTE, g: desg ? 1 : 0 }, extra || {}); }
  function rotulo(txt, c, t0, extra) { return Object.assign({ k: 'e', s: txt, c: c, t: [t0, 1] }, extra || {}); }
  function regla(g0, g1, t, c, tit, extra) { return Object.assign({ k: 'r', g: [g0, g1], t: t, c: c, s: tit || 'Elevación' }, extra || {}); }
  function chapa(q, txt, c, t0) { return { k: 'n', x: q[0], y: q[1], s: String(txt), c: c, t: [t0, 1] }; }

  /* ───────────── la receta de un corte, desde los datos del motor ───────────── */
  /* Receta de un corte del catálogo (cabello: el elegido o el que mejor le va) */
  function receta(id, cab) {
    var CO = window.EU_CORTES, c = CO && CO.get(id); if (!c) return null;
    cab = cab || (c.mejor || [])[0];
    return desdeGuia(CO.guiaDe(id, cab), { id: id, n: c.n, fam: c.fam, cab: cab, d: c.d });
  }
  /* Receta desde cualquier guía de <guias-3d> (también las guardadas por Fátima) */
  function desdeGuia(g, meta) {
    if (!g || !g.pasos || !g.pasos.length) return null;
    meta = meta || {};
    var P = g.pasos, ult = P[P.length - 1], p1 = P[1] || P[0], p2 = P[2] || ult, p3 = P[3] || ult;
    var todo = P.map(function (p) { return p.texto || ''; }).join(' ') + ' ' + (meta.d || '');
    var fija = RECETAS[meta.id] || {}, alt = fija.altura, fuente = 'Fátima';
    if (!alt) {
      fuente = 'texto';
      if (/ceja|flequillo|pollina/i.test(todo) || meta.fam === 'flequillos') alt = 'cejas';
      else if (/p[oó]mulo|ojo/i.test(todo)) alt = 'ojo';
      else if (/nariz/i.test(todo)) alt = 'nariz';
      else if (/barbilla|ment[oó]n|maxilar|mand[ií]bula/i.test(todo)) alt = 'rostro';
      else { alt = 'nariz'; fuente = 'ejemplo'; }
    }
    var liso = meta.cab === 'liso_extremo' || /liso extremo/i.test((g.aviso || '') + ' ' + (g.nombre || '')), tipos = P.map(function (p) { return p.tipoCorte || ''; }).join(' ');
    var desg = /desfil|desgraf|puntead|entresac/i.test(tipos + ' ' + todo);
    function pila(a) { return (a || [0, 0, 0, 0, 0, 0, 0]).map(function (v) { return v == null ? 0 : v; }); }
    return {
      id: meta.id || 'guia', n: meta.n || String(g.nombre || 'Corte').split(' · ')[0], fam: meta.fam || '', cab: meta.cab || '', liso: liso, desg: desg, altura: alt, fuenteAltura: fuente,
      punto: /desfil|desgraf|punta/i.test(todo) || fija.punto ? (fija.punto || [1.05, -2.15, -0.30]) : null,
      forma: p3.tipoCorte === 'Recto' ? 'recto' : 'arco',
      guia: { part: p1.particionB, g: pila(p1.elevB)[0] || 0, texto: p1.texto || '' },
      capas: { part: p2.particionB, pila: pila(p2.elevB), texto: p2.texto || '' },
      frente: { part: p3.particionF, pila: pila(p3.elevF), dir: p3.direccion || '', texto: p3.texto || '' }
    };
  }

  /* ───────────── escenas ───────────── */
  function escSeccion(R) {
    var v = 'tres', tr = [];
    tr = tr.concat(lineas(tramos(v, function (u) { var th = -1.30 + u * 3.25; return th < 0 ? [CARA, -th] : [NUCA, th]; }, 90), [0.04, 0.3], TINTA, 4));
    tr = tr.concat(lineas(tramos(v, function (u) { var th = -1.62 + u * 3.24; return th < 0 ? [IZQ - 0.12, -th] : [DER + 0.12, th]; }, 90), [0.3, 0.56], '#2C6FD1', 4.5));
    tr = tr.concat(lineas(tramos(v, function (u) { return [-0.15 - u * (Math.PI - 0.3), 1.58]; }, 60), [0.56, 0.8], '#18906A', 4));
    var cen = [[CARA - 0.5, 0.75], [CARA + 0.5, 0.75], [NUCA + 0.6, 0.85], [NUCA - 0.6, 0.85], [NUCA + 0.5, 1.8], [NUCA - 0.5, 1.8]];
    cen.forEach(function (c, i) { if (seVe(v, c[0], c[1])) tr.push(chapa(pr(v, P(c[0], c[1])), i + 1, COL[(i * 2) % 7], 0.82)); });
    tr.push(rotulo('1 · Raya central: de la frente a la nuca', TINTA, 0.04), rotulo('2 · De oreja a oreja (separa atrás y delante)', '#2C6FD1', 0.3), rotulo('3 · Línea horizontal de la nuca', '#18906A', 0.56));
    return { v: v, tr: tr };
  }
  /* una capa horizontal de la nuca: raya, mechones que suben a su elevación y el corte con la tijera */
  function capaHorizontal(v, th, g, c, ta, tb, ocultar, linea) {
    var tr = [], ext = ocultar ? { x: tb + 0.001 } : {}, tips = [];
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA - 0.85 + u * 1.7, th]; }, 30), [ta, ta + (tb - ta) * 0.2], c, 3));
    for (var i = 0; i <= 8; i++) {
      var ph = NUCA - 0.8 + i / 8 * 1.6; if (!seVe(v, ph, th)) continue;
      var a = P(ph, th), ks = [];
      for (var k = 0; k <= 5; k++) { var b = a.clone().add(dirElev(ph, th, g * k / 5).multiplyScalar(0.95)); ks.push([].concat(pr(v, a), pr(v, b))); }
      tr.push(mechon(ks, [ta + (tb - ta) * 0.2, ta + (tb - ta) * 0.6], c, 2.4, ext)); tips.push(ks[5].slice(2));
    }
    /* cuadrado: la línea de corte va recta; redondeado: la misma guía, la línea se lleva hacia delante (sube a los lados) */
    if ((linea === 'recta' || linea === 'redondeada') && tips.length > 2) {
      var mid = (tips.length - 1) / 2, yc = tips[Math.round(mid)][1];
      tips = tips.map(function (q, i) { var d = Math.abs(i - mid) / mid; return [q[0], r1(linea === 'recta' ? yc : yc - 46 * d * d)]; });
    }
    tr.push(tijera(plano(tips), [ta + (tb - ta) * 0.6, tb], c, false, ext));
    return tr;
  }
  function escGuia(R) {
    var v = 'nuca', g = R.guia.g, tr = capaHorizontal(v, 1.92, g, COL[0], 0.05, 0.95, false, R.linea);
    tr.push(rotulo('Guía en la nuca · ' + g + '°', COL[0], 0.05), regla(0, g, [0.25, 0.6], COL[0]));
    return { v: v, tr: tr };
  }
  function escCapas(R) {
    var v = 'nuca', pila = R.capas.pila, n = pila.length || 7, tr = [], vert = R.capas.part === 'vertical' && !R.liso;
    if (!vert) {
      for (var z = 0; z < n; z++) {
        var ta = z / n, tb = (z + 1) / n, g = pila[z] || 0;
        tr = tr.concat(capaHorizontal(v, thCapa(z, n), g, COL[z % 7], ta, tb, z < n - 1, R.linea));
        tr.push(rotulo((R.libre ? 'Capa ' + (z + 1) : 'Z' + z) + ' · ' + g + '°', COL[z % 7], ta, z < n - 1 ? { x: tb } : {}), regla(z ? pila[z - 1] : 0, g, [ta, ta + (tb - ta) * 0.6], COL[z % 7], 'Elevación', z < n - 1 ? { x: tb } : {}));
      }
    } else {
      var secs = [-0.6, -0.3, 0, 0.3, 0.6];
      secs.forEach(function (d, s) {
        var ph = NUCA + d, ta = s / secs.length, tb = (s + 1) / secs.length, tips = [], ext = s < secs.length - 1 ? { x: tb } : {};
        tr = tr.concat(lineas(tramos(v, function (u) { return [ph, 0.5 + u * 1.45]; }, 24), [ta, ta + (tb - ta) * 0.2], '#8E847A', 2.4));
        for (var z = 0; z < n; z++) {
          var th = thCapa(z, n); if (!seVe(v, ph, th)) continue;
          var a = P(ph, th), nn = N(ph, th), ks = [];
          for (var k = 0; k <= 5; k++) { var gz = (pila[z] || 0) * k / 5 * Math.PI / 180, b = a.clone().add(dirElev(ph, th, 0).multiplyScalar(Math.cos(gz) * 0.6).add(nn.clone().multiplyScalar(Math.sin(gz) * 0.6))); ks.push([].concat(pr(v, a), pr(v, b))); }
          tr.push(mechon(ks, [ta + (tb - ta) * 0.2, ta + (tb - ta) * 0.6], COL[z % 7], 2.2, ext)); tips.push(ks[5].slice(2));
        }
        tr.push(tijera(plano(tips), [ta + (tb - ta) * 0.6, tb], CORTE, R.desg, ext));
      });
      tr.push(rotulo('Secciones verticales · ' + pila.join(' · ') + '°', TINTA, 0), regla(0, Math.max.apply(null, pila), [0, 0.3], CORTE));
    }
    return { v: v, tr: tr };
  }
  function escLateral(R) {
    var v = 'lateral', tr = [], pila = R.frente.pila.length ? R.frente.pila : R.capas.pila;
    /* división de oreja a oreja: separa atrás y delante */
    tr = tr.concat(lineas(tramos(v, function (u) { return [DER + 0.12, u * 1.62]; }, 30), [0, 0.12], '#2C6FD1', 4.5));
    tr.push(rotulo('División de oreja a oreja', '#2C6FD1', 0));
    for (var r = 0; r < 5; r++) { var y = 0.15 - r * 0.22; tr.push(linea(plano([pr(v, V3(1.05, y, -0.15)), pr(v, V3(1.0, y, 1.9))]), [0.04 + r * 0.02, 0.14 + r * 0.02], VERDE, 2.5)); }
    tr.push(rotulo('Referencias horizontales hacia el rostro', VERDE, 0.04));
    if (R.liso) {
      for (var h = 0; h < 5; h++) {
        var th = 0.95 + h * 0.17, ta = 0.18 + h * 0.15, tb = ta + 0.15, tips = [];
        tr = tr.concat(lineas(tramos(v, function (u) { return [DER - 0.75 + u * 0.75, th]; }, 20), [ta, ta + 0.04], TINTA, 3));
        for (var i = 0; i <= 5; i++) { var ph = DER - 0.7 + i * 0.13, a = P(ph, th), b = a.clone().add(V3(0, -0.85, 0)); tr.push(linea(plano([pr(v, a), pr(v, b)]), [ta + 0.03, ta + 0.08], ROJO, 2.2)); tips.push(pr(v, b)); }
        tr.push(tijera(plano(tips), [ta + 0.08, tb], CORTE, false));
      }
      tr.push(rotulo(R.libre ? 'Secciones horizontales' : 'Liso extremo: secciones horizontales', ROJO, 0.18));
      return { v: v, tr: tr };
    }
    var secs = [DER - 0.35, DER - 0.07, DER + 0.21, DER + 0.49, DER + 0.77];
    secs.forEach(function (ph, s) { tr = tr.concat(lineas(tramos(v, function (u) { return [ph, 0.3 + u * 1.35]; }, 20), [0.16 + s * 0.04, 0.26 + s * 0.04], TINTA, 3)); });
    tr.push(rotulo(secs.length + ' secciones verticales', TINTA, 0.16));
    if (R.punto) {
      var Pc = V3(R.punto[0], R.punto[1], R.punto[2]);
      secs.forEach(function (ph, s) { [0.55, 0.95, 1.35].forEach(function (th) { var a = P(ph, th), c = V3(a.x + 0.25, (a.y + Pc.y) / 2, (a.z + Pc.z) / 2); tr.push(linea(bezier(v, a, c, Pc, 20), [0.38 + s * 0.06, 0.6 + s * 0.06], ROJO, 2.2)); }); });
      var qP = pr(v, Pc); tr.push(chapa(qP, '', ROJO, 0.62), rotulo('Todos los mechones al mismo punto', ROJO, 0.38));
      tr.push(tijera(plano([pr(v, V3(Pc.x, Pc.y + 0.15, Pc.z - 0.5)), pr(v, V3(Pc.x, Pc.y + 0.15, Pc.z)), pr(v, V3(Pc.x, Pc.y + 0.15, Pc.z + 0.5))]), [0.86, 0.99], CORTE, R.desg));
    } else {
      secs.forEach(function (ph, s) {
        var ta = 0.36 + s * 0.12, tb = ta + 0.12, tips = [];
        for (var z = 0; z < 6; z++) {
          var th = 0.55 + z * 0.2, g = pila[Math.round((1 - z / 5) * (pila.length - 1))] || 0, a = P(ph, th), ks = [];
          for (var k = 0; k <= 5; k++) ks.push([].concat(pr(v, a), pr(v, a.clone().add(dirElev(ph, th, g * k / 5).multiplyScalar(0.7)))));
          tr.push(mechon(ks, [ta, ta + 0.06], ROJO, 2.2, s < secs.length - 1 ? { x: tb } : {})); tips.push(ks[5].slice(2));
        }
        tr.push(tijera(plano(tips), [ta + 0.06, tb], CORTE, R.desg, s < secs.length - 1 ? { x: tb } : {}));
      });
      tr.push(rotulo('Cada mechón a su elevación · corte vertical', ROJO, 0.36));
    }
    return { v: v, tr: tr };
  }
  function escFrente(R) {
    var v = 'frente', tr = [], A = ALTURAS[R.altura], n = 7, abre = 1.05;
    tr = tr.concat(lineas(tramos(v, function (u) { return [CARA, 0.02 + u * 0.8]; }, 20), [0, 0.08], '#5B4B8A', 3));
    for (var k = 0; k < 4; k++) [-1, 1].forEach(function (sg) { tr = tr.concat(lineas(tramos(v, recta([CARA, 0.10 + k * 0.16], [CARA + sg * 1.15, 0.65 + k * 0.16]), 16), [0.04 + k * 0.03, 0.14 + k * 0.03], TINTA, 2.2)); });
    tr = tr.concat(lineas(tramos(v, function (u) { return [CARA - 1.2 + u * 2.4, 0.86]; }, 30), [0.14, 0.2], '#8E847A', 2, { d: 1 }));
    /* la altura de la guía: línea de referencia sobre el rostro */
    tr.push(linea(plano([pr(v, V3(-1.15, A.y, 1.25)), pr(v, V3(1.15, A.y, 1.25))]), [0.18, 0.26], VERDE, 2.5, { d: 1 }));
    tr.push(rotulo('Guía ' + A.n, VERDE, 0.18), rotulo('Espiga diagonal arriba', TINTA, 0.04));
    var tips = [], caida = R.forma === 'recto' ? 0 : 0.95;
    for (var i = 0; i < n; i++) {
      var d = -abre + 2 * abre * i / (n - 1), ph = CARA + d, ad = Math.abs(d) / abre;
      if (R.liso) tr = tr.concat(lineas(tramos(v, function (u) { return [CARA - abre + u * 2 * abre, 0.9 + i * 0.06]; }, 20), [0.2 + i * 0.015, 0.3 + i * 0.015], ROJO, 2.2));
      else tr = tr.concat(lineas(tramos(v, function (u) { return [ph, 0.86 + u * 0.42]; }, 12), [0.2 + i * 0.015, 0.3 + i * 0.015], ROJO, 2.6));
      var a = P(ph, 1.28), tip = V3(a.x * 1.22, A.y - caida * Math.pow(ad, 1.35), Math.max(a.z, 0.2) + 0.55), c = V3(a.x * 1.1, (a.y + tip.y) / 2 + 0.25, a.z + 0.55);
      tr.push(linea(bezier(v, a, c, tip, 22), [0.32 + i * 0.03, 0.55 + i * 0.03], ROJO, 2.6, { fl: 1 }));
      tips.push(pr(v, tip));
    }
    tr.push(rotulo((R.liso ? (R.libre ? 'Secciones horizontales' : 'Liso extremo: secciones horizontales') : n + ' líneas verticales: de cada una sale su mechón'), ROJO, 0.2));
    tr.push(tijera(plano(tips), [0.72, 0.97], CORTE, R.desg), rotulo('Línea de corte ' + (R.forma === 'recto' ? 'recta' : 'en arco') + (R.desg ? ' · desgrafilado' : ''), CORTE, 0.72));
    return { v: v, tr: tr };
  }

  /* ───────────── textos de cada escena (reglas de Fátima + textos reales del corte) ───────────── */
  /* Oblicua · box universal: diagonales en X hacia detrás de las orejas (2), abanico en la nuca (1), triángulo arriba (3) */
  function escOblicua(R) {
    var v = 'nuca', tr = [], C = [NUCA, 1.22];
    [[NUCA - 0.95, 0.5, NUCA + 0.9, 1.82], [NUCA + 0.95, 0.5, NUCA - 0.9, 1.82]].forEach(function (d) {
      tr = tr.concat(lineas(tramos(v, recta([d[0], d[1]], [d[2], d[3]]), 30), [0.02, 0.22], ROJO, 4));
    });
    for (var i = 0; i <= 8; i++) { var ph = NUCA - 0.7 + i * 0.175; tr = tr.concat(lineas(tramos(v, recta(C, [ph, 1.97]), 12), [0.22 + i * 0.02, 0.32 + i * 0.02], '#8E847A', 1.8)); }
    for (var k = 0; k < 5; k++) [-1, 1].forEach(function (sg) { var a = [NUCA + sg * (0.35 + k * 0.12), 0.75 + k * 0.17]; tr = tr.concat(lineas(tramos(v, recta(a, [a[0] + sg * 0.3, a[1] - 0.22]), 8), [0.42 + k * 0.03, 0.5 + k * 0.03], '#8E847A', 1.8)); });
    for (var j = 0; j < 7; j++) { var p0 = NUCA - 0.36 + j * 0.12; tr = tr.concat(lineas(tramos(v, function (u) { return [p0, 0.42 + u * (0.72 - Math.abs(p0 - NUCA) * 0.9)]; }, 10), [0.6 + j * 0.02, 0.7 + j * 0.02], '#8E847A', 1.8)); }
    [[[NUCA, 1.78], '1'], [[NUCA - 0.62, 1.15], '2'], [[NUCA + 0.62, 1.15], '2'], [[NUCA, 0.62], '3']].forEach(function (o) { if (seVe(v, o[0][0], o[0][1])) tr.push(chapa(pr(v, P(o[0][0], o[0][1])), o[1], ROJO, 0.82)); });
    tr.push(rotulo('Partición oblicua en X (box universal)', ROJO, 0.02), rotulo('1 · Nuca en abanico', TINTA, 0.22), rotulo('2 · Secciones diagonales a los lados', TINTA, 0.42), rotulo('3 · Triángulo de arriba', TINTA, 0.6));
    return { v: v, tr: tr };
  }

  /* Ángulos y largos (EU_CALCULO_CAPILAR): el perfil con transportador, escuadra/cartabón, compás y regla en cm */
  function escAngulos(R, calc) {
    var v = 'lateral', tr = [], n = calc.capas.length;
    var atras = pr(v, P(NUCA, Math.PI / 2)), cara = pr(v, P(CARA, Math.PI / 2)), bx = atras[0] - cara[0], by = atras[1] - cara[1], bl = Math.sqrt(bx * bx + by * by) || 1;
    bx /= bl; by /= bl;
    var px = bl / (2 * calc.R), roots = [], tips = [];
    calc.capas.forEach(function (c) { roots.push(pr(v, P(NUCA, Math.max(0.05, Math.min(2.6, c.b))))); });
    tr.push(linea(plano(roots), [0, 0.08], '#5B4B8A', 2.5, { d: 1 }));
    tr.push(rotulo('Compás · curva de la cabeza (R = ' + EU_CALCULO_CAPILAR.fmt(calc.R) + ' cm)', '#5B4B8A', 0));
    calc.capas.forEach(function (c, z) {
      var ta = 0.08 + 0.8 * z / n, tb = 0.08 + 0.8 * (z + 1) / n, sx = c.dir[0] * bx, sy = c.dir[0] * by - c.dir[1], sl = Math.sqrt(sx * sx + sy * sy) || 1, l = Math.min(260, c.largo * px), q = roots[z];
      sx /= sl; sy /= sl;
      /* guía fija que rodea el cráneo: el camino (arco + tramo recto) se pasa a la pantalla con la misma escala */
      var pl = null;
      if (c.camino) { pl = []; c.camino.forEach(function (Q) { var vx = Q[0] - c.raiz[0], vy = Q[1] - c.raiz[1]; pl.push(r1(q[0] + px * (vx * bx)), r1(q[1] + px * (vx * by - vy))); }); if (tips[0]) { pl[pl.length - 2] = tips[0][0]; pl[pl.length - 1] = tips[0][1]; } }
      tips.push(pl ? [pl[pl.length - 2], pl[pl.length - 1]] : [r1(q[0] + sx * l), r1(q[1] + sy * l)]);
      var tz = { k: 'i', x: q[0], y: q[1], dx: r1(sx * 1000) / 1000, dy: r1(sy * 1000) / 1000, l: r1(l), g: c.ang, e: c.escuadra, cm: EU_CALCULO_CAPILAR.fmt(c.largo) + ' cm', cpx: r1(px), cc: bx > 0 ? 1 : 0, t: [ta, tb], c: COL[z % 7], x2: z < n - 1 ? tb + 0.02 : 0 };
      if (pl) tz.pl = pl; tr.push(tz);
      tr.push(rotulo('Capa ' + (z + 1) + ' · ' + EU_CALCULO_CAPILAR.fmt(c.ang) + '° · ' + EU_CALCULO_CAPILAR.fmt(c.largo) + ' cm · ' + (z ? 'guía ' + (c.guia === 'movil' ? 'móvil' : c.guia) : 'guía'), COL[z % 7], ta, z < n - 1 ? { x: tb } : {}));
    });
    tr.push(tijera(plano(tips), [0.88, 0.99], CORTE, R.desg), rotulo('Forma: ' + calc.forma + ' (a validar)', CORTE, 0.88));
    return { v: v, tr: tr };
  }
  /* Coronilla en triángulo oblicuo: vértice delante, base atrás; secciones oblicuas y mechones a su elevación */
  function escCoronilla(R) {
    var v = 'arriba', tr = [], g = R.coronilla.g, A = [CARA, 0.42], B = [NUCA + 0.8, 1.0], Cc = [NUCA - 0.8, 1.0], tips = [];
    [[A, B], [B, Cc], [Cc, A]].forEach(function (e) { tr = tr.concat(lineas(tramos(v, recta(e[0], e[1]), 26), [0, 0.2], ROJO, 4)); });
    function mz(a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; }
    for (var k = 1; k <= 4; k++) {
      var f = k / 5, p0 = mz(A, Cc, f), p1 = mz(B, Cc, f), ta = 0.2 + (k - 1) * 0.1;
      tr = tr.concat(lineas(tramos(v, recta(p0, p1), 16), [ta, ta + 0.05], '#8E847A', 2));
      for (var j = 0; j <= 3; j++) {
        var pt = mz(p0, p1, j / 3); if (!seVe(v, pt[0], pt[1])) continue;
        var a = P(pt[0], pt[1]), ks = [];
        for (var m = 0; m <= 5; m++) ks.push([].concat(pr(v, a), pr(v, a.clone().add(dirElev(pt[0], pt[1], g * m / 5).multiplyScalar(0.75)))));
        tr.push(mechon(ks, [ta + 0.05, 0.75], COL[(k + 2) % 7], 2.2)); tips.push(ks[5].slice(2));
      }
    }
    tr.push(rotulo('Coronilla · triángulo oblicuo', ROJO, 0), rotulo('Secciones oblicuas · ' + g + '°', TINTA, 0.2), regla(0, g, [0.3, 0.7], CORTE, 'Coronilla'));
    if (tips.length > 1) tr.push(tijera(plano(tips), [0.78, 0.98], CORTE, R.desg));
    return { v: v, tr: tr };
  }

  /* Corte libre: cada capa con su elevación (0–225°). Lo que no se elige, va por defecto y se dice. */
  function libre(o) {
    o = o || {};
    var capas = (o.capas || [0]).map(function (g) { return Math.max(0, Math.min(225, +g || 0)); }).slice(0, 12);
    var frente = (o.frente && o.frente.length ? o.frente : capas).map(function (g) { return Math.max(0, Math.min(225, +g || 0)); });
    var part = o.part || 'vertical', liso = part === 'horizontal';
    return {
      id: 'libre', libre: true, n: o.n || 'Mi corte', fam: '', cab: liso ? 'liso_extremo' : '', liso: liso,
      desg: o.acabado === 'desgrafilado', altura: ALTURAS[o.altura] ? o.altura : 'nariz', fuenteAltura: 'Fátima',
      punto: o.acabado === 'desgrafilado' && o.punto !== false ? [1.05, -2.15, -0.30] : null,
      forma: o.lineaFrente === 'recta' ? 'recto' : 'arco', linea: o.linea || '', oblicua: part === 'oblicua',
      guia: { part: part, g: capas[0], texto: o.texto || '' },
      capas: { part: part === 'oblicua' ? 'horizontal' : part, pila: capas, texto: '' },
      frente: { part: part, pila: frente, dir: 'Hacia el rostro', texto: '' },
      guias: (o.guias || []).slice(), ref: o.ref === 'suelo' ? 'suelo' : 'craneo', medidas: o.medidas || null,
      coronilla: o.coronilla ? { g: Math.max(0, Math.min(225, +o.coronillaG || Math.max.apply(null, capas))) } : null
    };
  }

  function txt(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function escenas(id) {
    var R = typeof id === 'object' ? id : receta(id); if (!R) return null;
    var A = ALTURAS[R.altura], pila = R.capas.pila;
    var capasTxt = pila.map(function (g, z) { return (R.libre ? 'capa ' + (z + 1) : 'Z' + z) + ' a ' + g + ' grados'; }).join(', ') +
      (R.linea === 'recta' ? '. Línea de corte recta: el corte queda cuadrado' : R.linea === 'redondeada' ? '. La línea de corte se lleva hacia delante: el corte queda redondeado' : '');
    var lat = 'El lateral, delante de la división de oreja a oreja. ' + (R.liso ? (R.libre ? 'Secciones horizontales. ' : 'Cabello liso extremo: las secciones van horizontales, porque en vertical el filo deja escalón. ') :
      'Secciones verticales. ' + (R.punto ? 'Cada mechón se lleva al mismo punto y ahí se corta' + (R.desg ? ', desgrafilando.' : '.') : 'Cada mechón sale a su elevación y el corte sigue la sección.'));
    var fr = 'De frente, ' + (R.fuenteAltura === 'ejemplo' ? 'en este ejemplo la guía se saca ' + A.n + '; según el corte puede sacarse bajo las cejas, bajo el ojo, bajo la nariz o donde termina el rostro. ' : 'la guía se saca ' + A.n + '. ') +
      (R.liso ? 'Secciones horizontales. ' : 'Líneas verticales: de cada una baja su mechón y las puntas marcan la línea de corte' + (R.desg ? ', que se desgrafila. ' : '. ')) + txt(R.frente.texto);
    var L = [
      { tipo: 'seccion', vista: 'tres', t: 'Seccionado', texto: 'Primero se divide la cabeza: raya central de la frente a la nuca, de oreja a oreja por arriba y una línea horizontal en la nuca. El lateral siempre se separa de oreja a oreja: la parte de atrás se corta de una forma y la de delante de otra.', a: escSeccion(R) },
      { tipo: 'guia', vista: 'nuca', t: 'Línea guía en la nuca', texto: 'Línea guía en la nuca a ' + R.guia.g + ' grados. ' + txt(R.guia.texto), a: escGuia(R) },
      { tipo: 'capas', vista: 'nuca', t: 'Capas de abajo arriba', texto: 'Ahora las capas, de abajo arriba: ' + capasTxt + '. ' + txt(R.capas.texto), a: escCapas(R) },
      { tipo: 'lateral', vista: 'lateral', t: 'El lateral', texto: lat, a: escLateral(R) },
      { tipo: 'frente', vista: 'frente', t: 'El frente · guía ' + A.n, texto: fr, a: escFrente(R) }
    ];
    if (R.oblicua) L.splice(1, 0, { tipo: 'oblicua', vista: 'nuca', t: 'Partición oblicua · box universal', texto: 'Partición oblicua: dos diagonales en X que bajan hacia detrás de las orejas. La nuca se corta en abanico, los lados en secciones diagonales y arriba queda el triángulo.', a: escOblicua(R) });
    if (R.libre) L.forEach(function (e) { if (e.tipo === 'guia') e.texto = 'Línea guía en la nuca a ' + R.guia.g + ' grados, medida desde la caída natural.'; });
    /* geometría calculada: ángulos y largos (calculadora capilar) y coronilla en triángulo oblicuo */
    var CC = window.EU_CALCULO_CAPILAR, calc = null;
    try { calc = CC ? CC.calcular({ capas: pila, guias: R.guias, ref: R.ref }, R.medidas) : null; } catch (e) { calc = null; }
    var ic = L.map(function (e) { return e.tipo; }).indexOf('capas') + 1;
    if (R.coronilla) L.splice(ic++, 0, { tipo: 'coronilla', vista: 'arriba', t: 'Coronilla · triángulo oblicuo', texto: 'La coronilla se corta en triángulo: el vértice hacia la frente y la base atrás, con secciones oblicuas. Cada mechón se eleva a ' + R.coronilla.g + ' grados.', a: escCoronilla(R) });
    if (calc) {
      var esq = []; calc.capas.forEach(function (c) { var t = CC.fmt(c.ang) + '°: ' + c.escuadra; if (c.ang && esq.indexOf(t) < 0) esq.push(t); });
      L.splice(ic, 0, { tipo: 'angulos', vista: 'lateral', t: 'Ángulos y largos · escuadra y transportador', texto: 'Ángulos y largos de cada capa, de abajo arriba, medidos ' + (calc.ref === 'suelo' ? 'desde el suelo' : 'desde el cráneo') + '. ' + calc.texto + (esq.length ? ' Cómo se trazan: ' + esq.join('; ') + '.' : ''), a: escAngulos(R, calc) });
    }
    var qs = [{ e: '¿Cómo se toman las secciones del lateral en ' + R.n.toLowerCase() + '?', o: ['Verticales', 'Horizontales'], c: R.liso ? 1 : 0, x: R.liso ? 'Es cabello liso extremo: en vertical el filo deja escalón.' : 'Siempre en vertical, salvo en cabello liso extremo.' }];
    if (R.fuenteAltura !== 'ejemplo') { var ks = Object.keys(ALTURAS).filter(function (k) { return k !== R.altura; }), gi = (R.n.length + pila.length) % ks.length; ks = ks.slice(gi).concat(ks.slice(0, gi)).slice(0, 3); ks.splice((R.n.length) % 4, 0, R.altura); qs.push({ e: '¿Desde dónde se saca la guía del frente en ' + R.n.toLowerCase() + '?', o: ks.map(function (k) { return 'Desde ' + ALTURAS[k].n; }), c: ks.indexOf(R.altura) }); }
    if (calc) {
      var FORMAS = ['línea sólida · un solo largo', 'capas uniformes', 'graduación · escalonado (peso abajo)', 'capas en aumento (más cortas arriba)', 'forma combinada'];
      var ops = FORMAS.filter(function (f) { return f !== calc.forma; }).slice((R.n.length + pila.length) % 3, (R.n.length + pila.length) % 3 + 2); ops.splice(pila.length % 3, 0, calc.forma);
      qs.push({ e: 'Con estas elevaciones (' + pila.join(' · ') + '°), ¿qué forma resulta en ' + R.n.toLowerCase() + '?', o: ops, c: ops.indexOf(calc.forma), x: 'Largos calculados: ' + calc.largos.map(function (x) { return CC.fmt(x); }).join(' · ') + ' cm.' });
    }
    return { R: R, escenas: L, preguntas: qs, calculo: calc };
  }

  /* ───────────── reproductor de la animación: autónomo, se serializa al curso ───────────── */
  function pinta(x, A, im, bx, by, bw, bh, p) {
    if (!A) return false;
    var c = A.crop || [0, 0, 1280, 720], s = Math.min(bw / c[2], bh / c[3]), ox = bx + (bw - c[2] * s) / 2 - c[0] * s, oy = by + (bh - c[3] * s) / 2 - c[1] * s;
    x.save(); x.beginPath(); x.rect(bx, by, bw, bh); x.clip();
    x.fillStyle = A.bg || '#F3EDE4'; x.fillRect(bx, by, bw, bh);
    if (im && im.complete && im.naturalWidth) x.drawImage(im, ox, oy, 1280 * s, 720 * s);
    function tr(t) { return Math.max(0, Math.min(1, (p - t[0]) / Math.max(1e-6, t[1] - t[0]))); }
    function su(u) { return u * u * (3 - 2 * u); }
    function camino(q, n) { x.beginPath(); x.moveTo(ox + q[0] * s, oy + q[1] * s); for (var i = 2; i < n; i += 2) x.lineTo(ox + q[i] * s, oy + q[i + 1] * s); }
    function parcial(q, u) { return Math.max(4, Math.round(q.length / 2 * u) * 2); }
    var ry = by + 16, cola = [];
    (A.tr || []).forEach(function (T) {
      if (p < T.t[0] || (T.x && p > T.x)) return;
      var u = tr(T.t);
      x.strokeStyle = T.c; x.fillStyle = T.c; x.lineWidth = (T.w || 3) * Math.max(0.6, s * 1.4); x.lineCap = 'round'; x.lineJoin = 'round'; x.setLineDash(T.d ? [8, 6] : []);
      if (T.k === 'l') {
        var n = parcial(T.p, su(u)); camino(T.p, Math.min(n, T.p.length)); x.stroke();
        if (T.fl && u >= 1 && T.p.length >= 4) { var L = T.p.length, ax = T.p[L - 4], ay = T.p[L - 3], qx = T.p[L - 2], qy = T.p[L - 1], an = Math.atan2(qy - ay, qx - ax); x.save(); x.translate(ox + qx * s, oy + qy * s); x.rotate(an); x.beginPath(); x.moveTo(0, 0); x.lineTo(-10, -5); x.lineTo(-10, 5); x.closePath(); x.fill(); x.restore(); }
      } else if (T.k === 'm') {
        var f = T.f, K = f.length - 1, v = su(u) * K, i0 = Math.min(K - 1, Math.floor(v)), w = v - i0, a = f[i0], b = f[Math.min(K, i0 + 1)];
        x.beginPath(); x.moveTo(ox + (a[0] + (b[0] - a[0]) * w) * s, oy + (a[1] + (b[1] - a[1]) * w) * s); x.lineTo(ox + (a[2] + (b[2] - a[2]) * w) * s, oy + (a[3] + (b[3] - a[3]) * w) * s); x.stroke();
      } else if (T.k === 's') cola.push([T, u]);
      else if (T.k === 'n') { x.beginPath(); x.arc(ox + T.x * s, oy + T.y * s, 11, 0, 7); x.fill(); if (T.s) { x.fillStyle = '#fff'; x.font = '700 13px system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(T.s, ox + T.x * s, oy + T.y * s + 1); x.textAlign = 'left'; x.textBaseline = 'alphabetic'; } }
      else if (T.k === 'e') { x.setLineDash([]); x.font = '700 15px system-ui,sans-serif'; var tw = x.measureText(T.s).width + 18; x.fillStyle = 'rgba(255,255,255,.93)'; x.fillRect(bx + 12, ry, tw, 26); x.fillStyle = T.c; x.fillRect(bx + 12, ry, 4, 26); x.fillStyle = '#1F1B18'; x.fillText(T.s, bx + 24, ry + 18); ry += 32; }
      else if (T.k === 'i') {
        /* instrumento: transportador en la raíz, arco hasta el ángulo, escuadra/cartabón, mechón con regla en cm */
        var act = !(T.x2 && p > T.x2);   /* transportador y escuadra solo en la capa que se está cortando; el mechón queda */
        x.setLineDash([]); var qx = ox + T.x * s, qy = oy + T.y * s, rr = 58 * Math.max(0.7, s * 1.3), aD = Math.PI / 2, aS = Math.atan2(T.dy, T.dx), sg = T.cc ? -1 : 1;
        var tot = ((aS - aD) * sg + 4 * Math.PI) % (2 * Math.PI); if (T.g > 200 && tot < Math.PI) tot += 2 * Math.PI; if (!T.g) tot = 0;
        if (act) { x.strokeStyle = 'rgba(60,60,80,.55)'; x.lineWidth = 1.2; x.beginPath(); x.arc(qx, qy, rr, aD, aD + sg * Math.PI, sg < 0); x.stroke(); }
        for (var kk = 0; act && kk <= 12; kk++) { var ak = aD + sg * kk * Math.PI / 12, l1 = kk % 6 ? 5 : 9; x.beginPath(); x.moveTo(qx + Math.cos(ak) * rr, qy + Math.sin(ak) * rr); x.lineTo(qx + Math.cos(ak) * (rr - l1), qy + Math.sin(ak) * (rr - l1)); x.stroke(); }
        var uu = su(u), aE = aD + sg * tot * Math.min(1, uu * 1.6);
        if (act && tot > 0.01) { x.fillStyle = T.c; x.globalAlpha = 0.22; x.beginPath(); x.moveTo(qx, qy); x.arc(qx, qy, rr * 0.85, aD, aE, sg < 0); x.closePath(); x.fill(); x.globalAlpha = 1; }
        if (act && /escuadra|cartabón|recto/.test(T.e || '') && uu > 0.3) {
          var tl = rr * 1.25; x.strokeStyle = '#2C6FD1'; x.lineWidth = 2; x.fillStyle = 'rgba(44,111,209,.12)';
          x.beginPath(); x.moveTo(qx, qy); x.lineTo(qx + Math.cos(aD) * tl, qy + Math.sin(aD) * tl); x.lineTo(qx + Math.cos(aE) * tl, qy + Math.sin(aE) * tl); x.closePath(); x.fill(); x.stroke();
        }
        var fr = Math.min(1, Math.max(0, uu * 1.4 - 0.2)), ll = T.l * fr, ex = qx + T.dx * ll * s, ey = qy + T.dy * ll * s;
        x.strokeStyle = T.c; x.lineWidth = 3.2 * Math.max(0.6, s * 1.4);
        if (T.pl) { var np = parcial(T.pl, fr); camino(T.pl, Math.min(np, T.pl.length)); x.stroke(); ex = ox + T.pl[T.pl.length - 2] * s; ey = oy + T.pl[T.pl.length - 1] * s; ll = 0; }
        else { x.beginPath(); x.moveTo(qx, qy); x.lineTo(ex, ey); x.stroke(); }
        x.lineWidth = 1.2; x.strokeStyle = '#1F1B18'; var cmp = (T.cpx || 10) * 2 * s;
        for (var dd = cmp; dd < ll * s; dd += cmp) { var mx2 = qx + T.dx * dd, my2 = qy + T.dy * dd; x.beginPath(); x.moveTo(mx2 - T.dy * 5, my2 + T.dx * 5); x.lineTo(mx2 + T.dy * 5, my2 - T.dx * 5); x.stroke(); }
        x.font = '700 13px system-ui,sans-serif'; x.textAlign = 'center'; x.fillStyle = T.c; if (act) x.fillText(Math.round(T.g * 10) / 10 + '°', qx + Math.cos(aD + sg * tot / 2) * (rr + 16), qy + Math.sin(aD + sg * tot / 2) * (rr + 16) + 4);
        if (uu >= 1) { x.fillStyle = 'rgba(255,255,255,.92)'; var tw2 = x.measureText(T.cm).width + 10; x.fillRect(ex - tw2 / 2, ey - 22, tw2, 18); x.fillStyle = '#1F1B18'; x.fillText(T.cm, ex, ey - 8); }
        x.textAlign = 'left';
        if (act && T.e && uu > 0.3) { x.font = '600 12px system-ui,sans-serif'; x.fillStyle = '#2C6FD1'; x.fillText(T.e, qx + (T.cc ? -rr - 8 - x.measureText(T.e).width : rr + 10), qy - rr * 0.35); }
      }
      else if (T.k === 'r') {
        x.setLineDash([]); var R = Math.min(62, bh * 0.16), cx = bx + bw - R - 46, cy = by + bh * 0.42, g = T.g[0] + (T.g[1] - T.g[0]) * su(u);
        x.strokeStyle = '#9A8F84'; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2 - 1.25 * Math.PI, Math.PI / 2, false); x.stroke();
        x.fillStyle = '#6B625A'; x.font = '600 11px system-ui,sans-serif'; x.textAlign = 'center';
        [0, 45, 90, 135, 180, 225].forEach(function (k) { var ex = -Math.sin(k * Math.PI / 180), ey = Math.cos(k * Math.PI / 180); x.beginPath(); x.moveTo(cx + ex * R * 0.88, cy + ey * R * 0.88); x.lineTo(cx + ex * R, cy + ey * R); x.stroke(); x.fillText(k + '°', cx + ex * (R + 17), cy + ey * (R + 13) + 4); });
        x.strokeStyle = T.c; x.lineWidth = 4; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx - Math.sin(g * Math.PI / 180) * R, cy + Math.cos(g * Math.PI / 180) * R); x.stroke();
        x.fillStyle = T.c; x.font = '800 22px system-ui,sans-serif'; x.fillText(Math.round(g) + '°', cx, cy - R - 30); x.fillStyle = '#1F1B18'; x.font = '600 12px system-ui,sans-serif'; x.fillText(T.s, cx, cy + R + 32); x.textAlign = 'left';
      }
    });
    /* la tijera va encima de todo: recorre la línea de corte y, si se desgrafila, deja cortes en punta */
    cola.forEach(function (o) {
      var T = o[0], u = o[1], q = T.p; if (q.length < 4) return;
      x.strokeStyle = T.c; x.lineWidth = 3.4 * Math.max(0.6, s * 1.4); x.setLineDash([10, 6]); var n = parcial(q, u); camino(q, Math.min(n, q.length)); x.stroke(); x.setLineDash([]);
      var j = Math.min(q.length - 4, Math.max(0, n - 4)), ax = ox + q[j] * s, ay = oy + q[j + 1] * s, cx = ox + q[j + 2] * s, cy = oy + q[j + 3] * s, an = Math.atan2(cy - ay, cx - ax);
      if (T.g) { x.lineWidth = 2; for (var i = 0; i + 3 < Math.min(n, q.length); i += 2) { var mx = ox + (q[i] + q[i + 2]) / 2 * s, my = oy + (q[i + 1] + q[i + 3]) / 2 * s, pa = Math.atan2(q[i + 3] - q[i + 1], q[i + 2] - q[i]) + Math.PI / 2; x.beginPath(); x.moveTo(mx - Math.cos(pa) * 7, my - Math.sin(pa) * 7); x.lineTo(mx + Math.cos(pa) * 7, my + Math.sin(pa) * 7); x.stroke(); } }
      if (u <= 0 || u >= 1) return;
      var ab = 0.16 + 0.22 * (Math.sin(u * 90) + 1) / 2; x.save(); x.translate(cx, cy); x.rotate(an); x.strokeStyle = '#1F1B18'; x.fillStyle = '#1F1B18'; x.lineWidth = 3;
      [1, -1].forEach(function (sg) { x.save(); x.rotate(sg * ab); x.beginPath(); x.moveTo(-12, 0); x.lineTo(30, 0); x.stroke(); x.beginPath(); x.arc(-20, 0, 7, 0, 7); x.stroke(); x.restore(); });
      x.beginPath(); x.arc(0, 0, 2.5, 0, 7); x.fill(); x.restore();
    });
    x.restore(); return true;
  }

  /* Escenas listas para pintar: { R, escenas:[{…, anim:{crop,bg,tr}, fondo:dataURL}], preguntas, fondos } */
  function construir(id) {
    return fondos().then(function (F) {
      var E = escenas(id); if (!E) return null;
      E.fondos = F;
      E.escenas.forEach(function (e) { e.anim = { crop: RECORTE, bg: FONDO, tr: e.a.tr }; delete e.a; });
      return E;
    });
  }

  /* Igual que construir(), sin esperas: null si el motor 3D aún no está listo. */
  function construirYa(id) {
    var F = fondosYa(); if (!F) return null;
    var E = escenas(id); if (!E) return null;
    E.fondos = F;
    E.escenas.forEach(function (e) { e.anim = { crop: RECORTE, bg: FONDO, tr: e.a.tr }; delete e.a; });
    return E;
  }
  /* Fotograma final de una escena (JPEG) para el libro impreso. */
  function foto(e, w, cal) {
    var im = LIENZO[e.vista]; if (!im || !e.anim) return '';
    var c = e.anim.crop, h = Math.round(w * c[3] / c[2]), cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    pinta(cv.getContext('2d'), e.anim, im, 0, 0, w, h, 1);
    return cv.toDataURL('image/jpeg', cal || 0.8);
  }

  window.EU_DIAGRAMA = {
    ALTURAS: ALTURAS, RECETAS: RECETAS, VISTAS: VISTAS,
    receta: receta, desdeGuia: desdeGuia, libre: libre, construir: construir, fondos: fondos, pinta: pinta,
    construirYa: construirYa, fondosYa: fondosYa, foto: foto,
    /* código del reproductor para el curso descargado (sin dependencias) */
    js: function () { return 'window.CURSO_ANIM={pinta:(' + pinta.toString() + ')};'; }
  };
})();
