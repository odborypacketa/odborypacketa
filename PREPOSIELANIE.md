# Preposielanie podaní na info@odborypacketa.eu

Pripravené cez Resend na serveri Cloudflare Worker. Cieľová adresa je pevne nastavená v backend/mail.mjs. Odosielateľ formulára ju nemôže meniť. Preposiela sa meno/prezývka, kontaktný e-mail, téma, časová citlivosť, opis a ID podania. Obsah chatu sa neposiela.

## Aktivácia

V GitHub Settings → Secrets and variables → Actions doplňte:

- **Secret RESEND_API_KEY:** API kľúč s oprávnením odosielať e-maily pre overenú doménu.
- **Variable CONTACT_FROM_EMAIL:** skutočná adresa odosielateľa na doméne overenej v Resend. Môže to byť info@odborypacketa.eu po príslušnom overení; potvrdenie overenia zatiaľ nemáme. Adresa návštevníka je iba Reply-To, nie From.

Overte doménu v Resend podľa jeho DNS pokynov. Zachovajte existujúce nastavenia prijímania schránky info@odborypacketa.eu vo Websupport; jej hlavné MX záznamy sa kvôli odosielaniu cez Resend nenahrádzajú. Tajný API kľúč neposielajte do chatu a nevkladajte do verejnej konfigurácie.

Ďalej zostávajú povinné pôvodné nastavenia Cloudflare databázy, Turnstile, šifrovacieho kľúča, administrátorského tokenu, uchovania a informácií o spracúvaní. Do informácií zahrňte aj Resend, preposielanie obsahu do schránky a uchovanie e-mailových kópií. Následne spustite workflow prijímača, nastavte skutočný QUERY_ENDPOINT a spustite workflow webu v režime GitHub Actions podľa ODBORACIK_NASADENIE.md.

## Čo potvrdzuje formulár

`mailStatus=sent` znamená, že Resend prijal požiadavku a vrátil ID e-mailu. Neznamená potvrdené doručenie do prijatej pošty ani prečítanie. Doručenie, prípadnú chybu či spam overte v Resend a v cieľovej schránke. Automatické potvrdenie návštevníkovi sa neposiela.

Po uložení do evidencie môže mailStatus zostať `pending` alebo `sending`. Plánovaný úkon každých päť minút skúša neúspešné správy znovu s rastúcim odstupom, najviac 23 hodín od prijatia podania. Posiela najviac desať čakajúcich správ na jeden beh. Trvalý stav odoslania a zámok v databáze obmedzujú súbežné pokusy. Rovnaký identifikátor sa používa ako Resend Idempotency-Key.

Po 23 hodinách stav prejde na `failed` a vyžaduje kontrolu správcom. Ďalšie automatické posielanie sa zastaví pred uplynutím 24-hodinovej idempotencie poskytovateľa, aby nebolo slepo odoslané druhé oznámenie. Oprávnený export ukazuje mailStatus. Ak email nemá byť odoslaný znovu, nezakladajte nové podanie. Pri manuálnej kontrole porovnajte ID s logom poskytovateľa. Počas okna opakovaní nemeňte adresu odosielateľa ani šablónu e-mailu.

Vymazanie podania alebo uplynutie doby uchovania zmaže čakajúcu správu z databázy, ale nevymaže už odoslaný e-mail zo schránky, Resend ani záloh. Ich uchovanie treba spravovať osobitne.

## Overenie pred spustením

Prešlo 28 automatických testov vrátane pevného príjemcu, Reply-To, výpadku služby, opakovania s rovnakým identifikátorom, súbehu odosielania a zastavenia po časovom limite. E-mailová služba bola v testoch simulovaná. Skutočný e-mail zatiaľ nebol odoslaný, pretože nemáme nakonfigurovaný server a e-mailové tajomstvá.

Po aktivácii odošlite vymyslený testovací podnet zo skutočného webu a overte prijatú správu aj jej Reply-To v info@odborypacketa.eu. Test neoznačuje formulár za funkčný, kým správa nepríde do schránky.

Podklady: [Resend send API](https://resend.com/docs/api-reference/emails/send-email), [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys).
