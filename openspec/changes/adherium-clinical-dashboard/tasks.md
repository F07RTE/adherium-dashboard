## 1. Project Setup

- [x] 1.1 Add `ngx-echarts` and `echarts` to `package.json` and install
- [x] 1.2 Run `ng add @angular/material` to install Material and configure the theme
- [x] 1.3 Extract JSON from `adherencejson.rtf` and save as `src/assets/adherence-data.json`
- [x] 1.4 Register `src/assets/adherence-data.json` in `angular.json` assets array
- [x] 1.5 Add global Material theme tokens and base layout to `styles.css`
- [x] 1.6 Set up app shell in `app.html` — Material toolbar + empty page layout ready to receive components one by one

## 2. Foundation — Domain Models & Data Access

- [x] 2.1 Create `src/app/domain/technique-thresholds.model.ts`
- [x] 2.2 Create `src/app/domain/technique-telemetry.model.ts`
- [x] 2.3 Create `src/app/domain/patient.model.ts`
- [x] 2.4 Create `src/app/domain/medication.model.ts`
- [x] 2.5 Create `src/app/domain/dose-event.model.ts`
- [x] 2.6 Create `src/app/domain/missed-dose-event.model.ts`
- [x] 2.7 Create `src/app/domain/adherence-data.model.ts` — root interface composing all models
- [x] 2.8 Write test: `AdherenceDataSource.getData()` returns 40 dose events
- [x] 2.9 Write test: `AdherenceDataSource.getData()` returns 4 missed dose events
- [x] 2.10 Create `src/app/core/data-access/adherence.datasource.ts` — `getData(): Observable<AdherenceData>` via `HttpClient`
- [x] 2.11 Provide `AdherenceDataSource` and `provideHttpClient()` in `app.config.ts`
- [x] 2.12 Run `ng test` — data source tests pass ✓

## 3. Foundation — TechniqueRatingPipe & MetricBadge

- [x] 3.1 Write test: `TechniqueRatingPipe` — shake_duration 3200ms → `'good'`
- [x] 3.2 Write test: `TechniqueRatingPipe` — shake_duration 2500ms → `'acceptable'`
- [x] 3.3 Write test: `TechniqueRatingPipe` — shake_duration 1500ms → `'poor'`
- [x] 3.4 Write test: `TechniqueRatingPipe` — device_orientation 10 deg → `'good'` (inverted)
- [x] 3.5 Write test: `TechniqueRatingPipe` — device_orientation 20 deg → `'acceptable'` (inverted)
- [x] 3.6 Write test: `TechniqueRatingPipe` — device_orientation 40 deg → `'poor'` (inverted)
- [x] 3.7 Create `src/app/shared/pipes/technique-rating.pipe.ts` — pure pipe with inverted logic for `device_orientation`
- [x] 3.8 Create `src/app/shared/components/metric-badge/metric-badge.component.ts` — `@Input() rating` with green/amber/red styles
- [x] 3.9 Run `ng test` — pipe tests pass ✓

## 4. Foundation — DashboardService & View Models

- [x] 4.1 Create `features/dashboard/models/` — `adherence-summary.model.ts`, `daily-breakdown.model.ts`, `dose-event-row.model.ts`
- [x] 4.2 Write test: `DashboardService` — adherence = 34/38 = 89.5%
- [x] 4.3 Write test: `DashboardService` — morning avg technique score > evening avg
- [x] 4.4 Write test: all rescue events have `scheduled_time: null`
- [x] 4.5 Write test: all 4 missed events are 20:00 evening doses
- [x] 4.6 Write test: all rescue events have technique score ≤ 45
- [x] 4.7 Write test: every rescue event is on the same day or day after a missed or low-scoring (< 70) evening controller dose
- [x] 4.8 Create `src/app/features/dashboard/services/dashboard.service.ts` — implement `getSummary()`, `getDailyBreakdown()`, `getDoseEvents()`
- [x] 4.9 Run `ng test` — all service tests pass ✓

## 5. Component — Patient Header

- [x] 5.1 Write test: `PatientHeaderComponent` renders patient initials and age
- [x] 5.2 Write test: `PatientHeaderComponent` renders condition name
- [x] 5.3 Create `src/app/features/dashboard/components/patient-header/` — displays initials, age, condition, medication type pills
- [x] 5.4 Add `<app-patient-header>` to `app.html`
- [x] 5.5 Run `ng serve` — patient header visible on screen ✓
- [x] 5.6 Run `ng test` — patient header tests pass ✓

## 6. Component — Adherence Overview

- [x] 6.1 Write test: `AdherenceOverviewComponent` displays adherence percentage KPI
- [x] 6.2 Write test: `AdherenceOverviewComponent` displays rescue count KPI
- [x] 6.3 Create `src/app/features/dashboard/components/adherence-overview/` — ECharts calendar heatmap + 3 KPI stat cards
- [x] 6.4 Add `<app-adherence-overview>` to `app.html` below patient header
- [x] 6.5 Run `ng serve` — calendar heatmap and KPI cards visible ✓
- [x] 6.6 Run `ng test` — adherence overview tests pass ✓

## 7. Component — Technique Quality

- [x] 7.1 Write test: `TechniqueQualityComponent` produces higher AM average than PM average from data
- [x] 7.2 Write test: `TechniqueQualityComponent` marks rescue event days distinctly in chart data
- [x] 7.3 Create `src/app/features/dashboard/components/technique-quality/` — ECharts grouped bar (AM vs PM) + score trend line with threshold bands and rescue markers
- [x] 7.4 Add `<app-technique-quality>` to `app.html`
- [x] 7.5 Run `ng serve` — grouped bar and trend line visible, morning/evening gap apparent ✓
- [x] 7.6 Run `ng test` — technique quality tests pass ✓

## 8. Component — Event List

- [x] 8.1 Write test: `EventListComponent` renders 40 rows
- [x] 8.2 Write test: `EventListComponent` emits selected event when a row is clicked
- [x] 8.3 Create `src/app/features/dashboard/components/event-list/` — Material table, rows colour-coded by score band, click emits selected `DoseEventRow`
- [x] 8.4 Add `<app-event-list>` to `app.html`
- [x] 8.5 Run `ng serve` — event table visible, rows clickable ✓
- [x] 8.6 Run `ng test` — event list tests pass ✓

## 9. Component — Event Detail Panel

- [x] 9.1 Write test: `EventDetailPanelComponent` emits `closed` output when close button is clicked
- [x] 9.2 Write test: `EventDetailPanelComponent` renders a metric row for each of the 5 telemetry metrics
- [x] 9.3 Create `src/app/features/dashboard/components/event-detail-panel/` — Material drawer, ECharts radar, metric rows with `MetricBadgeComponent`, close button
- [x] 9.4 Connect `EventListComponent` row click to open `EventDetailPanelComponent` in `app.html`
- [x] 9.5 Run `ng serve` — clicking a row opens drawer with radar + metric breakdown ✓
- [x] 9.6 Run `ng test` — event detail tests pass ✓

## 10. Final Verification

- [x] 10.1 Run `ng test` — all 27 tests pass with no failures ✓
- [x] 10.2 Run `ng build` — production build compiles with no errors ✓
- [ ] 10.3 Run `ng serve` — visual review: all three sections render, morning/evening gap visible, rescue events annotated, detail drawer opens and closes correctly ✓
