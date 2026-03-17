## ADDED Requirements

### Requirement: Pipe classifies metric values against OMH thresholds
The system SHALL provide a `TechniqueRatingPipe` (pure pipe) in `shared/pipes/` that accepts a numeric value and a metric name, and returns `'good'`, `'acceptable'`, or `'poor'` by comparing against the `technique_thresholds` from the data. Values at or above the `good` threshold SHALL return `'good'`; values at or above the `acceptable` threshold SHALL return `'acceptable'`; values below SHALL return `'poor'`.

#### Scenario: shake_duration rated good
- **WHEN** the metric is `shake_duration` and the value is 3200ms
- **THEN** the pipe returns `'good'` (threshold: ≥ 3000ms)

#### Scenario: shake_duration rated acceptable
- **WHEN** the metric is `shake_duration` and the value is 2500ms
- **THEN** the pipe returns `'acceptable'` (threshold: ≥ 2000ms)

#### Scenario: shake_duration rated poor
- **WHEN** the metric is `shake_duration` and the value is 1500ms
- **THEN** the pipe returns `'poor'` (threshold: < 2000ms)

### Requirement: Pipe applies inverted logic for device_orientation
For the `device_orientation` metric, lower values indicate better technique. The system SHALL apply inverted threshold comparison: values at or below the `good` threshold SHALL return `'good'`; values at or below the `acceptable` threshold SHALL return `'acceptable'`; values above SHALL return `'poor'`.

#### Scenario: device_orientation rated good
- **WHEN** the metric is `device_orientation` and the value is 10 degrees
- **THEN** the pipe returns `'good'` (threshold: ≤ 15 deg)

#### Scenario: device_orientation rated acceptable
- **WHEN** the metric is `device_orientation` and the value is 20 degrees
- **THEN** the pipe returns `'acceptable'` (threshold: ≤ 30 deg)

#### Scenario: device_orientation rated poor
- **WHEN** the metric is `device_orientation` and the value is 40 degrees
- **THEN** the pipe returns `'poor'` (threshold: > 30 deg)
