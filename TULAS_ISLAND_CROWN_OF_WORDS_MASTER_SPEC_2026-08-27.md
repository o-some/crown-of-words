# Tula’s Island – Crown of Words

## Master Game Design, Architecture & Chelonaki App Factory Execution Specification

**Deutscher Arbeitstitel:** *Tula’s Island – Die Krone der Wörter*  
**Internationaler Arbeitstitel:** *Tula’s Island – Crown of Words*  
**Vorgeschlagener Slug:** `crown-of-words`  
**Vorgeschlagenes Standalone-Repo:** `o-some/crown-of-words`  
**Dokumentversion:** `1.0.0`  
**Stand:** `27.08.2026`  
**Dokumenttyp:** Verbindliche Produkt-, Gameplay-, Lern-, Design-, Architektur-, Asset-, QA- und Umsetzungs-Spezifikation  
**CAF-Klassifizierung:** `GAME-NEW`  
**Planungsstatus:** `DIRECTOR / PLANNING GATE: PASS`  
**Implementierungsstatus:** `NOT STARTED`  
**Gameplay-Playtest:** `NOT TESTED`  
**Real-Device-Test:** `NOT TESTED`  
**Release:** `NOT AUTHORIZED / NOT TESTED`

> Diese Datei ist als vollständige Übergabe an Chelonaki App Factory, BigBrain, MasterBrain, PlayBrain, Codex oder einen Senior-Developer gedacht.  
> Sie ersetzt keine Reality-Prüfung des Ziel-Repositories unmittelbar vor der ersten Änderung.  
> Sie erlaubt ausdrücklich **keine** Behauptung, das Spiel sei bereits gebaut, gespielt, getestet oder veröffentlicht.

---

# Inhaltsverzeichnis

1. Executive Summary  
2. Verbindlicher CAF Outcome Ledger  
3. Quellen der Wahrheit und bestätigter Ist-Stand  
4. Produktvision und Alleinstellungsmerkmal  
5. Zielgruppe und Spielmodi  
6. Nicht-Ziele und Schutzgrenzen  
7. Geschichte und Welt  
8. Strategische Kartenarchitektur  
9. Die zehn Inselregionen  
10. Regionale Bezirke und Eroberungsstruktur  
11. Kern-Gameplay-Loop  
12. Rundenstruktur und gegnerischer Zug  
13. Eroberung, Verteidigung und Versorgung  
14. Lernsystem und Aufgabentypen  
15. Satzbau als Herzstück  
16. Adaptive Schwierigkeit und Mastery  
17. Hilfen, Feedback und faire Fehlerkultur  
18. Taktiksystem, Ressourcen und Karten  
19. Helfer und Kommandanten  
20. Normale Gegner und KI-Verhalten  
21. Turniere  
22. Boss-System und Fairnessvertrag  
23. Die zehn Bosse und ihre Schummelmechaniken  
24. Belohnungen, Progression und Wiederspielwert  
25. Niederlage, Rückschläge und Motivation  
26. Bildschirm- und UX-Architektur  
27. Mobile- und Desktop-Komposition  
28. Visuelles Designsystem  
29. Tula, Figureninszenierung und Animation  
30. Verbindliches Asset-Inventar  
31. Asset-Pipeline und Provenienz  
32. Audio, Haptik und Reduced Motion  
33. Barrierearmut und Kindersicherheit  
34. Technische Zielarchitektur  
35. Repository- und Ordnerstruktur  
36. State Machine  
37. Datenmodelle und Verträge  
38. Host-App-Integration  
39. Offline, Saves und Idempotenz  
40. Performance- und Stabilitätsbudgets  
41. Datenschutzfreundliche Telemetrie  
42. MVP: vollständiger Vertical Slice  
43. Die ersten fünf Spielminuten  
44. Branch- und Release-Plan  
45. Test- und QA-Matrix  
46. CAF Quality Gates  
47. Abnahmekriterien  
48. Risiken und Gegenmaßnahmen  
49. Zukunftsausbau und Multiplayer-Gate  
50. Definition of Done  
51. Starter-Dateien für `.masterbrain/`  
52. Fertiger CAF-Startprompt

---

# 1. Executive Summary

*Crown of Words* ist ein rundenbasiertes, mobile-first Strategiespiel innerhalb der Welt von Tula’s Island. Es übernimmt **ausschließlich abstrakte Genreprinzipien** klassischer Gebietskontroll- und Grand-Strategy-Spiele:

- angrenzende Gebiete,
- sichtbare Fronten und Seerouten,
- begrenzte Aktionen pro Runde,
- Aufklärung,
- Versorgung,
- Verteidigung,
- gegnerische Absichten,
- strategische Karten- und Helferauswahl,
- regionale Turniere,
- schrittweise Befreiung einer großen Karte.

Es kopiert **keine** konkrete Benutzeroberfläche, keine Regeltexte, keine Symbole, keine Namen und keine geschützten Inhalte aus *Hearts of Iron IV*, *Risiko* oder anderen Spielen.

Die zentrale Besonderheit lautet:

> **Kein Gebiet kann erobert werden, ohne echte Sprachaufgaben zu lösen.**

Strategie verbessert die Ausgangslage, darf das Lernen aber nie umgehen. Jede Eroberung, Verteidigung, Spionageaktion, Versorgungslinie und Bossphase wird durch Übersetzung, Wortverständnis, Satzbau, Grammatik, Kategorien oder kurze Leseaufgaben entschieden.

Die Welt besteht nicht aus Planeten. Sie verwendet die vorhandene Tula’s-Island-Karte und zehn bereits vorbereitete Insel- beziehungsweise Weltkulissen:

1. Garten  
2. Bibliothek  
3. Tierwelt  
4. Zuhause  
5. Familie  
6. Körper  
7. Unterwegs  
8. Bewegung  
9. Hafen-Turnier  
10. Kronenschloss  

Jede Region besitzt mehrere taktische Bezirke. Wer genug Bezirke gewinnt, schaltet das regionale Turnier frei. Danach wartet einer der zehn vorhandenen Piratenbosse. Jeder Boss schummelt mit einer eigenen, klar angekündigten Mechanik. Die Schummelei verändert niemals die sprachlich richtige Antwort und darf Aufgabe oder Buttons nie unlesbar machen.

---

# 2. Verbindlicher CAF Outcome Ledger

## GOAL

Ein hochwertiges, eigenständiges Tula’s-Island-Strategiespiel entwickeln, das Gebietskontrolle, Seerouten, sichtbare Gegnerzüge, Karten-/Helfertaktik und regionale Turniere mit einem ernsthaften mehrsprachigen Lernsystem verbindet.

## MUST DO

- Eine große, interaktive Insel-/Archipelkarte statt einer Planetenkarte verwenden.
- Die acht vorhandenen Lernbereiche sowie Hafen und Schloss als zehn strategische Regionen abbilden.
- Die vorhandenen Tula-, Welt-, Boss-, Gegner-, Helfer-, Kartenmonster-, UI- und Reward-Assets zuerst inventarisieren und wiederverwenden.
- Deutsch, Englisch, Spanisch und Griechisch über die vorhandene Sprach-/Content-Architektur unterstützen.
- Sprachrichtungen in beide Richtungen unterstützen, sofern der Content-Vertrag dies zulässt.
- Übersetzung, Wortaufbau, Satzbau, Lückensätze, Sortierung und gemischte Turnieraufgaben integrieren.
- Satzbau als entscheidende Abschlussaufgabe einer Eroberung einsetzen.
- Zehn unterschiedliche Boss-Schummelmechaniken umsetzen.
- Eine vollständige State Machine mit Pause, Hilfe, Save/Reload, Sieg, Niederlage, Boss und Restart bauen.
- Mobile zuerst für kleine iPhone-Viewports komponieren.
- Desktop anschließend eigenständig prüfen.
- Game Core, UI, Content, Storage, Rewards, Assets und Provider klar trennen.
- Einen vollständigen Vertical Slice bauen, bevor alle zehn Welten breit umgesetzt werden.
- Gameplay tatsächlich spielen und nicht nur bauen/linten.
- Jede Belohnung und jede Antwort genau einmal auswerten.
- CAF Module 96, 97 und 98 sowie die Packs `games-learning`, `mobile-interaction` und `tula-island` anwenden.

## MUST PRESERVE

- Die bestehende Haupt-App-Architektur von `o-some/tulasisland`.
- Den einzigen Host-Store und die vorhandenen Storage-/Reward-/Economy-Grenzen.
- Bestehende Fortschritts-, Wallet-, Sprach- und Content-Verträge.
- Andere Tula’s-Island-Spiele und deren Repositories.
- Originaldateien in Dropbox.
- Bereits funktionierende Tula-, Boss- und Weltgrafiken.
- Kindgerechte, motivierende Fehlerkommunikation.
- Offline-Grundfunktion und local-first Verhalten.
- Bestehende Safe-Area-, Accessibility- und Reduced-Motion-Regeln.

## MUST NOT DO

- Keine Planeten, Galaxien oder Weltraumkarte verwenden.
- Kein direktes Klonen von *Hearts of Iron IV*, *Risiko* oder einer anderen Marke.
- Keine geschützten UI-Layouts, Karten, Icons, Regeltexte oder Audioinhalte übernehmen.
- Keine neue generische KI-Grafik erzeugen, solange ein passendes vorhandenes Tula-Asset existiert.
- Keine Dropbox-Datei zur Laufzeit hotlinken.
- Keine Originalgrafik überschreiben.
- Kein monolithisches Ein-Datei-HTML als finale Architektur.
- Kein direktes `localStorage` oder Supabase aus dem Game Core.
- Keine direkte Cross-Game-Datenbankkopplung.
- Keine öffentliche Kinder-Rangliste, kein offener Chat und keine frei eingebbaren öffentlichen Namen.
- Keine Echtgeldmechanik, Lootbox oder Glücksspielähnlichkeit im MVP.
- Keine versteckte KI-Schummelei.
- Keine Bossmechanik, die die richtige Antwort ändert.
- Keine Bossmechanik, die Text, Slots oder Primäraktionen verdeckt.
- Keine automatische Gebietsübernahme während das Kind offline ist.
- Keine permanente Löschung bereits erlernter Wörter, Sterne oder Belohnungen.
- Keine Behauptung eines iPhone-Tests, wenn nur ein Browser-Viewport getestet wurde.

## CONFIRMED PRODUCT FACTS

- Hauptrepo: `o-some/tulasisland`
- Default Branch: `main`
- Am 27.08.2026 verifizierter `main`-SHA: `cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0`
- Haupt-App: Vite, browsernative ES-Module, Capacitor, local-first.
- Aktuelle Sprachen: Deutsch, Spanisch, Griechisch und Englisch.
- Kanonische Architekturquelle: `docs/ARCHITECTURE.md`
- Aktueller Status: `docs/NOW.md`
- Einziger Host-Laufzeit-Store: `src/v3/core/store.js`
- Direkter Supabase-/localStorage-Zugriff außerhalb der vorgesehenen Core-Adapter ist verboten.
- Vorhandene Spiele liegen aktuell unter `src/v3/games/`.
- Aktuelle Design- und Asset-Registries liegen unter `src/config/`.
- Zehn Weltkulissen und zehn Boss-Sprites sind vorhanden.
- Bestehende Projekte enthalten bereits erprobte Lern-, Boss-, Karten-, Helfer-, Pause-, Combo- und Motivationsmechaniken.

## USER-VISIBLE DELTA

Nach der Umsetzung sieht und erlebt das Kind:

- eine hochwertige interaktive Inselkarte,
- sichtbare kontrollierte, umkämpfte und gesperrte Regionen,
- Seerouten und Frontlinien,
- gegnerische Absichten,
- auswählbare Helfer und vier taktische Karten,
- Sprachaufgaben als Grundlage jeder Aktion,
- regionale Turniere,
- zehn Bosskämpfe mit einzigartigen Schummelmechaniken,
- klare Tula-Reaktionen,
- Gebietsbefreiung und Wiederaufbau,
- Belohnungen, Sterne, XP, Muscheln und Mastery,
- einen motivierenden Kampagnenabschluss.

## APPROVAL GATES

1. Finaler Spielname und Repo.
2. Kartenkomposition auf iPhone.
3. Asset-Import und visuelle Provenienz.
4. Garden/Kai-Vertical-Slice.
5. Umfang der strategischen Tiefe für die jüngste Zielgruppe.
6. Optionales Audio.
7. Multiplayer.
8. Monetarisierung.
9. Host-App-Integration.
10. Öffentlicher Release.

## ACTIVE RELEASE TARGET

Zuerst:

> **Spielbarer Garden/Kai-Vertical-Slice als Standalone-Web-Preview mit sauberer späterer Host-Integration.**

Nicht zuerst:

- alle zehn Welten,
- Multiplayer,
- Echtgeld,
- App-Store-Release,
- umfangreiches Backend.

## DONE EVIDENCE

- Baseline-SHA und Branch dokumentiert.
- `.masterbrain/game-design.yml` vorhanden.
- `.masterbrain/impact-scope.yml` vorhanden.
- Asset-Manifest mit Quelle, Ziel, Hash und Verwendungszweck vorhanden.
- Build erfolgreich.
- Kernpfad tatsächlich gespielt.
- Richtige und falsche Antworten getestet.
- Pause/Resume getestet.
- Save/Reload getestet.
- Bossintro, Bossfähigkeit, Bosssieg und Bossniederlage getestet.
- 375×667, 390×844, 430×932 und 1440×900 geprüft.
- Touch-, Maus- und zugänglicher Nicht-Drag-Pfad geprüft.
- Keine kritischen Asset-404s.
- Keine kritischen Console Errors.
- Quality Score mindestens 90/100 und alle Kategorie-Minima erreicht.
- Keine kritischen Blocker.
- Finaler Test bezieht sich exakt auf den Release-Kandidaten.

