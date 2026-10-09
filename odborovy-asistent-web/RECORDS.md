# Evidencia dotazov

Verejný web neposiela chat na server. Iba odoslaný formulár sa ukladá cez queryEndpoint do šifrovanej databázy. Uloženie potvrdzuje identifikátor podania. Verejný web neobsahuje správcovský token ani verejný zoznam podaní.

Interný test má výslovne zapnuté internalStorageEnabled. Ukladá chat a testovacie formuláre iba v prehliadači, najviac 200 záznamov. Používajte iba vymyslené údaje; nejde o správu skutočných prípadov. Export CSV neutralizuje bežné začiatky vzorcov. Pri uzatvorení testu vymažte lokálne údaje aj exporty.

Serverové uchovanie, oprávnený export a výmaz opisuje koreňový README. Zálohy a lokálne exporty vyžadujú vlastnú správu uchovania.
