# Crown of Words — Branch 0 Safety / Baseline / Reality Gate

Stand: 2026-08-27

## Repository

- Repository: `o-some/crown-of-words`
- Default branch: `main`
- Ausgangs-SHA / baseline: `f4cb67caed138f24dd8fc7dc810ace157b95778d`
- Arbeitsbranch: `branch-0-safety-baseline`
- Rollback branch: `rollback/branch-0-baseline-f4cb67c`
- `main` branch protection: nicht aktiviert.
- Kein Force Push vorgesehen.
- Keine Featureänderung in Branch 0.

## Aktueller Repository-Inhalt

`main` enthält zum Baseline-Zeitpunkt nur:

- `README.md`
- `TULAS_ISLAND_CROWN_OF_WORDS_MASTER_SPEC_2026-08-27.md`

Die Master-Spezifikation liegt vollständig im Root und besitzt 86.799 Bytes.

Nicht vorhanden:

- `package.json`
- Vite-Scaffold
- `src/`
- `public/`
- `tests/`
- `.masterbrain/`
- produktive GitHub-Pages-Workflow-Datei
- Spielcode oder Runtime-Assets

Das ist konsistent mit dem Plan: Branch 1 ist ausdrücklich für Contracts/Scaffold vorgesehen.

## Framework / Architektur

### Crown of Words heute

- Tatsächliches Framework: **noch keines installiert**.
- Entry Point: **nicht vorhanden**.
- Routing: **nicht vorhanden**.
- Asset-System: **nicht vorhanden**.
- Runtime-State: **nicht vorhanden**.
- Build: **NOT AVAILABLE**, da Branch 0 noch kein `package.json`/Scaffold besitzt.

### Verifizierte Tula’s-Island-Zielarchitektur

Die Haupt-App `o-some/tulasisland` verwendet:

- Vite
- browsernative ES-Module
- Capacitor für iOS/Android
- local-first Architektur
- `src/v3/core/store.js` als einzigen Laufzeit-Store
- Adaptergrenzen für Storage, Account und Economy
- GitHub Pages als Web-Deploymentpfad

Crown of Words soll deshalb Standalone-first bleiben und später nur über definierte Adapter in `src/v3/games/crown-of-words/` integriert werden.

## Build- und Teststatus

### Install

`npm install`: **NOT AVAILABLE** — kein `package.json` im Zielrepo.

### Development Runtime

`npm run dev`: **NOT AVAILABLE** — noch kein Vite-Scaffold.

### Production Build

`npm run build`: **NOT AVAILABLE** — noch kein Vite-Scaffold.

### Gameplay / Mobile / Desktop

- Gameplay: **NOT TESTED / NOT AVAILABLE**
- Browser-Mobile-Viewport: **NOT TESTED / NOT AVAILABLE**
- Real Device: **NOT TESTED / NOT AVAILABLE**
- Desktop Runtime: **NOT TESTED / NOT AVAILABLE**
- Touch / Drag & Drop: **NOT TESTED / NOT AVAILABLE**

Diese Labels sind kein Fehler des Branch-0-Gates; Runtime und Tests werden erst nach dem Scaffold möglich.

## GitHub Actions / Deployment

- Im Repository existiert aktuell kein dauerhafter Workflow.
- Historische Actions-Runs stammen ausschließlich vom einmaligen Transfer/Verifizieren der Master-Spezifikation.
- Der letzte relevante Transferlauf war erfolgreich.
- Ein produktiver Build-/Pages-Workflow ist derzeit **nicht vorhanden**.
- GitHub-Pages-Live-Deployment: **NOT CONFIGURED / NOT VERIFIED**.

## Chelonaki App Factory

Verifiziert am 2026-08-27:

- Chelonaki App Factory: `1.6.0`, ACTIVE
- MasterBrain: `4.6.1`, ACTIVE
- BigBrain: `1.1.0`, ACTIVE
- Bootstrap: `1.5.0`
- Module 96 — Game Development Director: `1.0.0`, ACTIVE
- Module 97 — Game Playtest & Visual QA: `1.0.0`, ACTIVE
- Module 98 — Game Repair & Release Loop: `1.0.0`, ACTIVE

Verbindliche Regeln für dieses Projekt:

- `GAME-NEW`
- BigBrain plant/reviewt; MasterBrain implementiert; PlayBrain testet.
- Reality Check → Baseline → Impact Scope → Implementierung → tatsächlicher Playtest.
- Build-Erfolg ist kein Gameplay-PASS.
- keine direkten Writes auf `main` während Planbranches.
- reuse-first für bestehende Tula-Assets und bewährte Gamepatterns.
- Lernen und Gameplay bleiben untrennbar gekoppelt.
- Mobile-first; vermeidbares Scrollen im Kernspiel vermeiden.
- Testlabels ehrlich halten.

## Verifizierte Dropbox-Assets

### Kampagnenkarte

Verifiziert:

`/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Maps/map_turtle_island_overview.webp`

Zusätzlich existiert ein hochauflösendes PNG-Original.

Status: **VORHANDEN**.

### Welt-/Regionskulissen

Der kanonische Web-Ordner wurde vollständig auf direkte Kinder geprüft:

