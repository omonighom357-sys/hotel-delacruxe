from pathlib import Path
import subprocess, re, gzip
from html.parser import HTMLParser
root=Path(__file__).resolve().parents[1]
base='807a3c294369ce7d9ca04368891634824505421a'
def original(f): return subprocess.check_output(['git','show',base+':'+f],cwd=root)
for p in (root/'dist/assets').iterdir():
 assert p.read_bytes()==original(str(p.relative_to(root))),p
for name in ['app.js','refinements.js','style.css','experience.css','refinements.css','motion.css']:
 assert (root/'dist'/name).read_bytes()==original('dist/'+name),name
html=(root/'dist/index.html').read_text()
expected=original('dist/index.html').decode().replace('</head>','<link rel="stylesheet" href="typography.css"></head>').replace('</body>','<script src="typography.js"></script></body>')
assert html==expected,'Unexpected HTML/content change'
class References(HTMLParser):
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k in ('src','href') and v and not v.startswith(('#','https:','http:','tel:')):
    assert (root/'dist'/v).exists(),v
References().feed(html)
for f in (root/'dist').glob('*.js'): subprocess.run(['node','--check',str(f)],check=True)
added=b''.join((root/'dist'/f).read_bytes() for f in ['typography.css','typography.js'])
print('PASS: all images, logo, original CSS, booking logic, refinements and HTML content unchanged; all local HTML references exist; all JS parses.')
print('New typography files:',len(added),'bytes raw,',len(gzip.compress(added)),'bytes gzip combined.')
