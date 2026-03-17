import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AdherenceDataSource } from '../../../core/data-access/adherence.datasource';
import { AdherenceData } from '../../../domain/adherence-data.model';
import { DoseEvent } from '../../../domain/dose-event.model';
import { AdherenceSummary } from '../models/adherence-summary.model';
import { DailyBreakdown } from '../models/daily-breakdown.model';
import { DoseEventRow } from '../models/dose-event-row.model';

function avg(values: number[]): number {
  if (!values.length) return 0;
  return Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 100) / 100;
}

function toDateStr(isoDateTime: string): string {
  return isoDateTime.substring(0, 10);
}

function toDoseEventRow(event: DoseEvent, medicationType: 'controller' | 'rescue'): DoseEventRow {
  const telemetry = event.body['adherium:inhaler_technique_telemetry'];
  return {
    id: event.header.id,
    dateTime: event.body.effective_time_frame.date_time,
    medicationType,
    scheduledTime: event.body.scheduled_time,
    techniqueScore: telemetry.technique_score,
    telemetry,
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly datasource: AdherenceDataSource) {}

  getSummary(): Observable<AdherenceSummary> {
    return this.datasource.getData().pipe(map(data => this.computeSummary(data)));
  }

  getDoseEvents(): Observable<DoseEventRow[]> {
    return this.datasource.getData().pipe(
      map(data =>
        data.dose_events.map(e => {
          const type = e.body.medication_id === 'MED-001' ? 'controller' : 'rescue';
          return toDoseEventRow(e, type);
        }),
      ),
    );
  }

  getDailyBreakdown(): Observable<DailyBreakdown[]> {
    return this.datasource.getData().pipe(map(data => this.computeDailyBreakdown(data)));
  }

  private computeSummary(data: AdherenceData): AdherenceSummary {
    const controller = data.dose_events.filter(e => e.body.medication_id === 'MED-001');
    const rescue = data.dose_events.filter(e => e.body.medication_id !== 'MED-001');
    const scheduled = controller.length + data.missed_dose_events.length;

    const scoresByTime = (time: string) =>
      controller
        .filter(e => e.body.scheduled_time === time)
        .map(e => e.body['adherium:inhaler_technique_telemetry'].technique_score);

    return {
      adherencePct: Math.round((controller.length / scheduled) * 1000) / 10,
      controllerTaken: controller.length,
      controllerScheduled: scheduled,
      missedCount: data.missed_dose_events.length,
      rescueCount: rescue.length,
      morningAvgScore: avg(scoresByTime('08:00')),
      eveningAvgScore: avg(scoresByTime('20:00')),
    };
  }

  private computeDailyBreakdown(data: AdherenceData): DailyBreakdown[] {
    const days = new Map<string, DailyBreakdown>();

    const getOrCreate = (date: string): DailyBreakdown => {
      if (!days.has(date)) {
        days.set(date, { date, morningDose: null, eveningDose: null, rescueDoses: [], missedEvening: false });
      }
      return days.get(date)!;
    };

    for (const event of data.dose_events) {
      const date = toDateStr(event.body.effective_time_frame.date_time);
      const isController = event.body.medication_id === 'MED-001';
      const row = toDoseEventRow(event, isController ? 'controller' : 'rescue');
      const day = getOrCreate(date);

      if (!isController) {
        day.rescueDoses.push(row);
      } else if (event.body.scheduled_time === '08:00') {
        day.morningDose = row;
      } else {
        day.eveningDose = row;
      }
    }

    for (const missed of data.missed_dose_events) {
      const date = toDateStr(missed.body.effective_time_frame.date_time);
      getOrCreate(date).missedEvening = true;
    }

    return Array.from(days.values()).sort((a, b) => a.date.localeCompare(b.date));
  }
}
