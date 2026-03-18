export interface MedicationCode {
  system: string;
  value: string;
  display: string;
}

export interface MedicationBody {
  medication_id: string;
  medication_name: string;
  medication_code: MedicationCode;
  route: string;
  strength: { value: number; unit: string };
  medication_type: 'controller' | 'rescue';
}

export interface Medication {
  header: {
    schema_id: { namespace: string; name: string; version: string };
  };
  body: MedicationBody;
}
