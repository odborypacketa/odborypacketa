(function (root) {
  'use strict';
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const rules = {
    odbory: /co (su|robia).*odbor|naco.*odbor|uloha.*odbor|kto su odbor/,
    kolektivna_zmluva: /co je kolektiv|kolektiv.*neclen|kolektiv.*neorganiz|plati kolektiv|packeta.*(dovolen|benefit)|vyhod.*kolektiv/,
    vyjednavanie: /navrh.*kolektiv|vyjednavan|rokovan.*kolektiv/,
    vlastna_vypoved: /ako.*(dat|dam|podat).*vypoved|chcem (odist|skoncit)|davam.*vypoved|vypoved.*(ja|sam)|vlastn.*vypoved|prestat chodit do prace/,
    dorucenie: /doruc|prevziat|prevzal|vypoved.*(e.mail|email|post)|napisal.*vypoved/,
    dohoda_skoncenie: /vypoved dohodou|dohod.*skonc|skonc.*dohod|skoncit zajtra/,
    vypoved_zamestnavatel: /dostal.*vypoved|vypoved.*(od firmy|od zamestnavat)|zamestnavatel.*(prepust|vypoved)|prepusti.*bez dovod|sef.*(vyhod|prepust)/,
    vypovedna_doba_zamestnavatel: /vypovedn.*dob.*(nadbytoc|prepust|zamestnavat)|nadbytoc.*vypoved/,
    okamzite_skoncenie: /okamzit.*skonc|skonc.*okamzit|mzd.*(nepris|neprisl|nevyplat)|nepris.*mzda|nevyplat.*mzda|odist hned|uz nejdem do prace/,
    skusobna_doba: /skusobn/,
    doba_urcita: /dob.*urcit|konci.*zmluva|zmluva.*konci/,
    odstupne: /odstupn/,
    neplatne_skoncenie: /neplatn.*vypoved|napadnut.*vypoved|napadn.*skonc|nezakonn.*prepust|prepust.*nezakon|dokedy.*zalov|zalob|sud.*lehot/,
    prerokovanie_vypovede: /odbor.*(schval|suhlas|veto|vypoved)|vypoved.*(schval|prerok)|prerok.*vypoved/,
    dovolenka_vymera: /kolko.*dovolen|narok.*dovolen|\b(32|33|34|35) rokov\b|\b(32|33|34|35) roc|desat tyzdnov|10 tyzdnov|diet.*pisomne oznam|trvale.*stara.*diet/,
    dovolenka_pomerna: /nastupil.*(juli|jula|[0-9])|60 dni|42 odpracovan|21 odpracovan|pomern.*dovolen|nepracoval.*60/,
    dovolenka_zmeny: /dovolen.*(zmen|uvaz)|(?:12.hodin|dvanast|polovicn|kratsi uvaz|tri.*dni tyzden|troch.*dni).*dovolen|25 (dni|zmien)|polovicny uvazok|tri rovnak.*dni/,
    dovolenka_termin: /nariad.*dovolen|dovolen.*(zajtra|schval|termin)|kto urc.*dovolen/,
    dovolenka_prenos: /prepad.*dovolen|star.*dovolen|prenes.*dovolen|dovolen.*(minul|2026.*2027)|neurcil.*dovolen|nevycerpan.*dovolen/,
    dovolenka_preplatenie: /preplat.*dovolen|nevycerpan.*dovolen|ochor.*dovolen|pn pocas dovolen/,
    dovolenka_kratenie: /krat.*dovolen|zobrat.*dovolen|vezm.*dovolen|dovolen.*absenc/,
    pracovny_cas: /kolko.*hodin.*(pracovat|prevadz|tyzden)|pracovn.*cas|dvojzmenn|trojzmenn/,
    rozvrh: /zmenit.*zmen|rozvrh|vecer pred nastup|zmena.*posledn/,
    prestavky: /prestav|sesthodinov|presne sest|presne 6 hodin|pat hodinov|pathodinov/,
    odpocinok: /odpocin|volna.*medzi zmen|hodin.*medzi zmen/,
    nadcas: /nadcas/,
    nadcas_odmena: /nadcas.*(mzd|plat|odmen|priplat)|(?:plat|odmen|priplat).*nadcas|nahradn.*voln.*nadcas/,
    sobota: /sobot/,
    nedela: /nedel/,
    noc: /nocn|nocny|noci/,
    sviatok: /sviatok|sviatk/,
    minimalna_mzda: /minimaln.*mzd|priplat.*dopln.*minimal/,
    splatnost_mzdy: /vyplatn.*pask|splatnost.*mzd|kedy.*mzda|neprehla.*pask|pask.*neprehl|vyplatny den|neprisla.*mzda/,
    zrazky: /zrazk|strhol|pokut.*mzd|strhav|peniaze za chyb/,
    lekar: /paragraf.*lekar|lekar.*(platen|volno|den)|vlastn.*lekar|navstev.*lekar/,
    sprievod: /sprievod|sprevad|diet.*lekar/,
    prekazky_oznamenie: /oznamit.*pn|dokazat.*lekar|preukaz.*prekaz|prekazk.*oznam/,
    pn_platba: /\bpn\b|praceneschop/,
    stravovanie: /stravn|stravov|gastrolist|\bjedl|presne 4 hodin/,
    bozp_nebezpecenstvo: /nebezpec|ohrozen|iskri|odmietnut.*pracu|bezpecnost.*praci/,
    ochranne_prostriedky: /ochrann.*(pomock|prostried)|bezpecnostn.*topank|pracovn.*odev/,
    diskriminacia: /diskrimin|sikan|postih.*odbor|potrest.*odbor|odbor.*postih/,
    staznost: /staznost|podnet|odvet/,
    doklady_skoncenie: /zapoctov|potvrdenie o zamestnani|pracovny posudok/
  };
  const ranks = {normal: 0, case_review: 1, urgent_legal: 2, emergency: 3};
  function create(base, clock = () => new Date()) {
    let active = [], lastQuestion = '';
    const byId = new Map(base.topics.map(card => [card.id, card]));
    function identify(question) {
      const q = normalize(question), found = new Set();
      for (const card of base.topics) {
        if (card.examples.some(ex => normalize(ex).replace(/[?.!]/g, '') === q.replace(/[?.!]/g, '')) || rules[card.id]?.test(q)) found.add(card.id);
      }
      if (/vypoved/.test(q) && ![...found].some(id => /vypoved|skoncenie|dohoda/.test(id))) found.add('vlastna_vypoved');
      if (/dovolen/.test(q) && ![...found].some(id => id.startsWith('dovolenka'))) found.add('dovolenka_vymera');
      if (/priplatk/.test(q) && ![...found].some(id => ['sobota','nedela','noc','sviatok','nadcas_odmena'].includes(id))) found.add('minimalna_mzda');
      if (/pomer.*konci|konci.*pomer/.test(q) && !found.size) found.add('dohoda_skoncenie');
      if (/lekar/.test(q) && !found.has('sprievod')) found.add('lekar');
      // PN during a termination or holiday question is context, not a benefits query.
      if (found.has('pn_platba') && [...found].some(id => id.startsWith('dovolenka') || ['neplatne_skoncenie','vypoved_zamestnavatel','prekazky_oznamenie'].includes(id))) found.delete('pn_platba');
      if (found.has('nadcas_odmena')) found.delete('nadcas');
      if (found.has('sprievod')) found.delete('lekar');
      if (found.has('dovolenka_prenos') && /preplat/.test(q)) found.delete('dovolenka_prenos');
      if (found.has('dovolenka_preplatenie') && /prepad|prenes|stara/.test(q)) found.delete('dovolenka_preplatenie');
      if (/davam.*vypoved|vypoved.*ja|vlastn.*vypoved/.test(q)) found.add('vlastna_vypoved');
      return [...found];
    }
    function respond(question) {
      const q = normalize(question); let ids = identify(question);
      // Short factual replies belong to the pending topic even if a date/age has a generic match.
      const factualReply = active.length && !/vypoved|dovolen|mzda|lekar|pn|stravn|nadcas|odbor/.test(q) && /^(od\b|mam \d|\d|ano\b|nie\b|dorucim\b|pracujem od\b)/.test(q);
      const isFollowUp = (factualReply || !ids.length) && active.length && /\b(od|rok|mesiac|mam|ano|nie|dorucim|202\d|19\d\d|200\d|20\d\d)\b|\d/.test(q);
      const selected = isFollowUp ? active : ids;
      if (!selected.length) {
        return {cards: [], topicIds: [], risk: 'normal', contact: false, text: /^(ahoj|dobry den|cau|dakujem)[!. ]*$/.test(q)
          ? 'Ahoj! Viem vysvetliť odbory, výpoveď, dovolenku, mzdu, pracovný čas, príplatky, PN aj návštevu lekára. Na čo sa chcete opýtať?'
          : 'Túto otázku zatiaľ neviem spoľahlivo zaradiť. Skúste uviesť, či ide o výpoveď, dovolenku, mzdu, pracovný čas, lekára alebo inú pracovnú tému. Pri osobnom spore môžete kontaktovať odbory.'};
      }
      active = selected;
      if (!isFollowUp) lastQuestion = question;
      const now = clock().toISOString().slice(0,10);
      const stale = now < '2026-09-01' || now > '2026-12-31';
      const historical = /(?:rok(?:u)?|za rok|v roku)\s*(20\d\d)/.exec(q);
      const outsideYear = historical && historical[1] !== '2026';
      const responseCards = selected.map(id => byId.get(id)).filter(Boolean);
      const risk = responseCards.reduce((r, c) => ranks[c.risk] > ranks[r] ? c.risk : r, 'normal');
      const warnings = [];
      if (stale || outsideYear) warnings.push('Báza bola overená 10. 10. 2026. Pre iné obdobie treba overiť príslušné znenie zákona; uvedené pravidlá nie sú potvrdením aktuálneho nároku pre tento dátum.');
      if (risk === 'urgent_legal') warnings.push('Pri spornom skončení alebo okamžitom odchode nečakajte na vybavenie formulára. Bezodkladne kontaktujte advokáta; súdna lehota sa podaním dotazu odborom nenahrádza.');
      if (risk === 'emergency') warnings.unshift('Ak nebezpečenstvo trvá, najprv sa dostaňte do bezpečia a podľa situácie volajte 112.');
      if (/rodne cislo|zdravotn.*dokument/.test(q)) warnings.unshift('Rodné číslo ani celú zdravotnú dokumentáciu sem neposielajte. Na vysvetlenie stačia rozhodujúce okolnosti.');
      const calculations = [];
      const joined = normalize(isFollowUp ? lastQuestion + ' ' + question : question);
      if (isFollowUp) lastQuestion += ' ' + question;
      if (selected.includes('vlastna_vypoved')) {
        const years = /(?:pracujem|som tu|pomer trva)\s*(?:uz\s*)?(\d+)\s*rok/.exec(joined);
        if (years) calculations.push(`Pri vami uvedenom trvaní ${years[1]} rokov je zákonné minimum vlastnej výpovede ${Number(years[1]) >= 1 ? 'dva mesiace' : 'jeden mesiac'}. Overte prípadnú dlhšiu dohodnutú dobu a deň doručenia.`);
        const start = /(?:pracujem|pomer|nastupil)[^.!?]{0,30}?od\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(joined);
        const delivery = /doruc(?:im|enie|ena|ena bude|it)?[^.!?]{0,15}?(\d{1,2})\.(\d{1,2})\.(\d{4})/.exec(joined);
        if (start && delivery && !stale && !outsideYear) {
          const date = m => new Date(Date.UTC(+m[3], +m[2]-1, +m[1]));
          const a = date(start), b = date(delivery);
          const valid = (d,m) => d.getUTCFullYear() === +m[3] && d.getUTCMonth() === +m[2]-1 && d.getUTCDate() === +m[1];
          if (valid(a,start) && valid(b,delivery) && b >= a && b.toISOString().slice(0,10) >= '2026-09-01' && +delivery[3] === 2026) {
            const anniversary = new Date(Date.UTC(a.getUTCFullYear()+1,a.getUTCMonth(),a.getUTCDate()));
            const months = b >= anniversary ? 2 : 1;
            const from = new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth()+1,1));
            const to = new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth()+1+months,0));
            const fmt = d => `${d.getUTCDate()}.${d.getUTCMonth()+1}.${d.getUTCFullYear()}`;
            calculations.push(`Ak ide o bežnú vlastnú výpoveď z tohto pracovného pomeru a nemáte dohodnutú dlhšiu dobu, podľa uvedených dátumov je minimum ${months === 2 ? 'dva mesiace' : 'jeden mesiac'}: od ${fmt(from)} do ${fmt(to)}. Pri nadväzujúcich pomeroch treba overiť aj ich trvanie.`);
          }
        }
      }
      if (selected.some(id => id.startsWith('dovolenka'))) {
        const age = /mam\s*(\d{1,2})\s*rok/.exec(joined);
        if (age && Number(age[1]) >= 33) calculations.push('Vami uvedený vek spĺňa podmienku najmenej päťtýždňovej ročnej výmery. Presný nárok a zostatok ešte závisia od pomeru, rozvrhu a absencií.');
      }
      const cards = responseCards.map(card => {
        const refs = card.legalReferences.map(ref => ({...ref,...base.sources[ref.sourceId]}));
        const answer = card.id === 'minimalna_mzda' && (stale || outsideYear)
          ? 'Presnú minimálnu mzdu pre požadované obdobie táto báza nepotvrdzuje. Suma 915 € mesačne a 5,259 € hodinovo bola overená iba pre rok 2026; aktuálnu sumu treba dohľadať v oznámení MPSVR.' : card.answer;
        return {...card,answer,refs};
      });
      const continuation = isFollowUp ? 'Nadväzujem na vašu predošlú otázku. Údaj beriem ako doplnenie; ak niektorá podmienka zostáva nejasná, nižšie uvádzam, čo treba overiť.' : '';
      const questions = [...new Set(cards.flatMap(c => c.clarifyingQuestions))];
      const frame = risk !== 'normal' ? [
        '1. Čo vieme: zatiaľ len váš opis, nie overené doklady.',
        '2. Čo nevieme: ' + (questions.join(' ') || 'Presné dátumy a okolnosti prípadu.'),
        '3. Dôkazy: uchovajte relevantné listiny a dátumy; citlivé podklady redigujte.',
        '4. Aktuálny zákon: pozri uvedené paragrafy, podmienky a lehoty; pri staršej udalosti treba overiť vtedajšie znenie.',
        '5. Právomoci odborov: treba overiť príslušný orgán a mandát; prevzatie prípadu ani zastupovanie zatiaľ nie sú potvrdené.',
        '6. Cieľ: potrebujeme vedieť, čo chcete dosiahnuť.',
        '7. Vyjednávacia pozícia: bez podkladov nevieme posúdiť dôkazy ani výsledok rokovania.',
        '8. Ďalší krok: ' + (risk === 'emergency' ? 'bezpečie a privolanie pomoci ihneď.' : risk === 'urgent_legal' ? 'kontaktujte advokáta bezodkladne; súčasne môžete osloviť odbory.' : 'po overení údajov požiadajte príslušné odbory o posúdenie.')
      ].join('\n') : '';
      return {cards,topicIds:selected,risk,contact:risk !== 'normal',warnings,calculations,questions,continuation,frame,
        text:[...warnings,continuation,...calculations,...cards.map(c=>[c.answer,c.detail,...c.exceptions].join('\n')), ...questions].filter(Boolean).join('\n\n')};
    }
    return {respond,identify,reset(){active=[];lastQuestion='';}};
  }
  root.ODBORACIK_LEGAL_ENGINE = {create,normalize};
})(typeof window !== 'undefined' ? window : globalThis);
