# Branch 10 – Regionen 5–8 – Abschlussbericht

Stand: 27.08.2026
Branch: `branch-10-regions-5-8`

## Scope

Branch 10 erweitert Crown of Words ausschließlich um die Regionen 5–8:

- Region 5 – Familie – Piratenbaron Vargas
- Region 6 – Körper – Kapitän Ironhook
- Region 7 – Unterwegs – Admiral Thorne
- Region 8 – Bewegung – Kartenmeister Corvin

## Gameplay

Alle vier Regionen besitzen jeweils fünf regionale Lernaufgaben inklusive Crown Sentence und drei Bossaufgaben. Der Lernweg bleibt die Hauptbedingung für Fortschritt und Boss-Sieg.

Bossmechaniken:

- Vargas: temporärer Diebstahl von Befehlsperlen mit Rückgewinnung; kein permanenter Progressverlust.
- Ironhook: exakt eine taktische Kettenblockade; der Antwortweg wird niemals blockiert.
- Thorne: maximal zwei sichtbare, telegraphierte Ziele; korrekte Richtungsleistung kann ein Ziel schützen.
- Corvin: echte 3×3-Rasterverschiebung von Reihe oder Spalte; Adjazenz wird nach der Verschiebung neu berechnet.

## Assets

Vier Weltkulissen wurden revisionsgepinnt aus `o-some/tulasisland` übernommen:

- `world_coral_reef.webp`
- `world_crystal_cove.webp`
- `world_desert_oasis.webp`
- `world_ice_peak.webp`

Die produktiv vorbereiteten WebP-Boss-Sprites für Vargas, Ironhook, Thorne und Corvin wurden revisionsgepinnt aus `o-some/word-scramble` übernommen. Es existieren keine Runtime-Dropbox-Hotlinks.

Die Asset-Registry umfasst nach Branch 10 insgesamt 25 verifizierte Runtimeassets. SHA-256-Prüfungen sind Bestandteil des permanenten CI-Gates.

## Tests

Erfolgreich ausgeführt:

- Syntaxprüfung
- Asset-Integritätsprüfung
- Campaign-Core
- Enemy-AI-Director
- Learning-Core
- Kai-Boss-Core
- Regionen-2–4-Regression
- Regionen-5–8-Coretests
- Save/Reload-Vertrag
- Card-Hand-Vertrag
- Helper-Commander-Vertrag
- Production Build
- vollständiger Browser-Playtest Regionen 5–8
- Browser-Regression Regionen 2–4

Browser-Evidence wurde auf Mobile Portrait, Mobile Landscape und Desktop visuell geprüft. Keine abgeschnittenen Controls, kein horizontales Overflow und keine kritischen Überlagerungen festgestellt.

## Cleanup

Die nur für die Branch-10-Implementierung verwendeten temporären Asset-, UI- und Playtest-Workflows sowie das einmalige UI-Patchskript werden vor dem finalen Branch-SHA entfernt. Dauerhafte Tests bleiben über das normale CI und die eingecheckten Testdateien erhalten.

## Ergebnis

Branch 10 ist nach finalem Cleanup und erfolgreichem CI auf dem bereinigten SHA als abgeschlossen zu betrachten.
