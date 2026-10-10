/* b6_editorial.js — pestaña «Editorial escolar» del Estudio Universal.
   Custom element <editorial-escolar>. Panel de decisiones a la derecha
   (país, etapa, curso, materia, producto, extensión, plantilla, apoyos) y
   vista previa paginada a la izquierda. Reutiliza la voz del Estudio
   (EU_VOZ), la bandeja de descargas (B6Bandeja) y, en Peluquería, el
   cerebro de técnicas (EU_CEREBRO) a través del banco curricular. */
(function () {
  'use strict';
  if (window.customElements.get('editorial-escolar')) return;

  var CLAVE = 'eu_editorial_v1';
  var MM = 3.7795;

  function el(tag, css, txt) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }
  function cargar(src) {
    return new Promise(function (ok) {
      var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ok; document.head.appendChild(s);
    });
  }
  function asegurar(progreso) {
    if (window.EU_CARGA_EDITORIAL && !window.EU_EDITORIAL_LISTO) return window.EU_CARGA_EDITORIAL(progreso).then(function () { return asegurar(); });
    if (!document.querySelector('link[data-editorial-fuentes]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.setAttribute('data-editorial-fuentes', '1');
      l.href = 'https://fonts.googleapis.com/css2?family=Andika:ital,wght@0,400;0,700;1,400&family=Baloo+2:wght@500;700&family=Lexend:wght@300;400;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap';
      document.head.appendChild(l);
    }
    var p = Promise.resolve();
    if (!window.EU_CURRICULO) p = p.then(function () { return cargar('./b6_curriculo.js?v=1788600000000'); });
    if (!window.EU_EDITORIAL) p = p.then(function () { return cargar('./b6_editorial_motor.js?v=1790600000000'); });
    if (!window.QRCode) p = p.then(function () { return cargar('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'); });
    if (!window.JSZip) p = p.then(function () { return cargar('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'); });
    if (!window.EU_IDIOMAS) p = p.then(function () { return cargar('./b6_cerebro_idiomas.js?v=1788700000000'); });
    if (!window.EU_COCINA) p = p.then(function () { return cargar('./b6_cerebro_cocina.js?v=1788700000000'); });
    if (!window.EU_CONECTORES) p = p.then(function () { return cargar('./b6_conectores.js?v=1790700000000'); });
    if (!window.EU_INFANTIL) p = p.then(function () { return cargar('./b6_cerebro_infantil.js?v=1790700000000'); });
    return p;
  }

  var DEF = {
    pais: 'es', nivel: 'pri', curso: 2, materia: 'mate', prod: 'libro', paginas: 40, papel: 'auto', plantilla: 'auto',
    usuario: 'docente', facil: false, dislexia: false, dua: false, solucion: true, semilla: 1,
    guiaN: '', titulo: '', autor: '', centro: '', alumno: '', fuentes: '', op: {}, acab: {}
  };

  var ST = {
    lbl: 'font-size:10px;color:#7c7c9e;letter-spacing:.08em;text-transform:uppercase;font-weight:700;margin:14px 0 6px',
    campo: 'width:100%;box-sizing:border-box;background:#18183a;border:1px solid #2d2d4a;color:#e8e8f5;border-radius:8px;padding:7px 9px;font-size:12px;font-family:inherit',
    fila: 'display:flex;gap:5px;flex-wrap:wrap',
    nota: 'font-size:10.5px;color:#94a3b8;line-height:1.55;margin-top:6px;text-wrap:pretty',
    caja: 'background:#141430;border:1px solid #2d2d4a;border-radius:12px;padding:4px 12px 12px',
    bt: 'border-radius:8px;padding:8px 11px;font-size:11.5px;font-weight:600;cursor:pointer;background:#1a1a35;color:#cbd5e1;border:1px solid #2d2d4a;font-family:inherit;text-align:left',
    btF: 'border-radius:8px;padding:8px 12px;font-size:11.5px;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#0891b2,#06b6d4);color:#fff;border:0;font-family:inherit;text-align:left'
  };
  function chip(on) {
    return 'flex:none;border-radius:20px;padding:6px 11px;font-size:11.5px;cursor:pointer;white-space:nowrap;font-family:inherit;text-align:left;' +
      (on ? 'background:#22224a;border:1px solid #a855f7;color:#fff;font-weight:600' : 'background:transparent;border:1px solid #2d2d4a;color:#94a3b8');
  }

  class Editorial extends HTMLElement {
    connectedCallback() {
      if (this._hecho) return;
      this._hecho = true;
      this.style.display = 'block';
      this.textContent = 'Cargando el editorial…';
      this.style.color = '#94a3b8';
      var yo = this;
      asegurar(function (n, t) { yo.textContent = 'Cargando las bibliotecas del editorial… ' + n + ' / ' + t; }).then(function () { yo.montar(); });
    }
    disconnectedCallback() { this.callar(); if (this._ro) this._ro.disconnect(); if (this._desB) this._desB(); }

    leer() {
      var c = {};
      try { c = JSON.parse(localStorage.getItem(CLAVE) || '{}'); } catch (e) { }
      this.cfg = Object.assign({}, DEF, c);
      this.cfg.imagenes = [];
      try { var im = JSON.parse(localStorage.getItem(CLAVE + '_img') || '{}'); this.cfg.guiaImg = im.guia || ''; this.cfg.portadaImg = im.portada || ''; } catch (e) { }
    }
    guardar() {
      var c = {}, yo = this;
      Object.keys(DEF).forEach(function (k) { c[k] = yo.cfg[k]; });
      try { localStorage.setItem(CLAVE, JSON.stringify(c)); } catch (e) { }
    }
    guardarImg() {
      try { localStorage.setItem(CLAVE + '_img', JSON.stringify({ guia: this.cfg.guiaImg || '', portada: this.cfg.portadaImg || '' })); } catch (e) { this.aviso('Las imágenes pesan demasiado para guardarse en este dispositivo: se usan en esta sesión.'); }
    }

    montar() {
      this.textContent = '';
      this.style.color = '';
      this.leer();
      this.pag = 0; this.vista = 'pagina'; this.verTodas = false;
      var caja = el('div', 'display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start;font-family:Segoe UI,system-ui,sans-serif;color:#e8e8f5');
      var izq = el('div', 'min-width:0;flex:1 1 520px');
      this.barra = el('div', 'display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px');
      this.info = el('div', 'font-size:11px;color:#94a3b8;margin:0 0 8px;line-height:1.5');
      this.escena = el('div', 'background:#0a0a14;border:1px solid #2d2d4a;border-radius:12px;padding:12px;min-height:420px;display:flex;justify-content:center;align-items:flex-start;overflow:hidden');
      this.avisoEl = el('div', 'font-size:11px;color:#fbbf24;margin-top:8px;min-height:14px');
      izq.appendChild(this.barra); izq.appendChild(this.info); izq.appendChild(this.escena); izq.appendChild(this.avisoEl);
      this.panel = el('div', 'display:flex;flex-direction:column;gap:10px;min-width:0;flex:1 1 300px;max-width:100%;width:330px');
      caja.appendChild(izq); caja.appendChild(this.panel);
      this.appendChild(caja);
      var yo = this;
      if (window.ResizeObserver) { this._ro = new ResizeObserver(function () { yo.pintar(); }); this._ro.observe(this.escena); }
      this.construirPanel();
      this.generar();
    }

    aviso(t) { if (this.avisoEl) this.avisoEl.textContent = t || ''; }

    set(k, v, panel) {
      var ant = this.cfg.materia;
      this.cfg[k] = v;
      if (k === 'pais' || k === 'nivel') {
        var P = EU_CURRICULO.PAISES[this.cfg.pais], N = P.niveles[this.cfg.nivel];
        if (this.cfg.curso >= N.c.length) this.cfg.curso = N.c.length - 1;
      }
      if (k === 'materia') {
        var M = EU_CURRICULO.materia(v) || {}, ok = EU_EDITORIAL.PRODUCTOS.filter(function (p) { return p.id === this.cfg.prod; }, this)[0];
        if (M.prodDef) this.cfg.prod = M.prodDef;
        else if (ok && ok.solo && ok.solo.indexOf(v) < 0) this.cfg.prod = 'libro';
        this.cfg.op = {};
        /* el título escrito es de su materia (Fátima, 10-10-2026): al cambiar de materia ya no se arrastra (un libro, curso o
           Carpeta HOTMART de Matemáticas salía con el título escrito para Peluquería); se recuerda el de cada materia en esta sesión */
        if (ant !== v) { var tm = this._titulos = this._titulos || {}; tm[ant] = this.cfg.titulo || ''; this.cfg.titulo = tm[v] || ''; }
      }
      if (k === 'prod' && v === 'trabajo' && this.cfg.paginas > 40) this.cfg.paginas = 12;
      if (k === 'prod' && v === 'examen' && this.cfg.paginas > 60) this.cfg.paginas = 9;
      this.guardar();
      if (panel !== false) this.construirPanel();
      this.programar();
    }
    programar() { var yo = this; clearTimeout(this._t); this._t = setTimeout(function () { yo.generar(); }, 160); }

    generar() {
      var t0 = performance.now(), yo = this, A = this.cfg.acab || {};
      /* Medir y rellenar cada página era lo que congelaba el Editorial (Peluquería 300 págs.: ~25 s de
         bloqueo, y se repetía al llegar las bibliotecas y con cada cambio del panel). Ahora se arma sin
         medir (relleno 'tandas', ~1–2 s) y el ajuste se hace después por tandas, sin congelar. */
      var tandas = !!(window.EU_RELLENO && EU_RELLENO.porTandas) && A.relleno !== 'no';
      var cfgA = tandas ? Object.assign({}, this.cfg, { acab: Object.assign({}, A, { relleno: 'tandas' }) }) : this.cfg;
      this._turnoT = (this._turnoT || 0) + 1; this._tanda = null;
      try { this.res = EU_EDITORIAL.ensamblar(cfgA); }
      catch (e) { this.aviso('No se ha podido armar: ' + e.message); console.error(e); return; }
      if (this.pag >= this.res.pages.length) this.pag = this.res.pages.length - 1;
      var C = this.res.C, P = C.P;
      this.info.textContent = this.res.pages.length + ' páginas · ' + C.papel.n + ' · plantilla ' + EU_EDITORIAL.PLANTILLAS[C.T.id].n + ' · ' + this.res.unidades.length + (this.res.unidades.length === 1 ? ' unidad' : ' unidades') + ' · ' + (P.id === 'us' ? 'EE. UU.' : P.n) + ', ' + P.marcoCorto + ' · armado en ' + Math.round(performance.now() - t0) + ' ms';
      this.aviso('');
      /* Las bibliotecas de dibujos (b6_lib_*) llegan en segundo plano después del núcleo: se arma
         ya con lo que hay y se vuelve a armar una sola vez cuando terminan de llegar. */
      if (window.EU_CARGA_LIBS && !window.EU_LIBS_LISTAS) {
        var yo = this;
        this.aviso('Cargando las bibliotecas de dibujos… el libro se completará solo en unos segundos.');
        if (!this._esperaLibs) this._esperaLibs = window.EU_CARGA_LIBS(function (n, t) { if (yo.isConnected && !window.EU_LIBS_LISTAS) yo.aviso('Cargando las bibliotecas de dibujos… ' + n + ' / ' + t); }).then(function () { if (yo.isConnected) yo.generar(); });
      }
      this.construirBarra();
      this.pintar();
      if (tandas && !(window.EU_CARGA_LIBS && !window.EU_LIBS_LISTAS)) this.ajustarPorTandas();
    }

    ajustarPorTandas() {
      var yo = this, res = this.res, turno = this._turnoT, ult = 0;
      var T = EU_RELLENO.porTandas(res, this.cfg, {
        vivo: function () { return yo.isConnected && yo._turnoT === turno && yo.res === res; },
        progreso: function (k, tot, toc) {
          if (tot > 12) yo.aviso('Ajustando las páginas… ' + k + ' / ' + tot + ' · puedes seguir trabajando');
          var a = res.pages[yo.pag], b = res.pages[yo.pag + 1], ahora = performance.now();
          var ver = yo.vista === 'miniaturas' ? ahora - ult > 1500 : toc.some(function (n) { return (a && a.num === n) || (yo.vista === 'doble' && b && b.num === n); });
          if (ver) { ult = ahora; yo.pintar(); }
        }
      });
      this._tanda = T;
      T.p.then(function (ok) { if (!ok || yo._tanda !== T) return; yo._tanda = null; yo.aviso(''); yo.pintar(); });
    }
    /* Antes de exportar: termina de golpe lo que quede por ajustar, para que el archivo salga completo. */
    terminarTandas() { if (this._tanda) { var T = this._tanda; this._tanda = null; T.terminar(); this.aviso(''); } }

    construirBarra() {
      var b = this.barra, yo = this, n = this.res.pages.length;
      b.textContent = '';
      var bt = function (t, fn, css) { var x = el('button', css || ST.bt, t); x.onclick = fn; b.appendChild(x); return x; };
      bt('◀', function () { yo.ir(yo.pag - (yo.vista === 'doble' ? 2 : 1)); });
      var lab = el('span', 'font-size:12px;color:#cbd5e1;min-width:96px;text-align:center;font-variant-numeric:tabular-nums', 'Página ' + (this.pag + 1) + ' de ' + n);
      b.appendChild(lab);
      bt('▶', function () { yo.ir(yo.pag + (yo.vista === 'doble' ? 2 : 1)); });
      var sep = el('span', 'width:8px'); b.appendChild(sep);
      [['pagina', 'Página'], ['doble', 'Doble'], ['miniaturas', 'Miniaturas']].forEach(function (v) {
        bt(v[1], function () { yo.vista = v[0]; yo.construirBarra(); yo.pintar(); }, chip(yo.vista === v[0]));
      });
      b.appendChild(el('span', 'flex:1'));
      bt('🔊 Leer página', function () { yo.leerPagina(); });
      bt('▶ Modo clase', function () { yo.modoClase(); }, ST.btF);
    }

    ir(i) {
      var n = this.res.pages.length;
      this.pag = Math.max(0, Math.min(n - 1, i));
      this.construirBarra(); this.pintar();
    }

    pintar() {
      if (!this.res) return;
      var C = this.res.C, esc = this.escena, W = C.papel.w * MM, H = C.papel.h * MM, yo = this;
      var ancho = Math.max(200, esc.clientWidth - 26);
      esc.textContent = '';
      var hoja = function (i, esc0) {
        var pg = yo.res.pages[i];
        var marco = el('div', 'flex:none;width:' + (W * esc0) + 'px;height:' + (H * esc0) + 'px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,.45);border-radius:2px;background:#fff');
        var dentro = el('div', 'width:' + W + 'px;height:' + H + 'px;transform:scale(' + esc0 + ');transform-origin:0 0');
        dentro.innerHTML = EU_EDITORIAL.paginaHTML(pg, C, 'print', yo.res);
        marco.appendChild(dentro);
        return marco;
      };
      if (this.vista === 'miniaturas') {
        var s = Math.min(0.24, (ancho - 40) / (W * 4 + 30));
        var grid = el('div', 'display:flex;flex-wrap:wrap;gap:12px;justify-content:flex-start;width:100%');
        var tope = this.verTodas ? this.res.pages.length : Math.min(this.res.pages.length, 40);
        for (var i = 0; i < tope; i++) (function (i) {
          var c = el('div', 'display:flex;flex-direction:column;gap:4px;align-items:center;cursor:pointer');
          c.appendChild(hoja(i, s));
          c.appendChild(el('span', 'font-size:10px;color:' + (i === yo.pag ? '#a855f7' : '#7c7c9e'), String(i + 1)));
          c.onclick = function () { yo.pag = i; yo.vista = 'pagina'; yo.construirBarra(); yo.pintar(); };
          grid.appendChild(c);
        })(i);
        esc.appendChild(grid);
        if (tope < this.res.pages.length) {
          var mas = el('button', ST.bt + ';margin-top:12px', 'Mostrar las ' + this.res.pages.length + ' páginas');
          mas.onclick = function () { yo.verTodas = true; yo.pintar(); };
          var w = el('div', 'width:100%'); w.appendChild(grid); w.appendChild(mas); esc.textContent = ''; esc.appendChild(w);
        }
        return;
      }
      var dos = this.vista === 'doble' && this.pag + 1 < this.res.pages.length;
      var sc = Math.min(1, dos ? (ancho - 14) / (W * 2) : ancho / W);
      var fila = el('div', 'display:flex;gap:14px;justify-content:center');
      fila.appendChild(hoja(this.pag, sc));
      if (dos) fila.appendChild(hoja(this.pag + 1, sc));
      esc.appendChild(fila);
    }

    /* ─────────── voz ─────────── */
    decir(t) {
      var C = this.res && this.res.C, yo = this;
      if (!t) return Promise.resolve();
      if (Array.isArray(t)) return t.reduce(function (pr, seg) { return pr.then(function () { return yo.decirEn(seg.t, seg.lang); }); }, Promise.resolve());
      if (window.EU_VOZ && EU_VOZ.disponible && EU_VOZ.hablar) return Promise.resolve(EU_VOZ.hablar(t));
      if (!window.speechSynthesis) return Promise.resolve();
      return new Promise(function (ok) {
        var u = new SpeechSynthesisUtterance(t); u.lang = C ? C.P.lang : 'es-ES'; u.rate = 0.95;
        u.onend = u.onerror = function () { ok(); };
        speechSynthesis.speak(u);
        setTimeout(ok, 1500 + t.length * 90);
      });
    }
    decirEn(t, lang) {
      if (!window.speechSynthesis) return Promise.resolve();
      return new Promise(function (ok) {
        var u = new SpeechSynthesisUtterance(t); u.lang = lang; u.rate = 0.9;
        var v = speechSynthesis.getVoices().filter(function (x) { return x.lang && x.lang.replace('_', '-').indexOf(lang.slice(0, 2)) === 0; });
        var ex = v.filter(function (x) { return x.lang.replace('_', '-') === lang; })[0] || v[0]; if (ex) u.voice = ex;
        u.onend = u.onerror = function () { ok(); };
        speechSynthesis.speak(u); setTimeout(ok, 1200 + t.length * 110);
      });
    }
    callar() {
      this._clase = false;
      try { if (window.EU_VOZ && EU_VOZ.callar) EU_VOZ.callar(); } catch (e) { }
      try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { }
    }
    leerPagina() {
      this.callar();
      var pg = this.res.pages[this.pag], t = EU_EDITORIAL.textoVoz(pg, this.res.C);
      if (!t || (Array.isArray(t) && !t.length)) { var d = el('div'); d.innerHTML = EU_EDITORIAL.paginaHTML(pg, this.res.C, 'print', this.res); t = d.textContent.replace(/\s+/g, ' ').slice(0, 900); }
      this.decir(t);
    }

    modoClase() {
      var yo = this, C = this.res.C, W = C.papel.w * MM, H = C.papel.h * MM;
      this.callar();
      var capa = el('div', 'position:fixed;inset:0;z-index:9999;background:#0a0a14;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-family:Segoe UI,system-ui,sans-serif');
      var lienzo = el('div', 'flex:none');
      var ctl = el('div', 'display:flex;gap:8px;align-items:center');
      var lab = el('span', 'font-size:12px;color:#cbd5e1;min-width:110px;text-align:center');
      var pausa = el('button', ST.bt, '⏸ Pausa'), sal = el('button', ST.bt, '✕ Salir'), ant = el('button', ST.bt, '◀'), sig = el('button', ST.bt, '▶');
      ctl.appendChild(ant); ctl.appendChild(lab); ctl.appendChild(sig); ctl.appendChild(pausa); ctl.appendChild(sal);
      capa.appendChild(lienzo); capa.appendChild(ctl);
      document.body.appendChild(capa);
      var i = this.pag, corre = true, turno = 0;
      var ver = function () {
        var s = Math.min((innerWidth - 40) / W, (innerHeight - 90) / H);
        lienzo.style.cssText = 'flex:none;width:' + W * s + 'px;height:' + H * s + 'px;overflow:hidden;border-radius:4px';
        lienzo.innerHTML = '<div style="width:' + W + 'px;height:' + H + 'px;transform:scale(' + s + ');transform-origin:0 0">' + EU_EDITORIAL.paginaHTML(yo.res.pages[i], C, 'print', yo.res) + '</div>';
        lab.textContent = (i + 1) + ' / ' + yo.res.pages.length;
      };
      var paso = function () {
        var mio = ++turno;
        ver();
        if (!corre) return;
        var t = EU_EDITORIAL.textoVoz(yo.res.pages[i], C) || '';
        var espera = t ? yo.decir(t) : new Promise(function (ok) { setTimeout(ok, 2600); });
        espera.then(function () {
          if (mio !== turno || !corre) return;
          setTimeout(function () {
            if (mio !== turno || !corre) return;
            if (i < yo.res.pages.length - 1) { i++; paso(); } else { corre = false; pausa.textContent = '▶ Seguir'; }
          }, 700);
        });
      };
      pausa.onclick = function () { corre = !corre; pausa.textContent = corre ? '⏸ Pausa' : '▶ Seguir'; if (corre) paso(); else { turno++; yo.callar(); } };
      ant.onclick = function () { yo.callar(); i = Math.max(0, i - 1); paso(); };
      sig.onclick = function () { yo.callar(); i = Math.min(yo.res.pages.length - 1, i + 1); paso(); };
      sal.onclick = function () { turno++; corre = false; yo.callar(); capa.remove(); yo.pag = i; yo.construirBarra(); yo.pintar(); window.removeEventListener('keydown', tecla); };
      var tecla = function (e) { if (e.key === 'Escape') sal.onclick(); if (e.key === 'ArrowRight') sig.onclick(); if (e.key === 'ArrowLeft') ant.onclick(); if (e.key === ' ') { e.preventDefault(); pausa.onclick(); } };
      window.addEventListener('keydown', tecla);
      paso();
    }

    /* ─────────── descargas ─────────── */
    bajar(blob, nombre) {
      var u = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = u; a.download = nombre; document.body.appendChild(a); a.click();
      if (window.B6Bandeja) B6Bandeja.apuntar(u, nombre, 'editorial');
      setTimeout(function () { a.remove(); URL.revokeObjectURL(u); }, 4000);
    }
    exportar(tipo) {
      this.terminarTandas();
      var yo = this, res = this.res, C = res.C;
      if (tipo === 'print') { this.aviso('Abriendo la impresión: elige «Guardar como PDF» para el archivo. Márgenes: ninguno; gráficos de fondo: activados.'); EU_EDITORIAL.imprimir(res); return; }
      if (tipo === 'html') { this.bajar(EU_EDITORIAL.blobHTML(res), EU_EDITORIAL.nombreArchivo(C, 'html')); this.aviso('HTML interactivo descargado: respuestas que se comprueban y botón de escuchar en cada página.'); return; }
      if (tipo === 'epub') {
        this.aviso('Armando el EPUB de ' + res.pages.length + ' páginas…');
        EU_EDITORIAL.epub(res).then(function (b) { yo.bajar(b, EU_EDITORIAL.nombreArchivo(C, 'epub')); yo.aviso('EPUB 3 de maquetación fija descargado.'); })
          .catch(function (e) { yo.aviso(e.message); });
        return;
      }
      if (tipo === 'slides') {
        var cfg = Object.assign({}, this.cfg, { prod: 'presentacion', paginas: Math.min(60, Math.max(10, Math.round(this.cfg.paginas / 2))) });
        var r2 = EU_EDITORIAL.ensamblar(cfg);
        this.aviso('Presentación 16:9 de ' + r2.pages.length + ' diapositivas a partir de este contenido.');
        EU_EDITORIAL.imprimir(r2);
      }
    }

    /* ─────────── panel ─────────── */
    construirPanel() {
      var yo = this, cfg = this.cfg, CU = window.EU_CURRICULO, ED = window.EU_EDITORIAL, pn = this.panel;
      var P = CU.PAISES[cfg.pais];
      pn.textContent = '';
      var seccion = function (titulo) { var c = el('div', ST.caja); c.appendChild(el('div', ST.lbl, titulo)); pn.appendChild(c); return c; };
      var lbl = function (host, t) { host.appendChild(el('div', ST.lbl, t)); };
      var sel = function (host, opts, val, fn) {
        var s = el('select', ST.campo);
        opts.forEach(function (o) { var op = el('option', '', o[1]); op.value = o[0]; if (String(o[0]) === String(val)) op.selected = true; s.appendChild(op); });
        s.onchange = function () { fn(s.value); };
        host.appendChild(s); return s;
      };
      var chips = function (host, opts, val, fn) {
        var f = el('div', ST.fila);
        opts.forEach(function (o) { var b = el('button', chip(o[0] === val), o[1]); b.onclick = function () { fn(o[0]); }; f.appendChild(b); });
        host.appendChild(f); return f;
      };
      var texto = function (host, k, ph, area) {
        var i = el(area ? 'textarea' : 'input', ST.campo + (area ? ';min-height:74px;resize:vertical' : ''));
        i.value = cfg[k] || ''; i.placeholder = ph || '';
        i.oninput = function () { yo.cfg[k] = i.value; yo.guardar(); yo.programar(); };
        host.appendChild(i); return i;
      };
      var interruptor = function (host, k, t, d) {
        var f = el('label', 'display:flex;gap:9px;align-items:flex-start;cursor:pointer;margin:7px 0');
        var c = el('input'); c.type = 'checkbox'; c.checked = !!cfg[k]; c.style.cssText = 'accent-color:#a855f7;width:15px;height:15px;flex:none;margin-top:1px';
        c.onchange = function () { yo.set(k, c.checked, false); };
        var tx = el('div', 'font-size:12px;color:#e8e8f5;line-height:1.4'); tx.appendChild(el('b', 'font-weight:600', t));
        if (d) tx.appendChild(el('div', 'font-size:10.5px;color:#94a3b8;margin-top:2px', d));
        f.appendChild(c); f.appendChild(tx); host.appendChild(f);
      };
      var subir = function (host, t, multiple, fn) {
        var b = el('label', ST.bt + ';display:inline-flex;gap:6px;align-items:center', t);
        var i = el('input'); i.type = 'file'; i.accept = 'image/*'; i.multiple = !!multiple; i.style.display = 'none';
        i.onchange = function () {
          var fs = Array.prototype.slice.call(i.files || []);
          Promise.all(fs.map(function (f) { return new Promise(function (ok) { var r = new FileReader(); r.onload = function () { ok(r.result); }; r.readAsDataURL(f); }); })).then(fn);
        };
        b.appendChild(i); host.appendChild(b); return b;
      };

      /* 1 · Para quién */
      var s1 = seccion('Para quién');
      sel(s1, Object.keys(CU.PAISES).map(function (k) { return [k, CU.PAISES[k].n]; }), cfg.pais, function (v) { yo.set('pais', v); });
      s1.appendChild(el('div', ST.nota, P.marco));
      var MAT = CU.materia(cfg.materia) || {}, sinEdad = MAT.libre && !MAT.edad;
      lbl(s1, 'Materia o colección');
      var sm = el('select', ST.campo), grupos = {};
      CU.MATERIAS.forEach(function (m) { var g = m.grupo || 'Escolar'; (grupos[g] = grupos[g] || []).push(m); });
      Object.keys(grupos).forEach(function (g) {
        var og = document.createElement('optgroup'); og.label = g;
        grupos[g].forEach(function (m) { var op = el('option', '', m.ico + ' ' + CU.nombreMateria(m.id, cfg.pais)); op.value = m.id; if (m.id === cfg.materia) op.selected = true; og.appendChild(op); });
        sm.appendChild(og);
      });
      sm.onchange = function () { yo.set('materia', sm.value); };
      s1.appendChild(sm);
      if (!sinEdad) {
      lbl(s1, 'Etapa');
      chips(s1, CU.NIVELES.map(function (n) { return [n.id, n.ico + ' ' + P.niveles[n.id].n.replace(/\s*\(.*\)$/, '')]; }), cfg.nivel, function (v) { yo.set('nivel', v); });
      lbl(s1, 'Curso');
      sel(s1, P.niveles[cfg.nivel].c.map(function (c, i) { return [i, c.n + ' · ' + CU.BANDAS[c.b].edad]; }), cfg.curso, function (v) { yo.set('curso', +v); });
      }
      lbl(s1, 'Quién lo usa');
      chips(s1, [['docente', 'Docente'], ['alumno', 'Alumno'], ['familia', 'Familia'], ['editorial', 'Editorial']], cfg.usuario, function (v) { yo.set('usuario', v); });

      /* 2 · Qué fabrico */
      var s2 = seccion('Qué fabrico');
      var g2 = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:5px');
      ED.PRODUCTOS.filter(function (p) { return !p.solo || p.solo.indexOf(cfg.materia) >= 0; }).forEach(function (p) {
        var b = el('button', chip(cfg.prod === p.id) + ';border-radius:9px;white-space:normal;line-height:1.3', p.ico + ' ' + p.n);
        b.onclick = function () { yo.set('prod', p.id); };
        g2.appendChild(b);
      });
      s2.appendChild(g2);
      var pr = ED.PRODUCTOS.filter(function (p) { return p.id === cfg.prod; })[0];
      s2.appendChild(el('div', ST.nota, pr ? pr.d : ''));
      (MAT.opciones || []).forEach(function (o) {
        lbl(s2, o.n);
        var val = cfg.op && cfg.op[o.k] != null ? cfg.op[o.k] : o.def;
        var f = el('div', ST.fila);
        o.ops.forEach(function (x) {
          var on = o.tipo === 'multi' ? (val || []).indexOf(x[0]) >= 0 : String(val) === String(x[0]);
          var b = el('button', chip(on), x[1]);
          b.onclick = function () {
            var op = Object.assign({}, yo.cfg.op || {});
            if (o.tipo === 'multi') { var a = (op[o.k] || o.def || []).slice(), i = a.indexOf(x[0]); if (i >= 0) a.splice(i, 1); else a.push(x[0]); op[o.k] = a; }
            else op[o.k] = x[0];
            yo.set('op', op);
          };
          f.appendChild(b);
        });
        s2.appendChild(f);
      });

      /* 3 · Extensión */
      var s3 = seccion('Extensión');
      var fl = el('div', 'display:flex;gap:10px;align-items:center');
      var rg = el('input'); rg.type = 'range'; rg.min = 10; rg.max = 1000; rg.step = 1; rg.value = cfg.paginas; rg.style.cssText = 'flex:1;accent-color:#a855f7';
      var nm = el('input', ST.campo + ';width:64px;text-align:right'); nm.type = 'number'; nm.min = 10; nm.max = 1000; nm.value = cfg.paginas;
      var fija = function (v) { v = Math.max(10, Math.min(1000, Math.round(+v || 10))); rg.value = v; nm.value = v; yo.cfg.paginas = v; yo.guardar(); yo.programar(); };
      rg.oninput = function () { fija(rg.value); }; nm.onchange = function () { fija(nm.value); };
      fl.appendChild(rg); fl.appendChild(nm); fl.appendChild(el('span', 'font-size:11px;color:#94a3b8', 'págs.'));
      s3.appendChild(fl);
      var atajos = el('div', ST.fila + ';margin-top:7px');
      [10, 24, 48, 96, 160, 300, 500, 1000].forEach(function (v) { var b = el('button', chip(cfg.paginas === v), String(v)); b.onclick = function () { fija(v); yo.construirPanel(); }; atajos.appendChild(b); });
      s3.appendChild(atajos);
      if (!(pr && pr.papel)) {
        lbl(s3, 'Papel');
        chips(s3, [['auto', 'Del país (' + (P.papel === 'a4' ? 'A4' : 'Carta') + ')'], ['a4', 'A4'], ['carta', 'Carta']], cfg.papel, function (v) { yo.set('papel', v); });
      }

      /* 4 · Aspecto */
      var s4 = seccion('Plantilla');
      var bnd = CU.banda(cfg.pais, cfg.nivel, cfg.curso), auto = ED.plantillaAuto(bnd, cfg.materia);
      if (window.EU_CONECTORES) EU_CONECTORES.galeria(yo, s4, { el: el, ST: ST, chip: chip });
      else chips(s4, [['auto', 'Según la edad (' + ED.PLANTILLAS[auto].n + ')']].concat(Object.keys(ED.PLANTILLAS).map(function (k) { return [k, ED.PLANTILLAS[k].n]; })), cfg.plantilla, function (v) { yo.set('plantilla', v); });
      var tid = cfg.plantilla === 'auto' ? auto : cfg.plantilla, T = ED.PLANTILLAS[tid];
      var mu = el('div', 'display:flex;gap:10px;align-items:center;margin-top:9px');
      var sw = el('div', 'display:flex;flex:none');
      [T.bg, T.ink, T.acc, T.acc2, T.soft].forEach(function (c) { sw.appendChild(el('span', 'width:16px;height:16px;border-radius:4px;border:1px solid #2d2d4a;background:' + c + ';margin-right:3px')); });
      mu.appendChild(sw); mu.appendChild(el('div', 'font-size:10.5px;color:#94a3b8;line-height:1.45', T.d));
      s4.appendChild(mu);

      /* 5 · Humanizar */
      var s5 = seccion('Voz y apoyos');
      lbl(s5, 'Personaje guía');
      var fg = el('div', 'display:flex;gap:6px;align-items:center');
      var gi = texto(fg, 'guiaN', 'Nombre (por defecto según la edad)'); gi.style.flex = '1';
      s5.appendChild(fg);
      var fg2 = el('div', ST.fila + ';margin-top:6px;align-items:center');
      subir(fg2, '🖼 Imagen del guía', false, function (u) { if (u[0]) { yo.cfg.guiaImg = u[0]; yo.guardarImg(); yo.construirPanel(); yo.generar(); } });
      if (cfg.guiaImg) { var q = el('button', ST.bt, 'Quitar'); q.onclick = function () { yo.cfg.guiaImg = ''; yo.guardarImg(); yo.construirPanel(); yo.generar(); }; fg2.appendChild(q); }
      s5.appendChild(fg2);
      s5.appendChild(el('div', ST.nota, P.vos ? 'Consignas con voseo rioplatense (leé, escribí, pensá).' : cfg.pais === 'es' ? 'Léxico de España (ordenador, aula) y consignas en tú.' : 'Consignas en tú con léxico de ' + P.n + '. Nombres, precios, ríos y fiestas del país.'));
      interruptor(s5, 'facil', 'Lectura fácil', 'Letra más grande, interlineado amplio y menos ejercicios por página.');
      interruptor(s5, 'dislexia', 'Tipografía para dislexia', 'Lexend, fondo crema, más espacio entre letras y palabras.');
      interruptor(s5, 'dua', 'Apoyos DUA', 'Pistas paso a paso bajo los ejercicios que las tienen.');
      if (pr && pr.sol) interruptor(s5, 'solucion', 'Incluir solucionario', cfg.usuario === 'alumno' ? 'En el material del alumno no se incluye.' : 'Al final, con la página de cada respuesta.');

      /* 6 · Datos */
      var s6 = seccion('Datos del documento');
      texto(s6, 'titulo', 'Título (se propone uno solo)');
      var fd = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px');
      texto(fd, 'autor', cfg.prod === 'trabajo' ? 'Docente' : 'Autoría');
      texto(fd, 'centro', 'Centro educativo');
      s6.appendChild(fd);
      if (cfg.prod === 'trabajo') { var al = el('div', 'margin-top:6px'); texto(al, 'alumno', 'Nombre del alumno o alumna'); s6.appendChild(al); }
      if (cfg.prod === 'trabajo' || cfg.prod === 'libro' || cfg.prod === 'ebook') {
        lbl(s6, 'Fuentes (formato APA 7 automático)');
        texto(s6, 'fuentes', 'Autor | Año | Título | Editorial o web | URL\nUna por línea', true);
      }

      /* 7 · Imágenes */
      var s7 = seccion('Imágenes');
      var fi = el('div', ST.fila);
      subir(fi, '🖼 Portada', false, function (u) { if (u[0]) { yo.cfg.portadaImg = u[0]; yo.guardarImg(); yo.generar(); } });
      subir(fi, '🖼 Ilustraciones de unidad', true, function (u) { yo.cfg.imagenes = (yo.cfg.imagenes || []).concat(u); yo.aviso(yo.cfg.imagenes.length + ' ilustraciones: se reparten por las aperturas y ejemplos.'); yo.generar(); });
      s7.appendChild(fi);
      s7.appendChild(el('div', ST.nota, 'Sin imagen, cada hueco queda marcado con lo que debe ir en él. Las ilustraciones de unidad se usan en esta sesión; la portada y el guía se recuerdan en este dispositivo.'));

      if (window.EU_CONECTORES) EU_CONECTORES.panel(yo, seccion, { el: el, ST: ST, chip: chip });

      /* 8 · Salidas */
      var s8 = seccion('Sacar');
      var g8 = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:6px');
      var b8 = function (t, fn, f) { var b = el('button', f ? ST.btF : ST.bt, t); b.onclick = fn; g8.appendChild(b); };
      b8('🖨 Imprimir / PDF', function () { yo.exportar('print'); }, true);
      b8('📱 EPUB', function () { yo.exportar('epub'); });
      b8('🌐 HTML interactivo', function () { yo.exportar('html'); });
      b8('🖥 Diapositivas 16:9', function () { yo.exportar('slides'); });
      if (window.EU_CONECTORES) EU_CONECTORES.salidas(yo, b8);
      b8('🎲 Otra versión', function () { yo.set('semilla', (cfg.semilla || 1) + 1, false); yo.aviso('Nueva versión: mismos contenidos, ejercicios y datos distintos.'); });
      b8('↺ Valores iniciales', function () { var im = { guiaImg: yo.cfg.guiaImg, portadaImg: yo.cfg.portadaImg }; yo.cfg = Object.assign({}, DEF, im, { imagenes: [] }); yo.guardar(); yo.construirPanel(); yo.generar(); });
      s8.appendChild(g8);
      var bh = el('div');
      s8.appendChild(bh);
      if (this._desB) this._desB();
      if (window.B6Bandeja) this._desB = B6Bandeja.panel(bh, { origen: 'editorial' }, 'editorial-escolar');
    }
  }

  window.customElements.define('editorial-escolar', Editorial);
})();