---

# 3. Quellen der Wahrheit und bestätigter Ist-Stand

## 3.1 Aktuelles GitHub-Repository

Am 27.08.2026 wurde gelesen:

```text
Repository: o-some/tulasisland
Branch: main
SHA: cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0
```

Vor jeder Umsetzung muss dieser Stand erneut geprüft werden. Dieser SHA ist ein dokumentierter Planungs-Baselinewert und kein Freifahrtschein für spätere Änderungen.

## 3.2 Kanonische App-Dokumente

```text
docs/NOW.md
docs/ARCHITECTURE.md
package.json
src/config/assets.js
src/config/design-tokens.js
src/v3/games/
```

Historische Planungsdateien dürfen aktuelle Code- und Architekturrealität nicht überstimmen.

## 3.3 Chelonaki App Factory

Verbindliche aktuelle Grundlage:

```text
/[[MD Mastery]]/ChelonakiAppFactory.md
```

Relevante Game-Module:

```text
/[[MD Mastery]]/modules/96_GAME_DEVELOPMENT_DIRECTOR.md
/[[MD Mastery]]/modules/97_GAME_PLAYTEST_VISUAL_QA.md
/[[MD Mastery]]/modules/98_GAME_RELEASE_LOOP.md
```

Relevante BigBrain-Packs:

```text
/[[MD Mastery]]/big-brain/packs/games-learning.yml
/[[MD Mastery]]/big-brain/packs/mobile-interaction.yml
/[[MD Mastery]]/big-brain/packs/tula-island.yml
```

## 3.4 Relevante Erkenntnisse aus vorhandenen Spielen

Das neue Spiel soll nicht bei null anfangen. Es übernimmt bewährte Prinzipien aus:

- Word Scramble:
  - Bosskampagne,
  - Boss-HP und getrennte Bossfehler,
  - Wortaufbau,
  - Treasure Words,
  - Seltenheiten,
  - Bossintro,
  - Bossroadmap,
  - Drei-Sterne-Bewertung,
  - Tula-Reaktionen.
- Pirate Pairs:
  - sichtbare Kartenverschiebungen,
  - persistente Marker,
  - faire Hilfe-/Pause-Gates,
  - mehrphasiger Varkos,
  - bossfähige Zustandsmaschinen.
- Wordbound Battle:
  - Helferauswahl,
  - gegnerischer Intent,
  - Druckanzeige,
  - Satzbauzone,
  - Tokenbank,
  - Teamtaktik.
- Pirate Deck:
  - Vier-Karten-Hand,
  - Kosten, Angriff, Verteidigung,
  - Sprachfrage als Freigabe für Kartenspiel.
- Word Guardians:
  - strategischer Druck,
  - Gegnerarchetypen,
  - Lernleistung erzeugt Energie und Wirkung,
  - motivierender Endscreen,
  - exakte Pause.
- Shell Runner:
  - Revenge Words,
  - Mastery,
  - Routenwahl,
  - Perks,
  - faire Boss-Telegraphie,
  - getrennte Boss-/Normalspiel-Folgen.

---

# 4. Produktvision und Alleinstellungsmerkmal

## 4.1 Elevator Pitch

> Tula führt eine kleine Wortflotte durch ein von Piraten besetztes Inselreich. Jede Seeroute, jedes Gebiet und jedes Turnier wird durch echte Sprachaufgaben gewonnen. Spieler planen wie in einem Strategiespiel, lernen aber nur dann erfolgreich, wenn sie Wörter verstehen, übersetzen und Sätze korrekt bauen.

## 4.2 Kernversprechen

Das Spiel soll gleichzeitig drei Gefühle erzeugen:

1. **Ich plane clever.**
2. **Ich habe wirklich etwas gelernt.**
3. **Ich will noch eine Region zurückgewinnen.**

## 4.3 Was es von einem normalen Lernspiel unterscheidet

- Lernen ist nicht nur ein Popup vor der eigentlichen Action.
- Die Lernleistung bestimmt den Ausgang.
- Falsche Antworten verändern die taktische Lage, ohne zu beschämen.
- Fehler werden später gezielt als Revenge Challenges wiederholt.
- Regionen besitzen Themen, visuelle Identität und strategische Funktion.
- Bosse verändern das Spielfeld, nicht die Wahrheit der Sprache.
- Die Karte schafft langfristige Motivation über einzelne Minispiele hinaus.

## 4.4 Was es von einem normalen Strategiespiel unterscheidet

- Keine Gewalt als Hauptfantasie.
- Konflikte werden als Turniere, Wortduelle, Blockaden und Gebietsbefreiung inszeniert.
- Keine langen passiven Wartezeiten.
- Keine unübersichtlichen Tabellen.
- Kein Offline-Verlust.
- Kein Pay-to-Win.
- Keine Strategie, die Sprachlernen umgehen kann.

---

# 5. Zielgruppe und Spielmodi

## 5.1 Primäre Zielgruppe

Lesefähige Kinder ungefähr zwischen 6 und 12 Jahren.

Das Spiel ist nicht der primäre Einstieg für Kinder, die noch gar nicht lesen können. Für jüngere Kinder bleiben Hör-, Bild- und Tippübungen der Haupt-App geeigneter.

## 5.2 Schwierigkeitsmodi

### Entdecker

- kurze Wörter,
- Sätze mit drei bis fünf Tokens,
- zwei bis drei Antwortoptionen,
- starke visuelle Führung,
- ein kostenloser Schutzfehler pro Begegnung,
- reduzierte strategische Anzeige,
- gegnerischer Zug stark vereinfacht.

### Kapitän

- Standardmodus,
- Sätze mit vier bis acht Tokens,
- mehrere Aufgabentypen,
- vier Karten,
- sichtbare Versorgung,
- volle normale Bossmechanik.

### Admiral

- längere Sätze,
- zusätzliche Distraktoren,
- Grammatik- und Leseverständnis,
- weniger kostenlose Hilfen,
- komplexere KI-Intents,
- stärkere Bossphasen,
- keine Veränderung der richtigen Antwort.

## 5.3 Kampagnenmodi

### Story-Kampagne

Lineare Einführung mit wachsender Freiheit. Empfohlener MVP-Modus.

### Freie Eroberung

Mehrere angrenzende Ziele wählbar. Erst nach stabiler Story-Kampagne.

### Schnellturnier

Direkter regionaler Turnierlauf ohne Makrokarte. Ideal für kurze Übungssitzungen.

### Übungsreise

Spaced-Repetition-Run ohne Gebietsverlust. Fehlerwörter stehen im Mittelpunkt.

---

# 6. Nicht-Ziele und Schutzgrenzen

## 6.1 Kein direkter Grand-Strategy-Klon

Es werden nur allgemeine Genreprinzipien genutzt. Nicht übernommen werden:

- konkrete Kartenprojektionen,
- historische Nationen,
- politische Ideologien,
- Militärsymbolik,
- Tech-Trees anderer Spiele,
- konkrete Kampfwerte oder Formeln,
- UI-Anordnung anderer Titel,
- originale Namen oder Sounds.

## 6.2 Kein unnötig komplexes Wirtschaftsspiel

Im MVP gibt es keine zehn Ressourcenarten. Die Oberfläche verwendet höchstens:

- **Wortkraft** innerhalb einer Begegnung,
- **Befehlsperlen** als kurzfristige Taktikressource,
- **Versorgung** auf der Kampagnenkarte,
- bestehende **XP**, **Muscheln** und **Mastery-Sterne** als Host-Belohnungen.

## 6.3 Keine unsichtbaren Nachteile

Der Gegner kündigt Aktionen an. Bosse schummeln sichtbar. Zufall ist seedbar und testbar.

## 6.4 Kein permanenter Frust

- Bereits verdiente Mastery bleibt.
- Ein verlorenes Turnier setzt die Region auf `contested`, nicht auf „alles gelöscht“.
- Ein Bossverlust löscht keine normalen Leben.
- Kontrollierte Gebiete werden offline nicht automatisch gestohlen.
- Wiederholung dient Lernen, nicht Bestrafung.

---

# 7. Geschichte und Welt

Die **Krone der Wörter** hielt einst die Seerouten der Inselwelten zusammen. Piratenkönig Varkos zerbrach ihre zehn Siegel und verteilte sie an seine Kapitäne. Seitdem geraten Wörter durcheinander, Wege verschwinden im Nebel, Bibliothekskarten tauschen ihre Plätze und ganze Sätze verlieren ihre Ordnung.

Tula baut mit ihren Freunden die **Wortflotte** auf. Sie reist von Region zu Region, gewinnt Bezirke zurück, tritt in Turnieren an und sammelt die zehn Kronensiegel.

Der Konflikt bleibt kindgerecht:

- Gebiete werden befreit oder zurückgewonnen.
- Gegner werden in Wortduellen besiegt.
- Treffer werden als Wellen, Licht, Siegel oder Tintenexplosionen dargestellt.
- Niemand wird realistisch verletzt.
- Bosse können später als Übungsgegner wiederkommen.

---

# 8. Strategische Kartenarchitektur

## 8.1 Zwei Zoomstufen

### Ebene A – Archipelkarte

Die große Kampagnenkarte zeigt:

- alle zehn Regionen,
- kontrollierte, umkämpfte und gesperrte Gebiete,
- Seerouten,
- aktuelle Gegner,
- Versorgung,
- nächste Turniere,
- Bosspositionen,
- Tulas Flotte.

### Ebene B – Regionskarte

Jede Region besitzt eine kompakte lokale Karte mit fünf Bezirken:

1. Anlegestelle  
2. Lernort  
3. Werkstatt/Dorf  
4. Turnierarena  
5. Bossfestung  

Die lokale Karte kann ein 3×3-Taktikraster verwenden, obwohl nur fünf bis sieben Felder aktiv sind. Das erlaubt Corvins echte Reihen-/Spaltenverschiebung, ohne die globale Karte zu zerstören.

## 8.2 Warum zwei Ebenen notwendig sind

Eine einzige Karte mit ungefähr 50 klickbaren Punkten würde auf dem iPhone überladen wirken. Die Zweiteilung bewahrt:

- strategische Übersicht,
- große Touch-Ziele,
- klare Lesbarkeit,
- hochwertige Weltgrafiken,
- Platz für Boss- und Lernaufgaben.

## 8.3 Karteninteraktion

### Mobile

- Pan und optional Pinch-Zoom innerhalb der Kartenfläche.
- Alternativ zugängliche Regionsliste.
- Bottom Sheet für Details.
- Browserseite selbst bleibt stabil; Kartenbewegung darf keinen unbeabsichtigten Body-Scroll auslösen.
- Ein Tippen wählt, ein zweites bestätigt nicht automatisch.
- Kritische Aktionen benötigen klaren Button.

### Desktop

- größere Gesamtkarte,
- feste Seitenleiste für Details,
- Hover nur als Zusatz,
- alle Funktionen per Klick und Tastatur erreichbar.

## 8.4 Zustände eines Gebiets

```text
locked
neutral
scouted
contested
controlled
mastered
boss_locked
boss_available
```

Jeder Zustand besitzt:

- Farbe,
- Symbol,
- Muster,
- Textlabel,
- Screenreader-Status.

Farbe allein darf nie die einzige Information sein.

---

# 9. Die zehn Inselregionen

| Nr. | Region | Lernschwerpunkt | Weltasset | Boss | Strategische Funktion |
|---:|---|---|---|---|---|
| 1 | Garten | Pflanzen, Farben, Essen, einfache Verben | `world_garden.webp` | Pirat Kai | Tutorial, erste Versorgung |
| 2 | Bibliothek | Wörter, Bücher, Artikel, Satzgrundlagen | `world_library.webp` | Kapitän Brax | zusätzliche Hinweisaktion |
| 3 | Tierwelt | Tiere, Eigenschaften, Vergleiche | `world_jungle_trail.webp` | Blackfinn | Aufklärung |
| 4 | Zuhause | Räume, Gegenstände, Präpositionen | `world_sun_bay.webp` | Alt-Kapitän Roderick | Verteidigung |
| 5 | Familie | Personen, Pronomen, Beziehungen | `world_coral_reef.webp` | Piratenbaron Vargas | Unterstützungsbonus |
| 6 | Körper | Körper, Zustände, Alltagsverben | `world_crystal_cove.webp` | Kapitän Ironhook | Schutzschild |
| 7 | Unterwegs | Reise, Richtungen, Verkehr | `world_desert_oasis.webp` | Admiral Thorne | zusätzliche Seeroute |
| 8 | Bewegung | Verben, Zeitformen, Imperative | `world_ice_peak.webp` | Kartenmeister Corvin | Manöver |
| 9 | Hafen-Turnier | gemischte Wiederholung, Handels-/Reisesprache | `world_harbor.webp` | Schattenfürst Azrak | Flottenzentrum |
| 10 | Kronenschloss | komplexe Sätze, Mischprüfung, Storyfinale | `world_castle.webp` | Piratenkönig Varkos | Kampagnenfinale |

## 9.1 Progressionsregel

Die Kampagne beginnt im Garten. Danach öffnet sie sich kontrolliert:

```text
Garten
→ Bibliothek oder Tierwelt
→ Zuhause / Familie
→ Körper / Unterwegs
→ Bewegung
→ Hafen
→ Schloss
```

Es soll mehrere sinnvolle Wege geben, aber kein völliges Chaos in den ersten Minuten.

