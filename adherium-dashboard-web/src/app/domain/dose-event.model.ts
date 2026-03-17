import { InhalerTechniqueTelemetry } from './technique-telemetry.model';

export interface DoseEventHeader {
  id: string;
  schema_id: { namespace: string; name: string; version: string };
  creation_date_time: string;
  acquisition_provenance: { source_name: string; modality: string };
}

export interface DoseEventBody {
  medication_id: string;
  effective_time_frame: { date_time: string };
  scheduled_time: string | null;
  'adherium:inhaler_technique_telemetry': InhalerTechniqueTelemetry;
}

export interface DoseEvent {
  header: DoseEventHeader;
  body: DoseEventBody;
}
