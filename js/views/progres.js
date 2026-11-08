// Latian Ning Gym — Halaman Progres: berat badan, foto, statistik, kalender, volume, per gerakan, riwayat, rekor, lencana.

function progHTML(){
 const ss=S.sessions,P=prog(),cw=curW(),b=bmi(cw);
 const ws=weekStart(new Date());const thisW=ss.filter(s=>new Date(s.date)>=ws).length;
 const ws2=[...S.weights].sort((x,y)=>x.d<y.d?-1:1);
 let h=`<section class="card kc k-bl"><h3>Berat badan</h3><div class="grid" style="margin-bottom:10px"><div class="stat"><b>${fmt(cw)} kg</b><span>Sekarang, target ${fmt(S.prof.target)} kg</span></div><div class="stat"><b>${fmt(b)}</b><span>BMI (${b<18.5?"kurang":b<25?"normal":b<30?"berlebih":"obesitas"})</span></div></div>${weightChart(ws2)}<div class="wrow"><label class="field"><input id="wIn" inputmode="decimal" type="number" step="0.1" placeholder="${fmt(cw)}" aria-label="Berat hari ini"><span>kg</span></label><label class="field"><input id="waIn" inputmode="decimal" type="number" step="0.5" placeholder="Perut" aria-label="Lingkar perut"><span>cm</span></label><button class="primary" id="wSave">Catat</button></div><p class="tip">Timbang pagi setelah buang air, sebelum makan. Lingkar perut diukur sejajar pusar.</p></section>`;
 h+=prepostHTML()+photoHTML();
 const sessP=P?ss.filter(s=>new Date(s.date)>=weekStart(new Date(S.prog.start))).length:0;
 h+=`<div class="grid"><div class="stat"><b>${thisW}/4</b><span>Sesi minggu ini</span></div><div class="stat"><b>${P?sessP+"/48":ss.length}</b><span>${P?"Sesi program 3 bulan":"Total sesi"}</span></div><div class="stat"><b>${fmt(ss.reduce((a,s)=>a+vol(s),0)/1000)} t</b><span>Total beban diangkat</span></div><div class="stat"><b>${weekStreak()}</b><span>Minggu beruntun 4 sesi</span></div></div>`;
 const weeks=[];for(let i=7;i>=0;i--){const a=new Date(ws);a.setDate(a.getDate()-7*i);const bb=new Date(a);bb.setDate(bb.getDate()+7);const vv=ss.filter(s=>{const d=new Date(s.date);return d>=a&&d<bb}).reduce((x,s)=>x+vol(s),0);weeks.push({l:a.getDate()+"/"+(a.getMonth()+1),v:vv})}
 const mx=Math.max(1,...weeks.map(w=>w.v));
 h+=calHTML();
 h+=`<section class="card kc k-or"><h3>Volume per minggu</h3><div class="chart">${weeks.map(w=>`<div><span>${w.v?fmt(w.v/1000)+"t":""}</span><i style="height:${Math.round(w.v/mx*100)}%"></i><span>${w.l}</span></div>`).join("")}</div></section>`;
 h+=exProgHTML();
 h+=`<button class="hist kc k-or" data-openhist="1"><div class="ico A">${svg("clock")}</div><div class="sp"><h3>Riwayat latihan</h3><div class="meta"><span>${ss.length} sesi tercatat</span></div></div><span class="chip t-chest">Buka</span></button>`;
 h+=`<section class="card kc k-ye"><h3>Rekor pribadi</h3><ul class="prs">${ALL.map(e=>{const bb=best(e.k);const has=ss.some(s=>s.ex[e.k]);return `<li><span>${esc(e.n)}</span><b>${has?(e.w&&e.k!=="pullup"?fmt(bb.bw)+" kg":bb.br+(e.u==="detik"?" dtk":" rep")):"–"}</b></li>`}).join("")}</ul></section>`;
 const lost=ws2.length?ws2[0].kg-cw:0;const maxV=Math.max(0,...ss.map(vol));
 const B=[["star","Sesi pertama",ss.length>=1],["fire","4 sesi seminggu",thisW>=4||weekStreak()>=1],["trophy","20 sesi",ss.length>=20],["scale","Turun 3 kg",lost>=3],["dumb","3 ton sekali latihan",maxV>=3000],["chart","4 minggu beruntun",weekStreak()>=4]];
 h+=`<section class="card kc k-ye"><h3>Pencapaian</h3><div class="badges">${B.map(([ic,l,on])=>`<div class="badge${on?" on":""}"><div class="medal">${svg(ic)}</div>${l}</div>`).join("")}</div></section>`;
 return h;
}
function prepostHTML(){const a=S.sessions.filter(s=>s.pre>0).slice(0,12).reverse();if(!a.length)return `<section class="card kc k-bl"><h3>Berat sebelum dan sesudah latihan</h3><div class="empty" style="padding:18px">Isi berat sebelum dan sesudah latihan di halaman Latihan untuk melihat grafik ini.</div></section>`;
 const vals=a.flatMap(s=>[s.pre,s.post||s.pre]);const mn=Math.floor(Math.min(...vals)-.5),mx=Math.ceil(Math.max(...vals)+.5);const W0=320,H0=150,pd=24;const X=i=>a.length===1?W0/2:pd+i*(W0-pd*2)/(a.length-1);const Y=k=>10+(mx-k)/((mx-mn)||1)*(H0-34);
 const line=(f,col)=>`<polyline points="${a.map((s,i)=>f(s)?X(i).toFixed(1)+","+Y(f(s)).toFixed(1):"").filter(Boolean).join(" ")}" fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${a.map((s,i)=>f(s)?`<circle cx="${X(i)}" cy="${Y(f(s))}" r="4" fill="${col}"/>`:"").join("")}`;
 const dd=x=>new Date(x.date).toLocaleDateString("id-ID",{day:"numeric",month:"short"});
 const diffs=a.filter(s=>s.post>0).map(s=>s.pre-s.post);const avg=diffs.length?diffs.reduce((x,y)=>x+y,0)/diffs.length:0;
 return `<section class="card kc k-bl"><h3>Berat sebelum dan sesudah latihan</h3><div style="overflow-x:auto"><svg viewBox="0 0 ${W0} ${H0}" style="width:100%;height:auto" role="img" aria-label="Grafik berat sebelum dan sesudah latihan">${line(s=>s.pre,"var(--a)")}${line(s=>s.post,"var(--muted)")}<text x="${pd}" y="${H0-6}" font-size="11" fill="var(--muted)">${dd(a[0])}</text><text x="${W0-pd}" y="${H0-6}" font-size="11" fill="var(--muted)" text-anchor="end">${dd(a[a.length-1])}</text></svg></div><div class="meta"><span style="color:var(--a)">● Sebelum latihan</span><span>● Sesudah latihan</span></div><div class="grid" style="margin:10px 0 0"><div class="stat"><b>${fmt(a[a.length-1].pre)} kg</b><span>Sebelum, sesi terakhir</span></div><div class="stat"><b>${diffs.length?fmt(avg)+" kg":"–"}</b><span>Rata-rata cairan hilang</span></div></div><p class="tip">Selisih sebelum dan sesudah latihan sebagian besar adalah cairan dari keringat, bukan lemak. Minum sekitar 1,25–1,5 liter untuk setiap 1 kg yang hilang. Untuk melihat penurunan lemak, pakai grafik berat pagi di atas.</p></section>`}
