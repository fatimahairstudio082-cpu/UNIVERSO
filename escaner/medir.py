"""escaner/medir.py — mide cada imagen de escaner/lista.json (31-10-2026, Fátima: «que el sistema saque la numeración de la imagen»).

Separa el cabello (modelo de persona de MediaPipe, escaner/selfie_segmentation.tflite, Apache 2.0; en vistas de atrás, por color),
coge la vista más grande de la lámina y mide, en radios de cabeza (la unidad del maniquí):
  L   = de lo alto de la cabeza a donde termina el cabello
  Lc  = de lo alto de la cabeza a donde termina la capa más corta (donde el contorno se mete)
  vista (frente / atrás / lado), forma medida del borde de abajo y avisos (primer plano, la foto corta el cabello).
Escribe escaner/medidas.json. Uso: python3 -I escaner/medir.py   (necesita numpy, scipy, pillow y ai-edge-litert)
"""
import json, os, sys, numpy as np
from PIL import Image
from scipy import ndimage as nd
from ai_edge_litert.interpreter import Interpreter
AQUI = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.dirname(AQUI)
IMG = os.path.join(RAIZ, 'referencias', 'galeria_web', 'imagenes')
IT = Interpreter(os.path.join(AQUI, 'selfie_segmentation.tflite')); IT.allocate_tensors()

def persona(img):
    x = np.asarray(img.resize((256, 256)), np.float32)[None] / 255.
    IT.set_tensor(IT.get_input_details()[0]['index'], x); IT.invoke()
    m = IT.get_tensor(IT.get_output_details()[0]['index'])[0, :, :, 0]
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize(img.size, Image.BILINEAR)) > 127

def paneles(img):
    """columnas de fondo claro que cruzan la lámina de arriba abajo → paneles (Frente | Lateral | Atrás)"""
    a = np.asarray(img.convert('L')).astype(int); H, W = a.shape; banda = a[int(H * .2):int(H * .85)]
    vacia = (banda > 225).mean(0) > .9; cortes, x = [], 0
    while x < W:
        if not vacia[x]:
            x0 = x
            while x < W and not vacia[x]: x += 1
            if x - x0 > W * .12: cortes.append((x0, x))
        x += 1
    return cortes

