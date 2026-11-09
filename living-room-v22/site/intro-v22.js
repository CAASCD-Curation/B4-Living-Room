/* The first page is a frontal drawing, sharing the same door as the archive. */
(()=>{
 const sessionKey=KEY+'-entered-v20';let entered=false;try{entered=sessionStorage.getItem(sessionKey)==='1'}catch{}
 if(entered||!['','#home'].includes(location.hash)){document.body.classList.remove('intro-pending');return;}
 V6.page='entry';document.body.classList.remove('intro-pending');document.body.classList.add('entering-site');
 $('#app').innerHTML=`<section class="flat-entry12" id="content" aria-label="房屋入口"><header><span>几分熟</span><small>GUEST / COMPANION / HOST</small></header><div class="entry-house12">${flatHouse12('all',{intro:true})}<button class="flat-entry-door12" style="left:${ENTRY_HOUSE17.door[0]/640*100}%;top:${ENTRY_HOUSE17.door[1]/560*100}%;width:${ENTRY_HOUSE17.door[2]/640*100}%;height:${ENTRY_HOUSE17.door[3]/560*100}%" aria-label="开门进入首页">${iconSVG6('arrow')}</button></div><footer><span>01 / COME INSIDE</span><p>点一下门，从一间房开始。</p><small>点门 / 向下滚动 / Enter</small></footer></section>`;
 const entry=$('.flat-entry12'),door=$('.flat-entry-door12');let running=false,frame=0,finished=false;
 function finish(){if(finished)return;finished=true;cancelAnimationFrame(frame);document.removeEventListener('keydown',key);entry.removeEventListener('wheel',wheel);try{sessionStorage.setItem(sessionKey,'1')}catch{}V6.pull=false;document.body.classList.remove('entering-site');homePage();$('#cord')?.focus({preventScroll:true});}
 function enter(){if(running)return;running=true;entry.classList.add('door-opening');door.disabled=true;const start=performance.now(),duration=reduce.matches?220:1150;const tick=now=>{const p=clamp6((now-start)/duration,0,1);setFlatDoor12(entry,smooth8(p/.62));entry.style.setProperty('--entry-progress',String(smooth8((p-.64)/.36)));if(p<1)frame=requestAnimationFrame(tick);else finish();};frame=requestAnimationFrame(tick);}
 const key=e=>{if(V6.page!=='entry')return;if(['Enter',' ','ArrowDown','PageDown'].includes(e.key)){e.preventDefault();enter();}};
 const wheel=e=>{e.preventDefault();if(e.deltaY>0)enter();};
 door.addEventListener('click',enter);entry.addEventListener('wheel',wheel,{passive:false});document.addEventListener('keydown',key);window.addEventListener('hashchange',()=>{if(!finished){finished=true;cancelAnimationFrame(frame);document.removeEventListener('keydown',key);document.body.classList.remove('entering-site');}},{once:true});
 door.focus({preventScroll:true});
})();
