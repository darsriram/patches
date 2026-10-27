"""Render self-contained illustrative Patches demos. Requires Pillow and imageio-ffmpeg."""
import sys, math, subprocess
from functools import lru_cache
from pathlib import Path
sys.path.insert(0, '/tmp/patches-video-deps')
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/videos'
W,H=1600,900
ORANGE='#FF7043'; INK='#292D29'; MUTED='#887A72'; PEACH='#FFF0E6'; LINE='#EADFD7'
FONT='/System/Library/Fonts/Supplemental/Arial.ttf'
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
@lru_cache(maxsize=64)
def font(n,b=False): return ImageFont.truetype(BOLD if b else FONT,n)
def ease(v): return 1-(1-max(0,min(1,v)))**3
icon=Image.open('/Users/Ram/Desktop/patches-icon.png').convert('RGBA')
def render(kind,t):
 im=Image.new('RGB',(W,H),'#FFFDFC'); d=ImageDraw.Draw(im)
 def box(r,fill='white',radius=14,outline=None):
  if r[2]>r[0] and r[3]>r[1]: d.rounded_rectangle(tuple(map(int,r)),radius,fill=fill,outline=outline,width=1)
 def txt(x,y,s,n=18,c=INK,b=False): d.text((int(x),int(y)),s,font=ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Unicode.ttf",n) if "✓" in s else font(n,b),fill=c)
 def wrap(s,x,y,width,n=18,c=INK,b=False,spacing=1.4):
  line=''
  for word in s.split():
   test=(line+' '+word).strip()
   if d.textlength(test,font=font(n,b))>width and line:
    txt(x,y,line,n,c,b);y+=n*spacing;line=word
   else:line=test
  if line:txt(x,y,line,n,c,b)
  return y+n*spacing
 def mark(x,y,size=28): im.paste(icon.resize((size,size),Image.Resampling.LANCZOS),(int(x),int(y)),icon.resize((size,size),Image.Resampling.LANCZOS))
 configs={
 'amazon':('Amazon','Your carts, your categories','Create Cart 1 and Cart 2 so I can organize products during this session, with a separate total for each.','Two carts. Separate totals. One shopping session.'),
 'netflix':('Netflix','A watchlist that fits your plans','Let me save movies into Weekend, With friends, and Quick watches collections.','Your movies, organized around your plans.'),
 'gmail':('Gmail','Keep follow-ups in sight','Add a button beside emails to save conversations into a separate follow-up panel.','Keep the conversations you need to reply to in view.'),
 'youtube':('YouTube','Just what you came to watch','Hide recommendations, Shorts, and comments. Keep the video, search bar, and my subscriptions.','Less distraction. More of what you came for.')}
 name,title,prompt,result=configs[kind]
 mark(62,38,34);txt(108,41,'PATCHES',23,b=True);txt(62,98,title,39,b=True)
 txt(62,155,'YOUR WEB. YOUR WAY.',13,MUTED)
 # Browser shell
 box((62,204,1538,808),'#F0E5DE',22)
 box((68,207,1532,801),'white',18,LINE)
 for i in range(3):d.ellipse((87+i*18,228,95+i*18,236),fill='#D8C7BC')
 box((170,220,1350,246),'#F8F5F2',6);txt(190,225,name.lower()+'.com  /  sample page',12,MUTED)
 mark(1476,220,23)
 # Panel opening pushes page aside
 opened=ease((t-1.5)/1.1);sw=int(365*opened);right=1512-sw
 patched=ease((t-10.2)/1.4); done=t>=11.6
 if sw:
  box((1532-sw,256,1532,801),PEACH,12)
 # clipped page layer handled via independent drawing region
 page=Image.new('RGB',(max(1,right-84),530),'#FFFFFF');pd=ImageDraw.Draw(page)
 # reuse drawing helpers translated to page via switching canvas
 original_d=d;original_im=im;d=pd;im=page
 pw=page.width
 txt(20,14,name,24,b=True);txt(20,51,'ILLUSTRATIVE WEBSITE · SAMPLE CONTENT',10,MUTED)
 if kind=='amazon':
  txt(20,91,'Find a little something for your space.',24,b=True)
  products=[('Wireless headphones',59,'◉'),('Desk lamp',28,'◒'),('Notebook set',12,'▤')]
  cardw=int((pw-65)/3)
  for i,(label,price,symbol) in enumerate(products):
   x=20+i*(cardw+12);box((x,143,x+cardw,380),'#FFFCF9',12,LINE)
   box((x+12,155,x+cardw-12,265),['#F2DDCB','#E6DED5','#F8E4D6'][i]);txt(x+cardw//2-20,178,['O','/','III'][i],46,'#B47B5B',True)
   wrap(label,x+12,281,cardw-20,15,b=True);txt(x+12,326,f'${price:.2f}',19,b=True)
   if t>11+i*.35:box((x+12,351,x+cardw-12,375),PEACH,5);txt(x+20,355,'Cart '+('1' if i!=1 else '2')+'  ✓',12,'#A8492B',True)
  if patched:
   for i,(label,total) in enumerate([('Cart 1 · Headphones + notebooks','$71.00'),('Cart 2 · Desk lamp','$28.00')]):
    y=405+i*48;box((20,y,pw-20,y+40),PEACH,8);txt(32,y+11,label,13,b=True);txt(pw-110,y+9,total,17,'#A8492B',True)
 elif kind=='netflix':
  txt(20,88,'Your next great watch.',26,b=True)
  cw=int((pw-65)/3)
  for i,title2 in enumerate(['The Last Light','A Sunday Somewhere','Small Wonders']):
   x=20+i*(cw+12);box((x,139,x+cw,348),['#71544C','#B87356','#58554B'][i],10)
   for j in range(4):pd.ellipse((x+20+j*15,165+j*19,x+100+j*15,245+j*19),outline='#DAB89F',width=1)
   wrap(title2,x+14,274,cw-24,20,'white',True)
   if t>11+i*.4:box((x,361,x+cw,397),PEACH,6);txt(x+10,373,['Weekend ✓','With friends ✓','Quick watches ✓'][i],12,'#A8492B',True)
  if patched:
   txt(20,423,'MY WATCH-LATER COLLECTIONS',12,MUTED,True)
   for i,label in enumerate(['Weekend · 1 movie','With friends · 1 movie','Quick watches · 1 movie']):
    x=20+i*(cw+12);box((x,454,x+cw,500),PEACH,8);txt(x+10,470,label,12,b=True)
 elif kind=='gmail':
  txt(20,91,'Inbox',27,b=True)
  split=int(pw-(230*patched)); rows=[('Jordan','Project proposal','Can you share your thoughts before Friday?'),('Morgan','Coffee next week?','Would Tuesday afternoon work for a catch-up?'),('Design team','Feedback on the first draft','The first draft is ready for your feedback.')]
  for i,(sender,subject,body) in enumerate(rows):
   y=150+i*95;box((20,y,split-15,y+82),'#FFFCFA',8,LINE);txt(32,y+12,sender,13,b=True);txt(32,y+33,subject,17,b=True)
   if split>650:txt(32,y+58,body,12,MUTED)
   if patched:box((split-125,y+22,split-26,y+53),PEACH,5);txt(split-116,y+32,'✓ Saved' if i!=1 and t>11.8 else '+ Follow up',11,'#A8492B')
  if patched:
   x=split+3;box((x,142,pw-15,470),PEACH,10);txt(x+14,161,'MY FOLLOW-UPS',12,b=True)
   for j,i in enumerate([0,2]):
    if t>11.8+j*.4:box((x+10,202+j*90,pw-25,275+j*90),'white',7);txt(x+20,215+j*90,rows[i][0],12,b=True);wrap(rows[i][1],x+20,236+j*90,180,13)
 elif kind=='youtube':
  box((160,8,pw-20,48),'#F7F4F1',20,LINE);txt(180,21,'Search videos',13,MUTED)
  nav=110; vw=int((pw-155)*(0.7+0.3*patched));vx=140
  txt(20,103,'Subscriptions',12,b=True)
  for i,label in enumerate(['Design Journal','Science Studio','Everyday Ideas']):txt(20,137+i*32,label,10,MUTED)
  box((vx,88,vx+vw,340),'#3B3530',12);pd.ellipse((vx+vw//2-26,169,vx+vw//2+26,221),outline='#F3D9C5',width=2);pd.polygon([(vx+vw//2-7,182),(vx+vw//2-7,209),(vx+vw//2+14,195)],fill='#F3D9C5')
  txt(vx+15,282,'Ideas worth a closer look',20,'white',True)
  txt(vx,363,'A little room to focus.',22,b=True)
  if patched<.8:
   x=vx+vw+14;txt(x,98,'Recommended',12,b=True)
   for i in range(2):box((x,130+i*85,pw-10,200+i*85),'#ECDDD1',8)
   txt(x,314,'Shorts',13,b=True);box((x,345,pw-10,415),'#F6E9E0',7)
   txt(vx,413,'Comments',15,b=True);txt(vx,445,'Join the conversation…',13,MUTED)
  else:box((vx,416,pw-15,471),PEACH,8);txt(vx+15,435,'Video, search, and subscriptions. Just the essentials.',13,'#A8492B')
 d=original_d;im=original_im;im.paste(page,(84,267))
 # Sidebar remains on top
 if sw:
  sx=1532-sw
  def st(x,y,s,n=14,c=INK,b=False):txt(sx+x,y,s,n,c,b)
  mark(sx+17,269,22);st(47,271,'Patches',17,b=True);st(337,270,'×',19,MUTED)
  box((sx+10,308,sx+355,786),'white',12,LINE)
  mark(sx+25,324,26);st(62,324,'Patches',18,b=True);st(62,349,name.lower()+'.com',12,MUTED)
  d.line((sx+10,379,sx+355,379),fill=LINE,width=1)
  typed=prompt[:int(max(0,min(1,(t-3)/5.7))*len(prompt))]
  box((sx+23,397,sx+293,522),'#FFFAF6',8,LINE)
  wrap(typed+('|' if t<9 and int(t*3)%2==0 else ''),sx+36,411,244,16)
  box((sx+302,397,sx+342,522),ORANGE,8);st(313,443,'→',22,'white',True)
  for i,label in enumerate(['hide sidebar','larger text','hide footer']):
   x=sx+24+i*105;box((x,539,x+98,562),PEACH,12);txt(x+9,545,label,10,MUTED)
  st(24,589,'SAVED PATCHES',12,MUTED,True)
  if t>=9:
   st(24,624,'Applying your patch…' if not done else '✓ Patch applied',17,'#A8492B',True)
   box((sx+24,657,sx+340,662),'#F6E5DA',2)
   box((sx+24,657,sx+24+316*ease((t-9)/2.6),662),ORANGE,2)
  if done:
   box((sx+24,684,sx+340,730),PEACH,7);st(35,699,'Your website preference · Saved',12,b=True)
  elif t<9:st(36,692,'Describe a change to create a patch.',12,MUTED)
  st(25,754,'Patches on this page',12,MUTED);box((sx+301,751,sx+335,770),PEACH,10);d.ellipse((sx+318,754,sx+331,767),fill=ORANGE)
 # Bottom timeline and explanation
 phase=0 if t<2.6 else 1 if t<9 else 2 if t<11.6 else 3
 labels=['Open the sidebar','Describe your change','Apply your patch','Make it yours']
 for i,label in enumerate(labels):
  x=64+i*257;d.ellipse((x,843,x+9,852),fill=ORANGE if i<=phase else '#E6D9CF');txt(x+19,836,label,14,INK if i==phase else MUTED,i==phase)
 txt(1230,844,'ILLUSTRATIVE PRODUCT CONCEPT',10,MUTED)
 if done:
  box((400,165,1200,194),PEACH,10);txt(420,171,result,14,'#A8492B')
 return im

def main():
 OUT.mkdir(parents=True,exist_ok=True)
 for kind in ['amazon','netflix','gmail','youtube']:
  output=OUT/f'patches-{kind}.mp4'
  command=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r','24','-i','-','-an','-vcodec','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(output)]
  process=subprocess.Popen(command,stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
  for frame in range(17*24):process.stdin.write(render(kind,frame/24).tobytes())
  process.stdin.close()
  if process.wait():raise RuntimeError(f'Encoding failed: {kind}')
  render(kind,14).save(OUT/f'patches-{kind}-poster.png')
  print(f'Rendered {output}',flush=True)
if __name__=='__main__':main()
