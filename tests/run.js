// Menjalankan semua file *.test.js di folder ini satu per satu dan merangkum hasilnya.
// Kode keluar 1 jika ada satu saja yang gagal (dipakai juga oleh GitHub Actions).
const { spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const files = fs.readdirSync(__dirname).filter(f => f.endsWith(".test.js")).sort();
let failed = 0, pass = 0, fail = 0;
for (const f of files) {
  console.log(`\n=== ${f} ===`);
  const r = spawnSync(process.execPath, [path.join(__dirname, f)], { encoding: "utf8" });
  const out = (r.stdout || "") + (r.stderr || "");
  process.stdout.write(out);
  pass += (out.match(/^PASS /gm) || []).length;
  fail += (out.match(/^FAIL /gm) || []).length;
  if (r.status !== 0) failed++;
}
console.log(`\nRingkasan: ${pass} lulus, ${fail} gagal, ${files.length} file${failed ? `, ${failed} file bermasalah` : ""}.`);
process.exit(failed ? 1 : 0);
