"""Generate static news from content/aktuality.json. Run before publishing."""
from pathlib import Path
import json, html, re, datetime
root = Path(__file__).resolve().parent.parent
items = json.loads((root / 'content/aktuality.json').read_text())
def text(value):
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html.escape(value))
articles=[]
for item in sorted(items, key=lambda x:x['date'], reverse=True):
    date=datetime.date.fromisoformat(item['date'])
    body=''.join('<p>'+text(p)+'</p>' for p in item['paragraphs'])
    articles.append(f'<article class="news-article"><time datetime="{date.isoformat()}">{date.day}. {date.month}. {date.year}</time><h3>{html.escape(item["title"])}</h3>{body}</article>')
p=root/'index.html';source=p.read_text()
pattern=r'(<div id="news">).*?(</div></div></section><section id="ako-fungujeme")'
source,count=re.subn(pattern, lambda m:m[1]+''.join(articles)+m[2],source,flags=re.S)
assert count==1, 'News region not found uniquely'
p.write_text(source)
