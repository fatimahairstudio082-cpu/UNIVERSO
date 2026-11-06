/* b6_boton_biblioteca.js — «📚 A la biblioteca»: lo que creas en Guías 3D, Estudios o Míos pasa a la biblioteca de Peluquería.
   · Guías 3D: botón junto a «📥 Importar» y «📚» en cada guía guardada (parchea <guias-3d>, sin tocar b6_guias_3d.js).
   · Estudios: botón junto a «⬇ PDF» (técnica elegida, con la foto y la ficha que tenga puestas).
   · Míos: «📚» en las tarjetas de Guía 3D y de Examen (la técnica del examen) → EU_BIBLIO.desdeMios(p).
   Al pulsar: eliges nombre y familia; se guardan los fotogramas (JPEG 640 px) en localStorage `eu_pelu_biblio`.
   Cada envío se registra en EU_MODELOS ('pelu') como pe_g3d_mio<n>_<k> (guías) o pe_est_mio<n>_<k> (técnicas):
   sale en la Galería, en el libro (página pe_guia3d con esquema numerado, pasos, voz y test; o pe_mitec para técnicas)
   y en el curso premium (una lección en vídeo por envío, vía u.mods).
   Se carga en <helmet> y al final de LIBS en la Galería; espera a EU_MODELOS / EU_PELU_GUIAS / EU_EDITORIAL. */
