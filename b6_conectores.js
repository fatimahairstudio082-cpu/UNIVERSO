/* b6_conectores.js — conectores de libros del Editorial.
   Une los motores que ya existen (editorial, figuras/diagramas, voz, escenas,
   quiz, EPUB, QR) para que cualquier contenido —libro escolar, diccionario,
   recetario, ebook de empresa— salga con:
   · 13 diseños nuevos (seis tomados de los sistemas de diseño del proyecto),
     con galería de ejemplo sobre la portada real;
   · personalización antes de descargar: color, tipografía, efectos, QR;
   · flujo de autorización (borrador → revisión → autorizado con sello y código);
   · productos nuevos: «Libro profesional» (ejecutivo, capítulos, diagramas,
     casos, listas) y «Carrusel 1:1»;
   · salidas nuevas: paquete completo ZIP, curso con tests autocorregibles,
     vídeo 2D / 3D de escenas y carrusel en PNG.
   Se engancha al motor con EU_EDITORIAL.registrar (ajuste + post). */
(function () {
  'use strict';
  if (window.EU_CONECTORES || !window.EU_EDITORIAL) return;
  var ED = window.EU_EDITORIAL, H = ED.H, esc = H.esc, MM = 3.7795;

  /* ─────────── color ─────────── */
  function rgb(c) {
    c = String(c || '#000').replace('#', '');
    if (c.length === 3) c = c.split('').map(function (x) { return x + x; }).join('');
    return [parseInt(c.slice(0, 2), 16) || 0, parseInt(c.slice(2, 4), 16) || 0, parseInt(c.slice(4, 6), 16) || 0];
  }
  function mix(a, b, t) {
    var A = rgb(a), B = rgb(b);
    return '#' + [0, 1, 2].map(function (i) { return Math.round(A[i] + (B[i] - A[i]) * t).toString(16).padStart(2, '0'); }).join('');
  }
  function alfa(c, a) { var A = rgb(c); return 'rgba(' + A[0] + ',' + A[1] + ',' + A[2] + ',' + a + ')'; }
  function oscuro(c) { var A = rgb(c); return (A[0] * 0.299 + A[1] * 0.587 + A[2] * 0.114) < 110; }

  /* ─────────── diseños ─────────── */
  var FUENTES = 'https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700&family=Andika:wght@400;700&family=Cormorant+Garamond:wght@400;600&family=Lora:ital,wght@0,400;0,600;1,400&family=Barlow+Condensed:wght@500;600&family=Barlow:wght@400;600&family=Archivo:wght@400;700;800&family=Inter:wght@400;500&family=Caprasimo&family=Figtree:wght@400;600&family=Public+Sans:wght@400;700&family=DM+Serif+Display&family=DM+Sans:wght@400;700&family=Fredoka:wght@500;600&family=Bangers&family=Comic+Neue:wght@400;700&family=Instrument+Serif&family=Instrument+Sans:wght@400;600&family=Patrick+Hand&display=swap';
  var DIS = {
    prensa: { n: 'Prensa', g: 'autor', d: 'Serifa de periódico, filetes grueso-fino y dos tintas de imprenta. Para ensayo, informes y secundaria.', tit: "'Source Serif 4', Georgia, serif", cuerpo: "'Source Serif 4', Georgia, serif", bg: '#F3F2F2', ink: '#201E1D', acc: '#0088B0', acc2: '#D6006C', soft: '#D9EAF0', soft2: '#F6DCE7', r: 2, peso: 700 },
    clasica: { n: 'Clásica', g: 'autor', d: 'Garamond sobre Lora, marco de filete fino y oro como línea. Para literatura, historia y ediciones de regalo.', tit: "'Cormorant Garamond', Georgia, serif", cuerpo: "'Lora', Georgia, serif", bg: '#F3F2F2', ink: '#201F1D', acc: '#8E6326', acc2: '#6F5A3A', soft: '#EFE5D5', soft2: '#EAE5DD', r: 4, peso: 600 },
    plano: { n: 'Plano técnico', g: 'pro', d: 'Condensada, retícula y marcas de registro en las esquinas. Para manuales, FP, ingeniería y procesos.', tit: "'Barlow Condensed', sans-serif", cuerpo: "'Barlow', sans-serif", bg: '#F2F2F3', ink: '#1D1F20', acc: '#4B6F93', acc2: '#3D5A78', soft: '#DEE6EE', soft2: '#E6EAF0', r: 0, peso: 600, reticula: true },
    suizo: { n: 'Suizo', g: 'pro', d: 'Archivo, filetes de 2 px, esquinas rectas y un rojo como única tinta. Para empresa, diseño y carruseles.', tit: "'Archivo', sans-serif", cuerpo: "'Archivo', sans-serif", bg: '#F3F2F2', ink: '#201E1D', acc: '#D42A0F', acc2: '#201E1D', soft: '#FBDAD3', soft2: '#E6E4E3', r: 0, peso: 800 },
    nocturno: { n: 'Nocturno', g: 'autor', d: 'Fondo oscuro azulado y un acento lavanda como luz. Pensado para pantalla: ebooks, presentaciones y vídeo.', tit: "'Inter', sans-serif", cuerpo: "'Inter', sans-serif", bg: '#161826', ink: '#E9E9ED', acc: '#9184D9', acc2: '#B9B0EC', soft: '#262A40', soft2: '#23263A', r: 8, peso: 500 },
    organico: { n: 'Orgánico', g: 'autor', d: 'Crema y arena, terracota y salvia, formas redondas. Para bienestar, cocina, familia y educación infantil.', tit: "'Caprasimo', Georgia, serif", cuerpo: "'Figtree', sans-serif", bg: '#F5EAD8', ink: '#201E1D', acc: '#B0612D', acc2: '#6A7A50', soft: '#F0D5C1', soft2: '#DDE2D0', r: 16, peso: 400 },
    corporativo: { n: 'Corporativo', g: 'pro', d: 'Sans neutra, banda lateral de marca y tablas limpias. Para ebooks de empresa, formación interna y catálogos.', tit: "'Public Sans', sans-serif", cuerpo: "'Public Sans', sans-serif", bg: '#FFFFFF', ink: '#14213D', acc: '#0B5CAB', acc2: '#0F7A6C', soft: '#E3EEFA', soft2: '#DDF1EE', r: 6, peso: 700 },
    informe: { n: 'Informe ejecutivo', g: 'pro', d: 'Titulares en serifa, texto en sans, franja superior granate. Para memorias, informes y planes de negocio.', tit: "'Source Serif 4', Georgia, serif", cuerpo: "'Public Sans', sans-serif", bg: '#FBFBF9', ink: '#1B1B1B', acc: '#7A1F2B', acc2: '#2C4A6B', soft: '#F2E3E5', soft2: '#E2E9F1', r: 2, peso: 700 },
    revista: { n: 'Revista', g: 'pro', d: 'Display de revista, cifras grandes y color vivo. Para divulgación, anuarios y guías.', tit: "'DM Serif Display', Georgia, serif", cuerpo: "'DM Sans', sans-serif", bg: '#FFFDF8', ink: '#121212', acc: '#D14A22', acc2: '#2A6F97', soft: '#FDE3D9', soft2: '#DCEBF3', r: 0, peso: 400 },
    cuento: { n: 'Cuento', g: 'escolar', d: 'Letra redonda y amable, estrellas en los márgenes, colores de acuarela. Para cuentos y lectura de 3 a 8 años.', tit: "'Fredoka', 'Andika', sans-serif", cuerpo: "'Andika', sans-serif", bg: '#FFF9F0', ink: '#3B2A4A', acc: '#E8603F', acc2: '#2F8F8A', soft: '#FFE2D6', soft2: '#D6F1EE', r: 22, peso: 600 },
    comic: { n: 'Cómic', g: 'escolar', d: 'Rótulo de viñeta, borde grueso y trama de puntos. Para lectura, historia y proyectos de primaria.', tit: "'Bangers', 'Comic Neue', sans-serif", cuerpo: "'Comic Neue', sans-serif", bg: '#FFFEF5', ink: '#111111', acc: '#D62839', acc2: '#1D70B8', soft: '#FFE0E3', soft2: '#DCEBF8', r: 4, peso: 400 },
    minimal: { n: 'Mínimo', g: 'pro', d: 'Una serifa, una sans, tinta negra y mucho aire. Para libros de autor, porfolios y guías premium.', tit: "'Instrument Serif', Georgia, serif", cuerpo: "'Instrument Sans', sans-serif", bg: '#FFFFFF', ink: '#111111', acc: '#111111', acc2: '#6B6B6B', soft: '#EEEEEE', soft2: '#F4F4F4', r: 0, peso: 400 },
    acuarela: { n: 'Acuarela', g: 'escolar', d: 'Manchas de acuarela en las esquinas, letra redonda y colores suaves. Para cuentos y libros de colorear.', tit: "'Fredoka', 'Andika', sans-serif", cuerpo: "'Andika', sans-serif", bg: '#FFFDF9', ink: '#34304A', acc: '#D0607A', acc2: '#3F8CA6', soft: '#FBE3E7', soft2: '#DCEFF4', r: 18, peso: 600 },
    ceras: { n: 'Ceras', g: 'escolar', d: 'Borde dibujado a mano, letra de pizarra y colores de cera. Para pasatiempos y cuadernos de 4 a 9 años.', tit: "'Patrick Hand', 'Andika', sans-serif", cuerpo: "'Andika', sans-serif", bg: '#FFFEF8', ink: '#2B2B2B', acc: '#E0483F', acc2: '#1F6F95', soft: '#FDE2E1', soft2: '#DDEFF6', r: 10, peso: 400 },
    arcoiris: { n: 'Arcoíris', g: 'escolar', d: 'Arcoíris en la portada y franja de colores en cada página. Para infantil y primeros cursos.', tit: "'Baloo 2', 'Andika', sans-serif", cuerpo: "'Andika', sans-serif", bg: '#FFFFFF', ink: '#262338', acc: '#6C4AB6', acc2: '#C27803', soft: '#ECE6F7', soft2: '#FDEFD6', r: 14, peso: 700 },
    pizarra: { n: 'Pizarra', g: 'escolar', d: 'Verde de pizarra, tiza clara y marco de madera. Para proyectar en clase y láminas de aula.', tit: "'Patrick Hand', 'Andika', sans-serif", cuerpo: "'Patrick Hand', 'Andika', sans-serif", bg: '#1F3A33', ink: '#F2EFE6', acc: '#F6D365', acc2: '#9AD1C4', soft: '#2B4A42', soft2: '#294640', r: 6, peso: 400 }
  };
  var GRUPOS = [['escolar', 'Escolar e infantil'], ['pro', 'Profesional y empresa'], ['autor', 'Editorial de autor']];
  var GRUPO_BASE = { juego: 'escolar', cuaderno: 'escolar', editorial: 'autor', tecnica: 'pro', sobria: 'autor', lexico: 'escolar', cocina: 'autor' };

  var LETRAS = {
    plantilla: { n: 'La del diseño' },
    libro: { n: 'Serifa de libro', tit: "'Source Serif 4', Georgia, serif", cuerpo: "'Source Serif 4', Georgia, serif" },
    garamond: { n: 'Garamond + Lora', tit: "'Cormorant Garamond', Georgia, serif", cuerpo: "'Lora', Georgia, serif" },
    grotesca: { n: 'Grotesca (Archivo)', tit: "'Archivo', sans-serif", cuerpo: "'Archivo', sans-serif" },
    condensada: { n: 'Condensada (Barlow)', tit: "'Barlow Condensed', sans-serif", cuerpo: "'Barlow', sans-serif" },
    redonda: { n: 'Redonda infantil', tit: "'Fredoka', sans-serif", cuerpo: "'Andika', sans-serif" },
    escolar: { n: 'Escolar (Andika)', tit: "'Andika', sans-serif", cuerpo: "'Andika', sans-serif" },
    lectura: { n: 'Lectura fácil (Lexend)', tit: "'Lexend', sans-serif", cuerpo: "'Lexend', sans-serif" }
  };
  var PALETAS = [['', '', 'Del diseño'], ['#0088B0', '#D6006C', 'Imprenta'], ['#8E6326', '#6F5A3A', 'Oro viejo'], ['#4B6F93', '#3D5A78', 'Acero'], ['#D42A0F', '#201E1D', 'Rojo suizo'], ['#B0612D', '#6A7A50', 'Terracota'], ['#2F63C7', '#B7791F', 'Escolar'], ['#1E8C80', '#E0582A', 'Juego'], ['#0B5CAB', '#0F7A6C', 'Marca']];
  var EFECTOS = [['marco', 'Marco'], ['esquinas', 'Marcas de corte'], ['banda', 'Banda de color'], ['degradado', 'Degradado superior'], ['textura', 'Papel con grano'], ['sombra', 'Sombra en imágenes'],
    ['estrellas', 'Estrellas en el borde'], ['confeti', 'Confeti'], ['arcoiris', 'Franja arcoíris'], ['nubes', 'Nubes al pie'], ['washi', 'Cinta adhesiva'], ['lunares', 'Borde de lunares']];
  var ARCO = ['#E74C3C', '#F08A24', '#F7C948', '#22A06B', '#3B82F6', '#8E5CC8'];
  var ACAB0 = { acc: '', acc2: '', letra: 'plantilla', efectos: [], qr: 'no', qrUrl: '', qrTxt: 'Escanea y sigue en el móvil', estado: 'libre', por: '', cargo: '', entidad: '', fecha: '' };
  function acab(cfg) { return Object.assign({}, ACAB0, (cfg && cfg.acab) || {}); }

  /* ─────────── QR síncrono (qrcodejs dibuja en un canvas) ─────────── */
  var QRC = {};
  function qr(t) {
    if (QRC[t]) return QRC[t];
    if (!window.QRCode) return '';
    /* qrcodejs calcula mal la longitud con UTF-8: el texto va en ASCII. */
    var uri = function (s) { try { return encodeURI(decodeURI(s)); } catch (e) { return encodeURI(s); } };
    var a = /^https?:/i.test(t) ? uri(t) : String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/·/g, '-').replace(/[^\x20-\x7E]/g, '');
    var d = document.createElement('div'), u = '', hecho = false;
    [QRCode.CorrectLevel.M, QRCode.CorrectLevel.L].forEach(function (lv) {
      if (hecho) return; d.textContent = '';
      try { new QRCode(d, { text: a, width: 256, height: 256, colorDark: '#111111', colorLight: '#ffffff', correctLevel: lv }); hecho = true; } catch (e) { }
    });
    if (!hecho) return '';
    var cv = d.querySelector('canvas');
    try { u = cv ? cv.toDataURL('image/png') : ''; } catch (e) { }
    if (!u) { var im = d.querySelector('img'); u = im && /^data:/.test(im.src || '') ? im.src : ''; }
    if (u) QRC[t] = u;
    return u;
  }

  /* ─────────── autorización ─────────── */
  function codigo(C, ctx) {
    var A = C.acab || acab(C.cfg), s = H.hash(C.titulo + '|' + A.por + '|' + A.fecha + '|' + (ctx && ctx.pages ? ctx.pages.length : 0)).toString(36).toUpperCase().padStart(8, '0').slice(-8);
    return s.slice(0, 4) + '-' + s.slice(4);
  }
  function fechaLoc(iso, C) { try { return new Date(iso + 'T12:00:00').toLocaleDateString(C.P.loc || 'es-ES', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return iso; } }
  function sello(C, ctx) {
    var A = C.acab, T = C.T;
    return '<div style="border:0.4mm solid ' + T.acc + ';border-radius:' + T.r + 'px;padding:4mm 5mm;background:' + T.bg + ';font-size:.85em;line-height:1.45;color:' + T.ink + '">' +
      '<div style="font-size:.78em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + '">Material autorizado</div>' +
      '<div style="margin-top:1mm"><b>' + esc(A.por || 'Sin firmar') + '</b>' + (A.cargo ? ', ' + esc(A.cargo) : '') + (A.entidad ? ' · ' + esc(A.entidad) : '') + '</div>' +
      '<div style="opacity:.8">' + (A.fecha ? 'Fecha: ' + esc(fechaLoc(A.fecha, C)) + ' · ' : '') + 'Código de verificación: <span style="font-variant-numeric:tabular-nums;letter-spacing:.05em">' + codigo(C, ctx) + '</span></div></div>';
  }

  /* ─────────── decoración propia de cada diseño ─────────── */
  var ABS = 'position:absolute;pointer-events:none;';
  function marcas(c, d, l) {
    return [['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(function (p) {
      return '<div style="' + ABS + p[0] + ':' + d + 'mm;' + p[1] + ':' + d + 'mm;width:' + l + 'mm;height:' + l + 'mm;margin-' + p[0] + ':-' + l / 2 + 'mm;margin-' + p[1] + ':-' + l / 2 + 'mm">' +
        '<div style="position:absolute;left:50%;top:0;bottom:0;border-left:0.25mm solid ' + c + '"></div><div style="position:absolute;top:50%;left:0;right:0;border-top:0.25mm solid ' + c + '"></div></div>';
    }).join('');
  }
  function deco(C, pg) {
    var T = C.T, id = T.id, cub = /^(portada|contra|pro_capitulo|car_portada|car_cierre)$/.test(pg.tipo), s = '';
    if (id === 'plano') s += marcas(T.acc, 8, 5);
    if (id === 'pizarra') s += '<div style="' + ABS + 'inset:0;border:5mm solid #7A5230;box-shadow:inset 0 0 0 0.6mm #5C3D22"></div>';
    if (id === 'comic') s += '<div style="' + ABS + 'inset:6mm;border:1mm solid ' + T.ink + '"></div>';
    if (id === 'ceras') s += '<div style="' + ABS + 'inset:6mm;border:0.9mm solid ' + T.acc + ';border-radius:255px 18px 225px 18px/18px 225px 18px 255px;opacity:.75"></div>';
    if (id === 'arcoiris') s += '<div style="' + ABS + 'left:0;right:0;top:0;height:3mm;display:flex">' + ARCO.map(function (c) { return '<div style="flex:1;background:' + c + '"></div>'; }).join('') + '</div>';
    if (id === 'acuarela') s += '<div style="' + ABS + 'right:-14mm;bottom:-14mm;width:46mm;height:46mm;border-radius:50%;background:' + T.soft2 + ';filter:blur(4mm);opacity:.9"></div>';
    if (!cub) return s;
    if (id === 'acuarela') s += '<div style="' + ABS + 'left:-20mm;top:-20mm;width:90mm;height:80mm;border-radius:50%;background:' + T.soft + ';filter:blur(6mm)"></div><div style="' + ABS + 'right:10mm;top:30mm;width:40mm;height:40mm;border-radius:50%;background:' + T.soft2 + ';filter:blur(5mm)"></div>';
    if (id === 'arcoiris') s += '<div style="' + ABS + 'left:50%;bottom:-70mm;width:170mm;height:170mm;margin-left:-85mm;border-radius:50%;box-shadow:' + ARCO.map(function (c, i) { return '0 0 0 ' + (i + 1) * 4 + 'mm ' + c; }).join(',') + ';opacity:.85"></div>';
    if (id === 'prensa') s += '<div style="' + ABS + 'left:17mm;right:17mm;top:9mm;border-top:1.2mm solid ' + T.ink + '"></div><div style="' + ABS + 'left:17mm;right:17mm;top:11.6mm;border-top:0.3mm solid ' + T.ink + '"></div>';
    else if (id === 'clasica') s += '<div style="' + ABS + 'inset:8mm;border:0.25mm solid ' + T.acc + '"></div><div style="' + ABS + 'inset:9.4mm;border:0.15mm solid ' + T.acc + '"></div>';
    else if (id === 'suizo') s += '<div style="' + ABS + 'left:0;top:0;width:14mm;height:14mm;background:' + T.acc + '"></div><div style="' + ABS + 'left:17mm;right:17mm;top:10mm;border-top:0.6mm solid ' + T.ink + '"></div>';
    else if (id === 'nocturno') s += '<div style="' + ABS + 'left:17mm;right:17mm;top:10mm;height:0.4mm;background:linear-gradient(90deg,transparent,' + T.acc + ',transparent);box-shadow:0 0 4mm ' + alfa(T.acc, .6) + '"></div>';
    else if (id === 'organico') s += '<div style="' + ABS + 'right:-26mm;top:-26mm;width:72mm;height:72mm;border-radius:50%;background:' + T.soft + ';mix-blend-mode:multiply;opacity:.8"></div><div style="' + ABS + 'left:-18mm;bottom:-18mm;width:52mm;height:52mm;border-radius:50%;background:' + T.soft2 + ';mix-blend-mode:multiply;opacity:.9"></div>';
    else if (id === 'corporativo') s += '<div style="' + ABS + 'left:0;top:0;bottom:0;width:8mm;background:' + T.acc + '"></div><div style="' + ABS + 'left:8mm;top:0;bottom:0;width:1.2mm;background:' + T.acc2 + '"></div>';
    else if (id === 'informe') s += '<div style="' + ABS + 'left:0;right:0;top:0;height:5mm;background:' + T.acc + '"></div>';
    else if (id === 'revista') s += '<div style="' + ABS + 'left:0;right:0;bottom:0;height:6mm;background:' + T.acc + '"></div>';
    else if (id === 'cuento') s += [[6, 8, 'acc', 7], [11, 88, 'acc2', 5], [4, 60, 'acc', 4], [93, 12, 'acc2', 6], [90, 70, 'acc', 5]].map(function (e) {
      return '<div style="' + ABS + 'left:' + e[0] + '%;top:' + e[1] + '%;font-size:' + e[3] + 'mm;line-height:1;color:' + T[e[2]] + '">★</div>';
    }).join('');
    else if (id === 'comic') s += '<div style="' + ABS + 'right:6mm;top:6mm;width:60mm;height:40mm;background-image:radial-gradient(' + T.acc + ' 0.6mm,transparent 0.7mm);background-size:2.6mm 2.6mm;opacity:.35"></div>';
    return s;
  }

  /* ─────────── ganchos del motor ─────────── */
  function ajuste(C) {
    var A = acab(C.cfg), T = C.T;
    if (A.acc) { T.acc = A.acc; T.soft = mix(A.acc, T.bg, oscuro(T.bg) ? .78 : .86); }
    if (A.acc2) { T.acc2 = A.acc2; T.soft2 = mix(A.acc2, T.bg, oscuro(T.bg) ? .78 : .86); }
    var L = LETRAS[A.letra];
    if (L && L.tit && !C.cfg.dislexia) { T.tit = L.tit; T.cuerpo = L.cuerpo; }
    if (C.papelId === 'cuadrado') C.fs = C.peque ? 26 : 22;
    C.acab = A;
  }
  var APERTURAS = /^(apertura|s_titulo|pro_capitulo|car_titulo|dic_tema|t_portada|ud_portada)$/;
  function post(h, pg, C, modo, ctx) {
    var A = C.acab || acab(C.cfg), T = C.T, W = C.papel.w, ef = A.efectos || [], s = deco(C, pg);
    if (ef.indexOf('sombra') >= 0) h = h.replace(/<img ([^>]*?)style="/g, '<img $1style="box-shadow:0 2.5mm 6mm rgba(0,0,0,.28);').replace(/<svg ([^>]*?)style="/g, '<svg $1style="filter:drop-shadow(0 1.2mm 1.6mm rgba(0,0,0,.16));');
    if (ef.indexOf('degradado') >= 0) s += '<div style="' + ABS + 'left:0;right:0;top:0;height:42mm;background:linear-gradient(180deg,' + alfa(T.acc, .16) + ',' + alfa(T.acc, 0) + ')"></div>';
    if (ef.indexOf('textura') >= 0) s += '<div style="' + ABS + 'inset:0;background-image:radial-gradient(' + alfa(oscuro(T.bg) ? '#ffffff' : '#000000', .07) + ' 0.18mm,transparent 0.25mm);background-size:1.6mm 1.6mm"></div>';
    if (ef.indexOf('marco') >= 0) s += '<div style="' + ABS + 'inset:7mm;border:0.35mm solid ' + T.acc + ';border-radius:' + Math.min(T.r, 10) + 'px"></div>';
    if (ef.indexOf('esquinas') >= 0) s += marcas(T.ink, 5, 4);
    var Wp = C.papel.w, Hp = C.papel.h, rr = H.rng(pg.num * 7919 + 13);
    if (ef.indexOf('estrellas') >= 0) { for (var ex = 10; ex < Wp - 6; ex += 18) s += '<div style="' + ABS + 'left:' + ex + 'mm;top:3mm;font-size:5mm;line-height:1;color:' + (ex % 36 < 18 ? T.acc : T.acc2) + ';opacity:.55">★</div><div style="' + ABS + 'left:' + ex + 'mm;bottom:3mm;font-size:5mm;line-height:1;color:' + (ex % 36 < 18 ? T.acc2 : T.acc) + ';opacity:.55">★</div>'; }
    if (ef.indexOf('confeti') >= 0) { for (var ci = 0; ci < 26; ci++) { var cy = ci % 2 ? rr() * 12 + 2 : Hp - 14 + rr() * 11; s += '<div style="' + ABS + 'left:' + (rr() * (Wp - 6)).toFixed(1) + 'mm;top:' + cy.toFixed(1) + 'mm;width:' + (1.5 + rr() * 2).toFixed(1) + 'mm;height:' + (1 + rr() * 1.5).toFixed(1) + 'mm;background:' + ARCO[ci % 6] + ';transform:rotate(' + Math.round(rr() * 180) + 'deg);border-radius:' + (ci % 3 ? 0 : 99) + 'px;opacity:.8"></div>'; } }
    if (ef.indexOf('arcoiris') >= 0) s += '<div style="' + ABS + 'left:0;right:0;bottom:0;height:2.4mm;display:flex">' + ARCO.map(function (c) { return '<div style="flex:1;background:' + c + '"></div>'; }).join('') + '</div>';
    if (ef.indexOf('nubes') >= 0) s += '<div style="' + ABS + 'left:0;right:0;bottom:-10mm;height:22mm">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<div style="position:absolute;left:' + (i * Wp / 6 - 16) + 'mm;bottom:0;width:' + (30 + (i % 3) * 8) + 'mm;height:' + (18 + (i % 2) * 6) + 'mm;border-radius:50%;background:' + T.soft2 + '"></div>'; }).join('') + '</div>';
    if (ef.indexOf('washi') >= 0) s += '<div style="' + ABS + 'left:-6mm;top:8mm;width:42mm;height:9mm;background:' + alfa(T.acc, .35) + ';transform:rotate(-35deg)"></div><div style="' + ABS + 'right:-6mm;top:8mm;width:42mm;height:9mm;background:' + alfa(T.acc2, .35) + ';transform:rotate(35deg)"></div>';
    if (ef.indexOf('lunares') >= 0) { var dots = 'background-image:radial-gradient(' + T.acc + ' 0.9mm,transparent 1mm);background-size:6mm 6mm;opacity:.35;'; s += '<div style="' + ABS + dots + 'left:0;right:0;top:0;height:6mm"></div><div style="' + ABS + dots + 'left:0;right:0;bottom:0;height:6mm"></div><div style="' + ABS + dots + 'left:0;top:6mm;bottom:6mm;width:6mm"></div><div style="' + ABS + dots + 'right:0;top:6mm;bottom:6mm;width:6mm"></div>'; }
    if (ef.indexOf('banda') >= 0) s += '<div style="' + ABS + 'top:0;bottom:0;' + (pg.num % 2 ? 'right' : 'left') + ':0;width:4mm;background:' + T.acc + '"></div>';
    /* QR */
    var cub = pg.tipo === 'portada' || pg.tipo === 'contra' || pg.tipo === 'car_portada' || pg.tipo === 'car_cierre';
    var poner = A.qr === 'todas' || (A.qr === 'portada' && cub) || (A.qr === 'unidades' && (cub || APERTURAS.test(pg.tipo)));
    if (poner) {
      var base = (A.qrUrl || '').trim(), txt = base ? (cub ? base : base + (base.indexOf('#') >= 0 ? '' : '#') + (A.qr === 'unidades' ? 'u' + (pg.n || 1) : 'p' + pg.num)) : C.titulo + ' · página ' + pg.num;
      var img = qr(txt), grande = cub, l = grande ? 24 : 12;
      if (img) s += '<div style="position:absolute;top:' + (grande ? 8 : 2.5) + 'mm;right:' + (grande ? 8 : 3) + 'mm;background:#fff;padding:' + (grande ? 2 : 1) + 'mm;border-radius:' + Math.min(T.r, 6) + 'px;display:flex;flex-direction:column;align-items:center;gap:1mm;max-width:' + (l + 10) + 'mm">' +
        '<img src="' + img + '" alt="QR" style="width:' + l + 'mm;height:' + l + 'mm;display:block;image-rendering:pixelated"/>' +
        (grande && A.qrTxt ? '<div style="font:600 2.4mm/1.2 sans-serif;color:#111;text-align:center">' + esc(A.qrTxt) + '</div>' : '') + '</div>';
    }
    /* autorización */
    if (A.estado === 'borrador' || A.estado === 'revision') {
      s += '<div style="' + ABS + 'inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden"><div style="transform:rotate(-32deg);font:800 ' + (W * 0.1) + 'mm/1 sans-serif;letter-spacing:.06em;color:' + (A.estado === 'borrador' ? '#C0392B' : '#B7791F') + ';opacity:.1;white-space:nowrap">' + (A.estado === 'borrador' ? 'BORRADOR' : 'EN REVISIÓN') + '</div></div>';
    }
    if (A.estado === 'autorizado') {
      var tiene = ctx && ctx.pages && ctx.pages.some(function (p) { return p.tipo === 'creditos'; });
      if (pg.tipo === 'creditos' || (!tiene && (pg.tipo === 'contra' || pg.tipo === 'car_cierre'))) s += '<div style="position:absolute;left:17mm;right:17mm;bottom:24mm">' + sello(C, ctx) + '</div>';
    }
    return h + s;
  }

  /* ─────────── páginas: libro profesional ─────────── */
  function kicker(C, t, col) { return '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + (col || C.T.acc) + ';margin:0 0 2mm">' + t + '</div>'; }
  function S(C, t) { return H.sub(t, C); }
  function claves(u, C) { return (u.k || []).map(function (x) { return S(C, x); }); }
  function diagramas(u, C) {
    var k = claves(u, C), t = S(C, u.t), out = [];
    if (u.f) out.push({ f: u.f, n: 'Esquema del tema', c: 'Resume el capítulo de un vistazo. Vuelve a él antes de cada repaso.' });
    if (k.length >= 3) {
      out.push({ f: { t: 'mapa', c: t, r: k.slice(0, 6) }, n: 'Mapa de conceptos', c: 'En el centro, el tema; alrededor, los conceptos que lo sostienen. Lee cada rama como una frase: «' + t + ' incluye…».' });
      out.push({ f: { t: 'flujo', p: k.slice(0, 5) }, n: 'Secuencia de trabajo', c: 'De izquierda a derecha, el orden en que conviene estudiar o aplicar cada concepto.' });
      out.push({ f: { t: 'ciclo', p: k.slice(0, 4) }, n: 'Ciclo de mejora', c: 'Cada concepto alimenta al siguiente. Al cerrar la vuelta se empieza de nuevo con más experiencia.' });
    }
    return out;
  }
  var paginas = {
    pro_ejecutivo: function (pg, C, modo, ctx) {
      var T = C.T, caps = (ctx && ctx.pages || []).filter(function (p) { return p.tipo === 'pro_capitulo'; });
      return H.cabecera(C, pg) + H.h1(C, 'Resumen ejecutivo') +
        '<p style="max-width:150mm">' + esc('Este libro reúne ' + caps.length + (caps.length === 1 ? ' capítulo' : ' capítulos') + ' sobre ' + C.matN.replace(/^.*·\s*/, '').toLowerCase() + '. Cada capítulo abre con sus ideas clave, las explica, las lleva a un diagrama y termina con un caso práctico y una lista de comprobación.') + '</p>' +
        '<div style="display:flex;flex-direction:column;gap:4mm;margin-top:6mm">' + caps.map(function (p) {
          return '<div style="display:grid;grid-template-columns:16mm minmax(0,1fr) 10mm;gap:4mm;align-items:baseline;padding-bottom:3mm;border-bottom:1px solid ' + T.soft + '">' +
            '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:1.8em;color:' + T.acc + ';line-height:1">' + String(p.n).padStart(2, '0') + '</div>' +
            '<div><b style="font-family:' + T.tit + ';font-size:1.1em">' + esc(S(C, p.u.t)) + '</b><div style="font-size:.88em;opacity:.8;margin-top:1mm">' + esc(S(C, (p.u.i || [])[0] || '')) + '</div></div>' +
            '<div style="text-align:right;font-variant-numeric:tabular-nums;opacity:.7">' + p.num + '</div></div>';
        }).join('') + '</div>' + H.folio(C, pg);
    },
    pro_capitulo: function (pg, C) {
      var T = C.T, u = pg.u, im = C.cfg.imagenes || [];
      return '<div style="margin-top:14mm">' + kicker(C, 'Capítulo ' + pg.n) + '</div>' +
        '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 7) + 'px;line-height:.9;color:' + T.acc + ';margin:0 0 4mm">' + String(pg.n).padStart(2, '0') + '</div>' +
        H.h1(C, esc(S(C, u.t)), 'font-size:' + (C.fs * 2.6) + 'px;max-width:160mm') +
        '<p style="max-width:145mm;font-size:1.1em;opacity:.85;margin:0 0 7mm">' + esc(S(C, (u.i || [])[0] || '')) + '</p>' +
        H.marcoImagen(C, 'Imagen de apertura: ' + S(C, u.t), 72, im.length ? im[(pg.n - 1) % im.length] : '') + H.chipsClave(C, u) + H.folio(C, pg);
    },
    pro_texto: function (pg, C) {
      var T = C.T, u = pg.u, ideas = (u.i || []).map(function (x) { return S(C, x); });
      return H.cabecera(C, pg) + H.h1(C, 'Ideas principales') +
        (ideas[0] ? '<div style="font-family:' + T.tit + ';font-size:1.45em;line-height:1.3;font-style:italic;color:' + T.acc + ';border-top:0.5mm solid ' + T.acc + ';padding-top:3mm;margin:0 0 6mm;max-width:150mm">' + esc(ideas[0]) + '</div>' : '') +
        ideas.map(function (x, i) { return '<div style="display:grid;grid-template-columns:9mm minmax(0,1fr);gap:3mm;margin:0 0 4mm"><b style="color:' + T.acc + ';font-variant-numeric:tabular-nums">' + (i + 1) + '.</b><p style="margin:0">' + esc(x) + '</p></div>'; }).join('') +
        H.h2(C, 'Conceptos que debes dominar') + H.chipsClave(C, u) + H.folio(C, pg);
    },
    pro_diagrama: function (pg, C) {
      var u = pg.u, L = diagramas(u, C), d = L[pg.k % Math.max(1, L.length)];
      if (!d) return paginas.pro_notas(pg, C);
      return H.cabecera(C, pg) + kicker(C, 'Diagrama') + H.h1(C, esc(d.n)) +
        '<div style="margin:4mm 0 6mm">' + H.figura(d.f, C) + '</div>' +
        H.h2(C, 'Cómo leerlo') + '<p style="max-width:150mm">' + esc(d.c) + '</p>' +
        H.h2(C, 'Tu versión') + '<p style="font-size:.9em;opacity:.8;margin:0 0 3mm">Redibújalo con tus palabras o añade un ejemplo de tu entorno.</p>' + H.lineas(5, C) + H.folio(C, pg);
    },
    pro_caso: function (pg, C) {
      var T = C.T, u = pg.u, r = H.rng(H.hash(u.id + 'caso') + C.semilla), nom = H.pick(r, C.P.nombres || ['Ana']), k = claves(u, C);
      return H.cabecera(C, pg) + kicker(C, 'Caso práctico') + H.h1(C, esc(S(C, u.t)) + ' en la práctica') +
        '<div style="background:' + T.soft + ';border-radius:' + T.r + 'px;padding:6mm 7mm;margin:0 0 6mm">' + kicker(C, 'Situación', T.ink) +
        '<p style="margin:0 0 2mm">' + esc(nom + ' tiene que aplicar «' + S(C, u.t) + '» en una situación real. Conoce la teoría, pero necesita decidir por dónde empezar y cómo comprobar que lo ha hecho bien.') + '</p>' +
        (k.length ? '<p style="margin:0">' + esc('Cuenta con: ' + k.slice(0, 3).join(', ') + '.') + '</p>' : '') + '</div>' +
        H.h2(C, 'Preguntas') + (u.q || []).slice(0, 3).map(function (q, i) { return '<div style="margin:0 0 4mm"><b style="color:' + T.acc + '">' + (i + 1) + '.</b> ' + esc(S(C, q)) + H.lineas(3, C) + '</div>'; }).join('') +
        H.h2(C, 'Tu decisión') + H.lineas(4, C) + H.folio(C, pg);
    },
    pro_claves: function (pg, C) {
      var T = C.T, u = pg.u, k = claves(u, C);
      return H.cabecera(C, pg) + kicker(C, 'Cierre del capítulo ' + pg.n) + H.h1(C, 'Lista de comprobación') +
        k.map(function (x) { return '<div style="display:flex;gap:4mm;align-items:flex-start;margin:0 0 4mm"><span style="flex:none;width:5mm;height:5mm;border:0.4mm solid ' + T.ink + ';border-radius:' + Math.min(T.r, 3) + 'px;margin-top:.6mm"></span><span>' + esc('Sé explicar con mis palabras qué es «' + x + '» y dar un ejemplo.') + '</span></div>'; }).join('') +
        H.h2(C, 'El capítulo en una frase') + H.lineas(3, C) + H.h2(C, 'Lo que aplicaré primero') + H.lineas(3, C) + H.folio(C, pg);
    },
    pro_notas: function (pg, C) {
      var T = C.T;
      return H.cabecera(C, pg) + H.h1(C, 'Notas', 'font-size:' + (C.fs * 1.6) + 'px') +
        '<div style="height:' + (C.papel.h - 80) + 'mm;background-image:radial-gradient(' + alfa(T.ink, .35) + ' 0.3mm,transparent 0.35mm);background-size:5mm 5mm"></div>' + H.folio(C, pg);
    },
    /* carrusel 1:1 */
    car_portada: function (pg, C, modo, ctx) {
      var T = C.T;
      return '<div style="height:100%;display:flex;flex-direction:column;justify-content:space-between">' + kicker(C, esc(C.matN.replace(/^.*·\s*/, '')) + (C.libre ? '' : ' · ' + esc(C.cursoN))) +
        '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 3.4) + 'px;line-height:1;color:' + T.ink + ';text-wrap:balance;max-width:92%">' + esc(C.titulo) + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline;font-size:1.05em"><span>' + esc(C.cfg.autor || '') + '</span><b style="color:' + T.acc + '">Desliza →</b></div></div>';
    },
    car_titulo: function (pg, C, modo, ctx) {
      var T = C.T;
      return '<div style="height:100%;display:flex;flex-direction:column;justify-content:center">' + kicker(C, 'Tema ' + pg.n) +
        '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 2.8) + 'px;line-height:1.05;color:' + T.ink + ';text-wrap:balance">' + esc(S(C, pg.u.t)) + '</div></div>' + contador(pg, C, ctx);
    },
    car_idea: function (pg, C, modo, ctx) {
      var T = C.T, u = pg.u;
      return '<div style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:6mm">' +
        '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 4) + 'px;line-height:.8;color:' + T.acc + '">' + (pg.k + 1) + '</div>' +
        '<div style="font-size:' + (C.fs * 1.6) + 'px;line-height:1.3;max-width:94%;text-wrap:pretty">' + esc(S(C, (u.i || [])[pg.k] || '')) + '</div>' +
        '<div style="font-size:.9em;opacity:.75">' + esc(S(C, u.t)) + '</div></div>' + contador(pg, C, ctx);
    },
    car_diagrama: function (pg, C, modo, ctx) {
      var L = diagramas(pg.u, C), d = L[pg.k % Math.max(1, L.length)];
      return kicker(C, d ? d.n : 'Esquema') + '<div style="font-family:' + C.T.tit + ';font-weight:' + C.T.peso + ';font-size:' + (C.fs * 1.6) + 'px;line-height:1.1;margin:0 0 8mm">' + esc(S(C, pg.u.t)) + '</div>' + (d ? H.figura(d.f, C) : '') + contador(pg, C, ctx);
    },
    car_dato: function (pg, C, modo, ctx) {
      var T = C.T;
      return kicker(C, 'Palabras clave') + '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 1.6) + 'px;line-height:1.1;margin:0 0 10mm">' + esc(S(C, pg.u.t)) + '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:4mm">' + claves(pg.u, C).map(function (k) { return '<span style="border:0.5mm solid ' + T.acc + ';color:' + T.acc + ';border-radius:' + (T.r ? 99 : 0) + 'px;padding:2mm 6mm;font-size:1.2em">' + esc(k) + '</span>'; }).join('') + '</div>' + contador(pg, C, ctx);
    },
    car_pregunta: function (pg, C, modo, ctx) {
      var T = C.T;
      return '<div style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:6mm">' + kicker(C, 'Pregunta') +
        '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 2) + 'px;line-height:1.15;text-wrap:balance">' + esc(S(C, (pg.u.q || [])[0] || '')) + '</div>' +
        '<div style="font-size:1em;color:' + T.acc2 + '">Responde en los comentarios.</div></div>' + contador(pg, C, ctx);
    },
    car_cierre: function (pg, C) {
      var T = C.T;
      return '<div style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:6mm">' +
        '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 2.6) + 'px;line-height:1.05">¿Te ha servido?<br/>Guárdalo y compártelo.</div>' +
        '<div style="font-size:1.1em;opacity:.8">' + esc(C.titulo) + (C.cfg.autor ? ' · ' + esc(C.cfg.autor) : '') + '</div></div>';
    }
  };
  function contador(pg, C, ctx) { return '<div style="position:absolute;right:17mm;bottom:10mm;font-size:.85em;opacity:.7;font-variant-numeric:tabular-nums">' + pg.num + ' / ' + (ctx && ctx.pages ? ctx.pages.length : '') + '</div>'; }

  function armarPro(C, pool, N, r) {
    var k = Math.max(1, Math.min(pool.length, Math.floor((N - 5) / 5))), units = pool.slice(0, k), core = [];
    units.forEach(function (u, i) {
      var n = i + 1;
      core.push({ tipo: 'pro_capitulo', u: u, n: n, indice: S(C, u.t), indiceN: 'Capítulo ' + n });
      core.push({ tipo: 'pro_texto', u: u, n: n });
      core.push({ tipo: 'pro_diagrama', u: u, n: n, k: 0 });
      core.push({ tipo: 'pro_caso', u: u, n: n });
      core.push({ tipo: 'pro_claves', u: u, n: n });
    });
    return H.envolver(C, core, N, function (i) {
      var u = units[i % units.length], n = units.indexOf(u) + 1, kk = Math.floor(i / units.length) + 1, idx = -1;
      var pz = kk % 3 === 2 ? { tipo: 'pro_notas', u: u, n: n, relleno: true } : { tipo: 'pro_diagrama', u: u, n: n, k: kk, relleno: true };
      for (var z = 0; z < core.length; z++) if (core[z].u === u && core[z].tipo !== 'pro_claves') idx = z;
      core.splice(idx + 1, 0, pz);
      return [];
    }, { intro: { tipo: 'pro_ejecutivo', indice: 'Resumen ejecutivo' }, indiceFilas: units.length + 2 });
  }
  function armarCarrusel(C, pool, N) {
    var out = [{ tipo: 'car_portada' }], ronda = 0;
    while (out.length < N - 1 && ronda < N * 2) {
      pool.forEach(function (u, i) {
        var n = i + 1;
        if (ronda === 0) {
          out.push({ tipo: 'car_titulo', u: u, n: n });
          (u.i || []).forEach(function (x, j) { out.push({ tipo: 'car_idea', u: u, n: n, k: j }); });
          out.push({ tipo: 'car_diagrama', u: u, n: n, k: 0 });
          if (u.q && u.q[0]) out.push({ tipo: 'car_pregunta', u: u, n: n });
        } else out.push(ronda % 2 ? { tipo: 'car_dato', u: u, n: n } : { tipo: 'car_diagrama', u: u, n: n, k: ronda });
      });
      ronda++;
    }
    out = out.slice(0, N - 1);
    out.push({ tipo: 'car_cierre' });
    return out;
  }

  ED.PAPEL.cuadrado = { w: 285.75, h: 285.75, n: 'Carrusel 1:1 (1080 px)' };
  ED.registrar({
    productos: [
      { id: 'libro_pro', n: 'Libro profesional', ico: '📘', d: 'Ebook o libro impreso de empresa o de autor: resumen ejecutivo, capítulos, diagramas, casos prácticos, listas de comprobación y notas. Sirve con cualquier materia.', sol: false, armar: armarPro, titulo: function (C) { return C.matN.replace(/^.*·\s*/, '') + ': guía profesional'; } },
      { id: 'carrusel', n: 'Carrusel 1:1', ico: '🎠', d: 'Tarjetas cuadradas de 1080 px para redes o aula: portada, una idea por tarjeta, diagramas, preguntas y cierre. Salen en PNG, PDF o vídeo.', sol: false, papel: 'cuadrado', armar: armarCarrusel, titulo: function (C) { return 'Lo esencial de ' + C.matN.replace(/^.*·\s*/, '').toLowerCase(); } }
    ],
    plantillas: DIS,
    paginas: paginas,
    fuentes: FUENTES,
    ajuste: ajuste,
    post: post,
    voz: {
      pro_texto: function (pg, C) { return (pg.u.i || []).map(function (x) { return S(C, x); }).join(' '); },
      pro_capitulo: function (pg, C) { return 'Capítulo ' + pg.n + '. ' + S(C, pg.u.t) + '.'; },
      car_idea: function (pg, C) { return S(C, (pg.u.i || [])[pg.k] || ''); },
      car_titulo: function (pg, C) { return 'Tema ' + pg.n + '. ' + S(C, pg.u.t); },
      car_pregunta: function (pg, C) { return S(C, (pg.u.q || [])[0] || ''); }
    },
    escenas: {
      pro_capitulo: function (pg, C) { return { k: 'titulo', n: pg.n, t: S(C, pg.u.t), s: 'Capítulo ' + pg.n }; },
      pro_texto: function (pg, C) { return (pg.u.i || []).map(function (x) { return { k: 'idea', t: S(C, x), s: S(C, pg.u.t) }; }); },
      pro_claves: function (pg, C) { return { k: 'lista', t: 'Para dominar · ' + S(C, pg.u.t), l: claves(pg.u, C) }; },
      pro_caso: function (pg, C) { var q = (pg.u.q || [])[0]; return q ? { k: 'pregunta', t: S(C, q), s: '' } : null; },
      car_portada: function (pg, C) { return { k: 'portada', t: C.titulo, s: C.matN }; },
      car_titulo: function (pg, C) { return { k: 'titulo', n: pg.n, t: S(C, pg.u.t), s: 'Tema ' + pg.n }; },
      car_idea: function (pg, C) { return { k: 'idea', t: S(C, (pg.u.i || [])[pg.k] || ''), s: S(C, pg.u.t) }; },
      car_pregunta: function (pg, C) { return { k: 'pregunta', t: S(C, (pg.u.q || [])[0] || ''), s: '' }; },
      car_dato: function (pg, C) { return { k: 'lista', t: S(C, pg.u.t), l: claves(pg.u, C) }; },
      car_cierre: function (pg, C) { return { k: 'cierre', t: C.titulo, s: C.cfg.autor || '' }; }
    }
  });

  /* ─────────── salidas ─────────── */
  function variante(cfg, prod, pags) {
    var c = Object.assign({}, cfg, { prod: prod, paginas: pags });
    try { return ED.ensamblar(c); } catch (e) { console.warn(prod, e); return null; }
  }
  function slug(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'libro'; }

  /* Página HTML → PNG con foreignObject (las fuentes web caen a las del sistema). */
  function png(html, w, h, esc2) {
    return new Promise(function (ok) {
      var d = new DOMParser().parseFromString('<body>' + html + '</body>', 'text/html'), xs = new XMLSerializer().serializeToString(d.body.firstChild);
      var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><foreignObject width="100%" height="100%">' + xs + '</foreignObject></svg>';
      var im = new Image();
      im.onload = function () {
        try {
          var c = document.createElement('canvas'); c.width = Math.round(w * esc2); c.height = Math.round(h * esc2);
          var x = c.getContext('2d'); x.scale(esc2, esc2); x.drawImage(im, 0, 0);
          c.toBlob(function (b) { ok(b); }, 'image/png');
        } catch (e) { ok(null); }
      };
      im.onerror = function () { ok(null); };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }
  function pngs(res, prog) {
    var C = res.C, w = C.papel.w * MM, h = C.papel.h * MM, esc2 = C.papelId === 'cuadrado' ? 1 : 1.5, out = [], i = 0;
    var paso = function () {
      if (i >= res.pages.length) return Promise.resolve(out);
      var pg = res.pages[i];
      return png('<div xmlns="http://www.w3.org/1999/xhtml">' + ED.paginaHTML(pg, C, 'print', res) + '</div>', w, h, esc2).then(function (b) { out.push(b); i++; if (prog) prog(i / res.pages.length); return paso(); });
    };
    return paso();
  }

  /* Curso: página por unidad + test autocorregible + panel de progreso. */
  /* Curso: un solo index.html con todos los tests dentro (navegación por #, nunca sale de la página) + test-NN.html sueltos + lección por unidad. */
  function testSeccion(C, u, items, n, suelto) {
    var T = C.T, nn = String(n).padStart(2, '0');
    var qs = items.map(function (x, i) {
      var id = 't' + nn + 'q' + i, r;
      if (x.tipo === 'vf') r = ['V', 'F'].map(function (v) { return '<label><input type="radio" name="' + id + '" value="' + v + '"> ' + (v === 'V' ? 'Verdadero' : 'Falso') + '</label>'; }).join(' ');
      else if (x.tipo === 'mc') r = (x.o || []).map(function (o, k) { return '<label style="display:block;margin:4px 0"><input type="radio" name="' + id + '" value="' + k + '"> ' + esc(o) + '</label>'; }).join('');
      else r = '<input name="' + id + '" autocomplete="off" style="font:inherit;padding:6px 8px;border:1px solid ' + T.ink + ';border-radius:4px;width:60%">';
      var sol = x.tipo === 'mc' ? String(x.c) : x.tipo === 'vf' ? x.s : (x.ac || [x.s]).join('|');
      var ver = x.tipo === 'mc' ? (x.o || [])[x.c] : x.tipo === 'vf' ? (x.s === 'V' ? 'Verdadero' : 'Falso') : x.s;
      return '<div class="q" data-t="' + x.tipo + '" data-s="' + esc(sol) + '" data-v="' + esc(ver) + '" style="margin:0 0 22px"><p style="margin:0 0 6px"><b style="color:' + T.acc + '">' + (i + 1) + '.</b> ' + x.e + '</p>' + r + '<div class="fb" style="font-size:.9em;margin-top:4px"></div></div>';
    }).join('');
    var volver = suelto ? '<a href="index.html#inicio">← Volver al curso</a>' : '<a href="#inicio">← Volver al curso</a>';
    return '<section class="tst" id="test-' + nn + '" data-u="' + esc(u.id) + '"' + (suelto ? '' : ' hidden') + '>' + volver + '<div style="margin-top:24px;font-size:.8em;letter-spacing:.14em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">Test ' + n + '</div><h1>' + esc(S(C, u.t)) + '</h1>' + qs +
      '<div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap"><button class="ok">Comprobar</button><b class="res"></b>' + volver.replace('<a ', '<a style="margin-left:auto" ') + '</div></section>';
  }
  function cursoJS(C, clave) {
    return '<script>(function(){var K=' + JSON.stringify(clave) + ';function n(s){return String(s).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[\\s.,;:()$€¡!¿?]/g,"").replace(/^x=/,"")}' +
      'function leer(){try{return JSON.parse(localStorage.getItem(K)||"{}")}catch(e){return {}}}' +
      'document.querySelectorAll(".tst .ok").forEach(function(btn){btn.onclick=function(){var sec=btn.closest(".tst"),b=0,t=0;sec.querySelectorAll(".q").forEach(function(q){t++;var tp=q.dataset.t,s=q.dataset.s,v,ok;' +
      'if(tp==="mc"||tp==="vf"){var c=q.querySelector("input:checked");v=c?c.value:null;ok=v===s}else{v=q.querySelector("input").value;ok=s.split("|").some(function(a){return n(a)===n(v)})}' +
      'if(ok)b++;var f=q.querySelector(".fb");f.textContent=ok?"Bien":"Respuesta: "+q.dataset.v;f.style.color=ok?"#1a8f4c":"#c0392b"});' +
      'var nota=Math.round(b/t*100),u=sec.dataset.u;sec.querySelector(".res").textContent=b+" de "+t+" · "+nota+" %";' +
      'try{var p=leer(),o=p[u]||{};p[u]={nota:nota,mejor:Math.max(nota,o.mejor||0),fecha:new Date().toISOString().slice(0,10),intentos:(o.intentos||0)+1};localStorage.setItem(K,JSON.stringify(p))}catch(e){}' +
      'if(window.speechSynthesis){var m=new SpeechSynthesisUtterance(b===t?"¡Todo bien!":"Llevas "+b+" de "+t+".");m.lang="' + C.P.lang + '";speechSynthesis.cancel();speechSynthesis.speak(m)}}});' +
      'function progreso(){var ix=document.getElementById("inicio");if(!ix)return;var p=leer(),h=0,s=0,c=0;ix.querySelectorAll(".u").forEach(function(u){c++;var r=p[u.dataset.id];if(!r)return;h++;s+=r.mejor;u.querySelector("i").style.width=r.mejor+"%";u.querySelector(".p").textContent="Mejor nota "+r.mejor+" % · "+r.intentos+" intento(s) · "+r.fecha});document.getElementById("tot").textContent=h+" de "+c+" unidades trabajadas"+(h?" · media "+Math.round(s/h)+" %":"")}' +
      'function ver(){var ix=document.getElementById("inicio");if(!ix)return;var h=(location.hash||"").slice(1),t=h&&document.getElementById(h);if(!t||!t.classList.contains("tst"))t=null;ix.hidden=!!t;document.querySelectorAll(".tst").forEach(function(s){s.hidden=s!==t});progreso();window.scrollTo(0,0)}' +
      'window.addEventListener("hashchange",ver);window.addEventListener("pageshow",ver);ver()})();<\/script>';
  }
  function cabeza(C, tit) {
    var T = C.T;
    return '<!DOCTYPE html><html lang="' + C.P.lang + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(tit) + '</title><link rel="stylesheet" href="' + ED.FUENTES + '"><link rel="stylesheet" href="' + FUENTES + '">' +
      '<style>body{margin:0;background:' + T.bg + ';color:' + T.ink + ';font-family:' + T.cuerpo + ';font-size:17px;line-height:1.5}main{max-width:820px;margin:0 auto;padding:40px 24px}h1{font-family:' + T.tit + ';font-weight:' + T.peso + ';line-height:1.1}#inicio h1{font-size:2.4em;margin:0 0 8px}a{color:' + T.acc + '}button{font:inherit;font-weight:700;padding:10px 18px;border-radius:6px;border:0;background:' + T.acc + ';color:#fff;cursor:pointer}[hidden]{display:none!important}.u{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:16px;align-items:center;padding:16px 0;border-bottom:1px solid ' + T.soft + '}.b{height:8px;background:' + T.soft + ';border-radius:99px;overflow:hidden;margin-top:6px}.b i{display:block;height:100%;background:' + T.acc + '}</style></head><body><main>';
  }
  function testHTML(C, u, items, n, clave) { return cabeza(C, 'Test ' + n + ' · ' + S(C, u.t)) + testSeccion(C, u, items, n, true) + '</main>' + cursoJS(C, clave) + '</body></html>'; }
  function indiceCurso(C, filas, clave, secciones) {
    var T = C.T;
    return cabeza(C, C.titulo + ' · curso') + '<div id="inicio"><div style="font-size:.8em;letter-spacing:.14em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">Curso · ' + esc(C.matN) + '</div><h1>' + esc(C.titulo) + '</h1><p id="tot" style="opacity:.8"></p>' +
      filas.map(function (f) { return '<div class="u" data-id="' + esc(f.id) + '"><b style="font-family:' + T.tit + ';font-size:1.6em;color:' + T.acc + '">' + String(f.n).padStart(2, '0') + '</b><div><b>' + esc(f.t) + '</b><div class="b"><i style="width:0"></i></div><small class="p" style="opacity:.75">Sin empezar</small></div><div style="display:flex;gap:14px">' + (f.lec ? '<a href="' + f.lec + '">Lección</a>' : '') + '<a href="#' + f.test.replace('.html', '') + '">Test</a></div></div>'; }).join('') +
      '</div>' + (secciones || '') + '</main>' + cursoJS(C, clave) + '</body></html>';
  }
  function conVolver(html, T) {
    var barra = '<div style="position:sticky;top:0;z-index:50;padding:10px 16px;background:' + T.bg + ';border-bottom:1px solid ' + T.soft + ';font:600 15px/1.2 sans-serif"><a href="index.html#inicio" style="color:' + T.acc + '">← Volver al curso</a></div>';
    return String(html).replace(/<body([^>]*)>/i, function (m) { return m + barra; });
  }
  function curso(res, z, dir) {
    var C = res.C, clave = 'eu_curso_' + slug(C.titulo), filas = [], secs = '';
    res.unidades.forEach(function (u, i) {
      var n = String(i + 1).padStart(2, '0'), pags = res.pages.filter(function (p) { return p.u === u; }), lec = '';
      if (pags.length) { lec = 'unidad-' + n + '.html'; z.file(dir + lec, conVolver(ED.documento({ C: C, pages: pags }, 'web', S(C, u.t)), C.T)); }
      var q = ED.quiz(res, u.id, 10, C.semilla);
      z.file(dir + 'test-' + n + '.html', testHTML(C, u, q.items, i + 1, clave));
      secs += testSeccion(C, u, q.items, i + 1, false);
      filas.push({ id: u.id, n: i + 1, t: S(C, u.t), lec: lec, test: 'test-' + n + '.html' });
    });
    z.file(dir + 'index.html', indiceCurso(C, filas, clave, secs));
  }
  function guion(res) {
    var E = ED.escenas(res).lista;
    return E.map(function (e, i) { return (i + 1) + '. [' + e.k + '] ' + (e.s ? e.s + ' — ' : '') + e.t + (e.l ? '\n   · ' + e.l.map(function (x) { return typeof x === 'string' ? x : x.c + ': ' + x.t; }).join('\n   · ') : ''); }).join('\n\n');
  }
  function paquete(res, cfg, opc, aviso) {
    if (!window.JSZip) return Promise.reject(new Error('El paquete necesita conexión la primera vez (JSZip).'));
    var C = res.C, z = new JSZip(), nombre = slug(C.titulo), N = res.pages.length, hecho = [];
    z.file('01-libro-para-imprimir-o-PDF.html', ED.documento(res, 'print')); hecho.push('libro imprimible');
    z.file('02-libro-interactivo.html', ED.documento(res, 'web')); hecho.push('HTML interactivo');
    if (opc.pres !== false) { var pr = variante(cfg, 'presentacion', Math.min(60, Math.max(10, Math.round(N / 2)))); if (pr) { z.file('04-presentacion-16x9.html', ED.documento(pr, 'web')); hecho.push('presentación'); } }
    var car = cfg.prod === 'carrusel' ? res : variante(cfg, 'carrusel', Math.min(30, Math.max(10, Math.round(N / 3))));
    if (car) { z.file('05-carrusel/carrusel.html', ED.documento(car, 'web')); hecho.push('carrusel'); }
    var lam = variante(cfg, 'laminas', Math.min(24, Math.max(10, Math.round(N / 4)))); if (lam) { z.file('06-laminas-para-imprimir.html', ED.documento(lam, 'print')); hecho.push('láminas'); }
    var ex = variante(cfg, 'examen', 9); if (ex) { z.file('07-examen-y-solucionario.html', ED.documento(ex, 'print')); hecho.push('examen'); }
    try { curso(res, z, '08-curso/'); hecho.push('curso con tests'); } catch (e) { console.warn(e); }
    z.file('09-guion-del-video.txt', guion(res));
    if (C.mat === 'idiomas' && window.EU_IDIOMAS) {
      var L = ['es', 'en', 'fr', 'de', 'gsw'], csv = [L.join(';') + ';tema'];
      EU_IDIOMAS.TEMAS.forEach(function (t) { t.pal.forEach(function (p) { csv.push(L.map(function (l) { return '"' + String(p[l]).replace(/"/g, '""') + '"'; }).join(';') + ';' + t.id); }); });
      z.file('10-vocabulario-tarjetas.csv', '\ufeff' + csv.join('\n')); hecho.push('vocabulario CSV');
    }
    var A = acab(cfg);
    z.file('LEEME.txt', C.titulo + '\n' + C.matN + (C.libre ? '' : ' · ' + C.cursoN) + ' · ' + (C.P.n || '') + '\n' + N + ' páginas · ' + C.papel.n + ' · diseño ' + (ED.PLANTILLAS[C.T.id] || {}).n + '\n' +
      (A.estado === 'autorizado' ? 'Autorizado por ' + (A.por || '—') + (A.cargo ? ', ' + A.cargo : '') + ' · ' + (A.fecha || '') + ' · código ' + codigo(C, res) + '\n' : A.estado !== 'libre' ? 'Estado: ' + A.estado + ' (lleva marca de agua)\n' : '') +
      '\nQué hay dentro\n01 · Ábrelo en el navegador y pulsa Imprimir → Guardar como PDF (márgenes: ninguno, gráficos de fondo: activados).\n02 · Libro con respuestas que se comprueban solas y botón de escuchar.\n03 · EPUB de maquetación fija para lectores de ebooks.\n04 · Presentación 16:9 con los mismos contenidos.\n05 · Carrusel 1:1 para redes o aula.\n06 · Láminas para el aula.\n07 · Examen con solucionario.\n08 · Curso: abre index.html; cada unidad tiene lección y test, y el índice guarda el progreso en este navegador.\n09 · Guion escena a escena para grabar o narrar el vídeo.\n' + (opc.video ? '10 · Vídeos 2D y 3D de las escenas del libro (sin sonido; el guion 09 sirve para narrarlos). Formato MP4 si el navegador lo graba; si no, WebM, que abre VLC o cualquier navegador.\n' : ''));
    if (aviso) aviso('Armando el paquete: ' + hecho.join(', ') + '…');
    return ED.epub(res).then(function (b) { z.file('03-libro.epub', b); }, function () { }).then(function () {
      if (!opc.png || !car) return;
      return pngs(car, function (f) { if (aviso) aviso('Carrusel en PNG: ' + Math.round(f * 100) + ' %'); }).then(function (bs) {
        bs.forEach(function (b, i) { if (b) z.file('05-carrusel/' + String(i + 1).padStart(2, '0') + '.png', b); });
      });
    }).then(function () {
      if (!opc.video || !window.MediaRecorder) return;
      var uno = function (modo) {
        return video(res, modo, function (f) { if (aviso) aviso('Grabando el vídeo ' + modo.toUpperCase() + ' para el paquete: ' + Math.round(f * 100) + ' %. Deja esta pestaña visible hasta que termine.'); })
          .then(function (r) { z.file('10-video-' + modo + '.' + r.ext, r.blob); hecho.push('vídeo ' + modo.toUpperCase() + ' (' + r.ext.toUpperCase() + ')'); }, function (e) { console.warn('vídeo', modo, e); });
      };
      return uno('2d').then(function () { return uno('3d'); });
    }).then(function () {
      /* módulos que añaden carpetas propias al paquete (p. ej. b6_pelu_tecnica.js → 11-fichas-tecnicas/) */
      (window.EU_PAQUETE_EXTRA || []).forEach(function (fn) { try { fn(z, res, hecho, cfg); } catch (e) { console.warn('paquete extra', e); } });
    }).then(function () { if (aviso) aviso('Comprimiendo el paquete…'); return z.generateAsync({ type: 'blob' }); }).then(function (b) { return { blob: b, nombre: 'paquete-' + nombre + '.zip', hecho: hecho }; });
  }

  /* Vídeo 2D / 3D de las escenas del libro (canvas + MediaRecorder, sin audio). */
  function envolverTexto(x, t, X, Y, w, lh, max) {
    var pal = String(t || '').split(/\s+/), linea = '', n = 0;
    for (var i = 0; i < pal.length; i++) {
      var prueba = linea ? linea + ' ' + pal[i] : pal[i];
      if (x.measureText(prueba).width > w && linea) { x.fillText(linea, X, Y); Y += lh; linea = pal[i]; if (++n >= (max || 9) - 1) { linea = pal.slice(i).join(' '); if (x.measureText(linea).width > w) { while (linea && x.measureText(linea + '…').width > w) linea = linea.slice(0, -1); linea += '…'; } break; } }
      else linea = prueba;
    }
    if (linea) { x.fillText(linea, X, Y); Y += lh; }
    return Y;
  }
  function escena(x, e, X, Y, w, h, T, f) {
    var tf = T.tit, bf = T.cuerpo, p = T.peso || 700;
    x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    var kick = function (t, y) { x.fillStyle = T.acc; x.font = '700 22px ' + bf; x.fillText(String(t || '').toUpperCase(), X, y); };
    x.fillStyle = T.ink;
    if (e.k === 'portada' || e.k === 'cierre') { kick(e.s, Y + 30); x.fillStyle = T.ink; x.font = p + ' 68px ' + tf; envolverTexto(x, e.t, X, Y + 130, w, 76, 4); }
    else if (e.k === 'titulo') { x.fillStyle = T.acc; x.font = p + ' 150px ' + tf; x.fillText(String(e.n || '').padStart(2, '0'), X, Y + 140); kick(e.s, Y + 190); x.fillStyle = T.ink; x.font = p + ' 56px ' + tf; envolverTexto(x, e.t, X, Y + 260, w, 64, 3); }
    else if (e.k === 'idea') { kick(e.s, Y + 30); x.fillStyle = T.ink; x.font = '400 40px ' + bf; envolverTexto(x, e.t, X, Y + 100, w, 54, 7); }
    else if (e.k === 'lista') { x.font = p + ' 44px ' + tf; var yy = envolverTexto(x, e.t, X, Y + 50, w, 52, 2) + 16; x.font = '400 30px ' + bf; (e.l || []).slice(0, 7).forEach(function (it, i) { if (f < 0.12 + i * 0.07) return; x.fillStyle = T.acc; x.fillRect(X, yy - 12, 12, 12); x.fillStyle = T.ink; yy = envolverTexto(x, typeof it === 'string' ? it : it.t, X + 28, yy, w - 28, 38, 2) + 6; }); }
    else if (e.k === 'pregunta') { kick('Pregunta', Y + 30); x.fillStyle = T.ink; x.font = p + ' 44px ' + tf; var y2 = envolverTexto(x, e.t, X, Y + 100, w, 54, 5); if (e.s && f > 0.55) { x.fillStyle = T.acc2; x.font = '700 32px ' + bf; envolverTexto(x, 'Respuesta: ' + e.s, X, y2 + 40, w, 40, 2); } }
    else if (e.k === 'palabra') { x.font = p + ' 84px ' + tf; x.fillText(e.t, X, Y + 90); var y3 = Y + 160; (e.l || []).forEach(function (it, i) { if (f < 0.1 + i * 0.12) return; x.fillStyle = it.col || T.acc; x.fillRect(X, y3 - 30, 64, 40); x.fillStyle = '#fff'; x.font = '700 22px ' + bf; x.fillText(it.c, X + 12, y3 - 3); x.fillStyle = T.ink; x.font = '400 34px ' + bf; x.fillText(it.t, X + 84, y3); y3 += 58; }); }
  }
  function video(res, modo, prog) {
    return new Promise(function (ok, ko) {
      if (!window.MediaRecorder) return ko(new Error('Este navegador no graba vídeo.'));
      var E = ED.escenas(res, 40).lista, T = res.C.T, W = 1280, Hh = 720, cv = document.createElement('canvas');
      if (!E.length) return ko(new Error('No hay escenas que grabar.'));
      cv.width = W; cv.height = Hh;
      var x = cv.getContext('2d'), mime = ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].filter(function (m) { return MediaRecorder.isTypeSupported(m); })[0];
      var rec; try { rec = new MediaRecorder(cv.captureStream(30), mime ? { mimeType: mime, videoBitsPerSecond: 6000000 } : undefined); } catch (e) { return ko(e); }
      var tr = []; rec.ondataavailable = function (e) { if (e.data && e.data.size) tr.push(e.data); };
      rec.onstop = function () { ok({ blob: new Blob(tr, { type: (mime || 'video/webm').split(';')[0] }), ext: /mp4/.test(mime || '') ? 'mp4' : 'webm' }); };
      var DUR = 3600, total = E.length * DUR, t0 = performance.now(), tarjeta = oscuro(T.bg) ? mix(T.bg, '#ffffff', .08) : '#ffffff';
      var ease = function (t) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); };
      var cuadro = function (i, f) {
        var e = E[i], ent = ease(f / 0.2), sal = f > 0.88 ? 1 - (f - 0.88) / 0.12 : 1;
        x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = T.bg; x.fillRect(0, 0, W, Hh);
        if (modo === '3d') {
          for (var j = 0; j < 7; j++) {
            var vel = 30 + j * 22, px = ((j * 263 + (i + f) * vel) % (W + 320)) - 160, py = 70 + (j * 151) % (Hh - 140), rr = 36 + j * 16;
            x.globalAlpha = 0.16; x.fillStyle = j % 2 ? T.acc2 : T.acc; x.beginPath(); x.arc(px, py, rr, 0, Math.PI * 2); x.fill();
          }
          var ang = (1 - ent) * 0.95 - (1 - sal) * 0.95, cw = W * 0.8, ch = Hh * 0.76, cs = Math.max(0.05, Math.cos(ang));
          x.globalAlpha = Math.min(1, sal * 1.2); x.save(); x.translate(W / 2, Hh / 2 + (1 - ent) * 40); x.transform(cs, Math.sin(ang) * 0.2, 0, 1, 0, 0);
          x.shadowColor = 'rgba(0,0,0,.35)'; x.shadowBlur = 44; x.shadowOffsetY = 22; x.fillStyle = tarjeta;
          x.beginPath(); if (x.roundRect) x.roundRect(-cw / 2, -ch / 2, cw, ch, Math.min(T.r || 0, 24) + 6); else x.rect(-cw / 2, -ch / 2, cw, ch); x.fill();
          x.shadowColor = 'transparent'; x.fillStyle = T.acc; x.fillRect(-cw / 2, -ch / 2, 10, ch);
          escena(x, e, -cw / 2 + 64, -ch / 2 + 40, cw - 128, ch - 80, T, f); x.restore();
        } else {
          x.globalAlpha = ent * sal; x.save(); x.translate(-(1 - ent) * 60, 0); escena(x, e, 110, 90, W - 220, Hh - 180, T, f); x.restore();
          x.globalAlpha = 1; x.fillStyle = T.acc; x.fillRect(110, 64, 60 * ent, 6);
        }
        x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.fillStyle = T.soft; x.fillRect(0, Hh - 8, W, 8); x.fillStyle = T.acc; x.fillRect(0, Hh - 8, W * ((i + f) / E.length), 8);
      };
      rec.start(250);
      /* si la pestaña se oculta o el navegador frena los temporizadores, el reloj del vídeo se detiene
         (pausa la grabación) en lugar de saltarse escenas */
      var ult = performance.now(), parada = 0, fin = false;
      var vis = function () {
        if (fin) return;
        if (document.hidden) { if (rec.state === 'recording') try { rec.pause(); } catch (e) { } parada = performance.now(); }
        else if (parada) { t0 += performance.now() - parada; parada = 0; ult = performance.now(); if (rec.state === 'paused') try { rec.resume(); } catch (e) { } setTimeout(tic, 0); }
      };
      document.addEventListener('visibilitychange', vis);
      var tic = function () {
        if (fin || parada) return;
        var ahora = performance.now(), salto = ahora - ult; ult = ahora;
        if (salto > 250) t0 += salto - 33;
        var t = ahora - t0;
        if (t >= total) { fin = true; document.removeEventListener('visibilitychange', vis); cuadro(E.length - 1, 0.87); setTimeout(function () { rec.stop(); }, 200); return; }
        var i = Math.floor(t / DUR); cuadro(i, (t % DUR) / DUR); if (prog) prog(t / total);
        setTimeout(tic, 33);
      };
      tic();
    });
  }

  /* ─────────── panel del Editorial ─────────── */
  var PRESETS = [
    { n: 'Libro para colorear', d: 'Infantil · 4–5 años · 32 págs. · dibujos, mandalas, une los puntos · diseño Acuarela', c: { materia: 'infantil', nivel: 'inf', curso: 1, prod: 'colorear', paginas: 32, plantilla: 'acuarela', acab: { efectos: ['estrellas'] } } },
    { n: 'Cuaderno de caligrafía', d: '1.º de primaria · 48 págs. · letra ligada escolar del país · pauta Montessori', c: { materia: 'infantil', nivel: 'pri', curso: 0, prod: 'caligrafia', paginas: 48, plantilla: 'cuaderno', acab: {} } },
    { n: 'Pasatiempos con solucionario', d: '2.º de primaria · 40 págs. · sopas, laberintos, puntos y simetrías · diseño Ceras', c: { materia: 'infantil', nivel: 'pri', curso: 1, prod: 'pasatiempos', paginas: 40, plantilla: 'ceras', acab: { efectos: ['confeti'] } } },
    { n: 'Sopas de letras de ciencias', d: 'Ciencias naturales · 5.º de primaria · 24 págs. con las palabras clave de cada unidad', c: { materia: 'natu', nivel: 'pri', curso: 4, prod: 'pasatiempos', paginas: 24, plantilla: 'arcoiris', op: { juegos: ['sopa'] }, acab: {} } },
    { n: 'Cuento infantil con QR', d: 'Lengua · Infantil · 24 págs. · diseño Cuento · QR en cada unidad', c: { materia: 'lengua', nivel: 'inf', curso: 0, prod: 'libro', paginas: 24, plantilla: 'cuento', acab: { qr: 'unidades', efectos: ['esquinas'] } } },
    { n: 'Libro de texto de primaria', d: 'Matemáticas · 3.º de primaria · 96 págs. · diseño Cuaderno', c: { materia: 'mate', nivel: 'pri', curso: 2, prod: 'libro', paginas: 96, plantilla: 'cuaderno', acab: {} } },
    { n: 'Cómic de historia', d: 'Ciencias sociales · primaria · fichas en diseño Cómic', c: { materia: 'soci', nivel: 'pri', curso: 4, prod: 'cuaderno', paginas: 40, plantilla: 'comic', acab: {} } },
    { n: 'Informe de secundaria', d: 'Ciencias naturales · secundaria · libro profesional en diseño Prensa', c: { materia: 'natu', nivel: 'sec', curso: 1, prod: 'libro_pro', paginas: 40, plantilla: 'prensa', acab: {} } },
    { n: 'Ebook de empresa', d: 'Contabilidad · FP · libro profesional Corporativo · en revisión', c: { materia: 'conta', nivel: 'fp', curso: 0, prod: 'libro_pro', paginas: 60, plantilla: 'corporativo', acab: { efectos: ['banda'], estado: 'revision' } } },
    { n: 'Diccionario en 5 idiomas', d: 'ES · EN · FR · DE · CH · 120 págs. · QR por tema', c: { materia: 'idiomas', prod: 'diccionario', paginas: 120, plantilla: 'auto', acab: { qr: 'unidades' } } },
    { n: 'Carrusel para redes', d: 'Tecnología · secundaria · 10 tarjetas 1:1 en diseño Suizo', c: { materia: 'tecno', nivel: 'sec', curso: 0, prod: 'carrusel', paginas: 10, plantilla: 'suizo', acab: {} } },
    { n: 'Presentación en pizarra', d: 'Ciencias naturales · primaria · diapositivas en diseño Pizarra', c: { materia: 'natu', nivel: 'pri', curso: 3, prod: 'presentacion', paginas: 20, plantilla: 'pizarra', acab: {} } }
  ];
  function aplicarPreset(ed, p) {
    var CU = window.EU_CURRICULO, c = Object.assign({}, p.c);
    if (!CU.materia(c.materia)) return ed.aviso('Este ejemplo necesita la materia «' + c.materia + '», que no está cargada.');
    Object.assign(ed.cfg, c, { acab: Object.assign({}, c.acab || {}), op: Object.assign({}, c.op || {}), titulo: '' });
    var P = CU.PAISES[ed.cfg.pais], N = P && P.niveles[ed.cfg.nivel];
    if (!N) ed.cfg.nivel = 'pri';
    N = P.niveles[ed.cfg.nivel]; if (ed.cfg.curso >= N.c.length) ed.cfg.curso = N.c.length - 1;
    ed.guardar(); ed.pag = 0; ed.construirPanel(); ed.generar();
    ed.aviso('Ejemplo cargado: ' + p.n + '. Cámbialo a tu gusto antes de descargar.');
  }

  function galeria(ed, host, U) {
    var el = U.el, cfg = ed.cfg, CU = window.EU_CURRICULO, base;
    try { base = ED.ensamblar(Object.assign({}, cfg, { paginas: 10, acab: {} })); } catch (e) { return; }
    var pg0 = base.pages[0], C0 = base.C, W = C0.papel.w * MM, Hp = C0.papel.h * MM;
    var bnd = CU.banda(cfg.pais, cfg.nivel, cfg.curso), auto = ED.plantillaAuto(bnd, cfg.materia);
    var auto1 = el('button', U.chip(cfg.plantilla === 'auto') + ';margin-bottom:8px', 'Según la edad (' + ((ED.PLANTILLAS[auto] || {}).n || auto) + ')');
    auto1.onclick = function () { ed.set('plantilla', 'auto'); };
    host.appendChild(auto1);
    var grupos = {}; Object.keys(ED.PLANTILLAS).forEach(function (k) { var g = (DIS[k] && DIS[k].g) || GRUPO_BASE[k] || 'autor'; (grupos[g] = grupos[g] || []).push(k); });
    var tw = 88, s = tw / W;
    GRUPOS.forEach(function (G) {
      if (!grupos[G[0]]) return;
      host.appendChild(el('div', 'font-size:10px;color:#7c7c9e;margin:10px 0 5px', G[1]));
      var grid = el('div', 'display:grid;grid-template-columns:repeat(auto-fill,minmax(' + tw + 'px,1fr));gap:8px');
      grupos[G[0]].forEach(function (k) {
        var on = cfg.plantilla === k, T = Object.assign({ id: k }, ED.PLANTILLAS[k]);
        var C2 = Object.assign({}, C0, { T: T, acab: Object.assign({}, ACAB0) });
        var b = el('button', 'display:flex;flex-direction:column;gap:4px;align-items:flex-start;background:transparent;border:0;padding:0;cursor:pointer;font-family:inherit;text-align:left');
        var m = el('div', 'width:' + tw + 'px;height:' + Math.round(Hp * s) + 'px;overflow:hidden;border-radius:3px;background:' + T.bg + ';outline:' + (on ? '2px solid #a855f7' : '1px solid #2d2d4a') + ';outline-offset:' + (on ? '2px' : '0'));
        var d = el('div', 'width:' + W + 'px;height:' + Hp + 'px;transform:scale(' + s + ');transform-origin:0 0;pointer-events:none');
        try { d.innerHTML = ED.paginaHTML(pg0, C2, 'print', base); } catch (e) { }
        m.appendChild(d); b.appendChild(m);
        b.appendChild(el('span', 'font-size:10.5px;color:' + (on ? '#fff' : '#94a3b8') + ';font-weight:' + (on ? 700 : 400), T.n));
        b.title = T.d || '';
        b.onclick = function () { ed.set('plantilla', k); };
        grid.appendChild(b);
      });
      host.appendChild(grid);
    });
  }

  function panel(ed, seccion, U) {
    var el = U.el, ST = U.ST, chip = U.chip, A = acab(ed.cfg);
    var setA = function (k, v, rehacer) { var a = Object.assign({}, ed.cfg.acab || {}); a[k] = v; ed.set('acab', a, rehacer !== false); };
    var lbl = function (h, t) { h.appendChild(el('div', ST.lbl, t)); };
    var campo = function (h, k, ph, tipo) { var i = el('input', ST.campo); i.type = tipo || 'text'; i.value = A[k] || ''; i.placeholder = ph || ''; i.oninput = function () { setA(k, i.value, false); }; h.appendChild(i); return i; };
    var fila = function (h, opts, val, fn, multi) {
      var f = el('div', ST.fila);
      opts.forEach(function (o) { var on = multi ? (val || []).indexOf(o[0]) >= 0 : val === o[0]; var b = el('button', chip(on), o[1]); b.onclick = function () { fn(o[0]); }; f.appendChild(b); });
      h.appendChild(f);
    };

    /* Ejemplos */
    var s0 = seccion('Ejemplos para empezar');
    s0.appendChild(el('div', ST.nota + ';margin:0 0 8px', 'Cada ejemplo fija materia, etapa, producto, extensión y diseño. Después puedes cambiar cualquier cosa.'));
    var g0 = el('div', 'display:flex;flex-direction:column;gap:5px');
    PRESETS.forEach(function (p) {
      var b = el('button', ST.bt + ';display:flex;flex-direction:column;gap:2px');
      b.appendChild(el('b', 'font-size:11.5px;color:#e8e8f5', p.n)); b.appendChild(el('span', 'font-size:10px;color:#94a3b8;font-weight:400', p.d));
      b.onclick = function () { aplicarPreset(ed, p); };
      g0.appendChild(b);
    });
    s0.appendChild(g0);

    /* Color, letra y efectos */
    var s1 = seccion('Color, letra y efectos');
    lbl(s1, 'Paleta');
    var gp = el('div', 'display:flex;flex-wrap:wrap;gap:6px');
    PALETAS.forEach(function (p) {
      var on = (A.acc || '') === p[0] && (A.acc2 || '') === p[1];
      var b = el('button', 'display:flex;gap:6px;align-items:center;padding:5px 8px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:10.5px;background:transparent;color:' + (on ? '#fff' : '#94a3b8') + ';border:1px solid ' + (on ? '#a855f7' : '#2d2d4a'));
      if (p[0]) { b.appendChild(el('span', 'width:12px;height:12px;border-radius:3px;background:' + p[0])); b.appendChild(el('span', 'width:12px;height:12px;border-radius:3px;background:' + p[1])); }
      b.appendChild(el('span', '', p[2]));
      b.onclick = function () { var a = Object.assign({}, ed.cfg.acab || {}, { acc: p[0], acc2: p[1] }); ed.set('acab', a); };
      gp.appendChild(b);
    });
    s1.appendChild(gp);
    var fc = el('div', 'display:flex;gap:10px;align-items:center;margin-top:8px;font-size:11px;color:#94a3b8');
    [['acc', 'Color principal'], ['acc2', 'Segundo color']].forEach(function (c) {
      var l = el('label', 'display:flex;gap:6px;align-items:center;cursor:pointer'), i = el('input');
      i.type = 'color'; i.value = A[c[0]] || '#888888'; i.style.cssText = 'width:28px;height:24px;border:1px solid #2d2d4a;border-radius:6px;background:none;padding:0;cursor:pointer';
      i.onchange = function () { setA(c[0], i.value); };
      l.appendChild(i); l.appendChild(el('span', '', c[1])); fc.appendChild(l);
    });
    s1.appendChild(fc);
    lbl(s1, 'Tipografía');
    var sl = el('select', ST.campo);
    Object.keys(LETRAS).forEach(function (k) { var o = el('option', '', LETRAS[k].n); o.value = k; if (k === A.letra) o.selected = true; sl.appendChild(o); });
    sl.onchange = function () { setA('letra', sl.value); };
    s1.appendChild(sl);
    lbl(s1, 'Efectos');
    fila(s1, EFECTOS, A.efectos, function (k) { var e = (A.efectos || []).slice(), i = e.indexOf(k); if (i >= 0) e.splice(i, 1); else e.push(k); setA('efectos', e); }, true);

    /* QR */
    var s2 = seccion('Códigos QR');
    fila(s2, [['no', 'Sin QR'], ['portada', 'Portada y contra'], ['unidades', 'Cada unidad'], ['todas', 'Todas las páginas']], A.qr, function (v) { setA('qr', v); });
    if (A.qr !== 'no') {
      lbl(s2, 'Enlace');
      campo(s2, 'qrUrl', 'https://… (vídeo, curso, web del centro)', 'url');
      lbl(s2, 'Rótulo bajo el QR de portada');
      campo(s2, 'qrTxt', 'Escanea y sigue en el móvil');
      s2.appendChild(el('div', ST.nota, 'En las unidades el enlace termina en #u1, #u2…; en todas las páginas, en #p1, #p2… Sin enlace, el QR lleva el título y la página.' + (window.QRCode ? '' : ' El generador de QR aún no se ha cargado: necesita conexión.')));
    }

    /* Autorización */
    var s3 = seccion('Autorización');
    fila(s3, [['libre', 'Sin control'], ['borrador', 'Borrador'], ['revision', 'En revisión'], ['autorizado', 'Autorizado']], A.estado, function (v) {
      var a = Object.assign({}, ed.cfg.acab || {}, { estado: v }); if (v === 'autorizado' && !a.fecha) a.fecha = new Date().toISOString().slice(0, 10); ed.set('acab', a);
    });
    s3.appendChild(el('div', ST.nota, A.estado === 'borrador' ? 'Todas las páginas llevan la marca BORRADOR hasta que se autorice.' : A.estado === 'revision' ? 'Todas las páginas llevan la marca EN REVISIÓN.' : A.estado === 'autorizado' ? 'Sin marca de agua. El sello con firma, fecha y código va en los créditos (o en la contraportada si el libro es corto).' : 'Sin marcas: el material sale tal cual.'));
    if (A.estado !== 'libre') {
      var fd = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px');
      campo(fd, 'por', 'Quién autoriza'); campo(fd, 'cargo', 'Cargo');
      s3.appendChild(fd);
      var fe = el('div', 'display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px');
      campo(fe, 'entidad', 'Centro, editorial o empresa'); campo(fe, 'fecha', '', 'date');
      s3.appendChild(fe);
      if (A.estado !== 'autorizado') {
        var ba = el('button', ST.btF + ';margin-top:8px', '✔ Autorizar ahora');
        ba.onclick = function () { var a = Object.assign({}, ed.cfg.acab || {}, { estado: 'autorizado', fecha: new Date().toISOString().slice(0, 10) }); ed.set('acab', a); ed.aviso('Autorizado. Revisa el sello en los créditos antes de descargar.'); };
        s3.appendChild(ba);
      } else if (ed.res) s3.appendChild(el('div', ST.nota, 'Código de verificación: ' + codigo(Object.assign({}, ed.res.C, { acab: A }), ed.res)));
    }
  }

  function salidas(ed, b8) {
    /* cada salida termina antes el ajuste de páginas por tandas, para que salga el libro completo */
    var b8o = b8; b8 = function (t, fn, f) { return b8o(t, function () { if (ed.terminarTandas) ed.terminarTandas(); return fn.apply(this, arguments); }, f); };
    var marca = function () { var A = acab(ed.cfg); return A.estado === 'borrador' || A.estado === 'revision' ? ' Sale con la marca «' + (A.estado === 'borrador' ? 'BORRADOR' : 'EN REVISIÓN') + '»: autorízalo para quitarla.' : ''; };
    var ocupado = false;
    b8('📦 Paquete completo', function () {
      if (ocupado) return; ocupado = true;
      paquete(ed.res, ed.cfg, { png: true, video: true }, function (t) { ed.aviso(t); }).then(function (r) { ed.bajar(r.blob, r.nombre); ed.aviso('Paquete descargado: ' + r.hecho.join(', ') + ' y EPUB.' + marca()); })
        .catch(function (e) { ed.aviso(e.message); }).then(function () { ocupado = false; });
    }, true);
    b8('🧑‍🏫 Curso + tests', function () {
      if (!window.JSZip) return ed.aviso('El curso necesita conexión la primera vez (JSZip).');
      var z = new JSZip(); curso(ed.res, z, '');
      z.generateAsync({ type: 'blob' }).then(function (b) { ed.bajar(b, 'curso-' + slug(ed.res.C.titulo) + '.zip'); ed.aviso('Curso descargado: abre index.html. Cada test se corrige solo y guarda la nota en el navegador.' + marca()); });
    });
    var grabar = function (modo) {
      if (ocupado) return; ocupado = true;
      video(ed.res, modo, function (f) { ed.aviso('Grabando vídeo ' + modo.toUpperCase() + ': ' + Math.round(f * 100) + ' %'); })
        .then(function (r) { ed.bajar(r.blob, 'video-' + modo + '-' + slug(ed.res.C.titulo) + '.' + r.ext); ed.aviso('Vídeo ' + modo.toUpperCase() + ' descargado (sin sonido; el guion va en el paquete).'); })
        .catch(function (e) { ed.aviso(e.message); }).then(function () { ocupado = false; });
    };
    b8('🎬 Vídeo 2D', function () { grabar('2d'); });
    b8('🧊 Vídeo 3D', function () { grabar('3d'); });
    b8('🎠 Carrusel PNG', function () {
      if (ocupado) return; if (!window.JSZip) return ed.aviso('Necesita conexión la primera vez (JSZip).');
      ocupado = true;
      var car = ed.cfg.prod === 'carrusel' ? ed.res : variante(ed.cfg, 'carrusel', 10);
      pngs(car, function (f) { ed.aviso('Carrusel en PNG: ' + Math.round(f * 100) + ' %'); }).then(function (bs) {
        var z = new JSZip(), n = 0; bs.forEach(function (b, i) { if (b) { n++; z.file(String(i + 1).padStart(2, '0') + '.png', b); } });
        if (!n) { ed.aviso('Este navegador no deja convertir las tarjetas a PNG. Usa Imprimir / PDF con el producto Carrusel.'); return; }
        return z.generateAsync({ type: 'blob' }).then(function (b) { ed.bajar(b, 'carrusel-' + slug(car.C.titulo) + '.zip'); ed.aviso(n + ' tarjetas PNG de 1080 × 1080 descargadas.' + marca()); });
      }).catch(function (e) { ed.aviso(e.message); }).then(function () { ocupado = false; });
    });
  }

  window.EU_CONECTORES = { DISENOS: DIS, LETRAS: LETRAS, PRESETS: PRESETS, acab: acab, panel: panel, galeria: galeria, salidas: salidas, paquete: paquete, video: video, pngs: pngs, curso: curso, codigo: codigo };
})();
