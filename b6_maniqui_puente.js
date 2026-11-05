/* b6_maniqui_puente.js — el maniquí realista de Fátima (V18 «Labios que hablan») es el maniquí de 💇 Guías 3D.
   5-11-2026 (Fátima: «sustituir el maniquí de Guías 3D por el realista que te entrego, con las funcionalidades que ya
   tenía Guías 3D, anclándolo a este, y dejando las funcionalidades del realista»).
   · En la pestaña Guías 3D el visor de la cabeza de antes se oculta y en su sitio va maniqui/maniqui_v18.html (el V18
     tal cual + su bloque «9. Conexión con el sistema»). El lienzo de antes sigue existiendo, oculto, para exportar.
   · El corte cargado (biblioteca de cortes, «Crear mi corte», Escáner, Laboratorio) llega al V18 como receta del sistema:
     EU_G3D_DIAGRAMA.recetaDe (b6_guias_3d_diagrama.js) + largos de cada capa con EU_CALCULO_CAPILAR.calcular.
   · Los botones de 📐 Diagramación llevan al V18 a esa fase; los de vista mueven su cámara.
   · No toca b6_guias_3d.js ni el V18 original subido. window.EU_MANIQUI_PUENTE_OFF = true deja el visor de antes. */
(function () {
  'use strict';
  if (window.EU_MANIQUI_PUENTE) return;
  var URL = 'maniqui/maniqui_v18.html?v=1799100000008';
  var PERFIL = { recta: 'recto', redondeada: 'redondo', u: 'u', v: 'v', a: 'v' };
  var ONDA = { ondulado: 0.45, rizado: 0.8, afro: 1, liso: 0, liso_extremo: 0, fino: 0, poblado: 0.15 };
  var FASE = { todo: 'inicio', seccion: 'divisiones', particion: 'divisiones', guia: 'atras', capas: 'atras', lateral: 'delante', frente: 'delante', dos: 'atras' };
  var CAM = { frente: 'faceCheck', perfilD: 'cutRight', perfilI: 'cutLeft', nuca: 'cutBack', alto: 'coronilla', diag: 'busto' };

  /* largo de cada capa (cm, desde su raíz) con la calculadora capilar del sistema */
  function capas(pila, R) {
    var CC = window.EU_CALCULO_CAPILAR, c = null;
    try { c = CC && CC.calcular({ capas: pila, guias: R.guias, ref: R.ref }, R.medidas); } catch (e) { c = null; }
    if (c && c.capas && c.capas.length) return c.capas.map(function (k) { return { raizY: k.raiz[1], largo: k.largo }; });
    /* sin calculadora: raíces repartidas de la nuca a la coronilla y largo de la guía */
    return pila.map(function (g, i) { return { raizY: -3 + 12 * i / Math.max(1, pila.length - 1), largo: 20 }; });
  }
  function datos(R, E) {
    var pila = (R.capas && R.capas.pila && R.capas.pila.length) ? R.capas.pila : [0];
    var pilaF = (R.frente && R.frente.pila && R.frente.pila.length) ? R.frente.pila : pila;
    var tx = {};
    ((E && E.escenas) || []).forEach(function (e) {
      var k = e.tipo === 'lavado' ? 'lavado' : e.tipo === 'seccion' ? 'seccion' : e.tipo === 'capas' ? 'capas' : e.tipo === 'frente' ? 'frente' : /^queda/.test(e.tipo) ? 'queda' : null;
      if (k && !tx[k]) tx[k] = e.texto;
    });
    var cA = capas(pila, R), cF = capas(pilaF, R);
    var bajo = Math.min.apply(null, cA.concat(cF).map(function (k) { return k.raizY - k.largo; }));
    /* el cabello de partida siempre más largo que lo que se va a cortar (tail del V18 ≈ 0,03 − largo) */
    var yBajo = 0.119 + bajo * (0.105 / 8.91);
    return {
      n: R.n, liso: !!R.liso, pila: pila, pilaF: pilaF, capas: cA, capasF: cF, perfil: PERFIL[R.linea] || 'recto',
      nivelar: !!R.nivelar, fleco: R.fleco || null, textos: tx, wave: ONDA[R.cab] != null ? ONDA[R.cab] : null,
      largoInicial: Math.min(0.9, Math.max(0.62, 0.03 - yBajo + 0.12))
    };
  }

  function montar(el) {
    if (el._v18 || !el.cv || el.getAttribute('aria-hidden') === 'true' || window.EU_MANIQUI_PUENTE_OFF) return;
    var marco = el.cv.parentNode; if (!marco) return;
    var fr = document.createElement('iframe');
    fr.src = URL; fr.title = 'Maniquí realista · Guías 3D'; fr.setAttribute('allow', 'autoplay');
    fr.style.cssText = 'display:block;width:100%;height:min(84vh,860px);min-height:560px;border:0;background:#14171f';
    /* 5-11-2026 (Fátima): el V18 suma, no reemplaza. El lienzo del motor de Guías 3D no se oculta:
       con 📐 Diagramación encendida (también «Ver mi corte», Escáner y Laboratorio) se ve el motor de siempre
       sobre los fondos del V18; apagada, el V18 en 3D (ver revisar). */
    marco.appendChild(fr);
    el._v18 = { fr: fr, clave: '', modo: '' };
  }
  function win(el) { try { var w = el._v18 && el._v18.fr.contentWindow; return w && w.CorteMotor && w.CorteMotor.receta ? w : null; } catch (e) { return null; } }

  function revisar(el) {
    montar(el);
    /* encendida: el motor de Guías 3D con todas sus escenas (guía móvil, reloj, transportador); apagada: el V18 */
    if (el._v18) { var on = !!(el._dg && el._dg.on); el.cv.style.display = on ? '' : 'none'; el._v18.fr.style.display = on ? 'none' : 'block'; }
    var w = win(el), D3 = window.EU_G3D_DIAGRAMA; if (!w || !D3) return;
    var o = D3.recetaDe(el); if (!o || !o.R) return;
    var R = o.R, clave = JSON.stringify([R.id, R.n, R.cab, R.liso, R.linea, R.capas && R.capas.pila, R.frente && R.frente.pila, !!o.E]);
    if (clave !== el._v18.clave) { el._v18.clave = clave; el._v18.modo = ''; try { w.CorteMotor.receta(datos(R, o.E)); } catch (e) { console.warn('Maniquí V18', e); } }
    /* 📐 Diagramación: cada botón lleva al maniquí a esa fase del corte */
    var st = el._dg, m = st && st.on ? (st.modo || 'todo') : '';
    if (m !== el._v18.modo) {
      el._v18.modo = m;
      if (m) { try { w.CorteMotor.sistema.pause(); } catch (e) { } }
    }
  }

  /* vistas de Guías 3D → cámara del maniquí */
  function enganchar() {
    var C = window.customElements && window.customElements.get('guias-3d');
    if (!C || C.prototype._euV18) return;
    C.prototype._euV18 = true;
    var iv = C.prototype.irVista;
    C.prototype.irVista = function (v) {
      var r = iv.apply(this, arguments), w = win(this);
      if (w && v && CAM[v.id]) { try { w.CorteMotor.sistema.cam(CAM[v.id]); } catch (e) { } }
      return r;
    };
  }
  if (window.customElements && window.customElements.whenDefined) window.customElements.whenDefined('guias-3d').then(enganchar);

  setInterval(function () { document.querySelectorAll('guias-3d:not([aria-hidden])').forEach(revisar); }, 700);

  /* ───── Libro y curso: las imágenes de corte salen del maniquí V18 (5-11-2026, Fátima) ─────
     EU_DIAGRAMA.foto(e) es la imagen de cada escena de corte en el libro (pe_clase, pe_guia3d, pe_diagrama…).
     Si la escena es de un corte, se devuelve el fotograma del V18 del mismo momento del corte, con el mismo tamaño.
     Los fotogramas se hacen una vez por corte en un V18 oculto; la primera vez el libro sale con la imagen de antes
     y el Editorial vuelve a armar cuando están listos (como hace el maniquí de EU_DIAGRAMA). */
  var FOTOS = {}, COLA = [], PEDIDO = {}, OCULTO = null, OCUP = 0, USO = 0;
  /* momento del corte en el V18 para cada escena del motor */
  function momento(tipo) {
    tipo = String(tipo || '');
    var T = [[/^lavado/, 'inicio'], [/^(seccion|oblicua)/, 'divisiones'], [/^(particion|coronilla)/, 'particion'], [/^guia/, 'guia'],
      [/^capas/, 'capas'], [/^angulos/, 'angulos'], [/^error_/, 'error'], [/^(peinado_nuca|pix)/, 'peinado_nuca'], [/^lateral/, 'lado'],
      [/^peinado_lateral/, 'peinado_lado'], [/^frente/, 'delante'], [/^peinado_frente/, 'peinado_frente'], [/^emparejar/, 'emparejar'],
      [/^pulir/, 'pulir'], [/^queda_(corto_)?lateral/, 'queda_lado'], [/^queda_(corto_)?nuca/, 'queda_atras'], [/^queda_frente/, 'queda_frente']];
    for (var i = 0; i < T.length; i++) if (T[i][0].test(tipo)) return T[i][1];
    return null;
  }
  function claveR(R) { return JSON.stringify([R.id, R.n, R.cab, R.liso, R.linea, R.nivelar, R.fleco, R.capas && R.capas.pila, R.frente && R.frente.pila]); }
  function rearmar() {
    [window.EU_PELU_LIBRO_DG, window.EU_PELU_RECETA].forEach(function (m) { if (m && m.limpiar) { try { m.limpiar(); } catch (e) { } } });
    document.querySelectorAll('editorial-escolar').forEach(function (e) { if (e.cfg && e.cfg.materia === 'pelu' && e.programar) e.programar(); });
  }
  function oculto() {
    if (OCULTO) return OCULTO;
    OCULTO = document.createElement('iframe'); OCULTO.src = URL; OCULTO.setAttribute('aria-hidden', 'true'); OCULTO.tabIndex = -1;
    OCULTO.style.cssText = 'position:fixed;left:-20000px;top:0;width:1340px;height:760px;border:0;pointer-events:none';
    document.body.appendChild(OCULTO); return OCULTO;
  }
  /* copia el lienzo del maniquí (el del iframe) a un lienzo de esta página */
  function copia(src) { var c = document.createElement('canvas'); c.width = src.width; c.height = src.height; c.getContext('2d').drawImage(src, 0, 0); return c; }
  function hacer(it, w) {
    var S = w.CorteMotor.sistema, F = {};
    w.CorteMotor.receta(datos(it.R, null));
    var pl = S.plan(), mech = pl.filter(function (p) { return p.tipo === 'mechon'; });
    var at = mech.filter(function (p) { return p.zona === 'atras'; }), de = mech.filter(function (p) { return p.zona === 'delante'; });
    var qu = pl.filter(function (p) { return p.tipo === 'queda'; }), fin = S.estado().total;
    var en = function (p, u) { return p ? p.t0 + p.dur * u : 0; };
    var de0 = function (f) { return de[Math.min(de.length - 1, Math.floor(de.length * f))]; }, at0 = function (f) { return at[Math.min(at.length - 1, Math.floor(at.length * f))]; };
    var div = pl.filter(function (p) { return p.tipo === 'divisiones'; })[0];
    /* un momento distinto del corte para cada tipo de escena: así no se repite la misma imagen en el libro */
    var M = {
      inicio: [en(pl[0], 0.9), 'busto'], divisiones: [en(div, 0.95), 'cutBack'], particion: [en(div, 0.95), 'coronilla'],
      guia: [en(at0(0), 0.38), 'cutBack'], capas: [en(at0(0.35), 0.38), 'cutBack'], angulos: [en(at0(0.55), 0.4), 'cutLeft'],
      error: [en(at0(0.75), 0.5), 'cutBack'], peinado_nuca: [en(at0(0.95), 0.62), 'cutBack'],
      lado: [en(de0(0), 0.38), null], peinado_lado: [en(de0(0.3), 0.45), null], delante: [en(de0(0.6), 0.38), 'faceCheck'],
      peinado_frente: [en(de0(0.85), 0.5), 'faceCheck'], emparejar: [en(de0(0.95), 0.7), null],
      pulir: [fin, 'cutRight'], queda_lado: [fin, 'cutLeft'], queda_atras: [fin, 'cutBack'], queda_frente: [fin, 'busto']
    };
    Object.keys(M).forEach(function (k) { if (M[k][0] || k === 'inicio') F[k] = copia(S.lienzo(M[k][0], M[k][1])); });
    S.salir();
    return F;
  }
  function siguiente() {
    if (OCUP || !COLA.length) return;
    OCUP = 1;
    var it = COLA.shift(), fr = oculto(), n = 0;
    (function esperar() {
      var w = null; try { w = fr.contentWindow; } catch (e) { w = null; }
      if (!(w && w.CorteMotor && w.CorteMotor.sistema && w.CorteMotor.sistema.lienzo)) {
        if (++n > 300) { OCUP = 0; return; }
        return setTimeout(esperar, 100);
      }
      try { FOTOS[it.k] = hacer(it, w); } catch (e) { console.warn('Maniquí V18 · fotogramas', e); FOTOS[it.k] = {}; }
      OCUP = 0;
      if (COLA.length) setTimeout(siguiente, 20); else rearmar();
    })();
  }
  function pedir(R, k) { if (PEDIDO[k]) return; PEDIDO[k] = 1; COLA.push({ R: R, k: k }); setTimeout(siguiente, 0); }
  /* fotograma del V18 recortado al mismo encuadre que pide la escena (alto/ancho del recorte del motor) */
  function recorte(src, w, rel) {
    var h = Math.round(w * rel), c = document.createElement('canvas'); c.width = w; c.height = h;
    var sw = src.width, sh = src.height, r0 = sh / sw, cw, ch;
    if (r0 > rel) { cw = sw; ch = sw * rel; } else { ch = sh; cw = sh / rel; }
    var x = c.getContext('2d'); x.fillStyle = '#14171f'; x.fillRect(0, 0, w, h);
    x.drawImage(src, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, w, h);
    return c;
  }
  /* ── fondos del motor hechos con el V18 ── */
  var VISTA = {}, CONV = { haciendo: 0, fallo: 0, inicio: 0 };
  /* true cuando todas las vistas del motor ya son del V18 (o si el V18 no puede, para no bloquear) */
  function convertir(DG) {
    if (CONV.fallo) return true;
    var C = DG.camaras ? DG.camaras() : {}, ks = Object.keys(C);
    if (!ks.length) return false;
    var hechas = DG._euFondosV18 || (DG._euFondosV18 = {}), faltan = ks.filter(function (k) { return !hechas[k]; });
    if (!faltan.length) return true;
    var w = null; try { w = oculto().contentWindow; } catch (e) { w = null; }
    var S = w && w.CorteMotor && w.CorteMotor.sistema;
    if (!S || !S.vista) {
      if (!CONV.inicio) CONV.inicio = Date.now();
      if (Date.now() - CONV.inicio > 25000) { CONV.fallo = 1; console.warn('Maniquí V18: no se pudieron hacer los fondos; quedan los de antes'); return true; }
      if (!CONV.haciendo) { CONV.haciendo = 1; setTimeout(function () { CONV.haciendo = 0; if (convertir(DG)) { limpiarCaches(); rearmar(); } }, 400); }
      return false;
    }
    try {
      faltan.forEach(function (k) {
        if (!VISTA[k]) {
          var c = C[k].cam, p = C[k].pos || c.position, q = c.quaternion;
          VISTA[k] = copia(S.vista([p.x, p.y, p.z], [q.x, q.y, q.z, q.w], c.fov, 1280, 720));
        }
        DG.fondoNuevo(k, VISTA[k]); hechas[k] = 1;
      });
    } catch (e) { console.warn('Maniquí V18 · fondos', e); CONV.fallo = 1; }
    return true;
  }
  function esperarV18(DG) {
    return new Promise(function (ok) { (function mira() { if (window.EU_MANIQUI_PUENTE_OFF || convertir(DG)) ok(); else setTimeout(mira, 300); })(); });
  }
  function limpiarCaches() { [window.EU_PELU_LIBRO_DG, window.EU_PELU_RECETA].forEach(function (m) { if (m && m.limpiar) { try { m.limpiar(); } catch (e) { } } }); }

  function engancharDG() {
    var DG = window.EU_DIAGRAMA;
    if (!DG || DG._euV18) return !!DG;
    DG._euV18 = true;
    var marca = function (E) { if (E && E.escenas && E.R) E.escenas.forEach(function (e) { e._R = E.R; }); return E; };
    var cy = DG.construirYa, co = DG.construir, fo = DG.foto;
    DG.construirYa = function () { return marca(cy.apply(this, arguments)); };
    DG.construir = function () { var p = co.apply(this, arguments); return p && p.then ? p.then(marca) : marca(p); };
    /* fondos del motor → vistas del V18 (todas las animaciones: cortes, técnicas, color, libro web, curso).
       Mientras se hacen, fondosYa() responde «aún no» y fondos() espera: así nadie arma con el maniquí de antes. */
    var fy = DG.fondosYa, fs = DG.fondos;
    if (fy && DG.camaras && DG.fondoNuevo) {
      DG.fondosYa = function () {
        var F = fy.apply(this, arguments);
        if (!F || window.EU_MANIQUI_PUENTE_OFF) return F;
        return convertir(DG) ? F : null;
      };
      DG.fondos = function () {
        var self = this, a = arguments;
        return fs.apply(self, a).then(function (F) { return esperarV18(DG).then(function () { return F; }); });
      };
    }
    DG.foto = function (e, w, cal, prog) {
      var R = e && e._R, m = R && !window.EU_MANIQUI_PUENTE_OFF && momento(e.tipo);
      if (m) {
        var k = claveR(R), F = FOTOS[k];
        if (F && F[m]) {
          try { var c = (e.anim && e.anim.crop) || [0, 0, 900, 720]; USO++; return recorte(F[m], w || 640, c[3] / c[2]).toDataURL('image/jpeg', cal || 0.8); } catch (er) { }
        } else if (!F) pedir(R, k);
      }
      return fo.apply(this, arguments);
    };
    return true;
  }
  /* el Editorial vuelve a cargar b6_pelu_diagrama.js (lista diferida) y crea otro EU_DIAGRAMA: se engancha de nuevo */
  engancharDG();
  try {
    var dgActual = window.EU_DIAGRAMA;
    Object.defineProperty(window, 'EU_DIAGRAMA', { configurable: true, enumerable: true,
      get: function () { return dgActual; },
      set: function (v) { dgActual = v; try { engancharDG(); } catch (e) { } } });
  } catch (e) { setInterval(engancharDG, 400); }

  /* escáner de cortes (5-11-2026, Fátima: «fuera el maniquí viejo»): el maniquí de cada imagen es el fotograma
     «cómo queda» del corte en el V18 (mismo corte y vista que la imagen guardada, que queda solo de respaldo) */
  var MANV = {};
  function manV18(e) {
    var DG = window.EU_DIAGRAMA; if (!e || !DG || window.EU_MANIQUI_PUENTE_OFF || !DG.construirYa) return null;
    var k = e.man || JSON.stringify([e.corte, e.R, e.vista]);
    if (MANV[k]) return MANV[k];
    try {
      var E = DG.construirYa(e.R ? DG.libre(e.R) : e.corte); if (!E || !E.escenas) return null;
      var es = E.escenas, quiero = e.vista === 'frente' ? 'queda_frente' : 'queda_nuca';
      var s = es.filter(function (x) { return x.tipo === quiero; })[0] || es.filter(function (x) { return /^queda/.test(x.tipo || ''); })[0];
      if (!s || !s._R || !FOTOS[claveR(s._R)]) { if (s && s._R) pedir(s._R, claveR(s._R)); return null; }
      var u = DG.foto(s, 640, 0.82, 1); if (u) MANV[k] = u; return u || null;
    } catch (er) { return null; }
  }
  /* pasos de Guías 3D como dibujos (pe_g3d_*): el paso k de n del corte = una escena del corte en el V18, repartidas en orden */
  function pasoV18(corte, cab, k, n) {
    var DG = window.EU_DIAGRAMA; if (!DG || window.EU_MANIQUI_PUENTE_OFF || !DG.construirYa || !DG.receta) return null;
    var key = 'g3d|' + corte + '|' + (cab || '') + '|' + k + '|' + n; if (MANV[key]) return MANV[key];
    try {
      var R = DG.receta(corte, cab); if (!R) return null;
      var E = DG.construirYa(R); if (!E || !E.escenas) return null;
      var es = E.escenas.filter(function (x) { return x._R && momento(x.tipo); }); if (!es.length) return null;
      var s = es[Math.min(es.length - 1, Math.round(k * (es.length - 1) / Math.max(1, (n || 4) - 1)))];
      if (!FOTOS[claveR(s._R)]) { pedir(s._R, claveR(s._R)); return null; }
      var u = DG.foto(s, 640, 0.86, 1); if (u) MANV[key] = u; return u || null;
    } catch (er) { return null; }
  }
  window.EU_MANIQUI_PUENTE = { pasoV18: pasoV18, manV18: manV18, datos: datos, url: URL, fotos: function (R) { return FOTOS[claveR(R)] || null; }, pedir: function (R) { pedir(R, claveR(R)); }, momento: momento, pendientes: function () { return COLA.length + OCUP; }, usados: function () { return USO; } };
})();
