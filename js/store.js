// Latian Ning Gym — Data aplikasi: struktur awal, validasi/migrasi (clean), gabung impor, simpan ke localStorage,
// sinkron akun, foto di IndexedDB, serta ekspor/impor cadangan.

const KEY="latian-ning-gym-v1",SCHEMA=2;
const DEF=()=>({schema:SCHEMA,sessions:[],draft:null,updated:0,lastBackup:0,prog:null,rem:{days:[1,2,4,5],time:"16:30"},weights:[],food:{},prof:{h:168,w0:74,target:68,sex:"",age:"",set:false}});
// Validasi dan migrasi data dari localStorage, sinkronisasi akun, atau file impor.
// Apa pun yang rusak atau tidak dikenali dibuang, sehingga tampilan tidak pernah error karena data.
function clean(d){
 const o=DEF();if(!d||typeof d!=="object")return o;
 const num=(x,a,b)=>{if(x===""||x==null)return undefined;x=Number(x);return isFinite(x)&&x>=a&&x<=b?x:undefined};
 const isDay=x=>typeof x==="string"&&/^\d{4}-\d\d-\d\d$/.test(x);
 const okDate=x=>x!=null&&!isNaN(new Date(x).getTime());
 o.sessions=(Array.isArray(d.sessions)?d.sessions:[]).filter(s=>s&&typeof s==="object"&&W[s.w]&&okDate(s.date)).map(s=>{
  const ex={};Object.entries(s.ex&&typeof s.ex==="object"?s.ex:{}).forEach(([k,a])=>{if(byK(k)&&Array.isArray(a)){const z=a.filter(x=>x&&typeof x==="object").map(x=>({v:num(x.v,0,1000)??"",r:num(x.r,0,9999)||0}));if(z.length)ex[k]=z}});
  return{id:String(s.id||new Date(s.date).getTime()),date:new Date(s.date).toISOString(),w:s.w,ex,dur:num(s.dur,0,86400)||null,
   prs:Array.isArray(s.prs)?s.prs.filter(p=>p&&p.n).map(p=>({n:String(p.n),t:String(p.t||"")})):[],ph:[0,1,2].includes(s.ph)?s.ph:0,fin:!!s.fin,pre:num(s.pre,30,300),post:num(s.post,30,300)}})
  .filter(s=>Object.keys(s.ex).length);
 const seen=new Set();o.sessions=o.sessions.filter(s=>!seen.has(s.id)&&seen.add(s.id)).sort((a,b)=>a.date<b.date?1:-1);
 const dr=d.draft;o.draft=dr&&typeof dr==="object"&&W[dr.w]&&dr.sets&&W[dr.w].ex.every(e=>Array.isArray(dr.sets[e.k]))?dr:null;
 const wd={};(Array.isArray(d.weights)?d.weights:[]).forEach(x=>{const kg=x&&num(x.kg,30,300);if(kg&&isDay(x.d))wd[x.d]={d:x.d,kg,waist:num(x.waist,40,250)}});o.weights=Object.values(wd);
 if(d.food&&typeof d.food==="object")Object.entries(d.food).forEach(([k,f])=>{if(isDay(k)&&f&&typeof f==="object")o.food[k]={air:Math.min(10,Math.max(0,Math.round(Number(f.air))||0)),ok:Array.isArray(f.ok)?[...new Set(f.ok.filter(r=>RULES.some(x=>x[0]===r)))]:[]}});
 if(d.rem&&typeof d.rem==="object"){if(Array.isArray(d.rem.days))o.rem.days=[...new Set(d.rem.days.map(Number).filter(i=>Number.isInteger(i)&&i>=0&&i<=6))];if(/^\d\d:\d\d$/.test(d.rem.time||""))o.rem.time=d.rem.time}
 o.prog=d.prog&&okDate(d.prog.start)?{start:new Date(d.prog.start).toISOString()}:null;
 const p=d.prof&&typeof d.prof==="object"?d.prof:{};
 o.prof={h:num(p.h,100,250)||168,w0:num(p.w0,30,300)||74,target:num(p.target,30,300)||68,sex:p.sex==="m"||p.sex==="f"?p.sex:"",age:Math.round(num(p.age,12,100)||0)||"",set:false};
 o.prof.set=!!(p.set&&o.prof.sex&&o.prof.age);
 o.updated=num(d.updated,0,1e15)||0;o.lastBackup=num(d.lastBackup,0,1e15)||0;
 return o}
// Gabungkan data impor ke data sekarang tanpa menimpa catatan yang sudah ada.
function merge(cur,inc){
 const m=clean(cur);
 const ids=new Set(m.sessions.map(s=>s.id));inc.sessions.forEach(s=>{if(!ids.has(s.id))m.sessions.push(s)});m.sessions.sort((a,b)=>a.date<b.date?1:-1);
 const wd=new Set(m.weights.map(w=>w.d));inc.weights.forEach(w=>{if(!wd.has(w.d))m.weights.push(w)});
 Object.entries(inc.food).forEach(([k,f])=>{const x=m.food[k];m.food[k]=x?{air:Math.max(x.air,f.air),ok:[...new Set([...x.ok,...f.ok])]}:f});
 if(!m.prog&&inc.prog)m.prog=inc.prog;
 if(!m.prof.set&&inc.prof.set)m.prof=inc.prof;
 return m}
