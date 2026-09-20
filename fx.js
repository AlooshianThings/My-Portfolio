/* =====================================================================
   AYUSHI.OS — fx.js
   Canvas + HUD effects: constellation background, audio-reactive core,
   icon-to-core links, reticle cursor, 3D skill constellation.
   Exposes window.FX. Everything degrades gracefully without it.
   ===================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = () => matchMedia('(max-width: 820px)').matches;
  const dprNow = () => Math.min(window.devicePixelRatio || 1, 2);
  const PLUM = '107,90,155', DEEP = '58,46,102', ROSE = '176,67,128', BLUE = '90,140,200';
  const FX = (window.FX = {});

  /* ---------- pointer (shared) ---------- */
  const mouse = { x: -999, y: -999 };
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.x = mouse.y = -999; });

  /* ---------- particle constellation ---------- */
  const pc = $('#particles'), pctx = pc && pc.getContext('2d');
  let W = 0, H = 0, pts = [], burstPts = [];
  function sizeParticles() {
    if (!pc) return;
    const dpr = dprNow();
    W = innerWidth; H = innerHeight;
    pc.width = W * dpr; pc.height = H * dpr;
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(mobile() ? 30 : 74, Math.floor(W * H / 20000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: 1 + Math.random() * 1.5
    }));
  }
  function drawParticles() {
    if (!pctx) return;
    pctx.clearRect(0, 0, W, H);
    const lvl = window.SFX ? SFX.level() : 0;
    for (const p of pts) {
      if (!reduce) {
        p.x += p.vx * (1 + lvl * 2); p.y += p.vy * (1 + lvl * 2);
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      }
      pctx.fillStyle = `rgba(${PLUM},.42)`;
      pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, 6.283); pctx.fill();
    }
    pctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
        if (d < 15000) { pctx.strokeStyle = `rgba(${PLUM},${(1 - d / 15000) * .22})`; pctx.beginPath(); pctx.moveTo(a.x, a.y); pctx.lineTo(b.x, b.y); pctx.stroke(); }
      }
      const mx = a.x - mouse.x, my = a.y - mouse.y, md = mx * mx + my * my;
      if (md < 26000) {
        pctx.strokeStyle = `rgba(${ROSE},${(1 - md / 26000) * .4})`;
        pctx.beginPath(); pctx.moveTo(a.x, a.y); pctx.lineTo(mouse.x, mouse.y); pctx.stroke();
        if (!reduce) { a.x += mx * .0008; a.y += my * .0008; }
      }
    }
    for (let k = burstPts.length - 1; k >= 0; k--) {
      const b = burstPts[k];
      b.x += b.vx; b.y += b.vy; b.vx *= .965; b.vy *= .965; b.vy += .012; b.life -= .014;
      if (b.life <= 0) { burstPts.splice(k, 1); continue; }
      pctx.fillStyle = `rgba(${b.c},${b.life})`;
      pctx.beginPath(); pctx.arc(b.x, b.y, b.r * b.life + .4, 0, 6.283); pctx.fill();
    }
  }
  FX.burst = (x, y) => {
    const cols = [PLUM, ROSE, BLUE, DEEP];
    for (let i = 0; i < 90; i++) {
      const a = Math.random() * 6.283, sp = 1.5 + Math.random() * 5;
      burstPts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 2 + Math.random() * 3, life: .7 + Math.random() * .5, c: cols[i % 4] });
    }
  };

  /* ---------- audio-reactive core ---------- */
  const core = $('#core'), vz = $('#viz'), vctx = vz && vz.getContext('2d');
  const N = 96, amp = new Float32Array(N);
  let coreW = 0, vizW = 0;
  function sizeViz() {
    if (!vz || !core) return;
    coreW = core.offsetWidth; vizW = coreW * 1.32;
    const dpr = dprNow();
    vz.width = vz.height = Math.max(1, Math.round(vizW * dpr));
    vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function drawViz(t) {
    if (!vctx || !coreW) return;
    const lvl = window.SFX ? SFX.level() : 0;
    core.style.setProperty('--lvl', lvl.toFixed(3));
    vctx.clearRect(0, 0, vizW, vizW);
    const cx = vizW / 2, r0 = coreW * .365;
    vctx.lineCap = 'round'; vctx.lineWidth = Math.max(1.5, coreW * .006);
    for (let i = 0; i < N; i++) {
      const target = .1 + .06 * Math.sin(t / 900 + i * .42) + .03 * Math.sin(t / 430 - i * .9) + lvl * (.25 + .75 * Math.abs(Math.sin(i * 1.7 + t / 130)));
      amp[i] += (target - amp[i]) * .28;
      const a = i / N * 6.283 - 1.5708, len = amp[i] * coreW * .24;
      const col = i % 3 === 0 ? BLUE : i % 7 === 0 ? ROSE : PLUM;
      vctx.strokeStyle = `rgba(${col},${Math.min(.95, .22 + amp[i] * 1.5)})`;
      vctx.beginPath();
      vctx.moveTo(cx + Math.cos(a) * r0, cx + Math.sin(a) * r0);
      vctx.lineTo(cx + Math.cos(a) * (r0 + len), cx + Math.sin(a) * (r0 + len));
      vctx.stroke();
    }
  }

  /* ---------- monitor oscilloscope + visitor scan ---------- */
  const sc = $('#scope'), sctx = sc && sc.getContext('2d');
  function drawScope(t) {
    if (!sctx || !sc.offsetParent) return;
    const dpr = dprNow(), w = sc.clientWidth, h = sc.clientHeight;
    if (sc.width !== Math.round(w * dpr)) { sc.width = Math.round(w * dpr); sc.height = Math.round(h * dpr); }
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.clearRect(0, 0, w, h);
    const f = window.SFX ? SFX.freq() : null;
    const bars = 36, bw = w / bars;
    for (let i = 0; i < bars; i++) {
      const v = f ? f[Math.floor(i * 1.3)] / 255 : 0;
      const idle = .12 + .1 * Math.sin(t / 500 + i * .5);
      const val = Math.max(idle, v);
      sctx.fillStyle = `rgba(${PLUM},${.35 + val * .6})`;
      const bh = val * h;
      sctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
    }
  }
  function visitor() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('visLang', (navigator.language || 'en').toUpperCase());
    set('visScreen', `${innerWidth}x${innerHeight}`);
    let z = 'LOCAL'; try { z = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop().replace(/_/g, ' '); } catch (e) { /* ignore */ }
    set('visZone', z);
  }

  /* ---------- links from core to icons ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  function layoutLinks() {
    const svg = $('#links');
    if (!svg || !core || mobile()) return;
    svg.innerHTML = '';
    const cr = core.getBoundingClientRect(), cx = cr.left + cr.width / 2, cy = cr.top + cr.height / 2;
    document.querySelectorAll('.icon').forEach(ic => {
      const tile = $('.icon__tile', ic).getBoundingClientRect();
      const tx = tile.left + tile.width / 2, ty = tile.top + tile.height / 2;
      const dx = tx - cx, dy = ty - cy, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
      const r0 = cr.width * .58, r1 = tile.width * .62;
      const g = document.createElementNS(NS, 'g'); g.dataset.app = ic.dataset.app;
      const l = document.createElementNS(NS, 'line');
      l.setAttribute('x1', cx + ux * r0); l.setAttribute('y1', cy + uy * r0);
      l.setAttribute('x2', tx - ux * r1); l.setAttribute('y2', ty - uy * r1);
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', tx - ux * r1); c.setAttribute('cy', ty - uy * r1); c.setAttribute('r', 3.5);
      g.append(l, c); svg.appendChild(g);
    });
  }
  FX.layoutLinks = layoutLinks;
  FX.markLinks = ids => {
    const svg = $('#links'); if (!svg) return;
    svg.querySelectorAll('g').forEach(g => g.classList.toggle('is-open', ids.includes(g.dataset.app)));
  };
  document.addEventListener('pointerover', e => {
    const ic = e.target.closest('.icon'), svg = $('#links'); if (!svg) return;
    svg.querySelectorAll('g.is-hover').forEach(g => g.classList.remove('is-hover'));
    if (ic) { const g = svg.querySelector(`g[data-app="${ic.dataset.app}"]`); if (g) g.classList.add('is-hover'); }
  });
  document.addEventListener('focusin', e => {
    const ic = e.target.closest && e.target.closest('.icon'), svg = $('#links'); if (!svg) return;
    svg.querySelectorAll('g.is-hover').forEach(g => g.classList.remove('is-hover'));
    if (ic) { const g = svg.querySelector(`g[data-app="${ic.dataset.app}"]`); if (g) g.classList.add('is-hover'); }
  });
  document.addEventListener('aos:live', () => { setTimeout(layoutLinks, 1900); });

  /* ---------- reticle cursor ---------- */
  if (fine && !reduce) {
    const r = $('#reticle');
    let tx = -100, ty = -100, x = -100, y = -100, raf = 0;
    const loop = () => {
      x += (tx - x) * .24; y += (ty - y) * .24;
      r.style.transform = `translate(${x}px, ${y}px)`;
      raf = (Math.abs(tx - x) > .3 || Math.abs(ty - y) > .3) ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      r.classList.add('is-on');
      r.classList.toggle('is-hot', !!e.target.closest('button, a, input, .icon, .mod, .slot, .onode, canvas'));
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    addEventListener('pointerdown', () => r.classList.add('is-down'));
    addEventListener('pointerup', () => r.classList.remove('is-down'));
    document.documentElement.addEventListener('mouseleave', () => r.classList.remove('is-on'));
  }

  /* ---------- 3D skill constellation (drag to rotate) ---------- */
  FX.constellation = (canvas, items, opts = {}) => {
    const ctx = canvas.getContext('2d');
    const n = items.length;
    const pts = items.map((it, i) => {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
      return { it, x: Math.cos(th) * r, y, z: Math.sin(th) * r, px: 0, py: 0, s: 1, z2: 0 };
    });
    const edges = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y, pts[i].z - pts[j].z);
      if (d < .95) edges.push([i, j]);
    }
    let w = 0, h = 0, ax = .35, ay = 0, spin = .006, dragging = false, lx = 0, ly = 0, hover = -1, alive = true, raf = 0, mx = -1, my = -1;
    const resize = () => {
      const dpr = dprNow(); w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onDown = e => { dragging = true; lx = e.clientX; ly = e.clientY; try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } };
    const onMove = e => {
      const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
      if (dragging) { spin = (e.clientX - lx) * .0065; ay += (e.clientX - lx) * .0065; ax = Math.max(-1.1, Math.min(1.1, ax + (e.clientY - ly) * .005)); lx = e.clientX; ly = e.clientY; }
    };
    const onUp = () => { dragging = false; };
    const onLeave = () => { mx = my = -1; };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    canvas.addEventListener('pointerleave', onLeave);
    addEventListener('resize', resize);
    resize();

    const draw = t => {
      if (!alive) return;
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      if (!dragging) { ay += spin; spin += (.006 - spin) * .03; }
      if (reduce) { spin = 0; }
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * .4, cx = w / 2, cy = h / 2, XS = Math.min(2.1, w / h * .8);
      const ca = Math.cos(ay), sa = Math.sin(ay), cb = Math.cos(ax), sb = Math.sin(ax);
      for (const p of pts) {
        const x1 = p.x * ca + p.z * sa, z1 = -p.x * sa + p.z * ca;
        const y1 = p.y * cb - z1 * sb, z2 = p.y * sb + z1 * cb;
        p.s = 2.6 / (2.6 - z2); p.z2 = z2; p.px = cx + x1 * R * p.s * XS; p.py = cy + y1 * R * p.s;
      }
      // edges
      ctx.lineWidth = 1;
      for (const [i, j] of edges) {
        const a = pts[i], b = pts[j], depth = (a.z2 + b.z2) / 2;
        ctx.strokeStyle = `rgba(${PLUM},${.06 + (depth + 1) * .09})`;
        ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke();
      }
      // hover
      let best = -1, bd = 18 * 18;
      if (mx >= 0) pts.forEach((p, i) => { const d = (p.px - mx) ** 2 + (p.py - my) ** 2; if (d < bd) { bd = d; best = i; } });
      if (best !== hover) { hover = best; if (opts.onHover) opts.onHover(best >= 0 ? pts[best].it : null); }
      canvas.style.cursor = best >= 0 ? 'pointer' : (dragging ? 'grabbing' : 'grab');
      // nodes, back to front
      const order = pts.map((p, i) => i).sort((a, b) => pts[a].z2 - pts[b].z2);
      ctx.textBaseline = 'middle';
      for (const i of order) {
        const p = pts[i], st = p.it.state, rad = 4.2 * p.s * (i === hover ? 1.5 : 1), depth = (p.z2 + 1) / 2;
        const alpha = .35 + depth * .65;
        const stroke = p.it.name === 'Cloud' ? ROSE : PLUM;
        ctx.lineWidth = 1.5;
        if (st === 'installed' || st === 'active') {
          ctx.fillStyle = `rgba(${st === 'active' ? DEEP : PLUM},${alpha})`;
          ctx.beginPath(); ctx.arc(p.px, p.py, rad, 0, 6.283); ctx.fill();
        } else if (st === 'exploring') {
          const pulse = (Math.sin(t / 380 + i) + 1) / 2;
          ctx.strokeStyle = `rgba(${PLUM},${alpha * (.35 + pulse * .4)})`;
          ctx.beginPath(); ctx.arc(p.px, p.py, rad + 3 + pulse * 4, 0, 6.283); ctx.stroke();
          ctx.fillStyle = `rgba(210,229,247,${alpha})`; ctx.strokeStyle = `rgba(${PLUM},${alpha})`;
          ctx.beginPath(); ctx.arc(p.px, p.py, rad, 0, 6.283); ctx.fill(); ctx.stroke();
        } else {
          ctx.setLineDash([2.5, 2.5]); ctx.strokeStyle = `rgba(${stroke},${alpha})`;
          ctx.beginPath(); ctx.arc(p.px, p.py, rad, 0, 6.283); ctx.stroke(); ctx.setLineDash([]);
        }
        if (depth > .3 || i === hover) {
          const big = i === hover;
          ctx.font = `${big ? 500 : 400} ${Math.round(10 + p.s * 1.6)}px "DM Mono", ui-monospace, monospace`;
          ctx.fillStyle = `rgba(${DEEP},${big ? 1 : Math.min(1, depth * 1.05)})`;
          ctx.fillText(p.it.name, p.px + rad + 6, p.py);
        }
      }
    };
    raf = requestAnimationFrame(draw);
    return {
      destroy() {
        alive = false; cancelAnimationFrame(raf);
        removeEventListener('resize', resize);
        canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointercancel', onUp); canvas.removeEventListener('pointerleave', onLeave);
      }
    };
  };

  /* ---------- main loop ---------- */
  function resizeAll() { sizeParticles(); sizeViz(); visitor(); }
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resizeAll(); layoutLinks(); }, 150); });
  resizeAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sizeViz);
  setTimeout(sizeViz, 400);

  if (reduce) { drawParticles(); drawViz(0); }
  else {
    let last = 0;
    const frame = t => {
      requestAnimationFrame(frame);
      if (document.hidden || t - last < 27) return;
      last = t;
      drawParticles(); drawViz(t); drawScope(t);
    };
    requestAnimationFrame(frame);
  }
})();
