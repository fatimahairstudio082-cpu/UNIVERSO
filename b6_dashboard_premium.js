/* b6_dashboard_premium.js — dashboard «Medianoche y oro» al abrir el curso premium y el libro interactivo de Peluquería
   (`window.EU_DASHBOARD`, Fátima, 17-10-2026: «que se vea profesional, responsive, animado, como el diseño aprobado»).
   · Curso (curso/index.html y vista previa): pantalla de inicio por encima del reproductor con su foto, título, avance
     (lecciones vistas, la misma cuenta del certificado), cifras reales del curso (módulos, lecciones, vídeos, preguntas),
     tarjetas de módulos en su orden (foto solo si el módulo ya lleva la suya de b6_pelu_fotos.js: nunca una foto de otro
     tema) y «Continuar donde lo dejé». Al tocar un módulo se cierra y abre su primera lección con el temario de siempre.
     Botón «⌂ Inicio» para volver. No cambia el reproductor ni la clave de progreso (lee la misma, D.clave).
   · Libro interactivo (solo modo web): portada-dashboard antes de la primera hoja con cifras del libro (hojas, unidades,
     páginas animadas) y una tarjeta por unidad que lleva a su hoja de apertura; «Continuar en la página N» (localStorage
     `eu_libro_<título>`, clave nueva). No es una hoja (.pg): el impreso, el PDF y el EPUB no cambian; al imprimir se oculta.
   · Solo materia `pelu`. `cfg.acab.dashboard = 'no'` lo apaga. Animaciones suaves; con «reducir movimiento» no se animan.
   Cargar el último de la lista diferida (después de b6_curso_premium.js, b6_pelu_premium.js y b6_pelu_fotos.js). */
