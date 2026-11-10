"""Generate static news from content/aktuality.json. Run before publishing."""
from pathlib import Path
import json, html, re, datetime
root = Path(__file__).resolve().parent.parent
items = json.loads((root / 'content/aktuality.json').read_text())
def text(value):
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html.escape(value))
def paragraph(value):
    if value.startswith('## '):
        return '<h4>'+text(value[3:])+'</h4>'
    if value.startswith('*') and value.endswith('*') and not value.startswith('**'):
        return '<p><em>'+text(value[1:-1])+'</em></p>'
    return '<p>'+text(value)+'</p>'
articles=[]
for item in sorted(items, key=lambda x:x['date'], reverse=True):
    date=datetime.date.fromisoformat(item['date'])
    body=''.join(paragraph(p) for p in item['paragraphs'])
    if item.get('cta'):
        cta=item['cta']
        button='<p><a class="cta" href="'+html.escape(cta['href'], quote=True)+'">'+html.escape(cta['label'])+'</a></p>'
        body=body.replace('<p><strong>ZO Packeta Slovakia</strong></p>',button+'<p><strong>ZO Packeta Slovakia</strong></p>')
        body+='<p class="micro">'+html.escape(item['deadline'])+'</p>'
    if item.get('image'):
        image=item['image']; src=html.escape(image['src'],quote=True)
        body=f'<a href="{src}" aria-label="Otvoriť pôvodnú grafiku v plnej veľkosti"><img class="news-image" src="{src}" width="{int(image["width"])}" height="{int(image["height"])}" loading="lazy" alt="{html.escape(image["alt"],quote=True)}"></a>'+body
    anchor=' id="'+html.escape(item['id'],quote=True)+'"' if item.get('id') else ''
    articles.append(f'<article class="news-article"{anchor}><time datetime="{date.isoformat()}">{date.day}. {date.month}. {date.year}</time><h3>{html.escape(item["title"])}</h3>{body}</article>')
p=root/'index.html';source=p.read_text()
pattern=r'(<div id="news">).*?(</div></div></section><section id="ako-fungujeme")'
source,count=re.subn(pattern, lambda m:m[1]+''.join(articles)+m[2],source,flags=re.S)
assert count==1, 'News region not found uniquely'
p.write_text(source)
