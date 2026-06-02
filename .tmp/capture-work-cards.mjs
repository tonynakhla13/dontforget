import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";

const chrome = "C:/PROGRA~1/Google/Chrome/Application/chrome.exe";
const port = 9333;
const userDataDir = "C:/Users/Tony Nakhla/Desktop/Projects/dontforget/.tmp/chrome-cdp-profile";
const out = "C:/Users/Tony Nakhla/Desktop/Projects/dontforget/.tmp/work-cards-cdp.png";

const child = spawn(chrome, [
  "--headless=old",
  "--disable-gpu",
  "--disable-software-rasterizer",
  "--disable-gpu-compositing",
  "--no-sandbox",
  "--disable-dev-shm-usage",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userDataDir}`,
  "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getJson(path) {
  const res = await fetch(`http://127.0.0.1:${port}${path}`);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

for (let i = 0; i < 80; i++) {
  try {
    await getJson("/json/version");
    break;
  } catch {
    await sleep(100);
  }
}

const targets = await getJson("/json/list");
const page = targets.find((target) => target.type === "page");
if (!page?.webSocketDebuggerUrl) throw new Error("No page target");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  }
});

function send(method, params = {}) {
  const callId = ++id;
  ws.send(JSON.stringify({ id: callId, method, params }));
  return new Promise((resolve, reject) => pending.set(callId, { resolve, reject }));
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await send("Page.navigate", { url: "http://localhost:3000/en/immersive/work" });
await sleep(9000);
await send("Runtime.evaluate", {
  expression: "window.scrollTo(0, Math.max(0, (document.querySelector('[data-card]')?.getBoundingClientRect().top ?? 0) + window.scrollY - 180))",
});
await sleep(1800);
const shot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
await writeFile(out, Buffer.from(shot.data, "base64"));
ws.close();
child.kill();
console.log(out);
