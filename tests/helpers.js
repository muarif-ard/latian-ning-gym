// Alat bantu bersama untuk uji Chrome headless.
// - serve(): server statis untuk folder aplikasi di port acak
// - launch(): membuka Chrome/Edge yang terpasang (atau CHROME_PATH)
// - newPage(): tab dengan ukuran HP, zona waktu WIB, dan jam yang dikunci ke NOW
//   supaya hasil uji kalender selalu sama di komputer mana pun, termasuk GitHub Actions.
const http = require("http"), fs = require("fs"), path = require("path");
const puppeteer = require("puppeteer-core");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(__dirname, "output");
const NOW = "2026-11-08T12:00:00+07:00";
const TZ = "Asia/Jakarta";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".json": "application/json", ".webmanifest": "application/manifest+json" };

function serve() {
  return new Promise(res => {
    const srv = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
      const f = path.join(ROOT, path.normalize(p));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
      r.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" });
      fs.createReadStream(f).pipe(r);
    }).listen(0, () => res({ srv, url: `http://localhost:${srv.address().port}/` }));
  });
}

function chromePath() {
  const c = [process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"].filter(Boolean);
  const hit = c.find(p => fs.existsSync(p));
  if (!hit) throw new Error("Chrome tidak ditemukan. Atur variabel CHROME_PATH ke lokasi chrome/msedge.");
  return hit;
}

const launch = () => puppeteer.launch({ executablePath: chromePath(), headless: true, args: process.platform === "linux" ? ["--no-sandbox"] : [] });

async function newPage(browser) {
  const pg = await browser.newPage();
  await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await pg.emulateTimezone(TZ);
  await pg.evaluateOnNewDocument(fixed => {
    const RealDate = Date, offset = fixed - RealDate.now();
    class FixedDate extends RealDate {
      constructor(...a) { if (a.length) super(...a); else super(RealDate.now() + offset); }
      static now() { return RealDate.now() + offset; }
    }
    window.Date = FixedDate;
  }, new Date(NOW).getTime());
  return pg;
}

// Pencatat hasil: ok(kondisi, pesan) lalu finish() mencetak ringkasan dan mengatur kode keluar.
function tally() {
  let fails = 0;
  return {
    ok(c, m) { console.log((c ? "PASS " : "FAIL ") + m); if (!c) fails++; },
    get fails() { return fails; },
    finish() { console.log(fails ? `\n${fails} GAGAL` : "\nSEMUA LULUS"); process.exitCode = fails ? 1 : 0; }
  };
}

const wait = ms => new Promise(r => setTimeout(r, ms));
// Gulir elemen ke tengah layar dulu agar klik tidak tertutup navigasi bawah yang menempel.
const clk = async (pg, sel) => { await pg.$eval(sel, e => e.scrollIntoView({ block: "center" })); await pg.click(sel); };

fs.mkdirSync(OUT, { recursive: true });
module.exports = { ROOT, OUT, NOW, serve, launch, newPage, tally, wait, clk };
