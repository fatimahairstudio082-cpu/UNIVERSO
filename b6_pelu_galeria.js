/* b6_pelu_galeria.js — «Galería web» de Fátima conectada a la biblioteca del sistema (`window.EU_PELU_GALERIA`, 23-10-2026).
   Fátima: «la galería ya está bien, se ven las imágenes bien; no la desorganices: conéctala con la biblioteca del sistema para
   que se vean los maniquíes junto con un recurso de imagen, el vídeo, la animación». Su galería (organizada con ChatGPT y en
   otra conversación con Claude: carpeta «GALERIA_WEB_index_html» / «videos reutilizables › BIBLIOTECA») se copia TAL CUAL en
   `referencias/galeria_web/imagenes/<carpeta>/<archivo>` (mismos nombres, sin recortar ni renombrar). Los datos de abajo son
   los de su index.html: número, título, categoría, archivo y descripción.
   · Biblioteca: cada imagen es un modelo de EU_MODELOS (`pelu`, id `pe_gw_NNN`, familia `gw<categoría>` = «Galería web · …»).
   · Libro: una hoja por imagen, `pe_galeria`: la imagen, el maniquí de su técnica o de su corte (una escena distinta en cada
     hoja de la misma técnica) y el texto escrito (descripción de su galería + lo que dice esa escena + los pasos de la técnica,
     o la ficha del corte en EU_CORTES). Solo en las unidades que lleva el libro; primero huecos y luego hojas nuevas al final de
     su unidad, antes del tutor. Relación imagen → técnica: por el título y la carpeta (`tecDe`); la que no sale del título ni
     de la carpeta va marcada «a validar por Fátima».
   · Curso premium: lecciones «Galería · <módulo>» en su módulo (10 imágenes por lección), cada imagen con su explicación.
   `cfg.acab.galeria = 'no'` lo apaga; `'huecos'` solo usa huecos. Cargar después de b6_pelu_referencias.js. */
