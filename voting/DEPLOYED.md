# Produkčná anketa

Adresa: https://www.odborypacketa.eu/hlasovania/
Administrácia: https://www.odborypacketa.eu/hlasovania/admin/

Nasadená 5. 11. 2026 ako Cloudflare Worker odbory-anketa so statickými súbormi; ostatný web zostáva na GitHub Pages. Databáza odbory-anketa-2026 má jurisdikciu EÚ. Nikdy nespúšťať schema.sql na existujúcej databáze.

Začiatok: 9. 11. 2026 09:00 Europe/Bratislava. Koniec: 19. 11. 2026 09:00. Anketa f4305b6f-2917-424a-bc0c-bcecb2bdddfa má 24 možností v 5 sekciách; povolených je až 24 označení v jednej odpovedi. Poznámka je nepovinná, najviac 1500 znakov.

## Opakované nasadenie

1. `node voting/build-assets.mjs`
2. `node --test voting/tests/*.test.mjs`
3. Použiť schválené prihlásenie Wrangler s workers_scripts:write, workers_routes:write, d1:write a čítaním účtu/zóny.
4. Tajomstvá RATE_SECRET a TURNSTILE_SECRET sú už v Cloudflare. Nevkladať ich do zdrojov ani ich bez dôvodu meniť.
5. `wrangler deploy --config voting/wrangler.json`

Redeploy nemení termíny v databáze. Aktivačný skript nepoužívať na vytvorenie novej kópie tejto ankety. Vypnutie zberu: ENABLED=false a opätovné nasadenie, bez mazania databázy.

## Správa a export

Cloudflare Access povoľuje iba odborypacketa@gmail.com a vyžaduje autentifikačnú aplikáciu každú hodinu. Prvotné prihlásenie a zápis autentifikátora vykoná vlastník účtu. Server navyše overuje podpis JWT, vydavateľa, audience, čas a presný e-mail.

Export je dostupný po konci a uzavretí ankety, pri najmenej 10 odpovediach. CSV obsahuje súhrn možností a neverejné poznámky; poznámky treba pred ďalším zdieľaním skontrolovať. Verejné výsledky musí správca osobitne publikovať. Nikdy nezverejňovať súbor s poznámkami automaticky.

Používateľ schválil nezvratný výmaz jednotlivých odpovedí, poznámok a oddelených ochranných odtlačkov 90 dní po skončení. Cron každých 10 minút uzatvára skončené ankety, čistí expirované počítadlá a vykonáva výmaz. Pre túto anketu lehota uplynie 17. 2. 2027 09:00. Súhrnný export stiahnuť predtým; po výmaze výsledky z aktívnej databázy nemožno zrekonštruovať. Pri obnove D1 Time Travel pred otvorením služby znova uplatniť retenčný výmaz. Audit operácií správcu je oddelený a neobsahuje obsah odpovedí.

## Overenie 5. 11. 2026

25 lokálnych testov prešlo: viac odpovedí v jednom hlase, uloženie poznámky, opakovanie, CSRF, validácia, limity, podpis a allowlist admin JWT, termíny, export, výmaz po 90 dňoch.
Živá stránka vrátila 200 s CSP; hlas pred začiatkom 409; nezverejnené výsledky 404; admin stránka aj API presmerujú na Access. Produkčná databáza neobsahuje testovacie hlasy.
Verejné Google a Cloudflare DNS vracajú Cloudflare s overeným DNSSEC. Miestny resolver pri kontrole ešte vracal starý GitHub a 404; treba overiť vykreslenie a mobil aj po obnovení DNS. Prihlásená administrácia a skutočné Turnstile odoslanie neboli end-to-end overené; produkčné hlasovanie sa pred termínom nesmie otvárať kvôli testu.
