/* b6_anuncios_ui.js — pestaña «Anuncios» del Estudio Universal. Custom element <anuncios-premium>.
   Galería de los 100 anuncios premium (EU_ANUNCIOS) por categoría y formato, editor de textos, paleta,
   letra y marco, «Mi marca» para todos los anuncios y descargas PNG/JPG/SVG/PDF/ZIP.
   Guarda en localStorage 'eu_anuncios_v1'. Carga sola b6_portadas_kit.js y b6_anuncios_*.js si faltan. */
(function () {
  'use strict';
  if (window.customElements.get('anuncios-premium')) return;
  var CLAVE = 'eu_anuncios_v1', V = '?v=1795100000001';
  var C = { fondo: '#0d0d1f', panel: '#14142e', borde: '#26264a', tinta: '#e2e8f0', tenue: '#94a3b8', acento: '#a855f7', acento2: '#c084fc' };
  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }
  function cargar(src) { return new Promise(function (ok) { var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ok; document.head.appendChild(s); }); }
  function asegurar() {
    var p = Promise.resolve();
    if (!window.EU_PORTADAS) p = p.then(function () { return cargar('./b6_portadas_kit.js' + V); });
    if (!window.EU_ANUNCIOS) p = p.then(function () { return cargar('./b6_anuncios_kit.js' + V); });
    ['1', '2', '3'].forEach(function (n) { p = p.then(function () { return window.EU_ANUNCIOS && window.EU_ANUNCIOS.lista().length >= +n * 30 ? null : cargar('./b6_anuncios_' + n + '.js' + V); }); });
    if (!window.JSZip) p = p.then(function () { return cargar('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'); });
    if (!window.jspdf) p = p.then(function () { return cargar('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'); });
    return p;
  }
  function uri(s) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); }
  function boton(txt, prim) { var b = el('button', 'font:600 12px/1 system-ui,sans-serif;padding:9px 12px;border-radius:8px;cursor:pointer;border:1px solid ' + (prim ? C.acento : C.borde) + ';background:' + (prim ? C.acento : 'transparent') + ';color:' + (prim ? '#fff' : C.tinta), txt); b.onmouseenter = function () { b.style.background = prim ? '#9333ea' : '#1d1d40'; }; b.onmouseleave = function () { b.style.background = prim ? C.acento : 'transparent'; }; return b; }
  function chip(txt, on) { return el('button', 'font:600 11.5px/1 system-ui,sans-serif;padding:7px 11px;border-radius:999px;cursor:pointer;white-space:nowrap;border:1px solid ' + (on ? C.acento : C.borde) + ';background:' + (on ? '#2a1747' : 'transparent') + ';color:' + (on ? '#f3e8ff' : C.tenue), txt); }

  class AnunciosPremium extends HTMLElement {
    connectedCallback() {
      if (this._listo) return; this._listo = true;
      this.style.cssText = 'display:block;color:' + C.tinta + ';font:13px/1.5 system-ui,sans-serif';
      this.textContent = 'Cargando los anuncios…';
      var yo = this;
      asegurar().then(function () { if (!window.EU_ANUNCIOS) { yo.textContent = 'No se pudo cargar el motor de anuncios.'; return; } yo.iniciar(); });
    }
    leer() { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; } }
    guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(this.st)); } catch (e) {} }
    iniciar() {
      var EA = window.EU_ANUNCIOS, s = this.leer();
      this.st = { cat: s.cat || '', fmt: EA.FORMATOS[s.fmt] ? s.fmt : '1:1', sel: s.sel && EA.anuncio(s.sel) ? s.sel : EA.lista()[0].id, ed: s.ed || {}, marca: s.marca || { marca: '', dato: '', pal: '' } };
      this.textContent = '';
      var raiz = el('div', 'display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start');
      this.izq = el('div', 'flex:1 1 420px;min-width:0;display:flex;flex-direction:column;gap:12px');
      this.der = el('div', 'flex:0 1 400px;min-width:300px;background:' + C.panel + ';border:1px solid ' + C.borde + ';border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:12px;position:sticky;top:8px');
      raiz.appendChild(this.izq); raiz.appendChild(this.der); this.appendChild(raiz);
      this.pintaFiltros(); this.pintaGaleria(); this.pintaEditor();
    }
    cfg(id) { var e = this.st.ed[id] || {}, m = this.st.marca, o = {}; if (m.marca) o.marca = m.marca; if (m.dato) o.dato = m.dato; if (m.pal !== '' && m.pal != null) o.pal = m.pal; for (var k in e) if (e[k] !== '' && e[k] != null) o[k] = e[k]; return o; }
    pintaFiltros() {
      var EA = window.EU_ANUNCIOS, yo = this;
      if (!this.filtros) { this.filtros = el('div', 'display:flex;flex-direction:column;gap:10px'); this.izq.appendChild(this.filtros); }
      this.filtros.textContent = '';
      var f1 = el('div', 'display:flex;flex-wrap:wrap;gap:6px'), cats = [['', 'Todas · ' + EA.lista().length]].concat(Object.keys(EA.CATS).map(function (k) { return [k, EA.CATS[k] + ' · ' + EA.lista(k).length]; }));
      cats.forEach(function (c) { var b = chip(c[1], yo.st.cat === c[0]); b.onclick = function () { yo.st.cat = c[0]; yo.guardar(); yo.pintaFiltros(); yo.pintaGaleria(); }; f1.appendChild(b); });
      var f2 = el('div', 'display:flex;flex-wrap:wrap;gap:6px;align-items:center');
      Object.keys(EA.FORMATOS).forEach(function (k) { var F = EA.FORMATOS[k], b = chip(k + '  ' + F.n, yo.st.fmt === k); b.title = F.u + ' · ' + F.w + '×' + F.h + ' px'; b.onclick = function () { yo.st.fmt = k; yo.guardar(); yo.pintaFiltros(); yo.pintaGaleria(); yo.pintaEditor(); }; f2.appendChild(b); });
      var u = el('span', 'font-size:11.5px;color:' + C.tenue + ';margin-left:4px', EA.FORMATOS[this.st.fmt].u + ' · ' + EA.FORMATOS[this.st.fmt].w + '×' + EA.FORMATOS[this.st.fmt].h + ' px');
      f2.appendChild(u);
      this.filtros.appendChild(f1); this.filtros.appendChild(f2);
    }
    pintaGaleria() {
      var EA = window.EU_ANUNCIOS, yo = this, F = EA.FORMATOS[this.st.fmt], ancho = F.w > F.h ? 260 : F.h > 1.5 * F.w ? 130 : 170;
      if (!this.gal) { this.gal = el('div', ''); this.izq.appendChild(this.gal); }
      if (this.obs) this.obs.disconnect();
      this.gal.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(' + ancho + 'px,1fr));gap:12px';
      this.gal.textContent = ''; this.miniaturas = {};
      this.obs = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting && !en.target._ok) { en.target._ok = true; en.target.src = uri(EA.svg(en.target._id, yo.st.fmt, yo.cfg(en.target._id))); yo.obs.unobserve(en.target); } }); }, { rootMargin: '400px' });
      EA.lista(this.st.cat || null).forEach(function (a) {
        var on = a.id === yo.st.sel, c = el('button', 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:6px;border-radius:10px;padding:5px;border:2px solid ' + (on ? C.acento : 'transparent') + ';background:' + (on ? '#1d1440' : 'transparent'));
        var img = el('img', 'width:100%;aspect-ratio:' + F.w + '/' + F.h + ';display:block;border-radius:6px;background:#1a1a33'); img._id = a.id; img.alt = a.n;
        c.appendChild(img); c.appendChild(el('span', 'font-size:11px;color:' + (on ? '#f3e8ff' : C.tenue) + ';line-height:1.3;padding:0 2px', a.n));
        c.onclick = function () { yo.st.sel = a.id; yo.guardar(); yo.pintaGaleria(); yo.pintaEditor(); };
        yo.gal.appendChild(c); yo.obs.observe(img); yo.miniaturas[a.id] = img;
      });
    }
    refrescaMini(id) { var img = this.miniaturas && this.miniaturas[id]; if (img && img._ok) img.src = uri(window.EU_ANUNCIOS.svg(id, this.st.fmt, this.cfg(id))); }
    pintaEditor() {
      var EA = window.EU_ANUNCIOS, yo = this, id = this.st.sel, ad = EA.anuncio(id), D = this.der;
      D.textContent = '';
      var cab = el('div', 'display:flex;justify-content:space-between;align-items:baseline;gap:8px');
      cab.appendChild(el('b', 'font-size:14px;color:' + C.acento2, ad.n)); cab.appendChild(el('span', 'font-size:11px;color:' + C.tenue, EA.CATS[ad.cat]));
      D.appendChild(cab);
      var prev = el('img', 'width:100%;display:block;border-radius:8px;background:#1a1a33;box-shadow:0 10px 30px rgba(0,0,0,.35)'); D.appendChild(prev);
      var fila = el('div', 'display:grid;grid-template-columns:1fr 1fr 1fr 1.6fr;gap:8px;align-items:end'), minis = {};
      Object.keys(EA.FORMATOS).forEach(function (k) { var F = EA.FORMATOS[k], b = el('button', 'all:unset;cursor:pointer;display:flex;flex-direction:column;gap:3px;align-items:center'), im = el('img', 'width:100%;aspect-ratio:' + F.w + '/' + F.h + ';border-radius:4px;border:2px solid ' + (k === yo.st.fmt ? C.acento : C.borde)); b.appendChild(im); b.appendChild(el('span', 'font-size:10.5px;color:' + C.tenue, k)); b.onclick = function () { yo.st.fmt = k; yo.guardar(); yo.pintaFiltros(); yo.pintaGaleria(); yo.pintaEditor(); }; minis[k] = im; fila.appendChild(b); });
      D.appendChild(fila);
      var pinta = function () { var c = yo.cfg(id); prev.src = uri(EA.svg(id, yo.st.fmt, c)); Object.keys(minis).forEach(function (k) { minis[k].src = uri(EA.svg(id, k, c)); }); yo.refrescaMini(id); };
      var t = null, luego = function () { clearTimeout(t); t = setTimeout(function () { yo.guardar(); pinta(); }, 160); };
      pinta();

      var ed = this.st.ed[id] || (this.st.ed[id] = {});
      var campo = function (etq, k, def, larga) {
        var w = el('label', 'display:flex;flex-direction:column;gap:4px;font-size:11px;color:' + C.tenue), i = el(larga ? 'textarea' : 'input', 'font:13px/1.4 system-ui,sans-serif;background:' + C.fondo + ';color:' + C.tinta + ';border:1px solid ' + C.borde + ';border-radius:7px;padding:7px 9px;resize:vertical' + (larga ? ';min-height:44px' : ''));
        i.value = ed[k] != null ? ed[k] : ''; i.placeholder = def || ''; i.oninput = function () { ed[k] = i.value; luego(); };
        i.onfocus = function () { i.style.borderColor = C.acento; }; i.onblur = function () { i.style.borderColor = C.borde; };
        w.appendChild(el('span', '', etq)); w.appendChild(i); return w;
      };
      var g = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:8px');
      var full = function (n) { n.style.gridColumn = '1 / -1'; return n; };
      g.appendChild(full(campo('Titular', 'titular', ad.t, true)));
      g.appendChild(full(campo('Subtítulo', 'sub', ad.s)));
      g.appendChild(campo('Marca', 'marca', this.st.marca.marca || ad.marca)); g.appendChild(campo('Botón', 'cta', ad.cta));
      g.appendChild(campo('Oferta (sello)', 'oferta', ad.o)); g.appendChild(campo('Texto del sello', 'ofertaTxt', ad.ol));
      g.appendChild(full(campo('Dato de contacto', 'dato', this.st.marca.dato || ad.dato)));
      D.appendChild(g);

      var sel = function (etq, k, ops) { var w = el('label', 'display:flex;flex-direction:column;gap:4px;font-size:11px;color:' + C.tenue), s = el('select', 'font:13px system-ui,sans-serif;background:' + C.fondo + ';color:' + C.tinta + ';border:1px solid ' + C.borde + ';border-radius:7px;padding:7px'); ops.forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; s.appendChild(op); }); s.value = ed[k] || ''; s.onchange = function () { ed[k] = s.value; luego(); }; w.appendChild(el('span', '', etq)); w.appendChild(s); return w; };
      var g2 = el('div', 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px');
      g2.appendChild(sel('Letra', 'fuente', [['', 'La del diseño']].concat(Object.keys(EA.FUENTES).map(function (k) { return [k, EA.FUENTES[k].n]; }))));
      g2.appendChild(sel('Marco', 'marco', [['', 'El del diseño']].concat(Object.keys(EA.MARCOS).map(function (k) { return [k, EA.MARCOS[k]]; }))));
      var tg = el('label', 'display:flex;gap:6px;align-items:center;font-size:12px;color:' + C.tinta + ';padding-top:16px;cursor:pointer'), cb = el('input'); cb.type = 'checkbox'; cb.checked = !ed.sinOferta; cb.style.accentColor = C.acento; cb.onchange = function () { ed.sinOferta = !cb.checked; luego(); }; tg.appendChild(cb); tg.appendChild(document.createTextNode('Sello de oferta'));
      g2.appendChild(tg); D.appendChild(g2);

      D.appendChild(el('span', 'font-size:11px;color:' + C.tenue, 'Paleta'));
      var pals = el('div', 'display:flex;flex-wrap:wrap;gap:6px');
      var pon = function (v, cols, nom) { var on = String(ed.pal != null ? ed.pal : '') === String(v), b = el('button', 'all:unset;cursor:pointer;display:flex;border-radius:6px;overflow:hidden;width:42px;height:22px;outline:2px solid ' + (on ? C.acento : 'transparent') + ';outline-offset:2px'); b.title = nom; cols.forEach(function (c) { b.appendChild(el('span', 'flex:1;background:' + c)); }); b.onclick = function () { ed.pal = v; yo.guardar(); yo.pintaEditor(); }; pals.appendChild(b); };
      var P0 = EA.PAL[ad.pal || 0]; pon('', [P0.f, P0.a, P0.d], 'La del diseño (' + P0.n + ')');
      EA.PAL.forEach(function (P, i) { pon(i, [P.f, P.a, P.d], P.n); });
      D.appendChild(pals);

      var acc = el('div', 'display:flex;flex-wrap:wrap;gap:8px');
      var aviso = el('div', 'font-size:11.5px;color:' + C.tenue + ';min-height:16px');
      var tarea = function (b, fn) { b.onclick = function () { b.disabled = true; var t0 = b.textContent; b.textContent = 'Preparando…'; Promise.resolve().then(fn).then(function () { aviso.textContent = 'Listo.'; }, function (e) { aviso.textContent = e && e.message ? e.message : 'No se pudo descargar.'; }).then(function () { b.disabled = false; b.textContent = t0; }); }; acc.appendChild(b); };
      tarea(boton('PNG', true), function () { return EA.descargarPNG(id, yo.st.fmt, yo.cfg(id)); });
      tarea(boton('JPG'), function () { return EA.descargarJPG(id, yo.st.fmt, yo.cfg(id)); });
      tarea(boton('SVG'), function () { EA.descargarSVG(id, yo.st.fmt, yo.cfg(id)); });
      tarea(boton('PDF'), function () { return EA.descargarPDF(id, yo.st.fmt, yo.cfg(id)); });
      tarea(boton('4 formatos · ZIP'), function () { return EA.zip([[id, yo.cfg(id)]], null, 'anuncio-' + id, function (n, t) { aviso.textContent = 'Imagen ' + n + ' de ' + t + '…'; }); });
      var cat = ad.cat;
      tarea(boton(EA.CATS[cat] + ' · ZIP'), function () { return EA.zip(EA.lista(cat).map(function (a) { return [a.id, yo.cfg(a.id)]; }), null, 'anuncios-' + cat, function (n, t) { aviso.textContent = 'Imagen ' + n + ' de ' + t + '…'; }); });
      var rb = boton('Restablecer'); rb.onclick = function () { yo.st.ed[id] = {}; yo.guardar(); yo.pintaEditor(); yo.refrescaMini(id); }; acc.appendChild(rb);
      D.appendChild(acc); D.appendChild(aviso);

      /* Mi marca: se aplica a los 100 anuncios */
      var mm = el('details', 'border-top:1px solid ' + C.borde + ';padding-top:10px');
      var sm = el('summary', 'cursor:pointer;font-size:12.5px;font-weight:600;color:' + C.acento2, 'Mi marca en todos los anuncios'); mm.appendChild(sm);
      mm.open = !!(this.st.marca.marca || this.st.marca.dato);
      var gm = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px');
      var cm = function (etq, k, ph) { var w = el('label', 'display:flex;flex-direction:column;gap:4px;font-size:11px;color:' + C.tenue), i = el('input', 'font:13px system-ui,sans-serif;background:' + C.fondo + ';color:' + C.tinta + ';border:1px solid ' + C.borde + ';border-radius:7px;padding:7px 9px'); i.value = yo.st.marca[k] || ''; i.placeholder = ph; i.oninput = function () { yo.st.marca[k] = i.value; clearTimeout(yo._tm); yo._tm = setTimeout(function () { yo.guardar(); yo.pintaGaleria(); pinta(); }, 400); }; w.appendChild(el('span', '', etq)); w.appendChild(i); return w; };
      gm.appendChild(cm('Nombre de tu negocio', 'marca', 'p. ej. Estudio Lucía'));
      gm.appendChild(cm('Contacto', 'dato', 'p. ej. @estudiolucia'));
      mm.appendChild(gm);
      mm.appendChild(el('p', 'margin:8px 0 0;font-size:11px;color:' + C.tenue + ';line-height:1.5', 'Sustituye la marca y el contacto de ejemplo en todos los anuncios. Lo que escribas en un anuncio concreto manda sobre esto.'));
      D.appendChild(mm);
    }
  }
  window.customElements.define('anuncios-premium', AnunciosPremium);
})();
