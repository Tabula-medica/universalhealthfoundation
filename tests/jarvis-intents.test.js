// Run with: node --test (from the repo root)
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const J = require('../assets/jarvis-intents.js');

const route = (s) => J.routeCommand(s);

test('empty or blank input returns null', () => {
  assert.equal(route(''), null);
  assert.equal(route('   '), null);
  assert.equal(route(null), null);
});

test('routes program commands to the right section', () => {
  assert.equal(route('Play Universal Health Radio').intent, 'radio');
  assert.equal(route('I want to listen to a show').intent, 'radio');
  assert.equal(route('bedtime stories for my kids').intent, 'katha');
  assert.equal(route('katha.kids').intent, 'katha');
  assert.equal(route('literacy program').intent, 'noorjyoti');
  assert.equal(route('Noorjyoti books').intent, 'noorjyoti');
  assert.equal(route('what is your mission?').intent, 'mission');
  assert.equal(route('show me all programs').intent, 'programs');
  assert.equal(route('new radio shows').intent, 'radio');
  assert.equal(route('list programs').intent, 'programs');
});

test('donation and contact commands go to the give section', () => {
  for (const s of ['How can I donate?', 'I want to volunteer', 'get involved', 'contact you']) {
    const r = route(s);
    assert.equal(r.intent, 'donate', s);
    assert.equal(r.href, 'index.html#give');
  }
});

test('personal health questions get the general-information disclaimer', () => {
  const r = route('what medicine should I take for a fever');
  assert.equal(r.intent, 'health');
  assert.ok(r.disclaimer && /not medical advice/i.test(r.disclaimer));
  assert.equal(route('radio').disclaimer, null);
});

test('short keywords only match whole words', () => {
  // "who" must not match "whole"; "all" must not match "tall"
  assert.equal(route('whole grain').intent, 'unknown');
  assert.equal(route('tall').intent, 'unknown');
  assert.equal(route('WHO guidance').intent, 'radio');
});

test('unknown input returns a helpful fallback', () => {
  const r = route('qwerty zxcv');
  assert.equal(r.intent, 'unknown');
  assert.equal(r.href, null);
  assert.ok(r.reply.length > 0);
});

test('every intent and skill has English strings', () => {
  for (const intent of J.INTENTS) {
    assert.ok(J.STRINGS.en['intent.' + intent.id + '.reply'], intent.id + ' reply');
    assert.ok(J.STRINGS.en['intent.' + intent.id + '.label'], intent.id + ' label');
  }
  for (const s of J.SKILLS) assert.ok(J.STRINGS.en['skill.' + s.id + '.desc'], s.id);
  for (const s of J.SUGGESTIONS) assert.ok(J.STRINGS.en[s.key], s.key);
});

test('t() falls back to English, then to the key', () => {
  assert.equal(J.t('nav.jarvis', 'xx'), 'Jarvis');
  assert.equal(J.t('no.such.key'), 'no.such.key');
});

test('suggestion chips route to a real intent', () => {
  for (const s of J.SUGGESTIONS) assert.notEqual(route(s.command).intent, 'unknown', s.command);
});

test('every link target exists as an id in index.html', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  const hrefs = J.INTENTS.map((i) => i.href).concat(J.SKILLS.map((s) => s.href)).filter(Boolean);
  for (const href of hrefs) {
    const id = href.split('#')[1];
    assert.ok(html.includes('id="' + id + '"'), 'missing #' + id + ' in index.html');
  }
});

test('every locale has exactly the same keys as en, all non-empty', () => {
  const en = Object.keys(J.STRINGS.en).sort();
  assert.deepEqual(Object.keys(J.STRINGS).sort(), ['bn', 'en', 'gu', 'hi', 'mr', 'or', 'pa', 'ta', 'te', 'ur', 'zh']);
  for (const loc of Object.keys(J.STRINGS).filter((l) => l !== 'en')) {
    assert.deepEqual(Object.keys(J.STRINGS[loc]).sort(), en, loc);
    for (const k of en) assert.ok(J.STRINGS[loc][k].trim().length > 0, loc + ' ' + k);
  }
  assert.deepEqual(J.LOCALES.map((l) => l.code).sort(), Object.keys(J.STRINGS).sort());
});

