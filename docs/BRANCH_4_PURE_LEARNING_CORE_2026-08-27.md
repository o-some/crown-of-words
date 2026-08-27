# Branch 4 – Pure Learning / Challenge Core

Status: PASS WITH NOTES
Date: 2026-08-27

## Scope

Pure, UI-free learning engine only.

## Implemented

- Challenge data model with concept IDs and challenge types.
- Exactly one Crown Sentence per encounter.
- One-time evaluation guard per challenge.
- Word Power scoring: 3 first-try correct, 2 after light hint, 1 after stronger help/correction, 0 for shown solution/skip/wrong answer.
- Minimum-learning gate: at least three academically solved challenges.
- Standard encounter victory gate: total >= 11 and Crown Sentence solved.
- Boss encounter gate: total >= 14, Crown Sentence solved, boss HP == 0.
- Tactical contribution clamped to max 4; enemy pressure clamped to max 6.
- No DOM, storage, network, Supabase or host dependency.

## Tests

Automated coverage includes scoring levels, perfect encounter, Crown Sentence hard gate, minimum-learning hard gate, duplicate evaluation prevention and boss victory requirements.

## Notes

The engine currently compares canonical answer values exactly. Locale-aware normalization, accepted variants, content bundles, TTS and explanatory feedback belong to later content/integration work and are intentionally not invented here.

Rollback point: 57a6ab9cd80206066e460e59fdf4e509c86e8491
