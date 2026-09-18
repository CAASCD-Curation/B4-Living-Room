const LABELS={INTIMATE:'亲密',SHARED:'共用',RITUAL:'礼仪',BOUNDARY:'边界',KIN:'亲属关系',COMPANION:'友伴关系',HOST_GUEST:'主客关系',STRANGER:'陌生关系',FURNITURE:'家具',DAILY_OBJECT:'日用物',HOSPITALITY_OBJECT:'待客物',DISPLAY_OBJECT:'展示物',BODY:'身体',HABIT:'习惯',ROLE:'角色',SELF_BOUNDARY:'边界',VISION:'视觉',HEARING:'听觉',SMELL:'嗅觉',TASTE:'味觉',TOUCH:'触觉',BODY_AWARENESS:'身体意识',EMOTION_AWARENESS:'情绪意识',MEMORY_TRIGGER:'记忆触发',CLOSENESS:'亲近',JOY:'共乐',TENSION:'紧张',CONFLICT:'冲突',ENCLOSURE:'围合',JUXTAPOSITION:'并置',CONFRONTATION:'对峙',SEPARATION:'分隔',VACANCY:'空置',TOUCHING:'贴近',NEAR:'近坐',FAR:'远坐',DIVIDED:'隔断',ABSENT:'缺席',BRIGHT:'明亮',DIM:'幽暗',WARM:'暖色',COOL:'冷色',HIGH_SATURATION:'高饱和',LOW_SATURATION:'低饱和',SOFT:'柔软',HARD:'坚硬',SMOOTH:'光滑',ROUGH:'粗糙',REFLECTIVE:'反光',TRANSPARENT:'透明',TIDY:'整齐',MESSY:'杂乱',WORN:'磨损',STACKED:'堆积',EMPTY:'空置',TEMPORARY:'临时'};
const FILTERS={layer:['INTIMATE','SHARED','RITUAL','BOUNDARY'],guestPrimary:['KIN','COMPANION','HOST_GUEST','STRANGER'],hall:['FURNITURE','DAILY_OBJECT','HOSPITALITY_OBJECT','DISPLAY_OBJECT'],selfPrimary:['BODY','HABIT','ROLE','SELF_BOUNDARY'],sense:['VISION','HEARING','SMELL','TASTE','TOUCH','BODY_AWARENESS','EMOTION_AWARENESS','MEMORY_TRIGGER','CLOSENESS','JOY','TENSION','CONFLICT'],aesthetic:['ENCLOSURE','JUXTAPOSITION','CONFRONTATION','SEPARATION','VACANCY','TOUCHING','NEAR','FAR','DIVIDED','ABSENT','BRIGHT','DIM','WARM','COOL','HIGH_SATURATION','LOW_SATURATION','SOFT','HARD','SMOOTH','ROUGH','REFLECTIVE','TRANSPARENT','TIDY','MESSY','WORN','STACKED','EMPTY','TEMPORARY']};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const textTag=k=>LABELS[k]||k; const img=(a,thumb=true)=>`<img src="${esc(thumb?a.thumbnail:a.image)}" alt="${esc(a.title)}" loading="lazy" decoding="async">`;

