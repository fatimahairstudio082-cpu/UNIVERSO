# monta5.py — «Cinco técnicas de seccionado» con el maniquí del sistema y la voz de Fátima.
# Uso: python3 monta5.py <voz.wav> <tiempos.json> <salida.mp4> <h|v>
import sys, json, re, subprocess, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
S = os.environ.get('CARPETA', os.path.dirname(os.path.abspath(__file__)))
VOZ, TJ, OUT, ORI = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
W, H = (1920, 1080) if ORI == 'h' else (1080, 1920)
FPS = 30
NAVY, ORO, BLANCO, GRIS = (22, 34, 58), (176, 141, 87), (255, 255, 255), (201, 209, 224)
F_TIT = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
import glob
def fuente(nombre, tam):
    for f in glob.glob('/usr/share/fonts/**/*.tt[fc]', recursive=True) + glob.glob('/usr/share/fonts/**/*.otf', recursive=True):
        if nombre.lower() in f.lower().replace(' ', ''): return ImageFont.truetype(f, tam)
    return ImageFont.truetype(F_TIT, tam)
SERIF = (glob.glob('/usr/share/fonts/**/Caladea-Bold.ttf', recursive=True) or [F_TIT])[0]
def serif(t):
    try:
        f = ImageFont.truetype('/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf', t); f.set_variation_by_name('SemiBold'); return f
    except Exception: return ImageFont.truetype(SERIF, t)
def sans(t, peso='SemiBold'):
    L = [f for f in glob.glob('/usr/share/fonts/**/Inter*', recursive=True) if peso in f and 'Display' not in f and 'Italic' not in f]
    return ImageFont.truetype(L[0], t) if L else ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', t)

TEC = [('Técnica 1', 'Seccionado en V invertida'), ('Técnica 2', 'Seccionado curvo'), ('Técnica 3', 'Seccionado en punta'),
       ('Técnica 4', 'Seccionado horizontal en capas'), ('Técnica 5', 'Seccionado vertical con graduación')]
SUB = 'Todo a 0° · el cabello cae hacia abajo'
MARCA = 'Fátima Caldea · Academia Premium de Peluquería'

frases = json.load(open(TJ, encoding='utf-8'))
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', VOZ]).decode().strip()) + 0.8
ini = [i for i, f in enumerate(frases) if re.match(r'T[ée]cnica', f['f'])]
fin_i = [i for i, f in enumerate(frases) if f['f'].startswith('Tu futuro')]
t_tec = [frases[i]['s'] - 0.2 for i in ini]
t_fin = frases[fin_i[0]]['s'] - 0.2 if fin_i else dur - 3
bordes = [0] + t_tec + [t_fin, dur]   # intro | t1..t5 | final

def cargar(i, k, n):
    return Image.open(f'{S}/f5/{i}_{k}_{n:03d}.jpg').convert('RGB')
NS, NQ = 60, 45
fondo = Image.new('RGB', (W, H), NAVY)
d0 = ImageDraw.Draw(fondo)
for y in range(H):   # degradado suave
    a = y / H; d0.line([(0, y), (W, y)], fill=(int(22 + 10 * a), int(34 + 10 * a), int(58 + 16 * a)))

def panel(img):
    if ORI == 'h': w = 960
    else: w = 960
    h = int(w * img.height / img.width)
    im = img.resize((w, h), Image.LANCZOS)
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, w - 1, h - 1], 22, fill=255)
    return im, m

def texto_centrado(d, x0, x1, y, txt, f, c):
    tw = d.textlength(txt, font=f); d.text((x0 + (x1 - x0 - tw) / 2, y), txt, font=f, fill=c)

def envolver(d, txt, f, ancho):
    pal, lin, cur = txt.split(), [], ''
    for p in pal:
        t = (cur + ' ' + p).strip()
        if d.textlength(t, font=f) <= ancho: cur = t
        else: lin.append(cur); cur = p
    if cur: lin.append(cur)
    return lin

def alfa(t, t0, d=0.6):
    return max(0.0, min(1.0, (t - t0) / d))

