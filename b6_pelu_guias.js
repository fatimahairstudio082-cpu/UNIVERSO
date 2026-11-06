/* b6_pelu_guias.js — los pasos de Guías 3D como dibujos de la biblioteca de Peluquería (familia 'g3d').
   Para cada corte de EU_CORTES toma su guía (EU_CORTES.guiaDe con el cabello que mejor le va) y registra
   un modelo por paso: pe_g3d_<corte>_<k>. La imagen la renderiza la misma cabeza 3D del Estudio
   (<guias-3d>.laminaURL), en un ejemplar oculto que no guarda nada en el dispositivo.
   Así cada corte lleva su propio diagrama paso a paso en lugar de la ficha genérica repetida.
   Cargar después de b6_pelu_limpieza.js y antes de b6_pelu_orden.js. */
(function () {
  'use strict';
  var MO = window.EU_MODELOS, CO = window.EU_CORTES;
  if (!MO || !CO || window.EU_PELU_GUIAS) return;

  /* el motor 3D solo se carga al abrir su pestaña: aquí se pide antes */
  if (!window.customElements.get('guias-3d') && !document.querySelector('script[data-eu-g3d]')) {
    var sc = document.createElement('script'); sc.src = './b6_guias_3d.js'; sc.setAttribute('data-eu-g3d', '1'); document.head.appendChild(sc);
  }
  /* el ejemplar oculto se quita en cuanto termina la tanda: montado, su bucle de dibujo ocupa la página */
  var EL = null, CACHE = {}, CARGADA = '', QUITA = 0;
  function suelta() { clearTimeout(QUITA); QUITA = setTimeout(function () { if (EL) { try { EL.remove(); } catch (e) { } } EL = null; CARGADA = ''; }, 400); }
  function motor() {
    if (EL) return EL;
    if (!window.customElements.get('guias-3d')) return null;
    EL = document.createElement('guias-3d');
    EL.setAttribute('aria-hidden', 'true');
    EL.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;pointer-events:none;opacity:0';
    document.body.appendChild(EL);
    return EL;
  }
  function render(corte, cab, k) {
    var clave = corte + '|' + (cab || '') + '|' + k; if (CACHE[clave]) return CACHE[clave];
    var e = motor(); if (!e || !e.laminaURL) return '';
    suelta();
    try {
      if (CARGADA !== corte + '|' + cab) { e.cargarGuia(CO.guiaDe(corte, cab)); CARGADA = corte + '|' + cab; }
      CACHE[clave] = e.laminaURL(k, 'image/jpeg', 0.86);
    } catch (er) { console.warn('Guías 3D', corte, k, er); return ''; }
    return CACHE[clave];
  }

  var PART = { horizontal: 'horizontal', vertical: 'vertical', diagAtras: 'diagonal hacia atrás', diagAdelante: 'diagonal hacia delante', radial: 'radial' };
  function maxElev(a) { return Array.isArray(a) && a.length ? Math.max.apply(null, a) : 0; }
  function modeloPaso(c, cab, g, p, k) {
    var n = g.pasos.length, el = maxElev(p.elevB), pt = PART[p.particionB] || p.particionB || 'horizontal', tit = String(p.titulo || '').replace(/^\s*\d+\s*·\s*/, '');
    return {
      id: 'pe_g3d_' + c.id + '_' + k, fam: 'g3d', corte: c.id, paso: k, titulo: tit, part: pt, elev: el, vigila: p.observaciones || g.aviso || '',
      n: c.n + ' · paso ' + (k + 1) + ' de ' + n + (tit ? ': ' + tit : ''),
      d: function (K) {
        var src = render(c.id, cab, k);
        if (!src) return K.r(4, 4, 192, 142, 6, '#F2EEE7') + K.t(100, 70, c.n, { s: 8, b: 1 }) + K.t(100, 84, 'Paso ' + (k + 1), { s: 7 });
        var f = K.linea ? ' filter="url(#peG3dGris)"' : '';
        return (K.linea ? '<filter id="peG3dGris"><feColorMatrix type="saturate" values="0"/></filter>' : '') + K.r(4, 4, 192, 142, 6, '#F2EEE7') +
          '<image href="' + src + '" x="4" y="21" width="192" height="108"' + f + ' preserveAspectRatio="xMidYMid meet"/>';
      },
      intro: String(p.texto || '').replace(/\s+/g, ' ').trim() || (c.n + ': paso ' + (k + 1) + '.'),
      q: [['¿Qué partición se usa en este paso?', 'Partición ' + pt + '.'],
        ['¿A qué elevación se lleva el mechón?', el ? 'Hasta ' + el + '° en la zona más alta.' : 'Sin elevación: 0°, el pelo cae natural.'],
        ['¿Qué hay que vigilar?', p.observaciones || g.aviso || 'Que cada mechón se compare con la guía antes de cortar.']],
      porque: el >= 90 ? 'Al elevar el mechón, el pelo de arriba queda más corto: se crean capas y ligereza.' :
        el > 0 ? 'Una elevación media reparte el peso y da volumen en la zona trabajada.' : 'Sin elevación todas las puntas caen a la misma línea y el peso queda en el borde.'
    };
  }

  var L = [], N = 0;
  CO.lista().forEach(function (c) {
    var full = CO.get(c.id) || c, cab = ((full.mejor || [])[0]) || (CO.cabellos()[0] || {}).id, g = null;
    try { g = CO.guiaDe(c.id, cab); } catch (e) { g = null; }
    if (!g || !g.pasos || !g.pasos.length) return;
    N++; g.pasos.forEach(function (p, k) { L.push(modeloPaso(c, cab, g, p, k)); });
  });
  MO.agregar('pelu', L, { familias: { g3d: 'Cortes paso a paso (Guías 3D)' } });

  window.EU_PELU_GUIAS = { cortes: N, pasos: L.length, render: render };
})();
