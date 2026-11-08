// Latian Ning Gym — Titik awal: semua event handler, fallback unduhan, service worker, lalu render pertama.
// Dimuat paling akhir.

$("tabs").addEventListener("click",e=>{const b=e.target.closest("button[data-tab]");if(!b)return;tab=b.dataset.tab;view=null;render();window.scrollTo(0,0)});
$("view").addEventListener("click",e=>{
 const q=s=>e.target.closest(s);let b;
 if(q("button[data-startp]")){S.prog={start:new Date().toISOString()};S.draft=null;if(!S.weights.length)S.weights.push({d:dk(new Date()),kg:S.prof.w0});persist(true);tab="today";view=null;render();window.scrollTo(0,0);toast("Program dimulai. Minggu 1, fase Adaptasi. Semangat!");return}
 if(q("button[data-goprof]")){tab="plan";view=null;render();const c=$("profCard");if(c)c.scrollIntoView({block:"start"});return}
 if(q("button[data-stopp]")){yes("Hentikan program 3 bulan?","Riwayat latihan dan berat badan tetap tersimpan.","Hentikan").then(ok=>{if(!ok)return;S.prog=null;S.draft=null;persist(true);render()});return}
 if(b=q("button[data-day]")){const i=+b.dataset.day;S.rem.days=S.rem.days.includes(i)?S.rem.days.filter(x=>x!==i):S.rem.days.concat(i);persist(true);render();return}
 if(q("#icsBtn")){saveICS();return}
 if(b=q("button[data-delph]")){const id=b.dataset.delph;yes("Hapus foto ini?","Foto akan dihapus dari HP ini dan tidak bisa dikembalikan, kecuali ada di file cadangan.","Hapus").then(ok=>{if(ok)delPhoto(id)});return}
 if(q("#expBtn")){exportData();return}
 if(q("#profSave")){const h=+$("pH").value,w=+$("pW").value,t=+$("pT").value,a=+$("pA").value,sx=$("pS").value;
  if(!(h>=100&&h<=250)){toast("Tinggi badan harus 100–250 cm");return}
  if(!(w>=30&&w<=300&&t>=30&&t<=300)){toast("Berat dan target harus 30–300 kg");return}
  if(!sx){toast("Pilih jenis kelamin");return}
  if(!(a>=12&&a<=100)){toast("Usia harus 12–100 tahun");return}
  S.prof={h,w0:w,target:t,sex:sx,age:Math.round(a),set:true};persist(true);render();toast("Profil disimpan");return}
 if(q("#wSave")){const kg=+$("wIn").value,wa=+$("waIn").value;if(!(kg>30&&kg<250)){toast("Isi berat badan dulu");return}const tk=dk(new Date());S.weights=S.weights.filter(x=>x.d!==tk);S.weights.push({d:tk,kg,waist:wa>40?wa:undefined});persist(true);render();toast("Berat tercatat");return}
 if(b=q("button[data-air]")){const tk=dk(new Date());const f=S.food[tk]||{air:0,ok:[]};const n=+b.dataset.air;f.air=f.air===n?n-1:n;S.food[tk]=f;persist(true);render();return}
 if(b=q("button[data-rule]")){const tk=dk(new Date());const f=S.food[tk]||{air:0,ok:[]};const k=b.dataset.rule;f.ok=f.ok.includes(k)?f.ok.filter(x=>x!==k):f.ok.concat(k);S.food[tk]=f;persist(true);render();if(f.ok.length===RULES.length)toast("Semua larangan dipatuhi hari ini. Mantap!");return}
 if(b=q("button[data-menu]")){menuDay=+b.dataset.menu;render();return}
 if(b=q("button[data-flag]")){S.draft[b.dataset.flag]=!S.draft[b.dataset.flag];if(S.draft[b.dataset.flag]&&!S.draft.start)S.draft.start=Date.now();persist(false);render();return}
 if(b=q("button[data-w]")){const w=b.dataset.w;if(w===S.draft.w)return;const has=Object.values(S.draft.sets).some(a=>a.some(s=>s.done||s.r!==""));const go=()=>{S.draft=newDraft(w);persist(false);render()};if(has)yes("Ganti latihan?","Isian latihan "+W[S.draft.w].n+" yang belum disimpan akan hilang.","Ganti").then(ok=>{if(ok)go()});else go();return}
 if(b=q("button.chk[data-k]")){const s=S.draft.sets[b.dataset.k][+b.dataset.i];const ex=byK(b.dataset.k);if(!s.done&&s.r==="")s.r=String(ex.lo);s.done=!s.done;if(s.done&&!S.draft.start)S.draft.start=Date.now();persist(false);render();if(s.done){startTimer();if(isPR(ex,s.v,s.r))toast("Rekor pribadi baru: "+ex.n)}return}
 if(q("button[data-openhist]")){view={type:"hist"};render();window.scrollTo(0,0);return}
 if(q("button[data-back]")){view=null;tab="prog";render();window.scrollTo(0,0);return}
 if(b=q("button[data-open]")){view={type:"result",id:b.dataset.open};render();window.scrollTo(0,0);return}
 if(q("button[data-closeres]")){view=null;render();window.scrollTo(0,0);return}
 if(q("#shareBtn")){shareImage();return}
 if(b=q("button[data-calnav]")){calOff=Math.min(0,calOff+ +b.dataset.calnav);render();return}
 if(b=q("button[data-calday]")){const k=b.dataset.calday,ss=S.sessions.filter(s=>dk(s.date)===k);
  if(ss.length){view={type:"result",id:ss[0].id};render();window.scrollTo(0,0);return}
  const lbl=new Date(k+"T12:00").toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long"});
  yes("Catat latihan?","Belum ada latihan tercatat pada "+lbl+". Catat latihan yang lupa diisi untuk tanggal ini?","Catat latihan").then(ok=>{if(!ok)return;edNew(k,null);render();window.scrollTo(0,0)});return}
 if(q("button[data-newpast]")){edNew(null,view);render();window.scrollTo(0,0);return}
 if(b=q("button[data-edit]")){const s=S.sessions.find(x=>x.id===b.dataset.edit);if(s){edOpen(s,{type:"result",id:s.id});render();window.scrollTo(0,0)}return}
 if(q("button[data-edcancel]")){view=view.back||null;render();window.scrollTo(0,0);return}
 if(q("button[data-edsave]")){edSave();return}
 if(b=q("button[data-edw]")){const ed=view.ed;if(ed.w===b.dataset.edw)return;ed.w=b.dataset.edw;ed.ex=edSets(ed.w,phAt(new Date(ed.date||Date.now())));render();return}
 if(b=q("button[data-edadd]")){const a=view.ed.ex[b.dataset.edadd]=view.ed.ex[b.dataset.edadd]||[];a.push({v:a.length?a[a.length-1].v:"",r:""});render();return}
 if(b=q("button[data-edrm]")){view.ed.ex[b.dataset.edrm].splice(+b.dataset.i,1);render();return}
 if(q("button[data-edfin]")){view.ed.fin=!view.ed.fin;render();return}
 if(b=q("button[data-del]")){const id=b.dataset.del;yes("Hapus sesi ini?","Sesi akan dihapus dari riwayat, statistik, dan rekor pribadi.","Hapus").then(ok=>{if(!ok)return;S.sessions=S.sessions.filter(s=>s.id!==id);recalcPRs();view=null;persist(true);render();toast("Sesi dihapus")})}});
