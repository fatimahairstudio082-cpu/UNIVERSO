# HyperFrames · vídeos e imágenes para el curso de Fátima

HyperFrames (HeyGen, código abierto, Apache 2.0) convierte páginas HTML animadas en vídeos MP4.
Se renderiza en local, sin cuenta ni pago (Node 22 + FFmpeg). Las skills están en `.claude/skills/`
(`/hyperframes`, `/hyperframes-core`, `/hyperframes-cli`…), así que cualquier sesión en UNIVERSO las tiene.

## Lo que hay
- `colorimetria/` (16:9) y `colorimetria_vertical/` (9:16, Reels/TikTok/Stories): 15 s, tres escenas de 5 s
  con sus fotos de `referencias/curso/` — Retoque de raíz, Mechas con papel de aluminio, Balayage.
  Medianoche #16223A y oro #B08D57, foto entera (sin recortar), sin voz ni música, sin textos inventados.
- `salidas/`: los MP4 optimizados (~1 MB cada uno) y una imagen fija por escena (JPG), para portadas de
  lección, Hotmart y redes.
- `generar.py`: rehace `index.html` a partir de la lista de escenas `ESC` (foto + nombre de la unidad).

## Cómo hacer otro vídeo
1. Copiar la foto a `colorimetria/assets/` y añadir `["foto.jpg", "Nombre de la unidad"]` a `ESC` en `generar.py`.
2. `python3 generar.py 1920 1080 colorimetria/index.html` (y `1080 1920 colorimetria_vertical/index.html`).
3. `cd colorimetria && npx hyperframes@0.8.169 check && npx hyperframes@0.8.169 render`.
4. Optimizar: `ffmpeg -i renders/<archivo>.mp4 -c:v libx264 -crf 27 -preset slow -movflags +faststart -an ../salidas/<nombre>.mp4`.

## Vídeos de módulo y de cierre de nivel (19-10-2026, conectados al curso premium)
- `gen_modulos.py modulo <id>` / `gen_modulos.py cierre <pri|sec|bach|fp>` escribe `modulos/index.html`
  con las imágenes de `modulos/assets/` (fotos de Fátima y escenas del maniquí sacadas del curso armado,
  lista en `modulos/modulos.json`; módulos de cada nivel en `modulos/niveles.json`).
- Render: `cd modulos && npx hyperframes@0.8.169 render -o renders/<id>.mp4`, optimizar con ffmpeg a
  `referencias/curso/modulos/<id>.mp4` y añadir el nombre a `referencias/curso/modulos/lista.json`.
- `b6_pelu_videos.js` pone la lección «Presentación · <módulo>» al principio de cada módulo y
  «Cierre · Nivel …» al final del curso; el ZIP los lleva en `curso/modulos/`.
- Textos «Comienza la clase», «Lecciones terminadas» y «Ahora, tu examen y tu certificado»: a validar por Fátima.

## Pendiente (con Fátima)
- Más piezas: secado, planchado, mechas con gorro; versiones con su voz cuando esté lista.
