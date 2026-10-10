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
          visto[e.anim] = 1; pool.push({ id: e.id, anim: e.anim, pri: pri });
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
          if (D.anim[kq] && D.img && D.img.dg_frente) { p0.id = 'dg_frente'; p0.anim = kq; }
        }
        var ideas = /__ideas$/.test(L.id || ''), cuenta = {}, ult = null;
        (L.escenas || []).forEach(function (e) {
          if (e.tipo === 'pregunta') { if (ideas && ult) e.id = ult; return; }
          if (esLam(D, e) || e.anim) { ult = e.id; return; }
          var rep = cuenta[e.id]; cuenta[e.id] = (rep || 0) + 1;
          if ((ideas && e.tipo === 'idea') || (rep && /^tutor_/.test(e.id || ''))) {
            var p = sig(); if (p) { e.id = p.id; e.anim = p.anim; }
          }
          ult = e.id;
        });
      });
    });
    return D;
  }
  var CA = window.EU_CURSO_ANIM;
  if (CA && CA.enriquecer && !CA.enriquecer._premiumPelu) {
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, mat = res && res.C && res.C.cfg && res.C.cfg.materia;
        return mat === 'pelu' ? variedad(R) : R;
      });
    };
    CA.enriquecer._premiumPelu = 1;
  }

  window.EU_PELU_PREMIUM = { PAL: PAL, ORO: ORO, activo: activo, variedad: variedad };
})();
