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
  /* modo revisión de Fátima: las notas «a validar» solo se ven si ella lo activa (localStorage eu_revision = 'si'); el alumno nunca las ve */
  function rev() { try { return localStorage.getItem('eu_revision') === 'si'; } catch (e) { return false; } }
  if (window.EU_DIAGRAMA) return;

  var CARA = Math.PI / 2, NUCA = -Math.PI / 2, IZQ = 0, DER = Math.PI;
  var COL = ['#B01E45', '#C96A1E', '#D9920E', '#18906A', '#2C6FD1', '#7A4BD1', '#8A1C6B'];
  /* Fondo del maniquí: gris perla (Fátima, 10-10-2026: premium «Medianoche y oro»; antes beis #F3EDE4) */
  var TINTA = '#1F1B18', ROJO = '#C0392B', VERDE = '#7CB342', CORTE = '#8A1C6B', FONDO = '#E6EAF1';

  /* Alturas de la guía del frente, medidas sobre el maniquí (ojos y = -0.06, cejas 0.13, boca -0.56). */
  var ALTURAS = {
    cejas: { n: 'bajo las cejas', y: 0.04 },
    ojo: { n: 'bajo el ojo', y: -0.17 },
    nariz: { n: 'bajo la nariz', y: -0.36 },
    labio: { n: 'bajo el labio', y: -0.66 },
    barbilla: { n: 'en la barbilla', y: -1.16 },
    rostro: { n: 'donde termina el rostro', y: -1.28 },
    cuello: { n: 'en el cuello', y: -1.62 },
    hombro: { n: 'más abajo del hombro', y: -1.78 }   /* 26-10-2026: cortes rectos largos (solo como largo, no como guía del frente) */
  };
  /* reparto de N capas de la nuca (abajo) a la coronilla (arriba) */
  function thCapa(z, n) { return 1.92 - z * Math.min(0.24, 1.5 / Math.max(1, n - 1)); }
  /* Recetas fijadas por Fátima por corte: { altura: 'cejas'|'ojo'|'nariz'|'rostro', punto: [x,y,z] }.
     Lo que no esté aquí se deduce del texto del corte o queda como ejemplo (y se dice en la narración). */
  var RECETAS = {};

  /* Cámaras: [azimut, elevación, distancia]; la cabeza es la misma en todos los cortes. */
  var VISTAS = { tres: [2.3, 0.45, 5.6], nuca: [Math.PI, 0.12, 5.4], lateral: [Math.PI / 2, 0.08, 5.6], frente: [0, 0.10, 5.6], arriba: [Math.PI, 1.0, 5.6], cenit: [Math.PI, 1.42, 5.6] };
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
  /* 31-10-2026 (Fátima, sus referencias de Pinterest: «se aparecen en vertical, como sujeta el cabello, y el movimiento que le da en
     vertical»): la misma regla 0–225°, pero el mechón se saca hacia el lado que SE VE en esa vista (en el plano de la imagen): de lado,
     hacia atrás o hacia la cara; atrás y de frente, hacia su lado. Antes el mechón se elevaba hacia la cámara y a 90° casi no se veía.
     lado: 1 o -1, por si la sección mira de frente a la cámara (entonces se saca a ese lado). */
  function dirEnPlano(vk, a, ph, th, g, lado) {
    var cam = CAM[vk].pos.clone().sub(a); cam.y = 0; if (cam.lengthSq() < 1e-6) cam.set(0, 0, 1); cam.normalize();
    var n = N(ph, th), f = V3(n.x, 0, n.z); if (f.lengthSq() < 1e-6) f.set(a.x, 0, a.z);
    f.sub(cam.clone().multiplyScalar(f.dot(cam)));
    if (f.lengthSq() < 0.1) { var der = V3(cam.z, 0, -cam.x), sx = pr(vk, a)[0] - pr(vk, V3(0, a.y, 0))[0]; var dsx = pr(vk, a.clone().add(der.clone().multiplyScalar(0.2)))[0] > pr(vk, a)[0] ? 1 : -1; f = der.multiplyScalar(dsx * (Math.abs(sx) > 4 ? (sx > 0 ? 1 : -1) : (lado || 1))); }
    f.normalize();
    var an = g * Math.PI / 180; return V3(0, -1, 0).multiplyScalar(Math.cos(an)).add(f.multiplyScalar(Math.sin(an))).normalize();
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
  /* 31-10-2026 (Fátima, su referencia del corte en vertical: «la sujeción del mechón cuando se corta en vertical»): los dos dedos
     que sujetan el mechón, paralelos a la línea donde se corta y del lado de la raíz; la tijera corta por fuera de los dedos.
     p0, p1: extremos de la línea de corte (pantalla); hr: dirección unitaria hacia la raíz. */
  /* 31-10-2026 (Fátima y sus referencias: «las líneas representan el cabello»): un cabello sale de la raíz, sigue la curva del
     cráneo y después va hacia donde se lleva (los dedos). Curva cuadrática en 3D raíz → (por el cráneo) → punta, pasada a pantalla
     con 9 puntos (todos los fotogramas del mismo tamaño). dFin: dirección unitaria final; L: largo. */
  function curvaCabello(vk, a, ph, th, dFin, L) {
    var tg = P(ph, Math.min(2.2, th + 0.06)).sub(P(ph, th)); if (tg.lengthSq() < 1e-9) tg = dFin.clone(); tg.normalize();
    return bezier(vk, a, a.clone().add(tg.multiplyScalar(L * 0.32)), a.clone().add(dFin.clone().multiplyScalar(L)), 8);
  }
  /* lo mismo para un segmento raíz→punta ya pasado a pantalla ([ax, ay, bx, by]): sale siguiendo el cráneo en (ph, th) */
  function curvaPantalla(vk, ph, th) {
    var p0 = pr(vk, P(ph, th)), p1 = pr(vk, P(ph, Math.min(2.2, th + 0.06))), tx = p1[0] - p0[0], ty = p1[1] - p0[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
    tx /= tl; ty /= tl;
    return function (sg) {
      var L = Math.sqrt((sg[2] - sg[0]) * (sg[2] - sg[0]) + (sg[3] - sg[1]) * (sg[3] - sg[1])), cx = sg[0] + tx * L * 0.32, cy = sg[1] + ty * L * 0.32, o = [];
      for (var i = 0; i <= 8; i++) { var u = i / 8; o.push(r1((1 - u) * (1 - u) * sg[0] + 2 * u * (1 - u) * cx + u * u * sg[2]), r1((1 - u) * (1 - u) * sg[1] + 2 * u * (1 - u) * cy + u * u * sg[3])); }
      return o;
    };
  }
  function mechonCurvo(f, t, c, w, extra) { return Object.assign({ k: 'mc', f: f, t: t, c: c, w: w || 1.4 }, extra || {}); }
  function dedos(p0, p1, hr, t, extra) {
    var tr = [];
    [12, 22].forEach(function (off, k) {
      var p = [r1(p0[0] + hr[0] * off), r1(p0[1] + hr[1] * off), r1(p1[0] + hr[0] * off), r1(p1[1] + hr[1] * off)];
      tr.push(linea(p, t, '#8A6650', 9, extra), linea(p, t, k ? '#E2B897' : '#D6A784', 6, extra));
    });
    return tr;
  }

  /* ───────────── la receta de un corte, desde los datos del motor ───────────── */
  /* Receta de un corte del catálogo (cabello: el elegido o el que mejor le va) */
  function receta(id, cab) {
    var CO = window.EU_CORTES, c = CO && CO.get(id); if (!c) return null;
    cab = cab || (c.mejor || [])[0];
    var R = desdeGuia(CO.guiaDe(id, cab), { id: id, n: c.n, fam: c.fam, cab: cab, d: c.d });
    /* Fátima, 15-10-2026: la línea final sale del resultado que ya está escrito en el catálogo (antes casi todos quedaban rectos) */
    if (R && !R.linea) R.linea = lineaTexto(c.n + ' · ' + ((CO.tecnica(id) || {}).resultado || '') + ' · ' + (c.d || ''));
    /* 26-10-2026 (Fátima): largo y flequillo del catálogo; en los cortes a 0° la pollina solo si el nombre la dice */
    if (R && c.largo) R.largo = c.largo;
    if (R && c.fleco) R.fleco = c.fleco;
    else if (R && R.nivelar && (/pollina/i.test(c.n) || c.fam === 'flequillos')) R.fleco = 'pollina';   /* el flequillo recto a 0° es una pollina recta */
    if (R && R.fleco === 'lado') { R.altura = 'ojo'; R.fuenteAltura = 'Fátima'; }
    else if (R && R.fleco === 'pollina') { R.altura = 'cejas'; R.fuenteAltura = 'Fátima'; }
    return R;
  }
  function lineaTexto(t) {
    t = ' ' + String(t || '').toLowerCase().replace(/flequillo rect\w*/g, '') + ' ';   /* el flequillo no es la línea de atrás */
    if (/ en (línea )?a[ .:,]| la a se lee/.test(t)) return 'a';
    if (/ en v[ .:,]/.test(t)) return 'v';
    if (/diagonal/.test(t)) return 'diag_delante';
    if (/ en u[ .:,]/.test(t) && !/redond/.test(t)) return 'u';   /* Fátima, 18-10-2026: la U es más honda que la redondeada */
    if (/redond|esfera| en u[ .:,]|curv/.test(t)) return 'redondeada';
    if (/recta|recto|maciz|cuadrad|blunt/.test(t)) return 'recta';
    return '';
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
    /* 26-10-2026 (Fátima: «si es un corte recto que no tiene pollina, el corte tiene que nivelarse con el corte de atrás; no emparejar
       desde la nariz, porque ahí estás sacando otro tipo de corte con pollina»): en los cortes todo a 0° sin altura escrita (o con
       pollina/flequillo), delante no se saca otra guía: se empareja con la línea de atrás (R.nivelar). Antes salía «bajo la nariz». */
    var cero0 = [p1.elevB, p2.elevB, p3.elevB, p3.elevF].every(function (a) { return pila(a).every(function (v) { return !+v; }); });
    var nivelar = cero0 && !fija.altura && !desg && (fuente === 'ejemplo' || /pollina|flequillo/i.test(todo));
    if (nivelar && fuente === 'ejemplo') fuente = 'nivelar';
    return {
      id: meta.id || 'guia', n: meta.n || String(g.nombre || 'Corte').split(' · ')[0], fam: meta.fam || '', cab: meta.cab || '', liso: liso, desg: desg, altura: alt, fuenteAltura: fuente, nivelar: nivelar,
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
  /* Formas de la línea de atrás (lámina de Fátima): el cabello cae natural y las secciones van paralelas a la línea.
     y(d): desplazamiento en pantalla de las puntas (d = 0 centro … 1 lados); th(d): forma de la sección; lat: se ve de perfil. */
  var FORMAS_ATRAS = {
    recta: { n: 'recta', y: function () { return 0; }, th: function () { return 0; } },
    redondeada: { n: 'redondeada', y: function (d) { return -46 * d * d; }, th: function (d) { return -0.22 * d * d; } },
    /* Fátima, 18-10-2026 (su referencia «cortes simétricos a cero grados»): la U es honda, casi tan larga en el centro como la V pero con la punta redonda */
    u: { n: 'en U', y: function (d) { return -130 * Math.pow(d, 1.6); }, th: function (d) { return -0.58 * Math.pow(d, 1.6); } },
    v: { n: 'en V', y: function (d) { return -110 * d; }, th: function (d) { return -0.5 * d; } },
    a: { n: 'en A (V invertida)', y: function (d) { return 62 * d - 20; }, th: function (d) { return 0.22 * d; } },
    diag_delante: { n: 'diagonal hacia delante', lat: 1, s: 1 },
    diag_atras: { n: 'diagonal hacia atrás', lat: 1, s: -1 }
  };
  function formaTh(linea, d) { var F = FORMAS_ATRAS[linea]; return F && F.th ? F.th(Math.abs(d)) : 0; }
  /* Guía de perfil para las diagonales: secciones diagonales, el cabello cae natural (0°) y las puntas siguen la diagonal */
  function escGuiaDiag(R) {
    var v = 'lateral', F = FORMAS_ATRAS[R.linea], tr = [], tips = [];
    function thd(w) { return 1.55 + 0.32 * (F.s > 0 ? 1 - w : w); }
    for (var j = 0; j < 3; j++) tr = tr.concat(lineas(tramos(v, function (u) { return [DER + 0.15 + u * 1.3, thd(u) - j * 0.22]; }, 24), [0.04 + j * 0.04, 0.16 + j * 0.04], j ? '#8E847A' : COL[0], j ? 2 : 3));
    for (var i = 0; i <= 7; i++) {
      var w = i / 7, ph = DER + 0.15 + w * 1.3, th = thd(w); if (!seVe(v, ph, th)) continue;
      var a = P(ph, th), b = a.clone().add(V3(0, -0.85, 0));
      tr.push(linea(plano([pr(v, a), pr(v, b)]), [0.3 + i * 0.03, 0.45 + i * 0.03], COL[0], 2.4)); tips.push(pr(v, b));
    }
    tr.push(tijera(plano(tips), [0.66, 0.95], CORTE, R.desg));
    tr.push(rotulo('Atrás · línea ' + F.n, COL[0], 0.04), rotulo('Secciones paralelas a la línea · el cabello cae natural (0°)', TINTA, 0.3), rotulo('Corte siguiendo la diagonal', CORTE, 0.66));
    return { v: v, tr: tr };
  }
  /* Dibujo de Fátima «Formas de dividir el cabello, parte de atrás»: raya central de la coronilla a la nuca y particiones
     horizontales que la cruzan, una por cada capa del corte (de abajo arriba). */
  function escParticion(R) {
    var v = 'nuca', tr = [], n = Math.max(2, Math.min(10, (R.capas.pila || []).length)), lin = n - 1;
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA, 0.12 + u * 1.86]; }, 30), [0, 0.15], TINTA, 4));
    tr.push(rotulo('Raya central: de la coronilla a la nuca', TINTA, 0));
    var ths = []; for (var k = 0; k <= n; k++) ths.push(1.95 - k * (1.55 / n));
    for (var j = 1; j <= lin; j++) { var th = ths[j], ta = 0.15 + 0.6 * (j - 1) / lin; tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA - 1.0 + u * 2.0, th]; }, 30), [ta, ta + 0.6 / lin], '#2C6FD1', 3.2)); }
    tr.push(rotulo(lin + ' particiones horizontales: ' + n + ' secciones de abajo arriba', '#2C6FD1', 0.15));
    for (var z = 0; z < n; z++) { var tc = (ths[z] + ths[z + 1]) / 2; [-1, 1].forEach(function (sg) { var ph = NUCA + sg * 0.45; if (seVe(v, ph, tc)) tr.push(chapa(pr(v, P(ph, tc)), z + 1, COL[z % 7], 0.78 + 0.02 * z)); }); }
    return { v: v, tr: tr };
  }
  /* una capa horizontal de la nuca: raya, mechones que suben a su elevación y el corte con la tijera */
  /* hasta (19-10-2026, Fátima: «desde donde se saca la guía, a un dedo, los demás mechones se cortan a esa misma línea»):
     altura de la línea de la guía; con 0° cada mechón baja hasta ella y se corta ahí */
  function capaHorizontal(v, th, g, c, ta, tb, ocultar, linea, hasta) {
    var tr = [], ext = ocultar ? { x: tb + 0.001 } : {}, tips = [];
    tr = tr.concat(lineas(tramos(v, function (u) { var d = u * 2 - 1; return [NUCA - 0.85 + u * 1.7, th + formaTh(linea, d)]; }, 30), [ta, ta + (tb - ta) * 0.2], c, 3));
    for (var i = 0; i <= 8; i++) {
      var ph = NUCA - 0.8 + i / 8 * 1.6, thi = th + formaTh(linea, (i - 4) / 4); if (!seVe(v, ph, thi)) continue;
      var a = P(ph, thi), ks = [];
      for (var k = 0; k <= 5; k++) { var b = hasta != null && !g ? V3(a.x * 1.02, Math.min(a.y - 0.1, hasta), a.z * 1.02) : a.clone().add(dirElev(ph, thi, g * k / 5).multiplyScalar(0.95)); ks.push([].concat(pr(v, a), pr(v, b))); }
      tr.push(mechon(ks, [ta + (tb - ta) * 0.2, ta + (tb - ta) * 0.6], c, 2.4, ext)); tips.push(ks[5].slice(2));
    }
    /* cuadrado: la línea de corte va recta; redondeado: la misma guía, la línea se lleva hacia delante (sube a los lados) */
    if (FORMAS_ATRAS[linea] && !FORMAS_ATRAS[linea].lat && tips.length > 2) {
      var mid = (tips.length - 1) / 2, yc = tips[Math.round(mid)][1];
      tips = tips.map(function (q, i) { var d = Math.abs(i - mid) / mid; return [q[0], r1(yc + FORMAS_ATRAS[linea].y(d))]; });
    }
    tr.push(tijera(plano(tips), [ta + (tb - ta) * 0.6, tb], c, false, ext));
    return tr;
  }
  function escGuia(R) {
    if (FORMAS_ATRAS[R.linea] && FORMAS_ATRAS[R.linea].lat) return escGuiaDiag(R);
    var v = 'nuca', g = R.guia.g, tr = capaHorizontal(v, 1.92, g, COL[0], 0.05, 0.95, false, R.linea, R.cero ? yGuia() : null);
    tr.push(rotulo('Guía en la nuca · ' + g + '°' + (FORMAS_ATRAS[R.linea] ? ' · línea ' + FORMAS_ATRAS[R.linea].n : ''), COL[0], 0.05), regla(0, g, [0.25, 0.6], COL[0]));
    if (R.cero) tr.push(rotulo('La guía se corta a un dedo: los demás mechones se cortan a esta misma línea', COL[0], 0.6));
    return { v: v, tr: tr };
  }
  /* altura de la línea de la guía de la nuca (el mechón de la guía, a 0°, baja 0.95 desde la nuca) */
  function yGuia() { return P(NUCA, 1.92).y - 0.95; }
  function lineaGuia(v, t0) {   /* la línea de la guía queda marcada mientras se cortan los demás mechones */
    var y = yGuia(), pts = [];
    for (var ph = NUCA - 0.8; ph <= NUCA + 0.81; ph += 0.1) { var a = P(ph, 1.92); pts.push(pr(v, V3(a.x * 1.02, y, a.z * 1.02))); }
    return [linea(plano(pts), [t0, t0 + 0.05], VERDE, 2.4, { d: 1 }), rotulo('Línea de la guía · un dedo', VERDE, t0)];
  }
  function escCapas(R) {
    var v = 'nuca', pila = R.capas.pila, n = pila.length || 7, tr = [], vert = R.capas.part === 'vertical' && !R.liso, hY = R.cero ? yGuia() : null;
    if (R.cero) tr = tr.concat(lineaGuia(v, 0));
    if (!vert) {
      for (var z = 0; z < n; z++) {
        var ta = z / n, tb = (z + 1) / n, g = pila[z] || 0;
        tr = tr.concat(capaHorizontal(v, thCapa(z, n), g, COL[z % 7], ta, tb, z < n - 1, R.linea, hY));
        tr.push(rotulo('Mechón ' + (z + 1) + ' · ' + g + '°', COL[z % 7], ta, z < n - 1 ? { x: tb } : {}), regla(z ? pila[z - 1] : 0, g, [ta, ta + (tb - ta) * 0.6], COL[z % 7], 'Elevación', z < n - 1 ? { x: tb } : {}));
      }
    } else {
      var secs = [-0.6, -0.3, 0, 0.3, 0.6];
      secs.forEach(function (d, s) {
        var ph = NUCA + d, ta = s / secs.length, tb = (s + 1) / secs.length, tips = [], ext = s < secs.length - 1 ? { x: tb } : {};
        tr = tr.concat(lineas(tramos(v, function (u) { return [ph, 0.5 + u * 1.45]; }, 24), [ta, ta + (tb - ta) * 0.2], '#8E847A', 2.4));
        for (var z = 0; z < n; z++) {
          var th = thCapa(z, n); if (!seVe(v, ph, th)) continue;
          var a = P(ph, th), nn = N(ph, th), ks = [];
          for (var k = 0; k <= 5; k++) { var gz = (pila[z] || 0) * k / 5 * Math.PI / 180, b = hY != null && !pila[z] ? V3(a.x * 1.02, Math.min(a.y - 0.1, hY + (FORMA_Y[R.linea] ? FORMA_Y[R.linea](Math.abs(d)) : 0)), a.z * 1.02) : a.clone().add(dirElev(ph, th, 0).multiplyScalar(Math.cos(gz) * 0.6).add(nn.clone().multiplyScalar(Math.sin(gz) * 0.6))); ks.push([].concat(pr(v, a), pr(v, b))); }
          tr.push(mechonCurvo(ks.map(curvaPantalla(v, ph, th)), [ta + (tb - ta) * 0.2, ta + (tb - ta) * 0.6], COL[z % 7], 2.2, ext)); tips.push(ks[5].slice(2));
          /* 31-10-2026 (Fátima: «cada capa es un mechón que estás sujetando a ese número de elevación, no una sola línea»; «el mechón
             cortado no debe desaparecer»): cabellos vecinos de la tajada vertical, paralelos, a la misma elevación (sábana); al terminar
             su sección, el mechón cortado cae a 0° con su largo y se queda en el maniquí, en su color, hasta el final */
          var vecinos = [[-0.03, 0], [0.03, 0], [0, -0.05], [0, 0.05], [-0.03, 0.05], [0.03, -0.05]];
          vecinos.forEach(function (o) {
            var pv = ph + o[0], tv = th + o[1]; if (!seVe(v, pv, tv)) return;
            var av = P(pv, tv), nv = N(pv, tv), kv = [];
            for (var k2 = 0; k2 <= 5; k2++) { var gv = (pila[z] || 0) * k2 / 5 * Math.PI / 180, bv = hY != null && !pila[z] ? V3(av.x * 1.02, Math.min(av.y - 0.1, hY + (FORMA_Y[R.linea] ? FORMA_Y[R.linea](Math.abs(d)) : 0)), av.z * 1.02) : av.clone().add(dirElev(pv, tv, 0).multiplyScalar(Math.cos(gv) * 0.6).add(nv.clone().multiplyScalar(Math.sin(gv) * 0.6))); kv.push([].concat(pr(v, av), pr(v, bv))); }
            tr.push(mechonCurvo(kv.map(curvaPantalla(v, pv, tv)), [ta + (tb - ta) * 0.2, ta + (tb - ta) * 0.6], COL[z % 7], 1.2, ext));
          });
          if (ext.x) { var cuelga = [].concat(pr(v, a), pr(v, hY != null && !pila[z] ? V3(a.x * 1.02, Math.min(a.y - 0.1, hY + (FORMA_Y[R.linea] ? FORMA_Y[R.linea](Math.abs(d)) : 0)), a.z * 1.02) : a.clone().add(dirElev(ph, th, 0).multiplyScalar(0.6)))); tr.push(mechon([cuelga, cuelga], [tb, tb + 0.001], COL[z % 7], 1.6)); }
        }
        tr.push(tijera(plano(tips), [ta + (tb - ta) * 0.6, tb], CORTE, R.desg, ext));
      });
      tr.push(rotulo('Secciones verticales · ' + pila.join(' · ') + '°', TINTA, 0), regla(0, Math.max.apply(null, pila), [0, 0.3], CORTE));
    }
    return { v: v, tr: tr };
  }
  function escLateral(R) {
    var v = 'lateral', tr = [], pila = (R.lateral && R.lateral.pila.length) ? R.lateral.pila : (R.frente.pila.length ? R.frente.pila : R.capas.pila);
    /* división de oreja a oreja: separa atrás y delante */
    tr = tr.concat(lineas(tramos(v, function (u) { return [DER + 0.12, u * 1.62]; }, 30), [0, 0.12], '#2C6FD1', 4.5));
    tr.push(rotulo('División de oreja a oreja', '#2C6FD1', 0));
    function referencias() { for (var r = 0; r < 5; r++) { var y = 0.15 - r * 0.22; tr.push(linea(plano([pr(v, V3(1.05, y, -0.15)), pr(v, V3(1.0, y, 1.9))]), [0.04 + r * 0.02, 0.14 + r * 0.02], VERDE, 2.5)); } tr.push(rotulo('Referencias horizontales hacia el rostro', VERDE, 0.04)); }
    /* corte básico (todo a 0°, Fátima 19-10-2026): solo el recto se corta en horizontal; cada mechón se baja a la línea de la guía y se corta en ella */
    if (R.cero) {
      var l0 = lineaDe(R), hz = l0 === 'recta', yL = yGuia(), Fy = FORMA_Y[l0];
      if (hz) referencias();
      var gl = []; for (var p2 = DER - 0.85; p2 <= DER + 0.13; p2 += 0.06) { var aG = P(p2, 1.4), dG = Math.abs(Math.atan2(Math.sin(p2 - NUCA), Math.cos(p2 - NUCA))) / Math.PI; gl.push(pr(v, V3(aG.x * 1.02, yL + Fy(dG), aG.z * 1.02))); }
      tr.push(linea(plano(gl), [0.12, 0.18], VERDE, 2.4, { d: 1 }), rotulo('Línea de la guía · un dedo', VERDE, 0.12), regla(0, 0, [0.16, 0.3], COL[0]));
      for (var s2 = 0; s2 < 4; s2++) {
        var ta2 = 0.18 + s2 * 0.2, tb2 = ta2 + 0.2, tp = [], col2 = COL[s2 % 7], raices = [];
        if (hz) { var thh = 1.3 - s2 * 0.2; tr = tr.concat(lineas(tramos(v, function (u) { return [DER - 0.8 + u * 0.8, thh]; }, 20), [ta2, ta2 + 0.04], TINTA, 3)); for (var i2 = 0; i2 <= 6; i2++) raices.push([DER - 0.78 + i2 * 0.13, thh]); }
        else { var phv = DER - 0.04 - s2 * 0.24; tr = tr.concat(lineas(tramos(v, function (u) { return [phv, 0.4 + u * 1.0]; }, 20), [ta2, ta2 + 0.04], TINTA, 3)); [0.55, 0.8, 1.05, 1.3].forEach(function (t3) { raices.push([phv, t3]); }); }
        raices.forEach(function (r) { if (!seVe(v, r[0], r[1])) return; var a = P(r[0], r[1]), dd = Math.abs(Math.atan2(Math.sin(r[0] - NUCA), Math.cos(r[0] - NUCA))) / Math.PI, b = V3(a.x * 1.02, Math.min(a.y - 0.1, yL + Fy(dd)), a.z * 1.02); tr.push(linea(plano([pr(v, a), pr(v, b)]), [ta2 + 0.03, ta2 + 0.1], col2, 2.4)); tp.push(pr(v, b)); });
        tp.sort(function (p, q) { return p[0] - q[0]; });
        if (tp.length > 1) tr.push(tijera(plano(tp), [ta2 + 0.1, tb2], CORTE, false));
      }
      tr.push(rotulo(hz ? 'Corte recto: secciones horizontales' : 'Secciones verticales, siguiendo la línea ' + (FORMAS_ATRAS[l0] ? FORMAS_ATRAS[l0].n : ''), ROJO, 0.18), rotulo('Cada mechón se baja a 0° hasta la línea de la guía y se corta ahí', CORTE, 0.3));
      return { v: v, tr: tr };
    }
    if (R.liso) {
      referencias();
      for (var h = 0; h < 5; h++) {
        var th = 0.95 + h * 0.17, ta = 0.18 + h * 0.15, tb = ta + 0.15, tips = [];
        tr = tr.concat(lineas(tramos(v, function (u) { return [DER - 0.75 + u * 0.75, th]; }, 20), [ta, ta + 0.04], TINTA, 3));
        for (var i = 0; i <= 5; i++) { var ph = DER - 0.7 + i * 0.13, a = P(ph, th), b = a.clone().add(V3(0, -0.85, 0)); tr.push(linea(plano([pr(v, a), pr(v, b)]), [ta + 0.03, ta + 0.08], ROJO, 2.2)); tips.push(pr(v, b)); }
        tr.push(tijera(plano(tips), [ta + 0.08, tb], CORTE, false));
      }
      tr.push(rotulo(R.libre ? 'Secciones horizontales' : 'Liso extremo: secciones horizontales', ROJO, 0.18));
      return { v: v, tr: tr };
    }
    if (R.punto) {
      referencias();
      var secs = [DER - 0.02, DER - 0.26, DER - 0.5, DER - 0.74];
      secs.forEach(function (ph, s) { tr = tr.concat(lineas(tramos(v, function (u) { return [ph, 0.3 + u * 1.25]; }, 20), [0.14 + s * 0.02, 0.2 + s * 0.02], TINTA, 3)); });
      var Pc = V3(R.punto[0], R.punto[1], R.punto[2]);
      secs.forEach(function (ph, s) { [0.55, 0.95, 1.35].forEach(function (th) { var a = P(ph, th), c = V3(a.x + 0.25, (a.y + Pc.y) / 2, (a.z + Pc.z) / 2); tr.push(linea(bezier(v, a, c, Pc, 20), [0.38 + s * 0.08, 0.6 + s * 0.08], ROJO, 2.2)); }); });
      var qP = pr(v, Pc); tr.push(chapa(qP, '', ROJO, 0.62), rotulo('Todos los mechones al mismo punto', ROJO, 0.38));
      tr.push(tijera(plano([pr(v, V3(Pc.x, Pc.y + 0.15, Pc.z - 0.5)), pr(v, V3(Pc.x, Pc.y + 0.15, Pc.z)), pr(v, V3(Pc.x, Pc.y + 0.15, Pc.z + 0.5))]), [0.86, 0.99], CORTE, R.desg));
      return { v: v, tr: tr };
    }
    /* Dibujo de Fátima («Forma lateral»): líneas horizontales que nacen en la línea azul y van hacia la cara, desde la coronilla
       hacia abajo, una por cada número escrito. Cada línea es el mechón que se lleva al frente: al cortarla aparece su número
       en la punta y la tijera corta la punta. Los números los pone quien hace el corte (ninguno es fijo). */
    var n = Math.max(1, Math.min(12, pila.length)), t0 = 0.12, t1 = 0.96;
    for (var k = 0; k < n; k++) {
      var th = 0.35 + (n > 1 ? k * (1.5 / (n - 1)) : 0.6), a = P(DER + 0.12, th), b = V3(a.x, a.y, 1.3);
      var ta = t0 + (t1 - t0) * k / n, tb = t0 + (t1 - t0) * (k + 1) / n, qa = pr(v, a), qb = pr(v, b), g = pila[k] || 0;
      tr.push(linea(plano([qa, qb]), [ta, ta + (tb - ta) * 0.5], VERDE, 3, { fl: 1 }));
      tr.push(tijera(plano([[qb[0], qb[1] - 16], [qb[0], qb[1] + 16]]), [ta + (tb - ta) * 0.5, tb], CORTE, false));
      tr.push({ k: 'n', x: qb[0] - 22, y: qb[1], s: String(g), c: k ? CORTE : VERDE, t: [ta + (tb - ta) * 0.5, 1] });
      tr.push(rotulo('Línea ' + (k + 1) + ' · ' + g + '°' + (k ? '' : ' · guía'), k ? CORTE : VERDE, ta, k < n - 1 ? { x: tb } : {}));
    }
    return { v: v, tr: tr };
  }

  /* Elevación vista en el plano del dibujo (como en los diagramas de Fátima): 0 cae, 90 sale hacia «hacia», 180 arriba */
  function dirPlano(hacia, g) { var a = g * Math.PI / 180; return V3(0, -1, 0).multiplyScalar(Math.cos(a)).add(hacia.clone().multiplyScalar(Math.sin(a))).normalize(); }
  /* Mechones numerados: se jala uno (o una pareja) cada vez a su elevación, se ve el número y se corta en la punta.
     raices: [[ph, th, dir]], devuelve trazos y puntas. */
  function jalar(v, grupos, t0, t1, alto, tit) {
    var tr = [], puntas = [], n = grupos.length;
    grupos.forEach(function (gr, k) {
      var ta = t0 + (t1 - t0) * k / n, tb = t0 + (t1 - t0) * (k + 1) / n, c = COL[k % 7], ext = k < n - 1 ? { x: tb } : {}, tips = [];
      gr.raices.forEach(function (r) {
        var a = P(r[0], r[1]), ks = [];
        for (var m = 0; m <= 5; m++) ks.push([].concat(pr(v, a), pr(v, a.clone().add(dirPlano(r[2], gr.g * m / 5).multiplyScalar(alto)))));
        tr.push(mechon(ks, [ta, ta + (tb - ta) * 0.5], c, 2.6, ext)); tips.push(ks[5].slice(2)); puntas.push(ks[5].slice(2));
        tr.push(Object.assign({ k: 'n', x: ks[5][2], y: ks[5][3], s: String(k + 1), c: c, t: [ta + (tb - ta) * 0.45, 1] }, ext));
        tr.push({ k: 'n', x: ks[0][0], y: ks[0][1], s: String(k + 1), c: c, t: [ta, 1] });
      });
      tips.forEach(function (q) { tr.push(tijera(plano([[q[0] - 14, q[1]], [q[0] + 14, q[1]]]), [ta + (tb - ta) * 0.55, tb], CORTE, false, ext)); });
      tr.push(rotulo(tit + ' · capa ' + (k + 1) + ' a ' + gr.g + '°', c, ta, ext), regla(k ? grupos[k - 1].g : 0, gr.g, [ta, ta + (tb - ta) * 0.5], c, 'Capa ' + (k + 1), ext));
    });
    return { tr: tr, puntas: puntas };
  }
  /* perímetro que nace en la guía y baja hacia los lados: recto (diagonal) o redondeado (curva) */
  function bajada(ad, recto) { return recto ? ad : 1 - Math.sqrt(Math.max(0, 1 - ad * ad)); }
  function escFrente(R) {
    var v = 'frente', tr = [], A = ALTURAS[R.altura], pf = R.frente.pila.length ? R.frente.pila : R.capas.pila, m = Math.max(2, Math.min(6, pf.length)), n = 2 * m - 1, abre = 1.05;
    tr = tr.concat(lineas(tramos(v, function (u) { return [CARA, 0.02 + u * 0.8]; }, 20), [0, 0.08], '#5B4B8A', 3));
    for (var k = 0; k < 4; k++) [-1, 1].forEach(function (sg) { tr = tr.concat(lineas(tramos(v, recta([CARA, 0.10 + k * 0.16], [CARA + sg * 1.15, 0.65 + k * 0.16]), 16), [0.04 + k * 0.03, 0.14 + k * 0.03], TINTA, 2.2)); });
    tr = tr.concat(lineas(tramos(v, function (u) { return [CARA - 1.2 + u * 2.4, 0.86]; }, 30), [0.14, 0.2], '#8E847A', 2, { d: 1 }));
    /* 26-10-2026 (Fátima): corte a 0° sin pollina → delante no hay guía: el cabello se peina desde la raya hacia los lados y se
       empareja con la línea que quedó atrás (yN). Con pollina (al ras de la ceja) o flequillo de lado (más abajo de los ojos, en
       triángulo), solo el centro va a su altura; los lados siguen emparejados con atrás. */
    var niv = !!R.nivelar, yN = niv ? yBase(R) + (FORMA_Y[lineaDe(R)] || FORMA_Y.recta)(1) : 0;
    if (niv) {
      tr.push(linea(plano([pr(v, V3(-1.5, yN, 1.0)), pr(v, V3(1.5, yN, 1.0))]), [0.18, 0.26], VERDE, 2.5, { d: 1 }));
      tr.push(rotulo('Línea de atrás: delante se empareja con ella', VERDE, 0.18), rotulo('Espiga diagonal arriba', TINTA, 0.04));
      if (R.fleco === 'pollina') tr.push(rotulo('Pollina al ras de la ceja', CORTE, 0.5));
      if (R.fleco === 'lado') tr.push(rotulo('Flequillo de lado: más abajo de los ojos, en triángulo', CORTE, 0.5));
    } else {
    /* la altura de la guía: línea de referencia sobre el rostro */
    tr.push(linea(plano([pr(v, V3(-1.15, A.y, 1.25)), pr(v, V3(1.15, A.y, 1.25))]), [0.18, 0.26], VERDE, 2.5, { d: 1 }));
    tr.push(rotulo('Guía ' + A.n, VERDE, 0.18), rotulo('Espiga diagonal arriba', TINTA, 0.04));
    }
    var tips = [], caida = R.forma === 'recto' ? 0 : 0.95, tipsF = [];
    for (var i = 0; i < n; i++) {
      var d = -abre + 2 * abre * i / (n - 1), ph = CARA + d, ad = Math.abs(d) / abre;
      if (R.liso) tr = tr.concat(lineas(tramos(v, function (u) { return [CARA - abre + u * 2 * abre, 0.9 + i * 0.06]; }, 20), [0.2 + i * 0.015, 0.3 + i * 0.015], ROJO, 2.2));
      else tr = tr.concat(lineas(tramos(v, function (u) { return [ph, 0.86 + u * 0.42]; }, 12), [0.2 + i * 0.015, 0.3 + i * 0.015], ROJO, 2.6));
      var a = P(ph, 1.28), tip = V3(a.x * 1.22, A.y - caida * Math.pow(ad, 1.35), Math.max(a.z, 0.2) + 0.55), c = V3(a.x * 1.1, (a.y + tip.y) / 2 + 0.25, a.z + 0.55), fleco = false;
      if (niv) {
        fleco = !!R.fleco && Math.abs(d) < 0.5;
        if (fleco) tip = V3(a.x * 1.1, R.fleco === 'lado' ? ALTURAS.ojo.y - 0.06 + (ALTURAS.nariz.y - ALTURAS.ojo.y + 0.06) * (0.5 - d) : ALTURAS.cejas.y - 0.06, Math.max(a.z, 0.2) + 0.5);
        else { var sg = d === 0 ? 1 : d > 0 ? 1 : -1; tip = V3(sg * Math.max(Math.abs(a.x) * 1.22, 1.22), yN, Math.max(a.z, 0.2) + 0.3); }
        c = V3((a.x + tip.x) / 2 * 1.1, (a.y + tip.y) / 2 + 0.25, a.z + 0.5);
      }
      tr.push(linea(bezier(v, a, c, tip, 22), [0.32 + i * 0.03, 0.55 + i * 0.03], fleco ? CORTE : ROJO, 2.6, { fl: 1 }));
      (fleco ? tipsF : tips).push(pr(v, tip));
    }
    if (niv && tipsF.length > 1) { tipsF.sort(function (p, q) { return p[0] - q[0]; }); tr.push(tijera(plano(tipsF), [0.6, 0.72], CORTE, false)); }
    if (niv) tips.sort(function (p, q) { return p[0] - q[0]; });
    tr.push(rotulo((R.liso ? (R.libre ? 'Secciones horizontales' : 'Liso extremo: secciones horizontales') : n + ' líneas verticales: de cada una sale su mechón'), ROJO, 0.2));
    /* dibujo de Fátima («Ejemplo»): cada línea lleva su número (centro = guía) y aparece cuando la tijera la corta */
    if (!R.cero) tips.forEach(function (q, i) { var k = Math.abs(i - (m - 1)), tc = 0.72 + 0.25 * i / Math.max(1, n - 1); tr.push({ k: 'n', x: q[0], y: q[1] + 18, s: String(pf[k] || 0), c: k ? CORTE : VERDE, t: [tc, 1] }); });
    if (niv) {   /* 26-10-2026: un lado y el otro, cada uno emparejado con atrás (sin cruzar la cara) */
      var xc = pr(v, V3(0, yN, 1))[0], izq = tips.filter(function (q) { return q[0] < xc; }), der = tips.filter(function (q) { return q[0] >= xc; });
      if (izq.length > 1) tr.push(tijera(plano(izq), [0.72, 0.84], CORTE, R.desg));
      if (der.length > 1) tr.push(tijera(plano(der), [0.85, 0.97], CORTE, R.desg));
      tr.push(rotulo((R.cero ? 'Corte recto a 0°: l' : 'L') + 'os lados se emparejan con la línea de atrás', CORTE, 0.72));
      return { v: v, tr: tr, banda: 1 };
    }
    tr.push(tijera(plano(tips), [0.72, 0.97], CORTE, R.desg), rotulo('Línea de corte ' + (R.forma === 'recto' ? 'recta' : 'en arco') + (R.desg ? ' · desgrafilado' : ''), CORTE, 0.72));
    return { v: v, tr: tr };
  }

  /* Pulir puntas: atrás y delante, solo la punta, para nivelar */
  function escPulir(R) {
    var v = 'lateral', tr = [], tips = [], yG = ALTURAS[R.altura].y, recto = R.forma === 'recto', yN = R.nivelar ? yBase(R) + (FORMA_Y[lineaDe(R)] || FORMA_Y.recta)(1) : null;   /* 30-10-2026: nivelado → delante a la línea de atrás */
    tr = tr.concat(lineas(tramos(v, function (u) { return [DER + 0.12, u * 1.62]; }, 30), [0, 0.08], '#2C6FD1', 3, { d: 1 }));
    for (var i = 0; i <= 9; i++) {
      var u = i / 9, delante = u < 0.45, ph = delante ? DER - 0.75 + u / 0.45 * 0.7 : DER + 0.2 + (u - 0.45) / 0.55 * 1.1, a = P(ph, delante ? 0.85 : 1.25);
      var w = delante ? u / 0.45 : 0, b = delante ? V3(1.05, yN != null ? yN : yG - 0.85 * bajada(w, recto), a.z + 0.15) : V3(a.x, -1.45, a.z);
      tr.push(linea(bezier(v, a, V3((a.x + b.x) / 2 + 0.15, (a.y + b.y) / 2, (a.z + b.z) / 2 + (delante ? 0.2 : 0)), b, 16), [0.08 + i * 0.03, 0.3 + i * 0.03], delante ? ROJO : '#8E847A', 2.2));
      tips.push(pr(v, b));
    }
    tips.sort(function (p, q) { return p[0] - q[0]; });
    tr.push(tijera(plano(tips), [0.6, 0.95], CORTE, false));
    tr.push(rotulo('Atrás y delante, nada más en la punta', TINTA, 0.08), rotulo('Pulir puntas para nivelar el cabello', CORTE, 0.6));
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
      var ta = 0.08 + 0.84 * z / n, tb = 0.08 + 0.84 * (z + 1) / n, d = tb - ta, sx = c.dir[0] * bx, sy = c.dir[0] * by - c.dir[1], sl = Math.sqrt(sx * sx + sy * sy) || 1, l = Math.min(260, c.largo * px), q = roots[z];
      sx /= sl; sy /= sl;
      /* guía fija que rodea el cráneo: el camino (arco + tramo recto) se pasa a la pantalla con la misma escala */
      var pl = null;
      if (c.camino) { pl = []; c.camino.forEach(function (Q) { var vx = Q[0] - c.raiz[0], vy = Q[1] - c.raiz[1]; pl.push(r1(q[0] + px * (vx * bx)), r1(q[1] + px * (vx * by - vy))); }); if (tips[0]) { pl[pl.length - 2] = tips[0][0]; pl[pl.length - 1] = tips[0][1]; } }
      tips.push(pl ? [pl[pl.length - 2], pl[pl.length - 1]] : [r1(q[0] + sx * l), r1(q[1] + sy * l)]);
      var tz = { k: 'i', x: q[0], y: q[1], dx: r1(sx * 1000) / 1000, dy: r1(sy * 1000) / 1000, l: r1(l), g: c.ang, e: c.escuadra, cm: EU_CALCULO_CAPILAR.fmt(c.largo) + ' cm', cpx: r1(px), cc: bx > 0 ? 1 : 0, t: [ta, ta + d * 0.55], c: COL[z % 7], x2: z < n - 1 ? tb + 0.02 : 0 };
      if (pl) tz.pl = pl; tr.push(tz);
      /* como en el frente y el lateral: una línea cada vez; la tijera corta solo la punta (1 o 2 dedos) y aparece su número */
      var tp = tips[z], ext = z < n - 1 ? { x: tb } : {};
      tr.push(tijera(plano([[tp[0] + sy * 16, tp[1] - sx * 16], [tp[0] - sy * 16, tp[1] + sx * 16]]), [ta + d * 0.6, tb], CORTE, R.desg));
      tr.push({ k: 'n', x: tp[0] + 30, y: tp[1] + 26, s: EU_CALCULO_CAPILAR.fmt(c.ang) + '°', c: z ? CORTE : VERDE, t: [ta + d * 0.6, 1] });
      tr.push(rotulo('Línea ' + (z + 1) + ' · ' + EU_CALCULO_CAPILAR.fmt(c.ang) + '° · ' + (z && c.guia === 'fija' ? 'se lleva a la guía (línea 1) y se empareja' : (z ? 'guía ' + (c.guia === 'movil' ? 'móvil' : c.guia) + ' · se corta 1 o 2 dedos' : 'guía · ' + (+c.ang ? 'se corta 1 o 2 dedos' : 'a un dedo'))), COL[z % 7], ta, ext));
    });
    tr.push(rotulo('Forma: ' + calc.forma + (rev() ? ' (a validar)' : ''), CORTE, 0.93));
    return { v: v, tr: tr };
  }
  /* Coronilla en triángulo (imagen «en triángulo» de Fátima): triángulo pequeño, base delante sin tocar los laterales
     de la frente y vértice en la coronilla; secciones oblicuas paralelas a un lado */
  var COR_V = [NUCA, 0.5], COR_B1 = [CARA + 1.1, 0.36], COR_B2 = [CARA - 1.1, 0.36];
  function escCoronilla(R) {
    var v = 'cenit', tr = [], g = R.coronilla.g, Vx = COR_V, B1 = COR_B1, B2 = COR_B2;
    [[B1, B2], [B2, Vx], [Vx, B1]].forEach(function (e) { tr = tr.concat(lineas(tramos(v, recta(e[0], e[1]), 26), [0, 0.12], ROJO, 4)); });
    for (var k = 1; k <= 4; k++) {
      var f = k / 5, p0 = recta(B1, B2)(f), p1 = recta(B2, Vx)(1 - f), ta = 0.14 + (k - 1) * 0.21, tb = ta + 0.21, d = tb - ta, c = COL[(k - 1) % 7], ext = k < 4 ? { x: tb } : {};
      var sec = tramos(v, recta(p0, p1), 16);
      tr = tr.concat(lineas(sec, [ta, ta + d * 0.3], '#8E847A', 2.2));
      sec.forEach(function (q) { tr.push(tijera(q, [ta + d * 0.35, tb], CORTE, R.desg, ext)); });
      /* el número aparece cuando la tijera corta esa sección */
      var m = recta(p0, p1)(0.5); if (seVe(v, m[0], m[1])) { var qm = pr(v, P(m[0], m[1])); tr.push({ k: 'n', x: qm[0], y: qm[1] - 16, s: g + '°', c: c, t: [ta + d * 0.6, 1] }); }
      tr.push(rotulo('Sección oblicua ' + k + ' · ' + g + '°', c, ta, ext));
    }
    tr.push(rotulo('Coronilla · triángulo pequeño', ROJO, 0), regla(0, g, [0.14, 0.3], CORTE, 'Coronilla'));
    return { v: v, tr: tr };
  }
  /* El triángulo visto de atrás: la V que baja del vértice de la coronilla y las secciones en espiga a cada lado de la raya.
     Cada sección lleva el número de su capa (los de atrás, los que pone quien hace el corte) y aparece al cortarla. */
  function escCoronillaAtras(R) {
    var v = 'nuca', tr = [], pila = R.capas.pila, n = Math.max(2, Math.min(6, pila.length));
    [[COR_V, [NUCA + 0.6, 0.3]], [COR_V, [NUCA - 0.6, 0.3]]].forEach(function (e) { tr = tr.concat(lineas(tramos(v, recta(e[0], e[1]), 20), [0, 0.1], ROJO, 4)); });
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA, COR_V[1] + u * (1.85 - COR_V[1])]; }, 24), [0.04, 0.12], '#5B4B8A', 3));
    tr.push(rotulo('Vértice de la coronilla · raya central', ROJO, 0));
    for (var k = 0; k < n; k++) {
      var th = COR_V[1] + 0.3 + (n - 1 - k) * (0.85 / (n - 1)), ta = 0.14 + 0.82 * k / n, tb = 0.14 + 0.82 * (k + 1) / n, d = tb - ta, g = pila[k] || 0, ext = k < n - 1 ? { x: tb } : {}, c = COL[k % 7];
      [1, -1].forEach(function (sg) {
        var a = [NUCA + sg * 0.85, th - 0.2], b = [NUCA + sg * 0.03, th + 0.06], sec = tramos(v, recta(a, b), 14);
        tr = tr.concat(lineas(sec, [ta, ta + d * 0.3], '#8E847A', 2.2));
        sec.forEach(function (q) { tr.push(tijera(q, [ta + d * 0.35, tb], CORTE, R.desg, ext)); });
        if (seVe(v, a[0], a[1])) { var qa = pr(v, P(a[0], a[1])); tr.push({ k: 'n', x: qa[0] + sg * 18, y: qa[1], s: g + '°', c: k ? CORTE : VERDE, t: [ta + d * 0.6, 1] }); }
      });
      tr.push(rotulo('Sección ' + (k + 1) + ' en espiga · ' + g + '°' + (k ? '' : ' · abajo'), c, ta, ext));
    }
    return { v: v, tr: tr };
  }
  /* Después de los laterales: se empareja a 0° (0° = hacia el suelo, sin elevar). El mechón de delante cae a 0° hasta la guía;
     un mechón de atrás se peina hacia delante, también cayendo a 0°, hasta la misma punta, y se corta solo lo que sobra. */
  function escEmparejar(R) {
    var v = 'lateral', tr = [], yG = ALTURAS[R.altura].y, red = R.emparejar === 'atras';
    if (R.nivelar) yG = yBase(R) + (FORMA_Y[lineaDe(R)] || FORMA_Y.recta)(1);   /* 30-10-2026: nivelado → la línea que quedó atrás */
    tr = tr.concat(lineas(tramos(v, function (u) { return [DER + 0.12, u * 1.62]; }, 30), [0, 0.1], '#2C6FD1', 4));
    tr.push(rotulo('División de oreja a oreja', '#2C6FD1', 0));
    /* delante: cae a 0° hasta la guía */
    var aF = P(DER - 0.4, 0.8), tip = V3(1.08, yG, aF.z + 0.1), qT = pr(v, tip);
    tr.push(linea(bezier(v, aF, V3((aF.x + tip.x) / 2 + 0.08, (aF.y + tip.y) / 2, (aF.z + tip.z) / 2), tip, 16), [0.08, 0.24], VERDE, 3));
    tr.push(chapa([qT[0] - 26, qT[1]], '0°', VERDE, 0.2), rotulo('Delante · 0°, cae al suelo hasta la guía', VERDE, 0.08));
    var aB = P(DER + 0.5, 0.85);
    /* 30-10-2026 (Fátima: «ya cortaste atrás, comienzas adelante y para terminar emparejas con el que quedó atrás; no puedes volver
       a cortar lo de atrás»): en todos los cortes el de delante se peina hacia atrás y solo se corta su punta. Antes, por defecto,
       el mechón de atrás se peinaba hacia delante y se volvía a cortar (quedaba trasquilado). */
    if (R.emparejar !== 'no') {
      /* emparejar atrás (corte redondo): atrás cae a 0°; el de delante se peina hacia atrás a 0°, sin elevar, y se une */
      var tA = V3(aB.x + 0.06, yG, aB.z - 0.05), qA = pr(v, tA), tF = V3(tA.x + 0.03, yG - 0.06, tA.z + 0.04);
      tr.push(linea(bezier(v, aB, V3((aB.x + tA.x) / 2 + 0.08, (aB.y + tA.y) / 2, (aB.z + tA.z) / 2), tA, 16), [0.28, 0.44], '#8E847A', 3));
      tr.push(chapa([qA[0] + 26, qA[1]], '0°', '#8E847A', 0.4), rotulo('Atrás · 0°, cae al suelo', '#8E847A', 0.28));
      var cF = V3((aF.x + tF.x) / 2 + 0.12, (aF.y + tF.y) / 2 - 0.05, (aF.z + tF.z) / 2);
      tr.push(linea(bezier(v, aF, cF, tF, 22), [0.46, 0.62], ROJO, 3), rotulo('Mechón de delante peinado hacia atrás a 0°, sin elevar', ROJO, 0.46));
      tr.push(tijera(plano([[qA[0] - 22, qA[1]], [qA[0] + 22, qA[1]]]), [0.66, 0.92], CORTE, false));
      tr.push(chapa([qA[0], qA[1] + 26], '=', CORTE, 0.82), rotulo('Se empareja con el de atrás: ' + (red ? 'corte redondo' : 'se corta solo la punta de delante'), CORTE, 0.66));
      return { v: v, tr: tr };
    }
    /* emparejar delante: el de atrás se peina hacia delante, cayendo a 0°, sin elevar */
    var tB = V3(tip.x + 0.03, yG - 0.06, tip.z - 0.04), cB = V3((aB.x + tB.x) / 2 + 0.12, (aB.y + tB.y) / 2 - 0.05, (aB.z + tB.z) / 2);
    tr.push(linea(bezier(v, aB, cB, tB, 22), [0.28, 0.56], ROJO, 3), chapa(pr(v, aB), 'atrás', ROJO, 0.28));
    tr.push(rotulo('Mechón de atrás peinado hacia delante a 0°, sin elevar', ROJO, 0.28));
    var qB = pr(v, tB);
    tr.push(chapa([qB[0] + 26, qB[1] + 6], '0°', ROJO, 0.5));
    /* se corta solo la punta que sobra, a la altura de la guía */
    tr.push(tijera(plano([[qT[0] - 22, qT[1]], [qT[0] + 22, qT[1]]]), [0.64, 0.92], CORTE, false));
    tr.push(chapa([qT[0], qT[1] + 26], '=', CORTE, 0.82), rotulo('Se empareja con el de delante: se corta solo la punta que sobra', CORTE, 0.64));
    return { v: v, tr: tr };
  }

  /* Error común en cabello liso extremo (Fátima): en vertical deja trasquilado; todas las capas se cortan en horizontal */
  function escErrorLiso(R) {
    var v = 'nuca', tr = [];
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA, 0.7 + u * 1.15]; }, 20), [0, 0.06], '#5B4B8A', 3));
    /* así no: secciones verticales y tijera en vertical */
    for (var k = 0; k < 4; k++) {
      var ph = NUCA - 0.16 - k * 0.2, ta = 0.06 + k * 0.07, sec = tramos(v, function (u) { return [ph, 0.85 + u * 0.95]; }, 14);
      tr = tr.concat(lineas(sec, [ta, ta + 0.05], ROJO, 2.4));
      sec.forEach(function (q) { tr.push(tijera(q, [ta + 0.05, ta + 0.1], ROJO, false, { x: 0.5 })); });
    }
    var qn = pr(v, P(NUCA - 0.45, 0.75)); tr.push(chapa(qn, 'NO', ROJO, 0.06));
    tr.push(rotulo('Así no: en liso extremo, cortar en vertical deja trasquilado', ROJO, 0.06, { x: 0.5 }));
    /* así sí: todas las capas en horizontal, de abajo arriba */
    for (var h = 0; h < 5; h++) {
      var th = 1.75 - h * 0.2, tb0 = 0.5 + h * 0.09, sh = tramos(v, function (u) { return [NUCA + 0.08 + u * 0.85, th]; }, 14);
      tr = tr.concat(lineas(sh, [tb0, tb0 + 0.04], VERDE, 2.6));
      sh.forEach(function (q) { tr.push(tijera(q, [tb0 + 0.04, tb0 + 0.09], CORTE, false)); });
    }
    var qs = pr(v, P(NUCA + 0.45, 0.75)); tr.push(chapa(qs, 'SÍ', VERDE, 0.5));
    tr.push(rotulo('Así sí: liso extremo, todas las capas en horizontal, de abajo arriba', VERDE, 0.5));
    return { v: v, tr: tr };
  }

  /* Error común en cabello mixto u ondulado (Fátima, 15-10-2026): en horizontal queda trasquilado; se corta en vertical (espejo de escErrorLiso) */
  function escErrorMixto(R) {
    var v = 'nuca', tr = [];
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA, 0.7 + u * 1.15]; }, 20), [0, 0.06], '#5B4B8A', 3));
    /* así no: secciones horizontales y tijera en horizontal */
    for (var h = 0; h < 4; h++) {
      var th = 1.75 - h * 0.22, ta = 0.06 + h * 0.07, sh = tramos(v, function (u) { return [NUCA - 0.08 - u * 0.85, th]; }, 14);
      tr = tr.concat(lineas(sh, [ta, ta + 0.05], ROJO, 2.4));
      sh.forEach(function (q) { tr.push(tijera(q, [ta + 0.05, ta + 0.1], ROJO, false, { x: 0.5 })); });
    }
    var qn = pr(v, P(NUCA - 0.45, 0.75)); tr.push(chapa(qn, 'NO', ROJO, 0.06));
    tr.push(rotulo('Así no: en cabello mixto u ondulado, cortar en horizontal deja trasquilado', ROJO, 0.06, { x: 0.5 }));
    /* así sí: secciones verticales, de abajo arriba */
    for (var k = 0; k < 5; k++) {
      var ph = NUCA + 0.16 + k * 0.17, tb0 = 0.5 + k * 0.09, sec = tramos(v, function (u) { return [ph, 0.85 + u * 0.95]; }, 14);
      tr = tr.concat(lineas(sec, [tb0, tb0 + 0.04], VERDE, 2.6));
      sec.forEach(function (q) { tr.push(tijera(q, [tb0 + 0.04, tb0 + 0.09], CORTE, false)); });
    }
    var qs = pr(v, P(NUCA + 0.45, 0.75)); tr.push(chapa(qs, 'SÍ', VERDE, 0.5));
    tr.push(rotulo('Así sí: cabello mixto u ondulado, secciones en vertical', VERDE, 0.5));
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
      lateral: { pila: (o.lateral && o.lateral.length ? o.lateral : frente).map(function (g) { return Math.max(0, Math.min(225, +g || 0)); }) },
      emparejar: o.emparejar === 'atras' || o.emparejar === 'no' ? o.emparejar : 'delante',
      guias: (o.guias || []).slice(), ref: o.ref === 'suelo' ? 'suelo' : 'craneo', medidas: o.medidas || null,
      fleco: o.fleco === 'lado' || o.fleco === 'pollina' ? o.fleco : '',
      coronilla: o.coronilla ? { g: Math.max(0, Math.min(225, +o.coronillaG || Math.max.apply(null, capas))) } : null
    };
  }

  function txt(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  /* Fátima, 10-10-2026 · CÓMO QUEDA el corte, antes y después, dando la vuelta a la cabeza (atrás, lateral, frente).
     El cabello largo (antes), la tijera siguiendo la línea del corte y el cabello cortado (después) con su sombreado.
     La forma sale de la línea del corte: recta (cuadrado), redonda, en U, en V, en A o en diagonal. */
  var FORMA_Y = { recta: function () { return 0; }, redondeada: function (d) { return 0.5 * d * d; }, u: function (d) { return 1.05 * Math.pow(d, 1.6); }, v: function (d) { return 0.9 * d; },
    a: function (d) { return -0.5 * d; }, diag_delante: function (d) { return -0.6 * d; }, diag_atras: function (d) { return 0.6 * d; } };
  function lineaDe(R) {
    if (FORMA_Y[R.linea]) return R.linea;
    var n = ' ' + String(R.n || '').toLowerCase() + ' ';
    if (/ en v |\bv\b/.test(n)) return 'v'; if (/redond| en u /.test(n)) return 'redondeada'; if (/ en a |invertid/.test(n)) return 'a';
    return 'recta';
  }
  /* Cortos de dama (19-10-2026, Fátima: «crea los cortes cortos que hay en Guías 3D»): el resultado sale corto, con la forma de su ficha.
     nuca: cuánto baja el cabello de la nuca por debajo del nacimiento; fleco: 'corto' (sobre la frente), 'cejas' (flequillo largo a la ceja)
     o 'no'; lado: hasta dónde llega junto a la cara. Sacado de las fichas de EU_CORTES («guía en la nuca pegada al nacimiento»,
     «la nuca guarda largo», «flequillo largo a la altura de la ceja»); los largos son a validar por Fátima. */
  var CORTOS = {
    pixie: { nuca: 0.05, fleco: 'corto', lado: 'ojo' },
    pixie_desfilado: { nuca: 0.05, fleco: 'corto', lado: 'ojo' },
    garzon: { nuca: 0.15, fleco: 'cejas', lado: 'nariz' },
    mixie: { nuca: 0.5, fleco: 'corto', lado: 'nariz' },
    box: { nuca: 0.3, fleco: 'no', lado: 'labio' }
  };
  function cortoDe(R) {
    if (CORTOS[R.id]) return CORTOS[R.id];
    var n = String(R.n || '').toLowerCase();
    if (/\(corto\)/.test(n)) return null;   /* las variantes «(corto)» a 0° tienen su propio largo */
    if (/pixie/.test(n)) return CORTOS.pixie; if (/garz[oó]n/.test(n)) return CORTOS.garzon; if (/mixie/.test(n)) return CORTOS.mixie; if (/\bbox\b/.test(n)) return CORTOS.box;
    return R.fam === 'cortos' ? CORTOS.pixie : null;
  }
  /* hasta dónde llega el cabello de atrás en el resultado */
  function yBase(R) {
    var C = cortoDe(R); if (C) return ALTURAS.labio.y - C.nuca;   /* el nacimiento de la nuca del maniquí queda a la altura del labio */
    if (R.largo && ALTURAS[R.largo]) return ALTURAS[R.largo].y;   /* 26-10-2026: cortes rectos largos (más abajo del hombro) */
    var todo0 = !((R.capas && R.capas.pila) || []).some(function (g) { return +g > 0; });
    return todo0 && /\(corto\)/i.test(R.n || '') ? ALTURAS.barbilla.y : todo0 ? ALTURAS.cuello.y : -1.45;
  }
  /* Fátima, 19-10-2026 (su imagen «para dibujar en el maniquí 5»: «se debe ver así»): en los cortes cortos, cómo queda de lado y atrás
     dibujado como su lámina: el cabello corto pegado a la cabeza en mechones con textura, la oreja descubierta (curva por encima),
     el flequillo hacia la cara y la nuca que baja en punta sobre el cuello, sombreada. Largos a validar por Fátima.
     2.ª corrección (Fátima: «se ve trasquilado»): más cabello, puntas emparejadas en las orillas, nuca en forma cuadrada sobre el cuello
     y de frente el cabello hasta las cejas */
  function escQuedaCorto(R, v, CT) {
    var tr = [], tips = [], YB = yBase(R), n = 0, ph, yOA = P(DER - 0.05, 1.56).y, yOM = P(DER - 0.05, 1.72).y, aE = Math.abs(Math.atan2(Math.sin(DER - 0.05 - NUCA), Math.cos(DER - 0.05 - NUCA)));   /* alto y medio de la oreja, ángulo de la oreja */
    function ang(q) { return Math.abs(Math.atan2(Math.sin(q - NUCA), Math.cos(q - NUCA))); }
    for (ph = -Math.PI; ph < Math.PI; ph += 0.016) {
      var a = ang(ph), jit = 0, lado = Math.sin(ph - NUCA) >= 0 ? 1 : -1, pts = [], th, thC, ext = null;
      if (!seVe(v, ph, 0.9) && !seVe(v, ph, 1.3)) { n++; continue; }
      /* curva por encima de la oreja: la misma del «Pixie corto · curva por encima de la oreja» (centro, ancho y alto) */
      var dO = Math.min(Math.abs(Math.atan2(Math.sin(ph - (DER - 0.05)), Math.cos(ph - (DER - 0.05)))), Math.abs(Math.atan2(Math.sin(ph - (IZQ + 0.05)), Math.cos(ph - (IZQ + 0.05)))));
      if (a < 1.3) thC = 1.5;                                                     /* nuca y detrás de la oreja: siguen hacia el cuello */
      else thC = 1.95;
      /* línea del corte de lado, seguida y pareja: detrás de la oreja a media oreja, curva por encima de la oreja
         (la misma U del «Pixie corto · curva por encima de la oreja») y delante sube hasta las cejas */
      var dE = a - aE, yL = a < 1.3 ? -9 : Math.abs(dE) < 0.28 ? yOA + (yOM - yOA) * Math.pow(Math.abs(dE) / 0.28, 2) : dE < 0 ? yOM : yOM + (ALTURAS.cejas.y + 0.02 - yOM) * Math.min(1, (dE - 0.28) / 0.4);
      var sw = a > 2.05 ? lado * 0.06 : a > 0.95 ? lado * 0.04 : 0;               /* el mechón se peina hacia delante */
      function pH(t2) { var u2 = t2 / thC; return P(ph + sw * u2 * u2, t2, 1.08 + 0.06 * Math.sin(Math.PI * Math.min(1, u2 * 1.2))); }
      for (th = 0.06; th <= thC + 1e-6; th += 0.07) {
        if (pH(th).y < yL) {   /* las puntas se emparejan: el último punto cae justo en la línea del corte */
          var lo3 = th - 0.07, hi3 = th; for (var b3 = 0; b3 < 12; b3++) { var m3 = (lo3 + hi3) / 2; if (pH(m3).y < yL) hi3 = m3; else lo3 = m3; }
          if (pts.length) pts.push(pr(v, pH(lo3))); break;
        }
        if (seVe(v, ph + sw * th / thC, th)) pts.push(pr(v, pH(th)));
      }
      if (a < 1.3) {                                                              /* nuca cuadrada: baja recta sobre el cuello y termina en línea */
        var f = 1 - a / 1.3, p1 = P(ph, 1.5, 1.08), yE = f > 0.3 ? YB - 0.4 : YB + 0.2 - 0.6 * (f / 0.3), sq = 0.62 + 0.38 * (1 - f);
        for (var s2 = 1; s2 <= 5; s2++) { var w = s2 / 5; pts.push(pr(v, V3(p1.x * (1 + (sq - 1) * w), p1.y + (yE - p1.y) * w, p1.z * (1 + (sq - 1) * w * 0.6)))); }
        ext = pts[pts.length - 1];
      }
      if (pts.length > 1) {
        var t0 = 0.08 + 0.5 * (n % 11) / 11;
        tr.push(linea(plano(pts), [t0, t0 + 0.2], '#2E1C12', 6));   /* base tupida: sin huecos */
        if (n % 3 === 1) tr.push(linea(plano(pts), [t0 + 0.02, t0 + 0.22], '#7A5236', 1.6));   /* mechones con textura */
        if (n % 7 === 1) tr.push(linea(plano(pts.slice(1)), [t0 + 0.1, t0 + 0.3], 'rgba(255,236,214,0.35)', 1.3));
        if (ext && seVe(v, ph, 1.3)) tips.push(ext);
      }
      n++;
    }
    /* sombreado de la nuca: rayitas cruzadas junto a las puntas, como en su lámina */
    tips.sort(function (p, q) { return p[0] - q[0]; });
    tips.forEach(function (p, i) { if (i % 4) return; var h = 16, d = 6; tr.push(linea(plano([[p[0] - d, p[1] - h], [p[0] + d, p[1]]]), [0.7, 0.85], '#2B2620', 1.3), linea(plano([[p[0] + d, p[1] - h], [p[0] - d, p[1]]]), [0.7, 0.85], '#2B2620', 1.3)); });
    if (tips.length > 2) tr.push(tijera(plano(tips), [0.72, 0.9], CORTE, R.desg));
    tr.push(rotulo(v === 'lateral' ? 'Cabello corto, tupido; de frente hasta las cejas' : 'Cabello corto, tupido, pegado a la cabeza', TINTA, 0.05));
    if (v === 'lateral') tr.push(rotulo('La oreja queda descubierta: curva por encima', TINTA, 0.35));
    tr.push(rotulo('La nuca termina en forma cuadrada sobre el cuello, puntas emparejadas', CORTE, 0.6), rotulo('Largos: a validar por Fátima', '#8A6D3B', 0.85));
    return { v: v, tr: tr, banda: 1 };
  }
  /* 25-10-2026 · cuánto más arriba termina cada capa respecto a la guía, peinada en su caída natural: el cabello baja por el cráneo
     hasta la nuca y desde ahí cuelga (b = ángulo de la raíz en el perfil, largo en cm, de EU_CALCULO_CAPILAR); el maniquí tiene el
     radio de la cabeza como unidad. null si todo va a 0° o no hay calculadora. */
  function difCapas(pl, R) {
    var CC = window.EU_CALCULO_CAPILAR; if (!CC || !CC.calcular || !(pl || []).some(function (g) { return +g > 0; })) return null;
    var med = CC.medidas ? Object.assign({}, CC.medidas(), R.medidas || {}) : null, cq = null;
    try { cq = CC.calcular({ capas: pl, guias: R.guias, ref: R.ref }, med); } catch (e) { cq = null; }
    var cs = cq && cq.capas || []; if (cs.length < 2) return null;
    var Rc = med ? med.contorno / (2 * Math.PI) : 8.9, b0 = cs[0].b;
    function fin(c) { var arco = Rc * Math.max(0, b0 - c.b); return c.largo <= arco ? Rc * Math.cos(c.b + c.largo / Rc) : Rc * Math.cos(b0) - (c.largo - arco); }
    var f0 = fin(cs[0]);
    return cs.map(function (c, i) { return { g: c.ang, t: i ? Math.max(0, (fin(c) - f0) / Rc) : 0 }; });
  }
  /* 25-10-2026 (Fátima, con su captura de «Línea por línea · atrás»: «así se debe visualizar; cuando el sistema ya realiza las capas se
     visualizan las líneas de cada capa; así de frente, dónde cae la primera capa, la segunda y la tercera, a la elevación que se le
     dio»): el resultado de los cortes con elevación, dibujado como esa escena. Cada capa sale de su partición en líneas finas que
     caen peinadas hasta su largo; donde termina cada capa, una línea de su color con «capa · grados». Sin tijera ni marcas encima. */
  function escQuedaLineas(R, v) {
    var tr = [], frente = v === 'frente', lin = lineaDe(R), FY = FORMA_Y[lin], YB = yBase(R), A = ALTURAS[R.altura] || ALTURAS.nariz, PELO = '#5A3A26';
    var pila = (frente && R.frente.pila.length ? R.frente.pila : R.capas.pila) || [0], n = Math.max(1, Math.min(7, pila.length)), dif = difCapas(pila, R) || [];
    function y0(ph) {
      var dd = Math.abs(Math.atan2(Math.sin(ph - NUCA), Math.cos(ph - NUCA))) / Math.PI, y = YB + FY(dd);
      /* de frente: la guía se nivela con el largo de atrás (R.nivelar) o se saca a su altura, más larga hacia atrás */
      if (frente && !R.nivelar) { var ad = Math.min(1, Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))) / 1.2); y = Math.max(y, A.y - (R.forma === 'recto' ? 0 : 0.95 * Math.pow(ad, 1.35))); }
      return y;
    }
    /* 26-10-2026 (Fátima: «ese corte es redondo, no cuadrado»): en línea recta, atrás y de lado, donde termina cada capa se ve una
       línea recta y horizontal (como yPlano de escQueda); antes la misma altura sobre la cabeza redonda se veía en arco, redonda */
    var Pc1 = P(NUCA, 1.35, 1.05);
    function yRecta(ph, y) {
      if (lin !== 'recta' || frente) return y;
      var b = P(ph, 1.35, 1.05), obj = pr(v, V3(Pc1.x * 1.03, y, Pc1.z * 1.03))[1], lo = y - 2, hi = Math.max(y, b.y);
      for (var it = 0; it < 22; it++) { var m = (lo + hi) / 2; if (pr(v, V3(b.x * 1.03, m, b.z * 1.03))[1] > obj) lo = m; else hi = m; }
      return (lo + hi) / 2;
    }
    function dentro(ph) {
      var dc = Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))), dn = Math.abs(Math.atan2(Math.sin(ph - NUCA), Math.cos(ph - NUCA)));
      return frente ? dc < 1.25 && dc > 0.05 : v === 'nuca' ? dn < 1.15 : dc > 0.5;
    }
    /* 25-10-2026 (Fátima: «se tiene que ver la técnica: la tijera cortando y la elevación con el reloj, como las otras animaciones; los
       botones no pueden tapar el resultado»; «en capas no se corta en horizontal: en vertical, salvo liso extremo»): en cada capa,
       primero el mechón llevado a su elevación con el reloj (transportador) y la tijera que corta la punta; después el cabello de esa
       capa cae a su largo. Las secciones van en vertical (en liso extremo, en horizontal). Sin etiquetas encima del cabello. */
    /* 26-10-2026 (Fátima: «se visualizan demasiado rápidas»; «no reflejan las líneas de cada mechón que se está agarrando al
       movimiento de esa elevación»; «mechón uno, mechón dos, mechón tres»): cada capa se corta MECHÓN POR MECHÓN, uno detrás de
       otro: el mechón (entre dos líneas de sección) se agarra y sube a su elevación con su reloj, la tijera lo corta y cae a su
       largo; después el siguiente. Como mucho 4 mechones por capa (se juntan secciones vecinas). La escena dura lo que piden sus
       mechones (MS por mechón, `dur`), así el libro, el curso y Guías 3D no la aceleran. */
    var ANCHO = 0.35, PORLADO = 2, MS = 3000, totM = 0;
    function rel(ph) { return Math.atan2(Math.sin(ph - (frente ? CARA : NUCA)), Math.cos(ph - (frente ? CARA : NUCA))); }
    /* 1 · los cabellos de cada capa, repartidos en mechones por las líneas de sección; un mechón nunca cruza la raya
       (hasta PORLADO mechones a cada lado). Las capas que no se ven desde esta vista no ocupan tiempo. */
    var CAPAS = [];
    /* 31-10-2026 (Fátima: «si ya cortaste atrás, ¿por qué vuelves a cortar con lo de adelante junto descontroladamente? en una
       peluquería eso no se hace así»): la línea azul de oreja a oreja (IZQ = 0, DER = π) separa las zonas. Primero se cortan
       TODAS las capas de atrás (sen ph < 0), de la nuca hacia arriba; después las de delante. Un mechón es de una sola zona. */
    ['atras', 'delante'].forEach(function (zona) {
    for (var z0 = 0; z0 < n; z0++) {
      var th0 = frente ? 0.16 + z0 * (0.7 / n) : thCapa(z0, n), bins = {}, grupos = [];
      for (var ph0 = -Math.PI; ph0 < Math.PI; ph0 += frente ? 0.025 : 0.045) {   /* 26-10-2026 (Fátima: «agrega más cabello, se ve pelona en el frente»): de frente, el doble de cabellos */
        if (!dentro(ph0) || !seVe(v, ph0, th0) || (Math.sin(ph0) < 0 ? 'atras' : 'delante') !== zona) continue;
        var bk = Math.floor(rel(ph0) / ANCHO); (bins[bk] = bins[bk] || []).push(ph0);
      }
      [function (k) { return k < 0; }, function (k) { return k >= 0; }].forEach(function (deLado, ld) {
        var ks = Object.keys(bins).map(Number).filter(deLado).sort(function (p, q) { return ld ? p - q : q - p; });
        var porG = Math.max(1, Math.ceil(ks.length / PORLADO)), gs = [];
        ks.forEach(function (bk, i) { var gi = Math.floor(i / porG); gs[gi] = (gs[gi] || []).concat(bins[bk]); });
        grupos = grupos.concat(gs);
      });
      if (grupos.length) CAPAS.push({ z: z0, th: th0, grupos: grupos, zona: zona });
    }
    });
    var BUN = P(frente ? CARA : NUCA, 0.2, 1.22);   /* moño con pinza en la coronilla, donde va el cabello que aún no se trabaja */
    /* 31-10-2026 (Fátima: «el maniquí tiene que aparecer con cabello, parejo, y luego van las divisiones»): primero se ve todo el
       cabello largo y suelto (hasta T_REC); en ese tiempo se marcan las divisiones (T_DIV) y después se recoge al moño lo que aún
       no se trabaja; el corte empieza en T0 */
    var T_DIV = 0.03, T_REC = 0.08, T0 = 0.12;
    var dt0 = 0.84 / Math.max(1, CAPAS.length), puestasQ = [], chapaZ = {}, colBase = null, COLX = RECORTE[0] + 58;   /* columna de chapas a la izquierda del maniquí (a la derecha va el reloj de la elevación) */
    /* las líneas se cortan donde hay un salto (no se unen por encima de la cara) */
    function tramosDe(q, gap) { q.sort(function (p, r) { return p[0] - r[0]; }); var o = [], t = []; q.forEach(function (x) { if (t.length && x[0] - t[t.length - 1][0] > gap) { o.push(t); t = []; } t.push(x); }); if (t.length) o.push(t); return o.filter(function (x) { return x.length > 1; }); }
    CAPAS.forEach(function (CP, ic) {
      var z = CP.z, g = pila[z] || 0, c = COL[z % 7], ta = T0 + dt0 * ic, th = CP.th, grupos = CP.grupos;
      var M = grupos.length, cortCapa = []; totM += M;
      var w = dt0 / M;
      grupos.forEach(function (lst, j) {
        var s0 = ta + w * j, tSube = [s0, s0 + w * 0.35], tCorta = [s0 + w * 0.35, s0 + w * 0.6], tCae = [s0 + w * 0.6, s0 + w], cortes = [], puntas = [];
        /* 26-10-2026 (Fátima, «paracludes»: «saca cada mechón vertical, se visualiza horizontal; corta en vertical, no en horizontal;
           no confundas al alumno»): salvo liso extremo, el mechón que se agarra es una sección VERTICAL (raíces una debajo de otra
           en la línea de sección del centro del grupo), sube a su elevación y la tijera corta en una línea vertical. */
        var vert = !R.liso, phC = lst[Math.floor(lst.length / 2)], colTh = [];
        if (vert) { var hc = (frente ? 1 : -1) * 0.5; for (var ci = 0; ci <= 9; ci++) { var tc = th + hc * ci / 9; if (tc > 0.08 && tc < 2.0 && seVe(v, phC, tc)) colTh.push(tc); } if (colTh.length < 2) vert = false; }
        /* 26-10-2026 (Fátima: «divide de oreja a oreja y echa ese cabello hacia la cara; saca cada mechón vertical, no en abanico;
           atrás, todo en partes verticales»): en secciones verticales el mechón se eleva en el plano vertical que mira a la vista
           (de frente, hacia la cara; atrás, hacia atrás), todos sus cabellos paralelos: así se ve vertical y no en abanico. */
        /* 31-10-2026: el mechón vertical se saca en el plano de la imagen (dirEnPlano), así se ve su elevación en cada vista */
        function dirV(a, gg) { return dirEnPlano(v, a, phC, th, gg, rel(phC) >= 0 ? 1 : -1); }
        function subeMechon(ph, thR, a, yf, vecino) {
          var Llar = Math.max(0.6, a.y - (YB - 0.7)), Lcor = Math.max(0.12, Math.min(Llar - 0.1, a.y - yf)), sube = [];
          Llar = Math.min(Llar, Lcor + 0.35);   /* el mechón agarrado, un poco más largo que donde se corta (no cruza la cara) */
          var D = vert ? function (gg) { return dirV(a, gg); } : function (gg) { return dirElev(ph, thR, gg); };
          /* 31-10-2026 (Fátima, sus referencias): cada cabello es una curva que sale de la raíz, sigue el cráneo y va a los dedos */
          for (var m = 0; m <= 5; m++) { var dm = D(g * m / 5); sube.push(curvaCabello(v, a, ph, thR, dm, Llar)); }
          var dg = D(g), corte1 = [].concat(pr(v, a), pr(v, a.clone().add(dg.clone().multiplyScalar(Lcor)))), corteC = curvaCabello(v, a, ph, thR, dg, Lcor);
          tr.push(mechonCurvo(sube, tSube, c, vecino ? 1.1 : 1.6, { x: tCorta[1] }));
          if (vecino) { var bajaV = []; for (var mv = 0; mv <= 5; mv++) { var dv = D(g * (1 - mv / 5)); bajaV.push(curvaCabello(v, a, ph, thR, dv, Lcor)); } tr.push(mechonCurvo([corteC, corteC], [tCorta[1], tCorta[1] + 0.001], c, 1.1, { x: tCae[0] }), mechonCurvo(bajaV, tCae, c, 1.1, { x: tCae[1] })); return; }   /* cabello vecino de la sábana: sube, se corta y cae con el mechón */
          tr.push(mechonCurvo([corteC, corteC], [tCorta[1], tCorta[1] + 0.001], c, 1.8, { x: tCae[0] }));
          /* 30-10-2026 (Fátima: «los mechones comienzan a desaparecer; el mechón que cortaste tiene que caer hacia la cara»): el mechón
             ya cortado baja desde su elevación hasta caer (de frente, hacia la cara) y ahí lo sigue el cabello que queda */
          var baja = []; for (var mb = 0; mb <= 5; mb++) { var db = D(g * (1 - mb / 5)); baja.push(curvaCabello(v, a, ph, thR, db, Lcor)); }
          tr.push(mechonCurvo(baja, tCae, c, 1.8, { x: tCae[1] }));
          puntas.push(corte1.slice(2));
        }
        /* la línea de la sección vertical, marcada en el cráneo con el color de la capa mientras se agarra y se corta */
        if (vert) tr.push(linea(plano(colTh.map(function (tc) { return pr(v, P(phC, tc, 1.05)); })), [s0, tCorta[1]], c, 4, { x: tCae[1] }));
        if (vert) colTh.forEach(function (tc) { var aC = P(phC, tc, 1.04 + 0.004 * z), yfC = Math.min(aC.y - 0.06, yRecta(phC, y0(phC) + ((dif[z] && dif[z].t) || 0))); subeMechon(phC, tc, aC, yfC);
          /* 31-10-2026 (Fátima: «las líneas, como si fueran cabello»): el mechón es una sábana de cabellos paralelos peinados hacia
             fuera, no un hilo: a cada raíz se suman los cabellos vecinos de la tajada, con el mismo largo */
          [-0.035, 0.035].forEach(function (dp) { if (seVe(v, phC + dp, tc)) subeMechon(phC + dp, tc, P(phC + dp, tc, 1.04 + 0.004 * z), yfC, true); });
        });
        /* los dedos sujetan el mechón en la línea donde se corta (del lado de la raíz); la tijera corta por fuera de los dedos */
        if (vert && puntas.length > 1) {
          var pS = puntas.slice().sort(function (p, q) { return p[1] - q[1]; }), rM = pr(v, P(phC, colTh[Math.floor(colTh.length / 2)], 1.04)), tM = pS[Math.floor(pS.length / 2)];
          var hx = rM[0] - tM[0], hy = rM[1] - tM[1], hl = Math.sqrt(hx * hx + hy * hy) || 1;
          tr = tr.concat(dedos(pS[0], pS[pS.length - 1], [hx / hl, hy / hl], [tSube[0] + (tSube[1] - tSube[0]) * 0.6, tCorta[0]], { x: tCae[0] }));
        }
        /* 31-10-2026 (Fátima: «se tiene que visualizar el cabello y sujetar el mechón que vas a agarrar en el maniquí; ahí sacas la
           guía de ese mechón y vas cortando»): el maniquí empieza con su cabello largo; el cabello de este mechón se ve largo desde
           el principio de la escena y deja de verse cuando se agarra (sube a su elevación en la mano); al caer, queda cortado a su
           largo. Así la forma del corte se va construyendo sobre el cabello. */
        var yLargo = YB - 0.7;
        lst.forEach(function (ph) {
          var a = P(ph, th, 1.04 + 0.004 * z), pts = [pr(v, a)], ult = a, dC = Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA)), lado = dC >= 0 ? 1 : -1;
          for (var t2 = th + 0.07; t2 <= (frente ? 1.28 : 1.36); t2 += 0.07) {
            var ph2 = frente && Math.abs(dC) < 0.62 ? CARA + lado * Math.min(0.62, Math.abs(dC) + (t2 - th) * 0.9) : ph;
            if (!seVe(v, ph2, t2)) break; var q2 = P(ph2, t2, 1.05 + 0.004 * z); if (q2.y < yLargo) break; pts.push(pr(v, q2)); ult = q2;
          }
          if (ult.y > yLargo) pts.push(pr(v, V3(ult.x * 1.03, yLargo, ult.z * 1.03)));
          /* 31-10-2026 (Fátima y sus referencias: lo que no se trabaja va recogido): hasta que empieza su capa, este cabello sube
             recogido al moño con pinza de la coronilla; al empezar su capa se suelta y cae largo; luego se agarra y se corta */
          var tSuelta = ic === 0 ? 0 : ta;
          if (tSuelta > 0) {
            if (pts.length > 1) tr.push(linea(plano(pts), [0, 0.001], '#8A6A52', 1.1, { x: T_REC }));   /* al principio, suelto y largo */
            tr.push(linea(bezier(v, a, P(ph, Math.max(0.12, th * 0.45), 1.14), BUN, 10), [T_REC, T_REC + 0.03], '#8A6A52', 1.0, { x: tSuelta }));
          }
          if (pts.length > 1) tr.push(linea(plano(pts), [tSuelta, tSuelta + 0.001], '#8A6A52', 1.1, { x: s0 }));
        });
        lst.forEach(function (ph) {
          var a = P(ph, th, 1.04 + 0.004 * z), yf = Math.min(a.y - 0.06, yRecta(ph, y0(ph) + ((dif[z] && dif[z].t) || 0))), pts = [pr(v, a)], ult = a;
          /* baja peinado por el cráneo hasta el borde y de ahí cae; de frente, el cabello de encima de la cara se abre desde la raya
             hacia los lados y cae por fuera del rostro (no tapa la cara) */
          var dC = Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA)), lado = dC >= 0 ? 1 : -1;
          for (var t2 = th + 0.07; t2 <= (frente ? 1.28 : 1.36); t2 += 0.07) {
            var ph2 = frente && Math.abs(dC) < 0.62 ? CARA + lado * Math.min(0.62, Math.abs(dC) + (t2 - th) * 0.9) : ph;
            if (!seVe(v, ph2, t2)) break; var q2 = P(ph2, t2, 1.05 + 0.004 * z); if (q2.y < yf) break; pts.push(pr(v, q2)); ult = q2;
          }
          var cae = V3(ult.x * 1.03, yf, ult.z * 1.03);
          if (ult.y > yf) pts.push(pr(v, cae));
          tr.push(linea(plano(pts), tCae, PELO, 1.3));
          cortes.push(pts[pts.length - 1]);
          /* el mechón, largo, se agarra y sube a su elevación; la tijera lo corta al largo de la capa y después cae
             (liso extremo: fila horizontal; las demás, la columna vertical de arriba) */
          if (!vert) subeMechon(ph, th, a, yf);
        });
        /* el reloj de ESTE mechón (su elevación) y su número en la franja de arriba, nunca encima del cabello */
        tr.push(regla(0, g, tSube, c, (CP.zona === 'atras' ? 'Atrás' : 'Delante') + ' · capa ' + (z + 1) + ' · mechón ' + (j + 1) + ' de ' + M + ' · ' + g + '°', { x: tCae[1] }));
        if (vert) { puntas.sort(function (p, q) { return p[1] - q[1]; }); tr.push(tijera(plano(puntas), tCorta, CORTE, R.desg, { x: tCae[0] + w * 0.1 }), linea(plano(puntas), [tCorta[0], tCorta[1]], CORTE, 3.2, { x: tCae[0] + w * 0.15 })); }   /* el corte, en una línea vertical */
        else tramosDe(puntas, 60).forEach(function (q) { tr.push(tijera(plano(q), tCorta, CORTE, R.desg, { x: tCae[0] + w * 0.1 })); });
        /* donde termina el mechón queda su línea, del color de la capa */
        tramosDe(cortes, 50).forEach(function (q) { tr.push(linea(plano(q), [tCae[1] - w * 0.1, Math.min(0.99, tCae[1] + 0.01)], c, 3)); });
        /* 30-10-2026 (Fátima: «que quede la línea en la elevación, en la numeración de ese mechón»): al terminar la capa, su número y
           sus grados se quedan junto a su línea de corte hasta el final */
        cortCapa = cortCapa.concat(cortes);
        /* 31-10-2026 (Fátima: «esos botones, capa 3 · 90°, capa 4 · 90°, tapan la visualización de cada capa; la elevación va al
           lado»): la chapa «capa · grados» va en una columna AL LADO del maniquí, a la altura media de su línea de corte, sin pisar
           otras chapas; sobre el cabello solo queda la línea de corte de la capa en su color. Una chapa por capa (la primera zona). */
        if (j === M - 1 && cortCapa.length && !chapaZ[z]) {
          /* en orden, como la cabeza: la capa 1 (nuca) a la altura de su línea y cada capa siguiente 56 px más arriba
             (en la hoja del libro, a menor escala, tampoco se pisan) */
          var yM = cortCapa.reduce(function (s, q) { return s + q[1]; }, 0) / cortCapa.length, ESP = 56;
          if (colBase == null) colBase = Math.max(70 + ESP * (n - 1), Math.min(690, yM));
          var qc = [COLX, Math.max(70, colBase - z * ESP)]; chapaZ[z] = 1; puestasQ.push(qc); tr.push(chapa(qc, (z + 1) + ' · ' + g + '°', c, Math.min(0.99, tCae[1])));
        }
      });
    });
    /* 31-10-2026 · el moño con su pinza se ve mientras quede cabello recogido (hasta que se suelta la última capa) */
    if (CAPAS.length > 1) {
      var qB = pr(v, BUN), anillo = [], tFinMono = T0 + dt0 * (CAPAS.length - 1);
      for (var ia = 0; ia <= 16; ia++) { var an = ia / 16 * Math.PI * 2; anillo.push(r1(qB[0] + Math.cos(an) * 15), r1(qB[1] + Math.sin(an) * 11)); }
      tr.push(linea(anillo, [T_REC + 0.02, T_REC + 0.021], '#5A3A26', 7, { x: tFinMono }), linea([qB[0] - 20, qB[1] - 4, qB[0] + 20, qB[1] + 4], [T_REC + 0.02, T_REC + 0.021], '#2F2F2F', 4, { x: tFinMono }));
    }
    /* la raya y las secciones: en vertical (en liso extremo, en horizontal entre capas) */
    tr = tr.concat(lineas(tramos(v, frente ? function (u) { return [CARA, u * 0.16]; } : function (u) { return [NUCA, 0.12 + u * 1.86]; }, 30), [T_DIV, T_DIV + 0.04], TINTA, 2.4));
    /* 31-10-2026 (Fátima): la línea azul de oreja a oreja que separa atrás y delante se ve toda la escena, encima del cabello */
    [DER, IZQ].forEach(function (phO) { tr = tr.concat(lineas(tramos(v, function (u) { return [phO, u * 1.62]; }, 30), [T_DIV, T_DIV + 0.04], '#2C6FD1', 3.4)); });
    /* 26-10-2026 (Fátima: «resalta la línea que divide, desde la nariz corrida hasta el cuello, más en negro»): de frente, la raya
       sigue por el centro de la cara hasta el cuello, en negro y más gruesa, encima de todo */
    /* 26-10-2026 (Fátima, «paracludes»: «bájala hasta donde termina el cuello, ahí también hay cabello; en la parte de atrás»):
       de frente y atrás, la línea negra del centro llega hasta el final del cuello (Y_FIN_CUELLO) */
    var Y_FIN_CUELLO = -1.9;
    if (frente || v === 'nuca') { var phR = frente ? CARA : NUCA, rC = []; for (var tR = 0; tR <= (frente ? 1.62 : 1.98); tR += 0.04) { if (seVe(v, phR, tR)) rC.push(pr(v, P(phR, tR, 1.06))); }
      var fR = P(phR, frente ? 1.62 : 1.98, 1.06); rC.push(pr(v, V3(fR.x, Y_FIN_CUELLO, fR.z)));
      tr.push(linea(plano(rC), [T_DIV, T_DIV + 0.04], '#000000', 3.4)); }
    if (R.liso) for (var zp = 0; zp < n - 1; zp++) {
      var thp = frente ? 0.16 + (zp + 0.5) * (0.7 / n) : (thCapa(zp, n) + thCapa(zp + 1, n)) / 2;
      tr = tr.concat(lineas(tramos(v, frente ? function (u) { return [IZQ - 0.12 + u * (Math.PI + 0.24), thp]; } : function (u) { return [NUCA - 1.45 + u * 2.9, thp]; }, 50), [T_DIV, T_DIV + 0.04], '#2C6FD1', 1.4, { d: 1 }));
    }
    else (frente ? [-1.05, -0.7, -0.35, 0.35, 0.7, 1.05] : [-2.8, -2.45, -2.1, -1.75, -1.4, -1.05, -0.7, -0.35, 0.35, 0.7, 1.05, 1.4, 1.75, 2.1, 2.45, 2.8]).forEach(function (o) {
      var ph0 = (frente ? CARA : NUCA) + o; if (!frente && Math.abs(Math.atan2(Math.sin(ph0 - CARA), Math.cos(ph0 - CARA))) < 0.5) return;
      tr = tr.concat(lineas(tramos(v, function (u) { return [ph0, 0.14 + u * 1.2]; }, 30), [T_DIV, T_DIV + 0.04], '#2C6FD1', 1.4, { d: 1 }));
    });
    if (!R.liso) tr.push(rotulo('Secciones verticales: el mechón se lleva a su elevación y se corta', '#2C6FD1', 0.02));
    var NOM = { recta: 'recta · cuadrado', redondeada: 'redonda', u: 'en U', v: 'en V', a: 'en A', diag_delante: 'diagonal hacia delante', diag_atras: 'diagonal hacia atrás' };
    tr.push(rotulo('Cómo queda · ' + (v === 'nuca' ? 'atrás' : v === 'lateral' ? 'de lado' : 'de frente') + ' · forma ' + NOM[lin], TINTA, 0),
      rotulo('Capas: ' + pila.slice(0, n).map(function (g, k) { return (k + 1) + ' · ' + g + '°'; }).join('   '), TINTA, 0.93));
    return { v: v, tr: tr, banda: true, dur: Math.max(24000, totM * MS) };
  }
  function escQueda(R, v) {
    var tr = [], lin = lineaDe(R), FY = FORMA_Y[lin], tips = [], k = 0, frente = v === 'frente', CT = cortoDe(R);
    /* Fátima, 18-10-2026: no todas se cortan con elevación; en los cortes todo a 0° (parejo) el maniquí lleva el cabello largo, hasta el cuello */
    var todo0 = !((R.capas && R.capas.pila) || []).some(function (g) { return +g > 0; }), corto0 = todo0 && /\(corto\)/i.test(R.n || ''), YB = yBase(R);
    /* 18-10-2026: la variante «(corto)» a 0° termina en la barbilla (la medida la acuerda quien corta; altura a validar por Fátima) */
    /* Fátima, 15-10-2026: la V (o la A) se alarga con el largo de la guía, como en sus técnicas en V y en punta;
       y el resultado usa las elevaciones del corte con el calculador que ya existe (EU_CALCULO_CAPILAR) */
    var CC = window.EU_CALCULO_CAPILAR, medQ = CC && CC.medidas ? Object.assign({}, CC.medidas(), R.medidas || {}) : null, profV = (lin === 'v' || lin === 'a' || lin === 'u') ? 0.6 * Math.min(2, Math.max(0.5, ((medQ && +medQ.guia) || 20) / 20)) : 0;
    /* Fátima, 10-10-2026: con pollina (guía bajo las cejas o «flequillo» en el nombre) o sin pollina, largo más abajo del rostro */
    var pollina = R.altura === 'cejas' || /flequillo|pollina|fleco/i.test(R.n || ''), yCejas = ALTURAS.cejas.y - 0.06, yLargo = corto0 || (todo0 && lin === 'recta') ? YB : Math.min(YB + FY(1) + 0.15, ALTURAS.rostro.y - 0.3);
    if (CT) { pollina = CT.fleco !== 'no'; if (CT.fleco === 'corto') yCejas = ALTURAS.cejas.y + 0.28; yLargo = Math.max(YB, ALTURAS[CT.lado].y); }
    /* 25-10-2026 (Fátima): la pollina va siempre al ras de la ceja o un poquito más abajo, nunca más arriba. Flequillo de lado
       (R.fleco = 'lado'): se saca más abajo de los ojos, en triángulo, y se peina de lado, sin dejar hueco. Los cortes con
       elevación tienen su propio resultado en líneas, capa por capa (escQuedaLineas). */
    if (R.fleco === 'lado') pollina = false; else if (R.fleco === 'pollina') pollina = true;
    var tipsL = [];
    /* flequillo de lado: nace junto a la raya de lado y cruza la frente; corto junto a la raya y, al otro lado, debajo del ojo */
    var phRaya = CARA + 0.3;
    function flecoLado(ph) {
      var sA = Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA)), u = Math.max(0, Math.min(1, (sA + 0.55) / 0.97)), yE = ALTURAS.ojo.y - 0.06 + (ALTURAS.nariz.y - ALTURAS.ojo.y + 0.06) * u, thE = 0.06, o = [];
      for (; thE < 2.1; thE += 0.02) if (P(ph, thE, 1.06).y < yE) break;
      var fuera = true;   /* 26-10-2026 (Fátima: «sin dejar huecos»): cada mechón nace en su sitio; antes todos salían de la raya y dejaban una cuña de cráneo */
      for (var w = 0; w <= 1.0001; w += 0.06) { var phW = fuera ? ph : phRaya + (ph - phRaya) * Math.pow(w, 0.7), thW = 0.06 + (thE - 0.06) * w; if (seVe(v, phW, thW)) o.push(pr(v, P(phW, thW, 1.06 + 0.06 * Math.sin(Math.PI * w)))); }
      return o;
    }
    /* altura a la que un mechón de atrás termina en la misma línea de pantalla que el del centro (corte recto visto de atrás) */
    var Pc0 = P(NUCA, 1.35, 1.05), yLin = pr(v, V3(Pc0.x * 1.02, YB, Pc0.z * 1.02))[1];
    function yPlano(bq, yObj) { if (yObj == null) yObj = yLin; var lo = YB - 0.85 - 2 * profV, hi = bq.y - 0.05; for (var it = 0; it < 22; it++) { var mid = (lo + hi) / 2; if (pr(v, V3(bq.x * 1.02, mid, bq.z * 1.02))[1] > yObj) lo = mid; else hi = mid; } return (lo + hi) / 2; }
    /* Fátima, 15-10-2026 (dibujo «visualizar en V el corte»): la V vista de atrás es un triángulo de lados rectos que acaba en punta;
       los lados cortos (4 dedos sobre el hombro), el centro largo según la guía */
    var xV0 = Pc0 && pr(v, V3(Pc0.x * 1.02, YB, Pc0.z * 1.02))[0], Pl = P(NUCA + Math.PI / 2, 1.35, 1.05), anchoV = Math.abs(pr(v, V3(Pl.x * 1.02, YB, Pl.z * 1.02))[0] - xV0) || 1,
      yPunta = Math.min(700, pr(v, V3(Pc0.x * 1.02, YB - 0.6 - profV, Pc0.z * 1.02))[1]), yLadoV = Math.max(pr(v, V3(Pl.x * 1.02, todo0 ? YB + 0.6 : -0.3, Pl.z * 1.02))[1], yPunta - (todo0 ? 1.6 : 2.4) * anchoV);
    /* Fátima, 18-10-2026: la V corta se queda; en la V de cabello largo (corte básico a 0°) los lados también caen largos, por debajo del hombro, y la punta queda abajo */
    /* de lado: extremos de la línea (atrás, en la nuca, y delante, junto a la oreja) para trazarla recta */
    var latRecta = null;
    if (v === 'lateral' && (lin === 'recta' || lin === 'diag_delante' || lin === 'diag_atras')) {
      var phF = [CARA + 0.6, CARA - 0.6].filter(function (q) { return seVe(v, q, 1.35); })[0];
      if (phF != null) { var dF = Math.abs(Math.atan2(Math.sin(phF - NUCA), Math.cos(phF - NUCA))) / Math.PI, PF = P(phF, 1.35, 1.05), qB = pr(v, V3(Pc0.x * 1.02, YB + FY(0), Pc0.z * 1.02)), qF = pr(v, V3(PF.x * 1.02, YB + FY(dF), PF.z * 1.02)); latRecta = [qB[0], qB[1], qF[0], lin === 'recta' ? qB[1] : qF[1]]; }
    }
    /* Fátima, 15-10-2026: de frente, más cabello en el maniquí (mechones más juntos cerca de la cara) para que se vea el resultado */
    for (var ph = -Math.PI; ph < Math.PI; ph += frente && Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))) < 1.2 ? 0.008 : 0.03) {
      var a = Math.atan2(Math.sin(ph - NUCA), Math.cos(ph - NUCA)), d = Math.abs(a) / Math.PI, cerca = Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))) < 0.55;
      if (!seVe(v, ph, 1.2) && !seVe(v, ph, 0.5)) continue;
      var sup = [], th;
      if (cerca) {
        var lado = Math.sin(ph - CARA) >= 0 ? 1 : -1, tf = [0.02 + (k++ % 9) * 0.004, 0.3];
        if (R.fleco === 'lado' && Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA)) < 0.56 && Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA)) > -0.55) { if (!frente) continue; var fl = flecoLado(ph); if (fl.length > 1) { tr.push(linea(plano(fl), [0.3, 0.5], '#3A2418', 5)); tipsL.push(fl[fl.length - 1]); } continue; }
        if (pollina) {  /* con pollina: el cabello de delante cae sobre la frente hasta abajo de las cejas */
          for (th = 0.12; th <= 1.6; th += 0.06) { var pf = P(ph, th, 1.05); if (pf.y < yCejas) break; if (seVe(v, ph, th)) sup.push(pr(v, pf)); }
          if (sup.length > 1) tr.push(linea(plano(sup), tf, '#3A2418', 5));
          /* corte parejo a 0°: a los lados de la pollina el cabello cae largo, por fuera de la cara */
          if (!todo0 || Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))) < 0.3) continue;
          sup = [];
        }
        /* sin pollina: raya en medio, el cabello se peina a los lados y cae largo, por fuera de la cara, más abajo del rostro */
        var qf = null, cap = [];
        /* de frente, el cabello cubre el cuero cabelludo desde la raya hasta el nacimiento del pelo (no se ve calva).
           Fátima, 18-10-2026: sin pollina el borde sobre la frente sube en arco desde la raya y baja hasta las sienes, como su foto «sin pollina, todo parejo» (antes era recto y parecía pollina) */
        if (frente && !pollina) { for (th = 0.06; th <= 1.4; th += 0.015) { var qc = [ph + lado * th * 0.06, th], pc = P(qc[0], qc[1], 1.05); var dC = Math.min(1, Math.abs(Math.atan2(Math.sin(qc[0] - CARA), Math.cos(qc[0] - CARA))) / 0.55); if (pc.y < ALTURAS.cejas.y + 0.16 + 0.44 * Math.sqrt(Math.max(0, 1 - dC * dC))) break; cap.push(pr(v, pc)); } if (cap.length > 1) tr.push(linea(plano(cap), tf, '#3A2418', 5)); }
        for (th = 0.12; th <= 1.0; th += 0.08) { var q0 = [ph + lado * (th - 0.12) * 0.9, th]; if (seVe(v, q0[0], q0[1])) { qf = P(q0[0], q0[1], 1.05); sup.push(pr(v, qf)); } }
        /* de lado, el cabello junto a la cara termina en la línea del corte (antes caía largo y dejaba un bloque oscuro junto al cuello en U, V y redonda) */
        var yFin = v === 'lateral' ? Math.max(yLargo, YB + FY(d) - (lin === 'a' ? profV * d : 0) + (d > 0.8 ? 0.15 : 0)) : yLargo;
        if (qf && latRecta) { var xq = pr(v, V3(qf.x * 1.12, YB, qf.z * 1.04))[0], fq = Math.max(0, Math.min(1, (xq - latRecta[0]) / ((latRecta[2] - latRecta[0]) || 1))), yT = latRecta[1] + (latRecta[3] - latRecta[1]) * fq, lo2 = YB - 2, hi2 = qf.y;
          for (var it2 = 0; it2 < 22; it2++) { var md = (lo2 + hi2) / 2; if (pr(v, V3(qf.x * 1.12, md, qf.z * 1.04))[1] > yT) lo2 = md; else hi2 = md; } yFin = (lo2 + hi2) / 2; }   /* de lado, también junto a la cara la línea queda recta */
        if (qf) { var ox = qf.x * 1.12, oz = qf.z * 1.04; for (var yy2 = qf.y - 0.1; yy2 >= yFin; yy2 -= 0.1) sup.push(pr(v, V3(ox, yy2, oz))); sup.push(pr(v, V3(ox, yFin, oz))); }
        if (sup.length > 1) tr.push(linea(plano(sup), tf, '#3A2418', 5));
        continue;
      }
      for (th = 0.12; th <= 1.35; th += 0.07) { if (seVe(v, ph, th)) sup.push(pr(v, P(ph, th, 1.05))); }
      var base = P(ph, 1.35, 1.05), visto = seVe(v, ph, 1.35);
      function cola(y) { var o = sup.slice(); if (visto) for (var yy = base.y; yy >= y; yy -= 0.08) o.push(pr(v, V3(base.x * 1.02, yy, base.z * 1.02))); if (visto) o.push(pr(v, V3(base.x * 1.02, y, base.z * 1.02))); return o; }
      /* Fátima, 18-10-2026: en el recto a 0° todo parejo, también delante (antes quedaba un dedo más corto y la línea verde hacía escalón) */
      var yC = Math.max(YB - 0.85, YB + FY(d) - (lin === 'v' ? profV * (1 - d) : lin === 'a' ? profV * d : 0)) + (d > 0.8 && !(todo0 && lin === 'recta') ? 0.15 : 0), largo = cola(Math.min(YB, -1.45) - 0.95), corto = cola(yC);
      /* Fátima, 15-10-2026: en «recta · cuadrado» la línea de atrás se ve recta y horizontal, con esquinas (antes salía en arco por la cabeza redonda) */
      if (lin === 'recta' && v === 'nuca' && visto) { yC = yPlano(base); corto = cola(yC); }
      /* Fátima, 18-10-2026 (su lámina «formas de atrás de cómo hacer un corte»): de lado, la línea recta se ve horizontal y las diagonales rectas, no en arco */
      if (v === 'lateral' && visto && latRecta) { var xs = pr(v, V3(base.x * 1.02, YB, base.z * 1.02))[0], fL = Math.max(0, Math.min(1, (xs - latRecta[0]) / ((latRecta[2] - latRecta[0]) || 1))); yC = yPlano(base, latRecta[1] + (latRecta[3] - latRecta[1]) * fL); corto = cola(yC); }
      /* Fátima, 18-10-2026 (su referencia «corte en U»): vista de atrás honda como la V, pero con el fondo redondo y los lados casi rectos */
      if (lin === 'u' && v === 'nuca' && visto) { var fU = Math.min(1, Math.abs(pr(v, V3(base.x * 1.02, YB, base.z * 1.02))[0] - xV0) / anchoV); yC = yPlano(base, yPunta + (yLadoV - yPunta) * 0.8 * (1 - Math.sqrt(Math.max(0, 1 - fU * fU)))); corto = cola(yC); }
      if (lin === 'v' && v === 'nuca' && visto) { var fV = Math.min(1, Math.abs(pr(v, V3(base.x * 1.02, YB, base.z * 1.02))[0] - xV0) / anchoV); yC = yPlano(base, yPunta + (yLadoV - yPunta) * fV); corto = cola(yC); }
      if (corto.length < 2) continue;
      tr.push(linea(plano(largo), [0.02, 0.28], '#3A2418', 5, { x: 0.5 }));
      tr.push(linea(plano(corto), [0.5, 0.72], '#3A2418', 5));
      if (k % 4 === 0) tr.push(linea(plano(corto.slice(Math.floor(corto.length * 0.15))), [0.74, 0.94], 'rgba(255,236,214,0.32)', 1.8));
      if (visto) tips.push(corto[corto.length - 1]);
      k++;
    }
    /* la tijera sigue la línea; si hay un hueco (la cara, de frente) va en dos tramos */
    tips.sort(function (p, q) { return p[0] - q[0]; });
    var tramo = [];
    tips.concat([null]).forEach(function (q) { if (q && (!tramo.length || q[0] - tramo[tramo.length - 1][0] < 60)) { tramo.push(q); return; } if (tramo.length > 2) tr.push(tijera(plano(tramo), [0.3, 0.5], CORTE, R.desg)); tramo = q ? [q] : []; });
    /* la forma final resaltada: atrás, la línea de en medio (raya) y flechas de caída hasta la línea del corte */
    if (tips.length > 2) {
      var fin = tips.slice().sort(function (p, q) { return p[0] - q[0]; });
      tr.push(linea(plano(fin), [0.74, 0.9], VERDE, 3, { d: 1 }));
      if (v === 'nuca') {
        var cen = fin.reduce(function (m, q) { return Math.abs(q[0] - 640) < Math.abs(m[0] - 640) ? q : m; }, fin[0]);
        tr.push(linea(plano([pr(v, P(NUCA, 0.15, 1.06)), pr(v, P(NUCA, 1.3, 1.06)), cen]), [0.72, 0.84], '#FFFFFF', 2.4, { d: 1 }));
        [0.15, 0.32, 0.5, 0.68, 0.85].forEach(function (f0, j) { var q = fin[Math.round(f0 * (fin.length - 1))]; tr.push(linea([q[0], q[1] - 120, q[0], q[1] - 12], [0.8 + j * 0.02, 0.9 + j * 0.02], '#2C6FD1', 2.4, { fl: 1 })); });
      } else if (v === 'lateral') {
        [0.2, 0.45, 0.7].forEach(function (f0, j) { var q = fin[Math.round(f0 * (fin.length - 1))]; tr.push(linea([q[0], q[1] - 110, q[0], q[1] - 12], [0.8 + j * 0.03, 0.9 + j * 0.03], '#2C6FD1', 2.4, { fl: 1 })); });
      }
    }
    /* capas: cada mechón elevado deja su largo más arriba (calculado con EU_CALCULO_CAPILAR); se marca dónde termina, de la nuca a la coronilla */
    var pilaQ = (R.capas && R.capas.pila) || [];
    if (!frente && CC && CC.calcular && pilaQ.some(function (g) { return g > 0; })) {
      var cq = null; try { cq = CC.calcular({ capas: pilaQ, guias: R.guias, ref: R.ref }, medQ); } catch (e) { cq = null; }
      var Rcm = medQ ? medQ.contorno / (2 * Math.PI) : 8.9, capQ = cq && cq.capas || [], p0y = capQ.length ? capQ[0].punta[1] : 0, yTop = P(NUCA, 0.12).y;
      var hechas = [];
      capQ.forEach(function (c, i) {
        var t = (c.punta[1] - p0y) / Math.max(0.1, Rcm - p0y); if (i === 0 || t < 0.06) return;   /* llega igual que la guía: no hace capa */
        t = Math.min(0.75, t); if (hechas.some(function (h) { return Math.abs(h - t) < 0.08; })) return; hechas.push(t); var pts = [];
        for (var ph = -Math.PI; ph < Math.PI; ph += 0.06) {
          if (Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))) < 0.55 || !seVe(v, ph, 1.2)) continue;
          var dd = Math.abs(Math.atan2(Math.sin(ph - NUCA), Math.cos(ph - NUCA))) / Math.PI, y0 = YB + FY(dd), yT = y0 + t * (yTop - y0), base = P(ph, 1.35, 1.05), q;
          if (yT <= base.y) q = V3(base.x * 1.03, yT, base.z * 1.03);
          else { for (var th = 1.35; th > 0.12; th -= 0.03) { q = P(ph, th, 1.07); if (q.y >= yT) break; } }
          pts.push(pr(v, q));
        }
        if (pts.length < 3) return;
        pts.sort(function (p, q) { return p[0] - q[0]; });
        var col = COL[i % 7], t0 = 0.8 + Math.min(0.12, i * 0.02);
        tr.push(linea(plano(pts), [t0, Math.min(0.97, t0 + 0.08)], col, 2.6, { d: 1 }), chapa(pts[pts.length - 1], 'Mechón ' + (i + 1) + ' · ' + c.ang + '°', col, t0));
      });
      if (capQ.length > 1) tr.push(rotulo('Líneas de color: largo de cada mechón elevado', TINTA, 0.8));
    }
    /* Fátima, 18-10-2026 (escalonado sin elevación): todo a 0°; la 1.ª línea de la nuca se corta medio dedo o un dedo, la 2.ª a dos dedos, la 3.ª a tres: cada línea más larga que la de abajo */
    if (!frente && todo0 && /escalonad/i.test(R.n || '')) {
      var yTopE = P(NUCA, 0.12).y;
      [[0.18, 'Línea 1 · ½ o 1 dedo'], [0.4, 'Línea 2 · 2 dedos'], [0.62, 'Línea 3 · 3 dedos']].forEach(function (q, i) {
        var pts = [];
        for (var ph = -Math.PI; ph < Math.PI; ph += 0.05) {
          if (Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))) < 0.55 || !seVe(v, ph, 1.2)) continue;
          var yT = YB + q[0] * (yTopE - YB), bq = P(ph, 1.35, 1.05), qq;
          if (yT <= bq.y) qq = V3(bq.x * 1.03, yT, bq.z * 1.03); else { for (var th = 1.35; th > 0.12; th -= 0.03) { qq = P(ph, th, 1.07); if (qq.y >= yT) break; } }
          pts.push(pr(v, qq));
        }
        if (pts.length < 3) return;
        pts.sort(function (p, o) { return p[0] - o[0]; });
        var col = COL[i % 7], t0 = 0.8 + i * 0.04;
        tr.push(linea(plano(pts), [t0, Math.min(0.97, t0 + 0.08)], col, 2.8, { d: 1 }), chapa(pts[Math.floor(pts.length * (v === "nuca" ? 0.6 : 0.4))], q[1], col, t0));
      });
      tr.push(rotulo('Todo a 0°: cada línea, más larga que la de abajo', TINTA, 0.8));
    }
    if (tipsL.length > 2) { tipsL.sort(function (p, q) { return p[0] - q[0]; }); tr.push(tijera(plano(tipsL), [0.5, 0.68], CORTE, false, { x: 0.7 }), linea(plano(seguida(tipsL)), [0.68, 0.8], ROJO, 6)); }   /* 26-10-2026 (Fátima): una línea roja que resalte la forma del flequillo de lado */
    var NOM = { recta: 'recta · cuadrado', redondeada: 'redonda', u: 'en U', v: 'en V', a: 'en A', diag_delante: 'diagonal hacia delante', diag_atras: 'diagonal hacia atrás' };
    tr.push(rotulo('Cómo queda · ' + (v === 'nuca' ? 'atrás' : v === 'lateral' ? 'lateral' : 'de frente') + ' · forma ' + NOM[lin], TINTA, 0),
      rotulo('Antes', '#8E847A', 0.02, { x: 0.3 }), rotulo('Se corta siguiendo la línea', CORTE, 0.3, { x: 0.5 }), rotulo('Después', VERDE, 0.5));
    if (frente && R.fleco === 'lado') tr.push(rotulo('Flequillo de lado: se saca en triángulo, más abajo de los ojos, y se peina de lado', TINTA, 0.5));
    else if (frente) tr.push(rotulo(CT ? (CT.fleco === 'corto' ? 'Corto · flequillo corto sobre la frente' : CT.fleco === 'cejas' ? 'Corto · flequillo largo a la altura de la ceja' : 'Corto · sin flequillo') : pollina ? 'Con pollina: por debajo de las cejas' : 'Sin pollina: raya en medio, largo por debajo del rostro', TINTA, 0.5));
    return { v: v, tr: tr };
  }
  /* 19-10-2026 (Fátima, su lámina de referencia: «que el motor dibuje de esta forma todo tipo de corte reutilizando el maniquí»):
     línea por línea, el cabello de cada sección como muchas líneas finas peinadas desde la raíz hasta donde se corta, con el
     mechón que se lleva a su elevación resaltado, su transportador y la tijera; lo cortado se queda dibujado y se ve el resultado.
     Sirve para cualquier corte porque todo sale de la receta: elevaciones, guía, línea de atrás y altura del frente. */
  /* corte recto (sin desgrafilar): la tijera recorre una línea seguida, sin saltos entre una punta y otra */
  function seguida(q) { return q.map(function (p, i) { var a = q.slice(Math.max(0, i - 3), i + 4); return [p[0], a.reduce(function (s2, o) { return s2 + o[1]; }, 0) / a.length]; }); }
  function escPeinado(R, v, calc) {
    var tr = [], frente = v === 'frente', lin = lineaDe(R), FY = FORMA_Y[lin], cero = !!R.cero, PELO = '#6B4A36';
    var pila = (frente && R.frente.pila.length ? R.frente.pila : R.capas.pila) || [0], n = Math.max(1, Math.min(7, pila.length));
    var YB = yBase(R), yTop = P(NUCA, 0.12).y, capQ = (calc && calc.capas) || [], p0y = capQ.length ? capQ[0].punta[1] : 0, Rcm = 8.9;
    try { var md = window.EU_CALCULO_CAPILAR.medidas(); if (md && md.contorno) Rcm = md.contorno / (2 * Math.PI); } catch (e) { }
    var A = ALTURAS[R.altura] || ALTURAS.nariz, CT = cortoDe(R), cdir = CAM[v].pos.clone(), dif = cero ? null : difCapas(pila, R);
    function yFin(z, ph) {   /* hasta dónde llega, ya cortado, el cabello de la línea z en el ángulo ph */
      var dd = Math.abs(Math.atan2(Math.sin(ph - NUCA), Math.cos(ph - NUCA))) / Math.PI, y0 = YB + FY(dd);
      if (frente) { var ad = Math.min(1, Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))) / 1.2); y0 = (CT ? Math.max(YB, ALTURAS[CT.lado].y) : A.y) - (R.forma === 'recto' || (cero && lin === 'recta') ? 0 : 0.95 * Math.pow(ad, 1.35)); }
      if (frente && R.nivelar) y0 = YB + FY(dd);   /* 25-10-2026 (Fátima): de frente se nivela con el de atrás, no se saca la guía arriba */
      if (cero || !pila[z] || !dif || !dif[z]) return y0;
      return y0 + dif[z].t;   /* 25-10-2026: cada capa termina donde la deja su elevación peinada en su caída (difCapas) */
    }
    function dentro(ph) {
      var dc = Math.abs(Math.atan2(Math.sin(ph - CARA), Math.cos(ph - CARA))), dn = Math.abs(Math.atan2(Math.sin(ph - NUCA), Math.cos(ph - NUCA)));
      return frente ? dc < 1.25 : v === 'nuca' ? dn < 1.05 : dc > 0.55;
    }
    var puestas = [], colP = null;   /* colP: columna de chapas al lado del maniquí */
    for (var z = 0; z < n; z++) {
      var g = cero ? 0 : (pila[z] || 0), c = COL[z % 7], ta = 0.04 + 0.92 * z / n, tb = 0.04 + 0.92 * (z + 1) / n, dt = tb - ta, ext = z < n - 1 ? { x: tb } : {};
      var th = frente ? 0.16 + z * (0.7 / n) : thCapa(z, n), tips = [], fuerte = null, mejor = 9, cortes = [], raices = [];
      for (var ph = -Math.PI; ph < Math.PI; ph += frente ? 0.06 : 0.055) {
        if (!dentro(ph) || !seVe(v, ph, th)) continue;
        var a = P(ph, th, 1.04), yf = Math.min(a.y - 0.06, yFin(z, ph)), cae = V3(a.x * 1.03, yf, a.z * 1.03);
        /* de frente, el cabello se peina por encima del cráneo hasta el borde y de ahí cae */
        var raiz = [pr(v, a)];
        if (frente) { for (var t2 = th + 0.08; t2 <= 1.28; t2 += 0.08) { if (!seVe(v, ph, t2)) break; var q2 = P(ph, t2, 1.05); if (q2.y < yf) break; raiz.push(pr(v, q2)); } }
        var ult = raiz[raiz.length - 1]; raices.push(pr(v, a));
        /* el mechón a su elevación, en el plano del dibujo (sin la parte que va hacia la cámara) */
        var de = dirElev(ph, th, g), vista = cdir.clone().sub(a).normalize(), enPlano = de.clone().sub(vista.clone().multiplyScalar(de.dot(vista)));
        var ks = [];
        if (g && enPlano.length() > 0.45) { for (var m = 0; m <= 5; m++) { var dm = dirElev(ph, th, g * m / 5); ks.push([].concat(pr(v, a), pr(v, a.clone().add(dm.multiplyScalar(0.95))))); } }
        else ks.push([].concat(ult, pr(v, cae)), [].concat(ult, pr(v, cae)));
        tr.push(mechon(ks, [ta, ta + dt * 0.45], c, 1.5, { x: tb }));
        tips.push(ks[ks.length - 1].slice(2));
        if (frente || yf < a.y - 0.12) { tr.push(linea(plano(raiz.concat([pr(v, cae)])), [ta + dt * 0.8, tb], PELO, 1)); cortes.push(pr(v, cae)); }
        var dCen = Math.abs(pr(v, a)[0] - (v === 'lateral' ? 560 : 640)); if (dCen < mejor * 100) { mejor = dCen / 100; fuerte = ks; }
      }
      if (!tips.length) continue;
      /* el mechón que se está llevando, resaltado */
      /* 31-10-2026 (Fátima: «no se puede tapar las líneas con los números de elevación»): con elevación, el grado solo en el reloj */
      if (fuerte) { tr.push(mechon(fuerte, [ta, ta + dt * 0.45], '#FFFFFF', 7, ext), mechon(fuerte, [ta, ta + dt * 0.45], c, 3.6, ext)); var qf = fuerte[fuerte.length - 1]; if (cero) tr.push(Object.assign({ k: 'n', x: qf[2], y: qf[3], s: z ? '=' : '1', c: c, t: [ta + dt * 0.45, 1] }, { x: tb })); }
      tips.sort(function (p, q) { return p[0] - q[0]; });
      var tramo = [];
      tips.concat([null]).forEach(function (q) { if (q && (!tramo.length || q[0] - tramo[tramo.length - 1][0] < 50)) { tramo.push(q); return; } if (tramo.length > 1) tr.push(tijera(plano(R.desg ? tramo : seguida(tramo)), [ta + dt * 0.5, ta + dt * 0.8], CORTE, R.desg, ext)); tramo = q ? [q] : []; });
      /* Fátima, 19-10-2026: en el resultado cada capa queda resaltada en su color, con su número y su elevación */
      if (cortes.length > 1) {
        cortes.sort(function (p, q) { return p[0] - q[0]; });
        var tc = [];
        cortes.concat([null]).forEach(function (q) { if (q && (!tc.length || q[0] - tc[tc.length - 1][0] < 50)) { tc.push(q); return; } if (tc.length > 1) tr.push(linea(plano(tc), [ta + dt * 0.8, tb], c, 2.6)); tc = q ? [q] : []; });
      }
      /* chapa «capa · grados» sin pisar las de otras capas (en los básicos todas acaban en la misma línea) */
      /* 31-10-2026 (Fátima: «los números tapan las líneas cuando se quiere ver cómo queda el corte»): la chapa va en la columna
         AL LADO del maniquí (como en «Cómo queda»), en orden de abajo arriba, nunca encima del cabello */
      var cand = cortes.length > 1 ? cortes : raices, qc = null;
      if (cand.length) {
        var yMp = cand.reduce(function (s3, q) { return s3 + q[1]; }, 0) / cand.length, ESPp = 56;
        if (colP == null) colP = Math.max(70 + ESPp * (n - 1), Math.min(690, yMp));
        qc = [RECORTE[0] + 58, Math.max(70, colP - z * ESPp)];
      }
      if (qc) { puestas.push(qc); tr.push({ k: 'n', x: qc[0], y: qc[1], s: (z + 1) + ' · ' + g + '°', c: c, t: [ta + dt * 0.85, 1] }); }
      tr.push(regla(z && !cero ? (pila[z - 1] || 0) : 0, g, [ta, ta + dt * 0.45], c, 'Línea ' + (z + 1), ext));
      tr.push(rotulo('Línea ' + (z + 1) + ' · ' + g + '°' + (cero ? (z ? ' · se baja a la guía y se corta en la misma línea' : ' · guía a un dedo') : (z ? '' : ' · guía')), c, ta, ext));
    }
    /* Fátima, 19-10-2026: «las divisiones de oreja a oreja y las particiones de atrás y de adelante nunca pueden desaparecer»:
       se dibujan encima de los mechones durante toda la escena, entre las dos líneas de oreja a oreja */
    var DIV = '#2C6FD1', t0 = [0, 0.03];
    tr = tr.concat(lineas(tramos(v, function (u) { var t = -1.62 + u * 3.24; return t < 0 ? [IZQ - 0.12, -t] : [DER + 0.12, t]; }, 90), t0, DIV, 3.6));
    tr = tr.concat(lineas(tramos(v, frente ? function (u) { return [CARA, u * 1.3]; } : function (u) { return [NUCA, 0.12 + u * 1.86]; }, 40), t0, TINTA, 3));
    for (var zp = 0; zp < n - 1; zp++) {
      var thp = frente ? 0.16 + (zp + 0.5) * (0.7 / n) : (thCapa(zp, n) + thCapa(zp + 1, n)) / 2;
      tr = tr.concat(lineas(tramos(v, frente ? function (u) { return [IZQ - 0.12 + u * (Math.PI + 0.24), thp]; } : function (u) { return [NUCA - 1.45 + u * 2.9, thp]; }, 50), t0, DIV, 2.2, { d: 1 }));
    }
    tr.push(rotulo((v === 'nuca' ? 'Atrás' : v === 'lateral' ? 'De lado' : 'De frente') + ' · línea por línea', TINTA, 0.97));
    return { v: v, tr: tr, banda: true };
  }
  /* 19-10-2026 (Fátima: «detalla la imagen y realiza ese mismo dibujo en el motor»): el pixie como en su referencia (lámina de otra
     autora, solo como guía del dibujo): herradura atrás, diagonal de lado con la nuca en secciones horizontales, la nuca entre los
     dedos y las secciones de arriba elevadas. Las elevaciones son las del pixie del sistema; el reparto de las secciones, a validar por Fátima. */
  function escPixieRef(R) {
    var pila = R.capas.pila, g0 = R.guia.g, L = [];
    /* б · atrás: raya central, herradura y línea de oreja a oreja */
    var v = 'nuca', tr = [];
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA, 0.22 + u * 1.43]; }, 30), [0.04, 0.22], TINTA, 3, { d: 1 }));
    [-1, 1].forEach(function (sg) { tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA + sg * u * 1.32, 0.22 + 1.43 * Math.pow(u, 0.75)]; }, 40), [0.26, 0.5], '#2C6FD1', 3.2, { d: 1 })); });
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA - 1.35 + u * 2.7, 1.65]; }, 40), [0.54, 0.72], '#18906A', 3.2, { d: 1 }));
    tr.push(rotulo('1 · Raya central: de la coronilla a la altura de las orejas', TINTA, 0.04), rotulo('2 · Herradura: de la coronilla a detrás de cada oreja', '#2C6FD1', 0.26), rotulo('3 · De oreja a oreja: separa la nuca', '#18906A', 0.54));
    [[NUCA, 0.9, 'Arriba · largo'], [NUCA + 1.05, 1.35, 'Lado'], [NUCA, 1.85, 'Nuca · corto']].forEach(function (q, i) { if (seVe(v, q[0], q[1])) tr.push(chapa(pr(v, P(q[0], q[1])), q[2], COL[[6, 4, 0][i]], 0.78)); });
    L.push({ tipo: 'pix_herradura', vista: v, t: 'Pixie · divisiones de atrás', texto: 'Atrás se divide así: la raya central, de la coronilla hasta la altura de las orejas; la herradura, que baja de la coronilla hasta detrás de cada oreja; y una línea de oreja a oreja que separa la nuca. Dentro de la herradura va el largo; fuera, el corto.', a: { v: v, tr: tr, banda: true } });
    /* в · de lado: diagonal de la coronilla a detrás de la oreja y la nuca en secciones horizontales */
    v = 'lateral'; tr = [];
    tr = tr.concat(lineas(tramos(v, recta([NUCA + 0.25, 0.3], [DER + 0.32, 1.55]), 40), [0.04, 0.2], '#2C6FD1', 3.2, { d: 1 }));
    tr.push(rotulo('Diagonal: de la coronilla a detrás de la oreja', '#2C6FD1', 0.04));
    var nS = 4, tips = [];
    for (var k = 0; k < nS; k++) {
      var th = 1.95 - k * 0.12, g = pila[Math.min(k, pila.length - 1)] || g0, c = COL[k % 7], ta = 0.24 + k * 0.16, tb = ta + 0.16, ext = {};
      tr = tr.concat(lineas(tramos(v, function (u) { return [DER + 0.8 + u * 0.85, th]; }, 20), [ta, ta + 0.03], c, 2.6));
      var tk = [];
      for (var i = 0; i <= 6; i++) { var ph = DER + 0.85 + i / 6 * 0.7; if (!seVe(v, ph, th)) continue; var a = P(ph, th), ks = []; for (var m = 0; m <= 5; m++) ks.push([].concat(pr(v, a), pr(v, a.clone().add(dirElev(ph, th, g * m / 5).multiplyScalar(0.85))))); tr.push(mechon(ks, [ta + 0.03, ta + 0.09], c, 2.4, ext)); tk.push(ks[5].slice(2)); }
      if (tk.length > 1) { tr.push(tijera(plano(tk), [ta + 0.09, tb], c, false, ext), chapa(tk[tk.length - 1], (k + 1) + ' · ' + g + '°', c, ta + 0.1)); }
      tr.push(regla(k ? pila[k - 1] || g0 : 0, g, [ta + 0.03, ta + 0.09], c, 'Nuca · sección ' + (k + 1), ext));
    }
    tr.push(rotulo('La nuca en secciones horizontales, de abajo arriba', TINTA, 0.24));
    L.push({ tipo: 'pix_lado', vista: v, t: 'Pixie · de lado', texto: 'De lado, la diagonal baja de la coronilla hasta detrás de la oreja. Debajo, la nuca se trabaja en secciones horizontales de abajo arriba: ' + pila.slice(0, nS).map(function (g, k) { return 'sección ' + (k + 1) + ' a ' + g + ' grados'; }).join(', ') + '.', a: { v: v, tr: tr, banda: true } });
    /* г · atrás: la nuca se toma entre los dedos y se corta en horizontal */
    v = 'nuca'; tr = [];
    tr = tr.concat(lineas(tramos(v, function (u) { return [NUCA - 1.35 + u * 2.7, 1.65]; }, 40), [0, 0.08], '#18906A', 3, { d: 1 }));
    var th2 = 1.85, tk2 = [];
    for (var j = 0; j <= 10; j++) { var ph2 = NUCA - 0.9 + j / 10 * 1.8; if (!seVe(v, ph2, th2)) continue; var a2 = P(ph2, th2), ks2 = []; for (var m2 = 0; m2 <= 5; m2++) ks2.push([].concat(pr(v, a2), pr(v, a2.clone().add(dirElev(ph2, th2, g0 * m2 / 5).multiplyScalar(0.55))))); tr.push(mechon(ks2, [0.1, 0.35], COL[0], 2.4)); tk2.push(ks2[5].slice(2)); }
    if (tk2.length > 1) {
      var yD = tk2.reduce(function (s2, q) { return s2 + q[1]; }, 0) / tk2.length - 18;
      tr.push(linea(plano([[tk2[0][0] - 30, yD], [tk2[tk2.length - 1][0] + 30, yD]]), [0.35, 0.45], '#C9A27E', 14), linea(plano([[tk2[0][0] - 30, yD + 22], [tk2[tk2.length - 1][0] + 30, yD + 22]]), [0.35, 0.45], '#C9A27E', 14));
      tr.push(tijera(plano(tk2.map(function (q) { return [q[0], yD + 34]; })), [0.5, 0.9], CORTE, false), chapa([tk2[tk2.length - 1][0] + 40, yD + 11], '1 · ' + g0 + '°', COL[0], 0.36));
    }
    tr.push(rotulo('La nuca entre los dedos · guía a ' + g0 + '°', COL[0], 0.1), rotulo('Se corta en horizontal, por debajo de los dedos', CORTE, 0.5), regla(0, g0, [0.1, 0.35], COL[0], 'Guía de la nuca'));
    L.push({ tipo: 'pix_dedos', vista: v, t: 'Pixie · la nuca entre los dedos', texto: 'La primera sección de la nuca es la guía: se toma entre los dedos, elevada a ' + g0 + ' grados, y se corta en horizontal por debajo de los dedos.', a: { v: v, tr: tr, banda: true } });
    /* arriba: secciones de la frente a la coronilla, elevadas */
    v = 'lateral'; tr = [];
    var nA = 4, fw = P(CARA, Math.PI / 2).normalize();
    function arco(off) { var a = P(DER, 1.25).add(fw.clone().multiplyScalar(off)), b = P(IZQ, 1.25).add(fw.clone().multiplyScalar(off)); return function (u) { return sph(a.clone().lerp(b, u)); }; }
    for (var q = 0; q < nA; q++) {
      var off = 0.55 - q * 0.32, gq = pila[Math.min(pila.length - 1, 3 + q)] || 90, cq = COL[(3 + q) % 7], taq = 0.06 + q * 0.22, tbq = taq + 0.22, tkq = [], f = arco(off);
      tr = tr.concat(lineas(tramos(v, f, 30), [taq, taq + 0.03], cq, 2.6, { d: 1 }));
      for (var i3 = 0; i3 <= 8; i3++) { var c3 = f(0.22 + i3 / 8 * 0.28); if (!seVe(v, c3[0], c3[1])) continue; var a3 = P(c3[0], c3[1]), n3 = N(c3[0], c3[1]), ks3 = []; for (var m3 = 0; m3 <= 5; m3++) { var w3 = Math.sin(gq * m3 / 5 * Math.PI / 180); ks3.push([].concat(pr(v, a3), pr(v, a3.clone().add(V3(0, -1, 0).multiplyScalar(1 - w3).add(V3(0, 1, -0.3).multiplyScalar(w3)).add(n3.clone().multiplyScalar(0.25 * w3)).normalize().multiplyScalar(0.5))))); } tr.push(mechon(ks3, [taq + 0.03, taq + 0.1], cq, 2.4)); tkq.push(ks3[5].slice(2)); }
      if (tkq.length > 1) { tkq.sort(function (p1, p2) { return p1[0] - p2[0]; }); tr.push(tijera(plano(tkq), [taq + 0.1, tbq], cq, R.desg), chapa(tkq[0], (q + 5) + ' · ' + gq + '°', cq, taq + 0.12)); }
      tr.push(regla(q ? gq : (pila[2] || 75), gq, [taq + 0.03, taq + 0.1], cq, 'Arriba · sección ' + (q + 1), q < nA - 1 ? { x: tbq } : {}));
    }
    tr.push(rotulo('Arriba: secciones de la frente a la coronilla, elevadas', TINTA, 0.06));
    L.push({ tipo: 'pix_arriba', vista: v, t: 'Pixie · arriba', texto: 'Arriba, dentro de la herradura, el cabello se toma en secciones de la frente a la coronilla y cada una se eleva y se corta: ' + pila.slice(3, 3 + nA).map(function (g, k) { return 'sección ' + (k + 1) + ' a ' + g + ' grados'; }).join(', ') + '.', a: { v: v, tr: tr, banda: true } });
    return L;
  }
  /* 19-10-2026 (Fátima: «crea el verdadero pixie corto»): se deja mínimo dos dedos de la raíz. Primero se saca la forma
     (en U, en V o cuadrada), desde ahí la guía a dos dedos, luego el cabello se eleva en vertical y se corta a dos dedos,
     y al final se ve cada capa como quedó. Escenas aparte: las del pixie de antes no se tocan. */
  function escPixieCorto(R) {
    var YFL = ALTURAS.ojo.y * 0.35 + ALTURAS.nariz.y * 0.65, L = [], DOS = 0.36, TRES = 0.54, PR = CARA + 0.32, ROJ = CORTE, FORMAS = [['u', 'En U', COL[2]], ['v', 'En V', COL[4]], ['recta', 'Cuadrada', COL[0]]];
    var lin = /^(u|v|recta)$/.test(R.linea) ? R.linea : R.linea === 'redondeada' ? 'u' : 'recta';
    function thF(f, d) { return 1.98 + formaTh(f, d) * 0.9; }
    /* Fátima, 19-10-2026: abajo dos dedos de la raíz y arriba más largo (tres dedos): se toma el mechón con el de abajo y se corta menos */
    function largo(th) { return DOS + (TRES - DOS) * Math.max(0, Math.min(1, (1.5 - th) / 1.1)); }
    /* 1 · la forma de atrás: U, V y cuadrada sobre la nuca */
    var v = 'nuca', tr = [];
    FORMAS.forEach(function (F, i) {
      var ta = 0.04 + i * 0.3, ext = i < 2 ? { x: ta + 0.3 } : {};
      tr = tr.concat(lineas(tramos(v, function (u) { var d = u * 2 - 1; return [NUCA + d * 1.25, thF(F[0], d)]; }, 50), [ta, ta + 0.14], F[2], 4.5, ext));
      tr.push(rotulo('Forma ' + F[1].toLowerCase() + ' · se marca en la nuca', F[2], ta, ext));
    });
    tr.push(rotulo('Primero se saca la forma: en U, en V o cuadrada', TINTA, 0));
    L.push({ tipo: 'pixc_forma', vista: v, t: 'Pixie corto · la forma', texto: 'En el pixie corto primero se saca la forma de atrás. Se puede sacar en U, en V o cuadrada.', a: { v: v, tr: tr, banda: true } });
    /* 2 · la guía a dos dedos de la raíz, siguiendo la forma elegida */
    tr = []; var tips = [];
    tr = tr.concat(lineas(tramos(v, function (u) { var d = u * 2 - 1; return [NUCA + d * 1.25, thF(lin, d)]; }, 50), [0, 0.03], '#2C6FD1', 3.6));
    for (var i = 0; i <= 12; i++) {
      var d = i / 6 - 1, ph = NUCA + d * 1.15, th = thF(lin, d); if (!seVe(v, ph, th)) continue;
      var a = P(ph, th, 1.03), b = a.clone().add(V3(0, -0.85, 0)), c = a.clone().add(V3(0, -DOS, 0));
      tr.push(linea(plano([pr(v, a), pr(v, b)]), [0.08, 0.3], '#8E847A', 2), linea(plano([pr(v, a), pr(v, c)]), [0.3, 0.45], COL[0], 3.4));
      tips.push(pr(v, c));
    }
    if (tips.length > 1) {
      tr.push(tijera(plano(tips), [0.5, 0.85], ROJ, false));
      var m0 = tips[Math.floor(tips.length / 2)];
      tr.push(chapa([m0[0] + 70, m0[1] - 22], '2 dedos', COL[0], 0.32), linea(plano(tips), [0.85, 0.95], COL[0], 3.4));
    }
    tr.push(rotulo('La forma ' + (FORMAS.filter(function (F) { return F[0] === lin; })[0] || FORMAS[2])[1].toLowerCase() + ' en la raíz', '#2C6FD1', 0), rotulo('Guía: se deja dos dedos desde la raíz', COL[0], 0.3), rotulo('Se corta la guía a dos dedos', ROJ, 0.5));
    L.push({ tipo: 'pixc_guia', vista: v, t: 'Pixie corto · guía a dos dedos', texto: 'Desde la forma se saca la guía: se deja mínimo dos dedos desde la raíz y ahí se corta.', a: { v: v, tr: tr, banda: true } });
    /* 3 · de lado: secciones verticales, el cabello elevado en vertical y cortado a dos dedos */
    v = 'lateral'; tr = [];
    var nS = 5, secs = [];
    for (var k = 0; k < nS; k++) secs.push(DER + 0.3 + k * ((NUCA + 2 * Math.PI - DER - 0.75) / (nS - 1)));
    secs.forEach(function (ph, k) {
      var c = COL[k % 7], ta = 0.04 + k * 0.18, tb = ta + 0.18, ext = k < nS - 1 ? { x: tb } : {}, tk = [];
      tr = tr.concat(lineas(tramos(v, function (u) { return [ph, 0.35 + u * 1.62]; }, 30), [ta, ta + 0.03], c, 2.6, { d: 1 }));
      for (var j = 0; j <= 8; j++) {
        var th = 0.4 + j * 0.19; if (!seVe(v, ph, th)) continue;
        var a = P(ph, th), n = N(ph, th), ks = [], kl = [];
        for (var m = 0; m <= 5; m++) { var w = m / 5, dd = V3(0, -1, 0).multiplyScalar(1 - w).add(n.clone().multiplyScalar(w)).normalize(); ks.push([].concat(pr(v, a), pr(v, a.clone().add(dd.clone().multiplyScalar(largo(th)))))); kl.push([].concat(pr(v, a.clone().add(dd.clone().multiplyScalar(largo(th)))), pr(v, a.clone().add(dd.multiplyScalar(0.8))))); }
        tr.push(mechon(kl, [ta + 0.02, ta + 0.08], '#8E847A', 1.8, { x: ta + 0.11 }), mechon(ks, [ta + 0.02, ta + 0.08], c, 3));
        tk.push(ks[5].slice(2));
      }
      if (tk.length > 1) tr.push(tijera(plano(tk), [ta + 0.08, ta + 0.15], ROJ, false, ext), linea(plano(tk), [ta + 0.15, tb], c, 2.4), chapa(tk[tk.length - 1], (k + 1) + ' · 90°', c, ta + 0.12));
      tr.push(regla(0, 90, [ta + 0.02, ta + 0.08], c, 'Sección ' + (k + 1) + ' · vertical', ext));
    });
    tr.push(rotulo('Secciones verticales · el cabello se eleva en vertical', TINTA, 0.04), rotulo('Abajo dos dedos · arriba se corta menos: tres dedos', ROJ, 0.12));
    L.push({ tipo: 'pixc_vertical', vista: v, t: 'Pixie corto · elevado en vertical', texto: 'Desde la guía, el cabello se toma en secciones verticales y se eleva en vertical, a noventa grados de la cabeza. Abajo cada mechón se corta a dos dedos de la raíz, igual que la guía. Arriba se toma el mechón junto con el de abajo como guía y se corta menos, a unos tres dedos, para que quede más alargado.', a: { v: v, tr: tr, banda: true } });
    /* 4 · el resultado de cada capa */
    [['lateral', 'de lado'], ['nuca', 'atrás'], ['frente', 'de frente']].forEach(function (q) {
      var v2 = q[0], tr2 = [];
      secs.forEach(function (ph0, k) {
        var c = COL[k % 7], ta = 0.05 + k * 0.17, pts = [];
        var phs = v2 === 'nuca' ? [NUCA - 1.1 + k * 0.55] : v2 === 'frente' ? [CARA - 1.1 + k * 0.55] : [ph0];
        phs.forEach(function (ph) {
          for (var j = 0; j <= 9; j++) {
            var th = 0.35 + j * 0.18; if (v2 === 'nuca') th = Math.min(th, thF(lin, (ph - NUCA) / 1.25)); if (v2 === 'frente' && th > 1.0 + 0.5 * Math.abs(ph - CARA) / 1.1) continue; if (!seVe(v2, ph, th)) continue;
            var a = P(ph, th), n = N(ph, th), dd = n.clone().multiplyScalar(0.35).add(V3(0, -1, 0)).normalize(), b = a.clone().add(dd.multiplyScalar(largo(th)));
            /* Fátima, 19-10-2026: delante más largo y cayendo de ladito hacia ambos lados, hasta entre el ojo y la nariz */
            if (v2 === 'frente' && Math.abs(ph - CARA) < 0.95 && th < 1.15) {
              var fw = P(CARA, Math.PI / 2).normalize(), o = V3(a.x, 0, a.z); o.sub(fw.clone().multiplyScalar(o.dot(fw))); if (o.length() < 0.05) o = V3(fw.z, 0, -fw.x).multiplyScalar(ph < CARA ? 1 : -1); o.normalize();
              /* la línea va de lado (raya en PR): el cabello cae desde la raya hacia cada lado, con suficiente cabello en ambos */
              o = V3(fw.z, 0, -fw.x).multiplyScalar(ph < PR ? -1 : 1).normalize();
              var bL = a.clone().add(o.clone().multiplyScalar(0.42 + 0.25 * (1 - Math.min(1, Math.abs(ph - PR))))).add(fw.clone().multiplyScalar(0.12)); bL.y = YFL - 0.1 * Math.abs(ph - CARA);
              var cL = a.clone().add(fw.clone().multiplyScalar(0.3)).add(o.clone().multiplyScalar(0.15)); cL.y = Math.max(a.y, cL.y);
              var bz = bezier(v2, a, cL, bL, 12); tr2.push(linea(bz, [ta, ta + 0.1], c, 3)); pts.push([bz[bz.length - 2], bz[bz.length - 1]]); continue;
            }
            tr2.push(linea(plano([pr(v2, a), pr(v2, b)]), [ta, ta + 0.1], c, 3)); pts.push(pr(v2, b));
          }
        });
        if (pts.length > 1) tr2.push(linea(plano(pts), [ta + 0.1, ta + 0.15], c, 2.4, { d: 1 }), chapa(pts[pts.length - 1], 'Capa ' + (k + 1), c, ta + 0.12));
      });
      tr2.push(rotulo('Cómo quedó cada capa · ' + q[1] + ' · abajo dos dedos, arriba tres', TINTA, 0.05));
      if (v2 === 'frente') { tr2.push(rotulo('Delante más largo · cae a ambos lados, entre el ojo y la nariz', COL[2], 0.6)); tr2 = tr2.concat(lineas(tramos(v2, function (u) { return [PR, 0.05 + u * 1.0]; }, 30), [0, 0.03], TINTA, 3)); tr2.push(rotulo('Raya de lado', TINTA, 0)); }
      L.push({ tipo: 'pixc_queda_' + v2, vista: v2, t: 'Pixie corto · cómo queda ' + q[1], texto: v2 === 'frente' ? 'De frente se deja un poco más largo, con la raya de lado, y el cabello cae hacia ambos lados, con suficiente cabello en cada uno, como un flequillo que llega entre donde termina el ojo y la nariz. Atrás y a los lados queda a dos dedos.' : 'Así queda cada capa: abajo a dos dedos de la raíz y arriba más largo, a tres dedos, con la forma de atrás marcada.', a: { v: v2, tr: tr2, banda: true } });
    });
    /* Fátima, 19-10-2026: de lado se saca la forma en curvatura por encima de la oreja, alineada con delante, para que el corte
       quede definido y la oreja descubierta; en la nuca, la forma de atrás */
    var v4 = 'lateral', tr4 = [], ruta = [], tk4 = [];
    function seg(a, b, nn) { for (var i = 0; i <= nn; i++) { var u = i / nn; ruta.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]); } }
    /* 19-10-2026 (Fátima: «la tijera sobrepasó la oreja, tenía que quedar al ras; la curva pequeña, en U, sacada desde la nuca,
       como un sombreado»): la curva abraza la oreja del maniquí (centro DER − 0,05 · 1,72, radio ≈ 0,11 × 0,13) con poco margen, en U suave,
       y se recorre de la nuca hacia delante */
    var OC = [DER - 0.05, 1.72], OW = 0.24, OB = 1.8, OH = 0.24;
    seg([NUCA + 2 * Math.PI - 0.25, thF(lin, 0.2)], [OC[0] + OW, OB], 10);
    for (var i4 = 1; i4 < 20; i4++) { var d4 = OW - 2 * OW * i4 / 20; ruta.push([OC[0] + d4, OB - OH * Math.sqrt((1 + Math.cos(Math.PI * d4 / OW)) / 2)]); }
    seg([OC[0] - OW, OB], [CARA + 0.6, 1.8], 10);
    tr4 = tr4.concat(lineas(tramos(v4, function (u) { var k = Math.min(ruta.length - 1, Math.round(u * (ruta.length - 1))); return ruta[k]; }, ruta.length - 1), [0.05, 0.3], '#2C6FD1', 4));
    ruta.forEach(function (q, i) {
      if (i % 3 || !seVe(v4, q[0], q[1])) return;
      var a4 = P(q[0], q[1], 1.02), r4 = P(q[0], Math.max(0.9, q[1] - 0.55), 1.03);
      tr4.push(linea(plano([pr(v4, r4), pr(v4, a4.clone().add(V3(0, -0.3, 0)))]), [0.3, 0.45], '#8E847A', 2, { x: 0.75 }), linea(plano([pr(v4, r4), pr(v4, a4)]), [0.7, 0.8], COL[5], 2.6));
      tk4.push(pr(v4, a4));
    });
    if (tk4.length > 1) tr4.push(tijera(plano(tk4), [0.45, 0.75], ROJ, false));
    tr4.push(rotulo('Desde la nuca: curva pequeña en U, al ras de la oreja', '#2C6FD1', 0.05), rotulo('Alineada con delante y con la nuca: la oreja queda descubierta', COL[5], 0.3), rotulo('La tijera sigue la curva, sin pasar la oreja', ROJ, 0.45));
    L.push({ tipo: 'pixc_oreja', vista: v4, t: 'Pixie corto · curva por encima de la oreja', texto: 'De lado se saca la forma desde la nuca, con el mismo corte, como un sombreado: una curva pequeña en U por encima de la oreja, al ras, sin que la tijera pase la oreja, alineada con la parte de delante. Así el corte queda definido y la oreja descubierta.', a: { v: v4, tr: tr4, banda: true } });
    /* emparejar: el largo de delante se une con los dos dedos de atrás, a 0°, de lado */
    var v3 = 'lateral', tr3 = [], pe = [], yAtras = P(NUCA, thF(lin, 0)).y - DOS;
    for (var e = 0; e <= 14; e++) {
      var w = e / 14, ph3 = CARA + 0.45 + w * (Math.PI - 0.75), th3 = 1.2 + 0.35 * w; if (!seVe(v3, ph3, th3)) continue;
      var a3 = P(ph3, th3, 1.03), yE = YFL + (yAtras - YFL) * Math.pow(w, 0.8), b3 = V3(a3.x * 1.04, Math.min(a3.y - 0.08, yE), a3.z * 1.04), lg = V3(a3.x * 1.04, Math.min(a3.y - 0.08, yE) - 0.35, a3.z * 1.04);
      tr3.push(linea(plano([pr(v3, a3), pr(v3, lg)]), [0.05, 0.3], '#8E847A', 2, { x: 0.6 }), linea(plano([pr(v3, a3), pr(v3, b3)]), [0.55, 0.62], COL[3], 2.6));
      pe.push(pr(v3, b3));
    }
    if (pe.length > 1) tr3.push(tijera(plano(pe), [0.3, 0.6], ROJ, false), linea(plano(pe), [0.6, 0.75], COL[3], 3.2));
    tr3.push(rotulo('Se empareja delante con atrás · a 0°, hacia el suelo', TINTA, 0.05), rotulo('Del largo de delante a los dos dedos de atrás', COL[3], 0.3), regla(0, 0, [0.05, 0.3], COL[3], 'Emparejar · 0°'));
    L.push({ tipo: 'pixc_emparejar', vista: v3, t: 'Pixie corto · emparejar delante y atrás', texto: 'Al final se empareja todo: a cero grados, hacia el suelo, se une el largo de delante con los dos dedos de atrás y se le hace su forma, atrás y adelante.', a: { v: v3, tr: tr3, banda: true } });
    return L;
  }
  function escenas(id) {
    var R = typeof id === 'object' ? id : receta(id); if (!R) return null;
    var A = ALTURAS[R.altura], pila = R.capas.pila;
    /* Fátima, 19-10-2026: corte básico (todo a 0°): la primera línea es la guía y las demás se llevan a ella y se emparejan;
       de frente, horizontal con cualquier cabello, porque no hay numeración de elevación */
    var cero = !R.punto && pila.concat(R.frente.pila || [], (R.lateral && R.lateral.pila) || []).every(function (g) { return !g; });
    /* Fátima, 15-10-2026: el alumno oye «mechón», no las zonas del motor (Z0…Z6) */
    var capasTxt = pila.map(function (g, z) { return z === 0 ? 'primer mechón, ' + (g ? 'elevado a ' + g + ' grados' : 'corte recto a 0 grados') : 'el mechón ' + (z + 1) + (g ? ', lo elevamos a ' + g + ' grados' : ', también a 0 grados'); }).join('; ') +
      (R.linea === 'recta' ? '. Línea de corte recta: el corte queda cuadrado' : R.linea === 'redondeada' ? '. La línea de corte se lleva hacia delante: el corte queda redondeado' : FORMAS_ATRAS[R.linea] ? '. Atrás, línea ' + FORMAS_ATRAS[R.linea].n + ': el cabello cae natural y las secciones van paralelas a la línea' : '');
    var recto = R.forma === 'recto';
    var lat = R.liso ? 'El lateral, delante de la división de oreja a oreja. ' + (R.libre ? 'Secciones horizontales.' : 'Cabello liso extremo: las secciones van horizontales, porque en vertical el filo deja escalón.') :
      R.punto ? 'El lateral, delante de la división de oreja a oreja. Cada mechón se lleva al mismo punto y ahí se corta' + (R.desg ? ', desgrafilando.' : '.') :
      'El lateral: las líneas nacen en la división de oreja a oreja y van hacia la cara. Cada línea se lleva al frente con su número y se corta en la punta: ' + ((R.lateral && R.lateral.pila.length ? R.lateral.pila : R.frente.pila.length ? R.frente.pila : R.capas.pila).map(function (g, k) { return 'línea ' + (k + 1) + ' a ' + g + ' grados'; }).join(', ')) + '.';
    var fr = 'De frente, ' + (R.fuenteAltura === 'ejemplo' ? 'en este ejemplo la guía se saca ' + A.n + '; según el corte puede sacarse bajo las cejas, bajo el ojo, bajo la nariz o donde termina el rostro. ' : 'la guía se saca ' + A.n + '. ') +
      (R.liso ? 'Secciones horizontales. ' : 'Líneas verticales: de cada una baja su mechón y las puntas marcan la línea de corte' + (R.desg ? ', que se desgrafila. ' : '. ')) + txt(R.frente.texto);
    /* Fátima, 19-10-2026: «los únicos cortes que se pueden realizar en horizontal son los cortes rectos»: desde la guía, a un dedo,
       los demás mechones se cortan a esa misma línea. Redondeado, U y V: secciones verticales siguiendo su línea (a validar por Fátima). */
    var recto0 = cero && lineaDe(R) === 'recta';
    if (cero) R = Object.assign({}, R, { cero: true });
    if (cero) lat = 'El lateral, delante de la división de oreja a oreja. ' + (recto0 ? 'Corte recto: secciones horizontales.' : 'Secciones verticales.') + ' Cada mechón se baja a 0 grados hasta la línea de la guía, a un dedo, y se corta en esa misma línea.';
    if (cero && R.nivelar) fr = 'De frente no se saca otra guía: el cabello se peina desde la raya hacia los lados, se baja a 0 grados y se empareja con la línea que quedó atrás. ' +
      (R.fleco === 'pollina' ? 'La pollina se separa delante y se corta al ras de la ceja o un poquito más abajo, nunca más arriba. ' : R.fleco === 'lado' ? 'El flequillo de lado se saca más abajo de los ojos, colocándolo en triángulo, cortando en triángulo, y se peina de lado, sin dejar huecos. ' : 'Es un corte sin pollina: delante queda el mismo largo que atrás. ') +
      (recto0 ? 'Es un corte recto: se corta en horizontal, en esa misma línea.' : 'Se corta siguiendo la línea ' + ({ redondeada: 'redondeada', u: 'en U', v: 'en V', a: 'en A' }[lineaDe(R)] || '') + ', en vertical.');
    else if (cero) fr = 'De frente, la guía se saca ' + A.n + ' y se corta a un dedo. Todo va a 0 grados: cada mechón se baja hasta la línea de la guía y se corta en esa misma línea. ' + (recto0 ? 'Es un corte recto: las secciones van en horizontal y el corte se hace recto.' : 'No es un corte recto: las secciones van en vertical y el corte sigue la línea ' + ({ redondeada: 'redondeada', u: 'en U', v: 'en V', a: 'en A' }[lineaDe(R)] || '') + '.') + ' ' + txt(R.frente.texto);
    /* 30-10-2026 (Fátima: «emparejas con el que quedó atrás»): con capas también se nivela delante con atrás; el título y la voz dicen lo mismo que el dibujo */
    else if (R.nivelar) fr = 'De frente no se saca otra guía: el cabello se peina desde la raya hacia los lados y se empareja con la línea que quedó atrás.';
    var L = [
      { tipo: 'seccion', vista: 'tres', t: 'Seccionado', texto: 'Primero se divide la cabeza: raya central de la frente a la nuca, de oreja a oreja por arriba y una línea horizontal en la nuca. El lateral siempre se separa de oreja a oreja: la parte de atrás se corta de una forma y la de delante de otra.', a: escSeccion(R) },
      { tipo: 'particion', vista: 'nuca', t: 'Particiones de atrás', texto: 'Atrás, la raya central de la coronilla a la nuca y las particiones horizontales que la cruzan: una sección por cada capa, de abajo arriba.', a: escParticion(R) },
      { tipo: 'guia', vista: 'nuca', t: 'Línea guía en la nuca', texto: (/^línea guía en la nuca/i.test(txt(R.guia.texto)) ? '' : 'Línea guía en la nuca a ' + R.guia.g + ' grados. ') + txt(R.guia.texto), a: escGuia(R) },   /* 26-10-2026: sin repetir la frase */
      { tipo: 'capas', vista: 'nuca', t: 'Capas de abajo arriba', texto: 'Ahora las capas, de abajo arriba: ' + capasTxt + '. ' + txt(R.capas.texto), a: escCapas(R) },
      { tipo: 'lateral', vista: 'lateral', t: 'El lateral', texto: lat, a: escLateral(R) },
      { tipo: 'frente', vista: 'frente', t: R.nivelar ? 'El frente · se empareja con atrás' + (R.fleco === 'pollina' ? ' · pollina' : R.fleco === 'lado' ? ' · flequillo de lado' : '') : 'El frente · guía ' + A.n, texto: fr, a: escFrente(cero ? Object.assign({}, R, recto0 ? { forma: 'recto', liso: true, libre: true, cero: true } : { forma: 'arco', liso: false, cero: true }) : R) },
      { tipo: 'pulir', vista: 'lateral', t: 'Pulir puntas', texto: 'Para terminar se pulen las puntas: se agarra el cabello de atrás y el de delante, nada más en la punta, para nivelar el cabello.', a: escPulir(R) }
    ];
    if (R.liso) L.splice(L.map(function (e) { return e.tipo; }).indexOf('capas') + 1, 0, { tipo: 'error_liso', vista: 'nuca', t: 'Error común · cabello liso extremo', texto: 'Error común: en cabello liso extremo no se corta en vertical, porque deja trasquilado. En liso extremo todas las capas se cortan en horizontal, de abajo arriba. En cabello normal u ondulado, las secciones van en vertical.', a: escErrorLiso(R) });
    if (!R.liso && !recto0) L.splice(L.map(function (e) { return e.tipo; }).indexOf('capas') + 1, 0, { tipo: 'error_mixto', vista: 'nuca', t: 'Error común · cabello mixto u ondulado', texto: 'Error común: en cabello mixto u ondulado no se corta en horizontal, porque queda trasquilado. Se corta en vertical. En cabello liso extremo es al revés: todas las capas en horizontal.', a: escErrorMixto(R) });
    /* 30-10-2026 (Fátima): emparejar va al final, después del frente; delante se lleva a lo que quedó atrás */
    if (!R.liso && !R.punto && R.emparejar !== 'no') L.splice(L.map(function (e) { return e.tipo; }).indexOf('frente') + 1, 0, R.emparejar === 'atras' ?
      { tipo: 'emparejar', vista: 'lateral', t: 'Emparejar delante con atrás · corte redondo', texto: 'Para terminar, después del frente, se agarra un mechón de delante y se peina hacia atrás a cero grados, hacia el suelo, sin elevarlo, y se une con el de atrás, que también cae a cero grados. Así sale el corte redondo.', a: escEmparejar(R) } :
      { tipo: 'emparejar', vista: 'lateral', t: 'Emparejar delante con atrás', texto: 'Para terminar, delante se empareja con lo que quedó atrás: se agarra un mechón de delante, se peina hacia atrás a cero grados, hacia el suelo, sin elevarlo, y se une con el de atrás. Lo de atrás no se vuelve a cortar: solo se corta la punta de delante que sobra.', a: escEmparejar(R) });
    L.forEach(function (e) { if (e.a && e.a.v) e.vista = e.a.v; });
    if (R.oblicua) L.splice(1, 0, { tipo: 'oblicua', vista: 'nuca', t: 'Partición oblicua · box universal', texto: 'Partición oblicua: dos diagonales en X que bajan hacia detrás de las orejas. La nuca se corta en abanico, los lados en secciones diagonales y arriba queda el triángulo.', a: escOblicua(R) });
    if (R.libre) L.forEach(function (e) { if (e.tipo === 'guia') e.texto = 'Línea guía en la nuca a ' + R.guia.g + ' grados, medida desde la caída natural.'; });
    /* 19-10-2026 (Fátima: «el cabello debe lavarse antes de cortar; debe estar mojado»): primera escena de cada corte, salvo los
       que se cortan en seco (rizado y afro). Animación del agua de EU_PARTICIONES (la misma del aclarado). */
    var AY = window.EU_PARTICIONES && window.EU_PARTICIONES.ayudas;
    if (AY && AY.escCierre && !/^(rizado|afro)$/.test(R.cab || '') && !/seco/i.test(R.n || '')) {
      /* 26-10-2026 (Fátima: «primero se lava el cabello, se seca con una toalla, se coloca la capa y luego comienza el corte») */
      try { var aL = AY.escCierre(KIT, true, 'Lavar · secar con toalla · capa'); L.unshift({ tipo: 'lavado', vista: aL.v || 'lateral', t: 'Antes de cortar · lavar, secar con toalla y poner la capa', texto: 'Primero se lava el cabello. Ya lavado, se seca con una toalla y se coloca la capa. Luego comienza el corte: el cabello debe estar mojado para cortarlo.', a: aL }); } catch (e) { }
    }
    if (/pixie/i.test(R.n || '')) { try { var LP = escPixieRef(R), iq = L.map(function (e) { return e.tipo; }).indexOf('particion') + 1; L.splice.apply(L, [iq, 0].concat(LP)); } catch (e) { } }
    /* 19-10-2026 (Fátima): el pixie corto a dos dedos, después de las escenas de referencia del pixie */
    if (/pixie/i.test(R.n || '')) { try { var LC = escPixieCorto(R), ip = L.map(function (e) { return e.tipo; }).lastIndexOf('pix_arriba') + 1 || L.map(function (e) { return e.tipo; }).indexOf('particion') + 1; L.splice.apply(L, [ip, 0].concat(LC)); } catch (e) { } }
    /* geometría calculada: ángulos y largos (calculadora capilar) y coronilla en triángulo oblicuo */
    var CC = window.EU_CALCULO_CAPILAR, calc = null;
    /* 30-10-2026 (Fátima: «a 0 grados se nivela y de esa misma forma se corta»): todo a 0° → guía fija aunque el corte vaya al punto
       (Lob, Bob asimétrico, Flequillo desfilado, Blunt salían con guía móvil y cada línea 1 o 2 dedos más larga: parecían en capas) */
    var todo0 = pila.concat(R.frente.pila || [], (R.lateral && R.lateral.pila) || []).every(function (g) { return !g; });
    try { calc = CC ? CC.calcular({ capas: pila, guias: R.guias && R.guias.length ? R.guias : cero || todo0 ? ['f'] : R.guias, ref: R.ref }, R.medidas) : null; } catch (e) { calc = null; }
    var ic = L.map(function (e) { return e.tipo; }).indexOf('capas') + 1;
    if (R.coronilla) {
      L.splice(ic++, 0, { tipo: 'coronilla', vista: 'cenit', t: 'Coronilla · triángulo', texto: 'La coronilla se corta en un triángulo pequeño: la base hacia delante, sin tocar los laterales de la frente, y el vértice en la coronilla, con secciones oblicuas. Cada mechón se eleva a ' + R.coronilla.g + ' grados.', a: escCoronilla(R) });
      L.splice(ic++, 0, { tipo: 'coronilla_atras', vista: 'nuca', t: 'Coronilla · vista de atrás', texto: 'Visto de atrás, del vértice de la coronilla baja la raya central y a cada lado las secciones en espiga, de arriba abajo. Cada sección se corta con su número: ' + pila.slice(0, 6).map(function (g, k) { return 'sección ' + (k + 1) + ' a ' + g + ' grados'; }).join(', ') + '.', a: escCoronillaAtras(R) });
    }
    if (calc) {
      var esq = []; calc.capas.forEach(function (c) { var t = CC.fmt(c.ang) + '°: ' + c.escuadra; if (c.ang && esq.indexOf(t) < 0) esq.push(t); });
      L.splice(ic, 0, { tipo: 'angulos', vista: 'lateral', t: 'Ángulos y largos · escuadra y transportador', texto: (cero ? 'Corte básico a 0 grados: la primera línea que se corta es la guía. Cada línea de arriba se baja a 0 grados hasta esa primera guía y se corta pareja con ella, así todo queda emparejado. ' : '') + 'Ángulos y largos de cada capa, de abajo arriba, medidos ' + (calc.ref === 'suelo' ? 'desde el suelo' : 'desde el cráneo') + '. ' + calc.texto + (esq.length ? ' Cómo se trazan: ' + esq.join('; ') + '.' : ''), a: escAngulos(R, calc) });
    }
    /* línea por línea, atrás, de lado y de frente (después de los ángulos) */
    var iP = L.map(function (e) { return e.tipo; }).indexOf('lateral');
    var txP = cero ? 'Línea por línea, de abajo arriba. La guía se corta a un dedo y cada línea de arriba se baja a 0 grados hasta esa misma línea y se corta ahí, pareja con la guía.' :
      'Línea por línea, de abajo arriba: ' + pila.slice(0, 7).map(function (g, k) { return 'línea ' + (k + 1) + ' a ' + g + ' grados'; }).join(', ') + '. Cada mechón se lleva a su elevación, se corta en la punta y después cae a su largo.';
    /* 26-10-2026 (Fátima: «estás creando muchas animaciones»): en los cortes a 0° no hay elevación que ver de lado y el frente ya
       tiene su escena («El frente»): «Línea por línea» solo atrás. Con elevación, las tres vistas como antes. */
    [['nuca', 'atrás', txP], ['lateral', 'de lado', 'De lado se ve mejor la elevación: ' + txP], ['frente', 'de frente', 'De frente, el cabello se peina en líneas finas y se corta ' + (recto0 || R.forma === 'recto' ? 'recto, ' : 'siguiendo la línea, ') + (R.nivelar ? 'emparejado con la línea de atrás.' : 'con la guía ' + A.n + '.')]].filter(function (q) { return !cero || q[0] === 'nuca'; }).forEach(function (q, j) {
      try { L.splice(iP + j, 0, { tipo: 'peinado_' + q[0], vista: q[0], t: 'Línea por línea · ' + q[1], texto: q[2], a: escPeinado(R, q[0], calc) }); } catch (e) { }
    });
    /* 26-10-2026 (Fátima: «el curso tiene que tener coherencia con los test»; «los únicos cortes que se hacen horizontales son los
       cortes que no llevan ningún tipo de movimiento de elevación»): en el corte recto a 0° las preguntas dicen lo mismo que la clase */
    var qs = recto0 ? [{ e: '¿Cómo se toman las secciones del lateral en ' + R.n.toLowerCase() + '?', o: ['Verticales', 'Horizontales'], c: 1, x: 'Es un corte recto sin elevación: los únicos cortes que se hacen horizontales son los que no llevan ninguna elevación.' }]
      : [{ e: '¿Cómo se toman las secciones del lateral en ' + R.n.toLowerCase() + '?', o: ['Verticales', 'Horizontales'], c: R.liso ? 1 : 0, x: R.liso ? 'Es cabello liso extremo: en vertical el filo deja escalón.' : 'Siempre en vertical, salvo en cabello liso extremo.' }];
    if (recto0 && R.nivelar) qs.push({ e: 'En ' + R.n.toLowerCase() + ', ¿con qué se empareja el cabello de delante?', o: ['Con la línea que quedó atrás', 'Con una guía bajo la nariz', 'Con una guía bajo las cejas'], c: 0, x: R.fleco ? 'Los lados se emparejan con la línea de atrás; solo ' + (R.fleco === 'lado' ? 'el flequillo de lado' : 'la pollina') + ' lleva su propia altura.' : 'Si el corte es recto y no tiene pollina, se empareja con el corte de atrás: una guía bajo la nariz sería otro corte, con pollina.' });
    else qs.push({ e: '¿Qué pasa si un cabello ' + (R.liso ? 'liso extremo se corta en vertical' : 'mixto u ondulado se corta en horizontal') + '?', o: ['Queda trasquilado', 'Queda igual', 'Queda más largo'], c: 0, x: R.liso ? 'En liso extremo todas las capas se cortan en horizontal.' : 'En cabello mixto u ondulado las secciones van en vertical.' });
    if (R.fuenteAltura !== 'ejemplo' && !R.nivelar) { var ks = Object.keys(ALTURAS).filter(function (k) { return k !== R.altura && k !== 'hombro'; }), gi = (R.n.length + pila.length) % ks.length; ks = ks.slice(gi).concat(ks.slice(0, gi)).slice(0, 3); ks.splice((R.n.length) % 4, 0, R.altura); qs.push({ e: '¿Desde dónde se saca la guía del frente en ' + R.n.toLowerCase() + '?', o: ks.map(function (k) { return 'Desde ' + ALTURAS[k].n; }), c: ks.indexOf(R.altura) }); }
    if (calc) {
      var FORMAS = ['línea sólida · un solo largo', 'capas uniformes', 'graduación · escalonado (peso abajo)', 'capas en aumento (más cortas arriba)', 'forma combinada'];
      var ops = FORMAS.filter(function (f) { return f !== calc.forma; }).slice((R.n.length + pila.length) % 3, (R.n.length + pila.length) % 3 + 2); ops.splice(pila.length % 3, 0, calc.forma);
      qs.push({ e: 'Con estas elevaciones (' + pila.join(' · ') + '°), ¿qué forma resulta en ' + R.n.toLowerCase() + '?', o: ops, c: ops.indexOf(calc.forma), x: 'Largos calculados: ' + calc.largos.map(function (x) { return CC.fmt(x); }).join(' · ') + ' cm.' });
    }
    /* Fátima, 10-10-2026: el resultado del corte, dando la vuelta a la cabeza */
    var nomQ = { recta: 'recta, en cuadrado', redondeada: 'en forma redonda', u: 'en U', v: 'en V', a: 'en A', diag_delante: 'en diagonal hacia delante', diag_atras: 'en diagonal hacia atrás' }[lineaDe(R)];
    [['nuca', 'atrás', 'Damos la vuelta a la cabeza para ver cómo queda el corte. Por detrás: antes, el cabello largo; la tijera sigue la línea ' + nomQ + '; después, el corte terminado.'],
     ['lateral', 'lateral', 'Ahora de lado: así cae el cabello cortado y así se ve la línea ' + nomQ + ' de perfil.'],
     ['frente', 'de frente', 'Y de frente: el cabello enmarca el rostro y se ve la forma final del corte.']].forEach(function (q, iq) {
      var enLineas = !cortoDe(R) && difCapas(R.capas.pila, R), a = enLineas ? escQuedaLineas(R, q[0]) : escQueda(R, q[0]);
      var pq = (q[0] === 'frente' && R.frente.pila.length ? R.frente.pila : pila).slice(0, 7);
      var txQ = enLineas ? q[2] + ' Cada capa se lleva a su elevación, se corta en la punta y cae a su largo: ' + pq.map(function (g, k) { return 'capa ' + (k + 1) + ' a ' + g + ' grados'; }).join(', ') + '.' : q[2];
      /* 30-10-2026 (Fátima: «no puede haber tres cortes en una escena sin identificar»): es el MISMO corte visto de tres lados */
      L.push({ tipo: 'queda_' + q[0], vista: q[0], t: 'Cómo queda · ' + R.n + ' · vista ' + (iq + 1) + ' de 3 · ' + q[1], texto: 'El mismo corte, ' + R.n + ', vista ' + (iq + 1) + ' de 3. ' + txQ, a: a });
    });
    /* Fátima, 19-10-2026: los cortos, además, como su lámina (de lado y atrás, nuca en punta sobre el cuello) */
    if (cortoDe(R)) [['lateral', 'de lado', 'Así queda el corto de lado: el cabello tupido pegado a la cabeza, de frente hasta las cejas, la oreja descubierta y la nuca que baja sobre el cuello con las puntas emparejadas.'],
      ['nuca', 'atrás', 'Y atrás: la nuca baja recta sobre el cuello y termina en forma cuadrada, con las puntas emparejadas en las orillas.']].forEach(function (q) {
      L.push({ tipo: 'queda_corto_' + q[0], vista: q[0], t: 'Cómo queda el corto · ' + q[1], texto: q[2], a: escQuedaCorto(R, q[0], cortoDe(R)) });
    });
    return { R: R, escenas: L, preguntas: qs, calculo: calc };
  }

  /* ───────────── reproductor de la animación: autónomo, se serializa al curso ───────────── */
  function pinta(x, A, im, bx, by, bw, bh, p) {
    if (!A) return false;
    /* A.banda (18-10-2026, Fátima: «los textos de arriba no dejan ver el maniquí»): los rótulos van en una franja propia arriba y el maniquí debajo, sin taparlo */
    var nE = (A.tr || []).filter(function (T) { return T.k === 'e' && !T.x; }).length + ((A.tr || []).some(function (T) { return T.k === 'e' && T.x; }) ? 1 : 0), bnd = A.banda || nE >= 4 ? Math.min(bh * 0.45, 16 + 32 * nE) : 0;
    var c = A.crop || [0, 0, 1280, 720], s = Math.min(bw / c[2], (bh - bnd) / c[3]), ox = bx + (bw - c[2] * s) / 2 - c[0] * s, oy = by + bnd + (bh - bnd - c[3] * s) / 2 - c[1] * s;
    x.save(); x.beginPath(); x.rect(bx, by, bw, bh); x.clip();
    x.fillStyle = A.bg || '#E6EAF1'; x.fillRect(bx, by, bw, bh);
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
      } else if (T.k === 'mc') {   /* 31-10-2026 · mechón curvo (raíz → cráneo → dedos): fotogramas de polilíneas del mismo tamaño */
        var mcF = T.f, mcK = mcF.length - 1, mcV = su(u) * Math.max(0, mcK), mcI = mcK < 1 ? 0 : Math.min(mcK - 1, Math.floor(mcV)), mcW = mcK < 1 ? 0 : mcV - mcI, mcA = mcF[mcI], mcB = mcF[Math.min(mcK, mcI + 1)], mcQ = [];
        for (var mcJ = 0; mcJ < mcA.length; mcJ++) mcQ.push(mcA[mcJ] + (mcB[mcJ] - mcA[mcJ]) * mcW);
        camino(mcQ, mcQ.length); x.stroke();
      } else if (T.k === 's') cola.push([T, u]);
      else if (T.k === 'n') { x.beginPath(); if (T.s && T.s.length > 3) { x.font = '700 13px system-ui,sans-serif'; var nw = x.measureText(T.s).width / 2 + 9, nx = ox + T.x * s, ny = oy + T.y * s; x.moveTo(nx - nw + 11, ny - 11); x.arc(nx + nw - 11, ny, 11, -1.5708, 1.5708); x.arc(nx - nw + 11, ny, 11, 1.5708, 4.7124); x.closePath(); } else x.arc(ox + T.x * s, oy + T.y * s, 11, 0, 7); x.fill(); if (T.s) { x.fillStyle = '#fff'; x.font = '700 13px system-ui,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(T.s, ox + T.x * s, oy + T.y * s + 1); x.textAlign = 'left'; x.textBaseline = 'alphabetic'; } }
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
      /* z: zona rellena que aparece (producto aplicado, papel de aluminio); b = borde, a = opacidad final */
      else if (T.k === 'z') { x.setLineDash([]); x.globalAlpha = (T.a || 0.45) * su(u); camino(T.p, T.p.length); x.closePath(); x.fill(); x.globalAlpha = 1; if (T.b && u > 0.05) { x.strokeStyle = T.b; x.lineWidth = 1.6; x.stroke(); } }
      /* c: reloj de exposición (minutos que avanzan) */
      else if (T.k === 'dv') {   /* 18-10-2026 · lámina de divisiones de b6_divisiones.js en una tarjeta al lado del maniquí, sin taparlo */
        var DV = window.EU_DIVISIONES; if (!DV || !DV.dibujarUna) return;
        x.save(); x.setLineDash([]); x.translate(ox, oy); x.scale(s, s); x.globalAlpha = Math.min(1, u * 5);
        var cw = T.cw || 360, ch = T.ch || 610, cx0 = T.bx == null ? 1280 - cw - 16 : T.bx, cy0 = T.by == null ? 64 : T.by;
        x.fillStyle = '#FBF8F2'; x.fillRect(cx0, cy0, cw, ch); x.strokeStyle = '#B0873C'; x.lineWidth = 2; x.strokeRect(cx0, cy0, cw, ch);
        x.fillStyle = '#1a1a2e'; x.font = '800 15px system-ui,sans-serif'; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillText(T.n || '', cx0 + 14, cy0 + 27);
        var PX = cx0 + cw / 2, PY = T.cy || cy0 + 38 + (ch - 140) * 0.46, PR = T.R || cw * 0.27;
        x.save(); x.beginPath(); x.rect(cx0 + 1, cy0 + 38, cw - 2, T.pct != null ? 262 : ch - 140); x.clip();
        DV.dibujarUna(x, T.id, PX, PY, PR, su(u), T.o || {});
        /* Fátima, 18-10-2026 (su lámina «formas y técnicas balayage»): el mechón que se saca de la sección, resaltado,
           y en amarillo el tramo donde se aplica el producto (desde el arranque hasta las puntas) */
        var rx = T.mv === 'nuca' ? 0.84 : 1, ryy = T.mv === 'nuca' ? 1 : 1.02;
        (T.mech || []).forEach(function (g, k) {
          var um = Math.max(0, Math.min(1, (u - 0.45 - k * 0.07) / 0.3)); if (!um) return;
          var a0 = g * Math.PI / 180, P = function (aa, r) { return [PX + Math.cos(aa) * PR * rx * r, PY + Math.sin(aa) * PR * ryy * r]; };
          var b1 = P(a0 - 0.15, 1), b2 = P(a0 + 0.15, 1), ap = P(a0, 1 + 0.8 * su(um)), L = function (q, t) { return [q[0] + (ap[0] - q[0]) * t, q[1] + (ap[1] - q[1]) * t]; };
          x.globalAlpha = 0.92; x.fillStyle = '#3A3340'; x.beginPath(); x.moveTo(b1[0], b1[1]); x.lineTo(ap[0], ap[1]); x.lineTo(b2[0], b2[1]); x.closePath(); x.fill();
          var dd = T.desde == null ? 0.5 : T.desde, q1 = L(b1, dd), q2 = L(b2, dd);
          if (um > 0.6) { x.globalAlpha = Math.min(1, (um - 0.6) / 0.4); x.shadowColor = '#F2C14E'; x.shadowBlur = 14; x.fillStyle = '#F2C14E'; x.beginPath(); x.moveTo(q1[0], q1[1]); x.lineTo(ap[0], ap[1]); x.lineTo(q2[0], q2[1]); x.closePath(); x.fill(); x.shadowBlur = 0; }
          x.globalAlpha = 1;
        });
        x.restore();
        /* el mechón con sus porcentajes, grande y nítido: el producto entra desde el arranque elegido hasta las puntas */
        if (T.pct != null) {
          var yT = cy0 + 330, yB = cy0 + 540, mx = PX + 10, wT = 34, wB = 6, Y = function (v) { return yT + (yB - yT) * v; }, W = function (v) { return wT + (wB - wT) * v; };
          var forma = function () { x.beginPath(); x.moveTo(mx - wT, yT); x.quadraticCurveTo(mx - wT * 0.9, Y(0.6), mx - wB, yB); x.lineTo(mx + wB, yB); x.quadraticCurveTo(mx + wT * 0.9, Y(0.6), mx + wT, yT); x.closePath(); };
          forma(); x.fillStyle = '#5A3A28'; x.fill();
          x.save(); forma(); x.clip();
          var gp = Math.max(0, Math.min(1, (u - 0.3) / 0.55)), ya = Y(T.pct);
          if (gp > 0) { var gr0 = x.createLinearGradient(0, ya, 0, yB); gr0.addColorStop(0, '#F7E2A0'); gr0.addColorStop(1, '#F2C14E'); x.fillStyle = gr0; x.fillRect(mx - wT - 2, ya, wT * 2 + 4, (yB - ya) * su(gp)); }
          x.strokeStyle = 'rgba(255,255,255,.28)'; x.lineWidth = 1.2; for (var hl = -3; hl <= 3; hl++) { x.beginPath(); x.moveTo(mx + hl * wT / 4, yT); x.lineTo(mx + hl * wB / 4, yB); x.stroke(); }
          x.restore();
          x.textBaseline = 'middle';
          [[0.10, '#9A7B2E'], [0.25, '#d94141'], [0.50, '#6b6b80'], [0.75, '#2fa36b']].forEach(function (m) {
            var yy = Y(m[0]), w = W(m[0]); x.strokeStyle = m[1]; x.lineWidth = 2.5; x.beginPath(); x.moveTo(mx - w - 14, yy); x.lineTo(mx + w + 6, yy); x.stroke();
            x.fillStyle = m[1]; x.font = '800 17px system-ui,sans-serif'; x.textAlign = 'right'; x.fillText(Math.round(m[0] * 100) + ' %', mx - w - 20, yy);
          });
          x.strokeStyle = '#B0873C'; x.lineWidth = 3.5; x.beginPath(); x.moveTo(mx - W(T.pct) - 6, ya); x.lineTo(mx + W(T.pct) + 30, ya); x.stroke();
          x.fillStyle = '#B0873C'; x.font = '800 17px system-ui,sans-serif'; x.textAlign = 'left'; x.fillText('arranque ' + Math.round(T.pct * 100) + ' %', mx + W(T.pct) + 36, ya);
          x.fillStyle = '#4a4a60'; x.font = '700 14px system-ui,sans-serif'; x.fillText('raíz', mx + wT + 8, yT + 2); x.fillText('puntas', mx + wB + 12, yB - 4);
          x.textBaseline = 'alphabetic';
        }
        if (T.ds) { x.font = '600 13px system-ui,sans-serif'; x.fillStyle = '#4a4a60'; x.textAlign = 'left'; var dw = String(T.ds).split(' '), dl = '', dy = cy0 + ch - 84;
          dw.forEach(function (w) { var tt = dl ? dl + ' ' + w : w; if (x.measureText(tt).width > cw - 28 && dl) { x.fillText(dl, cx0 + 14, dy); dy += 18; dl = w; } else dl = tt; });
          if (dl) x.fillText(dl, cx0 + 14, dy); }
        x.restore();
      }
      else if (T.k === 'c') {
        x.setLineDash([]); var Rc = Math.min(54, bh * 0.14), kx = bx + bw - Rc - 46, ky = by + bh * 0.42, fc = Math.min(1, (T.m || 0) / 60) * su(u), ac = -Math.PI / 2 + 2 * Math.PI * fc;
        x.fillStyle = 'rgba(255,255,255,.94)'; x.beginPath(); x.arc(kx, ky, Rc, 0, 7); x.fill(); x.strokeStyle = '#6B625A'; x.lineWidth = 2; x.stroke();
        for (var hh = 0; hh < 12; hh++) { var ah = hh * Math.PI / 6; x.beginPath(); x.moveTo(kx + Math.sin(ah) * Rc * 0.84, ky - Math.cos(ah) * Rc * 0.84); x.lineTo(kx + Math.sin(ah) * Rc, ky - Math.cos(ah) * Rc); x.stroke(); }
        x.fillStyle = T.c; x.globalAlpha = 0.28; x.beginPath(); x.moveTo(kx, ky); x.arc(kx, ky, Rc * 0.8, -Math.PI / 2, ac, false); x.closePath(); x.fill(); x.globalAlpha = 1;
        x.strokeStyle = T.c; x.lineWidth = 3.5; x.beginPath(); x.moveTo(kx, ky); x.lineTo(kx + Math.cos(ac) * Rc * 0.78, ky + Math.sin(ac) * Rc * 0.78); x.stroke();
        x.fillStyle = T.c; x.font = '800 22px system-ui,sans-serif'; x.textAlign = 'center'; x.fillText(Math.round((T.m || 0) * su(u)) + ' min', kx, ky - Rc - 14); x.fillStyle = '#1F1B18'; x.font = '600 12px system-ui,sans-serif'; x.fillText(T.s || 'Exposición', kx, ky + Rc + 20); x.textAlign = 'left';
      }
      else if (T.k === 'r') {
        /* 31-10-2026 (Fátima: «el reloj, apartarlo del maniquí donde está haciendo el corte, porque no deja visualizar; colocarlo en una
           esquina donde no toque el maniquí»): esquina de abajo a la derecha (antes, a media altura a la derecha) */
        x.setLineDash([]); var R = Math.min(48, bh * 0.1), cx = bx + bw - R - 26, cy = by + bh - R - 40, g = T.g[0] + (T.g[1] - T.g[0]) * su(u);
        x.strokeStyle = '#9A8F84'; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2 - 1.25 * Math.PI, Math.PI / 2, false); x.stroke();
        x.fillStyle = '#6B625A'; x.font = '600 11px system-ui,sans-serif'; x.textAlign = 'center';
        [0, 45, 90, 135, 180, 225].forEach(function (k) { var ex = -Math.sin(k * Math.PI / 180), ey = Math.cos(k * Math.PI / 180); x.beginPath(); x.moveTo(cx + ex * R * 0.88, cy + ey * R * 0.88); x.lineTo(cx + ex * R, cy + ey * R); x.stroke(); x.fillText(k + '°', cx + ex * (R + 17), cy + ey * (R + 13) + 4); });
        x.strokeStyle = T.c; x.lineWidth = 4; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx - Math.sin(g * Math.PI / 180) * R, cy + Math.cos(g * Math.PI / 180) * R); x.stroke();
        x.fillStyle = T.c; x.font = '800 22px system-ui,sans-serif'; x.fillText(Math.round(g) + '°', cx, cy - R - 30); x.fillStyle = '#1F1B18'; x.font = '600 12px system-ui,sans-serif'; x.textAlign = 'right'; x.fillText(T.s, bx + bw - 10, cy + R + 32); x.textAlign = 'left';
      }
    });
    /* la tijera va encima de todo: recorre la línea de corte y, si se desgrafila, deja cortes en punta */
    cola.forEach(function (o) {
      var T = o[0], u = o[1], q = T.p; if (q.length < 4) return;
      x.strokeStyle = T.c; x.lineWidth = 3.4 * Math.max(0.6, s * 1.4); x.setLineDash([10, 6]); var n = parcial(q, u); camino(q, Math.min(n, q.length)); x.stroke(); x.setLineDash([]);
      var j = Math.min(q.length - 4, Math.max(0, n - 4)), ax = ox + q[j] * s, ay = oy + q[j + 1] * s, cx = ox + q[j + 2] * s, cy = oy + q[j + 3] * s, an = Math.atan2(cy - ay, cx - ax);
      /* sin desgrafilar, la tijera va derecha a lo largo del corte (no gira con cada punta) */
      if (!T.g) { var j0 = Math.max(0, j - 8), j1 = Math.min(q.length - 2, j + 10); if (j1 > j0) an = Math.atan2(q[j1 + 1] - q[j0 + 1], q[j1] - q[j0]); }
      if (T.g) { x.lineWidth = 2; for (var i = 0; i + 3 < Math.min(n, q.length); i += 2) { var mx = ox + (q[i] + q[i + 2]) / 2 * s, my = oy + (q[i + 1] + q[i + 3]) / 2 * s, pa = Math.atan2(q[i + 3] - q[i + 1], q[i + 2] - q[i]) + Math.PI / 2; x.beginPath(); x.moveTo(mx - Math.cos(pa) * 7, my - Math.sin(pa) * 7); x.lineTo(mx + Math.cos(pa) * 7, my + Math.sin(pa) * 7); x.stroke(); } }
      if (u <= 0 || u >= 1) return;
      var ab = 0.16 + 0.22 * (Math.sin(u * 90) + 1) / 2; x.save(); x.translate(cx, cy); x.rotate(an); x.strokeStyle = '#1F1B18'; x.fillStyle = '#1F1B18'; x.lineWidth = 3;
      [1, -1].forEach(function (sg) { x.save(); x.rotate(sg * ab); x.beginPath(); x.moveTo(-12, 0); x.lineTo(30, 0); x.stroke(); x.beginPath(); x.arc(-20, 0, 7, 0, 7); x.stroke(); x.restore(); });
      x.beginPath(); x.arc(0, 0, 2.5, 0, 7); x.fill(); x.restore();
    });
    x.restore(); return true;
  }

  /* Escenas listas para pintar: { R, escenas:[{…, anim:{crop,bg,tr}, fondo:dataURL}], preguntas, fondos } */
  /* 30-10-2026 (Fátima: «la animación debe ser más lenta»): las escenas de corte duran ×1,5 de lo que daba el reproductor más lento
     (curso: mínimo 12 s y el doble de la voz; mechón por mechón: lo que pide la escena). Las técnicas de color no cambian (armar). */
  function durCorte(e) { return Math.round(1.5 * Math.max((e.a && e.a.dur) || 0, 12000, String(e.texto || '').length / 14.5 * 2000)); }
  function construir(id) {
    return fondos().then(function (F) {
      var E = escenas(id); if (!E) return null;
      E.fondos = F;
      E.escenas.forEach(function (e) { e.anim = { crop: e.a.crop || RECORTE, bg: FONDO, tr: e.a.tr, banda: e.a.banda || undefined, dur: durCorte(e) }; delete e.a; });
      return E;
    });
  }

  /* Igual que construir(), sin esperas: null si el motor 3D aún no está listo. */
  function construirYa(id) {
    var F = fondosYa(); if (!F) return null;
    var E = escenas(id); if (!E) return null;
    E.fondos = F;
    E.escenas.forEach(function (e) { e.anim = { crop: e.a.crop || RECORTE, bg: FONDO, tr: e.a.tr, banda: e.a.banda || undefined, dur: durCorte(e) }; delete e.a; });
    return E;
  }
  /* Fotograma final de una escena (JPEG) para el libro impreso. */
  function foto(e, w, cal, prog) {   /* prog (opcional, 0–1): fotograma a mitad de la escena; por defecto el final */
    var im = LIENZO[e.vista]; if (!im || !e.anim) return '';
    var c = e.anim.crop, h = Math.round(w * c[3] / c[2]), cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    pinta(cv.getContext('2d'), e.anim, im, 0, 0, w, h, prog == null ? 1 : prog);
    return cv.toDataURL('image/jpeg', cal || 0.8);
  }

  /* Técnicas como datos (b6_pelu_particiones.js): los mismos ayudantes de dibujo y la misma salida que los cortes. */
  var KIT = { P: P, N: N, V3: V3, recta: recta, dirElev: dirElev, pr: pr, seVe: seVe, tramos: tramos, plano: plano, bezier: bezier, linea: linea, lineas: lineas, mechon: mechon, tijera: tijera, rotulo: rotulo, regla: regla, chapa: chapa, r1: r1, thCapa: thCapa, CARA: CARA, NUCA: NUCA, IZQ: IZQ, DER: DER, COL: COL, TINTA: TINTA, ROJO: ROJO, VERDE: VERDE, CORTE: CORTE };
  function armar(fn, F) { if (!F) return null; var E = fn(KIT); if (!E) return null; E.fondos = F; E.escenas.forEach(function (e) { e.anim = { crop: e.a.crop || RECORTE, bg: FONDO, tr: e.a.tr, banda: e.a.banda || undefined, dur: e.a.dur || undefined }; delete e.a; }); return E; }

  /* 18-10-2026 · las láminas de divisiones (trazo 'dv') necesitan b6_divisiones.js en el libro web y en el curso descargado:
     se guarda su código tal cual (se pide al servidor una vez) para copiarlo allí */
  var DIV_SRC = null;
  function divSrc() {
    if (DIV_SRC === null && window.EU_DIVISIONES && window.fetch) {
      DIV_SRC = ''; var el = document.querySelector('script[src*="b6_divisiones.js"]'), u = el ? el.getAttribute('src') : './b6_divisiones.js';
      fetch(u).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) { if (/EU_DIVISIONES/.test(t)) DIV_SRC = t; }).catch(function () {});
    }
    return DIV_SRC || '';
  }
  setTimeout(divSrc, 3000);
  window.EU_DIAGRAMA = {
    ALTURAS: ALTURAS, RECETAS: RECETAS, VISTAS: VISTAS,
    construirCon: function (fn) { return fondos().then(function (F) { return armar(fn, F); }); },
    construirConYa: function (fn) { return armar(fn, fondosYa()); },
    receta: receta, desdeGuia: desdeGuia, libre: libre, construir: construir, fondos: fondos, pinta: pinta,
    construirYa: construirYa, fondosYa: fondosYa, foto: foto, divSrc: divSrc,
    /* código del reproductor para el curso descargado (sin dependencias) */
    js: function () { return 'window.CURSO_ANIM={pinta:(' + pinta.toString() + ')};'; }
  };
})();
