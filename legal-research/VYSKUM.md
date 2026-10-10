# Odboráčik – zdrojovaná právna báza

Výskum k 10. októbru 2026. Určené pre základné odpovede zamestnancom na Slovensku. Stav: pripravené na integráciu, bez nasadenia do verejného bota.

## Výsledok a metóda

Použitá zručnosť Odborový asistent 2.0. Pravidlá sú uložené v súboroch; nejde o trvalé pretrénovanie modelu. Overené boli právne záväzné PDF na Slov-Lexe a časové verzie predpisov. Oficiálne vysvetlenia MPSVR a Sociálnej poisťovne dopĺňajú výklad, nenahrádzajú zákon. Každá karta má konkrétne paragrafy, odpoveď, podmienky, otázky a výnimky. Relevantné znenie sa pri staršej udalosti musí overiť k dátumu udalosti.

Zákonník práce použitý v tejto báze je účinný od 1. septembra 2026. Výskum nie je súdne rozhodnutie ani potvrdenie individuálneho prípadu advokátom. Číselné sadzby a lehoty sa nesmú používať bez kontextu a dátumu. Aktuálnosť sa musí znovu overiť pred nasadením a pri zmene predpisu.

## Zistenia pre existujúceho bota

Pôvodná báza má 28 prevažne všeobecných odpovedí a výber prvého regexového zásahu. Základné otázky často končia formulárom namiesto vysvetlenia. Krátke vzory ako „pn“ môžu zachytiť nesúvisiace slová. Nová báza má nahradiť obsah a doplniť rozpoznanie zámeru, prácu s viacerými témami a doplňujúce otázky. Samotné vloženie JSON bez zmeny obsluhy chatu nezaručí správne odpovede.

## Tri hlavné témy

**Čo sú odbory:** priama odpoveď o zastupovaní, vyjednávaní a kontrole. Žiadny formulár nie je potrebný na vysvetlenie pojmu.

**Ako dať výpoveď:** písomne, preukázateľne doručiť; zamestnanec nemusí uvádzať dôvod ani získavať súhlas. Pre dĺžku výpovednej doby zistiť začiatok pomeru, doručenie a zmluvu. Príklad: pri najmenej ročnom pomere a dvojmesačnej dobe, doručenie 20. októbra 2026 znamená plynutie od 1. novembra do 31. decembra 2026. Tento príklad sa nesmie automaticky preniesť na výpoveď zamestnávateľa alebo dohodu.

**Koľko dovolenky:** najmenej štyri týždne, päť pri veku 33 rokov dosiahnutom do konca roka alebo trvalej starostlivosti o dieťa. Počet dní a zostatok závisia od rozvrhu, trvania pomeru, oznámenia starostlivosti, výkonu práce a absencií. Dvanásťhodinová zmena neznamená automaticky 25 zmien dovolenky.

## Rozsah a hranice

Zahrnuté sú základné odborové a pracovnoprávne témy nižšie. Presné dávkové výpočty, OČR, materské, podrobná hmotná zodpovednosť, konkurz, štrajkový postup, zahraničné vyslanie a vodičské režimy nie sú automaticky pokryté. Pri neznámej téme treba dohľadať aktuálny primárny zdroj, nie vymyslieť odpoveď.

Chýba overená kolektívna zmluva Packeta, stanovy ZO, výška členských príspevkov, aktuálne interné pracovné a mzdové pravidlá a mandát na zastupovanie konkrétneho prípadu. Bot preto nesmie tvrdiť, že firma poskytuje určitý benefit, že sú členovia vždy zastúpení právnikom alebo že odbory už prípad prevzali. Výskum neaktivoval zber komunikácie ani mailové preposielanie.

## Register zdrojov