test('Hindi commands route like their English equivalents', () => {
  assert.equal(route('स्वास्थ्य रेडियो सुनें').intent, 'radio');
  assert.equal(route('बच्चों की कहानियाँ').intent, 'katha');
  assert.equal(route('साक्षरता कार्यक्रम').intent, 'noorjyoti');
  assert.equal(route('किताबें पढ़ना है').intent, 'noorjyoti');
  assert.equal(route('आपका मिशन क्या है?').intent, 'mission');
  assert.equal(route('सभी कार्यक्रम दिखाओ').intent, 'programs');
  assert.equal(route('मैं दान कैसे करूँ?').intent, 'donate');
  assert.equal(route('मदद').intent, 'help');
});

test('Marathi commands route like their English equivalents', () => {
  assert.equal(route('आरोग्य रेडिओ ऐका').intent, 'radio');
  assert.equal(route('मुलांच्या गोष्टी').intent, 'katha');
  assert.equal(route('साक्षरता कार्यक्रम').intent, 'noorjyoti');
  assert.equal(route('पुस्तके वाचायची आहेत').intent, 'noorjyoti');
  assert.equal(route('तुमचे ध्येय काय आहे?').intent, 'mission');
  assert.equal(route('सर्व कार्यक्रम दाखवा').intent, 'programs');
  assert.equal(route('मी देणगी कशी देऊ?').intent, 'donate');
  assert.equal(route('मला सहभागी व्हायचे आहे').intent, 'donate');
  assert.equal(route('मदत').intent, 'help');
  // Look-alike stems: लसूण (garlic), वाचवा (save), मुलाखत (interview).
  assert.equal(route('लसूण खावा का?').intent, 'unknown');
  assert.equal(route('जीव वाचवा').intent, 'unknown');
  assert.equal(route('मुलाखत द्यायची आहे').intent, 'unknown');
});

test('Marathi health questions get the disclaimer in Marathi', () => {
  const r = J.routeCommand('तापासाठी कोणते औषध घ्यावे?', 'mr');
  assert.equal(r.intent, 'health');
  assert.equal(r.disclaimer, J.STRINGS.mr['health.disclaimer']);
  assert.equal(route('लसीकरण कधी?').intent, 'health');
  assert.equal(route('डोकं दुखतंय').intent, 'health');
});

test('Marathi keywords do not change Hindi meanings in the shared Devanagari script', () => {
  // Hindi "दुख" is sorrow, not pain; "दुखता" (it hurts) is still a health question.
  assert.equal(route('मुझे दुख है').intent, 'unknown');
  assert.equal(route('सिर दुखता है').intent, 'health');
});

test('Chinese commands route like their English equivalents', () => {
  assert.equal(route('收听健康广播').intent, 'radio');
  assert.equal(route('给孩子听的故事').intent, 'katha');
  assert.equal(route('识字项目').intent, 'noorjyoti');
  assert.equal(route('你们的使命是什么？').intent, 'mission');
  assert.equal(route('全部项目').intent, 'programs');
  assert.equal(route('我怎样捐款？').intent, 'donate');
  assert.equal(route('帮助').intent, 'help');
});

test('health questions in Hindi and Chinese get the disclaimer in the chosen language', () => {
  const hi = J.routeCommand('बुखार में कौन सी दवाई लूँ?', 'hi');
  assert.equal(hi.intent, 'health');
  assert.equal(hi.disclaimer, J.STRINGS.hi['health.disclaimer']);
  const zh = J.routeCommand('发烧吃什么药？', 'zh');
  assert.equal(zh.intent, 'health');
  assert.equal(zh.disclaimer, J.STRINGS.zh['health.disclaimer']);
});

test('Tamil commands route like their English equivalents', () => {
  assert.equal(route('சுகாதார வானொலி கேளுங்கள்').intent, 'radio');
  assert.equal(route('குழந்தைகள் கதைகள்').intent, 'katha');
  assert.equal(route('எழுத்தறிவுத் திட்டம்').intent, 'noorjyoti');
  assert.equal(route('உங்கள் நோக்கம் என்ன?').intent, 'mission');
  assert.equal(route('அனைத்துத் திட்டங்கள்').intent, 'programs');
  assert.equal(route('நான் எப்படி நன்கொடை அளிப்பது?').intent, 'donate');
  assert.equal(route('உதவி').intent, 'help');
  // "கேள்வி" (question) must not be read as "கேள்" (listen) -> radio.
  assert.equal(route('எனக்கு ஒரு கேள்வி').intent, 'unknown');
});

test('Telugu commands route like their English equivalents', () => {
  assert.equal(route('ఆరోగ్య రేడియో వినండి').intent, 'radio');
  assert.equal(route('పిల్లల కథలు').intent, 'katha');
  assert.equal(route('అక్షరాస్యత కార్యక్రమం').intent, 'noorjyoti');
  assert.equal(route('మీ లక్ష్యం ఏమిటి?').intent, 'mission');
  assert.equal(route('అన్ని కార్యక్రమాలు').intent, 'programs');
  assert.equal(route('నేను ఎలా విరాళం ఇవ్వాలి?').intent, 'donate');
  assert.equal(route('సహాయం').intent, 'help');
});

