## 1. Project Setup

- [x] 1.1 Add `ngx-echarts` and `echarts` to `package.json` and install
- [x] 1.2 Run `ng add @angular/material` to install Material and configure the theme
- [x] 1.3 Extract JSON from `adherencejson.rtf` and save as `src/assets/adherence-data.json`
- [x] 1.4 Register `src/assets/adherence-data.json` in `angular.json` assets array
- [x] 1.5 Add global Material theme tokens and base layout to `styles.css`
- [x] 1.6 Set up app shell in `app.html` — Material toolbar + empty page layout ready to receive components one by one

## 2. Foundation — Domain Models & Data Access

- [ ] 2.1 Create `src/app/domain/technique-thresholds.model.ts`
- [ ] 2.2 Create `src/app/domain/technique-telemetry.model.ts`
- [ ] 2.3 Create `src/app/domain/patient.model.ts`
- [ ] 2.4 Create `src/app/domain/medication.model.ts`
- [ ] 2.5 Create `src/app/domain/dose-event.model.ts`
- [ ] 2.6 Create `src/app/domain/missed-dose-event.model.ts`
- [ ] 2.7 Create `src/app/domain/adherence-data.model.ts` — root interface composing all models
- [ ] 2.8 Write test: `AdherenceDataSource.getData()` returns 40 dose events
- [ ] 2.9 Write test: `AdherenceDataSource.getData()` returns 4 missed dose events
- [ ] 2.10 Create `src/app/core/data-access/adherence.datasource.ts` — `getData(): Observable<AdherenceData>` via `HttpClient`
- [ ] 2.11 Provide `AdherenceDataSource` and `provideHttpClient()` in `app.config.ts`
- [ ] 2.12 Run `ng test` — data source tests pass ✓

## 3. Foundation — TechniqueRatingPipe & MetricBadge

- [ ] 3.1 Write test: `TechniqueRatingPipe` — shake_duration 3200ms → `'good'`
- [ ] 3.2 Write test: `TechniqueRatingPipe` — shake_duration 2500ms → `'acceptable'`
- [ ] 3.3 Write test: `TechniqueRatingPipe` — shake_duration 1500ms → `'poor'`
- [ ] 3.4 Write test: `TechniqueRatingPipe` — device_orientation 10 deg → `'good'` (inverted)
- [ ] 3.5 Write test: `TechniqueRatingPipe` — device_orientation 20 deg → `'acceptable'` (inverted)
- [ ] 3.6 Write test: `TechniqueRatingPipe` — device_orientation 40 deg → `'poor'` (inverted)
- [ ] 3.7 Create `src/app/shared/pipes/technique-rating.pipe.ts` — pure pipe with inverted logic for `device_orientation`
- [ ] 3.8 Create `src/app/shared/components/metric-badge/metric-badge.component.ts` — `@Input() rating` with green/amber/red styles
- [ ] 3.9 Run `ng test` — pipe tests pass ✓

## 4. Foundation — DashboardService & View Models

- [ ] 4.1 Create `features/dashboard/models/` — `adherence-summary.model.ts`, `daily-breakdown.model.ts`, `dose-event-row.model.ts`
- [ ] 4.2 Write test: `DashboardService` — adherence = 34/38 = 89.5%
- [ ] 4.3 Write test: `DashboardService` — morning avg technique score > evening avg
- [ ] 4.4 Write test: all rescue events have `scheduled_time: null`
- [ ] 4.5 Write test: all 4 missed events are 20:00 evening doses
- [ ] 4.6 Write test: all rescue events have technique score ≤ 45
- [ ] 4.7 Write test: every rescue event is on the same day or day after a missed or low-scoring (< 60) evening controller dose
- [ ] 4.8 Create `src/app/features/dashboard/services/dashboard.service.ts` — implement `getSummary()`, `getDailyBreakdown()`, `getDoseEvents()`
- [ ] 4.9 Run `ng test` — all service tests pass ✓

## 5. Component — Patient Header

- [ ] 5.1 Write test: `PatientHeaderComponent` renders patient initials and age
- [ ] 5.2 Write test: `PatientHeaderComponent` renders condition name
- [ ] 5.3 Create `src/app/features/dashboard/components/patient-header/` — displays initials, age, condition, medication type pills
- [ ] 5.4 Add `<app-patient-header>` to `app.html`
- [ ] 5.5 Run `ng serve` — patient header visible on screen ✓
- [ ] 5.6 Run `ng test` — patient header tests pass ✓

## 6. Component — Adherence Overview

- [ ] 6.1 Write test: `AdherenceOverviewComponent` displays adherence percentage KPI
- [ ] 6.2 Write test: `AdherenceOverviewComponent` displays rescue count KPI
- [ ] 6.3 Create `src/app/features/dashboard/components/adherence-overview/` — ECharts calendar heatmap + 3 KPI stat cards
- [ ] 6.4 Add `<app-adherence-overview>` to `app.html` below patient header
- [ ] 6.5 Run `ng serve` — calendar heatmap and KPI cards visible ✓
- [ ] 6.6 Run `ng test` — adherence overview tests pass ✓

## 7. Component — Technique Quality

- [ ] 7.1 Write test: `TechniqueQualityComponent` produces higher AM average than PM average from data
- [ ] 7.2 Write test: `TechniqueQualityComponent` marks rescue event days distinctly in chart data
- [ ] 7.3 Create `src/app/features/dashboard/components/technique-quality/` — ECharts grouped bar (AM vs PM) + score trend line with threshold bands and rescue markers
- [ ] 7.4 Add `<app-technique-quality>` to `app.html`
- [ ] 7.5 Run `ng serve` — grouped bar and trend line visible, morning/evening gap apparent ✓
- [ ] 7.6 Run `ng test` — technique quality tests pass ✓

## 8. Component — Event List

- [ ] 8.1 Write test: `EventListComponent` renders 40 rows
- [ ] 8.2 Write test: `EventListComponent` emits selected event when a row is clicked
- [ ] 8.3 Create `src/app/features/dashboard/components/event-list/` — Material table, rows colour-coded by score band, click emits selected `DoseEventRow`
- [ ] 8.4 Add `<app-event-list>` to `app.html`
- [ ] 8.5 Run `ng serve` — event table visible, rows clickable ✓
- [ ] 8.6 Run `ng test` — event list tests pass ✓

## 9. Component — Event Detail Panel

- [ ] 9.1 Write test: `EventDetailPanelComponent` emits `closed` output when close button is clicked
- [ ] 9.2 Write test: `EventDetailPanelComponent` renders a metric row for each of the 5 telemetry metrics
- [ ] 9.3 Create `src/app/features/dashboard/components/event-detail-panel/` — Material drawer, ECharts radar, metric rows with `MetricBadgeComponent`, close button
- [ ] 9.4 Connect `EventListComponent` row click to open `EventDetailPanelComponent` in `app.html`
- [ ] 9.5 Run `ng serve` — clicking a row opens drawer with radar + metric breakdown ✓
- [ ] 9.6 Run `ng test` — event detail tests pass ✓

## 10. Final Verification

- [ ] 10.1 Run `ng test` — all 13 tests pass with no failures ✓
- [ ] 10.2 Run `ng build` — production build compiles with no errors ✓
- [ ] 10.3 Run `ng serve` — visual review: all three sections render, morning/evening gap visible, rescue events annotated, detail drawer opens and closes correctly ✓