---

# 10. Regionale Bezirke und Eroberungsstruktur

Jede Region besitzt standardmäßig fünf zentrale Bezirke.

## 10.1 Anlegestelle

- kurze Übersetzungen,
- Aufklärung des Gegners,
- öffnet lokale Bewegung,
- niedrige Einstiegshürde.

## 10.2 Lernort

Beispiele:

- Gartenhaus,
- Lesesaal,
- Tierpfad,
- Küche,
- Familienplatz,
- Heilstation,
- Wegweiser,
- Trainingsfeld,
- Leuchtturm,
- Kronenarchiv.

Aufgabe:

- Wortverständnis,
- Bild-/Wortzuordnung,
- Kategorie,
- kurze Grammatik.

## 10.3 Werkstatt oder Dorf

- Satzbau,
- Lückensatz,
- Reihenfolge,
- Präposition,
- Frage/Antwort.

## 10.4 Turnierarena

Wird nach mindestens drei erfolgreichen Bezirken freigeschaltet. Das Turnier kombiniert mehrere Lernarten.

## 10.5 Bossfestung

Wird erst nach dem regionalen Turniersieg freigeschaltet.

## 10.6 Kontrolllogik

Eine Region wird `controlled`, wenn:

- mindestens drei Vorbezirke gewonnen wurden,
- das Turnier gewonnen wurde,
- der Boss besiegt wurde.

Eine Region wird `mastered`, wenn zusätzlich:

- mindestens zwei Sterne im Turnier,
- mindestens zwei Sterne beim Boss,
- zentrale Revenge Words später korrekt gelöst wurden.

---

# 11. Kern-Gameplay-Loop

## 11.1 Makro-Loop

```text
Karte ansehen
→ angrenzendes Ziel wählen
→ Gegnerabsicht und Regionsthema prüfen
→ Helfer und Karten auswählen
→ Begegnung starten
→ Sprachaufgaben lösen
→ taktische Auflösung
→ gegnerischen Zug beobachten
→ Gebiet kontrollieren / umkämpft lassen
→ Feedback, Mastery und Belohnung
→ nächste Entscheidung
```

## 11.2 Begegnungs-Loop

```text
Aufgabe verstehen
→ optional TTS/Hinweis
→ Antwort geben
→ genau einmal auswerten
→ verständliches Feedback
→ Wortkraft vergeben
→ Karten-/Helfereffekt auslösen
→ Boss-/Gegnerreaktion
→ nächste Aufgabe oder taktische Auflösung
```

## 11.3 Lernanteil am Ergebnis

Die Lernleistung muss mindestens 75 Prozent der möglichen Ergebnisstärke liefern.

Vorgeschlagene erste Tuningformel:

```text
5 Aufgaben pro Standardbegegnung

pro Aufgabe:
3 Wortkraft = beim ersten Versuch richtig
2 Wortkraft = nach leichtem Hinweis richtig
1 Wortkraft = nach Fehler selbst korrigiert
0 Wortkraft = Lösung vollständig gezeigt oder übersprungen

maximale Wortkraft: 15
maximale Taktikkraft: 4
Gegnerdruck: 0–6
```

Standarderoberung:

```text
Gesamt = Wortkraft + Taktikkraft - Gegnerdruck

Sieg:
- mindestens 11 Gesamtpunkte
- mindestens 3 Aufgaben fachlich gelöst
- Abschlussaufgabe nicht übersprungen
```

Bosssieg:

```text
- mindestens 14 Gesamtpunkte
- finale Crown Sentence korrekt
- Boss-HP auf 0
```

Diese Werte sind Startwerte und müssen im Playtest balanciert werden. Die Grundregel bleibt jedoch unveränderlich:

> Taktik allein darf niemals ein Gebiet gewinnen.

---

# 12. Rundenstruktur und gegnerischer Zug

## 12.1 Spielerzug

Der Spieler erhält pro Kampagnenrunde drei **Befehlsperlen**. Mögliche Aktionen:

- Angreifen,
- Verteidigen,
- Aufklären,
- Versorgung reparieren,
- Übungsreise starten,
- Flotte über eine kontrollierte Route bewegen.

Nicht jede Aktion benötigt eine volle Begegnung. Trotzdem muss jede bedeutende strategische Wirkung durch eine passende Lernaufgabe verdient werden.

## 12.2 Gegnerzug

Nach dem Spielerzug:

1. Gegnerabsichten werden eingeblendet.
2. Jede KI führt höchstens eine Hauptaktion aus.
3. Aktionen laufen sichtbar nacheinander.
4. Angegriffene kontrollierte Gebiete werden `contested`.
5. Dauerhaft verloren gehen sie erst nach einer späteren, sichtbaren Verteidigungsbegegnung.
6. Offline findet kein geheimer Gegnerzug statt.

## 12.3 Gegnertypische Aktionen

- `scout`: deckt eine Route auf,
- `fortify`: erhöht lokalen Schwellenwert,
- `raid`: erzeugt temporären Versorgungsdruck,
- `contest`: markiert ein Gebiet für Verteidigung,
- `blockade`: sperrt eine Seeroute bis zur Sprachaufgabe,
- `recover`: heilt Boss-/Gegnerstatus zwischen Begegnungen,
- `feint`: zeigt zwei Ziele, greift aber nur eines sichtbar an.

---

# 13. Eroberung, Verteidigung und Versorgung

## 13.1 Adjazenz

Nur angrenzende oder über eine kontrollierte Seeroute verbundene Gebiete können angegriffen werden.

Die Karte verwendet einen expliziten Graphen. Adjazenz darf nicht nur visuell angenommen werden.

## 13.2 Versorgung

Versorgung entsteht durch:

- kontrollierte Häfen,
- zusammenhängende Routen,
- bestimmte Regionen,
- Helfer- oder Kartenfähigkeiten.

Fehlende Versorgung darf:

- eine Taktikkarte sperren,
- Taktikkraft reduzieren,
- einen zusätzlichen Aufklärungsschritt verlangen.

Fehlende Versorgung darf niemals:

- die Aufgabe unlesbar machen,
- korrekte Antworten als falsch werten,
- Sprachinhalte verfälschen,
- permanenten Lernfortschritt löschen.

## 13.3 Verteidigung

Kontrollierte Gebiete besitzen ein sichtbares Schild. Ein gegnerischer Angriff erzeugt:

- `contested`,
- eine klare Benachrichtigung,
- eine Verteidigungsbegegnung.

Ein bereits `mastered` Gebiet verliert niemals seine Mastery-Sterne. Es kann taktisch umkämpft sein, aber die Lernleistung bleibt erhalten.

## 13.4 Frontlinien

Frontlinien sind visuelle Verbindungen zwischen kontrollierten und gegnerischen Gebieten. Sie zeigen:

- Gegnerdruck,
- Versorgung,
- aktiven Boss-Einfluss,
- nächstes wahrscheinliches Ziel.

Die Darstellung bleibt kindgerecht und verwendet Wellen, Flaggen und Leuchtlinien statt realistischer Militärsymbole.

---

# 14. Lernsystem und Aufgabentypen

## 14.1 Verbindliche Aufgabentypen

### Übersetzungsauswahl

Ein Wort oder kurzer Satz wird gezeigt. Der Spieler wählt die korrekte Übersetzung.

### Word Scramble

Buchstaben oder Wörter werden in die richtige Reihenfolge gebracht.

### Satzbau

Token werden zu einem vollständigen Satz zusammengesetzt.

### Lückensatz

Ein fehlendes Wort, eine Präposition, ein Artikel oder eine Verbform wird ergänzt.

### Satzreparatur

Ein fehlerhafter Satz enthält genau einen klar definierten Fehler.

### Kategorie und Sortierung

Wörter werden passenden Themen, Personen, Orten oder Handlungen zugeordnet.

### Memory-/Intel-Aufgabe

Bereits gesehene Wörter oder Informationen werden wiedererkannt. Die Aufgabe darf nicht nur visuelles Gedächtnis prüfen; die Sprachbedeutung muss relevant bleiben.

### Kurzes Leseverständnis

Ab höheren Schwierigkeitsstufen: ein bis drei kurze Sätze mit verständlicher Frage.

## 14.2 Sprachpaare

Mindestens:

```text
de ↔ en
de ↔ es
de ↔ el
en ↔ es
en ↔ el
es ↔ el
```

Nur tatsächlich verfügbare und qualitätsgesicherte Richtungen werden freigeschaltet.

## 14.3 Content-Regel

Das Spiel besitzt keine eigene, riesige, hart codierte Vokabelliste. Es konsumiert versionierte Content-Bundles oder den vorhandenen Host-Content-Service.

Ein Challenge-Datensatz referenziert:

- sprachunabhängige Concept-ID,
- Quellsprache,
- Zielsprache,
- Kategorie,
- CEFR-/Schwierigkeitsstufe,
- gültige Varianten,
- Distraktoren,
- Satzstruktur,
- TTS-Referenz,
- Mastery-Metadaten.

---

# 15. Satzbau als Herzstück

Satzbau ist die entscheidende Mechanik, die das Spiel von einer reinen Wortquiz-Karte abhebt.

## 15.1 Satzbau-UI

- Ausgangssatz beziehungsweise Bedeutung oben.
- Zielrichtung klar sichtbar.
- große Tokenbank.
- Bauzone mit sichtbarer Reihenfolge.
- Tippen und Drag & Drop.
- zugängliche Nicht-Drag-Alternative.
- Zurück, Leeren, leichter Hinweis und Prüfen.
- Primärbutton mindestens ungefähr 44×44 CSS-Pixel.
- lange deutsche, spanische und griechische Sätze testen.

## 15.2 Satzarten nach Region

| Region | Satzfokus |
|---|---|
| Garten | einfache Subjekt-Verb-Objekt-Sätze |
| Bibliothek | Artikel, Nomen, Fragewörter |
| Tierwelt | Eigenschaften und Vergleiche |
| Zuhause | Präpositionen und Ortsangaben |
| Familie | Pronomen und Besitz |
| Körper | Zustände, Bedürfnisse, Modalverben |
| Unterwegs | Richtungen, Fragen und Reisephrasen |
| Bewegung | Verben, Zeitformen, Imperative |
| Hafen | gemischte Alltagsdialoge |
| Schloss | mehrteilige Sätze und Konnektoren |

## 15.3 Crown Sentence

Jedes Turnier und jeder Boss endet mit einer **Crown Sentence**:

- vollständiger Satz,
- thematisch passend,
- mehrere Tokens,
- keine automatisch erratbare Ein-Wort-Lösung,
- klarer Feedbacksatz,
- TTS optional nach Erfolg,
- bei Fehler verständliche Erklärung.

Ein Gebiet darf ohne bestandene Crown Sentence nicht vollständig erobert werden.

---

# 16. Adaptive Schwierigkeit und Mastery

## 16.1 Wort-Mastery

```text
neu
gesehen
geübt
sicher
gemeistert
wiederholung_fällig
```

## 16.2 Revenge Words

Falsch beantwortete Wörter oder Satzmuster kehren später wieder:

- nicht sofort identisch,
- in anderem Aufgabentyp,
- mit angemessenem Abstand,
- häufiger als sichere Wörter,
- ohne als Strafe bezeichnet zu werden.

## 16.3 Adaptive Regeln

- unsichere Concepts häufiger,
- gemeisterte Concepts seltener,
- wiederholte gleiche Fehler lösen eine gezielte Mikroerklärung aus,
- korrekte Antworten mit starkem Hinweis zählen weniger für Sterne,
- Boss-Roderick kann Fehlergeschichte verwenden, aber nur aus tatsächlich gespeicherten, passenden Concepts,
- keine erfundenen oder fachlich unsicheren Sätze.

## 16.4 Schwierigkeit darf nicht durch Unlesbarkeit entstehen

Erlaubt:

- längere Sätze,
- ähnlichere Distraktoren,
- weniger Hilfen,
- komplexere Grammatik,
- stärkere taktische Konsequenzen.

Verboten:

- winzige Schrift,
- verdeckte Wörter,
- absichtlich schlechte Kontraste,
- zu kurze Lesefenster,
- falsche Übersetzungen,
- willkürliche Antwortwechsel.

---

# 17. Hilfen, Feedback und faire Fehlerkultur

## 17.1 Dreistufige Hilfe

### Stufe 1 – Orientierung

- Kategorie,
- erstes Klang-/Bedeutungssignal,
- Grammatikhinweis,
- kein Lösungsteil.

### Stufe 2 – Fokus

- zwei falsche Optionen entfernen,
- richtige Satzposition markieren,
- ein relevantes Wort erklären.

### Stufe 3 – Teilhilfe

- erstes Token setzen,
- ein Buchstabenpaar aufdecken,
- Satzstruktur anzeigen.

Eine komplette Lösung darf nur als letzte, klar gekennzeichnete Lernhilfe erscheinen und zählt nicht als normaler Siegpunkt.

## 17.2 Fehlerfeedback

Bei Fehler:

- kurzer Shake oder sanfter roter Rand,
- Tula schaut nachdenklich,
- richtige Antwort wird verständlich erklärt,
- Combo wird reduziert oder zurückgesetzt,
- keine beschämende Sprache,
- Aufgabe wird exakt einmal gewertet,
- Revenge-Concept wird vorgemerkt.

## 17.3 Richtiges Feedback

Bei richtig:

- klare grüne/goldene Bestätigung,
- Wortkraft steigt,
- Tula reagiert,
- Gegner/Boss reagiert,
- optional TTS,
- kurze Animation, danach sofort nächste Aktion.

## 17.4 Hilfe und Bosszustand

