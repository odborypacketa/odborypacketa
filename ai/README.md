# Odboráčik – AI rozhovor

Pripojenie je pripravené, ale bez účtov OpenAI API a Cloudflare ešte nie je aktívne. Bot dovtedy používa miestne odpovede. API kľúče neposielajte do chatu ani do verejných súborov.

## Jednorazové zapnutie

1. Vytvorte účet na https://platform.openai.com/, projekt pre Odboráčika, aktivujte API fakturáciu a nastavte nízky rozpočet. Projektový API kľúč vytvorte na https://platform.openai.com/api-keys. API sa platí podľa tokenov.
2. Vytvorte účet na https://dash.cloudflare.com/. V Workers nastavte workers.dev názov. V Turnstile vytvorte widget pre hostname `www.odborypacketa.eu` (verejný sitekey + tajný secret key). API token vytvorte zo šablóny Edit Cloudflare Workers pre príslušný účet vrátane oprávnení na Durable Objects. Account ID je identifikátor účtu, nie domény.
3. Do [GitHub Secrets](https://github.com/odborypacketa/odborypacketa/settings/secrets/actions) vložte `OPENAI_API_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `AI_TURNSTILE_SECRET_KEY`. Ak environment odboracik-production má vlastné secrets, majú prednosť.
4. Dokončite informácie organizácie o AI: účel, právny základ, poskytovatelia, prenosy, zmluvy, uchovanie a kontakt na uplatnenie práv. `ai-sukromie.html` vysvetľuje technický tok; nenahrádza úplné informácie prevádzkovateľa. Potom v GitHub Variables nastavte `AI_PRIVACY_READY=true`, `AI_DAILY_REQUEST_LIMIT=30` a `AI_ENABLED=true`.
5. V Actions spustite **Odboráčik – AI model → Run workflow**. Workflow zostaví bázu, otestuje ju a nasadí službu. Databázu podnetov ani mailové prístupy nepotrebuje. Výstup ukáže verejnú adresu služby.
6. Do tohto chatu potom pošlite iba **verejnú adresu služby** a **verejný Turnstile sitekey**. Doplníme `chatEndpoint` (adresa plus `/api/chat`), `aiTurnstileSiteKey` a `aiPrivacyReady: true` do oboch config.js (`odboracik` a `odborovy-asistent-web`), nasadíme web a otestujeme skutočný model. Tajomstvá zostanú v GitHub Secrets.

Ďalšie zmeny servera a bázy sa nasadzujú automaticky cez GitHub. Webový build zachová už pripojenú verejnú konfiguráciu. `AI_ENABLED` riadi workflow, nevypína existujúcu službu: pre vypnutie odstráňte serverový API kľúč alebo zmeňte serverový `AI_PRIVACY_READY` na false; na webe nastavte `aiPrivacyReady: false`.

## Správanie a limity

Model `gpt-5.4-mini-2026-03-17` používa Responses API a celú overenú bázu 44 právnych a 7 organizačných tém. Žiadne externé nástroje ani vykonávanie úkonov. Históriu dostáva obmedzenú; nepovažuje ju za zdroj zákona. Neznáme témy má priznať alebo spresniť.

Štruktúrovaný výstup určí použité karty; server doplní schválené zdroje a odkazy. To obmedzuje vymyslené odkazy, nezaručuje správnosť každého tvrdenia. Server doplní aj bezpečnostné upozornenia a rámec vážneho prípadu. Pred verejným zapnutím skontrolujte skutočné odpovede na scenároch vrátane pokusov obísť pravidlá.

Návštevník si AI zapne po zobrazení informácie o odosielaní. Skorší miestny chat sa neodosiela. História zostáva v pamäti stránky; vypnutie AI ju vymaže. Server text rozhovoru neeviduje. `store:false` vypína aplikačný stav OpenAI, nie všetky bezpečnostné záznamy poskytovateľa.

Server overuje Turnstile a atomicky obmedzuje používanie: 30 požiadaviek denne celkovo, 10 denne z jedného IP odtlačku. Počítajú sa aj výpadky. Počítadlá sa obnovujú pri ďalšom dni a môžu byť v zálohách poskytovateľa. Nie je to peňažný strop; nastavte rozpočet v OpenAI. Výpadok zobrazí označenú základnú odpoveď.

## Overenie

`node scripts/build-ai.mjs` a `node --test tests/*.test.mjs`. Testy používajú skúšobné odpovede, nevolajú platené API. Prvé Cloudflare nasadenie a kvalita skutočného modelu ešte vyžadujú overenie po doplnení účtov. Generované súbory ai/knowledge.mjs a ai/legal-engine.mjs musia zodpovedať webovej báze.

Oficiálne zdroje: [model](https://developers.openai.com/api/docs/models/gpt-5.4-mini), [štruktúrované odpovede](https://developers.openai.com/api/docs/guides/structured-outputs), [údaje API](https://developers.openai.com/api/docs/guides/your-data), [Turnstile](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [úložisko](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/).