test('health questions in Tamil and Telugu get the disclaimer in the chosen language', () => {
  const ta = J.routeCommand('காய்ச்சலுக்கு என்ன மருந்து?', 'ta');
  assert.equal(ta.intent, 'health');
  assert.equal(ta.disclaimer, J.STRINGS.ta['health.disclaimer']);
  const te = J.routeCommand('జ్వరానికి ఏ మందు వేసుకోవాలి?', 'te');
  assert.equal(te.intent, 'health');
  assert.equal(te.disclaimer, J.STRINGS.te['health.disclaimer']);
  // Telugu "లక్షణ" (symptom) and "లక్ష్యం" (goal) share a prefix but must not collide.
  assert.equal(route('లక్షణాలు').intent, 'health');
  assert.equal(route('లక్ష్యం').intent, 'mission');
});

test('Punjabi (Gurmukhi) commands route like their English equivalents', () => {
  assert.equal(route('ਸਿਹਤ ਰੇਡੀਓ ਸੁਣੋ').intent, 'radio');
  assert.equal(route('ਬੱਚਿਆਂ ਦੀਆਂ ਕਹਾਣੀਆਂ').intent, 'katha');
  assert.equal(route('ਸਾਖਰਤਾ ਪ੍ਰੋਗਰਾਮ').intent, 'noorjyoti');
  assert.equal(route('ਕਿਤਾਬਾਂ ਪੜ੍ਹਨੀਆਂ ਹਨ').intent, 'noorjyoti');
  assert.equal(route('ਤੁਹਾਡਾ ਮਿਸ਼ਨ ਕੀ ਹੈ?').intent, 'mission');
  assert.equal(route('ਸਾਰੇ ਪ੍ਰੋਗਰਾਮ ਦਿਖਾਓ').intent, 'programs');
  assert.equal(route('ਮੈਂ ਦਾਨ ਕਿਵੇਂ ਕਰਾਂ?').intent, 'donate');
  assert.equal(route('ਸਵੈ-ਸੇਵਕ ਬਣਨਾ ਹੈ').intent, 'donate');
  assert.equal(route('ਮਦਦ').intent, 'help');
});

test('Punjabi health questions get the disclaimer, with or without nukta', () => {
  // Precomposed "ਖ਼" (U+0A59), decomposed "ਖ" + nukta, and plain "ਖ" are all common spellings.
  for (const q of ['ਬੁ\u0a59ਾਰ ਲਈ ਕਿਹੜੀ ਦਵਾਈ ਲਵਾਂ?', 'ਬੁ\u0a16\u0a3cਾਰ ਦੀ ਦਵਾਈ', 'ਬੁਖਾਰ']) {
    const r = J.routeCommand(q, 'pa');
    assert.equal(r.intent, 'health', q);
    assert.equal(r.disclaimer, J.STRINGS.pa['health.disclaimer']);
  }
});

test('Gujarati commands route like their English equivalents', () => {
  assert.equal(route('આરોગ્ય રેડિયો સાંભળો').intent, 'radio');
  assert.equal(route('બાળકોની વાર્તાઓ').intent, 'katha');
  assert.equal(route('સાક્ષરતા કાર્યક્રમ').intent, 'noorjyoti');
  assert.equal(route('તમારું મિશન શું છે?').intent, 'mission');
  assert.equal(route('બધા કાર્યક્રમો બતાવો').intent, 'programs');
  assert.equal(route('હું દાન કેવી રીતે કરું?').intent, 'donate');
  assert.equal(route('મદદ').intent, 'help');
  // "લક્ષણ" (symptom) and "લક્ષ્ય" (goal) share a prefix but must not collide.
  assert.equal(route('લક્ષણો').intent, 'health');
  assert.equal(route('લક્ષ્ય').intent, 'mission');
});

