# Branch 5 – Garden / Kai Vertical Slice

Stand: 2026-08-27

## Gate

- Status: PASS
- Ausgangs-SHA: `dac39c40248dcc02ba9392d3711f39982da1662b`
- Branch: `branch-5-garden-kai-vertical-slice`
- Rollback: Branch-4-Ausgangs-SHA oben
- `main` blieb während Branch 5 unverändert.

## Scope

Dieser Branch baut den ersten tatsächlich spielbaren Crown-of-Words-Vertical-Slice:

1. Kampagnenkarte
2. Gartenregion
3. Standard-Sprachbegegnung
4. Crown Sentence
5. taktische Auflösung
6. Bossintro Pirat Kai
7. Bossbegegnung mit sichtbarer Schummelei
8. Ankerblick-Lernkonter
9. Sieg / Retry

Keine Regionen 2–10 und keine Bosse 2–10 wurden implementiert.

## Originalassets

Verwendet werden ausschließlich die bereits verifizierten Tula's-Island-Assets aus der lokalen Asset Registry:

- Tula's-Island-Kampagnenkarte
- `world-garden.webp`
- `tula-happy.webp`
- Reward-Muscheln / XP-Stern
- freigestelltes Original von Pirat Kai

### Pirat Kai

Dropbox-Original:

`/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/Level 1 - Pirat Kai.png`

- Dropbox File ID: `id:tBVq8LNbZ_8AAAAAAAM3bQ`
- Größe: 655568 Bytes
- Dropbox Content Hash: `f95cce54828690c9e29bdf3f8af60877f35254761c281251c0f9bbba44f85d45`
- normaler SHA-256 der Runtime-Datei: `fce8d03941551ae8f9f8387d183cdfad2e963300d0497f2f96d369e0d2c46fbe`
- Runtime: `public/assets/bosses/pirat-kai.png`

Wichtig: Dropbox `content_hash` und normaler SHA-256 sind unterschiedliche Hashverfahren. Beide werden getrennt dokumentiert.

Der kurzlebige Importworkflow wurde nach erfolgreichem, bytegenauem Transfer wieder aus dem aktuellen Branch entfernt. Im Runtime-Code existiert kein Dropbox-Hotlink.

## Lernslice

Standardbegegnung Garten:

- Apfel → apple
- grün → green
- Wasser → water
- wächst → grows
- Crown Sentence: `Die Blume wächst.` → `The flower grows.`

Bossbegegnung:

- Blume → flower
- Sonne → sun
- Baum → tree
- blüht → blooms
- finale Crown Sentence: `Der Garten blüht.` → `The garden blooms.`

Die vorhandenen Learning-Core-Regeln bleiben verbindlich:

- richtige Erstlösung: 3 Wortkraft
- leichter Hinweis: 2
- stärkere Hilfe / Selbstkorrektur: 1
- falsch / Lösung gezeigt / übersprungen: 0
- Standarderoberung braucht mindestens drei fachlich gelöste Aufgaben und korrekte Crown Sentence
- Taktikkraft kann Lernen nicht umgehen

## Kai – Verwirbelter Befehl

Der Boss besitzt einen separaten, deterministischen Pure Core.

Nach einer ausgewerteten Aufgabe:

- die aktuelle Aufgabe bleibt unverändert,
- bereits gelöste Aufgaben bleiben gelöst,
- höchstens zwei ungelöste Auftragskarten werden getauscht,
- auf Mobile werden maximal vier kommende Karten gezeigt,
- die Schummelei wird sichtbar als `Kai schummelt!` telegraphiert,
- die sprachlich richtige Antwort wird niemals verändert,
- die Crown Sentence bleibt als finale, fixe Karte außerhalb des normalen Tauschs.

### Ankerblick

Eine korrekte Gartenübersetzung kann `Ankerblick` freischalten. Eine kommende, nicht finale Auftragskarte kann für den nächsten Kai-Tausch fixiert werden. Der Boss-Core testet diese Schutzregel separat.

