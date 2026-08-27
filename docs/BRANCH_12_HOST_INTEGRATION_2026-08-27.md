# Branch 12 – Host Integration

Stand: 27.08.2026
Status: PASS WITH NOTES
Branch: `branch-12-host-integration`
Baseline: `c7078521398f45434f6d05519029405862d8b0e1`
Rollback: `rollback/branch-12-host-integration-c707852`

## Scope

Branch 12 bereitet Crown of Words für die spätere Einbettung in die Tula's-Island-Hauptapp vor, ohne die Hauptapp selbst zu verändern.

Implementiert:

- injizierter Host-/Standalone-Runtime-Adapter
- Host-Save über vorhandene Store-Grenze
- XP/Sterne/Mastery über vorhandene Store-Grenze
- Muschelreward über vorhandene Economy-Grenze
- Gastmodus-Fallback über Host-State
- stabile/idempotente Reward-Event-IDs
- retry-sicherer Economy-Fehlerfall
- Host-Navigation über vorhandene Route-State-Grenze
- dauerhafte Unit-/CI-Gates
- Standalone-Regressionsprüfung des vollständigen Finales

Nicht Teil dieses Branches:

- Änderung oder Migration von `o-some/tulasisland`
- Supabase-Direktzugriff aus Crown
- direkte Wallet-/Ledger-Schreibzugriffe
- Echtgeldlogik
- Release-Hardening / Deployment (Branch 13)

## Verifizierte Host-Baseline

Der Integrationsvertrag wurde gegen folgenden unveränderten Hoststand geprüft:

`o-some/tulasisland@cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0`

Dort existieren bereits die benötigten Grenzen:

- `src/v3/core/store.js` – `getState`, `setState`
- `src/v3/core/economy.js` – `creditGameplayShells`

Crown importiert diese Dateien nicht direkt. Der spätere Host mountet lediglich diese Fähigkeiten als injizierten Vertrag.

## Storage

Standalone bleibt vollständig kompatibel über:

`crown-of-words:save:v1`

Im Hostmodus wird der Save ausschließlich über `setState` unter `session.activeGame` abgelegt. Der Pure Core kennt weder Host-Storage noch `localStorage`.

## Economy / Progression

Der 10/10-Kampagnensieg speichert zuerst den Spielstand. Danach wird genau ein stabiles Reward-Event übergeben:

`crown-of-words:campaign-clear:crown-of-words:v1`

Aktueller Kampagnenabschluss-Reward:

- 250 XP
- 100 Gameplay-Muscheln
- 3 Sterne
- Mastery 1.0 für `crown-castle`

Angemeldete Nutzer erhalten Muscheln ausschließlich über `creditGameplayShells(..., stableEventId)`. Der Host-Ledger bleibt autoritativ.

Gastmodus: Liefert die bestehende Economy-Grenze `null`, werden lokale Gastmuscheln über `setState` genau einmal gebucht.

Fehlerfall: Wirft die Economy-Grenze, meldet Crown den Event als `retryable`; XP/Sterne/Mastery/committedEventId werden dann nicht teilweise geschrieben. Der bereits gespeicherte Kampagnensieg bleibt erhalten und dieselbe stabile ID kann später erneut versucht werden.

## Host-Adapter-Tests

Dauerhaft getestet werden:

- Save-Roundtrip ausschließlich über Host-State
- stable Event-ID und Duplicate-No-op
- keine doppelte Wallet-/Progressbuchung
- Gastfallback genau einmal
- Economy-Fehler: retryable, kein Partial Commit
- Replay darf Sterne/Mastery verbessern, ohne First-Loot zu duplizieren
- Exit nur über Host-Routing-Grenze

`test:host` ist Bestandteil von `npm test` und des permanenten Crown-CI.

## Standalone Regression

Nach Einführung des Runtime-Adapters wurde das vollständige Crown-Finale erneut im Standalone-Modus gespielt.

Der Branch-11-Finalelauf prüft fünf Viewports:

- 375 × 667
- 390 × 844
- 430 × 932
- 844 × 390 Landscape
- 1440 × 900 Desktop

Der Lauf inklusive Hafen, Azrak, Kronenschloss, vier Varkos-Phasen, 10/10-Victory und direktem Victory-Reload ist PASS.

## Hauptapp Regression / Baseline Note

Die unveränderte Tula's-Island-Hauptapp wurde zusätzlich gegen ihren gepinnten Referenz-SHA betrachtet.

Die eigene bereits vorhandene Host-CI dieses exakten SHAs ist **nicht vollständig grün**: 72 E2E-Tests, 70 PASS, 2 FAIL. Beide Fehler betreffen denselben bereits vorhandenen EN→EL-Navigation-/Lokalisierungstest auf Mobile Chrome und Mobile Safari. Syntax- und Architekturchecks des Hosts sind grün.

Diese beiden Fehler sind keine Crown-Regressionsfehler:

- Branch 12 hat `o-some/tulasisland` nicht verändert.
- Der Host-SHA ist unverändert und die beiden Fehler existieren in dessen eigener Baseline-CI.
- Deshalb lautet Branch-12-Status `PASS WITH NOTES` statt eines künstlichen vollständigen Host-PASS.

Ein erster temporärer Host-Regressionsworkflow installierte nur Chromium und erzeugte dadurch zusätzliche WebKit-Setup-Fehler. Diese künstlichen Runnerfehler werden ausdrücklich nicht als Produktregression gewertet.

## Security / Architecture

Branch 12 führt keine parallele Architektur ein.

Crown darf weiterhin nicht:

- Supabase direkt importieren
- Wallet-/Ledger-Tabellen direkt schreiben
- Host-Schemas migrieren
- Echtgeldwerte selbst verwalten
- andere Spiele ändern

## Cleanup

Vor finaler Freigabe werden ausschließlich folgende temporäre Branch-12-Helfer entfernt:

- `.github/workflows/branch12-integrate.yml`
- `.github/workflows/branch12-host-regression.yml`
- `.github/workflows/branch12-runtime-regression.yml`
- `scripts/branch12-integrate.mjs`

Dauerhaft bleiben:

- Host-/Runtime-Adapter
- Host-Adapter-Tests
- `HOST_INTEGRATION_CONTRACT.md`
- dieser Evidence-Bericht
- permanenter CI-Gate

## Ergebnis

Branch 12 erfüllt die Crown-seitige Host-Integrationsschicht und erhält gleichzeitig den Standalone-Modus. Der spätere tatsächliche Mount-Commit in der Tula's-Island-Hauptapp ist ein separater, explizit geprüfter Integrationsschritt und wurde in diesem Branch bewusst nicht durchgeführt.

Deployment: NOT DEPLOYED
Merge nach `main`: nein
Nächster Branch: Branch 13 – Release-Hardening
