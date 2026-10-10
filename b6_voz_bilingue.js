/* b6_voz_bilingue.js — voz bilingüe español / inglés (window.EU_VOZ_BILINGUE), Fátima 10-10-2026:
   «en Inglés el audio solo lee las palabras en español». La voz era siempre es-ES, así que lo escrito en inglés
   se leía con pronunciación española. Ahora cada frase se parte en trozos (por «:», comillas, flechas, comas…)
   y cada trozo se dice con su voz: el español con «Google español · es-ES» (como siempre) y el inglés con una voz
   inglesa (Google UK English, en-GB; si no hay, en-US o la que tenga el aparato).
   · El motor (`BIL`) se copia en el HTML descargado (libro web) y en el curso premium (vía D.bil); lo usan
     «▶ Ver y escuchar» / «▶ Escuchar el libro» (b6_voz_libro.js), la ✍️ Pizarra (b6_pizarra.js) y el curso.
   · La lista de palabras inglesas sale del propio libro: diccionario del sistema (EU_IDIOMAS), unidades de Inglés,
     banco bilingüe (b6_texto_ingles.js) y palabras gramaticales; se quitan las que también son españolas.
   · Solo en Inglés e Idiomas (`cfg.acab.vozBilingue = 'no'` lo apaga). Sin voz inglesa en el aparato, se lee todo
     como antes. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_VOZ_BILINGUE) return;
  var MATS = /^(ingles|idiomas)$/;
  var FUNC = ('the a an and or but if then than that this these those there here is are was were be been being am do does did done have has had having ' +
    'will would can could shall should may might must not no yes i you he she it we they me him her us them my your his its our their mine yours ours theirs ' +
    'what where when who whom whose which why how at in on to of for with from by about into onto over under before after up down out off ' +
    'again very too so also just only always usually often sometimes never every each all some any many much more most less few little one two three four five ' +
    'six seven eight nine ten first second last next new old good bad big small long short tall high low right left straight go goes went gone going ' +
    'get gets got getting make made take took come came see saw look like love want need know think say said tell ask give use used work play read write ' +
    'speak listen walk run eat drink sleep wake have breakfast lunch dinner school home house family mother father brother sister friend day week year ' +
    'today tomorrow yesterday now later morning afternoon evening night please thank thanks sorry hello goodbye excuse could would let let’s ' +
    'i’m i\'m it’s it\'s don’t don\'t doesn’t doesn\'t didn’t didn\'t isn’t isn\'t aren’t aren\'t can’t can\'t won’t won\'t i’ve i\'ve you’re you\'re we’re we\'re ' +
    'they’re they\'re she’s she\'s he’s he\'s what’s what\'s there’s there\'s english spanish word words sentence verb verbs answer question translate ' +
    'present past future simple continuous perfect habit habits facts happening plans plan predictions prediction moment example examples linkers reasons');
  var ES = ('a ante bajo con contra de desde en entre hacia hasta para por según sin sobre tras el la lo los las un una unos unas y e o u ni que como cuando ' +
    'donde quien cual cuál qué quién cómo cuándo dónde porque pero si sí no me te se le les nos os mi tu su sus mis tus yo él ella ellos ellas nosotros ' +
    'usted ustedes es son era eran fue ser estar está están esta este esto estos estas ese esa eso esos esas aquí allí hay tiene tienen tengo hace hacer ' +
    'muy más menos también ya bien mal todo toda todos todas cada otro otra otros otras mismo misma del al uno dos tres cuatro cinco seis siete ocho nueve ' +
    'diez once doce veinte cien mil primero segunda dice dicen decimos escribe escribir traduce traducir completa elige ordena lee leer escucha repite ' +
    'pregunta respuesta palabra palabras frase frases verbo inglés español unidad ejemplo significa sirve usa usamos usar pasado presente futuro ' +
    'sofá come dice sin son me no embargo además gusta gustan').split(/\s+/);

  /* motor que viaja al HTML: BIL(window, lista de palabras inglesas) */
  function BIL(W, LISTA, ESL) {
    if (W.EU_BIL) return;
    var S = W.speechSynthesis, EN = {}, ESP = {}, gen = 0;
    ESL.split(' ').forEach(function (w) { if (w) ESP[w] = 1; });
    LISTA.split(' ').forEach(function (w) { if (w && !ESP[w]) EN[w] = 1; });
    function norm(w) { return w.toLowerCase().replace(/’/g, "'"); }
    function idioma(t) {
      var ws = (String(t).match(/[A-Za-zÀ-ÿñÑ’']+/g) || []).map(norm); if (!ws.length) return null;
      var en = 0, es = 0;
      ws.forEach(function (w) { var b = w.replace(/'s$/, ''); if (ESP[w] || /[ñáéíóúü¿¡]/.test(w)) es++; else if (EN[w] || EN[b]) en++; });
      if (/[¿¡ñáéíóú]/i.test(t) && en < 2 * es + 1) return 'es';
      return en && en >= es && en / ws.length >= 0.5 ? 'en' : 'es';
    }
    function trozos(f) {
      var partes = String(f).split(/(\s*(?:[:;«»"“”()\[\]—–→=]|\s-\s|,|[.!?…](?=\s))\s*)/), out = [];
      partes.forEach(function (p, i) {
        if (!p) return;
        if (i % 2) { if (out.length) out[out.length - 1][0] += p; return; }
        var l = idioma(p);
        if (l == null) { if (out.length) out[out.length - 1][0] += p; else out.push([p, 'es']); return; }
        if (out.length && out[out.length - 1][1] === l) out[out.length - 1][0] += p; else out.push([p, l]);
      });
      return out.filter(function (x) { return /[A-Za-zÀ-ÿ0-9]/.test(x[0]); });
    }
    var cache = {};
    function voz(l) {
      if (!S) return null; var vs = S.getVoices(); if (cache[l] && vs.indexOf(cache[l]) >= 0) return cache[l];
      var v = null;
      if (l === 'en') { var en = vs.filter(function (x) { return /^en/i.test(x.lang); }); v = en.filter(function (x) { return /google/i.test(x.name) && /en[-_]GB/i.test(x.lang); })[0] || en.filter(function (x) { return /en[-_]GB/i.test(x.lang); })[0] || en.filter(function (x) { return /google/i.test(x.name); })[0] || en.filter(function (x) { return /en[-_]US/i.test(x.lang); })[0] || en[0] || null; }
      else { var es = vs.filter(function (x) { return /^es/i.test(x.lang); }); v = es.filter(function (x) { return /google/i.test(x.name) && /es[-_]ES/i.test(x.lang); })[0] || es.filter(function (x) { return /es[-_]ES/i.test(x.lang); })[0] || es[0] || null; }
      cache[l] = v; return v;
    }
    function hay(f) { return !!voz('en') && trozos(f).some(function (x) { return x[1] === 'en'; }); }
    function decir(f, o, fin) {
      o = o || {}; var T = trozos(f), g = ++gen, i = 0;
      (function sig() {
        if (g !== gen) return; if (i >= T.length) { if (fin) fin(); return; }
        var t = T[i++], u = new SpeechSynthesisUtterance(t[0].trim()), en = t[1] === 'en', v = en ? voz('en') : (o.es || voz('es'));
        u.lang = en ? ((v && v.lang) || 'en-GB') : 'es-ES'; if (v) u.voice = v; u.rate = (o.rate || 1) * (en ? 0.92 : 1); u.pitch = en ? 1 : (o.pitch || 1);
        u.onend = function () { setTimeout(sig, 120); };
        u.onerror = function (ev) { if (ev && /interrupted|canceled/.test(ev.error || '')) return; setTimeout(sig, 60); };
        S.speak(u);
      })();
    }
    function parar() { gen++; try { S && S.cancel(); } catch (e) { } }
    /* decir todo el texto en un idioma fijo (botones 🔊 EN / 🔊 ES) */
    function di(t, l, fin) {
      parar(); var g = gen, v = voz(l === 'en' ? 'en' : 'es'), u = new SpeechSynthesisUtterance(String(t));
      u.lang = l === 'en' ? ((v && v.lang) || 'en-GB') : 'es-ES'; if (v) u.voice = v; u.rate = l === 'en' ? 0.85 : 0.95;
      u.onend = u.onerror = function () { if (g === gen && fin) fin(); }; S.speak(u);
    }
    if (S && S.onvoiceschanged !== undefined && !S.onvoiceschanged) S.onvoiceschanged = function () { cache = {}; };
    W.EU_BIL = { activo: true, trozos: trozos, idioma: idioma, voz: voz, hay: hay, decir: decir, parar: parar, di: di };
  }

  function palabrasDe(texto, into) { (String(texto || '').match(/[A-Za-zÀ-ÿñÑ’']+/g) || []).forEach(function (w) { into[w.toLowerCase().replace(/’/g, "'")] = 1; }); }
  function lista(C) {
    var o = {};
    FUNC.split(/\s+/).forEach(function (w) { if (w) o[w.replace(/’/g, "'")] = 1; });
    try { (window.EU_IDIOMAS && EU_IDIOMAS.TEMAS || []).forEach(function (T) { (T.w || []).forEach(function (s) { palabrasDe(String(s).split('|')[1], o); }); (T.t && palabrasDe(T.t[1], o)); }); } catch (e) { }
    try { var B = window.EU_TEXTO_INGLES || {}; Object.keys(B).forEach(function (k) { (B[k].v || []).forEach(function (v) { palabrasDe(v[0], o); }); }); } catch (e) { }
    try { (window.EU_CURRICULO && EU_CURRICULO.UNIDADES || []).forEach(function (u) { if (u.m !== 'ingles' && u.mat !== 'ingles' && !/^ing_/.test(u.id || '')) return; palabrasDe(u.t, o); (u.i || []).forEach(function (s) { palabrasDe(s, o); }); (u.k || []).forEach(function (s) { palabrasDe(s, o); }); (u.par || []).forEach(function (p) { palabrasDe(p[0], o); }); }); } catch (e) { }
    return Object.keys(o).filter(function (w) { return w.length > 0 && !/[áéíóúñü]/.test(w); }).join(' ');
  }
  function activo(C) { return C && MATS.test(C.mat || '') && ((C.cfg && C.cfg.acab) || {}).vozBilingue !== 'no'; }
  function fuente(C) { return '(' + BIL.toString() + ')(window,' + JSON.stringify(lista(C)) + ',' + JSON.stringify(ES.join(' ')) + ');'; }

  /* libro web: el motor va una vez en el documento */
  var doc = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc.apply(this, arguments);
    try {
      if (modo === 'web' && res && res.C && activo(res.C)) { var k = h.lastIndexOf('</body>'); if (k > 0) h = h.slice(0, k) + '<script>' + fuente(res.C).replace(/<\/script/gi, '<\\/script') + '<\/script>' + h.slice(k); }
    } catch (e) { console.warn('Voz bilingüe', e); }
    return h;
  };
  window.EU_VOZ_BILINGUE = { activo: activo, fuente: fuente, lista: lista, motor: BIL };
})();
