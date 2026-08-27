const { chromium } = require('playwright');
const fs = require('node:fs');

const URL = process.env.PLAYTEST_URL || 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'iphone-small', width: 375, height: 667, mobile: true },
  { name: 'iphone-standard', width: 390, height: 844, mobile: true },
  { name: 'iphone-large', width: 430, height: 932, mobile: true },
  { name: 'iphone-landscape', width: 844, height: 390, mobile: true },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function clearSave(page) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
}

async function assertNoHorizontalOverflow(page, label) {
  const metrics = await page.evaluate(() => ({
    width: innerWidth,
    doc: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  assert(metrics.doc <= metrics.width + 1, `${label}: document overflow ${metrics.doc}/${metrics.width}`);
  assert(metrics.body <= metrics.width + 1, `${label}: body overflow ${metrics.body}/${metrics.width}`);
}

async function assertPrimaryInteractionVisible(page, selector, label) {
  const box = await page.locator(selector).boundingBox();
  assert(box, `${label}: primary interaction missing`);
  const height = await page.evaluate(() => innerHeight);
  assert(box.y >= -1 && box.y + box.height <= height + 1, `${label}: primary interaction requires vertical scroll (${box.y + box.height}/${height})`);
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
  const answers = { Blume: 'flower', Sonne: 'sun', Baum: 'tree', 'blüht': 'blooms' };
  if (prompt === 'Der Garten blüht.') return buildSentence(page);
  const answer = answers[prompt];
  assert(answer, `unknown boss prompt: ${prompt}`);
  return clickAnswer(page, answer);
}

async function exercisePauseAndHelp(page, label) {
  const promptBefore = await page.locator('.challenge-card h2').innerText();
  await page.locator('[data-action="pause"]').click();
  await page.getByTestId('pause-overlay').waitFor();
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByTestId('pause-overlay').waitFor();
  await page.getByTestId('resume-game').click();
  assert((await page.locator('.challenge-card h2').innerText()) === promptBefore, `${label}: pause/reload changed challenge`);

  await page.locator('[data-action="help"]').click();
  await page.getByTestId('help-overlay').waitFor();
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByTestId('help-overlay').waitFor();
  await page.getByTestId('close-help').click();
  assert((await page.locator('.challenge-card h2').innerText()) === promptBefore, `${label}: help/reload changed challenge`);
}

async function runFlow(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: viewport.mobile,
    hasTouch: viewport.mobile,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', (error) => errors.push(error.message));

  fs.mkdirSync('test-artifacts/branch6', { recursive: true });
  await clearSave(page);
  await page.getByTestId('campaign-screen').waitFor();
  await assertNoHorizontalOverflow(page, `${viewport.name}/campaign`);

  await page.locator('[data-action="help"]').click();
  await page.getByTestId('help-overlay').waitFor();
  await page.getByTestId('close-help').click();
  await page.locator('[data-action="pause"]').click();
  await page.getByTestId('pause-overlay').waitFor();
  await page.getByTestId('resume-game').click();

  await page.locator('[data-action="open-garden"]').first().click();
  await page.getByTestId('garden-screen').waitFor();
  await page.getByTestId('start-standard').click();
  await page.getByTestId('standard-challenge').waitFor();
  await assertNoHorizontalOverflow(page, `${viewport.name}/challenge`);
  if (viewport.height >= 667) await assertPrimaryInteractionVisible(page, '[data-action="hint"]', `${viewport.name}/challenge`);

  // Wrong answer must teach, survive reload, and not double-resolve.
  await clickAnswer(page, 'pear');
  const wrongText = await page.getByTestId('feedback').innerText();
  assert(wrongText.includes('Noch nicht.'), `${viewport.name}: wrong feedback missing`);
  assert(wrongText.includes('apple'), `${viewport.name}: corrective answer missing`);
  await page.screenshot({ path: `test-artifacts/branch6/${viewport.name}-wrong.png`, fullPage: true });
  await page.reload({ waitUntil: 'networkidle' });
  const wrongAfterReload = await page.getByTestId('feedback').innerText();
  assert(wrongAfterReload === wrongText, `${viewport.name}: wrong feedback changed after reload`);
  await page.locator('[data-action="next-standard"]').click();

  // Hint reduces score; pause/help preserve exact active challenge across reload.
  await page.locator('[data-action="hint"]').click();
  await clickAnswer(page, 'green');
  assert((await page.getByTestId('feedback').innerText()).includes('+2 Wortkraft'), `${viewport.name}: hint did not reduce word power`);
  await page.locator('[data-action="next-standard"]').click();
  await exercisePauseAndHelp(page, `${viewport.name}/standard`);

  for (const answer of ['water', 'grows']) {
    await clickAnswer(page, answer);
    await page.locator('[data-action="next-standard"]').click();
  }
  await buildSentence(page);
  await page.locator('[data-action="next-standard"]').click();
  await page.getByTestId('standard-result').waitFor();
  assert((await page.getByTestId('standard-result').innerText()).includes('Anlegestelle befreit!'), `${viewport.name}: standard result not won`);

  await page.locator('[data-action="boss-intro"]').click();
  await page.getByTestId('boss-intro').waitFor();
  const kaiLoaded = await page.getByTestId('kai-sprite').evaluate((img) => img.complete && img.naturalWidth > 0);
  assert(kaiLoaded, `${viewport.name}: Kai asset not loaded`);
  await page.getByTestId('start-boss').click();
  await page.getByTestId('boss-stage').waitFor();
  await assertNoHorizontalOverflow(page, `${viewport.name}/boss`);

  // Resolve one boss task, then reload while feedback + cheat telemetry are active.
  await answerVisibleBossTask(page);
  const bossFeedback = await page.getByTestId('feedback').innerText();
  assert(bossFeedback.includes('Kai schummelt!'), `${viewport.name}: Kai cheat not telegraphed`);
  await page.screenshot({ path: `test-artifacts/branch6/${viewport.name}-kai-cheat.png`, fullPage: true });
  await page.reload({ waitUntil: 'networkidle' });
  const bossFeedbackReload = await page.getByTestId('feedback').innerText();
  assert(bossFeedbackReload === bossFeedback, `${viewport.name}: boss feedback/cheat changed after reload`);
  await page.locator('[data-action="next-boss"]').click();
  await page.getByTestId('boss-stage').waitFor();
  await exercisePauseAndHelp(page, `${viewport.name}/boss`);

  let usedAnchor = false;
  for (let guard = 0; guard < 8; guard += 1) {
    if (await page.getByTestId('boss-result').count()) break;
    if (!usedAnchor) {
      const anchor = page.locator('[data-anchor]').first();
      if (await anchor.count()) {
        await anchor.click();
        assert(await page.locator('.kai-card--anchored').count(), `${viewport.name}: anchor did not visibly attach`);
        usedAnchor = true;
      }
    }
    await answerVisibleBossTask(page);
    await page.locator('[data-action="next-boss"]').click();
    await page.waitForTimeout(20);
  }

  await page.getByTestId('boss-result').waitFor();
  const resultText = await page.getByTestId('boss-result').innerText();
  assert(resultText.includes('Der Garten gehört wieder Tula!'), `${viewport.name}: Kai victory missing`);
  assert(usedAnchor, `${viewport.name}: Ankerblick never became usable`);
  await page.reload({ waitUntil: 'networkidle' });
  assert((await page.getByTestId('boss-result').innerText()).includes('Der Garten gehört wieder Tula!'), `${viewport.name}: boss victory did not survive reload`);
  await assertNoHorizontalOverflow(page, `${viewport.name}/victory`);
  await page.screenshot({ path: `test-artifacts/branch6/${viewport.name}-victory.png`, fullPage: true });

  assert(errors.length === 0, `${viewport.name}: console/page errors: ${errors.join(' | ')}`);
  await context.close();
  console.log(`PASS ${viewport.name} ${viewport.width}x${viewport.height}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) await runFlow(browser, viewport);
  } finally {
    await browser.close();
  }
  console.log('Branch 6 PlayBrain visual gate PASS');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
