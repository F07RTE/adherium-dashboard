import { InhalerTechniqueTelemetry } from '../../../domain/technique-telemetry.model';

export interface DoseEventRow {
  id: string;
  dateTime: string;
  medicationType: 'controller' | 'rescue';
  scheduledTime: string | null;
  techniqueScore: number;
  telemetry: InhalerTechniqueTelemetry;
}
