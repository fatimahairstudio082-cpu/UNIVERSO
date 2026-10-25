/* b6_portadas_plantillas.js — diseños de portada, contraportada y certificado de la «Parte 4 · Sistema único» de Fátima
   (`window.EU_PORTADAS_PLANT`, 25-10-2026). Fátima: «una carpeta que me hizo ChatGPT con nuevas plantillas para portadas y
   contraportadas; organizarla también en el libro; no vamos a eliminar nada, solamente integrar».
   - Libro: estilo de portada nuevo `cfg.acab.portada = 'diseno'` con `cfg.acab.portadaDis` = id del diseño (10). La ilustración
     va entera (sin recortar) sobre un fondo con la misma imagen difuminada; el título, el nivel y la autora van dentro del
     recuadro vacío que trae cada diseño. Contraportada a juego: el texto del motor sobre la misma imagen oscurecida.
   - Curso premium: `cfg.acab.certDis` = id del certificado (9; «Recogidos y novias» no entra: los recogidos están fuera del
     curso). El nombre va sobre la línea del diseño, la fecha sobre «Fecha», la firma de Fátima sobre «Firma» y el n.º abajo.
     Sin elegir, el certificado de siempre.
   Las imágenes de su ZIP son pequeñas (303 × 508 px): se guardan ampliadas ×3 en `referencias/portadas_diseno/` y
   `referencias/certificados_diseno/`; para imprenta conviene el original en grande. Las demás portadas no cambian. */
