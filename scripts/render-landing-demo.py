"""Reproducible 15s product-concept film. Pillow + imageio-ffmpeg; no private account data."""
import sys, math, subprocess
from pathlib import Path
from functools import lru_cache
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/videos'; W,H=1600,900; FPS=30; SCALE=2.4
ENCODE_W,ENCODE_H=3840,2160
ORANGE='#FF7043'; INK='#292D29'; PEACH='#FFF3ED'; LINE='#E4E6E8'
@lru_cache(None)
def font(n,b=False): return ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial'+(' Bold' if b else '')+'.ttf',round(n*SCALE))
def ease(v):
 v=max(0,min(1,v));return v*v*(3-2*v)
def lerp(a,b,v):return a+(b-a)*v
icon=Image.open(ROOT/'public/patches-icon-orange.png').convert('RGBA')
gmail_header=Image.open(ROOT/'scripts/assets/gmail-header.png').convert('RGB')
gmail_nav=Image.open(ROOT/'scripts/assets/gmail-navigation.png').convert('RGB')
@lru_cache(None)
def sized_icon(s):return icon.resize((round(s*SCALE),round(s*SCALE)),Image.Resampling.LANCZOS)
class HiResImage:
 def __init__(self,mode,size,color=None):
  self.width,self.height=size;self.raw=Image.new(mode,(round(size[0]*SCALE),round(size[1]*SCALE)),color)
 def paste(self,other,xy,mask=None):
  self.raw.paste(other.raw if isinstance(other,HiResImage) else other,tuple(round(v*SCALE) for v in xy),mask.raw if isinstance(mask,HiResImage) else mask)
 def getchannel(self,c):return self.raw.getchannel(c)
 def putalpha(self,a):self.raw.putalpha(a)
 def save(self,*args,**kwargs):return self.raw.save(*args,**kwargs)
 def tobytes(self):return self.raw.tobytes()
def blend(a,b,alpha):
 c=HiResImage('RGB',(a.width,a.height));c.raw=Image.blend(a.raw,b.raw,alpha);return c
class ScaledDraw:
 def __init__(self,im):self.raw=ImageDraw.Draw(im.raw)
 def coords(self,r):return tuple(round(v*SCALE) for v in r)
 def rounded_rectangle(self,r,radius,fill=None,outline=None,width=1):self.raw.rounded_rectangle(self.coords(r),round(radius*SCALE),fill=fill,outline=outline,width=max(1,round(width*SCALE)))
 def text(self,xy,s,**kw):self.raw.text(self.coords(xy),s,**kw)
 def textlength(self,s,**kw):return self.raw.textlength(s,**kw)/SCALE
 def line(self,r,fill=None,width=1):
  pts=[self.coords(pt) for pt in r] if isinstance(r[0],tuple) else self.coords(r)
  self.raw.line(pts,fill=fill,width=max(1,round(width*SCALE)),joint='curve')
 def ellipse(self,r,fill=None,outline=None,width=1):self.raw.ellipse(self.coords(r),fill=fill,outline=outline,width=max(1,round(width*SCALE)))
 def polygon(self,pts,fill=None,outline=None):self.raw.polygon([self.coords(pt) for pt in pts],fill=fill,outline=outline)
