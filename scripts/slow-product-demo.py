"""Give the recorded walkthrough four more seconds; preserve the branded closing."""
import subprocess,sys
from pathlib import Path
import imageio_ffmpeg
source,output=map(Path,sys.argv[1:3]);ff=imageio_ffmpeg.get_ffmpeg_exe()
filters='[0:v]split=2[a][b];[a]trim=end=11.8,setpts=(PTS-STARTPTS)*15.8/11.8,fps=30,trim=duration=15.8[v0];[b]trim=start=11.8:end=15,setpts=PTS-STARTPTS,fps=30,trim=duration=3.2[v1];[v0][v1]concat=n=2:v=1:a=0,format=yuv420p[v]'
subprocess.run([ff,'-v','error','-y','-i',str(source),'-filter_complex',filters,'-map','[v]','-frames:v','570','-an','-c:v','libx264','-preset','medium','-crf','15','-movflags','+faststart',str(output)],check=True)
subprocess.run([ff,'-v','error','-y','-ss','14','-i',str(output),'-frames:v','1',str(output.with_name(output.stem+'-poster.jpg'))],check=True)
print('Saved 19-second demo.')
