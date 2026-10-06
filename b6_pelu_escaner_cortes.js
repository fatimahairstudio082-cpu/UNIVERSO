/* b6_pelu_escaner_cortes.js — «🔎 Escáner de cortes» en 💇 Guías 3D (window.EU_ESCANER_CORTES).
   Dice qué cortes HAY en el sistema y cuáles FALTAN, para construir los que faltan con su técnica y su animación:
   · HAY: los cortes del catálogo (EU_CORTES) con su numeración de elevaciones atrás/delante y su técnica, los cortes
     guardados de Fátima (EU_GEOMETRIA_CAPILAR.mios) y sus técnicas. «▶ Ver» lo anima en el maniquí; «✏️ Otra
     numeración» abre «Crear mi corte» con sus cifras como punto de partida: la numeración no es fija, un mismo
     corte se puede hacer con otra técnica.
   · FALTA: (a) los nombres de la lista de Fátima (uno por línea; localStorage `eu_cortes_lista`, clave nueva) que no
     estén en el sistema; (b) sugerencias: nombres habituales que no están en el catálogo (solo nombres, «a validar»).
     «✏️ Construir» abre «Crear mi corte» con el nombre puesto y las capas vacías: la numeración la escribe Fátima.
     Al guardarlo pasa a HAY y entra solo en el libro y en el curso.
   No pone ninguna elevación por su cuenta. Lo abre el botón que añade b6_guias_3d_diagrama.js. */