const SHAPES={
sofa:'<rect x="27" y="42" width="146" height="70" rx="15"/><rect x="12" y="70" width="30" height="57" rx="9"/><rect x="158" y="70" width="30" height="57" rx="9"/><path d="M42 96h116v32H42z" fill="var(--accent)"/><path d="M29 128v12m142-12v12M100 48v47" fill="none"/>',
armchair:'<path d="M55 28h90v77H55z"/><rect x="39" y="75" width="122" height="54" rx="10"/><path d="M58 90h84v24H58z" fill="var(--accent)"/><path d="M51 129v15m98-15v15M83 34v43m10-43v43m10-43v43" fill="none"/>',
bench:'<path d="M10 77h180v26H10z"/><path d="M30 103v34h12v-34m115 0v34h12v-34" fill="var(--accent)"/><path d="M22 59h156v12H22z" fill="var(--third)"/>',
rug:'<path d="M12 55 156 24 188 106 43 138z"/><path d="M32 63 146 40 168 99 52 122z" fill="var(--accent)"/><path d="m55 71 78-17 13 35-78 16z" fill="var(--third)"/>',
'floor-lamp':'<path d="M93 67h10v68H93z" fill="var(--accent)"/><path d="M72 18h51l25 53H49z"/><path d="M65 136h69v10H65z" fill="var(--third)"/>',
'coffee-table':'<ellipse cx="100" cy="70" rx="89" ry="24"/><path d="M29 78v52h10V85m122-7v52h10V82" fill="var(--accent)"/>',
'side-table':'<path d="M53 48h94v20H53zM67 69h12v61H67zm53 0h12v61h-12z"/><path d="M48 116h104v11H48z" fill="var(--accent)"/>',
'lamp':'<path d="M72 20h57l23 57H50z"/><path d="M93 77h12v45H93z" fill="var(--third)"/><ellipse cx="100" cy="127" rx="43" ry="12" fill="var(--accent)"/>',
cabinet:'<path d="M40 18h120v116H40z"/><path d="M49 27h102v44H49zm0 52h102v46H49z" fill="var(--accent)"/><path d="M100 28v97M47 134v11m107-11v11" fill="none"/><circle cx="91" cy="55" r="3" fill="var(--third)"/><circle cx="109" cy="99" r="3" fill="var(--third)"/>',
mirror:'<ellipse cx="100" cy="67" rx="51" ry="60"/><ellipse cx="100" cy="67" rx="38" ry="47" fill="white"/><path d="m79 69 39-35m-30 61 34-32" fill="none"/><path d="M94 127h12v14H94z" fill="var(--accent)"/>',
'showcase':'<path d="M47 15h106v120H47z"/><path d="M57 25h86v84H57z" fill="white"/><path d="M57 67h86M100 25v84" fill="none"/><path d="M55 137v9m89-9v9"/><path d="M60 114h80v13H60z" fill="var(--accent)"/>',
'console':'<path d="M10 67h180v57H10z"/><path d="M19 76h50v38H19zm57 0h50v38H76z" fill="var(--accent)"/><path d="M134 76h46v38h-46z" fill="var(--third)"/><path d="M25 124v15m150-15v15"/>',
screen:'<path d="m24 27 48-14v123l-48-12zm48-14 55 15v95l-55 13zm55 15 49-16v123l-49-12z"/><path d="M81 39h37v70H81z" fill="var(--accent)"/><path d="M35 47v58m10-65v68m111-70v74" fill="none"/>',
'dining-table':'<path d="M14 51h172v22H14z"/><path d="M28 74h15v65H28zm129 0h15v65h-15z" fill="var(--accent)"/><path d="M61 40V14h64v26" fill="var(--third)"/>',
'double-chair':'<path d="M21 24h55v67H21zm103 0h55v67h-55z"/><path d="M13 88h73v18H13zm102 0h73v18h-73z" fill="var(--accent)"/><path d="M22 106v32m52-32v32m52-32v32m51-32v32" fill="none"/>',
'long-table':'<path d="M8 53h183v19H8z"/><path d="m30 72-12 65h16l12-65m113 0 12 65h16l-12-65" fill="var(--accent)"/>',
bookshelf:'<path d="M40 10h120v137H40z"/><path d="M50 21h100v30H50zm0 40h100v31H50zm0 41h100v33H50z" fill="white"/><path d="M60 25v23m10-23v23m10-23v23m32 17v25m10-25v25m-63 16v29m11-29v29" fill="none"/>',
drawers:'<path d="M44 15h112v122H44z"/><path d="M53 24h94v28H53zm0 38h94v28H53zm0 38h94v28H53z" fill="var(--accent)"/><path d="M89 38h22m-22 38h22m-22 38h22M54 138v8m92-8v8" fill="none"/>',
'file-cabinet':'<path d="M63 9h77v128H63z"/><path d="M70 17h63v48H70zm0 57h63v53H70z" fill="var(--accent)"/><path d="M88 35h27v12H88zm0 56h27v12H88z" fill="white"/>',
cart:'<path d="M30 35h13v94H30zm117 0h13v94h-13z"/><path d="M30 48h131v17H30zm0 53h131v17H30z" fill="var(--accent)"/><circle cx="42" cy="139" r="10" fill="var(--third)"/><circle cx="150" cy="139" r="10" fill="var(--third)"/> '
};

function furnitureSVG(type){return `<svg viewBox="0 0 200 160" aria-hidden="true"><g fill="var(--ink)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">${SHAPES[type]||SHAPES.sofa}</g></svg>`}