`/[LinguaTurtle]/03_Bilder_und_Design/02_Backgrounds/Web/Worlds/`

Es sind genau 10 WebP-Weltkulissen vorhanden:

1. `world_ice_peak.webp`
2. `world_library.webp`
3. `world_crystal_cove.webp`
4. `world_garden.webp`
5. `world_desert_oasis.webp`
6. `world_castle.webp`
7. `world_sun_bay.webp`
8. `world_coral_reef.webp`
9. `world_harbor.webp`
10. `world_jungle_trail.webp`

Status: **10/10 VORHANDEN**.

Die konkrete semantische Zuordnung einiger älter benannter Weltdateien zu den neuen Crown-of-Words-Regionen muss im Asset-Registry-Branch dokumentiert werden; Dateivorhandensein allein beweist die finale Art-Direction-Zuordnung nicht.

### Bosse

Kanonischer freigestellter Bossordner:

`/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/`

Verifiziert:

1. Level 1 — Pirat Kai
2. Level 2 — Kapitän Brax
3. Level 3 — Blackfinn
4. Level 4 — Alt-Kapitän Roderick
5. Level 5 — Piratenbaron Vargas
6. Level 6 — Kapitän Ironhook
7. Level 7 — Admiral Thorne
8. Level 8 — Kartenmeister Corvin
9. Level 9 — Schattenfürst Azrak
10. Level 10 — Piratenkönig Varkos

Zusätzlich ist ein Boss-ZIP vorhanden.

Status: **10/10 VORHANDEN**.

### Tula

Verifizierter Web-Ordner:

`/[LinguaTurtle]/03_Bilder_und_Design/01_Characters/Tula/Web/`

Unter anderem vorhanden:

- `tula_profile.webp`
- `tula_waving.webp`
- `tula_happy.webp`
- `tula_listening.webp`
- `tula_thinking.webp`
- `tula_celebrating.webp`
- `tula_sleeping.webp`
- `tula_speaking.webp`
- `tula_surprised.webp`

Status: **VORHANDEN**.

### Helfer / Karten / Rewards / Lernassets

Die Master-Spezifikation und die Haupt-App bestätigen, dass entsprechende Systeme/Assets vorgesehen bzw. vorhanden sind. Eine vollständige Datei-für-Datei-Provenienzprüfung gehört gemäß Plan in Branch 2 und wurde in Branch 0 bewusst nicht als fertiges Assetmanifest vorgetäuscht.

Status: **PARTIAL VERIFIED — Detailmanifest in Branch 2**.

## Abweichungen zur Master-Spezifikation

Keine problematische Architekturabweichung gefunden.

Die einzige wesentliche Realität ist erwartbar:

- Die Master-Spezifikation beschreibt die Zielstruktur.
- Das Zielrepo ist aktuell noch bewusst fast leer.
- Deshalb existieren Framework, Build, Runtime, Tests, Assets und `.masterbrain`-Verträge noch nicht.
- Branch 1 ist genau dafür vorgesehen.

Die Master-Spezifikation selbst liegt bereits im Repo; der Punkt „Master-Spec ins Repo“ aus Branch 1 ist damit schon vorab erfüllt und muss dort nicht dupliziert werden.

## Risiken

1. `main` ist aktuell ungeschützt. Vor späteren parallelen/produktiven Arbeiten ist Branch-Protection sinnvoll.
2. GitHub Pages ist noch nicht als produktiver Previewpfad eingerichtet.
3. Kein Lockfile / keine Dependency-Baseline, weil das Scaffold noch nicht existiert.
4. Keine Runtime-Tests möglich, bis Branch 1 das minimale Vite-Projekt erzeugt.
5. Mehrere Weltkulissen tragen ältere thematische Dateinamen; finale Crown-Region-Zuordnung muss explizit registriert werden.
6. Helfer/Karten/Rewards benötigen noch vollständige Provenienz + Hashmanifest.
7. Reales iPhone-Testing bleibt bis zu einem lauffähigen Candidate NOT AVAILABLE/NOT TESTED.

## Rollback

Unveränderter Baseline-Commit:

`f4cb67caed138f24dd8fc7dc810ace157b95778d`

Zusätzlicher unveränderter Rollback-Branch:

`rollback/branch-0-baseline-f4cb67c`

Damit kann jeder spätere Branch gegen den exakt dokumentierten Startzustand verglichen werden.

## Branch-0-Gate

**PASS WITH NOTES**

Begründung:

- exaktes Repo verifiziert;
- `main` und SHA verifiziert;
- Repository-Inhalt verifiziert;
- keine Featureänderung durchgeführt;
- Rollback-Punkt gesetzt;
- CAF/MB/BB/Game-Module verifiziert;
- zentrale Dropbox-Karte, zehn Welten, zehn Bosse und Tula verifiziert;
- fehlender Build ist als erwartbarer Pre-Scaffold-Zustand ehrlich dokumentiert;
- keine fremden Tula-Repositories verändert.

Die Notes sind keine Blocker für Branch 1; sie sind dort bzw. in Branch 2 planmäßig zu bearbeiten.

## Nächster Branch

`Branch 1 – Contracts / Scaffold`

Nach Abschluss von Branch 0 verbleiben **13 Planbranches (1–13)**.
