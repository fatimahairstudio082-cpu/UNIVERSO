/* b6_motor_b18_editorial.js — los dos maniquíes en el Editorial (window.EU_MOTOR_B18).
   7-11-2026 (Fátima: «ese motor V18 y Guías 3D solo conectan al Editorial ordenadamente en Peluquería y Colorimetría,
   cursos y libros, dinámicamente con variabilidad»).
   - Guías 3D sigue igual: su motor (EU_DIAGRAMA, EU_PARTICIONES) no se edita.
   - El motor B18 se abre en un marco oculto (la página V18 con su maniquí y sus b18_*.js) y entrega escenas con el mismo formato.
   - Reparto ordenado y fijo: en el orden del catálogo (cortes de EU_CORTES y luego técnicas de EU_PARTICIONES) uno va con el
     maniquí de Guías 3D y el siguiente con el de B18. El mismo corte o técnica sale con el mismo maniquí en el libro y en el curso.
   - Si B18 no tiene ese corte o técnica (p. ej. las clases del cerebro de colorimetría, que solo carga Universo) o falla, va con Guías 3D.
   - Las vistas de B18 llevan el prefijo «b18_» (fondos aparte, sin pisar los de Guías 3D).
   - La pestaña 💇 Guías 3D no cambia: DG.construir solo se reparte mientras se arma el curso (EU_CURSO_ANIM.enriquecer).
   window.EU_MOTOR_B18_OFF = true lo apaga (todo vuelve a Guías 3D).
   7-11-2026 (Fátima: «quita ese maniquí feo, deja solo las clases con el maniquí 3D V18»): todo va con V18; el reparto alterno
   solo con window.EU_MOTOR_B18_ALTERNAR = true. Las clases que B18 no trae se arman con su misma fn sobre el clon V18. */
