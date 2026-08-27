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

async function assertNoOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    html: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
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
  const built = await dropzone.innerText();
  assert(built.includes('The') && built.includes('flower') || built.includes('garden'), 'sentence builder did not accept mixed drag/tap input');
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
  const page = await browser.newPage({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.width < 600,
    hasTouch: viewport.width < 600,
  });
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByTestId('campaign-screen').waitFor();
  await page.locator('[data-action="open-garden"]').first().click();
  await page.getByTestId('garden-screen').waitFor();

  const helpers = page.locator('[data-helper-id]');
  assert(await helpers.count() === 4, `${viewport.name}: helper picker is not four helpers`);
  const loaded = await helpers.locator('img').evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0));
  assert(loaded, `${viewport.name}: helper sprite failed to load`);

  const neri = page.locator('[data-helper-id="helper-neri-nature"]');
  await neri.focus();
  await page.keyboard.press('Enter');
  assert(await neri.getAttribute('aria-pressed') === 'true', `${viewport.name}: keyboard helper selection failed`);
  await page.reload({ waitUntil: 'networkidle' });
  assert(await page.locator('[data-helper-id="helper-neri-nature"]').getAttribute('aria-pressed') === 'true', `${viewport.name}: helper selection did not survive reload`);
  await page.locator('[data-helper-id="helper-meli-food"]').click();

  assert(await page.getByTestId('card-hand').locator('[data-card-id]').count() === 4, `${viewport.name}: garden hand is not four cards`);
  await assertNoOverflow(page, `${viewport.name}/loadout`);
  fs.mkdirSync('test-artifacts/branch7', { recursive: true });
  await page.screenshot({ path: `test-artifacts/branch7/${viewport.name}-loadout.png`, fullPage: true });

  await page.getByTestId('start-standard').click();
  await page.getByTestId('standard-challenge').waitFor();

  const scout = page.locator('[data-card-id="card-garden-scout"]');
  await scout.focus();
  await page.keyboard.press('Enter');
  assert(await scout.getAttribute('aria-pressed') === 'true', `${viewport.name}: keyboard card selection failed`);
  await clickAnswer(page, 'pear');
  let feedback = await page.getByTestId('feedback').innerText();
  assert(feedback.includes('Entdecker-Rückerstattung'), `${viewport.name}: explorer refund missing`);
  assert(feedback.includes('Meli federt'), `${viewport.name}: Meli helper feedback missing`);
  await page.reload({ waitUntil: 'networkidle' });
  feedback = await page.getByTestId('feedback').innerText();
  assert(feedback.includes('Entdecker-Rückerstattung'), `${viewport.name}: card feedback not reload safe`);
  await page.locator('[data-action="next-standard"]').click();

  const scoutAgain = page.locator('[data-card-id="card-garden-scout"]');
  assert(!(await scoutAgain.isDisabled()), `${viewport.name}: refunded card should remain ready`);
  await scoutAgain.click();
  await clickAnswer(page, 'green');
  feedback = await page.getByTestId('feedback').innerText();
  assert(feedback.includes('Blätterspäher aktiviert'), `${viewport.name}: correct answer did not activate card`);
  await page.locator('[data-action="next-standard"]').click();
  assert(await page.locator('[data-card-id="card-garden-scout"]').isDisabled(), `${viewport.name}: played card is not locked`);

  await page.locator('[data-card-id="card-garden-supply"]').click();
  await clickAnswer(page, 'water');
  await page.locator('[data-action="next-standard"]').click();
  await page.locator('[data-card-id="card-garden-rally"]').click();
  await clickAnswer(page, 'grows');
  await page.locator('[data-action="next-standard"]').click();
  await buildSentenceMixed(page);
  await page.locator('[data-action="next-standard"]').click();
  await page.getByTestId('standard-result').waitFor();
  assert((await page.getByTestId('standard-result').innerText()).includes('Anlegestelle befreit!'), `${viewport.name}: cards allowed no valid standard victory`);

  await page.locator('[data-action="boss-intro"]').click();
  await page.getByTestId('start-boss').click();
  await page.getByTestId('boss-stage').waitFor();
  assert(await page.getByTestId('card-hand').locator('[data-card-id]').count() === 4, `${viewport.name}: boss hand did not reset to four cards`);

  let sawCheat = false;
  for (let step = 0; step < 5; step += 1) {
    const readyCard = page.locator('[data-card-id]:not([disabled])').first();
    if (await readyCard.count()) await readyCard.click();
    await answerBoss(page);
    const text = await page.getByTestId('feedback').innerText();
    if (text.includes('Kai schummelt!')) sawCheat = true;
    if (step === 0) {
      await page.reload({ waitUntil: 'networkidle' });
      assert(await page.getByTestId('feedback').count(), `${viewport.name}: boss card state failed reload`);
    }
    await page.locator('[data-action="next-boss"]').click();
    if (step < 4) await page.getByTestId('boss-stage').waitFor();
  }
  await page.getByTestId('boss-result').waitFor();
  assert((await page.getByTestId('boss-result').innerText()).includes('Der Garten gehört wieder Tula!'), `${viewport.name}: boss victory failed`);
  assert(sawCheat, `${viewport.name}: Kai cheat disappeared with card layer`);
  await assertNoOverflow(page, `${viewport.name}/victory`);
  assert(errors.length === 0, `${viewport.name}: console/page errors ${errors.join(' | ')}`);
  await page.screenshot({ path: `test-artifacts/branch7/${viewport.name}-victory.png`, fullPage: true });
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
  console.log('Branch 7 cards/helpers playtest PASS');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
