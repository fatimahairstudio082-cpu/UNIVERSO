/* b6_infantil_interactivo.js — «🧸 Libro interactivo» del Editorial para Infantil (window.EU_INF_LIBRO).
   Salida nueva (EU_CONECTORES.salidas) que solo aparece con materia Infantil o productos de colorear/caligrafía/pasatiempos.
   Descarga UN archivo HTML sin servidor: 24 animales en 4 capítulos (sabana, selva, granja, bosque y frío),
   4 cuentos animados (personajes que se mueven entre escenas, noche y lluvia, voz con palabra resaltada, pregunta final +5)
   y 24 adivinanzas de tres pistas (silueta en la tercera; +5/+3/+2 según las pistas usadas).
   Por animal: Aprende (retrato, voz, ficha-esquema, escena de la biblioteca if_* con su texto y «por qué»),
   Colorea (toca una zona → se pinta, paleta de 14 colores, +5), Escribe (caligrafía con el dedo en la Playwrite del país, +5)
   y Pregunta rápida (+2). Estrellas por capítulo. Juegos finales: une nombre y dibujo, memoria, ¿quién es? (voz)
   y arrastra a su hábitat (+10 la primera vez). Medalla y diploma con su nombre, imprimible. Progreso en localStorage.
   Los retratos salen de EU_INF_K (b6_lib_infantil.js) en 'color' y 'linea'; espera a EU_CARGA_LIBS si aún no están. */
