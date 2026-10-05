/* b6_pelu_libro3d.js — la guía 3D de cada corte dentro del libro de Peluquería (página `pe_guia3d`).
   Sustituye la página de corte (pe_corte con `corte` y sin `cab`) por una doble ficha:
   · Esquema de elevación numerado ①–⑦ (Z0 nuca → Z6 flequillo) sobre la cabeza de perfil; los mismos números
     encabezan la explicación, así dibujo y texto se leen juntos.
   · Los 4 pasos con su imagen de Guías 3D (EU_PELU_GUIAS.render), partición, elevación, herramienta y resultado.
   · Ficha técnica ampliada del corte (EU_CORTES.tecnica: tipo, dirección, herramienta, acabado, notas, cabello ideal).
   · En el libro HTML: «▶ Ver y escuchar» narra con la voz «Google español» (es-ES) frase a frase, resalta el paso
     que se explica y pone en el esquema los grados de ESE paso; al final, test de 3 preguntas autocorregible.
   · En el libro impreso: los grados del corte terminado y la referencia de la lección del curso premium.
   Cargar después de b6_pelu_orden.js y b6_pelu_guias.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_PELU_LIBRO3D) return;
  var ZN = ['Nuca', 'Nuca alta', 'Occipital', 'Parietal', 'Lateral', 'Coronilla', 'Flequillo'];
  var PART = { horizontal: 'horizontal', vertical: 'vertical', diagAtras: 'diagonal hacia atrás', diagAdelante: 'diagonal hacia delante', radial: 'radial', pivotante: 'pivotante' };
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function txt(s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function part(p) { return PART[p] || p || 'horizontal'; }
  function mx(a) { return Array.isArray(a) && a.length ? Math.max.apply(null, a) : 0; }

  /* cabeza de perfil mirando a la derecha; zonas de la nuca (abajo, atrás) al flequillo (arriba, delante) */
  function esquema(elev, T) {
    var cx = 100, cy = 96, R = 50, s = '<svg viewBox="0 0 200 172" style="width:100%;height:auto;display:block" role="img" aria-label="Esquema de elevación por zonas">';
    s += '<path d="M' + (cx - 24) + ' ' + (cy + 40) + ' L' + (cx - 26) + ' ' + (cy + 74) + ' L' + (cx + 22) + ' ' + (cy + 74) + ' L' + (cx + 18) + ' ' + (cy + 44) + ' Z" fill="#EBD3BF"/>' + '<path d="M' + (cx + 46) + ' ' + (cy - 4) + ' L' + (cx + 58) + ' ' + (cy + 12) + ' L' + (cx + 46) + ' ' + (cy + 16) + '" fill="#F2DFD0" stroke="#C9A98F" stroke-width="1.2"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="#F2DFD0" stroke="#C9A98F" stroke-width="1.2"/>';
    s += '<path d="M' + (cx + 4) + ' ' + (cy + 2) + ' q-7 -8 -1 -14 q8 -3 9 6 q0 9 -8 8" fill="none" stroke="#B08D74" stroke-width="1.4"/>';
    for (var i = 0; i < 7; i++) {
      var a0 = (212 - i * 27) * Math.PI / 180, a1 = (212 - (i + 1) * 27) * Math.PI / 180, am = (a0 + a1) / 2, e = elev[i] || 0;
      var p = function (a, r) { return (cx + Math.cos(a) * r).toFixed(1) + ' ' + (cy - Math.sin(a) * r).toFixed(1); };
      var op = (0.18 + Math.min(180, e) / 180 * 0.72).toFixed(2);
      s += '<path data-zf="' + i + '" d="M' + p(a0, R) + ' A' + R + ' ' + R + ' 0 0 1 ' + p(a1, R) + ' L' + p(a1, R + 9) + ' A' + (R + 9) + ' ' + (R + 9) + ' 0 0 0 ' + p(a0, R + 9) + ' Z" fill="' + T.acc + '" fill-opacity="' + op + '" stroke="#fff" stroke-width="1"/>';
      /* mecha a su elevación: 0° cae pegada a la cabeza; 90° sale perpendicular */
      var base = [cx + Math.cos(am) * (R + 9), cy - Math.sin(am) * (R + 9)], ang = am - Math.PI / 2 + Math.min(180, e) * Math.PI / 180;
      s += '<line data-zl="' + i + '" x1="' + base[0].toFixed(1) + '" y1="' + base[1].toFixed(1) + '" x2="' + (base[0] + Math.cos(ang) * 16).toFixed(1) + '" y2="' + (base[1] - Math.sin(ang) * 16).toFixed(1) + '" stroke="#5A3D2B" stroke-width="2" stroke-linecap="round"/>';
      var bx = cx + Math.cos(am) * (R - 13), by = cy - Math.sin(am) * (R - 13);
      s += '<circle cx="' + bx.toFixed(1) + '" cy="' + by.toFixed(1) + '" r="7.2" fill="#fff" stroke="' + T.acc + '" stroke-width="1.4"/><text x="' + bx.toFixed(1) + '" y="' + (by + 3).toFixed(1) + '" text-anchor="middle" font-size="8.4" font-weight="700" fill="' + T.acc + '" font-family="Georgia,serif">' + (i + 1) + '</text>';
      var lx = cx + Math.cos(am) * (R + 30), ly = cy - Math.sin(am) * (R + 30) + 3;
      s += '<text data-zt="' + i + '" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle" font-size="8" font-weight="700" fill="#2A211C" font-family="Georgia,serif">' + e + '°</text>';
    }
    return s + '</svg>';
  }

  function datos(corteId, cab0) {
    var CO = window.EU_CORTES, c = CO && CO.get(corteId); if (!c) return null;
    var cab = cab0 || (c.mejor || [])[0], g = CO.guiaDe(corteId, cab), t = CO.tecnica(corteId), rg = CO.reglaDe(cab);
    return { c: c, cab: cab, g: g, t: t, rg: rg };
  }
  function imgPaso(id, cab, k) { try { return window.EU_PELU_GUIAS ? window.EU_PELU_GUIAS.render(id, cab, k) : ''; } catch (e) { return ''; } }
  function narracion(d) {
    var c = d.c, out = [{ k: -1, t: c.n + '. ' + txt(c.d) + ' Mira el esquema: cada número es una zona de la cabeza, de la nuca al flequillo.' }];
    d.g.pasos.forEach(function (p, k) {
      var tx = k === 0 ? txt(p.texto).replace(c.n + '. ' + txt(c.d), '').trim() : txt(p.texto), e = p.elevB || [];
      var zonas = e.map(function (v, i) { return v ? 'zona ' + (i + 1) + ' a ' + v + ' grados' : ''; }).filter(Boolean).slice(0, 3).join(', ');
      out.push({ k: k, t: 'Paso ' + (k + 1) + ', ' + txt(p.titulo).replace(/^\d+\s*·\s*/, '') + '. Partición ' + part(p.particionB) + '. ' + (zonas ? 'Elevación: ' + zonas + '. ' : 'Sin elevación: cero grados. ') + tx + (p.observaciones ? ' Ojo: ' + txt(p.observaciones) : '') });
    });
    return out;
  }
  function preguntas(d) {
    var p0 = d.g.pasos[0], fin = d.g.pasos[d.g.pasos.length - 1], m = mx(fin.elevB || d.t.elev), ops = ['horizontal', 'vertical', 'diagonal hacia atrás'];
    var p0p = part(p0.particionB); if (ops.indexOf(p0p) < 0) ops[2] = p0p;
    var alt = [0, 45, 90, 135, 180].filter(function (x) { return x !== m; }).slice(0, 2).concat([m]).sort(function (a, b) { return a - b; });
    return [
      { e: '¿Qué partición se usa en el primer paso?', o: ops.map(function (x) { return 'Partición ' + x; }), c: ops.indexOf(p0p) },
      { e: '¿A qué elevación máxima se trabaja en el último paso?', o: alt.map(function (x) { return x + '°'; }), c: alt.indexOf(m) },
      { e: '¿Con qué herramienta se corta?', o: [d.t.her, d.t.her === 'Navaja' ? 'Tijera' : 'Navaja', 'Maquinilla con peine 0'].filter(function (x, i, a) { return a.indexOf(x) === i; }), c: 0 }
    ].map(function (q, i) { var g = i % q.o.length, o = q.o.slice(g).concat(q.o.slice(0, g)); return { e: q.e, o: o, c: o.indexOf(q.o[q.c]) }; });
  }

  var SCRIPT = '<script>(function(){if(window.__g3dLibro)return;window.__g3dLibro=1;var V=null,act=null;' +
    'function voz(){if(!window.speechSynthesis)return null;var v=speechSynthesis.getVoices().filter(function(x){return/^es/i.test(x.lang)});return v.filter(function(x){return/google/i.test(x.name)&&/es-ES/i.test(x.lang)})[0]||v.filter(function(x){return/es-ES/i.test(x.lang)})[0]||v[0]||null}' +
    'if(window.speechSynthesis)speechSynthesis.onvoiceschanged=function(){V=voz()};' +
    'function frases(t){return(t.match(/[^.!?]+[.!?]*/g)||[t]).map(function(s){return s.trim()}).filter(Boolean)}' +
    'function marca(pg,k,E){pg.querySelectorAll("[data-g3d-paso]").forEach(function(c){var on=+c.dataset.g3dPaso===k;c.style.outline=on?"0.8mm solid "+pg.dataset.acc:"none";c.style.opacity=k<0||on?"1":".45"});' +
    'var e=E||JSON.parse(pg.dataset.fin);e.forEach(function(v,i){var t=pg.querySelector("[data-zt=\\""+i+"\\"]");if(t)t.textContent=v+"°";var f=pg.querySelector("[data-zf=\\""+i+"\\"]");if(f)f.setAttribute("fill-opacity",(0.18+Math.min(180,v)/180*0.72).toFixed(2))})}' +
    'function para(){if(window.speechSynthesis)speechSynthesis.cancel();if(act){act.b.textContent="▶ Ver y escuchar";marca(act.pg,-1);act.pg.querySelectorAll("[data-g3d-paso]").forEach(function(c){c.style.opacity="1"})}act=null}' +
    'document.addEventListener("click",function(ev){var b=ev.target.closest("[data-g3d-play]");if(b){var pg=b.closest(".pg");if(act&&act.pg===pg)return para();para();V=V||voz();var N=JSON.parse(pg.dataset.narra),EL=JSON.parse(pg.dataset.elevs),i=0,j=0,cola=[];' +
    'N.forEach(function(n){frases(n.t).forEach(function(f){cola.push({k:n.k,t:f})})});act={pg:pg,b:b};b.textContent="❚❚ Parar";' +
    '(function sig(){if(!act||act.pg!==pg)return;if(j>=cola.length){para();return}var it=cola[j++];marca(pg,it.k,it.k>=0?EL[it.k]:null);var sb=pg.querySelector("[data-g3d-sub]");if(sb)sb.textContent=it.t;' +
    'if(!V||!window.speechSynthesis){setTimeout(sig,Math.max(1800,it.t.length*70));return}var u=new SpeechSynthesisUtterance(it.t);u.voice=V;u.lang="es-ES";u.onend=u.onerror=function(){setTimeout(sig,120)};speechSynthesis.speak(u)})();return}' +
    'var q=ev.target.closest("[data-g3d-op]");if(q){var box=q.closest("[data-g3d-q]"),ok=+q.dataset.g3dOp===+box.dataset.c;box.querySelectorAll("[data-g3d-op]").forEach(function(x){x.disabled=true;if(+x.dataset.g3dOp===+box.dataset.c){x.style.background=box.closest(".pg").dataset.acc;x.style.color="#fff"}});if(!ok){q.style.background="#F3D3D3"}}' +
    '})})();<\/script>';

  function pagina(pg, C, modo) {
    var H = ED.H, T = C.T, d = datos(pg.corte, pg.cab); if (!d) return H.cabecera(C, pg) + H.folio(C, pg);
    var web = modo === 'web', c = d.c, t = d.t, pasos = d.g.pasos, fin = (pasos[pasos.length - 1] || {}).elevB || t.elev, rad = Math.min(T.r || 4, 6);
    var cab = '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + T.acc + ';margin:0 0 1.5mm">Guía 3D del corte · ' + pasos.length + ' pasos</div>' + H.h1(C, es(c.n) + (pg.cab ? ' en cabello ' + es(String(d.rg.n).split(' ·')[0].toLowerCase()) : '')) + (pg.cab && !d.g.encaja ? '<p style="margin:0 0 2mm;font-size:.8em"><b>No es su cabello ideal:</b> ' + es(d.g.aviso || '') + '</p>' : '');
    var izq = '<div>' + esquema(fin, T) + '<div style="font-size:.74em;text-align:center;opacity:.75;margin-top:1mm">' + (web ? 'Los grados cambian con cada paso al escuchar' : 'Grados del corte terminado') + '</div></div>';
    var leyenda = '<ol style="margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1mm 3mm;font-size:.74em">' + ZN.map(function (z, i) {
      return '<li style="display:flex;gap:2mm;align-items:baseline"><b style="flex:none;width:5mm;height:5mm;border:0.3mm solid ' + T.acc + ';border-radius:50%;color:' + T.acc + ';display:inline-flex;align-items:center;justify-content:center;font-size:.85em">' + (i + 1) + '</b><span>' + z + ' (Z' + i + ') · <b data-zt="' + i + '">' + (fin[i] || 0) + '°</b></span></li>';
    }).join('') + '</ol>';
    var ficha = '<div style="font-size:.74em;line-height:1.4;display:grid;gap:1mm"><div><b>Tipo:</b> ' + es(t.tipo) + ' · <b>Dirección:</b> ' + es(t.dir) + '</div><div><b>Herramienta:</b> ' + es(t.her) + ' · <b>Acabado:</b> ' + es(t.acabado) + '</div>' +
      '<div><b>Cabello ideal:</b> ' + es(d.rg.n) + ' · sección ' + es(part(d.rg.part)) + '</div>' + (t.resultado ? '<div><b>Resultado:</b> ' + es(t.resultado) + '</div>' : '') +
      ((t.notas || []).length ? '<div><b>Clave:</b> ' + t.notas.slice(0, 2).map(es).join(' · ') + '</div>' : '') + '</div>';
    var tarjetas = '<div style="display:grid;grid-template-columns:repeat(' + Math.min(4, pasos.length) + ',minmax(0,1fr));gap:2mm;margin-top:2.5mm">' + pasos.map(function (p, k) {
      var im = imgPaso(c.id, d.cab, k), tx = k === 0 ? txt(p.texto).replace(c.n + '. ' + txt(c.d), '').trim() : txt(p.texto), e = p.elevB || [];
      var zon = e.map(function (v, i) { return v ? '<b style="color:' + T.acc + '">' + (i + 1) + '</b> ' + v + '°' : ''; }).filter(Boolean).join(' · ') || '0° en todas';
      return '<div data-g3d-paso="' + k + '" style="background:' + T.soft + ';border-radius:' + rad + 'px;padding:1.5mm;font-size:.64em;line-height:1.28;transition:opacity .3s">' +
        (im ? '<img src="' + im + '" alt="Paso ' + (k + 1) + '" style="width:100%;height:auto;display:block;border-radius:' + rad + 'px;margin-bottom:1.5mm">' : '') +
        '<b style="font-family:' + T.tit + ';color:' + T.acc + ';font-size:1.12em;display:block">' + (k + 1) + ' · ' + es(txt(p.titulo).replace(/^\d+\s*·\s*/, '')) + '</b>' +
        '<div style="margin:1mm 0">Partición ' + es(part(p.particionB)) + ' · ' + es(p.herramienta || t.her) + '</div><div style="margin:0 0 1mm">Zonas: ' + zon + '</div>' + (tx ? '<div>' + es(tx) + '</div>' : '') + '</div>';
    }).join('') + '</div>';
    var Q = preguntas(d), test = '<div style="margin-top:2.5mm;font-size:.74em"><b style="font-family:' + T.tit + ';color:' + T.acc + '">Compruébalo</b><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:3mm">' + Q.map(function (q, i) {
      return '<div data-g3d-q="1" data-c="' + q.c + '" style="margin-top:1.5mm"><div>' + (i + 1) + '. ' + es(q.e) + '</div>' + (web ? '<div style="display:flex;flex-direction:column;align-items:flex-start;gap:1mm;margin-top:1mm">' + q.o.map(function (o, j) {
        return '<button data-g3d-op="' + j + '" style="font:inherit;font-size:.95em;padding:.8mm 2.5mm;line-height:1.25;text-align:left;border:0.3mm solid ' + T.acc + ';background:#fff;border-radius:' + rad + 'px;cursor:pointer">' + es(o) + '</button>';
      }).join('') + '</div>' : '<div style="opacity:.85">' + q.o.map(function (o, j) { return String.fromCharCode(97 + j) + ') ' + es(o); }).join('   ') + '</div>') + '</div>';
    }).join('') + '</div>' + (web ? '' : '<div style="font-size:.85em;opacity:.7;margin-top:1.5mm">Soluciones: ' + Q.map(function (q, i) { return (i + 1) + String.fromCharCode(97 + q.c); }).join(' · ') + '</div>') + '</div>';
    var ctrl = web ? '<div style="display:flex;gap:3mm;align-items:center;margin:0 0 2.5mm"><button data-g3d-play="1" style="font:inherit;font-size:.86em;padding:1.5mm 4mm;border:0;border-radius:' + rad + 'px;background:' + T.acc + ';color:#fff;cursor:pointer;white-space:nowrap;flex:none">▶ Ver y escuchar</button><span data-g3d-sub="1" style="font-size:.8em;font-style:italic;opacity:.85;min-width:0"></span></div>'
      : '<div style="font-size:.76em;opacity:.8;margin:0 0 2.5mm">Vídeo con voz de esta guía en el curso premium: lección «' + es(c.n) + '».</div>';
    var attrs = web ? ' data-acc="' + es(T.acc) + '" data-fin="' + es(JSON.stringify(fin)) + '" data-elevs="' + es(JSON.stringify(pasos.map(function (p) { return p.elevB || []; }))) + '" data-narra="' + es(JSON.stringify(narracion(d))) + '"' : '';
    return H.cabecera(C, pg) + '<div data-g3d-pg="1"' + attrs + ' style="display:contents">' + cab + ctrl +
      '<div style="display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1fr);gap:4mm;align-items:start"><div>' + izq + '</div><div style="display:grid;gap:3mm">' + leyenda + ficha + '</div></div>' +
      tarjetas + test + '</div>' + (web ? SCRIPT : '') + H.folio(C, pg);
  }

  ED.registrar({ paginas: { pe_guia3d: pagina }, voz: { pe_guia3d: function (pg) { var d = datos(pg.corte); return d ? narracion(d).map(function (n) { return n.t; }).join(' ') : ''; } } });

  /* el script lee los datos del contenedor .pg: se copian del div interior al abrir la página */
  var FIX = '<script>document.querySelectorAll("[data-g3d-pg]").forEach(function(d){var pg=d.closest(".pg");if(pg)["acc","fin","elevs","narra"].forEach(function(k){if(d.dataset[k])pg.dataset[k]=d.dataset[k]})});<\/script>';
  var doc0 = ED.documento;
  ED.documento = function (res, modo) { var h = doc0.apply(this, arguments); return modo === 'web' && /data-g3d-pg/.test(h) ? h.replace(/<\/body>/i, FIX + '</body>') : h; };

  /* cada unidad de corte: una guía 3D por corte, en las páginas de relleno de la unidad (por orden de prescindibles) */
  var RELLENO = ['pe_corte', 'vis', 'lec_amplia', 'lec_lectura', 'lec_caso', 'lec_concepto', 'pro_diagrama', 'lec_proyecto'];
  function convertir(res, cfg) {
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || !window.EU_PELU_GUIAS || !window.EU_CORTES) return res;
    var CO = window.EU_CORTES, porU = {};
    res.pages.forEach(function (p, i) { if (p.u && /^pe_u_c_/.test(p.u.id)) (porU[p.u.id] = porU[p.u.id] || []).push(i); });
    Object.keys(porU).forEach(function (uid) {
      var cortes = CO.lista(uid.slice(7)).map(function (c) { return c.id; }); if (!cortes.length) return;
      var hechos = {}, cand = [];
      porU[uid].forEach(function (i) { var p = res.pages[i], r = RELLENO.indexOf(p.tipo); if (r < 0) return; if (p.tipo === 'pe_corte' && (p.familia || p.elevs)) return; if (p.tipo === 'pe_corte' && p.corte && !p.cab) r = -1; if (p.tipo === 'pe_corte' && p.mod) r = 0.5; cand.push([r, i]); });
      cand.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
      var usa = cand.slice(0, cortes.length).map(function (x) { return x[1]; }).sort(function (a, b) { return a - b; });
      usa.forEach(function (i, k) {
        var p = res.pages[i], id = p.tipo === 'pe_corte' && p.corte && !p.cab && !hechos[p.corte] ? p.corte : cortes.filter(function (c) { return !hechos[c]; })[0];
        if (!id) return; hechos[id] = 1;
        res.pages[i] = { tipo: 'pe_guia3d', u: p.u, n: p.n, num: p.num, corte: id };
      });
      /* el mismo corte en otro cabello (antes, la ficha con el mismo dibujo): ahora su guía 3D con ese cabello */
      porU[uid].forEach(function (i) { var p = res.pages[i]; if (p.tipo === 'pe_corte' && p.corte && p.cab) res.pages[i] = { tipo: 'pe_guia3d', u: p.u, n: p.n, num: p.num, corte: p.corte, cab: p.cab }; });
    });
    return res;
  }
  function enganchar() {
    if (ED.__peluG3dLibro) return; ED.__peluG3dLibro = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { convertir(r, cfg); } catch (e) { console.warn('pelu guía 3D', e); } return r; };
  }
  (function esperar() { if (ED.__peluDiag) enganchar(); else setTimeout(esperar, 300); })();

  window.EU_PELU_LIBRO3D = { pagina: pagina, esquema: esquema, narracion: narracion, preguntas: preguntas, convertir: convertir };
})();
