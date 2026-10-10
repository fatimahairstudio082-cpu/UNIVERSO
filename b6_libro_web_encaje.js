/* b6_libro_web_encaje.js — libro / ebook interactivo (web): ninguna página corta su contenido (Fátima, 10-10-2026).
   En la versión web las actividades llevan casillas para escribir, botones de «Comprobar», «▶ Ver y escuchar»,
   pizarra, etc., que ocupan más que las líneas del impreso; en el 3-15 % de las páginas (sobre todo «Comprueba»,
   «Practica más», «Observa» y técnicas animadas) lo último quedaba tapado por el borde de la hoja o pisaba el folio.
   Ahora, en pantalla, la hoja que no cabe se alarga lo justo (nunca es más baja que el papel) y todo se ve: dibujos,
   explicación y actividad. Se vuelve a medir cuando algo se abre dentro (resolución animada, esquema, pizarra).
   El impreso, el PDF y el EPUB no cambian (solo actúa con @media screen en el HTML web). No toca el motor:
   envuelve EU_EDITORIAL.documento. `cfg.acab.encajeWeb = 'no'` lo apaga. */
(function () {
  'use strict';
  var ED = window.EU_EDITORIAL; if (!ED || window.EU_LIBRO_WEB_ENCAJE) return;
  var CSS = '<style>@media screen{.pg[data-crece]{height:auto!important;overflow:visible!important}}</style>';
  var JS = '<script>(function(){function mide(){[].forEach.call(document.querySelectorAll(".pg"),function(p){' +
    'if(!p.dataset.h)p.dataset.h=p.style.height||"";' +
    'var crece=p.hasAttribute("data-crece");if(crece){p.style.minHeight=p.dataset.h;return}' +
    'if(p.scrollHeight>p.clientHeight+3){p.setAttribute("data-crece","1");p.style.minHeight=p.dataset.h}})}' +
    'var t=0;function luego(){clearTimeout(t);t=setTimeout(mide,250)}' +
    'addEventListener("load",function(){mide();setTimeout(mide,800);setTimeout(mide,2500)});' +
    'if(document.fonts&&document.fonts.ready)document.fonts.ready.then(luego);' +
    'try{new MutationObserver(luego).observe(document.body,{childList:true,subtree:true})}catch(e){}' +
    'document.addEventListener("click",luego,true);addEventListener("resize",luego)})();<\/script>';
  var doc = ED.documento;
  ED.documento = function (res, modo) {
    var h = doc.apply(this, arguments);
    try {
      if (modo === 'web' && res && res.C && ((res.C.cfg && res.C.cfg.acab) || {}).encajeWeb !== 'no') {
        var k = h.lastIndexOf('</body>');
        if (k > 0) h = h.slice(0, k) + CSS + JS + h.slice(k);
      }
    } catch (e) { console.warn('Encaje web', e); }
    return h;
  };
  window.EU_LIBRO_WEB_ENCAJE = { css: CSS };
})();
