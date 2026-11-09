/* V20 PIN joinery icons. Original frontal vectors; no perspective or furniture reuse. */
function pinIcon20(name, options = {}) {
  const ink = '#303735', white = '#FFFFFF', blue = '#00BEFF', lemon = '#FFFF00';
  const tones=['#89CAEA','#00BEFF','#FFFF00','#F1F0ED'],tone=tones.includes(options.tone)?options.tone:'#89CAEA';
  const silver=options.folder?tone:'#F1F0ED',tiffany=options.folder?'#F1F0ED':'#89CAEA';
  const icons = {
    cabinet: `<rect x="8" y="7" width="32" height="34" fill="${white}"/><path d="M6 4h36v4H6zM8 8h3v33H8zM37 8h3v33h-3z" fill="${silver}"/><path d="M11 19h26v2H11zM11 30h26v2H11zM7 41h34v3H7z" fill="${silver}"/><path d="M12 10h4v8h-4zM17 12h3v6h-3zM28 23h4v6h-4zM33 23h3v6h-3z" fill="${tiffany}"/><path d="M21 12h3v6h-3z" fill="${blue}"/><path d="M12 32h24v8H12z" fill="${silver}"/><path d="M21 35h6v2h-6z" fill="${lemon}"/><path d="M9 44v2M39 44v2"/>`,
    drawer: `<path d="M10 8h12l3 3h13v22H10z" fill="${tiffany}"/><path d="M15 6h19v23H15z" fill="${white}"/><path d="M18 11h11M18 15h11M18 19h8" opacity=".45"/><path d="M7 23h34v18H7z" fill="${silver}"/><path d="M9 23h30v4H9z" fill="${white}"/><path d="M20 30h8v3h-8z" fill="${lemon}"/><path d="M10 41v4M38 41v4M5 41h38"/>`,
    download: `<path d="M17 6h11l5 5v13H17z" fill="${white}"/><path d="M28 6v5h5" fill="${tiffany}"/><path d="M21 14h7M21 18h7" opacity=".42"/><path d="M24 22v10M19 28l5 5 5-5" fill="none" stroke="${blue}" stroke-width="1.25"/><path d="M8 28h6v7h20v-7h6v13H8z" fill="${silver}"/><path d="M10 41v4M38 41v4M7 45h34"/><path d="M21 37h6v2h-6z" fill="${lemon}"/>`,
    compare: `<path d="M5 7h38v34H5z" fill="${silver}"/><path d="M9 11h13v24H9zM26 11h13v24H26z" fill="${white}"/><path d="M10 12h11v7H10zM27 12h11v7H27z" fill="${tiffany}"/><path d="M24 7v34M9 23h13M26 23h13"/><path d="M18 27v4M30 27v4" stroke="${blue}" stroke-width="1.2"/><path d="M5 41v4M43 41v4M3 7h42"/><path d="M22.5 4h3v3h-3z" fill="${lemon}"/>`,
    note: `<path d="M7 12h34v4H7zM9 16h30v24H9z" fill="${silver}"/><path d="M13 6h19l5 5v21H13z" fill="${white}"/><path d="M32 6v5h5" fill="${tiffany}"/><path d="M18 15h13M18 20h13M18 25h8" opacity=".5"/><path d="M10 40v5M38 40v5M8 45h32"/><path d="M21 35h6v2h-6z" fill="${lemon}"/>`,
    move: `<path d="M12 29h24v11H12z" fill="${silver}"/><path d="M11 27h26v3H11z" fill="${white}"/><path d="M15 40v5M33 40v5M22 33h4v2h-4z" fill="${lemon}"/><path d="M24 5v18M15 14h18M21 8l3-3 3 3M21 20l3 3 3-3M18 11l-3 3 3 3M30 11l3 3-3 3" fill="none" stroke="${blue}" stroke-width="1.1"/>`,
    resize: `<path d="M9 8h30v32H9z" fill="${white}"/><path d="M7 5h34v4H7zM9 9h3v31H9zM36 9h3v31h-3zM8 40h32v3H8z" fill="${silver}"/><path d="M12 29h24v2H12z" fill="${tiffany}"/><path d="M17 24 31 10M25 10h6v6M17 18v6h6" fill="none" stroke="${blue}" stroke-width="1.1"/><path d="M32 34h3v3h-3z" fill="${lemon}"/><path d="M11 43v3M37 43v3"/>`
  };
  const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const size = Number.isFinite(Number(options.size)) ? Math.max(12, Math.min(256, Number(options.size))) : 48;
  const label = options.label || options.title;
  const accessible = label ? `role="img" aria-label="${escape(label)}"` : 'aria-hidden="true"';
  const className = options.className ? ` class="${escape(options.className)}"` : '';
  return `<svg${className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="${size}" height="${size}" ${accessible} focusable="false"><g fill="none" stroke="${ink}" stroke-width=".8" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.cabinet}</g></svg>`;
}
function folderTone21(value,index=0){const colors=['#89CAEA','#00BEFF','#FFFF00','#F1F0ED'];return colors.includes(value)?value:colors[index%colors.length];}
