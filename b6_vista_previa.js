/* b6_vista_previa.js — «👁 Vista previa» en Salidas del Editorial: ver ANTES de descargar
   · el libro interactivo (para particulares): el mismo HTML que va en la descarga (EU_EDITORIAL.documento(res, 'web'));
   · el curso premium (para Hotmart): el mismo reproductor de curso/index.html, con sus datos, sus animaciones de
     diagramación (EU_CURSO_ANIM) y su voz, montado en memoria.
   Se abre en una ventana dentro de la app, con botón para cerrar. No cambia ninguna descarga.
   Además, dos descargas separadas: «📦 Carpeta HOTMART» (el ZIP del curso premium dentro de HOTMART-<título>/) y
   «📦 Carpeta PARTICULAR» (libro interactivo, imprimible y EPUB dentro de PARTICULAR-<título>/).
   Se engancha a EU_CONECTORES.salidas como b6_curso_premium.js. Cargar después de b6_curso_animado.js. */
(function () {
  'use strict';
  if (window.EU_VISTA_PREVIA) return;

  function ventana(titulo, url, aviso) {
    var fondo = document.createElement('div');
    fondo.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,8,20,.82);display:flex;flex-direction:column;padding:14px;box-sizing:border-box';
    var cab = document.createElement('div');
    cab.style.cssText = 'display:flex;align-items:center;gap:10px;color:#fff;font:600 14px system-ui,sans-serif;margin-bottom:8px';
    var t = document.createElement('div'); t.textContent = '👁 Vista previa · ' + titulo; t.style.cssText = 'flex:1';
    var nota = document.createElement('div'); nota.textContent = aviso || ''; nota.style.cssText = 'font-weight:400;font-size:12px;opacity:.75';
    var x = document.createElement('button'); x.textContent = '✕ Cerrar';
    x.style.cssText = 'background:#7c3aed;color:#fff;border:0;border-radius:8px;padding:8px 14px;font:700 13px system-ui,sans-serif;cursor:pointer';
    var fr = document.createElement('iframe'); fr.src = url;
    fr.style.cssText = 'flex:1;width:100%;border:0;border-radius:10px;background:#fff';
    function cerrar() { try { fr.contentWindow.speechSynthesis && fr.contentWindow.speechSynthesis.cancel(); } catch (e) { } fondo.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 1000); document.removeEventListener('keydown', tecla); }
    function tecla(e) { if (e.key === 'Escape') cerrar(); }
    x.onclick = cerrar; document.addEventListener('keydown', tecla);
    cab.appendChild(t); cab.appendChild(nota); cab.appendChild(x);
    fondo.appendChild(cab); fondo.appendChild(fr); document.body.appendChild(fondo);
  }
  function urlHTML(html) { return URL.createObjectURL(new Blob([html], { type: 'text/html' })); }

  function libro(ed) {
    var ED = window.EU_EDITORIAL; if (!ED || !ed.res) return ed.aviso('Arma primero el libro.');
    ventana('libro interactivo', urlHTML(ED.documento(ed.res, 'web')), 'Es el mismo archivo que se descarga.');
  }

  /* el curso, igual que curso/index.html pero con datos.js y anim.js dentro */
  function curso(ed) {
    var CP = window.EU_CURSO_PREMIUM; if (!CP || !ed.res) return ed.aviso('Arma primero el libro.');
    var D = CP.construir(ed.res);
    if (!D.modulos.length) return ed.aviso('Este libro no tiene unidades para el curso.');
    ed.aviso('Vista previa del curso: preparando…');
    (window.EU_CURSO_ANIM ? EU_CURSO_ANIM.enriquecer(D, ed.res, function (t) { ed.aviso(t); }) : Promise.resolve(D))
      .then(function () { return CP.imagenes(D, function (f) { ed.aviso('Vista previa del curso: dibujos ' + Math.round(f * 100) + ' %'); }); })
      .then(function () {
        var datos = '<script>window.CURSO=' + JSON.stringify(D).replace(/<\//g, '<\\/') + ';<\/script>';
        var anim = D.anim && window.EU_CURSO_ANIM ? '<script>' + EU_CURSO_ANIM.js().replace(/<\//g, '<\\/') + '<\/script>' : '';
        var html = CP.cursoHTML(D).replace('<script src="datos.js"></script>', function () { return datos; }).replace('<script src="anim.js"></script>', function () { return anim; });
        ventana('curso premium (Hotmart)', urlHTML(html), 'Pulsa ▶ Reproducir. Los enlaces a libro y láminas funcionan en la descarga.');
        ed.aviso('Vista previa del curso lista.');
      }).catch(function (e) { ed.aviso('Vista previa: ' + (e.message || e)); });
  }

  /* ─── descargas separadas: «Hotmart» (curso premium) y «Particular» (libro), cada una en su propia carpeta ─── */
  function slug(s) { return String(s || 'libro').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'libro'; }
  /* el ZIP del curso premium tal cual, con todo dentro de HOTMART-<título>/ */
  function hotmart(ed) {
    var CP = window.EU_CURSO_PREMIUM; if (!CP || !ed.res) return ed.aviso('Arma primero el libro.');
    if (!window.JSZip) return ed.aviso('La descarga necesita conexión la primera vez (JSZip).');
    var dir = 'HOTMART-' + slug(ed.res.C.titulo) + '/';
    CP.paquete(ed.res, function (t) { ed.aviso(t); }).then(function (r) { return JSZip.loadAsync(r.blob).then(function (zi) {
      var z = new JSZip(), tareas = [];
      zi.forEach(function (ruta, f) { if (!f.dir) tareas.push(f.async('uint8array').then(function (b) { z.file(dir + ruta, b); })); });
      return Promise.all(tareas).then(function () { return z.generateAsync({ type: 'blob' }); }).then(function (b) { ed.bajar(b, 'HOTMART-' + slug(ed.res.C.titulo) + '.zip'); ed.aviso('Carpeta HOTMART descargada: ' + r.D.modulos.length + ' módulos y ' + r.nL + ' lecciones (curso/, hotmart/, libro/, láminas).'); });
    }); }).catch(function (e) { ed.aviso(e.message || String(e)); });
  }
  /* para una persona particular: el libro interactivo, el imprimible (PDF) y el EPUB, en PARTICULAR-<título>/ */
  function particular(ed) {
    var ED = window.EU_EDITORIAL; if (!ED || !ed.res) return ed.aviso('Arma primero el libro.');
    if (!window.JSZip) return ed.aviso('La descarga necesita conexión la primera vez (JSZip).');
    var res = ed.res, C = res.C, dir = 'PARTICULAR-' + slug(C.titulo) + '/', z = new JSZip();
    ed.aviso('Carpeta PARTICULAR: preparando el libro…');
    z.file(dir + '01-libro-interactivo.html', ED.documento(res, 'web'));
    z.file(dir + '02-libro-para-imprimir-o-PDF.html', ED.documento(res, 'print'));
    z.file(dir + 'LEEME.txt', C.titulo + '\n' + res.pages.length + ' páginas\n\n01 · Libro interactivo: ábrelo en el navegador (respuestas que se comprueban solas, voz y animaciones).\n02 · Ábrelo en el navegador y pulsa Imprimir → Guardar como PDF (márgenes: ninguno; gráficos de fondo: activados).\n03 · EPUB para lectores de libros electrónicos.\n');
    (ED.epub ? ED.epub(res).then(function (b) { z.file(dir + '03-libro.epub', b); }, function () { }) : Promise.resolve())
      .then(function () { return z.generateAsync({ type: 'blob' }); })
      .then(function (b) { ed.bajar(b, 'PARTICULAR-' + slug(C.titulo) + '.zip'); ed.aviso('Carpeta PARTICULAR descargada: libro interactivo, imprimible (PDF) y EPUB.'); })
      .catch(function (e) { ed.aviso(e.message || String(e)); });
  }

  function enganchar() {
    var CN = window.EU_CONECTORES; if (!CN || CN.__vista) return !!CN;
    var s0 = CN.salidas; CN.__vista = true;
    CN.salidas = function (ed, b8) {
      b8('👁 Vista previa · libro interactivo (particular)', function () { if (ed.terminarTandas) ed.terminarTandas(); libro(ed); });
      b8('📦 Carpeta PARTICULAR (libro)', function () { if (ed.terminarTandas) ed.terminarTandas(); particular(ed); });
      b8('👁 Vista previa · curso premium (Hotmart)', function () { if (ed.terminarTandas) ed.terminarTandas(); curso(ed); });
      b8('📦 Carpeta HOTMART (curso)', function () { if (ed.terminarTandas) ed.terminarTandas(); hotmart(ed); });
      return s0.apply(this, arguments);
    };
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_VISTA_PREVIA = { libro: libro, curso: curso, hotmart: hotmart, particular: particular };
})();
