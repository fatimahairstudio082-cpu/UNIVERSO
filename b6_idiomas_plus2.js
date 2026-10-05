/* b6_idiomas_plus2.js — segunda ampliación del diccionario: nueve temas más
   (animales salvajes, bichos, el mar, fiestas, direcciones, formas, matemáticas, ciencia y preguntas),
   cada uno con sus frases de ejemplo propias. Se suma a window.EU_IDIOMAS_PLUS.
   Cargar después de b6_idiomas_plus.js y ANTES de b6_cerebro_idiomas.js. */
(function () {
  'use strict';
  function T(id, t, ej, w, ej2, pat) { return { id: id, t: t.split('|'), pat: pat || 'nombre', ej: ej ? ej.split('|') : null, ej2: ej2 ? ej2.split('|') : null, w: w }; }
  var M = [
    T('salvajes', 'Los animales salvajes|Wild animals|Les animaux sauvages|Die Wildtiere|D Wildtier',
      '{W} vive en libertad.|The {w} lives in the wild.|{W} vit en liberté.|{W} lebt in freier Wildbahn.|{W} läbt i de Wildnis.', [
      'el león|lion|le lion|der Löwe|de Löi', 'el tigre|tiger|le tigre|der Tiger|de Tiger', 'el elefante|elephant|l’éléphant|der Elefant|de Elefant',
      'la jirafa|giraffe|la girafe|die Giraffe|d Giraffe', 'el mono|monkey|le singe|der Affe|de Aff', 'el oso|bear|l’ours|der Bär|de Bär',
      'el lobo|wolf|le loup|der Wolf|de Wolf', 'el zorro|fox|le renard|der Fuchs|de Fuchs', 'la serpiente|snake|le serpent|die Schlange|d Schlange',
      'el águila|eagle|l’aigle|der Adler|de Adler', 'el delfín|dolphin|le dauphin|der Delfin|de Delfin', 'la cebra|zebra|le zèbre|das Zebra|s Zebra'],
      'En el documental sale {w}.|The {w} appears in the documentary.|On voit {w} dans le documentaire.|Im Film kommt {w} vor.|Im Film chunt {w} vor.'),
    T('bichos', 'Los insectos y bichos|Minibeasts|Les petites bêtes|Die Krabbeltiere|D Chrabbeltierli',
      '{W} está en la hoja.|The {w} is on the leaf.|{W} est sur la feuille.|{W} sitzt auf dem Blatt.|{W} sitzt uf em Blatt.', [
      'la mariposa|butterfly|le papillon|der Schmetterling|de Schmetterling', 'la abeja|bee|l’abeille|die Biene|d Biene', 'la hormiga|ant|la fourmi|die Ameise|d Ameisi',
      'la araña|spider|l’araignée|die Spinne|d Spinne', 'la mosca|fly|la mouche|die Fliege|d Flüüge', 'la mariquita|ladybird|la coccinelle|der Marienkäfer|s Marienkäferli',
      'el caracol|snail|l’escargot|die Schnecke|d Schnägg', 'el mosquito|mosquito|le moustique|die Mücke|d Mugge', 'el grillo|cricket|le grillon|die Grille|d Grille',
      'la libélula|dragonfly|la libellule|die Libelle|d Libelle'],
      'Con la lupa, {w} parece enorme.|Under the magnifying glass the {w} looks huge.|Sous la loupe, {w} est énorme.|Unter der Lupe ist {w} riesig.|Under de Lupe isch {w} riisig.'),
    T('mar', 'El mar|The sea|La mer|Das Meer|S Meer',
      '{W} está cerca de casa.|The {w} is near our house.|{W} est près de la maison.|{W} ist nah beim Haus.|{W} isch nöch bim Huus.', [
      'la playa|beach|la plage|der Strand|de Strand', 'la ola|wave|la vague|die Welle|d Wälle', 'la arena|sand|le sable|der Sand|de Sand',
      'el barco|boat|le bateau|das Schiff|s Schiff', 'la concha|shell|le coquillage|die Muschel|d Muschle', 'la ballena|whale|la baleine|der Wal|de Wal',
      'la estrella de mar|starfish|l’étoile de mer|der Seestern|de Seestärn', 'el pulpo|octopus|la pieuvre|der Krake|de Krake', 'el cangrejo|crab|le crabe|die Krabbe|d Chrabbe',
      'el faro|lighthouse|le phare|der Leuchtturm|de Lüüchtturm', 'la isla|island|l’île|die Insel|d Insle', 'el puerto|harbour|le port|der Hafen|de Hafe'],
      '{W} sale en mi foto del verano.|The {w} is in my summer photo.|{W} est sur ma photo d’été.|{W} ist auf meinem Sommerfoto.|{W} isch uf mim Summerfoti.'),
    T('fiestas', 'Las fiestas|Parties|Les fêtes|Die Feste|D Fäscht',
      '{W} es para la fiesta.|The {w} is for the party.|{W} est pour la fête.|{W} ist für das Fest.|{W} isch fürs Fäscht.', [
      'el cumpleaños|birthday|l’anniversaire|der Geburtstag|de Geburtstag', 'el regalo|present|le cadeau|das Geschenk|s Gschänk', 'la tarta|cake|le gâteau|der Kuchen|de Chueche',
      'la vela|candle|la bougie|die Kerze|d Cherze', 'el globo|balloon|le ballon|der Ballon|de Ballon', 'la invitación|invitation|l’invitation|die Einladung|d Iiladig',
      'la música|music|la musique|die Musik|d Musig', 'el baile|dance|la danse|der Tanz|de Tanz', 'la sorpresa|surprise|la surprise|die Überraschung|d Überraschig',
      'la foto|photo|la photo|das Foto|s Foti'],
      '{W} nos hace muy felices.|The {w} makes us very happy.|{W} nous rend très heureux.|{W} macht uns sehr glücklich.|{W} macht üs mega glücklich.'),
    T('direcciones', 'Las direcciones|Directions|Les directions|Die Richtungen|D Richtige',
      'La biblioteca está {w}.|The library is {w}.|La bibliothèque est {w}.|Die Bibliothek ist {w}.|D Bibliothek isch {w}.', [
      'a la derecha|on the right|à droite|rechts|rächts', 'a la izquierda|on the left|à gauche|links|links', 'todo recto|straight on|tout droit|geradeaus|grad us',
      'cerca|near|près|nah|nöch', 'lejos|far|loin|weit weg|wiit wäg', 'arriba|upstairs|en haut|oben|obe',
      'abajo|downstairs|en bas|unten|unde', 'delante|in front|devant|vorne|vorne', 'detrás|behind|derrière|hinten|hine', 'en la esquina|at the corner|au coin|an der Ecke|a de Egge']),
    T('formas', 'Las formas|Shapes|Les formes|Die Formen|D Forme',
      '{W} está en la pizarra.|The {w} is on the board.|{W} est au tableau.|{W} ist an der Tafel.|{W} isch a de Wandtafele.', [
      'el círculo|circle|le cercle|der Kreis|de Chreis', 'el cuadrado|square|le carré|das Quadrat|s Quadrat', 'el triángulo|triangle|le triangle|das Dreieck|s Dreieck',
      'el rectángulo|rectangle|le rectangle|das Rechteck|s Rächteck', 'la estrella|star|l’étoile|der Stern|de Stärn', 'el corazón|heart|le cœur|das Herz|s Härz',
      'el rombo|diamond|le losange|die Raute|d Rute', 'el óvalo|oval|l’ovale|das Oval|s Oval', 'el hexágono|hexagon|l’hexagone|das Sechseck|s Sächseck',
      'el cubo|cube|le cube|der Würfel|de Würfel', 'la esfera|sphere|la sphère|die Kugel|d Chugle', 'la pirámide|pyramid|la pyramide|die Pyramide|d Pyramide'],
      '{W} tiene una forma perfecta.|The {w} has a perfect shape.|{W} a une forme parfaite.|{W} hat eine perfekte Form.|{W} hät e perfekti Form.'),
    T('matematicas', 'Las matemáticas|Maths|Les maths|Die Mathematik|D Mathe',
      '{W} está en la página diez.|The {w} is on page ten.|{W} est à la page dix.|{W} steht auf Seite zehn.|{W} staht uf Siite zäh.', [
      'la suma|addition|l’addition|die Addition|d Addition', 'la resta|subtraction|la soustraction|die Subtraktion|d Subtraktion', 'la multiplicación|multiplication|la multiplication|die Multiplikation|d Multiplikation',
      'la división|division|la division|die Division|d Division', 'el número|number|le nombre|die Zahl|d Zahl', 'la fracción|fraction|la fraction|der Bruch|de Bruch',
      'el ángulo|angle|l’angle|der Winkel|de Winkel', 'la ecuación|equation|l’équation|die Gleichung|d Gleichig', 'el compás|compass|le compas|der Zirkel|de Zirkel',
      'el resultado|result|le résultat|das Ergebnis|s Resultat', 'el problema|problem|le problème|die Aufgabe|d Ufgab', 'la gráfica|graph|le graphique|die Grafik|d Grafik'],
      '{W} parece difícil, pero no lo es.|The {w} looks hard, but it isn’t.|{W} semble difficile, mais ce n’est pas le cas.|{W} sieht schwer aus, ist es aber nicht.|{W} gseht schwär us, isch es aber nöd.'),
    T('ciencia', 'La ciencia|Science|La science|Die Wissenschaft|D Wüsseschaft',
      '{W} es el tema de hoy.|The {w} is today’s topic.|{W} est le sujet du jour.|{W} ist das Thema von heute.|{W} isch s Thema vo hüt.', [
      'el laboratorio|laboratory|le laboratoire|das Labor|s Labor', 'el microscopio|microscope|le microscope|das Mikroskop|s Mikroskop', 'el experimento|experiment|l’expérience|das Experiment|s Experimänt',
      'el átomo|atom|l’atome|das Atom|s Atom', 'la energía|energy|l’énergie|die Energie|d Energie', 'el imán|magnet|l’aimant|der Magnet|de Magnet',
      'la lupa|magnifying glass|la loupe|die Lupe|d Lupe', 'el termómetro|thermometer|le thermomètre|das Thermometer|s Thermometer', 'la célula|cell|la cellule|die Zelle|d Zälle',
      'el planeta|planet|la planète|der Planet|de Planet', 'la fuerza|force|la force|die Kraft|d Chraft', 'la luz|light|la lumière|das Licht|s Liecht'],
      '{W} aparece en el libro de ciencias.|The {w} appears in the science book.|{W} apparaît dans le livre de sciences.|{W} kommt im Naturkundebuch vor.|{W} chunt im Naturkundbuech vor.'),
    T('preguntas', 'Las preguntas|Questions|Les questions|Die Fragen|D Frage', null, [
      '¿qué?|what?|quoi ?|was?|was?', '¿quién?|who?|qui ?|wer?|wär?', '¿dónde?|where?|où ?|wo?|wo?', '¿cuándo?|when?|quand ?|wann?|wänn?',
      '¿por qué?|why?|pourquoi ?|warum?|werum?', '¿cómo?|how?|comment ?|wie?|wie?', '¿cuánto?|how much?|combien ?|wie viel?|wie vill?', '¿cuál?|which?|lequel ?|welche?|weli?'], null, 'frase')
  ];
  window.EU_IDIOMAS_PLUS = (window.EU_IDIOMAS_PLUS || []).concat(M);
})();
