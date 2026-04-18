// capture-fullscreen.js — Render the 1920×1080 animation frame-by-frame → MP4.
// Usage: node capture-fullscreen.js [output.mp4]

'use strict';

const { chromium } = require('playwright-core');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const PROJECT_DIR = __dirname;
const DURATION = 62;
const FPS = 30;
const TOTAL_FRAMES = Math.ceil(DURATION * FPS);
const WIDTH = 1920;
const HEIGHT = 1080;
const OUTPUT = process.argv[2] || path.join(PROJECT_DIR, 'video-ies-maestrat.mp4');

const CHROMIUM_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.jsx':  'application/javascript; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
};

function createServer(root) {
  return http.createServer((req, res) => {
    const urlPath = req.url.split('?')[0];
    const filePath = path.join(root, decodeURIComponent(urlPath));
    if (!filePath.startsWith(root)) { res.writeHead(403); res.end(); return; }
    fs.readFile(filePath, (err, data) => {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store',
      });
      res.end(data);
    });
  });
}

async function main() {
  const server = createServer(PROJECT_DIR);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  console.log(`[capture] HTTP server → http://127.0.0.1:${port}`);

  const ffmpegArgs = [
    '-y',
    '-framerate', String(FPS),
    '-f', 'image2pipe',
    '-vcodec', 'png',
    '-i', 'pipe:0',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-crf', '18',
    '-preset', 'medium',
    OUTPUT,
  ];
  console.log(`[capture] ffmpeg output → ${OUTPUT}`);
  const ff = spawn('ffmpeg', ffmpegArgs, { stdio: ['pipe', 'inherit', 'inherit'] });
  const ffDone = new Promise((res, rej) =>
    ff.on('close', code => code === 0 ? res() : rej(new Error(`ffmpeg exit ${code}`)))
  );

  const browser = await chromium.launch({
    executablePath: CHROMIUM_PATH,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--hide-scrollbars',
    ],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('[page]', msg.text());
  });

  const url = `http://127.0.0.1:${port}/recorder-fullscreen.html`;
  console.log(`[capture] Loading ${url}`);
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 60_000 });
  console.log('[capture] Page ready. Starting frame capture...');

  const t0 = Date.now();
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;

    await page.evaluate((time) => window.__setVideoTime(time), t);
    await page.evaluate(() => new Promise(r => requestAnimationFrame(r)));

    const png = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
    });

    await new Promise((resolve, reject) =>
      ff.stdin.write(png, err => err ? reject(err) : resolve())
    );

    if (i % FPS === 0) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(`[capture] Frame ${i + 1}/${TOTAL_FRAMES}  t=${t.toFixed(2)}s  elapsed=${elapsed}s`);
    }
  }

  ff.stdin.end();
  await ffDone;
  await browser.close();
  server.close();

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n[capture] Done in ${elapsed}s → ${OUTPUT}`);
}

main().catch(err => { console.error(err); process.exit(1); });
