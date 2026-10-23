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
  var CATS = {"01": "Retratos negro y oscuro", "02": "Retratos castaño y caramelo", "03": "Retratos rubios", "04": "Retratos cobrizos", "05": "Retratos vino y borgoña", "06": "Retratos de fantasía", "07": "Ruedas y paletas de color", "08": "Cartas de mechones", "09": "Texturas de color", "10": "Fichas de corte de dama", "11": "Fichas de colorimetría", "12": "Coloración global y reflejos", "13": "Retoque de raíz", "14": "Mechas y babylights", "15": "Balayage, ombré y sombré", "16": "Rubios", "17": "Morenas iluminadas", "18": "Cobrizos, rojos y caobas", "19": "Fríos, cenizas y matización", "20": "Fantasía y tonos vivos", "21": "Correcciones y transformaciones", "22": "Técnicas avanzadas"};
  var DESC = ["Carta de mechones para comparar alturas de tono y reflejos sobre cabello real.", "Compara la altura del rubio, su temperatura y el brillo general del resultado.", "Compara la intensidad del reflejo cobrizo o rojizo y su uniformidad.", "Estudia la finura de los mechones, el contraste y la ubicación de la luz.", "Ficha de corte con sus vistas de referencia para comparar forma, largo, capas y contorno.", "Ficha de técnica de color con sus vistas de referencia para comparar distribución y acabado.", "Fíjate en la profundidad de raíz, la transición hacia medios y la continuidad del tono.", "Observa cómo se integra la luz en base oscura y el reflejo dominante.", "Observa el punto de partida, el matiz a corregir y el resultado final.", "Observa la distribución del color, la profundidad de raíz y el acabado general.", "Observa la transición gradual y la relación entre raíz, medios y puntas.", "Referencia de matiz y temperatura; compara la neutralidad del acabado.", "Referencia de técnicas combinadas: distribución, contraste y acabado final.", "Retrato cobrizo para observar la intensidad del cobre, el brillo y el movimiento.", "Retrato de cabello negro u oscuro para observar brillo, reflejos y profundidad del tono.", "Retrato de color fantasía para valorar saturación, uniformidad y acabado.", "Retrato en tonos castaño y caramelo para comparar transiciones, luz y reflejos.", "Retrato en tonos vino y borgoña para comparar profundidad y reflejo rojizo.", "Retrato rubio para estudiar la altura de tono, la temperatura y la luminosidad.", "Rueda cromática o paleta de referencia para elegir tonos, contrastes y combinaciones.", "Textura de color a escala de cabello para observar degradados, brillo y fusión de matices.", "Valora la saturación, la uniformidad y la limpieza del color fantasía."];
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
    [253, "Tratamiento con color", "22", "22_Colorimetria_Tecnicas_Avanzadas/Tratamiento_con_color_D097.jpg", 12]
  ];

  function idDe(n) { return 'pe_gw_' + ('00' + n).slice(-3); }
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

  var ED = window.EU_EDITORIAL;
  if (ED && ED.registrar) {
    ED.registrar({
      paginas: {
        pe_galeria: function (pg, C) {
          var H = ED.H, T = C.T || {}, acc = T.acc || '#B08D57', soft = T.soft || '#EEF0F3', g = porId(pg.gw); if (!g) return '';
          var alto = ((C.papel && C.papel.h) || 297) >= 250, ds = destino(g) || {}, man = null, txt = '';
          var aviso = ds.ok ? '' : '<div style="margin:0 0 1.6mm;color:#A0522D;font-weight:700">Relación imagen–técnica propuesta por el sistema, a validar por Fátima.</div>';
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
            '<figcaption style="font-size:.66em;line-height:1.3;margin-top:1.2mm"><b style="color:' + acc + '">Maniquí · ' + esc(man.t) + '</b><br>' + esc(man.texto || '') + '</figcaption></figure>' : '';
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
    if (!res || !res.pages || !cfg || cfg.materia !== 'pelu' || ((cfg.acab || {}).galeria) === 'no') return res;
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
      var k = 1; while (k < M.lecciones.length && /__(video|bienvenida|referencias)$/.test(M.lecciones[k - 1].id)) k++;
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
        return cfg && cfg.materia === 'pelu' && ((cfg.acab || {}).galeria) !== 'no' ? ponerCurso(R) : R;
      });
    };
    CA.enriquecer._galPelu = 1;
    return true;
  }
  (function espera(k) { if (!engancharCurso() && k < 2000) setTimeout(function () { espera(k + 1); }, 300); })(0);

  window.EU_PELU_GALERIA = { G: G, CATS: CATS, id: idDe, destino: destino, repartir: repartir, ponerCurso: ponerCurso, listas: function () { return Object.keys(DATA); } };
})();
