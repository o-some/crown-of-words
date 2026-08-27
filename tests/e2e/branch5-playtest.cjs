const { chromium } = require('playwright');
const fs = require('node:fs');

const URL = process.env.PLAYTEST_URL || 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'iphone-small', width: 375, height: 667 },
  { name: 'iphone-standard', width: 390, height: 844 },
  { name: 'iphone-large', width: 430, height: 932 },
  { name: 'desktop', width: 1440, height: 900 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function clickAnswer(page, answer) {
  await page.locator(`[data-answer="${answer}"]`).click();
  await page.getByTestId('feedback').waitFor();
}

async function buildSentence(page) {
  await page.locator('[data-token-index="2"]').click();
  await page.locator('[data-token-index="1"]').click();
  await page.locator('[data-token-index="0"]').click();
  await page.locator('[data-action="submit-sentence"]').click();
  await page.getByTestId('feedback').waitFor();
}

async function answerVisibleBossTask(page) {
  const prompt = (await page.locator('.challenge-card h2').innerText()).trim();
  const answers = { 'Blume': 'flower', 'Sonne': 'sun', 'Baum': 'tree', 'blüht': 'blooms' };
  if (prompt === 'Der Garten blüht.') return buildSentence(page);
  const answer = answers[prompt];
  assert(answer, `unknown boss prompt: ${prompt}`);
  return clickAnswer(page, answer);
}

async function assertLayout(page, label) {
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
  }));
  assert(metrics.scrollWidth <= metrics.width + 1, `${label}: document horizontal overflow ${metrics.scrollWidth}/${metrics.width}`);
  assert(metrics.bodyScrollWidth <= metrics.width + 1, `${label}: body horizontal overflow ${metrics.bodyScrollWidth}/${metrics.width}`);
}

async function runFlow(browser, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width < 600, hasTouch: viewport.width < 600 });
  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.getByTestId('campaign-screen').waitFor();
  await assertLayout(page, `${viewport.name}/campaign`);
  await page.locator('[data-action="open-garden"]').first().click();
  await page.getByTestId('garden-screen').waitFor();
  await page.getByTestId('start-standard').click();

  for (const answer of ['apple', 'green', 'water', 'grows']) {
    await clickAnswer(page, answer);
    await page.locator('[data-action="next-standard"]').click();
  }
  await buildSentence(page);
  await page.locator('[data-action="next-standard"]').click();
  await page.getByTestId('standard-result').waitFor();
  assert((await page.getByTestId('standard-result').innerText()).includes('Anlegestelle befreit!'), `${viewport.name}: standard encounter not won`);

  await page.locator('[data-action="boss-intro"]').click();
  await page.getByTestId('boss-intro').waitFor();
  const kaiLoaded = await page.getByTestId('kai-sprite').evaluate((img) => img.complete && img.naturalWidth > 0);
  assert(kaiLoaded, `${viewport.name}: Kai sprite failed to load`);
  await page.getByTestId('start-boss').click();
  await page.getByTestId('boss-stage').waitFor();
  await assertLayout(page, `${viewport.name}/boss`);

  let sawCheat = false;
  let usedAnchor = false;
  for (let step = 0; step < 5; step += 1) {
    if (!usedAnchor) {
      const anchor = page.locator('[data-anchor]').first();
      if (await anchor.count()) {
        await anchor.click();
        assert(await page.locator('.kai-card--anchored').count(), `${viewport.name}: Ankerblick did not mark a task`);
        usedAnchor = true;
      }
    }
    await answerVisibleBossTask(page);
    const feedbackText = await page.getByTestId('feedback').innerText();
    if (feedbackText.includes('Kai schummelt!')) sawCheat = true;
    await page.locator('[data-action="next-boss"]').click();
    if (step < 4) await page.getByTestId('boss-stage').waitFor();
  }

  await page.getByTestId('boss-result').waitFor();
  const finalText = await page.getByTestId('boss-result').innerText();
  assert(finalText.includes('Der Garten gehört wieder Tula!'), `${viewport.name}: boss result was not victory`);
  assert(sawCheat, `${viewport.name}: Kai cheat was never visibly telegraphed`);
  assert(usedAnchor, `${viewport.name}: Ankerblick was not usable`);
  await assertLayout(page, `${viewport.name}/result`);
  assert(consoleErrors.length === 0, `${viewport.name}: console/page errors: ${consoleErrors.join(' | ')}`);

  fs.mkdirSync('test-artifacts', { recursive: true });
  await page.screenshot({ path: `test-artifacts/${viewport.name}-victory.png`, fullPage: true });
  await page.close();
  console.log(`PASS ${viewport.name} ${viewport.width}x${viewport.height}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) await runFlow(browser, viewport);
  } finally {
    await browser.close();
  }
  console.log('Branch 5 browser playtest PASS');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
