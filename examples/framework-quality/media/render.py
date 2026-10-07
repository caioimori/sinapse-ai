"""Native deterministic Lume fixture. No network, samples or third-party assets.

Run with the bundled Windows Python. Outputs are isolated by attempt; existing
artifacts are never overwritten. A failed attempt remains available for review.
"""
from __future__ import annotations

import argparse
import array
import hashlib
import html
import json
import math
from pathlib import Path
import shutil
import subprocess
import sys
import threading
import time
import wave

import PIL
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
PLAN = json.loads((HERE / 'production-plan.json').read_text(encoding='utf-8'))
C = PLAN['tokens']
REGULAR = Path('C:/Windows/Fonts/segoeui.ttf')
BOLD = Path('C:/Windows/Fonts/segoeuib.ttf')
FONTS = {}
BOUNDS = []


def sha(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def run(args, timeout=180):
    result = subprocess.run(args, capture_output=True, timeout=timeout, check=False)
    if result.returncode:
        raise RuntimeError(result.stderr.decode(errors='replace')[-3000:])
    return result.stdout.decode(errors='replace')


def font(size, bold=False):
    key = (size, bold)
    if key not in FONTS:
        FONTS[key] = ImageFont.truetype(str(BOLD if bold else REGULAR), size)
    return FONTS[key]


class Canvas:
    """Raster and editable vector use the exact same geometric commands."""
    def __init__(self, width, height, name, record=True):
        self.image = Image.new('RGB', (width, height), C['paper'])
        self.draw = ImageDraw.Draw(self.image)
        self.name, self.record = name, record
        self.svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
                    f'<rect width="100%" height="100%" fill="{C["paper"]}"/>']

    def rect(self, box, fill=None, stroke=None, width=2, radius=0):
        x, y, x2, y2 = box
        self.draw.rounded_rectangle(box, radius, fill=fill, outline=stroke, width=width)
        self.svg.append(f'<rect x="{x}" y="{y}" width="{x2-x}" height="{y2-y}" rx="{radius}" fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="{width}"/>')

    def line(self, points, fill, width=2):
        self.draw.line(points, fill=fill, width=width, joint='curve')
        self.svg.append(f'<polyline points="{" ".join(f"{x},{y}" for x,y in points)}" fill="none" stroke="{fill}" stroke-width="{width}" stroke-linecap="round"/>')

    def circle(self, x, y, radius, fill, stroke=None, width=2):
        self.draw.ellipse((x-radius, y-radius, x+radius, y+radius), fill=fill, outline=stroke, width=width)
        self.svg.append(f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{fill or "none"}" stroke="{stroke or "none"}" stroke-width="{width}"/>')

    def text(self, x, y, value, size, fill=None, bold=False, max_width=None, safe=None):
        f = font(size, bold)
        bbox = self.draw.textbbox((x, y), value, font=f, anchor='lt')
        if max_width is not None and bbox[2] - x > max_width:
            raise ValueError(f'{self.name}: text exceeds width: {value}')
        if safe is not None and not (bbox[0] >= safe[0] and bbox[1] >= safe[1] and bbox[2] <= safe[2] and bbox[3] <= safe[3]):
            raise ValueError(f'{self.name}: text exceeds safe box: {value} {bbox}')
        self.draw.text((x, y), value, font=f, fill=fill or C['ink'], anchor='lt')
        self.svg.append(f'<text x="{x}" y="{y}" dominant-baseline="text-before-edge" font-family="Segoe UI, sans-serif" font-size="{size}" font-weight="{700 if bold else 400}" fill="{fill or C["ink"]}">{html.escape(value)}</text>')
        if self.record:
            BOUNDS.append({'artifact': self.name, 'text': value, 'box': list(bbox), 'fontPx': size, 'widthChecked': max_width, 'safeBox': safe, 'pass': True})

    def save(self, path):
        self.image.save(path)


def graphic(cv, kind, x, y, w, h, progress=1, checks=3, close=True):
    accent, ink, surface = C['accent'], C['ink'], C['surface']
    if kind == 'cycle-line':
        cw=(w-72)/3
        centers=[x+i*(cw+36)+cw/2 for i in range(3)]
        for i,cx in enumerate(centers):
            xx=cx-cw/2
            cv.rect((xx,y+20,xx+cw,y+240),accent if i==0 else surface,None if i==0 else C['line'],2,10)
            color='#ffffff' if i==0 else ink
            cv.text(xx+24,y+44,f'0{i+1}',34,'#ffffff' if i==0 else accent)
            cv.text(xx+24,y+103,['Planejar','Produzir','Revisar'][i],44,color,True,max_width=cw-38)
            cv.text(xx+24,y+170,['Definir','Organizar','Conferir'][i],36,color,max_width=cw-38)
            if i<2 and progress>.15+i*.3:
                mid=xx+cw+18
                cv.line([(mid-10,y+129),(mid+10,y+129)],accent,3)
                cv.line([(mid+3,y+122),(mid+10,y+129),(mid+3,y+136)],accent,3)
        if close:
            cy=y+110
            pts = [(centers[2],y+252), (centers[2],y+310), (centers[0],y+310), (centers[0],y+252)]
            n = max(2, int(len(pts)*progress))
            cv.line(pts[:n], accent, 3)
            if progress >= .99:
                cv.line([(centers[0]-9,y+264),(centers[0],y+252),(centers[0]+9,y+264)],accent,3)
            label='Ajustar a peça'
            tw=cv.draw.textlength(label,font=font(34))
            cv.rect((x+w/2-tw/2-14,y+290,x+w/2+tw/2+14,y+331),C['paper'])
            cv.text(x+w/2-tw/2,y+291,label,34,accent)
    elif kind == 'idea-grid':
        cv.rect((x,y+8,x+w,y+h-8),surface,C['line'],2,12)
        cv.text(x+32,y+34,'O que a peça precisa comunicar?',36,max_width=w-64)
        shift=(1-progress)*32
        cv.rect((x+28+shift,y+108,x+w-28,y+211),accent,radius=8)
        cv.text(x+58+shift,y+136,'Uma mensagem central.',44,'#ffffff',True,max_width=w-116)
        cv.circle(x+w-76,y+160,22,'#ffffff')
        cv.line([(x+w-87,y+160),(x+w-78,y+168),(x+w-65,y+151)],accent,4)
        cv.text(x+32,y+254,'Antes do formato.',36,C['muted'])
        cv.line([(x+370,y+274),(x+w-32,y+274)],C['line'],3)
    elif kind == 'production-stack':
        cw=(w-40)/3
        for i in range(3):
            xx=x+i*(cw+20); yy=y+12+(1-progress)*16*(i-1)
            cv.rect((xx,yy,xx+cw,yy+237),surface,C['line'],2,10)
            cv.text(xx+24,yy+24,['Texto','Imagem','Ritmo'][i],40,accent,True,max_width=cw-48)
            if i==0:
                cv.text(xx+24,yy+108,'Uma ideia',34,max_width=cw-48)
                cv.text(xx+24,yy+152,'ganha forma.',34,max_width=cw-40)
            elif i==1:
                cv.rect((xx+24,yy+89,xx+cw-24,yy+205),C['accentSoft'],radius=6)
                cv.circle(xx+cw/2,yy+146,39,accent)
                cv.rect((xx+cw/2-26,yy+120,xx+cw/2+26,yy+172),surface,radius=3)
            else:
                for j in range(3):
                    yy2=yy+104+j*34
                    cv.rect((xx+24,yy2,xx+24+(cw-48)*[.45,.72,1][j],yy2+14),accent,radius=3)
        cv.line([(x+cw/2,y+260),(x+cw/2,y+286),(x+w-cw/2,y+286),(x+w-cw/2,y+260)],accent,3)
        label='A mesma ideia'
        tw=cv.draw.textlength(label,font=font(34))
        cv.rect((x+w/2-tw/2-15,y+267,x+w/2+tw/2+15,y+310),C['paper'])
        cv.text(x+w/2-tw/2,y+268,label,34,accent)
    elif kind == 'review-frame':
        cv.rect((x+26,y+6,x+w-26,y+h-8),None,accent,3,14)
        cv.rect((x+53,y+30,x+w-53,y+h-34),surface,C['line'],2,9)
        cv.rect((x+76,y+54,x+248,y+h-58),C['accentSoft'],radius=8)
        cv.text(x+94,y+78,'Ideia',36,accent,True)
        cv.text(x+94,y+130,'Texto',30,ink)
        cv.rect((x+94,y+178,x+229,y+245),accent,radius=4)
        cv.circle(x+161,y+211,19,surface)
        for i,label in enumerate(['Mensagem','Leitura','Sequência']):
            yy=y+63+i*84
            if i < checks:
                cv.circle(x+310,yy+17,20,accent)
                cv.line([(x+300,yy+17),(x+308,yy+25),(x+322,yy+9)],'#ffffff',4)
            else:
                cv.circle(x+310,yy+17,20,surface,C['line'],2)
            cv.text(x+351,yy,label,36)


def carousel(out):
    safe = [88,80,992,1250]
    images=[]
    for slide in PLAN['carousel']['slides']:
        name=f'carousel-{slide["page"]:02d}'
        cv=Canvas(1080,1350,name)
        cv.circle(101,99,10,C['accent'])
        cv.text(125,80,'Lume',40,bold=True,safe=safe)
        cv.text(88,158,slide['edition'],36,C['accent'],max_width=904,safe=safe)
        for i,line in enumerate(slide['headingLines']):
            cv.text(88,240+i*102,line,88,bold=True,max_width=904,safe=safe)
        for i,line in enumerate(slide['bodyLines']):
            cv.text(88,500+i*59,line,48,max_width=904,safe=safe)
        graphic(cv,slide['graphic'],88,720,904,360,close=slide['page']==5)
        cv.line([(88,1158),(992,1158)],C['line'],2)
        cv.text(88,1190,slide['footer'],36,C['muted'],safe=safe)
        cv.save(out/f'{name}.png')
        source=HERE/'editable'
        source.mkdir(exist_ok=True)
        (source/f'{name}.svg').write_text('\n'.join(cv.svg+['</svg>']),encoding='utf-8')
        images.append(cv.image)
    contact=Image.new('RGB',(390*5+24*6,488+48),C['paper'])
    mobile=Image.new('RGB',(390,488*5),C['paper'])
    for i,im in enumerate(images):
        thumb=im.resize((390,488),Image.Resampling.LANCZOS)
        contact.paste(thumb,(24+i*414,24)); mobile.paste(thumb,(0,i*488))
    contact.save(out/'carousel-contact.png'); mobile.save(out/'carousel-mobile-390.png')


def audio(out):
    spec=PLAN['reel']['audio']; rate=spec['sampleRate']; samples=array.array('h')
    squares=0; peak=0
    for n in range(18*rate):
        t=n/rate
        envelope=min(1,t/spec['pad']['fadeInSeconds'],(18-t)/spec['pad']['fadeOutSeconds'])
        value=sum(spec['pad']['peakAmplitudeEach']*math.sin(2*math.pi*f*t) for f in spec['pad']['frequenciesHz'])*max(0,envelope)
        for pulse in spec['pulses']:
            dt=t-pulse['at']
            if 0 <= dt < spec['pulseSeconds']:
                attack=min(1,dt/.015)
                release=math.exp(-dt*15)*(1-dt/spec['pulseSeconds'])
                value+=spec['pulsePeakAmplitude']*attack*release*math.sin(2*math.pi*pulse['frequencyHz']*dt)
        peak=max(peak,abs(value)); squares+=value*value
        sample=round(value*32767); samples.extend((sample,sample))
    if sys.byteorder!='little': samples.byteswap()
    with wave.open(str(out/'lume-sound.wav'),'wb') as wav:
        wav.setnchannels(2); wav.setsampwidth(2); wav.setframerate(rate); wav.writeframes(samples.tobytes())
    return {'sourceRms':math.sqrt(squares/(18*rate)),'sourcePeak':peak,'layout':'dual mono','sourceFrames':18*rate,'speech':False,'subjectiveListening':'not_observed'}


def frame(index, record=False):
    t=index/30
    scene=next(s for s in PLAN['reel']['timeline'] if s['start'] <= t < s['end'])
    local=t-scene['start']; p=min(1,local/.6); p=1-(1-p)**3
    cv=Canvas(1080,1920,f'reel-{scene["id"]}',record)
    safe=[96,240,984,1536]
    cv.circle(110,267,10,C['accent']); cv.text(137,248,'Lume',40,bold=True,safe=safe)
    cv.line([(96,317),(984,317)],C['line'],2)
    if scene.get('eyebrow'): cv.text(96,352,scene['eyebrow'],36,C['accent'],max_width=888,safe=safe)
    for i,line in enumerate(scene['headingLines']): cv.text(96,456+i*112,line,96,bold=True,max_width=888,safe=safe)
    for i,line in enumerate(scene['bodyLines']): cv.text(96,724+i*62,line,48,max_width=888,safe=safe)
    checks=sum(local >= s for s in [.5,.9,1.3]) if scene['id']=='review' else 3
    graphic(cv,scene['graphic'],96,968,888,330,p,checks,scene['id']=='close')
    for i,label in enumerate(['Planejar','Produzir','Revisar']):
        active=scene['id']==['plan','produce','review'][i]
        xx=96+i*296
        cv.line([(xx,1360),(xx+264,1360)],C['accent'] if active else C['line'],4)
        cv.text(xx,1392,label,36,C['accent'] if active else C['muted'],bold=active,safe=safe)
    cv.text(96,1490,'UM PROJETO. TRÊS DECISÕES.',30,C['muted'],safe=safe)
    return cv.image


def reel(out, ffmpeg):
    cmd=[ffmpeg,'-hide_banner','-loglevel','error','-f','rawvideo','-pixel_format','rgb24','-video_size','1080x1920','-framerate','30','-i','pipe:0','-i',str(out/'lume-sound.wav'),'-frames:v','540','-c:v','libx264','-preset','veryfast','-crf','19','-threads','4','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(out/'lume-reel.mp4')]
    log=(out/'encode.log').open('wb')
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=log)
    timer=threading.Timer(180,proc.kill); timer.start()
    cached_key=None; cached=None
    try:
        for index in range(540):
            t=index/30; scene=next(s for s in PLAN['reel']['timeline'] if s['start'] <= t < s['end'])
            settled=t-scene['start'] >= (1.4 if scene['id']=='review' else .6)
            key=(scene['id'],'hold' if settled else index)
            if key!=cached_key:
                cached=frame(index,record=(index in [0,90,210,330,450])).tobytes(); cached_key=key
            proc.stdin.write(cached)
        proc.stdin.close()
        code=proc.wait(timeout=180)
        if code: raise RuntimeError(f'ffmpeg encode exit={code}; inspect {out / "encode.log"}')
    finally:
        timer.cancel(); log.close()
        if proc.poll() is None: proc.kill(); proc.wait()


def verify(out, ffmpeg, ffprobe):
    master=out/'lume-reel.mp4'
    probe=json.loads(run([ffprobe,'-v','error','-show_streams','-show_format','-of','json',str(master)]))
    video=next(s for s in probe['streams'] if s['codec_type']=='video')
    aud=next(s for s in probe['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'],video['nb_frames'],video['r_frame_rate'],video['codec_name'],video['pix_fmt'])==(1080,1920,'540','30/1','h264','yuv420p')
    assert abs(float(probe['format']['duration'])-18)<.04
    assert aud['codec_name']=='aac' and aud['channels']==2 and aud['sample_rate']=='48000'
    run([ffmpeg,'-v','error','-i',str(master),'-f','null','-'])
    run([ffmpeg,'-v','error','-i',str(out/'lume-sound.wav'),'-ac','1','-ar','8000','-c:a','libmp3lame','-b:a','8k',str(out/'review-audio.mp3')])
    mp3=json.loads(run([ffprobe,'-v','error','-show_streams','-show_format','-of','json',str(out/'review-audio.mp3')]))
    assert abs(float(mp3['format']['duration'])-18)<.25
    times=[0,1.5,89/30,3,3.5,5,209/30,7,7.5,9,329/30,11,11.5,13,449/30,15,15.5,17.5]
    frames=[]
    for i,t in enumerate(times):
        path=out/f'reel-frame-{i:02d}.png'
        run([ffmpeg,'-v','error','-ss',str(t),'-i',str(master),'-frames:v','1',str(path)])
        frames.append({'path':str(path.relative_to(ROOT)).replace('\\','/'),'second':t,'sha256':sha(path)})
    thumbs=[]
    for item in frames:
        with Image.open(ROOT/item['path']) as im: thumbs.append(im.resize((216,384),Image.Resampling.LANCZOS))
    contact=Image.new('RGB',(6*232+16,3*418+16),C['paper']); dc=ImageDraw.Draw(contact)
    for i,im in enumerate(thumbs):
        x=16+(i%6)*232; y=16+(i//6)*418; contact.paste(im,(x,y))
        dc.text((x,y+389),f'{times[i]:05.2f}s',font=font(19),fill=C['ink'])
    contact.save(out/'reel-contact.png')
    with Image.open(out/'reel-frame-16.png') as im: im.resize((390,693),Image.Resampling.LANCZOS).save(out/'reel-mobile-390.png')
    decoded=run([ffmpeg,'-v','error','-i',str(master),'-map','0:a:0','-f','f32le','-acodec','pcm_f32le','pipe:1']) if False else subprocess.run([ffmpeg,'-v','error','-i',str(master),'-map','0:a:0','-f','f32le','-acodec','pcm_f32le','pipe:1'],capture_output=True,timeout=180,check=True).stdout
    values=array.array('f'); values.frombytes(decoded)
    if sys.byteorder!='little': values.byteswap()
    metrics={'encodedRms':math.sqrt(sum(v*v for v in values)/len(values)),'encodedPeak':max(abs(v) for v in values),'sampleCount':len(values),'clippedSamples':sum(abs(v)>=1 for v in values)}
    assert metrics['encodedRms']>.005 and metrics['encodedPeak']<.9 and metrics['clippedSamples']==0
    for path in out.glob('*.png'):
        with Image.open(path) as im: im.verify()
    return probe,mp3,frames,metrics


def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--attempt',type=int,default=1); args=parser.parse_args()
    if not 1<=args.attempt<=3: raise ValueError('Maximum three creation/check/correction cycles')
    out=HERE.parent/'output'/'media'/f'attempt-{args.attempt:03d}'
    out.mkdir(parents=True,exist_ok=False)
    start=time.monotonic(); ffmpeg=shutil.which('ffmpeg'); ffprobe=shutil.which('ffprobe')
    if not ffmpeg or not ffprobe: raise RuntimeError('Native ffmpeg and ffprobe required; no installation fallback')
    if not REGULAR.is_file() or not BOLD.is_file(): raise RuntimeError('Canonical Windows fonts unavailable')
    receipt={'schemaVersion':1,'creationAttempt':args.attempt,'status':'running','failuresAndSkips':[],'observedPixels':'pending actual image inspection','observedAudioOrNotObserved':'not_observed','independentReviewer':'pending','timeline':PLAN['reel']['timeline']}
    try:
        carousel(out); receipt['audio']=audio(out); reel(out,ffmpeg)
        probe,mp3,frames,metrics=verify(out,ffmpeg,ffprobe)
        receipt.update({'status':'technical-pass-pending-independent-review','masterProbe':probe,'reviewAudioProbe':mp3,'sampledFramePaths':frames,'fullDecodeResult':'exit 0; entire video and audio decoded','textBounds':BOUNDS,'preview390Paths':['carousel-mobile-390.png','reel-mobile-390.png'],'actualToolVersions':{'python':sys.version,'pillow':PIL.__version__,'ffmpeg':run([ffmpeg,'-version']).splitlines()[0],'ffprobe':run([ffprobe,'-version']).splitlines()[0]},'actualFontPathAndSha256':[{'path':str(p),'sha256':sha(p)} for p in (REGULAR,BOLD)],'briefSha256':sha(ROOT/PLAN['brief']),'sourceSha256':[{'path':str(p.relative_to(ROOT)).replace('\\','/'),'sha256':sha(p)} for p in sorted(HERE.rglob('*')) if p.is_file() and '__pycache__' not in str(p)],'outputPathAndSha256':[{'path':str(p.relative_to(ROOT)).replace('\\','/'),'sha256':sha(p),'bytes':p.stat().st_size} for p in sorted(out.iterdir()) if p.is_file()],'dimensions':{'carousel':[1080,1350],'reel':[1080,1920]},'duration':18,'fps':30,'frameCount':540})
        receipt['audio'].update(metrics)
    except Exception as error:
        receipt['status']='failed'; receipt['failuresAndSkips'].append(str(error)); raise
    finally:
        receipt['elapsedSeconds']=round(time.monotonic()-start,3)
        (out/'receipt.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2),encoding='utf-8')
        print(json.dumps({'status':receipt['status'],'output':str(out),'elapsedSeconds':receipt['elapsedSeconds'],'failures':receipt['failuresAndSkips']},ensure_ascii=False))


if __name__=='__main__': main()
