## ADDED Requirements

### Requirement: Grouped bar chart shows morning vs evening technique scores per day
The system SHALL render an ECharts grouped bar chart with one bar pair per day. The AM bar SHALL represent the technique score for the morning controller dose; the PM bar SHALL represent the evening controller dose. Days with a missed dose SHALL show the bar as absent or at zero with a visual indicator.

A clinician SHALL immediately see that morning scores are consistently higher than evening scores.

#### Scenario: Morning bars are consistently taller than evening bars
- **WHEN** the technique quality chart renders
- **THEN** the AM series data points are on average higher than the PM series data points across the 19-day range

#### Scenario: Missed evening doses are distinguishable
- **WHEN** a day has a missed evening dose (4 occurrences in the dataset)
- **THEN** the PM bar for that day is absent or rendered as a zero/striped bar with a distinct visual style

### Requirement: Score trend line overlays threshold bands
The system SHALL render an ECharts line chart showing `technique_score` over time for all controller dose events, with reference bands indicating the good (≥ 80) and acceptable (≥ 60) thresholds.

#### Scenario: Threshold bands are visible on the trend chart
- **WHEN** the trend chart renders
- **THEN** horizontal reference lines or shaded bands at scores 80 and 60 are visible

### Requirement: Rescue events are annotated on the technique charts
The system SHALL visually distinguish rescue inhaler events on the technique quality section — for example, as scatter markers or vertical rule lines — so the clinician can correlate rescue use with low-scoring controller events.

#### Scenario: Rescue events follow poor or missed evening controller doses
- **WHEN** the technique quality chart is rendered
- **THEN** rescue event markers appear on the same day or the day after a missed or low-scoring (< 60) evening controller dose

#### Scenario: All rescue events fall in the poor technique band
- **WHEN** rescue event technique scores are plotted
- **THEN** all 6 rescue events have a technique score ≤ 45 and fall below the acceptable threshold band
