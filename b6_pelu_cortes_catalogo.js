/* b6_pelu_cortes_catalogo.js — catálogo grande de cortes de dama, viejos y nuevos (window.EU_CATALOGO_CORTES).
   Pedido de Fátima: «hay millones de cortes… es agregar, porque el motor ya hace todo». Cada corte es un PREAJUSTE de
   datos para EU_DIAGRAMA.libre() (capas de la nuca hacia arriba con su elevación 0–225°, frente, partición, línea de
   atrás, guía del frente, acabado, emparejar delante/atrás, coronilla). Un corte madre tiene ramas (corto, medio, largo,
   en punta, redondo, desfilado…). Todas las elevaciones son PROPUESTAS («a validar por Fátima», validar: true): se cambian
   capa a capa en «Crear mi corte» y se guardan como corte propio. No se mezcla con EU_GEOMETRIA_CAPILAR.TECNICAS (el libro
   no se llena con estas propuestas). No repite los nombres del catálogo de Fátima (EU_CORTES). */
(function () {
  'use strict';
  if (window.EU_CATALOGO_CORTES) return;

  function v(n, g) { var a = []; for (var i = 0; i < n; i++) a.push(g); return a; }
  var FAMILIAS = [
    { id: 'largo1', n: 'Un solo largo' },
    { id: 'hongo', n: 'Hongo y casco' },
    { id: 'graduado', n: 'Graduados' },
    { id: 'escalonado', n: 'Escalonados' },
    { id: 'moda', n: 'Mariposa y capas de moda' },
    { id: 'corto', n: 'Cortos' },
    { id: 'flequillo', n: 'Flequillos' },
    { id: 'rizo', n: 'Rizos y ondas' },
    { id: 'asim', n: 'Asimétricos y desconectados' }
  ];
  /* ramas habituales: largo del corte = altura de la guía del frente */
  var R3 = [['corto', { altura: 'labio' }], ['medio', { altura: 'barbilla' }], ['largo', { altura: 'cuello' }]];
  var PUNTA = ['en punta', { linea: 'v' }], REDONDO = ['redondo', { linea: 'redondeada', emparejar: 'atras' }],
    DESF = ['desfilado', { acabado: 'desgrafilado' }], RECTO = ['recto', { linea: 'recta', lineaFrente: 'recta' }];

  /* corte madre: [id, nombre, familia, preajuste, ramas, texto] */
  var MADRES = [
    /* un solo largo */
    ['melena_recta', 'Melena recta', 'largo1', { capas: v(5, 0), linea: 'recta', lineaFrente: 'recta' }, R3.concat([PUNTA]), 'Todo el cabello a 0°: un solo largo con la línea recta.'],
    ['bob_invertido', 'Bob invertido', 'largo1', { capas: [0, 0, 15, 30, 45], linea: 'a' }, R3, 'Más corto atrás y más largo delante: la nuca sube y el frente baja.'],
    ['bob_capas', 'Bob en capas', 'largo1', { capas: [0, 0, 45, 90, 90], linea: 'recta' }, R3.concat([DESF]), 'Perímetro de bob a 0° y capas por dentro para quitar peso.'],
    ['paje', 'Corte paje', 'largo1', { capas: v(5, 0), linea: 'redondeada', lineaFrente: 'recta', emparejar: 'atras', altura: 'cejas' }, [['clásico', {}], ['largo', { altura: 'barbilla' }]], 'Un solo largo con las puntas hacia dentro y flequillo recto.'],
    ['cleopatra', 'Corte Cleopatra', 'largo1', { capas: v(5, 0), linea: 'recta', lineaFrente: 'recta', altura: 'cejas' }, [['medio', {}], ['largo', { altura: 'cuello' }]], 'Recto y pesado, con flequillo recto a la altura de las cejas.'],
    ['corte_u', 'Corte en U', 'largo1', { capas: v(5, 0), linea: 'redondeada' }, R3, 'Un solo largo con la línea de atrás en U.'],
    ['corte_v', 'Corte en V', 'largo1', { capas: v(5, 0), linea: 'v' }, R3, 'Un solo largo con la línea de atrás en V.'],
    ['corte_a', 'Corte en A', 'largo1', { capas: v(5, 0), linea: 'a' }, R3, 'Un solo largo con la línea en A: más corto en el centro de atrás.'],
    ['diagonal_del', 'Corte diagonal hacia delante', 'largo1', { capas: v(5, 0), linea: 'diag_delante' }, R3, 'La línea baja de atrás hacia la cara.'],
    ['diagonal_atr', 'Corte diagonal hacia atrás', 'largo1', { capas: v(5, 0), linea: 'diag_atras' }, R3, 'La línea baja de la cara hacia atrás.'],
    /* hongo y casco */
    ['hongo', 'Hongo', 'hongo', { capas: v(4, 0), linea: 'redondeada', lineaFrente: 'recta', emparejar: 'atras', altura: 'cejas' }, [['clásico', {}], ['largo', { altura: 'ojo' }], ['moderno', { capas: [0, 0, 45, 90] }], ['desfilado', { acabado: 'desgrafilado' }]], 'Todo alrededor a 0°: se empareja delante con atrás y sale la forma redonda de hongo.'],
    ['hongo_capas', 'Hongo en capas', 'hongo', { capas: [0, 45, 90, 90], linea: 'redondeada', emparejar: 'atras', altura: 'cejas' }, [['corto', {}], ['medio', { altura: 'nariz' }]], 'Forma de hongo con capas por dentro para que no quede pesado.'],
    ['hongo_asim', 'Hongo asimétrico', 'hongo', { capas: v(4, 0), linea: 'diag_delante', emparejar: 'atras', altura: 'ojo' }, [['corto', {}], ['largo', { altura: 'labio' }]], 'Hongo con un lado más largo que el otro.'],
    ['casco', 'Corte casco', 'hongo', { capas: [0, 30, 45, 45], linea: 'redondeada', emparejar: 'atras', altura: 'ojo' }, [['corto', {}], ['medio', { altura: 'nariz' }]], 'Forma de casco que sigue la cabeza.'],
    /* graduados */
    ['graduado', 'Graduado clásico', 'graduado', { capas: [0, 15, 30, 45, 45], linea: 'recta' }, R3, 'Peso abajo y graduación que sube poco a poco.'],
    ['apilado', 'Bob apilado', 'graduado', { capas: [0, 30, 45, 60, 90], linea: 'a' }, [['corto', { altura: 'labio' }], ['medio', { altura: 'barbilla' }]], 'Nuca graduada y apilada, volumen atrás.'],
    ['cuna', 'Corte en cuña', 'graduado', { capas: [0, 45, 45, 45, 90], linea: 'recta', altura: 'nariz' }, [['corto', {}], ['medio', { altura: 'barbilla' }]], 'Graduación a 45° que forma una cuña en la nuca.'],
    ['grad_invertida', 'Graduación invertida', 'graduado', { capas: [0, 0, 15, 30, 45], linea: 'diag_delante' }, R3, 'La graduación se lleva hacia la cara.'],
    ['media_melena_grad', 'Media melena graduada', 'graduado', { capas: [0, 15, 30, 45], linea: 'redondeada', altura: 'barbilla' }, [['medio', {}], ['larga', { altura: 'cuello' }]], 'Media melena con peso abajo y graduación suave.'],
    /* escalonados */
    ['escalonado', 'Escalonado clásico', 'escalonado', { capas: [0, 45, 90, 135, 180], linea: 'recta' }, R3.concat([PUNTA, REDONDO, DESF]), 'Las capas suben de la nuca a la coronilla: cada capa más corta que la de abajo.'],
    ['escalonado_suave', 'Escalonado suave', 'escalonado', { capas: [0, 15, 30, 45, 90], linea: 'recta' }, R3, 'Escalón poco marcado: mantiene el largo.'],
    ['escalonado_marcado', 'Escalonado marcado', 'escalonado', { capas: [0, 90, 135, 180, 200], linea: 'recta' }, R3.concat([DESF]), 'Escalón muy marcado: mucho movimiento arriba.'],
    ['capas_invertidas', 'Capas invertidas', 'escalonado', { capas: [0, 0, 45, 90, 135], linea: 'redondeada' }, R3, 'Largo abajo y capas que nacen arriba.'],
    ['capas_invisibles', 'Capas invisibles', 'escalonado', { capas: [0, 0, 0, 45, 90], linea: 'recta' }, R3, 'Capas escondidas por dentro: quitan peso sin que se vean.'],
    ['cascada', 'Capas en cascada', 'escalonado', { capas: [0, 45, 90, 135, 180, 200], linea: 'v' }, R3, 'Capas que caen una sobre otra como una cascada.'],
    ['volumen_coronilla', 'Capas con volumen en la coronilla', 'escalonado', { capas: [0, 45, 90, 180, 220], linea: 'recta', coronilla: true }, R3, 'Capas cortas en la coronilla para dar volumen.'],
    /* mariposa y capas de moda */
    ['mariposa', 'Mariposa', 'moda', { capas: [0, 45, 90, 135, 180], frente: [0, 45, 90, 90, 90], acabado: 'desgrafilado', altura: 'labio' }, [['corta', { altura: 'barbilla' }], ['media', {}], ['larga', { altura: 'cuello' }], ['en punta', { linea: 'v', altura: 'cuello' }], ['redonda', { linea: 'redondeada' }]], 'Capas largas por fuera y capas cortas arriba que enmarcan el rostro como alas.'],
    ['shag_r', 'Shag', 'moda', { capas: [45, 90, 135, 180], frente: [0, 45, 90], acabado: 'desgrafilado', coronilla: true }, [['corto', { altura: 'nariz' }], ['largo', { altura: 'cuello' }]], 'Mucha capa arriba y puntas abiertas.'],
    ['wolf_r', 'Wolf cut', 'moda', { capas: [45, 90, 135, 180, 180], frente: [0, 45, 90], acabado: 'desgrafilado' }, [['corto', { altura: 'barbilla' }], ['largo', { altura: 'cuello' }]], 'Volumen arriba como el shag y largo atrás como el mullet.'],
    ['octopus', 'Octopus', 'moda', { capas: [0, 0, 135, 180, 200], acabado: 'desgrafilado', coronilla: true }, R3, 'Capas cortas arriba y mechones largos abajo, como tentáculos.'],
    ['medusa', 'Medusa (jellyfish)', 'moda', { capas: [0, 0, 0, 90, 90], linea: 'recta', lineaFrente: 'recta' }, [['medio', { altura: 'barbilla' }], ['largo', { altura: 'cuello' }]], 'Una capa corta arriba en forma de campana y el largo de abajo recto.'],
    ['hime', 'Hime', 'moda', { capas: v(5, 0), frente: [0, 0, 0], linea: 'recta', lineaFrente: 'recta', altura: 'barbilla' }, [['clásico', {}], ['largo', { altura: 'cuello' }]], 'Largo recto con los lados de la cara cortados rectos a la altura de la mejilla.'],
    ['hush', 'Hush cut', 'moda', { capas: [0, 45, 90, 135], frente: [0, 45, 90], acabado: 'desgrafilado' }, R3, 'Capas suaves y desfiladas que enmarcan el rostro.'],
    ['mullet', 'Mullet moderno', 'moda', { capas: [0, 0, 90, 180, 180], frente: [45, 90, 90], acabado: 'desgrafilado' }, [['corto', { altura: 'nariz' }], ['largo', { altura: 'cuello' }]], 'Corto arriba y delante, largo atrás.'],
    ['lob_capas', 'Long bob en capas', 'moda', { capas: [0, 0, 45, 90, 135], linea: 'recta' }, [['recto', {}], DESF], 'Long bob con capas por dentro.'],
    /* cortos */
    ['pixie_largo', 'Pixie largo', 'corto', { capas: [45, 90, 90, 135], frente: [0, 45, 90], acabado: 'desgrafilado', altura: 'ojo' }, [['clásico', {}], ['con flequillo largo', { altura: 'nariz' }]], 'Pixie con más largo arriba y en el flequillo.'],
    ['pixie_asim', 'Pixie asimétrico', 'corto', { capas: [45, 90, 135, 180], linea: 'diag_delante', acabado: 'desgrafilado', altura: 'ojo' }, [['clásico', {}], ['largo', { altura: 'nariz' }]], 'Pixie con un lado más largo.'],
    ['corto_capas', 'Corto en capas', 'corto', { capas: [45, 90, 90, 90, 135], altura: 'ojo' }, [['clásico', {}], DESF], 'Corte corto con capas uniformes.'],
    ['corto_nuca', 'Corto con nuca graduada', 'corto', { capas: [0, 45, 90, 90], linea: 'a', altura: 'ojo' }, [['clásico', {}], ['redondo', { linea: 'redondeada', emparejar: 'atras' }]], 'Corto con la nuca graduada y pegada.'],
    ['frances_corto', 'Francés corto', 'corto', { capas: [0, 15, 45, 90], lineaFrente: 'recta', altura: 'cejas' }, [['clásico', {}], ['desfilado', { acabado: 'desgrafilado' }]], 'Corto, con flequillo y aire desenfadado.'],
    /* flequillos (solo el frente; atrás se respeta el largo) */
    ['fleq_abierto', 'Flequillo abierto', 'flequillo', { capas: v(3, 0), frente: [0, 30, 45], altura: 'cejas' }, [['corto', {}], ['largo', { altura: 'ojo' }]], 'Flequillo que se abre al centro.'],
    ['fleq_lateral', 'Flequillo lateral', 'flequillo', { capas: v(3, 0), frente: [0, 0, 45], lineaFrente: 'recta', altura: 'ojo' }, [['corto', { altura: 'cejas' }], ['largo', {}]], 'Flequillo peinado a un lado.'],
    ['fleq_micro', 'Flequillo micro', 'flequillo', { capas: v(3, 0), frente: [0, 0, 0], lineaFrente: 'recta', altura: 'cejas' }, [['recto', {}], ['desfilado', { acabado: 'desgrafilado' }]], 'Flequillo muy corto, por encima de las cejas.'],
    ['fleq_v', 'Flequillo en V', 'flequillo', { capas: v(3, 0), frente: [0, 45, 90], altura: 'ojo' }, [['clásico', {}]], 'Flequillo más corto en el centro y más largo a los lados.'],
    /* rizos y ondas */
    ['rizo_capas', 'Capas para rizos', 'rizo', { capas: [0, 45, 90, 135], acabado: 'desgrafilado' }, R3, 'Capas para que el rizo no forme triángulo.'],
    ['rizo_redondo', 'Redondo para rizos', 'rizo', { capas: v(5, 90), linea: 'redondeada', emparejar: 'atras' }, R3, 'Todas las capas a 90°: forma redonda.'],
    ['ondas_largas', 'Capas largas para ondas', 'rizo', { capas: [0, 0, 45, 90, 135], linea: 'v' }, R3, 'Capas largas que dejan caer la onda.'],
    /* asimétricos y desconectados */
    ['asim_largo', 'Asimétrico largo', 'asim', { capas: v(5, 0), linea: 'diag_delante', lineaFrente: 'recta' }, R3, 'Un lado más largo que el otro.'],
    ['desconectado', 'Desconectado', 'asim', { capas: [0, 0, 180, 200, 220], acabado: 'desgrafilado' }, R3, 'La parte de arriba no se une con la de abajo: dos largos distintos.']
  ];

  var LISTA = [];
  MADRES.forEach(function (m) {
    m[4].forEach(function (r) {
      var o = {}, b = m[3], k;
      for (k in b) o[k] = Array.isArray(b[k]) ? b[k].slice() : b[k];
      for (k in r[1]) o[k] = Array.isArray(r[1][k]) ? r[1][k].slice() : r[1][k];
      if (!o.part) o.part = 'vertical';
      if (!o.acabado) o.acabado = 'recto';
      if (!o.altura) o.altura = 'barbilla';
      o.id = m[0] + '__' + r[0].replace(/\s+/g, '_');
      o.n = m[1] + ' · ' + r[0];
      o.madre = m[1]; o.rama = r[0]; o.fam = m[2];
      o.texto = 'Forma de cortar · ' + o.n + '. ' + m[5] + ' Elevaciones propuestas: a validar por Fátima.';
      o.validar = true;
      LISTA.push(o);
    });
  });

  function lista() { return LISTA.slice(); }
  function corte(id) { return LISTA.filter(function (c) { return c.id === id; })[0] || null; }
  function familia(id) { return FAMILIAS.filter(function (f) { return f.id === id; })[0] || { n: id }; }
  /* añadir más cortes madre sin tocar este archivo: registrar([[id, nombre, familia, preajuste, ramas, texto], …]) */
  function registrar(madres) { (madres || []).forEach(function (m) { MADRES.push(m); m[4].forEach(function (r) { var o = JSON.parse(JSON.stringify(m[3])); for (var k in r[1]) o[k] = r[1][k]; o.part = o.part || 'vertical'; o.acabado = o.acabado || 'recto'; o.altura = o.altura || 'barbilla'; o.id = m[0] + '__' + r[0].replace(/\s+/g, '_'); o.n = m[1] + ' · ' + r[0]; o.madre = m[1]; o.rama = r[0]; o.fam = m[2]; o.texto = 'Forma de cortar · ' + o.n + '. ' + (m[5] || '') + ' Elevaciones propuestas: a validar por Fátima.'; o.validar = true; LISTA.push(o); }); }); }

  window.EU_CATALOGO_CORTES = { FAMILIAS: FAMILIAS, lista: lista, corte: corte, familia: familia, registrar: registrar };
})();
