## ADDED Requirements

### Requirement: Event list displays all dose events in a selectable table
The system SHALL render a Material table listing all 40 dose events chronologically. Each row SHALL show: date/time, medication name (controller or rescue), and technique score. Rows SHALL be colour-coded by score band using `MetricBadgeComponent` or row-level class. Clicking a row SHALL open the event detail drawer for that event.

#### Scenario: All dose events appear in the table
- **WHEN** the event list renders
- **THEN** 40 rows are visible (36 controller + 6 rescue, accounting for the dataset)

#### Scenario: Selecting a row opens the detail drawer
- **WHEN** the user clicks a row
- **THEN** the event detail side panel opens and displays the full technique breakdown for that event

### Requirement: Event detail panel shows per-metric technique breakdown
The system SHALL render a slide-out Material drawer (sidenav) containing:
1. An ECharts radar chart plotting all 5 technique metrics against their thresholds
2. A list of metric rows, each showing the metric name, raw value with unit, and a `MetricBadgeComponent` pill rated good/acceptable/poor via `TechniqueRatingPipe`

The drawer SHALL be closeable and SHALL emit a `closed` output event.

#### Scenario: Radar chart plots all 5 metrics
- **WHEN** an event is selected and the detail panel opens
- **THEN** the radar chart displays five axes: shake_duration, inspiratory_time, peak_inspiratory_flow_rate, device_orientation, and estimated_delivered_volume

#### Scenario: Metric badges reflect threshold ratings
- **WHEN** the event detail panel renders a metric row
- **THEN** each metric's badge uses `TechniqueRatingPipe` to determine its rating and applies the corresponding colour (green/amber/red)

#### Scenario: Panel close emits event
- **WHEN** the user clicks the close button on the event detail panel
- **THEN** the component emits a `closed` output event and the drawer is hidden

#### Scenario: Rescue events display poor ratings across all metrics
- **WHEN** a rescue inhaler event is selected
- **THEN** all or most metric badges display `poor` (reflecting technique scores 30–45)

### Requirement: MetricBadge component renders colour-coded rating pills
The system SHALL provide a `MetricBadgeComponent` in `shared/components/` that accepts a `rating` input of `'good' | 'acceptable' | 'poor'` and renders a pill styled green, amber, or red respectively.

#### Scenario: Good rating renders green pill
- **WHEN** `MetricBadgeComponent` receives `rating = 'good'`
- **THEN** the pill is rendered with a green colour style

#### Scenario: Poor rating renders red pill
- **WHEN** `MetricBadgeComponent` receives `rating = 'poor'`
- **THEN** the pill is rendered with a red colour style