def cuadro(t):
    im = fondo.copy(); d = ImageDraw.Draw(im, 'RGBA')
    seg = max(i for i in range(len(bordes) - 1) if t >= bordes[i]) if t >= 0 else 0
    s0, s1 = bordes[seg], bordes[seg + 1]
    if seg == 0:   # entrada
        a = alfa(t, 0.2)
        texto_centrado(d, 0, W, H * (0.2 if ORI == 'h' else 0.18), 'NIVEL PRINCIPIANTE · TODO A 0°', sans(34 if ORI == 'h' else 38), ORO + (int(255 * a),))
        f = serif(84 if ORI == 'h' else 92)
        for j, l in enumerate(envolver(d, 'Cinco técnicas de seccionado', f, W - 200)):
            texto_centrado(d, 0, W, H * (0.27 if ORI == 'h' else 0.23) + j * 100, l, f, BLANCO + (int(255 * alfa(t, 0.5)),))
        # cinco maniquíes que van apareciendo
        n = 5; tw = (W - 200) // n if ORI == 'h' else 300
        pos = [(100 + j * tw, int(H * 0.52)) for j in range(n)] if ORI == 'h' else [((W - 2 * tw) // 2 + (j % 2) * tw if j < 4 else (W - tw) // 2, int(H * 0.36) + (j // 2) * 300) for j in range(n)]
        for j in range(n):
            aj = alfa(t, 1.0 + j * 0.45, 0.5)
            if aj <= 0: continue
            th = cargar(j, 's', NS - 1); w2 = tw - 24; h2 = int(w2 * th.height / th.width)
            th = th.resize((w2, h2), Image.LANCZOS); mk = Image.new('L', (w2, h2), 0); ImageDraw.Draw(mk).rounded_rectangle([0, 0, w2 - 1, h2 - 1], 14, fill=int(255 * aj))
            im.paste(th, pos[j], mk)
            texto_centrado(d, pos[j][0], pos[j][0] + w2, pos[j][1] + h2 + 10, str(j + 1), sans(30), ORO + (int(255 * aj),))
    elif seg <= 5:
        i = seg - 1; u = (t - s0) / max(0.1, s1 - s0)
        img = cargar(i, 's', min(NS - 1, int(NS * u / 0.58))) if u < 0.6 else cargar(i, 'q', min(NQ - 1, int(NQ * (u - 0.6) / 0.32)))
        p, m = panel(img)
        x, y = (110, (H - p.height) // 2) if ORI == 'h' else ((W - p.width) // 2, 220)
        d.rounded_rectangle([x - 4, y - 4, x + p.width + 3, y + p.height + 3], 26, outline=ORO, width=3)
        im.paste(p, (x, y), m)
        if ORI == 'h': tx0, tx1, ty = 1130, W - 90, 330
        else: tx0, tx1, ty = 90, W - 90, y + p.height + 90
        a1, a2, a3 = alfa(t, s0 + 0.1), alfa(t, s0 + 0.35), alfa(t, s0 + 0.7)
        fk = sans(38); kick = TEC[i][0].upper()
        if ORI == 'h': d.text((tx0, ty), kick, font=fk, fill=ORO + (int(255 * a1),))
        else: texto_centrado(d, tx0, tx1, ty, kick, fk, ORO + (int(255 * a1),))
        ly = ty + 62; lw = int(140 * a2)
        if ORI == 'h': d.rectangle([tx0, ly, tx0 + lw, ly + 3], fill=ORO)
        else: d.rectangle([W // 2 - lw // 2, ly, W // 2 + lw // 2, ly + 3], fill=ORO)
        f = serif(66 if ORI == 'h' else 70); yy = ly + 34
        for l in envolver(d, TEC[i][1], f, tx1 - tx0):
            if ORI == 'h': d.text((tx0, yy), l, font=f, fill=BLANCO + (int(255 * a2),))
            else: texto_centrado(d, tx0, tx1, yy, l, f, BLANCO + (int(255 * a2),))
            yy += 84
        fs = sans(32, 'Regular')
        if ORI == 'h': d.text((tx0, yy + 20), SUB, font=fs, fill=GRIS + (int(255 * a3),))
        else: texto_centrado(d, tx0, tx1, yy + 20, SUB, fs, GRIS + (int(255 * a3),))
        # puntos de avance
        for j in range(5):
            cx = (tx0 + j * 34 + 8) if ORI == 'h' else (W // 2 - 68 + j * 34)
            cy = (yy + 110) if ORI == 'h' else (yy + 110)
            d.ellipse([cx - 7, cy - 7, cx + 7, cy + 7], fill=ORO if j <= i else (60, 74, 104))
    else:   # final
        f = serif(78 if ORI == 'h' else 86); yy = H * 0.36
        for j, l in enumerate(envolver(d, 'Tu futuro en la peluquería comienza aquí', f, W - 260)):
            texto_centrado(d, 0, W, yy + j * 100, l, f, BLANCO + (int(255 * alfa(t, s0 + 0.2)),)); last = yy + j * 100
        lw = int(180 * alfa(t, s0 + 0.6)); d.rectangle([W // 2 - lw // 2, last + 130, W // 2 + lw // 2, last + 133], fill=ORO)
    # marca y fundidos
    fm = sans(26 if ORI == 'h' else 30, 'Medium')
    texto_centrado(d, 0, W, H - (70 if ORI == 'h' else 120), MARCA, fm, ORO + (200,))
    for b in bordes[1:-1]:
        if abs(t - b) < 0.25:
            v = 1 - abs(t - b) / 0.25; d.rectangle([0, 0, W, H], fill=NAVY + (int(200 * v),))
    if t < 0.3: d.rectangle([0, 0, W, H], fill=(0, 0, 0, int(255 * (1 - t / 0.3))))
    if t > dur - 0.5: d.rectangle([0, 0, W, H], fill=(0, 0, 0, int(255 * min(1, (t - dur + 0.5) / 0.5))))
    return im

N = int(dur * FPS)
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                       '-i', VOZ, '-filter_complex', '[1:a]adelay=300|300,apad[a]', '-map', '0:v', '-map', '[a]', '-shortest',
                       '-c:v', 'libx264', '-crf', '22', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
for k in range(N):
    ff.stdin.write(cuadro(k / FPS).tobytes())
ff.stdin.close(); ff.wait()
print('ok', OUT, round(dur, 1), 's')
