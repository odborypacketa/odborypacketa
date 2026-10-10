const legalChat = window.ODBORACIK_LEGAL_ENGINE?.create(window.ODBORACIK_LEGAL_BASE);
const messages = document.querySelector('#messages');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const contactDialog = document.querySelector('#contact-dialog');
const contactForm = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const config = window.ODBOROVY_ASISTENT_CONFIG || {};
const recordKey = 'odboracik-internal-records-v1';
const recordsDialog = document.querySelector('#records-dialog');
const recordsButton = document.querySelector('#open-records');

function records() { try { return JSON.parse(localStorage.getItem(recordKey) || '[]'); } catch { return []; } }
function saveRecord(record) {
  const item = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), createdAt: new Date().toISOString(), status: 'nový', ...record };
  if (config.internalStorageEnabled) {
    const all = records(); all.unshift(item); try { localStorage.setItem(recordKey, JSON.stringify(all.slice(0, 200))); renderRecords(); return true; } catch { return false; }
  }

}
function escapeHtml(value) { const el = document.createElement('div'); el.textContent = value || ''; return el.innerHTML; }
function renderRecords() {
  const all = records(); document.querySelector('#record-count').textContent = all.length;
  document.querySelector('#records-empty').hidden = all.length > 0;
  document.querySelector('#records-list').innerHTML = all.map(r => `<tr><td>${new Date(r.createdAt).toLocaleString('sk-SK')}</td><td>${escapeHtml(r.channel)}</td><td>${escapeHtml(r.topic || '—')}</td><td>${escapeHtml(r.question || r.message || '')}</td><td>${escapeHtml(r.status)}</td></tr>`).join('');
}
function exportRecords() {
  const header = ['Dátum','Kanál','Téma','Dotaz','Stav'];
  const rows = records().map(r => [new Date(r.createdAt).toLocaleString('sk-SK'),r.channel,r.topic || '',r.question || r.message || '',r.status]);
  const csv = [header,...rows].map(row => row.map(v => `"${String(/^[\s]*[=+@\-]/.test(String(v)) ? "'" + v : v).replaceAll('"','""')}"`).join(';')).join('\n');
  const url = URL.createObjectURL(new Blob(["\ufeff" + csv], {type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a'); a.href = url; a.download = 'evidencia-dotazov-odboracik.csv'; a.click(); URL.revokeObjectURL(url);
}
function addMessage(text, who) { const el = document.createElement('div'); el.className = `message ${who}`; el.textContent = text; messages.append(el); messages.scrollTop = messages.scrollHeight; }
function addLegalMessage(result) {
  const el = document.createElement('div'); el.className = 'message assistant';
  const paragraph = text => { const p = document.createElement('p'); p.textContent = text; el.append(p); };
  if (!result.cards.length) paragraph(result.text);
  for (const warning of result.warnings || []) paragraph(warning);
  if (result.continuation) paragraph(result.continuation);
  for (const calculation of result.calculations || []) paragraph(calculation);
  for (const card of result.cards) {
    if (result.cards.length > 1) { const title = document.createElement('strong'); title.textContent = card.title; el.append(title); }
    paragraph(card.answer);
    // Material conditions remain available with the answer; long explanations can be expanded.
    const details = document.createElement('details');
    details.open = card.risk === 'urgent_legal' || card.risk === 'emergency';
    const summary = document.createElement('summary'); summary.textContent = 'Podmienky, výnimky a lehoty'; details.append(summary);
    const detail = document.createElement('p'); detail.textContent = card.detail; details.append(detail);
    for (const caveat of card.exceptions) { const p = document.createElement('p'); p.textContent = caveat; details.append(p); }
    el.append(details);
    const sources = document.createElement('div'); sources.className = 'legal-sources';
    for (const ref of card.refs) {
      const a = document.createElement('a'); a.textContent = ref.name + ' – ' + ref.provision;
      a.href = ref.url; a.target = '_blank'; a.rel = 'noopener noreferrer'; sources.append(a);
    }
    const date = document.createElement('small'); date.textContent = 'Overené 10. 10. 2026 · všeobecné informácie'; sources.append(date); el.append(sources);
  }
  if (result.questions?.length) paragraph('Na spresnenie: ' + result.questions.join(' '));
  if (result.frame) {
    const details = document.createElement('details'); const summary = document.createElement('summary');
    summary.textContent = 'Postup pri individuálnom prípade'; details.append(summary);
    const frame = document.createElement('p'); frame.textContent = result.frame; details.append(frame); el.append(details);
  }
  messages.append(el); messages.scrollTop = messages.scrollHeight;
}
function reply(question) {
  addMessage(question, 'user');
  const result = legalChat ? legalChat.respond(question) : { cards: [], text: 'Odpovede sa nenačítali. Obnovte stránku a skúste znova.', contact: false };
  saveRecord({ channel: 'chat', topic: result.topicIds?.join(', ') || 'nezaradená otázka', question });
  window.setTimeout(() => addLegalMessage(result), 100);
}
chatForm.addEventListener('submit', event => { event.preventDefault(); const question = chatInput.value.trim(); if (!question) return; chatInput.value = ''; reply(question); });
document.querySelectorAll('.topic').forEach(button => button.addEventListener('click', () => reply(button.dataset.question)));
function openContact() { contactDialog.showModal(); }
document.querySelector('#open-contact').addEventListener('click', openContact);
document.querySelector('#close-contact').addEventListener('click', () => contactDialog.close());

let pendingSubmission = null;
let sending = false;
let turnstileWidget;
const submitButton = contactForm.querySelector('[type="submit"]');
const privacyLink = document.querySelector('#privacy-link');
if (config.privacyUrl && safeURL(config.privacyUrl)) { privacyLink.href = config.privacyUrl; privacyLink.hidden = false; }
function safeURL(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && !url.hash; } catch { return false; }
}
function ready() { return config.internalStorageEnabled || (safeURL(config.queryEndpoint) && safeURL(config.privacyUrl) && config.turnstileSiteKey); }
if (!ready()) status.textContent = 'Kontaktný formulár sa pripravuje. Zatiaľ neodosielajte osobné údaje.';
if (config.internalStorageEnabled) {
  document.querySelector('#mode-note').textContent = 'INTERNÝ TEST — používajte len vymyslené údaje. Evidencia zostáva v tomto prehliadači.';
  submitButton.textContent = 'Uložiť testovací dotaz';
} else if (ready()) {
  window.odboracikTurnstileReady = () => {
    turnstileWidget = window.turnstile.render('#spam-check', { sitekey: config.turnstileSiteKey, action: 'contact', language: 'sk' });
  };
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=odboracikTurnstileReady&render=explicit';
  script.async = true; script.defer = true;
  script.onerror = () => { status.textContent = 'Overenie proti spamu sa nenačítalo. Obnovte stránku a skúste znova.'; };
  document.head.append(script);
}
contactForm.addEventListener('submit', async event => {
  event.preventDefault(); if (sending || !contactForm.reportValidity()) return;
  if (!ready()) { status.textContent = 'Odosielanie zatiaľ nie je dostupné. Text nebol odoslaný.'; return; }
  const raw = Object.fromEntries(new FormData(contactForm)); if (raw.company) return;
  const payload = { channel: 'formulár', name: raw.name.trim(), email: raw.email.trim(), topic: raw.topic, message: raw.message.trim(), urgent: Boolean(raw.urgent), consent: Boolean(raw.consent), company: '' };
  if (!payload.message) { status.textContent = 'Doplňte stručný opis veci.'; return; }
  if (config.internalStorageEnabled) {
    if (!saveRecord({ ...payload, question: payload.message })) { status.textContent = 'Lokálne testovacie úložisko nie je dostupné. Text nebol uložený.'; return; }
    status.textContent = 'Testovací dotaz je uložený iba lokálne. Odborom nebol odoslaný.'; contactForm.reset(); return;
  }
  const token = turnstileWidget !== undefined && window.turnstile?.getResponse(turnstileWidget);
  if (!token) { status.textContent = 'Dokončite overenie proti spamu.'; return; }
  const fingerprint = JSON.stringify(payload);
  if (!pendingSubmission || pendingSubmission.fingerprint !== fingerprint) pendingSubmission = { fingerprint, id: crypto.randomUUID() };
  const id = pendingSubmission.id;
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 15000);
  sending = true; submitButton.disabled = true; status.textContent = 'Odosielam…';
  // Lock editing during submission; preserve fields on all failures.
  const controls = [...contactForm.elements].filter(el => el !== submitButton);
  controls.forEach(el => el.disabled = true);
  try {
    const response = await fetch(config.queryEndpoint, { method: 'POST', credentials: 'omit', referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...payload, id, turnstileToken: token }), signal: controller.signal });
    const result = await response.json();
    if (!response.ok || result.ok !== true || result.id !== id) throw new Error('Unconfirmed');
    contactForm.reset(); pendingSubmission = null;
    status.textContent = result.mailStatus === 'sent'
      ? `Dotaz je v evidencii a e-mailová služba prijala správu pre info@odborypacketa.eu. Číslo podania: ${id}.`
      : `Dotaz bol prijatý do evidencie. E-mail na info@odborypacketa.eu zatiaľ nebol potvrdený; odbory ho môžu skontrolovať v evidencii. Číslo podania: ${id}.`;
  } catch {
    status.textContent = 'Prijatie dotazu sa nepodarilo potvrdiť. Text zostal vo formulári. Zopakujte overenie a skúste odoslať znova; rovnaké podanie sa neuloží dvakrát.';
  } finally {
    clearTimeout(timeout); sending = false; submitButton.disabled = false;
    controls.forEach(el => el.disabled = false);
    window.turnstile?.reset(turnstileWidget);
  }
});
if (config.internalStorageEnabled) {
  recordsButton.hidden = false; renderRecords();
  recordsButton.addEventListener('click', () => recordsDialog.showModal());
  document.querySelector('#close-records').addEventListener('click', () => recordsDialog.close());
  document.querySelector('#export-records').addEventListener('click', exportRecords);
  document.querySelector('#clear-records').addEventListener('click', () => { if (confirm('Vymazať všetky lokálne testovacie dotazy?')) { localStorage.removeItem(recordKey); renderRecords(); } });
}
