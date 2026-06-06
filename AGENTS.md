# AGENTS.md

Hinweise fuer KI-Agenten und automatisierte Aenderungen in diesem Repo.

## Projektkontext

`jonathan-rechnen` ist eine lokale React/Vite-App zum Ueben schriftlicher Addition. Die App ist fuer ein Kind gedacht und soll direkt in der ersten Ansicht nutzbar bleiben. Der Fokus liegt auf klarer Rechenlogik, verstaendlicher Bedienung und stabilem Fortschritt im Browser.

## Arbeitsprinzipien

- Halte Aenderungen eng am bestehenden Stil.
- Bewahre die Trennung zwischen UI und Domain-Logik.
- Packe Rechenregeln, Levelregeln und Fortschrittsregeln in `src/domain/`.
- Vermeide ein Backend, Authentifizierung oder externe Services, solange das nicht explizit verlangt wird.
- Speichere Fortschritt weiterhin lokal ueber `localStorage`, sofern der Produktplan nicht geaendert wird.
- Schreibe sichtbaren UI-Text auf Deutsch und kindgerecht.

## Wichtige Dateien

- `src/App.tsx`: React-Komponente, Interaktionen, Eingaben, Feedback, Reset-Dialog.
- `src/styles.css`: Visuelle Gestaltung der App.
- `src/domain/taskGenerator.ts`: Levelmodell und Aufgabengenerierung.
- `src/domain/columnChecker.ts`: Spaltenweise Ergebnispruefung und Uebertraege.
- `src/domain/progress.ts`: Fortschritt, Sterne, Serien, Badges, localStorage.
- `src/domain/types.ts`: Gemeinsame Typen.
- `src/**/*.test.ts` und `src/**/*.test.tsx`: Vitest-Tests.

## Kommandos

```sh
pnpm dev
pnpm test
pnpm build
pnpm preview
```

Nutze `pnpm test` fuer Logik- und UI-Aenderungen. Nutze `pnpm build`, wenn TypeScript-, Vite- oder Import-Aenderungen vorgenommen wurden.

## Teststrategie

- Neue oder geaenderte Rechenlogik braucht fokussierte Tests in `src/domain/`.
- Fortschrittsaenderungen sollten Badge-, Level-, Streak- und Tagesziel-Verhalten abdecken.
- UI-Aenderungen sollten mindestens bestehende Smoke-Tests weiter bestehen lassen.
- Zufall in Tests stabilisieren, z. B. ueber `vi.spyOn(Math, 'random')`.

## UI-Richtlinien

- Die App soll als Uebungswerkzeug starten, nicht als Landingpage.
- Bedienung per Ziffernblock und Spaltennavigation erhalten.
- Feedback kurz, direkt und ermutigend formulieren.
- Layouts fuer kleine Bildschirme pruefen, besonders Zahlenraster, Keypad und Modal.
- Icons aus `lucide-react` verwenden, wenn ein passendes Icon existiert.

## Domain-Regeln

- Aufgaben muessen zur jeweiligen Levelregel passen.
- Summen duerfen `MAX_SUM` nicht erreichen oder ueberschreiten.
- Spalten werden vom Einer nach links geprueft.
- Uebertraege duerfen nicht geraten oder hart codiert werden, sondern muessen aus den Summanden berechnet werden.
- Fallback-Aufgaben muessen gueltig und kindgerecht bleiben.

## Vor dem Abschluss

Pruefe nach Code-Aenderungen:

```sh
pnpm test
pnpm build
```

Wenn ein Kommando nicht ausgefuehrt wurde oder fehlschlaegt, dokumentiere das im Abschluss klar.
