# Branch 13 – Release Hardening

Stand: 27.08.2026
Status: RELEASE CANDIDATE
Branch: `branch-13-release-hardening`
Baseline: `f886b6ef933c90bce1ce254118eb7c13355ea091`
Rollback: `rollback/branch-13-release-hardening-f886b6e`

## Scope

Branch 13 ist der abschließende Release-/Deployment-Branch. Gameplay, Lernlogik, Bossmechaniken und Hostarchitektur werden nicht neu gestaltet.

Release-Hardening umfasst:

- reproduzierbare Dependency-Installation im Deployment (`npm ci`)
- vollständiges `npm test` als Pflicht-Gate vor dem Pages-Build
- eigenständige Release-Bundle-Prüfung
- GitHub-Pages-spezifischen Base-Path-Gate
- Schutz vor fehlenden referenzierten Build-Dateien
- Schutz vor lokalen Development-URLs im Release-HTML
- Schutz vor versehentlich ausgelieferten Source Maps
- Erhalt des Branch-12-Hostvertrags und des Standalone-Modus

## Release Bundle Gate

Neu dauerhaft vorhanden:

`scripts/check-release.mjs`

Der Gate prüft das erzeugte `dist` und bricht den Release ab, wenn:

- `dist/index.html` fehlt oder leer ist,
- referenzierte lokale Dateien nicht existieren,
- ein absoluter Assetpfad den konfigurierten Base-Path verlässt,
- `localhost` oder `127.0.0.1` im Production-HTML auftaucht,
- kein gebündeltes JavaScript vorhanden ist,
- Source Maps im Release-Bundle liegen.

`npm run check:release` ist Bestandteil des permanenten `npm test`.

## GitHub Pages Hardening

`.github/workflows/pages.yml` wurde gezielt gehärtet:

- `npm install` -> `npm ci --no-audit --no-fund`
- npm cache über `actions/setup-node`
- vollständiges `npm test` vor dem deploy-spezifischen Build
- anschließender Build mit `CROWN_BASE_PATH=/crown-of-words/`
- anschließendes `npm run check:release` mit demselben Base-Path
- Upload/Deploy erst nach allen Gates

Damit kann GitHub Pages keinen Build veröffentlichen, der zwar kompiliert, aber falsche Release-Pfade oder fehlende referenzierte Dateien enthält.

## Regression Evidence

Branch 12 hat unmittelbar vor Branch 13 den vollständigen Standalone-Finalelauf über fünf Viewports erfolgreich abgeschlossen:

- 375 x 667
- 390 x 844
- 430 x 932
- 844 x 390 Landscape
- 1440 x 900 Desktop

Dieser Lauf deckt Hafen, Azrak, Kronenschloss, vier Varkos-Phasen, 10/10-Victory und Victory-Reload ab.

Branch 13 verändert keine Gameplaydatei. Die Releaseänderungen betreffen ausschließlich Build-/CI-/Deployment-Verifikation und Dokumentation.

## Release Procedure

Nach grünem Branch-CI:

1. Pull Request `branch-13-release-hardening` -> `main`.
2. Merge nur bei unverändertem finalen Head-SHA.
3. Normalen `main`-CI abwarten.
4. GitHub-Pages-Workflow abwarten.
5. Live-URL auf Erreichbarkeit und Assetauslieferung prüfen.
6. Erst danach Release als vollständig freigegeben markieren.

## Ergebnis vor Merge

Branch 13 ist als Release Candidate vorbereitet. Der endgültige Status `RELEASED` darf erst nach erfolgreichem Main-CI, Pages-Deployment und Live-Prüfung vergeben werden.
