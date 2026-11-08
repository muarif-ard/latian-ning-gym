// Uji struktur file dan mode offline: daftar cache service worker lengkap,
// aplikasi bisa dibuka langsung dari file, dan tetap berjalan tanpa internet.
const fs = require("fs"), path = require("path");
const { ROOT, serve, launch, newPage, tally, wait } = require("./helpers");
const T = tally(), ok = T.ok;

(async () => {
  // 1. Semua file di SHELL ada, dan semua file js/css yang dipakai index.html ada di SHELL
  const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
  const shell = JSON.parse(sw.match(/const SHELL = (\[[\s\S]*?\]);/)[1]);
  const missing = shell.filter(f => f !== "./" && !fs.existsSync(path.join(ROOT, f)));
  ok(!missing.length, "semua file di daftar cache service worker ada" + (missing.length ? ": " + missing.join(", ") : ""));
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const refs = [...html.matchAll(/(?:src|href)="((?:js|css|icons)\/[^"]+)"/g)].map(m => m[1]);
  const notCached = refs.filter(r => !shell.includes(r));
  ok(refs.length >= 13 && !notCached.length, `${refs.length} file yang dipakai index.html semuanya masuk cache` + (notCached.length ? ": kurang " + notCached.join(", ") : ""));

  const b = await launch();

  // 2. Dibuka langsung dari file (tanpa server)
  const p1 = await newPage(b); const e1 = []; p1.on("pageerror", e => e1.push(e.message));
  await p1.goto("file:///" + path.join(ROOT, "index.html").replace(/\\/g, "/"));
  await wait(400);
  ok((await p1.$$("button[data-tab]")).length === 4 && !e1.length, "aplikasi terbuka langsung dari file tanpa error" + (e1.length ? ": " + e1.join(" / ") : ""));

  // 3. Offline lewat service worker
  const { srv, url } = await serve();
  const p2 = await newPage(b); const e2 = []; p2.on("pageerror", e => e2.push(e.message));
  await p2.goto(url, { waitUntil: "networkidle0" });
  await p2.evaluate(() => navigator.serviceWorker.ready);
  await p2.reload({ waitUntil: "networkidle0" });
  ok(await p2.evaluate(() => !!navigator.serviceWorker.controller), "service worker aktif mengendalikan halaman");
  srv.close();
  await p2.setOfflineMode(true);
  await p2.reload({ waitUntil: "domcontentloaded" });
  await wait(600);
  const tabs = await p2.$$eval("button[data-tab]", x => x.map(e => e.textContent.trim()));
  ok(tabs.join() === "Latihan,Makan,Progres,Program", "tanpa internet aplikasi tetap terbuka: " + tabs.join(", "));
  await p2.click('button[data-tab="prog"]'); await wait(150);
  ok((await p2.$eval("#view", e => e.innerText)).includes("Perkembangan per gerakan"), "halaman Progres berfungsi saat offline");
  ok(!e2.length, "tidak ada error JavaScript saat offline" + (e2.length ? ": " + e2.join(" / ") : ""));

  await b.close();
  T.finish();
})().catch(e => { console.error(e); process.exit(1); });
