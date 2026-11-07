/* escaner/lista.js — imágenes de resultado de corte de la Galería web que entran en el escáner (31-10-2026).
   Lee la tabla G de b6_pelu_galeria.js tal cual y escribe escaner/lista.json.
   Entran: carpeta 10 (fichas de corte), 35 (cortes por forma y vista, menos el proceso), 39/01 (tipos de corte, menos el rasurado)
   y 40 (guías de partición por forma). Fuera, por ahora: pollina y flequillo (36), particiones (26), proceso y rasurado. */
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..'), s = fs.readFileSync(path.join(raiz, 'b6_pelu_galeria.js'), 'utf8');
const a = s.indexOf('var G = ['), b = s.indexOf('\n  ];', a), G = eval(s.slice(a + 8, b + 4));
const c0 = s.indexOf('var CORTES = '), CORTES = eval('(' + s.slice(c0 + 13, s.indexOf(';', s.indexOf("'Corte con flequillo'"))) + ')');
const sel = G.filter(g => {
  if (g[2] === '10') return true;
  if (g[2] === '35') return !/09_Proceso/.test(g[3]);
  if (g[2] === '39') return /01_Tipos_de_Corte/.test(g[3]) && !/Rasurado/i.test(g[3]);
  if (g[2] === '40') return true;
  return false;
}).map(g => {
  const d = g.length > 5 ? (g[5] ? { k: g[5][0], id: g[5][1], ok: g[5][2], unidad: g[5][3] } : null)
    : (CORTES[g[1]] ? { k: 'corte', id: CORTES[g[1]][0], ok: CORTES[g[1]][1], unidad: '' } : null);
  return { n: g[0], titulo: g[1], cat: g[2], archivo: g[3], destino: d };
});
fs.writeFileSync(path.join(__dirname, 'lista.json'), JSON.stringify(sel, null, 1));
console.log('imágenes en el escáner:', sel.length);
