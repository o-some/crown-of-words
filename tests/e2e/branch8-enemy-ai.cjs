const { chromium } = require('playwright');
const fs = require('node:fs');

const URL = process.env.PLAYTEST_URL || 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'iphone-small', width: 375, height: 667 },
  { name: 'iphone-standard', width: 390, height: 844 },
  { name: 'iphone-landscape', width: 844, height: 390 },
  { name: 'desktop', width: 1440, height: 900 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const normalized = (value) => String(value).toLocaleLowerCase('de-DE');

async function assertNoOverflow(page, label) {
  const metrics = await page.evaluate(() => ({ width: innerWidth, html: document.documentElement.scrollWidth, body: document.body.scrollWidth }));
  assert(metrics.html <= metrics.width + 1, `${label}: html overflow ${metrics.html}/${metrics.width}`);
  assert(metrics.body <= metrics.width + 1, `${label}: body overflow ${metrics.body}/${metrics.width}`);
}

async function clickAnswer(page, answer) {
  await page.locator(`[data-answer="${answer}"]`).click();
  await page.getByTestId('feedback').waitFor();
}

async function buildSentenceMixed(page) {
  const dropzone = page.locator('[data-token-dropzone]');
  await page.locator('[data-drag-token-index="2"]').dragTo(dropzone);
  await page.locator('[data-token-index="1"]').click();
  await page.locator('[data-token-index="0"]').click();
  await page.locator('[data-action="submit-sentence"]').click();
  await page.getByTestId('feedback').waitFor();
}

async function answerBoss(page) {
  const prompt = (await page.locator('.challenge-card h2').innerText()).trim();
  const answers = { Blume: 'flower', Sonne: 'sun', Baum: 'tree', 'blüht': 'blooms' };
  if (prompt === 'Der Garten blüht.') return buildSentenceMixed(page);
  assert(answers[prompt], `unknown boss prompt ${prompt}`);
  return clickAnswer(page, answers[prompt]);
}

async function run(browser, viewport) {
  const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, isMobile: viewport.width < 600, hasTouch: viewport.width < 600 });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByTestId('campaign-screen').waitFor();
  await page.locator('[data-action="open-garden"]').first().click();
  await page.getByTestId('garden-screen').waitFor();

  const gardenIntent = page.getByTestId('enemy-intent');
  assert(await gardenIntent.count() === 1, `${viewport.name}: enemy intent missing before mission`);
  let intentText = await gardenIntent.innerText();
  assert(intentText.includes('Niko'), `${viewport.name}: Niko not identified`);
  assert(normalized(intentText).includes('sichtbarer intent'), `${viewport.name}: intent is not telegraphed`);
  assert(intentText.includes('Versorgung') && intentText.includes('Verteidigung'), `${viewport.name}: supply/defense telemetry missing`);
  await assertNoOverflow(page, `${viewport.name}/garden-intent`);
  fs.mkdirSync('test-artifacts/branch8', { recursive: true });
  await page.screenshot({ path: `test-artifacts/branch8/${viewport.name}-garden-intent.png`, fullPage: true });

  await page.getByTestId('start-standard').click();
  await page.getByTestId('standard-challenge').waitFor();
  intentText = await page.getByTestId('enemy-intent').innerText();
  assert(normalized(intentText).includes('sichtbarer intent'), `${viewport.name}: intent vanished in challenge`);

  await clickAnswer(page, 'flower');
  await page.locator('[data-action="next-standard"]').click();
  await clickAnswer(page, 'green');
  await page.locator('[data-action="next-standard"]').click();

  await page.getByTestId('enemy-turn-screen').waitFor();
  let turnText = await page.getByTestId('enemy-turn-screen').innerText();
  assert(turnText.includes('Gegnerzug · Runde 1'), `${viewport.name}: wrong enemy round before resolution`);
  assert(turnText.includes('Niko ist dran'), `${viewport.name}: explicit Niko turn missing`);
  assert(turnText.includes('Keine zukünftigen Antworten'), `${viewport.name}: fairness contract not visible`);
  await assertNoOverflow(page, `${viewport.name}/enemy-turn`);
  await page.screenshot({ path: `test-artifacts/branch8/${viewport.name}-enemy-turn.png`, fullPage: true });

  await page.reload({ waitUntil: 'networkidle' });
  await page.getByTestId('enemy-turn-screen').waitFor();
  turnText = await page.getByTestId('enemy-turn-screen').innerText();
  assert(turnText.includes('Gegnerzug · Runde 1'), `${viewport.name}: reload advanced enemy turn/offline state`);
  assert(turnText.includes('Niko ist dran'), `${viewport.name}: reload changed enemy identity`);

  await page.getByTestId('resolve-enemy-turn').click();
  await page.getByTestId('standard-challenge').waitFor();
  const resolvedIntent = await page.getByTestId('enemy-intent').innerText();
  assert(normalized(resolvedIntent).includes('ausgeführt'), `${viewport.name}: resolved intent is not marked`);
  const outcome = await page.locator('.enemy-outcome').innerText();
  assert(outcome.includes('ausgekundschaftet'), `${viewport.name}: Niko outcome missing`);
  assert(outcome.includes('Sprachaufgaben bleiben unverändert'), `${viewport.name}: language-truth promise missing`);

  await clickAnswer(page, 'water');
  await page.locator('[data-action="next-standard"]').click();
  await clickAnswer(page, 'grows');
  await page.locator('[data-action="next-standard"]').click();
  await buildSentenceMixed(page);
  await page.locator('[data-action="next-standard"]').click();
  await page.getByTestId('standard-result').waitFor();
  assert((await page.getByTestId('standard-result').innerText()).includes('Anlegestelle befreit!'), `${viewport.name}: standard victory failed after enemy turn`);

  await page.locator('[data-action="boss-intro"]').click();
  await page.getByTestId('start-boss').click();
  await page.getByTestId('boss-stage').waitFor();
  let sawCheat = false;
  for (let step = 0; step < 5; step += 1) {
    const readyCard = page.locator('[data-card-id]:not([disabled])').first();
    if (await readyCard.count()) await readyCard.click();
    await answerBoss(page);
    const text = await page.getByTestId('feedback').innerText();
    if (text.includes('Kai schummelt!')) sawCheat = true;
    await page.locator('[data-action="next-boss"]').click();
    if (step < 4) await page.getByTestId('boss-stage').waitFor();
  }
  await page.getByTestId('boss-result').waitFor();
  assert((await page.getByTestId('boss-result').innerText()).includes('Der Garten gehört wieder Tula!'), `${viewport.name}: boss regression after AI layer`);
  assert(sawCheat, `${viewport.name}: Kai cheat regression after AI layer`);
  await assertNoOverflow(page, `${viewport.name}/victory`);
  assert(errors.length === 0, `${viewport.name}: console/page errors ${errors.join(' | ')}`);
  await page.close();
  console.log(`PASS ${viewport.name} ${viewport.width}x${viewport.height}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) await run(browser, viewport);
  } finally {
    await browser.close();
  }
  console.log('Branch 8 enemy AI playtest PASS');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