def mide(ruta, atras=False):
    img = Image.open(ruta).convert('RGB')
    if atras:                                    # fichas de corte: el último panel es «Atrás»
        P = paneles(img)
        if len(P) >= 2: img = img.crop((P[-1][0], 0, P[-1][1], img.size[1]))
    a = np.asarray(img).astype(int); r, g, b = a[..., 0], a[..., 1], a[..., 2]
    Y = .299 * r + .587 * g + .114 * b; Cr = (r - Y) * .713 + 128; Cb = (b - Y) * .564 + 128
    piel = (Cr > 138) & (Cr < 175) & (Cb > 85) & (Cb < 128) & (Y > 130)
    # fondo = el color del borde de la imagen (no el brillo: así el cabello rubio no se pierde); ropa clara = gris o blanco sin color
    borde = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]); fc = np.median(borde, 0)
    fondo_ = np.sqrt(((a - fc) ** 2).sum(-1)) < 30
    sat = a.max(-1) - a.min(-1); claro = fondo_ | ((sat < 18) & (Y > 170))
    per = persona(img); pelo = per & ~piel & ~claro
    if pelo.mean() < 0.12: pelo = ~claro & (Y < 200) & ~piel          # vista de atrás: el modelo de persona no la ve
    pelo = nd.binary_opening(pelo, iterations=2)
    pelo = nd.binary_closing(pelo, iterations=3)                      # une los dos lados del cabello alrededor de la cara
    lab, n = nd.label(pelo)
    if n == 0: return {'aviso': 'sin cabello'}
    # la figura más grande que sea una foto (con piel cerca: cara, cuello u hombros), no el dibujo esquemático de la cabeza
    mejor, km = -1, 1
    for j, sl in enumerate(nd.find_objects(lab), 1):
        if sl is None: continue
        area = (lab[sl] == j).sum(); y0, y1, x0_, x1_ = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        cerca = piel[y0:min(piel.shape[0], y1 + (y1 - y0) // 5), x0_:x1_].mean()
        cara_ = piel[y0:y0 + (y1 - y0) // 2, x0_ + (x1_ - x0_) // 4:x1_ - (x1_ - x0_) // 4].mean()
        sc = area * (1 if cerca > .02 else .1) * (2 if cara_ < .05 and cerca > .02 else 1)   # la vista de atrás se mide mejor
        if sc > mejor: mejor, km = sc, j
    M = lab == km
    # partes de la misma figura (un reflejo claro puede partir el cabello en dos): mismas filas y casi tocándose
    ys0, xs0 = np.where(M); a0, b0_, c0, d0 = ys0.min(), ys0.max(), xs0.min(), xs0.max(); wd = d0 - c0 + 1
    for j, sl in enumerate(nd.find_objects(lab), 1):
        if sl is None or j == km: continue
        y0, y1, x0_, x1_ = sl[0].start, sl[0].stop - 1, sl[1].start, sl[1].stop - 1
        comun = min(b0_, y1) - max(a0, y0); hueco = max(x0_ - d0, c0 - x1_)
        if comun > .5 * min(b0_ - a0, y1 - y0) and hueco < .15 * wd: M |= lab == j
    # cabello muy claro: si en lo alto de la figura casi todo es «piel», la medida no es fiable
    yy, xx = np.where(M); t0 = yy.min(); hh = max(1, yy.max() - t0)
    alto = per[t0:t0 + int(hh * .25), xx.min():xx.max() + 1] if per.any() else None
    if alto is not None and alto.sum() > 50:
        pa = (piel[t0:t0 + int(hh * .25), xx.min():xx.max() + 1] & alto).sum() / alto.sum()
        if pa > .45: return {'aviso': 'cabello claro: medida dudosa'}
    H, W = M.shape; ys, xs = np.where(M); top, bot = int(ys.min()), int(ys.max()); x0, x1 = int(xs.min()), int(xs.max())
    if os.environ.get('DEPURA'):
        v = np.asarray(img).copy(); v[M] = (v[M] * .45 + np.array([255, 0, 180]) * .55).astype(np.uint8)
        Image.fromarray(v).save(os.path.join(os.environ['DEPURA'], os.path.basename(ruta)))
    if M.sum() < 0.02 * H * W: return {'aviso': 'figura demasiado pequeña'}
    w = np.array([(np.ptp(np.where(M[y])[0]) if M[y].any() else 0) for y in range(top, bot + 1)], float)
    ws = np.convolve(w, np.ones(9) / 9, 'same')
    i = 10                                                              # cabeza: primer máximo del ancho
    while i < len(ws) - 5 and not (ws[i] >= ws[i + 5] and ws[i] > ws[max(0, i - 5)]): i += 1
    rpx = ws[i] / 2
    if i > 2.2 * rpx: rpx = ws[:int(len(ws) * .3)].max() / 2
    if rpx < 8: return {'aviso': 'cabeza no reconocida'}
    L = (bot - top) / rpx
    y0 = int(i + 0.6 * rpx); corta = None
    if y0 < len(ws):
        jj = int(np.argmax(ws[y0:])) + y0; mx = ws[jj]
        for j in range(jj, len(ws)):
            if ws[j] < .88 * mx: corta = j; break
    if corta is None or corta > .9 * len(ws): corta = len(ws) - 1
    Lc = corta / rpx
    # vista: hay cara si dentro de la figura, arriba y en el centro, hay piel
    cx0, cx1 = x0 + (x1 - x0) // 4, x1 - (x1 - x0) // 4; cy1 = top + int((bot - top) * .45)
    caja = piel[top:cy1, cx0:cx1]; cara = float(caja.mean()) if caja.size else 0.
    vista = 'frente' if cara > .10 else 'atras'
    # forma del borde de abajo (solo de apoyo: manda el título de Fátima)
    cols = [x for x in range(x0, x1 + 1) if M[top:, x].sum() > 15]
    fondo = np.array([np.where(M[:, x])[0].max() for x in cols], float); xn = (np.array(cols, float) - np.mean(cols)) / max(1, np.ptp(cols) / 2)
    ancho = 2 * rpx; c = np.median(fondo[np.abs(xn) < .12]); l = np.median(fondo[(np.abs(xn) > .55) & (np.abs(xn) < .85)])
    caida = (c - l) / ancho; sel = np.abs(xn) < .85
    eV = np.abs(fondo[sel] - np.polyval(np.polyfit(np.abs(xn[sel]), fondo[sel], 1), np.abs(xn[sel]))).mean()
    eU = np.abs(fondo[sel] - np.polyval(np.polyfit(xn[sel] ** 2, fondo[sel], 1), xn[sel] ** 2)).mean()
    forma = 'recta' if abs(caida) < .06 else ('v' if eV < eU else 'u') if caida > .3 else 'redondeada' if caida > 0 else 'a'
    # ¿lleva elevación (capas) o es de un solo largo? — densidad de borde horizontal INTERNO: una punta de mechón que cae sobre
    # más cabello deja un borde dentro de la masa; un corte de un solo largo solo tiene el borde del contorno. (Señal, no numeración.)
    gy = np.abs(nd.sobel(nd.gaussian_filter(Y, 1.2), axis=0))
    dentro = M.copy(); dentro[:int(top + 1.1 * rpx)] = False
    masAbajo = np.zeros_like(M); masAbajo[:-12] = M[12:]
    interno = dentro & masAbajo & (gy > 14); area = max(1, int(dentro.sum()))
    dens = round(float(interno.sum()) / area, 3)
    aviso = 'primer plano: la foto no enseña la cabeza entera' if (x0 <= 2 and x1 >= W - 3) or top <= 2 else \
            ('la foto corta el cabello: largo mínimo' if bot >= H - 4 else '')
    return {'L': round(L, 3), 'Lc': round(Lc, 3), 'vista': vista, 'formaMedida': forma, 'capasFoto': dens, 'aviso': aviso,
            'caja': [x0, top, x1, bot], 'tam': [W, H]}

if __name__ == '__main__':
    L = json.load(open(os.path.join(AQUI, 'lista.json'))); out = {}
    for k, it in enumerate(L):
        try: out[str(it['n'])] = mide(os.path.join(IMG, it['archivo']), atras=it['cat'] == '10')
        except Exception as e: out[str(it['n'])] = {'aviso': 'error al medir: ' + str(e)[:80]}
        if k % 20 == 0: print(k, '/', len(L), file=sys.stderr)
    json.dump(out, open(os.path.join(AQUI, 'medidas.json'), 'w'), ensure_ascii=False, indent=1)
    print('medidas:', len(out), '· con aviso:', sum(1 for v in out.values() if v.get('aviso')))
