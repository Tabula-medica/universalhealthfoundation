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