function photoHTML(){const f=PHOTOS[0],l=PHOTOS.length>1?PHOTOS[PHOTOS.length-1]:null;const d=x=>new Date(x.date).toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
 const slot=(p,lbl)=>p?`<figure class="ph"><img src="${p.src}" alt="Foto badan ${lbl.toLowerCase()}"><figcaption><b>${lbl}</b>${d(p)}</figcaption></figure>`:`<figure class="ph empty"><div>${svg("coach")}</div><figcaption><b>${lbl}</b>Belum ada foto</figcaption></figure>`;
 return `<section class="card kc k-pk"><h3>Foto progres <span class="chip t-chest" style="vertical-align:middle;margin-left:4px">Opsional</span></h3><p class="meta" style="margin:-4px 0 10px">Foto hanya disimpan di HP ini dan tidak diunggah ke mana pun. Foto ikut tersimpan saat Anda mengekspor data. Ambil dengan pose, jarak, dan cahaya yang sama setiap 2–4 minggu.</p><div class="phs">${slot(f,"Sebelum")}${slot(l,"Sekarang")}</div>${PHOTOS.length>2?`<div class="thumbs">${PHOTOS.map(p=>`<button data-delph="${p.id}" aria-label="Hapus foto ${d(p)}"><img src="${p.src}" alt=""><span>${new Date(p.date).toLocaleDateString("id-ID",{day:"numeric",month:"short"})}</span></button>`).join("")}</div><p class="meta">Ketuk foto kecil untuk menghapusnya.</p>`:""}<div class="row" style="margin:10px 0 0"><label class="primary" style="display:grid;place-items:center;cursor:pointer">Tambah foto<input type="file" id="phIn" accept="image/*" hidden></label>${PHOTOS.length&&PHOTOS.length<=2?`<button class="ghost danger" data-delph="${PHOTOS[PHOTOS.length-1].id}">Hapus foto terakhir</button>`:""}</div></section>`}
