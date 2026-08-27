# Branch 9 – Regionen 2 bis 4 – Abschluss

Stand: 2026-08-27
Branch: `branch-9-regions-2-4`

## Scope

Branch 9 erweitert ausschließlich die bereits vorhandene Crown-of-Words-Kampagne um:

- Region 2 – Bibliothek – Kapitän Brax – regionaler Gegner Lio
- Region 3 – Tierwelt – Blackfinn – regionaler Gegner Piko
- Region 4 – Zuhause – Alt-Kapitän Roderick – regionaler Gegner Koda

Region 1 / Garten / Kai bleibt als bestehender Pfad erhalten. Regionen 5+ sowie Host-/Hauptapp-Integration sind nicht Bestandteil dieses Branches.

## Safety / Baseline

- `main` wurde während Branch 9 nicht beschrieben oder deployed.
- Branch 9 wurde isoliert auf `branch-9-regions-2-4` umgesetzt.
- Rollback-/Baseline-Kontext wurde vor der Umsetzung geprüft.
- Temporäre Import-, Registry-, UI-Patch- und Browser-Workflows wurden nach erfolgreicher Verifikation wieder entfernt.
- Das temporäre `scripts/branch9-ui-patch.mjs` wurde nach erfolgreicher Anwendung entfernt.

## Inhalte und Lernregeln

Alle drei Regionen besitzen fünf Standard-Lernaufgaben inklusive verpflichtender finaler Crown Sentence sowie drei Bossaufgaben. Lernleistung bleibt Siegbedingung; Taktik darf richtige Sprachantworten weder verändern noch verraten.

### Brax – Wanderndes Pulverfass

- exakt ein persistenter sichtbarer `?`-Marker
- Marker darf zwischen zulässigen Positionen wandern
- korrekte Counter-/Satzleistung kann den Effekt für die definierte Runde entschärfen
- kein Eingriff in die Wahrheit der Sprachaufgabe

### Blackfinn – Nebel der falschen Spur

- Nebel darf ausschließlich taktische Informationen verdecken
- die korrekte Sprachantwort bleibt immer unverändert und fair lösbar
- Aufklärung/Scout-Counter kann den taktischen Nebel für die definierte Situation aufheben

### Roderick – Revanchefluch

- verwendet ausschließlich tatsächlich in der Region gemachte Fehler-Concepts
- maximal drei eindeutige Fehler-Concepts in der Revanche-Queue
- bei fehlerfreiem Spiel wird keine künstliche Fehlerhistorie erfunden
- die Fehlerhistorie wird bereits vor dem Bosskampf sichtbar telegraphiert

## Kanonische Assets

Die Region-2-bis-4-Weltbilder und Boss-Sprites stammen aus der vorhandenen Tula's-Island-Assetbasis. Sie werden lokal im Runtime-Bundle ausgeliefert; Runtime-Dropbox-Hotlinks sind verboten.

Neu registriert wurden insbesondere:

- `public/assets/worlds/world-library.webp`
- `public/assets/worlds/world-jungle-trail.webp`
- `public/assets/worlds/world-sun-bay.webp`
- `public/assets/bosses/boss-02-kapitaen-brax.png`
- `public/assets/bosses/boss-03-blackfinn.png`
- `public/assets/bosses/boss-04-roderick.png`

Die SHA-256-Werte sind in `docs/BRANCH_9_ASSET_SHA256.txt` dokumentiert. Die zentrale `.masterbrain/asset-registry.json` enthält insgesamt 17 `ready` Assets und wird durch `scripts/check-assets.mjs` bytegenau geprüft.

## Tests

Dauerhafte Core-/Sessiontests decken unter anderem ab:

- deterministisches Brax-Verhalten und genau einen Marker
- Blackfinn-Fairness: Taktiknebel statt Sprachmanipulation
- Rodericks echte Fehlerhistorie, Eindeutigkeit und Maximalgröße 3
- Standard- und Bossabschluss für Bibliothek, Tierwelt und Zuhause
- verpflichtende Crown Sentence
- bestehende Campaign-, AI-, Learning-, Kai-, Save-, Karten- und Helfer-Tests
- Asset-Integrität aller 17 registrierten Assets
- Produktions-Build mit Vite

## Browser-/Visual-Gate

Der vollständige Branch-9-Pfad wurde in Chromium auf folgenden Viewports durchgespielt:

- 375 × 667
- 390 × 844
- 430 × 932
- 844 × 390
- 1440 × 900

Für jeden Viewport wurden alle drei Regionen vom Kampagnen-Einstieg über fünf Standardaufgaben, Bossintro, drei Bossaufgaben bis zum Sieg gespielt. Zusätzlich wurden horizontale Overflows, Browser-/Console-Fehler, Boss-Sprites und die sichtbaren Bossmechaniken geprüft.

Der Visual-Gate wartet explizit auf vollständig geladene/dekodierte CSS-Weltbilder und Bossbilder. Dadurch wurde ein zuvor dunkler Desktop-Zuhause-Screenshot als Screenshot-Race identifiziert, nicht als Runtime-Fehler. Nach dem Decode-Gate wird `world-sun-bay.webp` auf Desktop korrekt sichtbar dargestellt.

Finaler erfolgreicher Browser-Gate vor Cleanup:

- GitHub Actions Run `33087076345`
- Branch-9-Regions-Playtest: PASS
- Branch-8-Regression: PASS
- Visual-Evidence-Artefakt erzeugt

## Regression

Nach Branch 9 wurde der bestehende Branch-8-Pfad erneut vollständig gespielt. Garten, Niko/Enemy-AI, Karten/Helfer und Kai bleiben funktionsfähig. Der Regression-Gate ist PASS.

## Ergebnis

Branch 9 ist nach erfolgreichem finalen CI auf dem bereinigten Abschluss-SHA freigabefähig. Es erfolgt in diesem Branch-Schritt kein automatischer Merge nach `main` und kein Production-Deploy.
