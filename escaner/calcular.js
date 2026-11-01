/* escaner/calcular.js — de las medidas a la numeración (31-10-2026, reglas aprobadas por Fátima):
   · la forma, «con capas / sin capas» y el flequillo los dice su título o su carpeta; la foto solo da el largo y dónde termina la capa más corta;
   · sin capas → todo a 0°;
   · con capas → cálculo inverso con el motor (EU_CALCULO_CAPILAR y la caída de difCapas): capa por capa, el ángulo que deja la punta donde
     está en la foto; las capas nunca bajan de una a la siguiente y cada ángulo va al valor suyo más cercano (0 25 35 45 90 120 135 180 200 220);
   · grupo: corto hasta la barbilla (≤ 2,16 radios de cabeza ≈ 19 cm), largo desde media espalda (≥ 45 cm, a validar), medio entre los dos;
   · solo se mide la vista de atrás (de frente la cara y el cabello que cae delante engañan la medida);
   · si la foto no se puede medir y la imagen es un corte del catálogo, se usa ese corte tal cual; si no, queda para revisión (no entra en el libro);
   · si el título dice «con capas» y la foto no las enseña, o la numeración pasa de 135° (medida dudosa), queda para revisión.
   Escribe escaner/datos.json. Uso: node escaner/calcular.js */
const fs = require('fs'), path = require('path');
global.window = {}; global.localStorage = { getItem: () => null };
require(path.join(__dirname, '..', 'b6_pelu_calculo.js'));
const CC = window.EU_CALCULO_CAPILAR, SUYOS = [0, 25, 35, 45, 90, 120, 135, 180, 200, 220];
const LISTA = require('./lista.json'), MED = require('./medidas.json');
const n = 7, Rc = 56 / (2 * Math.PI), b0 = Math.min(Math.PI * .75, 17 / Rc), b1 = Math.min(.12, b0 / 4), RADIO_CM = 8.9;
const bs = [...Array(n)].map((_, i) => b0 - (b0 - b1) * i / (n - 1));
const CORTO = 2.16, LARGO = 45 / RADIO_CM;