function weightChart(a){
 if(a.length<1)return `<div class="empty" style="padding:20px">Catat berat badan pertama Anda untuk melihat grafik.</div>`;
 const st=S.prog?new Date(S.prog.start):new Date(a[0].d);const days=84;const W0=320,H0=150,pad=24;
 const ys=[...a.map(x=>x.kg),S.prof.w0,S.prof.target];const mn=Math.floor(Math.min(...ys)-1),mx=Math.ceil(Math.max(...ys)+1);
 const X=d=>pad+Math.max(0,Math.min(1,(new Date(d)-st)/864e5/days))*(W0-pad*2),Y=k=>10+(mx-k)/(mx-mn)*(H0-30);
 const pts=a.map(x=>`${X(x.d).toFixed(1)},${Y(x.kg).toFixed(1)}`).join(" ");
 return `<div style="overflow-x:auto"><svg viewBox="0 0 ${W0} ${H0}" style="width:100%;height:auto" role="img" aria-label="Grafik berat badan"><line x1="${pad}" x2="${W0-pad}" y1="${Y(S.prof.w0)}" y2="${Y(S.prof.target)}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="5 5"/><polyline points="${pts}" fill="none" stroke="var(--a)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>${a.map(x=>`<circle cx="${X(x.d)}" cy="${Y(x.kg)}" r="4" fill="var(--a)"/>`).join("")}<text x="${pad}" y="${H0-4}" font-size="11" fill="var(--muted)">Minggu 1</text><text x="${W0-pad}" y="${H0-4}" font-size="11" fill="var(--muted)" text-anchor="end">Minggu 12</text><text x="${W0-pad}" y="${Y(S.prof.target)-6}" font-size="11" fill="var(--muted)" text-anchor="end">Target ${fmt(S.prof.target)} kg</text></svg></div><div class="meta"><span style="color:var(--a)">● Berat Anda</span><span style="color:var(--muted)">- - Jalur target</span>${a.filter(x=>x.waist).length?`<span>Perut terakhir ${fmt(a.filter(x=>x.waist).slice(-1)[0].waist)} cm</span>`:""}</div>`;
}
function feedCard(s,btn){const dt=new Date(s.date).toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long"})+", "+new Date(s.date).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});const sets=Object.values(s.ex).reduce((a,b)=>a+b.length,0);const mus=[...new Set(Object.keys(s.ex).map(k=>byK(k)).filter(Boolean).map(e=>MUS[e.m]))];const prs=s.prs||[];const tag=btn?"button":"section";
 return `<${tag} class="feed kc k-or"${btn?` data-open="${s.id}"`:""}><div class="who"><div class="av">${svg("dumb")}</div><div><b>Anda</b><span>${dt}</span></div></div><h3>${W[s.w].n}</h3><div class="stats3"><div><span>Volume</span><b>${fmt(vol(s))} kg</b></div><div><span>Waktu</span><b>${dur(s.dur)}</b></div><div><span>Set</span><b>${sets}</b></div></div><div class="mchips">${mus.map(m=>`<span>${m}</span>`).join("")}${s.fin?"<span>Kardio</span>":""}</div>${prs.length?`<div class="ach">${svg("trophy")}<span>${prs.length} rekor pribadi baru</span></div>`:""}</${tag}>`}
