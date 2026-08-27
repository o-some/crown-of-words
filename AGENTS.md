# Crown of Words — Repository Rules

Read `TULAS_ISLAND_CROWN_OF_WORDS_MASTER_SPEC_2026-08-27.md` before medium or large changes.

## Hard rules

- Work branchwise according to master-spec section 44.
- Verify current `main` before every branch.
- Do not write directly to `main` during plan branches.
- Never force-push.
- Keep diffs focused and reversible.
- Do not modify other Tula's Island repositories.
- Do not overwrite or delete Dropbox originals.
- Reuse verified Tula's Island assets before creating replacements.
- Keep game core independent from DOM, `localStorage`, Supabase and host economy.
- Strategy may improve tactical position but may not bypass language learning.
- A correct Crown Sentence is required for complete territory capture.
- Build success alone is not gameplay evidence.
- Label browser viewport, simulator and real-device tests honestly.
- Stop after each planned branch and wait for `weiter`.

## Current architecture direction

Standalone Vite + browser-native ES modules first. Later host integration occurs through adapters into `o-some/tulasisland/src/v3/games/crown-of-words/` on a dedicated integration branch.
