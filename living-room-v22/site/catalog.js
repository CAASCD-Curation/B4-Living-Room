const LABELS={INTIMATE:'亲密',SHARED:'共用',RITUAL:'礼仪',BOUNDARY:'边界',KIN:'亲属关系',COMPANION:'友伴关系',HOST_GUEST:'主客关系',STRANGER:'陌生关系',FURNITURE:'家具',DAILY_OBJECT:'日用物',HOSPITALITY_OBJECT:'待客物',DISPLAY_OBJECT:'展示物',BODY:'身体',HABIT:'习惯',ROLE:'角色',SELF_BOUNDARY:'边界',VISION:'视觉',HEARING:'听觉',SMELL:'嗅觉',TASTE:'味觉',TOUCH:'触觉',BODY_AWARENESS:'身体意识',EMOTION_AWARENESS:'情绪意识',MEMORY_TRIGGER:'记忆触发',CLOSENESS:'亲近',JOY:'共乐',TENSION:'紧张',CONFLICT:'冲突',ENCLOSURE:'围合',JUXTAPOSITION:'并置',CONFRONTATION:'对峙',SEPARATION:'分隔',VACANCY:'空置',TOUCHING:'贴近',NEAR:'近坐',FAR:'远坐',DIVIDED:'隔断',ABSENT:'缺席',BRIGHT:'明亮',DIM:'幽暗',WARM:'暖色',COOL:'冷色',HIGH_SATURATION:'高饱和',LOW_SATURATION:'低饱和',SOFT:'柔软',HARD:'坚硬',SMOOTH:'光滑',ROUGH:'粗糙',REFLECTIVE:'反光',TRANSPARENT:'透明',TIDY:'整齐',MESSY:'杂乱',WORN:'磨损',STACKED:'堆积',EMPTY:'空置',TEMPORARY:'临时'};
const FACETS=[['heat','火候值','关系有多强'],['contact','接触面','关系铺多广'],['depth','入味度','关系进多深'],['agency','掌勺权','能决定多少']];
const FILTERS={role:['客','伴','主'],heat:['微火','中火','旺火'],contact:['点状','局部','全面'],depth:['表层','入里','熟透'],agency:['旁观','搭手','掌勺']};
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

