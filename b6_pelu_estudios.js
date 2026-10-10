/* b6_pelu_estudios.js — el maniquí animado de la pestaña Estudios (<estudios-belleza>) dentro del libro y del curso.
   Para cada técnica del Cerebro de las familias de pelo (color, mechas, hidratación, queratina, químicos, técnicas
   de cabello) toma la narración paso a paso (EU_CEREBRO.narracion) y dibuja un fotograma por paso con el mismo motor
   del Estudio (this.t = avance de la animación). Cada fotograma es un modelo pe_est_<técnica>_<k> (familia 'est'),
   con su frase: así el curso premium hace una lección en vídeo por técnica, sincronizada frase ↔ dibujo.
   En el libro: página `pe_tecnica` en cada unidad cb_<técnica> (sustituye relleno): fotogramas numerados con su
   explicación al lado, diagrama de divisiones y, en HTML, «▶ Ver y escuchar» (voz es-ES, el dibujo grande cambia
   con cada frase). El ejemplar oculto del Estudio se quita del DOM al terminar cada tanda.
   Cargar después de b6_pelu_libro3d.js. */
(function () {
  'use strict';
  var MO = window.EU_MODELOS, ED = window.EU_EDITORIAL, CB = window.EU_CEREBRO;
  if (!MO || !ED || !CB || window.EU_PELU_ESTUDIOS) return;
  var FAMS = ['color', 'mechas', 'hidratacion', 'queratina', 'quimicos', 'cabello'];
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  if (!window.customElements.get('estudios-belleza') && !document.querySelector('script[data-eu-est]')) {
    var sc = document.createElement('script'); sc.src = './b6_estudios.js'; sc.setAttribute('data-eu-est', '1'); document.head.appendChild(sc);
  }
  var EL = null, CACHE = {}, QUITA = 0;
  function suelta() { clearTimeout(QUITA); QUITA = setTimeout(function () { if (EL) { try { if (EL._raf) cancelAnimationFrame(EL._raf); EL.remove(); } catch (e) { } } EL = null; }, 400); }
  function motor() {
    if (EL) return EL;
    if (!window.customElements.get('estudios-belleza')) return null;
    EL = document.createElement('estudios-belleza'); EL.setAttribute('aria-hidden', 'true');
    EL.style.cssText = 'position:fixed;left:-20000px;top:0;width:1280px;pointer-events:none;opacity:0';
    document.body.appendChild(EL);
    if (EL._raf) cancelAnimationFrame(EL._raf);
    return EL;
  }
  /* vista: 'maniqui' | 'diagrama'; t de 0 a 1 */
  function render(tec, vista, t) {
    var k = tec + '|' + vista + '|' + t; if (CACHE[k]) return CACHE[k];
    var e = motor(); if (!e || !e.cv || !e.pintar) return '';
    suelta();
    try {
      var T = CB.obtener(tec); if (!T) return '';
      var f = (CB.familias().filter(function (z) { return z.id === T.fam; })[0]) || {};
      e.fam = T.fam; e.disc = f.lienzo || 'color'; e.tecId = tec; e.vista = vista; e.foto = null;
      e.sincronizar(); if (e._raf) cancelAnimationFrame(e._raf);
      e.t = t; e.pintar();
      CACHE[k] = e.cv.toDataURL('image/jpeg', 0.86);
    } catch (er) { console.warn('Estudios', tec, er); return ''; }
    return CACHE[k];
  }
  function tieneDiag(tec) { return !!(window.EU_DIVISIONES && EU_DIVISIONES.tiene && EU_DIVISIONES.tiene(tec)); }

  /* ─── modelos: un fotograma por frase ─── */
  var TEC = {}, L = [];
  FAMS.forEach(function (fa) {
    (CB.listar(fa) || []).forEach(function (t) {
      var narr = (CB.narracion(t.id) || []).map(function (s) { return String(s).trim(); }).filter(Boolean); if (!narr.length) return;
      TEC[t.id] = { id: t.id, n: t.n, fam: fa, resumen: t.resumen || '', narr: narr };
      narr.forEach(function (fr, k) {
        var tt = +((k + 1) / narr.length).toFixed(3);
        L.push({
          id: 'pe_est_' + t.id + '_' + k, fam: 'est', grupo: t.id, grupoN: t.n, grupoD: t.resumen || '', paso: k, narr: fr,
          n: t.n + ' · paso ' + (k + 1) + ' de ' + narr.length,
          raster: function () { return render(t.id, 'maniqui', tt); },
          d: function (K) {
            var src = render(t.id, 'maniqui', tt);
            if (!src) return K.r(4, 4, 192, 142, 6, '#1A1A2E') + K.t(100, 75, t.n, { s: 8, b: 1, c: '#fff' });
            var fl = K.linea ? ' filter="url(#peEstGris)"' : '';
            return (K.linea ? '<filter id="peEstGris"><feColorMatrix type="saturate" values="0"/></filter>' : '') + '<image href="' + src + '" x="4" y="21" width="192" height="108"' + fl + ' preserveAspectRatio="xMidYMid meet"/>';
          },
          intro: fr,
          q: [['¿Qué se hace en este paso?', fr], ['¿En qué técnica estamos?', t.n + '.'], ['¿Qué paso viene después?', narr[k + 1] || 'Se termina y se revisa el resultado.']],
          porque: t.resumen || ''
        });
      });
    });
  });
  MO.agregar('pelu', L, { familias: { est: 'Técnicas animadas (Estudios)' } });

  /* ─── página del libro ─── */
  var SCRIPT = '<script>(function(){if(window.__estLibro)return;window.__estLibro=1;var act=null;' +
    'function voz(){if(!window.speechSynthesis)return null;var v=speechSynthesis.getVoices().filter(function(x){return/^es/i.test(x.lang)});return v.filter(function(x){return/google/i.test(x.name)&&/es-ES/i.test(x.lang)})[0]||v.filter(function(x){return/es-ES/i.test(x.lang)})[0]||v[0]||null}' +
    'function para(){if(window.speechSynthesis)speechSynthesis.cancel();if(act){act.b.textContent="▶ Ver y escuchar";act.box.querySelectorAll("[data-est-k]").forEach(function(c){c.style.opacity="1";c.style.outline="none"})}act=null}' +
    'document.addEventListener("click",function(ev){var b=ev.target.closest("[data-est-play]");if(!b)return;var box=b.closest("[data-est]");if(act&&act.box===box)return para();para();' +
    'var V=voz(),fr=[].slice.call(box.querySelectorAll("[data-est-k]")),big=box.querySelector("[data-est-big]"),sub=box.querySelector("[data-est-sub]"),j=0;act={box:box,b:b};b.textContent="❚❚ Parar";' +
    '(function sig(){if(!act||act.box!==box)return;if(j>=fr.length){para();return}var c=fr[j++],im=c.querySelector("img"),t=c.dataset.estT;' +
    'fr.forEach(function(x){x.style.opacity=x===c?"1":".4";x.style.outline=x===c?"0.7mm solid "+box.dataset.acc:"none"});if(im&&big){big.style.opacity="0";setTimeout(function(){big.src=im.src;big.style.opacity="1"},180)}if(sub)sub.textContent=t;' +
    'if(!V){setTimeout(sig,Math.max(2000,t.length*70));return}var u=new SpeechSynthesisUtterance(t);u.voice=V;u.lang="es-ES";u.onend=u.onerror=function(){setTimeout(sig,250)};speechSynthesis.speak(u)})()})})();<\/script>';

  function pagina(pg, C, modo) {
    var H = ED.H, T = C.T, t = TEC[pg.tec]; if (!t) return H.cabecera(C, pg) + H.folio(C, pg);
    var web = modo === 'web', print = !web, rad = Math.min(T.r || 4, 6), n = t.narr.length, max = Math.min(n, 6);
    var sel = []; for (var i = 0; i < max; i++) sel.push(Math.round(i * (n - 1) / Math.max(1, max - 1)));
    /* Fátima, 10-10-2026: los fotogramas de Estudios salían casi iguales. Cada paso lleva, si la hay, una escena
       distinta de la técnica animada (con cabello y resultado) que no esté ya en su página «pe_animada»; si faltan, el de Estudios. */
    var LA = window.EU_PELU_LIBRO_ANIM, da = LA && LA.datos && LA.foto ? LA.datos('cb_' + t.id) : null, libres = [], aJ = {};
    if (da) da.E.escenas.forEach(function (e, k) { if (da.sel.indexOf(k) < 0 && !(LA.NO_IMPRESO || /^cb_receta$|_preparacion$|_cierre$/).test(e.tipo || '')) libres.push(k); });
    var nL = Math.min(libres.length, sel.length);
    for (var q = 0; q < nL; q++) aJ[Math.round(q * (sel.length - 1) / Math.max(1, nL - 1))] = libres[Math.round(q * (libres.length - 1) / Math.max(1, nL - 1))];
    var cuad = sel.map(function (k, j) {
      var an = aJ[j] != null ? LA.foto('cb_' + t.id, aJ[j], 480) : '';
      var src = an || render(t.id, 'maniqui', +((k + 1) / n).toFixed(3));
      return '<div data-est-k="' + j + '" data-est-t="' + es(t.narr[k]) + '" style="display:grid;grid-template-columns:30mm minmax(0,1fr);gap:2.5mm;align-items:center;border-radius:' + rad + 'px;padding:1mm;transition:opacity .3s">' +
        (an ? '<div style="aspect-ratio:4/3;overflow:hidden;border-radius:' + rad + 'px;position:relative;background:#E6EAF1"><img src="' + an + '" alt="Paso ' + (k + 1) + '" style="position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover;display:block"></div>' :
        src ? '<div style="aspect-ratio:4/3;overflow:hidden;border-radius:' + rad + 'px;position:relative;background:#F2EAD9"><img src="' + src + '" alt="Paso ' + (k + 1) + '" style="position:absolute;width:250%;max-width:none;left:-82%;top:-38%;display:block"></div>' : '<div></div>') +
        '<div style="font-size:.78em;line-height:1.35"><b style="display:inline-flex;width:5mm;height:5mm;border-radius:50%;background:' + T.acc + ';color:#fff;align-items:center;justify-content:center;font-size:.85em;margin-right:1.5mm">' + (k + 1) + '</b>' + es(t.narr[k]) + '</div></div>';
    }).join('');
    var dg = tieneDiag(t.id) ? render(t.id, 'diagrama', 1) : '', big0 = render(t.id, 'maniqui', 1);
    var ctrl = web ? '<div style="display:flex;gap:3mm;align-items:center;margin:0 0 2.5mm"><button data-est-play="1" style="font:inherit;font-size:.86em;padding:1.5mm 4mm;border:0;border-radius:' + rad + 'px;background:' + T.acc + ';color:#fff;cursor:pointer;white-space:nowrap;flex:none">▶ Ver y escuchar</button><span data-est-sub="1" style="font-size:.8em;font-style:italic;opacity:.85;min-width:0"></span></div>'
      : '<div style="font-size:.76em;opacity:.8;margin:0 0 2.5mm">Animación con voz de esta técnica en el curso premium: lección «' + es(t.n) + '».</div>';
    return H.cabecera(C, pg) + '<div data-est="1" data-acc="' + es(T.acc) + '">' +
      '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">Técnica paso a paso · ' + n + ' pasos</div>' + H.h1(C, es(t.n)) +
      (t.resumen ? '<p style="margin:0 0 2.5mm;max-width:160mm;font-size:.9em">' + es(t.resumen) + '</p>' : '') + ctrl +
      (big0 ? '<img data-est-big="1" src="' + big0 + '" alt="' + es(t.n) + '" style="width:100%;max-height:72mm;object-fit:contain;display:block;border-radius:' + rad + 'px;margin:0 0 3mm;transition:opacity .18s">' : '') +
      '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.5mm 3mm">' + cuad + '</div>' +
      (dg ? '<div style="margin-top:3mm"><div style="font-size:.74em;font-weight:700;color:' + T.acc + ';margin:0 0 1mm">Divisiones de la técnica</div><img src="' + dg + '" alt="Divisiones" style="width:100%;max-height:50mm;object-fit:contain;object-position:50% 50%;display:block;border-radius:' + rad + 'px"></div>' : '') +
      '</div>' + (web ? SCRIPT : '') + H.folio(C, pg);
  }
  ED.registrar({ paginas: { pe_tecnica: pagina }, voz: { pe_tecnica: function (pg) { var t = TEC[pg.tec]; return t ? t.n + '. ' + t.narr.join(' ') : ''; } } });

  /* ─── en el libro: una página por técnica y sin láminas repetidas ─── */
  var RELLENO = ['vis', 'lec_amplia', 'lec_lectura', 'lec_caso', 'lec_concepto', 'pe_corte', 'pro_diagrama', 'lec_proyecto'];
  function convertir(res, cfg) {
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu') return res;
    var porU = {}, vistas = {};
    res.pages.forEach(function (p, i) { if (p.u && /^cb_/.test(p.u.id)) (porU[p.u.id] = porU[p.u.id] || []).push(i); });
    Object.keys(porU).forEach(function (uid) {
      var tec = uid.slice(3), t = TEC[tec], u = res.pages[porU[uid][0]].u; if (!t) return;
      /* el curso premium hace la lección en vídeo con estos fotogramas */
      u.mods = (u.mods || []).filter(function (id) { return !/^pe_est_/.test(id); }).concat(t.narr.map(function (x, k) { return 'pe_est_' + tec + '_' + k; }));
      var cand = porU[uid].map(function (i) { return [RELLENO.indexOf(res.pages[i].tipo), i]; }).filter(function (x) { return x[0] >= 0; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      if (!cand.length) return; var i = cand[0][1], p = res.pages[i];
      res.pages[i] = { tipo: 'pe_tecnica', u: u, n: p.n, num: p.num, tec: tec };
    });
    /* láminas repetidas: la misma figura (mismo modelo o mismo generador) solo sale una vez en el libro */
    res.pages.forEach(function (p, i) {
      var k = p.tipo === 'pe_corte' && p.mod ? 'm:' + p.mod : p.tipo === 'vis' && p.gen ? 'g:' + p.gen : '';
      if (!k) return; if (!vistas[k]) { vistas[k] = 1; return; }
      res.pages[i] = { tipo: 'lec_amplia', u: p.u, n: p.n, num: p.num };
    });
    /* las páginas de guía y de técnica ya van llenas: el relleno automático no les añade otra lámina */
    res.pages.forEach(function (p) { if (p.tipo === 'pe_guia3d' || p.tipo === 'pe_tecnica') p.fill2 = p.fill2 || { nada: 1 }; });
    return res;
  }
  function enganchar() {
    if (ED.__peluEst) return; ED.__peluEst = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { convertir(r, cfg); } catch (e) { console.warn('pelu estudios', e); } return r; };
  }
  (function esperar() { if (ED.__peluG3dLibro) enganchar(); else setTimeout(esperar, 300); })();

  window.EU_PELU_ESTUDIOS = { TEC: TEC, render: render, pagina: pagina, convertir: convertir, total: L.length };
})();
