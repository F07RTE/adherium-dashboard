## ADDED Requirements

### Requirement: Data source loads adherence data as an observable
The system SHALL provide an `AdherenceDataSource` class in `core/data-access/` that exposes a `getData(): Observable<AdherenceData>` method. The implementation SHALL load data from `assets/adherence-data.json` via `HttpClient`. The interface SHALL be injectable and replaceable by a mock or HTTP implementation without changes to consumers.

#### Scenario: Successful data load returns dose events
- **WHEN** `getData()` is called
- **THEN** the observable emits an `AdherenceData` object containing exactly 40 dose events

#### Scenario: Successful data load returns missed dose events
- **WHEN** `getData()` is called
- **THEN** the observable emits an `AdherenceData` object containing exactly 4 missed dose events

#### Scenario: Data source is injectable and mockable in tests
- **WHEN** a component or service under test provides a mock `AdherenceDataSource`
- **THEN** the mock is used in place of the real implementation without modifying any component code

### Requirement: Domain models mirror the OMH schema structure
The system SHALL define TypeScript interfaces in `domain/` that exactly represent the OMH-structured JSON:  `AdherenceData`, `Patient`, `Medication`, `DoseEvent`, `MissedDoseEvent`, `InhalerTechniqueTelemetry`, and `TechniqueThresholds`. These models SHALL have no Angular dependencies.

#### Scenario: Dose event telemetry fields are strongly typed
- **WHEN** a `DoseEvent` is read from the data source
- **THEN** its `adherium:inhaler_technique_telemetry` fields (shake_duration, inspiratory_time, peak_inspiratory_flow_rate, device_orientation, estimated_delivered_volume, technique_score) are accessible as typed properties
