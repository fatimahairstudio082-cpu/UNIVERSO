# Genera index.html de las piezas de colorimetría. Uso: python3 generar.py 1920 1080 colorimetria/index.html  (o 1080 1920 para vertical).
# Escenas = lista ESC: [foto de assets/, nombre de la unidad tal cual en el temario de Fátima].
import sys
W,H,out=int(sys.argv[1]),int(sys.argv[2]),sys.argv[3]
vert=H>W
ESC=[("tinte_correccion.jpg","Retoque de raíz"),("mechas_aluminio.jpg","Mechas con papel de aluminio"),("balayage_90.jpg","Balayage")]
D=5
if vert:
    foto="left:80px;right:80px;top:260px;height:1000px"
    txt="left:80px;right:80px;top:1330px"
    tsz=96
else:
    foto="right:90px;top:120px;width:1060px;height:840px"
    txt="left:110px;top:330px;width:640px"
    tsz=84
esc=""
js=""
for i,(f,t) in enumerate(ESC):
    s=i*D
    esc+=f'''
      <section id="s{i}" class="clip escena" data-start="{s}" data-duration="{D}" data-track-index="0">
        <div class="fondo" id="s{i}-fondo" data-layout-allow-overflow style="background-image:url('assets/{f}')"></div>
        <div class="velo"></div>
        <div class="marco" id="s{i}-marco" style="{foto}"><img id="s{i}-img" src="assets/{f}" alt="{t}" /></div>
        <div class="texto" style="{txt}">
          <div class="kicker" id="s{i}-k">Colorimetría</div>
          <div class="linea" id="s{i}-l"></div>
          <h1 class="titulo" id="s{i}-t" style="font-size:{tsz}px">{t}</h1>
          <div class="autora" id="s{i}-a">Fátima Caldea</div>
        </div>
      </section>'''
    js+=f'''
      tl.fromTo("#s{i}-fondo", {{ scale: 1.15 }}, {{ scale: 1.25, duration: {D}, ease: "none" }}, {s});
      tl.fromTo("#s{i}-marco", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {s}+0.1);
      tl.fromTo("#s{i}-k", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, {s}+0.4);
      tl.fromTo("#s{i}-l", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.7, ease: "power2.inOut" }}, {s}+0.6);
      tl.fromTo("#s{i}-t", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {s}+0.8);
      tl.fromTo("#s{i}-a", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6 }}, {s}+1.3);
      tl.to("#s{i}-marco", {{ opacity: 0, duration: 0.4 }}, {s}+{D}-0.45);'''
html=f'''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <!-- Fátima Caldea · Colorimetría. Piezas reutilizables para el curso premium (portadas de módulo, redes). Fotos de referencias/curso. -->
    <script src="assets/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: #16223A; }}
      #root {{ width: 100%; height: 100%; position: relative; overflow: hidden; font-family: ui-serif, Georgia, serif; }}
      .escena {{ position: absolute; inset: 0; overflow: hidden; }}
      .fondo {{ position: absolute; inset: -40px; background-size: cover; background-position: center; filter: blur(28px) brightness(.45); }}
      .velo {{ position: absolute; inset: 0; background: linear-gradient(135deg, rgba(22,34,58,.92), rgba(22,34,58,.55)); }}
      .marco {{ position: absolute; border: 3px solid #B08D57; border-radius: 18px; overflow: hidden; background: #0f1828; box-shadow: 0 30px 80px rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; }}
      .marco img {{ width: 100%; height: 100%; object-fit: contain; display: block; }}
      .texto {{ position: absolute; color: #fff; }}
      .kicker {{ font-family: ui-sans-serif, system-ui, sans-serif; font-size: {30 if vert else 26}px; letter-spacing: .22em; text-transform: uppercase; color: #D9C29A; font-weight: 700; }}
      .linea {{ width: 140px; height: 4px; background: #B08D57; margin: 26px 0; transform-origin: left center; }}
      .titulo {{ font-weight: 600; line-height: 1.05; color: #fff; }}
      .autora {{ margin-top: 30px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: {30 if vert else 26}px; color: #D9C29A; letter-spacing: .06em; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{D*len(ESC)}" data-width="{W}" data-height="{H}">{esc}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});{js}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
'''
open(out,'w').write(html)
