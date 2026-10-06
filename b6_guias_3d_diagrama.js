/* b6_guias_3d_diagrama.js — «📐 Diagramación» dentro de la pestaña 💇 Guías 3D.
   Botón en la barra del visor (junto a «Cabezas») que pinta, sobre el mismo lienzo del maniquí, la diagramación
   animada del corte cargado con el motor EU_DIAGRAMA (b6_pelu_diagrama.js): seccionado, línea guía en la nuca,
   capas de abajo arriba con la regla 0–225°, lateral (división de oreja a oreja, secciones verticales o
   sobredirección a un punto si se desfila), frente (líneas verticales, guía a su altura, corte en arco o recto) y
   «Lateral + nuca» en dos cabezas. Respeta el cabello elegido: liso extremo → secciones horizontales.
   Apagado, el visor se pinta exactamente igual que antes (se llama al pintar2D original). Al exportar
   (PDF, lámina, vídeo) tampoco interviene. No edita b6_guias_3d.js: envuelve su prototipo, como
   b6_boton_biblioteca.js. Cargar después de b6_cortes.js y b6_pelu_diagrama.js. */
(function () {
  'use strict';
  if (window.EU_G3D_DIAGRAMA) return;

  var ESC = [['todo', '▶ Todo'], ['seccion', 'Seccionado'], ['guia', 'Guía nuca'], ['capas', 'Capas'], ['lateral', 'Lateral · corte'], ['frente', 'Frente · guía'], ['dos', '◫ Lateral + nuca']];
  var DUR = 9000, CACHE = {}, IMG = {};
  var CHIP_ON = 'background:#7c3aed;color:#fff;border:1px solid #7c3aed;border-radius:999px;padding:5px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit';
  var CHIP_OFF = 'background:transparent;color:#cbd5e1;border:1px solid #3b3b5c;border-radius:999px;padding:5px 11px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit';

  /* corte y cabello de la guía cargada: «<corte> · <cabello>» (EU_CORTES.guiaDe) o una guía propia */
  function recetaDe(el) {
    var DG = window.EU_DIAGRAMA, CO = window.EU_CORTES, g = el.guia; if (!DG || !g) return null;
    var partes = String(g.nombre || '').split(' · '), c = null, cab = null;
    if (CO) {
      c = (CO.lista() || []).filter(function (x) { return x.n === partes[0]; })[0] || null;
      cab = ((CO.cabellos && CO.cabellos()) || []).filter(function (t) { return t.n === partes[1]; })[0] || null;
    }
    var clave = (c ? c.id : 'guia:' + g.nombre) + '|' + (cab ? cab.id : '') + '|' + (g.pasos || []).length;
    if (CACHE[clave]) return CACHE[clave];
    var full = c && CO.get(c.id);
    var R = c ? DG.receta(c.id, cab ? cab.id : null) : DG.desdeGuia(g, { n: partes[0] || 'Mi corte' });
    var o = CACHE[clave] = { R: R, E: null, err: null, full: full };
    if (R) DG.construir(R).then(function (E) { o.E = E; if (E) Object.keys(E.fondos).forEach(function (v) { if (!IMG[v]) { IMG[v] = new Image(); IMG[v].src = E.fondos[v]; } }); })
      .catch(function (e) { o.err = e.message || String(e); });
    return o;
  }

  function texto(x, t, x0, y0, w, lh, max) {
    var pal = String(t || '').split(' '), l = '', n = 0, y = y0;
    for (var i = 0; i < pal.length; i++) {
      var b = l ? l + ' ' + pal[i] : pal[i];
      if (x.measureText(b).width > w && l) { x.fillText(l, x0, y); y += lh; l = pal[i]; if (++n >= max - 1) { l += '…'; break; } } else l = b;
    }
    if (l) x.fillText(l, x0, y);
  }

  function pintar(el) {
    var x = el.cv.getContext('2d'), W = el.cv.width, H = el.cv.height, st = el._dg, o = recetaDe(el), DG = window.EU_DIAGRAMA;
    x.fillStyle = '#F2EEE7'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#B5476B'; x.fillRect(0, 0, W, 6);
    if (!o || !o.R) { x.fillStyle = '#1F1B18'; x.font = '600 28px Georgia,serif'; x.fillText('Carga un corte para ver su diagramación.', 48, 90); return; }
    if (!o.E) { x.fillStyle = '#1F1B18'; x.font = '600 28px Georgia,serif'; x.fillText(o.err ? 'No se pudo preparar: ' + o.err : 'Preparando la diagramación de ' + o.R.n + '…', 48, 90); return; }
    var L = o.E.escenas, ahora = performance.now(), t0 = st.t0 || (st.t0 = ahora), dt = ahora - t0;
    var modo = st.modo || 'todo', e, prog, k;
    if (modo === 'todo') { k = Math.floor(dt / DUR) % L.length; e = L[k]; prog = Math.min(1, (dt % DUR) / (DUR * 0.85)); }
    else if (modo === 'dos') { prog = Math.min(1, (dt % DUR) / (DUR * 0.85)); }
    else { e = L.filter(function (z) { return z.tipo === modo; })[0] || L[0]; prog = Math.min(1, (dt % DUR) / (DUR * 0.85)); }
    x.fillStyle = '#B5476B'; x.font = '600 18px Georgia,serif'; x.fillText(('Diagramación · ' + o.R.n + (o.R.liso ? ' · liso extremo' : '')).toUpperCase(), 40, 38);
    x.fillStyle = '#1F1B18'; x.font = '600 32px Georgia,serif';
    if (modo === 'dos') {
      x.fillText('Dos cabezas: lateral y nuca', 40, 78);
      var lat = L.filter(function (z) { return z.tipo === 'lateral'; })[0], cap = L.filter(function (z) { return z.tipo === 'capas'; })[0];
      DG.pinta(x, lat.anim, IMG.lateral, 30, 100, 600, 470, prog);
      DG.pinta(x, cap.anim, IMG.nuca, 650, 100, 600, 470, prog);
      x.fillStyle = '#1F1B18'; x.font = '700 15px system-ui,sans-serif'; x.fillText('LATERAL', 44, 590); x.fillText('NUCA · capas de abajo arriba', 664, 590);
      e = { texto: lat.texto };
    } else {
      x.fillText(e.t, 40, 78);
      DG.pinta(x, e.anim, IMG[e.vista], 30, 100, W - 60, 480, prog);
    }
    x.fillStyle = 'rgba(20,16,14,.88)'; x.fillRect(0, H - 104, W, 104);
    x.fillStyle = '#FFE7A8'; x.font = '21px Georgia,serif'; texto(x, e.texto, 40, H - 70, W - 80, 28, 3);
  }

  function ponerBarra(el) {
    if (el._dgBarra || !el.btnCab || !el.btnCab.length) return;
    var barra = el.btnCab[0].parentNode; if (!barra) return;
    var fila = document.createElement('div');
    fila.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:7px';
    var lab = document.createElement('span'); lab.textContent = 'Diagramación';
    lab.style.cssText = 'font-size:10px;color:#7c7c9e;letter-spacing:.06em;text-transform:uppercase;font-weight:700';
    fila.appendChild(lab);
    var on = document.createElement('button'); on.textContent = '📐 Diagramación'; on.setAttribute('data-eu-dg', '1');
    var chips = [];
    function sincro() {
      var st = el._dg || {};
      on.style.cssText = st.on ? CHIP_ON : CHIP_OFF;
      chips.forEach(function (b) { b.style.cssText = (st.on && st.modo === b._m) ? CHIP_ON : CHIP_OFF; b.style.display = st.on ? '' : 'none'; });
    }
    on.onclick = function () { el._dg = el._dg || { modo: 'todo' }; el._dg.on = !el._dg.on; el._dg.t0 = 0; sincro(); };
    fila.appendChild(on);
    ESC.forEach(function (m) {
      var b = document.createElement('button'); b.textContent = m[1]; b._m = m[0];
      b.onclick = function () { el._dg = el._dg || {}; el._dg.on = true; el._dg.modo = m[0]; el._dg.t0 = 0; sincro(); };
      chips.push(b); fila.appendChild(b);
    });
    barra.parentNode.insertBefore(fila, barra.nextSibling);
    el._dgBarra = fila; sincro();
  }

  window.customElements.whenDefined('guias-3d').then(function () {
    var P = window.customElements.get('guias-3d').prototype;
    if (P.__dg) return; P.__dg = 1;
    var p2d = P.pintar2D, r3d = P.render3D;
    /* Mientras se ve la diagramación, la cabeza 3D del visor no se usa: si se siguiera renderizando sin leerla,
       el trabajo se acumula y al apagar el primer fotograma tarda segundos en vaciar la cola. */
    P.render3D = function () {
      if (this._dg && this._dg.on && !this.exportando && !this.animando && this.getAttribute('aria-hidden') !== 'true') return;
      return r3d.apply(this, arguments);
    };
    P.pintar2D = function () {
      if (this._dg && this._dg.on && !this.exportando && !this.animando && this.cv && window.EU_DIAGRAMA && this.getAttribute('aria-hidden') !== 'true') {
        try { return pintar(this); } catch (e) { console.warn('Diagramación', e); }
      }
      return p2d.apply(this, arguments);
    };
  });

  /* el botón se pone cuando el visor existe (el componente se monta al abrir la pestaña) */
  var PEND = 0;
  function revisar() { PEND = 0; document.querySelectorAll('guias-3d:not([aria-hidden])').forEach(ponerBarra); }
  function arrancar() { new MutationObserver(function () { if (!PEND) PEND = setTimeout(revisar, 150); }).observe(document.body, { childList: true, subtree: true }); revisar(); }
  if (document.body) arrancar(); else document.addEventListener('DOMContentLoaded', arrancar);

  window.EU_G3D_DIAGRAMA = { recetaDe: recetaDe };
})();