Hilfe ist ein echter State-Gate:

- Timer stoppt,
- KI stoppt,
- Bossmechanik stoppt,
- Animationen pausieren,
- Marker wandern nicht,
- nach Schließen geht es exakt weiter.

---

# 18. Taktiksystem, Ressourcen und Karten

## 18.1 Wortkraft

Wird nur innerhalb der Begegnung verdient und ist direkt an Lernleistung gekoppelt.

## 18.2 Befehlsperlen

Kleine, sichtbare Aktionsressource. Sie wird nicht als Echtgeldwährung verwendet.

## 18.3 Versorgung

Kampagnenressource für zusammenhängende Gebiete und Seerouten.

## 18.4 Vier-Karten-Hand

Vor einer Begegnung wählt der Spieler bis zu vier Kartenmonster. Eine Karte darf nur gespielt werden, wenn ihre Sprachaufgabe korrekt gelöst wurde.

Standardregel:

- korrekte Antwort: Karte wird gespielt,
- falsche Antwort: Karte wird für die aktuelle Begegnung erschöpft,
- Kosten bleiben verbraucht,
- keine permanente Kartenlöschung,
- Entdecker-Modus besitzt einmal pro Begegnung eine Rückerstattung.

## 18.5 Kartenwirkung darf Lernen nicht umgehen

Karten dürfen:

- Gegnerintent aufdecken,
- Druck reduzieren,
- Versorgung sichern,
- einen Fehler abfedern,
- Taktikkraft erhöhen,
- eine Route verschieben,
- einen schwachen Hinweis ermöglichen.

Karten dürfen nicht:

- die Crown Sentence automatisch lösen,
- richtige Antworten vorgaukeln,
- eine Eroberung ohne Mindestanzahl korrekter Antworten erzeugen.

---

# 19. Helfer und Kommandanten

Die vorhandenen Wordbound-Helfer werden als strategische Kommandanten genutzt.

| Helfer | Kanonischer Schwerpunkt | Vorgeschlagene Wirkung |
|---|---|---|
| Meli | Früchte / Essen | erster Food-/Gartenfehler erzeugt nur halben Druck |
| Neri | Natur | deckt vor Start eine gegnerische Absicht auf |
| Skippi | Reise | erlaubt einmal eine alternative Seeroute |
| Fino | Zuhause | gibt einem kontrollierten Bezirk einen Schutzschild |

Wichtig:

- Der Helfer `Neri` und das Kartenmonster `Neri – Meereskundschafter` benötigen getrennte interne IDs.
- Vorschlag:
  - `helper-neri-nature`
  - `card-neri-sea-scout`
- Der sichtbare Name darf gleich bleiben, die technische Identität nicht.

## 19.1 Tula

Tula ist keine austauschbare Karte. Sie ist:

- Guide,
- emotionale Rückmeldung,
- Storyfigur,
- Kampagnenanker,
- kein Pay-to-Win-Charakter.

---

# 20. Normale Gegner und KI-Verhalten

Die vorhandenen Gegnerarchetypen können als regionale KI-Kommandanten auftreten.

| Gegner | Rolle | Kartenverhalten |
|---|---|---|
| Niko | leichter Deckhand | greift schwache neutrale Bezirke an |
| Lio | schneller Kundschafter | deckt Routen auf und erzeugt Feints |
| Mako | robuster Räuber | verstärkt kontrollierte Bezirke |
| Taro | Schild-Bukanier | verteidigt und reduziert Taktikkraft |
| Piko | Wellen-Skater | bewegt sich schnell über Seerouten |
| Koda | Anker-Brute | blockiert eine Route |
| Yara | Gezeitenruferin | unterstützt benachbarte Gegner |
| Riven | Kanonen-Korsarin | erzeugt sichtbaren Fern-/Blockadedruck |

## 20.1 KI-Grundsätze

- deterministisch seedbarer Zufall,
- keine Kenntnis zukünftiger Spielerantworten,
- keine unsichtbare Änderung der korrekten Lösung,
- sichtbarer Intent,
- höchstens eine Hauptaktion je KI pro Zug,
- keine Offline-Eroberung,
- verständliche Prioritäten,
- testbare Entscheidungsprotokolle.

## 20.2 Schwierigkeitssteuerung der KI

Die KI wird stärker durch:

- bessere Gebietswahl,
- klügere Versorgung,
- sinnvollere Kartennutzung,
- stärkere Telegraphed Combos.

Nicht durch:

- manipulierte Übersetzungen,
- unlesbare UI,
- extreme Zufallsserien,
- versteckte Zusatzaktionen.

---

# 21. Turniere

## 21.1 Turnieraufbau

Jedes regionale Turnier besitzt drei Phasen.

### Runde 1 – Qualifikation

- drei kurze Übersetzungs-/Wortaufgaben,
- Ziel: Grundverständnis.

### Runde 2 – Taktikduell

- zwei gemischte Aufgaben,
- Wort Scramble, Kategorie, Lücke oder Intel.

### Runde 3 – Kronenrunde

- eine vollständige Crown Sentence,
- entscheidend für Sieg.

## 21.2 Sterne

### Ein Stern

Turnier gewonnen.

### Zwei Sterne

- höchstens zwei Fehler,
- keine komplette Lösung eingeblendet.

### Drei Sterne

- Crown Sentence beim ersten Versuch,
- höchstens leichter Hinweis,
- hoher Lernanteil.

## 21.3 Replay

- Sterne können verbessert werden.
- Mastery kann verbessert werden.
- Erstbelohnung nur einmal.
- Wiederholungsbelohnung kleiner und transparent.
- Keine Endlosschleife zum Farmen wertvoller Wallet-Währung.

---

# 22. Boss-System und Fairnessvertrag

## 22.1 Boss-Ablauf

```text
Boss verfügbar
→ Bossintro
→ Fähigkeit erklären
→ „Verstanden“
→ Helfer/Karten bestätigen
→ Phase starten
→ Lernaufgabe
→ Bossfähigkeit
→ taktische Auflösung
→ nächste Phase
→ Sieg oder Niederlage
→ Belohnung / Retry / Übungsreise
```

## 22.2 Bossintro

Das Intro zeigt:

- großes vorhandenes Boss-Sprite,
- Level,
- Name,
- Region,
- Schummelfähigkeit in einem Satz,
- kleines visuelles Beispiel,
- Button `Verstanden`,
- danach kompaktes Boss-Infoelement.

## 22.3 Verbindliche Fairnessregeln

1. Schummelei wird vor ihrer ersten Wirkung erklärt.
2. Eine Mechanik wird vor der Entscheidung telegraphiert.
3. Die sprachlich richtige Antwort bleibt unverändert.
4. Aufgabe, Tokens und Primärbuttons bleiben vollständig lesbar.
5. Höchstens zwei Gefahren gleichzeitig.
6. Animation beendet sich, bevor Eingabe wieder freigegeben wird.
7. Hilfe, Pause und Reload erhalten den Bosszustand deterministisch.
8. Bossfehler ziehen keine normalen Kampagnenleben ab.
9. Keine permanente Löschung von Mastery, Sternen oder Karten.
10. Ein verlorener Boss lässt die Region `contested`; eine Übungsreise und Retry bleiben möglich.
11. Belohnung wird exakt einmal vergeben.
12. Bosszustände besitzen reproduzierbare Tests.

---

# 23. Die zehn Bosse und ihre Schummelmechaniken

## Level 1 – Pirat Kai

**Region:** Garten  
**Fähigkeit:** `Verwirbelter Befehl`

Nach jeder vollständig ausgewerteten Aufgabe tauscht Kai sichtbar zwei noch ungelöste Auftragskarten oder Bezirksmarker.

Regeln:

- bereits gelöste Karte bleibt an ihrem Platz,
- aktuelle Aufgabe bleibt unverändert,
- Animation zeigt Start- und Zielposition,
- kein Tausch während Hilfe/Pause,
- höchstens ein Tausch pro Auswertung,
- auf kleinen Screens nicht mehr als vier sichtbare Auftragskarten.

Lernkonter:

- korrekte Gartenübersetzung aktiviert `Ankerblick`,
- ein markierter Auftrag bleibt für einen Zug fixiert.

## Level 2 – Kapitän Brax

**Region:** Bibliothek  
**Fähigkeit:** `Wanderndes Pulverfass`

Von Kampfbeginn an liegt genau ein persistenter `?`-Marker auf einem freien taktischen Feld.

Beim Auslösen:

- kurzer, sichtbarer Druckeffekt,
- kleine Zusatzfrage oder Verlust einer Taktikkraft,
- Marker wandert auf ein anderes freies Feld.

Regeln:

- nie auf dem Prüfen-/Pause-/Hilfe-Button,
- nie über Satztext,
- genau ein Marker,
- Hilfe darf ihn nicht löschen oder neu würfeln.

Lernkonter:

- ein korrekt zusammengesetzter Bibliothekssatz entschärft ihn für eine Runde.

## Level 3 – Blackfinn

**Region:** Tierwelt  
**Fähigkeit:** `Nebel der falschen Spur`

Blackfinn verdeckt wiederholt genau eine gegnerische Absicht oder Seeroute.

Regeln:

- Aufgabe selbst bleibt sichtbar,
- Nebel ist klar als taktische Unsicherheit markiert,
- er kann wiederkehren,
- keine verdeckte richtige Antwort.

Lernkonter:

- eine korrekte Tier-/Eigenschaftsübersetzung führt eine Scout-Aktion aus und entfernt den Nebel für den aktuellen Zug.

## Level 4 – Alt-Kapitän Roderick

**Region:** Zuhause  
**Fähigkeit:** `Revanchefluch`

Roderick zieht passende Concepts aus der tatsächlichen Fehlerhistorie des Spielers.

Regeln:

- nur fachlich vorhandene und versionierte Inhalte,
- Fluch bleibt über seine drei Versuche bestehen,
- er kann bekannte taktische Marker verschieben,
- Help darf ihn nicht unabsichtlich resetten,
- keine endlose Wiederholung desselben Fehlers.

Lernkonter:

- wird ein Revenge-Satz korrekt gelöst, verliert Roderick einen zusätzlichen Schildpunkt.

## Level 5 – Piratenbaron Vargas

**Region:** Familie  
**Fähigkeit:** `Tribut der Tiefe`

Vargas stiehlt eine temporäre Befehlsperle.

Regeln:

- niemals permanente Muscheln oder Echtgeldwallet,
- sichtbar angekündigt,
- wiederholbar, aber mit Cooldown,
- überlebt Hilfe/Pause unverändert.

Lernkonter:

- eine Treasure Sentence über Familie/Personen holt die Perle zurück.

## Level 6 – Kapitän Ironhook

**Region:** Körper  
**Fähigkeit:** `Kettenblockade`

Ironhook sperrt eine Seeroute, einen Helferslot oder eine Taktikkarte.

Regeln:

- immer nur ein primäres Ziel gleichzeitig,
- sichtbare Kette,
- keine Sperre des einzigen verfügbaren Antwortwegs,
- wiederholbar,
- state-sicher bei Reload.

Lernkonter:

- ein korrekt gebauter Satz „bricht“ die Kette.

## Level 7 – Admiral Thorne

**Region:** Unterwegs  
**Fähigkeit:** `Doppelziel`

Thorne markiert zwei angrenzende Gebiete. Vor dem gegnerischen Zug wird klar gezeigt, dass eines oder beide unter Druck geraten können.

Regeln:

- volle Zug-Telegraphie,
- keine Überraschungsübernahme,
- maximal zwei Ziele,
- Verteidigungsentscheidung bleibt zugänglich.

Lernkonter:

- eine korrekte Richtungs-/Reiseübersetzung gibt einen Schutzschild für eines der Ziele.

## Level 8 – Kartenmeister Corvin

**Region:** Bewegung  
**Fähigkeit:** `Kartendrehung`

Corvin verschiebt in der lokalen 3×3-Taktikkarte eine echte Reihe oder Spalte.

Regeln:

- Adjazenz wird danach korrekt neu berechnet,
- deutliche Animation,
- Eingaben während der Animation gesperrt,
- keine überlappenden Nodes,
- wiederholbar,
- Hilfe-/Pause-sicher.

Lernkonter:

- ein korrekter Bewegungs-/Verbsatz erlaubt eine Gegenverschiebung oder fixiert eine Reihe.

## Level 9 – Schattenfürst Azrak

**Region:** Hafen  
**Fähigkeit:** `Wandernder Schatten`

Von Kampfbeginn an existiert genau ein persistenter Schattenmarker.

Regeln:

- Marker wandert nach Auslösung,
- nie über Sprachtext oder Primäraktion,
- Hilfe darf ihn nicht entfernen oder neu würfeln,
- höchstens ein Schatten,
- Zustand wird gespeichert.

Lernkonter:

- eine korrekt gelöste Hafen-Mischaufgabe enthüllt den Marker vor dem nächsten Zug.

## Level 10 – Piratenkönig Varkos

**Region:** Kronenschloss  
**Fähigkeit:** `Krone des Chaos`

Mehrphasiger Finalboss:

### Phase 1 – Tausch

Sichtbarer Auftragstausch nach Kai-Prinzip.

### Phase 2 – Kette und Marker

Eine Kettenblockade plus ein klarer Gefahrenmarker.

### Phase 3 – Formation

Eine echte Rasterverschiebung nach Corvin-Prinzip.

### Phase 4 – Crown Sentence

Mehrteiliger Satz mit Konnektor, aber ohne unfaire Zeitknappheit.

Regeln:

