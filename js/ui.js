// Latian Ning Gym — Status tampilan (tab, view), toast, dialog konfirmasi, render(), banner, timer istirahat,
// file kalender .ics, dan gambar hasil latihan.

let tab="today",view=null,docRef=null,pushT=null,downloads=null,menuDay=0;
function toast(t){const el=$("toast");el.textContent=t;el.classList.add("show");clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove("show"),2400)}
// Dialog konfirmasi buatan sendiri: confirm() bawaan diblokir di sebagian WebView dan iframe.
// opts: [{l:"Label", v:nilaiKembali, cls:"primary|ghost danger"}]. Menutup dialog mengembalikan null.
function ask(title,msg,opts){return new Promise(res=>{
 const back=document.activeElement;const o=document.createElement("div");o.className="modal";
 o.innerHTML=`<div class="box" role="dialog" aria-modal="true" aria-labelledby="mdlT"><h3 id="mdlT">${esc(title)}</h3><p>${esc(msg)}</p><div class="mbtn">${opts.map((x,i)=>`<button class="${x.cls||"ghost"}" data-i="${i}">${esc(x.l)}</button>`).join("")}</div></div>`;
 const close=v=>{o.remove();document.removeEventListener("keydown",key);try{back&&back.focus()}catch(e){}res(v)};
 const key=e=>{if(e.key==="Escape")close(null)};
 o.addEventListener("click",e=>{const b=e.target.closest("button[data-i]");if(b)close(opts[+b.dataset.i].v);else if(e.target===o)close(null)});
 document.addEventListener("keydown",key);document.body.appendChild(o);o.querySelector("button").focus()})}