@lru_cache(None)
def unicodefont(n):return ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Unicode.ttf',round(n*SCALE))
class Painter:
 def __init__(self,im):self.im=im;self.d=ScaledDraw(im)
 def box(self,r,c='white',radius=8,line=None):
  if r[2]>r[0] and r[3]>r[1]:self.d.rounded_rectangle(tuple(map(int,r)),radius,fill=c,outline=line,width=1)
 def text(self,x,y,s,n=18,c=INK,b=False):self.d.text((round(x),round(y)),s,font=(unicodefont(n) if any(ord(ch)>127 for ch in s) else font(n,b)),fill=c)
 def wrap(self,x,y,s,w,n=18,c=INK,b=False,leading=1.45):
  line=''
  for word in s.split():
   test=(line+' '+word).strip()
   if self.d.textlength(test,font=font(n,b))>w and line:self.text(x,y,line,n,c,b);y+=n*leading;line=word
   else:line=test
  if line:self.text(x,y,line,n,c,b)
  return y+n*leading
 def mark(self,x,y,s=28):self.im.paste(sized_icon(s),(int(x),int(y)),sized_icon(s))
 def rule(self,x,y,r,c=LINE):self.d.line((int(x),int(y),int(r),int(y)),fill=c,width=1)
 def ui_icon(self,name,x,y,size,c):
  def ln(points):self.d.line([(x+a*size,y+b*size) for a,b in points],fill=c,width=1.6)
  def rect(a,b,cc,dd,r=1):self.box((x+a*size,y+b*size,x+cc*size,y+dd*size),None,r,c)
  def el(a,b,cc,dd):self.d.ellipse((x+a*size,y+b*size,x+cc*size,y+dd*size),outline=c,width=1.5)
  if name=='pin':ln([(.2,.05),(.8,.05),(.67,.3),(.67,.55),(.9,.7),(.1,.7),(.33,.55),(.33,.3),(.2,.05)]);ln([(.5,.7),(.5,1)]);ln([(.05,0),(.95,1)])
  elif name=='account':el(.32,.03,.68,.4);ln([(.1,.95),(.15,.63),(.4,.48),(.6,.48),(.85,.63),(.9,.95),(.1,.95)])
  elif name=='dashboard':el(.05,.05,.95,.95);ln([(.5,.5),(.8,.25)])
  elif name=='book':rect(.08,.1,.87,.9);ln([(.22,.1),(.22,.9)]);ln([(.35,.32),(.72,.32)]);ln([(.35,.5),(.72,.5)])
  elif name=='people':el(.15,.05,.45,.38);el(.58,.05,.88,.38);ln([(.02,.9),(.08,.55),(.5,.5),(.52,.9)]);ln([(.55,.5),(.95,.55),(.98,.9)])
  elif name=='calendar':rect(.06,.18,.94,.95);ln([(.06,.4),(.94,.4)]);ln([(.25,.02),(.25,.3)]);ln([(.75,.02),(.75,.3)])
  elif name=='inbox':ln([(.02,.55),(.18,.15),(.82,.15),(.98,.55),(.98,.9),(.02,.9),(.02,.55),(.3,.55),(.4,.7),(.6,.7),(.7,.55),(.98,.55)])
  elif name=='clock':el(.04,.04,.96,.96);ln([(.5,.2),(.5,.52),(.74,.67)])
  elif name=='help':el(.04,.04,.96,.96);self.text(x+size*.32,y-size*.05,'?',round(size*.8),c)
  elif name=='search':el(.05,.03,.72,.7);ln([(.65,.65),(.98,.98)])
  elif name=='settings':el(.25,.25,.75,.75);el(.05,.05,.95,.95);ln([(.5,0),(.5,.2)]);ln([(.5,.8),(.5,1)]);ln([(0,.5),(.2,.5)]);ln([(.8,.5),(1,.5)])
  elif name=='star':
   pts=[]
   for i in range(11):
    a=-math.pi/2+i*math.pi/5;r=.48 if i%2==0 else .21;pts.append((.5+math.cos(a)*r,.5+math.sin(a)*r))
   ln(pts)
  elif name=='send':ln([(.03,.02),(.98,.5),(.03,.98),(.18,.5),(.03,.02)]);ln([(.18,.5),(.98,.5)])
  elif name=='file':ln([(.17,.03),(.6,.03),(.86,.3),(.86,.97),(.17,.97),(.17,.03)]);ln([(.6,.03),(.6,.3),(.86,.3)])
  elif name=='pencil':ln([(.03,.97),(.18,.57),(.72,.03),(.97,.28),(.43,.82),(.03,.97)]);ln([(.18,.57),(.43,.82)])
  elif name=='back':ln([(.45,.08),(.04,.5),(.45,.92)]);ln([(.04,.5),(.98,.5)])
  elif name=='archive':rect(.04,.05,.96,.27);rect(.13,.3,.87,.93);ln([(.35,.48),(.65,.48)])
  elif name=='trash':ln([(.1,.2),(.9,.2)]);ln([(.3,.2),(.3,.03),(.7,.03),(.7,.2)]);ln([(.2,.2),(.25,.98),(.75,.98),(.8,.2)]);ln([(.42,.38),(.42,.8)]);ln([(.61,.38),(.61,.8)])
  else:ln([(.2,.3),(.5,.6),(.8,.3)])