- maximal zwei aktive Gefahren,
- jede Phase besitzt eigenes Intro,
- Phase wechselt erst nach vollständig beendeter Auflösung,
- keine zufällige Kombination, die den Satz unlösbar macht,
- finaler Sieg nur durch korrekte Crown Sentence,
- Niederlage löscht keinen Kampagnenfortschritt.

---

# 24. Belohnungen, Progression und Wiederspielwert

## 24.1 Bestehende Host-Belohnungen

- XP,
- Muscheln,
- Übungssterne,
- Mastery-Sterne,
- Streak-Fortschritt,
- optionale Deko-/Outfit-Freischaltungen.

## 24.2 Kampagnenbelohnungen

- Kronensiegel,
- neue Route,
- neue Karte,
- neuer Helferbonus,
- Boss-Trophäe,
- Regionenbanner,
- neue Turniermodifikatoren.

## 24.3 Perks aus vorhandenen Spielideen

Mögliche Perks:

- Goldener Kompass: schwacher Hinweis,
- Muschelmagnet: kleine Zusatzbelohnung,
- Schutzschild: ein Druckpunkt abgefangen,
- Zeitmuschel: optionaler Timerbonus,
- Kombokette: Combo bleibt einmal erhalten,
- Piratenblick: Intent wird früher gezeigt,
- Doppelter Schatz: nur auf klar definierte, nicht kaufbare Erstbelohnung.

## 24.4 Kein Pay-to-Win

Perks werden erspielt. Kaufbare kosmetische Inhalte dürfen keine Lern- oder Siegchance erhöhen.

---

# 25. Niederlage, Rückschläge und Motivation

## 25.1 Begegnungsniederlage

Anzeige:

- wie viele Aufgaben gelöst wurden,
- welche Concepts stärker wurden,
- beste Combo,
- welche Route fast gewonnen wurde,
- Vorschlag für Übungsreise,
- klarer Retry.

## 25.2 Bossniederlage

- normale Gebiete bleiben erhalten,
- Bossregion bleibt `contested`,
- Boss-HP wird für einen neuen Versuch regulär zurückgesetzt,
- Fehlerwörter wandern in Übungsreise,
- keine beschämende Niederlageninszenierung.

## 25.3 Motivationsprinzip

Der Endscreen sagt nicht:

> „Du hast alles verloren.“

Sondern beispielsweise:

> „Du hast 8 Wörter gemeistert und Kai schon zwei Kronenschilde genommen. Mit einer kurzen Garten-Übung bist du bereit für die Revanche.“

---

# 26. Bildschirm- und UX-Architektur

## 26.1 Pflichtscreens

1. Loading / Asset Check  
2. Titel / Fortsetzen  
3. Sprachpaar und Schwierigkeitsmodus  
4. Kampagnenkarte  
5. Regionsdetail  
6. Lokale Regionskarte  
7. Planungsdock  
8. Helfer-/Kartenauswahl  
9. Gegnerintent  
10. Übersetzungsaufgabe  
11. Word Scramble  
12. Satzbau  
13. Richtiges Feedback  
14. Falsches Feedback  
15. Taktische Auflösung  
16. Gegnerzug  
17. Turnierintro  
18. Turnier  
19. Bossintro  
20. Bosskampf  
21. Gebiet gewonnen  
22. Belohnung/Perk  
23. Pause  
24. Hilfe  
25. Save-Recovery  
26. Begegnungsniederlage  
27. Kampagnenfinale  
28. Einstellungen / Reduced Motion / Audio  

## 26.2 Aktiver Challenge-Screen

Prioritätsreihenfolge:

1. Aufgabe,
2. Antwortbereich,
3. Prüfen-/Primäraktion,
4. Feedback,
5. Boss-/Gegnerstatus,
6. Tula,
7. sekundäre Kampagneninfos.

Dekoration darf diese Reihenfolge nicht umkehren.

## 26.3 Boss-Screen

Nach dem Intro:

- Boss kompakt, aber gut sichtbar,
- Level und Name,
- HP,
- Fähigkeit als einzeilige Erinnerung,
- Aufgabe bleibt dominant,
- Bossroadmap optional außerhalb des aktiven Satzbauzustands.

---

# 27. Mobile- und Desktop-Komposition

## 27.1 Pflichtviewports

```text
375 × 667
390 × 844
430 × 932
1440 × 900
```

Zusätzlich:

- Landscape auf aktuellem iPhone-ähnlichem Viewport,
- 200 Prozent Zoom/Reflow,
- längere deutsche, spanische und griechische Texte.

## 27.2 Mobile-Regeln

- aktiver Challenge-Zustand möglichst ohne vertikales Scrollen,
- Kartenansicht darf bewusst pan-/zoombar sein,
- Hauptbutton immer erreichbar,
- ungefähr 44×44 CSS-Pixel für zentrale Touchziele,
- Safe Area oben und unten,
- kein horizontaler Body-Scroll,
- kein Boss über Satz-Tokens,
- Bottom Sheets passen vollständig,
- Drag & Drop mit Tippalternative,
- keine Hover-Abhängigkeit.

## 27.3 Desktop-Regeln

- keine Überlagerung von Tula, Boss und Challenge,
- Kartenfläche und Informationspanel getrennt,
- lange Texte skalieren nicht unlesbar klein,
- Maus und Tastatur funktionieren,
- keine leeren riesigen Bereiche durch bloßes Hochskalieren der Mobileansicht.

## 27.4 Pause

Pause muss erhalten:

- aktuelle Aufgabe,
- Tokenreihenfolge,
- Kartenhand,
- Wortkraft,
- Combo,
- Gegnerintent,
- Bossphase,
- Markerpositionen,
- RNG-Zustand,
- Timer,
- Audio-/Animationszustand.

Nach `Weiter` wird exakt fortgesetzt.

---

# 28. Visuelles Designsystem

## 28.1 Aktuelle Design-Tokens

Die aktuelle Host-Registry enthält:

```text
marine900  #062D4C
marine800  #0A416A
marine700  #115D8D
sea500     #4EA8C9
sea200     #DDF3FA
white      #FFFFFF
ivory      #F8F6EF
sand       #E9E1D2
gold500    #D5A63A
gold300    #E8C66D
coral      #E7826B
success    #3E9B7A
warning    #D9A441
```

Radii:

```text
small  14
medium 22
large  32
pill   999
```

Motion:

```text
fast    140 ms
normal  240 ms
slow    480 ms
reduced 0 ms
```

Diese Werte werden über Adapter/Token importiert und nicht als konkurrierende Palette dupliziert.

## 28.2 Art Direction

- hochwertige freundliche Anime-/Adventure-Inselwelt,
- Marineblau, Türkis, Perlmutt, Gold und Creme,
- klare Materiallogik,
- warme Lichtakzente,
- keine generische Strategie-UI,
- keine militärisch-realistische Darstellung,
- kein „billiger HTML-Demo“-Look.

## 28.3 Rastergrafik und HTML/CSS

Rastergrafiken enthalten:

- Welt,
- Figuren,
- Gegenstände,
- atmosphärische Kulisse.

HTML/CSS/SVG enthalten:

- Buttons,
- Labels,
- HP,
- Text,
- Besitzstatus,
- Seerouten,
- Interaktionspunkte,
- Fokuszustände.

Kein Text wird in Weltbilder eingebrannt.

---

# 29. Tula, Figureninszenierung und Animation

## 29.1 Tula-Zustände

| Ereignis | Pose |
|---|---|
| Start / Begrüßung | `waving` |
| neutrale Karte | `neutral` |
| Spieler überlegt | `thinking` |
| Audio läuft | `listening` |
| Tula erklärt | `speaking` |
| richtig | `happy` |
| Boss schummelt | `surprised` |
| Pause / idle | `neutral` oder `sleeping` |
| Sieg / Region gewonnen | `celebrating` |

## 29.2 Bossanimationen

- Intro: sanfter Auftritt und Glow,
- richtig: Boss reagiert überrascht/defensiv,
- falsch: kurze Lach-/Triumphreaktion,
- Fähigkeit: klare, kurze Animation,
- Treffer: kein hektisches Dauerwackeln,
- Reduced Motion: statischer Zustandswechsel.

## 29.3 Performance-Regel

Keine ungebremsten Daueranimationen. Timer, Listener und Partikel werden beim State-Wechsel sauber beendet.

---

# 30. Verbindliches Asset-Inventar

## 30.1 Große Inselkarte

Dropbox-Quelle:

```text
/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Maps/map_turtle_island_overview.webp
```

Aktueller Host-Runtimepfad:

```text
assets/creative/map_turtle_island_overview.webp
```

## 30.2 Weltkulissen

Dropbox-Ordner:

```text
/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Worlds/
```

Dateien:

```text
world_garden.webp
world_library.webp
world_jungle_trail.webp
world_sun_bay.webp
world_coral_reef.webp
world_crystal_cove.webp
world_desert_oasis.webp
world_ice_peak.webp
world_harbor.webp
world_castle.webp
```

## 30.3 Tula

Dropbox-Ordner:

```text
/[LinguaTurtle]/03_Bilder_und_Design/01_Characters/Tula/Web/
```

Dateien:

```text
tula_profile.webp
tula_celebrating.webp
tula_listening.webp
tula_thinking.webp
tula_happy.webp
tula_surprised.webp
tula_neutral_front.webp
tula_sleeping.webp
tula_waving.webp
tula_speaking.webp
```

## 30.4 Bosse

Dropbox-Ordner:

```text
/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/
```

Originaldateien:

```text
Level 1 - Pirat Kai.png
Level 2 - Kapitän Brax.png
Level 3 - Blackfinn.png
Level 4 - Alt-Kapitän Roderick.png
Level 5 - Piratenbaron Vargas.png
Level 6 - Kapitän Ironhook.png
Level 7 - Admiral Thorne.png
Level 8 - Kartenmeister Corvin.png
Level 9 - Schattenfürst Azrak.png
Level 10 - Piratenkönig Varkos.png
```

Vorgeschlagene Runtime-Derivate:

```text
boss-01-pirat-kai.webp
boss-02-kapitaen-brax.webp
boss-03-blackfinn.webp
boss-04-alt-kapitaen-roderick.webp
boss-05-piratenbaron-vargas.webp
boss-06-kapitaen-ironhook.webp
boss-07-admiral-thorne.webp
boss-08-kartenmeister-corvin.webp
boss-09-schattenfuerst-azrak.webp
boss-10-piratenkoenig-varkos.webp
```

## 30.5 Kartenmonster

Dropbox-Ordner:

```text
/[LinguaTurtle]/[Spielkartenmonster]/
```

Dateien:

```text
01-neri-meereskundschafter.png
02-pompi-apfelgeist.png
03-wavi-wellengeist.png
04-mira-herzhueterin.png
05-soli-sonnengeist.png
06-lexi-runengelehrter.png
07-krax-sprintkrabbler.png
08-moa-inselwaechter.png
SPRITE_MANIFEST.md
```

## 30.6 Gegner

Kanonisches Manifest:

```text
/[LinguaTurtle]/[Gegner]/SPRITE_MANIFEST.md
```

Das Manifest definiert die Gegnernamen und Rollen. Falls die Binärdateien nicht in diesem Dropbox-Ordner liegen, müssen die realen Runtime-Assets im zuständigen Spielrepo gesucht und dokumentiert werden. Es darf kein erfundener Pfad und kein billiger Placeholder stillschweigend eingesetzt werden.

## 30.7 Helfer

Kanonisches Manifest:

```text
/[LinguaTurtle]/[Gehilfen]/GEHILFEN_MANIFEST.md
```

Bekannte Runtimequelle:

```text
o-some/wordbound-battle/src/assets/helpers/
```

Vor Kopie muss der tatsächlich aktuelle Pfad geprüft werden.

## 30.8 Rewards

Dropbox-Ordner:

```text
/[LinguaTurtle]/03_Bilder_und_Design/04_UI_Assets/Web/Rewards/
```

Relevante Assets:

- Muscheln,
- XP-Stern,
- Streak-Flamme,
- Bronze-/Silber-/Gold-/Juwelenkisten.

---

# 31. Asset-Pipeline und Provenienz

## 31.1 Grundprozess

```text
Quelle inventarisieren
→ Original unverändert lassen
→ Hash erfassen
→ Kopie/Derivat erzeugen
→ auf WebP optimieren
→ visuell vergleichen
→ Runtimepfad registrieren
→ 404-Check
→ Viewport-Test
→ Asset-Manifest aktualisieren
```

## 31.2 Kein Runtime-Hotlinking

Dropbox wird nur als Quelle genutzt. Runtime-Assets liegen im Repository oder werden über einen versionierten Host-Assetadapter bereitgestellt.

## 31.3 Asset-Manifest

Jeder Eintrag enthält:

```yaml
id:
source_path:
source_file_id:
source_sha256:
derivative_path:
derivative_sha256:
format:
dimensions:
purpose:
crop_mode:
transparent:
approval_status:
used_in:
```

## 31.4 Originalschutz

- niemals Originale löschen,
- niemals Originale überschreiben,
- keine destruktive Stapelkonvertierung,
- vor Konvertierung Sicherung/Hash,
- Dateinamen nur bei Derivaten normalisieren.

## 31.5 Kartenkoordinaten

Die interaktiven Regionskoordinaten werden aus dem realen Kartenasset vermessen. Keine Koordinaten aus Erinnerung oder Screenshot raten.

---

# 32. Audio, Haptik und Reduced Motion

## 32.1 Audio-Grundsatz

Das komplette Spiel muss ohne Audio funktionieren.

Optional:

- TTS nach korrekter Lösung,
- Vorlesen der Aufgabe,
- Boss-Stinger,
- UI-Sounds,
- Karten-/Wellen-Sounds.

