/* b6_pelu_llenar.js — hojas llenas en el libro de Peluquería y Colorimetría (window.EU_PELU_LLENAR).
   21-11-2026 (Fátima: «los libros y cursos salen a mitad de hoja»; «hay una biblioteca de imágenes de corte que no se está
   aprovechando, ni el maniquí, ni la información que arroja el sistema»; «bien sincronizado»).
   Solo materia `pelu`. Al final de la cadena de Peluquería (después de b6_pelu_receta.js):
     1. La receta paso a paso que dejaba una última hoja con uno o dos pasos se junta con la anterior si caben juntas
        (se quita esa hoja y se renumeran páginas y solucionario).
     2. Cada hoja de Peluquería que queda con hueco (clase, receta, en el salón, técnica, diagrama, escena)
        se completa SOLO con lo suyo, de esa misma clase o unidad y sin repetir en el libro:
          a. imágenes de su Galería web que son esa técnica o ese corte (destino exacto; sin fichas de herramientas y productos),
             con su título y su descripción tal cual;
          b. escenas del maniquí de esa clase que la hoja no enseña, con su título y su texto;
          c. información del sistema: errores comunes de los pasos de la técnica (Cerebro), sus recomendaciones,
             la ficha del corte y los errores comunes de la unidad.
        Lo que no se llena con eso queda en blanco: nada inventado, nada infantil, nada de la biblioteca genérica.
     3. Una hoja de Peluquería que se sale baja la letra (pg.encaje, 0,94 → 0,84) hasta que cabe.
   Curso premium: las mismas imágenes de la galería que el libro puso con una clase entran en su lección (antes de
   «A continuación»), así libro y curso enseñan lo mismo. cfg.acab.llenarPelu = 'no' lo apaga. */
