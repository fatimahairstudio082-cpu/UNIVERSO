/* b6_editorial_motor.js — motor del Editorial escolar.
   Arma libros, cuadernos, fichas, unidades didácticas, exámenes, rúbricas,
   láminas, presentaciones y trabajos del alumno a partir del banco curricular
   (b6_curriculo.js), con la extensión exacta que se pida (10–500 páginas).
   Todo sale de la misma lista de páginas: la vista previa, la impresión
   (PDF vectorial desde el navegador), el EPUB de maquetación fija y el HTML
   interactivo. Se registra en window.EU_EDITORIAL. */
(function () {
  'use strict';
  if (window.EU_EDITORIAL) return;

  /* ─────────── utilidades ─────────── */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function rng(seed) { var a = seed >>> 0; return function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function ent(r, a, b) { return a + Math.floor(r() * (b - a + 1)); }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function mezcla(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function may(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function minus(s) { s = String(s || ''); return s.charAt(0).toLowerCase() + s.slice(1); }
  function plural(frase) {
    var p = frase.split(' '), w = p[0];
    if (/[aeiouáéíóú]$/i.test(w)) w += 's';
    else w = w.replace(/á(?=[^aeiouáéíóú]*$)/, 'a').replace(/é(?=[^aeiou]*$)/, 'e').replace(/ó(?=[^aeiou]*$)/, 'o').replace(/í(?=[^aeiou]*$)/, 'i').replace(/ú(?=[^aeiou]*$)/, 'u') + 'es';
    p[0] = w; return p.join(' ');
  }
  function sinArt(s) { return s.replace(/^(un|una)\s+/, ''); }

  /* ─────────── voz del país ───────────
     Voseo rioplatense en las consignas y léxico de España donde cambia. */
  var VOS = [['Lee', 'Leé'], ['Escribe', 'Escribí'], ['Completa', 'Completá'], ['Observa', 'Observá'], ['Rodea', 'Rodeá'],
    ['Une', 'Uní'], ['Piensa', 'Pensá'], ['Dibuja', 'Dibujá'], ['Resuelve', 'Resolvé'], ['Marca', 'Marcá'], ['Separa', 'Separá'],
    ['Calcula', 'Calculá'], ['Explica', 'Explicá'], ['Mira', 'Mirá'], ['Traduce', 'Traducí'], ['Ordena', 'Ordená'], ['Responde', 'Respondé'],
    ['Busca', 'Buscá'], ['Relaciona', 'Relacioná'], ['Pinta', 'Pintá'], ['Indica', 'Indicá'], ['Anota', 'Anotá'], ['Redacta', 'Redactá'],
    ['Corrige', 'Corregí'], ['Describe', 'Describí'], ['Nombra', 'Nombrá'], ['Escucha', 'Escuchá'], ['Respira', 'Respirá'],
    ['Comprueba', 'Comprobá'], ['Encuentra', 'Encontrá'], ['Subraya', 'Subrayá'], ['Registra', 'Registrá'], ['Resume', 'Resumí'],
    ['Elige', 'Elegí'], ['rotula', 'rotulá'], ['Rotula', 'Rotulá'], ['pon', 'poné'], ['Deriva', 'Derivá'], ['Toca', 'Tocá'], ['Aplaude', 'Aplaudí'], ['Cuéntale', 'Contale'], ['Pregunta', 'Preguntá'],
    ['Di', 'Decí'], ['Haz', 'Hacé'], ['Pon', 'Poné'], ['Sigue', 'Seguí'], ['Vuelve', 'Volvé'], ['Intenta', 'Intentá'], ['Comparte', 'Compartí'],
    ['tienes', 'tenés'], ['puedes', 'podés'], ['sabes', 'sabés'], ['eres', 'sos'], ['tú', 'vos'], ['Tú', 'Vos'], ['piensas', 'pensás'],
    ['quieres', 'querés'], ['equivocas', 'equivocás'], ['necesitas', 'necesitás'], ['aprendes', 'aprendés'], ['vives', 'vivís'],
    ['conoces', 'conocés'], ['sientes', 'sentís'], ['enfadas', 'enojás'], ['llegas', 'llegás'], ['haces', 'hacés'], ['recuerdas', 'recordás'],
    ['ayudas', 'ayudás'], ['celebras', 'celebrás'], ['comes', 'comés'], ['usas', 'usás'], ['entiendes', 'entendés']];
  var LEX_ES = [['computadora', 'ordenador'], ['Computadora', 'Ordenador'], ['salón de clase', 'aula'], ['celular', 'móvil']];
  var LEX_AM = [['enfado', 'enojo'], ['Enfado', 'Enojo'], ['enfadas', 'enojas'], ['ratón', 'mouse']];
  var B = '(^|[^A-Za-zÁÉÍÓÚáéíóúÑñÜü])', A = '(?![A-Za-zÁÉÍÓÚáéíóúÑñÜü])';
  function compila(pares) { return pares.map(function (p) { return [new RegExp(B + p[0] + A, 'g'), '$1' + p[1]]; }); }
  var R_VOS = compila(VOS), R_ES = compila(LEX_ES), R_AM = compila(LEX_AM);
  function reemplazaPalabras(t, pares) {
    for (var i = 0; i < pares.length; i++) if (t.indexOf(pares[i][1].slice(2, 5)) >= 0 || true) t = t.replace(pares[i][0], pares[i][1]);
    return t;
  }

  function sub(t, C) {
    if (t == null) return '';
    var P = C.P;
    t = String(t)
      .replace(/\{pais\}/g, P.id === 'us' ? 'Estados Unidos' : P.n)
      .replace(/\{ciudad\}/g, P.ciudades[0]).replace(/\{ciudad2\}/g, P.ciudades[1])
      .replace(/\{nombre\}/g, P.nombres[0]).replace(/\{n1\}/g, P.nombres[0]).replace(/\{n2\}/g, P.nombres[1])
      .replace(/\{rio\}/g, P.rio).replace(/\{musica\}/g, P.musica).replace(/\{fiesta\}/g, P.fiesta)
      .replace(/\{comida\}/g, P.comida).replace(/\{imp\}/g, P.imp.n).replace(/\{impP\}/g, P.imp.p);
    t = reemplazaPalabras(t, P.id === 'es' ? R_ES : R_AM);
    if (P.vos) t = reemplazaPalabras(t, R_VOS);
    return t;
  }

  /* ─────────── números y dinero del país ─────────── */
  var FMT = {};
  function formato(clave, loc, o) {
    if (!FMT[clave]) { try { FMT[clave] = new Intl.NumberFormat(loc, o); } catch (e) { FMT[clave] = { format: function (n) { return String(n); } }; } }
    return FMT[clave];
  }
  function num(n, C) { return formato('n' + C.P.loc, C.P.loc, { maximumFractionDigits: 2 }).format(n); }
  function din(n, C) {
    var ent = Math.abs(n - Math.round(n)) < 1e-9, d = ent ? 0 : 2;
    return formato('d' + C.P.loc + d, C.P.loc, { style: 'currency', currency: C.P.mon, minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
  }
  function redondeo(x, base) { var p = base >= 1000 ? 100 : base >= 100 ? 10 : base >= 10 ? 1 : 0.5; return Math.max(p, Math.round(x / p) * p); }

  /* ─────────── plantillas visuales ─────────── */
  var PLANTILLAS = {
    juego: { n: 'Juego', d: 'Letra grande y redonda, colores cálidos, formas suaves. Para 3–8 años.', tit: "'Baloo 2', 'Andika', sans-serif", cuerpo: "'Andika', sans-serif", bg: '#FFF8EC', ink: '#2A2238', acc: '#E0582A', acc2: '#1E8C80', soft: '#FFE6D3', soft2: '#DDF3EF', r: 16, peso: 700 },
    cuaderno: { n: 'Cuaderno', d: 'Pauta de cuaderno, tinta azul y rótulos limpios. Para primaria.', tit: "'Lexend', sans-serif", cuerpo: "'Andika', sans-serif", bg: '#FCFCF7', ink: '#1F2A44', acc: '#2F63C7', acc2: '#B7791F', soft: '#E6EEFC', soft2: '#FBF0DC', r: 8, peso: 600, pauta: true },
    editorial: { n: 'Editorial', d: 'Serifa de libro de texto, márgenes amplios y titulares con peso. Para secundaria y bachillerato.', tit: "'Source Serif 4', Georgia, serif", cuerpo: "'Source Serif 4', Georgia, serif", bg: '#FBF8F2', ink: '#1E1B18', acc: '#A0301C', acc2: '#1F5F7A', soft: '#F1E8DA', soft2: '#E3EEF2', r: 0, peso: 700 },
    tecnica: { n: 'Técnica', d: 'Retícula milimetrada, tablas y cifras tabulares. Para FP, contabilidad y dibujo técnico.', tit: "'IBM Plex Sans', sans-serif", cuerpo: "'IBM Plex Sans', sans-serif", mono: "'IBM Plex Mono', monospace", bg: '#FFFFFF', ink: '#15202B', acc: '#0F5C8C', acc2: '#B4441A', soft: '#E7F0F6', soft2: '#FBEDE6', r: 2, peso: 600, reticula: true },
    sobria: { n: 'Sobria', d: 'Lectura tranquila, sin infantilizar. Para personas adultas.', tit: "'Literata', Georgia, serif", cuerpo: "'Literata', Georgia, serif", bg: '#FAFAF8', ink: '#222222', acc: '#2F5D50', acc2: '#8A5A2B', soft: '#E7EEEB', soft2: '#F3EBE2', r: 4, peso: 600 }
  };
  var FUENTES = 'https://fonts.googleapis.com/css2?family=Andika:ital,wght@0,400;0,700;1,400&family=Baloo+2:wght@500;700&family=Lexend:wght@300;400;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono&family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap';

  var PROD_EXT = {}, VOZ_EXT = {}, ESC_EXT = {}, QUIZ_EXT = {};
  /* Ganchos de los conectores: AJUSTE retoca el contexto (color, letra, papel);
     POST retoca el HTML de cada página (efectos, QR, marca de agua, sello). */
  /* PRE prepara cada página antes de pintarla (p. ej. rotación de diseño) y puede devolver una función que deshace el cambio. */
  var AJUSTE = [], POST = [], PRE = [];
  function plantillaAuto(bnd, materia) {
    var mm = window.EU_CURRICULO && EU_CURRICULO.materia(materia);
    if (mm && mm.plantilla) return typeof mm.plantilla === 'function' ? mm.plantilla(bnd) : mm.plantilla;
    if (materia === 'conta' || materia === 'tecno') return bnd === 'inf' || bnd.indexOf('pri') === 0 ? 'cuaderno' : 'tecnica';
    if (bnd === 'inf' || bnd === 'pri1') return 'juego';
    if (bnd.indexOf('pri') === 0) return 'cuaderno';
    if (bnd === 'fp') return 'tecnica';
    if (bnd === 'adu') return 'sobria';
    return 'editorial';
  }

  var PAPEL = { a4: { w: 210, h: 297, n: 'A4' }, carta: { w: 215.9, h: 279.4, n: 'Carta' }, slide: { w: 297, h: 167.06, n: '16:9' } };

  /* ─────────── productos ─────────── */
  var PRODUCTOS = [
    { id: 'libro', n: 'Libro de texto', ico: '📗', d: 'Portada, índice, unidades completas, glosario, solucionario y bibliografía.', sol: true },
    { id: 'cuaderno', n: 'Cuaderno de actividades', ico: '📓', d: 'Práctica abundante con espacio para escribir y páginas de apuntes.', sol: true },
    { id: 'fichas', n: 'Fichas sueltas', ico: '🗒', d: 'Una ficha por página, con nombre y fecha, lista para fotocopiar.', sol: true },
    { id: 'unidad', n: 'Unidad didáctica', ico: '🧭', d: 'Programación: marco curricular, objetivos, sesiones, DUA y evaluación.', sol: false },
    { id: 'examen', n: 'Examen + solucionario', ico: '📝', d: 'Modelos A, B, C… con puntuación sobre 10 y hoja de respuestas.', sol: true },
    { id: 'rubrica', n: 'Rúbricas', ico: '📊', d: 'Rúbrica analítica por unidad y lista de cotejo.', sol: false },
    { id: 'laminas', n: 'Láminas y murales', ico: '🖼', d: 'Una idea grande por hoja: mapa, proceso, vocabulario.', sol: false },
    { id: 'presentacion', n: 'Presentación de clase', ico: '🖥', d: 'Diapositivas 16:9 con modo clase narrado.', sol: false, papel: 'slide' },
    { id: 'trabajo', n: 'Trabajo del alumno', ico: '🎒', d: 'Portada, índice, introducción, desarrollo, conclusión y bibliografía APA.', sol: false },
    { id: 'ebook', n: 'Ebook interactivo', ico: '📱', d: 'El libro con respuestas que se comprueban solas y lectura en voz alta.', sol: true }
  ];

  /* ─────────── contexto ─────────── */
  function contexto(cfg) {
    var CU = window.EU_CURRICULO;
    var P = Object.assign({ id: cfg.pais }, CU.PAISES[cfg.pais] || CU.PAISES.es);
    var N = P.niveles[cfg.nivel] || P.niveles.pri;
    var curso = Math.max(0, Math.min(N.c.length - 1, cfg.curso || 0));
    var MAT = CU.materia(cfg.materia) || {};
    var bnd = MAT.banda || N.c[curso].b;
    var prod = PRODUCTOS.filter(function (p) { return p.id === cfg.prod; })[0] || PRODUCTOS[0];
    var tid = cfg.plantilla && cfg.plantilla !== 'auto' ? cfg.plantilla : plantillaAuto(bnd, cfg.materia);
    var T = Object.assign({ id: tid }, PLANTILLAS[tid] || PLANTILLAS.editorial);
    if (cfg.dislexia) { T.cuerpo = "'Lexend', sans-serif"; T.tit = "'Lexend', sans-serif"; T.bg = '#FDF6E3'; }
    var papel = prod.papel || (cfg.papel && cfg.papel !== 'auto' ? cfg.papel : P.papel);
    var fs = { inf: 21, pri1: 17, pri2: 15, pri3: 14, sec: 13, bach: 12.5, fp: 12.5, adu: 13.5 }[bnd] || 13;
    if (cfg.facil) fs = Math.round(fs * 1.15 * 2) / 2;
    if (prod.id === 'presentacion') fs = 16;
    var guiaDef = { inf: 'Tito', pri1: 'Lía', pri2: 'Lía', pri3: 'Lía', sec: 'Marco', bach: 'Nora', fp: 'Andrés', adu: 'Carmen' }[bnd];
    var C = {
      cfg: cfg, P: P, pk: cfg.pais, nivel: cfg.nivel, N: N, cursoN: N.c[curso].n, bnd: bnd,
      mat: cfg.materia, matN: CU.nombreMateria(cfg.materia, cfg.pais), prod: prod, T: T,
      papel: PAPEL[papel] || PAPEL.a4, papelId: papel, fs: fs,
      guia: { n: (cfg.guiaN || '').trim() || guiaDef, img: cfg.guiaImg || '' },
      semilla: cfg.semilla || 1, usuario: cfg.usuario || 'docente',
      solucion: prod.sol && cfg.solucion !== false && cfg.usuario !== 'alumno',
      peque: bnd === 'inf' || bnd === 'pri1', adulto: bnd === 'adu' || bnd === 'fp',
      libre: !!MAT.libre, op: cfg.op || {}
    };
    C.titulo = (cfg.titulo || '').trim() || tituloAuto(C);
    AJUSTE.forEach(function (f) { try { f(C); } catch (e) { console.warn(e); } });
    return C;
  }
  function tituloAuto(C) {
    if (PROD_EXT[C.prod.id] && PROD_EXT[C.prod.id].titulo) return PROD_EXT[C.prod.id].titulo(C);
    var base = C.matN.replace(/^.*·\s*/, '');
    var p = C.prod.id;
    if (p === 'cuaderno') return 'Cuaderno de ' + minus(base);
    if (p === 'fichas') return 'Fichas de ' + minus(base);
    if (p === 'unidad') return 'Programación de ' + minus(base);
    if (p === 'examen') return 'Evaluación de ' + minus(base);
    if (p === 'rubrica') return 'Rúbricas de ' + minus(base);
    if (p === 'laminas') return 'Láminas de ' + minus(base);
    if (p === 'presentacion') return base + ' en clase';
    if (p === 'trabajo') return 'Trabajo de ' + minus(base);
    return base;
  }

  /* ─────────── figuras (SVG generado a partir de datos) ─────────── */
  var NS = 'xmlns="http://www.w3.org/2000/svg"';
  function svg(w, h, body, maxw) { return '<svg ' + NS + ' viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;max-width:' + (maxw || w) + 'px;height:auto;display:block">' + body + '</svg>'; }
  function txt(x, y, s, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 15) + '" font-family="' + esc(o.f || 'sans-serif') + '" fill="' + (o.c || '#222') + '"' + (o.w ? ' font-weight="' + o.w + '"' : '') + '>' + esc(s) + '</text>'; }
  function flecha(x1, y1, x2, y2, c) {
    var a = Math.atan2(y2 - y1, x2 - x1), l = 9;
    return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + c + '" stroke-width="2"/>' +
      '<polygon points="' + x2 + ',' + y2 + ' ' + (x2 - l * Math.cos(a - 0.4)) + ',' + (y2 - l * Math.sin(a - 0.4)) + ' ' + (x2 - l * Math.cos(a + 0.4)) + ',' + (y2 - l * Math.sin(a + 0.4)) + '" fill="' + c + '"/>';
  }
  function partir(s, n) { var p = String(s).split(' '), l = [], cur = ''; p.forEach(function (w) { if ((cur + ' ' + w).trim().length > n && cur) { l.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }); if (cur) l.push(cur); return l; }
  function multi(x, y, s, n, o) { var ls = partir(s, n), dy = (o && o.s || 15) * 1.15, y0 = y - (ls.length - 1) * dy / 2; return ls.map(function (l, i) { return txt(x, y0 + i * dy + 5, l, o); }).join(''); }

  function figura(f, C) {
    var T = C.T, F = T.cuerpo, ink = T.ink, a = T.acc, a2 = T.acc2, s1 = T.soft, s2 = T.soft2, r = Math.min(T.r, 14);
    if (!f) return '';
    switch (f.t) {
      case 'mapa': {
        var ramas = (f.r || []).slice(0, 6), W = 640, H = 300, cx = W / 2, cy = H / 2, out = '';
        ramas.forEach(function (x, i) {
          var ang = -Math.PI / 2 + i * 2 * Math.PI / ramas.length, nx = cx + Math.cos(ang) * 225, ny = cy + Math.sin(ang) * 108;
          out += '<line x1="' + cx + '" y1="' + cy + '" x2="' + nx + '" y2="' + ny + '" stroke="' + a2 + '" stroke-width="2"/>';
          out += '<rect x="' + (nx - 72) + '" y="' + (ny - 22) + '" width="144" height="44" rx="' + r + '" fill="' + s2 + '" stroke="' + a2 + '" stroke-width="1.5"/>' + multi(nx, ny, sub(x, C), 18, { f: F, s: 14, c: ink });
        });
        out += '<rect x="' + (cx - 90) + '" y="' + (cy - 28) + '" width="180" height="56" rx="' + r + '" fill="' + a + '"/>' + multi(cx, cy, sub(f.c, C), 18, { f: F, s: 17, c: '#fff', w: 700 });
        return svg(W, H, out);
      }
      case 'ciclo': {
        var p = f.p || [], W2 = 520, H2 = 320, R = 120, out2 = '';
        p.forEach(function (x, i) {
          var g = -Math.PI / 2 + i * 2 * Math.PI / p.length, g2 = -Math.PI / 2 + (i + 1) * 2 * Math.PI / p.length;
          var x1 = 260 + Math.cos(g + 0.36) * R, y1 = 160 + Math.sin(g + 0.36) * R, x2 = 260 + Math.cos(g2 - 0.36) * R, y2 = 160 + Math.sin(g2 - 0.36) * R;
          out2 += flecha(x1, y1, x2, y2, a2);
        });
        p.forEach(function (x, i) {
          var g = -Math.PI / 2 + i * 2 * Math.PI / p.length, nx = 260 + Math.cos(g) * R, ny = 160 + Math.sin(g) * R;
          out2 += '<rect x="' + (nx - 70) + '" y="' + (ny - 22) + '" width="140" height="44" rx="' + (r + 6) + '" fill="' + (i % 2 ? s2 : s1) + '" stroke="' + (i % 2 ? a2 : a) + '" stroke-width="1.5"/>' + multi(nx, ny, sub(x, C), 16, { f: F, s: 14, c: ink, w: 600 });
        });
        return svg(W2, H2, out2, 480);
      }
      case 'flujo': {
        var q = (f.p || []).slice(0, 6), n = q.length, bw = Math.min(150, (680 - (n - 1) * 26) / n), W3 = n * bw + (n - 1) * 26, out3 = '';
        q.forEach(function (x, i) {
          var x0 = i * (bw + 26), rombo = /^¿/.test(x);
          if (rombo) out3 += '<polygon points="' + (x0 + bw / 2) + ',8 ' + (x0 + bw) + ',50 ' + (x0 + bw / 2) + ',92 ' + x0 + ',50" fill="' + s2 + '" stroke="' + a2 + '" stroke-width="1.5"/>';
          else out3 += '<rect x="' + x0 + '" y="22" width="' + bw + '" height="56" rx="' + (i === 0 || i === n - 1 ? 28 : r) + '" fill="' + (i === 0 ? a : s1) + '" stroke="' + a + '" stroke-width="1.5"/>';
          out3 += multi(x0 + bw / 2, 50, sub(x, C), Math.max(8, Math.floor(bw / 8.5)), { f: F, s: 13, c: i === 0 && !rombo ? '#fff' : ink, w: 600 });
          if (i < n - 1) out3 += flecha(x0 + bw + 3, 50, x0 + bw + 23, 50, ink);
        });
        return svg(W3, 100, out3, 680);
      }
      case 'historia': return figura({ t: 'linea', h: C.P.historia }, C);
      case 'linea': {
        var h = f.h || [], W4 = 680, out4 = '<line x1="20" y1="70" x2="660" y2="70" stroke="' + ink + '" stroke-width="2.5"/>';
        h.forEach(function (x, i) {
          var px = 50 + i * (580 / Math.max(1, h.length - 1)), arriba = i % 2 === 0;
          out4 += '<circle cx="' + px + '" cy="70" r="8" fill="' + (arriba ? a : a2) + '"/>';
          out4 += txt(px, arriba ? 44 : 104, x[0], { f: F, s: 16, c: arriba ? a : a2, w: 700 });
          out4 += multi(px, arriba ? 20 : 128, sub(x[1], C), 20, { f: F, s: 12, c: ink });
        });
        return svg(W4, 150, out4);
      }
      case 'recta': {
        var a0 = f.a || 0, z = f.z || 10, W5 = 680, out5 = flecha(10, 50, 670, 50, ink), paso = 640 / (z - a0);
        for (var k = a0; k <= z; k++) {
          var xx = 20 + (k - a0) * paso;
          out5 += '<line x1="' + xx + '" y1="42" x2="' + xx + '" y2="58" stroke="' + ink + '" stroke-width="1.5"/>' + txt(xx, 80, k, { f: F, s: 13, c: ink });
        }
        if (f.m != null) out5 += '<circle cx="' + (20 + (f.m - a0) * paso) + '" cy="50" r="7" fill="' + a + '"/>';
        return svg(W5, 92, out5);
      }
      case 'fraccion': {
        var d = f.d || 4, nn = f.n || 1, cx6 = 70, cy6 = 70, R6 = 60, out6 = '';
        for (var i6 = 0; i6 < d; i6++) {
          var g1 = -Math.PI / 2 + i6 * 2 * Math.PI / d, g2 = g1 + 2 * Math.PI / d;
          out6 += '<path d="M' + cx6 + ',' + cy6 + ' L' + (cx6 + R6 * Math.cos(g1)) + ',' + (cy6 + R6 * Math.sin(g1)) + ' A' + R6 + ',' + R6 + ' 0 0 1 ' + (cx6 + R6 * Math.cos(g2)) + ',' + (cy6 + R6 * Math.sin(g2)) + ' Z" fill="' + (i6 < nn ? a : '#fff') + '" stroke="' + ink + '" stroke-width="1.5"/>';
        }
        return svg(140, 140, out6, f.max || 140);
      }
      case 'bolitas': {
        var cant = f.n || 3, out7 = '', por = 5;
        for (var i7 = 0; i7 < cant; i7++) out7 += '<circle cx="' + (22 + (i7 % por) * 44) + '" cy="' + (22 + Math.floor(i7 / por) * 44) + '" r="16" fill="' + (i7 % 2 ? a2 : a) + '"/>';
        return svg(230, 22 + Math.ceil(cant / por) * 44, out7, 230);
      }
      case 'plano': {
        var m = f.m, b = f.b, out8 = '', u8 = 24, ox = 150, oy = 150;
        for (var g = -6; g <= 6; g++) out8 += '<line x1="' + (ox + g * u8) + '" y1="6" x2="' + (ox + g * u8) + '" y2="294" stroke="' + s1 + '"/><line x1="6" y1="' + (oy + g * u8) + '" x2="294" y2="' + (oy + g * u8) + '" stroke="' + s1 + '"/>';
        out8 += flecha(6, oy, 296, oy, ink) + flecha(ox, 294, ox, 4, ink) + txt(290, oy + 18, 'x', { f: F, s: 13 }) + txt(ox + 12, 14, 'y', { f: F, s: 13 });
        var xa = -6, xb = 6, ya = m * xa + b, yb = m * xb + b;
        out8 += '<line x1="' + (ox + xa * u8) + '" y1="' + (oy - ya * u8) + '" x2="' + (ox + xb * u8) + '" y2="' + (oy - yb * u8) + '" stroke="' + a + '" stroke-width="3"/>';
        out8 += '<circle cx="' + ox + '" cy="' + (oy - b * u8) + '" r="5" fill="' + a2 + '"/>' + txt(ox + 60, 26, 'y = ' + m + 'x + ' + b, { f: F, s: 15, c: a, w: 700 });
        return '<div style="overflow:hidden">' + svg(300, 300, '<clipPath id="cp"><rect x="0" y="0" width="300" height="300"/></clipPath><g clip-path="url(#cp)">' + out8 + '</g>', 280) + '</div>';
      }
      case 'cuentaT': {
        var dd = f.d || [], hh = f.h || [], out9 = txt(170, 26, f.c || 'Cuenta', { f: F, s: 17, w: 700, c: ink });
        out9 += '<line x1="20" y1="40" x2="320" y2="40" stroke="' + ink + '" stroke-width="2.5"/><line x1="170" y1="40" x2="170" y2="' + (60 + Math.max(dd.length, hh.length, 3) * 26) + '" stroke="' + ink + '" stroke-width="2.5"/>';
        out9 += txt(95, 58, 'Debe', { f: F, s: 12, c: a }) + txt(245, 58, 'Haber', { f: F, s: 12, c: a2 });
        dd.forEach(function (v, i) { out9 += txt(150, 84 + i * 26, f.vacia ? '' : din(v, C), { f: T.mono || F, s: 14, a: 'end', c: ink }); });
        hh.forEach(function (v, i) { out9 += txt(310, 84 + i * 26, f.vacia ? '' : din(v, C), { f: T.mono || F, s: 14, a: 'end', c: ink }); });
        return svg(340, 70 + Math.max(dd.length, hh.length, 3) * 26, out9, 320);
      }
      case 'ecuacion': {
        var cajas = [['Activo', 'lo que tiene'], ['=', ''], ['Pasivo', 'lo que debe'], ['+', ''], ['Patrimonio', 'lo que aportan los dueños']], x10 = 0, out10 = '';
        cajas.forEach(function (c) {
          if (!c[1]) { out10 += txt(x10 + 20, 58, c[0], { f: F, s: 30, w: 700, c: ink }); x10 += 40; return; }
          out10 += '<rect x="' + x10 + '" y="14" width="170" height="80" rx="' + r + '" fill="' + s1 + '" stroke="' + a + '" stroke-width="1.5"/>' + txt(x10 + 85, 50, c[0], { f: F, s: 19, w: 700, c: a }) + multi(x10 + 85, 74, c[1], 22, { f: F, s: 11, c: ink });
          x10 += 170;
        });
        return svg(x10, 108, out10, 640);
      }
      case 'balanza': {
        var izq = f.i || '2x + 1', der = f.d || '9';
        var out11 = '<polygon points="280,190 250,230 310,230" fill="' + ink + '"/><line x1="280" y1="60" x2="280" y2="190" stroke="' + ink + '" stroke-width="4"/><line x1="100" y1="70" x2="460" y2="70" stroke="' + ink + '" stroke-width="4"/>';
        out11 += '<line x1="130" y1="70" x2="110" y2="130" stroke="' + ink + '"/><line x1="130" y1="70" x2="150" y2="130" stroke="' + ink + '"/><line x1="430" y1="70" x2="410" y2="130" stroke="' + ink + '"/><line x1="430" y1="70" x2="450" y2="130" stroke="' + ink + '"/>';
        out11 += '<rect x="70" y="130" width="120" height="44" rx="' + r + '" fill="' + s1 + '" stroke="' + a + '"/>' + txt(130, 159, izq, { f: F, s: 18, w: 700, c: a }) + '<rect x="370" y="130" width="120" height="44" rx="' + r + '" fill="' + s2 + '" stroke="' + a2 + '"/>' + txt(430, 159, der, { f: F, s: 18, w: 700, c: a2 });
        return svg(560, 240, out11, 420);
      }
      case 'circulo': {
        var cols = ['#E4232B', '#EE5A24', '#F28C1B', '#F7B71D', '#F7E11D', '#A8C92A', '#3BA84A', '#1E9A8A', '#1F6FB4', '#3B3F99', '#6A3591', '#B3237E'];
        var noms = ['rojo', '', 'naranja', '', 'amarillo', '', 'verde', '', 'azul', '', 'violeta', ''], out12 = '';
        cols.forEach(function (c, i) {
          var g1 = -Math.PI / 2 + i * Math.PI / 6 - Math.PI / 12, g2 = g1 + Math.PI / 6, R1 = 110, R0 = 50;
          out12 += '<path d="M' + (150 + R0 * Math.cos(g1)) + ',' + (150 + R0 * Math.sin(g1)) + ' L' + (150 + R1 * Math.cos(g1)) + ',' + (150 + R1 * Math.sin(g1)) + ' A' + R1 + ',' + R1 + ' 0 0 1 ' + (150 + R1 * Math.cos(g2)) + ',' + (150 + R1 * Math.sin(g2)) + ' L' + (150 + R0 * Math.cos(g2)) + ',' + (150 + R0 * Math.sin(g2)) + ' A' + R0 + ',' + R0 + ' 0 0 0 ' + (150 + R0 * Math.cos(g1)) + ',' + (150 + R0 * Math.sin(g1)) + ' Z" fill="' + c + '" stroke="#fff" stroke-width="2"/>';
          if (noms[i]) { var gm = g1 + Math.PI / 12; out12 += txt(150 + 132 * Math.cos(gm), 150 + 132 * Math.sin(gm) + 4, noms[i], { f: F, s: 12, c: ink }); }
        });
        return svg(300, 300, out12, 300);
      }
      case 'vistas': {
        /* Pieza en L: isométrica + alzado, planta y perfil alineados. */
        var st = 'stroke="' + ink + '" stroke-width="1.6"', iso = function (x, y, z) { return [330 + (x - y) * 0.866 * 18, 150 + (x + y) * 0.5 * 18 - z * 18]; };
        var P0 = function (x, y, z) { var p = iso(x, y, z); return p[0].toFixed(1) + ',' + p[1].toFixed(1); };
        var caras = [
          [[0, 0, 3], [4, 0, 3], [4, 3, 3], [0, 3, 3]].map(function (v, i) { return i < 2 ? v : v; }),
        ];
        var out13 = '';
        out13 += '<polygon points="' + [P0(0, 0, 4), P0(2, 0, 4), P0(2, 3, 4), P0(0, 3, 4)].join(' ') + '" fill="' + s1 + '" ' + st + '/>';
        out13 += '<polygon points="' + [P0(2, 0, 2), P0(5, 0, 2), P0(5, 3, 2), P0(2, 3, 2)].join(' ') + '" fill="' + s1 + '" ' + st + '/>';
        out13 += '<polygon points="' + [P0(0, 3, 0), P0(5, 3, 0), P0(5, 3, 2), P0(2, 3, 2), P0(2, 3, 4), P0(0, 3, 4)].join(' ') + '" fill="' + s2 + '" ' + st + '/>';
        out13 += '<polygon points="' + [P0(5, 0, 0), P0(5, 3, 0), P0(5, 3, 2), P0(5, 0, 2)].join(' ') + '" fill="#fff" ' + st + '/>';
        out13 += '<polygon points="' + [P0(2, 0, 2), P0(2, 3, 2), P0(2, 3, 4), P0(2, 0, 4)].join(' ') + '" fill="#fff" ' + st + '/>';
        out13 += txt(330, 26, 'Isométrica', { f: F, s: 12, c: a, w: 700 });
        var u13 = 14, box = function (x0, y0, pts, lab) { return '<polygon points="' + pts.map(function (p) { return (x0 + p[0] * u13) + ',' + (y0 - p[1] * u13); }).join(' ') + '" fill="none" ' + st + '/>' + txt(x0 + 35, y0 + 18, lab, { f: F, s: 11, c: a2 }); };
        out13 += box(20, 90, [[0, 0], [5, 0], [5, 2], [2, 2], [2, 4], [0, 4]], 'Alzado') + box(20, 200, [[0, 0], [5, 0], [5, 3], [0, 3]], 'Planta') + '<line x1="48" y1="158" x2="48" y2="200" stroke="' + ink + '" stroke-width="1" stroke-dasharray="3 3"/>' + box(120, 90, [[0, 0], [3, 0], [3, 4], [0, 4]], 'Perfil');
        return svg(470, 230, out13, 520);
      }
      case 'pentagrama': {
        var out14 = '';
        for (var l = 0; l < 5; l++) out14 += '<line x1="10" y1="' + (30 + l * 12) + '" x2="590" y2="' + (30 + l * 12) + '" stroke="' + ink + '" stroke-width="1.2"/>';
        var figs = [['Redonda', 4, 'r'], ['Blanca', 2, 'b'], ['Negra', 1, 'n'], ['Corchea', '½', 'c']];
        figs.forEach(function (fg, i) {
          var x = 90 + i * 135, y = 66, rel = fg[2] === 'n' || fg[2] === 'c';
          out14 += '<ellipse cx="' + x + '" cy="' + y + '" rx="9" ry="6.5" transform="rotate(-20 ' + x + ' ' + y + ')" fill="' + (rel ? ink : '#fff') + '" stroke="' + ink + '" stroke-width="2"/>';
          if (fg[2] !== 'r') out14 += '<line x1="' + (x + 8) + '" y1="' + (y - 2) + '" x2="' + (x + 8) + '" y2="' + (y - 42) + '" stroke="' + ink + '" stroke-width="2"/>';
          if (fg[2] === 'c') out14 += '<path d="M' + (x + 8) + ',' + (y - 42) + ' q14,10 10,26" fill="none" stroke="' + ink + '" stroke-width="2"/>';
          out14 += txt(x, 112, fg[0], { f: F, s: 13, c: ink, w: 600 }) + txt(x, 130, fg[1] + (fg[1] === 1 ? ' tiempo' : ' tiempos'), { f: F, s: 12, c: a });
        });
        return svg(600, 140, out14);
      }
      case 'punnett': {
        var gp = f.p1 || ['A', 'a'], gq = f.p2 || ['A', 'a'], out15 = '';
        gp.forEach(function (x, i) { out15 += txt(80 + i * 70, 24, x, { f: F, s: 18, w: 700, c: a }); });
        gq.forEach(function (x, j) { out15 += txt(22, 70 + j * 60, x, { f: F, s: 18, w: 700, c: a2 }); });
        gp.forEach(function (x, i) { gq.forEach(function (y, j) { var g = [x, y].sort(function (m, n) { return m === m.toUpperCase() ? -1 : 1; }).join(''); out15 += '<rect x="' + (45 + i * 70) + '" y="' + (38 + j * 60) + '" width="70" height="60" fill="' + (f.vacia ? '#fff' : s1) + '" stroke="' + ink + '"/>' + (f.vacia ? '' : txt(80 + i * 70, 76 + j * 60, g, { f: F, s: 18, c: ink })); }); });
        return svg(200, 170, out15, 200);
      }
    }
    return '';
  }

  /* ─────────── ejercicios ───────────
     tipo: corta | vf | mc | abierta | dibujo | tabla
     e: enunciado (HTML) · s: solución visible · ac: respuestas aceptadas */
  function it(tipo, e, s, o) { var x = { tipo: tipo, e: e, s: s == null ? '' : String(s) }; if (o) for (var k in o) x[k] = o[k]; if (!x.ac && tipo === 'corta') x.ac = [x.s]; return x; }

  var PALABRAS = [['sol', 'sol'], ['pan', 'pan'], ['tren', 'tren'], ['casa', 'ca-sa'], ['luna', 'lu-na'], ['mesa', 'me-sa'], ['gato', 'ga-to'], ['árbol', 'ár-bol'], ['lápiz', 'lá-piz'], ['pelota', 'pe-lo-ta'], ['zapato', 'za-pa-to'], ['conejo', 'co-ne-jo'], ['caracol', 'ca-ra-col'], ['ventana', 'ven-ta-na'], ['escuela', 'es-cue-la'], ['mariposa', 'ma-ri-po-sa'], ['bicicleta', 'bi-ci-cle-ta'], ['chocolate', 'cho-co-la-te'], ['elefante', 'e-le-fan-te'], ['hipopótamo', 'hi-po-pó-ta-mo']];
  var OPS = [['Compra de mercaderías al contado', 'Mercaderías', 'Caja'], ['Venta de mercaderías a crédito', 'Clientes', 'Ventas'], ['Pago del alquiler del local por transferencia', 'Gasto de alquiler', 'Bancos'], ['Préstamo bancario abonado en la cuenta', 'Bancos', 'Préstamos bancarios'], ['Aporte de los socios en efectivo', 'Caja', 'Capital'], ['Pago a un proveedor con transferencia', 'Proveedores', 'Bancos'], ['Cobro a un cliente en efectivo', 'Caja', 'Clientes'], ['Compra de un computador a crédito', 'Equipos de cómputo', 'Acreedores']];

  var GEN = {
    mat_conteo: function (u, C, r) {
      var n = ent(r, 1, 10);
      return r() < 0.7 ? it('corta', '¿Cuántas bolitas hay? Cuenta tocando cada una.' + '<div style="margin:6px 0">' + figura({ t: 'bolitas', n: n }, C) + '</div>', n, { alto: 5 })
        : it('dibujo', 'Dibuja ' + n + ' ' + pick(r, ['estrellas', 'soles', 'flores', 'pelotas']) + '.', n + ' dibujos');
    },
    mat_suma: function (u, C, r) {
      var lim = { inf: 10, pri1: 50, pri2: 500, pri3: 5000 }[C.bnd] || 100, a = ent(r, 1, lim), b = ent(r, 1, lim), suma = r() < 0.55;
      if (!suma && b > a) { var t = a; a = b; b = t; }
      if (r() < 0.35) {
        var nom = pick(r, C.P.nombres), cosa = pick(r, ['lápices', 'globos', 'galletas', 'canicas', 'libros']);
        return suma ? it('corta', nom + ' tiene ' + num(a, C) + ' ' + cosa + ' y le regalan ' + num(b, C) + '. ¿Cuántos tiene ahora?', num(a + b, C), { ac: [a + b] })
          : it('corta', nom + ' tenía ' + num(a, C) + ' ' + cosa + ' y reparte ' + num(b, C) + '. ¿Cuántos le quedan?', num(a - b, C), { ac: [a - b] });
      }
      return it('corta', num(a, C) + (suma ? ' + ' : ' − ') + num(b, C) + ' =', num(suma ? a + b : a - b, C), { ac: [suma ? a + b : a - b] });
    },
    mat_multi: function (u, C, r) {
      var a = ent(r, 2, 9), b = ent(r, 2, 10);
      if (r() < 0.45) {
        var pr = pick(r, C.P.precios), q = ent(r, 2, 6), nom = pick(r, C.P.nombres), tot = Math.round(q * pr[1] * 100) / 100;
        return it('corta', nom + ' compra ' + q + ' ' + plural(sinArt(pr[0])) + ' a ' + din(pr[1], C) + ' cada ' + (/^una /.test(pr[0]) ? 'una' : 'uno') + '. ¿Cuánto paga en total?', din(tot, C), { ac: [tot, num(tot, C)], x: q + ' × ' + din(pr[1], C) + ' = ' + din(tot, C) });
      }
      return it('corta', a + ' × ' + b + ' =', a * b);
    },
    mat_frac: function (u, C, r) {
      var d = ent(r, 2, 8), n = ent(r, 1, d - 1);
      if (r() < 0.5) return it('corta', '¿Qué fracción está coloreada?<div style="width:26mm;margin:4px 0">' + figura({ t: 'fraccion', n: n, d: d, max: 90 }, C) + '</div>', n + '/' + d, { alto: 5 });
      var a = ent(r, 1, d - 1), b = ent(r, 1, Math.max(1, d - a));
      return it('corta', 'Calcula: ' + a + '/' + d + ' + ' + b + '/' + d + ' =', (a + b) + '/' + d, { x: 'Mismo denominador: se suman los numeradores.' });
    },
    mat_ecua: function (u, C, r) {
      var x = ent(r, -4, 10), a = ent(r, 2, 7), b = ent(r, -9, 12), c = a * x + b;
      if (r() < 0.3) { var k = ent(r, 2, 4), m = ent(r, 1, 15), res = k * x + m; if (x > 0) return it('corta', 'Si al ' + (['', '', 'doble', 'triple', 'cuádruple'][k]) + ' de un número le sumas ' + m + ' obtienes ' + res + '. ¿Qué número es?', x, { x: k + 'x + ' + m + ' = ' + res + ' → x = ' + x }); }
      return it('corta', 'Resuelve: ' + a + 'x ' + (b >= 0 ? '+ ' + b : '− ' + (-b)) + ' = ' + c, 'x = ' + x, { ac: [x, 'x=' + x, 'x = ' + x], x: a + 'x = ' + (c - b) + ' → x = ' + (c - b) + ' / ' + a + ' = ' + x });
    },
    mat_func: function (u, C, r) {
      var m = ent(r, 1, 4), b = ent(r, 0, 6), x = ent(r, 0, 8);
      if (r() < 0.5) {
        var base = C.P.precios[0][1], ba = redondeo(base * 2.5, base), km = redondeo(base * 0.9, base), d = ent(r, 3, 15), t = Math.round((ba + km * d) * 100) / 100;
        return it('corta', 'Un taxi en ' + C.P.ciudades[0] + ' cobra ' + din(ba, C) + ' al subir y ' + din(km, C) + ' por kilómetro. ¿Cuánto cuesta un viaje de ' + d + ' km?', din(t, C), { ac: [t, num(t, C)], x: 'y = ' + num(km, C) + '·x + ' + num(ba, C) });
      }
      return it('corta', 'Si y = ' + m + 'x + ' + b + ', ¿cuánto vale y cuando x = ' + x + '?', m * x + b);
    },
    mat_deriv: function (u, C, r) {
      var a = ent(r, 1, 5), b = ent(r, -6, 6), c = ent(r, -9, 9), d = ent(r, -5, 9);
      var t = function (k, p) { return (k < 0 ? ' − ' : ' + ') + (Math.abs(k) === 1 && p ? '' : Math.abs(k)) + (p ? 'x' + (p > 1 ? ['', '', '²', '³'][p] : '') : ''); };
      var f = (a === 1 ? '' : a) + 'x³' + (b ? t(b, 2) : '') + (c ? t(c, 1) : '') + (d ? t(d, 0) : '');
      var g = (3 * a) + 'x²' + (b ? t(2 * b, 1) : '') + (c ? t(c, 0) : '');
      return it('corta', 'Deriva: f(x) = ' + f, "f'(x) = " + g, { x: 'Regla de la potencia término a término.' });
    },
    mat_porc: function (u, C, r) {
      var base = C.P.precios[2][1], p = pick(r, [10, 15, 20, 25, 50]);
      if (r() < 0.5) {
        var y = redondeo(base * ent(r, 2, 20), base), v = Math.round(y * p) / 100;
        return it('corta', '¿Cuánto es el ' + p + ' % de ' + din(y, C) + '?', din(v, C), { ac: [v, num(v, C)], x: din(y, C) + ' × ' + num(p / 100, C) + ' = ' + din(v, C) });
      }
      var pr = redondeo(base * ent(r, 3, 30), base), iv = Math.round(pr * C.P.imp.p) / 100, tot = Math.round((pr + iv) * 100) / 100;
      return it('corta', 'Un artículo cuesta ' + din(pr, C) + ' sin ' + C.P.imp.n + ' (' + C.P.imp.p + ' %). ¿Cuál es el precio final?', din(tot, C), { ac: [tot, num(tot, C)], x: din(pr, C) + ' + ' + din(iv, C) + ' = ' + din(tot, C) });
    },
    mat_presu: function (u, C, r) {
      var base = C.P.precios[0][1], ing = redondeo(base * ent(r, 400, 700), base * 10);
      var gs = [['Vivienda', 0.3], ['Comida', 0.25], ['Transporte', 0.08], ['Luz, agua y teléfono', 0.07], ['Otros gastos', 0.12]].map(function (g) { return [g[0], redondeo(ing * g[1] * (0.85 + r() * 0.3), base * 10)]; });
      var sum = gs.reduce(function (s, g) { return s + g[1]; }, 0), aho = ing - sum;
      var filas = gs.map(function (g) { return '<tr><td style="padding:3px 8px;border-bottom:1px solid #ccc">' + g[0] + '</td><td style="padding:3px 8px;text-align:right;border-bottom:1px solid #ccc">' + din(g[1], C) + '</td></tr>'; }).join('');
      return it('corta', 'La familia de ' + pick(r, C.P.nombres) + ' ingresa ' + din(ing, C) + ' al mes. ¿Cuánto les queda para ahorrar?<table style="border-collapse:collapse;margin:6px 0;font-size:.92em">' + filas + '</table>', din(aho, C), { ac: [aho, num(aho, C)], alto: 7 });
    },
    con_cuentat: function (u, C, r) {
      var base = C.P.precios[2][1], d = [redondeo(base * ent(r, 100, 400), base), redondeo(base * ent(r, 20, 120), base)], h = [redondeo(base * ent(r, 30, 150), base)];
      if (r() < 0.5) d.push(redondeo(base * ent(r, 10, 60), base));
      var saldo = d.reduce(function (s, x) { return s + x; }, 0) - h.reduce(function (s, x) { return s + x; }, 0);
      return it('corta', 'Calcula el saldo de esta cuenta e indica si es deudor o acreedor.<div style="width:70mm;margin:6px 0">' + figura({ t: 'cuentaT', c: pick(r, ['Caja', 'Bancos', 'Clientes']), d: d, h: h }, C) + '</div>', din(Math.abs(saldo), C) + (saldo >= 0 ? ' (deudor)' : ' (acreedor)'), { ac: [Math.abs(saldo), num(Math.abs(saldo), C)], alto: 8 });
    },
    con_asiento: function (u, C, r) {
      var o = pick(r, OPS), base = C.P.precios[2][1], m = redondeo(base * ent(r, 40, 400), base), dia = ent(r, 1, 28), mes = ent(r, 1, 12);
      var tabla = '<table style="border-collapse:collapse;width:100%;margin:6px 0;font-size:.9em"><tr>' + ['Fecha', 'Cuenta', 'Debe', 'Haber'].map(function (h) { return '<th style="border:1px solid #999;padding:3px 6px;text-align:left">' + h + '</th>'; }).join('') + '</tr>' + [1, 2].map(function () { return '<tr>' + [0, 1, 2, 3].map(function () { return '<td style="border:1px solid #999;height:7mm"></td>'; }).join('') + '</tr>'; }).join('') + '</table>';
      return it('tabla', 'Registra en el libro diario: <b>' + dia + '/' + mes + ' · ' + o[0] + ' por ' + din(m, C) + '.</b>' + tabla, 'Debe: ' + o[1] + ' ' + din(m, C) + ' · Haber: ' + o[2] + ' ' + din(m, C), { alto: 7 });
    },
    con_impuesto: function (u, C, r) {
      var base = C.P.precios[2][1], p = C.P.imp.p;
      if (r() < 0.5) { var b = redondeo(base * ent(r, 20, 300), base), iv = Math.round(b * p) / 100; return it('corta', 'Factura de venta con base de ' + din(b, C) + '. ¿Cuánto ' + C.P.imp.n + ' se cobra al ' + p + ' %?', din(iv, C), { ac: [iv, num(iv, C)] }); }
      var v = redondeo(base * ent(r, 200, 900), base), c = redondeo(base * ent(r, 50, 180), base), liq = Math.round((v - c) * p) / 100;
      return it('corta', 'En el mes se vendió por ' + din(v, C) + ' y se compró por ' + din(c, C) + ' (bases sin impuesto). ¿Cuánto ' + C.P.imp.n + ' hay que pagar?', din(liq, C), { ac: [liq, num(liq, C)], x: '(' + din(v, C) + ' − ' + din(c, C) + ') × ' + p + ' %' });
    },
    con_margen: function (u, C, r) {
      var pr = pick(r, C.P.precios), costo = Math.round(pr[1] * (0.45 + r() * 0.2) * 100) / 100, mg = Math.round((pr[1] - costo) * 100) / 100;
      return it('corta', pick(r, C.P.nombres) + ' vende ' + pr[0] + ' a ' + din(pr[1], C) + ' y le cuesta ' + din(costo, C) + '. ¿Cuánto gana en cada venta?', din(mg, C), { ac: [mg, num(mg, C)] });
    },
    len_silabas: function (u, C, r) {
      var lista = C.bnd === 'inf' ? PALABRAS.slice(0, 12) : PALABRAS, w = pick(r, lista), n = w[1].split('-').length;
      if (C.bnd === 'inf') return it('corta', 'Da una palmada por cada trozo de «<b>' + w[0] + '</b>». ¿Cuántas palmadas das?', n);
      return r() < 0.5 ? it('corta', 'Separa en sílabas: <b>' + w[0] + '</b>', w[1]) : it('corta', '¿Cuántas sílabas tiene «' + w[0] + '»?', n);
    },
    len_sujeto: function (u, C, r) {
      var o = pick(r, [['{n1} prepara {comida} con su abuela.', '{n1}'], ['{n1} y {n2} ensayan una obra de teatro.', '{n1} y {n2}'], ['El río {rio} atraviesa varias regiones.', 'El río {rio}'], ['Mañana viajaremos a {ciudad}.', 'nosotros (sujeto omitido)'], ['Me encanta {musica}.', '{musica}'], ['Los estudiantes de {ciudad} visitaron el museo.', 'Los estudiantes de {ciudad}'], ['En la feria venden artesanías.', 'sujeto indeterminado (ellos)']]);
      return it('corta', 'Subraya el sujeto: «' + sub(o[0], C) + '»', sub(o[1], C));
    },
    soc_fechas: function (u, C, r) {
      var h = C.P.historia;
      if (r() < 0.6) { var x = pick(r, h); return it('corta', '¿Qué ocurrió en ' + x[0] + '?', x[1]); }
      var m = mezcla(r, h.slice(0, 4));
      return it('corta', 'Ordena de más antiguo a más reciente: ' + m.map(function (x) { return '«' + x[1] + '»'; }).join(', '), h.slice(0, 4).filter(function (x) { return m.indexOf(x) >= 0; }).sort(function (a, b) { return a[0] - b[0]; }).map(function (x) { return x[0]; }).join(' → '), { alto: 3 });
    },
    ing_vocab: function (u, C, r) {
      var p = pick(r, u.par || [['hello', 'hola']]);
      return r() < 0.5 ? it('corta', 'Traduce al español: <b>' + p[0] + '</b>', p[1]) : it('corta', 'Translate into English: <b>' + p[1] + '</b>', p[0]);
    },
    ing_tiempos: function (u, C, r) {
      var o = pick(r, [['She ___ (play) tennis every Sunday.', 'plays'], ['Look! The baby ___ (sleep).', 'is sleeping'], ['I ___ (not like) coffee.', "don't like"], ['They ___ (study) for an exam at the moment.', 'are studying'], ['My father usually ___ (cook) on Sundays.', 'cooks'], ['We ___ (watch) a film now.', 'are watching'], ['{n1} ___ (live) in {ciudad}.', 'lives']]);
      return it('corta', 'Complete: ' + sub(o[0], C), o[1]);
    },
    mus_tiempos: function (u, C, r) {
      var F = [['redonda', 4], ['blanca', 2], ['negra', 1], ['corchea', 0.5]], a = pick(r, F), b = pick(r, F), c = r() < 0.5 ? pick(r, F) : null;
      var t = a[1] + b[1] + (c ? c[1] : 0);
      return it('corta', '¿Cuántos tiempos suman una ' + a[0] + ', una ' + b[0] + (c ? ' y una ' + c[0] : '') + '?', num(t, C), { ac: [t, num(t, C)] });
    },
    nat_punnett: function (u, C, r) {
      var cr = pick(r, [[['A', 'a'], ['A', 'a'], '3 dominantes : 1 recesivo (75 % / 25 %)'], [['A', 'a'], ['a', 'a'], '1 : 1 (50 % dominante, 50 % recesivo)'], [['A', 'A'], ['a', 'a'], '100 % dominante (todos Aa)']]);
      return it('tabla', 'Completa el cuadro de Punnett para ' + cr[0].join('') + ' × ' + cr[1].join('') + ' y escribe la proporción de fenotipos.<div style="width:45mm;margin:6px 0">' + figura({ t: 'punnett', p1: cr[0], p2: cr[1], vacia: true }, C) + '</div>', cr[2], { alto: 8 });
    },
    tec_traza: function (u, C, r) {
      if (r() < 0.5) { var a = ent(r, 1, 9), b = ent(r, 1, 9), c = ent(r, 2, 4); return it('corta', 'Sigue el programa: <code>x = ' + a + '; x = x + ' + b + '; x = x * ' + c + '</code>. ¿Cuánto vale x al final?', (a + b) * c); }
      var n = ent(r, 3, 10);
      return it('corta', 'Sigue el programa: <code>suma = 0; para i de 1 a ' + n + ': suma = suma + i</code>. ¿Cuánto vale suma?', n * (n + 1) / 2);
    }
  };

  var MARCOS = [
    function (k) { return 'Explica con tus palabras qué es «' + k + '» y pon un ejemplo.'; },
    function (k) { return 'Escribe una oración con la palabra «' + k + '».'; },
    function (k, C) { return 'Busca un ejemplo de «' + k + '» en tu casa, en tu barrio o en ' + C.P.ciudades[0] + '. Anota dónde lo viste.'; },
    function (k) { return 'Cuéntale a alguien de tu familia qué significa «' + k + '». Escribe qué te dijo.'; },
    function (k) { return 'Dibuja y rotula algo que represente «' + k + '».'; },
    function (k) { return 'Escribe una pregunta sobre «' + k + '» que le harías a tu profesor o profesora.'; }
  ];

  var CACHE_GEN = {};
  function generico(u, C, r) {
    var clave = u.id + ':' + C.pk + ':' + C.peque;
    if (!CACHE_GEN[clave]) CACHE_GEN[clave] = genericoBase(u, C);
    return mezcla(r, CACHE_GEN[clave]).map(function (x) { return Object.assign({}, x); });
  }
  function genericoBase(u, C) {
    var pool = [];
    (u.vf || []).forEach(function (v) { pool.push(it('vf', sub(v[0], C), v[1] ? 'V' : 'F')); });
    (u.rep || []).forEach(function (q) { pool.push(it('mc', q.p, 'abc'.charAt(q.c) + ') ' + q.o[q.c], { o: q.o, c: q.c, x: q.x })); });
    (u.i || []).forEach(function (idea) {
      var s = sub(idea, C);
      (u.k || []).some(function (k0) {
        var k = sub(k0, C), i = s.toLowerCase().indexOf(k.toLowerCase());
        if (i >= 0 && k.length > 2) { pool.push(it('corta', 'Completa: «' + s.slice(0, i) + '<span style="display:inline-block;min-width:26mm;border-bottom:1.5px solid currentColor">&#160;</span>' + s.slice(i + k.length) + '»', k)); return true; }
        return false;
      });
    });
    (u.q || []).forEach(function (q) { pool.push(it('abierta', sub(q, C), '', { lin: C.peque ? 2 : 3 })); });
    (u.err || []).forEach(function (e) { pool.push(it('abierta', 'Error frecuente: «' + e + '». ¿Qué harías para evitarlo?', '', { lin: 2 })); });
    (u.k || []).forEach(function (k0) {
      var k = sub(k0, C);
      MARCOS.forEach(function (f) {
        var e = sub(f(k, C), C);
        pool.push(/^Dibuja/.test(f(k, C)) ? it('dibujo', e, '') : it('abierta', e, '', { lin: 2 }));
      });
    });
    return pool;
  }

  function ejercicios(u, C, r, n) {
    var g = GEN[u.g], out = [], gen = generico(u, C, r), gi = 0;
    for (var i = 0; i < n; i++) {
      if (g && (r() < 0.72 || !gen.length)) { var gx = g(u, C, r); gx.e = sub(gx.e, C); out.push(gx); }
      else if (gen.length) out.push(gen[gi++ % gen.length]);
      else out.push(it('abierta', 'Escribe lo más importante que has aprendido en «' + sub(u.t, C) + '».', '', { lin: 3 }));
    }
    return out;
  }

  /* Alto estimado de un ejercicio, en líneas de texto del cuerpo. */
  function alto(x, C) {
    var cpl = Math.round(620 / (C.fs * 0.52)), base = Math.ceil(String(x.e).replace(/<[^>]+>/g, '').length / cpl) + 0.6;
    if (x.alto) base += x.alto;
    if (x.tipo === 'corta') return base + 1.4;
    if (x.tipo === 'vf') return base + 0.6;
    if (x.tipo === 'mc') return base + 1.6 + (x.o || []).length * 0.4;
    if (x.tipo === 'abierta') return base + (x.lin || 2) * 1.5;
    if (x.tipo === 'dibujo') return base + 7;
    return base + 2;
  }
  function presupuesto(C, extra) {
    var util = (C.papel.h - 46) * 3.78 - (extra || 0);
    return util / (C.fs * 1.55);
  }
  function llenar(u, C, r, lineas) {
    var cand = ejercicios(u, C, r, 11), out = [], usado = 0, max = C.peque ? 4 : C.cfg.facil ? 5 : 7;
    for (var i = 0; i < cand.length && out.length < max; i++) {
      var h = alto(cand[i], C);
      if (usado + h > lineas) continue;
      out.push(cand[i]); usado += h;
    }
    if (!out.length) out.push(cand[0]);
    return out;
  }

  /* ─────────── el guía ─────────── */
  var FRASES = {
    apertura: ['Hola, soy {g}. En esta unidad vamos a descubrir «{t}». Vamos paso a paso.', 'Soy {g} y te acompaño en «{t}». Lo que no entiendas a la primera, lo volvemos a mirar juntos.'],
    explica: ['Lee despacio. Si una palabra es nueva, búscala en el glosario del final.', 'Subraya lo que te parezca más importante: es tu libro.', 'Si puedes explicárselo a otra persona, ya lo has entendido.', 'Haz un dibujo rápido de la idea en el margen.', 'Busca la frase que resume la página y márcala.', 'Relaciona lo nuevo con algo que ya sabías.', 'Hazte una pregunta al terminar de leer y respóndela sin mirar.'],
    ejemplo: ['Esto no pasa solo en los libros: pasa cerca de ti.', 'Mira a tu alrededor: seguro que encuentras otro ejemplo.', 'Fíjate en cada paso: el orden importa.', 'Tapa la solución e intenta resolverlo antes de mirarla.', 'Cambia un dato del ejemplo y comprueba qué pasa.', '¿Dónde viste algo parecido esta semana?'],
    actividad: ['Equivocarse es parte de aprender. Borra, respira y vuelve a intentarlo.', 'Empieza por la que te resulte más fácil.', 'Si te atascas, vuelve a la página de explicación: la respuesta está allí.', 'Hazlo a tu ritmo. Nadie corre.', 'Lee cada enunciado dos veces antes de responder.', 'Cuando termines, revisa una sola respuesta con calma: ¿la explicarías en voz alta?', 'Si dudas entre dos respuestas, piensa por qué descartarías cada una.', 'Tacha lo que ya has hecho: ver el avance anima.', 'Si algo sale mal, apunta qué pasó; ese error es una pista.', 'Trabaja con lápiz: así puedes corregir sin miedo.', 'Busca una palabra clave en cada pregunta antes de empezar.', 'Descansa un minuto a mitad de página si lo necesitas.'],
    repaso: ['Mira todo lo que ya sabes.', 'Marca con sinceridad: así sabremos qué repasar.', 'Lo que marques como difícil, repásalo mañana.', 'Compara esta página con la primera de la unidad: ¡cuánto has avanzado!']
  };
  function frase(tipo, C, r, u) {
    var f = u && u.h && tipo === 'explica' ? u.h : pick(r, FRASES[tipo] || FRASES.explica);
    if (C.adulto) f = f.replace('Hola, soy', 'Soy').replace('es tu libro', 'es su material de trabajo');
    return sub(f.replace('{g}', C.guia.n).replace('{t}', u ? sub(u.t, C) : ''), C);
  }

  /* ─────────── ensamblado ─────────── */
  function nucleoLibro(u, idx, C, r, extra) {
    var pags = [
      { tipo: 'apertura', u: u, n: idx + 1 },
      { tipo: 'explica', u: u, n: idx + 1 },
      { tipo: 'ejemplo', u: u, n: idx + 1 }
    ];
    for (var i = 0; i <= extra; i++) pags.push({ tipo: 'actividad', u: u, n: idx + 1, k: i, relleno: i > 0 });
    pags.push({ tipo: 'repaso', u: u, n: idx + 1 });
    return pags;
  }

  function ensamblar(cfg) {
    var CU = window.EU_CURRICULO, C = contexto(cfg);
    var pool = CU.unidades(C.mat, C.bnd).filter(function (u) { return u._ajuste < 2.6; });
    if (!pool.length) pool = CU.unidades(C.mat, C.bnd).slice(0, 3);
    var N = Math.max(4, Math.min(500, cfg.paginas || 40)), r = rng(hash(C.pk + C.mat + C.bnd + C.prod.id) + C.semilla * 7919);
    var p = C.prod.id, pages;

    if (PROD_EXT[p]) pages = PROD_EXT[p].armar(C, pool, N, r, H);
    else if (p === 'libro' || p === 'ebook' || p === 'cuaderno') pages = armarLibro(C, pool, N, r);
    else if (p === 'fichas') pages = ciclo(pool, N, function (u, i, k) { return { tipo: 'ficha', u: u, n: pool.indexOf(u) + 1, k: k, relleno: i >= pool.length }; });
    else if (p === 'unidad') pages = armarUnidad(C, pool, N);
    else if (p === 'examen') pages = armarExamen(C, pool, N, r);
    else if (p === 'rubrica') pages = ciclo(pool, N, function (u, i, k) { return { tipo: k % 2 ? 'cotejo' : 'rubrica', u: u, n: pool.indexOf(u) + 1, k: k }; }, 2);
    else if (p === 'laminas') pages = ciclo(pool, N, function (u, i, k) { return { tipo: 'lamina', u: u, n: pool.indexOf(u) + 1, k: k }; }, 3);
    else if (p === 'presentacion') pages = armarPresentacion(C, pool, N);
    else if (p === 'trabajo') pages = armarTrabajo(C, pool, N);
    else pages = armarLibro(C, pool, N, r);

    /* Los ejercicios se fijan aquí (determinados por la semilla) para que el solucionario los conozca. */
    if (p === 'libro' || p === 'ebook' || p === 'cuaderno' || p === 'fichas') ajustar(pages, C, N);
    else pages.forEach(function (pg, i) { pg.num = i + 1; fijarItems(pg, C); });
    var usadas = []; pages.forEach(function (pg) { if (pg.u && usadas.indexOf(pg.u) < 0) usadas.push(pg.u); });
    return { C: C, pages: pages, unidades: usadas.length ? usadas : pool };
  }

  function ciclo(pool, N, fn, porU) {
    var out = [];
    for (var i = 0; i < N; i++) {
      var ui = porU ? Math.floor(i / porU) % pool.length : i % pool.length, k = porU ? i % porU + porU * Math.floor(i / (porU * pool.length)) : Math.floor(i / pool.length);
      out.push(fn(pool[ui], i, k));
    }
    return out;
  }

  function armarLibro(C, pool, N, r) {
    var cuaderno = C.prod.id === 'cuaderno';
    var front = N >= 20 ? ['portada', 'creditos', 'indice', 'presentacion'] : ['portada', 'indice'];
    var back = [];
    if (N >= 30 && !cuaderno) back.push('glosario');
    if (N >= 16) back.push('bibliografia');
    back.push('contra');
    var base = cuaderno ? 2 : 5;
    var libre = N - front.length - back.length - (C.solucion ? Math.max(1, Math.ceil(N / 45)) : 0);
    var k = Math.max(1, Math.min(pool.length, Math.floor(libre / (base + (N > 80 ? 3 : 1)))));
    var units = pool.slice(0, k);
    var extra = Math.max(0, libre - k * base), per = Math.floor(extra / k), sobra = extra - per * k;
    var core = [];
    units.forEach(function (u, i) {
      var ex = per + (i < sobra ? 1 : 0);
      if (cuaderno) {
        core.push({ tipo: 'apertura', u: u, n: i + 1, mini: true });
        for (var j = 0; j <= ex; j++) core.push(j > 0 && j % 5 === 4 ? { tipo: 'apuntes', u: u, n: i + 1, relleno: true } : { tipo: 'actividad', u: u, n: i + 1, k: j, relleno: j > 0 });
      } else core = core.concat(nucleoLibro(u, i, C, r, Math.max(0, ex - 1)));
    });
    var pages = front.map(function (t) { return { tipo: t }; }).concat(core).concat(back.filter(function (t) { return t !== 'contra'; }).map(function (t) { return { tipo: t }; }));
    pages.push({ tipo: 'contra' });
    return pages;
  }

  function armarUnidad(C, pool, N) {
    var tipos = ['ud_portada', 'ud_marco', 'ud_objetivos', 'ud_sesiones', 'ud_dua', 'ud_eval'];
    var out = [{ tipo: 'portada' }];
    var i = 0;
    while (out.length < N) { var u = pool[Math.floor(i / tipos.length) % pool.length]; out.push({ tipo: tipos[i % tipos.length], u: u, n: pool.indexOf(u) + 1, k: Math.floor(i / (tipos.length * pool.length)) }); i++; }
    return out.slice(0, N);
  }

  function armarExamen(C, pool, N, r) {
    var out = [], v = 0, letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while (out.length < N) {
      var u = pool[v % pool.length], L = letras.charAt(v % 26) + (v >= 26 ? Math.floor(v / 26) + 1 : '');
      var rr = rng(hash(u.id + ':examen:' + v) + C.semilla * 31), items = [];
      var mix = pool.length > 1 ? [u, pool[(v + 1) % pool.length]] : [u];
      mix.forEach(function (x) { items = items.concat(ejercicios(x, C, rr, 6)); });
      items = items.filter(function (x) { return x.tipo !== 'dibujo'; }).slice(0, C.peque ? 6 : 10);
      var pts = Math.round(1000 / items.length) / 100; items.forEach(function (x, i) { x.pt = i === items.length - 1 ? Math.round((10 - pts * (items.length - 1)) * 100) / 100 : pts; });
      var lim = presupuesto(C, 180), a = [], b = [], s = 0;
      items.forEach(function (x) { var h = alto(x, C); if (s + h <= lim) { a.push(x); s += h; } else b.push(x); });
      out.push({ tipo: 'examen', u: u, mix: mix, items: a, modelo: L, parte: 1, fijo: true });
      if (b.length && out.length < N) out.push({ tipo: 'examen', u: u, mix: mix, items: b, modelo: L, parte: 2, offset: a.length, fijo: true });
      if (C.solucion && out.length < N) out.push({ tipo: 'examen_sol', u: u, items: a.concat(b), modelo: L });
      v++;
      if (v > 400) break;
    }
    return out.slice(0, N);
  }

  function armarPresentacion(C, pool, N) {
    var out = [{ tipo: 's_portada' }], i = 0;
    var porU = [];
    pool.forEach(function (u, ui) {
      var l = [{ tipo: 's_titulo', u: u, n: ui + 1 }];
      (u.i || []).forEach(function (idea, k) { l.push({ tipo: 's_idea', u: u, n: ui + 1, k: k }); });
      l.push({ tipo: 's_figura', u: u, n: ui + 1 });
      l.push({ tipo: 's_pregunta', u: u, n: ui + 1 });
      porU.push(l);
    });
    var flat = [].concat.apply([], porU);
    while (out.length < N - 1) { var x = Object.assign({}, flat[i % flat.length]); if (i >= flat.length) x.repaso = Math.floor(i / flat.length); out.push(x); i++; }
    out.push({ tipo: 's_cierre' });
    return out.slice(0, N);
  }

  function armarTrabajo(C, pool, N) {
    var out = [{ tipo: 't_portada' }, { tipo: 'indice' }, { tipo: 't_intro', u: pool[0] }];
    var fin = [{ tipo: 't_conclusion' }, { tipo: 't_biblio' }];
    if (N >= 8) fin.push({ tipo: 't_anexos' });
    var hueco = Math.max(1, N - out.length - fin.length), ideas = [];
    pool.forEach(function (u) { (u.i || []).forEach(function (idea, k) { ideas.push({ u: u, k: k }); }); });
    for (var i = 0; i < hueco; i++) { var id = ideas[i % ideas.length]; out.push({ tipo: 't_desarrollo', u: id.u, k: id.k, n: i + 1 }); }
    return out.concat(fin).slice(0, N);
  }

  /* Ajuste a la extensión exacta: el solucionario ocupa páginas, así que se
     quitan o se añaden páginas de práctica hasta cuadrar con lo pedido. */
  function fijarItems(pg, C) {
    if ((pg.tipo === 'actividad' || pg.tipo === 'ficha') && !pg.items) {
      var rr = rng(hash((pg.u.id || '') + ':' + pg.k + ':' + pg.tipo) + C.semilla * 104729);
      pg.items = llenar(pg.u, C, rr, presupuesto(C, pg.tipo === 'ficha' ? 150 : 110));
    }
  }
  function ajustar(pages, C, N) {
    var conSol = C.solucion, porPag = Math.max(4, Math.floor(presupuesto(C, 60) / 3.2)), fichas = C.prod.id === 'fichas';
    var conItems = function () { return pages.filter(function (p) { return p.items && (p.tipo === 'actividad' || p.tipo === 'ficha'); }).length; };
    var nSol = function () { return conSol ? Math.max(1, Math.ceil(conItems() / porPag)) : 0; };
    var unidades = []; pages.forEach(function (p) { if (p.u && unidades.indexOf(p.u) < 0) unidades.push(p.u); });
    var kExtra = 100, relleno = 0;
    pages.forEach(function (p) { fijarItems(p, C); });
    var dir = 0;
    var huecoUnidad = function (u) {
      var idx = -1; for (var q2 = pages.length - 1; q2 >= 0; q2--) if (pages[q2].u === u) { idx = q2; break; }
      if (idx >= 0 && pages[idx].tipo === 'repaso') idx--;
      return idx;
    };
    for (var v = 0; v < 700; v++) {
      var tot = pages.length + nSol();
      if (tot === N) break;
      if (tot > N) {
        if (dir === 1) break;
        dir = -1;
        var cuenta = {}, mejor = null;
        pages.forEach(function (p) { if (p.relleno) { cuenta[p.u.id] = (cuenta[p.u.id] || 0) + 1; if (!mejor || cuenta[p.u.id] > cuenta[mejor]) mejor = p.u.id; } });
        if (!mejor) break;
        var j = -1; for (var q = pages.length - 1; q >= 0; q--) if (pages[q].relleno && pages[q].u.id === mejor) { j = q; break; }
        pages.splice(j, 1);
      } else {
        if (dir === -1) break;
        dir = 1;
        if (!unidades.length) break;
        var u = unidades[relleno++ % unidades.length], idx = huecoUnidad(u);
        if (idx < 0) break;
        var nueva = { tipo: fichas ? 'ficha' : 'actividad', u: u, n: pages[idx].n, k: kExtra++, relleno: true };
        fijarItems(nueva, C);
        pages.splice(idx + 1, 0, nueva);
      }
    }
    ['glosario', 'bibliografia', 'presentacion', 'creditos'].forEach(function (t) {
      if (pages.length + nSol() > N) { var i = pages.map(function (p) { return p.tipo; }).indexOf(t); if (i >= 0) pages.splice(i, 1); }
    });
    var ns = nSol(), sol = [];
    for (var s = 0; s < ns; s++) sol.push({ tipo: 'solucion', parte: s });
    var tipos = pages.map(function (p) { return p.tipo; }), pos = tipos.indexOf('bibliografia');
    if (pos < 0) pos = tipos.indexOf('contra');
    if (pos < 0) pos = pages.length;
    pages.splice.apply(pages, [pos, 0].concat(sol));
    var ap = 0;
    while (pages.length < N) {
      var uu = unidades[ap++ % Math.max(1, unidades.length)], at = uu ? huecoUnidad(uu) + 1 : pos;
      pages.splice(at, 0, { tipo: 'apuntes', u: uu, n: uu ? pages[at - 1].n : 1 });
    }
    while (pages.length > N) {
      var k2 = -1; for (var q3 = pages.length - 1; q3 >= 0; q3--) if (pages[q3].u && pages[q3].tipo !== 'apertura') { k2 = q3; break; }
      if (k2 < 0) { pages.splice(pages.length - 2, 1); continue; }
      pages.splice(k2, 1);
    }
    pages.forEach(function (p, i) { p.num = i + 1; });
    var e = []; pages.forEach(function (p) { if (p.items && (p.tipo === 'actividad' || p.tipo === 'ficha')) e.push({ p: p.num, items: p.items, u: p.u }); });
    pages.filter(function (p) { return p.tipo === 'solucion'; }).forEach(function (p, i, arr) { p.entradas = i === arr.length - 1 ? e.slice(i * porPag) : e.slice(i * porPag, (i + 1) * porPag); });
  }

  /* ─────────── render de páginas ─────────── */
  function estiloPagina(C, pg) {
    var T = C.T, W = C.papel.w, H = C.papel.h;
    var fondo = T.bg;
    if (T.pauta && (pg.tipo === 'apuntes' || pg.tipo === 't_desarrollo')) fondo = T.bg + ';background-image:repeating-linear-gradient(to bottom,transparent 0,transparent 8.6mm,' + T.soft + ' 8.6mm,' + T.soft + ' 9mm)';
    if (T.reticula) fondo = T.bg + ';background-image:linear-gradient(' + T.soft + ' 1px,transparent 1px),linear-gradient(90deg,' + T.soft + ' 1px,transparent 1px);background-size:5mm 5mm';
    var slide = C.papelId === 'slide';
    return 'width:' + W + 'mm;height:' + H + 'mm;position:relative;overflow:hidden;box-sizing:border-box;padding:' + (slide ? '14mm 18mm' : '16mm 17mm 20mm') + ';background:' + fondo + ';color:' + T.ink + ';font-family:' + T.cuerpo + ';font-size:' + C.fs + 'px;line-height:' + (C.cfg.facil || C.cfg.dislexia ? 1.8 : 1.5) + ';' + (C.cfg.dislexia ? 'letter-spacing:.03em;word-spacing:.12em;' : '') + '-webkit-print-color-adjust:exact;print-color-adjust:exact;text-align:left';
  }
  function h1(C, s, extra) { var T = C.T; return '<h1 style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * (C.peque ? 1.9 : 2.1)) + 'px;line-height:1.1;margin:0 0 5mm;color:' + T.ink + ';text-wrap:balance;' + (extra || '') + '">' + s + '</h1>'; }
  function h2(C, s, col) { var T = C.T; return '<h2 style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 1.3) + 'px;line-height:1.2;margin:5mm 0 2.5mm;color:' + (col || T.acc) + '">' + s + '</h2>'; }
  function cabecera(C, pg) {
    var T = C.T, izq = esc(C.matN.replace(/^.*·\s*/, '')) + (C.libre ? '' : ' · ' + esc(C.cursoN)), der = pg.cab != null ? esc(pg.cab) : pg.u && pg.n && pg.tipo !== 't_desarrollo' ? 'Unidad ' + pg.n + ' · ' + esc(sub(pg.u.t, C)) : '';
    if (T.id === 'juego') return '<div style="display:flex;justify-content:space-between;gap:4mm;margin-bottom:6mm;font-size:.72em;font-weight:700"><span style="background:' + T.acc + ';color:#fff;border-radius:99px;padding:1.2mm 4mm">' + izq + '</span><span style="background:' + T.soft2 + ';color:' + T.acc2 + ';border-radius:99px;padding:1.2mm 4mm;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60%">' + der + '</span></div>';
    return '<div style="display:flex;justify-content:space-between;gap:4mm;margin-bottom:6mm;padding-bottom:2mm;border-bottom:' + (T.id === 'editorial' ? '0.4mm solid ' + T.ink : '1px solid ' + T.soft) + ';font-size:.7em;letter-spacing:.08em;text-transform:uppercase;color:' + T.acc + ';font-weight:600"><span>' + izq + '</span><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60%">' + der + '</span></div>';
  }
  function folio(C, pg) {
    var par = pg.num % 2 === 0;
    return '<div style="position:absolute;bottom:8mm;' + (par ? 'left:17mm' : 'right:17mm') + ';font-size:.75em;color:' + C.T.ink + ';opacity:.65;font-variant-numeric:tabular-nums">' + pg.num + '</div>';
  }
  function avatar(C, mm) {
    var T = C.T;
    if (C.guia.img) return '<img src="' + C.guia.img + '" alt="' + esc(C.guia.n) + '" style="width:' + mm + 'mm;height:' + mm + 'mm;border-radius:50%;object-fit:cover;flex:none;border:0.6mm solid ' + T.acc + '"/>';
    return '<div style="width:' + mm + 'mm;height:' + mm + 'mm;border-radius:50%;flex:none;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-family:' + T.tit + ';font-weight:700;font-size:' + (mm * 1.6) + 'px">' + esc(C.guia.n.charAt(0)) + '</div>';
  }
  function guia(C, texto, abajo) {
    var T = C.T;
    return '<div style="' + (abajo ? 'position:absolute;left:17mm;right:17mm;bottom:15mm;' : 'margin:4mm 0;') + 'display:flex;gap:3.5mm;align-items:center">' + avatar(C, 13) +
      '<div style="background:' + T.soft2 + ';border-radius:' + Math.max(T.r, 6) + 'px;padding:2.4mm 4mm;font-size:.92em;line-height:1.45"><b style="color:' + T.acc2 + '">' + esc(C.guia.n) + ':</b> ' + esc(texto) + '</div></div>';
  }
  function chipsClave(C, u) {
    var T = C.T;
    return '<div style="display:flex;flex-wrap:wrap;gap:2mm;margin:3mm 0">' + (u.k || []).map(function (k) { return '<span style="border:1px solid ' + T.acc + ';color:' + T.acc + ';border-radius:' + (T.r ? 99 : 0) + 'px;padding:.6mm 3mm;font-size:.85em">' + esc(sub(k, C)) + '</span>'; }).join('') + '</div>';
  }
  function marcoImagen(C, texto, altoMm, img) {
    var T = C.T;
    if (img) return '<img src="' + img + '" alt="" style="width:100%;height:' + altoMm + 'mm;object-fit:cover;border-radius:' + T.r + 'px;display:block"/>';
    return '<div style="height:' + altoMm + 'mm;border:0.5mm dashed ' + T.acc2 + ';border-radius:' + T.r + 'px;display:flex;align-items:center;justify-content:center;color:' + T.acc2 + ';font-size:.85em;text-align:center;padding:4mm;box-sizing:border-box;background:' + T.soft2 + '">' + esc(texto) + '</div>';
  }
  function lineas(n, C) { var s = ''; for (var i = 0; i < n; i++) s += '<div style="height:' + (C.fs * 1.5) + 'px;border-bottom:1px solid ' + C.T.ink + ';opacity:.35"></div>'; return s; }

  function itemHTML(x, i, C, modo, grupo) {
    var T = C.T, pt = x.pt ? ' <span style="opacity:.7;font-size:.85em">(' + num(x.pt, C) + ' p.)</span>' : '';
    var enun = '<div style="display:flex;gap:2.5mm"><b style="color:' + T.acc + ';flex:none;font-variant-numeric:tabular-nums">' + (i + 1) + '.</b><div style="flex:1;min-width:0">' + x.e + pt;
    var web = modo === 'web', g = grupo + '_' + i, resp = '';
    if (x.tipo === 'corta' || x.tipo === 'tabla') {
      resp = web && x.tipo === 'corta' ? '<input data-acepta="' + esc((x.ac || [x.s]).join('|')) + '" style="margin-top:1.5mm;font:inherit;padding:1mm 2mm;border:1px solid ' + T.ink + ';border-radius:4px;width:60%;background:#fff" aria-label="Respuesta"/>'
        : x.tipo === 'corta' ? '<div style="height:' + (C.fs * 1.5) + 'px;border-bottom:1px solid ' + T.ink + ';opacity:.4;width:70%"></div>' : '';
    } else if (x.tipo === 'vf') {
      resp = web ? '<div style="display:flex;gap:4mm;margin-top:1mm">' + ['V', 'F'].map(function (v) { return '<label style="display:flex;gap:1.5mm;align-items:center"><input type="radio" name="' + g + '" value="' + v + '"' + (v === x.s ? ' data-ok="1"' : '') + '/>' + (v === 'V' ? 'Verdadero' : 'Falso') + '</label>'; }).join('') + '</div>'
        : '<div style="display:flex;gap:4mm;margin-top:1mm">' + ['V', 'F'].map(function (v) { return '<span style="display:inline-flex;align-items:center;justify-content:center;width:7mm;height:7mm;border:1px solid ' + T.ink + ';border-radius:' + (T.r ? 4 : 0) + 'px;font-weight:700">' + v + '</span>'; }).join('') + '</div>';
    } else if (x.tipo === 'mc') {
      resp = '<div style="display:flex;flex-direction:column;gap:1mm;margin-top:1mm">' + (x.o || []).map(function (o, k) {
        return web ? '<label style="display:flex;gap:2mm;align-items:flex-start"><input type="radio" name="' + g + '"' + (k === x.c ? ' data-ok="1"' : '') + '/>' + esc(o) + '</label>'
          : '<div style="display:flex;gap:2mm"><span style="flex:none;width:4mm;height:4mm;border:1px solid ' + T.ink + ';border-radius:50%;margin-top:1mm"></span>' + 'abc'.charAt(k) + ') ' + esc(o) + '</div>';
      }).join('') + '</div>';
    } else if (x.tipo === 'abierta') {
      resp = web ? '<textarea rows="' + (x.lin || 2) + '" style="width:100%;margin-top:1.5mm;font:inherit;padding:1.5mm;border:1px solid ' + T.ink + ';border-radius:4px;box-sizing:border-box;background:#fff" aria-label="Respuesta"></textarea>' : lineas(x.lin || 2, C);
    } else if (x.tipo === 'dibujo') {
      resp = '<div style="height:32mm;border:1px solid ' + T.ink + ';opacity:.5;border-radius:' + T.r + 'px;margin-top:1.5mm"></div>';
    }
    var apoyo = C.cfg.dua && x.x && modo !== 'sol' ? '<div style="font-size:.85em;margin-top:1mm;color:' + T.acc2 + '">Pista: ' + esc(x.x) + '</div>' : '';
    return '<div style="margin:0 0 4mm;break-inside:avoid">' + enun + resp + apoyo + '</div></div></div>';
  }

  var RENDER = {
    portada: function (pg, C, modo, ctx) {
      var T = C.T, img = C.cfg.portadaImg;
      var sub1 = C.libre ? esc(C.cfg.subtitulo || C.subtitulo || '') : esc(C.cursoN) + ' · ' + esc(C.N.n), marco = C.libre ? esc(C.P.id === 'us' ? 'Estados Unidos' : C.P.n) : esc(C.P.marcoCorto) + ' · ' + esc(C.P.id === 'us' ? 'Estados Unidos' : C.P.n);
      var deco = T.id === 'juego' ? '<div style="position:absolute;right:-30mm;top:-30mm;width:120mm;height:120mm;border-radius:50%;background:' + T.soft + '"></div><div style="position:absolute;left:-20mm;bottom:40mm;width:70mm;height:70mm;border-radius:50%;background:' + T.soft2 + '"></div>'
        : T.id === 'editorial' ? '<div style="position:absolute;left:17mm;right:17mm;top:16mm;border-top:1.4mm solid ' + T.ink + '"></div><div style="position:absolute;left:17mm;right:17mm;top:19mm;border-top:0.3mm solid ' + T.ink + '"></div>'
          : T.id === 'tecnica' ? '<div style="position:absolute;left:0;top:0;bottom:0;width:9mm;background:' + T.acc + '"></div>' : '<div style="position:absolute;left:17mm;top:16mm;width:24mm;height:1.2mm;background:' + T.acc + '"></div>';
      return deco + '<div style="position:relative;height:100%;display:flex;flex-direction:column">' +
        '<div style="margin-top:14mm;font-size:.8em;letter-spacing:.14em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">' + esc(C.matN) + '</div>' +
        h1(C, esc(C.titulo), 'font-size:' + (C.fs * (C.peque ? 3.2 : 3.4)) + 'px;margin-top:4mm') +
        '<div style="font-size:1.15em">' + sub1 + '</div>' +
        '<div style="flex:1;margin:10mm 0;display:flex;flex-direction:column;justify-content:center">' + marcoImagen(C, 'Ilustración de portada: súbela en «Imágenes» del panel', 90, img) + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-end;gap:6mm"><div><div style="font-weight:700">' + esc(C.cfg.autor || '') + '</div><div style="font-size:.85em;opacity:.8">' + esc(C.cfg.centro || '') + '</div><div style="font-size:.8em;opacity:.7;margin-top:1mm">' + marco + '</div></div>' + (C.prod.id === 'examen' ? '' : '<div style="display:flex;align-items:center;gap:2.5mm;font-size:.85em">' + avatar(C, 14) + '<span>Con ' + esc(C.guia.n) + '</span></div>') + '</div></div>';
    },
    creditos: function (pg, C) {
      var ed = C.usuario === 'editorial', y = new Date().getFullYear();
      return '<div style="position:absolute;left:17mm;right:17mm;bottom:22mm;font-size:.82em;line-height:1.6">' +
        '<p style="margin:0 0 3mm"><b>' + esc(C.titulo) + '</b><br/>' + (C.libre ? esc(C.matN) : esc(C.cursoN) + ' · ' + esc(C.N.n)) + '</p>' +
        '<p style="margin:0 0 3mm">Autoría: ' + esc(C.cfg.autor || '________________') + '<br/>' + (C.cfg.centro ? 'Centro: ' + esc(C.cfg.centro) + '<br/>' : '') + (C.libre ? '' : 'Referente curricular: ') + esc(C.libre ? '' : C.P.marco) + '</p>' +
        (ed ? '<p style="margin:0 0 3mm">ISBN: ________________ · Depósito legal: ________________<br/>Edición: 1.ª, ' + y + '</p>' : '') +
        '<p style="margin:0">© ' + y + ' ' + esc(C.cfg.autor || 'la autora o el autor') + '. ' + (ed ? 'Reservados todos los derechos.' : 'Material de uso educativo.') + ' Maquetado con Estudio Universal.</p></div>';
    },
    indice: function (pg, C, modo, ctx) {
      var T = C.T, filas = [];
      ctx.pages.forEach(function (p) {
        if (p.indice) { filas.push([p.indiceN || '', p.indice, p.num]); return; }
        if (p.tipo === 'apertura' || p.tipo === 's_titulo') filas.push(['Unidad ' + p.n, sub(p.u.t, C), p.num]);
        else if (p.tipo === 't_intro') filas.push(['', 'Introducción', p.num]);
        else if (p.tipo === 't_desarrollo' && p.n === 1) filas.push(['', 'Desarrollo', p.num]);
        else if (p.tipo === 't_conclusion') filas.push(['', 'Conclusiones', p.num]);
        else if (p.tipo === 't_biblio') filas.push(['', 'Bibliografía', p.num]);
        else if (p.tipo === 't_anexos') filas.push(['', 'Anexos', p.num]);
        else if (p.tipo === 'glosario') filas.push(['', 'Glosario', p.num]);
        else if (p.tipo === 'solucion' && p.parte === 0) filas.push(['', 'Solucionario', p.num]);
        else if (p.tipo === 'bibliografia') filas.push(['', 'Bibliografía y referentes', p.num]);
      });
      var lim = Math.floor(presupuesto(C, 80) / 1.6), p0 = (pg.parte || 0) * lim;
      return cabecera(C, pg) + h1(C, pg.parte ? 'Índice (sigue)' : 'Índice') + '<div>' + filas.slice(p0, p0 + lim).map(function (f) {
        return '<div style="display:flex;align-items:baseline;gap:3mm;padding:1.6mm 0;border-bottom:1px solid ' + T.soft + '"><span style="flex:none;width:22mm;color:' + T.acc + ';font-weight:700;font-size:.85em">' + esc(f[0]) + '</span><span style="flex:1">' + esc(f[1]) + '</span><span style="font-variant-numeric:tabular-nums">' + f[2] + '</span></div>';
      }).join('') + '</div>' + folio(C, pg);
    },
    presentacion: function (pg, C) {
      var fam = C.usuario === 'familia' || C.peque;
      return cabecera(C, pg) + h1(C, C.adulto ? 'Antes de empezar' : 'Hola, ¿empezamos?') +
        guia(C, sub(C.adulto ? 'Soy ' + C.guia.n + '. Este material está pensado para que avances a tu ritmo, con ejemplos de la vida diaria en ' + (C.P.id === 'us' ? 'Estados Unidos' : C.P.n) + '.' : 'Soy ' + C.guia.n + ' y voy a estar contigo en cada unidad. Cuando me veas, te daré una pista o una idea.', C)) +
        h2(C, 'Cómo está organizado') +
        '<p style="margin:0 0 2mm">Cada unidad tiene cinco momentos:</p>' +
        ['<b>Apertura</b>: qué vas a aprender y por qué importa.', '<b>Explicación</b>: las ideas clave, con un esquema.', '<b>Cerca de ti</b>: un ejemplo de tu entorno.', '<b>Actividades</b>: para practicar, de lo sencillo a lo difícil.', '<b>Repaso</b>: un mapa de la unidad y tu autoevaluación.'].map(function (s) { return '<div style="margin:0 0 1.5mm 3mm">· ' + sub(s, C) + '</div>'; }).join('') +
        h2(C, 'Referente curricular') + '<p style="margin:0">' + esc(C.P.marco) + '. Se trabajan ' + esc(C.P.evalua) + '.</p>' +
        (fam ? h2(C, 'Para la familia') + '<p style="margin:0">Diez minutos al día juntos valen más que una tarde entera. Pidan a quien estudia que les explique lo que aprendió: explicar es la mejor forma de fijar.</p>' : '') + folio(C, pg);
    },
    apertura: function (pg, C) {
      var T = C.T, u = pg.u, r = rng(hash(u.id + 'ap'));
      var num0 = '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 6) + 'px;line-height:.9;color:' + T.acc + '">' + pg.n + '</div>';
      if (pg.mini) return cabecera(C, pg) + num0 + h1(C, esc(sub(u.t, C))) + chipsClave(C, u) + guia(C, frase('apertura', C, r, u)) + folio(C, pg);
      return cabecera(C, pg) + num0 + h1(C, esc(sub(u.t, C))) +
        marcoImagen(C, 'Ilustración de apertura: ' + sub(u.t, C), 70, (C.cfg.imagenes || [])[(pg.n - 1) % Math.max(1, (C.cfg.imagenes || []).length)]) +
        h2(C, 'En esta unidad vas a…') + (u.i || []).slice(0, 3).map(function (s) { return '<div style="margin:0 0 1.5mm">· ' + esc(sub(s, C)) + '</div>'; }).join('') +
        guia(C, frase('apertura', C, r, u), true) + folio(C, pg);
    },
    explica: function (pg, C) {
      var T = C.T, u = pg.u, r = rng(hash(u.id + 'ex'));
      var ideas = (u.i || []).map(function (s) {
        var t = esc(sub(s, C));
        (u.k || []).forEach(function (k) { var kk = esc(sub(k, C)); t = t.replace(new RegExp('(' + kk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'i'), '<b style="color:' + T.acc + '">$1</b>'); });
        return '<div style="margin:0 0 3mm;padding-left:4mm;border-left:' + (T.id === 'editorial' ? '0.5mm solid ' + T.acc : '1mm solid ' + T.soft) + '">' + t + '</div>';
      }).join('');
      var fig = figura(u.f || { t: 'mapa', c: sub(u.t, C).split(':')[0].slice(0, 30), r: (u.k || []).slice(0, 5) }, C);
      return cabecera(C, pg) + h1(C, C.cfg.facil ? 'Lo importante' : 'Aprende') + ideas +
        '<div style="margin:4mm 0;display:flex;justify-content:center">' + fig + '</div>' + chipsClave(C, u) + guia(C, frase('explica', C, r, u), true) + folio(C, pg);
    },
    ejemplo: function (pg, C) {
      var T = C.T, u = pg.u, r = rng(hash(u.id + 'ej') + C.semilla), P = C.P, nom = pick(r, P.nombres), ciudad = pick(r, P.ciudades);
      var pasado = C.pk === 'es' ? 'ha descubierto' : 'descubrió';
      var trabajados = GEN[u.g] ? [GEN[u.g](u, C, r), GEN[u.g](u, C, r)] : [];
      var cuerpo = '<p style="margin:0 0 3mm">' + esc(nom) + ' vive en ' + esc(ciudad) + '. Hoy, en clase de ' + esc(minus(C.matN.replace(/^.*·\s*/, ''))) + ', ' + pasado + ' que ' + esc(minus(sub((u.i || [''])[0], C)).replace(/\.$/, '')) + '. ' + esc(sub(C.adulto ? 'Esa misma tarde lo aplicó en su trabajo.' : 'Al llegar a casa se lo contó a su familia, y entre todos buscaron ejemplos.', C)) + '</p>';
      if (trabajados.length) cuerpo += h2(C, 'Así se resuelve') + trabajados.map(function (x) {
        return '<div style="background:' + T.soft + ';border-radius:' + T.r + 'px;padding:3mm 4mm;margin:0 0 3mm">' + sub(x.e, C) + '<div style="margin-top:1.5mm;color:' + T.acc2 + ';font-weight:700">→ ' + esc(x.s) + '</div>' + (x.x ? '<div style="font-size:.88em;opacity:.85">' + esc(x.x) + '</div>' : '') + '</div>';
      }).join('');
      else cuerpo += '<div style="margin:3mm 0">' + marcoImagen(C, 'Foto o dibujo de un ejemplo real en ' + ciudad, 55, (C.cfg.imagenes || [])[(pg.n) % Math.max(1, (C.cfg.imagenes || []).length)]) + '</div>';
      cuerpo += h2(C, sub('Ahora tú', C)) + '<p style="margin:0 0 2mm">' + esc(sub('Busca un ejemplo de «' + sub((u.k || ['esto'])[0], C) + '» en tu casa, en tu barrio o en ' + P.ciudades[0] + '. Descríbelo.', C)) + '</p>' + lineas(4, C);
      return cabecera(C, pg) + h1(C, 'Cerca de ti') + cuerpo + guia(C, frase('ejemplo', C, r, u), true) + folio(C, pg);
    },
    actividad: function (pg, C, modo) {
      var r = rng(hash(pg.u.id + 'ac' + pg.k));
      var tit = pg.k === 0 ? 'Actividades' : pick(r, ['Practica', 'Sigue practicando', 'Un paso más', 'Taller', 'Reto']);
      return cabecera(C, pg) + h1(C, tit) + (pg.items || []).map(function (x, i) { return itemHTML(x, i, C, modo, 'p' + pg.num); }).join('') +
        (modo === 'web' ? '<button data-comprobar="1" style="font:inherit;padding:2mm 5mm;border:0;border-radius:6px;background:' + C.T.acc + ';color:#fff;cursor:pointer">Comprobar</button> <span data-resultado="1"></span>' : '') +
        guia(C, frase('actividad', C, r, pg.u), true) + folio(C, pg);
    },
    apuntes: function (pg, C) { return cabecera(C, pg) + h1(C, 'Mis apuntes') + lineas(Math.floor(presupuesto(C, 90) / 1.05), C) + folio(C, pg); },
    repaso: function (pg, C) {
      var T = C.T, u = pg.u, r = rng(hash(u.id + 're'));
      var niveles = C.adulto ? ['Lo domino', 'Casi', 'Repasar'] : ['Lo sé', 'Casi', 'Necesito ayuda'];
      var fila = function (s) { return '<tr><td style="padding:2mm;border-bottom:1px solid ' + T.soft + '">' + esc(sub(s, C)) + '</td>' + niveles.map(function () { return '<td style="width:15mm;text-align:center;border-bottom:1px solid ' + T.soft + '"><span style="display:inline-block;width:5mm;height:5mm;border:1px solid ' + T.ink + ';border-radius:' + (T.r ? 50 : 0) + '%"></span></td>'; }).join('') + '</tr>'; };
      var fam = (C.usuario === 'familia' || C.peque) ? h2(C, 'Para compartir en casa') + '<p style="margin:0">' + esc(sub('Pide a alguien de tu familia que te pregunte: «¿Qué es ' + sub((u.k || [''])[0], C) + '?». Explícaselo con un ejemplo.', C)) + '</p>' : '';
      return cabecera(C, pg) + h1(C, 'Repaso') + '<div style="display:flex;justify-content:center;margin:0 0 3mm">' + figura({ t: 'mapa', c: sub(u.t, C).split(':')[0].slice(0, 30), r: (u.k || []).slice(0, 6) }, C) + '</div>' +
        h2(C, 'Mi autoevaluación') + '<table style="width:100%;border-collapse:collapse;font-size:.92em"><tr><th></th>' + niveles.map(function (n) { return '<th style="font-size:.8em;font-weight:600;color:' + T.acc + '">' + n + '</th>'; }).join('') + '</tr>' + (u.i || []).slice(0, 4).map(fila).join('') + '</table>' + fam +
        guia(C, frase('repaso', C, r, u), true) + folio(C, pg);
    },
    ficha: function (pg, C, modo) {
      var T = C.T, r = rng(hash(pg.u.id + 'fi' + pg.k));
      var cab = '<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:4mm;margin-bottom:5mm;font-size:.85em">' + ['Nombre', 'Curso', 'Fecha'].map(function (l) { return '<div style="border-bottom:1px solid ' + T.ink + ';padding-bottom:1mm">' + l + ':</div>'; }).join('') + '</div>';
      return cab + '<div style="font-size:.75em;letter-spacing:.1em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">Ficha ' + pg.num + ' · ' + esc(C.matN.replace(/^.*·\s*/, '')) + '</div>' + h1(C, esc(sub(pg.u.t, C)), 'font-size:' + (C.fs * 1.7) + 'px') +
        (pg.items || []).map(function (x, i) { return itemHTML(x, i, C, modo, 'p' + pg.num); }).join('') +
        '<div style="position:absolute;left:17mm;right:17mm;bottom:12mm;display:flex;gap:4mm;align-items:center;font-size:.8em">' + avatar(C, 9) + '<span style="flex:1">' + esc(frase('actividad', C, r, pg.u)) + '</span>' + ['Lo sé', 'Casi', 'Ayuda'].map(function (s) { return '<span style="display:flex;gap:1.5mm;align-items:center"><span style="width:4mm;height:4mm;border:1px solid ' + T.ink + ';border-radius:50%"></span>' + s + '</span>'; }).join('') + '</div>';
    },
    glosario: function (pg, C, modo, ctx) {
      var T = C.T, vistos = {}, ent2 = [];
      ctx.unidades.forEach(function (u) {
        (u.k || []).forEach(function (k0) {
          var k = sub(k0, C), kl = k.toLowerCase(); if (vistos[kl]) return; vistos[kl] = 1;
          var def = (u.i || []).map(function (s) { return sub(s, C); }).filter(function (s) { return s.toLowerCase().indexOf(kl) >= 0; })[0];
          ent2.push([k, def || sub(u.t, C)]);
        });
      });
      ent2.sort(function (a, b) { return a[0].localeCompare(b[0], 'es'); });
      var lim = Math.floor(presupuesto(C, 60) / 2.4);
      return cabecera(C, pg) + h1(C, 'Glosario') + '<div style="columns:2;column-gap:8mm;font-size:.9em">' + ent2.slice(0, Math.min(lim * 2, pg.max || 1e9)).map(function (e) { return '<p style="margin:0 0 2.2mm;break-inside:avoid"><b style="color:' + T.acc + '">' + esc(may(e[0])) + '.</b> ' + esc(e[1]) + '</p>'; }).join('') + '</div>' + folio(C, pg);
    },
    solucion: function (pg, C) {
      var T = C.T;
      return cabecera(C, pg) + h1(C, pg.parte ? 'Solucionario (continuación)' : 'Solucionario') + '<div style="font-size:.86em">' + (pg.entradas || []).map(function (e) {
        return '<div style="margin:0 0 2.6mm;break-inside:avoid"><b style="color:' + T.acc + '">Página ' + e.p + '</b> · ' + e.items.map(function (x, i) { return '<b>' + (i + 1) + '.</b> ' + esc(x.s || 'respuesta abierta'); }).join(' · ') + '</div>';
      }).join('') + '</div>' + folio(C, pg);
    },
    bibliografia: function (pg, C) {
      var refs = [C.P.autoridad + '. ' + C.P.marco + '.'];
      refs = refs.concat(apa(C.cfg.fuentes));
      return cabecera(C, pg) + h1(C, 'Bibliografía y referentes') + refs.map(function (s) { return '<p style="margin:0 0 3mm;padding-left:8mm;text-indent:-8mm">' + s + '</p>'; }).join('') +
        '<p style="margin-top:6mm;font-size:.85em;opacity:.8">Los ejemplos de precios, lugares y nombres son ilustrativos. Contrasta los datos oficiales con la normativa vigente de tu comunidad, estado o jurisdicción.</p>' + folio(C, pg);
    },
    contra: function (pg, C) {
      var T = C.T;
      return '<div style="position:absolute;inset:0;background:' + (T.id === 'editorial' || T.id === 'sobria' ? T.ink : T.acc) + ';color:#fff;padding:30mm 20mm;box-sizing:border-box;display:flex;flex-direction:column;justify-content:flex-end">' +
        '<div style="font-family:' + T.tit + ';font-size:' + (C.fs * 2) + 'px;font-weight:' + T.peso + ';line-height:1.15;max-width:120mm">' + esc(C.titulo) + '</div>' +
        '<p style="max-width:120mm;margin:4mm 0 0">' + esc(C.cursoN) + ' · ' + esc(C.N.n) + '. ' + esc(C.P.marcoCorto) + '.</p>' + (C.usuario === 'editorial' ? '<div style="margin-top:10mm;width:50mm;height:22mm;background:#fff;color:#000;display:flex;align-items:center;justify-content:center;font-size:.8em">Código de barras ISBN</div>' : '') + '</div>';
    },
    /* Unidad didáctica */
    ud_portada: function (pg, C) {
      var u = pg.u, ses = Math.max(4, (u.i || []).length * 2);
      return cabecera(C, pg) + '<div style="font-size:.8em;letter-spacing:.12em;text-transform:uppercase;color:' + C.T.acc + ';font-weight:700">Unidad didáctica ' + pg.n + '</div>' + h1(C, esc(sub(u.t, C))) +
        tabla(C, [['Etapa y curso', C.N.n + ' · ' + C.cursoN], ['Área / asignatura', C.matN], ['Referente curricular', C.P.marco], ['Temporalización', ses + ' sesiones de ' + (C.peque ? 45 : 55) + ' minutos'], ['Docente', C.cfg.autor || ''], ['Centro', C.cfg.centro || '']]) + folio(C, pg);
    },
    ud_marco: function (pg, C) {
      var u = pg.u;
      return cabecera(C, pg) + h1(C, 'Justificación y marco curricular') +
        '<p>' + esc(sub('Esta unidad trabaja «' + sub(u.t, C) + '» con alumnado de ' + C.cursoN + ' (' + CUb(C) + '). Parte de situaciones reales de ' + C.P.ciudades[0] + ' y del entorno del grupo para que lo aprendido tenga sentido fuera del aula.', C)) + '</p>' +
        h2(C, 'Referentes') + '<p>' + esc(C.P.marco) + '.</p><p>Elementos que se concretan: ' + esc(C.P.evalua) + '.</p>' +
        h2(C, 'Situación de aprendizaje') + '<p>' + esc(sub('Reto: el grupo prepara un material para explicar «' + sub(u.t, C) + '» a otra clase o a sus familias. El producto final se presenta en la última sesión.', C)) + '</p>' + folio(C, pg);
    },
    ud_objetivos: function (pg, C) {
      var u = pg.u;
      return cabecera(C, pg) + h1(C, 'Objetivos y contenidos') + h2(C, 'Al terminar, el alumnado será capaz de…') +
        (u.i || []).map(function (s) { return '<div style="margin:0 0 2mm">· ' + esc(objetivo(sub(s, C))) + '</div>'; }).join('') +
        h2(C, 'Contenidos / saberes') + chipsClave(C, u) + h2(C, 'Competencias que se movilizan') + '<p>' + esc(competencias(C)) + '</p>' + folio(C, pg);
    },
    ud_sesiones: function (pg, C) {
      var u = pg.u, ideas = u.i || [], filas = [];
      var n = Math.max(4, ideas.length * 2);
      for (var s = 0; s < Math.min(n, 8); s++) {
        var idea = ideas[Math.floor(s / 2) % ideas.length] || sub(u.t, C);
        filas.push(['S' + (s + 1), s % 2 === 0 ? 'Activación con una pregunta del entorno; explicación guiada: ' + minus(sub(idea, C)) : 'Práctica por parejas y puesta en común; ' + (s === n - 1 || s === 7 ? 'presentación del producto final.' : 'registro en el cuaderno.')]);
      }
      return cabecera(C, pg) + h1(C, 'Secuencia de sesiones') + tabla(C, filas, true) + folio(C, pg);
    },
    ud_dua: function (pg, C) {
      return cabecera(C, pg) + h1(C, 'Atención a la diversidad (DUA)') +
        h2(C, 'Múltiples formas de representación') + '<p>Texto con lectura fácil, esquema visual en cada explicación, narración en voz alta y vocabulario destacado.</p>' +
        h2(C, 'Múltiples formas de acción y expresión') + '<p>Respuestas orales, escritas, dibujadas o grabadas. El producto final puede ser cartel, audio o presentación.</p>' +
        h2(C, 'Múltiples formas de implicación') + '<p>' + esc(sub('Ejemplos de ' + C.P.ciudades[0] + ' y de la vida del grupo, elección entre retos y autoevaluación en cada unidad.', C)) + '</p>' +
        h2(C, 'Ajustes para NEE') + '<p>Tipografía para dislexia, más tiempo, apoyos visuales, pistas paso a paso y agrupamientos heterogéneos.</p>' + folio(C, pg);
    },
    ud_eval: function (pg, C) {
      var u = pg.u;
      return cabecera(C, pg) + h1(C, 'Evaluación') + h2(C, 'Criterios') + (u.i || []).slice(0, 4).map(function (s) { return '<div style="margin:0 0 2mm">· ' + esc(criterio(sub(s, C))) + '</div>'; }).join('') +
        h2(C, 'Instrumentos') + tabla(C, [['Observación', 'Lista de cotejo en las sesiones de práctica', '20 %'], ['Cuaderno', 'Actividades y autoevaluación', '30 %'], ['Producto final', 'Rúbrica analítica', '30 %'], ['Prueba', 'Examen breve con solucionario', '20 %']], true) + folio(C, pg);
    },
    rubrica: function (pg, C) {
      var T = C.T, u = pg.u, niv = C.pk === 'es' ? ['Sobresaliente', 'Notable', 'Suficiente', 'Insuficiente'] : ['Destacado', 'Logrado', 'En proceso', 'Inicial'];
      var crit = [['Comprensión', 'Explica ' + minus(sub(u.t, C)) + ' con precisión y ejemplos propios.'], ['Vocabulario', 'Usa ' + (u.k || []).slice(0, 3).map(function (k) { return sub(k, C); }).join(', ') + ' con propiedad.'], ['Aplicación', 'Resuelve las actividades y justifica el procedimiento.'], ['Comunicación', 'Presenta el trabajo ordenado, claro y a tiempo.']];
      var grado = ['siempre y de forma autónoma', 'casi siempre, con ayuda puntual', 'a veces, con ayuda', 'todavía no, necesita acompañamiento'];
      var th = function (s) { return '<th style="border:1px solid ' + T.ink + ';padding:2mm;background:' + T.soft + ';text-align:left;font-size:.85em">' + s + '</th>'; };
      return cabecera(C, pg) + h1(C, 'Rúbrica · ' + esc(sub(u.t, C)), 'font-size:' + (C.fs * 1.6) + 'px') +
        '<table style="width:100%;border-collapse:collapse;font-size:.82em;line-height:1.35"><tr>' + th('Criterio') + niv.map(function (n, i) { return th(n + ' (' + (4 - i) + ')'); }).join('') + '</tr>' +
        crit.map(function (c) { return '<tr><td style="border:1px solid ' + T.ink + ';padding:2mm;vertical-align:top"><b>' + c[0] + '</b><br/>' + esc(c[1]) + '</td>' + grado.map(function (g) { return '<td style="border:1px solid ' + T.ink + ';padding:2mm;vertical-align:top">Lo hace ' + g + '.</td>'; }).join('') + '</tr>'; }).join('') + '</table>' +
        h2(C, 'Observaciones') + lineas(4, C) + folio(C, pg);
    },
    cotejo: function (pg, C) {
      var T = C.T, u = pg.u;
      var items = (u.i || []).map(function (s) { return criterio(sub(s, C)); }).concat(['Participa y respeta los turnos de palabra.', 'Entrega las tareas en el plazo acordado.']);
      return cabecera(C, pg) + h1(C, 'Lista de cotejo', 'font-size:' + (C.fs * 1.6) + 'px') + '<table style="width:100%;border-collapse:collapse;font-size:.88em"><tr><th style="text-align:left;padding:2mm;border-bottom:1px solid ' + T.ink + '">Indicador</th><th style="width:14mm;border-bottom:1px solid ' + T.ink + '">Sí</th><th style="width:14mm;border-bottom:1px solid ' + T.ink + '">No</th><th style="width:30mm;border-bottom:1px solid ' + T.ink + '">Notas</th></tr>' +
        items.map(function (s) { return '<tr><td style="padding:2.4mm 2mm;border-bottom:1px solid ' + T.soft + '">' + esc(s) + '</td><td style="border-bottom:1px solid ' + T.soft + '"></td><td style="border-bottom:1px solid ' + T.soft + '"></td><td style="border-bottom:1px solid ' + T.soft + '"></td></tr>'; }).join('') + '</table>' + folio(C, pg);
    },
    lamina: function (pg, C) {
      var T = C.T, u = pg.u, v = pg.k % 3;
      var cuerpo = v === 0 ? figura(u.f || { t: 'mapa', c: sub(u.t, C).slice(0, 26), r: u.k }, C)
        : v === 1 ? figura({ t: 'mapa', c: 'Palabras clave', r: (u.k || []).slice(0, 6) }, C)
          : '<div style="display:flex;flex-direction:column;gap:5mm">' + (u.i || []).map(function (s, i) { return '<div style="display:flex;gap:5mm;align-items:baseline"><span style="font-family:' + T.tit + ';font-size:' + (C.fs * 3) + 'px;font-weight:' + T.peso + ';color:' + (i % 2 ? T.acc2 : T.acc) + ';line-height:1">' + (i + 1) + '</span><span style="font-size:1.35em;line-height:1.35">' + esc(sub(s, C)) + '</span></div>'; }).join('') + '</div>';
      return '<div style="height:100%;display:flex;flex-direction:column"><div style="font-size:.85em;letter-spacing:.14em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">' + esc(C.matN.replace(/^.*·\s*/, '')) + '</div>' +
        h1(C, esc(sub(u.t, C)), 'font-size:' + (C.fs * 3.2) + 'px;margin-top:3mm') + '<div style="flex:1;display:flex;align-items:center;justify-content:center;padding:6mm 0">' + cuerpo + '</div>' +
        '<div style="font-size:1.1em;border-top:1px solid ' + T.ink + ';padding-top:3mm">' + esc(sub((u.q || [])[0] || '¿Qué ejemplo de esto has visto en ' + C.P.ciudades[0] + '?', C)) + '</div></div>';
    },
    examen: function (pg, C, modo) {
      var T = C.T, head = pg.parte === 1 ? '<div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:4mm;margin-bottom:4mm;font-size:.85em">' + ['Nombre y apellidos', 'Curso', 'Calificación'].map(function (l) { return '<div style="border-bottom:1px solid ' + T.ink + ';padding-bottom:1mm">' + l + ':</div>'; }).join('') + '</div>' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline"><div style="font-size:.8em;letter-spacing:.1em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">' + esc(C.matN.replace(/^.*·\s*/, '')) + ' · ' + esc(C.cursoN) + '</div><div style="font-weight:700">Modelo ' + pg.modelo + '</div></div>' +
        h1(C, 'Evaluación: ' + esc(pg.mix.map(function (u) { return sub(u.t, C); }).join(' y ')), 'font-size:' + (C.fs * 1.5) + 'px') + '<p style="margin:0 0 4mm;font-size:.88em">' + esc(sub('Lee cada pregunta con calma. Puntuación total: 10 puntos.', C)) + '</p>' : cabecera(C, pg);
      return head + pg.items.map(function (x, i) { return itemHTML(x, i + (pg.parte === 2 ? pg.offset || 0 : 0), C, modo, 'p' + pg.num); }).join('') + folio(C, pg);
    },
    examen_sol: function (pg, C) {
      var T = C.T;
      return cabecera(C, pg) + h1(C, 'Solucionario · Modelo ' + pg.modelo, 'font-size:' + (C.fs * 1.6) + 'px') + pg.items.map(function (x, i) {
        return '<div style="margin:0 0 3mm;display:flex;gap:3mm"><b style="color:' + T.acc + ';flex:none">' + (i + 1) + '.</b><div><div style="font-size:.85em;opacity:.8">' + x.e.replace(/<div[\s\S]*<\/div>/, '').replace(/<table[\s\S]*<\/table>/, '') + '</div><div><b>' + esc(x.s || 'Respuesta abierta: valorar con la rúbrica.') + '</b> <span style="opacity:.7">(' + num(x.pt || 0, C) + ' p.)</span></div></div></div>';
      }).join('') + folio(C, pg);
    },
    /* Presentación 16:9 */
    s_portada: function (pg, C) { var T = C.T; return '<div style="height:100%;display:flex;flex-direction:column;justify-content:flex-end"><div style="font-size:1em;letter-spacing:.14em;text-transform:uppercase;color:' + T.acc + ';font-weight:700">' + esc(C.matN) + '</div>' + h1(C, esc(C.titulo), 'font-size:64px;margin:4mm 0') + '<div style="font-size:1.2em">' + esc(C.cursoN) + ' · ' + esc(C.cfg.autor || '') + '</div></div>'; },
    s_titulo: function (pg, C) { var T = C.T; return '<div style="height:100%;display:flex;align-items:center;gap:12mm"><div style="font-family:' + T.tit + ';font-size:180px;font-weight:' + T.peso + ';color:' + T.acc + ';line-height:.8">' + pg.n + '</div>' + h1(C, esc(sub(pg.u.t, C)), 'font-size:56px;margin:0') + '</div>'; },
    s_idea: function (pg, C) { var T = C.T, s = sub(pg.u.i[pg.k], C); return '<div style="font-size:.9em;color:' + T.acc + ';font-weight:700;letter-spacing:.1em;text-transform:uppercase">' + esc(sub(pg.u.t, C)) + '</div><div style="height:85%;display:flex;align-items:center"><div style="font-family:' + T.tit + ';font-size:' + (s.length > 110 ? 36 : 46) + 'px;line-height:1.25;font-weight:' + (T.peso - 100) + ';max-width:230mm;text-wrap:balance">' + esc(s) + '</div></div>'; },
    s_figura: function (pg, C) { var u = pg.u; return h1(C, esc(sub(u.t, C)), 'font-size:34px') + '<div style="display:flex;justify-content:center;align-items:center;height:70%"><div style="width:190mm">' + figura(u.f || { t: 'mapa', c: sub(u.t, C).slice(0, 26), r: u.k }, C) + '</div></div>'; },
    s_pregunta: function (pg, C) { var T = C.T, u = pg.u, q = (u.q || [])[0] || ((u.vf || [])[0] ? '¿Verdadero o falso? ' + u.vf[0][0] : '¿Dónde has visto «' + (u.k || [''])[0] + '» en tu vida diaria?'); return '<div style="height:100%;display:flex;flex-direction:column;justify-content:center;gap:6mm"><div style="display:flex;gap:4mm;align-items:center">' + avatar(C, 16) + '<b style="color:' + T.acc2 + ';font-size:1.2em">' + esc(C.guia.n) + ' pregunta</b></div><div style="font-family:' + T.tit + ';font-size:44px;line-height:1.2;font-weight:' + T.peso + ';text-wrap:balance">' + esc(sub(q, C)) + '</div></div>'; },
    s_cierre: function (pg, C) { var T = C.T; return '<div style="height:100%;display:flex;flex-direction:column;justify-content:center">' + h1(C, sub('¿Qué te llevas de hoy?', C), 'font-size:60px') + '<div style="font-size:1.3em;color:' + T.acc + '">' + esc(C.titulo) + '</div></div>'; },
    /* Trabajo del alumno */
    t_portada: function (pg, C) {
      var T = C.T, fecha = new Date().toLocaleDateString(C.P.loc, { day: 'numeric', month: 'long', year: 'numeric' });
      return '<div style="height:100%;display:flex;flex-direction:column;text-align:center;align-items:center"><div style="font-weight:700;font-size:1.1em">' + esc(C.cfg.centro || 'Nombre del centro educativo') + '</div><div style="font-size:.9em;opacity:.8">' + esc(C.N.n) + ' · ' + esc(C.cursoN) + '</div>' +
        '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:4mm"><div style="font-size:.85em;letter-spacing:.14em;text-transform:uppercase;color:' + T.acc + '">' + esc(C.matN) + '</div>' + h1(C, esc(C.titulo), 'font-size:' + (C.fs * 2.8) + 'px;text-align:center;margin:0') + '</div>' +
        '<div style="line-height:1.8">Presenta: <b>' + esc(C.cfg.alumno || '________________') + '</b><br/>Docente: ' + esc(C.cfg.autor || '________________') + '<br/>' + esc(C.P.ciudades[0]) + ', ' + fecha + '</div></div>';
    },
    t_intro: function (pg, C) {
      return cabecera(C, pg) + h1(C, 'Introducción') + '<div style="background:' + C.T.soft + ';padding:3mm 4mm;border-radius:' + C.T.r + 'px;font-size:.88em;margin-bottom:4mm">' + esc(sub('Guía: presenta el tema, explica por qué lo elegiste y qué vas a contar en cada apartado. Entre 8 y 12 líneas.', C)) + '</div>' + lineas(Math.floor(presupuesto(C, 150) / 1.05), C) + folio(C, pg);
    },
    t_desarrollo: function (pg, C) {
      var u = pg.u, idea = sub(u.i[pg.k], C);
      return cabecera(C, pg) + h2(C, pg.n + '. ' + esc(may(idea.split(/[:,.]/)[0]).slice(0, 70))) + '<div style="background:' + C.T.soft + ';padding:3mm 4mm;border-radius:' + C.T.r + 'px;font-size:.88em;margin-bottom:4mm"><b>Ideas para empezar:</b> ' + esc(idea) + ' ' + esc(sub('Añade un ejemplo de ' + C.P.ciudades[0] + ' y cita al menos una fuente.', C)) + '</div>' + lineas(Math.floor(presupuesto(C, 150) / 1.05), C) + folio(C, pg);
    },
    t_conclusion: function (pg, C) { return cabecera(C, pg) + h1(C, 'Conclusiones') + '<div style="background:' + C.T.soft + ';padding:3mm 4mm;border-radius:' + C.T.r + 'px;font-size:.88em;margin-bottom:4mm">' + esc(sub('Guía: ¿qué aprendiste?, ¿qué te sorprendió?, ¿qué te gustaría investigar después?', C)) + '</div>' + lineas(Math.floor(presupuesto(C, 150) / 1.05), C) + folio(C, pg); },
    t_biblio: function (pg, C) {
      var refs = apa(C.cfg.fuentes);
      return cabecera(C, pg) + h1(C, 'Bibliografía') + (refs.length ? refs.map(function (s) { return '<p style="margin:0 0 3mm;padding-left:8mm;text-indent:-8mm">' + s + '</p>'; }).join('') : '<p style="opacity:.75">Escribe tus fuentes en el panel, una por línea: Autor | Año | Título | Editorial o web | URL. Se ordenan y se escriben en formato APA 7 solas.</p>' + lineas(8, C)) + folio(C, pg);
    },
    t_anexos: function (pg, C) { return cabecera(C, pg) + h1(C, 'Anexos') + marcoImagen(C, 'Fotos, tablas o dibujos que acompañan el trabajo', 120, (C.cfg.imagenes || [])[0]) + folio(C, pg); }
  };

  function CUb(C) { var b = window.EU_CURRICULO.BANDAS[C.bnd]; return b ? b.edad : ''; }
  function objetivo(s) { return 'Comprender y explicar que ' + minus(s).replace(/\.$/, '') + '.'; }
  function criterio(s) { return 'Explica con sus palabras que ' + minus(s).replace(/\.$/, '') + '.'; }
  function competencias(C) {
    var m = { lengua: 'comunicación lingüística, aprender a aprender', mate: 'competencia matemática, resolución de problemas', conta: 'competencia matemática, emprendimiento y educación financiera', natu: 'competencia científica, pensamiento crítico', soci: 'competencia ciudadana, conciencia cultural', ingles: 'competencia plurilingüe', arte: 'conciencia y expresión culturales, visión espacial', musica: 'conciencia y expresión culturales', efisica: 'competencia personal y social, salud', tecno: 'competencia digital, pensamiento computacional', valores: 'competencia personal, social y ciudadana', religion: 'conciencia cultural, diálogo intercultural', pelu: 'competencia profesional, atención al cliente, seguridad' }[C.mat] || 'competencias transversales';
    return m + '.';
  }
  function tabla(C, filas, encab) {
    var T = C.T;
    return '<table style="width:100%;border-collapse:collapse;font-size:.9em;line-height:1.4">' + filas.map(function (f) { return '<tr>' + f.map(function (c, i) { return '<td style="border-bottom:1px solid ' + T.soft + ';padding:2.2mm 2mm;vertical-align:top;' + (i === 0 ? 'font-weight:700;color:' + T.acc + ';width:' + (encab ? '14mm' : '42mm') : '') + '">' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>';
  }
  function apa(txt0) {
    return String(txt0 || '').split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
      var p = l.split('|').map(function (x) { return x.trim(); });
      if (p.length < 3) return esc(l);
      return esc(p[0].replace(/\.$/, '')) + '. (' + esc(p[1] || 's. f.') + '). <i>' + esc(p[2]) + '</i>.' + (p[3] ? ' ' + esc(p[3]) + '.' : '') + (p[4] ? ' ' + esc(p[4]) : '');
    }).sort(function (a, b) { return a.localeCompare(b, 'es'); });
  }

  function paginaHTML(pg, C, modo, ctx) {
    var T0 = C.T, des = [];
    for (var p = 0; p < PRE.length; p++) { try { var d = PRE[p](pg, C, modo, ctx); if (typeof d === 'function') des.push(d); } catch (e) { console.warn(e); } }
    try {
      var f = RENDER[pg.tipo];
      var cuerpo = f ? f(pg, C, modo, ctx) : '';
      for (var q = 0; q < POST.length; q++) { try { cuerpo = POST[q](cuerpo, pg, C, modo, ctx); } catch (e) { console.warn(e); } }
      return '<div class="pg" data-n="' + pg.num + '" style="' + estiloPagina(C, pg) + '">' + cuerpo + '</div>';
    } finally { des.forEach(function (d) { try { d(); } catch (e) { } }); C.T = T0; }
  }

  /* Texto que se narra en cada página. */
  function textoVoz(pg, C) {
    var u = pg.u;
    if (VOZ_EXT[pg.tipo]) return VOZ_EXT[pg.tipo](pg, C);
    switch (pg.tipo) {
      case 'portada': case 's_portada': return C.titulo + '. ' + C.cursoN + '.';
      case 'apertura': case 's_titulo': return 'Unidad ' + pg.n + '. ' + sub(u.t, C) + '. ' + frase('apertura', C, rng(hash(u.id + 'ap')), u);
      case 'explica': return (u.i || []).map(function (s) { return sub(s, C); }).join(' ');
      case 's_idea': return sub(u.i[pg.k], C);
      case 'actividad': case 'ficha': return (pg.items || []).map(function (x, i) { return (i + 1) + '. ' + String(x.e).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); }).join(' ');
      case 'repaso': return 'Repaso de ' + sub(u.t, C) + '. ' + (u.k || []).map(function (k) { return sub(k, C); }).join(', ') + '.';
      case 's_pregunta': return C.guia.n + ' pregunta: ' + sub((u.q || [])[0] || '¿Qué has aprendido?', C);
      default: return '';
    }
  }

  /* ─────────── exportaciones ─────────── */
  function documento(res, modo, titulo) {
    var C = res.C, W = C.papel.w, H = C.papel.h;
    var pags = res.pages.map(function (p) { return paginaHTML(p, C, modo, res); }).join('\n');
    var css = '@page{size:' + W + 'mm ' + H + 'mm;margin:0}html,body{margin:0;padding:0}' +
      (modo === 'web' ? 'body{background:#e8e6e1;padding:24px 0}.pg{margin:0 auto 24px;box-shadow:0 4px 18px rgba(0,0,0,.18)}@media print{body{background:none;padding:0}.pg{margin:0;box-shadow:none}}' : '.pg{page-break-after:always;break-after:page}.pg:last-child{page-break-after:auto}');
    var script = modo === 'web' ? '<script>(function(){function n(s){return String(s).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").replace(/[\\s.,;:()$€]/g,"").replace(/^x=/,"")}' +
      'document.addEventListener("click",function(e){var b=e.target.closest("[data-comprobar]");if(!b)return;var pg=b.closest(".pg"),bien=0,tot=0;' +
      'pg.querySelectorAll("[data-acepta]").forEach(function(i){tot++;var ok=i.dataset.acepta.split("|").some(function(a){return n(a)===n(i.value)});if(ok)bien++;i.style.borderColor=ok?"#1a8f4c":"#c0392b";i.style.background=ok?"#e7f6ec":"#fbe9e7"});' +
      'var g={};pg.querySelectorAll("input[type=radio]").forEach(function(r){g[r.name]=g[r.name]||[];g[r.name].push(r)});Object.keys(g).forEach(function(k){tot++;var s=g[k].filter(function(r){return r.checked})[0];var ok=s&&s.hasAttribute("data-ok");if(ok)bien++;g[k].forEach(function(r){r.parentNode.style.color=r.hasAttribute("data-ok")&&s?"#1a8f4c":(r===s?"#c0392b":"")})});' +
      'var o=pg.querySelector("[data-resultado]");if(o)o.textContent=bien+" de "+tot+" bien";if(window.speechSynthesis){var u=new SpeechSynthesisUtterance(bien===tot?"¡Todo bien!":"Llevas "+bien+" de "+tot+". Revisa las que están en rojo.");u.lang="' + C.P.lang + '";speechSynthesis.cancel();speechSynthesis.speak(u)}});' +
      'document.querySelectorAll(".pg").forEach(function(p){var b=document.createElement("button");b.textContent="Escuchar";b.style.cssText="position:absolute;top:6mm;right:6mm;font:12px sans-serif;padding:4px 10px;border-radius:99px;border:1px solid #999;background:#fff;cursor:pointer";b.onclick=function(){var u=new SpeechSynthesisUtterance(p.innerText.replace(/Escuchar|Comprobar/g,""));u.lang="' + C.P.lang + '";speechSynthesis.cancel();speechSynthesis.speak(u)};p.appendChild(b)})})();<\/script>' : '';
    return '<!DOCTYPE html><html lang="' + C.P.lang + '"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>' + esc(titulo || C.titulo) + '</title><link rel="stylesheet" href="' + FUENTES + '"/>' + EXTRA_FUENTES.map(function (f) { return '<link rel="stylesheet" href="' + f + '"/>'; }).join('') + '<style>' + css + '</style></head><body>' + pags + script + '</body></html>';
  }

  function imprimir(res) {
    var html = documento(res, 'print');
    var f = document.createElement('iframe');
    f.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0';
    document.body.appendChild(f);
    var d = f.contentWindow.document; d.open(); d.write(html); d.close();
    var ir = function () {
      try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { }
      setTimeout(function () { f.remove(); }, 60000);
    };
    var listo = f.contentWindow.document.fonts && f.contentWindow.document.fonts.ready;
    if (listo) listo.then(function () { setTimeout(ir, 300); }); else setTimeout(ir, 1200);
  }

  function nombreArchivo(C, ext) {
    return (C.prod.id + '-' + C.titulo + '-' + C.cursoN + '-' + C.pk).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80) + '.' + ext;
  }
  function blobHTML(res) { return new Blob([documento(res, 'web')], { type: 'text/html' }); }

  function epub(res) {
    if (!window.JSZip) return Promise.reject(new Error('El EPUB necesita conexión la primera vez.'));
    var C = res.C, z = new JSZip(), W = Math.round(C.papel.w * 3.7795), H = Math.round(C.papel.h * 3.7795);
    z.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
    z.file('META-INF/container.xml', '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
    var imgs = [], man = [], spine = [], nav = [];
    res.pages.forEach(function (p, i) {
      var h = paginaHTML(p, C, 'print', res).replace(/src="(data:image\/(png|jpe?g|webp|gif);base64,[^"]+)"/g, function (m, url, ext) {
        var k = imgs.indexOf(url); if (k < 0) { imgs.push(url); k = imgs.length - 1; }
        return 'src="img/i' + k + '.' + (ext === 'jpeg' ? 'jpg' : ext) + '"';
      });
      var id = 'p' + String(i + 1).padStart(4, '0');
      z.file('OEBPS/' + id + '.xhtml', '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="' + C.P.lang + '" xml:lang="' + C.P.lang + '"><head><meta charset="UTF-8"/><title>' + esc(C.titulo) + ' · ' + (i + 1) + '</title><meta name="viewport" content="width=' + W + ', height=' + H + '"/><style>html,body{margin:0;padding:0;width:' + W + 'px;height:' + H + 'px;overflow:hidden}</style></head><body>' + h + '</body></html>');
      man.push('<item id="' + id + '" href="' + id + '.xhtml" media-type="application/xhtml+xml"' + (h.indexOf('<svg') >= 0 ? ' properties="svg"' : '') + '/>');
      spine.push('<itemref idref="' + id + '"/>');
      if (p.tipo === 'apertura' || p.tipo === 'indice' || p.tipo === 'glosario' || p.tipo === 'solucion' && p.parte === 0 || i === 0) nav.push('<li><a href="' + id + '.xhtml">' + esc(p.tipo === 'apertura' ? 'Unidad ' + p.n + '. ' + sub(p.u.t, C) : p.tipo === 'indice' ? 'Índice' : p.tipo === 'glosario' ? 'Glosario' : p.tipo === 'solucion' ? 'Solucionario' : 'Portada') + '</a></li>');
    });
    imgs.forEach(function (url, k) {
      var m = /^data:image\/(\w+);base64,(.*)$/.exec(url), ext = m[1] === 'jpeg' ? 'jpg' : m[1];
      z.file('OEBPS/img/i' + k + '.' + ext, m[2], { base64: true });
      man.push('<item id="i' + k + '" href="img/i' + k + '.' + ext + '" media-type="image/' + (ext === 'jpg' ? 'jpeg' : ext) + '"/>');
    });
    z.file('OEBPS/nav.xhtml', '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE html>\n<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="es"><head><meta charset="UTF-8"/><title>Índice</title></head><body><nav epub:type="toc"><h1>Índice</h1><ol>' + nav.join('') + '</ol></nav></body></html>');
    var uid = 'urn:uuid:' + ('10000000-1000-4000-8000-100000000000').replace(/[018]/g, function (c) { return (c ^ Math.random() * 16 >> c / 4).toString(16); });
    z.file('OEBPS/content.opf', '<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" prefix="rendition: http://www.idpf.org/vocab/rendition/#"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">' + uid + '</dc:identifier><dc:title>' + esc(C.titulo) + '</dc:title><dc:language>' + C.P.lang + '</dc:language><dc:creator>' + esc(C.cfg.autor || 'Estudio Universal') + '</dc:creator><dc:subject>' + esc(C.matN) + '</dc:subject><meta property="dcterms:modified">' + new Date().toISOString().replace(/\.\d+Z$/, 'Z') + '</meta><meta property="rendition:layout">pre-paginated</meta><meta property="rendition:spread">auto</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>' + man.join('') + '</manifest><spine>' + spine.join('') + '</spine></package>');
    return z.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  }

  /* ─────────── extensión: cerebros ───────────
     Un cerebro registra materias (en EU_CURRICULO), productos propios,
     plantillas, páginas, voz, escenas de vídeo y preguntas del panel. */
  function envolver(C, core, N, relleno, o) {
    o = o || {};
    var front = [{ tipo: 'portada' }];
    if (N >= 20) front.push({ tipo: 'creditos' });
    if (N >= 12 && o.indice !== false) {
      var lim = Math.floor(presupuesto(C, 80) / 1.6), ni = Math.max(1, Math.min(Math.ceil((o.indiceFilas || 1) / lim), Math.floor(N / 25) + 1));
      for (var ii = 0; ii < ni; ii++) front.push({ tipo: 'indice', parte: ii });
    }
    if (N >= 24 && o.intro) front.push(o.intro);
    var back = (o.fin || []).slice();
    if (N >= 16 && o.biblio !== false) back.push({ tipo: 'bibliografia' });
    back.push({ tipo: 'contra' });
    var hueco = N - front.length - back.length, k = 0;
    while (core.length > hueco) {
      var j = -1; for (var q = core.length - 1; q >= 0; q--) if (core[q].relleno) { j = q; break; }
      core.splice(j < 0 ? core.length - 1 : j, 1);
    }
    while (core.length < hueco && relleno && k < 2000) {
      var antes = core.length, pz = relleno(k++, core);
      if (pz && !Array.isArray(pz)) pz = [pz];
      (pz || []).slice(0, hueco - core.length).forEach(function (x) { core.push(x); });
      if (core.length === antes) break;
    }
    var out = front.concat(core).concat(back);
    while (out.length > N) out.splice(out.length - 2, 1);
    return out;
  }
  function registrar(cb) {
    var CU = window.EU_CURRICULO;
    (cb.materias || []).forEach(function (m) {
      if (!CU.MATERIAS.some(function (x) { return x.id === m.id; })) CU.MATERIAS.push(Object.assign({ al: {} }, m));
    });
    (cb.unidades || []).forEach(function (u) { if (!CU.UNIDADES.some(function (x) { return x.id === u.id; })) CU.UNIDADES.push(u); });
    (cb.productos || []).forEach(function (p) {
      if (!PRODUCTOS.some(function (x) { return x.id === p.id; })) PRODUCTOS.push(p);
      if (p.armar) PROD_EXT[p.id] = p;
    });
    Object.keys(cb.plantillas || {}).forEach(function (k) { PLANTILLAS[k] = cb.plantillas[k]; });
    Object.keys(cb.paginas || {}).forEach(function (k) { RENDER[k] = cb.paginas[k]; });
    Object.keys(cb.voz || {}).forEach(function (k) { VOZ_EXT[k] = cb.voz[k]; });
    Object.keys(cb.escenas || {}).forEach(function (k) { ESC_EXT[k] = cb.escenas[k]; });
    Object.keys(cb.quiz || {}).forEach(function (k) { QUIZ_EXT[k] = cb.quiz[k]; });
    Object.keys(cb.generadores || {}).forEach(function (k) { GEN[k] = cb.generadores[k]; });
    if (cb.ajuste) AJUSTE.push(cb.ajuste);
    if (cb.post) POST.push(cb.post);
    if (cb.pre) PRE.push(cb.pre);
    if (cb.fuentes && !document.querySelector('link[href="' + cb.fuentes + '"]')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = cb.fuentes; document.head.appendChild(l);
      EXTRA_FUENTES.push(cb.fuentes);
    }
  }
  var EXTRA_FUENTES = [];

  function limpio(h) { return String(h || '').replace(/<(svg|table)[\s\S]*?<\/\1>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&#160;|&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim(); }

  /* Escenas para vídeo y carrusel: una lista neutra que el reproductor dibuja. */
  function escenas(res, max) {
    var C = res.C, out = [];
    res.pages.forEach(function (pg) {
      var u = pg.u, e = null;
      if (ESC_EXT[pg.tipo]) e = ESC_EXT[pg.tipo](pg, C);
      else if (pg.tipo === 'portada' || pg.tipo === 's_portada' || pg.tipo === 't_portada') e = { k: 'portada', t: C.titulo, s: C.matN };
      else if ((pg.tipo === 'apertura' || pg.tipo === 's_titulo') && u) e = { k: 'titulo', n: pg.n, t: sub(u.t, C), s: 'Unidad ' + pg.n };
      else if ((pg.tipo === 'explica') && u) e = (u.i || []).map(function (x) { return { k: 'idea', t: sub(x, C), s: sub(u.t, C) }; });
      else if (pg.tipo === 's_idea' && u) e = { k: 'idea', t: sub(u.i[pg.k], C), s: sub(u.t, C) };
      else if (pg.tipo === 'repaso' && u) e = { k: 'lista', t: 'Repaso · ' + sub(u.t, C), l: (u.k || []).map(function (x) { return sub(x, C); }) };
      else if ((pg.tipo === 'actividad' || pg.tipo === 'ficha') && pg.items && pg.items[0] && !pg.relleno) {
        var x = pg.items.filter(function (y) { return y.s; })[0] || pg.items[0];
        e = { k: 'pregunta', t: limpio(x.e), s: x.s };
      } else if (pg.tipo === 'contra' || pg.tipo === 's_cierre') e = { k: 'cierre', t: C.titulo, s: C.cfg.autor || '' };
      if (!e) return;
      (Array.isArray(e) ? e : [e]).forEach(function (z) { if (z && z.t && !(out.length && out[out.length - 1].t === z.t)) out.push(z); });
    });
    if (max && out.length > max) {
      var ult = out[out.length - 1], paso = (out.length - 1) / (max - 1), sel = [];
      for (var i = 0; i < max - 1; i++) sel.push(out[Math.round(i * paso)]);
      sel.push(ult); out = sel;
    }
    return { C: C, lista: out };
  }

  /* Preguntas autocorregibles para el panel de aprendizaje. */
  function quiz(res, uid, n, semilla) {
    var C = res.C, u = res.unidades.filter(function (x) { return x.id === uid; })[0] || res.unidades[0];
    var r = rng(hash(u.id + ':quiz') + (semilla || 1) * 977);
    var pool = [];
    if (QUIZ_EXT[C.mat]) pool = QUIZ_EXT[C.mat](u, C, r, n * 2) || [];
    if (pool.length < n) pool = pool.concat(ejercicios(u, C, r, n * 4).filter(function (x) {
      return x.tipo === 'vf' || x.tipo === 'mc' || (x.tipo === 'corta' && x.s && String(x.s).length < 40);
    }));
    var vistos = {}, out = [];
    pool.forEach(function (x) { var k = limpio(x.e); if (!vistos[k] && out.length < n) { vistos[k] = 1; out.push(x); } });
    return { u: u, items: out };
  }
  function acierta(x, resp) {
    var nrm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s.,;:()$€¡!¿?]/g, '').replace(/^x=/, ''); };
    if (x.tipo === 'vf') return resp === x.s;
    if (x.tipo === 'mc') return +resp === x.c;
    return (x.ac || [x.s]).some(function (a) { return nrm(a) === nrm(resp); });
  }

  var H = {
    esc: esc, rng: rng, hash: hash, ent: ent, pick: pick, mezcla: mezcla, may: may, minus: minus, sub: sub, num: num, din: din,
    figura: figura, h1: h1, h2: h2, cabecera: cabecera, folio: folio, guia: guia, avatar: avatar, lineas: lineas,
    marcoImagen: marcoImagen, chipsClave: chipsClave, tabla: tabla, itemHTML: itemHTML, presupuesto: presupuesto,
    it: it, ejercicios: ejercicios, llenar: llenar, envolver: envolver, limpio: limpio, armarLibro: armarLibro
  };

  window.EU_EDITORIAL = {
    registrar: registrar, H: H, escenas: escenas, quiz: quiz, acierta: acierta, EXTRA_FUENTES: EXTRA_FUENTES,
    PLANTILLAS: PLANTILLAS, PRODUCTOS: PRODUCTOS, PAPEL: PAPEL, FUENTES: FUENTES,
    ensamblar: ensamblar, paginaHTML: paginaHTML, textoVoz: textoVoz, plantillaAuto: plantillaAuto,
    documento: documento, imprimir: imprimir, epub: epub, blobHTML: blobHTML, nombreArchivo: nombreArchivo, sub: sub
  };
})();
