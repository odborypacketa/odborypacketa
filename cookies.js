(() => {
  const key = 'zo-cookie-notice-v1';
  const panel = document.createElement('aside');
  panel.className = 'cookie-notice';
  panel.setAttribute('aria-labelledby', 'cookie-title');
  panel.innerHTML = '<h2 id="cookie-title">Cookies a vaše súkromie</h2><p>Nepoužívame analytické ani reklamné cookies. Prihlášku vypĺňate iba vo svojom zariadení.</p><p class="micro">Zatvorenie tejto informácie si zapamätáme počas relácie tejto karty. Nejde o súhlas so sledovaním.</p><div class="cookie-actions"><button type="button" class="primary">Rozumiem</button><a href="cookies.html">Podrobnosti o cookies</a></div>';
  document.body.append(panel);
  const reopen = document.querySelector('.cookie-reopen');
  reopen.hidden = false;
  try { panel.hidden = sessionStorage.getItem(key) === 'seen'; } catch {}
  const close = () => {
    panel.hidden = true;
    try { sessionStorage.setItem(key, 'seen'); } catch {}
    reopen.focus({preventScroll:true});
  };
  panel.querySelector('button').addEventListener('click', close);
  panel.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  reopen.addEventListener('click', () => {
    panel.hidden = false;
    panel.querySelector('button').focus({preventScroll:true});
  });
})();
