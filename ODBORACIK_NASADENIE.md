# Nasadenie v odborypacketa/odborypacketa

Tento balík je prispôsobený existujúcemu webu. Priečinok `odboracik/` je verejná statická verzia s vypnutým odosielaním; `odborovy-asistent-web/` je zdroj pre automatické zostavenie. Aktualizácie zdrojov spravujte tam.

GitHub Pages pri publikovaní vetvy main sprístupní statickú verziu. Na automatické dopĺňanie nastavení z GitHub Variables prepnite **Settings → Pages → Source → GitHub Actions** a nastavte **PAGES_ACTIONS_ENABLED=true**. Workflow zostaví existujúci hlavný web podľa explicitného zoznamu verejných súborov a pridá Odboráčika. Do artefaktu nevkladá backend, testy ani tajomstvá. Premenná PAGES_SITE_DIRECTORY sa v prispôsobenom workflow nepoužíva. Ak pridáte nový verejný súbor hlavného webu, doplňte ho do scripts/stage-main-site.mjs.

Prijímač zostane vypnutý, kým nenastavíte Cloudflare a BACKEND_ENABLED. Aktuálne sukromie.html sa týka pôvodného webu a prihlášky; pred prijímaním podaní treba doplniť informácie pre Odboráčika vrátane Cloudflare, Turnstile a doby uchovania. Nepovažujte existujúcu stránku za hotovú informáciu pre nový formulár.

Nasleduje podrobný návod k prijímaču a nastaveniam (v krokoch 1 a 7 použite vyššie uvedený už pripojený repozitár a prepnutie PAGES_ACTIONS_ENABLED).

# Odboráčik — automatizácia cez GitHub

Pripravený zdrojový balík pre ZO Packeta Slovakia. Zachováva logo, farebnosť, názov a 28 odpovedí. Predpokladaná adresa hlavného webu podľa zadania: https://www.odborypacketa.eu. Nová sekcia je pripravená v `/odboracik/`; zatiaľ nie je nasadená. Repozitár odborypacketa/odborypacketa bol overený. Odboráčik je pridaný do /odboracik/ a hlavné menu naň odkazuje.

## Čo je hotové

- Chat odpovedá lokálne; na server neposiela ani neukladá obsah chatu.
- Kontaktný formulár posiela údaje výhradne cez `queryEndpoint`. Potvrdí prijatie až po overenom zápise a vrátení rovnakého ID. Výpadok zachová text, opakovanie rovnakého podania nezaloží duplicitu.
- Cloudflare Worker validuje obsah, pôvod stránky a Turnstile token na serveri. Povoľuje iba `https://www.odborypacketa.eu`.
- D1 uchováva obsah formulára šifrovaný AES-GCM. Časy a náhodné ID zostávajú čitateľné. Worker počas prijatia a oprávneného exportu vidí obsah; nejde o koncové šifrovanie.
- Export a výmaz vyžadujú administrátorský token; token sa nikdy neposiela do webovej konfigurácie. Nejde o plnohodnotný systém viacerých používateľov a auditovaných rolí.
- Doba uchovania je povinná konfigurácia prevádzkovateľa. Každodenný serverový úkon odstraňuje expirované záznamy zo živej databázy; zo záloh ani externých exportov ich okamžite neodstráni.
- Formulár neposiela e-mailové upozornenia. Určená osoba musí evidenciu pravidelne kontrolovať. Kontaktný e-mail sa nevymýšľa.
- GitHub automaticky kontroluje zmeny, zostaví web a po nastavení nasadí web aj prijímač. Dotazy sa neukladajú do GitHub Issues, repozitára ani workflow artefaktov.

## Jednorazové pripojenie

1. Potrebujeme odkaz na repozitár existujúceho webu. Doména nie je odkaz na repozitár. Nahrajte obsah tohto balíka do koreňa repozitára vrátane skrytého priečinka `.github`. Zachovajte existujúce súbory webu. Pri existujúcich workflow zlúčte kroky; nespúšťajte dve nezávislé nasadenia rovnakého Pages webu.
2. V Cloudflare vytvorte D1 databázu `odboracik-dotazy` a Turnstile widget s povoleným hostname `www.odborypacketa.eu`. Poznačte ID databázy, verejný site key a tajný secret key. Databáza sa zámerne pri opakovanom workflow nevytvára nanovo. Schému vytvorí workflow bezpečne cez `CREATE TABLE IF NOT EXISTS`.
3. V GitHube otvorte **Settings → Secrets and variables → Actions**. Nastavte hodnoty z tabuliek nižšie. Tajomstvá nevkladajte do chatu, zdrojových súborov ani verejných premenných.
4. Vytvorte GitHub environment `odboracik-production`. Vyhraďte jeho prístup oprávneným správcom. Dokončite informácie o spracúvaní údajov a určte dobu uchovania a osoby kontrolujúce podania.
5. Nastavte `BACKEND_ENABLED=true` a spustite **Actions → Odboráčik – prijímač dotazov → Run workflow**. V úspešnom nasadení Cloudflare uvedie skutočnú adresu Worker. Túto adresu doplňte do `QUERY_ENDPOINT` s cestou `/api/queries`. Žiadna doména prijímača sa nepredpokladá.
6. Spustite **Odboráčik – kontrola a web**. Aj bez nasadenia vznikne artefakt `odboracik-web` s podpriečinkom `odboracik`; ten možno pridať na existujúci hosting.
7. Ak hlavný web používa GitHub Pages, nastavte `PAGES_SITE_DIRECTORY` na samostatný priečinok obsahujúci jeho hotový statický web vrátane `index.html` a prípadného existujúceho `CNAME`. V Pages vyberte zdroj GitHub Actions. Workflow skopíruje celý existujúci web a pridá `/odboracik/`. Zdroj musí už byť zostavený; generátory webu vyžadujú začlenenie ich existujúceho zostavovacieho kroku. Nenastavujte koreň repozitára ani priečinok backendu.
8. Ak web používa iný hosting, použite zostavený artefakt a doplňte nasadenie cez konkrétny hosting. Tento balík nezisťuje ani nemení DNS. Automatický prenos na FTP, WordPress či iný hosting bez jeho údajov nie je zapojený.

