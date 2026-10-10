/* b6_asesor_precio.js — «💰 Asesor de precio» en la vista previa con pestañas (window.EU_ASESOR_PRECIO), Fátima 10-10-2026.
   Escanea el libro hoja por hoja (tipos de página) y el curso (módulos, lecciones, vídeos, horas, preguntas) y dice
   cuánto cobrar por el LIBRO DIGITAL (interactivo + PDF + EPUB, a partir de 56 hojas) y por el CURSO PREMIUM con
   su libro (lo que va en la Carpeta HOTMART), en Hotmart y vendiendo por Instagram/Facebook con enlace de pago,
   en los 8 países del sistema, con lo que queda limpio en cada canal.
   En qué se basa (fuentes en FUENTES, se muestran en la pestaña):
   · escalones de precio de cursos en Hotmart (Aprende Studio 04-2026: 27–67 básicos y ebooks · 97–197 completos ·
     297–497 avanzados con mentoría) y de Hotmart (entrada · curso completo · certificación);
   · comisión de Hotmart 9,9 % + 0,50 USD (0,10 si ≤ 15 USD) y retiro 1 USD (bit4learn 04-2026);
   · Stripe en España 1,5 % + 0,25 € tarjetas EEE / 3,25 % + 0,25 € internacionales (Quipu 01-2026);
     PayPal 2,90 % + 0,35 € y hasta +1,99 % fuera del EEE (PayPal ES 02-2026, vía Sellfy);
   · Meta no permite vender descargables en su tienda: en Instagram/Facebook se anuncia y se enlaza al pago;
   · ajuste por país con el salario mínimo y los cambios que ya usa el sistema (EU_EMPRE.SMI / FX).
   Es orientativo: el precio final lo decide Fátima. No toca el libro, el curso, Firebase ni localStorage. */
