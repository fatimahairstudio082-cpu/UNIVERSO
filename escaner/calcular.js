/* escaner/calcular.js — de lo que ve la foto al corte del motor (1-11-2026, reglas de Fátima):
   · El ESCÁNER (la foto) decide lo fiable: forma (recta/redonda/U/V), largo (corto/medio/largo) y si lleva ELEVACIÓN o no
     (capas sí/no, por la densidad de borde interno `capasFoto` de medir.py; el título manda cuando lo dice).
   · El MOTOR de geometría capilar pone la ELEVACIÓN: no se miden grados de la foto (salían irreales). Cada imagen engancha con el
     corte del catálogo que corresponde (EU_CORTES: capas largas, graduado, mariposa, wolf, pixie…) y usa SU elevación, realista, con
     la forma y el largo medidos de la foto. Cero numeración inventada.
   · Sin capas → todo a 0°. Corto (pixie/garzón/mixie) → su corte del catálogo. Dudoso (ni con ni sin capas claro) → a validar.
   Escribe escaner/datos.json. Uso: node escaner/calcular.js */
const fs = require('fs'), path = require('path');
global.window = {}; global.localStorage = { getItem: () => null, setItem: () => {} };
global.document = { createElement: () => ({ style: {}, setAttribute() {}, appendChild() {} }), head: { appendChild() {} }, body: { appendChild() {} }, querySelector: () => null, querySelectorAll: () => [] };
global.customElements = { get: () => null, define: () => {} };
require(path.join(__dirname, '..', 'b6_cortes.js'));
const CO = window.EU_CORTES, RADIO_CM = 8.9, n = 7, CORTO = 2.16, LARGO = 45 / RADIO_CM;
function elev(id) { const t = CO && CO.tecnica ? CO.tecnica(id) : null; const e = t && t.elev; return e && e.length === n ? e.slice() : null; }
/* corte tipo del motor según lo que ve la foto (su elevación es la que se usa) */
const TIPO_CAP = { mariposa: 'butterfly', butterfly: 'butterfly', wolf: 'wolf', mullet: 'wolf', shag: 'shag',
  escalonad: 'desfilado_punta', degradad: 'desfilado_punta', desfilad: 'desfilado_punta', picad: 'desfilado_punta' };
const TIPO_CORTO = { pixie: 'pixie', garz: 'garzon', mixie: 'mixie' };
function corteCapas(t) { for (const k in TIPO_CAP) if (t.indexOf(k) >= 0) return TIPO_CAP[k]; return 'capas_largas'; }
function corteCorto(t) { for (const k in TIPO_CORTO) if (t.indexOf(k) >= 0) return TIPO_CORTO[k]; return 'pixie'; }

const LISTA = require('./lista.json'), MED = require('./medidas.json');
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
  return { t, linea, capas, fleco, corto };
}
/* ¿lleva elevación? el título manda cuando lo dice; si no, la foto (densidad de borde interno) en vista de atrás */
function llevaCapas(T, m, medible) {
  if (T.capas === true) return true;
  if (T.capas === false) return false;
  const d = m.capasFoto;
  if (medible && typeof d === 'number') return d >= 0.33 ? true : d <= 0.22 ? false : null;   /* null = dudoso */
  return null;
}
const out = [];
LISTA.forEach(it => {
  const m = MED[String(it.n)] || {}, T = deTitulo(it), d = it.destino || null;
  const e = { n: it.n, titulo: it.titulo, archivo: it.archivo, destino: d, vista: m.vista || 'atras' };
  const medible = m.L && m.vista === 'atras' && !/primer plano|sin cabello|no reconocida|pequeña|claro|error/.test(m.aviso || '') && m.L >= 1.5 && m.L <= 8;
  if (m.vista === 'frente' && !m.aviso) m.aviso = 'solo hay vista de frente';
  const catalogo = d && d.k === 'corte' && d.ok;
  const L = m.L, grupo = L ? (L <= CORTO ? 'corto' : L >= LARGO ? 'largo' : 'medio') : null;
  const corto = T.corto || (medible && L <= 2.4);
  function ponR(capas, nota) {
    e.fuente = 'escaner';
    e.R = { n: it.titulo, capas: capas, linea: T.linea || (m.formaMedida === 'a' ? 'a' : m.formaMedida) || 'recta',
      largoY: L ? Math.round((1 - L) * 100) / 100 : '', fleco: T.fleco, part: 'vertical' };
    e.L = L; e.cm = L ? Math.round(L * RADIO_CM) : null; e.grupo = grupo; e.minimo = /corta el cabello/.test(m.aviso || '');
    if (nota) e.aprox = nota;
  }
  /* cortos (pixie/garzón/mixie): su corte del catálogo, con su elevación */
  if (corto) {
    if (catalogo) { e.fuente = 'catalogo'; e.corte = d.id; e.motivo = 'corte corto: se usa la ficha del corte'; }
    else { const id = corteCorto(T.t), ev = elev(id); if (ev) { ponR(ev, 'elevación del corte «' + id + '» del motor'); e.corteTipo = id; } else { e.fuente = 'revision'; e.motivo = 'corte corto sin elevación en el motor'; } }
    out.push(e); return;
  }
  /* la foto no se puede medir */
  if (!medible && !(m.vista === 'frente' && L >= 1.5 && L <= 8 && !/primer plano|claro/.test(m.aviso || ''))) {
    if (catalogo) { e.fuente = 'catalogo'; e.corte = d.id; e.motivo = 'la foto no se puede medir: se usa el corte del catálogo'; }
    else { e.fuente = 'revision'; e.motivo = m.aviso || (L ? 'medida fuera de lo normal' : 'sin medida'); }
    out.push(e); return;
  }
  const cap = llevaCapas(T, m, medible);
  if (cap === null) {                                   /* ni con ni sin capas claro: a validar, no se fuerza */
    if (catalogo) { e.fuente = 'catalogo'; e.corte = d.id; e.motivo = 'no está claro si lleva elevación: se usa el corte del catálogo'; }
    else { e.fuente = 'revision'; e.motivo = 'no está claro si lleva elevación (a validar por Fátima)'; }
    out.push(e); return;
  }
  if (cap === false) { ponR(Array(n).fill(0), m.vista === 'frente' ? 'largo medido de frente (aproximado)' : null); out.push(e); return; }
  /* con capas: elevación del corte tipo del motor (según forma/título), con la forma y el largo de la foto */
  const id = corteCapas(T.t), ev = elev(id);
  if (!ev) { e.fuente = catalogo ? 'catalogo' : 'revision'; if (catalogo) { e.corte = d.id; e.motivo = 'sin elevación tipo en el motor: se usa el corte del catálogo'; } else e.motivo = 'sin elevación tipo en el motor'; out.push(e); return; }
  ponR(ev, 'elevación del corte «' + id + '» del motor' + (m.vista === 'frente' ? ' · largo de frente (aproximado)' : ''));
  e.corteTipo = id;
  out.push(e);
});
fs.writeFileSync(path.join(__dirname, 'datos.json'), JSON.stringify(out, null, 1));
const cuenta = k => out.filter(x => x.fuente === k).length;
console.log('escáner', cuenta('escaner'), '· catálogo', cuenta('catalogo'), '· revisión', cuenta('revision'));
console.log('grupos', JSON.stringify(out.filter(x => x.grupo).reduce((a, x) => (a[x.grupo] = (a[x.grupo] || 0) + 1, a), {})));
console.log('con capas', out.filter(x => x.R && x.R.capas.some(g => g)).length, '· sin capas', out.filter(x => x.R && x.R.capas.every(g => !g)).length);
