# Spoločné BOZP zápisy – nastavenie Firebase

Aplikácia je pripravená na spoločné úložisko cez Firebase. Po dokončení tohto nastavenia majú prístup iba povolení členovia tímu a každý vidí všetky uložené BOZP zápisy.

## 1. Vytvorte projekt

1. Otvorte Firebase Console a vytvorte projekt, napr. `zo-packeta-bozp`.
2. V **Authentication → Sign-in method** zapnite **Email/Password**.
3. V **Firestore Database** vytvorte databázu v produkčnom režime.
4. V **Storage** aktivujte úložisko.
5. V **Project settings → Your apps** pridajte webovú aplikáciu a skopírujte jej konfiguračné hodnoty.

## 2. Vložte konfiguráciu

Do `firebase-config.js` vložte hodnoty z Firebase:

```js
window.ZO_FIREBASE_CONFIG = {
  apiKey: '…',
  authDomain: '…',
  projectId: '…',
  storageBucket: '…',
  messagingSenderId: '…',
  appId: '…'
};
```

## 3. Nastavte pravidlá

- Do **Firestore Database → Rules** vložte obsah `firestore.rules` a publikujte ho.
- Do **Storage → Rules** vložte obsah `storage.rules` a publikujte ho.

## 4. Pridajte používateľov

Pre každú oprávnenú osobu:

1. V **Authentication → Users** vytvorte používateľa s e-mailom v tvare `meno.priezvisko@users.odborypacketa.eu` a jednorazovým dočasným heslom.
2. Skopírujte jeho **User UID**.
3. Vo Firestore vytvorte dokument `users/<User UID>` s poľami:

```json
{ "enabled": true, "displayName": "Meno Priezvisko" }
```

4. Osobe pošlite používateľské meno `meno.priezvisko` a dočasné heslo oddeleným bezpečným kanálom. Po prvom prihlásení si klikne na **Zmeniť heslo** a zvolí vlastné heslo.

Účet bez dokumentu `users/<UID>` sa do zápisov nedostane, ani keď pozná adresu aplikácie.

## Prevádzka

- Všetci povolení používatelia vidia rovnakú knižnicu zápisov a fotografií.
- Zápis sa ukladá po kliknutí na **Uložiť zápis**.
- Každý povolený používateľ ho môže otvoriť, upraviť alebo vymazať.
- Fotografie sa ukladajú do Firebase Storage; v dokumente zápisu zostáva iba odkaz na súbor.