(function () {
  'use strict';
  if (window.EU_DASHBOARD) return;
  var ORO = '#B08D57', AZUL = '#16223A';
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function activo(cfg) { return !!(cfg && cfg.materia === 'pelu' && !(cfg.acab && cfg.acab.dashboard === 'no')); }

  /* ─── CSS común (inyectado una vez en cada documento) ─── */
  var CSS = '#euDash{--az:' + AZUL + ';--oro:' + ORO + ';font-family:Mulish,"Segoe UI",system-ui,sans-serif;color:var(--az);background:#F4F6FA;box-sizing:border-box}' +
    '#euDash *{box-sizing:border-box}' +
    '@keyframes euSub{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}' +
    '@keyframes euBri{0%{background-position:-200% 0}100%{background-position:200% 0}}' +
    '@keyframes euPul{0%,100%{box-shadow:0 0 0 0 rgba(176,141,87,.55)}50%{box-shadow:0 0 0 10px rgba(176,141,87,0)}}' +
    '@keyframes euFlo{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}' +
    '@keyframes euAni{from{stroke-dashoffset:302}}' +
    '#euDash .an{animation:euSub .6s ease both}' +
    '#euDash .top{background:var(--az);color:#fff;display:flex;align-items:center;gap:14px;padding:14px clamp(16px,4vw,48px)}' +
    '#euDash .top img{width:40px;height:40px;border-radius:50%;object-fit:cover;object-position:30% 20%;border:2px solid var(--oro)}' +
    '#euDash .top b{font-family:"Cormorant Garamond",Georgia,serif;font-size:21px;font-weight:600}#euDash .top small{display:block;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#D9C29A}' +
    '#euDash .hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(20px,4vw,44px);padding:clamp(22px,4vw,48px) clamp(16px,4vw,56px) 28px;align-items:center}' +
    '#euDash .kick{display:flex;gap:8px;flex-wrap:wrap}#euDash .kick span{background:var(--az);color:#D9C29A;border-radius:999px;padding:6px 14px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}' +
    '#euDash .kick span+span{background:#F3EADB;color:#8A6A3A}' +
    '#euDash h1{margin:14px 0;font-family:"Cormorant Garamond",Georgia,serif;font-size:clamp(34px,5.4vw,60px);line-height:1.02;font-weight:700;background:linear-gradient(90deg,var(--az) 0%,var(--az) 40%,var(--oro) 50%,var(--az) 60%,var(--az) 100%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:euBri 6s linear infinite}' +
    '#euDash .lead{margin:0 0 18px;font-size:clamp(15px,1.6vw,18px);line-height:1.55;color:#3A4660;max-width:60ch}' +
    '#euDash .bts{display:flex;gap:12px;flex-wrap:wrap}#euDash .bt{font:inherit;min-height:50px;padding:0 24px;border-radius:25px;cursor:pointer;font-weight:800;font-size:15px;border:1px solid #C9D2E3;background:#fff;color:var(--az)}' +
    '#euDash .bt.oro{border:0;background:var(--oro);color:var(--az);animation:euPul 2.4s ease-in-out infinite}' +
    '#euDash .foto{position:relative;min-height:300px}#euDash .foto>img{width:100%;height:clamp(240px,30vw,360px);object-fit:cover;border-radius:22px;box-shadow:0 30px 60px rgba(22,34,58,.22);border:2px solid rgba(176,141,87,.6);display:block}' +
    '#euDash .av{position:absolute;left:-14px;bottom:-18px;background:#fff;border-radius:16px;padding:14px 16px;display:flex;gap:12px;align-items:center;box-shadow:0 18px 40px rgba(22,34,58,.18);animation:euFlo 5s ease-in-out infinite}' +
    '#euDash .av small{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:#6A7385}#euDash .av b{font-size:14px}' +
    '#euDash .cifras{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;padding:8px clamp(16px,4vw,56px) 28px}' +
    '#euDash .cifra{background:#fff;border-radius:18px;padding:20px 22px;display:flex;flex-direction:column;gap:6px;box-shadow:0 8px 24px rgba(22,34,58,.06)}' +
    '#euDash .cifra b{font-family:"Cormorant Garamond",Georgia,serif;font-size:40px;line-height:1}#euDash .cifra span{font-size:13px;font-weight:700;color:#6A7385}' +
    '#euDash h2{margin:0 0 4px;font-family:"Cormorant Garamond",Georgia,serif;font-size:32px}#euDash .lista{padding:0 clamp(16px,4vw,56px) 28px}' +
    '#euDash .lista>p{margin:0 0 16px;font-size:14px;color:#6A7385}' +
    '#euDash .tarjetas{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}' +
    '#euDash .tj{font:inherit;text-align:left;padding:0;border-radius:18px;overflow:hidden;background:#fff;cursor:pointer;color:var(--az);border:2px solid transparent;box-shadow:0 8px 22px rgba(22,34,58,.07);transition:transform .25s,box-shadow .25s}' +
    '#euDash .tj:hover,#euDash .tj:focus-visible{transform:translateY(-4px);box-shadow:0 16px 34px rgba(22,34,58,.14)}#euDash .tj.sig{border-color:var(--oro);box-shadow:0 16px 36px rgba(176,141,87,.25)}' +
    '#euDash .cab{height:118px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#16223A,#2C3A57);overflow:hidden}' +
    '#euDash .cab img{width:100%;height:118px;object-fit:cover;display:block}#euDash .cab i{font-style:normal;font-family:"Cormorant Garamond",Georgia,serif;font-size:54px;font-weight:700;color:var(--oro)}' +
    '#euDash .tj div{padding:12px 14px 14px;display:flex;flex-direction:column;gap:5px}#euDash .tj small{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;color:var(--oro)}' +
    '#euDash .tj b{font-size:15px}#euDash .tj em{font-style:normal;font-size:12px;font-weight:800;color:#8A93A6}#euDash .tj em.ok{color:#2F7A55}#euDash .tj em.va{color:#8A6A3A}' +
    '#euDash .pie{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:14px;padding:0 clamp(16px,4vw,56px) 40px}' +
    '#euDash .casa{background:var(--az);color:#fff;border-radius:20px;overflow:hidden;display:flex}#euDash .casa img{width:200px;object-fit:cover;object-position:30% 20%;flex:none}' +
    '#euDash .casa div,#euDash .cert{padding:24px 26px;display:flex;flex-direction:column;gap:9px}#euDash .casa small{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#D9C29A;font-weight:800}' +
    '#euDash .casa b,#euDash .cert b{font-family:"Cormorant Garamond",Georgia,serif;font-size:26px;font-weight:600;line-height:1.15}#euDash .casa span{font-size:15px;line-height:1.5;color:#C9D2E3}' +
    '#euDash .cert{background:#fff;border-radius:20px;border:1px solid #E3D3B6}#euDash .cert span{font-size:15px;line-height:1.5;color:#3A4660}' +
    '@media(max-width:820px){#euDash .hero,#euDash .pie{grid-template-columns:minmax(0,1fr)}#euDash .cifras{grid-template-columns:repeat(2,minmax(0,1fr))}#euDash .av{left:10px}#euDash .casa{flex-direction:column}#euDash .casa img{width:100%;height:200px}#euDash .foto{min-height:0}#euDash .av{position:relative;left:auto;bottom:auto;margin-top:12px;width:max-content}}' +
    '@media(prefers-reduced-motion:reduce){#euDash *{animation:none!important;transition:none!important}}' +
    '@media print{#euDash,#euIni{display:none!important}}';

  function anillo(pct) {
    var off = (302 - 302 * pct / 100).toFixed(1);
    return '<svg width="62" height="62" viewBox="0 0 110 110" aria-hidden="true"><circle cx="55" cy="55" r="48" fill="none" stroke="#EEF1F6" stroke-width="10"/>' +
      '<circle cx="55" cy="55" r="48" fill="none" stroke="' + ORO + '" stroke-width="10" stroke-linecap="round" stroke-dasharray="302" stroke-dashoffset="' + off + '" transform="rotate(-90 55 55)" style="animation:euAni 1.4s ease both"/>' +
      '<text x="55" y="63" text-anchor="middle" font-size="25" font-weight="800" fill="' + AZUL + '">' + pct + '%</text></svg>';
  }
  function cifras(L) {
    return '<section class="cifras">' + L.map(function (c, i) { return '<div class="cifra an" style="animation-delay:' + (0.15 + i * 0.07).toFixed(2) + 's"><b>' + esc(c[0]) + '</b><span>' + esc(c[1]) + '</span></div>'; }).join('') + '</section>';
  }
  function tarjeta(t, i, sig) {
    return '<button type="button" class="tj an' + (sig ? ' sig' : '') + '" data-ir="' + i + '" style="animation-delay:' + (0.25 + i * 0.04).toFixed(2) + 's">' +
      '<span class="cab">' + (t.foto ? '<img src="' + t.foto + '" alt="' + esc(t.t) + '">' : '<i>' + (i < 9 ? '0' : '') + (i + 1) + '</i>') + '</span>' +
      '<div><small>' + esc(t.k) + ' ' + (i + 1) + '</small><b>' + esc(t.t) + '</b><em class="' + (t.ok ? 'ok' : sig ? 'va' : '') + '">' + esc(t.est) + '</em></div></button>';
  }
  /* palabras de Fátima (las mismas de su Bienvenida, b6_pelu_premium.js) */
  var LEAD = 'Es la forma más fácil e interactiva de aprender: viendo el maniquí y la animación aprendes a dividir, cómo cortar y cómo practicar en tu casa.';
  function pie(foto, curso) {
    return '<section class="pie"><div class="casa an" style="animation-delay:.45s">' + (foto ? '<img src="' + foto + '" alt="Fátima">' : '') +
      '<div><small>Practica en casa</small><b>Mi recomendación: ten un maniquí y empieza a practicar con él.</b>' +
      '<span>Córtale el cabello y saca las líneas, lección por lección. Ves el vídeo, ves la animación, practicas y aplicas.</span></div></div>' +
      (curso ? '<div class="cert an" style="animation-delay:.55s"><b>Tu certificado</b><span>Todas las lecciones vistas hasta el final y el examen aprobado con un 70 % o más.</span></div>' : '<div class="cert an" style="animation-delay:.55s"><b>Tu libro, tu ritmo</b><span>Cada técnica con su animación y su voz: toca «▶ Ver y escuchar» en las hojas que lo llevan.</span></div>') +
      '</section>';
  }

  /* ─── 1 · CURSO: el dashboard viaja en curso/index.html (lee window.CURSO y la misma clave de progreso) ─── */
  function DASH_CURSO() {
    var D = window.CURSO; if (!D || !D.dash) return;
    var X = D.dash, $ = function (s) { return document.querySelector(s); };
    var st = document.createElement('style'); st.textContent = X.css; document.head.appendChild(st);
    function ST() { try { return JSON.parse(localStorage.getItem(D.clave) || '{}'); } catch (e) { return {}; } }
    function fotoMod(M) {
      var L = M.lecciones[0]; if (!L) return '';
      for (var k = 0; k < L.escenas.length; k++) { var id = L.escenas[k].id; if (id && /^foto_/.test(id) && id !== 'foto_portada_curso' && D.img[id]) return D.img[id]; }
      return '';
    }
    function pinta() {
      var S = ST(), V = S.vistas || {}, tot = 0, vis = 0, vid = 0, preg = (D.examen || []).length, sig = null;
      D.modulos.forEach(function (M, i) {
        preg += (M.test || []).length;
        M.lecciones.forEach(function (L, j) { tot++; if (L.video) vid++; if (V[L.id]) vis++; else if (!sig) sig = [i, j]; });
      });
      var pct = tot ? Math.round(vis / tot * 100) : 0, foto = D.img.foto_portada_curso || D.img.presentacion || '';
      var ret = D.img.presentacion || '';
      var tj = D.modulos.map(function (M, i) {
        var h = M.lecciones.filter(function (L) { return V[L.id]; }).length, ok = h === M.lecciones.length && h > 0;
        return X.tarjeta({ t: M.t, k: 'Módulo', foto: fotoMod(M), ok: ok, est: ok ? '✓ Visto' : sig && sig[0] === i ? '▶ Sigue aquí' : h + ' de ' + M.lecciones.length + ' lecciones' }, i, sig && sig[0] === i);
      }).join('');
      var d = $('#euDash'); if (!d) { d = document.createElement('div'); d.id = 'euDash'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Inicio del curso'); d.style.cssText = 'position:fixed;inset:0;z-index:40;overflow-y:auto'; document.body.appendChild(d); }
      d.innerHTML = '<header class="top">' + (ret ? '<img src="' + ret + '" alt="">' : '') + '<div><b>' + X.e(D.autor || X.autor || '') + '</b><small>Curso premium</small></div></header>' +
        '<section class="hero"><div class="an"><div class="kick"><span>' + X.e(D.sub || 'Peluquería') + '</span></div><h1>' + X.e(D.titulo) + '</h1>' +
        '<p class="lead">' + X.e(X.lead) + '</p><div class="bts"><button type="button" class="bt oro" data-sigue="1">▶ ' + (vis ? 'Continuar donde lo dejé' : 'Empezar el curso') + '</button>' +
        (D.modulos[0] && D.modulos[0].lecciones[0] && /__bienvenida$/.test(D.modulos[0].lecciones[0].id) ? '<button type="button" class="bt" data-ir="0">Ver presentación</button>' : '') + '</div></div>' +
        '<div class="foto an" style="animation-delay:.15s">' + (foto ? '<img src="' + foto + '" alt="Portada del curso">' : '') +
        '<div class="av">' + X.anillo(pct) + '<div><small>Tu avance</small><b>' + vis + ' de ' + tot + ' lecciones</b></div></div></div></section>' +
        X.cifras([[D.modulos.length, 'Módulos'], [tot, 'Lecciones'], [vid, 'Lecciones en vídeo'], [preg, 'Preguntas de test y examen']]) +
        '<section class="lista"><h2>Módulos del curso</h2><p>En su orden · toca uno para empezarlo</p><div class="tarjetas">' + tj + '</div></section>' +
        X.pie(ret, true);
      d.style.display = '';
      d._sig = sig;
    }
    function abrir(mi, li) {
      $('#euDash').style.display = 'none';
      var det = document.querySelectorAll('#menu details')[mi]; if (!det) return;
      var b = det.querySelectorAll('.lec')[li || 0]; if (b) b.click();
    }
    document.addEventListener('click', function (ev) {
      var t = ev.target.closest('#euDash [data-ir],#euDash [data-sigue],#euIni'); if (!t) return;
      if (t.id === 'euIni') return pinta();
      if (t.dataset.sigue) { var s = $('#euDash')._sig || [0, 0]; return abrir(s[0], s[1]); }
      abrir(+t.dataset.ir, 0);
    });
    var ini = document.createElement('button'); ini.id = 'euIni'; ini.type = 'button'; ini.textContent = '⌂ Inicio';
    ini.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:30;font:700 14px Mulish,system-ui,sans-serif;padding:10px 16px;border:0;border-radius:22px;background:' + X.oro + ';color:' + X.az + ';cursor:pointer;box-shadow:0 8px 20px rgba(22,34,58,.25)';
    document.body.appendChild(ini);
    if (!/grabar/.test(location.hash)) pinta();
  }

  var CP = window.EU_CURSO_PREMIUM, CA = window.EU_CURSO_ANIM, ED = window.EU_EDITORIAL;
  /* marca el curso de Peluquería al enriquecerlo (pasa por aquí el ZIP y la vista previa) */
  if (CA && CA.enriquecer && !CA.enriquecer._dash) {
    var enr = CA.enriquecer;
    CA.enriquecer = function (D, res) {
      return Promise.resolve(enr.apply(this, arguments)).then(function (D2) {
        var R = D2 || D, cfg = res && res.C && res.C.cfg;
        if (R && activo(cfg)) R.dash = { css: CSS, lead: LEAD, oro: ORO, az: AZUL, autor: (res.C && res.C.autor) || cfg.autor || '' };
        return R;
      });
    };
    CA.enriquecer._dash = 1;
  }
  if (CP && CP.cursoHTML && !CP.cursoHTML._dash) {
    var ch = CP.cursoHTML;
    CP.cursoHTML = function (D) {
      var h = ch.apply(this, arguments);
      if (!D || !D.dash) return h;
      var fuentes = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Mulish:wght@400;700;800&display=swap" rel="stylesheet">';
      var ayudas = 'var X=window.CURSO&&window.CURSO.dash;if(X){X.e=' + esc.toString() + ';X.anillo=' + anillo.toString().replace(/ORO/g, JSON.stringify(ORO)).replace(/AZUL/g, JSON.stringify(AZUL)) +
        ';X.cifras=function(L){var esc=X.e;return(' + cifras.toString() + ')(L)};X.tarjeta=function(t,i,s){var esc=X.e;return(' + tarjeta.toString() + ')(t,i,s)};X.pie=function(f,c){return(' + pie.toString() + ')(f,c)};}';
      return h.replace('</head>', fuentes + '</head>').replace(/<\/body><\/html>$/, '<script>' + ayudas + '(' + DASH_CURSO.toString() + ')();<\/script></body></html>');
    };
    CP.cursoHTML._dash = 1;
  }

  /* ─── 2 · LIBRO interactivo (web): portada-dashboard antes de la primera hoja ─── */
  var FOTO = {};
  ['portada_curso', 'presentacion'].forEach(function (n, i) {
    try {
      fetch(i ? './referencias/presentacion.jpg' : './referencias/curso/portada_curso.jpg').then(function (r) { return r.ok ? r.blob() : null; }).then(function (b) {
        if (!b) return; var fr = new FileReader(); fr.onload = function () { FOTO[n] = fr.result; }; fr.readAsDataURL(b);
      }).catch(function () { });
    } catch (e) { }
  });
  function dashLibro(res) {
    var C = res.C, cfg = C.cfg || {}, P = res.pages || [];
    var uds = P.filter(function (p) { return p.tipo === 'apertura' && p.u && !p.mini; });
    var anim = P.filter(function (p) { return /^pe_(animada|diagrama|guia3d|tecnica)$/.test(p.tipo); }).length;
    var tj = uds.map(function (p, i) { return tarjeta({ t: p.u.t, k: 'Unidad', foto: '', ok: false, est: 'Página ' + p.num }, i, false).replace('data-ir="' + i + '"', 'data-pag="' + p.num + '"'); }).join('');
    var clave = 'eu_libro_' + String(C.titulo || 'libro').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
    var ret = FOTO.presentacion || '', portada = FOTO.portada_curso || '';
    var html = '<style>' + CSS + '</style><div id="euDash">' +
      '<header class="top">' + (ret ? '<img src="' + ret + '" alt="">' : '') + '<div><b>' + esc(C.autor || cfg.autor || '') + '</b><small>Libro interactivo</small></div></header>' +
      '<section class="hero"><div class="an"><div class="kick"><span>' + esc(C.sub || C.curso || 'Peluquería') + '</span></div><h1>' + esc(C.titulo) + '</h1>' +
      '<p class="lead">' + esc(LEAD) + '</p><div class="bts"><button type="button" class="bt oro" data-libro-sigue="1" data-clave="' + clave + '">▶ Empezar a leer</button></div></div>' +
      '<div class="foto an" style="animation-delay:.15s">' + (portada ? '<img src="' + portada + '" alt="Portada">' : '') + '</div></section>' +
      cifras([[P.length, 'Hojas'], [uds.length, 'Unidades'], [anim, 'Páginas con animación y voz'], [uds.length ? Math.max(1, Math.round(P.length / uds.length)) : 0, 'Hojas por unidad (media)']]) +
      '<section class="lista"><h2>Unidades del libro</h2><p>En su orden · toca una para ir a su página</p><div class="tarjetas">' + tj + '</div></section>' + pie(ret, false) + '</div>' +
      '<script>(function(){var K=' + JSON.stringify(clave) + ';function ir(n){var p=document.querySelector(\'.pg[data-n="\'+n+\'"]\');if(p)p.scrollIntoView({behavior:"smooth"})}' +
      'try{var u=+localStorage.getItem(K);if(u>1){var b=document.querySelector("[data-libro-sigue]");if(b)b.textContent="▶ Continuar en la página "+u}}catch(e){}' +
      'document.addEventListener("click",function(e){var t=e.target.closest("#euDash [data-pag],#euDash [data-libro-sigue]");if(!t)return;if(t.dataset.pag)return ir(t.dataset.pag);var u=1;try{u=+localStorage.getItem(K)||1}catch(e){}ir(u)});' +
      'if(window.IntersectionObserver){var o=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting)try{localStorage.setItem(K,x.target.dataset.n)}catch(e){}})},{threshold:.6});document.querySelectorAll(".pg").forEach(function(p){o.observe(p)})}' +
      '})();<\/script>';
    return html;
  }
  if (ED && ED.documento && !ED.documento._dash) {
    var doc = ED.documento;
    ED.documento = function (res, modo) {
      var h = doc.apply(this, arguments);
      try {
        if (modo !== 'web' || !res || !res.C || !activo(res.C.cfg) || typeof h !== 'string') return h;
        var i = h.indexOf('<body'); if (i < 0) return h; var j = h.indexOf('>', i) + 1;
        return h.slice(0, j) + dashLibro(res) + h.slice(j);
      } catch (e) { return h; }
    };
    ED.documento._dash = 1;
  }

  window.EU_DASHBOARD = { CSS: CSS, LEAD: LEAD, ORO: ORO, AZUL: AZUL, dashLibro: dashLibro };
})();
