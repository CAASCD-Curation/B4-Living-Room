/* Timeline dates come from the supplied record, never from an artist's lifespan. */
const cleanTitle13=title=>String(title||'').replace(/[《》〈〉「」『』“”"‘’]/g,'').trim();
function timelineDate13(a){
 if(a.sourceDateUnknown15)return {year:null,label:"未注明",raw:a.originalRecord15?.year||"",basis:"图片版本或年代未核实，不以原表日期冒充作品定年"};
 if(a.id==='M-B3')return {year:1573,label:'1573–1620',raw:'明万历时期',basis:'原资料标为明万历时期；按区间起点排序，不作为精确创作年'};
 const recorded=String(a.year||'').trim(),source=String(a.source||'');
 const explicitSource=['A','B','C','O'].includes(a.sourceGroup)||['M-D14','M-D15'].includes(a.id);
 const raw=recorded||(explicitSource?source:''),match=raw.match(/(?:1[0-9]{3}|20[0-9]{2})/);
 if(!match)return {year:null,label:'未注明',raw:recorded,basis:'原资料没有可确认的年份'};
 const year=Number(match[0]),tail=raw.slice(match.index+4),range=/^\s*(?:年代|s|[–—/-]\s*\d)/i.test(tail);
 return {year,label:String(year),raw:recorded||source,basis:(recorded?'原年份字段':'原来源明确标注')+(range?'；按区间起始年定位，原始日期保留在介绍中':'')};
}
function chronology13(pool){return pool.map((a,i)=>({a,i,date:timelineDate13(a)})).sort((a,b)=>(a.date.year??Infinity)-(b.date.year??Infinity)||a.i-b.i).map(v=>v.a);}
function timelineBounds13(pool){const years=pool.map(timelineDate13).map(v=>v.year).filter(v=>v!==null);return years.length?[Math.min(...years),Math.max(...years)]:['未注明','未注明'];}
function guideItems7(pool){return chronology13(pool).map(a=>{const date=timelineDate13(a),title=cleanTitle13(a.title);return `<div class="linear-item timeline-item13" data-entry="${esc(a.id)}" data-timeline-year="${date.year??''}">${card6(a)}<span class="timeline-name13" title="${esc(title)}">${esc(title)}</span>${date.year===null?'<span class="timeline-year13 undated13">未注明</span>':`<time class="timeline-year13" datetime="${date.year}" title="${esc(date.basis+'：'+date.raw)}">${date.year}</time>`}</div>`;}).join('');}
