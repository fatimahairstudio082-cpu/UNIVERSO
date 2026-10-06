/* b6_libro_escaner.js — escáner anti-repetición del libro (window.EU_ESCANER). Todas las materias.
   1 · Al armar el libro (último en la cadena de ensamblar), corrige sin inventar nada:
       · páginas que llegan sin contenido (p. ej. «Para saber más» sin datos, que rompían libros de 500+ págs.);
       · láminas repetidas (el mismo dibujo de la biblioteca o el mismo generador en dos páginas).
       Las sustituye, por este orden, por un dibujo de la biblioteca de la materia que aún no esté en el libro
       (EU_MODELOS), por una lámina del motor de láminas (LAMINAS_MOTOR: mapa o mandala hecho SOLO con el título,
       las palabras clave y las ideas de la unidad) o, si la unidad ya tiene sus láminas, por «Mis apuntes».
       El solucionario se actualiza. `cfg.acab.escaner = 'no'` lo apaga.
   2 · «🔎 Escáner del libro» en Salidas: recorre todas las páginas y muestra frases repetidas (con sus páginas),
       dibujos repetidos, páginas vacías y lo que se corrigió. No cambia ninguna descarga.
   Cargar al final de la lista diferida (después de b6_pelu_libro_diagrama.js). */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_ESCANER) return;
  var PRODS = /^(libro|ebook|cuaderno|fichas|unidad|trabajo|libro_pro|recetario|diccionario)$/;
  var TAMBIEN = { bio: ['anat'], geoalg: ['mate'], geografia: ['soci'], reposteria: ['cocina'], cocina: ['batidos'] };
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function sub(s, C) { try { return ED.sub(String(s || ''), C); } catch (e) { return String(s || ''); } }
  function corto(s, n) { s = String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s; }

  /* ─── lámina de la unidad con el motor de láminas (imagen; los textos son los de la unidad) ─── */
  /* estructuras del motor en las que ningún trazo pisa los rótulos (revisadas una a una en hoja de contacto) */
  var VARIANTES = [{ est: ['niveles', 'burbujas', 'mandala_roseton', 'mandala_petalos'], de: 'k' },
    { est: ['arbol_lateral', 'mandala_cunas', 'mandala_reloj', 'mandala_mosaico'], de: 'i' }, { est: ['arbol_lateral'], de: 'ki' }];
  var IMG = {};
  function nodosDe(u, C, de) {
    var k = (u.k || []).map(function (x) { return corto(sub(x, C), 34); }).filter(Boolean), i = (u.i || []).map(function (x) { return corto(sub(x, C), 120); }).filter(Boolean);
    var raiz = [{ t: corto(sub(u.t, C), 48), d: '', nivel: 0 }];
    if (de === 'k') return k.length >= 2 ? raiz.concat(k.slice(0, 8).map(function (t) { return { t: t, d: '', nivel: 1 }; })) : null;
    if (de === 'i') return i.length >= 2 ? raiz.concat(i.slice(0, 6).map(function (t) { return { t: t, d: '', nivel: 1 }; })) : null;
    if (k.length < 2 || !i.length) return null;
    var o = raiz.slice(); k.slice(0, 4).forEach(function (t, j) { o.push({ t: t, d: '', nivel: 1 }); if (i[j]) o.push({ t: i[j], d: '', nivel: 2 }); });
    return o;
  }
  function lamina(pg, C) {
    var LM = window.LAMINAS_MOTOR, u = pg.u; if (!LM || !u) return '';
    var V = VARIANTES[pg.lam || 0], clave = C.mat + '|' + u.id + '|' + (pg.lam || 0) + '|' + C.T.acc; if (IMG[clave]) return IMG[clave];
    var nodos = nodosDe(u, C, V.de); if (!nodos) return '';
    var ests = V.est.filter(function (id) { return !!(LM.ESTRUCTURAS || {})[id]; }), pals = (LM.paletas() || []).filter(function (p) { return p.claro; });
    var h = ED.H.hash(u.id + ':lam' + (pg.lam || 0)), W = 1400, Hh = 1560;
    var lam = { titulo: corto(sub(u.t, C), 60), subtitulo: V.de === 'i' ? 'Ideas de la unidad' : 'Palabras clave', estructura: ests.length ? ests[h % ests.length] : 'radial', paleta: pals.length ? pals[h % pals.length].id : undefined, nodos: nodos };
    try {
      var cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
      LM.pintar(cv.getContext('2d'), W, Hh, lam, { prog: 1, modo: 'aparecer' });
      IMG[clave] = cv.toDataURL('image/jpeg', 0.86);
    } catch (e) { console.warn('Escáner · lámina', e); return ''; }
    return IMG[clave];
  }
  function paginaLamina(pg, C) {
    var H = ED.H, T = C.T, u = pg.u, src = lamina(pg, C), V = VARIANTES[pg.lam || 0];
    if (!src) return H.cabecera(C, pg) + H.h1(C, 'Mis apuntes') + H.lineas(Math.floor(H.presupuesto(C, 90) / 1.05), C) + H.folio(C, pg);
    return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">Unidad ' + pg.n + ' · Lámina</div>' +
      H.h1(C, V.de === 'i' ? 'Las ideas de un vistazo' : 'Mapa de la unidad', 'margin-bottom:3mm') +
      '<img src="' + src + '" alt="' + es(sub(u.t, C)) + '" style="width:100%;max-height:200mm;object-fit:contain;display:block;margin:0 auto">' +
      '<p style="font-size:.8em;opacity:.8;margin:3mm 0 0">' + (V.de === 'i' ? 'Las ideas de la unidad «' : 'Las palabras clave de la unidad «') + es(sub(u.t, C)) + '». Explica en voz alta cómo se relacionan.</p>' + H.lineas(4, C) + H.folio(C, pg);
  }
  ED.registrar({ paginas: { esc_lamina: paginaLamina }, voz: { esc_lamina: function (pg, C) { var u = pg.u; return u ? 'Mapa de la unidad: ' + sub(u.t, C) + '. ' + (u.k || []).map(function (x) { return sub(x, C); }).join(', ') + '.' : ''; } } });

  /* ─── corrección al armar ─── */
  /* fotogramas de los motores de Peluquería (Guías 3D, Estudios, divisiones): ya salen en sus propias páginas */
  var MOTOR = /^pe_(g3d|est|div)_/;
  function vacia(p) { return p.tipo === 'lec_amplia' && !p.ds; }
  function corregir(res, cfg) {
    var C = res && res.C; if (!C || !res.pages || !cfg || ((cfg.acab || {}).escaner === 'no') || !PRODS.test((C.prod && C.prod.id) || '')) return res;
    var pages = res.pages, MO = window.EU_MODELOS, vistos = {}, malas = [];
    /* Peluquería: los pasos de Guías 3D (pe_g3d_<corte>_<k>) ya salen en la página de la guía de su corte */
    var guia = {};
    pages.forEach(function (p) { if (p.tipo === 'pe_guia3d' && p.corte) guia[p.corte] = 1; });
    function enGuia(id) { var m = /^pe_g3d_(.+)_\d+$/.exec(id || ''); return !!(m && guia[m[1]]); }
    pages.forEach(function (p, i) {
      if (vacia(p)) return malas.push([i, 'vacía']);
      /* solo dibujos fijos de la biblioteca: un generador (gen) con otra semilla da otro ejercicio, no se toca */
      var k = p.tipo === 'vis' && p.gen && MO && MO.modelo(p.gen) ? 'g:' + p.gen : p.tipo === 'col_modelo' && p.mod ? 'g:' + p.mod : '';
      if (!k) return; if (vistos[k]) malas.push([i, 'repetida']); else if (enGuia(p.gen)) malas.push([i, 'ya en la guía 3D', 1]); else vistos[k] = 1;
    });
    if (!malas.length) { res.escaner = { cambios: [] }; return res; }
    /* dibujos de la biblioteca que aún no están en el libro (mismo criterio que b6_modelos_libro.js) */
    var libres = [];
    if (MO && MO.vis) {
      var ya = {}, permit = null;
      pages.forEach(function (p) {
        if (p.gen) ya[p.gen] = 1; if (p.mod) ya[p.mod] = 1;
        if (p.u && p.u.mods) { permit = permit || {}; p.u.mods.forEach(function (id) { permit[id] = 1; }); }
        var t = ''; try { t = JSON.stringify(p, function (k, v) { return k === 'u' || k === 'C' ? undefined : v; }); } catch (e) { }
        (t.match(/data-modelo=\\"[^\\"]+/g) || []).forEach(function (x) { ya[x.replace(/^data-modelo=\\"/, '')] = 1; });
      });
      [C.mat].concat(TAMBIEN[C.mat] || []).forEach(function (m) { (MO.lista(m) || []).forEach(function (x) { if (!ya[x.id] && !MOTOR.test(x.id) && (!permit || permit[x.id])) libres.push(x); }); });
    }
    var lamU = {}, cambios = [], sols = pages.filter(function (p) { return p.tipo === 'solucion' && p.entradas; });
    pages.forEach(function (p) { if (p.tipo === 'esc_lamina' && p.u) lamU[p.u.id] = (lamU[p.u.id] || 0) + 1; });
    malas.forEach(function (m) {
      var i = m[0], pg = pages[i], u = pg.u, nu = null;
      /* primero las láminas de la unidad (cada variante sale una sola vez), luego dibujos sin usar, luego apuntes */
      if (u) { var j = lamU[u.id] || 0; while (j < VARIANTES.length && !nodosDe(u, C, VARIANTES[j].de)) j++; if (j < VARIANTES.length) { nu = { tipo: 'esc_lamina', u: u, n: pg.n, num: pg.num, lam: j }; lamU[u.id] = j + 1; } }
      while (!nu && libres.length) {
        var md = libres.shift(), V = MO.vis(md.id, C);
        if (V) nu = { tipo: 'vis', u: u, n: pg.n, v: V, items: V.items, relleno: false, modeloLib: 1, gen: md.id, sem: ED.H.hash((u ? u.id : '') + ':esc:' + md.id + ':' + pg.num) + (C.semilla || 1) * 7919, num: pg.num };
      }
      if (!nu && m[2]) return;
      if (!nu) nu = { tipo: 'apuntes', u: u, n: pg.n, num: pg.num };
      if (pg.indice) nu.indice = pg.indice;
      pages[i] = nu; cambios.push({ p: pg.num, motivo: m[1], antes: pg.gen || pg.mod || pg.tipo, ahora: nu.tipo === 'vis' ? 'dibujo ' + nu.gen : nu.tipo === 'esc_lamina' ? 'lámina de la unidad' : 'Mis apuntes' });
      /* solucionario: las soluciones de la página nueva (o ninguna) */
      sols.forEach(function (s) { s.entradas = s.entradas.filter(function (e) { return e.p !== pg.num; }); });
      if (nu.items && nu.items.length && sols.length) { var d = sols[0]; sols.forEach(function (s) { if (s.entradas.length && s.entradas[0].p < pg.num) d = s; }); d.entradas.push({ p: pg.num, items: nu.items, u: u }); d.entradas.sort(function (a, b) { return a.p - b.p; }); }
    });
    res.escaner = { cambios: cambios };
    return res;
  }
  function enganchar() {
    if (ED.__escaner) return; ED.__escaner = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { corregir(r, cfg); } catch (e) { console.warn('Escáner', e); } return r; };
  }
  /* el último de la cadena: después de los módulos que se enganchan al terminar la carga */
  function esperar(n) { if ((ED.__modelosLibro2 || !ED.__modelosLibro) && (ED.__peluLibroDg || !window.EU_PELU_LIBRO_DG || n > 40)) enganchar(); else setTimeout(function () { esperar(n + 1); }, 300); }
  if (document.readyState === 'complete') setTimeout(function () { esperar(0); }, 400); else window.addEventListener('load', function () { setTimeout(function () { esperar(0); }, 400); });

  /* ─── informe: recorre todas las páginas (por tandas, sin congelar la pantalla) ─── */
  function informe(res, aviso) {
    var C = res.C, P = res.pages, i = 0, mods = {}, frases = {}, vacias = [], tipos = {};
    return new Promise(function (ok) {
      (function tanda() {
        var t0 = performance.now();
        for (; i < P.length && performance.now() - t0 < 40; i++) {
          var pg = P[i], h = ''; tipos[pg.tipo] = (tipos[pg.tipo] || 0) + 1;
          try { h = ED.paginaHTML(pg, C, 'print', res); } catch (e) { vacias.push(pg.num + ' (error: ' + e.message + ')'); continue; }
          (h.match(/data-modelo="[^"]+"/g) || []).forEach(function (m) { var k = m.slice(13, -1); (mods[k] = mods[k] || []).push(pg.num); });
          var t = h.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ');
          t.split(/(?<=[.!?])\s+/).forEach(function (f) { f = f.trim(); if (f.length > 45) (frases[f] = frases[f] || []).push(pg.num); });
          if (t.replace(/[^a-záéíóúñü]/gi, '').length < 120 && !/<svg|<img|<image/.test(h) && pg.tipo !== 'contra' && pg.tipo !== 'apuntes') vacias.push(pg.num);
        }
        if (aviso) aviso('Escáner: página ' + i + ' de ' + P.length + '…');
        if (i < P.length) return setTimeout(tanda, 0);
        var rep = function (o) { return Object.keys(o).map(function (k) { var v = o[k].filter(function (x, j, a) { return a.indexOf(x) === j; }); return [k, o[k].length, v]; }).filter(function (e) { return e[1] > 1; }).sort(function (a, b) { return b[1] - a[1]; }); };
        ok({ paginas: P.length, tipos: tipos, dibujos: Object.keys(mods).length, dibujosRep: rep(mods), frasesRep: rep(frases), vacias: vacias, laminas: tipos.esc_lamina || 0, diagramas: tipos.pe_diagrama || 0, cambios: (res.escaner || {}).cambios || [] });
      })();
    });
  }
  function ventana(R, titulo) {
    var f = document.createElement('div'), pags = function (a) { return a.slice(0, 12).join(', ') + (a.length > 12 ? '…' : ''); };
    f.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,8,20,.82);display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box';
    var b = document.createElement('div'); b.style.cssText = 'background:#fff;color:#1F1B18;border-radius:12px;max-width:860px;width:100%;max-height:100%;overflow:auto;padding:18px 22px;font:14px/1.45 system-ui,sans-serif';
    var vecesRep = R.frasesRep.reduce(function (s, e) { return s + e[1] - 1; }, 0);
    b.innerHTML = '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px"><b style="font-size:17px;flex:1">🔎 Escáner del libro · ' + es(titulo) + '</b><button data-x="1" style="background:#7c3aed;color:#fff;border:0;border-radius:8px;padding:8px 14px;font-weight:700;cursor:pointer">✕ Cerrar</button></div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin:8px 0 14px">' + [['Páginas', R.paginas], ['Dibujos distintos', R.dibujos], ['Dibujos repetidos', R.dibujosRep.length], ['Frases repetidas', R.frasesRep.length + ' (' + vecesRep + ' veces)'], ['Páginas vacías', R.vacias.length], ['Láminas', R.laminas], ['Diagramaciones', R.diagramas], ['Corregidas al armar', R.cambios.length]].map(function (x) {
        return '<div style="background:#F3EFFA;border-radius:8px;padding:8px 10px"><div style="font-size:12px;opacity:.75">' + x[0] + '</div><b style="font-size:18px">' + x[1] + '</b></div>'; }).join('') + '</div>' +
      (R.cambios.length ? '<b>Corregido al armar el libro</b><ul style="margin:4px 0 12px;padding-left:18px">' + R.cambios.slice(0, 40).map(function (c) { return '<li>Pág. ' + c.p + ' (' + es(c.motivo) + ': ' + es(c.antes) + ') → ' + es(c.ahora) + '</li>'; }).join('') + '</ul>' : '') +
      (R.dibujosRep.length ? '<b>Dibujos que salen más de una vez</b><ul style="margin:4px 0 12px;padding-left:18px">' + R.dibujosRep.slice(0, 20).map(function (e) { return '<li>' + es(e[0]) + ' · ' + e[1] + ' veces · págs. ' + pags(e[2]) + '</li>'; }).join('') + '</ul>' : '') +
      (R.frasesRep.length ? '<b>Frases repetidas</b> <span style="opacity:.7">(las de los datos de cada corte o técnica se repiten porque el dato es el mismo; el escáner no reescribe textos)</span><ol style="margin:4px 0 12px;padding-left:22px">' + R.frasesRep.slice(0, 25).map(function (e) { return '<li>' + e[1] + '× «' + es(corto(e[0], 140)) + '» · págs. ' + pags(e[2]) + '</li>'; }).join('') + '</ol>' : '') +
      (R.vacias.length ? '<b>Páginas casi vacías</b><div style="margin:4px 0 12px">' + es(R.vacias.slice(0, 40).join(', ')) + '</div>' : '');
    f.appendChild(b); document.body.appendChild(f);
    var cerrar = function () { f.remove(); document.removeEventListener('keydown', tecla); }, tecla = function (e) { if (e.key === 'Escape') cerrar(); };
    b.querySelector('[data-x]').onclick = cerrar; document.addEventListener('keydown', tecla);
  }
  function salidas() {
    var CN = window.EU_CONECTORES; if (!CN || CN.__escaner) return !!CN;
    var s0 = CN.salidas; CN.__escaner = true;
    CN.salidas = function (ed, b8) {
      b8('🔎 Escáner del libro', function () {
        if (ed.terminarTandas) ed.terminarTandas();
        if (!ed.res) return ed.aviso('Arma primero el libro.');
        informe(ed.res, function (t) { ed.aviso(t); }).then(function (R) { ed.aviso('Escáner: ' + R.paginas + ' páginas revisadas.'); ventana(R, ed.res.C.titulo || ''); });
      });
      return s0.apply(this, arguments);
    };
    return true;
  }
  if (!salidas()) (function espera(n) { if (!salidas() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_ESCANER = { corregir: corregir, informe: informe, lamina: lamina };
})();
