// Latian Ning Gym — Isi program: gerakan per latihan (W), fase (PH), contoh menu, larangan harian, dan tips coach.

const MUS={legs:"Kaki",chest:"Dada",back:"Punggung",shoulder:"Bahu",arms:"Lengan",core:"Perut"};
const W={
UA:{n:"Atas A",c:"A",ex:[
{k:"bench",n:"Barbell bench press",r:"8–12",lo:8,hi:12,w:true,u:"rep",m:"chest",tip:"Belikat dirapatkan ke bangku, turunkan bar ke dada bawah dengan terkontrol. Minta spotter jika beban berat."},
{k:"pulldown",n:"Lat pulldown",r:"10–12",lo:10,hi:12,w:true,u:"rep",m:"back",tip:"Tarik bar ke dada atas, dada membusung, jangan mengayun badan."},
{k:"incdb",n:"Incline dumbbell press",r:"10–12",lo:10,hi:12,w:true,u:"rep",m:"chest",tip:"Bangku miring 30 derajat, dumbel turun sejajar dada."},
{k:"cablerow",n:"Seated cable row",r:"10–12",lo:10,hi:12,w:true,u:"rep",m:"back",tip:"Punggung tegak, tarik ke perut, tahan 1 detik."},
{k:"lateral",n:"Lateral raise",r:"12–15",lo:12,hi:15,w:true,u:"rep",m:"shoulder",tip:"Angkat sampai sejajar bahu, siku sedikit ditekuk. Beban ringan, gerakan rapi."},
{k:"pushdown",n:"Triceps pushdown",r:"12–15",lo:12,hi:15,w:true,u:"rep",m:"arms",tip:"Siku menempel di samping badan, luruskan penuh di bawah."}]},
LA:{n:"Bawah A",c:"B",ex:[
{k:"squat",n:"Back squat / leg press",r:"8–10",lo:8,hi:10,w:true,u:"rep",m:"legs",tip:"Pemula boleh mulai dari leg press atau goblet squat. Lutut searah ujung kaki, punggung netral."},
{k:"rdl",n:"Romanian deadlift",r:"10–12",lo:10,hi:12,w:true,u:"rep",m:"legs",tip:"Dorong pinggul ke belakang, bar dekat paha, punggung lurus."},
{k:"legpress",n:"Leg press",r:"12–15",lo:12,hi:15,w:true,u:"rep",m:"legs",tip:"Turun sampai lutut sekitar 90 derajat, jangan mengunci lutut di atas."},
{k:"legcurl",n:"Leg curl",r:"12–15",lo:12,hi:15,w:true,u:"rep",m:"legs",tip:"Gerakan pelan, tahan sebentar saat otot paha belakang mengencang."},
{k:"calf",n:"Calf raise",r:"15–20",lo:15,hi:20,w:true,u:"rep",m:"legs",tip:"Naik setinggi mungkin, turun pelan sampai tumit meregang."},
{k:"plank",n:"Plank",r:"40–60 detik",lo:40,hi:60,w:false,u:"detik",m:"core",tip:"Badan lurus, perut dan bokong dikencangkan."}]},
UB:{n:"Atas B",c:"A",ex:[
{k:"ohp",n:"Dumbbell shoulder press",r:"8–12",lo:8,hi:12,w:true,u:"rep",m:"shoulder",tip:"Duduk tegak, dorong ke atas tanpa melengkungkan punggung."},
{k:"pullup",n:"Assisted pull-up",r:"6–10",lo:6,hi:10,w:true,u:"rep",m:"back",tip:"Pakai mesin bantuan. Isi beban bantuan (makin kecil makin berat). Target: pull-up tanpa bantuan."},
{k:"chestpress",n:"Chest press machine",r:"10–12",lo:10,hi:12,w:true,u:"rep",m:"chest",tip:"Dorong lurus, jangan mengunci siku di ujung gerakan."},
{k:"dbrow",n:"One-arm dumbbell row",r:"10–12 per sisi",lo:10,hi:12,w:true,u:"rep",m:"back",tip:"Satu tangan bertumpu di bangku, tarik dumbel ke pinggang."},
{k:"facepull",n:"Face pull",r:"12–15",lo:12,hi:15,w:true,u:"rep",m:"shoulder",tip:"Tarik tali ke arah wajah, siku tinggi. Bagus untuk postur bahu."},
{k:"curl",n:"Barbell / dumbbell curl",r:"10–12",lo:10,hi:12,w:true,u:"rep",m:"arms",tip:"Siku diam, jangan mengayun badan."}]},
LB:{n:"Bawah B",c:"B",ex:[
{k:"deadlift",n:"Deadlift",r:"6–8",lo:6,hi:8,w:true,u:"rep",m:"back",tip:"Mulai ringan dan minta trainer gym mengecek teknik. Bar dekat kaki, punggung netral, dorong lantai dengan kaki."},
{k:"bss",n:"Bulgarian split squat",r:"8–10 per kaki",lo:8,hi:10,w:true,u:"rep",m:"legs",tip:"Kaki belakang di bangku, turun lurus ke bawah."},
{k:"hipthrust",n:"Hip thrust",r:"10–12",lo:10,hi:12,w:true,u:"rep",m:"legs",tip:"Punggung atas di bangku, dorong pinggul ke atas, tahan 1 detik."},
{k:"legext",n:"Leg extension",r:"12–15",lo:12,hi:15,w:true,u:"rep",m:"legs",tip:"Luruskan penuh, turun pelan."},
{k:"cablecrunch",n:"Cable crunch",r:"12–15",lo:12,hi:15,w:true,u:"rep",m:"core",tip:"Tekuk perut, bukan menarik dengan tangan."},
{k:"farmer",n:"Farmer walk",r:"30–45 detik",lo:30,hi:45,w:true,u:"detik",m:"core",tip:"Bawa dumbel berat di kedua tangan, jalan tegak. Isi beban per tangan."}]}};
const ORDER=["UA","LA","UB","LB"];
const ALL=Object.values(W).flatMap(x=>x.ex);const byK=k=>ALL.find(e=>e.k===k);
const PH=[{n:"Adaptasi",sets:3,rest:90,fin:"Kardio 15 menit santai: sepeda statis atau jalan cepat di treadmill.",d:"Belajar teknik, beban sedang. Sisakan 2–3 repetisi di setiap set."},
{n:"Bentuk Otot",sets:4,rest:75,fin:"Kardio 20 menit: treadmill jalan menanjak (incline) atau sepeda statis.",d:"4 set per gerakan, beban dinaikkan bertahap. Sisakan 1–2 repetisi."},
{n:"Definisi",sets:4,rest:60,fin:"Interval 10 menit: 30 detik cepat, 60 detik santai di sepeda statis, lalu 5 menit pendinginan.",d:"Istirahat 60 detik, intensitas tinggi, ditutup interval kardio untuk membakar lemak."}];
const DN=["Min","Sen","Sel","Rab","Kam","Jum","Sab"],BY=["SU","MO","TU","WE","TH","FR","SA"];
const MENU=[
{n:"Hari 1",m:[["Sarapan","2 telur rebus, nasi 1 centong kecil (100 g), tumis kangkung sedikit minyak",420,20],["Camilan pagi","1 pisang dan 1 gelas susu rendah lemak",210,9],["Makan siang","Nasi 150 g, ikan bakar atau pepes ikan 150 g, sayur asem, tempe kukus 2 potong",620,42],["Sebelum latihan","2 lembar roti gandum dengan selai kacang tipis",250,9],["Makan malam","Nasi 100 g, dada ayam panggang 150 g, capcay, tahu kukus",560,50]]},
{n:"Hari 2",m:[["Sarapan","Oatmeal 50 g dimasak dengan susu, potongan pisang, 1 telur rebus",420,22],["Camilan pagi","Setengah buah mangga dan segenggam kacang tanah rebus",230,7],["Makan siang","Nasi 150 g, ikan kembung bakar, tahu bacem kukus, lalapan dan sambal sedikit",600,40],["Sebelum latihan","Ubi rebus 150 g dan 1 gelas susu",260,9],["Makan malam","Nasi 100 g, pepes ayam atau ikan 150 g, sayur bening bayam, 2 putih telur",540,48]]},
{n:"Hari 3",m:[["Sarapan","Nasi 100 g, telur dadar 2 butir dengan sedikit minyak, timun dan tomat",440,15],["Camilan pagi","Yogurt tawar dengan buah, atau 1 apel dan 2 telur rebus",220,13],["Makan siang","Nasi merah 150 g, ayam bakar tanpa kulit 150 g, tumis buncis wortel",640,45],["Sebelum latihan","1 pisang dan segenggam kacang almond atau kacang tanah",230,6],["Makan malam","Kentang rebus 200 g, ikan tongkol atau bandeng presto 150 g, sayur sop",500,40]]}];
const RULES=[["gorengan","Tidak makan gorengan","Bakwan, tahu goreng, kerupuk, dan sejenisnya. Kalorinya tinggi dan bikin wajah berminyak. Maksimal sekali seminggu."],
["manis","Tidak minum minuman manis","Es teh manis, kopi sachet, sirup, boba, minuman bersoda. Ganti dengan air putih, teh tawar, atau kopi hitam."],
["asin","Batasi makanan asin dan mi instan","Ikan asin, terasi berlebih, mi instan, camilan kemasan. Garam berlebih bikin wajah dan badan sembap."],
["malam","Tidak makan berat setelah jam 8 malam","Makan malam terakhir 2–3 jam sebelum tidur. Jika lapar, cukup buah atau segelas susu."],
["tidur","Tidur minimal 7 jam","Kurang tidur menaikkan nafsu makan, menghambat pembentukan otot, dan membuat wajah kusam."],
["rokok","Tanpa rokok dan alkohol","Keduanya merusak pemulihan otot, stamina, dan kesegaran kulit."]];
const TIPS=["Teknik dulu, baru beban. Beban berat dengan gerakan asal-asalan adalah jalan pintas ke cedera.","Catat setiap set. Otot tumbuh karena tantangan yang naik sedikit demi sedikit, dan catatan membuat Anda tahu kapan harus naik.","Protein di setiap makan: telur, ikan, ayam, tahu, tempe. Ikan laut Indramayu murah dan protein tinggi.","Turun berat 0,5 kg per minggu sudah ideal. Lebih cepat dari itu biasanya otot ikut hilang.","Wajah segar datang dari tidur cukup, air cukup, dan garam yang dikurangi, bukan dari latihan wajah.","Jangan menimbang setiap hari dengan panik. Lihat tren mingguan, timbang pagi setelah buang air.","Lingkar perut turun adalah tanda lemak berkurang, walaupun timbangan kadang diam karena otot bertambah.","Hari libur bukan hari malas. Jalan kaki atau gowes santai mempercepat pemulihan.","Minum air sebelum, saat, dan setelah latihan. Target 8–10 gelas sehari, lebih banyak saat cuaca panas.","Satu kali makan bebas seminggu itu boleh. Yang merusak adalah makan bebas setiap hari."];
