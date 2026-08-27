# Crown of Words – Tula's Island Host Integration Contract

Contract version: 1
Game id: `crown-of-words`
Host reference verified against: `o-some/tulasisland@cf2fb9b3e2dc1eb885d50e88593124def1cbbdc0`

## Ziel

Crown of Words bleibt als eigenständiges Vite-Spiel lauffähig und kann später ohne Hostmigration in Tula's Island eingebettet werden. Der Pure Core importiert weder Supabase noch `localStorage` noch Hostmodule.

## Injizierte Fähigkeiten

Vor dem Laden von Crown stellt die Haupt-App ausschließlich folgende bestehenden Grenzen bereit:

```js
globalThis.__TULAS_ISLAND_CROWN_HOST__ = {
  getState,
  setState,
  creditGameplayShells,
};
```

Diese Funktionen existieren im Host bereits in:

- `src/v3/core/store.js` – `getState`, `setState`
- `src/v3/core/economy.js` – `creditGameplayShells`

Crown importiert diese Hostdateien nicht direkt. Die Injektion hält das Spiel portabel und verhindert eine zweite Architektur.

## Storage

Standalone:

- bestehender `localStorage`-Adapter `crown-of-words:save:v1`

Host:

- Save-Envelope unter `state.session.activeGame`
- `id: "crown-of-words"`
- `contractVersion: 1`
- `saveEnvelope`
- `integration.committedEventIds`

Persistenz erfolgt ausschließlich über den Host-`setState`-Pfad. Damit greift Crown im Hostmodus nicht direkt auf `localStorage` zu.

## Progress

Nicht monetärer Fortschritt wird ausschließlich über `setState` geschrieben:

- `progress.xp`
- `progress.stars["crown-of-words:<region>"]`
- `progress.mastery["crown-of-words:<region>"]`

Werte verbessern sich monoton für Sterne/Mastery. Eine bereits gebuchte stabile Event-ID wird nicht erneut angewendet.

## Wallet / Muscheln

Angemeldeter Host:

- ausschließlich `creditGameplayShells(amount, reason, stableEventId)`
- keine direkte Walletmutation
- serverseitiges Ledger bleibt autoritativ und idempotent

Gastmodus:

- der bestehende Host-Economy-Aufruf liefert `null`
- danach wird die lokale Gastmuschelmenge über `setState` erhöht
- dieselbe `committedEventId` verhindert Doppelgutschrift beim Reload

Fehler-/Offlinefall:

- der Kampagnensieg wird **vor** dem Reward-Sync gespeichert
- schlägt `creditGameplayShells` fehl, liefert der Adapter `retryable: true`
- XP, Sterne, Mastery und `committedEventIds` werden in diesem Fehlerfall nicht teilweise geschrieben
- dieselbe stabile Event-ID kann später sicher erneut gesendet werden
- der bereits gespeicherte 10/10-Sieg bleibt davon unberührt

## Stabile Reward Event IDs

Format:

```text
crown-of-words:<kind>:<id>:v1
```

Beispiel Kampagnenabschluss:

```text
crown-of-words:campaign-clear:crown-of-words:v1
```

Der 10/10-Kampagnensieg speichert zuerst den Game-State und übergibt danach genau dieses stabile Reward-Event an den Runtime-Adapter.

## Navigation / Exit

Das Spiel verändert im Hostmodus keine Browser-URL direkt. `exitGame()` setzt über den Host-Store:

```js
route = { name: 'home', params: {} }
```

## Sicherheitsgrenzen

Crown darf im Hostmodus nicht:

- Supabase direkt importieren,
- Wallettabellen oder Ledger direkt schreiben,
- `localStorage` direkt aus dem Pure Core ansprechen,
- Host-Schemas migrieren,
- Echtgeldwerte selbst festlegen,
- andere Spiele verändern.

## Einbau in die Haupt-App

Branch 12 verändert `o-some/tulasisland` ausdrücklich nicht. Der spätere Host-Route-Commit soll lediglich die drei existierenden Fähigkeiten injizieren und anschließend Crown als Game-Modul mounten. Dieser tatsächliche Host-Commit braucht einen eigenen geprüften Integrations-/Release-Schritt; er ist keine Voraussetzung dafür, dass der Crown-Adaptervertrag jetzt vollständig testbar ist.
