(() => {
  const EXPECTED_HASH = 'lGlzdXxSurSyUoQQfgV3qKsnoGZ0x9I1SNZFSiPeq4k=';
  const SALT = 'zo-packeta-bozp-access-v1';
  const SESSION_KEY = 'zo-packeta-bozp-access-granted-v1';
  const gate = document.querySelector('#pageLock');
  const form = document.querySelector('#accessForm');
  const input = document.querySelector('#accessPassword');
  const message = document.querySelector('#accessMessage');
  const encoder = new TextEncoder();
  const openTool = () => { window.location.replace('protokol.html'); };
  const toBase64 = bytes => btoa(String.fromCharCode(...bytes));
  async function passwordHash(value) {
    const key = await crypto.subtle.importKey('raw', encoder.encode(value), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt:encoder.encode(SALT), iterations:250000, hash:'SHA-256'}, key, 256);
    return toBase64(new Uint8Array(bits));
  }
  if (sessionStorage.getItem(SESSION_KEY) === 'true') { openTool(); return; }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    message.textContent = 'Overujem heslo…';
    const actual = await passwordHash(input.value);
    if (actual === EXPECTED_HASH) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      openTool();
    } else {
      message.textContent = 'Heslo nie je správne.';
      input.select();
    }
  });
  input.focus();
})();
