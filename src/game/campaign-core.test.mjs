import assert from 'node:assert/strict';
import test from 'node:test';
import { createCampaignDefinition, validateCampaignDefinition } from './campaign-data.js';
import { applyEnemyIntent, areDistrictsAdjacent, areRegionsConnected, canAttack, createCampaignState, createEnemyIntent, endPlayerRound, nextRandom, refreshSupply, resolveEnemyRound, restoreCampaign, serializeCampaign, setDistrictStatus, unlockLocalProgress } from './campaign-core.js';

test('definition has ten regions, fifty districts and valid symmetric graph',()=>{const d=createCampaignDefinition();assert.equal(Object.keys(d.regions).length,10);assert.equal(Object.keys(d.districts).length,50);assert.deepEqual(validateCampaignDefinition(d),[]);assert.equal(areDistrictsAdjacent(createCampaignState(1),'garden:dock','garden:learning'),true);assert.equal(areRegionsConnected(createCampaignState(1),'garden','library'),true);assert.equal(areRegionsConnected(createCampaignState(1),'garden','crown-castle'),false);});

test('local progression unlocks in order without skipping boss gate',()=>{let s=createCampaignState();s=setDistrictStatus(s,'garden:dock','controlled','player');s=unlockLocalProgress(s,'garden');assert.equal(s.districts['garden:learning'].status,'neutral');assert.equal(s.districts['garden:village'].status,'locked');s=setDistrictStatus(s,'garden:learning','controlled','player');s=unlockLocalProgress(s,'garden');assert.equal(s.districts['garden:village'].status,'neutral');});

test('attack requires player ownership and explicit adjacency',()=>{let s=createCampaignState();s=setDistrictStatus(s,'garden:dock','controlled','player');s=setDistrictStatus(s,'garden:learning','neutral');assert.equal(canAttack(s,'garden:dock','garden:learning'),true);assert.equal(canAttack(s,'garden:dock','garden:arena'),false);});

test('supply is deterministic and mastery survives contest',()=>{let s=createCampaignState();s=setDistrictStatus(s,'garden:dock','controlled','player');s=setDistrictStatus(s,'garden:learning','mastered','player');s=refreshSupply(s);assert.equal(s.districts['garden:dock'].supply,3);s=applyEnemyIntent(s,{enemyId:'niko',type:'contest',targetId:'garden:learning'});assert.equal(s.districts['garden:learning'].status,'contested');assert.equal(s.districts['garden:learning'].owner,'player');});

test('seeded rng and enemy intent are reproducible',()=>{const a=createCampaignState(4242),b=createCampaignState(4242);assert.deepEqual(nextRandom(a),nextRandom(b));assert.deepEqual(createEnemyIntent(a),createEnemyIntent(b));});

test('enemy turn is explicit and advances only when resolved',()=>{let s=createCampaignState(9);s=setDistrictStatus(s,'garden:dock','controlled','player');s=endPlayerRound(s);assert.equal(s.phase,'enemy');assert.equal(s.round,1);assert.equal(s.enemyIntents.length,1);s=resolveEnemyRound(s);assert.equal(s.phase,'player');assert.equal(s.round,2);assert.equal(s.commandPearls,3);});

test('save roundtrip preserves deterministic state',()=>{let s=createCampaignState(123);s=setDistrictStatus(s,'garden:dock','controlled','player');s=endPlayerRound(s);const restored=restoreCampaign(serializeCampaign(s));assert.deepEqual(restored,s);assert.deepEqual(createEnemyIntent(restored),createEnemyIntent(s));});
