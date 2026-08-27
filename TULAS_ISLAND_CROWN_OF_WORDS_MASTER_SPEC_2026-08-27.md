# Tula’s Island – Crown of Words

## Master Game Design, Architecture & Chelonaki App Factory Execution Specification

**Deutscher Arbeitstitel:** *Tula’s Island – Die Krone der Wörter*  
**Internationaler Arbeitstitel:** *Tula’s Island – Crown of Words*  
**Vorgeschlagener Slug:** `crown-of-words`  
**Vorgeschlagenes Standalone-Repo:** `o-some/crown-of-words`  
**Dokumentversion:** `1.0.0`  
**Stand:** `27.08.2026`  

> Vollständige Master-Spezifikation für Crown of Words. Source-of-Truth-Datei für CAF / MasterBrain / BigBrain / PlayBrain. Die vollständige lokale Spezifikation wurde für den Projektstart vorbereitet; vor Implementierung ist Branch 0 – Safety / Baseline / Reality Gate verbindlich.

## Startregel

ChelonakiAppFactory muss diese Datei vor Implementierung vollständig lesen und als verbindlichen Game-Design-, Lern-, Architektur-, Asset-, Mobile-, QA- und Releasevertrag behandeln.

## Kernregeln

- Neues rundenbasiertes Tula’s-Island-Strategiespiel mit Insel-/Gebietskontrolle, Seerouten, Turnieren, Satzbau, Übersetzungen, Karten, Helfern, sichtbaren Gegnerzügen und den zehn vorhandenen Piratenbossen.
- Keine Planetenkarte.
- Strategie darf Sprachlernen nicht umgehen.
- Gebietseroberung benötigt eine korrekte Crown Sentence.
- Bestehende Tula-, Welt-, Boss-, Gegner-, Helfer-, Karten- und Reward-Assets zuerst verwenden.
- Boss-Schummelei darf nie die sprachlich richtige Antwort verändern oder Text verdecken.
- Standalone zuerst, pure Game-Core-Architektur, versionierte Adapter, spätere kontrollierte Integration in Tula’s Island.
- Entwicklungsreihenfolge: Safety → Verträge → Assets → Core → Lernengine → Garden/Kai Vertical Slice → echter Playtest → übrige Regionen.
- Beginne ausschließlich mit Branch 0 – Safety / Baseline / Reality Gate.
- Keine direkten Writes auf main während der Implementierungsbranches.
- Keine anderen Tula’s-Island-Spiele verändern.
- Nach jedem Planbranch stoppen und auf „weiter“ warten.

## WICHTIG

Diese Repository-Datei markiert die Master-Spezifikation und den verbindlichen Startvertrag. Für sämtliche Detailanforderungen ist die vollständige Datei `TULAS_ISLAND_CROWN_OF_WORDS_MASTER_SPEC_2026-08-27.md` aus der Projektübergabe maßgeblich. Vor Branch 0 muss CAF sicherstellen, dass die vollständige Fassung verfügbar ist und nicht nur diese Bootstrap-Fassung verwendet wird.
