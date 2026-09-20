/* =====================================================================
   AYUSHI.OS — audio.js
   Every sound is synthesized live with the Web Audio API (no audio files),
   plus optional spoken lines through the browser's speech synthesis.
   Exposes window.SFX. Nothing plays until the visitor powers on.
   ===================================================================== */
(() => {
  'use strict';

  let ctx = null, master, dry, wet, analyser, freqData, noiseBuf, amb = null;
  const st = { sound: false, voice: false, ambient: false, speaking: false };
  const changeFns = [];
  const emit = () => changeFns.forEach(fn => fn({ ...st }));

  /* ---------- context ---------- */
  function impulse(sec, decay) {
    const len = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return b;
  }
  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = .6;
    const comp = ctx.createDynamicsCompressor();
    dry = ctx.createGain();
    wet = ctx.createGain(); wet.gain.value = .4;
    const conv = ctx.createConvolver(); conv.buffer = impulse(1.9, 2.6);
    dry.connect(master); wet.connect(conv); conv.connect(master);
    master.connect(comp); comp.connect(ctx.destination);
    analyser = ctx.createAnalyser(); analyser.fftSize = 128; analyser.smoothingTimeConstant = .82;
    master.connect(analyser);
    freqData = new Uint8Array(analyser.frequencyBinCount);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    return ctx;
  }

  /* ---------- primitives ---------- */
  function tone({ f = 440, f2 = null, type = 'sine', dur = .15, vol = .08, delay = 0, attack = .005, send = .4 }) {
    if (!st.sound || !ctx) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(dry);
    const s = ctx.createGain(); s.gain.value = send; g.connect(s); s.connect(wet);
    o.start(t); o.stop(t + dur + .05);
  }
  function noise({ dur = .3, type = 'bandpass', f = 1500, f2 = null, q = 1, vol = .06, delay = 0, send = .3 }) {
    if (!st.sound || !ctx) return;
    const t = ctx.currentTime + delay;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.Q.value = q;
    fl.frequency.setValueAtTime(f, t);
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + dur * .25);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(fl); fl.connect(g); g.connect(dry);
    const sd = ctx.createGain(); sd.gain.value = send; g.connect(sd); sd.connect(wet);
    s.start(t, Math.random()); s.stop(t + dur + .05);
  }

  /* ---------- the sound set ---------- */
  const LIB = {
    tick: () => tone({ f: 2400, dur: .03, vol: .02, send: .1 }),
    hover: () => tone({ f: 1800, f2: 2300, dur: .05, vol: .014, send: .2 }),
    click: () => tone({ f: 900, f2: 1500, type: 'triangle', dur: .07, vol: .045 }),
    key: () => tone({ f: 1500 + Math.random() * 900, dur: .02, vol: .014, send: .05 }),
    blip: () => tone({ f: 640 + Math.random() * 80, f2: 980, type: 'triangle', dur: .09, vol: .045 }),
    ok: () => { tone({ f: 1046, dur: .16, vol: .045 }); tone({ f: 1568, dur: .24, vol: .04, delay: .07, send: .6 }); },
    unknown: () => { noise({ dur: .3, f: 900, f2: 3200, q: 6, vol: .05 }); tone({ f: 220, f2: 110, type: 'sawtooth', dur: .3, vol: .025 }); },
    power: () => {
      tone({ f: 55, f2: 320, type: 'sawtooth', dur: 1.3, vol: .05, attack: .35, send: .5 });
      tone({ f: 130, f2: 1100, dur: 1.5, vol: .04, attack: .6, send: .9 });
      noise({ dur: 1.3, f: 200, f2: 4500, q: .8, vol: .045 });
    },
    enter: () => {
      [523, 659, 784, 1046].forEach((f, i) => tone({ f, dur: .9, vol: .04, delay: i * .06, send: .9, attack: .02 }));
      noise({ dur: .9, f: 300, f2: 6000, q: .6, vol: .06 });
      tone({ f: 70, f2: 40, dur: .9, vol: .07 });
    },
    open: () => {
      tone({ f: 520, f2: 780, type: 'triangle', dur: .14, vol: .045 });
      tone({ f: 1040, f2: 1560, dur: .2, vol: .028, delay: .06, send: .7 });
      noise({ dur: .2, f: 800, f2: 5200, q: .7, vol: .018 });
    },
    close: () => tone({ f: 780, f2: 400, type: 'triangle', dur: .14, vol: .04 }),
    min: () => tone({ f: 620, f2: 300, dur: .12, vol: .03 }),
    unlock: () => [523, 659, 784, 1046, 1318].forEach((f, i) => tone({ f, dur: .4, vol: .045, delay: i * .09, send: .8 })),
    listen: () => tone({ f: 700, f2: 1250, dur: .12, vol: .05 }),
    listenEnd: () => tone({ f: 1250, f2: 700, dur: .12, vol: .05 }),
    scan: () => tone({ f: 300, f2: 2400, dur: .7, vol: .025, send: .7 }),
    glitch: () => { noise({ dur: .12, f: 2500, q: 4, vol: .04 }); tone({ f: 90, type: 'square', dur: .08, vol: .015 }); },
    ping: () => { tone({ f: 880, f2: 1320, dur: .25, vol: .045, send: .8 }); tone({ f: 1760, dur: .5, vol: .018, delay: .05, send: .9 }); },
    reply: () => { tone({ f: 740, dur: .08, vol: .03 }); tone({ f: 988, dur: .12, vol: .03, delay: .06 }); }
  };
  function play(name) { const fn = LIB[name]; if (fn && st.sound && ctx) { try { fn(); } catch (e) { /* ignore */ } } }

  /* ---------- ambient pad ---------- */
  function startAmbient() {
    if (!ctx || amb) return;
    const g = ctx.createGain(); g.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; lp.Q.value = 2.5;
    const lfo = ctx.createOscillator(), lg = ctx.createGain();
    lfo.frequency.value = .07; lg.gain.value = 190; lfo.connect(lg); lg.connect(lp.frequency);
    const oscs = [[55, 'sine', 1], [82.4, 'triangle', .8], [110.3, 'sine', .8], [164.8, 'sine', .3], [329.6, 'sine', .08]].map(([f, t, a], i) => {
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = t; o.frequency.value = f; o.detune.value = (i - 2) * 7; og.gain.value = a;
      o.connect(og); og.connect(lp); o.start(); return o;
    });
    const send = ctx.createGain(); send.gain.value = .6;
    lp.connect(g); g.connect(dry); g.connect(send); send.connect(wet);
    lfo.start();
    g.gain.linearRampToValueAtTime(.055, ctx.currentTime + 3);
    amb = { g, nodes: [...oscs, lfo] };
  }
  function stopAmbient() {
    if (!amb) return;
    const { g, nodes } = amb; amb = null;
    g.gain.cancelScheduledValues(ctx.currentTime);
    g.gain.setValueAtTime(g.gain.value, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    setTimeout(() => nodes.forEach(n => { try { n.stop(); } catch (e) { /* ignore */ } }), 1200);
  }

  /* ---------- voice ---------- */
  const synth = 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voiceCache = null, current = null;
  function pickVoice() {
    if (!synth) return null;
    const vs = synth.getVoices();
    if (!vs.length) return null;
    if (voiceCache && vs.includes(voiceCache)) return voiceCache;
    const en = vs.filter(v => /^en/i.test(v.lang));
    const prefs = [/Google UK English Male/i, /Daniel/i, /Arthur/i, /Microsoft (George|Ryan|Mark)/i, /Male/i];
    for (const re of prefs) { const v = en.find(x => re.test(x.name)); if (v) { voiceCache = v; return v; } }
    voiceCache = en.find(v => /en-GB/i.test(v.lang)) || en[0] || null;
    return voiceCache;
  }
  if (synth) synth.addEventListener && synth.addEventListener('voiceschanged', () => { voiceCache = null; });

  const estimate = text => Math.max(1800, text.length * 62);
  /** speak(text, {onend}) — onend always fires once (even if voice is off, after an estimate). */
  function speak(text, opts = {}) {
    let fired = false;
    const done = () => { if (fired) return; fired = true; st.speaking = false; if (opts.onend) opts.onend(); };
    if (!st.voice || !synth) { setTimeout(done, estimate(text)); return () => { fired = true; }; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    u.rate = 1.02; u.pitch = .9;
    u.onstart = () => { st.speaking = true; };
    u.onend = done; u.onerror = done;
    current = u; // keep a reference so it is not garbage-collected mid-speech
    synth.speak(u);
    setTimeout(done, estimate(text) + 4500); // safety net if the browser never fires onend
    return () => { fired = true; };
  }
  function stopSpeaking() { if (synth) synth.cancel(); st.speaking = false; }

  /* ---------- public API ---------- */
  function setSound(on) {
    st.sound = !!on;
    if (on) { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); if (st.ambient) startAmbient(); }
    else { stopAmbient(); stopSpeaking(); }
    emit();
  }
  function setVoice(on) { st.voice = !!on; if (!on) stopSpeaking(); emit(); }
  function setAmbient(on) {
    st.ambient = !!on;
    if (st.sound && ctx) { on ? startAmbient() : stopAmbient(); }
    emit();
  }
  let synthLevel = 0;
  function level() {
    let v = 0;
    if (ctx && st.sound && analyser) {
      analyser.getByteFrequencyData(freqData);
      let s = 0; for (let i = 0; i < 24; i++) s += freqData[i];
      v = Math.min(1, (s / 24 / 255) * 2.2);
    }
    if (st.speaking) {
      const target = .35 + Math.random() * .5;
      synthLevel += (target - synthLevel) * .35;
      v = Math.max(v, synthLevel);
    } else synthLevel *= .8;
    return v;
  }
  function freq() {
    if (ctx && st.sound && analyser) { analyser.getByteFrequencyData(freqData); return freqData; }
    return null;
  }

  window.SFX = {
    init, play, speak, stopSpeaking, setSound, setVoice, setAmbient, level, freq,
    get state() { return { ...st }; },
    onChange(fn) { changeFns.push(fn); },
    supportsVoice: !!synth
  };
})();
