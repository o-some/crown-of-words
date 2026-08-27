# Branch 11 – Hafen, Schloss und Kampagnenfinale

Stand: 27.08.2026
Branch: `branch-11-harbor-castle-finale`
Baseline: `e6ac1fd26fd95c0b8534d6466a2fc5cc82601527`
Rollback: `rollback/branch-11-harbor-castle-e6ac1fd`
Status: **FINAL / PASS**

## Scope

Branch 11 erweitert Crown of Words ausschließlich um die letzten beiden Regionen und den Kampagnenabschluss:

- Region 9 – Hafen-Turnier – Schattenfürst Azrak
- Region 10 – Kronenschloss – Piratenkönig Varkos
- mehrphasiges Varkos-Finale
- persistenter Kampagnensieg mit 10/10 Kronensiegeln

Host-Integration, Economy-Commit und Release-Hardening bleiben ausdrücklich Branch 12 bzw. Branch 13 vorbehalten.

## Lernpfade

Beide Regionen besitzen jeweils fünf regionale Lernaufgaben inklusive verpflichtender Crown Sentence. Der Bosssieg bleibt sprachlich gegatet; taktische Bossmechaniken verändern niemals die korrekte Sprachwahrheit.

Das Kronenschloss erhöht die sprachliche Komplexität mit mehrteiligen Sätzen und Konnektoren wie `because`, `although`, `first/then` und `if`.

## Schattenfürst Azrak – Wandernder Schatten

- exakt ein persistenter Schattenmarker
- deterministische Bewegung nach Auslösung
- Schatten befindet sich in einem eigenen Taktikfeld und niemals über Sprachtext oder Primäraktion
- richtige gemischte Hafenaufgabe kann den Schatten sichtbar enthüllen
- Save-fähiger Zustand

## Piratenkönig Varkos – Krone des Chaos

Vier klar getrennte Phasen:

1. **Tausch** – sichtbarer Auftragstausch; aktuelle Antwort bleibt unverändert.
2. **Kette und Marker** – exakt zwei sichtbare Gefahren, bevor sie wirken.
3. **Formation** – echte Verschiebung einer angekündigten 3×3-Reihe; Adjazenz wird danach neu berechnet.
4. **Crown Sentence** – finale mehrteilige Sprachaufgabe ohne künstliche Zeitknappheit.

Zusätzliche Fairnessregeln:

- maximal zwei aktive Gefahren
- Phasenwechsel nur nach korrekter Lösung der jeweiligen Phasenaufgabe
- eine falsche Varkos-Antwort überspringt keine Phase
- keine Bossmechanik darf die richtige Antwort verändern oder die Crown Sentence umgehen
- Kampagnensieg erst bei korrekter finaler Crown Sentence

## Assets

Vier neue Runtimeassets wurden revisionsgepinnt aus bereits produktiv verwendeten Tula-Repositories übernommen.

### Welten – `o-some/tulasisland@cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0`

- `public/assets/worlds/world-harbor.webp` – 372646 Bytes – SHA-256 `db28d4b180aac22d36e49a35549faa3159917b42cafd26fe39c0253d768275d3`
- `public/assets/worlds/world-castle.webp` – 324804 Bytes – SHA-256 `a119855af6b384aaa38829729cf5306c566bfaaecebb2c86511d7eb4ee993887`

### Bosse – `o-some/word-scramble@ac594046c99ac63954164fe6da0a89ff92c29cf4`

- `public/assets/bosses/boss-09-azrak.webp` – 284304 Bytes – SHA-256 `ce1cb05e061c5ee9bbfaaad177be69eb2fe8b56a64b8f43db58f777c2bb37299`
- `public/assets/bosses/boss-10-varkos.webp` – 347868 Bytes – SHA-256 `2088bb64dcb552b8e709ca73985f4f3949719a572c41ecc089efec97472f3036`

Die Asset-Registry umfasst damit 29 verifizierte Runtimeassets. Es gibt keine Runtime-Dropbox-Hotlinks.

## Save / Reload

Der finale Kampagnensieg wird unmittelbar vor dem Victory-Render in den bestehenden Standalone-Save-Vertrag geschrieben. Der Browser-Gate reloadet direkt auf dem Victory-Screen – ohne weiteren Klick – und erwartet weiterhin den Victory-Screen sowie `10 / 10`.