function histHTML(){
 let h=`<div class="edhead"><button class="ghost" data-back="1">Kembali ke Progres</button><button class="ghost" data-newpast="1">+ Catat latihan lampau</button></div>`;
 if(!S.sessions.length)h+=`<div class="empty">Riwayat muncul setelah latihan pertama selesai.</div>`;
 S.sessions.forEach(s=>{h+=feedCard(s,true)});
 return h;
}
// ===== Kalender latihan =====
let calOff=0,exSel=null;
function calHTML(){
 const now=new Date(),today=dk(now),m0=new Date(now.getFullYear(),now.getMonth()+calOff,1),y=m0.getFullYear(),mo=m0.getMonth(),nd=new Date(y,mo+1,0).getDate();
 const by={};S.sessions.forEach(s=>{const k=dk(s.date);(by[k]=by[k]||[]).push(s)});
 const oldest=S.sessions.length?S.sessions[S.sessions.length-1].date:null;
 const st=S.prog?dk(S.prog.start):oldest?dk(oldest):null; // hari terlewat hanya dihitung sejak program/latihan pertama
 let done=0,miss=0,plan=0,cells=["Sen","Sel","Rab","Kam","Jum","Sab","Min"].map(d=>`<span class="dn">${d}</span>`).join("");
 for(let i=0;i<(m0.getDay()+6)%7;i++)cells+="<span></span>";
 for(let d=1;d<=nd;d++){
  const dt=new Date(y,mo,d),k=dk(dt),ss=by[k]||[],planned=S.rem.days.includes(dt.getDay()),inProg=st&&k>=st,fut=k>today;
  let cls="";
  if(ss.length){cls=W[ss[0].w].c;done+=ss.length}
  else if(planned&&inProg&&k<today){cls="miss";miss++}
  else if(planned&&!fut&&k===today)cls="plan";
  else if(planned&&fut)cls="plan";
  if(planned&&inProg&&(k<today||(k===today&&ss.length)))plan++;
  if(k===today)cls+=" today";if(ss.length>1)cls+=" multi";
  const aria=dt.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long"})+(ss.length?": "+ss.map(s=>W[s.w].n).join(", "):cls.includes("miss")?": terlewat":"");
  cells+=`<button class="${cls.trim()}" data-calday="${k}" aria-label="${aria}"${fut?" disabled":""}>${d}</button>`}
 const pct=plan?Math.round((plan-miss)/plan*100):null; // persentase hari terjadwal yang tidak terlewat
 return `<section class="card kc k-pu"><div class="calh"><h3>${m0.toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</h3><div class="nav"><button data-calnav="-1" aria-label="Bulan sebelumnya">‹</button><button data-calnav="1" aria-label="Bulan berikutnya"${calOff>=0?" disabled":""}>›</button></div></div><div class="cal">${cells}</div>
 <div class="sum"><div><b>${done}</b><span>Sesi</span></div><div><b>${miss}</b><span>Terlewat</span></div><div><b>${pct==null?"–":pct+"%"}</b><span>Kepatuhan</span></div></div>
 <div class="legend"><span><i style="background:var(--a)"></i>Latihan atas</span><span><i style="background:var(--b)"></i>Latihan bawah</span><span><i style="border:1.5px dashed var(--danger)"></i>Terlewat</span><span><i style="border:1.5px dashed var(--muted)"></i>Jadwal</span></div>
 <p class="tip">Ketuk tanggal untuk melihat latihannya, atau ketuk hari kosong untuk mencatat latihan yang lupa diisi. Hari terlewat mengikuti hari latihan di Pengingat.</p></section>`}
// ===== Perkembangan per gerakan =====
// Metrik utama per sesi: beban terberat (kg), beban bantuan terkecil (pull-up), atau durasi terlama (plank).
// Untuk gerakan berbeban dengan repetisi juga dihitung perkiraan 1RM rumus Epley: beban × (1 + rep/30).
function exMetric(e,a){
 const vs=a.map(z=>z.v).filter(v=>v!==""&&v!=null).map(Number);
 if(e.k==="pullup")return vs.length?{m:Math.min(...vs)}:null;
 if(e.w&&e.u==="rep"){if(!vs.length)return null;return{m:Math.max(...vs),s:Math.max(...a.map(z=>(Number(z.v)||0)*(1+(Number(z.r)||0)/30)))}}
 if(e.w)return vs.length?{m:Math.max(...vs)}:null;
 return{m:Math.max(0,...a.map(z=>Number(z.r)||0))}}