Audio wird über den bestehenden Host-Audioadapter eingebunden und kann deaktiviert werden.

## 32.2 Keine erzwungene Sprachausgabe

Da frühere Spiele teilweise ausdrücklich ohne Audio gestaltet wurden, ist Audio ein Feature Flag und keine Kernabhängigkeit.

## 32.3 Haptik

Auf nativen Geräten optional:

- leichte Bestätigung,
- sanfte Warnung,
- Bossphasenwechsel.

Keine Dauerhaptik.

## 32.4 Reduced Motion

Bei `prefers-reduced-motion`:

- Partikel deaktivieren,
- Kartenverschiebung als kurzer Zustandswechsel,
- kein Screen Shake,
- keine unendlichen Glows,
- Fokus und Feedback bleiben vollständig verständlich.

---

# 33. Barrierearmut und Kindersicherheit

## 33.1 Eingabe

- Touch,
- Maus,
- Tastatur,
- Nicht-Drag-Alternative,
- sichtbarer Fokus,
- semantische Buttons.

## 33.2 Lesbarkeit

- ausreichender Kontrast,
- keine Schrift unter sinnvolle Mindestgröße drücken,
- lange Übersetzungen umbrechen,
- griechische Zeichen vollständig unterstützen,
- keine Information nur durch Farbe.

## 33.3 Kindersicherheit

- kein offener Chat,
- keine öffentliche Rangliste,
- keine manipulativen Daily-Loss-Drohungen,
- keine Fremdwerbung im Web,
- Eltern-Gate für externe oder monetäre Aktionen,
- keine personenbezogene Telemetrie ohne Notwendigkeit.

## 33.4 Zeitdruck

Timer nur in optionalen Modi oder klar begrenzten Bossphasen. Es gibt eine geschützte Lesezeit. Timer stoppt in Hilfe und Pause.

---

# 34. Technische Zielarchitektur

## 34.1 Standalone zuerst, integrierbar bleiben

Empfehlung:

- neues Standalone-Repo,
- Vite,
- TypeScript Strict Mode für den neuen Game Core,
- DOM/CSS/SVG,
- kein schweres Game-Framework ohne nachgewiesene Notwendigkeit,
- späterer Host-Mount.

Die Haupt-App wird nicht auf TypeScript migriert. Der neue Build stellt ein sauberes ES-Modul bereit.

## 34.2 Mount-Vertrag

```ts
mountCrownOfWords(root, {
  content,
  progress,
  rewards,
  audio,
  assets,
  storage,
  analytics,
  navigation,
  platform
})
```

## 34.3 Trennung

```text
Game Core
  keine DOM-Imports
  keine CSS-Abhängigkeit
  kein Supabase
  kein localStorage
  kein App Store
  kein Analytics-SDK

Presentation
  Screens
  Komponenten
  Animation
  Input

Adapters
  Host-Content
  Host-Storage
  Host-Rewards
  Host-Audio
  Asset-Registry
  Analytics
```

## 34.4 Kein Frameworkwechsel im Host

Das Spiel darf Astro-kompatibel sein, indem es über einen Mount-Vertrag funktioniert. Es darf die bestehende Tula’s-Island-App nicht zu Astro, React oder einer anderen Architektur zwingen.

---

# 35. Repository- und Ordnerstruktur

Vorgeschlagene Standalone-Struktur:

```text
crown-of-words/
├── .masterbrain/
│   ├── game-design.yml
│   ├── impact-scope.yml
│   ├── game-quality.yml
│   └── game-evidence/
├── docs/
│   ├── CROWN_OF_WORDS_MASTER_SPEC.md
│   ├── ASSET_MANIFEST.md
│   ├── CONTENT_CONTRACT.md
│   ├── SAVEGAME_COMPATIBILITY.md
│   └── TEST_CHECKLIST.md
├── public/
│   └── assets/
│       ├── map/
│       ├── worlds/
│       ├── tula/
│       ├── bosses/
│       ├── enemies/
│       ├── helpers/
│       ├── cards/
│       └── rewards/
├── src/
│   ├── game/
│   │   ├── core/
│   │   │   ├── state-machine.ts
│   │   │   ├── reducer.ts
│   │   │   ├── events.ts
│   │   │   ├── commands.ts
│   │   │   └── seeded-rng.ts
│   │   ├── campaign/
│   │   │   ├── map-graph.ts
│   │   │   ├── turn-engine.ts
│   │   │   ├── conquest-engine.ts
│   │   │   ├── supply-engine.ts
│   │   │   └── ai-director.ts
│   │   ├── learning/
│   │   │   ├── challenge-engine.ts
│   │   │   ├── resolution.ts
│   │   │   ├── mastery.ts
│   │   │   └── contracts.ts
│   │   ├── bosses/
│   │   │   ├── registry.ts
│   │   │   └── abilities/
│   │   ├── cards/
│   │   │   ├── deck-engine.ts
│   │   │   └── registry.ts
│   │   └── save/
│   │       ├── schema.ts
│   │       └── migrations.ts
│   ├── presentation/
│   │   ├── mount.ts
│   │   ├── screens/
│   │   ├── components/
│   │   ├── input/
│   │   └── animation-controller.ts
│   ├── adapters/
│   │   ├── standalone-content.ts
│   │   ├── host-content.ts
│   │   ├── standalone-storage.ts
│   │   ├── host-storage.ts
│   │   ├── host-rewards.ts
│   │   └── asset-registry.ts
│   ├── content/
│   │   ├── campaign-map.ts
│   │   ├── regions.ts
│   │   ├── bosses.ts
│   │   └── i18n/
│   └── styles/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── package.json
├── vite.config.ts
└── README.md
```

Spätere Host-Integration:

```text
src/v3/games/crown-of-words/
```

Nur nach eigenem Integrations-Branch und Regression der Haupt-App.

---

# 36. State Machine

## 36.1 Hauptzustände

```text
BOOT
LOADING
TITLE
LANGUAGE_SELECT
CAMPAIGN_MAP
REGION_OVERVIEW
REGION_MAP
PLANNING
DECK_SELECT
ENEMY_INTENT
CHALLENGE_INTRO
CHALLENGE_ACTIVE
FEEDBACK_CORRECT
FEEDBACK_WRONG
TACTICAL_RESOLUTION
ENEMY_TURN
TOURNAMENT_INTRO
TOURNAMENT_ACTIVE
BOSS_INTRO
BOSS_ACTIVE
BOSS_PHASE_TRANSITION
ENCOUNTER_VICTORY
ENCOUNTER_DEFEAT
REGION_CAPTURED
REWARD
PAUSED
HELP
SAVE_RECOVERY
CAMPAIGN_VICTORY
SETTINGS
EXITING
```

## 36.2 Wichtige Invarianten

- Eine Challenge besitzt eine eindeutige `attemptId`.
- Eine Auswertung besitzt eine eindeutige `resolutionEventId`.
- Dieselbe Auswertung kann nicht zweimal belohnen.
- Während Feedback ist Eingabe gesperrt.
- Während Bossanimation ist Eingabe gesperrt.
- Pause und Help frieren alle zeitabhängigen Systeme.
- Nach Reload wird entweder der letzte stabile Checkpoint oder die exakt gespeicherte Challenge wiederhergestellt.
- Kein State darf gleichzeitig `PAUSED` und aktiv tickend sein.

## 36.3 Ereignisbeispiele

```text
APP_READY
CAMPAIGN_STARTED
REGION_SELECTED
ACTION_CONFIRMED
HELPER_SELECTED
CARD_SELECTED
CHALLENGE_STARTED
ANSWER_SUBMITTED
ANSWER_RESOLVED
HINT_USED
CARD_PLAYED
BOSS_ABILITY_TELEGRAPHED
BOSS_ABILITY_RESOLVED
TURN_ENDED
ENEMY_ACTION_RESOLVED
REGION_CAPTURED
REWARD_GRANTED
PAUSE_REQUESTED
RESUME_REQUESTED
SAVE_RESTORED
```

---

# 37. Datenmodelle und Verträge

## 37.1 Region

```ts
interface RegionDefinition {
  id: string;
  order: number;
  titleKey: string;
  themeId: string;
  worldAssetId: string;
  bossId: string;
  territoryIds: string[];
  adjacentRegionIds: string[];
  unlockRule: UnlockRule;
  strategicBonus: StrategicBonus;
}
```

## 37.2 Gebiet

```ts
interface TerritoryState {
  id: string;
  regionId: string;
  status:
    | 'locked'
    | 'neutral'
    | 'scouted'
    | 'contested'
    | 'controlled'
    | 'mastered';
  ownerId: string | null;
  stars: 0 | 1 | 2 | 3;
  supply: number;
  activeThreatIds: string[];
}
```

## 37.3 Challenge

```ts
interface LanguageChallenge {
  id: string;
  attemptId: string;
  conceptIds: string[];
  type:
    | 'translation'
    | 'scramble'
    | 'sentence_build'
    | 'gap'
    | 'repair'
    | 'category'
    | 'memory_intel'
    | 'reading';
  sourceLanguage: string;
  targetLanguage: string;
  difficulty: string;
  prompt: LocalizedContentRef;
  answerContract: AnswerContract;
  hintPlan: HintStep[];
  contentVersion: string;
}
```

## 37.4 Antwortauflösung

```ts
interface ChallengeResolution {
  resolutionEventId: string;
  attemptId: string;
  status: 'first_try' | 'after_hint' | 'corrected' | 'revealed' | 'skipped';
  correct: boolean;
  wordPower: 0 | 1 | 2 | 3;
  pressureDelta: number;
  masteryEvents: MasteryEvent[];
  feedbackKey: string;
}
```

## 37.5 Bosszustand

```ts
interface BossEncounterState {
  bossId: string;
  phase: number;
  hp: number;
  maxHp: number;
  misses: number;
  abilityState: Record<string, unknown>;
  telegraphComplete: boolean;
  activeHazardIds: string[];
  rngState: string;
}
```

## 37.6 Savegame

```ts
interface CrownOfWordsSave {
  schemaVersion: number;
  gameVersion: string;
  contentVersion: string;
  assetVersion: string;
  campaign: CampaignState;
  learning: LearningSnapshot;
  deck: DeckSnapshot;
  pendingRewardEventIds: string[];
  lastStableCheckpoint: StableCheckpoint;
}
```

---

# 38. Host-App-Integration

## 38.1 Content

Das Spiel fragt den Host nach Challenges. Es kopiert nicht den gesamten Contentbestand.

## 38.2 Progress

Mastery-Events werden über einen Adapter an die Host-Progression gemeldet.

## 38.3 Rewards

Belohnungen verwenden stabile Event-IDs und den vorhandenen Reward-/Ledgerpfad.

## 38.4 Storage

Der Game Core schreibt nicht direkt in `localStorage`. Standalone- und Host-Adapter implementieren denselben Vertrag.

## 38.5 Economy

Keine direkte Wallet-Mutation. Muscheln werden ausschließlich über den vorgesehenen Rewardadapter gutgeschrieben.

## 38.6 Navigation

Host-Navigation kann das Spiel mounten, pausieren, verlassen und wiederherstellen. Die laufende Session bleibt gerätespezifisch.

---

# 39. Offline, Saves und Idempotenz

## 39.1 Checkpoints

Speichern:

- am Rundenende,
- nach Challenge-Auswertung,
- vor Bossphasenwechsel,
- nach Bossphasenwechsel,
- nach Gebietseroberung,
- vor Belohnungsvergabe,
- nach bestätigter Belohnungsvergabe.

## 39.2 Reward-Idempotenz

```text
campaignId + regionId + encounterId + rewardType + firstClearVersion
```

bildet eine stabile Event-ID.

## 39.3 Reload

Nach Reload:

- kein doppelter Gegnerzug,
- keine doppelte Belohnung,
- keine doppelte Antwort,
- Marker an gleicher Stelle,
- RNG setzt deterministisch fort,
- aktuelle Tokenreihenfolge bleibt erhalten oder stabiler Checkpoint wird geladen.

## 39.4 Kompatibilität

Versionieren:

- Savegame-Schema,
- Content-Bundle,
- Asset-Bundle,
- Eventvertrag,
- Spielversion.

Inkompatible Saves erhalten Migration oder sicheren Fallback. Sie werden nie stillschweigend gelöscht.

---

# 40. Performance- und Stabilitätsbudgets

## 40.1 Asset-Laden

- große Karte einmal,
- aktuelle Welt lazy laden,
- nächster Boss optional vorladen,
- nicht alle zehn Weltbilder gleichzeitig im DOM,
- WebP für Runtime,
- transparente Boss-Sprites optimieren.

## 40.2 Animation

- keine unendlichen Partikelsysteme,
- maximal notwendige Layer,
- CSS-Transform/Opacity bevorzugen,
- keine Layout-Thrashing-Schleifen,
- AnimationController besitzt Cleanup.

## 40.3 Listener und Timer

Jeder State registriert nur die benötigten Listener. State-Exit räumt auf.

## 40.4 Messbehauptungen

Keine FPS-, RAM- oder Akkuangabe ohne echte Messung. Browser-Mobile-Viewport ist kein Real-Device-Test.

---

# 41. Datenschutzfreundliche Telemetrie

Optional messbar:

- Challenge gestartet,
- Challenge korrekt/falsch,
- Hint-Stufe,
- Aufgabentyp,
- Region,
- Bossphase,
- Abbruchzustand,
- technische Fehlermeldung,
- Performance-Marker ohne personenbezogene Daten.

Nicht erfassen:

