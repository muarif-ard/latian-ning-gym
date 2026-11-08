// Uji fitur: kalender, grafik per gerakan, edit sesi, catat latihan lampau.
// Jalankan: npm test   (atau: node tests/fitur.test.js)
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
  const toastT = () => pg.$eval("#toast", e => e.textContent);
  const dlg = async i => { await pg.waitForSelector(".modal button"); await clk(pg, `.modal button[data-i="${i}"]`); await wait(250); };
  const setIn = (sel, v) => pg.$eval(sel, (e, v) => { e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })) }, v);
  const L = (d, t) => new Date(`${d}T${t || "17:00"}:00+07:00`).toISOString(); // jam WIB, sama dengan zona waktu halaman uji

  await pg.goto(U, { waitUntil: "networkidle0" });
  const today = await pg.evaluate(() => dk(new Date()));
  ok(today === "2026-11-08", "tanggal sistem 2026-11-08 (skenario disusun untuk tanggal ini): " + today);

  const seed = {
    prog: { start: L("2026-11-02", "08:00") }, rem: { days: [1, 2, 4, 5], time: "16:30" },
    prof: { h: 170, w0: 80, target: 72, sex: "m", age: 30, set: true },
    sessions: [
      { id: "d5", date: L("2026-11-05"), w: "UA", ex: { bench: [{ v: 45, r: 8 }, { v: 45, r: 8 }] } },
      { id: "d3", date: L("2026-11-03"), w: "LA", ex: { squat: [{ v: 60, r: 10 }], plank: [{ v: "", r: 45 }] } },
      { id: "d2", date: L("2026-11-02"), w: "UA", ex: { bench: [{ v: 42.5, r: 8 }] } },
      { id: "o30", date: L("2026-10-30"), w: "UA", ex: { bench: [{ v: 40, r: 10 }] } }
    ]
  };
  await pg.evaluate(d => localStorage.setItem("latian-ning-gym-v1", JSON.stringify(d)), seed);
  await pg.goto(U, { waitUntil: "networkidle0" });
  await clk(pg, 'button[data-tab="prog"]');

  // 1. Kalender November
  const cal = async () => pg.$$eval(".cal button", bs => Object.fromEntries(bs.map(x => [x.dataset.calday, x.className])));
  let c = await cal();
  ok(c["2026-11-02"] === "A" && c["2026-11-03"] === "B" && c["2026-11-05"] === "A", "hari latihan diwarnai sesuai jenis");
  ok(c["2026-11-06"] === "miss", "Jumat 6 Nov (terjadwal, tanpa latihan) ditandai terlewat");
  ok(c["2026-11-04"] === "" && c["2026-11-01"] === "", "hari tak terjadwal / sebelum program tidak ditandai");
  ok(c["2026-11-08"].includes("today"), "hari ini ditandai");
  ok(c["2026-11-09"].includes("plan") && await pg.$eval('button[data-calday="2026-11-09"]', e => e.disabled), "jadwal mendatang ditampilkan dan tidak bisa diketuk");
  let sum = await pg.$$eval(".cal + .sum b", x => x.map(e => e.textContent));
  ok(sum.join("|") === "3|1|75%", "ringkasan bulan: " + sum.join("|"));
  await clk(pg, 'button[data-calnav="-1"]');
  c = await cal();
  ok(c["2026-10-30"] === "A" && !Object.values(c).includes("miss"), "Oktober: sesi 30 Okt tampil, tidak ada 'terlewat' sebelum program");
  await clk(pg, 'button[data-calnav="1"]');
  ok(await pg.$eval('button[data-calnav="1"]', e => e.disabled), "tidak bisa maju melewati bulan ini");

  // 2. Ketuk hari dengan latihan membuka detail
  await clk(pg, 'button[data-calday="2026-11-03"]');
  ok((await txt()).toLowerCase().includes("detail latihan") && (await txt()).includes("Bawah A"), "ketuk tanggal membuka detail sesi");
  await clk(pg, "button[data-closeres]");

  // 3. Grafik per gerakan
  await pg.select("#exSel", "bench");
  let s2 = await pg.$$eval("#exSel ~ .sum b", x => x.map(e => e.textContent));
  ok(s2[0] === "45 kg" && s2[1] === "+5 kg" && s2[2] === "45 kg", "bench: terbaru/kenaikan/terbaik = " + s2.join(" / "));
  ok((await pg.$$eval("#exSel ~ svg polyline", x => x.length)) === 2, "garis beban + perkiraan 1RM tampil");
  await pg.select("#exSel", "plank");
  s2 = await pg.$$eval("#exSel ~ .sum b", x => x.map(e => e.textContent));
  ok(s2[0] === "45 dtk", "plank memakai durasi: " + s2[0]);
  await pg.select("#exSel", "bench");
  await pg.screenshot({ path: path.join(OUT, "shot2-prog.png"), fullPage: true });

  // 4. Catat latihan lampau dari kalender (hari terlewat)
  await clk(pg, 'button[data-calday="2026-11-06"]'); await dlg(0);
  ok((await txt()).includes("CATAT LATIHAN LAMPAU") || (await txt()).toLowerCase().includes("catat latihan lampau"), "editor latihan lampau terbuka");
  ok((await pg.$eval("#edDate", e => e.value)) === "2026-11-06T16:30", "tanggal terisi dari kalender + jam pengingat");
  await clk(pg, 'button[data-edw="UB"]');
  await clk(pg, "button[data-edsave]"); await wait(100);
  ok((await toastT()).includes("minimal satu set"), "validasi: tanpa repetisi tidak bisa disimpan");
  await setIn('input[data-edk="curl"][data-i="0"][data-f="v"]', "12");
  await setIn('input[data-edk="curl"][data-i="0"][data-f="r"]', "10");
  await pg.screenshot({ path: path.join(OUT, "shot2-editor.png"), fullPage: true });
  await clk(pg, "button[data-edsave]"); await wait(150);
  let st = await pg.evaluate(() => S.sessions.map(s => s.id + ":" + dk(s.date) + ":" + s.w + ":" + s.ph));
  ok(st[0].endsWith(":2026-11-06:UB:0") && st.length === 5, "sesi lampau tersimpan di urutan yang benar: " + st.join(", "));
  ok((await txt()).includes("Atas B"), "setelah simpan, detail sesi baru tampil");
  await clk(pg, "button[data-closeres]");
  c = await cal(); sum = await pg.$$eval(".cal + .sum b", x => x.map(e => e.textContent));
  ok(c["2026-11-06"] === "A" && sum.join("|") === "4|0|100%", "kalender diperbarui: " + sum.join("|"));

  // 5. Edit sesi: ubah beban → rekor dihitung ulang
  await clk(pg, 'button[data-calday="2026-11-05"]');
  await clk(pg, 'button[data-edit="d5"]');
  ok((await pg.$$eval('input[data-edk="bench"][data-f="v"]', x => x.map(e => e.value))).join() === "45,45", "editor terisi data sesi lama");
  await setIn('input[data-edk="bench"][data-i="0"][data-f="v"]', "50");
  await clk(pg, 'button[data-edrm="bench"][data-i="1"]');
  ok((await pg.$$eval('input[data-edk="bench"][data-f="v"]', x => x.length)) === 1, "hapus set di editor");
  await clk(pg, 'button[data-edadd="incdb"]');
  ok((await pg.$$eval('input[data-edk="incdb"][data-f="r"]', x => x.length)) === 1, "tambah set untuk gerakan yang belum dicatat");
  await clk(pg, "button[data-edsave]"); await wait(150);
  let d5 = await pg.evaluate(() => S.sessions.find(s => s.id === "d5"));
  ok(d5.ex.bench.length === 1 && d5.ex.bench[0].v === 50 && !d5.ex.incdb, "perubahan tersimpan; set kosong diabaikan");
  ok(d5.prs.length === 1 && d5.prs[0].t === "50 kg", "rekor pribadi dihitung ulang: " + JSON.stringify(d5.prs));
  ok((await txt()).includes("Perubahan") || (await toastT()).includes("Perubahan disimpan"), "notifikasi perubahan disimpan");

  // 6. Ubah tanggal: masa depan ditolak, tanggal lampau mengurutkan ulang
  await clk(pg, 'button[data-edit="d5"]');
  await setIn("#edDate", "2026-11-20T17:00");
  await clk(pg, "button[data-edsave]"); await wait(100);
  ok((await toastT()).includes("masa depan"), "tanggal masa depan ditolak");
  await clk(pg, "button[data-edcancel]");
  ok((await txt()).toLowerCase().includes("detail latihan") && (await pg.evaluate(() => dk(S.sessions.find(s => s.id === "d5").date))) === "2026-11-05", "batal edit kembali ke detail tanpa perubahan");
  await clk(pg, "button[data-closeres]");
  await clk(pg, 'button[data-calnav="-1"]'); await clk(pg, 'button[data-calday="2026-10-30"]'); await clk(pg, 'button[data-edit="o30"]');
  await setIn("#edDate", "2026-11-04T07:00"); await clk(pg, "button[data-edsave]"); await wait(150);
  st = await pg.evaluate(() => S.sessions.map(s => s.id));
  const prs = await pg.evaluate(() => Object.fromEntries(S.sessions.map(s => [s.id, s.prs.map(p => p.t).join()])));
  ok(st.join() === "n,d5,o30,d3,d2".replace("n", st[0]) && st.indexOf("o30") === 2, "urutan sesi setelah ganti tanggal: " + st.join(","));
  ok(prs.o30 === "" && prs.d5 === "50 kg" && prs.d2 === "", "rekor kronologis benar: " + JSON.stringify(prs));

  // 7. Catat lampau dari riwayat, hapus sesi menghitung ulang rekor
  await clk(pg, "button[data-closeres]");
  await clk(pg, "button[data-openhist]"); await clk(pg, "button[data-newpast]");
  ok(await pg.$("#edDate") !== null, "tombol catat latihan lampau di riwayat membuka editor");
  await clk(pg, "button[data-edcancel]");
  ok((await txt()).includes("Riwayat") || (await pg.$("button[data-newpast]")) !== null, "batal kembali ke riwayat");
  await clk(pg, 'button[data-open="d2"]'); await clk(pg, 'button[data-del="d2"]'); await dlg(0);
  const d5b = await pg.evaluate(() => S.sessions.find(s => s.id === "d5").prs.map(p => p.t).join());
  ok(d5b === "50 kg", "setelah hapus sesi, rekor tetap konsisten: " + d5b);

  // Kepatuhan: 2 Nov kini terlewat (sesi dihapus), latihan Rabu 4 Nov tidak menutupinya
  await clk(pg, 'button[data-tab="prog"]'); await clk(pg, 'button[data-calnav="1"]');
  sum =await pg.$$eval(".cal + .sum b", x => x.map(e => e.textContent));
  ok(sum.join("|") === "4|1|75%", "kepatuhan konsisten dengan hari terlewat: " + sum.join("|"));

  // 8. Data tersimpan bertahan setelah muat ulang
  await pg.goto(U, { waitUntil: "networkidle0" });
  ok((await pg.evaluate(() => S.sessions.length)) === 4, "data hasil edit tetap ada setelah aplikasi dibuka ulang");

  await pg.emulateMediaFeatures([{ name: "prefers-color-scheme", value: "dark" }]);
  await clk(pg, 'button[data-tab="prog"]'); await pg.evaluate(() => document.querySelector(".cal").scrollIntoView({ block: "center" }));
  await pg.screenshot({ path: path.join(OUT, "shot2-dark-cal.png") });

  ok(errs.length === 0, "tidak ada error JavaScript" + (errs.length ? ": " + errs.join(" / ") : ""));
  await b.close(); srv.close();
  T.finish();
})().catch(e => { console.error(e); process.exit(1); });
