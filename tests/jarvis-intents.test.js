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
  assert.deepEqual(Object.keys(J.STRINGS).sort(), ['en', 'hi', 'ta', 'te', 'zh']);
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
  assert.equal(J.resolveLocale(['fr']), 'en');
  assert.equal(J.resolveLocale([]), 'en');
});
