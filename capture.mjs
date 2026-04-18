// capture.mjs — Frame-accurate capture of animated HTML to MP4
// node capture.mjs <htmlFile> <width> <height> <duration> <fps> <output.mp4>
import pkg from '/opt/node22/lib/node_modules/playwright/node_modules/playwright-core/index.js';
const { chromium } = pkg;
import { spawnSync } from 'child_process';
import { mkdirSync, rmSync } from 'fs';
import { resolve } from 'path';

const [,, htmlFile, widthStr, heightStr, durationStr, fpsStr, outputMp4] = process.argv;
const W        = parseInt(widthStr)      || 1920;
const H        = parseInt(heightStr)     || 1080;
const DURATION = parseFloat(durationStr) || 62;
const FPS      = parseInt(fpsStr)        || 30;
const FRAMES   = Math.ceil(DURATION * FPS);
const FRAME_DIR = '/tmp/frames_' + Date.now();
const DT_MS    = 1000 / FPS;

mkdirSync(FRAME_DIR, { recursive: true });
console.log(`${htmlFile} → ${W}×${H}, ${FPS}fps, ${DURATION}s (${FRAMES} frames)`);

const browser = await chromium.launch({
  executablePath: chromium.executablePath(),
  args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage',
         '--disable-gpu','--allow-file-access-from-files',
         '--ignore-certificate-errors','--disable-web-security'],
  headless: true,
});

const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });

// Inject BEFORE any page script runs:
// - Replace rAF with a manual queue
// - Freeze performance.now so the Stage's dt calculation is deterministic
await page.addInitScript(() => {
  let _fakeTs = 0;
  const _queue = [];

  window.__fakeTs = () => _fakeTs;

  // Patch rAF: queue callbacks instead of scheduling them
  window.requestAnimationFrame = (cb) => { _queue.push(cb); return _queue.length; };
  window.cancelAnimationFrame  = () => {};

  // Patch performance.now to return our fake timestamp
  const _origPerf = performance.now.bind(performance);
  performance.now = () => _fakeTs;

  // Called by capture script: advance fake time and flush rAF queue once
  window.__stepFrame = (timestampMs) => {
    _fakeTs = timestampMs;
    const cbs = _queue.splice(0);
    for (const cb of cbs) { try { cb(timestampMs); } catch(e) {} }
  };
});

// Use HTTP if a BASE_URL env is set, otherwise file://
const absHtml = process.env.BASE_URL
  ? process.env.BASE_URL + '/' + htmlFile
  : 'file://' + resolve(htmlFile);
await page.goto(absHtml, { waitUntil: 'networkidle', timeout: 30000 });

// Wait for offline bundler to unpack (if applicable)
await page.waitForFunction(() => {
  const el = document.getElementById('__bundler_loading');
  return !el || el.style.display === 'none' || !document.body.contains(el);
}, { timeout: 25000 }).catch(() => {});

// Let React mount (initial render uses t=0 since rAF never fired yet)
await page.waitForTimeout(1200);

// Hide the playback bar for clean video export
await page.evaluate(() => {
  // Find and hide any bottom control bar
  document.querySelectorAll('[style*="JetBrains Mono"]').forEach(el => {
    if (el.style && el.offsetTop > window.innerHeight * 0.85) el.style.display = 'none';
  });
  // More targeted: hide elements with dark bg at bottom
  document.querySelectorAll('*').forEach(el => {
    const s = window.getComputedStyle(el);
    if (s.position === 'relative' && s.background.includes('20,20,20')) el.style.display = 'none';
  });
});

console.log('Capturing frames...');

for (let i = 0; i < FRAMES; i++) {
  const ts = i * DT_MS;
  // Step the animation: set fake timestamp and flush rAF queue
  await page.evaluate((t) => window.__stepFrame(t), ts);
  // Allow React to re-render (one microtask flush is usually enough)
  await page.waitForTimeout(20);

  const pad = String(i).padStart(6, '0');
  await page.screenshot({ path: `${FRAME_DIR}/frame_${pad}.png`, type: 'png', clip: { x: 0, y: 0, width: W, height: H } });

  if (i % FPS === 0) process.stdout.write(`  ${(ts/1000).toFixed(1)}s / ${DURATION}s\r`);
}

console.log(`\n${FRAMES} frames captured. Encoding...`);
await browser.close();

const r = spawnSync('ffmpeg', [
  '-y', '-framerate', String(FPS),
  '-i', `${FRAME_DIR}/frame_%06d.png`,
  '-c:v', 'libx264', '-preset', 'fast', '-crf', '18',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
  outputMp4,
], { stdio: 'inherit' });

rmSync(FRAME_DIR, { recursive: true, force: true });

if (r.status === 0) console.log(`\n✓ ${outputMp4}`);
else { console.error('ffmpeg failed:', r.status); process.exit(1); }
