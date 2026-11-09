/* Silver carved frames: the same fine joinery, pale paint and blue glass as the house. */
let frameSerial22=0;
function frameOrnament22(kind='grand'){
  const grand=kind!=='small',id='oil22-'+(++frameSerial22),corner=id+'-corner',horizontal=id+'-horizontal',vertical=id+'-vertical';
  const cornerDrawing=grand?`
    <path class="oil-corner-ground22" d="M2 2H78V13H45C35 13 33 19 29 24L24 29C19 33 13 35 13 45V78H2Z"/>
    <path class="oil-cut22" d="M5 72V5H72M9 69V9H69M14 57V39C14 29 29 14 39 14H57"/>
    <path class="oil-reed22" d="M18 69V42M21 58V42M42 18H69M42 21H58"/>
    <path class="oil-leaf22" d="M26 22C31 9 45 9 51 18C42 17 35 21 30 27C42 20 52 22 56 30C44 28 37 29 30 33M22 26C9 31 9 45 18 51C17 42 21 35 27 30C20 42 22 52 30 56C28 44 29 37 33 30"/>
    <path class="oil-cut22" d="M29 24C37 17 43 17 48 18M24 29C17 37 17 43 18 48M33 29C40 25 47 26 52 29M29 33C25 40 26 47 29 52"/>
    <path class="oil-scroll22" d="M35 14C45 4 61 10 58 19C56 25 48 24 48 20C48 17 52 16 54 18M14 35C4 45 10 61 19 58C25 56 24 48 20 48C17 48 16 52 18 54"/>
    <path class="oil-highlight22" d="M5 74V5H74M15 39C15 29 29 15 39 15M27 22C34 13 42 12 48 17M22 27C13 34 12 42 17 48"/>
    <path class="oil-rosette22" d="M20 13C23 13 23 17 23 18C27 14 31 17 28 21C32 21 33 26 28 27C30 31 26 34 23 30C22 35 17 34 17 29C13 32 10 28 14 25C9 24 10 19 15 19C12 15 16 12 20 16Z"/>
    <circle class="oil-rosette-eye22" cx="21" cy="24" r="3.1"/>
    <path class="oil-cut22" d="M16.5 24H25.5M21 19.5V28.5"/>
    <path class="oil-blue-inlay22" d="M7 38V58M38 7H58"/>
  `:`
    <path class="oil-corner-ground22" d="M1 1H23V5H8L5 8V23H1Z"/>
    <path class="oil-cut22" d="M2.5 20V2.5H20M5 5L9 9M8 19V9H19"/>
    <path class="oil-highlight22" d="M4 21V4H21"/>
  `;
  const defs=grand?`
    <pattern id="${horizontal}" width="92" height="14" patternUnits="userSpaceOnUse">
      <path class="oil-rail-leaf22" d="M6 7H86M22 7C29 0 38 1 43 7C34 10 28 11 22 7ZM49 7C55 1 64 0 71 7C65 11 58 10 49 7Z"/>
      <path class="oil-rail-vein22" d="M25 6.5L40 7M52 7L68 6.5"/>
    </pattern>
    <pattern id="${vertical}" width="14" height="92" patternUnits="userSpaceOnUse">
      <path class="oil-rail-leaf22" d="M7 6V86M7 22C0 29 1 38 7 43C10 34 11 28 7 22ZM7 49C1 55 0 64 7 71C11 65 10 58 7 49Z"/>
      <path class="oil-rail-vein22" d="M6.5 25L7 40M7 52L6.5 68"/>
    </pattern>`:'';
  const rail=grand?`
    <svg class="oil-carving22 oil-carving22--top" aria-hidden="true" focusable="false"><rect width="100%" height="14" fill="url(#${horizontal})"/></svg>
    <svg class="oil-carving22 oil-carving22--bottom" aria-hidden="true" focusable="false"><rect width="100%" height="14" fill="url(#${horizontal})"/></svg>
    <svg class="oil-carving22 oil-carving22--left" aria-hidden="true" focusable="false"><rect width="14" height="100%" fill="url(#${vertical})"/></svg>
    <svg class="oil-carving22 oil-carving22--right" aria-hidden="true" focusable="false"><rect width="14" height="100%" fill="url(#${vertical})"/></svg>`:'';
  const view=grand?'0 0 80 80':'0 0 24 24';
  return `<span class="oil-ornament22 oil-ornament22--${grand?'grand':'small'}" aria-hidden="true"><svg class="oil-defs22" aria-hidden="true" focusable="false"><defs><g id="${corner}">${cornerDrawing}</g>${defs}</defs></svg><i class="oil-moulding22 oil-moulding22--outer"></i><i class="oil-moulding22 oil-moulding22--inner"></i>${rail}${['tl','tr','br','bl'].map(position=>`<svg class="oil-corner22 oil-corner22--${position}" viewBox="${view}" aria-hidden="true" focusable="false"><use href="#${corner}"/></svg>`).join('')}${grand?'<i class="oil-keystone22 oil-keystone22--top"></i><i class="oil-keystone22 oil-keystone22--bottom"></i>':''}</span>`;
}