function exProgHTML(){
 const has=new Set(ALL.filter(e=>S.sessions.some(s=>s.ex[e.k])).map(e=>e.k));
 const head=`<h3>Perkembangan per gerakan</h3>`;
 if(!has.size)return `<section class="card kc k-or">${head}<div class="empty" style="padding:18px">Grafik muncul setelah ada latihan tersimpan.</div></section>`;
 if(!has.has(exSel))exSel=Object.keys(S.sessions[0].ex).find(k=>has.has(k));
 const e=byK(exSel),pull=e.k==="pullup",unit=e.w?"kg":"dtk";
 const sel=`<select id="exSel" class="sel" aria-label="Pilih gerakan" style="margin-bottom:10px">${ORDER.map(w=>{const o=W[w].ex.filter(x=>has.has(x.k));return o.length?`<optgroup label="${W[w].n}">${o.map(x=>`<option value="${x.k}"${x.k===exSel?" selected":""}>${esc(x.n)}</option>`).join("")}</optgroup>`:""}).join("")}</select>`;
 const pts=S.sessions.filter(s=>s.ex[e.k]).map(s=>({s,r:exMetric(e,s.ex[e.k])})).filter(x=>x.r).reverse().slice(-20);
 if(!pts.length)return `<section class="card kc k-or">${head}${sel}<div class="empty" style="padding:18px">Belum ada angka beban untuk gerakan ini.</div></section>`;
 const W0=320,H0=160,pl=34,pr=12;const all=pts.flatMap(p=>[p.r.m,p.r.s].filter(v=>v!=null));
 let mn=Math.min(...all),mx=Math.max(...all);const padv=Math.max(1,(mx-mn)*.15);mn=Math.max(0,Math.floor(mn-padv));mx=Math.ceil(mx+padv);
 const X=i=>pts.length===1?(pl+W0-pr)/2:pl+i*(W0-pl-pr)/(pts.length-1),Y=v=>12+(mx-v)/((mx-mn)||1)*(H0-36);
 const line=(f,col,dash)=>`<polyline points="${pts.map((p,i)=>X(i).toFixed(1)+","+Y(f(p)).toFixed(1)).join(" ")}" fill="none" stroke="${col}" stroke-width="${dash?2:3}" ${dash?'stroke-dasharray="5 4"':""} stroke-linejoin="round" stroke-linecap="round"/>${dash?"":pts.map((p,i)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(f(p)).toFixed(1)}" r="4" fill="${col}"/>`).join("")}`;
 const dd=s=>new Date(s.date).toLocaleDateString("id-ID",{day:"numeric",month:"short"});
 const hasS=pts.some(p=>p.r.s!=null);
 const svgc=`<svg viewBox="0 0 ${W0} ${H0}" style="width:100%;height:auto" role="img" aria-label="Grafik perkembangan ${esc(e.n)}"><line x1="${pl}" x2="${W0-pr}" y1="${Y(mx)}" y2="${Y(mx)}" stroke="var(--line)"/><line x1="${pl}" x2="${W0-pr}" y1="${Y(mn)}" y2="${Y(mn)}" stroke="var(--line)"/><text x="${pl-6}" y="${Y(mx)+4}" font-size="11" fill="var(--muted)" text-anchor="end">${fmt(mx)}</text><text x="${pl-6}" y="${Y(mn)+4}" font-size="11" fill="var(--muted)" text-anchor="end">${fmt(mn)}</text>${hasS?line(p=>p.r.s,"var(--muted)",true):""}${line(p=>p.r.m,"var(--a)")}<text x="${pl}" y="${H0-6}" font-size="11" fill="var(--muted)">${dd(pts[0].s)}</text><text x="${W0-pr}" y="${H0-6}" font-size="11" fill="var(--muted)" text-anchor="end">${dd(pts[pts.length-1].s)}</text></svg>`;
 const f0=pts[0].r.m,fl=pts[pts.length-1].r.m,gain=pull?f0-fl:fl-f0,bestV=pull?Math.min(...pts.map(p=>p.r.m)):Math.max(...pts.map(p=>p.r.m));
 const lbl=pull?"Beban bantuan":e.w?"Beban terberat":"Durasi terlama";
 const recent=S.sessions.filter(s=>s.ex[e.k]).slice(0,5);
 return `<section class="card kc k-or">${head}${sel}${svgc}<div class="legend" style="margin-top:4px"><span><i style="background:var(--a)"></i>${lbl}</span>${hasS?`<span><i style="border:1.5px dashed var(--muted)"></i>Perkiraan 1RM</span>`:""}</div>
 <div class="sum"><div><b>${fmt(fl)} ${unit}</b><span>Terbaru</span></div><div><b>${gain>0?"+":""}${fmt(gain)} ${unit}</b><span>${pull?"Bantuan berkurang":"Sejak awal"}</span></div><div><b>${fmt(bestV)} ${unit}</b><span>Terbaik</span></div></div>
 <p class="tip">${pull?"Makin kecil beban bantuan, makin kuat Anda. Target akhirnya pull-up tanpa bantuan.":hasS?"1RM adalah perkiraan beban maksimal untuk satu kali angkat, dihitung dari beban dan repetisi (rumus Epley). Cukup dipakai untuk melihat tren, tidak perlu diuji langsung.":"Grafik menunjukkan nilai terbaik di setiap sesi."}</p>
 <ul class="prs">${recent.map(s=>`<li><span>${new Date(s.date).toLocaleDateString("id-ID",{weekday:"short",day:"numeric",month:"short"})}</span><span style="text-align:right;color:var(--muted)">${s.ex[e.k].map(z=>(e.w&&z.v!==""?fmt(z.v)+"×":"")+z.r).join(", ")}</span></li>`).join("")}</ul></section>`}
