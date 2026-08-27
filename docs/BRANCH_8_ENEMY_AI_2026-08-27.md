# Crown of Words – Branch 8 Enemy AI Evidence

Stand: 27.08.2026

## Baseline

- Repository: `o-some/crown-of-words`
- Branch: `branch-8-enemy-ai`
- Exact Branch-7 baseline: `58198d777b9fb40f51854543c70e952a7ef1efdf`
- `main` was not modified.
- Rollback branch: `rollback/branch-8-enemy-ai-58198d7`

## Scope delivered

Branch 8 adds the normal-enemy AI layer defined by the master specification without opening later regions prematurely.

Canonical archetypes:

1. Niko – Leichter Deckhand – weak/neutral pressure
2. Lio – Schneller Kundschafter – scouting and feints
3. Mako – Robuster Räuber – fortification and raids
4. Taro – Schild-Bukanier – defensive contesting
5. Piko – Wellen-Skater – route-oriented scouting/contesting
6. Koda – Anker-Brute – blockades/fortification
7. Yara – Gezeitenruferin – support/fortification
8. Riven – Kanonen-Korsarin – visible raid/blockade pressure

All eight use separate technical IDs and deterministic seeded planning.

## Fairness contract

The AI director is a pure deterministic layer. For every enemy it plans at most one main action per turn. It can inspect campaign state, ownership, supply, fortification and legal district states, but it has no contract for future player answers or the correct language answer.

Tests explicitly pass a hypothetical future-answer field into planning and verify that neither this field nor `correctAnswer` appears in the resulting intent/decision output.

Every normal action is telegraphed before resolution. Decision logs record archetype, chosen action, target, score, difficulty and RNG state before/after so decisions can be reproduced.

Unknown archetype IDs fail closed.

## Supply, defense and pressure

Campaign state version is now 2 and adds:

- `enemyDecisionLog`
- `supplyPressure`
- `blockades`
- explicit district `fortification`

Supported visible effects:

- `scout`: neutral district becomes scouted
- `fortify`: fortification rises up to 3
- `raid`: temporary regional supply pressure rises up to 3
- `contest`: controlled/mastered player district becomes contested while player mastery ownership is preserved
- `blockade`: explicit blockade entry is stored
- `feint`: telegraphed primary player target can become contested

Supply is recalculated deterministically. Tactical pressure may influence encounter pressure, but never changes language correctness, Crown Sentence truth or stored mastery.

## Offline rule

`reconcileOfflineCampaign()` is intentionally a no-op clone via `preserveOfflineState()`.

Reloading or returning after time away cannot:

- resolve an enemy intent,
- increment the round,
- conquer a district,
- change supply by an enemy turn,
- create a blockade.

Only explicit `resolveEnemyRound()` while phase is `enemy` applies the already visible intents.

## Garden vertical slice

Only Niko is surfaced in Region 1. The other seven archetypes are implemented/tested in the pure AI layer and are not artificially spawned into the Garden.

The Garden now shows before mission start:

- Niko name and role
- visible intent
- target district
- supply 0–5
- defense 0–3

After two language tasks, gameplay enters an explicit opponent-turn screen. The player sees the same previously announced intent and confirms `Nikos Zug ansehen`. Only then is the action resolved. The game then returns to the existing language flow.

The opponent-turn screen visibly states the fairness rule: one main action, no future answers, no hidden turn, no offline conquest.

No unverified enemy sprite path or fabricated runtime sprite was introduced in this branch. Niko uses a neutral UI initial badge until a verified canonical enemy asset is available/imported under the asset rules.

## Save/reload compatibility

Branch-7 saves receive safe Branch-8 defaults.

Campaign save roundtrips preserve:

- RNG state
- visible enemy intents
- decision log
- supply pressure
- blockades
- fortification

Browser evidence reloads in the middle of Niko's enemy turn and confirms the screen remains `Gegnerzug · Runde 1`; no offline advancement occurs.

## Automated core evidence

`npm test` covers:

- 10 campaign-core tests
- 7 AI-director tests
- existing learning, Kai, save, card and helper suites
- production Vite build
- 11 ready asset integrity checks

AI-specific assertions include:

- exactly eight canonical unique archetypes
- deterministic same-seed planning
- max one main action per enemy
- no answer-data leakage
- distinct archetype priorities
- visible intent descriptions
- offline no-op
- fail-closed unknown IDs

## Browser playtest evidence

Successful production-preview playtest on run `33083155694`, artifact `9650969834`.

Viewports:

- iPhone small: 375×667 – PASS
- iPhone standard: 390×844 – PASS
- iPhone landscape: 844×390 – PASS
- Desktop: 1440×900 – PASS

The browser run verifies:

- Niko intent exists before mission start
- supply/defense telemetry is visible
- intent stays visible during challenge
- first two language answers work
- explicit enemy-turn screen appears
- reload during enemy phase does not advance round/state
- Niko action only resolves after user confirmation
- resolved intent is marked as executed
- language tasks remain unchanged
- remaining standard challenge and Crown Sentence complete
- standard victory still works
- full Kai boss loop still works
- Kai's visible cheat remains functional
- no console/page errors
- no horizontal overflow in tested states

Eight screenshots were uploaded as playtest evidence: Garden intent and enemy-turn screen for all four viewports.

## Visual review

Manually reviewed evidence includes 375×667 Garden loadout/intent, 844×390 enemy-turn and 1440×900 Garden intent. Intent, target, supply and defense remain readable; landscape enemy-turn stays compact and requires no horizontal scrolling.

## Scope boundaries / remaining risks

- Real physical iPhone/Safari WebKit has not been tested in this branch.
- No canonical normal-enemy sprite was imported because no verified binary source was established during this scope; no placeholder path was invented.
- Balance across later unlocked regions is not live-tested yet because Regions 2–4 belong to Branch 9.
- Skippi/Fino route/defense integrations remain governed by their later systems and were not expanded here.
- No deployment or merge to `main` is part of Branch 8.
