/* Montfina places: the sets a money-and-news film keeps needing. Inked automatically like every plate.
   Names: black, trading_floor(:red|:green), grid_paper, kitchen(:night), server_aisle, capitol(:night), port(:night),
   diner, map_sea, exec_room(:night), sunset_hills, gold_vault, highway(:night), refinery(:night), gas_station(:night), farm, newsroom */
(function () {
  const { rr, el, poly, shade } = MI.draw, S = MI.set, P = MI.PLACES, h = MI.hash;
  const sky = (c, top, bot, y1 = 1080) => { const g = c.createLinearGradient(0, 0, 0, y1); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, 1920, y1); };
  const clouds = (c, n, col, seed = 1, y = 120) => { for (let i = 0; i < n; i++) { const x = 140 + i * 1700 / n + 80 * h(i + seed), yy = y + 90 * h(i * 3 + seed), s = .7 + .6 * h(i + 7 + seed); el(c, x, yy, 90 * s, 40 * s, col); el(c, x + 60 * s, yy - 26 * s, 70 * s, 46 * s, col); el(c, x - 50 * s, yy - 10 * s, 50 * s, 32 * s, col); } };
  const city = (c, y, col, win, seed = 3, n = 18, maxH = 360) => { for (let i = 0; i < n; i++) { const bw = 70 + 70 * h(i + seed), bh = 120 + maxH * h(i * 5 + seed), bx = i * 1920 / n + 20 * h(i); rr(c, bx, y - bh, bw, bh, 2, col); c.fillStyle = win; for (let r = 0; r < bh / 46 - 1; r++) for (let q = 0; q < bw / 30 - 1; q++) if (h(i * 13 + r * 7 + q + seed) > .45) c.fillRect(bx + 12 + q * 28, y - bh + 16 + r * 44, 13, 18); } };
  const tile = (c, y, a, b, s = 120) => { for (let r = 0; r * s < 1080 - y; r++) for (let q = 0; q < 1920 / s; q++) { c.fillStyle = (r + q) % 2 ? a : b; c.fillRect(q * s, y + r * s, s, s); } };

  /* black: word cards and punchlines */
  P.black = () => MI.place(c => { c.fillStyle = '#0b0a0e'; c.fillRect(0, 0, 1920, 1080); const g = c.createRadialGradient(960, 540, 50, 960, 540, 900); g.addColorStop(0, 'rgba(60,50,70,.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, 1920, 1080); return {}; }, { floorY: 1080 });

  /* trading floor: wall of quote boards, desks, a crowd at the back. red = a crash, green = a rally */
  P.trading_floor = (mood = 'day') => { const R = mood === 'red', Gr = mood === 'green'; return MI.place(c => {
    c.fillStyle = R ? '#3a1418' : Gr ? '#0f2a1c' : '#1c2233'; c.fillRect(0, 0, 1920, 640);
    const board = { x: 520, y: 80, w: 880, h: 360 }; rr(c, board.x - 20, board.y - 20, board.w + 40, board.h + 40, 8, '#0e0d12'); c.fillStyle = R ? '#5a1418' : Gr ? '#11331f' : '#16202e'; c.fillRect(board.x, board.y, board.w, board.h);
    [[60, 110], [1440, 110]].forEach(([x, y], k) => { rr(c, x, y, 420, 300, 6, '#0e0d12'); for (let r = 0; r < 8; r++) { c.fillStyle = h(r + k * 9) > (R ? .25 : .6) ? (R ? '#ff5a4e' : '#ff7a6e') : '#5ee07a'; c.fillRect(x + 24, y + 22 + r * 34, 160 + 120 * h(r * 3 + k), 14); c.fillStyle = '#c9c4b5'; c.fillRect(x + 320, y + 22 + r * 34, 70, 14); } });
    for (let i = 0; i < 26; i++) { const x = 30 + i * 74, y = 600 - 30 * h(i); el(c, x, y - 60, 30, 30, shade(R ? '#6a3a3f' : '#3d4a66', .8 + .4 * h(i))); rr(c, x - 34, y - 34, 68, 80, 18, shade(R ? '#5a2a30' : '#2c3a58', .8 + .4 * h(i + 3))); }
    c.fillStyle = '#4a4252'; c.fillRect(0, 640, 1920, 440); c.fillStyle = '#3c3544'; c.fillRect(0, 640, 1920, 14);
    [[120, 760], [760, 760], [1400, 760]].forEach(([x, y]) => { rr(c, x, y, 420, 40, 6, '#6a5a4a'); c.fillStyle = '#54473a'; c.fillRect(x + 20, y + 40, 24, 180); c.fillRect(x + 376, y + 40, 24, 180); S.monitor(c, x + 40, y - 110, 150, 90, MI.MOODS.night, R ? '#5a1418' : '#16302a'); S.monitor(c, x + 230, y - 110, 150, 90, MI.MOODS.night, R ? '#5a1418' : '#16302a'); });
    return { board };
  }, { floorY: 980, mood }); };

  /* grid paper: charts and timelines on a drafting sheet */
  P.grid_paper = () => MI.place(c => { c.fillStyle = '#f1ede3'; c.fillRect(0, 0, 1920, 1080); c.fillStyle = '#e2ddcf'; for (let x = 0; x < 1920; x += 48) c.fillRect(x, 0, 2, 1080); for (let y = 0; y < 1080; y += 48) c.fillRect(0, y, 1920, 2); c.fillStyle = '#d5cfbe'; for (let x = 0; x < 1920; x += 240) c.fillRect(x, 0, 3, 1080); c.fillStyle = '#cfc8b5'; c.fillRect(0, 900, 1920, 8); return { title: { x: 160, y: 60, w: 1600, h: 110 } }; }, { floorY: 900 });

  /* kitchen: family table, fridge, window on the street. night = the bills come out */
  P.kitchen = (mood = 'day') => { const N = mood === 'night'; return MI.place(c => {
    c.fillStyle = N ? '#3b4561' : '#e9dcc0'; c.fillRect(0, 0, 1920, 760); for (let x = 0; x < 1920; x += 64) for (let y = 380; y < 760; y += 64) { c.fillStyle = N ? '#46506e' : '#f4ecda'; c.fillRect(x + 3, y + 3, 58, 58); }
    rr(c, 160, 70, 600, 290, 8, N ? '#202a44' : '#3f6a6a'); rr(c, 1160, 70, 600, 290, 8, N ? '#202a44' : '#3f6a6a');
    const win = { x: 700, y: 80, w: 520, h: 300 }; S.window(c, win.x, win.y, win.w, win.h, 2, N ? MI.MOODS.night : MI.MOODS.day);
    rr(c, 60, 300, 230, 470, 14, N ? '#c5cad6' : '#f4f6f8'); c.fillStyle = N ? '#a9afbd' : '#dfe3e8'; c.fillRect(60, 470, 230, 6); rr(c, 250, 360, 14, 70, 6, '#8a8f9c'); rr(c, 250, 520, 14, 90, 6, '#8a8f9c');
    rr(c, 300, 560, 1560, 46, 6, N ? '#5a6a8a' : '#6c9a8e'); rr(c, 320, 606, 1520, 160, 6, N ? '#4a5878' : '#5b877c'); for (let i = 0; i < 6; i++) rr(c, 340 + i * 250, 626, 230, 120, 6, N ? '#53638a' : '#679386');
    c.fillStyle = N ? '#2c3348' : '#c8a27c'; c.fillRect(0, 760, 1920, 320); c.fillStyle = N ? '#252b3e' : '#b48f6a'; c.fillRect(0, 760, 1920, 12);
    rr(c, 560, 820, 800, 40, 8, N ? '#7a5a48' : '#a97c58'); c.fillStyle = N ? '#5e4536' : '#8b6446'; c.fillRect(600, 860, 26, 200); c.fillRect(1294, 860, 26, 200);
    if (N) { el(c, 960, 40, 70, 18, '#ffe9a8'); }
    return { window: win };
  }, { floorY: 960, mood }); };

  /* datacenter: a cold aisle of server racks */
  P.server_aisle = () => MI.place(c => { c.fillStyle = '#16213a'; c.fillRect(0, 0, 1920, 1080); poly(c, [[0, 1080], [760, 620], [1160, 620], [1920, 1080]], '#2a3858');
    for (let s = -1; s <= 1; s += 2) for (let i = 0; i < 5; i++) { const k = 1 - i * .16, x = 960 + s * (220 + 520 * k) - (s > 0 ? 0 : 190 * k), y = 620 - 420 * k, w = 190 * k, hh = 560 * k; rr(c, x, y, w, hh + 300 * k, 4, '#33446a'); for (let r = 0; r < 12; r++) { c.fillStyle = '#41557f'; c.fillRect(x + 10 * k, y + 14 * k + r * 64 * k, w - 20 * k, 48 * k); c.fillStyle = h(r + i + s) > .5 ? '#4fb3ff' : '#5ee07a'; c.fillRect(x + w - 34 * k, y + 30 * k + r * 64 * k, 12 * k, 8 * k); } }
    rr(c, 820, 40, 280, 70, 6, '#2b3954'); return { sign: { x: 830, y: 48, w: 260, h: 54 } }; }, { floorY: 1000 });

  /* capitol: the dome on a lawn with flags */
  P.capitol = (mood = 'day') => { const N = mood === 'night'; return MI.place(c => { sky(c, N ? '#152040' : '#8ec5e8', N ? '#2b3a66' : '#d9eef7', 800); clouds(c, 5, N ? '#2e3d6a' : '#fbfdff');
    c.fillStyle = N ? '#2c4a3a' : '#7cb36a'; c.fillRect(0, 780, 1920, 300); poly(c, [[860, 1080], [920, 790], [1000, 790], [1060, 1080]], N ? '#9a9278' : '#e8dcc0');
    rr(c, 520, 560, 880, 230, 4, '#f2eee4'); for (let i = 0; i < 14; i++) rr(c, 545 + i * 62, 600, 22, 170, 3, '#dcd6c6'); poly(c, [[700, 560], [960, 480], [1220, 560]], '#ece6d8');
    rr(c, 800, 400, 320, 100, 4, '#f2eee4'); for (let i = 0; i < 8; i++) rr(c, 815 + i * 38, 410, 14, 84, 3, '#dcd6c6'); c.fillStyle = '#f7f3ea'; c.beginPath(); c.arc(960, 400, 150, Math.PI, 0); c.fill(); rr(c, 940, 190, 40, 70, 6, '#f2eee4'); el(c, 960, 186, 14, 14, '#f2eee4');
    [[420, 560], [1500, 560]].forEach(([x, y]) => { c.fillStyle = '#8a8c9c'; c.fillRect(x, y, 10, 230); rr(c, x + 10, y, 130, 80, 2, '#f4f4f4'); for (let r = 0; r < 4; r++) { c.fillStyle = '#d23b33'; c.fillRect(x + 10, y + r * 20, 130, 10); } rr(c, x + 10, y, 56, 44, 1, '#2c3a7a'); });
    if (N) for (let i = 0; i < 40; i++) el(c, 1920 * h(i), 320 * h(i + 3), 2.5, 2.5, '#fff6d8');
    return {}; }, { floorY: 1000, mood }); };

  /* port: cranes, containers, a customs barrier */
  P.port = (mood = 'day') => { const N = mood === 'night'; return MI.place(c => { sky(c, N ? '#1d1a2a' : '#f2c98a', N ? '#3b3248' : '#f6e2b8', 700); clouds(c, 4, N ? '#4a3f58' : '#fff3dc', 2, 100); city(c, 640, N ? '#2a2638' : '#9a8aa0', N ? '#f3d68a' : '#c7b9c6', 5, 14, 260);
    c.fillStyle = N ? '#1e3a4a' : '#5aa0b5'; c.fillRect(0, 600, 1920, 110); c.fillStyle = N ? '#55546a' : '#b7b0a6'; c.fillRect(0, 700, 1920, 380); c.fillStyle = '#e8c23a'; for (let x = 0; x < 1920; x += 120) c.fillRect(x, 706, 70, 10);
    [[180, '#e0782a'], [1560, '#d23b33']].forEach(([x, col]) => { c.fillStyle = col; c.fillRect(x, 120, 26, 600); c.fillRect(x + 200, 120, 26, 600); c.fillRect(x - 60, 120, 380, 26); });
    const cols = ['#3b6ea5', '#d2603a', '#3f8a5a', '#c9a23a', '#7a4a8a']; for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) rr(c, 520 + i * 180, 640 - r * 90, 170, 86, 3, cols[(i + r * 2) % 5]);
    rr(c, 1260, 520, 170, 220, 6, '#efe8d6'); rr(c, 1240, 500, 210, 40, 4, '#3c4a6a'); rr(c, 1290, 560, 110, 70, 4, '#a9d0e6'); c.fillStyle = '#5a5e6a'; c.fillRect(1460, 650, 26, 110);
    return { booth: { x: 1246, y: 504, w: 198, h: 32 } }; }, { floorY: 960, mood }); };

  /* diner: checkered floor, counter, stacks of plates */
  P.diner = () => MI.place(c => { c.fillStyle = '#7fc8c0'; c.fillRect(0, 0, 1920, 700); c.fillStyle = '#e4f3ef'; c.fillRect(0, 0, 1920, 40); rr(c, 160, 90, 460, 200, 10, '#1b1a24'); rr(c, 1300, 90, 460, 200, 10, '#1b1a24'); const sign = { x: 1320, y: 110, w: 420, h: 160 };
    rr(c, 760, 120, 400, 220, 6, '#f6f1e2'); rr(c, 0, 520, 1920, 50, 6, '#d23b33'); rr(c, 0, 570, 1920, 170, 2, '#efe8d6'); c.fillStyle = '#c9c1ad'; c.fillRect(0, 590, 1920, 8);
    for (let i = 0; i < 9; i++) { const x = 120 + i * 210; c.fillStyle = '#9aa0ae'; c.fillRect(x - 6, 760, 12, 120); el(c, x, 752, 54, 18, '#d23b33'); }
    tile(c, 740, '#f4f1ea', '#22202a', 110); return { sign, menu: { x: 780, y: 140, w: 360, h: 180 } }; }, { floorY: 1000 });

  /* map_sea: an ocean desk for K.world and K.usmap, with a paper-chart frame */
  P.map_sea = () => MI.place(c => { c.fillStyle = '#6fa8cc'; c.fillRect(0, 0, 1920, 1080); c.fillStyle = '#7fb6d9'; for (let i = 0; i < 30; i++) el(c, 1920 * h(i), 1080 * h(i + 5), 120, 30, '#7ab2d4'); c.fillStyle = '#5d95b8'; c.fillRect(0, 0, 1920, 18); c.fillRect(0, 1062, 1920, 18); return {}; }, { floorY: 1080 });

  /* boardroom: long table, big screen, city behind glass */
  P.exec_room = (mood = 'day') => { const N = mood === 'night'; const m = N ? MI.MOODS.night : MI.MOODS.day; return MI.place(c => { c.fillStyle = N ? '#262c40' : '#d8d2c4'; c.fillRect(0, 0, 1920, 760); S.window(c, 60, 80, 560, 520, 2, m); S.window(c, 1300, 80, 560, 520, 2, m);
    const screen = { x: 700, y: 110, w: 520, h: 300 }; rr(c, 680, 90, 560, 340, 8, '#16182a'); c.fillStyle = '#e9eef6'; c.fillRect(screen.x, screen.y, screen.w, screen.h);
    c.fillStyle = N ? '#3a3448' : '#8a6a52'; c.fillRect(0, 760, 1920, 320); poly(c, [[360, 1080], [760, 700], [1160, 700], [1560, 1080]], N ? '#5a4436' : '#6b4a36'); poly(c, [[400, 1080], [780, 714], [1140, 714], [1520, 1080]], N ? '#6b5242' : '#7d5840');
    for (let i = 0; i < 4; i++) { [-1, 1].forEach(s => { const k = i / 4, x = 960 + s * (230 + 380 * k), y = 740 + 300 * k; rr(c, x - 40 - 20 * k, y - 120 - 40 * k, 80 + 40 * k, 130 + 50 * k, 14, '#2a2a38'); }); }
    return { screen }; }, { floorY: 1000, mood }); };

  /* sunset_hills: a long road of months, the "a month earlier" set */
  P.sunset_hills = () => MI.place(c => { sky(c, '#f08a6a', '#f6c98a', 760); el(c, 360, 300, 70, 70, '#fff1c8'); clouds(c, 3, '#f7b9a0', 9, 160);
    poly(c, [[0, 700], [300, 480], [620, 690], [980, 430], [1400, 700], [1700, 520], [1920, 640], [1920, 760], [0, 760]], '#c9607a'); poly(c, [[0, 760], [0, 720], [500, 640], [1000, 700], [1500, 620], [1920, 700], [1920, 760]], '#e09a6a');
    c.fillStyle = '#eab878'; c.fillRect(0, 760, 1920, 320); for (let i = 0; i < 10; i++) poly(c, [[100 + i * 190, 760], [130 + i * 190, 690], [160 + i * 190, 760]], '#5a8a5a');
    c.fillStyle = '#c99a5a'; c.fillRect(0, 960, 1920, 10); return { road: { x: 120, y: 980, w: 1680, h: 60 } }; }, { floorY: 900 });

  /* vault: a round door, gold and cash on shelves */
  P.gold_vault = () => MI.place(c => { c.fillStyle = '#2a2c36'; c.fillRect(0, 0, 1920, 1080); for (let r = 0; r < 6; r++) for (let q = 0; q < 14; q++) rr(c, q * 140 + 10, r * 120 + 10, 120, 100, 6, '#3a3d4a');
    el(c, 1500, 520, 330, 330, '#5a5e6e'); el(c, 1500, 520, 270, 270, '#6e7384'); el(c, 1500, 520, 70, 70, '#3a3d4a'); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; rr(c, 1500 + Math.cos(a) * 90 - 10, 520 + Math.sin(a) * 90 - 10, 20, 20, 4, '#c9b25a'); }
    c.fillStyle = '#3c3f4c'; c.fillRect(0, 820, 1920, 260); for (let i = 0; i < 5; i++) rr(c, 120 + i * 160, 700 - (i % 2) * 40, 140, 120 + (i % 2) * 40, 4, i % 2 ? '#8fc48a' : '#e6b84a');
    return {}; }, { floorY: 960 });

  /* highway: trucks roll, a sign gantry overhead */
  P.highway = (mood = 'day') => { const N = mood === 'night'; return MI.place(c => { sky(c, N ? '#141a34' : '#9fd0ec', N ? '#2a3150' : '#e6f3f8', 620); clouds(c, 5, N ? '#262d4c' : '#ffffff', 4, 110);
    poly(c, [[0, 620], [400, 520], [800, 600], [1300, 500], [1920, 600], [1920, 640], [0, 640]], N ? '#1f2b3a' : '#8ab88a'); c.fillStyle = N ? '#2b3a3a' : '#9cc78c'; c.fillRect(0, 620, 1920, 120);
    c.fillStyle = N ? '#2a2a34' : '#5a5c66'; c.fillRect(0, 740, 1920, 340); c.fillStyle = '#f2f0e6'; for (let x = 0; x < 1920; x += 200) c.fillRect(x, 900, 110, 12); c.fillStyle = '#e8c23a'; c.fillRect(0, 752, 1920, 8);
    c.fillStyle = '#7a7e8a'; c.fillRect(260, 240, 22, 500); c.fillRect(1640, 240, 22, 500); c.fillRect(260, 230, 1402, 22); const sign = { x: 640, y: 260, w: 640, h: 150 }; rr(c, 630, 250, 660, 170, 8, '#2f7a4a');
    return { sign }; }, { floorY: 1040, mood }); };

  /* refinery: towers, pipes, a flare */
  P.refinery = (mood = 'day') => { const N = mood === 'night'; return MI.place(c => { sky(c, N ? '#1a1830' : '#f4b27a', N ? '#3a2e48' : '#f8dcb0', 760); clouds(c, 4, N ? '#3a3050' : '#ffe2c4', 6, 120);
    c.fillStyle = N ? '#2a2a36' : '#8c8578'; c.fillRect(0, 760, 1920, 320);
    [[260, 300, 120], [520, 360, 90], [1380, 280, 130], [1640, 380, 80]].forEach(([x, y, w]) => { rr(c, x, y, w, 760 - y, 8, N ? '#6a6e7c' : '#d9d4c8'); c.fillStyle = N ? '#55596a' : '#bdb6a8'; for (let r = y + 40; r < 740; r += 70) c.fillRect(x, r, w, 10); });
    [[760, 520], [1000, 480], [1220, 540]].forEach(([x, y]) => { el(c, x, y + 120, 110, 40, N ? '#5a5e6c' : '#e6e0d2'); rr(c, x - 110, y + 120, 220, 760 - y - 120, 4, N ? '#6a6e7c' : '#efe9dc'); el(c, x, y + 120, 110, 36, N ? '#7a7e8c' : '#f6f1e6'); });
    c.fillStyle = N ? '#4a4e5c' : '#a8a092'; c.fillRect(0, 700, 1920, 18); c.fillRect(0, 730, 1920, 12); rr(c, 1800, 200, 26, 560, 4, '#6a6e7c');
    return { tank: { x: 900, y: 700, w: 200, h: 50 } }; }, { floorY: 1000, mood }); };

  /* gas_station: a price sign with blanks for the numbers */
  P.gas_station = (mood = 'day') => { const N = mood === 'night'; return MI.place(c => { sky(c, N ? '#121830' : '#a8d8f0', N ? '#2a3456' : '#e8f6fb', 700); clouds(c, 4, N ? '#24304e' : '#ffffff', 8, 100);
    c.fillStyle = N ? '#2c3040' : '#c9c4b6'; c.fillRect(0, 700, 1920, 380); rr(c, 300, 300, 1100, 70, 6, '#d23b33'); c.fillStyle = '#efe8d6'; c.fillRect(380, 370, 40, 330); c.fillRect(1280, 370, 40, 330);
    [[520], [900]].forEach(([x]) => { rr(c, x, 520, 130, 190, 10, '#f2eee4'); rr(c, x + 20, 545, 90, 50, 4, '#16182a'); rr(c, x + 130, 560, 30, 12, 4, '#2b2d3a'); });
    rr(c, 1500, 160, 300, 540, 8, '#2b2d3a'); c.fillStyle = '#6a6e7c'; c.fillRect(1630, 700, 40, 60); rr(c, 1520, 180, 260, 70, 4, '#d23b33');
    const p1 = { x: 1520, y: 280, w: 260, h: 120 }, p2 = { x: 1520, y: 430, w: 260, h: 120 }; rr(c, p1.x, p1.y, p1.w, p1.h, 4, '#121016'); rr(c, p2.x, p2.y, p2.w, p2.h, 4, '#121016');
    if (N) { c.save(); c.globalAlpha = .18; c.fillStyle = '#fff2c0'; c.beginPath(); c.moveTo(300, 370); c.lineTo(1400, 370); c.lineTo(1500, 700); c.lineTo(200, 700); c.fill(); c.restore(); }
    return { brand: { x: 320, y: 306, w: 1060, h: 58 }, price1: p1, price2: p2, label: { x: 1520, y: 180, w: 260, h: 70 } }; }, { floorY: 1000, mood }); };

  /* farm: a field at harvest, a barn, a silo */
  P.farm = () => MI.place(c => { sky(c, '#9fd0ec', '#f2eed2', 640); el(c, 1640, 160, 60, 60, '#fff3b8'); clouds(c, 4, '#ffffff', 11, 120); poly(c, [[0, 600], [500, 520], [1100, 590], [1920, 520], [1920, 660], [0, 660]], '#8ab070');
    rr(c, 1380, 340, 320, 300, 4, '#b8443a'); poly(c, [[1360, 350], [1540, 220], [1720, 350]], '#8a3028'); rr(c, 1490, 470, 100, 170, 4, '#f2eee4'); rr(c, 1730, 260, 110, 380, 50, '#c9c4b6');
    c.fillStyle = '#e8c45a'; c.fillRect(0, 640, 1920, 440); for (let r = 0; r < 8; r++) { c.fillStyle = r % 2 ? '#d8b44a' : '#e8c45a'; c.fillRect(0, 660 + r * 52, 1920, 26); }
    return { sign: { x: 1400, y: 380, w: 280, h: 70 } }; }, { floorY: 980 });

  /* newsroom: a desk, a wall of screens */
  P.newsroom = () => MI.place(c => { c.fillStyle = '#1c2236'; c.fillRect(0, 0, 1920, 1080); const wall = { x: 460, y: 90, w: 1000, h: 420 }; rr(c, wall.x - 20, wall.y - 20, wall.w + 40, wall.h + 40, 8, '#0e1020'); c.fillStyle = '#2a4a8a'; c.fillRect(wall.x, wall.y, wall.w, wall.h);
    for (let i = 0; i < 3; i++) for (let r = 0; r < 2; r++) { rr(c, 80 + r * 0, 100 + i * 140 + r * 0, 300, 120, 4, '#0e1020'); rr(c, 1540, 100 + i * 140, 300, 120, 4, '#0e1020'); c.fillStyle = '#34507a'; c.fillRect(92, 112 + i * 140, 276, 96); c.fillRect(1552, 112 + i * 140, 276, 96); }
    rr(c, 360, 700, 1200, 70, 10, '#d23b33'); rr(c, 400, 770, 1120, 240, 6, '#2c3448'); c.fillStyle = '#262c3e'; c.fillRect(0, 980, 1920, 100);
    return { wall, desk: { x: 420, y: 708, w: 1080, h: 54 } }; }, { floorY: 1000 });
})();
