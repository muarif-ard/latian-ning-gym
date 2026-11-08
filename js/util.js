// Latian Ning Gym — Fungsi bantu umum: ambil elemen, escape HTML, format angka/tanggal/durasi, link YouTube.

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=n=>(Math.round(n*10)/10).toLocaleString("id-ID");
const dk=d=>{const x=new Date(d);return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0")};
const dur=s=>{if(!s)return "–";const m=Math.round(s/60);return m<60?m+" mnt":Math.floor(m/60)+" j "+(m%60)+" m"};
const yt=q=>"https://www.youtube.com/results?search_query="+encodeURIComponent(q);
