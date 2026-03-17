import { Patient } from './patient.model';
import { Medication } from './medication.model';
import { DoseEvent } from './dose-event.model';
import { MissedDoseEvent } from './missed-dose-event.model';
import { TechniqueThresholds } from './technique-thresholds.model';

export interface AdherenceData {
  patient: Patient;
  medications: Medication[];
  dose_events: DoseEvent[];
  missed_dose_events: MissedDoseEvent[];
  technique_thresholds: TechniqueThresholds;
}
