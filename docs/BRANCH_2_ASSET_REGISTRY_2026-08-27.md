# Crown of Words — Branch 2 Asset Registry

Stand: 2026-08-27

## Scope

Branch 2 importiert ausschließlich die für den ersten Vertical Slice vorgesehenen freigegebenen Runtime-Assets und etabliert eine überprüfbare Provenienz-/Hash-Registry. Keine Gameplay-, Kartenlogik-, Lernengine- oder Bossmechanik wurde implementiert.

## Ausgangspunkt

- Branch 1 final: `b5c3a2de8f00e0332c30733dc0a122f560c7effe`
- Branch 2: `branch-2-asset-registry`
- Tula’s-Island-Quellrevision: `cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0`
- Dropbox-Originale wurden ausschließlich gelesen/verifiziert und nicht verändert.

## Importierte Runtime-Assets

1. `public/assets/map/map-turtle-island-overview.webp`
   - Größe: 600444 Bytes
   - SHA-256: `d251e39ca9355605f73576869f8c9f6d55ef8f021737e11626272630403fd8a4`

2. `public/assets/worlds/world-garden.webp`
   - Größe: 418490 Bytes
   - SHA-256: `8338025554c7640a381dd1b22c67910211d6f62484bd83040eb3141f2758b788`

3. `public/assets/tula/tula-happy.webp`
   - Größe: 181326 Bytes
   - SHA-256: `f9bd480dc85a86e62423ceda724749cccca116c51321192753335aa825c9eb24`

4. `public/assets/rewards/reward-shell-gold.webp`
   - Größe: 157166 Bytes
   - SHA-256: `8e7a14738abce923ec7175138a87e6b3b1bac08f59a7e7e1facbb9be337e04bb`

5. `public/assets/rewards/reward-shell-pearl.webp`
   - Größe: 94030 Bytes
   - SHA-256: `7c9d3433187a80d3fd68c276d7b90868dc072c529f4c645a459bbe60ffb73a13`

6. `public/assets/rewards/reward-star-xp.webp`
   - Größe: 76022 Bytes
   - SHA-256: `68185402f26d99a600c6d1ade518ceb3ec484d3665a02e9272a8f569d70803e6`

Die sechs Dateien wurden revisionsgepinnt aus `o-some/tulasisland` übernommen. Für Karte, Garten, Tula und beide Muscheln wurden zusätzlich die kanonischen Dropbox-Webquellen samt Dropbox Content Hash gegengeprüft.

## Pirat Kai

Kanonisches Original:

`/[LinguaTurtle]/[Endbosse]/Tulas_Island_10_Original_Bosse_Einzeln_v2/[Freigestellt]/Level 1 - Pirat Kai.png`

Verifiziert:

- Dropbox File ID: `id:tBVq8LNbZ_8AAAAAAAM3bQ`
- Größe: 655568 Bytes
- Dropbox Content Hash: `f95cce54828690c9e29bdf3f8af60877f35254761c281251c0f9bbba44f85d45`
- Format: PNG, freigestelltes Original

Runtime-Status: **SOURCE VERIFIED / RUNTIME TRANSFER PENDING**.

Begründung: Der aktuelle Dropbox-Connector stellt Binärdateien über kurzlebige Einmal-Downloadtokens bereit. Ein solcher Token wird bewusst nicht in einem öffentlichen Workflow oder in Git-Historie persistiert. Ebenso wurde kein generischer oder nachgebauter Kai-Sprite als Ersatz verwendet. Das Original muss spätestens vor Branch 5 — Garden/Kai Vertical Slice — byte-preserving in `public/assets/bosses/boss-01-pirat-kai.png` übertragen werden.

Dies ist eine offene Note, kein stillschweigender Ersatz.

## Registry

Neu:

`.masterbrain/asset-registry.json`

Sie hält pro Asset fest:

- semantische ID,
- Assettyp,
- Runtimepfad,
- Importstatus,
- gepinnte Quellrevision,
- Quellpfad / Blob,
- Dropbox-Provenienz, soweit vorhanden,
- Dateigröße,
- SHA-256 der Runtime-Datei,
- Transfer-/Freigabestatus.

Verbindliche Registry-Regeln:

- keine Runtime-Dropbox-Hotlinks,
- bestehende Originalassets zuerst,
- keine Platzhalter bei vorhandenem Original,
- SHA-256-Prüfung für Runtime-Assets.

## Automatisierte Asset-QA

Neu:

`scripts/check-assets.mjs`

`npm run check:assets` prüft für alle `ready`-Assets:

- Datei vorhanden,
- exakte Bytegröße,
- exakten SHA-256,
- Verbot von Runtime-Dropbox-Hotlinks in der Registry.

Nicht transferierte, aber sauber deklarierte Quellen werden als NOTE ausgegeben und nicht fälschlich als Runtime-PASS behandelt.

CI führt jetzt aus:

1. `npm ci`
2. Syntaxcheck
3. Asset-Integritätscheck
4. Vite Production Build

## One-time Import

Für die sechs bereits öffentlich in Tula’s Island vorhandenen Assets wurde einmalig ein revisionsgepinnter Importworkflow genutzt. Der Workflow wurde nach erfolgreichem Import wieder aus dem Branch entfernt. Er enthält keine Dropbox-Downloadtokens und keine Secrets.

## Asset-404-Status

Repository-/Build-Ebene:

- alle sechs als `ready` registrierten Runtime-Dateien sind physisch vorhanden und hashverifiziert;
- Vite übernimmt `public/` unverändert in den Build;
- tatsächlicher HTTP-200/404-Live-Test bleibt bis zum Preview-/Pages-Deploy `NOT TESTED`.

Kein Live-404-PASS wird ohne Deployment behauptet.

## Keine Scope-Ausweitung

Nicht importiert/implementiert:

- Bosse 02–10,
- weitere neun Welten,
- Kartenwesen,
- Helfer,
- Gegnerlogik,
- Kampagnenlogik,
- Lernaufgaben,
- Bossmechaniken.

Andere Tula-Repositories wurden ausschließlich read-only als verifizierte Quelle verwendet.

## Risiken / Notes

1. Kai-Original muss vor Branch 5 byte-preserving transferiert werden.
2. Weitere neun Weltkulissen bleiben bis zu ihren vorgesehenen Contentbranches außerhalb des Runtime-Bundles.
3. Live-HTTP-Assetprüfung ist noch nicht möglich, da Branches nicht automatisch als Pages-Release deployed werden.
4. Asset-Crops und visuelle Eignung werden beim tatsächlichen Vertical-Slice-/PlayBrain-Gate geprüft; Dateiintegrität allein ist keine Art-Direction-Abnahme.

## Branch-2-Gate

**PASS WITH NOTES**

Begründung:

- Asset Registry etabliert;
- sechs benötigte Basis-/Reward-Assets bytegenau importiert;
- Provenienz dokumentiert;
- SHA-256 automatisiert geprüft;
- keine Hotlinks;
- keine generischen Ersatzsprites;
- Kai-Original eindeutig verifiziert und ehrlich als Runtime-Pending markiert;
- kein Gameplay vorgezogen;
- keine fremden Repos verändert.

Die offene Kai-Transfernote blockiert Branch 3 (Pure Campaign Core) nicht, wird aber zum harten Blocker vor Branch 5, falls sie bis dahin nicht gelöst ist.

## Nächster Branch

`Branch 3 – Pure Campaign Core`

Nach Abschluss von Branch 2 verbleiben **11 Planbranches (3–13)**.
