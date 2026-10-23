# fotogramas_seccionados.py — fotogramas del maniquí del sistema para «Cinco técnicas de seccionado»
# (servidor local en :8000 con el repositorio; salen en f5/). Luego: python3 monta_seccionados.py voz.wav tiempos.json salida.mp4 h|v
import base64
from playwright.sync_api import sync_playwright
try:
    import cdn_local   # solo en el entorno de Claude (librerías del CDN servidas en local)
except ImportError:
    cdn_local = None
import os
S = os.environ.get('CARPETA', os.path.dirname(os.path.abspath(__file__)))
TEC=['p1_v_invertida','p1_curvo','p1_punta','p1_horizontal','p1_vertical_corto']
NS, NQ, W = 60, 45, 1000
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(); cdn_local and cdn_local.instalar(pg)
    pg.goto('http://localhost:8000/Estudio%20Universal%20Pro.dc.html', wait_until='load', timeout=120000)
    pg.evaluate("""async () => { await window.EU_CARGA_EDITORIAL();
      for (let i = 0; i < 300 && !window.EU_LIBS_LISTAS; i++) await new Promise(r => setTimeout(r, 200));
      window.EU_EDITORIAL.ensamblar({ materia: 'pelu', pais: 'es', nivel: 'fp', prod: 'libro', paginas: 40, acab: {} });
      for (let i = 0; i < 400 && !(window.EU_DIAGRAMA && window.EU_DIAGRAMA.fondosYa()); i++) await new Promise(r => setTimeout(r, 200)); }""")
    pg.add_script_tag(path=S+'/seccionados.js')
    pg.evaluate("() => { window.__E = window.__SECC(); }")
    for i,t in enumerate(TEC):
        for k in range(NS):
            d = pg.evaluate("([i,pr,W]) => window.EU_DIAGRAMA.foto(window.__E.escenas[i], W, 0.92, pr)", [i, k/(NS-1), W])
            open(S+'/f5/%d_s_%03d.jpg'%(i,k),'wb').write(base64.b64decode(d.split(',',1)[1]))
        for k in range(NQ):
            d = pg.evaluate("""([t,pr,W]) => { const d = window.EU_PELU_LIBRO_DG.datos({k:'tec', id:t}); const e = d.E.escenas.find(x=>x.tipo==='queda_nuca');
                return window.EU_DIAGRAMA.foto(e, W, 0.92, pr); }""", [t, k/(NQ-1), W])
            open(S+'/f5/%d_q_%03d.jpg'%(i,k),'wb').write(base64.b64decode(d.split(',',1)[1]))
        print(t, flush=True)
    b.close()
