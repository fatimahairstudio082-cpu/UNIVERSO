# monta_clases.py — vídeos del curso sin subtítulos ni audio original, con la voz de Fátima.
# Uso: python3 monta_clases.py <bienvenida|cuadrado|maniqui> <voz.wav> <salida.mp4>
import sys, subprocess
import os
U = os.environ.get('VIDEOS', '/mnt/user-data/uploads')   # carpeta con los vídeos de Fátima (Descargas y «videos reutilizables»)
VR2 = U + '/videos reutilizables/video reutilizables 2.mp4'
V2 = U + '/videos reutilizables/Video sin título (2).mp4'
VP4 = U + '/videos reutilizables/Video Project 4.mp4'
RED = U + '/Downloads/corte redondo.mp4'
qué, VOZ, OUT = sys.argv[1:4]
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode())
dv = dur(VOZ) + 1.0   # medio segundo antes y después de la voz
SAL = 'scale=1280:720:flags=lanczos,setsar=1,fps=30'
# [archivo, inicio, fin, filtro de recorte] — tramos sin subtítulos; el recorte quita la estrella de la esquina
TRAMOS = {
    'bienvenida': [[VP4, 0, 28.5, 'null']],
    'cuadrado': [[VR2, 9, 20, 'crop=1872:1053:0:0'], [V2, 10, 30, 'crop=1650:928:80:0'], [V2, 40, 50, 'crop=1650:928:80:0'], [V2, 50, 55, 'crop=1650:928:80:0']],
    'maniqui': [[RED, 0, dur(RED), 'crop=1248:702:16:10']],
}[qué]
total = sum(t[2] - t[1] for t in TRAMOS)
f = max(0.75, min(1.35, dv / total))   # se estira o se acelera el vídeo para que dure lo que la voz (sin pasar de ±35 %)
ins, fil = [], []
for i, (a, s, e, c) in enumerate(TRAMOS):
    ins += ['-ss', str(s), '-t', str(e - s), '-i', a]
    fil.append(f'[{i}:v]{c},{SAL},setpts={f:.4f}*(PTS-STARTPTS)[v{i}]')
n = len(TRAMOS)
fil.append(''.join(f'[v{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=0[vc]')
largo = min(total * f, dv) if total * f >= dv else total * f
fil.append(f'[vc]trim=0:{largo:.2f},fade=t=in:st=0:d=0.4,fade=t=out:st={largo - 0.6:.2f}:d=0.6[v]')
fil.append(f'[{n}:a]adelay=500|500,apad,atrim=0:{largo:.2f},afade=t=out:st={largo - 0.6:.2f}:d=0.6[a]')
cmd = ['ffmpeg', '-v', 'error', '-y'] + ins + ['-i', VOZ, '-filter_complex', ';'.join(fil), '-map', '[v]', '-map', '[a]', '-sn',
       '-c:v', 'libx264', '-crf', '26', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '112k', '-ac', '1', '-movflags', '+faststart', OUT]
subprocess.run(cmd, check=True)
print(qué, 'voz', round(dv, 1), 's · vídeo', round(total, 1), 's ×', round(f, 2), '→', round(largo, 1), 's')
