/* b6_cocina_unidades.js — diez técnicas más por recetario (repostería, panadería, pastelería y batidos)
   y generadores propios para cada una. Antes cada libro tenía solo dos unidades, y las 300 páginas
   repetían el mismo ejercicio de escalar la receta. «Cocina completa» recibe copia de todas (sufijo _t).
   Cargar después de b6_cerebro_cocina.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED) return;
  var H = ED.H, pick = H.pick, num = function (n, C) { return H.num(n, C); };
  var it = H.it, ent = function (r, a, b) { return a + Math.floor(r() * (b - a + 1)); };
  var F = function (c) { return Math.round(c * 9 / 5 + 32); };

  var G = {
    coc_temp: function (u, C, r) {
      var c = pick(r, [150, 160, 170, 175, 180, 190, 200, 220, 230]), f = F(c);
      return it('corta', 'Una receta de otro país pide el horno a ' + f + ' °F. ¿A cuántos °C lo pones? (redondea a la decena)', Math.round((f - 32) * 5 / 9 / 10) * 10 + ' °C', { ac: [Math.round((f - 32) * 5 / 9 / 10) * 10], x: '(' + f + ' − 32) × 5 ÷ 9 ≈ ' + Math.round((f - 32) * 5 / 9) + ' °C' });
    },
    coc_panadero: function (u, C, r) {
      var h = pick(r, [500, 750, 1000, 1500, 2000]), ing = pick(r, [['agua', [62, 65, 68, 70, 75]], ['sal', [1.8, 2]], ['levadura fresca', [1, 1.5, 2, 3]], ['aceite', [3, 5, 8]]]), p = pick(r, ing[1]), g = Math.round(h * p / 100 * 10) / 10;
      return it('corta', 'En porcentaje panadero la harina es siempre el 100 %. Si usas ' + num(h, C) + ' g de harina y la fórmula pide ' + num(p, C) + ' % de ' + ing[0] + ', ¿cuántos gramos pones?', num(g, C) + ' g', { ac: [g, num(g, C)], x: num(h, C) + ' × ' + num(p, C) + ' ÷ 100 = ' + num(g, C) + ' g' });
    },
    coc_hidrata: function (u, C, r) {
      var h = pick(r, [400, 500, 800, 1000]), p = pick(r, [60, 65, 70, 75, 80]), a = h * p / 100;
      return it('corta', 'Una masa lleva ' + num(h, C) + ' g de harina y ' + num(a, C) + ' ml de agua. ¿Cuál es su hidratación?', p + ' %', { ac: [p, p + '%', p + ' %'], x: num(a, C) + ' ÷ ' + num(h, C) + ' × 100 = ' + p + ' %' });
    },
    coc_capas: function (u, C, r) {
      var v = ent(r, 3, 6), c = Math.pow(3, v);
      return it('corta', 'En el hojaldre cada vuelta simple dobla la masa en tres. ¿Cuántas capas de masa hay después de ' + v + ' vueltas simples?', String(c), { ac: [c], x: '3 elevado a ' + v + ' = ' + c });
    },
    coc_gelatina: function (u, C, r) {
      var ml = pick(r, [250, 500, 750, 1000, 1500]), d = pick(r, [6, 8]), h = Math.round(ml / 1000 * d * 10) / 10;
      return it('corta', 'Para una crema firme se usan ' + d + ' hojas de gelatina (2 g cada una) por litro. ¿Cuántas hojas necesitas para ' + num(ml, C) + ' ml?', num(h, C), { ac: [h, num(h, C)], x: num(ml, C) + ' ÷ 1000 × ' + d + ' = ' + num(h, C) + ' hojas' });
    },
    coc_ganache: function (u, C, r) {
      var tipo = pick(r, [['para cubrir, 1 : 1', 1], ['para trufas, 2 : 1', 2], ['para montar, 1 : 2', 0.5]]), n = pick(r, [150, 200, 250, 300, 400]), ch = Math.round(n * tipo[1]);
      return it('corta', 'Una ganache ' + tipo[0] + ' (chocolate : nata). Si tienes ' + n + ' g de nata, ¿cuánto chocolate pones?', ch + ' g', { ac: [ch, ch + ' g'], x: n + ' × ' + num(tipo[1], C) + ' = ' + ch + ' g' });
    },
    coc_merma: function (u, C, r) {
      var fr = pick(r, [['piña', 45], ['mango', 35], ['plátano', 35], ['naranja', 30], ['manzana', 15], ['papaya', 30]]), b = pick(r, [500, 800, 1000, 1200, 2000]), n = Math.round(b * (100 - fr[1]) / 100);
      return it('corta', 'La ' + fr[0] + ' pierde cerca del ' + fr[1] + ' % en piel, hueso o semillas. Si compras ' + num(b, C) + ' g, ¿cuánta fruta aprovechable te queda?', num(n, C) + ' g', { ac: [n, num(n, C)], x: num(b, C) + ' × ' + (100 - fr[1]) + ' ÷ 100 = ' + num(n, C) + ' g' });
    },
    coc_vasos: function (u, C, r) {
      var v = pick(r, [250, 300, 350]), n = ent(r, 2, 8), t = v * n;
      return it('corta', 'Cada vaso de batido lleva ' + v + ' ml. ¿Cuánto líquido total preparas para ' + n + ' vasos?', num(t, C) + ' ml', { ac: [t, num(t, C)], x: v + ' × ' + n + ' = ' + num(t, C) + ' ml' });
    },
    coc_azucarlibre: function (u, C, r) {
      var kcal = pick(r, [1800, 2000, 2200, 2500]), p = pick(r, [5, 10]), g = Math.round(kcal * p / 100 / 4);
      return it('corta', 'La OMS recomienda que los azúcares libres no pasen del ' + p + ' % de la energía diaria. Con ' + num(kcal, C) + ' kcal al día y 4 kcal por gramo de azúcar, ¿cuántos gramos son como máximo?', g + ' g', { ac: [g, g + ' g'], x: num(kcal, C) + ' × ' + p + ' ÷ 100 ÷ 4 = ' + g + ' g' });
    },
    coc_tiempo: function (u, C, r) {
      var ini = ent(r, 6, 10), min = pick(r, [45, 60, 90, 120]), p = pick(r, [15, 20, 30]), t = ini * 60 + min + p, hh = Math.floor(t / 60), mm = t % 60;
      var fr = pick(r, ['Empiezas a las ' + ini + ':00. La masa fermenta ' + min + ' min y el horneado dura ' + p + ' min. ¿A qué hora sale del horno?', 'Metes la masa a reposar a las ' + ini + ':00. Necesita ' + min + ' min de reposo y ' + p + ' min de horno. ¿A qué hora estará lista?', 'Un pedido se recoge cuando termine: ' + min + ' min de preparación y ' + p + ' min de cocción, desde las ' + ini + ':00. ¿A qué hora?', 'Si comienzas a las ' + ini + ':00 y el proceso lleva ' + min + ' min más ' + p + ' min, ¿a qué hora terminas?']);
      return it('corta', fr, hh + ':' + (mm < 10 ? '0' : '') + mm, { ac: [hh + ':' + (mm < 10 ? '0' : '') + mm], x: ini + ':00 + ' + (min + p) + ' min' });
    }
  };

  var U = [
    ['reposteria', 'rep_azucar', 'Los azúcares', ['El azúcar no solo endulza: retiene agua y mantiene tierno el bizcocho.', 'El azúcar glas lleva algo de almidón y deja galletas más finas.', 'El azúcar moreno aporta humedad y un sabor a caramelo.', 'Al hornear, el azúcar se dora y da color a la corteza.'], ['sacarosa', 'azúcar glas', 'humedad', 'caramelización'], 'coc_escala'],
    ['reposteria', 'rep_huevo', 'Las funciones del huevo', ['La clara aporta estructura: sus proteínas cuajan con el calor.', 'La yema emulsiona grasa y agua gracias a la lecitina.', 'Batido, el huevo atrapa aire y ayuda a que la masa suba.', 'Los huevos a temperatura ambiente se integran mejor.'], ['clara', 'yema', 'lecitina', 'coagular'], 'coc_escala'],
    ['reposteria', 'rep_harina', 'Harinas de repostería', ['Las harinas flojas tienen poca proteína y forman poco gluten.', 'Poco gluten da bizcochos y galletas tiernos.', 'Tamizar la harina quita grumos y la airea.', 'Si mezclas de más después de añadir la harina, la masa se endurece.'], ['harina floja', 'gluten', 'tamizar', 'proteína'], 'coc_escala'],
    ['reposteria', 'rep_impulsor', 'Impulsores químicos', ['El bicarbonato necesita un ácido (yogur, limón, cacao) para soltar gas.', 'El polvo de hornear ya trae el ácido y el bicarbonato juntos.', 'El gas forma burbujas que el calor fija en la miga.', 'Demasiado impulsor da sabor metálico y hace que la masa suba y se hunda.'], ['bicarbonato', 'polvo de hornear', 'ácido', 'dióxido de carbono'], 'coc_temp'],
    ['reposteria', 'rep_bizcocho', 'El bizcocho espumoso', ['En la genovesa el volumen sale solo del aire de los huevos batidos.', 'Se baten huevos y azúcar hasta que la mezcla hace «cinta».', 'La harina se incorpora con movimientos envolventes para no perder aire.', 'Se hornea en cuanto está lista: el aire no espera.'], ['genovesa', 'punto de cinta', 'envolver', 'volumen'], 'coc_temp'],
    ['reposteria', 'rep_caramelo', 'El punto del azúcar', ['El almíbar cambia según la temperatura a la que llega.', 'Hacia 110 °C da hebra fina; hacia 118 °C, bola blanda.', 'Hacia 160–170 °C el azúcar se vuelve caramelo dorado.', 'Un termómetro de cocina evita adivinar.'], ['almíbar', 'hebra', 'bola blanda', 'caramelo'], 'coc_temp'],
    ['reposteria', 'rep_chocolate', 'Templar el chocolate', ['Templar es fundir, enfriar y recalentar el chocolate para que cristalice bien.', 'Para chocolate negro se funde a unos 45–50 °C, se baja a 27–28 °C y se sube a 31–32 °C.', 'Bien templado brilla, cruje al partirlo y no se derrite en la mano.', 'El agua es su enemiga: una gota lo espesa y lo arruina.'], ['templado', 'cristalizar', 'cobertura', 'brillo'], 'coc_temp'],
    ['reposteria', 'rep_galleta', 'Galletas: crujientes o blandas', ['Más azúcar blanco y más horno dan galletas crujientes.', 'Más azúcar moreno o miel y menos horno dan galletas blandas.', 'Enfriar la masa antes de hornear evita que se extiendan demasiado.', 'Las galletas terminan de endurecer al enfriarse sobre la rejilla.'], ['textura', 'extender', 'enfriar la masa', 'rejilla'], 'coc_tiempo'],
    ['reposteria', 'rep_higiene', 'Seguridad en el obrador', ['Las bacterias crecen deprisa entre unos 5 °C y 60 °C.', 'Las cremas con huevo y lácteos se guardan en frío y se consumen pronto.', 'Separar tablas y utensilios de crudos y cocinados evita contaminaciones.', 'Lavarse las manos antes de empezar es la primera norma.'], ['zona de peligro', 'cadena de frío', 'contaminación cruzada', 'higiene'], 'coc_tiempo'],
    ['reposteria', 'rep_conserva', 'Guardar y conservar', ['El bizcocho aguanta mejor envuelto y a temperatura ambiente.', 'Las galletas crujientes se guardan en lata; las blandas, en bote cerrado.', 'Congelar bizcochos sin decorar alarga su vida varias semanas.', 'Etiquetar con la fecha evita dudas.'], ['conservación', 'congelar', 'hermético', 'etiqueta'], 'coc_escala'],
    ['panaderia', 'pan_harina', 'La harina de pan', ['Las harinas panificables tienen más proteína: forman más gluten.', 'Más gluten atrapa más gas y da miga alveolada.', 'La harina integral conserva el salvado y absorbe más agua.', 'Cada harina pide su propia cantidad de agua.'], ['harina de fuerza', 'proteína', 'salvado', 'absorción'], 'coc_hidrata'],
    ['panaderia', 'pan_panadero', 'El porcentaje panadero', ['En panadería todo se calcula sobre la harina, que es el 100 %.', 'La sal suele rondar el 1,8–2 %.', 'Así una fórmula sirve igual para 1 kg que para 10 kg.', 'Sumar todos los porcentajes da el peso total de la masa.'], ['porcentaje panadero', 'fórmula', 'sal', 'escalar'], 'coc_panadero'],
    ['panaderia', 'pan_hidrata', 'La hidratación', ['Hidratación es el agua dividida entre la harina, en porcentaje.', 'Un pan de molde ronda el 60 %; una chapata puede pasar del 75 %.', 'Más agua da miga más abierta y masa más pegajosa.', 'Con masas húmedas se trabaja con las manos mojadas.'], ['hidratación', 'miga abierta', 'masa pegajosa', 'agua'], 'coc_hidrata'],
    ['panaderia', 'pan_madre', 'La masa madre', ['La masa madre es harina y agua fermentadas por levaduras y bacterias salvajes.', 'Las bacterias producen ácidos que dan sabor y conservan el pan.', 'Se alimenta con harina y agua para mantenerla activa.', 'Fermenta más despacio que la levadura comercial.'], ['masa madre', 'fermentación', 'refresco', 'acidez'], 'coc_tiempo'],
    ['panaderia', 'pan_prefermento', 'Poolish y biga', ['Un prefermento es una parte de la masa que fermenta antes.', 'El poolish lleva el mismo peso de agua que de harina.', 'La biga es más firme, con menos agua.', 'Ambos dan más aroma y un pan que dura más tierno.'], ['poolish', 'biga', 'prefermento', 'aroma'], 'coc_panadero'],
    ['panaderia', 'pan_formado', 'Bolear y formar', ['Bolear es tensar la masa en una bola para que retenga el gas.', 'Tras un reposo, el gluten se relaja y la masa se deja formar.', 'Una buena tensión exterior da un pan que crece hacia arriba.', 'La harina justa en la mesa: demasiada impide el sellado.'], ['bolear', 'tensión', 'reposo', 'formado'], 'coc_tiempo'],
    ['panaderia', 'pan_greñado', 'El corte o greñado', ['El corte controla por dónde se abre el pan en el horno.', 'Se hace con una cuchilla, rápido y en ángulo.', 'Un corte poco profundo da una «oreja» marcada.', 'Sin corte, el pan se rompe por donde quiere.'], ['greñado', 'cuchilla', 'oreja', 'expansión'], 'coc_temp'],
    ['panaderia', 'pan_vapor', 'Vapor y corteza', ['El vapor de los primeros minutos mantiene blanda la superficie.', 'Así el pan crece más antes de que se forme la corteza.', 'Después se retira el vapor para que la corteza se dore y cruja.', 'Una bandeja con agua o una olla tapada imitan el horno de panadería.'], ['vapor', 'corteza', 'horneado', 'dorar'], 'coc_temp'],
    ['panaderia', 'pan_fermentar', 'Tiempos de fermentación', ['La masa está lista cuando casi dobla su volumen.', 'Al presionarla con el dedo, la marca vuelve despacio.', 'En frío la fermentación es lenta y da más sabor.', 'Pasarse de fermentación deja un pan plano y ácido.'], ['fermentar', 'volumen', 'prueba del dedo', 'frío'], 'coc_tiempo'],
    ['panaderia', 'pan_guardar', 'Por qué se endurece el pan', ['El pan se pone duro porque el almidón se recristaliza: es la retrogradación.', 'En la nevera ocurre más deprisa que a temperatura ambiente.', 'Congelado en rebanadas se conserva bien semanas.', 'Un golpe de horno devuelve parte de la textura.'], ['retrogradación', 'almidón', 'congelar', 'textura'], 'coc_panadero'],
    ['pasteleria', 'pas_hojaldre', 'El hojaldre', ['El hojaldre alterna capas de masa y de mantequilla.', 'Cada vuelta simple dobla la masa en tres y multiplica las capas.', 'En el horno el agua de la mantequilla se hace vapor y separa las capas.', 'Todo debe estar frío: si la mantequilla se funde, no sube.'], ['laminado', 'vuelta simple', 'capas', 'vapor'], 'coc_capas'],
    ['pasteleria', 'pas_choux', 'La masa choux', ['La choux se cuece primero en el cazo: agua, grasa y harina.', 'Después se añaden los huevos poco a poco hasta que la masa cae en pico.', 'En el horno el vapor la hincha y deja el interior hueco.', 'Abrir el horno antes de tiempo la hunde.'], ['choux', 'panada', 'profiteroles', 'vapor'], 'coc_temp'],
    ['pasteleria', 'pas_gelatina', 'La gelatina', ['La gelatina en hoja se hidrata en agua fría unos minutos.', 'Se escurre y se disuelve en una parte caliente de la mezcla.', 'Nunca debe hervir: pierde fuerza.', 'Cuaja en frío, en varias horas de nevera.'], ['gelatina', 'hidratar', 'cuajar', 'hoja'], 'coc_gelatina'],
    ['pasteleria', 'pas_mousse', 'Mousses', ['Una mousse une una base con sabor, un gelificante y algo aireado.', 'La nata se monta a medio punto para que se integre sin cortarse.', 'Se mezcla con movimientos envolventes.', 'La base no debe estar caliente al añadir la nata.'], ['mousse', 'semimontada', 'envolver', 'aireado'], 'coc_gelatina'],
    ['pasteleria', 'pas_ganache', 'La ganache', ['La ganache es una emulsión de chocolate y nata caliente.', 'La proporción marca la textura: 1 : 1 para cubrir, 2 : 1 para trufas.', 'Se mezcla desde el centro para formar una emulsión brillante.', 'Montada en frío se vuelve ligera.'], ['ganache', 'emulsión', 'proporción', 'trufa'], 'coc_ganache'],
    ['pasteleria', 'pas_glaseado', 'Glaseados y coberturas', ['Un glaseado espejo se aplica tibio, hacia 30–35 °C, sobre una pieza congelada.', 'El fondant da un acabado liso y mate.', 'El glaseado real de clara y azúcar endurece al secar.', 'Una rejilla y una bandeja debajo recogen lo que sobra.'], ['glaseado espejo', 'fondant', 'glasa real', 'cobertura'], 'coc_temp'],
    ['pasteleria', 'pas_montaje', 'Montar una tarta en capas', ['Un entremet combina bizcocho, mousse, inserto y cobertura.', 'Se monta en aro, casi siempre del revés.', 'Cada capa debe estar fría antes de añadir la siguiente.', 'El acetato en el aro da laterales limpios.'], ['entremet', 'aro', 'inserto', 'acetato'], 'coc_gelatina'],
    ['pasteleria', 'pas_fruta', 'Fruta en pastelería', ['La fruta aporta acidez que equilibra el dulce.', 'Las compotas espesan por la pectina de la propia fruta.', 'La fruta cruda con enzimas, como la piña o el kiwi, impide cuajar la gelatina.', 'Cocinarla antes desactiva esas enzimas.'], ['pectina', 'compota', 'enzimas', 'acidez'], 'coc_merma'],
    ['pasteleria', 'pas_manga', 'Manga y boquillas', ['La manga se llena hasta la mitad y se cierra girando.', 'La boquilla lisa sirve para choux y merengues; la rizada, para decorar.', 'La presión constante da formas iguales.', 'Practicar sobre papel antes de decorar ahorra producto.'], ['manga pastelera', 'boquilla', 'presión', 'decorar'], 'coc_ganache'],
    ['pasteleria', 'pas_frio', 'El frío en pastelería', ['El abatidor enfría rápido y evita cristales grandes de hielo.', 'Las piezas con nata y huevo no se dejan a temperatura ambiente.', 'Descongelar en la nevera mantiene la textura.', 'Tapar evita que absorban olores.'], ['abatidor', 'congelar', 'descongelar', 'cadena de frío'], 'coc_tiempo'],
    ['batidos', 'bat_proteina', 'Proteína en el batido', ['La proteína da saciedad y ayuda a reparar el músculo.', 'Yogur, leche, kéfir, tofu sedoso o bebida de soja la aportan.', 'Los frutos secos y las semillas suman proteína y grasa buena.', 'Con un vaso de leche o un yogur ya hay una buena base.'], ['proteína', 'saciedad', 'yogur', 'semillas'], 'coc_vasos'],
    ['batidos', 'bat_fibra', 'Fruta entera frente a zumo', ['En el batido la fruta entera conserva su fibra.', 'La fibra hace que el azúcar pase a la sangre más despacio.', 'Colar el batido le quita parte de esa fibra.', 'Piel comestible, como la de la manzana, suma más fibra.'], ['fibra', 'fruta entera', 'zumo', 'saciedad'], 'coc_merma'],
    ['batidos', 'bat_azucar', 'Azúcares libres', ['Los azúcares libres son los añadidos más los de miel, siropes y zumos.', 'La OMS recomienda menos del 10 % de la energía diaria, y mejor menos del 5 %.', 'La fruta madura ya endulza: no hace falta añadir azúcar.', 'Plátano, dátil o mango sustituyen al azúcar.'], ['azúcares libres', 'OMS', 'endulzar', 'fruta madura'], 'coc_azucarlibre'],
    ['batidos', 'bat_liquido', 'El líquido base', ['El líquido marca la textura y el sabor final.', 'Agua o infusión dan batidos ligeros; leche o bebida vegetal, cremosos.', 'El kéfir aporta acidez y fermentos.', 'Empieza con poco líquido: siempre puedes añadir más.'], ['líquido', 'bebida vegetal', 'kéfir', 'textura'], 'coc_vasos'],
    ['batidos', 'bat_verde', 'Batidos verdes', ['La espinaca tierna casi no se nota; la col rizada tiene sabor fuerte.', 'Una fruta dulce equilibra el amargor de las hojas.', 'Se tritura primero la hoja con el líquido para que no queden hebras.', 'El limón mantiene el color verde vivo.'], ['espinaca', 'col rizada', 'amargor', 'triturar'], 'coc_merma'],
    ['batidos', 'bat_congelar', 'Fruta congelada', ['Congelar la fruta madura en trozos evita tirarla.', 'Da textura de helado sin necesidad de hielo.', 'Se congela extendida en bandeja para que no se pegue.', 'En bolsas por porción, cada batido está listo en un minuto.'], ['congelar', 'porción', 'textura', 'aprovechar'], 'coc_merma'],
    ['batidos', 'bat_textura', 'Espesar sin azúcar', ['El plátano, la avena o el aguacate dan cuerpo al batido.', 'Las semillas de chía absorben líquido y espesan en minutos.', 'El yogur griego da cremosidad y proteína.', 'Más fruta congelada y menos líquido dan un batido de cuchara.'], ['espesar', 'chía', 'avena', 'cremosidad'], 'coc_vasos'],
    ['batidos', 'bat_porcion', 'El tamaño del vaso', ['Una ración razonable de batido ronda los 250–350 ml.', 'Un vaso grande puede tener tanta energía como una comida.', 'Medir el vaso una vez ayuda a calcular siempre igual.', 'Para niños basta medio vaso.'], ['ración', 'mililitros', 'energía', 'medir'], 'coc_vasos'],
    ['batidos', 'bat_seguro', 'Higiene del batido', ['Lavar la fruta y la verdura antes de cortarlas, aunque se pelen.', 'El batido se toma recién hecho o se guarda tapado en frío.', 'Pierde color y vitaminas con las horas.', 'La batidora se lava enseguida, antes de que se seque.'], ['lavar', 'nevera', 'oxidación', 'vitaminas'], 'coc_tiempo'],
    ['batidos', 'bat_etiqueta', 'Leer la etiqueta', ['La etiqueta indica energía, azúcares, proteína y fibra por cada 100 ml.', 'Los ingredientes van ordenados de más a menos cantidad.', 'Si el azúcar aparece entre los primeros, el producto es muy dulce.', 'Comparar por 100 ml permite comparar marcas distintas.'], ['etiqueta', 'por 100 ml', 'ingredientes', 'comparar'], 'coc_azucarlibre']
  ];
  var BANDAS = ['inf', 'pri1', 'pri2', 'pri3', 'sec', 'bach', 'fp', 'adu'];
  var UNI = U.map(function (a) { return { cat: a[0], m: a[0], id: a[1], t: a[2], i: a[3], k: a[4], g: a[5], b: BANDAS }; });
  UNI = UNI.concat(UNI.map(function (u) { return Object.assign({}, u, { m: 'cocina', id: u.id + '_t' }); }));
  ED.registrar({ unidades: UNI, generadores: G });
  window.EU_COCINA_UNIDADES = { U: UNI, GEN: G };
})();
