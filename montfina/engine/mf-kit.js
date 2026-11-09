/* Montfina kit: the pieces a money-and-news explainer needs. All of it inked, all of it moving.
   K.words, K.stamp, K.clock, K.badge, K.label, K.chapter, K.ticker, K.chart, K.bars, K.post, K.doc, K.usmap, K.world, K.glow, K.critter, MI.panels */
(function () {
  const { rr, el, poly, shade } = MI.draw, K = MI.K, { clamp, lerp, inout, outc, pop, spring, hash } = MI;
  const INK = () => MI.INK.col;
  const font = (s, bold) => (bold ? '700 ' : '') + `${s}px ${bold ? 'Kalam, ' : ''}${MI.FONT}`;
  const appear = st => { const d = MI.now - st; return d < 0 ? 0 : pop(d / .3); };

  /* ---------- K.stamp(x, y, 'Job done', st, {col, rot, size, sub, back, seed}): a rubber ink stamp slammed onto the scene on the word ----------
     Worn ink (specks, scratches, an uneven patch), a double border, a hard landing with a wobble, ink flecks and a thud.
     back: 'paper' (default) a torn paper slip behind it so it reads on any scene; false stamps straight onto the surface (documents, walls, crates). */
  const _stamps = {};
  const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let q = Math.imul(s ^ s >>> 15, 1 | s); q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; };
  const stampArt = (text, sub, col, size, seed) => {
    const key = [text, sub, col, size, seed].join('|'); if (_stamps[key]) return _stamps[key];
    const fam = `700 ${size}px Kalam, ${MI.FONT}`, sfam = `700 ${Math.round(size * .32)}px Kalam, ${MI.FONT}`;
    const cv = document.createElement('canvas'), c = cv.getContext('2d'); c.font = fam; c.letterSpacing = `${size * .04}px`;
    const tw = c.measureText(text).width; c.font = sfam; const sw = sub ? c.measureText(sub).width : 0;
    const w = Math.max(tw, sw) + size * 1.1, h = size * 1.32 + (sub ? size * .46 : 0), P = size * .2, S = 2;
    cv.width = (w + P * 2) * S; cv.height = (h + P * 2) * S; c.scale(S, S); c.translate(P, P);
    c.strokeStyle = c.fillStyle = col; c.lineJoin = 'round';
    c.lineWidth = size * .1; c.beginPath(); c.roundRect(0, 0, w, h, size * .16); c.stroke();
    const i = size * .17; c.lineWidth = size * .035; c.beginPath(); c.roundRect(i, i, w - 2 * i, h - 2 * i, size * .08); c.stroke();
    c.font = fam; c.letterSpacing = `${size * .04}px`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, w / 2, size * .7 + size * .02);
    if (sub) { c.font = sfam; c.letterSpacing = `${size * .03}px`; c.fillText(sub, w / 2, h - size * .44); c.lineWidth = size * .025; c.beginPath(); c.moveTo(i * 1.6, h - size * .7); c.lineTo(w - i * 1.6, h - size * .7); c.stroke(); }
    const r = rng(seed); c.globalCompositeOperation = 'destination-out';
    const n = Math.round(w * h / 70); for (let k = 0; k < n; k++) { c.globalAlpha = .45 + r() * .55; c.beginPath(); c.arc(r() * w, r() * h, .5 + r() * r() * 2.6 * size / 72, 0, 6.283); c.fill(); }
    c.lineCap = 'round'; for (let k = 0; k < 7; k++) { c.globalAlpha = .5 + r() * .4; c.lineWidth = .8 + r() * 1.6; const x0 = r() * w, y0 = r() * h, a = r() * 6.283, L = size * (.3 + r() * .9); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 + Math.cos(a) * L, y0 + Math.sin(a) * L); c.stroke(); }
    c.globalAlpha = 1; const gx = r() * w, gy = r() * h, gr = Math.max(w, h) * (.35 + r() * .25), gd = c.createRadialGradient(gx, gy, 0, gx, gy, gr); gd.addColorStop(0, 'rgba(0,0,0,.42)'); gd.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gd; c.fillRect(-P, -P, w + 2 * P, h + 2 * P);
    return (_stamps[key] = { cv, w, h, P });
  };
  K.stamp = (x, y, text, st, o = {}) => {
    const c = MI.ctx, d = MI.now - st, L = .12; MI.ev('thud', st + L); if (d < 0) return;
    const up = String(text).toUpperCase(), size = o.size || 72, col = o.col || o.color || '#c8352e', rot = o.rot ?? -.1, seed = o.seed ?? [...up].reduce((a, ch) => a * 31 + ch.charCodeAt(0) | 0, 7);
    const A = stampArt(up, o.sub ? String(o.sub).toUpperCase() : '', col, size, seed), w = A.w, h = A.h;
    const s = d < L ? lerp(1.9, 1, (d / L) * (d / L)) : 1 + .06 * Math.sin((d - L) * 42) * Math.exp(-(d - L) * 13), al = clamp(d / .05);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s); c.globalAlpha = al;
    if (o.back !== false) {
      const bw = w + size * .5, bh = h + size * .42, r = rng(seed + 3), j = () => (r() - .5) * size * .12;
      MI.noInk(() => { c.fillStyle = 'rgba(20,16,30,.22)'; c.beginPath(); c.roundRect(-bw / 2 + 7, -bh / 2 + 9, bw, bh, 6); c.fill(); });
      c.save(); c.rotate(rot * -.25); c.fillStyle = o.paper || '#f7f0df'; c.beginPath(); c.moveTo(-bw / 2 + j(), -bh / 2 + j());
      for (let k = 1; k <= 8; k++) c.lineTo(-bw / 2 + bw * k / 8 + j() * .4, -bh / 2 + j());   /* torn top edge */
      c.lineTo(bw / 2 + j(), bh / 2 + j()); for (let k = 7; k >= 0; k--) c.lineTo(-bw / 2 + bw * k / 8 + j() * .4, bh / 2 + j()); c.closePath(); c.fill(); c.restore();
      c.globalCompositeOperation = 'multiply';
    }
    c.globalAlpha = al * (o.alpha ?? .94); c.drawImage(A.cv, -w / 2 - A.P, -h / 2 - A.P, w + 2 * A.P, h + 2 * A.P); c.restore();
    if (d > L && d < L + .35) {   /* ink flecks thrown off the landing */
      const r = rng(seed + 9), p = (d - L) / .35; MI.noInk(() => { c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col;
        for (let k = 0; k < 12; k++) { const a = r() * 6.283, R0 = Math.hypot(w, h) * .5, R = R0 + (20 + r() * 70) * outc(p); c.globalAlpha = (1 - p) * .8; c.beginPath(); c.arc(Math.cos(a) * R * w / Math.hypot(w, h) * 1.1, Math.sin(a) * R * h / Math.hypot(w, h) * 1.6, 2 + r() * 4, 0, 6.283); c.fill(); } c.restore(); });
    }
    MI.regRect('text', x - w / 2, y - h / 2, w, h, up);
  };
  MI.stamp = (x, y, text, st, o = {}) => K.stamp(x, y, text, st, o);   /* the MontInfo name draws the Montfina stamp */

  /* ---------- K.words(g, 'exact narrated words', {size, color, y}): the line appears word by word as it is said, on the 'black' place ---------- */
  K.words = (g, phrase, o = {}) => {
    const c = MI.ctx, toks = phrase.split(/\s+/), t0 = g.a(toks.slice(0, Math.min(3, toks.length)).join(' ')) + .08;
    let j = MI.words.findIndex(w => Math.abs(w.s - t0) < .002); if (j < 0) j = MI.words.findIndex(w => w.s >= t0 - .01);
    const size = o.size || 76; c.save(); c.font = font(size); const sp = c.measureText(' ').width, maxW = o.w || 1300;
    const lines = [[]]; let lw = 0; toks.forEach(w => { const ww = c.measureText(w).width; if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push({ w, ww }); lw += ww + sp; });
    const lh = size * 1.25, y0 = (o.y || 540) - (lines.length - 1) * lh / 2 + size * .3; let k = 0;
    lines.forEach((ln, li) => { const tw = ln.reduce((a, b) => a + b.ww + sp, -sp); let x = 960 - tw / 2;
      ln.forEach(({ w, ww }) => { const wd = MI.words[j + k] || MI.words[MI.words.length - 1], st = wd.s - .04; k++;
        MI.type(w, x, y0 + li * lh, { size: size / (MI.FONTK || 1.12), color: o.color || '#f4efe6', start: st, cps: 400, caps: false, sound: false, weight: 400 }); x += ww + sp; }); });
    c.restore();
  };

  /* ---------- K.clock(x, y, '3:06 PM ET', st, {r}): a ticking wall clock with its time on a chip ---------- */
  K.clock = (x, y, label, st, o = {}) => {
    const c = MI.ctx, e = appear(st); if (!e) return; MI.ev('pop', st); const r = o.r || 46, t = MI.now;
    c.save(); c.translate(x, y); c.scale(e, e); el(c, 0, 0, r, r, '#f6f1e6'); c.strokeStyle = INK(); c.lineWidth = 3; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.beginPath(); c.moveTo(Math.cos(a) * r * .78, Math.sin(a) * r * .78); c.lineTo(Math.cos(a) * r * .9, Math.sin(a) * r * .9); c.stroke(); }
    const [hh, mm] = (label.match(/(\d+):(\d+)/) || [0, 3, 0]).slice(1).map(Number), sweep = (t - st) * .9;
    c.lineCap = 'round'; c.lineWidth = 6; c.beginPath(); c.moveTo(0, 0); const ha = ((hh % 12) + mm / 60) / 12 * 6.283 - 1.5708; c.lineTo(Math.cos(ha) * r * .45, Math.sin(ha) * r * .45); c.stroke();
    c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); const ma = mm / 60 * 6.283 - 1.5708 + sweep * .05; c.lineTo(Math.cos(ma) * r * .7, Math.sin(ma) * r * .7); c.stroke();
    c.strokeStyle = '#d23b33'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); const sa = sweep * 6.283 / 6; c.lineTo(Math.cos(sa) * r * .8, Math.sin(sa) * r * .8); c.stroke(); c.restore();
    if (label) { c.save(); c.font = font(30); const w = c.measureText(label).width + 30; c.restore(); rr(c, x - w / 2, y + r + 12, w, 42, 8, o.bg || '#d23b33'); MI.type(label, x, y + r + 44, { size: 27, align: 'center', color: '#fff', start: st + .15, cps: 60, sound: false }); }
  };

  /* ---------- K.badge(x, y, 'Thursday', st, {col}): a coloured day chip ---------- */
  K.badge = (x, y, text, st, o = {}) => { const c = MI.ctx, e = appear(st); if (!e) return; MI.ev('pop', st); c.save(); c.font = font(o.size || 34); const w = c.measureText(text.toUpperCase()).width + 40; c.restore(); c.save(); c.translate(x, y); c.rotate(o.rot ?? -.03); c.scale(e, e); rr(c, 0, -30, w, 56, 6, o.col || '#d23b33'); c.restore(); MI.type(text, x + 20, y + 12, { size: (o.size || 34) / 1.12, color: '#fff', start: st + .05, cps: 50, sound: false }); };

  /* ---------- K.label(x, y, 'Nasdaq', st, {rot, col, bg, size, line:[x2,y2]}): a hand-written paper tag, optionally on a string to a thing ---------- */
  K.label = (x, y, text, st, o = {}) => {
    const c = MI.ctx, e = appear(st); if (!e) return; MI.ev('paper', st); const size = o.size || 34; c.save(); c.font = font(size * 1.12); const w = c.measureText(text.toUpperCase()).width + size, h = size * 1.6; c.restore();
    if (o.line) { c.save(); c.strokeStyle = INK(); c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(o.line[0], o.line[1]); c.stroke(); el(c, o.line[0], o.line[1], 6, 6, INK()); c.restore(); MI.regLine(x, y, o.line[0], o.line[1], text); }
    c.save(); c.translate(x, y); c.rotate(o.rot ?? -.04); c.scale(e, e); rr(c, -w / 2, -h / 2, w, h, 5, o.bg || '#f6f1e2'); c.restore();
    MI.type(text, x, y + size * .36, { size, align: 'center', color: o.col || INK(), start: st + .08, cps: 40 });
  };

  /* ---------- K.chapter(n, 'Crack 4', 'The Plug', st): a big hand-written chapter title with a number that draws itself ---------- */
  K.chapter = (n, title, sub, st, o = {}) => {
    const c = MI.ctx, d = MI.now - st; if (d < 0) return; MI.ev('whoosh', st, { keep: true }); const ctr = !!o.center, x = o.x ?? (ctr ? 960 : 90), y = o.y ?? (ctr ? 600 : 130), col = o.col || '#f4efe6', ts = o.size || (ctr ? 170 : 96);
    c.save(); c.font = font(ts, true); c.fillStyle = col; c.textAlign = ctr ? 'center' : 'left'; c.globalAlpha = clamp(d / .25); c.translate(ctr ? 0 : lerp(-40, 0, outc(d / .4)), ctr ? lerp(30, 0, outc(d / .4)) : 0); c.fillText(title.toUpperCase(), x, y);
    if (sub) { c.font = font(Math.round(ts * .5)); c.globalAlpha *= .85; c.fillText(sub.toUpperCase(), ctr ? x : x + 6, y + ts * .78); } c.restore();
    if (n !== null && n !== undefined) { const cx = o.nx ?? (ctr ? 960 : 1720), cy = o.ny ?? (ctr ? 330 : 150), p = clamp((d - .2) / .6); c.save(); c.strokeStyle = o.ring || '#7ee05a'; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.arc(cx, cy, 62, -1.57, -1.57 + p * 6.283); c.stroke(); c.restore(); MI.type(String(n), cx, cy + 30, { size: 80, align: 'center', color: o.ring || '#7ee05a', start: st + .5, cps: 10, sound: false }); }
  };

  /* ---------- K.ticker(y, {items, speed, h}): a scrolling stock ticker band ---------- */
  const TICK = ['KITE', 'HALO', 'GRID', 'IRON', 'FLUX', 'NOVA', 'ZINC', 'MOSS', 'OPAL', 'BOLT', 'CRUX', 'JOLT', 'YARD', 'EDGE', 'LUME', 'QUAY', 'RIFT', 'SAGE', 'TERN', 'XENO', 'DYNA', 'ACME'];
  K.ticker = (y, o = {}) => {
    const c = MI.ctx, h = o.h || 46, items = o.items || TICK.map((n, i) => [n, (20 + 180 * hash(i + (o.seed || 0))).toFixed(2), (o.down ?? .6) > hash(i * 3 + 1 + (o.seed || 0)) ? -1 : 1]);
    MI.noInk(() => { c.fillStyle = o.bg || '#141016'; c.fillRect(-10, y, 1940, h); });
    c.save(); c.font = font(h * .62); c.textBaseline = 'middle'; let x = -((MI.now * (o.speed || 90)) % 4000);
    for (let r = 0; r < 3 && x < 1940; r++) for (const [n, v, dir] of items) { if (x > 1940) break; c.fillStyle = '#e9e4d6'; c.fillText(n, x, y + h / 2); x += c.measureText(n + ' ').width; c.fillStyle = dir < 0 ? '#ff5a4e' : '#5ee07a'; const s = `${v}${dir < 0 ? '▼' : '▲'}`; c.fillText(s, x, y + h / 2); x += c.measureText(s + '   ').width; }
    c.restore();
  };

  /* ---------- K.chart(x, y, w, h, [values], st, {col, dur, grid, area, label, dot}): a line that draws itself ---------- */
  K.chart = (x, y, w, h, vals, st, o = {}) => {
    const c = MI.ctx, d = MI.now - st; if (d < 0) return; MI.ev('roll', st); const p = inout(d / (o.dur || 1.4)), lo = o.min ?? Math.min(...vals), hi = o.max ?? Math.max(...vals), n = vals.length - 1;
    const P = i => [x + w * i / n, y + h - h * (vals[i] - lo) / ((hi - lo) || 1)];
    if (o.grid !== false) MI.noInk(() => { c.save(); c.strokeStyle = o.gridCol || 'rgba(120,130,160,.25)'; c.lineWidth = 2; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(x, y + h * i / 4); c.lineTo(x + w, y + h * i / 4); c.stroke(); } c.restore(); });
    const upto = p * n, k = Math.floor(upto), f = upto - k, pts = []; for (let i = 0; i <= k; i++) pts.push(P(i)); if (k < n) { const a = P(k), b = P(k + 1); pts.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]); }
    if (o.area) MI.noInk(() => { c.save(); c.globalAlpha = .22; c.fillStyle = o.col || '#5ee07a'; c.beginPath(); c.moveTo(pts[0][0], y + h); pts.forEach(q => c.lineTo(q[0], q[1])); c.lineTo(pts[pts.length - 1][0], y + h); c.fill(); c.restore(); });
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round'; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]));
    c.strokeStyle = INK(); c.lineWidth = (o.lw || 9) + 6; c.stroke(); c.strokeStyle = o.col || '#5ee07a'; c.lineWidth = o.lw || 9; c.stroke(); c.restore();
    const e = pts[pts.length - 1]; if (o.dot !== false) { K.glow(e[0], e[1], 40, o.col || '#5ee07a', .5); el(c, e[0], e[1], 11, 11, o.col || '#5ee07a'); }
    if (o.label) MI.type(o.label, e[0] + 18, e[1] - 18, { size: o.labelSize || 40, color: o.col || '#5ee07a', start: st + (o.dur || 1.4) * .8, cps: 40 });
    return e;
  };

  /* ---------- K.bars(x, y(base), w, h, [values], st, {cols, labels, max, gap}): bars grow one after another ---------- */
  K.bars = (x, y, w, h, vals, st, o = {}) => {
    const c = MI.ctx, n = vals.length, gap = o.gap ?? .28, bw = w / (n + (n - 1) * gap), mx = o.max || Math.max(...vals);
    vals.forEach((v, i) => { const t0 = st + i * (o.stagger ?? .18), d = MI.now - t0; if (d < 0) return; MI.ev('pop', t0); const bh = h * v / mx * spring(d * .9), bx = x + i * bw * (1 + gap);
      rr(c, bx, y - bh, bw, bh, 4, (o.cols || [])[i] || o.col || '#5ee07a'); if (o.labels && o.labels[i]) MI.type(o.labels[i], bx + bw / 2, y + 44, { size: o.labelSize || 30, align: 'center', color: o.labelCol || INK(), start: t0, cps: 60, sound: false });
      if (o.values && o.values[i]) MI.type(o.values[i], bx + bw / 2, y - bh - 16, { size: o.valueSize || 36, align: 'center', color: o.valueCol || INK(), start: t0 + .3, cps: 60, sound: false }); });
  };

  /* ---------- K.post(x, y, w, {name, handle, text}, st): a social post card. The text must be the real post, word for word ---------- */
  K.post = (x, y, w, p, st, o = {}) => {
    const c = MI.ctx, e = appear(st); if (!e) return; MI.ev('pop', st); const h = o.h || w * .5;
    c.save(); c.translate(x + w / 2, y + h / 2); c.scale(e, e); c.translate(-x - w / 2, -y - h / 2);
    MI.noInk(() => rr(c, x + 10, y + 14, w, h, 22, 'rgba(10,10,25,.3)')); rr(c, x, y, w, h, 22, '#fbfaf6');
    el(c, x + 70, y + 72, 40, 40, p.avatar || '#7b8fb5'); MI.noInk(() => { c.font = font(40, true); c.fillStyle = '#fff'; c.textAlign = 'center'; c.fillText((p.name || '?')[0], x + 70, y + 86); c.textAlign = 'left'; });
    c.font = font(40, true); c.fillStyle = INK(); c.fillText(p.name || '', x + 130, y + 68); const nw = c.measureText(p.name || '').width;
    if (p.verified !== false) { el(c, x + 150 + nw, y + 56, 13, 13, '#3b8df0'); }
    c.font = font(30); c.fillStyle = '#8a8c9c'; c.fillText(p.handle || '', x + 130, y + 104); c.restore();
    const f = MI.fit(p.text || '', w - 80, h - 190, { max: o.size || 46, min: 22 }); let ty = y + 170;
    f.lines.forEach((l, i) => { MI.type(l, x + 40, ty + i * f.lh, { size: f.size, start: st + .3 + i * .4, cps: 32, caps: false, color: INK() }); });
  };

  /* ---------- K.doc(x, y, w, h, {title, sub, quote}, st): a document or transcript with one highlighted quote (real words only) ---------- */
  K.doc = (x, y, w, h, d, st, o = {}) => {
    const c = MI.ctx, e = appear(st); if (!e) return; MI.ev('paper', st);
    c.save(); c.translate(x + w / 2, y + h / 2); c.rotate(o.rot ?? -.015); c.scale(e, e); c.translate(-x - w / 2, -y - h / 2);
    MI.noInk(() => rr(c, x + 12, y + 16, w, h, 6, 'rgba(10,10,25,.3)')); rr(c, x, y, w, h, 6, '#f7f3ea'); MI.noInk(() => { c.fillStyle = o.band || '#2c3a63'; c.fillRect(x, y, w, 56); c.font = font(30); c.fillStyle = '#e8ecf6'; c.fillText((d.title || '').toUpperCase(), x + 28, y + 38);
      c.fillStyle = '#d9d3c4'; for (let i = 0; i < 6; i++) c.fillRect(x + 40, y + h - 60 - i * 34, w * (.55 + .35 * hash(i)), 12); }); c.restore();
    if (d.sub) MI.type(d.sub, x + 40, y + 112, { size: 32, start: st + .2, cps: 50, sound: false, color: '#55586a' });
    if (d.quote) { const f = MI.fit(d.quote, w - 100, h * .4, { max: o.size || 46 }); const t1 = st + .5; f.lines.forEach((l, i) => { const ly = y + 190 + i * f.lh, d2 = MI.now - t1 - i * .25; if (d2 > 0) MI.noInk(() => { c.save(); c.globalAlpha = .55; c.fillStyle = '#ffe36b'; c.fillRect(x + 44, ly - f.size, Math.min(1, d2 / .4) * (MI.ctx.font = MI.fontOf(f.size), MI.ctx.measureText(l.toUpperCase()).width + 16), f.size * 1.2); c.restore(); }); MI.type(l, x + 50, ly, { size: f.size, start: t1 + i * .25, cps: 40, caps: false }); }); }
  };

  /* ---------- maps ---------- */
  const G = () => window.MF_GEO || { us: {}, world: {} };
  const centroid = rings => { let a = 0, cx = 0, cy = 0; const r = rings.slice().sort((p, q) => q.length - p.length)[0]; for (let i = 0; i < r.length - 1; i++) { const f = r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; a += f; cx += (r[i][0] + r[i + 1][0]) * f; cy += (r[i][1] + r[i + 1][1]) * f; } return [cx / (3 * a), cy / (3 * a)]; };
  /* K.usmap(x, y, w, {land, states:{Ohio:'#d23b33'}, pins:[['Ohio', st], [[x,y], st]], st, border}) -> point(stateOrXY) in frame space */
  K.usmap = (x, y, w, o = {}) => {
    const c = MI.ctx, k = w / 975, d = MI.now - (o.st ?? -9), e = clamp(d / .4); const P = q => [x + q[0] * k, y + q[1] * k];
    MI.noInk(() => { c.save(); c.globalAlpha = e; c.lineJoin = 'round';
      for (const [n, rings] of Object.entries(G().us)) { c.beginPath(); rings.forEach(r => r.forEach((q, i) => { const [px, py] = P(q); i ? c.lineTo(px, py) : c.moveTo(px, py); })); c.fillStyle = (o.states || {})[n] || o.land || '#efe6cf'; c.fill(); c.strokeStyle = o.border || 'rgba(27,26,36,.45)'; c.lineWidth = 1.6; c.stroke(); }
      c.restore(); });
    const pt = s => typeof s === 'string' ? P(centroid(G().us[s] || [[[0, 0], [1, 0], [0, 1]]])) : P(s);
    (o.pins || []).forEach(([s, st]) => { const dd = MI.now - st; if (dd < 0) return; MI.ev('pop', st); const [px, py] = pt(s), b = pop(dd / .3); c.save(); c.translate(px, py); c.scale(b, b); c.beginPath(); c.moveTo(0, 0); c.bezierCurveTo(-16, -22, -20, -34, -20, -42); c.arc(0, -42, 20, Math.PI, 0); c.bezierCurveTo(20, -34, 16, -22, 0, 0); c.fillStyle = o.pinCol || '#d23b33'; c.fill(); el(c, 0, -42, 7, 7, '#fff'); c.restore(); });
    return pt;
  };
  /* K.world(x, y, w, h, {center:[lon,lat], span (degrees across), land, sea, highlight:{Iran:'#d23b33'}, st}) -> point([lon,lat]) */
  K.world = (x, y, w, h, o = {}) => {
    const c = MI.ctx, [lon0, lat0] = o.center || [10, 30], span = o.span || 120, k = w / span;
    const P = ([lo, la]) => { let dl = lo - lon0; if (dl > 180) dl -= 360; if (dl < -180) dl += 360; return [x + w / 2 + dl * k, y + h / 2 - (la - lat0) * k * 1.15]; };
    MI.noInk(() => { c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); c.fillStyle = o.sea || '#7fb6d9'; c.fillRect(x, y, w, h);
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 2; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(x, y + h * (i + .5) / 9 + Math.sin(MI.now + i) * 3); c.lineTo(x + w, y + h * (i + .5) / 9 + Math.sin(MI.now + i) * 3); c.stroke(); }
      c.lineJoin = 'round';
      for (const [n, rings] of Object.entries(G().world)) { const hl = (o.highlight || {})[n]; c.beginPath(); let vis = false; rings.forEach(r => { let last = null; r.forEach((q, i) => { const p = P(q); if (last && Math.abs(p[0] - last[0]) > w * .6) { c.moveTo(p[0], p[1]); } else if (i) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); last = p; if (p[0] > x - 50 && p[0] < x + w + 50 && p[1] > y - 50 && p[1] < y + h + 50) vis = true; }); c.closePath(); }); if (!vis) continue;
        c.fillStyle = hl || o.land || '#efe6cf'; c.fill(); c.strokeStyle = INK(); c.lineWidth = hl ? 3.4 : 1.8; c.stroke(); }
      c.restore(); });
    return P;
  };

  /* ---------- K.glow(x, y, r, col, a): light that adds, for neon, screens and lamps ---------- */
  K.glow = (x, y, r, col = '#7ee05a', a = .6) => { const c = MI.ctx; MI.noInk(() => { c.save(); c.globalCompositeOperation = 'lighter'; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.globalAlpha = a; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore(); }); };

  /* ---------- K.critter(kind, x, y, s, {expr, pose, say, walk, enter, hop, flip, glow, label}): things with faces and stick limbs ---------- */
  const BODIES = {
    chip: (c, o) => { rr(c, -90, -190, 180, 180, 14, '#2f3b2a'); for (let i = 0; i < 6; i++) { [-1, 1].forEach(s => { c.fillStyle = '#c9b25a'; c.fillRect(s * 90 - (s > 0 ? 0 : 16), -170 + i * 28, 16, 10); }); } rr(c, -66, -166, 132, 132, 8, o.glow === false ? '#5a7a46' : '#9cf26a'); return -100; },
    cloud: c => { el(c, -50, -110, 70, 60, '#f4f6fb'); el(c, 40, -130, 80, 72, '#f4f6fb'); el(c, 0, -80, 110, 50, '#f4f6fb'); return -110; },
    coin: c => { el(c, 0, -110, 100, 100, '#f2c14e'); el(c, 0, -110, 76, 76, '#e6ad2e'); return -110; },
    box: c => { rr(c, -100, -200, 200, 170, 6, '#c9925a'); MI.noInk(() => { c.fillStyle = '#e4b880'; c.fillRect(-20, -200, 40, 170); }); return -120; },
    bill: c => { rr(c, -130, -170, 260, 130, 8, '#8fc48a'); el(c, 0, -105, 40, 40, '#6fa86c'); return -105; },
    battery: c => { rr(c, -70, -230, 140, 210, 16, '#4a5568'); rr(c, -26, -252, 52, 26, 6, '#2d3442'); rr(c, -56, -120, 112, 86, 8, '#7ee05a'); return -170; },
    house: c => { rr(c, -100, -170, 200, 150, 4, '#f0e3c8'); poly(c, [[-124, -164], [0, -270], [124, -164]], '#c4553f'); rr(c, -24, -90, 48, 70, 4, '#6b4a3a'); return -150; },
    piggy: c => { el(c, 0, -110, 120, 90, '#f2a7b8'); el(c, 104, -116, 30, 26, '#e88aa0'); poly(c, [[-50, -190], [-20, -230], [-6, -186]], '#e88aa0'); return -130; },
    barrel: c => { rr(c, -80, -230, 160, 210, 18, '#2b2d3a'); MI.noInk(() => { c.fillStyle = '#4a4d63'; c.fillRect(-80, -170, 160, 14); c.fillRect(-80, -90, 160, 14); }); return -150; },
    bolt: c => { poly(c, [[20, -280], [-70, -120], [-6, -120], [-30, -20], [70, -170], [8, -170]], '#ffd23e'); return -160; },
    building: c => { rr(c, -90, -320, 180, 300, 4, '#8fa3c2'); MI.noInk(() => { c.fillStyle = '#e8f0ff'; for (let r = 0; r < 6; r++) for (let q = 0; q < 3; q++) c.fillRect(-64 + q * 48, -296 + r * 46, 30, 26); }); return -120; },
    server: c => { rr(c, -90, -300, 180, 280, 8, '#1f2638'); MI.noInk(() => { for (let r = 0; r < 7; r++) { c.fillStyle = '#2f3a55'; c.fillRect(-72, -284 + r * 38, 144, 28); c.fillStyle = r % 2 ? '#5ee07a' : '#4fb3ff'; c.fillRect(44, -274 + r * 38, 12, 8); } }); return -200; },
  };
  K.critter = (kind, x, y, s = 1, o = {}) => {
    const c = MI.ctx, t = MI.now; if (o.enter !== undefined && t < o.enter) return; if (o.enter !== undefined) MI.ev('pop', o.enter);
    let walking = false; (o.walk || []).forEach(([a, x0, b, x1]) => { if (t <= a) { if (a === o.walk[0][0]) x = x0; } else if (t >= b) x = x1; else { x = lerp(x0, x1, inout((t - a) / (b - a))); walking = true; } });
    const tr = (v, d) => Array.isArray(v) ? (v.filter(m => m[0] <= t).pop()?.[1] || v[0][1]) : (v || d); const expr = tr(o.expr, 'happy'), pose = tr(o.pose, 'rest');
    const talk = (o.say || []).some(([a, b]) => t >= a && t <= b), e = o.enter !== undefined ? pop((t - o.enter) / .35) : 1;
    const bob = (walking ? Math.abs(Math.sin(t * 9)) * 10 : 0) + (o.hop ? Math.abs(Math.sin(t * 6)) * 30 : Math.sin(t * 2.6 + x) * 2);
    if (MI._dry && MI._cur) (MI._cur.cast = MI._cur.cast || []).push({ x, h: 300 * s });
    c.save(); c.translate(x, y); c.scale(s * e * (o.flip ? -1 : 1), s * e);
    MI.noInk(() => el(c, 0, 4, 80, 12, 'rgba(10,10,30,.2)'));
    const limb = (draw) => { c.strokeStyle = o.edge || 'rgba(244,239,230,.85)'; c.lineWidth = 15; draw(); c.stroke(); c.strokeStyle = INK(); c.lineWidth = 9; draw(); c.stroke(); }; c.lineCap = 'round'; const lp = walking ? Math.sin(t * 9) * 14 : 0;
    limb(() => { c.beginPath(); c.moveTo(-30, -30); c.lineTo(-34 - lp, 0); c.moveTo(30, -30); c.lineTo(34 + lp, 0); }); el(c, -38 - lp, 0, 18, 8, INK()); el(c, 38 + lp, 0, 18, 8, INK());
    c.translate(0, -bob); const fy = (BODIES[kind] || BODIES.box)(c, o);
    if (o.glow) K.glow(0, -110, 220, typeof o.glow === 'string' ? o.glow : '#7ee05a', .45);
    const arms = { rest: [[-120, -40], [120, -40]], up: [[-120, -250], [120, -250]], wave: [[-120, -40], [140, -230 + Math.sin(t * 9) * 20]], point: [[-120, -40], [180, -150]], pointl: [[-180, -150], [120, -40]], shrug: [[-150, -170], [150, -170]], hold: [[-60, -60], [60, -60]], cheer: [[-130, -260], [130, -260]] }[pose] || [[-120, -40], [120, -40]];
    [[-80, fy + 10], [80, fy + 10]].forEach(([sx, sy], i) => { const [hx, hy] = arms[i]; limb(() => { c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2, Math.max(sy, hy) + 10, hx, hy); }); el(c, hx, hy, 14, 14, '#fff'); });
    /* face */
    const ex = 32, ey = fy - 6; MI.noInk(() => {
      if (expr === 'shocked') { [-ex, ex].forEach(d => { el(c, d, ey, 18, 20, '#fff'); c.strokeStyle = INK(); c.lineWidth = 4; c.stroke(); el(c, d, ey + 3, 8, 8, INK()); }); }
      else if (expr === 'sleepy') { c.strokeStyle = INK(); c.lineWidth = 6; [-ex, ex].forEach(d => { c.beginPath(); c.moveTo(d - 12, ey); c.lineTo(d + 12, ey); c.stroke(); }); }
      else [-ex, ex].forEach(d => { el(c, d, ey, 10, 11, INK()); el(c, d + 3, ey - 4, 3, 3, '#fff'); });
      if (expr === 'angry' || expr === 'sad') { c.strokeStyle = INK(); c.lineWidth = 6; [-1, 1].forEach(sg => { c.beginPath(); c.moveTo(sg * ex - 14, ey - 26 + (expr === 'angry' ? -6 * sg * sg : 6) * 1); c.lineTo(sg * ex + 14 * 1, ey - 26 + (expr === 'angry' ? 8 : -6) * (sg > 0 ? -1 : 1) * -1); c.stroke(); }); }
      c.strokeStyle = INK(); c.lineWidth = 6; c.lineCap = 'round'; const my = ey + 34; c.beginPath();
      if (talk) { const op = Math.abs(Math.sin(t * 13)) * 14 + 4; c.ellipse(0, my, 13, op, 0, 0, 7); c.fillStyle = '#5a2228'; c.fill(); c.stroke(); }
      else if (expr === 'happy') { c.arc(0, my - 10, 20, .3, Math.PI - .3); c.stroke(); }
      else if (expr === 'sad' || expr === 'angry') { c.arc(0, my + 14, 18, Math.PI + .4, -.4); c.stroke(); }
      else if (expr === 'shocked') { c.ellipse(0, my + 4, 12, 16, 0, 0, 7); c.fillStyle = '#5a2228'; c.fill(); c.stroke(); }
      else { c.moveTo(-14, my); c.lineTo(14, my); c.stroke(); } });
    c.restore();
    if (o.label) MI.type(o.label, x, y - 300 * s * 1.18 - 10, { size: 30 * Math.max(.8, s), align: 'center', start: o.enter ?? -5, cps: 60, sound: false, color: o.labelCol || INK() });
  };

  /* ---------- MI.panels(g, [{place, at, A:[z,fx,fy], B, world:(g,b)=>{}}], {gap}): split screen, each panel drops in on its words ---------- */
  MI.panels = (g, list, o = {}) => {
    const c = MI.ctx, n = list.length, x0 = MI.COLUMN[0], W = MI.COLUMN[1] - x0, pw = W / n;
    list.forEach((p, i) => {
      const at = p.at ?? g.st, d = MI.now - at; if (d < 0) return; MI.ev('thud', at); const pl = MI.getPlate(p.place); if (!pl) throw new Error('No place named ' + p.place);
      const slide = (1 - spring(d * 1.1)) * -1100, A = p.A || [1.6, .5, .5], B = p.B || A, q = inout((MI.now - at) / Math.max(.5, (g.en - at))), z = lerp(A[0], B[0], q), fx = lerp(A[1], B[1], q), fy = lerp(A[2], B[2], q);
      c.save(); c.beginPath(); c.rect(x0 + i * pw, slide, pw, 1080); c.clip(); c.translate(x0 + i * pw + pw / 2, 540 + slide); c.scale(z, z); c.translate(-fx * 1920, -fy * 1080);
      pl.draw(c); if (pl.blanks && MI.filler && !MI._dry) for (const [k2, b] of Object.entries(pl.blanks)) if (!(p.used || []).includes(k2)) MI.filler(k2, b);
      if (p.world) p.world(g, pl.blanks || {}); c.restore();
      if (i) MI.noInk(() => { c.fillStyle = MI.INK.col; c.fillRect(x0 + i * pw - 4, slide, 8, 1080); });
    });
  };

  /* ---------- sounds that exist in the free mix: map Montfina names onto them ---------- */
  ['paper'].forEach(() => {});
})();
