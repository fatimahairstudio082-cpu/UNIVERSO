# Vídeos de apertura de cada módulo y de cierre de cada nivel del curso de Peluquería (Fátima, 19-10-2026:
# «en cada módulo un vídeo; y cuando terminan las lecciones, también, de cada nivel; que se vea más profesional»).
# Uso: python3 gen_modulos.py modulo <id>   |   python3 gen_modulos.py cierre <pri|sec|bach|fp>
# Escribe modulos/index.html. Textos: solo el título del módulo y los títulos de las escenas del propio curso
# (modulos/modulos.json, sacado del curso armado); nada inventado. Fotos y maniquí de modulos/assets/.
import sys, json, html
W, H = 1920, 1080
man = {m['id']: m for m in json.load(open('modulos/modulos.json'))}
AREA = [('pe_u_c_', 'Cortes'), ('cb_color_', 'Colorimetría'), ('cb_mechas_', 'Colorimetría'), ('cb_quim_decoloracion', 'Colorimetría'),
        ('cb_quera_', 'Queratina'), ('cb_cab_derriz', 'Queratina'), ('cb_hidra_', 'Hidratación'), ('cb_cab_secado', 'Secado y planchado'),
        ('cb_cab_planchado', 'Secado y planchado'), ('cb_quim_permanente', 'Permanente')]
NIVEL = {'pri': 'Principiante', 'sec': 'Intermedio', 'bach': 'Avanzado', 'fp': 'Profesional'}
# módulos de cada nivel, en el orden del curso (POR_NIVEL de b6_pelu_premium.js, medido con el curso de 300 hojas)
POR_NIVEL = json.load(open('modulos/niveles.json'))


def area(mid):
    for p, a in AREA:
        if mid.startswith(p): return a
    return 'Peluquería'


def limpio(t):
    return t.replace('Cortes · ', '')


def e(t):
    return html.escape(t, quote=True)


def escena_titulo(i, s, d, kicker, titulo, sub):
    return (f'''
      <section id="s{i}" class="clip escena" data-start="{s}" data-duration="{d}" data-track-index="0">
        <div class="velo2"></div>
        <div class="centro">
          <div class="kicker" id="s{i}-k">{e(kicker)}</div>
          <div class="linea c" id="s{i}-l"></div>
          <h1 class="grande" id="s{i}-t">{e(titulo)}</h1>
          <div class="autora" id="s{i}-a">{e(sub)}</div>
        </div>
      </section>''', f'''
      tl.fromTo("#s{i}-k", {{ opacity: 0, y: 24 }}, {{ opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }}, {s}+0.2);
      tl.fromTo("#s{i}-l", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.8, ease: "power2.inOut" }}, {s}+0.5);
      tl.fromTo("#s{i}-t", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }}, {s}+0.7);
      tl.fromTo("#s{i}-a", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.7 }}, {s}+1.3);
      tl.to("#s{i} .centro", {{ opacity: 0, duration: 0.4 }}, {s}+{d}-0.45);''')


def escena_foto(i, s, d, f, kicker, titulo):
    return (f'''
      <section id="s{i}" class="clip escena" data-start="{s}" data-duration="{d}" data-track-index="0">
        <div class="fondo" id="s{i}-fondo" data-layout-allow-overflow style="background-image:url('assets/{f}')"></div>
        <div class="velo"></div>
        <div class="marco" id="s{i}-marco"><img id="s{i}-img" src="assets/{f}" alt="{e(titulo)}" /></div>
        <div class="texto">
          <div class="kicker" id="s{i}-k">{e(kicker)}</div>
          <div class="linea" id="s{i}-l"></div>
          <h2 class="titulo" id="s{i}-t">{e(titulo)}</h2>
          <div class="autora" id="s{i}-a">Fátima Caldea</div>
        </div>
      </section>''', f'''
      tl.fromTo("#s{i}-fondo", {{ scale: 1.15 }}, {{ scale: 1.25, duration: {d}, ease: "none" }}, {s});
      tl.fromTo("#s{i}-marco", {{ opacity: 0, x: 60 }}, {{ opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }}, {s}+0.1);
      tl.fromTo("#s{i}-img", {{ scale: 1.0 }}, {{ scale: 1.06, duration: {d}, ease: "none" }}, {s});
      tl.fromTo("#s{i}-k", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }}, {s}+0.4);
      tl.fromTo("#s{i}-l", {{ scaleX: 0 }}, {{ scaleX: 1, duration: 0.7, ease: "power2.inOut" }}, {s}+0.6);
      tl.fromTo("#s{i}-t", {{ opacity: 0, y: 30 }}, {{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}, {s}+0.8);
      tl.fromTo("#s{i}-a", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.6 }}, {s}+1.3);
      tl.to("#s{i}-marco", {{ opacity: 0, duration: 0.4 }}, {s}+{d}-0.45);''')


