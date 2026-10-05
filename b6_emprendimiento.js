/* b6_emprendimiento.js — materia «Emprendimiento» (window.EU_EMPRE).
   · 10 unidades comunes con generadores de proceso y respuesta (costos, precio, margen,
     punto de equilibrio, flujo de caja, recuperación de la inversión, IVA del país) y una
     unidad por país con forma legal, trámites, impuestos y ayudas (revisión: septiembre 2026).
   · Catálogo IDEAS: 9 negocios artesanales (piñatas, velas, jabones, bisutería, crochet,
     globos, cerámica, costura, madera y reciclaje) y 8 oficios (salón, panadería, repostería,
     juguería, comida, tienda, clases, reparaciones). Cada idea: inversión detallada, costo por
     unidad, precio, horas, producción, gastos fijos → ganancia mensual, punto de equilibrio,
     meses para recuperar la inversión, ganancia por hora y ranking de rentabilidad.
     Los importes se convierten a la moneda de cada país con un factor de precios orientativo.
   · Productos: «Cómo emprender en {país}» (guía con fichas de negocio e infografías),
     «Mi plan de negocio» (cuaderno calculado para las ideas elegidas) y «Pitch» (12 diapositivas).
   · En la vista web cada ficha trae una calculadora: al cambiar precio, costo o ventas
     se recalculan ganancia, punto de equilibrio y recuperación (EU_EMPRE.calc).
   Cargar después de b6_geometria_visual.js. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL, CU = window.EU_CURRICULO;
  if (!ED || !CU || window.EU_EMPRE) return;
  var H = ED.H, esc = H.esc, it = H.it, E = H.ent, NS = 'xmlns="http://www.w3.org/2000/svg"';
  var REVISION = 'septiembre de 2026';

  /* ─────────── moneda: factor orientativo de precios respecto a España (EUR) ─────────── */
  var FX = { es: 1, mx: 20, co: 4300, ar: 1300, cl: 1000, ve: 150, do: 65, us: 1.1 };
  function fx(C) { return FX[C.pk] || 1; }
  /* Venezuela: importes locales en dólares, convertidos a una tasa de referencia (Bs por USD) */
  var TASA_VE = Math.round(FX.ve / 1.1);
  function tasa(C) { var t = C && C.op && parseFloat(C.op.tasa); return t > 0 ? t : TASA_VE; }
  function convLoc(v, C) { return C.pk === 've' ? v * tasa(C) : v; }
  var ZONA = { es: 'Madrid y Valencia', mx: 'CDMX, Puebla y Guadalajara', co: 'Bogotá y Medellín', ar: 'CABA y Córdoba', cl: 'Santiago y Valparaíso', ve: 'Caracas y Maracaibo', do: 'Santo Domingo y Santiago', us: 'comunidades hispanas de Texas, Florida y California' };
  /* Negocios artesanales con importes locales orientativos (moneda del país; VE en USD):
     [inversión inicial, costo de materiales por unidad, precio de venta, gastos fijos al mes] */
  var LOCAL = {
    es: { velas: [520, 3.2, 16, 90], bisuteria: [330, 2.6, 18, 70], ceramica: [1400, 3.2, 22, 140], madera: [700, 11, 85, 110] },
    mx: { pinatas: [3500, 90, 450, 900], velas: [4800, 55, 220, 1100], bisuteria: [3200, 35, 180, 800], ceramica: [22000, 60, 280, 1800] },
    co: { pinatas: [450000, 14000, 70000, 180000], velas: [700000, 9000, 38000, 200000], crochet: [300000, 12000, 75000, 90000], madera: [1600000, 45000, 250000, 300000] },
    ar: { velas: [180000, 3200, 14000, 60000], bisuteria: [150000, 2200, 12000, 50000], crochet: [90000, 4500, 28000, 30000], ceramica: [1500000, 3500, 18000, 120000] },
    cl: { velas: [150000, 2800, 12990, 45000], jabones: [130000, 1400, 5500, 35000], bisuteria: [120000, 1800, 9990, 40000], ceramica: [1100000, 2800, 16000, 90000] },
    ve: { pinatas: [90, 3, 18, 25], velas: [120, 2.2, 9, 25], bisuteria: [80, 1.5, 8, 20], costura: [350, 3, 15, 30] },
    do: { pinatas: [12000, 300, 1800, 3000], velas: [15000, 170, 750, 3500], bisuteria: [9000, 110, 650, 2500], globos: [28000, 2200, 8500, 5000] },
    us: { velas: [450, 5.5, 26, 90], bisuteria: [350, 3.5, 30, 70], ceramica: [2600, 5, 38, 180], madera: [1300, 25, 180, 150] }
  };
  /* Salario mínimo mensual de referencia (VE en USD) — revisión septiembre 2026 */
  var SMI = {
    es: [1424.5, 'SMI 2026: 1.221 € al mes en 14 pagas (17.094 € al año), Real Decreto 126/2026. Prorrateado en 12 meses son 1.424,50 €.'],
    mx: [9451, 'Salario mínimo 2026: 315,04 MXN diarios en la zona general y 440,87 en la Zona Libre de la Frontera Norte (unos 9.451 al mes de 30 días).'],
    co: [1750905, 'SMMLV 2026: 1.750.905 COP al mes, más 249.095 de auxilio de transporte cuando corresponde.'],
    ar: [376600, 'Salario Mínimo, Vital y Móvil de agosto de 2026: $376.600 al mes por jornada completa (Resolución 9/2025).'],
    cl: [553553, 'Ingreso mínimo mensual desde el 1 de mayo de 2026: $553.553 para trabajadores de 18 a 65 años (Ley 21.830).'],
    ve: [240, 'Ingreso mínimo integral de 240 USD al mes pagados en bolívares desde mayo de 2026 (bonos incluidos); el salario mínimo legal sigue en 130 Bs.'],
    do: [18421.2, 'Sector privado no sectorizado desde febrero de 2026: RD$16.993,20 (micro), RD$18.421,20 (pequeña), RD$27.489,60 (mediana) y RD$29.988 (grande).'],
    us: [1257, 'Mínimo federal de 7,25 USD por hora (unos 1.257 al mes a 40 horas semanales); muchos estados y ciudades fijan uno más alto.']
  };
  function smi(C) { var s = SMI[C.pk] || SMI.es; return { v: Math.round(convLoc(s[0], C)), t: s[1] }; }
  function bonito(v) { if (v <= 0) return 0; var p = Math.pow(10, Math.max(0, Math.floor(Math.log10(v)) - 1)); var x = Math.round(v / p) * p; return v < 10 ? Math.round(v * 10) / 10 : x; }
  function mon(eur, C) { return bonito(eur * fx(C)); }
  function $(v, C) { return H.din(v, C); }
  function nf(n) { return String(Math.round(n * 10) / 10).replace('.', ','); }

  /* ─────────── catálogo de ideas (importes base en EUR) ───────────
     inv: [[concepto, €]] · mat: [[material por unidad, €]] · p: precio · h: horas/unidad
     q: unidades al mes · fijos: [[gasto mensual, €]] · u: nombre de la unidad vendida */
  var IDEAS = [
    { id: 'pinatas', g: 'artesanal', n: 'Piñatas personalizadas', u: 'piñata', ico: 'estrella', d: 'Piñatas temáticas por encargo para cumpleaños, con el personaje o la forma que pide el cliente.',
      inv: [['Pistola de silicona, cúter y tijeras', 45], ['Moldes y estructuras de cartón', 40], ['Papel crepé, china y metalizado (stock inicial)', 90], ['Pinturas y pegamento', 35], ['Fotos y catálogo en redes', 40]],
      mat: [['Cartón y engrudo', 1.5], ['Papel decorativo', 3], ['Cinta, adornos y cuerda', 1.5]], p: 25, h: 2.5, q: 60, fijos: [['Internet y teléfono', 30], ['Transporte de entregas', 30]],
      pasos: ['Elige 5 modelos base y fotografíalos bien', 'Calcula el costo de cada tamaño', 'Publica un catálogo con precios en redes y grupos del barrio', 'Pide un anticipo del 50 % en los encargos', 'Ofrece paquete piñata + dulces + sorpresas para subir el ticket'],
      vender: ['Redes sociales y mensajería', 'Tiendas de fiestas (a consignación)', 'Colegios y guarderías'], riesgo: 'Trabajo manual lento: sube el precio de los modelos personalizados o trabaja con moldes repetibles.' },
    { id: 'velas', g: 'artesanal', n: 'Velas aromáticas de soja', u: 'vela', ico: 'vela', d: 'Velas en tarro de vidrio con cera de soja y esencias, para regalo y decoración.',
      inv: [['Fundidor y termómetro', 60], ['Moldes y tarros (primer lote)', 110], ['Cera de soja (10 kg)', 90], ['Esencias y mechas', 80], ['Etiquetas y cajas', 60]],
      mat: [['Cera', 1.2], ['Tarro de vidrio', .9], ['Esencia y mecha', .6], ['Etiqueta y caja', .3]], p: 14, h: .4, q: 200, fijos: [['Luz y gas', 25], ['Tienda en línea', 25], ['Publicidad', 30]],
      pasos: ['Prueba 3 aromas y anota tiempos de enfriado', 'Diseña una etiqueta con tu marca', 'Haz un lote de 50 y véndelo a conocidos', 'Ofrece packs de regalo en fechas señaladas', 'Busca tiendas de decoración que las revendan'],
      vender: ['Mercados artesanales', 'Tiendas de regalos y decoración', 'Venta en línea y regalos de empresa'], riesgo: 'Cera y vidrio frágil: calcula roturas (5 %) y usa cajas con relleno.' },
    { id: 'jabones', g: 'artesanal', n: 'Jabones artesanales', u: 'jabón', ico: 'jabon', d: 'Jabones de glicerina y proceso en frío con aceites vegetales, avena, miel o plantas.',
      inv: [['Moldes de silicona', 50], ['Báscula de precisión y utensilios', 60], ['Base de glicerina y aceites', 110], ['Aceites esenciales y colorantes', 70], ['Empaque y etiquetas', 60]],
      mat: [['Base y aceites', .8], ['Esencia y aditivos', .4], ['Empaque', .3]], p: 6, h: .25, q: 300, fijos: [['Luz y agua', 20], ['Tienda en línea', 25], ['Publicidad', 25]],
      pasos: ['Empieza con glicerina (más sencillo y seguro)', 'Define una línea: calmante, exfoliante, infantil', 'Revisa la norma de cosméticos de tu país antes de vender', 'Vende en packs de 3', 'Ofrece jabones para hoteles y bodas'],
      vender: ['Mercados y ferias', 'Peluquerías y spas', 'Hoteles, bodas y detalles'], riesgo: 'Cosmética: cumple la normativa de etiquetado e ingredientes de tu país.' },
    { id: 'bisuteria', g: 'artesanal', n: 'Bisutería y accesorios', u: 'pieza', ico: 'collar', d: 'Pendientes, pulseras y collares con cuentas, resina, macramé o alambre.',
      inv: [['Alicates y herramientas', 40], ['Cuentas, cierres y alambre', 120], ['Expositor y bolsitas', 60], ['Resina y moldes', 50], ['Fotos para el catálogo', 30]],
      mat: [['Cuentas y piezas', 1.5], ['Cierres y alambre', .6], ['Bolsita y tarjeta', .4]], p: 15, h: .6, q: 150, fijos: [['Puesto en mercado', 40], ['Publicidad', 20]],
      pasos: ['Crea una colección de 12 piezas con un estilo propio', 'Fotografíalas con luz natural', 'Pon precio por colección, no pieza a pieza', 'Lanza novedades cada mes', 'Ofrece personalización con iniciales'],
      vender: ['Redes sociales', 'Ferias y mercados', 'Boutiques a consignación'], riesgo: 'Mucha competencia barata: diferencia con diseño y buena presentación.' },
    { id: 'crochet', g: 'artesanal', n: 'Tejido y crochet (amigurumis)', u: 'muñeco', ico: 'ovillo', d: 'Muñecos, mantas y accesorios tejidos a mano por encargo.',
      inv: [['Agujas y marcadores', 20], ['Lanas y algodones (stock)', 70], ['Relleno y ojos de seguridad', 20], ['Etiquetas', 10]],
      mat: [['Hilo de algodón', 2.5], ['Relleno y ojos', 1], ['Bolsa y etiqueta', .5]], p: 25, h: 5, q: 30, fijos: [['Internet', 20], ['Publicidad', 10]],
      pasos: ['Domina 3 patrones y cronometra cada uno', 'Cobra las horas: el hilo es lo barato', 'Vende por encargo con anticipo', 'Ofrece patrones digitales (sin coste de material)', 'Imparte talleres para multiplicar ingresos'],
      vender: ['Redes y mensajería', 'Tiendas de bebés', 'Talleres presenciales y en línea'], riesgo: 'Muchas horas por pieza: la ganancia por hora es baja si no subes precio o vendes patrones y talleres.' },
    { id: 'globos', g: 'artesanal', n: 'Decoración de fiestas con globos', u: 'evento', ico: 'globo', d: 'Arcos, columnas y fondos de globos para cumpleaños, bodas y empresas.',
      inv: [['Infladora eléctrica', 60], ['Estructuras y bases', 150], ['Globos y cintas (stock)', 150], ['Fondos y telas', 90], ['Catálogo y fotos', 50]],
      mat: [['Globos', 18], ['Cintas y cinta de doble cara', 5], ['Transporte', 12]], p: 120, h: 3, q: 20, fijos: [['Teléfono e internet', 30], ['Publicidad', 50], ['Almacenaje', 20]],
      pasos: ['Monta 3 decoraciones de muestra y fotografíalas', 'Crea paquetes: básico, medio y premium', 'Colabora con salones de fiestas y pastelerías', 'Cobra desmontaje y transporte aparte', 'Ofrece alquiler de estructuras'],
      vender: ['Salones de eventos', 'Redes sociales', 'Empresas y colegios'], riesgo: 'Demanda por temporadas: guarda parte de la ganancia de los meses fuertes.' },
    { id: 'ceramica', g: 'artesanal', n: 'Cerámica y macetas de arcilla', u: 'pieza', ico: 'maceta', d: 'Tazas, macetas y platos de cerámica hechos a mano y esmaltados.',
      inv: [['Horno cerámico pequeño', 800], ['Torno o herramientas de modelado', 180], ['Arcilla y esmaltes', 120], ['Estanterías de secado', 100]],
      mat: [['Arcilla', 1.2], ['Esmalte', .9], ['Electricidad del horno', .9]], p: 18, h: .8, q: 120, fijos: [['Luz', 60], ['Alquiler de espacio', 40], ['Publicidad', 20]],
      pasos: ['Empieza alquilando horno en un taller', 'Diseña una línea de 4 piezas', 'Vende a cafeterías y viveros', 'Organiza talleres de fin de semana', 'Compra tu horno cuando tengas pedidos fijos'],
      vender: ['Viveros y floristerías', 'Cafeterías y restaurantes', 'Talleres para adultos'], riesgo: 'Inversión alta en el horno: se puede empezar alquilando horas en un taller.' },
    { id: 'costura', g: 'artesanal', n: 'Costura: arreglos y bolsos de tela', u: 'trabajo', ico: 'tijeras', d: 'Arreglos de ropa, bolsos de tela y uniformes por encargo.',
      inv: [['Máquina de coser', 250], ['Mesa de corte y plancha', 80], ['Telas e hilos (stock)', 80], ['Herramientas', 40]],
      mat: [['Tela', 2.5], ['Hilo, cremallera y botones', 1], ['Etiqueta', .5]], p: 22, h: 1.5, q: 70, fijos: [['Luz', 20], ['Publicidad', 20], ['Mantenimiento de máquina', 20]],
      pasos: ['Ofrece arreglos en el barrio (entrada rápida de dinero)', 'Diseña 3 modelos de bolso', 'Vende uniformes a colegios y empresas', 'Aprovecha retales en productos pequeños', 'Imparte clases de costura básica'],
      vender: ['Vecinos y tintorerías', 'Colegios y empresas (uniformes)', 'Mercados'], riesgo: 'Precio bajo en arreglos: combina con productos propios de mayor margen.' },
    { id: 'madera', g: 'artesanal', n: 'Muebles con madera reciclada', u: 'mueble', ico: 'palet', d: 'Mesas, estanterías y maceteros con palets y madera recuperada.',
      inv: [['Taladro, lijadora y sierra', 320], ['Sargentos y herramientas', 90], ['Barniz y pinturas', 70], ['Tornillería', 40], ['Transporte inicial', 80]],
      mat: [['Madera y palets', 3], ['Tornillos y herrajes', 3], ['Barniz y lija', 4]], p: 60, h: 4, q: 25, fijos: [['Espacio de taller', 60], ['Publicidad', 30]],
      pasos: ['Consigue palets gratis en comercios y obras', 'Fabrica 3 piezas estrella y fotografíalas', 'Vende por redes y a cafeterías', 'Ofrece muebles a medida', 'Crea talleres de reciclaje para colegios'],
      vender: ['Cafeterías, hostales y terrazas', 'Redes y portales de segunda mano', 'Ferias de diseño'], riesgo: 'Madera tratada: usa palets con sello HT (tratamiento térmico), nunca MB (químico).' },
    { id: 'salon', g: 'oficio', n: 'Salón de peluquería de barrio', u: 'servicio', ico: 'tijeras', d: 'Corte, color y peinado con 2 puestos en local pequeño.',
      inv: [['Acondicionamiento del local', 4500], ['2 sillones y 1 lavacabezas', 2600], ['Secadores, planchas y herramientas', 1200], ['Productos iniciales', 1500], ['Licencias y permisos', 1200], ['Rótulo y publicidad inicial', 1000]],
      mat: [['Productos por servicio', 2.2], ['Toallas y lavandería', .5], ['Agua y luz por servicio', .3]], p: 18, h: .75, q: 350, fijos: [['Alquiler', 900], ['Suministros', 250], ['Seguros y gestoría', 200], ['Seguridad social propia', 350], ['Publicidad', 100]],
      pasos: ['Estudia la zona: cuántos salones y qué precios hay', 'Calcula tus servicios estrella y su tiempo', 'Define horario y sistema de citas', 'Crea bonos para clientes fijos', 'Vende productos de cuidado (margen extra)'],
      vender: ['Clientela del barrio', 'Citas por mensajería y redes', 'Novias y eventos'], riesgo: 'Gastos fijos altos: calcula cuántos servicios a la semana necesitas para cubrirlos antes de firmar el alquiler.' },
    { id: 'panaderia', g: 'oficio', n: 'Panadería de barrio', u: 'pieza', ico: 'pan', d: 'Pan del día, bollería y pedidos para restaurantes.',
      inv: [['Horno y amasadora', 8000], ['Mesa, estanterías y vitrina', 2500], ['Obra y permisos sanitarios', 3000], ['Materia prima inicial', 800], ['Rótulo y publicidad', 700]],
      mat: [['Harina, levadura y sal', .18], ['Energía del horno', .08], ['Bolsa', .04]], p: 1.2, h: .01, q: 4500, fijos: [['Alquiler', 900], ['Luz y gas', 450], ['Seguros y gestoría', 200], ['Ayudante a media jornada', 700], ['Seguridad social propia', 350]],
      pasos: ['Define 5 panes estrella y su receta exacta', 'Calcula el costo por pieza', 'Consigue 3 restaurantes con pedido diario', 'Abre temprano y ofrece desayuno', 'Añade bollería de fin de semana'],
      vender: ['Venta en mostrador', 'Restaurantes y cafeterías', 'Pedidos por encargo'], riesgo: 'Margen por pieza pequeño: el negocio depende del volumen diario.' },
    { id: 'reposteria', g: 'oficio', n: 'Repostería por encargo', u: 'tarta', ico: 'tarta', d: 'Tartas de cumpleaños, cupcakes y mesas dulces desde un obrador pequeño.',
      inv: [['Batidora y moldes', 350], ['Horno doméstico de calidad', 600], ['Utensilios y decoración', 200], ['Curso de manipulación de alimentos', 100], ['Cajas y fotos', 250]],
      mat: [['Ingredientes', 8], ['Decoración', 2.5], ['Caja', 1.5]], p: 40, h: 3, q: 40, fijos: [['Luz y gas', 50], ['Publicidad', 50], ['Registro sanitario', 50]],
      pasos: ['Consulta si tu país permite obrador en casa', 'Crea una carta con 6 tartas y precios por ración', 'Pide anticipo', 'Colabora con decoradores de globos y salones', 'Ofrece cursos de decoración'],
      vender: ['Redes sociales', 'Cafeterías', 'Eventos y empresas'], riesgo: 'Registro sanitario obligatorio para vender alimentos: consúltalo antes de empezar.' },
    { id: 'jugueria', g: 'oficio', n: 'Juguería y batidos', u: 'vaso', ico: 'vaso', d: 'Batidos, jugos naturales y bowls en un puesto o local pequeño.',
      inv: [['2 licuadoras industriales', 700], ['Nevera y mostrador', 1300], ['Adecuación del puesto', 700], ['Vasos y primera compra', 300]],
      mat: [['Fruta y base', .9], ['Vaso, tapa y pajita', .3]], p: 4, h: .08, q: 1500, fijos: [['Alquiler del puesto', 700], ['Luz y agua', 150], ['Seguridad social propia', 350], ['Publicidad', 80]],
      pasos: ['Ubícate junto a gimnasios, oficinas o colegios', 'Carta corta: 8 batidos y 3 bowls', 'Compra fruta de temporada al por mayor', 'Crea tarjeta de fidelidad', 'Vende por aplicaciones de reparto'],
      vender: ['Venta directa', 'Gimnasios', 'Aplicaciones de reparto'], riesgo: 'La fruta se estropea: compra 2–3 veces por semana y aprovecha la madura en batidos.' },
    { id: 'comida', g: 'oficio', n: 'Comida casera para llevar', u: 'menú', ico: 'plato', d: 'Menú del día en tarrinas para oficinas y familias.',
      inv: [['Ollas, sartenes y utensilios', 300], ['Nevera y congelador', 500], ['Tarrinas y bolsas', 150], ['Curso y registro sanitario', 250]],
      mat: [['Ingredientes', 2.4], ['Envase', .4], ['Gas', .2]], p: 7.5, h: .15, q: 600, fijos: [['Luz y gas', 90], ['Reparto', 200], ['Publicidad', 60], ['Registro sanitario', 50]],
      pasos: ['Menú semanal cerrado: compra más barata', 'Toma pedidos hasta las 10 de la mañana', 'Reparte en un solo recorrido', 'Ofrece abono semanal', 'Añade postres y bebidas'],
      vender: ['Oficinas y comercios', 'Grupos de mensajería', 'Aplicaciones de reparto'], riesgo: 'Seguridad alimentaria: cadena de frío y registro sanitario.' },
    { id: 'tienda', g: 'oficio', n: 'Tienda de barrio', u: 'venta', ico: 'bolsa', d: 'Tienda de conveniencia con productos básicos y horario amplio.',
      inv: [['Estanterías y mostrador', 2000], ['Nevera y congelador', 1800], ['Primer inventario', 3000], ['Caja registradora y datáfono', 500], ['Licencias', 700]],
      mat: [['Costo de la mercancía vendida', 7]], p: 10, h: .05, q: 1500, fijos: [['Alquiler', 800], ['Luz', 250], ['Seguridad social propia', 350], ['Gestoría', 100]],
      pasos: ['Elige una calle con paso de gente', 'Compra a mayoristas y compara', 'Controla inventario semanal', 'Amplía horario los fines de semana', 'Añade servicios: recargas, pagos, paquetería'],
      vender: ['Vecinos', 'Pedidos por mensajería', 'Servicios de pago de facturas'], riesgo: 'Margen pequeño (en torno al 30 %) y mucho inventario inmovilizado.' },
    { id: 'clases', g: 'oficio', n: 'Clases particulares', u: 'hora', ico: 'libro', d: 'Refuerzo escolar, idiomas o música en casa o en línea.',
      inv: [['Pizarra y material', 60], ['Cámara y micrófono para clases en línea', 70], ['Publicidad inicial', 20]],
      mat: [['Material por clase', .5]], p: 15, h: 1, q: 60, fijos: [['Internet', 25], ['Plataforma de videollamada', 10]],
      pasos: ['Define materias y edades', 'Prepara una clase de prueba gratuita', 'Ofrece bonos de 8 clases', 'Da clases en grupo pequeño (más ingreso por hora)', 'Crea material propio que puedas vender'],
      vender: ['Familias del colegio', 'Plataformas en línea', 'Academias'], riesgo: 'Ingresos por temporadas: los exámenes concentran la demanda.' },
    { id: 'reparaciones', g: 'oficio', n: 'Reparación de móviles y electrónica', u: 'reparación', ico: 'movil', d: 'Cambio de pantallas, baterías y puertos de carga.',
      inv: [['Kit de destornilladores y estación de soldadura', 250], ['Pantallas y baterías (stock)', 400], ['Lupa y alfombrilla antiestática', 80], ['Publicidad', 70]],
      mat: [['Repuesto medio', 7], ['Consumibles', 1]], p: 35, h: 1.2, q: 60, fijos: [['Puesto o local compartido', 60], ['Internet', 20]],
      pasos: ['Especialízate en 3 modelos populares', 'Compra repuestos con garantía', 'Da presupuesto antes de reparar', 'Ofrece 3 meses de garantía', 'Vende fundas y protectores'],
      vender: ['Barrio y comercios', 'Redes y mapas en línea', 'Empresas con flotas de móviles'], riesgo: 'Repuestos de mala calidad generan devoluciones: compra a proveedores fiables.' }
  ];
  var G_N = { artesanal: 'Negocios artesanales', oficio: 'Oficios y comercios' };

  function pl(I) { return /ón$/.test(I.u) ? I.u.replace(/ón$/, 'ones') : /ú$/.test(I.u) ? I.u + 's' : I.u + 's'; }
  function escala(arr, total) { var s = arr.reduce(function (a, x) { return a + x[1]; }, 0) || 1; return arr.map(function (x) { return [x[0], bonito(x[1] / s * total)]; }); }
  function calcular(I, C) {
    var L = (LOCAL[C.pk] || {})[I.id], inv, mat, fij, P;
    if (L) { inv = escala(I.inv, convLoc(L[0], C)); mat = escala(I.mat, convLoc(L[1], C)); fij = escala(I.fijos, convLoc(L[3], C)); P = bonito(convLoc(L[2], C)); }
    else { inv = I.inv.map(function (x) { return [x[0], mon(x[1], C)]; }); mat = I.mat.map(function (x) { return [x[0], mon(x[1], C)]; }); fij = I.fijos.map(function (x) { return [x[0], mon(x[1], C)]; }); P = mon(I.p, C); }
    var INV = inv.reduce(function (s, x) { return s + x[1]; }, 0), CV = Math.round(mat.reduce(function (s, x) { return s + x[1]; }, 0) * 100) / 100, FIJ = fij.reduce(function (s, x) { return s + x[1]; }, 0);
    var MU = Math.round((P - CV) * 100) / 100, ING = P * I.q, GAN = Math.round(MU * I.q - FIJ), PE = MU > 0 ? Math.ceil(FIJ / MU) : Infinity, MESES = GAN > 0 ? Math.ceil(INV / GAN) : Infinity;
    return { I: I, inv: inv, mat: mat, fij: fij, INV: INV, CV: CV, FIJ: FIJ, P: P, MU: MU, q: I.q, ING: ING, GAN: GAN, PE: PE, MESES: MESES, MARGEN: Math.round(MU / P * 100), HORA: Math.round(GAN / Math.max(1, I.q * I.h) * 100) / 100, ROI: Math.round(GAN * 12 / INV * 100), horas: Math.round(I.q * I.h), local: !!L };
  }
  function locales(C) { var k = Object.keys(LOCAL[C.pk] || {}); return IDEAS.filter(function (I) { return k.indexOf(I.id) >= 0; }); }
  function ranking(C, g) { return IDEAS.filter(function (I) { return !g || g === 'todas' || I.g === g; }).map(function (I) { return calcular(I, C); }).sort(function (a, b) { return b.ROI - a.ROI; }); }

  /* ─────────── datos legales por país ─────────── */
  var PAIS = {
    es: { formas: [['Autónomo (empresario individual)', 'Alta en Hacienda (modelo 036/037) y en la Seguridad Social (RETA). Respondes con tu patrimonio.'], ['Sociedad Limitada (SL)', 'Capital mínimo de 1 € desde la Ley Crea y Crece (2022), con reservas obligatorias hasta llegar a 3000 €. Responsabilidad limitada al capital.'], ['Cooperativa', 'Para proyectos con varios socios trabajadores.']],
      org: 'Agencia Tributaria (AEAT) y Seguridad Social', id: 'NIF', tram: ['Elige nombre y forma jurídica', 'Alta censal en Hacienda (modelo 036/037)', 'Alta en el RETA de la Seguridad Social', 'Licencia de actividad del ayuntamiento', 'Registro sanitario si vendes alimentos o cosméticos'], vent: 'Punto de Atención al Emprendedor (PAE) y sistema CIRCE para crear una SL en línea', imp: ['IVA general 21 %, reducido 10 % y superreducido 4 %', 'IRPF: pagos fraccionados trimestrales (modelo 130)', 'Cuota de autónomos según ingresos reales, con tarifa plana reducida el primer año'], ayu: ['ENISA (préstamos participativos)', 'Capitalización del paro', 'Ayudas de comunidades autónomas y ayuntamientos'] },
    mx: { formas: [['Persona física con actividad empresarial', 'Registro en el RFC. Puede tributar en el Régimen Simplificado de Confianza (RESICO) si cumple los límites de ingresos.'], ['Sociedad por Acciones Simplificada (SAS)', 'Se constituye en línea y sin notario en el portal de la Secretaría de Economía; puede tener un solo accionista.'], ['Sociedad Anónima o de Responsabilidad Limitada', 'Para proyectos con varios socios e inversión mayor.']],
      org: 'Servicio de Administración Tributaria (SAT)', id: 'RFC', tram: ['Inscríbete en el RFC y tramita tu e.firma', 'Elige régimen fiscal', 'Da de alta el negocio en el municipio (licencia de funcionamiento)', 'Registra a tus trabajadores en el IMSS', 'COFEPRIS si vendes alimentos o cosméticos'], vent: 'Portal de la Secretaría de Economía para constituir una SAS', imp: ['IVA 16 % (tasa 0 % en muchos alimentos básicos)', 'ISR según régimen (RESICO con tasas reducidas)', 'Facturación electrónica obligatoria (CFDI)'], ayu: ['Nacional Financiera (NAFIN)', 'Programas estatales de apoyo a emprendedores', 'Créditos de la banca de desarrollo'] },
    co: { formas: [['Persona natural comerciante', 'Inscripción en el RUT y en el registro mercantil de la Cámara de Comercio.'], ['Sociedad por Acciones Simplificada (SAS)', 'Ley 1258 de 2008: se crea por documento privado, con uno o más accionistas y responsabilidad limitada.'], ['Empresa asociativa de trabajo', 'Para grupos de personas que trabajan juntas.']],
      org: 'Dirección de Impuestos y Aduanas Nacionales (DIAN)', id: 'RUT / NIT', tram: ['Consulta que el nombre esté libre (RUES)', 'Inscríbete en la Cámara de Comercio', 'Obtén el RUT y el NIT en la DIAN', 'Habilita facturación electrónica', 'Registro INVIMA si vendes alimentos o cosméticos'], vent: 'Ventanilla Única Empresarial (VUE) de las Cámaras de Comercio', imp: ['IVA general 19 %, reducido 5 %', 'Régimen Simple de Tributación (RST) para pequeños negocios', 'Impuesto de industria y comercio (ICA) municipal'], ayu: ['Fondo Emprender (SENA)', 'iNNpulsa Colombia', 'Bancóldex'] },
    ar: { formas: [['Monotributo', 'Régimen simplificado: una cuota mensual que incluye impuesto y aportes, según la categoría de facturación.'], ['Responsable inscripto', 'Para facturaciones mayores: IVA y Ganancias por separado.'], ['Sociedad por Acciones Simplificada (SAS)', 'Ley 27.349: se puede crear con un solo socio.']],
      org: 'ARCA (Agencia de Recaudación y Control Aduanero, antes AFIP)', id: 'CUIT', tram: ['Obtén la CUIT y la clave fiscal', 'Adhiérete al Monotributo y elige categoría', 'Inscríbete en Ingresos Brutos de tu provincia', 'Habilitación municipal del local', 'Registro sanitario (RNE/RNPA) si vendes alimentos'], vent: 'Trámites en línea con clave fiscal', imp: ['IVA general 21 %, reducido 10,5 %', 'Ingresos Brutos (provincial)', 'Tasas municipales'], ayu: ['Programas nacionales y provinciales para pymes', 'Créditos del Banco Nación y bancos provinciales', 'Incubadoras universitarias'] },
    cl: { formas: [['Persona natural con inicio de actividades', 'Declaras inicio de actividades en el SII y emites boletas o facturas electrónicas.'], ['Empresa Individual de Responsabilidad Limitada (EIRL)', 'Un solo dueño, patrimonio separado.'], ['Sociedad por Acciones (SpA)', 'Flexible, con uno o más accionistas; la más usada por emprendedores.']],
      org: 'Servicio de Impuestos Internos (SII)', id: 'RUT', tram: ['Constituye la empresa en «Tu Empresa en un Día»', 'Inicio de actividades en el SII', 'Patente municipal', 'Resolución sanitaria (SEREMI de Salud) si vendes alimentos', 'Timbraje o emisión electrónica de documentos'], vent: 'Registro de Empresas y Sociedades «Tu Empresa en un Día»', imp: ['IVA 19 %', 'Impuesto a la renta con régimen Pro Pyme', 'Patente municipal'], ayu: ['Sercotec (Capital Semilla)', 'CORFO', 'FOSIS'] },
    ve: { formas: [['Firma personal', 'Registro mercantil de una persona natural que ejerce el comercio.'], ['Compañía Anónima (C.A.)', 'Capital dividido en acciones; la forma más común.'], ['Sociedad de Responsabilidad Limitada (S.R.L.)', 'Para pocos socios, con cuotas de participación.']],
      org: 'SENIAT', id: 'RIF', tram: ['Reserva de nombre en el Registro Mercantil (SAREN)', 'Registro del documento constitutivo', 'Inscripción en el RIF (SENIAT)', 'Licencia de actividades económicas de la alcaldía', 'Registro en el IVSS y demás organismos laborales'], vent: 'Registro Mercantil (SAREN)', imp: ['IVA general 16 %', 'Impuesto sobre la renta', 'Impuesto municipal a las actividades económicas'], ayu: ['Banca pública y fondos regionales', 'Programas municipales de emprendimiento', 'Cámaras de comercio locales'] },
    do: { formas: [['Persona física', 'Registro en el RNC como contribuyente; puede acogerse al Régimen Simplificado de Tributación (RST).'], ['Empresa Individual de Responsabilidad Limitada (EIRL)', 'Un solo dueño, patrimonio separado.'], ['Sociedad de Responsabilidad Limitada (SRL)', 'Ley 479-08: de 2 a 50 socios.']],
      org: 'Dirección General de Impuestos Internos (DGII)', id: 'RNC', tram: ['Registra el nombre comercial en ONAPI', 'Registro mercantil en la Cámara de Comercio', 'Inscripción en el RNC (DGII)', 'Registro en la Tesorería de la Seguridad Social (TSS)', 'Permisos de Salud Pública si vendes alimentos'], vent: 'Ventanilla única «Formalízate»', imp: ['ITBIS 18 % (16 % en algunos productos)', 'Impuesto sobre la renta', 'Anticipos mensuales'], ayu: ['Promipyme', 'Banca Solidaria', 'Centros MIPYMES'] },
    us: { formas: [['Sole proprietorship (dueño único)', 'La forma más sencilla; respondes con tu patrimonio.'], ['LLC (Limited Liability Company)', 'Se registra en el estado; separa tu patrimonio del negocio.'], ['Corporation (C o S)', 'Para crecer con socios e inversores.']],
      org: 'IRS (federal) y la agencia fiscal de tu estado', id: 'EIN', tram: ['Elige estado y forma legal', 'Registra la LLC en la Secretaría de Estado', 'Pide el EIN al IRS (gratuito en línea)', 'Licencias de la ciudad o del condado', 'Permiso de sales tax del estado'], vent: 'Portal de la Secretaría de Estado de cada estado', imp: ['Sales tax estatal y local (varía según el estado)', 'Impuesto federal sobre la renta', 'Self-employment tax (seguridad social del autónomo)'], ayu: ['SBA (Small Business Administration)', 'SCORE: mentores voluntarios', 'Small Business Development Centers'] }
  };

  /* ─────────── generadores (proceso y respuesta) ─────────── */
  function idea(r, C) { var I = H.pick(r, IDEAS); return calcular(I, C); }
  function ideaArt(r, C) { var L = locales(C); if (!L.length) L = IDEAS.filter(function (I) { return I.g === 'artesanal'; }); return calcular(H.pick(r, L), C); }
  var GEN = {
    emp_costos: function (u, C, r) { var K = idea(r, C); return it('corta', 'En «' + K.I.n + '» cada ' + K.I.u + ' lleva: ' + K.mat.map(function (m) { return m[0].toLowerCase() + ' (' + $(m[1], C) + ')'; }).join(', ') + '. ¿Cuál es el costo variable por ' + K.I.u + '?', $(K.CV, C), { ac: [K.CV, H.num(K.CV, C)], x: 'Se suman todos los materiales de una unidad: ' + K.mat.map(function (m) { return $(m[1], C); }).join(' + ') + ' = ' + $(K.CV, C) + '.' }); },
    emp_precio: function (u, C, r) { var K = idea(r, C), m = H.pick(r, [50, 60, 100, 150]), p = Math.round(K.CV * (1 + m / 100) * 100) / 100; return it('corta', 'Un ' + K.I.u + ' de «' + K.I.n + '» cuesta ' + $(K.CV, C) + ' en materiales. Si quieres un margen del ' + m + ' % sobre el costo, ¿a qué precio lo vendes?', $(p, C), { ac: [p, H.num(p, C)], x: 'Precio = costo × (1 + ' + m + '/100) = ' + $(K.CV, C) + ' × ' + H.num(1 + m / 100, C) + ' = ' + $(p, C) + '.' }); },
    emp_margen: function (u, C, r) { var K = idea(r, C); return it('corta', '«' + K.I.n + '»: precio ' + $(K.P, C) + ', costo variable ' + $(K.CV, C) + '. Calcula el margen por ' + K.I.u + ' y el margen en porcentaje sobre el precio.', $(K.MU, C) + '; ' + K.MARGEN + ' %', { ac: [K.MU, H.num(K.MU, C)], x: 'Margen = precio − costo = ' + $(K.P, C) + ' − ' + $(K.CV, C) + ' = ' + $(K.MU, C) + '. En % = ' + $(K.MU, C) + ' ÷ ' + $(K.P, C) + ' × 100 ≈ ' + K.MARGEN + ' %.' }); },
    emp_equilibrio: function (u, C, r) { var K = idea(r, C); return it('corta', '«' + K.I.n + '» tiene gastos fijos de ' + $(K.FIJ, C) + ' al mes y gana ' + $(K.MU, C) + ' por ' + K.I.u + '. ¿Cuántas unidades debe vender al mes para no perder dinero?', K.PE + ' ' + (K.PE === 1 ? K.I.u : pl(K.I)), { ac: [K.PE], x: 'Punto de equilibrio = gastos fijos ÷ margen = ' + $(K.FIJ, C) + ' ÷ ' + $(K.MU, C) + ' ≈ ' + K.PE + ' (se redondea hacia arriba).' }); },
    emp_ganancia: function (u, C, r) { var K = idea(r, C); return it('corta', 'Si «' + K.I.n + '» vende ' + K.q + ' ' + K.I.u + 's al mes a ' + $(K.P, C) + ', con un costo de ' + $(K.CV, C) + ' por unidad y ' + $(K.FIJ, C) + ' de gastos fijos, ¿cuánto gana al mes?', $(K.GAN, C), { ac: [K.GAN, H.num(K.GAN, C)], x: 'Ganancia = (precio − costo) × unidades − fijos = ' + $(K.MU, C) + ' × ' + K.q + ' − ' + $(K.FIJ, C) + ' = ' + $(K.GAN, C) + '.' }); },
    emp_roi: function (u, C, r) { var K = idea(r, C); if (!isFinite(K.MESES)) K = calcular(IDEAS[1], C); return it('corta', 'Montar «' + K.I.n + '» cuesta ' + $(K.INV, C) + ' y deja ' + $(K.GAN, C) + ' de ganancia al mes. ¿En cuántos meses recuperas la inversión?', K.MESES + ' meses', { ac: [K.MESES], x: 'Meses = inversión ÷ ganancia mensual = ' + $(K.INV, C) + ' ÷ ' + $(K.GAN, C) + ' ≈ ' + K.MESES + ' (redondeando hacia arriba).' }); },
    emp_iva: function (u, C, r) { var K = idea(r, C), t = C.P.imp.p, bruto = Math.round(K.P * (1 + t / 100) * 100) / 100; return it('corta', 'En ' + C.P.n + ' el ' + C.P.imp.n + ' es del ' + t + ' %. Si un ' + K.I.u + ' vale ' + $(K.P, C) + ' sin impuesto, ¿cuál es el precio final al cliente?', $(bruto, C), { ac: [bruto, H.num(bruto, C)], x: 'Precio final = ' + $(K.P, C) + ' × (1 + ' + t + '/100) = ' + $(bruto, C) + '. El ' + C.P.imp.n + ' se ingresa en ' + (PAIS[C.pk] || PAIS.es).org + ', no es ganancia.' }); },
    emp_hora: function (u, C, r) { var K = idea(r, C); return it('corta', 'En «' + K.I.n + '» ganas ' + $(K.GAN, C) + ' al mes trabajando unas ' + K.horas + ' horas. ¿Cuánto ganas por hora?', $(K.HORA, C), { ac: [K.HORA, H.num(K.HORA, C)], x: 'Ganancia por hora = ' + $(K.GAN, C) + ' ÷ ' + K.horas + ' h ≈ ' + $(K.HORA, C) + '. Compárala con un sueldo por horas antes de decidir.' }); },
    emp_capital: function (u, C, r) { var K = ideaArt(r, C), tot = K.INV + 3 * K.FIJ; return it('corta', 'Para montar «' + K.I.n + '» necesitas ' + $(K.INV, C) + ' en herramientas y materiales, y quieres un colchón de 3 meses de gastos fijos (' + $(K.FIJ, C) + ' al mes). ¿Qué capital inicial necesitas?', $(tot, C), { ac: [tot, H.num(tot, C)], x: 'Capital = inversión + 3 × fijos = ' + $(K.INV, C) + ' + 3 × ' + $(K.FIJ, C) + ' = ' + $(tot, C) + '.' }); },
    emp_escenario: function (u, C, r) { var K = ideaArt(r, C), q = H.pick(r, [10, 25, 50]), g = Math.round(K.MU * q - K.FIJ); return it('corta', '«' + K.I.n + '»: precio ' + $(K.P, C) + ', costo ' + $(K.CV, C) + ' por ' + K.I.u + ' y ' + $(K.FIJ, C) + ' de gastos fijos al mes. ¿Cuánto ganas al mes si vendes ' + q + '?', $(g, C), { ac: [g, H.num(g, C)], x: '(' + $(K.P, C) + ' − ' + $(K.CV, C) + ') × ' + q + ' − ' + $(K.FIJ, C) + ' = ' + $(g, C) + (g < 0 ? '. Con ese volumen se pierde dinero.' : '.') }); },
    emp_smi: function (u, C, r) { var K = ideaArt(r, C), S = smi(C), n = K.MU > 0 ? Math.ceil((K.FIJ + S.v) / K.MU) : 0; return it('corta', 'En ' + C.P.n + ' el salario mínimo de referencia es ' + $(S.v, C) + ' al mes. Con «' + K.I.n + '» ganas ' + $(K.MU, C) + ' por ' + K.I.u + ' y pagas ' + $(K.FIJ, C) + ' de gastos fijos. ¿Cuántas unidades al mes debes vender para pagarte ese sueldo?', n + ' ' + pl(K.I), { ac: [n], x: '(fijos + sueldo) ÷ margen = (' + $(K.FIJ, C) + ' + ' + $(S.v, C) + ') ÷ ' + $(K.MU, C) + ' ≈ ' + n + ' (hacia arriba).' }); },
    emp_flujo: function (u, C, r) { var K = idea(r, C), m = E(r, 3, 6), s = -K.INV + K.GAN * m; return it('corta', '«' + K.I.n + '» empieza con −' + $(K.INV, C) + ' (la inversión) y cada mes suma ' + $(K.GAN, C) + '. ¿Cuál es el saldo acumulado al final del mes ' + m + '?', $(s, C), { ac: [s, H.num(s, C)], x: 'Saldo = −inversión + ganancia × meses = −' + $(K.INV, C) + ' + ' + $(K.GAN, C) + ' × ' + m + ' = ' + $(s, C) + (s < 0 ? '. Aún no se ha recuperado.' : '. Ya se recuperó.') }); }
  };

  /* ─────────── unidades ─────────── */
  var U = [];
  function un(id, b, t, g, i, k, vf, q, f, h) { U.push({ m: 'empre', id: id, b: b.split(' '), t: t, g: g, i: i, k: k, vf: vf.split('|').map(function (s) { return [s.slice(2), s.charAt(0) === 'V']; }), q: q, f: f, h: h, plus: true }); }
  un('emp_idea', 'sec bach fp adu', 'De la idea al cliente', 'emp_precio', ['Un negocio nace de resolver un problema real de un grupo de personas concreto.', 'El cliente ideal se describe con edad, lugar, costumbres y lo que le preocupa.', 'Antes de invertir se valida la idea: preguntar, mostrar un prototipo y conseguir las primeras ventas.', 'Una buena idea se explica en una frase: qué vendes, a quién y por qué te eligen.'], ['cliente ideal', 'problema', 'propuesta de valor', 'validación', 'prototipo'], 'V:Validar es comprobar que alguien pagaría.|F:Un negocio debe gustar a todo el mundo.|V:El prototipo puede ser muy sencillo.', ['Describe a tu cliente ideal en cinco líneas.', 'Escribe tu idea de negocio en una sola frase.'], { t: 'flujo', p: ['problema', 'idea', 'prototipo', 'primeras ventas', 'mejora'] }, 'Pregunta a diez personas antes de gastar un solo peso.');
  un('emp_lienzo', 'sec bach fp adu', 'El modelo de negocio en una hoja', 'emp_margen', ['El lienzo del modelo de negocio resume una empresa en nueve bloques.', 'Clientes, propuesta de valor, canales y relación explican cómo se vende.', 'Actividades, recursos y socios clave explican cómo se produce.', 'Ingresos y costos dicen si el negocio gana dinero.'], ['lienzo', 'propuesta de valor', 'canales', 'socios clave', 'estructura de costos'], 'V:El lienzo tiene nueve bloques.|F:Los canales son los proveedores.|V:Los ingresos y costos van abajo del lienzo.', ['Rellena el lienzo de un negocio de tu barrio.', '¿Qué socio clave necesitaría una panadería?'], { t: 'mapa', c: 'Modelo de negocio', r: ['clientes', 'propuesta de valor', 'canales', 'recursos', 'costos', 'ingresos'] });
  un('emp_mercado', 'sec bach fp adu', 'Estudio de mercado', 'emp_hora', ['El estudio de mercado mide cuántos clientes hay, qué compran y a qué precio.', 'La competencia enseña qué funciona y qué hueco queda libre.', 'Una encuesta corta de diez preguntas da mucha información.', 'El tamaño del mercado se estima multiplicando clientes posibles por lo que gastan.'], ['mercado', 'competencia', 'encuesta', 'segmento', 'demanda'], 'V:La competencia da información útil.|F:Si no hay competencia siempre es buena señal.|V:Una encuesta ayuda a fijar el precio.', ['Visita tres competidores y anota sus precios.', 'Diseña cinco preguntas para una encuesta.'], { t: 'flujo', p: ['preguntar', 'observar', 'contar', 'comparar', 'decidir'] });
  un('emp_costos', 'sec bach fp adu', 'Costos fijos y variables', 'emp_costos', ['Los costos variables cambian con lo que produces: materiales, envases, comisiones.', 'Los costos fijos se pagan aunque no vendas: alquiler, internet, seguros.', 'La inversión inicial es lo que gastas una sola vez para empezar.', 'Tu tiempo también es un costo: pon un precio a cada hora.'], ['costo variable', 'costo fijo', 'inversión inicial', 'materiales', 'hora de trabajo'], 'V:El alquiler es un costo fijo.|F:Los materiales son un costo fijo.|V:La herramienta inicial es inversión.', ['Haz la lista de costos de un producto que te guste hacer.', '¿Por qué hay que cobrar el tiempo de trabajo?'], { t: 'mapa', c: 'Costos', r: ['variables', 'fijos', 'inversión', 'tiempo'] });
  un('emp_precio', 'sec bach fp adu', 'Poner precio', 'emp_iva', ['El precio debe cubrir el costo, los gastos fijos y dejar ganancia.', 'Se puede fijar por costo más margen, por la competencia o por el valor para el cliente.', 'Los impuestos del país se suman al precio y no son ganancia.', 'Los paquetes y los productos premium suben el ticket medio.'], ['precio', 'margen', 'ticket medio', 'impuesto', 'valor percibido'], 'V:El IVA no es ganancia del negocio.|F:El precio más bajo siempre vende más.|V:Un paquete sube el ticket medio.', ['Calcula el precio de un producto con margen del 100 %.', 'Diseña un paquete con tres productos.'], { t: 'flujo', p: ['costo', 'margen', 'impuesto', 'precio final'] });
  un('emp_equilibrio', 'sec bach fp adu', 'El punto de equilibrio', 'emp_equilibrio', ['El punto de equilibrio es la cantidad que hay que vender para no ganar ni perder.', 'Se calcula dividiendo los costos fijos entre el margen por unidad.', 'Por encima del punto de equilibrio cada venta deja ganancia.', 'Bajar los fijos o subir el margen acerca el equilibrio.'], ['punto de equilibrio', 'margen unitario', 'costos fijos', 'ganancia', 'pérdida'], 'V:PE = fijos ÷ margen.|F:En el punto de equilibrio se gana mucho.|V:Subir el margen baja el punto de equilibrio.', ['Calcula el punto de equilibrio de tu idea.', '¿Qué harías si no llegas al punto de equilibrio?'], { t: 'flujo', p: ['fijos', 'margen', 'unidades mínimas', 'ganancia'] });
  un('emp_flujo', 'bach fp adu', 'Plan financiero y flujo de caja', 'emp_flujo', ['El flujo de caja anota el dinero que entra y sale cada mes.', 'Un negocio puede ganar dinero y aun así quedarse sin caja.', 'El plan a 12 meses muestra cuándo se recupera la inversión.', 'Conviene tener un colchón de tres meses de gastos fijos.'], ['flujo de caja', 'saldo', 'colchón', 'inversión', 'recuperación'], 'V:Se puede ganar y quedarse sin caja.|F:El flujo de caja se hace una vez al año.|V:El colchón cubre meses malos.', ['Haz el flujo de caja de tu primer trimestre.', '¿Por qué los cobros a crédito son un riesgo?'], { t: 'ciclo', p: ['ingresos', 'pagos', 'saldo', 'decisiones'] });
  un('emp_marketing', 'sec bach fp adu', 'Marca, redes y ventas', 'emp_ganancia', ['La marca es lo que el cliente recuerda: nombre, colores, tono y experiencia.', 'Las redes sociales muestran el producto, pero la venta se cierra con buena atención.', 'Las fotos con luz natural y fondo limpio venden más.', 'Un cliente satisfecho que recomienda vale más que un anuncio.'], ['marca', 'redes sociales', 'fotografía', 'recomendación', 'fidelización'], 'V:La recomendación es la mejor publicidad.|F:Basta con tener muchos seguidores.|V:La luz natural mejora las fotos.', ['Diseña el logotipo y los colores de tu marca.', 'Escribe tres publicaciones para lanzar tu producto.'], { t: 'flujo', p: ['atraer', 'convencer', 'vender', 'fidelizar'] });
  un('emp_finan', 'bach fp adu', 'Financiación y recuperación', 'emp_roi', ['Se puede empezar con ahorro propio, familia, microcréditos, ayudas o inversores.', 'Un préstamo cuesta intereses: compara la tasa total, no solo la cuota.', 'Empezar pequeño y crecer con las ventas reduce el riesgo.', 'La rentabilidad anual compara la ganancia de un año con la inversión.'], ['financiación', 'microcrédito', 'interés', 'rentabilidad', 'riesgo'], 'V:Empezar pequeño reduce el riesgo.|F:Un préstamo no tiene costo.|V:La rentabilidad compara ganancia e inversión.', ['Compara dos formas de financiar tu idea.', '¿Cuánto tardarías en recuperar tu inversión?'], { t: 'flujo', p: ['ahorro', 'ayudas', 'préstamo', 'inversores'] });
  un('emp_pitch', 'bach fp adu', 'Presentar tu negocio (pitch)', 'emp_margen', ['Un pitch cuenta tu negocio en tres minutos.', 'Empieza por el problema y la persona que lo sufre.', 'Muestra tu solución, el mercado, cómo ganas dinero y qué necesitas.', 'Termina con una petición clara: dinero, socios o clientes.'], ['pitch', 'problema', 'solución', 'modelo de ingresos', 'petición'], 'V:Un pitch dura pocos minutos.|F:El pitch empieza por las cifras.|V:Hay que terminar con una petición.', ['Escribe tu pitch en diez frases.', 'Ensáyalo con un cronómetro.'], { t: 'flujo', p: ['problema', 'solución', 'mercado', 'dinero', 'petición'] });
  un('emp_pais', 'sec bach fp adu', 'Emprender legalmente en tu país', 'emp_iva', ['Formalizar el negocio da acceso a créditos, clientes grandes y protección.', 'La forma legal define quién responde de las deudas y qué impuestos se pagan.', 'Cada país tiene un organismo de impuestos y un número de identificación fiscal.', 'Los trámites cambian: consulta siempre la web oficial antes de empezar.'], ['forma legal', 'registro', 'identificación fiscal', 'impuestos', 'licencia'], 'V:Formalizar da acceso a créditos.|F:Todos los países tienen los mismos trámites.|V:El impuesto al consumo no es ganancia.', ['Busca en la web oficial el primer trámite para emprender en tu país.', '¿Qué forma legal elegirías para tu idea y por qué?'], { t: 'flujo', p: ['nombre', 'forma legal', 'registro fiscal', 'licencias', 'abrir'] });

  un('emp_capital', 'sec bach fp adu', 'Capital inicial del taller artesanal', 'emp_capital', ['El capital inicial suma herramientas, primer lote de materiales, espacio de trabajo y fotos del catálogo.', 'Además de la inversión conviene guardar un colchón de tres meses de gastos fijos.', 'Muchas herramientas se pueden alquilar o comprar de segunda mano al principio.', 'Comprar material al por mayor baja el costo por unidad, pero inmoviliza dinero.'], ['capital inicial', 'herramientas', 'stock', 'colchón', 'segunda mano'], 'V:El colchón forma parte del capital inicial.|F:Hay que comprar todas las herramientas nuevas.|V:Comprar al por mayor inmoviliza dinero.', ['Haz la lista de lo que necesitas para empezar tu taller y ponle precio.', '¿Qué herramienta podrías alquilar en vez de comprar?'], { t: 'flujo', p: ['herramientas', 'materiales', 'espacio', 'colchón', 'capital'] }, 'Empieza con lo mínimo y compra más cuando lleguen los pedidos.');
  un('emp_margen_art', 'sec bach fp adu', 'Margen de beneficio en lo hecho a mano', 'emp_escenario', ['En un producto artesanal el material suele ser barato; lo caro es el tiempo.', 'El margen por unidad es el precio menos el costo de los materiales.', 'Vender 10, 25 o 50 unidades al mes cambia la ganancia, porque los gastos fijos se reparten entre más unidades.', 'Comparar la ganancia con el salario mínimo dice si el taller puede ser tu sueldo.'], ['margen', 'volumen', 'escenario', 'salario mínimo', 'precio por hora'], 'V:Con más volumen los fijos pesan menos por unidad.|F:El margen por unidad incluye los gastos fijos.|V:El tiempo de trabajo debe entrar en el precio.', ['Calcula tu ganancia con 10, 25 y 50 unidades al mes.', '¿Cuántas horas te llevarían 50 unidades?'], { t: 'flujo', p: ['precio', 'costo', 'margen', 'volumen', 'ganancia'] });
  un('emp_caja_art', 'bach fp adu', 'Flujo de caja del taller artesanal', 'emp_smi', ['Las ventas artesanales van por temporadas: fiestas, regalos y ferias.', 'Pedir anticipo en los encargos protege la caja.', 'El material se paga antes de cobrar: hay que prever ese hueco.', 'Un taller es un sueldo cuando la ganancia cubre al menos el salario mínimo.'], ['temporada', 'anticipo', 'caja', 'sueldo', 'feria'], 'V:El anticipo protege la caja.|F:Las ventas son iguales todos los meses.|V:El material se paga antes de cobrar.', ['Marca en un calendario los meses fuertes de tu producto.', '¿Cuántas unidades necesitas vender para pagarte el salario mínimo?'], { t: 'ciclo', p: ['compro material', 'produzco', 'vendo', 'cobro', 'repongo'] });

  /* ─────────── dibujos ─────────── */
  function K(C) { return { a: C.T.acc, b: C.T.acc2, s: C.T.soft, s2: C.T.soft2, i: C.T.ink, f: C.T.cuerpo }; }
  function txt(k, x, y, t, o) { o = o || {}; return '<text x="' + x + '" y="' + y + '" font-family="' + esc(k.f) + '" font-size="' + (o.s || 14) + '" fill="' + (o.c || k.i) + '" font-weight="' + (o.w || 400) + '" text-anchor="' + (o.a || 'middle') + '">' + esc(t) + '</text>'; }
  /* Infografía: inversión, ingresos, costos y ganancia del mes + barra de recuperación */
  function infografia(R, C) {
    var k = K(C), W = 600, Hh = 250, mx = Math.max(R.INV, R.ING), s = 150 / mx, g = '';
    var bars = [['Inversión', R.INV, k.i], ['Ventas/mes', R.ING, k.a], ['Costos/mes', R.ING - R.GAN, clrs(k.b)], ['Ganancia/mes', Math.max(0, R.GAN), k.b]];
    bars.forEach(function (b, i) { var h = Math.max(3, b[1] * s), x = 40 + i * 100; g += '<rect x="' + x + '" y="' + (180 - h) + '" width="64" height="' + h + '" rx="4" fill="' + b[2] + '"/>' + txt(k, x + 32, 172 - h, $(Math.round(b[1]), C), { s: 12, w: 700 }) + txt(k, x + 32, 200, b[0], { s: 12 }); });
    var m = isFinite(R.MESES) ? Math.min(24, R.MESES) : 24;
    g += txt(k, 500, 40, 'Recuperas la inversión', { s: 12 }) + txt(k, 500, 76, isFinite(R.MESES) ? R.MESES + ' meses' : 'no se recupera', { s: 26, w: 700, c: k.a });
    for (var i = 0; i < 24; i++) g += '<rect x="' + (440 + (i % 6) * 20) + '" y="' + (96 + Math.floor(i / 6) * 20) + '" width="16" height="16" rx="3" fill="' + (i < m ? k.a : k.s) + '"/>';
    g += txt(k, 500, 196, 'cada cuadro = 1 mes', { s: 11 }) + '<line x1="30" y1="180" x2="420" y2="180" stroke="' + k.i + '" stroke-width="1.5"/>';
    g += txt(k, 300, 236, 'Margen ' + R.MARGEN + ' % · rentabilidad anual ' + R.ROI + ' % · ' + $(R.HORA, C) + ' por hora trabajada', { s: 13, w: 700 });
    return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + W + ' ' + Hh + '" style="width:100%;height:auto;display:block">' + g + '</svg>';
  }
  function clrs(c) { return window.EU_SVG && EU_SVG.clr ? EU_SVG.clr(c, .45) : c; }
  function equilibrioSVG(R, C) {
    var k = K(C), qmax = Math.max(R.q * 1.3, R.PE * 1.6), ymax = R.P * qmax, W = 600, Hh = 240, X = function (q) { return 50 + q / qmax * 520; }, Y = function (v) { return 200 - v / ymax * 170; }, g = '';
    g += '<line x1="50" y1="200" x2="580" y2="200" stroke="' + k.i + '" stroke-width="1.5"/><line x1="50" y1="200" x2="50" y2="20" stroke="' + k.i + '" stroke-width="1.5"/>';
    g += '<polygon points="' + X(R.PE) + ',' + Y(R.P * R.PE) + ' ' + X(qmax) + ',' + Y(R.P * qmax) + ' ' + X(qmax) + ',' + Y(R.FIJ + R.CV * qmax) + '" fill="' + k.s + '"/>';
    g += '<line x1="' + X(0) + '" y1="' + Y(R.FIJ) + '" x2="' + X(qmax) + '" y2="' + Y(R.FIJ) + '" stroke="' + k.i + '" stroke-width="1.5" stroke-dasharray="6 5"/>';
    g += '<line x1="' + X(0) + '" y1="' + Y(R.FIJ) + '" x2="' + X(qmax) + '" y2="' + Y(R.FIJ + R.CV * qmax) + '" stroke="' + k.b + '" stroke-width="3"/>';
    g += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(qmax) + '" y2="' + Y(R.P * qmax) + '" stroke="' + k.a + '" stroke-width="3"/>';
    if (isFinite(R.PE)) g += '<circle cx="' + X(R.PE) + '" cy="' + Y(R.P * R.PE) + '" r="6" fill="' + k.i + '" stroke="#fff" stroke-width="2"/><line x1="' + X(R.PE) + '" y1="' + Y(R.P * R.PE) + '" x2="' + X(R.PE) + '" y2="200" stroke="' + k.i + '" stroke-dasharray="4 4"/>' + txt(k, X(R.PE), 218, R.PE + ' ' + pl(R.I), { s: 12, w: 700 });
    g += txt(k, 60, 34, 'ingresos', { s: 12, c: k.a, w: 700, a: 'start' }) + txt(k, 60, 52, 'costos totales', { s: 12, c: k.b, w: 700, a: 'start' }) + txt(k, 60, 70, 'costos fijos', { s: 12, a: 'start' }) + txt(k, X(qmax) - 8, Y((R.P + R.CV) / 2 * qmax + R.FIJ / 2) + 5, 'ganancia', { s: 12, w: 700, a: 'end' }) + txt(k, 575, 232, 'unidades al mes', { s: 11, a: 'end' });
    return '<svg ' + NS + ' data-plano="1" viewBox="0 0 ' + W + ' ' + Hh + '" style="width:100%;height:auto;display:block">' + g + '</svg>';
  }
  function dibujoIdea(I) { var B = window.EU_BOTANICA, map = { pinatas: 'globo', velas: 'flor', jabones: 'lavanda', bisuteria: 'mariposa', crochet: 'oveja', globos: 'girasol', ceramica: 'cactus', costura: 'margarita', madera: 'arbol', salon: 'rosa', panaderia: 'trigo', reposteria: 'fresa', jugueria: 'naranja', comida: 'olla', tienda: 'bol', clases: 'buho', reparaciones: 'tetera' }; var id = map[I.id]; return B && id && B.D[id] ? B.dibujo(id, { modo: 'color', d3: true }) : ''; }

  /* ─────────── páginas ─────────── */
  function cab(C, pg, t, s) { return H.cabecera(C, pg) + H.h1(C, esc(t), 'margin-bottom:1mm') + (s ? '<p style="margin:0 0 4mm;opacity:.85;text-wrap:pretty">' + esc(s) + '</p>' : ''); }
  function tbl(C, filas, pie) { var T = C.T; return '<table style="width:100%;border-collapse:collapse;font-size:.9em">' + filas.map(function (f) { return '<tr><td style="padding:1.3mm 2mm;border-bottom:0.2mm solid ' + T.soft + '">' + esc(f[0]) + '</td><td style="padding:1.3mm 2mm;border-bottom:0.2mm solid ' + T.soft + ';text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap">' + esc(f[1]) + '</td></tr>'; }).join('') + (pie ? '<tr><td style="padding:1.6mm 2mm;font-weight:700">' + esc(pie[0]) + '</td><td style="padding:1.6mm 2mm;text-align:right;font-weight:700;color:' + T.acc + ';white-space:nowrap">' + esc(pie[1]) + '</td></tr>' : '') + '</table>'; }
  function dato(C, n, v, col) { var T = C.T; return '<div style="flex:1 1 30mm;min-width:0;padding:2.5mm 3mm;border-radius:' + T.r + 'px;background:' + (col ? T.acc : T.soft) + ';color:' + (col ? '#fff' : T.ink) + '"><div style="font-size:.74em;opacity:.85">' + esc(n) + '</div><div style="font-size:1.25em;font-weight:700;font-variant-numeric:tabular-nums">' + esc(v) + '</div></div>'; }
  function planTabla(v, fm, T) {
    var filas = '', saldo = -v.inv;
    for (var m = 1; m <= 12; m++) { var q = Math.round(v.q * Math.min(1, .45 + m * .06)), ing = q * v.p, gas = q * v.cv + v.fij, gan = Math.round(ing - gas); saldo += gan; filas += '<tr style="background:' + (saldo >= 0 ? T.soft : 'transparent') + '">' + [m, q, fm(Math.round(ing)), fm(Math.round(gas)), fm(gan), fm(Math.round(saldo))].map(function (x, i) { return '<td style="padding:1.1mm 1.5mm;text-align:' + (i ? 'right' : 'center') + ';border-bottom:0.2mm solid ' + T.soft + ';' + (i === 5 ? 'font-weight:700;color:' + (saldo >= 0 ? T.acc : T.acc2) : '') + '">' + esc(String(x)) + '</td>'; }).join('') + '</tr>'; }
    return '<table style="width:100%;border-collapse:collapse;font-size:.84em;font-variant-numeric:tabular-nums"><tr style="background:' + T.acc + ';color:#fff">' + ['Mes', 'Unidades', 'Ingresos', 'Gastos', 'Resultado', 'Saldo acumulado'].map(function (h) { return '<th style="padding:1.5mm;text-align:right">' + h + '</th>'; }).join('') + '</tr><tr><td colspan="5" style="padding:1.1mm 1.5mm">Inversión inicial</td><td style="padding:1.1mm 1.5mm;text-align:right;font-weight:700;color:' + T.acc2 + '">' + esc(fm(-v.inv)) + '</td></tr>' + filas + '</table>';
  }
  function calculadora(R, C, plan) {
    var T = C.T, f = fx(C), inp = function (k, v, n) { return '<label style="display:flex;flex-direction:column;gap:.5mm;font-size:.78em">' + esc(n) + '<input data-emp="' + k + '" type="number" step="any" value="' + v + '" oninput="EU_EMPRE.calc(this)' + (plan ? ';EU_EMPRE.calcPlan(this)' : '') + '" style="font:inherit;font-size:1.1em;padding:1mm 2mm;border:0.3mm solid ' + T.ink + ';border-radius:4px;width:100%;box-sizing:border-box"/></label>'; };
    return '<div data-emp-calc="1" data-loc="' + esc(C.P.loc) + '" data-mon="' + esc(C.P.mon) + '" data-t="' + esc(JSON.stringify({ acc: T.acc, acc2: T.acc2, soft: T.soft })) + '" style="margin-top:4mm;padding:3mm 4mm;border:0.4mm solid ' + T.acc + ';border-radius:' + T.r + 'px"><div style="font-weight:700;margin-bottom:2mm">Calculadora: cambia los números y mira el resultado</div>' +
      '<div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2mm">' + inp('p', R.P, 'Precio') + inp('cv', R.CV, 'Costo por unidad') + inp('q', R.q, 'Unidades/mes') + inp('fij', R.FIJ, 'Fijos/mes') + inp('inv', R.INV, 'Inversión') + '</div>' +
      '<div data-emp-out="1" style="margin-top:2.5mm;font-weight:700;color:' + T.acc + '"></div></div>';
  }
  function itemsFicha(I, C) {
    var R = calcular(I, C);
    return [
        it('corta', '¿Cuánto ganas por cada ' + R.I.u + ' vendido?', $(R.MU, C), { ac: [R.MU, H.num(R.MU, C)], x: $(R.P, C) + ' − ' + $(R.CV, C) + ' = ' + $(R.MU, C) + '.' }),
        it('corta', '¿Cuántos ' + R.I.u + 's al mes necesitas para cubrir los gastos fijos?', String(R.PE), { ac: [R.PE], x: $(R.FIJ, C) + ' ÷ ' + $(R.MU, C) + ' ≈ ' + R.PE + '.' }),
        it('corta', 'Si vendes un 20 % más (' + Math.round(R.q * 1.2) + ' ' + R.I.u + 's), ¿cuánto ganas al mes?', $(Math.round(R.MU * Math.round(R.q * 1.2) - R.FIJ), C), { ac: [Math.round(R.MU * Math.round(R.q * 1.2) - R.FIJ)], x: $(R.MU, C) + ' × ' + Math.round(R.q * 1.2) + ' − ' + $(R.FIJ, C) + '.' })
    ];
  }
  var PAG = {
    emp_pais: function (pg, C) {
      var D = PAIS[C.pk] || PAIS.es, T = C.T;
      return cab(C, pg, 'Emprender en ' + C.P.n, 'Guía práctica para formalizar un negocio. Datos revisados en ' + REVISION + ': los trámites y las cuotas cambian, confirma siempre en la web oficial.') +
        H.h2(C, 'Formas legales más usadas') + D.formas.map(function (f) { return '<div style="margin:0 0 2.5mm"><b style="color:' + T.acc + '">' + esc(f[0]) + '.</b> ' + esc(f[1]) + '</div>'; }).join('') +
        '<div style="display:flex;gap:3mm;margin:3mm 0">' + dato(C, 'Organismo de impuestos', D.org) + dato(C, 'Identificación fiscal', D.id) + dato(C, C.P.imp.n + ' general', C.P.imp.p + ' %', true) + dato(C, 'Salario mínimo', $(smi(C).v, C) + '/mes') + '</div>' +
        '<p style="margin:0 0 3mm;font-size:.85em;opacity:.85">' + esc(smi(C).t) + '</p>' +
        H.h2(C, 'Trámites paso a paso') + D.tram.map(function (t, i) { return '<div style="display:flex;gap:3mm;margin:0 0 2mm"><span style="flex:none;width:7mm;height:7mm;border-radius:50%;background:' + T.acc + ';color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85em">' + (i + 1) + '</span><span>' + esc(t) + '</span></div>'; }).join('') +
        '<p style="margin:2mm 0;font-size:.9em"><b>Ventanilla:</b> ' + esc(D.vent) + '.</p>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:5mm"><div>' + H.h2(C, 'Impuestos') + D.imp.map(function (x) { return '<div style="margin:0 0 1.5mm">· ' + esc(x) + '</div>'; }).join('') + '</div><div>' + H.h2(C, 'Apoyos y ayudas') + D.ayu.map(function (x) { return '<div style="margin:0 0 1.5mm">· ' + esc(x) + '</div>'; }).join('') + '</div></div>' + H.folio(C, pg);
    },
    emp_ranking: function (pg, C) {
      var T = C.T, L = ranking(C, pg.g);
      return cab(C, pg, pg.g === 'artesanal' ? 'Negocios artesanales más rentables' : pg.g === 'oficio' ? 'Oficios y comercios más rentables' : 'Las ideas más rentables', 'Ordenadas por rentabilidad anual (ganancia de un año ÷ inversión). Importes orientativos en ' + C.P.mon + ' para ' + C.P.n + '.') +
        '<table style="width:100%;border-collapse:collapse;font-size:.84em;font-variant-numeric:tabular-nums"><tr style="background:' + T.acc + ';color:#fff">' + ['#', 'Negocio', 'Inversión', 'Ganancia/mes', 'Recuperas', 'Por hora', 'Rentab.'].map(function (h, i) { return '<th style="padding:1.6mm 1.5mm;text-align:' + (i > 1 ? 'right' : 'left') + '">' + h + '</th>'; }).join('') + '</tr>' +
        L.map(function (R, i) { return '<tr style="background:' + (i % 2 ? T.soft2 : 'transparent') + '"><td style="padding:1.4mm 1.5mm;font-weight:700;color:' + T.acc + '">' + (i + 1) + '</td><td style="padding:1.4mm 1.5mm">' + esc(R.I.n) + '</td><td style="padding:1.4mm 1.5mm;text-align:right">' + esc($(R.INV, C)) + '</td><td style="padding:1.4mm 1.5mm;text-align:right;font-weight:700">' + esc($(R.GAN, C)) + '</td><td style="padding:1.4mm 1.5mm;text-align:right">' + (isFinite(R.MESES) ? R.MESES + ' m' : '—') + '</td><td style="padding:1.4mm 1.5mm;text-align:right">' + esc($(R.HORA, C)) + '</td><td style="padding:1.4mm 1.5mm;text-align:right;font-weight:700;color:' + T.acc + '">' + R.ROI + ' %</td></tr>'; }).join('') + '</table>' +
        H.guia(C, 'Rentable no es solo «gana mucho»: mira también cuánto arriesgas (inversión) y cuánto ganas por cada hora de tu trabajo.', true) + H.folio(C, pg);
    },
    emp_ficha: function (pg, C, modo) {
      var R = calcular(pg.idea, C), T = C.T, dib = dibujoIdea(R.I);
      return H.cabecera(C, pg) + '<div style="display:flex;gap:4mm;align-items:center;margin:0 0 3mm">' + (dib ? '<div style="flex:none;width:22mm">' + dib + '</div>' : '') + '<div style="flex:1;min-width:0">' + H.h1(C, esc(R.I.n), 'margin:0 0 1mm') + '<p style="margin:0;opacity:.85;text-wrap:pretty">' + esc(R.I.d) + '</p></div></div>' +
        '<div style="display:flex;gap:2.5mm;margin:0 0 3mm">' + dato(C, 'Inversión inicial', $(R.INV, C)) + dato(C, 'Precio por ' + R.I.u, $(R.P, C)) + dato(C, 'Ganancia al mes', $(R.GAN, C), true) + dato(C, 'Recuperas en', isFinite(R.MESES) ? R.MESES + ' meses' : '—') + '</div>' +
        '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:5mm">' +
        '<div>' + H.h2(C, 'Inversión inicial') + tbl(C, R.inv.map(function (x) { return [x[0], $(x[1], C)]; }), ['Total', $(R.INV, C)]) + '</div>' +
        '<div>' + H.h2(C, 'Costo por ' + R.I.u) + tbl(C, R.mat.map(function (x) { return [x[0], $(x[1], C)]; }), ['Costo variable', $(R.CV, C)]) + H.h2(C, 'Gastos fijos al mes') + tbl(C, R.fij.map(function (x) { return [x[0], $(x[1], C)]; }), ['Total', $(R.FIJ, C)]) + '</div></div>' +
        H.h2(C, 'Un mes normal: ' + R.q + ' ' + pl(R.I)) + infografia(R, C) + (modo === 'web' ? calculadora(R, C) : '') +
        H.folio(C, pg);
    },
    emp_ficha2: function (pg, C) {
      var R = calcular(pg.idea, C), T = C.T;
      pg.items = pg.items || itemsFicha(pg.idea, C);
      return cab(C, pg, R.I.n + ': cómo empezar')
 + H.h2(C, 'Punto de equilibrio') + equilibrioSVG(R, C) +
        '<div style="display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:5mm;margin-top:2mm"><div>' + H.h2(C, 'Primeros pasos') + R.I.pasos.map(function (p, i) { return '<div style="display:flex;gap:2.5mm;margin:0 0 1.8mm"><b style="color:' + T.acc + ';flex:none;width:5mm">' + (i + 1) + '.</b><span>' + esc(p) + '</span></div>'; }).join('') + '</div>' +
        '<div>' + H.h2(C, 'Dónde vender') + R.I.vender.map(function (v) { return '<div style="margin:0 0 1.5mm">· ' + esc(v) + '</div>'; }).join('') + '<div style="margin-top:3mm;padding:2.5mm 3mm;border-radius:' + T.r + 'px;background:' + T.soft2 + ';font-size:.9em"><b>Ojo:</b> ' + esc(R.I.riesgo) + '</div></div></div>' +
        H.h2(C, 'Comprueba tus números') + pg.items.map(function (x, i) { return H.itemHTML(x, i, C, 'print', 'e' + pg.num); }).join('') + H.folio(C, pg);
    },
    emp_lienzo: function (pg, C) {
      var T = C.T, R = pg.idea ? calcular(pg.idea, C) : null, b = function (t, h, a) { return '<div style="grid-area:' + a + ';border:0.3mm solid ' + T.ink + ';padding:2mm;border-radius:2px;min-height:' + h + 'mm"><div style="font-size:.78em;font-weight:700;color:' + T.acc + ';text-transform:uppercase;letter-spacing:.04em">' + t + '</div></div>'; };
      return cab(C, pg, 'Lienzo de mi negocio' + (R ? ': ' + R.I.n : ''), 'Rellena cada bloque con frases cortas. Empieza por los clientes y la propuesta de valor.') +
        '<div style="display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:auto auto auto;grid-template-areas:\'s a v r c\' \'s k v h c\' \'f f f i i\';gap:1.5mm">' + b('Socios clave', 90, 's') + b('Actividades clave', 44, 'a') + b('Propuesta de valor', 90, 'v') + b('Relación con clientes', 44, 'r') + b('Clientes', 90, 'c') + b('Recursos clave', 44, 'k') + b('Canales', 44, 'h') + b('Costos', 40, 'f') + b('Ingresos', 40, 'i') + '</div>' + H.folio(C, pg);
    },
    emp_escenarios: function (pg, C) {
      var T = C.T, S = smi(C), L = locales(C).map(function (I) { return calcular(I, C); }), Q = [10, 25, 50], td = 'padding:1.4mm 1.5mm;text-align:right';
      var filas = L.map(function (R, i) { return '<tr style="background:' + (i % 2 ? T.soft2 : 'transparent') + '"><td style="padding:1.4mm 1.5mm"><b>' + esc(R.I.n) + '</b><div style="font-size:.85em;opacity:.8">' + esc($(R.INV, C)) + ' para empezar · ' + esc($(R.P, C)) + ' por ' + esc(R.I.u) + ' · costo ' + esc($(R.CV, C)) + '</div></td>' + Q.map(function (q) { var g = Math.round(R.MU * q - R.FIJ); return '<td style="' + td + ';font-weight:700;color:' + (g < 0 ? T.acc2 : g >= S.v ? T.acc : T.ink) + '">' + esc($(g, C)) + '<div style="font-weight:400;font-size:.8em;opacity:.8">' + Math.round(q * R.I.h) + ' h de trabajo</div></td>'; }).join('') + '<td style="' + td + '">' + (R.MU > 0 ? Math.ceil((R.FIJ + S.v) / R.MU) : '—') + '</td></tr>'; }).join('');
      return cab(C, pg, 'Negocios artesanales en ' + C.P.n + ': 10, 25 o 50 al mes', 'Importes orientativos para ' + (ZONA[C.pk] || C.P.n) + ' (' + REVISION + ')' + (C.pk === 've' ? ', calculados en dólares y convertidos a ' + tasa(C) + ' Bs por dólar; actualiza con la tasa oficial del día' : '') + '. Ganancia al mes = margen × unidades − gastos fijos.') +
        '<table style="width:100%;border-collapse:collapse;font-size:.84em;font-variant-numeric:tabular-nums"><tr style="background:' + T.acc + ';color:#fff">' + ['Negocio', '10 al mes', '25 al mes', '50 al mes', 'Unidades para cobrar el mínimo'].map(function (h, i) { return '<th style="padding:1.6mm 1.5mm;text-align:' + (i ? 'right' : 'left') + '">' + h + '</th>'; }).join('') + '</tr>' + filas + '</table>' +
        '<div style="display:flex;gap:3mm;margin:4mm 0 2mm">' + dato(C, 'Salario mínimo de referencia', $(S.v, C) + ' al mes', true) + '</div><p style="margin:0 0 3mm;font-size:.88em">' + esc(S.t) + '</p>' +
        H.guia(C, 'Las horas salen del tiempo que lleva hacer cada unidad. Si la ganancia no llega al salario mínimo con las horas que puedes trabajar, sube el precio, baja los gastos fijos o vende por encargo con anticipo.', true) + H.folio(C, pg);
    },
    emp_plan: function (pg, C, modo) {
      var R = calcular(pg.idea, C), T = C.T;
      return cab(C, pg, 'Mi plan a 12 meses: ' + R.I.n, 'Supone que empiezas vendiendo la mitad y llegas a ' + R.q + ' ' + R.I.u + 's al mes hacia el mes 9. Las filas sombreadas ya tienen el saldo en positivo.') +
        '<div data-emp-tabla="1">' + planTabla({ p: R.P, cv: R.CV, q: R.q, fij: R.FIJ, inv: R.INV }, function (n) { return $(n, C); }, T) + '</div>' + (modo === 'web' ? calculadora(R, C, true) : '') +
        H.h2(C, 'Mis números (rellena con los tuyos)') + tbl(C, [['Precio de venta', '__________'], ['Costo por unidad', '__________'], ['Gastos fijos al mes', '__________'], ['Unidades que espero vender', '__________'], ['Punto de equilibrio', '__________'], ['Meses para recuperar', '__________']]) + H.folio(C, pg);
    },
    emp_slide: function (pg, C) {
      var T = C.T, R = calcular(pg.idea, C), s = pg.s, big = function (t) { return '<div style="font-family:' + T.tit + ';font-weight:' + T.peso + ';font-size:' + (C.fs * 2.6) + 'px;line-height:1.1;color:' + T.acc + ';margin:0 0 4mm">' + esc(t) + '</div>'; }, li = function (a) { return a.map(function (x) { return '<div style="font-size:1.3em;margin:0 0 2.5mm">· ' + esc(x) + '</div>'; }).join(''); };
      var S = [
        function () { return '<div style="display:flex;flex-direction:column;justify-content:center;height:100%"><div style="font-size:1.1em;opacity:.8">' + esc(C.P.n) + ' · ' + esc(REVISION) + '</div>' + big(R.I.n) + '<div style="font-size:1.4em">' + esc(R.I.d) + '</div></div>'; },
        function () { return big('El problema') + li(['Quien busca ' + R.I.u + 's de calidad no encuentra opciones cercanas y personalizadas', 'Lo industrial es igual para todos', 'Encargar suele ser lento y caro']); },
        function () { return big('Nuestra solución') + li([R.I.d, 'Hecho a mano y a medida', 'Entrega rápida en ' + C.P.ciudades[0]]); },
        function () { return big('Clientes') + li(R.I.vender); },
        function () { return big('Cómo ganamos dinero') + '<div style="display:flex;gap:4mm">' + dato(C, 'Precio', $(R.P, C)) + dato(C, 'Costo', $(R.CV, C)) + dato(C, 'Margen', R.MARGEN + ' %', true) + '</div>'; },
        function () { return big('Mercado y competencia') + li(['Clientes del barrio, redes y empresas', 'La competencia vende más barato pero sin personalizar', 'Nuestro hueco: diseño propio y trato cercano']); },
        function () { return big('Plan de ventas') + li(R.I.pasos.slice(0, 4)); },
        function () { return big('Inversión') + tbl(C, R.inv.map(function (x) { return [x[0], $(x[1], C)]; }), ['Total', $(R.INV, C)]); },
        function () { return big('Números de un mes') + infografia(R, C); },
        function () { return big('Punto de equilibrio') + equilibrioSVG(R, C); },
        function () { return big('Riesgos y cómo los cubrimos') + li([R.I.riesgo, 'Colchón de tres meses de gastos fijos', 'Empezar pequeño y crecer con las ventas']); },
        function () { return '<div style="display:flex;flex-direction:column;justify-content:center;height:100%">' + big('Lo que pedimos') + '<div style="font-size:1.6em">' + esc($(R.INV, C)) + ' para arrancar, recuperables en ' + (isFinite(R.MESES) ? R.MESES + ' meses' : 'el plazo acordado') + '.</div></div>'; }
      ];
      return '<div style="height:100%;box-sizing:border-box">' + S[s % 12]() + '</div>';
    }
  };
  var VOZ = { emp_ficha: function (pg, C) { var R = calcular(pg.idea, C); return [{ t: R.I.n + '. Inversión ' + $(R.INV, C) + '. Ganancia al mes ' + $(R.GAN, C) + '.', lang: C.P.lang }]; } };

  /* ─────────── productos ─────────── */
  function elegidas(C) { var o = C.op || {}, g = o.enfoque || 'todas', ids = o.ideas && o.ideas.length ? o.ideas : null; return ranking(C, g).map(function (R) { return R.I; }).filter(function (I) { return !ids || ids.indexOf(I.id) >= 0; }); }
  function unidadesEmp(C) { return CU.UNIDADES.filter(function (u) { return u.m === 'empre'; }); }
  function armarGuia(C, pool, N, r) {
    var ids = elegidas(C), core = [{ tipo: 'emp_pais', indice: 'Emprender en ' + C.P.n }], us = unidadesEmp(C);
    ['artesanal', 'oficio'].forEach(function (g) { if (ids.some(function (I) { return I.g === g; })) core.push({ tipo: 'emp_ranking', g: g, indice: G_N[g] + ': ranking' }); });
    if (locales(C).length && ids.some(function (I) { return I.g === 'artesanal'; })) core.push({ tipo: 'emp_escenarios', indice: 'Artesanales: 10, 25 o 50 al mes' });
    ids.forEach(function (I) { core.push({ tipo: 'emp_ficha', idea: I, indice: I.n, relleno: false }); core.push({ tipo: 'emp_ficha2', idea: I, items: itemsFicha(I, C) }); });
    us.forEach(function (u, i) { core.push({ tipo: 'apertura', u: u, n: i + 1, mini: true, relleno: true }); core.push({ tipo: 'explica', u: u, n: i + 1, relleno: true }); core.push({ tipo: 'actividad', u: u, n: i + 1, k: 0, relleno: true }); });
    var k = 0;
    return H.envolver(C, core, N, function () { var u = us[k % us.length]; k++; return { tipo: 'actividad', u: u, n: us.indexOf(u) + 1, k: 1 + Math.floor(k / us.length), relleno: true }; }, { indiceFilas: core.filter(function (p) { return p.indice; }).length + 2 });
  }
  function armarPlan(C, pool, N) {
    var ids = elegidas(C).slice(0, Math.max(1, Math.floor((N - 6) / 4))), core = [];
    ids.forEach(function (I) { core.push({ tipo: 'emp_ficha', idea: I, indice: I.n }); core.push({ tipo: 'emp_lienzo', idea: I }); core.push({ tipo: 'emp_plan', idea: I }); core.push({ tipo: 'emp_ficha2', idea: I, items: itemsFicha(I, C) }); });
    if (locales(C).length) core.push({ tipo: 'emp_escenarios', indice: 'Artesanales: 10, 25 o 50 al mes' });
    core.push({ tipo: 'emp_pais', indice: 'Trámites en ' + C.P.n });
    return H.envolver(C, core, N, function (k) { return { tipo: 'emp_lienzo', relleno: true }; }, { indiceFilas: ids.length + 2 });
  }
  function armarPitch(C, pool, N) { var I = elegidas(C)[0] || IDEAS[0], out = []; for (var s = 0; s < Math.min(12, N); s++) out.push({ tipo: 'emp_slide', idea: I, s: s }); return out; }

  var OPS = [{ k: 'tasa', n: 'Venezuela: Bs por dólar (vacío = referencia)', tipo: 'texto', def: '' }, { k: 'enfoque', n: 'Tipo de negocio', tipo: 'chips', def: 'todas', ops: [['todas', 'Todos'], ['artesanal', 'Artesanales'], ['oficio', 'Oficios y comercios']] }, { k: 'ideas', n: 'Negocios (vacío = todos, por rentabilidad)', tipo: 'multi', def: [], ops: IDEAS.map(function (I) { return [I.id, I.n]; }) }];
  ED.registrar({
    materias: [{ id: 'empre', n: 'Emprendimiento', ico: '🚀', al: { es: 'Economía y Emprendimiento', co: 'Emprendimiento', cl: 'Emprendimiento y Empleabilidad', mx: 'Emprendimiento', do: 'Emprendimiento' }, opciones: OPS, prodDef: 'emprender' }],
    unidades: U,
    generadores: GEN,
    paginas: PAG,
    voz: VOZ,
    productos: [
      { id: 'emprender', n: 'Cómo emprender en tu país', ico: '🚀', d: 'Trámites del país, ranking de negocios rentables, una ficha con inversión, ganancia e infografías por idea y unidades con ejercicios.', solo: ['empre'], sol: true, armar: armarGuia, titulo: function (C) { return 'Cómo emprender en ' + C.P.n; } },
      { id: 'plan_negocio', n: 'Mi plan de negocio', ico: '📊', d: 'Cuaderno calculado: ficha, lienzo, plan a 12 meses y comprobación de números por negocio.', solo: ['empre'], sol: true, armar: armarPlan, titulo: function (C) { return 'Mi plan de negocio'; } },
      { id: 'pitch', n: 'Pitch de 12 diapositivas', ico: '🎤', d: 'Presentación 16:9 del negocio elegido para inversores o jurados.', solo: ['empre'], papel: 'slide', armar: armarPitch, titulo: function (C) { return 'Pitch · ' + (elegidas(C)[0] || IDEAS[0]).n; } }
    ]
  });

  var LB = window.EU_LIBRO;
  if (LB && LB.SABER) LB.SABER.empre = [
    ['Nueve de cada diez empiezan pequeños', 'La gran mayoría de las empresas del mundo son micro y pequeñas empresas: dan trabajo a más de la mitad de las personas ocupadas.'],
    ['El lienzo de Osterwalder', 'El lienzo del modelo de negocio lo propuso Alexander Osterwalder en 2008 y hoy se usa en escuelas de negocio de todo el mundo.'],
    ['Las microfinanzas', 'Muhammad Yunus fundó el Grameen Bank en Bangladés en 1983 para prestar pequeñas cantidades a personas sin acceso al banco; recibió el Nobel de la Paz en 2006.'],
    ['Validar antes de invertir', 'El método «lean startup» propone lanzar un producto mínimo, medir cómo responde el cliente y aprender antes de gastar mucho.'],
    ['El valor de lo hecho a mano', 'Los productos artesanales se venden mejor cuando cuentan su historia: quién los hace, con qué materiales y cuánto tiempo llevan.'],
    ['La regla de los tres meses', 'Muchos asesores recomiendan guardar el equivalente a tres meses de gastos fijos antes de depender solo del negocio.']
  ];

  /* ─────────── calculadora en pantalla ─────────── */
  function calc(el) {
    var box = el.closest ? el.closest('[data-emp-calc]') : null; if (!box) return;
    var v = {}; Array.prototype.forEach.call(box.querySelectorAll('[data-emp]'), function (i) { v[i.getAttribute('data-emp')] = parseFloat(String(i.value).replace(',', '.')) || 0; });
    var loc = box.getAttribute('data-loc'), m = box.getAttribute('data-mon'), f = function (n) { try { return new Intl.NumberFormat(loc, { style: 'currency', currency: m, maximumFractionDigits: 0 }).format(n); } catch (e) { return Math.round(n); } };
    var mu = v.p - v.cv, gan = mu * v.q - v.fij, pe = mu > 0 ? Math.ceil(v.fij / mu) : '—', meses = gan > 0 ? Math.ceil(v.inv / gan) : '—';
    box.querySelector('[data-emp-out]').textContent = 'Ganancia al mes: ' + f(gan) + ' · Punto de equilibrio: ' + pe + ' unidades · Recuperas en: ' + meses + (meses === '—' ? '' : ' meses') + ' · Margen: ' + (v.p ? Math.round(mu / v.p * 100) : 0) + ' %';
  }
  /* Cuaderno «Mi plan de negocio»: al cambiar los datos se rehace el plan a 12 meses */
  function calcPlan(el) {
    var box = el.closest ? el.closest('[data-emp-calc]') : null, tb = box && box.parentNode ? box.parentNode.querySelector('[data-emp-tabla]') : null; if (!tb) return;
    var v = {}; Array.prototype.forEach.call(box.querySelectorAll('[data-emp]'), function (i) { v[i.getAttribute('data-emp')] = parseFloat(String(i.value).replace(',', '.')) || 0; });
    var T = {}; try { T = JSON.parse(box.getAttribute('data-t') || '{}'); } catch (e) {}
    var loc = box.getAttribute('data-loc'), m = box.getAttribute('data-mon'), fm = function (n) { try { return new Intl.NumberFormat(loc, { style: 'currency', currency: m, maximumFractionDigits: 0 }).format(n); } catch (e) { return String(Math.round(n)); } };
    tb.innerHTML = planTabla(v, fm, { acc: T.acc || '#333', acc2: T.acc2 || '#933', soft: T.soft || '#eee' });
  }
  document.addEventListener('focusin', function (e) { if (e.target && e.target.getAttribute && e.target.getAttribute('data-emp')) calc(e.target); });

  window.EU_EMPRE = { _eq: equilibrioSVG, _inf: infografia, IDEAS: IDEAS, PAIS: PAIS, GEN: GEN, LOCAL: LOCAL, SMI: SMI, ZONA: ZONA, TASA_VE: TASA_VE, smi: smi, locales: locales, calcular: calcular, ranking: ranking, calc: calc, calcPlan: calcPlan, FX: FX, REVISION: REVISION };
})();
