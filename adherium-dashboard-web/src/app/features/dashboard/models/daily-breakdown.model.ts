import { DoseEventRow } from './dose-event-row.model';

export interface DailyBreakdown {
  date: string;
  morningDose: DoseEventRow | null;
  eveningDose: DoseEventRow | null;
  rescueDoses: DoseEventRow[];
  missedEvening: boolean;
}
