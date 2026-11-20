// Dates in news are calendar dates, interpreted in Bratislava regardless of the visitor's zone.
(() => {
  const parts = new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Bratislava', year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(new Date());
  const get = type => Number(parts.find(part => part.type === type).value);
  const year = get('year'), month = get('month'), day = get('day');
  const previous = new Date(Date.UTC(year, month - 2, 1));
  const last = new Date(Date.UTC(previous.getUTCFullYear(), previous.getUTCMonth() + 1, 0)).getUTCDate();
  const iso = (y,m,d) => `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  const cutoff = iso(previous.getUTCFullYear(), previous.getUTCMonth()+1, Math.min(day,last));
  const today = iso(year,month,day);
  const recent = date => date >= cutoff && date <= today;
  const ensureId = article => {
    if (!article.id) {
      const date = article.querySelector('time[datetime]')?.dateTime;
      const title = article.querySelector('h3')?.textContent || '';
      const slug = title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      if (date && slug) article.id = `aktualita-${date}-${slug}`;
    }
  };
  const news = document.querySelector('#news');
  if (news) {
    const update = () => {
      let hash = ''; try { hash = decodeURIComponent(location.hash.slice(1)); } catch (_) {}
      const articles = [...news.querySelectorAll(':scope > article.news-article')];
      for (const article of articles) {
        ensureId(article);
        const date = article.querySelector('time[datetime]')?.dateTime;
        article.hidden = !!date && !recent(date) && article.id !== hash;
      }
      document.querySelector('#news-empty').hidden = articles.some(article => recent(article.querySelector('time[datetime]')?.dateTime || ''));
      if (hash) document.getElementById(hash)?.scrollIntoView();
    };
    update(); window.addEventListener('hashchange', update);
  }
  const archive = document.querySelector('#archive');
  if (archive) {
    fetch('./', {cache:'no-cache'}).then(response => {if (!response.ok) throw Error('archive'); return response.text();}).then(source => {
      const doc = new DOMParser().parseFromString(source,'text/html');
      const nodes = [...doc.querySelectorAll('#news > article.news-article')]; nodes.forEach(ensureId);
      const articles = nodes.map(article => ({id:article.id, date:article.querySelector('time[datetime]')?.dateTime, title:article.querySelector('h3')?.textContent})).filter(a => a.id && a.date && a.title && a.date < cutoff).sort((a,b) => b.date.localeCompare(a.date));
      archive.replaceChildren(); let current = '';
      for (const article of articles) {
        const group = article.date.slice(0,7);
        if (group !== current) {
          current = group; const heading = document.createElement('h2');
          heading.textContent = new Intl.DateTimeFormat('sk-SK',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${group}-01T12:00:00Z`));
          archive.append(heading,document.createElement('ul'));
        }
        const li=document.createElement('li'), time=document.createElement('time'), link=document.createElement('a');
        time.dateTime=article.date; time.textContent=article.date.split('-').reverse().map(Number).join('. ') + '. ';
        link.href=`./#${encodeURIComponent(article.id)}`; link.textContent=article.title; li.append(time,link); archive.lastElementChild.append(li);
      }
      if (!articles.length) archive.textContent='Zatiaľ tu nie sú žiadne staršie aktuality.';
    }).catch(() => {
      // Static links remain usable if the request fails.
      archive.querySelectorAll('[data-date]').forEach(item => {item.hidden = recent(item.dataset.date) || item.dataset.date > today;});
    });
  }
})();
