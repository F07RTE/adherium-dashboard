## ADDED Requirements

### Requirement: Adherence overview displays KPI summary cards
The system SHALL display three KPI stat cards above the calendar heatmap:
1. **Overall adherence %**: taken scheduled doses / total scheduled doses × 100, rounded to one decimal place
2. **Average technique score**: mean `technique_score` across all dose events
3. **Rescue inhaler uses**: count of MED-002 dose events

#### Scenario: Adherence percentage is computed correctly
- **WHEN** the dashboard loads with 34 taken out of 38 scheduled doses
- **THEN** the adherence KPI card displays `89.5%`

#### Scenario: Rescue count reflects all PRN events
- **WHEN** the dashboard loads
- **THEN** the rescue KPI card displays the count of all dose events where `medication_id` is `MED-002`

### Requirement: Adherence calendar heatmap shows 19-day trend
The system SHALL render an ECharts calendar heatmap covering the full data date range. Each day cell SHALL be colour-coded:
- **Green**: all scheduled doses taken
- **Amber**: at least one scheduled dose missed
- **Red**: all scheduled doses missed
- **Blue marker**: rescue inhaler used that day (overlaid or adjacent)

A clinician scanning the chart SHALL immediately identify whether the pattern is improving or worsening over time.

#### Scenario: Missed dose days are visually distinct
- **WHEN** a day has one or more missed controller doses
- **THEN** that day's cell is rendered in amber or red (not green)

#### Scenario: Rescue use is surfaced on the calendar
- **WHEN** a day includes a MED-002 dose event
- **THEN** the calendar indicates rescue use for that day

### Requirement: Dashboard service computes adherence metrics
The `DashboardService` SHALL derive all KPI values from the raw `AdherenceData` returned by `AdherenceDataSource`. It SHALL NOT perform any data formatting in components.

#### Scenario: Morning average technique score exceeds evening average
- **WHEN** `DashboardService` computes morning vs evening averages from the dataset
- **THEN** the morning average is higher than the evening average (reflecting the deliberate data pattern)
