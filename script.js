/* =====================================================================
   AYUSHI.OS — script.js
   1. config   2. helpers + icons   3. app content   4. window manager
   5. desktop  6. boot
   ===================================================================== */
(() => {
  'use strict';

  /* ---------------------------------------------------------------
     1. CONFIG — fill these in before deploying.
     Anything left empty shows a friendly "not configured" toast
     instead of a dead link.
     --------------------------------------------------------------- */
  const CONFIG = {
    email: 'yaship790@gmail.com',      // e.g. 'ayushi@example.com'
    github: 'https://github.com/AlooshianThings',     // e.g. 'https://github.com/your-username'
    linkedin: 'https://www.linkedin.com/in/alooshian-things/',   // e.g. 'https://www.linkedin.com/in/your-handle'
    // Optional project links, keyed by the project `id` in PROJECTS. Empty = button hidden.
    live: { aaa: 'https://aaa-travels.onrender.com', streakster: 'https://streakster-theta.vercel.app/', news: 'https://aaa-news-omega.vercel.app/', aloosh: 'https://aaa-news.vercel.app/' },   // e.g. 'https://streakster.vercel.app'
    repos: { aaa: 'https://github.com/AlooshianThings/AAA-Travels.git', streakster: 'https://github.com/AlooshianThings/Streakster.git', news: 'https://github.com/AlooshianThings/AAA-News.git', aloosh: 'https://github.com/AlooshianThings/Alooshstick.git' }   // e.g. 'https://github.com/you/streakster'
  };

  /* ---------------------------------------------------------------
     2. HELPERS + ICONS
     --------------------------------------------------------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const mqMobile = window.matchMedia('(max-width: 820px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => mqMobile.matches;
  const sfx = n => { if (window.SFX) window.SFX.play(n); };

  const ICONS = {
    about: '<circle cx="12" cy="8" r="3.5"/><path d="M4.5 20c.8-4 3.7-6 7.5-6s6.7 2 7.5 6"/>',
    memory: '<rect x="4" y="3.5" width="16" height="17" rx="2.5"/><path d="M8 8h8M8 12h8M8 16h4"/>',
    skills: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/><rect x="10" y="10" width="4" height="4" rx=".8"/>',
    projects: '<path d="M4 8h16v11a1.5 1.5 0 0 1-1.500 1.500h-13A1.500 1.500 0 0 1 4 19z"/><path d="M3 4.500h18V8H3z"/><path d="M10 12.500h4"/>',
    experience: '<path d="M12 3.500 3.500 8 12 12.500 20.500 8z"/><path d="M3.500 12 12 16.500 20.500 12"/><path d="M3.500 16 12 20.500 20.500 16"/>',
    communication: '<path d="M3 12h2M7 8v8M11 5v14M15 8.500v7M19 10.500v3M21.500 12H21"/>',
    quest: '<path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3z"/>',
    achievements: '<path d="M12 3l7.500 4.300v8.400L12 20l-7.500-4.300V7.300z"/><path d="M12 8.500l1.200 2.400 2.600.4-1.900 1.800.5 2.600-2.400-1.300-2.400 1.300.5-2.600-1.900-1.800 2.600-.4z"/>',
    bugs: '<ellipse cx="12" cy="13.500" rx="4.500" ry="6"/><path d="M12 7.500V20M7.500 13.500h-3M19.500 13.500h-3M8.300 9.500 5.500 7.500M15.700 9.500l2.800-2M8.300 18l-2.800 2M15.700 18l2.800 2M9.500 7.500a2.500 2.500 0 0 1 5 0"/>',
    inventory: '<rect x="4" y="4" width="7" height="7" rx="1.500"/><rect x="13" y="4" width="7" height="7" rx="1.500"/><rect x="4" y="13" width="7" height="7" rx="1.500"/><rect x="13" y="13" width="7" height="7" rx="1.500" stroke-dasharray="2 2"/>',
    save: '<path d="M12 2.500l6 6-6 13-6-13z"/><path d="M6 8.500h12M12 2.500v19"/>',
    /* inventory objects */
    laptop: '<rect x="5" y="5" width="14" height="10" rx="1.500"/><path d="M3 19h18l-1.500-4h-15z"/>',
    phone: '<rect x="7.500" y="3" width="9" height="18" rx="2"/><path d="M11 18h2"/>',
    notebook: '<rect x="6" y="3" width="13" height="18" rx="1.500"/><path d="M3.500 7h4M3.500 12h4M3.500 17h4M10.500 8h6M10.500 12h6"/>',
    code: '<path d="M9 7l-5 5 5 5M15 7l5 5-5 5M13.500 5l-3 14"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.500 11a6.500 6.500 0 0 0 13 0M12 17.500V21M9 21h6"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.500" height="6.500" rx="1.500"/><rect x="16.500" y="14" width="4.500" height="6.500" rx="1.500"/>',
    branches: '<circle cx="6.500" cy="5.500" r="2"/><circle cx="6.500" cy="18.500" r="2"/><circle cx="17.500" cy="9" r="2"/><path d="M6.500 7.500v9M17.500 11c0 3.500-3.500 4-9.200 6.400"/>',
    idcard: '<rect x="3.500" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M5.800 16c.6-1.800 1.800-2.500 3.200-2.500s2.600.7 3.200 2.500M14.500 9.500h4M14.500 13h3"/>',
    folder: '<path d="M3.500 7.500V18a1.500 1.500 0 0 0 1.500 1.500h14a1.500 1.500 0 0 0 1.500-1.500V9.500A1.500 1.500 0 0 0 19 8h-7l-2-2.500H5A1.500 1.500 0 0 0 3.500 7z"/>',
    bulb: '<path d="M9 17.500h6M10 20.500h4M12 3.500a6 6 0 0 0-3.500 10.900c.6.500 1 1.200 1 2v.1h5v-.1c0-.8.4-1.500 1-2A6 6 0 0 0 12 3.500z"/>',
    lock: '<rect x="5.500" y="10.500" width="13" height="9" rx="2"/><path d="M8.500 10.500V8a3.500 3.500 0 0 1 7 0v2.500"/>'
  };
  const svg = (name, cls = '') =>
    `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

  const pad = n => String(n).padStart(2, '0');
  const fmtUptime = s => `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-on'), 3200);
  }

  /* ---------------------------------------------------------------
     3. APP CONTENT
     Each app: meta + render() (html string) + optional mount(root, win)
     --------------------------------------------------------------- */

  /* ---- ABOUT ---- */
  const aboutHTML = () => `
  <div class="about">
    <aside class="plate">
      <div class="sigil" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs><linearGradient id="sg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#F5D5E6"/><stop offset=".5" stop-color="#D2E5F7"/><stop offset="1" stop-color="#CDBFEF"/>
          </linearGradient></defs>
          <path d="M60 6l46 26v56L60 114 14 88V32z" fill="url(#sg)" stroke="#6B5A9B" stroke-width="1.2"/>
          <path d="M60 22l32 18v40L60 98 28 80V40z" fill="none" stroke="#fff" stroke-opacity=".85"/>
          <text x="60" y="68" text-anchor="middle" font-family="DM Mono, monospace" font-size="26" fill="#3A2E66" letter-spacing="2">AP</text>
        </svg>
      </div>
      <p class="lbl">USER 001 // LOGGED IN</p>
      <p class="verify" id="verify"><i class="led"></i><span>SCANNING IDENTITY...</span></p>
      <dl class="dl-rows">
        <div><dt>NAME</dt><dd>Ayushi Pal</dd></div>
        <div><dt>ORIGIN</dt><dd>BCA / Computer Applications</dd></div>
        <div><dt>CURRENT CHAPTER</dt><dd>MCA / Technology</dd></div>
        <div><dt>PRIMARY CLASS</dt><dd>Technologist</dd></div>
        <div><dt>SUBCLASSES</dt><dd class="tags"><span class="tag">Builder</span><span class="tag">Communicator</span><span class="tag">Coordinator</span></dd></div>
        <div><dt>CURRENT STATUS</dt><dd class="serif">Still becoming.</dd></div>
      </dl>
    </aside>

    <article class="doc">
      <p class="lbl">USER PROFILE // SYSTEM DOCUMENTATION</p>
      <h2 class="doc__lead">Ayushi is a technologist currently undergoing a system reconfiguration.</h2>
      <p>Originally trained in computer applications, she has moved between code, creative work, communication, project coordination and real-world production environments. The route was not a straight line. The system seems to prefer it that way.</p>
      <p>It began with building: languages, databases, a full-stack travel platform. Then came a detour through the human side of production, hosting events, writing scripts and coordinating multilingual dubbing projects for global streaming and studio releases, where a missed handoff means a missed date.</p>
      <p>The detour did not replace the technical core. It added a second layer: a user who can explain the machine to people, and coordinate people around the machine.</p>
      <p>Current priority is a rebuild of technical depth, with cybersecurity and system security as the direction of travel.</p>
      <div>
        <p class="lbl" style="margin-bottom:10px">CURRENT SYSTEM PRIORITY</p>
        <ol class="chain" aria-label="Build, then learn, then explore, then rebuild">
          <li>BUILD</li><li>LEARN</li><li>EXPLORE</li><li class="is-now">REBUILD</li>
        </ol>
      </div>
      <p class="doc__foot">Documentation status: in progress. The subject is still being written.</p>
    </article>
  </div>`;

  const aboutMount = (root, w) => {
    const lead = $('.doc__lead', root), full = lead.textContent, v = $('#verify', root);
    lead.setAttribute('aria-label', full);
    const timers = [];
    sfx('scan');
    timers.push(setTimeout(() => { v.classList.add('is-ok'); $('span', v).textContent = 'IDENTITY VERIFIED'; sfx('ok'); }, reduceMotion ? 0 : 1100));
    if (!reduceMotion) {
      lead.textContent = ''; lead.classList.add('is-typing');
      let i = 0;
      const iv = setInterval(() => {
        i += 2; lead.textContent = full.slice(0, i);
        if (i % 8 === 0) sfx('key');
        if (i >= full.length) { clearInterval(iv); lead.classList.remove('is-typing'); }
      }, 26);
      w.cleanup.push(() => clearInterval(iv));
    }
    w.cleanup.push(() => timers.forEach(clearTimeout));
  };

  /* ---- MEMORY ---- */
  const memoryHTML = () => `
  <p class="lbl" style="margin-bottom:22px">/var/log/ayushi.os — read only</p>
  <ol class="log">
    <li style="--k:0" class="entry"><time>2022</time><div><span class="lvl">INIT</span><h3>System initialized</h3><p>BCA begins. First lines of code, first errors, first fixes.</p></div></li>
    <li style="--k:1" class="entry"><time>2023 to 2024</time><div><span class="lvl">LOAD</span><h3>Skills, projects, college activities</h3><p>Languages and frameworks installed. Projects compiled. Hosting, anchoring and script writing run in parallel with IEEE and college activities.</p></div></li>
    <li style="--k:2" class="entry"><time>2025</time><div><span class="lvl">MODE</span><h3>Professional mode activated</h3><p>Dubbing project management. Real deadlines, real releases, several languages at once.</p></div></li>
    <li style="--k:3" class="entry"><time>2026</time><div><span class="lvl">RECONFIG</span><h3>System reconfiguration</h3><p>Technology becomes the primary direction. Current chapter: MCA.</p></div></li>
    <li style="--k:4" class="entry entry--now"><time>NOW</time><div><span class="lvl lvl--pend">PENDING</span><h3>Cybersecurity module: loading...</h3><p>No ETA. Installation is happening in real time.</p><div class="loadbar" role="progressbar" aria-label="Cybersecurity module loading, no known completion time"></div></div></li>
  </ol>
  <p class="log__tail">&gt; awaiting next entry<span class="cursor" aria-hidden="true"></span></p>`;

  const memoryMount = (root, w) => {
    const ts = $$('.entry', root).map((_, i) => setTimeout(() => sfx('tick'), 300 + i * 240));
    w.cleanup.push(() => ts.forEach(clearTimeout));
  };

  /* ---- SKILLS ---- */
  const SKILLS = [
    { key: 'installed', title: 'INSTALLED', blurb: 'Established modules. They load without asking.',
      items: [['Python', 'language'], ['Java', 'language'], ['JavaScript', 'language'], ['SQL', 'query language'], ['PL/SQL', 'procedural SQL'], ['HTML', 'markup'], ['CSS', 'styling'], ['jQuery', 'library'], ['Node.js', 'runtime'], ['Django', 'framework'], ['MySQL', 'database']] },
    { key: 'active', title: 'ACTIVE', blurb: 'Running alongside everything else.',
      items: [['Git / GitHub', 'version control'], ['APIs', 'integration'], ['Web development', 'practice'], ['Database work', 'practice']] },
    { key: 'exploring', title: 'EXPLORING', blurb: 'Installing in real time. Behaviour may be inconsistent.',
      items: [['Cybersecurity', 'domain'], ['System Security', 'domain']] },
    { key: 'next', title: 'NEXT MODULES', blurb: 'Queued. Not loaded yet.',
      items: [['Cloud', 'locked / discovering'], ['Open Source', 'queued']] }
  ];
  const skillsHTML = () => `
  <p class="skills__intro">Modules are installed or they are not. There are no percentage bars here, because nobody learns in percentages.</p>
  <div class="legend" aria-hidden="true">
    <span><i class="led"></i> installed</span>
    <span><i class="led" style="background:var(--deep)"></i> active</span>
    <span><i class="led" style="background:transparent;border:1.5px solid var(--plum);box-shadow:none"></i> exploring</span>
    <span><i class="led" style="background:transparent;border:1.5px dashed var(--plum);box-shadow:none"></i> queued</span>
  </div>
  <div class="const" aria-hidden="true">
    <canvas></canvas>
    <span class="const__hint">DRAG TO ROTATE</span>
    <div class="const__key"><span>installed <i class="led"></i></span><span>active <i class="led" style="background:var(--deep)"></i></span><span>exploring <i class="led" style="background:transparent;border:1.5px solid var(--plum);box-shadow:none"></i></span><span>queued <i class="led" style="background:transparent;border:1.5px dashed var(--plum);box-shadow:none"></i></span></div>
  </div>
  ${SKILLS.map(g => `
    <section class="bay bay--${g.key}" aria-label="${g.title}">
      <div class="bay__h"><h3>${g.title}</h3><p>${g.blurb}</p></div>
      <ul class="mods">
        ${g.items.map(([n, t]) => `<li><button type="button" class="mod mod--${g.key === 'installed' ? 'installed' : g.key}${n === 'Cloud' ? ' is-locked' : ''}" data-mod="${n}" data-type="${t}" data-state="${g.key}"><i class="led"></i>${n}</button></li>`).join('')}
      </ul>
    </section>`).join('')}
  <p class="modinfo" id="modInfo" aria-live="off">Select a module to read its header.</p>`;
  const skillsMount = (root, w) => {
    const info = $('#modInfo', root);
    const STATE = { installed: 'installed', active: 'active', exploring: 'exploring', next: 'queued' };
    const describe = (name, type, state) => `MODULE: ${name.toLowerCase()}   TYPE: ${type}   STATE: ${STATE[state]}`;
    const show = e => {
      const b = e.target.closest('.mod');
      if (b) info.textContent = describe(b.dataset.mod, b.dataset.type, b.dataset.state);
    };
    root.addEventListener('pointerover', show);
    root.addEventListener('focusin', show);
    root.addEventListener('click', show);
    if (window.FX && FX.constellation) {
      const items = [];
      SKILLS.forEach(g => g.items.forEach(([name, type]) => items.push({ name, type, state: g.key })));
      const c = FX.constellation($('.const canvas', root), items, {
        onHover: it => { if (it) info.textContent = describe(it.name, it.type, it.state); }
      });
      w.cleanup.push(() => c.destroy());
    }
  };

  /* ---- PROJECTS ----
     Data-driven. To add a build, push ONE object onto PROJECTS below and (optionally)
     name a simulation in `sim`. Simulations live in SIMS further down; a build with
     `sim: null` simply shows no SIMULATE tab. The list, labels (ARCHIVE_00N), the
     "empty slot" and the window footer count all update automatically.

     Links: fill CONFIG.repos / CONFIG.live at the top of this file, keyed by `id`. */
  const PROJECTS = [
    {
      id: 'aaa', name: 'AAA_TRAVELS', tag: 'BUILD ARCHIVED',
      status: 'COMPLETED / BUILD ARCHIVED', type: 'FULL-STACK WEB APPLICATION',
      stack: ['Python', 'Django', 'SQL', 'JavaScript', 'HTML', 'CSS'],
      lead: 'A travel-booking web application. Pick a bus, a train or a hotel package, choose a seat, enter passenger details, pay, and leave with a confirmed booking ID.',
      layers: [
        ['FLOWS', 'Bus booking, train booking, hotel / package flow, payment flow, booking confirmation, booking IDs.'],
        ['FRONT END', 'Seat selection, passenger information with dynamic passenger forms. Built in HTML, CSS and JavaScript.'],
        ['BACK END', 'Django backend with APIs connecting the flows.'],
        ['DATA', 'SQL and database work behind bookings and passengers.']
      ],
      sim: 'seats'
    },
    {
      id: 'streakster', name: 'STREAKSTER', tag: 'DEPLOYED',
      status: 'DEPLOYED / LIVE', type: 'WEB APPLICATION / HABIT TRACKER',
      stack: ['JavaScript', 'HTML', 'CSS'],
      lead: 'Simple habit building, powered by streaks. Pick a habit, check in each day, and let the streak do the motivating.',
      layers: [
        ['CORE LOOP', 'Add a habit, check in daily, watch the streak grow. Miss a day and the streak starts over.'],
        ['FRONT END', 'A deliberately simple interface: the habit, the streak count, one button.'],
        ['DEPLOYMENT', 'Deployed and live on the web.']
      ],
      sim: 'streak'
    },
    {
      id: 'news', name: 'AAA_NEWS', tag: 'DEPLOYED',
      status: 'DEPLOYED / LIVE', type: 'WEBSITE / COLLEGE NEWS',
      stack: ['JavaScript', 'HTML', 'CSS'],
      lead: 'The news website of her college. A place to find what is happening on campus and read it properly.',
      layers: [
        ['FLOWS', 'Browse the latest stories, search, open an article and read.'],
        ['FRONT END', 'A readable, responsive layout built for a real audience: students.'],
        ['DEPLOYMENT', 'Deployed and live on the web.']
      ],
      sim: 'news'
    }
    ,
    {
      id: 'aloosh', name: 'ALOOSHSTICK', tag: 'FIRST BUILD',
      status: 'DEPLOYED / FIRST BUILD', type: 'WEBSITE / BASIC SHOPPING SITE',
      stack: ['HTML', 'CSS'],
      lead: 'Her very first website, and the most basic of them all: a simple lipstick shopping site. Every system has a first line of code. This is the boot sector.',
      layers: [
        ['ORIGIN', 'The first build. Where the habit of making things and putting them online began.'],
        ['FLOWS', 'Browse the lipsticks, add what you like to the cart, review the cart.'],
        ['FRONT END', 'Page structure and styling. Simple on purpose, because simple is where it started.'],
        ['DEPLOYMENT', 'Deployed and live on the web.']
      ],
      sim: 'shop'
    }
    /* next build: copy one object above, change id / name / text, set sim: null or a key from SIMS. */
  ];

  const arcLabel = i => 'ARCHIVE_' + String(i + 1).padStart(3, '0');
  const projectsHTML = () => `
  <div class="arch">
    <div class="arch__list" role="group" aria-label="Archived builds">
      ${PROJECTS.map((p, i) => `<button type="button" class="arch__item" data-arch="${p.id}" aria-pressed="${i === 0}"><span class="lbl">${arcLabel(i)}</span><b>${p.name}</b><small>${p.tag}</small></button>`).join('')}
      <button type="button" class="arch__item arch__item--empty" data-arch="__empty" aria-pressed="false"><span class="lbl">${arcLabel(PROJECTS.length)}</span><b>[ EMPTY SLOT ]</b><small>NEXT BUILD</small></button>
    </div>
    <div class="arch__view" id="archView"></div>
  </div>`;

  const archHead = (p, i) => `
    <p class="lbl">${arcLabel(i)}</p>
    <h2 class="h">${p.name}</h2>
    <div class="btabs" role="tablist" aria-label="Inspect build">
      <button class="btab" role="tab" data-tab="spec" aria-selected="true">SPEC</button>
      <button class="btab" role="tab" data-tab="modules" aria-selected="false">MODULES</button>
      ${p.sim ? '<button class="btab" role="tab" data-tab="sim" aria-selected="false">SIMULATE</button>' : ''}
    </div>
    <div id="archPanel" role="tabpanel"></div>`;

  const linkRow = p => {
    // accept links pasted without "https://" and make sure they open as absolute URLs
    const fix = u => (u && !/^https?:\/\//i.test(u.trim())) ? 'https://' + u.trim() : (u || '').trim();
    const live = fix(CONFIG.live && CONFIG.live[p.id]), repo = fix(CONFIG.repos && CONFIG.repos[p.id]);
    return `<div class="links-row">${live
      ? `<a class="link-btn" href="${live}" target="_blank" rel="noopener noreferrer">OPEN LIVE SITE</a>`
      : `<button type="button" class="link-btn is-unset" data-unset-live="${p.name}">OPEN LIVE SITE</button>`}${repo ? `<a class="link-btn" href="${repo}" target="_blank" rel="noopener noreferrer">OPEN REPOSITORY</a>` : ''}</div>`;
  };
  const specPanel = p => `
    <p class="arch__lead">${p.lead}</p>
    <dl class="dl-rows">
      <div><dt>STATUS</dt><dd>${p.status}</dd></div>
      <div><dt>TYPE</dt><dd>${p.type}</dd></div>
      <div><dt>TECH STACK</dt><dd class="tags">${p.stack.map(t => `<span class="tag">${t}</span>`).join('')}</dd></div>
    </dl>
    ${linkRow(p)}`;
  const modulesPanel = p => `<div class="layers">${p.layers.map(([k, v]) => `<div class="layer"><b>${k}</b><span>${v}</span></div>`).join('')}</div>`;

  /* ---------- simulations ---------- */
  const simNote = t => `<p class="note" style="margin-bottom:14px">SIMULATION. ${t} Nothing is stored or sent anywhere.</p>`;
  const setSteps = (steps, stage) => steps.forEach((li, i) => { li.classList.toggle('is-done', i < stage); li.classList.toggle('is-now', i === stage); });

  /* --- AAA Travels: seat map + dynamic passenger forms --- */
  const OCC = new Set(['1B', '2D', '3C', '4A', '4B', '6D']);
  const seatMarkup = () => {
    let rows = '';
    for (let r = 1; r <= 6; r++) {
      rows += `<div class="seatrow"><span class="rown">${r}</span>`;
      ['A', 'B', '', 'C', 'D'].forEach(c => {
        if (!c) { rows += '<span></span>'; return; }
        const id = r + c, occ = OCC.has(id);
        rows += `<button type="button" class="seat${occ ? ' is-occ' : ''}" data-seat="${id}" aria-pressed="false" aria-label="Seat ${id}${occ ? ', taken' : ''}"${occ ? ' disabled' : ''}>${c}</button>`;
      });
      rows += '</div>';
    }
    return rows;
  };
  const seatsSim = {
    html: () => `
    ${simNote('A behaviour model of the seat and passenger flow, not the live app.')}
    <ol class="steps" aria-label="Booking steps">
      <li class="is-now">SEAT</li><li>PASSENGERS</li><li>PAYMENT</li><li>CONFIRMED</li>
    </ol>
    <div class="sim__grid">
      <div class="bus" role="group" aria-label="Bus seat map">
        <p class="bus__front">FRONT</p>
        ${seatMarkup()}
      </div>
      <div>
        <p class="lbl" style="margin-bottom:10px">PASSENGER FORMS (ONE PER SEAT)</p>
        <div class="pax" aria-live="polite"><p class="pax__empty">Select a seat. A form appears for each one.</p></div>
        <div class="sim__actions">
          <button type="button" class="btn btn--solid" data-confirm disabled>PAY AND CONFIRM (SIMULATED)</button>
          <button type="button" class="btn" data-reset>RESET</button>
        </div>
        <output class="result" hidden></output>
      </div>
    </div>`,
    mount(root) {
      const grid = $('.bus', root), pax = $('.pax', root), out = $('.result', root);
      const steps = $$('.steps li', root), confirmBtn = $('[data-confirm]', root), resetBtn = $('[data-reset]', root);
      const emptyMsg = '<p class="pax__empty">Select a seat. A form appears for each one.</p>';
      let chosen = [], done = false;
      const paint = () => {
        setSteps(steps, done ? 4 : chosen.length ? 1 : 0);
        confirmBtn.disabled = done || !chosen.length;
        if (!chosen.length && !done) pax.innerHTML = emptyMsg;
      };
      grid.addEventListener('click', e => {
        const b = e.target.closest('.seat');
        if (!b || b.disabled || done) return;
        const id = b.dataset.seat, i = chosen.indexOf(id);
        sfx('click');
        if (i > -1) {
          chosen.splice(i, 1);
          b.classList.remove('is-sel'); b.setAttribute('aria-pressed', 'false');
          const row = pax.querySelector(`[data-for="${id}"]`); if (row) row.remove();
        } else {
          if (chosen.length >= 4) { toast('This model allows up to 4 seats per booking.'); return; }
          if (!chosen.length) pax.innerHTML = '';
          chosen.push(id);
          b.classList.add('is-sel'); b.setAttribute('aria-pressed', 'true');
          const row = document.createElement('label');
          row.className = 'paxrow'; row.dataset.for = id;
          row.innerHTML = `<span>SEAT ${id}</span><input type="text" placeholder="Passenger name" autocomplete="off" aria-label="Passenger name for seat ${id}">`;
          pax.appendChild(row);
        }
        paint();
      });
      confirmBtn.addEventListener('click', () => {
        if (!chosen.length) return;
        done = true; sfx('unlock');
        $$('input', pax).forEach(i => (i.disabled = true));
        const id = 'SIM-' + Math.random().toString(36).slice(2, 8).toUpperCase();
        out.hidden = false;
        out.textContent = `CONFIRMED. Sample booking ID: ${id}. Seats: ${chosen.join(', ')}. Nothing was booked; this is a model of the flow.`;
        paint();
      });
      resetBtn.addEventListener('click', () => {
        chosen = []; done = false; out.hidden = true;
        $$('.seat', grid).forEach(b => { b.classList.remove('is-sel'); if (!b.classList.contains('is-occ')) b.setAttribute('aria-pressed', 'false'); });
        pax.innerHTML = emptyMsg; paint();
      });
      paint();
    }
  };

  /* --- STREAKSTER: habits, daily check-in, streak, missed-day reset --- */
  const streakSim = {
    html: () => `
    ${simNote('A behaviour model of streak tracking (a missed day resets the streak), not the live app.')}
    <ol class="steps" aria-label="Streak steps">
      <li class="is-now">ADD HABIT</li><li>CHECK IN</li><li>STREAK GROWS</li><li>MISS A DAY</li>
    </ol>
    <div class="streak__add">
      <input type="text" class="streak__input" maxlength="36" placeholder="A new habit, e.g. read for 20 minutes" aria-label="New habit name">
      <button type="button" class="btn btn--solid" data-add>ADD HABIT</button>
    </div>
    <ul class="habits" aria-live="polite"></ul>
    <div class="sim__actions">
      <button type="button" class="btn" data-next>SIMULATE NEXT DAY</button>
      <button type="button" class="btn" data-reset>RESET</button>
    </div>
    <p class="note streak__day" style="margin-top:12px"></p>`,
    mount(root) {
      const list = $('.habits', root), input = $('.streak__input', root), dayEl = $('.streak__day', root);
      const steps = $$('.steps li', root);
      const SEED = 'Read for 20 minutes';
      let day, habits, everMissed;
      const fresh = () => { day = 1; everMissed = false; habits = [{ name: SEED, hist: [], today: false, streak: 0, best: 0 }]; };
      const paint = () => {
        list.innerHTML = '';
        habits.forEach((h, idx) => {
          const li = document.createElement('li'); li.className = 'habit';
          const main = document.createElement('div'); main.className = 'habit__main';
          const nm = document.createElement('b'); nm.textContent = h.name;
          const n = document.createElement('span'); n.className = 'habit__n'; n.textContent = h.streak;
          const meta = document.createElement('span'); meta.className = 'habit__meta'; meta.textContent = `day streak   BEST ${h.best}`;
          main.append(nm, n, meta);
          const strip = document.createElement('div'); strip.className = 'habit__strip'; strip.setAttribute('aria-hidden', 'true');
          const hist = h.hist.slice(-13);
          for (let k = 0; k < 13 - hist.length; k++) strip.appendChild(document.createElement('i'));
          hist.forEach(v => { const s = document.createElement('i'); s.className = v ? 'is-done' : 'is-miss'; strip.appendChild(s); });
          const t = document.createElement('i'); t.className = h.today ? 'is-done is-today' : 'is-today'; strip.appendChild(t);
          const chk = document.createElement('button'); chk.type = 'button'; chk.className = 'btn' + (h.today ? '' : ' btn--solid');
          chk.textContent = h.today ? 'CHECKED IN' : 'CHECK IN'; chk.disabled = h.today; chk.dataset.check = idx;
          const rm = document.createElement('button'); rm.type = 'button'; rm.className = 'habit__x'; rm.dataset.rm = idx; rm.setAttribute('aria-label', `Remove ${h.name}`); rm.innerHTML = '<i></i>';
          li.append(main, strip, chk, rm); list.appendChild(li);
        });
        if (!habits.length) list.innerHTML = '<li class="pax__empty">No habits yet. Add one above.</li>';
        const grown = habits.some(h => h.streak > 0);
        setSteps(steps, !habits.length ? 0 : everMissed ? 4 : grown ? 2 : 1);
        if (everMissed) steps[3].classList.add('is-now');
        dayEl.textContent = `SIMULATED DAY ${day}`;
      };
      $('[data-add]', root).addEventListener('click', add);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
      function add() {
        const v = input.value.trim(); if (!v) return;
        if (habits.length >= 4) { toast('This model holds up to 4 habits.'); return; }
        habits.push({ name: v, hist: [], today: false, streak: 0, best: 0 }); input.value = ''; sfx('ok'); paint();
      }
      list.addEventListener('click', e => {
        const c = e.target.closest('[data-check]'), r = e.target.closest('[data-rm]');
        if (c) {
          const h = habits[+c.dataset.check]; if (h.today) return;
          h.today = true; h.streak++; h.best = Math.max(h.best, h.streak); sfx('ok');
          if (h.streak === 7) { sfx('unlock'); toast(`7-day streak on "${h.name}". (Modeled milestone.)`); }
          paint();
        } else if (r) { habits.splice(+r.dataset.rm, 1); sfx('close'); paint(); }
      });
      $('[data-next]', root).addEventListener('click', () => {
        habits.forEach(h => {
          h.hist.push(h.today);
          if (!h.today) { if (h.streak > 0) everMissed = true; h.streak = 0; }
          h.today = false;
        });
        day++; sfx('tick'); paint();
      });
      $('[data-reset]', root).addEventListener('click', () => { fresh(); paint(); });
      fresh(); paint();
    }
  };

  /* --- AAA News: browse, search, read (SAMPLE stories, not real news) --- */
  const NEWS = [
    { t: 'Sample: Annual fest registrations are now open', k: 'EVENTS', b: 'Sample article text. This story is placeholder content used to show how reading works in the simulation.' },
    { t: 'Sample: Library extends hours during exam week', k: 'CAMPUS', b: 'Sample article text. In the real site, an article page like this would carry the full story, laid out for easy reading.' },
    { t: 'Sample: Coding club announces a beginner workshop', k: 'CLUBS', b: 'Sample article text. Placeholder content only: search for a keyword like workshop or library to see the list narrow.' },
    { t: 'Sample: Department seminar on emerging technology', k: 'ACADEMICS', b: 'Sample article text. Nothing here is real news; it exists so the browse, search and read flow can be tried.' },
    { t: 'Sample: Sports day results and highlights', k: 'SPORTS', b: 'Sample article text. Imagine highlights, scores and photos here. This is only a behaviour model of the reading experience.' }
  ];
  const newsSim = {
    html: () => `
    ${simNote('A behaviour model of browsing, searching and reading. The stories are SAMPLE placeholders, not real news.')}
    <ol class="steps" aria-label="Reading steps"><li class="is-now">BROWSE</li><li>SEARCH</li><li>READ</li></ol>
    <div class="news">
      <div class="news__side">
        <input type="search" class="news__q" placeholder="Search stories (try: workshop)" aria-label="Search sample stories">
        <ul class="news__list" aria-live="polite"></ul>
      </div>
      <article class="news__read" aria-live="polite"><p class="pax__empty">Select a headline to read it here.</p></article>
    </div>`,
    mount(root) {
      const q = $('.news__q', root), list = $('.news__list', root), read = $('.news__read', root), steps = $$('.steps li', root);
      let opened = -1;
      const paint = () => {
        const term = q.value.trim().toLowerCase();
        list.innerHTML = '';
        const hits = NEWS.map((s, i) => [s, i]).filter(([s]) => !term || (s.t + ' ' + s.b + ' ' + s.k).toLowerCase().includes(term));
        hits.forEach(([s, i]) => {
          const li = document.createElement('li'), b = document.createElement('button');
          b.type = 'button'; b.className = 'news__item'; b.dataset.i = i; b.setAttribute('aria-pressed', String(i === opened));
          const k = document.createElement('span'); k.className = 'lbl'; k.textContent = s.k;
          const t = document.createElement('b'); t.textContent = s.t;
          b.append(k, t); li.appendChild(b); list.appendChild(li);
        });
        if (!hits.length) list.innerHTML = '<li class="pax__empty">No sample stories match that search.</li>';
        setSteps(steps, opened > -1 ? 2 : term ? 1 : 0);
      };
      q.addEventListener('input', paint);
      list.addEventListener('click', e => {
        const b = e.target.closest('.news__item'); if (!b) return;
        opened = +b.dataset.i; sfx('click');
        const s = NEWS[opened];
        read.innerHTML = '';
        const k = document.createElement('p'); k.className = 'lbl'; k.textContent = s.k + ' / SAMPLE';
        const h = document.createElement('h3'); h.className = 'h'; h.textContent = s.t;
        const p = document.createElement('p'); p.className = 'news__body'; p.textContent = s.b;
        read.append(k, h, p); paint();
      });
      paint();
    }
  };
  /* --- ALOOSHSTICK: a basic shopping flow (browse, add to cart, cart total, order) --- */
  const LIPSTICKS = [['Rose', 249, '#C9607F'], ['Berry', 299, '#8E2F5B'], ['Coral', 199, '#E5745F'], ['Nude', 229, '#C99A86'], ['Plum', 329, '#5E2A55'], ['Red', 279, '#B3243A']];
  const tube = c => `<svg class="tube" viewBox="0 0 40 64" aria-hidden="true"><path d="M13 30V14c0-6 4-10 7-10s7 4 7 10v16z" fill="${c}"/><path d="M13 14c2 3 12 3 14 0" fill="none" stroke="rgba(255,255,255,.5)"/><rect x="10" y="30" width="20" height="8" rx="1.5" fill="#CDBFEF" stroke="#6B5A9B"/><rect x="8" y="38" width="24" height="22" rx="3" fill="#3A2E66"/></svg>`;
  const shopSim = {
    html: () => `
    ${simNote('A behaviour model of a basic shopping flow. The lipsticks and prices are SAMPLES, not the real products.')}
    <ol class="steps" aria-label="Shopping steps"><li class="is-now">BROWSE</li><li>ADD TO CART</li><li>CHECKOUT</li><li>ORDER PLACED</li></ol>
    <div class="shop">
      <ul class="shop__grid" aria-label="Sample lipsticks">
        ${LIPSTICKS.map(([n, pr, c]) => `<li class="prod">${tube(c)}<b>${n}</b><span class="prod__p">Rs ${pr}</span><button type="button" class="btn" data-add="${n}" aria-label="Add ${n} to cart">ADD</button></li>`).join('')}
      </ul>
      <aside class="cart" aria-label="Cart">
        <p class="lbl">CART</p>
        <ul class="cart__list" aria-live="polite"></ul>
        <p class="cart__total"><span>TOTAL</span><b>Rs 0</b></p>
        <div class="sim__actions">
          <button type="button" class="btn btn--solid" data-order disabled>PLACE ORDER</button>
          <button type="button" class="btn" data-clear>CLEAR</button>
        </div>
        <output class="result" hidden></output>
      </aside>
    </div>`,
    mount(root) {
      const list = $('.cart__list', root), totalEl = $('.cart__total b', root), out = $('.result', root);
      const orderBtn = $('[data-order]', root), steps = $$('.steps li', root);
      const price = Object.fromEntries(LIPSTICKS.map(([n, p]) => [n, p]));
      let cart = {}, ordered = false;
      const paint = () => {
        const names = Object.keys(cart);
        list.innerHTML = names.length ? '' : '<li class="pax__empty">Your cart is empty.</li>';
        let total = 0;
        names.forEach(n => {
          const q = cart[n], line = q * price[n]; total += line;
          const li = document.createElement('li'); li.className = 'cart__row';
          li.innerHTML = `<span>${n}</span><span class="cart__q"><button type="button" class="qbtn" data-dec="${n}" aria-label="Fewer ${n}"${ordered ? ' disabled' : ''}>-</button><b>${q}</b><button type="button" class="qbtn" data-inc="${n}" aria-label="More ${n}"${ordered ? ' disabled' : ''}>+</button></span><span>Rs ${line}</span>`;
          list.appendChild(li);
        });
        totalEl.textContent = 'Rs ' + total;
        orderBtn.disabled = ordered || !names.length;
        setSteps(steps, ordered ? 4 : names.length ? 2 : 0);
      };
      root.addEventListener('click', e => {
        if (ordered && !e.target.closest('[data-clear]')) return;
        const add = e.target.closest('[data-add]'), inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
        if (add || inc) { const n = (add || inc).dataset.add || inc.dataset.inc; cart[n] = (cart[n] || 0) + 1; sfx('click'); paint(); }
        else if (dec) { const n = dec.dataset.dec; if (--cart[n] <= 0) delete cart[n]; sfx('tick'); paint(); }
      });
      orderBtn.addEventListener('click', () => {
        if (!Object.keys(cart).length) return;
        ordered = true; sfx('unlock');
        out.hidden = false;
        out.textContent = `ORDER PLACED. Sample order ID: SIM-${Math.random().toString(36).slice(2, 8).toUpperCase()}. Nothing was ordered; this is a model of the flow.`;
        paint();
      });
      $('[data-clear]', root).addEventListener('click', () => { cart = {}; ordered = false; out.hidden = true; paint(); });
      paint();
    }
  };
  const SIMS = { seats: seatsSim, streak: streakSim, news: newsSim, shop: shopSim };

  function projectsMount(root) {
    const view = $('#archView', root);
    const items = $$('.arch__item', root);
    let tab = 'spec', cur = null;
    const drawPanel = () => {
      const panel = $('#archPanel', view);
      $$('.btab', view).forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
      if (tab === 'spec') panel.innerHTML = specPanel(cur);
      else if (tab === 'modules') panel.innerHTML = modulesPanel(cur);
      else { const sim = SIMS[cur.sim]; panel.innerHTML = sim.html(cur); sim.mount(panel, cur); }
    };
    const select = id => {
      items.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.arch === id)));
      const i = PROJECTS.findIndex(p => p.id === id);
      if (i > -1) { cur = PROJECTS[i]; tab = 'spec'; view.innerHTML = archHead(cur, i); drawPanel(); }
      else view.innerHTML = `
        <p class="lbl">${arcLabel(PROJECTS.length)}</p>
        <div class="emptyslot"><svg class="ico" style="font-size:34px;color:var(--plum)" viewBox="0 0 24 24" aria-hidden="true">${ICONS.lock}</svg><p>Nothing here yet. The system has room left.</p><span class="note">STATUS: AWAITING NEXT BUILD</span></div>`;
    };
    root.addEventListener('click', e => {
      const u = e.target.closest('[data-unset-live]');
      if (u) { toast(`Live link for ${u.dataset.unsetLive} is not set yet. Add it in CONFIG.live in script.js.`); return; }
      const a = e.target.closest('[data-arch]'); if (a) return select(a.dataset.arch);
      const t = e.target.closest('[data-tab]'); if (t) { tab = t.dataset.tab; drawPanel(); }
    });
    root.addEventListener('select-project', e => select(e.detail));
    select(PROJECTS[0].id);
  }

  /* ---- EXPERIENCE ---- */
  const OPS = [
    ['People', 'Talent, teams and clients: everyone with a stake in the release.'],
    ['Languages', 'Several languages moving through the same pipeline.'],
    ['Schedules', 'Timelines that connect many hands to one date.'],
    ['Quality', 'Checks before anything is allowed to ship.'],
    ['Documentation', 'Records that keep a complex project legible.'],
    ['Deadlines', 'Release dates do not move. Everything else does.'],
    ['Coordination', 'Keeping every moving part in step.']
  ];
  const orbitHTML = () => {
    const n = OPS.length; let lines = '', nodes = '';
    OPS.forEach(([name, cap], i) => {
      const a = (-90 + i * 360 / n) * Math.PI / 180;
      const x = (50 + Math.cos(a) * 38).toFixed(1), y = (50 + Math.sin(a) * 38).toFixed(1);
      lines += `<line x1="50" y1="50" x2="${x}" y2="${y}"/>`;
      nodes += `<button type="button" class="onode" style="left:${x}%;top:${y}%" data-cap="${cap}">${name}</button>`;
    });
    return `<div class="orbit"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}<circle cx="50" cy="50" r="38"/></svg><div class="ocore" aria-hidden="true">DUBBING<br>PM</div>${nodes}</div>
    <p class="ocap" id="ocap" aria-live="polite">Select an operation.</p>`;
  };
  const experienceHTML = () => `
  <div class="exp">
    <div class="exp__main">
      <span class="stamp">PREVIOUS INSTANCE</span>
      <p class="exp__lead">A dubbing project is a distributed system made of people. Scripts, voices, languages, studios, reviews and delivery dates all have to arrive in the same place at the same time. This role was the process that kept them in sync.</p>
      <dl class="dl-rows">
        <div><dt>ROLE</dt><dd>DUBBING PROJECT MANAGER</dd></div>
        <div><dt>SYSTEM</dt><dd>MULTILINGUAL MEDIA PRODUCTION</dd></div>
        <div><dt>OPERATIONS</dt><dd class="tags"><span class="tag">People</span><span class="tag">Languages</span><span class="tag">Schedules</span><span class="tag">Quality</span><span class="tag">Documentation</span><span class="tag">Deadlines</span><span class="tag">Coordination</span></dd></div>
        <div><dt>STATUS</dt><dd>ARCHIVED / EXPERIENCE RETAINED</dd></div>
      </dl>
      <hr class="rule" style="margin:4px 0">
      <div>
        <p class="lbl" style="margin-bottom:10px">CONNECTED NETWORKS (PROJECTS INCLUDED)</p>
        <ul class="ports"><li>Netflix</li><li>Crunchyroll</li><li>NBCUniversal</li><li>Universal theatrical releases</li></ul>
      </div>
      <div>
        <p class="lbl" style="margin-bottom:10px">RETAINED FROM THIS INSTANCE</p>
        <ul class="retained">
          <li>Holding many moving parts without dropping one.</li>
          <li>Documentation other people can actually use.</li>
          <li>Deadlines treated as fixed points.</li>
          <li>Working across languages, people and time.</li>
        </ul>
      </div>
    </div>
    <div>${orbitHTML()}</div>
  </div>`;
  const experienceMount = root => {
    const cap = $('#ocap', root);
    const set = e => {
      const b = e.target.closest('.onode'); if (!b) return;
      $$('.onode', root).forEach(n => n.classList.toggle('is-on', n === b));
      cap.textContent = b.dataset.cap;
    };
    root.addEventListener('pointerover', set);
    root.addEventListener('focusin', set);
    root.addEventListener('click', set);
  };

  /* ---- COMMUNICATION ---- */
  const XF = [
    ['Idea', 'Explanation', 'Takes something in one head and makes it land in another.'],
    ['Chaos', 'Plan', 'Sorts what is loud into what is next.'],
    ['Plan', 'Execution', 'Turns the list into a delivered thing.'],
    ['People', 'Coordination', 'Gets many people moving in one direction, on time.']
  ];
  const commHTML = () => `
  <p class="lbl" style="margin-bottom:8px">COMMUNICATION.DLL // SHARED LIBRARY</p>
  <p class="comm__intro">Loaded by almost everything else in the system, whenever a person needs to understand something or a group needs to move together.</p>
  <div class="xforms" role="group" aria-label="Capabilities">
    ${XF.map(([a, b], i) => `<button type="button" class="xf" data-i="${i}" aria-pressed="false"><b>${a}</b><span class="xf__arrow" aria-hidden="true"></span><b>${b}</b></button>`).join('')}
  </div>
  <div class="wave" aria-hidden="true">${'<i></i>'.repeat(30)}</div>
  <p class="xfcap" id="xfcap" aria-live="polite">Run a capability to see what it does.</p>
  <hr class="rule">
  <p class="lbl" style="margin-bottom:10px">LOADED BY</p>
  <div class="tags"><span class="tag">Event hosting</span><span class="tag">Anchoring</span><span class="tag">Script writing</span><span class="tag">Team coordination</span><span class="tag">IEEE / college activities</span></div>`;
  const commMount = (root, w) => {
    const cap = $('#xfcap', root), wave = $('.wave', root);
    let t;
    root.addEventListener('click', e => {
      const b = e.target.closest('.xf'); if (!b) return;
      $$('.xf', root).forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
      // restart CSS animation
      b.classList.remove('is-on'); void b.offsetWidth; b.classList.add('is-on');
      cap.textContent = XF[b.dataset.i][2];
      wave.classList.add('is-running');
      clearTimeout(t); t = setTimeout(() => wave.classList.remove('is-running'), 2200);
    });
    w.cleanup.push(() => clearTimeout(t));
  };

  /* ---- QUEST ---- */
  const questHTML = () => `
  <div class="quest__goal">
    <p class="lbl">CURRENT QUEST</p>
    <h2>Rebuild technical depth</h2>
    <p>Strengthen the foundation. Go deeper into technology.</p>
  </div>
  <ol class="qmap" aria-label="Quest map">
    <li class="qnode qnode--active"><b>Technology</b><span class="qstate">[ACTIVE]</span><p>The main line. Everything else branches from here.</p></li>
    <li class="qnode qnode--sub qnode--active"><b>Software development</b><span class="qstate">[ACTIVE]</span><p>Keep building. Keep shipping.</p></li>
    <li class="qnode qnode--exploring"><b>Cybersecurity</b><span class="qstate">[EXPLORING]</span><p>How systems are attacked, so they can be defended.</p></li>
    <li class="qnode qnode--exploring"><b>System security</b><span class="qstate">[EXPLORING]</span><p>How the layers underneath hold, and how they fail.</p></li>
    <li class="qnode qnode--locked"><b>Cloud</b><span class="qstate">[LOCKED / DISCOVERING]</span><p>Door found. Not opened yet.</p></li>
    <li class="qnode qnode--next"><b>Open source</b><span class="qstate">[NEXT]</span><p>Read first. Contribute after.</p></li>
    <li class="qnode qnode--unmapped"><b>? ? ? ? ?</b><span class="qstate">[UNMAPPED]</span><p>Not discovered yet.</p></li>
  </ol>
  <p class="quest__foot">The map is unfinished on purpose. So is the character.</p>`;

  /* ---- ACHIEVEMENTS ---- */
  const ACH = [
    ['THE HOST', 'Hosted and anchored events.', 'mic'],
    ['MULTILINGUAL OPERATOR', 'Worked on multilingual dubbing projects.', 'communication'],
    ['PROJECT COORDINATOR', 'Managed real-world project workflows.', 'experience'],
    ['FULL-STACK SURVIVOR', 'Built AAA Travels.', 'code'],
    ['SYSTEM BUILDER', 'Created multiple technical projects.', 'skills'],
    ['STILL CURIOUS', 'Keeps exploring new technical domains.', 'quest']
  ];
  const hex = icon => `
    <svg class="ach__hex" viewBox="0 0 54 54" aria-hidden="true">
      <path d="M27 3l21 12v24L27 51 6 39V15z"/>
      <g transform="translate(15 15) scale(1)"><svg class="ico" viewBox="0 0 24 24" width="24" height="24" style="stroke:#3A2E66">${ICONS[icon] || ''}</svg></g>
    </svg>`;
  const achievementsHTML = () => `
  <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="hexg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F5D5E6"/><stop offset=".55" stop-color="#D2E5F7"/><stop offset="1" stop-color="#CDBFEF"/></linearGradient></defs></svg>
  <p class="achs__intro">${ACH.length} unlocked. The list is not closed.</p>
  <ul class="achs">
    ${ACH.map(([t, d, i]) => `<li class="ach">${hex(i)}<div><h3>${t}</h3><p>${d}</p></div></li>`).join('')}
    <li class="ach ach--locked">${hex('lock')}<div><h3>[ REDACTED ]</h3><p>Unlocks when the current quest ends. It has not ended.</p></div></li>
  </ul>`;

  /* ---- KNOWN BUGS ---- */
  const BUGS = [
    ['BUG-001', 'Too many ideas open simultaneously.', 'OPEN', 'Workaround: write one down, finish a different one.'],
    ['BUG-002', 'Occasionally attempts to learn an entire subject at once.', 'MONITORED', 'Workaround: install modules one at a time. (See SKILLS.EXE.)'],
    ['BUG-003', 'Perfectionism occasionally interrupts execution.', 'PATCHING', 'Workaround: ship the build, archive it, improve it later.'],
    ['BUG-004', 'System tends to overthink.', 'OPEN', 'Runs many simulations before opening a single file.'],
    ['BUG-005', 'New tabs may multiply without warning.', 'REPRODUCIBLE', 'Reproduction steps below.']
  ];
  const TAB_NAMES = ['New tab', 'docs', 'how to learn everything', 'Untitled', 'one more idea', 'docs (2)', 'what is a kernel', 'New tab', 'roadmap', 'docs (3)', 'Untitled (2)', 'one more idea (2)', 'New tab', 'just one more'];
  const bugsHTML = () => `
  <div class="bugs__intro"><span>REPORTED BY: the user</span><span>TRIAGED BY: the user</span><span>FIX SCHEDULED: eventually, or never. Some of these are load-bearing.</span></div>
  <ul class="bugs">
    ${BUGS.map(([id, t, s, n]) => `<li class="bug"><code>${id}</code><h3>${t}</h3><em class="${s === 'REPRODUCIBLE' ? 'is-hot' : ''}">${s}</em><p>${n}</p></li>`).join('')}
  </ul>
  <div class="repro">
    <p class="lbl">REPRODUCE BUG-005</p>
    <div class="tabstrip" aria-hidden="true"></div>
    <p class="bugmsg" aria-live="polite">Press the button. Do not close anything.</p>
    <div class="sim__actions"><button type="button" class="btn btn--solid" data-spawn>OPEN A NEW TAB</button><button type="button" class="btn" data-clear>CLOSE ALL</button></div>
  </div>`;
  const bugsMount = (root, w) => {
    const strip = $('.tabstrip', root), msg = $('.bugmsg', root);
    let n = 0, timer = null;
    const add = () => {
      n++;
      const s = document.createElement('span');
      s.className = 'btabx'; s.textContent = TAB_NAMES[(n - 1) % TAB_NAMES.length];
      strip.appendChild(s); sfx('blip');
    };
    const tick = () => {
      if (n >= 14) { timer = null; msg.textContent = 'BUG-005 reproduced: 14 tabs open, none closed. This is the bug.'; return; }
      add(); timer = setTimeout(tick, Math.max(90, 420 - n * 28));
    };
    $('[data-spawn]', root).addEventListener('click', () => {
      if (timer || n >= 14) return;
      msg.textContent = 'Reproducing...';
      tick();
    });
    $('[data-clear]', root).addEventListener('click', () => {
      clearTimeout(timer); timer = null; strip.innerHTML = ''; n = 0;
      msg.textContent = 'All tabs closed. (Give it a moment.)';
    });
    w.cleanup.push(() => clearTimeout(timer));
  };

  /* ---- INVENTORY ---- */
  const INV = [
    ['laptop', 'Laptop', 'Technology', 'Where the code gets written, broken and fixed.'],
    ['phone', 'Phone', 'Coordination', 'Messages, calls, follow-ups. The line to everyone else.'],
    ['notebook', 'Notebook', 'Ideas / learning', 'Where ideas wait to be built. Some wait a long time.'],
    ['code', 'Code', 'Craft', 'Python, Java, JavaScript, SQL and the rest of the module list.'],
    ['mic', 'Microphone', 'Hosting / communication', 'Events, anchoring, and saying the plan out loud.'],
    ['headphones', 'Headphones', 'Listening / focus', 'For languages, for audio, and for closing a door in a crowded room.'],
    ['branches', 'GitHub', 'Projects', 'Where builds are kept and shared.'],
    ['idcard', 'Student ID', 'Origin', 'BCA, then MCA. Still enrolled in learning.'],
    ['folder', 'Project files', 'Archive', 'AAA Travels, and whatever comes next.'],
    ['bulb', 'Ideas', 'Open items', 'Plural. Unfinished. Load-bearing.']
  ];
  const inventoryHTML = () => `
  <div class="inv">
    <div class="slots" role="group" aria-label="Inventory slots">
      ${INV.map((it, i) => `<button type="button" class="slot" data-i="${i}" aria-pressed="${i === 0}" aria-label="${it[1]}">${svg(it[0])}</button>`).join('')}
      <button type="button" class="slot slot--empty" data-empty aria-label="Empty slot">${svg('lock')}</button>
      <button type="button" class="slot slot--empty" data-empty aria-label="Empty slot">${svg('lock')}</button>
    </div>
    <div class="idetail" aria-live="polite">
      <span class="idetail__ico" id="iIco"></span>
      <div><p class="lbl" id="iLink"></p><h3 id="iName"></h3></div>
      <p id="iNote"></p>
    </div>
  </div>`;
  const inventoryMount = root => {
    const show = i => {
      const it = INV[i];
      $$('.slot[data-i]', root).forEach(s => s.setAttribute('aria-pressed', String(+s.dataset.i === i)));
      $('#iIco', root).innerHTML = svg(it[0]);
      $('#iLink', root).textContent = 'LINKED TO: ' + it[2].toUpperCase();
      $('#iName', root).textContent = it[1];
      $('#iNote', root).textContent = it[3];
    };
    const emptyShow = () => {
      $$('.slot[data-i]', root).forEach(s => s.setAttribute('aria-pressed', 'false'));
      $('#iIco', root).innerHTML = svg('lock');
      $('#iLink', root).textContent = 'LINKED TO: NOTHING YET';
      $('#iName', root).textContent = 'Empty slot';
      $('#iNote', root).textContent = 'Reserved. The journey is not finished.';
    };
    const handle = e => {
      const s = e.target.closest('.slot'); if (!s) return;
      if (s.dataset.empty !== undefined) emptyShow(); else show(+s.dataset.i);
    };
    root.addEventListener('pointerover', handle);
    root.addEventListener('focusin', handle);
    root.addEventListener('click', handle);
    show(0);
  };

  /* ---- SAVE POINT ---- */
  const linkFor = k => {
    const v = CONFIG[k];
    if (!v) return null;
    return k === 'email' ? `mailto:${v}` : v;
  };
  const linkBtn = (k, label, icon) => {
    const href = linkFor(k);
    return href
      ? `<a class="sp-link" href="${href}" ${k === 'email' ? '' : 'target="_blank" rel="noopener noreferrer"'}>${svg(icon)}${label}</a>`
      : `<button type="button" class="sp-link is-unset" data-unset="${k}">${svg(icon)}${label}</button>`;
  };
  const saveHTML = () => `
  <div class="save">
    <div>
      <p class="lbl">SAVE_POINT.EXE</p>
      <p class="lbl" style="margin-top:14px">SESSION NEARLY COMPLETE.</p>
      <h2 class="save__big" style="margin-top:8px">The system is still evolving.</h2>
    </div>
    <p style="font:400 20px/1.35 var(--f-serif)">If you would like to build something together:</p>
    <div class="save__links">
      ${linkBtn('email', 'EMAIL', 'phone')}
      ${linkBtn('github', 'GITHUB', 'branches')}
      ${linkBtn('linkedin', 'LINKEDIN', 'idcard')}
    </div>
    <div class="slotcard" id="slotCard">
      <p class="lbl">SAVE SLOT 01</p>
      <dl class="dl-rows">
        <div><dt>FILE</dt><dd>AYUSHI.OS / HUMAN SYSTEM</dd></div>
        <div><dt>SESSION TIME</dt><dd data-uptime>00:00:00</dd></div>
        <div><dt>FILES OPENED</dt><dd data-opened>0 / 0</dd></div>
      </dl>
      <div class="sim__actions"><button type="button" class="btn btn--solid" data-save>SAVE SESSION</button></div>
      <p class="savemsg" aria-live="polite"></p>
    </div>
    <div class="status2">
      <span>SYSTEM STATUS: <b>ONLINE</b></span>
      <span>USER STATUS: <span class="serif">still becoming</span></span>
    </div>
  </div>`;
  const saveMount = root => {
    root.addEventListener('click', e => {
      const u = e.target.closest('[data-unset]');
      if (u) { toast(`${u.dataset.unset.toUpperCase()} link is not configured yet. Set it in script.js (CONFIG).`); return; }
      if (e.target.closest('[data-save]')) {
        $('#slotCard', root).classList.add('is-saved'); sfx('unlock');
        $('.savemsg', root).textContent = 'SESSION SAVED. Nothing was stored, but you were here.';
      }
    });
  };

  /* ---- registry (order = story order; also the clockwise order on the desktop) ---- */
  const APPS = [
    { id: 'about', file: 'ABOUT.EXE', icon: 'about', w: 800, h: 640, sys: 'PID 001 / USER', stat: 'PROFILE LOADED', next: 'memory', render: aboutHTML, mount: aboutMount },
    { id: 'memory', file: 'MEMORY.DAT', icon: 'memory', w: 640, h: 660, sys: 'PID 002 / LOG', stat: '4 CLOSED / 1 PENDING', next: 'skills', render: memoryHTML, mount: memoryMount },
    { id: 'skills', file: 'SKILLS.EXE', icon: 'skills', w: 780, h: 680, sys: 'PID 003 / MODULES', stat: '11 INSTALLED / 4 ACTIVE / 2 EXPLORING / 2 QUEUED', next: 'projects', render: skillsHTML, mount: skillsMount },
    { id: 'projects', file: 'PROJECTS.EXE', icon: 'projects', w: 840, h: 680, sys: 'PID 004 / ARCHIVE', stat: `${PROJECTS.length} BUILDS INDEXED`, next: 'experience', render: projectsHTML, mount: projectsMount },
    { id: 'experience', file: 'EXPERIENCE.EXE', icon: 'experience', w: 860, h: 700, sys: 'PID 005 / PREVIOUS', stat: 'INSTANCE ARCHIVED', next: 'communication', render: experienceHTML, mount: experienceMount },
    { id: 'communication', file: 'COMMUNICATION.DLL', icon: 'communication', w: 680, h: 640, sys: 'PID 006 / LIB', stat: 'LIBRARY LOADED', next: 'quest', render: commHTML, mount: commMount },
    { id: 'quest', file: 'CURRENT_QUEST.EXE', icon: 'quest', w: 700, h: 700, sys: 'PID 007 / LIVE', stat: 'MAP INCOMPLETE', next: 'achievements', render: questHTML },
    { id: 'achievements', file: 'ACHIEVEMENTS', icon: 'achievements', w: 720, h: 600, sys: 'PID 008 / UNLOCKS', stat: '6 UNLOCKED / 1 REDACTED', next: 'bugs', render: achievementsHTML },
    { id: 'bugs', file: 'KNOWN_BUGS.LOG', icon: 'bugs', w: 680, h: 680, sys: 'PID 009 / DEBUG', stat: '5 KNOWN / 0 FIXED', next: 'inventory', render: bugsHTML, mount: bugsMount },
    { id: 'inventory', file: 'INVENTORY', icon: 'inventory', w: 740, h: 560, sys: 'PID 010 / ITEMS', stat: '10 ITEMS / 2 SLOTS FREE', next: 'save', render: inventoryHTML, mount: inventoryMount },
    { id: 'save', file: 'SAVE_POINT.EXE', icon: 'save', w: 620, h: 700, sys: 'PID 011 / SAVE', stat: 'SESSION ACTIVE', next: null, render: saveHTML, mount: saveMount }
  ];
  const BY_ID = Object.fromEntries(APPS.map(a => [a.id, a]));

  /* ---------------------------------------------------------------
     4. WINDOW MANAGER
     --------------------------------------------------------------- */
  const wins = new Map();
  const opened = new Set();
  let zTop = 10, cascade = 0, active = null, startTime = Date.now();
  const layer = () => $('#windows');

  let fullSyncFired = false;
  function syncUI(n) {
    const pct = Math.round(n / APPS.length * 100);
    const arc = $('#syncArc'); if (arc) arc.setAttribute('stroke-dashoffset', String(100 - pct));
    const t = $('#syncTxt'); if (t) t.textContent = `SYNC ${pad(n)} / ${APPS.length}`;
    const m = $('#monSync'); if (m) m.textContent = pct + '%';
    if (window.FX && FX.markLinks) FX.markLinks([...wins.keys()]);
    if (n >= APPS.length && !fullSyncFired) { fullSyncFired = true; if (window.AOS && AOS.onFullSync) AOS.onFullSync(); }
  }

  function updateTray() {
    wins.forEach(w => {
      w.chip.classList.toggle('is-active', w === active && !w.min);
      w.chip.classList.toggle('is-min', w.min);
      w.chip.setAttribute('aria-pressed', String(w === active && !w.min));
    });
    $$('.icon').forEach(i => i.classList.toggle('is-open', wins.has(i.dataset.app)));
    const n = opened.size, short = isMobile();
    $('#pathBtn').textContent = n >= APPS.length ? (short ? 'Done' : 'Path complete') : (short ? `Path ${n}/${APPS.length}` : `Guided path ${n}/${APPS.length}`);
    syncUI(n);
    $$('[data-opened]').forEach(el => (el.textContent = `${n} / ${APPS.length}`));
  }

  function focusWin(w) {
    zTop++;
    w.el.style.zIndex = zTop;
    wins.forEach(o => o.el.classList.toggle('is-active', o === w));
    active = w;
    updateTray();
  }
  function restoreWin(w) {
    w.min = false;
    w.el.classList.remove('is-min');
    w.el.inert = false;
    w.el.removeAttribute('aria-hidden');
  }
  function topWin() {
    let best = null;
    wins.forEach(w => { if (!w.min && (!best || +w.el.style.zIndex > +best.el.style.zIndex)) best = w; });
    return best;
  }
  function minimizeWin(w) {
    if (isMobile()) return closeWin(w);
    sfx('min');
    w.min = true;
    w.el.classList.add('is-min');
    w.el.inert = true;
    w.el.setAttribute('aria-hidden', 'true');
    if (active === w) { active = null; const t = topWin(); if (t) focusWin(t); }
    updateTray();
  }
  function closeWin(w) {
    sfx('close');
    w.cleanup.forEach(fn => fn());
    wins.delete(w.id);
    w.chip.remove();
    w.el.classList.add('is-closing');
    w.el.inert = true;
    setTimeout(() => w.el.remove(), reduceMotion ? 0 : 220);
    if (active === w) { active = null; const t = topWin(); if (t) focusWin(t); }
    updateTray();
    if (!wins.size || isMobile()) {
      const ic = $(`.icon[data-app="${w.id}"]`);
      if (ic) ic.focus({ preventScroll: true });
    }
  }

  function openApp(id) {
    const app = BY_ID[id];
    if (!app) return;
    let w = wins.get(id);
    if (w) { restoreWin(w); focusWin(w); return w; }

    if (isMobile()) wins.forEach(o => closeWin(o)); // one full-screen app at a time

    w = { id, app, cleanup: [], min: false };
    const el = document.createElement('section');
    el.className = 'win';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-labelledby', `wt-${id}`);
    el.style.setProperty('--w', app.w + 'px');
    el.style.setProperty('--h', app.h + 'px');
    el.innerHTML = `
      <div class="win__scan" aria-hidden="true"><i class="win__c win__c--tl"></i><i class="win__c win__c--tr"></i><i class="win__c win__c--bl"></i><i class="win__c win__c--br"></i></div>
      <header class="win__head">
        <button class="win__back" type="button" aria-label="Close ${app.file} and return to the desktop">HOME</button>
        <span class="win__title" id="wt-${id}">${svg(app.icon)}<b>${app.file}</b></span>
        <span class="win__sys" aria-hidden="true">${app.sys}</span>
        <span class="win__ctl">
          <button class="win__min" type="button" aria-label="Minimize ${app.file}"><i></i></button>
          <button class="win__x" type="button" aria-label="Close ${app.file}"><i></i></button>
        </span>
      </header>
      <div class="win__body" tabindex="-1">${app.render()}</div>
      <footer class="win__foot">
        <span>${app.stat}</span>
        ${app.next
          ? `<button class="win__next" type="button" data-next="${app.next}">NEXT: ${BY_ID[app.next].file}</button>`
          : `<button class="win__next" type="button" data-reboot>REBOOT</button>`}
      </footer>`;
    w.el = el;

    // position (desktop only; mobile CSS makes windows full-screen)
    const vw = innerWidth, vh = innerHeight;
    const ww = Math.min(app.w, vw - 24), wh = Math.min(app.h, vh - 116);
    const k = cascade++ % 6;
    el.style.left = clamp((vw - ww) / 2 + (k - 2.5) * 38, 12, Math.max(12, vw - ww - 12)) + 'px';
    el.style.top = clamp((vh - wh) / 2 - 46 + (k - 2.5) * 20, 14, Math.max(14, vh - wh - 92)) + 'px';

    // tray chip
    const chip = document.createElement('button');
    chip.type = 'button'; chip.className = 'chip';
    chip.title = app.file; chip.setAttribute('aria-label', app.file);
    chip.innerHTML = svg(app.icon);
    chip.addEventListener('click', () => {
      if (w.min) { restoreWin(w); focusWin(w); }
      else if (active === w) minimizeWin(w);
      else focusWin(w);
    });
    $('#tasks').appendChild(chip);
    w.chip = chip;

    layer().appendChild(el);
    wins.set(id, w);
    const firstTime = !opened.has(id);
    opened.add(id);
    focusWin(w);
    sfx('open');
    if (window.AOS && AOS.onOpen) AOS.onOpen(id, firstTime);
    if (app.mount) app.mount(el, w);

    // events
    el.addEventListener('pointerdown', () => { if (active !== w) focusWin(w); }, true);
    $('.win__x', el).addEventListener('click', () => closeWin(w));
    $('.win__back', el).addEventListener('click', () => closeWin(w));
    $('.win__min', el).addEventListener('click', () => minimizeWin(w));
    const nextBtn = $('.win__next', el);
    nextBtn.addEventListener('click', () => {
      if (nextBtn.hasAttribute('data-reboot')) { location.reload(); return; }
      const nxt = nextBtn.dataset.next;
      if (!isMobile()) minimizeWin(w);
      openApp(nxt);
    });
    enableDrag(w);
    if (!isMobile()) setTimeout(() => $('.win__body', el).focus({ preventScroll: true }), 60);
    return w;
  }

  function enableDrag(w) {
    const head = $('.win__head', w.el);
    head.addEventListener('pointerdown', e => {
      if (isMobile() || e.button !== 0 || e.target.closest('button')) return;
      const r = w.el.getBoundingClientRect();
      const dx = e.clientX - r.left, dy = e.clientY - r.top;
      head.setPointerCapture(e.pointerId);
      w.el.classList.add('is-dragging');
      const move = ev => {
        w.el.style.left = clamp(ev.clientX - dx, -r.width + 140, innerWidth - 140) + 'px';
        w.el.style.top = clamp(ev.clientY - dy, 8, innerHeight - 72) + 'px';
      };
      const up = () => {
        head.removeEventListener('pointermove', move);
        head.removeEventListener('pointerup', up);
        head.removeEventListener('pointercancel', up);
        w.el.classList.remove('is-dragging');
      };
      head.addEventListener('pointermove', move);
      head.addEventListener('pointerup', up);
      head.addEventListener('pointercancel', up);
    });
  }

  addEventListener('resize', () => {
    if (isMobile()) return;
    wins.forEach(w => {
      const x = parseFloat(w.el.style.left) || 0, y = parseFloat(w.el.style.top) || 0;
      w.el.style.left = clamp(x, -w.el.offsetWidth + 140, innerWidth - 140) + 'px';
      w.el.style.top = clamp(y, 8, innerHeight - 72) + 'px';
    });
  });

  addEventListener('keydown', e => {
    if (e.key === 'Escape' && active && document.body.classList.contains('is-live')) closeWin(active);
  });

  /* ---------------------------------------------------------------
     5. DESKTOP
     --------------------------------------------------------------- */
  function buildDesktop() {
    // icons, clockwise around the core in story order
    const ul = $('#icons'), n = APPS.length;
    APPS.forEach((app, i) => {
      const a = (-115 + i * (360 / n)) * Math.PI / 180;
      const li = document.createElement('li');
      li.className = 'icon-slot';
      li.style.setProperty('--cos', Math.cos(a).toFixed(3));
      li.style.setProperty('--sin', Math.sin(a).toFixed(3));
      li.style.setProperty('--i', i);
      li.innerHTML = `<button class="icon" type="button" data-app="${app.id}" aria-label="Open ${app.file}">
        <span class="icon__tile">${svg(app.icon)}<i class="icon__led"></i></span>
        <span class="icon__label">${app.file}</span></button>`;
      ul.appendChild(li);
    });
    ul.addEventListener('click', e => {
      const b = e.target.closest('.icon'); if (b) openApp(b.dataset.app);
    });

    // sounds + 3D tilt
    let lastHover = null, lastT = 0;
    document.addEventListener('pointerover', e => {
      const el = e.target.closest('button, a, .icon');
      const now = performance.now();
      if (el && el !== lastHover && now - lastT > 70 && !el.classList.contains('enter')) { lastHover = el; lastT = now; sfx('hover'); }
      if (!el) lastHover = null;
    });
    document.addEventListener('click', e => {
      const el = e.target.closest('button, a');
      if (el && !el.classList.contains('enter') && !el.classList.contains('core') && !el.classList.contains('icon')) sfx('click');
    });
    ul.addEventListener('pointermove', e => {
      const t = e.target.closest('.icon'); if (!t) return;
      const r = $('.icon__tile', t).getBoundingClientRect();
      t.style.setProperty('--tx', (-((e.clientY - r.top) / r.height - .5) * 22).toFixed(1) + 'deg');
      t.style.setProperty('--ty', (((e.clientX - r.left) / r.width - .5) * 22).toFixed(1) + 'deg');
    });
    ul.addEventListener('pointerout', e => {
      const t = e.target.closest('.icon'); if (t) { t.style.setProperty('--tx', '0deg'); t.style.setProperty('--ty', '0deg'); }
    });

    // core ring ticks
    const g = $('#ticks'); let t = '';
    for (let i = 0; i < 120; i++) {
      const a = i * 3 * Math.PI / 180, long = i % 10 === 0;
      const r1 = 218, r2 = long ? 208 : 213;
      t += `<line x1="${(Math.sin(a) * r1).toFixed(1)}" y1="${(-Math.cos(a) * r1).toFixed(1)}" x2="${(Math.sin(a) * r2).toFixed(1)}" y2="${(-Math.cos(a) * r2).toFixed(1)}"/>`;
    }
    g.innerHTML = t;

    // thoughts
    const thoughts = [
      'this is not a resume. it is a system you are allowed to poke.',
      'current build: unfinished, which is the point.',
      'reminder: install one module at a time.',
      'compiling a slightly better version of me.',
      'i have several tabs open. all of them are load-bearing.',
      'future.exe: status unknown. proceeding anyway.',
      'still becoming. no ETA.'
    ];
    let ti = 0;
    const core = $('#core'), th = $('#thought');
    core.addEventListener('click', () => {
      ti = (ti + 1) % thoughts.length;
      core.classList.remove('is-ping'); void core.offsetWidth; core.classList.add('is-ping');
      sfx('ping');
      if (window.SFX && SFX.state.voice) SFX.speak(thoughts[ti]);
      th.classList.add('is-swap');
      setTimeout(() => { th.textContent = thoughts[ti]; th.classList.remove('is-swap'); }, reduceMotion ? 0 : 300);
    });

    // guided path
    $('#pathBtn').addEventListener('click', () => {
      const nxt = APPS.find(a => !opened.has(a.id));
      if (nxt) openApp(nxt.id);
      else toast('Path complete. Nothing left to boot. Explore freely.');
    });

    // parallax (fine pointers only)
    if (!reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const d = $('#desktop'); let raf = 0;
      addEventListener('pointermove', e => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          d.style.setProperty('--px', (e.clientX / innerWidth - .5).toFixed(3));
          d.style.setProperty('--py', (e.clientY / innerHeight - .5).toFixed(3));
        });
      }, { passive: true });
    }

    // clock + uptime
    const clock = $('#clock');
    const tick = () => {
      clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const up = fmtUptime(Math.floor((Date.now() - startTime) / 1000));
      $$('[data-uptime]').forEach(el => (el.textContent = up));
    };
    tick(); setInterval(tick, 1000);

    // occasional glitch, once in a while, on system text only
    if (!reduceMotion) {
      const targets = $$('[data-glitch]');
      const go = () => {
        const el = targets[Math.floor(Math.random() * targets.length)];
        if (el) { el.classList.add('is-glitch'); sfx('glitch'); setTimeout(() => el.classList.remove('is-glitch'), 360); }
        setTimeout(go, 9000 + Math.random() * 8000);
      };
      setTimeout(go, 7000);
    }
    updateTray();
  }

  /* ---------------------------------------------------------------
     6. BOOT
     --------------------------------------------------------------- */
  function boot() {
    const bootEl = $('#boot'), power = $('#power'), inner = $('#bootInner'), reactor = $('#bootReactor');
    const log = $('#bootLog'), status = $('#bootStatus'), btn = $('#enterBtn'), hint = $('#bootHint');
    const arc = $('#bootArc'), pct = $('#bootPct');
    const LINES = [
      ['INITIALIZING PERSONALITY', 'OK'],
      ['LOADING MEMORIES', 'OK'],
      ['LOADING SKILLS', 'OK'],
      ['LOADING PROJECTS', 'OK'],
      ['LOADING EXPERIENCE', 'OK'],
      ['LOADING FUTURE', 'UNKNOWN']
    ];
    const timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
    let finished = false, started = false, i = 0;

    const setProgress = p => { arc.setAttribute('stroke-dashoffset', String(100 - p)); pct.textContent = Math.round(p) + '%'; };
    const addLine = ([label, st], idx, instant) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${label}...</span><i class="dots"></i><b class="st st--wait">····</b>`;
      log.appendChild(li);
      const stEl = $('.st', li);
      const resolve = () => {
        stEl.textContent = st;
        stEl.className = 'st ' + (st === 'OK' ? 'st--ok' : 'st--unk');
        setProgress(((idx + 1) / LINES.length) * 100);
        if (!instant) sfx(st === 'OK' ? 'ok' : 'unknown');
      };
      if (!instant) sfx('blip');
      if (instant) resolve(); else later(resolve, st === 'UNKNOWN' ? 620 : 170);
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      status.hidden = false; btn.hidden = false; hint.hidden = true;
      sfx('ping');
      if (window.SFX && SFX.state.voice) SFX.speak('System online.');
      btn.focus({ preventScroll: true });
    };
    const step = () => {
      if (i >= LINES.length) { later(finish, reduceMotion ? 0 : 900); return; }
      addLine(LINES[i], i); i++;
      later(step, reduceMotion ? 30 : 320);
    };
    const skip = () => {
      if (!started || finished) return;
      timers.forEach(clearTimeout);
      log.innerHTML = '';
      LINES.forEach((l, idx) => addLine(l, idx, true));
      finish();
    };
    const start = mode => {
      if (started) return;
      started = true;
      if (mode === 'sound' && window.SFX) {
        SFX.setSound(true); SFX.setVoice(true); SFX.setAmbient(true);
        SFX.play('power');
      }
      power.hidden = true; inner.hidden = false; reactor.hidden = false;
      later(step, reduceMotion ? 0 : 800);
    };
    $('#powerOn').addEventListener('click', () => start('sound'));
    $('#powerSilent').addEventListener('click', () => start('silent'));
    $('#powerOn').focus({ preventScroll: true });

    bootEl.addEventListener('pointerdown', e => { if (!e.target.closest('.enter, .ghost')) skip(); });
    addEventListener('keydown', () => { if (started && !finished && !bootEl.classList.contains('is-leaving')) skip(); });

    btn.addEventListener('click', () => {
      const r = btn.getBoundingClientRect();
      bootEl.style.setProperty('--cx', (r.left + r.width / 2) + 'px');
      bootEl.style.setProperty('--cy', (r.top + r.height / 2) + 'px');
      bootEl.classList.add('is-leaving');
      sfx('enter');
      startTime = Date.now();
      $('#desktop').removeAttribute('inert');
      document.body.classList.remove('is-booting');
      document.body.classList.add('is-live');
      document.dispatchEvent(new Event('aos:live'));
      setTimeout(() => { bootEl.classList.add('is-gone'); }, reduceMotion ? 0 : 950);
      // the assistant greets the visitor; without it, fall back to opening the profile
      setTimeout(() => {
        if (window.AOS && AOS.greet) AOS.greet();
        else if (!isMobile()) openApp('about');
      }, reduceMotion ? 0 : 1100);
    });
  }

  /* expose a small API for fx.js and assistant.js */
  window.AOS = {
    APPS, BY_ID, openApp,
    PROJECTS,
    selectProject: id => { const w = openApp('projects'); if (w) w.el.dispatchEvent(new CustomEvent('select-project', { detail: id })); }, closeWin, wins, opened, toast, isMobile,
    closeAll: () => Array.from(wins.values()).forEach(closeWin),
    get active() { return active; }
  };

  buildDesktop();
  boot();
})();
