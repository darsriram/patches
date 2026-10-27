"""Track and remove the floating yellow overlay from the first 6.27s only."""
import json,subprocess,sys
from pathlib import Path
import numpy as np
import imageio_ffmpeg
source,output=map(Path,sys.argv[1:3]);ff=imageio_ffmpeg.get_ffmpeg_exe()
p=subprocess.Popen([ff,'-v','error','-i',str(source),'-t','6.267','-vf','scale=720:405','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
groups=[];n=0
while True:
 b=p.stdout.read(720*405*3)
 if len(b)!=720*405*3:break
 a=np.frombuffer(b,np.uint8).reshape(405,720,3);mask=(a[:,:,0]>150)&(a[:,:,1]>160)&(a[:,:,2]<100);mask[:250]=False
 yy,xx=np.where(mask)
 if len(xx)>8:
  box=[int(xx.min()*4),int(yy.min()*4),int(xx.max()*4),int(yy.max()*4)]
  if groups and n==groups[-1][1]+1 and abs(box[0]-groups[-1][2][0])<20:
   g=groups[-1];g[1]=n;g[2]=[min(g[2][0],box[0]),min(g[2][1],box[1]),max(g[2][2],box[2]),max(g[2][3],box[3])]
  else:groups.append([n,n,box])
 n+=1
p.wait();filters=[]
for start,end,(x,y,r,b) in groups:
 pad=32;filters.append(f"drawbox=x={x-pad}:y={y-pad}:w={r-x+pad+20}:h={b-y+2*pad}:color=white:t=fill:enable='between(n,{start},{end})'")
print('Tracked overlay in',len(groups),'motion ranges.',flush=True)
subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i',str(source),'-vf',','.join(filters),'-an','-c:v','libx264','-crf','15','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],check=True)
for name,t in [('canvas-check',2),('result-check',5.5),('poster',10.7)]:
 subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss',str(t),'-i',str(output),'-frames:v','1',str(output.with_name(output.stem+'-'+name+'.jpg'))],check=True)
print('Saved',output)
