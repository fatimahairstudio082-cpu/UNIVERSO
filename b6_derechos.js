/* b6_derechos.js — derechos de autor, registro de obras y antipiratería (window.EU_DERECHOS).
   Se apoya en la «Autorización» que ya existe (b6_conectores.js: Borrador / En revisión / Autorizado, sello con
   código de verificación) sin editarla, y añade:
   · Marca de agua «AUTORIZADO · © autora · Código» opcional (`cfg.acab.marcaAut = 'si'`), en todas las páginas.
   · Licencia por comprador (`cfg.acab.licencia` = nombre o correo): pie discreto en cada página con © , código de la
     obra y código de licencia. Si una copia circula sin permiso, lleva el nombre de quien la compró.
   · Aviso «Derechos de autor y licencia de uso» en la contraportada (texto a revisar por Fátima).
   · Registro de obras (localStorage `eu_registro_obras`, clave nueva): libro y curso autorizados quedan guardados
     con código, licencia, fecha y huella; panel «🛡 Derechos de autor y registro» para buscar y verificar códigos.
   · Curso premium: © , código y licencia en la cabecera del reproductor y en el certificado; LICENCIA.txt en el ZIP.
   · PDF de Guías 3D, Estudios y biblioteca (jsPDF): pie con © y código si se activa (`eu_derechos`, clave nueva).
   El código de la obra es el mismo que ya muestra el sello. Todo se activa con estado «Autorizado», marca o licencia;
   si no, el material sale exactamente como antes. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_DERECHOS) return;
  var H = ED.H, REG = 'eu_registro_obras', GLOB = 'eu_derechos';
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function A(C) { return Object.assign({}, (C && C.cfg && C.cfg.acab) || {}, (C && C.acab) || {}); }
  function activo(C) { var a = A(C); return a.estado === 'autorizado' || a.marcaAut === 'si' || !!String(a.licencia || '').trim(); }
  /* nombre que figura: quien autoriza (sección Autorización); si está vacío, la autoría del libro */
  function autor(C) { return String(A(C).por || (C && C.cfg && C.cfg.autor) || '').trim(); }
  /* mismo cálculo que el sello de b6_conectores.js: el código registrado es el que ya se imprime */
  function codigo(C, res) {
    var a = A(C), s = H.hash(C.titulo + '|' + (a.por || '') + '|' + (a.fecha || '') + '|' + (res && res.pages ? res.pages.length : 0)).toString(36).toUpperCase().padStart(8, '0').slice(-8);
    return s.slice(0, 4) + '-' + s.slice(4);
  }
  function licCod(cod, lic) { return lic ? 'L-' + H.hash(cod + '|' + String(lic).trim().toLowerCase()).toString(36).toUpperCase().padStart(6, '0').slice(-6) : ''; }
  function datos(C, res) {
    var a = A(C), cod = codigo(C, res), lic = String(a.licencia || '').trim();
    return { codigo: cod, licencia: lic, lic: licCod(cod, lic), autor: autor(C), anio: new Date().getFullYear(), titulo: C.titulo };
  }

  /* ─── registro ─── */
  function leer() { try { return JSON.parse(localStorage.getItem(REG) || '[]') || []; } catch (e) { return []; } }
  function registrar(o) {
    var L = leer(), k = o.codigo + '|' + (o.lic || '') + '|' + o.tipo;
    if (L.some(function (x) { return x.codigo + '|' + (x.lic || '') + '|' + x.tipo === k; })) return false;
    L.unshift(Object.assign({ creado: new Date().toISOString() }, o));
    try { localStorage.setItem(REG, JSON.stringify(L.slice(0, 2000))); return true; } catch (e) { return false; }
  }
  function verificar(cod) {
    var c = String(cod || '').trim().toUpperCase().replace(/\s+/g, '');
    if (!c) return [];
    return leer().filter(function (x) { return x.codigo === c || x.lic === c || (x.codigo + '·' + x.lic) === c; });
  }
  function huella(res) { return H.hash(res.pages.map(function (p) { return p.tipo + (p.u ? p.u.id : ''); }).join(',')).toString(36).toUpperCase(); }
  function apuntar(res, tipo) {
    var C = res.C; if (!activo(C)) return;
    var d = datos(C, res);
    registrar({ tipo: tipo, codigo: d.codigo, lic: d.lic, licencia: d.licencia, titulo: C.titulo, autor: d.autor, materia: C.matN || C.mat, paginas: res.pages.length, estado: A(C).estado, huella: huella(res) });
  }

  /* ─── en las páginas ─── */
  var ABS = 'position:absolute;pointer-events:none;';
  ED.registrar({
    post: function (h, pg, C, modo, ctx) {
      if (!activo(C) || !ctx || !ctx.pages) return h;
      var a = A(C), d = datos(C, ctx), s = '', W = C.papel.w, au = d.autor ? 'Autorizado por ' + d.autor + ' · © ' + d.anio : '© ' + d.anio;
      if (a.marcaAut === 'si' && a.estado !== 'borrador' && a.estado !== 'revision')
        s += '<div style="' + ABS + 'inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;z-index:4"><div style="transform:rotate(-32deg);text-align:center;color:' + C.T.acc + ';opacity:.09;white-space:nowrap;font-family:sans-serif"><div style="font:800 ' + (W * 0.085) + 'mm/1 sans-serif;letter-spacing:.08em">AUTORIZADO</div><div style="font:700 ' + (W * 0.022) + 'mm/1.4 sans-serif;letter-spacing:.06em">' + (d.autor ? 'POR ' + es(d.autor.toUpperCase()) + ' · ' : '') + 'CÓDIGO ' + d.codigo + '</div></div></div>';
      /* créditos: el sello de «Material autorizado» (b6_conectores.js) tapaba la autoría y el ©; sube encima de ellos */
      if (pg.tipo === 'creditos' && a.estado === 'autorizado' && h.indexOf('left:17mm;right:17mm;bottom:24mm">') >= 0)
        h = h.replace('left:17mm;right:17mm;bottom:24mm">', 'left:17mm;right:17mm;bottom:70mm">').replace('top:18mm;bottom:72mm;overflow:hidden', 'top:18mm;bottom:100mm;overflow:hidden');
      if (d.licencia && pg.tipo !== 'portada' && pg.tipo !== 'contra') s += '<div style="' + ABS + 'left:0;right:0;bottom:2.2mm;text-align:center;font:6.5px/1 sans-serif;letter-spacing:.04em;color:' + C.T.ink + ';opacity:.55;z-index:4">' + es(au) + ' · Código ' + d.codigo + ' · Licencia de uso: ' + es(d.licencia) + ' (' + d.lic + ') · Prohibida su reproducción o distribución</div>';
      if (pg.tipo === 'contra') s += '<div style="position:absolute;left:20mm;right:20mm;top:18mm;color:#fff;font-size:.72em;line-height:1.45;opacity:.92;z-index:4"><div style="font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.9em;margin-bottom:1.5mm">Derechos de autor y licencia de uso</div>' +
        es(au) + '. Todos los derechos reservados. Código de la obra: ' + d.codigo + (d.licencia ? '. Licencia de uso personal e intransferible para: ' + es(d.licencia) + ' (' + d.lic + ')' : '') +
        '. Queda prohibida la reproducción, distribución, comunicación pública, reventa o transformación, total o parcial, de esta obra por cualquier medio sin autorización escrita de la autora. Cada copia está registrada y su código se puede verificar.</div>';
      return h + s;
    }
  });
  var doc = ED.documento;
  ED.documento = function (res) { try { if (res && res.C) apuntar(res, 'libro'); } catch (e) { } return doc.apply(this, arguments); };

  /* ─── curso premium: cabecera, certificado y LICENCIA.txt ─── */
  var RES_CURSO = null;
  function enganchaCurso() {
    var CA = window.EU_CURSO_ANIM, CP = window.EU_CURSO_PREMIUM;
    if (CA && CA.enriquecer && !CA.enriquecer._der) {
      var enr = CA.enriquecer;
      CA.enriquecer = function (D, res) {
        try {
          RES_CURSO = res;
          if (res && res.C && activo(res.C)) {
            var d = datos(res.C, res), au = d.autor ? 'Autorizado por ' + d.autor + ' · © ' + d.anio : '© ' + d.anio;
            D.sub = (D.sub ? D.sub + ' · ' : '') + au + ' · Código ' + d.codigo + (d.licencia ? ' · Licencia: ' + d.licencia : '');
            if (!D.autor && d.autor) D.autor = d.autor;
            D.centro = (D.centro ? D.centro + ' · ' : '') + 'Código ' + d.codigo + (d.lic ? ' · ' + d.lic : '');
            D.derechos = d;
          }
        } catch (e) { console.warn('Derechos · curso', e); }
        return enr.apply(this, arguments);
      };
      CA.enriquecer._der = 1;
    }
    if (CP && CP.paquete && !CP.paquete._der) {
      var paq = CP.paquete;
      CP.paquete = function (res) {
        return paq.apply(this, arguments).then(function (r) {
          if (!r || !r.D || !r.D.derechos || !window.JSZip) return r;
          var d = r.D.derechos; try { apuntar(res, 'curso'); } catch (e) { }
          var t = 'DERECHOS DE AUTOR Y LICENCIA DE USO\n\n' + r.D.titulo + '\n' + (d.autor ? 'Autorizado por ' + d.autor + ' · ' : '') + '© ' + d.anio + '. Todos los derechos reservados.\nCódigo de la obra: ' + d.codigo + '\n' +
            (d.licencia ? 'Licencia de uso personal e intransferible para: ' + d.licencia + ' (' + d.lic + ')\n' : '') +
            '\nQueda prohibida la reproducción, distribución, comunicación pública, reventa o transformación, total o parcial,\nde este curso y de sus materiales por cualquier medio sin autorización escrita de la autora.\nCada copia está registrada y su código se puede verificar.\n\n(Texto a revisar por la autora.)\n';
          return JSZip.loadAsync(r.blob).then(function (z) {
            var raiz = Object.keys(z.files)[0].split('/')[0] + '/';
            z.file(raiz + 'LICENCIA.txt', t);
            return z.generateAsync({ type: 'blob' }).then(function (b) { r.blob = b; return r; });
          });
        });
      };
      CP.paquete._der = 1;
    }
  }

  /* ─── PDF (jsPDF) de Guías 3D, Estudios y biblioteca: pie con © y código ─── */
  function glob() { try { return JSON.parse(localStorage.getItem(GLOB) || '{}') || {}; } catch (e) { return {}; } }
  function guardarGlob(o) { try { localStorage.setItem(GLOB, JSON.stringify(Object.assign(glob(), o))); } catch (e) { } }
  function sellar(doc) {
    var g = glob(); if (g.pdf !== 'si' || doc.__euSello) return; doc.__euSello = 1;
    var n = doc.getNumberOfPages(), au = (g.autor ? 'Autorizado por ' + g.autor + ' · © ' + new Date().getFullYear() : '© ' + new Date().getFullYear());
    var s = H.hash((g.autor || '') + '|' + (document.title || '') + '|' + n + '|' + Date.now()).toString(36).toUpperCase().padStart(8, '0').slice(-8), cod = s.slice(0, 4) + '-' + s.slice(4);
    var lin = au + ' · Código ' + cod + (g.licencia ? ' · Licencia de uso: ' + g.licencia : '') + ' · Prohibida su reproducción o distribución';
    for (var i = 1; i <= n; i++) {
      doc.setPage(i); var w = doc.internal.pageSize.getWidth(), hh = doc.internal.pageSize.getHeight();
      doc.setFontSize(6.5); doc.setTextColor(120, 120, 120); doc.text(lin, w / 2, hh - 2.5, { align: 'center' });
    }
    registrar({ tipo: 'pdf', codigo: cod, lic: '', licencia: g.licencia || '', titulo: document.title || 'Documento PDF', autor: g.autor || '', paginas: n, estado: 'autorizado', huella: cod });
  }
  /* jsPDF 2.x pone output/save en cada documento (no en el prototipo): se envuelve el constructor */
  function enganchaPDF() {
    var NS = window.jspdf, J0 = NS && NS.jsPDF; if (!J0 || J0._der) return;
    var J = function () {
      var d = new (Function.prototype.bind.apply(J0, [null].concat([].slice.call(arguments))))();
      ['output', 'save'].forEach(function (m) { var f = d[m]; if (typeof f === 'function') d[m] = function () { try { sellar(this); } catch (e) { console.warn('Derechos · PDF', e); } return f.apply(this, arguments); }; });
      return d;
    };
    Object.keys(J0).forEach(function (k) { J[k] = J0[k]; }); J.prototype = J0.prototype; J.API = J0.API; J._der = 1;
    NS.jsPDF = J;
  }
  (function vigila(n) { try { enganchaCurso(); } catch (e) { } try { enganchaPDF(); } catch (e) { } if (n < 400) setTimeout(function () { vigila(n + 1); }, 1500); })(0);

  /* ─── panel del Editorial ─── */
  var CN = window.EU_CONECTORES;
  if (CN && CN.panel && !CN.panel._der) {
    var orig = CN.panel;
    var nuevo = function (ed, seccion, U) {
      var r = orig.apply(this, arguments);
      try {
        var el = U.el, ST = U.ST, chip = U.chip, a = Object.assign({}, ed.cfg.acab || {});
        var setA = function (k, v, rehacer) { var b = Object.assign({}, ed.cfg.acab || {}); b[k] = v; ed.set('acab', b, rehacer !== false); };
        var s = seccion('🛡 Derechos de autor y registro');
        s.appendChild(el('div', ST.lbl, 'Marca de agua «AUTORIZADO»'));
        var f = el('div', ST.fila);
        [['no', 'Sin marca'], ['si', 'Con marca']].forEach(function (o) { var b = el('button', chip((a.marcaAut || 'no') === o[0]), o[1]); b.onclick = function () { setA('marcaAut', o[0]); }; f.appendChild(b); });
        s.appendChild(f);
        s.appendChild(el('div', ST.lbl, 'Licencia para (nombre o correo de quien compra)'));
        var i = el('input', ST.campo); i.value = a.licencia || ''; i.placeholder = 'Vacío = sin licencia personal';
        i.onchange = function () { setA('licencia', i.value.trim()); }; s.appendChild(i);
        var g = glob(), fp = el('div', ST.fila);
        [['no', 'PDF de guías sin sello'], ['si', 'Sellar PDF de guías y láminas']].forEach(function (o) { var b = el('button', chip((g.pdf || 'no') === o[0]), o[1]); b.onclick = function () { guardarGlob({ pdf: o[0], autor: (ed.cfg.acab || {}).por || ed.cfg.autor || '', licencia: (ed.cfg.acab || {}).licencia || '' }); ed.set('acab', Object.assign({}, ed.cfg.acab || {}), false); ed.aviso(o[0] === 'si' ? 'Los PDF de Guías 3D, Estudios y biblioteca llevarán © y código.' : 'PDF sin sello.'); }; fp.appendChild(b); });
        s.appendChild(fp);
        var C = ed.res && ed.res.C;
        s.appendChild(el('div', ST.nota, C && activo(C) ? 'Código de la obra: ' + codigo(C, ed.res) + (a.licencia ? ' · Licencia ' + licCod(codigo(C, ed.res), a.licencia) : '') + '. Se registra al descargar. La contraportada lleva el aviso de derechos de autor.' :
          'Se activa al poner «Autorizado» (sección Autorización), la marca de agua o una licencia. Mientras tanto el material sale como siempre.'));
        s.appendChild(el('div', ST.lbl, 'Verificar un código'));
        var v = el('input', ST.campo); v.placeholder = 'XXXX-XXXX o L-XXXXXX'; s.appendChild(v);
        var out = el('div', ST.nota); s.appendChild(out);
        var bv = el('button', ST.bt + ';margin-top:6px', 'Verificar'); s.appendChild(bv);
        bv.onclick = function () {
          var m = verificar(v.value);
          out.textContent = m.length ? '✔ Código registrado: ' + m.map(function (x) { return '«' + x.titulo + '» (' + x.tipo + ', ' + (x.paginas || '?') + ' págs., ' + String(x.creado).slice(0, 10) + (x.licencia ? ', licencia de ' + x.licencia : '') + ')'; }).join(' · ') : '✖ Este código no está en tu registro: la copia no es tuya o no se autorizó.';
        };
        var L = leer();
        s.appendChild(el('div', ST.nota, 'Obras registradas: ' + L.length + (L.length ? '. Últimas: ' + L.slice(0, 5).map(function (x) { return x.codigo + (x.lic ? '·' + x.lic : '') + ' «' + x.titulo + '»'; }).join(' · ') : '')));
      } catch (e) { console.warn('Derechos · panel', e); }
      return r;
    };
    nuevo._der = 1; nuevo._premium = orig._premium;
    CN.panel = nuevo;
  }

  window.EU_DERECHOS = { codigo: codigo, licCod: licCod, registro: leer, registrar: registrar, verificar: verificar, activo: activo };
})();
