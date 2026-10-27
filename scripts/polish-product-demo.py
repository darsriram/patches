"""Restore the original video pixels around the removed widget and add the real logo."""
import sys,subprocess
from pathlib import Path
import numpy as np
from PIL import Image
import imageio_ffmpeg
source,logo_path,output=map(Path,sys.argv[1:4]);ff=imageio_ffmpeg.get_ffmpeg_exe();w,h=2880,1620;fps=30
logo=Image.open(logo_path).convert('RGBA');alpha=logo.getchannel('A');logo=logo.crop(alpha.getbbox());alpha=logo.getchannel('A')
# Use the exact supplied contours and lettering as a reversed white lockup.
white=Image.new('RGBA',logo.size,'white');white.putalpha(alpha);white.thumbnail((1450,450),Image.Resampling.LANCZOS)
card=Image.new('RGB',(w,h),'#FF7043');card.paste(white,((w-white.width)//2,(h-white.height)//2),white)
read=subprocess.Popen([ff,'-v','error','-i',str(source),'-frames:v','354','-vf','fps=30','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
write=subprocess.Popen([ff,'-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{w}x{h}','-r','30','-i','-','-an','-c:v','libx264','-crf','15','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],stdin=subprocess.PIPE)
for n in range(354):
 data=read.stdout.read(w*h*3)
 if len(data)!=w*h*3:raise RuntimeError('Unexpected end of recording')
 if n<189:
  a=np.frombuffer(data,np.uint8).reshape(h,w,3).copy()
  small=a[::4,::4];mask=(small[:,:,0]>150)&(small[:,:,1]>160)&(small[:,:,2]<100);mask[:250]=False
  yy,xx=np.where(mask)
  if len(xx)>8:
   x0=max(0,int(xx.min()*4)-44);x1=min(w,int(xx.max()*4)+60);y0=int(yy.min()*4)-40;y1=min(h,int(yy.max()*4)+44)
   # A column-wise profile preserves the real scrollbar, page edge, and panel border.
   samples=a[max(0,y0-180):max(0,y0-70),x0:x1]
   profile=np.median(samples,axis=0)
   patch=np.broadcast_to(profile,(y1-y0,x1-x0,3))
   feather=8;ys=np.minimum(np.arange(y1-y0),np.arange(y1-y0)[::-1])/feather;xs=np.minimum(np.arange(x1-x0),np.arange(x1-x0)[::-1])/feather
   blend=np.minimum(1,np.minimum(ys[:,None],xs[None,:]))[:,:,None]
   a[y0:y1,x0:x1]=(patch*blend+a[y0:y1,x0:x1]*(1-blend)).astype(np.uint8)
  data=a.tobytes()
 write.stdin.write(data)
 if n%90==0:print(f'Polished {n}/354 recording frames',flush=True)
read.stdout.close();read.wait()
base=Image.new('RGB',(w,h),'#FF7043')
for n in range(96):
 t=n/fps;opacity=min(1,t/.3,(3.2-t)/.35);opacity=max(0,opacity)
 write.stdin.write(Image.blend(base,card,opacity).tobytes())
write.stdin.close()
if write.wait():raise RuntimeError('Export failed')
for label,t in [('canvas-check',2),('result-check',5.5),('poster',10.7),('closing-check',13.2)]:
 subprocess.run([ff,'-v','error','-y','-ss',str(t),'-i',str(output),'-frames:v','1',str(output.with_name(output.stem+'-'+label+'.jpg'))],check=True)
print('Saved polished 15-second demo.',flush=True)
