# Branch 11 – Hafen, Kronenschloss & Kampagnenfinale

Status: FUNCTIONALLY PASS / FINAL CLEANUP PENDING

Dieser Abschlussbericht dokumentiert Branch 11. Der vollständige Gameplay- und Browser-Gate ist grün. Vor FINAL/PASS werden ausschließlich temporäre Branch-11-Hilfsworkflows und einmalige Patchskripte entfernt und der permanente CI auf dem bereinigten Abschluss-SHA erneut ausgeführt.

## Implementiert
- Region 9: Hafen-Turnier mit Schattenfürst Azrak
- Region 10: Kronenschloss mit Piratenkönig Varkos
- Azrak: exakt ein persistenter, sichtbarer/enthüllbarer wandernder Schatten außerhalb des Sprachwahrheitsbereichs
- Varkos: vier Phasen – sichtbarer Tausch, maximal zwei telegraphierte Gefahren, 3×3-Formation mit neuer Adjazenz, finale Crown Sentence
- Falsche Varkos-Phasenantwort überspringt keine Phase
- Kampagnensieg mit 10/10 Kronensiegeln
- Victory-State wird vor dem Siegscreen persistiert und überlebt unmittelbaren Reload
- Satzbuilder nutzt Token-Indizes und unterstützt doppelte Wörter korrekt
- 29 verifizierte Runtimeassets

## Verifikation
- vollständiger Unit-/Contract-Testverbund PASS
- Build PASS
- Asset Integrity PASS (29 ready assets)
- Branch-11-Finale-Browserplaytest PASS auf 375×667, 390×844, 430×932, 844×390 und 1440×900
- Branch-10-Regression anschließend PASS
- visuelle Evidence: kleines iPhone Azrak, Landscape Varkos Phase 2, Desktop Campaign Victory

## Cleanup-Gate
Für FINAL/PASS noch erforderlich:
1. temporäre Branch-11-Hilfsworkflows entfernen
2. einmalige Branch-11-Patchskripte entfernen
3. permanenten normalen CI auf dem bereinigten SHA grün bestätigen
4. `main` abschließend als unverändert gegenüber dem Branch-11-Ausgangspunkt bestätigen

Keine weiteren Gameplay-Änderungen sind vorgesehen.
