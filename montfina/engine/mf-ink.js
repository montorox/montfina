/* Montfina ink look: dark ink outlines on every place and prop, a ball-head cast with stick legs,
   hand lettering and a film finish (grade, vignette, grain). Loaded after mi-art.js and mi-rig.js, before the places.
   Every frame is still a pure function of time. */
(function () {
  const INK = MI.INK = { col: '#1b1a24', w: 3.4, on: true };
  const { shade } = MI.draw;

  /* ---------- auto ink: any opaque fill on a plate or on the frame gets an outline ---------- */
  const opaque = g => g.globalAlpha === 1 && g.globalCompositeOperation === 'source-over' && typeof g.fillStyle === 'string' && g.fillStyle[0] === '#';
  MI.inkify = g => {
    if (!g || g._inked) return g; g._inked = true;
    const fr = g.fillRect.bind(g), fl = g.fill.bind(g), st = g.stroke.bind(g), sr = g.strokeRect.bind(g);
    const pen = () => { g.save(); g.setLineDash([]); g.strokeStyle = g._inkCol || INK.col; g.lineWidth = (g._inkW || INK.w); g.lineJoin = 'round'; g.lineCap = 'round'; g.shadowColor = 'transparent'; };
    g.fillRect = (x, y, w, h) => { fr(x, y, w, h); if (!INK.on || g._noInk || !opaque(g)) return; const aw = Math.abs(w), ah = Math.abs(h); if (aw < 12 || ah < 12 || aw >= 1900 || ah >= 1060) return; pen(); sr(x, y, w, h); g.restore(); };
    g.fill = (...a) => { fl(...a); if (!INK.on || g._noInk || !opaque(g)) return; pen(); a[0] instanceof Path2D ? st(a[0]) : st(); g.restore(); };
    return g;
  };
  /* skip outlines for the drawing inside fn: MI.noInk(() => {...}) */
  MI.noInk = fn => { const g = MI.ctx, was = g._noInk; g._noInk = true; try { return fn(); } finally { g._noInk = was; } };

  /* places get outlines as they are drawn */
  const place0 = MI.place;
  MI.place = (fn, extra) => place0(g => fn(MI.inkify(g)), extra);

  /* ---------- hand lettering ---------- */
  MI.FONT = '"Patrick Hand", "Kalam", sans-serif';

  /* ---------- the cast: ball heads, dot eyes, a small torso, stick legs, all inked ---------- */
  const canvas = MI.draw.canvas, W = 800, H = 1000, CX = 400, HY = 250, HR = 205, LW = 15;
  const hex = c => c[0] === '#' ? [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)] : c.match(/[\d.]+/g).slice(0, 3).map(Number);
  const ink = (c, w = LW) => { c.strokeStyle = INK.col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'; c.stroke(); };
  const fillInk = (c, col, w = LW) => { c.fillStyle = col; c.fill(); ink(c, w); };
  const EXPR = {
    neutral: {}, smile: { mouth: 'smile' }, happy: { mouth: 'grin', eye: 'arc' },
    shocked: { eye: 'big', mouth: 'o', brow: -26 }, worried: { brow: -14, tilt: -.3, mouth: 'wavy' },
    angry: { brow: 6, tilt: .4, mouth: 'frown' }, sad: { brow: -8, tilt: -.38, mouth: 'frown' },
    disgust: { brow: 0, tilt: .22, mouth: 'wavy', eye: 'half' }, terrified: { eye: 'big', brow: -30, tilt: -.3, mouth: 'wide' }, sleepy: { eye: 'half', mouth: 'line' },
  };
  function hair(c, s, back) {
    const h = s.hair, st = s.hairStyle;
    if (back) {
      if (st === 'bob') { c.beginPath(); c.moveTo(CX - HR - 22, HY + 40); c.bezierCurveTo(CX - HR - 40, HY - 320, CX + HR + 40, HY - 320, CX + HR + 22, HY + 40); c.lineTo(CX + HR + 12, HY + 150); c.quadraticCurveTo(CX, HY + 175, CX - HR - 12, HY + 150); c.closePath(); fillInk(c, h); }
      if (st === 'long') { c.beginPath(); c.moveTo(CX - HR - 16, HY); c.bezierCurveTo(CX - HR - 30, HY - 300, CX + HR + 30, HY - 300, CX + HR + 16, HY); c.lineTo(CX + HR + 26, HY + 250); c.quadraticCurveTo(CX, HY + 290, CX - HR - 26, HY + 250); c.closePath(); fillInk(c, h); }
      if (st === 'bun') { c.beginPath(); c.arc(CX, HY - HR - 30, 72, 0, 7); fillInk(c, h); }
      return;
    }
    if (st === 'bald') { [-1, 1].forEach(d => { c.beginPath(); c.ellipse(CX + d * (HR - 18), HY - 10, 40, 70, d * .2, 0, 7); fillInk(c, h); }); return; }
    c.beginPath();
    if (st === 'short') { c.moveTo(CX - HR + 6, HY - 30); c.bezierCurveTo(CX - HR + 2, HY - HR - 80, CX + HR - 2, HY - HR - 80, CX + HR - 6, HY - 30); c.bezierCurveTo(CX + HR - 50, HY - 100, CX + 40, HY - 120, CX - 30, HY - 110); c.bezierCurveTo(CX - 120, HY - 100, CX - HR + 40, HY - 90, CX - HR + 6, HY - 30); }
    else if (st === 'spiky') { c.moveTo(CX - HR + 4, HY - 40); for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI, r = HR + (i % 2 ? 50 : 6); c.lineTo(CX + Math.cos(a) * r, HY - 20 + Math.sin(a) * r); } c.lineTo(CX + HR - 4, HY - 40); c.quadraticCurveTo(CX, HY - 120, CX - HR + 4, HY - 40); }
    else { c.moveTo(CX - HR + 2, HY + 10); c.bezierCurveTo(CX - HR - 6, HY - HR - 100, CX + HR + 6, HY - HR - 100, CX + HR - 2, HY + 10); c.bezierCurveTo(CX + HR - 30, HY - 60, CX + 80, HY - 100, CX + 40, HY - 150); c.bezierCurveTo(CX, HY - 90, CX - 130, HY - 80, CX - HR + 2, HY + 10); }
    c.closePath(); fillInk(c, h);
  }
  function face(c, s, name, side = 0) {
    const e = EXPR[name] || EXPR.neutral, ex = 62, ey = HY + 10, cx = CX + side * 70, k = side ? .7 : 1;
    c.fillStyle = INK.col;
    const eyes = side ? [cx + 40] : [cx - ex, cx + ex];
    eyes.forEach(x => {
      if (e.eye === 'big') { c.beginPath(); c.arc(x, ey, 30, 0, 7); c.fillStyle = '#fff'; c.fill(); ink(c, 8); c.fillStyle = INK.col; c.beginPath(); c.arc(x, ey + 4, 12, 0, 7); c.fill(); }
      else if (e.eye === 'half') { c.beginPath(); c.moveTo(x - 20, ey + 2); c.lineTo(x + 20, ey + 2); ink(c, 10); }
      else if (e.eye === 'arc') { c.beginPath(); c.arc(x, ey + 10, 18, Math.PI * 1.1, Math.PI * 1.9); ink(c, 10); }
      else { c.beginPath(); c.arc(x, ey, 15, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x + 5, ey - 5, 4.5, 0, 7); c.fill(); c.fillStyle = INK.col; }
    });
    if (s.glasses) { c.strokeStyle = INK.col; c.lineWidth = 7; eyes.forEach(x => { c.beginPath(); c.arc(x, ey, 40, 0, 7); c.stroke(); }); if (!side) { c.beginPath(); c.moveTo(cx - 22, ey - 4); c.lineTo(cx + 22, ey - 4); c.stroke(); } }
    if (e.brow !== undefined) { const by = ey - 52 + e.brow, t = (e.tilt || 0) * 40; eyes.forEach((x, i) => { const sg = side ? 1 : (i ? -1 : 1); c.beginPath(); c.moveTo(x - 24, by - t * .5 * sg); c.lineTo(x + 24, by + t * .5 * sg); ink(c, 9); }); }
    if (s.blush !== false) { c.fillStyle = 'rgba(232,120,120,.28)'; (side ? [cx + 30] : [cx - 100, cx + 100]).forEach(x => { c.beginPath(); c.ellipse(x, ey + 48, 26, 13, 0, 0, 7); c.fill(); }); }
    const my = HY + 92, mx = cx + side * 10, m = e.mouth || 'line', w = 24 * k;
    c.beginPath();
    if (m === 'line') { c.moveTo(mx - w, my); c.quadraticCurveTo(mx, my + 6, mx + w, my); ink(c, 8); }
    if (m === 'smile') { c.moveTo(mx - w - 6, my - 6); c.quadraticCurveTo(mx, my + 24, mx + w + 6, my - 6); ink(c, 8); }
    if (m === 'frown') { c.moveTo(mx - w, my + 10); c.quadraticCurveTo(mx, my - 14, mx + w, my + 10); ink(c, 8); }
    if (m === 'wavy') { c.moveTo(mx - w - 6, my + 2); c.quadraticCurveTo(mx - 12, my - 10, mx, my + 2); c.quadraticCurveTo(mx + 12, my + 12, mx + w + 6, my - 2); ink(c, 8); }
    if (m === 'o') { c.ellipse(mx, my + 6, 18, 24, 0, 0, 7); c.fillStyle = '#5a2228'; c.fill(); ink(c, 7); }
    if (m === 'wide') { c.roundRect(mx - 40, my - 12, 80, 38, 16); c.fillStyle = '#5a2228'; c.fill(); ink(c, 7); }
    if (m === 'grin') { c.moveTo(mx - 40, my - 8); c.quadraticCurveTo(mx, my - 2, mx + 40, my - 8); c.quadraticCurveTo(mx, my + 44, mx - 40, my - 8); c.fillStyle = '#5a2228'; c.fill(); ink(c, 7); }
    if (s.beard) { c.beginPath(); c.moveTo(cx - HR + 30, HY + 50); c.bezierCurveTo(cx - 140, HY + 230, cx + 140, HY + 230, cx + HR - 30, HY + 50); c.bezierCurveTo(cx + 100, HY + 110, cx + 40, HY + 70, cx, HY + 72); c.bezierCurveTo(cx - 40, HY + 70, cx - 100, HY + 110, cx - HR + 30, HY + 50); c.closePath(); fillInk(c, s.hair, 10); c.beginPath(); c.moveTo(mx - 20, my + 8); c.quadraticCurveTo(mx, my + 16, mx + 20, my + 8); ink(c, 7); }
  }
  function head(c, s, name, side = 0) {
    hair(c, s, true);
    c.beginPath(); c.arc(CX, HY, HR, 0, 7); c.fillStyle = s.skin; c.fill();
    /* soft shading inside the outline: the light comes from the top left */
    c.save(); c.clip(); const g = c.createRadialGradient(CX - 70, HY - 80, 30, CX, HY, HR * 1.05); g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(.7, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(40,20,40,.14)'); c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore();
    c.beginPath(); c.arc(CX, HY, HR, 0, 7); ink(c);
    hair(c, s, false); face(c, s, name, side);
    if (s.hat) { c.beginPath(); c.roundRect(CX - HR + 10, HY - HR - 20, 2 * HR - 20, 110, [60, 60, 6, 6]); fillInk(c, s.hat); c.beginPath(); c.roundRect(CX - HR - 30 + side * 40, HY - HR + 70, 2 * HR + 60, 30, 14); fillInk(c, shade(s.hat, .8)); }
  }
  function body(c, s, side = 0) {
    const top = s.top, y0 = 438, y1 = 724, w0 = side ? 88 : 104, w1 = side ? 96 : 116;
    c.beginPath(); c.moveTo(CX - w0, y0 + 30); c.quadraticCurveTo(CX - w0, y0, CX - w0 + 40, y0); c.lineTo(CX + w0 - 40, y0); c.quadraticCurveTo(CX + w0, y0, CX + w0, y0 + 30); c.lineTo(CX + w1, y1); c.lineTo(CX - w1, y1); c.closePath(); fillInk(c, top);
    c.save(); c.clip(); c.fillStyle = 'rgba(30,20,40,.13)'; c.fillRect(CX + (side ? 30 : 46), y0, 200, y1 - y0); c.restore();
    if (s.vest) { c.beginPath(); c.moveTo(CX - w0 + 6, y0 + 10); c.lineTo(CX - 40, y0 + 4); c.lineTo(CX, y0 + 120); c.lineTo(CX + 40, y0 + 4); c.lineTo(CX + w0 - 6, y0 + 10); c.lineTo(CX + w1 - 4, y1); c.lineTo(CX - w1 + 4, y1); c.closePath(); fillInk(c, s.vest, 10); }
    if (s.collar !== false && !side) { [[-1], [1]].forEach(([d]) => { c.beginPath(); c.moveTo(CX + d * 44, y0 + 2); c.lineTo(CX, y0 + 50); c.lineTo(CX + d * 22, y0 + 76); c.lineTo(CX + d * 62, y0 + 18); c.closePath(); fillInk(c, s.collar || '#fff', 8); }); }
    if (s.tie && !side) { c.beginPath(); c.moveTo(CX - 15, y0 + 48); c.lineTo(CX + 15, y0 + 48); c.lineTo(CX + 22, y0 + 160); c.lineTo(CX, y0 + 186); c.lineTo(CX - 22, y0 + 160); c.closePath(); fillInk(c, s.tie, 8); }
    if (s.badge && !side) { c.beginPath(); c.arc(CX + 58, y0 + 80, 15, 0, 7); fillInk(c, s.badge, 6); }
    if (s.hivis) { c.fillStyle = '#e8ff5a'; c.fillRect(CX - w1, y0 + 150, 2 * w1, 22); c.fillRect(CX - w1, y0 + 200, 2 * w1, 22); }
    c.beginPath(); c.roundRect(CX - w1 + 2, y1 - 26, 2 * w1 - 4, 40, [4, 4, 14, 14]); fillInk(c, s.pants, 12);
  }
  function seated(s) {
    const cv = canvas(1100, 1000), c = cv.getContext('2d'), ox = 120;
    c.save(); c.translate(ox, 0);
    c.beginPath(); c.roundRect(80, 700, 280, 34, 12); fillInk(c, s.seat || '#6b5a86'); c.beginPath(); c.moveTo(120, 734); c.lineTo(120, 990); c.moveTo(320, 734); c.lineTo(320, 990); ink(c, 20);
    c.beginPath(); c.moveTo(240, 720); c.lineTo(470, 730); c.lineTo(480, 960); ink(c, 22); c.beginPath(); c.ellipse(500, 968, 40, 18, 0, 0, 7); c.fillStyle = INK.col; c.fill();
    const b = canvas(W, H), bc = b.getContext('2d'); body(bc, s, 1); c.drawImage(b, -160, -20);
    const hd = canvas(W, H), hc = hd.getContext('2d'); head(hc, s, 'neutral', 1); c.drawImage(hd, -140, -10);
    c.beginPath(); c.roundRect(520, 700, 440, 30, 6); fillInk(c, s.desk || '#b98d62'); c.beginPath(); c.roundRect(560, 730, 30, 270, 4); fillInk(c, shade(s.desk || '#b98d62', .8)); c.beginPath(); c.roundRect(880, 730, 30, 270, 4); fillInk(c, shade(s.desk || '#b98d62', .8));
    c.save(); c.translate(820, 690); c.rotate(-.18); c.beginPath(); c.roundRect(0, -200, 22, 202, 8); fillInk(c, '#3a4466'); c.restore(); c.beginPath(); c.roundRect(600, 676, 240, 24, 8); fillInk(c, '#4a5680');
    c.beginPath(); c.moveTo(300, 500); c.lineTo(420, 620); c.lineTo(640, 650); c.strokeStyle = INK.col; c.lineWidth = 34 + 2 * 10; c.lineCap = 'round'; c.stroke(); c.strokeStyle = s.top; c.lineWidth = 34; c.stroke();
    c.beginPath(); c.arc(660, 652, 26, 0, 7); fillInk(c, s.skin, 10);
    c.restore(); return cv;
  }
  MI.inkRig = spec => {
    const heads = {}; for (const n of Object.keys(EXPR)) { const cv = canvas(W, H); head(cv.getContext('2d'), spec, n); heads[n] = cv; }
    const bd = canvas(W, H); body(bd.getContext('2d'), spec);
    const sb = canvas(W, H), sh = canvas(W, H); body(sb.getContext('2d'), spec, 1); head(sh.getContext('2d'), spec, 'neutral', 1);
    return {
      kind: 'code', ink: 10, H, cx: CX, seed: spec.seed || 3, heads, body: bd, neck: { x: CX, y: 452 },
      socketL: { x: CX - 92, y: 478 }, socketR: { x: CX + 92, y: 478 }, L1: 112, L2: 104, armW: 34, handR: 24, cuff: .92,
      eyes: [{ x: CX - 62 - 20, y: HY + 10 - 20, w: 40, h: 40 }, { x: CX + 62 - 20, y: HY + 10 - 20, w: 40, h: 40 }],
      mouth: { x: CX, y: HY + 96, w: 26, h: 22, color: '#5a2228' }, skin: hex(spec.skin), sleeve: hex(spec.top), lash: INK.col,
      legs: { stick: true, hipY: 724, len: 240, w: 22, gap: 50, color: hex(INK.col), shoe: hex(spec.shoes || INK.col), shoeH: 26, shoeW: 74 },
      side: { body: sb, head: sh, neck: { x: CX, y: 452 }, socket: { x: CX - 10, y: 480 } },
      sprites: { typing: seated(spec) }, spriteH: { typing: 1000 },
    };
  };
  MI.codeRig = MI.inkRig;

  /* the actor draws its own outlines; nothing it fills is auto-inked */
  const actor0 = MI.actor;
  MI.actor = (rig, o) => { const g = MI.ctx, was = g._noInk; g._noInk = true; try { return actor0(rig, o); } finally { g._noInk = was; } };

  /* ---------- film finish: one pass over the whole frame ---------- */
  let grain = null;
  const grainTile = () => { if (grain) return grain; const c = canvas(256, 256), g = c.getContext('2d'), d = g.createImageData(256, 256); for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (MI.hash(i * .37 + 1) - .5) * 160; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; } g.putImageData(d, 0, 0); return grain = c; };
  MI.FINISH = { vignette: .42, grain: .07, warmth: .05, grainFps: 0 };   /* grainFps 0 = a still paper grain. Moving grain looks filmic but multiplies the file size about 5 times */
  MI.finish = (ctx, t) => {
    const F = MI.FINISH; if (!F || MI._dry) return; ctx.save(); ctx._noInk = true;
    if (F.warmth) { ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = F.warmth * 4; ctx.fillStyle = '#ffb36b'; ctx.fillRect(0, 0, 1920, 1080); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; }
    if (F.vignette) { const v = ctx.createRadialGradient(960, 540, 420, 960, 560, 1180); v.addColorStop(0, 'rgba(10,8,20,0)'); v.addColorStop(1, `rgba(10,8,20,${F.vignette})`); ctx.fillStyle = v; ctx.fillRect(0, 0, 1920, 1080); }
    if (F.grain) { const k = F.grainFps ? Math.floor(t * F.grainFps) : 0, ox = Math.floor(MI.hash(k) * 256), oy = Math.floor(MI.hash(k + 9) * 256); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = F.grain; ctx.translate(-ox, -oy); ctx.fillStyle = ctx.createPattern(grainTile(), 'repeat'); ctx.fillRect(0, 0, 1920 + 256, 1080 + 256); }
    ctx._noInk = false; ctx.restore();
  };
})();
