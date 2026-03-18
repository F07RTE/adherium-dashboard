## Context

The Angular app currently has a blank shell (`app.html` renders only the app title). There is no existing data layer, UI component library, or charting infrastructure in the project. The source data is a static JSON file derived from an RTF attachment containing 19 days of simulated patient adherence data following the Open mHealth (OMH) schema with Adherium-specific `inhaler_technique_telemetry` extensions.

The intended runtime consumer is a clinician who needs to assess at a glance whether a patient is adhering to their controller inhaler schedule, whether their technique is improving or degrading, and what happened in any individual dose event.

A future version of the app will serve data from an HTTP API rather than a static asset.

## Goals / Non-Goals

**Goals:**
- Single-page, clinically readable dashboard for one patient
- Data access layer abstracted behind an interface so the JSON impl can be swapped for HTTP with zero component changes
- Feature-scoped vertical slice architecture ready to host a future `patients/` screen without cross-feature pollution
- 13 TDD tests covering data loading, pipe logic, adherence computation, and detected clinical patterns
- Charts appropriate for the data shapes: calendar heatmap (adherence), grouped bar + line (technique trends), radar (per-event metric breakdown)

**Non-Goals:**
- Multi-patient support (out of scope for this change)
- Authentication or access control
- Real-time or push data updates
- Backend API implementation
- Offline support or PWA

## Decisions

### D1: ngx-echarts over ng2-charts

**Decision**: Use Apache ECharts via `ngx-echarts`.

**Rationale**: The adherence overview requires a calendar heatmap, which ng2-charts (Chart.js) does not support natively. ECharts also ships a direct radar chart used in the event detail panel. Both chart types are first-class ECharts primitives — no workarounds or third-party plugins needed.

**Alternative considered**: ng2-charts — adequate for the line/bar charts but would require an additional library (chartjs-chart-matrix) for the calendar heatmap, adding unnecessary complexity.

### D2: Vertical slice architecture with shared domain layer

**Decision**: Feature-scoped services and models under `features/dashboard/`, pure TS domain models in `domain/`, and a thin data-access interface in `core/data-access/`.

**Rationale**: A future `patients/` screen must not import from `dashboard/` — cross-feature imports are an anti-pattern. Domain models (Patient, DoseEvent, etc.) are shared across features so they live above the feature layer. Feature services hold aggregation logic specific to their screen.

**Alternative considered**: All models in `core/models/` — works today but conflates domain types with feature-specific view models as the app grows.

### D3: HttpClient-compatible data source from day one

**Decision**: `AdherenceDataSource` uses `HttpClient` with Angular's `assets/` URL even for the static JSON file, returning `Observable<AdherenceData>`.

**Rationale**: Swapping to a real API requires only changing the URL string (and base URL config). Components and services are never touched. Using `Observable` (not `Promise`) keeps the pattern consistent with Angular's reactive conventions.

**Alternative considered**: Load the JSON via `import` — simpler but synchronous and not swappable without component changes.

### D4: TechniqueRatingPipe handles inverted orientation threshold

**Decision**: The pipe accepts a `metric` parameter and applies inverted comparison logic specifically for `device_orientation` (lower = better vs all other metrics being higher = better).

**Rationale**: This is a domain rule encoded in the OMH threshold data (`_note` field). Inlining this logic in the pipe keeps components free of threshold comparison details and makes it testable in isolation.

### D5: Angular Material for UI shell, no custom design system

**Decision**: Use `@angular/material` for layout, table, drawer, toolbar, and badge components.

**Rationale**: Material is already the declared choice, is well-tested and accessible, and gets the shell production-ready without custom CSS investment.

## Risks / Trade-offs

- **[Risk] ECharts bundle size (~1MB)** → Mitigation: Use ECharts lazy module loading via `ngx-echarts` `ECHARTS_CONFIG` with `echarts: () => import('echarts')` to code-split.
- **[Risk] Static JSON loaded via HttpClient fails in some test environments** → Mitigation: `AdherenceDataSource` is injected via a token; tests provide a mock returning known data directly.
- **[Risk] OMH schema has nested `header`/`body` wrappers** → Mitigation: Domain models mirror the schema exactly; `DashboardService` maps to flat view models so components never navigate nested structures.

## Migration Plan

1. Install `@angular/material` and run `ng add @angular/material` to configure the theme
2. Install `ngx-echarts` and `echarts` as a peer dependency
3. Copy JSON data from `adherencejson.rtf` into `src/assets/adherence-data.json`
4. Register the asset path in `angular.json`
5. Implement domain models, data source, service, shared components
6. Wire dashboard feature components into `app.html`

Rollback: all new code is additive — reverting the `app.html` wiring returns the app to the blank title state.

## Open Questions

- None outstanding. All decisions have been confirmed with the team.
