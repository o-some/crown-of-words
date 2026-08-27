# Crown of Words — Branch 6 PlayBrain / Visual Gate

Date: 2026-08-27
Branch: `branch-6-playbrain-visual-gate`
Base / rollback SHA: `5e430f3c9bb12dfb7e0773a513b11d973ba067da`
Main observed at branch start: `f4cb67caed138f24dd8fc7dc810ace157b95778d`

## Scope

Branch 6 is a quality gate, not a content-expansion branch. The Garden/Kai vertical slice was tested for actual runtime behavior, visual quality, mobile/desktop layout, wrong/correct feedback, boss fairness, pause/help and reload safety.

## Gate blocker discovered

The Branch 5 slice was playable but did not yet expose true standalone save/reload or pause/help behavior. Under the master specification this is a critical gate blocker, so Branch 6 made the smallest architecture-aligned fix:

- versioned save envelope in `src/game/save-contract.js`;
- standalone browser storage isolated in `src/adapters/standalone-storage.js`;
- no direct `localStorage` access from the pure game core;
- pause and help overlays preserve the exact active challenge;
- state is persisted on render and restored at boot;
- reset clears the standalone save.

No new region, boss, card system or content breadth was added.

## Automated core/build evidence

PlayBrain evidence run: `33078161730`

Before the runtime flow, `npm test` passed:

- syntax checks;
- asset integrity: 7 ready assets;
- campaign core: 7/7;
- learning core: PASS;
- Kai core: 4/4;
- save/reload contract: 4/4;
- Vite production build: PASS.

Production build in the gate run:

- HTML: 0.54 kB;
- CSS: 14.06 kB;
- JS: 21.24 kB.

These sizes are evidence only; no FPS, RAM or battery claim is made.

## PlayBrain runtime matrix

All complete flows passed:

| Viewport | Result |
| --- | --- |
| 375×667 browser-mobile | PASS |
| 390×844 browser-mobile | PASS |
| 430×932 browser-mobile | PASS |
| 844×390 landscape browser-mobile | PASS |
| 1440×900 desktop | PASS |

The runtime gate explicitly checked:

- campaign → Garden → challenge → result → Kai → victory;
- wrong answer displays teaching feedback and correct solution;
- wrong feedback survives reload without re-resolution;
- hint reduces word power to +2;
- pause → reload → resume preserves exact challenge;
- help → reload → close preserves exact challenge;
- real Pirat Kai asset loads;
- Kai cheat is visibly telegraphed;
- boss feedback and cheat state survive reload;
- Ankerblick remains usable;
- boss victory survives reload;
- no horizontal document/body overflow on tested paths;
- no blocking console or page errors.

## Screenshot evidence

Artifact: `branch6-playbrain-evidence`
Artifact ID: `9648816300`
Artifact ZIP SHA-256: `b2f8939aa5f9c97808511bae76a5e790cd656e09800056d4f34c5d415791d6bc`

15 screenshots were captured: wrong feedback, Kai cheat and victory for each of the five tested viewports.

Visual agent review included at minimum:

- 375×667 wrong feedback;
- 375×667 Kai cheat;
- 375×667 victory;
- 844×390 Kai cheat;
- 1440×900 victory.

Observed visual result:

- no clipping or component overlap;
- topbar controls fit on small portrait;
- primary action is visible on the 375×667 victory screen;
- Kai and Tula are visually separated;
- reward strip is readable;
- landscape layout remains coherent;
- desktop composition remains centered and intentionally bounded rather than stretched.

## CAF Quality Score

| Category | Weight | Minimum | Score | Status |
| --- | ---: | ---: | ---: | --- |
| Technical Stability | 20% | 95 | 98 | PASS |
| Mobile UX | 20% | 90 | 94 | PASS |
| Gameplay | 20% | 85 | 91 | PASS |
| Brand / Visual Quality | 15% | 90 | 92 | PASS |
| Learning Value | 15% | 85 | 90 | PASS |
| Performance | 5% | 85 | 90 | PASS |
| Accessibility / Input | 5% | 80 | 86 | PASS |

Weighted total: **92.7 / 100 — PASS**
Required total: **>= 90 / 100**

The performance score reflects production build/runtime stability evidence only. It is not an FPS, RAM or battery measurement.

## Honest test labels

- BROWSER MOBILE VIEWPORT TESTED
- DESKTOP BROWSER TESTED
- AUTOMATED RUNTIME TESTED
- MANUAL/AGENT VISUAL REVIEWED
- REAL DEVICE TESTED: NO
- NATIVE SIMULATOR TESTED: NO
- WEBKIT ENGINE TESTED: NO

## Remaining notes / non-blockers for this gate

- physical iPhone / Safari is still NOT TESTED;
- 200% zoom is still NOT TESTED;
- extended Spanish and Greek UI strings are still NOT TESTED;
- full screen-reader audit is still NOT TESTED;
- physical keyboard-only audit is still NOT TESTED;
- no FPS/RAM/battery benchmark has been claimed.

These are explicitly retained for later hardening; they do not invalidate the tested Branch 6 browser gate.

## Gate result

`PASS`

Content breadth may proceed to Branch 7 only after this branch is finalized and the user explicitly says `weiter`.
