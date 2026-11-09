/* Editorial English translations; the supplied titles, sources and dates are untouched. */
const EDITORIAL_TITLES14=Object.fromEntries(`
M-A1|The Ambassadors
M-A2|Las Meninas
M-A3|The Music Lesson
M-A4|A Dutch Interior
M-A5|Interior
M-A6|The Yellow Interior
M-A7|The Broken Pitcher
M-A8|Interior
M-A9|Intimacy
M-A10|Sunlight in the Living Room III
M-A12|The Pink Nude
M-A13|Interior with a Portrait
M-A14|Bedroom on Ainmillerstrasse
M-A15|Schiele's Room in Neulengbach
M-A16|Room in New York
M-A17|The Red Studio
M-A18|A Corner of the Apartment
M-A19|Interior with Women beside a Linen Cupboard
M-A20|The Bellelli Family
M-A21|Prayer before Lunch
M-A22|Interior with the Artist's Mother and Sister
M-A23|The Bathroom
M-A24|Mrs Acorn's Living Room
M-A25|Interior at Nice
M-A26|The Painter's Room
M-A27|Slow Dance
M-A28|Interior, Strandgade 30
M-A29|The Round Table
M-A30|The Mérode Altarpiece
M-A31|Saint Jerome in His Study
M-A32|Woman Reading a Letter
M-A33|As the Old Sing, So Pipe the Young
M-A34|The Strode Family
M-A36|Woman at a Window
M-A37|Women of Algiers
M-A38|The Balcony Room
M-A39|Young Man at the Piano
M-A40|They Did Not Expect Him
M-A41|The Daughters of Edward Darley Boit
M-A42|Young Girls at the Piano
M-A43|The Arnolfini Portrait
M-A44|The Love Letter
M-A45|Interiors in Delft
M-A46|Young Man at His Window
M-A47|Just What Is It That Makes Today's Homes So Different, So Appealing?
M-A48|Mr and Mrs Clark and Percy
M-A49|Bloodline: Big Family
M-A50|Waste Not
M-B1|The Wu Residence
M-B2|The Yin Residence
M-B3|The Hall of Ximen Qing
M-B4|Mrs Alving's Living Room
M-B5|Alice's Apartment
M-B6|Anna Pavlovna's Evening Salon
M-B7|Madame de Beauséant's Salon
M-B8|The Drawing Room at La Vaubyessard
M-B9|The Loisels' Small Living Room
M-B10|Raskolnikov's Attic Room
M-B11|The Old Drawing Room of Tess and Angel
M-B12|The Samsas' Living Room
M-B13|Juansheng's Small Home
M-B14|The Drawing Room
M-B15|The Helmers' Living Room
M-B16|The Ramsays' Seaside Drawing Room
M-B17|Ranevskaya's Drawing Room
M-B18|The Main Hall of the Qi Family
M-B19|Chen Bailu's Hotel Sitting Room
M-B20|A Victorian Country-House Drawing Room
M-B21|The Roman Salon of Gilbert Osmond
M-B22|The Father's Old Apartment
M-B23|The Tyrones' Summer Living Room
M-B24|Clarissa Dalloway's Drawing Room
M-B25|The Banquet Room at the Yumoto Inn
M-B26|The Shigiya Family's Living Room in Osaka
M-B27|Shunshun's Riverside Stilt House
M-B28|A Shared Living Room in Work-Unit Housing
M-B29|Fourth Uncle Lu's Main Hall
M-B30|The Yang Residence
M-B31|The Zeng Family's Small Reception Room
M-B32|The Jiang Family's Main Hall
M-B33|The Dou Residence
M-B34|Zhuang Zhidie's Living Room
M-B35|The Main Hall of the Old House
M-B36|Manilov's Living Room
M-B37|The Grandet Family's Main Hall
M-B38|The Marquis de La Mole's Salon
M-B39|Célimène's Salon
M-B40|The Oblonskys' Living Room
M-B41|The Tesmans' Drawing Room
M-B42|Lord Windermere's Drawing Room
M-B43|The Main Hall of Rongguo House
M-B44|The Zhou Residence
M-B45|Su Wenwan's Salon
M-B46|The Bai Residence
M-B47|The Gao Residence
M-B48|Madame Verdurin's Salon
M-B49|Gu Manzhen's Shikumen Dining Room
M-B50|The Three Sisters' Living Room
M-C14|A Living Room for Gathering
M-C15|The World Literature Living Room
M-C16|A Home without a Conventional Living Room
M-C17|City Living Room
M-C18|The Living Room as a Study
M-C19|A Home Shared with Pets
M-C20|The Home as a Live-Streaming Studio
M-C21|Working from Home as a Digital Nomad
M-C22|A Child-Friendly Living Room
M-C23|A Living Room for Zen and Tea
M-C24|A Long Table in Place of the Coffee Table
M-C25|A Restorative Room for Living Alone
M-C26|The Living Room at Spring Festival
M-C27|The Sunken Living Room
M-D2|A Show Home in Wuhan
M-D3|Pixel Gathering
M-D4|The Teahouse and the Pavilion
M-D5|One Close-Knit Family
M-D6|The Salon and the Café
M-D9|An IKEA Showroom
M-D10|The Ancestral Hall and the Main Hall
M-D11|The Central Comb of a Beehive
M-D12|A Shared Living Room in the Corridor
M-D14|The Living-Room Objects of The Sims
M-D15|The Cabinet of Dr Caligari
M-D16|The Unfinished Empty Living Room
M-D17|The Postmodern Cosmic House
M-D18|The Ancient Greek Andron
M-D19-guest|A Middle Eastern or South Asian Reception Room
M-D19-host|A Middle Eastern or South Asian Family Room
M-D34|The Japanese Tatami Room
M-D35|The Seoul House
M-D36|Central Perk in Friends
M-D37|A Danish Hygge Fireplace
M-D38|The Saloon of a Sailing Boat
M-D39|The Roof Terrace as a Living Room
M-D40|The Real-Estate Show Home
M-D41|Soft Palace in the Fun Palace Project
M-D42|The Cage
M-D43|The Television as a Hearth
M-D46|The Matchmaking Corner of a Park
M-D49|The Aircraft Cabin and the Train Carriage
M-O1|Dream House
M-O2|Living Rooms in Different Sizes
M-O3|The Lifted Roof
`.trim().split('\n').map(row=>{const i=row.indexOf('|');return [row.slice(0,i),row.slice(i+1)];}));
const editorialTitle14=a=>curation15(a).correctedEnglishTitle||EDITORIAL_TITLES14[a.id.trim()]||cleanTitle13(a.title);
const EDITORIAL_FACETS14={
 heat:['a quiet exchange','an exchange that keeps going','a lively exchange'],
 contact:['a single point of contact','a few shared surfaces','many overlapping parts of life'],
 depth:['a private world kept at a distance','personal habits coming into view','the freedom to feel at home'],
 agency:['a place to wait and watch','a chance to take part','the freedom to shape the room']
};
function editorialDescription14(a){const keys=Object.keys(FACET6),index=[...a.id.trim()].reduce((sum,ch)=>sum+ch.codePointAt(0),0)%4,one=keys[index],two=keys[(index+1)%4];return [one,two].map(k=>EDITORIAL_FACETS14[k][rank6(a,k)??1]).join(' and ');}
const ROOM_COPY14={
 all:{theme:'A room for all of us',parts:['Guests arrive, ',0,' companions stay, ',1,' and hosts make a little room. ',2,' A seat brings us closer; ',3,' a table holds our small routines. ',4,' There is a place to pause, ',5,' a place to listen, ',6,' and a place to change the way we sit together. ',7]},
 guest:{theme:'A place to be welcomed',parts:['A welcome begins ',0,' before we sit down. ',1,' This closed house keeps a little distance. ',2,' A chair is offered, ',3,' a table stands between us, ',4,' and a door can open. ',5,' Who may enter, ',6,' and who gets to choose a place? ',7]},
 companion:{theme:'A place beside you',parts:['We share a seat, ',0,' a surface, ',1,' and a little time. ',2,' Two windows open onto a familiar room. ',3,' The furniture makes space for conversation, ',4,' daily habits, ',5,' quiet company, ',6,' and the small distance between being close and being at home. ',7]},
 host:{theme:'A room we can shape',parts:['We know where to sit, ',0,' what to move, ',1,' and when to leave the light on. ',2,' This open house shows its furniture. ',3,' A seat can be claimed, ',4,' a surface shared, ',5,' a habit changed, ',6,' and a little room made for someone else. ',7]}
};