test('Bengali commands route like their English equivalents', () => {
  assert.equal(route('স্বাস্থ্য রেডিও শুনুন').intent, 'radio');
  assert.equal(route('শিশুদের গল্প').intent, 'katha');
  assert.equal(route('সাক্ষরতা কর্মসূচি').intent, 'noorjyoti');
  assert.equal(route('বই পড়তে চাই').intent, 'noorjyoti');
  assert.equal(route('আপনাদের লক্ষ্য কী?').intent, 'mission');
  assert.equal(route('সব কর্মসূচি দেখান').intent, 'programs');
  assert.equal(route('আমি কীভাবে দান করব?').intent, 'donate');
  assert.equal(route('আমি যুক্ত হতে চাই').intent, 'donate');
  assert.equal(route('সাহায্য').intent, 'help');
  // "যুক্তরাষ্ট্র" (United States) is not "যুক্ত হ" (join); "কথা" means "talk", not stories.
  assert.equal(route('যুক্তরাষ্ট্রে থাকি').intent, 'unknown');
  assert.equal(route('আপনার সাথে কথা বলতে চাই').intent, 'unknown');
});

test('Gujarati and Bengali health questions get the disclaimer in the chosen language', () => {
  const gu = J.routeCommand('તાવ માટે કઈ દવા લઉં?', 'gu');
  assert.equal(gu.intent, 'health');
  assert.equal(gu.disclaimer, J.STRINGS.gu['health.disclaimer']);
  const bn = J.routeCommand('জ্বরের জন্য কোন ওষুধ খাব?', 'bn');
  assert.equal(bn.intent, 'health');
  assert.equal(bn.disclaimer, J.STRINGS.bn['health.disclaimer']);
  // "চিকিৎসা" is typed both with khanda-ta (ৎ) and as ত্ + ZWJ.
  assert.equal(route('চিকিৎসা').intent, 'health');
  assert.equal(route('চিকিত্\u200dসা').intent, 'health');
});

test('Odia commands route like their English equivalents', () => {
  assert.equal(route('ସ୍ୱାସ୍ଥ୍ୟ ରେଡିଓ ଶୁଣନ୍ତୁ').intent, 'radio');
  assert.equal(route('ପିଲାଙ୍କ ଗପ').intent, 'katha');
  assert.equal(route('ସାକ୍ଷରତା କାର୍ଯ୍ୟକ୍ରମ').intent, 'noorjyoti');
  assert.equal(route('ଆପଣଙ୍କ ଲକ୍ଷ୍ୟ କ’ଣ?').intent, 'mission');
  assert.equal(route('ସମସ୍ତ କାର୍ଯ୍ୟକ୍ରମ ଦେଖାନ୍ତୁ').intent, 'programs');
  assert.equal(route('ମୁଁ କିପରି ଦାନ କରିବି?').intent, 'donate');
  assert.equal(route('ମୁଁ ଯୋଗ ଦେବାକୁ ଚାହେଁ').intent, 'donate');
  assert.equal(route('ସାହାଯ୍ୟ').intent, 'help');
  // "read" with and without nukta (ପଢ଼ / ପଢ).
  assert.equal(route('ବହି ପଢ଼ିବାକୁ ଚାହେଁ').intent, 'noorjyoti');
  assert.equal(route('ବହି ପଢିବାକୁ ଚାହେଁ').intent, 'noorjyoti');
  // "କଥା" means "talk", not stories; "ଦାନ" must not match inside "ପ୍ରଦାନ" (provide).
  assert.equal(route('ଆପଣଙ୍କ ସହ କଥା ହେବାକୁ ଚାହେଁ').intent, 'unknown');
  assert.equal(route('ସୂଚନା ପ୍ରଦାନ').intent, 'unknown');
});

test('Odia health questions get the disclaimer, with either spelling of "fever"', () => {
  for (const q of ['ଜ୍ୱର ପାଇଁ କେଉଁ ଔଷଧ ଖାଇବି?', 'ଜ୍ବର ହେଉଛି']) {
    const r = J.routeCommand(q, 'or');
    assert.equal(r.intent, 'health', q);
    assert.equal(r.disclaimer, J.STRINGS.or['health.disclaimer']);
  }
  // "ଲକ୍ଷଣ" (symptom) and "ଲକ୍ଷ୍ୟ" (goal) share a prefix but must not collide.
  assert.equal(route('ଲକ୍ଷଣ').intent, 'health');
  assert.equal(route('ଲକ୍ଷ୍ୟ').intent, 'mission');
});

test('Urdu commands route like their English equivalents', () => {
  assert.equal(route('صحت ریڈیو سنیں').intent, 'radio');
  assert.equal(route('بچوں کی کہانیاں').intent, 'katha');
  assert.equal(route('خواندگی پروگرام').intent, 'noorjyoti');
  assert.equal(route('آپ کا مشن کیا ہے؟').intent, 'mission');
  assert.equal(route('تمام پروگرام دکھائیں').intent, 'programs');
  assert.equal(route('میں عطیہ کیسے دوں؟').intent, 'donate');
  assert.equal(route('رضاکار بننا ہے').intent, 'donate');
  assert.equal(route('مدد').intent, 'help');
  // "سنہ" (year) is not "listen"; "بچت" (savings) is not "children".
  assert.equal(route('سنہ ۲۰۲۶').intent, 'unknown');
  assert.equal(route('بچت کیسے کریں').intent, 'unknown');
});

