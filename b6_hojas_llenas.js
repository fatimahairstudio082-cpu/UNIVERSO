/* b6_hojas_llenas.js — hojas infantiles «rellenitas pero bien cuadraditas» (Fátima, 10-10-2026).
   En «Libro para colorear», «Cuaderno de caligrafía» y «Pasatiempos» muchas hojas quedaban a medias
   (caligrafía con 2-3 palabras: 28-56 % de la hoja; sopas de letras ~50 %; «Cómo usar…» ~50 %).
   Al armar, mide cada hoja impresa (lo que hay en el flujo y lo que va fijo abajo, como el bocadillo
   del guía) y llena SOLO el hueco que queda, con lo que la propia hoja ya trae:
   · caligrafía y pasatiempos: renglones de la misma pauta con las palabras de esa hoja (para repasar)
     y renglones libres hasta el final; en la sopa, «Escribe las palabras que has encontrado»;
   · colorear: «Repasa la palabra» si la hoja tiene dibujo con nombre y, si sobra, un recuadro «Dibuja aquí».
   No quita nada ni cambia lo que ya hay; no añade hojas. Impreso, PDF, EPUB y web iguales.
   Además (libro, ebook, cuaderno, fichas, libro profesional): llena «Desarrollo», «Así se resuelve» y el solucionario
   que quedaban a medias (llenarLibro), pide las letras de la plantilla antes de medir y, al final de todo, la red de
   seguridad antiCorte: ninguna hoja con bloques opcionales se sale del papel.
   cfg.acab.llenas = 'no' lo apaga. Cargar después de b6_cerebro_infantil.js y de los módulos que añaden
   páginas infantiles (b6_cerebro_svg.js, b6_modelos.js, b6_colorear_plus.js). */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_HOJAS_LLENAS) return;
  var H = ED.H, esc = H.esc, MM = 96 / 25.4;
  var PRODS = /^(colorear|caligrafia|pasatiempos)$/;
  var NO = /^(portada|contra|creditos|indice|pas_sol|inf_lamina|inf_glosario|inf_libre|s_.*)$/;
  var MEMO = {}, memoK = [];

  function I() { return window.EU_INFANTIL; }
  function palabrasDe(p, C) {
    var X = I(), ws = [];
    try {
      if (p.ws) ws = p.ws.slice();
      else if (p.fs) ws = p.fs.slice(0, 2);
      else if (p.S && p.S.p) ws = p.S.p.map(function (q) { return q.w; });
      else if (p.w) ws = [p.w];
      else if (p.f && X && X.FIG && X.FIG[p.f]) ws = [X.palabraFig(C, p.f)];
      else if (p.a && p.b && X && X.FIG && X.FIG[p.a] && X.FIG[p.b]) ws = [X.palabraFig(C, p.a), X.palabraFig(C, p.b)];
    } catch (e) { ws = []; }
    return ws.filter(function (w) { return w && String(w).length <= 24; });
  }
  function titulo(C, t) { return '<div style="font-weight:700;color:' + C.T.acc + ';margin:4mm 0 2.5mm;font-size:1.02em">' + esc(t) + '</div>'; }
  /* HTML del relleno de una hoja (X = p.llena) */
  function bloque(p, C) {
    var X = p.llena, In = I(); if (!X || !In) return '';
    var out = '';
    if (X.filas && X.filas.length) {
      var al = In.altoRenglon(C);
      out += titulo(C, X.t) + X.filas.map(function (f) { return '<div style="margin:0 0 3.5mm">' + In.renglon(C, f[0], f[1], al) + '</div>'; }).join('');
    }
    if (X.caja) out += '<div style="margin-top:' + (out ? 3 : 4) + 'mm;height:' + X.caja.toFixed(1) + 'mm;box-sizing:border-box;border:0.5mm dashed ' + C.T.acc + ';border-radius:' + (C.T.r || 4) + 'px;opacity:.75;display:flex;align-items:flex-end;justify-content:center;padding:3mm;font-size:.9em">' + esc(X.cajaT || 'Dibuja aquí') + '</div>';
    return out ? '<div data-llena="1">' + out + '</div>' : '';
  }
  ED.registrar({
    post: function (h, pg, C) {
      if (!pg.llena) return h;
      try { var b = bloque(pg, C), i = h.lastIndexOf('<div style="position:absolute;bottom:8mm'); return i > 0 ? h.slice(0, i) + b + h.slice(i) : h + b; } catch (e) { return h; }
    }
  });

  /* medidor propio: el hueco termina donde empieza lo que va fijo abajo (bocadillo del guía, sello…) */
  function medidor(C) {
    var W = C.papel.w * MM, host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-30000px;top:0;width:' + W + 'px;visibility:hidden;pointer-events:none;contain:layout style paint';
    document.body.appendChild(host);
    return {
      libre: function (p, res) {
        host.innerHTML = ED.paginaHTML(p, C, 'print', res); var el = host.firstChild; if (!el || !el.getBoundingClientRect) return 0;
        var r = el.getBoundingClientRect(), fondo = 16 * MM, techo = r.height - 20 * MM;
        var mete = function (nn) {
          for (var i = 0; i < nn.children.length; i++) {
            var c = nn.children[i], cs = getComputedStyle(c), b = c.getBoundingClientRect();
            if (cs.display === 'contents') { mete(c); continue; }
            if (cs.position === 'absolute' || cs.position === 'fixed') {
              if (b.height > 5 * MM && b.height < r.height * 0.6 && b.top - r.top > r.height * 0.45) techo = Math.min(techo, b.top - r.top - 3 * MM);
              continue;
            }
            if (b.height) fondo = Math.max(fondo, b.bottom - r.top);
          }
        };
        mete(el);
        return (techo - fondo) / MM;
      },
      fin: function () { host.remove(); }
    };
  }

  function llenar(res) {
    var C = res.C, In = I(); if (!In || !document.body) return {};
    var Md = medidor(C), al = In.altoRenglon(C), fila = al + 3.5, hechos = {};
    try {
      res.pages.forEach(function (p) {
        if (NO.test(p.tipo) || p.llena) return;
        var libre = Md.libre(p, res) - 2; if (libre < fila + 10) return;
        var ws = palabrasDe(p, C), X = {}, col = /^col_/.test(p.tipo) || C.prod.id === 'colorear';
        var n = Math.floor((libre - 8.5) / fila);
        if (col) {
          /* colorear: una o dos filas para repasar el nombre (si lo tiene) y un recuadro para dibujar */
          if (ws.length && n >= 1 && !/^col_figura$/.test(p.tipo)) { X.t = 'Repasa la palabra'; X.filas = [[ws[0], 'modelo']]; if (n >= 3) X.filas.push([ws[0], 'medio']); }
          var resto = libre - (X.filas ? 8.5 + X.filas.length * fila : 0) - 4;
          if (resto >= 35) { X.caja = resto; X.cajaT = 'Dibuja aquí lo que quieras'; }
        } else {
          X.t = p.tipo === 'pas_sopa' ? 'Escribe las palabras que has encontrado' : /^pas_/.test(p.tipo) ? 'Escribe' : 'Sigue practicando';
          X.filas = [];
          ws.forEach(function (w) { if (X.filas.length < n) X.filas.push([w, 'medio']); });
          while (X.filas.length < n) X.filas.push(['', 'libre']);
        }
        if (!X.filas || !X.filas.length) delete X.filas;
        if (!X.filas && !X.caja) return;
        p.llena = X;
        /* comprobar: si por redondeo no cabe, quitar filas o achicar el recuadro */
        var vuelta = 0;
        while (Md.libre(p, res) < 0 && vuelta++ < 30) {
          if (X.caja && X.caja > 30) X.caja -= 6;
          else if (X.caja) delete X.caja;
          else if (X.filas && X.filas.length > 1) X.filas.pop();
          else { delete p.llena; break; }
        }
        if (p.llena) hechos[p.num] = p.llena;
      });
    } finally { Md.fin(); }
    return hechos;
  }

  /* ─── libros (libro, ebook, cuaderno, fichas, libro profesional): hojas nuevas que quedaban a medias ───
     «Desarrollo» y «Así se resuelve» de las materias con banco automático (b6_texto_auto.js) traen a veces uno o dos
     apartados o ejemplos, y el solucionario de las fichas se queda corto al pasar una hoja al tutor. Se llenan con el
     mismo bloque de b6_relleno_total.js (pg.fill2): «Practica más» con ejercicios de la unidad que aún no salen en el
     libro, un dibujo «Observa» de la unidad si sobra mucho sitio, «Mis notas» al final; en el solucionario, la tabla
     «Revisa tus errores». */
  var LIBROS = /^(libro|ebook|cuaderno|fichas|libro_pro)$/, TIPOS_L = /^(enc_desarrollo|enc_ejemplos|solucion)$/;
  function huella(s) { return H.hash(String(s).replace(/[\d.\-]+/g, '')); }
  function llenarLibro(res) {
    var C = res.C, MM = 96 / 25.4, Md = medidor(C), lin = C.fs * 1.5 / MM, hechos = {}, sem = C.semilla || 1, visto = {}, figV = {};
    res.pages.forEach(function (p) {
      (p.items || []).forEach(function (x) { if (x && x.e) visto[H.limpio(x.e)] = 1; });
      ((p.tut && p.tut.items) || []).forEach(function (x) { if (x && x.e) visto[H.limpio(x.e)] = 1; });
      ((p.fill2 && p.fill2.its) || []).forEach(function (x) { if (x && x.e) visto[H.limpio(x.e)] = 1; });
      if (typeof p.fig === 'string') figV[huella(p.fig)] = 1; if (p.v && typeof p.v.fig === 'string') figV[huella(p.v.fig)] = 1;
      if (p.fill2 && typeof p.fill2.fig === 'string') figV[huella(p.fill2.fig)] = 1;
    });
    try {
      res.pages.forEach(function (p) {
        if (!TIPOS_L.test(p.tipo) || (p.fill2 && !p.fill2.nada)) return;
        var libre = Md.libre(p, res) - 3; if (libre < 22) return;
        var X = {}, viejo = p.fill2, u = p.u, r = H.rng(H.hash((u && u.id || 'x') + ':llenas:' + p.num) + sem);
        p.fill2 = X;
        var cabe = function () { return Md.libre(p, res) >= 0; };
        if (p.tipo === 'solucion') {
          X.rev = Math.max(2, Math.floor((libre - 16) / (C.fs * 1.9 / MM)));
          while (X.rev > 2 && !cabe()) X.rev--;
          if (!cabe()) delete X.rev;
        } else {
          if (u && H.ejercicios) {
            var cand = []; try { cand = H.ejercicios(u, C, r, 16) || []; } catch (e) { }
            X.its = []; X.base = 0;
            for (var i = 0; i < cand.length && X.its.length < 6; i++) {
              var c = cand[i], kk = c && c.e ? H.limpio(c.e) : ''; if (!kk || visto[kk]) continue;
              X.its.push(c); if (!cabe()) { X.its.pop(); break; } visto[kk] = 1;
            }
            if (!X.its.length) delete X.its;
          }
          if (u && window.EU_SVG && Md.libre(p, res) > 78) {
            var tipos = []; try { tipos = EU_SVG.tiposDe(u, C) || []; } catch (e) { }
            for (var q = 0; q < tipos.length; q++) {
              var ty = tipos[(p.num + q) % tipos.length]; if (/^(sopa|ordena)$/.test(ty)) continue;
              var g = null; try { g = EU_SVG.generar(ty, u, C, r); } catch (e) { }
              if (!g || typeof g.fig !== 'string' || g.fig.length < 300 || figV[huella(g.fig)]) continue;
              var alto = Math.min(85, Md.libre(p, res) - 16); if (alto < 50) break;
              X.fig = g.fig; X.figT = g.t ? 'Observa · ' + H.limpio(g.t) : 'Observa'; X.figH = alto;
              if (!cabe()) { delete X.fig; continue; }
              figV[huella(g.fig)] = 1; break;
            }
          }
          var kl = Math.floor((Md.libre(p, res) - 9) / lin); if (kl >= 2) { X.lin = Math.min(kl, 30); while (X.lin > 1 && !cabe()) X.lin--; if (!cabe()) delete X.lin; }
        }
        if (!X.rev && !X.its && !X.fig && !X.lin) { p.fill2 = viejo; return; }
        hechos[p.num] = X;
      });
    } finally { Md.fin(); }
    return hechos;
  }

  /* ─── red de seguridad «ninguna hoja corta nada» (10-10-2026) ───
     Varios módulos añaden bloques opcionales al final de la hoja, cada uno con su propia medida y su propia memoria:
     «Un paso más» (b6_laminas_plus.js, pg.extra, con tope de tiempo), relleno de adultos (b6_comercio_electronico.js,
     pg.fill), relleno general (pg.fill2) y el de las hojas infantiles (pg.llena). Al volver a armar el mismo libro
     podían juntarse dos de ellos en la misma hoja y la hoja se salía (medido: Redes sociales, 2.º armado, 17 hojas).
     Aquí, al final de todo, se mide cada hoja que lleva alguno de esos bloques y, si no cabe, se quita lo opcional en
     este orden hasta que cabe: «Un paso más», notas, figura y ejercicios extra, dato, recuadro de dibujo, renglones.
     Nunca toca el contenido propio de la hoja. */
  function opcionales(p) { return !!(p.extra || p.fill || (p.fill2 && !p.fill2.nada) || p.llena); }
  function recorta(p) {
    if (p.extra) { delete p.extra; return true; }
    var F = p.fill; if (F && !F.__mio) { F = p.fill = Object.assign({}, F, { __mio: 1 }); }
    if (F) { if (F.lin) { delete F.lin; return true; } if (F.gen) { delete F.gen; return true; } if (F.dato) { delete F.dato; return true; } delete p.fill; return true; }
    var G = p.fill2; if (G && !G.nada && !G.__mio) { G = p.fill2 = Object.assign({}, G, { __mio: 1 }); if (G.its) G.its = G.its.slice(); }
    if (G && !G.nada) {
      if (G.lin) { delete G.lin; return true; } if (G.fig) { delete G.fig; return true; } if (G.its && G.its.length) { G.its.pop(); if (!G.its.length) delete G.its; return true; }
      if (G.rev && G.rev > 2) { G.rev = Math.max(2, G.rev - 3); return true; } if (G.dato) { delete G.dato; return true; } p.fill2 = { nada: 1 }; return true;
    }
    var L = p.llena; if (L) { if (L.caja) { delete L.caja; return true; } if (L.filas && L.filas.length > 1) { L.filas.pop(); return true; } delete p.llena; return true; }
    return false;
  }
  function antiCorte(res) {
    var C = res.C, Md = medidor(C), n = 0;
    try {
      res.pages.forEach(function (p) {
        if (!opcionales(p) || /^(portada|contra)$/.test(p.tipo)) return;
        var v = 0; while (v++ < 40 && Md.libre(p, res) < -1 && recorta(p)) n++;
      });
    } finally { Md.fin(); }
    res.antiCorte = n;
    return n;
  }

  /* Las letras de la plantilla (Literata, Playwrite…) solo se cargaban en la vista previa, no en la página que mide:
     las medidas salían con Georgia y la hoja real (más alta) podía salirse unos milímetros. Se piden aquí; mientras
     no están, no se guarda en memoria lo medido, y el siguiente armado ya mide con la letra real. */
  function familias(C) {
    var out = [], In = I();
    [C.T && C.T.cuerpo, C.T && C.T.tit, In && In.letraCal && PRODS.test(C.prod && C.prod.id || '') ? In.letraCal(C).f : ''].forEach(function (f) {
      var n = String(f || '').split(',')[0].replace(/['"]/g, '').trim(); if (n && out.indexOf(n) < 0 && !/^(serif|sans-serif|cursive|monospace|system-ui|Georgia|Arial)$/i.test(n)) out.push(n);
    });
    return out;
  }
  function fuentesListas(C) {
    if (!document.fonts || !document.fonts.check) return true;
    var ok = true;
    familias(C).forEach(function (n) {
      ['400', '700'].forEach(function (w) {
        var d = w + ' 16px "' + n + '"';
        try { if (!document.fonts.check(d)) { ok = false; document.fonts.load(d).catch(function () { }); } } catch (e) { }
      });
    });
    return ok;
  }

  /* las de las plantillas del motor, pedidas ya al cargar (el primer libro también mide con la letra real) */
  try { if (document.fonts && document.fonts.load) ['Literata', 'Andika', 'Source Serif 4', 'IBM Plex Sans', 'Lexend', 'Baloo 2'].forEach(function (n) { ['400', '700'].forEach(function (w) { document.fonts.load(w + ' 16px "' + n + '"').catch(function () { }); }); }); } catch (e) { }

  function enganchar() {
    if (ED.__llenas) return;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) {
      var res = ens.apply(this, arguments);
      try {
        var A = (cfg && cfg.acab) || {}, inf = PRODS.test(cfg && cfg.prod || ''), lib = LIBROS.test(cfg && cfg.prod || 'libro') && window.EU_RELLENO !== undefined;
        if (cfg && (inf || lib) && A.llenas !== 'no' && res && res.C && res.C.papel && res.C.papelId !== 'slide' && document.body) {
          var key = JSON.stringify(cfg), M = MEMO[key];
          if (M) res.pages.forEach(function (p) { if (M[p.num]) { if (inf) p.llena = JSON.parse(JSON.stringify(M[p.num])); else p.fill2 = Object.assign({}, M[p.num]); } });
          else { var listas = fuentesListas(res.C), hecho = inf ? llenar(res) : llenarLibro(res); if (listas) { MEMO[key] = hecho; memoK.push(key); if (memoK.length > 6) delete MEMO[memoK.shift()]; } }
        }
        if (cfg && (inf || LIBROS.test(cfg.prod || 'libro')) && A.llenas !== 'no' && res && res.C && res.C.papel && res.C.papelId !== 'slide' && document.body) { fuentesListas(res.C); antiCorte(res); }
      } catch (e) { console.warn('EU_HOJAS_LLENAS', e); }
      return res;
    };
    ED.__llenas = 1;
  }
  /* el último de la cadena: después del tutor, la enciclopedia y el inglés bilingüe */
  (function esperar(n) { if (ED.__bil || n > 90) enganchar(); else setTimeout(function () { esperar(n + 1); }, 300); })(0);
  window.EU_HOJAS_LLENAS = { llenar: llenar, llenarLibro: llenarLibro, antiCorte: antiCorte, bloque: bloque };
})();
