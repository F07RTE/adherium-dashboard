## Why

Clinicians managing asthma patients currently have no at-a-glance view of inhaler adherence or technique quality over time. The Hailie sensor produces rich telemetry per dose event that today goes unanalysed. An Angular dashboard that surfaces adherence trends, morning/evening technique patterns, and per-event technique detail gives clinicians the insight needed to intervene early and effectively.

## What Changes

- Introduce a single-page clinical dashboard as the main entry point of the Angular app
- Build a data access layer that loads patient adherence data from a static JSON asset (structured to swap cleanly for a future HTTP API)
- Introduce typed domain models aligned to the Open mHealth (OMH) schema and Adherium telemetry extensions
- Surface three key clinical views:
  - **Adherence overview**: 19-day calendar heatmap + KPI cards (adherence %, avg technique score, rescue count)
  - **Technique quality**: grouped bar chart (morning vs evening scores per day) + score trend line with threshold band overlay
  - **Event detail**: slide-out drawer per dose showing per-metric good/acceptable/poor breakdown with ECharts radar
- Add `TechniqueRatingPipe` to classify any metric value against OMH-provided thresholds (including inverted orientation logic)
- Add `MetricBadgeComponent` for colour-coded good/acceptable/poor pills reusable across the app
- Structure the app using vertical slice architecture (feature-scoped services and models) with a shared domain layer, ready for a future patient-list screen

## Capabilities

### New Capabilities

- `adherence-overview`: Calendar heatmap and KPI summary cards showing the patient's 19-day adherence trend
- `technique-quality`: Grouped bar and line charts surfacing morning vs evening technique patterns and score trends over time
- `event-detail`: Slide-out drawer with per-metric radar chart and threshold-rated breakdown for any selected dose event
- `technique-rating`: Pipe and shared logic to classify technique metric values as good, acceptable, or poor using OMH threshold data (handles inverted orientation metric)
- `adherence-data-access`: Core data source interface + JSON implementation that returns `Observable<AdherenceData>`, designed for a future HTTP swap

### Modified Capabilities

## Impact

- **New files**: `src/app/domain/` models, `src/app/core/data-access/`, `src/app/features/dashboard/` (components, models, services), `src/app/shared/`
- **Modified files**: `app.html`, `app.ts` (shell wiring), `styles.css` (Material theme tokens), `angular.json` (JSON asset registration)
- **New dependencies**: `ngx-echarts`, `echarts`, `@angular/material`, `@angular/cdk`
- **Test suite**: 13 Jasmine/Karma tests covering data loading, pipe logic, adherence calculation, pattern detection, and component event emission
- **No breaking changes** to existing files beyond the app shell