- **ZP:** [Zákon č. 311/2001 Z. z. Zákonník práce](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf). právne záväzné konsolidované znenie; verzia od 2026-09-01; overené 2026-10-10.
- **KV:** [Zákon č. 2/1991 Zb. o kolektívnom vyjednávaní](https://static.slov-lex.sk/pdf/SK/ZZ/1991/2/ZZ_1991_2_20250701.pdf). právne záväzné konsolidované znenie; verzia od 2025-07-01; overené 2026-10-10.
- **BOZP:** [Zákon č. 124/2006 Z. z. o BOZP](https://static.slov-lex.sk/pdf/SK/ZZ/2006/124/ZZ_2006_124_20250701.pdf). právne záväzné konsolidované znenie; verzia od 2025-07-01; overené 2026-10-10.
- **AD:** [Zákon č. 365/2004 Z. z. antidiskriminačný zákon](https://static.slov-lex.sk/pdf/SK/ZZ/2004/365/ZZ_2004_365_20250701.pdf). právne záväzné konsolidované znenie; verzia od 2025-07-01; overené 2026-10-10.
- **PN:** [Zákon č. 462/2003 Z. z. o náhrade príjmu pri PN](https://static.slov-lex.sk/pdf/SK/ZZ/2003/462/ZZ_2003_462_20260101.pdf). právne záväzné konsolidované znenie; verzia od 2026-01-01; overené 2026-10-10.
- **MM:** [Oznámenie MPSVR č. 245/2025 Z. z. – minimálna mzda 2026](https://static.slov-lex.sk/pdf/SK/ZZ/2025/245/ZZ_2025_245.pdf). právne záväzné oznámenie; verzia od 2026-01-01; overené 2026-10-10.
- **MPSVR:** [MPSVR – minimálna mzda a prepočet úväzkov](https://employment.gov.sk/showdoc.do?docid=441&forceBrowserDetector=blind). oficiálny výklad, nie právny predpis; verzia od pozri obsah stránky; overené 2026-10-10.
- **SP:** [Sociálna poisťovňa – PN od roku 2026 a prechodné pravidlá](https://www.socpoist.sk/news/zmena-2026-socialna-poistovna-bude-nemocensku-davku-od-noveho-roku-vyplacat-od-15-dna). oficiálny výklad, nie právny predpis; verzia od 2026-01-01; overené 2026-10-10.

## Prehľad kritických lehôt

| Situácia | Pravidlo | Podmienka / výnimka |
|---|---|---|
| Lehoty kolektívneho vyjednávania | Odpoveď na návrh: 30 dní, ak nie je dohodnuté inak. | Pozri podmienky a výnimky karty `vyjednavanie`. |
| Lehoty kolektívneho vyjednávania | Začatie rokovania o novej zmluve: najmenej 60 dní pred skončením platnosti uzavretej kolektívnej zmluvy. | Pozri podmienky a výnimky karty `vyjednavanie`. |
| Ako dať vlastnú výpoveď | Začiatok výpovednej doby: prvý deň kalendárneho mesiaca po doručení. | Pozri podmienky a výnimky karty `vlastna_vypoved`. |
| Okamžité skončenie zamestnancom | Nevyplatenie ani do 15 dní po splatnosti. | Pozri podmienky a výnimky karty `okamzite_skoncenie`. |
| Okamžité skončenie zamestnancom | Okamžité skončenie zamestnancom: jeden mesiac od zistenia dôvodu. | Pozri podmienky a výnimky karty `okamzite_skoncenie`. |
| Lehota na napadnutie skončenia | Všeobecne 2 mesiace od dňa zamýšľaného skončenia. | Pozri podmienky a výnimky karty `neplatne_skoncenie`. |
| Lehota na napadnutie skončenia | Výnimka § 77 pri § 64 ods. 1 písm. a): 2 mesiace po ochrane, najneskôr 6 mesiacov od pôvodného konca. | Pozri podmienky a výnimky karty `neplatne_skoncenie`. |
| Odbory pri výpovedi zamestnávateľa | Prerokovanie výpovede: 7 pracovných dní. | Pozri podmienky a výnimky karty `prerokovanie_vypovede`. |
| Odbory pri výpovedi zamestnávateľa | Prerokovanie okamžitého skončenia: 2 pracovné dni. | Pozri podmienky a výnimky karty `prerokovanie_vypovede`. |
| Kto určuje dovolenku | Oznámenie čerpania: aspoň 14 dní, výnimočne kratšie so súhlasom. | Pozri podmienky a výnimky karty `dovolenka_termin`. |
| Prenesená dovolenka | 30. jún nasledujúceho roka: podmienka práva určiť čerpanie. | Pozri podmienky a výnimky karty `dovolenka_prenos`. |
| Prenesená dovolenka | Písomné oznámenie zamestnancom: aspoň 30 dní vopred, ak nie je súhlas s kratšou lehotou. | Pozri podmienky a výnimky karty `dovolenka_prenos`. |
| Oznámenie rozvrhu zmien | Rozvrh: najmenej týždeň vopred a najmenej na týždeň. | Pozri podmienky a výnimky karty `rozvrh`. |
| Odpočinok medzi zmenami | Náhradný denný odpočinok po skrátení podľa § 92 ods. 2: do 30 dní. | Pozri podmienky a výnimky karty `odpocinok`. |
| Platba za nadčas | Náhradné voľno pri nedohodnutom termíne: do 4 kalendárnych mesiacov po mesiaci nadčasu. | Pozri podmienky a výnimky karty `nadcas_odmena`. |
| Práca vo sviatok | Náhradné voľno za sviatok: do 3 kalendárnych mesiacov po mesiaci práce, alebo v inom dohodnutom období. | Pozri podmienky a výnimky karty `sviatok`. |
| Doklady po skončení | Posudok: do 15 dní od žiadosti, nie povinne skôr než 2 mesiace pred koncom. | Pozri podmienky a výnimky karty `doklady_skoncenie`. |
| Doklady po skončení | Žaloba na úpravu obsahu po odmietnutí nápravy: 3 mesiace od dozvedenia sa obsahu. | Pozri podmienky a výnimky karty `doklady_skoncenie`. |

## Znalostné karty

### 1. Čo sú odbory a čo robia

**Priama odpoveď:** Odbory sú organizácia zamestnancov, ktorá zastupuje ich pracovné a sociálne záujmy. Môžu vyjednávať kolektívnu zmluvu, kontrolovať dodržiavanie pracovných predpisov a zastupovať zamestnancov pri rokovaní so zamestnávateľom.

Odborová organizácia je občianske združenie. Zamestnanci sa cez svojich zástupcov zúčastňujú na rozhodovaní, prerokovaní, informovaní a kontrole podľa konkrétneho zákonného oprávnenia. Kolektívne vyjednávanie patrí odborom. Odbory nemôžu samy zmeniť zákon ani zaručiť výsledok súdneho sporu. Rozsah individuálnej pomoci, členstvo a príspevky závisia od stanov a rozhodnutí konkrétnej organizácie.

**Výnimky a hranice:** Nevymýšľať členské príspevky, dostupnosť právnika ani aktuálne výhody ZO Packeta.

**Právny základ:** [ZP – § 229, § 230 ods. 1, § 231](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf); [KV – § 1–3](https://static.slov-lex.sk/pdf/SK/ZZ/1991/2/ZZ_1991_2_20250701.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 2. Kolektívna zmluva a nečlenovia

**Priama odpoveď:** Kolektívna zmluva je dohoda odborov a zamestnávateľa o pracovných podmienkach a nárokoch. Príslušné odbory ju uzatvárajú aj za zamestnancov, ktorí nie sú členmi odborov.

Môže priniesť vyššiu mzdu, viac dovolenky alebo iné výhody v zákonom prípustnom rozsahu. Pracovná zmluva nesmie priznať menší nárok než záväzná kolektívna zmluva. Treba overiť presného zamestnávateľa, osobnú a časovú pôsobnosť zmluvy aj jej dodatky. Samotné pôsobenie odborov nedokazuje existenciu uzatvorenej kolektívnej zmluvy.

**Na spresnenie:** U ktorého zamestnávateľa pracujete a o ktoré obdobie ide?

**Výnimky a hranice:** Aktuálna kolektívna zmluva Packeta nebola dodaná ani overená.

**Právny základ:** [ZP – § 231](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf); [KV – § 2, § 4, § 5 ods. 4–5](https://static.slov-lex.sk/pdf/SK/ZZ/1991/2/ZZ_1991_2_20250701.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 3. Lehoty kolektívneho vyjednávania

**Priama odpoveď:** Na písomný návrh kolektívnej zmluvy musí druhá strana písomne odpovedať najneskôr do 30 dní, ak sa strany nedohodnú inak. Musí sa vyjadriť k neprijatým častiam.

Vyjednávanie sa začína predložením písomného návrhu. Rokovanie o novej zmluve sa musí začať najmenej 60 dní pred skončením platnosti uzavretej kolektívnej zmluvy. Pred rokovaním overiť mandát príslušného odborového orgánu a postup pri viacerých odborových organizáciách.

**Na spresnenie:** Kedy a komu bol návrh predložený? Existuje dohoda o inej lehote a kedy končí platná zmluva?

**Výnimky a hranice:** Tridsať dní nie je všeobecná lehota na každú odborovú či zamestnaneckú sťažnosť.

**Právny základ:** [KV – § 3, § 3a, § 8](https://static.slov-lex.sk/pdf/SK/ZZ/1991/2/ZZ_1991_2_20250701.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 4. Ako dať vlastnú výpoveď

**Priama odpoveď:** Ako zamestnanec môžete dať výpoveď z akéhokoľvek dôvodu alebo bez uvedenia dôvodu. Musí byť písomná a doručená zamestnávateľovi. Jeho súhlas s výpoveďou nepotrebujete.

Uveďte, že dávate výpoveď z pracovného pomeru, identifikujte pracovný pomer, doplňte dátum a podpis. Odovzdajte ju na pracovisku s potvrdením prevzatia na svojej kópii alebo ju pošlite doporučene. Výpovedná doba beží od prvého dňa nasledujúceho kalendárneho mesiaca. Ak pracovný pomer pri doručení trvá menej ako rok, zákonné minimum je jeden mesiac; pri najmenej roku dva mesiace. Overte prípadnú dlhšiu dohodnutú dobu. Počas nej pracovný pomer ďalej trvá.

**Na spresnenie:** Ide o pracovný pomer alebo dohodu o práci mimo pracovného pomeru? Odkedy trvá pomer a kedy chcete výpoveď doručiť? Je v zmluve dohodnutá dlhšia výpovedná doba?

**Výnimky a hranice:** Vlastná výpoveď automaticky nezakladá odstupné. Skúšobná doba, okamžité skončenie a dohoda o skončení sú odlišné postupy. Pri nadväzujúcich pomeroch overiť aj § 40 ods. 12.

**Právny základ:** [ZP – § 38 ods. 3–4, § 40 ods. 12, § 61, § 62 ods. 2, 6–8, § 67](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 5. Doručenie výpovede

**Priama odpoveď:** Pri vlastnej výpovedi použite písomnú listinu a preukázateľné doručenie na pracovisku alebo doporučenou zásielkou. Rozhodujúce je doručenie, nie dátum napísania alebo podania na pošte.

Na svojej kópii si nechajte potvrdiť prevzatie s dátumom. Odmietnutie prevzatia môže mať podľa zákona účinky doručenia, ale treba vedieť preukázať komu, kde a kedy bola listina predložená. Obyčajný e-mail alebo správa v chate nie sú bezpečný všeobecný návod na splnenie osobitných pravidiel doručovania skončenia pracovného pomeru.

**Na spresnenie:** Komu, ako a kedy bola listina doručovaná? Máte potvrdenie, sledovanie zásielky alebo svedka?

**Výnimky a hranice:** Nesľubovať platnosť konkrétneho elektronického doručenia bez posúdenia podpisu, formy a okolností.

**Právny základ:** [ZP – § 38, § 61 ods. 1](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 6. Skončenie dohodou

**Priama odpoveď:** Dohoda o skončení vyžaduje súhlas vás aj zamestnávateľa. Pracovný pomer končí dohodnutým dňom, bez zákonnej výpovednej doby. Dohoda má byť písomná a dostanete jej vyhotovenie.

Výraz „výpoveď dohodou“ spája dve odlišné veci. Pri výpovedi súhlas druhej strany netreba, pri dohode áno. Dôvod v dohode musí byť uvedený, ak to zamestnanec požaduje alebo ide o zákonom uvedené dôvody podľa § 63 ods. 1 písm. a) až c) a f). Dôvod môže byť rozhodujúci pre odstupné. Pred podpisom preveriť dátum, dôvod, nároky a prípadné vzdanie sa či vyrovnanie nárokov.

**Na spresnenie:** Navrhujete dohodu vy alebo zamestnávateľ? Aký dôvod a dátum obsahuje návrh?

**Výnimky a hranice:** Nepodpisovať pod nátlakom bez porozumenia obsahu; bot nemá deklarovať neplatnosť už podpísanej dohody.

**Právny základ:** [ZP – § 60, § 76](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 7. Výpoveď od zamestnávateľa

**Priama odpoveď:** Zamestnávateľ môže dať výpoveď iba zo zákonného dôvodu. Výpoveď musí byť písomná, doručená a dôvod musí byť konkrétne opísaný. Podpis prevzatia sám osebe nie je súhlasom so skončením.

Zákon pozná napríklad organizačné dôvody, dlhodobú zdravotnú nespôsobilosť, určité nesplnenie predpokladov či pracovné nedostatky a disciplinárne dôvody. Podmienky sa líšia; niektoré vyžadujú predchádzajúcu výzvu alebo upozornenie a ponuku inej práce. Treba preskúmať ochrannú dobu a prerokovanie so zástupcami zamestnancov. O neplatnosti nerozhodne samotný bot ani nesúhlas odborov; spor rozhoduje súd.

**Na spresnenie:** Aký dôvod je v listine a kedy ste ju prevzali? Kedy sa má pomer skončiť a odkedy trvá? Ste na PN, v tehotenstve alebo na rodičovskej či inej chránenej dovolenke?

**Výnimky a hranice:** Vyžaduje individuálne posúdenie; ihneď upozorniť na § 77, nečakať na odpoveď odborov.

**Právny základ:** [ZP – § 14, § 61–64, § 74, § 77](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `urgent_legal`; overené 2026-10-10.

### 8. Výpovedná doba pri prepustení

**Priama odpoveď:** Pri výpovedi zamestnávateľa závisí minimum od dôvodu a trvania pomeru. Pri organizačných dôvodoch a dlhodobej zdravotnej nespôsobilosti je pri trvaní aspoň rok a menej než päť rokov najmenej dva mesiace, pri aspoň piatich rokoch najmenej tri mesiace.

Ak pomer trvá menej než rok, všeobecné minimum je jeden mesiac. Pri ostatných dôvodoch zamestnávateľa a trvaní aspoň rok je najmenej dvojmesačná doba. Zmluva môže obsahovať dlhšiu dobu. Dĺžka sa zisťuje ku dňu doručenia; do plynutia môže zasiahnuť ochranná doba podľa § 64. Výpočet pre vlastnú výpoveď je odlišný.

**Na spresnenie:** Kto dáva výpoveď, z akého dôvodu a kedy bola doručená? Odkedy trvá pomer vrátane bezprostredne nadväzujúcich pomerov? Je dohodnutá dlhšia doba alebo ide o ochrannú dobu?

**Výnimky a hranice:** Nepoužiť automaticky trojmesačnú dobu pri vlastnej výpovedi po piatich rokoch.

**Právny základ:** [ZP – § 40 ods. 12, § 62, § 64](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 9. Okamžité skončenie zamestnancom

**Priama odpoveď:** Okamžité skončenie je možné len zo zákonných dôvodov. Jedným je nevyplatenie mzdy alebo jej časti ani do 15 dní po splatnosti. Samotné omeškanie oproti očakávanému výplatnému dňu ešte nestačí na automatický záver.

Ďalším dôvodom je lekársky posudok o vážnom ohrození zdravia a nepreradenie na vhodnú prácu do 15 dní od jeho predloženia, alebo bezprostredné ohrozenie života či zdravia. Zamestnanec musí skončenie písomne, konkrétne odôvodniť a doručiť v lehote jedného mesiaca odkedy sa dozvedel o dôvode. Pri platnom postupe má nárok na náhradu mzdy vo výške priemerného mesačného zárobku za dva mesiace. Pred použitím nech listinu a výpočet lehôt posúdia odbory alebo advokát.

**Na spresnenie:** Aký je dôvod a kedy ste sa o ňom dozvedeli? Pri mzde: za ktorý mesiac, aká splatnosť je dohodnutá a čo bolo uhradené?

**Výnimky a hranice:** Neradiť jednoducho prestať chodiť do práce. Výplatný termín a splatnosť rozlišovať. Pre mladistvých existuje ďalší zákonný dôvod.

**Právny základ:** [ZP – § 69–70, § 129](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `urgent_legal`; overené 2026-10-10.

### 10. Skončenie v skúšobnej dobe

**Priama odpoveď:** Počas platnej skúšobnej doby môžete pracovný pomer skončiť písomne z akéhokoľvek dôvodu alebo bez uvedenia dôvodu. Oznámenie sa má doručiť spravidla aspoň tri dni pred skončením.

Slovo „spravidla“ sa nesmie zmeniť na tvrdenie, že kratšie oznámenie je vždy neplatné. Najprv overiť, či skúšobná doba bola platne dohodnutá, či ešte plynie a či sa nepredĺžila pre prekážky. Pre zamestnávateľa platia osobitné obmedzenia pri tehotnej žene, matke do deviatich mesiacov po pôrode, dojčiacej žene a mužovi na otcovskej dovolenke.

**Na spresnenie:** Je skúšobná doba dohodnutá písomne a odkedy pracujete? Kto chce pomer skončiť a boli celé neodpracované zmeny pre prekážky?

**Výnimky a hranice:** Tento postup nepoužiť po uplynutí skúšobnej doby.

**Právny základ:** [ZP – § 45, § 72](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 11. Koniec pracovného pomeru na dobu určitú

**Priama odpoveď:** Pomer na dobu určitú sa končí uplynutím dohodnutej doby. Na tento spôsob skončenia netreba dávať výpoveď.

Ak po uplynutí doby pokračujete v práci s vedomím zamestnávateľa, pomer sa mení na neurčitý čas, pokiaľ sa nedohodnete inak. Ak chcete skončiť skôr, treba použiť niektorý zo zákonných spôsobov. Ochranná doba sama osebe všeobecne neposúva dohodnuté uplynutie doby; nevydávať pravidlá zákazu výpovede za zákaz všetkých spôsobov skončenia.

**Na spresnenie:** Aký deň alebo udalosť určuje koniec zmluvy? Pracovali ste po ňom s vedomím zamestnávateľa?

**Výnimky a hranice:** Overiť text zmluvy; pri spore o opakované predlžovanie treba samostatne § 48.

**Právny základ:** [ZP – § 59 ods. 2, § 71](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 12. Kedy vzniká odstupné

**Priama odpoveď:** Pri vlastnej bežnej výpovedi zákonné odstupné automaticky nevzniká. Pri vybraných dôvodoch zamestnávateľa závisí nárok od dôvodu, dĺžky pomeru a toho, či končíte výpoveďou alebo dohodou.

Pri organizačných dôvodoch alebo dlhodobej zdravotnej nespôsobilosti podľa lekárskeho posudku sú minimá pri výpovedi: menej než 2 roky bez nároku podľa § 76 ods. 1; 2 až menej než 5 rokov 1 priemerný mesačný zárobok; 5 až menej než 10 rokov 2; 10 až menej než 20 rokov 3; aspoň 20 rokov 4. Pri dohode z rovnakých dôvodov: menej než 2 roky 1; 2 až menej než 5 rokov 2; 5 až menej než 10 rokov 3; 10 až menej než 20 rokov 4; aspoň 20 rokov 5. Toto nie je vyčerpávajúci zoznam zákonných situácií: § 76 zahŕňa aj dôvod podľa § 63 ods. 1 písm. f), osobitné zdravotné situácie a výnimky. Výhodnejšie plnenie môže vyplývať zo zmluvy.

**Na spresnenie:** Kto a akým spôsobom pomer končí? Aký konkrétny dôvod je uvedený a ako dlho pomer trval? Existuje výhodnejšia kolektívna alebo pracovná zmluva?

**Výnimky a hranice:** Pracovný úraz, choroba z povolania, prechod k inému zamestnávateľovi a opätovný nástup vyžadujú samostatné posúdenie. Priemer nie je automaticky základná mesačná mzda.

**Právny základ:** [ZP – § 40 ods. 12, § 60, § 76, § 134](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 13. Lehota na napadnutie skončenia

**Priama odpoveď:** Neplatnosť skončenia sa spravidla musí uplatniť na súde do dvoch mesiacov odo dňa, keď sa mal pracovný pomer skončiť. Lehota sa nepočíta jednoducho od prevzatia výpovede. Kontaktujte advokáta bezodkladne.

§ 77 má osobitnú výnimku, keď sa pomer predlžuje podľa § 64 ods. 2 pre ochrannú dobu podľa § 64 ods. 1 písm. a): zamestnanec môže napadnúť výpoveď do dvoch mesiacov po poslednom dni ochrannej doby, najneskôr do šiestich mesiacov od pôvodného skončenia bez ochrany. Na iné predĺženie podľa § 64 ods. 2 sa pre základnú lehotu neprihliada. Pri trvaní na ďalšom zamestnávaní je relevantné oznámenie zamestnávateľovi podľa § 79; nenahrádza žalobu. Rokovanie, e-mail odborom ani podnet inšpektorátu nenahrádzajú včasné uplatnenie na súde.

**Na spresnenie:** Ako mal pomer skončiť a v ktorý deň? Kedy bola listina doručená? Plynula PN či iná ochranná doba a kedy skončila?

**Výnimky a hranice:** Nikdy nečakať s upozornením na lehotu, kým používateľ odpovie. Bot bez presných okolností nevypočíta konečný posledný deň.

**Právny základ:** [ZP – § 36, § 64, § 77, § 79](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `urgent_legal`; overené 2026-10-10.

### 14. Odbory pri výpovedi zamestnávateľa

**Priama odpoveď:** Výpoveď alebo okamžité skončenie zo strany zamestnávateľa sa musí vopred prerokovať so zástupcami zamestnancov, inak je neplatné. Prerokovanie nie je automaticky súhlas ani veto odborov.

Zástupcovia majú na prerokovanie výpovede sedem pracovných dní a na okamžité skončenie dva pracovné dni od doručenia písomnej žiadosti. Ak sa v tejto lehote neprerokuje, považuje sa za prerokované. Ak zástupcovia u zamestnávateľa nepôsobia, platí § 12 ods. 2. Osobitná ochrana funkcionárov podľa § 240 je odlišná od bežného prerokovania.

**Na spresnenie:** Kto dáva výpoveď a pôsobia u zamestnávateľa zástupcovia? Ide o člena odborového orgánu alebo iného chráneného zástupcu?

**Výnimky a hranice:** Na vlastnú výpoveď zamestnanca sa § 74 nevzťahuje. Individuálnu neplatnosť musí posúdiť súd.

**Právny základ:** [ZP – § 12 ods. 2, § 74, § 240](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 15. Základný nárok na dovolenku

**Priama odpoveď:** Základná ročná výmera je najmenej štyri týždne. Ak do konca daného roka dovŕšite 33 rokov alebo sa trvale staráte o dieťa, je najmenej päť týždňov. Pri pravidelnom päťdňovom pracovnom týždni to zodpovedá 20 alebo 25 pracovným dňom za celý rok.

Ide o výmeru, nie automaticky o konečný zostatok na čerpanie. Ten závisí od trvania pomeru, započítaného výkonu práce, rozvrhu, čerpania a prípadného krátenia. Starostlivosť o dieťa podľa § 40 ods. 11 zahŕňa osobnú aj striedavú starostlivosť o neplnoleté dieťa; status vzniká písomným oznámením zamestnávateľovi. Pri začatí alebo skončení starostlivosti počas roka sa zvýšenie nad štyri týždne určuje pomerne podľa kalendárnych dní starostlivosti. Vek a dieťa nedávajú spolu desať týždňov. Osobitné profesie majú zákonnú vyššiu výmeru; zmluva môže tiež priznať viac.

**Na spresnenie:** O ktorý rok ide a koľko rokov dovŕšite do jeho konca? Trvale sa staráte o neplnoleté dieťa a odkedy ste to písomne oznámili? Trval pomer celý rok a aký máte rozvrh?

**Výnimky a hranice:** Pri dohodách mimo pracovného pomeru nepredpokladať automatický zákonný nárok podľa týchto pravidiel. Pri nerovnomerných zmenách nepreberať automaticky 20/25 dní.

**Právny základ:** [ZP – § 40 ods. 11, § 100–105, § 109, § 144a](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 16. Pomerná dovolenka a 60 dní

**Priama odpoveď:** Pri splnení podmienky aspoň 60 dní výkonu práce sa pomerná dovolenka určuje po jednej dvanástine ročnej dovolenky za každý celý kalendárny mesiac nepretržitého trvania pomeru. Ak podmienka 60 dní nie je splnená, používa sa dovolenka za odpracované dni.

Pri dovolenke za odpracované dni patrí jedna dvanástina ročnej dovolenky za každých 21 odpracovaných dní. Zákon upravuje, čo je výkon práce na účely dovolenky; PN, rodičovská a ďalšie prekážky sa neposudzujú rovnako ako materská, dovolenka alebo určité pracovné úrazy. Celý kalendárny mesiac nie je ľubovoľný úsek 30 dní. Ilustrácia: pri výmere 20 dní, pomere od 1. júla do 31. decembra a splnených podmienkach bez krátenia je 6/12 × 20 = 10 dní.

**Na spresnenie:** Aké sú presné dátumy pomeru? Aký rozvrh a započítané dni výkonu práce máte? Boli PN, rodičovská alebo iné absencie?

**Výnimky a hranice:** Nepočítať presný nárok iba z mesiaca nástupu. Pravidlá započítania pri zmenách overiť aj podľa § 144a ods. 4.

**Právny základ:** [ZP – § 101–105, § 144a](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 17. Dovolenka pri zmenách a kratšom úväzku

**Priama odpoveď:** Dovolenka sa vyjadruje v týždňoch. Počet pracovných dní závisí od rozvrhu. Pri nerovnomernom rozvrhu zákon vychádza z celoročného priemeru pracovných dní.

Pravidelných päť kratších zmien v týždni sa nesmie zameniť s dvoma či troma pracovnými dňami. Pri štyroch týždňoch a pravidelných troch pracovných dňoch týždenne zodpovedá plná ročná výmera 12 pracovným dňom; pri piatich kratších pracovných dňoch 20 dňom. Pri meniacich sa dvanásťhodinových zmenách treba vychádzať z rozvrhu a celoročného priemeru podľa § 104, nie mechanicky deliť všetko ôsmimi hodinami.

**Na spresnenie:** Koľko dní týždenne pracujete a je rozvrh rovnomerný? Aká je dĺžka zmien a celoročný rozvrh?

**Výnimky a hranice:** Príklady predpokladajú celý rok a splnenie ostatných podmienok; nie výpočet konkrétneho zostatku.

**Právny základ:** [ZP – § 103–104a](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 18. Kto určuje dovolenku

**Priama odpoveď:** Čerpanie dovolenky určuje zamestnávateľ po prerokovaní so zamestnancom. Musí prihliadať aj na vaše oprávnené záujmy a čerpanie oznámiť aspoň 14 dní vopred.

Lehotu možno výnimočne skrátiť s vaším súhlasom. Ak sa dovolenka čerpá po častiach, aspoň jedna časť má trvať dva týždne, ak sa nedohodnete inak. Samotná žiadosť o dovolenku nie je jej schválením. Osobitný postup existuje pre prenesenú dovolenku, ktorú zamestnávateľ neurčil do 30. júna nasledujúceho roka.

**Na spresnenie:** Kedy vám čerpanie oznámili a súhlasili ste s kratšou lehotou? Ide o dovolenku tohto alebo minulého roka?

**Výnimky a hranice:** Rozlíšiť individuálnu dovolenku a hromadné čerpanie. Bez schválenia neodporúčať svojvoľnú absenciu.

**Právny základ:** [ZP – § 111, § 113 ods. 2](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 19. Prenesená dovolenka

**Priama odpoveď:** Ak dovolenku nemožno vyčerpať v danom roku pre neurčenie čerpania zamestnávateľom alebo pre prekážky na vašej strane, zamestnávateľ ju má poskytnúť do konca nasledujúceho roka.

Ak do 30. júna nasledujúceho roka neurčí čerpanie tak, aby sa dovolenka vyčerpala do jeho konca, môžete termín určiť vy. Písomne ho oznámte aspoň 30 dní vopred; kratšia lehota vyžaduje súhlas zamestnávateľa. PN, materská, otcovská a rodičovská majú osobitné pravidlá poskytnutia po skončení prekážok, ak čerpanie nebolo možné ani do konca nasledujúceho roka.

**Na spresnenie:** Za ktorý rok je dovolenka a koľko jej zostáva? Určil zamestnávateľ čerpanie do 30. júna? Bráni čerpaniu PN alebo chránená dovolenka?

**Výnimky a hranice:** Tvrdenie „vždy prepadne 31. decembra“ je nesprávne. Samostatné určenie má zákonné podmienky.

**Právny základ:** [ZP – § 113](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 20. Preplatenie a prerušenie dovolenky

**Priama odpoveď:** Za čerpanú dovolenku patrí náhrada mzdy podľa priemerného zárobku. Základné štyri týždne sa počas trvania pomeru zásadne nemajú nahrádzať peniazmi; výnimkou je nemožnosť vyčerpať ich pre skončenie pomeru.

Za časť nad štyri týždne, ktorú nemožno vyčerpať ani do konca nasledujúceho roka, zákon upravuje náhradu. Dodatková dovolenka má odlišný režim a musí sa čerpať. Uznaná PN počas dovolenky ju podľa § 114 prerušuje. Ak zamestnávateľ zmení čerpanie alebo vás odvolá, musí nahradiť náklady, ktoré bez vášho zavinenia vznikli.

**Na spresnenie:** Končí pomer alebo chcete preplatenie počas jeho trvania? Za ktorý rok a aký druh dovolenky ide? Bola PN uznaná lekárom?

**Výnimky a hranice:** Nevyčerpaný zostatok a priemer musia byť overené. Dovolenku nemožno určovať na PN, materskú, otcovskú ani rodičovskú.

**Právny základ:** [ZP – § 107, § 112, § 114, § 116](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 21. Krátenie dovolenky pri absenciách

**Priama odpoveď:** PN automaticky neznamená odobratie dovolenky za každý deň. Pri splnení podmienky aspoň 60 dní práce môže zamestnávateľ za zákonom uvedené absencie krátiť nárok až podľa stanovených hraníc.

Pri absenciách podľa § 109 ods. 1 je hranica prvých 100 zameškaných pracovných dní na jednu dvanástinu, potom každých ďalších 21 dní na ďalšiu dvanástinu. Pri pracovnom úraze alebo chorobe z povolania, za ktoré zamestnávateľ zodpovedá, a pri materskej či otcovskej sa z týchto dôvodov nekráti. Neospravedlnené zameškanie má samostatné pravidlo jedného až dvoch dní za zmenu. Zákon obsahuje aj minimálny zostatok pri celoročnom pomere.

**Na spresnenie:** Aký dôvod absencií, koľko pracovných dní a ktorý rok? Bol splnený výkon práce 60 dní a trval pomer celý rok? Ide o uznaný pracovný úraz alebo o sporné neospravedlnenie?

**Výnimky a hranice:** Rozlíšiť nevznik nároku, pomernú časť a krátenie existujúceho nároku.

**Právny základ:** [ZP – § 109, § 144a](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 22. Týždenný pracovný čas

**Priama odpoveď:** Ustanovený pracovný čas je najviac 40 hodín týždenne. Pri pravidelnom striedaní v oboch zmenách dvojzmennej prevádzky je najviac 38 a 3/4 hodiny; pri pravidelnom striedaní vo všetkých zmenách trojzmennej alebo nepretržitej prevádzky najviac 37 a 1/2 hodiny.

Priemerný týždenný pracovný čas vrátane nadčasov nesmie všeobecne presiahnuť 48 hodín. Jednotlivý týždeň pri nerovnomernom rozvrhu môže byť odlišný; treba poznať vyrovnávacie obdobie, odpočinok a ďalšie limity. Samotný názov prevádzky bez pravidelného striedania zamestnanca neurčuje kratší zákonný čas.

**Na spresnenie:** Ako pravidelne striedate zmeny a aký máte úväzok? Je pracovný čas rovnomerný a aké je vyrovnávacie obdobie?

**Výnimky a hranice:** Zdravotníctvo, mladiství a osobitné práce majú odlišnosti. Týždenný priemer nie je súhlas s ľubovoľnou dĺžkou zmeny.

**Právny základ:** [ZP – § 85–87, § 97](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 23. Oznámenie rozvrhu zmien

**Priama odpoveď:** Rozvrhnutie pracovného času má zamestnávateľ oznámiť najmenej týždeň vopred a s platnosťou najmenej na týždeň. Zmenu na poslednú chvíľu treba posúdiť podľa jej skutočnej povahy.

Rozlíšte zmenu rozvrhu, zákonne nariadený nadčas, dohodnutú výmenu zmien a prípadný osobitný režim. Uchovajte pôvodný a nový rozvrh aj čas oznámenia. Pravidlá pre dohody mimo pracovného pomeru podľa § 223a sú samostatné.

**Na spresnenie:** Ide o nový rozvrh, nadčas alebo dobrovoľnú výmenu? Kedy boli oba rozvrhy oznámené a aký druh zmluvy máte?

**Výnimky a hranice:** Neoznačiť každú zmenu automaticky za nezákonnú; neodporúčať bez posúdenia nenastúpiť.

**Právny základ:** [ZP – § 90 ods. 9, § 97, § 223a](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 24. Prestávka v práci

**Priama odpoveď:** Pri zmene dlhšej než šesť hodín patrí dospelému zamestnancovi 30 minút na odpočinok a jedenie. Pri mladistvom je hranica dlhšia než štyri a pol hodiny. Bežná prestávka sa nezapočítava do pracovného času.

Prestávka nesmie byť na začiatku ani konci zmeny. Pri práci, ktorú nemožno prerušiť, sa zabezpečuje primeraný čas na odpočinok a jedenie bez prerušenia práce; tento čas sa započítava. Prestávky z dôvodu BOZP sa tiež započítavajú. Presne šesťhodinová zmena dospelého sama osebe nespĺňa hranicu „dlhšia ako šesť hodín“, ale výhodnejšie pravidlo môže byť dohodnuté.

**Na spresnenie:** Koľko máte rokov a ako dlho trvá zmena? Počas prestávky naďalej pracujete alebo musíte obsluhovať pracovisko?

**Výnimky a hranice:** Nevydávať všetky prestávky za neplatené.

**Právny základ:** [ZP – § 91](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 25. Odpočinok medzi zmenami

**Priama odpoveď:** Základ je najmenej 12 po sebe nasledujúcich hodín odpočinku medzi zmenami v priebehu 24 hodín; pri mladistvom najmenej 14 hodín.

U dospelých možno vo výslovne uvedených prípadoch, napríklad pri nepretržitej alebo turnusovej práci, skrátiť odpočinok na osem hodín. Zamestnávateľ musí v takom prípade do 30 dní poskytnúť rovnocenný náhradný odpočinok. Týždenný odpočinok je samostatná vec: základ sú dva po sebe nasledujúce dni, s prevádzkovými výnimkami podľa § 93. Bot nemá schváliť výnimku len preto, že je v sklade veľa práce.

**Na spresnenie:** Kedy presne jedna zmena končí a ďalšia začína? Koľko máte rokov a aký je režim prevádzky? Bol poskytnutý náhradný odpočinok?

**Výnimky a hranice:** Pri týždenných výnimkách treba preveriť konkrétny odsek § 93 a požadovanú dohodu.

**Právny základ:** [ZP – § 92–93](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 26. Čo je nadčas a jeho limity

**Priama odpoveď:** Nadčas je práca na príkaz zamestnávateľa alebo s jeho súhlasom nad určený týždenný čas a mimo rozvrhu zmien. Zamestnancovi s kratším pracovným časom ho nemožno nariadiť.

V bežnom režime možno nariadiť najviac 150 hodín ročne a zamestnanec môže vykonať najviac 400 hodín ročne. Priemer nadčasov je najviac osem hodín týždenne za najviac štyri po sebe idúce mesiace, prípadne až 12 mesiacov po dohode so zástupcami. Zákon má osobitné výnimky a pravidlá nezapočítania niektorých nadčasov; limit nie je automatický súhlas s nariadením. Nadčas má byť pri prechodnej a naliehavej zvýšenej potrebe alebo vo verejnom záujme. Rizikové práce a chránení zamestnanci majú ďalšie obmedzenia.

**Na spresnenie:** Máte plný alebo kratší úväzok a aký rozvrh? Bol nadčas nariadený alebo odsúhlasený? Koľko hodín evidujete a ide o rizikovú prácu či chránenú situáciu?

**Výnimky a hranice:** Dlhšia naplánovaná zmena pri nerovnomernom rozvrhu nemusí byť sama osebe nadčas. Neodporúčať odmietnutie bez overenia konkrétnej situácie.

**Právny základ:** [ZP – § 97, § 99](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 27. Platba za nadčas

**Priama odpoveď:** Za nadčas patrí dosiahnutá mzda a príplatok najmenej 25 % priemerného zárobku; pri rizikových prácach najmenej 35 %. Namiesto príplatku možno dohodnúť náhradné voľno.

Za hodinu nadčasu sa dohodne hodina voľna. Ak sa termín voľna nedohodol, má byť poskytnuté najneskôr do štyroch kalendárnych mesiacov po mesiaci nadčasu; ak poskytnuté nie je, patrí príplatok. Zahrnutie nadčasov do mzdy do 150 hodín ročne možno písomne dohodnúť len pri zákonom určených vedúcich a ďalších vymedzených druhoch práce. Nie pri každom zamestnancovi len preto, že je to napísané v zmluve.

**Na spresnenie:** Kedy bol nadčas a koľko hodín? Máte dohodu o voľne alebo zahrnutí nadčasov do mzdy a akú prácu vykonávate?

**Výnimky a hranice:** Priemer podľa § 134 nie je hodinová minimálna mzda. Dohoda o voľne nenahrádza všetky ostatné súbežné príplatky.

**Právny základ:** [ZP – § 121, § 134](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 28. Príplatok za sobotu

**Priama odpoveď:** Za prácu v sobotu patrí popri mzde najmenej 50 % zákonnej hodinovej minimálnej mzdy za každú hodinu. Vyšší príplatok môže vyplývať zo zmluvy.

Pri zákonných podmienkach pravidelnej sobotnej práce možno dohodnúť nižšie minimum 45 % v kolektívnej zmluve, alebo v pracovnej zmluve pri zamestnávateľovi bez odborov a s menej ako 20 zamestnancami. To nie je všeobecné oprávnenie ľubovoľne znížiť príplatok. Pre vedúcich existuje osobitná možnosť dohodnúť mzdu už s prihliadnutím na sobotnú prácu. V zmenovej prevádzke treba preveriť zákonné vymedzenie dňa.

**Na spresnenie:** Za ktoré obdobie a koľko hodín? Existuje platná dohoda o nižšom príplatku a ste vedúci zamestnanec?

**Výnimky a hranice:** Základom percenta je zákonná hodinová minimálna mzda, nie vaša bežná mzda. Eurovú sumu a zaokrúhlenie treba overiť pre konkrétny rok.

**Právny základ:** [ZP – § 122a](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 29. Príplatok za nedeľu

**Priama odpoveď:** Za prácu v nedeľu patrí popri mzde najmenej 100 % zákonnej hodinovej minimálnej mzdy za každú hodinu.

Pri pravidelnej nedeľnej práci a zákonných podmienkach môže kolektívna zmluva alebo pracovná zmluva u zamestnávateľa bez odborov a s menej ako 20 zamestnancami dohodnúť minimum 90 %. Pre vedúcich je možná osobitná dohoda o zohľadnení nedeľnej práce v mzde. Pri súbehu s nočnou prácou či nadčasom treba posúdiť aj ďalšie nároky, nie automaticky vybrať iba jeden.

**Na spresnenie:** Kedy a koľko hodín ste pracovali? Je dohodnuté zákonné nižšie minimum a ste vedúci?

**Výnimky a hranice:** Pri zmenách sa zákonné vymedzenie dňa môže líšiť od jednoduchého polnoc–polnoc.

**Právny základ:** [ZP – § 122b](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 30. Nočná práca a príplatok

**Priama odpoveď:** Nočná práca je medzi 22.00 a 6.00. Príplatok je najmenej 40 % zákonnej hodinovej minimálnej mzdy za hodinu; pri rizikovej práci najmenej 50 %.

Pri prevažnej nočnej práci a zákonných podmienkach možno pre nerizikovú prácu dohodnúť minimum 35 % kolektívnou zmluvou alebo pracovnou zmluvou u zamestnávateľa bez odborov a s menej ako 20 zamestnancami. Zdravotné posúdenie zamestnanca pracujúceho v noci zabezpečuje a hradí zamestnávateľ; zákon stanovuje posúdenie pred zaradením a pravidelne aspoň raz ročne. Pre vedúcich existuje osobitná dohoda o mzde.

**Na spresnenie:** Koľko hodín spadá medzi 22.00 a 6.00? Je práca riziková a aká dohoda o príplatku platí?

**Výnimky a hranice:** Nočný príplatok nie je 40 % vašej skutočnej mzdy. Nočná zmena a jednotlivé hodiny nočnej práce nie sú totožné pojmy.

**Právny základ:** [ZP – § 98, § 123](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 31. Práca vo sviatok

**Priama odpoveď:** Za prácu vo sviatok patrí dosiahnutá mzda a príplatok najmenej 100 % priemerného zárobku. Možno sa dohodnúť na náhradnom voľne namiesto príplatku.

Za hodinu práce vo sviatok patrí hodina dohodnutého voľna; za jeho čerpanie zákon upravuje náhradu mzdy. Práca vo sviatok a situácia, keď nepracujete pre sviatok, majú odlišné pravidlá. Pred výpočtom treba overiť, či konkrétny dátum je v danom roku sviatkom relevantným pre tento nárok; zákon o sviatkoch sa mení. Pri vedúcich je možná zákonom dovolená dohoda. Ak nie je dohodnuté iné obdobie, náhradné voľno má byť poskytnuté do troch kalendárnych mesiacov po mesiaci práce vo sviatok; inak patrí príplatok. Pri mesačnej mzde sa čerpanie voľna spravidla považuje za odpracovaný čas s mzdou podľa § 122 ods. 2.

**Na spresnenie:** Ktorý konkrétny dátum a rok? Pracovali ste alebo ste nepracovali pre sviatok? Bolo dohodnuté náhradné voľno?

**Výnimky a hranice:** Nevydávať každý pamätný deň za sviatok s príplatkom. Bez overenia zákona č. 241/1993 Z. z. nepočítať konkrétne sviatočné dátumy.

**Právny základ:** [ZP – § 94, § 122](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 32. Minimálna mzda v roku 2026

**Priama odpoveď:** Pre rok 2026 je minimálna mzda 915 € mesačne pri plnom ustanovenom čase a celom odpracovanom fonde, alebo 5,259 € za hodinu pri ustanovenom 40-hodinovom týždni. Ide o hrubé sumy.

Pri kratšom úväzku alebo neúplnom odpracovanom mesiaci sa mesačná suma primerane upravuje. Pri zákonne ustanovenom týždennom čase kratšom ako 40 hodín sa hodinové minimum úmerne zvyšuje; to je iné než individuálny kratší úväzok. Pri porovnaní mzdy s minimom sa nezapočítavajú zákonom vylúčené príplatky a ďalšie plnenia. Podľa náročnosti práce môže byť relevantný vyšší minimálny mzdový nárok; treba overiť § 120 a úpravu odmeňovania kolektívnou zmluvou.

**Na spresnenie:** Za ktorý rok, aký úväzok a aké odpracované hodiny? Aká je náročnosť práce a je odmeňovanie dohodnuté v kolektívnej zmluve?

**Výnimky a hranice:** Sumy platia iba v roku 2026; pre ďalší rok nanovo overiť. Nezamieňať hrubú a čistú mzdu.

**Právny základ:** [MM – oznámená mesačná a hodinová suma na rok 2026](https://static.slov-lex.sk/pdf/SK/ZZ/2025/245/ZZ_2025_245.pdf); [ZP – § 119–120](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf); [MPSVR – Mesačná a hodinová minimálna mzda; doplatok](https://employment.gov.sk/showdoc.do?docid=441&forceBrowserDetector=blind).

Režim bota: `normal`; overené 2026-10-10.

### 33. Splatnosť a výplatná páska

**Priama odpoveď:** Mzda je splatná pozadu za mesačné obdobie, najneskôr do konca nasledujúceho kalendárneho mesiaca, ak pracovná alebo kolektívna zmluva nedohodla inak. Vypláca sa vo výplatnom termíne.

Zamestnávateľ pri vyúčtovaní vydá doklad s údajmi o jednotlivých zložkách mzdy a zrážkach. Pre omeškanie a prípadné okamžité skončenie treba odlíšiť splatnosť od výplatného termínu a preveriť zmluvné znenie. Uchovať zmluvu, pásky, dochádzku a prehľad úhrad; nežiadať verejne celý bankový výpis.

**Na spresnenie:** Za ktorý mesiac mzda chýba a čo stanovuje zmluva? Ktoré položky pásky sú sporné?

**Výnimky a hranice:** Neprítomnosť pásky sama osebe nedokazuje, že celá mzda bola vypočítaná zle.

**Právny základ:** [ZP – § 129–130](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 34. Zrážky a pokuty zo mzdy

**Priama odpoveď:** Zamestnávateľ nemôže ľubovoľne strhávať peniaze. Zákon povoľuje určité zrážky priamo; ďalšie spravidla vyžadujú písomnú dohodu o zrážkach alebo osobitný zákonný základ.

Dane, odvody či vykonateľné rozhodnutia majú osobitný režim. Údajná škoda nie je automaticky oprávnením jednostranne ju zraziť. Treba odlíšiť nárok na náhradu škody, právny titul zrážky a podmienky priznania prémií. Zníženie nepriznanej podmienenej odmeny nemusí byť to isté ako zrážka už vzniknutej mzdy.

**Na spresnenie:** Aká položka a dôvod sú na páske? Existuje písomná dohoda alebo vykonateľné rozhodnutie? Ide o základnú mzdu, zrážku alebo nepriznanú prémiu?

**Výnimky a hranice:** Nedeklarovať porušenie z jednej vety; vyžiadať redigované znenie príslušnej doložky.

**Právny základ:** [ZP – § 131](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 35. Voľno na vlastného lekára

**Priama odpoveď:** Na vyšetrenie alebo ošetrenie, ktoré nebolo možné vykonať mimo pracovného času, patrí voľno s náhradou mzdy na nevyhnutný čas, najviac sedem dní za kalendárny rok. Nejde automaticky o celý deň za každú návštevu.

Po vyčerpaní plateného rozsahu patrí za rovnakých podmienok ďalšie nevyhnutné voľno bez náhrady. Preventívne prehliadky súvisiace s tehotenstvom majú osobitný platený režim. Pri výpočte ročného limitu zákon používa deň podľa priemernej dĺžky a päťdenného týždňa. Vopred známu návštevu treba včas oznámiť a prekážku aj trvanie preukázať.

**Na spresnenie:** Dalo sa vyšetrenie vykonať mimo zmeny a ako dlho trvalo? Koľko plateného času ste už čerpali a aký je týždenný čas?

**Výnimky a hranice:** Nie každý súkromný úkon u lekára automaticky spĺňa podmienky. Nepožadovať diagnózu na základné vysvetlenie. Pri nástupe v priebehu roka môže zamestnávateľ určiť platený rozsah podľa § 141 ods. 6: najmenej tretina nároku za každú začatú tretinu roka trvania pomeru, zaokrúhlenie na celé dni nahor; nepredpokladať bez overenia vždy plný ročný limit.

**Právny základ:** [ZP – § 141 ods. 2 písm. a), ods. 4–6, § 144](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 36. Sprevádzanie rodinného príslušníka

**Priama odpoveď:** Pri nevyhnutnom sprevádzaní rodinného príslušníka na vyšetrenie alebo ošetrenie, ktoré nemožno vybaviť mimo pracovného času, patrí jednému rodinnému príslušníkovi platené voľno na nevyhnutný čas, spravidla najviac sedem dní v roku.

Aktuálne znenie zahŕňa aj neplnoleté dieťa sprevádzané do zariadenia poradenstva a prevencie na odborné činnosti. Osamelý zamestnanec sprevádzajúci dieťa do 15 rokov, ktoré má zverené výlučne do osobnej starostlivosti alebo pri ktorom sám vykonáva rodičovské práva a povinnosti, môže mať ďalších najviac sedem dní. Osobitný limit najviac desať dní sa týka sprevádzania zdravotne postihnutého dieťaťa do zákonom uvedeného zariadenia alebo školy. Treba overiť konkrétnu vetvu.

**Na spresnenie:** Koho a kam sprevádzate a bolo sprevádzanie nevyhnutné? Koľko času ste už čerpali? Pri dieťati: aký vek a ide o osamelého zamestnanca s výlučnou starostlivosťou?

**Výnimky a hranice:** Sprievod nie je automaticky OČR ani automaticky celý deň. Nepoužiť starý univerzálny limit sedem dní bez aktuálnej výnimky. Pri nástupe v priebehu roka môže zamestnávateľ určiť platený rozsah podľa § 141 ods. 6: najmenej tretina nároku za každú začatú tretinu roka trvania pomeru, zaokrúhlenie na celé dni nahor; nepredpokladať bez overenia vždy plný ročný limit.

**Právny základ:** [ZP – § 40 ods. 1–2 a 5, § 141 ods. 2 písm. c), § 144](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 37. Oznámenie prekážky v práci

**Priama odpoveď:** Vopred známu prekážku treba včas oznámiť a požiadať o voľno. Ak vznikne nečakane, upovedomte zamestnávateľa o prekážke a predpokladanom trvaní bez zbytočného odkladu.

Prekážku a trvanie treba preukázať príslušným dokladom, ak osobitný predpis neupravuje iný spôsob. Elektronická PN nemení potrebu riešiť včasnú informáciu o neprítomnosti. Bot má pýtať len údaje potrebné na vysvetlenie, nie rodné číslo alebo kompletnú zdravotnú dokumentáciu.

**Na spresnenie:** Aká prekážka nastala, kedy a kedy ste ju oznámili?

**Výnimky a hranice:** Doklad o prekážke nie je automatické oprávnenie požadovať celú diagnózu.

**Právny základ:** [ZP – § 141 ods. 1, § 144](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 38. Kto platí PN od roku 2026

**Priama odpoveď:** Pri PN zamestnanca vzniknutej od 1. januára 2026 a trvajúcom pracovnom pomere poskytuje zamestnávateľ náhradu príjmu za prvých 14 dní; Sociálna poisťovňa pri splnení podmienok poskytuje nemocenské od 15. dňa.

PN vzniknutá pred 1. januárom 2026 sa riadi prechodnými pravidlami starého režimu 10 dní. Ak pomer skončí počas prvých 14 dní novej PN, nemocenské môže vzniknúť od nasledujúceho dňa po skončení pomeru. Ide o náhradu príjmu alebo dávku, nie o plnú mzdu. Výpočet sumy závisí od príslušných vymeriavacích základov a zákonných podmienok; táto karta neposkytuje kalkulačku dávky.

**Na spresnenie:** Kedy PN začala a trvá pracovný pomer? Ide o zamestnanca, SZČO alebo inú poistnú situáciu?

**Výnimky a hranice:** SZČO, ochranná lehota a zánik poistenia vyžadujú inú vetvu. Starú PN neprepnúť na nový režim len zmenou roka.

**Právny základ:** [PN – § 4–8, § 13d](https://static.slov-lex.sk/pdf/SK/ZZ/2003/462/ZZ_2003_462_20260101.pdf); [SP – Začiatok PN a skončenie pracovného pomeru](https://www.socpoist.sk/news/zmena-2026-socialna-poistovna-bude-nemocensku-davku-od-noveho-roku-vyplacat-od-15-dna).

Režim bota: `normal`; overené 2026-10-10.

### 39. Nárok na stravovanie

**Priama odpoveď:** Nárok na zabezpečenie stravovania alebo finančný príspevok má zamestnanec, ktorý počas zmeny vykonáva prácu viac ako štyri hodiny. Presne štyri hodiny túto hranicu samy osebe nespĺňajú.

Zákon rozlišuje poskytovanie jedla, stravovaciu poukážku a finančný príspevok. Pravidlá výberu a výnimky závisia od spôsobu zabezpečenia a zdravotných či prevádzkových okolností. Pri zmene dlhšej než 11 hodín zamestnávateľ môže zabezpečiť ďalšie stravovanie; nie je to automatické druhé povinné jedlo. Pri pracovnej ceste ide o osobitný režim. Eurové hranice sa viažu na aktuálne stravné pri pracovnej ceste a treba ich pred výpočtom overiť.

**Na spresnenie:** Koľko hodín počas zmeny vykonávate prácu? Ide o pracovnú cestu a akým spôsobom firma stravovanie zabezpečuje?

**Výnimky a hranice:** Dohody mimo pracovného pomeru a stravovanie počas absencií posúdiť samostatne. Táto báza neobsahuje overenú aktuálnu eurovú sadzbu stravného.

**Právny základ:** [ZP – § 152](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 40. Bezprostredné nebezpečenstvo

**Priama odpoveď:** Ak sa dôvodne domnievate, že je bezprostredne a vážne ohrozený váš život alebo zdravie, prípadne iných osôb, máte právo odmietnuť prácu alebo odísť z pracoviska do bezpečia. Pri aktuálnom nebezpečenstve najprv zabezpečte bezpečie a privolajte pomoc.

Oznámte konkrétne nebezpečenstvo nadriadenému a zástupcovi pre BOZP; podľa situácie volajte 112. Zaznamenajte čas, okolnosti a dostupné dôkazy bez vystavovania seba či iných ďalšiemu riziku. Zákonná podmienka nie je akákoľvek nespokojnosť s prácou, ale dôvodná obava z bezprostredného a vážneho ohrozenia.

**Na spresnenie:** Ste teraz v bezpečí? Čo konkrétne bezprostredne ohrozuje život alebo zdravie?

**Výnimky a hranice:** Nevyžadovať vyplnenie formulára pred odchodom do bezpečia. Nesľubovať výsledok sporu o oprávnenosť odmietnutia.

**Právny základ:** [BOZP – § 12 ods. 1 písm. b)](https://static.slov-lex.sk/pdf/SK/ZZ/2006/124/ZZ_2006_124_20250701.pdf).

Režim bota: `emergency`; overené 2026-10-10.

### 41. Ochranné pomôcky a pracovný odev

**Priama odpoveď:** Potrebné osobné ochranné pracovné prostriedky podľa rizík práce poskytuje zamestnávateľ bezplatne a udržiava ich funkčné. Zamestnanec ich musí určeným spôsobom používať.

Zamestnávateľ musí mať zoznam prostriedkov založený na posúdení rizík. Pracovný odev a obuv poskytuje bezplatne aj pri mimoriadnom opotrebovaní či znečistení podľa zákona. Bežný osobný odev a bezpečnostná obuv nie sú automaticky rovnaká kategória; treba poznať riziká a určené prostriedky.

**Na spresnenie:** Akú prácu vykonávate a ktoré pomôcky sú podľa posúdenia rizík predpísané? Čo chýba alebo je poškodené?

**Výnimky a hranice:** Neurčovať konkrétnu ochrannú kategóriu topánok bez odborného posúdenia.

**Právny základ:** [BOZP – § 6 ods. 2–3, § 12 ods. 2 písm. f)](https://static.slov-lex.sk/pdf/SK/ZZ/2006/124/ZZ_2006_124_20250701.pdf).

Režim bota: `normal`; overené 2026-10-10.

### 42. Diskriminácia a odborová činnosť

**Priama odpoveď:** Diskriminácia pre odborovú činnosť je zakázaná. Zamestnanec má právo na rovnaké zaobchádzanie a môže žiadať ochranu. Nie každý konflikt alebo nepríjemné správanie sa však automaticky právne kvalifikuje ako diskriminácia.

Zaznamenajte konkrétne konanie, dátumy, svedkov, správy a porovnateľné zaobchádzanie. Posúdiť treba súvis s chráneným dôvodom, obťažovanie, odvetu a ďalšie okolnosti. Možno podať sťažnosť zamestnávateľovi a podľa veci využiť odbory, príslušné orgány alebo súd. Bot nesmie z jedného opisu vyhlásiť zamestnávateľa za vinného. Pri prepustení okamžite upozorní aj na § 77.

**Na spresnenie:** Čo sa konkrétne stalo, kedy a aké dôkazy máte? S čím má nerovnaké zaobchádzanie súvis a bol už skončený pomer?

**Výnimky a hranice:** Súdne lehoty pri skončení riešiť samostatne. Odborové členstvo a zdravotné údaje nezverejňovať v GitHube.

**Právny základ:** [ZP – § 13](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf); [AD – § 2, § 2a, § 6, § 9](https://static.slov-lex.sk/pdf/SK/ZZ/2004/365/ZZ_2004_365_20250701.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 43. Sťažnosť a ochrana pred odvetou

**Priama odpoveď:** Pri sťažnosti podľa § 13 musí zamestnávateľ bez zbytočného odkladu písomne odpovedať a riešiť nápravu. Zákon tu neurčuje všeobecnú pevnú lehotu 30 dní.

Zamestnanec nesmie byť prenasledovaný ani postihovaný za zákonné uplatňovanie práv, sťažnosť, podnet inšpekcii práce alebo žalobu. Sťažnosť formulovať konkrétne: udalosť, dátum, dôkazy, požadovaná náprava. Podanie sťažnosti nenahrádza žalobu pri napadnutí skončenia a nie je zárukou, že nebude potrebná ďalšia ochrana.

**Na spresnenie:** Komu a kedy bola sťažnosť doručená a čoho sa týka? Došlo po nej ku konkrétnemu postihu?

**Výnimky a hranice:** Neprenášať 30-dňovú lehotu kolektívneho vyjednávania na sťažnosti podľa § 13.

**Právny základ:** [ZP – § 13 ods. 7–9, § 77](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `case_review`; overené 2026-10-10.

### 44. Doklady po skončení

**Priama odpoveď:** Pri skončení pracovného pomeru musí zamestnávateľ vydať potvrdenie o zamestnaní. Pracovný posudok vydáva na žiadosť, spravidla ide o odlišný dokument.

Pracovný posudok musí vydať do 15 dní od požiadania; nemusí ho vydávať skôr než dva mesiace pred skončením pomeru. Ak nesúhlasíte s obsahom posudku alebo potvrdenia a zamestnávateľ ho na vašu žiadosť neopraví, možno sa domáhať primeranej úpravy na súde do troch mesiacov odkedy ste sa dozvedeli o obsahu. Nepomiešať túto lehotu s dvojmesačnou lehotou na neplatné skončenie.

**Na spresnenie:** Pomer už skončil a ktorý dokument chýba alebo je nesprávny? Kedy ste sa dozvedeli obsah a požiadali o opravu?

**Výnimky a hranice:** Pri spore o obsah odovzdať redigovaný dokument na posúdenie.

**Právny základ:** [ZP – § 75](https://static.slov-lex.sk/pdf/SK/ZZ/2001/311/ZZ_2001_311_20260901.pdf).

Režim bota: `normal`; overené 2026-10-10.
