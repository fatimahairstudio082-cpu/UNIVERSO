/* b6_pelu_premium.js — acabado premium de Peluquería «Medianoche y oro» (Fátima, 10-10-2026) (window.EU_PELU_PREMIUM).
   · Libro de Peluquería (materia `pelu`), solo con plantilla automática y sin colores elegidos a mano (cfg.acab.acc/acc2):
     fondo blanco, tinta y acento azul medianoche (#16223A), oro (#B08D57) como segundo color y tintes suaves azulados
     en lugar del beis. Cabecera de página en banda medianoche con letras doradas y figuras en marco blanco con filo dorado.
     Las demás materias no cambian. `cfg.acab.premiumPelu = 'no'` lo apaga.
   · Curso premium de Peluquería: «Ideas clave» lleva escenas de la propia técnica o del corte de su módulo (antes salían
     dibujos de otra técnica, repetidos) y las lecciones del tutor no repiten la misma imagen en cada escena.
     Envuelve EU_CURSO_ANIM.enriquecer (cargar el último de la lista diferida, después de b6_derechos.js).
   No toca Firebase, localStorage, créditos ni login. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_PELU_PREMIUM) return;

  var PAL = { bg: '#FFFFFF', ink: '#16223A', acc: '#16223A', acc2: '#B08D57', soft: '#EEF1F6', soft2: '#EEF1F6' };
  var ORO = '#B08D57';

  function activo(C) {
    var cfg = C && C.cfg || {}, A = cfg.acab || {};
    if (C.mat !== 'pelu' || A.premiumPelu === 'no' || cfg.dislexia) return false;
    if (cfg.plantilla && cfg.plantilla !== 'auto') return false;
    if (A.acc || A.acc2) return false;
    return true;
  }
  function ajuste(C) {
    if (!activo(C)) return;
    Object.keys(PAL).forEach(function (k) { C.T[k] = PAL[k]; });
    C.T.premium = 'medianoche';
  }

  /* cabecera en banda y figuras con filo dorado: se retoca el HTML ya pintado de cada página */
  var CAB = 'border-bottom:1px solid ' + PAL.soft + ';font-size:.7em;letter-spacing:.08em;text-transform:uppercase;color:' + PAL.acc + ';';
  var CAB2 = 'border-bottom:0.7mm solid ' + ORO + ';background:' + PAL.acc + ';padding:1.8mm 4mm;font-size:.7em;letter-spacing:.08em;text-transform:uppercase;color:' + ORO + ';';
  var FIG = '<figure style="margin:0;background:' + PAL.soft + ';';
  var FIG2 = '<figure style="margin:0;background:#FFFFFF;border:0.3mm solid ' + ORO + ';box-shadow:0 0.8mm 2.4mm rgba(22,34,58,.12);';
  function post(h, pg, C) {
    if (!C || !C.T || C.T.premium !== 'medianoche' || typeof h !== 'string') return h;
    if (h.indexOf(CAB) >= 0) h = h.replace(CAB, CAB2);
    if (h.indexOf(FIG) >= 0) h = h.split(FIG).join(FIG2);
    return h;
  }
  ED.registrar({ ajuste: ajuste, post: post });
  /* 18-10-2026 (Fátima, directora del sistema: «fuera la sigla FP y los nombres oficiales; solo niveles reales»): en Peluquería
     los títulos, portadas, cabeceras, créditos y curso dicen el nivel (Principiante · Intermedio · Avanzado · Profesional), sin
     «(FP)», «Formación Profesional», «Grado Medio» ni marcos o leyes del país. Solo cambia lo que se lee; el nivel interno
     (fp, adu…) y el temario siguen igual. Texto del referente: a validar por Fátima. */
  var NIVELES3 = ['Principiante', 'Intermedio', 'Avanzado'];
  function niveles(C) {
    if (!C || C.mat !== 'pelu') return;
    var limpio = function (t) { return String(t || '').replace(/\s*\((FP|Formación Profesional)\)/gi, '').replace(/Formación Profesional/gi, 'Profesional'); };
    var cs = (C.N && C.N.c) || [], i = Math.max(0, cs.map(function (c) { return c.n; }).indexOf(C.cursoN));
    var niv = C.nivel === 'fp' ? (cs.length >= 3 ? NIVELES3[Math.min(2, i)] : cs.length === 2 ? NIVELES3[1 + Math.min(1, i)] : 'Profesional') : 'Profesional';
    if (NIVEL) niv = NIVELES3[NIVEL - 1];   /* nivel elegido (19-10-2026): la cabecera dice ese nivel */
    var ant = C.cursoN;
    C.matN = limpio(C.matN);
    C.cursoN = 'Nivel ' + niv;
    C.N = Object.assign({}, C.N, { n: 'Curso profesional' });
    C.P = Object.assign({}, C.P, { marcoCorto: 'Contenido propio de la autora', marco: 'Contenido propio de la autora, fruto de su experiencia profesional' });
    C.titulo = limpio(C.titulo).split(ant).join(C.cursoN);
  }
  ED.registrar({ ajuste: niveles });

  /* ─── curso premium: imágenes de su técnica, sin repetir dentro de una lección ─── */
  function esLam(D, e) { return !!(e.anim && D.anim && D.anim[e.anim] && D.anim[e.anim].lam); }
  function variedad(D) {
    if (!D || !D.modulos || !D.anim) return D;
    D.modulos.forEach(function (M) {
      var pool = [], visto = {};
      var tomar = function (L, pri) {
        (L.escenas || []).forEach(function (e) {
          if (e.tipo === 'pregunta' || !e.anim || !D.anim[e.anim] || esLam(D, e) || visto[e.anim]) return;
          if (/_cb_receta$|_preparacion$/.test(e.anim) || !D.img || !D.img[e.id]) return;
          visto[e.anim] = 1; pool.push({ id: e.id, anim: e.anim, pri: pri, t: e.t });
        });
      };
      M.lecciones.forEach(function (L) { if (L.animada || /^Técnica/.test(L.t || '')) tomar(L, 0); });
      M.lecciones.forEach(function (L) { if (!(L.animada || /^Técnica/.test(L.t || ''))) tomar(L, 1); });
      if (!pool.length) return;
      /* se recorren en orden y, si se acaban, se vuelve a empezar (nunca dos iguales seguidas en la misma lección) */
      var i = 0, sig = function () { return pool[i++ % pool.length]; };
      M.lecciones.forEach(function (L) {
        if (L.animada) return;
        /* lección de corte con Guías 3D: la portada repetía el paso 1; ahora muestra cómo queda el corte (de frente) */
        var p0 = (L.escenas || [])[0], mg = p0 && p0.tipo === 'portada' && /^pe_g3d_(.+)_\d+$/.exec(p0.id || '');
        if (mg && !p0.anim) {
          var kq = mg[1] + '_queda_frente';
          if (D.anim[kq] && D.img && D.img.dg_frente) { p0.id = 'dg_frente'; p0.anim = kq; p0.fin = 1; }
        }
        var ideas = /__ideas$/.test(L.id || ''), cuenta = {}, ult = null;
        (L.escenas || []).forEach(function (e) {
          if (e.tipo === 'pregunta') { if (ideas && ult) e.id = ult; return; }
          if (esLam(D, e) || e.anim) { ult = e.id; return; }
          var rep = cuenta[e.id]; cuenta[e.id] = (rep || 0) + 1;
          if ((ideas && e.tipo === 'idea') || (rep && /^tutor_/.test(e.id || ''))) {
            /* 19-10-2026 (Fátima: «en secado debe verse el secado»): la escena del paso que nombra la idea («Presecado: …»)
               y su título; antes quedaba el nombre del dibujo de biblioteca («Trenza de tres cabos») sobre otra escena */
            var nom = String(e.texto || '').split(':')[0].trim().toLowerCase(), p = null;
            for (var q = 0; q < pool.length && !p; q++) if (pool[q].t && String(pool[q].t).trim().toLowerCase() === nom) p = pool[q];
            if (!p) p = sig();
            if (p) { e.id = p.id; e.anim = p.anim; if (ideas && p.t) e.t = p.t; }
          }
          ult = e.id;
        });
      });
    });
    return D;
  }
  /* ─── «Clases por tema» (Fátima, 12-10-2026): cuántas clases del cerebro de colorimetría (Clase · …, ids cc_*) entran por
     unidad, en su orden original, en el libro y en el curso (los mismos). Las técnicas de diagramación y del Cerebro no se tocan. ─── */
  /* 19-10-2026 (Fátima: «todo es un paquete completo»): el nivel suma los anteriores (Intermedio = sus clases y las de Principiante) */
  function nivDe(cfg) { var v = cfg && cfg.materia === 'pelu' && cfg.op && cfg.op.nivel; return { 1: 'p', 2: 'pi', 3: 'pia' }[v] || ''; }
  function limDe(cfg) { var v = cfg && cfg.materia === 'pelu' && cfg.op && cfg.op.clases; return v && v !== 'todas' ? +v || 0 : 0; }
  var PA = window.EU_PARTICIONES;
  if (PA && PA.catalogo && !PA.catalogo._clasesPelu) {
    var cat0 = PA.catalogo;
    PA.catalogo = function (cfg) {
      var L = cat0.apply(this, arguments), LIM = limDe(cfg), NIV = nivDe(cfg); if (!LIM && !NIV) return L;
      var n = {}; return L.filter(function (t) {
        if (!/^cc_/.test(t.id)) return true;
        /* Nivel (Fátima, 15-10-2026): el código de cada clase suya, _p principiante · _i intermedio · _a avanzado (tin_p01…) */
        var m = /_([pia])\d+$/.exec(t.id); if (NIV && m && NIV.indexOf(m[1]) < 0) return false;
        if (!LIM) return true; n[t.unidad] = (n[t.unidad] || 0) + 1; return n[t.unidad] <= LIM;
      });
    };
    PA.catalogo._clasesPelu = 1;
  }
  /* ─── Bienvenida (Fátima, 12-10-2026, con sus palabras): primera lección del curso de Peluquería, con su foto
     (referencias/presentacion.jpg) y, si junto a curso/index.html está su vídeo presentacion.mp4, el vídeo encima. ─── */
  var FOTO_PRES = '';
  try { fetch('./referencias/presentacion.jpg').then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) { if (!b) return; var fr = new FileReader(); fr.onload = function () { FOTO_PRES = fr.result; }; fr.readAsDataURL(b); }).catch(function () { }); } catch (e) { }
  var BIENVENIDA = [
    ['Bienvenida a tu curso', 'Este curso es un paso a paso de especialización: vas a obtener los conocimientos de 19 años de experiencia profesional.'],
    ['No es un cursillo genérico', 'No es un cursillo genérico de internet. Son técnicas aplicadas en la realidad, en la vida diaria: todos mis conocimientos.'],
    ['Aprende viendo el maniquí', 'Es la forma más fácil e interactiva de aprender: viendo el maniquí y la animación aprendes a dividir, cómo cortar y cómo practicar en tu casa.'],
    ['Mi recomendación', 'Mi recomendación: ten un maniquí y empieza a practicar con él. Córtale el cabello y saca las líneas, lección por lección.'],
    ['Así vas avanzando', 'Ves el vídeo, ves la animación, practicas y aplicas. Así, corte a corte, aprendes este oficio y te defiendes.']
  ];
  function bienvenida(D) {
    if (!D || !D.modulos || !D.modulos.length) return D;
    var M = D.modulos[0]; if (M.lecciones.some(function (L) { return /__bienvenida$/.test(L.id); })) return D;
    D.img = D.img || {}; if (FOTO_PRES) D.img.presentacion = FOTO_PRES;
    M.lecciones.unshift({ id: M.id + '__bienvenida', t: 'Bienvenida · Presentación', pag: M.pag, video: 1, mp4: 'presentacion.mp4',
      escenas: BIENVENIDA.map(function (b) { return { tipo: 'idea', id: FOTO_PRES ? 'presentacion' : null, t: b[0], texto: b[1], rot: [] }; }) });
    return D;
  }
  var CA = window.EU_CURSO_ANIM;
  if (CA && CA.enriquecer && !CA.enriquecer._premiumPelu) {
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, mat = res && res.C && res.C.cfg && res.C.cfg.materia;
        return mat === 'pelu' ? bienvenida(variedad(R)) : R;
      });
    };
    CA.enriquecer._premiumPelu = 1;
  }

  /* ─── tema del libro de Peluquería (Fátima, 10-10-2026): en libros de 10–200 hojas entran primero las unidades del tema
     elegido, con sus técnicas animadas, resultados y neutralización; las demás siguen detrás (no se quita ninguna) y lo que no
     quepa va al anexo. «Todo» = el orden de siempre. Opción `op.tema` en «Qué fabrico». ─── */
  /* Fátima, 15-10-2026: un bloque por oficio (queratina, hidratación, secado y planchado y permanente, cada uno aparte).
     «quimica» se queda como antes para las configuraciones guardadas. */
  var TEMAS = {
    cortes: [/^pe_u_c_/],
    color: [/^cb_color_/, /^cb_mechas_/, /^cb_quim_decoloracion$/],
    queratina: [/^cb_quera_/, /^cb_cab_derriz$/],
    hidratacion: [/^cb_hidra_/],
    secado: [/^cb_cab_secado$/, /^cb_cab_planchado$/],
    permanente: [/^cb_quim_permanente$/],
    quimica: [/^cb_quera_/, /^cb_quim_/, /^cb_hidra_/, /^cb_cab_/]
  };
  var BASE = /^pe_u_(fund|cab)$/, TEMA = null, SOLO = false;
  /* ─── Niveles del libro y del curso (19-10-2026, Fátima): Principiante = higiene, cabello, secciones y elevación, cortes
     básicos a 0° (cuadrado, redondo, U, V, escalonado), niños y niñas, secado, planchado, hidratación y el tinte; Intermedio = todo
     lo de Principiante más los cortes con elevación (pixie, shag, mariposa…); Avanzado y Profesional = todo. Las clases de su
     cerebro de colorimetría van por su código (_p, _i, _a). En el selector: Principiante (pri), Intermedio (sec), Avanzado (bach),
     o «Nivel de las clases» 1 · 2 · 3. Avanzado: a validar por Fátima. ─── */
  var NIVEL = 0;
  var POR_NIVEL = {
    1: [/^pe_u_(fund|cab|base)$/, /^pe_u_c_(basicos|ninos)$/, /^cb_cab_(secado|planchado)$/, /^cb_hidra_/, /^cb_color_global$/],
    2: [/^pe_u_(fund|cab|base)$/, /^pe_u_c_/, /^cb_cab_(secado|planchado)$/, /^cb_hidra_/, /^cb_color_global$/]
  };
  function nivelDe(cfg) {
    if (!cfg || cfg.materia !== 'pelu') return 0;
    var v = cfg.op && cfg.op.nivel; if (/^[123]$/.test(String(v))) return +v;
    return { pri: 1, sec: 2, bach: 3 }[cfg.nivel] || 0;
  }
  var CU = window.EU_CURRICULO;
  if (CU && CU.unidades && !CU.unidades._temaPelu) {
    var uds0 = CU.unidades;
    CU.unidades = function (mat) {
      var L = uds0.apply(this, arguments);
      /* 18-10-2026 (Fátima: «la decoloración antes de los tintes»): la unidad de decoloración pasa justo antes del primer
         tinte (cb_color_*), en libro y curso; no se quita ninguna unidad */
      if (mat === 'pelu' && L && L.slice) {
        var iD = -1, iC = -1; L.forEach(function (u, i) { if (u.id === 'cb_quim_decoloracion') iD = i; else if (iC < 0 && /^cb_color_/.test(u.id)) iC = i; });
        if (iD > iC && iC >= 0) { L = L.slice(); var uD = L.splice(iD, 1)[0]; L.splice(iC, 0, uD); }
        /* 26-10-2026 (Fátima: «primero el tinte en cabello virgen; el cabello procesado es otra lección»): el retoque de raíz (tinte
           en cabello ya procesado) va justo después del color global (tinte en cabello virgen) */
        var iR = -1, iG = -1; L.forEach(function (u, i) { if (u.id === 'cb_color_raiz') iR = i; else if (u.id === 'cb_color_global') iG = i; });
        if (iR >= 0 && iG > iR) { L = L.slice(); var uR = L.splice(iR, 1)[0]; L.splice(iG, 0, uR); }
      }
      if (mat === 'pelu' && NIVEL && POR_NIVEL[NIVEL] && L && L.filter) L = L.filter(function (u) { return POR_NIVEL[NIVEL].some(function (r) { return r.test(u.id); }); });
      if (mat !== 'pelu' || !TEMA || !TEMAS[TEMA] || !L || !L.slice) return L;
      var es = function (u) { return TEMAS[TEMA].some(function (r) { return r.test(u.id); }); };
      var cab = L.filter(function (u) { return BASE.test(u.id); }).concat(L.filter(function (u) { return !BASE.test(u.id) && es(u); }));
      return SOLO ? cab : cab.concat(L.filter(function (u) { return !BASE.test(u.id) && !es(u); }));   /* «Solo este bloque»: sin las unidades de otros bloques */
    };
    CU.unidades._temaPelu = 1;
    var M = CU.materia && CU.materia('pelu');
    if (M) { M.opciones = (M.opciones || []).filter(function (x) { return x.k !== 'tema'; }); M.opciones.unshift({ k: 'tema', n: 'Tema del libro', tipo: 'chips', def: 'todo', ops: [['todo', 'Todo'], ['cortes', 'Cortes'], ['color', 'Colorimetría'], ['queratina', 'Queratina y alisado'], ['hidratacion', 'Hidratación'], ['secado', 'Secado y planchado'], ['permanente', 'Permanente']] });
      M.opciones = M.opciones.filter(function (x) { return x.k !== 'solo' && x.k !== 'nivel'; });
      M.opciones.splice(1, 0, { k: 'solo', n: 'Solo este bloque (sin clases de otros temas)', tipo: 'chips', def: 'no', ops: [['no', 'No'], ['si', 'Sí']] },
        { k: 'nivel', n: 'Nivel de las clases', tipo: 'chips', def: 'todos', ops: [['todos', 'Todos'], ['1', '1 · Principiante'], ['2', '2 · Intermedio'], ['3', '3 · Avanzado']] });
      M.opciones = M.opciones.filter(function (x) { return x.k !== 'clases' && x.k !== 'anexo'; });
      M.opciones.splice(1, 0, { k: 'clases', n: 'Clases por tema (libro y curso)', tipo: 'chips', def: 'todas', ops: [['todas', 'Todas'], ['5', '5'], ['10', '10'], ['20', '20']] },
        { k: 'anexo', n: 'Anexo con clases de otros temas', tipo: 'chips', def: 'no', ops: [['no', 'No'], ['si', 'Sí']] }); }
  }
  if (!ED.ensamblar._temaPelu) {
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) {
      var prev = TEMA, prevS = SOLO, prevN = NIVEL; TEMA = cfg && cfg.materia === 'pelu' && cfg.op && cfg.op.tema && cfg.op.tema !== 'todo' ? cfg.op.tema : null;
      SOLO = !!(TEMA && cfg.op.solo === 'si');
      NIVEL = nivelDe(cfg);
      /* Principiante/Intermedio/Avanzado del selector general: Peluquería se arma con el temario profesional y el nivel filtra
         unidades y clases (antes «Principiante» daba solo cortes, sin secado ni planchado, y la cabecera decía «Profesional») */
      if (NIVEL && /^(pri|sec|bach)$/.test(cfg.nivel)) cfg = Object.assign({}, cfg, { nivel: 'fp', curso: 0 });
      if (NIVEL) cfg = Object.assign({}, cfg, { op: Object.assign({}, cfg.op, { nivel: String(NIVEL) }) });
      var args = [cfg].concat([].slice.call(arguments, 1));
      try { return ens.apply(this, args); } finally { TEMA = prev; SOLO = prevS; NIVEL = prevN; }
    };
    ED.ensamblar._temaPelu = 1;
  }

  window.EU_PELU_PREMIUM = { PAL: PAL, ORO: ORO, activo: activo, variedad: variedad, bienvenida: bienvenida, TEMAS: TEMAS };
})();
