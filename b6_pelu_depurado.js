/* b6_pelu_depurado.js — 22-10-2026 (Fátima): clases de colorimetría que no son de su curso.
   El curso es de peluquería y colorimetría (principiante, intermedio, avanzado). Quita de EU_COLOR_CEREBRO.clases:
   · «Alertas Peluquero» (alp_*): ética, burnout, precios, redes, marca personal, academia digital…
   · «Alertas Cliente» (alc_*) salvo «Alergias Conocidas — Ficha Obligatoria» (alc_p03).
   · Cinco de negocio dentro de color: fotografía y precio de correcciones, matización rentable y para redes, workshop.
   Se quedan las de Bioseguridad (prueba de mechón, embarazo, alergias químicas). No se borra nada de los archivos:
   para volver a mostrar una clase, quitar su id de aquí.
   Cargar después de b6_color_cerebro_1/2/3.js y antes de b6_color_cerebro_motor.js. */
(function () {
  'use strict';
  var B = window.EU_COLOR_CEREBRO; if (!B || !B.clases || window.EU_PELU_DEPURADO) return;
  var QUEDAN = { alc_p03: 1 };
  var NEGOCIO = { cco_i05: 1, cco_a03: 1, mat_a02: 1, mat_a03: 1, mez_a03: 1 };
  /* 22-10-2026 (Fátima): clases antiguas que sustituye una clase suya nueva de b6_color_fatima.js (decían otra cosa:
     «20 vol aclara 1 tono», «40 vol solo en mechas con aluminio»). Solo se ocultan si la nueva está cargada. */
  var CF = window.EU_COLOR_FATIMA, REEMPLAZADAS = CF ? { tin_p04: 'fat_p01' } : {};
  function fuera(c) { var id = String(c && c.id || ''); return !QUEDAN[id] && (/^(alp|alc)_/.test(id) || NEGOCIO[id] === 1 || !!REEMPLAZADAS[id]); }
  var quitadas = [];
  for (var i = B.clases.length - 1; i >= 0; i--) if (fuera(B.clases[i])) quitadas.unshift(B.clases.splice(i, 1)[0].id);
  window.EU_PELU_DEPURADO = { quitadas: quitadas };
})();