$("view").addEventListener("change",e=>{if(e.target.id==="exSel"){exSel=e.target.value;render();return}if(e.target.id==="phIn"&&e.target.files&&e.target.files[0]){addPhoto(e.target.files[0]);e.target.value="";return}if(e.target.id==="impIn"&&e.target.files&&e.target.files[0]){importData(e.target.files[0]);e.target.value="";return}if(e.target.id==="remTime"&&e.target.value){S.rem.time=e.target.value;persist(true);render();toast("Jam latihan disimpan")}});
$("view").addEventListener("input",e=>{const i=e.target;
 if(view&&view.type==="edit"){const ed=view.ed;if(i.id==="edDate")ed.date=i.value;else if(i.dataset.edm)ed[i.dataset.edm]=i.value;else if(i.dataset.edk)ed.ex[i.dataset.edk][+i.dataset.i][i.dataset.f]=i.value;return}
 if(i.dataset&&i.dataset.pp){S.draft[i.dataset.pp]=i.value;persist(false);return}if(!i.dataset||!i.dataset.k)return;S.draft.sets[i.dataset.k][+i.dataset.i][i.dataset.f]=i.value;persist(false)});
$("save").addEventListener("click",()=>{
 const d=S.draft;const ex={};let n=0;const id=String(Date.now());const prs=[];
 Object.entries(d.sets).forEach(([k,arr])=>{const done=arr.filter(s=>s.done||s.r!=="").map(s=>({v:s.v===""?"":Number(s.v),r:Number(s.r||0)}));if(done.length){ex[k]=done;n+=done.length;const e=byK(k);const had=S.sessions.some(s=>s.ex[k]);const b=best(k);if(had){if(e.w&&k!=="pullup"){const mv=Math.max(...done.map(z=>Number(z.v)||0));if(mv>b.bw)prs.push({n:e.n,t:fmt(mv)+" kg"})}else{const mr=Math.max(...done.map(z=>z.r));if(mr>b.br)prs.push({n:e.n,t:mr+(e.u==="detik"?" dtk":" rep")})}}}});
 if(!n){toast("Centang minimal satu set dulu");return}
 const du=d.start?Math.min(Math.round((Date.now()-d.start)/1000)+90,4*3600):null;
 const pre=Number(d.pre)>30?Number(d.pre):undefined,post=Number(d.post)>30?Number(d.post):undefined;
 S.sessions.unshift({id,date:new Date().toISOString(),w:d.w,ex,dur:du,prs,ph:d.ph||0,fin:d.fin,pre,post});
 S.draft=null;persist(true);stopTimer();view={type:"result",id,fresh:true};tab="today";render();window.scrollTo(0,0)});