test('Urdu health questions get the disclaimer in Urdu', () => {
  const r = J.routeCommand('بخار کے لیے کون سی دوا لوں؟', 'ur');
  assert.equal(r.intent, 'health');
  assert.equal(r.disclaimer, J.STRINGS.ur['health.disclaimer']);
});

test('Urdu matching ignores Arabic-keyboard letters, vowel marks and tatweel', () => {
  assert.equal(route('\u0643تاب').intent, 'noorjyoti');      // Arabic kaf
  assert.equal(route('عط\u064a\u0647').intent, 'donate');   // Arabic yeh + heh
  assert.equal(route('د\u064eوا').intent, 'health');         // zabar
  assert.equal(route('ری\u0640ڈیو').intent, 'radio');        // tatweel
});

test('Urdu is the only right-to-left locale', () => {
  const rtl = J.LOCALES.filter((l) => l.dir === 'rtl').map((l) => l.code);
  assert.deepEqual(rtl, ['ur']);
});

test('zero-width joiners inside words do not break matching', () => {
  assert.equal(J.normalize('ఫౌండేషన్\u200cలో'), 'ఫౌండేషన్లో');
  assert.equal(route('ఫౌండేషన్\u200cలో').intent, 'mission');
});

test('Hindi keywords match word starts, not the middle of words', () => {
  // "दान" (donate) must not match inside "प्रदान" (provide).
  assert.equal(route('प्रदान').intent, 'unknown');
});

test('replies come back in the requested locale', () => {
  assert.equal(J.routeCommand('radio', 'hi').reply, J.STRINGS.hi['intent.radio.reply']);
  assert.equal(J.routeCommand('广播', 'zh').label, 'Universal Health Radio');
  assert.equal(J.routeCommand('qwerty', 'zh').reply, J.STRINGS.zh['intent.unknown.reply']);
});

test('every term suggested in the "didn\'t catch that" reply routes somewhere', () => {
  for (const loc of Object.keys(J.STRINGS)) {
    const terms = J.STRINGS[loc]['intent.unknown.reply'].match(/["“]([^"”]+)["”]/g);
    assert.ok(terms && terms.length >= 5, loc);
    for (const q of terms) assert.notEqual(route(q).intent, 'unknown', loc + ': ' + q);
  }
});

test('every suggestion chip label routes to the same intent as its command', () => {
  for (const loc of Object.keys(J.STRINGS)) {
    for (const s of J.SUGGESTIONS) {
      assert.equal(route(J.t(s.key, loc)).intent, route(s.command).intent, loc + ': ' + s.key);
    }
  }
});

test('resolveLocale picks the first supported language', () => {
  assert.equal(J.resolveLocale(['hi-IN', 'en-US']), 'hi');
  assert.equal(J.resolveLocale(['fr-FR', 'zh-CN']), 'zh');
  assert.equal(J.resolveLocale([null, undefined, 'zh-Hans']), 'zh');
  assert.equal(J.resolveLocale(['ta-IN']), 'ta');
  assert.equal(J.resolveLocale(['te_IN', 'en']), 'te');
  assert.equal(J.resolveLocale(['pa-IN']), 'pa');
  assert.equal(J.resolveLocale(['pa-Guru-IN']), 'pa');
  // Our Punjabi is Gurmukhi; Shahmukhi (Perso-Arabic) readers fall through to the next choice.
  assert.equal(J.resolveLocale(['pa-PK', 'en']), 'en');
  assert.equal(J.resolveLocale(['pa-Arab', 'hi']), 'hi');
  assert.equal(J.resolveLocale(['gu-IN']), 'gu');
  assert.equal(J.resolveLocale(['bn-BD']), 'bn');
  assert.equal(J.resolveLocale(['ur-PK']), 'ur');
  assert.equal(J.resolveLocale(['ur-IN']), 'ur');
  assert.equal(J.resolveLocale(['or-IN']), 'or');
  assert.equal(J.resolveLocale(['mr-IN']), 'mr');
  assert.equal(J.resolveLocale(['fr']), 'en');
  assert.equal(J.resolveLocale([]), 'en');
});
