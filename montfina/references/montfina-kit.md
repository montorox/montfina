# Montfina kit reference

Everything here is in `engine/mf-ink.js`, `engine/mf-kit.js`, `engine/mf-places.js` and `engine/mf-geo.js`. `st` is the time a thing arrives (use `g.a('words')`). Coordinates are world pixels (1920x1080) when called in a shot's world function, screen pixels when called in its screen function.

## Look
- `MI.INK = { col: '#1b1a24', w: 3.4, on: true }` outline colour, width, on/off for every opaque fill.
- `MI.noInk(() => { ... })` draw without outlines (glows, light shafts, things that must stay soft).
- `MI.FONT` typed lettering (Patrick Hand). `MI.FONTK` scales it (1.12).
- `MI.FINISH = { vignette: .42, grain: .07, warmth: .05 }` per frame. Night films can raise the vignette; a bright explainer can lower the grain.
- `MI.SPLAT` colour of the chapter splat transition.
- People: every `MI.PEOPLE` entry is drawn by `MI.inkRig`. Fields: `skin, hair, hairStyle (short, spiky, bob, long, bun, bald), top, vest, tie, collar, pants, shoes, glasses, beard, hat, badge, hivis, seed`. Same poses, expressions, `say`, `walk`, `sprite:[[t,'typing']]` as MontInfo.

## Words and labels
- `K.words(g, 'exact narrated words', {size: 76, color, y, w})` on the `black` place. Words appear as they are said. The phrase must be the narration's words in order.
- `K.badge(x, y, 'Thursday', st, {col, size, rot})`
- `K.label(x, y, 'Nasdaq', st, {line:[x2,y2], rot, col, bg, size})` a paper tag; `line` draws a string to the thing it names.
- `K.chapter(n, 'Crack 4', 'The Plug', st, {x, y, nx, ny, ring, col})` call in the screen function. `n` null for no number.
- `K.clock(x, y, '3:06 PM ET', st, {r, bg})`

## Data
- `K.ticker(y, {seed, down: .6, speed: 90, h: 46, items: [['NVDA','181.20',-1], ...]})` full-width band. Made-up symbols by default.
- `K.chart(x, y, w, h, values, st, {col, dur: 1.4, min, max, grid: true, area, label, lw, dot})` returns the end point.
- `K.bars(x, baseY, w, h, values, st, {cols, col, labels, values, max, gap, stagger})`
- `numberCard(x, y, label, value, st, {prefix, suffix, size, roll, dec})` keeps decimals (3.74 stays 3.74).

## Paper
- `K.post(x, y, w, {name, handle, text, avatar, verified}, st, {h, size})` the text must be the real post, word for word.
- `K.doc(x, y, w, h, {title, sub, quote}, st, {rot, band, size})` the quote is highlighted as it types. Real words only.

## Maps (real shapes)
- `K.usmap(x, y, w, {land, border, states: {Ohio: '#d23b33'}, pins: [['Ohio', t], [[mapX, mapY], t]], pinCol, st})` returns `pt(stateName or [x,y])` in frame space. 51 states and DC, Albers USA, 975 x 610 map units scaled to `w`.
- `K.world(x, y, w, h, {center: [lon, lat], span: degrees across, land, sea, highlight: {Iran: '#d23b33'}})` returns `P([lon, lat])`. 194 countries by their Natural Earth names ("United States of America", "Iran", "Saudi Arabia", "China", "Russia").

## Things with faces
- `K.critter(kind, x, y, s, {expr, pose, say:[[a,b]], walk:[[t0,x0,t1,x1]], enter, hop, flip, glow, label, labelCol, edge})`
- kinds: chip, cloud, coin, box, bill, battery, house, piggy, barrel, bolt, building, server.
- expr: happy, neutral, sad, angry, shocked, sleepy (or a track `[[t, 'shocked']]`). pose: rest, up, wave, point, pointl, shrug, hold, cheer.
- About 300 px tall at s = 1, feet at y.

## Split screen
- `MI.panels(g, [{place, at, A:[z,fx,fy], B, world: (g, blanks) => {...}, used: ['blankName']}], {})` call in the screen function of a shot on the `black` place. Each panel drops in on `at` with a thud and an ink divider.

## Light
- `K.glow(x, y, r, col, a)` additive light.

## Places
Name | moods | floor Y | blanks
--- | --- | --- | ---
black | - | 1080 | -
trading_floor | day, red, green | 980 | board
grid_paper | - | 900 | title
kitchen | day, night | 960 | window
server_aisle | - | 1000 | sign
capitol | day, night | 1000 | -
port | day, night | 960 | booth
diner | - | 1000 | sign, menu
map_sea | - | 1080 | -
exec_room | day, night | 1000 | screen
sunset_hills | - | 900 | road
gold_vault | - | 960 | -
highway | day, night | 1040 | sign
refinery | day, night | 1000 | tank
gas_station | day, night | 1000 | brand, label, price1, price2
farm | - | 980 | sign
newsroom | - | 1000 | wall, desk

Every place in `references/places.md` also works and comes out inked.

## Sounds
`buzzer`, `cash`, `paper` join the MontInfo set (pop, tick, thud, hit, whoosh, ding, scratch, boing, roll).
