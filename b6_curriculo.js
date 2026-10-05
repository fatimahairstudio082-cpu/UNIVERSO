/* b6_curriculo.js — banco curricular del Editorial escolar.
   Qué sabe: ocho países (marco oficial, nombres de etapas y cursos, papel,
   moneda, impuesto, ejemplos locales), seis niveles, trece materias y un
   banco de unidades con ideas, vocabulario, actividades y figura.
   El banco es la semilla: cada unidad declara en qué bandas de edad vale,
   y el motor la adapta al país (moneda, nombres, voseo, papel).
   Se registra en window.EU_CURRICULO. */
(function () {
  'use strict';
  if (window.EU_CURRICULO) return;

  /* ─────────── Bandas de edad ─────────── */
  var BANDAS = {
    inf: { n: 'Infantil', edad: '3–6 años' },
    pri1: { n: 'Primaria · primer ciclo', edad: '6–8 años' },
    pri2: { n: 'Primaria · segundo ciclo', edad: '8–10 años' },
    pri3: { n: 'Primaria · tercer ciclo', edad: '10–12 años' },
    sec: { n: 'Secundaria', edad: '12–16 años' },
    bach: { n: 'Bachillerato', edad: '16–18 años' },
    fp: { n: 'Formación técnica', edad: '16+ años' },
    adu: { n: 'Personas adultas', edad: '18+ años' }
  };

  var NIVELES = [
    { id: 'inf', ico: '🧸' }, { id: 'pri', ico: '✏️' }, { id: 'sec', ico: '📘' },
    { id: 'bach', ico: '🎓' }, { id: 'fp', ico: '🛠' }, { id: 'adu', ico: '🤝' }
  ];

  /* ─────────── Países ───────────
     niveles: nombre oficial de cada etapa; cursos: etiquetas y banda de cada curso. */
  function cursos(lista, banda) { return lista.map(function (c, i) { return { n: c, b: typeof banda === 'function' ? banda(i) : banda }; }); }
  function bandaPri(i) { return i < 2 ? 'pri1' : i < 4 ? 'pri2' : 'pri3'; }
  var ORD = ['1.º', '2.º', '3.º', '4.º', '5.º', '6.º'];
  var GRA = ['1.er grado', '2.º grado', '3.er grado', '4.º grado', '5.º grado', '6.º grado'];

  var PAISES = {
    es: {
      n: 'España', loc: 'es-ES', lang: 'es-ES', papel: 'a4', mon: 'EUR', vos: false, vosotros: true,
      marco: 'LOMLOE · Reales Decretos 95/2022 (Infantil), 157/2022 (Primaria), 217/2022 (ESO) y 243/2022 (Bachillerato)',
      marcoCorto: 'LOMLOE', autoridad: 'Ministerio de Educación, Formación Profesional y Deportes',
      evalua: 'competencias clave, competencias específicas, criterios de evaluación y saberes básicos',
      imp: { n: 'IVA', p: 21 },
      niveles: {
        inf: { n: 'Educación Infantil (2.º ciclo)', c: cursos(['3 años', '4 años', '5 años'], 'inf') },
        pri: { n: 'Educación Primaria', c: cursos(ORD.map(function (o) { return o + ' de Primaria'; }), bandaPri) },
        sec: { n: 'ESO', c: cursos(['1.º de ESO', '2.º de ESO', '3.º de ESO', '4.º de ESO'], 'sec') },
        bach: { n: 'Bachillerato', c: cursos(['1.º de Bachillerato', '2.º de Bachillerato'], 'bach') },
        fp: { n: 'Formación Profesional', c: cursos(['Grado Básico', 'Grado Medio', 'Grado Superior'], 'fp') },
        adu: { n: 'Educación de Personas Adultas', c: cursos(['Nivel I', 'Nivel II'], 'adu') }
      },
      nombres: ['Lucía', 'Hugo', 'Martina', 'Mateo', 'Carmen', 'Álvaro'],
      ciudades: ['Sevilla', 'Valencia', 'Zaragoza'], rio: 'Ebro', musica: 'el flamenco y la jota',
      fiesta: 'las Fallas de Valencia', comida: 'la tortilla de patatas',
      precios: [['una barra de pan', 1.2], ['un litro de leche', 1.1], ['un cuaderno', 2.5], ['una entrada de cine', 8]],
      historia: [['1492', 'Llegada de Colón a América'], ['1812', 'Constitución de Cádiz'], ['1931', 'Segunda República'], ['1978', 'Constitución democrática'], ['1986', 'Entrada en la Comunidad Europea']]
    },
    mx: {
      n: 'México', loc: 'es-MX', lang: 'es-MX', papel: 'carta', mon: 'MXN', vos: false,
      marco: 'SEP · Plan de Estudio 2022 de la Nueva Escuela Mexicana (campos formativos y ejes articuladores)',
      marcoCorto: 'NEM · Plan 2022', autoridad: 'Secretaría de Educación Pública',
      evalua: 'campos formativos, contenidos, procesos de desarrollo de aprendizaje y ejes articuladores',
      imp: { n: 'IVA', p: 16 },
      niveles: {
        inf: { n: 'Preescolar', c: cursos(['1.º de preescolar', '2.º de preescolar', '3.º de preescolar'], 'inf') },
        pri: { n: 'Primaria', c: cursos(GRA, bandaPri) },
        sec: { n: 'Secundaria', c: cursos(['1.º de secundaria', '2.º de secundaria', '3.º de secundaria'], 'sec') },
        bach: { n: 'Bachillerato / Preparatoria', c: cursos(['1.er año', '2.º año', '3.er año'], 'bach') },
        fp: { n: 'Bachillerato tecnológico / CONALEP', c: cursos(['Profesional técnico'], 'fp') },
        adu: { n: 'Educación para adultos (INEA)', c: cursos(['Nivel inicial', 'Nivel intermedio', 'Nivel avanzado'], 'adu') }
      },
      nombres: ['Ximena', 'Diego', 'Lupita', 'Santiago', 'Regina', 'Emiliano'],
      ciudades: ['Oaxaca', 'Monterrey', 'Guadalajara'], rio: 'Usumacinta', musica: 'el mariachi y el son jarocho',
      fiesta: 'el Día de Muertos', comida: 'los tamales',
      precios: [['un tamal', 18], ['una torta', 45], ['un cuaderno', 35], ['un litro de leche', 28]],
      historia: [['1325', 'Fundación de Tenochtitlan'], ['1810', 'Inicio de la Independencia'], ['1821', 'Consumación de la Independencia'], ['1910', 'Revolución mexicana'], ['1917', 'Constitución vigente']]
    },
    co: {
      n: 'Colombia', loc: 'es-CO', lang: 'es-CO', papel: 'carta', mon: 'COP', vos: false,
      marco: 'MEN · Estándares Básicos de Competencias, Derechos Básicos de Aprendizaje (DBA) y Lineamientos Curriculares',
      marcoCorto: 'EBC y DBA', autoridad: 'Ministerio de Educación Nacional',
      evalua: 'estándares básicos de competencias, DBA, evidencias de aprendizaje y desempeños',
      imp: { n: 'IVA', p: 19 },
      niveles: {
        inf: { n: 'Preescolar', c: cursos(['Prejardín', 'Jardín', 'Transición'], 'inf') },
        pri: { n: 'Básica primaria', c: cursos(['Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto'], function (i) { return i < 2 ? 'pri1' : i < 4 ? 'pri2' : 'pri3'; }) },
        sec: { n: 'Básica secundaria', c: cursos(['Sexto', 'Séptimo', 'Octavo', 'Noveno'], 'sec') },
        bach: { n: 'Educación media', c: cursos(['Décimo', 'Undécimo'], 'bach') },
        fp: { n: 'Formación técnica (SENA)', c: cursos(['Técnico', 'Tecnólogo'], 'fp') },
        adu: { n: 'Educación para jóvenes y adultos', c: cursos(['Ciclo I–II', 'Ciclo III–IV', 'Ciclo V–VI'], 'adu') }
      },
      nombres: ['Valentina', 'Samuel', 'Isabella', 'Juan José', 'Mariana', 'Santiago'],
      ciudades: ['Medellín', 'Barranquilla', 'Cali'], rio: 'Magdalena', musica: 'la cumbia y el vallenato',
      fiesta: 'el Carnaval de Barranquilla', comida: 'las arepas',
      precios: [['una arepa', 2500], ['una empanada', 2000], ['un cuaderno', 6000], ['un pasaje de bus', 3000]],
      historia: [['1810', 'Grito de Independencia (20 de julio)'], ['1819', 'Batalla de Boyacá'], ['1886', 'Constitución de la República'], ['1991', 'Constitución Política vigente'], ['2016', 'Acuerdo de paz']]
    },
    ar: {
      n: 'Argentina', loc: 'es-AR', lang: 'es-AR', papel: 'a4', mon: 'ARS', vos: true,
      marco: 'Consejo Federal de Educación · Núcleos de Aprendizaje Prioritarios (NAP) y diseños curriculares jurisdiccionales',
      marcoCorto: 'NAP', autoridad: 'Ministerio de Capital Humano · Secretaría de Educación',
      evalua: 'núcleos de aprendizaje prioritarios, contenidos, indicadores de logro y capacidades',
      imp: { n: 'IVA', p: 21 },
      niveles: {
        inf: { n: 'Nivel Inicial', c: cursos(['Sala de 3', 'Sala de 4', 'Sala de 5'], 'inf') },
        pri: { n: 'Nivel Primario', c: cursos(GRA, bandaPri) },
        sec: { n: 'Nivel Secundario (ciclo básico)', c: cursos(['1.er año', '2.º año', '3.er año'], 'sec') },
        bach: { n: 'Nivel Secundario (ciclo orientado)', c: cursos(['4.º año', '5.º año', '6.º año'], 'bach') },
        fp: { n: 'Educación Técnico Profesional', c: cursos(['Técnico de nivel medio', 'Formación profesional'], 'fp') },
        adu: { n: 'Educación Permanente de Jóvenes y Adultos', c: cursos(['Primaria de adultos', 'Secundaria de adultos'], 'adu') }
      },
      nombres: ['Sofía', 'Benjamín', 'Delfina', 'Thiago', 'Catalina', 'Bautista'],
      ciudades: ['Córdoba', 'Rosario', 'Mendoza'], rio: 'Paraná', musica: 'el tango y la chacarera',
      fiesta: 'el 25 de Mayo', comida: 'las empanadas',
      precios: [['una empanada', 1500], ['un alfajor', 1200], ['un cuaderno', 4000], ['un boleto de colectivo', 1000]],
      historia: [['1810', 'Revolución de Mayo'], ['1816', 'Declaración de la Independencia'], ['1853', 'Constitución Nacional'], ['1912', 'Ley Sáenz Peña'], ['1983', 'Recuperación de la democracia']]
    },
    cl: {
      n: 'Chile', loc: 'es-CL', lang: 'es-CL', papel: 'carta', mon: 'CLP', vos: false,
      marco: 'Mineduc · Bases Curriculares y Programas de Estudio por asignatura',
      marcoCorto: 'Bases Curriculares', autoridad: 'Ministerio de Educación',
      evalua: 'objetivos de aprendizaje (OA), indicadores de evaluación, habilidades y actitudes',
      imp: { n: 'IVA', p: 19 },
      niveles: {
        inf: { n: 'Educación Parvularia', c: cursos(['Nivel medio', 'Pre-kínder', 'Kínder'], 'inf') },
        pri: { n: 'Educación Básica', c: cursos(['1.º básico', '2.º básico', '3.º básico', '4.º básico', '5.º básico', '6.º básico'], bandaPri) },
        sec: { n: 'Básica (7.º–8.º) y Media (I–II)', c: cursos(['7.º básico', '8.º básico', 'I medio', 'II medio'], 'sec') },
        bach: { n: 'Educación Media (III–IV)', c: cursos(['III medio', 'IV medio'], 'bach') },
        fp: { n: 'Educación Media Técnico-Profesional', c: cursos(['Especialidad TP'], 'fp') },
        adu: { n: 'Educación de Personas Jóvenes y Adultas (EPJA)', c: cursos(['Básica EPJA', 'Media EPJA'], 'adu') }
      },
      nombres: ['Josefa', 'Agustín', 'Florencia', 'Vicente', 'Trinidad', 'Maximiliano'],
      ciudades: ['Valparaíso', 'Concepción', 'Temuco'], rio: 'Biobío', musica: 'la cueca',
      fiesta: 'las Fiestas Patrias del 18 de septiembre', comida: 'las empanadas de pino',
      precios: [['una sopaipilla', 500], ['un completo', 2500], ['un cuaderno', 2000], ['un pasaje de micro', 800]],
      historia: [['1810', 'Primera Junta Nacional de Gobierno'], ['1818', 'Declaración de la Independencia'], ['1925', 'Constitución de 1925'], ['1990', 'Retorno a la democracia'], ['2010', 'Bicentenario']]
    },
    ve: {
      n: 'Venezuela', loc: 'es-VE', lang: 'es-VE', papel: 'carta', mon: 'VES', vos: false,
      marco: 'MPPE · Currículo del Sistema Educativo Bolivariano y áreas de formación',
      marcoCorto: 'Currículo Bolivariano', autoridad: 'Ministerio del Poder Popular para la Educación',
      evalua: 'áreas de formación, referentes teórico-prácticos, temas generadores e indicadores',
      imp: { n: 'IVA', p: 16 },
      niveles: {
        inf: { n: 'Educación Inicial', c: cursos(['Maternal', 'Preescolar (1.er nivel)', 'Preescolar (3.er nivel)'], 'inf') },
        pri: { n: 'Educación Primaria', c: cursos(GRA, bandaPri) },
        sec: { n: 'Educación Media General', c: cursos(['1.er año', '2.º año', '3.er año'], 'sec') },
        bach: { n: 'Educación Media General (4.º–5.º)', c: cursos(['4.º año', '5.º año'], 'bach') },
        fp: { n: 'Educación Media Técnica', c: cursos(['Mención técnica'], 'fp') },
        adu: { n: 'Educación de Jóvenes, Adultas y Adultos', c: cursos(['Nivel primaria', 'Nivel media'], 'adu') }
      },
      nombres: ['Andreína', 'Luis', 'Génesis', 'José Gregorio', 'Daniela', 'Sebastián'],
      ciudades: ['Maracaibo', 'Mérida', 'Barquisimeto'], rio: 'Orinoco', musica: 'el joropo',
      fiesta: 'el 5 de Julio, Día de la Independencia', comida: 'las arepas',
      precios: [['una arepa', 120], ['una empanada', 80], ['un cuaderno', 300], ['un pasaje', 50]],
      historia: [['1810', '19 de abril: Junta Suprema de Caracas'], ['1811', 'Declaración de la Independencia'], ['1821', 'Batalla de Carabobo'], ['1830', 'Separación de la Gran Colombia'], ['1999', 'Constitución vigente']]
    },
    do: {
      n: 'República Dominicana', loc: 'es-DO', lang: 'es-DO', papel: 'carta', mon: 'DOP', vos: false,
      marco: 'MINERD · Diseño Curricular por competencias (competencias fundamentales y específicas)',
      marcoCorto: 'Diseño Curricular MINERD', autoridad: 'Ministerio de Educación de la República Dominicana',
      evalua: 'competencias fundamentales, competencias específicas, contenidos e indicadores de logro',
      imp: { n: 'ITBIS', p: 18 },
      niveles: {
        inf: { n: 'Nivel Inicial', c: cursos(['Pre-kínder', 'Kínder', 'Preprimario'], 'inf') },
        pri: { n: 'Nivel Primario', c: cursos(ORD.map(function (o) { return o + ' de Primaria'; }), bandaPri) },
        sec: { n: 'Nivel Secundario (primer ciclo)', c: cursos(['1.º de Secundaria', '2.º de Secundaria', '3.º de Secundaria'], 'sec') },
        bach: { n: 'Nivel Secundario (segundo ciclo)', c: cursos(['4.º de Secundaria', '5.º de Secundaria', '6.º de Secundaria'], 'bach') },
        fp: { n: 'Modalidad Técnico Profesional', c: cursos(['Bachiller técnico'], 'fp') },
        adu: { n: 'Educación de Personas Jóvenes y Adultas', c: cursos(['Básica', 'Prepara'], 'adu') }
      },
      nombres: ['Yarelis', 'Jean Carlos', 'Nicole', 'Miguel Ángel', 'Esmeralda', 'Enmanuel'],
      ciudades: ['Santiago de los Caballeros', 'La Romana', 'Puerto Plata'], rio: 'Yaque del Norte', musica: 'el merengue y la bachata',
      fiesta: 'el Carnaval dominicano de febrero', comida: 'el mangú',
      precios: [['una empanada', 50], ['un plato del día', 250], ['un cuaderno', 100], ['un pasaje en concho', 50]],
      historia: [['1492', 'Llegada de Colón a La Española'], ['1821', 'Independencia efímera'], ['1844', 'Independencia nacional (27 de febrero)'], ['1863', 'Guerra de la Restauración'], ['1965', 'Revolución de Abril']]
    },
    us: {
      n: 'EE. UU. (en español)', loc: 'es-US', lang: 'es-US', papel: 'carta', mon: 'USD', vos: false,
      marco: 'Estándares estatales · Common Core State Standards y programas bilingües / de doble inmersión',
      marcoCorto: 'Common Core / estándares estatales', autoridad: 'Departamento de Educación estatal',
      evalua: 'estándares por grado, objetivos de aprendizaje y metas de dominio lingüístico',
      imp: { n: 'impuesto sobre las ventas', p: 7, nota: 'El porcentaje cambia según el estado; aquí se usa un 7 % de ejemplo.' },
      niveles: {
        inf: { n: 'Pre-K y Kínder', c: cursos(['Pre-K', 'Kínder'], 'inf') },
        pri: { n: 'Escuela elemental', c: cursos(GRA.slice(0, 5), function (i) { return i < 2 ? 'pri1' : i < 4 ? 'pri2' : 'pri3'; }) },
        sec: { n: 'Escuela intermedia', c: cursos(['6.º grado', '7.º grado', '8.º grado'], 'sec') },
        bach: { n: 'High School', c: cursos(['9.º grado', '10.º grado', '11.º grado', '12.º grado'], 'bach') },
        fp: { n: 'Educación técnica y profesional (CTE)', c: cursos(['Programa CTE'], 'fp') },
        adu: { n: 'Educación para adultos (ESL / GED)', c: cursos(['ESL', 'Preparación GED'], 'adu') }
      },
      nombres: ['Emily', 'Daniel', 'Camila', 'Ethan', 'Sofía', 'Mateo'],
      ciudades: ['Los Ángeles', 'Miami', 'San Antonio'], rio: 'Misisipi', musica: 'el jazz, el blues y la música tejana',
      fiesta: 'el 4 de Julio', comida: 'los tacos',
      precios: [['un taco', 3.5], ['un cuaderno', 2], ['un boleto de autobús', 2.5], ['un galón de leche', 4.2]],
      historia: [['1776', 'Declaración de Independencia'], ['1787', 'Constitución'], ['1865', 'Abolición de la esclavitud'], ['1964', 'Ley de Derechos Civiles'], ['1969', 'Llegada a la Luna']]
    }
  };

  /* ─────────── Materias ─────────── */
  var MATERIAS = [
    { id: 'lengua', n: 'Lengua y literatura', ico: '📖', al: { es: 'Lengua Castellana y Literatura', mx: 'Lenguajes · Español', co: 'Lengua Castellana', ar: 'Prácticas del Lenguaje', cl: 'Lenguaje y Comunicación', ve: 'Lengua y Literatura', do: 'Lengua Española', us: 'Artes del Lenguaje en Español' } },
    { id: 'mate', n: 'Matemáticas', ico: '➗', al: { ar: 'Matemática', cl: 'Matemática', mx: 'Saberes y Pensamiento Científico · Matemáticas' } },
    { id: 'conta', n: 'Contabilidad', ico: '📒', al: {} },
    { id: 'natu', n: 'Ciencias naturales', ico: '🌱', al: { mx: 'Saberes y Pensamiento Científico', cl: 'Ciencias Naturales', ar: 'Ciencias Naturales', es: 'Ciencias de la Naturaleza' } },
    { id: 'soci', n: 'Ciencias sociales e historia', ico: '🌎', al: { mx: 'Ética, Naturaleza y Sociedades', cl: 'Historia, Geografía y Ciencias Sociales', es: 'Ciencias Sociales / Geografía e Historia' } },
    { id: 'ingles', n: 'Inglés', ico: '🗣', al: { es: 'Lengua Extranjera: Inglés', us: 'Inglés (ESL)' } },
    { id: 'arte', n: 'Artística y dibujo técnico', ico: '🎨', al: { es: 'Educación Plástica, Visual y Audiovisual', cl: 'Artes Visuales', co: 'Educación Artística' } },
    { id: 'musica', n: 'Música', ico: '🎵', al: {} },
    { id: 'efisica', n: 'Educación física', ico: '⚽', al: { mx: 'De lo Humano y lo Comunitario · Educación Física', cl: 'Educación Física y Salud' } },
    { id: 'tecno', n: 'Tecnología e informática', ico: '💻', al: { es: 'Tecnología y Digitalización', co: 'Tecnología e Informática' } },
    { id: 'valores', n: 'Valores y ética', ico: '🤲', al: { es: 'Educación en Valores Cívicos y Éticos', co: 'Ética y Valores Humanos', mx: 'Formación Cívica y Ética', do: 'Formación Integral Humana y Religiosa' } },
    { id: 'religion', n: 'Religión y cultura religiosa', ico: '🕊', al: { co: 'Educación Religiosa', do: 'Formación Integral Humana y Religiosa' } },
    { id: 'pelu', n: 'Peluquería y estética', ico: '💇', al: { es: 'Peluquería y Cosmética Capilar (FP)' } }
  ];

  /* ─────────── Banco de unidades ───────────
     b: bandas donde vale · i: ideas (una frase cada una) · k: vocabulario
     vf: afirmaciones [texto, verdadera] · q: preguntas abiertas
     f: figura {t, …} · g: generador de ejercicios · h: lo que dice el guía */
  var U = [];
  function u(m, id, b, t, o) { o.m = m; o.id = id; o.b = b.split(' '); o.t = t; U.push(o); }

  /* Lengua */
  u('lengua', 'len_nombre', 'inf', 'Los sonidos de mi nombre', {
    i: ['Cada nombre está hecho de sonidos.', 'Si damos una palmada por cada trozo, contamos las sílabas.', 'La primera letra de tu nombre se escribe con mayúscula.'],
    k: ['sonido', 'letra', 'palmada', 'mayúscula'], g: 'len_silabas',
    q: ['¿Con qué letra empieza tu nombre?', '¿Cuántas palmadas tiene el nombre de tu mejor amigo o amiga?'],
    h: 'Di tu nombre despacito y da una palmada en cada trozo.'
  });
  u('lengua', 'len_silabas', 'pri1', 'Las sílabas', {
    i: ['Una sílaba es cada golpe de voz de una palabra.', 'Hay palabras de una, dos, tres o más sílabas.', 'Cada sílaba lleva siempre al menos una vocal.', 'La sílaba que suena más fuerte es la sílaba tónica.'],
    k: ['sílaba', 'vocal', 'consonante', 'sílaba tónica'], g: 'len_silabas',
    vf: [['Todas las sílabas llevan una vocal.', true], ['«Sol» tiene dos sílabas.', false], ['«Mariposa» tiene cuatro sílabas.', true]],
    f: { t: 'mapa', c: 'Palabras', r: ['monosílabas', 'bisílabas', 'trisílabas', 'polisílabas'] },
    h: 'Aplaude cada palabra: tus manos saben contar sílabas.'
  });
  u('lengua', 'len_sust', 'pri2', 'El sustantivo y el adjetivo', {
    i: ['El sustantivo nombra personas, animales, cosas, lugares o ideas.', 'Los sustantivos propios se escriben con mayúscula: {ciudad}, {nombre}.', 'El adjetivo dice cómo es el sustantivo.', 'Sustantivo y adjetivo concuerdan en género y número.'],
    k: ['sustantivo', 'adjetivo', 'nombre propio', 'concordancia'],
    vf: [['«{ciudad}» es un sustantivo propio.', true], ['«Alegre» es un sustantivo.', false], ['En «casas blancas» hay concordancia.', true]],
    q: ['Escribe tres sustantivos de tu salón de clase y un adjetivo para cada uno.', 'Describe {comida} con cuatro adjetivos.'],
    f: { t: 'mapa', c: 'Sustantivo', r: ['común', 'propio', 'concreto', 'abstracto'] }
  });
  u('lengua', 'len_narra', 'pri3', 'El texto narrativo', {
    i: ['Una narración cuenta hechos que les pasan a unos personajes en un lugar y un tiempo.', 'Tiene tres partes: planteamiento, nudo y desenlace.', 'El narrador puede contar desde dentro (primera persona) o desde fuera (tercera persona).', 'Los conectores como «de repente» o «al final» ordenan la historia.'],
    k: ['narrador', 'personaje', 'planteamiento', 'nudo', 'desenlace'],
    vf: [['El nudo es la parte donde aparece el problema.', true], ['Un narrador en tercera persona dice «yo».', false]],
    q: ['Cuenta en cinco líneas algo que te pasó durante {fiesta}.', '¿Qué conectores usaste para ordenar tu historia?'],
    f: { t: 'linea', h: [['1', 'Planteamiento'], ['2', 'Nudo'], ['3', 'Desenlace']] }
  });
  u('lengua', 'len_oracion', 'sec', 'La oración: sujeto y predicado', {
    i: ['La oración es la unidad mínima con sentido completo.', 'El sujeto concuerda en número y persona con el verbo.', 'El predicado es lo que se dice del sujeto y tiene el verbo como núcleo.', 'Para encontrar el sujeto, cambia el número del verbo y mira qué palabra cambia con él.'],
    k: ['sujeto', 'predicado', 'núcleo', 'concordancia', 'complemento'], g: 'len_sujeto',
    vf: [['El núcleo del predicado es siempre un verbo.', true], ['Toda oración tiene el sujeto escrito.', false]],
    q: ['Escribe una oración con sujeto omitido y explica cómo lo sabes.']
  });
  u('lengua', 'len_comentario', 'bach', 'El comentario de texto', {
    i: ['Comentar un texto es explicar qué dice, cómo lo dice y por qué lo dice así.', 'Se empieza por el tema en una sola frase y la estructura en partes.', 'Después se analizan los recursos de la lengua que sostienen la intención del autor.', 'La valoración final es personal pero argumentada.'],
    k: ['tema', 'estructura', 'tesis', 'argumento', 'intención comunicativa'],
    q: ['Resume en una frase el tema de un artículo de opinión reciente de tu país.', '¿Qué diferencia hay entre resumen y tema?'],
    f: { t: 'flujo', p: ['Leer dos veces', 'Tema', 'Estructura', 'Recursos', 'Valoración'] }
  });
  u('lengua', 'len_correo', 'fp adu', 'Comunicación en el trabajo: el correo formal', {
    i: ['Un correo formal tiene asunto claro, saludo, cuerpo breve, despedida y firma.', 'El asunto dice en pocas palabras para qué escribes.', 'Un párrafo por idea hace que se lea en un minuto.', 'Antes de enviar se revisan destinatario, adjuntos y ortografía.'],
    k: ['asunto', 'destinatario', 'adjunto', 'firma', 'registro formal'],
    q: ['Redacta un correo para pedir un día libre por un trámite personal.', 'Corrige este asunto: «hola, una cosa».'],
    f: { t: 'flujo', p: ['Asunto', 'Saludo', 'Cuerpo', 'Despedida', 'Firma'] }
  });

  /* Matemáticas */
  u('mate', 'mat_contar', 'inf', 'Contar hasta diez', {
    i: ['Contamos señalando cada cosa una sola vez.', 'El último número que decimos es cuántas cosas hay.', 'Diez es lo mismo que los dedos de las dos manos.'],
    k: ['uno', 'cinco', 'diez', 'contar'], g: 'mat_conteo', h: 'Toca cada bolita con el dedo mientras cuentas en voz alta.'
  });
  u('mate', 'mat_suma', 'pri1', 'Sumar y restar', {
    i: ['Sumar es juntar cantidades.', 'Restar es quitar o buscar cuánto falta.', 'En una suma el orden no cambia el resultado.', 'Podemos comprobar una resta con una suma.'],
    k: ['sumando', 'resta', 'diferencia', 'total'], g: 'mat_suma',
    vf: [['3 + 5 es lo mismo que 5 + 3.', true], ['7 − 2 es lo mismo que 2 − 7.', false]],
    f: { t: 'recta', a: 0, z: 20 }
  });
  u('mate', 'mat_multi', 'pri2', 'La multiplicación', {
    i: ['Multiplicar es sumar varias veces el mismo número.', '4 × 3 se lee «cuatro por tres» y es 3 + 3 + 3 + 3.', 'Las tablas se aprenden mejor en voz alta y con patrones: la del 5 termina en 0 o 5.', 'Con la multiplicación resolvemos compras de varias cosas iguales.'],
    k: ['factor', 'producto', 'tabla', 'doble'], g: 'mat_multi',
    vf: [['Todos los resultados de la tabla del 2 son pares.', true], ['6 × 0 = 6', false]]
  });
  u('mate', 'mat_frac', 'pri3', 'Las fracciones', {
    i: ['Una fracción indica partes iguales de un todo.', 'El denominador dice en cuántas partes se divide; el numerador, cuántas se toman.', 'Fracciones equivalentes representan la misma cantidad: 1/2 = 2/4.', 'Para sumar fracciones con el mismo denominador se suman los numeradores.'],
    k: ['numerador', 'denominador', 'equivalente', 'fracción propia'], g: 'mat_frac',
    vf: [['En 3/4, el denominador es 4.', true], ['1/3 es mayor que 1/2.', false]],
    f: { t: 'fraccion', n: 3, d: 8 }
  });
  u('mate', 'mat_ecua', 'sec', 'Ecuaciones de primer grado', {
    i: ['Una ecuación es una igualdad con una incógnita.', 'Lo que se hace a un lado de la igualdad se hace también al otro.', 'Se agrupan las x en un lado y los números en el otro.', 'Siempre se comprueba sustituyendo la solución.'],
    k: ['incógnita', 'miembro', 'término', 'solución'], g: 'mat_ecua',
    vf: [['x = 4 es solución de 2x + 1 = 9.', true], ['En 3x = 12, x vale 36.', false]],
    f: { t: 'balanza' }
  });
  u('mate', 'mat_func', 'sec bach', 'Funciones lineales', {
    i: ['Una función lineal relaciona dos magnitudes con la fórmula y = m·x + b.', 'La pendiente m dice cuánto sube y por cada unidad de x.', 'La ordenada b es el punto donde la recta corta al eje vertical.', 'Una tarifa de taxi con bajada de bandera es una función lineal.'],
    k: ['pendiente', 'ordenada en el origen', 'eje', 'recta'], g: 'mat_func',
    f: { t: 'plano', m: 2, b: 1 }
  });
  u('mate', 'mat_deriv', 'bach', 'Derivadas', {
    i: ['La derivada mide la rapidez con que cambia una función.', 'La derivada de xⁿ es n·xⁿ⁻¹.', 'La derivada de una constante es cero.', 'Donde la derivada vale cero puede haber un máximo o un mínimo.'],
    k: ['tasa de variación', 'pendiente de la tangente', 'máximo', 'mínimo'], g: 'mat_deriv'
  });
  u('mate', 'mat_porc', 'fp adu sec', 'Porcentajes e impuestos', {
    i: ['Un porcentaje es una fracción de denominador 100.', 'Para calcular el 15 % de una cantidad se multiplica por 0,15.', 'El {imp} de tu país es del {impP} %: se suma al precio sin impuesto.', 'Un descuento se resta; un impuesto se suma.'],
    k: ['porcentaje', 'descuento', 'base imponible', '{imp}'], g: 'mat_porc'
  });
  u('mate', 'mat_presu', 'adu fp', 'El presupuesto de casa', {
    i: ['Un presupuesto compara lo que entra con lo que sale cada mes.', 'Los gastos fijos se repiten; los variables cambian.', 'Apartar un porcentaje fijo para ahorro antes de gastar funciona mejor que ahorrar lo que sobra.'],
    k: ['ingreso', 'gasto fijo', 'gasto variable', 'ahorro'], g: 'mat_presu',
    f: { t: 'mapa', c: 'Mes', r: ['ingresos', 'gastos fijos', 'gastos variables', 'ahorro'] }
  });

  /* Contabilidad */
  u('conta', 'con_ecuacion', 'sec bach fp adu', 'La ecuación contable', {
    i: ['Todo lo que tiene una empresa (activo) lo financian sus deudas (pasivo) o sus dueños (patrimonio).', 'La ecuación es: Activo = Pasivo + Patrimonio.', 'Cada operación modifica al menos dos cuentas y la igualdad nunca se rompe.'],
    k: ['activo', 'pasivo', 'patrimonio', 'partida doble'],
    vf: [['Un préstamo bancario es un pasivo.', true], ['La mercadería en el almacén es patrimonio.', false]],
    f: { t: 'ecuacion' }, h: 'Si un lado sube, el otro también: así sabrás si te equivocaste.'
  });
  u('conta', 'con_cuentat', 'sec bach fp adu', 'Las cuentas y la cuenta T', {
    i: ['Una cuenta registra los aumentos y disminuciones de un mismo elemento.', 'La izquierda se llama debe y la derecha haber.', 'Las cuentas de activo aumentan por el debe; las de pasivo y patrimonio, por el haber.', 'El saldo es la diferencia entre la suma del debe y la del haber.'],
    k: ['debe', 'haber', 'saldo', 'cargo', 'abono'], g: 'con_cuentat',
    f: { t: 'cuentaT', c: 'Caja', d: [5000, 1200], h: [800] }
  });
  u('conta', 'con_diario', 'bach fp adu', 'El libro diario', {
    i: ['El libro diario anota cada operación en orden de fecha: es un asiento.', 'Cada asiento tiene fecha, cuentas, importes al debe y al haber, y una explicación breve.', 'La suma del debe siempre es igual a la del haber.'],
    k: ['asiento', 'libro diario', 'libro mayor', 'glosa'], g: 'con_asiento'
  });
  u('conta', 'con_impuesto', 'bach fp adu', 'El {imp} en compras y ventas', {
    i: ['Cuando compras, pagas {imp} que luego puedes descontar: es crédito fiscal.', 'Cuando vendes, cobras {imp} que debes entregar a Hacienda: es débito fiscal.', 'Cada periodo se liquida la diferencia entre lo cobrado y lo pagado.', 'En tu país el tipo general es del {impP} %.'],
    k: ['{imp}', 'crédito fiscal', 'débito fiscal', 'liquidación'], g: 'con_impuesto'
  });
  u('conta', 'con_balance', 'bach fp', 'El balance general', {
    i: ['El balance es una foto de la empresa en una fecha concreta.', 'A un lado va el activo, ordenado de menos a más líquido o al revés según la norma del país.', 'Al otro lado van el pasivo y el patrimonio.', 'Los dos totales deben coincidir.'],
    k: ['balance', 'activo corriente', 'pasivo corriente', 'liquidez'],
    f: { t: 'mapa', c: 'Balance', r: ['activo corriente', 'activo no corriente', 'pasivo', 'patrimonio'] }
  });
  u('conta', 'con_negocio', 'adu fp', 'Las cuentas de un pequeño negocio', {
    i: ['Separar el dinero del negocio del dinero de casa es la primera regla.', 'Un cuaderno de caja diario con entradas y salidas basta para empezar.', 'El margen es lo que queda de cada venta después de pagar lo que cuesta.'],
    k: ['caja', 'margen', 'costo', 'precio de venta'], g: 'con_margen'
  });

  /* Ciencias naturales */
  u('natu', 'nat_sentidos', 'inf pri1', 'Mi cuerpo y los cinco sentidos', {
    i: ['Con los ojos vemos, con los oídos oímos y con la nariz olemos.', 'Con la lengua saboreamos y con la piel sentimos si algo está frío o caliente.', 'Cuidar el cuerpo es comer bien, moverse y descansar.'],
    k: ['vista', 'oído', 'olfato', 'gusto', 'tacto'],
    f: { t: 'mapa', c: 'Sentidos', r: ['vista', 'oído', 'olfato', 'gusto', 'tacto'] }, g: 'gen_relaciona'
  });
  u('natu', 'nat_seres', 'pri1 pri2', 'Los seres vivos', {
    i: ['Los seres vivos nacen, se alimentan, crecen, se reproducen y mueren.', 'Las plantas fabrican su alimento con la luz del sol.', 'Los animales se alimentan de plantas o de otros animales.'],
    k: ['nacer', 'crecer', 'reproducirse', 'planta', 'animal'],
    vf: [['Una piedra es un ser vivo.', false], ['Las plantas necesitan luz.', true]],
    f: { t: 'ciclo', p: ['Nace', 'Crece', 'Se reproduce', 'Muere'] }
  });
  u('natu', 'nat_agua', 'pri2 pri3', 'El ciclo del agua', {
    i: ['El sol calienta el agua de mares y ríos, como el {rio}, y se evapora.', 'El vapor sube, se enfría y forma nubes: es la condensación.', 'El agua cae como lluvia, nieve o granizo: es la precipitación.', 'El agua corre por la tierra y vuelve al mar.'],
    k: ['evaporación', 'condensación', 'precipitación', 'escorrentía'],
    vf: [['Las nubes se forman cuando el vapor se enfría.', true], ['El agua del planeta se gasta y desaparece.', false]],
    f: { t: 'ciclo', p: ['Evaporación', 'Condensación', 'Precipitación', 'Escorrentía'] }
  });
  u('natu', 'nat_eco', 'pri3 sec', 'Los ecosistemas y las cadenas tróficas', {
    i: ['Un ecosistema es un lugar con sus seres vivos y las condiciones que los rodean.', 'Los productores fabrican su alimento; los consumidores se alimentan de otros.', 'Los descomponedores devuelven la materia al suelo.', 'Si desaparece un eslabón, toda la cadena cambia.'],
    k: ['productor', 'consumidor', 'descomponedor', 'hábitat'],
    f: { t: 'flujo', p: ['Sol', 'Planta', 'Herbívoro', 'Carnívoro', 'Descomponedor'] }
  });
  u('natu', 'nat_celula', 'sec', 'La célula', {
    i: ['La célula es la unidad más pequeña de vida.', 'Todas tienen membrana, citoplasma y material genético.', 'Las células vegetales tienen pared celular y cloroplastos.', 'Las procariotas no tienen núcleo; las eucariotas sí.'],
    k: ['membrana', 'citoplasma', 'núcleo', 'cloroplasto', 'mitocondria'],
    vf: [['Las bacterias son procariotas.', true], ['Las células animales tienen pared celular.', false]],
    f: { t: 'mapa', c: 'Célula', r: ['membrana', 'citoplasma', 'núcleo', 'mitocondria'] }
  });
  u('natu', 'nat_gen', 'bach', 'Genética mendeliana', {
    i: ['Cada carácter depende de un par de alelos, uno de cada progenitor.', 'Un alelo dominante se expresa aunque solo haya una copia.', 'El cuadro de Punnett predice las proporciones de la descendencia.'],
    k: ['alelo', 'dominante', 'recesivo', 'genotipo', 'fenotipo'], g: 'nat_punnett'
  });
  u('natu', 'nat_higiene', 'fp adu', 'Seguridad e higiene en el trabajo', {
    i: ['Prevenir es identificar el riesgo antes del accidente.', 'Los equipos de protección individual solo sirven si se usan bien y siempre.', 'Toda sustancia química tiene su ficha de seguridad: leerla es obligatorio.'],
    k: ['riesgo', 'EPI', 'ficha de seguridad', 'prevención'],
    f: { t: 'flujo', p: ['Identificar', 'Evaluar', 'Prevenir', 'Revisar'] }
  });

  /* Sociales */
  u('soci', 'soc_familia', 'inf pri1', 'Mi familia y mi casa', {
    i: ['Hay familias de muchas formas, y todas se cuidan.', 'En casa cada persona ayuda en algo.', 'Mi casa está en una calle, en un barrio y en una ciudad.'],
    k: ['familia', 'casa', 'barrio', 'ayudar'],
    q: ['Dibuja a las personas con las que vives.', '¿Cómo ayudas tú en casa?']
  });
  u('soci', 'soc_comunidad', 'pri1 pri2', 'Mi comunidad', {
    i: ['Una comunidad es un grupo de personas que viven cerca y comparten servicios.', 'En {ciudad} hay escuelas, mercados, centros de salud y parques.', 'Las normas de convivencia nos ayudan a vivir juntos.'],
    k: ['comunidad', 'servicio', 'norma', 'vecino'],
    q: ['¿Qué servicios hay cerca de tu escuela?', 'Escribe una norma para tu salón de clase.']
  });
  u('soci', 'soc_paisaje', 'pri2 pri3', 'Los paisajes de {pais}', {
    i: ['El paisaje es cómo se ve un lugar: su relieve, su agua, su clima y lo que hacen las personas.', 'El río {rio} es uno de los grandes ríos de la región.', 'Hay paisajes naturales y paisajes transformados por las personas.'],
    k: ['relieve', 'clima', 'río', 'paisaje natural', 'paisaje urbano'],
    f: { t: 'mapa', c: 'Paisaje', r: ['relieve', 'agua', 'clima', 'vegetación', 'actividad humana'] }
  });
  u('soci', 'soc_historia', 'pri3 sec', 'Momentos de la historia de {pais}', {
    i: ['La historia se ordena en el tiempo con una línea de tiempo.', 'Cada fecha importante cambió la vida de las personas.', 'Conocer el pasado nos ayuda a entender el presente.'],
    k: ['siglo', 'época', 'independencia', 'constitución'],
    f: { t: 'historia' }, g: 'soc_fechas'
  });
  u('soci', 'soc_revol', 'sec bach', 'Las revoluciones liberales', {
    i: ['Entre 1776 y 1850 se extendieron las ideas de libertad, igualdad y soberanía nacional.', 'La independencia de Estados Unidos y la Revolución francesa fueron modelos para América y Europa.', 'Las constituciones escritas limitaron el poder de los reyes.'],
    k: ['soberanía', 'constitución', 'Ilustración', 'ciudadanía'],
    f: { t: 'linea', h: [['1776', 'Independencia de EE. UU.'], ['1789', 'Revolución francesa'], ['1810', 'Juntas en América'], ['1824', 'Batalla de Ayacucho']] }
  });
  u('soci', 'soc_global', 'bach adu', 'Globalización y mundo actual', {
    i: ['La globalización conecta economías, culturas y comunicaciones de todo el planeta.', 'Trae oportunidades de comercio y conocimiento, y también desigualdades.', 'Los retos comunes, como el clima o las migraciones, necesitan acuerdos entre países.'],
    k: ['globalización', 'migración', 'desarrollo sostenible', 'interdependencia']
  });
  u('soci', 'soc_laboral', 'fp adu', 'Derechos y deberes laborales', {
    i: ['El contrato de trabajo recoge funciones, horario, salario y duración.', 'Toda persona trabajadora tiene derecho a descanso, vacaciones y seguridad social.', 'La nómina o recibo de sueldo explica lo que se cobra y lo que se descuenta.'],
    k: ['contrato', 'salario', 'jornada', 'seguridad social', 'nómina']
  });

  /* Inglés */
  u('ingles', 'ing_colours', 'inf pri1', 'Colours and numbers', {
    i: ['Red, blue and yellow are colours.', 'We count: one, two, three, four, five.', 'We say «It is red» to name a colour.'],
    k: ['red', 'blue', 'yellow', 'green', 'one', 'two'], g: 'ing_vocab',
    par: [['red', 'rojo'], ['blue', 'azul'], ['yellow', 'amarillo'], ['green', 'verde'], ['one', 'uno'], ['three', 'tres']]
  });
  u('ingles', 'ing_family', 'pri2 pri3', 'My family', {
    i: ['This is my mother. This is my father.', 'I have got one brother and two sisters.', 'We use «his» for a boy and «her» for a girl.'],
    k: ['mother', 'father', 'brother', 'sister', 'grandmother'], g: 'ing_vocab',
    par: [['mother', 'madre'], ['father', 'padre'], ['brother', 'hermano'], ['sister', 'hermana'], ['grandfather', 'abuelo'], ['aunt', 'tía']]
  });
  u('ingles', 'ing_routine', 'pri3 sec', 'Daily routines', {
    i: ['We use the present simple for habits: I get up at seven.', 'With he, she and it we add -s: She gets up at seven.', 'Adverbs of frequency go before the main verb: I always walk to school.'],
    k: ['always', 'usually', 'sometimes', 'never', 'get up'], g: 'ing_vocab',
    par: [['get up', 'levantarse'], ['have breakfast', 'desayunar'], ['go to school', 'ir a la escuela'], ['do homework', 'hacer la tarea'], ['go to bed', 'acostarse']]
  });
  u('ingles', 'ing_tenses', 'sec', 'Present simple and present continuous', {
    i: ['Present simple: habits and facts. I play football on Saturdays.', 'Present continuous: actions happening now. I am playing football right now.', 'Time words help you choose: every day, usually → simple; now, at the moment → continuous.'],
    k: ['habit', 'now', 'at the moment', 'every day'], g: 'ing_tiempos'
  });
  u('ingles', 'ing_essay', 'bach', 'Writing an opinion essay', {
    i: ['Start with a clear opinion in the introduction.', 'Give two or three reasons, one per paragraph, with examples.', 'Use linkers: firstly, moreover, however, in conclusion.', 'End by restating your opinion in new words.'],
    k: ['firstly', 'moreover', 'however', 'in conclusion'],
    f: { t: 'flujo', p: ['Introduction', 'Reason 1', 'Reason 2', 'Counter-argument', 'Conclusion'] }
  });
  u('ingles', 'ing_job', 'fp adu', 'English for work: the job interview', {
    i: ['Prepare a short answer to «Tell me about yourself».', 'Use the past simple to talk about your experience: I worked in a shop for two years.', 'Ask a question at the end: it shows interest.'],
    k: ['experience', 'skills', 'strengths', 'schedule'], g: 'ing_vocab',
    par: [['skills', 'habilidades'], ['experience', 'experiencia'], ['salary', 'salario'], ['shift', 'turno'], ['team', 'equipo']]
  });

  /* Artística y dibujo técnico */
  u('arte', 'art_primarios', 'inf pri1', 'Los colores primarios', {
    i: ['Rojo, amarillo y azul son los colores primarios.', 'Si mezclamos dos primarios obtenemos un secundario.', 'Amarillo y azul hacen verde.'],
    k: ['rojo', 'amarillo', 'azul', 'mezclar'], f: { t: 'circulo' }
  });
  u('arte', 'art_circulo', 'pri2 pri3 sec', 'El círculo cromático', {
    i: ['El círculo cromático ordena los colores como un reloj.', 'Los complementarios están enfrente y contrastan al máximo.', 'Los colores cálidos parecen acercarse; los fríos, alejarse.'],
    k: ['primario', 'secundario', 'complementario', 'cálido', 'frío'], f: { t: 'circulo' }
  });
  u('arte', 'art_vistas', 'sec bach fp', 'Dibujo técnico: las vistas de una pieza', {
    i: ['Una pieza se describe con tres vistas: alzado, planta y perfil.', 'El alzado es la vista de frente; la planta, desde arriba; el perfil, desde un lado.', 'Las vistas se alinean: el alzado y la planta comparten el mismo ancho.', 'La perspectiva isométrica muestra la pieza en 3D con los ejes a 120°.'],
    k: ['alzado', 'planta', 'perfil', 'isométrica', 'cota'], f: { t: 'vistas' }
  });
  u('arte', 'art_compo', 'bach fp adu', 'Composición gráfica', {
    i: ['La regla de los tercios coloca lo importante en las intersecciones de una cuadrícula de 3 × 3.', 'El espacio en blanco da aire y jerarquía.', 'Una sola tipografía bien usada ordena más que muchas.'],
    k: ['jerarquía', 'retícula', 'contraste', 'espacio en blanco']
  });

  /* Música */
  u('musica', 'mus_sonido', 'inf pri1', 'Sonidos fuertes y suaves', {
    i: ['Hay sonidos fuertes, como un tambor, y suaves, como un susurro.', 'Hay sonidos largos y cortos.', 'Hay sonidos agudos, como un pajarito, y graves, como un oso.'],
    k: ['fuerte', 'suave', 'agudo', 'grave'], g: 'gen_relaciona'
  });
  u('musica', 'mus_figuras', 'pri2 pri3', 'Las figuras musicales', {
    i: ['Las figuras indican cuánto dura un sonido.', 'La redonda dura 4 tiempos, la blanca 2, la negra 1 y la corchea medio.', 'Las notas se escriben en el pentagrama: do, re, mi, fa, sol, la, si.'],
    k: ['redonda', 'blanca', 'negra', 'corchea', 'pentagrama'], f: { t: 'pentagrama' }, g: 'mus_tiempos'
  });
  u('musica', 'mus_folclor', 'pri3 sec', 'La música de {pais}', {
    i: ['Cada país tiene músicas que cuentan su historia: en {pais}, {musica}.', 'Estas músicas mezclan raíces indígenas, africanas y europeas.', 'Escuchar con atención es reconocer ritmo, instrumentos y carácter.'],
    k: ['ritmo', 'instrumento', 'folclor', 'compás'],
    q: ['¿Qué canción de {musica} conoces? ¿Quién te la enseñó?', 'Nombra tres instrumentos que suenen en ella.']
  });
  u('musica', 'mus_orquesta', 'sec bach', 'Los instrumentos de la orquesta', {
    i: ['La orquesta agrupa los instrumentos en familias: cuerda, viento madera, viento metal y percusión.', 'La cuerda es la familia más numerosa.', 'El director marca el tempo y las entradas.'],
    k: ['cuerda', 'viento madera', 'viento metal', 'percusión'],
    f: { t: 'mapa', c: 'Orquesta', r: ['cuerda', 'viento madera', 'viento metal', 'percusión'] }, g: 'gen_relaciona'
  });

  /* Educación física */
  u('efisica', 'ef_muevo', 'inf pri1', 'Me muevo y juego', {
    i: ['Correr, saltar, girar y lanzar son formas de moverse.', 'Antes de jugar calentamos el cuerpo.', 'Después de moverse, bebemos agua.'],
    k: ['correr', 'saltar', 'lanzar', 'equilibrio']
  });
  u('efisica', 'ef_coop', 'pri2 pri3', 'Juegos cooperativos', {
    i: ['En un juego cooperativo todo el grupo gana o pierde junto.', 'Escuchar y animar a los compañeros es parte del juego.', 'Las reglas se pactan antes de empezar.'],
    k: ['cooperar', 'regla', 'equipo', 'respeto']
  });
  u('efisica', 'ef_calen', 'sec bach', 'Calentamiento y condición física', {
    i: ['El calentamiento sube la temperatura del cuerpo y prepara músculos y articulaciones.', 'Va de lo general a lo específico y dura entre 10 y 15 minutos.', 'Las capacidades físicas básicas son resistencia, fuerza, velocidad y flexibilidad.'],
    k: ['resistencia', 'fuerza', 'velocidad', 'flexibilidad', 'frecuencia cardiaca'],
    f: { t: 'flujo', p: ['Movilidad', 'Activación', 'Estiramiento dinámico', 'Ejercicio específico'] }
  });
  u('efisica', 'ef_salud', 'adu fp', 'Actividad física y salud', {
    i: ['Se recomiendan al menos 150 minutos de actividad moderada a la semana para personas adultas.', 'Caminar a paso ligero cuenta como actividad moderada.', 'Levantarse cada hora si se trabaja sentado reduce molestias.'],
    k: ['actividad moderada', 'sedentarismo', 'postura', 'pausa activa']
  });

  /* Tecnología */
  u('tecno', 'tec_ordenador', 'pri1 pri2 pri3', 'Las partes de la computadora', {
    i: ['La computadora recibe datos, los procesa y muestra resultados.', 'El teclado y el ratón son periféricos de entrada; la pantalla y la impresora, de salida.', 'Los archivos se guardan en carpetas con nombres claros.'],
    k: ['teclado', 'ratón', 'pantalla', 'carpeta', 'archivo'], g: 'gen_relaciona'
  });
  u('tecno', 'tec_algo', 'sec', 'Algoritmos y diagramas de flujo', {
    i: ['Un algoritmo es una lista ordenada de pasos para resolver un problema.', 'El diagrama de flujo lo dibuja: óvalos para inicio y fin, rombos para decidir.', 'Una receta de cocina es un algoritmo.'],
    k: ['algoritmo', 'secuencia', 'decisión', 'bucle'],
    f: { t: 'flujo', p: ['Inicio', 'Leer dato', '¿Es par?', 'Mostrar resultado', 'Fin'] }
  });
  u('tecno', 'tec_prog', 'bach fp', 'Programación: variables y bucles', {
    i: ['Una variable guarda un valor con nombre.', 'Un condicional elige un camino según una condición.', 'Un bucle repite instrucciones mientras se cumple una condición.'],
    k: ['variable', 'condicional', 'bucle', 'función'], g: 'tec_traza'
  });
  u('tecno', 'tec_hoja', 'fp adu', 'La hoja de cálculo', {
    i: ['Cada celda tiene una dirección: columna y fila, como B3.', 'Las fórmulas empiezan por = y se recalculan solas.', 'SUMA y PROMEDIO son las funciones que más se usan.'],
    k: ['celda', 'fórmula', 'función', 'rango']
  });
  u('tecno', 'tec_segura', 'pri3 sec adu', 'Seguridad en internet', {
    i: ['Una contraseña segura es larga y no se comparte.', 'Antes de pulsar un enlace, mira quién lo envía.', 'Lo que se publica en internet puede quedarse para siempre.'],
    k: ['contraseña', 'privacidad', 'enlace', 'suplantación'],
    vf: [['Es buena idea usar la misma contraseña en todo.', false], ['Un banco nunca pide la clave por mensaje.', true]]
  });

  /* Valores */
  u('valores', 'val_compartir', 'inf pri1', 'Compartir y ayudar', {
    i: ['Compartir es dejar que otros también disfruten.', 'Pedir las cosas por favor y dar las gracias hace que todos estemos mejor.', 'Si alguien está triste, podemos preguntarle qué le pasa.'],
    k: ['compartir', 'por favor', 'gracias', 'ayudar']
  });
  u('valores', 'val_emociones', 'pri1 pri2 pri3', 'Mis emociones', {
    i: ['Alegría, tristeza, miedo, enfado y sorpresa son emociones que todos sentimos.', 'Ponerle nombre a lo que sientes ayuda a calmarte.', 'Respirar despacio contando hasta cuatro baja el enfado.'],
    k: ['alegría', 'tristeza', 'miedo', 'enfado', 'calma'],
    q: ['¿Qué te hace sentir alegría?', '¿Qué puedes hacer cuando te enfadas?']
  });
  u('valores', 'val_convivencia', 'sec', 'Convivencia y diálogo', {
    i: ['Un conflicto no es malo; lo que importa es cómo se resuelve.', 'Escuchar sin interrumpir y hablar en primera persona («yo me siento…») evita peleas.', 'La mediación ayuda cuando dos partes no se entienden.'],
    k: ['conflicto', 'mediación', 'empatía', 'asertividad']
  });
  u('valores', 'val_etica', 'bach adu', 'Ética: libertad y responsabilidad', {
    i: ['Ser libre es poder elegir; ser responsable es responder por lo elegido.', 'Las normas morales se basan en valores compartidos.', 'Un dilema ético obliga a elegir entre dos valores.'],
    k: ['libertad', 'responsabilidad', 'dilema', 'valor', 'dignidad']
  });

  /* Religión (enfoque cultural y plural; el centro añade su propuesta confesional) */
  u('religion', 'rel_fiestas', 'pri1 pri2 pri3', 'Las fiestas de mi comunidad', {
    i: ['Muchas fiestas tienen origen religioso y se celebran en familia.', 'En {pais} se vive con fuerza {fiesta}.', 'Las fiestas unen a las personas con música, comida y tradiciones.'],
    k: ['fiesta', 'tradición', 'celebración', 'comunidad'],
    q: ['¿Qué fiesta celebra tu familia? ¿Qué se come ese día?']
  });
  u('religion', 'rel_tradiciones', 'sec bach', 'Las grandes tradiciones religiosas', {
    i: ['Cristianismo, islam, judaísmo, hinduismo y budismo son las tradiciones con más fieles.', 'Cada una tiene textos sagrados, lugares de culto y fiestas propias.', 'Conocerlas ayuda a entender el arte, la historia y a las personas que nos rodean.'],
    k: ['texto sagrado', 'lugar de culto', 'rito', 'diálogo interreligioso'],
    f: { t: 'mapa', c: 'Tradiciones', r: ['cristianismo', 'islam', 'judaísmo', 'hinduismo', 'budismo'] }
  });
  u('religion', 'rel_arte', 'bach adu', 'Religión, arte y cultura', {
    i: ['Buena parte del arte de América y Europa nació para templos y celebraciones.', 'Las procesiones, los retablos y la música sacra son patrimonio cultural.', 'Leer una obra religiosa pide conocer sus símbolos.'],
    k: ['símbolo', 'patrimonio', 'retablo', 'iconografía']
  });

  /* Peluquería: respaldo estático si el cerebro del Estudio no está cargado */
  u('pelu', 'pel_higiene', 'fp adu', 'Higiene y seguridad en el salón', {
    i: ['Cada herramienta se limpia y desinfecta entre clientes.', 'La prueba de sensibilidad se hace 48 horas antes de un tinte.', 'Los guantes protegen la piel de quien trabaja.'],
    k: ['desinfección', 'prueba de sensibilidad', 'guantes', 'ficha técnica']
  });

  function banda(pais, nivel, curso) {
    var P = PAISES[pais], N = P && P.niveles[nivel];
    if (!N) return nivel === 'pri' ? 'pri2' : nivel;
    var c = N.c[Math.max(0, Math.min(N.c.length - 1, curso || 0))];
    return c ? c.b : nivel;
  }

  var ORDEN = ['inf', 'pri1', 'pri2', 'pri3', 'sec', 'bach', 'fp', 'adu'];
  function distancia(a, b) {
    if (a === b) return 0;
    var ia = ORDEN.indexOf(a), ib = ORDEN.indexOf(b);
    if ((a === 'fp' || a === 'adu') && (b === 'fp' || b === 'adu')) return 1;
    if (a === 'fp' || a === 'adu') ib = ib === 4 || ib === 5 ? 6 : ib;
    return Math.abs(ia - ib) + 0.5;
  }

  /* Peluquería: las técnicas del cerebro del Estudio se vuelven unidades. */
  function unidadesPelu() {
    var CB = window.EU_CEREBRO;
    if (!CB || !CB.familias) return null;
    var out = [];
    try {
      CB.familias().forEach(function (fa) {
        CB.listar(fa.id).forEach(function (t0) {
          var t = CB.obtener(t0.id) || t0;
          var pasos = t.pasos || t.fases || [];
          if (!Array.isArray(pasos)) pasos = [];
          var ideas = [t.resumen || t.n].concat(pasos.slice(0, 4).map(function (p) { return (p.t ? p.t + ': ' : '') + (p.n || ''); }));
          out.push({
            m: 'pelu', id: 'cb_' + t.id, b: ['fp', 'adu', 'bach'], t: t.n, i: ideas.filter(Boolean),
            k: pasos.slice(0, 5).map(function (p) { return (p.t || '').toLowerCase(); }).filter(Boolean),
            rep: (t.repaso || []).map(function (r) { return { p: r.p, o: r.o, c: r.c, x: r.x }; }),
            err: pasos.filter(function (p) { return p.e; }).slice(0, 4).map(function (p) { return p.e; }),
            f: pasos.length ? { t: 'flujo', p: pasos.slice(0, 6).map(function (p) { return p.t; }) } : null,
            fam: fa.n
          });
        });
      });
    } catch (e) { return null; }
    return out.length ? out : null;
  }

  function unidades(materia, bnd) {
    var lista = materia === 'pelu' ? (unidadesPelu() || U.filter(function (x) { return x.m === 'pelu'; })) : U.filter(function (x) { return x.m === materia; });
    return lista.map(function (x) {
      var d = Math.min.apply(null, x.b.map(function (b) { return distancia(bnd, b); }));
      return { u: x, d: d };
    }).sort(function (a, b) { return a.d - b.d; }).map(function (r) { r.u._ajuste = r.d; return r.u; });
  }

  function materia(id) { return MATERIAS.filter(function (m) { return m.id === id; })[0]; }
  function nombreMateria(id, pais) { var m = materia(id); return m ? (m.al[pais] || m.n) : id; }

  window.EU_CURRICULO = {
    BANDAS: BANDAS, NIVELES: NIVELES, PAISES: PAISES, MATERIAS: MATERIAS, UNIDADES: U,
    banda: banda, unidades: unidades, materia: materia, nombreMateria: nombreMateria
  };
})();
