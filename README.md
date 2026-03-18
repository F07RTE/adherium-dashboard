# Setup Instructions

## Prerequisites

- [Node.js](https://nodejs.org/) v24+ with npm 11+
- [Angular CLI](https://angular.dev/tools/cli) v21: `npm install -g @angular/cli`

## Web Dashboard

```bash
# Install dependencies
cd adherium-dashboard-web
npm install

# Start the development server (http://localhost:4200)
npm start

# Run tests
npm test

# Production build
npm run build
```

# Decisions and Trade-Offs

**Charting library — ECharts:** I chose ECharts after researching the available libraries. It had the most options suited to clinical and medical data, and it was also the most commonly used library in medical applications based on my research.

**Folder structure — feature slice architecture:** Each feature (e.g. the dashboard) contains its own related files — models, services, and components. Shared utilities live in a `shared` folder, and the `domain` folder holds models that are common across features (I intentionally avoided naming it `models` at the root level to distinguish it from feature-level view models). The `core` folder holds app-wide services such as data access and, in the future, authentication.

**What I would change with more time:** I would introduce an `infra` folder for data access and other infrastructure concerns. Remove the `core` folder. I would rename `features` to `pages`, and place view models inside each page folder to better separate them from domain models. I would also split inline HTML templates and styles into their own files, and consolidate styles into a shared global stylesheet.
I would add a quick section where the user can see the standard technique thresholds values as well.


# AI tool usage

I used OpenSpec with Copilot (Claude Sonnet 4.6 model).

I initialized OpenSpec on the repo and started to bring as much context as possible, sharing my ideas on how to implement the solution. I also asked questions and had the model generate a questionnaire to help shape the plan. From there, I refined the plan applying best practices such as TDD, clean code, clean architecture, folder structure, and task splitting. I didn't see the need for design patterns at this stage, but they would definitely be considered in the next steps.

I then implemented the plan in groups, testing manually and improving as needed.

The changes I had to make were minor — adjusting sizes, removing or repositioning elements. I made sure to review both the tests and the implementation throughout.

This process allowed me to learn the requirements and implement at the same time. Most of the code was AI-written.

OpenSpec enables really effective planning. I spent roughly half the time planning and half implementing.

# API Design

## Endpoints

### GET /api/patients/{patientId}/adherence

Returns all clinical data for a given patient, filtered by date range.

Response body object
```csharp
// --- Response ---
public record PatientAdherenceResponse(
    Patient Patient,
    List<Medication> Medications,
    List<DoseEvent> DoseEvents,
    List<MissedDoseEvent> MissedDoseEvents
);

// --- Patient ---
public record Patient(string ExternalId, PatientDemographics Demographics, PatientCondition Condition);
public record PatientDemographics(string Initials, MeasuredValue Age);
public record PatientCondition(string Name, PatientCode Code);
public record PatientCode(string System, string Value, string Display);

// --- Medication ---
public record Medication(MedicationHeader Header, MedicationBody Body);
public record MedicationHeader(SchemaId SchemaId);
public record MedicationBody(
    string MedicationId,
    string MedicationName,
    MedicationCode MedicationCode,
    string Route,
    MeasuredValue Strength,
    MedicationType MedicationType
);
public enum MedicationType { Controller, Rescue }
public record MedicationCode(string System, string Value, string Display);

// --- Dose Event ---
public record DoseEvent(DoseEventHeader Header, DoseEventBody Body);
public record DoseEventHeader(
    string Id,
    SchemaId SchemaId,
    DateTime CreationDateTime,
    AcquisitionProvenance AcquisitionProvenance
);
public record AcquisitionProvenance(string SourceName, string Modality);
public record DoseEventBody(
    string MedicationId,
    EffectiveTimeFrame EffectiveTimeFrame,
    DateTime? ScheduledTime,
    [property: JsonPropertyName("adherium:inhaler_technique_telemetry")]
    InhalerTechniqueTelemetry InhalerTechniqueTelemetry
);
public record InhalerTechniqueTelemetry(
    MeasuredValue ShakeDuration,
    MeasuredValue InspiratoryTime,
    MeasuredValue PeakInspiratoryFlowRate,
    MeasuredValue DeviceOrientation,
    MeasuredValue EstimatedDeliveredVolume,
    double TechniqueScore
);

// --- Missed Dose Event ---
public record MissedDoseEventHeader(string Id, SchemaId SchemaId, DateTime CreationDateTime);
public record MissedDoseEventBody(string MedicationId, EffectiveTimeFrame EffectiveTimeFrame, DateTime ScheduledTime);
public record MissedDoseEvent(MissedDoseEventHeader Header, MissedDoseEventBody Body);

// --- Shared ---
public record SchemaId(string Namespace, string Name, string Version);
public record MeasuredValue(double Value, string Unit);
public record EffectiveTimeFrame(DateTime DateTime);
```


**Query parameters:**
- `patientId` — required, path parameter
- `from` — ISO 8601 date (e.g. `2025-01-01`); defaults to 19 days before today
- `to` — ISO 8601 date; defaults to today

**Response payload:**
- Patient demographics and condition
- All medications for the patient
- Medication schedules
- Dose events (taken) within the date range
- Missed dose events within the date range

**Notes:**
- Filtering is applied server-side.
- The default 19-day window matches the initial dashboard view.
- The user can adjust the date range to paginate through historical data.
- All medications are returned together — the frontend decides how to present them (e.g. one chart per medication, or combined).

---

### GET /api/technique-thresholds

Returns the reference threshold definitions (good / acceptable bands) for all inhaler technique metrics.

Response body object
```csharp
public record TechniqueThresholds(
    MetricThreshold ShakeDuration,
    MetricThreshold InspiratoryTime,
    MetricThreshold PeakInspiratoryFlowRate,
    MetricThreshold DeviceOrientation,
    MetricThreshold EstimatedDeliveredVolume
);

public record MetricThreshold(
    ThresholdBand Good,
    ThresholdBand Acceptable,
    string Description
);

public record ThresholdBand(double Value, string Unit);
```

**Notes:**
- This data is not patient-specific and changes infrequently — safe to cache aggressively on both client and server.
- Keeping it separate avoids repeating this static payload in every adherence response.

---

## Authentication

- **Standard:** OAuth 2.0 with SMART on FHIR scopes
- **Token format:** JWT (RS256)
- **Token lifetime:** Short-lived access tokens (15–60 min) with refresh tokens
- **Audit logging:** Every request to patient-scoped endpoints should log `userId`, `patientId`, and timestamp

# What I Would Do Next

Ensure the foundation is solid for both the API and the web dashboard before adding new features.

### Business
- [ ] Review the current UI dashboard with the business stakeholders

### DevOps
- [ ] CI/CD pipeline for Angular and API
- [ ] Deployment configurations
- [ ] Code analysis for the API (e.g. ReSharper / SonarQube for C#)
- [ ] Commit message convention enforcement
- [ ] Merge request rules and branch protections

### API
- [ ] Code analysis tooling
- [ ] Health check endpoint (`GET /api/health`)
- [ ] Database migrations setup (if applicable)
- [ ] Error handling
- [ ] Authentication / Authorization (OAuth 2.0 + SMART on FHIR)
- [ ] Implement `GET /api/technique-thresholds`
- [ ] Implement `GET /api/patients/{patientId}/adherence`

### Web Dashboard
- [ ] Review strucure
- [ ] Refactor service to call the API
- [ ] Ascessibility features
- [ ] Authentication / Authorization 
- [ ] Define design and color theme/font
- [ ] technique-thresholds label for comparison
- [ ] Medicine filter 
- [ ] Thresholds filter on the screen
