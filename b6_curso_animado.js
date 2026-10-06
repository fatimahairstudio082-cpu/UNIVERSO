/* b6_curso_animado.js — animaciones del «🎓 Curso premium» (window.EU_CURSO_ANIM).
   Para cada lección de corte (pasos de Guías 3D, pe_g3d_<corte>_<k>) añade antes una lección
   «Diagramación · <corte>» hecha con el motor de diagramación (b6_pelu_diagrama.js): seccionado, línea guía
   en la nuca, capas de abajo arriba, lateral y frente, cada escena animada y sincronizada con la voz, más
   preguntas de repaso que también pasan al test del módulo.
   El curso premium la llama en dos puntos (enriquecer antes de las imágenes y js() para curso/anim.js).
   Si no hay cortes, no añade nada y el curso sale como antes. Cargar después de b6_curso_premium.js. */
(function () {
  'use strict';
  if (window.EU_CURSO_ANIM) return;

  function corteDe(L) {
    var id = null;
    (L.escenas || []).some(function (e) { var m = /^pe_g3d_(.+)_\d+$/.exec(e.id || ''); if (m) { id = m[1]; return true; } return false; });
    return id && window.EU_CORTES && window.EU_CORTES.get(id) ? id : null;
  }

  /* ─── lámina-concepto: el motor de láminas (LAMINAS_MOTOR) anima un esquema de la unidad al abrir «Ideas clave» ─── */
  var LAM_SRC = null;
  function cargarLaminas() {
    if (LAM_SRC !== null || !window.LAMINAS_MOTOR || !window.fetch) return Promise.resolve();
    var el = document.querySelector('script[src*="b6_laminas_motor.js"]'), src = el ? el.getAttribute('src') : './b6_laminas_motor.js';
    return fetch(src).then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) { LAM_SRC = /LAMINAS_MOTOR/.test(t) ? t : ''; }).catch(function () { LAM_SRC = ''; });
  }
  function laminas(D, res) {
    var LM = window.LAMINAS_MOTOR; if (!LM || !LAM_SRC) return;
    var est = (LM.porFamilia('mapa') || []).map(function (e) { return e.id; }), pals = (LM.paletas() || []).filter(function (p) { return p.claro; });
    var pal = pals.filter(function (p) { return p.id === 'cuadricula'; })[0] || pals[0], modos = ['aparecer', 'dibujar'], n = 0;
    D.modulos.forEach(function (M) {
      var u = (res.unidades || []).filter(function (x) { return x.id === M.id; })[0]; if (!u) return;
      var L = M.lecciones.filter(function (x) { return /__ideas$/.test(x.id); })[0]; if (!L || !L.escenas.length) return;
      var claves = (u.k || []).map(String).filter(Boolean).slice(0, 6);
      if (claves.length < 2) claves = (u.i || []).map(function (t) { t = String(t); return t.length > 42 ? t.slice(0, 40) + '…' : t; }).slice(0, 5);
      if (claves.length < 2) return;
      var k = 'lam_' + M.id; D.anim = D.anim || {};
      D.anim[k] = { lam: { titulo: M.t, subtitulo: 'Ideas clave', estructura: est.length ? est[n % est.length] : 'radial', paleta: pal && pal.id, nodos: [{ t: M.t, d: '', nivel: 0 }].concat(claves.map(function (c) { return { t: c, d: '', nivel: 1 }; })) }, modo: modos[n % modos.length] };
      L.escenas.unshift({ tipo: 'paso', id: L.escenas[0].id, t: 'Mapa de la unidad', texto: 'Mapa de la unidad: ' + M.t + '. ' + claves.join(', ') + '.', rot: [], anim: k });
      n++;
    });
  }
  /* reproductor de la lámina en el curso (sin dependencias: el motor va copiado tal cual en anim.js) */
  function pintaLam(x, A, bx, by, bw, bh, p) {
    var LM = window.LAMINAS_MOTOR; if (!LM) return false;
    var W = 1600, H = Math.round(1600 * bh / bw), c = pintaLam.c || (pintaLam.c = document.createElement('canvas'));
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    var o = c.getContext('2d'); o.clearRect(0, 0, W, H);
    LM.pintar(o, W, H, A.lam, { prog: p, modo: A.modo });
    x.drawImage(c, bx, by, bw, bh); return true;
  }

  function enriquecer(D, res, aviso) {
    return cargarLaminas().then(function () { laminas(D, res); return diagramas(D, res, aviso); });
  }
  function diagramas(D, res, aviso) {
    var DG = window.EU_DIAGRAMA; if (!DG) return Promise.resolve(D);
    var tareas = [];
    D.modulos.forEach(function (M) { M.lecciones.forEach(function (L) { var c = corteDe(L); if (c) tareas.push({ M: M, L: L, c: c }); }); });
    /* técnicas de geometría capilar y cortes guardados que el libro lleva (páginas pe_diagrama): una lección al final de su módulo */
    var LD = window.EU_PELU_LIBRO_DG;
    if (LD && LD.receta) (res.pages || []).forEach(function (p, j) {
      if (p.tipo !== 'pe_diagrama' || !p.dg || p.dg.k === 'corte' || !p.u) return;
      var M = D.modulos.filter(function (x) { return x.id === p.u.id; })[0], R = M && LD.receta(p.dg); if (!R || !M.lecciones.length) return;
      tareas.push({ M: M, L: { id: M.id + '__tec' + j, pag: p.num }, c: R, k: 'tec' + j, fin: p.dg.k === 'var' ? 'Variante · ' : 'Técnica · ' });
    });
    if (!tareas.length) return Promise.resolve(D);
    var hechos = {}, i = 0;
    return new Promise(function (ok) {
      (function sig() {
        if (i >= tareas.length) return ok(D);
        var T = tareas[i++];
        if (aviso) aviso('Curso premium: diagramación ' + i + ' de ' + tareas.length + '…');
        DG.construir(T.c).then(function (E) {
          if (!E || hechos[T.L.id]) return;
          hechos[T.L.id] = 1;
          D.anim = D.anim || {};
          Object.keys(E.fondos).forEach(function (v) { D.img['dg_' + v] = E.fondos[v]; });
          var esc = E.escenas.map(function (e) {
            var k = (T.k || T.c) + '_' + e.tipo; D.anim[k] = e.anim;
            return { tipo: 'paso', id: 'dg_' + e.vista, t: e.t, texto: e.texto, rot: [], anim: k };
          });
          var ult = esc[esc.length - 1].id;
          E.preguntas.forEach(function (q) {
            esc.push({ tipo: 'pregunta', id: ult, t: 'Repaso', texto: 'Antes de seguir, piensa: ' + q.e, rot: [], q: { e: q.e, o: q.o, c: q.c }, sol: 'La respuesta es: ' + q.o[q.c] + '.' + (q.x ? ' ' + q.x : '') });
            if (!T.M.test.some(function (x) { return x.e === q.e; })) T.M.test.push({ e: q.e, o: q.o, c: q.c });
          });
          var pos = T.fin ? T.M.lecciones.length : T.M.lecciones.indexOf(T.L);
          T.M.lecciones.splice(pos, 0, { id: T.L.id + '__diag', t: (T.fin || 'Diagramación · ') + E.R.n, pag: T.L.pag, video: 1, escenas: esc });
        }).catch(function (er) { console.warn('Diagramación', T.c, er); }).then(function () { setTimeout(sig, 0); });
      })();
    });
  }

  /* anim.js del curso: motor de láminas (copia tal cual) + reproductor de diagramación + reparto por tipo de escena */
  function js() {
    var DG = window.EU_DIAGRAMA, partes = [];
    /* el motor de láminas toma la mezcla de colores del motor de folletos; en el curso descargado no está:
       se pone solo esa función (si falta, el texto de las cajas salía del mismo color que la caja) */
    if (LAM_SRC && window.EU_EJ_ANIM && EU_EJ_ANIM.shim) partes.push(EU_EJ_ANIM.shim(), LAM_SRC);   /* mezcla, transparencias y temas (b6_ejemplos_animados.js) */
    else if (LAM_SRC) partes.push('if(!window.FOLLETO_MOTOR)window.FOLLETO_MOTOR={mezclar:function(a,b,t){function h(c){c=String(c||"#000").replace("#","");if(c.length===3)c=c.replace(/./g,"$&$&");return[0,2,4].map(function(i){return parseInt(c.substr(i,2),16)||0;});}var x=h(a),y=h(b);return"#"+x.map(function(v,i){return("0"+Math.round(v+(y[i]-v)*t).toString(16)).slice(-2);}).join("");}};', LAM_SRC);
    partes.push('(function(){var dg=' + (DG ? DG.pinta.toString() : 'function(){return false;}') + ';var lam=' + pintaLam.toString() +
      ';window.CURSO_ANIM={pinta:function(x,A,im,bx,by,bw,bh,p){return A&&A.lam?lam(x,A,bx,by,bw,bh,p):dg(x,A,im,bx,by,bw,bh,p);}};})();');
    return partes.join('\n');
  }

  window.EU_CURSO_ANIM = { enriquecer: enriquecer, js: js };
})();