## Automated Gates

Der vollständige `npm test`-Verbund wurde vor dem Browser-Gate erfolgreich ausgeführt, einschließlich:

- Syntax
- 29 Asset-Hashes
- Campaign Core
- Enemy AI
- Learning Core
- Kai
- Regionen 2–4
- Regionen 5–8
- Finale Core
- Save / Reload
- Cards
- Helpers
- Production Build

Finale-Coretests decken zusätzlich ab:

- Azraks exakt einen Schatten
- Azrak Reveal
- Varkos vier Phasen
- maximal zwei Varkos-Gefahren
- veränderte Grid-Adjazenz
- Crown-Sentence-Pflicht
- falsche Phasenantwort bleibt in derselben Varkos-Phase

## Browser PlayBrain Gate

Der komplette Pfad wurde auf folgenden Viewports gespielt:

- 375 × 667
- 390 × 844
- 430 × 932
- 844 × 390 Landscape
- 1440 × 900 Desktop

Pro Viewport:

`Hafen → fünf Sprachaufgaben → Azrak → Schatten-Reveal → Azrak-Sieg → Schloss → fünf Sprachaufgaben → Varkos Phase 1 → absichtlich falsche Antwort ohne Phasensprung → Phase 1 korrekt → Phase 2 mit exakt zwei Gefahren → Phase 3 mit 3×3-Formation → Phase 4 → finale Crown Sentence → 10/10-Kampagnensieg → direkter Reload → Victory bleibt erhalten.`

Danach lief zusätzlich der vollständige Branch-10-Pfad als Regression.

## Visual Evidence

Visuell geprüft:

- 375 × 667 – Azrak-Intro: Boss, Schattenfeld, Text und Primärbutton vollständig sichtbar.
- 844 × 390 – Varkos Phase 2: vier Phasen, exakt zwei Gefahren und Feedback ohne horizontales Overflow.
- 1440 × 900 – Kampagnensieg: Tula, Krone, 10/10, Rewards und Hauptaktion sauber zentriert.

Keine kritischen Überlagerungen, keine abgeschnittenen Hauptaktionen und kein horizontaler Body-Overflow festgestellt.

## Tooling Notes

Zwischenläufe mit temporären Import-/Patch-Workflows durften teilweise keine Workflowdatei aus GitHub Actions selbst aktualisieren. Bereits vollständig geprüfte Fast-Forward-Commits wurden deshalb über die normale GitHub-Anbindung übernommen. Es wurde kein Force-Push verwendet.

## Final Cleanup

Vor dem Abschluss wurden alle sieben temporären Branch-11-Helfer entfernt:

- `.github/workflows/branch11-assets.yml`
- `.github/workflows/branch11-integrate.yml`
- `.github/workflows/branch11-playtest.yml`
- `.github/workflows/branch11-victory-save.yml`
- `scripts/branch11-integrate.mjs`
- `scripts/branch11-prep-patch.mjs`
- `scripts/branch11-victory-save.mjs`

Im Workflow-Verzeichnis bleiben ausschließlich die permanenten `ci.yml` und `pages.yml`. Im `scripts/`-Verzeichnis bleibt ausschließlich `check-assets.mjs`.

Der erste vollständig bereinigte Branch-Head war `9e0c33a312304130fb8cb5ec3a8d1b218261bca7`. Der permanente **Crown of Words CI** lief auf genau diesem SHA erfolgreich durch (`run 33096714129`, conclusion `success`).

`main` blieb während Branch 11 unangetastet und steht weiterhin auf `f4cb67caed138f24dd8fc7dc810ace157b95778d`; dieser Main-Commit datiert zeitlich vor dem Beginn von Branch 11. Es gab keinen Merge und keinen Force-Push auf `main`.

## Ergebnis

**Branch 11 = FINAL / PASS.**

Der vorgesehene Scope für Hafen, Schloss und Kampagnenfinale ist vollständig umgesetzt, automatisiert und visuell verifiziert, bereinigt und durch den permanenten CI bestätigt. Ein Merge nach `main` oder ein Deployment ist nicht Bestandteil dieses Branches.
