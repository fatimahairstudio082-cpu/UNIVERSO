/* b6_lib_peluqueria4.js — Peluquería (4/4): 14 modelos que completan los 100 (cortes, color, peinados, cabello y negocio).
   Cargar después de b6_lib_peluqueria3.js. */
(function () {
  'use strict';
  var MO = window.EU_MODELOS; if (!MO || MO.modelo('pe_pixie')) return;
  var M = MO.M;
  var C = { pelo: '#6A4A32', peloC: '#B8864A', rubio: '#E6C27A', piel: '#F0C8A8', pielO: '#C8906A', cromo: '#D5DADF', violeta: '#7A4A9A', ok: '#4E9A3A', mal: '#C8323A', papel: '#FFFDF4', tinte: '#6A2A4A' };
  function cara(K, cx, cy, r) { return K.e(cx, cy, r * .78, r, C.piel) + K.e(cx - r * .3, cy - r * .1, r * .1, r * .05, '#3A2A20') + K.e(cx + r * .3, cy - r * .1, r * .1, r * .05, '#3A2A20') + K.l('M' + (cx - r * .2) + ' ' + (cy + r * .45) + ' q' + (r * .2) + ' ' + (r * .12) + ' ' + (r * .4) + ' 0', C.pielO, { w: 1.2 }); }

  var L = [
    /* ─────────── CORTES ─────────── */
    { id: 'pe_pixie', fam: 'cor', n: 'Corte pixie',
      d: function (K) { return K.suelo(100, 140, 60) + cara(K, 100, 78, 40) + K.p('M66 70 Q60 34 100 30 Q140 32 136 66 Q128 50 116 52 Q100 40 84 56 Q74 52 66 70 Z', C.pelo) + K.p('M84 56 Q96 46 116 52 Q104 58 92 70 Z', K.claro(C.pelo, .18)) + K.l('M66 70 L68 92 M136 66 L134 90', C.pelo, { w: 3 }); },
      rot: [['Flequillo ladeado', 100, 58, 160, 30], ['Nuca y patillas cortas', 68, 86, 24, 110]],
      intro: 'Corte muy corto en nuca y laterales, con algo más de largo arriba para dar movimiento.',
      q: [['¿A qué caras favorece más?', 'A las ovaladas y a las de facciones finas.'], ['¿Cada cuánto se repasa?', 'Cada 4 a 6 semanas.'], ['¿Con qué se texturiza la parte de arriba?', 'Con navaja o tijera de entresacar y un poco de cera.']],
      porque: 'Al dejar largo solo arriba, la vista sube y el cuello parece más largo.' },
    { id: 'pe_fade_niveles', fam: 'cor', n: 'Degradado fade con máquina',
      d: function (K) { var t = [['0', '#F0C8A8'], ['1', '#C8A890'], ['2', '#9A7A62'], ['3', '#7A5A42'], ['4', C.pelo]], s = K.suelo(100, 140, 80); t.forEach(function (q, i) { var y = 110 - i * 18; s += K.r(30, y, 70, 18, 0, q[1]) + K.t(108, y + 12, 'n.º ' + q[0] + ' · ' + [0, 3, 6, 9, 12][i] + ' mm', { s: 6.8, b: 1, a: 'start' }); }); return s + K.p('M30 38 Q30 22 65 20 Q100 22 100 38 Z', C.pelo) + K.flecha(20, 126, 20, 40, '#555', { w: 1 }) + K.t(65, 140, 'De abajo hacia arriba', { s: 6.4 }); },
      intro: 'Se sube de la piel al largo de arriba cambiando el peine guía de la máquina por zonas.',
      q: [['¿Con qué número se empieza abajo?', 'Con el 0 o la máquina sin peine.'], ['¿Cómo se borra la línea entre zonas?', 'Con la palanca de la máquina a medio abrir y movimiento de cuchara.'], ['¿Qué mide el n.º 2?', '6 mm.']],
      porque: 'Cada peine guía deja un largo fijo: unir zonas próximas da la transición suave.' },
    { id: 'pe_corte_rizado', fam: 'cor', n: 'Corte de pelo rizado en seco',
      d: function (K) { var s = K.suelo(100, 140, 70) + cara(K, 100, 84, 32); for (var i = 0; i < 14; i++) { var a = Math.PI + i * Math.PI / 13, x = 100 + Math.cos(a) * 46, y = 74 + Math.sin(a) * 44; s += K.c(x, y, 9, i % 2 ? C.pelo : K.claro(C.pelo, .15)); } return s + K.p('M150 40 L178 26 L180 30 L154 44 Z', C.cromo) + K.p('M150 46 L178 58 L180 54 L154 42 Z', K.oscuro(C.cromo, .1)) + K.t(100, 140, 'Rizo a rizo, con el pelo seco', { s: 6.6, b: 1 }); },
      intro: 'El rizo se corta en seco, uno a uno, porque mojado parece mucho más largo.',
      q: [['¿Por qué no se corta mojado?', 'Al secar, el rizo sube y el largo cambia de forma desigual.'], ['¿Cuánto encoge un rizo cerrado?', 'Hasta la mitad o más de su largo estirado.'], ['¿Qué se busca con este corte?', 'Que cada rizo caiga con su forma y la melena tenga volumen parejo.']],
      porque: 'Cortar el rizo en su forma natural muestra el resultado real mientras se trabaja.' },
    /* ─────────── COLOR ─────────── */
    { id: 'pe_balayage', fam: 'col', n: 'Balayage',
      d: function (K) { var s = K.suelo(100, 140, 70) + K.p('M50 20 Q100 10 150 20 L156 132 L44 132 Z', C.pelo); for (var i = 0; i < 6; i++) { var x = 58 + i * 16; s += K.p('M' + x + ' 50 Q' + (x + 4) + ' 90 ' + (x - 2) + ' 132 L' + (x + 10) + ' 132 Q' + (x + 10) + ' 90 ' + (x + 6) + ' 50 Z', C.rubio, { op: .9 }); } return s + K.l('M44 50 L156 50', '#FFFFFF', { w: 1, d: '3 3' }) + K.t(170, 40, 'Raíz', { s: 6.6, b: 1, a: 'start' }) + K.t(170, 120, 'Puntas', { s: 6.6, b: 1, a: 'start' }); },
      intro: 'Aclarado pintado a mano alzada que se intensifica hacia las puntas, sin papel de aluminio.',
      q: [['¿En qué se diferencia de las mechas?', 'Se pinta a mano libre y la raíz queda natural.'], ['¿Por qué crece con poca marca?', 'El color empieza a varios centímetros de la raíz.'], ['¿Qué se usa para tapar los mechones pintados?', 'Plástico o algodón, no papel cerrado.']],
      porque: 'El aclarado degradado imita cómo el sol aclara más las puntas.' },
    { id: 'pe_matizar', fam: 'col', n: 'Matizar el amarillo',
      d: function (K) { var s = K.suelo(100, 132, 90); s += K.r(20, 40, 40, 60, 4, '#F2D86A') + K.t(40, 112, 'Amarillo', { s: 6.8, b: 1 }) + K.t(76, 74, '+', { s: 14, b: 1 }) + K.c(100, 70, 20, C.violeta) + K.t(100, 112, 'Violeta', { s: 6.8, b: 1 }) + K.t(130, 74, '=', { s: 14, b: 1 }) + K.r(144, 40, 40, 60, 4, '#EDEAE0') + K.t(164, 112, 'Rubio frío', { s: 6.8, b: 1 }); return s + K.t(100, 24, 'Colores opuestos se neutralizan', { s: 7, b: 1 }); },
      intro: 'El matiz violeta anula el amarillo que queda después de decolorar.',
      q: [['¿Qué color neutraliza el naranja?', 'El azul.'], ['¿Y el rojo?', 'El verde.'], ['¿Qué pasa si el matiz se deja demasiado?', 'El pelo puede quedar grisáceo o lila.']],
      porque: 'En la rueda de color, dos opuestos mezclados dan un tono neutro.' },
    { id: 'pe_proporcion_mezcla', fam: 'col', n: 'Proporción tinte : oxidante',
      d: function (K) { var t = [['1 : 1', 60, 60], ['1 : 1,5', 60, 90], ['1 : 2', 60, 120]], s = K.suelo(100, 140, 90); t.forEach(function (q, i) { var x = 40 + i * 60, y = 30; s += K.r(x - 18, y, 16, q[1] * .6, 2, C.tinte) + K.r(x + 2, y, 16, q[2] * .6, 2, '#9CCBE6') + K.t(x, 120, q[0], { s: 8, b: 1 }) + K.t(x, 132, q[1] + ' g + ' + q[2] + ' ml', { s: 6 }); }); return s + K.t(100, 18, 'Tinte (morado) · oxidante (azul)', { s: 6.4 }); },
      intro: 'Cada marca indica cuánto oxidante lleva el tinte; la proporción cambia el resultado.',
      q: [['Con 60 g de tinte a 1:1,5, ¿cuánto oxidante?', '90 ml.'], ['¿Qué pasa si se pone menos oxidante?', 'El tinte no se desarrolla bien y el color dura menos.'], ['¿Cómo se mide con exactitud?', 'Con báscula y probeta graduada.']],
      porque: 'El oxidante debe bastar para abrir la cutícula y desarrollar todo el pigmento.' },
    /* ─────────── PEINADOS ─────────── */
    { id: 'pe_semirrecogido', fam: 'pei', n: 'Semirrecogido',
      d: function (K) { var s = K.suelo(100, 140, 60) + K.p('M56 50 Q56 18 100 16 Q144 18 144 50 L150 132 L50 132 Z', C.peloC) + K.e(100, 46, 30, 22, C.pelo); for (var i = 0; i < 5; i++) s += K.l('M' + (62 + i * 18) + ' 70 q4 30 0 60', K.oscuro(C.peloC, .15), { w: 1.2 }); return s + K.r(92, 60, 16, 7, 3, '#E88AA8'); },
      rot: [['Parte de arriba recogida', 100, 46, 160, 24], ['Resto suelto', 130, 110, 176, 120]],
      intro: 'Se recoge solo la parte superior y el resto queda suelto: despeja la cara sin perder largo.',
      q: [['¿Hasta dónde se toma el pelo de arriba?', 'De sien a sien, por encima de las orejas.'], ['¿Cómo se gana volumen en la coronilla?', 'Con un cardado ligero en la raíz.'], ['¿Qué ocasión es adecuada?', 'Diario, graduaciones e invitadas de boda.']],
      porque: 'Al levantar la parte superior, el peso del resto mantiene el peinado en su sitio.' },
    { id: 'pe_ondas_plancha', fam: 'pei', n: 'Ondas con plancha',
      d: function (K) { var s = K.suelo(100, 140, 80); for (var i = 0; i < 5; i++) s += K.l('M' + (40 + i * 10) + ' 20 q-12 14 0 28 q12 14 0 28 q-12 14 0 28 q12 14 0 28', i % 2 ? C.peloC : C.rubio, { w: 4 }); s += '<g transform="rotate(-30 140 76)">' + K.r(100, 66, 80, 10, 4, '#2A2A30') + K.r(100, 78, 80, 10, 4, '#2A2A30') + K.r(150, 74, 30, 6, 1, '#C8C8CC') + '</g>'; return s + K.flecha(120, 110, 150, 100, '#E9772E', { w: 1, curva: [140, 120] }) + K.t(140, 132, 'Girar media vuelta y bajar', { s: 6.4, b: 1 }); },
      intro: 'Se pinza el mechón, se gira la plancha media vuelta y se desliza despacio hacia abajo.',
      q: [['¿Qué ancho de mechón se toma?', 'De 2 a 4 cm.'], ['¿Qué pasa si se baja muy rápido?', 'La onda no se marca.'], ['¿Cómo se deja un efecto natural?', 'Alternando el sentido de giro en cada mechón.']],
      porque: 'La plancha calienta el mechón mientras está doblado; al enfriar, conserva la curva.' },
    { id: 'pe_extensiones', fam: 'pei', n: 'Extensiones de pelo',
      d: function (K) { var s = K.suelo(100, 136, 80) + K.r(30, 20, 140, 18, 2, '#F0C8A8'); for (var i = 0; i < 10; i++) s += K.l('M' + (40 + i * 13) + ' 38 L' + (40 + i * 13) + ' 70', C.pelo, { w: 2 }); s += K.r(36, 64, 128, 8, 3, '#C8C8CC'); for (var j = 0; j < 14; j++) s += K.l('M' + (40 + j * 9) + ' 72 L' + (40 + j * 9) + ' 128', C.peloC, { w: 2 }); return s; },
      rot: [['Pelo natural', 60, 50, 20, 50], ['Unión (cortina, clip o queratina)', 100, 68, 150, 94], ['Extensión', 140, 110, 186, 126]],
      intro: 'Mechones añadidos al pelo natural para dar largo o volumen; se fijan con clips, cinta o queratina.',
      q: [['¿A qué distancia de la raíz se pone la unión?', 'Aproximadamente 1 cm, para no tirar del cuero cabelludo.'], ['¿Cada cuánto se recolocan las de cinta?', 'Cada 6 a 8 semanas.'], ['¿Qué tipo se quita en casa?', 'Las de clip.']],
      porque: 'El peso debe repartirse entre muchos puntos para no dañar los folículos.' },
    /* ─────────── EL CABELLO ─────────── */
    { id: 'pe_caida', fam: 'cab', n: 'Caída normal de pelo',
      d: function (K) { var s = K.suelo(100, 136, 90) + K.r(20, 20, 160, 100, 6, C.papel); for (var i = 0; i < 18; i++) { var x = 34 + (i * 37) % 130, y = 34 + (i * 23) % 70; s += K.l('M' + x + ' ' + y + ' q8 ' + (6 + i % 4) + ' 18 ' + (2 - i % 3), C.pelo, { w: 1 }); } return s + K.t(100, 132, 'Normal: 50 a 100 pelos al día', { s: 7.4, b: 1 }); },
      intro: 'Perder entre 50 y 100 pelos al día es normal: son los que terminan su ciclo.',
      q: [['¿Cuándo hay que consultar?', 'Si la caída dura meses, hay zonas sin pelo o picor y dolor.'], ['¿Qué la aumenta temporalmente?', 'El estrés, el posparto, dietas estrictas o una enfermedad con fiebre.'], ['¿Cuántos pelos tiene la cabeza?', 'Entre 100 000 y 150 000.']],
      porque: 'Cada folículo tiene su propio ciclo: unos pelos caen mientras otros crecen.' },
    { id: 'pe_caspa', fam: 'cab', n: 'Caspa y cuero cabelludo',
      d: function (K) { var s = K.suelo(100, 132, 90) + K.r(16, 40, 80, 70, 4, '#F4D8C0') + K.r(104, 40, 80, 70, 4, '#F4D8C0'); for (var i = 0; i < 8; i++) s += K.l('M' + (24 + i * 9) + ' 40 L' + (24 + i * 9) + ' 20', C.pelo, { w: 1.6 }) + K.l('M' + (112 + i * 9) + ' 40 L' + (112 + i * 9) + ' 20', C.pelo, { w: 1.6 }); s += K.puntos([[120, 60], [140, 70], [160, 56], [130, 90], [170, 86], [150, 98], [116, 78]], 3.4, '#FFFFFF'); return s + K.t(56, 124, 'Sano', { s: 7.4, b: 1, c: C.ok }) + K.t(144, 124, 'Con caspa', { s: 7.4, b: 1, c: C.mal }); },
      intro: 'La caspa son escamas de piel que se desprenden más rápido de lo normal.',
      q: [['¿Qué champú se recomienda?', 'Uno anticaspa con zinc piritiona o ketoconazol.'], ['¿Es contagiosa?', 'No.'], ['¿Cuándo se deriva al dermatólogo?', 'Si hay heridas, placas rojas o no mejora en un mes.']],
      porque: 'Un hongo natural de la piel, si crece de más, acelera la renovación de las células.' },
    { id: 'pe_densidad', fam: 'cab', n: 'Densidad del cabello',
      d: function (K) { var t = [['Baja', 6], ['Media', 12], ['Alta', 20]], s = K.suelo(100, 132, 90); t.forEach(function (q, i) { var x = 22 + i * 56; s += K.r(x, 40, 44, 44, 2, '#F4D8C0'); for (var j = 0; j < q[1]; j++) s += K.c(x + 5 + (j * 17) % 36, 45 + Math.floor(j * 17 / 36) * 7 % 36, 1.6, C.pelo); s += K.t(x + 22, 100, q[0], { s: 7.4, b: 1 }); }); return s + K.t(100, 120, 'Pelos por cm² de cuero cabelludo', { s: 6.6 }) + K.t(100, 28, 'Se mira separando una raya', { s: 6.6, b: 1 }); },
      intro: 'La densidad es cuántos pelos hay en un cm²; no es lo mismo que el grosor.',
      q: [['¿Cómo se observa?', 'Separando una raya y mirando cuánto cuero cabelludo se ve.'], ['¿Qué corte conviene a densidad baja?', 'Líneas rectas y pocas capas para que se vea más pelo.'], ['¿Cuántos pelos por cm² es lo normal?', 'Entre 200 y 300.']],
      porque: 'Con mucha densidad hay que quitar peso; con poca, se conserva para dar cuerpo.' },
    /* ─────────── SEGURIDAD Y NEGOCIO ─────────── */
    { id: 'pe_electricidad', fam: 'seg', n: 'Aparatos eléctricos y agua',
      d: function (K) { var s = K.suelo(100, 136, 90) + K.r(20, 30, 70, 90, 4, '#FFFFFF') + K.r(28, 50, 24, 36, 4, '#E8E8E8') + K.c(36, 64, 2.6, '#555') + K.c(44, 64, 2.6, '#555') + K.l('M52 70 Q70 90 66 110', '#2A2A30', { w: 2 }) + K.t(55, 112, 'Cable sano, sin agua', { s: 6, b: 1, c: C.ok }); s += K.r(110, 30, 70, 90, 4, '#FFFFFF') + K.e(145, 100, 26, 8, '#9CCBE6') + K.r(126, 60, 30, 14, 4, '#2A2A30') + K.l('M140 74 L144 94', '#2A2A30', { w: 2 }) + K.l('M132 40 L158 66 M158 40 L132 66', C.mal, { w: 3 }); return s + K.t(145, 112, 'Nunca cerca del lavabo', { s: 6, b: 1, c: C.mal }); },
      intro: 'Secador, plancha y máquina se desenchufan al terminar y nunca se usan cerca del agua.',
      q: [['¿Qué se revisa a diario?', 'Que cables y enchufes no estén pelados ni calientes.'], ['¿Cómo se desenchufa?', 'Tirando de la clavija, nunca del cable.'], ['¿Qué protege la instalación?', 'El diferencial, que corta la luz si hay fuga.']],
      porque: 'El agua conduce la electricidad: una fuga pasa al cuerpo y causa una descarga.' },
    { id: 'pe_venta_productos', fam: 'seg', n: 'Recomendar productos',
      d: function (K) { var s = K.suelo(100, 136, 90) + K.r(16, 30, 90, 90, 3, C.papel) + K.t(24, 44, 'Ticket del día', { s: 7.4, b: 1, a: 'start' }); [['Servicio', '33,00'], ['Champú color', '12,00'], ['Mascarilla', '15,00'], ['Total', '60,00']].forEach(function (q, i) { s += K.t(24, 62 + i * 14, q[0], { s: 6.4, a: 'start', b: i === 3 ? 1 : 0 }) + K.t(98, 62 + i * 14, q[1], { s: 6.4, a: 'end', b: i === 3 ? 1 : 0 }); }); s += K.cil(134, 50, 10, 60, C.tinte) + K.r(129, 40, 10, 10, 2, '#2A2A30') + K.cil(164, 76, 16, 34, '#F7F4EE') + K.e(164, 76, 14, 4, '#6E9A4E'); return s; },
      intro: 'Recomendar lo que el cliente necesita para cuidar el servicio en casa sube el ticket medio.',
      q: [['¿Qué es el ticket medio?', 'Lo que gasta de media cada cliente en una visita.'], ['¿Cuándo se recomienda un producto?', 'Explicando el servicio, no al cobrar por sorpresa.'], ['Con 40 clientes y 60,00 de ticket, ¿cuánto se factura?', '2400,00.']],
      porque: 'El color cuidado con champú adecuado dura más: el cliente gana y el salón también.' }
  ];
  MO.agregar('pelu', L);
})();
