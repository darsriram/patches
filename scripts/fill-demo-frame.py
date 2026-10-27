"""Remove recording padding and browser edges from both clips."""
import subprocess,sys
from pathlib import Path
import imageio_ffmpeg
src,out=map(Path,sys.argv[1:3]);ff=imageio_ffmpeg.get_ffmpeg_exe()
# Fit each complete interface to the same output canvas, with no white matte.
f='[0:v]split=3[a][b][c];[a]trim=end=8.4,setpts=PTS-STARTPTS,crop=2796:1526:42:47,scale=2880:1620:flags=lanczos,setsar=1[v0];[b]trim=start=8.4:end=18.8,setpts=PTS-STARTPTS,crop=2644:1526:118:47,scale=2880:1620:flags=lanczos,setsar=1[v1];[c]trim=start=18.8:end=22,setpts=PTS-STARTPTS,setsar=1[v2];[v0][v1][v2]concat=n=3:v=1:a=0,fps=30,format=yuv420p[v]'
subprocess.run([ff,'-v','error','-y','-i',str(src),'-filter_complex',f,'-map','[v]','-an','-frames:v','660','-c:v','libx264','-preset','medium','-crf','15','-movflags','+faststart',str(out)],check=True)
for label,t in [('poster',14),('canvas-check',3),('gmail-check',16),('closing-check',20)]:
 subprocess.run([ff,'-v','error','-y','-ss',str(t),'-i',str(out),'-frames:v','1',str(out.with_name(out.stem+'-'+label+'.jpg'))],check=True)
print('Saved edge-to-edge 22-second video.')
