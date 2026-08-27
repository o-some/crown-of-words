# Branch 3 – Pure Campaign Core

Date: 2026-08-27
Branch: `branch-3-pure-campaign-core`
Baseline: `93bbcd3f9d11f89e684c999061c73575137c89cc`

## Scope

Pure deterministic campaign logic only. No UI, learning engine, boss implementation, audio or deployment changes.

## Implemented

- explicit 10-region campaign definition
- exactly 5 canonical districts per region / 50 districts total
- symmetric local district adjacency graph
- explicit regional sea-route graph following the planned campaign progression
- canonical district states
- Garden dock as the only initially actionable district; remaining campaign locked
- ordered local unlock progression with boss gate preserved
- attack eligibility based on ownership + explicit adjacency
- supply calculation and refresh
- seeded xorshift32 RNG state
- deterministic enemy intent generation
- explicit player -> enemy -> player round transition
- visible-intent-compatible enemy action resolution (`scout`, `fortify`, `raid`, `contest`, `blockade`, `feint`)
- contested territory keeps player ownership until a later defense encounter
- JSON serialization/restoration with campaign-definition validation

## Tests

`src/game/campaign-core.test.mjs` covers:

1. 10 regions / 50 districts / graph validity
2. symmetric adjacency and regional routes
3. ordered local progression
4. attack legality
5. supply determinism
6. contested state behavior
7. seeded RNG reproducibility
8. seeded enemy intent reproducibility
9. explicit enemy turn lifecycle
10. save/restore deterministic roundtrip

CI now runs `npm run test:core` in addition to syntax, asset integrity and production build.

## Intentional non-scope

- no challenge scoring or Crown Sentence logic (Branch 4)
- no boss mechanics or Kai sprite usage (Branch 5+)
- no campaign UI/map interaction (later UI branch)
- no helpers/cards
- no persistence adapter/localStorage/Supabase integration
- no economy writes

## Safety / architecture

The campaign core has no DOM, storage, network, Supabase or host-economy dependency. Randomness is carried in campaign state and is reproducible from a seed. The core can therefore be unit-tested and later hosted by the main Tula's Island app without hidden side effects.

## Rollback

Rollback point before Branch 3: `93bbcd3f9d11f89e684c999061c73575137c89cc`.
