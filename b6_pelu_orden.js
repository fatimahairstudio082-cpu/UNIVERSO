/* b6_pelu_orden.js — orden del libro de Peluquería (materia `pelu`).
   Antes las unidades salían solo del cerebro del Estudio (color, mechas, tratamientos, cejas, pestañas,
   maquillaje…): no había ninguna unidad de corte y los 145 dibujos se repartían por parecido de palabras.
   Ahora el libro sigue el orden del oficio:
     1 Higiene, seguridad y herramientas · 2 El cabello y el diagnóstico · 3 Secciones, elevación y mecha guía
     4–13 Cortes: una unidad por familia de EU_CORTES, con la ficha técnica de cada corte (zonas Z0–Z6,
          elevación, sección, herramienta) · Color · Mechas · Tratamientos químicos · Peinados · El salón como negocio.
   Estética (cejas, pestañas, maquillaje, manicura…) solo con `cfg.op.estetica = true`.
   Cada unidad lleva `u.mods`: los únicos modelos de la biblioteca que pueden salir en ella
   (b6_cerebro_svg.tiposDe, b6_modelos_libro y b6_apertura_dibujo lo respetan).
   Cargar después de b6_pelu_fichas.js. */
(function () {
  'use strict';
  var CU = window.EU_CURRICULO, ED = window.EU_EDITORIAL;
  if (!CU || !ED || window.EU_PELU_ORDEN) return;

  var BANDA = ['fp', 'adu', 'bach'];
  var ZN = ['nuca', 'nuca alta', 'occipital', 'parietal', 'lateral', 'coronilla', 'flequillo'];
  var M = {
    fund: ['pe_desinfeccion', 'pe_epis', 'pe_postura', 'pe_quimicos', 'pe_electricidad', 'pe_residuos', 'pe_esterilizador',
      'pe_tijera', 'pe_entresacar', 'pe_navaja', 'pe_maquina', 'pe_peines', 'pe_cepillos', 'pe_pinzas', 'pe_capa', 'pe_pulverizador',
      'pe_espejo', 'pe_brocha', 'pe_secador', 'pe_plancha', 'pe_tenacilla', 'pe_difusor', 'pe_lavacabezas', 'pe_sillon', 'pe_carrito', 'pe_vaporizador'],
    cab: ['pe_estructura_pelo', 'pe_foliculo', 'pe_ciclo', 'pe_tipos_pelo', 'pe_grosor', 'pe_porosidad', 'pe_cuero', 'pe_melanina',
      'pe_caida', 'pe_densidad', 'pe_diagnostico', 'pe_ficha_cliente', 'pe_consulta', 'pe_lavado'],
    base: ['pe_mecha_guia', 'pe_formas_cara', 'pe_puntas', 'pe_secciones'],
    corte: { melenas: ['pe_bob'], capas: ['pe_capas'], cortos: ['pe_pixie'], flequillos: ['pe_flequillo'],
      cab_maquina: ['pe_fade_niveles'], rizado: ['pe_corte_rizado'] },
    color: ['pe_rueda_color', 'pe_niveles', 'pe_reflejos', 'pe_oxidante', 'pe_como_tine', 'pe_prueba_alergia', 'pe_canas',
      'pe_temporal', 'pe_tiempo_exposicion', 'pe_raiz_medios', 'pe_proporcion_mezcla', 'pe_bol_paletina'],
    mechas: ['pe_mechas', 'pe_balayage', 'pe_decoloracion', 'pe_matizar'],
    quim: ['pe_permanente', 'pe_alisado', 'pe_ph', 'pe_rulos'],
    pei: ['pe_trenza', 'pe_mono', 'pe_coleta', 'pe_ondas', 'pe_brushing', 'pe_novia', 'pe_productos_fijar', 'pe_cardado',
      'pe_semirrecogido', 'pe_ondas_plancha', 'pe_extensiones'],
    neg: ['pe_tiempo_servicio', 'pe_precio', 'pe_agenda', 'pe_redes_salon', 'pe_venta_productos'],
    est: ['pe_masaje_capilar', 'pe_mascarilla', 'pe_barba']
  };
  /* divisiones de la cabeza (b6_pelu_limpieza) en la unidad de secciones */
  if (window.EU_MODELOS) window.EU_MODELOS.lista('pelu', 'div').forEach(function (m) { M.base.push(m.id); });
  /* familia del cerebro → grupo de modelos y bloque del libro */
  var CEREBRO = { 'Colorimetría': ['color', 1], 'Mechas': ['mechas', 2], 'Hidratación': ['quim', 3], 'Queratina y alisado': ['quim', 3],
    'Químicos': ['quim', 3], 'Técnicas de cabello': ['pei', 4], 'Cejas': ['est', 9], 'Pestañas': ['est', 9], 'Maquillaje': ['est', 9] };

  function R(p, o, c, x) { return { p: p, o: o, c: c, x: x }; }
  function mezcla(r, k) { var n = r.o.length, s = k % n; r.o = r.o.slice(s).concat(r.o.slice(0, s)); r.c = (r.c - s + n) % n; return r; }
  function uni(id, t, i, k, rep, mods, f) { return { m: 'pelu', id: id, b: BANDA, t: t, i: i, k: k, rep: rep || [], err: [], f: f || null, mods: mods, fam: 'Peluquería', _ajuste: 0 }; }

  function fijas() {
    var F0 = {
      fund: uni('pe_u_fund', 'Higiene, seguridad y herramientas', [
        'El puesto de trabajo se prepara antes de cada cliente: herramientas limpias, desinfectadas y a mano.',
        'Tijera, navaja, máquina y peines tienen cada uno su uso; elegir mal la herramienta cambia el resultado del corte.',
        'Guantes y protección para los ojos con cualquier producto químico; capa y toalla para la clienta.',
        'La postura cuenta: altura del sillón, peso repartido y muñeca recta para trabajar muchas horas sin lesiones.',
        'Las herramientas se lavan y desinfectan después de atender a cada cliente: así no se pasan restos de producto (su pH), hongos ni piojos de una persona a otra.',
        'Un cabello enchiclado o maltratado no admite un proceso químico agresivo: ni keratina ni decoloración hasta recuperarlo.'],
        ['desinfección', 'EPI', 'tijera', 'navaja', 'máquina', 'peine de corte', 'postura'],
        [R('¿Qué herramienta deja la punta más suave y desfilada?', ['Tijera recta', 'Navaja', 'Máquina sin peine'], 1, 'La navaja corta en bisel y deja la punta afinada.'),
         R('¿Qué protección es obligatoria con químicos?', ['Guantes', 'Gafas de sol', 'Delantal de tela'], 0, 'Los guantes evitan dermatitis por contacto.'),
         R('¿Por qué se lavan y desinfectan las herramientas después de cada cliente?', ['Para que brillen más', 'Solo hace falta si se ven sucias', 'Para no pasar restos de producto, hongos ni piojos a la siguiente persona'], 2, 'Lo que queda en peines y tijeras viaja de una cabeza a otra: producto con otro pH, hongos o piojos.'),
         R('Un cabello enchiclado o maltratado, ¿admite keratina o decoloración?', ['Sí, con más producto', 'No: primero hay que recuperarlo', 'Sí, si se hace rápido'], 1, 'Un proceso químico agresivo sobre un cabello así lo rompe.')], M.fund),
      cab: uni('pe_u_cab', 'El cabello y el diagnóstico', [
        'Cada pelo tiene cutícula, corteza y médula; la cutícula cerrada da brillo y la abierta absorbe más producto.',
        'Antes de cortar o teñir se mira el tipo de cabello (liso, ondulado, rizado, afro), su grosor, densidad y porosidad.',
        'La ficha de la clienta recoge el diagnóstico, los productos usados y el resultado de cada servicio.',
        'La consulta decide el servicio: lo que la clienta quiere, lo que su cabello permite y el tiempo que va a dedicar a peinarse.'],
        ['cutícula', 'corteza', 'porosidad', 'densidad', 'tipo de cabello', 'ficha técnica', 'consulta'],
        [R('¿Qué capa del pelo da el brillo?', ['Médula', 'Corteza', 'Cutícula'], 2, 'La cutícula cerrada refleja la luz.'),
         R('Un cabello muy poroso…', ['absorbe el color más rápido', 'repele el color', 'no cambia'], 0, 'Con la cutícula abierta el producto entra antes y también sale antes.'),
         R('¿Dónde se anota lo que se aplicó a la clienta?', ['En la ficha técnica', 'En la factura', 'En ningún sitio'], 0, 'La ficha permite repetir o corregir el servicio.')], M.cab),
      base: uni('pe_u_base', 'Secciones, elevación y mecha guía', [
        'Todo corte empieza dividiendo la cabeza en zonas: nuca, occipital, parietales, laterales, coronilla y flequillo (Z0–Z6).',
        'La elevación es el ángulo al que se levanta la mecha respecto a la cabeza: 0° deja peso, 90° reparte capas, 180° acorta arriba.',
        'La mecha guía marca el largo; cada mecha nueva se compara con ella para que el corte sea parejo.',
        'La dirección de la sección (horizontal, vertical, diagonal) la decide el tipo de cabello y la forma que se busca.'],
        ['sección', 'zona', 'elevación', 'mecha guía', 'grados', 'diagonal', 'forma de la cara'],
        [R('¿Qué elevación deja todo el peso en el borde?', ['0°', '90°', '180°'], 0, 'Sin elevación todas las mechas caen a la misma línea.'),
         R('¿Para qué sirve la mecha guía?', ['Para marcar el largo de referencia', 'Para sujetar el pelo', 'Para medir el color'], 0, 'Todas las mechas se cortan comparándolas con la guía.'),
         R('Cuanto más se eleva una mecha…', ['más larga queda', 'más corta queda respecto a la de abajo', 'no cambia'], 1, 'Por eso la elevación crea capas.'),
         R('¿Qué pasa si se corta sin llevar la guía?', ['Queda más parejo', 'No cambia nada', 'El corte pierde el rumbo'], 2, 'Cada mecha nueva se compara con la guía; sin ella no hay referencia.')], M.base,
        { t: 'flujo', p: ['Diagnóstico', 'Secciones', 'Mecha guía', 'Elevación', 'Corte', 'Repaso'] }),
      neg: uni('pe_u_neg', 'El salón como negocio', [
        'El precio de un servicio suma el tiempo de trabajo, el producto gastado y los gastos fijos del salón.',
        'La agenda se organiza por duración real de cada servicio para no hacer esperar a nadie.',
        'Vender el producto adecuado para casa alarga el resultado del servicio y fideliza a la clienta.',
        'Las redes del salón muestran trabajos reales con el permiso de la clienta.'],
        ['precio', 'tiempo de servicio', 'agenda', 'venta de producto', 'fidelización', 'redes'],
        [R('¿Qué entra en el precio de un servicio?', ['Solo el producto', 'Tiempo, producto y gastos fijos', 'Lo que cobre la competencia'], 1, 'Si falta algún coste el servicio da pérdidas.'),
         R('¿Cómo se reserva la agenda?', ['Con la duración real de cada servicio', 'Cada 15 minutos sin mirar el servicio', 'Sin cita'], 0, 'Evita esperas y huecos muertos.')], M.neg)
    };
    /* errores comunes (Fátima, 9-10-2026): salen en «Error frecuente: … ¿Qué harías para evitarlo?» */
    F0.fund.err = ['Atender a la siguiente clienta con las herramientas sin lavar ni desinfectar', 'Hacer keratina o decoloración sobre un cabello enchiclado o maltratado'];
    F0.base.err = ['Cortar sin llevar la guía: el corte pierde el rumbo'];
    return F0;
  }

  function unidadCorte(fa) {
    var CO = window.EU_CORTES, L = CO.lista(fa.id), MO = window.EU_MODELOS;
    var mods = (M.corte[fa.id] || []).concat(M.base.slice(0, 3));
    var todos = MO && MO.lista ? MO.lista('pelu').map(function (m) { return m.id; }) : [];
    /* cada corte: sus pasos de Guías 3D (b6_pelu_guias); la ficha genérica solo si el corte no tiene guía */
    L.forEach(function (c) {
      var g3 = todos.filter(function (id) { return id.indexOf('pe_g3d_' + c.id + '_') === 0; });
      if (g3.length) mods = mods.concat(g3);
      else todos.forEach(function (id) { if (id === 'pe_ft_' + c.id || id.indexOf('pe_ft_' + c.id + '_') === 0) mods.push(id); });
    });
    var rep = [], ideas = [];
    L.forEach(function (c) {
      var T = CO.tecnica(c.id) || {}, ev = T.elev || [0, 0, 0, 0, 0, 0, 0], mx = Math.max.apply(null, ev), mn = Math.min.apply(null, ev), iz = ev.indexOf(mx);
      var elev = mx === mn ? 'Elevación de ' + mx + '° en toda la cabeza' : 'Nuca a ' + ev[0] + '° y ' + ZN[iz] + ' a ' + mx + '°';
      ideas.push(c.n + ': ' + c.d + ' ' + elev + '; ' + (T.her || 'tijera').toLowerCase() + ', corte ' + (T.tipo || 'recto').toLowerCase() + '.');
      var g = 0; for (var q = 0; q < c.id.length; q++) g += c.id.charCodeAt(q);
      /* preguntas que distinguen un corte de otro (antes: herramienta y nuca en cada corte, casi siempre «Tijera» y «0°») */
      var otros = L.filter(function (o) { return o !== c; }).map(function (o) { return o.n; });
      if (c.d && otros.length >= 2) rep.push(mezcla(R('¿Qué corte es? «' + c.d + '»', [c.n, otros[g % otros.length], otros[(g + 1) % otros.length]], 0, 'Es «' + c.n + '»: ' + elev.toLowerCase() + '.'), g));
      var nucas = []; L.forEach(function (o) { var e0 = ((CO.tecnica(o.id) || {}).elev || [0])[0]; if (nucas.indexOf(e0) < 0) nucas.push(e0); });
      if (nucas.length > 1) rep.push(mezcla(R('En «' + c.n + '», ¿a qué elevación se corta la nuca?', [ev[0]].concat(nucas.filter(function (x) { return x !== ev[0]; }).slice(0, 2)).map(function (x) { return x + '°'; }), 0, 'La ficha técnica marca la nuca (Z0) a ' + ev[0] + '°.'), g + 1));
      if (T.her && !/^tijera$/i.test(T.her)) rep.push(mezcla(R('¿Qué herramienta se usa en «' + c.n + '»?', [T.her, T.her === 'Navaja' ? 'Máquina' : 'Navaja', 'Tijera'], 0, T.her + ', con acabado ' + (T.acabado || 'punteado').toLowerCase() + '.'), g + 2));
    });
    /* si toda la familia comparte nuca o herramienta, se pregunta una sola vez para la familia */
    var ev0 = (CO.tecnica((L[0] || {}).id) || {}).elev || [0];
    if (L.length && L.every(function (o) { return (((CO.tecnica(o.id) || {}).elev || [0])[0]) === ev0[0]; }))
      rep.push(mezcla(R('En los cortes de «' + fa.n + '», ¿a qué elevación se corta la nuca?', [ev0[0], (ev0[0] + 45) % 225, (ev0[0] + 90) % 225].map(function (x) { return x + '°'; }), 0, 'En todos los cortes de esta familia la ficha marca la nuca (Z0) a ' + ev0[0] + '°.'), fa.id.length));
    return uni('pe_u_c_' + fa.id, 'Cortes · ' + fa.n, ideas, L.map(function (c) { return c.n.toLowerCase(); }), rep, mods,
      { t: 'flujo', p: ['Diagnóstico', 'Secciones', 'Mecha guía', 'Elevación', 'Corte', 'Repaso'] });
  }

  var EST = false;
  function ordenar(cerebro) {
    var F = fijas(), bloques = [[], [], [], [], [], [], [], [], [], []];
    (cerebro || []).forEach(function (u) {
      var m = CEREBRO[u.fam]; if (!m) return;          /* «Hacer y aprender» no es una técnica de salón */
      if (m[1] === 9 && !EST) return;
      u.mods = M[m[0]]; bloques[m[1]].push(u);
    });
    var out = [F.fund, F.cab, F.base];
    /* Cortes de caballero ocultos en el libro y el curso de dama (Fátima, 9-10-2026): se cortan con máquina y otras
       técnicas; siguen en EU_CORTES y en Guías 3D. Para volver a mostrarlos: window.EU_PELU_CABALLERO = true. */
    if (window.EU_CORTES) window.EU_CORTES.familias().forEach(function (fa) { if (/^cab_/.test(fa.id) && !window.EU_PELU_CABALLERO) return; try { out.push(unidadCorte(fa)); } catch (e) { } });
    [1, 2, 3, 4].forEach(function (b) { out = out.concat(bloques[b]); });
    out.push(F.neg);
    if (EST) { var e = bloques[9]; if (e.length) e[0].mods = M.est; out = out.concat(e); }
    return out;
  }

  var uni0 = CU.unidades;
  CU.unidades = function (materia, bnd) {
    var o = uni0.apply(this, arguments);
    if (materia !== 'pelu') return o;
    try { var n = ordenar(o); return n.length ? n : o; } catch (e) { console.warn('pelu orden', e); return o; }
  };
  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) { EST = !!(cfg && cfg.op && cfg.op.estetica); return ens.apply(this, arguments); };

  /* ─────────── diagramas de corte con los datos de Guías 3D ───────────
     Las páginas «Diagrama» genéricas (mapa de conceptos, flujo, ciclo) se repetían en cada unidad.
     En las unidades de corte se cambian por «pe_corte»: ficha técnica + los 4 pasos de EU_CORTES.guiaDe
     (los mismos que monta <guias-3d>), uno por corte de la familia. En «Secciones, elevación y mecha guía»
     se cambian por las láminas de elevación 0°–180°. */
  var ZE = ['Borde', 'Nuca', 'Occipital', 'Media', 'Parietal', 'Alto', 'Coronilla'];
  var PART = { diagAtras: 'diagonal hacia atrás', diagAdelante: 'diagonal hacia delante', diagDelante: 'diagonal hacia delante', horizontal: 'horizontal', vertical: 'vertical', radial: 'radial', pivote: 'en pivote', concentrica: 'concéntrica' };
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function part(p) { return PART[p] || String(p || 'horizontal').replace(/([A-Z])/g, ' $1').toLowerCase(); }
  function elevTxt(e) {
    e = e || [0]; var mx = Math.max.apply(null, e), mn = Math.min.apply(null, e);
    if (mx === mn) return mx + '° en todas las zonas';
    return ZE[0] + ' ' + e[0] + '° → ' + ZE[6].toLowerCase() + ' ' + e[6] + '° (máx. ' + mx + '° en ' + ZE[e.indexOf(mx)].toLowerCase() + ')';
  }
  function modo(C) { return ((C.cfg && C.cfg.acab) || {}).dibujo === '2d' ? 'color' : '3d'; }
  function figura(id, C, alto) {
    var MO = window.EU_MODELOS; if (!MO || !MO.modelo(id)) return '';
    var s = ''; try { s = MO.svg(id, modo(C), { rot: true }); } catch (e) { }
    return s ? '<div style="height:' + alto + 'mm;display:flex;justify-content:center;margin:0 0 4mm">' + s.replace('<svg', '<svg style="height:100%;width:auto;max-width:100%"') + '</div>' : '';
  }
  ED.registrar({ paginas: {
    pe_corte: function (pg, C) {
      var H = ED.H, T = C.T, CO = window.EU_CORTES;
      if (pg.elevs) {
        var MO = window.EU_MODELOS;
        return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Diagrama · elevación</div>' +
          H.h1(C, 'La elevación decide la forma') + pg.elevs.map(function (e) {
            var m = MO && MO.modelo('pe_elev_' + e); if (!m) return '';
            return '<div style="display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:5mm;align-items:center;margin:0 0 5mm;padding-bottom:4mm;border-bottom:1px solid ' + T.soft + '">' +
              figura('pe_elev_' + e, C, 62) + '<div><b style="font-family:' + T.tit + ';font-size:1.15em;color:' + T.acc + '">' + es(m.n) + '</b><p style="margin:2mm 0 0;font-size:.92em">' + es(m.intro) + '</p><p style="margin:2mm 0 0;font-size:.88em;opacity:.85"><b>Por qué funciona:</b> ' + es(m.porque) + '</p></div></div>';
          }).join('') + H.folio(C, pg);
      }
      if (pg.mod) {
        var md = window.EU_MODELOS && window.EU_MODELOS.modelo(pg.mod); if (!md) return H.cabecera(C, pg) + H.folio(C, pg);
        return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Diagrama</div>' +
          H.h1(C, es(md.n)) + figura(md.id, C, 100) + '<p style="max-width:160mm">' + es(md.intro) + '</p>' +
          (md.q || []).map(function (q, i) { return '<div style="margin:0 0 2.5mm"><b style="color:' + T.acc + '">' + (i + 1) + '.</b> ' + es(q[0]) + '<div style="font-size:.86em;opacity:.8;margin-top:1mm">' + es(q[1]) + '</div></div>'; }).join('') +
          (md.porque ? '<p style="font-size:.9em;margin-top:3mm"><b>Por qué funciona:</b> ' + es(md.porque) + '</p>' : '') + H.folio(C, pg);
      }
      if (pg.familia) {
        var LF = CO.lista(pg.familia);
        return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Diagrama comparativo · Guías 3D</div>' +
          H.h1(C, 'Elevación por zona en ' + es(pg.u.t.replace(/^Cortes · /, '').toLowerCase())) +
          '<p style="margin:0 0 4mm;max-width:160mm">Cada fila es un corte; cada columna, una zona de la cabeza de la nuca (Z0) a la coronilla (Z6). Cuanto más oscuro, más se eleva la mecha y más capa deja.</p>' +
          '<table style="width:100%;border-collapse:collapse;font-size:.82em"><tr><th style="text-align:left;padding:1.5mm">Corte</th>' + ZE.map(function (z, i) { return '<th style="padding:1.5mm;font-weight:600">Z' + i + '<div style="font-weight:400;font-size:.8em;opacity:.7">' + z + '</div></th>'; }).join('') + '<th style="padding:1.5mm">Herramienta</th></tr>' +
          LF.map(function (c) { var t = CO.tecnica(c.id); return '<tr style="border-top:1px solid ' + T.soft + '"><td style="padding:1.8mm;font-weight:600">' + es(c.n) + '</td>' + t.elev.map(function (e) { return '<td style="padding:1.8mm;text-align:center;background:rgba(200,50,58,' + (0.08 + e / 180 * 0.55).toFixed(2) + ')">' + e + '°</td>'; }).join('') + '<td style="padding:1.8mm">' + es(t.her) + '</td></tr>'; }).join('') + '</table>' +
          '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3mm;margin-top:6mm">' + LF.map(function (c) { var rg = CO.reglaDe(c.mejor[0]); return '<div style="background:' + T.soft + ';border-radius:' + Math.min(T.r, 6) + 'px;padding:3mm;font-size:.82em"><b>' + es(c.n) + '</b><div style="margin-top:1mm">Cabello ideal: ' + es(rg.n) + ' · sección ' + es(part(rg.part)) + '</div></div>'; }).join('') + '</div>' + H.folio(C, pg);
      }
      var cab = pg.cab, c = CO && CO.get(pg.corte), g = c && CO.guiaDe(pg.corte, cab || c.mejor[0]), t = c && CO.tecnica(pg.corte);
      if (!g) return H.cabecera(C, pg) + H.folio(C, pg);
      var rg = CO.reglaDe(cab || c.mejor[0]);
      return H.cabecera(C, pg) + '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 2mm">Diagrama de corte · Guías 3D</div>' +
        H.h1(C, es(c.n) + (cab ? ' en cabello ' + es(rg.n.split(' ·')[0].toLowerCase()) : '')) + '<p style="margin:0 0 3mm;max-width:160mm">' + es(c.d) + '</p>' +
        (cab ? (function () { var s = ''; try { s = window.EU_PELU_FICHAS.svg(c.id, cab, modo(C)); } catch (e) { } return s ? '<div style="height:68mm;display:flex;justify-content:center;margin:0 0 4mm">' + s.replace('<svg', '<svg style="height:100%;width:auto;max-width:100%"') + '</div>' : ''; })() : figura('pe_ft_' + c.id, C, 68)) +
        '<span style="font-size:.84em"><b>' + (cab ? 'Cabello' : 'Cabello ideal') + ':</b> ' + es(rg.n) + (cab && !g.encaja ? ' (no es su cabello ideal: sigue el aviso)' : '') + '</span>' +
        '<div style="display:flex;flex-wrap:wrap;gap:2mm 6mm;font-size:.84em;margin:2mm 0 4mm"><span><b>Sección:</b> ' + es(part(rg.part)) + '</span><span><b>Herramienta:</b> ' + es(t.her) + '</span><span><b>Acabado:</b> ' + es(t.acabado) + '</span></div>' +
        '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:3mm">' + g.pasos.map(function (p, i) {
          var txt = i === 0 ? String(p.texto || '').replace(c.n + '. ' + c.d, '').trim() : p.texto;
          return '<div style="background:' + T.soft + ';border-radius:' + Math.min(T.r, 6) + 'px;padding:3mm 3.5mm;font-size:.8em;line-height:1.35">' +
            '<b style="font-family:' + T.tit + ';color:' + T.acc + ';font-size:1.1em">' + es(p.titulo) + '</b>' +
            '<div style="margin:1.5mm 0">Partición ' + es(part(p.particionB)) + ' · ' + es(elevTxt(p.elevB)) + ' · ' + es(p.herramienta) + ' · ' + es(String(p.tipoCorte || '').toLowerCase()) + '</div>' +
            (txt ? '<div>' + es(txt) + '</div>' : '') + (p.resultado ? '<div style="margin-top:1.5mm;opacity:.85"><b>Resultado:</b> ' + es(p.resultado) + '</div>' : '') + '</div>';
        }).join('') + '</div>' +
        (g.aviso ? '<p style="font-size:.82em;margin:3mm 0 0"><b>Aviso del cabello:</b> ' + es(g.aviso) + '</p>' : '') + H.folio(C, pg);
    }
  } });

  function diagramasCorte(res, cfg) {
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || !window.EU_CORTES) return res;
    var CO = window.EU_CORTES, pages = res.pages, porU = {}, usados = {}, C = res.C, H = ED.H;
    pages.forEach(function (p, i) { if (p.u && p.u.m === 'pelu') (porU[p.u.id] = porU[p.u.id] || []).push(i); if (p.gen) usados[p.gen] = 1; if (p.mod) usados[p.mod] = 1; });
    var CABS = CO.cabellos().map(function (x) { return x.id; }), PEL = ['pel_ph', 'pel_cabello'];
    Object.keys(porU).forEach(function (uid) {
      var idx = porU[uid];
      if (uid === 'pe_u_base') {
        var E = [[0, 45], [90, 135], [180]], k = 0;
        idx.forEach(function (i) { var p = pages[i]; if (p.tipo === 'pro_diagrama' && k < E.length) pages[i] = { tipo: 'pe_corte', u: p.u, n: p.n, num: p.num, elevs: E[k++] }; });
        return;
      }
      if (uid.indexOf('pe_u_c_') !== 0) return;
      var cortes = CO.lista(uid.slice(7)).map(function (c) { return c.id; }), j = 0;
      /* primero las láminas sueltas de ficha técnica (pasan a ficha + pasos), luego los diagramas genéricos */
      var huecos = idx.filter(function (i) { var p = pages[i]; return p.tipo === 'vis' && /pe_ft_/.test(String(p.gen || '') + JSON.stringify(p.v && p.v.id || '')); })
        .concat(idx.filter(function (i) { return pages[i].tipo === 'pro_diagrama'; }));
      var fam = false, v = 0;
      huecos.forEach(function (i) {
        var p = pages[i];
        if (j < cortes.length) { pages[i] = { tipo: 'pe_corte', u: p.u, n: p.n, num: p.num, corte: cortes[j++] }; return; }
        if (!fam) { fam = true; pages[i] = { tipo: 'pe_corte', u: p.u, n: p.n, num: p.num, familia: uid.slice(7) }; return; }
        /* el mismo corte en otro cabello: la partición cambia según EU_CORTES.reglaDe */
        var ci = v % cortes.length, c = CO.get(cortes[ci]), otros = CABS.filter(function (x) { return c.mejor.indexOf(x) < 0; }).concat(c.mejor.slice(1));
        var cab = otros[Math.floor(v / cortes.length) % Math.max(1, otros.length)]; v++;
        if (cab) pages[i] = { tipo: 'pe_corte', u: p.u, n: p.n, num: p.num, corte: c.id, cab: cab };
      });
    });
    /* resto de unidades: los diagramas genéricos se cambian por modelos de la unidad que no han salido
       y por las láminas de peluquería del cerebro SVG (colorimetría, dilución, pH, cabello) */
    Object.keys(porU).forEach(function (uid) {
      if (uid === 'pe_u_base' || uid.indexOf('pe_u_c_') === 0) return;
      var idx = porU[uid].filter(function (i) { return pages[i].tipo === 'pro_diagrama'; }); if (!idx.length) return;
      var u = pages[idx[0]].u, libres = (u.mods || []).filter(function (id) { return !usados[id] && window.EU_MODELOS.modelo(id); });
      idx.forEach(function (i, q) {
        var p = pages[i];
        if (libres.length) { var id = libres.shift(); usados[id] = 1; pages[i] = { tipo: 'pe_corte', u: u, n: p.n, num: p.num, mod: id }; return; }
        for (var z = 0; z < PEL.length; z++) {
          var ty = PEL[z]; if (usados[ty]) continue;
          if (ty === 'pel_ph' && !/alisado|queratina|permanente|botox|derriz|decolor|ph/i.test(u.t)) continue;
          if (/pel_color|pel_dilucion/.test(ty) && !/color|ra[ií]z|mecha|balayage|babyl|sombr|decolor/i.test(u.t)) continue;
          var sem = H.hash(uid + ty) + (C.semilla || 0), V = window.EU_SVG && window.EU_SVG.generar(ty, u, C, H.rng(sem));
          if (V && V.items) { usados[ty] = 1; pages[i] = { tipo: 'vis', u: u, n: p.n, num: p.num, v: V, items: V.items, gen: ty, sem: sem }; return; }
        }
      });
    });
    /* lo que aún quede genérico: modelos de Peluquería que no han salido en el libro, por parecido con la unidad */
    var EST = {}; (M.est || []).forEach(function (id) { EST[id] = 1; });
    var sobran = window.EU_MODELOS.lista('pelu').filter(function (m) { return !usados[m.id] && !EST[m.id] && !/^pe_(ft|fx|elev|g3d)_/.test(m.id); });
    function pal(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').match(/[a-zñ]{4,}/g) || []; }
    pages.forEach(function (p, i) {
      if (p.tipo !== 'pro_diagrama' || !p.u || p.u.m !== 'pelu' || !sobran.length) return;
      var w = pal(p.u.t + ' ' + (p.u.k || []).join(' ')), best = 0, bp = -1;
      sobran.forEach(function (m, j) { var x = pal(m.n + ' ' + m.intro), s = 0; w.forEach(function (y) { if (x.indexOf(y) >= 0) s++; }); if (s > bp) { bp = s; best = j; } });
      var m = sobran.splice(best, 1)[0]; usados[m.id] = 1;
      pages[i] = { tipo: 'pe_corte', u: p.u, n: p.n, num: p.num, mod: m.id };
    });
    /* portadillas: un dibujo que no salga en ninguna otra página */
    pages.forEach(function (p) {
      if (p.tipo !== 'pro_capitulo' && p.tipo !== 'apertura' || !p.u || p.u.m !== 'pelu') return;
      var w = pal(p.u.t + ' ' + (p.u.k || []).join(' ')), best = -1, bp = 0;
      sobran.forEach(function (m, j) { var x = pal(m.n + ' ' + m.intro), s = 0; w.forEach(function (y) { if (x.indexOf(y) >= 0) s++; }); if (s > bp) { bp = s; best = j; } });
      if (best >= 0) { p.portMod = sobran.splice(best, 1)[0].id; return; }
      if (p.u.id.indexOf('pe_u_c_') === 0) { var c0 = CO.lista(p.u.id.slice(7))[0]; if (c0) { var otro = CABS.filter(function (x) { return c0.mejor.indexOf(x) < 0; })[0]; if (otro) { p.portMod = [c0.id, otro]; return; } } }
      if (sobran.length) p.portMod = sobran.shift().id;
    });
    return res;
  }
  /* se engancha al final de la cadena (cuando ya cargaron todas las bibliotecas), para correr el último */
  function enganchar() {
    if (ED.__peluDiag) return; ED.__peluDiag = 1;
    var ens2 = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens2.apply(this, arguments); try { diagramasCorte(r, cfg); } catch (e) { console.warn('pelu diagramas', e); } return r; };
  }
  (function esperar() { if (window.EU_LIBS_LISTAS) enganchar(); else setTimeout(esperar, 300); })();

  window.EU_PELU_ORDEN = { MODS: M, ordenar: ordenar, diagramasCorte: diagramasCorte };
})();