- freie Kindertexte,
- Mikrofonaufnahmen ohne klare Funktion/Freigabe,
- öffentliche Namen,
- unnötige Gerätefingerprints,
- Lernprofil für Werbezwecke.

---

# 42. MVP: vollständiger Vertical Slice

Der erste Vertical Slice umfasst ausschließlich:

## 42.1 Inhalte

- Titel-/Startscreen,
- Sprachpaarwahl,
- Entdecker/Kapitän,
- Archipelkarte mit allen zehn sichtbaren Regionen,
- nur Garten aktiv,
- lokale Gartenkarte,
- drei Vorbezirke,
- ein Gartenturnier,
- Pirat Kai,
- mindestens:
  - Übersetzung,
  - Word Scramble,
  - Satzbau,
- ein Helfer,
- vier Karten,
- ein normaler Gegner,
- Wortkraft/Taktikkraft,
- Gegnerzug,
- Pause/Resume,
- Hilfe,
- Save/Reload,
- Gebietseroberung,
- Sterne und Erstbelohnung,
- Rückkehr zur Karte.

## 42.2 Nicht im ersten Vertical Slice

- alle zehn vollständig spielbaren Regionen,
- mehrere KI-Fraktionen,
- Multiplayer,
- Echtgeld,
- vollständige native Integration,
- komplexe Tech-Trees,
- alle Perks.

## 42.3 Vertical-Slice-Abnahme

Der Slice ist erst akzeptiert, wenn ein Kind beziehungsweise Reviewer den vollständigen Weg vom Start bis zur Garten-Eroberung spielen kann und die Lernaufgaben dabei verständlich, lösbar und dominant bleiben.

---

# 43. Die ersten fünf Spielminuten

1. Das Spiel öffnet mit Tula und der Krone der Wörter.
2. Der Spieler wählt zum Beispiel Deutsch → Englisch.
3. Tula erklärt in maximal drei kurzen Schritten:
   - Wähle ein Gebiet.
   - Löse Wörter und Sätze.
   - Gewinne das Turnier.
4. Die Karte zeigt zehn Regionen. Der Garten leuchtet.
5. Der Spieler tippt auf den Garten.
6. Bottom Sheet zeigt:
   - Thema,
   - Pirat Kai,
   - mögliche Belohnung,
   - Button `Anlegen`.
7. Niko bewacht die Anlegestelle.
8. Erste Übersetzung wird gelöst.
9. Der Spieler erhält Wortkraft.
10. Eine Kartenfähigkeit wird durch eine zweite Sprachfrage freigeschaltet.
11. Ein kurzer Gegnerzug wird sichtbar aufgelöst.
12. In der Gartenwerkstatt baut der Spieler einen Satz.
13. Das regionale Turnier startet.
14. Nach der Crown Sentence erscheint Kai.
15. Kai erklärt seinen sichtbaren Kartentausch.
16. Nach jeder Aufgabe tauscht er zwei ungelöste Aufträge.
17. Der Spieler besiegt Kai.
18. Der Garten wird gold/türkis markiert.
19. Tula feiert.
20. Belohnung und nächster möglicher Weg werden gezeigt.

---

# 44. Branch- und Release-Plan

## Branch 0 – Safety / Baseline

Ziel:

- exaktes Zielrepo prüfen,
- aktuellen `main`-SHA dokumentieren,
- uncommitted work prüfen,
- Rollback-Punkt setzen,
- keine Featureänderung.

Evidence:

- Baseline,
- Branchname,
- Backup/Tag,
- aktueller Build-/Teststatus.

**Danach stoppen und prüfen.**

## Branch 1 – Contracts / Scaffold

- Master-Spec ins Repo,
- `.masterbrain/game-design.yml`,
- `.masterbrain/impact-scope.yml`,
- minimale Vite-Struktur,
- keine breite Spiellogik.

**Danach stoppen und prüfen.**

## Branch 2 – Asset Registry

- Map, Garten, Tula, Kai und Rewards importieren,
- Hashes und Provenienz,
- keine anderen Bosse blind kopieren,
- Asset-404-Test.

**Danach stoppen und prüfen.**

## Branch 3 – Pure Campaign Core

- Mapgraph,
- Region-/Gebietszustände,
- Runden,
- seedbare KI-Grundlage,
- Unit-Tests,
- keine visuelle Breite.

**Danach stoppen und prüfen.**

## Branch 4 – Learning Contract

- Challenge-Adapter,
- genau-einmal-Auswertung,
- Wortkraft,
- Mastery-Events,
- Übersetzung, Scramble, Satzbau.

**Danach stoppen und prüfen.**

## Branch 5 – Garden/Kai Vertical Slice

- komplette erste Region,
- Niko,
- Turnier,
- Kai-Fähigkeit,
- Sieg/Niederlage,
- Pause/Help/Save.

**Danach stoppen und prüfen.**

## Branch 6 – PlayBrain / Visual Gate

- tatsächlicher Playtest,
- Mobile/Desktop,
- Correct/Wrong,
- Boss,
- Reload,
- Screenshot-Evidence,
- Quality Score.

Kein weiterer Contentausbau vor bestandenem Gate.

## Branch 7 – Karten und Helfer

- Vier-Karten-Hand,
- einheitliche Kartenverträge,
- Helfer,
- Accessibility-Alternative.

## Branch 8 – Gegner-KI

- acht Gegnerarchetypen,
- sichtbare Intents,
- Versorgung,
- Verteidigung,
- keine Offline-Züge.

## Branch 9 – Regionen 2 bis 4

- Bibliothek/Brax,
- Tierwelt/Blackfinn,
- Zuhause/Roderick.

## Branch 10 – Regionen 5 bis 8

- Familie/Vargas,
- Körper/Ironhook,
- Unterwegs/Thorne,
- Bewegung/Corvin.

## Branch 11 – Hafen und Schloss

- Hafen/Azrak,
- Schloss/Varkos,
- mehrphasiges Finale,
- Kampagnenabschluss.

## Branch 12 – Host-Integration

- neuer Integrations-Branch,
- Adapter,
- keine Hostmigration,
- Regression der Haupt-App,
- Wallet/Progress/Storage über bestehende Grenzen.

## Branch 13 – Release Härtung

- finaler Playtest,
- unabhängiger Review,
- Candidate-Bindung,
- Preview-Deploy,
- Live Smoke,
- erst danach Releaseentscheidung.

## Branchregeln

- nie zwei Planbranches gleichzeitig,
- vor jedem Branch aktuellen `main` prüfen,
- kleine Diffs,
- keine direkten Writes auf `main`,
- kein Force Push,
- nach jeder finalen Änderung betroffene Tests erneut ausführen,
- kein Merge bei kritischem Blocker,
- andere Tula-Repos nicht anfassen.

---

# 45. Test- und QA-Matrix

## 45.1 Unit Tests

- Mapgraph ist verbunden.
- Nur erlaubte Adjazenzen funktionieren.
- Versorgung propagiert korrekt.
- Kontrollstatus wechselt korrekt.
- Mastery bleibt bei `contested`.
- Lernleistung bleibt mindestens 75 Prozent der maximalen Stärke.
- Strategie allein gewinnt nicht.
- Duplicate `resolutionEventId` wird ignoriert.
- Duplicate Reward wird ignoriert.
- RNG ist mit gleichem Seed reproduzierbar.
- Bossmarker überschreiten nie erlaubte Anzahl.
- Kai verschiebt nur ungelöste Karten.
- Brax besitzt exakt einen Marker.
- Corvin aktualisiert Adjazenz korrekt.
- Azrak besitzt exakt einen Schatten.
- Varkos erzeugt keine unlösbare Kombination.
- Save-Migration funktioniert.

## 45.2 Integration Tests

- Start → Garten → Aufgabe → Sieg.
- falsche Antwort → Feedback → Weiter.
- leichter Hinweis → reduzierte Wortkraft.
- komplette Lösung → kein normaler Erstversuchspunkt.
- Karte korrekt freigeschaltet.
- Karte nach falscher Challenge erschöpft.
- Gegnerzug sichtbar.
- Pause/Resume exakt.
- Hilfe friert Boss.
- Reload während Aufgabe.
- Reload während Boss.
- Bossverlust ohne normalen Fortschrittsverlust.
- Bossgewinn mit einmaliger Belohnung.
- Region wird controlled.
- Replay verbessert Sterne, dupliziert Erstloot nicht.

## 45.3 E2E-Pfade

```text
loading
start
language select
campaign map
region select
first interaction
correct
wrong
hint
pause
resume
enemy turn
tournament
boss intro
boss ability
boss success
boss failure
reward
restart
repeat session
return navigation
```

## 45.4 Viewports

- 375×667 WebKit-like,
- 390×844 WebKit-like,
- 390×844 Chromium-like,
- 430×932,
- 1440×900,
- Landscape.

## 45.5 Input

- Touch,
- Maus,
- Tastatur,
- Tippalternative zu Drag & Drop,
- Invalid Drop,
- Cancel,
- Edge-of-Container,
- Scroll-/Gesture-Konflikt.

## 45.6 Localization

- Deutsch mit langen Komposita,
- Spanisch mit längeren Labels,
- Griechisch mit vollständigem Zeichensatz,
- Englisch,
- künstlich verlängerte Strings,
- 200 Prozent Zoom.

## 45.7 Performance-Beobachtung

- kein sichtbares Jank bei wiederholter Kartenverschiebung,
- keine mehrfachen Listener,
- keine beschleunigten Gegnerzüge nach Restart,
- keine wachsende Timeranzahl,
- keine großen Asset-Stalls,
- FX blockiert keine Eingabe.

## 45.8 Asset-QA

- alle Assets 200/erreichbar,
- keine 404s,
- transparente Boss-Sprites nicht abgeschnitten,
- Tula nicht verzerrt,
- Weltcrop auf Mobile/ Desktop,
- Hashmanifest vollständig.

---

# 46. CAF Quality Gates

Default-Profil:

| Kategorie | Gewicht | Minimum |
|---|---:|---:|
| Technical Stability | 20 % | 95/100 |
| Mobile UX | 20 % | 90/100 |
| Gameplay | 20 % | 85/100 |
| Brand / Visual Quality | 15 % | 90/100 |
| Learning Value | 15 % | 85/100 |
| Performance | 5 % | 85/100 |
| Accessibility / Input | 5 % | 80/100 |

Gesamtziel:

```text
>= 90/100
```

## Kritische Blocker

Unabhängig vom Score blockieren:

- Spiel startet nicht,
- Kerninteraktion unbenutzbar,
- unlösbare oder fachlich falsche Lernaufgabe,
- Sieg/Niederlage/Restart hängt,
- Pause verändert den Run,
- Bossmechanik verdeckt Aufgabe,
- Belohnung wird doppelt vergeben,
- Save beschädigt,
- Host-Wallet oder Progression beschädigt,
- erforderliches Asset fehlt,
- getesteter Kandidat ist nicht der Release-Kandidat,
- notwendiger Mobilepfad bleibt ungetestet.

## Ehrliche Testlabels

```text
REAL DEVICE TESTED
BROWSER MOBILE VIEWPORT TESTED
DESKTOP BROWSER TESTED
NATIVE SIMULATOR TESTED
AUTOMATED RUNTIME TESTED
MANUAL/AGENT PLAYTESTED
NOT TESTED
NOT AVAILABLE
```

---

# 47. Abnahmekriterien

## Produkt

- [ ] Kein Planetensystem sichtbar.
- [ ] Zehn Tula-Regionen vorhanden.
- [ ] Regionswege und Seerouten verständlich.
- [ ] Gebietskontrolle klar sichtbar.
- [ ] Strategische Entscheidung vorhanden.
- [ ] Lernen entscheidet den Ausgang.

## Lernen

- [ ] Übersetzung funktioniert.
- [ ] Word Scramble funktioniert.
- [ ] Satzbau funktioniert.
- [ ] Crown Sentence ist verpflichtend.
- [ ] Fehlerfeedback lehrt.
- [ ] Revenge Words funktionieren.
- [ ] Mastery wird korrekt gemeldet.
- [ ] Kein Sieg ohne Mindestlernleistung.

## Bosse

- [ ] Alle zehn echten Boss-Sprites registriert.
- [ ] Jede Fähigkeit einzigartig.
- [ ] Jede Fähigkeit erklärt.
- [ ] Keine Fähigkeit ändert die richtige Antwort.
- [ ] Keine Fähigkeit verdeckt Aufgabe.
- [ ] Hilfe/Pause/Reload sind sicher.
- [ ] Varkos ist mehrphasig.
- [ ] Bossbelohnung genau einmal.

## UX

- [ ] iPhone-first.
- [ ] aktiver Challenge-Screen ohne unnötiges Scrollen.
- [ ] Touchziele ausreichend.
- [ ] Desktop ohne Überlagerungen.
- [ ] lange Texte getestet.
- [ ] Reduced Motion.
- [ ] Nicht-Drag-Alternative.

## Technik

- [ ] Pure Core.
- [ ] Adaptergrenzen.
- [ ] kein direkter Supabase-/localStorage-Zugriff im Core.
- [ ] Saveversionierung.
- [ ] seedbare KI.
- [ ] stabile Event-IDs.
- [ ] keine monolithische HTML-Datei.
- [ ] Assetmanifest.
- [ ] automatisierte Tests.
- [ ] tatsächlicher Playtest.

---

# 48. Risiken und Gegenmaßnahmen

## Risiko: Zu komplex für Kinder

Gegenmaßnahme:

- Entdecker-Modus,
- nur drei Aktionen,
- progressive Freischaltung,
- visuelle Intents,
- Vertical-Slice-Playtest vor Breite.

