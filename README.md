# Jonathan Rechnen

Eine kleine Lern-App fuer schriftliche Addition. Die App fuehrt Kinder spaltenweise von rechts nach links durch Additionsaufgaben, zeigt Uebertraege an, vergibt Sterne und Badges und speichert den Fortschritt lokal im Browser.

## Ziel

Der urspruengliche Plan fuer das Projekt ist eine fokussierte, kindgerechte Rechenuebung:

- schriftliche Addition als erste Kernfunktion
- Aufgaben in steigenden Levels bis zu Summen unter 1.000.000
- zwei oder drei Summanden, je nach Level
- spaltenweises Pruefen der Eingaben inklusive Uebertrag
- motivierender Fortschritt mit Sternen, Serien, Tagesziel und Badges
- lokale Nutzung ohne Backend oder Account

## Funktionen

- Generiert Additionsaufgaben passend zum aktuellen Level.
- Prueft jede Ergebnisspalte einzeln.
- Zeigt Uebertraege erst dann, wenn sie fuer die naechste Spalte gebraucht werden.
- Speichert Fortschritt in `localStorage`.
- Erlaubt Reset des lokalen Fortschritts.
- Enthalt Tests fuer Domain-Logik und einen Smoke-Flow der App.

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest
- Testing Library
- pnpm

## Entwicklung

Abhaengigkeiten installieren:

```sh
pnpm install
```

Dev-Server starten:

```sh
pnpm dev
```

Die App laeuft danach standardmaessig unter `http://127.0.0.1:5173`.

Tests ausfuehren:

```sh
pnpm test
```

Produktionsbuild erstellen:

```sh
pnpm build
```

Build lokal ansehen:

```sh
pnpm preview
```

## Projektstruktur

```text
src/
  App.tsx                  React-UI und App-State
  styles.css               Styling der Lernoberflaeche
  domain/
    columnChecker.ts       Spaltenlogik, Uebertraege und Ergebnispruefung
    progress.ts            Fortschritt, Levelaufstieg, Badges und Speicherung
    taskGenerator.ts       Levelbasierte Aufgabengenerierung
    types.ts               Gemeinsame Domain-Typen
```

## Levelmodell

Die Levelregeln liegen in `src/domain/taskGenerator.ts`.

- Level 1: 2 Summanden, Summe unter 100, ohne komplexe Uebertraege
- Level 2: 2 Summanden, Summe unter 1.000, mit Uebertrag
- Level 3: 2 Summanden, Summe unter 10.000, mit Uebertrag
- Level 4: 3 Summanden, Summe unter 10.000, mit Uebertrag
- Level 5: 2 oder 3 Summanden, Summe unter 100.000, mit Uebertrag
- Level 6: 2 oder 3 Summanden, Summe unter 1.000.000, mit Uebertrag

Ein Levelaufstieg erfolgt nach mehreren fehlerfreien Aufgaben auf demselben Level.

## Speicherung

Der Fortschritt wird ausschliesslich im Browser unter dem Key `jonathan-rechnen:v1:progress` gespeichert. Es gibt kein Backend und keine Synchronisierung zwischen Geraeten.

## Qualitaetskriterien

- Domain-Regeln moeglichst in `src/domain/` halten und separat testen.
- UI-Zustand in `App.tsx` schlank halten.
- Neue Rechenregeln oder Fortschrittsregeln mit Vitest absichern.
- Vor groesseren Aenderungen mindestens `pnpm test` ausfuehren.