def canvas(p,w,a):
 p.box((0,0,w,628),'white',0)
 p.box((0,0,72,628),'#142774',0)
 p.text(20,15,'C',31,'#FFC72C',True)
 for i,label in enumerate(['Account','Dashboard','Courses','Groups','Calendar','Inbox','History','Help']):
  y=78+i*61
  if i==2:p.box((0,y-6,72,y+49),'white',0)
  c='#142774' if i==2 else 'white'
  p.ui_icon(['account','dashboard','book','people','calendar','inbox','clock','help'][i],25,y,20,c);p.text(7,y+25,label,10,c)
 p.text(96,23,'≡',21,'#1F5AA6');p.text(133,26,'BUS 101  >  Assignments  >  Business Foundation Analysis',15,'#1F5AA6')
 p.rule(93,63,w-18)
 p.text(95,83,'Fall 2026',10,'#777777')
 for i,label in enumerate(['Home','Syllabus','Study Materials','Assignments','Announcements','People','Grades','Zoom']):
  y=115+i*34
  if i==3:p.d.line((92,y-4,92,y+22),fill=INK,width=3)
  p.text(101,y,label,12,INK if i==3 else '#1C5DAA',i==3)
 x=252; cw=w-x-24
 p.text(x,88,'Business Foundation Analysis #3',24,INK,True)
 if cw>750:p.box((w-170,83,w-28,120),'#2056A9',3);p.text(w-157,95,'Start Assignment',13,'white')
 p.rule(x,137,w-24);p.text(x,151,'Due  Tuesday at 11:59pm    Points  20    Submitting  a file upload',12)
 p.rule(x,182,w-24)
 # The rubric moves from below the instructions into the right-hand workspace.
 iw=lerp(min(cw,690),cw*.60,a);rx=lerp(x,x+iw+20,a);ry=lerp(630,201,a);rw=lerp(min(cw,690),cw-iw-20,a)
 p.box((x,201,x+iw,lerp(600,480,a)),'white',3,'#CDD1D5')
 p.text(x+16,220,'Assignment instructions',17,INK,True)
 y=p.wrap(x+16,256,'Read the case and explain how the company should balance growth, customer trust, and responsible innovation.',iw-32,14)
 y=p.wrap(x+16,y+16,'Write an analysis of up to 500 words. Use concepts from class and support your recommendation with specific evidence.',iw-32,14)
 p.text(x+16,y+20,'Your response should include:',14,INK,True)
 yy=y+51
 for label in ['A clear recommendation','Evidence from the case','Trade-offs and alternatives','Citations for your sources']:
  p.text(x+18,yy,'•  '+label,13);yy+=25
 if a<.8:
  p.rule(x+16,yy+9,x+iw-16);p.text(x+16,yy+24,'Additional instructions',13,'#B33D2D',True)
  p.wrap(x+16,yy+49,'Upload a PDF below. Review the grading rubric before submitting your final response.',iw-32,13)
 p.box((rx,ry,rx+rw,ry+278),'white',3,'#B8C9B8' if a else LINE)
 p.text(rx+13,ry+14,'Grading rubric',17,INK,True);p.rule(rx,ry+47,rx+rw)
 for i,(label,points) in enumerate([('Analysis','8 pts'),('Evidence','6 pts'),('Recommendation','4 pts'),('Clarity & citations','2 pts')]):
  yy=ry+63+i*49;p.text(rx+13,yy,label,12,INK,True);p.text(rx+rw-50,yy,points,11,'#59646B');p.rule(rx,yy+34,rx+rw)
 p.text(rx+13,ry+254,'Total: 20 points',12,'#4A6351',True)
 sy=lerp(955,501,a)
 p.box((x,sy,w-24,sy+100),'#FAFBFC',4,'#CDD1D5');p.text(x+15,sy+12,'Submit assignment',15,INK,True)
 p.box((x+15,sy+43,x+iw-15,sy+84),'white',4,'#BEC5CC');p.text(x+29,sy+56,'↑   analysis-draft.pdf',12,'#4C5965')
 p.box((w-156,sy+46,w-39,sy+83),'#2056A9',3);p.text(w-143,sy+58,'Submit assignment',11,'white')

