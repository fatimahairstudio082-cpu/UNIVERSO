window.__SECC = function () {
  var DG = window.EU_DIAGRAMA;
  return DG.construirConYa(function (K) {
    var v = 'nuca', NU = K.NUCA, ORO = '#B08D57', TIN = '#1F1B18', AZ = '#2F6FD0';
    function L(a, b, t, c, w) { return K.lineas(K.tramos(v, K.recta(a, b), 50), t, c || AZ, w || 3.2); }
    function curva(f, t, c, w) { return K.lineas(K.tramos(v, f, 80), t, c || AZ, w || 3.2); }
    function raya() { return K.lineas(K.tramos(v, function (u) { return [NU, 0.04 + u * 2.0]; }, 40), [0.02, 0.14], TIN, 3.4); }
    function flechas(t0) { var tr = []; [-0.55, -0.25, 0.25, 0.55].forEach(function (d, j) { tr = tr.concat(K.lineas(K.tramos(v, K.recta([NU + d, 1.35], [NU + d, 1.95]), 20), [t0 + j * 0.03, t0 + 0.12 + j * 0.03], '#FFFFFF', 3, { fl: 1 })); }); return tr; }
    var TH = [0.6, 0.9, 1.2, 1.5, 1.8], D = 1.15, esc = [];
    function mk(id, t, gen) {
      var tr = raya(); TH.forEach(function (th, i) { var t0 = 0.16 + i * 0.1; tr = tr.concat(gen(th, [t0, t0 + 0.12], i)); });
      tr = tr.concat(flechas(0.72));
      esc.push({ tipo: id, vista: v, t: t, texto: t, a: { v: v, tr: tr } });
    }
    mk('s_vinv', 'V invertida', function (th, t) { return L([NU, th - 0.1], [NU - D, th + 0.3], t).concat(L([NU, th - 0.1], [NU + D, th + 0.3], t)); });
    mk('s_curvo', 'Curvo', function (th, t) { return curva(function (u) { var d = -D + 2 * D * u; return [NU + d, th + 0.1 - 0.62 * (d / D) * (d / D)]; }, t); });
    mk('s_punta', 'En punta', function (th, t) { return L([NU - D, th - 0.3], [NU, th + 0.15], t).concat(L([NU + D, th - 0.3], [NU, th + 0.15], t)); });
    mk('s_horiz', 'Horizontal', function (th, t) { return curva(function (u) { var d = -D + 2 * D * u; return [NU + d, th - 0.16 * (d / D) * (d / D)]; }, t); });
    (function () { var tr = raya(); [-0.95, -0.7, -0.45, -0.2, 0.2, 0.45, 0.7, 0.95].forEach(function (d, i) { var t0 = 0.16 + i * 0.06; tr = tr.concat(L([NU + d * 0.5, 0.12], [NU + d * 1.05, 2.05], [t0, t0 + 0.12])); }); tr = tr.concat(flechas(0.72)); esc.push({ tipo: 's_vert', vista: v, t: 'Vertical', texto: 'Vertical', a: { v: v, tr: tr } }); })();
    return { escenas: esc };
  });
};
