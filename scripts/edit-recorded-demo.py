"""Combine the two supplied recordings with consistent framing and a branded ending.
Usage: python edit-recorded-demo.py canvas.mov gmail.mov branded-demo.mp4 output.mp4
Requires Pillow and imageio-ffmpeg. Removes only the requested diagnostic notice.
"""
import argparse,subprocess,tempfile
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import imageio_ffmpeg
parser=argparse.ArgumentParser();parser.add_argument('canvas');parser.add_argument('gmail');parser.add_argument('ending');parser.add_argument('output');args=parser.parse_args()
ff=imageio_ffmpeg.get_ffmpeg_exe();out=Path(args.output);out.parent.mkdir(parents=True,exist_ok=True)
W,H=2880,1620
# Each segment is cut around the actual interactions; idle model waits are omitted.
segments=[('canvas',.8,17.8,4.0,False),('canvas',21.9,23.4,.8,True),('canvas',25,28.55,1.45,False),('gmail',.7,16.6,3.9,False),('gmail',18.6,23.1,1.65,False),('gmail',24.5,27.8,.7,False),('ending',13,15,2.5,False)]
with tempfile.TemporaryDirectory(prefix='patches-film-') as work:
 work=Path(work)
 mask=Image.new('RGBA',(3024,1652));d=ImageDraw.Draw(mask)
 d.rectangle((2304,387,2990,534),fill='white')
 d.rounded_rectangle((2312,395,2981,526),radius=10,fill='#EDF5EF',outline='#AFCDB8',width=2)
 d.text((2333,413),'Patch applied',font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',23),fill='#34734A')
 d.text((2333,455),'Layout saved for this page.',font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',21),fill='#526B59')
 mask.save(work/'status.png')
 files=[]
 for i,(kind,start,end,duration,clean) in enumerate(segments):
  src=getattr(args,kind);speed=(end-start)/duration;dest=work/f'{i}.mp4'
  command=[ff,'-hide_banner','-loglevel','error','-y','-ss',str(start),'-t',str(end-start),'-i',src]
  crop='crop=3000:1640:12:0' if kind=='canvas' else 'crop=3388:1958:16:250' if kind=='gmail' else 'null'
  # 16:9 output with a matched white frame; preserve the native aspect of each recording.
  sizing=f'{crop},scale=2800:1530:force_original_aspect_ratio=decrease:flags=lanczos,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=white'
  if kind=='ending':sizing=f'scale={W}:{H}:flags=lanczos'
  timing=f'setpts=(PTS-STARTPTS)/{speed:.9f},fps=30,tpad=stop_mode=clone:stop_duration=1,trim=duration={duration},setsar=1,format=yuv420p'
  if clean:
   command+=['-i',str(work/'status.png'),'-filter_complex',f'[0:v][1:v]overlay=0:0:format=auto[clean];[clean]{sizing},{timing}[v]','-map','[v]']
  else:command+=['-vf',sizing+','+timing]
  command+=['-an','-c:v','libx264','-preset','medium','-crf','15','-pix_fmt','yuv420p','-video_track_timescale','30000','-movflags','+faststart',str(dest)]
  subprocess.run(command,check=True);files.append(dest);print(f'Finished segment {i+1}/7: {kind}',flush=True)
 listing=work/'concat.txt';listing.write_text(''.join("file '"+str(f)+"'\n" for f in files))
 subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-frames:v','450','-c','copy','-movflags','+faststart',str(out)],check=True)
 for label,t in [('poster',10.7),('canvas-check',4.35),('gmail-check',11),('closing-check',13.7)]:
  subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss',str(t),'-i',str(out),'-frames:v','1',str(out.with_name(out.stem+'-'+label+'.jpg'))],check=True)
 print('Saved '+str(out),flush=True)