def gmail(p,w,a):
 p.box((0,0,w,628),'#F6F8FC',0)
 p.text(22,22,'≡',24,'#4E5559')
 # Gmail's recognizable multicolour M.
 for points,c in [([(84,51),(84,24),(103,39)],'#4285F4'), ([(84,24),(103,39),(123,24)],'#EA4335'), ([(123,24),(123,51)],'#34A853')]:p.d.line(points,fill=c,width=7)
 p.text(137,21,'Gmail',25,'#4A4D50')
 p.box((300,10,w-188,64),'#E9EEF6',25);p.ui_icon('search',322,27,20,'#5D6267');p.text(360,29,'Search mail',17,'#5D6267')
 p.ui_icon('help',w-158,28,19,'#60666C');p.ui_icon('settings',w-118,28,20,'#60666C');p.d.ellipse((w-54,18,w-18,54),fill='#A946B6');p.text(w-44,25,'A',20,'white')
 p.box((83,85,233,143),'#C2E7FF',16);p.ui_icon('pencil',103,102,20,'#173142');p.text(133,104,'Compose',16,'#173142')
 for i,label in enumerate(['Inbox','Starred','Snoozed','Sent','Drafts','More']):
  y=166+i*39
  if not i:p.box((75,y-8,263,y+25),'#D3E3FD',18)
  p.ui_icon(['inbox','star','clock','send','file','chevron'][i],96,y,18,'#42474D');p.text(125,y,label,15,'#283139',not i)
 p.text(91,432,'Labels                 +',16,'#495259')
 # Actual Gmail chrome from the supplied reference, with fictional message content below.
 header_w=w
 p.im.paste(gmail_header.resize((round(header_w*SCALE),round(60*SCALE)),Image.Resampling.LANCZOS),(0,0))
 p.box((w-160,0,w,63),'#F6F8FC',0);p.d.ellipse((w-54,18,w-18,54),fill='#A946B6');p.text(w-44,25,'A',20,'white')
 p.box((0,60,w,82),'#F6F8FC',0)
 p.box((0,415,284,628),'#F6F8FC',0)
 p.im.paste(gmail_nav.resize((round(284*SCALE),round(352*SCALE)),Image.Resampling.LANCZOS),(0,63))
 p.box((284,82,w-47,628),'white',16)
 p.ui_icon('back',308,101,18,'#62666A');p.ui_icon('archive',352,101,18,'#62666A');p.ui_icon('help',396,101,18,'#62666A');p.ui_icon('trash',440,101,18,'#62666A');p.text(487,99,'⋮',20,'#62666A');p.text(316,148,'Project launch · final details',24,'#202124')
 p.box((651,150,700,173),'#E9EAED',4);p.text(658,155,'Inbox',10,'#5E6266')
 mainx=316;avail=w-395;split=lerp(avail,avail*.57,a)
 # Messages stay familiar as the workspace is reorganized.
 for i,(name,summary) in enumerate([('Alex Morgan','Please use the revised brief and send the draft by Friday at 3pm.'),('Jamie Lee','I’ve attached the latest launch brief for reference.'),('Alex Morgan','Can you confirm the timeline and the final deliverables?')]):
  y=202+i*77
  p.d.ellipse((mainx,y,mainx+30,y+30),fill=['#E8D5C4','#D3E3FD','#E8D5C4'][i]);p.text(mainx+9,y+7,name[0],13,'#75685E')
  p.text(mainx+43,y,name,14,'#202124',True);p.text(mainx+43,y+23,'to me',10,'#72777D')
  if split>500:p.wrap(mainx+43,y+43,summary,split-70,12,'#5F6368')
  else:p.text(mainx+43,y+45,['Revised brief · Friday, 3pm','launch-brief.pdf','Final deliverables'][i],11,'#5F6368')
  p.rule(mainx,y+71,mainx+split)
  if a>.3:p.box((mainx+split-50,y-1,mainx+split-4,y+25),PEACH,5,'#F0B99D');p.text(mainx+split-42,y+5,'Pin',11,'#BE542D',True)
 p.box((mainx+40,455,mainx+split,601),'white',12,'#DADCE0');p.ui_icon('back',mainx+56,469,17,'#5F6368');p.text(mainx+81,469,'Alex Morgan',13,'#5F6368')
 p.wrap(mainx+57,503,'Thanks, Alex. I’ll use the revised brief and send the draft by Friday at 3pm.',split-77,14)
 p.box((mainx+56,558,mainx+145,590),'#0B57D0',18);p.text(mainx+79,567,'Send',13,'white',True)
 if a>.01:
  rx=mainx+split+22
  p.box((rx,200,w-69,601),'#FFF8F3',10,'#F0C8B3')
  p.mark(rx+14,214,22);p.text(rx+43,218,'Pinned messages',15,INK,True)
  yy=p.wrap(rx+16,266,'Alex Morgan',w-rx-101,13,INK,True)
  yy=p.wrap(rx+16,yy+8,'Please use the revised brief and send the draft by Friday at 3pm.',w-rx-101,14)
  p.rule(rx+15,yy+16,w-85)
  p.text(rx+16,yy+35,'Jamie Lee',13,INK,True);p.wrap(rx+16,yy+62,'Latest launch brief attached.',w-rx-101,13)
  p.box((rx+14,yy+110,w-83,yy+151),'white',6,'#E6D8CF');p.ui_icon('file',rx+25,yy+121,15,'#6E6055');p.text(rx+48,yy+123,'launch-brief.pdf',11,'#6E6055')
 for i,s in enumerate(['▦','◉','✓']):p.text(w-31,103+i*59,s,18,['#4285F4','#F4B400','#4285F4'][i])
