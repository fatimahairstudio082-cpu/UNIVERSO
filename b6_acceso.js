/* b6_acceso.js — login de Universo con el Firebase de Fátima (proyecto aprendisajefatima), 10-10-2026.
   Fátima eligió la opción B: solo login en la página. Al abrir el Estudio aparece una pantalla de acceso
   (correo + contraseña, «¿Olvidaste la contraseña?») y solo deja pasar a los correos de PERMITIDOS.
   Usa Firebase Auth (la sesión la guarda el propio Firebase); no toca Firestore, créditos, localStorage
   ni los demás módulos. En el propio equipo (localhost / archivo) no se pide, para trabajar en local.
   AVISO (auditoría 10-10-2026): el repositorio es público; esto es una puerta, no oculta el código. */
(function () {
  'use strict';
  if (window.EU_ACCESO) return;
  var PERMITIDOS = ['fatimahairstudio082@gmail.com'];
  var CFG = {
    apiKey: 'AIzaSyCcvwC7NYFgXl74YTF8ouzu32SFwB559dw',
    authDomain: 'aprendisajefatima.firebaseapp.com',
    projectId: 'aprendisajefatima',
    storageBucket: 'aprendisajefatima.firebasestorage.app',
    messagingSenderId: '744176967394',
    appId: '1:744176967394:web:743b7c2a455e1e6ba7c8bb'
  };
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.0/';
  var local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  window.EU_ACCESO = { permitidos: PERMITIDOS, local: local };
  if (local) return;

  var D = document, ORO = '#B08D57', AZ = '#16223A';
  function el(t, css, txt) { var e = D.createElement(t); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }
  var velo = el('div', 'position:fixed;inset:0;z-index:2147483646;background:radial-gradient(circle at 30% 20%,#22305a,#0b1222 70%);display:flex;align-items:center;justify-content:center;font-family:system-ui,Segoe UI,sans-serif;padding:16px;box-sizing:border-box');
  var caja = el('form', 'width:min(380px,100%);background:#fff;border-radius:16px;padding:26px 24px;box-shadow:0 18px 50px rgba(0,0,0,.45);border-top:5px solid ' + ORO + ';color:' + AZ);
  caja.appendChild(el('div', 'font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:' + ORO + ';font-weight:700', 'Fátima Caldea Estudio'));
  caja.appendChild(el('h1', 'margin:6px 0 4px;font-size:24px', 'Universo · acceso privado'));
  caja.appendChild(el('p', 'margin:0 0 16px;font-size:13.5px;color:#55607a', 'Entra con tu correo y tu contraseña.'));
  var campo = 'width:100%;box-sizing:border-box;font:15px system-ui;padding:11px 12px;border:1px solid #c9cfdb;border-radius:9px;margin:0 0 10px;color:' + AZ;
  var em = el('input', campo); em.type = 'email'; em.placeholder = 'Correo'; em.autocomplete = 'username'; em.required = true;
  var pw = el('input', campo); pw.type = 'password'; pw.placeholder = 'Contraseña'; pw.autocomplete = 'current-password'; pw.required = true;
  var bt = el('button', 'width:100%;font:700 15px system-ui;padding:12px;border:0;border-radius:9px;background:' + AZ + ';color:#fff;cursor:pointer;margin-top:2px', 'Entrar');
  bt.type = 'submit';
  var olv = el('button', 'background:none;border:0;color:' + ORO + ';font:600 13px system-ui;cursor:pointer;margin-top:12px;padding:0', '¿Olvidaste la contraseña?'); olv.type = 'button';
  var msg = el('div', 'min-height:18px;font-size:13px;margin-top:10px;color:#b42318');
  [em, pw, bt, olv, msg].forEach(function (x) { caja.appendChild(x); });
  caja.onsubmit = function (e) { e.preventDefault(); msg.textContent = 'Cargando el acceso…'; };
  velo.appendChild(caja);
  function pon() { (D.body || D.documentElement).appendChild(velo); }
  pon(); if (!D.body) D.addEventListener('DOMContentLoaded', function () { if (velo.parentNode !== D.body) D.body.appendChild(velo); });
  var salida = null;
  function abrir(u) {
    velo.remove();
    if (!salida) {
      salida = el('button', 'position:fixed;left:10px;bottom:10px;z-index:2147483000;font:600 11px system-ui;padding:5px 10px;border-radius:99px;border:1px solid ' + ORO + ';background:' + AZ + ';color:#fff;cursor:pointer;opacity:.85', '🔒 Salir');
      salida.title = 'Cerrar sesión de ' + u.email;
      (D.body || D.documentElement).appendChild(salida);
    }
  }
  function cerrado(t) { if (salida) { salida.remove(); salida = null; } if (!velo.parentNode) pon(); msg.style.color = '#b42318'; msg.textContent = t || ''; bt.disabled = false; bt.textContent = 'Entrar'; }
  var ERR = { 'auth/invalid-credential': 'Correo o contraseña incorrectos.', 'auth/wrong-password': 'Correo o contraseña incorrectos.', 'auth/user-not-found': 'Correo o contraseña incorrectos.', 'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.', 'auth/network-request-failed': 'Sin conexión. Revisa internet.', 'auth/invalid-email': 'El correo no es válido.' };

  Promise.all([import(SDK + 'firebase-app.js'), import(SDK + 'firebase-auth.js')]).then(function (m) {
    var A = m[0], AU = m[1];
    var app = A.getApps().filter(function (a) { return a.name === 'universo'; })[0] || A.initializeApp(CFG, 'universo');
    var auth = AU.getAuth(app);
    AU.onAuthStateChanged(auth, function (u) {
      if (u && PERMITIDOS.indexOf(String(u.email || '').toLowerCase()) >= 0) abrir(u);
      else if (u) { AU.signOut(auth); cerrado('Este correo no tiene acceso a Universo.'); }
      else cerrado('');
    });
    caja.onsubmit = function (e) {
      e.preventDefault(); var c = em.value.trim().toLowerCase();
      if (PERMITIDOS.indexOf(c) < 0) { msg.textContent = 'Este correo no tiene acceso a Universo.'; return; }
      bt.disabled = true; bt.textContent = 'Entrando…'; msg.textContent = '';
      AU.signInWithEmailAndPassword(auth, c, pw.value).catch(function (er) { cerrado(ERR[er.code] || 'No se ha podido entrar (' + (er.code || er.message) + ').'); });
    };
    olv.onclick = function () {
      var c = em.value.trim().toLowerCase();
      if (PERMITIDOS.indexOf(c) < 0) { msg.style.color = '#b42318'; msg.textContent = 'Escribe primero tu correo de acceso.'; return; }
      AU.sendPasswordResetEmail(auth, c).then(function () { msg.style.color = '#1a7f4b'; msg.textContent = 'Te hemos enviado un correo para cambiar la contraseña.'; }).catch(function (er) { msg.style.color = '#b42318'; msg.textContent = ERR[er.code] || 'No se ha podido enviar el correo.'; });
    };
    D.addEventListener('click', function (e) { if (salida && e.target === salida) AU.signOut(auth); });
  }).catch(function () { cerrado('Sin conexión: no se puede comprobar el acceso. Recarga cuando tengas internet.'); bt.disabled = true; });
})();
