// Latian Ning Gym — Ikon SVG (objek I, svg()) dan ilustrasi peregangan/panduan coach (fig(), ill()).

const I={
dumb:'<path d="M3 10v4M6.5 7.5v9M17.5 7.5v9M21 10v4M6.5 12h11" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
chart:'<path d="M4 20V11M10 20V5M16 20v-6M21 20H3" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
clock:'<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
face:'<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.5 14.5c1.8 2 5.2 2 7 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="9" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/>',
cal:'<rect x="4" y="5.5" width="16" height="14.5" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
check:'<path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
legs:'<path d="M9 3v6.5c0 2-1.5 4-1.5 6.5L7 21M15 3v6.5c0 2 1.5 4 1.5 6.5L17 21M9 9h6" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
chest:'<path d="M3.5 8c2.5-3 6-3 8.5 0 2.5-3 6-3 8.5 0v3.5c-2 4-6 5-8.5 3-2.5 2-6.5 1-8.5-3z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><path d="M12 8v6" stroke="currentColor" stroke-width="2"/>',
back:'<path d="M12 3v18M7.5 5.5c-2.5 4-2.5 9 0 13.5M16.5 5.5c2.5 4 2.5 9 0 13.5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
shoulder:'<path d="M3.5 15c0-5 4-8.5 8.5-8.5s8.5 3.5 8.5 8.5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M7.5 15v5M16.5 15v5M12 3.5v3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
arms:'<path d="M5 20c1.5-6 3-10 7.5-12.5 3-1.5 6 .5 5 3.8-.8 2.4-3.6 2.6-4.8 1" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/>',
core:'<rect x="7.5" y="3.5" width="9" height="17" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7.5 9h9M7.5 14.5h9M12 3.5v17" stroke="currentColor" stroke-width="2"/>',
trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5c0 3 1.5 4.5 3.7 4.8M16 6h3.5c0 3-1.5 4.5-3.7 4.8M12 13v4M8.5 20h7" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
fire:'<path d="M12 21c-4 0-6.5-2.6-6.5-6.2 0-3.4 2.7-5.4 3.7-8.8 2.2 1.4 3 3.3 3 4.8 1-.8 1.6-2 1.7-3.4 2.5 1.9 4.6 4.6 4.6 7.6 0 3.6-2.5 6-6.5 6z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
moon:'<path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
drop:'<path d="M12 3.5c3 4 6 7 6 10.5a6 6 0 0 1-12 0c0-3.5 3-6.5 6-10.5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
salt:'<path d="M8 9h8l-1 11H9zM9 9c0-3 1-5.5 3-5.5S15 6 15 9" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="12" cy="6.5" r=".9" fill="currentColor"/>',
cup:'<path d="M6 7h12l-1.5 13h-9zM9.5 7l1-3.5h4" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M7 12h10" stroke="currentColor" stroke-width="2"/>',
bike:'<circle cx="6" cy="16" r="3.5" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="16" r="3.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 16l4-7h5l3 7M10 9l2 7h6M9 6h3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
sun:'<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round" stroke-linecap="round"/>',
share:'<path d="M12 15V4M8 8l4-4 4 4M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'};
const svg=(k,cls)=>`<svg viewBox="0 0 24 24" aria-hidden="true"${cls?` class="${cls}"`:""}>${I[k]}</svg>`;

