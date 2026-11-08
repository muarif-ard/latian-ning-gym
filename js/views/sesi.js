// Latian Ning Gym — Detail sesi dan editor (edit sesi / catat latihan lampau).

function edSets(w,ph){const o={};W[w].ex.forEach(e=>{const l=lastFor(e.k);const v=e.w&&l&&l.length&&l[0].v!==""?String(l[0].v):"";o[e.k]=Array.from({length:PH[ph].sets},()=>({v,r:""}))});return o}
function edNew(day,back){const d=day?new Date(day+"T"+S.rem.time):new Date();if(d>new Date())d.setTime(Date.now());const w=nextW(),ph=phAt(d);view={type:"edit",id:null,back,ed:{w,date:locDT(d),ex:edSets(w,ph),dur:"",pre:"",post:"",fin:false}}}
function edOpen(s,back){const ex={};W[s.w].ex.forEach(e=>{ex[e.k]=(s.ex[e.k]||[]).map(z=>({v:z.v===""?"":String(z.v),r:String(z.r)}))});
 view={type:"edit",id:s.id,back,ed:{w:s.w,date:locDT(s.date),ex,dur:s.dur?String(Math.round(s.dur/60)):"",pre:s.pre?String(s.pre):"",post:s.post?String(s.post):"",fin:!!s.fin}}}
function editHTML(){
 const ed=view.ed,isNew=!view.id;
 const edf=(m,l,v,u,im,st)=>`<div class="fl"><label class="cap" for="ed_${m}">${l}</label><div class="field"><input id="ed_${m}" type="number" inputmode="${im}" step="${st}" min="0" data-edm="${m}" value="${esc(v)}"><span>${u}</span></div></div>`;
 let h=`<div class="edhead"><button class="ghost" data-edcancel="1">Batal</button><p class="done-lbl" style="margin:0">${isNew?"Catat latihan lampau":"Edit sesi"}</p></div>`;
 h+=`<section class="card kc k-pu"><div class="fl"><label class="cap" for="edDate">Tanggal dan jam latihan</label><input type="datetime-local" id="edDate" class="sel" value="${ed.date}" max="${locDT(new Date())}"></div>`;
 h+=isNew?`<div class="fl" style="margin-top:12px"><span class="cap">Jenis latihan</span><div class="seg" style="margin:0">${ORDER.map(k=>`<button data-edw="${k}" aria-pressed="${ed.w===k}">${W[k].n}</button>`).join("")}</div></div>`:`<p class="meta" style="margin:10px 0 0">Jenis latihan: <b style="color:var(--ink)">${W[ed.w].n}</b></p>`;
 h+=`</section>`;
 W[ed.w].ex.forEach(e=>{const a=ed.ex[e.k]||[];
  h+=`<section class="ex kc k-or"><div class="exh"><div class="ico t-${e.m}">${svg(e.m)}</div><div style="flex:1;min-width:0"><h3>${esc(e.n)}</h3><div class="meta"><span>Target ${e.r}</span>${a.length?"":"<span>Belum dicatat</span>"}</div></div></div>`;
  a.forEach((z,i)=>{h+=`<div class="set"><div class="n">${i+1}</div>${e.w?`<label class="field"><input inputmode="decimal" type="number" step="0.5" min="0" placeholder="0" aria-label="Beban set ${i+1} ${esc(e.n)}" data-edk="${e.k}" data-i="${i}" data-f="v" value="${esc(z.v)}"><span>kg</span></label>`:`<div class="bw">Berat badan</div>`}<label class="field"><input inputmode="numeric" type="number" min="0" placeholder="${e.lo}" aria-label="${e.u==="detik"?"Detik":"Repetisi"} set ${i+1} ${esc(e.n)}" data-edk="${e.k}" data-i="${i}" data-f="r" value="${esc(z.r)}"><span>${e.u==="detik"?"dtk":"rep"}</span></label><button class="chk rm" data-edrm="${e.k}" data-i="${i}" aria-label="Hapus set ${i+1} ${esc(e.n)}">${svg("x")}</button></div>`});
  h+=`<button class="ghost" data-edadd="${e.k}" style="margin-top:10px;width:100%">+ Tambah set</button></section>`});
 h+=`<section class="card kc k-gy"><h3>Lainnya <span class="chip t-chest" style="vertical-align:middle;margin-left:4px">Opsional</span></h3><div class="pgrid">${edf("dur","Durasi",ed.dur,"mnt","numeric","1")}${edf("pre","Berat sebelum",ed.pre,"kg","decimal","0.1")}${edf("post","Berat sesudah",ed.post,"kg","decimal","0.1")}</div><div class="habit" style="border:0;padding:12px 0 0"><div class="ico t-legs">${svg("bike")}</div><div><b>Kardio penutup dilakukan</b></div><button class="chk" data-edfin="1" aria-pressed="${ed.fin}" aria-label="Kardio penutup dilakukan">${svg("check")}</button></div></section>`;
 h+=`<p class="tip">Set dengan repetisi kosong tidak disimpan. Rekor pribadi dihitung ulang otomatis setelah disimpan.</p><div class="row"><button class="ghost" data-edcancel="1">Batal</button><button class="primary" data-edsave="1">Simpan</button></div>`;
 return h}
