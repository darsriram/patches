"""Rebrand the recorded demo, preserving its pixels, framing and timing.
Requires Pillow, numpy, opencv-python-headless and imageio-ffmpeg.
Run after exports/logos/export.cjs. The original recording remains untouched.
"""
from pathlib import Path
import subprocess
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'public/videos/patches-product-demo-full-frame.mp4'
OUT=ROOT/'public/videos/patchy-product-demo.mp4'
FF=imageio_ffmpeg.get_ffmpeg_exe()
W,H,FPS=2880,1620,30
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
canvas=Image.open(ROOT/'public/videos/patches-product-demo-full-frame-canvas-check.jpg').convert('RGB')
gmail=Image.open(ROOT/'public/videos/patches-product-demo-full-frame-gmail-check.jpg').convert('RGB')
# Each match is limited to its original interface region; addresses are untouched.
specs=[
 ('canvas',canvas,(2241,20,2354,51),(1750,0,2880,70),28,False,'Patchy'),
 ('canvas',canvas,(2258,94,2370,128),(1750,65,2880,175),28,True,'Patchy'),
 ('gmail',gmail,(2317,17,2420,47),(1750,0,2880,65),25,False,'Patchy'),
 ('gmail',gmail,(2330,80,2433,112),(1750,62,2880,170),25,True,'Patchy'),
 ('gmail',gmail,(607,332,724,367),(500,200,1050,1200),27,True,'Patchy'),
]
templates=[]
for clip,img,box,roi,size,bold,label in specs:
 a=np.array(img.crop(box)); templates.append((clip,cv2.cvtColor(a,cv2.COLOR_RGB2GRAY),roi,size,bold,label))

def repaint(im,clip):
 gray=cv2.cvtColor(np.array(im),cv2.COLOR_RGB2GRAY)
 for kind,tpl,roi,size,bold,label in templates:
  if kind!=clip: continue
  x0,y0,x1,y1=roi; search=gray[y0:y1,x0:x1].copy();th,tw=tpl.shape
  for _ in range(4 if roi[0]==500 else 1):
   result=cv2.matchTemplate(search,tpl,cv2.TM_CCOEFF_NORMED)
   _,score,_,loc=cv2.minMaxLoc(result)
   if score<.80: break
   x,y=loc;x+=x0;y+=y0
   patch=np.array(im.crop((x,y,x+tw,y+th)))
   # Median of the perimeter follows the actual white or brown surface.
   perimeter=np.concatenate([patch[:3].reshape(-1,3),patch[-3:].reshape(-1,3),patch[:,:3].reshape(-1,3),patch[:,-3:].reshape(-1,3)])
   bg=tuple(int(v) for v in np.median(perimeter,axis=0))
   d=ImageDraw.Draw(im); d.rectangle((x,y,x+tw,y+th),fill=bg)
   ink=(238,222,210) if sum(bg)<350 else (39,35,32)
   font=ImageFont.truetype(BOLD if bold else FONT,size)
   # Original template includes a small margin around the text.
   d.text((x+4,y+4),label,font=font,fill=ink,anchor='lt')
   lx,ly=loc; search[max(0,ly-th):ly+th*2,max(0,lx-tw):lx+tw*2]=255
 return im

logo=Image.open(ROOT/'exports/logos/patchy-full.png').convert('RGBA')
logo=logo.crop(logo.getchannel('A').getbbox()); logo.thumbnail((1450,450),Image.Resampling.LANCZOS)
white=Image.new('RGBA',logo.size,'white');white.putalpha(logo.getchannel('A'))
base=Image.new('RGB',(W,H),'#FF7043'); closing=base.copy();closing.paste(white,((W-white.width)//2,(H-white.height)//2),white)
reader=subprocess.Popen([FF,'-v','error','-i',str(SOURCE),'-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
writer=subprocess.Popen([FF,'-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-crf','15','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT)],stdin=subprocess.PIPE)
for n in range(660):
 data=reader.stdout.read(W*H*3)
 if len(data)!=W*H*3: raise RuntimeError(f'Unexpected source end at {n}')
 t=n/FPS
 if t>=18.8:
  elapsed=t-18.8; alpha=max(0,min(1,elapsed/.3,(3.2-elapsed)/.35));im=Image.blend(base,closing,alpha)
 else:
  im=repaint(Image.frombytes('RGB',(W,H),data),'canvas' if t<8.4 else 'gmail')
 writer.stdin.write(im.tobytes())
 if n in (90,420,600): im.save(OUT.with_name(OUT.stem+f'-check-{n}.jpg'))
 if n%90==0: print(f'Rebranded {n}/660 frames',flush=True)
reader.stdout.close();reader.wait();writer.stdin.close()
if writer.wait(): raise RuntimeError('Encoding failed')
subprocess.run([FF,'-v','error','-y','-ss','14','-i',str(OUT),'-frames:v','1',str(OUT.with_name('patchy-product-demo-poster.jpg'))],check=True)
print('Saved Patchy demo: 2880×1620, 22 seconds.',flush=True)