(function () {
  if (window.EU_MOTOR_B18) return;
  var DG = window.EU_DIAGRAMA, PA = window.EU_PARTICIONES;
  if (!DG || !DG.fondosYa || !DG.construirYa) return;
  var URL = './F%C3%A1tima%20Studio%20V18%20%C2%B7%20Labios%20que%20hablan..html?editorial=1';
  var PRE = 'b18_', FR = null, LISTO = 0, FALLO = 0, PROM = null, MEZCLA = null, BASE = null, ORDEN = null, ACT = 0;

  /* ---- el marco oculto con B18 ---- */
  function win() { return FR && FR.contentWindow; }
  function cargar() {
    if (PROM) return PROM;
    PROM = new Promise(function (ok) {
      var fin = function (b) { if (b) LISTO = 1; else FALLO = 1; ok(!!b); };
      try {
        FR = document.createElement('iframe'); FR.src = URL; FR.title = 'Motor B18 (oculto)'; FR.setAttribute('aria-hidden', 'true'); FR.tabIndex = -1;
        FR.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;height:720px;border:0;pointer-events:none;opacity:0';
        document.body.appendChild(FR);
      } catch (e) { return fin(false); }
      var t0 = Date.now();
      (function espera() {
        var w = win();
        if (w && w.B18_DIAGRAMA && w.Maniqui && w.Maniqui.nucleo) {
          w.B18_DIAGRAMA.fondos().then(function (F) { fin(!!F); }, function () { fin(false); });
          return;
        }
        if (Date.now() - t0 > 30000) return fin(false);   /* sin WebGL o sin la página: todo con Guías 3D */
        setTimeout(espera, 300);
      })();
    });
    return PROM;
  }
  function activo() { return !!window.EU_MOTOR_B18_ON && !window.EU_MOTOR_B18_OFF && !FALLO; }   /* 7-11-2026 (Fátima): el Editorial vuelve al maniquí de Guías 3D; V18 solo con EU_MOTOR_B18_ON */

  /* ---- reparto ordenado: Guías 3D, B18, Guías 3D, B18… ---- */
  function orden() {
    if (ORDEN) return ORDEN;
    var o = {}, n = 0;
    try { (window.EU_CORTES.lista() || []).forEach(function (c) { if (o[c.id] == null) o[c.id] = n++; }); } catch (e) { }
    try { (PA && PA.catalogo ? PA.catalogo() : []).forEach(function (t) { if (t && t.id && o[t.id] == null) o[t.id] = n++; }); } catch (e) { }
    return (ORDEN = o);
  }
  function hash(s) { var h = 0; s = String(s || ''); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  function esB18(clave) {
    if (!clave || !activo()) return false;
    if (!window.EU_MOTOR_B18_ALTERNAR) return true;   /* 7-11-2026 (Fátima): todas las clases con el maniquí V18; el otro solo si V18 falla */
    var o = orden(); return (o[clave] != null ? o[clave] : hash(clave)) % 2 === 1;
  }
  function claveDe(id) { return typeof id === 'object' && id ? (id.id || id.n || '') : String(id || ''); }

  /* ---- escenas de B18 con sus vistas aparte ---- */
  function copia(E) { try { return JSON.parse(JSON.stringify(E)); } catch (e) { return null; } }
  function marcar(E) {
    E = E && copia(E); if (!E || !E.escenas || !E.escenas.length) return null;
    var F = {}; Object.keys(E.fondos || {}).forEach(function (k) { F[PRE + k] = E.fondos[k]; });
    E.fondos = F; E.motor = 'b18';
    E.escenas.forEach(function (e) { if (e.vista && e.vista.indexOf(PRE) !== 0) e.vista = PRE + e.vista; ligero(e); });
    return E;
  }
  /* 7-11-2026 (Fátima: «optimiza el peso sin que pierdan calidad»): los trazos de cabello (líneas 'l' y mechones 'm') van en
     píxeles de un lienzo de 1280; con décimas no se ve diferencia (en el libro la escena mide ≤ 640 px, error < 0,25 px).
     Se redondean a enteros solo en la copia que va al libro y al curso; los tiempos y lo demás no se tocan. */
  function ligero(e) {
    var tr = e && e.anim && e.anim.tr; if (!tr) return;
    var R = function (v) { return typeof v === 'number' ? Math.round(v) : v; };
    tr.forEach(function (T) {
      if (T.k === 'l' && T.p && T.p.map) T.p = T.p.map(R);
      else if (T.k === 'm' && T.f && T.f.map) T.f = T.f.map(function (q) { return q && q.map ? q.map(R) : q; });
    });
  }
  function corteB18(id) {
    var w = win(); if (!LISTO || !w || !w.B18_DIAGRAMA) return null;
    if (typeof id === 'string' && !(w.B18_CORTES && w.B18_CORTES.get(id))) return null;
    try { return marcar(w.B18_DIAGRAMA.construirYa(typeof id === 'object' ? copia(id) : id)); } catch (e) { console.warn('Motor B18 · corte', claveDe(id), e); return null; }
  }
  function tecB18(id) {
    var w = win(); if (!LISTO || !w || !w.B18_PARTICIONES || !w.B18_PARTICIONES.tecnica(id)) return null;
    try { return marcar(w.B18_PARTICIONES.construirYa(id)); } catch (e) { console.warn('Motor B18 · técnica', id, e); return null; }
  }

  /* ---- envoltorios sobre EU_DIAGRAMA (el archivo no se toca) ---- */
  var o = { fondos: DG.fondos, fondosYa: DG.fondosYa, construir: DG.construir, construirYa: DG.construirYa, construirCon: DG.construirCon, construirConYa: DG.construirConYa, foto: DG.foto };
  function mezcla(F) {
    var w = win(), FB = LISTO && w && w.B18_DIAGRAMA.fondosYa();
    if (!FB) return F;
    if (MEZCLA && BASE === F) return MEZCLA;
    var M = {}; Object.keys(F).forEach(function (k) { M[k] = F[k]; }); Object.keys(FB).forEach(function (k) { M[PRE + k] = FB[k]; });
    BASE = F; return (MEZCLA = M);
  }
  DG.fondosYa = function () {
    var F = o.fondosYa.apply(this, arguments); if (!F || !activo()) return F;
    if (!LISTO) { cargar(); return null; }   /* el libro espera a los dos maniquíes y vuelve a armarse (prepararMotor) */
    return mezcla(F);
  };
  DG.fondos = function () {
    var a = o.fondos.apply(this, arguments);
    if (!activo()) return a;
    return Promise.all([a, cargar()]).then(function (r) { return r[0] ? mezcla(r[0]) : r[0]; });
  };
  DG.construirYa = function (id) {
    if (esB18(claveDe(id))) { var E = corteB18(id); if (E) return E; }
    return o.construirYa.apply(this, arguments);
  };
  DG.construir = function (id) {
    var self = this, args = arguments;
    if (!ACT || !esB18(claveDe(id))) return o.construir.apply(self, args);
    return cargar().then(function () { return corteB18(id) || o.construir.apply(self, args); });
  };
  /* técnicas: EU_PARTICIONES pasa su fn; se identifica por E.R.id del armado de Guías 3D */
  function tecnica(E) {
    var id = E && E.R && E.R.id; if (!id || !esB18(id)) return E;
    return tecB18(id) || E;
  }
  /* técnica que B18 no tiene (clases del cerebro de colorimetría): su misma fn se arma con el kit del clon V18 */
  function conB18(fn, E) {
    var w = win(); if (!activo() || !LISTO || typeof fn !== 'function' || !w || !w.B18_DIAGRAMA || !E || !E.escenas || (E.motor === 'b18')) return E;
    if (E.R && E.R.id && !esB18(E.R.id)) return E;
    try { return marcar(w.B18_DIAGRAMA.construirConYa(fn)) || E; } catch (e) { console.warn('Motor B18 · clase', E.R && E.R.id, e); return E; }
  }
  if (o.construirConYa) DG.construirConYa = function (fn) { return conB18(fn, tecnica(o.construirConYa.apply(this, arguments))); };
  if (o.construirCon) DG.construirCon = function () {
    var p = o.construirCon.apply(this, arguments);
    var fn = arguments[0]; return activo() ? Promise.all([p, cargar()]).then(function (r) { return conB18(fn, tecnica(r[0])); }) : p;
  };
  /* 7-11-2026 (Fátima: «reduce las imágenes para sacar libros y cursos de 300 a 500 hojas»): con libros grandes el maniquí
     se guarda más pequeño (ancho ×0,75 desde 200 hojas, ×0,65 desde 400; JPEG 0,72 / 0,68). Hasta 199 hojas, igual que antes. */
  var ESC = { w: 1, q: 1 }, ED0 = window.EU_EDITORIAL;
  if (ED0 && ED0.ensamblar) {
    var ens0 = ED0.ensamblar;
    ED0.ensamblar = function (cfg) {
      var n = +(cfg && cfg.paginas) || 0; ESC = n >= 400 ? { w: 0.65, q: 0.68 } : n >= 200 ? { w: 0.75, q: 0.72 } : { w: 1, q: 1 };
      return ens0.apply(this, arguments);
    };
    Object.keys(ens0).forEach(function (k) { ED0.ensamblar[k] = ens0[k]; });
  }
  function talla(a) { if (ESC.w < 1) { a[1] = Math.round((+a[1] || 640) * ESC.w); a[2] = Math.min(+a[2] || 0.8, ESC.q); } return a; }
  DG.foto = function (e) {
    if (e && e.vista && e.vista.indexOf(PRE) === 0) {
      var w = win(); if (!w || !w.B18_DIAGRAMA) return '';
      var c = copia(e); c.vista = e.vista.slice(PRE.length);
      var a = talla(Array.prototype.slice.call(arguments)); a[0] = c;
      try { return w.B18_DIAGRAMA.foto.apply(w.B18_DIAGRAMA, a); } catch (er) { return ''; }
    }
    return o.foto.apply(this, talla(Array.prototype.slice.call(arguments)));
  };

  /* el curso se arma con DG.construir (async): solo mientras dura, el reparto vale también ahí */
  var CA = window.EU_CURSO_ANIM;
  if (CA && CA.enriquecer) {
    var en0 = CA.enriquecer;
    CA.enriquecer = function () {
      ACT++; var p;
      try { p = en0.apply(this, arguments); } catch (e) { ACT--; throw e; }
      var fin = function () { ACT = Math.max(0, ACT - 1); };
      if (p && p.then) p.then(fin, fin); else fin();
      return p;
    };
    Object.keys(en0).forEach(function (k) { CA.enriquecer[k] = en0[k]; });   /* marcas de otros módulos (_fotosPelu…) */
  }

  window.EU_MOTOR_B18 = { cargar: cargar, esB18: esB18, listo: function () { return !!LISTO; }, fallo: function () { return !!FALLO; } };
})();
