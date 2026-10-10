/* b6_texto_ingles.js — banco bilingüe de Inglés (window.EU_TEXTO_INGLES), 10-10-2026.
   Redactado por el sistema · a revisar por Fátima (esta nota es interna: no se imprime).
   Por cada unidad del currículo de Inglés (mismo id): título en español, traducción de cada idea (u.i, en el mismo
   orden), y vocabulario [inglés, español, cómo se pronuncia (pronunciación figurada para hispanohablantes)].
   Lo usa b6_ingles_bilingue.js para la página «Así se dice · English ↔ Español» y la lección «Escucha y repite». */
(function () {
  'use strict';
  if (window.EU_TEXTO_INGLES) return;
  window.EU_TEXTO_INGLES = {
    ing_colours: {
      t: 'Los colores y los números',
      i: ['El rojo, el azul y el amarillo son colores.', 'Contamos: uno, dos, tres, cuatro, cinco.', 'Decimos «It is red» (es rojo) para nombrar un color.'],
      v: [['red', 'rojo', 'red'], ['blue', 'azul', 'blú'], ['yellow', 'amarillo', 'iélou'], ['green', 'verde', 'grin'], ['one', 'uno', 'uan'], ['two', 'dos', 'tu'], ['three', 'tres', 'zri'], ['four', 'cuatro', 'for'], ['five', 'cinco', 'fáiv']]
    },
    ing_shapes: {
      t: 'Las formas y los colores',
      i: ['Un círculo es redondo: el sol es un círculo.', 'Un cuadrado tiene cuatro lados iguales.', 'Un triángulo tiene tres lados.', 'Decimos «a red square» (un cuadrado rojo): en inglés el color va primero.'],
      v: [['circle', 'círculo', 'sércol'], ['square', 'cuadrado', 'scuér'], ['triangle', 'triángulo', 'tráiangol'], ['rectangle', 'rectángulo', 'réctangol'], ['colour', 'color', 'cálor'], ['round', 'redondo', 'ráund'], ['side', 'lado', 'sáid']]
    },
    ing_body: {
      t: 'Mi cuerpo',
      i: ['Mi cabeza está en la parte de arriba de mi cuerpo.', 'Tengo dos brazos, dos manos y diez dedos.', 'Tengo dos piernas y dos pies.', 'Usamos «I have got» (tengo) para hablar de nuestro cuerpo.'],
      v: [['head', 'cabeza', 'jed'], ['arms', 'brazos', 'arms'], ['hands', 'manos', 'jands'], ['fingers', 'dedos', 'fínguers'], ['legs', 'piernas', 'legs'], ['feet', 'pies', 'fit'], ['body', 'cuerpo', 'bódi']]
    },
    ing_family: {
      t: 'Mi familia',
      i: ['Esta es mi madre. Este es mi padre.', 'Tengo un hermano y dos hermanas.', 'Usamos «his» (su, de él) para un chico y «her» (su, de ella) para una chica.'],
      v: [['mother', 'madre', 'máder'], ['father', 'padre', 'fáder'], ['brother', 'hermano', 'bráder'], ['sister', 'hermana', 'síster'], ['grandmother', 'abuela', 'granmáder'], ['grandfather', 'abuelo', 'granfáder'], ['aunt', 'tía', 'ant']]
    },
    ing_routine: {
      t: 'Las rutinas diarias',
      i: ['Usamos el presente simple para los hábitos: me levanto a las siete.', 'Con he, she e it añadimos -s: ella se levanta a las siete.', 'Los adverbios de frecuencia van antes del verbo principal: siempre voy andando al colegio.'],
      v: [['always', 'siempre', 'ólueis'], ['usually', 'normalmente', 'iúshuali'], ['sometimes', 'a veces', 'sámtaims'], ['never', 'nunca', 'néver'], ['get up', 'levantarse', 'guet ap'], ['have breakfast', 'desayunar', 'jav brékfast'], ['go to school', 'ir a la escuela', 'góu tu scul'], ['do homework', 'hacer la tarea', 'du jóumuerk'], ['go to bed', 'acostarse', 'góu tu bed']]
    },
    ing_rutina: {
      t: 'La rutina diaria',
      i: ['Usamos el presente simple para las rutinas: me levanto a las siete.', 'Con he, she e it el verbo lleva -s: ella se levanta.', 'Los adverbios de frecuencia van antes del verbo principal: siempre voy andando al colegio.', 'Verbos frecuentes: despertarse, desayunar, ir al colegio, hacer los deberes.'],
      v: [['present simple', 'presente simple', 'présent símpol'], ['always', 'siempre', 'ólueis'], ['usually', 'normalmente', 'iúshuali'], ['never', 'nunca', 'néver'], ['routine', 'rutina', 'rutín'], ['wake up', 'despertarse', 'uéik ap'], ['have breakfast', 'desayunar', 'jav brékfast']]
    },
    ing_pasado: {
      t: 'El pasado simple',
      i: ['Los verbos regulares añaden -ed en pasado: played (jugó), watched (miró).', 'Muchos verbos frecuentes son irregulares: go → went (ir → fue), eat → ate (comer → comió).', 'Las preguntas usan did: ¿Viste la película?', 'Las negaciones usan didn’t + el verbo base: no fui.'],
      v: [['past simple', 'pasado simple', 'past símpol'], ['regular', 'regular', 'réguiular'], ['irregular', 'irregular', 'irréguiular'], ['played', 'jugó / jugué', 'pléid'], ['went', 'fue / fui', 'uent'], ['ate', 'comió / comí', 'éit'], ['did', 'hizo (auxiliar del pasado)', 'did']]
    },
    ing_futuro: {
      t: 'Planes y predicciones',
      i: ['«Going to» es para los planes: voy a visitar a mi abuela.', '«Will» es para las predicciones y las decisiones rápidas: va a llover.', 'Expresiones de tiempo: mañana, la semana que viene, en 2030.', 'El presente continuo también habla de planes fijos: he quedado con Ana a las cinco.'],
      v: [['going to', 'ir a (plan)', 'góuing tu'], ['will', 'futuro (predicción)', 'uíl'], ['plan', 'plan', 'plan'], ['prediction', 'predicción', 'pridíkshon'], ['tomorrow', 'mañana', 'tumórou'], ['next week', 'la semana que viene', 'nekst uík']]
    },
    ing_compara: {
      t: 'Comparar cosas',
      i: ['Los adjetivos cortos añaden -er: más alto, más rápido.', 'Los adjetivos largos usan more: más caro.', 'Superlativos: el más alto, el más caro.', 'Formas irregulares: good → better → the best (bueno → mejor → el mejor); bad → worse → the worst (malo → peor → el peor).'],
      v: [['comparative', 'comparativo', 'compárativ'], ['superlative', 'superlativo', 'supérlativ'], ['than', 'que (al comparar)', 'dan'], ['taller', 'más alto', 'tóler'], ['better', 'mejor', 'béter'], ['the best', 'el mejor', 'de best'], ['worse', 'peor', 'uérs']]
    },
    ing_tenses: {
      t: 'El presente simple y el presente continuo',
      i: ['Presente simple: hábitos y hechos. Juego al fútbol los sábados.', 'Presente continuo: acciones que pasan ahora. Estoy jugando al fútbol ahora mismo.', 'Las palabras de tiempo ayudan a elegir: every day, usually → simple; now, at the moment → continuo.'],
      v: [['habit', 'hábito', 'jábit'], ['now', 'ahora', 'náu'], ['at the moment', 'en este momento', 'at de móument'], ['every day', 'todos los días', 'évri déi'], ['right now', 'ahora mismo', 'ráit náu']]
    },
    ing_travel: {
      t: 'Viajes e indicaciones',
      i: ['Usamos «turn left» (gira a la izquierda) y «turn right» (gira a la derecha) para dar indicaciones.', '«Go straight on» significa seguir andando en la misma dirección.', 'Un mapa muestra calles, plazas y lugares conocidos.', 'Preguntamos «How far is it?» (¿a qué distancia está?) para saber la distancia.'],
      v: [['turn left', 'gira a la izquierda', 'tern left'], ['turn right', 'gira a la derecha', 'tern ráit'], ['straight on', 'todo recto', 'stréit on'], ['map', 'mapa', 'map'], ['distance', 'distancia', 'dístans'], ['street', 'calle', 'strit'], ['square', 'plaza', 'scuér']]
    },
    ing_viaje: {
      t: 'De viaje',
      i: ['En el aeropuerto: facturación, tarjeta de embarque, puerta de embarque, equipaje.', 'Para preguntar el camino: Perdone, ¿dónde está la estación?', 'Indicaciones: gira a la izquierda, sigue todo recto, está al lado del banco.', 'Peticiones educadas: ¿Podría ayudarme, por favor?'],
      v: [['check-in', 'facturación', 'chek in'], ['boarding pass', 'tarjeta de embarque', 'bórding pas'], ['gate', 'puerta de embarque', 'guéit'], ['luggage', 'equipaje', 'lágich'], ['directions', 'indicaciones', 'dairékshons'], ['turn left', 'gira a la izquierda', 'tern left'], ['polite request', 'petición educada', 'poláit rikuést']]
    },
    ing_essay: {
      t: 'Escribir un texto de opinión',
      i: ['Empieza con una opinión clara en la introducción.', 'Da dos o tres razones, una por párrafo, con ejemplos.', 'Usa conectores: en primer lugar, además, sin embargo, en conclusión.', 'Termina repitiendo tu opinión con otras palabras.'],
      v: [['firstly', 'en primer lugar', 'férstli'], ['moreover', 'además', 'morróuver'], ['however', 'sin embargo', 'jauéver'], ['in conclusion', 'en conclusión', 'in conclúshon'], ['opinion', 'opinión', 'opínion'], ['reason', 'razón', 'rízon'], ['paragraph', 'párrafo', 'páragraf']]
    },
    ing_job: {
      t: 'Inglés para el trabajo: la entrevista',
      i: ['Prepara una respuesta corta a «Tell me about yourself» (háblame de ti).', 'Usa el pasado simple para hablar de tu experiencia: trabajé en una tienda dos años.', 'Haz una pregunta al final: demuestra interés.'],
      v: [['experience', 'experiencia', 'ekspíriens'], ['skills', 'habilidades', 'skils'], ['strengths', 'puntos fuertes', 'strengzs'], ['schedule', 'horario', 'skéchul'], ['salary', 'salario', 'sálari'], ['shift', 'turno', 'shift'], ['team', 'equipo', 'tim']]
    }
  };
})();
