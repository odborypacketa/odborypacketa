(() => {
  const cfg = window.ZO_FIREBASE_CONFIG || {};
  const configured = ['apiKey','authDomain','projectId','storageBucket','appId'].every(k => String(cfg[k] || '').trim());
  const status = document.querySelector('#authStatus');
  const gate = document.querySelector('#authGate');
  const userInput = document.querySelector('#loginUsername');
  const passInput = document.querySelector('#loginPassword');
  const loginError = document.querySelector('#loginError');
  const loginButton = document.querySelector('#loginButton');
  const logoutButton = document.querySelector('#signOut');
  const changeButton = document.querySelector('#changePassword');
  const setMessage = (text, error=false) => { loginError.textContent = text || ''; loginError.classList.toggle('error', error); };
  const normalizeUsername = value => value.trim().toLowerCase().replace(/\s+/g,'');
  const toAccountEmail = username => `${normalizeUsername(username)}@users.odborypacketa.eu`;

  window.sharedRecordStore = {
    mode: configured ? 'cloud' : 'local',
    user: null,
    async getRecords(){ return []; },
    async save(){ throw new Error('Pred uložením spoločného zápisu sa prihláste.'); },
    async remove(){ throw new Error('Pred vymazaním spoločného zápisu sa prihláste.'); }
  };
  if (!configured) {
    status.textContent = 'Lokálne uloženie';
    return;
  }

  (async () => {
    const [{initializeApp}, authModule, firestoreModule, storageModule] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js')
    ]);
    const {getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword} = authModule;
    const {getFirestore, collection, doc, getDoc, getDocs, setDoc, deleteDoc, query, orderBy, serverTimestamp} = firestoreModule;
    const {getStorage, ref, uploadBytes, getDownloadURL} = storageModule;
    const app = initializeApp(cfg);
    const auth = getAuth(app), db = getFirestore(app), storage = getStorage(app);
    let currentUser = null;

    async function hasAccess(user) {
      const membership = await getDoc(doc(db, 'users', user.uid));
      return membership.exists() && membership.data().enabled === true;
    }
    async function uploadPhoto(photo, recordId) {
      if (!photo?.data || !photo.data.startsWith('data:')) return photo;
      const blob = await (await fetch(photo.data)).blob();
      const safeName = String(photo.name || 'fotografia').replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `bozp-records/${recordId}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
      const destination = ref(storage, path);
      await uploadBytes(destination, blob, {contentType: blob.type || 'image/jpeg'});
      return {name: photo.name || 'Fotografia', data: await getDownloadURL(destination), storagePath: path};
    }
    window.sharedRecordStore = {
      mode: 'cloud',
      get user(){ return currentUser; },
      async getRecords(){
        if (!currentUser) return [];
        const snapshot = await getDocs(query(collection(db, 'bozpRecords'), orderBy('savedAt', 'desc')));
        return snapshot.docs.map(item => item.data());
      },
      async save(record){
        if (!currentUser) throw new Error('Pred uložením spoločného zápisu sa prihláste.');
        const prepared = structuredClone(record);
        for (const finding of prepared.state.findings || []) {
          finding.photos = await Promise.all((finding.photos || []).map(photo => uploadPhoto(photo, prepared.id)));
        }
        prepared.savedAt = new Date().toISOString();
        prepared.updatedAt = serverTimestamp();
        prepared.updatedBy = currentUser.uid;
        if (!prepared.createdBy) prepared.createdBy = currentUser.uid;
        await setDoc(doc(db, 'bozpRecords', prepared.id), prepared, {merge:true});
      },
      async remove(id){
        if (!currentUser) throw new Error('Pred vymazaním spoločného zápisu sa prihláste.');
        await deleteDoc(doc(db, 'bozpRecords', id));
      }
    };
    async function showSignedIn(user) {
      currentUser = user;
      const allowed = await hasAccess(user);
      if (!allowed) {
        await signOut(auth);
        setMessage('Tento účet nemá povolený prístup. Obráťte sa na správcu ZO.', true);
        return;
      }
      gate.hidden = true;
      status.textContent = `Prihlásený: ${user.email.replace('@users.odborypacketa.eu','')}`;
      logoutButton.hidden = false;
      changeButton.hidden = false;
      window.dispatchEvent(new CustomEvent('shared-records-ready'));
    }
    onAuthStateChanged(auth, user => {
      if (user) showSignedIn(user).catch(() => setMessage('Prístup sa nepodarilo overiť.', true));
      else { currentUser = null; gate.hidden = false; status.textContent = 'Vyžaduje sa prihlásenie'; logoutButton.hidden = true; changeButton.hidden = true; }
    });
    loginButton.onclick = async () => {
      const username = normalizeUsername(userInput.value), password = passInput.value;
      if (!/^[a-záäčďéíĺľňóôŕšťúýž.-]{3,}$/i.test(username) || !password) { setMessage('Zadajte používateľské meno a heslo.', true); return; }
      loginButton.disabled = true; setMessage('Prihlasovanie…');
      try { await signInWithEmailAndPassword(auth, toAccountEmail(username), password); }
      catch { setMessage('Prihlasovacie meno alebo heslo nie je správne.', true); }
      finally { loginButton.disabled = false; }
    };
    passInput.onkeydown = e => { if (e.key === 'Enter') loginButton.click(); };
    logoutButton.onclick = () => signOut(auth);
    changeButton.onclick = async () => {
      const first = prompt('Zadajte nové heslo (aspoň 8 znakov):');
      if (!first) return;
      const second = prompt('Zadajte nové heslo ešte raz:');
      if (first !== second) { alert('Heslá sa nezhodujú.'); return; }
      if (first.length < 8) { alert('Heslo musí mať aspoň 8 znakov.'); return; }
      try { await updatePassword(auth.currentUser, first); alert('Heslo bolo zmenené.'); }
      catch { alert('Heslo sa teraz nepodarilo zmeniť. Prihláste sa znova a skúste to ešte raz.'); }
    };
  })().catch(() => { status.textContent = 'Prihlásenie nedostupné'; });
})();
