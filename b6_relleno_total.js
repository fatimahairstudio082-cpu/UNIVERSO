/* b6_relleno_total.js — relleno ≥ 85 % para todas las materias que no son de adultos
   (las de adultos ya lo tienen en EU_ECOM.llenar). Mide cada página impresa y completa el hueco,
   por este orden, con: un dato de «Para saber más» (EU_LIBRO.SABER, cada uno una sola vez por libro),
   una figura de la biblioteca visual que no esté ya en el libro, ejercicios nuevos de la unidad
   (H.ejercicios, sin repetir enunciados) y, solo al final, unas líneas de notas.
   En las páginas de soluciones añade una tabla «Revisa tus errores».
   cfg.acab.relleno = 'no' lo apaga. Cargar después de b6_comercio_electronico.js. */
(function () {
  var ED = window.EU_EDITORIAL, EC = window.EU_ECOM; if (!ED || !EC || !EC.medidor) return;
  var H = ED.H, esc = H.esc, MM = 96 / 25.4;
  var ADU = /^(empre|mkt|ia|redes|ecom)$/, NO_TIPO = /^(portada|creditos|indice|contra|bibliografia|emp_slide|s_.*)$/;
  var PRODS = /^(libro|cuaderno|unidad|trabajo|ebook|diccionario|recetario|libro_pro)$/;
  var MEMO = {}, memoK = [];

  function tit(C, t) { return '<div style="font-weight:700;color:' + C.T.acc + ';margin:2mm 0 1.5mm">' + esc(t) + '</div>'; }
  function caja(C, t, html) { var T = C.T; return '<div style="border:0.4mm solid ' + T.soft + ';border-radius:' + (T.r || 0) + 'px;padding:3mm 4mm;margin:0 0 3mm;break-inside:avoid"><div style="font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">' + esc(t) + '</div><div style="line-height:1.45">' + html + '</div></div>'; }
  function figura(X) {
    return X.fig.replace(/<svg\b[^>]*>/, function (m) { return m.replace(/\sstyle="[^"]*"/g, '').replace('<svg', '<svg style="display:block;height:100%;width:auto;max-width:100%"'); });
  }
  var REV = ['Anota cada ejercicio que hayas fallado, la respuesta correcta y qué vas a repasar. Repetirlo dentro de unos días fija lo aprendido.', 'Apunta los fallos de esta parte: qué respondiste, qué era lo correcto y dónde está la explicación en el libro.', 'Un error anotado es un error que no se repite. Escribe el número del ejercicio y la idea que te faltó.', 'Revisa tus respuestas con este solucionario y deja aquí registro de lo que debes volver a estudiar.', 'Marca los aciertos y los fallos. Si fallas dos del mismo tipo, vuelve a la página de explicación de la unidad.'];
  function revision(C, n, k) {
    var T = C.T, td = 'border:0.3mm solid ' + T.soft + ';padding:0 2mm;height:' + (C.fs * 1.9) + 'px', f = '';
    for (var i = 0; i < n; i++) f += '<tr><td style="' + td + '"></td><td style="' + td + '"></td><td style="' + td + ';text-align:center">☐ ✓ ☐ ✗</td><td style="' + td + '"></td></tr>';
    return tit(C, 'Revisa tus errores') + '<div style="font-size:.85em;margin:0 0 1.5mm;line-height:1.4">' + REV[(k || 0) % REV.length] + '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:.85em"><tr>' + ['Ejercicio', 'Mi respuesta', 'Resultado', 'Qué repaso'].map(function (h) { return '<th style="text-align:left;border-bottom:0.5mm solid ' + T.acc + ';padding:1mm 2mm">' + h + '</th>'; }).join('') + '</tr>' + f + '</table>';
  }
  function bloque(pg, C, modo) {
    var X = pg.fill2; if (!X) return ''; var out = '';
    if (X.dato) out += caja(C, 'Para saber más · ' + X.dato[0], esc(X.dato[1]));
    if (X.fig) out += '<div style="break-inside:avoid;margin:0 0 3mm">' + tit(C, X.figT || 'Observa') + '<div style="height:' + X.figH + 'mm;display:flex;justify-content:center">' + figura(X) + '</div></div>';
    if (X.its && X.its.length) out += tit(C, 'Practica más') + X.its.map(function (x, i) { return H.itemHTML(x, (X.base || 0) + i, C, modo, 'f2_' + pg.num); }).join('');
    if (X.rev) out += revision(C, X.rev, pg.num);
    if (X.lin) out += tit(C, X.titL || 'Mis notas') + H.lineas(X.lin, C);
    return '<div data-fill="2" style="margin-top:3mm">' + out + '</div>';
  }
  ED.registrar({ post: function (h, pg, C, modo) { if (!pg.fill2) return h; try { var b = bloque(pg, C, modo), i = h.lastIndexOf('<div style="position:absolute;bottom:8mm'); return i > 0 ? h.slice(0, i) + b + h.slice(i) : h + b; } catch (e) { return h; } } });

  function llenar(res, o) {
    o = o || {}; var C = res.C; if (!document.body || !C || !C.papel) return;
    var Md = EC.medidor(C), lin = C.fs * 1.5 / MM, t0 = performance.now(), sem = C.semilla || 1;
    var huella = function (s) { return H.hash(String(s).replace(/[\d.\-]+/g, '')); };
    /* o.st guarda el estado entre llamadas (relleno por tandas, o.lista = páginas a tratar) */
    var st = o.st || {};
    if (!st.ok) {
      var SAB = (window.EU_LIBRO && EU_LIBRO.SABER && EU_LIBRO.SABER[C.mat]) || [];
      st.sab = H.mezcla(H.rng(H.hash(C.mat + ':f2') + sem), SAB.slice()); st.si = 0; st.visto = {}; st.figV = {}; st.figTy = {};
      res.pages.forEach(function (p) {
        (p.items || []).forEach(function (x) { if (x && x.e) st.visto[H.limpio(x.e)] = 1; });
        if (p.v && typeof p.v.fig === 'string') st.figV[huella(p.v.fig)] = 1;
        if (p.gen) st.figTy[p.gen] = (st.figTy[p.gen] || 0) + 1; /* una figura que ya sale como página no se repite de relleno más de dos veces */
        if (typeof p.fig === 'string') st.figV[huella(p.fig)] = 1;
      });
      st.ok = 1;
    }
    var sab = st.sab, si = st.si, visto = st.visto, figV = st.figV, figTy = st.figTy;
    try {
      res.pages.forEach(function (p) {
        if (o.lista && !o.lista[p.num]) return;
        if (NO_TIPO.test(p.tipo) || p.fill || p.fill2) return;
        if (performance.now() - t0 > (o.presup || 60000)) return;
        var h = Md.hueco(p, res); if (!h || h.lleno >= .85 || h.libre < 8) return;
        var f = h.libre - 4, X = {}, u = p.u, r = H.rng(H.hash(C.mat + ':' + p.num) + sem);
        p.fill2 = X;
        var mide = function () { return Md.alto(bloque(p, C, 'print')); };
        if (p.tipo === 'glosario') {
          if (f > 40 && si < sab.length) { X.dato = sab[si]; if (mide() > f) delete X.dato; else si++; }
          X.titL = 'Mis palabras nuevas: escribe cada una con su definición'; var kg = Math.floor((f - mide() - 10) / lin); if (kg >= 2) X.lin = Math.min(kg, 40);
          if (!X.dato && !X.lin) delete p.fill2;
          return;
        }
        if (p.tipo === 'solucion') {
          X.rev = Math.max(2, Math.floor((f - 16) / (C.fs * 1.9 / MM)));
          while (X.rev > 2 && mide() > f) X.rev--;
          if (mide() > f) delete p.fill2;
          return;
        }
        if (f > 40 && si < sab.length) { X.dato = sab[si]; if (mide() > f) delete X.dato; else si++; }
        if (u && window.EU_SVG && f - mide() > 75) {
          var tipos = []; try { tipos = EU_SVG.tiposDe(u, C) || []; } catch (e) { }
          for (var q = 0; q < tipos.length; q++) {
            var ty = tipos[(p.num + q) % tipos.length]; if (/^(sopa|ordena)$/.test(ty)) continue;
            var g = null; try { g = EU_SVG.generar(ty, u, C, r); } catch (e) { }
            if (!g || typeof g.fig !== 'string' || g.fig.length < 300) continue;
            var k = huella(g.fig); if (figV[k] || (figTy[ty] || 0) >= 2) continue;
            var alto = Math.min(95, f - mide() - 14); if (alto < 50) break;
            X.fig = g.fig; X.figT = g.t ? 'Observa · ' + H.limpio(g.t) : 'Observa'; X.figH = alto;
            if (mide() > f) { delete X.fig; continue; }
            figV[k] = 1; figTy[ty] = (figTy[ty] || 0) + 1; break;
          }
        }
        if (u && H.ejercicios) {
          var cand = []; try { cand = H.ejercicios(u, C, r, 16) || []; } catch (e) { }
          X.its = []; X.base = (p.items || []).length;
          for (var i = 0; i < cand.length && X.its.length < 7; i++) {
            if (f - mide() < lin * 3) break;
            var c = cand[i], kk = c && c.e ? H.limpio(c.e) : ''; if (!kk || visto[kk]) continue;
            X.its.push(c); if (mide() > f) X.its.pop(); else visto[kk] = 1;
          }
          if (!X.its.length) delete X.its;
        }
        var kl = Math.floor((f - mide() - 8) / lin); if (kl >= 2) X.lin = Math.min(kl, 40);
        if (!X.dato && !X.fig && !X.its && !X.lin) delete p.fill2;
      });
    } finally { st.si = si; Md.fin(); }
  }

  /* Páginas que desbordan (ya venían así del motor):
     · visuales: reduce la figura y, si no basta, quita preguntas del final;
     · soluciones: quita las entradas de respuesta libre (no tienen solución que mostrar);
     · resto: encoge el cuerpo de letra hasta un 84 % y, si aún no cabe, quita ejercicios del final.
     Devuelve los números de página tocados para repetirlo sin medir todo el libro. */
  function ajustar(res, lista) {
    var C = res.C, Md = null, tocadas = [], set = lista ? {} : null;
    if (lista) { if (!lista.length) return tocadas; lista.forEach(function (n) { set[n] = 1; }); }
    try {
      res.pages.forEach(function (p) {
        if (set && !set[p.num]) return;
        if (NO_TIPO.test(p.tipo) && p.tipo !== 'glosario') return;
        Md = Md || EC.medidor(C); var h = Md.hueco(p, res); if (!h || h.lleno <= 1.01) return;
        tocadas.push(p.num); var mide = function () { h = Md.hueco(p, res); return h && h.lleno > 1.01; };
        if (p.tipo === 'vis' && p.v && typeof p.v.fig === 'string') {
          var its = p.v.items || p.items || [], tope = 130;
          var achica = function (min) {
            while (h && h.lleno > 1.01 && tope >= min) {
              p.v.fig0 = p.v.fig0 || p.v.fig;
              p.v.fig = p.v.fig0.replace(/<svg\b[^>]*>/, function (m) { return m.replace(/\sstyle="[^"]*"/g, '').replace('<svg', '<svg style="display:block;margin:0 auto;height:' + tope + 'mm;width:auto;max-width:100%"'); });
              mide(); tope -= 10;
            }
          };
          achica(90);
          while (h && h.lleno > 1.01 && its.length > 3) { its.pop(); mide(); }
          achica(55);
          while (h && h.lleno > 1.01 && its.length > 1) { its.pop(); mide(); }
          return;
        }
        if (p.tipo === 'solucion' && p.entradas) {
          p.entradas = p.entradas.map(function (e) { return e && e.items ? Object.assign({}, e, { items: e.items.filter(function (x) { return (x.s !== '' && x.s != null) || x.x; }) }) : e; }).filter(function (e) { return !e || !e.items || e.items.length; });
          if (!mide()) return;
        }
        [.94, .88, .84].some(function (f) { p.encaje = f; return !mide(); });
        /* lecturas: quitar primero las cajas opcionales y la figura antes que los ejercicios */
        if (/^lec_/.test(p.tipo) && h && h.lleno > 1.01) {
          if (p.fig && h && h.lleno > 1.01) { p.figMax = 60; while (h && h.lleno > 1.01 && p.figMax > 36) { p.figMax -= 6; mide(); } }
          var quit = {};
          if (h && h.lleno > 1.01) ['inv', 'err', 'dato'].some(function (k) { if (p[k]) { quit[k] = p[k]; p[k] = null; } return !mide(); });
          if (p.fig && h && h.lleno > 1.01) { quit.fig = p.fig; p.fig = null; mide(); }
          /* lo quitado deja sitio: volver a la letra más grande que quepa */
          [1, .94, .88, .84].some(function (f) { p.encaje = f === 1 ? null : f; return !mide(); });
          /* y devolver, de lo quitado, lo que vuelva a caber (para no dejar la página corta) */
          ['dato', 'err', 'inv', 'fig'].forEach(function (k) {
            if (!quit[k] || !h || h.lleno > .9) return;
            p[k] = quit[k]; if (mide()) { if (k === 'fig') { while (p.figMax > 24 && mide()) p.figMax -= 4; if (mide()) p[k] = null; } else p[k] = null; } mide();
          });
        }
        if (p.tipo === 'glosario' && h && h.lleno > 1.01) { p.max = 60; while (h && h.lleno > 1.01 && p.max > 6) { p.max -= 2; mide(); } }
        if (!h || h.lleno <= 1.01) return;
        var listas = [p.items, p.hechos, p.entradas].filter(function (a) { return a && a.length > 1; });
        listas.forEach(function (a) { while (h && h.lleno > 1.01 && a.length > 1) { a.pop(); mide(); } });
      });
    } finally { if (Md) Md.fin(); }
    return tocadas;
  }
  ED.registrar({ post: function (h, pg, C) { if (!pg.encaje) return h; var fs = C.fs * pg.encaje; return h.replace('font-size:' + C.fs + 'px;line-height:1.5', 'font-size:' + fs.toFixed(2) + 'px;line-height:1.42'); } });

  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var res = ens(cfg);
    try {
      var modoR = (cfg && cfg.acab || {}).relleno;
      if (cfg && ADU.test(cfg.materia) && modoR !== 'tandas' && res && res.C && res.C.papel && res.C.papel.id !== 'slide' && document.body && !/^(pitch)$/.test(cfg.prod)) {
        var kA = 'A' + JSON.stringify(cfg);
        if (!MEMO[kA]) {
          var ajA = ajustar(res), fA = {};
          /* las páginas recortadas por desborde pueden quedar cortas: se vuelven a rellenar con EU_ECOM */
          if (ajA && ajA.length && window.EU_ECOM && EU_ECOM.llenar) {
            var tc = {}; ajA.forEach(function (n) { tc[n] = 1; });
            res.pages.forEach(function (p) { if (tc[p.num]) delete p.fill; });
            EU_ECOM.llenar(res);
            res.pages.forEach(function (p) { if (tc[p.num] && p.fill) fA[p.num] = p.fill; });
          }
          MEMO[kA] = { aj: ajA, f: fA }; memoK.push(kA); if (memoK.length > 8) delete MEMO[memoK.shift()];
        } else { ajustar(res, MEMO[kA].aj); var fM = MEMO[kA].f || {}; res.pages.forEach(function (p) { if (fM[p.num]) p.fill = Object.assign({}, fM[p.num]); }); }
      }
      if (cfg && !ADU.test(cfg.materia) && PRODS.test(cfg.prod || 'libro') && res && res.C && res.C.papel && res.C.papel.id !== 'slide' && modoR !== 'no' && modoR !== 'tandas' && document.body) {
        var key = JSON.stringify(cfg), M = MEMO[key];
        if (M) { ajustar(res, M.aj); res.pages.forEach(function (p) { if (M.f[p.num]) p.fill2 = M.f[p.num]; }); }
        else {
          var aj = ajustar(res); llenar(res); var g = {}; res.pages.forEach(function (p) { if (p.fill2) g[p.num] = p.fill2; });
          MEMO[key] = { f: g, aj: aj }; memoK.push(key); if (memoK.length > 6) delete MEMO[memoK.shift()];
        }
      }
    } catch (e) { console.warn('EU_RELLENO', e); }
    return res;
  };
  /* Relleno por tandas: el Editorial arma con cfg.acab.relleno = 'tandas' (rápido, sin medir) y luego
     llama a porTandas(res, cfgReal) para medir y rellenar página a página en trozos de ~40 ms sin
     congelar el navegador. Hace lo mismo que el ensamblado síncrono y deja el resultado en MEMO con la
     clave de la cfg real, así un ensamblar(cfgReal) posterior (exportar, paquete) no vuelve a medir.
     Devuelve { p: Promise<bool>, terminar() } — terminar() acaba lo pendiente de golpe (antes de exportar). */
  function porTandas(res, cfg, o) {
    o = o || {};
    var C = res && res.C, A = (cfg && cfg.acab) || {}, adu = cfg && ADU.test(cfg.materia);
    var nada = function (v) { return { p: Promise.resolve(v), terminar: function () { } }; };
    if (!cfg || !C || !C.papel || C.papel.id === 'slide' || !document.body) return nada(false);
    if (adu ? /^(pitch)$/.test(cfg.prod) : (A.relleno === 'no' || !PRODS.test(cfg.prod || 'libro'))) return nada(false);
    var key = JSON.stringify(cfg), kA = 'A' + key, porNum = {};
    res.pages.forEach(function (p) { porNum[p.num] = p; });
    if (adu) {
      var MA = MEMO[kA], ME = EC.MEMO && EC.MEMO[key], conE = A.relleno !== 'no';
      if (MA && (ME || !conE)) {
        if (conE) res.pages.forEach(function (p) { if (ME[p.num]) p.fill = Object.assign({}, ME[p.num]); });
        ajustar(res, MA.aj); var fM = MA.f || {};
        (MA.aj || []).forEach(function (n) { if (porNum[n] && fM[n]) porNum[n].fill = Object.assign({}, fM[n]); });
        return nada(true);
      }
    } else if (MEMO[key]) {
      var M = MEMO[key]; ajustar(res, M.aj); res.pages.forEach(function (p) { if (M.f[p.num]) p.fill2 = M.f[p.num]; });
      return nada(true);
    }
    var nums = res.pages.filter(function (p) { return !NO_TIPO.test(p.tipo) || p.tipo === 'glosario'; }).map(function (p) { return p.num; });
    var i = 0, aj = [], g = {}, fA = {}, st = {}, stE = {}, hecho = false, ok = null;
    var conE2 = adu && A.relleno !== 'no' && EC.llenar;
    var paso = function (n) {
      var L = {}, pg = porNum[n]; L[n] = 1;
      if (adu) {
        if (conE2) { EC.llenar(res, { lista: L, st: stE }); if (pg && pg.fill) g[n] = pg.fill; }
        if (ajustar(res, [n]).length) {
          aj.push(n);
          if (conE2 && pg) { delete pg.fill; EC.llenar(res, { lista: L, st: stE }); if (pg.fill) fA[n] = pg.fill; }
        }
      } else {
        if (ajustar(res, [n]).length) aj.push(n);
        llenar(res, { lista: L, st: st });
        if (pg && pg.fill2) g[n] = pg.fill2;
      }
    };
    var fin = function () {
      if (hecho) return; hecho = true;
      if (adu) { if (conE2 && EC.MEMO) EC.MEMO[key] = g; MEMO[kA] = { aj: aj, f: fA }; memoK.push(kA); }
      else { MEMO[key] = { f: g, aj: aj }; memoK.push(key); }
      if (memoK.length > 6) delete MEMO[memoK.shift()];
    };
    var p = new Promise(function (resolve) {
      ok = resolve;
      var tanda = function () {
        if (hecho) return;
        if (o.vivo && !o.vivo()) { hecho = true; return resolve(false); }
        var t0 = performance.now(), toc = [];
        while (i < nums.length && performance.now() - t0 < 40) { try { paso(nums[i]); } catch (e) { console.warn('EU_RELLENO tandas', e); } toc.push(nums[i]); i++; }
        if (o.progreso) try { o.progreso(i, nums.length, toc); } catch (e) { }
        if (i >= nums.length) { fin(); return resolve(true); }
        setTimeout(tanda, 0);
      };
      setTimeout(tanda, 30);
    });
    return {
      p: p,
      terminar: function () {
        if (hecho) return;
        while (i < nums.length) { try { paso(nums[i]); } catch (e) { console.warn('EU_RELLENO tandas', e); } i++; }
        fin(); if (ok) ok(true);
      }
    };
  }
  window.EU_RELLENO = { llenar: llenar, ajustar: ajustar, bloque: bloque, porTandas: porTandas };
})();
