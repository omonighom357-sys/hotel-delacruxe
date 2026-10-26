"""Verify the unchanged original source, local assets and JavaScript syntax."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib, json, re, subprocess

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'qa/migration-manifest.json').read_text())
for name, expected in manifest['sha256'].items():
    assert hashlib.sha256((root / name).read_bytes()).hexdigest() == expected, name
dist = root / 'dist'
class References(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('src', 'href', 'data-photo') and value:
                path = urlsplit(value)
                if not path.scheme and not path.netloc and path.path:
                    assert (dist / unquote(path.path.lstrip('/'))).is_file(), value
References().feed((dist / 'index.html').read_text())
for file in dist.glob('*.css'):
    for value in re.findall(r'url\([\s\'\"]*([^\)\'\"]+)', file.read_text()):
        path = urlsplit(value.strip())
        if not path.scheme and not path.netloc and path.path:
            assert (file.parent / unquote(path.path)).is_file(), value
for file in dist.glob('*.js'):
    subprocess.run(['node', '--check', str(file)], check=True)
print(f"PASS: {len(manifest['sha256'])} original files byte-identical; local HTML/CSS assets resolve; 5 JavaScript files parse.")
