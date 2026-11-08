// Membuat tangkapan layar keempat halaman (terang & gelap) dengan data contoh ke tests/output/.
// Jalankan: npm run screenshots
const path = require("path");
const { OUT, serve, launch, newPage, wait } = require("./helpers");

(async () => {
  const { srv, url } = await serve();
  const b = await launch();
  const pg = await newPage(b);
  await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  const errs = []; pg.on("pageerror", e => errs.push(e.message));
  const L = d => new Date(`${d}T17:00:00+07:00`).toISOString();
  await pg.goto(url);
  await pg.evaluate(d => localStorage.setItem("latian-ning-gym-v1", JSON.stringify(d)), {
    prog: { start: L("2026-11-02") }, prof: { h: 170, w0: 80, target: 72, sex: "m", age: 30, set: true },
    weights: [{ d: "2026-11-02", kg: 80 }, { d: "2026-11-06", kg: 79.2 }],
    sessions: [
      { id: "a", date: L("2026-11-05"), w: "UA", ex: { bench: [{ v: 45, r: 8 }] }, pre: 79.5, post: 78.9 },
      { id: "b", date: L("2026-11-03"), w: "LA", ex: { squat: [{ v: 60, r: 10 }] } },
      { id: "c", date: L("2026-11-02"), w: "UA", ex: { bench: [{ v: 42.5, r: 8 }] } }]
  });
  for (const scheme of ["light", "dark"]) {
    await pg.emulateMediaFeatures([{ name: "prefers-color-scheme", value: scheme }]);
    await pg.goto(url, { waitUntil: "networkidle0" });
    for (const t of ["today", "food", "prog", "plan"]) {
      await pg.click(`button[data-tab="${t}"]`); await wait(150);
      await pg.screenshot({ path: path.join(OUT, `${scheme}-${t}.png`), fullPage: true });
    }
  }
  console.log(errs.length ? "ERROR: " + errs.join(" / ") : "Tangkapan layar tersimpan di " + OUT);
  await b.close(); srv.close();
  process.exitCode = errs.length ? 1 : 0;
})().catch(e => { console.error(e); process.exit(1); });
