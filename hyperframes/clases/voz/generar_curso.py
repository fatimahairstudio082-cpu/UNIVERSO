# generar_curso.py - Voz de Fatima (Chatterbox) para los videos del curso, frase a frase,
# comprobando cada frase con Whisper (hasta 3 tomas). Lee guiones_curso.json y crea salida/curso_<clave>.wav
# y salida/curso_<clave>.json (tiempos de cada frase). Registro en registro_curso.txt; al acabar, fin_curso.txt.
import json, os, re, sys, time, unicodedata, difflib
import torch, torchaudio as ta
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel

BASE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(BASE, "referencia_voz_fatima.wav")
OUT = os.path.join(BASE, "salida"); os.makedirs(OUT, exist_ok=True)
LOG = open(os.path.join(BASE, "registro_curso.txt"), "w", encoding="utf-8")
def log(*a):
    LOG.write(" ".join(str(x) for x in a) + "\n"); LOG.flush()
torch.set_num_threads(max(1, os.cpu_count() - 1))
G = json.load(open(os.path.join(BASE, "guiones_curso.json"), encoding="utf-8"))
solo = sys.argv[1:]

NUM = {"0": "cero", "1": "uno", "2": "dos", "3": "tres", "4": "cuatro", "5": "cinco", "19": "diecinueve", "90": "noventa"}
def norm(s):
    s = re.sub(r"\d+", lambda m: " " + NUM.get(m.group(0), m.group(0)) + " ", s.replace("°", " grados"))
    s = unicodedata.normalize("NFD", s.lower()); s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", " ", s).split()

t0 = time.time()
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
wh = WhisperModel("small", device="cpu", compute_type="int8")
sr = model.sr
tmp = os.path.join(OUT, "_prueba_curso.wav")
log("modelos cargados", round(time.time() - t0), "s")
for clave, texto in G.items():
    if solo and clave not in solo:
        continue
    # 23-10-2026: no se corta en «:» (las frases muy cortas, como «Técnica dos:», salían con ruidos)
    frases = [f.strip() for f in re.split(r"(?<=[.!?])\s+", texto) if f.strip()]
    trozos, tiempos, pos = [torch.zeros(1, int(sr * 0.25))], [], 0.25
    for f in frases:
        mejor, nota = None, -1
        for k in range(3):
            w = model.generate(f, language_id="es", audio_prompt_path=REF, exaggeration=0.5, cfg_weight=0.5)
            ta.save(tmp, w, sr)
            segs, _ = wh.transcribe(tmp, language="es")
            oido = " ".join(s.text for s in segs)
            r = difflib.SequenceMatcher(None, norm(f), norm(oido)).ratio()
            log(clave, "toma", k, round(r, 2), "|", f[:60], "|", oido.strip()[:60])
            if r > nota: mejor, nota = w, r
            if r >= 0.95: break
        d = mejor.shape[1] / sr
        tiempos.append({"f": f, "s": round(pos, 2), "e": round(pos + d, 2), "nota": round(nota, 2)})
        trozos += [mejor, torch.zeros(1, int(sr * 0.4))]
        pos += d + 0.4
    ta.save(os.path.join(OUT, f"curso_{clave}.wav"), torch.cat(trozos, dim=1), sr)
    json.dump(tiempos, open(os.path.join(OUT, f"curso_{clave}.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    log("LISTO", clave, round(pos, 1), "s")
try: os.remove(tmp)
except OSError: pass
log("FIN en", round(time.time() - t0), "s")
open(os.path.join(BASE, "fin_curso.txt"), "w").write("TERMINADO")
