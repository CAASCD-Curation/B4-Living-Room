/* Silver frontal architecture, drawn from the two supplied facade references. */
let flatHouseSerial12=0;
const HOUSE_ROLES9=['all','guest','companion','host'];
const FLAT_HOUSE12={
 all:{body:'M64 302H309L432 178L576 302V510H64Z',roof:'M50 288H303L432 160L590 288L579 303L432 181L315 316H50Z',roofLine:'M50 294H309L432 170L585 295',door:[326,340,68,170],windows:[[216,347,64,91],[464,340,82,107]],oculus:[145,389,42],triangle:[432,218,28,37],crop:[40,150,560,370],siding:16,base:[64,510,512]},
 guest:{body:'M150 266L320 133L490 266V510H150Z',roof:'M136 263L320 116L504 263L495 277L320 137L145 277Z',roofLine:'M140 268L320 127L500 268',door:[285,337,70,173],windows:[[177,338,78,111],[385,338,78,111]],attic:[292,206,56,48],crop:[126,106,388,414],siding:16,base:[150,510,340]},
 companion:{body:'M132 254L320 116L508 254V510H132Z',roof:'M118 252L320 99L522 252L514 266L320 121L126 266Z',roofLine:'M122 257L320 110L518 257',door:[284,336,72,174],windows:[[159,333,96,116],[385,333,96,116]],attic:[284,186,72,68],crop:[108,89,424,431],siding:15,base:[132,510,376]},
 host:{body:'M120 248L320 105L520 248V510H120Z',roof:'M106 246L320 88L534 246L526 260L320 110L114 260Z',roofLine:'M110 251L320 99L530 251',door:[284,335,72,175],windows:[[148,329,105,122],[387,329,105,122]],oculus:[320,197,29],crop:[96,78,448,442],siding:15,base:[120,510,400]}
};
const ENTRY_HOUSE17={body:'M130 254L320 111L510 254V510H130Z',roof:'M114 251L320 92L526 251L518 265L320 114L122 265Z',roofLine:'M118 257L320 103L522 257',door:[248,326,78,184],windows:[[154,328,70,123],[352,328,132,123]],attic:[292,184,56,77],crop:[104,82,432,438],siding:15,base:[130,510,380]};
const ROOF_PATHS17={home:'M0 135 110 32H655V0h95v32h135l115 103Z',all:'M0 135 110 32H315V0h80v32h255V0h80v32h155l115 103Z',guest:'M0 135 110 32H385V0h80v32h420l115 103Z',companion:'M0 135 110 32H470V0h95v32h320l115 103Z',host:'M0 135 110 32H610V0h95v32h180l115 103Z'};
function flatDoorMarkup12(box){
 const [x,y,w,h]=box,p=Math.max(7,w*.14),upper=h*.43,lower=h*.27;
 return `<g class="flat-door12 decorated-door19" data-flat-door-box="${box.join(',')}"><rect class="door-opening12" x="${x}" y="${y}" width="${w}" height="${h}"/><path class="door-leaf12" data-flat-door-leaf="" d="M${x} ${y}h${w}v${h}h-${w}Z"/><g class="door-joinery19" data-flat-door-details=""><rect class="door-panel19" x="${x+p}" y="${y+13}" width="${w-2*p}" height="${upper}"/><rect class="door-panel19" x="${x+p}" y="${y+h-lower-13}" width="${w-2*p}" height="${lower}"/><path class="door-panel-rebate19" d="M${x+p+4} ${y+upper+9}V${y+17}H${x+w-p-4}M${x+p+4} ${y+h-17}V${y+h-lower-9}H${x+w-p-4}"/><rect class="door-letterplate19" x="${x+w*.27}" y="${y+h*.57}" width="${w*.37}" height="${Math.max(4,h*.026)}"/></g><circle class="door-handle12" data-flat-door-handle="" cx="${x+w*.8}" cy="${y+h*.55}" r="${Math.min(3.2,w*.045)}"/></g>`;
}
function setFlatDoor12(root,amount){
 const t=clamp6(amount,0,1);
 for(const g of $$('[data-flat-door-box]',root)){
  const [x,y,w,h]=g.dataset.flatDoorBox.split(',').map(Number),s=1-.72*t,right=x+w*s;
  $('[data-flat-door-leaf]',g).setAttribute('d',`M${x} ${y}L${right} ${y-16*t}V${y+h+16*t}L${x} ${y+h}Z`);
  const handle=$('[data-flat-door-handle]',g);handle.setAttribute('cx',x+(right-x)*.8);handle.setAttribute('cy',y+h*.55+1.3*t);
  const details=$('[data-flat-door-details]',g);if(details)details.setAttribute('transform',`matrix(${s} ${-16*t/w} 0 1 ${x*(1-s)} ${16*t*x/w})`);
 }
}
function roofArtwork13(role=null){
 const key=role||'home',id='page-roof19-'+(++flatHouseSerial12),d=ROOF_PATHS17[key]||ROOF_PATHS17.home;
 return `<div class="original-roof solid-roof14 roof-v17 roof-paper19" data-roof-role="${key}" aria-hidden="true"><svg viewBox="0 0 1000 135"><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><path class="roof-main19" d="${d}"/><g clip-path="url(#${id})" class="banner-joinery19"><path d="M38 113H962M66 88H934M92 63H908"/><path class="banner-eave19" d="M0 132H1000"/></g></svg></div>`;
}
function windowMarkup19(box,serial,{attic=false}={}){
 const [x,y,w,h]=box,frame=attic?5:7,ix=x+frame,iy=y+frame,iw=w-frame*2,ih=h-frame*2,mid=x+w/2,divider=y+h*.56;
 const slats=Array.from({length:attic?5:7},(_,i)=>{const yy=iy+4+i*3.3;return `<path d="M${ix+2} ${yy}H${ix+iw-2}"/>`;}).join('');
 const curtains=attic?`<path class="window-curtain19" d="M${ix+iw*.55} ${iy+ih*.51}H${ix+iw}V${iy+ih}H${ix+iw*.3}Q${ix+iw*.72} ${iy+ih*.76} ${ix+iw*.55} ${iy+ih*.51}Z"/>`:`<path class="window-curtain19" d="M${ix} ${divider-1}H${ix+iw*.3}Q${ix+iw*.43} ${iy+ih*.82} ${ix+iw*.1} ${iy+ih}H${ix}Z"/><path class="window-curtain19" d="M${ix+iw*.71} ${divider-1}H${ix+iw}V${iy+ih}H${ix+iw*.92}Q${ix+iw*.6} ${iy+ih*.77} ${ix+iw*.71} ${divider-1}Z"/>`;
 const casement=w>100?`<path class="window-mullion19" d="M${x+w*.33} ${iy}V${iy+ih}M${x+w*.67} ${iy}V${iy+ih}"/>`:`<path class="window-mullion19" d="M${mid} ${iy}V${iy+ih}"/>`;
 return `<g class="framed-window19 ${attic?'attic-window19':''}" data-window19="${serial}"><rect class="window-outer19" x="${x-3}" y="${y-3}" width="${w+6}" height="${h+6}"/><rect class="window-pane19" x="${ix}" y="${iy}" width="${iw}" height="${ih}"/>${curtains}<g class="window-blinds19">${slats}</g><rect class="window-inner19" x="${ix}" y="${iy}" width="${iw}" height="${ih}"/>${casement}<path class="window-mullion19" d="M${ix} ${divider}H${ix+iw}"/><path class="window-architrave19" d="M${x-5} ${y-6}H${x+w+5}V${y-2}H${x-5}ZM${x-6} ${y+h+3}H${x+w+6}V${y+h+8}H${x-6}Z"/></g>`;
}
function specialWindows19(spec){
 let out='';
 if(spec.oculus){const [cx,cy,r]=spec.oculus;out+=`<g class="oculus19"><circle class="window-outer19" cx="${cx}" cy="${cy}" r="${r+5}"/><circle class="window-pane19" cx="${cx}" cy="${cy}" r="${r}"/><circle class="window-inner19" cx="${cx}" cy="${cy}" r="${r-4}"/><path class="window-mullion19" d="M${cx-r+4} ${cy}H${cx+r-4}M${cx} ${cy-r+4}V${cy+r-4}"/></g>`;}
 if(spec.triangle){const [cx,cy,w,h]=spec.triangle;out+=`<g class="triangular-window19"><path class="window-outer19" d="M${cx-w-5} ${cy+h+4}L${cx} ${cy-6}L${cx+w+5} ${cy+h+4}Z"/><path class="window-pane19" d="M${cx-w} ${cy+h}L${cx} ${cy}L${cx+w} ${cy+h}Z"/><path class="window-mullion19" d="M${cx} ${cy+6}V${cy+h}"/></g>`;}
 return out;
}
function flatHouse12(role='all',{intro=false,compact=false,interactive=false}={}){
 const spec=intro?ENTRY_HOUSE17:FLAT_HOUSE12[role]||FLAT_HOUSE12.all,id='facade19-'+(++flatHouseSerial12),[bx,by,bw]=spec.base;
 const siding=Array.from({length:30},(_,i)=>{const y=118+i*spec.siding;return `<path d="M40 ${y}H600"/>`;}).join('');
 const [dx,dy,dw,dh]=spec.door,doorFrame=`<path class="door-casing19" d="M${dx-7} ${dy+dh}V${dy-7}H${dx+dw+7}V${dy+dh}H${dx+dw+3}V${dy-3}H${dx-3}V${dy+dh}Z"/>`;
 const lowerWindows=spec.windows.map((box,i)=>windowMarkup19(box,i)).join(''),attic=spec.attic?windowMarkup19(spec.attic,'attic',{attic:true}):'';
 return `<svg class="flat-house12 facade-house17 decorated-house19 ${intro?'entrance-house17 entrance-house19':''} ${compact?'compact-house12':''}" data-flat-role="${role}" viewBox="0 0 640 560" xmlns="http://www.w3.org/2000/svg" role="${interactive?'group':'img'}" aria-label="${intro?'银白山墙房屋入口':roleName9(role)+' · 银白装饰立面'}"><defs><clipPath id="${id}"><path d="${spec.body}"/></clipPath></defs><g class="facade-outline17 facade-joinery19"><path class="house-body17" d="${spec.body}"/><g class="lap-siding19" clip-path="url(#${id})">${siding}</g><path class="house-roof17" d="${spec.roof}"/><path class="roof-edge19" d="${spec.roofLine}"/>${lowerWindows}${attic}${specialWindows19(spec)}<path class="wall-corner19" d="M${bx+5} ${role==='all'&&!intro?313:267}V${by-7}M${bx+bw-5} ${role==='all'&&!intro?313:267}V${by-7}"/>${doorFrame}${flatDoorMarkup12(spec.door)}<path class="house-plinth19" d="M${bx-2} ${by}H${bx+bw+2}V${by+6}H${bx-2}ZM${dx-10} ${by+6}H${dx+dw+10}V${by+11}H${dx-10}Z"/></g></svg>`;
}