/* The same drawings are used in the room, collection rail and notebook. */
Object.assign(SHAPES,{
sofa:'<path d="m24 60 16-21h127l20 22v64l-15 10H26z"/><path d="M40 39v57h128V39M24 60h17v49h128V62h18M41 96l-17 13m145 0 18-15" fill="none"/><path d="M42 82h60v27H42zm60 0h66v27h-66z" fill="var(--accent)"/><path d="M31 133v12m141-12v12M104 47v34" fill="none"/><path d="M31 140h9m127 0h10" stroke="var(--third)" stroke-width="3"/>',
armchair:'<path d="m59 20 80 8 12 72-101-8z"/><path d="m39 77 12-8 13 7v32l78 4V82l14-5 12 8v42l-112-4-17-10z"/><path d="m64 91 78 7v14l-78-4z" fill="var(--accent)"/><path d="m54 123-3 23m101-20 2 20M75 30l-3 47m14-46-3 47m14-46-3 47" fill="none"/>',
'floor-lamp':'<path d="M100 55v83" fill="none" stroke="var(--blue)"/><path d="m76 15 46 4 21 42-91-7z"/><path d="m52 54 48 14 43-7-44-11z" fill="var(--accent)"/><ellipse cx="101" cy="139" rx="27" ry="6" fill="var(--accent)"/><circle cx="101" cy="69" r="4" fill="var(--third)"/>',
'coffee-table':'<path d="m24 85 4 48m128-46 4 48m14-65 3 39" fill="none" stroke="var(--blue)"/><path d="M13 63q24-28 101-22t75 31q-17 28-93 22T13 63z"/><path d="M13 63v7q20 32 98 28t78-26" fill="none"/><ellipse cx="142" cy="60" rx="12" ry="6" fill="var(--third)"/>',
cabinet:'<path d="m41 25 106-12 17 13v111l-106 10-17-15z"/><path d="m41 25 17 12 106-11M58 37v110" fill="none"/><path d="m66 44 90-9v42l-90 9zm0 49 90-9v41l-90 9z" fill="var(--accent)"/><path d="m111 40 0 91M48 137v12m108-11v11" fill="none"/><circle cx="103" cy="66" r="2.8" fill="var(--third)"/><circle cx="119" cy="109" r="2.8" fill="var(--third)"/>',
mirror:'<path d="M94 125v20m-20 0h47" fill="none"/><ellipse cx="100" cy="68" rx="48" ry="59"/><ellipse cx="100" cy="68" rx="39" ry="50" fill="var(--surface)"/><path d="m78 65 37-29m-32 54 35-28" stroke="var(--soft-blue)" fill="none"/>',
screen:'<path d="m24 30 48-15v121l-48-12zm48-15 55 17v92l-55 12zm55 17 49-17v121l-49-12z"/><path d="M81 45h35v60H81z" fill="var(--accent)"/><path d="m34 45 28-9v71l-28-7zm105-4 25-9v78l-25-6z" fill="none"/>',
'dining-table':'<path d="m21 75 5 65m146-49 5 48M142 51l2 62M51 47v62" fill="none" stroke="var(--blue)"/><path d="m12 71 46-34 132 35-46 32z"/><path d="m12 71 0 7 132 33 46-32v-7m-46 32v7" fill="var(--accent)"/><path d="m69 44 20-13 33 8-21 14z" fill="var(--surface)"/>',
bookshelf:'<path d="m42 16 107-8 14 13v116l-105 12-16-13z"/><path d="m58 29 96-9v34l-96 8zm0 41 96-9v34l-96 9zm0 41 96-9v28l-96 10z" fill="var(--surface)"/><path d="M58 29v120M42 16l16 13m9 7v20m10-22v21m10-22v21m42 14v25m10-26v25m-70 28v21m10-22v21" fill="none"/><path d="m98 37 20-2v17l-20 2z" fill="var(--accent)"/>',
cart:'<path d="m32 36 13-6v104m110-115 11 9v95" fill="none" stroke="var(--blue)"/><path d="m28 48 119-16 24 15-119 18zm0 52 119-16 24 15-119 18z"/><path d="m52 65v64m119-82v70" fill="none"/><circle cx="52" cy="137" r="8" fill="var(--accent)"/><circle cx="165" cy="126" r="8" fill="var(--third)"/>'
});
let furnitureSerial=0;
function furnitureSVG(type){
 const id='furniture-pattern-'+(++furnitureSerial),shape=(SHAPES[type]||SHAPES.sofa).replaceAll('fill="white"','fill="var(--surface)"');
 const patches={sofa:'<rect x="48" y="49" width="47" height="26"/>',armchair:'<path d="m110 34 23 2 5 45-28-4z"/>',cabinet:'<path d="m69 48 33-3v27l-33 4z"/>',screen:'<path d="m141 42 20-7v65l-20-5z"/>','coffee-table':'<ellipse cx="73" cy="62" rx="30" ry="13"/>','floor-lamp':'<path d="m80 20 17 2-8 32-27-3z"/>',bookshelf:'<path d="m123 106 24-3v23l-24 3z"/>'};
 return `<svg class="furniture-drawing" data-furniture-type="${type}" viewBox="0 0 200 160" aria-hidden="true"><defs><pattern id="${id}" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0V7M0 0H7" fill="none" stroke="var(--blue)" stroke-width=".45" opacity=".4"/></pattern></defs><g class="furniture-outline" fill="var(--furniture-fill)" stroke="var(--ink)" stroke-width=".95" stroke-linejoin="round">${shape}</g>${patches[type]?`<g fill="url(#${id})" stroke="none">${patches[type]}</g>`:''}</svg>`;
}
