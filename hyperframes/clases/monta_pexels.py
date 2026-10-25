# monta_pexels.py — clases cortas y reels con los vídeos de Pexels de Fátima y su voz clonada.
# Uso: python3 monta_pexels.py <clave> <h|v> <voz.wav> <salida.mp4>
# h = 1920x1080 (curso) · v = 1080x1920 (redes). Sin subtítulos (Fátima, 23-10-2026); medianoche y oro.
import sys, os, json, glob, subprocess
from PIL import Image, ImageDraw, ImageFont

D = os.environ.get('CARPETA', os.path.dirname(os.path.abspath(__file__)))   # aquí están los vídeos de trabajo a 1080 (lavado.mp4, matiz.mp4…)
CLAVE, ORI, VOZ, OUT = sys.argv[1:5]
W, H = (1920, 1080) if ORI == 'h' else (1080, 1920)
NAVY, ORO, BLANCO = (22, 34, 58), (176, 141, 87), (255, 255, 255)
MARCA = 'Fátima Caldea · Academia Premium de Peluquería'
FIN = 2.8          # segundos de la tarjeta final
LEAD = 0.5         # la voz entra medio segundo después

# título, antetítulo y clips [archivo, inicio, fin]; textos del sistema (b6_cerebro.js, b6_cortes.js, b6_color_fatima.js)
CONF = {
    'lavado':       ('Lavado del cabello', 'ANTES DE CORTAR', [['lavado', 0, 20.1]]),
    'matizacion':   ('Matizar después de decolorar', 'COLORIMETRÍA', [['matiz', 0, 16.7]]),
    'mechas_papel': ('Mechas con papel de aluminio', 'MECHAS', [['mech1', 0, 6.0], ['mech2', 0, 5.0]]),
    'planchado':    ('Planchado', 'ACABADO', [['planch', 0, 4.1]]),
    'secado':       ('Secado con cepillo', 'ACABADO', [['sec2', 0, 10.0], ['sec1', 0, 7.9]]),
    'guia_corte':   ('Corte en la línea guía', 'CORTES BÁSICOS · A 0°', [['corte', 0, 18.8]]),
}
TIT, KICK, CLIPS = CONF[CLAVE]

def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
def serif(t):
    f = ImageFont.truetype('/usr/share/fonts/truetype/google-fonts/Lora-Variable.ttf', t)
    try: f.set_variation_by_name('SemiBold')
    except Exception: pass
    return f
def sans(t, peso='SemiBold'):
    L = [f for f in glob.glob('/usr/share/fonts/**/Inter*', recursive=True) if peso in f and 'Display' not in f and 'Italic' not in f]
    return ImageFont.truetype(L[0], t) if L else ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', t)
def envolver(d, txt, f, ancho):
    lin, cur = [], ''
    for p in txt.split():
        t = (cur + ' ' + p).strip()
        if d.textlength(t, font=f) <= ancho: cur = t
        else: lin.append(cur); cur = p
    return lin + ([cur] if cur else [])

# ---- capas de texto (PNG transparentes a pantalla completa)
def capa_titulo(ruta):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    fk, ft = sans(30 if ORI == 'h' else 36), serif(62 if ORI == 'h' else 74)
    ancho = (W * 0.55) if ORI == 'h' else (W - 140)
    lin = envolver(d, TIT, ft, ancho)
    alto = 46 + 30 + len(lin) * (ft.size + 14) + 40
    if ORI == 'h': x0, y0 = 0, H - alto - 70
    else: x0, y0 = 0, 150
    # banda con degradado medianoche → transparente
    bw = int(ancho + 200) if ORI == 'h' else W
    for i in range(bw):
        a = int(215 * (1 - max(0, i - bw * 0.55) / (bw * 0.45))) if ORI == 'h' else 205
        d.line([(x0 + i, y0), (x0 + i, y0 + alto)], fill=NAVY + (max(0, a),))
    tx = 90 if ORI == 'h' else 70
    d.text((tx, y0 + 30), KICK, font=fk, fill=ORO + (255,))
    d.rectangle([tx, y0 + 76, tx + 120, y0 + 79], fill=ORO + (255,))
    yy = y0 + 100
    for l in lin:
        d.text((tx, yy), l, font=ft, fill=BLANCO + (255,)); yy += ft.size + 14
    im.save(ruta)

def capa_marca(ruta):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    f = sans(24 if ORI == 'h' else 28, 'Medium'); t = 'Fátima Caldea'
    tw = d.textlength(t, font=f)
    x, y = (W - tw - 60, H - 64) if ORI == 'h' else ((W - tw) / 2, H - 120)
    d.rounded_rectangle([x - 16, y - 8, x + tw + 16, y + f.size + 12], 18, fill=NAVY + (150,))
    d.text((x, y), t, font=f, fill=ORO + (235,))
    im.save(ruta)