(function () {
  'use strict';
  if (window.EU_ASESOR_PRECIO) return;
  var FUENTES = [
    ['Aprende Studio · Hotmart: precios de cursos (abr. 2026)', 'https://www.aprende.studio/plataformas/hotmart/'],
    ['Hotmart · Cómo poner precio a un curso online', 'https://hotmart.com/pt-br/blog/como-precificar-curso-online'],
    ['bit4learn · Comisiones de Hotmart (abr. 2026)', 'https://bit4learn.com/es/lms/hotmart/'],
    ['Quipu · Comisiones de Stripe en España (ene. 2026)', 'https://getquipu.com/blog/comisiones-stripe/'],
    ['Sellfy · Comisiones de PayPal 2026', 'https://sellfy.com/es/blog/vender-productos-digitales-con-paypal/'],
    ['Meta: descargables no permitidos en la tienda', 'https://www.godatafeed.com/disapproval/meta-subscription-or-digital-download-product'],
    ['Ejemplo real: Experto en Coloración Capilar, online, 150 h, 320 €', 'https://www.emagister.com/cursos-colorimetria-del-cabello-kwes-1000002244_2.htm']
  ];
  /* escalones en USD [desde, hasta] */
  var LIBRO = [
    [0, 55, 10, 15, 'Producto de entrada (menos de 56 hojas)'],
    [56, 99, 15, 27, 'Libro digital corto (56–99 hojas)'],
    [100, 199, 27, 47, 'Libro digital completo (100–199 hojas)'],
    [200, 1e9, 47, 67, 'Libro digital extenso (200 hojas o más)']
  ];
  var CURSO = [
    [0, 2, 27, 67, 'Curso básico (menos de 2 h)'],
    [2, 5, 97, 147, 'Curso completo (2–5 h)'],
    [5, 10, 147, 197, 'Curso completo extenso (5–10 h)'],
    [10, 1e9, 197, 297, 'Curso avanzado con certificado (más de 10 h; sin mentoría en vivo no se pasa de 297)']
  ];
  var PAISES = { es: ['España', 'EUR', 'es-ES'], mx: ['México', 'MXN', 'es-MX'], co: ['Colombia', 'COP', 'es-CO'], ar: ['Argentina', 'ARS', 'es-AR'], cl: ['Chile', 'CLP', 'es-CL'], ve: ['Venezuela (en USD)', 'USD', 'es-VE'], do: ['Rep. Dominicana', 'DOP', 'es-DO'], us: ['EE. UU. (en español)', 'USD', 'es-US'] };
  var FX0 = { es: 1, mx: 20, co: 4300, ar: 1300, cl: 1000, ve: 150, do: 65, us: 1.1 };
  var SMI0 = { es: 1424.5, mx: 9451, co: 1750905, ar: 376600, cl: 553553, ve: 240, do: 18421.2, us: 1257 };
  var OFICIO = /^(pelu|reposteria|panaderia|pasteleria|batidos|cocina|conta|empre|mkt|ia|redes|ecom)$/;

  function fx() { return (window.EU_EMPRE && window.EU_EMPRE.FX) || FX0; }
  function smiUSD(pk) {
    var S = window.EU_EMPRE && window.EU_EMPRE.SMI, v = S && S[pk] ? S[pk][0] : SMI0[pk], F = fx();
    if (pk === 've' || pk === 'us') return v;            /* VE: el sistema lo da en USD */
    return v / F[pk] * F.us;                              /* moneda local → EUR → USD */
  }
  /* poder adquisitivo frente a EE. UU., suavizado (raíz) y acotado */
  function factor(pk) { var r = smiUSD(pk) / smiUSD('us'); return Math.max(0.4, Math.min(1.2, Math.sqrt(r))); }
  function aLocal(usd, pk) { var F = fx(); if (pk === 've' || pk === 'us') return usd; return usd / F.us * F[pk]; }
  function redondo(v, mon) {
    if (mon === 'USD' || mon === 'EUR') return v < 12 ? Math.max(5, Math.round(v)) : Math.max(7, Math.round((v - 7) / 10) * 10 + 7);   /* terminados en 7 (Hotmart) */
    var p = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1)); return Math.round(v / p) * p;
  }
  function dinero(v, pk) { var P = PAISES[pk]; try { return new Intl.NumberFormat(P[2], { style: 'currency', currency: P[1], maximumFractionDigits: 0 }).format(v); } catch (e) { return Math.round(v) + ' ' + P[1]; } }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ─── escaneo hoja por hoja ─── */
  var GRUPOS = [
    ['Técnicas y cortes animados', /^pe_(animada|tecnica|guia3d|diagrama|mitec)$/],
    ['Teoría y lecturas', /^(apertura|aprende|lec_|enc_desarrollo|enc_conclusion|presentacion|s_titulo|concepto)/],
    ['Ejemplos resueltos', /^enc_ejemplos$/],
    ['Repaso con tu tutor (pizarra)', /^tutor$/],
    ['Actividades y práctica', /^(actividad|practica|repaso|evalua|examen|ficha|t_|proc_)/],
    ['Láminas, esquemas y dibujos', /^(esc_lamina|vis|geo_|col_|lam)/],
    ['Solucionario', /^solucion/]
  ];
  function escanea(res) {
    var c = {}, otras = 0;
    res.pages.forEach(function (p) {
      var g = GRUPOS.filter(function (x) { return x[1].test(p.tipo || ''); })[0];
      if (g) c[g[0]] = (c[g[0]] || 0) + 1; else otras++;
    });
    return { grupos: GRUPOS.map(function (g) { return [g[0], c[g[0]] || 0]; }).filter(function (x) { return x[1]; }).concat(otras ? [['Otras (portada, índice, créditos…)', otras]] : []), hojas: res.pages.length };
  }
  function cursoDatos(D) {
    var L = 0, V = 0, esc_ = 0, letras = 0, preg = 0, piz = 0, anim = 0;
    (D.modulos || []).forEach(function (M) {
      preg += (M.test || []).length;
      M.lecciones.forEach(function (l) {
        L++; if (l.video) V++; if (/__pizarra$/.test(l.id || '')) piz++; if (l.animada || /^(Diagramación|Clase|Técnica|Variante) ·/.test(l.t || '')) anim++;
        (l.escenas || []).forEach(function (e) { esc_++; letras += String(e.texto || '').length + String(e.sol || '').length; });
      });
    });
    preg += (D.examen || []).length;
    var horas = (letras / 14.5 + 2 * esc_ + 45 * preg) / 3600;   /* misma cuenta que el certificado */
    return { modulos: (D.modulos || []).length, lecciones: L, videos: V, escenas: esc_, preguntas: preg, horas: horas, pizarra: piz, animadas: anim };
  }
  function escalon(T, v) { return T.filter(function (t) { return v >= t[0] && v <= t[1]; })[0] || T[T.length - 1]; }
  function recomienda(t, prof, extra) { var f = Math.min(1, (prof ? 0.6 : 0.35) + (extra ? 0.15 : 0)); return t[2] + (t[3] - t[2]) * f; }
  function neto(usd, pk) {
    var hot = usd - (usd * 0.099 + (usd > 15 ? 0.5 : 0.1));
    var eur = usd / 1.1, eee = pk === 'es';
    var str = usd - (usd * (eee ? 0.015 : 0.0325) + 0.25 * 1.1);
    var pp = usd - (usd * (0.029 + (eee ? 0 : 0.0199)) + 0.35 * 1.1);
    return { hot: hot, str: str, pp: pp, eur: eur };
  }

  function panel(ed, D, caja) {
    var res = ed.res, C = res.C, pk = PAISES[C.pk] ? C.pk : 'es', cfg = C.cfg || {};
    var S = escanea(res), K = cursoDatos(D), prof = !!(C.adulto || /^(fp|adu)$/.test(cfg.nivel) || OFICIO.test(C.mat || cfg.materia || ''));
    var extra = K.animadas > 0 || K.pizarra > 0;
    var tL = escalon(LIBRO, S.hojas), tC = escalon(CURSO, K.horas);
    var uL = recomienda(tL, prof, extra), uC = recomienda(tC, prof, extra);
    var T = '#16223A', O = '#B08D57';
    function precio(usd, p) { var P = PAISES[p]; return dinero(redondo(aLocal(usd * factor(p), p), P[1]), p); }
    function precioN(usd, p) { var P = PAISES[p]; return redondo(aLocal(usd * factor(p), p), P[1]); }
    function rango(t, p) { return precio(t[2], p) + ' – ' + precio(t[3], p); }
    function tarjeta(ico, tit, inc, t, usd) {
      var p = precioN(usd, pk), usdP = pk === 'us' || pk === 've' ? p : p / aLocal(1, pk), n = neto(usdP, pk);
      var nl = function (v) { return dinero(aLocal(v, pk), pk); };
      return '<div style="flex:1 1 320px;background:#fff;border:1px solid #e3e6ee;border-top:4px solid ' + O + ';border-radius:12px;padding:14px 16px">' +
        '<div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:' + O + ';font-weight:700">' + ico + ' ' + esc(tit) + '</div>' +
        '<div style="font-size:30px;font-weight:800;color:' + T + ';margin:6px 0 2px">' + dinero(p, pk) + '</div>' +
        '<div style="font-size:12.5px;color:#55607a">Precio recomendado en ' + esc(PAISES[pk][0]) + ' · rango ' + rango(t, pk) + '<br><b>' + esc(t[4]) + '</b></div>' +
        '<div style="font-size:12.5px;margin:8px 0;color:#333"><b>Incluye:</b> ' + esc(inc) + '</div>' +
        '<table style="width:100%;font-size:12.5px;border-collapse:collapse;margin-top:6px">' +
        '<tr style="background:#f4f6fa"><td style="padding:4px 6px"><b>Canal</b></td><td style="padding:4px 6px;text-align:right"><b>Te queda por venta</b></td></tr>' +
        '<tr><td style="padding:4px 6px">Hotmart (9,9 % + ' + (usdP > 15 ? '0,50' : '0,10') + ' USD)</td><td style="padding:4px 6px;text-align:right">' + nl(n.hot) + '</td></tr>' +
        '<tr><td style="padding:4px 6px">Instagram / Facebook + enlace Stripe (' + (pk === 'es' ? '1,5 %' : '3,25 %') + ' + 0,25 €)</td><td style="padding:4px 6px;text-align:right">' + nl(n.str) + '</td></tr>' +
        '<tr><td style="padding:4px 6px">Instagram / Facebook + PayPal (2,9 %' + (pk === 'es' ? '' : ' + 1,99 %') + ' + 0,35 €)</td><td style="padding:4px 6px;text-align:right">' + nl(n.pp) + '</td></tr></table></div>';
    }
    var conPiz = res.pages.some(function (q) { return q.tipo === 'tutor'; });
    var incL = 'libro interactivo con voz' + (conPiz ? ' y pizarra del tutor' : '') + ', PDF imprimible y EPUB · ' + S.hojas + ' hojas';
    var incC = K.modulos + ' módulos, ' + K.lecciones + ' lecciones (' + K.videos + ' en vídeo), ' + K.preguntas + ' preguntas de test y examen, certificado y el libro completo';
    var tiles = [['Hojas', S.hojas], ['Módulos', K.modulos], ['Lecciones', K.lecciones], ['Vídeos', K.videos], ['Horas aprox.', K.horas.toFixed(1).replace('.', ',')], ['Preguntas', K.preguntas], ['Lecciones animadas', K.animadas], ['Lecciones de pizarra', K.pizarra]]
      .map(function (x) { return '<div style="background:' + T + ';color:#fff;border-radius:10px;padding:8px 12px;min-width:92px"><div style="font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:' + O + '">' + x[0] + '</div><div style="font-size:20px;font-weight:800">' + x[1] + '</div></div>'; }).join('');
    var hojas = S.grupos.map(function (g) { return '<tr><td style="padding:3px 8px">' + esc(g[0]) + '</td><td style="padding:3px 8px;text-align:right">' + g[1] + '</td></tr>'; }).join('');
    var filas = Object.keys(PAISES).map(function (p) {
      return '<tr' + (p === pk ? ' style="background:#fbf6ec;font-weight:700"' : '') + '><td style="padding:4px 8px">' + esc(PAISES[p][0]) + '</td><td style="padding:4px 8px;text-align:right">' + precio(uL, p) + '</td><td style="padding:4px 8px;text-align:right">' + precio(uC, p) + '</td><td style="padding:4px 8px;text-align:right;color:#666">×' + factor(p).toFixed(2).replace('.', ',') + '</td></tr>';
    }).join('');
    var aviso = S.hojas < 56 ? '<div style="background:#fff4e5;border:1px solid #f0c27a;border-radius:10px;padding:8px 12px;margin:10px 0;font-size:13px">Este libro tiene <b>' + S.hojas + ' hojas</b>: por debajo de 56 conviene usarlo como producto de entrada o regalo para captar alumnas, y vender el curso.</div>' : '';
    /* (10-10-2026, Fátima) «🔊 Escuchar el asesor»: lo mismo que se ve en la pestaña, leído con la voz española */
    var MON = { EUR: 'euros', MXN: 'pesos mexicanos', COP: 'pesos colombianos', ARS: 'pesos argentinos', CLP: 'pesos chilenos', USD: 'dólares', DOP: 'pesos dominicanos' };
    function dice(v, p) { p = p || pk; return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(Math.round(v)) + ' ' + (MON[PAISES[p][1]] || PAISES[p][1]); }
    function voz1(tit, t, usd, inc) {
      var p = precioN(usd, pk), usdP = pk === 'us' || pk === 've' ? p : p / aLocal(1, pk), n = neto(usdP, pk), loc = function (v) { return dice(aLocal(v, pk)); };
      return tit + ': precio recomendado en ' + PAISES[pk][0] + ', ' + dice(p) + '. El rango va de ' + dice(precioN(t[2], pk)) + ' a ' + dice(precioN(t[3], pk)) + ', ' + t[4] + '. Incluye ' + inc + '. Por cada venta te quedan ' + loc(n.hot) + ' en Hotmart, ' + loc(n.str) + ' con Stripe y ' + loc(n.pp) + ' con PayPal.';
    }
    var vozTxt = 'Asesor de precio de ' + (C.titulo || 'este libro') + '. ' + (prof ? 'Es formación profesional o para adultos' : 'Es material escolar') + (extra ? ', con animaciones o pizarra' : '') + '. ' +
      'El libro tiene ' + S.hojas + ' hojas: ' + S.grupos.map(function (g) { return g[1] + ' de ' + g[0].toLowerCase(); }).join(', ') + '. ' +
      'El curso tiene ' + K.modulos + ' módulos, ' + K.lecciones + ' lecciones y unas ' + K.horas.toFixed(1).replace('.', ',') + ' horas. ' +
      (S.hojas < 56 ? 'Con menos de 56 hojas conviene usar el libro como producto de entrada o regalo, y vender el curso. ' : '') +
      voz1('Libro digital', tL, uL, incL) + ' ' + voz1('Curso premium más libro', tC, uC, incC) + ' ' +
      'Por país: ' + Object.keys(PAISES).map(function (p) { return PAISES[p][0].replace(/\s*\(.*\)/, '').replace('Rep. Dominicana', 'República Dominicana').replace('EE. UU.', 'Estados Unidos') + ', libro ' + dice(precioN(uL, p), p) + ' y curso ' + dice(precioN(uC, p), p); }).join('; ') + '. ' +
      'Para vender en Instagram y Facebook: Meta no permite poner productos descargables en su tienda; se publica y se enlaza al pago de Hotmart, Stripe o PayPal. Con Hotmart el comprador recibe el acceso solo. Es orientativo: el precio final lo decides tú.';
    caja.innerHTML = '<div style="background:#f6f7fb;border-radius:12px;padding:16px;color:#1f2433;font-family:system-ui,Segoe UI,sans-serif;max-width:1100px;margin:0 auto">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div style="font-size:18px;font-weight:800;color:' + T + '">💰 Asesor de precio · ' + esc(C.titulo || '') + '</div><button data-asesor-voz style="font:600 13px system-ui,sans-serif;padding:7px 14px;border-radius:99px;border:0;background:' + T + ';color:#fff;cursor:pointer">🔊 Escuchar el asesor</button></div>' +
      '<div style="font-size:12.5px;color:#55607a;margin:2px 0 12px">' + (prof ? 'Formación profesional / adultos' : 'Material escolar') + (extra ? ' · con animaciones o pizarra' : '') + ' · país del libro: ' + esc(PAISES[pk][0]) + '. Orientativo: el precio final lo decides tú.</div>' +
      aviso + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">' + tiles + '</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap">' + tarjeta('📘', 'Libro digital', incL, tL, uL) + tarjeta('🎓', 'Curso premium + libro (Carpeta HOTMART)', incC, tC, uC) + '</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">' +
      '<div style="flex:1 1 320px;background:#fff;border:1px solid #e3e6ee;border-radius:12px;padding:12px 14px"><div style="font-weight:700;color:' + T + ';margin-bottom:6px">Precio por país</div><table style="width:100%;font-size:13px;border-collapse:collapse"><tr style="background:#f4f6fa"><td style="padding:4px 8px"><b>País</b></td><td style="padding:4px 8px;text-align:right"><b>Libro</b></td><td style="padding:4px 8px;text-align:right"><b>Curso + libro</b></td><td style="padding:4px 8px;text-align:right"><b>Ajuste</b></td></tr>' + filas + '</table><div style="font-size:11.5px;color:#666;margin-top:6px">Ajuste = poder adquisitivo frente a EE. UU. con el salario mínimo de cada país (dato del sistema), suavizado y entre ×0,40 y ×1,20. En Hotmart puedes poner precio distinto por país.</div></div>' +
      '<div style="flex:1 1 280px;background:#fff;border:1px solid #e3e6ee;border-radius:12px;padding:12px 14px"><div style="font-weight:700;color:' + T + ';margin-bottom:6px">Escaneado hoja por hoja</div><table style="width:100%;font-size:13px;border-collapse:collapse">' + hojas + '</table></div></div>' +
      '<div style="background:#fff;border:1px solid #e3e6ee;border-radius:12px;padding:12px 14px;margin-top:12px;font-size:12.5px;line-height:1.55">' +
      '<b>Cómo vender en Instagram y Facebook:</b> Meta no permite poner productos descargables en su tienda; se publica (carrusel, reel, historia) y se enlaza al pago: el enlace de Hotmart, un enlace de pago de Stripe o PayPal. Con Hotmart el comprador recibe el acceso solo; con Stripe o PayPal lo envías tú.<br>' +
      '<b>En qué se basa:</b> escalón por hojas (libro) y por horas de contenido (curso); dentro del escalón, más arriba si es formación profesional o lleva animaciones/pizarra. Precios terminados en 7, como recomienda Hotmart. Hotmart cobra además 1 USD por cada retiro (no por venta).<br>' +
      '<b>Fuentes:</b> ' + FUENTES.map(function (f) { return '<a href="' + f[1] + '" target="_blank" rel="noopener" style="color:' + T + '">' + esc(f[0]) + '</a>'; }).join(' · ') + '</div></div>';
    var bt = caja.querySelector('[data-asesor-voz]'), SS = window.speechSynthesis;
    if (bt && !SS) bt.style.display = 'none';
    if (bt && SS) bt.onclick = function () {
      var listo = function () { bt._on = 0; bt.textContent = '🔊 Escuchar el asesor'; };
      if (bt._on) { bt._s = (bt._s || 0) + 1; SS.cancel(); listo(); return; }
      var partes = vozTxt.replace(/(\d)–(\d)/g, '$1 a $2').replace(/…/g, '').split(/([.!?;])\s+/), fr = [];
      for (var k = 0; k < partes.length; k += 2) if (partes[k]) fr.push(partes[k] + (partes[k + 1] || ''));
      var vs = SS.getVoices().filter(function (x) { return /^es/i.test(x.lang); });
      var v = vs.filter(function (x) { return /google/i.test(x.name) && /es[-_]ES/i.test(x.lang); })[0] || vs.filter(function (x) { return /es[-_]ES/i.test(x.lang); })[0] || vs[0] || null;
      var i = 0, ses = bt._s = (bt._s || 0) + 1;
      SS.cancel(); bt._on = 1; bt.textContent = '■ Parar';
      (function sig() {
        if (!bt._on || ses !== bt._s) return;
        if (i >= fr.length || !bt.isConnected) { listo(); return; }
        var u = new SpeechSynthesisUtterance(fr[i++].trim()); u.lang = 'es-ES'; if (v) u.voice = v; u.rate = 0.97;
        u.onend = function () { setTimeout(sig, 160); };
        u.onerror = function (ev) { if (ev && /interrupted|canceled/.test(ev.error || '')) return; setTimeout(sig, 80); };
        SS.speak(u);
      })();
    };
  }

  window.EU_ASESOR_PRECIO = { panel: panel, /* voz: el texto se arma dentro de panel() */ escanea: escanea, cursoDatos: cursoDatos, factor: factor, LIBRO: LIBRO, CURSO: CURSO, FUENTES: FUENTES };
})();
