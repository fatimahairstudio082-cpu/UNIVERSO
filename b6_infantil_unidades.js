/* b6_infantil_unidades.js — once unidades más para «Infantil» (antes solo había cuatro). Reutilizan los
   dibujos de EU_INFANTIL.FIG agrupados por tema nuevo (colores, contar, cielo, mar, jardín, fiesta,
   tamaños, estaciones, viaje, cuidar animales y opuestos) con ideas y preguntas propias, y añaden el
   generador «inf_juegos» (vocales, última letra, sumas y restas hasta 10, cuál es más grande) con
   varias redacciones. Cargar después de b6_cerebro_infantil.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, INF = window.EU_INFANTIL; if (!ED || !INF || window.EU_INFANTIL_UNIDADES) return;
  var H = ED.H, FIG = INF.FIG;
  var BANDAS = ['inf', 'pri1', 'pri2', 'pri3', 'sec', 'bach', 'fp', 'adu'];
  function pal(id) { return FIG[id] ? FIG[id][1] : id; }
  var TAM = { oso: 5, casa: 6, barco: 5, cohete: 6, arbol: 6, coche: 4, gato: 3, pez: 2, pajaro: 2, caracol: 1, mariposa: 1, manzana: 1, uva: 1, flor: 2, tortuga: 2, globo: 2, helado: 1 };

  var G = {
    inf_juegos: function (u, C, r) {
      var figs = (u.figs || ['sol']).filter(function (k) { return FIG[k]; }), w = pal(H.pick(r, figs)), t = Math.floor(r() * 5);
      if (t === 0) { var v = Array.from(w).filter(function (c) { return /[aeiouáéíóú]/.test(c); }).length; return H.it('corta', H.pick(r, ['¿Cuántas vocales tiene «' + w + '»?', 'Cuenta las vocales de «' + w + '».', 'Rodea las vocales de «' + w + '». ¿Cuántas hay?']), String(v), { ac: [v] }); }
      if (t === 1) { var l = w.charAt(w.length - 1); return H.it('corta', H.pick(r, ['¿Con qué letra termina «' + w + '»?', '¿Cuál es la última letra de «' + w + '»?']), l, { ac: [l, l.toUpperCase()] }); }
      if (t === 2) { var a = 1 + Math.floor(r() * 5), b = 1 + Math.floor(r() * 4); return H.it('corta', H.pick(r, ['Hay ' + a + ' dibujos de «' + w + '» y llegan ' + b + ' más. ¿Cuántos hay ahora?', 'Dibuja ' + a + ' y luego ' + b + ' más. ¿Cuántos dibujaste?', 'Juntamos ' + a + ' y ' + b + '. ¿Cuántos son?']), String(a + b), { ac: [a + b], x: a + ' + ' + b + ' = ' + (a + b) }); }
      if (t === 3) { var c = 4 + Math.floor(r() * 6), d = 1 + Math.floor(r() * 3); return H.it('corta', H.pick(r, ['Tenía ' + c + ' y se van ' + d + '. ¿Cuántos quedan?', 'De ' + c + ' tachamos ' + d + '. ¿Cuántos quedan sin tachar?']), String(c - d), { ac: [c - d], x: c + ' − ' + d + ' = ' + (c - d) }); }
      var ps = figs.filter(function (k) { return TAM[k]; }); if (ps.length < 2) ps = ['oso', 'caracol'];
      var x = H.pick(r, ps), y = H.pick(r, ps.filter(function (k) { return k !== x && TAM[k] !== TAM[x]; }).concat(TAM[x] > 1 ? ['caracol'] : ['oso']));
      var g = TAM[x] >= TAM[y] ? x : y;
      return H.it('corta', H.pick(r, ['¿Qué es más grande: ' + pal(x) + ' o ' + pal(y) + '?', 'Rodea el más grande: ' + pal(x) + ' o ' + pal(y) + '.']), pal(g), { ac: [pal(g)] });
    }
  };

  var T = [
    ['colores', 'Los colores', ['sol', 'manzana', 'uva', 'nube', 'flor', 'globo'], ['El sol es amarillo y la manzana puede ser roja o verde.', 'Mezclando azul y amarillo sale el verde.', 'Las uvas pueden ser verdes o moradas.'], ['¿De qué color es tu fruta favorita?', 'Colorea un globo de tu color preferido.']],
    ['contar', 'Contamos hasta diez', ['estrella', 'globo', 'pez', 'manzana', 'uva'], ['Contamos con los dedos: uno, dos, tres…', 'Diez es el doble de cinco.', 'Si contamos despacio no nos saltamos ninguno.'], ['¿Cuántos dedos tienes en una mano?', 'Dibuja cinco estrellas y cuéntalas.']],
    ['cielo', 'El cielo de día y de noche', ['sol', 'luna', 'estrella', 'nube', 'cohete'], ['De día el sol ilumina el cielo.', 'Por la noche salen la luna y las estrellas.', 'Las nubes traen la lluvia.'], ['¿Qué ves en el cielo por la mañana?', 'Dibuja el cielo de noche.']],
    ['mar', 'El mar', ['pez', 'barco', 'tortuga', 'caracol'], ['En el mar viven peces y tortugas.', 'Los barcos flotan sobre el agua.', 'El agua del mar es salada.'], ['¿Qué animal del mar te gusta más?', 'Dibuja un barco con su vela.']],
    ['jardin', 'El jardín', ['flor', 'mariposa', 'caracol', 'arbol', 'pajaro'], ['En el jardín crecen flores y árboles.', 'Las mariposas vuelan de flor en flor.', 'El caracol lleva su casa a cuestas.'], ['¿Qué animal vive en el jardín?', 'Dibuja una flor con cinco pétalos.']],
    ['fiesta', 'La fiesta', ['globo', 'helado', 'manzana', 'uva', 'casa'], ['En la fiesta hay globos de colores.', 'Compartimos la merienda con los amigos.', 'Después recogemos todo entre todos.'], ['¿Qué llevarías a una fiesta?', 'Dibuja tres globos de colores distintos.']],
    ['tamanos', 'Grande y pequeño', ['oso', 'gato', 'pez', 'caracol', 'mariposa'], ['El oso es grande y el caracol es pequeño.', 'Un gato es más grande que un pez.', 'Podemos ordenar las cosas de pequeño a grande.'], ['¿Qué animal es el más grande?', 'Dibuja algo pequeño y algo grande.']],
    ['estaciones', 'Las estaciones', ['sol', 'nube', 'arbol', 'flor', 'helado', 'iglu'], ['En primavera salen las flores.', 'En verano hace calor y apetece un helado.', 'En otoño caen las hojas y en invierno hace frío.'], ['¿Cuál es tu estación favorita?', 'Dibuja un árbol en otoño.']],
    ['viaje', 'Nos vamos de viaje', ['coche', 'barco', 'cohete', 'casa'], ['Para viajar preparamos la maleta.', 'En el coche llevamos siempre el cinturón puesto.', 'Al volver a casa contamos lo que vimos.'], ['¿Adónde te gustaría viajar?', '¿Qué pondrías en tu maleta?']],
    ['cuidar', 'Cuido a los animales', ['gato', 'pez', 'pajaro', 'tortuga', 'oso'], ['Las mascotas necesitan agua, comida y cariño.', 'El pez vive en una pecera con agua limpia.', 'A los animales salvajes los miramos sin molestarlos.'], ['¿Cómo cuidarías a un gato?', '¿Qué come una tortuga?']],
    ['opuestos', 'Arriba y abajo', ['cohete', 'pajaro', 'pez', 'caracol', 'nube', 'arbol'], ['El pájaro vuela arriba y el caracol va por el suelo.', 'El cohete sube muy alto.', 'El pez nada bajo el agua.'], ['¿Qué está arriba en el cielo?', 'Dibuja algo arriba y algo abajo.']]
  ];
  var U = T.map(function (a) {
    var figs = a[2].filter(function (k) { return FIG[k]; });
    return { m: 'infantil', id: 'inf2_' + a[0], b: BANDAS, t: a[1], figs: figs, i: a[3], k: figs.map(pal), q: a[4], g: 'inf_juegos', f: { t: 'mapa', c: a[1], r: figs.slice(0, 5).map(pal) }, plus: true };
  });
  ED.registrar({ unidades: U, generadores: G });
  window.EU_INFANTIL_UNIDADES = { U: U, GEN: G };
})();