def tarjeta_final(ruta):
    im = Image.new('RGB', (W, H), NAVY); d = ImageDraw.Draw(im)
    for y in range(H):
        a = y / H; d.line([(0, y), (W, y)], fill=(int(22 + 10 * a), int(34 + 10 * a), int(58 + 16 * a)))
    ft, fk, fm = serif(70 if ORI == 'h' else 80), sans(30 if ORI == 'h' else 34), sans(28 if ORI == 'h' else 32, 'Medium')
    lin = envolver(d, TIT, ft, W - 240)
    tot = 50 + len(lin) * (ft.size + 16) + 60
    yy = (H - tot) / 2
    def cen(t, f, y, c):
        tw = d.textlength(t, font=f); d.text(((W - tw) / 2, y), t, font=f, fill=c)
    cen(KICK, fk, yy, ORO); yy += 60
    for l in lin: cen(l, ft, yy, BLANCO); yy += ft.size + 16
    d.rectangle([W / 2 - 90, yy + 24, W / 2 + 90, yy + 27], fill=ORO)
    cen(MARCA, fm, H - (110 if ORI == 'h' else 170), ORO)
    im.save(ruta)

tmp = os.path.join(D, f'_{CLAVE}_{ORI}')
capa_titulo(tmp + '_tit.png'); capa_marca(tmp + '_marca.png'); tarjeta_final(tmp + '_fin.png')

# ---- vídeo: cada clip a W×H, tiempo ajustado a la voz
dv = dur(VOZ) + LEAD + 0.7
total = sum(c[2] - c[1] for c in CLIPS)
f = dv / total
lento = f > 1.35                      # clip demasiado corto: cámara lenta con interpolación de fotogramas
if not lento: f = max(0.75, min(1.35, f))
SAL = 'setsar=1,fps=30,format=yuv420p'
ins, fil = [], []
for i, (a, s, e) in enumerate(CLIPS):
    src = os.path.join(D, a + '.mp4')
    ins += ['-ss', str(s), '-t', str(e - s), '-i', src]
    vw, vh = [int(x) for x in subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', src]).decode().strip().split(',')]
    vertical = vh > vw
    cover = f'scale={W}:{H}:force_original_aspect_ratio=increase:flags=lanczos,crop={W}:{H}'
    if ORI == 'h' and vertical:
        # vertical en 16:9: fondo difuminado y oscurecido + el vídeo entero en el centro con filo dorado
        fg_h = H - 80
        fil.append(f'[{i}:v]split[b{i}][f{i}];[b{i}]{cover},boxblur=30:2,eq=brightness=-0.18:saturation=0.8[bb{i}];'
                   f'[f{i}]scale=-2:{fg_h}:flags=lanczos,pad=iw+6:ih+6:3:3:color=0xB08D57[ff{i}];'
                   f'[bb{i}][ff{i}]overlay=(W-w)/2:(H-h)/2,{SAL}[n{i}]')
    else:
        fil.append(f'[{i}:v]{cover},{SAL}[n{i}]')
n = len(CLIPS)
fil.append(''.join(f'[n{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=0[vc]')
if lento:
    fil.append(f'[vc]minterpolate=fps=90:mi_mode=mci:mc_mode=aobmc:vsbmc=1,setpts={f:.4f}*(PTS-STARTPTS),fps=30[vs]')
else:
    fil.append(f'[vc]setpts={f:.4f}*(PTS-STARTPTS),fps=30[vs]')
L = min(total * f, dv)
fil.append(f'[vs]trim=0:{L:.2f},setpts=PTS-STARTPTS[vt]')
# capas: título (0,4–4,6 s), marca fija, tarjeta final con fundido
k = n
ins += ['-loop', '1', '-t', f'{L:.2f}', '-i', tmp + '_tit.png', '-loop', '1', '-t', f'{L:.2f}', '-i', tmp + '_marca.png',
        '-loop', '1', '-t', f'{FIN:.2f}', '-i', tmp + '_fin.png', '-i', VOZ]
fil.append(f'[{k}:v]format=rgba,fade=t=in:st=0.4:d=0.6:alpha=1,fade=t=out:st=4.0:d=0.6:alpha=1[tt]')
fil.append(f'[{k+1}:v]format=rgba,fade=t=in:st=0.8:d=0.6:alpha=1[mm]')
fil.append(f'[vt][tt]overlay=0:0:shortest=1[v1];[v1][mm]overlay=0:0:shortest=1,fade=t=in:st=0:d=0.4,{SAL},settb=1/30[vm]')
fil.append(f'[{k+2}:v]{SAL},settb=1/30[vf]')
fil.append(f'[vm][vf]xfade=transition=fade:duration=0.6:offset={L - 0.6:.2f},fade=t=out:st={L + FIN - 1.0:.2f}:d=0.4[v]')
T = L + FIN - 0.6
fil.append(f'[{k+3}:a]adelay={int(LEAD*1000)}|{int(LEAD*1000)},apad,atrim=0:{T:.2f},afade=t=out:st={T - 0.8:.2f}:d=0.8[a]')
cmd = ['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', ';'.join(fil), '-map', '[v]', '-map', '[a]',
       '-c:v', 'libx264', '-crf', '21', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-ac', '1',
       '-movflags', '+faststart', OUT]
subprocess.run(cmd, check=True)
for s in ('_tit.png', '_marca.png', '_fin.png'): os.remove(tmp + s)
print(CLAVE, ORI, 'voz', round(dur(VOZ), 1), 's · clips', round(total, 1), 's ×', round(f, 2), '(lenta)' if lento else '', '→', round(T, 1), 's')
