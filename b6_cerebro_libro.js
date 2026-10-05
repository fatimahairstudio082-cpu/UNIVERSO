/* b6_cerebro_libro.js — cerebro de contenido extenso para libros largos (window.EU_LIBRO).
   En un libro de 60–300 páginas, el motor base rellena con páginas de actividades. Este cerebro
   convierte parte de ese relleno en páginas de lectura con maqueta editorial:
     · lec_concepto  una doble columna por palabra clave: qué es, cómo se trabaja en la materia,
                     un ejemplo en una ciudad del país, error frecuente, «¿Sabías que…?» y una figura.
     · lec_lectura   relato con personajes y ciudades del país, vocabulario y comprensión lectora.
     · lec_caso      problemas resueltos paso a paso + «Ahora tú».
     · lec_amplia    «Para saber más»: datos reales de la materia (banco SABER).
     · lec_proyecto  proyecto con objetivo, materiales, pasos, producto final y rúbrica.
     · lec_sintesis  lo esencial, glosario de la unidad, mapa conceptual y autoevaluación.
   Ninguna frase se repite en el libro (registro de frases usadas) y ninguna figura se repite
   (huella de cada SVG). Las figuras salen de EU_SVG (incluye EU_DIBUJOS, mapas, anatomía…) y se
   redibujan con el diseño de cada página. Cargar después de b6_dibujos_materias.js y antes de
   b6_laminas_plus.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, SV = window.EU_SVG;
  if (!ED || !SV || window.EU_LIBRO) return;
  var H = ED.H, esc = H.esc, it = H.it;

  function grupo(m) {
    if (/^(mate|conta|geoalg|calculo)$/.test(m)) return 'num';
    if (/^(natu|bio|anat|fisica|quimica)$/.test(m)) return 'cien';
    if (/^(lengua|ingles)$/.test(m)) return 'letras';
    if (/^(soci|geografia|historia|valores|religion)$/.test(m)) return 'soc';
    if (/^(arte|musica)$/.test(m)) return 'arte';
    if (m === 'efisica') return 'cuerpo';
    if (m === 'tecno') return 'tec';
    return 'oficio';
  }

  /* ─────────── banco de saberes reales por materia ─────────── */
  var SABER = {
    lengua: [['Del latín al español', 'El español procede del latín que hablaban soldados y comerciantes romanos. Hoy es la lengua materna de cerca de 500 millones de personas y la segunda del mundo por hablantes nativos.'], ['La primera gramática', 'En 1492 Antonio de Nebrija publicó la Gramática de la lengua castellana, la primera de una lengua europea moderna.'], ['Veintitrés academias', 'La Real Academia Española se fundó en 1713. Hoy trabaja con otras 22 academias americanas, de Filipinas y de Guinea Ecuatorial, y todas publican juntas el diccionario y la ortografía.'], ['La historia de la ñ', 'La ñ nació como abreviatura: los copistas medievales escribían una n pequeña sobre otra para ahorrar pergamino, y esa rayita se convirtió en la virgulilla.'], ['La primera novela moderna', 'Don Quijote de la Mancha, de Miguel de Cervantes, se publicó en dos partes, en 1605 y 1615, y es una de las obras más traducidas de la historia.'], ['Palabras viajeras', 'Del árabe llegaron «almohada» y «aceite»; del náhuatl, «chocolate» y «tomate»; del quechua, «papa» y «cancha»; del taíno, «huracán» y «hamaca».'], ['Cuánto leemos', 'Una persona adulta lee en silencio entre 200 y 300 palabras por minuto. Leer en voz alta es más lento, pero fija la pronunciación y la puntuación.'], ['El Premio Cervantes', 'Creado en 1976, reconoce cada año la obra completa de una autora o un autor en español, de España o de América.']],
    mate: [['El viaje del cero', 'El cero llegó a Europa desde la India a través de los matemáticos árabes. Fibonacci lo difundió en 1202, junto con las cifras que usamos hoy.'], ['El cero maya', 'Los mayas contaban en base 20 y tenían un símbolo propio para el cero siglos antes de que se usara en Europa.'], ['El número π', 'Cualquier circunferencia mide unas 3,14 veces su diámetro. Ese número, π, tiene infinitas cifras decimales que nunca se repiten en bloque.'], ['La cuerda de 3, 4 y 5', 'En un triángulo rectángulo, el cuadrado de la hipotenusa es la suma de los cuadrados de los catetos. Los albañiles lo usan con una cuerda de 3, 4 y 5 unidades para trazar ángulos rectos.'], ['Estadística y Estado', 'La estadística nació para contar la población y los recursos de un Estado; de ahí su nombre. Hoy decide desde la eficacia de un medicamento hasta el pronóstico del tiempo.'], ['Una partida interrumpida', 'La probabilidad moderna empezó en el siglo XVII con las cartas entre Pascal y Fermat sobre cómo repartir el premio de un juego de dados interrumpido.'], ['El metro', 'En 1791 el metro se definió como la diezmillonésima parte de la distancia del polo norte al ecuador. Hoy se define a partir de la velocidad de la luz.'], ['Hexágonos en la colmena', 'Las abejas construyen celdas hexagonales: es la forma que cubre el plano sin huecos gastando menos cera para el mismo espacio.']],
    conta: [['La partida doble', 'Luca Pacioli describió en 1494 la partida doble: cada operación se anota en el debe de una cuenta y en el haber de otra, y los dos lados siempre suman lo mismo.'], ['Cuentas de arcilla', 'Las primeras cuentas escritas conocidas son tablillas de arcilla de Mesopotamia de hace más de 5000 años, con registros de cereal y ganado.'], ['Una fotografía', 'El balance es una fotografía de la empresa en un día concreto: lo que tiene, lo que debe y lo que pertenece a sus propietarios.'], ['Una película', 'La cuenta de resultados es una película: resume los ingresos y gastos de un periodo y dice si se ha ganado o perdido.'], ['El impuesto al consumo', 'La empresa cobra el impuesto al consumo en cada venta y lo ingresa en la Administración, descontando el que ha pagado en sus compras.'], ['Beneficios sin caja', 'Una empresa puede tener beneficios y quedarse sin dinero si sus clientes tardan en pagar. Por eso se vigila el flujo de caja cada semana.'], ['La auditoría', 'Una auditoría es la revisión de las cuentas por alguien independiente. Da confianza a bancos, inversores y a la propia empresa.'], ['Facturas electrónicas', 'Hoy casi todas las facturas son electrónicas y los programas registran solos los asientos. Saber partida doble sigue siendo imprescindible para revisar que están bien.']],
    natu: [['Fábricas de oxígeno', 'Las plantas fabrican su alimento con luz, agua y dióxido de carbono, y liberan oxígeno. Casi todo el oxígeno que respiramos procede de plantas y algas.'], ['Agua por dentro', 'Alrededor del 60 % del cuerpo de una persona adulta es agua. Perder solo un 2 % ya se nota en la atención y el cansancio.'], ['Países megadiversos', 'Se han descrito cerca de dos millones de especies. Colombia y México están entre los países con más biodiversidad del planeta.'], ['Transportistas de polen', 'Abejas, murciélagos y colibríes llevan el polen de flor en flor. Sin ellos, muchas frutas y hortalizas no llegarían a formarse.'], ['El día que sobra', 'La Tierra tarda unos 365 días y 6 horas en dar la vuelta al Sol. Esas horas de más se reúnen cada cuatro años en el 29 de febrero.'], ['El Cinturón de Fuego', 'Los Andes forman parte del Cinturón de Fuego del Pacífico, donde se concentran la mayoría de los volcanes activos y los terremotos del mundo.'], ['Vida en una cucharada', 'En una cucharadita de tierra fértil hay más microorganismos que personas en el planeta. Descomponen restos y devuelven nutrientes al suelo.'], ['Latas que ahorran', 'Reciclar una lata de aluminio ahorra cerca del 95 % de la energía necesaria para fabricarla desde el mineral.']],
    soci: [['Ciudades junto al río', 'Las primeras ciudades surgieron hace más de 5000 años junto al Tigris y el Éufrates, donde la agricultura producía excedentes.'], ['Escribir para contar', 'La escritura nació para llevar cuentas y fijar leyes. Con ella empieza la Historia; lo anterior es la Prehistoria.'], ['Treinta artículos', 'La Declaración Universal de los Derechos Humanos se aprobó en 1948. Sus 30 artículos valen para todas las personas, sin distinción.'], ['La imprenta', 'Gutenberg imprimió con tipos móviles hacia 1450. En pocas décadas los libros se abarataron y las ideas empezaron a circular mucho más deprisa.'], ['Una ciudad sobre el lago', 'Tenochtitlan, la capital mexica, se levantó sobre un lago y superó los 200 000 habitantes, más que casi cualquier ciudad europea de su tiempo.'], ['El Qhapaq Ñan', 'Los incas construyeron unos 30 000 kilómetros de caminos que unían territorios de los actuales Perú, Ecuador, Bolivia, Chile, Argentina y Colombia.'], ['Las independencias', 'Entre 1810 y 1825 la mayoría de los territorios americanos bajo dominio español proclamaron su independencia.'], ['El voto de las mujeres', 'Nueva Zelanda reconoció en 1893 el voto femenino en elecciones nacionales. En América Latina, Uruguay lo hizo en 1927.']],
    ingles: [['Una lengua global', 'El inglés es lengua oficial o cooficial en más de 50 países y la más estudiada como segunda lengua.'], ['Primas del español', 'Cerca de un tercio del vocabulario inglés viene del francés y del latín; por eso «nation», «family» o «important» se entienden a la primera.'], ['Falsos amigos', '«Actually» significa «en realidad», no «actualmente»; «library» es «biblioteca», no «librería».'], ['Palabras de Shakespeare', 'Shakespeare inventó o popularizó cientos de palabras y expresiones que seguimos usando, como «lonely» o «break the ice».'], ['Dos orillas', 'El inglés británico y el americano cambian algunas palabras: «flat» y «apartment», «lift» y «elevator» significan lo mismo.'], ['El adjetivo delante', 'En inglés el adjetivo va antes del sustantivo: «a red car» es «un coche rojo».'], ['Letras que suenan distinto', 'La combinación «ough» se pronuncia de forma diferente en «though», «through» y «tough».'], ['Series con subtítulos', 'Escuchar a diario series o canciones en versión original con subtítulos en inglés mejora la comprensión oral en pocas semanas.']],
    arte: [['Bisontes con relieve', 'Las pinturas de Altamira tienen más de 14 000 años. Sus autores aprovecharon los salientes de la roca para dar volumen a los animales.'], ['El punto de fuga', 'La perspectiva lineal se formuló en Florencia a principios del siglo XV: las paralelas se juntan en un punto del horizonte.'], ['Tres primarios', 'En pintura, amarillo, magenta y cian no se obtienen mezclando otros colores; con ellos se consiguen casi todos los demás.'], ['Autorretratos', 'Frida Kahlo pintó unas 200 obras, muchas de ellas autorretratos, y convirtió su propia vida en tema de su arte.'], ['Arte en los muros', 'El muralismo mexicano de Rivera, Orozco y Siqueiros llevó la pintura a los edificios públicos para que la viera todo el mundo.'], ['El espejo de Las Meninas', 'En Las Meninas (1656), Velázquez pinta un espejo que refleja a los reyes, situados justo donde está quien mira el cuadro.'], ['Vistas normalizadas', 'El dibujo técnico usa alzado, planta y perfil para que cualquiera pueda fabricar una pieza sin haberla visto.'], ['Volúmenes de Botero', 'El pintor y escultor colombiano Fernando Botero se hizo famoso por figuras de volúmenes exagerados que se reconocen al primer vistazo.']],
    musica: [['Una vibración que viaja', 'El sonido es una vibración que avanza por el aire a unos 340 metros por segundo.'], ['El la de 440', 'La nota la con la que afinan las orquestas vibra 440 veces por segundo.'], ['Nombres para las notas', 'Guido d’Arezzo puso nombre a las notas en el siglo XI a partir de las sílabas de un himno latino.'], ['Componer sin oír', 'Beethoven compuso la Novena sinfonía cuando ya estaba casi completamente sordo.'], ['El tango', 'El tango nació a finales del siglo XIX en Buenos Aires y Montevideo. La Unesco lo declaró patrimonio de la humanidad en 2009.'], ['La cumbia', 'La cumbia surgió en la costa caribe de Colombia, donde se mezclaron tradiciones indígenas, africanas y europeas.'], ['El flamenco', 'El flamenco, que reúne cante, toque y baile, es patrimonio cultural inmaterial de la humanidad desde 2010.'], ['Cantar juntos', 'Cantar en grupo acompasa la respiración de quienes cantan y, según varios estudios, también su ritmo cardiaco.']],
    efisica: [['Olimpia y Atenas', 'Los primeros Juegos Olímpicos registrados se celebraron en Olimpia en el 776 a. C.; los modernos empezaron en Atenas en 1896.'], ['Sesenta minutos', 'La Organización Mundial de la Salud recomienda a niñas, niños y adolescentes al menos 60 minutos diarios de actividad física moderada o intensa.'], ['Músculos calientes', 'Calentar sube la temperatura de los músculos y reduce el riesgo de lesión.'], ['Un corazón entrenado', 'El corazón de una persona entrenada late más despacio en reposo porque bombea más sangre en cada latido.'], ['Más de 600 músculos', 'El cuerpo humano tiene más de 600 músculos; el más grande es el glúteo mayor.'], ['Beber a tiempo', 'Con ejercicio intenso se puede perder más de un litro de sudor por hora. Hay que beber antes, durante y después.'], ['Dormir para rendir', 'Durante el sueño se reparan los tejidos y se consolida lo aprendido en la técnica.'], ['Juego limpio', 'El juego limpio incluye respetar las reglas, al rival y al árbitro, también cuando nadie mira.']],
    tecno: [['Veintisiete toneladas', 'ENIAC, el primer ordenador electrónico de uso general (1946), pesaba unas 27 toneladas y ocupaba una sala entera.'], ['Recetas y algoritmos', 'Un algoritmo es una lista ordenada de pasos para resolver un problema. Una receta de cocina es un algoritmo.'], ['Ceros y unos', 'Los ordenadores guardan la información en bits, que valen 0 o 1. Ocho bits forman un byte.'], ['La web', 'Internet nació de una red militar y universitaria a finales de los años sesenta; la web la inventó Tim Berners-Lee en 1989.'], ['Máquinas simples', 'Palanca, rueda, polea, plano inclinado, cuña y tornillo están dentro de casi todas las máquinas.'], ['Contraseñas largas', 'Una contraseña larga hecha con varias palabras es más difícil de adivinar que una corta llena de símbolos.'], ['Luz que da corriente', 'Las placas solares convierten la luz en electricidad por el efecto fotovoltaico, descrito por Becquerel en 1839.'], ['Prototipos', 'Antes de fabricar, se hace un prototipo: una versión de prueba que se puede romper y mejorar.']],
    valores: [['Costumbre y carácter', 'La palabra «ética» viene del griego «êthos», que significa costumbre o carácter.'], ['Derechos de la infancia', 'La Convención sobre los Derechos del Niño, de 1989, es el tratado de derechos humanos firmado por más países.'], ['Empatía que se entrena', 'Escuchar sin interrumpir y preguntar cómo se siente la otra persona son dos maneras sencillas de practicar la empatía.'], ['Diecisiete objetivos', 'Los Objetivos de Desarrollo Sostenible son 17 metas de la ONU para 2030, entre ellas acabar con la pobreza y garantizar una educación de calidad.'], ['Tres preguntas', 'Una buena decisión suele pasar por tres preguntas: qué consecuencias tiene, a quién afecta y si querría que todos hicieran lo mismo.'], ['Mediar', 'En una mediación, una persona neutral no decide por las partes: les ayuda a escucharse y a encontrar su propio acuerdo.'], ['Voluntariado', 'Millones de personas hacen voluntariado. Beneficia a la comunidad y también a quien lo practica.'], ['No discriminar', 'Discriminar es tratar peor a alguien por su origen, su sexo, su religión o su discapacidad. Las constituciones de nuestros países lo prohíben.']],
    religion: [['Cuatro grandes tradiciones', 'Las tradiciones religiosas con más seguidores son el cristianismo, el islam, el hinduismo y el budismo.'], ['Religiones abrahámicas', 'Judaísmo, cristianismo e islam reconocen a Abraham como padre en la fe.'], ['Una biblioteca', 'La Biblia es una colección de libros escritos durante siglos en hebreo, arameo y griego.'], ['Fiestas del calendario', 'Navidad, Semana Santa, Ramadán o Diwali son fiestas de origen religioso que marcan el calendario de millones de personas.'], ['El Camino de Santiago', 'Ruta de peregrinación desde la Edad Media, hoy lo recorren cada año cientos de miles de personas de todo el mundo.'], ['Peregrinaciones en América', 'La basílica de Guadalupe, en México, recibe cada año a millones de peregrinos.'], ['Libertad religiosa', 'La libertad religiosa incluye creer, no creer y cambiar de creencia, y está reconocida en la Declaración Universal de los Derechos Humanos.'], ['Obras de generaciones', 'Las catedrales góticas tardaron décadas o siglos en construirse; en ellas trabajaron varias generaciones de canteros y vidrieros.']],
    pelu: [['Un centímetro al mes', 'El cabello crece alrededor de un centímetro al mes, algo más deprisa en verano.'], ['Queratina', 'Cada pelo está formado sobre todo por queratina, la misma proteína que forma las uñas.'], ['Cien mil cabellos', 'En la cabeza hay entre 100 000 y 150 000 cabellos, y es normal perder entre 50 y 100 al día.'], ['Un pH ácido', 'El cabello y el cuero cabelludo tienen un pH ligeramente ácido, de 4,5 a 5,5; por eso muchos acondicionadores son ácidos.'], ['48 horas antes', 'La prueba de sensibilidad se hace 48 horas antes del tinte porque algunas reacciones alérgicas son graves.'], ['Volúmenes de oxidante', 'El oxidante se mide en volúmenes: cuantos más volúmenes, más aclara y más castiga la fibra.'], ['Capas y peso', 'El corte en capas reparte el peso y da movimiento; el corte recto concentra el peso en las puntas.'], ['Tijeras que no cortan papel', 'Las tijeras profesionales tienen un afilado preciso; cortar papel con ellas las mella.']],
    bio: [['Celdas de corcho', 'Robert Hooke vio células por primera vez en 1665 al observar corcho al microscopio.'], ['Dos metros de ADN', 'El ADN de una sola célula humana, estirado, mediría unos dos metros.'], ['El origen de las especies', 'Darwin publicó El origen de las especies en 1859 tras años de observaciones, incluidas las de las islas Galápagos.'], ['Guisantes de monasterio', 'Mendel descubrió las leyes de la herencia cruzando plantas de guisante en el huerto de su monasterio.'], ['Centrales de energía', 'Las mitocondrias producen la energía de la célula y tienen ADN propio, que se hereda solo de la madre.'], ['La Amazonía', 'La Amazonía alberga una de cada diez especies conocidas del planeta.'], ['Los virus', 'Los virus no son células: necesitan entrar en una para multiplicarse.'], ['Bacterias amigas', 'En el intestino viven billones de bacterias que ayudan a digerir y a defenderse de infecciones.']],
    anat: [['206 huesos', 'El esqueleto adulto tiene 206 huesos; el de un recién nacido, cerca de 300, que se van soldando al crecer.'], ['El más largo y el más pequeño', 'El fémur es el hueso más largo del cuerpo; el estribo, en el oído, el más pequeño.'], ['Cien mil latidos', 'El corazón late unas 100 000 veces al día y mueve en ese tiempo unos 7000 litros de sangre.'], ['Una pista de tenis', 'Los pulmones tienen unos 300 millones de alvéolos; extendidos, cubrirían una superficie parecida a una pista de tenis.'], ['Siete metros', 'El intestino delgado mide entre 6 y 7 metros y en él se absorben la mayoría de los nutrientes.'], ['Piel nueva', 'La piel es el órgano más grande del cuerpo y se renueva por completo en unas cuatro semanas.'], ['Un órgano que gasta', 'El cerebro pesa un 2 % del cuerpo pero consume cerca del 20 % de su energía.'], ['Medir en cabezas', 'Los cánones de proporción usan la cabeza como medida: una persona adulta mide unas 8 cabezas y un niño de 6 años, unas 6.']],
    fisica: [['Los Principia', 'Newton publicó sus tres leyes del movimiento en 1687.'], ['Ocho minutos de luz', 'La luz viaja a casi 300 000 km por segundo y tarda unos ocho minutos en llegar del Sol a la Tierra.'], ['Caen igual', 'Sin aire, todos los cuerpos caen con la misma aceleración, sean ligeros o pesados.'], ['La energía se transforma', 'La energía ni se crea ni se destruye: una bombilla convierte electricidad en luz y calor.'], ['El empuje', 'Arquímedes descubrió que un cuerpo sumergido recibe un empuje igual al peso del líquido que desaloja.'], ['Pesar menos en la Luna', 'En la Luna la gravedad es unas seis veces menor: una persona de 60 kg pesaría allí como una de 10 kg en la Tierra.'], ['Voltios en casa', 'En buena parte de América los enchufes dan 110–120 voltios; en España, 230.'], ['Silencio en el espacio', 'El sonido necesita un medio para propagarse: en el vacío del espacio no se oye nada.']],
    quimica: [['118 elementos', 'Todo lo que nos rodea está hecho de átomos de solo 118 elementos conocidos.'], ['Huecos con futuro', 'Mendeléiev ordenó los elementos en 1869 y dejó huecos para elementos aún desconocidos; predijo bien sus propiedades.'], ['H₂O', 'Cada molécula de agua tiene dos átomos de hidrógeno y uno de oxígeno.'], ['La masa se conserva', 'Lavoisier demostró que en una reacción química la masa total no cambia.'], ['De 0 a 14', 'El pH mide la acidez de una disolución: 7 es neutro, por debajo es ácido y por encima, básico.'], ['Dos premios Nobel', 'Marie Curie descubrió el polonio y el radio y fue la primera persona en recibir dos premios Nobel, de Física y de Química.'], ['Herrumbre', 'El hierro se oxida con el aire húmedo y forma herrumbre; por eso se pintan barcos y puentes.'], ['Química en la sartén', 'El dorado del pan y de la carne se debe a la reacción de Maillard entre azúcares y proteínas.']],
    geografia: [['El más caudaloso', 'El Amazonas vierte al océano más agua que los siete ríos siguientes juntos.'], ['7000 kilómetros de montañas', 'Los Andes son la cordillera continental más larga del planeta.'], ['Atacama', 'El desierto de Atacama es uno de los lugares más secos de la Tierra; en algunas zonas no se ha registrado lluvia en años.'], ['Estaciones al revés', 'Cuando en el hemisferio norte es verano, en el sur es invierno, porque el eje de la Tierra está inclinado.'], ['Latitud y longitud', 'Los paralelos miden la latitud y los meridianos la longitud; con las dos se localiza cualquier punto.'], ['Un mundo urbano', 'Más de la mitad de la población mundial vive hoy en ciudades.'], ['El salto Ángel', 'En Venezuela está la cascada más alta del mundo, el salto Ángel, con 979 metros.'], ['Leer la escala', 'Una escala 1:100 000 significa que 1 cm del mapa equivale a 1 km del terreno.']],
    cocina: [['Pan de 14 000 años', 'Se han encontrado restos de pan de hace más de 14 000 años: es uno de los alimentos elaborados más antiguos.'], ['La levadura', 'La levadura es un hongo microscópico; al fermentar los azúcares produce el gas que hace crecer la masa.'], ['Chocolate', 'El cacao ya lo cultivaban olmecas, mayas y mexicas; la palabra «chocolate» viene del náhuatl.'], ['El maíz', 'El maíz se domesticó en el actual México hace unos 9000 años a partir de una planta silvestre, el teosinte.'], ['Miles de papas', 'La papa se cultiva en los Andes desde hace más de 7000 años y hoy hay miles de variedades.'], ['Hervir en la altura', 'A nivel del mar el agua hierve a 100 °C; en Bogotá, a unos 2600 metros, hierve cerca de los 91 °C y los guisos tardan más.'], ['Cuatro reglas', 'Lavar, separar crudo y cocinado, cocinar bien y enfriar rápido: las cuatro reglas básicas de seguridad alimentaria.'], ['El caramelo', 'El azúcar empieza a caramelizar hacia los 160 °C; por encima de 190 °C amarga.']]
  };
  SABER.historia = SABER.soci; SABER.idiomas = SABER.ingles;
  ['reposteria', 'panaderia', 'pasteleria', 'batidos'].forEach(function (m) { SABER[m] = SABER.cocina; });

  /* ─────────── discurso por grupo de materias ─────────── */
  var LENTE = {
    num: ['En esta materia una afirmación vale cuando se puede comprobar: si la regla funciona, funciona siempre, y un solo contraejemplo basta para desmentirla.', 'Conviene estimar antes de calcular: una cifra aproximada avisa enseguida si el resultado final es disparatado.', 'Cada paso tiene que poder explicarse con palabras; si no sabemos decir por qué hacemos algo, todavía no lo entendemos del todo.', 'Dibujar la situación, aunque sea con un esquema rápido, ahorra muchos errores.', 'Las unidades importan tanto como los números: sin ellas, un resultado no dice nada.', 'Un mismo problema admite varios caminos; comparar dos de ellos es la mejor forma de comprobar el resultado.'],
    cien: ['La ciencia avanza con preguntas que se pueden poner a prueba: se observa, se propone una explicación y se diseña un experimento para comprobarla.', 'Un buen registro de observaciones anota qué se midió, cómo, cuándo y con qué instrumento.', 'Los modelos científicos simplifican la realidad para explicarla; no son la realidad, pero ayudan a predecir lo que va a pasar.', 'Una sola observación no basta: un resultado vale cuando otras personas repiten el experimento y obtienen lo mismo.', 'Comparar con un grupo de control permite saber si un cambio se debe de verdad a lo que estudiamos.', 'Medir exige elegir bien el instrumento: no se mide igual un grano de arena que una montaña.'],
    letras: ['La lengua es una herramienta para entender y hacerse entender; cada norma existe porque evita malentendidos.', 'Leer mucho es la forma más eficaz de escribir mejor: los buenos textos enseñan sin que nos demos cuenta.', 'Un mismo mensaje cambia según a quién va dirigido: no se escribe igual a una amiga que a una institución.', 'Las palabras se entienden mejor dentro de una frase y de una situación que sueltas en una lista.', 'Revisar un texto al día siguiente permite verlo con ojos nuevos y detectar lo que sobra.', 'Hablar en voz alta lo que se ha leído es una prueba rápida de si se ha comprendido.'],
    soc: ['Para entender el presente hay que preguntarse cómo se llegó hasta él y quién tomó cada decisión.', 'Las fuentes —documentos, objetos, testimonios, mapas— son las pruebas con las que se estudia la sociedad.', 'Un mismo hecho se cuenta de maneras distintas según quién lo vivió; comparar versiones acerca a lo que pasó.', 'El espacio y el tiempo se estudian juntos: dónde ocurre algo explica muchas veces por qué ocurre.', 'Las normas de convivencia cambian, y casi siempre cambian porque alguien las cuestionó con argumentos.', 'Situar cada hecho en un mapa y en una línea del tiempo ordena la memoria y evita confusiones.'],
    arte: ['En arte se aprende mirando despacio: primero lo que se ve, después cómo está hecho y por último qué transmite.', 'Cada técnica tiene sus reglas, y conocerlas permite también saltárselas con intención.', 'El boceto es un paso imprescindible: permite probar ideas antes de dedicarles horas.', 'La práctica diaria, aunque sea breve, educa la mano y el oído más que una sesión larga de vez en cuando.', 'Describir una obra con vocabulario preciso ayuda a entenderla y a disfrutarla más.', 'Crear en grupo exige escuchar: el resultado es de todos cuando cada parte encaja con las demás.'],
    cuerpo: ['El cuerpo aprende con la repetición: un gesto se automatiza después de practicarlo muchas veces bien hecho.', 'Cada sesión sigue un orden: calentamiento, parte principal y vuelta a la calma.', 'Escuchar al propio cuerpo es parte del entrenamiento; un dolor agudo es una señal para parar.', 'La mejora llega cuando el esfuerzo aumenta poco a poco y hay tiempo para descansar.', 'Moverse bien es también moverse con otros: la cooperación forma parte de la educación física.', 'Registrar tiempos, marcas o pulsaciones permite ver el progreso con datos y no solo con sensaciones.'],
    tec: ['La tecnología resuelve problemas concretos: primero se define bien qué se necesita y después se busca la solución.', 'Todo proyecto técnico pasa por idear, diseñar, construir, probar y mejorar.', 'Elegir un material es elegir sus propiedades: dureza, peso, precio y facilidad para trabajarlo.', 'La seguridad va primero: cada herramienta tiene una forma correcta de usarse y de guardarse.', 'Documentar lo que se hace permite que otra persona lo repita o lo mejore.', 'Un diseño sencillo que funciona vale más que uno complicado que falla.'],
    oficio: ['En un oficio, la técnica se aprende viendo, haciendo y corrigiendo junto a alguien con experiencia.', 'La higiene y el orden del puesto de trabajo son parte del resultado, no un añadido.', 'Cada producto tiene su ficha técnica: leerla antes de usarlo evita errores y riesgos.', 'Medir y anotar lo que se hace permite repetir un buen resultado otro día.', 'La atención a la persona, clienta o comensal, importa tanto como la técnica.', 'Trabajar con método reduce el cansancio: cada cosa en su sitio y cada paso en su momento.']
  };
  var ESCENA = {
    num: ['{nom} ayuda los sábados en la tienda de su familia en {ciudad}. Cuando llega un pedido, aplica «{k}» para saber si las cuentas cuadran; si se equivoca, la diferencia sale de la caja.', 'En el club deportivo de {ciudad} preparan un torneo y {nom} organiza horarios y equipos. Hasta que no usó «{k}», dos partidos coincidían a la misma hora.', '{nom} quiere ahorrar para una bicicleta. Apunta lo que gana y lo que gasta cada semana y recurre a «{k}» para calcular cuándo tendrá el dinero.', 'Para pintar su habitación, {nom} tiene que saber cuánta pintura comprar en una ferretería de {ciudad}. «{k}» le permite no quedarse corto ni gastar de más.', 'La clase de {nom} organiza una excursión a {ciudad2} y hay que repartir el coste del autobús. Ahí aparece «{k}».', 'En el mercado de {ciudad}, {nom} compara los precios de dos puestos. Con «{k}» descubre cuál es de verdad la mejor oferta.'],
    cien: ['{nom} ha notado que las plantas de su balcón en {ciudad} crecen distinto según dónde estén. Para entender por qué, necesita «{k}».', 'En una salida al campo cerca de {ciudad}, el grupo de {nom} recoge muestras. En el laboratorio del centro comprueban que «{k}» explica lo que han visto.', 'La abuela de {nom} asegura que antes llovía de otra manera en {ciudad}. {nom} busca datos y descubre que «{k}» sirve para comprobar si tiene razón.', '{nom} se prepara para una carrera popular en {ciudad} y quiere entender qué le pasa a su cuerpo. La respuesta pasa por «{k}».', 'En la cocina de casa, {nom} observa algo curioso mientras hierve el agua. Lo que ocurre tiene que ver con «{k}».', 'En el museo de ciencias de {ciudad}, una guía enseña a {nom} un experimento sencillo con «{k}» que se puede repetir en casa.'],
    letras: ['{nom} escribe un artículo para el periódico escolar de su centro en {ciudad}. Al releerlo, se da cuenta de que «{k}» cambia por completo cómo se entiende.', 'En la biblioteca de {ciudad}, {nom} encuentra un libro antiguo. Para entender la primera página tiene que fijarse en «{k}».', '{nom} graba un audio para una amiga que vive en {ciudad2}. Al escucharlo descubre que «{k}» es la clave para que el mensaje llegue claro.', 'La profesora pide a {nom} que presente un libro a la clase. Preparar la exposición le obliga a pensar en «{k}».', '{nom} ayuda a su hermano pequeño con los deberes; explicarle «{k}» le sirve para entenderlo mejor a sí mismo.', 'En un cartel de una calle de {ciudad}, {nom} encuentra un error. Explicar por qué está mal le lleva directamente a «{k}».'],
    soc: ['{nom} visita con su familia el centro histórico de {ciudad}. Una placa en una fachada le hace preguntarse por «{k}».', 'En la asamblea de clase, el grupo de {nom} decide cómo repartir el patio. Sin darse cuenta, están poniendo en práctica «{k}».', 'El abuelo de {nom} cuenta cómo era {ciudad} cuando era joven. Comparar su relato con fotos antiguas es una forma de trabajar «{k}».', '{nom} prepara un viaje de {ciudad} a {ciudad2} y consulta un mapa. Entender el recorrido le obliga a pensar en «{k}».', 'Una noticia del periódico de {ciudad} habla de un cambio en el barrio de {nom}. Para opinar con fundamento necesita entender «{k}».', 'En un museo de {ciudad}, {nom} se detiene ante un objeto de otra época. La cartela explica que tiene que ver con «{k}».'],
    arte: ['{nom} quiere pintar un mural en el patio de su centro en {ciudad}. Antes de empezar, tiene que dominar «{k}».', 'En un concierto al aire libre en {ciudad}, {nom} se fija en algo que nunca había notado: «{k}».', '{nom} fotografía una plaza de {ciudad} y compara la foto con un cuadro de la misma plaza. La diferencia está en «{k}».', 'Para la fiesta del barrio, {nom} diseña el cartel. Elegir colores y formas le obliga a pensar en «{k}».', '{nom} ensaya con su grupo para {fiesta}. La directora insiste una y otra vez en «{k}».', 'En el taller de un artesano de {ciudad}, {nom} ve trabajar sus manos y entiende de verdad qué es «{k}».'],
    cuerpo: ['{nom} entrena con el equipo del barrio en {ciudad}. El entrenador le corrige un gesto y le explica que se trata de «{k}».', 'Antes de la carrera escolar, {nom} se pregunta por qué hay que calentar. La respuesta está en «{k}».', 'En una excursión a la montaña cerca de {ciudad}, {nom} se cansa antes de lo normal y entiende la importancia de «{k}».', 'El equipo de {nom} pierde un partido por no organizarse. En la charla de después aparece «{k}».', '{nom} quiere mejorar su marca en salto. Una fisioterapeuta le explica que la clave es «{k}».', 'En clase, {nom} ayuda a un compañero lesionado y descubre qué significa «{k}».'],
    tec: ['{nom} construye una lámpara para su escritorio. El primer prototipo falla y el problema resulta ser «{k}».', 'En el taller del centro de {ciudad}, el grupo de {nom} diseña un puente con palillos. Para que aguante el peso necesitan «{k}».', '{nom} ayuda a su tía a configurar un ordenador nuevo. Lo que parecía sencillo exige entender «{k}».', 'El grupo de {nom} programa un pequeño robot que sigue una línea. Cuando se sale del camino, la causa es «{k}».', '{nom} desmonta un juguete viejo para ver cómo funciona y encuentra dentro un ejemplo perfecto de «{k}».', 'En la feria de ciencia y tecnología de {ciudad}, {nom} presenta un invento sencillo basado en «{k}».'],
    oficio: ['En su primer día de prácticas en un negocio de {ciudad}, {nom} observa a la profesional con más experiencia. Lo primero que le enseña es «{k}».', 'Una clienta habitual llega con prisa y {nom} tiene que decidir qué hacer primero. La respuesta está en «{k}».', '{nom} prepara {comida} para una comida familiar y descubre que el resultado depende de «{k}».', 'En un concurso de jóvenes profesionales en {ciudad}, el jurado valora sobre todo «{k}».', '{nom} anota en su cuaderno de trabajo cada paso. Al repasarlo, ve que el fallo estaba en «{k}».', 'Una persona pregunta a {nom} por qué trabaja así y no de otra forma. Para explicarlo tiene que hablar de «{k}».']
  };
  var CIERRE_ESC = ['¿Qué habría pasado si no lo hubiera tenido en cuenta?', '¿Te ha pasado algo parecido alguna vez?', 'Piensa en una situación de tu vida en la que ocurra lo mismo.', '¿Qué consejo le darías para la próxima vez?', '¿Dónde más podrías encontrar esta idea?', 'Fíjate en que no hace falta estar en clase para usar lo que aprendes.'];
  var ERR = {
    num: ['Confundir «{k}» con «{k2}». Se parecen, pero no se aplican a las mismas situaciones: antes de elegir, piensa qué te pide el enunciado.', 'Calcular deprisa y no revisar. Comprueba siempre si el resultado tiene sentido con los datos: si una persona mide 16 metros, algo ha fallado.', 'Olvidar las unidades al escribir el resultado de «{k}». Un número sin unidad no responde a la pregunta.', 'Copiar mal un dato. Subraya los datos del enunciado antes de empezar y vuelve a leerlos al terminar.'],
    cien: ['Pensar que «{k}» y «{k2}» son lo mismo. Están relacionados, pero cada uno explica una parte distinta del fenómeno.', 'Sacar conclusiones de una sola observación de «{k}». Repite la prueba y compara.', 'Mezclar lo que se observa con lo que se imagina. En el cuaderno de laboratorio anota solo lo que ves y mides.', 'Creer que una explicación de «{k}» es cierta porque suena bien. Hay que comprobarla.'],
    letras: ['Usar «{k}» y «{k2}» como si fueran sinónimos. Cada término tiene su uso.', 'Escribir de corrido sin releer. Casi todos los errores con «{k}» se ven en la segunda lectura.', 'Pensar que un texto largo es mejor que uno claro. Di lo necesario y nada más.', 'Olvidar a quién va dirigido el texto al trabajar «{k}».'],
    soc: ['Juzgar el pasado con los ojos de hoy sin entender el contexto. Pregúntate qué sabían y qué podían hacer en esa época.', 'Confundir «{k}» con «{k2}». Sitúa cada uno en el tiempo y en el espacio.', 'Fiarse de una sola fuente al estudiar «{k}». Contrasta al menos dos.', 'Pensar que los cambios sociales ocurren de un día para otro. Casi siempre son procesos largos.'],
    arte: ['Empezar por los detalles antes de tener la estructura general.', 'Confundir «{k}» con «{k2}». Observa un ejemplo de cada uno y compáralos.', 'Creer que solo vale lo que sale bien a la primera. El error es parte del proceso de «{k}».', 'Copiar sin mirar de verdad el modelo.'],
    cuerpo: ['Saltarse el calentamiento por ganar tiempo.', 'Confundir «{k}» con «{k2}». No trabajan lo mismo ni se entrenan igual.', 'Querer mejorar en «{k}» en una semana lo que requiere meses.', 'Aguantar el dolor en lugar de avisar.'],
    tec: ['Construir sin diseñar antes. Un boceto con medidas ahorra material y tiempo.', 'Confundir «{k}» con «{k2}».', 'Probar una sola vez y dar por bueno el diseño de «{k}».', 'Usar una herramienta para algo distinto de su función.'],
    oficio: ['Saltarse un paso para ir más rápido.', 'Confundir «{k}» con «{k2}». El resultado final cambia mucho.', 'No leer la ficha técnica antes de trabajar con «{k}».', 'Descuidar la higiene al final de la jornada, cuando pesa el cansancio.']
  };
  var LEAD = ['En esta sección nos detenemos en «{k}», una de las ideas que sostienen la unidad «{t}».', 'Para entender «{t}» hace falta dominar «{k}». Lo vemos paso a paso, con un ejemplo y un dibujo.', '«{k}» aparece una y otra vez a lo largo de la unidad. Aquí explicamos qué es, cómo se reconoce y dónde lo encontramos.', 'Hay conceptos que abren la puerta a muchos otros. «{k}» es uno de ellos.', 'Si solo pudieras quedarte con una idea de esta parte de la unidad, sería «{k}».', 'Antes de practicar, conviene tener claro qué significa «{k}» y para qué sirve.', 'Esta página reúne lo que necesitas saber sobre «{k}» para seguir avanzando en «{t}».', '«{k}» parece sencillo, pero esconde matices que conviene conocer.'];
  var REL = ['«{k}» no se entiende del todo sin «{k2}»: uno ayuda a explicar el otro.', 'Entre «{k}» y «{k2}» hay una relación estrecha que verás a lo largo de la unidad.', 'Cuando aparezca «{k2}», recuerda lo que has leído aquí sobre «{k}».', 'Compara «{k}» con «{k2}»: ver en qué se parecen y en qué se diferencian es una buena manera de estudiar los dos.', 'Muchas veces «{k}» y «{k2}» aparecen juntos; aprender a distinguirlos te dará ventaja.', 'Piensa en «{k2}» como el siguiente paso después de «{k}».'];
  var INVESTIGA = ['Busca en {ciudad} un ejemplo de «{k}» y fotografíalo o dibújalo. Escribe dónde lo encontraste.', 'Pregunta a una persona mayor de tu familia qué sabe de «{k}». Anota su respuesta y compárala con lo que has leído.', 'Busca «{k}» en un periódico, una web fiable o un libro de la biblioteca. Copia la frase donde aparece y explica qué significa allí.', 'Prepara una explicación de un minuto sobre «{k}» para alguien que no sepa nada del tema.', 'Inventa una pregunta de examen sobre «{k}» y escribe también la respuesta correcta.', 'Haz un dibujo o esquema que explique «{k}» sin usar más de diez palabras.'];
  var HIST = {
    tit: ['{nom} y el misterio de «{k}»', 'Una tarde en {ciudad}', 'El reto de {nom}', 'Lo que {n2} no sabía', 'Camino de {ciudad2}', 'La pregunta de {nom}', 'El cuaderno de {n2}', 'Todo por «{k}»'],
    ini: ['Aquella mañana {ciudad} amaneció con el cielo limpio y {nom} salió de casa antes de lo habitual. Tenía una idea en la cabeza desde el día anterior y no pensaba esperar más para comprobarla.', 'En el barrio de {nom}, en {ciudad}, todo el mundo se conoce. Por eso, cuando {n2} llegó con una pregunta extraña, la noticia corrió de puerta en puerta.', 'Faltaban pocos días para {fiesta} y en casa de {nom} no se hablaba de otra cosa. Entre los preparativos surgió un problema que nadie esperaba.', '{nom} y {n2} se conocían desde pequeños. Compartían pupitre, merienda y una curiosidad que a veces les metía en líos.', 'El autobús de {ciudad} a {ciudad2} llevaba media hora parado. {nom} miró por la ventana, suspiró y sacó el cuaderno de la mochila.', 'La lluvia no paraba y el recreo se quedó sin patio. {nom} y {n2} se sentaron junto a la ventana con una pregunta que les rondaba desde hacía días.'],
    pro: ['El problema era fácil de decir y difícil de resolver: sin entender «{k}» no había manera de seguir. {n2} lo intentó a su manera y se equivocó dos veces.', 'Al principio creyeron que todo dependía de la suerte. Pronto vieron que «{k}» tenía mucho que ver, y que ninguno de los dos lo dominaba.', '«¿Y si lo miramos de otra forma?», propuso {nom}. Hasta entonces solo habían pensado en «{k2}», pero la respuesta parecía estar en «{k}».', 'Discutieron un buen rato. {n2} defendía una idea y {nom}, la contraria. Solo coincidían en una cosa: tenían que entender mejor «{k}».', 'Lo que parecía un juego se complicó cuando el resultado cambió cada vez que lo repetían. Algo se les escapaba, y ese algo era «{k}».', 'Nadie en casa supo responder. Ni la tía, que lo sabe casi todo. Así que decidieron averiguar por su cuenta qué era eso de «{k}».'],
    res: ['Entonces {nom} recordó lo que habían visto en clase: {idea} Con esa pista, todo empezó a encajar.', 'En la biblioteca encontraron la clave: {idea} La apuntaron en grande para no olvidarla.', 'La respuesta llegó de quien menos esperaban, la vecina del quinto, que había trabajado muchos años en eso. «{idea}», les dijo sonriendo.', 'Hicieron una prueba sencilla y anotaron el resultado. Así comprobaron que {ideaMin}', 'Después de mucho pensar, {n2} lo explicó con sus propias palabras: {idea} {nom} asintió; por fin lo veía claro.', 'Fue la profesora quien les dio la pista con una sola frase: {idea} El resto lo descubrieron solos.'],
    fin: ['Esa noche {nom} lo contó en casa. Nadie lo sabía, y todos quisieron probarlo al día siguiente.', 'No ganaron ningún premio, pero aprendieron algo que ya no se les iba a olvidar.', 'Desde entonces, cada vez que alguien en {ciudad} menciona «{k}», {nom} y {n2} se miran y sonríen.', 'Días después la profesora les pidió que lo explicaran a toda la clase. Lo hicieron sin mirar el papel ni una sola vez.', '{nom} guardó el cuaderno. Todavía le quedaban preguntas, pero ahora sabía cómo buscar las respuestas.', 'Al despedirse, {n2} dijo lo que los dos pensaban: «La próxima vez empezamos por entenderlo».']
  };
  var PASOS = {
    num: ['Lee el enunciado dos veces y subraya los datos.', 'Decide qué te piden y qué regla lo resuelve.', 'Estima el resultado antes de calcular.', 'Resuelve paso a paso, escribiendo cada operación.', 'Comprueba el resultado y escribe la unidad.'],
    cien: ['Plantea la pregunta que quieres responder.', 'Escribe tu hipótesis: lo que crees que pasará.', 'Diseña una prueba en la que cambie una sola cosa.', 'Observa, mide y anota los datos.', 'Compara con tu hipótesis y saca una conclusión.'],
    letras: ['Lee el texto completo sin detenerte.', 'Localiza la idea principal de cada párrafo.', 'Subraya las palabras clave.', 'Relaciona el texto con lo que ya sabes.', 'Explica con tus palabras lo que has entendido.'],
    soc: ['Sitúa el hecho en el tiempo y en el espacio.', 'Identifica a las personas y grupos que intervienen.', 'Busca las causas.', 'Describe las consecuencias.', 'Relaciónalo con el presente.'],
    arte: ['Observa el conjunto antes que los detalles.', 'Identifica la técnica y los materiales.', 'Analiza la composición: formas, colores, ritmos.', 'Busca la intención de quien lo creó.', 'Da tu valoración con argumentos.'],
    cuerpo: ['Calienta de forma progresiva.', 'Aprende el gesto despacio y bien hecho.', 'Repite aumentando la velocidad poco a poco.', 'Aplícalo en una situación de juego.', 'Vuelve a la calma y estira.'],
    tec: ['Define el problema y las condiciones.', 'Dibuja un boceto con medidas.', 'Elige materiales y herramientas.', 'Construye un prototipo.', 'Prueba, anota los fallos y mejora.'],
    oficio: ['Prepara el puesto y los materiales.', 'Revisa la ficha técnica.', 'Aplica la técnica paso a paso.', 'Comprueba el resultado con la persona.', 'Limpia, ordena y anota lo que has hecho.']
  };
  var PROY = {
    num: [['Estudio de precios del barrio', 'Comparar precios reales de cinco productos en tres comercios de {ciudad} y presentar las conclusiones con una gráfica.', ['cuaderno', 'calculadora', 'papel milimetrado']], ['Diseña tu habitación ideal', 'Dibujar a escala el plano de una habitación, calcular superficies y presupuestar los muebles.', ['regla', 'papel cuadriculado', 'catálogo de muebles']], ['Encuesta de clase', 'Preparar una encuesta, recoger datos de la clase y analizarlos con tablas y porcentajes.', ['cuestionario', 'hoja de cálculo o cuaderno', 'lápices de colores']]],
    cien: [['Diario de una planta', 'Cultivar una semilla durante tres semanas, medir su crecimiento y explicar qué necesita para vivir.', ['semillas', 'vaso con tierra', 'regla', 'cuaderno de campo']], ['Laboratorio en casa', 'Diseñar un experimento sencillo con materiales de cocina, repetirlo tres veces y presentar los resultados.', ['materiales de cocina', 'cronómetro', 'cuaderno']], ['Guía de la biodiversidad del barrio', 'Fotografiar o dibujar diez seres vivos de {ciudad} y elaborar fichas con su nombre y características.', ['cámara o cuaderno', 'lupa', 'guía de campo']]],
    letras: [['Periódico de clase', 'Escribir, corregir y maquetar entre todos un periódico de cuatro páginas sobre la vida del centro.', ['ordenador o folios', 'fotografías', 'rotuladores']], ['Pódcast literario', 'Grabar un episodio de cinco minutos recomendando un libro leído en clase.', ['móvil o grabadora', 'guion escrito']], ['Antología de clase', 'Reunir un poema o relato breve de cada alumno en un pequeño libro ilustrado.', ['folios', 'grapadora', 'lápices de colores']]],
    soc: [['Mi barrio hace cincuenta años', 'Entrevistar a personas mayores y comparar fotos antiguas y actuales de {ciudad}.', ['grabadora', 'fotografías antiguas', 'mapa del barrio']], ['Mapa de servicios', 'Localizar en un mapa los servicios públicos del barrio y proponer uno que falte.', ['mapa impreso', 'pegatinas de colores']], ['Línea del tiempo gigante', 'Construir en el pasillo una línea del tiempo con los hechos estudiados y una imagen de cada uno.', ['papel continuo', 'cinta métrica', 'imágenes']]],
    arte: [['Exposición de aula', 'Preparar, montar y presentar una exposición con obras de la clase y sus cartelas.', ['obras', 'cartulinas', 'cinta adhesiva']], ['Banda sonora', 'Crear la música o los efectos sonoros de un vídeo corto grabado en clase.', ['instrumentos', 'móvil para grabar']], ['Mural colectivo', 'Diseñar y pintar entre todos un mural sobre un tema acordado.', ['papel continuo', 'témperas', 'pinceles']]],
    cuerpo: [['Juegos de otros tiempos', 'Recuperar tres juegos populares de la familia y enseñarlos a la clase.', ['material de cada juego', 'fichas con las reglas']], ['Mi plan de actividad', 'Diseñar y seguir durante dos semanas un plan de actividad física y registrar cómo te sientes.', ['cuaderno', 'cronómetro']], ['Circuito cooperativo', 'Diseñar un circuito de seis estaciones que solo se pueda completar en equipo.', ['conos', 'aros', 'cuerdas']]],
    tec: [['Objeto útil con material reciclado', 'Diseñar y construir un objeto útil para el aula usando solo materiales reciclados.', ['cartón', 'pegamento', 'tijeras', 'regla']], ['Puente de palillos', 'Construir un puente de 30 cm que aguante el mayor peso posible y documentar las pruebas.', ['palillos', 'cola blanca', 'pesas']], ['Guía digital segura', 'Elaborar una guía ilustrada de uso seguro de internet para alumnos más pequeños.', ['ordenador', 'plantilla de diseño']]],
    oficio: [['Carta de servicios', 'Diseñar la carta o catálogo de un negocio con precios, descripciones y tiempos.', ['ordenador o cartulina', 'catálogo de referencia']], ['Demostración en vivo', 'Preparar y realizar una demostración de una técnica explicando cada paso al público.', ['materiales de la técnica', 'guion']], ['Ficha técnica propia', 'Elaborar la ficha técnica completa de un trabajo real, con materiales, tiempos y resultado.', ['plantilla de ficha', 'fotografías del proceso']]]
  };
  var CRIT = {
    num: ['Cálculos correctos', 'Explicación del proceso', 'Presentación de datos'], cien: ['Rigor en la observación', 'Registro de datos', 'Conclusiones'], letras: ['Contenido', 'Corrección lingüística', 'Presentación'], soc: ['Uso de fuentes', 'Comprensión del contexto', 'Exposición'],
    arte: ['Técnica', 'Creatividad', 'Trabajo en equipo'], cuerpo: ['Participación', 'Técnica', 'Cooperación'], tec: ['Diseño', 'Construcción', 'Documentación'], oficio: ['Técnica', 'Higiene y seguridad', 'Atención a la persona']
  };

  /* ─────────── utilidades de texto ─────────── */
  function llena(tpl, D) {
    var s = String(tpl).replace(/\{(\w+)\}/g, function (m, k) { return D[k] != null ? D[k] : m; });
    return s;
  }
  function minus1(s) { s = String(s || ''); return /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function limpio(s) { return String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

  function Libro(res) {
    this.C = res.C; this.res = res; this.usado = {}; this.figs = {}; this.tipoN = {}; this.rot = {};
    var m = this.C.mat; this.g = grupo(m);
    this.saber = H.mezcla(H.rng(H.hash(m + ':saber') + (this.C.semilla || 1)), SABER[m] || SABER.natu); this.si = 0; this.sj = this.saber.length;
    var yo = this;
    res.pages.forEach(function (p) { if (p.v && p.v.fig) { yo.figs[yo.huella(p.v.fig)] = 1; if (p.gen) yo.tipoN[p.gen] = (yo.tipoN[p.gen] || 0) + 1; } (p.items || []).forEach(function (x) { yo.usado['it:' + limpio(x.e)] = 1; }); });
  }
  Libro.prototype.huella = function (fig) { return H.hash(String(fig).replace(/\sd="[^"]{300,}"/g, '').replace(/\b(eu[a-z]*\d+|cp\d*|pcl)\b/g, '').replace(/<animate[^>]*\/>/g, '')); };
  Libro.prototype.nueva = function (lista, D, clave) {
    var n = lista.length; if (!n) return '';
    var ini = this.rot[clave] != null ? this.rot[clave] : H.hash(clave + (this.C.semilla || 1)) % n;
    for (var i = 0; i < n; i++) { var s = H.sub(llena(lista[(ini + i) % n], D), this.C).replace(/^([«¿¡]?)([a-záéíóúñ])/, function (m, a, b) { return a + b.toUpperCase(); }); if (!this.usado[s]) { this.usado[s] = 1; this.rot[clave] = ini + i + 1; return s; } }
    return '';
  };
  Libro.prototype.frase = function (s) { s = String(s || ''); if (!s || this.usado[s]) return ''; this.usado[s] = 1; return s; };
  Libro.prototype.dato = function (final) { if (this.si >= this.sj) return null; return final ? this.saber[--this.sj] : this.saber[this.si++]; };
  Libro.prototype.figura = function (u, clave, prefer) {
    var C = this.C, tipos = (prefer || []).concat(SV.tiposDe(u, C)).filter(function (t, i, a) { return a.indexOf(t) === i && !/^(sopa|ordena|esquema|dic_test)$/.test(t); });
    var ini = H.hash(u.id + clave) % Math.max(1, tipos.length), intentos = 0, ag = this.agotado || (this.agotado = {});
    for (var i = 0; i < tipos.length && intentos < 14; i++) {
      var ty = tipos[(ini + i) % tipos.length]; if ((this.tipoN[ty] || 0) >= 3 || ag[u.id + ty] >= 3 || ag[ty] >= 6) continue;
      for (var v = 0; v < 2; v++) {
        intentos++;
        var sem = H.hash(u.id + ':lec:' + clave + ':' + ty + ':' + v) + (C.semilla || 1) * 7919, V = SV.generar(ty, u, C, H.rng(sem));
        if (!V || !V.fig) { ag[ty] = 99; break; }
        var txtF = limpio(String(V.fig).replace(/<svg[\s\S]*?<\/svg>/g, '')).length; if (txtF > 120 && (this.tipoN[ty] || 0) >= 1) { ag[ty] = 99; break; }
        var hf = this.huella(V.fig); if (this.figs[hf]) { ag[u.id + ty] = (ag[u.id + ty] || 0) + 1; ag[ty] = (ag[ty] || 0) + 1; continue; }
        this.figs[hf] = 1; this.tipoN[ty] = (this.tipoN[ty] || 0) + 1;
        return { ty: ty, sem: sem, V: V };
      }
    }
    return null;
  };
  Libro.prototype.pie = function (f) { if (!f) return null; var intro = f.V.intro && !this.usado['pie:' + f.V.intro] ? f.V.intro : ''; if (intro) this.usado['pie:' + intro] = 1; return { ty: f.ty, sem: f.sem, t: f.V.t, intro: intro, html: f.V.fig }; };
  Libro.prototype.itemsDe = function (lista, n) {
    var yo = this, C = this.C, out = [];
    (lista || []).forEach(function (x) { if (out.length >= n || x.tipo === 'dibujo') return; var k = 'it:' + limpio(H.sub(x.e, C)); if (yo.usado[k]) return; yo.usado[k] = 1; out.push(Object.assign({}, x, { e: H.sub(x.e, C) })); });
    return out;
  };

  /* ─────────── construcción de páginas ─────────── */
  Libro.prototype.datos = function (u, ki) {
    var C = this.C, P = C.P, r = H.rng(H.hash(u.id + ':pers:' + ki) + (C.semilla || 1)), noms = H.mezcla(r, P.nombres), cs = H.mezcla(r, P.ciudades);
    var ks = (u.k || []).map(function (k) { return H.sub(k, C); }), k = ks[ki % Math.max(1, ks.length)] || H.sub(u.t, C), k2 = ks[(ki + 1) % Math.max(1, ks.length)] || k;
    return { nom: noms[0], n2: noms[1] || noms[0], ciudad: cs[0], ciudad2: cs[1] || cs[0], k: k, k2: k2, t: H.sub(u.t, C), fiesta: P.fiesta, comida: P.comida, mat: C.matN };
  };
  Libro.prototype.ideaNueva = function (u, k) {
    var C = this.C, yo = this, ideas = (u.i || []).map(function (s) { return H.sub(s, C); }).filter(function (s) { return !yo.usado[s]; }), kk = String(k).toLowerCase();
    var s = ideas.filter(function (x) { return x.toLowerCase().indexOf(kk) >= 0; })[0] || ideas[0] || '';
    if (s) this.usado[s] = 1; return s;
  };
  Libro.prototype.ideaDe = function (u, k) {
    var C = this.C, ideas = (u.i || []).map(function (s) { return H.sub(s, C); }), kk = String(k).toLowerCase();
    var con = ideas.filter(function (s) { return s.toLowerCase().indexOf(kk) >= 0; });
    return con[0] || ideas[0] || '';
  };
  Libro.prototype.concepto = function (u, ki, base) {
    var C = this.C, D = this.datos(u, ki), g = this.g, def = this.ideaNueva(u, D.k), yo = this;
    var fig = this.figura(u, 'c' + ki), dato = this.si < this.sj - 4 ? this.dato(true) : null, vfF = (u.vf || []).filter(function (x) { return !x[1]; })[ki];
    var err = vfF ? this.frase('Mucha gente cree que «' + H.sub(vfF[0], C).replace(/\.$/, '') + '». No es así: vuelve a leer la definición y busca en qué falla.') : this.nueva(ERR[g], D, 'err');
    var otras = (u.i || []).map(function (s) { return H.sub(s, C); }).filter(function (s) { return s !== def; });
    var cone = ['Además, ', 'Por otra parte, ', 'Conviene añadir que ', 'Hay que tener en cuenta que ', 'También es importante saber que '];
    var extra = otras[ki % Math.max(1, otras.length)];
    var pg = Object.assign({ tipo: 'lec_concepto', ki: ki, k: D.k, cab: null }, base, {
      lead: this.nueva(LEAD, D, 'lead'),
      que: [def, this.nueva(LENTE[g], D, 'lente')].filter(Boolean),
      como: [extra && !this.usado[extra] ? (this.usado[extra] = 1, cone[ki % cone.length] + minus1(extra)) : '', this.nueva(REL, D, 'rel')].filter(Boolean),
      ej: [this.nueva(ESCENA[g], D, 'esc'), this.nueva(CIERRE_ESC, D, 'cie')].filter(Boolean),
      err: err, dato: dato, inv: dato ? '' : this.nueva(INVESTIGA, D, 'inv'),
      fig: this.pie(fig),
      items: fig ? this.itemsDe(fig.V.items, C.peque ? 2 : 3) : []
    });
    pg.voz = [D.k, pg.lead].concat(pg.que, pg.como, pg.ej).join(' ');
    return pg;
  };
  Libro.prototype.lectura = function (u, base, pool) {
    var C = this.C, D = this.datos(u, 7), ideas = (u.i || []).map(function (s) { return H.sub(s, C); }), yo = this;
    var id1 = ideas[H.hash(u.id + 'lec') % Math.max(1, ideas.length)] || '', id2 = ideas.filter(function (s) { return s !== id1; })[0] || id1;
    D.idea = id1; D.ideaMin = minus1(id1); D.idea2 = id2;
    var tit = this.nueva(HIST.tit, D, 'htit') || D.t;
    var par = [this.nueva(HIST.ini, D, 'hini'), this.nueva(HIST.pro, D, 'hpro'), this.nueva(HIST.res, D, 'hres'), this.nueva(HIST.fin, D, 'hfin')].filter(Boolean);
    if (C.peque) par = [par[0], par[2]].filter(Boolean);
    var otrasU = (pool || []).filter(function (x) { return x !== u && x.i && x.i.length; });
    var dis = otrasU.slice(0, 6).map(function (x) { return H.sub(x.i[0], C); }).filter(function (s) { return s !== id1; });
    var r = H.rng(H.hash(u.id + ':lecmc') + (C.semilla || 1)), ops = H.mezcla(r, [id1].concat(H.mezcla(r, dis).slice(0, 2)));
    var items = [it('corta', '¿En qué ciudad vive ' + D.nom + '?', D.ciudad), it('corta', '¿Cómo se llama quien acompaña a ' + D.nom + '?', D.n2)];
    if (!C.peque && ops.length >= 3) items.push(it('mc', 'Según el texto, ¿qué idea les ayudó a resolver el problema?', 'abc'.charAt(ops.indexOf(id1)) + ') ' + id1, { o: ops, c: ops.indexOf(id1) }));
    items.push(it('abierta', H.pick(r, ['¿Qué habrías hecho tú en lugar de ' + D.nom + '? Explícalo.', 'Escribe otro final para la historia en tres o cuatro líneas.', '¿Qué parte de la historia te ha parecido más interesante? ¿Por qué?']), '', { lin: 3 }));
    var voc = (u.k || []).slice(0, 5).map(function (k) { return [H.sub(k, C), null]; });
    var pg = Object.assign({ tipo: 'lec_lectura', tit: tit, par: par, voc: voc, items: this.itemsDe(items, 5) }, base);
    pg.voz = tit + '. ' + par.join(' ');
    return pg;
  };
  Libro.prototype.caso = function (u, base) {
    var C = this.C, D = this.datos(u, 3), r = H.rng(H.hash(u.id + ':caso') + (C.semilla || 1) * 17), yo = this;
    var cand = H.ejercicios(u, C, r, 14).filter(function (x) { return x.tipo === 'corta' && x.s !== '' && x.s != null; });
    var hechos = this.itemsDe(cand, 3), tu = this.itemsDe(H.ejercicios(u, C, H.rng(H.hash(u.id + ':casotu') + (C.semilla || 1)), 14), 3);
    var pg = Object.assign({ tipo: 'lec_caso', pasos: PASOS[this.g].map(function (s) { return s.replace('.', '') ; }), hechos: hechos, items: tu, intro: this.nueva(ESCENA[this.g], this.datos(u, 5), 'esc') }, base);
    pg.voz = 'Problemas resueltos. ' + hechos.map(function (x) { return limpio(x.e) + ' Respuesta: ' + x.s; }).join(' ');
    return pg;
  };
  Libro.prototype.amplia = function (u, base) {
    var ds = []; for (var i = 0; i < 3; i++) { var d = this.dato(); if (d) ds.push(d); }
    if (ds.length < 2) { this.si -= ds.length; return null; }
    var fig = this.figura(u, 'amp', ['mapa_ruta', 'mapa_compara', 'linea_pais']);
    var D = this.datos(u, 4), pg = Object.assign({ tipo: 'lec_amplia', ds: ds, inv: this.nueva(INVESTIGA, D, 'inv'), fig: this.pie(fig), items: fig ? this.itemsDe(fig.V.items, 2) : [] }, base);
    pg.voz = ds.map(function (d) { return d[0] + '. ' + d[1]; }).join(' ');
    return pg;
  };
  Libro.prototype.proyecto = function (u, base, j) {
    var C = this.C, L = PROY[this.g]; if (j > L.length) return null; var p = L[j - 1], D = this.datos(u, 6), crit = CRIT[this.g];
    var pg = Object.assign({ tipo: 'lec_proyecto', pt: H.sub(llena(p[0], D), C), obj: H.sub(llena(p[1], D), C), mat: p[2], pasos: PASOS[this.g], crit: crit, k: D.k }, base);
    pg.voz = 'Proyecto: ' + pg.pt + '. ' + pg.obj;
    return pg;
  };
  Libro.prototype.sintesis = function (u, base) {
    var C = this.C, yo = this, fig = this.figura(u, 'sin', ['conceptual', 'mental']);
    var VERB = ['Explicar qué es «{k}» y dar un ejemplo propio.', 'Reconocer «{k}» en una situación de la vida diaria.', 'Distinguir «{k}» de «{k2}».', 'Usar «{k}» para resolver un problema nuevo.', 'Enseñar «{k}» a otra persona con un dibujo o un esquema.'];
    var ks = (u.k || []).map(function (k) { return H.sub(k, C); });
    var ideas = ks.map(function (k, i) { return H.sub(llena(VERB[i % VERB.length], { k: k, k2: ks[(i + 1) % ks.length] }), C); });
    var pg = Object.assign({ tipo: 'lec_sintesis', ideas: ideas, glos: ks.map(function (k) { return [k, null]; }), fig: this.pie(fig) }, base);
    pg.voz = 'Al terminar la unidad sabrás: ' + pg.ideas.join(' ');
    return pg;
  };

  /* ─────────── maqueta ─────────── */
  function h3(C, s) { var T = C.T; return '<h3 style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 1.08) + 'px;line-height:1.25;margin:0 0 1.4mm;color:' + T.acc + ';break-after:avoid">' + s + '</h3>'; }
  function par(s, extra) { return s ? '<p style="margin:0 0 2.6mm;' + (extra || '') + '">' + esc(s) + '</p>' : ''; }
  function kicker(C, s) { return '<div style="font-size:.72em;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:' + C.T.acc2 + ';margin:0 0 1.5mm">' + esc(s) + '</div>'; }
  function cols(C, html) { return C.peque ? '<div style="line-height:1.55">' + html + '</div>' : '<div lang="es" style="columns:2;column-gap:7mm;column-rule:' + (C.T.id === 'editorial' ? '0.2mm solid ' + C.T.soft : '0') + ';text-align:justify;hyphens:auto;line-height:1.5">' + html + '</div>'; }
  function caja(C, tit, html, alt) { var T = C.T; return '<div style="background:' + (alt ? T.soft2 : T.soft) + ';border-radius:' + T.r + 'px;padding:3mm 4mm;break-inside:avoid;min-width:0">' + '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';color:' + (alt ? T.acc2 : T.acc) + ';margin:0 0 1.2mm;font-size:.95em">' + tit + '</div><div style="font-size:.9em;line-height:1.45">' + html + '</div></div>'; }
  function figHTML(pg, C, n, mh) {
    var f = pg.fig; if (!f) return ''; if (pg.figMax) mh = Math.min(mh, pg.figMax);
    var html = f.html; try { var V = pg.u ? SV.generar(f.ty, pg.u, C, H.rng(f.sem)) : null; if (V && V.fig) html = V.fig; } catch (e) { }
    html = String(html).replace(/(<svg\b[^>]*?style=")/g, '$1max-height:' + mh + 'mm;');
    return '<figure style="margin:3mm 0;break-inside:avoid"><div style="display:flex;justify-content:center">' + '<div style="width:100%">' + html + '</div></div>' +
      '<figcaption style="font-size:.78em;margin-top:1.5mm;display:flex;gap:2mm;align-items:baseline"><b style="color:' + C.T.acc + ';white-space:nowrap">Figura ' + n + '</b><span>' + esc(f.t || '') + (f.intro ? ' — ' + esc(f.intro) : '') + '</span></figcaption></figure>';
  }
  function comprueba(pg, C, modo, tit) {
    if (!pg.items || !pg.items.length) return '';
    return '<div style="margin-top:3mm;break-inside:avoid">' + h3(C, tit || 'Comprueba') + pg.items.map(function (x, i) { return H.itemHTML(x, i, C, modo, 'l' + pg.num); }).join('') + '</div>';
  }
  function capitular(C, s) { var T = C.T; s = esc(s); return '<p style="margin:0 0 2.6mm"><span style="float:left;font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:3.3em;line-height:.82;margin:1mm 2mm 0 0;color:' + T.acc + '">' + s.charAt(0) + '</span>' + s.slice(1) + '</p>'; }

  var paginas = {
    lec_concepto: function (pg, C, modo) {
      var T = C.T, n = pg.n + '.' + (pg.ki + 1);
      var cuerpo = h3(C, 'Qué es') + pg.que.map(function (s) { return par(s); }).join('') + (C.peque ? '' : h3(C, 'Cómo se trabaja') + pg.como.map(function (s) { return par(s); }).join('')) + h3(C, 'Un ejemplo cercano') + pg.ej.map(function (s) { return par(s); }).join('');
      var cajas = [pg.err ? caja(C, 'Error frecuente', esc(pg.err)) : '', pg.dato ? caja(C, '¿Sabías que…? · ' + esc(pg.dato[0]), esc(pg.dato[1]), true) : pg.inv ? caja(C, 'Investiga', esc(pg.inv), true) : ''].filter(Boolean);
      return H.cabecera(C, pg) + kicker(C, 'Unidad ' + pg.n + ' · Concepto ' + (pg.ki + 1)) + H.h1(C, esc(H.may(pg.k)), 'margin-bottom:2mm') +
        (pg.lead ? '<p style="font-size:1.12em;font-style:italic;line-height:1.45;margin:0 0 4mm;color:' + T.ink + '">' + esc(pg.lead) + '</p>' : '') +
        cols(C, cuerpo) + figHTML(pg, C, n, C.peque ? 90 : 68) +
        (cajas.length ? '<div style="display:grid;grid-template-columns:' + (cajas.length > 1 && !C.peque ? '1fr 1fr' : '1fr') + ';gap:4mm;margin-top:3mm">' + cajas.join('') + '</div>' : '') +
        comprueba(pg, C, modo) + H.folio(C, pg);
    },
    lec_lectura: function (pg, C, modo) {
      var T = C.T, texto = pg.par.map(function (s, i) { return i === 0 ? capitular(C, s) : par(s, 'text-indent:5mm'); }).join('');
      var voc = pg.voc.length && !C.peque ? caja(C, 'Vocabulario', '<div style="display:flex;flex-wrap:wrap;gap:1.5mm 5mm">' + pg.voc.map(function (v) { return '<span><b>' + esc(v[0]) + '</b>' + (v[1] ? ' <span style="opacity:.75;font-size:.9em">→ pág. ' + v[1] + '</span>' : '') + '</span>'; }).join('') + '</div>', true) : '';
      return H.cabecera(C, pg) + kicker(C, 'Lectura · Unidad ' + pg.n) + H.h1(C, esc(pg.tit), 'margin-bottom:4mm') +
        '<div style="font-size:1.04em">' + cols(C, texto) + '</div>' + (voc ? '<div style="margin-top:3mm">' + voc + '</div>' : '') +
        comprueba(pg, C, modo, 'Comprensión lectora') + H.folio(C, pg);
    },
    lec_caso: function (pg, C, modo) {
      var T = C.T;
      var pasos = '<div style="display:grid;grid-template-columns:repeat(' + pg.pasos.length + ',minmax(0,1fr));gap:2mm;margin:0 0 4mm">' + pg.pasos.map(function (s, i) { return '<div style="border-top:1.2mm solid ' + (i % 2 ? T.acc2 : T.acc) + ';padding-top:1.5mm;font-size:.8em;line-height:1.3"><b style="display:block;color:' + T.acc + '">' + (i + 1) + '</b>' + esc(s) + '</div>'; }).join('') + '</div>';
      var hechos = pg.hechos.map(function (x, i) {
        return '<div style="border:1px solid ' + T.soft + ';border-radius:' + T.r + 'px;padding:3mm 4mm;margin:0 0 3mm;break-inside:avoid"><div style="font-size:.75em;letter-spacing:.12em;text-transform:uppercase;color:' + T.acc2 + ';font-weight:700;margin-bottom:1mm">Problema resuelto ' + (i + 1) + '</div>' +
          '<div style="margin-bottom:1.5mm">' + x.e + '</div><div style="display:flex;gap:2mm;align-items:baseline"><b style="color:' + T.acc + '">Resolución →</b><span>' + esc(x.s) + '</span></div>' + (x.x ? '<div style="font-size:.88em;margin-top:1mm;opacity:.9"><b>Por qué:</b> ' + esc(x.x) + '</div>' : '') + '</div>';
      }).join('');
      return H.cabecera(C, pg) + kicker(C, 'Unidad ' + pg.n + ' · Método') + H.h1(C, 'Así se resuelve', 'margin-bottom:3mm') + (pg.intro ? par(pg.intro, 'font-style:italic') : '') + h3(C, 'Los pasos') + pasos + hechos + comprueba(pg, C, modo, 'Ahora tú') + H.folio(C, pg);
    },
    lec_amplia: function (pg, C, modo) {
      var T = C.T, arts = pg.ds.map(function (d) { return '<div style="break-inside:avoid;margin:0 0 3mm">' + h3(C, esc(d[0])) + par(d[1]) + '</div>'; }).join('');
      return H.cabecera(C, pg) + kicker(C, 'Unidad ' + pg.n + ' · Para saber más') + H.h1(C, 'Para saber más', 'margin-bottom:4mm') + cols(C, arts) + figHTML(pg, C, pg.n + '.' + 9, 70) +
        (pg.inv ? '<div style="margin-top:3mm">' + caja(C, 'Investiga', esc(pg.inv), true) + '</div>' : '') + comprueba(pg, C, modo) + H.folio(C, pg);
    },
    lec_proyecto: function (pg, C) {
      var T = C.T, niveles = ['Excelente', 'Adecuado', 'En proceso'];
      var tabla = '<table style="width:100%;border-collapse:collapse;font-size:.85em;margin-top:2mm"><thead><tr><th style="text-align:left;padding:1.6mm;border-bottom:0.5mm solid ' + T.ink + '">Criterio</th>' + niveles.map(function (n) { return '<th style="text-align:left;padding:1.6mm;border-bottom:0.5mm solid ' + T.ink + '">' + n + '</th>'; }).join('') + '</tr></thead><tbody>' +
        pg.crit.map(function (c) { return '<tr><td style="padding:1.6mm;border-bottom:1px solid ' + T.soft + ';font-weight:700">' + esc(c) + '</td>' + niveles.map(function () { return '<td style="padding:1.6mm;border-bottom:1px solid ' + T.soft + '">□</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
      var pasos = pg.pasos.map(function (s, i) { return '<div style="display:flex;gap:3mm;margin:0 0 2mm"><span style="flex:none;width:7mm;height:7mm;border-radius:' + (T.r ? 99 : 0) + 'px;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85em">' + (i + 1) + '</span><span style="flex:1;padding-top:.8mm">' + esc(s) + '</span></div>'; }).join('');
      return H.cabecera(C, pg) + kicker(C, 'Unidad ' + pg.n + ' · Proyecto') + H.h1(C, esc(pg.pt), 'margin-bottom:3mm') +
        '<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:5mm;margin-bottom:3mm">' + caja(C, 'Objetivo', esc(pg.obj)) + caja(C, 'Materiales', pg.mat.map(function (m) { return '· ' + esc(m); }).join('<br/>'), true) + '</div>' +
        h3(C, 'Pasos') + pasos + h3(C, 'Producto final') + par('Presenta el resultado a la clase en cinco minutos y explica qué papel ha tenido «' + pg.k + '» en tu trabajo.') +
        h3(C, 'Rúbrica') + tabla + h3(C, 'Autoevaluación') + H.lineas(3, C) + H.folio(C, pg);
    },
    lec_sintesis: function (pg, C) {
      var T = C.T;
      var ideas = pg.ideas.map(function (s, i) { return '<div style="display:flex;gap:2.5mm;margin:0 0 2.2mm;break-inside:avoid"><b style="color:' + T.acc + ';font-family:' + T.tit + ';font-size:1.2em;line-height:1">' + (i + 1) + '</b><span>' + esc(s) + '</span></div>'; }).join('');
      var glos = pg.glos.map(function (g) { return '<div style="display:flex;align-items:baseline;gap:2mm;padding:1.4mm 0;border-bottom:1px solid ' + T.soft + ';break-inside:avoid"><b style="flex:1">' + esc(H.may(g[0])) + '</b>' + (g[1] ? '<span style="font-size:.85em;opacity:.8">pág. ' + g[1] + '</span>' : '') + '</div>'; }).join('');
      var auto = '<div style="display:grid;grid-template-columns:1fr auto auto auto;gap:1.5mm 4mm;font-size:.88em;align-items:center"><span></span><b>Lo sé</b><b>Casi</b><b>Repasar</b>' + pg.glos.map(function (g) { return '<span>' + esc(g[0]) + '</span><span>□</span><span>□</span><span>□</span>'; }).join('') + '</div>';
      return H.cabecera(C, pg) + kicker(C, 'Unidad ' + pg.n + ' · Síntesis') + H.h1(C, 'Al terminar, sabrás…', 'margin-bottom:3mm') + cols(C, ideas) + figHTML(pg, C, pg.n + '.0', 70) +
        '<div style="display:grid;grid-template-columns:' + (C.peque ? '1fr' : '1.3fr 1fr') + ';gap:5mm;margin-top:3mm"><div>' + h3(C, 'Términos de la unidad') + glos + '</div><div>' + h3(C, 'Autoevaluación') + auto + '</div></div>' + H.folio(C, pg);
    }
  };
  var voz = {}; Object.keys(paginas).forEach(function (k) { voz[k] = function (pg) { return pg.voz || ''; }; });
  ED.registrar({ paginas: paginas, voz: voz });

  /* ─────────── ampliación del libro ─────────── */
  var LIBROS = /^(libro|ebook|cuaderno|emprender)$/;
  function ampliar(res) {
    var C = res.C, pages = res.pages, N = pages.length;
    if (N < 30 || C.mat === 'idiomas' || C.mat === 'infantil' || C.libre) return; /* infantil: sus lecturas son de adultos; lo llenan sus propias páginas y la biblioteca */
    var share = C.prod.id === 'cuaderno' ? 0.15 : N >= 150 ? 0.4 : N >= 60 ? 0.3 : 0.18;
    var units = []; pages.forEach(function (p) { if (p.u && units.indexOf(p.u) < 0 && p.tipo === 'apertura') units.push(p.u); });
    if (!units.length) return;
    var L = new Libro(res), per = Math.max(1, Math.ceil(N * share / units.length)), quitar = {}, tras = {};
    units.forEach(function (u, ui) {
      var cand = [], pri = function (p) { return p.tipo === 'apuntes' ? 0 : p.tipo === 'actividad' ? 1 : 2; };
      pages.forEach(function (p, i) { if (p.u === u && (p.tipo === 'apuntes' || (p.relleno && (p.tipo === 'actividad' || p.tipo === 'vis')))) cand.push(i); });
      cand.sort(function (a, b) { return pri(pages[a]) - pri(pages[b]) || b - a; });
      var n = Math.min(per, cand.length); if (!n) return;
      var anc = -1; pages.forEach(function (p, i) { if (p.u === u && /^(apertura|explica|ejemplo)$/.test(p.tipo)) anc = i; });
      if (anc < 0) return;
      var base = { u: u, n: pages[anc].n }, nk = Math.min(5, (u.k || []).length), plan = [];
      var orden = C.peque ? ['c0', 'lectura', 'c1', 'c2', 'c3'] : ['c0', 'lectura', 'c1', 'caso', 'c2', 'amplia', 'c3', 'proyecto', 'sintesis', 'c4'];
      orden.forEach(function (o) { if (/^c\d$/.test(o) && +o.charAt(1) >= nk) return; plan.push(o); });
      var nuevas = [];
      for (var q = 0; q < plan.length && nuevas.length < n; q++) {
        var o = plan[q], pg = null;
        try {
          if (/^c\d$/.test(o)) pg = L.concepto(u, +o.charAt(1), base);
          else if (o === 'lectura') pg = L.lectura(u, base, units);
          else if (o === 'caso') pg = L.caso(u, base); else if (o === 'amplia') pg = L.amplia(u, base);
          else if (o === 'proyecto') pg = L.proyecto(u, base, L.np = (L.np || 0) + 1); else if (o === 'sintesis') pg = L.sintesis(u, base);
        } catch (e) { console.warn('EU_LIBRO', o, e); }
        if (pg) { pg.lec = true; nuevas.push(pg); }
      }
      if (!nuevas.length) return;
      cand.slice(0, nuevas.length).forEach(function (i) { quitar[i] = 1; });
      tras[anc] = nuevas;
    });
    var out = [];
    pages.forEach(function (p, i) { if (!quitar[i]) out.push(p); if (tras[i]) out.push.apply(out, tras[i]); });
    out.forEach(function (p, i) { p.num = i + 1; });
    out.forEach(function (p) { if (p.tipo !== 'lec_sintesis' && p.tipo !== 'lec_lectura') return; (p.glos || p.voc).forEach(function (g) { var c = out.filter(function (q) { return q.tipo === 'lec_concepto' && q.u === p.u && q.k === g[0]; })[0]; g[1] = c ? c.num : null; }); });
    res.pages = out;
    var sols = out.filter(function (p) { return p.tipo === 'solucion'; });
    if (sols.length) {
      var e = [];
      out.forEach(function (p) {
        if (p.tipo === 'vis' && p.v && p.v.sopa) e.push({ p: p.num, items: [{ s: p.v.sol }], u: p.u });
        else if (p.items && p.items.length && (p.tipo === 'actividad' || p.tipo === 'ficha' || p.tipo === 'vis' || p.lec)) e.push({ p: p.num, items: p.items, u: p.u });
      });
      var per2 = Math.ceil(e.length / sols.length);
      sols.forEach(function (p, i) { p.entradas = e.slice(i * per2, (i + 1) * per2); });
    }
  }
  var ens = ED.ensamblar;
  ED.ensamblar = function (cfg) {
    var res = ens(cfg);
    try { if (LIBROS.test(res.C.prod.id)) ampliar(res); } catch (e) { console.warn('EU_LIBRO', e); }
    return res;
  };

  window.EU_LIBRO = { SABER: SABER, LENTE: LENTE, ESCENA: ESCENA, grupo: grupo, ampliar: ampliar };
})();