PROMPTS=["Keep the assignment instructions, grading rubric, and submission area visible together so I don't have to constantly scroll between them.","Let me pin important messages inside email threads and keep them visible while I write replies."]
def sidebar(p,x,u,kind):
 p.box((x,0,x+410,628),'#523A29',0);p.mark(x+15,13,24);p.text(x+49,14,'Patches',21,'#F5E4D8',True);p.ui_icon('pin',x+337,18,18,'#D4C1B3');p.text(x+373,14,'×',25,'#D4C1B3')
 p.box((x+10,51,x+400,617),'white',12)
 p.mark(x+25,69,30);p.text(x+67,66,'Patches',20,'#332820',True);p.text(x+67,94,'canvas.example' if kind==0 else 'mail.google.com',12,'#8E796D')
 p.box((x+280,71,x+385,101),PEACH,15,'#FFC6B3');p.d.ellipse((x+290,82,x+298,90),fill='#2E8151');p.text(x+304,80,'demo@...',11,'#77665D');p.rule(x+10,126,x+400,'#FFD0BE')
 p.box((x+24,143,x+326,301),PEACH,8,'#FFC6B3');p.box((x+336,143,x+385,301),'#F45B2B',8);p.text(x+347,207,'→',31,'white')
 typed=PROMPTS[kind][:int(len(PROMPTS[kind])*max(0,min(1,(u-1.0)/2.0)))]
 p.wrap(x+37,156,typed+('|' if u<3.2 else ''),276,18,'#887367',leading=1.5)
 for i,label in enumerate(['hide sidebar','larger text','hide footer']):
  xx=x+24+i*122;p.box((xx,315,xx+114,346),PEACH,16,'#FFC6B3');p.text(xx+10,324,label,11,'#776358')
 p.rule(x+10,364,x+400,'#FFD0BE');p.text(x+24,383,'SAVED PATCHES',13,'#89766A',True);p.text(x+311,383,'Reset site',12,'#89766A')
 if u>=3.6:
  p.box((x+24,404,x+385,465),PEACH,8,'#F0C3AC');p.wrap(x+36,416,'Assignment workspace' if kind==0 else 'Pinned thread messages',260,14,'#6C4C3A',True)
  p.box((x+333,423,x+371,445),'#FFE9DD',12,'#FF7043');p.d.ellipse((x+351,426,x+367,442),fill='#F45B2B')
  p.text(x+26,485,'Patch applied and saved',12,'#A84C2B')
 elif u>3.1:p.text(x+27,422,'Creating your patch…',14,'#A84C2B')
 else:p.text(x+70,503,'No patches for this site yet.',13,'#968075')
 p.box((x+24,560,x+385,600),'white',6,'#FFC6B3');p.text(x+36,574,'Patches on this page',13,'#776358');p.box((x+331,570,x+371,591),'#FFE9DD',12,'#F45B2B');p.d.ellipse((x+351,573,x+367,589),fill='#F45B2B')
