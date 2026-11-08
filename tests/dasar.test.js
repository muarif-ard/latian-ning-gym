// Uji dasar: profil, validasi data, jadwal, ekspor/impor, dialog, alur latihan.
// Jalankan: npm test   (atau: node tests/dasar.test.js)
const path = require("path");
const { OUT, serve, launch, newPage, tally, wait, clk } = require("./helpers");
const T = tally(), ok = T.ok;

(async () => {
  const { srv, url: U } = await serve();
  const b = await launch();
  const pg = await newPage(b);
  const errs = [];
  pg.on("pageerror", e => errs.push(e.message));
  const txt = () => pg.$eval("#view", e => e.innerText);
  const tabTo = async t => { await pg.click(`button[data-tab="${t}"]`); await new Promise(r => setTimeout(r, 150)); };
  const dlg = async i => { await pg.waitForSelector(".modal button"); await pg.click(`.modal button[data-i="${i}"]`); await new Promise(r => setTimeout(r, 300)); };

  // 1. Pengguna baru
  await pg.goto(U, { waitUntil: "networkidle0" });
  ok((await txt()).includes("Lengkapi profil Anda"), "pengguna baru melihat ajakan isi profil");
  await tabTo("food");
  ok((await txt()).includes("2.000 kkal"), "tanpa profil, target kalori fallback 2.000");

  // 2. Data lama/rusak di localStorage
  const old = {
    sessions: [
      { id: "s3", date: "2026-11-06T10:00:00Z", w: "UA", ex: { bench: [{ v: 40, r: 10 }], foo: [{ v: 1, r: 1 }] }, prs: [] },
      { id: "s2", date: "2026-11-05T10:00:00Z", w: "XX", ex: { bench: [{ v: 1, r: 1 }] } },
      { id: "s1", date: "2026-11-04T10:00:00Z", w: "LA", ex: { foo: [{ v: 1, r: 1 }] } },
      { id: "s0", date: "bukan tanggal", w: "UA", ex: { bench: [{ v: 1, r: 1 }] } },
      null
    ],
    weights: [{ d: "2026-11-01", kg: 74 }, { d: "x", kg: 70 }, { d: "2026-11-02", kg: 5 }],
    food: { "2026-11-01": { air: 99, ok: ["gorengan", "palsu"] } },
    rem: { days: [1, 3, 5, 9], time: "17:00" },
    prof: { h: 170, w0: 80, target: 70 },
    draft: { w: "UA", sets: { bench: [] } }
  };
  await pg.evaluate(d => localStorage.setItem("latian-ning-gym-v1", JSON.stringify(d)), old);
  await pg.goto(U, { waitUntil: "networkidle0" });
  const st = await pg.evaluate(() => S);
  ok(st.sessions.length === 1 && st.sessions[0].id === "s3", "hanya sesi valid yang tersisa (" + st.sessions.map(s => s.id) + ")");
  ok(!st.sessions[0].ex.foo, "gerakan tak dikenal dibuang dari sesi");
  ok(st.weights.length === 1, "berat badan tidak valid dibuang");
  ok(st.food["2026-11-01"].air === 10 && st.food["2026-11-01"].ok.join() === "gorengan", "data makan disaring");
  ok(st.rem.days.join() === "1,3,5", "hari pengingat tidak valid dibuang");
  ok(st.prof.h === 170 && st.prof.set === false, "profil lama dipertahankan, ditandai belum lengkap");

  // 3. Riwayat & halaman hasil
  await tabTo("prog");
  await pg.click("button[data-openhist]"); await pg.click("button[data-open]");
  ok((await txt()).toLowerCase().includes("detail latihan"), "halaman hasil sesi terbuka tanpa error");

  // 4. Jadwal mingguan mengikuti pengingat
  await tabTo("plan");
  const sched = await pg.$$eval("table tr", r => r.map(x => x.innerText.replace(/\s+/g, " ").trim()));
  ok(sched[0].includes("Atas A") && sched[2].includes("Bawah A") && sched[4].includes("Atas B") && sched[1].includes("Istirahat aktif") && sched[6].includes("Istirahat total"), "jadwal: " + sched.join(" | "));
  ok((await txt()).includes("Anda memilih 3 hari"), "peringatan jumlah hari selain 4");
  await pg.click('button[data-day="2"]');
  const sched2 = await pg.$$eval("table tr", r => r.map(x => x.innerText.replace(/\s+/g, " ").trim()));
  ok(sched2[1].includes("Bawah A") && sched2[4].includes("Bawah B"), "jadwal ikut berubah saat hari ditambah");

  // 5. Profil: validasi lalu simpan
  await pg.click("#profSave"); await new Promise(r => setTimeout(r, 100));
  ok((await pg.$eval("#toast", e => e.textContent)).includes("jenis kelamin"), "validasi: jenis kelamin wajib");
  await pg.select("#pS", "m");
  await pg.$eval("#pA", e => e.value = "30");
  await pg.click("#profSave"); await new Promise(r => setTimeout(r, 150));
  const pf = await pg.evaluate(() => ({ p: S.prof, k: kcal() }));
  ok(pf.p.set && pf.p.sex === "m" && pf.p.age === 30, "profil tersimpan lengkap");
  // BMR = 10*74 + 6.25*170 - 150 + 5 = 1657.5; TDEE 2569 -> 2550; target 2069 -> 2050
  ok(pf.k.t === 2050 && pf.k.tdee === 2550, "kalori Mifflin-St Jeor benar: " + JSON.stringify(pf.k));
  ok((await txt()).includes("± 20 mgg"), "ringkasan waktu ke target tampil");
  await tabTo("food");
  ok((await txt()).includes("2.050 kkal"), "halaman Makan memakai target pribadi");
  await tabTo("today");
  ok(!(await txt()).includes("Lengkapi profil Anda"), "ajakan profil hilang setelah diisi");

  // 6. Ekspor (termasuk foto)
  await pg.evaluate(async () => {
    const c = document.createElement("canvas"); c.width = 30; c.height = 40;
    await putPhotos([{ id: "f1", date: "2026-11-01T00:00:00Z", src: c.toDataURL("image/jpeg") }], false);
    window.__saved = null; downloads = { save: async x => { window.__saved = x; return { status: "saved" } } };
  });
  await tabTo("plan"); await pg.click("#expBtn"); await new Promise(r => setTimeout(r, 300));
  const exp = await pg.evaluate(() => JSON.parse(window.__saved.data));
  ok(exp.photos.length === 1 && exp.schema === 2 && exp.sessions.length === 1, "ekspor menyertakan foto dan schema");
  ok(await pg.evaluate(() => S.lastBackup > 0), "tanggal cadangan terakhir dicatat");
  ok(!(await txt()).includes("belum pernah"), "kartu cadangan menampilkan tanggal");

  // 7. Impor: gabungkan
  const file = { ...exp, sessions: [...exp.sessions, { id: "n1", date: "2026-11-07T10:00:00Z", w: "LB", ex: { deadlift: [{ v: 60, r: 6 }] } }],
    weights: [{ d: "2026-11-07", kg: 73 }], photos: [...exp.photos, { id: "f2", date: "2026-11-07T00:00:00Z", src: exp.photos[0].src }] };
  const imp = async (obj) => {
    await pg.evaluate(o => { const f = new File([JSON.stringify(o)], "c.json", { type: "application/json" }); window.__imp = importData(f) }, obj);
  };
  await imp(file); await dlg(0); await pg.evaluate(() => window.__imp);
  let s2 = await pg.evaluate(() => ({ n: S.sessions.map(s => s.id), w: S.weights.length, ph: PHOTOS.length, set: S.prof.set }));
  ok(s2.n.join() === "n1,s3" && s2.w === 2 && s2.ph === 2 && s2.set, "gabung: " + JSON.stringify(s2));
  await imp(file); await dlg(0); await pg.evaluate(() => window.__imp);
  ok((await pg.evaluate(() => S.sessions.length)) === 2, "gabung dua kali tidak menduplikasi sesi");

  // 8. Impor: ganti (dengan konfirmasi kedua) dan batal
  const small = { sessions: [{ id: "z", date: "2026-10-01T10:00:00Z", w: "UB", ex: { curl: [{ v: 10, r: 10 }] } }] };
  await imp(small); await dlg(2); await pg.evaluate(() => window.__imp);
  ok((await pg.evaluate(() => S.sessions.length)) === 2, "batal impor tidak mengubah data");
  await imp(small); await dlg(1); await dlg(0); await pg.evaluate(() => window.__imp);
  s2 = await pg.evaluate(() => ({ n: S.sessions.map(s => s.id), ph: PHOTOS.length }));
  ok(s2.n.join() === "z" && s2.ph === 2, "ganti: data diganti, foto tetap karena file tanpa foto");
  await pg.evaluate(() => { const f = new File(["bukan json"], "x.json"); return importData(f) });
  ok((await pg.$eval("#toast", e => e.textContent)).includes("tidak dikenali"), "file rusak ditolak");

  // 9. Dialog hapus sesi (pengganti confirm)
  await tabTo("prog"); await pg.click("button[data-openhist]"); await pg.click("button[data-open]");
  await pg.click("button[data-del]");
  await pg.waitForSelector(".modal");
  await pg.screenshot({ path: path.join(OUT, "shot-dialog.png") });
  await pg.keyboard.press("Escape"); await new Promise(r => setTimeout(r, 150));
  ok((await pg.evaluate(() => S.sessions.length)) === 1 && !(await pg.$(".modal")), "Escape menutup dialog tanpa menghapus");
  await pg.click("button[data-del]"); await dlg(0);
  ok((await pg.evaluate(() => S.sessions.length)) === 0, "sesi terhapus setelah dikonfirmasi");

  // 10. Alur latihan lengkap
  await tabTo("today");
  const k0 = await pg.$eval('input[data-f="v"]', e => { e.value = "12"; e.dispatchEvent(new Event("input", { bubbles: true })); return e.dataset.k });
  await pg.click(`button.chk[data-k="${k0}"][data-i="0"]`);
  await pg.click("#save"); await new Promise(r => setTimeout(r, 200));
  ok((await txt()).toLowerCase().includes("latihan tersimpan") && (await pg.evaluate(() => S.sessions.length)) === 1, "simpan sesi latihan berhasil");

  // Tangkapan layar halaman utama
  for (const [t, f] of [["plan", "shot-plan.png"], ["food", "shot-food.png"]]) {
    await tabTo(t); await pg.screenshot({ path: path.join(OUT, f), fullPage: true });
  }
  await pg.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await tabTo("plan"); await pg.evaluate(() => $("profCard").scrollIntoView());
  await pg.screenshot({ path: path.join(OUT, "shot-dark-profile.png") });

  ok(errs.length === 0, "tidak ada error JavaScript" + (errs.length ? ": " + errs.join(" / ") : ""));
  await b.close(); srv.close();
  T.finish();
})().catch(e => { console.error(e); process.exit(1); });
