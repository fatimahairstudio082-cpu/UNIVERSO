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
  var URL = 'maniqui/maniqui_v18.html?v=1799100000004';
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
    el.cv.style.display = 'none';
    marco.appendChild(fr);
    el._v18 = { fr: fr, clave: '', modo: '' };
  }
  function win(el) { try { var w = el._v18 && el._v18.fr.contentWindow; return w && w.CorteMotor && w.CorteMotor.receta ? w : null; } catch (e) { return null; } }

  function revisar(el) {
    montar(el);
    var w = win(el), D3 = window.EU_G3D_DIAGRAMA; if (!w || !D3) return;
    var o = D3.recetaDe(el); if (!o || !o.R) return;
    var R = o.R, clave = JSON.stringify([R.id, R.n, R.cab, R.liso, R.linea, R.capas && R.capas.pila, R.frente && R.frente.pila, !!o.E]);
    if (clave !== el._v18.clave) { el._v18.clave = clave; el._v18.modo = ''; try { w.CorteMotor.receta(datos(R, o.E)); } catch (e) { console.warn('Maniquí V18', e); } }
    /* 📐 Diagramación: cada botón lleva al maniquí a esa fase del corte */
    var st = el._dg, m = st && st.on ? (st.modo || 'todo') : '';
    if (m !== el._v18.modo) {
      el._v18.modo = m;
      if (m) { var f = FASE[m] || (/^queda/.test(m) ? 'queda' : /^(peinado|pix)/.test(m) ? 'atras' : 'inicio'); try { w.CorteMotor.sistema.fase(f); } catch (e) { } }
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

  window.EU_MANIQUI_PUENTE = { datos: datos, url: URL };
})();
