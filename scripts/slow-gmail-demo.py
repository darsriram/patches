"""Add three seconds to the Gmail scene without retiming Canvas or the closing."""
import subprocess,sys
from pathlib import Path
import imageio_ffmpeg
source,output=map(Path,sys.argv[1:3]);ff=imageio_ffmpeg.get_ffmpeg_exe()
# Current 19s edit: Canvas 8.4s, Gmail 7.4s, closing 3.2s.
filters='[0:v]split=3[a][b][c];[a]trim=end=8.4,setpts=PTS-STARTPTS,fps=30[v0];[b]trim=start=8.4:end=15.8,setpts=(PTS-STARTPTS)*10.4/7.4,fps=30,tpad=stop_mode=clone:stop_duration=0.1,trim=duration=10.4[v1];[c]trim=start=15.8:end=19,setpts=PTS-STARTPTS,fps=30[v2];[v0][v1][v2]concat=n=3:v=1:a=0,format=yuv420p[v]'
subprocess.run([ff,'-v','error','-y','-i',str(source),'-filter_complex',filters,'-map','[v]','-frames:v','660','-an','-c:v','libx264','-preset','medium','-crf','15','-movflags','+faststart',str(output)],check=True)
subprocess.run([ff,'-v','error','-y','-ss','16','-i',str(output),'-frames:v','1',str(output.with_name(output.stem+'-poster.jpg'))],check=True)
print('Saved 22-second demo with slower Gmail scene.')
