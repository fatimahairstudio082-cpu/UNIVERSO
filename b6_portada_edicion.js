/* b6_portada_edicion.js — Portadas con retícula de color, paletas de los folletos y edición a mano
   (window.EU_PORTADA).
   · Portada: si no se sube imagen, el hueco se llena con una composición en retícula (cuadros, cuartos de
     círculo y triángulos) con los colores del diseño y un motivo de la materia: frutas para cocina y
     ciencias, mapa del país para geografía, figura humana para anatomía, recipientes para química,
     pieza isométrica para tecnología, símbolos para matemáticas, contabilidad y física.
     Estilos: retícula, mosaico, círculos, bandas (cfg.acab.portada; 'no' deja el hueco).
   · Paletas: las paletas del motor de folletos (FOLLETO_MOTOR.TEMAS) se ofrecen en el panel y fijan
     cfg.acab.acc / acc2, que ya aplica EU_CONECTORES.
   · Edición: botón «Editar texto» en la barra del Editorial. Cualquier página se edita en el sitio
     (títulos, nombres, respuestas, ejemplos). Lo editado se guarda por libro y sale igual en PDF, EPUB y
     HTML; «Deshacer ediciones» vuelve al texto generado.
   Cargar al final (después de b6_rotacion.js). */
(function () {
  var ED = window.EU_EDITORIAL;
  if (!ED || window.EU_PORTADA) return;
  var H = ED.H, esc = H.esc, NS = 'xmlns="http://www.w3.org/2000/svg"';
  function rgb(c) { c = String(c || '#000').replace('#', ''); if (c.length === 3) c = c.replace(/./g, '$&$&'); return [0, 2, 4].map(function (i) { return parseInt(c.slice(i, i + 2), 16) || 0; }); }
  function hex(a) { return '#' + a.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  function osc(c, k) { return hex(rgb(c).map(function (v) { return v * (1 - k); })); }
  function clr(c, k) { return hex(rgb(c).map(function (v) { return v + (255 - v) * k; })); }
  function lum(c) { var a = rgb(c); return a[0] * .299 + a[1] * .587 + a[2] * .114; }
  function r1(n) { return Math.round(n * 10) / 10; }
  function anidar(s, x, y, w, h) { return String(s || '').replace(/<svg\b([^>]*?)\sstyle="[^"]*"/, '<svg$1').replace(/<svg\b/, '<svg x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" preserveAspectRatio="xMidYMid meet"'); }

  /* ─────────── motivo de la materia ─────────── */
  var SIMB = { mate: ['π', '√', '÷', '×', '∑', '%', '=', '∞'], conta: ['€', '%', 'Σ', '+', '−', '=', '$', '¢'], fisica: ['F', 'v', 'Ω', 'λ', 'g', 'E', 'm', 'a'], quimica: ['H', 'O', 'C', 'N', 'pH', 'Na', 'Fe', 'Cu'], musica: ['♪', '♫', '♩', '♬'], lengua: ['A', 'b', 'Ñ', 'é', '¿', '¡', 'z', 'ü'], ingles: ['A', 'b', 'C', 'd', '!', '?', 'E', 'f'] };
  function motivo(C, w, h, r) {
    var m = C.mat, T = C.T, B = window.EU_BOTANICA, S = window.EU_SVG;
    try {
      if (/^(cocina|reposteria|panaderia|pasteleria|batidos|natu|bio|infantil)$/.test(m) && B) { var ids = { reposteria: ['huevo', 'trigo', 'limon'], panaderia: ['trigo', 'avena'], pasteleria: ['fresa', 'cacao', 'frambuesa'], batidos: ['mango', 'kiwi', 'fresa'] }[m] || H.mezcla(r, ['manzana', 'fresa', 'hoja', 'flor', 'naranja', 'pera']).slice(0, 3); return anidar(B.bodegon(ids, C, { fondo: false, alto: Math.round(600 * h / w) }), 0, 0, w, h); }
      if (/^(geografia|sociales|historia)$/.test(m) && window.EU_MAPAS_DATOS && window.EU_MAPAS_DATOS[C.pk]) { var D = window.EU_MAPAS_DATOS[C.pk]; return '<svg x="0" y="0" width="' + w + '" height="' + h + '" viewBox="-10 -10 ' + (D.w + 20) + ' ' + (D.h + 20) + '" preserveAspectRatio="xMidYMid meet"><path d="' + D.d + '" fill="' + T.bg + '" stroke="' + T.ink + '" stroke-width="2"/></svg>'; }
      if (/^(anat|efisica)$/.test(m) && window.EU_ANATOMIA) { var A = window.EU_ANATOMIA, F = A.figFrente(C, { n: 8, alto: 300, cx: 60, capa: m === 'anat' ? 'esqueleto' : 'musculos', fill: T.bg }); return '<svg x="0" y="0" width="' + w + '" height="' + h + '" viewBox="0 0 120 312" preserveAspectRatio="xMidYMid meet">' + F.s + '</svg>'; }
      if (m === 'quimica' && S && S.recipiente) return anidar(S.recipiente(C, 'matraz', 250, 150, ''), 0, 0, w, h);
      if (/^(tecno|arte)$/.test(m) && window.EU_LAMINAS_PLUS) { var V = window.EU_LAMINAS_PLUS.generadores.tec_iso({}, C, r); var s1 = /<svg[\s\S]*?<\/svg>/.exec(V.fig); return s1 ? anidar(s1[0], 0, 0, w, h) : ''; }
    } catch (e) { }
    var L = SIMB[m] || [String(C.matN || '·').charAt(0).toUpperCase()], t = H.pick(r, L);
    return '<text x="' + w / 2 + '" y="' + (h * .68) + '" text-anchor="middle" font-size="' + (h * .62) + '" font-family="' + esc(T.tit) + '" font-weight="' + T.peso + '" fill="' + T.bg + '">' + esc(t) + '</text>';
  }

  /* ─────────── composiciones ─────────── */
  function composicion(C, estilo, altoMm) {
    var T = C.T, W = 600, Hh = Math.round(W * altoMm / 176), r = H.rng(H.hash(C.titulo + C.mat + estilo) + (C.semilla || 1)), s = '';
    var pal = [T.acc, T.acc2, T.soft, T.soft2, osc(T.acc, .3), clr(T.acc2, .45), clr(T.acc, .55), T.ink].filter(function (c, i, a) { return a.indexOf(c) === i; });
    var P = function () { return H.pick(r, pal); };
    if (estilo === 'reticula' || estilo === 'mosaico') {
      var nc = estilo === 'mosaico' ? 8 : 6, cw = W / nc, nr = Math.max(2, Math.round(Hh / cw)), ch = Hh / nr, grande = [E(r, 0, nc - 2), E(r, 0, nr - 2)];
      for (var y = 0; y < nr; y++) for (var x = 0; x < nc; x++) {
        if (x >= grande[0] && x < grande[0] + 2 && y >= grande[1] && y < grande[1] + 2) continue;
        var X = x * cw, Y = y * ch, a = P(), b = P(); if (b === a) b = pal[(pal.indexOf(a) + 1) % pal.length];
        s += '<rect x="' + r1(X) + '" y="' + r1(Y) + '" width="' + r1(cw + .5) + '" height="' + r1(ch + .5) + '" fill="' + a + '"/>';
        var f = r();
        if (estilo === 'mosaico') s += '<polygon points="' + (f < .5 ? [[X, Y], [X + cw, Y], [X, Y + ch]] : [[X + cw, Y], [X + cw, Y + ch], [X, Y + ch]]).map(function (q) { return r1(q[0]) + ',' + r1(q[1]); }).join(' ') + '" fill="' + b + '"/>';
        else if (f < .3) { var q = E(r, 0, 3), cx = X + (q % 2) * cw, cy = Y + (q > 1 ? ch : 0); s += '<path d="M' + r1(cx) + ',' + r1(cy) + ' L' + r1(cx + (q % 2 ? -cw : cw)) + ',' + r1(cy) + ' A' + r1(cw) + ',' + r1(ch) + ' 0 0 ' + (q === 0 || q === 3 ? 1 : 0) + ' ' + r1(cx) + ',' + r1(cy + (q > 1 ? -ch : ch)) + ' Z" fill="' + b + '"/>'; }
        else if (f < .5) s += '<circle cx="' + r1(X + cw / 2) + '" cy="' + r1(Y + ch / 2) + '" r="' + r1(Math.min(cw, ch) * .32) + '" fill="' + b + '"/>';
        else if (f < .62) s += '<polygon points="' + r1(X) + ',' + r1(Y + ch) + ' ' + r1(X + cw / 2) + ',' + r1(Y) + ' ' + r1(X + cw) + ',' + r1(Y + ch) + '" fill="' + b + '"/>';
      }
      var gx = grande[0] * cw, gy = grande[1] * ch, gw = cw * 2, gh = ch * 2;
      s += '<rect x="' + r1(gx) + '" y="' + r1(gy) + '" width="' + r1(gw) + '" height="' + r1(gh) + '" fill="' + T.acc + '"/><g transform="translate(' + r1(gx + gw * .08) + ' ' + r1(gy + gh * .08) + ')">' + motivo(C, r1(gw * .84), r1(gh * .84), r) + '</g>';
    } else if (estilo === 'circulos') {
      s += '<rect width="' + W + '" height="' + Hh + '" fill="' + T.soft + '"/>';
      for (var i = 0; i < 7; i++) { var rr = E(r, 40, 130); s += '<circle cx="' + E(r, 0, W) + '" cy="' + E(r, 0, Hh) + '" r="' + rr + '" fill="' + P() + '" opacity=".9"/>'; }
      var mw = Hh * .8; s += '<circle cx="' + W / 2 + '" cy="' + Hh / 2 + '" r="' + r1(mw * .6) + '" fill="' + T.acc + '"/><g transform="translate(' + r1(W / 2 - mw / 2) + ' ' + r1(Hh / 2 - mw / 2) + ')">' + motivo(C, r1(mw), r1(mw), r) + '</g>';
    } else {
      s += '<rect width="' + W + '" height="' + Hh + '" fill="' + T.soft2 + '"/>';
      for (var j = -6; j < 16; j++) s += '<polygon points="' + (j * 60) + ',' + Hh + ' ' + (j * 60 + 34) + ',' + Hh + ' ' + (j * 60 + 34 + Hh) + ',0 ' + (j * 60 + Hh) + ',0" fill="' + pal[(j + 16) % pal.length] + '"/>';
      var bw = Hh * .8; s += '<rect x="' + r1(W / 2 - bw / 2) + '" y="' + r1(Hh * .1) + '" width="' + r1(bw) + '" height="' + r1(bw) + '" fill="' + T.acc + '"/><g transform="translate(' + r1(W / 2 - bw * .42) + ' ' + r1(Hh * .14) + ')">' + motivo(C, r1(bw * .84), r1(bw * .84), r) + '</g>';
    }
    return '<svg ' + NS + ' viewBox="0 0 ' + W + ' ' + Hh + '" style="width:100%;height:' + altoMm + 'mm;display:block;border-radius:' + Math.min(T.r, 10) + 'px" preserveAspectRatio="xMidYMid slice"><clipPath id="pcl"><rect width="' + W + '" height="' + Hh + '"/></clipPath><g clip-path="url(#pcl)">' + s + '</g></svg>';
  }
  function E(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  var HUECO = /<div style="height:(\d+(?:\.\d+)?)mm;border:0\.5mm dashed[^"]*">([^<]*portada[^<]*)<\/div>/;
  var ESTILOS = ['reticula', 'mosaico', 'circulos', 'bandas'];
  /* Portada con el motor de plantillas del Estudio (FOLLETO_MOTOR + FOLLETO_DISENOS): la rejilla, la
     paleta y los acabados de un diseño de folleto, con una celda por unidad del libro. */
  var CACHE_PL = {};
  function disenosPortada() { var D = window.FOLLETO_DISENOS; return D ? D.lista().filter(function (d) { return d.rejilla && !/^(r1|rlista)$/.test(d.rejilla); }) : []; }
  function temaCercano(acc, TM) { var a = rgb(acc), best = null, bd = 1e9; Object.keys(TM).forEach(function (k) { var b = rgb(TM[k].acento), d = (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]) + (a[2] - b[2]) * (a[2] - b[2]); if (d < bd) { bd = d; best = k; } }); return best; }
  function plantillaPortada(C, altoMm, ctx) {
    var M = window.FOLLETO_MOTOR, lista = disenosPortada(); if (!M || !M.pintar || !lista.length || typeof document === 'undefined') return null;
    var A = (C.cfg && C.cfg.acab) || {}, dis = lista.filter(function (d) { return d.id === A.portadaDis; })[0] || lista[H.hash(C.titulo + C.mat) % lista.length];
    var tema = A.paletaF && M.TEMAS[A.paletaF] ? A.paletaF : temaCercano(C.T.acc, M.TEMAS);
    var us = ((ctx && ctx.unidades) || []).slice(0, 9), celdas = us.map(function (u, i) { return { titulo: H.sub(u.t, C), texto: 'Unidad ' + (i + 1) }; });
    if (!celdas.length) celdas = [{ titulo: C.titulo, texto: C.matN }];
    var W = 1400, Hc = Math.round(W * altoMm / 176), clave = [dis.id, tema, W, Hc, C.semilla, celdas.map(function (c) { return c.titulo; }).join('|')].join('#');
    var url = CACHE_PL[clave];
    if (!url) {
      try {
        var cv = document.createElement('canvas'); cv.width = W; cv.height = Hc;
        M.pintar(cv.getContext('2d'), W, Hc, { tema: tema, rejilla: dis.rejilla, adornos: dis.adornos, celdas: celdas, cabecera: {}, pie: {} }, { formaCelda: dis.formaCelda || 'suave', semillaFoto: (C.semilla || 1) * 7 });
        url = cv.toDataURL('image/jpeg', 0.9);
        if (!document.fonts || document.fonts.status === 'loaded') CACHE_PL[clave] = url;
      } catch (e) { console.warn('portada plantilla', e); return null; }
    }
    return '<img src="' + url + '" alt="' + esc(dis.nombre || 'Portada') + '" style="width:100%;height:' + altoMm + 'mm;object-fit:cover;display:block;border-radius:' + Math.min(C.T.r, 10) + 'px"/>';
  }
  function postPortada(h, pg, C, ctx) {
    if (pg.tipo !== 'portada') return h;
    var A = (C.cfg && C.cfg.acab) || {}, est = A.portada || 'auto'; if (est === 'no') return h;
    var m = HUECO.exec(h); if (!m) return h;
    if (est === 'auto' || est === 'plantilla') { var pl = plantillaPortada(C, +m[1], ctx); if (pl) return h.replace(HUECO, pl); if (est === 'plantilla') est = 'auto'; }
    if (est === 'auto') est = ESTILOS[H.hash(C.titulo + C.mat) % ESTILOS.length];
    return h.replace(HUECO, composicion(C, est, +m[1]));
  }

  /* ─────────── edición ─────────── */
  var EDIC = {};
  function clave(cfg) { return [cfg.pais, cfg.nivel, cfg.curso, cfg.materia, cfg.prod, cfg.paginas, cfg.semilla, cfg.titulo || '', JSON.stringify(cfg.op || {})].join('|'); }
  function postEdicion(h, pg, C, modo, ctx) { var E0 = ctx && ctx.ediciones; return E0 && E0[pg.num] != null ? E0[pg.num] : h; }
  ED.registrar({ post: function (h, pg, C, modo, ctx) { return postEdicion(postPortada(h, pg, C, ctx), pg, C, modo, ctx); } });
  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) { var res = ens(cfg); try { var k = clave(cfg); res.ediciones = EDIC[k] || (EDIC[k] = {}); } catch (e) { } return res; };

  function parchear(K) {
    var P = K.prototype; if (P._edicion) return; P._edicion = true;
    var barra0 = P.construirBarra, pintar0 = P.pintar;
    P.construirBarra = function () {
      barra0.apply(this, arguments);
      var yo = this, b = this.barra, ref = b.querySelector('button'), st = ref ? ref.style.cssText : '';
      var mk = function (t, fn, on) { var x = document.createElement('button'); x.style.cssText = st; if (on) { x.style.background = '#a855f7'; x.style.color = '#fff'; x.style.borderColor = '#a855f7'; } x.textContent = t; x.onclick = fn; return x; };
      var n = this.res && this.res.ediciones ? Object.keys(this.res.ediciones).length : 0, ult = b.lastChild;
      b.insertBefore(mk(this.editando ? '✓ Terminar de editar' : '✏️ Editar texto', function () { yo.editando = !yo.editando; if (yo.editando && yo.vista === 'miniaturas') yo.vista = 'pagina'; yo.construirBarra(); yo.pintar(); }, this.editando), ult);
      if (n) b.insertBefore(mk('↺ Deshacer ediciones (' + n + ')', function () { var E0 = yo.res.ediciones; Object.keys(E0).forEach(function (q) { delete E0[q]; }); yo.construirBarra(); yo.pintar(); }), ult);
    };
    P.pintar = function () {
      pintar0.apply(this, arguments);
      if (!this.editando || !this.res || !this.escena) return;
      var yo = this, E0 = this.res.ediciones || (this.res.ediciones = {}), t = null;
      this.escena.querySelectorAll('.pg').forEach(function (el) {
        var num = +el.getAttribute('data-n'); el.contentEditable = 'true'; el.spellcheck = true; el.style.outline = '2px dashed #a855f7'; el.style.outlineOffset = '-2px'; el.style.cursor = 'text';
        el.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { var hadN = Object.keys(E0).length; E0[num] = el.innerHTML; if (!hadN) yo.construirBarra(); }, 350); });
      });
      if (!this.escena.querySelector('[data-aviso-ed]')) { var a = document.createElement('div'); a.setAttribute('data-aviso-ed', '1'); a.style.cssText = 'font:12px/1.5 system-ui,sans-serif;color:#e9d5ff;background:#3b1d5e;border-radius:8px;padding:8px 12px;margin:0 0 10px;width:100%'; a.textContent = 'Modo edición: haz clic en cualquier texto de la página y escribe. Puedes cambiar títulos, nombres, respuestas y ejemplos. Los cambios se guardan solos y salen en PDF, EPUB y HTML. Si cambias de diseño o de color, las páginas editadas conservan el aspecto con el que se editaron.'; this.escena.insertBefore(a, this.escena.firstChild); }
    };
  }
  if (window.customElements) customElements.whenDefined('editorial-escolar').then(function () { parchear(customElements.get('editorial-escolar')); });

  /* ─────────── panel: portada y paletas de folleto ─────────── */
  var CN = window.EU_CONECTORES;
  if (CN && CN.panel && !CN.panel._portada) {
    var orig = CN.panel;
    var nuevo = function (ed, seccion, U) {
      var el = U.el, ST = U.ST, chip = U.chip, A = ed.cfg.acab || {}, setA = function (o) { ed.set('acab', Object.assign({}, ed.cfg.acab || {}, o)); };
      var s = seccion('Portada y paletas');
      s.appendChild(el('div', ST.lbl, 'Portada sin imagen'));
      var f = el('div', ST.fila), v = A.portada || 'auto';
      [['auto', 'Automática'], ['plantilla', 'Plantilla del sistema'], ['reticula', 'Retícula'], ['mosaico', 'Mosaico'], ['circulos', 'Círculos'], ['bandas', 'Bandas'], ['no', 'Hueco para foto']].forEach(function (o) { var b = el('button', chip(v === o[0]), o[1]); b.onclick = function () { setA({ portada: o[0] }); }; f.appendChild(b); });
      s.appendChild(f);
      var LD = disenosPortada();
      if (LD.length && (v === 'auto' || v === 'plantilla')) {
        s.appendChild(el('div', ST.lbl, 'Diseño de plantilla para la portada'));
        var fd = el('div', ST.fila), vd = A.portadaDis || '';
        [['', 'Automático']].concat(LD.map(function (d) { return [d.id, d.nombre]; })).forEach(function (o) { var b = el('button', chip(vd === o[0]), o[1]); b.onclick = function () { setA({ portadaDis: o[0] }); }; fd.appendChild(b); });
        s.appendChild(fd);
      }
      var TM = window.FOLLETO_MOTOR && window.FOLLETO_MOTOR.TEMAS;
      if (TM) {
        s.appendChild(el('div', ST.lbl, 'Paletas de los folletos'));
        var g = el('div', 'display:flex;flex-wrap:wrap;gap:6px');
        Object.keys(TM).forEach(function (k) {
          var t = TM[k], a1 = t.acento, a2 = lum(t.acento2) > 170 ? osc(t.acento2, .4) : t.acento2, on = (A.acc || '').toLowerCase() === String(a1).toLowerCase();
          var b = el('button', 'display:flex;align-items:center;gap:5px;padding:4px 8px 4px 4px;border-radius:99px;border:1px solid ' + (on ? '#a855f7' : '#3b3b5c') + ';background:' + (on ? '#2a1b45' : 'transparent') + ';color:#cbd5e1;font:11px system-ui,sans-serif;cursor:pointer');
          b.innerHTML = '<span style="display:flex"><span style="width:14px;height:14px;border-radius:50%;background:' + a1 + '"></span><span style="width:14px;height:14px;border-radius:50%;background:' + a2 + ';margin-left:-4px;border:1px solid #0003"></span></span>' + esc(t.nombre);
          b.onclick = function () { setA({ acc: a1, acc2: a2, paletaF: k }); };
          g.appendChild(b);
        });
        s.appendChild(g);
      }
      s.appendChild(el('div', ST.nota, 'La portada usa el motor de plantillas del Estudio (rejilla, paleta y acabados de un diseño de folleto, con una celda por unidad) o una composición con un motivo de la materia. Las paletas cambian el color de acento de todo el libro, láminas y dibujos incluidos. Para escribir tus propios textos usa «✏️ Editar texto» en la barra de la vista previa.'));
      return orig.apply(this, arguments);
    };
    for (var q in orig) if (/^_/.test(q)) nuevo[q] = orig[q];
    nuevo._portada = true; CN.panel = nuevo;
  }

  window.EU_PORTADA = { composicion: composicion, ediciones: EDIC };
})();
