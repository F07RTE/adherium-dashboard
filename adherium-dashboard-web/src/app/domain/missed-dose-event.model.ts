export interface MissedDoseEvent {
  header: {
    id: string;
    schema_id: { namespace: string; name: string; version: string };
    creation_date_time: string;
  };
  body: {
    medication_id: string;
    effective_time_frame: { date_time: string };
    scheduled_time: string;
  };
}
