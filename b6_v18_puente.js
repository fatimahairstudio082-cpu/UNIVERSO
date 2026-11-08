/* b6_v18_puente.js — puente entre el maniquí V18 y los motores de Guías 3D (window.EU_V18_PUENTE).
   Se carga solo en «Fátima Studio V18 · Labios que hablan..html». Va dentro de «CONECTAR UN CEREBRO».
   Reutiliza los motores que ya existen, sin copiarlos y sin traer el maniquí de Guías 3D:
     EU_CORTES (catálogo de cortes) · EU_DIAGRAMA.receta (pila de elevaciones Z0–Z6, línea, partición, cabello).
   Dibuja sobre el cabello real del V18 con su propio motor de corte (CorteMotor) y pone el reloj de elevación AL LADO
   del maniquí, nunca encima. No inventa grados: todos salen de la receta del corte. */
(function () {
  'use strict';
  var MOTORES = ['b6_cerebro.js', 'b6_divisiones.js', 'b6_cortes.js', 'b6_pelu_geometria.js', 'b6_pelu_calculo.js', 'b6_pelu_diagrama.js'];
  var LINEA = { recta: 'recto', redondeada: 'redondo', u: 'u', v: 'v' };           /* línea de atrás del motor → contorno del V18 */
  var LARGO = { hombro: 0.26 };                                                      /* solo lo que el corte dice y el V18 ya nombra («Hombros») */
  var SECC = ['Nuca central', 'Posterior izquierdo', 'Posterior derecho', 'Lateral izquierdo', 'Lateral derecho'];
  var R = null, activo = false;

  function cargar() {
    if (window.EU_DIAGRAMA && window.EU_CORTES) return Promise.resolve();
    return MOTORES.reduce(function (p, f) {
      return p.then(function () {
        return new Promise(function (ok) {
          var s = document.createElement('script'); s.src = './' + f; s.onload = ok; s.onerror = ok; document.head.appendChild(s);
        });
      });
    }, Promise.resolve()).then(function () { if (!(window.EU_DIAGRAMA && window.EU_CORTES)) throw new Error('motores no disponibles'); });
  }
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function media(a) { var n = a.filter(function (v) { return v != null; }); return n.length ? n.reduce(function (s, v) { return s + v; }, 0) / n.length : 0; }

  /* elevación real de cada sección del V18: atrás (nuca y posteriores) = pila de atrás; laterales = pila del frente */
  function elevaciones(r) {
    var a = media(r.capas.pila), f = media(r.frente && r.frente.pila ? r.frente.pila : r.capas.pila);
    return [a, a, a, f, f];
  }
  function vertical(r) {
    var cero = r.capas.pila.every(function (v) { return !v; }) && (!r.frente || r.frente.pila.every(function (v) { return !v; }));
    return !r.liso && r.capas.part !== 'oblicua' && !(cero && r.linea === 'recta');
  }

  function ficha(r) {
    var pa = r.capas.pila, pf = r.frente && r.frente.pila ? r.frente.pila : pa;
    return '<b>' + esc(r.n) + '</b><br>' +
      'Cabello: ' + esc(r.liso ? 'liso extremo' : r.cab) + ' · corte ' + (vertical(r) ? '<b>en vertical</b>' : '<b>en horizontal</b>') + '<br>' +
      'Línea de atrás: ' + esc(r.linea) + ' · partición: ' + esc(r.capas.part) + '<br>' +
      'Atrás Z0→Z6: <b>' + pa.map(function (v) { return v + '°'; }).join(' · ') + '</b><br>' +
      'Frente Z0→Z6: <b>' + pf.map(function (v) { return v + '°'; }).join(' · ') + '</b>';
  }

  function aplicar() {
    var id = $('eg3dCorte').value; R = window.EU_DIAGRAMA.receta(id);
    $('eg3dFicha').innerHTML = ficha(R);
    var perfil = $('cutProfile'); perfil.value = LINEA[R.linea] || 'recto'; perfil.dispatchEvent(new Event('change'));
    if (LARGO[R.largo] != null) { var t = $('cutTarget'); t.value = LARGO[R.largo]; t.dispatchEvent(new Event('input')); }
    var e = elevaciones(R);
    window.CorteMotor.setElev(e.map(function (g) { return Math.min(2, g / 90); }));      /* 1 = elevación de 90° en el V18 */
    window.EU_V18_PUENTE.elev = e;
    $('eg3dNota').textContent = 'Aplicado: contorno «' + $('cutProfile').selectedOptions[0].text + '» y elevaciones reales por sección. ' +
      'Esta primera fase eleva cada sección a la media de su pila; la capa por capa (Z0–Z6) sigue.';
    activo = true; reloj();
  }

  /* reloj de elevación: junto al maniquí, no encima */
  function relojHTML() {
    var d = $('eg3dReloj'); if (d) return d;
    d = document.createElement('div'); d.id = 'eg3dReloj'; d.setAttribute('aria-live', 'polite');
    d.style.cssText = 'position:absolute;right:16px;top:16px;z-index:3;width:150px;padding:10px 10px 8px;background:rgba(15,11,9,.82);border:1px solid #3a2e24;border-radius:3px;text-align:center;display:none;pointer-events:none';
    d.innerHTML = '<svg viewBox="0 0 100 80" width="130" height="104" aria-hidden="true"><path d="M17 66 A38 38 0 1 1 83 66" fill="none" stroke="#3a2e24" stroke-width="6" stroke-linecap="round"/>' +
      '<path id="eg3dArco" d="M17 66 A38 38 0 1 1 83 66" fill="none" stroke="#c9a36a" stroke-width="6" stroke-linecap="round" pathLength="225" stroke-dasharray="0 225"/>' +
      '<line id="eg3dAguja" x1="50" y1="46" x2="50" y2="14" stroke="#f3ebe1" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="46" r="3" fill="#f3ebe1"/>' +
      '<text x="50" y="76" text-anchor="middle" fill="#b9ab9b" font-size="6">0°  ·  225°</text></svg>' +
      '<div id="eg3dGrados" style="font:500 26px/1 \'Cormorant Garamond\',Georgia,serif;color:#c9a36a">0°</div>' +
      '<div id="eg3dSec" style="font-size:11px;color:#b9ab9b;margin-top:2px;letter-spacing:.04em"></div>';
    $('stage').appendChild(d); return d;
  }
  function reloj() {
    var d = relojHTML();
    (function tic() {
      if (!activo) { d.style.display = 'none'; return; }
      var s = window.CorteMotor.state(), g = 0;
      if (s.active >= 0 && window.EU_V18_PUENTE.elev) g = Math.round(window.EU_V18_PUENTE.elev[s.active] * (s.lift > 0 ? 1 : 0));
      d.style.display = s.active >= 0 ? 'block' : 'none';
      if (s.active >= 0) {
        $('eg3dGrados').textContent = g + '°'; $('eg3dSec').textContent = SECC[s.active] || '';
        $('eg3dArco').setAttribute('stroke-dasharray', Math.min(225, g) + ' 225');
        $('eg3dAguja').setAttribute('transform', 'rotate(' + (-135 + Math.min(225, g) * 1.2) + ' 50 46)');
      }
      requestAnimationFrame(tic);
    })();
  }

  function montar() {
    var cab = document.querySelector('details > summary'); if (!cab) return;
    var det = cab.parentNode, caja = document.createElement('div'); caja.id = 'eg3d'; caja.style.cssText = 'margin:10px 0 4px';
    caja.innerHTML = '<div style="font-size:11px;letter-spacing:.3em;color:#c9a36a;margin-bottom:8px">MOTORES DE GUÍAS 3D · CORTES</div>' +
      '<p class="note" style="margin:0 0 8px">Usa los motores de Guías 3D (elevaciones, líneas, particiones) sobre este maniquí. Cargando…</p>';
    cab.insertAdjacentElement('afterend', caja); det.open = true;
    cargar().then(function () {
      var L = window.EU_CORTES.lista(), fam = {}, ord = [];
      L.forEach(function (c) { if (!fam[c.fam]) { fam[c.fam] = []; ord.push(c.fam); } fam[c.fam].push(c); });
      var nom = {}; try { (window.EU_CORTES.familias() || []).forEach(function (f) { nom[f.id || f[0]] = f.n || f.nombre || f[1]; }); } catch (e) { }
      caja.innerHTML = '<div style="font-size:11px;letter-spacing:.3em;color:#c9a36a;margin-bottom:8px">MOTORES DE GUÍAS 3D · CORTES</div>' +
        '<label for="eg3dCorte">Corte del motor (' + L.length + ')</label><select id="eg3dCorte">' +
        ord.map(function (f) { return '<optgroup label="' + esc(nom[f] || f) + '">' + fam[f].map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.n) + '</option>'; }).join('') + '</optgroup>'; }).join('') + '</select>' +
        '<div id="eg3dFicha" class="note" style="margin:10px 0;line-height:1.55"></div>' +
        '<div class="grid"><button id="eg3dAplicar" class="primary wide">Aplicar el corte al maniquí</button>' +
        '<button id="eg3dPlay" class="wide">▶ Cortar con el motor</button></div>' +
        '<p id="eg3dNota" class="note" role="status" style="margin-top:8px"></p>';
      $('eg3dCorte').addEventListener('change', aplicar);
      $('eg3dAplicar').addEventListener('click', aplicar);
      $('eg3dPlay').addEventListener('click', function () { aplicar(); window.CorteMotor.reset(); window.CorteMotor.play(); });
      aplicar(); window.CorteMotor.reset();
    }).catch(function () { caja.querySelector('p').textContent = 'No se pudieron cargar los motores de Guías 3D.'; });
  }
  window.EU_V18_PUENTE = { montar: montar, aplicar: aplicar, elev: null };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
