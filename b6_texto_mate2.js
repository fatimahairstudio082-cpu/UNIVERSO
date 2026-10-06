/* b6_texto_mate2.js — banco de contenido escrito de Matemáticas (2/2). Mismo formato que b6_texto_mate.js.
   Redactado por el sistema · a revisar por Fátima. */
(function () {
  'use strict';
  var B = window.EU_TEXTO_BANCO = window.EU_TEXTO_BANCO || {};
  var M = B.mate = B.mate || {};

  M.mat_porc = {
    intro: 'Rebajas, impuestos, intereses, propinas o la batería del móvil: los porcentajes están en todas partes. Saber calcularlos evita pagar de más y ayuda a comparar ofertas.',
    des: [
      ['Qué es un porcentaje', 'Un porcentaje es una fracción de denominador 100: el 25 % significa 25 de cada 100, es decir, 25/100 = 0,25 = 1/4.', 'ma_porcentaje_100'],
      ['Calcular el tanto por ciento', 'Para calcular un porcentaje de una cantidad se multiplica por el porcentaje en forma decimal: el 15 % de 80 es 80 · 0,15 = 12.', 'ma_equivalencias'],
      ['Descuentos', 'Un descuento se resta. Atajo: con un descuento del 20 % pagas el 80 %, así que basta multiplicar por 0,80.', 'ma_descuento'],
      ['Impuestos', 'El {imp} de tu país es del {impP} % y se suma al precio sin impuesto (la base imponible). Atajo: con un impuesto del 10 % pagas el 110 %, es decir, multiplicas por 1,10.', 'ma_equivalencias'],
      ['Regla de tres', 'Cuando dos cantidades son proporcionales, si 100 corresponde a un total, cualquier parte se calcula con una regla de tres directa.', 'ma_regla_tres']
    ],
    ej: [
      { e: 'Calcula el 15 % de {$80}.', pasos: ['15 % = 15/100 = 0,15.', '80 · 0,15 = 12.'], s: '{$12}', x: 'Calcular un porcentaje es multiplicar por su forma decimal.' },
      { e: 'Unas zapatillas cuestan {$60} y tienen un 25 % de descuento. ¿Cuánto se paga?', pasos: ['Descuento: 60 · 0,25 = 15.', 'Precio final: 60 − 15 = 45.', 'Atajo: 60 · 0,75 = 45.'], s: '{$45}', x: 'Con un 25 % de descuento se paga el 75 %.' },
      { e: 'Un producto vale {$200} sin impuestos y lleva un impuesto del 10 %. ¿Cuál es el precio final?', pasos: ['Impuesto: 200 · 0,10 = 20.', 'Precio final: 200 + 20 = 220.', 'Atajo: 200 · 1,10 = 220.'], s: '{$220}', x: 'El impuesto se suma a la base imponible.' },
      { e: 'En una clase de 30 estudiantes, 12 llevan gafas. ¿Qué porcentaje es?', pasos: ['Fracción: 12/30 = 0,4.', '0,4 · 100 = 40.'], s: '40 %', x: 'Parte entre total, multiplicado por 100.' },
      { e: 'Un precio sube de {$50} a {$60}. ¿Qué porcentaje ha subido?', pasos: ['Aumento: 60 − 50 = 10.', 'Respecto al precio inicial: 10/50 = 0,2.', '0,2 · 100 = 20.'], s: '20 %', x: 'La variación se compara siempre con la cantidad inicial.' }
    ],
    err: [['Restar el porcentaje como si fuera dinero (60 − 25 = 35).', 'El 25 % es una parte del precio: primero calcúlala.'], ['Calcular el aumento respecto al precio final.', 'Los porcentajes de cambio se calculan sobre la cantidad inicial.']],
    cur: 'El símbolo % nació de abreviar «por ciento» en manuscritos italianos del siglo XV: «per cento» → «p cento» → «%».',
    con: 'Un porcentaje es una fracción sobre 100. Se calcula multiplicando por su forma decimal; los descuentos se restan y los impuestos se suman, y los atajos (×0,75, ×1,10) ahorran pasos.',
    voc: [['porcentaje', 'Fracción de denominador 100.'], ['descuento', 'Cantidad que se resta al precio.'], ['base imponible', 'Precio sobre el que se calcula el impuesto.'], ['regla de tres', 'Método para calcular una cantidad proporcional.']]
  };

  M.mat_presu = {
    intro: 'Un presupuesto es el mapa del dinero de una casa o de un negocio. Saber lo que entra y lo que sale cada mes permite decidir con calma, ahorrar y evitar deudas.',
    des: [
      ['Ingresos y gastos', 'Los ingresos son el dinero que entra (salario, ventas, ayudas). Los gastos son lo que sale. El saldo es ingresos menos gastos.', 'ma_dinero'],
      ['Gastos fijos y variables', 'Los fijos se repiten cada mes con el mismo importe (alquiler, cuotas); los variables cambian (comida, transporte, ocio). Es en los variables donde más se puede ajustar.', 'ma_sectores'],
      ['Primero el ahorro', 'Apartar un porcentaje fijo para ahorro al cobrar funciona mejor que ahorrar lo que sobra al final del mes.', 'ma_porcentaje_100'],
      ['Ver el reparto', 'Un gráfico de sectores muestra qué parte del ingreso va a cada gasto y ayuda a detectar dónde se va el dinero.', 'ma_sectores']
    ],
    ej: [
      { e: 'Una familia ingresa {$1800} al mes. Gastos fijos: {$900}; variables: {$650}. ¿Cuál es el saldo?', pasos: ['Gastos totales: 900 + 650 = 1550.', 'Saldo: 1800 − 1550 = 250.'], s: '{$250} a favor', x: 'Si el saldo es positivo, entra más de lo que sale.' },
      { e: 'Con un ingreso de {$1500}, ¿cuánto se aparta si se ahorra el 10 % al cobrar?', pasos: ['10 % = 0,10.', '1500 · 0,10 = 150.'], s: '{$150} al mes', x: 'Ahorrar un porcentaje fijo al cobrar asegura el ahorro.' },
      { e: 'Si se ahorran {$150} al mes, ¿cuánto se tiene en un año?', pasos: ['Un año tiene 12 meses.', '150 · 12 = 1800.'], s: '{$1800}', x: 'Sin contar intereses, el ahorro anual es el mensual por 12.' },
      { e: 'La comida supone {$450} de un ingreso de {$1800}. ¿Qué porcentaje es?', pasos: ['450 / 1800 = 0,25.', '0,25 · 100 = 25.'], s: '25 %', x: 'Parte entre total por 100.' }
    ],
    err: [['Olvidar gastos anuales (seguros, matrículas).', 'Divídelos entre 12 y súmalos a los gastos de cada mes.'], ['Ahorrar solo «lo que sobra».', 'Aparta el ahorro primero, como un gasto fijo más.']],
    cur: 'La regla «50/30/20» propone repartir el ingreso en 50 % necesidades, 30 % deseos y 20 % ahorro. Es una guía orientativa, no una ley.',
    con: 'Un presupuesto compara ingresos y gastos. Distinguir fijos y variables y apartar primero el ahorro ayuda a tener un saldo positivo cada mes.',
    voc: [['ingreso', 'Dinero que entra.'], ['gasto fijo', 'Gasto que se repite igual cada mes.'], ['gasto variable', 'Gasto que cambia cada mes.'], ['saldo', 'Ingresos menos gastos.'], ['ahorro', 'Parte del ingreso que se guarda.']]
  };

  M.mat_geo_plana = {
    intro: 'Mira a tu alrededor: ventanas rectangulares, señales triangulares, baldosas hexagonales. Son polígonos, y medir su borde y su superficie sirve para poner un marco, pintar una pared o embaldosar un suelo.',
    des: [
      ['Qué es un polígono', 'Un polígono es una figura plana y cerrada formada por segmentos rectos llamados lados. Según su número de lados es triángulo (3), cuadrilátero (4), pentágono (5), hexágono (6)…', 'ma_poligonos'],
      ['Polígonos regulares', 'Un polígono es regular si todos sus lados y todos sus ángulos son iguales, como el cuadrado o el hexágono de una colmena.', 'ma_poligonos'],
      ['El perímetro', 'El perímetro es la longitud del borde: la suma de todos los lados. Se mide en unidades de longitud (cm, m).', 'ma_perimetro'],
      ['El área', 'El área es la superficie que ocupa la figura y se mide en unidades cuadradas (cm², m²). Rectángulo: base × altura. Triángulo: base × altura ÷ 2.', 'ma_area_rectangulo']
    ],
    ej: [
      { e: 'Calcula el perímetro de un rectángulo de 8 cm de largo y 5 cm de ancho.', pasos: ['El rectángulo tiene dos lados de 8 y dos de 5.', '8 + 5 + 8 + 5 = 26.'], s: '26 cm', x: 'El perímetro es la suma de todos los lados.' },
      { e: 'Calcula el área de ese mismo rectángulo.', pasos: ['Área = base × altura.', '8 × 5 = 40.'], s: '40 cm²', x: 'Caben 40 cuadraditos de 1 cm de lado.' },
      { e: 'Un triángulo tiene 10 m de base y 6 m de altura. ¿Cuál es su área?', pasos: ['Área = base × altura ÷ 2.', '10 × 6 = 60.', '60 ÷ 2 = 30.'], s: '30 m²', x: 'Un triángulo es la mitad de un rectángulo con su misma base y altura.' },
      { e: '¿Cuál es el perímetro de un hexágono regular de 4 cm de lado?', pasos: ['El hexágono tiene 6 lados iguales.', '6 × 4 = 24.'], s: '24 cm', x: 'En un polígono regular, perímetro = número de lados × lado.' },
      { e: 'Una habitación mide 4 m × 3 m. ¿Cuántas baldosas de 1 m² hacen falta?', pasos: ['Área del suelo: 4 × 3 = 12 m².', 'Cada baldosa cubre 1 m².'], s: '12 baldosas', x: 'El área dice cuántos cuadrados unidad cubren la superficie.' }
    ],
    err: [['Dar el perímetro en m² o el área en m.', 'Perímetro: longitud (m). Área: superficie (m²).'], ['Olvidar dividir entre 2 en el área del triángulo.', 'Piensa en el rectángulo y toma la mitad.']],
    cur: 'Las abejas construyen celdas hexagonales porque el hexágono encaja sin huecos y gasta poca cera para la superficie que encierra.',
    con: 'Los polígonos son figuras planas cerradas de lados rectos. El perímetro mide su borde y el área su superficie; cada uno con sus unidades.',
    voc: [['polígono', 'Figura plana cerrada de lados rectos.'], ['perímetro', 'Suma de las longitudes de los lados.'], ['área', 'Medida de la superficie.'], ['polígono regular', 'Polígono con lados y ángulos iguales.']]
  };

  M.mat_simetria = {
    intro: 'Una mariposa, una hoja, tu cara o un copo de nieve tienen algo en común: si los doblas por la mitad, las dos partes casi coinciden. Eso es la simetría, y junto con los giros y las traslaciones crea dibujos y mosaicos preciosos.',
    des: [
      ['Simetría axial', 'Una figura es simétrica si una línea, el eje de simetría, la divide en dos mitades iguales que coinciden al doblar, como en un espejo.', 'ma_simetria'],
      ['Cuántos ejes', 'Algunas figuras tienen varios ejes: el cuadrado tiene 4, el rectángulo 2, el círculo infinitos. Otras no tienen ninguno.', 'ma_simetria'],
      ['Giros y traslaciones', 'En una traslación la figura se desliza sin girar; en un giro da vueltas alrededor de un punto. En los dos casos no cambia de tamaño ni de forma.', 'ma_movimientos'],
      ['Mosaicos', 'Un mosaico repite una o varias figuras cubriendo el plano sin huecos ni solapes, usando traslaciones, giros y simetrías.', 'ma_movimientos']
    ],
    ej: [
      { e: '¿Cuántos ejes de simetría tiene un cuadrado?', pasos: ['Dos ejes unen los puntos medios de lados opuestos (vertical y horizontal).', 'Otros dos van por las diagonales.'], s: '4 ejes', x: 'En cada uno de los cuatro dobleces las mitades coinciden.' },
      { e: '¿Tiene eje de simetría la letra A? ¿Y la letra F?', pasos: ['La A se dobla por una línea vertical y sus mitades coinciden.', 'La F no se puede doblar de ninguna forma con mitades iguales.'], s: 'A: sí (1 eje). F: no', x: 'Un eje existe si las dos mitades coinciden al doblar.' },
      { e: 'Un cuadrado gira 90° alrededor de su centro. ¿Cómo queda?', pasos: ['90° es un cuarto de vuelta.', 'Cada vértice ocupa el lugar del siguiente.'], s: 'Queda igual que antes', x: 'El cuadrado tiene simetría de giro de 90°.' },
      { e: 'Traslada el punto (2, 3) cuatro unidades a la derecha.', pasos: ['A la derecha aumenta la coordenada x.', 'x: 2 + 4 = 6; y no cambia.'], s: '(6, 3)', x: 'En una traslación todos los puntos se mueven lo mismo y en la misma dirección.' }
    ],
    err: [['Contar como eje cualquier línea que divide en dos partes del mismo tamaño.', 'Las mitades deben coincidir al doblar, no solo medir lo mismo.'], ['Pensar que en un giro cambia la forma.', 'Girar o trasladar solo cambia la posición.']],
    cur: 'Los mosaicos de la Alhambra de Granada usan muchos de los tipos de simetría del plano que los matemáticos clasificaron siglos después.',
    con: 'La simetría divide una figura en mitades que coinciden; los giros y traslaciones la mueven sin deformarla. Con estos movimientos se crean mosaicos.',
    voc: [['simetría', 'Igualdad de las dos mitades de una figura respecto a un eje.'], ['eje de simetría', 'Línea que divide la figura en dos mitades iguales.'], ['giro', 'Movimiento alrededor de un punto.'], ['traslación', 'Deslizamiento sin girar.'], ['mosaico', 'Cubrimiento del plano sin huecos.']]
  };

  M.mat_pitagoras = {
    intro: 'Hace más de 2 500 años se descubrió una relación entre los lados de los triángulos rectángulos que hoy usan arquitectos, albañiles, navegadores y diseñadores de pantallas: el teorema de Pitágoras.',
    des: [
      ['El triángulo rectángulo', 'Tiene un ángulo de 90°. Los dos lados que forman ese ángulo son los catetos; el lado opuesto, el más largo, es la hipotenusa.', 'ma_triangulos_lados'],
      ['El teorema', 'En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos: a² = b² + c².', 'ma_pitagoras'],
      ['Calcular un cateto', 'Si se conoce la hipotenusa y un cateto, el otro se obtiene restando: b² = a² − c².', 'ma_pitagoras'],
      ['El truco 3-4-5', 'Como 3² + 4² = 5², un triángulo de lados 3, 4 y 5 siempre tiene un ángulo recto. Los albañiles lo usan para trazar esquinas rectas.', 'ma_angulos_tipos']
    ],
    ej: [
      { e: 'Los catetos miden 6 cm y 8 cm. ¿Cuánto mide la hipotenusa?', pasos: ['a² = 6² + 8² = 36 + 64 = 100.', 'a = √100.'], s: '10 cm', x: 'Se suman los cuadrados de los catetos y se saca la raíz.' },
      { e: 'La hipotenusa mide 13 m y un cateto 5 m. ¿Cuánto mide el otro?', pasos: ['b² = 13² − 5² = 169 − 25 = 144.', 'b = √144.'], s: '12 m', x: 'Para un cateto se resta, no se suma.' },
      { e: 'Una escalera de 5 m se apoya en una pared con el pie a 3 m. ¿A qué altura llega?', pasos: ['La escalera es la hipotenusa (5); el suelo, un cateto (3).', 'h² = 5² − 3² = 25 − 9 = 16.', 'h = √16.'], s: '4 m', x: 'Pared y suelo forman un ángulo recto.' },
      { e: '¿Es rectángulo un triángulo de lados 7, 24 y 25?', pasos: ['7² + 24² = 49 + 576 = 625.', '25² = 625.'], s: 'Sí', x: 'Si se cumple a² = b² + c², el triángulo es rectángulo.' },
      { e: 'Una pantalla mide 40 cm × 30 cm. ¿Cuánto mide su diagonal?', pasos: ['d² = 40² + 30² = 1600 + 900 = 2500.', 'd = √2500.'], s: '50 cm', x: 'La diagonal es la hipotenusa del triángulo que forman largo y ancho.' }
    ],
    err: [['Sumar los lados en vez de sus cuadrados (6 + 8 = 14).', 'Eleva al cuadrado, suma y luego saca la raíz.'], ['Aplicar el teorema a triángulos sin ángulo recto.', 'Solo vale en triángulos rectángulos.']],
    cur: 'Mucho antes que Pitágoras, los babilonios ya conocían ternas como 3-4-5; la tablilla Plimpton 322, de hace unos 3 800 años, recoge varias.',
    con: 'En todo triángulo rectángulo, a² = b² + c². Con el teorema calculamos un lado desconocido, comprobamos ángulos rectos y medimos diagonales.',
    voc: [['hipotenusa', 'Lado opuesto al ángulo recto; el más largo.'], ['cateto', 'Cada lado que forma el ángulo recto.'], ['ángulo recto', 'Ángulo de 90°.'], ['raíz cuadrada', 'Número que multiplicado por sí mismo da el dado.']]
  };

  M.mat_estad = {
    intro: 'Las encuestas, las previsiones del tiempo, los resultados deportivos o los juegos de azar usan estadística y probabilidad. Sirven para resumir muchos datos en pocos números y para medir lo probable que es algo.',
    des: [
      ['Recoger y ordenar datos', 'Los datos se organizan en una tabla de frecuencias: cada valor y cuántas veces aparece. Así se ven de un vistazo.', 'ma_frecuencias'],
      ['Media, mediana y moda', 'La media es la suma de los datos entre cuántos hay. La mediana es el valor central al ordenarlos. La moda es el dato que más se repite.', 'ma_media'],
      ['Gráficos', 'Las barras comparan cantidades, los sectores muestran partes de un total y las líneas enseñan cómo cambia algo con el tiempo.', 'ma_barras'],
      ['Probabilidad', 'La probabilidad de un suceso es casos favorables entre casos posibles, cuando todos son igual de probables. Va de 0 (imposible) a 1 (seguro).', 'ma_prob_dado']
    ],
    ej: [
      { e: 'Notas: 6, 8, 7, 9, 5. Calcula la media.', pasos: ['Suma: 6 + 8 + 7 + 9 + 5 = 35.', 'Hay 5 datos: 35 ÷ 5 = 7.'], s: 'Media = 7', x: 'La media reparte el total a partes iguales.' },
      { e: 'Halla la mediana de 3, 9, 4, 7, 5.', pasos: ['Ordenamos: 3, 4, 5, 7, 9.', 'El valor central (el 3.º de 5) es 5.'], s: 'Mediana = 5', x: 'La mediana deja la mitad de los datos a cada lado.' },
      { e: 'Halla la moda de 2, 3, 3, 5, 3, 2, 6.', pasos: ['Contamos: el 2 aparece 2 veces, el 3 aparece 3 veces, el resto 1.', 'El más repetido es el 3.'], s: 'Moda = 3', x: 'La moda es el valor con mayor frecuencia.' },
      { e: '¿Qué probabilidad hay de sacar un número par con un dado?', pasos: ['Casos posibles: 1, 2, 3, 4, 5, 6 → 6.', 'Casos favorables: 2, 4, 6 → 3.', '3/6 = 1/2.'], s: '1/2 = 0,5 = 50 %', x: 'Favorables entre posibles, con un dado no trucado.' },
      { e: 'Mediana de 4, 8, 6, 10 (número par de datos).', pasos: ['Ordenamos: 4, 6, 8, 10.', 'Hay dos centrales: 6 y 8.', 'Media de los dos: (6 + 8) ÷ 2 = 7.'], s: 'Mediana = 7', x: 'Con un número par de datos, la mediana es la media de los dos centrales.' }
    ],
    err: [['Calcular la mediana sin ordenar los datos.', 'Ordena siempre de menor a mayor.'], ['Dar una probabilidad mayor que 1.', 'Los favorables nunca pueden ser más que los posibles.']],
    cur: 'La probabilidad nació en el siglo XVII de una pregunta sobre juegos de dados que el caballero de Méré planteó a Pascal, quien la resolvió carteándose con Fermat.',
    con: 'La estadística resume datos con tablas, gráficos, media, mediana y moda; la probabilidad mide de 0 a 1 lo posible que es un suceso.',
    voc: [['media', 'Suma de los datos dividida entre su número.'], ['mediana', 'Valor central de los datos ordenados.'], ['moda', 'Dato más repetido.'], ['frecuencia', 'Número de veces que aparece un dato.'], ['probabilidad', 'Casos favorables entre casos posibles.']]
  };
})();
