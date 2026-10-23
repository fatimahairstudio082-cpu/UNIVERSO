/* b6_color_fatima.js — 22-10-2026 (Fátima): clases nuevas de colorimetría con sus palabras, de sus documentos de Drive
   («peroxido explicacion», «explicadole a claude…», «tipos de formulas de color…», «Hablemos de cómo aplicar los tintes en
   bases con canas», «Técnicas para realizar una super mezcla») y de lo que explicó en la conversación (estrella de Howard,
   nomenclatura). Se añaden a EU_COLOR_CEREBRO.clases con el mismo formato que b6_color_cerebro_1/2/3; el motor
   (b6_color_cerebro_motor.js) las anima en el maniquí, en el libro y en el curso, como las demás.
   Nivel en el código (_p principiante · _i intermedio · _a avanzado): propuesto, lo decide Fátima.
   No toca ninguna clase existente. Cargar después de b6_color_cerebro_3.js y antes de b6_pelu_depurado.js. */
(function () {
  'use strict';
  var B = window.EU_COLOR_CEREBRO; if (!B || !B.clases || window.EU_COLOR_FATIMA) return;
  var F = 'fatima';
  var NUEVAS = [
    { id: 'fat_p01', n: 'La fórmula del peróxido — cada volumen y su uso', cat: 'Tinte', t: 'tinte', u: 'cb_color_global', src: F, dur: '12 min',
      tools: ['Peróxido 10 vol', 'Peróxido 20 vol', 'Peróxido 30 vol', 'Peróxido 40 vol', 'Bol', 'Medidor'],
      vds: 'Antes de aplicar cualquier tinte hay que conocer la química del peróxido.',
      b: [['punto', 'El peróxido, también llamado oxidante o revelador, es el químico que activa el tinte, abre la cutícula y permite que el color entre al cabello.'],
        ['punto', 'Cada volumen tiene un porcentaje de concentración real de peróxido de hidrógeno: cuanto mayor el porcentaje, más fuerte la oxidación.'],
        ['punto', '10 volúmenes: para depositar color. No aclara ningún tono ni provoca oxidación.'],
        ['punto', '20 volúmenes: aclara de uno a dos tonos. Se usa para aplicar tintes y en cubrimiento de cana.'],
        ['punto', '30 volúmenes: aclara de dos a tres tonos. Ideal para decoloración; refuerza los superaclarantes y sirve para cana gruesa.'],
        ['alerta', '⚠️ 40 volúmenes: aclara de tres a cuatro tonos. Decoloraciones y superaclarantes, pero mucho cuidado: antes hay que hacer un buen diagnóstico del cabello.'],
        ['importante', '📌 El peróxido al aclarar también aporta tonos de oxidación: mientras más volumen, más oxidación en el tono que se trabaja.'],
        ['punto', 'Con tinte, la fórmula depende de la marca: todos los tintes la traen en el empaque. Regularmente es uno más uno, o uno más uno y medio.'],
        ['punto', 'Con decolorante, la fórmula regularmente es uno más dos.'],
        ['tip', '💡 En balayage y mechas el volumen depende de la consistencia del cabello, del proceso que ya trae y del color que la persona quiere.']] },

    { id: 'fat_p02', n: 'Cómo sacar la cuenta del color — sumar y dividir', cat: 'Mezclas', t: 'mezcla', u: 'cb_color_global', src: F, dur: '15 min',
      tools: ['Carta de colores', 'Bol', 'Peróxido', 'Báscula'],
      vds: 'La colorimetría es sumar y dividir, siempre contando la base de la clienta.',
      b: [['importante', '📌 Primero se suma la base, el color que la clienta tiene en el cabello, con el color que quiere. Si no se saca la cuenta de la base, queda otro tono.'],
        ['punto', 'Se suman los números de los colores: la base de la clienta y los tintes que se preparan en el recipiente.'],
        ['punto', 'Se divide el resultado entre la cantidad de colores que se sumaron: dos, tres o cuatro.'],
        ['punto', 'Se agarran los tres primeros números del resultado: ese es el color que se está realizando.'],
        ['punto', 'Ejemplo: la clienta tiene un 6 y quiere un 7.5 de la carta. Seis más nueve, quince. Quince entre dos, siete y medio. Con peróxido de 20 volúmenes.'],
        ['punto', 'Ejemplo: 7.22 más 7.25 da 14.47. Entre dos, 7.235. Con los tres primeros números queda 7.23.'],
        ['punto', 'Los tintes con reflejo también se suman con su número completo: 7.1, 8.22, 8.23… El tinte ya trae un poquito de ese color.'],
        ['tip', '💡 Los números son ejemplos: esto es infinito. Lo que se aprende es la técnica de sumar y dividir; al dominarla, ya sabe defenderse.']] },

    { id: 'fat_p03', n: 'Nomenclatura — cómo se lee un tinte', cat: 'Tinte', t: 'tinte', u: 'cb_color_global', src: F, dur: '10 min',
      tools: ['Carta de colores', 'Tintes'],
      vds: 'El número antes del punto es la altura; después del punto, los reflejos.',
      b: [['punto', 'El número antes del punto es la altura de tono, del 1 al 10: la concentración de color. Un tinte que dice 5 trae color natural.'],
        ['punto', 'El primer número después del punto es el reflejo principal. Un 5.1 lleva un reflejo ligado: castaño claro ceniza.'],
        ['punto', 'El segundo número después del punto es el reflejo secundario: pesa menos, pero se nota. 8.13 es rubio claro ceniza con un toque dorado.'],
        ['punto', 'Número repetido, como .11 o .22: el mismo reflejo, intenso. Un 0 delante del reflejo, como .01: natural con un toque de ese reflejo.'],
        ['punto', 'Un 0 delante del punto, como 0.1 o 0.22: corrector, el pigmento puro sin altura, que se liga con otros tintes.'],
        ['importante', '📌 Del .7 en adelante cada marca usa su propia numeración: siempre se confirma en la carta de la marca que se use.']] },

    { id: 'fat_i01', n: 'La estrella de Howard explicada fácil', cat: 'Matización', t: 'matizacion', u: 'cb_quim_decoloracion', src: F, dur: '12 min',
      tools: ['Estrella de Howard', 'Carta de colores', 'Correctores'],
      vds: 'En internet sale la estrella, pero nadie explica cómo usarla: los opuestos se anulan.',
      b: [['punto', 'Los colores primarios son amarillo, rojo y azul. De esos tres salen todos los demás: por eso los colores son infinitos.'],
        ['punto', 'Fríos: azul, verde y violeta. Cálidos: amarillo, naranja y rojo.'],
        ['importante', '📌 La regla de oro: los opuestos se anulan. Naranja con azul, amarillo con violeta, rojo con verde. Así se neutraliza y se matiza.'],
        ['punto', 'Amarillo con un poquito de violeta da beige o natural; un poco más, perla o irisado; demasiado, el cabello queda morado.'],
        ['punto', 'Azul con verde son vecinos fríos: no se anulan, se refuerzan. En el cabello dan un reflejo mate y sirven para apagar bases rojizas o cobrizas.'],
        ['punto', 'Al aclarar, un nivel 4 a 6 suelta rojo anaranjado, y se neutraliza con 0.7 verde, que es el opuesto del rojo.']] },

    { id: 'fat_i02', n: 'Tintes en bases con canas — dos fórmulas', cat: 'Tinte', t: 'tinte', u: 'cb_color_global', src: F, dur: '15 min',
      tools: ['Tinte', 'Peróxido 20 vol', 'Peróxido 30 vol', 'Dos boles', 'Brocha'],
      vds: 'Con canas, un solo producto de raíz a punta muchas veces no cubre.',
      b: [['punto', 'Con 30 o 40 % de canas desde la raíz se preparan dos fórmulas del mismo tinte, del mismo color.'],
        ['punto', 'La primera, más concentrada: por ejemplo la mitad del tinte, 50 gramos, con peróxido de 20, solo en la raíz, hasta donde llegan las canas: tres o cuatro dedos.'],
        ['punto', 'Se aplica en toda la raíz, capa por capa, cubriendo bien con la brocha.'],
        ['punto', 'La segunda fórmula, con el mismo tinte y peróxido de 30, se aplica desde donde terminó la primera hacia abajo.'],
        ['punto', 'Se deja reposar 10 minutos y se mira el color. Se masajea el cabello para que la concentración se ligue y se deja 45 minutos.'],
        ['punto', 'Se quita el producto, se lava, se seca y se termina como pida la clienta: solo secado o planchado.'],
        ['importante', '📌 Cuando se habla de «agua de 30» no es agua: es peróxido de 30 volúmenes.']] },

    { id: 'fat_i03', n: 'Matizar después de la decoloración', cat: 'Matización', t: 'matizacion', u: 'cb_quim_decoloracion', src: F, dur: '10 min',
      tools: ['Tinte o matizador', 'Peróxido 10 vol', 'Peróxido 20 vol', 'Bol', 'Pincel'],
      vds: 'Una decoloración no significa que el cabello va a quedar así.',
      b: [['importante', '📌 Después de una decoloración siempre se matiza, a menos que llegue al tono que la persona anda buscando.'],
        ['punto', 'En balayage y mechas, para neutralizar y matizar con tinte se prepara la fórmula con peróxido de 10 o de 20.'],
        ['punto', 'Se deja aproximadamente 5, 10 o 15 minutos, dependiendo del caso.'],
        ['punto', 'Si quedó al tono que la persona quería y no quiere tinte, no se matiza: se hidrata con fórmulas naturales, se lava, se seca y se plancha.']] },

    { id: 'fat_a01', n: 'Supermezcla — el color de la foto que no está en la carta', cat: 'Mezclas', t: 'mezcla', u: 'cb_color_global', src: F, dur: '20 min',
      tools: ['Tintes del 1 al 10', 'Carta de colores', 'Bol', 'Peróxido 20 vol', 'Báscula'],
      vds: 'Fabricar el color que la clienta quiere con los tintes que hay en el salón.',
      b: [['punto', 'La clienta quiere un tono de una fotografía, pero en el salón no está. Con la variedad de tintes del 1 al 10 se puede realizar.'],
        ['punto', 'Ejemplo: un 7 más un 10. Siete más diez, diecisiete. Como se mezclan dos tintes, entre dos: 8.5. Ese es el color personalizado.'],
        ['punto', 'Peróxido para ese caso: 20 volúmenes.'],
        ['punto', 'Aquí se habla de mezcla: se mezclan dos, tres o cuatro tintes en el mismo recipiente, y de esos tintes sale un solo color.'],
        ['punto', 'La supermezcla sirve para fabricar un color, para realizar un matiz y para realizar una neutralización.'],
        ['tip', '💡 Se liga poco a poco: 10, 20, 50 o 100 gramos, según la cantidad de cabello. La liga no se guarda: se aplica de una vez.']] },

    { id: 'fat_a02', n: 'Del negro al rubio — tumbar el negro', cat: 'Corrección de Color', t: 'tinte', u: 'cb_quim_decoloracion', src: F, dur: '25 min',
      tools: ['Polvo decolorante', 'Peróxido 40 vol', 'Jabón de panela', 'Rallador', 'Aceite de oliva', 'Clara de huevo', 'Gorro térmico'],
      vds: 'Del negro no se sale en una sola visita: primero se tumba, con proceso e hidratación.',
      b: [['importante', '📌 Antes de decolorar: prueba de mechón, para ver hasta dónde resiste el cabello y si se puede hacer el procedimiento.'],
        ['punto', 'Si el cabello está chicloso o no tiene consistencia, porque agarró un contraste naranja: jabón de panela rallado con peróxido de 40, bien diluido, y una cucharada de aceite de oliva.'],
        ['punto', 'Se aplica mecha a mecha, finito, aproximadamente 30 minutos.'],
        ['punto', 'Hidratación con clara de huevo y aceite de oliva, o con sábila, 45 minutos con gorro térmico.'],
        ['punto', 'Se mira qué contraste agarró: va a quedar manchado, porque el negro no es fácil de tumbar. La clienta se hace mascarilla en casa.'],
        ['punto', 'A los 15 días se repite, hasta llegar a un tono en el que se pueda hacer el cambio de color.'],
        ['punto', 'Después se suma el tono que tiene con el que desea, se neutraliza y se aplica el tinte base, el que la persona quiere.']] }
  ];
  /* sus clases van primero en su unidad (las demás no cambian de orden entre sí): así entran en las páginas de la unidad
     y no solo en el anexo */
  var ya = {}; B.clases.forEach(function (c) { ya[c.id] = 1; });
  var porU = {}; NUEVAS.forEach(function (c) { if (!ya[c.id]) (porU[c.u] = porU[c.u] || []).push(c); });
  Object.keys(porU).forEach(function (u) {
    var i = -1; B.clases.some(function (c, k) { if (c.u === u) { i = k; return true; } return false; });
    if (i < 0) i = B.clases.length;
    B.clases.splice.apply(B.clases, [i, 0].concat(porU[u]));
  });
  window.EU_COLOR_FATIMA = { clases: NUEVAS.map(function (c) { return c.id; }) };
})();
