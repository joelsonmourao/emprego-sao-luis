#!/usr/bin/env node
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";
import { resolve } from "node:path";

const out = resolve("tmp/admin-visual");
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "domcontentloaded" });
await page.locator("#instagram-cta-title").scrollIntoViewIfNeeded();
await page.locator("section[aria-labelledby='instagram-cta-title']").screenshot({
  path: resolve(out, "instagram-after-1366.png")
});
await page.locator("footer").screenshot({ path: resolve(out, "footer-after-1366.png") });
await page.locator("header").screenshot({ path: resolve(out, "header-after-1366.png") });

await page.setViewportSize({ width: 375, height: 812 });
await page.goto("http://127.0.0.1:4321/", { waitUntil: "domcontentloaded" });
await page.locator("#instagram-cta-title").scrollIntoViewIfNeeded();
await page.locator("section[aria-labelledby='instagram-cta-title']").screenshot({
  path: resolve(out, "instagram-after-375.png")
});
const box = await page.locator('img[src="/brand/icon-instagram.webp"]').boundingBox();
console.log(JSON.stringify({ instagramBox375: box }, null, 2));
await browser.close();