Object.assign(I,{
food:'<path d="M4 11h16a8 8 0 0 1-16 0zM8 7c0-2 1-3 2-3M12 7c0-2 1-3 2-3M16 7c0-2 1-3 2-3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
scale:'<rect x="3.5" y="4" width="17" height="16" rx="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.5 9.5a5 5 0 0 1 7 0L12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>',
ban:'<circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M6 6l12 12" stroke="currentColor" stroke-width="2"/>',
coach:'<circle cx="12" cy="7.5" r="3.5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M5 20c.5-4 3.3-6.5 7-6.5s6.5 2.5 7 6.5M15 4.5l4-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>'});
I.x='<path d="M7 7l10 10M17 7L7 17" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
I.play='<rect x="2.5" y="5" width="19" height="14" rx="4" fill="currentColor" stroke="none"/><path d="M10 9v6l5-3z" fill="#fff" stroke="none"/>';
const FG={
quad:`<circle cx="30" cy="10" r="5" fill="currentColor" stroke="none"/><path d="M30 16v20M30 36v22M30 36l6 10 10-8M30 22l13 14M30 22l-9 9"/><path d="M14 59h36" opacity=".3"/>`,
ham:`<circle cx="38" cy="30" r="5" fill="currentColor" stroke="none"/><path d="M16 52l18-17M16 52h38M32 38l18 12"/><path d="M8 57h50" opacity=".3"/>`,
hip:`<circle cx="10" cy="46" r="5" fill="currentColor" stroke="none"/><path d="M16 47h20M36 47l8-12 8 12M36 47l10-6 6-2M22 47l18-8"/><path d="M4 55h56" opacity=".3"/>`,
chest:`<rect x="50" y="4" width="6" height="56" rx="2" fill="currentColor" stroke="none" opacity=".35"/><circle cx="26" cy="11" r="5" fill="currentColor" stroke="none"/><path d="M26 17v21M26 38l-4 20M26 38l5 20M26 22l23-3M26 22l-8 10"/>`,
shoulder:`<circle cx="32" cy="10" r="5" fill="currentColor" stroke="none"/><path d="M32 16v22M32 38l-4 20M32 38l4 20M32 22H16M32 23l-6 6-7-4"/><path d="M14 59h36" opacity=".3"/>`,
calf:`<rect x="54" y="4" width="6" height="56" rx="2" fill="currentColor" stroke="none" opacity=".35"/><circle cx="44" cy="13" r="5" fill="currentColor" stroke="none"/><path d="M42 19L30 38M40 22l13-1M30 38l8 9-2 11M30 38L14 58"/><path d="M8 59h44" opacity=".3"/>`,
walk:`<circle cx="32" cy="10" r="5" fill="currentColor" stroke="none"/><path d="M32 16l-2 20M30 36l-8 22M30 36l10 10v12M31 22l-10 10M31 22l9 9"/><path d="M8 59h48" opacity=".3"/>`};
const SA='fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const fig=k=>`<svg viewBox="0 0 64 64" aria-hidden="true" ${SA}>${FG[k]}</svg>`;
const TX=(x,y,t,a,z)=>`<text x="${x}" y="${y}" text-anchor="${a||"middle"}" fill="currentColor" stroke="none" font-size="${z||13}" font-weight="700" font-family="Figtree,system-ui,sans-serif">${t}</text>`;
const glass=(x,lv)=>`<path d="M${x} 22h40l-5 58H${x+5}z"/><path d="M${x+2+lv*.1} ${80-lv*.55}h${36-lv*.2}l${-(3-lv*.03)} ${lv*.55}H${x+5}z" fill="currentColor" stroke="none" opacity=".35"/>`;
function ill(k){let s="";
 if(k==="stretch")s=`<g transform="translate(50,8) scale(1.6)">${FG.quad}</g><g transform="translate(180,8) scale(1.6)">${FG.ham}</g>`;
 if(k==="cool")s=`<g transform="translate(40,8) scale(1.6)">${FG.walk}</g><path d="M168 46c0-8 12-11 16-2 4-9 16-6 16 2 0 10-16 20-16 20s-16-10-16-20z" fill="currentColor" stroke="none" opacity=".85"/><path d="M214 40h14l7-14 9 30 8-16h24" /><path d="M262 74l14 14 14-14M276 62v26"/>${TX(200,108,"Detak jantung turun perlahan")}`;
 if(k==="water")s=`${glass(45,100)}${glass(140,35)}${glass(235,80)}${TX(65,98,"Sebelum")}${TX(65,112,"2 gelas",0,11)}${TX(160,98,"Selama")}${TX(160,112,"seteguk-seteguk",0,11)}${TX(255,98,"Sesudah")}${TX(255,112,"2–3 gelas",0,11)}`;
 if(k==="food")s=`<circle cx="95" cy="58" r="46"/><path d="M95 12v92M95 58h46"/><path d="M95 12a46 46 0 0 0 0 92z" fill="currentColor" stroke="none" opacity=".18"/>${TX(70,62,"Sayur")}${TX(119,40,"Protein",0,11)}${TX(119,84,"Karbo",0,11)}<circle cx="240" cy="52" r="34"/><path d="M240 30v22l14 10"/>${TX(240,108,"2–3 jam sebelum latihan")}`;
 if(k==="shower")s=`<path d="M60 12h40v14M80 26h-24a14 14 0 0 1 28 0"/><path d="M64 40l-4 12M76 40l-2 14M88 40l2 12M70 60l-3 10M84 60l2 10" opacity=".7"/><g transform="translate(30,44) scale(1)"><circle cx="50" cy="34" r="6" fill="currentColor" stroke="none" opacity=".4"/></g><circle cx="230" cy="54" r="32"/><path d="M230 32v22h16"/><path d="M222 14h16"/>${TX(230,108,"Tunggu 10–15 menit")}${TX(80,108,"Air biasa atau hangat")}`;
 return `<svg viewBox="0 0 320 116" role="img" aria-hidden="true" ${SA}>${s}</svg>`}