$("timer").addEventListener("click",()=>tInt?stopTimer():startTimer());
if(!window.claude){downloads={save:async({filename,data})=>{const type=filename.endsWith(".ics")?"text/calendar":filename.endsWith(".json")?"application/json":"application/octet-stream";const blob=data instanceof Blob?data:new Blob([data],{type});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);return{status:"saved"}}}}
if("serviceWorker" in navigator&&location.protocol.startsWith("http")){window.addEventListener("load",()=>{navigator.serviceWorker.register("sw.js").catch(()=>{})})}
// Minta browser tidak menghapus data aplikasi saat ruang penyimpanan HP menipis.
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist().catch(()=>{})}catch(e){}
loadPhotos();
render();
(async()=>{try{if(!window.claude||!window.claude.use)return;
 window.claude.use("downloads").then(d=>{if(d){downloads=d;render()}}).catch(()=>{});
 const [d,u]=await Promise.all([window.claude.use("db"),window.claude.use("user")]);if(!d||!u)return;const id=await u.id();if(!id)return;
 docRef=d.collection("data/users/"+id).doc("gym");const snap=await docRef.get();
 if(snap.exists){const body=snap.data();const remote=JSON.parse(body.state||"null");if(remote&&Array.isArray(remote.sessions)&&(body.updated||0)>(S.updated||0)){S=clean(remote);try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}render();$("sync").textContent="Tersinkron ke akun Anda.";return}}
 if(S.sessions.length||S.weights.length||S.prog)await pushRemote();else $("sync").textContent="Tersinkron ke akun Anda.";
}catch(e){}})();