(function () {
  'use strict';
  if (window.EU_PORTADAS_PLANT) return;
  var ED = window.EU_EDITORIAL; if (!ED || !ED.registrar) return;
  /* [id, nombre, archivo, oscuro, recuadro del título en % de la imagen: x, y, ancho, alto, 'c' = círculo] */
  var PORT = [
    ['negro_oro', 'Negro y oro', 'negro-oro.jpg', 1, [9, 78, 82, 17]],
    ['rosa_crema', 'Rosa crema', 'rosa-crema.jpg', 0, [18, 80, 72, 15, 'p']],   /* sin recuadro vacío: el título va en una placa crema */
    ['retrato_realeza', 'Retrato real', 'retrato-realeza.jpg', 1, [9, 76.5, 84, 18.5]],
    ['marmol', 'Mármol y herramientas', 'marmol-herramientas.jpg', 0, [11, 37.5, 66, 39, 'c']],
    ['glamour_rosa', 'Glamour rosa', 'glamour-rosa.jpg', 0, [6, 79, 88, 14]],
    ['balayage', 'Balayage y color', 'balayage-color.jpg', 0, [12, 74.5, 83, 17.5]],
    ['bob_negro_oro', 'Bob negro y oro', 'bob-negro-oro.jpg', 1, [13, 78, 82, 13]],
    ['herramientas_rosa', 'Herramientas rosa', 'herramientas-rosa.jpg', 0, [18, 75.5, 73, 17]],
    ['melenas_mechas', 'Melenas y mechas', 'melenas-mechas.jpg', 1, [10, 79.5, 82, 15]],
    ['floral', 'Floral clásico', 'floral-clasico.jpg', 0, [8, 73.5, 80, 17.5]]
  ];
  /* [id, nombre, archivo, oscuro, y de la línea del nombre, x0, x1, y de Firma/Fecha, centro de Firma, centro de Fecha] (px de la imagen 303 × 508) */
  var CERT = [
    ['peluqueria_dama', 'Peluquería de dama', 'peluqueria-dama.jpg', 1, 358, 36, 273, 452, 74, 241],
    ['colorimetria', 'Colorimetría capilar', 'colorimetria-capilar.jpg', 0, 356, 43, 273, 449, 82, 239],
    ['corte_peinado', 'Corte y peinado femenino', 'corte-peinado.jpg', 1, 359, 38, 272, 452, 75, 234],
    ['mechas_balayage', 'Mechas y balayage', 'mechas-balayage.jpg', 0, 357, 34, 262, 449, 71, 223],
    ['herramientas', 'Herramientas profesionales', 'herramientas.jpg', 1, 360, 32, 272, 452, 73, 229],
    ['tecnicas_color', 'Colorimetría y técnicas de color', 'tecnicas-color.jpg', 0, 320, 34, 273, 413, 82, 231],
    ['corte_color', 'Corte, color y estilo', 'corte-color-estilo.jpg', 0, 320, 35, 274, 415, 79, 228],
    ['coloracion', 'Coloración avanzada', 'coloracion-avanzada.jpg', 1, 322, 39, 264, 415, 73, 223],
    ['integral', 'Formación integral', 'formacion-integral.jpg', 0, 270, 30, 273, 372, 87, 219]
  ];
  var DIRP = './referencias/portadas_diseno/', DIRC = './referencias/certificados_diseno/', DATA = {};
  /* cada imagen como data URL: así va dentro del libro, el PDF y el curso descargados */
  PORT.map(function (p) { return DIRP + p[2]; }).concat(CERT.map(function (c) { return DIRC + c[2]; })).forEach(function (u) {
    try { fetch(u).then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) { if (!b) return; var fr = new FileReader(); fr.onload = function () { DATA[u] = fr.result; }; fr.readAsDataURL(b); }).catch(function () { }); } catch (e) { }
  });
  function src(u) { return DATA[u] || u; }
  function porId(L, id) { for (var i = 0; i < L.length; i++) if (L[i][0] === id) return L[i]; return null; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var FUENTES = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Playfair+Display:wght@700;900&family=Dancing+Script:wght@600&display=swap">';

  /* ─────────── libro: portada y contraportada ─────────── */
  function texto(C) {
    var sub = [C.cursoN, C.N && C.N.n && String(C.cursoN || '').indexOf(C.N.n) !== 0 ? C.N.n : ''].filter(Boolean).join(' · ');
    if (C.libre) sub = C.cfg.subtitulo || C.subtitulo || sub;
    return { titulo: C.titulo || C.matN || '', sub: sub, autor: C.cfg.autor || '', anio: new Date().getFullYear() };
  }
  function portada(C, P) {
    var u = src(DIRP + P[2]), r = P[4], osc = P[3], t = texto(C), tl = t.titulo.length;
    var col = osc ? '#F3E3C3' : '#1F1B18', acc = osc ? '#D4AF6A' : '#9C7A45';
    var tam = (tl > 70 ? 6 : tl > 45 ? 7.4 : tl > 28 ? 8.8 : 10.5) * (r[4] === 'c' ? 0.9 : 1);   /* mm: el recuadro mide unos 50 mm de alto en A4 */
    var caja = 'position:absolute;left:' + r[0] + '%;top:' + r[1] + '%;width:' + r[2] + '%;height:' + r[3] + '%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 4%;box-sizing:border-box;gap:1.2mm;color:' + col + (r[4] === 'p' ? ';background:rgba(255,250,245,.92);border:0.5mm solid #C9A46A;border-radius:2mm' : '');
    return FUENTES + '<div style="position:absolute;inset:0;overflow:hidden;background:' + (osc ? '#0E0D0C' : '#F7EDE8') + '">' +
      '<div style="position:absolute;inset:-8mm;background:url(' + u + ') center/cover no-repeat;filter:blur(10px);opacity:.75"></div>' +
      '<div style="position:absolute;inset:0;background:' + (osc ? 'rgba(14,13,12,.35)' : 'rgba(255,250,246,.35)') + '"></div>' +
      '<div style="position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);height:100%;aspect-ratio:303/508;max-width:100%">' +
      '<img src="' + u + '" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;display:block">' +
      '<div style="' + caja + '">' +
      (t.sub ? '<div style="font:600 2.9mm/1.25 Montserrat,system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;color:' + acc + '">' + esc(t.sub) + '</div>' : '') +
      '<div style="font-family:\'Playfair Display\',Georgia,serif;font-weight:900;font-size:' + tam + 'mm;line-height:1.05">' + esc(t.titulo) + '</div>' +
      (t.autor ? '<div style="font-family:\'Dancing Script\',cursive;font-size:6.5mm;color:' + acc + '">' + esc(t.autor) + '</div>' : '') +
      '</div></div></div>';
  }
  function contra(h, P) {
    var u = src(DIRP + P[2]);
    return String(h).replace(/(position:absolute;inset:0;)background:[^;]+;/, '$1background:linear-gradient(180deg,rgba(14,13,12,.62),rgba(14,13,12,.9)),url(' + u + ') center/cover no-repeat;');
  }
  ED.registrar({ post: function (h, pg, C) {
    var A = (C.cfg && C.cfg.acab) || {}; if (A.portada !== 'diseno' || (pg.tipo !== 'portada' && pg.tipo !== 'contra')) return h;
    var P = porId(PORT, A.portadaDis) || PORT[0];
    try { return pg.tipo === 'portada' ? portada(C, P) : contra(h, P); } catch (e) { console.warn('portada diseño', e); return h; }
  } });

  /* ─────────── curso premium: diseño del certificado (lo dibuja b6_curso_premium.js con D.certDis) ─────────── */
  function ponerCert(D, res) {
    var A = (res && res.C && res.C.cfg && res.C.cfg.acab) || {}, c = porId(CERT, A.certDis);
    if (!D || !c) return D;
    D.certDis = { img: src(DIRC + c[2]), n: c[1], osc: c[3], y: c[4], x0: c[5], x1: c[6], fy: c[7], fx: c[8], dx: c[9], w: 303, h: 508 };
    return D;
  }
  (function engancha(k) {
    var CA = window.EU_CURSO_ANIM;
    if (!CA || !CA.enriquecer) { if (k < 200) setTimeout(function () { engancha(k + 1); }, 300); return; }
    if (CA.enriquecer._plantCert) return;
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) { return Promise.resolve(enr.apply(this, arguments)).then(function (D2) { return ponerCert(D2 || D, res); }); };
    CA.enriquecer._plantCert = 1;
  })(0);

  /* ─────────── panel ─────────── */
  var CN = window.EU_CONECTORES;
  if (CN && CN.panel && !CN.panel._plant) {
    var orig = CN.panel;
    var nuevo = function (ed, seccion, U) {
      var el = U.el, ST = U.ST, chip = U.chip, A = ed.cfg.acab || {}, setA = function (o) { ed.set('acab', Object.assign({}, ed.cfg.acab || {}, o)); };
      var s = seccion('Diseños de portada y certificado');
      var on = A.portada === 'diseno', f = el('div', ST.fila);
      var b0 = el('button', chip(!on), 'No usar'); b0.onclick = function () { setA({ portada: A.portada === 'diseno' ? 'auto' : A.portada }); }; f.appendChild(b0);
      PORT.forEach(function (p) {
        var b = el('button', chip(on && (A.portadaDis || PORT[0][0]) === p[0]));
        b.innerHTML = '<img src="' + src(DIRP + p[2]) + '" alt="" style="width:22px;height:36px;object-fit:cover;border-radius:3px;vertical-align:middle;margin-right:6px">' + esc(p[1]);
        b.onclick = function () { setA({ portada: 'diseno', portadaDis: p[0] }); }; f.appendChild(b);
      });
      s.appendChild(el('div', ST.lbl, 'Portada y contraportada'));
      s.appendChild(f);
      s.appendChild(el('div', ST.lbl, 'Certificado del curso premium'));
      var g = el('div', ST.fila), cv = A.certDis || '';
      var c0 = el('button', chip(!cv), 'El de siempre'); c0.onclick = function () { setA({ certDis: '' }); }; g.appendChild(c0);
      CERT.forEach(function (c) {
        var b = el('button', chip(cv === c[0]));
        b.innerHTML = '<img src="' + src(DIRC + c[2]) + '" alt="" style="width:22px;height:36px;object-fit:cover;border-radius:3px;vertical-align:middle;margin-right:6px">' + esc(c[1]);
        b.onclick = function () { setA({ certDis: c[0] }); }; g.appendChild(b);
      });
      s.appendChild(g);
      s.appendChild(el('div', ST.nota, 'El título, el nivel y la autora van dentro del recuadro del diseño; la contraportada sale a juego. En el certificado, el nombre del alumno, la fecha, tu firma y el número van sobre sus líneas.'));
      return orig.apply(this, arguments);
    };
    nuevo._plant = true; Object.keys(orig).forEach(function (k) { if (!(k in nuevo)) nuevo[k] = orig[k]; });
    CN.panel = nuevo;
  }
  window.EU_PORTADAS_PLANT = { PORT: PORT, CERT: CERT, portada: portada, ponerCert: ponerCert };
})();