(function () {
  'use strict';
  if (window.EU_INF_LIBRO) return;

  /* id, nombre, palabra para escribir, dibujo (a = cuadrúpedo, v = ave), hábitat, come, cómo hace, bebé, tamaño 1–5, dato, modelo de la biblioteca */
  var ANI = [
    ['leon', 'El león', 'león', 'a', 'sab', 'Carne', 'Ruge: ¡grrr!', 'Cachorro', 4, 'Duerme hasta 20 horas al día.', 'if_leon'],
    ['jirafa', 'La jirafa', 'jirafa', 'jirafa', 'sab', 'Hojas de acacia', 'Casi no hace ruido', 'Cría', 5, 'Es el animal más alto del mundo.', 'if_jirafa'],
    ['elefante', 'El elefante', 'elefante', 'a', 'sab', 'Hierba, frutas y cortezas', 'Barrita con la trompa', 'Cría', 5, 'Bebe agua con la trompa.', 'if_elefante'],
    ['cebra', 'La cebra', 'cebra', 'a', 'sab', 'Hierba', 'Relincha y ladra', 'Potrillo', 3, 'No hay dos cebras con las mismas rayas.', 'if_cebra'],
    ['hipo', 'El hipopótamo', 'hipopótamo', 'a', 'sab', 'Hierba, de noche', 'Gruñe y resopla', 'Cría', 5, 'Pasa casi todo el día dentro del agua.', 'if_hipo'],
    ['mono', 'El mono', 'mono', 'a', 'sel', 'Frutas, hojas e insectos', 'Chilla: ¡uh, uh, ah!', 'Cría', 2, 'Usa la cola para colgarse de las ramas.', 'if_mono'],
    ['tigre', 'El tigre', 'tigre', 'a', 'sel', 'Carne', 'Ruge muy fuerte', 'Cachorro', 4, 'Es el gato más grande y le gusta nadar.', 'if_tigre'],
    ['loro', 'El loro', 'loro', 'v', 'sel', 'Semillas y frutas', 'Imita palabras', 'Polluelo', 1, 'Puede vivir más de 50 años.', 'if_loro'],
    ['tucan', 'El tucán', 'tucán', 'v', 'sel', 'Frutas', 'Croa como una rana', 'Polluelo', 1, 'Su pico es enorme, pero muy ligero.', 'if_tucan'],
    ['rana', 'La rana', 'rana', 'rana', 'sel', 'Insectos', '¡Croac, croac!', 'Renacuajo', 1, 'Atrapa los insectos con la lengua.', 'if_rana'],
    ['vaca', 'La vaca', 'vaca', 'a', 'gra', 'Hierba', '¡Muuu!', 'Ternero', 4, 'Con su leche se hacen queso y yogur.', 'if_vaca'],
    ['cerdo', 'El cerdo', 'cerdo', 'a', 'gra', 'De todo un poco', '¡Oinc, oinc!', 'Lechón', 3, 'Se revuelca en el barro para refrescarse.', 'if_cerdo'],
    ['oveja', 'La oveja', 'oveja', 'a', 'gra', 'Hierba', '¡Beee!', 'Cordero', 3, 'Con su lana se teje ropa abrigada.', 'if_oveja'],
    ['gallina', 'La gallina', 'gallina', 'v', 'gra', 'Granos y semillas', '¡Cocoroco!', 'Pollito', 1, 'Calienta sus huevos sentándose encima.', 'if_gallina'],
    ['pato', 'El pato', 'pato', 'v', 'gra', 'Plantas y bichitos del agua', '¡Cuac, cuac!', 'Patito', 1, 'Sus patas son como aletas para nadar.', 'if_patitos'],
    ['conejo', 'El conejo', 'conejo', 'a', 'gra', 'Hierba y verduras', 'Casi no hace ruido', 'Gazapo', 1, 'Sus dientes no paran de crecer.', 'if_conejo'],
    ['perro', 'El perro', 'perro', 'a', 'gra', 'Pienso y carne', '¡Guau, guau!', 'Cachorro', 2, 'Huele muchísimo mejor que nosotros.', 'if_mascotas'],
    ['gato', 'El gato', 'gato', 'a', 'gra', 'Pienso y pescado', '¡Miau!', 'Gatito', 2, 'Ronronea cuando está contento.', ''],
    ['oso', 'El oso', 'oso', 'a', 'bos', 'Miel, frutas y peces', 'Gruñe', 'Osezno', 4, 'Duerme casi todo el invierno.', 'if_oso'],
    ['zorro', 'El zorro', 'zorro', 'a', 'bos', 'Ratones y frutas', 'Ladra y aúlla', 'Cachorro', 2, 'Oye a los ratones bajo la nieve.', 'if_zorro'],
    ['ardilla', 'La ardilla', 'ardilla', 'a', 'bos', 'Bellotas y nueces', 'Chilla', 'Cría', 1, 'Esconde comida para el invierno.', 'if_ardilla'],
    ['erizo', 'El erizo', 'erizo', 'a', 'bos', 'Insectos y caracoles', 'Resopla', 'Cría', 1, 'Se hace una bola si tiene miedo.', 'if_erizo'],
    ['buho', 'El búho', 'búho', 'v', 'bos', 'Ratones', '¡Uh, uh!', 'Polluelo', 1, 'Ve muy bien en la oscuridad.', 'if_buho'],
    ['pinguino', 'El pingüino', 'pingüino', 'v', 'bos', 'Peces', 'Grazna', 'Polluelo', 2, 'No vuela, pero nada muy rápido.', 'if_frio']
  ];
  var HAB = {
    sab: { n: 'La sabana', c: '#E8892E', txt: 'Hace calor, crece mucha hierba y hay pocos árboles. Aquí viven animales muy grandes.' },
    sel: { n: 'La selva', c: '#3E9150', txt: 'Llueve mucho y hace calor. Hay tantos árboles que casi no llega la luz al suelo.' },
    gra: { n: 'La granja', c: '#D9534A', txt: 'Viven animales que nos dan leche, huevos y lana. El granjero los cuida cada día.' },
    bos: { n: 'El bosque y el frío', c: '#3F7FBF', txt: 'Árboles altos y mucho frío en invierno. Más lejos, en el hielo, viven animales que no temen la nieve.' }
  };
  /* adivinanzas: tres pistas, de la más difícil a la más fácil */
  var ADIV = {
    leon: ['Tengo una gran melena alrededor de la cara.', 'Vivo en la sabana y duermo muchas horas.', 'Cuando rujo, todos me oyen: ¡grrr!'],
    jirafa: ['Soy muy, muy alta.', 'Tengo manchas por todo el cuerpo.', 'Mi cuello es tan largo que como las hojas de los árboles altos.'],
    elefante: ['Soy enorme y pesado.', 'Tengo orejas grandes como abanicos.', 'Con mi trompa bebo agua.'],
    cebra: ['Me parezco a un caballo.', 'Vivo en la sabana con mi manada.', 'Voy vestida con rayas blancas y negras.'],
    hipo: ['Soy grande y redondo.', 'Paso el día dentro del río.', 'Abro una boca enorme y salgo de noche a comer hierba.'],
    mono: ['Me encanta trepar.', 'Me cuelgo de las ramas con la cola.', 'Mi comida favorita es el plátano.'],
    tigre: ['Soy un gato muy, muy grande.', 'Me gusta nadar.', 'Soy naranja con rayas negras.'],
    loro: ['Tengo plumas de muchos colores.', 'Mi pico es curvo y fuerte.', 'Si me hablas, repito lo que dices.'],
    tucan: ['Vivo en la selva y como frutas.', 'Mis plumas son negras.', 'Mi pico es enorme y de colores.'],
    rana: ['De pequeña nadaba con cola.', 'Salto muy alto.', 'Atrapo moscas con la lengua y digo ¡croac!'],
    vaca: ['Vivo en la granja y como hierba.', 'Tengo manchas.', 'Te doy leche y digo ¡muuu!'],
    cerdo: ['Soy rosado.', 'Me gusta revolcarme en el barro.', 'Mi nariz es redonda y digo ¡oinc!'],
    oveja: ['Vivo en la granja.', 'Mi abrigo es de lana.', 'Digo ¡beee!'],
    gallina: ['Tengo plumas y una cresta roja.', 'Me siento sobre mis huevos para darles calor.', 'De mis huevos salen pollitos.'],
    pato: ['Tengo plumas y nado en el estanque.', 'Mis patas son como aletas.', 'Digo ¡cuac, cuac!'],
    conejo: ['Me muevo dando saltos.', 'Mis orejas son muy largas.', 'Me encantan las zanahorias.'],
    perro: ['Soy el mejor amigo de las personas.', 'Muevo la cola cuando estoy contento.', 'Digo ¡guau, guau!'],
    gato: ['Tengo bigotes y me lavo con la lengua.', 'Ronroneo cuando me acarician.', 'Digo ¡miau!'],
    oso: ['Soy grande y peludo.', 'Duermo casi todo el invierno en mi cueva.', 'Me encanta la miel.'],
    zorro: ['Tengo orejas puntiagudas.', 'Mi cola es larga y peluda.', 'Soy naranja y vivo en el bosque.'],
    ardilla: ['Vivo en los árboles.', 'Tengo una cola grande y esponjosa.', 'Guardo bellotas para el invierno.'],
    erizo: ['Soy pequeño y salgo de noche.', 'Si tengo miedo me hago una bola.', 'Mi espalda está llena de púas.'],
    buho: ['Tengo los ojos muy grandes.', 'Duermo de día y vuelo de noche.', 'Digo ¡uh, uh!'],
    pinguino: ['Soy un pájaro, pero no vuelo.', 'Nado muy rápido en el agua fría.', 'Camino balanceándome con mi traje blanco y negro.']
  };
  /* cuentos: escenas con fondo, personajes [x %, suelo %, ancho %, animación] y texto */
  var CUENTOS = [
    { id: 'jirafa', t: 'La jirafa que veía lejos', hab: 'sab', esc: [
      { c: { jirafa: [50, 90, 30, 'bob'] }, t: 'En la sabana vivía Jacinta, una jirafa tan alta que veía más lejos que nadie.' },
      { c: { jirafa: [32, 90, 30, 'bob'], cebra: [70, 92, 24, 'shake'] }, t: 'Una mañana, la cebra Rita no encontraba a su hermanito. —¡Se ha perdido entre la hierba alta! —lloraba.' },
      { c: { jirafa: [44, 90, 32, 'stretch'], cebra: [74, 92, 22, 'bob'] }, t: 'Jacinta estiró su largo cuello y miró, miró y miró por encima de los árboles.' },
      { c: { jirafa: [26, 90, 28, 'bob'], cebra: [50, 92, 20, 'bob'], elefante: [80, 92, 30, 'walk'] }, t: '—¡Allí está, junto al río, con el elefante Tomás! —gritó Jacinta.' },
      { c: { jirafa: [20, 90, 26, 'walk'], cebra: [44, 92, 20, 'walk'], elefante: [76, 92, 30, 'bob'] }, t: 'Todos fueron juntos hasta el río. El hermanito de Rita estaba bebiendo agua, tan tranquilo.' },
      { c: { jirafa: [18, 90, 26, 'jump'], cebra: [40, 92, 19, 'jump'], elefante: [64, 92, 26, 'jump'], leon: [86, 92, 22, 'bob'] }, t: 'Esa noche, el león Bruno dijo: —Cada uno es bueno en algo. ¡Jacinta, tú nos cuidas desde arriba!' }],
      q: ['¿Por qué Jacinta encontró al hermanito de Rita?', ['Porque veía lejos con su cuello largo', 'Porque corría muy rápido', 'Porque oía muy bien']] },
    { id: 'tucan', t: 'El tucán y la tormenta', hab: 'sel', esc: [
      { c: { tucan: [50, 60, 20, 'fly'] }, t: 'En la selva, el tucán Teo tenía el pico más grande y colorido de todos.' },
      { c: { tucan: [30, 60, 18, 'fly'], mono: [70, 92, 24, 'jump'] }, t: '—Tu pico es demasiado grande —se reía el mono Chito—. ¡Parece un plátano!' },
      { lluvia: 1, c: { tucan: [22, 58, 17, 'shake'], mono: [72, 92, 22, 'shake'] }, t: 'De pronto empezó una tormenta. Las gotas caían tan fuerte que nadie veía el camino.' },
      { lluvia: 1, c: { tucan: [22, 58, 17, 'bob'], mono: [82, 92, 20, 'shake'], rana: [52, 94, 14, 'shake'] }, t: 'La rana Lola estaba atrapada en una hoja que flotaba en un charco enorme.' },
      { c: { tucan: [46, 74, 18, 'fly'], mono: [82, 92, 20, 'bob'], rana: [50, 70, 12, 'bob'] }, t: 'Teo voló, la agarró con cuidado con su gran pico y la llevó a una rama seca.' },
      { c: { tucan: [30, 60, 18, 'fly'], mono: [70, 92, 22, 'jump'], rana: [48, 94, 13, 'jump'], loro: [86, 50, 14, 'fly'] }, t: '—¡Gracias, Teo! —dijo Chito—. Tu pico no es raro: ¡es perfecto para ayudar!' }],
      q: ['¿Con qué ayudó Teo a la rana?', ['Con su pico', 'Con su cola', 'Con sus patas']] },
    { id: 'gallina', t: 'Los huevos de Clotilde', hab: 'gra', esc: [
      { c: { gallina: [50, 92, 22, 'bob'] }, t: 'En la granja, la gallina Clotilde cuidaba tres huevos blancos en su nido.' },
      { c: { gallina: [40, 92, 22, 'shake'], vaca: [76, 92, 28, 'bob'] }, t: '—Tengo que ir a beber agua —dijo—. ¿Quién cuida mis huevos?' },
      { c: { gallina: [26, 92, 20, 'bob'], vaca: [84, 92, 24, 'bob'], cerdo: [56, 94, 24, 'shake'] }, t: '—¡Yo no puedo, estoy en el barro! —dijo el cerdo Pancho.' },
      { c: { gallina: [12, 92, 18, 'walk'], cerdo: [84, 94, 20, 'bob'], perro: [52, 94, 24, 'bob'] }, t: '—Yo los cuido —dijo el perro Lucas, y se tumbó junto al nido sin moverse.' },
      { c: { perro: [70, 94, 24, 'bob'], pollito: [40, 94, 10, 'jump'], pollito2: [50, 94, 10, 'jump'], pollito3: [30, 94, 10, 'jump'] }, t: 'Crac, crac, crac… ¡Los huevos se rompieron y salieron tres pollitos!' },
      { c: { gallina: [50, 92, 22, 'jump'], perro: [76, 94, 24, 'jump'], pollito: [30, 94, 10, 'bob'], pollito2: [20, 94, 10, 'bob'], pollito3: [38, 94, 10, 'bob'] }, t: 'Clotilde volvió corriendo y abrazó a Lucas con sus alas. ¡Qué buen amigo!' }],
      q: ['¿Quién cuidó los huevos de Clotilde?', ['El perro Lucas', 'El cerdo Pancho', 'La vaca']] },
    { id: 'oso', t: 'El oso que no tenía sueño', hab: 'bos', esc: [
      { c: { oso: [50, 92, 28, 'bob'] }, t: 'Llegó el invierno al bosque y todos los osos se fueron a dormir. Todos, menos Bartolo.' },
      { c: { oso: [34, 92, 26, 'bob'], ardilla: [72, 92, 18, 'jump'] }, t: '—¿Me cuentas un cuento? —le pidió a la ardilla Nina. Pero Nina guardaba bellotas y no tenía tiempo.' },
      { c: { oso: [30, 92, 26, 'bob'], erizo: [70, 94, 16, 'sleep'] }, t: 'El erizo Pinchito ya estaba hecho una bola, dormido bajo las hojas.' },
      { noche: 1, c: { oso: [34, 92, 26, 'bob'], buho: [70, 52, 16, 'fly'] }, t: 'Entonces llegó la noche y apareció la búho Olga, que de noche está muy despierta.' },
      { noche: 1, c: { oso: [40, 92, 26, 'bob'], buho: [62, 66, 15, 'bob'] }, t: 'Olga le cantó una canción muy suave: «Uh, uh, a dormir, osito, uh, uh…»' },
      { noche: 1, c: { oso: [50, 92, 26, 'sleep'], buho: [80, 50, 13, 'bob'] }, t: 'Bartolo bostezó, se acurrucó en su cueva y durmió hasta la primavera.' }],
      q: ['¿Quién ayudó a Bartolo a dormirse?', ['La búho Olga', 'La ardilla Nina', 'El erizo Pinchito']] }
  ];
  function fondo(h) {
    var MO = window.EU_MODELOS, IK = window.EU_INF_K, K = MO.Kit('color', 'f' + h + '_'), b = '';
    var cielo = { sab: '#FCE3B0', sel: '#CFEFD8', gra: '#D6ECFA', bos: '#DDEAF5' }[h];
    try {
      b += '<rect x="0" y="0" width="200" height="112" fill="' + cielo + '"/>';
      if (h === 'sab') b += IK.sol(K, 170, 22, 10) + IK.prado(K, 88) + IK.acacia(K, 32, 88, 40, 22) + IK.acacia(K, 150, 88, 30, 16) + IK.matas(K, [[80, 88], [104, 88], [186, 88]]);
      if (h === 'sel') b += IK.prado(K, 92) + IK.arbol(K, 14, 92, 86, 26, '#4FA05A') + IK.arbol(K, 186, 92, 80, 26, '#4FA05A') + IK.arbol(K, 100, 92, 60, 22, '#6DB862') + IK.matas(K, [[40, 92], [60, 92], [140, 92], [160, 92]], '#3E8A48');
      if (h === 'gra') b += IK.sol(K, 30, 20, 9) + IK.nube(K, 120, 18, 1) + IK.prado(K, 90) + IK.granero(K, 150, 90, 44, 46) + IK.valla(K, 0, 146, 90, 14);
      if (h === 'bos') b += IK.nube(K, 60, 20, 1) + IK.prado(K, 92) + IK.arbol(K, 18, 92, 76, 22, '#3E7A4A') + IK.arbol(K, 182, 92, 82, 24, '#3E7A4A') + IK.arbol(K, 150, 92, 56, 18, '#5C9A5E') + K.e(110, 92, 26, 16, '#8A7462', { w: .8 }) + K.e(110, 94, 14, 10, '#4A3A30', { sin: 1 });
    } catch (e) { console.warn('fondo', h, e); }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 112" preserveAspectRatio="xMidYMax slice">' + K.defs() + b + '</svg>';
  }
  var INTRO_GATO = ['El gato vive en casa con nosotros. Es ágil, limpio y le encanta dormir al sol.', 'El gato se lava con la lengua: es áspera como un cepillo.'];
  var PLAY = { es: 'Playwrite ES', mx: 'Playwrite MX', co: 'Playwrite CO', ar: 'Playwrite AR', cl: 'Playwrite CL', ve: 'Playwrite CO', do: 'Playwrite MX', us: 'Playwrite US Trad' };

  function slug(s) { return String(s || 'libro').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'libro'; }
  function txt(s) { return String(s == null ? '' : s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  function esperaLibs() {
    return new Promise(function (ok) {
      var listo = function () { return window.EU_INF_K && window.EU_MODELOS && window.EU_MODELOS.modelo('if_pez'); };
      if (listo()) return ok();
      if (window.EU_CARGA_LIBS) window.EU_CARGA_LIBS();
      var n = 0; (function t() { if (listo() || ++n > 200) return ok(); setTimeout(t, 200); })();
    });
  }
  function retrato(a, modo) {
    var MO = window.EU_MODELOS, IK = window.EU_INF_K, K = MO.Kit(modo, 'r' + a.id + (modo === 'linea' ? 'l' : 'c') + '_'), b = '';
    try {
      if (a.k === 'jirafa') b = IK.jirafa(K, 100, 140, 1);
      else if (a.k === 'rana') b = IK.rana(K, 100, 140, 2);
      else if (a.k === 'v') b = IK.ave(K, a.id, 100, 140, 3);
      else b = IK.animal(K, a.id, 100, 140, 2.4);
    } catch (e) { console.warn('retrato', a.id, e); }
    return K.defs() + b;
  }
  function caja(body) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('style', 'position:fixed;left:-9999px;top:0;width:400px;height:400px');
    s.innerHTML = '<g>' + body + '</g>'; document.body.appendChild(s);
    var vb = '0 0 200 150';
    try { var bb = s.firstChild.getBBox(); if (bb.width > 0) { var p = Math.max(bb.width, bb.height) * 0.07; vb = [bb.x - p, bb.y - p, bb.width + 2 * p, bb.height + 2 * p].map(function (v) { return Math.round(v * 10) / 10; }).join(' '); } } catch (e) { }
    s.remove(); return vb;
  }
  function svgDe(body, vb, id) { return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '"' + (vb === '0 0 200 150' ? ' data-fit="' + id + '"' : '') + ' preserveAspectRatio="xMidYMid meet">' + body + '</svg>'; }

  function datos(res, cfg) {
    var C = (res && res.C) || {}, T = C.T || {}, MO = window.EU_MODELOS;
    var animales = ANI.map(function (r) {
      var a = { id: r[0], n: r[1], corto: r[2], k: r[3], hab: r[4], come: r[5], hace: r[6], bebe: r[7], tam: r[8], dato: r[9] };
      var col = retrato(a, 'color'), lin = retrato(a, 'linea'), vb = caja(col), m = r[10] && MO.modelo(r[10]);
      a.color = svgDe(col, vb, a.id); a.linea = svgDe(lin, vb, a.id);
      a.escena = m ? MO.svg(r[10], 'color') : '';
      a.intro = m ? txt(m.intro) : INTRO_GATO[0];
      a.porque = m ? txt(m.porque) : INTRO_GATO[1];
      return a;
    });
    var pais = String((cfg && cfg.pais) || C.pais || 'es').toLowerCase();
    return {
      titulo: txt(C.titulo) || 'Mis amigos los animales', sub: txt(C.sub || C.curso || '') || 'Aprendo, coloreo, escribo y juego',
      autor: txt(C.autor || ''), centro: txt(C.centro || ''), acc: T.acc || '#C2477A',
      fuente: PLAY[pais] || PLAY.es, clave: slug(C.titulo || 'animales'), habitats: HAB, animales: animales,
      adiv: ADIV, cuentos: CUENTOS, fondos: { sab: fondo('sab'), sel: fondo('sel'), gra: fondo('gra'), bos: fondo('bos') },
      extra: { pollito: (function () { var c = retrato({ id: 'pollito', k: 'v' }, 'color'); return svgDe(c, caja(c), 'pollito'); })() }
    };
  }

  /* ─────────── la app (se escribe tal cual en el HTML) ─────────── */
  var CSS = [
    ':root{--acc:__ACC__;--ink:#2A2420;--mute:#6B5E52;--bg:#FFF8EC;--soft:#F1E3C8;--ok:#2F8A4E;--no:#C8423A}',
    '*{box-sizing:border-box}html,body{margin:0}body{background:var(--bg);color:var(--ink);font:500 17px/1.5 Nunito,system-ui,sans-serif;-webkit-tap-highlight-color:transparent}',
    'h1,h2,h3,.f{font-family:Fredoka,Nunito,sans-serif;font-weight:600;line-height:1.12;margin:0;text-wrap:balance}p{margin:0;text-wrap:pretty}',
    'button,input{font:inherit;color:inherit}button{cursor:pointer;border:0;background:none;padding:0}button:focus-visible,input:focus-visible{outline:3px solid var(--acc);outline-offset:3px}',
    'svg{display:block;width:100%;height:100%}',
    '.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:10px;padding:10px 18px;background:rgba(255,248,236,.95);backdrop-filter:blur(8px);box-shadow:0 2px 0 var(--soft)}',
    '.top .tt{flex:1;min-width:0;font-family:Fredoka;font-weight:600;font-size:19px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.nav{display:flex;gap:6px}.nav button{min-height:44px;padding:8px 14px;border-radius:999px;font-family:Fredoka;font-weight:600;font-size:15px}.nav button:hover{background:var(--soft)}',
    '.pts{display:flex;align-items:center;gap:6px;background:#FFD866;border-radius:999px;padding:7px 15px;font-family:Fredoka;font-weight:700;font-size:19px;box-shadow:0 3px 0 #E5B53A}.pts.pop{animation:pop .5s}',
    '@keyframes pop{40%{transform:scale(1.25)}}',
    '.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:52px;padding:10px 24px;border-radius:999px;background:var(--acc);color:#fff;font-family:Fredoka;font-weight:600;font-size:19px;box-shadow:0 5px 0 rgba(0,0,0,.2);transition:transform .1s,box-shadow .1s}',
    '.btn:hover{filter:brightness(1.06)}.btn:active{transform:translateY(4px);box-shadow:0 1px 0 rgba(0,0,0,.2)}.btn.sec{background:#fff;color:var(--ink);box-shadow:0 5px 0 var(--soft)}',
    '.wrap{max-width:1100px;margin:0 auto;padding:26px 18px 90px}.row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}',
    '.card{background:#fff;border-radius:26px;padding:16px;box-shadow:0 6px 0 var(--soft)}',
    '.kick{font-family:Fredoka;font-weight:600;font-size:14px;letter-spacing:.12em;text-transform:uppercase;color:var(--acc)}',
    '.hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:28px;align-items:center;margin-bottom:40px}',
    '.hero h1{font-size:clamp(38px,6vw,64px);margin:8px 0 10px}.hero p{font-size:20px;color:var(--mute);margin-bottom:20px}',
    '.collage{position:relative;aspect-ratio:1;background:#FFE9C2;border-radius:50%}.collage>div{position:absolute;width:52%;aspect-ratio:1;background:#fff;border-radius:50%;padding:7%;box-shadow:0 8px 0 rgba(0,0,0,.08)}',
    '.nom{display:grid;gap:6px;max-width:380px;margin-bottom:18px;font-family:Fredoka;font-weight:600}.nom input{min-height:54px;border:3px solid var(--soft);border-radius:18px;padding:8px 16px;font-size:20px;background:#fff}',
    '.grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}',
    '.hcard{text-align:left;display:grid;gap:10px;padding:0;overflow:hidden;transition:transform .15s}.hcard:hover{transform:translateY(-4px)}',
    '.hcard .band{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;padding:16px 14px 8px}.hcard .band>div{aspect-ratio:1;background:#fff;border-radius:50%;padding:12%}',
    '.hcard .bd{padding:4px 18px 18px}.hcard h3{font-size:24px}',
    '.stars{display:inline-flex;gap:2px;font-size:24px;line-height:1}.st{color:#E2D6C0}.st.on{color:#FFC21A;text-shadow:0 2px 0 #D99A00}',
    '.pasos{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:14px}.pasos .card{display:grid;gap:4px}.pasos b{font-family:Fredoka;font-size:20px}',
    '.hhead{border-radius:30px;padding:26px 28px;color:#fff;display:grid;gap:8px;margin-bottom:24px}.hhead h1{font-size:clamp(32px,5vw,48px)}.hhead p{font-size:19px;max-width:640px}',
    '.acard{display:grid;gap:8px;text-align:center;transition:transform .15s}.acard:hover{transform:translateY(-4px)}.acard .im{aspect-ratio:1;padding:8%}.acard b{font-family:Fredoka;font-size:21px;font-weight:600}',
    '.tk{display:flex;justify-content:center;gap:6px}.tk span{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#F4ECDD;font-size:16px;filter:grayscale(1);opacity:.55}.tk span.on{background:#D8F2DF;filter:none;opacity:1}',
    '.miga{display:flex;gap:8px;align-items:center;flex-wrap:wrap;color:var(--mute);font-weight:700;margin-bottom:14px}.miga button{color:var(--acc);font-weight:800}',
    '.tabs{display:flex;gap:8px;flex-wrap:wrap;margin:16px 0 22px}.tabs button{min-height:50px;padding:8px 18px;border-radius:999px;background:#fff;font-family:Fredoka;font-weight:600;font-size:17px;box-shadow:0 4px 0 var(--soft);display:flex;gap:8px;align-items:center}',
    '.tabs button.on{background:var(--ink);color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.25)}.tabs i{font-style:normal;width:26px;height:26px;border-radius:50%;background:rgba(127,127,127,.18);display:grid;place-items:center;font-size:14px}.tabs button.done i{background:var(--ok);color:#fff}',
    '.dos{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:26px;align-items:start}',
    '.big{aspect-ratio:1;background:#fff;border-radius:50%;padding:9%;box-shadow:0 8px 0 var(--soft);position:relative}',
    '.oir{position:absolute;right:4%;bottom:4%;width:64px;height:64px;border-radius:50%;background:var(--acc);color:#fff;font-size:28px;box-shadow:0 5px 0 rgba(0,0,0,.2)}',
    '.ficha{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:16px}.ficha>div{background:#fff;border-radius:20px;padding:12px 14px;box-shadow:0 4px 0 var(--soft);min-width:0}',
    '.ficha small{display:block;font-family:Fredoka;font-weight:600;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--mute)}.ficha b{font-size:18px;font-weight:800;overflow-wrap:anywhere}',
    '.tam{display:flex;gap:4px;margin-top:6px}.tam span{flex:1;height:12px;border-radius:6px;background:#EFE4D0}.tam span.on{background:var(--acc)}',
    '.sabias{margin-top:12px;background:#FFF0B8;border-radius:20px;padding:14px 16px;font-size:18px}.sabias b{font-family:Fredoka}',
    '.escena{margin-top:26px;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:22px;align-items:center}.escena .im{background:#fff;border-radius:26px;padding:10px;box-shadow:0 6px 0 var(--soft)}',
    '.pal{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin:12px 0}.pal button{aspect-ratio:1;border-radius:50%;box-shadow:inset 0 -5px 0 rgba(0,0,0,.18),0 3px 0 var(--soft);transition:transform .12s}',
    '.pal button.on{transform:scale(1.18);outline:4px solid var(--ink);outline-offset:3px}.pal .goma{background:#fff;display:grid;place-items:center;font-size:24px}',
    '.lienzo{background:#fff;border-radius:30px;padding:5%;box-shadow:0 8px 0 var(--soft);aspect-ratio:1;touch-action:manipulation}.lienzo [data-z]{cursor:pointer;transition:fill .2s}.lienzo [data-z]:hover{opacity:.85}',
    '.barra{height:16px;border-radius:8px;background:#EFE4D0;overflow:hidden;margin:8px 0 4px}.barra>div{height:100%;background:var(--ok);border-radius:8px;transition:width .3s}',
    '.cali{position:relative;width:100%;aspect-ratio:10/3;background:#fff;border-radius:26px;box-shadow:0 8px 0 var(--soft);overflow:hidden;touch-action:none}.cali canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.ops{display:grid;gap:12px;margin-top:16px;max-width:620px}.ops button{min-height:62px;text-align:left;padding:12px 20px;border-radius:22px;background:#fff;font-size:19px;font-weight:800;box-shadow:0 5px 0 var(--soft)}',
    '.ops button.ok{background:#D8F2DF;box-shadow:0 5px 0 #9ED3AE}.ops button.no{background:#FBE0DD;animation:sh .4s}@keyframes sh{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}',
    '.pie{display:flex;justify-content:space-between;gap:12px;margin-top:34px;flex-wrap:wrap}',
    '.gcard{display:grid;gap:10px;text-align:left}.gcard .ico{font-size:44px}.gcard h3{font-size:24px}.gcard p{color:var(--mute)}',
    '.une{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px}.une .col{display:grid;gap:12px}',
    '.une .pic{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-content:start;align-self:start}.une .pic button{aspect-ratio:1;background:#fff;border-radius:22px;padding:10%;box-shadow:0 5px 0 var(--soft)}',
    '.une .nom button{min-height:58px;background:#fff;border-radius:999px;font-family:Fredoka;font-weight:600;font-size:21px;box-shadow:0 5px 0 var(--soft)}',
    '.sel{outline:4px solid var(--acc);outline-offset:3px}.hecho{background:#D8F2DF!important;box-shadow:0 5px 0 #9ED3AE!important;pointer-events:none}.malo{animation:sh .4s;background:#FBE0DD!important}',
    '.mem{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;max-width:640px}.mem button{aspect-ratio:1;border-radius:20px;background:var(--acc);box-shadow:0 5px 0 rgba(0,0,0,.2);color:#fff;font-family:Fredoka;font-size:30px;padding:10%}',
    '.mem button.v{background:#fff;color:var(--ink);font-size:clamp(14px,2.4vw,22px)}.mem button.hecho{opacity:.8}',
    '.quien{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;max-width:760px;margin-top:16px}.quien button{aspect-ratio:1;background:#fff;border-radius:26px;padding:10%;box-shadow:0 5px 0 var(--soft)}',
    '.habz{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:16px}.habz>div{min-height:190px;border-radius:24px;padding:10px;color:#fff;display:flex;flex-direction:column;gap:8px}',
    '.habz h3{font-size:18px}.habz .dentro{display:flex;flex-wrap:wrap;gap:6px}.habz .dentro div{width:56px;height:56px;background:#fff;border-radius:50%;padding:6px}',
    '.fichas{display:flex;flex-wrap:wrap;gap:12px;margin-top:16px;min-height:96px}.fichas button{width:90px;height:90px;background:#fff;border-radius:50%;padding:10px;box-shadow:0 5px 0 var(--soft);touch-action:none}',
    '.ghost{position:fixed;z-index:50;width:90px;height:90px;background:#fff;border-radius:50%;padding:10px;pointer-events:none;box-shadow:0 12px 24px rgba(0,0,0,.25);transform:translate(-50%,-50%) scale(1.1)}',
    '#toast{position:fixed;left:50%;top:84px;z-index:60;transform:translate(-50%,-30px);opacity:0;pointer-events:none;transition:all .35s;background:#fff;border-radius:28px;padding:16px 26px;box-shadow:0 12px 34px rgba(0,0,0,.2);text-align:center;font-family:Fredoka;font-weight:600;font-size:20px;min-width:260px}',
    '#toast.on{opacity:1;transform:translate(-50%,0)}#toast .tbig{font-size:46px;color:var(--acc);line-height:1}',
    '.conf{position:absolute;inset:0;pointer-events:none;overflow:visible}.conf i{position:absolute;top:30%;width:10px;height:14px;border-radius:3px;animation:caer 1.6s ease-out forwards}',
    '@keyframes caer{0%{opacity:1;translate:0 0}100%{opacity:0;translate:0 160px}}',
    '.dip{background:#fff;border-radius:8px;padding:48px 56px;box-shadow:0 10px 0 var(--soft);text-align:center;display:grid;gap:14px;border:10px double var(--acc);max-width:900px;margin:0 auto}',
    '.dip h1{font-size:clamp(40px,6vw,64px);color:var(--acc)}.dip .quien2{font-family:"__FONT__",cursive;font-size:clamp(34px,5vw,54px);line-height:1.5;border-bottom:3px solid var(--soft);padding:0 20px}',
    '.medal{width:150px;height:150px;border-radius:50%;margin:6px auto;display:grid;place-items:center;font-family:Fredoka;font-weight:700;font-size:20px;color:#fff;box-shadow:inset 0 -10px 0 rgba(0,0,0,.18),0 6px 0 rgba(0,0,0,.12)}',
    '.firmas{display:grid;grid-template-columns:1fr 1fr;gap:40px;margin-top:26px}.firmas div{border-top:2px solid var(--ink);padding-top:6px;font-size:15px;color:var(--mute)}',
    '.stage{position:relative;aspect-ratio:16/9;width:min(100%,calc(58vh * 16 / 9));margin:0 auto;border-radius:30px;overflow:hidden;box-shadow:0 8px 0 var(--soft);background:#cfe}.stage>.bg{position:absolute;inset:0}',
    '.stage .ch{position:absolute;transform:translate(-50%,-100%);transition:left 1.3s cubic-bezier(.45,.05,.3,1),top 1.3s cubic-bezier(.45,.05,.3,1),width 1.3s,opacity .7s;aspect-ratio:1}',
    '.stage .ch>div{width:100%;height:100%;transform-origin:50% 100%}.stage .ch.off{opacity:0}',
    '.a-bob>div{animation:bob 1.6s ease-in-out infinite}.a-walk>div{animation:walk .55s ease-in-out infinite}.a-jump>div{animation:jump .8s ease-in-out infinite}',
    '.a-fly>div{animation:fly 2.2s ease-in-out infinite}.a-stretch>div{animation:stretch 1.8s ease-in-out infinite}.a-shake>div{animation:wob .5s ease-in-out infinite}.a-sleep>div{animation:sleep 3s ease-in-out infinite}',
    '@keyframes bob{50%{transform:translateY(-3%) scale(1.02,.98)}}@keyframes walk{25%{transform:translateY(-4%) rotate(-3deg)}75%{transform:translateY(-4%) rotate(3deg)}}',
    '@keyframes jump{0%,100%{transform:translateY(0) scale(1.05,.95)}45%{transform:translateY(-22%) scale(.96,1.05)}}@keyframes fly{0%,100%{transform:translate(0,0) rotate(-4deg)}50%{transform:translate(6%,-14%) rotate(4deg)}}',
    '@keyframes stretch{50%{transform:scaleY(1.14)}}@keyframes wob{25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}@keyframes sleep{50%{transform:scale(1.04,.96)}}',
    '.zz{position:absolute;right:-6%;top:-12%;font-family:Fredoka;font-weight:700;color:#3F7FBF;font-size:clamp(14px,2.4vw,26px);animation:zz 2.4s ease-in-out infinite}@keyframes zz{0%{opacity:0;transform:translate(0,10px)}50%{opacity:1}100%{opacity:0;transform:translate(14px,-18px)}}',
    '.noche{position:absolute;inset:0;background:radial-gradient(circle at 82% 16%,#FFF6C8 0 3.5%,transparent 4%),linear-gradient(#1D2A55e6,#2C3E78b3 70%,#2C3E7840);opacity:0;transition:opacity 1.2s;pointer-events:none}.noche.on{opacity:1}',
    '.lluvia{position:absolute;inset:0;opacity:0;transition:opacity .8s;pointer-events:none;background:repeating-linear-gradient(105deg,transparent 0 14px,rgba(80,120,190,.45) 14px 16px);background-size:200% 200%;animation:llueve .5s linear infinite}.lluvia.on{opacity:1}',
    '@keyframes llueve{to{background-position:-40px 120px}}',
    '.sub{width:min(100%,calc(58vh * 16 / 9));margin:16px auto 0;background:#fff;border-radius:24px;padding:18px 22px;box-shadow:0 6px 0 var(--soft);font-size:clamp(19px,2.4vw,25px);font-weight:700;line-height:1.45;min-height:110px}',
    '.sub w{transition:color .15s,background .15s;border-radius:6px}.sub w.on{background:#FFE07A;color:var(--ink)}',
    '.puntos{display:flex;gap:8px;justify-content:center;margin-top:12px}.puntos i{width:12px;height:12px;border-radius:50%;background:#E2D6C0}.puntos i.on{background:var(--acc);transform:scale(1.25)}',
    '.pista{display:flex;gap:12px;align-items:flex-start;background:#fff;border-radius:22px;padding:14px 18px;box-shadow:0 5px 0 var(--soft);font-size:clamp(19px,2.4vw,24px);font-weight:700;animation:entra .4s}',
    '.pista b{flex:none;width:38px;height:38px;border-radius:50%;background:var(--acc);color:#fff;display:grid;place-items:center;font-family:Fredoka}@keyframes entra{from{opacity:0;transform:translateY(10px)}}',
    '.misterio{aspect-ratio:1;border-radius:50%;background:#2A2420;display:grid;place-items:center;color:#FFD24A;font-family:Fredoka;font-size:clamp(70px,12vw,140px);font-weight:700;box-shadow:0 8px 0 var(--soft)}',
    '.misterio.sil svg *{fill:#2A2420!important;stroke:#2A2420!important}.misterio.sil{background:#fff;padding:12%}',
    '.ccard .im{aspect-ratio:16/9;border-radius:20px;overflow:hidden;position:relative}.ccard .im>div{position:absolute}.ccard .im>svg{position:absolute;inset:0}',
    '@media (max-width:760px){.hero,.dos,.escena,.une{grid-template-columns:1fr}.habz{grid-template-columns:repeat(2,minmax(0,1fr))}.nav .tx{display:none}.dip{padding:28px 20px}}',
    '@media print{.top,.noprint,#toast{display:none!important}body{background:#fff}.wrap{padding:0}.dip{box-shadow:none}}'
  ].join('\n');

  var APP = String(function () {
    var L = window.LIBRO, A = L.animales, H = L.habitats, HK = Object.keys(H), KEY = 'eu_inf_' + L.clave, FONT = L.fuente;
    var base = function () { return { nombre: '', pts: 0, hecho: {}, juegos: {}, col: {} }; };
    var S = (function () { try { return Object.assign(base(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { return base(); } })();
    function guarda() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
    var $ = function (s, r) { return (r || document).querySelector(s); }, app = $('#app');
    function es(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
    function porId(id) { for (var i = 0; i < A.length; i++) if (A[i].id === id) return A[i]; }
    function deHab(h) { return A.filter(function (a) { return a.hab === h; }); }
    function mezcla(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    var VOZ = null;
    function voz() { if (!window.speechSynthesis) return null; var v = speechSynthesis.getVoices().filter(function (x) { return /^es/i.test(x.lang); }); return v.filter(function (x) { return /google/i.test(x.name); })[0] || v.filter(function (x) { return /es-ES/i.test(x.lang); })[0] || v[0] || null; }
    if (window.speechSynthesis) speechSynthesis.onvoiceschanged = function () { VOZ = voz(); };
    function di(t) { if (!window.speechSynthesis) return; speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); VOZ = VOZ || voz(); if (VOZ) u.voice = VOZ; u.lang = (VOZ && VOZ.lang) || 'es-ES'; u.rate = 0.9; speechSynthesis.speak(u); }
    function gana(n, msg, clave) {
      if (clave) { if (S.hecho[clave]) return false; S.hecho[clave] = 1; }
      S.pts += n; guarda(); toast('+' + n, msg);
      var p = $('#pts'); if (p) { p.textContent = S.pts; p.parentNode.classList.remove('pop'); void p.offsetWidth; p.parentNode.classList.add('pop'); }
      return true;
    }
    function toast(n, msg) {
      var t = $('#toast'), c = ['#F4A04A', '#E8645A', '#4FA05A', '#4F8FC8', '#FFD24A', '#C8A8E8'], cf = '';
      for (var i = 0; i < 26; i++) cf += '<i style="left:' + (Math.random() * 100) + '%;background:' + c[i % 6] + ';animation-delay:' + (Math.random() * 0.35) + 's;transform:rotate(' + (Math.random() * 360) + 'deg)"></i>';
      t.innerHTML = '<div class="tbig">' + n + ' ⭐</div><div>' + es(msg) + '</div><div class="conf">' + cf + '</div>'; t.className = 'on'; di(msg);
      clearTimeout(toast.t); toast.t = setTimeout(function () { t.className = ''; }, 2800);
    }
    function tareas(a) { return ['col', 'cal', 'q'].map(function (t) { return !!S.hecho[a.id + ':' + t]; }); }
    function estrellas(h) { var l = deHab(h), d = 0; l.forEach(function (a) { tareas(a).forEach(function (x) { if (x) d++; }); }); var f = d / (l.length * 3); return f >= 1 ? 3 : f >= 2 / 3 ? 2 : f >= 1 / 3 ? 1 : 0; }
    function est(n) { var s = ''; for (var i = 0; i < 3; i++) s += '<span class="st' + (i < n ? ' on' : '') + '">★</span>'; return '<span class="stars" aria-label="' + n + ' de 3 estrellas">' + s + '</span>'; }
    function img(a, cl) { return '<div class="' + (cl || '') + '">' + a.color + '</div>'; }

    var V = { v: 'portada' };
    var RUN = 0;
    function ir(v, a, b) { V = { v: v, a: a, b: b }; RUN++; if (window.speechSynthesis) speechSynthesis.cancel(); pinta(); window.scrollTo(0, 0); }
    function top() {
      return '<header class="top"><div class="tt">' + es(L.titulo) + '</div><nav class="nav"><button data-act="ir" data-v="portada">🏠 <span class="tx">Inicio</span></button><button data-act="ir" data-v="cuentos">📚 <span class="tx">Cuentos</span></button><button data-act="ir" data-v="adivinanzas">🧩 <span class="tx">Adivinanzas</span></button><button data-act="ir" data-v="juegos">🎮 <span class="tx">Juegos</span></button><button data-act="ir" data-v="diploma">🏅 <span class="tx">Diploma</span></button></nav><div class="pts">⭐ <span id="pts">' + S.pts + '</span></div></header>';
    }
    function pinta() {
      var h = top() + '<main class="wrap">';
      if (V.v === 'portada') h += portada();
      else if (V.v === 'hab') h += habitat(V.a);
      else if (V.v === 'animal') h += animal(porId(V.a), V.b || 'aprende');
      else if (V.v === 'juegos') h += juegos();
      else if (V.v === 'juego') h += '<div id="juego"></div>';
      else if (V.v === 'diploma') h += diploma();
      else if (V.v === 'cuentos') h += cuentos();
      else if (V.v === 'cuento') h += '<div id="cuento"></div>';
      else if (V.v === 'adivinanzas') h += adivinanzas();
      else if (V.v === 'adivina') h += '<div id="adivina"></div>';
      app.innerHTML = h + '</main>';
      if (V.v === 'animal' && V.b === 'colorea') colorea(porId(V.a));
      if (V.v === 'animal' && V.b === 'escribe') escribe(porId(V.a));
      if (V.v === 'juego') JUEGOS[V.a].ini($('#juego'));
      if (V.v === 'cuento') cuento(V.a, $('#cuento'));
      if (V.v === 'adivina') adivina(+V.a || 0, $('#adivina'));
      var n = $('#nombre'); if (n) n.oninput = function () { S.nombre = n.value; guarda(); };
    }

    function portada() {
      var tres = [A[0], A[13], A[18]], pos = [['4%', '6%'], ['44%', '18%'], ['18%', '46%']];
      var h = '<section class="hero"><div><div class="kick">Libro interactivo</div><h1>' + es(L.titulo) + '</h1><p>' + es(L.sub) + '</p>' +
        '<label class="nom">¿Cómo te llamas?<input id="nombre" value="' + es(S.nombre) + '" placeholder="Escribe tu nombre" autocomplete="off"></label>' +
        '<div class="row"><button class="btn" data-act="ir" data-v="hab" data-a="' + HK[0] + '">Empezar ▶</button><button class="btn sec" data-act="ir" data-v="juegos">🎮 Jugar</button></div></div>' +
        '<div class="collage" aria-hidden="true">' + tres.map(function (a, i) { return '<div style="left:' + pos[i][0] + ';top:' + pos[i][1] + '">' + a.color + '</div>'; }).join('') + '</div></section>';
      h += '<h2 style="font-size:32px;margin-bottom:16px">Elige un lugar</h2><div class="grid">' + HK.map(function (k) {
        var l = deHab(k);
        return '<button class="card hcard" data-act="ir" data-v="hab" data-a="' + k + '"><div class="band" style="background:' + H[k].c + '">' + l.slice(0, 3).map(function (a) { return '<div>' + a.color + '</div>'; }).join('') + '</div>' +
          '<div class="bd"><h3>' + es(H[k].n) + '</h3><div class="row" style="justify-content:space-between;margin-top:4px"><span style="color:var(--mute);font-weight:700">' + l.length + ' animales</span>' + est(estrellas(k)) + '</div></div></button>';
      }).join('') + '</div>';
      h += '<h2 style="font-size:32px;margin:44px 0 16px">Cuentos y adivinanzas</h2><div class="grid">' + L.cuentos.map(function (c) { return tarjetaCuento(c); }).join('') +
        '<button class="card gcard" data-act="ir" data-v="adivinanzas"><span class="ico">🧩</span><h3>Adivinanzas</h3><p>' + A.length + ' animales escondidos. Escucha las pistas y adivina.</p><span class="f" style="color:var(--acc)">' + nAdiv() + ' de ' + A.length + ' adivinadas</span></button></div>';
      h += '<h2 style="font-size:32px;margin:44px 0 0">Así se juega</h2><div class="pasos">' +
        [['📖', 'Aprende', 'Escucha su nombre y descubre cómo vive.'], ['🎨', 'Colorea', 'Elige un color y toca el dibujo. +5 ⭐'], ['✏️', 'Escribe', 'Repasa su nombre con el dedo. +5 ⭐'], ['❓', 'Responde', 'Una pregunta rápida. +2 ⭐'], ['🎮', 'Juega', 'Cuatro juegos y tu diploma.']]
          .map(function (p) { return '<div class="card"><span style="font-size:34px">' + p[0] + '</span><b>' + p[1] + '</b><span style="color:var(--mute)">' + p[2] + '</span></div>'; }).join('') + '</div>';
      return h;
    }
    function habitat(k) {
      var l = deHab(k), i = HK.indexOf(k), sig = HK[i + 1];
      return '<div class="miga"><button data-act="ir" data-v="portada">Inicio</button> › ' + es(H[k].n) + '</div>' +
        '<section class="hhead" style="background:' + H[k].c + '"><div class="kick" style="color:#fff;opacity:.9">Capítulo ' + (i + 1) + ' de ' + HK.length + '</div><h1>' + es(H[k].n) + '</h1><p>' + es(H[k].txt) + '</p><div>' + est(estrellas(k)) + '</div></section>' +
        '<div class="grid">' + l.map(function (a) {
          var t = tareas(a);
          return '<button class="card acard" data-act="ir" data-v="animal" data-a="' + a.id + '">' + img(a, 'im') + '<b>' + es(a.n) + '</b><div class="tk"><span class="' + (t[0] ? 'on' : '') + '" title="Colorear">🎨</span><span class="' + (t[1] ? 'on' : '') + '" title="Escribir">✏️</span><span class="' + (t[2] ? 'on' : '') + '" title="Pregunta">❓</span></div></button>';
        }).join('') + '</div>' +
        '<div class="pie">' + (i > 0 ? '<button class="btn sec" data-act="ir" data-v="hab" data-a="' + HK[i - 1] + '">◀ ' + es(H[HK[i - 1]].n) + '</button>' : '<span></span>') +
        (sig ? '<button class="btn" data-act="ir" data-v="hab" data-a="' + sig + '">' + es(H[sig].n) + ' ▶</button>' : '<button class="btn" data-act="ir" data-v="juegos">🎮 ¡A jugar!</button>') + '</div>';
    }
    var PASOS = [['aprende', 'Aprende', ''], ['colorea', 'Colorea', 'col'], ['escribe', 'Escribe', 'cal'], ['pregunta', 'Pregunta', 'q']];
    function animal(a, p) {
      var i = A.indexOf(a), ant = A[i - 1], sig = A[i + 1], pi = 0;
      PASOS.forEach(function (x, j) { if (x[0] === p) pi = j; });
      var h = '<div class="miga"><button data-act="ir" data-v="portada">Inicio</button> › <button data-act="ir" data-v="hab" data-a="' + a.hab + '">' + es(H[a.hab].n) + '</button> › ' + es(a.n) + '</div>' +
        '<h1 style="font-size:clamp(36px,5.5vw,56px)">' + es(a.n) + '</h1><div class="tabs" role="tablist">' + PASOS.map(function (x, j) {
          var hecho = x[2] ? S.hecho[a.id + ':' + x[2]] : true;
          return '<button role="tab" class="' + (x[0] === p ? 'on ' : '') + (hecho ? 'done' : '') + '" data-act="ir" data-v="animal" data-a="' + a.id + '" data-b="' + x[0] + '"><i>' + (hecho && x[2] ? '✓' : j + 1) + '</i>' + x[1] + '</button>';
        }).join('') + '</div>';
      if (p === 'aprende') h += aprende(a);
      if (p === 'colorea') h += '<div class="dos"><div class="lienzo" id="lienzo">' + a.linea + '</div><div><h2 style="font-size:28px">Elige un color y toca el dibujo</h2><div class="pal" id="pal"></div><div class="f" style="font-size:18px">Has pintado <span id="cnt">0</span> de <span id="tot">0</span> partes</div><div class="barra"><div id="bar" style="width:0"></div></div><p style="color:var(--mute);margin-bottom:16px">Pinta más de la mitad y ganas 5 ⭐.</p><div class="row"><button class="btn sec" id="ver">👀 Ver modelo</button><button class="btn sec" id="borra">🧽 Borrar todo</button></div><div id="modelo" style="display:none;width:46%;margin-top:14px" class="card">' + a.color + '</div></div></div>';
      if (p === 'escribe') h += '<h2 style="font-size:28px;margin-bottom:6px">Repasa con el dedo: «' + es(a.corto) + '»</h2><p style="color:var(--mute);margin-bottom:14px">Sigue los puntitos. Cuando completes la palabra ganas 5 ⭐.</p><div class="cali"><canvas id="cv"></canvas><canvas id="cv2"></canvas></div><div class="barra" style="max-width:460px"><div id="bar" style="width:0"></div></div><div class="row" style="margin-top:12px"><button class="btn sec" data-act="voz" data-t="' + es(a.corto) + '">🔊 Escuchar</button><button class="btn sec" id="borra">🧽 Borrar</button></div>';
      if (p === 'pregunta') h += pregunta(a);
      var pn = PASOS[pi + 1];
      h += '<div class="pie">' + (ant ? '<button class="btn sec" data-act="ir" data-v="animal" data-a="' + ant.id + '">◀ ' + es(ant.n) + '</button>' : '<span></span>') +
        (pn ? '<button class="btn" data-act="ir" data-v="animal" data-a="' + a.id + '" data-b="' + pn[0] + '">' + pn[1] + ' ▶</button>' : sig ? '<button class="btn" data-act="ir" data-v="animal" data-a="' + sig.id + '">' + es(sig.n) + ' ▶</button>' : '<button class="btn" data-act="ir" data-v="juegos">🎮 ¡A jugar!</button>') + '</div>';
      return h;
    }
    function aprende(a) {
      var tam = ''; for (var i = 1; i <= 5; i++) tam += '<span class="' + (i <= a.tam ? 'on' : '') + '"></span>';
      var tamN = ['', 'Pequeño', 'Mediano', 'Mediano', 'Grande', 'Enorme'][a.tam];
      return '<div class="dos"><div class="big">' + a.color + '<button class="oir" data-act="voz" data-t="' + es(a.n + '. ' + a.intro) + '" aria-label="Escuchar">🔊</button></div>' +
        '<div><p style="font-size:21px;font-weight:700">' + es(a.intro) + '</p><div class="ficha">' +
        '<div><small>Vive en</small><b>' + es(H[a.hab].n) + '</b></div><div><small>Come</small><b>' + es(a.come) + '</b></div>' +
        '<div><small>¿Cómo hace?</small><b>' + es(a.hace) + '</b></div><div><small>Su bebé</small><b>' + es(a.bebe) + '</b></div>' +
        '<div style="grid-column:1/-1"><small>Tamaño</small><b>' + tamN + '</b><div class="tam">' + tam + '</div></div></div>' +
        '<div class="sabias"><b>¿Sabías que…?</b> ' + es(a.dato) + '</div></div></div>' +
        (a.escena ? '<section class="escena"><div class="im">' + a.escena + '</div><div><div class="kick">Míralo en su casa</div><h2 style="font-size:28px;margin:6px 0 10px">¿Por qué es así?</h2><p style="font-size:19px">' + es(a.porque) + '</p><button class="btn sec" style="margin-top:14px" data-act="voz" data-t="' + es(a.porque) + '">🔊 Escuchar</button></div></section>' :
          '<section class="sabias" style="margin-top:22px"><b>¿Por qué?</b> ' + es(a.porque) + '</section>');
    }

    /* colorear */
    var PAL = ['#E8453C', '#F4892E', '#FFD23F', '#7BC043', '#2E9E5B', '#4FB3E8', '#2F6FC4', '#9B6BD1', '#F08DB5', '#B5763E', '#6E4528', '#F6C9A0', '#9AA3AD', '#2A2420'];
    function colorea(a) {
      var lz = $('#lienzo'), zs = [].slice.call(lz.querySelectorAll('[fill="#fff"]')), cur = PAL[0], guard = S.col[a.id] || {};
      zs.forEach(function (z, i) { z.setAttribute('data-z', i); if (guard[i]) z.setAttribute('fill', guard[i]); });
      $('#tot').textContent = zs.length;
      var pal = $('#pal');
      pal.innerHTML = PAL.map(function (c, i) { return '<button style="background:' + c + '" data-c="' + c + '" aria-label="Color ' + (i + 1) + '" class="' + (i ? '' : 'on') + '"></button>'; }).join('') + '<button class="goma" data-c="#fff" aria-label="Goma">🧽</button>';
      pal.onclick = function (e) { var b = e.target.closest('[data-c]'); if (!b) return; cur = b.getAttribute('data-c'); [].forEach.call(pal.children, function (x) { x.classList.toggle('on', x === b); }); };
      function cuenta() {
        var n = zs.filter(function (z) { return z.getAttribute('fill') !== '#fff'; }).length;
        $('#cnt').textContent = n; $('#bar').style.width = Math.round(100 * n / Math.max(1, zs.length)) + '%';
        if (n >= Math.ceil(zs.length * 0.5)) gana(5, '¡Has ganado 5 puntos por colorear ' + a.n.toLowerCase() + '!', a.id + ':col');
      }
      lz.onclick = function (e) {
        var z = e.target.closest('[data-z]'); if (!z) return;
        z.setAttribute('fill', cur); var g = S.col[a.id] = S.col[a.id] || {};
        if (cur === '#fff') delete g[z.getAttribute('data-z')]; else g[z.getAttribute('data-z')] = cur;
        guarda(); cuenta();
      };
      $('#ver').onclick = function () { var m = $('#modelo'); m.style.display = m.style.display === 'none' ? 'block' : 'none'; };
      $('#borra').onclick = function () { zs.forEach(function (z) { z.setAttribute('fill', '#fff'); }); S.col[a.id] = {}; guarda(); cuenta(); };
      var n0 = zs.filter(function (z) { return z.getAttribute('fill') !== '#fff'; }).length; $('#cnt').textContent = n0; $('#bar').style.width = Math.round(100 * n0 / Math.max(1, zs.length)) + '%';
    }

    /* caligrafía */
    function escribe(a) {
      var cv = $('#cv'), cv2 = $('#cv2'), W = 1000, Hh = 300, ct = cv.getContext('2d'), c2 = cv2.getContext('2d'), pts = [], hecho = false;
      cv.width = cv2.width = W; cv.height = cv2.height = Hh;
      function fondo() {
        var fs = 170; ct.clearRect(0, 0, W, Hh); ct.font = fs + 'px "' + FONT + '", cursive';
        while (ct.measureText(a.corto).width > W - 90 && fs > 70) { fs -= 8; ct.font = fs + 'px "' + FONT + '", cursive'; }
        var base = 205, xh = fs * 0.36;
        [[base - xh * 2.1, '#F3C9C4'], [base - xh, '#C9DDF3'], [base, '#E4847A'], [base + xh * 0.9, '#C9DDF3']].forEach(function (l) { ct.strokeStyle = l[1]; ct.lineWidth = l[1] === '#E4847A' ? 3 : 2; ct.beginPath(); ct.moveTo(20, l[0]); ct.lineTo(W - 20, l[0]); ct.stroke(); });
        ct.textAlign = 'center'; ct.fillStyle = '#EFE6D6'; ct.fillText(a.corto, W / 2, base);
        ct.setLineDash([2, 9]); ct.lineCap = 'round'; ct.strokeStyle = '#A8957A'; ct.lineWidth = 3; ct.strokeText(a.corto, W / 2, base); ct.setLineDash([]);
        var m = document.createElement('canvas'); m.width = W; m.height = Hh; var mx = m.getContext('2d'); mx.font = ct.font; mx.textAlign = 'center'; mx.fillText(a.corto, W / 2, base);
        var d = mx.getImageData(0, 0, W, Hh).data; pts = [];
        for (var y = 0; y < Hh; y += 6) for (var x = 0; x < W; x += 6) if (d[(y * W + x) * 4 + 3] > 120) pts.push([x, y]);
      }
      fondo(); if (document.fonts && document.fonts.load) document.fonts.load('80px "' + FONT + '"').then(fondo, function () { });
      var dib = false, ult = null;
      function xy(e) { var r = cv2.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * Hh / r.height]; }
      c2.lineCap = c2.lineJoin = 'round'; c2.lineWidth = 26; c2.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--acc') || '#C2477A'; c2.globalAlpha = 0.85;
      cv2.onpointerdown = function (e) { dib = true; ult = xy(e); cv2.setPointerCapture(e.pointerId); c2.beginPath(); c2.arc(ult[0], ult[1], 13, 0, 7); c2.fillStyle = c2.strokeStyle; c2.fill(); };
      cv2.onpointermove = function (e) { if (!dib) return; var p = xy(e); c2.beginPath(); c2.moveTo(ult[0], ult[1]); c2.lineTo(p[0], p[1]); c2.stroke(); ult = p; };
      cv2.onpointerup = cv2.onpointercancel = function () {
        if (!dib) return; dib = false; if (!pts.length) return;
        var d = c2.getImageData(0, 0, W, Hh).data, n = 0;
        pts.forEach(function (p) { if (d[(p[1] * W + p[0]) * 4 + 3] > 0) n++; });
        var f = n / pts.length; $('#bar').style.width = Math.min(100, Math.round(f * 100 / 0.6)) + '%';
        if (f >= 0.6 && !hecho) { hecho = true; gana(5, '¡Has ganado 5 puntos! Escribiste «' + a.corto + '».', a.id + ':cal'); }
      };
      $('#borra').onclick = function () { c2.clearRect(0, 0, W, Hh); $('#bar').style.width = '0'; hecho = false; };
    }

    /* pregunta rápida */
    function pregunta(a) {
      var i = A.indexOf(a), tipo = i % 3, otros = mezcla(A.filter(function (x) { return x !== a; })), e, ok, malos;
      if (tipo === 0) { e = '¿Qué come ' + a.n.toLowerCase() + '?'; ok = a.come; malos = otros.map(function (x) { return x.come; }); }
      else if (tipo === 1) { e = '¿Dónde vive ' + a.n.toLowerCase() + '?'; ok = H[a.hab].n; malos = Object.keys(H).filter(function (k) { return k !== a.hab; }).map(function (k) { return H[k].n; }); }
      else { e = ('¿Cómo se llama el bebé de ' + a.n.toLowerCase() + '?').replace(/\bde el\b/, 'del'); ok = a.bebe; malos = otros.map(function (x) { return x.bebe; }); }
      malos = malos.filter(function (x, j, l) { return x !== ok && l.indexOf(x) === j; }).slice(0, 2);
      var op = mezcla([ok].concat(malos));
      return '<div class="card" style="max-width:720px"><h2 style="font-size:30px">' + es(e) + '</h2><button class="btn sec" style="margin-top:10px" data-act="voz" data-t="' + es(e) + '">🔊 Escuchar</button><div class="ops">' +
        op.map(function (o) { return '<button data-act="op" data-ok="' + (o === ok ? 1 : 0) + '" data-a="' + a.id + '">' + es(o) + '</button>'; }).join('') + '</div><p id="porq" style="margin-top:14px;font-size:18px;display:none">' + es(a.dato) + '</p></div>';
    }

    /* juegos */
    function fin(tipo, msg) { var primera = !S.juegos[tipo]; S.juegos[tipo] = (S.juegos[tipo] || 0) + 1; gana(primera ? 10 : 2, msg + (primera ? ' ¡Has ganado 10 puntos!' : ' +2 puntos.')); }
    function cabJ(t, p) { return '<div class="miga"><button data-act="ir" data-v="juegos">Juegos</button> › ' + t + '</div><h1 style="font-size:clamp(32px,5vw,48px)">' + t + '</h1><p style="font-size:19px;color:var(--mute);margin:6px 0 18px">' + p + '</p>'; }
    function otra(t) { return '<div class="row" style="margin-top:20px"><button class="btn" data-act="ir" data-v="juego" data-a="' + t + '">🔄 Otra vez</button><button class="btn sec" data-act="ir" data-v="juegos">Más juegos</button></div>'; }
    var JUEGOS = {
      une: { n: 'Une el nombre con su dibujo', ico: '🔗', p: 'Toca un dibujo y después su nombre.',
        ini: function (el) {
          var l = mezcla(A).slice(0, 6), sel = null, hechos = 0;
          el.innerHTML = cabJ(this.n, this.p) + '<div class="une"><div class="pic">' + l.map(function (a) { return '<button data-id="' + a.id + '" aria-label="Dibujo">' + a.color + '</button>'; }).join('') + '</div><div class="col nom">' + mezcla(l).map(function (a) { return '<button data-n="' + a.id + '">' + es(a.corto) + '</button>'; }).join('') + '</div></div><div id="fin"></div>';
          el.onclick = function (e) {
            var p = e.target.closest('[data-id]'), n = e.target.closest('[data-n]');
            if (p) { if (sel) sel.classList.remove('sel'); sel = p; p.classList.add('sel'); di(porId(p.getAttribute('data-id')).corto); return; }
            if (n && sel) {
              if (n.getAttribute('data-n') === sel.getAttribute('data-id')) { sel.classList.remove('sel'); sel.classList.add('hecho'); n.classList.add('hecho'); sel = null; if (++hechos === l.length) { fin('une', '¡Todos unidos!'); $('#fin').innerHTML = otra('une'); } }
              else { n.classList.add('malo'); setTimeout(function () { n.classList.remove('malo'); }, 450); }
            }
          };
        } },
      memoria: { n: 'Memoria', ico: '🃏', p: 'Encuentra cada animal con su nombre.',
        ini: function (el) {
          var l = mezcla(A).slice(0, 6), cartas = mezcla(l.map(function (a) { return { id: a.id, t: 'd' }; }).concat(l.map(function (a) { return { id: a.id, t: 'n' }; }))), abiertas = [], par = 0, mov = 0, bloq = false;
          el.innerHTML = cabJ(this.n, this.p) + '<div class="mem">' + cartas.map(function (c, i) { return '<button data-i="' + i + '" aria-label="Carta">?</button>'; }).join('') + '</div><p class="f" style="margin-top:14px;font-size:19px">Intentos: <span id="mov">0</span></p><div id="fin"></div>';
          el.onclick = function (e) {
            var b = e.target.closest('[data-i]'); if (!b || bloq || b.classList.contains('v')) return;
            var c = cartas[+b.getAttribute('data-i')], a = porId(c.id);
            b.classList.add('v'); b.innerHTML = c.t === 'd' ? a.color : es(a.corto); abiertas.push(b);
            if (abiertas.length < 2) return;
            mov++; $('#mov').textContent = mov;
            var x = cartas[+abiertas[0].getAttribute('data-i')], y = cartas[+abiertas[1].getAttribute('data-i')];
            if (x.id === y.id && x.t !== y.t) { abiertas.forEach(function (z) { z.classList.add('hecho'); }); abiertas = []; di(a.corto); if (++par === l.length) { fin('memoria', '¡Memoria de campeón! ' + mov + ' intentos.'); $('#fin').innerHTML = otra('memoria'); } }
            else { bloq = true; setTimeout(function () { abiertas.forEach(function (z) { z.classList.remove('v'); z.textContent = '?'; }); abiertas = []; bloq = false; }, 900); }
          };
        } },
      quien: { n: '¿Quién es?', ico: '👂', p: 'Escucha el nombre y toca el animal.',
        ini: function (el) {
          var ronda = 0, bien = 0, N = 8, orden = mezcla(A).slice(0, N), self = this;
          function paso() {
            if (ronda >= N) { fin('quien', '¡Acertaste ' + bien + ' de ' + N + '!'); el.innerHTML = cabJ(self.n, '¡Acertaste ' + bien + ' de ' + N + '!') + otra('quien'); return; }
            var t = orden[ronda], op = mezcla([t].concat(mezcla(A.filter(function (x) { return x !== t; })).slice(0, 3)));
            el.innerHTML = cabJ(self.n, 'Ronda ' + (ronda + 1) + ' de ' + N + ' · aciertos: ' + bien) + '<button class="btn" id="rep">🔊 ¿Dónde está…?</button><div class="quien">' + op.map(function (a) { return '<button data-id="' + a.id + '" aria-label="Animal">' + a.color + '</button>'; }).join('') + '</div>';
            var dime = function () { di('¿Dónde está ' + t.n.toLowerCase() + '?'); }; dime(); $('#rep').onclick = dime;
            var fallo = false;
            el.querySelector('.quien').onclick = function (e) {
              var b = e.target.closest('[data-id]'); if (!b) return;
              if (b.getAttribute('data-id') === t.id) { b.classList.add('hecho'); if (!fallo) bien++; di('¡Muy bien! ' + t.n); ronda++; setTimeout(paso, 1100); }
              else { fallo = true; b.classList.add('malo'); setTimeout(function () { b.classList.remove('malo'); }, 450); }
            };
          }
          paso();
        } },
      habitat: { n: 'Cada animal a su casa', ico: '🏡', p: 'Arrastra cada animal a donde vive. También puedes tocarlo y después tocar su casa.',
        ini: function (el) {
          var l = mezcla(A).slice(0, 8), quedan = l.length, sel = null;
          el.innerHTML = cabJ(this.n, this.p) + '<div class="fichas">' + l.map(function (a) { return '<button data-id="' + a.id + '" aria-label="' + es(a.n) + '">' + a.color + '</button>'; }).join('') + '</div>' +
            '<div class="habz">' + HK.map(function (k) { return '<div data-h="' + k + '" style="background:' + H[k].c + '"><h3>' + es(H[k].n) + '</h3><div class="dentro"></div></div>'; }).join('') + '</div><div id="fin"></div>';
          function suelta(btn, zona) {
            var a = porId(btn.getAttribute('data-id'));
            if (zona && zona.getAttribute('data-h') === a.hab) { zona.querySelector('.dentro').insertAdjacentHTML('beforeend', '<div>' + a.color + '</div>'); btn.remove(); di(a.n + ' vive en ' + H[a.hab].n.toLowerCase()); if (--quedan === 0) { fin('habitat', '¡Cada animal está en su casa!'); $('#fin').innerHTML = otra('habitat'); } }
            else if (zona) { zona.classList.add('malo'); setTimeout(function () { zona.classList.remove('malo'); }, 450); }
          }
          var g = null, src = null, x0 = 0, y0 = 0, movio = false;
          el.addEventListener('pointerdown', function (e) { var b = e.target.closest('.fichas [data-id]'); if (!b) return; src = b; x0 = e.clientX; y0 = e.clientY; movio = false; });
          window.onpointermove = function (e) {
            if (!src) return;
            if (!movio && Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 8) { movio = true; g = document.createElement('div'); g.className = 'ghost'; g.innerHTML = src.innerHTML; document.body.appendChild(g); src.style.opacity = '.3'; }
            if (g) { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }
          };
          window.onpointerup = function (e) {
            if (!src) return; var b = src; src = null;
            if (movio) { if (g) g.remove(); g = null; b.style.opacity = ''; var z = document.elementFromPoint(e.clientX, e.clientY); suelta(b, z && z.closest('[data-h]')); return; }
            if (sel) sel.classList.remove('sel'); sel = b; b.classList.add('sel'); di(porId(b.getAttribute('data-id')).n);
          };
          el.addEventListener('click', function (e) { var z = e.target.closest('[data-h]'); if (z && sel && sel.isConnected) { var b = sel; sel = null; b.classList.remove('sel'); suelta(b, z); } });
        } }
    };
    function juegos() {
      return '<div class="kick">Final del libro</div><h1 style="font-size:clamp(36px,5.5vw,56px);margin:6px 0 20px">¡A jugar!</h1><div class="grid">' + Object.keys(JUEGOS).map(function (k) {
        var J = JUEGOS[k], n = S.juegos[k] || 0;
        return '<button class="card gcard" data-act="ir" data-v="juego" data-a="' + k + '"><span class="ico">' + J.ico + '</span><h3>' + es(J.n) + '</h3><p>' + es(J.p) + '</p><span class="f" style="color:' + (n ? 'var(--ok)' : 'var(--acc)') + '">' + (n ? '✓ Jugado ' + n + (n > 1 ? ' veces' : ' vez') : '+10 ⭐ la primera vez') + '</span></button>';
      }).join('') + '</div><div class="pie"><span></span><button class="btn" data-act="ir" data-v="diploma">🏅 Ver mi diploma</button></div>';
    }
    function diploma() {
      var tot = A.length * 3, hechas = 0; A.forEach(function (a) { tareas(a).forEach(function (x) { if (x) hechas++; }); });
      var nj = Object.keys(JUEGOS).filter(function (k) { return S.juegos[k]; }).length;
      var md = S.pts >= 160 ? ['Oro', '#E0A81C'] : S.pts >= 80 ? ['Plata', '#9AA6B2'] : ['Bronce', '#C07A3E'];
      var hoy = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
      return '<div class="noprint" style="margin-bottom:18px"><label class="nom">Escribe tu nombre para el diploma<input id="nombre" value="' + es(S.nombre) + '" placeholder="Tu nombre" autocomplete="off"></label><div class="row"><button class="btn" data-act="ir" data-v="diploma">✨ Poner mi nombre</button><button class="btn sec" data-act="print">🖨️ Imprimir diploma</button></div></div>' +
        '<section class="dip" id="dip"><div class="kick">' + es(L.centro || 'Libro interactivo') + '</div><h1>Diploma</h1><p style="font-size:20px">Se entrega con mucho orgullo a</p><div class="quien2">' + es(S.nombre || 'Mi nombre') + '</div>' +
        '<p style="font-size:20px">por aprender, colorear, escribir y jugar con <b>' + es(L.titulo) + '</b>.</p><div class="medal" style="background:' + md[1] + '">Medalla<br>de ' + md[0] + '</div>' +
        '<div class="row" style="justify-content:center;gap:28px;font-family:Fredoka;font-size:20px"><span>⭐ ' + S.pts + ' puntos</span><span>✅ ' + hechas + ' de ' + tot + ' actividades</span><span>🎮 ' + nj + ' de 4 juegos</span><span>📚 ' + nCuentos() + ' de ' + L.cuentos.length + ' cuentos</span><span>🧩 ' + nAdiv() + ' adivinanzas</span></div>' +
        '<div class="row" style="justify-content:center;gap:22px">' + HK.map(function (k) { return '<div style="display:grid;gap:2px;justify-items:center"><span class="f" style="font-size:16px">' + es(H[k].n) + '</span>' + est(estrellas(k)) + '</div>'; }).join('') + '</div>' +
        '<div class="firmas"><div>' + es(hoy) + '</div><div>' + es(L.autor || 'Firma de la maestra o del maestro') + '</div></div></section>';
    }

    /* encuadre de cada retrato a su silueta (se mide una vez por animal) */
    var VBX = {}, AJ = 0;
    function ajusta() {
      AJ = 0;
      [].forEach.call(document.querySelectorAll('svg[data-fit]'), function (s) {
        var k = s.getAttribute('data-fit');
        if (!VBX[k]) { try { var b = s.getBBox(); if (!(b.width > 0)) return; var p = Math.max(b.width, b.height) * 0.07, w = b.width + 2 * p, h = b.height + 2 * p, m = Math.max(w, h); VBX[k] = [b.x + b.width / 2 - m / 2, b.y + b.height / 2 - m / 2, m, m].map(function (v) { return Math.round(v * 10) / 10; }).join(' '); } catch (e) { return; } }
        s.setAttribute('viewBox', VBX[k]); s.removeAttribute('data-fit');
      });
    }
    new MutationObserver(function () { if (!AJ) AJ = requestAnimationFrame(ajusta); }).observe(document.body, { childList: true, subtree: true });
    /* ─── cuentos animados ─── */
    function chSvg(id) { var b = id.replace(/\d+$/, ''); return L.extra[b] || (porId(b) || {}).color || ''; }
    function nCuentos() { return L.cuentos.filter(function (c) { return S.hecho['cuento:' + c.id]; }).length; }
    function tarjetaCuento(c) {
      var ef = c.esc[c.esc.length - 1], ids = Object.keys(ef.c);
      return '<button class="card gcard ccard" data-act="ir" data-v="cuento" data-a="' + c.id + '"><div class="im">' + L.fondos[c.hab] + ids.map(function (id) { var p = ef.c[id]; return '<div style="left:' + p[0] + '%;top:' + p[1] + '%;width:' + p[2] + '%;aspect-ratio:1;transform:translate(-50%,-100%)">' + chSvg(id) + '</div>'; }).join('') + '</div>' +
        '<h3>' + es(c.t) + '</h3><p>' + es(H[c.hab].n) + ' · ' + c.esc.length + ' escenas</p><span class="f" style="color:' + (S.hecho['cuento:' + c.id] ? 'var(--ok)' : 'var(--acc)') + '">' + (S.hecho['cuento:' + c.id] ? '✓ Leído' : '+5 ⭐ al terminar') + '</span></button>';
    }
    function cuentos() { return '<div class="kick">Para leer y escuchar</div><h1 style="font-size:clamp(36px,5.5vw,56px);margin:6px 0 20px">Cuentos</h1><div class="grid">' + L.cuentos.map(tarjetaCuento).join('') + '</div>'; }
    function palabras(t) { var o = '', re = /\S+/g, m; while ((m = re.exec(t))) o += (m.index ? ' ' : '') + '<w data-i="' + m.index + '">' + es(m[0]) + '</w>'; return o; }
    function cuento(id, el) {
      var c = L.cuentos.filter(function (x) { return x.id === id; })[0], ids = {}, k = -1, auto = false, run = RUN;
      c.esc.forEach(function (e) { Object.keys(e.c).forEach(function (x) { ids[x] = 1; }); });
      el.innerHTML = '<div class="miga"><button data-act="ir" data-v="cuentos">Cuentos</button> › ' + es(c.t) + '</div><h1 style="font-size:clamp(32px,5vw,48px);margin-bottom:14px">' + es(c.t) + '</h1>' +
        '<div class="stage"><div class="bg">' + L.fondos[c.hab] + '</div>' + Object.keys(ids).map(function (x) { return '<div class="ch off" data-ch="' + x + '" style="left:50%;top:92%;width:20%"><div>' + chSvg(x) + '</div></div>'; }).join('') +
        '<div class="noche"></div><div class="lluvia"></div></div><div class="sub" id="sub" aria-live="polite"></div><div class="puntos">' + c.esc.map(function () { return '<i></i>'; }).join('') + '</div>' +
        '<div class="pie" style="margin-top:16px"><button class="btn sec" id="ant">◀ Antes</button><button class="btn" id="play">▶ Léemelo</button><button class="btn sec" id="sig">Después ▶</button></div><div id="fin"></div>';
      function escena(i) {
        if (run !== RUN) return; k = i; var e = c.esc[i];
        Object.keys(ids).forEach(function (x) {
          var n = el.querySelector('[data-ch="' + x + '"]'), p = e.c[x];
          n.className = 'ch' + (p ? ' a-' + p[3] : ' off');
          if (p) { n.style.left = p[0] + '%'; n.style.top = p[1] + '%'; n.style.width = p[2] + '%'; }
          var zz = n.querySelector('.zz'); if (p && p[3] === 'sleep') { if (!zz) n.insertAdjacentHTML('beforeend', '<span class="zz">Z z z</span>'); } else if (zz) zz.remove();
        });
        $('.noche', el).classList.toggle('on', !!e.noche); $('.lluvia', el).classList.toggle('on', !!e.lluvia);
        $('#sub').innerHTML = palabras(e.t);
        [].forEach.call(el.querySelectorAll('.puntos i'), function (d, j) { d.classList.toggle('on', j === i); });
        $('#ant').disabled = i === 0; $('#ant').style.opacity = i === 0 ? .4 : 1;
        if (auto) lee(e.t, function () { if (run !== RUN || !auto) return; if (k < c.esc.length - 1) setTimeout(function () { escena(k + 1); }, 700); else { auto = false; $('#play').textContent = '▶ Léemelo'; final(); } });
        if (i === c.esc.length - 1 && !auto) final();
      }
      function lee(t, fin) {
        var ws = [].slice.call(el.querySelectorAll('#sub w'));
        if (!window.speechSynthesis) { var j = 0, iv = setInterval(function () { ws.forEach(function (w, n) { w.classList.toggle('on', n === j); }); if (++j > ws.length) { clearInterval(iv); fin(); } }, 380); return; }
        speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(t); VOZ = VOZ || voz(); if (VOZ) u.voice = VOZ; u.lang = (VOZ && VOZ.lang) || 'es-ES'; u.rate = 0.88;
        var bound = false, j2 = 0, iv2 = setInterval(function () { if (bound) return clearInterval(iv2); ws.forEach(function (w, n) { w.classList.toggle('on', n === j2); }); j2++; }, 340);
        u.onboundary = function (ev) { if (ev.name && ev.name !== 'word') return; bound = true; var ci = ev.charIndex; ws.forEach(function (w) { w.classList.toggle('on', +w.getAttribute('data-i') <= ci && ci < +w.getAttribute('data-i') + w.textContent.length + 1); }); };
        u.onend = u.onerror = function () { clearInterval(iv2); ws.forEach(function (w) { w.classList.remove('on'); }); fin(); };
        speechSynthesis.speak(u);
      }
      var hechoF = false;
      function final() {
        if (hechoF) return; hechoF = true;
        var q = c.q, op = mezcla(q[1]);
        $('#fin').innerHTML = '<div class="card" style="max-width:720px;margin-top:26px"><div class="kick">¿Lo has entendido?</div><h2 style="font-size:28px;margin:6px 0 4px">' + es(q[0]) + '</h2><div class="ops" id="cq">' + op.map(function (o) { return '<button data-ok="' + (o === q[1][0] ? 1 : 0) + '">' + es(o) + '</button>'; }).join('') + '</div></div>';
        $('#cq').onclick = function (ev) {
          var b = ev.target.closest('[data-ok]'); if (!b) return;
          if (b.getAttribute('data-ok') === '1') { b.classList.add('ok'); [].forEach.call(b.parentNode.children, function (x) { x.disabled = true; }); if (!gana(5, '¡Muy bien! Has ganado 5 puntos con el cuento.', 'cuento:' + c.id)) di('¡Muy bien!'); $('#fin').insertAdjacentHTML('beforeend', '<div class="row" style="margin-top:18px"><button class="btn" data-act="ir" data-v="cuentos">📚 Otro cuento</button></div>'); }
          else { b.classList.add('no'); di('Casi. Prueba otra vez.'); setTimeout(function () { b.classList.remove('no'); }, 450); }
        };
      }
      $('#ant').onclick = function () { auto = false; $('#play').textContent = '▶ Léemelo'; if (window.speechSynthesis) speechSynthesis.cancel(); if (k > 0) escena(k - 1); };
      $('#sig').onclick = function () { auto = false; $('#play').textContent = '▶ Léemelo'; if (window.speechSynthesis) speechSynthesis.cancel(); if (k < c.esc.length - 1) escena(k + 1); };
      $('#play').onclick = function () { if (auto) { auto = false; this.textContent = '▶ Léemelo'; if (window.speechSynthesis) speechSynthesis.cancel(); return; } auto = true; this.textContent = '❚❚ Parar'; escena(k < 0 || k >= c.esc.length - 1 ? 0 : k); };
      setTimeout(function () { escena(0); }, 60);
    }

    /* ─── adivinanzas ─── */
    function nAdiv() { return A.filter(function (a) { return S.hecho['adiv:' + a.id]; }).length; }
    function adivinanzas() {
      return '<div class="kick">¿Quién soy?</div><h1 style="font-size:clamp(36px,5.5vw,56px);margin:6px 0 8px">Adivinanzas</h1><p style="font-size:19px;color:var(--mute);margin-bottom:20px">Cada pista te ayuda un poco más. Adivina con menos pistas y gana más estrellas.</p><div class="grid">' +
        A.map(function (a, i) { var ok = S.hecho['adiv:' + a.id]; return '<button class="card acard" data-act="ir" data-v="adivina" data-a="' + i + '">' + (ok ? img(a, 'im') : '<div class="im"><div class="misterio" style="font-size:clamp(50px,7vw,80px)">?</div></div>') + '<b>' + (ok ? es(a.n) : 'Adivinanza ' + (i + 1)) + '</b></button>'; }).join('') + '</div>';
    }
    function adivina(i, el) {
      var a = A[i], P = L.adiv[a.id] || [a.intro], n = 1, op = mezcla([a].concat(mezcla(A.filter(function (x) { return x !== a && x.hab !== a.hab; })).slice(0, 1), mezcla(A.filter(function (x) { return x !== a && x.hab === a.hab; })).slice(0, 2))), fallos = 0;
      function pinta2() {
        el.innerHTML = '<div class="miga"><button data-act="ir" data-v="adivinanzas">Adivinanzas</button> › ' + (i + 1) + ' de ' + A.length + '</div><div class="dos"><div><div class="misterio' + (n >= 3 ? ' sil' : '') + '" id="mist">' + (n >= 3 ? a.color : '?') + '</div></div>' +
          '<div><h1 style="font-size:clamp(32px,5vw,46px);margin-bottom:14px">¿Quién soy?</h1><div style="display:grid;gap:10px">' + P.slice(0, n).map(function (p, j) { return '<div class="pista"><b>' + (j + 1) + '</b><span>' + es(p) + '</span></div>'; }).join('') + '</div>' +
          '<div class="row" style="margin-top:14px"><button class="btn sec" id="oye">🔊 Escuchar</button>' + (n < P.length ? '<button class="btn sec" id="mas">💡 Otra pista</button>' : '') + '</div>' +
          '<div class="quien" style="grid-template-columns:repeat(4,minmax(0,1fr))" id="op">' + op.map(function (x) { return '<button data-id="' + x.id + '" aria-label="Animal">' + x.color + '</button>'; }).join('') + '</div><div id="res"></div></div></div>';
        $('#oye').onclick = function () { di(P.slice(0, n).join(' ') + ' ¿Quién soy?'); };
        if ($('#mas')) $('#mas').onclick = function () { n++; pinta2(); di(P[n - 1]); };
        $('#op').onclick = function (ev) {
          var b = ev.target.closest('[data-id]'); if (!b) return;
          if (b.getAttribute('data-id') === a.id) {
            b.classList.add('hecho'); var m = $('#mist'); m.className = 'misterio'; m.style.background = '#fff'; m.style.padding = '12%'; m.innerHTML = a.color;
            var pts = n === 1 && !fallos ? 5 : n === 2 ? 3 : 2;
            if (!gana(pts, '¡Sí! Soy ' + a.n.toLowerCase() + '. Has ganado ' + pts + ' puntos.', 'adiv:' + a.id)) di('¡Sí! Soy ' + a.n.toLowerCase());
            [].forEach.call($('#op').children, function (x) { x.style.pointerEvents = 'none'; });
            $('#res').innerHTML = '<div class="row" style="margin-top:18px">' + (A[i + 1] ? '<button class="btn" data-act="ir" data-v="adivina" data-a="' + (i + 1) + '">Siguiente 🧩</button>' : '<button class="btn" data-act="ir" data-v="diploma">🏅 Mi diploma</button>') + '<button class="btn sec" data-act="ir" data-v="animal" data-a="' + a.id + '">Conocer a ' + es(a.corto) + '</button></div>';
          } else { fallos++; b.classList.add('malo'); di('No soy yo. Escucha otra pista.'); setTimeout(function () { b.classList.remove('malo'); if (n < P.length) { n++; pinta2(); } }, 600); }
        };
      }
      pinta2(); setTimeout(function () { di(P[0] + ' ¿Quién soy?'); }, 300);
    }

    app.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var act = b.getAttribute('data-act');
      if (act === 'ir') ir(b.getAttribute('data-v'), b.getAttribute('data-a'), b.getAttribute('data-b'));
      else if (act === 'voz') di(b.getAttribute('data-t'));
      else if (act === 'print') window.print();
      else if (act === 'op') {
        var ok = b.getAttribute('data-ok') === '1', a = porId(b.getAttribute('data-a'));
        if (ok) { b.classList.add('ok'); [].forEach.call(b.parentNode.children, function (x) { x.disabled = true; }); $('#porq').style.display = 'block'; if (!gana(2, '¡Correcto! Has ganado 2 puntos.', a.id + ':q')) di('¡Correcto!'); }
        else { b.classList.add('no'); di('Casi. Prueba otra vez.'); setTimeout(function () { b.classList.remove('no'); }, 450); }
      }
    });
    pinta();
  });
  APP = APP.slice(APP.indexOf('{') + 1, APP.lastIndexOf('}'));

  function html(D) {
    var fURL = 'https://fonts.googleapis.com/css2?family=' + D.fuente.replace(/ /g, '+') + ':wght@100..400&display=swap';
    return '<!DOCTYPE html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + es(D.titulo) + '</title>' +
      '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@500;700;800&display=swap"><link rel="stylesheet" href="' + fURL + '">' +
      '<style>' + CSS.replace('__ACC__', D.acc).replace('__FONT__', D.fuente) + '</style></head><body><div id="app"></div><div id="toast" role="status" aria-live="polite"></div>' +
      '<script>window.LIBRO=' + JSON.stringify(D).replace(/<\//g, '<\\/') + ';<\/script><script>(function(){' + APP + '})();<\/script></body></html>';
  }
  function generar(res, cfg) { return esperaLibs().then(function () { var D = datos(res, cfg); return { html: html(D), D: D }; }); }

  function enganchar() {
    var CN = window.EU_CONECTORES; if (!CN || CN.__infLibro) return !!CN;
    var s0 = CN.salidas; CN.__infLibro = true;
    CN.salidas = function (ed, b8) {
      s0.apply(this, arguments);
      var cfg = ed.cfg || {};
      if (cfg.materia !== 'infantil' && !/colorear|caligraf|pasatiempo|infantil/i.test(String(cfg.prod || ''))) return;
      var ocupado = false;
      b8('🧸 Libro interactivo (colorear, escribir y jugar)', function () {
        if (ocupado) return; ocupado = true; ed.aviso('Libro interactivo: preparando los 24 animales…');
        generar(ed.res, cfg).then(function (r) {
          ed.bajar(new Blob([r.html], { type: 'text/html' }), slug(r.D.titulo) + '-interactivo.html');
          ed.aviso('Libro interactivo descargado: 24 animales, 4 capítulos, 4 juegos y diploma. Ábrelo en el navegador.');
        }).catch(function (e) { ed.aviso('Libro interactivo: ' + e.message); }).then(function () { ocupado = false; });
      }, true);
    };
    return true;
  }
  if (!enganchar()) (function espera(n) { if (!enganchar() && n < 200) setTimeout(function () { espera(n + 1); }, 300); })(0);

  /* también dentro del «📦 Paquete completo» del Editorial (JSZip acepta una promesa como contenido) */
  function esInfantil(cfg) { cfg = cfg || {}; return cfg.materia === 'infantil' || /colorear|caligraf|pasatiempo|infantil/i.test(String(cfg.prod || '')); }
  (window.EU_PAQUETE_EXTRA = window.EU_PAQUETE_EXTRA || []).push(function (z, res, hecho, cfg) {
    if (!esInfantil(cfg)) return;
    z.file('12-libro-interactivo.html', generar(res, cfg).then(function (r) { return r.html; }));
    hecho.push('libro interactivo (colorear, escribir, cuentos, adivinanzas y juegos)');
  });

  window.EU_INF_LIBRO = { generar: generar, html: html, datos: datos, ANI: ANI };
})();
