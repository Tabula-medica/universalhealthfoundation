/*
 * Jarvis intent router for universalhealthfoundation.org.
 *
 * Pure, local keyword matching: no network calls, no storage, no logging.
 * Every target below points at a section that exists in index.html.
 * Works as a browser global (window.JarvisIntents) and as a CommonJS module (tests).
 */
(function (root) {
  'use strict';

  // All user-facing Jarvis copy lives here. The site has no i18n framework yet,
  // so this table is the single place to add translations (e.g. STRINGS.hi, STRINGS.zh).
  var STRINGS = {
    en: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'Find our programs, shows and ways to help. Type what you are looking for.',
      'bar.placeholder': 'e.g. "open Universal Health Radio" or "how can I donate?"',
      'bar.label': 'Ask Jarvis',
      'bar.submit': 'Go',
      'suggest.heading': 'Try',
      'briefing.heading': 'Today at the Foundation',
      'skills.heading': 'Everything on this site',
      'result.open': 'Open',
      'privacy': 'Jarvis runs entirely in your browser. What you type is matched against a fixed list of keywords on this page; it is not sent anywhere, stored, or logged. Jarvis has no AI chat yet.',
      'health.disclaimer': 'Universal Health Radio shares general public-health information only. It is not medical advice. For a personal health question, talk to a qualified clinician; in an emergency, call your local emergency number.',
      'licensing': 'Jarvis only links to the Foundation\u2019s own pages. It does not copy or republish program content, which keeps its original licenses and sources.',
      'back': '← Back to home',
      'nav.jarvis': 'Jarvis',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio translates trustworthy public-health guidance from WHO, CDC and FDA into many languages. Here is the program.',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids has children’s stories and learning content. Here is the program.',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti brings books and literacy to readers who need them most. Here is the program.',
      'intent.programs.label': 'All programs',
      'intent.programs.reply': 'Here are all three Foundation programs.',
      'intent.mission.label': 'Our mission',
      'intent.mission.reply': 'Here is what the Foundation stands for.',
      'intent.donate.label': 'Donate / get involved',
      'intent.donate.reply': 'Thank you! Here is how to support or get involved with the Foundation.',
      'intent.health.label': 'Health information',
      'intent.health.reply': 'I can’t answer personal medical questions. Universal Health Radio shares general public-health information from WHO, CDC and FDA.',
      'intent.help.label': 'What can Jarvis do?',
      'intent.help.reply': 'I can take you to Universal Health Radio, katha.kids, noorjyoti, our mission, or how to donate. Try one of the suggestions.',
      'intent.unknown.reply': 'Sorry, I didn’t catch that. Try "radio", "kids stories", "literacy", "mission" or "donate".',

      'skill.radio.desc': 'Public-health audio in many languages',
      'skill.katha.desc': 'Stories and learning for children',
      'skill.noorjyoti.desc': 'Books and literacy',
      'skill.mission.desc': 'Why we do this work',
      'skill.donate.desc': 'Support or volunteer',

      'suggest.radio': 'Play health radio',
      'suggest.katha': 'Stories for kids',
      'suggest.noorjyoti': 'Literacy program',
      'suggest.donate': 'How can I donate?'
    }
  };

  function t(key, locale) {
    var table = STRINGS[locale] || STRINGS.en;
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : STRINGS.en[key] || key;
  }

  // Order matters: first match wins. Health is checked before radio so that
  // "what medicine should I take" gets the general-information disclaimer.
  var INTENTS = [
    { id: 'help', href: null, keywords: ['help', 'what can you do', 'commands', 'jarvis'] },
    { id: 'health', href: 'index.html#radio', disclaimer: true,
      keywords: ['symptom', 'diagnos', 'medicine', 'medication', 'dose', 'dosage', 'prescription', 'treatment', 'pain', 'fever', 'sick', 'doctor', 'cure', 'vaccine', 'vaccination'] },
    { id: 'donate', href: 'index.html#give',
      keywords: ['donat', 'give', 'giving', 'support', 'volunteer', 'get involved', 'contribute', 'sponsor', 'contact', 'email'] },
    { id: 'radio', href: 'index.html#radio',
      keywords: ['radio', 'listen', 'audio', 'podcast', 'broadcast', 'shows', 'episode', 'station', 'health news', 'public health', 'who', 'cdc', 'fda'] },
    { id: 'katha', href: 'index.html#katha',
      keywords: ['katha', 'kid', 'child', 'story', 'stories', 'bedtime', 'learning for'] },
    { id: 'noorjyoti', href: 'index.html#noorjyoti',
      keywords: ['noor', 'jyoti', 'literacy', 'book', 'read', 'library'] },
    { id: 'mission', href: 'index.html#mission',
      keywords: ['mission', 'about', 'who are you', 'why', 'nonprofit', 'foundation', 'values'] },
    { id: 'programs', href: 'index.html#programs',
      keywords: ['program', 'everything', 'all', 'what do you do', 'services', 'content'] }
  ];

  // The skills grid: one tile per existing section of index.html.
  var SKILLS = [
    { id: 'radio', icon: '📻', href: 'index.html#radio' },
    { id: 'katha', icon: '📚', href: 'index.html#katha' },
    { id: 'noorjyoti', icon: '🕯️', href: 'index.html#noorjyoti' },
    { id: 'mission', icon: '💜', href: 'index.html#mission' },
    { id: 'donate', icon: '🤝', href: 'index.html#give' }
  ];

  var SUGGESTIONS = [
    { key: 'suggest.radio', command: 'radio' },
    { key: 'suggest.katha', command: 'stories for kids' },
    { key: 'suggest.noorjyoti', command: 'literacy' },
    { key: 'suggest.donate', command: 'donate' }
  ];

  function normalize(text) {
    return String(text == null ? '' : text)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Short keywords (<= 3 chars, e.g. "who", "all") must match a whole word;
  // longer ones may match a word prefix ("donat" -> "donate", "donation").
  function matches(text, keyword) {
    var words = text.split(' ');
    if (keyword.indexOf(' ') !== -1) return (' ' + text + ' ').indexOf(' ' + keyword) !== -1;
    for (var i = 0; i < words.length; i++) {
      if (keyword.length <= 3 ? words[i] === keyword : words[i].indexOf(keyword) === 0) return true;
    }
    return false;
  }

  function routeCommand(input, locale) {
    var text = normalize(input);
    if (!text) return null;
    for (var i = 0; i < INTENTS.length; i++) {
      var intent = INTENTS[i];
      for (var k = 0; k < intent.keywords.length; k++) {
        if (matches(text, intent.keywords[k])) {
          return {
            intent: intent.id,
            href: intent.href,
            label: t('intent.' + intent.id + '.label', locale),
            reply: t('intent.' + intent.id + '.reply', locale),
            disclaimer: intent.disclaimer ? t('health.disclaimer', locale) : null
          };
        }
      }
    }
    return { intent: 'unknown', href: null, label: null, reply: t('intent.unknown.reply', locale), disclaimer: null };
  }

  var api = {
    STRINGS: STRINGS,
    INTENTS: INTENTS,
    SKILLS: SKILLS,
    SUGGESTIONS: SUGGESTIONS,
    t: t,
    normalize: normalize,
    routeCommand: routeCommand
  };

  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.JarvisIntents = api;
})(typeof self !== 'undefined' ? self : this);
