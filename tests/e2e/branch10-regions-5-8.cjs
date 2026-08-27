const { chromium } = require('playwright');
const fs = require('node:fs');

const URL = process.env.PLAYTEST_URL || 'http://127.0.0.1:4173/';
const viewports = [
  { name:'iphone-small', width:375, height:667 },
  { name:'iphone-standard', width:390, height:844 },
  { name:'iphone-large', width:430, height:932 },
  { name:'iphone-landscape', width:844, height:390 },
  { name:'desktop', width:1440, height:900 },
];
const regions = {
  family:{label:'Familie',boss:'Piratenbaron Vargas',mechanic:'Tribut der Tiefe',standard:['my sister','his father','This is our family.','their parents'],bossAnswers:['my brother','She visits her grandmother.']},
  body:{label:'Körper',boss:'Kapitän Ironhook',mechanic:'Kettenblockade',standard:['the arm','I am tired.','I must drink water.','the back'],bossAnswers:['I can move my arm.','You should rest.']},
  travel:{label:'Unterwegs',boss:'Admiral Thorne',mechanic:'Doppelziel',standard:['to the left','Where is the train station?','We travel by bus.','straight ahead'],bossAnswers:['Which road leads to the harbor?','The train leaves at nine.']},
  movement:{label:'Bewegung',boss:'Kartenmeister Corvin',mechanic:'Kartendrehung',standard:['to jump','She runs every morning.','Turn around!','We went home.'],bossAnswers:['Move to the right.','He jumped over the box.']},
};
function assert(v,m){if(!v)throw new Error(m)}
async function noOverflow(page,label){const m=await page.evaluate(()=>({w:innerWidth,h:document.documentElement.scrollWidth,b:document.body.scrollWidth}));assert(m.h<=m.w+1&&m.b<=m.w+1,`${label}: horizontal overflow ${JSON.stringify(m)}`)}
async function imageLoaded(page,selector,label){await page.waitForFunction(sel=>{const img=document.querySelector(sel);return Boolean(img&&img.complete&&img.naturalWidth>0)},selector,{timeout:8000});}
async function backgroundLoaded(page,label){const url=await page.locator('.world-hero').evaluate(el=>{const bg=getComputedStyle(el).backgroundImage;const m=bg.match(/url\(["']?(.*?)["']?\)/);return m?.[1]||''});assert(url,`${label}: background url missing`);await page.evaluate(async u=>{const img=new Image();img.src=u;if(img.decode)await img.decode();else await new Promise((res,rej)=>{img.onload=res;img.onerror=rej})},url);}
async function choose(page,answer){const options=page.locator('[data-region24-answer]');for(let i=0;i<await options.count();i+=1){const el=options.nth(i);if((await el.getAttribute('data-region24-answer'))===answer){await el.click();return;}}throw new Error(`answer not found: ${answer}`)}
async function sentence(page){const tokens=page.locator('[data-region24-token]');const count=await tokens.count();for(let i=0;i<count;i+=1)await page.locator(`[data-region24-token="${i}"]`).click();await page.locator('[data-action="region24-submit-sentence"]').click();}
async function next(page,action){await page.locator(`.feedback [data-action="${action}"]`).click();}
async function runRegion(page,id,cfg,vp){
  await page.getByTestId('campaign-screen').waitFor();
  const launch=page.locator(`[data-region24="${id}"]`);assert(await launch.count()===1,`${vp}/${id}: campaign launch missing`);await launch.click();
  await page.getByTestId('region24-screen').waitFor();await backgroundLoaded(page,`${vp}/${id}`);await noOverflow(page,`${vp}/${id}/region`);
  if(id==='family'&&vp==='iphone-small')await page.screenshot({path:'test-artifacts/branch10/iphone-small-family.png',fullPage:true});
  if(id==='body'&&vp==='desktop')await page.screenshot({path:'test-artifacts/branch10/desktop-body.png',fullPage:true});
  await page.locator('[data-action="region24-start"]').click();
  for(const answer of cfg.standard){await page.getByTestId('region24-challenge').waitFor();await choose(page,answer);await page.locator('.feedback').waitFor();await next(page,'region24-next');}
  await page.getByTestId('region24-challenge').waitFor();await sentence(page);await page.locator('.feedback').waitFor();await next(page,'region24-next');
  await page.getByTestId('region24-standard-result').waitFor();assert((await page.getByTestId('region24-standard-result').innerText()).includes('Vorbezirke gewonnen!'),`${vp}/${id}: standard gate failed`);
  await page.locator('[data-action="region24-boss-intro"]').click();await page.getByTestId('region24-boss-intro').waitFor();
  const intro=await page.getByTestId('region24-boss-intro').innerText();assert(intro.includes(cfg.boss)&&intro.includes(cfg.mechanic),`${vp}/${id}: boss telegraph missing`);await imageLoaded(page,'[data-testid="region24-boss-intro"] .boss-intro__art img',`${vp}/${id}/boss`);
  if(id==='body')assert(intro.includes('Antwortweg bleibt frei'),`${vp}/body: chain fairness copy missing`);
  if(id==='travel')assert(intro.includes('travel:dock')&&intro.includes('travel:learning'),`${vp}/travel: two targets not visible`);
  if(id==='movement')assert(intro.includes('Adjazenz'),`${vp}/movement: adjacency telegraph missing`);
  if(id==='movement'&&vp==='iphone-landscape')await page.screenshot({path:'test-artifacts/branch10/iphone-landscape-corvin.png',fullPage:true});
  await page.locator('[data-action="region24-boss-start"]').click();
  for(let i=0;i<cfg.bossAnswers.length;i+=1){await page.getByTestId('region24-boss').waitFor();assert((await page.getByTestId('region24-boss').innerText()).includes(cfg.mechanic),`${vp}/${id}: mechanic vanished`);await choose(page,cfg.bossAnswers[i]);await page.locator('.feedback').waitFor();await next(page,'region24-boss-next');if(id==='movement'&&i===0){await page.getByTestId('region24-boss').waitFor();assert((await page.locator('.corvin-grid span').count())===9,`${vp}/movement: 3x3 grid missing`);}}
  await page.getByTestId('region24-boss').waitFor();
  if(id==='family'&&vp==='iphone-standard'){await page.reload({waitUntil:'networkidle'});await page.getByTestId('region24-boss').waitFor();assert((await page.getByTestId('region24-boss').innerText()).includes(cfg.mechanic),'family reload lost boss state');}
  await sentence(page);await page.locator('.feedback').waitFor();await next(page,'region24-boss-next');await page.getByTestId('region24-boss-result').waitFor();assert((await page.getByTestId('region24-boss-result').innerText()).includes(`${cfg.label} befreit!`),`${vp}/${id}: boss victory failed`);await noOverflow(page,`${vp}/${id}/result`);await page.locator('[data-action="campaign"]').click();
}
(async()=>{fs.mkdirSync('test-artifacts/branch10',{recursive:true});const browser=await chromium.launch({headless:true});try{for(const vp of viewports){const page=await browser.newPage({viewport:{width:vp.width,height:vp.height},isMobile:vp.width<600,hasTouch:vp.width<600});const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('pageerror',e=>errors.push(e.message));await page.goto(URL,{waitUntil:'networkidle'});await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'networkidle'});for(const [id,cfg] of Object.entries(regions))await runRegion(page,id,cfg,vp.name);assert(errors.length===0,`${vp.name}: console/page errors ${errors.join(' | ')}`);await page.close();console.log(`PASS ${vp.name} ${vp.width}x${vp.height}`)}}finally{await browser.close()}console.log('Branch 10 regions 5-8 playtest PASS')})().catch(e=>{console.error(e);process.exit(1)});
