// Builds public/jakharia-catalogue.pdf — the catalogue as a book (A5 pages, cover → contents → chapters → back).
// Run after any price or product change:  pnpm build && pnpm catalogue:pdf
// It serves the built site with `vite preview`, prints /catalogue with headless Chrome and saves the PDF.
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PORT = 4199;
const OUT = 'public/jakharia-catalogue.pdf';
const CHROME = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));
if (!CHROME) throw new Error('Chrome not found — set CHROME_PATH');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { shell: true, stdio: 'ignore' });
for (let i = 0; i < 60; i++) { try { await fetch(`http://localhost:${PORT}/`); break; } catch { await sleep(250); } }

const debug = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${debug}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'pdf-'))}`, 'about:blank'], { stdio: 'ignore' });
let target;
for (let i = 0; i < 60 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${debug}/json`)).json()).find((t) => t.type === 'page'); } catch { await sleep(250); }
}
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send('Page.enable');
await send('Page.navigate', { url: `http://localhost:${PORT}/catalogue` });
await sleep(3000);
// The catalogue sheets only exist in print, so switch to print media and wait for their fonts and images.
await send('Emulation.setEmulatedMedia', { media: 'print' });
await send('Runtime.evaluate', { awaitPromise: true, expression: `(async () => {
  await document.fonts.load('700 20px Kalam'); await document.fonts.load('400 20px Kalam');
  await document.fonts.ready;
  // lazy images off screen never start on their own: load them all now, giving up on any after 15 s
  document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
  const all = Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
  await Promise.race([all, new Promise((r) => setTimeout(r, 15000))]);
})()` });
await sleep(1000);
const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true });
writeFileSync(OUT, Buffer.from(pdf.result.data, 'base64'));
console.log(`saved ${OUT}`);

ws.close(); chrome.kill(); server.kill();
process.exit(0);
