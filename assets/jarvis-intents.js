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
  // so this table is the single place to add translations (en, hi, zh, ta, te, pa, gu, bn, or, ur). Every locale must have
  // exactly the same keys as STRINGS.en (enforced by tests).
  // Brand names (Universal Health Radio, katha.kids, noorjyoti, Jarvis) stay in Latin script.
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
      'lang.label': 'Language',

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
    },
    hi: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'हमारे कार्यक्रम, शो और मदद करने के तरीके खोजें। आप जो ढूँढ रहे हैं, वह लिखें।',
      'bar.placeholder': 'जैसे "रेडियो सुनना है" या "मैं दान कैसे करूँ?"',
      'bar.label': 'Jarvis से पूछें',
      'bar.submit': 'जाएँ',
      'suggest.heading': 'आज़माएँ',
      'briefing.heading': 'आज फ़ाउंडेशन में',
      'skills.heading': 'इस साइट पर सब कुछ',
      'result.open': 'खोलें',
      'privacy': 'Jarvis पूरी तरह आपके ब्राउज़र में चलता है। आप जो लिखते हैं, उसे इसी पेज पर कीवर्ड की एक तय सूची से मिलाया जाता है; इसे कहीं भेजा, सहेजा या लॉग नहीं किया जाता। Jarvis में अभी AI चैट नहीं है।',
      'health.disclaimer': 'Universal Health Radio केवल सामान्य जन-स्वास्थ्य जानकारी साझा करता है। यह चिकित्सा सलाह नहीं है। अपने स्वास्थ्य से जुड़े किसी सवाल के लिए किसी योग्य डॉक्टर या स्वास्थ्यकर्मी से बात करें; आपात स्थिति में अपने स्थानीय आपातकालीन नंबर पर कॉल करें।',
      'licensing': 'Jarvis केवल फ़ाउंडेशन के अपने पेजों के लिंक देता है। यह कार्यक्रमों की सामग्री को कॉपी या दोबारा प्रकाशित नहीं करता; वह सामग्री अपने मूल लाइसेंस और स्रोतों के अधीन रहती है।',
      'back': '← होम पर वापस',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'भाषा',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio, WHO, CDC और FDA के भरोसेमंद जन-स्वास्थ्य मार्गदर्शन का कई भाषाओं में अनुवाद करता है। यह रहा कार्यक्रम।',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids पर बच्चों के लिए कहानियाँ और सीखने की सामग्री है। यह रहा कार्यक्रम।',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti उन पाठकों तक किताबें और साक्षरता पहुँचाता है जिन्हें इनकी सबसे ज़्यादा ज़रूरत है। यह रहा कार्यक्रम।',
      'intent.programs.label': 'सभी कार्यक्रम',
      'intent.programs.reply': 'ये रहे फ़ाउंडेशन के तीनों कार्यक्रम।',
      'intent.mission.label': 'हमारा मिशन',
      'intent.mission.reply': 'जानिए फ़ाउंडेशन किन मूल्यों के लिए काम करता है।',
      'intent.donate.label': 'दान करें / जुड़ें',
      'intent.donate.reply': 'धन्यवाद! फ़ाउंडेशन को सहयोग देने या उससे जुड़ने का तरीका यह रहा।',
      'intent.health.label': 'स्वास्थ्य जानकारी',
      'intent.health.reply': 'मैं निजी चिकित्सा सवालों के जवाब नहीं दे सकता। Universal Health Radio, WHO, CDC और FDA की सामान्य जन-स्वास्थ्य जानकारी साझा करता है।',
      'intent.help.label': 'Jarvis क्या कर सकता है?',
      'intent.help.reply': 'मैं आपको Universal Health Radio, katha.kids, noorjyoti, हमारे मिशन या दान करने के तरीके तक ले जा सकता हूँ। कोई सुझाव आज़माएँ।',
      'intent.unknown.reply': 'माफ़ कीजिए, मैं समझ नहीं पाया। "रेडियो", "बच्चों की कहानियाँ", "साक्षरता", "मिशन" या "दान" लिखकर देखें।',

      'skill.radio.desc': 'कई भाषाओं में जन-स्वास्थ्य ऑडियो',
      'skill.katha.desc': 'बच्चों के लिए कहानियाँ और सीखना',
      'skill.noorjyoti.desc': 'किताबें और साक्षरता',
      'skill.mission.desc': 'हम यह काम क्यों करते हैं',
      'skill.donate.desc': 'सहयोग करें या स्वयंसेवा करें',

      'suggest.radio': 'स्वास्थ्य रेडियो सुनें',
      'suggest.katha': 'बच्चों की कहानियाँ',
      'suggest.noorjyoti': 'साक्षरता कार्यक्रम',
      'suggest.donate': 'मैं दान कैसे करूँ?'
    },
    // Simplified Chinese.
    zh: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': '查找我们的项目、节目以及参与方式。输入您想找的内容。',
      'bar.placeholder': '例如“收听健康广播”或“我怎样捐款？”',
      'bar.label': '询问 Jarvis',
      'bar.submit': '前往',
      'suggest.heading': '试试',
      'briefing.heading': '基金会今日一览',
      'skills.heading': '本站全部内容',
      'result.open': '打开',
      'privacy': 'Jarvis 完全在您的浏览器中运行。您输入的内容只会与本页面上一份固定的关键词列表进行匹配，不会被发送到任何地方，也不会被保存或记录。Jarvis 目前还没有 AI 聊天功能。',
      'health.disclaimer': 'Universal Health Radio 仅提供一般性的公共卫生信息，不构成医疗建议。如有个人健康问题，请咨询合格的医生或医护人员；如遇紧急情况，请拨打当地急救电话。',
      'licensing': 'Jarvis 只链接到基金会自己的页面，不会复制或转载项目内容；这些内容仍受其原始许可和来源的约束。',
      'back': '← 返回首页',
      'nav.jarvis': 'Jarvis',
      'lang.label': '语言',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio 将世界卫生组织（WHO）、美国疾病控制与预防中心（CDC）和美国食品药品监督管理局（FDA）发布的可信公共卫生指南翻译成多种语言。这是该项目。',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids 提供儿童故事和学习内容。这是该项目。',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti 为最需要的读者送去图书，推广识字。这是该项目。',
      'intent.programs.label': '全部项目',
      'intent.programs.reply': '这是基金会的三个项目。',
      'intent.mission.label': '我们的使命',
      'intent.mission.reply': '这是基金会的宗旨。',
      'intent.donate.label': '捐款 / 参与',
      'intent.donate.reply': '谢谢您！以下是支持或参与基金会的方式。',
      'intent.health.label': '健康信息',
      'intent.health.reply': '我无法回答个人医疗问题。Universal Health Radio 分享来自 WHO、CDC 和 FDA 的一般性公共卫生信息。',
      'intent.help.label': 'Jarvis 能做什么？',
      'intent.help.reply': '我可以带您前往 Universal Health Radio、katha.kids、noorjyoti、我们的使命或捐款方式。试试上面的建议吧。',
      'intent.unknown.reply': '抱歉，我没有理解。试试输入“广播”、“儿童故事”、“识字”、“使命”或“捐款”。',

      'skill.radio.desc': '多种语言的公共卫生音频',
      'skill.katha.desc': '儿童故事与学习',
      'skill.noorjyoti.desc': '图书与识字',
      'skill.mission.desc': '我们为什么做这项工作',
      'skill.donate.desc': '支持或成为志愿者',

      'suggest.radio': '收听健康广播',
      'suggest.katha': '儿童故事',
      'suggest.noorjyoti': '识字项目',
      'suggest.donate': '我怎样捐款？'
    },
    ta: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'எங்கள் திட்டங்கள், நிகழ்ச்சிகள் மற்றும் உதவும் வழிகளைக் கண்டறியுங்கள். நீங்கள் தேடுவதை எழுதுங்கள்.',
      'bar.placeholder': 'எ.கா. "வானொலி கேட்க வேண்டும்" அல்லது "நான் எப்படி நன்கொடை அளிப்பது?"',
      'bar.label': 'Jarvis-இடம் கேளுங்கள்',
      'bar.submit': 'செல்',
      'suggest.heading': 'முயற்சிக்கவும்',
      'briefing.heading': 'இன்று அறக்கட்டளையில்',
      'skills.heading': 'இந்தத் தளத்தில் உள்ள அனைத்தும்',
      'result.open': 'திற',
      'privacy': 'Jarvis முழுவதும் உங்கள் உலாவியிலேயே இயங்குகிறது. நீங்கள் எழுதுவது இந்தப் பக்கத்தில் உள்ள ஒரு நிலையான முக்கியச்சொல் பட்டியலுடன் மட்டுமே ஒப்பிடப்படுகிறது; அது எங்கும் அனுப்பப்படுவதோ, சேமிக்கப்படுவதோ, பதிவு செய்யப்படுவதோ இல்லை. Jarvis-இல் இன்னும் AI உரையாடல் வசதி இல்லை.',
      'health.disclaimer': 'Universal Health Radio பொதுவான பொதுச் சுகாதாரத் தகவல்களை மட்டுமே பகிர்கிறது. இது மருத்துவ ஆலோசனை அல்ல. உங்கள் தனிப்பட்ட உடல்நலக் கேள்விகளுக்குத் தகுதியான மருத்துவரையோ சுகாதாரப் பணியாளரையோ அணுகுங்கள்; அவசர நிலையில் உங்கள் உள்ளூர் அவசர உதவி எண்ணை அழையுங்கள்.',
      'licensing': 'Jarvis அறக்கட்டளையின் சொந்தப் பக்கங்களுக்கு மட்டுமே இணைப்புகளைத் தருகிறது. இது திட்ட உள்ளடக்கத்தை நகலெடுப்பதோ மறுபதிப்பு செய்வதோ இல்லை; அந்த உள்ளடக்கம் அதன் மூல உரிமங்களுக்கும் ஆதாரங்களுக்கும் உட்பட்டதாகவே இருக்கும்.',
      'back': '← முகப்புக்குத் திரும்பு',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'மொழி',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio, WHO, CDC, FDA ஆகியவற்றின் நம்பகமான பொதுச் சுகாதார வழிகாட்டுதல்களைப் பல மொழிகளில் மொழிபெயர்க்கிறது. இதோ அந்தத் திட்டம்.',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids-இல் குழந்தைகளுக்கான கதைகளும் கற்றல் உள்ளடக்கமும் உள்ளன. இதோ அந்தத் திட்டம்.',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti மிகவும் தேவைப்படும் வாசகர்களுக்குப் புத்தகங்களையும் எழுத்தறிவையும் கொண்டு சேர்க்கிறது. இதோ அந்தத் திட்டம்.',
      'intent.programs.label': 'அனைத்துத் திட்டங்கள்',
      'intent.programs.reply': 'அறக்கட்டளையின் மூன்று திட்டங்களும் இதோ.',
      'intent.mission.label': 'எங்கள் நோக்கம்',
      'intent.mission.reply': 'அறக்கட்டளை எதற்காகச் செயல்படுகிறது என்பது இதோ.',
      'intent.donate.label': 'நன்கொடை / இணைந்திடுங்கள்',
      'intent.donate.reply': 'நன்றி! அறக்கட்டளைக்கு ஆதரவளிக்கவோ அதில் இணையவோ வழி இதோ.',
      'intent.health.label': 'சுகாதாரத் தகவல்',
      'intent.health.reply': 'தனிப்பட்ட மருத்துவக் கேள்விகளுக்கு என்னால் பதிலளிக்க முடியாது. Universal Health Radio, WHO, CDC, FDA வழங்கும் பொதுவான பொதுச் சுகாதாரத் தகவல்களைப் பகிர்கிறது.',
      'intent.help.label': 'Jarvis என்ன செய்யும்?',
      'intent.help.reply': 'நான் உங்களை Universal Health Radio, katha.kids, noorjyoti, எங்கள் நோக்கம் அல்லது நன்கொடை அளிக்கும் வழிக்கு அழைத்துச் செல்ல முடியும். ஒரு பரிந்துரையை முயற்சிக்கவும்.',
      'intent.unknown.reply': 'மன்னிக்கவும், எனக்குப் புரியவில்லை. "வானொலி", "குழந்தைகள் கதைகள்", "எழுத்தறிவு", "நோக்கம்" அல்லது "நன்கொடை" என்று எழுதிப் பாருங்கள்.',

      'skill.radio.desc': 'பல மொழிகளில் பொதுச் சுகாதார ஒலி நிகழ்ச்சிகள்',
      'skill.katha.desc': 'குழந்தைகளுக்கான கதைகளும் கற்றலும்',
      'skill.noorjyoti.desc': 'புத்தகங்களும் எழுத்தறிவும்',
      'skill.mission.desc': 'நாங்கள் ஏன் இந்தப் பணியைச் செய்கிறோம்',
      'skill.donate.desc': 'ஆதரவளியுங்கள் அல்லது தன்னார்வலராகுங்கள்',

      'suggest.radio': 'சுகாதார வானொலி கேளுங்கள்',
      'suggest.katha': 'குழந்தைகள் கதைகள்',
      'suggest.noorjyoti': 'எழுத்தறிவுத் திட்டம்',
      'suggest.donate': 'நான் எப்படி நன்கொடை அளிப்பது?'
    },
    te: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'మా కార్యక్రమాలు, షోలు, సహాయం చేసే మార్గాలను కనుగొనండి. మీరు వెతుకుతున్నది టైప్ చేయండి.',
      'bar.placeholder': 'ఉదా. "రేడియో వినాలి" లేదా "నేను ఎలా విరాళం ఇవ్వాలి?"',
      'bar.label': 'Jarvisను అడగండి',
      'bar.submit': 'వెళ్ళండి',
      'suggest.heading': 'ప్రయత్నించండి',
      'briefing.heading': 'ఈరోజు ఫౌండేషన్‌లో',
      'skills.heading': 'ఈ సైట్‌లో ఉన్నవన్నీ',
      'result.open': 'తెరవండి',
      'privacy': 'Jarvis పూర్తిగా మీ బ్రౌజర్‌లోనే పనిచేస్తుంది. మీరు టైప్ చేసేది ఈ పేజీలోని ఒక స్థిరమైన కీవర్డ్‌ల జాబితాతో మాత్రమే పోల్చబడుతుంది; అది ఎక్కడికీ పంపబడదు, నిల్వ చేయబడదు లేదా లాగ్ చేయబడదు. Jarvisలో ఇంకా AI చాట్ సదుపాయం లేదు.',
      'health.disclaimer': 'Universal Health Radio సాధారణ ప్రజారోగ్య సమాచారాన్ని మాత్రమే అందిస్తుంది. ఇది వైద్య సలహా కాదు. మీ వ్యక్తిగత ఆరోగ్య ప్రశ్నల కోసం అర్హత కలిగిన వైద్యుడిని లేదా ఆరోగ్య కార్యకర్తను సంప్రదించండి; అత్యవసర పరిస్థితిలో మీ స్థానిక అత్యవసర నంబర్‌కు కాల్ చేయండి.',
      'licensing': 'Jarvis ఫౌండేషన్ సొంత పేజీలకు మాత్రమే లింక్‌లు ఇస్తుంది. ఇది కార్యక్రమాల కంటెంట్‌ను కాపీ చేయదు లేదా తిరిగి ప్రచురించదు; ఆ కంటెంట్ దాని అసలు లైసెన్సులు మరియు మూలాలకు లోబడి ఉంటుంది.',
      'back': '← హోమ్‌కు తిరిగి',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'భాష',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio, WHO, CDC మరియు FDA యొక్క విశ్వసనీయ ప్రజారోగ్య మార్గదర్శకాలను అనేక భాషల్లోకి అనువదిస్తుంది. ఇదిగో ఆ కార్యక్రమం.',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kidsలో పిల్లల కథలు మరియు నేర్చుకునే కంటెంట్ ఉన్నాయి. ఇదిగో ఆ కార్యక్రమం.',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti అత్యంత అవసరమైన పాఠకులకు పుస్తకాలను మరియు అక్షరాస్యతను అందిస్తుంది. ఇదిగో ఆ కార్యక్రమం.',
      'intent.programs.label': 'అన్ని కార్యక్రమాలు',
      'intent.programs.reply': 'ఫౌండేషన్ యొక్క మూడు కార్యక్రమాలు ఇవిగో.',
      'intent.mission.label': 'మా లక్ష్యం',
      'intent.mission.reply': 'ఫౌండేషన్ దేని కోసం పనిచేస్తుందో ఇక్కడ చూడండి.',
      'intent.donate.label': 'విరాళం / పాల్గొనండి',
      'intent.donate.reply': 'ధన్యవాదాలు! ఫౌండేషన్‌కు మద్దతు ఇవ్వడానికి లేదా అందులో పాల్గొనడానికి మార్గం ఇదిగో.',
      'intent.health.label': 'ఆరోగ్య సమాచారం',
      'intent.health.reply': 'వ్యక్తిగత వైద్య ప్రశ్నలకు నేను సమాధానం ఇవ్వలేను. Universal Health Radio, WHO, CDC మరియు FDA నుండి సాధారణ ప్రజారోగ్య సమాచారాన్ని అందిస్తుంది.',
      'intent.help.label': 'Jarvis ఏమి చేయగలదు?',
      'intent.help.reply': 'నేను మిమ్మల్ని Universal Health Radio, katha.kids, noorjyoti, మా లక్ష్యం లేదా విరాళం ఇచ్చే మార్గానికి తీసుకెళ్లగలను. ఒక సూచనను ప్రయత్నించండి.',
      'intent.unknown.reply': 'క్షమించండి, నాకు అర్థం కాలేదు. "రేడియో", "పిల్లల కథలు", "అక్షరాస్యత", "లక్ష్యం" లేదా "విరాళం" అని టైప్ చేసి చూడండి.',

      'skill.radio.desc': 'అనేక భాషల్లో ప్రజారోగ్య ఆడియో',
      'skill.katha.desc': 'పిల్లల కోసం కథలు, నేర్చుకోవడం',
      'skill.noorjyoti.desc': 'పుస్తకాలు, అక్షరాస్యత',
      'skill.mission.desc': 'మేము ఈ పని ఎందుకు చేస్తున్నాం',
      'skill.donate.desc': 'మద్దతు ఇవ్వండి లేదా స్వచ్ఛందంగా పనిచేయండి',

      'suggest.radio': 'ఆరోగ్య రేడియో వినండి',
      'suggest.katha': 'పిల్లల కథలు',
      'suggest.noorjyoti': 'అక్షరాస్యత కార్యక్రమం',
      'suggest.donate': 'నేను ఎలా విరాళం ఇవ్వాలి?'
    },
    // Punjabi in Gurmukhi script.
    pa: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'ਸਾਡੇ ਪ੍ਰੋਗਰਾਮ, ਸ਼ੋਅ ਅਤੇ ਮਦਦ ਕਰਨ ਦੇ ਤਰੀਕੇ ਲੱਭੋ। ਤੁਸੀਂ ਜੋ ਲੱਭ ਰਹੇ ਹੋ, ਉਹ ਲਿਖੋ।',
      'bar.placeholder': 'ਜਿਵੇਂ "ਰੇਡੀਓ ਸੁਣਨਾ ਹੈ" ਜਾਂ "ਮੈਂ ਦਾਨ ਕਿਵੇਂ ਕਰਾਂ?"',
      'bar.label': 'Jarvis ਨੂੰ ਪੁੱਛੋ',
      'bar.submit': 'ਜਾਓ',
      'suggest.heading': 'ਅਜ਼ਮਾਓ',
      'briefing.heading': 'ਅੱਜ ਫਾਊਂਡੇਸ਼ਨ ਵਿੱਚ',
      'skills.heading': 'ਇਸ ਸਾਈਟ ਉੱਤੇ ਸਭ ਕੁਝ',
      'result.open': 'ਖੋਲ੍ਹੋ',
      'privacy': 'Jarvis ਪੂਰੀ ਤਰ੍ਹਾਂ ਤੁਹਾਡੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਚੱਲਦਾ ਹੈ। ਤੁਸੀਂ ਜੋ ਲਿਖਦੇ ਹੋ, ਉਸ ਨੂੰ ਇਸੇ ਪੰਨੇ ਉੱਤੇ ਕੀਵਰਡਾਂ ਦੀ ਇੱਕ ਪੱਕੀ ਸੂਚੀ ਨਾਲ ਹੀ ਮਿਲਾਇਆ ਜਾਂਦਾ ਹੈ; ਇਸ ਨੂੰ ਕਿਤੇ ਭੇਜਿਆ, ਸੰਭਾਲਿਆ ਜਾਂ ਲੌਗ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ। Jarvis ਵਿੱਚ ਹਾਲੇ AI ਚੈਟ ਨਹੀਂ ਹੈ।',
      'health.disclaimer': 'Universal Health Radio ਸਿਰਫ਼ ਆਮ ਜਨ-ਸਿਹਤ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਦਾ ਹੈ। ਇਹ ਡਾਕਟਰੀ ਸਲਾਹ ਨਹੀਂ ਹੈ। ਆਪਣੀ ਸਿਹਤ ਨਾਲ ਜੁੜੇ ਕਿਸੇ ਸਵਾਲ ਲਈ ਕਿਸੇ ਯੋਗ ਡਾਕਟਰ ਜਾਂ ਸਿਹਤ ਕਰਮਚਾਰੀ ਨਾਲ ਗੱਲ ਕਰੋ; ਐਮਰਜੈਂਸੀ ਵਿੱਚ ਆਪਣੇ ਸਥਾਨਕ ਐਮਰਜੈਂਸੀ ਨੰਬਰ ਉੱਤੇ ਕਾਲ ਕਰੋ।',
      'licensing': 'Jarvis ਸਿਰਫ਼ ਫਾਊਂਡੇਸ਼ਨ ਦੇ ਆਪਣੇ ਪੰਨਿਆਂ ਦੇ ਲਿੰਕ ਦਿੰਦਾ ਹੈ। ਇਹ ਪ੍ਰੋਗਰਾਮਾਂ ਦੀ ਸਮੱਗਰੀ ਨੂੰ ਕਾਪੀ ਜਾਂ ਦੁਬਾਰਾ ਪ੍ਰਕਾਸ਼ਿਤ ਨਹੀਂ ਕਰਦਾ; ਉਹ ਸਮੱਗਰੀ ਆਪਣੇ ਮੂਲ ਲਾਇਸੈਂਸਾਂ ਅਤੇ ਸਰੋਤਾਂ ਦੇ ਅਧੀਨ ਰਹਿੰਦੀ ਹੈ।',
      'back': '← ਮੁੱਖ ਪੰਨਾ',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'ਭਾਸ਼ਾ',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio, WHO, CDC ਅਤੇ FDA ਦੀ ਭਰੋਸੇਯੋਗ ਜਨ-ਸਿਹਤ ਸੇਧ ਦਾ ਕਈ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ। ਇਹ ਰਿਹਾ ਪ੍ਰੋਗਰਾਮ।',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids ਉੱਤੇ ਬੱਚਿਆਂ ਲਈ ਕਹਾਣੀਆਂ ਅਤੇ ਸਿੱਖਣ ਦੀ ਸਮੱਗਰੀ ਹੈ। ਇਹ ਰਿਹਾ ਪ੍ਰੋਗਰਾਮ।',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti ਉਨ੍ਹਾਂ ਪਾਠਕਾਂ ਤੱਕ ਕਿਤਾਬਾਂ ਅਤੇ ਸਾਖਰਤਾ ਪਹੁੰਚਾਉਂਦਾ ਹੈ ਜਿਨ੍ਹਾਂ ਨੂੰ ਇਨ੍ਹਾਂ ਦੀ ਸਭ ਤੋਂ ਵੱਧ ਲੋੜ ਹੈ। ਇਹ ਰਿਹਾ ਪ੍ਰੋਗਰਾਮ।',
      'intent.programs.label': 'ਸਾਰੇ ਪ੍ਰੋਗਰਾਮ',
      'intent.programs.reply': 'ਇਹ ਰਹੇ ਫਾਊਂਡੇਸ਼ਨ ਦੇ ਤਿੰਨੇ ਪ੍ਰੋਗਰਾਮ।',
      'intent.mission.label': 'ਸਾਡਾ ਮਿਸ਼ਨ',
      'intent.mission.reply': 'ਜਾਣੋ ਕਿ ਫਾਊਂਡੇਸ਼ਨ ਕਿਨ੍ਹਾਂ ਕਦਰਾਂ ਲਈ ਕੰਮ ਕਰਦੀ ਹੈ।',
      'intent.donate.label': 'ਦਾਨ ਕਰੋ / ਜੁੜੋ',
      'intent.donate.reply': 'ਧੰਨਵਾਦ! ਫਾਊਂਡੇਸ਼ਨ ਦਾ ਸਹਿਯੋਗ ਕਰਨ ਜਾਂ ਇਸ ਨਾਲ ਜੁੜਨ ਦਾ ਤਰੀਕਾ ਇਹ ਰਿਹਾ।',
      'intent.health.label': 'ਸਿਹਤ ਜਾਣਕਾਰੀ',
      'intent.health.reply': 'ਮੈਂ ਨਿੱਜੀ ਡਾਕਟਰੀ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਨਹੀਂ ਦੇ ਸਕਦਾ। Universal Health Radio, WHO, CDC ਅਤੇ FDA ਦੀ ਆਮ ਜਨ-ਸਿਹਤ ਜਾਣਕਾਰੀ ਸਾਂਝੀ ਕਰਦਾ ਹੈ।',
      'intent.help.label': 'Jarvis ਕੀ ਕਰ ਸਕਦਾ ਹੈ?',
      'intent.help.reply': 'ਮੈਂ ਤੁਹਾਨੂੰ Universal Health Radio, katha.kids, noorjyoti, ਸਾਡੇ ਮਿਸ਼ਨ ਜਾਂ ਦਾਨ ਕਰਨ ਦੇ ਤਰੀਕੇ ਤੱਕ ਲੈ ਜਾ ਸਕਦਾ ਹਾਂ। ਕੋਈ ਸੁਝਾਅ ਅਜ਼ਮਾਓ।',
      'intent.unknown.reply': 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। "ਰੇਡੀਓ", "ਬੱਚਿਆਂ ਦੀਆਂ ਕਹਾਣੀਆਂ", "ਸਾਖਰਤਾ", "ਮਿਸ਼ਨ" ਜਾਂ "ਦਾਨ" ਲਿਖ ਕੇ ਦੇਖੋ।',

      'skill.radio.desc': 'ਕਈ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਜਨ-ਸਿਹਤ ਆਡੀਓ',
      'skill.katha.desc': 'ਬੱਚਿਆਂ ਲਈ ਕਹਾਣੀਆਂ ਅਤੇ ਸਿੱਖਿਆ',
      'skill.noorjyoti.desc': 'ਕਿਤਾਬਾਂ ਅਤੇ ਸਾਖਰਤਾ',
      'skill.mission.desc': 'ਅਸੀਂ ਇਹ ਕੰਮ ਕਿਉਂ ਕਰਦੇ ਹਾਂ',
      'skill.donate.desc': 'ਸਹਿਯੋਗ ਦਿਓ ਜਾਂ ਸਵੈ-ਸੇਵਕ ਬਣੋ',

      'suggest.radio': 'ਸਿਹਤ ਰੇਡੀਓ ਸੁਣੋ',
      'suggest.katha': 'ਬੱਚਿਆਂ ਦੀਆਂ ਕਹਾਣੀਆਂ',
      'suggest.noorjyoti': 'ਸਾਖਰਤਾ ਪ੍ਰੋਗਰਾਮ',
      'suggest.donate': 'ਮੈਂ ਦਾਨ ਕਿਵੇਂ ਕਰਾਂ?'
    },
    gu: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'અમારા કાર્યક્રમો, શો અને મદદ કરવાની રીતો શોધો. તમે જે શોધી રહ્યા છો તે લખો.',
      'bar.placeholder': 'જેમ કે "રેડિયો સાંભળવો છે" અથવા "હું દાન કેવી રીતે કરું?"',
      'bar.label': 'Jarvis ને પૂછો',
      'bar.submit': 'જાઓ',
      'suggest.heading': 'અજમાવો',
      'briefing.heading': 'આજે ફાઉન્ડેશનમાં',
      'skills.heading': 'આ સાઇટ પર બધું',
      'result.open': 'ખોલો',
      'privacy': 'Jarvis સંપૂર્ણપણે તમારા બ્રાઉઝરમાં ચાલે છે. તમે જે લખો છો તેને ફક્ત આ જ પાના પરની કીવર્ડની એક નિશ્ચિત યાદી સાથે સરખાવવામાં આવે છે; તેને ક્યાંય મોકલવામાં, સાચવવામાં કે લોગ કરવામાં આવતું નથી. Jarvis માં હજી AI ચેટ નથી.',
      'health.disclaimer': 'Universal Health Radio ફક્ત સામાન્ય જાહેર આરોગ્ય માહિતી શેર કરે છે. આ તબીબી સલાહ નથી. તમારા આરોગ્ય સંબંધી કોઈ પ્રશ્ન માટે કોઈ લાયક ડૉક્ટર અથવા આરોગ્ય કાર્યકર સાથે વાત કરો; કટોકટીમાં તમારા સ્થાનિક ઇમરજન્સી નંબર પર કૉલ કરો.',
      'licensing': 'Jarvis ફક્ત ફાઉન્ડેશનનાં પોતાનાં પાનાંની લિંક આપે છે. તે કાર્યક્રમોની સામગ્રીની નકલ કે પુનઃપ્રકાશન કરતું નથી; તે સામગ્રી તેના મૂળ લાઇસન્સ અને સ્ત્રોતોને આધીન રહે છે.',
      'back': '← મુખ્ય પાનું',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'ભાષા',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio, WHO, CDC અને FDA ના વિશ્વસનીય જાહેર આરોગ્ય માર્ગદર્શનનો ઘણી ભાષાઓમાં અનુવાદ કરે છે. આ રહ્યો કાર્યક્રમ.',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids પર બાળકો માટે વાર્તાઓ અને શીખવાની સામગ્રી છે. આ રહ્યો કાર્યક્રમ.',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti જેમને સૌથી વધુ જરૂર છે તેવા વાચકો સુધી પુસ્તકો અને સાક્ષરતા પહોંચાડે છે. આ રહ્યો કાર્યક્રમ.',
      'intent.programs.label': 'બધા કાર્યક્રમો',
      'intent.programs.reply': 'આ રહ્યા ફાઉન્ડેશનના ત્રણેય કાર્યક્રમો.',
      'intent.mission.label': 'અમારું મિશન',
      'intent.mission.reply': 'જાણો કે ફાઉન્ડેશન કયાં મૂલ્યો માટે કામ કરે છે.',
      'intent.donate.label': 'દાન કરો / જોડાઓ',
      'intent.donate.reply': 'આભાર! ફાઉન્ડેશનને સહયોગ આપવાની કે તેની સાથે જોડાવાની રીત આ રહી.',
      'intent.health.label': 'આરોગ્ય માહિતી',
      'intent.health.reply': 'હું વ્યક્તિગત તબીબી પ્રશ્નોના જવાબ આપી શકતો નથી. Universal Health Radio, WHO, CDC અને FDA ની સામાન્ય જાહેર આરોગ્ય માહિતી શેર કરે છે.',
      'intent.help.label': 'Jarvis શું કરી શકે?',
      'intent.help.reply': 'હું તમને Universal Health Radio, katha.kids, noorjyoti, અમારા મિશન અથવા દાન કરવાની રીત સુધી લઈ જઈ શકું છું. કોઈ સૂચન અજમાવો.',
      'intent.unknown.reply': 'માફ કરશો, મને સમજાયું નહીં. "રેડિયો", "બાળકોની વાર્તાઓ", "સાક્ષરતા", "મિશન" અથવા "દાન" લખી જુઓ.',

      'skill.radio.desc': 'ઘણી ભાષાઓમાં જાહેર આરોગ્ય ઑડિયો',
      'skill.katha.desc': 'બાળકો માટે વાર્તાઓ અને શિક્ષણ',
      'skill.noorjyoti.desc': 'પુસ્તકો અને સાક્ષરતા',
      'skill.mission.desc': 'અમે આ કામ શા માટે કરીએ છીએ',
      'skill.donate.desc': 'સહયોગ આપો અથવા સ્વયંસેવક બનો',

      'suggest.radio': 'આરોગ્ય રેડિયો સાંભળો',
      'suggest.katha': 'બાળકોની વાર્તાઓ',
      'suggest.noorjyoti': 'સાક્ષરતા કાર્યક્રમ',
      'suggest.donate': 'હું દાન કેવી રીતે કરું?'
    },
    bn: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'আমাদের কর্মসূচি, অনুষ্ঠান আর সাহায্য করার উপায় খুঁজুন। আপনি যা খুঁজছেন তা লিখুন।',
      'bar.placeholder': 'যেমন "রেডিও শুনতে চাই" বা "আমি কীভাবে দান করব?"',
      'bar.label': 'Jarvis-কে জিজ্ঞাসা করুন',
      'bar.submit': 'যান',
      'suggest.heading': 'চেষ্টা করুন',
      'briefing.heading': 'আজ ফাউন্ডেশনে',
      'skills.heading': 'এই সাইটে যা কিছু আছে',
      'result.open': 'খুলুন',
      'privacy': 'Jarvis পুরোপুরি আপনার ব্রাউজারে চলে। আপনি যা লেখেন তা শুধু এই পাতার একটি নির্দিষ্ট কীওয়ার্ড তালিকার সঙ্গে মেলানো হয়; তা কোথাও পাঠানো, সংরক্ষণ বা লগ করা হয় না। Jarvis-এ এখনও AI চ্যাট নেই।',
      'health.disclaimer': 'Universal Health Radio কেবল সাধারণ জনস্বাস্থ্য তথ্য শেয়ার করে। এটি চিকিৎসা পরামর্শ নয়। আপনার নিজের স্বাস্থ্য নিয়ে কোনো প্রশ্ন থাকলে একজন যোগ্য ডাক্তার বা স্বাস্থ্যকর্মীর সঙ্গে কথা বলুন; জরুরি অবস্থায় আপনার স্থানীয় জরুরি নম্বরে ফোন করুন।',
      'licensing': 'Jarvis শুধু ফাউন্ডেশনের নিজস্ব পাতার লিংক দেয়। এটি কর্মসূচির বিষয়বস্তু কপি বা পুনঃপ্রকাশ করে না; সেই বিষয়বস্তু তার মূল লাইসেন্স ও উৎসের অধীনেই থাকে।',
      'back': '← মূল পাতা',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'ভাষা',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio, WHO, CDC ও FDA-র নির্ভরযোগ্য জনস্বাস্থ্য নির্দেশিকা বহু ভাষায় অনুবাদ করে। এই যে কর্মসূচিটি।',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids-এ শিশুদের জন্য গল্প আর শেখার বিষয়বস্তু আছে। এই যে কর্মসূচিটি।',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti যাঁদের সবচেয়ে বেশি প্রয়োজন সেই পাঠকদের কাছে বই আর সাক্ষরতা পৌঁছে দেয়। এই যে কর্মসূচিটি।',
      'intent.programs.label': 'সব কর্মসূচি',
      'intent.programs.reply': 'এই যে ফাউন্ডেশনের তিনটি কর্মসূচি।',
      'intent.mission.label': 'আমাদের লক্ষ্য',
      'intent.mission.reply': 'ফাউন্ডেশন কীসের জন্য কাজ করে, তা এখানে দেখুন।',
      'intent.donate.label': 'দান করুন / যুক্ত হোন',
      'intent.donate.reply': 'ধন্যবাদ! ফাউন্ডেশনকে সহায়তা করার বা এর সঙ্গে যুক্ত হওয়ার উপায় এখানে।',
      'intent.health.label': 'স্বাস্থ্য তথ্য',
      'intent.health.reply': 'আমি ব্যক্তিগত চিকিৎসা-সংক্রান্ত প্রশ্নের উত্তর দিতে পারি না। Universal Health Radio, WHO, CDC ও FDA-র সাধারণ জনস্বাস্থ্য তথ্য শেয়ার করে।',
      'intent.help.label': 'Jarvis কী করতে পারে?',
      'intent.help.reply': 'আমি আপনাকে Universal Health Radio, katha.kids, noorjyoti, আমাদের লক্ষ্য বা দান করার উপায়ে নিয়ে যেতে পারি। একটি পরামর্শ চেষ্টা করুন।',
      'intent.unknown.reply': 'দুঃখিত, বুঝতে পারলাম না। "রেডিও", "শিশুদের গল্প", "সাক্ষরতা", "লক্ষ্য" বা "দান" লিখে দেখুন।',

      'skill.radio.desc': 'বহু ভাষায় জনস্বাস্থ্য অডিও',
      'skill.katha.desc': 'শিশুদের জন্য গল্প আর শেখা',
      'skill.noorjyoti.desc': 'বই আর সাক্ষরতা',
      'skill.mission.desc': 'আমরা কেন এই কাজ করি',
      'skill.donate.desc': 'সহায়তা করুন বা স্বেচ্ছাসেবক হোন',

      'suggest.radio': 'স্বাস্থ্য রেডিও শুনুন',
      'suggest.katha': 'শিশুদের গল্প',
      'suggest.noorjyoti': 'সাক্ষরতা কর্মসূচি',
      'suggest.donate': 'আমি কীভাবে দান করব?'
    },
    // Urdu (right-to-left; LOCALES marks it dir: 'rtl').
    ur: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'ہمارے پروگرام، شوز اور مدد کرنے کے طریقے تلاش کریں۔ آپ جو ڈھونڈ رہے ہیں وہ لکھیں۔',
      'bar.placeholder': 'مثلاً "ریڈیو سننا ہے" یا "میں عطیہ کیسے دوں؟"',
      'bar.label': 'Jarvis سے پوچھیں',
      'bar.submit': 'جائیں',
      'suggest.heading': 'آزمائیں',
      'briefing.heading': 'آج فاؤنڈیشن میں',
      'skills.heading': 'اس سائٹ پر سب کچھ',
      'result.open': 'کھولیں',
      'privacy': 'Jarvis مکمل طور پر آپ کے براؤزر میں چلتا ہے۔ آپ جو لکھتے ہیں اسے صرف اسی صفحے پر موجود کلیدی الفاظ کی ایک مقررہ فہرست سے ملایا جاتا ہے؛ اسے کہیں بھیجا، محفوظ یا لاگ نہیں کیا جاتا۔ Jarvis میں ابھی AI چیٹ نہیں ہے۔',
      'health.disclaimer': 'Universal Health Radio صرف عام صحتِ عامہ کی معلومات فراہم کرتا ہے۔ یہ طبی مشورہ نہیں ہے۔ اپنی صحت سے متعلق کسی سوال کے لیے کسی مستند ڈاکٹر یا صحت کارکن سے بات کریں؛ ہنگامی صورت میں اپنے مقامی ایمرجنسی نمبر پر کال کریں۔',
      'licensing': 'Jarvis صرف فاؤنڈیشن کے اپنے صفحات کے لنک دیتا ہے۔ یہ پروگراموں کا مواد نقل یا دوبارہ شائع نہیں کرتا؛ وہ مواد اپنے اصل لائسنسوں اور ذرائع کے تابع رہتا ہے۔',
      'back': '→ مرکزی صفحہ',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'زبان',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio، WHO، CDC اور FDA کی قابلِ اعتماد صحتِ عامہ کی رہنمائی کا کئی زبانوں میں ترجمہ کرتا ہے۔ یہ رہا پروگرام۔',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kids پر بچوں کے لیے کہانیاں اور سیکھنے کا مواد ہے۔ یہ رہا پروگرام۔',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti اُن قارئین تک کتابیں اور خواندگی پہنچاتا ہے جنہیں ان کی سب سے زیادہ ضرورت ہے۔ یہ رہا پروگرام۔',
      'intent.programs.label': 'تمام پروگرام',
      'intent.programs.reply': 'یہ رہے فاؤنڈیشن کے تینوں پروگرام۔',
      'intent.mission.label': 'ہمارا مشن',
      'intent.mission.reply': 'جانیے کہ فاؤنڈیشن کن اقدار کے لیے کام کرتی ہے۔',
      'intent.donate.label': 'عطیہ دیں / شامل ہوں',
      'intent.donate.reply': 'شکریہ! فاؤنڈیشن کی مدد کرنے یا اس میں شامل ہونے کا طریقہ یہ رہا۔',
      'intent.health.label': 'صحت کی معلومات',
      'intent.health.reply': 'میں ذاتی طبی سوالات کے جواب نہیں دے سکتا۔ Universal Health Radio، WHO، CDC اور FDA کی عام صحتِ عامہ کی معلومات فراہم کرتا ہے۔',
      'intent.help.label': 'Jarvis کیا کر سکتا ہے؟',
      'intent.help.reply': 'میں آپ کو Universal Health Radio، katha.kids، noorjyoti، ہمارے مشن یا عطیہ دینے کے طریقے تک لے جا سکتا ہوں۔ کوئی تجویز آزمائیں۔',
      'intent.unknown.reply': 'معاف کیجیے، میں سمجھ نہیں پایا۔ "ریڈیو"، "بچوں کی کہانیاں"، "خواندگی"، "مشن" یا "عطیہ" لکھ کر دیکھیں۔',

      'skill.radio.desc': 'کئی زبانوں میں صحتِ عامہ کا آڈیو',
      'skill.katha.desc': 'بچوں کے لیے کہانیاں اور تعلیم',
      'skill.noorjyoti.desc': 'کتابیں اور خواندگی',
      'skill.mission.desc': 'ہم یہ کام کیوں کرتے ہیں',
      'skill.donate.desc': 'تعاون کریں یا رضاکار بنیں',

      'suggest.radio': 'صحت ریڈیو سنیں',
      'suggest.katha': 'بچوں کی کہانیاں',
      'suggest.noorjyoti': 'خواندگی پروگرام',
      'suggest.donate': 'میں عطیہ کیسے دوں؟'
    },
    or: {
      'page.title': 'Jarvis — Universal Health Foundation',
      'page.heading': 'Jarvis',
      'page.sub': 'ଆମର କାର୍ଯ୍ୟକ୍ରମ, ଶୋ ଏବଂ ସାହାଯ୍ୟ କରିବାର ଉପାୟ ଖୋଜନ୍ତୁ। ଆପଣ ଯାହା ଖୋଜୁଛନ୍ତି ତାହା ଲେଖନ୍ତୁ।',
      'bar.placeholder': 'ଯେପରି "ରେଡିଓ ଶୁଣିବାକୁ ଚାହେଁ" ବା "ମୁଁ କିପରି ଦାନ କରିବି?"',
      'bar.label': 'Jarvisକୁ ପଚାରନ୍ତୁ',
      'bar.submit': 'ଯାଆନ୍ତୁ',
      'suggest.heading': 'ଚେଷ୍ଟା କରନ୍ତୁ',
      'briefing.heading': 'ଆଜି ଫାଉଣ୍ଡେସନରେ',
      'skills.heading': 'ଏହି ସାଇଟରେ ଥିବା ସବୁକିଛି',
      'result.open': 'ଖୋଲନ୍ତୁ',
      'privacy': 'Jarvis ସମ୍ପୂର୍ଣ୍ଣ ଭାବେ ଆପଣଙ୍କ ବ୍ରାଉଜରରେ ଚାଲେ। ଆପଣ ଯାହା ଲେଖନ୍ତି ତାହାକୁ କେବଳ ଏହି ପୃଷ୍ଠାରେ ଥିବା ଏକ ନିର୍ଦ୍ଦିଷ୍ଟ କୀୱାର୍ଡ ତାଲିକା ସହ ମିଳାଯାଏ; ଏହାକୁ କୌଣସି ସ୍ଥାନକୁ ପଠାଯାଏ ନାହିଁ, ସଂରକ୍ଷଣ କିମ୍ବା ଲଗ୍ କରାଯାଏ ନାହିଁ। Jarvisରେ ଏବେ ପର୍ଯ୍ୟନ୍ତ AI ଚାଟ୍ ନାହିଁ।',
      'health.disclaimer': 'Universal Health Radio କେବଳ ସାଧାରଣ ଜନସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା ପ୍ରଦାନ କରେ। ଏହା ଚିକିତ୍ସା ପରାମର୍ଶ ନୁହେଁ। ଆପଣଙ୍କ ନିଜ ସ୍ୱାସ୍ଥ୍ୟ ସମ୍ବନ୍ଧୀୟ କୌଣସି ପ୍ରଶ୍ନ ପାଇଁ ଜଣେ ଯୋଗ୍ୟ ଡାକ୍ତର କିମ୍ବା ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ; ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତିରେ ଆପଣଙ୍କ ସ୍ଥାନୀୟ ଜରୁରୀକାଳୀନ ନମ୍ବରକୁ କଲ୍ କରନ୍ତୁ।',
      'licensing': 'Jarvis କେବଳ ଫାଉଣ୍ଡେସନର ନିଜସ୍ୱ ପୃଷ୍ଠାଗୁଡ଼ିକର ଲିଙ୍କ ଦିଏ। ଏହା କାର୍ଯ୍ୟକ୍ରମର ବିଷୟବସ୍ତୁକୁ ନକଲ କିମ୍ବା ପୁନଃପ୍ରକାଶ କରେ ନାହିଁ; ସେହି ବିଷୟବସ୍ତୁ ତାହାର ମୂଳ ଲାଇସେନ୍ସ ଓ ଉତ୍ସର ଅଧୀନରେ ରହେ।',
      'back': '← ମୁଖ୍ୟ ପୃଷ୍ଠା',
      'nav.jarvis': 'Jarvis',
      'lang.label': 'ଭାଷା',

      'intent.radio.label': 'Universal Health Radio',
      'intent.radio.reply': 'Universal Health Radio, WHO, CDC ଓ FDAର ବିଶ୍ୱସନୀୟ ଜନସ୍ୱାସ୍ଥ୍ୟ ମାର୍ଗଦର୍ଶିକାକୁ ଅନେକ ଭାଷାରେ ଅନୁବାଦ କରେ। ଏହି ହେଉଛି କାର୍ଯ୍ୟକ୍ରମଟି।',
      'intent.katha.label': 'katha.kids',
      'intent.katha.reply': 'katha.kidsରେ ପିଲାମାନଙ୍କ ପାଇଁ ଗପ ଓ ଶିକ୍ଷଣ ସାମଗ୍ରୀ ଅଛି। ଏହି ହେଉଛି କାର୍ଯ୍ୟକ୍ରମଟି।',
      'intent.noorjyoti.label': 'noorjyoti',
      'intent.noorjyoti.reply': 'noorjyoti ଯେଉଁ ପାଠକମାନଙ୍କର ସବୁଠାରୁ ଅଧିକ ଆବଶ୍ୟକତା ଅଛି ସେମାନଙ୍କ ପାଖରେ ବହି ଓ ସାକ୍ଷରତା ପହଞ୍ଚାଏ। ଏହି ହେଉଛି କାର୍ଯ୍ୟକ୍ରମଟି।',
      'intent.programs.label': 'ସମସ୍ତ କାର୍ଯ୍ୟକ୍ରମ',
      'intent.programs.reply': 'ଏହି ହେଉଛି ଫାଉଣ୍ଡେସନର ତିନୋଟି କାର୍ଯ୍ୟକ୍ରମ।',
      'intent.mission.label': 'ଆମର ଲକ୍ଷ୍ୟ',
      'intent.mission.reply': 'ଫାଉଣ୍ଡେସନ କେଉଁ ମୂଲ୍ୟବୋଧ ପାଇଁ କାମ କରେ, ଏଠାରେ ଜାଣନ୍ତୁ।',
      'intent.donate.label': 'ଦାନ କରନ୍ତୁ / ଯୋଗ ଦିଅନ୍ତୁ',
      'intent.donate.reply': 'ଧନ୍ୟବାଦ! ଫାଉଣ୍ଡେସନକୁ ସହଯୋଗ କରିବା କିମ୍ବା ଏଥିରେ ଯୋଗ ଦେବାର ଉପାୟ ଏଠାରେ।',
      'intent.health.label': 'ସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା',
      'intent.health.reply': 'ମୁଁ ବ୍ୟକ୍ତିଗତ ଚିକିତ୍ସା ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନର ଉତ୍ତର ଦେଇପାରିବି ନାହିଁ। Universal Health Radio, WHO, CDC ଓ FDAର ସାଧାରଣ ଜନସ୍ୱାସ୍ଥ୍ୟ ସୂଚନା ପ୍ରଦାନ କରେ।',
      'intent.help.label': 'Jarvis କ’ଣ କରିପାରେ?',
      'intent.help.reply': 'ମୁଁ ଆପଣଙ୍କୁ Universal Health Radio, katha.kids, noorjyoti, ଆମର ଲକ୍ଷ୍ୟ କିମ୍ବା ଦାନ କରିବାର ଉପାୟକୁ ନେଇଯାଇପାରିବି। ଗୋଟିଏ ପରାମର୍ଶ ଚେଷ୍ଟା କରନ୍ତୁ।',
      'intent.unknown.reply': 'କ୍ଷମା କରନ୍ତୁ, ମୁଁ ବୁଝିପାରିଲି ନାହିଁ। "ରେଡିଓ", "ପିଲାଙ୍କ ଗପ", "ସାକ୍ଷରତା", "ଲକ୍ଷ୍ୟ" କିମ୍ବା "ଦାନ" ଲେଖି ଦେଖନ୍ତୁ।',

      'skill.radio.desc': 'ଅନେକ ଭାଷାରେ ଜନସ୍ୱାସ୍ଥ୍ୟ ଅଡିଓ',
      'skill.katha.desc': 'ପିଲାମାନଙ୍କ ପାଇଁ ଗପ ଓ ଶିକ୍ଷା',
      'skill.noorjyoti.desc': 'ବହି ଓ ସାକ୍ଷରତା',
      'skill.mission.desc': 'ଆମେ ଏହି କାମ କାହିଁକି କରୁ',
      'skill.donate.desc': 'ସହଯୋଗ କରନ୍ତୁ କିମ୍ବା ସ୍ୱେଚ୍ଛାସେବୀ ହୁଅନ୍ତୁ',

      'suggest.radio': 'ସ୍ୱାସ୍ଥ୍ୟ ରେଡିଓ ଶୁଣନ୍ତୁ',
      'suggest.katha': 'ପିଲାଙ୍କ ଗପ',
      'suggest.noorjyoti': 'ସାକ୍ଷରତା କାର୍ଯ୍ୟକ୍ରମ',
      'suggest.donate': 'ମୁଁ କିପରି ଦାନ କରିବି?'
    }
  };

  var LOCALES = [
    { code: 'en', name: 'English', htmlLang: 'en' },
    { code: 'hi', name: 'हिन्दी', htmlLang: 'hi' },
    { code: 'zh', name: '中文（简体）', htmlLang: 'zh-Hans' },
    { code: 'ta', name: 'தமிழ்', htmlLang: 'ta' },
    { code: 'te', name: 'తెలుగు', htmlLang: 'te' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', htmlLang: 'pa' },
    { code: 'gu', name: 'ગુજરાતી', htmlLang: 'gu' },
    { code: 'bn', name: 'বাংলা', htmlLang: 'bn' },
    { code: 'or', name: 'ଓଡ଼ିଆ', htmlLang: 'or' },
    { code: 'ur', name: 'اردو', htmlLang: 'ur', dir: 'rtl' }
  ];

  // Picks the first supported locale from a list of BCP 47 tags (e.g. a ?lang= value,
  // then navigator.languages). "hi-IN" -> "hi", "zh-CN"/"zh-Hans" -> "zh". Defaults to "en".
  // Our Punjabi table is Gurmukhi; Shahmukhi readers ("pa-Arab", "pa-PK") can't read it, so skip those.
  function resolveLocale(candidates) {
    var list = [].concat(candidates || []);
    for (var i = 0; i < list.length; i++) {
      var tag = String(list[i] || '').toLowerCase();
      var base = tag.split(/[-_]/)[0];
      if (base === 'pa' && /[-_](arab|pk)(?![a-z])/.test(tag)) continue;
      if (Object.prototype.hasOwnProperty.call(STRINGS, base)) return base;
    }
    return 'en';
  }

  function t(key, locale) {
    var table = STRINGS[locale] || STRINGS.en;
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : STRINGS.en[key] || key;
  }

  // Order matters: first match wins. Health is checked before radio so that
  // "what medicine should I take" gets the general-information disclaimer.
  var INTENTS = [
    { id: 'help', href: null, keywords: ['help', 'what can you do', 'commands', 'jarvis',
      'मदद', 'सहायता', '帮助', '你能做什么', 'உதவி', 'సహాయం', 'ਮਦਦ', 'ਸਹਾਇਤਾ', 'મદદ', 'સહાય', 'সাহায্য', 'مدد', 'ସାହାଯ୍ୟ'] },
    { id: 'health', href: 'index.html#radio', disclaimer: true,
      keywords: ['symptom', 'diagnos', 'medicine', 'medication', 'dose', 'dosage', 'prescription', 'treatment', 'pain', 'fever', 'sick', 'doctor', 'cure', 'vaccine', 'vaccination',
        'दवा', 'दवाई', 'लक्षण', 'बुखार', 'दर्द', 'डॉक्टर', 'इलाज', 'खुराक', 'बीमार', 'टीका', 'टीके', 'नुस्खा',
        '药', '症状', '发烧', '发热', '疼', '痛', '医生', '治疗', '剂量', '生病', '疫苗', '诊断', '处方',
        'மருந்து', 'அறிகுறி', 'காய்ச்சல்', 'வலி', 'மருத்துவர்', 'டாக்டர்', 'சிகிச்சை', 'நோய்', 'தடுப்பூசி',
        'మందు', 'లక్షణ', 'జ్వర', 'నొప్పి', 'డాక్టర్', 'వైద్యుడ', 'చికిత్స', 'మోతాదు', 'అనారోగ్య', 'టీకా', 'వ్యాక్సిన్',
        'ਦਵਾ', 'ਲੱਛਣ', 'ਬੁਖ਼ਾਰ', 'ਬੁਖਾਰ', 'ਦਰਦ', 'ਡਾਕਟਰ', 'ਇਲਾਜ', 'ਖ਼ੁਰਾਕ', 'ਖੁਰਾਕ', 'ਬਿਮਾਰ', 'ਬੀਮਾਰ', 'ਟੀਕ',
        'દવા', 'લક્ષણ', 'તાવ', 'દુખાવ', 'દર્દ', 'ડૉક્ટર', 'ડોક્ટર', 'સારવાર', 'ઇલાજ', 'ડોઝ', 'બીમાર', 'બિમાર', 'રસી',
        'ওষুধ', 'ঔষধ', 'লক্ষণ', 'জ্বর', 'ব্যথা', 'ডাক্তার', 'চিকিৎসা', 'চিকিত্সা', 'ডোজ', 'অসুখ', 'অসুস্থ', 'টিকা',
        'دوا', 'علامت', 'بخار', 'درد', 'ڈاکٹر', 'علاج', 'خوراک', 'بیمار', 'ٹیکہ', 'ٹیکے', 'ویکسین', 'تشخیص', 'نسخہ',
        'ଔଷଧ', 'ଓଷଧ', 'ଲକ୍ଷଣ', 'ଜ୍ୱର', 'ଜ୍ବର', 'ଯନ୍ତ୍ରଣା', 'ବିନ୍ଧା', 'ଡାକ୍ତର', 'ଚିକିତ୍ସା', 'ଡୋଜ', 'ଅସୁସ୍ଥ', 'ରୋଗ', 'ଟିକା'] },
    { id: 'donate', href: 'index.html#give',
      keywords: ['donat', 'give', 'giving', 'support', 'volunteer', 'get involved', 'contribute', 'sponsor', 'contact', 'email',
        'दान', 'सहयोग', 'स्वयंसेव', 'संपर्क', 'जुड़',
        '捐', '支持', '志愿', '联系', '参与',
        'நன்கொடை', 'ஆதரவ', 'தன்னார்வ', 'தொடர்பு', 'இணைந்',
        'విరాళ', 'మద్దతు', 'స్వచ్ఛంద', 'సంప్రదించ', 'పాల్గొన',
        'ਦਾਨ', 'ਸਹਿਯੋਗ', 'ਸਵੈ ਸੇਵ', 'ਸੰਪਰਕ', 'ਜੁੜ',
        'દાન', 'સહયોગ', 'સ્વયંસેવ', 'સંપર્ક', 'જોડા',
        // "যুক্ত হ" (join) as a phrase, so "যুক্তরাষ্ট্র" (United States) doesn't match.
        'দান', 'অনুদান', 'সহায়তা', 'স্বেচ্ছাসেব', 'যোগাযোগ', 'যুক্ত হ',
        'عطی', 'چندہ', 'رضاکار', 'رابطہ', 'شامل ہو', 'تعاون',
        'ଦାନ', 'ସହଯୋଗ', 'ସ୍ୱେଚ୍ଛାସେବ', 'ଯୋଗାଯୋଗ', 'ଯୋଗ ଦ'] },
    { id: 'radio', href: 'index.html#radio',
      keywords: ['radio', 'listen', 'audio', 'podcast', 'broadcast', 'shows', 'episode', 'station', 'health news', 'public health', 'who', 'cdc', 'fda',
        'रेडियो', 'सुन', 'ऑडियो', 'पॉडकास्ट', 'प्रसारण', 'एपिसोड',
        '广播', '电台', '收听', '音频', '播客', '节目',
        'வானொலி', 'ரேடியோ', 'கேட்க', 'கேளுங்கள்', 'ஆடியோ', 'பாட்காஸ்ட்', 'ஒலிபரப்பு',
        'రేడియో', 'వినండి', 'వినాలి', 'వినడ', 'ఆడియో', 'పాడ్‌కాస్ట్', 'ప్రసార',
        'ਰੇਡੀਓ', 'ਰੇਡੀਉ', 'ਸੁਣ', 'ਆਡੀਓ', 'ਪੌਡਕਾਸਟ', 'ਪ੍ਰਸਾਰਣ', 'ਐਪੀਸੋਡ',
        'રેડિયો', 'સાંભળ', 'ઑડિયો', 'ઓડિયો', 'પોડકાસ્ટ', 'પ્રસારણ', 'એપિસોડ',
        'রেডিও', 'শুন', 'শোন', 'অডিও', 'পডকাস্ট', 'সম্প্রচার',
        // Not a bare "سن": it starts "سنہ" (year), "سنگ" (stone) and more.
        'ریڈیو', 'سنیں', 'سنن', 'سنو', 'سنائیں', 'آڈیو', 'پوڈکاسٹ', 'نشریات',
        'ରେଡିଓ', 'ଶୁଣ', 'ଅଡିଓ', 'ପଡକାଷ୍ଟ', 'ପ୍ରସାରଣ'] },
    { id: 'katha', href: 'index.html#katha',
      keywords: ['katha', 'kid', 'child', 'story', 'stories', 'bedtime', 'learning for',
        'कथा', 'कहानी', 'कहानि', 'बच्च',
        '故事', '儿童', '孩子', '小孩', '童话',
        'கதை', 'குழந்தை', 'சிறுவர்', 'பிள்ளை',
        'కథ', 'పిల్ల', 'చిన్నార',
        'ਕਥਾ', 'ਕਹਾਣੀ', 'ਬੱਚ', 'ਬਚਿਆਂ',
        'કથા', 'વાર્તા', 'બાળક', 'છોકરા',
        // Not Bengali "কথা": it means "talk", as in "কথা বলুন".
        'গল্প', 'শিশু', 'বাচ্চা', 'ছোটদের', 'ছেলেমেয়ে',
        // Whole forms of "child", not the stem "بچ", which also starts "بچت" (savings).
        'کتھا', 'کہانی', 'بچے', 'بچوں', 'بچہ',
        // Not Odia "କଥା" either: it means "talk", as in "କଥା ହୁଅନ୍ତୁ".
        'ଗପ', 'କାହାଣୀ', 'ପିଲା', 'ଶିଶୁ', 'ଛୁଆ'] },
    { id: 'noorjyoti', href: 'index.html#noorjyoti',
      keywords: ['noor', 'jyoti', 'literacy', 'book', 'read', 'library',
        'नूर', 'ज्योति', 'साक्षरता', 'किताब', 'पुस्तक', 'पढ़',
        '识字', '读书', '阅读', '图书', '书',
        'நூர்', 'ஜோதி', 'எழுத்தறிவு', 'புத்தக', 'நூல்', 'படிக்க', 'வாசி',
        'నూర్', 'జ్యోతి', 'అక్షరాస్యత', 'పుస్తక', 'చదువు', 'చదవ', 'గ్రంథాలయ',
        'ਨੂਰ', 'ਜੋਤੀ', 'ਜਯੋਤੀ', 'ਸਾਖਰਤਾ', 'ਕਿਤਾਬ', 'ਪੁਸਤਕ', 'ਪੜ੍ਹ',
        'નૂર', 'જ્યોતિ', 'સાક્ષરતા', 'પુસ્તક', 'ચોપડી', 'વાંચ',
        'নূর', 'জ্যোতি', 'সাক্ষরতা', 'বই', 'পড়', 'গ্রন্থাগার',
        'نور', 'جیوتی', 'جوتی', 'خواندگی', 'کتاب', 'پڑھ', 'لائبریری',
        'ନୂର', 'ଜ୍ୟୋତି', 'ସାକ୍ଷରତା', 'ବହି', 'ପୁସ୍ତକ', 'ପଢ', 'ପାଠାଗାର'] },
    { id: 'mission', href: 'index.html#mission',
      keywords: ['mission', 'about', 'who are you', 'why', 'nonprofit', 'foundation', 'values',
        'मिशन', 'उद्देश्य', 'लक्ष्य', 'हमारे बारे', 'फ़ाउंडेशन', 'फाउंडेशन', 'संस्था',
        '使命', '宗旨', '关于', '基金会', '非营利',
        'நோக்கம்', 'குறிக்கோள்', 'எங்களைப் பற்றி', 'அறக்கட்டளை',
        'లక్ష్య', 'ఉద్దేశ', 'మా గురించి', 'ఫౌండేషన్', 'లాభాపేక్ష',
        'ਮਿਸ਼ਨ', 'ਉਦੇਸ਼', 'ਮਕਸਦ', 'ਟੀਚਾ', 'ਸਾਡੇ ਬਾਰੇ', 'ਫਾਊਂਡੇਸ਼ਨ', 'ਸੰਸਥਾ',
        'મિશન', 'ઉદ્દેશ', 'હેતુ', 'લક્ષ્ય', 'અમારા વિશે', 'ફાઉન્ડેશન', 'સંસ્થા',
        'লক্ষ্য', 'উদ্দেশ্য', 'মিশন', 'আমাদের সম্পর্কে', 'ফাউন্ডেশন', 'সংস্থা',
        'مشن', 'مقصد', 'ہدف', 'ہمارے بارے', 'فاؤنڈیشن', 'ادارہ', 'غیر منافع',
        'ଲକ୍ଷ୍ୟ', 'ଉଦ୍ଦେଶ୍ୟ', 'ମିଶନ', 'ଆମ ବିଷୟରେ', 'ଫାଉଣ୍ଡେସନ', 'ସଂସ୍ଥା'] },
    { id: 'programs', href: 'index.html#programs',
      keywords: ['program', 'everything', 'all', 'what do you do', 'services', 'content',
        'कार्यक्रम', 'सभी', 'सब कुछ', 'सेवा',
        '项目', '所有', '全部', '服务',
        'திட்ட', 'அனைத்து', 'எல்லா', 'சேவை',
        'కార్యక్రమ', 'అన్ని', 'అన్నీ', 'సేవ',
        'ਪ੍ਰੋਗਰਾਮ', 'ਸਾਰੇ', 'ਸਭ ਕੁਝ', 'ਸੇਵਾ',
        'કાર્યક્રમ', 'બધા', 'બધું', 'સેવા',
        'কর্মসূচি', 'কার্যক্রম', 'সব', 'সমস্ত', 'পরিষেবা', 'সেবা',
        'پروگرام', 'تمام', 'سب کچھ', 'سبھی', 'خدمات',
        'କାର୍ଯ୍ୟକ୍ରମ', 'ସମସ୍ତ', 'ସବୁ', 'ସେବା'] }
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

  // Keeps letters, combining marks (Indic vowel signs) and digits in any script and drops
  // zero-width (non-)joiners, which Telugu and Tamil keyboards insert inside words;
  // NFC makes precomposed and decomposed forms (e.g. "ड़") compare equal.
  // For Urdu it also drops optional vowel marks and tatweel, and maps Arabic-keyboard letters
  // to their Urdu forms (ي/ى -> ی, ك -> ک, ه -> ہ) so either keyboard matches.
  function normalize(text) {
    return String(text == null ? '' : text)
      .normalize('NFC')
      .replace(/[\u200c\u200d\u0640\u064b-\u065f\u0670]/g, '')
      .replace(/[\u064a\u0649]/g, '\u06cc')
      .replace(/\u0643/g, '\u06a9')
      .replace(/\u0647/g, '\u06c1')
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  var HAN = /\p{Script=Han}/u;
  var ASCII = /^[\x00-\x7f]*$/;

  // Chinese has no spaces between words, so Han keywords match anywhere in the text.
  // Otherwise keywords match a word prefix ("donat" -> "donate", "बच्च" -> "बच्चों"),
  // except short English keywords (<= 3 chars, e.g. "who", "all"), which must be a whole word.
  function matches(text, keyword) {
    keyword = normalize(keyword);
    if (HAN.test(keyword)) return text.indexOf(keyword) !== -1;
    if (keyword.indexOf(' ') !== -1) return (' ' + text + ' ').indexOf(' ' + keyword) !== -1;
    var wholeWord = ASCII.test(keyword) && keyword.length <= 3;
    var words = text.split(' ');
    for (var i = 0; i < words.length; i++) {
      if (wholeWord ? words[i] === keyword : words[i].indexOf(keyword) === 0) return true;
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
    LOCALES: LOCALES,
    resolveLocale: resolveLocale,
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
