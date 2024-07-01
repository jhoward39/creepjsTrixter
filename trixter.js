const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function runTest(instance) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://abrahamjuliot.github.io/creepjs/');
  await sleep(5000); // Wait for page to fully load

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
// (async () => {
//   for (let i = 1; i <= 3; i++) {
//     console.log(`Starting iteration ${i}...`);
//     await runTest(i);
//     await runTest(i + 3);
//   }
// })();