const yes=(title,msg,ok)=>ask(title,msg,[{l:ok||"Ya",v:true,cls:"primary"},{l:"Batal",v:false}]);
function heroArt(){return `<svg class="art" viewBox="0 0 200 200" aria-hidden="true"><circle cx="120" cy="110" r="78" fill="currentColor" opacity=".07"/><g transform="rotate(-28 110 110)" fill="currentColor"><rect x="20" y="102" width="180" height="10" rx="5" opacity=".55"/><rect x="34" y="56" width="18" height="102" rx="6" opacity=".85"/><rect x="56" y="70" width="14" height="74" rx="5" opacity=".5"/><rect x="150" y="70" width="14" height="74" rx="5" opacity=".5"/><rect x="168" y="56" width="18" height="102" rx="6" opacity=".85"/></g></svg>`}
const TABS=[["today","dumb","Latihan"],["food","food","Makan"],["prog","chart","Progres"],["plan","cal","Program"]];
function renderTabs(){$("tabs").innerHTML=TABS.map(([k,ic,l])=>`<button role="tab" data-tab="${k}" aria-selected="${tab===k&&!(view&&view.type!=="result")}">${svg(ic)}${l}</button>`).join("")}
function coachTip(){const i=Math.floor(Date.now()/864e5)%TIPS.length;return `<div class="coach kc k-te"><div class="ico">${svg("coach")}</div><div><b>Kata Coach</b><span>${TIPS[i]}</span></div></div>`}
function remBanner(){const r=S.rem;const now=new Date();if(!r.days.includes(now.getDay()))return "";if(S.sessions.some(s=>dk(s.date)===dk(now)))return `<div class="rem ok kc k-gr">${svg("check")}<div><b>Latihan hari ini beres</b><span>Makan protein dan tidur cukup supaya otot pulih.</span></div></div>`;const [hh,mm]=r.time.split(":").map(Number);const late=now.getHours()*60+now.getMinutes()>hh*60+mm;return `<div class="rem kc k-pu">${svg("bell")}<div><b>${late?"Jam ke gym sudah lewat":"Hari ini jadwal ke gym"}</b><span>${late?"Masih sempat, sesi ringkas 45 menit pun tetap berarti.":"Pukul "+r.time+". Bawa handuk, air minum, dan sepatu."}</span></div></div>`}
function render(){
renderTabs();
$("streak").innerHTML=`<i>${svg("fire")}</i>${weekStreak()}`;
const hr=new Date().getHours();$("greet").textContent=(hr<11?"Selamat pagi":hr<15?"Selamat siang":hr<18?"Selamat sore":"Selamat malam")+", siap latihan?";
$("act").style.display=(tab==="today"&&!view)?"":"none";
const v=$("view");
if(view&&view.type==="result"){v.innerHTML=resultHTML(view.id);return}
if(view&&view.type==="hist"){v.innerHTML=histHTML();return}
if(view&&view.type==="edit"){v.innerHTML=editHTML();return}
if(tab==="today")v.innerHTML=todayHTML();else if(tab==="food")v.innerHTML=foodHTML();else if(tab==="prog")v.innerHTML=progHTML();else v.innerHTML=planHTML();
}
let tLeft=90,tInt=null,TOT=90;
function showT(){const m=Math.floor(tLeft/60),s=tLeft%60;$("tval").textContent=m+":"+String(s).padStart(2,"0");$("tarc").setAttribute("stroke-dashoffset",String(94.2*(tInt?tLeft/TOT:1)))}
function startTimer(){clearInterval(tInt);tLeft=TOT;tInt=setInterval(()=>{tLeft--;showT();if(tLeft<=0){stopTimer();$("tlab").textContent="Waktunya set berikutnya";try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}}},1000);showT();$("timer").classList.add("run");$("tlab").textContent="Istirahat. Ketuk untuk berhenti"}
function stopTimer(){clearInterval(tInt);tInt=null;$("timer").classList.remove("run");tLeft=TOT;showT();$("tlab").textContent="Ketuk untuk istirahat"}
async function saveICS(){
 if(!downloads)return;if(!S.rem.days.length){toast("Pilih minimal satu hari dulu");return}
 const [hh,mm]=S.rem.time.split(":");const d=new Date();d.setHours(+hh,+mm,0,0);while(!S.rem.days.includes(d.getDay())||d<new Date())d.setDate(d.getDate()+1);
 const p2=n=>String(n).padStart(2,"0");const loc=x=>x.getFullYear()+p2(x.getMonth()+1)+p2(x.getDate())+"T"+p2(x.getHours())+p2(x.getMinutes())+"00";
 const end=new Date(d.getTime()+75*60000);const now=new Date();const stamp=now.getUTCFullYear()+p2(now.getUTCMonth()+1)+p2(now.getUTCDate())+"T"+p2(now.getUTCHours())+p2(now.getUTCMinutes())+"00Z";
 const ics=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Latian Ning Gym//ID","CALSCALE:GREGORIAN","BEGIN:VEVENT","UID:gym-"+Date.now()+"@latian-ning-gym","DTSTAMP:"+stamp,"DTSTART:"+loc(d),"DTEND:"+loc(end),"RRULE:FREQ=WEEKLY;BYDAY="+S.rem.days.map(i=>BY[i]).join(",")+";COUNT="+(S.rem.days.length*12),"SUMMARY:Latian Ning Gym","DESCRIPTION:Waktunya ke gym. Buka aplikasi Latian Ning Gym.","BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:Ke gym 30 menit lagi","TRIGGER:-PT30M","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
 try{const r=await downloads.save({filename:"pengingat-gym.ics",data:ics});if(r&&r.status==="saved")toast("Buka file untuk memasukkan ke Kalender")}catch(e){if(e&&e.code==="unavailable"){downloads=null;render()}}
}
async function shareImage(){
 const s=S.sessions.find(x=>x.id===(view&&view.id));if(!s||!downloads)return;
 try{await document.fonts.ready}catch(e){}
 const Wd=1080,Hd=1350,cv=document.createElement("canvas");cv.width=Wd;cv.height=Hd;const g=cv.getContext("2d");
 g.fillStyle=W[s.w].c==="A"?"#FC5200":"#2D3142";g.fillRect(0,0,Wd,Hd);
 g.fillStyle="rgba(255,255,255,.12)";g.beginPath();g.arc(860,300,330,0,Math.PI*2);g.fill();
 g.save();g.translate(820,300);g.rotate(-0.5);g.fillStyle="rgba(255,255,255,.92)";g.fillRect(-300,-14,600,28);g.fillStyle="#fff";[[-270,-150,60,300],[-200,-110,45,220],[155,-110,45,220],[210,-150,60,300]].forEach(r=>g.fillRect(...r));g.restore();
 const F=(w,sz)=>`${w} ${sz}px "Figtree",system-ui,sans-serif`;
 g.fillStyle="#fff";g.font=F(600,44);g.fillText(new Date(s.date).toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),80,140);
 g.font=F(800,170);g.fillText(W[s.w].n,80,330);
 const sets=Object.values(s.ex).reduce((a,b)=>a+b.length,0);
 [[fmt(vol(s)),"kg total volume"],[dur(s.dur),"durasi"],[String(sets),"set"],[String((s.prs||[]).length),"rekor pribadi"]].forEach((x,i)=>{const cx=80+(i%2)*480,cy=560+Math.floor(i/2)*230;g.font=F(800,130);g.fillText(x[0],cx,cy);g.font=F(600,44);g.globalAlpha=.9;g.fillText(x[1],cx,cy+60);g.globalAlpha=1});
 g.fillStyle="rgba(255,255,255,.3)";g.fillRect(80,920,920,3);g.fillStyle="#fff";
 let y=1000;g.font=F(700,52);(s.prs&&s.prs.length?s.prs.map(p=>"PR  "+p.n+"  "+p.t):[...new Set(Object.keys(s.ex).map(byK).filter(Boolean).map(e=>MUS[e.m]))].map(m=>"Melatih "+m)).slice(0,4).forEach(t=>{g.fillText(t,80,y);y+=72});
 g.font=F(700,40);g.globalAlpha=.85;g.fillText("Latian Ning Gym",80,Hd-70);g.globalAlpha=1;
 cv.toBlob(async b=>{if(!b)return;try{const r=await downloads.save({filename:"gym-"+dk(s.date)+".png",data:b});if(r&&r.status==="saved")toast("Gambar disimpan")}catch(e){if(e&&e.code==="unavailable"){downloads=null;render()}}},"image/png");
}
