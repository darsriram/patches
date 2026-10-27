"""Match Canvas's native Cancel button to the rounded Gmail extension control."""
import sys,subprocess,tempfile
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont
import imageio_ffmpeg
source,output=map(Path,sys.argv[1:3]);ff=imageio_ffmpeg.get_ffmpeg_exe()
x,y,w,h=2494,420,126,58
read=subprocess.Popen([ff,'-v','error','-i',str(source),'-t','8.4','-vf',f'crop={w}:{h}:{x}:{y}','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
frames=[];n=0
while True:
 b=read.stdout.read(w*h*3)
 if len(b)!=w*h*3:break
 a=np.frombuffer(b,np.uint8).reshape(h,w,3).astype(int)
 gray=(a.max(2)-a.min(2)<18)&(a.mean(2)<190)
 if 4.8<n/30<5.5 and gray.sum()>60:frames.append(n)
 n+=1
read.wait()
if not frames:raise RuntimeError('Cancel state not detected')
print('Cancel frames:',min(frames),max(frames),flush=True)
with tempfile.TemporaryDirectory(prefix='patches-button-') as tmp:
 # Supersample the small overlay so the rounded border and lettering stay sharp.
 s=4;im=Image.new('RGB',(w*s,h*s),(250,238,231));d=ImageDraw.Draw(im)
 d.rounded_rectangle((4*s,2*s,121*s,56*s),radius=27*s,fill='#FCFCFC',outline='#FFB69D',width=2*s)
 f=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',21*s);bb=d.textbbox((0,0),'Cancel',font=f)
 d.text(((w*s-bb[2]+bb[0])/2-bb[0],(h*s-bb[3]+bb[1])/2-bb[1]),'Cancel',font=f,fill='#685B53')
 im=im.resize((w,h),Image.Resampling.LANCZOS);png=Path(tmp)/'cancel.png';im.save(png)
 vf=f"[0:v][1:v]overlay={x}:{y}:enable='between(n,{min(frames)},{max(frames)})':format=auto,format=yuv420p[v]"
 subprocess.run([ff,'-v','error','-y','-i',str(source),'-i',str(png),'-filter_complex',vf,'-map','[v]','-an','-c:v','libx264','-preset','medium','-crf','15','-movflags','+faststart',str(output)],check=True)
 subprocess.run([ff,'-v','error','-y','-ss','5.1','-i',str(output),'-frames:v','1',str(output.with_name(output.stem+'-button-check.jpg'))],check=True)
print('Saved matched Cancel button.')
