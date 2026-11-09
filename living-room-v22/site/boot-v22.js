let gesture6=null,holdTimer6;
function navigate7(page){if(['home','database','display'].includes(page)){navigateArchive17(page);return;}if(['relation','archive'].includes(page))page='home';const change=()=>{if(page==='database'||page==='display')goDatabase6('all');else{history.pushState(null,'','#'+page);route6();scrollTo({top:0,behavior:'instant'});}};if(document.startViewTransition&&!reduce.matches)document.startViewTransition(change);else change();}
document.addEventListener('click',e=>{const a=e.target.closest('.home-v9 a[data-section],.home-view17 a[data-section]');if(!a)return;e.preventDefault();if(Date.now()>=V6.blockUntil)navigate7(a.dataset.section);},true);
function route6(){
 const [path,query='']=location.hash.slice(1).split('?');stopCycle8();V6.menuOpen=false;V6.navOpen=false;clearRelations6();closePreview6();V6.hover=null;
 if(['database','display','detail'].includes(path)){
  V6.page='database';const params=new URLSearchParams(query),role=params.get('role'),inside=params.get('stage')==='inside';V6.role=['all',...ROLES6.map(r=>r.key)].includes(role)?role:'all';V6.distance=inside?0:1;V6.exteriorYaw9=0;V6.layout=0;V6.view=inside&&params.get('view')==='grid'?'grid':'space';V6.search=params.get('q')||'';V6.filters={};for(const key of ['keyword','sourceGroup',...Object.keys(FACET6)])if(params.get('f_'+key))V6.filters[key]=params.get('f_'+key);parseGalleryRoute17(params);renderDatabase6();if(path==='detail')openPreview8(new URLSearchParams(query).get('id'));
 }else{closeDetail6();if(path==='premise')premisePage7();else if(path==='exhibition')exhibitionPage7();else{const params=new URLSearchParams(query);V6.role=['all',...ROLES6.map(r=>r.key)].includes(params.get('role'))?params.get('role'):'all';if(params.has('light'))V6.pull=params.get('light')==='1';V6.search=params.get('q')||'';V6.filters={};for(const key of ['keyword','sourceGroup',...Object.keys(FACET6)])if(params.get('f_'+key))V6.filters[key]=params.get('f_'+key);parseGalleryRoute17(params);homePage();}}
}
function stepScale7(amount){V6.zoom=Math.round(clamp6(V6.zoom+amount,.5,1.7)*100)/100;applyScale7();}
function changeGrid8(value){if(V6.view==='grid')V6.gridColumns8=clamp6(Math.round(value),3,12);else V6.wallGrid=clamp6(Math.round(value),2,6);updateDBContent6();}
function togglePinLinks8(){V6.pinLinks=!V6.pinLinks;renderPin6();$$('[data-act="pin-links"]').forEach(b=>{b.setAttribute('aria-pressed',String(V6.pinLinks));if(b.closest('.comparison'))b.textContent='关联连线 '+(V6.pinLinks?'开':'关');});drawPinLines6();drawPinPageLinks8();}
document.addEventListener('click',e=>{
 if(Date.now()<V6.blockUntil){e.preventDefault();return;}
 const b=e.target.closest('[data-act]');if(b){const act=b.dataset.act,id=b.dataset.id;
 const actions={navigate:()=>navigate7(b.dataset.page),menu:()=>{V6.menuOpen=!V6.menuOpen;renderNav6();},pull:pull6,all:()=>V6.page==='database'?selectExterior8('all'):goDatabase6('all'),rooms:()=>travelDoor14(1),layout:changeLayout6,view:()=>{V6.view=V6.view==='grid'?'space':'grid';if(V6.view==='space')V6.distance=0;V6.hover=null;clearRelations6();updateDBContent6();renderNav6();},'db-tools':()=>{U20.open=false;renderLayout20();V6.toolsOpen9=!V6.toolsOpen9;V6.scaleOpen10=false;$('.db-tools-drawer9').hidden=!V6.toolsOpen9;$('.scale-controls7')?.setAttribute('hidden','');renderNav6();},'axis-pick':()=>pickAxis10(Number(b.dataset.axis)),'axis-exchange':()=>exchangeAxes10(Number(b.dataset.from),Number(b.dataset.to)),'axis-orbit':()=>{if(isArchive17()&&V6.editorialMode14==='data'){orbitEditorial14(Number(b.dataset.yaw||0),Number(b.dataset.pitch||0));return;}V6.yaw+=Number(b.dataset.yaw||0);V6.pitch=clamp6(V6.pitch+Number(b.dataset.pitch||0),-80,80);applySpace6();},'layout-wall':()=>setLayout10(0),'layout-data':()=>setLayout10(1),'view-grid':()=>setView10('grid'),'view-space':()=>setView10('space'),'scale-panel':()=>{V6.scaleOpen10=!V6.scaleOpen10;V6.toolsOpen9=false;$('.scale-controls7').hidden=!V6.scaleOpen10;$('.db-tools-drawer9').hidden=true;renderNav6();},'axis-swap':()=>permuteAxes9('swap'),'axis-cycle':()=>permuteAxes9('cycle'),'house-prev':()=>carouselRole9(-1),'house-next':()=>carouselRole9(1),filters:()=>{const p=$('.filter-panel');p.hidden=!p.hidden;b.setAttribute('aria-expanded',String(!p.hidden));},filter:()=>setFilter6(b.dataset.key,b.dataset.value),'clear-filters':resetGallery17,'clear-focus':()=>{V6.focus=null;V6.hover=null;updateEmphasis6();},detail:()=>openPreview8(id),'close-preview':()=>closePreview6(true),'preview-prev':()=>previewStep8(-1),'preview-next':()=>previewStep8(1),pin:()=>{V6.pinOpen=!V6.pinOpen;renderPin6();renderNav6();},'pin-close':()=>{V6.pinOpen=false;renderPin6();renderNav6();},'pin-add':()=>addPin6(id),'pin-remove':()=>{PINS6=PINS6.filter(p=>p.id!==id);savePins6();renderPin6();renderNav6();},'pin-links':togglePinLinks8,'export-pin':exportPins6,compare:showCompare6,'close-compare':()=>{$('#help-layer').innerHTML='';V6.help=false;drawPinPageLinks8();},'compare-select':()=>{V6.compare=V6.compare.includes(id)?V6.compare.filter(x=>x!==id):[...V6.compare.slice(-1),id];updateDBContent6();},help:()=>{help6();renderNav6();},'door-outside':()=>{V6.yaw=0;V6.pitch=0;travelDoor14(1);},'door-enter':()=>travelDoor14(0),'exterior-role':()=>selectExterior8(b.dataset.role),'furniture-enter':()=>travelDoor14(0),distance:()=>{V6.yaw=0;V6.pitch=0;travelDoor14(Number(b.dataset.distance));},'zoom-step':()=>stepScale7(Number(b.dataset.step)),'grid-step':()=>changeGrid8((V6.view==='grid'?V6.gridColumns8:V6.wallGrid)+Number(b.dataset.step)),'reset-view':()=>{V6.zoom=1;V6.wallGrid=3;V6.gridColumns8=6;V6.yaw=0;V6.pitch=0;updateDBContent6();}};
 actions[act]?.();return;}
 const image=e.target.closest('[data-asset]');if(image&&!e.target.closest('#preview'))openPreview8(image.dataset.asset);
});
document.addEventListener('dblclick',e=>{const image=e.target.closest('[data-asset]');if(image&&!V6.preview&&Date.now()>=V6.blockUntil){e.preventDefault();openPreview8(image.dataset.asset);}});
document.addEventListener('pointerover',e=>{
 if(document.body.classList.contains('entering-site'))return;const topic=e.target.closest('[data-section]');if(V6.page==='home'&&topic)setHomeSection8(topic.dataset.section);
 if(gesture6||V6.preview)return;const b=e.target.closest('[data-asset]');if(!b||b.contains(e.relatedTarget))return;V6.hover=b.dataset.asset;updateEmphasis6();
});
document.addEventListener('pointerout',e=>{if(V6.page==='home')setHomeSection8(e.relatedTarget?.closest?.('[data-section]')?.dataset.section||null);if(V6.preview)return;const b=e.target.closest('[data-asset]');if(!b||b.contains(e.relatedTarget))return;V6.hover=e.relatedTarget?.closest?.('[data-asset]')?.dataset.asset||null;updateEmphasis6();});
document.addEventListener('focusin',e=>{const topic=e.target.closest('[data-section]');if(topic&&V6.page==='home')setHomeSection8(topic.dataset.section);const b=e.target.closest('[data-asset]');if(b&&!V6.preview){V6.hover=b.dataset.asset;updateEmphasis6();}});
document.addEventListener('focusout',e=>{if(e.target.closest('[data-asset]')&&!V6.preview){V6.hover=null;updateEmphasis6();}});
document.addEventListener('input',e=>{
 if(e.target.id==='rail-position10'){const rail=$('.linear-rail');rail.scrollLeft=Number(e.target.value)/1000*(rail.scrollWidth-rail.clientWidth);return;}
 if(e.target.id==='database-search'){V6.search=e.target.value;if(V6.filters.keyword!==V6.search)delete V6.filters.keyword;clearTimeout(dbSearchTimer6);dbSearchTimer6=setTimeout(()=>{V6.focus=null;V6.hover=null;history.replaceState(null,'',databaseHash15());updateDBContent6();},130);}
 if(e.target.id==='pin-note'){PIN_NOTE6=e.target.value;savePins6();}
 if(e.target.id==='view-zoom8'){V6.zoom=Number(e.target.value)/100;applyScale7();}
 if(e.target.id==='grid-amount8')changeGrid8(Number(e.target.value));
});
document.addEventListener('pointerdown',e=>{
 if(document.body.classList.contains('entering-site')||e.target.closest('input,textarea,[contenteditable]')||e.button>2)return;
 const lane=e.target.closest('.image-name-lane15');if(lane&&(e.button===0||e.button===1)){if(e.button===1)e.preventDefault();gesture6={kind:'reading-lane15',el:lane,x:e.clientX,y:e.clientY,sx:lane.scrollLeft,button:e.button,id:e.pointerId,moved:false};return;}
 const outside=e.target.closest('.outside-data-stage15');if(outside&&(e.button===2||e.button===0&&!e.target.closest('[data-asset]'))){e.preventDefault();gesture6={kind:'outside-camera15',x:e.clientX,y:e.clientY,yaw:V6.editorialYaw14,pitch:V6.editorialPitch14,id:e.pointerId,moved:false};return;}
 const rail=e.target.closest('.linear-rail');if(rail&&e.button===1){e.preventDefault();gesture6={kind:'rail',el:rail,x:e.clientX,sx:rail.scrollLeft,id:e.pointerId,moved:false};return;}
 const handle=e.target.closest('[data-drag-panel]');if(e.button===0&&handle&&!e.target.closest('button,a')){const el=handle.closest('#pin-panel,.comparison'),r=el.getBoundingClientRect();gesture6={kind:'panel',el,panel:handle.dataset.dragPanel,x:e.clientX,y:e.clientY,sx:r.x,sy:r.y,moved:false,id:e.pointerId};return;}
 if(V6.page==='database'&&V6.view==='space'&&V6.distance<.05&&!V6.help&&!e.target.closest('#pin-panel,#help-layer,.filter-panel,.scale-controls7,#floating-nav,.preview-window8 article,.scene-axis-tools10,#utility-nav10,#top-actions11')&&(e.button===2||(e.button===0&&e.target.closest('.db-scene')&&!e.target.closest('[data-asset],.room-door9')))){
  e.preventDefault();V6.hover=null;updateEmphasis6();gesture6={kind:'camera',x:e.clientX,y:e.clientY,yaw:V6.yaw,pitch:V6.pitch,id:e.pointerId};return;
 }
 if(e.button!==0)return;
 const cord=e.target.closest('#cord');if(cord){gesture6={kind:'cord',el:cord,x:e.clientX,y:e.clientY,id:e.pointerId,moved:false};cord.setPointerCapture(e.pointerId);return;}
 const keyword=e.target.closest('.keyword[data-key]');if(keyword&&FACET6[keyword.dataset.key]){gesture6={kind:'keyword',el:keyword,x:e.clientX,y:e.clientY,id:e.pointerId,moved:false,held:false};holdTimer6=setTimeout(()=>{if(gesture6?.el===keyword){gesture6.held=true;showKeywordRelations7(keyword.dataset.key,keyword.dataset.value,keyword);}},380);return;}
 const pin=e.target.closest('.pin-object');if(pin&&!e.target.closest('.pin-remove')){const p=PINS6.find(p=>p.id===pin.dataset.pinId);gesture6={kind:'pin',el:pin,p,x:e.clientX,y:e.clientY,sx:p.x,sy:p.y,moved:false,id:e.pointerId};return;}
 
 const image=e.target.closest('[data-asset]');if(image){const a=find6(image.dataset.asset);if(!a)return;gesture6={kind:'image',el:image,a,x:e.clientX,y:e.clientY,moved:false,held:false,id:e.pointerId};holdTimer6=setTimeout(()=>{if(gesture6?.el===image){gesture6.held=true;showRelations6(a);}},380);}
});
document.addEventListener('pointermove',e=>{
 const home=$('.home-v8:not(.lit)');if(home){const r=home.getBoundingClientRect();home.style.setProperty('--spot-x',(e.clientX-r.left)+'px');home.style.setProperty('--spot-y',(e.clientY-r.top)+'px');}
 const g=gesture6;if(!g||g.id!==e.pointerId)return;const dx=e.clientX-g.x,dy=e.clientY-g.y;
 if(g.kind==='reading-lane15'){if(Math.hypot(dx,dy)>5)g.moved=true;if(g.moved){e.preventDefault();g.el.scrollLeft=g.sx-dx*(g.button===1?3.5:1);g.el.classList.add('lane-dragging15');}return;}
 if(g.kind==='outside-camera15'){e.preventDefault();g.moved=true;V6.editorialYaw14=g.yaw+dx*.2;V6.editorialPitch14=clamp6(g.pitch-dy*.15,-75,75);applyOutsideData15();return;}
 if(g.kind==='rail'){e.preventDefault();g.el.scrollLeft=g.sx-dx;g.moved=true;return;}
 if(g.kind==='camera'){V6.yaw=g.yaw+dx*.2;V6.pitch=clamp6(g.pitch-dy*.15,-88,88);applySpace6();return;}
 if(Math.hypot(dx,dy)>5)g.moved=true;
 if(g.kind==='panel'&&g.moved){const x=clamp6(g.sx+dx,8,Math.max(8,innerWidth-g.el.offsetWidth-8)),y=clamp6(g.sy+dy,8,Math.max(8,innerHeight-Math.min(g.el.offsetHeight,innerHeight-16)-8));Object.assign(g.el.style,{left:x+'px',top:y+'px',right:'auto',bottom:'auto',transform:'none'});if(g.panel==='pin')PIN_POSITION8={x,y};drawPinPageLinks8();return;}
 if(g.kind==='cord'){const bob=$('b',g.el);if(bob)bob.style.transform=`translateY(${clamp6(dy,0,40)}px)`;return;}
 
 if(g.kind==='pin'&&g.moved){const r=$('.pin-canvas').getBoundingClientRect();g.p.x=clamp6(g.sx+dx/r.width*100,0,Math.max(0,100-110/r.width*100));g.p.y=clamp6(g.sy+dy/r.height*100,0,68);g.el.style.left=g.p.x+'%';g.el.style.top=g.p.y+'%';drawPinLines6();drawPinPageLinks8();return;}
 if(g.kind==='image'&&g.moved){clearTimeout(holdTimer6);e.preventDefault();const ghost=$('#drag-ghost');if(!ghost.innerHTML)ghost.innerHTML=picture6(g.a);ghost.style.transform=`translate(${e.clientX+16}px,${e.clientY+12}px)`;ghost.classList.add('visible');showRelations6(g.a,{x:e.clientX,y:e.clientY});const target=document.elementFromPoint(e.clientX,e.clientY);if(target?.closest('.pin-dock')&&!V6.pinOpen){V6.pinOpen=true;renderPin6();renderNav6();}$('#pin-panel').classList.toggle('drop-ready',!!target?.closest('#pin-panel'));}
},{passive:false});
function release6(e,cancel=false){
 const g=gesture6;gesture6=null;clearTimeout(holdTimer6);if(!g)return;clearRelations6();$('#drag-ghost').classList.remove('visible');$('#drag-ghost').innerHTML='';$('#pin-panel').classList.remove('drop-ready');
 if(g.kind==='reading-lane15')g.el.classList.remove('lane-dragging15');
 if(g.kind==='image'&&g.moved&&!cancel){const target=document.elementFromPoint(e.clientX,e.clientY);if(target?.closest('#pin-panel,.pin-dock'))addPin6(g.a.id);}
 if(g.kind==='cord'){const bob=$('b',g.el);if(bob)bob.style.transform='';if(g.moved&&!cancel&&e.clientY-g.y>18)pull6();if(g.el.hasPointerCapture(e.pointerId))g.el.releasePointerCapture(e.pointerId);}
 if(g.kind==='pin'&&g.moved||g.kind==='panel'&&g.panel==='pin'&&g.moved)savePins6();
 if(g.moved||g.held||g.kind==='camera')V6.blockUntil=Date.now()+400;drawPinPageLinks8();
}
document.addEventListener('pointerup',e=>release6(e));document.addEventListener('pointercancel',e=>release6(e,true));
window.addEventListener('blur',()=>{gesture6=null;clearRelations6();clearTimeout(holdTimer6);$('#drag-ghost').classList.remove('visible');});
document.addEventListener('contextmenu',e=>{if(e.target.closest('.database,#preview,.outside-data-stage15'))e.preventDefault();});
document.addEventListener('wheel',e=>{
 if(document.body.classList.contains('entering-site'))return;
 if(V6.page==='home'&&!V6.pull)return;
 const lane=e.target.closest('.image-name-lane15');if(lane){e.preventDefault();lane.scrollLeft+=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*2.8;return;}
 if(e.target.closest('.outside-data-stage15')){e.preventDefault();V6.editorialZoom15=clamp6(V6.editorialZoom15*Math.exp(-e.deltaY*.001),.5,1.7);applyOutsideData15();return;}
 if(isArchive17())return;
 if(e.target.closest('#pin-panel,.filter-panel,#help-layer,.scale-controls7,.preview-window8,#utility-nav10,#top-actions11,#floating-nav'))return;
 const rail=e.target.closest('.linear-rail');if(rail){e.preventDefault();rail.scrollLeft+=e.deltaY+e.deltaX;drawPinPageLinks8();return;}
 if(V6.page!=='database'||V6.view==='grid'||V6.preview)return;e.preventDefault();V6.hover=null;updateEmphasis6();
 if(e.shiftKey){V6.zoom=clamp6(V6.zoom*Math.exp(-e.deltaY*.0012),.5,1.7);applyScale7();return;}
 if(V6.distance>.03)return;
 if(e.deltaY<0&&(doorAligned8()||e.target.closest('.room-door9'))){travelDoor14(1);return;}
 V6.zoom=clamp6(V6.zoom*Math.exp(-e.deltaY*.0007),.5,1.7);applyScale7();
},{passive:false});
document.addEventListener('keydown',e=>{
 if(e.target.closest('input,textarea,[contenteditable]'))return;
 if(e.key==='Escape'){if(!V6.preview&&typeof dismissLastPile19==='function'&&dismissLastPile19())return;if(!V6.preview&&V6.laneSelected16){V6.laneSelected16=null;syncLaneSelection16();}if(V6.preview)closePreview6(true);else if($('#help-layer').innerHTML){$('#help-layer').innerHTML='';V6.help=false;renderNav6();drawPinPageLinks8();}else if(V6.pinOpen){V6.pinOpen=false;renderPin6();renderNav6();}else{V6.focus=null;V6.hover=null;V6.menuOpen=false;updateEmphasis6();renderNav6();}return;}
 if(V6.preview&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();previewStep8(e.key==='ArrowLeft'?-1:1);return;}
 if(e.key==='Enter'&&e.target.closest('.flat-furniture12')){e.preventDefault();travelDoor14(0);return;}
 if(e.key==='Enter'&&e.target.closest('[data-record-id]')){e.preventDefault();const b=e.target.closest('[data-record-id]');selectRecord17(b.dataset.recordId,b);return;}
 if(e.key==='Enter'&&e.target.closest('.timeline-record16')){e.preventDefault();laneSelect16(e.target.closest('.timeline-record16').dataset.asset);return;}
 if(e.key==='Enter'&&e.target.closest('[data-asset]')){e.preventDefault();openPreview8(e.target.closest('[data-asset]').dataset.asset);return;}
 const house=e.target.closest('[data-house]');if(house&&V6.distance>.95){if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();carouselRole9(e.key==='ArrowLeft'?-1:1);return;}if(['Enter',' ','ArrowDown'].includes(e.key)){e.preventDefault();travelDoor14(0);return;}}
 if(V6.page==='database'&&V6.view==='space'&&V6.distance<.05&&!V6.preview){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();V6.yaw+=e.key==='ArrowLeft'?-8:e.key==='ArrowRight'?8:0;V6.pitch=clamp6(V6.pitch+(e.key==='ArrowUp'?8:e.key==='ArrowDown'?-8:0),-88,88);applySpace6();}if(['PageUp','PageDown'].includes(e.key)){e.preventDefault();travelDoor14(e.key==='PageUp'?1:0);}if(['+','=','-','w','s'].includes(e.key.toLowerCase())){e.preventDefault();stepScale7(['+','=','w'].includes(e.key.toLowerCase())?.1:-.1);}}
});
window.addEventListener('hashchange',route6);window.addEventListener('storage',e=>{if(e.key!==PIN_KEY6)return;try{const v=JSON.parse(e.newValue||'{}');PINS6=(v.items||[]).filter(p=>find6(p.id));PIN_NOTE6=v.note||'';PIN_POSITION8=v.panelPosition||null;renderPin6();renderNav6();}catch{}});
window.addEventListener('resize',()=>{drawPinLines6();applyScale7();clearRelations6();drawPinPageLinks8();});document.addEventListener('scroll',drawPinPageLinks8,{capture:true,passive:true});
route6();