## Risiko: Strategie verdrängt Lernen

Gegenmaßnahme:

- mindestens 75 Prozent Lernanteil,
- Crown Sentence zwingend,
- Strategiebonus gedeckelt,
- Learning-Value-Gate.

## Risiko: Karte auf Mobile überladen

Gegenmaßnahme:

- zwei Zoomstufen,
- Regionsliste als Alternative,
- Bottom Sheet,
- aktive Challenge getrennt von Makrokarte.

## Risiko: Bossmechaniken werden unfair

Gegenmaßnahme:

- Fairnessvertrag,
- maximal zwei Gefahren,
- Telegraphed,
- Help-/Pause-Tests,
- property-basierte Bosszustandstests.

## Risiko: Asset-Chaos

Gegenmaßnahme:

- Registry,
- Hashes,
- keine Hotlinks,
- Originalschutz,
- nur aktuelle Region lazy laden.

## Risiko: Host-Regression

Gegenmaßnahme:

- Standalone zuerst,
- Integrations-Branch,
- Adapter,
- Haupt-App-Regression,
- andere Spiele geschützt.

## Risiko: Doppelbelohnung

Gegenmaßnahme:

- stabile Event-ID,
- idempotenter Rewardadapter,
- Save vor/nach Grant,
- Reload-Test.

## Risiko: Offlinezustand divergiert

Gegenmaßnahme:

- keine Offline-KI-Züge,
- monotone Revision über Host,
- stabile Checkpoints,
- Konfliktstrategie dokumentieren.

---

# 49. Zukunftsausbau und Multiplayer-Gate

## 49.1 Mögliche spätere Erweiterungen

- weitere Inseln,
- saisonale Turniere,
- zusätzliche Kartenmonster,
- kooperative Eltern-Kind-Missionen,
- Schulmodus,
- tägliche Übungsroute,
- adaptive Bossdecks,
- neue Sprachen,
- kulturelle Inselgeschichten.

## 49.2 Multiplayer nur separat

Mögliche sichere Varianten:

- lokales Pass-and-Play,
- Eltern-genehmigtes Freundesduell,
- asynchrones Ghost-Deck ohne Livechat,
- private Klassenräume mit Lehrkraft.

Nicht zulässig ohne eigenes Datenschutz-/Moderationskonzept:

- offener Chat,
- öffentliche Profile,
- öffentliche Kinderranglisten,
- fremde Direktnachrichten.

## 49.3 Serverautorität

Bei Multiplayer müssen:

- Züge serverautoritativ,
- Rewards idempotent,
- Matchversionen kompatibel,
- keine Clientmanipulation der Antworten,
- Datenschutz und Elternfreigabe separat abgenommen werden.

---

# 50. Definition of Done

Das Spiel ist erst „fertig“, wenn:

1. Der finale Scope erfüllt ist.
2. Der gesamte Kampagnenpfad spielbar ist.
3. Alle zehn Bosse funktionieren.
4. Alle Pflichtaufgabentypen funktionieren.
5. Jede Region eine klare Lernidentität besitzt.
6. Kein Boss die Sprachwahrheit verändert.
7. Mobile und Desktop geprüft sind.
8. Save/Reload und Offline-Grundfunktion stabil sind.
9. Rewards exakt einmal vergeben werden.
10. Keine kritischen 404s oder Runtimefehler existieren.
11. Der finale Candidate nach der letzten Änderung erneut getestet wurde.
12. Unabhängiger Review PASS oder PASS WITH NOTES ergibt.
13. Quality Score und Kategorie-Minima bestanden sind.
14. Live Smoke nach Deploy bestanden ist.
15. Nicht getestete Punkte ausdrücklich sichtbar bleiben.
16. Andere Spiele und Hostsysteme keine Regression zeigen.

---

# 51. Starter-Dateien für `.masterbrain/`

## 51.1 `.masterbrain/game-design.yml`

```yaml
game:
  name: "Tula's Island – Crown of Words"
  slug: "crown-of-words"
  class: "GAME-NEW"
  genre:
    - "turn-based strategy"
    - "territory control"
    - "language-learning game"
  audience:
    primary: "reading-capable children approximately 6-12"
    modes:
      - "explorer"
      - "captain"
      - "admiral"
  platform:
    - "responsive web"
    - "PWA"
    - "later Capacitor integration"
  orientation:
    primary: "portrait mobile"
    supported:
      - "landscape"
      - "desktop"
  input:
    - "touch"
    - "pointer"
    - "keyboard"
    - "accessible non-drag alternative"

learning:
  objective:
    - "translation"
    - "vocabulary mastery"
    - "sentence construction"
    - "grammar in context"
    - "reading comprehension"
  source_languages:
    - "de"
    - "en"
    - "es"
    - "el"
  target_languages:
    - "de"
    - "en"
    - "es"
    - "el"
  content_source: "versioned host content contract"
  learning_power_minimum_share: 0.75
  final_capture_requirement: "correct Crown Sentence"
  feedback:
    - "teaching-first"
    - "non-shaming"
    - "exactly-once resolution"
    - "revenge-word scheduling"

core_loop:
  action: "select adjacent region and tactical plan"
  challenge: "solve language tasks"
  feedback: "word power, mastery, tactical effect and clear correction"
  reward: "region progress, stars, XP, shells and crown seals"
  progression: "ten regions, tournaments and ten bosses"

states:
  - "boot"
  - "title"
  - "campaign_map"
  - "region_map"
  - "planning"
  - "challenge"
  - "correct_feedback"
  - "wrong_feedback"
  - "enemy_turn"
  - "tournament"
  - "boss_intro"
  - "boss_active"
  - "victory"
  - "defeat"
  - "paused"
  - "help"
  - "reward"
  - "restart"
  - "save_recovery"
  - "campaign_victory"

visual:
  brand_world: "Tula's Island premium anime adventure"
  existing_assets_first: true
  readability_priority: true
  mobile_first: true
  no_planets: true
  no_baked_ui_text_in_raster_assets: true
  token_source: "host design token adapter"

architecture:
  pure_core: true
  direct_dom_in_core: false
  direct_local_storage_in_core: false
  direct_supabase_in_core: false
  provider_adapters_required: true
  save_schema_versioned: true
  seeded_rng: true

acceptance:
  gameplay:
    - "strategy cannot bypass learning"
    - "Crown Sentence required for capture"
    - "all boss cheats telegraphed and fair"
    - "pause and help preserve exact state"
    - "rewards exactly once"
  mobile:
    - "375x667"
    - "390x844"
    - "430x932"
    - "safe area"
    - "primary gameplay without avoidable scrolling"
  visual:
    - "real Tula and boss assets"
    - "no clipping"
    - "no generic minigame look"
    - "task remains visually dominant"
  technical:
    - "build"
    - "unit tests"
    - "integration tests"
    - "E2E runtime playtest"
    - "asset 404 check"
    - "save migration"
  performance:
    - "lazy world and boss assets"
    - "no unbounded timer or listener loops"
    - "reduced motion"
```

## 51.2 `.masterbrain/impact-scope.yml` für den ersten Vertical Slice

```yaml
task: "crown-of-words-garden-kai-vertical-slice"

repository:
  proposed: "o-some/crown-of-words"
  verify_before_write: true

allowed:
  - ".masterbrain/**"
  - "docs/**"
  - "public/assets/map/**"
  - "public/assets/worlds/world_garden.webp"
  - "public/assets/tula/**"
  - "public/assets/bosses/boss-01-pirat-kai.webp"
  - "public/assets/cards/**"
  - "public/assets/rewards/**"
  - "src/game/**"
  - "src/presentation/**"
  - "src/adapters/**"
  - "src/content/**"
  - "src/styles/**"
  - "tests/**"
  - "package.json"
  - "vite.config.*"

protected:
  - "o-some/tulasisland main"
  - "o-some/word-scramble"
  - "o-some/word-guardians"
  - "o-some/pirate-pairs"
  - "o-some/pirate-deck"
  - "o-some/wordbound-battle"
  - "host wallet"
  - "host economy"
  - "host progress"
  - "host storage"
  - "host content database"
  - "Dropbox originals"
  - "bosses 02-10 until their planned branch"

rules:
  direct_main_write: false
  force_push: false
  refactor_outside_scope: false
  preserve_uncommitted_work: true
  amend_scope_before_new_paths: true
  no_runtime_dropbox_hotlinks: true
  no_placeholder_when_real_asset_exists: true
  stop_after_branch: true
```

## 51.3 Asset-Registry-Beispiel

```yaml
assets:
  - id: "map-tula-island-overview"
    source_path: "/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Maps/map_turtle_island_overview.webp"
    derivative_path: "public/assets/map/map-turtle-island-overview.webp"
    purpose: "campaign map background"
    crop_mode: "contain"
    approval_status: "verify"
    sha256: "calculate-before-commit"

  - id: "world-garden"
    source_path: "/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Worlds/world_garden.webp"
    derivative_path: "public/assets/worlds/world-garden.webp"
    purpose: "garden region background"
    crop_mode: "cover-with-safe-focus"
    approval_status: "verify"
    sha256: "calculate-before-commit"

  - id: "boss-01-pirat-kai"
    source_path: "/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/Level 1 - Pirat Kai.png"
    derivative_path: "public/assets/bosses/boss-01-pirat-kai.webp"
    purpose: "garden boss"
    crop_mode: "contain"
    transparent: true
    approval_status: "verify"
    sha256: "calculate-before-commit"
```

---

# 52. Fertiger CAF-Startprompt

Der folgende Prompt ist für einen neuen Entwicklungs-Chat gedacht. Die erste Zeile muss unverändert am Anfang stehen, damit die Chelonaki App Factory eindeutig geroutet wird.

```text
ChelonakiAppFactory:

Lies zuerst vollständig und von Anfang bis Ende:

TULAS_ISLAND_CROWN_OF_WORDS_MASTER_SPEC_2026-08-27.md

Behandle die Datei als verbindlichen Game-Design-, Lern-, Architektur-, Asset-, Mobile-, QA- und Releasevertrag für:

Tula’s Island – Crown of Words

Aufgabe:

Baue ein neues rundenbasiertes Tula’s-Island-Strategiespiel mit Insel-/Gebietskontrolle, Seerouten, Turnieren, Satzbau, Übersetzungen, Karten, Helfern, sichtbaren Gegnerzügen und den zehn vorhandenen Piratenbossen.

Verbindliche Arbeitsweise:

1. Route als GAME-NEW über BigBrain, MasterBrain und PlayBrain.
2. Verwende die aktuellen CAF-Module 96, 97 und 98.
3. Verwende die Packs games-learning, mobile-interaction und tula-island.
4. Prüfe vor jeder Änderung die tatsächliche Repository-, Branch-, Code- und Assetrealität.
5. Falls o-some/crown-of-words noch nicht als vorbereitetes Zielrepo existiert, verändere nicht ersatzweise ein anderes Spielrepo.
6. Beginne ausschließlich mit Branch 0 – Safety / Baseline.
7. Dokumentiere aktuellen main-SHA, uncommitted work, Rollback-Punkt und tatsächlichen Teststatus.
8. Erstelle danach erst auf einem eigenen Branch die Projektverträge.
9. Arbeite nie zwei Planbranches gleichzeitig.
10. Nach jedem Branch stoppen, Diff prüfen, Build/Test dokumentieren und verbleibende Branches nennen.
11. Keine direkten Writes auf main.
12. Kein Force Push.
13. Keine anderen Tula’s-Island-Spiele verändern.
14. Keine Dropbox-Originale überschreiben oder löschen.
15. Bestehende Tula-, Welt-, Boss-, Gegner-, Helfer-, Karten- und Reward-Assets zuerst verwenden.
16. Keine Planetenkarte bauen.
17. Keine generischen Ersatzsprites einsetzen, wenn ein echtes Asset existiert.
18. Keine monolithische finale HTML-Datei.
19. Game Core, UI und Provider trennen.
20. Der Game Core darf weder direkt auf localStorage noch auf Supabase zugreifen.
21. Strategie darf Sprachlernen nicht umgehen.
22. Eine Gebietseroberung benötigt eine korrekte Crown Sentence.
23. Boss-Schummelei darf nie die sprachlich richtige Antwort verändern oder Text verdecken.
24. Pause, Hilfe und Reload müssen den exakten Zustand erhalten.
25. Belohnungen und Antworten genau einmal auswerten.
26. Zuerst einen vollständigen Garden/Kai-Vertical-Slice bauen.
27. Vor weiterer Breite den Slice tatsächlich auf Mobile und Desktop spielen und unabhängig prüfen.
28. Build-Erfolg allein ist kein Gameplay-PASS.
29. Testlabels ehrlich verwenden.
30. Nach finalen Änderungen alle betroffenen Prüfungen erneut ausführen.

Beginne jetzt nur mit:

BRANCH 0 – SAFETY / BASELINE

Noch keine Gameplay- oder Designimplementierung.
```

---

# Schlussentscheidung

Die empfohlene Produktform lautet:

> **Ein rundenbasiertes Insel-Strategiespiel mit fünfteiligen Regionaleroberungen, sichtbaren KI-Zügen, echten Sprachturnieren, zentralem Satzbau und zehn fair schummelnden Bossen.**

Die empfohlene technische Form lautet:

> **Standalone zuerst, pure Game-Core-Architektur, vorhandene Assets, versionierte Adapter und später eine kontrollierte Integration in Tula’s Island.**

Die empfohlene Entwicklungsreihenfolge lautet:

> **Safety → Verträge → Assets → Core → Lernengine → Garden/Kai Vertical Slice → echter Playtest → erst danach die übrigen neun Regionen.**