(function () {
  'use strict';
  if (window.EU_PELU_GALERIA) return;
  var DIR = './referencias/galeria_web/imagenes/';
  var CATS = {"01": "Retratos negro y oscuro", "02": "Retratos castaño y caramelo", "03": "Retratos rubios", "04": "Retratos cobrizos", "05": "Retratos vino y borgoña", "06": "Retratos de fantasía", "07": "Ruedas y paletas de color", "08": "Cartas de mechones", "09": "Texturas de color", "10": "Fichas de corte de dama", "11": "Fichas de colorimetría", "12": "Coloración global y reflejos", "13": "Retoque de raíz", "14": "Mechas y babylights", "15": "Balayage, ombré y sombré", "16": "Rubios", "17": "Morenas iluminadas", "18": "Cobrizos, rojos y caobas", "19": "Fríos, cenizas y matización", "20": "Fantasía y tonos vivos", "21": "Correcciones y transformaciones", "22": "Técnicas avanzadas",
    /* 25-10-2026 (Fátima, «NUEVAS_CARPETAS_BIBLIOTECA»): carpetas 25 a 28, imágenes tal cual */
    "25": "Técnicas de aplicación de tintes y mechas", "26": "Particiones del cabello", "27": "Herramientas de peluquería", "28": "Cuadros formativos",
    /* 30-10-2026 (Fátima, biblioteca actualizada): carpetas 29 a 41, con los nombres de su index.html */
    "29": "Lavado y cuidado del cabello", "30": "Ciencia del cabello y cutícula", "31": "Salón: clienta y corte", "32": "Secado con cepillo y secador",
    "33": "Planchado", "34": "Mechas con papel y gorro", "35": "Cortes por forma y vista", "36": "Pollina y flequillo", "37": "Divisiones para mechas y balayage",
    "38": "Tintes, mezclas y aplicación", "39": "Técnicas de corte y estilos en foto", "40": "Guías de partición por forma de corte", "41": "Postura del peluquero"};
  var DESC = ["Carta de mechones para comparar alturas de tono y reflejos sobre cabello real.", "Compara la altura del rubio, su temperatura y el brillo general del resultado.", "Compara la intensidad del reflejo cobrizo o rojizo y su uniformidad.", "Estudia la finura de los mechones, el contraste y la ubicación de la luz.", "Ficha de corte con sus vistas de referencia para comparar forma, largo, capas y contorno.", "Ficha de técnica de color con sus vistas de referencia para comparar distribución y acabado.", "Fíjate en la profundidad de raíz, la transición hacia medios y la continuidad del tono.", "Observa cómo se integra la luz en base oscura y el reflejo dominante.", "Observa el punto de partida, el matiz a corregir y el resultado final.", "Observa la distribución del color, la profundidad de raíz y el acabado general.", "Observa la transición gradual y la relación entre raíz, medios y puntas.", "Referencia de matiz y temperatura; compara la neutralidad del acabado.", "Referencia de técnicas combinadas: distribución, contraste y acabado final.", "Retrato cobrizo para observar la intensidad del cobre, el brillo y el movimiento.", "Retrato de cabello negro u oscuro para observar brillo, reflejos y profundidad del tono.", "Retrato de color fantasía para valorar saturación, uniformidad y acabado.", "Retrato en tonos castaño y caramelo para comparar transiciones, luz y reflejos.", "Retrato en tonos vino y borgoña para comparar profundidad y reflejo rojizo.", "Retrato rubio para estudiar la altura de tono, la temperatura y la luminosidad.", "Rueda cromática o paleta de referencia para elegir tonos, contrastes y combinaciones.", "Textura de color a escala de cabello para observar degradados, brillo y fusión de matices.", "Valora la saturación, la uniformidad y la limpieza del color fantasía.", "Referencia de técnica de aplicación de color: observa la zona trabajada, el patrón de las secciones y el resultado.", "Referencia de partición: observa por dónde va cada línea, cuántas secciones salen y en qué zona de la cabeza.", "Herramienta de peluquería: reconócela por su forma y fíjate en qué paso del trabajo se usa.", "Cuadro formativo: compara el producto o el proceso con el resultado que se obtiene.", "Esquema de división del cabello para cortar, colorear, peinar o secar con orden y simetría.", "Referencia del servicio de lavado: posición, aclarado, toallas, productos e hidratación.", "Estructura de la fibra capilar: cutícula abierta o cerrada, hidratación, calor y daño.", "Escena de salón: recepción de la clienta, capa, trabajo con tijera y resultado en el sillón.", "Técnica de secado: posición del cepillo, secador y control por secciones.", "Técnica de planchado: mechón, dirección y resultado liso.", "Mechas con papel foil y técnica de gorro: colocación, aplicación y resultado.", "Comparativo de formas de corte (cuadrado, semi U, redondo, capas U y V) y su proceso.", "Pollina y flequillo: cómo se saca el triángulo, divisiones frontales por tipo de flequillo y corte paso a paso.", "Esquema de división por patrón (horizontal, V, U, zigzag, ladrillo, abanico) para mechas, encixas, papel de aluminio y balayage.", "Tintes y mezclas: divisiones, aplicación en raíz y canas, mezclas en bowl, peróxido, diagnóstico y resultados.", "Técnica de corte, flequillo, divisiones con clips y color, vistos en fotografía de referencia.", "Guía de partición del cabello según la forma del corte: en V, cuadrado, redondo, en U, semicuadrado y redondo recto.", "Cómo se coloca el peluquero respecto a la clienta al hacer las divisiones y cada tipo de corte."];
  var G = [
    [1, "Bob castaño oscuro perfil", "01", "01_Retratos_Negro_Oscuro/bob_castano_oscuro_perfil.jpg", 14],
    [2, "Negro liso frente", "01", "01_Retratos_Negro_Oscuro/negro_liso_frente.jpg", 14],
    [3, "Negro liso perfil", "01", "01_Retratos_Negro_Oscuro/negro_liso_perfil.jpg", 14],
    [4, "Negro ondulado 3/4", "01", "01_Retratos_Negro_Oscuro/negro_ondulado_3-4.jpg", 14],
    [5, "Negro ondulado 3/4 B", "01", "01_Retratos_Negro_Oscuro/negro_ondulado_3-4_b.jpg", 14],
    [6, "Negro ondulado frente", "01", "01_Retratos_Negro_Oscuro/negro_ondulado_frente.jpg", 14],
    [7, "Balayage castaño frente", "02", "02_Retratos_Castano_Caramelo/balayage_castano_frente.jpg", 16],
    [8, "Bob ondulado castaño", "02", "02_Retratos_Castano_Caramelo/bob_ondulado_castano.jpg", 16],
    [9, "Caramelo ondulado", "02", "02_Retratos_Castano_Caramelo/caramelo_ondulado.jpg", 16],
    [10, "Liso ombré espalda", "02", "02_Retratos_Castano_Caramelo/liso_ombre_espalda.jpg", 16],
    [11, "Ombré caramelo frente", "02", "02_Retratos_Castano_Caramelo/ombre_caramelo_frente.jpg", 16],
    [12, "Ondulado castaño espalda", "02", "02_Retratos_Castano_Caramelo/ondulado_castano_espalda.jpg", 16],
    [13, "Pixie castaño perfil", "02", "02_Retratos_Castano_Caramelo/pixie_castano_perfil.jpg", 16],
    [14, "Bob rubio ceniza", "03", "03_Retratos_Rubio/bob_rubio_ceniza.jpg", 18],
    [15, "Bob rubio shag perfil", "03", "03_Retratos_Rubio/bob_rubio_shag_perfil.jpg", 18],
    [16, "Rubio liso perfil", "03", "03_Retratos_Rubio/rubio_liso_perfil.jpg", 18],
    [17, "Rubio ombré frente", "03", "03_Retratos_Rubio/rubio_ombre_frente.jpg", 18],
    [18, "Rubio ondulado 3/4", "03", "03_Retratos_Rubio/rubio_ondulado_3-4.jpg", 18],
    [19, "Rubio ondulado frente", "03", "03_Retratos_Rubio/rubio_ondulado_frente.jpg", 18],
    [20, "Cobrizo liso 3/4", "04", "04_Retratos_Cobrizo/cobrizo_liso_3-4.jpg", 13],
    [21, "Cobrizo ondulado 3/4", "04", "04_Retratos_Cobrizo/cobrizo_ondulado_3-4.jpg", 13],
    [22, "Cobrizo ondulado frente", "04", "04_Retratos_Cobrizo/cobrizo_ondulado_frente.jpg", 13],
    [23, "Borgoña ondulado 3/4", "05", "05_Retratos_Vino_Borgona/borgona_ondulado_3-4.jpg", 17],
    [24, "Vino ondulado perfil", "05", "05_Retratos_Vino_Borgona/vino_ondulado_perfil.jpg", 17],
    [25, "Azul marino ondulado", "06", "06_Retratos_Fantasia/azul_marino_ondulado.jpg", 15],
    [26, "Bob rosa pastel", "06", "06_Retratos_Fantasia/bob_rosa_pastel.jpg", 15],
    [27, "Rosa pastel ondulado", "06", "06_Retratos_Fantasia/rosa_pastel_ondulado.jpg", 15],
    [28, "Verde esmeralda ondulado", "06", "06_Retratos_Fantasia/verde_esmeralda_ondulado.jpg", 15],
    [29, "Paleta cálida 6 col.", "07", "07_Ruedas_y_Paletas_de_Color/paleta_calida_6col.jpg", 19],
    [30, "Paleta cálida 8 col.", "07", "07_Ruedas_y_Paletas_de_Color/paleta_calida_8col.jpg", 19],
    [31, "Paleta castaños", "07", "07_Ruedas_y_Paletas_de_Color/paleta_castanos.jpg", 19],
    [32, "Paleta coral morado verde", "07", "07_Ruedas_y_Paletas_de_Color/paleta_coral_morado_verde.jpg", 19],
    [33, "Paleta morado azul turquesa", "07", "07_Ruedas_y_Paletas_de_Color/paleta_morado_azul_turquesa.jpg", 19],
    [34, "Paleta neutros azules", "07", "07_Ruedas_y_Paletas_de_Color/paleta_neutros_azules.jpg", 19],
    [35, "Paleta rosa azul", "07", "07_Ruedas_y_Paletas_de_Color/paleta_rosa_azul.jpg", 19],
    [36, "Paleta rosa morado", "07", "07_Ruedas_y_Paletas_de_Color/paleta_rosa_morado.jpg", 19],
    [37, "Paleta rosa morado amplia", "07", "07_Ruedas_y_Paletas_de_Color/paleta_rosa_morado_amplia.jpg", 19],
    [38, "Paleta tonos piel y vivos", "07", "07_Ruedas_y_Paletas_de_Color/paleta_tonos_piel_y_vivos.jpg", 19],
    [39, "Paleta turquesa azul", "07", "07_Ruedas_y_Paletas_de_Color/paleta_turquesa_azul.jpg", 19],
    [40, "Paleta verde beige", "07", "07_Ruedas_y_Paletas_de_Color/paleta_verde_beige.jpg", 19],
    [41, "Rueda cromática", "07", "07_Ruedas_y_Paletas_de_Color/rueda_cromatica.jpg", 19],
    [42, "Carta mechones aro", "08", "08_Cartas_de_Mechones/carta_mechones_aro.jpg", 0],
    [43, "Mechones abanico naranja rojo", "08", "08_Cartas_de_Mechones/mechones_abanico_naranja_rojo.jpg", 0],
    [44, "Textura arcoíris", "09", "09_Texturas_de_Color/textura_arcoiris.jpg", 20],
    [45, "Textura azul", "09", "09_Texturas_de_Color/textura_azul.jpg", 20],
    [46, "Textura azul morado", "09", "09_Texturas_de_Color/textura_azul_morado.jpg", 20],
    [47, "Textura morado", "09", "09_Texturas_de_Color/textura_morado.jpg", 20],
    [48, "Textura rosa", "09", "09_Texturas_de_Color/textura_rosa.jpg", 20],
    [49, "Textura verde", "09", "09_Texturas_de_Color/textura_verde.jpg", 20],
    [50, "Corte cuadrado", "10", "10_Fichas_Cortes_de_Dama/01_Cuadrado.jpg", 4],
    [51, "Corte en V", "10", "10_Fichas_Cortes_de_Dama/02_En_V.jpg", 4],
    [52, "Corte en U", "10", "10_Fichas_Cortes_de_Dama/03_En_U.jpg", 4],
    [53, "Corte redondo", "10", "10_Fichas_Cortes_de_Dama/04_Redondo.jpg", 4],
    [54, "Corte escalonado", "10", "10_Fichas_Cortes_de_Dama/05_Escalonado.jpg", 4],
    [55, "Corte hongo", "10", "10_Fichas_Cortes_de_Dama/06_Hongo.jpg", 4],
    [56, "Corte picado", "10", "10_Fichas_Cortes_de_Dama/07_Picado.jpg", 4],
    [57, "Corte bob", "10", "10_Fichas_Cortes_de_Dama/08_Bob.jpg", 4],
    [58, "Long bob (lob)", "10", "10_Fichas_Cortes_de_Dama/09_Long_Bob_Lob.jpg", 4],
    [59, "Corte mariposa", "10", "10_Fichas_Cortes_de_Dama/10_Mariposa.jpg", 4],
    [60, "Corte capas largas", "10", "10_Fichas_Cortes_de_Dama/11_Capas_Largas.jpg", 4],
    [61, "Corte degradado", "10", "10_Fichas_Cortes_de_Dama/12_Degradado.jpg", 4],
    [62, "Corte B larga", "10", "10_Fichas_Cortes_de_Dama/13_Corte_B_Larga.jpg", 4],
    [63, "Corte semirredondo", "10", "10_Fichas_Cortes_de_Dama/14_Semirredondo.jpg", 4],
    [64, "Corte recto", "10", "10_Fichas_Cortes_de_Dama/15_Recto.jpg", 4],
    [65, "Corte asimétrico", "10", "10_Fichas_Cortes_de_Dama/16_Asimetrico.jpg", 4],
    [66, "Corte desfilado", "10", "10_Fichas_Cortes_de_Dama/17_Desfilado.jpg", 4],
    [67, "Corte pixie", "10", "10_Fichas_Cortes_de_Dama/18_Pixie.jpg", 4],
    [68, "Corte shag", "10", "10_Fichas_Cortes_de_Dama/19_Shag.jpg", 4],
    [69, "Corte mullet", "10", "10_Fichas_Cortes_de_Dama/20_Mullet.jpg", 4],
    [70, "Corte rizado", "10", "10_Fichas_Cortes_de_Dama/21_Rizado.jpg", 4],
    [71, "Corte largo recto", "10", "10_Fichas_Cortes_de_Dama/22_Largo_Recto.jpg", 4],
    [72, "Corte con flequillo", "10", "10_Fichas_Cortes_de_Dama/23_Con_Flequillo.jpg", 4],
    [73, "Balayage", "11", "11_Fichas_Colorimetria/01_Balayage.jpg", 5],
    [74, "Mechas universales", "11", "11_Fichas_Colorimetria/02_Mechas_Universales.jpg", 5],
    [75, "Mechas con gorro", "11", "11_Fichas_Colorimetria/03_Mechas_con_Gorro.jpg", 5],
    [76, "Mechas con papel aluminio", "11", "11_Fichas_Colorimetria/04_Mechas_con_Papel_Aluminio.jpg", 5],
    [77, "Babylights", "11", "11_Fichas_Colorimetria/05_Babylights.jpg", 5],
    [78, "Airtouch", "11", "11_Fichas_Colorimetria/06_Airtouch.jpg", 5],
    [79, "Contouring", "11", "11_Fichas_Colorimetria/07_Contouring.jpg", 5],
    [80, "Rubio platino", "11", "11_Fichas_Colorimetria/08_Rubio_Platino.jpg", 5],
    [81, "Rubio beige", "11", "11_Fichas_Colorimetria/09_Rubio_Beige.jpg", 5],
    [82, "Cobrizos", "11", "11_Fichas_Colorimetria/10_Cobrizos.jpg", 5],
    [83, "Chocolates", "11", "11_Fichas_Colorimetria/11_Chocolates.jpg", 5],
    [84, "Fantasía", "11", "11_Fichas_Colorimetria/12_Fantasia.jpg", 5],
    [85, "Matización", "11", "11_Fichas_Colorimetria/13_Matizacion.jpg", 5],
    [86, "Corrección de color", "11", "11_Fichas_Colorimetria/14_Correccion_de_Color.jpg", 5],
    [87, "Color global", "11", "11_Fichas_Colorimetria/15_Color_Global.jpg", 5],
    [88, "Rubio miel", "11", "11_Fichas_Colorimetria/16_Rubio_Miel.jpg", 5],
    [89, "Raíces sombra", "11", "11_Fichas_Colorimetria/17_Raices_Sombra.jpg", 5],
    [90, "Efecto raíz", "11", "11_Fichas_Colorimetria/18_Efecto_Raiz.jpg", 5],
    [91, "Melena multitono", "11", "11_Fichas_Colorimetria/19_Melena_Multitono.jpg", 5],
    [92, "Tonos pastel", "11", "11_Fichas_Colorimetria/20_Tonos_Pastel.jpg", 5],
    [93, "Color fantasía", "11", "11_Fichas_Colorimetria/21_Color_Fantasia.jpg", 5],
    [94, "Caramelo", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Caramelo_C019.jpg", 9],
    [95, "Chocolate con reflejos", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Chocolate_con_reflejos_D071.jpg", 9],
    [96, "Coloración global castaño", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Coloracion_global_castano_D001.jpg", 9],
    [97, "Coloración global chocolate", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Coloracion_global_chocolate_D002.jpg", 9],
    [98, "Coloración global rubio claro", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Coloracion_global_rubio_claro_D005.jpg", 9],
    [99, "Coloración global rubio medio", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Coloracion_global_rubio_medio_D004.jpg", 9],
    [100, "Coloración global rubio oscuro", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Coloracion_global_rubio_oscuro_D003.jpg", 9],
    [101, "Reflejos perla", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Reflejos_perla_C020.jpg", 9],
    [102, "Rubio miel", "12", "12_Colorimetria_Coloracion_Global_y_Reflejos/Rubio_miel_C015.jpg", 9],
    [103, "Retoque de raíz caoba", "13", "13_Colorimetria_Retoque_de_Raiz/Retoque_de_raiz_caoba_D014.jpg", 6],
    [104, "Retoque de raíz castaño", "13", "13_Colorimetria_Retoque_de_Raiz/Retoque_de_raiz_castano_D011.jpg", 6],
    [105, "Retoque de raíz ceniza", "13", "13_Colorimetria_Retoque_de_Raiz/Retoque_de_raiz_ceniza_D015.jpg", 6],
    [106, "Retoque de raíz cobrizo", "13", "13_Colorimetria_Retoque_de_Raiz/Retoque_de_raiz_cobrizo_D013.jpg", 6],
    [107, "Retoque de raíz fantasía", "13", "13_Colorimetria_Retoque_de_Raiz/Retoque_de_raiz_fantasia_D016.jpg", 6],
    [108, "Retoque de raíz platino", "13", "13_Colorimetria_Retoque_de_Raiz/Retoque_de_raiz_platino_D017.jpg", 6],
    [109, "Retoque de raíz rubio", "13", "13_Colorimetria_Retoque_de_Raiz/Retoque_de_raiz_rubio_D012.jpg", 6],
    [110, "Babylights beige", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_beige_D043.jpg", 3],
    [111, "Babylights caoba", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_caoba_D047.jpg", 3],
    [112, "Babylights ceniza", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_ceniza_D042.jpg", 3],
    [113, "Babylights chocolate", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_chocolate_D048.jpg", 3],
    [114, "Babylights cobrizo", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_cobrizo_D046.jpg", 3],
    [115, "Babylights dorado", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_dorado_D044.jpg", 3],
    [116, "Babylights en capas", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_en_capas_D049.jpg", 3],
    [117, "Babylights en flequillo", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_en_flequillo_D050.jpg", 3],
    [118, "Babylights perla", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_perla_D045.jpg", 3],
    [119, "Babylights rubio", "14", "14_Colorimetria_Mechas_y_Babylights/Babylights_rubio_D041.jpg", 3],
    [120, "Mechas babylights", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_babylights_D022.jpg", 3],
    [121, "Mechas californianas", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_californianas_D021.jpg", 3],
    [122, "Mechas chunky", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_chunky_D026.jpg", 3],
    [123, "Mechas clásicas", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_clasicas_C001.jpg", 3],
    [124, "Mechas clásicas finas", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_clasicas_finas_D018.jpg", 3],
    [125, "Mechas clásicas frontales", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_clasicas_frontales_D020.jpg", 3],
    [126, "Mechas clásicas gruesas", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_clasicas_gruesas_D019.jpg", 3],
    [127, "Mechas contorno facial", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_contorno_facial_D029.jpg", 3],
    [128, "Mechas en U", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_en_U_D028.jpg", 3],
    [129, "Mechas en V", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_en_V_D027.jpg", 3],
    [130, "Mechas en raíces", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_en_raices_D030.jpg", 3],
    [131, "Mechas foil (papel de aluminio)", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_foil_papel_aluminio_D023.jpg", 3],
    [132, "Mechas money piece", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_money_piece_D025.jpg", 3],
    [133, "Mechas zigzag", "14", "14_Colorimetria_Mechas_y_Babylights/Mechas_zigzag_D024.jpg", 3],
    [134, "Teasylights", "14", "14_Colorimetria_Mechas_y_Babylights/Teasylights_C008.jpg", 3],
    [135, "Balayage clásico", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_C003.jpg", 10],
    [136, "Balayage beige", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_beige_D033.jpg", 10],
    [137, "Balayage caramelo", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_caramelo_D032.jpg", 10],
    [138, "Balayage ceniza", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_ceniza_D034.jpg", 10],
    [139, "Balayage cobre", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_cobre_D036.jpg", 10],
    [140, "Balayage dorado", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_dorado_D035.jpg", 10],
    [141, "Balayage en cabello corto", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_en_cabello_corto_D039.jpg", 10],
    [142, "Balayage en cabello rizado", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_en_cabello_rizado_D040.jpg", 10],
    [143, "Balayage fumé", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_fume_D037.jpg", 10],
    [144, "Balayage inverso", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_inverso_D038.jpg", 10],
    [145, "Balayage miel", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Balayage_miel_D031.jpg", 10],
    [146, "Melt", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Melt_C090.jpg", 10],
    [147, "Ombré azul", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Ombre_azul_D055.jpg", 10],
    [148, "Ombré caramelo", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Ombre_caramelo_D052.jpg", 10],
    [149, "Ombré ceniza", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Ombre_ceniza_D053.jpg", 10],
    [150, "Ombré rosa", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Ombre_rosa_D054.jpg", 10],
    [151, "Ombré rubio", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Ombre_rubio_D051.jpg", 10],
    [152, "Sombras", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombras_C085.jpg", 10],
    [153, "Sombras cálidas", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombras_calidas_C088.jpg", 10],
    [154, "Sombras frías", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombras_frias_C086.jpg", 10],
    [155, "Sombré ceniza", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombre_ceniza_D057.jpg", 10],
    [156, "Sombré cobrizo", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombre_cobrizo_D059.jpg", 10],
    [157, "Sombré dorado", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombre_dorado_D058.jpg", 10],
    [158, "Sombré natural", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombre_natural_D056.jpg", 10],
    [159, "Sombré pastel", "15", "15_Colorimetria_Balayage_Ombre_Sombre/Sombre_pastel_D060.jpg", 10],
    [160, "Rubio arena", "16", "16_Colorimetria_Rubios/Rubio_arena_C049.jpg", 1],
    [161, "Rubio beige", "16", "16_Colorimetria_Rubios/Rubio_beige_D074.jpg", 1],
    [162, "Rubio cálido", "16", "16_Colorimetria_Rubios/Rubio_calido_C047.jpg", 1],
    [163, "Rubio ceniza", "16", "16_Colorimetria_Rubios/Rubio_ceniza_D075.jpg", 1],
    [164, "Rubio champagne", "16", "16_Colorimetria_Rubios/Rubio_champagne_C041.jpg", 1],
    [165, "Rubio dorado", "16", "16_Colorimetria_Rubios/Rubio_dorado_D073.jpg", 1],
    [166, "Rubio escandinavo", "16", "16_Colorimetria_Rubios/Rubio_escandinavo_D078.jpg", 1],
    [167, "Rubio fresa", "16", "16_Colorimetria_Rubios/Rubio_fresa_D072.jpg", 1],
    [168, "Rubio frío", "16", "16_Colorimetria_Rubios/Rubio_frio_C048.jpg", 1],
    [169, "Rubio invierno", "16", "16_Colorimetria_Rubios/Rubio_invierno_C046.jpg", 1],
    [170, "Rubio mantequilla", "16", "16_Colorimetria_Rubios/Rubio_mantequilla_D079.jpg", 1],
    [171, "Rubio perla", "16", "16_Colorimetria_Rubios/Rubio_perla_D077.jpg", 1],
    [172, "Rubio platinado", "16", "16_Colorimetria_Rubios/Rubio_platinado_D076.jpg", 1],
    [173, "Rubio vainilla", "16", "16_Colorimetria_Rubios/Rubio_vainilla_D080.jpg", 1],
    [174, "Morena avellana", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_avellana_C056.jpg", 7],
    [175, "Morena caramelo", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_caramelo_C051.jpg", 7],
    [176, "Morena ceniza", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_ceniza_C054.jpg", 7],
    [177, "Morena chocolate", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_chocolate_C055.jpg", 7],
    [178, "Morena cobriza", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_cobriza_C057.jpg", 7],
    [179, "Morena dorada", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_dorada_C053.jpg", 7],
    [180, "Morena fría", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_fria_C058.jpg", 7],
    [181, "Morena iluminada", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_iluminada_C060.jpg", 7],
    [182, "Morena miel", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_miel_C052.jpg", 7],
    [183, "Morena mocha", "17", "17_Colorimetria_Morenas_Iluminadas/Morena_mocha_C059.jpg", 7],
    [184, "Auburn", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Auburn_C070.jpg", 2],
    [185, "Caoba intensa", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Caoba_intensa_D070.jpg", 2],
    [186, "Cobre rosa", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Cobre_rosa_C064.jpg", 2],
    [187, "Cobre viejo", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Cobre_viejo_C069.jpg", 2],
    [188, "Cobrizo dorado", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Cobrizo_dorado_D069.jpg", 2],
    [189, "Cobrizo intenso", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Cobrizo_intenso_D068.jpg", 2],
    [190, "Cobrizo natural", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Cobrizo_natural_C061.jpg", 2],
    [191, "Coloración global caoba", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Coloracion_global_caoba_D007.jpg", 2],
    [192, "Coloración global cobrizo", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Coloracion_global_cobrizo_D006.jpg", 2],
    [193, "Rojo borgoña", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Rojo_borgona_C067.jpg", 2],
    [194, "Rojo caoba", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Rojo_caoba_C068.jpg", 2],
    [195, "Rojo cereza", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Rojo_cereza_C065.jpg", 2],
    [196, "Rojo intenso", "18", "18_Colorimetria_Cobrizos_Rojos_Caobas/Rojo_intenso_C066.jpg", 2],
    [197, "Ash brown", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Ash_brown_C078.jpg", 11],
    [198, "Beige frío", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Beige_frio_C079.jpg", 11],
    [199, "Gris humo", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Gris_humo_C072.jpg", 11],
    [200, "Gris plata", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Gris_plata_C071.jpg", 11],
    [201, "Hielo", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Hielo_C076.jpg", 11],
    [202, "Matización beige", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Matizacion_beige_D088.jpg", 11],
    [203, "Matización ceniza", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Matizacion_ceniza_D086.jpg", 11],
    [204, "Matización perla", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Matizacion_perla_D087.jpg", 11],
    [205, "Matización rosada", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Matizacion_rosada_D089.jpg", 11],
    [206, "Matización violeta", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Matizacion_violeta_D090.jpg", 11],
    [207, "Perla", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Perla_C075.jpg", 11],
    [208, "Platino frío", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Platino_frio_C080.jpg", 11],
    [209, "Steel", "19", "19_Colorimetria_Frios_Cenizas_Matizacion/Steel_C077.jpg", 11],
    [210, "Azul petróleo", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Azul_petroleo_C039.jpg", 21],
    [211, "Coloración global fantasía azul", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Coloracion_global_fantasia_azul_D009.jpg", 21],
    [212, "Coloración global fantasía rosa", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Coloracion_global_fantasia_rosa_D008.jpg", 21],
    [213, "Coloración global fantasía violeta", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Coloracion_global_fantasia_violeta_D010.jpg", 21],
    [214, "Coral", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Coral_C038.jpg", 21],
    [215, "Fantasía amarillo", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Fantasia_amarillo_D065.jpg", 21],
    [216, "Fantasía azul", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Fantasia_azul_D063.jpg", 21],
    [217, "Fantasía fucsia", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Fantasia_fucsia_D061.jpg", 21],
    [218, "Fantasía morado", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Fantasia_morado_D062.jpg", 21],
    [219, "Fantasía multicolor", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Fantasia_multicolor_D067.jpg", 21],
    [220, "Fantasía naranja", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Fantasia_naranja_D066.jpg", 21],
    [221, "Fantasía verde", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Fantasia_verde_D064.jpg", 21],
    [222, "Rojo", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Rojo_C036.jpg", 21],
    [223, "Rosa pastel", "20", "20_Colorimetria_Fantasia_y_Tonos_Vivos/Rosa_pastel_C031.jpg", 21],
    [224, "Cambio de tono", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Cambio_de_tono_C025.jpg", 8],
    [225, "Corrección amarilla", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Correccion_amarilla_D082.jpg", 8],
    [226, "Corrección de manchas", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Correccion_de_manchas_C022.jpg", 8],
    [227, "Corrección de reflejos", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Correccion_de_reflejos_C029.jpg", 8],
    [228, "Corrección naranja", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Correccion_naranja_D081.jpg", 8],
    [229, "Corrección roja", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Correccion_roja_D084.jpg", 8],
    [230, "Corrección verdosa", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Correccion_verdosa_D083.jpg", 8],
    [231, "Decoloración global", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Decoloracion_global_C024.jpg", 8],
    [232, "Degradado de color", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Degradado_de_color_C027.jpg", 8],
    [233, "Neutralización", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Neutralizacion_C021.jpg", 8],
    [234, "Oscurecimiento", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Oscurecimiento_D085.jpg", 8],
    [235, "Recuperación de color", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Recuperacion_de_color_C026.jpg", 8],
    [236, "Retoque de color", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Retoque_de_color_C028.jpg", 8],
    [237, "Transformación total", "21", "21_Colorimetria_Correcciones_y_Transformaciones/Transformacion_total_C030.jpg", 8],
    [238, "Babylights + balayage", "22", "22_Colorimetria_Tecnicas_Avanzadas/Babylights_balayage_C091.jpg", 12],
    [239, "Color blocking", "22", "22_Colorimetria_Tecnicas_Avanzadas/Color_blocking_C097.jpg", 12],
    [240, "Coloración 3d", "22", "22_Colorimetria_Tecnicas_Avanzadas/Coloracion_3D_D094.jpg", 12],
    [241, "Degradado raíz sombreada", "22", "22_Colorimetria_Tecnicas_Avanzadas/Degradado_raiz_sombreada_D091.jpg", 12],
    [242, "Duo tone", "22", "22_Colorimetria_Tecnicas_Avanzadas/Duo_tone_C098.jpg", 12],
    [243, "Efecto sunkissed", "22", "22_Colorimetria_Tecnicas_Avanzadas/Efecto_sunkissed_C094.jpg", 12],
    [244, "Gloss & shine", "22", "22_Colorimetria_Tecnicas_Avanzadas/Gloss_and_shine_D096.jpg", 12],
    [245, "Illuminage", "22", "22_Colorimetria_Tecnicas_Avanzadas/Illuminage_D095.jpg", 12],
    [246, "Mechas holográficas", "22", "22_Colorimetria_Tecnicas_Avanzadas/Mechas_holograficas_D100.jpg", 12],
    [247, "Money piece xl", "22", "22_Colorimetria_Tecnicas_Avanzadas/Money_piece_XL_C096.jpg", 12],
    [248, "Raíces color", "22", "22_Colorimetria_Tecnicas_Avanzadas/Raices_color_C099.jpg", 12],
    [249, "Raíces difuminadas", "22", "22_Colorimetria_Tecnicas_Avanzadas/Raices_difuminadas_C093.jpg", 12],
    [250, "Reflejos estratégicos", "22", "22_Colorimetria_Tecnicas_Avanzadas/Reflejos_estrategicos_D098.jpg", 12],
    [251, "Técnica airtouch", "22", "22_Colorimetria_Tecnicas_Avanzadas/Tecnica_airtouch_D092.jpg", 12],
    [252, "Técnica foilyage", "22", "22_Colorimetria_Tecnicas_Avanzadas/Tecnica_foilyage_D093.jpg", 12],
    [253, "Tratamiento con color", "22", "22_Colorimetria_Tecnicas_Avanzadas/Tratamiento_con_color_D097.jpg", 12],
    /* carpetas 25–28: 6.º campo = [tipo, técnica o corte, relación exacta, unidad]; 0 = solo en la biblioteca (fuera del libro y del curso:
       recogidos, máquina, fijación, estética y finger waves, que Fátima sacó del curso) */
    [254, "Retoque de raíces", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/01_Raices_y_Canas/Retoque_de_raices_T002.jpg", 22, ["tec", "cb_color_raiz", 1, "cb_color_raiz"]],
    [255, "Matización de canas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/01_Raices_y_Canas/Matizacion_de_canas_T007.jpg", 22, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [256, "Lowlights", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Lowlights_T008.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [257, "Mechas diagonales", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Mechas_diagonales_T012.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [258, "Mechas horizontales", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Mechas_horizontales_T013.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [259, "Mechas verticales", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Mechas_verticales_T014.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [260, "Técnica ladrillo", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Tecnica_ladrillo_T015.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [261, "Técnica espiga", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Tecnica_espiga_T016.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [262, "Mechas en coronilla", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Mechas_en_coronilla_T021.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [263, "Mechas en nuca", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Mechas_en_nuca_T022.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [264, "Mechas halo", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Mechas_halo_T023.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [265, "Mechas en cinta", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Mechas_en_cinta_T024.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [266, "Micro-mechas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/02_Mechas_con_Papel_y_Patrones/Micro_mechas_T025.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [267, "Balayage a mano alzada", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Balayage_a_mano_alzada_T026.jpg", 22, ["tec", "cb_color_balayage", 1, "cb_color_balayage"]],
    [268, "Ombré", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Ombre_T030.jpg", 22, ["tec", "cb_color_sombre", 1, "cb_color_sombre"]],
    [269, "Sombré", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Sombre_T031.jpg", 22, ["tec", "cb_color_sombre", 1, "cb_color_sombre"]],
    [270, "Peekaboo", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Peekaboo_T033.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [271, "Split-dye", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Split_dye_T035.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [272, "Cobrizo en degradado", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Cobrizo_en_degradado_T037.jpg", 22, ["tec", "cb_color_sombre", 0, "cb_color_sombre"]],
    [273, "Castaño con dimensión", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Castano_con_dimension_T038.jpg", 22, ["tec", "cb_color_balayage", 0, "cb_color_balayage"]],
    [274, "Corrección de rubio", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/03_Balayage_Ombre_y_Efectos/Correccion_de_rubio_T039.jpg", 22, ["tec", "cb_quim_decoloracion", 0, "cb_quim_decoloracion"]],
    [275, "Tonos fríos", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Tonos_frios_T040.jpg", 22, ["tec", "cb_quim_decoloracion", 0, "cb_quim_decoloracion"]],
    [276, "Tonos cálidos", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Tonos_calidos_T041.jpg", 22, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [277, "Matiz dorado", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Matiz_dorado_T044.jpg", 22, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [278, "Matiz champán", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Matiz_champan_T046.jpg", 22, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [279, "Matiz plata", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Matiz_plata_T049.jpg", 22, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [280, "Matiz caramelo", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Matiz_caramelo_T050.jpg", 22, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [281, "Técnica de mezcla de tonos", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Tecnica_de_mezcla_de_tonos_T080.jpg", 22, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [282, "Beige y arena", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Beige_y_arena_T087.jpg", 22, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [283, "Cobre y dorado", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Cobre_y_dorado_T088.jpg", 22, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [284, "Chocolate y caramelo", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Chocolate_y_caramelo_T089.jpg", 22, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [285, "Teñido y placado de tonos", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/04_Tonos_y_Matices/Tenido_y_placado_de_tonos_T090.jpg", 22, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [286, "Mechas con gorro perforado", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Mechas_con_gorro_perforado_T051.jpg", 22, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [287, "Mechas con gorro completo", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Mechas_con_gorro_completo_T052.jpg", 22, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [288, "Mechas con gorro y mechones", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Mechas_con_gorro_y_mechones_T053.jpg", 22, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [289, "Gorro de silicona", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Gorro_de_silicona_T054.jpg", 22, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [290, "Gorro de látex", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Gorro_de_latex_T055.jpg", 22, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [291, "Cap highlights densas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Cap_highlights_densas_T056.jpg", 22, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [292, "Cap highlights sutiles", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Cap_highlights_sutiles_T057.jpg", 22, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [293, "Plantilla reutilizable geométrica", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_reutilizable_geometrica_T058.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [294, "Plantilla reutilizable curva", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_reutilizable_curva_T059.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [295, "Plantilla en forma de V", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_en_forma_de_V_T060.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [296, "Plantilla en forma de U", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_en_forma_de_U_T061.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [297, "Plantilla de rayas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_de_rayas_T062.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [298, "Plantilla de ondas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_de_ondas_T063.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [299, "Plantilla de círculos", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_de_circulos_T064.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [300, "Plantilla de rombos", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/05_Gorros_y_Plantillas/Plantilla_de_rombos_T065.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [301, "Aplicación por secciones", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Aplicacion_por_secciones_T066.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [302, "Técnica en cuadros", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Tecnica_en_cuadros_T067.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [303, "Técnica en triángulos", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Tecnica_en_triangulos_T068.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [304, "Técnica en zigzag", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Tecnica_en_zigzag_T069.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [305, "Técnica en espiral", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Tecnica_en_espiral_T070.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [306, "Aplicación en capas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Aplicacion_en_capas_T071.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [307, "Aplicación en V", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Aplicacion_en_V_T072.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [308, "Aplicación en U", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Aplicacion_en_U_T073.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [309, "Aplicación en diagonal", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Aplicacion_en_diagonal_T074.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [310, "Aplicación en estrella", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Aplicacion_en_estrella_T075.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [311, "Mechas en raíz y puntas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Mechas_en_raiz_y_puntas_T076.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [312, "Mechas en medios y puntas", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/06_Particiones_y_Aplicacion_por_Zonas/Mechas_en_medios_y_puntas_T077.jpg", 22, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [313, "Aplicación con pincel", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/07_Aplicacion_con_Herramientas/Aplicacion_con_pincel_T081.jpg", 22, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [314, "Aplicación con bol", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/07_Aplicacion_con_Herramientas/Aplicacion_con_bol_T082.jpg", 22, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [315, "Aplicación con peine", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/07_Aplicacion_con_Herramientas/Aplicacion_con_peine_T083.jpg", 22, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [316, "Aplicación con paletina", "25", "25_Tecnicas_Aplicacion_Tintes_y_Mechas/07_Aplicacion_con_Herramientas/Aplicacion_con_paletina_T084.jpg", 22, ["tec", "cb_color_balayage", 1, "cb_color_balayage"]],
    [405, "División para corte largo", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_largo_P089.jpg", 23, ["corte", "capas_largas", 0, "pe_u_c_capas"]],
    [406, "División para corte medio", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_medio_P090.jpg", 23, ["corte", "media_45", 0, "pe_u_c_media"]],
    [417, "Tijeras de corte", "27", "27_Herramientas_de_Peluqueria/01_Corte/Tijeras_de_corte_H001.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [418, "Tijeras de entresacar", "27", "27_Herramientas_de_Peluqueria/01_Corte/Tijeras_de_entresacar_H002.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [419, "Tijeras de esculpir", "27", "27_Herramientas_de_Peluqueria/01_Corte/Tijeras_de_esculpir_H003.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [420, "Tijeras curvas", "27", "27_Herramientas_de_Peluqueria/01_Corte/Tijeras_curvas_H004.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [421, "Navaja de corte", "27", "27_Herramientas_de_Peluqueria/01_Corte/Navaja_de_corte_H005.jpg", 24, ["corte", "desfilado_punta", 0, "pe_u_c_capas"]],
    [422, "Navaja de entresacar", "27", "27_Herramientas_de_Peluqueria/01_Corte/Navaja_de_entresacar_H006.jpg", 24, ["corte", "desfilado_punta", 0, "pe_u_c_capas"]],
    [423, "Máquina de corte", "27", "27_Herramientas_de_Peluqueria/01_Corte/Maquina_de_corte_H007.jpg", 24, 0],
    [424, "Trimmer", "27", "27_Herramientas_de_Peluqueria/01_Corte/Trimmer_H008.jpg", 24, 0],
    [425, "Afeitadora eléctrica", "27", "27_Herramientas_de_Peluqueria/01_Corte/Afeitadora_electrica_H009.jpg", 24, 0],
    [426, "Cuchilla de repuesto", "27", "27_Herramientas_de_Peluqueria/01_Corte/Cuchilla_de_repuesto_H010.jpg", 24, 0],
    [427, "Tijera de precisión", "27", "27_Herramientas_de_Peluqueria/01_Corte/Tijera_de_precision_H036.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [428, "Peines de corte", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Peines_de_corte_H011.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [429, "Peines de entresacar", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Peines_de_entresacar_H012.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [430, "Peine de cola", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Peine_de_cola_H013.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [431, "Peine de bolsillo", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Peine_de_bolsillo_H014.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [432, "Peine afro", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Peine_afro_H015.jpg", 24, ["corte", "afro_redondo", 0, "pe_u_c_rizado"]],
    [433, "Cepillo plano", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_plano_H016.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [434, "Cepillo redondo", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_redondo_H017.jpg", 24, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [435, "Cepillo térmico", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_termico_H018.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [436, "Cepillo esqueleto", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_esqueleto_H019.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [437, "Cepillo de cerdas naturales", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_de_cerdas_naturales_H020.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [438, "Cepillo desenredante", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_desenredante_H021.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [439, "Cepillo masajeador", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_masajeador_H022.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [440, "Cepillo de madera", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_de_madera_H023.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [441, "Cepillo de jabalí", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_de_jabali_H024.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [442, "Cepillo plano de cerámica", "27", "27_Herramientas_de_Peluqueria/02_Peines_y_Cepillos/Cepillo_plano_de_ceramica_H025.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [443, "Rizador de cabello", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Rizador_de_cabello_H026.jpg", 24, ["tec", "cb_cab_planchado", 0, "cb_cab_planchado"]],
    [444, "Plancha de cabello", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Plancha_de_cabello_H027.jpg", 24, ["tec", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [445, "Tenacilla", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Tenacilla_H028.jpg", 24, ["tec", "cb_cab_planchado", 0, "cb_cab_planchado"]],
    [446, "Plancha de ondas", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Plancha_de_ondas_H029.jpg", 24, ["tec", "cb_cab_planchado", 0, "cb_cab_planchado"]],
    [447, "Secador de cabello", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Secador_de_cabello_H030.jpg", 24, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [448, "Difusor", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Difusor_H031.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [449, "Concentrador", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Concentrador_H032.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [450, "Boquilla ancha", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Boquilla_ancha_H033.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [451, "Cepillo secador", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Cepillo_secador_H034.jpg", 24, ["tec", "cb_cab_secado", 0, "cb_cab_secado"]],
    [452, "Cepillo alisador", "27", "27_Herramientas_de_Peluqueria/03_Calor_y_Secado/Cepillo_alisador_H035.jpg", 24, ["tec", "cb_cab_planchado", 0, "cb_cab_planchado"]],
    [453, "Pinzas de sección", "27", "27_Herramientas_de_Peluqueria/04_Pinzas_y_Sujecion/Pinzas_de_seccion_H037.jpg", 24, ["tec", "p_seis", 1, "pe_u_base"]],
    [454, "Pinzas cocodrilo", "27", "27_Herramientas_de_Peluqueria/04_Pinzas_y_Sujecion/Pinzas_cocodrilo_H038.jpg", 24, ["tec", "p_seis", 1, "pe_u_base"]],
    [455, "Ganchos para recogido", "27", "27_Herramientas_de_Peluqueria/04_Pinzas_y_Sujecion/Ganchos_para_recogido_H039.jpg", 24, 0],
    [456, "Elásticos de sujeción", "27", "27_Herramientas_de_Peluqueria/04_Pinzas_y_Sujecion/Elasticos_de_sujecion_H040.jpg", 24, ["tec", "p_seis", 0, "pe_u_base"]],
    [457, "Red para moño", "27", "27_Herramientas_de_Peluqueria/04_Pinzas_y_Sujecion/Red_para_mono_H041.jpg", 24, 0],
    [458, "Malla de pelo", "27", "27_Herramientas_de_Peluqueria/04_Pinzas_y_Sujecion/Malla_de_pelo_H042.jpg", 24, 0],
    [459, "Diadema profesional", "27", "27_Herramientas_de_Peluqueria/04_Pinzas_y_Sujecion/Diadema_profesional_H043.jpg", 24, ["tec", "p_seis", 0, "pe_u_base"]],
    [460, "Capa de corte", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Capa_de_corte_H044.jpg", 24, ["corte", "basico_cuadrado", 0, "pe_u_c_basicos"]],
    [461, "Capa de tinte", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Capa_de_tinte_H045.jpg", 24, ["tec", "cb_color_global", 0, "cb_color_global"]],
    [462, "Capa de lavado", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Capa_de_lavado_H046.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [463, "Toalla de peluquería", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Toalla_de_peluqueria_H047.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [464, "Albornoz", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Albornoz_H048.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [465, "Bolsa para herramientas", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Bolsa_para_herramientas_H049.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [466, "Carro auxiliar", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Carro_auxiliar_H050.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [467, "Toalla desechable", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Toalla_desechable_H092.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [468, "Maletín profesional", "27", "27_Herramientas_de_Peluqueria/05_Capas_Toallas_y_Organizacion/Maletin_profesional_H100.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [469, "Lavacabezas", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Lavacabezas_H051.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [470, "Sillón de peluquería", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Sillon_de_peluqueria_H052.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [471, "Sillón de espera", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Sillon_de_espera_H053.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [472, "Taburete", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Taburete_H054.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [473, "Espejo de mano", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Espejo_de_mano_H055.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [474, "Espejo de tocador", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Espejo_de_tocador_H056.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [475, "Secador de casco", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Secador_de_casco_H057.jpg", 24, ["tec", "cb_hidra_profunda", 0, "cb_hidra_profunda"]],
    [476, "Vaporizador", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Vaporizador_H058.jpg", 24, ["tec", "cb_hidra_profunda", 0, "cb_hidra_profunda"]],
    [477, "Carrito de lavado", "27", "27_Herramientas_de_Peluqueria/06_Mobiliario_del_Salon/Carrito_de_lavado_H059.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [478, "Bol de tinte", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Bol_de_tinte_H061.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [479, "Brocha para tinte", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Brocha_para_tinte_H062.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [480, "Peine para mechas", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Peine_para_mechas_H063.jpg", 24, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [481, "Paletina", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Paletina_H064.jpg", 24, ["tec", "cb_color_balayage", 0, "cb_color_balayage"]],
    [482, "Aplicador de tinte", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Aplicador_de_tinte_H065.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [483, "Papel de aluminio", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Papel_de_aluminio_H066.jpg", 24, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [484, "Papel de celofán", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Papel_de_celofan_H067.jpg", 24, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [485, "Gorro de mechas", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Gorro_de_mechas_H068.jpg", 24, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [486, "Gorro térmico", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Gorro_termico_H069.jpg", 24, ["tec", "cb_hidra_profunda", 0, "cb_hidra_profunda"]],
    [487, "Plantillas para mechas", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Plantillas_para_mechas_H070.jpg", 24, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [488, "Tubo de tinte", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Tubo_de_tinte_H071.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [489, "Bowl de silicona", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Bowl_de_silicona_H089.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [490, "Guantes de nitrilo", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Guantes_de_nitrilo_H090.jpg", 24, ["tec", "p_seg_quimica", 1, "pe_u_fund"]],
    [491, "Cinta adhesiva", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Cinta_adhesiva_H093.jpg", 24, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [492, "Mezclador de color", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Mezclador_de_color_H098.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [493, "Termómetro", "27", "27_Herramientas_de_Peluqueria/07_Aplicacion_de_Color/Termometro_H099.jpg", 24, ["tec", "cb_hidra_profunda", 0, "cb_hidra_profunda"]],
    [494, "Dispensador de productos", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Dispensador_de_productos_H060.jpg", 24, ["tec", "p_seg_quimica", 0, "pe_u_fund"]],
    [495, "Oxidante", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Oxidante_H072.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [496, "Decolorante", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Decolorante_H073.jpg", 24, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [497, "Matizador", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Matizador_H074.jpg", 24, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [498, "Tratamiento capilar", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Tratamiento_capilar_H075.jpg", 24, ["tec", "cb_hidra_profunda", 0, "cb_hidra_profunda"]],
    [499, "Ampollas", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Ampollas_H076.jpg", 24, ["tec", "cb_hidra_profunda", 0, "cb_hidra_profunda"]],
    [500, "Serum capilar", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Serum_capilar_H077.jpg", 24, ["tec", "cb_hidra_profunda", 0, "cb_hidra_profunda"]],
    [501, "Aceite capilar", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Aceite_capilar_H078.jpg", 24, ["tec", "cb_hidra_nutricion", 1, "cb_hidra_nutricion"]],
    [502, "Spray protector térmico", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Spray_protector_termico_H079.jpg", 24, ["tec", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [503, "Laca", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Laca_H080.jpg", 24, 0],
    [504, "Espuma modeladora", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Espuma_modeladora_H081.jpg", 24, 0],
    [505, "Gel fijador", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Gel_fijador_H082.jpg", 24, 0],
    [506, "Cera capilar", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Cera_capilar_H083.jpg", 24, 0],
    [507, "Pomada", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Pomada_H084.jpg", 24, 0],
    [508, "Polvo voluminizador", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Polvo_voluminizador_H085.jpg", 24, 0],
    [509, "Tinte en crema", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Tinte_en_crema_H095.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [510, "Tinte en gel", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Tinte_en_gel_H096.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [511, "Tinte en polvo", "27", "27_Herramientas_de_Peluqueria/08_Productos_y_Tratamientos/Tinte_en_polvo_H097.jpg", 24, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [512, "Rizador de pestañas", "27", "27_Herramientas_de_Peluqueria/09_Cuidado_Facial_y_Accesorios/Rizador_de_pestanas_H086.jpg", 24, 0],
    [513, "Pinza depilatoria", "27", "27_Herramientas_de_Peluqueria/09_Cuidado_Facial_y_Accesorios/Pinza_depilatoria_H087.jpg", 24, 0],
    [514, "Cepillo facial", "27", "27_Herramientas_de_Peluqueria/09_Cuidado_Facial_y_Accesorios/Cepillo_facial_H088.jpg", 24, 0],
    [515, "Mascarilla facial", "27", "27_Herramientas_de_Peluqueria/09_Cuidado_Facial_y_Accesorios/Mascarilla_facial_H091.jpg", 24, 0],
    [516, "Esponja de maquillaje", "27", "27_Herramientas_de_Peluqueria/09_Cuidado_Facial_y_Accesorios/Esponja_de_maquillaje_H094.jpg", 24, 0],
    [517, "Tipos de tinte", "28", "28_Cuadros_Formativos/01_Tintes_y_Oxidantes/Tipos_de_tinte_Q006.jpg", 25, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [518, "Oxidantes", "28", "28_Cuadros_Formativos/01_Tintes_y_Oxidantes/Oxidantes_Q007.jpg", 25, ["tec", "cb_color_global", 1, "cb_color_global"]],
    [519, "Hidratación capilar", "28", "28_Cuadros_Formativos/02_Tratamientos_Capilares/Hidratacion_capilar_Q024.jpg", 25, ["tec", "cb_hidra_profunda", 1, "cb_hidra_profunda"]],
    [520, "Nutrición", "28", "28_Cuadros_Formativos/02_Tratamientos_Capilares/Nutricion_Q025.jpg", 25, ["tec", "cb_hidra_nutricion", 1, "cb_hidra_nutricion"]],
    [521, "Reconstrucción", "28", "28_Cuadros_Formativos/02_Tratamientos_Capilares/Reconstruccion_Q026.jpg", 25, ["tec", "cb_quera_botox", 0, "cb_quera_botox"]],
    [522, "Brillo y sellado", "28", "28_Cuadros_Formativos/02_Tratamientos_Capilares/Brillo_y_sellado_Q027.jpg", 25, ["tec", "cb_quera_botox", 0, "cb_quera_botox"]],
    [523, "Tratamiento de keratina", "28", "28_Cuadros_Formativos/02_Tratamientos_Capilares/Tratamiento_de_keratina_Q028.jpg", 25, ["tec", "cb_quera_alisado", 1, "cb_quera_alisado"]],
    [524, "Alisados", "28", "28_Cuadros_Formativos/02_Tratamientos_Capilares/Alisados_Q029.jpg", 25, ["tec", "cb_quera_alisado", 1, "cb_quera_alisado"]],
    [525, "Reflejos", "28", "28_Cuadros_Formativos/03_Servicios_Tecnicos/Reflejos_Q022.jpg", 25, ["tec", "cb_mechas_aluminio", 0, "cb_mechas_aluminio"]],
    [526, "Permanente", "28", "28_Cuadros_Formativos/03_Servicios_Tecnicos/Permanente_Q030.jpg", 25, ["tec", "cb_quim_permanente", 1, "cb_quim_permanente"]],
    [527, "Decoloración", "28", "28_Cuadros_Formativos/03_Servicios_Tecnicos/Decoloracion_Q031.jpg", 25, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [528, "Técnica de finger waves", "28", "28_Cuadros_Formativos/03_Servicios_Tecnicos/Tecnica_de_finger_waves_Q032.jpg", 25, 0],
    [529, "Corte en capas", "28", "28_Cuadros_Formativos/04_Cortes_Complementarios/Corte_en_capas_Q034.jpg", 25, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [530, "Corte en diamante", "28", "28_Cuadros_Formativos/04_Cortes_Complementarios/Corte_en_diamante_Q045.jpg", 25, ["corte", "capas_90", 0, "pe_u_c_capas"]],
    [531, "Corte wolf", "28", "28_Cuadros_Formativos/04_Cortes_Complementarios/Corte_wolf_Q046.jpg", 25, ["corte", "wolf", 1, "pe_u_c_media"]],
    [532, "Corte razo", "28", "28_Cuadros_Formativos/04_Cortes_Complementarios/Corte_razo_Q049.jpg", 25, 0],
    [533, "Corte largo en capas", "28", "28_Cuadros_Formativos/04_Cortes_Complementarios/Corte_largo_en_capas_Q051.jpg", 25, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    /* 30-10-2026 (Fátima, «BIBLIOTECA_FATIMA_AIR Nueva actualizada»): carpetas 26 (11–17) y 29–41, imágenes tal cual; título y
       descripción de su index.html. 6.º campo: 'uni' = la imagen va en esa unidad (no es la foto de una receta); 0 = solo biblioteca */
    [534, "División para corte bob", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_bob_P088_nuevo.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [535, "División para corte cuadrado", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_cuadrado_P086_nuevo.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [536, "División para corte en U", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_en_U_P084_nuevo.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [537, "División para corte en V", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_en_V_P083_nuevo.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [538, "División para corte en capas", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_en_capas_P082_nuevo.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [539, "División para corte pixie", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_pixie_P087_nuevo.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [540, "División para corte recto cuadrado · guía profesional", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_recto_P081_guia_profesional.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [541, "División para corte redondo", "26", "26_Particiones_del_Cabello/09_Particiones_para_Cortes/Division_para_corte_redondo_P085_nuevo.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [542, "División concéntrica", "26", "26_Particiones_del_Cabello/11_Particiones_Atras_Nuca_y_Vista_Posterior/Division_concentrica_A086.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [543, "Lateral en 6 secciones", "26", "26_Particiones_del_Cabello/11_Particiones_Atras_Nuca_y_Vista_Posterior/Lateral_en_6_secciones_A070.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [544, "Lateral en 8 secciones", "26", "26_Particiones_del_Cabello/11_Particiones_Atras_Nuca_y_Vista_Posterior/Lateral_en_8_secciones_A072.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [545, "Múltiples secciones", "26", "26_Particiones_del_Cabello/11_Particiones_Atras_Nuca_y_Vista_Posterior/Multiples_secciones_A078.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [546, "Partición cuadrada (sección)", "26", "26_Particiones_del_Cabello/11_Particiones_Atras_Nuca_y_Vista_Posterior/Particion_cuadrada_seccion_A084.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [547, "Partición cuadrada (vista posterior)", "26", "26_Particiones_del_Cabello/11_Particiones_Atras_Nuca_y_Vista_Posterior/Particion_cuadrada_vista_posterior_A064.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [548, "Lateral en diagonal", "26", "26_Particiones_del_Cabello/12_Particiones_Adelante_y_Laterales/Lateral_en_diagonal_A081.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [549, "Lateral en horizontal", "26", "26_Particiones_del_Cabello/12_Particiones_Adelante_y_Laterales/Lateral_en_horizontal_A080.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [550, "Lateral en vertical", "26", "26_Particiones_del_Cabello/12_Particiones_Adelante_y_Laterales/Lateral_en_vertical_A079.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [551, "Líneas de partición verticales (frente)", "26", "26_Particiones_del_Cabello/12_Particiones_Adelante_y_Laterales/Lineas_de_particion_verticales_frente_C008.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [552, "Sección frontal con clips", "26", "26_Particiones_del_Cabello/12_Particiones_Adelante_y_Laterales/Seccion_frontal_con_clips_C002.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [553, "Secado lateral", "26", "26_Particiones_del_Cabello/13_Particiones_para_Secado/Secado_lateral_A089.jpg", 26, ["uni", "cb_cab_secado", 1, "cb_cab_secado"]],
    [554, "Secado por cuadrícula", "26", "26_Particiones_del_Cabello/13_Particiones_para_Secado/Secado_por_cuadricula_A088.jpg", 26, ["uni", "cb_cab_secado", 1, "cb_cab_secado"]],
    [555, "Secado por divisiones", "26", "26_Particiones_del_Cabello/13_Particiones_para_Secado/Secado_por_divisiones_A087.jpg", 26, ["uni", "cb_cab_secado", 1, "cb_cab_secado"]],
    [556, "Secado (vista superior)", "26", "26_Particiones_del_Cabello/13_Particiones_para_Secado/Secado_vista_superior_A090.jpg", 26, ["uni", "cb_cab_secado", 1, "cb_cab_secado"]],
    [557, "Divisiones limpias", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Divisiones_limpias_A094.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [558, "Partición exacta", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Particion_exacta_A098.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [559, "Preparación con clips", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Preparacion_con_clips_A091.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [560, "Preparación lateral", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Preparacion_lateral_A092.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [561, "Preparación (vista superior)", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Preparacion_vista_superior_A093.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [562, "Resultado (frente)", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Resultado_frente_A097.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [563, "Resultado (lateral)", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Resultado_lateral_A095.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [564, "Resultado (posterior)", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Resultado_posterior_A096.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [565, "Simetría", "26", "26_Particiones_del_Cabello/14_Preparacion_y_Resultado/Simetria_A099.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [566, "Secciones desde la coronilla (vista superior)", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Secciones_desde_la_coronilla_vista_superior_C005.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [567, "Secciones en cruz con moños (posterior)", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Secciones_en_cruz_con_monos_posterior_C001.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [568, "Secciones en estrella con moños (posterior)", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Secciones_en_estrella_con_monos_posterior_C004.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [569, "Secciones horizontales laterales (perfil)", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Secciones_horizontales_laterales_perfil_C010.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [570, "Seis secciones horizontales (posterior)", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Seis_secciones_horizontales_posterior_C006.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [571, "Triángulo en la nuca con moños", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Triangulo_en_la_nuca_con_monos_C009.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [572, "Triángulo lateral con clips (perfil)", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Triangulo_lateral_con_clips_perfil_C007.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [573, "Triángulo lateral con moños (perfil)", "26", "26_Particiones_del_Cabello/15_Particiones_con_Monos_y_Clips/Triangulo_lateral_con_monos_perfil_C003.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [574, "División por corte · Bob cuadrado largo (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/01_Bob_cuadrado_largo_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [575, "División por corte · Corte corto (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/02_Corte_corto_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [576, "División por corte · Corte corto (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/02_Corte_corto_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [577, "División por corte · A-línea y corte (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/03_A_linea_y_corte_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [578, "División por corte · A-línea y corte (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/03_A_linea_y_corte_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [579, "División por corte · U y capas (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/04_U_y_capas_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [580, "División por corte · Bob corto recto (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/05_Bob_corto_recto_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [581, "División por corte · Bob corto recto (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/05_Bob_corto_recto_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [582, "División por corte · A-línea (lateral y posterior) (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/06_A_linea_lateral_y_posterior_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [583, "División por corte · A-línea (lateral y posterior) (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/06_A_linea_lateral_y_posterior_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [584, "División por corte · V y capas (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/07_V_y_capas_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [585, "División por corte · Capas largas en V (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/08_Capas_largas_en_V_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [586, "División por corte · Bob corto (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/09_Bob_corto_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [587, "División por corte · Pixie recto (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/10_Pixie_recto_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [588, "División por corte · Pixie redondo (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/11_Pixie_redondo_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [589, "División por corte · Pixie redondo (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/11_Pixie_redondo_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [590, "División por corte · Flequillo y pollina (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/12_Flequillo_y_pollina_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [591, "División por corte · Flequillo y pollina (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/12_Flequillo_y_pollina_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [592, "División por corte · Flequillo y redondo (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/13_Flequillo_y_redondo_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [593, "División por corte · Flequillo y corto (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/14_Flequillo_y_corto_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [594, "División por corte · Flequillo y corto (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/14_Flequillo_y_corto_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [595, "División por corte · Flequillo y capas (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/15_Flequillo_y_capas_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [596, "División por corte · Flequillo y capas (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/15_Flequillo_y_capas_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [597, "División por corte · Flequillo y V (boceto)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/16_Flequillo_y_V_boceto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [598, "División por corte · Flequillo y V (foto con líneas)", "26", "26_Particiones_del_Cabello/16_Bocetos_de_divisiones_de_corte/16_Flequillo_y_V_foto.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [599, "División para Corte en V · guía profesional (divisiones, capas y ejecución)", "26", "26_Particiones_del_Cabello/17_Guias_profesionales_de_divisiones/01_Corte_en_V_guia_profesional.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [600, "División para Corte en U · guía profesional (divisiones, capas y ejecución)", "26", "26_Particiones_del_Cabello/17_Guias_profesionales_de_divisiones/02_Corte_en_U_guia_profesional.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [601, "División para Corte bob · guía profesional (divisiones, capas y ejecución)", "26", "26_Particiones_del_Cabello/17_Guias_profesionales_de_divisiones/03_Corte_bob_guia_profesional.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [602, "División para Corte Shanghai (shag) · guía profesional (divisiones, capas y ejecución)", "26", "26_Particiones_del_Cabello/17_Guias_profesionales_de_divisiones/04_Corte_shanghai_shag_guia_profesional.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [603, "División para Corte pixie · guía profesional (divisiones, capas y ejecución)", "26", "26_Particiones_del_Cabello/17_Guias_profesionales_de_divisiones/05_Corte_pixie_guia_profesional.jpg", 26, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [604, "Aclarado con agua de ducha (perfil)", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Aclarado_con_agua_de_ducha_perfil_A003.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [605, "Aclarado sobre la raya central", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Aclarado_sobre_la_raya_central_A007.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [606, "Champú con espuma abundante", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Champu_con_espuma_abundante_A004.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [607, "Clienta relajada en el lavacabezas", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Clienta_relajada_en_el_lavacabezas_A006.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [608, "Lavacabezas del salón", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Lavacabezas_del_salon_A005.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [609, "Lavado con espuma y masaje del cuero cabelludo", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Lavado_con_espuma_y_masaje_del_cuero_cabelludo_A002.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [610, "Lavado con masaje en el lavacabezas", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Lavado_con_masaje_en_el_lavacabezas_A001.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [611, "Lavado profesional (primer plano)", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Lavado_profesional_primer_plano_A015.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [612, "Masaje de champú sobre el cuero cabelludo", "29", "29_Lavado_y_Cuidado_del_Cabello/01_Lavado_en_Lavacabezas/Masaje_de_champu_sobre_el_cuero_cabelludo_A020.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [613, "Mascarilla aplicada en el cabello", "29", "29_Lavado_y_Cuidado_del_Cabello/02_Aplicacion_de_Producto/Mascarilla_aplicada_en_el_cabello_A013.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [614, "Peinado con peine y producto en el lavacabezas", "29", "29_Lavado_y_Cuidado_del_Cabello/02_Aplicacion_de_Producto/Peinado_con_peine_y_producto_en_el_lavacabezas_A011.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [615, "Cabello húmedo peinado hacia atrás", "29", "29_Lavado_y_Cuidado_del_Cabello/03_Toallas_y_Cabello_Humedo/Cabello_humedo_peinado_hacia_atras_A016.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [616, "Cabello húmedo (vista posterior)", "29", "29_Lavado_y_Cuidado_del_Cabello/03_Toallas_y_Cabello_Humedo/Cabello_humedo_vista_posterior_A018.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [617, "Cabello largo húmedo", "29", "29_Lavado_y_Cuidado_del_Cabello/03_Toallas_y_Cabello_Humedo/Cabello_largo_humedo_A010.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [618, "Secado con toalla", "29", "29_Lavado_y_Cuidado_del_Cabello/03_Toallas_y_Cabello_Humedo/Secado_con_toalla_A008.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [619, "Toallas enrolladas", "29", "29_Lavado_y_Cuidado_del_Cabello/03_Toallas_y_Cabello_Humedo/Toallas_enrolladas_A017.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [620, "Turbante de toalla", "29", "29_Lavado_y_Cuidado_del_Cabello/03_Toallas_y_Cabello_Humedo/Turbante_de_toalla_A009.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [621, "Mezcla de tratamiento hidratante en bol", "29", "29_Lavado_y_Cuidado_del_Cabello/04_Productos_e_Hidratacion/Mezcla_de_tratamiento_hidratante_en_bol_A014.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [622, "Producto de tratamiento en la palma de la mano", "29", "29_Lavado_y_Cuidado_del_Cabello/04_Productos_e_Hidratacion/Producto_de_tratamiento_en_la_palma_de_la_mano_A019.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [623, "Productos de lavado y acondicionador", "29", "29_Lavado_y_Cuidado_del_Cabello/04_Productos_e_Hidratacion/Productos_de_lavado_y_acondicionador_A012.jpg", 27, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [624, "Cutícula abierta", "30", "30_Ciencia_del_Cabello_y_Cuticula/Cuticula_abierta_A024.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [625, "Cutícula al microscopio", "30", "30_Ciencia_del_Cabello_y_Cuticula/Cuticula_al_microscopio_A023.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [626, "Cutícula cerrada", "30", "30_Ciencia_del_Cabello_y_Cuticula/Cuticula_cerrada_A025.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [627, "Cutícula dañada", "30", "30_Ciencia_del_Cabello_y_Cuticula/Cuticula_danada_A028.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [628, "Cutícula del cabello", "30", "30_Ciencia_del_Cabello_y_Cuticula/Cuticula_del_cabello_A021.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [629, "Cutícula sana", "30", "30_Ciencia_del_Cabello_y_Cuticula/Cuticula_sana_A029.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [630, "Efecto del calor en la fibra", "30", "30_Ciencia_del_Cabello_y_Cuticula/Efecto_del_calor_en_la_fibra_A027.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [631, "Estructura: cutícula, corteza y médula", "30", "30_Ciencia_del_Cabello_y_Cuticula/Estructura_cuticula_corteza_y_medula_A022.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [632, "Estructura del cabello", "30", "30_Ciencia_del_Cabello_y_Cuticula/Estructura_del_cabello_A030.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [633, "Hidratación de la fibra capilar", "30", "30_Ciencia_del_Cabello_y_Cuticula/Hidratacion_de_la_fibra_capilar_A026.jpg", 28, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [634, "Atención a la clienta en el salón", "31", "31_Salon_Clienta_y_Corte/01_Clienta_en_el_Salon/Atencion_a_la_clienta_en_el_salon_A031.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [635, "Clienta con capa (perfil)", "31", "31_Salon_Clienta_y_Corte/01_Clienta_en_el_Salon/Clienta_con_capa_perfil_A034.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [636, "Clienta en el sillón (cuerpo entero)", "31", "31_Salon_Clienta_y_Corte/01_Clienta_en_el_Salon/Clienta_en_el_sillon_cuerpo_entero_A040.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [637, "Clienta en el sillón (tres cuartos)", "31", "31_Salon_Clienta_y_Corte/01_Clienta_en_el_Salon/Clienta_en_el_sillon_tres_cuartos_A050.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [638, "Clienta sentada de perfil", "31", "31_Salon_Clienta_y_Corte/01_Clienta_en_el_Salon/Clienta_sentada_de_perfil_A041.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [639, "Clienta sentada en el salón", "31", "31_Salon_Clienta_y_Corte/01_Clienta_en_el_Salon/Clienta_sentada_en_el_salon_A032.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [640, "Consulta con la clienta", "31", "31_Salon_Clienta_y_Corte/01_Clienta_en_el_Salon/Consulta_con_la_clienta_A037.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [641, "Clienta con capa (frente)", "31", "31_Salon_Clienta_y_Corte/02_Clienta_con_Capa/Clienta_con_capa_frente_A043.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [642, "Clienta con capa lista para el servicio", "31", "31_Salon_Clienta_y_Corte/02_Clienta_con_Capa/Clienta_con_capa_lista_para_el_servicio_A035.jpg", 29, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [643, "Corte con tijera y peine", "31", "31_Salon_Clienta_y_Corte/03_Corte_con_Tijera_y_Peine/Corte_con_tijera_y_peine_A038.jpg", 29, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [644, "Corte de mechón entre los dedos", "31", "31_Salon_Clienta_y_Corte/03_Corte_con_Tijera_y_Peine/Corte_de_mechon_entre_los_dedos_A045.jpg", 29, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [645, "Corte de nuca con tijera y peine", "31", "31_Salon_Clienta_y_Corte/03_Corte_con_Tijera_y_Peine/Corte_de_nuca_con_tijera_y_peine_A049.jpg", 29, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [646, "Corte de puntas con tijera", "31", "31_Salon_Clienta_y_Corte/03_Corte_con_Tijera_y_Peine/Corte_de_puntas_con_tijera_A044.jpg", 29, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [647, "Mechón tensado con peine", "31", "31_Salon_Clienta_y_Corte/03_Corte_con_Tijera_y_Peine/Mechon_tensado_con_peine_A039.jpg", 29, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [648, "Bob corto visto por detrás", "31", "31_Salon_Clienta_y_Corte/04_Resultados_en_el_Sillon/Bob_corto_visto_por_detras_A042.jpg", 29, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [649, "Bob de perfil (resultado)", "31", "31_Salon_Clienta_y_Corte/04_Resultados_en_el_Sillon/Bob_de_perfil_resultado_A047.jpg", 29, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [650, "Bob redondo visto por detrás", "31", "31_Salon_Clienta_y_Corte/04_Resultados_en_el_Sillon/Bob_redondo_visto_por_detras_A046.jpg", 29, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [651, "Bob visto por detrás en el sillón", "31", "31_Salon_Clienta_y_Corte/04_Resultados_en_el_Sillon/Bob_visto_por_detras_en_el_sillon_A033.jpg", 29, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [652, "Cabello largo degradado por detrás", "31", "31_Salon_Clienta_y_Corte/04_Resultados_en_el_Sillon/Cabello_largo_degradado_por_detras_A048.jpg", 29, 0],
    [653, "Cabello largo liso visto por detrás", "31", "31_Salon_Clienta_y_Corte/04_Resultados_en_el_Sillon/Cabello_largo_liso_visto_por_detras_A036.jpg", 29, 0],
    [654, "Cepillo redondo y secador en cabello largo liso", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Cepillo_redondo_y_secador_en_cabello_largo_liso_C012.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [655, "Secado con boquilla y moños", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_con_boquilla_y_monos_C019.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [656, "Secado de bob con cepillo", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_de_bob_con_cepillo_C017.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [657, "Secado de la raíz con cepillo (frente)", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_de_la_raiz_con_cepillo_frente_C014.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [658, "Secado de lateral con cepillo", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_de_lateral_con_cepillo_C016.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [659, "Secado de mechón con cepillo (vista posterior)", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_de_mechon_con_cepillo_vista_posterior_C015.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [660, "Secado de nuca con cepillo", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_de_nuca_con_cepillo_C020.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [661, "Secado de raíz con cepillo redondo (perfil)", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_de_raiz_con_cepillo_redondo_perfil_C011.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [662, "Secado del frente con cepillo redondo", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_del_frente_con_cepillo_redondo_C013.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [663, "Secado por secciones con clip", "32", "32_Secado_con_Cepillo_y_Secador/01_Secado_con_Cepillo_Redondo/Secado_por_secciones_con_clip_C018.jpg", 30, ["tec", "cb_cab_secado", 1, "cb_cab_secado"]],
    [664, "Corte con tijera sobre cepillo", "32", "32_Secado_con_Cepillo_y_Secador/02_Corte_sobre_Cepillo/Corte_con_tijera_sobre_cepillo_C022.jpg", 30, 0],
    [665, "Corte de mechón en la nuca", "32", "32_Secado_con_Cepillo_y_Secador/02_Corte_sobre_Cepillo/Corte_de_mechon_en_la_nuca_C023.jpg", 30, 0],
    [666, "Corte de puntas sobre mechón tensado", "32", "32_Secado_con_Cepillo_y_Secador/02_Corte_sobre_Cepillo/Corte_de_puntas_sobre_mechon_tensado_C021.jpg", 30, 0],
    [667, "Planchado de cabello largo (vista posterior)", "33", "33_Planchado/Planchado_de_cabello_largo_vista_posterior_C033.jpg", 31, ["tec", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [668, "Planchado de mechón con pinza", "33", "33_Planchado/Planchado_de_mechon_con_pinza_C032.jpg", 31, ["tec", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [669, "Planchado de mechón (primer plano)", "33", "33_Planchado/Planchado_de_mechon_primer_plano_C031.jpg", 31, ["tec", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [670, "Planchado de raíz a puntas (perfil)", "33", "33_Planchado/Planchado_de_raiz_a_puntas_perfil_C034.jpg", 31, ["tec", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [671, "Resultado de planchado liso", "33", "33_Planchado/Resultado_de_planchado_liso_C035.jpg", 31, ["tec", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [672, "Aplicación de producto con brocha sobre foil", "34", "34_Mechas_con_Papel_y_Gorro/01_Mechas_con_Papel_Foil/Aplicacion_de_producto_con_brocha_sobre_foil_C037.jpg", 32, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [673, "Mechas con foil por zonas", "34", "34_Mechas_con_Papel_y_Gorro/01_Mechas_con_Papel_Foil/Mechas_con_foil_por_zonas_C039.jpg", 32, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [674, "Mechas con foil y flequillo", "34", "34_Mechas_con_Papel_y_Gorro/01_Mechas_con_Papel_Foil/Mechas_con_foil_y_flequillo_C044.jpg", 32, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [675, "Papeles foil colocados con moño", "34", "34_Mechas_con_Papel_y_Gorro/01_Mechas_con_Papel_Foil/Papeles_foil_colocados_con_mono_C036.jpg", 32, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [676, "Papeles foil en la nuca", "34", "34_Mechas_con_Papel_y_Gorro/01_Mechas_con_Papel_Foil/Papeles_foil_en_la_nuca_C038.jpg", 32, ["tec", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [677, "Extracción de mechones con gancho", "34", "34_Mechas_con_Papel_y_Gorro/02_Tecnica_de_Gorro/Extraccion_de_mechones_con_gancho_C043.jpg", 32, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [678, "Gorro metálico (vista posterior)", "34", "34_Mechas_con_Papel_y_Gorro/02_Tecnica_de_Gorro/Gorro_metalico_vista_posterior_C042.jpg", 32, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [679, "Gorro perforado (perfil)", "34", "34_Mechas_con_Papel_y_Gorro/02_Tecnica_de_Gorro/Gorro_perforado_perfil_C041.jpg", 32, ["tec", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [680, "Mechas finas (vista posterior)", "34", "34_Mechas_con_Papel_y_Gorro/03_Trazado_y_Resultados/Mechas_finas_vista_posterior_C045.jpg", 32, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [681, "Resultado de mechas rubias en capas", "34", "34_Mechas_con_Papel_y_Gorro/03_Trazado_y_Resultados/Resultado_de_mechas_rubias_en_capas_C040.jpg", 32, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [682, "Resultado en capas con mechas (frente)", "34", "34_Mechas_con_Papel_y_Gorro/03_Trazado_y_Resultados/Resultado_en_capas_con_mechas_frente_C050.jpg", 32, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [683, "Resultado en capas con mechas (perfil)", "34", "34_Mechas_con_Papel_y_Gorro/03_Trazado_y_Resultados/Resultado_en_capas_con_mechas_perfil_C048.jpg", 32, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [684, "Resultado en capas con mechas (posterior)", "34", "34_Mechas_con_Papel_y_Gorro/03_Trazado_y_Resultados/Resultado_en_capas_con_mechas_posterior_C049.jpg", 32, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [685, "Trazado de mechas (frente)", "34", "34_Mechas_con_Papel_y_Gorro/03_Trazado_y_Resultados/Trazado_de_mechas_frente_C046.jpg", 32, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [686, "Trazado de mechas (vista posterior)", "34", "34_Mechas_con_Papel_y_Gorro/03_Trazado_y_Resultados/Trazado_de_mechas_vista_posterior_C047.jpg", 32, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [687, "Bob cuadrado con nuca recta (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/01_Bob_Cuadrado/Bob_cuadrado_con_nuca_recta_vista_posterior_B015.jpg", 33, ["corte", "bob_recto", 1, "pe_u_c_melenas"]],
    [688, "Bob cuadrado (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/01_Bob_Cuadrado/Bob_cuadrado_vista_posterior_B004.jpg", 33, ["corte", "bob_recto", 1, "pe_u_c_melenas"]],
    [689, "Bob semi U ovalado (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/02_Bob_Semi_U_Semirredondo/Bob_semi_U_ovalado_vista_posterior_C028.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [690, "Bob semi U suave (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/02_Bob_Semi_U_Semirredondo/Bob_semi_U_suave_vista_posterior_C030.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [691, "Bob semi U (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/02_Bob_Semi_U_Semirredondo/Bob_semi_U_vista_posterior_B012.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [692, "Bob semirredondo (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/02_Bob_Semi_U_Semirredondo/Bob_semirredondo_vista_posterior_B025.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [693, "Bob redondo con punta marcada (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/03_Bob_Redondo/Bob_redondo_con_punta_marcada_vista_posterior_C024.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [694, "Bob redondo (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/03_Bob_Redondo/Bob_redondo_vista_posterior_B009.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [695, "Bob redondo recto con bordes suaves (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/04_Bob_Redondo_Recto/Bob_redondo_recto_con_bordes_suaves_vista_posterior_B045.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [696, "Bob redondo recto (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/04_Bob_Redondo_Recto/Bob_redondo_recto_vista_posterior_B024.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [697, "Bob con guías de proporción", "35", "35_Cortes_por_Forma_y_Vista/05_Bob_sin_Flequillo/Bob_con_guias_de_proporcion_C026.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [698, "Bob con raya al medio (frente)", "35", "35_Cortes_por_Forma_y_Vista/05_Bob_sin_Flequillo/Bob_con_raya_al_medio_frente_C029.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [699, "Bob con raya lateral (perfil)", "35", "35_Cortes_por_Forma_y_Vista/05_Bob_sin_Flequillo/Bob_con_raya_lateral_perfil_C027.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [700, "Bob en cuatro vistas", "35", "35_Cortes_por_Forma_y_Vista/05_Bob_sin_Flequillo/Bob_en_cuatro_vistas_C025.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [701, "Bob liso (frente)", "35", "35_Cortes_por_Forma_y_Vista/05_Bob_sin_Flequillo/Bob_liso_frente_B044.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [702, "Bob sin flequillo (perfil)", "35", "35_Cortes_por_Forma_y_Vista/05_Bob_sin_Flequillo/Bob_sin_flequillo_perfil_B008.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [703, "Bob con flequillo (frente)", "35", "35_Cortes_por_Forma_y_Vista/06_Bob_con_Flequillo/Bob_con_flequillo_frente_B007.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [704, "Bob con flequillo (frente, hombros)", "35", "35_Cortes_por_Forma_y_Vista/06_Bob_con_Flequillo/Bob_con_flequillo_frente_hombros_B013.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [705, "Bob con flequillo (perfil)", "35", "35_Cortes_por_Forma_y_Vista/06_Bob_con_Flequillo/Bob_con_flequillo_perfil_B011.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [706, "Bob con flequillo (perfil izquierdo)", "35", "35_Cortes_por_Forma_y_Vista/06_Bob_con_Flequillo/Bob_con_flequillo_perfil_izquierdo_B046.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [707, "Bob con flequillo recto (frente)", "35", "35_Cortes_por_Forma_y_Vista/06_Bob_con_Flequillo/Bob_con_flequillo_recto_frente_B001.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [708, "Bob con flequillo (tres cuartos)", "35", "35_Cortes_por_Forma_y_Vista/06_Bob_con_Flequillo/Bob_con_flequillo_tres_cuartos_B010.jpg", 33, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [709, "Capas largas con cortina (frente)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_con_cortina_frente_B022.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [710, "Capas largas con mechas (perfil)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_con_mechas_perfil_B048.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [711, "Capas largas en U (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_en_U_vista_posterior_B021.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [712, "Capas largas en V (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_en_V_vista_posterior_B049.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [713, "Capas largas (frente)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_frente_B019.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [714, "Capas largas (perfil)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_perfil_B020.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [715, "Capas largas (perfil izquierdo)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_perfil_izquierdo_B023.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [716, "Capas largas suaves (frente)", "35", "35_Cortes_por_Forma_y_Vista/07_Capas_Largas_en_U_y_V/Capas_largas_suaves_frente_B047.jpg", 33, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [717, "Largo recto con puntas rectas (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/08_Largo_Recto/Largo_recto_con_puntas_rectas_vista_posterior_B030.jpg", 33, ["corte", "recto_largo", 1, "pe_u_c_basicos"]],
    [718, "Largo recto (frente)", "35", "35_Cortes_por_Forma_y_Vista/08_Largo_Recto/Largo_recto_frente_B016.jpg", 33, ["corte", "recto_largo", 1, "pe_u_c_basicos"]],
    [719, "Largo recto (perfil)", "35", "35_Cortes_por_Forma_y_Vista/08_Largo_Recto/Largo_recto_perfil_B017.jpg", 33, ["corte", "recto_largo", 1, "pe_u_c_basicos"]],
    [720, "Largo recto (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/08_Largo_Recto/Largo_recto_vista_posterior_B018.jpg", 33, ["corte", "recto_largo", 1, "pe_u_c_basicos"]],
    [721, "Lob recto (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/08_Largo_Recto/Lob_recto_vista_posterior_B027.jpg", 33, ["corte", "lob", 1, "pe_u_c_melenas"]],
    [722, "Corte de capa con guía y clip (perfil)", "35", "35_Cortes_por_Forma_y_Vista/09_Proceso_de_Corte_Nuca_y_Capas/Corte_de_capa_con_guia_y_clip_perfil_B036.jpg", 33, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [723, "Corte de nuca con peine (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/09_Proceso_de_Corte_Nuca_y_Capas/Corte_de_nuca_con_peine_vista_posterior_B035.jpg", 33, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [724, "Secciones de nuca con moños (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/09_Proceso_de_Corte_Nuca_y_Capas/Secciones_de_nuca_con_monos_vista_posterior_B034.jpg", 33, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [725, "Pixie con flequillo (frente)", "35", "35_Cortes_por_Forma_y_Vista/10_Pixie/Pixie_con_flequillo_frente_B037.jpg", 33, ["corte", "pixie", 1, "pe_u_c_cortos"]],
    [726, "Pixie con flequillo (perfil)", "35", "35_Cortes_por_Forma_y_Vista/10_Pixie/Pixie_con_flequillo_perfil_B038.jpg", 33, ["corte", "pixie", 1, "pe_u_c_cortos"]],
    [727, "Pixie con mechas rubias (perfil)", "35", "35_Cortes_por_Forma_y_Vista/10_Pixie/Pixie_con_mechas_rubias_perfil_B040.jpg", 33, ["corte", "pixie", 1, "pe_u_c_cortos"]],
    [728, "Pixie desfilado (frente)", "35", "35_Cortes_por_Forma_y_Vista/10_Pixie/Pixie_desfilado_frente_B041.jpg", 33, ["corte", "pixie_desfilado", 1, "pe_u_c_cortos"]],
    [729, "Pixie desfilado (perfil)", "35", "35_Cortes_por_Forma_y_Vista/10_Pixie/Pixie_desfilado_perfil_B042.jpg", 33, ["corte", "pixie_desfilado", 1, "pe_u_c_cortos"]],
    [730, "Pixie texturizado (nuca)", "35", "35_Cortes_por_Forma_y_Vista/10_Pixie/Pixie_texturizado_nuca_B043.jpg", 33, ["corte", "pixie", 1, "pe_u_c_cortos"]],
    [731, "Pixie texturizado (vista posterior)", "35", "35_Cortes_por_Forma_y_Vista/10_Pixie/Pixie_texturizado_vista_posterior_B039.jpg", 33, ["corte", "pixie", 1, "pe_u_c_cortos"]],
    [732, "Triángulo de pollina: partición triangular (vista superior)", "36", "36_Pollina_y_Flequillo/01_Triangulo_de_Pollina_Como_se_Saca/Particion_triangular_para_flequillo_vista_superior_B003.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [733, "Division para flequillo triangular", "36", "36_Pollina_y_Flequillo/02_Divisiones_para_Flequillo_por_Tipo/FORMAS_Flequillo_por_forma/01_Division_para_flequillo_triangular.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [734, "Division para flequillo cuadrado", "36", "36_Pollina_y_Flequillo/02_Divisiones_para_Flequillo_por_Tipo/FORMAS_Flequillo_por_forma/02_Division_para_flequillo_cuadrado.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [735, "Division para flequillo en punta", "36", "36_Pollina_y_Flequillo/02_Divisiones_para_Flequillo_por_Tipo/FORMAS_Flequillo_por_forma/03_Division_para_flequillo_en_punta.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [736, "Division para flequillo lateral", "36", "36_Pollina_y_Flequillo/02_Divisiones_para_Flequillo_por_Tipo/FORMAS_Flequillo_por_forma/04_Division_para_flequillo_lateral.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [737, "Flequillo cuadrado corte recto", "36", "36_Pollina_y_Flequillo/02_Divisiones_para_Flequillo_por_Tipo/FORMAS_Flequillo_por_forma/10_Flequillo_cuadrado_corte_recto.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [738, "Flequillo triangular corte en punta", "36", "36_Pollina_y_Flequillo/02_Divisiones_para_Flequillo_por_Tipo/FORMAS_Flequillo_por_forma/11_Flequillo_triangular_corte_en_punta.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [739, "Flequillo lateral corte diagonal", "36", "36_Pollina_y_Flequillo/02_Divisiones_para_Flequillo_por_Tipo/FORMAS_Flequillo_por_forma/12_Flequillo_lateral_corte_diagonal.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [740, "Pollina: división frontal en diagonal", "36", "36_Pollina_y_Flequillo/03_Pollina_Division_Frontal/Frente_en_diagonal_A075.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [741, "Pollina: división frontal en horizontal", "36", "36_Pollina_y_Flequillo/03_Pollina_Division_Frontal/Frente_en_horizontal_A074.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [742, "Pollina: división frontal en vertical", "36", "36_Pollina_y_Flequillo/03_Pollina_Division_Frontal/Frente_en_vertical_A073.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [743, "Corte de flequillo con tijera (frente)", "36", "36_Pollina_y_Flequillo/04_Corte_de_Pollina_Paso_a_Paso/Corte_de_flequillo_con_tijera_frente_B005.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [744, "Corte de flequillo con tijera (perfil)", "36", "36_Pollina_y_Flequillo/04_Corte_de_Pollina_Paso_a_Paso/Corte_de_flequillo_con_tijera_perfil_B006.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [745, "Flequillo desfilado con tijera (frente)", "36", "36_Pollina_y_Flequillo/04_Corte_de_Pollina_Paso_a_Paso/Flequillo_desfilado_con_tijera_frente_B031.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [746, "Flequillo desfilado con tijera (perfil)", "36", "36_Pollina_y_Flequillo/04_Corte_de_Pollina_Paso_a_Paso/Flequillo_desfilado_con_tijera_perfil_B032.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [747, "Flequillo terminado (vista superior)", "36", "36_Pollina_y_Flequillo/04_Corte_de_Pollina_Paso_a_Paso/Flequillo_terminado_vista_superior_B033.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [748, "Preparación de flequillo con clip (perfil)", "36", "36_Pollina_y_Flequillo/04_Corte_de_Pollina_Paso_a_Paso/Preparacion_de_flequillo_con_clip_perfil_B002.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [749, "División para flequillo triangular", "36", "36_Pollina_y_Flequillo/05_Flequillo_por_forma/01_Division_para_flequillo_triangular.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [750, "División para flequillo cuadrado", "36", "36_Pollina_y_Flequillo/05_Flequillo_por_forma/02_Division_para_flequillo_cuadrado.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [751, "División para flequillo en punta", "36", "36_Pollina_y_Flequillo/05_Flequillo_por_forma/03_Division_para_flequillo_en_punta.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [752, "División para flequillo lateral", "36", "36_Pollina_y_Flequillo/05_Flequillo_por_forma/04_Division_para_flequillo_lateral.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [753, "Flequillo cuadrado · corte recto", "36", "36_Pollina_y_Flequillo/05_Flequillo_por_forma/10_Flequillo_cuadrado_corte_recto.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [754, "Flequillo triangular · corte en punta", "36", "36_Pollina_y_Flequillo/05_Flequillo_por_forma/11_Flequillo_triangular_corte_en_punta.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [755, "Flequillo lateral · corte diagonal", "36", "36_Pollina_y_Flequillo/05_Flequillo_por_forma/12_Flequillo_lateral_corte_diagonal.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [756, "División para pollina cuadrada", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/05_Division_para_pollina_cuadrada.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [757, "División para pollina en triángulo", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/06_Division_para_pollina_en_triangulo.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [758, "Pollina cuadrada · vista lateral", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/07_Pollina_cuadrada_vista_lateral.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [759, "Pollina en triángulo · vista lateral", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/08_Pollina_en_triangulo_vista_lateral.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [760, "Pollina con división vertical", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/09_Pollina_con_division_vertical.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [761, "Pollina cuadrada · corte recto", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/13_Pollina_cuadrada_corte_recto.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [762, "Pollina en V · corte en V", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/14_Pollina_en_V_corte_en_V.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [763, "Pollina en U · corte en U", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/15_Pollina_en_U_corte_en_U.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [764, "Pollina alta · división en cruz", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/27_Pollina_alta_division_en_cruz.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [765, "Pollina baja · división horizontal", "36", "36_Pollina_y_Flequillo/06_Pollina_por_forma/28_Pollina_baja_division_horizontal.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [766, "Mechas en flequillo · vertical", "36", "36_Pollina_y_Flequillo/07_Flequillo_en_pollina_y_mechas/23_Mechas_en_flequillo_vertical.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [767, "Mechas en pollina · horizontal", "36", "36_Pollina_y_Flequillo/07_Flequillo_en_pollina_y_mechas/24_Mechas_en_pollina_horizontal.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [768, "Flequillo en pollina · triángulo", "36", "36_Pollina_y_Flequillo/07_Flequillo_en_pollina_y_mechas/25_Flequillo_en_pollina_triangulo.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [769, "Flequillo en pollina · cuadrado", "36", "36_Pollina_y_Flequillo/07_Flequillo_en_pollina_y_mechas/26_Flequillo_en_pollina_cuadrado.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [770, "Corte cuadrado · división horizontal", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/16_Corte_cuadrado_division_horizontal.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [771, "Corte redondo · división horizontal", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/17_Corte_redondo_division_horizontal.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [772, "Corte en box · división vertical", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/18_Corte_en_box_division_vertical.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [773, "Corte en capas · técnica vertical", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/19_Corte_en_capas_tecnica_vertical.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [774, "Corte en capas · técnica horizontal", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/20_Corte_en_capas_tecnica_horizontal.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [775, "Graduación · técnica vertical", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/21_Graduacion_tecnica_vertical.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [776, "Graduación · técnica horizontal", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/22_Graduacion_tecnica_horizontal.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [777, "Corte de puntas · técnica diagonal", "36", "36_Pollina_y_Flequillo/08_Division_y_capas_por_tecnica/29_Corte_de_puntas_tecnica_diagonal.jpg", 34, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [778, "Resumen de formas", "36", "36_Pollina_y_Flequillo/09_Resumen_de_formas/30_Resumen_de_formas.jpg", 34, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [779, "Diagonal frontal", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Diagonal_frontal_S3_03.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [780, "Diagonal posterior", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Diagonal_posterior_S3_04.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [781, "División diagonal", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_diagonal_S2_03.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [782, "División en 4 secciones (lateral)", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_4_secciones_lateral_S3_32.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [783, "División en 6 secciones (lateral)", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_6_secciones_lateral_S3_33.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [784, "División en 8 secciones", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_8_secciones_S2_09.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [785, "División en 8 secciones (lateral)", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_8_secciones_lateral_S3_34.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [786, "División en U", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_U_S2_05.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [787, "División en V", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_V_S2_04.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [788, "División en W", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_W_S3_19.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [789, "División en chevron", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_chevron_S3_17.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [790, "División en cuadrantes", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_cuadrantes_S2_08.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [791, "División en halo", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_halo_S3_10.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [792, "División en ladrillo", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_ladrillo_S3_05.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [793, "División en triángulos", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_triangulos_S3_22.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [794, "División en zigzag horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_zigzag_horizontal_S2_06.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [795, "División en zigzag vertical", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_en_zigzag_vertical_S2_07.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [796, "División horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_horizontal_S2_01.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [797, "División radial o estrella", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_radial_o_estrella_S3_08.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [798, "División vertical", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Division_vertical_S2_02.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [799, "Enmarcado facial", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Enmarcado_facial_S3_12.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [800, "Líneas de contorno", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Lineas_de_contorno_S3_46.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [801, "Paneles de coronilla", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Paneles_de_coronilla_S3_11.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [802, "Sectores en triángulo", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Sectores_en_triangulo_S3_30.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [803, "Zigzag alterno", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Zigzag_alterno_S3_16.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [804, "Zigzag de amplitud grande", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Zigzag_de_amplitud_grande_S3_15.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [805, "Zigzag de amplitud media", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Zigzag_de_amplitud_media_S3_13.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [806, "Zigzag de amplitud pequeña", "37", "37_Divisiones_para_Mechas_y_Balayage/01_Divisiones_Basicas_del_Cabello/Zigzag_de_amplitud_pequena_S3_14.jpg", 35, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [807, "Encixa en U (horizontal)", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_U_horizontal_S6_24.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [808, "Encixa en V (horizontal)", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_V_horizontal_S6_23.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [809, "Encixa en abanico", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_abanico_S6_30.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [810, "Encixa en cuadrante", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_cuadrante_S2_20.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [811, "Encixa en diagonal", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_diagonal_S6_25.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [812, "Encixa en escalera", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_escalera_S6_27.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [813, "Encixa en triángulos", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_triangulos_S6_28.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [814, "Encixa en zigzag", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_zigzag_S6_26.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [815, "Encixa en zigzag (vertical)", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_en_zigzag_vertical_S2_18.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [816, "Encixa grande (horizontal)", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_grande_horizontal_S6_22.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [817, "Encixa grande (vertical)", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_grande_vertical_S2_14.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [818, "Encixa pequeño (horizontal)", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_pequeno_horizontal_S6_21.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [819, "Encixa pequeño (vertical)", "37", "37_Divisiones_para_Mechas_y_Balayage/02_Encixas/Encixa_pequeno_vertical_S2_13.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [820, "Mechas chunky", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_chunky_S2_44.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [821, "Mechas con gorro (esquema)", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_gorro_esquema_S3_23.jpg", 35, ["uni", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [822, "Mechas con papel de aluminio diagonal", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_diagonal_S6_13.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [823, "Mechas con papel de aluminio en U", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_U_S6_15.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [824, "Mechas con papel de aluminio en V", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_V_S6_14.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [825, "Mechas con papel de aluminio en V (posterior)", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_V_posterior_S3_36.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [826, "Mechas con papel de aluminio en abanico", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_abanico_S2_25.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [827, "Mechas con papel de aluminio en cuadrícula", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_cuadricula_S6_17.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [828, "Mechas con papel de aluminio en diagonal cruzada", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_diagonal_cruzada_S6_20.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [829, "Mechas con papel de aluminio en ladrillo", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_ladrillo_S2_24.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [830, "Mechas con papel de aluminio en triángulos", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_triangulos_S6_18.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [831, "Mechas con papel de aluminio en zigzag", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_en_zigzag_S6_16.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [832, "Mechas con papel de aluminio horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_horizontal_S6_11.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [833, "Mechas con papel de aluminio vertical", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_con_papel_de_aluminio_vertical_S6_12.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [834, "Mechas en V de precisión", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_en_V_de_precision_S2_49.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [835, "Mechas en bloque", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_en_bloque_S2_47.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [836, "Mechas gruesas", "37", "37_Divisiones_para_Mechas_y_Balayage/03_Mechas_con_Papel_de_Aluminio/Mechas_gruesas_S3_42.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [837, "Babylights", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Babylights_S6_43.jpg", 35, ["uni", "cb_color_babylights", 1, "cb_color_babylights"]],
    [838, "Babylights en contorno", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Babylights_en_contorno_S3_41.jpg", 35, ["uni", "cb_color_babylights", 1, "cb_color_babylights"]],
    [839, "Contorno facial", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Contorno_facial_S6_45.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [840, "Mechas en corona", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_en_corona_S6_46.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [841, "Mechas en la nuca", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_en_la_nuca_S6_47.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [842, "Mechas finas (teasing)", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_finas_teasing_S3_06.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [843, "Mechas inferiores", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_inferiores_S6_50.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [844, "Mechas superiores", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_superiores_S6_48.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [845, "Mechas universales (área inferior)", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_universales_area_inferior_S2_30.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [846, "Mechas universales (área superior)", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_universales_area_superior_S2_29.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [847, "Mechas universales (cabello completo)", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_universales_cabello_completo_S2_26.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [848, "Mechas universales (corona)", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_universales_corona_S2_28.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [849, "Mechas universales (esquema)", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_universales_esquema_S3_07.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [850, "Mechas universales (frente y contorno)", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Mechas_universales_frente_y_contorno_S2_27.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [851, "Money piece", "37", "37_Divisiones_para_Mechas_y_Balayage/04_Mechas_Universales_y_Finas/Money_piece_S6_44.jpg", 35, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [852, "Balayage con raíz difuminada", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_con_raiz_difuminada_S2_48.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [853, "Balayage en U horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_U_horizontal_S6_04.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [854, "Balayage en V horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_V_horizontal_S6_03.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [855, "Balayage en cintas", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_cintas_S3_21.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [856, "Balayage en contorno", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_contorno_S2_38.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [857, "Balayage en corona", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_corona_S2_36.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [858, "Balayage en diagonal", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_diagonal_S2_33.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [859, "Balayage en diagonal cruzada", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_diagonal_cruzada_S6_10.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [860, "Balayage en escalera", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_escalera_S6_05.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [861, "Balayage en espiral", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_espiral_S6_09.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [862, "Balayage en puntas", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_puntas_S2_40.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [863, "Balayage en raíces", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_raices_S2_39.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [864, "Balayage en rombos", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_rombos_S6_07.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [865, "Balayage en superficie", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_superficie_S3_20.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [866, "Balayage en triángulos", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_triangulos_S6_06.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [867, "Balayage en zigzag diagonal", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_zigzag_diagonal_S6_02.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [868, "Balayage en zigzag horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_zigzag_horizontal_S6_01.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [869, "Balayage en zigzag vertical", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_en_zigzag_vertical_S2_32.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [870, "Balayage frontal", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_frontal_S2_37.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [871, "Balayage horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_horizontal_S3_49.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [872, "Balayage vertical", "37", "37_Divisiones_para_Mechas_y_Balayage/05_Balayage_por_Patron/Balayage_vertical_S3_48.jpg", 35, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [873, "Técnica B diagonal", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_diagonal_S6_33.jpg", 35, 0],
    [874, "Técnica B en U", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_en_U_S6_34.jpg", 35, 0],
    [875, "Técnica B en V", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_en_V_S6_35.jpg", 35, 0],
    [876, "Técnica B en abanico", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_en_abanico_S6_40.jpg", 35, 0],
    [877, "Técnica B en escalera", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_en_escalera_S6_37.jpg", 35, 0],
    [878, "Técnica B en triángulos", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_en_triangulos_S6_39.jpg", 35, 0],
    [879, "Técnica B en zigzag", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_en_zigzag_S6_36.jpg", 35, 0],
    [880, "Técnica B horizontal", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_horizontal_S6_31.jpg", 35, 0],
    [881, "Técnica B vertical", "37", "37_Divisiones_para_Mechas_y_Balayage/06_Tecnica_B/Tecnica_B_vertical_S6_32.jpg", 35, 0],
    [882, "Combinación total (balayage y mechas)", "37", "37_Divisiones_para_Mechas_y_Balayage/07_Raiz_Sombre_y_Combinaciones/Combinacion_total_balayage_y_mechas_S2_50.jpg", 35, 0],
    [883, "Efecto raíz difuminada", "37", "37_Divisiones_para_Mechas_y_Balayage/07_Raiz_Sombre_y_Combinaciones/Efecto_raiz_difuminada_S6_41.jpg", 35, ["uni", "cb_color_sombre", 1, "cb_color_sombre"]],
    [884, "Mezcla de técnicas", "37", "37_Divisiones_para_Mechas_y_Balayage/07_Raiz_Sombre_y_Combinaciones/Mezcla_de_tecnicas_S3_44.jpg", 35, 0],
    [885, "Secuencia de aclarado (progresión de cobertura)", "37", "37_Divisiones_para_Mechas_y_Balayage/07_Raiz_Sombre_y_Combinaciones/Secuencia_de_aclarado_progresion_de_cobertura_S3_35.jpg", 35, 0],
    [886, "Sombré", "37", "37_Divisiones_para_Mechas_y_Balayage/07_Raiz_Sombre_y_Combinaciones/Sombre_S6_42.jpg", 35, ["uni", "cb_color_sombre", 1, "cb_color_sombre"]],
    [887, "Triángulos alternos", "37", "37_Divisiones_para_Mechas_y_Balayage/07_Raiz_Sombre_y_Combinaciones/Triangulos_alternos_S3_45.jpg", 35, 0],
    [888, "División en cuadros para tinte", "38", "38_Tintes_Mezclas_y_Aplicacion/01_Divisiones_para_Tinte/Division_en_cuadros_para_tinte_S4_01.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [889, "División en horizontal", "38", "38_Tintes_Mezclas_y_Aplicacion/01_Divisiones_para_Tinte/Division_en_horizontal_S4_04.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [890, "División en triángulos", "38", "38_Tintes_Mezclas_y_Aplicacion/01_Divisiones_para_Tinte/Division_en_triangulos_S4_02.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [891, "División en vertical", "38", "38_Tintes_Mezclas_y_Aplicacion/01_Divisiones_para_Tinte/Division_en_vertical_S4_03.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [892, "Aplicación de tinte en raíz", "38", "38_Tintes_Mezclas_y_Aplicacion/02_Aplicacion_en_Raiz_y_Canas/Aplicacion_de_tinte_en_raiz_S4_05.jpg", 36, ["uni", "cb_color_raiz", 1, "cb_color_raiz"]],
    [893, "Cobertura de canas (100%)", "38", "38_Tintes_Mezclas_y_Aplicacion/02_Aplicacion_en_Raiz_y_Canas/Cobertura_de_canas_100_S4_36.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [894, "Resultado en raíz (cana cubierta)", "38", "38_Tintes_Mezclas_y_Aplicacion/02_Aplicacion_en_Raiz_y_Canas/Resultado_en_raiz_cana_cubierta_S4_07.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [895, "Tinte en raíz en cabello natural", "38", "38_Tintes_Mezclas_y_Aplicacion/02_Aplicacion_en_Raiz_y_Canas/Tinte_en_raiz_en_cabello_natural_S4_08.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [896, "Tinte en raíz para cana", "38", "38_Tintes_Mezclas_y_Aplicacion/02_Aplicacion_en_Raiz_y_Canas/Tinte_en_raiz_para_cana_S4_06.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [897, "Técnica de color raíz en diferentes alturas", "38", "38_Tintes_Mezclas_y_Aplicacion/03_Raiz_Degradado_y_Sombra/Tecnica_de_color_raiz_en_diferentes_alturas_S4_39.jpg", 36, ["uni", "cb_color_sombre", 1, "cb_color_sombre"]],
    [898, "Técnica de raíz degradé", "38", "38_Tintes_Mezclas_y_Aplicacion/03_Raiz_Degradado_y_Sombra/Tecnica_de_raiz_degrade_S4_09.jpg", 36, ["uni", "cb_color_sombre", 1, "cb_color_sombre"]],
    [899, "Técnica de raíz sombreada", "38", "38_Tintes_Mezclas_y_Aplicacion/03_Raiz_Degradado_y_Sombra/Tecnica_de_raiz_sombreada_S4_10.jpg", 36, ["uni", "cb_color_sombre", 1, "cb_color_sombre"]],
    [900, "Técnica de root shadow", "38", "38_Tintes_Mezclas_y_Aplicacion/03_Raiz_Degradado_y_Sombra/Tecnica_de_root_shadow_S4_44.jpg", 36, ["uni", "cb_color_sombre", 1, "cb_color_sombre"]],
    [901, "Técnica de sombras en raíces", "38", "38_Tintes_Mezclas_y_Aplicacion/03_Raiz_Degradado_y_Sombra/Tecnica_de_sombras_en_raices_S4_45.jpg", 36, ["uni", "cb_color_sombre", 1, "cb_color_sombre"]],
    [902, "Aplicación de tinte en cabello procesado", "38", "38_Tintes_Mezclas_y_Aplicacion/04_Cabello_Procesado_y_Correccion/Aplicacion_de_tinte_en_cabello_procesado_S4_13.jpg", 36, ["uni", "cb_color_raiz", 1, "cb_color_raiz"]],
    [903, "Baño de color", "38", "38_Tintes_Mezclas_y_Aplicacion/04_Cabello_Procesado_y_Correccion/Bano_de_color_S4_15.jpg", 36, ["uni", "cb_color_raiz", 1, "cb_color_raiz"]],
    [904, "Cabello ya procesado (retoque de color)", "38", "38_Tintes_Mezclas_y_Aplicacion/04_Cabello_Procesado_y_Correccion/Cabello_ya_procesado_retoque_de_color_S4_11.jpg", 36, ["uni", "cb_color_raiz", 1, "cb_color_raiz"]],
    [905, "Corrección de color en cabello procesado", "38", "38_Tintes_Mezclas_y_Aplicacion/04_Cabello_Procesado_y_Correccion/Correccion_de_color_en_cabello_procesado_S4_14.jpg", 36, ["uni", "cb_color_raiz", 1, "cb_color_raiz"]],
    [906, "Técnica para cabello procesado (gloss)", "38", "38_Tintes_Mezclas_y_Aplicacion/04_Cabello_Procesado_y_Correccion/Tecnica_para_cabello_procesado_gloss_S4_12.jpg", 36, ["uni", "cb_color_raiz", 1, "cb_color_raiz"]],
    [907, "Aplicación en medios y puntas", "38", "38_Tintes_Mezclas_y_Aplicacion/05_Balayage_Mechas_y_Gorro/Aplicacion_en_medios_y_puntas_S4_38.jpg", 36, 0],
    [908, "Mechas californianas", "38", "38_Tintes_Mezclas_y_Aplicacion/05_Balayage_Mechas_y_Gorro/Mechas_californianas_S4_20.jpg", 36, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [909, "Mechas con gorro", "38", "38_Tintes_Mezclas_y_Aplicacion/05_Balayage_Mechas_y_Gorro/Mechas_con_gorro_S4_17.jpg", 36, ["uni", "cb_mechas_gorro", 1, "cb_mechas_gorro"]],
    [910, "Mechas con papel y tinte", "38", "38_Tintes_Mezclas_y_Aplicacion/05_Balayage_Mechas_y_Gorro/Mechas_con_papel_y_tinte_S4_18.jpg", 36, ["uni", "cb_mechas_aluminio", 1, "cb_mechas_aluminio"]],
    [911, "Método de balayage", "38", "38_Tintes_Mezclas_y_Aplicacion/05_Balayage_Mechas_y_Gorro/Metodo_de_balayage_S4_16.jpg", 36, ["uni", "cb_color_balayage", 1, "cb_color_balayage"]],
    [912, "Cinco tintes (5 colores)", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Cinco_tintes_5_colores_S4_24.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [913, "Cuatro tintes (4 colores)", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Cuatro_tintes_4_colores_S4_23.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [914, "Dilución del tinte", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Dilucion_del_tinte_S4_34.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [915, "Dos tintes (2 colores)", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Dos_tintes_2_colores_S4_22.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [916, "Emulsión del tinte", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Emulsion_del_tinte_S4_33.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [917, "Mezcla de tinte y peróxido", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Mezcla_de_tinte_y_peroxido_S4_37.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [918, "Textura del tinte", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Textura_del_tinte_S4_35.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [919, "Tres tintes (3 colores)", "38", "38_Tintes_Mezclas_y_Aplicacion/06_Mezclas_de_Tinte_en_Bowl/Tres_tintes_3_colores_S4_21.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [920, "10 volúmenes (3%)", "38", "38_Tintes_Mezclas_y_Aplicacion/07_Peroxido_y_Volumenes/10_volumenes_3_S4_26.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [921, "20 volúmenes (6%)", "38", "38_Tintes_Mezclas_y_Aplicacion/07_Peroxido_y_Volumenes/20_volumenes_6_S4_27.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [922, "Peróxido (10, 20 y 30 volúmenes)", "38", "38_Tintes_Mezclas_y_Aplicacion/07_Peroxido_y_Volumenes/Peroxido_10_20_y_30_volumenes_S4_25.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [923, "Aplicación de protector térmico", "38", "38_Tintes_Mezclas_y_Aplicacion/08_Preparacion_y_Cuidado/Aplicacion_de_protector_termico_S4_30.jpg", 36, 0],
    [924, "Aplicación de tratamiento reparador", "38", "38_Tintes_Mezclas_y_Aplicacion/08_Preparacion_y_Cuidado/Aplicacion_de_tratamiento_reparador_S4_32.jpg", 36, 0],
    [925, "Cuidado post color", "38", "38_Tintes_Mezclas_y_Aplicacion/08_Preparacion_y_Cuidado/Cuidado_post_color_S4_49.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [926, "Lavado y preparación del cabello", "38", "38_Tintes_Mezclas_y_Aplicacion/08_Preparacion_y_Cuidado/Lavado_y_preparacion_del_cabello_S4_31.jpg", 36, ["uni", "pe_u_fund", 1, "pe_u_fund"]],
    [927, "Preparación del cabello para planchado", "38", "38_Tintes_Mezclas_y_Aplicacion/08_Preparacion_y_Cuidado/Preparacion_del_cabello_para_planchado_S4_29.jpg", 36, ["uni", "cb_cab_planchado", 1, "cb_cab_planchado"]],
    [928, "Preparación del cabello para secado", "38", "38_Tintes_Mezclas_y_Aplicacion/08_Preparacion_y_Cuidado/Preparacion_del_cabello_para_secado_S4_28.jpg", 36, ["uni", "cb_cab_secado", 1, "cb_cab_secado"]],
    [929, "Carta de color", "38", "38_Tintes_Mezclas_y_Aplicacion/09_Diagnostico_y_Carta_de_Color/Carta_de_color_S4_41.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [930, "Diagnóstico capilar", "38", "38_Tintes_Mezclas_y_Aplicacion/09_Diagnostico_y_Carta_de_Color/Diagnostico_capilar_S4_42.jpg", 36, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [931, "Fórmula de color", "38", "38_Tintes_Mezclas_y_Aplicacion/09_Diagnostico_y_Carta_de_Color/Formula_de_color_S4_43.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [932, "Perfil de color en diferentes alturas", "38", "38_Tintes_Mezclas_y_Aplicacion/09_Diagnostico_y_Carta_de_Color/Perfil_de_color_en_diferentes_alturas_S4_40.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [933, "Cabello natural (porosidad alta)", "38", "38_Tintes_Mezclas_y_Aplicacion/10_Resultados_y_Cabello_Natural/Cabello_natural_porosidad_alta_S4_48.jpg", 36, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [934, "Cabello natural (porosidad baja)", "38", "38_Tintes_Mezclas_y_Aplicacion/10_Resultados_y_Cabello_Natural/Cabello_natural_porosidad_baja_S4_47.jpg", 36, ["uni", "pe_u_cab", 1, "pe_u_cab"]],
    [935, "Coloración en cabello virgen", "38", "38_Tintes_Mezclas_y_Aplicacion/10_Resultados_y_Cabello_Natural/Coloracion_en_cabello_virgen_S4_46.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [936, "Resultado final", "38", "38_Tintes_Mezclas_y_Aplicacion/10_Resultados_y_Cabello_Natural/Resultado_final_S4_50.jpg", 36, ["uni", "cb_color_global", 1, "cb_color_global"]],
    [937, "Corte bob clásico", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_bob_clasico_S1_01.jpg", 37, ["corte", "bob_recto", 1, "pe_u_c_melenas"]],
    [938, "Corte bob escalonado", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_bob_escalonado_S1_02.jpg", 37, 0],
    [939, "Corte degradado", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_degradado_S1_26.jpg", 37, 0],
    [940, "Corte en U", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_en_U_S1_07.jpg", 37, ["corte", "basico_u", 1, "pe_u_c_basicos"]],
    [941, "Corte en V", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_en_V_S1_06.jpg", 37, ["corte", "basico_v", 1, "pe_u_c_basicos"]],
    [942, "Corte en capas largas", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_en_capas_largas_S1_03.jpg", 37, ["corte", "capas_largas", 1, "pe_u_c_capas"]],
    [943, "Corte en capas rizadas", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_en_capas_rizadas_S1_29.jpg", 37, 0],
    [944, "Corte en seco (rizados)", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_en_seco_rizados_S1_08.jpg", 37, ["corte", "rizo_seco", 1, "pe_u_c_rizado"]],
    [945, "Corte pixie", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_pixie_S1_04.jpg", 37, ["corte", "pixie", 1, "pe_u_c_cortos"]],
    [946, "Corte recto", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_recto_S1_05.jpg", 37, ["corte", "basico_cuadrado", 1, "pe_u_c_basicos"]],
    [947, "Corte shag", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Corte_shag_S1_09.jpg", 37, ["corte", "shag", 1, "pe_u_c_media"]],
    [948, "Long bob (lob)", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Long_bob_lob_S1_27.jpg", 37, ["corte", "lob", 1, "pe_u_c_melenas"]],
    [949, "Pixie texturizado", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Pixie_texturizado_S1_28.jpg", 37, 0],
    [950, "Rasurado en nuca", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/01_Tipos_de_Corte/Rasurado_en_nuca_S1_30.jpg", 37, 0],
    [951, "Flequillo cortina", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/02_Flequillos/Flequillo_cortina_S1_11.jpg", 37, ["corte", "fleq_cortina", 1, "pe_u_c_flequillos"]],
    [952, "Flequillo desfilado", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/02_Flequillos/Flequillo_desfilado_S1_12.jpg", 37, ["corte", "fleq_desfilado", 1, "pe_u_c_flequillos"]],
    [953, "Flequillo recto", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/02_Flequillos/Flequillo_recto_S1_10.jpg", 37, ["corte", "fleq_recto", 1, "pe_u_c_flequillos"]],
    [954, "Corte con navaja", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/03_Tecnicas_de_Tijera_y_Navaja/Corte_con_navaja_S1_25.jpg", 37, 0],
    [955, "Corte en horizontal", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/03_Tecnicas_de_Tijera_y_Navaja/Corte_en_horizontal_S1_22.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [956, "Corte en punta", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/03_Tecnicas_de_Tijera_y_Navaja/Corte_en_punta_S1_23.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [957, "Corte en vertical", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/03_Tecnicas_de_Tijera_y_Navaja/Corte_en_vertical_S1_21.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [958, "Entresacado", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/03_Tecnicas_de_Tijera_y_Navaja/Entresacado_S1_24.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [959, "División diagonal", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Division_diagonal_S1_13.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [960, "División en coleta", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Division_en_coleta_S1_20.jpg", 37, 0],
    [961, "División en media luna", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Division_en_media_luna_S1_14.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [962, "División horizontal", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Division_horizontal_S1_16.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [963, "División radial", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Division_radial_S1_18.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [964, "División vertical", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Division_vertical_S1_15.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [965, "Sección en cuadrícula", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Seccion_en_cuadricula_S1_19.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [966, "Secciones triangulares", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/04_Divisiones_con_Clips_en_Foto/Secciones_triangulares_S1_17.jpg", 37, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [967, "Babylights (resultado)", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/05_Color_en_Foto/Babylights_resultado_S1_37.jpg", 37, ["tec", "cb_color_babylights", 1, "cb_color_babylights"]],
    [968, "Color fantasía", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/05_Color_en_Foto/Color_fantasia_S1_40.jpg", 37, 0],
    [969, "Matización", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/05_Color_en_Foto/Matizacion_S1_41.jpg", 37, ["tec", "cb_quim_decoloracion", 1, "cb_quim_decoloracion"]],
    [970, "Ombré (resultado)", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/05_Color_en_Foto/Ombre_resultado_S1_38.jpg", 37, ["tec", "cb_color_sombre", 1, "cb_color_sombre"]],
    [971, "Sombré (resultado)", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/05_Color_en_Foto/Sombre_resultado_S1_39.jpg", 37, ["tec", "cb_color_sombre", 1, "cb_color_sombre"]],
    [972, "Alisado", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/06_Peinados_y_Texturas/Alisado_S1_44.jpg", 37, ["tec", "cb_quera_alisado", 1, "cb_quera_alisado"]],
    [973, "Peinado creativo", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/06_Peinados_y_Texturas/Peinado_creativo_S1_47.jpg", 37, 0],
    [974, "Permanente", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/06_Peinados_y_Texturas/Permanente_S1_43.jpg", 37, ["tec", "cb_quim_permanente", 1, "cb_quim_permanente"]],
    [975, "Recogido", "39", "39_Tecnicas_de_Corte_y_Estilos_en_Foto/06_Peinados_y_Texturas/Recogido_S1_46.jpg", 37, 0],
    [976, "Guía de partición para corte en V 03 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_03_S5_08.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [977, "Guía de partición para corte en V 05 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_05_S5_13.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [978, "Guía de partición para corte en V 07 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_07_S5_18.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [979, "Guía de partición corte en V · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_08_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [980, "Guía de partición para corte en V 09 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_09_S5_22.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [981, "Guía de partición para corte en V 10 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_10_S5_25.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [982, "Guía de partición para corte en V 11 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_11_S5_29.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [983, "Guía de partición corte en V · flequillo recto con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_13_flequillo_recto_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [984, "Guía de partición corte en V · flequillo lateral con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_15_flequillo_lateral_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [985, "Guía de partición para corte en V 17 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_17_S5_46.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [986, "Guía de partición para corte en V 18 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Con_capas/Guia_de_particion_para_corte_en_V_18_S5_49.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [987, "Guía de partición para corte en V 01 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Rectas_sin_capas/Guia_de_particion_para_corte_en_V_01_S5_01.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [988, "Guía de partición para corte en V 02 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Rectas_sin_capas/Guia_de_particion_para_corte_en_V_02_S5_05.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [989, "Guía de partición para corte en V 04 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Rectas_sin_capas/Guia_de_particion_para_corte_en_V_04_S5_10.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [990, "Guía de partición corte en V · sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Rectas_sin_capas/Guia_de_particion_para_corte_en_V_06_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [991, "Guía de partición corte en V · flequillo recto sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Rectas_sin_capas/Guia_de_particion_para_corte_en_V_12_flequillo_recto_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [992, "Guía de partición para corte en V 14 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Rectas_sin_capas/Guia_de_particion_para_corte_en_V_14_S5_37.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [993, "Guía de partición para corte en V 16 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/01_Corte_en_V/Rectas_sin_capas/Guia_de_particion_para_corte_en_V_16_S5_42.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [994, "Guía de partición corte cuadrado · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_corte_cuadrado_hoja2_02_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [995, "Guía de partición corte cuadrado · flequillo recto, con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_corte_cuadrado_hoja2_04_flequillo_recto_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [996, "Guía de partición corte cuadrado · flequillo lateral, con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_corte_cuadrado_hoja2_05_flequillo_lateral_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [997, "Corte cuadrado · capas suaves", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_de_particion_para_corte_cuadrado_04_capas_suaves.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [998, "Corte cuadrado · flequillo recto capas suaves", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_de_particion_para_corte_cuadrado_05_flequillo_recto_capas_suaves.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [999, "Corte cuadrado · capas medias", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_de_particion_para_corte_cuadrado_06_capas_medias.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1000, "Corte cuadrado · flequillo lateral capas medias", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_de_particion_para_corte_cuadrado_07_flequillo_lateral_capas_medias.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1001, "Corte cuadrado · capas intensas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Con_capas/Guia_de_particion_para_corte_cuadrado_08_capas_intensas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1002, "Guía de partición corte cuadrado · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Rectas_sin_capas/Guia_corte_cuadrado_hoja2_01_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1003, "Guía de partición corte cuadrado · flequillo recto, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Rectas_sin_capas/Guia_corte_cuadrado_hoja2_03_flequillo_recto_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1004, "Corte cuadrado · sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Rectas_sin_capas/Guia_de_particion_para_corte_cuadrado_01_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1005, "Guía de partición para corte cuadrado 02 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Rectas_sin_capas/Guia_de_particion_para_corte_cuadrado_02_S5_06.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1006, "Corte cuadrado · flequillo recto sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/02_Corte_Cuadrado/Rectas_sin_capas/Guia_de_particion_para_corte_cuadrado_03_flequillo_recto_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1007, "Guía de partición corte redondo · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_corte_redondo_hoja2_02_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1008, "Guía de partición corte redondo · flequillo recto, con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_corte_redondo_hoja2_04_flequillo_recto_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1009, "Guía de partición corte redondo · flequillo lateral, con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_corte_redondo_hoja2_05_flequillo_lateral_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1010, "Guía de partición para corte redondo 04 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_de_particion_para_corte_redondo_04_S5_16.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1011, "Guía de partición para corte redondo 06 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_de_particion_para_corte_redondo_06_S5_28.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1012, "Guía de partición para corte redondo 07 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_de_particion_para_corte_redondo_07_S5_33.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1013, "Guía de partición para corte redondo 08 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_de_particion_para_corte_redondo_08_S5_38.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1014, "Guía de partición para corte redondo 10 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Con_capas/Guia_de_particion_para_corte_redondo_10_S5_47.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1015, "Guía de partición corte redondo · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Rectas_sin_capas/Guia_corte_redondo_hoja2_01_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1016, "Guía de partición corte redondo · flequillo recto, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Rectas_sin_capas/Guia_corte_redondo_hoja2_03_flequillo_recto_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1017, "Guía de partición para corte redondo 03 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Rectas_sin_capas/Guia_de_particion_para_corte_redondo_03_S5_07.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1018, "Guía de partición para corte redondo 05 · recta, sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/03_Corte_Redondo/Rectas_sin_capas/Guia_de_particion_para_corte_redondo_05_S5_23.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1019, "Guía de partición para corte en U 01 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_01_S5_09.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1020, "Guía de partición para corte en U 03 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_03_S5_14.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1021, "Guía de partición para corte en U 04 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_04_S5_19.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1022, "Guía de partición corte en U · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_05_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1023, "Guía de partición para corte en U 07 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_07_S5_36.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1024, "Guía de partición corte en U · flequillo recto con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_08_flequillo_recto_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1025, "Guía de partición para corte en U 09 · con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_09_S5_44.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1026, "Guía de partición corte en U · flequillo lateral con capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Con_capas/Guia_de_particion_para_corte_en_U_10_flequillo_lateral_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1027, "Guía de partición corte en U · sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Rectas_sin_capas/Guia_de_particion_para_corte_en_U_02_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1028, "Guía de partición corte en U · flequillo recto sin capas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/04_Corte_en_U/Rectas_sin_capas/Guia_de_particion_para_corte_en_U_06_flequillo_recto_sin_capas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1029, "Corte semicuadrado · flequillo lateral capas ligeras", "40", "40_Guias_de_Particion_por_Forma_de_Corte/05_Corte_Semicuadrado/Con_capas/Corte_semicuadrado_flequillo_lateral_capas_ligeras.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1030, "Corte semicuadrado · flequillo lateral capas marcadas", "40", "40_Guias_de_Particion_por_Forma_de_Corte/05_Corte_Semicuadrado/Con_capas/Corte_semicuadrado_flequillo_lateral_capas_marcadas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1031, "Corte semicuadrado · flequillo recto capas ligeras", "40", "40_Guias_de_Particion_por_Forma_de_Corte/05_Corte_Semicuadrado/Con_capas/Corte_semicuadrado_flequillo_recto_capas_ligeras.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1032, "Corte redondo recto · sin capas, sin pollina (5 vistas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/06_Corte_Redondo_Recto/Rectas_sin_capas/Corte_redondo_recto_sin_capas_sin_pollina_5_vistas.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1033, "División · Corte recto largo", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/01_Corte_recto_largo.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1034, "División · Corte en U largo", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/02_Corte_en_U_largo.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1035, "División · Corte en V largo", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/03_Corte_en_V_largo.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1036, "División · Corte cuadrado largo", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/04_Corte_cuadrado_largo.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1037, "División · Corte redondo largo", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/05_Corte_redondo_largo.jpg", 38, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1038, "División · Corte Shanghai largo (recto)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/17_Corte_Shanghai_largo_recto.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1039, "División · Corte pixie (largo recto)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/19_Corte_pixie_largo_recto.jpg", 38, ["uni", "pe_u_c_cortos", 1, "pe_u_c_cortos"]],
    [1040, "División · Corte bob largo (recto)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/22_Corte_bob_largo_recto.jpg", 38, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1041, "División · Corte bob largo (en V)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/23_Corte_bob_largo_en_V.jpg", 38, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1042, "División · Corte bob largo (en U)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/24_Corte_bob_largo_en_U.jpg", 38, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1043, "División · Corte bob largo (redondo)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/01_Rectos_sin_capas/25_Corte_bob_largo_redondo.jpg", 38, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1044, "División · Corte redondo largo (con capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/06_Corte_redondo_largo_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1045, "División · Corte redondo largo (con capas rectas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/07_Corte_redondo_largo_con_capas_rectas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1046, "División · Corte en U largo (con capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/08_Corte_en_U_largo_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1047, "División · Corte en U largo (con capas rectas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/09_Corte_en_U_largo_con_capas_rectas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1048, "División · Corte en V largo (con capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/10_Corte_en_V_largo_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1049, "División · Corte en V largo (con capas rectas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/11_Corte_en_V_largo_con_capas_rectas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1050, "División · Corte cuadrado largo (con capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/12_Corte_cuadrado_largo_con_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1051, "División · Corte cuadrado largo (con capas rectas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/13_Corte_cuadrado_largo_con_capas_rectas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1052, "División · Corte redondo largo (en puntas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/14_Corte_redondo_largo_en_puntas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1053, "División · Corte redondo largo (en puntas rectas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/15_Corte_redondo_largo_en_puntas_rectas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1054, "División · Corte Shanghai largo (en capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/16_Corte_Shanghai_largo_en_capas.jpg", 38, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1055, "División · Corte pixie (largo en capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/18_Corte_pixie_largo_en_capas.jpg", 38, ["uni", "pe_u_c_cortos", 1, "pe_u_c_cortos"]],
    [1056, "División · Corte bob largo (en capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/21_Corte_bob_largo_en_capas.jpg", 38, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1057, "División · Corte shag largo (en capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/26_Corte_shag_largo_en_capas.jpg", 38, ["uni", "pe_u_c_media", 1, "pe_u_c_media"]],
    [1058, "División · Corte mariposa (largo en capas)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/28_Corte_mariposa_largo_en_capas.jpg", 38, ["uni", "pe_u_c_media", 1, "pe_u_c_media"]],
    [1059, "División · Corte long bob (en V)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/02_Con_capas/30_Corte_long_bob_en_V.jpg", 38, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1060, "División · Corte pixie (con flequillo lateral)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/03_Con_flequillo/20_Corte_pixie_con_flequillo_lateral.jpg", 38, ["uni", "pe_u_c_cortos", 1, "pe_u_c_cortos"]],
    [1061, "División · Corte shag largo (con flequillo)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/03_Con_flequillo/27_Corte_shag_largo_con_flequillo.jpg", 38, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [1062, "División · Corte mariposa (con flequillo)", "40", "40_Guias_de_Particion_por_Forma_de_Corte/07_Tecnicas_de_corte_largo_por_forma/03_Con_flequillo/29_Corte_mariposa_con_flequillo.jpg", 38, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [1063, "Postura del peluquero · Corte recto largo", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_01_Corte_recto_largo.jpg", 39, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1064, "Postura del peluquero · Corte en U largo", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_02_Corte_en_U_largo.jpg", 39, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1065, "Postura del peluquero · Corte en V largo", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_03_Corte_en_V_largo.jpg", 39, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1066, "Postura del peluquero · Corte cuadrado largo", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_04_Corte_cuadrado_largo.jpg", 39, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1067, "Postura del peluquero · Corte redondo largo", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_05_Corte_redondo_largo.jpg", 39, ["uni", "pe_u_c_basicos", 1, "pe_u_c_basicos"]],
    [1068, "Postura del peluquero · Corte redondo largo (con capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_06_Corte_redondo_largo_con_capas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1069, "Postura del peluquero · Corte redondo largo (con capas rectas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_07_Corte_redondo_largo_con_capas_rectas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1070, "Postura del peluquero · Corte en U largo (con capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_08_Corte_en_U_largo_con_capas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1071, "Postura del peluquero · Corte en U largo (con capas rectas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_09_Corte_en_U_largo_con_capas_rectas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1072, "Postura del peluquero · Corte en V largo (con capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_10_Corte_en_V_largo_con_capas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1073, "Postura del peluquero · Corte en V largo (con capas rectas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_11_Corte_en_V_largo_con_capas_rectas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1074, "Postura del peluquero · Corte cuadrado largo (con capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_12_Corte_cuadrado_largo_con_capas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1075, "Postura del peluquero · Corte cuadrado largo (con capas rectas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_13_Corte_cuadrado_largo_con_capas_rectas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1076, "Postura del peluquero · Corte redondo largo (en puntas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_14_Corte_redondo_largo_en_puntas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1077, "Postura del peluquero · Corte redondo largo (en puntas rectas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_15_Corte_redondo_largo_en_puntas_rectas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1078, "Postura del peluquero · Corte Shanghai largo (en capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_16_Corte_Shanghai_largo_en_capas.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1079, "Postura del peluquero · Corte Shanghai largo (recto)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_17_Corte_Shanghai_largo_recto.jpg", 39, ["uni", "pe_u_c_capas", 1, "pe_u_c_capas"]],
    [1080, "Postura del peluquero · Corte pixie (largo en capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_18_Corte_pixie_largo_en_capas.jpg", 39, ["uni", "pe_u_c_cortos", 1, "pe_u_c_cortos"]],
    [1081, "Postura del peluquero · Corte pixie (largo recto)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_19_Corte_pixie_largo_recto.jpg", 39, ["uni", "pe_u_c_cortos", 1, "pe_u_c_cortos"]],
    [1082, "Postura del peluquero · Corte pixie (con flequillo lateral)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_20_Corte_pixie_con_flequillo_lateral.jpg", 39, ["uni", "pe_u_c_cortos", 1, "pe_u_c_cortos"]],
    [1083, "Postura del peluquero · Corte bob largo (en capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_21_Corte_bob_largo_en_capas.jpg", 39, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1084, "Postura del peluquero · Corte bob largo (recto)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_22_Corte_bob_largo_recto.jpg", 39, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1085, "Postura del peluquero · Corte bob largo (en V)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_23_Corte_bob_largo_en_V.jpg", 39, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1086, "Postura del peluquero · Corte bob largo (en U)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_24_Corte_bob_largo_en_U.jpg", 39, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1087, "Postura del peluquero · Corte bob largo (redondo)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_25_Corte_bob_largo_redondo.jpg", 39, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1088, "Postura del peluquero · Corte shag largo (en capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_26_Corte_shag_largo_en_capas.jpg", 39, ["uni", "pe_u_c_media", 1, "pe_u_c_media"]],
    [1089, "Postura del peluquero · Corte shag largo (con flequillo)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_27_Corte_shag_largo_con_flequillo.jpg", 39, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [1090, "Postura del peluquero · Corte mariposa (largo en capas)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_28_Corte_mariposa_largo_en_capas.jpg", 39, ["uni", "pe_u_c_media", 1, "pe_u_c_media"]],
    [1091, "Postura del peluquero · Corte mariposa (con flequillo)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_29_Corte_mariposa_con_flequillo.jpg", 39, ["uni", "pe_u_c_flequillos", 1, "pe_u_c_flequillos"]],
    [1092, "Postura del peluquero · Corte long bob (en V)", "41", "41_Postura_del_Peluquero/01_Fotos_pequenas_por_corte/Postura_30_Corte_long_bob_en_V.jpg", 39, ["uni", "pe_u_c_melenas", 1, "pe_u_c_melenas"]],
    [1093, "Corte en posición frontal", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/01_Posiciones_del_peluquero/01_Corte_en_posicion_frontal.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1094, "Corte en posición lateral", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/01_Posiciones_del_peluquero/02_Corte_en_posicion_lateral.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1095, "Corte en posición posterior", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/01_Posiciones_del_peluquero/03_Corte_en_posicion_posterior.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1096, "Corte en posición superior", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/01_Posiciones_del_peluquero/04_Corte_en_posicion_superior.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1097, "Corte en posición inferior", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/01_Posiciones_del_peluquero/05_Corte_en_posicion_inferior.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1098, "Posición de perfil (visión lateral)", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/01_Posiciones_del_peluquero/18_Posicion_de_perfil_vision_lateral.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1099, "Corte con peine y tijera en mano derecha", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/02_Manos_y_herramientas/06_Corte_con_peine_y_tijera_en_mano_derecha.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1100, "Corte con peine y tijera en mano izquierda", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/02_Manos_y_herramientas/07_Corte_con_peine_y_tijera_en_mano_izquierda.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1101, "Corte con tijeras en posición invertida", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/02_Manos_y_herramientas/08_Corte_con_tijeras_en_posicion_invertida.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1102, "Corte con navaja (rasuradora)", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/02_Manos_y_herramientas/09_Corte_con_navaja_rasuradora.jpg", 39, 0],
    [1103, "Corte en sección horizontal", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/10_Corte_en_seccion_horizontal.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1104, "Corte en sección vertical", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/11_Corte_en_seccion_vertical.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1105, "Corte en ángulo (graduación)", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/12_Corte_en_angulo_graduacion.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1106, "Corte en capas (técnica de capas)", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/13_Corte_en_capas_tecnica_de_capas.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1107, "Corte en box (cuadrado)", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/14_Corte_en_box_cuadrado.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1108, "Corte en redondo", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/15_Corte_en_redondo.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1109, "Corte en U", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/16_Corte_en_U.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1110, "Corte en V", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/03_Secciones_y_formas_de_corte/17_Corte_en_V.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1111, "Error: mucha tensión", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/04_Errores_comunes/19_Error_mucha_tension.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]],
    [1112, "Errores de angulación y división", "41", "41_Postura_del_Peluquero/02_Posicion_y_tecnica_de_corte/04_Errores_comunes/20_Errores_de_angulacion_y_division.jpg", 39, ["uni", "pe_u_base", 1, "pe_u_base"]]
  ];

  function idDe(n) { return 'pe_gw_' + (n > 999 ? n : ('00' + n).slice(-3)); }   /* 30-10-2026: desde la 1000, cuatro cifras */
  /* cortes de su carpeta 10 → corte del sistema [id, exacto] */
  var CORTES = { 'Corte cuadrado': ['basico_cuadrado', 1], 'Corte en V': ['basico_v', 1], 'Corte en U': ['basico_u', 1], 'Corte redondo': ['basico_redondeado', 1],
    'Corte escalonado': ['basico_escalonado', 1], 'Corte hongo': ['bob_recto', 0], 'Corte picado': ['desfilado_punta', 0], 'Corte bob': ['bob_recto', 1],
    'Long bob (lob)': ['lob', 1], 'Corte mariposa': ['butterfly', 1], 'Corte capas largas': ['capas_largas', 1], 'Corte degradado': ['capas_90', 0],
    'Corte B larga': ['lob', 0], 'Corte semirredondo': ['basico_redondeado', 0], 'Corte recto': ['basico_cuadrado', 1], 'Corte asimétrico': ['bob_asimetrico', 1],
    'Corte desfilado': ['desfilado_punta', 1], 'Corte pixie': ['pixie', 1], 'Corte shag': ['shag', 1], 'Corte mullet': ['wolf', 0], 'Corte rizado': ['curly_bob', 0],
    'Corte largo recto': ['blunt', 0], 'Corte con flequillo': ['fleq_recto', 1] };
  /* técnica del Cerebro de cada imagen de color: [id de técnica, exacta] */
  function tecDe(g) {
    var t = g[1].toLowerCase(), c = g[2];
    if (c === '13' || /retoque|ra[ií]z|ra[ií]ces/.test(t) && !/sombr|difumin/.test(t)) return ['color_raiz', 1];
    if (/babylight/.test(t)) return ['color_babylights', 1];
    if (/ombr|sombr|difumin/.test(t)) return ['color_sombre', 1];
    if (/balayage|melt|sunkissed|illuminage/.test(t)) return ['color_balayage', 1];
    if (/mecha|foilyage|airtouch|contouring|money piece|reflejos/.test(t)) return ['mechas_aluminio', 1];
    if (/matiz/.test(t) || c === '19' || c === '16') return ['quim_decoloracion', /matiz|rubio|platino|perla/.test(t) ? 1 : 0];
    if (c === '17') return ['color_balayage', 0];
    if (/^(12|18)$/.test(c) || /color global|coloraci[oó]n global/.test(t)) return ['color_global', 1];
    return ['color_global', /^0[1-9]$/.test(c) ? 1 : 0];   /* retratos, paletas, cartas y texturas: teoría del color; fantasía, correcciones y avanzadas: a validar */
  }
  function destino(g) {
    if (g.length > 5) return g[5] ? { k: g[5][0], id: g[5][1], ok: g[5][2], unidad: g[5][3] } : null;
    if (g[2] === '10') { var k = CORTES[g[1]] || ['', 0], CO = window.EU_CORTES, c = k[0] && CO && CO.get ? CO.get(k[0]) : null; return c ? { k: 'corte', id: k[0], ok: k[1], unidad: 'pe_u_c_' + c.fam } : null; }
    var t = tecDe(g); return { k: 'tec', id: 'cb_' + t[0], ok: t[1], unidad: 'cb_' + t[0] };
  }
  function porId(id) { var n = +String(id).slice(6); for (var i = 0; i < G.length; i++) if (G[i][0] === n) return G[i]; return null; }
  function archivo(g) { return DIR + g[3]; }

  var DATA = {};
  G.forEach(function (g) {
    try {
      fetch(archivo(g)).then(function (x) { return x.ok ? x.blob() : null; }).then(function (b) {
        if (!b) return; var fr = new FileReader(); fr.onload = function () { DATA[idDe(g[0])] = fr.result; }; fr.readAsDataURL(b);
      }).catch(function () { });
    } catch (e) { }
  });
  function src(g) { return DATA[idDe(g[0])] || archivo(g); }

  /* ─────────── biblioteca de dibujos ─────────── */
  function modelo(g) {
    var id = idDe(g[0]);
    return {
      id: id, fam: 'gw' + g[2], n: g[1], gw: g[0],
      raster: function () { return src(g); },
      d: function (K) {
        var gid = 'peGwGris' + g[0], f = K.linea ? ' filter="url(#' + gid + ')"' : '';
        return (K.linea ? '<filter id="' + gid + '"><feColorMatrix type="saturate" values="0"/></filter>' : '') +
          '<rect x="1" y="1" width="198" height="148" rx="5" fill="#EEF0F3"/><image href="' + src(g) + '" x="3" y="3" width="194" height="144"' + f + ' preserveAspectRatio="xMidYMid meet"/>';
      },
      rot: [], intro: DESC[g[4]],
      q: [['¿Qué se ve en «' + g[1] + '»?', DESC[g[4]]], ['¿De qué grupo de la galería es?', CATS[g[2]] + '.'], ['¿Qué enseña la imagen y qué enseña el maniquí?', 'La imagen enseña el resultado; el maniquí y la ficha, cómo se llega a él.']],
      porque: DESC[g[4]]
    };
  }
  var REG = false;
  function registrar() {
    var MO = window.EU_MODELOS; if (!MO || !MO.agregar || REG) return !!REG;
    REG = true; var fam = {};
    Object.keys(CATS).forEach(function (c) { fam['gw' + c] = 'Galería web · ' + CATS[c]; });
    MO.agregar('pelu', G.map(modelo), { familias: fam });
    return true;
  }
  if (!registrar()) (function espera(k) { if (!registrar() && k < 100) setTimeout(function () { espera(k + 1); }, 300); })(0);
  /* 30-10-2026 (Fátima: «una imagen de referencia de lo que se está hablando en cada hoja; sustituye los dibujos genéricos»):
     cada imagen ligada con seguridad a una unidad ('uni', ok = 1) entra en los dibujos permitidos de esa unidad (`u.mods`, que respetan
     aperturas, «Observa», láminas y escáner); las de técnica o corte ya son la foto de su clase (b6_pelu_receta.js) y no se
     repiten; la que no se liga con seguridad se queda solo en la biblioteca */
  var CU = window.EU_CURRICULO, POR = null;
  if (CU && CU.unidades) {
    var uni0 = CU.unidades;
    CU.unidades = function (materia) {
      var o = uni0.apply(this, arguments);
      if (materia !== 'pelu' || !Array.isArray(o)) return o;
      if (!POR) { POR = {}; G.forEach(function (g) { var d = destino(g); if (d && d.ok && d.k === 'uni' && d.unidad) (POR[d.unidad] = POR[d.unidad] || []).push(idDe(g[0])); }); }
      o.forEach(function (u) { if (u && u.mods && POR[u.id] && !u._gw) { u.mods = u.mods.concat(POR[u.id].filter(function (x) { return u.mods.indexOf(x) < 0; })); u._gw = 1; } });
      return o;
    };
  }

  /* ─────────── maniquí y texto de cada hoja ─────────── */
  function escenaCorte(corte, k) {
    var LD = window.EU_PELU_LIBRO_DG; if (!LD || !LD.datos) return null;
    var dg = { k: 'corte', corte: corte }, d = null; try { d = LD.datos(dg); } catch (e) { d = null; }
    if (!d || !d.E) return null;
    var V = ['queda_lateral', 'queda_nuca', 'queda_frente', 'lateral', 'frente', 'capas', 'angulos', 'peinado_lado', 'peinado_atras'];
    var hay = V.filter(function (t) { return d.E.escenas.some(function (e) { return e.tipo === t; }); }); if (!hay.length) return null;
    var t = hay[k % hay.length], e = d.E.escenas.filter(function (x) { return x.tipo === t; })[0], f = '';
    try { f = LD.fotoEscena(dg, t); } catch (er) { f = ''; }
    return f ? { t: e.t, texto: e.texto, foto: f } : null;
  }
  var NO = /preparacion|cierre|aclarad|lavado/i;
  function escenaTec(tec, k) {
    var LA = window.EU_PELU_LIBRO_ANIM; if (!LA || !LA.datos) return null;
    var d = null; try { d = LA.datos(tec); } catch (e) { d = null; }
    if (!d || !d.E) return null;
    var cand = []; d.E.escenas.forEach(function (e, i) { if (!NO.test(e.tipo || '')) cand.push(i); }); if (!cand.length) return null;
    var i = cand[k % cand.length], e = d.E.escenas[i], f = '';
    try { f = LA.foto(tec, i, 640); } catch (er) { f = ''; }
    return f ? { t: e.t, texto: e.texto, foto: f, pasos: cand.map(function (j) { return d.E.escenas[j].t; }) } : null;
  }
  function nombreTec(id) { var PA = window.EU_PARTICIONES, n = ''; try { (PA.catalogo() || []).some(function (t) { if (t.id === id) { n = t.n; return true; } return false; }); } catch (e) { } return n; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  var ZN = ['Nuca', 'Nuca alta', 'Occipital', 'Parietal', 'Lateral', 'Coronilla', 'Flequillo'];
  function rev() { try { return localStorage.getItem('eu_revision') === 'si'; } catch (e) { return false; } }

  var ED = window.EU_EDITORIAL;
  if (ED && ED.registrar) {
    ED.registrar({
      paginas: {
        pe_galeria: function (pg, C) {
          var H = ED.H, T = C.T || {}, acc = T.acc || '#B08D57', soft = T.soft || '#EEF0F3', g = porId(pg.gw); if (!g) return '';
          var alto = ((C.papel && C.papel.h) || 297) >= 250, ds = destino(g) || {}, man = null, txt = '';
          /* 25-10-2026: la nota «a validar» solo en el modo revisión de Fátima (localStorage eu_revision = 'si'); el alumno no la ve */
          var aviso = ds.ok || !rev() ? '' : '<div style="margin:0 0 1.6mm;color:#A0522D;font-weight:700">Relación imagen–técnica propuesta por el sistema, a validar por Fátima.</div>';
          if (ds.k === 'corte') {
            var CO = window.EU_CORTES, c = CO.get(ds.id), TE = (CO.tecnica && CO.tecnica(ds.id)) || {}, ev = TE.elev || [];
            man = escenaCorte(ds.id, pg.vista || 0);
            txt = '<div><b>' + (ds.ok ? 'Corte del curso:' : 'Corte de base propuesto:') + '</b> «' + esc(c.n) + '». ' + esc(c.d || '') + '</div>' + aviso +
              (ev.length ? '<div style="margin:1.4mm 0"><b>Elevación por zonas:</b><div style="margin-top:1mm">' + ev.map(function (gr, z) { return '<span style="display:inline-block;margin:0 1mm 1mm 0;padding:.3mm 1.8mm;border-radius:99px;background:' + soft + ';white-space:nowrap"><b style="color:' + acc + '">' + ZN[z] + '</b> ' + gr + '°</span>'; }).join('') + '</div></div>' : '') +
              (TE.part ? '<div><b>Sección:</b> ' + esc(TE.part) + (TE.her ? ' · <b>Herramienta:</b> ' + esc(TE.her) : '') + (TE.acabado ? ' · <b>Acabado:</b> ' + esc(TE.acabado) : '') + '</div>' : '') +
              (TE.resultado ? '<div style="margin-top:1mm"><b>Resultado:</b> ' + esc(TE.resultado) + '</div>' : '') +
              ((TE.notas || []).length ? '<ol style="margin:1.6mm 0 0;padding-left:4.5mm">' + TE.notas.slice(0, alto ? 6 : 3).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol>' : '');
          } else if (ds.k === 'tec') {
            man = escenaTec(ds.id, pg.vista || 0);
            var nt = nombreTec(ds.id);
            txt = (nt ? '<div><b>' + (ds.ok ? 'Técnica del curso:' : 'Técnica relacionada:') + '</b> «' + esc(nt) + '».</div>' : '') + aviso +
              (man && man.pasos && man.pasos.length ? '<div style="margin-top:1.4mm"><b>Pasos de la técnica:</b><ol style="margin:1mm 0 0;padding-left:4.5mm">' + man.pasos.slice(0, alto ? 8 : 4).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ol></div>' : '');
          }
          var fig = '<figure style="margin:0 0 3mm;border-radius:2mm;overflow:hidden;background:' + soft + '"><img src="' + src(g) + '" alt="' + esc(g[1]) + '" style="display:block;width:100%;height:' + (alto ? 78 : 52) + 'mm;object-fit:contain"></figure>';
          var mani = man ? '<figure style="margin:0;background:' + soft + ';border-radius:2mm;padding:1.5mm"><img src="' + man.foto + '" alt="' + esc(man.t) + '" style="display:block;width:100%;height:auto;border-radius:1.5mm">' +
            '<figcaption style="font-size:.66em;line-height:1.3;margin-top:1.2mm"><b style="color:' + acc + '">Maniquí · ' + esc(man.t) + '</b><br>' + esc(rev() ? (man.texto || '') : String(man.texto || '').replace(/\s*\(a validar[^)]*\)/gi, '')) + '</figcaption></figure>' : '';
          var bloque = '<div style="font-size:.78em;line-height:1.42"><div style="margin:0 0 1.6mm">' + esc(DESC[g[4]]) + '</div>' + txt + '</div>';
          return H.cabecera(C, pg) +
            '<div style="font-size:.74em;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:' + acc + ';margin:0 0 1.5mm">' + esc(CATS[g[2]]) + ' · imagen y maniquí</div>' +
            H.h1(C, esc(g[1])) + fig +
            (mani ? '<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:4mm;align-items:start">' + mani + bloque + '</div>' : bloque) +
            '<p style="font-size:.7em;opacity:.75;margin:3mm 0 0">La imagen enseña el resultado; el maniquí y su explicación, cómo se llega a él.</p>' + H.folio(C, pg);
        }
      },
      voz: { pe_galeria: function (pg) { var g = porId(pg.gw); return g ? g[1] + '. ' + DESC[g[4]] : ''; } }
    });
  }
  function huecos(res, uid) {
    var c = [], lec = 0;
    res.pages.forEach(function (p, i) {
      if (!p.u || p.u.id !== uid) return;
      if (p.tipo === 'lec_amplia' && !p.ds) return c.push([-1, i]);
      if (p.relleno && (p.tipo === 'actividad' || p.tipo === 'ficha')) return c.push([1, i]);
      if (p.relleno && p.tipo === 'vis') return c.push([2, i]);
      if (/^lec_(amplia|concepto|lectura|caso|proyecto)$/.test(p.tipo) && ++lec > 1) c.push([3, i]);
    });
    return c.sort(function (a, b) { return a[0] - b[0] || (a[0] === 3 ? b[1] - a[1] : a[1] - b[1]); });
  }
  function repartir(res) {
    var C = res && res.C, cfg = C && C.cfg;
    /* 26-10-2026 (Fátima: «las imágenes de la biblioteca son para que se integre una por clase, no una galería de fotos
       ordinarias»): las hojas de galería del libro y las lecciones «Galería · …» del curso quedan APAGADAS por defecto; cada foto
       va dentro de su clase (b6_pelu_receta.js). Se vuelven a encender con cfg.acab.galeria = 'si' (o 'huecos'). */
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || !/^(si|huecos)$/.test(String((cfg.acab || {}).galeria || ''))) return res;
    var ya = {}, hay = {}, porU = {}, orden = [], quitadas = {}, n = 0, vistas = {};
    res.pages.forEach(function (p) { if (p.tipo === 'pe_galeria') ya[p.gw] = 1; if (p.u && !p.anexo) hay[p.u.id] = 1; });
    G.forEach(function (g) {
      var id = idDe(g[0]), ds = destino(g); if (!ds || ya[id] || !hay[ds.unidad]) return;
      if (!porU[ds.unidad]) { porU[ds.unidad] = []; orden.push(ds.unidad); }
      porU[ds.unidad].push(g);
    });
    function hoja(g, p) { var ds = destino(g), k = vistas[ds.id] = (vistas[ds.id] == null ? 0 : vistas[ds.id] + 1); return { tipo: 'pe_galeria', u: p.u, n: p.n, num: p.num, gw: idDe(g[0]), vista: k, fill2: { nada: 1 } }; }
    orden.forEach(function (uid) {
      var L = porU[uid], idx = huecos(res, uid).slice(0, L.length).map(function (h) { return h[1]; }).sort(function (a, b) { return a - b; });
      idx.forEach(function (i, j) { var p = res.pages[i]; res.pages[i] = hoja(L[j], p); quitadas[p.num] = 1; n++; });
      porU[uid] = L.slice(idx.length);
    });
    res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas = p.entradas.filter(function (e) { return !quitadas[e.p]; }); });
    var nuevas = [];
    if (((cfg.acab || {}).galeria) !== 'huecos') {
      orden.forEach(function (uid) {
        var L = porU[uid]; if (!L.length) return;
        var f = -1, ult = -1;
        res.pages.forEach(function (p, i) { if (f < 0 && p.u && p.u.id === uid && !p.anexo) f = i; });
        for (var i2 = f; f >= 0 && i2 < res.pages.length; i2++) { var q2 = res.pages[i2]; if (!q2.u || q2.u.id !== uid || q2.anexo) break; if (q2.tipo !== 'tutor' && q2.tipo !== 'repaso') ult = i2; }
        if (ult < 0) return;
        var hs = L.map(function (g) { var h = hoja(g, res.pages[ult]); delete h.num; return h; });
        res.pages.splice.apply(res.pages, [ult + 1, 0].concat(hs)); nuevas = nuevas.concat(hs); n += hs.length;
      });
      if (nuevas.length) {
        var nueva = {};
        res.pages.forEach(function (p, i) { if (p.num != null && nuevas.indexOf(p) < 0) nueva[p.num] = i + 1; });
        res.pages.forEach(function (p, i) { if (p.num != null || nuevas.indexOf(p) >= 0) p.num = i + 1; });
        res.pages.forEach(function (p) { if (p.tipo === 'solucion' && p.entradas) p.entradas.forEach(function (e) { if (nueva[e.p]) e.p = nueva[e.p]; }); });
      }
    }
    res.galeria = { hojas: n, nuevas: nuevas.length };
    return res;
  }
  /* después de las técnicas animadas, los diagramas y las referencias de cortes */
  function engancharLibro() {
    if (!ED || ED.__peluGal) return true;
    if (!window.EU_LIBS_LISTAS || !ED.__peluLibroAnim || !ED.__peluRef) return false;
    ED.__peluGal = 1;
    var ens = ED.ensamblar;
    ED.ensamblar = function (cfg) { var r = ens.apply(this, arguments); try { repartir(r); } catch (e) { console.warn('pelu galería (libro)', e); } return r; };
    return true;
  }
  (function espera(k) { if (!engancharLibro() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  /* ─────────── curso premium: «Galería · <módulo>» (10 imágenes por lección) ─────────── */
  function ponerCurso(D) {
    if (!D || !D.modulos || D._galPelu) return D;
    D.img = D.img || {};
    D.modulos.forEach(function (M) {
      var L = G.filter(function (g) { var ds = destino(g); return ds && ds.unidad === M.id && DATA[idDe(g[0])]; });
      if (!L.length || !M.lecciones || !M.lecciones.length) return;
      var lec = [];
      for (var i = 0; i < L.length; i += 10) {
        var parte = L.slice(i, i + 10), tot = Math.ceil(L.length / 10);
        lec.push({ id: M.id + '__galeria' + (i / 10 + 1), t: 'Galería · ' + String(M.t || '').replace(/^Cortes · /, '') + (tot > 1 ? ' ' + (i / 10 + 1) + '/' + tot : ''), pag: M.pag,
          escenas: parte.map(function (g) { var id = idDe(g[0]); D.img[id] = DATA[id]; return { tipo: 'idea', id: id, t: g[1], texto: g[1] + '. ' + DESC[g[4]], rot: [] }; }) });
      }
      var k = 1; while (k < M.lecciones.length && /__(video|bienvenida|referencias|clase\d+)$/.test(M.lecciones[k - 1].id)) k++;
      M.lecciones.splice.apply(M.lecciones, [Math.min(k, M.lecciones.length), 0].concat(lec));
    });
    D._galPelu = 1;
    return D;
  }
  function engancharCurso() {
    var CA = window.EU_CURSO_ANIM;
    if (!CA || !CA.enriquecer || !window.EU_PELU_REF) return false;
    if (CA.enriquecer._galPelu) return true;
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, cfg = res && res.C && res.C.cfg;
        return cfg && cfg.materia === 'pelu' && /^(si|huecos)$/.test(String((cfg.acab || {}).galeria || '')) ? ponerCurso(R) : R;   /* apagado por defecto (26-10-2026) */
      });
    };
    CA.enriquecer._galPelu = 1;
    return true;
  }
  (function espera(k) { if (!engancharCurso() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  window.EU_PELU_GALERIA = { G: G, CATS: CATS, id: idDe, destino: destino, repartir: repartir, ponerCurso: ponerCurso, listas: function () { return Object.keys(DATA); },
    /* 25-10-2026: la imagen tal cual (data URL o ruta) y su título, para las lecciones «receta» (b6_pelu_receta.js) */
    dato: function (id) { return DATA[id] || null; }, titulo: function (n) { var g = porId(idDe(n)); return g ? g[1] : ''; } };
})();
