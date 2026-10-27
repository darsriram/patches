"""Trim recording-stop footage and close with an optically centered wordmark."""
import sys,subprocess,tempfile
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import imageio_ffmpeg
source,output=map(Path,sys.argv[1:3]);ff=imageio_ffmpeg.get_ffmpeg_exe();w,h=2880,1620
with tempfile.TemporaryDirectory(prefix='patches-closing-') as tmp:
 card=Image.new('RGB',(w,h),'black');d=ImageDraw.Draw(card)
 font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',160)
 text='PATCHES';bounds=d.textbbox((0,0),text,font=font)
 d.text(((w-(bounds[2]-bounds[0]))/2-bounds[0],(h-(bounds[3]-bounds[1]))/2-bounds[1]),text,font=font,fill='white')
 png=Path(tmp)/'closing.png';card.save(png)
 # The recording-stop moment begins in the old final Gmail shot. Remove that shot.
 filters='[0:v]trim=end=11.8,setpts=PTS-STARTPTS,fps=30,setsar=1[v0];[1:v]trim=duration=3.2,setpts=PTS-STARTPTS,fps=30,fade=t=in:st=0:d=0.3,fade=t=out:st=2.85:d=0.35,setsar=1[v1];[v0][v1]concat=n=2:v=1:a=0,format=yuv420p[v]'
 subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i',str(source),'-loop','1','-framerate','30','-i',str(png),'-filter_complex',filters,'-map','[v]','-frames:v','450','-an','-c:v','libx264','-preset','medium','-crf','15','-movflags','+faststart',str(output)],check=True)
 for name,t in [('poster',10.7),('closing-check',13.2),('cut-check',11.7)]:
  subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss',str(t),'-i',str(output),'-frames:v','1',str(output.with_name(output.stem+'-'+name+'.jpg'))],check=True)
 print('Saved centered black closing and removed recording-stop shot. Duration: 15 seconds.')
