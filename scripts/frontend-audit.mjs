import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const OUTPUT_DIR = path.resolve(process.cwd(), "..", "..", "artifacts", "frontend-audit");
const BASE_URL = process.env.FRONTEND_AUDIT_BASE_URL ?? "https://slzcontent.com.br";
const DEBUG_PORT = Number(process.env.FRONTEND_AUDIT_PORT ?? "9333");

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} em ${url}`);
  }
  return response.json();
}

async function delay(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForTarget(port, timeoutMs = 15000) {
  const started = Date.now();

  while (Date.now() - started < timeoutMs) {
    try {
      const targets = await fetchJson(`http://127.0.0.1:${port}/json/list`);
      const page = targets.find((item) => item.type === "page");
      if (page?.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl;
      }
    } catch {}

    await delay(250);
  }

  throw new Error("Nao consegui conectar ao DevTools do Edge.");
}

function createCdpClient(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  let id = 0;
  const pending = new Map();
  const listeners = new Map();

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result);
      }
      return;
    }

    if (message.method) {
      const callbacks = listeners.get(message.method) ?? [];
      for (const callback of callbacks) {
        callback(message.params ?? {});
      }
    }
  });

  return {
    socket,
    async ready() {
      if (socket.readyState === WebSocket.OPEN) return;
      await new Promise((resolve, reject) => {
        socket.addEventListener("open", resolve, { once: true });
        socket.addEventListener("error", reject, { once: true });
      });
    },
    send(method, params = {}) {
      const messageId = ++id;
      socket.send(JSON.stringify({ id: messageId, method, params }));
      return new Promise((resolve, reject) => {
        pending.set(messageId, { resolve, reject });
      });
    },
    on(method, callback) {
      const callbacks = listeners.get(method) ?? [];
      callbacks.push(callback);
      listeners.set(method, callbacks);
    },
    close() {
      socket.close();
    }
  };
}

async function launchEdge(port) {
  const proc = spawn(
    EDGE_PATH,
    [
      "--headless=new",
      "--disable-gpu",
      `--remote-debugging-port=${port}`,
      "--no-first-run",
      "--no-default-browser-check",
      "about:blank"
    ],
    {
      stdio: "ignore",
      detached: false
    }
  );

  proc.unref?.();
  return proc;
}

async function captureScenario(client, options) {
  const {
    name,
    url,
    width,
    height,
    acceptConsent = false
  } = options;

  const requests = [];
  const responses = [];
  client.on("Network.requestWillBeSent", (params) => {
    requests.push({ url: params.request.url, type: params.type ?? "", requestId: params.requestId });
  });
  client.on("Network.responseReceived", (params) => {
    responses.push({ url: params.response.url, status: params.response.status, mimeType: params.response.mimeType, requestId: params.requestId });
  });

  await client.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: true,
    screenWidth: width,
    screenHeight: height
  });
  await client.send("Emulation.setUserAgentOverride", {
    userAgent:
      "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
    platform: "Android"
  });

  await client.send("Page.navigate", { url });
  await delay(5000);

  if (acceptConsent) {
    await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          const button = [...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === 'Aceitar');
          if (button) { button.click(); return true; }
          return false;
        })()
      `,
      awaitPromise: true
    });
    await delay(6000);
  }

  const html = await client.send("Runtime.evaluate", {
    expression: "document.documentElement.outerHTML",
    returnByValue: true
  });

  const metrics = await client.send("Runtime.evaluate", {
    expression: `(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body ? document.body.scrollWidth : 0,
      hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      adsScriptPresent: Boolean(document.querySelector('script[src*="adsbygoogle.js"]')),
      adsFrames: document.querySelectorAll('iframe[src*="googleads"], iframe[id*="google_ads"], iframe[data-google-container-id]').length,
      adsPlaceholders: [...document.querySelectorAll('div')].filter((node) => node.textContent?.includes('Espaco AdSense')).length,
      adsIns: document.querySelectorAll('ins.adsbygoogle').length,
      visibleAdFrames: [...document.querySelectorAll('iframe[src*="googleads"], iframe[id*="google_ads"], iframe[data-google-container-id]')]
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          };
        })
        .filter((rect) => rect.width > 20 && rect.height > 20)
    }))()`,
    returnByValue: true
  });

  const firstVisibleAd = metrics.result.value.visibleAdFrames?.[0];
  if (firstVisibleAd) {
    await client.send("Runtime.evaluate", {
      expression: `window.scrollTo({ top: ${Math.max(0, Math.floor(firstVisibleAd.top) - 24)}, behavior: 'instant' });`
    });
    await delay(1500);
    const adScreenshot = await client.send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true
    });
    await fs.writeFile(path.join(OUTPUT_DIR, `${name}-ad.png`), Buffer.from(adScreenshot.data, "base64"));
  }

  const screenshot = await client.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true
  });

  await fs.writeFile(path.join(OUTPUT_DIR, `${name}.png`), Buffer.from(screenshot.data, "base64"));
  await fs.writeFile(path.join(OUTPUT_DIR, `${name}.html`), html.result.value, "utf8");

  const adsRequests = requests.filter((item) => item.url.includes("adsbygoogle.js") || item.url.includes("googleads") || item.url.includes("googlesyndication"));
  const adsResponses = responses.filter((item) => item.url.includes("adsbygoogle.js") || item.url.includes("googleads") || item.url.includes("googlesyndication"));

  return {
    name,
    url,
    width,
    height,
    acceptConsent,
    metrics: metrics.result.value,
    adsRequests,
    adsResponses,
    htmlContainsAdsScript: html.result.value.includes("adsbygoogle.js")
  };
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const port = DEBUG_PORT;
  const proc = await launchEdge(port);

  try {
    const wsUrl = await waitForTarget(port);
    const client = createCdpClient(wsUrl);
    await client.ready();

    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Network.enable");

    const scenarios = [
      { name: "home-no-consent", url: `${BASE_URL}/`, width: 390, height: 844 },
      { name: "home-consent", url: `${BASE_URL}/`, width: 390, height: 844, acceptConsent: true },
      { name: "job-consent", url: `${BASE_URL}/vagas/aprendiz-area-de-gente-rh`, width: 390, height: 844, acceptConsent: true },
      { name: "home-360", url: `${BASE_URL}/`, width: 360, height: 800 },
      { name: "jobs-390", url: `${BASE_URL}/vagas`, width: 390, height: 844 },
      { name: "job-390", url: `${BASE_URL}/vagas/aprendiz-area-de-gente-rh`, width: 390, height: 844 }
    ];

    const results = [];
    for (const scenario of scenarios) {
      results.push(await captureScenario(client, scenario));
    }

    await fs.writeFile(path.join(OUTPUT_DIR, "results.json"), JSON.stringify(results, null, 2), "utf8");
    client.close();
  } finally {
    proc.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
