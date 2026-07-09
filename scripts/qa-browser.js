const http = require("http");
const fs = require("fs");
const path = require("path");
const { root, loadConfig } = require("./config");

const config = loadConfig();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml"
};

function findBrowserExecutable() {
  if (process.env.BROWSER_EXECUTABLE_PATH) return process.env.BROWSER_EXECUTABLE_PATH;
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const requested = url.pathname === "/" ? "/index.html" : url.pathname;
    const safePath = path.normalize(decodeURIComponent(requested)).replace(/^(\.\.[/\\])+/, "");
    const filePath = path.join(root, safePath);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function main() {
  let playwright;
  try {
    playwright = require("playwright");
  } catch (error) {
    console.log(JSON.stringify({
      status: "SKIP",
      reason: "Playwright is not installed. Run pnpm install first, or rely on qa:static."
    }, null, 2));
    return;
  }

  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const executablePath = findBrowserExecutable();
  const launchOptions = { headless: true };
  if (executablePath) launchOptions.executablePath = executablePath;

  let browser;
  const results = [];
  try {
    browser = await playwright.chromium.launch(launchOptions);
    for (const pageConfig of config.activeHtmlPages) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
      const page = await context.newPage();
      const errors = [];
      const failedRequests = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("requestfailed", (request) => failedRequests.push(`${request.url()} ${request.failure()?.errorText || ""}`));

      await page.goto(`${baseUrl}/${pageConfig.file}`, { waitUntil: "networkidle" });
      const gateVisible = await page.locator("#enter-demo").isVisible();
      if (gateVisible) {
        await page.click("#enter-demo");
        await page.fill("#access-input", config.accessKey);
        await page.click('button[type="submit"]');
      }

      await page.waitForSelector(".app-shell", { state: "visible", timeout: 8000 });
      await page.waitForTimeout(300);

      const titleEs = (await page.locator("h1").first().textContent()).trim();
      const links = await page.$$eval("a[href]", (elements) => elements.map((link) => link.getAttribute("href")).filter(Boolean));
      const localLinks = links.filter((href) => !href.startsWith("mailto:") && !href.startsWith("http") && !href.startsWith("#"));
      const brokenLinks = [];
      for (const href of localLinks) {
        const response = await page.request.get(new URL(href, page.url()).href);
        if (!response.ok()) brokenLinks.push(`${href}:${response.status()}`);
      }

      const prefixes = config.assetPathPrefixes;
      const cacheBusted = await page.evaluate((assetPrefixes) => {
        return [...document.querySelectorAll("link[href],script[src]")]
          .filter((element) => {
            const ref = element.getAttribute("href") || element.getAttribute("src");
            return assetPrefixes.some((prefix) => ref.startsWith(prefix));
          })
          .every((element) => (element.getAttribute("href") || element.getAttribute("src")).includes("?v=1.0.0"));
      }, prefixes);

      await page.click('.header-right .lang-btn[data-lang="en"]');
      await page.waitForTimeout(300);
      const titleEn = (await page.locator("h1").first().textContent()).trim();

      const pageIds = config.activeHtmlPages.map((item) => item.themePageId);
      const missingKeys = await page.locator("body").evaluate((body, ids) => {
        const text = body.innerText;
        const escaped = ids.map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
        const pattern = new RegExp(`\\\\b(?:meta|nav|common|${escaped})\\\\.[A-Za-z0-9_.]+`, "g");
        return text.match(pattern) || [];
      }, pageIds);

      const canvases = await page.locator("canvas").evaluateAll((nodes) => nodes.map((canvas) => {
        const ctx = canvas.getContext("2d");
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let nonTransparent = 0;
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] !== 0) nonTransparent += 1;
        }
        return { id: canvas.id, nonTransparent };
      }));

      const expectedChartIds = pageConfig.expectedCharts || [];
      const chartIds = canvases.map((canvas) => canvas.id);
      const missingCharts = expectedChartIds.filter((id) => !chartIds.includes(id));
      const unexpectedCharts = chartIds.filter((id) => !expectedChartIds.includes(id));

      const pass = gateVisible &&
        titleEs === pageConfig.expectedTitles.es &&
        titleEn === pageConfig.expectedTitles.en &&
        brokenLinks.length === 0 &&
        cacheBusted &&
        missingKeys.length === 0 &&
        errors.length === 0 &&
        failedRequests.length === 0 &&
        missingCharts.length === 0 &&
        unexpectedCharts.length === 0 &&
        canvases.every((canvas) => canvas.nonTransparent > 1000);

      results.push({
        file: pageConfig.file,
        status: pass ? "PASS" : "FAIL",
        gateVisible,
        titleEs,
        titleEn,
        brokenLinks,
        cacheBusted,
        missingKeys,
        charts: canvases,
        missingCharts,
        unexpectedCharts,
        errors,
        failedRequests
      });

      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const failures = results.filter((result) => result.status !== "PASS");
  console.log(JSON.stringify({
    status: failures.length ? "FAIL" : "PASS",
    activeThemeId: config.activeThemeId,
    baseUrl,
    executablePath: executablePath || "playwright-managed",
    results
  }, null, 2));

  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