def pagina(partes):
    esc = ''.join(p[0] for p in partes); js = ''.join(p[1] for p in partes)
    total = round(sum(p[2] for p in partes), 2)
    return f'''<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <!-- Fátima Caldea · curso de Peluquería: vídeo de módulo / cierre de nivel (gen_modulos.py) -->
    <script src="assets/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: #16223A; }}
      #root {{ width: 100%; height: 100%; position: relative; overflow: hidden; font-family: ui-serif, Georgia, serif; }}
      .escena {{ position: absolute; inset: 0; overflow: hidden; }}
      .fondo {{ position: absolute; inset: -40px; background-size: cover; background-position: center; filter: blur(28px) brightness(.45); }}
      .velo {{ position: absolute; inset: 0; background: linear-gradient(135deg, rgba(22,34,58,.94), rgba(22,34,58,.6)); }}
      .velo2 {{ position: absolute; inset: 0; background: radial-gradient(circle at 50% 45%, #22335A 0%, #16223A 55%, #0E1726 100%); }}
      .velo2::after {{ content: ""; position: absolute; inset: 46px; border: 2px solid rgba(176,141,87,.55); border-radius: 6px; }}
      .centro {{ position: absolute; left: 160px; right: 160px; top: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #fff; }}
      .grande {{ font-size: 104px; font-weight: 600; line-height: 1.05; color: #fff; }}
      .marco {{ position: absolute; right: 100px; top: 110px; width: 1040px; height: 860px; border: 3px solid #B08D57; border-radius: 18px; overflow: hidden; background: #E6EAF1; box-shadow: 0 30px 80px rgba(0,0,0,.45); display: flex; align-items: center; justify-content: center; }}
      .marco img {{ width: 100%; height: 100%; object-fit: contain; display: block; }}
      .texto {{ position: absolute; left: 110px; top: 300px; width: 620px; color: #fff; }}
      .kicker {{ font-family: ui-sans-serif, system-ui, sans-serif; font-size: 26px; letter-spacing: .22em; text-transform: uppercase; color: #D9C29A; font-weight: 700; }}
      .linea {{ width: 140px; height: 4px; background: #B08D57; margin: 26px 0; transform-origin: left center; }}
      .linea.c {{ transform-origin: center; margin: 30px auto; width: 180px; }}
      .titulo {{ font-size: 62px; font-weight: 600; line-height: 1.08; color: #fff; }}
      .autora {{ margin-top: 30px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 26px; color: #D9C29A; letter-spacing: .06em; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total}" data-width="{W}" data-height="{H}">{esc}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});{js}
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
'''


def partes_modulo(mid):
    M = man[mid]; a = area(mid); t = limpio(M['t']); P = []; s = 0
    x = escena_titulo(0, s, 4, 'Módulo · ' + a, t, 'Fátima Caldea'); P.append((x[0], x[1], 4)); s += 4
    for k, (f, _id, tit) in enumerate(M['f'][:4]):
        x = escena_foto(k + 1, s, 3.5, f, t, tit or t); P.append((x[0], x[1], 3.5)); s += 3.5
    x = escena_titulo(9, s, 3, t, 'Comienza la clase', 'Fátima Caldea'); P.append((x[0], x[1], 3))
    return P


def partes_cierre(nv):
    ids = POR_NIVEL[nv]; nom = NIVEL[nv]; P = []; s = 0
    x = escena_titulo(0, s, 4, 'Nivel ' + nom, 'Lecciones terminadas', 'Fátima Caldea'); P.append((x[0], x[1], 4)); s += 4
    # una imagen de varios módulos del nivel, repartidos, con el nombre del módulo
    sel = [m for m in ids if man.get(m) and man[m]['f']]
    paso = max(1, len(sel) // 4); sel = sel[::paso][:4]
    for k, mid in enumerate(sel):
        x = escena_foto(k + 1, s, 3, man[mid]['f'][0][0], 'Nivel ' + nom, limpio(man[mid]['t'])); P.append((x[0], x[1], 3)); s += 3
    x = escena_titulo(9, s, 4, 'Nivel ' + nom, 'Ahora, tu examen y tu certificado', 'Fátima Caldea'); P.append((x[0], x[1], 4))
    return P


if __name__ == '__main__':
    modo, cual = sys.argv[1], sys.argv[2]
    P = partes_modulo(cual) if modo == 'modulo' else partes_cierre(cual)
    open('modulos/index.html', 'w').write(pagina(P))
    print(round(sum(p[2] for p in P), 2))
