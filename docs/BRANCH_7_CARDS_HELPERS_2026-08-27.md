# Crown of Words – Branch 7 Cards and Helpers

Date: 2026-08-27
Branch: `branch-7-cards-helpers`
Baseline: `3e756cb2296900ca41a756250345cddfecfa67e7`
Rollback: `rollback/branch-7-cards-helpers-3e756cb`

## Gate result

**PASS**

Branch 7 implements the card/helper layer only. It does not expand regions or enemy AI.

## Four-card hand

A pure card contract now supports 1–4 unique cards with encounter-local states:

- `ready`
- `played`
- `exhausted`

The Garden uses exactly four cards:

1. `card-garden-scout` – Blätterspäher – reveal intent
2. `card-garden-shield` – Rankenschild – reduce pressure
3. `card-garden-supply` – Samenkiste – tactical power
4. `card-garden-rally` – Sonnenruf – tactical power

A card effect is resolved only after the linked language answer has been evaluated. Correct language resolution plays the card. A wrong answer uses the single Explorer refund if available; after that a wrong linked answer exhausts the selected card for the encounter. Card cost is still recorded as spent on a refund, matching the master specification. Tactical power remains capped at four and the card layer has no answer truth or Crown Sentence bypass.

## Helpers

Four canonical Wordbound commander helpers are registered with separate technical IDs:

- `helper-meli-food` – Meli – Früchte / Essen
- `helper-neri-nature` – Neri – Natur
- `helper-skippi-travel` – Skippi – Reise
- `helper-fino-home` – Fino – Zuhause

`helper-neri-nature` remains distinct from any card such as `card-neri-sea-scout`.

Current vertical-slice effects:

- Meli: first Garden miss softens pressure once.
- Neri: reveal-intent contract fires once at encounter start.
- Skippi: alternative-route contract exists for later campaign routing.
- Fino: territory-shield contract exists for later defense flow.

Skippi/Fino are intentionally not forced into unrelated Garden combat UI before their route/defense systems exist.

## Asset provenance

Helper runtime assets are existing WebP files from `o-some/wordbound-battle`, pinned to source commit:

`81d3f0461d16bf67d4fe80f73fe473ace1f20bbe`

The Dropbox helper manifest `/[LinguaTurtle]/[Gehilfen]/SPRITE_MANIFEST.md` identifies the same four canonical helpers and runtime paths.

Runtime files and verified SHA-256:

| Helper | Runtime path | Bytes | SHA-256 |
|---|---|---:|---|
| Meli | `public/assets/helpers/meli.webp` | 8,538 | `2cb5e6ae07914f9bccdc7854ae4309c1a1f4da4ef35e630066c423b9eb9165ed` |
| Neri | `public/assets/helpers/neri.webp` | 11,600 | `7e076e789755677108eff80b222c416a75a4791ddd4206b7cfb2dc798a629ac4` |
| Skippi | `public/assets/helpers/skippi.webp` | 12,372 | `bc685b65e5fe88bfe02c00551961cccc94dfbe82231d17ce97a191ae445e6187` |
| Fino | `public/assets/helpers/fino.webp` | 11,324 | `3c342060fb7e88bbfb0f55febea9c63ed7255bd56a947927db8b4114d1720ef7` |

Asset integrity checks now cover 11 `ready` assets total.

## Interaction / accessibility

The Garden loadout presents a helper selector and four-card hand before the encounter.

During active challenges the four cards remain visible in compact form.

The Crown Sentence supports both:

- normal button/tap input (also keyboard-usable)
- HTML drag & drop into the sentence drop zone

Drag & drop is therefore an enhancement, not the only interaction path.

Helper and card controls use normal buttons and `aria-pressed` selection state. Keyboard activation was exercised in the browser test.

## Save / reload

Branch-7 state lives inside the existing versioned Branch-6 save envelope. Older saves missing card/helper fields get safe defaults on restore.

Verified in runtime:

- helper selection survives reload
- card outcome feedback survives reload
- boss card state survives reload

The pure game core still does not write directly to `localStorage`; browser persistence remains behind the standalone adapter.

## Automated tests

Unit / contract checks:

- Campaign core: PASS
- Learning core: PASS
- Kai core: PASS
- Save/reload contract: PASS
- Card hand contract: PASS
- Helper commander contract: PASS
- Asset integrity: PASS (11 ready assets)
- Production Vite build: PASS

Card-specific assertions include:

- maximum four unique cards
- correct answer plays selected card exactly once
- Explorer refund happens once
- refunded card remains ready
- card cost remains spent on refund
- next wrong selected use exhausts the card
- tactical bonus is capped
- card bonus contains no answer data

Helper-specific assertions include:

- four unique canonical helper IDs
- Neri helper ID does not collide with card IDs
- Meli triggers once on first Garden miss
- Neri reveal-intent trigger is one-use per helper state

## Browser gameplay evidence

Final polished candidate browser flow passed at:

- 375×667 Chromium mobile/touch emulation
- 390×844 Chromium mobile/touch emulation
- 844×390 Chromium landscape
- 1440×900 Chromium desktop

The flow verifies:

- all four helper assets load
- helper selection via keyboard
- helper selection survives reload
- four-card hand exists
- card selection via keyboard
- wrong language answer triggers Explorer refund
- Meli feedback is visible
- refunded card stays playable
- correct language answer activates the card
- played card becomes unavailable
- mixed Drag & Drop + tap builds the Crown Sentence
- standard encounter remains winnable only with sufficient language learning
- boss gets a fresh four-card hand
- Kai cheat remains visible with the card layer active
- boss card state survives reload
- complete Kai victory
- no horizontal document/body overflow
- no captured console or page errors

Screenshot evidence was generated for loadout and victory at all four tested viewports. Visual review found an initial readability issue in the narrow desktop/landscape loadout; the helper/card grids were polished and the entire runtime flow was rerun successfully. Final reviewed loadout evidence has no helper-name overlap and card titles remain readable.

## Honest test labels

- BROWSER MOBILE VIEWPORT TESTED: PASS
- DESKTOP BROWSER TESTED: PASS
- AUTOMATED RUNTIME TESTED: PASS
- MANUAL/AGENT VISUAL REVIEWED: PASS
- REAL DEVICE TESTED: NOT TESTED
- NATIVE SIMULATOR TESTED: NOT TESTED
- Safari/WebKit real-device behavior: NOT TESTED
- screen-reader audit: NOT TESTED

## Scope notes

Branch 7 deliberately does not add:

- region 2+
- new boss content
- full opponent AI archetypes
- wallet/economy integration
- routing UI for Skippi
- territory-defense UI for Fino

Those systems belong to later branches. The contracts are prepared without inventing parallel campaign systems.

## Deployment

NOT DEPLOYED. No direct write or merge to `main` was performed.
