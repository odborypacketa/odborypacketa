# Odboráčik – aktívna zdrojovaná báza

44 právnych kariet a 7 praktických tém členstva a kontaktu overených 10. októbra 2026. Obsah je v knowledge-base.js, spracovanie v legal-engine.js. Bot poskytuje pripravené vysvetlenia lokálne v prehliadači, rozlišuje viac tém a udržiava kontext nadväzujúcich otázok. Nepoužíva externý jazykový model. Otázky neposiela na server.

Verzia 1.1 rozpoznáva vybrané preklepy doménových slov, nadväzujúce otázky bez zopakovania témy a zmenu témy. Pri odboroch ponúka prihlášku, príspevok, doručenie, rozhodnutie a súkromie; pri dovolenke a výpovedi relevantné ďalšie otázky. Klikateľné pokračovania vedú cez rovnaký rozhovorový mechanizmus. Pri nejasnej otázke žiada spresnenie, neodvodzuje členstvo ani nevymýšľa odpoveď.

Praktické informácie organizácie pochádzajú z verejnej hlavnej stránky a textu jej prihlášky, nie zo zákona. Lehota 3 pracovné dni je od rozhodnutia výboru, nie od podania prihlášky. Výšku príspevku nevymýšľa; informáciu o neurčenej výške označuje dátumom kontroly. Súbory bota sa publikujú z /odboracik; pri zmene synchronizujte rovnaké súbory aj v zdrojovom /odborovy-asistent-web.

Zdrojové podklady a 84 akceptačných scenárov sú v legal-research. Testy kontrolujú rozpoznanie tém, obsah a hranice odpovedí, vybrané výpočty, ochranu dát a integráciu. Zložité individuálne závery zostávajú na overení odbormi alebo advokátom.

Pri iných rokoch a po 31. decembri 2026 zobrazí bot upozornenie na potrebu nového overenia. Neoverené ročné sumy nepotvrdzuje pre iný rok. Pred aktualizáciou bázy preveriť príslušné verzie zákonov a zmeniť testy spolu s kartami.
