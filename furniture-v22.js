/* Frontal furniture drawings. Shared by the threshold, house interiors and facets. */
const FURNITURE_V6 = (() => {
  let serial = 0;
  const ink = 'var(--ink, #303735)';
  const paper = 'var(--silver, #F1F0ED)';
  const blue = 'var(--soft-blue, #89CAEA)';
  const mint = 'var(--mint, #F1F0ED)';
  const accent = 'var(--blue, #89CAEA)';
  const acid = 'var(--acid, #FFFF00)';
  const rect = (x, y, w, h, fill = paper, r = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
  const path = (d, fill = 'none') => `<path d="${d}" fill="${fill}"/>`;
  const circle = (x, y, r, fill = paper) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
  const insetTone = (id, x, y, w, h, r = 0) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${blue}" stroke="none"/>`;
  const panelTone = (id, x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${mint}" stroke="none"/>`;
  const shapes = {
    'sofa-1': id => [
      rect(50, 32, 100, 68, blue, 5),
      rect(40, 72, 120, 55, paper, 4),
      rect(52, 86, 96, 30, blue, 3),
      rect(37, 75, 17, 48, paper, 3), rect(146, 75, 17, 48, paper, 3),
      path('M53 127v17m94-17v17M60 144h-13m106 0h-13'),
      insetTone(id, 59, 40, 25, 37, 2),
      rect(84, 109, 32, 6, acid, 1)
    ].join(''),
    'sofa-2': id => [
      rect(25, 40, 150, 63, blue, 5),
      rect(20, 78, 160, 48, paper, 3),
      rect(34, 86, 65, 28, blue, 3), rect(101, 86, 65, 28, blue, 3),
      rect(16, 72, 18, 51, paper, 4), rect(166, 72, 18, 51, paper, 4),
      path('M31 126v15m138-15v15M100 47v32'),
      insetTone(id, 35, 48, 58, 27, 2),
      rect(84, 110, 32, 6, acid, 1)
    ].join(''),
    'sofa-3': id => [
      rect(15, 36, 42, 91, blue, 4), rect(143, 36, 42, 91, blue, 4),
      rect(49, 56, 102, 70, blue, 4),
      rect(26, 79, 27, 36, blue, 3), rect(57, 88, 42, 27, blue, 3),
      rect(101, 88, 42, 27, blue, 3), rect(147, 79, 27, 36, blue, 3),
      path('M21 128v13m30-13v13m98-13v13m30-13v13M100 64v17'),
      insetTone(id, 22, 43, 28, 28, 2), insetTone(id, 150, 43, 28, 28, 2),
      rect(84, 119, 32, 6, acid, 1)
    ].join(''),
    'table-1': id => [
      rect(53, 52, 94, 11, blue, 1),
      rect(62, 63, 8, 77, paper), rect(130, 63, 8, 77, paper),
      rect(68, 109, 64, 8, mint),
      rect(88, 36, 19, 16, paper, 2), path('M107 39h6v9h-6'),
      panelTone(id, 56, 55, 88, 5), circle(126, 47, 3, acid)
    ].join(''),
    'table-2': id => [
      rect(20, 75, 160, 13, blue, 2),
      rect(31, 88, 9, 47, paper), rect(160, 88, 9, 47, paper),
      rect(62, 65, 42, 10, mint, 1),
      rect(69, 47, 16, 18, paper, 2), path('M85 50h6v10h-6'),
      rect(125, 58, 19, 17, paper, 2), path('M144 61h6v9h-6'),
      insetTone(id, 24, 78, 152, 6), rect(106, 71, 13, 4, acid, 1)
    ].join(''),
    'table-3': id => [
      rect(9, 65, 58, 13, blue, 1), rect(71, 78, 58, 13, mint, 1),
      rect(133, 56, 58, 13, blue, 1),
      rect(17, 78, 7, 56, paper), rect(52, 78, 7, 56, paper),
      rect(79, 91, 7, 43, paper), rect(114, 91, 7, 43, paper),
      rect(141, 69, 7, 65, paper), rect(176, 69, 7, 65, paper),
      path('M67 73h4m58 10h4M36 51v14m-8-14h16'),
      insetTone(id, 12, 68, 52, 7), panelTone(id, 136, 59, 52, 7),
      rect(91, 71, 18, 7, acid, 1)
    ].join(''),
    'chair-1': id => [
      rect(62, 25, 8, 113, paper), rect(130, 25, 8, 113, paper),
      rect(70, 28, 60, 14, blue), rect(70, 51, 60, 12, mint),
      rect(70, 72, 60, 12, blue), rect(52, 91, 96, 13, blue, 1),
      path('M70 119h60M58 140h17m50 0h17'),
      panelTone(id, 73, 31, 54, 8), circle(140, 97, 2, acid)
    ].join(''),
    'chair-2': id => [
      rect(56, 23, 88, 81, blue, 9),
      rect(40, 76, 120, 53, paper, 6),
      rect(56, 85, 88, 30, blue, 5),
      rect(37, 70, 20, 53, paper, 5), rect(143, 70, 20, 53, paper, 5),
      path('M52 129v15m96-15v15M72 34v41m56-41v41'),
      insetTone(id, 77, 34, 45, 39, 3),
      rect(85, 118, 30, 5, acid, 1)
    ].join(''),
    'chair-3': id => [
      rect(56, 16, 88, 68, blue, 7),
      rect(39, 68, 122, 35, paper, 5),
      rect(55, 78, 90, 22, blue, 4),
      rect(35, 64, 19, 42, paper, 4), rect(146, 64, 19, 42, paper, 4),
      rect(61, 105, 78, 24, blue, 3), rect(53, 129, 94, 10, paper, 2),
      path('M46 107v34m108-34v34M71 140v6m58-6v6'),
      insetTone(id, 64, 24, 28, 42, 2), rect(89, 131, 22, 5, acid, 1)
    ].join(''),
    'light-1': id => [
      rect(80, 65, 40, 59, blue, 3),
      path('M100 91V57h27V45'),
      rect(111, 25, 35, 22, mint, 3),
      path('M115 48h27M119 54v13m18-13v13'),
      circle(100, 110, 3, acid), panelTone(id, 85, 72, 30, 16)
    ].join(''),
    'light-2': id => [
      rect(69, 137, 69, 6, blue, 2),
      path('M103 137V77h29V53h-27V31'),
      circle(103, 77, 3, acid), circle(132, 53, 3, paper),
      rect(79, 20, 52, 17, mint, 2),
      path('M83 39h44M91 46v10m28-10v10'),
      insetTone(id, 84, 24, 42, 9)
    ].join(''),
    'light-3': id => [
      rect(84, 13, 32, 7, blue, 2),
      path('M100 20v35M40 55h120M40 55v24m60-24v42m60-42v24'),
      circle(100, 55, 3, acid),
      rect(23, 78, 34, 23, mint, 3), rect(83, 96, 34, 23, blue, 3),
      rect(143, 78, 34, 23, mint, 3),
      path('M27 103h26m34 18h26m34-18h26'),
      insetTone(id, 27, 82, 26, 14), insetTone(id, 147, 82, 26, 14)
    ].join(''),
    cabinet: id => [
      rect(45, 22, 110, 112, paper, 2),
      rect(53, 30, 94, 41, mint), rect(53, 79, 94, 47, blue),
      path('M100 30v96M53 134v12m94-12v12'),
      circle(91, 55, 2, acid), circle(109, 105, 2, acid), insetTone(id, 59, 36, 32, 29)
    ].join(''),
    mirror: id => [
      `<ellipse cx="100" cy="66" rx="45" ry="54" fill="${mint}"/>`,
      `<ellipse cx="100" cy="66" rx="38" ry="47" fill="${paper}"/>`,
      path('M97 120v22m6-22v22'), rect(76, 142, 48, 5, blue, 2),
      path('M87 29h13m-13 6h22'), circle(100, 114, 2, acid)
    ].join(''),
    bookshelf: id => [
      rect(43, 15, 114, 126, paper),
      rect(52, 24, 96, 29, mint), rect(52, 62, 96, 29, blue), rect(52, 100, 96, 31, mint),
      path('M60 28v21m9-21v21m10-21v21m40 17v21m10-21v21m10-21v21M64 105v22m9-22v22m9-22v22M51 141v7m98-7v7'),
      rect(94, 119, 35, 8, acid), insetTone(id, 87, 29, 18, 18)
    ].join(''),
    drawers: id => [
      rect(49, 20, 102, 116, paper, 2),
      rect(57, 28, 86, 28, mint), rect(57, 64, 86, 28, blue), rect(57, 100, 86, 28, mint),
      path('M89 42h22m-22 36h22m-22 36h22M58 136v10m84-10v10'),
      insetTone(id, 62, 32, 17, 19), circle(133, 114, 2, acid)
    ].join(''),
    cart: id => [
      path('M44 30v102m112-102v102M44 31h-17v18'),
      rect(39, 59, 122, 11, mint, 1), rect(39, 110, 122, 11, blue, 1),
      circle(50, 138, 9, paper), circle(150, 138, 9, paper),
      circle(50, 138, 2, acid), circle(150, 138, 2, acid),
      rect(67, 80, 26, 30, paper, 2), rect(107, 91, 32, 19, paper, 2),
      insetTone(id, 42, 62, 116, 5)
    ].join(''),
    bench: id => [
      rect(18, 68, 164, 16, blue, 1),
      rect(32, 84, 10, 53, paper), rect(158, 84, 10, 53, paper),
      path('M43 112h115'), rect(26, 56, 148, 8, mint, 1),
      insetTone(id, 23, 72, 154, 7), rect(149, 59, 18, 3, acid, 1)
    ].join(''),
    screen: id => [
      rect(25, 24, 48, 112, paper), rect(76, 24, 48, 112, mint), rect(127, 24, 48, 112, paper),
      rect(33, 33, 32, 94, blue), rect(84, 33, 32, 94, paper), rect(135, 33, 32, 94, blue),
      path('M73 45h3m-3 67h3m48-67h3m-3 67h3M32 136v10m35-10v10m66-10v10m35-10v10'),
      insetTone(id, 87, 37, 26, 86), circle(118, 117, 2, acid)
    ].join(''),
    console: id => [
      rect(15, 67, 170, 63, paper),
      rect(23, 75, 47, 47, mint), rect(77, 75, 47, 47, blue), rect(131, 75, 46, 47, mint),
      path('M26 130v13m148-13v13M44 91h7m46 0h7m47 0h7'),
      rect(136, 57, 31, 10, acid, 1), insetTone(id, 28, 80, 37, 36)
    ].join(''),
    rug: id => [
      rect(11,18,178,124,paper,2),rect(16,23,168,114,mint,1),rect(21,28,158,104,paper),rect(28,35,144,90,mint),rect(38,43,124,74,paper,2),
      path('M11 22 21 32M189 22 179 32M11 138 21 128M189 138 179 128M43 48h114M43 112h114M33 40v80m134-80v80'),
      path('M47 56h106v48H47Z',blue),rect(52,61,96,38,paper),path('M80 61v38m40-38v38M52 80h96'),
      path('M27 27v8m-4-4h8M173 27v8m-4-4h8M27 125v8m-4-4h8M173 125v8m-4-4h8'),
      path('M42 27c4-5 8-5 12 0m92 0c4-5 8-5 12 0M42 133c4 5 8 5 12 0m92 0c4 5 8 5 12 0'),
      path('M20 10v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8M20 142v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8m12-8v8'),circle(100,80,2,acid)
    ].join(''),
    lamp: id => [
      rect(73, 28, 54, 42, mint, 3),
      rect(67, 69, 66, 6, blue, 1), path('M98 75v53m4-53v53'),
      rect(72, 128, 56, 9, paper, 3),
      path('M113 77v24'), circle(113, 103, 2, acid), insetTone(id, 79, 34, 42, 29, 1)
    ].join('')
  };
  const items = [
    {type:'sofa-1',facet:'heat',rank:0,name:'单人会客沙发',english:'Single visitor sofa'},
    {type:'sofa-2',facet:'heat',rank:1,name:'双人沙发',english:'Two-seat sofa'},
    {type:'sofa-3',facet:'heat',rank:2,name:'围合式组合沙发',english:'Conversation sofa'},
    {type:'table-1',facet:'contact',rank:0,name:'小边几',english:'Side table'},
    {type:'table-2',facet:'contact',rank:1,name:'共用茶几',english:'Shared coffee table'},
    {type:'table-3',facet:'contact',rank:2,name:'模块组合茶几',english:'Modular tables'},
    {type:'chair-1',facet:'depth',rank:0,name:'直背会客椅',english:'Straight-back visitor chair'},
    {type:'chair-2',facet:'depth',rank:1,name:'软包扶手椅',english:'Upholstered armchair'},
    {type:'chair-3',facet:'depth',rank:2,name:'可躺休闲椅',english:'Reclining lounge chair'},
    {type:'light-1',facet:'agency',rank:0,name:'单头壁灯',english:'Single wall light'},
    {type:'light-2',facet:'agency',rank:1,name:'可调落地灯',english:'Adjustable floor light'},
    {type:'light-3',facet:'agency',rank:2,name:'多头顶灯',english:'Multi-head pendant'}
  ];
  const decor = ['cabinet','mirror','bookshelf','drawers','cart','bench','screen','console','rug','lamp'];
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function render(type, opts = {}) {
    const id = `v6-furniture-${++serial}`;
    const draw = shapes[type] || shapes['sofa-2'];
    const labelled = typeof opts.label === 'string' && opts.label.trim();
    const access = labelled ? `role="img" aria-labelledby="${id}-title"` : 'aria-hidden="true"';
    const title = labelled ? `<title id="${id}-title">${escape(opts.label)}</title>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" class="furniture-drawing" data-furniture-type="${escape(type)}" viewBox="0 0 200 160" fill="none" ${access} focusable="false">${title}<g class="furniture-outline" stroke="${ink}" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round">${draw(id)}</g></svg>`;
  }
  return {render, items, decor};
})();
