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

  var ESC = [['todo', '▶ Todo'], ['seccion', 'Seccionado'], ['guia', 'Guía nuca'], ['capas', 'Capas'], ['oblicua', 'Oblicua'], ['coronilla', 'Coronilla △'], ['angulos', '📐 Ángulos y cm'], ['lateral', 'Lateral · corte'], ['frente', 'Frente · guía'], ['pulir', 'Pulir puntas'], ['dos', '◫ Lateral + nuca']];
  var DUR = 15000, CACHE = {}, IMG = {};
  var CHIP_ON = 'background:#7c3aed;color:#fff;border:1px solid #7c3aed;border-radius:999px;padding:5px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit';
  var CHIP_OFF = 'background:transparent;color:#cbd5e1;border:1px solid #3b3b5c;border-radius:999px;padding:5px 11px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit';

  /* corte y cabello de la guía cargada: «<corte> · <cabello>» (EU_CORTES.guiaDe) o una guía propia */
  function recetaDe(el) {
    var DG = window.EU_DIAGRAMA, CO = window.EU_CORTES, g = el.guia;
    /* corte creado en «Crear mi corte»: manda sobre la guía cargada */
    if (DG && el._dg && el._dg.libre && window.EU_GEOMETRIA_CAPILAR) {
      var kL = 'libre:' + JSON.stringify(el._dg.libre);
      if (!CACHE[kL]) {
        var oL = CACHE[kL] = { R: EU_GEOMETRIA_CAPILAR.receta(el._dg.libre), E: null, err: null };
        DG.construir(oL.R).then(function (E) { oL.E = E; if (E) Object.keys(E.fondos).forEach(function (v) { if (!IMG[v]) { IMG[v] = new Image(); IMG[v].src = E.fondos[v]; } }); })
          .catch(function (e) { oL.err = e.message || String(e); });
      }
      return CACHE[kL];
    }
    if (!DG || !g) return null;
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
    var crear = document.createElement('button'); crear.textContent = '✏️ Crear mi corte'; crear.style.cssText = CHIP_OFF;
    var panel = panelCrear(el, function () { sincro(); });
    crear.onclick = function () { var vis = panel.style.display === 'none'; panel.style.display = vis ? '' : 'none'; crear.style.cssText = vis ? CHIP_ON : CHIP_OFF; };
    fila.appendChild(crear); fila.parentNode.insertBefore(panel, fila.nextSibling);
    /* «🔎 Escáner de cortes» (b6_pelu_escaner_cortes.js): qué hay, qué falta, y abrir este panel ya relleno */
    var esc = document.createElement('button'); esc.textContent = '🔎 Escáner de cortes'; esc.style.cssText = CHIP_OFF;
    esc.onclick = function () { if (window.EU_ESCANER_CORTES) window.EU_ESCANER_CORTES.abrir(el); };
    fila.appendChild(esc);
    /* «🧪 Laboratorio» (b6_pelu_laboratorio.js): miles de cortes calculados dentro de los rangos que se elijan */
    var lab = document.createElement('button'); lab.textContent = '🧪 Laboratorio'; lab.style.cssText = CHIP_OFF;
    lab.onclick = function () { if (window.EU_LAB_CORTES) window.EU_LAB_CORTES.abrir(el); };
    fila.appendChild(lab);
    el._dgCrear = { sincro: sincro, abrir: function (o) { panel.style.display = ''; crear.style.cssText = CHIP_ON; if (panel._poner) panel._poner(o); try { panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { } } };
    el._dgBarra = fila; sincro();
  }

  /* ─── «Crear mi corte»: cada capa con su elevación; el motor arma el corte completo y lo anima ─── */
  function panelCrear(el, alAplicar) {
    var GC = window.EU_GEOMETRIA_CAPILAR, DG = window.EU_DIAGRAMA;
    var d = document.createElement('div'); d.style.cssText = 'display:none;margin-top:8px;padding:12px;border:1px solid #3b3b5c;border-radius:12px;background:#15152b;color:#e2e8f0;font:12px system-ui,sans-serif';
    if (!GC || !DG) { d.textContent = 'El constructor de cortes no está cargado.'; return d; }
    var CAMPO = 'background:#0f0f22;color:#e2e8f0;border:1px solid #3b3b5c;border-radius:8px;padding:6px 8px;font:12px system-ui,sans-serif';
    function fila(et, nodo) { var f = document.createElement('label'); f.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:5px 0'; var s = document.createElement('span'); s.textContent = et; s.style.cssText = 'min-width:118px;color:#a5a5c8;font-weight:700'; f.appendChild(s); f.appendChild(nodo); d.appendChild(f); return nodo; }
    function sel(ops) { var x = document.createElement('select'); x.style.cssText = CAMPO; ops.forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; x.appendChild(op); }); return x; }
    function ent(ph, w) { var x = document.createElement('input'); x.placeholder = ph; x.style.cssText = CAMPO + ';width:' + (w || 260) + 'px'; return x; }
    var tec = fila('Técnica', sel([['', '— elige una técnica o un corte mío —']]));
    function llenarTec() {
      tec.innerHTML = ''; [['', '— elige una técnica o un corte mío —']].concat(GC.TECNICAS.map(function (t) { return ['t:' + t.id, t.n + (t.validar ? ' (a validar por Fátima)' : '')]; }), GC.mios().map(function (m) { return ['m:' + m.n, '★ ' + m.n]; }))
        .forEach(function (o) { var op = document.createElement('option'); op.value = o[0]; op.textContent = o[1]; tec.appendChild(op); });
    }
    llenarTec();
    var nom = fila('Nombre', ent('Mi corte'));
    var cap = fila('Capas (atrás)', ent('0, 25, 45, 90, 135', 300));
    var rap = document.createElement('div'); rap.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin:2px 0 6px 126px';
    GC.ELEVACIONES.forEach(function (g) { var b = document.createElement('button'); b.textContent = '+' + g + '°'; b.style.cssText = CHIP_OFF + ';padding:3px 8px'; b.onclick = function (e) { e.preventDefault(); cap.value = (cap.value.trim() ? cap.value.replace(/[,\s]+$/, '') + ', ' : '') + g; }; rap.appendChild(b); });
    var bor = document.createElement('button'); bor.textContent = '⌫ quitar última'; bor.style.cssText = CHIP_OFF + ';padding:3px 8px'; bor.onclick = function (e) { e.preventDefault(); cap.value = cap.value.replace(/,?\s*[^,]*$/, ''); }; rap.appendChild(bor);
    d.appendChild(rap);
    var fre = fila('Capas (frente)', ent('vacío = igual que atrás', 300));
    var par = fila('Partición', sel([['vertical', 'Vertical'], ['horizontal', 'Horizontal (liso extremo)'], ['oblicua', 'Oblicua · box universal']]));
    var alt = fila('Guía del frente', sel(Object.keys(DG.ALTURAS).map(function (k) { return [k, 'A 0° ' + DG.ALTURAS[k].n]; })));
    var lin = fila('Línea de atrás', sel([['', 'Según la cabeza'], ['recta', 'Recta (cuadrado)'], ['redondeada', 'Redondeada (U)'], ['v', 'En V'], ['a', 'En A (V invertida)'], ['diag_delante', 'Diagonal hacia delante'], ['diag_atras', 'Diagonal hacia atrás']]));
    alt.value = 'nariz';
    var aca = fila('Acabado', sel([['recto', 'Recto'], ['desgrafilado', 'Desgrafilado']]));
    var lfr = fila('Puntas de delante', sel([['', 'Redondeadas'], ['recta', 'Rectas']]));
    var gui = fila('Guía por capa', ent('m = móvil, f = fija · ej.: m, m, f (vacío = todas móviles)', 300));
    var ref = fila('Ángulo medido', sel([['craneo', 'Desde el cráneo (90° = perpendicular a la curva)'], ['suelo', 'Desde el suelo (90° = horizontal)']]));
    var cor = document.createElement('input'); cor.type = 'checkbox'; var corG = ent('grados (vacío = la capa más alta)', 200);
    var fc = document.createElement('span'); fc.style.cssText = 'display:inline-flex;gap:8px;align-items:center'; fc.appendChild(cor); fc.appendChild(corG); fila('Coronilla △ oblicua', fc);
    var CA = window.EU_CALCULO_CAPILAR, med0 = CA ? CA.medidas() : { guia: 20, contorno: 56, nucaCoronilla: 17, estandar: true };
    var mg = ent('cm', 70), mc = ent('cm', 70), mn = ent('cm', 70); mg.value = med0.guia; mc.value = med0.contorno; mn.value = med0.nucaCoronilla;
    var fm = document.createElement('span'); fm.style.cssText = 'display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap';
    [['Largo de la guía', mg], ['Contorno', mc], ['Nuca–coronilla', mn]].forEach(function (q) { var l = document.createElement('span'); l.textContent = q[0]; l.style.color = '#a5a5c8'; fm.appendChild(l); fm.appendChild(q[1]); });
    var gm = document.createElement('button'); gm.textContent = '💾 Medidas de la clienta'; gm.style.cssText = CHIP_OFF + ';padding:3px 8px';
    gm.onclick = function (e) { e.preventDefault(); if (CA) nota.textContent = CA.guardarMedidas({ guia: mg.value, contorno: mc.value, nucaCoronilla: mn.value }) ? 'Medidas guardadas para los cálculos.' : 'No se pudieron guardar.'; };
    fm.appendChild(gm); fila(med0.estandar ? 'Medidas (maniquí estándar, a validar)' : 'Medidas de la clienta', fm);
    var nota = document.createElement('div'); nota.style.cssText = 'margin:6px 0;color:#fbbf24;min-height:14px'; d.appendChild(nota);
    function nums(t) { return String(t || '').split(/[^0-9.]+/).filter(Boolean).map(Number).filter(function (n) { return !isNaN(n); }); }
    function leer() {
      var o = { n: nom.value.trim() || 'Mi corte', capas: nums(cap.value), frente: nums(fre.value), part: par.value, altura: alt.value, linea: lin.value, acabado: aca.value,
        medidas: { guia: +mg.value || med0.guia, contorno: +mc.value || med0.contorno, nucaCoronilla: +mn.value || med0.nucaCoronilla },
        lineaFrente: lfr.value, guias: String(gui.value || '').split(/[^a-zA-Z]+/).filter(Boolean).map(function (x) { return /^f/i.test(x) ? 'f' : 'm'; }), ref: ref.value };
      if (cor.checked) { o.coronilla = true; var cg = nums(corG.value)[0]; if (cg != null) o.coronillaG = cg; }
      return o;
    }
    function poner(o) { nom.value = o.n || ''; cap.value = (o.capas || []).join(', '); fre.value = (o.frente || []).join(', '); par.value = o.part || 'vertical'; alt.value = o.altura || 'nariz'; lin.value = o.linea || ''; aca.value = o.acabado || 'recto';
      lfr.value = o.lineaFrente || ''; gui.value = (o.guias || []).join(', '); ref.value = o.ref || 'craneo'; cor.checked = !!o.coronilla; corG.value = o.coronillaG != null ? o.coronillaG : ''; nota.textContent = o.validar ? 'Elevaciones propuestas: a validar por Fátima. Cámbialas capa a capa si hace falta.' : (o.texto || ''); }
    tec.onchange = function () { var v = tec.value; if (!v) return; var o = v.slice(0, 2) === 't:' ? GC.tecnica(v.slice(2)) : GC.mios().filter(function (m) { return m.n === v.slice(2); })[0]; if (o) poner(o); };
    var bar = document.createElement('div'); bar.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-top:6px';
    var ver = document.createElement('button'); ver.textContent = '▶ Ver mi corte'; ver.style.cssText = CHIP_ON;
    ver.onclick = function (e) {
      e.preventDefault(); var o = leer(); if (!o.capas.length) { nota.textContent = 'Escribe al menos una capa con su elevación (0–225°).'; return; }
      var t = tec.value.slice(0, 2) === 't:' ? GC.tecnica(tec.value.slice(2)) : null; if (t && t.texto && o.n === t.n) o.texto = t.texto;
      el._dg = { on: true, modo: (el._dg && el._dg.modo) || 'todo', t0: 0, libre: o }; nota.textContent = 'Armando «' + o.n + '» con ' + o.capas.length + ' capas…'; alAplicar();
      if (CA) { try { nota.textContent = CA.calcular(o, o.medidas).texto; } catch (er) { } }
    };
    var gua = document.createElement('button'); gua.textContent = '💾 Guardar como mi corte'; gua.style.cssText = CHIP_OFF;
    gua.onclick = function (e) { e.preventDefault(); var o = leer(); if (!o.capas.length) return; nota.textContent = GC.guardar(o) ? 'Guardado «' + o.n + '» en tus cortes.' : 'No se pudo guardar en este navegador.'; llenarTec(); };
    var sal = document.createElement('button'); sal.textContent = '↩ Volver al corte cargado'; sal.style.cssText = CHIP_OFF;
    sal.onclick = function (e) { e.preventDefault(); if (el._dg) { el._dg.libre = null; el._dg.t0 = 0; } nota.textContent = ''; alAplicar(); };
    bar.appendChild(ver); bar.appendChild(gua); bar.appendChild(sal); d.appendChild(bar);
    d._poner = function (o) { llenarTec(); tec.value = ''; poner(o); };
    return d;
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
