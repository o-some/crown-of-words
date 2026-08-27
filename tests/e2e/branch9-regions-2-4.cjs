const { chromium } = require('playwright');
const fs = require('node:fs');

const URL = process.env.PLAYTEST_URL || 'http://127.0.0.1:4173/';
const viewports = [
  { name: 'iphone-small', width: 375, height: 667 },
  { name: 'iphone-standard', width: 390, height: 844 },
  { name: 'iphone-large', width: 430, height: 932 },
  { name: 'iphone-landscape', width: 844, height: 390 },
  { name: 'desktop', width: 1440, height: 900 },
];
const regions = {
  library: {
    label: 'Bibliothek', boss: 'Kapitän Brax', mechanic: 'Wanderndes Pulverfass',
    standard: ['the book','the page','a word','I read a book.'], bossAnswers: ['the library','I open the book.'],
  },
  wildlife: {
    label: 'Tierwelt', boss: 'Blackfinn', mechanic: 'Nebel der falschen Spur',
    standard: ['the bird','fast','The fox is faster than the turtle.','big'], bossAnswers: ['dangerous','The eagle flies high.'],
  },
  home: {
    label: 'Zuhause', boss: 'Alt-Kapitän Roderick', mechanic: 'Revanchefluch',
    standard: ['the kitchen','under the table','The key is next to the door.','the window'], bossAnswers: ['on the shelf','The picture is above the sofa.'],
  },
};
function assert(v,m){if(!v)throw new Error(m)}
async function noOverflow(page,label){const m=await page.evaluate(()=>({w:innerWidth,h:document.documentElement.scrollWidth,b:document.body.scrollWidth}));assert(m.h<=m.w+1&&m.b<=m.w+1,`${label}: horizontal overflow ${JSON.stringify(m)}`)}
async function imageLoaded(page, selector, label){const ok=await page.locator(selector).evaluate(img=>img.complete&&img.naturalWidth>0);assert(ok,`${label}: image did not load`)}
async function choose(page, answer){const options=page.locator('[data-region24-answer]');const count=await options.count();for(let i=0;i<count;i+=1){const el=options.nth(i);if((await el.getAttribute('data-region24-answer'))===answer){await el.click();return;}}throw new Error(`answer not found: ${answer}`)}
async function sentence(page){const tokens=page.locator('[data-region24-token]');const count=await tokens.count();for(let i=0;i<count;i+=1)await page.locator(`[data-region24-token="${i}"]`).click();await page.locator('[data-action="region24-submit-sentence"]').click();}
async function nextFeedback(page, action){await page.locator(`.feedback [data-action="${action}"]`).click();}
async function runRegion(page, regionId, cfg, viewportName){
  await page.getByTestId('campaign-screen').waitFor();
  await page.locator(`[data-region24="${regionId}"]`).click();
  await page.getByTestId('region24-screen').waitFor();
  assert((await page.getByTestId('region24-screen').innerText()).includes(cfg.label),`${viewportName}/${regionId}: region label missing`);
  await noOverflow(page,`${viewportName}/${regionId}/world`);
  if(regionId==='library'&&viewportName==='iphone-small')await page.screenshot({path:'test-artifacts/branch9/iphone-small-library.png',fullPage:true});
  if(regionId==='home'&&viewportName==='desktop')await page.screenshot({path:'test-artifacts/branch9/desktop-home.png',fullPage:true});
  await page.locator('[data-action="region24-start"]').click();
  for(let i=0;i<4;i+=1){
    await page.getByTestId('region24-challenge').waitFor();
    if(regionId==='home'&&i===0){const buttons=page.locator('[data-region24-answer]');await buttons.nth(1).click();}else await choose(page,cfg.standard[i]);
    await page.locator('.feedback').waitFor();
    await nextFeedback(page,'region24-next');
  }
  await page.getByTestId('region24-challenge').waitFor();await sentence(page);await page.locator('.feedback').waitFor();await nextFeedback(page,'region24-next');
  await page.getByTestId('region24-standard-result').waitFor();
  assert((await page.getByTestId('region24-standard-result').innerText()).includes('Vorbezirke gewonnen!'),`${viewportName}/${regionId}: standard gate failed`);
  await page.locator('[data-action="region24-boss-intro"]').click();await page.getByTestId('region24-boss-intro').waitFor();
  const intro=await page.getByTestId('region24-boss-intro').innerText();assert(intro.includes(cfg.boss)&&intro.includes(cfg.mechanic),`${viewportName}/${regionId}: boss/mechanic intro missing`);
  await imageLoaded(page,'[data-testid="region24-boss-intro"] .boss-intro__art img',`${viewportName}/${regionId}/boss`);
  if(regionId==='home')assert(intro.includes('room:kitchen'),`${viewportName}/home: Roderick did not use actual error concept`);
  if(regionId==='wildlife')assert(intro.includes('niemals die richtige Sprachantwort'),`${viewportName}/wildlife: fog fairness copy missing`);
  if(regionId==='library'&&viewportName==='iphone-landscape')await page.screenshot({path:'test-artifacts/branch9/iphone-landscape-brax-intro.png',fullPage:true});
  await noOverflow(page,`${viewportName}/${regionId}/boss-intro`);
  await page.locator('[data-action="region24-boss-start"]').click();
  for(let i=0;i<2;i+=1){await page.getByTestId('region24-boss').waitFor();assert((await page.getByTestId('region24-boss').innerText()).includes(cfg.mechanic),`${viewportName}/${regionId}: mechanic telegraph vanished`);await choose(page,cfg.bossAnswers[i]);await page.locator('.feedback').waitFor();await nextFeedback(page,'region24-boss-next');}
  await page.getByTestId('region24-boss').waitFor();await sentence(page);await page.locator('.feedback').waitFor();await nextFeedback(page,'region24-boss-next');
  await page.getByTestId('region24-boss-result').waitFor();assert((await page.getByTestId('region24-boss-result').innerText()).includes(`${cfg.label} befreit!`),`${viewportName}/${regionId}: boss victory failed`);
  await noOverflow(page,`${viewportName}/${regionId}/result`);
  await page.locator('[data-action="campaign"]').click();
}
(async()=>{fs.mkdirSync('test-artifacts/branch9',{recursive:true});const browser=await chromium.launch({headless:true});try{for(const vp of viewports){const page=await browser.newPage({viewport:{width:vp.width,height:vp.height},isMobile:vp.width<600,hasTouch:vp.width<600});const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message));await page.goto(URL,{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});for(const [id,cfg] of Object.entries(regions))await runRegion(page,id,cfg,vp.name);assert(errors.length===0,`${vp.name}: console/page errors ${errors.join(' | ')}`);await page.close();console.log(`PASS ${vp.name} ${vp.width}x${vp.height}`)}}finally{await browser.close()}console.log('Branch 9 regions 2-4 playtest PASS')})().catch(e=>{console.error(e);process.exit(1)});