let S=DEF();
try{const raw=localStorage.getItem(KEY);if(raw)S=clean(JSON.parse(raw))}catch(e){}
function persist(remote){S.updated=Date.now();S.schema=SCHEMA;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(remote&&docRef){clearTimeout(pushT);pushT=setTimeout(pushRemote,800)}}
async function pushRemote(){try{await docRef.set({state:JSON.stringify(S),updated:S.updated});$("sync").textContent="Tersinkron ke akun Anda."}catch(e){$("sync").textContent="Belum tersinkron. Data tetap tersimpan di perangkat ini."}}
let PHOTOS=[];
const idb=()=>new Promise((res,rej)=>{try{const r=indexedDB.open("latian-gym-foto",1);r.onupgradeneeded=()=>r.result.createObjectStore("p",{keyPath:"id"});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});
async function loadPhotos(){try{const db=await idb();PHOTOS=await new Promise(res=>{const q=db.transaction("p").objectStore("p").getAll();q.onsuccess=()=>res((q.result||[]).sort((a,b)=>a.date<b.date?-1:1));q.onerror=()=>res([])})}catch(e){PHOTOS=[]}if(tab==="prog"&&!view)render()}
async function addPhoto(file){try{const url=URL.createObjectURL(file);const img=new Image();await new Promise((r,j)=>{img.onload=r;img.onerror=j;img.src=url});const m=900,sc=Math.min(1,m/Math.max(img.width,img.height));const cv=document.createElement("canvas");cv.width=Math.round(img.width*sc);cv.height=Math.round(img.height*sc);cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);URL.revokeObjectURL(url);const p={id:String(Date.now()),date:new Date().toISOString(),src:cv.toDataURL("image/jpeg",.8)};const db=await idb();await new Promise((r,j)=>{const t=db.transaction("p","readwrite");t.objectStore("p").put(p);t.oncomplete=r;t.onerror=()=>j(t.error)});PHOTOS.push(p);render();toast("Foto tersimpan di HP ini")}catch(e){toast("Foto gagal disimpan di perangkat ini")}}
async function delPhoto(id){try{const db=await idb();await new Promise(r=>{const t=db.transaction("p","readwrite");t.objectStore("p").delete(id);t.oncomplete=r;t.onerror=r})}catch(e){}PHOTOS=PHOTOS.filter(x=>x.id!==id);render();toast("Foto dihapus")}
async function putPhotos(list,replaceAll){try{const db=await idb();await new Promise((r,j)=>{const t=db.transaction("p","readwrite");const st=t.objectStore("p");if(replaceAll)st.clear();list.forEach(p=>st.put(p));t.oncomplete=r;t.onerror=()=>j(t.error)});await loadPhotos()}catch(e){toast("Foto dari cadangan gagal disimpan di perangkat ini")}}
async function exportData(){
 if(!downloads)return;
 const data=JSON.stringify(Object.assign({},S,{schema:SCHEMA,app:"latian-ning-gym",exported:new Date().toISOString(),photos:PHOTOS}));
 try{const r=await downloads.save({filename:"latian-ning-gym-cadangan-"+dk(new Date())+".json",data});if(r&&r.status==="saved"){S.lastBackup=Date.now();persist(true);render();toast(PHOTOS.length?"Cadangan disimpan, termasuk "+PHOTOS.length+" foto":"Cadangan disimpan")}}
 catch(e){if(e&&e.code==="unavailable"){downloads=null;render()}else toast("Cadangan gagal disimpan")}}
async function importData(file){
 let d;try{d=JSON.parse(await file.text())}catch(e){toast("File cadangan tidak dikenali");return}
 if(!d||!Array.isArray(d.sessions)){toast("File cadangan tidak dikenali");return}
 const inc=clean(d);const ph=(Array.isArray(d.photos)?d.photos:[]).filter(p=>p&&p.id&&typeof p.src==="string"&&p.src.startsWith("data:image/")&&!isNaN(new Date(p.date).getTime())).map(p=>({id:String(p.id),date:new Date(p.date).toISOString(),src:p.src}));
 const bad=d.sessions.length-inc.sessions.length;
 const mode=await ask("Pulihkan data dari file",`File berisi ${inc.sessions.length} sesi latihan, ${inc.weights.length} catatan berat${ph.length?", dan "+ph.length+" foto":""}.${bad>0?" "+bad+" sesi rusak atau tidak dikenali akan dilewati.":""} Gabungkan menambah catatan yang belum ada tanpa menghapus apa pun.`,
  [{l:"Gabungkan dengan data sekarang",v:"merge",cls:"primary"},{l:"Ganti semua data sekarang",v:"replace",cls:"ghost danger"},{l:"Batal",v:null}]);
 if(!mode)return;
 if(mode==="replace"&&!(await yes("Ganti semua data?","Semua catatan di perangkat ini akan diganti dengan isi file. Tindakan ini tidak bisa dibatalkan. Ekspor data dulu jika ragu.","Ya, ganti semua")))return;
 if(mode==="merge"){S=merge(S,inc)}else{S=inc;S.draft=null}
 recalcPRs();
 if(ph.length)await putPhotos(ph,mode==="replace");
 persist(true);render();toast(mode==="merge"?"Data berhasil digabungkan":"Data berhasil dipulihkan")}
