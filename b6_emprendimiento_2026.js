/* b6_emprendimiento_2026.js — datos 2025-2026 con fuente para «Para saber más» de Emprendimiento,
   ganchos por unidad y ejercicios sin repetir en libros largos. Cargar después de b6_emprendimiento.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, EM = window.EU_EMPRE, LB = window.EU_LIBRO, CU = window.EU_CURRICULO;
  if (!ED || !EM || !LB || !LB.SABER || window.EU_EMPRE_2026) return;
  var H = ED.H;
  /* Datos verificables con su fuente (revisión septiembre 2026) */
  var TEND = {
    mx: [['Comercio en línea récord', 'Las ventas minoristas por internet sumaron 941 mil millones de pesos en 2025, un 19,2 % más que en 2024 (AMVO, Estudio de Venta Online 2026).'], ['17,7 de cada 100 pesos', 'El comercio electrónico ya es el 17,7 % de las ventas minoristas del país (AMVO 2026).'], ['77,2 millones de compradores', 'En 2025 compraron por internet 77,2 millones de personas en México (AMVO 2026).'], ['Lo que más se compra', 'Moda, belleza y cuidado personal están entre las categorías más compradas en línea (AMVO 2026).'], ['Tiendas solo digitales', 'Las tiendas nativas digitales crecieron un 23,7 % en 2025, frente al 14,9 % de los comercios tradicionales con presencia digital (AMVO 2026).']],
    ar: [['34 billones en línea', 'El comercio electrónico facturó $34.033.238 millones en 2025, un 55 % más que en 2024 (CACE, Estudio Anual 2025).'], ['25,1 millones de compradores', 'En 2025 se sumaron 1.338.952 compradores nuevos, hasta 25,1 millones (CACE).'], ['El peso de las cuotas', 'Ocho de cada diez consumidores consideran clave poder pagar en cuotas al comprar en línea (CACE 2025).'], ['Dónde se vende', 'El Área Metropolitana de Buenos Aires concentró el 52 % de la facturación en línea (CACE 2025).']],
    co: [['145,4 billones', 'Las ventas en línea alcanzaron 145,4 billones de pesos en 2025, un 11,1 % más que en 2024 (Cámara Colombiana de Comercio Electrónico).'], ['684,6 millones de compras', 'Se hicieron 684,6 millones de compras en línea en 2025, un 19,9 % más que el año anterior (CCCE).'], ['Compras más pequeñas y frecuentes', 'El ticket medio bajó a 212.373 pesos: se compra más a menudo y por importes menores (CCCE 2025).'], ['Cómo se paga', 'En el segundo trimestre de 2025 el débito por PSE concentró el 63,9 % de las transacciones y el efectivo solo el 2,7 % (CCCE).']],
    cl: [['Cerca de 10 mil millones de dólares', 'El comercio electrónico cerró 2025 cerca de US$ 10.000 millones, con un crecimiento real de más del 9 % (Cámara de Comercio de Santiago).'], ['Alimentos en línea', 'Alimentos y bebidas pasó a ser el segundo rubro de las ventas en línea, con el 18 % (CCS 2026).'], ['17 mil tiendas solo en línea', 'Unas 17 mil empresas venden solo por internet, con ventas de más de US$ 1.600 millones (CCS, con datos del SII).'], ['Previsión 2026', 'La CCS proyecta un crecimiento del 6 % en 2026, hasta unos US$ 10.600 millones.']],
    es: [['7,8 de cada 100', 'La tasa de actividad emprendedora (negocios de menos de tres años y medio) fue del 7,8 % (Informe GEM España 2025-2026).'], ['Intención de emprender', 'El 13,8 % de la población piensa emprender en los próximos tres años (GEM España 2025-2026).'], ['Emprendimiento migrante', 'La población migrante tiene una tasa de actividad emprendedora del 13,8 %, casi el doble de la media (GEM España 2025-2026).'], ['Inteligencia artificial', 'El 29 % de quienes emprenden en fase inicial ya usa la inteligencia artificial en su negocio; el 46 % usa comercio electrónico (GEM España 2025-2026).'], ['Servicios', 'El 85 % de las iniciativas lanzadas en 2025 fueron del sector servicios (GEM España 2025-2026).']],
    us: [['Negocios latinos en crecimiento', 'Entre 2018 y 2023 las empresas latinas con empleados crecieron un 44 %, hasta 465.202 (Stanford Latino Entrepreneurship Initiative).'], ['Rentables', 'El 84 % de las empresas latinas encuestadas fue rentable en 2024 (Stanford SLEI).'], ['El reto de la financiación', 'Solo el 21 % de quienes emprenden siendo latinos recibe toda la financiación que pide, frente al 40 % de los blancos (Stanford SLEI).'], ['Capital riesgo', 'Las empresas latinas recibieron menos del 2 % del capital riesgo en 2025 (Stanford SLEI 2026).']],
    do: [['El país de las mipymes', 'Las mipymes son el 98 % de las empresas, aportan el 32 % del PIB y generan el 61,6 % del empleo (Enmipymes, Banco Central y MICM).'], ['Formalizarse', 'En 2025 se formalizaron 4.264 mipymes nuevas; son más de 54.000 en cinco años (MICM).'], ['Meta 2028', 'El objetivo oficial es superar las 350.000 mipymes formales antes de 2028 (MICM).'], ['Hecho en RD', 'El 40 % de las industrias con el sello «Hecho en República Dominicana» son mipymes (MICM).']],
    ve: [['Ingreso mínimo integral', 'Desde mayo de 2026 el ingreso mínimo integral equivale a 240 dólares al mes, pagados en bolívares; el salario mínimo legal sigue en 130 Bs.'], ['Inflación', 'La inflación de 2025 fue del 475 % según las cifras publicadas en 2026: por eso muchos negocios fijan precios de referencia en divisas y reponen inventario rápido.'], ['La canasta', 'Estimaciones privadas sitúan la canasta alimentaria de una familia de cinco en 677 dólares (abril de 2026).']]
  };
  var GENERAL = [['Tiendas en línea en toda la región', 'En América Latina el comercio electrónico equivale al 15,9 % de las ventas minoristas, frente al 8,4 % de media mundial (AMVO 2026).'], ['El método lean startup', 'Eric Ries popularizó en 2011 la idea de lanzar un producto mínimo, medir y aprender antes de invertir mucho.'], ['Mercado Libre', 'Mercado Libre nació en Buenos Aires en 1999 y hoy es el mayor mercado en línea de América Latina.'], ['Etsy', 'Etsy, el mercado en línea de productos hechos a mano, se fundó en Nueva York en 2005.'], ['Micromecenazgo', 'Kickstarter nació en 2009 y popularizó financiar un proyecto con muchas aportaciones pequeñas a cambio de recompensas.'], ['El código QR', 'Denso Wave creó el código QR en Japón en 1994; hoy se usa para cobrar en pequeños comercios.'], ['La regla 80/20', 'Vilfredo Pareto observó hacia 1896 que el 20 % de la población poseía el 80 % de la tierra en Italia; en los negocios se usa para buscar los pocos clientes que dan la mayoría de las ventas.']];
  var BASE = (LB.SABER.empre || []).slice();
  var GANCHO = { emp_idea: '¿Qué problema de tu barrio resolverías mañana si alguien te pagara por ello?', emp_lienzo: '¿Cabe tu negocio entero en una hoja?', emp_mercado: '¿Cuántas personas de tu ciudad comprarían tu producto este mes?', emp_costos: '¿Cuánto vale una hora de tu trabajo?', emp_precio: '¿Por qué una vela puede costar lo mismo que una comida?', emp_equilibrio: '¿Cuántas ventas separan perder dinero de ganarlo?', emp_flujo: '¿Se puede ganar dinero y quedarse sin caja?', emp_marketing: '¿Qué recuerda la gente de tu marca cuando cierra el móvil?', emp_finan: '¿De dónde sale el primer dinero?', emp_pitch: '¿Convencerías a alguien en tres minutos?', emp_pais: '¿Qué trámite harías primero?', emp_capital: '¿Cuánto dinero necesitas antes de vender la primera pieza?', emp_margen_art: '¿Te conviene más vender 10 piezas caras o 50 baratas?', emp_caja_art: '¿Puede tu taller pagarte un salario mínimo?' };
  (CU.UNIDADES || []).forEach(function (u) { if (u.m === 'empre' && GANCHO[u.id] && !u.h) u.h = GANCHO[u.id]; });

  /* Ejercicios sin repetir: cambia los enunciados duplicados por otros nuevos */
  function sinRepetir(res) {
    var C = res.C, visto = {}, keys = Object.keys(EM.GEN), n = 0;
    res.pages.forEach(function (p, i) {
      if (!p.items || !p.items.length) return;
      var nuevos = [];
      p.items.forEach(function (x, j) {
        var k = x && x.e; if (!k) { nuevos.push(x); return; }
        if (!visto[k]) { visto[k] = 1; nuevos.push(x); return; }
        if (!p.u || p.u.m !== 'empre') return;
        var r = H.rng(H.hash('emp:' + i + ':' + j + ':' + (C.semilla || 1)));
        for (var t = 0; t < 40; t++) { var gk = t < 12 && EM.GEN[p.u.g] ? p.u.g : keys[Math.floor(r() * keys.length)], y = null; try { y = EM.GEN[gk](p.u, C, r); } catch (e) {} if (y && y.e && !visto[y.e]) { visto[y.e] = 1; nuevos.push(y); n++; return; } }
      });
      p.items.length = 0; Array.prototype.push.apply(p.items, nuevos);
      if (!p.items.length && p.tipo === 'actividad') { p.tipo = 'emp_lienzo'; p.idea = null; }
    });
    res.C.empNuevos = n;
  }
  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var emp = cfg && cfg.materia === 'empre';
    if (emp) LB.SABER.empre = BASE.concat(TEND[cfg.pais] || [], GENERAL);
    var res = ens(cfg);
    if (emp) try { sinRepetir(res); } catch (e) { console.warn('EU_EMPRE_2026', e); }
    return res;
  };
  window.EU_EMPRE_2026 = { TEND: TEND, GENERAL: GENERAL, GANCHO: GANCHO, sinRepetir: sinRepetir };
})();
