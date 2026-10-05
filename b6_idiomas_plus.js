/* b6_idiomas_plus.js — ampliación del diccionario de idiomas (window.EU_IDIOMAS_PLUS).
   Temas nuevos en español | inglés | francés | alemán | suizo alemán (grafía zuriquesa aproximada).
   Cada tema trae sus propias frases de ejemplo (ej, y ej2 para las palabras impares) para que
   ninguna entrada repita la misma frase. {W} = palabra con mayúscula inicial, {w} = tal cual.
   Cargar ANTES de b6_cerebro_idiomas.js. */
(function () {
  'use strict';
  function T(id, t, ej, w, ej2) { return { id: id, t: t.split('|'), pat: 'nombre', ej: ej ? ej.split('|') : null, ej2: ej2 ? ej2.split('|') : null, w: w }; }
  window.EU_IDIOMAS_PLUS = [
    T('ropa', 'La ropa|Clothes|Les vêtements|Die Kleidung|D Chleider',
      '{W} está en el armario.|The {w} is in the wardrobe.|{W} est dans l’armoire.|{W} ist im Schrank.|{W} isch im Chaschte.', [
      'la camisa|shirt|la chemise|das Hemd|s Hemp', 'el pantalón|trousers|le pantalon|die Hose|d Hose', 'la falda|skirt|la jupe|der Rock|de Jupe',
      'el vestido|dress|la robe|das Kleid|s Chleid', 'el abrigo|coat|le manteau|der Mantel|de Mantel', 'el zapato|shoe|la chaussure|der Schuh|de Schue',
      'el calcetín|sock|la chaussette|die Socke|de Socke', 'el sombrero|hat|le chapeau|der Hut|de Huet', 'la bufanda|scarf|l’écharpe|der Schal|de Schal',
      'el jersey|jumper|le pull|der Pullover|de Pulli', 'el guante|glove|le gant|der Handschuh|de Händsche', 'el pijama|pyjamas|le pyjama|der Pyjama|s Pijama'],
      'Me pongo {w} por la mañana.|I put on the {w} in the morning.|Je mets {w} le matin.|Am Morgen ziehe ich {w} an.|Am Morge leg ich {w} a.'),
    T('tiempo', 'El tiempo|The weather|La météo|Das Wetter|S Wätter',
      '{W} llega por la tarde.|The {w} comes in the afternoon.|{W} arrive l’après-midi.|{W} kommt am Nachmittag.|{W} chunt am Namittag.', [
      'el sol|sun|le soleil|die Sonne|d Sunne', 'la lluvia|rain|la pluie|der Regen|de Räge', 'la nieve|snow|la neige|der Schnee|de Schnee',
      'el viento|wind|le vent|der Wind|de Wind', 'la nube|cloud|le nuage|die Wolke|d Wolke', 'la tormenta|storm|l’orage|das Gewitter|s Gwitter',
      'la niebla|fog|le brouillard|der Nebel|de Näbel', 'el arcoíris|rainbow|l’arc-en-ciel|der Regenbogen|de Rägeboge', 'el rayo|lightning|l’éclair|der Blitz|de Blitz',
      'el hielo|ice|la glace|das Eis|s Iis', 'el calor|heat|la chaleur|die Hitze|d Hitz', 'el frío|cold|le froid|die Kälte|d Chälti']),
    T('meses', 'Los meses|The months|Les mois|Die Monate|D Mönet',
      'Mi cumpleaños es en {w}.|My birthday is in {W}.|Mon anniversaire est en {w}.|Mein Geburtstag ist im {w}.|Min Geburtstag isch im {w}.', [
      'enero|January|janvier|Januar|Januar', 'febrero|February|février|Februar|Februar', 'marzo|March|mars|März|März', 'abril|April|avril|April|April',
      'mayo|May|mai|Mai|Mai', 'junio|June|juin|Juni|Juni', 'julio|July|juillet|Juli|Juli', 'agosto|August|août|August|Auguscht',
      'septiembre|September|septembre|September|September', 'octubre|October|octobre|Oktober|Oktober', 'noviembre|November|novembre|November|November', 'diciembre|December|décembre|Dezember|Dezämber']),
    T('dias', 'Los días de la semana|The days of the week|Les jours de la semaine|Die Wochentage|D Wuchetäg',
      'Nos vemos el {w}.|See you on {W}.|On se voit {w}.|Wir sehen uns am {w}.|Mir gsehnd üs am {w}.', [
      'lunes|Monday|lundi|Montag|Mäntig', 'martes|Tuesday|mardi|Dienstag|Ziischtig', 'miércoles|Wednesday|mercredi|Mittwoch|Mittwuch', 'jueves|Thursday|jeudi|Donnerstag|Dunschtig',
      'viernes|Friday|vendredi|Freitag|Friitig', 'sábado|Saturday|samedi|Samstag|Samschtig', 'domingo|Sunday|dimanche|Sonntag|Sunntig']),
    T('profesiones', 'Las profesiones|Jobs|Les métiers|Die Berufe|D Bruef',
      '{W} trabaja cerca de casa.|The {w} works near home.|{W} travaille près de la maison.|{W} arbeitet in der Nähe.|{W} schaffet i de Nöchi.', [
      'la médica|doctor|la médecin|die Ärztin|d Ärztin', 'el bombero|firefighter|le pompier|der Feuerwehrmann|de Füürwehrmaa', 'la cocinera|cook|la cuisinière|die Köchin|d Chöchin',
      'el panadero|baker|le boulanger|der Bäcker|de Beck', 'la enfermera|nurse|l’infirmière|die Pflegerin|d Pflegerin', 'el carpintero|carpenter|le menuisier|der Schreiner|de Schriiner',
      'la policía|police officer|la policière|die Polizistin|d Polizischtin', 'el agricultor|farmer|l’agriculteur|der Bauer|de Buur', 'la peluquera|hairdresser|la coiffeuse|die Friseurin|d Coiffeuse',
      'el cartero|postman|le facteur|der Briefträger|de Pöschtler', 'la veterinaria|vet|la vétérinaire|die Tierärztin|d Tierärztin', 'el mecánico|mechanic|le mécanicien|der Mechaniker|de Mech']),
    T('transporte', 'El transporte|Transport|Les transports|Der Verkehr|De Verchehr',
      '{W} sale a las ocho.|The {w} leaves at eight.|{W} part à huit heures.|{W} fährt um acht ab.|{W} fahrt am achti ab.', [
      'el coche|car|la voiture|das Auto|s Auto', 'el avión|plane|l’avion|das Flugzeug|s Flugzüüg', 'el barco|boat|le bateau|das Schiff|s Schiff',
      'el metro|underground|le métro|die U-Bahn|d U-Bahn', 'el tranvía|tram|le tramway|die Strassenbahn|s Tram', 'el camión|lorry|le camion|der Lastwagen|de Laschtwage',
      'la moto|motorbike|la moto|das Motorrad|s Töff', 'el taxi|taxi|le taxi|das Taxi|s Taxi', 'el helicóptero|helicopter|l’hélicoptère|der Hubschrauber|de Helikopter',
      'el teleférico|cable car|le téléphérique|die Seilbahn|d Seilbahn', 'la furgoneta|van|la camionnette|der Lieferwagen|de Liferwage', 'el patinete|scooter|la trottinette|der Tretroller|s Trottinett']),
    T('deportes', 'Los deportes|Sports|Les sports|Die Sportarten|D Sportarte',
      '{W} es mi deporte favorito.|The {w} is my favourite sport.|{W} est mon sport préféré.|{W} ist mein Lieblingssport.|{W} isch min Lieblingssport.', [
      'el fútbol|football|le football|der Fussball|de Fuessball', 'el baloncesto|basketball|le basket|der Basketball|de Basketball', 'el tenis|tennis|le tennis|das Tennis|s Tennis',
      'la natación|swimming|la natation|das Schwimmen|s Schwümme', 'el ciclismo|cycling|le cyclisme|der Radsport|s Velofahre', 'el esquí|skiing|le ski|das Skifahren|s Skifahre',
      'el atletismo|athletics|l’athlétisme|die Leichtathletik|d Liechtathletik', 'el voleibol|volleyball|le volley|der Volleyball|de Volleyball', 'la gimnasia|gymnastics|la gymnastique|das Turnen|s Turne',
      'el balonmano|handball|le handball|der Handball|de Handball', 'el judo|judo|le judo|das Judo|s Judo', 'el béisbol|baseball|le baseball|der Baseball|de Baseball']),
    T('verbos', 'Verbos de cada día|Everyday verbs|Les verbes du quotidien|Verben im Alltag|Verbe im Alltag',
      'Me gusta {w}.|I like to {w}.|J’aime {w}.|Ich kann {w}.|Chasch du {w}?', [
      'comer|eat|manger|essen|ässe', 'beber|drink|boire|trinken|trinke', 'dormir|sleep|dormir|schlafen|schlafe', 'leer|read|lire|lesen|läse',
      'escribir|write|écrire|schreiben|schriibe', 'cantar|sing|chanter|singen|singe', 'bailar|dance|danser|tanzen|tanze', 'nadar|swim|nager|schwimmen|schwümme',
      'correr|run|courir|rennen|renne', 'jugar|play|jouer|spielen|spile', 'cocinar|cook|cuisiner|kochen|choche', 'dibujar|draw|dessiner|zeichnen|zeichne',
      'escuchar|listen|écouter|zuhören|zuelose', 'hablar|speak|parler|sprechen|rede', 'viajar|travel|voyager|reisen|reise', 'aprender|learn|apprendre|lernen|lehre']),
    T('emociones', 'Las emociones|Feelings|Les émotions|Die Gefühle|D Gfüehl',
      'Hoy estoy {w}.|Today I am {w}.|Aujourd’hui je suis {w}.|Heute bin ich {w}.|Hüt bin ich {w}.', [
      'contento|happy|content|froh|zfride', 'triste|sad|triste|traurig|truurig', 'enfadado|angry|fâché|wütend|hässig', 'cansado|tired|fatigué|müde|müed',
      'nervioso|nervous|nerveux|nervös|nervös', 'tranquilo|calm|calme|ruhig|ruhig', 'sorprendido|surprised|surpris|überrascht|überrascht', 'asustado|scared|effrayé|ängstlich|ängschtlich',
      'orgulloso|proud|fier|stolz|stolz', 'aburrido|bored|ennuyé|gelangweilt|glangwiilt', 'tímido|shy|timide|schüchtern|schüüch', 'enamorado|in love|amoureux|verliebt|verliebt']),
    T('opuestos', 'Adjetivos opuestos|Opposites|Les contraires|Gegensätze|Gägesätz',
      'Es muy {w}.|It is very {w}.|C’est très {w}.|Es ist sehr {w}.|Es isch sehr {w}.', [
      'grande|big|grand|gross|gross', 'pequeño|small|petit|klein|chli', 'alto|tall|haut|hoch|höch', 'bajo|low|bas|niedrig|nider',
      'rápido|fast|rapide|schnell|schnäll', 'lento|slow|lent|langsam|langsam', 'caliente|hot|chaud|heiss|heiss', 'frío|cold|froid|kalt|chalt',
      'nuevo|new|neuf|neu|neu', 'viejo|old|vieux|alt|alt', 'fácil|easy|facile|einfach|eifach', 'difícil|difficult|difficile|schwierig|schwirig',
      'limpio|clean|propre|sauber|suuber', 'sucio|dirty|sale|schmutzig|dräckig', 'caro|expensive|cher|teuer|tüür', 'barato|cheap|bon marché|billig|billig']),
    T('frutas', 'Las frutas|Fruit|Les fruits|Das Obst|S Obscht',
      '{W} está en el frutero.|The {w} is in the fruit bowl.|{W} est dans la corbeille.|{W} liegt in der Schale.|{W} liit i de Schale.', [
      'la pera|pear|la poire|die Birne|d Bire', 'la naranja|orange|l’orange|die Orange|d Orange', 'la fresa|strawberry|la fraise|die Erdbeere|s Erdbeeri',
      'la uva|grape|le raisin|die Traube|d Truube', 'la cereza|cherry|la cerise|die Kirsche|s Chriesi', 'la piña|pineapple|l’ananas|die Ananas|d Ananas',
      'la sandía|watermelon|la pastèque|die Wassermelone|d Wassermelone', 'el limón|lemon|le citron|die Zitrone|d Zitrone', 'el plátano|banana|la banane|die Banane|d Banane',
      'el melocotón|peach|la pêche|der Pfirsich|de Pfirsich', 'la ciruela|plum|la prune|die Pflaume|d Zwätschge', 'el mango|mango|la mangue|die Mango|d Mango'],
      'Compro {w} en el mercado.|I buy the {w} at the market.|J’achète {w} au marché.|Ich kaufe {w} auf dem Markt.|Ich chauf {w} uf em Märt.'),
    T('verduras', 'Las verduras|Vegetables|Les légumes|Das Gemüse|S Gmües',
      '{W} está en la cesta.|The {w} is in the basket.|{W} est dans le panier.|{W} ist im Korb.|{W} isch im Chorb.', [
      'el tomate|tomato|la tomate|die Tomate|d Tomate', 'la patata|potato|la pomme de terre|die Kartoffel|de Härdöpfel', 'la cebolla|onion|l’oignon|die Zwiebel|d Zibele',
      'el ajo|garlic|l’ail|der Knoblauch|de Chnobli', 'la lechuga|lettuce|la laitue|der Salat|de Salat', 'el pepino|cucumber|le concombre|die Gurke|d Gurke',
      'el pimiento|pepper|le poivron|die Paprika|de Peperoni', 'el brócoli|broccoli|le brocoli|der Brokkoli|de Broccoli', 'la calabaza|pumpkin|la citrouille|der Kürbis|de Chürbis',
      'la berenjena|aubergine|l’aubergine|die Aubergine|d Aubergine', 'el maíz|corn|le maïs|der Mais|de Mais', 'el guisante|pea|le petit pois|die Erbse|d Erbsli']),
    T('naturaleza', 'La naturaleza|Nature|La nature|Die Natur|D Natur',
      '{W} está lejos de aquí.|The {w} is far from here.|{W} est loin d’ici.|{W} ist weit weg.|{W} isch wiit ewäg.', [
      'el bosque|forest|la forêt|der Wald|de Wald', 'el río|river|la rivière|der Fluss|de Fluss', 'el lago|lake|le lac|der See|de See',
      'la montaña|mountain|la montagne|der Berg|de Bärg', 'el valle|valley|la vallée|das Tal|s Tal', 'la playa|beach|la plage|der Strand|de Strand',
      'el mar|sea|la mer|das Meer|s Meer', 'la isla|island|l’île|die Insel|d Insle', 'el desierto|desert|le désert|die Wüste|d Wüeschti',
      'la cascada|waterfall|la cascade|der Wasserfall|de Wasserfall', 'el prado|meadow|le pré|die Wiese|d Matte', 'la cueva|cave|la grotte|die Höhle|d Höhli']),
    T('plantas', 'Las plantas|Plants|Les plantes|Die Pflanzen|D Pflanze',
      '{W} necesita agua y luz.|The {w} needs water and light.|{W} a besoin d’eau et de lumière.|{W} braucht Wasser und Licht.|{W} bruucht Wasser und Liecht.', [
      'la flor|flower|la fleur|die Blume|d Blueme', 'el árbol|tree|l’arbre|der Baum|de Baum', 'la hoja|leaf|la feuille|das Blatt|s Blatt',
      'la raíz|root|la racine|die Wurzel|d Wurzle', 'el tallo|stem|la tige|der Stängel|de Stängel', 'la semilla|seed|la graine|der Samen|de Some',
      'la rosa|rose|la rose|die Rose|d Rose', 'el girasol|sunflower|le tournesol|die Sonnenblume|d Sunneblueme', 'el cactus|cactus|le cactus|der Kaktus|de Kaktus',
      'la hierba|grass|l’herbe|das Gras|s Gras', 'el pino|pine|le pin|die Kiefer|d Föhre', 'la seta|mushroom|le champignon|der Pilz|de Pilz']),
    T('espacio', 'El espacio|Space|L’espace|Der Weltraum|De Wältruum',
      '{W} brilla en el cielo.|The {w} shines in the sky.|{W} brille dans le ciel.|{W} leuchtet am Himmel.|{W} lüchtet am Himmel.', [
      'la estrella|star|l’étoile|der Stern|de Stärn', 'la luna|moon|la lune|der Mond|de Mond', 'el planeta|planet|la planète|der Planet|de Planet',
      'el cometa|comet|la comète|der Komet|de Komet', 'la galaxia|galaxy|la galaxie|die Galaxie|d Galaxie', 'el cohete|rocket|la fusée|die Rakete|d Rakete',
      'el satélite|satellite|le satellite|der Satellit|de Satellit', 'la astronauta|astronaut|l’astronaute|die Astronautin|d Astronautin', 'el telescopio|telescope|le télescope|das Teleskop|s Teleskop',
      'el meteorito|meteorite|la météorite|der Meteorit|de Meteorit', 'la órbita|orbit|l’orbite|die Umlaufbahn|d Umlaufbahn', 'el eclipse|eclipse|l’éclipse|die Finsternis|d Finschternis']),
    T('musica_idi', 'La música|Music|La musique|Die Musik|D Musig',
      '{W} suena muy bien.|The {w} sounds very good.|{W} sonne très bien.|{W} klingt sehr gut.|{W} tönt sehr guet.', [
      'la guitarra|guitar|la guitare|die Gitarre|d Gitarre', 'el piano|piano|le piano|das Klavier|s Klavier', 'el violín|violin|le violon|die Geige|d Giige',
      'la flauta|flute|la flûte|die Flöte|d Flöte', 'el tambor|drum|le tambour|die Trommel|d Trummle', 'la trompeta|trumpet|la trompette|die Trompete|d Trumpete',
      'la canción|song|la chanson|das Lied|s Lied', 'el coro|choir|la chorale|der Chor|de Chor', 'la orquesta|orchestra|l’orchestre|das Orchester|s Orcheschter',
      'el acordeón|accordion|l’accordéon|das Akkordeon|s Handörgeli', 'la armónica|harmonica|l’harmonica|die Mundharmonika|s Muulörgeli', 'el concierto|concert|le concert|das Konzert|s Konzärt']),
    T('salud', 'La salud|Health|La santé|Die Gesundheit|D Gsundheit',
      '{W} está en la farmacia.|The {w} is at the chemist’s.|{W} est à la pharmacie.|{W} ist in der Apotheke.|{W} isch i de Apothek.', [
      'la tirita|plaster|le pansement|das Pflaster|s Pflaschter', 'el jarabe|syrup|le sirop|der Sirup|de Sirup', 'la pastilla|pill|le comprimé|die Tablette|d Tablette',
      'el termómetro|thermometer|le thermomètre|das Thermometer|s Thermometer', 'la venda|bandage|le bandage|der Verband|de Verband', 'la receta|prescription|l’ordonnance|das Rezept|s Rezäpt',
      'la crema|cream|la crème|die Salbe|d Salbi', 'la vacuna|vaccine|le vaccin|die Impfung|d Impfig', 'la mascarilla|face mask|le masque|die Maske|d Maske',
      'el cepillo de dientes|toothbrush|la brosse à dents|die Zahnbürste|d Zahbürschte', 'el jabón|soap|le savon|die Seife|d Seife', 'la toalla|towel|la serviette|das Handtuch|s Handtuech']),
    T('tecnologia', 'La tecnología|Technology|La technologie|Die Technik|D Technik',
      '{W} está encima de la mesa.|The {w} is on the table.|{W} est sur la table.|{W} ist auf dem Tisch.|{W} isch uf em Tisch.', [
      'el ordenador|computer|l’ordinateur|der Computer|de Compi', 'la pantalla|screen|l’écran|der Bildschirm|de Bildschirm', 'el teclado|keyboard|le clavier|die Tastatur|d Taschtatur',
      'la impresora|printer|l’imprimante|der Drucker|de Drucker', 'la tableta|tablet|la tablette|das Tablet|s Tablet', 'el cargador|charger|le chargeur|das Ladegerät|s Ladegrät',
      'la cámara|camera|l’appareil photo|die Kamera|d Kamera', 'el auricular|headphone|l’écouteur|der Kopfhörer|de Chopfhörer', 'el cable|cable|le câble|das Kabel|s Kabel',
      'la batería|battery|la batterie|der Akku|de Akku', 'el micrófono|microphone|le micro|das Mikrofon|s Mikrofon', 'el altavoz|speaker|le haut-parleur|der Lautsprecher|de Luutsprächer']),
    T('herramientas', 'Las herramientas|Tools|Les outils|Die Werkzeuge|S Wärchzüüg',
      '{W} está en la caja.|The {w} is in the box.|{W} est dans la boîte.|{W} ist in der Kiste.|{W} isch i de Chischte.', [
      'el martillo|hammer|le marteau|der Hammer|de Hammer', 'el destornillador|screwdriver|le tournevis|der Schraubenzieher|de Schrubezieher', 'el clavo|nail|le clou|der Nagel|de Nagel',
      'el tornillo|screw|la vis|die Schraube|d Schrube', 'la sierra|saw|la scie|die Säge|d Sagi', 'la llave inglesa|spanner|la clé à molette|der Schraubenschlüssel|de Schrubeschlüssel',
      'el taladro|drill|la perceuse|die Bohrmaschine|d Bohrmaschine', 'la cinta métrica|tape measure|le mètre ruban|das Massband|s Massband', 'el pincel|brush|le pinceau|der Pinsel|de Pinsel',
      'la escalera|ladder|l’échelle|die Leiter|d Leitere', 'las tijeras|scissors|les ciseaux|die Schere|d Schär', 'el pegamento|glue|la colle|der Leim|de Liim']),
    T('supermercado', 'En el supermercado|At the supermarket|Au supermarché|Im Supermarkt|Im Lade',
      '{W} está en el pasillo tres.|The {w} is in aisle three.|{W} est dans le rayon trois.|{W} ist im dritten Gang.|{W} isch im dritte Gang.', [
      'el carro|trolley|le chariot|der Einkaufswagen|s Wägeli', 'la cesta|basket|le panier|der Korb|de Chorb', 'la caja|till|la caisse|die Kasse|d Kasse',
      'el recibo|receipt|le ticket|der Kassenzettel|de Kassezättel', 'la bolsa|bag|le sac|die Tüte|s Säckli', 'el precio|price|le prix|der Preis|de Priis',
      'la oferta|offer|la promotion|das Angebot|d Aktion', 'el yogur|yoghurt|le yaourt|der Joghurt|s Jogurt', 'el arroz|rice|le riz|der Reis|de Riis',
      'el aceite|oil|l’huile|das Öl|s Öl', 'la sal|salt|le sel|das Salz|s Salz', 'la carne|meat|la viande|das Fleisch|s Fleisch']),
    T('bebidas', 'Las bebidas|Drinks|Les boissons|Die Getränke|D Getränk',
      '{W} está en la nevera.|The {w} is in the fridge.|{W} est dans le frigo.|{W} steht im Kühlschrank.|{W} staht im Chüelschrank.', [
      'el zumo|juice|le jus|der Saft|de Saft', 'el café|coffee|le café|der Kaffee|de Kafi', 'el té|tea|le thé|der Tee|de Tee',
      'el batido|milkshake|le milk-shake|der Milchshake|de Milchshake', 'el chocolate caliente|hot chocolate|le chocolat chaud|der Kakao|d Ovi', 'la limonada|lemonade|la limonade|die Limonade|s Limo',
      'el agua con gas|sparkling water|l’eau gazeuse|das Mineralwasser|s Mineral', 'la sopa|soup|la soupe|die Suppe|d Suppe', 'el refresco|soft drink|le soda|das Erfrischungsgetränk|s Süessgetränk',
      'la infusión|herbal tea|la tisane|der Kräutertee|de Chrüütertee', 'el yogur líquido|drinking yoghurt|le yaourt à boire|der Trinkjoghurt|de Drinkjogurt', 'la horchata|tiger nut milk|le lait de souchet|die Erdmandelmilch|d Erdmandelmilch']),
    T('clase', 'Frases de clase|Classroom phrases|En classe|Im Unterricht|I de Schuel', null, [
      '¿Puedo ir al baño?|May I go to the toilet?|Je peux aller aux toilettes ?|Darf ich auf die Toilette?|Dörf ich uf s WC?', '¿Cómo se dice…?|How do you say…?|Comment on dit… ?|Wie sagt man…?|Wie seit mer…?',
      'No entiendo.|I don’t understand.|Je ne comprends pas.|Ich verstehe nicht.|Ich verstah nöd.', '¿Puede repetir, por favor?|Can you repeat, please?|Vous pouvez répéter, s’il vous plaît ?|Können Sie das wiederholen?|Chönd Sie das nomal säge?',
      'Abrid el libro.|Open your books.|Ouvrez le livre.|Öffnet das Buch.|Machet s Buech uf.', 'He terminado.|I have finished.|J’ai fini.|Ich bin fertig.|Ich bin fertig.',
      '¿Qué página es?|Which page is it?|C’est quelle page ?|Welche Seite ist es?|Weli Siite isch es?', 'Tengo una pregunta.|I have a question.|J’ai une question.|Ich habe eine Frage.|Ich han e Frag.',
      '¿Lo puedes deletrear?|Can you spell it?|Tu peux l’épeler ?|Kannst du das buchstabieren?|Chasch das buechstabiere?', 'Trabajamos en parejas.|We work in pairs.|On travaille à deux.|Wir arbeiten zu zweit.|Mir schaffed z zweit.']),
    T('viaje', 'De viaje|Travelling|En voyage|Auf Reisen|Uf Reise', null, [
      '¿Dónde está la estación?|Where is the station?|Où est la gare ?|Wo ist der Bahnhof?|Wo isch de Bahnhof?', 'Un billete, por favor.|A ticket, please.|Un billet, s’il vous plaît.|Eine Fahrkarte, bitte.|Es Billett, bitte.',
      '¿Cuánto cuesta?|How much is it?|Combien ça coûte ?|Wie viel kostet das?|Was choschtet das?', '¿A qué hora sale el tren?|What time does the train leave?|À quelle heure part le train ?|Wann fährt der Zug ab?|Wänn fahrt de Zug?',
      'Tengo una reserva.|I have a booking.|J’ai une réservation.|Ich habe eine Reservierung.|Ich han e Reservation.', 'A la derecha.|On the right.|À droite.|Rechts.|Rächts.',
      'A la izquierda.|On the left.|À gauche.|Links.|Links.', 'Todo recto.|Straight on.|Tout droit.|Geradeaus.|Grad us.',
      'Estoy perdido.|I am lost.|Je suis perdu.|Ich habe mich verlaufen.|Ich ha mi verlaufe.', '¿Me ayuda, por favor?|Can you help me, please?|Vous pouvez m’aider ?|Können Sie mir helfen?|Chönd Sie mer hälfe?']),
    T('restaurante', 'En el restaurante|At the restaurant|Au restaurant|Im Restaurant|Im Restaurant', null, [
      'Una mesa para dos.|A table for two.|Une table pour deux.|Einen Tisch für zwei.|En Tisch für zwei.', 'La carta, por favor.|The menu, please.|La carte, s’il vous plaît.|Die Speisekarte, bitte.|D Charte, bitte.',
      'Soy alérgico a los frutos secos.|I am allergic to nuts.|Je suis allergique aux noix.|Ich bin allergisch gegen Nüsse.|Ich bin allergisch uf Nüss.', '¿Qué me recomienda?|What do you recommend?|Qu’est-ce que vous me conseillez ?|Was empfehlen Sie?|Was empfäled Sie?',
      'Está delicioso.|It is delicious.|C’est délicieux.|Es ist köstlich.|Es isch fein.', 'La cuenta, por favor.|The bill, please.|L’addition, s’il vous plaît.|Die Rechnung, bitte.|Zahle, bitte.',
      'Sin azúcar.|Without sugar.|Sans sucre.|Ohne Zucker.|Ohni Zucker.', 'Para llevar.|To take away.|À emporter.|Zum Mitnehmen.|Zum Mitnäh.',
      '¿Aceptan tarjeta?|Do you take cards?|Vous acceptez la carte ?|Nehmen Sie Karte?|Chan ich mit Charte zahle?', 'Buen provecho.|Enjoy your meal.|Bon appétit.|Guten Appetit.|En Guete.'])
  ];
  /* Temas de frases: el ejemplo es la propia frase dentro de un diálogo breve. */
  window.EU_IDIOMAS_PLUS.forEach(function (t) { if (!t.ej) t.pat = 'frase'; });
})();
