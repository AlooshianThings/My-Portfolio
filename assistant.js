/* =====================================================================
   AYUSHI.OS — assistant.js
   AYA: the assistant process inside the system.
   Captions + optional voice, a guided tour, a command console you can
   type or speak to, sound controls, and small reactions to what you do.
   ===================================================================== */
(() => {
  'use strict';

  const AOS = window.AOS, SFX = window.SFX;
  if (!AOS || !SFX) return;

  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ico = d => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${d}</svg>`;
  const P = {
    ask: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M18.5 15.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    full: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    sfx: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6"/>',
    off: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M9 21h6"/>'
  };

  /* =================================================================
     Captions (AYA speaks; the words are always visible)
     ================================================================= */
  const aya = $('#aya'), txt = $('.aya__txt', aya), chipsEl = $('.aya__chips', aya), sr = $('#ayaSr');
  let token = 0, hideT = null, typeIv = null, cancelSpeech = null;

  function hideAya() {
    const my = token;
    clearTimeout(hideT); clearInterval(typeIv);
    aya.classList.remove('is-on', 'is-speaking');
    setTimeout(() => { if (token === my) aya.hidden = true; }, 420);
  }

  function say(text, o = {}) {
    const { chips = [], hold = 2600, onDone, voice = true, sticky = false } = o;
    const my = ++token;
    clearTimeout(hideT); clearInterval(typeIv);
    if (cancelSpeech) { cancelSpeech(); cancelSpeech = null; }
    aya.hidden = false;
    requestAnimationFrame(() => aya.classList.add('is-on'));
    aya.classList.add('is-speaking');
    txt.textContent = ''; chipsEl.innerHTML = ''; sr.textContent = text;

    let i = 0;
    const stepN = reduce ? text.length : Math.max(1, Math.ceil(text.length / 100));
    typeIv = setInterval(() => { i += stepN; txt.textContent = text.slice(0, i); if (i >= text.length) clearInterval(typeIv); }, 20);

    chips.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'achip' + (c.ghost ? ' achip--ghost' : ''); b.textContent = c.label;
      b.addEventListener('click', () => {
        const t = token;
        if (c.fn) c.fn();
        if (!c.keep && token === t) { SFX.stopSpeaking(); hideAya(); }
      });
      chipsEl.appendChild(b);
    });

    const finish = () => {
      if (my !== token) return;
      aya.classList.remove('is-speaking');
      if (onDone) onDone();
      if (my !== token) return;
      if (!sticky) hideT = setTimeout(() => { if (my === token) hideAya(); }, chips.length ? 22000 : hold);
    };
    if (voice) cancelSpeech = SFX.speak(text, { onend: finish });
    else setTimeout(finish, Math.max(1600, text.length * 55));
  }

  /* =================================================================
     Guided tour: AYA walks through every file, narrating each one
     ================================================================= */
  const TOUR = [
    ['about', 'This is Ayushi: a technologist in the middle of a system reconfiguration. Builder, communicator, coordinator.'],
    ['memory', 'Her history, written as a system log. Notice the last entry. Cybersecurity is still loading.'],
    ['skills', 'Installed modules, active practices, and what she is exploring now. No percentages, on purpose. Try dragging the constellation.'],
    ['projects', 'AAA Travels: a full-stack booking platform built with Django. You can run a seat-selection simulation in here.'],
    ['experience', 'A previous instance. Dubbing project manager, on multilingual productions for Netflix, Crunchyroll and NBCUniversal.'],
    ['communication', 'The shared library. Turning ideas into explanations, and chaos into plans.'],
    ['quest', 'Where she is headed. The map is unfinished on purpose.'],
    ['achievements', 'Six unlocked. One redacted.'],
    ['bugs', 'Known bugs. Yes, she documented them herself. You can reproduce one.'],
    ['inventory', 'Her inventory. Every item is linked to part of the system.'],
    ['save', 'Save point. If you would like to build something together, this is where you reach her.']
  ];
  let tour = null;

  function tourStep() {
    if (!tour) return;
    const idx = tour.i, [id, line] = TOUR[idx];
    tour.opening = true; AOS.closeAll(); AOS.openApp(id); tour.opening = false;
    say(line, {
      sticky: true,
      chips: [{ label: `SKIP  ${idx + 1}/${TOUR.length}`, fn: tourNext, keep: true }, { label: 'STOP', fn: stopTour, ghost: true }],
      onDone: () => { if (tour && tour.i === idx) tour.t = setTimeout(tourNext, 1300); }
    });
  }
  function tourNext() {
    if (!tour) return;
    clearTimeout(tour.t); tour.i++;
    if (tour.i >= TOUR.length) return endTour();
    tourStep();
  }
  function startTour() { stopTour(true); closeConsole(); tour = { i: 0, t: null, opening: false }; tourStep(); }
  function stopTour(silent) {
    if (!tour) return;
    clearTimeout(tour.t); tour = null;
    if (silent !== true) { SFX.stopSpeaking(); hideAya(); AOS.toast('Tour stopped.'); }
  }
  function endTour() {
    clearTimeout(tour.t); tour = null;
    say('That is the whole system. Ask me anything, or explore on your own.', {
      chips: [{ label: 'ASK AYA', fn: openConsole }, { label: 'EXPLORE', ghost: true }]
    });
  }

  /* =================================================================
     Greeting + little reactions
     ================================================================= */
  AOS.greet = () => {
    const h = new Date().getHours();
    const g = h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 17 ? 'Good afternoon' : 'Good evening';
    say(`${g}. Welcome to Ayushi's personal system. Every module is online, except the future. Shall I show you around?`, {
      chips: [
        { label: 'GUIDED TOUR', fn: startTour },
        { label: "I'LL EXPLORE", fn: () => AOS.openApp('about'), ghost: true },
        { label: 'ASK AYA', fn: openConsole, ghost: true }
      ]
    });
  };
  const REACT = {
    about: 'Profile loaded. That is her.',
    memory: 'Reading the log. Note the last entry.',
    skills: 'Modules indexed. The constellation is draggable.',
    projects: 'Archive open. Try the seat simulation.',
    experience: 'Previous instance restored.',
    communication: 'Shared library loaded.',
    quest: 'Live map. It is unfinished.',
    achievements: 'Six unlocked. One redacted.',
    bugs: 'Known bugs, voluntarily disclosed.',
    inventory: 'Hover the items.',
    save: 'Save point reached.'
  };
  AOS.onOpen = (id, first) => {
    if (tour && tour.opening) return;
    if (tour) { stopTour(true); }
    if (first && !cmdOpen && REACT[id]) say(REACT[id], { hold: 2400 });
  };
  AOS.onFullSync = () => {
    SFX.play('unlock');
    const core = $('#core'), r = core.getBoundingClientRect();
    if (window.FX && FX.burst) FX.burst(r.left + r.width / 2, r.top + r.height / 2);
    core.classList.add('is-flash'); setTimeout(() => core.classList.remove('is-flash'), 1300);
    if (!tour) say('Full synchronization. Every file has been opened. Thorough.', { hold: 4200 });
  };
  AOS.say = say; AOS.startTour = startTour;

  /* =================================================================
     Sound controls (tray)
     ================================================================= */
  const askBtn = $('#askBtn'), sndBtn = $('#sndBtn');
  askBtn.innerHTML = ico(P.ask);
  function paintSound(st) {
    sndBtn.innerHTML = ico(!st.sound ? P.off : st.voice ? P.full : P.sfx);
    sndBtn.classList.toggle('is-on', st.sound && st.voice);
    sndBtn.classList.toggle('is-muted', !st.sound);
    sndBtn.title = !st.sound ? 'Sound off' : st.voice ? 'Sound and voice on' : 'Sound on, voice off';
    sndBtn.setAttribute('aria-label', sndBtn.title + '. Activate to change.');
  }
  SFX.onChange(paintSound); paintSound(SFX.state);
  sndBtn.addEventListener('click', () => {
    const st = SFX.state;
    if (st.sound && st.voice) { SFX.setVoice(false); AOS.toast('Sound on. Voice off.'); }
    else if (st.sound) { SFX.setSound(false); AOS.toast('Sound off.'); }
    else { SFX.setSound(true); SFX.setVoice(true); SFX.setAmbient(true); AOS.toast('Sound and voice on.'); }
  });
  askBtn.addEventListener('click', () => (cmdOpen ? closeConsole() : openConsole()));

  /* =================================================================
     Command console
     ================================================================= */
  const cmd = $('#cmd'), log = $('#cmdLog'), input = $('#cmdInput'), sugg = $('#cmdChips'), micBtn = $('#micBtn');
  micBtn.innerHTML = ico(P.mic);
  let cmdOpen = false;

  function addLine(who, text, typed) {
    const li = document.createElement('li');
    li.className = who === 'YOU' ? 'is-you' : 'is-aya';
    li.innerHTML = `<b>${who}</b><p></p>`;
    const p = $('p', li);
    log.appendChild(li);
    if (typed && !reduce) {
      let i = 0;
      const iv = setInterval(() => { i += 2; p.textContent = text.slice(0, i); log.scrollTop = log.scrollHeight; if (i >= text.length) clearInterval(iv); }, 14);
    } else p.textContent = text;
    log.scrollTop = log.scrollHeight;
  }
  function reply(text, voice = true) {
    addLine('AYA', text, true);
    SFX.play('reply');
    if (voice) SFX.speak(text);
  }
  const SUGGEST = ['who is Ayushi?', 'what does she know?', 'show projects', 'what is she exploring?', 'start the tour', 'how do I contact her?'];
  function renderSuggestions() {
    sugg.innerHTML = '';
    SUGGEST.forEach(s => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'achip'; b.textContent = s;
      b.addEventListener('click', () => run(s));
      sugg.appendChild(b);
    });
  }
  function openConsole() {
    if (cmdOpen) { input.focus(); return; }
    cmdOpen = true;
    if (tour) stopTour(true);
    hideAya();
    cmd.hidden = false;
    requestAnimationFrame(() => cmd.classList.add('is-on'));
    SFX.play('open');
    if (!log.children.length) reply("I am AYA, the assistant process inside AYUSHI.OS. Ask me about Ayushi, or type help. You can also press the microphone and speak.");
    renderSuggestions();
    setTimeout(() => input.focus(), 60);
  }
  function closeConsole() {
    if (!cmdOpen) return;
    cmdOpen = false;
    stopListening();
    cmd.classList.remove('is-on');
    SFX.play('close');
    setTimeout(() => { if (!cmdOpen) cmd.hidden = true; }, 320);
  }
  $('#cmdClose').addEventListener('click', closeConsole);
  cmd.addEventListener('pointerdown', e => { if (e.target === cmd) closeConsole(); });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); run(input.value); }
    else if (e.key.length === 1) SFX.play('key');
  });

  /* ---------- understanding ---------- */
  const ALIAS = {
    about: 'about', profile: 'about', user: 'about', me: 'about', ayushi: 'about',
    memory: 'memory', memories: 'memory', log: 'memory', timeline: 'memory', history: 'memory',
    skills: 'skills', skill: 'skills', modules: 'skills', tech: 'skills', stack: 'skills',
    projects: 'projects', project: 'projects', archive: 'projects', builds: 'projects', travels: 'projects', aaa: 'projects',
    experience: 'experience', work: 'experience', job: 'experience', dubbing: 'experience',
    communication: 'communication', comm: 'communication', hosting: 'communication',
    quest: 'quest', goal: 'quest', future: 'quest',
    achievements: 'achievements', achievement: 'achievements', badges: 'achievements',
    bugs: 'bugs', bug: 'bugs', flaws: 'bugs',
    inventory: 'inventory', items: 'inventory',
    save: 'save', contact: 'save', savepoint: 'save'
  };
  const go = id => ({ close: true, action: () => AOS.openApp(id) });
  const INTENTS = [
    [/sudo\s+hire/, () => ({ text: 'Permission granted. Opening the save point.', ...go('save') })],
    [/(jarvis|stark|iron\s?man)/, () => ({ text: 'Flattering, but I am not Stark\'s assistant. I am hers. Fewer suits, better documentation.' })],
    [/(who|what) are you|your name|are you (an? )?(ai|bot|human|real)/, () => ({ text: 'I am AYA, the assistant process inside AYUSHI.OS. I only know what is documented here, and I am not Ayushi.' })],
    [/^(thanks|thank you|cheers)/, () => ({ text: 'Any time.' })],
    [/^(hi|hello|hey|yo)\b|good (morning|afternoon|evening)/, () => ({ text: 'Hello. Ask me about Ayushi, or say start the tour.' })],
    [/coffee|\btea\b/, () => ({ text: 'Beverages are not documented. Open tabs are.' })],
    [/\b42\b|meaning of life/, () => ({ text: 'Unknown. future.exe is still loading.' })],
    [/\bhelp\b|commands|what can (you|i)/, () => ({ text: 'Try: who is Ayushi, what does she know, show projects, tell me about her experience, where is she headed, how do I contact her, start the tour. System: sound off, voice off, ambient off, close all, clear.' })],
    [/(sound|audio)\s*off|\bmute\b|be quiet|silence/, () => ({ text: 'Muting.', action: () => SFX.setSound(false) })],
    [/(sound|audio)\s*on|unmute/, () => ({ text: 'Sound restored.', action: () => { SFX.setSound(true); SFX.setAmbient(true); } })],
    [/voice\s*off|stop talking|stop speaking/, () => ({ text: 'Voice off. I will keep typing.', voice: false, action: () => SFX.setVoice(false) })],
    [/voice\s*on|talk to me/, () => ({ text: 'Voice on.', action: () => { SFX.setSound(true); SFX.setVoice(true); } })],
    [/(ambient|music|hum)\s*off/, () => ({ text: 'Ambient off.', action: () => SFX.setAmbient(false) })],
    [/(ambient|music|hum)\s*on/, () => ({ text: 'Ambient on.', action: () => { SFX.setSound(true); SFX.setAmbient(true); } })],
    [/close all|clean|clear (the )?desktop/, () => ({ text: 'Desktop cleared.', action: () => AOS.closeAll() })],
    [/^clear$|clear (the )?(log|console|screen)/, () => ({ text: 'Console cleared.', action: () => { log.innerHTML = ''; } })],
    [/reboot|restart/, () => ({ text: 'Rebooting.', action: () => setTimeout(() => location.reload(), 700) })],
    [/tour|guide me|show me around|walk ?through|demo|begin|^start$/, () => ({ text: 'Starting the guided tour.', action: startTour })],
    [/^(open|show|launch|go to|take me to)\s+(.+)/, (m) => {
      const words = m[2].replace(/[^a-z ]/g, ' ').split(/\s+/);
      const id = words.map(w => ALIAS[w]).find(Boolean);
      return id ? { text: `Opening ${AOS.BY_ID[id].file}.`, ...go(id) } : { text: 'I cannot find that file. Try about, memory, skills, projects, experience, quest or contact.' };
    }],
    [/(cyber|security|cloud|open source|opensource)/, () => ({ text: 'Cybersecurity and system security are what she is exploring now. Exploring, not mastered, and the map says so. Cloud is locked, open source is next.', ...go('quest') })],
    [/(quest|goal|future|plan|direction|headed|going|next step|learning|exploring)/, () => ({ text: 'Current quest: rebuild technical depth. Technology is active, cybersecurity and system security are being explored, cloud is locked and open source is next.', ...go('quest') })],
    [/(contact|hire|email|reach|linkedin|github|connect|collaborat|available|opportunit|work with)/, () => ({ text: 'The save point has her email, GitHub and LinkedIn. I cannot speak for her calendar, but that is the place to start.', ...go('save') })],
    [/(host|anchor|speak|communicat|script|team|event|ieee|coordinat|lead)/, () => ({ text: 'Event hosting, anchoring, script writing and team coordination, including IEEE and college activities. She turns ideas into explanations and chaos into plans.', ...go('communication') })],
    [/(experience|dubbing|netflix|crunchyroll|nbc|universal|manager|professional|career|job|work)/, () => ({ text: 'She worked as a dubbing project manager on multilingual productions, including projects for Netflix, Crunchyroll and NBCUniversal. Opening the archived instance.', ...go('experience') })],
    [/(project|build|built|make|made|create|portfolio|travel|aaa|booking|django app)/, () => ({ text: 'Her main archived build is AAA Travels: a full-stack travel booking app with Django, SQL and JavaScript. There is a seat-selection simulation inside.', ...go('projects') })],
    [/(skill|tech|stack|know|language|python|java|sql|django|javascript|module|tool|code|coding)/, () => ({ text: 'Installed modules include Python, Java, JavaScript, SQL, PL/SQL, HTML, CSS, jQuery, Node.js, Django and MySQL, with Git, APIs and database work in regular use.', ...go('skills') })],
    [/(memory|memories|timeline|history|story|past|journey|background|education|study|degree|bca|mca)/, () => ({ text: 'Here is her history as a system log: BCA in 2022, professional mode in 2025, reconfiguration in 2026. The last entry is still loading.', ...go('memory') })],
    [/(bug|weakness|flaw|fault|imperfect|overthink|perfection)/, () => ({ text: 'She documented her own bugs: too many ideas, occasional perfectionism, overthinking and tabs that multiply. All self-reported.', ...go('bugs') })],
    [/(achiev|award|badge|unlock|proud)/, () => ({ text: 'Six unlocked so far, and one redacted.', ...go('achievements') })],
    [/(inventor|items|laptop|microphone|headphones)/, () => ({ text: 'Her inventory: ten items, each linked to part of the system.', ...go('inventory') })],
    [/(who|tell me about|introduce|about (her|ayushi)|profile|describe)/, () => ({ text: 'Ayushi Pal is a technologist in mid-reconfiguration. Trained in computer applications, now on an MCA. Builder, communicator, coordinator.', ...go('about') })]
  ];
  function interpret(q) {
    for (const [re, fn] of INTENTS) { const m = q.match(re); if (m) return fn(m); }
    return { text: 'That is not indexed yet. Try: who is Ayushi, skills, projects, experience, contact, or start the tour.' };
  }
  function run(raw) {
    const q = String(raw || '').trim();
    if (!q) return;
    input.value = '';
    addLine('YOU', q);
    const r = interpret(q.toLowerCase());
    reply(r.text, r.voice !== false);
    if (r.action) setTimeout(r.action, 450);
    if (r.close) setTimeout(() => { closeConsole(); say(r.text, { voice: false, hold: 3600 }); }, 1500);
  }

  /* ---------- voice input ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let rec = null, listening = false;
  function stopListening() {
    if (!listening) return;
    listening = false;
    try { rec.stop(); } catch (e) { /* ignore */ }
    cmd.classList.remove('is-listening');
    input.placeholder = 'ask anything, or type help';
    SFX.play('listenEnd');
  }
  function startListening() {
    if (!SR) return;
    SFX.stopSpeaking();
    rec = new SR(); rec.lang = 'en-US'; rec.interimResults = true; rec.maxAlternatives = 1;
    rec.onresult = e => {
      let t = ''; for (const r of e.results) t += r[0].transcript;
      input.value = t;
      if (e.results[e.results.length - 1].isFinal) { stopListening(); run(t); }
    };
    rec.onerror = e => { stopListening(); if (e.error === 'not-allowed') reply('Microphone access is blocked. You can still type.', false); };
    rec.onend = () => { if (listening) stopListening(); };
    try { rec.start(); } catch (e) { return; }
    listening = true; cmd.classList.add('is-listening'); input.placeholder = 'listening...'; SFX.play('listen');
  }
  if (!SR) micBtn.hidden = true;
  else micBtn.addEventListener('click', () => (listening ? stopListening() : startListening()));

  /* ---------- keyboard ---------- */
  document.addEventListener('keydown', e => {
    if (!document.body.classList.contains('is-live')) return;
    const typing = /^(input|textarea)$/i.test(e.target.tagName);
    if (e.key === 'Escape') {
      if (cmdOpen) { e.preventDefault(); e.stopPropagation(); closeConsole(); return; }
      if (tour) stopTour();
    }
    if ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault(); cmdOpen ? closeConsole() : openConsole();
    }
  }, true);
})();