(function () {
  'use strict';
  if (window.EU_BIBLIO) return;
  var CLAVE = 'eu_pelu_biblio';
  var FAM_BASE = { g3d: 'Cortes paso a paso (Guías 3D)', est: 'Técnicas animadas (Estudios)', mios: 'Mis dibujos' };
  var PART = { horizontal: 'horizontal', vertical: 'vertical', diagAtras: 'diagonal hacia atrás', diagAdelante: 'diagonal hacia delante', radial: 'radial', pivotante: 'pivotante' };
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function txt(s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function mx(a) { return Array.isArray(a) && a.length ? Math.max.apply(null, a) : 0; }
  function leer() { try { return JSON.parse(localStorage.getItem(CLAVE) || '[]'); } catch (e) { return []; } }
  function escribir(l) { localStorage.setItem(CLAVE, JSON.stringify(l)); }
  function porId(id) { return leer().filter(function (x) { return x.id === id; })[0] || null; }

  /* ─── fotogramas: se reducen a 640 px para que quepan en el dispositivo ─── */
  function reducir(url) {
    return new Promise(function (ok) {
      if (!url) return ok('');
      var im = new Image();
      im.onload = function () {
        var k = Math.min(1, 640 / im.width), c = document.createElement('canvas');
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0, c.width, c.height);
        ok(c.toDataURL('image/jpeg', 0.78));
      };
      im.onerror = function () { ok(''); };
      im.src = url;
    });
  }
  function cargarScript(src, tag) {
    return new Promise(function (ok) {
      if (window.customElements.get(tag)) return ok();
      var s = document.createElement('script'); s.src = src; s.onload = s.onerror = function () { window.customElements.whenDefined(tag).then(ok); setTimeout(ok, 4000); };
      document.head.appendChild(s);
    });
  }
  function oculto(tag) {
    var e = document.createElement(tag); e.setAttribute('aria-hidden', 'true');
    e.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;pointer-events:none;opacity:0';
    document.body.appendChild(e); return e;
  }

  /* Guías 3D: un fotograma por paso (mismo camino que el PDF de la guía) */
  function framesGuia(el) {
    var iG = el.iSel, camG = el.cam, out = [];
    try { el.guia.pasos.forEach(function (p, k) { out.push(el.laminaURL(k, 'image/jpeg', 0.9)); }); }
    finally { try { el.iSel = iG; if (camG !== undefined) el.cam = camG; if (el.aplicarPaso) el.aplicarPaso(); } catch (e) { } }
    return Promise.all(out.map(reducir));
  }
  function framesGuiaDatos(g) {
    return cargarScript('./b6_guias_3d.js', 'guias-3d').then(function () {
      var e = oculto('guias-3d');
      return new Promise(function (ok) {
        setTimeout(function () {
          var r;
          try { e.cargarGuia(g); r = framesGuia(e); } catch (er) { console.warn('Biblioteca · guía', er); r = Promise.resolve([]); }
          r.then(function (f) { try { e.remove(); } catch (x) { } ok(f); });
        }, 60);
      });
    });
  }
  /* Estudios: un fotograma por frase de la narración del Cerebro */
  function framesTec(el, tec) {
    var CB = window.EU_CEREBRO; if (!CB || !tec) return Promise.resolve({ narr: [], fr: [] });
    var narr = (CB.narracion(tec) || []).map(function (s) { return String(s).trim(); }).filter(Boolean);
    var t0 = el.t, out = [];
    if (el._raf) cancelAnimationFrame(el._raf);
    try { narr.forEach(function (fr, k) { el.t = (k + 1) / narr.length; el.pintar(); out.push(el.cv.toDataURL('image/jpeg', 0.9)); }); }
    finally { el.t = t0; try { el.pintar(); if (el.animar && el.tocando) el.animar(); } catch (e) { } }
    return Promise.all(out.map(reducir)).then(function (fr) { return { narr: narr, fr: fr }; });
  }
  function framesTecDatos(tec) {
    var CB = window.EU_CEREBRO;
    return cargarScript('./b6_estudios.js', 'estudios-belleza').then(function () {
      var e = oculto('estudios-belleza');
      return new Promise(function (ok) {
        setTimeout(function () {
          var r;
          try {
            var T = CB.obtener(tec), f = (CB.familias().filter(function (z) { return z.id === T.fam; })[0]) || {};
            e.fam = T.fam; e.disc = f.lienzo || 'color'; e.tecId = tec; e.vista = 'maniqui'; e.sincronizar();
            r = framesTec(e, tec);
          } catch (er) { console.warn('Biblioteca · técnica', er); r = Promise.resolve({ narr: [], fr: [] }); }
          r.then(function (x) { try { if (e._raf) cancelAnimationFrame(e._raf); e.remove(); } catch (y) { } ok(x); });
        }, 60);
      });
    });
  }

  /* ─── diálogo: nombre y familia ─── */
  function familias() {
    var o = {}, MO = window.EU_MODELOS;
    Object.keys(FAM_BASE).forEach(function (k) { o[k] = FAM_BASE[k]; });
    if (MO && MO.familias) MO.familias('pelu').forEach(function (f) { o[f.id] = f.n; });
    leer().forEach(function (x) { if (x.fam && !o[x.fam]) o[x.fam] = x.famN || x.fam; });
    return o;
  }
  function aviso(msg) {
    var d = document.createElement('div');
    d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:100000;background:#13132a;color:#e8e8f5;border:1px solid #a855f7;border-radius:10px;padding:10px 16px;font:500 13px/1.45 system-ui,sans-serif;max-width:min(92vw,520px);box-shadow:0 10px 30px rgba(0,0,0,.4)';
    d.textContent = msg; document.body.appendChild(d); setTimeout(function () { d.remove(); }, 4200);
  }
  function dialogo(def) {
    return new Promise(function (ok) {
      var F = familias(), fondo = document.createElement('div');
      fondo.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,8,20,.6);display:flex;align-items:center;justify-content:center;padding:16px';
      var inp = 'width:100%;box-sizing:border-box;background:#0f0f22;border:1px solid #2d2d4a;color:#e8e8f5;border-radius:8px;padding:8px 10px;font:inherit;font-size:13px';
      var opts = Object.keys(F).map(function (k) { return '<option value="' + es(k) + '"' + (k === def.fam ? ' selected' : '') + '>' + es(F[k]) + '</option>'; }).join('') + '<option value="__nueva">➕ Nueva familia…</option>';
      fondo.innerHTML = '<div style="background:#18183a;border:1px solid #2d2d4a;border-radius:14px;padding:18px 20px;width:min(100%,420px);color:#e8e8f5;font:13px/1.5 system-ui,sans-serif;display:grid;gap:12px">' +
        '<div style="font-size:15px;font-weight:700;color:#c4b5fd">📚 A la biblioteca de Peluquería</div>' +
        '<div style="font-size:12px;color:#94a3b8">' + es(def.desc) + '</div>' +
        '<label style="display:grid;gap:4px"><span style="font-size:11px;color:#94a3b8;font-weight:600">Nombre</span><input data-b="n" style="' + inp + '" value="' + es(def.n) + '"></label>' +
        '<label style="display:grid;gap:4px"><span style="font-size:11px;color:#94a3b8;font-weight:600">Familia</span><select data-b="f" style="' + inp + '">' + opts + '</select></label>' +
        '<label data-b="nfw" style="display:none;gap:4px"><span style="font-size:11px;color:#94a3b8;font-weight:600">Nombre de la familia nueva</span><input data-b="nf" style="' + inp + '" placeholder="Por ejemplo: Mis cortes de autor"></label>' +
        '<div style="font-size:11.5px;color:#94a3b8">Sale en la Galería, en el libro (esquema, pasos, voz y test) y en el curso premium.</div>' +
        '<div style="display:flex;gap:8px;justify-content:flex-end"><button data-b="no" style="background:transparent;border:1px solid #2d2d4a;color:#94a3b8;border-radius:8px;padding:8px 14px;font:inherit;cursor:pointer">Cancelar</button>' +
        '<button data-b="si" style="background:linear-gradient(135deg,#7c3aed,#a855f7);border:0;color:#fff;border-radius:8px;padding:8px 16px;font:inherit;font-weight:600;cursor:pointer">Enviar</button></div></div>';
      document.body.appendChild(fondo);
      var q = function (k) { return fondo.querySelector('[data-b="' + k + '"]'); };
      q('f').onchange = function () { q('nfw').style.display = q('f').value === '__nueva' ? 'grid' : 'none'; };
      var fin = function (v) { fondo.remove(); ok(v); };
      q('no').onclick = function () { fin(null); };
      fondo.onclick = function (ev) { if (ev.target === fondo) fin(null); };
      q('si').onclick = function () {
        var n = q('n').value.trim() || def.n, f = q('f').value, fn = F[f] || f;
        if (f === '__nueva') { fn = q('nf').value.trim(); if (!fn) { q('nf').focus(); return; } f = 'mio_' + fn.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '_').replace(/^_|_$/g, '').slice(0, 24); }
        fin({ n: n, fam: f, famN: fn });
      };
      setTimeout(function () { q('n').select(); }, 30);
    });
  }

  /* ─── guardar y registrar ─── */
  function enviar(item) {
    var l = leer().filter(function (x) { return !(x.tipo === item.tipo && x.n === item.n); });
    l.unshift(item);
    try { escribir(l); } catch (e) { aviso('No hay sitio en este dispositivo para más dibujos. Quita alguno de la biblioteca.'); return false; }
    registrar([item]);
    aviso('«' + item.n + '» está en la biblioteca: ' + item.fr.length + ' dibujos en «' + (item.famN || item.fam) + '». Sale en la Galería, el libro y el curso.');
    return true;
  }
  function nuevoId() { return 'mio' + Date.now().toString(36); }
  function limpiaGuia(g) {
    var n = JSON.parse(JSON.stringify(g)); (n.pasos || []).forEach(function (p) { delete p.medio; }); delete n.foto; return n;
  }
  function desdeGuiaDatos(g, nombre, frames) {
    if (!g || !g.pasos || !g.pasos.length) return aviso('Esa guía no tiene pasos.');
    return dialogo({ n: nombre || g.nombre || 'Mi corte', fam: 'g3d', desc: 'Guía 3D de ' + g.pasos.length + ' pasos: un dibujo por paso.' }).then(function (r) {
      if (!r) return;
      aviso('Preparando los ' + g.pasos.length + ' dibujos…');
      return (frames ? frames() : framesGuiaDatos(g)).then(function (fr) {
        if (!fr.length || !fr.some(Boolean)) return aviso('No se han podido dibujar los pasos.');
        enviar({ id: nuevoId(), tipo: 'g3d', n: r.n, fam: r.fam, famN: r.famN, fecha: new Date().toLocaleDateString('es-ES'), guia: limpiaGuia(g), fr: fr });
      });
    });
  }
  function desdeTec(tec, el) {
    var CB = window.EU_CEREBRO, T = CB && tec && CB.obtener(tec);
    if (!T) return aviso('Elige primero una técnica.');
    var nn = (CB.narracion(tec) || []).filter(Boolean).length;
    if (!nn) return aviso('Esta técnica no tiene pasos narrados.');
    return dialogo({ n: T.n, fam: 'est', desc: T.n + ': ' + nn + ' pasos, un dibujo por frase de la explicación.' }).then(function (r) {
      if (!r) return;
      return (el ? framesTec(el, tec) : framesTecDatos(tec)).then(function (x) {
        if (!x.fr.length || !x.fr.some(Boolean)) return aviso('No se han podido dibujar los pasos.');
        enviar({ id: nuevoId(), tipo: 'est', n: r.n, fam: r.fam, famN: r.famN, fecha: new Date().toLocaleDateString('es-ES'), tec: tec, resumen: T.resumen || '', narr: x.narr, fr: x.fr });
      });
    });
  }

  /* ─── modelos ─── */
  var REG = {};
  function modelos(it) {
    var L = [], cid = it.id;
    if (it.tipo === 'g3d') {
      var g = it.guia, n = g.pasos.length;
      g.pasos.forEach(function (p, k) {
        var el = mx(p.elevB), pt = PART[p.particionB] || p.particionB || 'horizontal', tit = txt(p.titulo).replace(/^\s*\d+\s*·\s*/, ''), src = it.fr[k] || '';
        L.push({
          id: 'pe_g3d_' + cid + '_' + k, fam: it.fam, corte: cid, paso: k, titulo: tit, part: pt, elev: el, vigila: p.observaciones || '', grupoN: it.n, grupoD: g.tecnica || '', mio: cid,
          n: it.n + ' · paso ' + (k + 1) + ' de ' + n + (tit ? ': ' + tit : ''),
          raster: function () { return src; },
          d: function (K) {
            if (!src) return K.r(4, 4, 192, 142, 6, '#F2EEE7') + K.t(100, 75, it.n, { s: 8, b: 1 });
            var f = K.linea ? ' filter="url(#peMioGris)"' : '';
            return (K.linea ? '<filter id="peMioGris"><feColorMatrix type="saturate" values="0"/></filter>' : '') + K.r(4, 4, 192, 142, 6, '#F2EEE7') + '<image href="' + src + '" x="4" y="21" width="192" height="108"' + f + ' preserveAspectRatio="xMidYMid meet"/>';
          },
          intro: txt(p.texto) || (it.n + ': paso ' + (k + 1) + '.'),
          q: [['¿Qué partición se usa en este paso?', 'Partición ' + pt + '.'], ['¿A qué elevación se lleva el mechón?', el ? 'Hasta ' + el + '° en la zona más alta.' : 'Sin elevación: 0°.'], ['¿Qué hay que vigilar?', p.observaciones || 'Comparar cada mechón con la guía antes de cortar.']],
          porque: el >= 90 ? 'Al elevar el mechón, el pelo de arriba queda más corto: se crean capas y ligereza.' : el > 0 ? 'Una elevación media reparte el peso y da volumen.' : 'Sin elevación las puntas caen a la misma línea y el peso queda en el borde.'
        });
      });
    } else {
      it.narr.forEach(function (fr, k) {
        var src = it.fr[k] || '';
        L.push({
          id: 'pe_est_' + cid + '_' + k, fam: it.fam, grupo: cid, grupoN: it.n, grupoD: it.resumen || '', paso: k, narr: fr, mio: cid,
          n: it.n + ' · paso ' + (k + 1) + ' de ' + it.narr.length,
          raster: function () { return src; },
          d: function (K) {
            if (!src) return K.r(4, 4, 192, 142, 6, '#1A1A2E') + K.t(100, 75, it.n, { s: 8, b: 1, c: '#fff' });
            var f = K.linea ? ' filter="url(#peMioGris2)"' : '';
            return (K.linea ? '<filter id="peMioGris2"><feColorMatrix type="saturate" values="0"/></filter>' : '') + '<image href="' + src + '" x="4" y="21" width="192" height="108"' + f + ' preserveAspectRatio="xMidYMid meet"/>';
          },
          intro: fr,
          q: [['¿Qué se hace en este paso?', fr], ['¿En qué técnica estamos?', it.n + '.'], ['¿Qué paso viene después?', it.narr[k + 1] || 'Se termina y se revisa el resultado.']],
          porque: it.resumen || ''
        });
      });
    }
    return L;
  }
  function registrar(lista) {
    var MO = window.EU_MODELOS; if (!MO) return;
    lista.forEach(function (it) {
      if (REG[it.id]) return; REG[it.id] = 1;
      var fm = {}; fm[it.fam] = it.famN || FAM_BASE[it.fam] || it.fam;
      MO.agregar('pelu', modelos(it), { familias: fm });
    });
  }

  /* ─── Guías 3D del libro: un «corte» mio<n> que entiende EU_CORTES y EU_PELU_GUIAS ─── */
  function esMio(id) { return /^mio[0-9a-z]+$/.test(String(id || '')); }
  function parcheCortes(CO) {
    if (CO.__mios) return; CO.__mios = 1;
    var get = CO.get, guiaDe = CO.guiaDe, tecnica = CO.tecnica, reglaDe = CO.reglaDe;
    CO.get = function (id) { if (esMio(id)) { var it = porId(id); return it ? { id: id, n: it.n, d: it.guia.tecnica || '', mejor: [] } : null; } return get.apply(this, arguments); };
    CO.guiaDe = function (id) { if (esMio(id)) { var it = porId(id); return it ? Object.assign({ encaja: true }, it.guia) : null; } return guiaDe.apply(this, arguments); };
    CO.tecnica = function (id) {
      if (!esMio(id)) return tecnica.apply(this, arguments);
      var it = porId(id), ps = it ? it.guia.pasos : [], p0 = ps[0] || {}, fin = (ps[ps.length - 1] || {}).elevB || [];
      return { tipo: p0.tipoCorte || p0.tecnica || 'Corte propio', dir: p0.direccion || 'natural', her: p0.herramienta || 'Tijera', acabado: (ps[ps.length - 1] || {}).resultado || 'Según la guía', resultado: (it && it.guia.tecnica) || '', notas: ps.map(function (p) { return txt(p.observaciones); }).filter(Boolean), elev: fin };
    };
    CO.reglaDe = function (cab) { var r = null; try { r = reglaDe.apply(this, arguments); } catch (e) { } return r || { n: 'cualquier tipo', part: 'horizontal' }; };
  }
  function parcheGuias(PG) {
    if (PG.__mios) return; PG.__mios = 1;
    var render = PG.render;
    PG.render = function (id, cab, k) { if (esMio(id)) { var it = porId(id); return (it && it.fr[k]) || ''; } return render.apply(this, arguments); };
  }

  /* ─── página de técnica propia (pe_mitec): fotogramas numerados, voz y test ─── */
  var SCRIPT = '<script>(function(){if(window.__estLibro)return;window.__estLibro=1;var act=null;' +
    'function voz(){if(!window.speechSynthesis)return null;var v=speechSynthesis.getVoices().filter(function(x){return/^es/i.test(x.lang)});return v.filter(function(x){return/google/i.test(x.name)&&/es-ES/i.test(x.lang)})[0]||v.filter(function(x){return/es-ES/i.test(x.lang)})[0]||v[0]||null}' +
    'function para(){if(window.speechSynthesis)speechSynthesis.cancel();if(act){act.b.textContent="▶ Ver y escuchar";act.box.querySelectorAll("[data-est-k]").forEach(function(c){c.style.opacity="1";c.style.outline="none"})}act=null}' +
    'document.addEventListener("click",function(ev){var b=ev.target.closest("[data-est-play]");if(!b)return;var box=b.closest("[data-est]");if(act&&act.box===box)return para();para();' +
    'var V=voz(),fr=[].slice.call(box.querySelectorAll("[data-est-k]")),big=box.querySelector("[data-est-big]"),sub=box.querySelector("[data-est-sub]"),j=0;act={box:box,b:b};b.textContent="❚❚ Parar";' +
    '(function sig(){if(!act||act.box!==box)return;if(j>=fr.length){para();return}var c=fr[j++],im=c.querySelector("img"),t=c.dataset.estT;' +
    'fr.forEach(function(x){x.style.opacity=x===c?"1":".4";x.style.outline=x===c?"0.7mm solid "+box.dataset.acc:"none"});if(im&&big){big.style.opacity="0";setTimeout(function(){big.src=im.src;big.style.opacity="1"},180)}if(sub)sub.textContent=t;' +
    'if(!V){setTimeout(sig,Math.max(2000,t.length*70));return}var u=new SpeechSynthesisUtterance(t);u.voice=V;u.lang="es-ES";u.onend=u.onerror=function(){setTimeout(sig,250)};speechSynthesis.speak(u)})()})})();<\/script>';
  function paginaTec(pg, C, modo) {
    var ED = window.EU_EDITORIAL, H = ED.H, T = C.T, it = porId(pg.mio);
    if (!it) return H.cabecera(C, pg) + H.folio(C, pg);
    var web = modo === 'web', rad = Math.min(T.r || 4, 6), n = it.narr.length, max = Math.min(n, 6), sel = [];
    for (var i = 0; i < max; i++) sel.push(Math.round(i * (n - 1) / Math.max(1, max - 1)));
    var cuad = sel.map(function (k, j) {
      var src = it.fr[k];
      return '<div data-est-k="' + j + '" data-est-t="' + es(it.narr[k]) + '" style="display:grid;grid-template-columns:30mm minmax(0,1fr);gap:2.5mm;align-items:center;border-radius:' + rad + 'px;padding:1mm;transition:opacity .3s">' +
        (src ? '<div style="aspect-ratio:4/3;overflow:hidden;border-radius:' + rad + 'px;position:relative;background:#F2EAD9"><img src="' + src + '" alt="Paso ' + (k + 1) + '" style="position:absolute;width:250%;max-width:none;left:-82%;top:-38%;display:block"></div>' : '<div></div>') +
        '<div style="font-size:.78em;line-height:1.35;min-width:0;overflow-wrap:anywhere"><b style="display:inline-flex;width:5mm;height:5mm;border-radius:50%;background:' + T.acc + ';color:#fff;align-items:center;justify-content:center;font-size:.85em;margin-right:1.5mm">' + (k + 1) + '</b>' + es(it.narr[k]) + '</div></div>';
    }).join('');
    var ko = Math.min(1, n - 1), ops = [it.narr[ko], it.narr[n - 1], it.narr[0]].filter(function (x, i, a) { return a.indexOf(x) === i; }).map(function (s) { return s.length > 90 ? s.slice(0, 88) + '…' : s; });
    var Q = [{ e: '¿Qué se hace en el paso ' + (ko + 1) + '?', o: ops, c: 0 }, { e: '¿Cuántos pasos tiene la técnica?', o: [n, n + 2, Math.max(2, n - 2)].map(String), c: 0 }];
    Q.forEach(function (q, i) { var g = (i + 1) % q.o.length, o = q.o.slice(g).concat(q.o.slice(0, g)); q.c = o.indexOf(q.o[0]); q.o = o; });
    var test = '<div style="margin-top:3mm;font-size:.76em"><b style="font-family:' + T.tit + ';color:' + T.acc + '">Compruébalo</b><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3mm;margin-top:1mm">' + Q.map(function (q, i) {
      return '<div style="min-width:0"><div>' + (i + 1) + '. ' + es(q.e) + '</div><div style="opacity:.85;margin-top:.8mm;overflow-wrap:anywhere">' + q.o.map(function (o, j) { return String.fromCharCode(97 + j) + ') ' + es(o); }).join('<br>') + '</div>' +
        (web ? '<details style="margin-top:1mm"><summary style="cursor:pointer;color:' + T.acc + '">Ver respuesta</summary>' + String.fromCharCode(97 + q.c) + ') ' + es(q.o[q.c]) + '</details>' : '') + '</div>';
    }).join('') + '</div>' + (web ? '' : '<div style="font-size:.85em;opacity:.7;margin-top:1.5mm">Soluciones: ' + Q.map(function (q, i) { return (i + 1) + String.fromCharCode(97 + q.c); }).join(' · ') + '</div>') + '</div>';
    var ctrl = web ? '<div style="display:flex;gap:3mm;align-items:center;margin:0 0 2.5mm"><button data-est-play="1" style="font:inherit;font-size:.86em;padding:1.5mm 4mm;border:0;border-radius:' + rad + 'px;background:' + T.acc + ';color:#fff;cursor:pointer;white-space:nowrap;flex:none">▶ Ver y escuchar</button><span data-est-sub="1" style="font-size:.8em;font-style:italic;opacity:.85;min-width:0"></span></div>'
      : '<div style="font-size:.76em;opacity:.8;margin:0 0 2.5mm">Animación con voz de esta técnica en el curso premium: lección «' + es(it.n) + '».</div>';
    var big0 = it.fr[n - 1] || '';
    return H.cabecera(C, pg) + '<div data-est="1" data-acc="' + es(T.acc) + '">' +
      '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">Técnica paso a paso · ' + n + ' pasos</div>' + H.h1(C, es(it.n)) +
      (it.resumen ? '<p style="margin:0 0 2.5mm;max-width:160mm;font-size:.9em">' + es(it.resumen) + '</p>' : '') + ctrl +
      (big0 ? '<img data-est-big="1" src="' + big0 + '" alt="' + es(it.n) + '" style="width:100%;max-height:62mm;object-fit:contain;display:block;border-radius:' + rad + 'px;margin:0 0 3mm;transition:opacity .18s">' : '') +
      '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5mm 3mm">' + cuad + '</div>' + test +
      '</div>' + (web ? SCRIPT : '') + H.folio(C, pg);
  }

  /* ─── en el libro: una página por envío, en la unidad que le toca ─── */
  var RELLENO = ['vis', 'lec_amplia', 'lec_lectura', 'lec_caso', 'lec_concepto', 'pe_corte', 'pro_diagrama', 'lec_proyecto'];
  function convertir(res, cfg) {
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu') return res;
    var L = leer(); if (!L.length) return res;
    var re = /^pe_(g3d|est)_mio[0-9a-z]+_\d+$/, usados = {};
    /* los dibujos sueltos de mis envíos que la biblioteca haya metido como lámina: fuera, van en su página */
    res.pages.forEach(function (p, i) {
      if (Object.keys(p).some(function (k) { return typeof p[k] === 'string' && re.test(p[k]); })) res.pages[i] = { tipo: 'lec_amplia', u: p.u, n: p.n, num: p.num };
    });
    L.slice().reverse().forEach(function (it) {
      var pref = it.tipo === 'g3d' ? /^pe_u_c_/ : new RegExp('^cb_' + (it.tec || '') + '$');
      var cand = [];
      res.pages.forEach(function (p, i) {
        var r = RELLENO.indexOf(p.tipo); if (r < 0 || usados[i] || !p.u) return;
        var bonus = pref.test(p.u.id) ? 0 : it.tipo === 'est' && /^cb_/.test(p.u.id) ? 20 : 40;
        cand.push([bonus + r, i]);
      });
      if (!cand.length) return;
      cand.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      var i = cand[0][1], p = res.pages[i], u = p.u; usados[i] = 1;
      var ids = modelos(it).map(function (m) { return m.id; });
      u.mods = (u.mods || []).filter(function (id) { return ids.indexOf(id) < 0; }).concat(ids);
      res.pages[i] = it.tipo === 'g3d' ? { tipo: 'pe_guia3d', u: u, n: p.n, num: p.num, corte: it.id, fill2: { nada: 1 } } : { tipo: 'pe_mitec', u: u, n: p.n, num: p.num, mio: it.id, fill2: { nada: 1 } };
    });
    return res;
  }
  var HECHO = { reg: 0, co: 0, pg: 0, ed: 0 };
  function engancharED(ED) {
    if (ED.__peluMios) return; ED.__peluMios = 1;
    ED.registrar({ paginas: { pe_mitec: paginaTec }, voz: { pe_mitec: function (pg) { var it = porId(pg.mio); return it ? it.n + '. ' + it.narr.join(' ') : ''; } } });
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { convertir(r, cfg); } catch (e) { console.warn('biblioteca míos', e); } return r; };
  }
  (function intentar() {
    if (!HECHO.reg && window.EU_MODELOS) { HECHO.reg = 1; registrar(leer()); }
    if (!HECHO.co && window.EU_CORTES) { HECHO.co = 1; parcheCortes(window.EU_CORTES); }
    if (!HECHO.pg && window.EU_PELU_GUIAS) { HECHO.pg = 1; parcheGuias(window.EU_PELU_GUIAS); }
    if (!HECHO.ed && window.EU_EDITORIAL && window.EU_EDITORIAL.__peluEst) { HECHO.ed = 1; engancharED(window.EU_EDITORIAL); }
    if (!(HECHO.reg && HECHO.co && HECHO.pg && HECHO.ed)) setTimeout(intentar, 800);
  })();

  /* ─── botones en Guías 3D y Estudios (parche del componente, sin tocar su archivo) ─── */
  var EST_BT = 'border-radius:8px;padding:6px 11px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;background:transparent;border:1px solid #a855f7;color:#d8b4fe';
  function botonEn(host, despuesDe, etiqueta, fn) {
    if (!host || host.querySelector('[data-eu-biblio]')) return;
    var ref = [].slice.call(host.querySelectorAll('button')).filter(function (b) { return b.textContent.trim() === despuesDe; })[0];
    if (!ref) return;
    var b = document.createElement('button'); b.setAttribute('data-eu-biblio', '1'); b.textContent = etiqueta; b.style.cssText = ref.style.cssText + ';border-color:#a855f7;color:#d8b4fe';
    b.onclick = fn; ref.parentNode.insertBefore(b, ref.nextSibling);
  }
  function ponGuias(el) {
    botonEn(el, '📥 Importar', '📚 A la biblioteca', function () { desdeGuiaDatos(el.guia, el.guia && el.guia.nombre, function () { return framesGuia(el); }); });
  }
  function ponEstudios(el) {
    botonEn(el, '⬇ PDF', '📚 A la biblioteca', function () { desdeTec(el.tecId, el); });
  }
  window.customElements.whenDefined('guias-3d').then(function () {
    var C = window.customElements.get('guias-3d'), P = C.prototype;
    if (P.__mios) return; P.__mios = 1;
    var pg = P.pintarGuardadas;
    P.pintarGuardadas = function () {
      var r = pg.apply(this, arguments), s = this; if (!this.listaGuardadas) return r;
      var l = this.leerTodas(), filas = this.listaGuardadas.children;
      l.forEach(function (reg, i) {
        var f = filas[i]; if (!f || f.querySelector('[data-eu-biblio]')) return;
        var b = document.createElement('button'); b.setAttribute('data-eu-biblio', '1'); b.textContent = '📚'; b.title = 'A la biblioteca';
        b.style.cssText = 'background:transparent;border:1px solid #4b4b7a;color:#d8b4fe;border-radius:6px;padding:3px 7px;font-size:10px;cursor:pointer;font-family:inherit';
        b.onclick = function () { desdeGuiaDatos(reg.guia, reg.nombre); };
        f.insertBefore(b, f.lastChild);
      });
      return r;
    };
    document.querySelectorAll('guias-3d').forEach(function (e) { if (e.listaGuardadas) e.pintarGuardadas(); });
  });
  /* el navegador fija connectedCallback al definir el elemento: los botones se ponen observando el DOM */
  var PEND = 0;
  function revisar() {
    PEND = 0;
    document.querySelectorAll('guias-3d:not([aria-hidden])').forEach(ponGuias);
    document.querySelectorAll('estudios-belleza:not([aria-hidden])').forEach(ponEstudios);
  }
  function arrancar() {
    new MutationObserver(function () { if (!PEND) PEND = setTimeout(revisar, 120); }).observe(document.body, { childList: true, subtree: true });
    revisar();
  }
  if (document.body) arrancar(); else document.addEventListener('DOMContentLoaded', arrancar);

  /* ─── Míos: tarjetas de Guía 3D y de Examen ─── */
  function desdeMios(p) {
    if (!p || !p.datos) return;
    if (p.tipo === 'guia' && p.datos.guia) return desdeGuiaDatos(p.datos.guia, p.nombre);
    if (p.tipo === 'examen' && p.datos.repTec) return desdeTec(p.datos.repTec, null);
    aviso('Este trabajo no tiene pasos que pasar a la biblioteca.');
  }
  function quitar(id) { escribir(leer().filter(function (x) { return x.id !== id; })); }

  window.EU_BIBLIO = { leer: leer, quitar: quitar, desdeGuia: desdeGuiaDatos, desdeTec: desdeTec, desdeMios: desdeMios, puedeMios: function (p) { return !!(p && p.datos && ((p.tipo === 'guia' && p.datos.guia) || (p.tipo === 'examen' && p.datos.repTec))); }, convertir: convertir, paginaTec: paginaTec, modelos: modelos };
})();
