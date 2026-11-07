/* b18_panel.js — «📐 Animaciones del motor» en la página V18 (7-11-2026, Fátima: «¿qué pasó con todas las animaciones que
   te pedí que hiciera este motor de Guías 3D?»).
   Reproduce sobre este mismo maniquí las escenas del motor clonado (B18_DIAGRAMA, B18_CORTES, B18_PARTICIONES): los cortes de la
   Biblioteca con su seccionado, guía, capas, ángulos, «Línea por línea», lateral, frente, «Cómo queda», pixie, y las técnicas
   (diagramas de Fátima y las del Cerebro de color). Solo lee: no toca los cortes propios de V18, Guías 3D, Firebase ni la
   memoria del navegador. Sin voz (regla de B18): título y texto de cada escena debajo del dibujo. Cargar después de los b18_*. */
(function () {
  'use strict';
  if (window.B18_PANEL) return;
  var GRUPOS = [['todo', '▶ Todo'], ['seccion', 'Seccionado'], ['particion', 'Particiones atrás'], ['guia', 'Guía nuca'], ['capas', 'Capas'],
    ['oblicua', 'Oblicua'], ['coronilla*', 'Coronilla'], ['angulos', '📐 Ángulos y cm'], ['peinado_*', 'Línea por línea'], ['lateral', 'Lateral · corte'],
    ['emparejar', 'Emparejar'], ['frente', 'Frente · guía'], ['pulir', 'Pulir puntas'], ['queda*', 'Cómo queda'], ['pix_*', 'Pixie · referencia'], ['pixc_*', 'Pixie corto']];
  var ORO = '#B08D57', AZ = '#16223A';
  var CH_ON = 'background:' + ORO + ';color:#fff;border:1px solid ' + ORO + ';border-radius:999px;padding:5px 11px;font:700 12px system-ui,sans-serif;cursor:pointer';
  var CH_OFF = 'background:transparent;color:#e7dccb;border:1px solid #5a4a36;border-radius:999px;padding:5px 11px;font:600 12px system-ui,sans-serif;cursor:pointer';
  var st = { E: null, L: [], i: 0, t0: 0, pausa: false, grupo: 'todo', raf: 0 }, ui = null;

  function enGrupo(e, g) {
    if (g === 'todo') return true;
    var t = e.tipo || '';
    return /\*$/.test(g) ? t.indexOf(g.slice(0, -1)) === 0 : t === g;
  }
  function durDe(e) { return Math.max(8000, (e.anim && e.anim.dur) || 0, String(e.texto || '').length * 70); }

  function opciones() {
    var h = '', C = window.B18_CORTES, P = window.B18_PARTICIONES, fams = {};
    if (C && C.lista) {
      C.lista().forEach(function (c) { (fams[c.fam] = fams[c.fam] || []).push(c); });
      Object.keys(fams).forEach(function (f) {
        var nf = (C.familias && (C.familias() || []).filter(function (x) { return x.id === f; })[0] || {}).n || f;
        h += '<optgroup label="Cortes · ' + esc(nf) + '">' + fams[f].map(function (c) { return '<option value="c:' + c.id + '">' + esc(c.n) + '</option>'; }).join('') + '</optgroup>';
      });
    }
    if (P && P.catalogo) h += '<optgroup label="Técnicas">' + P.catalogo().map(function (t) { return '<option value="t:' + t.id + '">' + esc(t.n || t.id) + '</option>'; }).join('') + '</optgroup>';
    return h;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function crear() {
    if (ui) return ui;
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(10,12,20,.94);display:none;overflow:auto;color:#f3ead9;font:14px system-ui,sans-serif';
    d.innerHTML = '<div style="max-width:1100px;margin:0 auto;padding:16px">' +
      '<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px"><b style="font:600 18px Georgia,serif;color:' + ORO + '">📐 Animaciones del motor · maniquí V18</b>' +
      '<select data-b18="sel" style="flex:1;min-width:220px;padding:7px;border-radius:8px;background:' + AZ + ';color:#fff;border:1px solid #5a4a36">' + opciones() + '</select>' +
      '<button data-b18="cerrar" style="' + CH_OFF + '">✕ Cerrar</button></div>' +
      '<div data-b18="chips" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px"></div>' +
      '<div style="background:#E6EAF1;border-radius:10px;overflow:hidden"><canvas data-b18="cv" width="1280" height="720" style="display:block;width:100%;height:auto"></canvas></div>' +
      '<div style="display:flex;gap:8px;align-items:center;margin:10px 0"><button data-b18="ant" style="' + CH_OFF + '">‹ Anterior</button><button data-b18="pausa" style="' + CH_OFF + '">❚❚ Pausa</button><button data-b18="sig" style="' + CH_OFF + '">Siguiente ›</button><span data-b18="num" style="opacity:.75;font-size:12px"></span></div>' +
      '<div data-b18="tit" style="font:600 16px Georgia,serif;color:' + ORO + '"></div><div data-b18="txt" style="margin-top:4px;line-height:1.5;max-width:900px"></div>' +
      '<div data-b18="aviso" style="margin-top:8px;opacity:.7;font-size:12px"></div></div>';
    document.body.appendChild(d);
    var q = function (k) { return d.querySelector('[data-b18="' + k + '"]'); };
    ui = { d: d, q: q };
    q('cerrar').onclick = cerrar;
    q('sel').onchange = function () { cargar(this.value); };
    q('pausa').onclick = function () { st.pausa = !st.pausa; if (!st.pausa) st.t0 = performance.now() - st.pos * durDe(st.L[st.i]); this.textContent = st.pausa ? '▶ Seguir' : '❚❚ Pausa'; };
    q('ant').onclick = function () { ir(st.i - 1); };
    q('sig').onclick = function () { ir(st.i + 1); };
    return ui;
  }

  function chips() {
    var E = st.E, box = ui.q('chips'); if (!E) { box.innerHTML = ''; return; }
    box.innerHTML = '';
    GRUPOS.forEach(function (g) {
      if (g[0] !== 'todo' && !E.escenas.some(function (e) { return enGrupo(e, g[0]); })) return;
      var b = document.createElement('button'); b.textContent = g[1]; b.style.cssText = st.grupo === g[0] ? CH_ON : CH_OFF;
      b.onclick = function () { st.grupo = g[0]; chips(); lista(); ir(0); };
      box.appendChild(b);
    });
  }
  function lista() { st.L = st.E ? st.E.escenas.filter(function (e) { return enGrupo(e, st.grupo); }) : []; if (!st.L.length && st.E) st.L = st.E.escenas.slice(); }
  function ir(i) {
    if (!st.L.length) return; st.i = (i + st.L.length) % st.L.length; st.t0 = performance.now(); st.pos = 0;
    var e = st.L[st.i];
    ui.q('tit').textContent = e.t || ''; ui.q('txt').textContent = e.texto || '';
    ui.q('num').textContent = 'Escena ' + (st.i + 1) + ' de ' + st.L.length;
  }

  function cargar(v) {
    var D = window.B18_DIAGRAMA; if (!D) return;
    ui.q('aviso').textContent = 'Preparando el maniquí…';
    var k = String(v || '').slice(2), es = /^t:/.test(v) ? window.B18_PARTICIONES.construir(k) : D.construir(k);
    Promise.resolve(es).then(function (E) {
      if (!E || !E.escenas || !E.escenas.length) { ui.q('aviso').textContent = 'Este corte o técnica no tiene escenas.'; return; }
      st.E = E; st.grupo = 'todo'; st.pausa = false; ui.q('pausa').textContent = '❚❚ Pausa'; ui.q('aviso').textContent = '';
      chips(); lista(); ir(0);
    }).catch(function (er) { ui.q('aviso').textContent = 'No se pudo preparar: ' + (er && er.message || er); });
  }

  function cuadro() {
    st.raf = requestAnimationFrame(cuadro);
    var D = window.B18_DIAGRAMA, e = st.L[st.i]; if (!D || !e || !e.anim) return;
    var dur = durDe(e);
    if (!st.pausa) { st.pos = (performance.now() - st.t0) / dur; if (st.pos >= 1.12) { ir(st.i + 1); return; } }
    var cv = ui.q('cv'), c = e.anim.crop || [0, 0, 1280, 720], h = Math.round(1280 * c[3] / c[2]);
    if (cv.height !== h) cv.height = h;
    var im = D.LIENZO && D.LIENZO[e.vista]; if (!im) return;
    try { D.pinta(cv.getContext('2d'), e.anim, im, 0, 0, cv.width, cv.height, Math.min(1, st.pos)); } catch (er) { }
  }

  function abrir() {
    crear(); ui.d.style.display = 'block';
    var sel = ui.q('sel'); if (!sel.options.length) sel.innerHTML = opciones();
    if (!st.E && sel.value) cargar(sel.value);
    cancelAnimationFrame(st.raf); cuadro();
  }
  function cerrar() { if (ui) ui.d.style.display = 'none'; cancelAnimationFrame(st.raf); }

  function boton() {
    if (document.querySelector('[data-b18="abrir"]')) return;
    var b = document.createElement('button'); b.setAttribute('data-b18', 'abrir'); b.textContent = '📐 Animaciones del motor';
    b.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:99998;background:' + ORO + ';color:#fff;border:0;border-radius:999px;padding:10px 16px;font:700 13px system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.35);cursor:pointer';
    b.onclick = abrir; document.body.appendChild(b);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boton); else boton();

  window.B18_PANEL = { abrir: abrir, cerrar: cerrar, cargar: function (v) { crear(); cargar(v); } };
})();
