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

  /* el curso, igual que curso/index.html pero con datos.js y anim.js dentro
     (prepCurso y htmlCurso los usan también las pestañas de «👁 Vista previa») */
  function prepCurso(ed) {
    var CP = window.EU_CURSO_PREMIUM, D = CP.construir(ed.res);
    if (!D.modulos.length) return Promise.reject(new Error('Este libro no tiene unidades para el curso.'));
    ed.aviso('Vista previa del curso: preparando…');
    return (window.EU_CURSO_ANIM ? EU_CURSO_ANIM.enriquecer(D, ed.res, function (t) { ed.aviso(t); }) : Promise.resolve(D))
      .then(function () { return CP.imagenes(D, function (f) { ed.aviso('Vista previa del curso: dibujos ' + Math.round(f * 100) + ' %'); }); })
      .then(function () { return D; });
  }
  function htmlCurso(D) {
    var CP = window.EU_CURSO_PREMIUM;
    var datos = '<script>window.CURSO=' + JSON.stringify(D).replace(/<\//g, '<\\/') + ';<\/script>';
    var anim = D.anim && window.EU_CURSO_ANIM ? '<script>' + EU_CURSO_ANIM.js().replace(/<\//g, '<\\/') + '<\/script>' : '';
    return CP.cursoHTML(D).replace('<script src="datos.js"></script>', function () { return datos; }).replace('<script src="anim.js"></script>', function () { return anim; });
  }
  function curso(ed) {
    var CP = window.EU_CURSO_PREMIUM; if (!CP || !ed.res) return ed.aviso('Arma primero el libro.');
    prepCurso(ed).then(function (D) {
      ventana('curso premium (Hotmart)', urlHTML(htmlCurso(D)), 'Pulsa ▶ Reproducir. Los enlaces a libro y láminas funcionan en la descarga.');
      ed.aviso('Vista previa del curso lista.');
    }).catch(function (e) { ed.aviso(e.message === 'Este libro no tiene unidades para el curso.' ? e.message : 'Vista previa: ' + (e.message || e)); });
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

  /* ─── Fátima, 10-10-2026 · «👁 Vista previa» con pestañas: el mismo libro visto como libro interactivo / ebook interactivo,
     PDF imprimible, libro electrónico (EPUB), curso premium y resumen de la Carpeta HOTMART, antes de descargar nada.
     Los botones de antes siguen igual. ─── */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function mb(n) { return n >= 1048576 ? (n / 1048576).toFixed(1).replace('.', ',') + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB'; }
  /* EPUB: se genera el archivo de verdad y se lee su orden de páginas, para ver exactamente lo que recibe el comprador */
  function htmlEpub(res) {
    var ED = window.EU_EDITORIAL, B = { n: 0, bytes: 0 };
    return ED.epub(res).then(function (blob) { B.bytes = blob.size; return JSZip.loadAsync(blob); }).then(function (z) {
      var urls = {}, tareas = [];
      z.forEach(function (ruta, f) { if (/^OEBPS\/img\//.test(ruta)) tareas.push(f.async('blob').then(function (b) { urls[ruta.slice(6)] = URL.createObjectURL(b); })); });
      return Promise.all(tareas).then(function () { return z.file('OEBPS/content.opf').async('string'); }).then(function (opf) {
        var ids = []; opf.replace(/<itemref idref="([^"]+)"/g, function (m, id) { ids.push(id); });
        B.n = ids.length;
        return Promise.all(ids.map(function (id) { var f = z.file('OEBPS/' + id + '.xhtml'); return f ? f.async('string') : ''; }));
      }).then(function (pags) {
        var cuerpo = pags.map(function (x) {
          var m = /<body[^>]*>([\s\S]*)<\/body>/.exec(x || ''), h = m ? m[1] : '';
          return '<div style="margin:0 auto 18px;width:max-content;max-width:100%;box-shadow:0 6px 24px rgba(0,0,0,.35);background:#fff;overflow:auto">' + h.replace(/src="(img\/[^"]+)"/g, function (m2, r) { return 'src="' + (urls[r] || r) + '"'; }) + '</div>';
        }).join('');
        return '<!DOCTYPE html><meta charset="utf-8"><title>EPUB</title><body style="margin:0;background:#3a3f4b;padding:18px;font-family:system-ui,sans-serif">' +
          '<div style="color:#fff;margin:0 0 14px;font-size:14px">Libro electrónico (EPUB) · ' + B.n + ' páginas · ' + mb(B.bytes) + ' · así lo ve el comprador en su lector (Apple Books, Google Play Libros, etc.)</div>' + cuerpo + '</body>';
      });
    });
  }
  /* resumen de la Carpeta HOTMART: módulos, lecciones, vídeos a grabar, minutos aproximados y, si se pide, archivos y peso exactos */
  function minutos(L) {   /* misma cuenta que el certificado: narración a 14,5 letras/s + 2 s por escena */
    var letras = 0; (L.escenas || []).forEach(function (e) { letras += String(e.texto || '').length + String(e.sol || '').length; });
    return (letras / 14.5 + 2 * (L.escenas || []).length) / 60;
  }
  function resumenHotmart(ed, D, caja) {
    var T = '#16223A', O = '#B08D57', tot = 0, nL = 0, nV = 0, nT = 0;
    var filas = D.modulos.map(function (M, i) {
      var mm = 0, ls = M.lecciones.map(function (L, j) {
        var m = minutos(L); mm += m; nL++; if (L.video) nV++;
        return '<tr><td style="padding:4px 8px;color:#666;white-space:nowrap">M' + String(i + 1).padStart(2, '0') + '-L' + String(j + 1).padStart(2, '0') + '</td><td style="padding:4px 8px">' + esc(L.t) +
          '<div style="font-size:11px;color:#777;max-width:620px">' + esc(String((L.escenas[0] || {}).texto || '').slice(0, 160)) + '</div></td><td style="padding:4px 8px;text-align:center">' + (L.video ? '🎬' : '📄') +
          '</td><td style="padding:4px 8px;text-align:right;white-space:nowrap">' + L.escenas.length + ' esc.</td><td style="padding:4px 8px;text-align:right;white-space:nowrap">' + m.toFixed(1).replace('.', ',') + ' min</td><td style="padding:4px 8px;text-align:right">' + (L.pag || '—') + '</td></tr>';
      }).join('');
      tot += mm; nT += M.test.length;
      return '<tr><td colspan="6" style="padding:10px 8px 4px;font-weight:700;color:' + T + ';border-top:2px solid ' + O + '">Módulo ' + (i + 1) + ' · ' + esc(M.t) + ' <span style="font-weight:400;color:#777">· ' + M.lecciones.length + ' lecciones · ' + Math.round(mm) + ' min · test de ' + M.test.length + ' preguntas</span></td></tr>' + ls;
    }).join('');
    caja.innerHTML = '<div style="background:#fff;border-radius:10px;padding:16px 18px;font:13px system-ui,sans-serif;color:#1f1b18">' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px">' + [['Módulos', D.modulos.length], ['Lecciones', nL], ['Vídeos a grabar', nV], ['Duración aprox.', (tot / 60).toFixed(1).replace('.', ',') + ' h'], ['Preguntas de test', nT], ['Examen final', D.examen.length + ' preg.']].map(function (x) {
        return '<div style="background:' + T + ';color:#fff;border-radius:8px;padding:8px 12px;min-width:110px"><div style="font-size:11px;color:' + O + ';text-transform:uppercase;letter-spacing:.06em">' + x[0] + '</div><div style="font-size:20px;font-weight:700">' + x[1] + '</div></div>';
      }).join('') + '</div>' +
      '<div style="font-size:12px;color:#555;margin-bottom:10px">Cada carpeta de <b>hotmart/</b> es un módulo y cada <b>.txt</b> una lección (título, descripción, página del libro y guion). 🎬 = lección en vídeo (se graba con <b>curso/index.html#grabar</b> y se sube con el mismo nombre M01-L02…). 📄 = lección de lectura. Los minutos son aproximados (la misma cuenta del certificado). Los límites de tamaño y duración de Hotmart consúltalos en su Central de Ayuda: aquí ves tus cifras para compararlas.</div>' +
      '<div style="display:flex;gap:8px;margin-bottom:12px"><button data-vp="peso" style="background:' + T + ';color:#fff;border:0;border-radius:8px;padding:8px 12px;font:600 13px system-ui;cursor:pointer">📦 Ver archivos y peso exacto</button><button data-vp="bajar" style="background:' + O + ';color:#fff;border:0;border-radius:8px;padding:8px 12px;font:600 13px system-ui;cursor:pointer">⬇ Descargar Carpeta HOTMART</button></div>' +
      '<div data-vp="archivos"></div><table style="border-collapse:collapse;width:100%">' + filas + '</table></div>';
    caja.querySelector('[data-vp="bajar"]').onclick = function () { hotmart(ed); };
    caja.querySelector('[data-vp="peso"]').onclick = function () {
      var CP = window.EU_CURSO_PREMIUM, zona = caja.querySelector('[data-vp="archivos"]'); if (!window.JSZip) return ed.aviso('Necesita conexión la primera vez (JSZip).');
      zona.innerHTML = '<div style="padding:8px;color:#555">Armando el paquete para medirlo…</div>';
      CP.paquete(ed.res, function (t) { ed.aviso(t); }).then(function (r) {
        return JSZip.loadAsync(r.blob).then(function (zi) {
          var grupos = {}, tareas = [];
          zi.forEach(function (ruta, f) { if (f.dir) return; tareas.push(f.async('uint8array').then(function (b) { var pa = ruta.split('/'); if (pa.length > 1 && /-premium$/.test(pa[0])) pa.shift(); var g = pa.length > 1 ? pa[0] + '/' : pa[0]; grupos[g] = grupos[g] || { n: 0, b: 0 }; grupos[g].n++; grupos[g].b += b.length; })); });
          return Promise.all(tareas).then(function () {
            zona.innerHTML = '<div style="background:#F6F1E7;border-radius:8px;padding:10px 12px;margin-bottom:12px"><b>' + esc(r.nombre) + '</b> · ' + mb(r.blob.size) + ' comprimido<table style="border-collapse:collapse;margin-top:6px">' +
              Object.keys(grupos).sort().map(function (g) { return '<tr><td style="padding:2px 10px 2px 0">' + esc(g) + '</td><td style="padding:2px 10px;text-align:right">' + grupos[g].n + ' archivos</td><td style="padding:2px 0;text-align:right">' + mb(grupos[g].b) + '</td></tr>'; }).join('') + '</table></div>';
            ed.aviso('Paquete medido: ' + mb(r.blob.size) + '.');
          });
        });
      }).catch(function (e) { zona.innerHTML = '<div style="color:#b00">' + esc(e.message || e) + '</div>'; });
    };
  }
  function todo(ed) {
    var ED = window.EU_EDITORIAL; if (!ED || !ed.res) return ed.aviso('Arma primero el libro.');
    var res = ed.res, urls = [], cache = {}, Dp = null;
    var fondo = document.createElement('div');
    fondo.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(8,8,20,.86);display:flex;flex-direction:column;padding:14px;box-sizing:border-box';
    var cab = document.createElement('div'); cab.style.cssText = 'display:flex;align-items:center;flex-wrap:wrap;gap:8px;color:#fff;font:600 14px system-ui,sans-serif;margin-bottom:8px';
    var t = document.createElement('div'); t.textContent = '👁 Vista previa · ' + (res.C.titulo || '') + ' · ' + res.pages.length + ' págs.'; t.style.cssText = 'flex:1 1 220px';
    var nota = document.createElement('div'); nota.style.cssText = 'flex:1 1 100%;order:3;font-weight:400;font-size:12px;opacity:.8';
    var x = document.createElement('button'); x.textContent = '✕ Cerrar'; x.style.cssText = 'background:#7c3aed;color:#fff;border:0;border-radius:8px;padding:8px 14px;font:700 13px system-ui,sans-serif;cursor:pointer';
    var fr = document.createElement('iframe'); fr.style.cssText = 'flex:1;width:100%;border:0;border-radius:10px;background:#fff';
    var caja = document.createElement('div'); caja.style.cssText = 'flex:1;overflow:auto;display:none';
    var PEST = [
      ['libro', '📱 Libro / Ebook interactivo', 'El mismo HTML que se descarga: respuestas que se comprueban solas, voz y «▶ Ver y escuchar».', function () { return Promise.resolve(urlHTML(ED.documento(res, 'web'))); }],
      ['pdf', '🖨 PDF imprimible', 'Así sale el PDF: en la descarga, ábrelo y elige Imprimir → Guardar como PDF (con «Gráficos de fondo» activado).', function () { return Promise.resolve(urlHTML(ED.documento(res, 'print'))); }],
      ['epub', '📘 Libro electrónico (EPUB)', 'Se genera el EPUB de verdad y se muestra página a página.', function () { if (!window.JSZip) return Promise.reject(new Error('El EPUB necesita conexión la primera vez (JSZip).')); return htmlEpub(res).then(urlHTML); }],
      ['curso', '🎓 Curso premium', 'Pulsa ▶ Reproducir. Los enlaces a libro y láminas funcionan en la descarga.', function () { return curD().then(function (D) { return urlHTML(htmlCurso(D)); }); }],
      ['hotmart', '📦 Carpeta HOTMART', 'Lo que lleva la carpeta para Hotmart, antes de descargarla.', null]
    ];
    /* asesor de precio (b6_asesor_precio.js, Fátima 10-10-2026): pestaña más, solo si el módulo está cargado */
    if (window.EU_ASESOR_PRECIO) PEST.push(['precio', '💰 Asesor de precio', 'Cuánto cobrar por el libro y por el curso, en Hotmart y en Instagram/Facebook, por país (orientativo).', null]);
    function curD() { if (!Dp) Dp = prepCurso(ed); return Dp; }
    var botones = {}, actual = null;
    function abre(k) {
      actual = k;
      var P = PEST.filter(function (p) { return p[0] === k; })[0];
      Object.keys(botones).forEach(function (b) { botones[b].style.background = b === k ? '#B08D57' : '#16223A'; });
      nota.textContent = P[2];
      if (k === 'hotmart' || k === 'precio') {
        fr.style.display = 'none'; caja.style.display = 'block'; caja.innerHTML = '<div style="color:#fff;padding:10px">Preparando el curso…</div>';
        curD().then(function (D) { if (actual !== k) return; if (k === 'precio') window.EU_ASESOR_PRECIO.panel(ed, D, caja); else resumenHotmart(ed, D, caja); }).catch(function (e) { caja.innerHTML = '<div style="color:#fff;padding:10px">' + esc(e.message || e) + '</div>'; });
        return;
      }
      caja.style.display = 'none'; fr.style.display = 'block';
      if (cache[k]) { fr.src = cache[k]; return; }
      fr.src = 'about:blank'; nota.textContent = 'Preparando…';
      P[3]().then(function (u) { urls.push(u); cache[k] = u; if (actual !== k) return; fr.src = u; nota.textContent = P[2]; })
        .catch(function (e) { nota.textContent = 'Vista previa: ' + (e.message || e); });
    }
    PEST.forEach(function (p) {
      var b = document.createElement('button'); b.textContent = p[1];
      b.style.cssText = 'background:#16223A;color:#fff;border:1px solid #B08D57;border-radius:8px;padding:7px 11px;font:600 12.5px system-ui,sans-serif;cursor:pointer';
      b.onclick = function () { abre(p[0]); }; botones[p[0]] = b; cab.appendChild(b);
    });
    function cerrar() { try { fr.contentWindow.speechSynthesis && fr.contentWindow.speechSynthesis.cancel(); } catch (e) { } fondo.remove(); setTimeout(function () { urls.forEach(function (u) { URL.revokeObjectURL(u); }); }, 1000); document.removeEventListener('keydown', tecla); }
    function tecla(e) { if (e.key === 'Escape') cerrar(); }
    x.onclick = cerrar; document.addEventListener('keydown', tecla);
    cab.insertBefore(t, cab.firstChild); cab.appendChild(x); cab.appendChild(nota);
    fondo.appendChild(cab); fondo.appendChild(fr); fondo.appendChild(caja); document.body.appendChild(fondo);
    abre('libro');
  }

  function enganchar() {
    var CN = window.EU_CONECTORES; if (!CN || CN.__vista) return !!CN;
    var s0 = CN.salidas; CN.__vista = true;
    CN.salidas = function (ed, b8) {
      b8('👁 Vista previa · todo (libro, PDF, EPUB, curso, Hotmart)', function () { if (ed.terminarTandas) ed.terminarTandas(); todo(ed); });
      b8('👁 Vista previa · libro interactivo (particular)', function () { if (ed.terminarTandas) ed.terminarTandas(); libro(ed); });
      b8('📦 Carpeta PARTICULAR (libro)', function () { if (ed.terminarTandas) ed.terminarTandas(); particular(ed); });
      b8('👁 Vista previa · curso premium (Hotmart)', function () { if (ed.terminarTandas) ed.terminarTandas(); curso(ed); });
      b8('📦 Carpeta HOTMART (curso)', function () { if (ed.terminarTandas) ed.terminarTandas(); hotmart(ed); });
      return s0.apply(this, arguments);
    };
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  window.EU_VISTA_PREVIA = { libro: libro, curso: curso, hotmart: hotmart, particular: particular, todo: todo, htmlEpub: htmlEpub };
})();