function fin(b, largo) { const arco = Rc * Math.max(0, b0 - b); return largo <= arco ? Rc * Math.cos(b + largo / Rc) : Rc * Math.cos(b0) - (largo - arco); }
function caidas(pila, guia) { const r = CC.calcular({ capas: pila }, { guia }); return r.capas.map(c => fin(c.b, c.largo) - fin(r.capas[0].b, r.capas[0].largo)); }
function numeracion(L, Lc) {
  const t0 = (1 - L) * Rc, tc = (1 - Lc) * Rc, guia = Math.max(1, Rc * Math.cos(b0) - t0);
  const base = caidas(Array(n).fill(0), guia), meta = bs.map((b, i) => base[i] + (tc - t0) * i / (n - 1)), pila = [0];
  for (let i = 1; i < n; i++) {
    let mejor = null;
    for (let g = pila[i - 1]; g <= 225; g += 0.5) {             /* nunca por debajo de la capa anterior */
      const t = pila.concat([g]); while (t.length < n) t.push(0);
      const e = Math.abs(caidas(t, guia)[i] - meta[i]); if (!mejor || e < mejor.e - 1e-9) mejor = { g, e };
    }
    const ok = SUYOS.filter(v => v >= pila[i - 1]);
    pila.push(ok.reduce((a, b) => Math.abs(b - mejor.g) < Math.abs(a - mejor.g) ? b : a));
  }
  return pila;
}
function deTitulo(it) {
  const t = (it.titulo + ' ' + it.archivo).toLowerCase().replace(/_/g, ' ');
  let linea = '';
  if (/semi ?u|semirredond|redondo recto|redond/.test(t)) linea = 'redondeada';
  else if (/\ben u\b|forma de u|\bu\b(?= |$)/.test(t)) linea = 'u';
  else if (/\ben v\b|forma de v|\bv\b(?= |$)/.test(t)) linea = 'v';
  else if (/semicuadrad|cuadrad|hongo|\brecto\b|\brecta\b|blunt/.test(t)) linea = 'recta';
  let capas = null;
  if (/sin capas|largo recto|bob cuadrado|hongo|\bblunt\b|corte recto|rectas sin/.test(t)) capas = false;
  else if (/con capas|capas|escalonad|degradad|desfilad|shag|mariposa|butterfly|picad|mullet|wolf/.test(t)) capas = true;
  const fleco = /sin flequillo|sin pollina/.test(t) ? '' : /flequillo lateral|flequillo de lado|de lado/.test(t) ? 'lado' : /flequillo|pollina/.test(t) ? 'pollina' : '';
  const corto = /pixie|garz[oó]n|mixie/.test(t);
  return { linea, capas, fleco, corto };
}
const out = [];
LISTA.forEach(it => {
  const m = MED[String(it.n)] || {}, T = deTitulo(it), d = it.destino || null;
  const e = { n: it.n, titulo: it.titulo, archivo: it.archivo, destino: d, vista: m.vista || 'atras' };
  /* solo se mide la vista de atrás: de frente la cara y el cabello que cae delante engañan la medida */
  const medible = m.L && m.vista === 'atras' && !/primer plano|sin cabello|no reconocida|pequeña|claro|error/.test(m.aviso || '') && m.L >= 1.5 && m.L <= 8;
  if (m.vista === 'frente' && !m.aviso) m.aviso = 'solo hay vista de frente';
  const catalogo = d && d.k === 'corte' && d.ok;
  /* sin capas y solo de frente: la numeración es la de su regla (todo a 0°); el largo, el medido de frente (aproximado) */
  const deFrente = !medible && T.capas === false && !T.corto && m.vista === 'frente' && m.L >= 1.5 && m.L <= 8 && !/primer plano|claro/.test(m.aviso || '');
  if (deFrente) {
    e.fuente = 'escaner'; e.aprox = 'largo medido de frente (aproximado)';
    e.R = { n: it.titulo, capas: Array(n).fill(0), linea: T.linea || 'recta', largoY: Math.round((1 - m.L) * 100) / 100, fleco: T.fleco, part: 'vertical' };
    e.L = m.L; e.cm = Math.round(m.L * RADIO_CM); e.grupo = m.L <= CORTO ? 'corto' : m.L >= LARGO ? 'largo' : 'medio';
    out.push(e); return;
  }
  if (T.corto || !medible) {
    if (catalogo) { e.fuente = 'catalogo'; e.corte = d.id; e.motivo = T.corto ? 'corte corto: se usa la ficha del corte' : 'la foto no se puede medir: se usa el corte del catálogo'; }
    else { e.fuente = 'revision'; e.motivo = m.aviso || (m.L ? 'medida fuera de lo normal' : 'sin medida'); }
    out.push(e); return;
  }
  const L = m.L, Lc = Math.min(m.Lc || L, L);
  let pila = T.capas === false ? Array(n).fill(0) : numeracion(L, Lc);
  if (T.capas === true && pila.every(g => !g)) {
    if (catalogo) { e.fuente = 'catalogo'; e.corte = d.id; e.motivo = 'el título dice con capas y la foto no las enseña: se usa el corte del catálogo'; }
    else { e.fuente = 'revision'; e.motivo = 'el título dice con capas y la foto no las enseña'; }
    out.push(e); return;
  }
  if (Math.max.apply(null, pila) > 135) {                        /* medida dudosa (p. ej., cabello muy claro): no se inventa */
    if (catalogo) { e.fuente = 'catalogo'; e.corte = d.id; e.motivo = 'numeración calculada muy alta (medida dudosa): se usa el corte del catálogo'; }
    else { e.fuente = 'revision'; e.motivo = 'numeración calculada muy alta (medida dudosa)'; }
    out.push(e); return;
  }
  e.fuente = 'escaner';
  e.R = { n: it.titulo, capas: pila, linea: T.linea || (m.formaMedida === 'a' ? 'a' : m.formaMedida) || 'recta', largoY: Math.round((1 - L) * 100) / 100, fleco: T.fleco, part: 'vertical' };
  e.L = L; e.cm = Math.round(L * RADIO_CM); e.minimo = /corta el cabello/.test(m.aviso || '');
  e.grupo = L <= CORTO ? 'corto' : L >= LARGO ? 'largo' : 'medio';
  out.push(e);
});
fs.writeFileSync(path.join(__dirname, 'datos.json'), JSON.stringify(out, null, 1));
const cuenta = k => out.filter(x => x.fuente === k).length;
console.log('escáner', cuenta('escaner'), '· catálogo', cuenta('catalogo'), '· revisión', cuenta('revision'));
console.log('grupos', JSON.stringify(out.filter(x => x.grupo).reduce((a, x) => (a[x.grupo] = (a[x.grupo] || 0) + 1, a), {})));
console.log('con capas', out.filter(x => x.R && x.R.capas.some(g => g)).length, '· sin capas', out.filter(x => x.R && x.R.capas.every(g => !g)).length);