function edSave(){
 const ed=view.ed,isNew=!view.id,d=new Date(ed.date);
 if(!ed.date||isNaN(d.getTime())){toast("Isi tanggal dan jam latihan");return}
 if(d.getTime()>Date.now()+5*60000){toast("Tanggal latihan tidak boleh di masa depan");return}
 const ex={};let n=0;
 Object.entries(ed.ex).forEach(([k,a])=>{const e=byK(k);if(!e)return;const z=a.filter(x=>x.r!==""&&Number(x.r)>0).map(x=>({v:e.w&&x.v!==""&&isFinite(+x.v)&&+x.v>=0?+x.v:"",r:Math.round(+x.r)}));if(z.length){ex[k]=z;n+=z.length}});
 if(!n){toast("Isi repetisi minimal satu set");return}
 const rng=(x,a,b)=>{if(x===""||x==null)return undefined;x=Number(x);return x>=a&&x<=b?x:undefined};
 const old=isNew?null:S.sessions.find(s=>s.id===view.id);if(!isNew&&!old){view=null;render();return}
 const rec={id:isNew?String(Date.now()):old.id,date:d.toISOString(),w:ed.w,ex,dur:rng(ed.dur,1,600)?Math.round(ed.dur*60):null,prs:[],ph:isNew?phAt(d):old.ph,fin:!!ed.fin,pre:rng(ed.pre,30,300),post:rng(ed.post,30,300)};
 if(isNew)S.sessions.push(rec);else S.sessions[S.sessions.indexOf(old)]=rec;
 sortS();recalcPRs();persist(true);view={type:"result",id:rec.id};render();window.scrollTo(0,0);toast(isNew?"Latihan lampau tersimpan":"Perubahan disimpan")}
function resultHTML(id){
 const s=S.sessions.find(x=>x.id===id);if(!s)return "";
 const sets=Object.values(s.ex).reduce((a,b)=>a+b.length,0),reps=Object.values(s.ex).reduce((a,b)=>a+b.reduce((x,z)=>x+(Number(z.r)||0),0),0);
 const prs=s.prs||[];
 let h=`<p class="done-lbl">${view.fresh?"Latihan tersimpan":"Detail latihan"}</p>`+feedCard(s,false).replace('<div class="mchips">',`<div class="stats3" style="border-top:0;padding-top:0"><div><span>Repetisi</span><b>${reps}</b></div><div><span>Gerakan</span><b>${Object.keys(s.ex).length}</b></div><div><span>Fase</span><b>${PH[s.ph||0].n}</b></div></div><div class="mchips">`);
 if(s.pre)h+=`<section class="card kc k-bl"><h3>Berat badan</h3><div class="stats3" style="border-top:0"><div><span>Sebelum</span><b>${fmt(s.pre)} kg</b></div><div><span>Sesudah</span><b>${s.post?fmt(s.post)+" kg":"–"}</b></div><div><span>Cairan hilang</span><b>${s.post?fmt(s.pre-s.post)+" kg":"–"}</b></div></div>${s.post&&s.pre>s.post?`<p class="tip" style="margin:4px 0 0">Minum sekitar ${fmt((s.pre-s.post)*1.25)}–${fmt((s.pre-s.post)*1.5)} liter dalam beberapa jam ke depan untuk mengganti keringat.</p>`:""}</section>`;
 if(prs.length)h+=`<section class="card kc k-ye"><h3>Rekor pribadi baru</h3><ul class="prs">${prs.map(p=>`<li><span>${esc(p.n)}</span><b>${esc(p.t)}</b></li>`).join("")}</ul></section>`;
 h+=`<section class="card kc k-or"><h3>Rincian</h3><ul class="prs">${Object.keys(s.ex).map(byK).filter(Boolean).map(e=>`<li><span>${esc(e.n)}</span><span style="text-align:right;color:var(--muted)">${s.ex[e.k].map(z=>(e.w&&z.v!==""?fmt(z.v)+"×":"")+z.r).join(", ")}</span></li>`).join("")}</ul></section>`;
 h+=`<section class="card kc k-gr"><p style="margin:0">Setelah latihan, makan protein dalam 1–2 jam (misalnya nasi, ayam atau ikan, dan sayur), minum 2–3 gelas air, dan tidur cukup malam ini.</p></section>`;
 h+=`<div class="row"><button class="ghost" id="shareBtn" style="display:${downloads?"flex":"none"};align-items:center;justify-content:center;gap:8px">${svg("share")}<span>Simpan gambar</span></button><button class="primary" data-closeres="1">Tutup</button></div><div class="row"><button class="ghost" data-edit="${s.id}">Edit sesi</button><button class="ghost danger" data-del="${s.id}">Hapus sesi</button></div>`;
 return h;
}
