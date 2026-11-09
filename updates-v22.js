/* V22: silver picture rooms, portrait previews and grounded furniture. */
function nextFolderTone21(){const colors=['#89CAEA','#00BEFF','#FFFF00','#F1F0ED'];return colors.find(color=>!PIN_FOLDERS20.some(f=>f.tone21===color))||colors[PIN_FOLDERS20.length%colors.length];}
function folderFace21(f){return `<button class="folder-open21" data-act="folder-open20" data-folder20="${esc(f.id)}" aria-label="打开资料夹${esc(f.name)}">${pinIcon20('cabinet',{folder:true,tone:folderTone21(f.tone21)})}<span>${esc(f.name)}</span><small>${f.ids.length} IMAGES</small></button>`;}
function pageFolderContext21(){return `${V6.page}/${V6.role}/${V6.page==='home'?'home':isEditorial14()?V6.galleryMode17:'inside/'+V6.view}`;}
function pageFolderRoot21(){return V6.page==='home'?$('.home-intro17'):isEditorial14()?$(V6.galleryMode17==='grid'?'.image-weave19':V6.galleryMode17==='store'?'.storage-room17':'.outside-data-stage15'):$('#database-content');}
function folderOrigin21(x,y){const root=pageFolderRoot21();if(!root)return null;const r=root.getBoundingClientRect();return{context:pageFolderContext21(),x:clamp6((x-r.x-44)/r.width*100,0,Math.max(0,100-88/r.width*100)),y:clamp6((y-r.y-35)/r.height*100,0,Math.max(0,100-110/r.height*100))};}
function defaultFolderOrigin21(ids){const root=pageFolderRoot21();if(!root)return null;const source=ids.map(id=>root.querySelector('[data-asset="'+id+'"]')).find(Boolean);if(source){const r=source.getBoundingClientRect();return folderOrigin21(r.x+r.width/2,r.y+r.height/2);}return{context:pageFolderContext21(),x:78,y:3};}
function renderPageFolders21(){$$('.page-folders21').forEach(el=>el.remove());const root=pageFolderRoot21();if(!root||!['home','database'].includes(V6.page))return;const folders=PIN_FOLDERS20.filter(f=>f.origin21?.context===pageFolderContext21());if(!folders.length)return;const host=document.createElement('div');host.className='page-folders21';host.setAttribute('aria-label','在本页面整理的资料夹');host.innerHTML=folders.map(f=>`<article class="page-folder21" data-folder20="${esc(f.id)}" style="left:${f.origin21.x}%;top:${f.origin21.y}%">${folderFace21(f)}<button class="folder-delete21" data-act="folder-delete21" data-folder20="${esc(f.id)}" aria-label="删除资料夹${esc(f.name)}" title="删除资料夹">×</button></article>`).join('');root.append(host);}
function deleteFolder21(id){if(EMBED20){const bridge=bridgeParent20();if(bridge?.removeFolder)bridge.removeFolder(id);return;}PIN_FOLDERS20=PIN_FOLDERS20.filter(f=>f.id!==id);if(PIN_ACTIVE20===id)PIN_ACTIVE20=null;savePins6();renderPin6();renderPageFolders21();renderNav6();toast6('资料夹已删除，原作品保留在档案中。');}
const navigation21=renderNav6;
renderNav6=function(){navigation21();renderPageFolders21();};
const editorialRecords21=renderEditorialRecords14;
renderEditorialRecords14=function(){editorialRecords21();const stage=$('#archive-stage17');if(stage){stage.classList.toggle('framed-grid21',V6.galleryMode17==='grid');stage.dataset.mode21=V6.galleryMode17;if(V6.galleryMode17==='grid')decorateGrand22(stage);else{stage.classList.remove('oil-grand-container22');Array.from(stage.children).filter(c=>c.classList.contains('oil-ornament22')).forEach(c=>c.remove());}}renderPageFolders21();};
const databaseContent21=updateDBContent6;
updateDBContent6=function(){databaseContent21();renderPageFolders21();};
const mainPin21=renderPin6;
renderPin6=function(){mainPin21();renderPageFolders21();};
// Creator and title remain in the detail, never beside the contact sheet.
function decorateGrand22(el){if(!el)return;el.classList.add('oil-grand-container22');if(!Array.from(el.children).some(c=>c.classList.contains('oil-ornament22--grand')))el.insertAdjacentHTML('beforeend',frameOrnament22('grand'));}
function galleryRecord17(a){return `<article class="weave-record19 portrait-record22" data-record-id="${esc(a.id)}"><button class="image-object weave-art19 portrait-preview22" data-act="reader-select17" data-asset="${esc(a.id)}" aria-label="${esc(a.title)}，点击阅读作品说明">${picture6(a,false)}</button></article>`;}
function isGridScale22(){return V6.page==='database'&&(isEditorial14()?V6.galleryMode17==='grid':V6.view==='grid');}
function gridSettings22(width){const level=clamp6(Number(U20.gridRhythm22)||100,60,160),requested=clamp6(Math.round(level<=100?8+(100-level)*.15:8-(level-100)/15),4,14),gap=width<500?12:18,cols=clamp6(Math.round(requested*Math.min(1,width/900)),width<360?1:2,requested),w=(width-(cols-1)*gap)/cols;return{level,cols,gap,width:w};}
function applyGalleryScale17(){const root=$('.database');if(!root)return;root.style.setProperty('--tile-height17',U20.size+'px');const weave=$('.image-weave19');if(!weave)return;const g=gridSettings22(weave.clientWidth||innerWidth*.7);weave.style.setProperty('--grid-cols22',g.cols);weave.style.setProperty('--grid-gap22',g.gap+'px');weave.style.setProperty('--grid-picture-width22',g.width+'px');weave.dataset.pictureHeight22=String(Math.round((g.width-16)*4/3));weave.dataset.columns22=String(g.cols);weave.dataset.rhythm22=String(g.level);const out=$('[data-grid-output22]');if(out)out.textContent=g.cols+' COLS / '+Math.round(g.width)+'px';}
function applyGridScale22(){applyGalleryScale17();renderPageFolders21();drawPinPageLinks8();}
const scaleOutsideGrid22=applyScale7;
applyScale7=function(){if(isGridScale22()){applyGridScale22();return;}scaleOutsideGrid22();};
function renderGrid6(pool){return `<div class="grid-intro"><span>INDEX / A ROOM TO READ CLOSELY</span><small>点击图片阅读 · 拖动整理资料</small><button data-act="compare">COMPARE ${V6.compare.length}/2 ↗</button></div><section class="interior-photo-room22 oil-grand-container22" aria-label="房内照片画廊">${frameOrnament22('grand')}<div class="image-weave19 interior-grid22" aria-label="房内照片网格">${gridOrder17(pool).map(galleryRecord17).join('')}</div></section>`;}
document.addEventListener('input',e=>{if(e.target.dataset.layout22!=='grid')return;U20.gridRhythm22=clamp6(Number(e.target.value),60,160);saveLayout20();applyGridScale22();});
// All three choices react immediately, including the first half of an axis exchange.
function axisTokens10(){return V6.axisOrder9.map((k,i)=>`<button data-act="axis-pick" data-axis="${i}" aria-pressed="${V6.axisPick10===i}" class="${V6.axisPick10===i?'axis-chosen21':''}"><b>${'XYZ'[i]}</b><span>${FACET6[k].name}</span><i>${V6.axisPick10===i?'✓':'↔'}</i></button>`).join('');}
function pickAxis10(axis){if(![0,1,2].includes(axis))return;if(V6.axisPick10==null){V6.axisPick10=axis;}else{const from=V6.axisPick10;V6.axisPick10=null;if(from!==axis){exchangeAxes10(from,axis);const host=$('.scene-axis-tools10');if(host)host.dataset.exchanged21='true';toast6('已交换 '+ 'XYZ'[from]+' 与 '+'XYZ'[axis]+' 轴。');return;}}
 const tokens=$('.axis-tokens10');if(tokens)tokens.innerHTML=axisTokens10();const status=$('.scene-axis-tools10>p');if(status){status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent=V6.axisPick10==null?'点选两根轴，交换位置':`已选 ${'XYZ'[V6.axisPick10]} 轴 · 再选一根轴交换`;}const chosen=$(`[data-act="axis-pick"][data-axis="${axis}"]`);chosen?.animate?.([{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:180});}
// Wall and ceiling fixtures stay above the floor; a table lamp rests on the console.
const STORE_ROOM22={width:1200,height:1220,floor:310};
const STORE_PLAN21={
 'light-3':[610,180,185],'light-1':[180,205,105],
 console:[420,520,210],lamp:[450,432,80],drawers:[630,535,135],cabinet:[795,550,145],bookshelf:[970,560,150],mirror:[1120,570,130],
 'light-2':[115,620,125],screen:[115,825,125],
 'sofa-1':[355,745,165],'sofa-2':[590,725,215],'sofa-3':[870,780,200],cart:[1100,840,110],
 'chair-1':[170,1010,130],'chair-2':[350,1050,140],'chair-3':[520,1010,135],
 'table-1':[690,1005,135],'table-2':[875,1040,160],'table-3':[1080,1015,160],bench:[740,1210,190],rug:[670,1130,1070]
};
function storePositions21(){const primary=bins17().map((b,i)=>{const [x,y,w]=STORE_PLAN21[b.type],jitter=['rug','lamp','console'].includes(b.type)?0:((i*7%13)-6),plane=b.type==='light-3'?'ceiling':b.type==='light-1'?'wall':b.type==='lamp'?'surface':'floor';return{type:b.type,instance:b.type,x:x+jitter,y:y+(['wall','ceiling','surface'].includes(plane)||b.type==='console'?0:((i*7%11)-5)),w,h:b.type==='rug'?675:w*.8,plane,support:b.type==='lamp'?'console':null,layer:b.type==='rug'?1:b.type==='lamp'?5:3};});return [...primary,{type:'rug',instance:'rug-left22',x:150,y:705,w:250,h:170,plane:'floor',layer:1},{type:'rug',instance:'rug-right22',x:1040,y:650,w:270,h:175,plane:'floor',layer:1}];}
function storageRoom17(pool){const places=storePositions21();return `<section class="storage-room17 storage-room19 planned-store21 grounded-store22" aria-label="壁灯与顶灯在上，所有落地家具在地面，台灯置于边柜"><div class="room-wall17" aria-hidden="true"></div><div class="room-ground17" aria-hidden="true"></div><span class="room-address21" aria-hidden="true">THE OBJECT ROOM<br>A PLACE FOR EVERY OBJECT</span>${places.sort((a,b)=>a.layer-b.layer).map(p=>{const object=furnitureButton19(p.type,'archive-furniture17 room-furniture17 '+(p.type==='rug'?'room-rug17':''),`data-store-plane22="${p.plane}" data-store-instance22="${p.instance}" ${p.support?'data-store-support22="'+p.support+'"':''} style="left:${p.x/12}%;top:${p.y/12.2}%;width:${p.w/12}%;height:${p.h/12.2}%;z-index:${p.layer}"`,pool);return p.type==='rug'?object.replace('<svg ','<svg preserveAspectRatio="none" '):object;}).join('')}</section>`;}
window.pinBridge20.removeFolder=id=>deleteFolder21(id);
window.pinBridge20.openFolder=id=>{PIN_ACTIVE20=id;V6.pinOpen=true;renderPin6();renderNav6();};
const proxyBridge21=bridgeParent20;
bridgeParent20=function(){const b=proxyBridge21();if(b&&!b.openFolder)b.openFolder=id=>window.parent.postMessage({type:'jifenshu-folder-open21',id},'*');if(b&&!b.removeFolder)b.removeFolder=id=>window.parent.postMessage({type:'jifenshu-folder-delete21',id},'*');return b;};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act="folder-delete21"]');if(b){e.preventDefault();deleteFolder21(b.dataset.folder20);}});
window.addEventListener('message',e=>{if(!EMBED20&&['jifenshu-folder-delete21','jifenshu-folder-open21'].includes(e.data?.type)&&$$('#split-workbench20 iframe').some(f=>f.contentWindow===e.source))(e.data.type==='jifenshu-folder-open21'?window.pinBridge20.openFolder(e.data.id):deleteFolder21(e.data.id));});
window.addEventListener('resize',()=>{applyGalleryScale17();renderPageFolders21();});

