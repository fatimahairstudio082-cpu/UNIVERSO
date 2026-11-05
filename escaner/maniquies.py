"""escaner/maniquies.py — el maniquí de cada imagen del escáner (31-10-2026).
Abre el motor del repositorio en Chromium (Playwright), arma el corte de cada imagen (el calculado o el del catálogo), guarda el
fotograma final de «Cómo queda» en la vista de la foto (atrás o frente) en referencias/galeria_web/maniqui/ y los pasos de la lección
(título y explicación de cada escena), y escribe b6_pelu_escaner_datos.js. Uso: python3 escaner/maniquies.py <ruta a three.min.js>
(three.js r1xx: el que pide b6_guias_3d.js; aquí no hay red, por eso se pasa la ruta)."""
import sys, os, json, asyncio, base64
from urllib.parse import unquote
from playwright.async_api import async_playwright
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI); THREE = sys.argv[1]
OUT = os.path.join(RAIZ, 'referencias', 'galeria_web', 'maniqui'); os.makedirs(OUT, exist_ok=True)
MODS = ['b6_cerebro.js', 'b6_divisiones.js', 'b6_cortes.js', 'b6_guias_3d.js', 'b6_pelu_diagrama.js', 'b6_pelu_geometria.js', 'b6_pelu_calculo.js', 'b6_pelu_particiones.js']
PAGE = '<!doctype html><meta charset=utf-8><body>' + ''.join('<script src="./%s"></script>' % f for f in MODS) + '</body>'
DATOS = json.load(open(os.path.join(AQUI, 'datos.json')))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        pg = await b.new_page(viewport={'width': 1300, 'height': 760}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        async def route(r):
            u = r.request.url
            if u.endswith('three.min.js'): return await r.fulfill(path=THREE, content_type='application/javascript')
            if u.startswith('http://repo.test/'):
                if u.split('?')[0].endswith('/__t.html'): return await r.fulfill(body=PAGE, content_type='text/html')
                f = unquote(os.path.join(RAIZ, u.split('http://repo.test/')[1].split('?')[0]))
                return await (r.fulfill(path=f) if os.path.isfile(f) else r.fulfill(status=404, body=''))
            return await r.abort()
        await pg.route('**/*', route); await pg.goto('http://repo.test/__t.html'); await pg.wait_for_timeout(1500)
        await pg.evaluate('() => window.EU_DIAGRAMA.fondos()')
        hechos = {}
        for k, e in enumerate(DATOS):
            if e['fuente'] == 'revision': continue
            clave = ('gw%d' % e['n']) if e['fuente'] == 'escaner' else ('corte_%s_%s' % (e['corte'], e['vista']))
            if clave not in hechos:
                r = await pg.evaluate("""async (e) => {
                  const D = window.EU_DIAGRAMA, R = e.R ? D.libre(e.R) : e.corte, E = await D.construir(R); if (!E) return null;
                  const quiero = e.vista === 'frente' ? 'queda_frente' : 'queda_nuca';
                  // cortos (pixie, garzón, mixie): el resultado corto LIMPIO, sin las chapas de elevación encima del cabello
                  let s = (e.vista !== 'frente' && E.escenas.filter(x => x.tipo === 'queda_corto_nuca')[0])
                    || E.escenas.filter(x => x.tipo === quiero)[0] || E.escenas.filter(x => /^queda/.test(x.tipo || ''))[0] || E.escenas[E.escenas.length - 1];
                  // prog 1: el fotograma FINAL (a 0.8 la animación mechón a mechón aún no había soltado el cabello largo: salía corto)
                  return { foto: D.foto(s, 640, 1), t: s.t, pasos: E.escenas.map(x => [x.t, x.texto]) };
                }""", e)
                if not r or not r.get('foto'): hechos[clave] = None; continue
                open(os.path.join(OUT, clave + '.jpg'), 'wb').write(base64.b64decode(r['foto'].split(',')[1]))
                hechos[clave] = {'man': clave + '.jpg', 'manT': r['t'], 'pasos': r['pasos']}
            if hechos[clave]: e.update(hechos[clave])
            if k % 20 == 0: print(k, '/', len(DATOS), file=sys.stderr)
        await b.close()
    if errs: print('errores JS:', errs[:5])
    TX, idx = [], {}                                     # cada paso (título y explicación) se guarda una sola vez
    for e in DATOS:
        if e.get('pasos'):
            L = []
            for t in e['pasos']:
                k = json.dumps(t, ensure_ascii=False)
                if k not in idx: idx[k] = len(TX); TX.append(t)
                L.append(idx[k])
            e['pasos'] = L
    js = ('/* b6_pelu_escaner_datos.js — GENERADO por escaner/ (lista.js → medir.py → calcular.js → maniquies.py). No editar a mano.\n'
          '   Imágenes de resultado de corte de la Galería web con su numeración calculada desde la foto, su grupo de largo y su maniquí.\n'
          '   fuente: escaner (calculado) · catalogo (corte del sistema tal cual) · revision (no entra en el libro hasta que Fátima la vea). */\n'
          'window.EU_ESCANER_DATOS = ' + json.dumps({'fecha': '2026-10-31', 'textos': TX, 'imagenes': DATOS}, ensure_ascii=False) + ';\n')
    open(os.path.join(RAIZ, 'b6_pelu_escaner_datos.js'), 'w').write(js)
    con = [e for e in DATOS if e.get('man')]
    print('maniquíes:', len([h for h in hechos.values() if h]), '· imágenes con maniquí:', len(con), '· sin maniquí:', len([e for e in DATOS if e['fuente'] != 'revision' and not e.get('man')]))
asyncio.run(main())