def render(t):
 if t>=13:
  e=ease((t-13)/.55);base=HiResImage('RGB',(W,H),'white');orange=HiResImage('RGB',(W,H),ORANGE);im=blend(base,orange,e);p=Painter(im)
  logo=HiResImage('RGBA',(W,H));lp=Painter(logo);lp.mark(478,357,130);lp.text(630,378,'PATCHES',71,'white',True);lp.text(595,509,'Make Every Website Work Your Way.',21,'white');white=Image.new('RGBA',(round(130*SCALE),round(130*SCALE)),'white');white.putalpha(sized_icon(130).getchannel('A'));logo.paste(white,(478,357),white)
  alpha=ease((t-13)/.35)*(1-ease((t-14.15)/.7));logo.putalpha(logo.getchannel('A').point(lambda x:int(x*alpha)));im.paste(logo,(0,0),logo);return im
 kind=0 if t<6.5 else 1;u=t if kind==0 else t-6.5
 im=HiResImage('RGB',(W,H),'#FFFCFA');p=Painter(im)
 p.mark(47,32,32);p.text(91,36,'PATCHES',24,INK,True);p.text(47,87,'Everything you need. Together.' if kind==0 else 'Keep the important parts in view.',30,INK,True)
 p.text(1315,44,'01 / CANVAS' if kind==0 else '02 / GMAIL',15,'#9A5F43',True)
 p.box((40,143,1560,819),'white',16,'#DCD8D5')
 for i in range(3):p.d.ellipse((58+i*17,161,65+i*17,168),fill='#CABEB5')
 p.box((150,151,1390,178),'#F5F4F3',6);p.text(173,157,'canvas.example/courses/101/assignments/3' if kind==0 else 'mail.google.com/mail/u/0/#inbox/sample-thread',11,'#81776F');p.mark(1519,151,26)
 opened=ease((u-.45)/.48)*(1-ease((u-4.05)/.48));sw=int(410*opened)
 a=ease((u-3.35)/.85)
 page=HiResImage('RGB',(1518-sw,628),'white');pp=Painter(page)
 if kind==0:canvas(pp,page.width,a)
 else:gmail(pp,page.width,a)
 im.paste(page,(41,187))
 if sw:
  layer=HiResImage('RGB',(410,628),'white');sidebar(Painter(layer),0,u,kind);im.paste(layer,(1560-sw,187))
 # cursor enters, submits, then points at the organized result
 if .25<u<4.1:
  xx=lerp(1532,1518,ease((u-.2)/.2));yy=lerp(168,390,ease((u-2.8)/.4))
  if u>3.1:xx=1518;yy=390
  p.d.polygon([(int(xx),int(yy)),(int(xx+4),int(yy+21)),(int(xx+10),int(yy+14)),(int(xx+20),int(yy+13))],fill='#292D29',outline='white')
  if 3.15<u<3.5:
   r=8+30*(u-3.15)/.35;p.d.ellipse((xx-r,yy-r,xx+r,yy+r),outline=ORANGE,width=2)
 if a>.95:
  p.box((1130,91,1527,133),'#FFF1E7',9,'#FFC2A5');p.text(1145,104,'✓  Workspace saved' if kind==0 else '✓  Pinned beside your reply',16,'#9F472A',True)
 phase='Open Patches' if u<1 else 'Describe your change' if u<3.25 else 'Apply your patch' if u<4.5 else ('Instructions + rubric + submission' if kind==0 else 'Pinned messages + reply composer')
 p.text(48,850,phase,17,'#9C4B2D',True);p.text(1210,854,'ILLUSTRATIVE DEMO · SAMPLE DATA',10,'#9B8D83')
 # quick crossfade to next scene
 if kind==1 and u<.2:im=blend(HiResImage('RGB',(W,H),'#FFFCFA'),im,ease(u/.2))
 return im
if __name__=='__main__':
 OUT.mkdir(parents=True,exist_ok=True)
 cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-s',f'{ENCODE_W}x{ENCODE_H}','-pix_fmt','rgb24','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','14','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'patches-landing-demo-4k.mp4')]
 proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=subprocess.PIPE)
 for f in range(15*FPS):
  proc.stdin.write(render(f/FPS).tobytes())
  if f%90==0:print(f'Rendered {f}/{15*FPS} frames',flush=True)
 proc.stdin.close();err=proc.stderr.read();code=proc.wait()
 if code:raise RuntimeError(err.decode())
 for name,t in [('canvas',5.4),('sidebar',2.9),('gmail',11.9),('ending',13.8)]:render(t).save(OUT/f'patches-demo-{name}.png')
 render(5.4).save(OUT/'patches-landing-demo-poster.png')
 print('Created native 4K 15-second landing demo',flush=True)
