// Latian Ning Gym — Perhitungan: minggu & fase program, latihan berikutnya, rekor, volume, berat, BMI,
// target kalori/protein, minggu beruntun, urutan sesi, dan hitung ulang rekor.

function weekStart(d){const x=new Date(d);x.setHours(0,0,0,0);x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
function prog(){if(!S.prog)return null;const wk=Math.floor((weekStart(new Date())-weekStart(new Date(S.prog.start)))/6048e5)+1;return{wk,ph:wk<=4?0:wk<=8?1:2,done:wk>12}}
const phIdx=()=>{const p=prog();return p?p.ph:0};
function nextW(){const l=S.sessions[0];return l?ORDER[(ORDER.indexOf(l.w)+1)%4]:"UA"}
function lastFor(k){for(const s of S.sessions){const x=s.ex&&s.ex[k];if(x&&x.length)return x}return null}
function best(k,skip){let bw=0,br=0;S.sessions.forEach(s=>{if(s.id===skip)return;(s.ex[k]||[]).forEach(z=>{const v=Number(z.v)||0,r=Number(z.r)||0;if(v>bw)bw=v;if(r>br)br=r})});return{bw,br}}
function isPR(e,v,r){const has=S.sessions.some(s=>s.ex[e.k]);if(!has)return false;const b=best(e.k);return e.w&&e.k!=="pullup"?(Number(v)>b.bw&&Number(r)>0):(Number(r)>b.br)}
function vol(s){let t=0;Object.entries(s.ex).forEach(([k,a])=>{const e=byK(k);if(e&&e.w&&e.u==="rep"&&k!=="pullup")a.forEach(z=>t+=(Number(z.v)||0)*(Number(z.r)||0))});return t}
function newDraft(w){const ph=phIdx();const sets={};W[w].ex.forEach(e=>{const last=lastFor(e.k);const v=last&&last.length?last[0].v:"";sets[e.k]=Array.from({length:PH[ph].sets},()=>({v:e.w?v:"",r:"",done:false}))});return{w,sets,start:null,ph,warm:false,fin:false}}
const curW=()=>{const a=[...S.weights].sort((x,y)=>x.d<y.d?1:-1);return a.length?a[0].kg:S.prof.w0};
const bmi=kg=>kg/((S.prof.h/100)**2);
const protein=()=>Math.round(1.8*curW()/5)*5;
// Target kalori: BMR Mifflin-St Jeor × 1,55 (aktif 4 sesi/minggu) − 500 kkal untuk turun ±0,5 kg/minggu.
function kcal(){const p=S.prof;if(!p.sex||!p.age)return null;const bmr=10*curW()+6.25*p.h-5*p.age+(p.sex==="m"?5:-161);const tdee=bmr*1.55;
 return{tdee:Math.round(tdee/50)*50,t:Math.max(p.sex==="m"?1500:1200,Math.round((tdee-500)/50)*50)}}
function weekStreak(){let n=0;const ws=weekStart(new Date());for(let i=0;i<104;i++){const a=new Date(ws);a.setDate(a.getDate()-7*i);const b=new Date(a);b.setDate(b.getDate()+7);const c=S.sessions.filter(s=>{const d=new Date(s.date);return d>=a&&d<b}).length;if(c>=4)n++;else if(i===0)continue;else break}return n}
// ===== Urutan sesi, fase per tanggal, dan rekor pribadi =====
const p2=n=>String(n).padStart(2,"0");
const locDT=d=>{const x=new Date(d);return dk(x)+"T"+p2(x.getHours())+":"+p2(x.getMinutes())};
function phAt(d){if(!S.prog)return 0;const wk=Math.floor((weekStart(d)-weekStart(new Date(S.prog.start)))/6048e5)+1;return wk<=4?0:wk<=8?1:2}
function sortS(){S.sessions.sort((a,b)=>a.date<b.date?1:-1)}
// Hitung ulang rekor pribadi semua sesi secara kronologis, sama seperti aturan saat menyimpan latihan.
function recalcPRs(){const bW={},bR={};[...S.sessions].sort((a,b)=>a.date<b.date?-1:1).forEach(s=>{const prs=[];Object.entries(s.ex).forEach(([k,a])=>{const e=byK(k);if(!e)return;const mv=Math.max(0,...a.map(z=>Number(z.v)||0)),mr=Math.max(0,...a.map(z=>Number(z.r)||0)),wt=e.w&&k!=="pullup";if(k in bW&&(wt?mv>bW[k]:mr>bR[k]))prs.push({n:e.n,t:wt?fmt(mv)+" kg":mr+(e.u==="detik"?" dtk":" rep")});bW[k]=Math.max(bW[k]||0,mv);bR[k]=Math.max(bR[k]||0,mr)});s.prs=prs})}