(function () {
  'use strict';
  if (window.EU_ESCANER_CORTES) return;

  /* nombres habituales (solo nombres: la técnica y las cifras las pone Fátima) */
  var HABITUALES = ['Mullet', 'Hime cut', 'Octopus cut', 'Jellyfish cut', 'Undercut', 'Pompadour', 'Quiff', 'Crew cut', 'Taper',
    'Bowl cut · tazón', 'Bob graduado', 'Bob invertido', 'Bob en capas', 'Lob en capas', 'Feathered · plumas', 'Corte en V', 'Corte en U',
    'Rachel', 'Shag corto', 'Pixie largo', 'Melena recta con capas en el rostro', 'Flequillo lateral', 'Flequillo micro', 'Degradado con raya',
    'French crop', 'Caesar', 'Buzz fade', 'Afro con degradado', 'Rizos definidos en capas', 'Corte asimétrico largo'];
  /* alias para comparar nombres (todo en minúsculas y sin tildes) */
  var ALIAS = [['long bob', 'lob'], ['curtain bangs', 'flequillo cortina'], ['tazon', 'bowl cut'], ['plumas', 'feathered'], ['wolf cut', 'wolf'], ['butterfly cut', 'butterfly', 'mariposa'], ['shag cut', 'shag']];
  var CLAVE = 'eu_cortes_lista';

  function norm(s) {
    s = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\bcortes?\b|\bde\b|\bdel\b|\bla\b|\bel\b|\ben\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
    ALIAS.forEach(function (g) { g.forEach(function (a) { if (s === a) s = g[0]; }); });
    return s;
  }
  function esta(nombre, lista) {
    var n = norm(nombre); if (!n) return null;
    for (var i = 0; i < lista.length; i++) { var m = norm(lista[i].n); if (m === n || (n.length > 3 && m.indexOf(n) >= 0)) return lista[i]; }
    return null;
  }
  function leerLista() { try { return String(localStorage.getItem(CLAVE) || '').split(/\n+/).map(function (x) { return x.trim(); }).filter(Boolean); } catch (e) { return []; } }
  function guardarLista(t) { try { localStorage.setItem(CLAVE, String(t || '')); } catch (e) { } }

  /* todo lo que hay en el sistema */
  function inventario() {
    var CO = window.EU_CORTES, GC = window.EU_GEOMETRIA_CAPILAR, hay = [];
    var fams = {}; ((CO && CO.familias && CO.familias()) || []).forEach(function (f) { fams[f.id] = f.n; });
    ((CO && CO.lista()) || []).forEach(function (c) {
      var t = CO.tecnica(c.id) || {};
      hay.push({ k: 'catalogo', id: c.id, n: c.n, fam: fams[c.fam] || c.fam, atras: t.elev || [], delante: t.elevF || [], tec: [t.tipo, t.dir, t.her].filter(Boolean).join(' · '), cab: (c.mejor || [])[0] || '' });
    });
    ((GC && GC.mios()) || []).forEach(function (o) { hay.push({ k: 'mio', n: o.n, fam: 'Mis cortes', atras: o.capas || [], delante: (o.frente && o.frente.length ? o.frente : o.capas) || [], tec: [o.part, o.acabado].filter(Boolean).join(' · '), o: o }); });
    ((GC && GC.TECNICAS) || []).forEach(function (t) { hay.push({ k: 'tecnica', n: t.n, fam: t.validar ? 'Técnica · a validar por Fátima' : 'Técnica', atras: t.capas, delante: t.frente || t.capas, tec: t.texto, o: t }); });
    return hay;
  }
  function escanear(lista) {
    var hay = inventario(), suyos = (lista || leerLista()).map(function (n) { var x = esta(n, hay); return { n: n, hay: x }; });
    var sug = HABITUALES.filter(function (n) { return !esta(n, hay) && !suyos.some(function (s) { return norm(s.n) === norm(n); }); });
    return { hay: hay, lista: suyos, faltan: suyos.filter(function (s) { return !s.hay; }), sugerencias: sug };
  }

  /* ─── ventana ─── */
  var EST = { b: 'background:#7c3aed;color:#fff;border:0;border-radius:8px;padding:5px 10px;font:600 12px system-ui,sans-serif;cursor:pointer;white-space:nowrap',
    b2: 'background:#24244a;color:#e2e8f0;border:1px solid #3b3b5c;border-radius:8px;padding:5px 10px;font:600 12px system-ui,sans-serif;cursor:pointer;white-space:nowrap' };
  function h(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }
  function grados(a) { return (a || []).map(function (g) { return g + '°'; }).join(' · ') || '—'; }

  function abrir(el) {
    var fondo = h('div', 'position:fixed;inset:0;z-index:99999;background:rgba(8,8,20,.82);display:flex;align-items:center;justify-content:center;padding:14px;box-sizing:border-box');
    var caja = h('div', 'background:#15152b;color:#e2e8f0;border:1px solid #3b3b5c;border-radius:14px;max-width:980px;width:100%;max-height:100%;overflow:auto;padding:16px 20px;font:13px/1.45 system-ui,sans-serif');
    fondo.appendChild(caja); document.body.appendChild(fondo);
    function cerrar() { fondo.remove(); document.removeEventListener('keydown', tecla); }
    function tecla(e) { if (e.key === 'Escape') cerrar(); }
    document.addEventListener('keydown', tecla);
    fondo.addEventListener('click', function (e) { if (e.target === fondo) cerrar(); });

    function ver(it) {
      cerrar();
      var CO = window.EU_CORTES;
      if (it.k === 'catalogo' && el.cargarGuia && CO) { try { el.cargarGuia(CO.guiaDe(it.id, it.cab)); } catch (e) { console.warn('Escáner de cortes', e); } el._dg = { on: true, modo: 'todo', t0: 0, libre: null }; }
      else el._dg = { on: true, modo: 'todo', t0: 0, libre: Object.assign({}, it.o, { n: it.n }) };
      if (el._dgCrear) el._dgCrear.sincro();
    }
    function construir(o) { cerrar(); if (el._dgCrear) el._dgCrear.abrir(o); }

    function pintar() {
      caja.innerHTML = '';
      var R = escanear(), cat = R.hay.filter(function (x) { return x.k === 'catalogo'; }).length, mios = R.hay.filter(function (x) { return x.k === 'mio'; }).length;
      var cab = h('div', 'display:flex;align-items:center;gap:10px;margin-bottom:10px'); cab.appendChild(h('b', 'font-size:17px;flex:1', '🔎 Escáner de cortes'));
      var x = h('button', EST.b, '✕ Cerrar'); x.onclick = cerrar; cab.appendChild(x); caja.appendChild(cab);
      var res = h('div', 'display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:12px');
      [['Cortes del catálogo', cat], ['Mis cortes', mios], ['Técnicas', R.hay.length - cat - mios], ['Faltan de mi lista', R.faltan.length + ' de ' + R.lista.length], ['Sugerencias', R.sugerencias.length]].forEach(function (k) {
        var t = h('div', 'background:#1e1e3c;border-radius:10px;padding:8px 10px'); t.appendChild(h('div', 'font-size:11px;color:#a5a5c8', k[0])); t.appendChild(h('b', 'font-size:18px', String(k[1]))); res.appendChild(t);
      });
      caja.appendChild(res);

      /* mi lista */
      caja.appendChild(h('b', 'display:block;margin:6px 0 4px', 'Mi lista de cortes (uno por línea): el escáner marca los que faltan'));
      var ta = h('textarea', 'width:100%;box-sizing:border-box;min-height:70px;background:#0f0f22;color:#e2e8f0;border:1px solid #3b3b5c;border-radius:8px;padding:8px;font:13px system-ui,sans-serif');
      ta.value = leerLista().join('\n'); ta.placeholder = 'Mullet\nBob recto\nCorte en capas definidas…';
      var gl = h('button', EST.b2 + ';margin:6px 0 12px', '🔎 Escanear mi lista'); gl.onclick = function () { guardarLista(ta.value); pintar(); };
      caja.appendChild(ta); caja.appendChild(gl);

      /* FALTA */
      var nueva = function (n, sugerencia) { return { n: n, capas: [], frente: [], part: 'vertical', altura: 'nariz', linea: '', acabado: 'recto', texto: (sugerencia ? 'Sugerencia (a validar por Fátima). ' : '') + 'Escribe la elevación de cada capa, de la nuca hacia arriba, y pulsa «▶ Ver mi corte».' }; };
      var bloque = function (titulo, filas) { if (!filas.length) return; caja.appendChild(h('b', 'display:block;margin:10px 0 4px;color:#fbbf24', titulo)); var g = h('div', 'display:grid;gap:4px'); filas.forEach(function (f) { g.appendChild(f); }); caja.appendChild(g); };
      var filaFalta = function (n, sug) { var f = h('div', 'display:flex;gap:8px;align-items:center;background:#1e1e3c;border-radius:8px;padding:6px 10px'); f.appendChild(h('span', 'flex:1', n + (sug ? '  · sugerencia, a validar' : ''))); var b = h('button', EST.b, '✏️ Construir'); b.onclick = function () { construir(nueva(n, sug)); }; f.appendChild(b); return f; };
      bloque('FALTA · de mi lista (' + R.faltan.length + ')', R.faltan.map(function (s) { return filaFalta(s.n, false); }));
      if (R.lista.length && !R.faltan.length) caja.appendChild(h('div', 'margin:6px 0;color:#86efac', 'Todos los cortes de tu lista están en el sistema.'));
      bloque('Sugerencias · nombres habituales que no están en el catálogo (' + R.sugerencias.length + ')', R.sugerencias.map(function (n) { return filaFalta(n, true); }));

      /* HAY */
      var filaHay = function (it) {
        var f = h('div', 'display:grid;grid-template-columns:minmax(150px,1.3fr) minmax(0,2fr) auto;gap:8px;align-items:center;background:#1e1e3c;border-radius:8px;padding:6px 10px');
        var a = h('div'); a.appendChild(h('b', '', it.n)); a.appendChild(h('div', 'font-size:11px;color:#a5a5c8', it.fam + (it.tec ? ' · ' + String(it.tec).slice(0, 70) : ''))); f.appendChild(a);
        var g = h('div', 'font-size:11.5px'); g.appendChild(h('div', '', 'Atrás: ' + grados(it.atras))); if (String(it.delante) !== String(it.atras)) g.appendChild(h('div', '', 'Delante: ' + grados(it.delante))); f.appendChild(g);
        var bs = h('div', 'display:flex;gap:4px'), v = h('button', EST.b, '▶ Ver'), o = h('button', EST.b2, '✏️ Otra numeración');
        v.onclick = function () { ver(it); };
        o.onclick = function () { construir({ n: it.n + ' · otra versión', capas: (it.atras || []).slice(), frente: (it.delante || []).slice(), part: (it.o && it.o.part) || 'vertical', altura: (it.o && it.o.altura) || 'nariz', linea: (it.o && it.o.linea) || '', acabado: (it.o && it.o.acabado) || 'recto', texto: 'Numeración de «' + it.n + '» como punto de partida: cambia las cifras y guárdala como otra versión.' }); };
        bs.appendChild(v); bs.appendChild(o); f.appendChild(bs); return f;
      };
      bloque('HAY · en el sistema (' + R.hay.length + ')', R.hay.map(filaHay));
    }
    pintar();
  }

  window.EU_ESCANER_CORTES = { abrir: abrir, escanear: escanear, inventario: inventario, HABITUALES: HABITUALES, norm: norm };
})();