(function () {
  'use strict';
  if (window.EU_PELU_LLENAR) return;
  var ED = window.EU_EDITORIAL; if (!ED) return;
  var LIBROS = /^(libro|libro_pro|ebook|cuaderno|unidad|trabajo)$/;
  var TIPOS = /^(pe_clase|pe_salon|pe_tecnica|pe_diagrama|pe_escena|esc_lamina|pe_animada)$/;   /* pe_animada: sus imágenes llevan ya su proporción (22-11-2026) */
  var HUECO = 28;   /* mm libres a partir de los cuales se añade algo */
  var SEG = 6;      /* margen de seguridad: el medidor y la hoja impresa difieren unos milímetros */

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function activo(cfg) { return cfg && cfg.materia === 'pelu' && LIBROS.test(String(cfg.prod || 'libro')) && ((cfg.acab || {}).llenarPelu) !== 'no'; }
  function nq(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

  /* ─────────── recursos de una hoja ─────────── */
  function GW() { return window.EU_PELU_GALERIA; }
  function RC() { return window.EU_PELU_RECETA; }
  /* imágenes de su galería ligadas con seguridad a esa técnica o corte (`id`) o, si no hay clase, a esa unidad */
  function imagenes(id, unidad) {
    var g = GW(), rc = RC(), out = []; if (!g || !g.G || !g.destino) return out;
    g.G.forEach(function (row) {
      if (/^2[78]$/.test(String(row[2]))) return;   /* fichas de herramientas y productos: no son la foto de una clase */
      var ds = null; try { ds = g.destino(row); } catch (e) { ds = null; }
      if (!ds || !ds.ok || (ds.k !== 'tec' && ds.k !== 'corte')) return;
      if (id ? ds.id !== id : ds.unidad !== unidad) return;
      var gid = g.id(row[0]); if (rc && rc.esHerr && rc.esHerr(gid)) return;
      out.push(row[0]);
    });
    return out;
  }
  function claseDe(pg) { var rc = RC(); return pg.tipo === 'pe_clase' && rc && rc.R && rc.R[pg.rec] ? rc.R[pg.rec] : null; }
  function idGal(r) { return !r ? '' : r.k === 'corte' ? String(r.lec || '').replace(/^__/, '') : (r.id || ''); }
  function cerebro(r, pg) {
    var B = window.EU_CEREBRO; if (!B || !B.obtener) return null;
    var id = r && r.cer ? r.cer : pg.tec ? pg.tec : pg.u && /^cb_/.test(pg.u.id) ? pg.u.id.slice(3) : '';
    try { return id ? B.obtener(id) : null; } catch (e) { return null; }
  }
  /* las piezas posibles de una hoja, en orden: imágenes, escenas del maniquí, información del sistema */
  function piezas(pg, usado) {
    var out = [], r = claseDe(pg), rc = RC(), g = GW();
    /* a. galería */
    var anim = pg.tipo === 'pe_animada' && pg.tec;   /* técnica animada: solo lo de ESA técnica, nunca otra de su unidad */
    var ids = r ? imagenes(idGal(r)) : anim ? imagenes(pg.tec) : imagenes('', pg.u && pg.u.id);
    /* 22-11-2026 (Fátima: «cada clase es un proceso; en esa clase, la nomenclatura de los colores fríos»): SOLO en «Matizadores
       más usados», el ejercicio de los fríos de su estrella de neutralización (EU_COLOR_CEREBRO.calc.estrella): niveles sumados y
       divididos, el número frío que corresponde y el color que neutraliza. Ninguna otra clase lleva esta cuenta. */
    var tit = anim ? tituloAnim(pg.tec) : r ? r.n : '';
    if (/matizadores m[aá]s usados/i.test(tit) && !usado.txt['frios']) { var fr = friosEstrella(); if (fr) out.push(fr); }
    ids.forEach(function (n) {
      var gid = g.id(n); if (usado.img[gid]) return;
      if (!g.dato(gid)) return;   /* la imagen aún no ha llegado: no se pone una ruta que no viaja con el libro */
      out.push({ k: 'img', id: gid, n: n, t: g.titulo(n), d: g.desc(n) });
    });
    /* b. escenas del maniquí de la clase que la hoja no enseña (la hoja 1 enseña las dos primeras de «Cómo queda») */
    if (r && rc && rc.pasos && rc.maniqui) {
      var P = rc.pasos(pg.rec) || [], ya = P.filter(function (p) { return p.etapa === 'queda' && p.e; }).slice(0, 2);
      P.forEach(function (p) {
        if (!p.e || p.q || ya.indexOf(p) >= 0) return;
        var key = pg.rec + '|' + p.e.tipo + '|' + (p.e.t || ''); if (usado.esc[key]) return;
        out.push({ k: 'esc', key: key, p: p, t: String(p.t || '').replace(/^(Visualización|Clase|Práctica|Cómo queda) · /, ''), d: p.texto || '' });
      });
    }
    /* b2. hojas de unidad (lámina, en el salón, escena): escenas del maniquí de los cortes o de la técnica de esa unidad
       (las mismas que ya da la galería: EU_PELU_LIBRO_DG para cortes, EU_PELU_LIBRO_ANIM para técnicas) */
    /* 22-11-2026 (Fátima: «cada escena con su respectivo corte»): un solo corte por hoja, con sus vistas seguidas; nunca se
       mezclan escenas de cortes distintos */
    if (anim) {
      var LA = window.EU_PELU_LIBRO_ANIM, dA = null; try { dA = LA && LA.datos ? LA.datos(pg.tec) : null; } catch (er) { dA = null; }
      if (dA && dA.E) dA.E.escenas.forEach(function (e, i) {
        if ((dA.sel || []).indexOf(i) >= 0 || NOESC.test(e.tipo || '')) return;
        var key = 'an|' + pg.tec + '|' + i; if (usado.esc[key]) return;
        out.push({ k: 'esc', g: pg.tec, key: key, src: function () { return LA.foto(pg.tec, i, 640); }, t: (i + 1) + ' · ' + (e.t || ''), d: e.texto || '' });
      });
    } else if (!r && pg.u) {
      var grupos = {}, orden = [];
      escenasUnidad(pg.u).forEach(function (x) { if (usado.esc[x.key]) return; if (!grupos[x.g]) { grupos[x.g] = []; orden.push(x.g); } grupos[x.g].push(x); });
      if (orden.length) grupos[orden[0]].forEach(function (x) { out.push(x); });
    }
    /* c. información del sistema */
    var T = cerebro(r, pg);
    if (T && T.pasos) {
      var errs = T.pasos.filter(function (p) { return p && p.e && !usado.txt[nq(p.e)]; }).map(function (p) { return [p.t || p.n || '', p.e]; });
      if (errs.length && pg.tipo !== 'pe_tecnica') out.push({ k: 'lista', t: 'Errores comunes', its: errs.map(function (x) { return (x[0] ? x[0] + ': ' : '') + x[1]; }), keys: errs.map(function (x) { return nq(x[1]); }) });
      var F = T.ficha || {}, rec = (F.recomendaciones || []).filter(function (x) { return !usado.txt[nq(x)]; });
      var yaRec = pg.tipo === 'pe_clase' && pg.parte === 2 && pg.ult !== false && r && r.cer;   /* esa hoja ya lleva sus recomendaciones */
      if (rec.length && !yaRec) out.push({ k: 'lista', t: 'Recomendaciones', its: rec, keys: rec.map(nq) });
      /* la ficha y el paso a paso de la técnica (Cerebro) donde la hoja no los enseña ya (la clase y la técnica sí los llevan) */
      if (!/^(pe_clase|pe_tecnica)$/.test(pg.tipo)) {
        var fk = 'ficha:' + T.id, fil = function (k, v) { v = [].concat(v || []).filter(function (x) { return x && x !== '—'; }); return v.length ? k + ': ' + v.join(' · ') : ''; };
        var fi = [fil('Fórmula', F.formula), fil('Proporciones', F.proporciones), fil('Productos', F.productos), fil('Tiempo', F.tiempos), fil('Herramientas', F.herramientas)].filter(Boolean);
        if (fi.length && !usado.txt[fk]) out.push({ k: 'lista', t: 'Ficha de la técnica · ' + T.n, its: fi, keys: [fk] });
        var pk = 'pasos:' + T.id, ps = T.pasos.filter(function (p) { return p && p.t && p.n; }).map(function (p) { return p.t + ': ' + p.n; });
        if (ps.length && !usado.txt[pk]) out.push({ k: 'lista', t: 'Paso a paso · ' + T.n, its: ps, keys: [pk] });
        var fe = (F.errores || []).filter(function (x) { return !usado.txt[nq(x)]; });
        if (fe.length) out.push({ k: 'lista', t: 'Lo que no se hace', its: fe, keys: fe.map(nq) });
      }
    }
    var err = anim ? [] : ((pg.u && pg.u.err) || []).map(function (x) { return Array.isArray(x) ? x.join(': ') : String(x); }).filter(function (x) { return x && !usado.txt[nq(x)]; });
    if (err.length) out.push({ k: 'lista', t: 'Errores comunes de la unidad', its: err, keys: err.map(nq) });
    return out;
  }

  function tituloAnim(tec) { var LA = window.EU_PELU_LIBRO_ANIM, d = null; try { d = LA && LA.datos ? LA.datos(tec) : null; } catch (e) { d = null; } return d && d.E && d.E.R ? String(d.E.R.n || '') : ''; }
  /* 22-11-2026 (Fátima: «los tonos fríos se crean con los colores primarios»): solo «Matizadores más usados». Cada frío se
     crea mezclando dos primarios mitad y mitad (1 + 1 = 2 partes ÷ 2), con los números REALES de su carta de correctores
     (EU_COLOR_CEREBRO.calc.colores.Correctores: amarillo, rojo, azul, verde, violeta); el azul es primario y no se crea. Al lado,
     lo que neutraliza cada frío según su estrella (calc.estrella). */
  var MEZ = [['Verde', /^verde/i, [/^amarillo/i, /^azul/i], /verde/i], ['Violeta', /^violeta/i, [/^rojo/i, /^azul/i], /violeta/i], ['Naranja', /^naranja/i, [/^rojo/i, /^amarillo/i], null, 'Lo neutraliza el azul'], ['Azul', /^azul/i, null, /ceniza$/i]];
  function friosEstrella() {
    var B = window.EU_COLOR_CEREBRO, C = B && B.calc && B.calc.colores, K = C && C.Correctores, E = (B && B.calc && B.calc.estrella) || []; if (!K) return null;
    var de = function (re) { return K.filter(function (t) { return re.test(t.n || ''); })[0] || null; };
    var filas = [];
    MEZ.forEach(function (M) {
      var t = de(M[1]); if (!t) return;
      var p = M[2] ? M[2].map(de) : null; if (M[2] && (!p[0] || !p[1])) return;
      var es = M[3] ? E.filter(function (e) { return M[3].test(String(e.c || '').replace(/\s+intenso$/i, '')); })[0] : null;
      filas.push({ fam: M[0], t: t, p: p, neu: es ? es.p : (M[4] || ''), neuh: es ? es.ph : '' });
    });
    return filas.length ? { k: 'frios', keys: ['frios'], t: 'Cómo se crea cada color · con los colores primarios', filas: filas } : null;
  }
  function esquemaFrios(x, T) {
    var acc = T.acc || '#16223A', acc2 = T.acc2 || '#B08D57', soft = T.soft || '#EEF1F6', ink = T.ink || '#16223A';
    var pt = function (c) { return '<span style="display:inline-block;width:3.2mm;height:3.2mm;border-radius:50%;background:' + c + ';border:.2mm solid rgba(0,0,0,.15);vertical-align:-0.5mm;margin-right:1mm"></span>'; };
    var nom = function (t) { return esc(String(t.n).replace(/\s*[\d.]+$/, '')); };
    var td = 'padding:.8mm 1.5mm;border-bottom:.3mm solid ' + soft + ';vertical-align:middle;line-height:1.3';
    var th = 'text-align:left;padding:.6mm 1.5mm;font-size:.92em;color:' + acc + ';border-bottom:.5mm solid ' + acc2;
    var filas = x.filas.map(function (f) {
      var mezcla = f.p ? pt(f.p[0].h) + nom(f.p[0]) + ' <b>' + esc(f.p[0].c) + '</b> + ' + pt(f.p[1].h) + nom(f.p[1]) + ' <b>' + esc(f.p[1].c) + '</b>' : '<span style="opacity:.8">Es primario: no se crea, de él salen los demás</span>';
      /* 22-11-2026 (Fátima eligió «cuenta + número de la carta»): la suma y la división de los dos números, tal cual, y en «Queda» el número real del color en su carta */
      var sum = f.p ? +(+f.p[0].c + +f.p[1].c).toFixed(4) : 0, cuenta = f.p ? esc(f.p[0].c) + ' + ' + esc(f.p[1].c) + ' = ' + String(sum) + ' ÷ 2 = <b>' + String(+(sum / 2).toFixed(4)) + '</b>' : '—';
      return '<tr><td style="' + td + '"><b>' + esc(f.fam) + '</b></td><td style="' + td + '">' + mezcla + '</td><td style="' + td + '">' + cuenta + '</td>' +
        '<td style="' + td + '">' + pt(f.t.h) + '<b>' + nom(f.t) + ' ' + esc(f.t.c) + '</b></td><td style="' + td + '">' + (f.neu ? (f.neuh ? pt(f.neuh) : '') + esc(f.neu) : '') + '</td></tr>';
    }).join('');
    return '<div style="margin-top:2mm;padding:2mm 3mm;border-left:1.2mm solid ' + acc2 + ';background:#fff;border-radius:0 2mm 2mm 0;box-shadow:0 .4mm 1.6mm rgba(22,34,58,.08)">' +
      '<div style="font-weight:700;color:' + acc + ';margin:0 0 1mm;font-size:.9em">' + esc(x.t) + '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:.7em;color:' + ink + '"><thead><tr><th style="' + th + '">Color</th><th style="' + th + '">Se mezclan (primarios)</th><th style="' + th + '">Sumar y dividir</th><th style="' + th + '">Queda (número de la carta)</th><th style="' + th + '">Neutraliza</th></tr></thead><tbody>' + filas + '</tbody></table></div>';
  }
  var VISTAS = ['queda_nuca', 'queda_lateral', 'queda_frente', 'angulos'],   /* cómo queda (atrás, lado, frente) y sus ángulos: el mismo corte */ NOESC = /preparacion|cierre|aclarad|lavado/i;
  function escenasUnidad(u) {
    var out = [], CO = window.EU_CORTES, LD = window.EU_PELU_LIBRO_DG, LA = window.EU_PELU_LIBRO_ANIM;
    try {
      if (/^pe_u_c_/.test(u.id) && CO && CO.lista && LD && LD.datos) {
        CO.lista(u.id.slice(7)).forEach(function (c) {
          var dg = { k: 'corte', corte: c.id }, d = LD.datos(dg); if (!d || !d.E) return;
          VISTAS.forEach(function (t) { var e = d.E.escenas.filter(function (x) { return x.tipo === t; })[0]; if (e) out.push({ k: 'esc', g: c.id, key: 'dg|' + c.id + '|' + t, src: function () { return LD.fotoEscena(dg, t); }, t: c.n + ' · ' + String(e.t || '').replace(/^Cómo queda · [^·]+ · /, ''), d: e.texto || '' }); });
        });
      } else if (/^cb_/.test(u.id) && LA && LA.datos) {
        var tec = u.id, d2 = LA.datos(tec); if (d2 && d2.E) d2.E.escenas.forEach(function (e, i) { if (!NOESC.test(e.tipo || '')) out.push({ k: 'esc', g: tec, key: 'an|' + tec + '|' + i, src: function () { return LA.foto(tec, i, 640); }, t: e.t || '', d: e.texto || '' }); });
      }
    } catch (er) { console.warn('pelu llenar · escenas de la unidad', er); }
    return out;
  }
  /* ─────────── el bloque «En la práctica» ─────────── */
  function bloque(pg, C) {
    var L = pg.llenaPelu; if (!L || !L.its || !L.its.length) return '';
    var T = C.T || {}, acc = T.acc || '#B08D57', soft = T.soft || '#EEF0F3', ink = T.ink || '#16223A', h = L.h || 52, g = GW(), rc = RC();
    var vis = L.its.filter(function (x) { return x.k === 'img' || x.k === 'esc'; }), txt = L.its.filter(function (x) { return x.k === 'lista'; }), cts = L.its.filter(function (x) { return x.k === 'frios'; });
    var fig = function (x) {
      var src = x.k === 'img' ? (g && g.dato(x.id)) : x.src ? (x._s != null ? x._s : (x._s = x.src() || '')) : (rc && rc.maniqui ? rc.maniqui(x.p, pg.rec) : '');
      if (!src) return '';
      /* 22-11-2026 (diseño): todas las imágenes en recuadros iguales, el fondo del maniquí igual al de su escena (sin bandas),
         y el pie con el título en su línea y la explicación debajo */
      var fondo = x.k === 'img' ? 'transparent' : '#E6EAF1';   /* foto: sin fondo, la foto limpia y centrada; maniquí: el gris de su escena */
      return '<figure style="margin:0;break-inside:avoid;display:flex;flex-direction:column">' +
        '<div style="height:' + h + 'mm;background:' + fondo + ';border-radius:2mm;overflow:hidden;display:flex;align-items:center;justify-content:center">' +
        '<img src="' + src + '" alt="' + esc(x.t) + '" ' + (x.k === 'img' ? 'data-gw="' + esc(x.id) + '" ' : '') + 'style="display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain' + (x.k === 'img' ? ';border-radius:2mm' : '') + '"></div>' +
        '<figcaption style="margin-top:1.6mm;line-height:1.35"><div style="font-size:.78em;font-weight:700;color:' + ink + ';margin:0 0 .6mm">' + esc(x.t) + '</div>' +
        '<div style="font-size:.72em;opacity:.82">' + esc(x.d) + '</div></figcaption></figure>';
    };
    var html = '<div data-llena-pelu="1" style="margin-top:4mm;padding-top:2.5mm;border-top:0.5mm solid ' + acc + '">' +
      '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + acc + ';margin:0 0 2mm">En la práctica</div>';
    /* impares: la última imagen ocupa el ancho y va centrada (no queda sola a un lado) */
    if (vis.length) html += '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:4mm;row-gap:4mm;align-items:start">' + vis.map(function (x, i) { var f0 = fig(x); return (vis.length % 2) && i === vis.length - 1 ?   /* impar (también una sola): media columna centrada */ '<div style="grid-column:1 / -1;width:calc(50% - 1.5mm);justify-self:center">' + f0 + '</div>' : f0; }).join('') + '</div>';
    cts.forEach(function (x) { html += esquemaFrios(x, T); });
    txt.forEach(function (x) {
      html += '<div style="margin-top:3mm;font-size:.84em;line-height:1.45;color:' + ink + '"><div style="font-weight:700;color:' + acc + ';margin:0 0 1mm">' + esc(x.t) + '</div><ul style="margin:0;padding-left:5mm">' +
        x.its.map(function (s) { return '<li style="margin:0 0 .8mm">' + esc(s) + '</li>'; }).join('') + '</ul></div>';
    });
    return html + '</div>';
  }
  ED.registrar({ post: function (h, pg, C) { return pg && pg.llenaPelu && C && C.mat === 'pelu' ? h + bloque(pg, C) : h; } });

  /* ─────────── 1. receta sin hojas de uno o dos pasos ─────────── */
  function juntarRecetas(res, Md) {
    var P = res.pages, quitar = [];
    for (var i = 1; i < P.length; i++) {
      var b = P[i], a = P[i - 1];
      if (b.tipo !== 'pe_clase' || b.parte !== 2 || !(b.hojas > 1) || b.hoja !== b.hojas) continue;
      if (a.tipo !== 'pe_clase' || a.parte !== 2 || a.rec !== b.rec || a.hoja !== b.hoja - 1) continue;
      var a0 = { a: a.a, ult: a.ult, qs: a.qs };
      a.a = b.a; a.ult = b.ult; if (b.qs) a.qs = b.qs;
      if (Md.libre(a, res) >= SEG) {   /* margen: el medidor y la hoja real difieren unos milímetros */
        quitar.push(b);
        P.forEach(function (q) { if (q.tipo === 'pe_clase' && q.parte === 2 && q.rec === b.rec) q.hojas = b.hojas - 1; });
      } else { a.a = a0.a; a.ult = a0.ult; if (a0.qs) a.qs = a0.qs; else delete a.qs; }
    }
    return quitarPaginas(res, quitar);
  }
  /* quita hojas y renumera páginas y solucionario */
  function quitarPaginas(res, quitar) {
    if (!quitar.length) return 0;
    var mapa = {}, out = res.pages.filter(function (p) { return quitar.indexOf(p) < 0; });
    out.forEach(function (p, i) { if (p.num != null) mapa[p.num] = i + 1; });
    out.forEach(function (p, i) { if (p.num != null) p.num = i + 1; });
    out.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas = p.entradas.filter(function (e) { return mapa[e.p]; }).map(function (e) { return Object.assign({}, e, { p: mapa[e.p] }); }); });
    res.pages = out;
    return quitar.length;
  }
  /* 22-11-2026 (Fátima: «menos hojas de Regalo»): cejas y pestañas llevan una sola hoja «En el salón» por técnica; las demás
     repetían las mismas ideas */
  function regaloUnico(res) {
    var visto = {}, quitar = [];
    res.pages.forEach(function (p) { if (!/^(pe_salon|esc_lamina)$/.test(p.tipo) || !p.u || !p.u.regalo) return; var k = p.tipo + '|' + p.u.id; if (visto[k]) quitar.push(p); else visto[k] = 1; });   /* también una sola lámina por técnica de regalo */
    return quitarPaginas(res, quitar);
  }

  /* ─────────── 2 y 3. medir y llenar ─────────── */
  function usadoDe(res) {
    var u = { img: {}, esc: {}, txt: {} };
    res.pages.forEach(function (p) {
      ['foto', 'mod', 'portMod', 'gw'].forEach(function (k) { if (p[k] && /^pe_gw_/.test(String(p[k]))) u.img[p[k]] = 1; });
      var f = p.fill2 && p.fill2.fig; if (f) { var re = /pe_gw_\d+/g, m; while ((m = re.exec(String(f)))) u.img[m[0]] = 1; }
      /* vistas del maniquí que ya enseñan el diagrama y la clase de cada corte: no se repiten en «En la práctica» */
      try {
        var LD = window.EU_PELU_LIBRO_DG, rc = RC();
        if (p.tipo === 'pe_diagrama' && p.dg && p.dg.k === 'corte' && LD && LD.datos) { var d = LD.datos(p.dg); (d && d.vis || []).forEach(function (e) { u.esc['dg|' + p.dg.corte + '|' + e.tipo] = 1; }); }
        if (p.tipo === 'pe_clase' && p.parte === 1 && rc && rc.R && rc.R[p.rec] && rc.R[p.rec].k === 'corte') {
          var cid = String(rc.R[p.rec].lec || '').replace(/^__/, '');
          (rc.pasos(p.rec) || []).filter(function (x) { return x.etapa === 'queda' && x.e; }).slice(0, 2).forEach(function (x) { u.esc['dg|' + cid + '|' + x.e.tipo] = 1; });
        }
      } catch (er) { }
    });
    return u;
  }
  function llenarHoja(p, res, Md, usado, quedan) {
    /* estas hojas se completan solo con lo suyo: el relleno general (que llega después, por tandas) no les añade
       «Observa / Practica más» con dibujos de la biblioteca, que además hacían salirse las hojas del diagrama */
    if (!p.fill2) p.fill2 = { nada: 1 };
    var libre = Md.libre(p, res);
    if (libre < SEG && p.fill2 && !p.fill2.nada) { p.fill2 = { nada: 1 }; libre = Md.libre(p, res); }   /* lo opcional antes que bajar la letra */
    if (libre < SEG && p.tipo === 'pe_diagrama') {   /* el diagrama baja la altura de sus figuras antes que la letra */
      [78, 70, 62, 55, 48].some(function (mm) { p.figMax = mm; return Md.libre(p, res) >= SEG; }); libre = Md.libre(p, res);
    }
    if (libre < SEG) {   /* se sale: baja la letra hasta que cabe */
      [0.97, 0.94, 0.9, 0.86].some(function (f) { p.encaje = f; return Md.libre(p, res) >= SEG; });
      return 0;
    }
    if (libre < HUECO) return 0;
    var cand = piezas(p, usado); if (!cand.length) return 0;
    /* repartido entre las hojas de la misma unidad que aún quedan por llenar (que no se lo lleve todo la primera) */
    var tope = Math.max(1, Math.ceil(cand.length / Math.max(1, quedan || 1)));
    var L = p.llenaPelu = { its: [], h: 52 }, puestas = 0, alto = ((res.C.papel && res.C.papel.h) || 297) >= 250;
    if (!alto) L.h = 38;
    for (var i = 0; i < cand.length; i++) {
      var x = cand[i], vis = x.k !== 'lista';
      /* imágenes de dos en dos: una sola fila con hueco para dos */
      L.its.push(x);
      var ok = Md.libre(p, res) >= SEG;
      if (!ok && vis) { [44, 36, 30].some(function (hh) { if (hh >= L.h) return false; L.h = hh; ok = Md.libre(p, res) >= SEG; return ok; }); }
      if (!ok) { L.its.pop(); continue; }
      puestas++;
      if (x.k === 'img') usado.img[x.id] = 1; else if (x.k === 'esc') usado.esc[x.key] = 1; else x.keys.forEach(function (k) { usado.txt[k] = 1; });
      if (Md.libre(p, res) < HUECO || puestas >= tope) break;
    }
    if (!L.its.length) { delete p.llenaPelu; return puestas; }
    /* no quedan más piezas de la clase y aún sobra sitio: las imágenes se ven más grandes */
    if (L.its.some(function (x) { return x.k !== 'lista'; })) {
      for (var hh = L.h + 8; hh <= 110 && Md.libre(p, res) > 12; hh += 8) { var h0 = L.h; L.h = hh; if (Md.libre(p, res) < SEG) { L.h = h0; break; } }
    }
    return puestas;
  }
  function llenarLibro(res) {
    var cfg = res && res.C && res.C.cfg;
    if (!res || !res.pages || !activo(cfg) || !document.body) return res;
    var HL = window.EU_HOJAS_LLENAS; if (!HL || !HL.medidor) return res;
    var Md = HL.medidor(res.C), n = 0, juntas = 0, porClase = {};
    try {
      juntas = juntarRecetas(res, Md); var regalo = regaloUnico(res);
      var usado = usadoDe(res);
      var resta = {}, clave = function (p) { return (p.u && p.u.id) + '|' + p.tipo + '|' + (p.rec || ''); };
      res.pages.forEach(function (p) { if (TIPOS.test(p.tipo || '')) resta[clave(p)] = (resta[clave(p)] || 0) + 1; });
      res.pages.forEach(function (p) { if (!TIPOS.test(p.tipo || '')) return; var k = clave(p); n += llenarHoja(p, res, Md, usado, resta[k]); resta[k]--; });
      /* lo que la galería puso con cada clase o unidad, para el curso */
      res.pages.forEach(function (p) {
        if (!p.llenaPelu) return; var k = p.tipo === 'pe_clase' ? 'rec:' + p.rec : 'u:' + (p.u && p.u.id);
        p.llenaPelu.its.forEach(function (x) { if (x.k === 'img') (porClase[k] = porClase[k] || []).push({ id: x.id, t: x.t, d: x.d }); });
      });
    } finally { Md.fin(); }
    res._peluLlenar = { piezas: n, juntas: juntas, regalo: regalo, porClase: porClase };
    return res;
  }

  /* ─────────── curso premium: las mismas imágenes en su lección ─────────── */
  function ponerCurso(D, res) {
    var PL = res && res._peluLlenar; if (!D || !D.modulos || !PL || D._llenarPelu) return D;
    var g = GW(); D.img = D.img || {};
    var esc1 = function (x) { var src = g && g.dato(x.id); if (!src) return null; D.img[x.id] = src; return { tipo: 'idea', id: x.id, t: x.t, texto: x.t + '. ' + x.d, rot: [] }; };
    var meter = function (L, lista) {
      var ya = {}; (L.escenas || []).forEach(function (e) { if (e && e.id) ya[e.id] = 1; });
      var nuevas = lista.filter(function (x) { return !ya[x.id]; }).map(esc1).filter(Boolean); if (!nuevas.length) return;
      var k = L.escenas.length; while (k > 0 && /^A continuación · /.test(String(L.escenas[k - 1].t || ''))) k--;
      L.escenas.splice.apply(L.escenas, [k, 0].concat(nuevas));
    };
    D.modulos.forEach(function (M) {
      (M.lecciones || []).forEach(function (L) { if (L.receta && PL.porClase['rec:' + L._rk]) meter(L, PL.porClase['rec:' + L._rk]); });
      var lu = PL.porClase['u:' + M.id]; if (!lu || !M.lecciones || !M.lecciones.length) return;
      var L0 = M.lecciones.filter(function (L) { return L.receta; })[0] || M.lecciones[0]; if (L0 && L0.escenas) meter(L0, lu);
    });
    D._llenarPelu = 1;
    return D;
  }

  /* ─────────── enganches: el último de Peluquería en el libro; el curso, después de la receta ─────────── */
  function engancharLibro() {
    if (ED.__peluLlenar) return true;
    if (!ED.__peluReceta) return false;
    ED.__peluLlenar = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function () { var r = ens.apply(this, arguments); try { llenarLibro(r); } catch (e) { console.warn('pelu llenar (libro)', e); } return r; };
    return true;
  }
  (function espera(k) { if (!engancharLibro() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);
  function engancharCurso() {
    var CA = window.EU_CURSO_ANIM; if (!CA || !CA.enriquecer) return false;
    if (CA.enriquecer._llenarPelu) return true;
    if (!CA.enriquecer._receta) return false;   /* después de las lecciones «receta» (b6_pelu_receta.js) */
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, cfg = res && res.C && res.C.cfg;
        try { return activo(cfg) ? ponerCurso(R, res) : R; } catch (e) { console.warn('pelu llenar (curso)', e); return R; }
      });
    };
    CA.enriquecer._llenarPelu = 1;
    return true;
  }
  (function espera(k) { if (!engancharCurso() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  window.EU_PELU_LLENAR = { llenarLibro: llenarLibro, ponerCurso: ponerCurso, bloque: bloque };
})();