## Mobile / UI

Die Presentation ist mobile-first mit:

- Safe-Area-Padding
- großen Touchzielen
- echtem Karten-/Weltasset
- echter Tula
- echtem Kai
- kompaktem aktiven Challenge-Screen
- Satzbau per Tipp-Reihenfolge
- Reduced-Motion-Media-Query
- Desktop-Komposition statt bloßem Mobile-Upscaling
- keinem horizontalen Body-Overflow in den automatisiert getesteten Viewports

## Automatisierte Core-Prüfungen

CI prüft:

- Dependency-Installation
- Syntax
- Assetintegrität inklusive Kai
- Pure Campaign Core
- Pure Learning Core
- Pure Kai Boss Core
- Production Build

Alle Prüfungen waren vor Branchabschluss grün.

## Tatsächlicher Browser-Playtest

Ein reproduzierbarer Playwright-Klickpfad liegt unter:

`tests/e2e/branch5-playtest.cjs`

Geprüfter kompletter Pfad:

`Kampagnenkarte → Garten → 4 Sprachaufgaben → Crown Sentence → Standard-Sieg → Kai-Intro → Kai-Boss → Ankerblick → sichtbare Schummelei → Crown Sentence → Bosssieg`

Ergebnis des Workflow-Runs `33076536055`:

- 375 × 667: PASS
- 390 × 844: PASS
- 430 × 932: PASS
- 1440 × 900: PASS
- Kai-Runtimebild geladen: PASS
- Ankerblick benutzt: PASS
- Boss-Schummelei sichtbar: PASS
- finale Crown Sentence: PASS
- vollständiger Boss-Sieg: PASS
- horizontaler Dokument-Overflow: keiner erkannt
- Console / Page Errors: keine erkannt

Der Lauf erzeugte vier Victory-Screenshots als Testartifact. Die Screenshots 375×667 und 1440×900 wurden zusätzlich visuell geprüft: keine abgeschnittenen Primäraktionen, keine Überlagerung zwischen Kai/Tula/Rewards und saubere Desktop-Zentrierung.

## Nicht als getestet markieren

Noch nicht vollständig abgenommen sind:

- echtes physisches iPhone / Safari-WebKit
- iPhone Landscape
- 200%-Zoom/Reflow
- längere spanische und griechische Challenge-Texte
- Pause-/Help-State in der sichtbaren Branch-5-UI
- Save-Recovery im sichtbaren Slice
- echte Host-Economy-/XP-Integration
- Live-GitHub-Pages-Slice, da der Feature-Branch nicht nach `main` gemerged wird

Diese Punkte bleiben Folgebranches beziehungsweise Release-Gates.

## Deployment

- Production Build: PASS
- Feature-Branch-Live-Deploy: NOT DEPLOYED
- GitHub Pages bleibt auf dem bestehenden Main-/Releaseverfahren.
- Keine direkte Änderung an `main`.

## Offene Risiken / Notes

1. Der Garden-Slice enthält bewusst kleines, lokal versioniertes Lernfixture für den Vertical Slice. Die breite Content-Provider-Anbindung folgt später.
2. Die temporären Transfer-/Playtest-Workflowdateien wurden aus dem Branch-HEAD entfernt; die reproduzierbare E2E-Testdatei bleibt erhalten.
3. Frühere, inzwischen abgelaufene Transfer-URLs können in alten Feature-Branch-Commits historisch existieren. Sie sind weder im aktuellen Tree noch Runtime-Code enthalten. Die Master-Spec verbietet Force-Push; deshalb wurde die Historie nicht umgeschrieben.
4. Reale Geräte- und WebKit-Abnahme bleibt bewusst offen.

## Ergebnis

Branch 5 erfüllt den geforderten Vertical-Slice-Gate: erstmals existiert ein tatsächlich spielbarer, automatisiert durchgespielter und visuell geprüfter Tula's-Island-Lern-/Strategiepfad inklusive Originalboss und fairer, sichtbarer Bossmechanik.