Zmena GitHub premenných sama nevyvolá push; po zmene nastavení spustite príslušný workflow ručne. Ďalšie zmeny vo vetve `main` už nasadzujú automaticky. PR iba kontroluje a zostavuje web, nenasadzuje produkciu.

### GitHub Secrets

| Názov | Hodnota |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token obmedzený na daný účet, s Workers Scripts Edit a D1 Edit |
| `CLOUDFLARE_ACCOUNT_ID` | ID vášho Cloudflare účtu |
| `TURNSTILE_SECRET_KEY` | Tajný kľúč Turnstile widgetu |
| `DATA_ENCRYPTION_KEY` | Náhodný 32-bajtový kľúč v Base64; uchovať v bezpečnom správcovi hesiel |
| `ADMIN_TOKEN` | Náhodný token aspoň 32 znakov pre oprávnené čítanie a výmaz |

Oba náhodné kľúče vygenerujte v správcovi hesiel alebo lokálne, nie v GitHub logoch. Šifrovací kľúč sa nesmie len nahradiť pri existujúcich dátach: bez pôvodného kľúča sa staré podania nedajú prečítať. Rotácia vyžaduje migráciu; tá nie je súčasťou tejto verzie.

### GitHub Variables

| Názov | Hodnota |
| --- | --- |
| `D1_DATABASE_ID` | ID vytvorenej databázy |
| `WORKER_NAME` | Voliteľné; predvolené `odboracik-prijimac` |
| `RETENTION_DAYS` | Celé číslo dní určené prevádzkovateľom; bez predvolenej doby |
| `PRIVACY_READY` | `true` po dokončení informácií a podmienok spracúvania |
| `BACKEND_ENABLED` | `true` na povolenie nasadenia prijímača |
| `QUERY_ENDPOINT` | Skutočné HTTPS URL prijímača zakončené `/api/queries` |
| `TURNSTILE_SITE_KEY` | Verejný site key |
| `PRIVACY_URL` | Skutočná HTTPS adresa informácií o spracúvaní údajov |
| `PAGES_SITE_DIRECTORY` | Priečinok existujúceho hotového webu; prázdne = iba artefakt, bez nasadenia celého webu |

Bez endpointu, site key a informácií o spracúvaní formulár nič neposiela. Prepínač `PRIVACY_READY` nie je právny posudok ani automatická záruka súladu.

## Kontrola podaní

Oprávnený správca na svojom počítači použije Node.js 24. Nastaví `QUERY_ENDPOINT` a `ADMIN_TOKEN` vo svojom lokálnom prostredí bezpečným spôsobom, potom:

```sh
node scripts/admin.mjs export evidencia-export.json
node scripts/admin.mjs delete ID-PODANIA
```

Export sa zapisuje len do nového súboru s obmedzeným prístupom; neprepisuje existujúci súbor. Evidenciu kontrolujte v určených intervaloch. Export obsahuje osobné údaje; nevkladajte ho do GitHubu. Výmaz je trvalý v živej databáze. Uloženie podania neznamená, že ho už pracovník odborov prečítal.

## Overenie

```sh
node --test tests/*.test.mjs
node --check odborovy-asistent-web/app.js
```

Prešlo 22 automatických testov s lokálnou SQLite databázou a simuláciou Turnstile. Pokrývajú šifrovanie, validáciu, neoprávnený prístup, výpadky, duplicitné podania, uchovanie, výmaz aj správanie formulára. GitHub Actions ani živé Cloudflare nasadenie neboli spustené; chýbajú údaje účtov a repozitár. Vizuálne overenie v prehliadači nebolo dostupné. Právny obsah 28 tém bol zachovaný, nie nanovo právne overený.

Po nasadení otestujte vymyslené podanie na skutočnej doméne: uloženie → zobrazenie cez oprávnený export → opakovanie → výmaz. Overte aj zamietnutie iného pôvodu a zobrazenie chyby pri nedostupnej službe. Prečítajte informácie o spracúvaní a o použití Turnstile.

## Technické podklady

Použité rozhrania: [Cloudflare GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/), [D1 prepared statements](https://developers.cloudflare.com/d1/worker-api/prepared-statements/), [Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/), [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [tajomstvá pri nasadení](https://developers.cloudflare.com/workers/configuration/secrets/). Workflow používa Wrangler 4; pred produkčným použitím možno uzamknúť konkrétnu overenú verziu podľa prostredia prevádzkovateľa.
