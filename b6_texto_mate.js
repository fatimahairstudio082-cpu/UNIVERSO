/* b6_texto_mate.js — banco de contenido escrito de Matemáticas (1/2): unidades de Infantil a Bachillerato.
   Redactado por el sistema · a revisar por Fátima. Formato por unidad (clave = id de la unidad del currículo):
     intro  · párrafo de introducción
     des    · apartados [título, explicación, id del dibujo de la biblioteca SVG que lo ilustra]
     ej     · ejemplos resueltos { e: enunciado, pasos: [...], s: respuesta, x: por qué }
     err    · errores frecuentes [error, cómo evitarlo]
     cur    · curiosidad («¿Sabías que…?»)
     con    · conclusión
     voc    · vocabulario [término, definición] (pasa al glosario)
   Importes: «{$12.5}» se escribe con la moneda del país del libro. Lo usa b6_enciclopedia.js. */
(function () {
  'use strict';
  var B = window.EU_TEXTO_BANCO = window.EU_TEXTO_BANCO || {};
  var M = B.mate = B.mate || {};
  /* partes del libro (índice y portadilla de cada unidad) */
  M._partes = {
    mat_contar: 'Números y operaciones', mat_suma: 'Números y operaciones', mat_multi: 'Números y operaciones',
    mat_frac: 'Fracciones y porcentajes', mat_porc: 'Fracciones y porcentajes',
    mat_geo_plana: 'Geometría', mat_simetria: 'Geometría', mat_pitagoras: 'Geometría',
    mat_ecua: 'Álgebra y funciones', mat_func: 'Álgebra y funciones', mat_deriv: 'Álgebra y funciones',
    mat_estad: 'Estadística y probabilidad', mat_presu: 'Matemática financiera'
  };

  M.mat_contar = {
    intro: 'Contar es una de las primeras cosas que aprendemos. Contamos juguetes, frutas, amigos y escalones. En esta unidad vamos a contar despacio, de uno en uno, hasta llegar a diez.',
    des: [
      ['Uno para cada cosa', 'Cuando contamos, decimos un número para cada cosa y tocamos cada cosa una sola vez. Si tocamos dos veces la misma, el número sale mal.', 'ma_abaco'],
      ['El último número dice cuántos hay', 'Al terminar de contar, el último número que decimos es la cantidad. Si contamos «uno, dos, tres» y paramos, hay tres.', 'ma_regletas'],
      ['Las manos nos ayudan', 'Cada mano tiene cinco dedos. Con las dos manos tenemos diez dedos: diez es una mano y otra mano.', 'ma_bloques_base10'],
      ['Contar en la recta', 'Los números van en orden, uno detrás de otro: 1, 2, 3, 4, 5, 6, 7, 8, 9 y 10. Cada número es uno más que el anterior.', 'ma_recta_numerica']
    ],
    ej: [
      { e: 'En la mesa hay 🍎🍎🍎🍎. ¿Cuántas manzanas hay?', pasos: ['Tocamos la primera manzana y decimos «uno».', 'Tocamos la segunda: «dos».', 'Tocamos la tercera: «tres».', 'Tocamos la cuarta: «cuatro».'], s: '4 manzanas', x: 'El último número que dijimos es cuatro, así que hay cuatro manzanas.' },
      { e: 'Levanto una mano entera y dos dedos de la otra. ¿Cuántos dedos levanto?', pasos: ['Una mano entera son 5 dedos.', 'Seguimos contando desde 5: seis, siete.'], s: '7 dedos', x: 'Empezamos en 5 y contamos dos más: 6 y 7.' },
      { e: '¿Qué número va después del 8?', pasos: ['Decimos los números en orden: …, 7, 8.', 'El siguiente es 9.'], s: '9', x: 'Cada número es uno más que el anterior.' },
      { e: 'Hay 3 patos en el estanque y llega 1 más. ¿Cuántos patos hay ahora?', pasos: ['Contamos los patos que había: uno, dos, tres.', 'Llega uno más: seguimos con «cuatro».'], s: '4 patos', x: 'Si llega uno más, el número es el siguiente.' }
    ],
    err: [['Contar dos veces la misma cosa.', 'Separa o marca cada cosa cuando ya la has contado.'], ['Saltarse un número (1, 2, 4…).', 'Di los números en voz alta y despacio, en orden.']],
    cur: '¿Sabías que la palabra «dígito» viene de «dedo»? Usamos diez cifras porque tenemos diez dedos.',
    con: 'Ya sabes contar hasta diez: un número para cada cosa, en orden y sin repetir. El último número que dices es cuántas cosas hay.',
    voc: [['contar', 'Decir los números en orden, uno para cada cosa.'], ['cantidad', 'Cuántas cosas hay.'], ['diez', 'Los dedos de las dos manos juntas.']]
  };

  M.mat_suma = {
    intro: 'Sumamos cuando juntamos cosas y restamos cuando quitamos o queremos saber cuánto falta. Son las dos operaciones que más usamos cada día: al repartir, al comprar o al jugar.',
    des: [
      ['Sumar es juntar', 'Si tienes 3 canicas y te dan 2, juntas todas y tienes 5. Se escribe 3 + 2 = 5. Los números que se suman son los sumandos y el resultado es la suma o total.', 'ma_suma_llevando'],
      ['Restar es quitar', 'Si tienes 7 caramelos y te comes 3, te quedan 4. Se escribe 7 − 3 = 4. El resultado de una resta se llama diferencia.', 'ma_resta_prestando'],
      ['El orden en la suma', 'En una suma el orden no cambia el resultado: 2 + 6 = 6 + 2 = 8. Por eso conviene empezar por el número más grande y contar desde ahí.', 'ma_recta_numerica'],
      ['Comprobar con la operación contraria', 'Una resta se comprueba con una suma: si 9 − 4 = 5, entonces 5 + 4 debe dar 9. Si no da, hay un error.', 'ma_regletas']
    ],
    ej: [
      { e: 'Ana tiene 8 cromos y su hermano le regala 5. ¿Cuántos cromos tiene ahora?', pasos: ['Es una suma porque juntamos cromos: 8 + 5.', 'Empezamos en 8 y contamos 5 más: 9, 10, 11, 12, 13.'], s: '13 cromos', x: '8 + 5 = 13; juntar dos grupos es sumar.' },
      { e: 'En el autobús van 15 personas y bajan 6. ¿Cuántas quedan?', pasos: ['Es una resta porque se quitan personas: 15 − 6.', 'Quitamos 5 para llegar a 10 y luego 1 más: 9.', 'Comprobamos: 9 + 6 = 15. ✔'], s: '9 personas', x: '15 − 6 = 9 y la suma 9 + 6 vuelve a dar 15.' },
      { e: 'Suma en columna: 27 + 35.', pasos: ['Unidades: 7 + 5 = 12. Escribimos 2 y llevamos 1 decena.', 'Decenas: 2 + 3 = 5, más la que llevamos: 6.', 'Juntamos: 6 decenas y 2 unidades.'], s: '62', x: 'Cuando las unidades pasan de 9, se forma una decena que se suma a las decenas.' },
      { e: 'Resta en columna: 52 − 18.', pasos: ['Unidades: a 2 no se le puede quitar 8; pedimos 1 decena y tenemos 12.', '12 − 8 = 4.', 'Decenas: quedan 4 decenas; 4 − 1 = 3.'], s: '34', x: 'Comprobación: 34 + 18 = 52.' },
      { e: 'Luis tiene 20 y quiere comprar un libro de 32. ¿Cuánto le falta?', pasos: ['«Cuánto falta» se resuelve restando: 32 − 20.', '32 − 20 = 12.'], s: 'Le faltan 12', x: 'Restar también sirve para buscar la diferencia entre dos cantidades.' }
    ],
    err: [['Restar el número pequeño del grande en cada columna (52 − 18 = 46).', 'Si arriba hay menos, pide una decena prestada.'], ['Olvidar la decena que se lleva.', 'Escribe la llevada pequeñita encima de la columna siguiente.']],
    cur: 'El signo «+» viene de la palabra latina «et», que significa «y»: de tanto escribirla rápido, se convirtió en una cruz.',
    con: 'Sumar es juntar y restar es quitar o buscar lo que falta. El orden de los sumandos no importa, y toda resta se puede comprobar con una suma.',
    voc: [['sumando', 'Cada número que se suma.'], ['suma o total', 'Resultado de sumar.'], ['diferencia', 'Resultado de una resta.'], ['llevar', 'Pasar una decena a la columna siguiente al sumar.']]
  };

  M.mat_multi = {
    intro: 'Multiplicar es una forma rápida de sumar el mismo número muchas veces. Si en cada caja hay 6 huevos y tienes 4 cajas, no hace falta sumar 6 + 6 + 6 + 6: basta con multiplicar 4 × 6.',
    des: [
      ['Una suma repetida', '4 × 3 significa «cuatro veces tres»: 3 + 3 + 3 + 3 = 12. Los números que se multiplican se llaman factores y el resultado, producto.', 'ma_multiplicacion_matriz'],
      ['Filas y columnas', 'Si colocas objetos en 3 filas de 5, tienes 3 × 5 = 15. Girar el dibujo no cambia la cantidad: 5 × 3 también es 15.', 'ma_multiplicacion_matriz'],
      ['Las tablas tienen patrones', 'La tabla del 2 da números pares; la del 5 termina en 0 o en 5; la del 10 añade un cero; la del 9 tiene cifras que suman 9 (18, 27, 36…).', 'ma_tabla_pitagoras'],
      ['El 0 y el 1', 'Cualquier número por 0 da 0, porque no se suma nada. Cualquier número por 1 da el mismo número.', 'ma_tabla_pitagoras']
    ],
    ej: [
      { e: 'Hay 4 cajas con 6 huevos cada una. ¿Cuántos huevos hay?', pasos: ['Se repite el mismo número (6) cuatro veces: 4 × 6.', 'Suma repetida: 6 + 6 + 6 + 6 = 24.'], s: '24 huevos', x: 'Multiplicar 4 × 6 es sumar 6 cuatro veces.' },
      { e: 'En el cine hay 7 filas de 8 butacas. ¿Cuántas butacas hay?', pasos: ['Filas por butacas de cada fila: 7 × 8.', 'Tabla del 8: 8, 16, 24, 32, 40, 48, 56.'], s: '56 butacas', x: '7 × 8 = 56.' },
      { e: 'Multiplica 23 × 4.', pasos: ['Unidades: 3 × 4 = 12. Escribimos 2 y llevamos 1.', 'Decenas: 2 × 4 = 8, más 1 que llevamos: 9.'], s: '92', x: '23 × 4 = 20 × 4 + 3 × 4 = 80 + 12 = 92.' },
      { e: 'Una entrada cuesta {$5}. ¿Cuánto cuestan 6 entradas?', pasos: ['Varias cosas iguales: 6 × 5.', 'Tabla del 5: 30.'], s: '{$30}', x: 'Con la multiplicación se calcula el precio de varias cosas iguales.' },
      { e: '¿Cuánto es 9 × 0?', pasos: ['Multiplicar por 0 es sumar el 9 cero veces.', 'No se suma nada.'], s: '0', x: 'Todo número multiplicado por 0 da 0.' }
    ],
    err: [['Pensar que 6 × 0 = 6.', 'Multiplicar por 0 siempre da 0; por 1 deja el número igual.'], ['Confundir 4 × 3 con 4 + 3.', 'Lee «cuatro veces tres» y dibuja los grupos.']],
    cur: 'En la Antigüedad, los egipcios multiplicaban duplicando: para 13 × 6 sumaban 6, 12, 24 y 48 según convenía. ¡Solo necesitaban la tabla del 2!',
    con: 'Multiplicar es sumar el mismo número varias veces. El orden de los factores no cambia el producto, y las tablas se aprenden mejor buscando sus patrones.',
    voc: [['factor', 'Cada número que se multiplica.'], ['producto', 'Resultado de multiplicar.'], ['tabla de multiplicar', 'Lista de productos de un número por 1, 2, 3… hasta 10.'], ['doble', 'Multiplicar por 2.']]
  };

  M.mat_frac = {
    intro: 'Cuando partimos una pizza, una tableta de chocolate o una hora, usamos fracciones. Una fracción nos dice qué parte de algo tenemos.',
    des: [
      ['Partes iguales', 'Una fracción indica partes iguales de un todo. Si una pizza se corta en 8 trozos iguales y comes 3, has comido 3/8 de la pizza.', 'ma_fraccion_pizza'],
      ['Numerador y denominador', 'El número de abajo, el denominador, dice en cuántas partes iguales se divide. El de arriba, el numerador, dice cuántas partes se toman.', 'ma_fraccion_barra'],
      ['Fracciones equivalentes', 'Dos fracciones son equivalentes si representan la misma cantidad: 1/2 = 2/4 = 4/8. Se obtienen multiplicando o dividiendo arriba y abajo por el mismo número.', 'ma_fracciones_equivalentes'],
      ['Sumar y comparar', 'Con el mismo denominador se suman los numeradores: 2/7 + 3/7 = 5/7. Con el mismo denominador, es mayor la fracción con mayor numerador.', 'ma_suma_fracciones'],
      ['Fracción de una cantidad', 'Para calcular 3/4 de 20 se divide entre el denominador y se multiplica por el numerador: 20 ÷ 4 = 5; 5 × 3 = 15.', 'ma_fraccion_cantidad']
    ],
    ej: [
      { e: 'Una tarta se corta en 6 trozos iguales y se comen 4. ¿Qué fracción se comieron?', pasos: ['Denominador: en cuántas partes se divide la tarta → 6.', 'Numerador: cuántas partes se toman → 4.'], s: '4/6 (equivale a 2/3)', x: '4/6 y 2/3 son equivalentes: se dividen numerador y denominador entre 2.' },
      { e: 'Calcula 3/5 de 40.', pasos: ['Dividimos entre el denominador: 40 ÷ 5 = 8.', 'Multiplicamos por el numerador: 8 × 3 = 24.'], s: '24', x: 'Cada quinto de 40 es 8; tres quintos son 24.' },
      { e: 'Suma 2/9 + 5/9.', pasos: ['Tienen el mismo denominador (9): se mantiene.', 'Se suman los numeradores: 2 + 5 = 7.'], s: '7/9', x: 'Se suman partes del mismo tamaño.' },
      { e: '¿Qué es mayor, 3/4 o 5/8?', pasos: ['Buscamos el mismo denominador: 3/4 = 6/8.', 'Comparamos 6/8 con 5/8: 6 > 5.'], s: '3/4 es mayor', x: 'Con el mismo denominador, es mayor la fracción con mayor numerador.' },
      { e: 'Simplifica 12/18.', pasos: ['Buscamos un número que divida a los dos: 6.', '12 ÷ 6 = 2 y 18 ÷ 6 = 3.'], s: '2/3', x: 'Dividir arriba y abajo por el mismo número da una fracción equivalente.' }
    ],
    err: [['Sumar también los denominadores (2/9 + 5/9 = 7/18).', 'El denominador es el tamaño de las partes: no cambia al sumar.'], ['Creer que 1/3 es mayor que 1/2 porque 3 > 2.', 'Cuantas más partes, más pequeña es cada una.']],
    cur: 'La raya de las fracciones la popularizaron los matemáticos árabes; antes, los egipcios solo usaban fracciones con numerador 1.',
    con: 'Una fracción indica partes iguales de un todo: el denominador dice en cuántas se divide y el numerador cuántas se toman. Con fracciones equivalentes podemos comparar y sumar.',
    voc: [['fracción', 'Número que indica partes iguales de un todo.'], ['numerador', 'Número de arriba: partes que se toman.'], ['denominador', 'Número de abajo: partes iguales en que se divide.'], ['fracción equivalente', 'Fracción que representa la misma cantidad que otra.'], ['simplificar', 'Dividir numerador y denominador por el mismo número.']]
  };

  M.mat_ecua = {
    intro: 'Una ecuación es como una balanza en equilibrio con una caja de peso desconocido. Resolverla es averiguar cuánto pesa esa caja sin romper el equilibrio.',
    des: [
      ['La igualdad y la incógnita', 'Una ecuación es una igualdad con una letra que no conocemos, la incógnita. En 2x + 3 = 11, lo que hay a la izquierda del igual es el primer miembro y lo de la derecha, el segundo.', 'ma_ecuacion_balanza'],
      ['La regla de oro', 'Lo que se hace en un miembro se hace también en el otro: si sumamos, restamos, multiplicamos o dividimos los dos lados por el mismo número, la igualdad se mantiene.', 'ma_balanza_platillos'],
      ['Transponer términos', 'En la práctica se dice que un término «pasa» al otro lado con la operación contraria: lo que suma pasa restando y lo que multiplica pasa dividiendo.', 'ma_expresion'],
      ['Comprobar siempre', 'Se sustituye la solución en la ecuación original. Si los dos miembros dan lo mismo, la solución es correcta.', 'ma_ecuacion_balanza']
    ],
    ej: [
      { e: 'Resuelve 2x + 3 = 11.', pasos: ['Restamos 3 en los dos miembros: 2x = 8.', 'Dividimos entre 2 los dos miembros: x = 4.', 'Comprobamos: 2·4 + 3 = 11. ✔'], s: 'x = 4', x: 'Primero se quita lo que suma y luego lo que multiplica.' },
      { e: 'Resuelve 5x − 7 = 3x + 9.', pasos: ['Pasamos las x a la izquierda: 5x − 3x − 7 = 9 → 2x − 7 = 9.', 'Pasamos los números a la derecha: 2x = 16.', 'Dividimos: x = 8.', 'Comprobamos: 5·8 − 7 = 33 y 3·8 + 9 = 33. ✔'], s: 'x = 8', x: 'Se agrupan las x en un lado y los números en el otro.' },
      { e: 'Resuelve 3(x − 2) = 15.', pasos: ['Quitamos el paréntesis: 3x − 6 = 15.', 'Sumamos 6: 3x = 21.', 'Dividimos entre 3: x = 7.'], s: 'x = 7', x: 'Comprobación: 3·(7 − 2) = 3·5 = 15.' },
      { e: 'Resuelve x/4 + 1 = 6.', pasos: ['Restamos 1: x/4 = 5.', 'Multiplicamos por 4: x = 20.'], s: 'x = 20', x: 'La división entre 4 se deshace multiplicando por 4.' },
      { e: 'Un número más su doble es 36. ¿Qué número es?', pasos: ['Llamamos x al número: x + 2x = 36.', 'Agrupamos: 3x = 36.', 'Dividimos: x = 12.'], s: '12', x: 'Comprobación: 12 + 24 = 36.' }
    ],
    err: [['Cambiar un término de lado sin cambiar su signo.', 'Lo que suma pasa restando; lo que resta pasa sumando.'], ['Dividir solo una parte del miembro.', 'Se divide el miembro entero o se quita antes lo que suma.']],
    cur: 'La letra x para la incógnita la popularizó René Descartes en 1637. Usaba las primeras letras del alfabeto para lo conocido y las últimas para lo desconocido.',
    con: 'Resolver una ecuación es mantener el equilibrio: lo que se hace en un miembro se hace en el otro, se agrupan las x, se despeja y siempre se comprueba.',
    voc: [['ecuación', 'Igualdad con una o más incógnitas.'], ['incógnita', 'Letra cuyo valor buscamos.'], ['miembro', 'Cada lado de la igualdad.'], ['término', 'Cada sumando de un miembro.'], ['solución', 'Valor de la incógnita que cumple la igualdad.']]
  };

  M.mat_func = {
    intro: 'Muchas situaciones relacionan dos cantidades: lo que pagas en un taxi depende de los kilómetros; lo que crece una planta, de los días. Las funciones lineales describen relaciones que crecen o bajan siempre al mismo ritmo.',
    des: [
      ['La fórmula y = m·x + b', 'Una función lineal relaciona x con y mediante y = m·x + b. Para cada valor de x se obtiene un único valor de y, y su gráfica es una recta.', 'ma_funcion_lineal'],
      ['La pendiente m', 'La pendiente dice cuánto cambia y cuando x aumenta 1. Si m es positiva, la recta sube; si es negativa, baja; si es 0, es horizontal.', 'ma_pendiente'],
      ['La ordenada en el origen b', 'Es el valor de y cuando x vale 0: el punto donde la recta corta el eje vertical.', 'ma_coordenadas'],
      ['Tabla de valores', 'Se eligen varios valores de x, se calcula y con la fórmula y se marcan los puntos. Con dos puntos basta para trazar la recta.', 'ma_tabla_valores']
    ],
    ej: [
      { e: 'Un taxi cobra {$3} de bajada de bandera y {$1.5} por km. Escribe la función y calcula el precio de 8 km.', pasos: ['Lo fijo es b = 3; lo que cambia por km es m = 1,5.', 'Función: y = 1,5x + 3.', 'Para x = 8: y = 1,5·8 + 3 = 12 + 3 = 15.'], s: '{$15}', x: 'La pendiente es el precio por km y la ordenada, la bajada de bandera.' },
      { e: 'Halla la pendiente de la recta que pasa por (1, 3) y (4, 9).', pasos: ['m = (y₂ − y₁) / (x₂ − x₁).', 'm = (9 − 3) / (4 − 1) = 6 / 3.'], s: 'm = 2', x: 'Por cada unidad que avanza x, y sube 2.' },
      { e: 'Completa la tabla de y = 2x − 1 para x = 0, 1, 2 y 3.', pasos: ['x = 0 → y = −1.', 'x = 1 → y = 1.', 'x = 2 → y = 3.', 'x = 3 → y = 5.'], s: '(0, −1), (1, 1), (2, 3), (3, 5)', x: 'Cada vez que x sube 1, y sube 2: la pendiente.' },
      { e: '¿Dónde corta la recta y = −3x + 6 a los ejes?', pasos: ['Eje vertical: x = 0 → y = 6 → punto (0, 6).', 'Eje horizontal: y = 0 → −3x + 6 = 0 → x = 2 → punto (2, 0).'], s: '(0, 6) y (2, 0)', x: 'Para cortar un eje se iguala a cero la otra coordenada.' }
    ],
    err: [['Confundir la pendiente con la ordenada.', 'm multiplica a la x; b va sola.'], ['Restar las coordenadas en distinto orden arriba y abajo.', 'Usa siempre el mismo punto primero: (y₂ − y₁)/(x₂ − x₁).']],
    cur: 'La idea de dibujar relaciones en unos ejes es de René Descartes: por eso se llaman coordenadas cartesianas.',
    con: 'Una función lineal y = m·x + b es una recta: m indica cuánto sube o baja y b dónde corta el eje vertical. Con una tabla de valores la dibujamos y con la fórmula hacemos predicciones.',
    voc: [['función', 'Relación que asigna a cada x un único valor de y.'], ['pendiente', 'Cambio de y por cada unidad de x.'], ['ordenada en el origen', 'Valor de y cuando x = 0.'], ['eje de coordenadas', 'Cada una de las dos rectas de referencia del plano.']]
  };

  M.mat_deriv = {
    intro: 'La velocidad de un coche, el crecimiento de una población o la rapidez con que se enfría un café son ritmos de cambio. La derivada es la herramienta matemática que mide esos ritmos en cada instante.',
    des: [
      ['Tasa de variación', 'La tasa de variación media entre a y b es [f(b) − f(a)] / (b − a): cuánto cambia la función por unidad. La derivada es esa tasa cuando el intervalo se hace tan pequeño como queramos.', 'ma_pendiente'],
      ['Pendiente de la tangente', 'Geométricamente, f′(a) es la pendiente de la recta tangente a la gráfica en el punto de abscisa a.', 'ma_parabola'],
      ['Reglas básicas', 'La derivada de una constante es 0; la de xⁿ es n·xⁿ⁻¹; la de una suma es la suma de las derivadas; y un número que multiplica se mantiene: (k·f)′ = k·f′.', 'ma_potencias'],
      ['Máximos y mínimos', 'Donde la derivada vale 0 la tangente es horizontal: puede haber un máximo o un mínimo. Si f′ pasa de positiva a negativa es un máximo; de negativa a positiva, un mínimo.', 'ma_parabola']
    ],
    ej: [
      { e: 'Deriva f(x) = 3x² + 5x − 7.', pasos: ['(3x²)′ = 3·2x = 6x.', '(5x)′ = 5.', '(−7)′ = 0.'], s: 'f′(x) = 6x + 5', x: 'Se deriva término a término con la regla de la potencia.' },
      { e: 'Halla la pendiente de la tangente a f(x) = x³ en x = 2.', pasos: ['f′(x) = 3x².', 'f′(2) = 3·4 = 12.'], s: '12', x: 'La derivada en un punto es la pendiente de la tangente en ese punto.' },
      { e: 'Halla el mínimo de f(x) = x² − 6x + 10.', pasos: ['f′(x) = 2x − 6.', 'f′(x) = 0 → x = 3.', 'f(3) = 9 − 18 + 10 = 1.', 'Antes de 3 la derivada es negativa y después positiva: es un mínimo.'], s: 'Mínimo en (3, 1)', x: 'La función baja hasta x = 3 y luego sube.' },
      { e: 'Una piedra cae y recorre e(t) = 4,9t² metros. ¿Qué velocidad lleva a los 2 s?', pasos: ['La velocidad es la derivada de la posición: v(t) = 9,8t.', 'v(2) = 9,8·2.'], s: '19,6 m/s', x: 'La derivada mide el ritmo de cambio de la posición: la velocidad.' }
    ],
    err: [['Derivar xⁿ como xⁿ⁻¹ olvidando el factor n.', 'Baja el exponente multiplicando y réstale 1.'], ['Decir que f′(a) = 0 siempre es un máximo.', 'Estudia el signo de la derivada antes y después.']],
    cur: 'Newton y Leibniz inventaron el cálculo a la vez, sin conocerse. La notación dy/dx que usamos hoy es de Leibniz.',
    con: 'La derivada mide la rapidez de cambio y es la pendiente de la tangente. Con unas pocas reglas se calcula y sirve para encontrar máximos, mínimos y velocidades.',
    voc: [['derivada', 'Ritmo de cambio instantáneo de una función.'], ['recta tangente', 'Recta que toca la curva en un punto con su misma inclinación.'], ['máximo', 'Punto donde la función deja de subir y empieza a bajar.'], ['mínimo', 'Punto donde la función deja de bajar y empieza a subir.']]
  };
})();
