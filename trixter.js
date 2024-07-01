const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function clearBrowserData(page) {
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');
}

async function simulateHumanInteractions(page) {
  await page.mouse.move(Math.random() * 500, Math.random() * 500);
  await sleep(Math.random() * 2000);
  await page.keyboard.type('test', { delay: Math.random() * 100 });
}

async function runTest(instance) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await clearBrowserData(page);
  await page.setRequestInterception(true);

  // Serve the service worker script
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().endsWith('/sw.js')) {
      request.respond({
        status: 200,
        contentType: 'application/javascript',
        body: fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8')
      });
    } else {
      request.continue();
    }
  });

  // Register the service worker
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
  });

  await page.goto('https://abrahamjuliot.github.io/creepjs/');
  await sleep(4241); // Wait for page to fully load

  await simulateHumanInteractions(page);

  const data = await page.evaluate(() => {
    const getTextContent = selector => document.querySelector(selector)?.textContent.trim() || null;

    const trustScore = getTextContent('.flex-grid .col-six:nth-child(1) .unblurred');
    const lies = getTextContent('.flex-grid .col-six:nth-child(2) .block-text .unblurred:nth-child(3)');
    const bot = getTextContent('.flex-grid .col-six:nth-child(2) .block-text .unblurred:nth-child(1)');
    const fingerprint = getTextContent('.visitor-info .aside-note-bottom.left');

    return {
      trustScore,
      lies,
      bot,
      fingerprint
    };
  });

  // Save JSON file
  fs.writeFileSync(path.join(__dirname, `creepjs_data_${instance}.json`), JSON.stringify(data, null, 2));

  // Save PDF
  await page.pdf({ path: path.join(__dirname, `creepjs_page_${instance}.pdf`), format: 'A4' });

  await browser.close();
  console.log(`Iteration ${instance} done. JSON and PDF saved.`);
}

runTest(1);
